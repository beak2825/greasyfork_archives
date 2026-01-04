// ==UserScript==
// @name         30 seconds advance
// @namespace    orinarirrorilabitovi
// @license MIT
// @version      1.1
// @description  Starts the YouTube video timeline at the 30-second mark
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491681/30%20seconds%20advance.user.js
// @updateURL https://update.greasyfork.org/scripts/491681/30%20seconds%20advance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to move the video timeline
    function moveVideoTimeline(videoPlayer) {
        if (!videoPlayer) return;

        // Wait for the video player to be ready
        if (videoPlayer.readyState < videoPlayer.HAVE_METADATA) {
            videoPlayer.addEventListener('loadedmetadata', function() {
              	console.log('Current video duration:', videoPlayer.duration);
                //if (videoPlayer.currentTime < 30 && videoPlayer.duration > 55) {
                if (videoPlayer.currentTime < 30 && videoPlayer.currentTime != 0) {
                    alert(videoPlayer.currentTime);
                    videoPlayer.currentTime = 30;
                }
            });
        } else {
                //if (videoPlayer.currentTime < 30 && videoPlayer.duration > 55) {-
                if (videoPlayer.currentTime < 30 && videoPlayer.currentTime != 0) {
          	    videoPlayer.currentTime = 30;
          	}	
        }
    }

    // Function to handle DOM changes
    function handleDOMChanges(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if a new video player element is added
                var videoPlayer = document.querySelector('video');
                if (videoPlayer) {
                    moveVideoTimeline(videoPlayer); // Move the video timeline
                    break;
                }
            }
        }
    }

    // Function to observe the DOM for changes
    function observeDOMChanges() {
        var observer = new MutationObserver(function(mutationsList, observer) {
            handleDOMChanges(mutationsList, observer);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Wait for the page to load before moving the timeline
    window.addEventListener('load', function() {
        setTimeout(function() {
            var videoPlayer = document.querySelector('video');
            moveVideoTimeline(videoPlayer); // Move the video timeline
            observeDOMChanges(); // Observe DOM changes for dynamically loaded videos
        }, 2000); // Adjust the delay if necessary
    });
})();
