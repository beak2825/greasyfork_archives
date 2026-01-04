// ==UserScript==
// @name         Replace Custom Video Players
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace custom video players by recreating video elements
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522242/Replace%20Custom%20Video%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/522242/Replace%20Custom%20Video%20Players.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to recreate video elements
    function recreateVideo(video) {
        // Get the source of the video
        const videoSrc = video.src || video.querySelector('source')?.src;
        if (!videoSrc) return; // Skip if no source is found

        // Create a new video element
        const newVideo = document.createElement('video');
        newVideo.src = videoSrc;
        newVideo.controls = true; // Add controls
        newVideo.autoplay = false; // Disable autoplay
        newVideo.muted = false; // Ensure unmuted by default
        newVideo.style.width = video.style.width || '100%'; // Preserve styling
        newVideo.id = `video-${Date.now()}`; // Assign a unique ID

        // Replace the old video element
        video.parentNode.replaceChild(newVideo, video);

        console.log(`Replaced video element with new ID: ${newVideo.id}`);
    }

    // Process all videos on the page
    function processVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => {
            recreateVideo(video);
        });
    }

    // Observe DOM changes to handle dynamically added videos
    const observer = new MutationObserver(() => {
        processVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial pass to process existing videos
    processVideos();
})();
