// ==UserScript==
// @name         Blooket Auto Answer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically answers questions in Blooket games
// @author       Your Name
// @match        *://*.blooket.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523773/Blooket%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/523773/Blooket%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the game question to load
    const observer = new MutationObserver(() => {
        const questionElement = document.querySelector('.questionText'); // Adjust selector to match Blooket's structure
        const answerElements = document.querySelectorAll('.answerText'); // Adjust selector to match Blooket's structure

        if (questionElement && answerElements.length > 0) {
            const question = questionElement.textContent;

            // Mock correct answer (replace with logic for actual answer fetching)
            const correctAnswer = "Sample Answer"; // You need to determine how to fetch the real answer

            answerElements.forEach((answerElement) => {
                if (answerElement.textContent === correctAnswer) {
                    answerElement.click();
                    console.log("Answered:", correctAnswer);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
