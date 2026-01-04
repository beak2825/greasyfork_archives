// ==UserScript==
// @name         Cryzen.io FPS Booster (Dynamic Resolution)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Optimize settings for better FPS in Cryzen.io with dynamic resolution scaling and memory leak fixes.
// @author       Your Name
// @match        *://cryzen.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526828/Cryzenio%20FPS%20Booster%20%28Dynamic%20Resolution%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526828/Cryzenio%20FPS%20Booster%20%28Dynamic%20Resolution%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let optimizationEnabled = true;
    let lowResolutionEnabled = false; // Flag to track if low resolution mode is active
    const FPS_THRESHOLD_LOW = 30;  // Reduce resolution if FPS drops below this
    const FPS_THRESHOLD_HIGH = 50; // Restore full resolution if FPS rises above this
    const OPTIMIZATION_INTERVAL = 3000; // Apply optimizations every 3 seconds

    let lastCheck = performance.now();
    let fps = 0;
    let lastTime = performance.now();
    
    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.zIndex = '1000';
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

        // Hide high-detail elements
        document.querySelectorAll('.high-detail').forEach(element => {
            element.style.display = 'none';
        });
    }

    function monitorFPS() {
        setInterval(() => {
            const now = performance.now();
            const elapsedTime = now - lastTime;

            fpsDisplay.innerText = `FPS: ${fps}`;
            
            // Dynamic Resolution Adjustment
            if (fps < FPS_THRESHOLD_LOW && !lowResolutionEnabled) {
                lowResolutionEnabled = true;
                adjustCanvasResolution(0.5); // Reduce resolution
            } else if (fps > FPS_THRESHOLD_HIGH && lowResolutionEnabled) {
                lowResolutionEnabled = false;
                adjustCanvasResolution(1); // Restore full resolution
            }

            fps = 0;
            lastTime = now;
        }, 1000);
    }

    function countFrames() {
        fps++;
        requestAnimationFrame(countFrames);
    }

    function throttleOptimization() {
        setInterval(() => {
            optimizeGame();
        }, OPTIMIZATION_INTERVAL);
    }

    countFrames();
    monitorFPS();
    throttleOptimization();
})();
