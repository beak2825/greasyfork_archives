// ==UserScript==
// @name         TTRS Auto Answerer - All Times Tables
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto answers all times tables questions in TTRS (1-12 x 1-12)
// @author       YourName
// @match        https://play.timestables.co.uk/*  // Adjust if needed
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537760/TTRS%20Auto%20Answerer%20-%20All%20Times%20Tables.user.js
// @updateURL https://update.greasyfork.org/scripts/537760/TTRS%20Auto%20Answerer%20-%20All%20Times%20Tables.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generate all multiplication questions from 1x1 to 12x12
    const answerMap = {};
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            const questionText = `${i} x ${j}`;
            answerMap[questionText.toLowerCase()] = i * j;
        }
    }

    // Function to get current question text
    function getQuestion() {
        const questionElem = document.querySelector('.question'); // Adjust selector if needed
        if (questionElem) {
            return questionElem.innerText.trim();
        }
        return null;
    }

    // Function to answer the current question
    function answerQuestion() {
        const question = getQuestion();
        if (question) {
            // Normalize question text
            const qLower = question.toLowerCase().replace(/\s+/g, '');
            let answer = null;

            // Find answer in the map
            for (const key in answerMap) {
                const keyNormalized = key.replace(/\s+/g, '');
                if (question.toLowerCase().includes(key)) {
                    answer = answerMap[key];
                    break;
                }
            }

            if (answer !== null) {
                // Find answer input box
                const inputBox = document.querySelector('.answer-input'); // Adjust selector
                const submitBtn = document.querySelector('.submit-button'); // Adjust selector
                if (inputBox && submitBtn) {
                    inputBox.value = answer;
                    submitBtn.click();
                }
            }
        }
    }

    // Run every 333 milliseconds (about 3 answers/sec)
    setInterval(answerQuestion, 333);
})();