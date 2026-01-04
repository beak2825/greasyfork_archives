// ==UserScript==
// @name         TTRS Auto Answer Simulator (Internal Testing)
// @namespace    https://ttrockstars.com/
// @version      1.1
// @description  Auto answers questions on TTRS for authorized testing only
// @author       TTRS Security Team
// @license      MIT
// @match        *://*.ttrockstars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537689/TTRS%20Auto%20Answer%20Simulator%20%28Internal%20Testing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537689/TTRS%20Auto%20Answer%20Simulator%20%28Internal%20Testing%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAnswer(question) {
        // TTRS questions look like "6 x 7" or "12 x 3"
        const parts = question.split('x');
        if (parts.length !== 2) return '';
        const num1 = parseInt(parts[0].trim());
        const num2 = parseInt(parts[1].trim());
        return num1 * num2;
    }

    function simulateAutoAnswer() {
        // Actual question element - this is a div with class "question__content" or similar
        const questionEl = document.querySelector('.question__content, .question-text, .question');
        // The input where you type the answer
        const inputEl = document.querySelector('input.answer-input, input[type="text"], input[aria-label="Answer"]');
        // The submit button
        const submitBtn = document.querySelector('button.submit-btn, button[type="submit"], button[aria-label="Submit"]');

        if (questionEl && inputEl && submitBtn) {
            const questionText = questionEl.innerText || questionEl.textContent;
            const answer = getAnswer(questionText);
            if (!isNaN(answer)) {
                // Only answer if input is empty or different
                if (inputEl.value !== String(answer)) {
                    inputEl.value = answer;
                    // Trigger input event so React/Vue/Angular registers the change
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    submitBtn.click();
                    console.log(`[AutoAnswer] Question: "${questionText.trim()}" Answered: ${answer}`);
                }
            }
        } else {
            // If one or more elements are missing, log for debugging
            console.log('[AutoAnswer] Waiting for question, input, or submit button elements...');
        }

        setTimeout(simulateAutoAnswer, 200);
    }

    setTimeout(simulateAutoAnswer, 1000);
})();