// ==UserScript==
// @name         Remove Blocked User Comments on Reddit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes comments from blocked users on Reddit that contain the 'Blocked User' span.
// @author       ils94
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540411/Remove%20Blocked%20User%20Comments%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/540411/Remove%20Blocked%20User%20Comments%20on%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove blocked user comments
    function removeBlockedComments() {
        // Select all spans with 'Blocked User' text
        const blockedSpans = document.querySelectorAll('span.ml-2xs');
        blockedSpans.forEach(span => {
            if (span.textContent.trim() === 'Blocked User') {
                // Find the closest parent shreddit-comment element
                const commentContainer = span.closest('shreddit-comment');
                if (commentContainer) {
                    commentContainer.remove();
                }
            }
        });
    }

    // Run the function initially
    removeBlockedComments();

    // Observe DOM changes to handle dynamically loaded comments
    const observer = new MutationObserver(removeBlockedComments);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();