// ==UserScript==
// @name         FPS bosster 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  now the lag def gone
// @author       Leo
// @match        https://arras.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505205/FPS%20bosster%202.user.js
// @updateURL https://update.greasyfork.org/scripts/505205/FPS%20bosster%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply FPS-boosting optimizations
    function applyFPSBoost() {
        // Reduce rendering quality
        let style = document.createElement('style');
        style.innerHTML = `
            canvas {
                image-rendering: pixelated !important;
            }
            .some-high-resource-class {
                display: none !important; /* Hide or optimize high-resource elements */
            }
        `;
        document.head.appendChild(style);

        // Disable unnecessary animations
        let animationStyles = document.createElement('style');
        animationStyles.innerHTML = `
            @keyframes none { from { opacity: 1; } to { opacity: 1; } }
            * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(animationStyles);

        // Hide or optimize specific elements
        let leaderboard = document.querySelector('#leaderboard');
        if (leaderboard) {
            leaderboard.style.display = 'none';
        }

        // Throttle update rates
        throttleGameUpdates();

        console.log('FPS booster optimizations applied.');
    }

    // Function to throttle game updates
    function throttleGameUpdates() {
        // Example: Throttle the game render function
        let originalRender = window.gameRenderFunction;
        window.gameRenderFunction = function() {
            if (Date.now() - (this.lastRender || 0) > 100) { // Adjust the delay as needed
                this.lastRender = Date.now();
                originalRender.apply(this, arguments);
            }
        };

        // Example: Throttle other high-frequency updates
        let originalUpdate = window.gameUpdateFunction;
        window.gameUpdateFunction = function() {
            if (Date.now() - (this.lastUpdate || 0) > 100) { // Adjust the delay as needed
                this.lastUpdate = Date.now();
                originalUpdate.apply(this, arguments);
            }
        };

        console.log('Game updates throttled.');
    }

    // Apply FPS boost once the game has loaded
    window.addEventListener('load', applyFPSBoost);
})();
