// ==UserScript==
// @name        Moomoo.io Hat Macro (Normal + Sandbox)
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Press F for Soldier Hat, G for Tank Gear (Works in Sandbox & Normal Mode)
// @author      Your Name
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/525268/Moomooio%20Hat%20Macro%20%28Normal%20%2B%20Sandbox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525268/Moomooio%20Hat%20Macro%20%28Normal%20%2B%20Sandbox%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🎩 Hat Macro (Normal + Sandbox) Loaded!");

    // Key bindings
    const KEY_SOLDIER_HAT = 'F';
    const KEY_TANK_GEAR = 'G';

    // Listen for key presses
    document.addEventListener("keydown", function(event) {
        let key = event.key.toUpperCase();

        if (key === KEY_SOLDIER_HAT) {
            console.log("🛡️ Switching to Soldier Hat...");
            selectHat(15); // Soldier Hat ID
        }
        if (key === KEY_TANK_GEAR) {
            console.log("💥 Switching to Tank Gear...");
            selectHat(7); // Tank Gear ID
        }
    });

    // Function to select a hat
    function selectHat(hatID) {
        if (window.gameSocket) {
            window.gameSocket.send(new Uint8Array([255, 6, hatID]));
        } else {
            console.error("❌ gameSocket not found! Try reloading the page.");
        }
    }

})();
