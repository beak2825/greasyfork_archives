// ==UserScript==
// @name         Cryzen.io FPS Booster ( works a bit better idk how to fix the broken cursor )
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Optimize FPS
// @author       skbiditizzlae
// @match        *://cryzen.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526829/Cryzenio%20FPS%20Booster%20%28%20works%20a%20bit%20better%20idk%20how%20to%20fix%20the%20broken%20cursor%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526829/Cryzenio%20FPS%20Booster%20%28%20works%20a%20bit%20better%20idk%20how%20to%20fix%20the%20broken%20cursor%20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let optimizationEnabled = true;
    let lowResolutionEnabled = false;
    const FPS_THRESHOLD_LOW = 30;
    const FPS_THRESHOLD_HIGH = 50;
    const CHECK_INTERVAL = 5000; // Adjust resolution every 5 seconds
    let lastResolutionCheck = performance.now();

    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.zIndex = '1000';
    fpsDisplay.style.fontSize = '14px';
    fpsDisplay.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(fpsDisplay);

    function adjustCanvasResolution(scaleFactor) {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const devicePixelRatio = window.devicePixelRatio * scaleFactor;
            canvas.width = window.innerWidth * devicePixelRatio;
            canvas.height = window.innerHeight * devicePixelRatio;
            console.log(`Canvas resolution adjusted. Scale Factor: ${scaleFactor}`);
        }
    }

    function optimizeGame() {
        if (!optimizationEnabled) return;
        document.querySelectorAll('.high-detail').forEach(element => {
            element.style.display = 'none';
        });
    }

    function fixCursorPosition() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        // Ensure the canvas stays centered
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';

        // Enable pointer lock when clicking the game
        canvas.addEventListener('click', () => {
            if (document.pointerLockElement !== canvas) {
                canvas.requestPointerLock();
            }
        });

        // Adjust mouse movement to match the scaled canvas
        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === canvas) {
                // The game expects relative movement, so we use movementX and movementY
                const correctedX = event.movementX;
                const correctedY = event.movementY;

                // Dispatch a synthetic event with corrected coordinates
                const newEvent = new MouseEvent(event.type, {
                    clientX: canvas.width / 2 + correctedX,
                    clientY: canvas.height / 2 + correctedY,
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                canvas.dispatchEvent(newEvent);
            }
        });

        console.log('Cursor position fix applied (Pointer Lock Enabled).');
    }

    function monitorFPS() {
        let fps = 0, lastTime = performance.now();

        function updateFPS() {
            const now = performance.now();
            fps++;
            if (now - lastTime >= 1000) {
                fpsDisplay.innerText = `FPS: ${fps}`;

                if (performance.now() - lastResolutionCheck >= CHECK_INTERVAL) {
                    if (fps < FPS_THRESHOLD_LOW && !lowResolutionEnabled) {
                        lowResolutionEnabled = true;
                        adjustCanvasResolution(0.5);
                    } else if (fps > FPS_THRESHOLD_HIGH && lowResolutionEnabled) {
                        lowResolutionEnabled = false;
                        adjustCanvasResolution(1);
                    }
                    lastResolutionCheck = performance.now();
                }

                fps = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateFPS);
        }

        updateFPS();
    }

    function throttleOptimization() {
        function check() {
            optimizeGame();
            fixCursorPosition(); // Ensure cursor stays centered and locked
            setTimeout(check, 1000);
        }
        check();
    }

    throttleOptimization();
    monitorFPS();
})();
