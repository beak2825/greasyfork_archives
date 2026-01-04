// ==UserScript==
// @name         Diff AM Pl time 
// @namespace    https://greasyfork.org/Am w diff timing pl
// @version      1.2
// @description  Diff timing AM sk
// @license      MIT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523776/Diff%20AM%20Pl%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/523776/Diff%20AM%20Pl%20time.meta.js
// ==/UserScript==

var counter = 0; // Initialize a counter variable

// Define the playlist URLs
var playlists = [
    'https://music.apple.com/sg/playlist/who-jimin/pl.u-leyl0YPIM2yV9qW',
    'https://music.apple.com/sg/album/muse/1751773074',
    'https://music.apple.com/sg/playlist/jimin-who-13/pl.u-pMylEbRtKob8ZW',
];

// Define playback durations (in milliseconds) for each playlist
var playbackDurations = [
    25 * 60 * 1000, // 25 minutes for playlist 1
    20 * 60 * 1000, // 20 minutes for playlist 2
    30 * 60 * 1000, // 30 minutes for playlist 3
];

// Define delay durations (in milliseconds) for each playlist
var delayDurations = [20 * 1000,22 * 1000,24 * 1000];

if (
    playlists.length !== playbackDurations.length ||
    playlists.length !== delayDurations.length
) {
    console.error("Error: The playlists, playbackDurations, and delayDurations arrays must have the same length.");
}

function playButtonClick() {
    var playButton = document.querySelector('.play-button.svelte-1fx4rnm.play-button--standard');
    if (playButton) {
        playButton.click();
        console.log("Play button clicked. Autoplay started.");
    } else {
        console.log("Play button not found. Retrying...");
        setTimeout(playButtonClick, 1000);
    }
}

function stopMusic() {
    var stopButton = document.querySelector('button[aria-label="Pause"]');
    if (stopButton) {
        stopButton.click();
        console.log("Music stopped.");
    } else {
        console.log("Stop button not found.");
    }
}

function switchToNextPlaylist() {
    var currentPlaylistIndex = parseInt(localStorage.getItem('currentPlaylistIndex') || 0);
    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlists.length;
    localStorage.setItem('currentPlaylistIndex', currentPlaylistIndex);
    var nextPlaylistUrl = playlists[currentPlaylistIndex];
    console.log("Switching to playlist: " + nextPlaylistUrl);
    window.location.href = nextPlaylistUrl;
}

function startPlayback() {
    setTimeout(function() {
        console.log("Waiting for the page to load before clicking Play...");
        var playButton = document.querySelector('.play-button.svelte-1fx4rnm.play-button--standard');
        if (playButton) {
            playButton.click();
            console.log("Autoplay started.");
        } else {
            console.log("Play button not found after switching playlist.");
        }
    }, 8000);
}

(function loop() {
    var currentPlaylistIndex = parseInt(localStorage.getItem('currentPlaylistIndex') || 0);

    if (counter < 10) {
        var playDuration = playbackDurations[currentPlaylistIndex] || 25 * 60 * 1000;
        var delayDuration = delayDurations[currentPlaylistIndex] || 20 * 1000;

        console.log("Playing playlist for " + playDuration / (60 * 1000) + " minutes...");

        setTimeout(function() {
            playButtonClick();
            counter++;

            setTimeout(function() {
                console.log("Stopping playback...");
                stopMusic();

                setTimeout(function() {
                    console.log("Delaying for " + delayDuration / 1000 + " seconds...");
                    switchToNextPlaylist();

                    setTimeout(function() {
                        startPlayback();
                    }, 1000);

                }, delayDuration);

            }, playDuration);

        }, 0);

    } else {
        console.log("Completed 10 cycles of playback.");
        localStorage.removeItem('currentPlaylistIndex');
    }
})();
