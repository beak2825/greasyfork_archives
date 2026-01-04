// ==UserScript==
// @name         Fullscreen Video Speed Controller
// @version      2.2.0
// @description  Control playback speed, and seek for fullscreen videos with extended shortcuts
// @author       Wanten
// @copyright    2025 Wanten
// @license      MIT
// @supportURL   https://gist.github.com/WantenMN/c0afabc32a911d4dd10e06cff6bcb211
// @homepageURL  https://gist.github.com/WantenMN/c0afabc32a911d4dd10e06cff6bcb211
// @namespace    https://greasyfork.org/en/scripts/536243
// @run-at       document-end
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536243/Fullscreen%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/536243/Fullscreen%20Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to get the fullscreen video element
    function getFullscreenVideo() {
        if (document.fullscreenElement && document.fullscreenElement.tagName === 'VIDEO') {
            return document.fullscreenElement;
        }

        const videos = document.getElementsByTagName('video');
        for (const video of videos) {
            if (video.offsetWidth === window.innerWidth && video.offsetHeight === window.innerHeight) {
                return video;
            }
        }
        return null;
    }

    // Function to set the video speed
    function setVideoSpeed(speed) {
        const video = getFullscreenVideo();
        if (video && video.playbackRate != speed) {
            video.playbackRate = speed;

            if (video.playbackRate === 1) {
                // Fix audio/video synchronization issues
                video.currentTime = video.currentTime;
            }
        }
    }

    // Function to seek the video forward or backward
    function seekVideo(offset) {
        const video = getFullscreenVideo();
        if (video) {
            let newTime = video.currentTime + offset;

            // Clamp time within [0, duration]
            if (newTime < 0) newTime = 0;
            if (newTime > video.duration) newTime = video.duration;

            video.currentTime = newTime;
        }
    }

    // Event listeners for key presses
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'j':
                setVideoSpeed(1);
                break;
            case 'k':
                setVideoSpeed(2);
                break;
            case 'l':
                setVideoSpeed(3);
                break;
            case 'h':
                seekVideo(-5); // Rewind 5 seconds
                break;
            case ';':
                seekVideo(5); // Fast-forward 5 seconds
                break;
            case 'o':
                seekVideo(-90); // Jump backward 90 seconds, clamp at 0
                break;
            case 'p':
                seekVideo(90); // Jump forward 90 seconds, clamp at video end
                break;
        }
    });
})();
