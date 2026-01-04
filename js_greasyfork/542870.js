// ==UserScript==
// @name         Hide Private Videos on ThisVid
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Hides only private videos by targeting the specific link element
// @author       BlueAnivia
// @match        https://thisvid.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542870/Hide%20Private%20Videos%20on%20ThisVid.user.js
// @updateURL https://update.greasyfork.org/scripts/542870/Hide%20Private%20Videos%20on%20ThisVid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_ATTRIBUTE = 'data-private-hidden';

    const hidePrivateVideos = () => {
        // Find all video links that contain private icons
        const privateVideoLinks = document.querySelectorAll('a.tumbpu');

        privateVideoLinks.forEach(link => {
            // Check if this link contains a private icon and hasn't been processed
            const privateIcon = link.querySelector('.icon-private');

            if (privateIcon && !link.hasAttribute(PROCESSED_ATTRIBUTE)) {
                // Hide the entire link element (the video thumbnail)
                link.style.display = 'none';
                link.setAttribute(PROCESSED_ATTRIBUTE, 'true');
                console.log('Hidden private video:', link.querySelector('.title')?.textContent || 'Unknown title');
            }
        });
    };

    // Debug function to see what's being found
    const debugVideos = () => {
        const allLinks = document.querySelectorAll('a.tumbpu');
        const privateLinks = document.querySelectorAll('a.tumbpu .icon-private');

        console.log(`Total video links found: ${allLinks.length}`);
        console.log(`Private video icons found: ${privateLinks.length}`);

        // Log details about each video
        allLinks.forEach((link, index) => {
            const isPrivate = link.querySelector('.icon-private') !== null;
            const title = link.querySelector('.title')?.textContent || 'No title';
            console.log(`Video ${index + 1}: "${title}" - Private: ${isPrivate}`);
        });
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                hidePrivateVideos();
                return;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run when page loads
    hidePrivateVideos();

    // Uncomment the next line to debug what videos are being found
    // debugVideos();
})();