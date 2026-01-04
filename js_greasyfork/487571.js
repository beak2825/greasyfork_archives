// ==UserScript==
// @name         Useless Things Series: Circle 1
// @namespace    Useless Things Series: ??
// @version      1.0
// @description  Display a spinning circle
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487571/Useless%20Things%20Series%3A%20Circle%201.user.js
// @updateURL https://update.greasyfork.org/scripts/487571/Useless%20Things%20Series%3A%20Circle%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isOverlayVisible = false;
    let rotationAngle = 0;
    let rotationInterval;

    // Circle settings
    let circleRadius = 160; // Initial radius of the circle
    let centerX = 600; // Initial X-coordinate of the center
    let centerY = 200; // Initial Y-coordinate of the center
    const rotationSpeed = 0.01; // Speed of rotation in radians per frame (adjustable)
    const numCircles = 130; // Number of circles

    // Create circle overlay
    const circleOverlay = document.createElement('div');
    circleOverlay.style.position = 'fixed';
    circleOverlay.style.top = '0';
    circleOverlay.style.left = '0';
    circleOverlay.style.width = '100%';
    circleOverlay.style.height = '100%';
    circleOverlay.style.pointerEvents = 'none';
    circleOverlay.style.zIndex = '9999';
    circleOverlay.style.display = 'none';

    // Function to rotate circles gradually
    function rotateCircles() {
        rotationAngle += rotationSpeed;
        const circles = circleOverlay.querySelectorAll('div');
        circles.forEach((circle, index) => {
            const angle = rotationAngle + (index * (2 * Math.PI) / numCircles);
            const xOffset = circleRadius * Math.cos(angle);
            const yOffset = circleRadius * Math.sin(angle);
            circle.style.left = `${centerX + xOffset}px`;
            circle.style.top = `${centerY + yOffset}px`;
        });
    }

    // Add circles with transparent background
    for (let i = 0; i < numCircles; i++) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.width = `${circleRadius * 2}px`;
        circle.style.height = `${circleRadius * 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'transparent'; // Transparent background
        circle.style.border = '1px solid #000'; // Circle border color
        circle.style.transition = 'transform 0.05s linear'; // Smooth transition for rotation
        circleOverlay.appendChild(circle);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'l') {
            if (!isOverlayVisible) {
                document.body.appendChild(circleOverlay);
                isOverlayVisible = true;
                circleOverlay.style.display = 'block';
                rotationInterval = setInterval(rotateCircles, 100); // 100 milliseconds interval for smooth animation
            } else {
                document.body.removeChild(circleOverlay);
                isOverlayVisible = false;
                circleOverlay.style.display = 'none';
                clearInterval(rotationInterval);
            }
        }
    });

})();
