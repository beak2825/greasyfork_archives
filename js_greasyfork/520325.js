// ==UserScript==
// @name         PL and Auto Play Spotify 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically autoplay playlist
// @license      MIT
// @author       Jimbootie
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520325/PL%20and%20Auto%20Play%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/520325/PL%20and%20Auto%20Play%20Spotify.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const playlistId = '4hXKVluMRDtKm2nQeoYLpT'; // Your Playlist ID
    const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
    const refreshedKey = 'playlistRefreshed'; // Key for sessionStorage to track refresh status

    // Redirect to the playlist URL if not already on that page
    if (!window.location.href.includes(playlistUrl)) {
        window.location.href = playlistUrl;
        return;
    }

    // Check if the page has already been refreshed
    if (!sessionStorage.getItem(refreshedKey)) {
        console.log('Waiting for 5 seconds before reloading...');
        sessionStorage.setItem(refreshedKey, 'true'); // Mark as refreshed
        setTimeout(() => {
            window.location.reload(); // Reload the page after 5 seconds
        }, 5000); // 5 seconds wait
        return;
    }

    // After the page reloads, attempt to autoplay from the first track
    window.addEventListener('load', () => {
        console.log('Page reloaded. Attempting to play the first track...');
        sessionStorage.removeItem(refreshedKey); // Clear the refresh flag

        // Wait for Spotify's content to load and then play the first song
        const waitForFirstSong = setInterval(() => {
            // Look for the first song in the playlist
            const firstSong = document.querySelector('div[data-testid="tracklist-row"]:first-child');

            if (firstSong) {
                clearInterval(waitForFirstSong); // Stop looking for the first song
                console.log('First song found. Attempting to click...');
                try {
                    firstSong.click(); // Attempt to click the first song
                    console.log('First song clicked successfully.');

                    // Ensure autoplay by clicking the play button if it's available
                    const playButton = document.querySelector('button[data-testid="play-button"], button[aria-label="Play"]');
                    if (playButton) {
                        playButton.click(); // Click the play button to start playback
                        console.log('Autoplay started from the first track.');
                    }
                } catch (error) {
                    console.error('Error clicking the first song:', error);
                }
            }
        }, 500);

        // Stop trying after 15 seconds if the first song isn't found
        setTimeout(() => {
            clearInterval(waitForFirstSong);
            console.log('First song not found. Stopping attempt.');
        }, 15000);
    });

})();
