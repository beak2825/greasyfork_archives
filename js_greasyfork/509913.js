// ==UserScript==
// @name         Prevent Auto Fullscreen and Play Normally
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Prevents videos from going fullscreen when playing and ensures normal playback without auto fullscreen.
// @author       Your Name
// @match        *://www.xjrsjxjy.com/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509913/Prevent%20Auto%20Fullscreen%20and%20Play%20Normally.user.js
// @updateURL https://update.greasyfork.org/scripts/509913/Prevent%20Auto%20Fullscreen%20and%20Play%20Normally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to block fullscreen requests and ensure normal playback
    function blockFullscreenRequests() {
        const videoPlayers = document.querySelectorAll('video');  // Select all video elements

        if (videoPlayers.length > 0) {
            videoPlayers.forEach(video => {
                // Override fullscreen methods to block fullscreen
                ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].forEach(method => {
                    if (video[method]) {
                        video[method] = function() {
                            console.log('Blocked fullscreen request');
                            return false;  // Prevent fullscreen request
                        };
                    }
                });

                // Ensure the video starts playing normally when play is triggered
                video.addEventListener('play', function() {
                    console.log('Video is playing, fullscreen blocked');
                });

                // If video pauses after exiting fullscreen, make sure it resumes playing
                video.addEventListener('pause', function() {
                    if (!document.fullscreenElement) {
                        console.log('Resuming video playback after exiting fullscreen');
                        video.play();  // Resume playing if video pauses after exiting fullscreen
                    }
                });
            });
        } else {
            console.error('No video players found');
        }
    }

    // Mutation observer to apply the script to dynamically loaded video elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    blockFullscreenRequests();  // Apply the blocking to new video elements
                }
            });
        });
    });

    // Observe the body for dynamically added video elements
    observer.observe(document.body, { childList: true, subtree: true });

    // Initially apply the fullscreen block on page load
    window.onload = blockFullscreenRequests;

})();
