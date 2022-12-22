require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm')

const app = express();
const appDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get('/ping', (req, res) => {
  res.json({ messgae: 'pong' });
})

/*
[TEST]
각 브랜치에 맞는 API를 현재 주석의 밑, 34번 라인부터 작성해주세요.
feature/signin 브랜치의 경우 app.post('/users/signin', ...)
feature/signup 브랜치의 경우 app.post('/users/signup', ...)
*/
app.post('/users/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await appDataSource.query(`
    SELECT
      users.id
      users.password
    FROM
      users
    WHERE
      users.email = ?
  `, [email]);
  
  if (!user) {
    return res.json({message: "SIGNUP_REQUIRED"})
  };

  if (!(user[0].password === password)) {
    return res.json({message: "INVALID_PASSWORD"})
  };
  
  return res.json({ userId: user.id});
})

app.listen(PORT, () => {
  appDataSource.initialize()
    .then(() => {
      console.log("DB Connection has been initialized")
    })

  console.log(`Listening to request on localhost:${PORT}`);
})
