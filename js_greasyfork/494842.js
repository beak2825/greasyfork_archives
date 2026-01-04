// ==UserScript==
// @name         Play Sound and Refresh Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Play a sound when the specified element is found and refresh the page every 10 seconds, only on hvr-amazon.my.site.com
// @author       You
// @match        *://hvr-amazon.my.site.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494842/Play%20Sound%20and%20Refresh%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/494842/Play%20Sound%20and%20Refresh%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the sound file path
    var soundFilePath = 'https://github.com/garouthe/loudsoundt/raw/main/33874_real.mp3';

    // Create an audio element
    var audioElement = document.createElement('audio');
    audioElement.src = soundFilePath;

    // Function to play the sound
    function playSound() {
        audioElement.play();
    }

    // Function to check if the element exists and play the sound
    function checkElement() {
        var recentJobsElement = document.getElementById('recent-jobs2');
        if (recentJobsElement) {
            playSound();
        }
    }

    // Check for the element periodically
    setInterval(checkElement, 1000); // You can adjust the interval as needed

    // Function to refresh the page
    function refreshPage() {
        window.location.reload(true); // Reloads the page from the server, not from the cache
    }

    // Refresh the page every 10 seconds
    setInterval(refreshPage, 10000); // 10000 milliseconds = 10 seconds

    // Repeat the audio when it ends
    audioElement.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
})();
