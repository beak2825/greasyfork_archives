// ==UserScript==
// @name         MooMoo.io Hat Macro & Anti-Trap
// @version      1.0
// @description  Hat Macro (F = Soldier Helmet, G = Tank Gear) + Auto Place Traps when Stuck
// @author       II
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1428570
// @downloadURL https://update.greasyfork.org/scripts/525326/MooMooio%20Hat%20Macro%20%20Anti-Trap.user.js
// @updateURL https://update.greasyfork.org/scripts/525326/MooMooio%20Hat%20Macro%20%20Anti-Trap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Send keybind actions to MooMoo.io
    function sendKey(code) {
        document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: code }));
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: code }));
    }

    // Hat Macro: Switch hats using F and G
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F') {
            sendKey(53); // Soldier Helmet (Hat ID 53)
        }
        if (event.key === 'G') {
            sendKey(56); // Tank Gear (Hat ID 56)
        }
    });

    // Anti-Trap System
    let lastX = 0, lastY = 0;
    let stuckCounter = 0;

    function checkIfStuck() {
        let player = window.gameObjects[window.myPlayerID]; // Get player data

        if (player) {
            let currentX = player.x;
            let currentY = player.y;

            if (currentX === lastX && currentY === lastY) {
                stuckCounter++;
            } else {
                stuckCounter = 0;
            }

            lastX = currentX;
            lastY = currentY;

            if (stuckCounter > 10) { // If stuck for 10 cycles
                console.log("Stuck detected! Placing traps...");

                sendKey(54); // Select Trap (Assumed ID 54)
                setTimeout(() => sendKey(32), 100); // Place first trap
                setTimeout(() => sendKey(32), 200); // Place second trap

                stuckCounter = 0; // Reset counter
            }
        }
    }

    // Check every 100ms
    setInterval(checkIfStuck, 100);
})();
