// ==UserScript==
// @name         TTRS Auto Answer Simulator (Authorized Internal Use Only)
// @namespace    https://ttrockstars.com/
// @version      1.0
// @description  Simulates automated answers to test bot-detection and timing defenses on TTRS. Authorized use only.
// @author       TTRS Security Team
// @license      MIT
// @match        *://*.ttrockstars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537688/TTRS%20Auto%20Answer%20Simulator%20%28Authorized%20Internal%20Use%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537688/TTRS%20Auto%20Answer%20Simulator%20%28Authorized%20Internal%20Use%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility to parse multiplication questions like "6 x 7"
    function getAnswer(question) {
        const parts = question.split('x');
        if (parts.length !== 2) return '';
        const num1 = parseInt(parts[0].trim());
        const num2 = parseInt(parts[1].trim());
        return num1 * num2;
    }

    // Simulate auto-answering loop
    function simulateAutoAnswer() {
        const questionEl = document.querySelector('.question, .question-text'); // update based on actual class
        const inputEl = document.querySelector('input[type="text"]');
        const submitBtn = document.querySelector('button.submit, button[type="submit"]');

        if (questionEl && inputEl && submitBtn) {
            const questionText = questionEl.innerText || questionEl.textContent;
            const answer = getAnswer(questionText);
            if (!isNaN(answer)) {
                inputEl.value = answer;
                submitBtn.click();
                console.log(`[Internal Bot Test] Answered: ${questionText.trim()} = ${answer}`);
            }
        }

        // Repeat every 200ms
        setTimeout(simulateAutoAnswer, 200);
    }

    // Initial delay to allow page load
    setTimeout(simulateAutoAnswer, 1000);
})();