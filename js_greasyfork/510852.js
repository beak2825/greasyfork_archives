// ==UserScript==
// @name         Century AI Auto-Answer Script
// @namespace    http://example.com
// @version      1.0
// @description  Automate interactions with Century AI
// @include      https://century.ai/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510852/Century%20AI%20Auto-Answer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/510852/Century%20AI%20Auto-Answer%20Script.meta.js
// ==/UserScript==

// Set the username and password
var username = "your_username";
var password = "your_password";

// Set the answers to common security questions
var answers = {
  "What is your mother's maiden name?": "your_mother_maiden_name",
  "What is your favorite color?": "your_favorite_color",
  "What is your favorite animal?": "your_favorite_animal"
};

// Function to login to Century AI
function login() {
  // Send a POST request to the login endpoint
  GM_xmlhttpRequest({
    method: "POST",
    url: "https://century.ai/login",
    data: "username=" + username + "&password=" + password,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(response) {
      // Check if the login was successful
      if (response.status === 200) {
        console.log("Login successful");
        // Get the security questions
        getSecurityQuestions();
      } else {
        console.log("Login failed");
      }
    }
  });
}

// Function to get the security questions
function getSecurityQuestions() {
  // Send a GET request to the security questions endpoint
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://century.ai/security_questions",
    onload: function(response) {
      // Parse the security questions
      var questions = JSON.parse(response.responseText);
      // Answer the security questions
      answerSecurityQuestions(questions);
    }
  });
}

// Function to answer the security questions
function answerSecurityQuestions(questions) {
  // Loop through the questions and answer them
  questions.forEach(function(question) {
    var answer = answers[question];
    if (answer) {
      // Send a POST request to answer the question
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://century.ai/answer_security_question",
        data: "question=" + question + "&answer=" + answer,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
          console.log("Answered question: " + question);
        }
      });
    }
  });
}

// Login to Century AI
login();