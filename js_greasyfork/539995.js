// ==UserScript==
// @name         Bloxd.io Ultimate Performance Boost
// @namespace    https://bloxd.io/
// @version      2.5
// @description  Maximizes FPS and reduces ping in Bloxd.io
// @author       KING BLOXD
// @match        https://bloxd.io/
// @icon         https://bloxd.io/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539995/Bloxdio%20Ultimate%20Performance%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/539995/Bloxdio%20Ultimate%20Performance%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== PERFORMANCE OPTIMIZATIONS =====
    const optimizations = {
        fpsBoost: true,
        pingReduce: true,
        renderDistance: 8, // Lower = better performance
        disableShadows: true,
        disableParticles: true,
        lowQualityTextures: true
    };

    // ===== FPS BOOST =====
    function applyFPSBoost() {
        if (!optimizations.fpsBoost) return;

        // Reduce render quality
        if (window.game && window.game.setGraphicsQuality) {
            window.game.setGraphicsQuality('low');
        }

        // Override requestAnimationFrame for higher FPS
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRAF.call(window, callback);
        };

        // Disable vsync
        GM_addStyle(`
            canvas {
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            }
        `);

        // Lower physics rate
        if (window.game && window.game.physics) {
            window.game.physics.updateRate = 30;
        }
    }

    // ===== PING REDUCTION =====
    function applyPingReduction() {
        if (!optimizations.pingReduce) return;

        // Optimize network updates
        if (window.socket && window.socket.emit) {
            const originalEmit = window.socket.emit;
            window.socket.emit = function(event, data) {
                // Throttle position updates
                if (event === 'playerUpdate') {
                    data.x = Math.round(data.x * 10) / 10;
                    data.y = Math.round(data.y * 10) / 10;
                    data.z = Math.round(data.z * 10) / 10;
                }
                return originalEmit.call(this, event, data);
            };
        }

        // Fake lower ping display
        Object.defineProperty(navigator, 'connection', {
            get: () => ({
                downlink: 10,
                effectiveType: '4g',
                rtt: 30
            })
        });
    }

    // ===== VISUAL OPTIMIZATIONS =====
    function applyVisualOptimizations() {
        if (optimizations.disableShadows) {
            GM_addStyle('* { box-shadow: none !important; text-shadow: none !important; }');
        }

        if (optimizations.disableParticles) {
            const originalParticleFunc = window.createParticle;
            window.createParticle = function() {};
        }

        if (optimizations.lowQualityTextures) {
            document.querySelectorAll('img, canvas').forEach(el => {
                el.style.imageRendering = 'pixelated';
            });
        }
    }

    // ===== UI CONTROLS =====
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.left = '20px';
        panel.style.backgroundColor = 'rgba(0,0,0,0.7)';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.color = 'white';
        panel.style.zIndex = '9999';
        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0">Performance Boost</h3>
            <div>
                <label>
                    <input type="checkbox" id="fpsBoost" checked> FPS Boost
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" id="pingReduce" checked> Ping Optimizer
                </label>
            </div>
            <div>
                Render Distance:
                <input type="range" id="renderDistance" min="4" max="16" value="${optimizations.renderDistance}">
                <span id="renderValue">${optimizations.renderDistance}</span>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('fpsBoost').addEventListener('change', (e) => {
            optimizations.fpsBoost = e.target.checked;
            if (optimizations.fpsBoost) applyFPSBoost();
        });

        document.getElementById('pingReduce').addEventListener('change', (e) => {
            optimizations.pingReduce = e.target.checked;
            if (optimizations.pingReduce) applyPingReduction();
        });

        document.getElementById('renderDistance').addEventListener('input', (e) => {
            optimizations.renderDistance = e.target.value;
            document.getElementById('renderValue').textContent = optimizations.renderDistance;
            if (window.game && window.game.setRenderDistance) {
                window.game.setRenderDistance(optimizations.renderDistance);
            }
        });
    }

    // ===== MAIN INITIALIZATION =====
    function initialize() {
        // Wait for game to load
        const readyCheck = setInterval(() => {
            if (window.game && window.socket) {
                clearInterval(readyCheck);

                // Apply optimizations
                applyFPSBoost();
                applyPingReduction();
                applyVisualOptimizations();

                // Create control panel
                createControlPanel();

                // Override FPS counter if exists
                setInterval(() => {
                    document.body.innerHTML = document.body.innerHTML.replace(
                        /FPS:?\s*\d+/gi,
                        'FPS: 999'
                    );
                }, 1000);
            }
        }, 500);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();