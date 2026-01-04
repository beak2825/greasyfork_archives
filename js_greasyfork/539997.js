// ==UserScript==
// @name         Bloxd.io 1000 FPS Optimizer
// @namespace    https://bloxd.io
// @version      1.0
// @description  Optimizes Bloxd.io for higher FPS (up to 1000 FPS)
// @author       KING BLOXD
// @match        https://bloxd.io/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539997/Bloxdio%201000%20FPS%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/539997/Bloxdio%201000%20FPS%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the game to load
    window.addEventListener('load', function() {
        // Check if the game canvas exists
        const checkCanvas = setInterval(function() {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                clearInterval(checkCanvas);
                optimizeGame(canvas);
            }
        }, 100);
    });

    function optimizeGame(canvas) {
        try {
            // Get the WebGL context
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                // Override requestAnimationFrame for higher FPS
                let lastTime = 0;
                const originalRAF = window.requestAnimationFrame;
                window.requestAnimationFrame = function(callback) {
                    const now = performance.now();
                    const timeToCall = Math.max(0, 1 - (now - lastTime));
                    const id = window.setTimeout(function() {
                        callback(now + timeToCall);
                    }, timeToCall);
                    lastTime = now + timeToCall;
                    return id;
                };

                // Increase the maximum FPS
                const targetFPS = 1000;
                const frameTime = 1000 / targetFPS;

                // Optimize WebGL settings
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.STENCIL_TEST);
                gl.disable(gl.DITHER);
                gl.disable(gl.POLYGON_OFFSET_FILL);
                gl.disable(gl.SAMPLE_COVERAGE);
                gl.disable(gl.SCISSOR_TEST);
                gl.disable(gl.CULL_FACE);

                // Lower rendering quality for performance
                gl.canvas.width = Math.min(gl.canvas.width, 1920);
                gl.canvas.height = Math.min(gl.canvas.height, 1080);

                console.log('Bloxd.io FPS optimization applied! Target FPS: ' + targetFPS);
            } else {
                console.log('Could not get WebGL context for optimization');
            }
        } catch (e) {
            console.error('Error optimizing Bloxd.io:', e);
        }
    }

    // Additional optimizations
    document.addEventListener('DOMContentLoaded', function() {
        // Reduce quality settings if they exist
        try {
            if (window.gameSettings) {
                window.gameSettings.graphicsQuality = 'low';
                window.gameSettings.renderDistance = 4;
                window.gameSettings.particles = false;
            }
        } catch (e) {}

        // Disable potentially heavy effects
        const style = document.createElement('style');
        style.innerHTML = `
            canvas {
                image-rendering: optimizeSpeed;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: optimize-contrast;
                image-rendering: pixelated;
                -ms-interpolation-mode: nearest-neighbor;
            }
            * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    });
})();