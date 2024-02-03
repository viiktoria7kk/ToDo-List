const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const bodyParser = require("body-parser");
const Todo = require("./models/todo");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO);
const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Помилка підключення до бази даних:")
);
db.once("open", () => {
  console.log("Підключено до бази даних");
});

app.get("/", (req, res) => {
  Todo.find().then((result) => {
    res.render("index", { data: result });
  });
});

app.post("/", (req, res) => {
  const todo = new Todo({
    todo: req.body.todoValue,
  });
  todo.save().then((result) => {
    res.redirect("/");
  });
});

app.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id).then((result) => {
    console.log(result);
  });
});

app.listen(process.env.PORT, (error) => {
  error ? console.log(error) : console.log(`Listening port 3000`);
});
