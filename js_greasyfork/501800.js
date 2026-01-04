// ==UserScript==
// @name         Sandbox MooMoo.io FPS, Packet Limiter, and Ping Display
// @namespace    http://tampermonkey.net/
// @author       wat
// @version      v2
// @description  Displays FPS, Packet Limiter, and Ping for sandbox.moomoo.io
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501800/Sandbox%20MooMooio%20FPS%2C%20Packet%20Limiter%2C%20and%20Ping%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/501800/Sandbox%20MooMooio%20FPS%2C%20Packet%20Limiter%2C%20and%20Ping%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fps = 0;
    let packetLimiter = 0;
    let lastPacketTime = 0;
    let packetCount = 0;
    let ping = 0;

    // Create the display box
    function createDisplayBox() {
        const box = document.createElement('div');
        box.id = 'fpsPacketBox';
        box.style.position = 'fixed';
        box.style.top = '10px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        box.style.color = 'white';
        box.style.padding = '10px';
        box.style.borderRadius = '5px';
        box.style.fontFamily = 'Arial, sans-serif';
        box.style.fontSize = '14px';
        box.style.zIndex = '9999';
        document.body.appendChild(box);
    }

    // Update the display
    function updateDisplay() {
        const box = document.getElementById('fpsPacketBox');
        if (box) {
            box.textContent = `FPS: ${fps.toFixed(2)} | Packet Limiter: ${packetLimiter.toFixed(2)} | Ping: ${ping}ms`;
        }
    }

    // Calculate FPS
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();

    function calculateFps() {
        frameCount++;
        const now = performance.now();
        const elapsed = now - lastFpsUpdateTime;

        if (elapsed >= 1000) {
            fps = (frameCount * 1000) / elapsed;
            frameCount = 0;
            lastFpsUpdateTime = now;
        }

        requestAnimationFrame(calculateFps);
    }

    // Intercept WebSocket messages to calculate packet limiter and ping
    function interceptWebSocket() {
        const oldWSSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            const now = performance.now();
            packetCount++;

            if (now - lastPacketTime >= 1000) {
                packetLimiter = packetCount;
                packetCount = 0;
                lastPacketTime = now;
            }

            // Check for ping packet
            if (data instanceof ArrayBuffer) {
                const view = new Uint8Array(data);
                if (view[0] === 5 && view.length === 1) {  // Assuming 5 is the ping packet ID
                    this.pingStartTime = now;
                }
            }

            oldWSSend.apply(this, arguments);
        };

        const oldWSOnMessage = WebSocket.prototype.onmessage;
        WebSocket.prototype.onmessage = function(event) {
            if (this.pingStartTime) {
                ping = Math.round(performance.now() - this.pingStartTime);
                this.pingStartTime = null;
            }
            oldWSOnMessage.apply(this, arguments);
        };
    }

    // Initialize
    function init() {
        createDisplayBox();
        calculateFps();
        interceptWebSocket();
        setInterval(updateDisplay, 100); // Update display every 100ms
    }

    // Wait for the game to load
    const loadInterval = setInterval(() => {
        if (document.getElementById('gameCanvas')) {
            clearInterval(loadInterval);
            init();
        }
    }, 100);
})();