// ==UserScript==
// @name         Educake Autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofills Educake answers for you!
// @author       Your Name
// @match        https://app.educake.co.uk/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465883/Educake%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/465883/Educake%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add your answers here
    const answers = {
        'Question 1': 'Answer 1',
        'Question 2': 'Answer 2',
        'Question 3': 'Answer 3'
    };

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        // Get all the answer fields
        const answerFields = document.querySelectorAll('input[type=text]');

        // Loop through the answer fields
        answerFields.forEach((field) => {
            // Get the question for the answer field
            const question = field.previousElementSibling.textContent.trim();

            // Check if we have an answer for this question
            if (question in answers) {
                // Fill in the answer
                field.value = answers[question];
            }
        });
    });
})();
