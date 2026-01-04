// ==UserScript==
// @name         TTRS Auto Answerer - Updated for 30/05/2025
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically answers questions in Times Tables Rock Stars, including multiplication and division, based on current webpage structure.
// @author       YourName
// @match        https://play.timestables.co.uk/*  // Adjust if the site URL changed
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537761/TTRS%20Auto%20Answerer%20-%20Updated%20for%2030052025.user.js
// @updateURL https://update.greasyfork.org/scripts/537761/TTRS%20Auto%20Answerer%20-%20Updated%20for%2030052025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // **Step 1: Customize selectors based on current webpage**
    /**
     * Use browser inspect element to find:
     * - The element that contains the question (e.g., class '.question-text')
     * - The input box for answers (e.g., id '#answerBox')
     * - The submit button (e.g., class '.submit-btn')
     */

    const selectors = {
        question: '.question-text',      // Example: replace with actual selector
        answerInput: '#answerBox',       // Example: replace with actual selector
        submitButton: '.submit-btn'       // Example: replace with actual selector
    };

    // **Step 2: Generate answer map for multiplication and division**
    const answerMap = {};

    // Generate multiplication tables from 1x1 to 12x12
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            answerMap[`${i}x${j}`.toLowerCase()] = i * j;
            answerMap[`${j}x${i}`.toLowerCase()] = i * j; // symmetric
        }
    }

    // Generate division answers (for questions like "36 ÷ 6")
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            // Handle division questions
            const dividend = i * j;
            answerMap[`${dividend}÷${j}`.toLowerCase()] = i; // e.g., 36 ÷ 6 = 6
            answerMap[`${dividend}/${j}`.toLowerCase()] = i; // also handle "/"
        }
    }

    // **Step 3: Define function to get the current question text**
    function getQuestion() {
        const questionEl = document.querySelector(selectors.question);
        if (questionEl) {
            return questionEl.innerText.trim().toLowerCase();
        }
        return null;
    }

    // **Step 4: Function to parse and answer questions**
    function answerQuestion() {
        const questionText = getQuestion();
        if (!questionText) return;

        // Normalize question for matching
        let answer = null;

        // Try to find answer in answerMap
        for (const key in answerMap) {
            if (questionText.includes(key)) {
                answer = answerMap[key];
                break;
            }
        }

        if (answer === null) {
            // Could not find answer, possibly question format is different
            console.log('Question not recognized:', questionText);
            return;
        }

        // Fill the answer input and submit
        const inputBox = document.querySelector(selectors.answerInput);
        const submitBtn = document.querySelector(selectors.submitButton);
        if (inputBox && submitBtn) {
            inputBox.value = answer;
            submitBtn.click();
        }
    }

    // **Step 5: Run the answer function periodically (e.g., every 0.33 seconds)**
    setInterval(answerQuestion, 333);

})();