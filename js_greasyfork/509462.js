// ==UserScript==
// @name         Kick.com Video Resume
// @namespace    https://greasyfork.org/users/1370822
// @version      1.0
// @description  Automatically bookmarks Kick.com videos and resumes where you left off.
// @author       HANT3R
// @license      MIT
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509462/Kickcom%20Video%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/509462/Kickcom%20Video%20Resume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let saveInterval = null;
    let lastSavedTime = 0;

    // Function to save video time to local storage every 5 seconds
    function saveVideoTime(video) {
        const videoId = window.location.pathname; // Get unique video URL or ID
        const currentTime = Math.floor(video.currentTime); // Round off to avoid excessive changes
        if (currentTime !== lastSavedTime) {
            localStorage.setItem(`kick_video_time_${videoId}`, currentTime);
            lastSavedTime = currentTime;
        }
    }

    // Function to load video time from local storage
    function loadVideoTime(video) {
        const videoId = window.location.pathname;
        const savedTime = localStorage.getItem(`kick_video_time_${videoId}`);
        if (savedTime) {
            video.currentTime = parseFloat(savedTime);
            console.log(`Resuming video from ${savedTime} seconds`);
        }
    }

    // Initialize video resume functionality
    function initVideoResume(video) {
        loadVideoTime(video);

        // Set an interval to save the video time every 5 seconds
        saveInterval = setInterval(() => saveVideoTime(video), 5000);

        // Also save when the video is paused
        video.addEventListener('pause', () => saveVideoTime(video));

        // Cleanup when video ends or is no longer available
        video.addEventListener('ended', () => clearInterval(saveInterval));
    }

    // Wait for the video element to load
    function onVideoLoad() {
        const video = document.querySelector('video');
        if (video && !video.hasAttribute('data-resume-init')) {
            video.setAttribute('data-resume-init', 'true'); // Prevent reinitialization
            video.addEventListener('loadeddata', () => initVideoResume(video), { once: true });
        }
    }

    // Observe DOM changes to detect when a new video loads
    const observer = new MutationObserver(onVideoLoad);
    observer.observe(document.body, { childList: true, subtree: true });

})();
