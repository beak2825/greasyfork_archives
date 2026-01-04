// ==UserScript==
// @name         Refresh on Error Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refreshes the page when it contains the specified error message
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475453/Refresh%20on%20Error%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/475453/Refresh%20on%20Error%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for the error message
    function checkForError() {
        const errorElement = document.querySelector('h1._error_heading__nM7jJ');
        if (errorElement && errorElement.textContent === 'Uh oh! Got lost on your way?') {
            location.reload();
        }
    }

    // Check for the error on page load
    checkForError();

    // Set up a MutationObserver to check for changes in the DOM
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                checkForError();
            }
        }
    });

    // Start observing changes in the entire document
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
