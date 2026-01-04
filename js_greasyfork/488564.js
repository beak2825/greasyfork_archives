// ==UserScript==
// @name         Quill Answer Revealer and Auto-fill
// @version      1.0
// @description  Use firefox so it can be pasted into the text box on quill the answers show up on the console when you inspect element 
// @author       godlyredflame
// @match        https://www.quill.org/*
// @grant        none
// @run-at       document-idle
// @esversion    8
// @namespace https://greasyfork.org/users/1193591
// @downloadURL https://update.greasyfork.org/scripts/488564/Quill%20Answer%20Revealer%20and%20Auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/488564/Quill%20Answer%20Revealer%20and%20Auto-fill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.loaded = false;

    // Function to extract the correct answer text from the response data
    function extractCorrectAnswer(responseData) {
        let correctAnswer = null;

        for (const item of responseData) {
            if (item.optimal === true) {
                correctAnswer = item.text.trim();
                break; // Stop loop after finding the first valid answer
            }
        }
        return correctAnswer;
    }

    // Function to log and fill the input box with the correct answer
    function logAndFillCorrectAnswer(responseData) {
        // Extract the correct answer text from the response data
        const correctAnswer = extractCorrectAnswer(responseData);
        if (!correctAnswer) {
            console.error("No valid answer found in the response data.");
            return;
        }

        console.log("Correct answer to be entered into the text box:");
        console.log(correctAnswer);
        console.log("------------");

        // Find and fill the input box
        const inputBox = document.querySelector('.connect-text-area');
        if (inputBox) {
            inputBox.textContent = correctAnswer;
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments).then(res => {
            if (res && res.url && res.url.includes && res.url.includes("/multiple_choice_options")) {
                // If the URL includes "multiple_choice_options", log and fill the correct answer
                return res.json().then(responseData => {
                    logAndFillCorrectAnswer(responseData);
                });
            }

            if (!window.loaded) {
                console.log("%c Answer Revealer ", "color: mediumvioletred; -webkit-text-stroke: .5px black; font-size:40px; font-weight:bolder; padding: .2rem;");
                console.log("%cCreated by GodlyRedflame", "color: white; -webkit-text-stroke: .5px black; font-size:15px; font-weight:bold;");
                window.loaded = true;
            }

            return res;
        }).catch(error => {
            console.error('Fetch error:', error);
        });
    };

})();
