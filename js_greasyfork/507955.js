// ==UserScript==
// @name         Classtime copier
// @namespace    https://www.classtime.com/
// @version      2024-09-11
// @description  Copy the title and answers from Classtime
// @author       marshallovski
// @match        https://www.classtime.com/code/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=classtime.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507955/Classtime%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/507955/Classtime%20copier.meta.js
// ==/UserScript==

// https://www.youtube.com/watch?v=DBT5lM9pSo8
(function () {
    const interval = setInterval(() => {
        // question element
        const title = document.querySelector('[data-testid="student-session-question-title"]');
        const title2 = document.querySelector('#classtime-mathjax-content');

        // answers element
        const answers = document.querySelector('[data-testid="questions-answers-list"]');

        const elements = title && answers;

        // if question and answers exist, creating button which copies text
        if (elements) {
            // Check if button already exists
            let copyBtn = document.querySelector('#copyBtn');
            if (!copyBtn) {
                // creating the button
                copyBtn = document.createElement('button');
                copyBtn.id = 'copyBtn'; // Set an ID for the button
                copyBtn.innerText = 'Copy answers and question';
                copyBtn.style = 'position:fixed;bottom:1em;z-index:9999;background-color:#006769;color:#eee;border-radius:16px;padding:4px 8px;right:1em;border:1px solid #40A578';

                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(`${title.innerText} (${title2.innerText || ''})\n\n\n${answers.innerText}`);
                    alert("Copied to clipboard!");
                }

                // adding the button to page
                document.body.append(copyBtn);
            } else {
                // Update button's onclick function to copy the latest text
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(`${title.innerText} (${title2.innerText || ''})\n\n\n${answers.innerText}`);
                    alert("Copied to clipboard!");
                };
            }
        }
    }, 100);
})();