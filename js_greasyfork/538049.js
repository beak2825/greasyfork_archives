// ==UserScript==
// @name         YouTube Video Zoom (using =/- & +/- keys)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zoom YouTube video in/out by 4%
// @author       ankit
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538049/YouTube%20Video%20Zoom%20%28using%20%3D-%20%20%2B-%20keys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538049/YouTube%20Video%20Zoom%20%28using%20%3D-%20%20%2B-%20keys%29.meta.js
// ==/UserScript==

// Function to change the video player size (zoom in/out)
function changeZoom(increase) {
    const player = document.querySelector('video');  // Get the video element
    if (!player) return;  // Exit if the video is not found

    let currentScale = parseFloat(player.style.transform.replace('scale(', '').replace(')', '') || 1);
    if (increase) {
        currentScale += 0.04;  // Increase by 4%
    } else {
        currentScale -= 0.04;  // Decrease by 4%
    }

    // Ensure the scale is within reasonable limits (e.g., between 0.2 and 3)
    currentScale = Math.max(0.2, Math.min(3, currentScale));

    // Apply the new zoom level only to the video player
    player.style.transform = `scale(${currentScale})`;
    player.style.transformOrigin = 'center'; // Ensure zoom happens from the center

    // Prevent captions from being affected by the zoom
    const captions = document.querySelector('.ytp-caption-window');
    if (captions) {
        captions.style.transform = 'none';  // Ensure captions are not zoomed
        captions.style.fontSize = 'initial';  // Reset font size if zooming causes size changes
    }
}

// Listen for key events (pressing + or -)
document.addEventListener('keydown', function(event) {
    if (event.key === '=' || event.key === '+') {  // Zoom In
        changeZoom(true);
    } else if (event.key === '-' || event.key === '_') {  // Zoom Out
        changeZoom(false);
    }
});
