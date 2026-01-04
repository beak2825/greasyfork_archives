// ==UserScript==
// @name         Shellshockers.io Performance Booster and fps cap
// @namespace    https://shellshock.io/
// @version      1.2
// @description  Reduce lag and cap FPS in Shellshockers.io (Real 100% +editable fps) pls rate.
// @author       LTE emperor
// @license MIT
// @match        *://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522788/Shellshockersio%20Performance%20Booster%20and%20fps%20cap.user.js
// @updateURL https://update.greasyfork.org/scripts/522788/Shellshockersio%20Performance%20Booster%20and%20fps%20cap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function optimizePerformance() {
        const config = {
            shadows: false, // Disable shadows
            particles: false, // Remove extra particles
            postProcessing: false, // Turn off post-processing effects
            fpsCap: 144 // Set FPS cap (Adjustable)
        };

        const optimize = () => {
            try {
                let settings = window.localStorage.getItem('settings');
                if (settings) {
                    settings = JSON.parse(settings);
                    settings.shadows = config.shadows;
                    settings.particles = config.particles;
                    settings.postProcessing = config.postProcessing;
                    settings.fps = config.fpsCap;
                    window.localStorage.setItem('settings', JSON.stringify(settings));
                    console.log("Performance settings applied!");
                }
            } catch (e) {
                console.error("Failed to apply settings:", e);
            }
        };

        // Hook into the game rendering loop
        const modifyRendering = () => {
            requestAnimationFrame = (callback) => setTimeout(callback, 1000 / config.fpsCap);
            console.log("FPS adjusted to:", config.fpsCap);
        };

        optimize();
        modifyRendering();
    }

    // Run optimization when the game starts
    window.addEventListener('load', optimizePerformance);
})();