// ==UserScript==
// @name         Hide YouTube Mobile Comments Fully
// @namespace    https://greasyfork.org/en/users/yourusername
// @version      1.0
// @description  Completely removes all comments, teaser headers, and placeholders on m.youtube.com while keeping the description intact
// @match        https://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545933/Hide%20YouTube%20Mobile%20Comments%20Fully.user.js
// @updateURL https://update.greasyfork.org/scripts/545933/Hide%20YouTube%20Mobile%20Comments%20Fully.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeComments(root) {
        if (!root) return;

        // Find main watch container
        const watchFlexy = root.querySelector('ytm-watch-flexy');
        if (watchFlexy) {
            // Remove all children after the description section
            let remove = false;
            Array.from(watchFlexy.children).forEach(child => {
                // Start removing once we reach comment or engagement panel sections
                if (child.tagName.toLowerCase().includes('comments') || child.tagName.toLowerCase().includes('engagement-panel')) {
                    remove = true;
                }
                if (remove) child.remove();
            });
        }

        // Recurse into shadow DOMs
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                removeComments(el.shadowRoot);
            }
        });
    }

    // Initial removal
    removeComments(document);

    // Observe DOM mutations for lazy-loaded or SPA content
    const observer = new MutationObserver(() => removeComments(document));
    observer.observe(document.body, { childList: true, subtree: true });
})();