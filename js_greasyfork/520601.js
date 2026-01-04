// ==UserScript==
// @name         Auto Pl and start Spotify w reload
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Autoplay load pl and play w reload
// @license      MIT
// @author       Jimbootie
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520601/Auto%20Pl%20and%20start%20Spotify%20w%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/520601/Auto%20Pl%20and%20start%20Spotify%20w%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playlistUrl = 'https://open.spotify.com/playlist/10AHvCprcK5agx9cuWg7JP'; // Your Playlist URL

    // Redirect to the playlist URL if not already on that page
    if (!window.location.href.includes(playlistUrl)) {
        window.location.href = playlistUrl;
        return;
    }

    // Check if the page has been reloaded before
    if (localStorage.getItem('hasReloaded') === 'true') {
        console.log("Page has been reloaded already. Skipping reload.");
        return; // Do not run the script again if already reloaded
    }

    // Wait for the page to load
    window.addEventListener('load', () => {
        console.log('Playlist page loaded.');

        // Function to autoplay the first track
        const autoplayFirstTrack = () => {
            // Try to find the first track in the playlist
            const firstTrack = Array.from(document.querySelectorAll('[data-testid="tracklist-row"]'))
                .find(row => row.querySelector('.encore-text-body-medium') && row.querySelector('.encore-text-body-medium').textContent.trim().startsWith("1"));

            if (firstTrack) {
                console.log("Found first track:", firstTrack);

                // Find the play button and click it
                const playButton = firstTrack.querySelector('button[aria-label="Play"]')
                                    || firstTrack.querySelector('button[aria-label^="Play"]')
                                    || firstTrack.querySelector('button[aria-label="Resume"]');

                if (playButton) {
                    console.log("Play button found! Clicking...");
                    playButton.click();

                    // After 3 seconds, reload the page and set the flag
                    setTimeout(() => {
                        console.log('Reloading the page...');
                        localStorage.setItem('hasReloaded', 'true'); // Set the flag to prevent multiple reloads
                        window.location.reload();  // Reload the page once
                    }, 3000);  // Adjust the delay time (3 seconds in this case)
                } else {
                    console.error("Play button not found in the first track.");
                }
            } else {
                console.error("First track not found. Retrying...");
                // Retry after a short delay (3 seconds)
                setTimeout(autoplayFirstTrack, 3000);
            }
        };

        // Initial call to autoplay function
        autoplayFirstTrack();
    });
})();
