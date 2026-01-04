// ==UserScript==
// @name        Moomoo.io Mod - Auto Heal, Traps, Hotkeys
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Hotkeys (F: Soldier Hat, G: Tank Gear, T: Spikes), Auto-Heal, Auto-Trap Escape
// @author     II
// @match       *://moomoo.io/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525260/Moomooio%20Mod%20-%20Auto%20Heal%2C%20Traps%2C%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/525260/Moomooio%20Mod%20-%20Auto%20Heal%2C%20Traps%2C%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🔥 Moomoo.io Mod Loaded!");

    // Keybinds
    const KEY_SOLDIER_HAT = 'F';
    const KEY_TANK_GEAR = 'G';
    const KEY_QUAD_SPIKE = 'T';

    const AUTO_HEAL_THRESHOLD = 60; // Health threshold for auto-heal
    const TRAP_DELAY = 2000; // Delay between trap placements

    let autoHealEnabled = true;
    let lastTrapTime = 0;

    // Intercept WebSocket messages
    const oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            let msg = new Uint8Array(data);

            // Auto-Heal when taking damage
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 1) {
                let health = msg[3];
                if (autoHealEnabled && health < AUTO_HEAL_THRESHOLD) {
                    console.log("⚕️ Auto Healing...");
                    oldSend.call(this, new Uint8Array([255, 3, 0])); // Heal action
                }
            }

            // Auto-Trap Escape
            if (msg.length > 4 && msg[0] === 255 && msg[1] === 3) {
                let trapType = msg[2];
                if (trapType === 6) { // If player gets trapped
                    let now = Date.now();
                    if (now - lastTrapTime > TRAP_DELAY) {
                        console.log("🚨 Stuck in trap! Placing 2 traps behind...");
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

    // Key events for hotkeys
    document.addEventListener("keydown", function(event) {
        let key = event.key.toUpperCase();

        if (key === KEY_SOLDIER_HAT) {
            console.log("🛡️ Equipping Soldier Hat...");
            selectHat(15);
        }
        if (key === KEY_TANK_GEAR) {
            console.log("💥 Equipping Tank Gear...");
            selectHat(7);
        }
        if (key === KEY_QUAD_SPIKE) {
            console.log("💥 Placing 4 Spikes...");
            placeQuadSpikes();
        }
    });

    // Place 2 traps behind the player
    function placeTrapBehind() {
        for (let i = 0; i < 2; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 6])); // Trap action
        }
    }

    // Place 4 spikes around the player
    function placeQuadSpikes() {
        for (let i = 0; i < 4; i++) {
            window.gameSocket.send(new Uint8Array([255, 3, 0])); // Spike action
        }
    }

    // Equip a hat based on ID
    function selectHat(hatID) {
        window.gameSocket.send(new Uint8Array([255, 6, hatID])); // Hat switch action
    }

})();
