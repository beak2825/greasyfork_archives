// ==UserScript==
// @name         Kahoot Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-answer Kahoot questions with random answers
// @author       You
// @match        https://kahoot.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525335/Kahoot%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/525335/Kahoot%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a random click on one of the answers
    function autoAnswer() {
        // Check if the answers are available
        const answerButtons = document.querySelectorAll('.mcq-answer'); // for multiple-choice answers
        if (answerButtons.length > 0) {
            // Pick a random answer (0 - number of available answers)
            const randomAnswerIndex = Math.floor(Math.random() * answerButtons.length);
            const selectedAnswer = answerButtons[randomAnswerIndex];
            
            // Click the random answer
            selectedAnswer.click();
        }
    }

    // Run the function when the page has loaded
    window.addEventListener('load', function() {
        setInterval(autoAnswer, 1000); // Check for answers every second and automatically select one
    });
})();
