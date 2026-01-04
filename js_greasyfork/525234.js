// ==UserScript==
// @name         MooMoo.io Ultimate Stick/Hammer Mod (No Windmill Hat)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ultimate MooMoo.io mod for Stick/Hammer players with Anti-Insta, Auto-Heal, and Combat Macros
// @author       II
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525234/MooMooio%20Ultimate%20StickHammer%20Mod%20%28No%20Windmill%20Hat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525234/MooMooio%20Ultimate%20StickHammer%20Mod%20%28No%20Windmill%20Hat%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🔥 MooMoo.io Ultimate Stick/Hammer Mod Loaded!");

    // Keybinds
    const KEY_SOLDIER_HAT = 'F'; // Soldier Hat
    const KEY_TANK_GEAR = 'G';   // Tank Gear
    const KEY_QUAD_SPIKE = 'T';  // Quad Spike
    const KEY_AUTO_ATTACK = 'Y'; // Auto Attack Spam
    const KEY_QUICK_MOVE = 'U';  // Quick Move Mode
    const KEY_TOGGLE_AUTO_HEAL = 'B'; // Toggle Auto-Heal
    const KEY_TOGGLE_ANTI_TRAP = 'V'; // Toggle Anti-Trap Mode

    const AUTO_HEAL_THRESHOLD = 60;
    let autoHealEnabled = true;
    let antiTrapEnabled = true;
    let autoAttackActive = false;
    let quickMoveActive = false;

    let lastTrapTime = 0;
    const TRAP_DELAY = 2000;

    // Intercept WebSocket messages
    const oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            let msg = new Uint8Array(data);

            // Detect health for Auto Heal & Anti-Insta
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 1) {
                let health = msg[3];
                
                // Auto-Heal if HP is low
                if (autoHealEnabled && health < AUTO_HEAL_THRESHOLD) {
                    console.log("⚕️ Auto Healing...");
                    oldSend.call(this, new Uint8Array([255, 3, 0])); // Heal packet
                }

                // Auto-Switch to Tank Gear if HP suddenly drops (Anti-Insta)
                if (health < 30) {
                    console.log("🛡️ Auto-Switching to Tank Gear!");
                    selectHat(7); // Tank Gear
                }
            }

            // Detect getting trapped and place 2 traps behind (Anti-Trap Mode)
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 3 && antiTrapEnabled) {
                let trapType = msg[2]; 
                if (trapType === 6) { 
                    let now = Date.now();
                    if (now - lastTrapTime > TRAP_DELAY) {
                        console.log("🚨 Anti-Trap Mode: Placing traps behind!");
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
            console.log("🎖️ Switching to Soldier Hat...");
            selectHat(15);
        }
        if (key === KEY_TANK_GEAR) {
            console.log("🛡️ Switching to Tank Gear...");
            selectHat(7);
        }

        // Quad Spike Macro
        if (key === KEY_QUAD_SPIKE) {
            console.log("💥 Placing Quad Spikes...");
            placeQuadSpikes();
        }

        // Auto Attack Toggle
        if (key === KEY_AUTO_ATTACK) {
            autoAttackActive = !autoAttackActive;
            console.log("⚔️ Auto Attack:", autoAttackActive ? "ON" : "OFF");
        }

        // Quick Move Toggle
        if (key === KEY_QUICK_MOVE) {
            quickMoveActive = !quickMoveActive;
            console.log("🚀 Quick Move Mode:", quickMoveActive ? "ON" : "OFF");
        }

        // Toggle Auto-Heal
        if (key === KEY_TOGGLE_AUTO_HEAL) {
            autoHealEnabled = !autoHealEnabled;
            console.log("⚕️ Auto-Heal:", autoHealEnabled ? "ENABLED" : "DISABLED");
        }

        // Toggle Anti-Trap Mode
        if (key === KEY_TOGGLE_ANTI_TRAP) {
            antiTrapEnabled = !antiTrapEnabled;
            console.log("🛑 Anti-Trap Mode:", antiTrapEnabled ? "ON" : "OFF");
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
