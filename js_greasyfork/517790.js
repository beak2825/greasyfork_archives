// ==UserScript==
// @name         View Quotes Button on X (Twitter)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a "View Quotes" button on tweets 
// @author       Overdose
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/517790/View%20Quotes%20Button%20on%20X%20%28Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517790/View%20Quotes%20Button%20on%20X%20%28Twitter%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const addCitationButton = () => {
        // Select all visible tweets
        document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
            // Skip if the "View Quotes" button is already added
            if (tweet.querySelector('.voir-citations-icon')) return;

            // Find the tweet link
            const tweetLink = tweet.querySelector('a[href*="/status/"]');
            if (!tweetLink) return;

            // Generate the "Quotes" URL
            const tweetUrl = tweetLink.href.split('?')[0].split('/photo')[0];
            const quotesLink = `${tweetUrl}/quotes`;

            // Create the "View Quotes" button
            const icon = document.createElement('div');
            icon.className = 'voir-citations-icon';
            icon.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #536471;
                margin-left: 8px;
                flex-shrink: 0; /* Prevent layout distortion */
                width: 36px; /* Fixed width for alignment */
                height: 36px; /* Fixed height for alignment */
            `;
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true" style="width: 18px; height: 18px; fill: currentColor;">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.09 11.41a1 1 0 0 1-.72.29h-6a1 1 0 0 1-.72-1.71l3-3a1 1 0 0 1 1.44 0l3 3a1 1 0 0 1-.02 1.42z"></path>
                </svg>
            `;
            // Add a click event to the button
            icon.addEventListener('click', () => (window.location.href = quotesLink));

            // Add the button next to the "Share" button
            const actionBar = tweet.querySelector('div[role="group"]');
            if (actionBar) {
                const shareButton = actionBar.lastElementChild; // Find the last button ("Share")
                if (shareButton) {
                    shareButton.parentNode.insertBefore(icon, shareButton); // Insert before the "Share" button
                }
            }
        });
    };

    // Observer to monitor changes in the DOM
    const observer = new MutationObserver(addCitationButton);
    observer.observe(document.body, { childList: true, subtree: true });

    addCitationButton(); // Initial call to add the button to already-loaded tweets
})();
