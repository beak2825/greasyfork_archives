// ==UserScript==
// @name         FPS Booster for arras.io
// @namespace    http://Greasyfrok.org/
// @version      0.1
// @description  godbye lag
// @author       Leo
// @match        https://arras.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505204/FPS%20Booster%20for%20arrasio.user.js
// @updateURL https://update.greasyfork.org/scripts/505204/FPS%20Booster%20for%20arrasio.meta.js
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

        // Optionally, modify or hide specific elements that are high in resource usage
        // Example: Hide the leaderboard
        let leaderboard = document.querySelector('#leaderboard');
        if (leaderboard) {
            leaderboard.style.display = 'none';
        }

        // Adjust other game settings or DOM elements here
        console.log('FPS booster optimizations applied.');
    }

    // Apply FPS boost once the game has loaded
    window.addEventListener('load', applyFPSBoost);
})();
