// ==UserScript==
// @name         X to Unroll Redirect (Yellow Icon, Tweet-specific)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a yellow Unroll button next to the like button on X (Twitter) individual tweet pages
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/510141/X%20to%20Unroll%20Redirect%20%28Yellow%20Icon%2C%20Tweet-specific%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510141/X%20to%20Unroll%20Redirect%20%28Yellow%20Icon%2C%20Tweet-specific%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addUnrollButton() {
        // Check if we're on an individual tweet page
        if (!window.location.pathname.includes('/status/')) return;

        const tweetActions = document.querySelector('div[role="group"]');
        if (!tweetActions || document.querySelector('#unrollButton')) return;

        const unrollButton = document.createElement('div');
        unrollButton.id = 'unrollButton';
        unrollButton.role = 'button';
        unrollButton.ariaLabel = 'Unroll thread';
        unrollButton.innerHTML = `
            <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <g><path fill="#FFD700" d="M7.8 21c-.3 0-.5-.1-.7-.3-.5-.5-.4-1.2.1-1.6L14.9 12 7.2 4.9c-.5-.4-.6-1.1-.1-1.6.4-.5 1.1-.6 1.6-.1l8.8 8c.3.3.4.7.4 1.1s-.2.8-.4 1.1l-8.8 8c-.3.2-.6.3-.9.3z"></path></g>
                </svg>
            </div>
        `;

        unrollButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            padding: 0 12px;
            cursor: pointer;
        `;

        unrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tweetId = window.location.pathname.split('/status/')[1];
            if (tweetId) {
                window.open(`https://unrollnow.com/status/${tweetId}`, '_blank');
            } else {
                alert('Unable to find tweet ID. Make sure you are on a tweet page.');
            }
        });

        tweetActions.appendChild(unrollButton);
    }

    // Run the function initially and also whenever the URL changes
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                addUnrollButton();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also run when the page loads and when the URL changes
    window.addEventListener('load', addUnrollButton);
    window.addEventListener('popstate', addUnrollButton);
})();