// ==UserScript==
// @name         Code Block Wrapping Enhancer For ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces or adds the "!whitespace-pre-wrap" class to <code> elements.
// @match        *://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525051/Code%20Block%20Wrapping%20Enhancer%20For%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/525051/Code%20Block%20Wrapping%20Enhancer%20For%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process <code> elements
    function updateCodeClass() {
        document.querySelectorAll('code').forEach(code => {
            if (code.classList.contains('!whitespace-pre')) {
                // Replace "!whitespace-pre" with "!whitespace-pre-wrap"
                code.classList.replace('!whitespace-pre', '!whitespace-pre-wrap');
            } else {
                // Add "!whitespace-pre-wrap" if it doesn't exist
                code.classList.add('!whitespace-pre-wrap');
            }
        });
    }

    // Create a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => updateCodeClass());

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial execution
    updateCodeClass();
})();
