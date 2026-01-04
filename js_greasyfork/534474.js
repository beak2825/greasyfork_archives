// ==UserScript==
// @name         Reddit /r/all Filter by Keywords (Robust)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Hide Reddit posts on /r/all if they match specific keywords in the title (supports infinite scroll)
// @match        https://www.reddit.com/r/all*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534474/Reddit%20rall%20Filter%20by%20Keywords%20%28Robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534474/Reddit%20rall%20Filter%20by%20Keywords%20%28Robust%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

// ADD YOUR BLOCKED POST KEYWORDS HERE
    const blockedKeywords = [
        'trump',
        'kardashian',
        'elon',
        'crypto',
        'taylor swift'
    ];

    function filterPosts() {
        const titles = document.querySelectorAll('faceplate-screen-reader-content');

        titles.forEach(titleEl => {
            const text = titleEl.textContent.toLowerCase().trim();
            const post = titleEl.closest('shreddit-post');
            if (!post || post.dataset.filtered === 'true') return;

            if (blockedKeywords.some(keyword => text.includes(keyword))) {
                post.style.display = 'none';
                post.dataset.filtered = 'true';
                console.log(`[Filtered]: ${text}`);
            }
        });
    }

    // Observe DOM mutations for endless scroll
    const observer = new MutationObserver(filterPosts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback for missed posts
    setInterval(filterPosts, 1500);

    // Initial run
    window.addEventListener('load', filterPosts);
})();