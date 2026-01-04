// ==UserScript==
// @name         Auto Play First track
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autoplay first track
// @license      MIT
// @author       Jimbootie
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520599/Auto%20Play%20First%20track.user.js
// @updateURL https://update.greasyfork.org/scripts/520599/Auto%20Play%20First%20track.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Function to autoplay the first track
    const autoplayFirstTrack = () => {
        // Find the first track
        const firstTrack = Array.from(document.querySelectorAll('[data-testid="tracklist-row"]'))
            .find(row => row.querySelector('.encore-text-body-medium') && row.querySelector('.encore-text-body-medium').textContent.trim().startsWith("1"));

        if (firstTrack) {
            console.log("Found first track:", firstTrack);

            // Find the play button and click it
            const playButton = firstTrack.querySelector('button[aria-label^="Play"]');
            if (playButton) {
                console.log("Play button found! Clicking...");
                playButton.click();
            } else {
                console.error("Play button not found in the first track.");
            }
        } else {
            console.error("First track not found. Retrying...");
            // Retry after a short delay (3 seconds)
            setTimeout(autoplayFirstTrack, 3000);
        }
    };

    // Initial call to autoplay function after 5 seconds delay
    setTimeout(autoplayFirstTrack, 5000); // 5000 ms = 5 seconds
})();
