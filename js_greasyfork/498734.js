// ==UserScript==
// @name         Kahoot Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically answers multiple-choice questions on Kahoot.
// @author       Your Name
// @match        https://kahoot.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498734/Kahoot%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/498734/Kahoot%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and select the correct answer option
    function autoAnswer() {
        // Example: Assuming the correct answer is always the first option (index 0)
        document.querySelector('.kahoot-rbList > li:first-child > button').click();
    }

    // Monitor for new questions and automatically answer them
    setInterval(function() {
        // Check if there's a new question prompt
        var questionPrompt = document.querySelector('.kahoot-question-prompt');
        if (questionPrompt) {
            autoAnswer(); // Call the function to auto-answer
        }
    }, 1000); // Adjust the interval (10) based on your needs

})();
