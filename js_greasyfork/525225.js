// ==UserScript==
// @name         MooMoo.io Mod - Hat Hotkeys (F, G, H) + Improved Auto Heal & Auto Trap
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hotkeys for Soldier Hat, Tank Gear & Turret Hat (F, G, H) + Improved Auto Heal + Auto Trap Placement
// @author       II
// @match        *://moomoo.io/*
// @grant        none
// @license 
// @downloadURL https://update.greasyfork.org/scripts/525225/MooMooio%20Mod%20-%20Hat%20Hotkeys%20%28F%2C%20G%2C%20H%29%20%2B%20Improved%20Auto%20Heal%20%20Auto%20Trap.user.js
// @updateURL https://update.greasyfork.org/scripts/525225/MooMooio%20Mod%20-%20Hat%20Hotkeys%20%28F%2C%20G%2C%20H%29%20%2B%20Improved%20Auto%20Heal%20%20Auto%20Trap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key bindings
    const SOLDIER_HAT_KEY = 'f';
    const TANK_GEAR_KEY = 'g';
    const TURRET_HAT_KEY = 'h';
    const HEAL_ITEM_KEY = '4'; // Change if your food is on a different key
    const TRAP_ITEM_KEY = '5'; // Change if your traps are on a different key

    // Hat IDs (These may change, update as needed)
    const HATS = {
        SOLDIER: 7, // Soldier Hat
        TANK: 53,   // Tank Gear
        TURRET: 21  // Turret Hat
    };

    // Function to equip a hat
    function equipHat(id) {
        window.gameSocket.send(JSON.stringify({action: "hat", item: id}));
    }

    // Improved Auto-Heal function
    function autoHeal() {
        let healthBar = document.getElementById("healthBar");
        if (healthBar) {
            let health = parseFloat(healthBar.style.width); // Get health percentage

            if (health < 30) { 
                // Emergency heal (fast healing every 250ms)
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': HEAL_ITEM_KEY}));
                setTimeout(() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': HEAL_ITEM_KEY})), 250);
            } else if (health < 50) { 
                // Normal heal (every 500ms)
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': HEAL_ITEM_KEY}));
            }
        }
    }

    // Auto place trap if stuck
    function autoTrap() {
        let velocity = window.player.velocity || {x: 0, y: 0}; // Check player movement
        if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) { 
            // Player is stuck, place a trap
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': TRAP_ITEM_KEY}));
            setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': ' ' })); // Place trap
            }, 100);
        }
    }

    // Key event listener
    document.addEventListener("keydown", function(event) {
        if (event.key === SOLDIER_HAT_KEY) {
            equipHat(HATS.SOLDIER);
        } else if (event.key === TANK_GEAR_KEY) {
            equipHat(HATS.TANK);
        } else if (event.key === TURRET_HAT_KEY) {
            equipHat(HATS.TURRET);
        }
    });

    // Run auto functions
    setInterval(autoHeal, 500); // Auto-heal every 500ms (normal)
    setInterval(autoTrap, 300); // Check if stuck every 300ms

})();
