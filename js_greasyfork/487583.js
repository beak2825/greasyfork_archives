// ==UserScript==
// @name         Useless Things Series: Circle 2
// @namespace    Useless Things Series: ??
// @version      1.0
// @description  Display concentric circles with alternating black and white colors on the webpage
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487583/Useless%20Things%20Series%3A%20Circle%202.user.js
// @updateURL https://update.greasyfork.org/scripts/487583/Useless%20Things%20Series%3A%20Circle%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Circle settings
    const numCircles = 150; // Number of circles
    const circleSpacing = 5; // Spacing between circles
    let circleRadius = 400; // Initial radius of the largest circle
    const centerX = window.innerWidth / 2; // X-coordinate of the center
    const centerY = window.innerHeight / 2; // Y-coordinate of the center

    // Create circle overlay
    const circleOverlay = document.createElement('div');
    circleOverlay.style.position = 'fixed';
    circleOverlay.style.top = '0';
    circleOverlay.style.left = '0';
    circleOverlay.style.width = '100%';
    circleOverlay.style.height = '100%';
    circleOverlay.style.pointerEvents = 'none';
    circleOverlay.style.zIndex = '9999';
    circleOverlay.style.display = 'none'; // Initially hidden

    // Add circles with alternating black and white colors
    for (let i = 0; i < numCircles; i++) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.width = `${circleRadius * 2}px`;
        circle.style.height = `${circleRadius * 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = i % 2 === 0 ? 'white' : 'black'; // Alternating black and white colors
        circle.style.border = '1px solid #000'; // Circle border color
        circle.style.left = `${centerX - circleRadius}px`;
        circle.style.top = `${centerY - circleRadius}px`;
        circleRadius -= circleSpacing; // Decrease circle radius for the next circle
        circleOverlay.appendChild(circle);
    }

    // Append circle overlay to the body
    document.body.appendChild(circleOverlay);

    // Toggle circle overlay visibility when 'p' key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            circleOverlay.style.display = circleOverlay.style.display === 'none' ? 'block' : 'none';
        }
    });

})();
