// ==UserScript==
// @name         Video Zoom Controls with Upscaling and Pan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows zooming in and out on any video playing within the browser with keys z (zoom in) and x (zoom out), with upscaling for better picture quality, and panning with Shift + A, W, S, D. Press Shift + R to reset zoom and pan.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492501/Video%20Zoom%20Controls%20with%20Upscaling%20and%20Pan.user.js
// @updateURL https://update.greasyfork.org/scripts/492501/Video%20Zoom%20Controls%20with%20Upscaling%20and%20Pan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to zoom the video
    function zoomVideo(video, scaleFactor) {
        const currentScale = parseFloat(video.dataset.scale) || 1;
        const newScale = currentScale * scaleFactor;
        video.style.transform = `scale(${newScale}) translate(${video.dataset.panX}px, ${video.dataset.panY}px)`;
        video.dataset.scale = newScale;
    }

    // Function to pan the video
    function panVideo(video, deltaX, deltaY) {
        const panX = parseFloat(video.dataset.panX) || 0;
        const panY = parseFloat(video.dataset.panY) || 0;
        video.dataset.panX = panX + deltaX;
        video.dataset.panY = panY + deltaY;
        zoomVideo(video, 1); // Reset zoom to apply pan
    }

    // Function to reset zoom and pan
    function resetZoomAndPan(video) {
        video.dataset.scale = 1;
        video.dataset.panX = 0;
        video.dataset.panY = 0;
        zoomVideo(video, 1); // Reset zoom and pan
    }

    // Apply image-rendering property for better quality
    const style = document.createElement('style');
    style.innerHTML = `
        video {
            image-rendering: optimizeQuality; /* You can change this to 'crisp-edges' or other values for different interpolation */
        }
    `;
    document.head.appendChild(style, {nonce: 'Trusted Type Policy'});

    // Event listener for keypress
    document.addEventListener('keypress', function(event) {
        if (event.shiftKey && event.key === 'Z') {
            // Zoom in when Shift + Z keys are pressed
            const videos = document.querySelectorAll('video');
            videos.forEach(video => zoomVideo(video, 1.02)); // You can adjust the zoom factor here
        } else if (event.shiftKey && event.key === 'X') {
            // Zoom out when Shift + X keys are pressed
            const videos = document.querySelectorAll('video');
            videos.forEach(video => zoomVideo(video, 0.98)); // You can adjust the zoom factor here
        }
    });

    // Event listener for Shift + A, W, S, D keys for panning
    document.addEventListener('keydown', function(event) {
        const deltaX = event.key === 'A' ? -10 : event.key === 'D' ? 10 : 0;
        const deltaY = event.key === 'W' ? -10 : event.key === 'S' ? 10 : 0;

        if (deltaX !== 0 || deltaY !== 0) {
            // Pan when Shift + A, W, S, or D keys are pressed
            const videos = document.querySelectorAll('video');
            videos.forEach(video => panVideo(video, deltaX, deltaY)); // You can adjust the pan speed here
        } else if (event.shiftKey && event.key === 'R') {
            // Reset zoom and pan when Shift + R keys are pressed
            const videos = document.querySelectorAll('video');
            videos.forEach(video => resetZoomAndPan(video));
        }
    });

    // Store original zoom level when video is first loaded
    document.addEventListener('DOMContentLoaded', function() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.dataset.scale = 1;
            video.dataset.panX = 0;
            video.dataset.panY = 0;
        });
    });
})();
