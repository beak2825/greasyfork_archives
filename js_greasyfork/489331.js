// ==UserScript==
// @name         ChatGPT CopyWhenSend
// @namespace    mefengl
// @version      0.0.1
// @description  Automatically copy message to clipboard when sending in ChatGPT.
// @author       mefengl
// @match        *://chat.openai.com/c/*
// @grant        none
// @homepage     https://github.com/mefengl
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489331/ChatGPT%20CopyWhenSend.user.js
// @updateURL https://update.greasyfork.org/scripts/489331/ChatGPT%20CopyWhenSend.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function ensureListenerAdded(textarea) {
        if (textarea.getAttribute('data-copywhensend') === 'true') {
            // Event listener already added
            return;
        }

        textarea.setAttribute('data-copywhensend', 'true');

        let checkInterval = null;
        let lastValue = '';
        let wasNotEmpty = false; // Flag to detect transition from having content to empty

        textarea.addEventListener('keydown', function() {
            if (checkInterval !== null) {
                clearInterval(checkInterval);
                checkInterval = null;
            }

            let count = 0;
            lastValue = textarea.value;
            wasNotEmpty = !!lastValue; // Set flag based on current content

            checkInterval = setInterval(() => {
                // Check for transition from non-empty to empty
                if (wasNotEmpty && textarea.value === '') {
                    navigator.clipboard.writeText(lastValue).then(() => {
                        console.log("Message copied to clipboard.");
                    }).catch(err => {
                        console.error("Could not copy message to clipboard: ", err);
                    });
                    clearInterval(checkInterval);
                    checkInterval = null;
                } else {
                    lastValue = textarea.value;
                    wasNotEmpty = !!lastValue; // Update flag based on current content
                }

                if (++count >= 100) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
            }, 200);
        });
    }

    function addListenerToTextarea() {
        const textarea = document.querySelector('form textarea');
        if (!textarea) return;

        ensureListenerAdded(textarea);
    }

    setInterval(() => {
        addListenerToTextarea();
    }, 1000);
})();
