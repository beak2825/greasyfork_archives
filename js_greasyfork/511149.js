// ==UserScript==
// @name         Century Tech Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto answer questions on Century Tech
// @author       You
// @match        https://app.century.tech/*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/511149/Century%20Tech%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/511149/Century%20Tech%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to auto-answer questions
    function autoAnswer() {
        var questions = document.querySelectorAll('.question');
        
        questions.forEach(function(question) {
            // Try to find the correct answer
            var correctAnswer = question.querySelector('.correct-answer');
            if (correctAnswer) {
                // If a correct answer is found, select it
                var answerInput = correctAnswer.previousElementSibling; // Assuming the input is before the label
                if (answerInput && answerInput.type === 'radio') {
                    answerInput.checked = true;
                    answerInput.labels[0].click(); // Simulate the click on the label
                }
            } else {
                // If no correct answer is found, select the first available answer
                var firstAnswerInput = question.querySelector('input[type="radio"]');
                if (firstAnswerInput) {
                    firstAnswerInput.checked = true;
                    firstAnswerInput.labels[0].click(); // Simulate the click on the label
                }
            }
        });

        // Submit answers
        var submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.click();
        }
    }

    // Run the auto-answer function
    autoAnswer();
})();