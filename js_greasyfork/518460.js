// ==UserScript==
// @name         Auto Remove Try not to rush!
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically removes the blocker div with countdown using MutationObserver.
// @author       Your Name
// @match        https://www.vocabulary.com/lists/*/practice*
// @match        https://www.vocabulary.com/vocabtrainer/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518460/Auto%20Remove%20Try%20not%20to%20rush%21.user.js
// @updateURL https://update.greasyfork.org/scripts/518460/Auto%20Remove%20Try%20not%20to%20rush%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the blocker if it exists
    function removeBlocker() {
        const blocker = document.querySelector('.blocker');
        if (blocker) {
            blocker.remove();
            console.log('Blocker element removed.');
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        removeBlocker(); // Check for and remove the blocker on DOM changes
    });

    // Start observing the document body for added/removed child nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the blocker is already present
    removeBlocker();
})();
