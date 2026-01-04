// ==UserScript==
// @name         ChatGPT RTL and LTR Text Direction
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Changes text direction in ChatGPT based on the language of the text (Hebrew: RTL, English: LTR).
// @author       p1x3l.push3r
// @match        https://*.chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/520181/ChatGPT%20RTL%20and%20LTR%20Text%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/520181/ChatGPT%20RTL%20and%20LTR%20Text%20Direction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to determine if the text is in Hebrew
    function isHebrew(text) {
        const hebrewRegex = /[\u0590-\u05FF]/; // Unicode range for Hebrew characters
        return hebrewRegex.test(text);
    }

    // Function to apply text direction based on language
    function applyTextDirection() {
        const chatMessages = document.querySelectorAll('[class*="text-base"], [class*="prose"]'); // Chat message selectors

        chatMessages.forEach((message) => {
            const text = message.innerText || message.textContent; // Get the message text

            if (isHebrew(text)) {
                // Apply RTL for Hebrew
                message.style.direction = 'rtl';
                message.style.textAlign = 'right';
            } else {
                // Apply LTR for non-Hebrew
                message.style.direction = 'ltr';
                message.style.textAlign = 'left';
            }
        });
    }

    // MutationObserver to dynamically handle new messages
    const observer = new MutationObserver(() => {
        applyTextDirection();
    });

    // Start observing the DOM for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial run on page load
    applyTextDirection();
})();