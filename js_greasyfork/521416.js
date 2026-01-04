// ==UserScript==
// @name         ChatGPT get rid of login popup
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  Get rid of the login popup on ChatGPT
// @author       🤖
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521416/ChatGPT%20get%20rid%20of%20login%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/521416/ChatGPT%20get%20rid%20of%20login%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const loginPane = document.querySelector('.absolute div.fixed.inset-0');
            if (loginPane) {
                loginPane.style.display = 'none'; // Hide the login pane
                const textArea = document.querySelector('#prompt-textarea');
                if (textArea) {
                    textArea.focus(); // Focus on the text area
                }
                const declineLoginButton = document.querySelector('.underline.text-token-text-secondary.font-semibold.text-sm.cursor-pointer.mt-5');
                if (declineLoginButton) {
                    declineLoginButton.click(); // Click the decline button
                }
            }
        });
    });

    // Start observing the body for child additions
    observer.observe(document.body, { childList: true, subtree: true });
})();