// ==UserScript==
// @name         Reddit - Auto Expand Hidden Comments in 2026
// @version      1.0.5
// @description  This userscript was created by an AI. It will most likely never be updated, so consider it 'as is.'
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @match        *://*.reddit.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524909/Reddit%20-%20Auto%20Expand%20Hidden%20Comments%20in%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/524909/Reddit%20-%20Auto%20Expand%20Hidden%20Comments%20in%202026.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function expandComments() {
        const comments = document.querySelectorAll('shreddit-comment[collapsed]');
        comments.forEach(comment => {
            // Set action row height to 32px during loading
            const actionRow = comment.querySelector('shreddit-comment-action-row');
            if (actionRow) {
                actionRow.style.maxHeight = '32px';
                actionRow.style.height = '32px';
            }
            // Remove collapsed attribute to expand the comment
            comment.removeAttribute('collapsed');
        });
    }

    // Observe DOM changes to capture new comments dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                expandComments();
            }
        });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run to expand comments on page load
    window.addEventListener('load', () => {
        setTimeout(expandComments, 5000); // 5-second delay to allow all elements to load
    });
})();