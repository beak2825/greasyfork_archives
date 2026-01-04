// ==UserScript==
// @name         Smashkarts Performance Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improve overall game performance by disabling resource-heavy features and limiting frame rate.
// @author       You
// @match        *://*.smashkarts.io/*
// @grant        none
// @run-at       document-end
// @license      All rights reserved  // <-- License added
// @downloadURL https://update.greasyfork.org/scripts/531416/Smashkarts%20Performance%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/531416/Smashkarts%20Performance%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable background music
    function disableBackgroundMusic() {
        let backgroundMusic = document.querySelector('audio');
        if (backgroundMusic) {
            backgroundMusic.muted = true; // Mutes the background music
        }
    }

    // Reduce or remove particle effects (if present)
    function disableParticles() {
        let particleSystems = document.querySelectorAll('.particle-system');
        particleSystems.forEach((system) => {
            system.style.display = "none"; // Hides particle systems for better performance
        });
    }

    // Lower the framerate for smoother performance (limit to 30 FPS)
    function limitFrameRate() {
        let originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            setTimeout(() => {
                originalRequestAnimationFrame(callback);
            }, 1000 / 30); // Throttles the frame rate to 30fps
        };
    }

    // Minimize DOM manipulation (show/hide instead of adding/removing elements)
    function optimizeDomManipulation() {
        let keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach((box) => {
            box.style.transition = 'none'; // Disable transitions to improve performance
        });
    }

    // Optimize key event listeners (avoid constant DOM updates)
    function optimizeKeyEventListeners() {
        let lastPressedKey = null;

        document.addEventListener('keydown', function(event) {
            var key = event.key.toUpperCase();
            if (key === " ") key = "SPACE";
            if (key === "CONTROL") key = "CONTROL";

            if (key !== lastPressedKey) {
                // Change color or visibility based on key press, update DOM minimally
                updateKeyBoxColor(key, true);
                lastPressedKey = key;
            }
        });

        document.addEventListener('keyup', function(event) {
            var key = event.key.toUpperCase();
            if (key === " ") key = "SPACE";
            if (key === "CONTROL") key = "CONTROL";

            if (key === lastPressedKey) {
                updateKeyBoxColor(key, false);
                lastPressedKey = null;
            }
        });
    }

    // Update the color or visibility of keyboxes (minimized DOM update)
    function updateKeyBoxColor(key, isPressed) {
        let keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach(function(box) {
            if (box.textContent === key) {
                if (isPressed) {
                    box.style.backgroundColor = box.dataset.color;  // Highlight key on press
                } else {
                    box.style.backgroundColor = 'transparent'; // Reset background on release
                }
            }
        });
    }

    // Initialize optimizations
    function initializeOptimizations() {
        disableBackgroundMusic();
        disableParticles();
        limitFrameRate();
        optimizeDomManipulation();
        optimizeKeyEventListeners();
    }

    // Initialize once the document is fully loaded
    window.addEventListener('load', function() {
        initializeOptimizations();
    });

})();
