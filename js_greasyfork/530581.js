// ==UserScript==
// @name         Generic HTML5 Speed Controller with UI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adjusts HTML5 timing speed with a bottom-middle controller
// @author       jayef
// @match        https://stake.bet/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530581/Generic%20HTML5%20Speed%20Controller%20with%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/530581/Generic%20HTML5%20Speed%20Controller%20with%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial speed multiplier (1 = normal)
    let speedMultiplier = 1;

    // Store original timing functions
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalRequestAnimationFrame = window.requestAnimationFrame;

    // Function to apply speed changes
    function updateSpeed() {
        window.setTimeout = function(callback, delay, ...args) {
            return originalSetTimeout(callback, delay / speedMultiplier, ...args);
        };
        window.setInterval = function(callback, delay, ...args) {
            return originalSetInterval(callback, delay / speedMultiplier, ...args);
        };
        window.requestAnimationFrame = function(callback) {
            return originalRequestAnimationFrame(function(timestamp) {
                callback(timestamp / speedMultiplier);
            });
        };
        document.getElementById('speedDisplay').textContent = `${speedMultiplier.toFixed(1)}x`;
        console.log(`Speed updated to ${speedMultiplier}x`);
    }

    // Create the controller UI
    const controller = document.createElement('div');
    controller.style.position = 'fixed';
    controller.style.bottom = '10px';
    controller.style.left = '50%';
    controller.style.transform = 'translateX(-50%)';
    controller.style.backgroundColor = '#333';
    controller.style.color = '#fff';
    controller.style.padding = '10px';
    controller.style.borderRadius = '5px';
    controller.style.zIndex = '9999';
    controller.style.display = 'flex';
    controller.style.gap = '10px';
    controller.style.fontFamily = 'Arial, sans-serif';

    // Speed decrease button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.style.padding = '5px 10px';
    decreaseBtn.style.cursor = 'pointer';
    decreaseBtn.addEventListener('click', () => {
        speedMultiplier = Math.max(0.1, speedMultiplier - 0.1); // Minimum 0.1x
        updateSpeed();
    });

    // Speed display
    const speedDisplay = document.createElement('span');
    speedDisplay.id = 'speedDisplay';
    speedDisplay.textContent = '1.0x';
    speedDisplay.style.padding = '5px';

    // Speed increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.style.padding = '5px 10px';
    increaseBtn.style.cursor = 'pointer';
    increaseBtn.addEventListener('click', () => {
        speedMultiplier = Math.min(10, speedMultiplier + 0.1); // Maximum 10x
        updateSpeed();
    });

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.padding = '5px 10px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.addEventListener('click', () => {
        speedMultiplier = 1;
        updateSpeed();
    });

    // Assemble the controller
    controller.appendChild(decreaseBtn);
    controller.appendChild(speedDisplay);
    controller.appendChild(increaseBtn);
    controller.appendChild(resetBtn);
    document.body.appendChild(controller);

    // Apply initial speed settings
    updateSpeed();
})();