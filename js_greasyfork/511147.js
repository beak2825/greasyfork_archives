// ==UserScript==
// @name         Century Tech Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto answer questions on Century Tech
// @author       You
// @match        https://app.century.tech/*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/511147/Century%20Tech%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/511147/Century%20Tech%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var questions = document.querySelectorAll('.question');
  var answers = [];

  // Loop through questions and get the correct answers
  questions.forEach(function(question, index) {
    var correctAnswer = question.querySelector('.correct-answer');
    if (correctAnswer) {
      answers.push(correctAnswer.textContent.trim());
    }
  });

  // Auto answer questions
  questions.forEach(function(question, index) {
    var answerInput = question.querySelector('input[type="radio"]');
    if (answerInput) {
      answerInput.checked = true;
      answerInput.labels[0].click();
    }
  });

  // Submit answers
  var submitButton = document.querySelector('.submit-button');
  if (submitButton) {
    submitButton.click();
  }
})();