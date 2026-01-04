// ==UserScript==
// @name         Am loop pl
// @namespace    https://greasyfork.org/Am loop pl
// @version      2.7
// @description  Am test playlist
// @license      MIT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520711/Am%20loop%20pl.user.js
// @updateURL https://update.greasyfork.org/scripts/520711/Am%20loop%20pl.meta.js
// ==/UserScript==

var counter = 0; // Initialize a counter variable

// Define the playlist URLs or identifiers in an array
var playlists = [
    'https://music.apple.com/sg/playlist/who-jimin/pl.u-leyl0YPIM2yV9qW',
    'https://music.apple.com/sg/playlist/who-br-te/pl.u-b3b8VGBH3KZKLvg',
    'https://music.apple.com/sg/playlist/whog/pl.u-4Jomm9bua6DMl7V',
    // Add more playlists as needed
];

// Function to simulate "Play" button click to start autoplay
function playButtonClick() {
    var playButton = document.querySelector('.play-button.svelte-1fx4rnm.play-button--standard'); // Select the play button
    if (playButton) {
        playButton.click(); // Click the play button to start autoplay
        console.log("Play button clicked. Autoplay started.");
    } else {
        console.log("Play button not found. Retrying...");
        setTimeout(playButtonClick, 1000); // Retry after 1 second if not found
    }
}

// Function to stop music playback
function stopMusic() {
    var stopButton = document.querySelector('button[aria-label="Pause"]'); // Adjust the selector to match the stop/pause button
    if (stopButton) {
        stopButton.click(); // Click the stop button to stop music
        console.log("Music stopped.");
    } else {
        console.log("Stop button not found.");
    }
}

// Function to switch to the next playlist
function switchToNextPlaylist() {
    // Get the current playlist index from localStorage or set to 0 if not found
    var currentPlaylistIndex = parseInt(localStorage.getItem('currentPlaylistIndex') || 0);

    // Check if there are more playlists, if not, loop back to the first playlist
    if (currentPlaylistIndex < playlists.length - 1) {
        currentPlaylistIndex++;
    } else {
        currentPlaylistIndex = 0; // Loop back to the first playlist
    }

    // Save the new index to localStorage
    localStorage.setItem('currentPlaylistIndex', currentPlaylistIndex);

    var nextPlaylistUrl = playlists[currentPlaylistIndex]; // Get the URL of the next playlist
    console.log("Switching to playlist: " + nextPlaylistUrl);

    // Navigate to the next playlist URL
    window.location.href = nextPlaylistUrl; // Navigates to the next playlist URL
}

// Function to start playback after page reload
function startPlayback() {
    setTimeout(function() {
        console.log("Waiting for the page to load before clicking Play...");

        var playButton = document.querySelector('.play-button.svelte-1fx4rnm.play-button--standard');
        if (playButton) {
            playButton.click(); // Click the play button to start autoplay
            console.log("Autoplay started.");
        } else {
            console.log("Play button not found after switching playlist.");
        }
    }, 8000); // Wait 8 seconds to ensure the page has time to load
}

// Main loop to control play and stop times
(function loop() {
    if (counter < 10) { // This will repeat 10 times for 50 minutes of play (5 minutes each cycle)
        var playDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
        var stopDuration = 30 * 1000; // 30 seconds in milliseconds

        console.log("Playing for 5 minutes...");

        // Play for 5 minutes
        setTimeout(function() {
            playButtonClick(); // Click the Play button (instead of Next button)
            counter++; // Increment the counter after playing the "Play" button

            // After playing 5 minutes, stop music and switch the playlist
            setTimeout(function() {
                console.log("Stopping for 30 seconds...");
                stopMusic(); // Stop music after 5 minutes of play

                // Switch to the next playlist after stopping
                setTimeout(function() {
                    switchToNextPlaylist(); // Switch to the next playlist after stopping

                    // Start playback after switching playlist
                    setTimeout(function() {
                        startPlayback(); // Start playback on the next playlist
                    }, 1000); // Give a short delay before starting the new playlist

                }, stopDuration); // 30-second delay before switching to next playlist

            }, playDuration); // After 5 minutes of play, stop the music

        }, 0); // Start immediately (first cycle starts)

    } else {
        console.log("Finished 10 cycles of 5 minutes play.");
        localStorage.removeItem('currentPlaylistIndex'); // Reset playlist index after completing all cycles
    }
})();

