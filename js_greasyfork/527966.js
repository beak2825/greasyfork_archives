// ==UserScript==
// @name         Hide LinkedIn Promoted Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide promoted posts on LinkedIn feed
// @author       chtshop
// @match        https://www.linkedin.com/feed/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527966/Hide%20LinkedIn%20Promoted%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/527966/Hide%20LinkedIn%20Promoted%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePromotedPosts() {
        document.querySelectorAll('span[aria-hidden="true"]').forEach(span => {
            if (span.innerText.trim() === 'Promoted') {

                let parent = span;
                for (let i = 0; i < 12; i++) {
                    if (parent) parent = parent.parentElement;
                }
                if (parent) parent.remove();
            }
        });
    }

    // Run initially and then observe for new elements
    hidePromotedPosts();

    const observer = new MutationObserver(() => hidePromotedPosts());
    observer.observe(document.body, { childList: true, subtree: true });
})();
