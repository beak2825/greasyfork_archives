// ==UserScript==
// @name         TTRS Auto-Answer Simulator (For Internal Testing Only)
// @namespace    https://ttrockstars.com/
// @version      0.1
// @description  Simulates auto-answering to test detection systems (internal QA only)
// @author       TTRS Security
// @license      MIT
// @match        *://*.ttrockstars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537755/TTRS%20Auto-Answer%20Simulator%20%28For%20Internal%20Testing%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537755/TTRS%20Auto-Answer%20Simulator%20%28For%20Internal%20Testing%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseQuestion(text) {
        const match = text.match(/(\d+)\s*[x×*÷/]\s*(\d+)/i);
        if (!match) return null;

        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        if (text.includes('÷') || text.includes('/')) {
            return Math.floor(num1 / num2);
        }
        return num1 * num2;
    }

    function simulate() {
        const questionEl = document.querySelector('.question, .question__content, .question-text');
        const inputEl = document.querySelector('input[type="text"]');
        const submitBtn = document.querySelector('button[type="submit"], button.submit');

        if (questionEl && inputEl && submitBtn) {
            const questionText = questionEl.innerText || questionEl.textContent;
            const answer = parseQuestion(questionText);
            if (answer !== null) {
                inputEl.value = answer;
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                submitBtn.click();
                console.log(`[Sim Bot] Answered: ${questionText} = ${answer}`);
            }
        }

        setTimeout(simulate, 300); // Answers every 0.3s
    }

    setTimeout(simulate, 1000); // Start after load
})();
