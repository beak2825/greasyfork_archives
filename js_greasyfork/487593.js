// ==UserScript==
// @name         Useless Things Series: Circle 3
// @namespace    Useless Things Series: ??
// @version      1.0
// @description  A mini circle that is connected to form a circle with black and white alternating color. The circle with the same properties is called to create more circle.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487593/Useless%20Things%20Series%3A%20Circle%203.user.js
// @updateURL https://update.greasyfork.org/scripts/487593/Useless%20Things%20Series%3A%20Circle%203.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to generate circles within circles
    function generateConcentricCircles(numCircles, circleRadius, smallCircleRadius, index) {
        const centerX = window.innerWidth / 2; // X-coordinate of the center
        const centerY = window.innerHeight / 2; // Y-coordinate of the center

        // Create circle overlay
        const circleOverlay = document.createElement('div');
        circleOverlay.classList.add('concentric-circles');
        circleOverlay.style.position = 'fixed';
        circleOverlay.style.top = '0';
        circleOverlay.style.left = '0';
        circleOverlay.style.width = '100%';
        circleOverlay.style.height = '100%';
        circleOverlay.style.pointerEvents = 'none';
        circleOverlay.style.zIndex = '9999';
        circleOverlay.style.display = 'none';

        // Set animation direction based on index
        const animationDirection = index % 2 === 0 ? 'clockwise' : 'counterclockwise';
        circleOverlay.style.animation = `spin-${animationDirection} 5s linear infinite`;

        // Add circles forming the larger circle
        for (let i = 0; i < numCircles; i++) {
            const angle = (Math.PI / 180) * (360 / numCircles) * i;
            const x = centerX + circleRadius * Math.cos(angle);
            const y = centerY + circleRadius * Math.sin(angle);

            const circle = document.createElement('div');
            circle.style.position = 'absolute';
            circle.style.width = `${smallCircleRadius * 2}px`;
            circle.style.height = `${smallCircleRadius * 2}px`;
            circle.style.borderRadius = '50%';
            circle.style.backgroundColor = i % 2 === 0 ? 'black' : 'white'; // Alternate black and white colors for larger circles
            circle.style.left = `${x - smallCircleRadius}px`;
            circle.style.top = `${y - smallCircleRadius}px`;

            // Alternate black and white colors for smaller circles within each larger circle
            const innerCircleColor = i % 2 === 0 ? 'white' : 'black';
            circle.innerHTML = `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${innerCircleColor};"></div>`;

            circleOverlay.appendChild(circle);
        }

        document.body.appendChild(circleOverlay);
        return circleOverlay;
    }

    let circleOverlays = []; // Array to store generated circle overlays

    function toggleCircleOverlay() {
        if (circleOverlays.length === 0) {
            for (let i = 10; i <= 250; i += 5) {
                circleOverlays.push(generateConcentricCircles(i, i, 5, i));
            }
        }
        circleOverlays.forEach(circleOverlay => {
            circleOverlay.style.display = circleOverlay.style.display === 'none' ? 'block' : 'none';
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'k') {
            toggleCircleOverlay();
        }
    });

})();

const style = document.createElement('style');
style.innerHTML = `
@keyframes spin-clockwise {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes spin-counterclockwise {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(-360deg);
    }
}`;
document.head.appendChild(style);
