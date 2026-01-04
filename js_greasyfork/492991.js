// ==UserScript==
// @name         YouTube Video Quality Control
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Set YouTube video quality to 1080p or 720p60 depending on the video quality, avoiding 360p.
// @author       You
// @match        http*://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492991/YouTube%20Video%20Quality%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/492991/YouTube%20Video%20Quality%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set video quality to 1080p or 720p60 depending on the video quality
    const setVideoQuality = () => {
        setTimeout(() => {
            const videos = document.querySelectorAll("video");
            if (videos.length > 0) {
                videos.forEach(video => {
                    video.addEventListener('loadedmetadata', function() {
                        if (video.videoHeight >= 1080 && video.playbackRate === 1) {
                            video.setPlaybackQuality('hd1080');
                        } else if (video.videoHeight >= 1080 && video.playbackRate === 2) {
                            video.setPlaybackQuality('hd720');
                        } else if (video.playbackQuality === 'tiny') {
                            // If the video quality is 360p, set it to 720p if available
                            if (video.getAvailableQualityLevels().includes('hd720')) {
                                video.setPlaybackQuality('hd720');
                            } else {
                                // If 720p is not available, set it to 480p
                                video.setPlaybackQuality('medium');
                            }
                        }
                    });
                });
            } else {
                console.log("No video elements found.");
            }
        }, 3000); // Delay to ensure video elements are fully loaded
    };

    // Call the function when the page loads
    window.onload = () => {
        setVideoQuality();
    };

    // Reset video quality if changed during navigation
    window.addEventListener('yt-navigate-start', () => {
        setVideoQuality();
    });
})();
