// ==UserScript==
// @name         Mouse Trail
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a mouse trail effect with an image to any website
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529052/Mouse%20Trail.user.js
// @updateURL https://update.greasyfork.org/scripts/529052/Mouse%20Trail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Image URL for the mouse trail
    const imageUrl = 'https://cdn.creazilla.com/emojis/42013/grinning-face-with-smiling-eyes-emoji-clipart-lg.png'; // Replace with your image URL

    // Trail settings
    const trailSize = 25; // Size of each trail image (width and height)
    const trailDuration = 300; // Time in ms for how long each trail image lasts

    // Create a container for each trail image
    function createTrailImage(x, y) {
        const trailImage = document.createElement('img');
        trailImage.src = imageUrl; // Set image URL
        trailImage.style.position = 'absolute';
        trailImage.style.width = `${trailSize}px`;
        trailImage.style.height = `${trailSize}px`;
        trailImage.style.left = `${x - trailSize / 2}px`; // Center image on the cursor
        trailImage.style.top = `${y - trailSize / 2}px`; // Center image on the cursor
        trailImage.style.pointerEvents = 'none'; // Don't allow interaction with the trail image
        trailImage.style.zIndex = '9999'; // Ensure it's above most content
        trailImage.style.transition = 'transform 0.1s ease-out'; // Smooth transition effect

        // Append to the body
        document.body.appendChild(trailImage);

        // Remove the trail image after the specified duration
        setTimeout(() => {
            trailImage.remove();
        }, trailDuration);
    }

    // Update trail image on mouse movement
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        createTrailImage(mouseX, mouseY);
    });
})();
