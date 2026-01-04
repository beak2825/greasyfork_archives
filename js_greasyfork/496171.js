// ==UserScript==
// @name         Ivelt Auto Copy Post Content
// @namespace    https://www.knaperyaden.org/
// @version      1.3
// @description  Copy text to clipboard when clicking submit on Ivelt forum
// @author       Knaper Yaden
// @match        *://www.ivelt.com/forum/*
// @match        *://ivelt.com/forum/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/496171/Ivelt%20Auto%20Copy%20Post%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/496171/Ivelt%20Auto%20Copy%20Post%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyTextToClipboard(text) {
        // This example assumes the use of the GM_setClipboard function for Greasemonkey
        GM_setClipboard(text, 'text');
    }

    // Ensure the script runs after everything is loaded
    window.addEventListener('load', () => {
        const submitButton = document.querySelector('input[type="submit"][name="post"]');
        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                const form = submitButton.closest('form');
                if (form) {
                    const textarea = form.querySelector('textarea[name="message"]');
                    if (textarea) {
                        const text = textarea.value;
                        // Check if the text length is more than 500 characters
                        if (text.length > 500) {
                            copyTextToClipboard(text);
                        }
                    }
                }
            });
        }
    });
})();