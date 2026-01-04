/**
 * capFrameRate: A function to cap the frame rate in Bonk.io to a specified value.
 *
 * @param frameRate - The desired frame rate to cap to.
 */
function capFrameRate(frameRate) {
    // Check if the script is running in a Tampermonkey-compatible environment
    if (typeof GM_registerMenuCommand !== "undefined") {
        // Create a Tampermonkey script to set the frame rate
        const script = `
            // ==UserScript==
            // @name Bonk.io Frame Rate Cap
            // @namespace Violentmonkey Scripts
            // @version 1.0
            // @description Caps the frame rate in Bonk.io to ${frameRate} FPS.
            // @match https://bonk.io/*
            // @grant none
// @downloadURL https://update.greasyfork.org/scripts/486600/Bonkio%20Frame%20Rate%20Cap.user.js
// @updateURL https://update.greasyfork.org/scripts/486600/Bonkio%20Frame%20Rate%20Cap.meta.js
            // ==/UserScript==
 
            (function() {
                'use strict';
 
                const originalRequestAnimationFrame = window.requestAnimationFrame;
 
                function cappedRequestAnimationFrame(callback) {
                    const delay = 1000 / ${frameRate};
                    let start = Date.now();
                    let previousTime = start;
 
                    function frame() {
                        const currentTime = Date.now();
                        const elapsed = currentTime - previousTime;
 
                        if (elapsed > delay) {
                            previousTime = currentTime - (elapsed % delay);
                            callback(currentTime);
                        } else {
                            originalRequestAnimationFrame(frame);
                        }
                    }
 
                    originalRequestAnimationFrame(frame);
                }
 
                window.requestAnimationFrame = cappedRequestAnimationFrame;
            })();
        `;
 
        // Inject the Tampermonkey script into the page
        const scriptElement = document.createElement("script");
        scriptElement.textContent = script;
        document.body.appendChild(scriptElement);
    } else {
        console.error("Tampermonkey is not detected. Please make sure you are running the script in a Tampermonkey-compatible environment.");
    }
}
 
// Usage example
capFrameRate(100);
