// ==UserScript==
// @name         TTRS Auto Answer Test (Developer Use Only)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Educational script to test vulnerabilities — do not use to cheat
// @author       Your Name
// @license      MIT
// @match        *://*.ttrockstars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537686/TTRS%20Auto%20Answer%20Test%20%28Developer%20Use%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537686/TTRS%20Auto%20Answer%20Test%20%28Developer%20Use%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAnswer(question) {
        const parts = question.split('x');
        if (parts.length !== 2) return '';
        const num1 = parseInt(parts[0].trim());
        const num2 = parseInt(parts[1].trim());
        return num1 * num2;
    }

    function autoAnswerLoop() {
        const questionEl = document.querySelector('.question'); // Replace with actual selector
        const inputEl = document.querySelector('input.answer'); // Replace with actual selector
        const submitBtn = document.querySelector('button.submit'); // Replace with actual selector

        if (questionEl && inputEl && submitBtn) {
            const questionText = questionEl.innerText || questionEl.textContent;
            const answer = getAnswer(questionText);
            if (!isNaN(answer)) {
                inputEl.value = answer;
                submitBtn.click();
                console.log(`Answered: ${questionText} = ${answer}`);
            }
        }

        setTimeout(autoAnswerLoop, 200); // Repeat every 0.2 seconds
    }

    setTimeout(autoAnswerLoop, 1000); // Initial delay
})();