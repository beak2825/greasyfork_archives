// ==UserScript==
// @name         YT with multiple pl
// @namespace    https://greasyfork.org/YT with multiple pl
// @version      2.0
// @description  YT PLs skip after play all songs
// @license      jimbootie
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527604/YT%20with%20multiple%20pl.user.js
// @updateURL https://update.greasyfork.org/scripts/527604/YT%20with%20multiple%20pl.meta.js
// ==/UserScript==


// Helper function to generate a random integer between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// Function to simulate clicking the "Next" button on YouTube to skip to the next song
function goToNextSong() {
    const nextButton = document.querySelector('a.ytp-next-button.ytp-button'); // Locate the "Next" button
    if (nextButton) {
        nextButton.click(); // Trigger the click event on the button
        console.log("Next song triggered.");
    } else {
        console.log("Next button not found! Ensure the playlist is active and loaded.");
    }
}

// Array of playlist URLs
const playlists = [
    'https://www.youtube.com/playlist?list=PLtFqVlD5Wsh2inWKzYddqXToQX12-FEto', // Playlist 1
    'https://www.youtube.com/playlist?list=PLtFqVlD5Wsh2NSD4Nkmlfg32761HdOjkq', // Playlist 2
    'https://www.youtube.com/playlist?list=PLtFqVlD5Wsh3SqjIMeK8YoUL0FBRWPaza', // Playlist 3
];

// Maximum number of full set loops (1, 2, 3, then repeat)
const maxFullSetLoops = 10;

// Function to switch to the next playlist
function switchToNextPlaylist(currentPlaylistIndex, fullSetLoopCount) {
    let nextPlaylistIndex = (currentPlaylistIndex + 1) % playlists.length; // Cycle to the next playlist

    // Check if the full set of playlists has been looped 10 times
    if (nextPlaylistIndex === 0) { // Returned to Playlist 1, completing one full set
        fullSetLoopCount += 1; // Increment the full set loop count
        localStorage.setItem('fullSetLoopCount', fullSetLoopCount);
        console.log(`Full playlist set loop ${fullSetLoopCount} of ${maxFullSetLoops} completed.`);
    }

    if (fullSetLoopCount >= maxFullSetLoops) {
        console.log("All 10 loops of the full playlist set are complete. Exiting script.");
        return; // Exit the script when the full set loop count reaches the maximum
    }

    const nextPlaylistUrl = playlists[nextPlaylistIndex]; // Get the next playlist URL

    // Save the next playlist index to localStorage
    localStorage.setItem('currentPlaylistIndex', nextPlaylistIndex);

    console.log(`Switching to playlist: ${nextPlaylistUrl}`);
    window.location.href = nextPlaylistUrl; // Navigate to the next playlist
}

// Function to start playback after switching to a new playlist
function startPlayback() {
    setTimeout(function () {
        console.log("Waiting for the page to load before clicking Play...");

        // Attempt to locate the "Play All" button
        const playAllButton = document.querySelector('#page-manager > ytd-browse > yt-page-header-renderer > yt-page-header-view-model > div.page-header-view-model-wiz__page-header-content > div.page-header-view-model-wiz__page-header-headline-info > yt-flexible-actions-view-model > div > div:nth-child(1) > button-view-model > a > div.yt-spec-button-shape-next__button-text-content');

        if (playAllButton && playAllButton.offsetParent !== null) {
            playAllButton.click(); // Click the "Play All" button
            console.log("Autoplay started using Play All button.");
        } else {
            console.log("Play All button not found. Retrying...");
            setTimeout(startPlayback, 5000); // Retry after 5 seconds if the button is not found
        }
    }, 8000); // Wait 8 seconds to ensure the page has time to load
}

// Main loop function: Handles song skipping only
function loop() {
    // Random time between 40-45 seconds for each song
    const songDuration = getRandomInt(40000, 45000);

    // Timer to skip songs every 40-45 seconds
    setInterval(() => {
        console.log(`Skipping song after ${songDuration / 1000} seconds...`);
        goToNextSong(); // Skip the current song
    }, songDuration);
}

// Wait for the page to load and start the playback and looping logic
window.addEventListener('load', function () {
    console.log("Page loaded, starting playback and song loop...");

    // Get the current playlist index and full set loop count from localStorage
    const currentPlaylistIndex = parseInt(localStorage.getItem('currentPlaylistIndex') || 0);
    const fullSetLoopCount = parseInt(localStorage.getItem('fullSetLoopCount') || 0);

    if (fullSetLoopCount < maxFullSetLoops) {
        startPlayback(); // Start autoplay if needed
        loop(); // Begin looping through songs in the current playlist
    } else {
        console.log("All 10 loops of the full playlist set are complete. Exiting script.");
    }
});
