// ==UserScript==
// @name         ChatGPT Remove Special Characters on Copy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto replace special characters '[', ']', '(', ')' when copying text in ChatGPT
// @author       eternal-echo
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509142/ChatGPT%20Remove%20Special%20Characters%20on%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/509142/ChatGPT%20Remove%20Special%20Characters%20on%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page fully loads
    window.addEventListener('load', function() {

        // Function to replace special characters in the text
        function replaceSpecialCharacters(text) {
            // Replace the escaped math characters with desired symbols
            return text
                .replace(/\\\[/g, '$$$$')  // Replace \[ with $$
                .replace(/\\\]/g, '$$$$')  // Replace \] with $$
                .replace(/\\\(/g, '$')     // Replace \( with $
                .replace(/\\\)/g, '$');    // Replace \) with $
        }

        // Listen for any clicks on buttons with the 'data-testid="copy-turn-action-button"' attribute
        document.body.addEventListener('click', function(e) {
            if (e.target.closest('[data-testid="copy-turn-action-button"]')) {
                // Wait for the text to be copied to the clipboard
                setTimeout(() => {
                    navigator.clipboard.readText().then((text) => {
                        let modifiedText = replaceSpecialCharacters(text);
                        // Write the modified text back to the clipboard
                        navigator.clipboard.writeText(modifiedText);
                    });
                }, 100); // Delay to ensure the text is copied before we modify it
            }
        });
    });
})();
