// ==UserScript==
// @name         MooMoo.io Mod (Hat Macro, Auto Heal, Anti-Trap, Quad Spike)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hat macros, auto heal, anti-trap, and quad spike in MooMoo.io
// @author       II
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525231/MooMooio%20Mod%20%28Hat%20Macro%2C%20Auto%20Heal%2C%20Anti-Trap%2C%20Quad%20Spike%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525231/MooMooio%20Mod%20%28Hat%20Macro%2C%20Auto%20Heal%2C%20Anti-Trap%2C%20Quad%20Spike%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("MooMoo.io Mod Loaded!");

    // Keybinds
    const KEY_SOLDIER_HAT = 'F'; // Soldier Hat
    const KEY_TANK_GEAR = 'G';   // Tank Gear
    const KEY_QUAD_SPIKE = 'T';  // Quad Spike

    const AUTO_HEAL_THRESHOLD = 50; // Auto heal if HP is below this
    let lastTrapTime = 0; // Prevent spamming traps
    const TRAP_DELAY = 2000; // 2 seconds delay for anti-trap

    // Intercept WebSocket messages
    const oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            let msg = new Uint8Array(data);

            // Detect player health for Auto Heal
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 1) {
                let health = msg[3]; // Extract player health
                if (health < AUTO_HEAL_THRESHOLD) {
                    console.log("Auto Healing...");
                    oldSend.call(this, new Uint8Array([255, 3, 0])); // Send heal packet
                }
            }

            // Detect getting trapped and place 2 traps behind
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 3) {
                let trapType = msg[2]; // Trap type ID
                if (trapType === 6) { // If it's a trap
                    let now = Date.now();
                    if (now - lastTrapTime > TRAP_DELAY) {
                        console.log("Anti-Trap Activated! Placing traps behind...");
                        placeTrapBehind();
                        lastTrapTime = now;
                    }
                }
            }

        } catch (error) {
            console.error("Error processing WebSocket data:", error);
        }
        return oldSend.apply(this, arguments);
    };

    // Listen for key events
    document.addEventListener("keydown", function(event) {
        let key = event.key.toUpperCase();

        // Hat Macros
        if (key === KEY_SOLDIER_HAT) {
            console.log("Switching to Soldier Hat...");
            selectHat(15);
        }
        if (key === KEY_TANK_GEAR) {
            console.log("Switching to Tank Gear...");
            selectHat(7);
        }

        // Quad Spike Macro
        if (key === KEY_QUAD_SPIKE) {
            console.log("Placing Quad Spikes...");
            placeQuadSpikes();
        }
    });

    // Function to place 2 traps behind you
    function placeTrapBehind() {
        for (let i = 0; i < 2; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 6])); // Place traps
        }
    }

    // Function to place 4 spikes
    function placeQuadSpikes() {
        for (let i = 0; i < 4; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 0])); // Place spikes
        }
    }

    // Function to select a hat
    function selectHat(hatID) {
        window.gameSocket.send(new Uint8Array([255, 6, hatID])); // Send hat selection packet
    }

})();
