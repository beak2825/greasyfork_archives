// ==UserScript==
// @name         play first track Spotify Playlist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autoplay first track 
// @license      MIT
// @author       Jimbootie
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520594/play%20first%20track%20Spotify%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/520594/play%20first%20track%20Spotify%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playlistId = '4hXKVluMRDtKm2nQeoYLpT'; // Your Playlist ID
    const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;

    // Redirect to the playlist URL if not already on that page
    if (!window.location.href.includes(playlistUrl)) {
        window.location.href = playlistUrl;
        return;
    }

    // Wait for the page to load
    window.addEventListener('load', () => {
        console.log('Playlist page loaded.');

        // Function to autoplay the first track
        const autoplayFirstTrack = () => {
            // Find the first track in the playlist
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
                } else {
                    console.error("Play button not found in the first track.");
                }
            } else {
                console.error("First track not found");
            }
        };

        // Run autoplay function after the page loads
        autoplayFirstTrack();
    });
})();
