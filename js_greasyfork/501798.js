// ==UserScript==
// @name         MooMoo.io Sandbox Mobile Mod
// @namespace    http://tampermonkey.net/
// @author        wat
// @version      v1
// @description  Auto-place traps and spikes, auto-heal, and enlarge shop for mobile users on sandbox.moomoo.io
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501798/MooMooio%20Sandbox%20Mobile%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/501798/MooMooio%20Sandbox%20Mobile%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const SHOP_SCALE = 1.5; // Increase shop size by 50%

    // Helper function to send packet to server
    function sendPacket(packet) {
        if (window.WebSocket && window.WebSocket.prototype.send) {
            window.WebSocket.prototype.send(new Uint8Array(packet));
        }
    }

    // Auto-heal function
    function autoHeal() {
        sendPacket([10, 0]); // Use apple (ID: 0) to heal
    }

    // Place trap function
    function placeTrap() {
        sendPacket([5, 17, 0]);
    }

    // Place spike function
    function placeSpike() {
        sendPacket([5, 6, 0]);
    }

    // Enlarge shop
    function enlargeShop() {
        const shopStyle = document.createElement('style');
        shopStyle.textContent = `
            #shopWindow {
                transform: scale(${SHOP_SCALE});
                transform-origin: top left;
            }
        `;
        document.head.appendChild(shopStyle);
    }

    // Create mobile buttons
    function createMobileButtons() {
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
            .mobileButton {
                position: fixed;
                width: 60px;
                height: 60px;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                border: 2px solid white;
                border-radius: 50%;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
        `;
        document.head.appendChild(buttonStyle);

        const buttons = [
            { text: 'Heal', action: autoHeal, x: 20, y: 20 },
            { text: 'Trap', action: placeTrap, x: 20, y: 100 },
            { text: 'Spike', action: placeSpike, x: 20, y: 180 }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('div');
            button.className = 'mobileButton';
            button.textContent = btn.text;
            button.style.left = btn.x + 'px';
            button.style.bottom = btn.y + 'px';
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.action();
            });
            document.body.appendChild(button);
        });
    }

    // Run once when the game loads
    window.addEventListener('load', function() {
        enlargeShop();
        createMobileButtons();
        console.log('MooMoo.io Sandbox Mobile Mod loaded!');
    });

    // Override the WebSocket.send function to intercept game packets
    let _send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        if (data instanceof ArrayBuffer) {
            let packet = new Uint8Array(data);
            let packetType = packet[0];
            let packetData = packet[1];

            // Auto-place traps and spikes when selected
            if (packetType === 8) {
                if (packetData === 17) { // Trap
                    placeTrap();
                } else if (packetData === 6) { // Spike
                    placeSpike();
                }
            }
        }
        _send.apply(this, arguments);
    };
})();