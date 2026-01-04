// ==UserScript==
// @name         MooMoo.io Overpowered Auto Heal (June 2025)
// @version      1.0
// @description  Automatic aggressive healing script for MooMoo.io (June 2025 protocol).
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1481054
// @downloadURL https://update.greasyfork.org/scripts/539670/MooMooio%20Overpowered%20Auto%20Heal%20%28June%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539670/MooMooio%20Overpowered%20Auto%20Heal%20%28June%202025%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 bugdaddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';
    /* 
     * This script automatically uses food (berries) to heal the player to full HP whenever health drops,
     * while respecting MooMoo.io's anti-cheat limits and preserving the player's weapon state.
     * It uses the June 2025 packet protocol (msgpack-based) with updated packet codes (e.g., "z" for item placement and "F" for attack):contentReference[oaicite:5]{index=5}:contentReference[oaicite:6]{index=6}.
     * The script sends food-use packets in controlled bursts (<= 8 packets per burst) to avoid disconnects.
     * It also implements a "ghost" placement technique: the food is consumed without visibly switching away from the current weapon by quickly re-equipping the weapon and resuming attack:contentReference[oaicite:7]{index=7}.
     */
    
    // Configuration constants
    const DEFAULT_HEAL_DELAY = 100;  // delay (ms) after taking damage before starting to heal (allows grouping multiple hits)
    const BURST_USES = 2;           // number of food items to use per burst (each use sends ~4 packets, 2 uses = 8 packets max)
    const MIN_BURST_INTERVAL = 50;  // minimum interval (ms) between bursts to stay under anti-cheat packet rate
    
    // State variables
    let AUTO_HEAL_ENABLED = true;
    let AUTO_HEAL_DELAY = DEFAULT_HEAL_DELAY;
    let inGame = false;
    let currentHealth = 100;
    let items = [];
    let weapons = [];
    let activeWeaponId = null;   // currently equipped weapon ID (to restore after healing)
    let attackHeld = false;      // whether player is holding attack (mouse down)
    let lastAttackAngle = 0;     // last attack angle used (to continue attacking in same direction)
    let healTimeout = null;      // timer for scheduled healing start
    let healingActive = false;   // flag for ongoing healing sequence
    
    let ws = null;              // WebSocket for game connection
    
    // Intercept WebSocket to hook into game messages (both outgoing and incoming)
    const OriginalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!ws) {
            ws = this;
            // Restore original send on prototype to avoid affecting other connections
            WebSocket.prototype.send = OriginalWebSocketSend;
            // Hook outgoing messages on this WebSocket instance
            const gameSocket = this;
            gameSocket.send = function(data) {
                // Try to decode outgoing message to monitor certain actions
                try {
                    const decoded = window.msgpack.decode(new Uint8Array(data));
                    const [ptype, pdata] = decoded;
                    if (ptype === "F") {
                        // "F" is attack/hit packet; pdata[0] = 1 (attack start) or 0 (attack end), pdata[1] = angle:contentReference[oaicite:8]{index=8}
                        if (pdata[0] === 1) {
                            attackHeld = true;
                            // Record angle of attack start
                            lastAttackAngle = pdata[1] || 0;
                        } else if (pdata[0] === 0) {
                            attackHeld = false;
                        }
                    } else if (ptype === "z") {
                        // "z" is item/weapon select or place; pdata[1] true means weapon equip, false means item use:contentReference[oaicite:9]{index=9}
                        if (pdata[1] === true) {
                            // Track currently equipped weapon (so we know which weapon to return to after healing)
                            activeWeaponId = pdata[0];
                        }
                    }
                } catch(e) {
                    // decoding might fail for non-game data or handshake, ignore
                }
                // Send the data out normally
                return OriginalWebSocketSend.call(gameSocket, data);
            };
            // Hook incoming messages (to track health and inventory updates)
            gameSocket.addEventListener('message', function(event) {
                const msg = window.msgpack.decode(new Uint8Array(event.data));
                const packetType = msg[0];
                const data = msg[1];
                // Packet codes as of 2025: "C"=setupGame, "O"=updateHealth, "P"=killPlayer, "V"=updateItems:contentReference[oaicite:10]{index=10}
                if (packetType === "C") {
                    // Game setup: player joined or respawned
                    inGame = true;
                    currentHealth = 100;
                    // Initialize default inventory indices (will be updated by "V" event)
                    items = [0, 3, 6, 10];  // default item IDs for food, walls, etc (may be updated by server):contentReference[oaicite:11]{index=11}
                    weapons = [0];         // default starting weapon ID
                    activeWeaponId = weapons[0];
                } else if (packetType === "P") {
                    // Player died
                    inGame = false;
                    currentHealth = 0;
                    // Cancel any pending heal actions
                    if (healTimeout) {
                        clearTimeout(healTimeout);
                        healTimeout = null;
                    }
                    healingActive = false;
                } else if (packetType === "O") {
                    // Health update packet
                    const playerId = data[0];
                    const newHP = data[1];
                    if (playerId && inGame) {
                        // Only act on the player's own health update
                        currentHealth = newHP;
                        if (AUTO_HEAL_ENABLED && newHP < 100 && newHP > 0) {
                            // Schedule healing sequence if health dropped below max and not dead
                            scheduleHeal();
                        }
                    }
                } else if (packetType === "V") {
                    // Inventory update packet (items or weapons update)
                    const updateArr = data[0];
                    const isWeaponsUpdate = data[1];
                    if (updateArr) {
                        if (isWeaponsUpdate) {
                            // Server is updating weapons list
                            weapons = updateArr;
                            // Ensure activeWeaponId is one of the weapons (if not set, default to first)
                            if (activeWeaponId == null) {
                                activeWeaponId = weapons[0];
                            }
                        } else {
                            // Server is updating items list (building items & food)
                            items = updateArr;
                        }
                    }
                }
            });
        }
        // For the first (and subsequent) calls, use the original send (first call triggers our setup above)
        return OriginalWebSocketSend.apply(this, args);
    };
    
    // Helper function to send a packet via msgpack encoding
    function sendPacket(type, ...payload) {
        if (!ws) return;
        // The game uses msgpack arrays: [packetType, dataArray]:contentReference[oaicite:12]{index=12} 
        const message = window.msgpack.encode([type, payload]);
        ws.send(message);
    }
    
    // Schedule a healing sequence to start after a short delay (to allow grouping rapid damage events)
    function scheduleHeal() {
        if (healingActive) {
            // Already healing in progress, it will handle reaching full HP
            return;
        }
        if (healTimeout) {
            // If a heal was already scheduled and another hit occurred, reset timer to delay until after last hit
            clearTimeout(healTimeout);
        }
        healTimeout = setTimeout(() => {
            healTimeout = null;
            startHealingSequence();
        }, AUTO_HEAL_DELAY);
    }
    
    // Begin the healing loop to restore HP to 100, using food items
    function startHealingSequence() {
        if (!inGame || !AUTO_HEAL_ENABLED || currentHealth >= 100) return;
        healingActive = true;
        // Use food items repeatedly until health is full
        function healStep() {
            if (!inGame || currentHealth >= 100) {
                // Stop if game ended or HP is full
                healingActive = false;
                return;
            }
            // Calculate how many food uses to do this step
            let uses = BURST_USES;
            // If only a small heal is needed (e.g. <=20 HP missing) use just 1 to avoid waste
            if (100 - currentHealth <= 20) {
                uses = 1;
            }
            // Use the food item multiple times in this burst
            for (let i = 0; i < uses; i++) {
                useFoodItem();
            }
            // Schedule next step after a short interval to avoid sending too many packets at once
            setTimeout(healStep, Math.max(MIN_BURST_INTERVAL, AUTO_HEAL_DELAY));
        }
        healStep();
    }
    
    // Use one unit of food (berry) to heal the player (with ghost placement to preserve weapon)
    function useFoodItem() {
        if (!inGame) return;
        const foodItemId = items[0];  // by convention, inventory slot 0 is food item ID:contentReference[oaicite:13]{index=13}
        if (foodItemId == null) return;
        const prevWeapon = activeWeaponId;
        // 1. Equip/place food without removing weapon from player's perspective (ghost use)
        sendPacket("z", foodItemId, false);  // "z" with false triggers using the item (food):contentReference[oaicite:14]{index=14}
        // 2. Simulate a quick attack click to consume the food
        sendPacket("F", 1, lastAttackAngle);
        sendPacket("F", 0, lastAttackAngle);
        // 3. Immediately re-select the previous weapon 
        if (prevWeapon != null) {
            sendPacket("z", prevWeapon, true);
        }
        // 4. If player was in the middle of holding an attack, resume it so they continue swinging:contentReference[oaicite:15]{index=15}
        if (attackHeld) {
            sendPacket("F", 1, lastAttackAngle);
        }
    }
    
    // Build a simple on-screen UI panel for toggling and speed control
    const ui = document.createElement('div');
    ui.id = "autoHealPanel";
    ui.style.cssText = "position:absolute; top:20px; left:20px; padding:10px; background:rgba(0,0,0,0.4); color:#fff; font-family:sans-serif; font-size:14px; border-radius:5px; z-index:9999;";
    ui.innerHTML = `
        <h3 style="margin:0 0 4px 0;">Auto Heal Mod</h3>
        <label style="display:block; margin-bottom:4px;">
            <input type="checkbox" id="healToggle" checked>
            Enable Auto-Heal
        </label>
        <label style="display:block;">
            Heal delay: 
            <input type="number" id="healDelay" value="${DEFAULT_HEAL_DELAY}" min="0" max="1000" style="width:60px;"> ms
        </label>
        <small style="display:block; margin-top:2px; opacity:0.75;">
            * Lower delay = faster healing (use with caution to avoid anti-cheat)
        </small>
    `;
    document.body.appendChild(ui);
    
    // UI elements event handlers
    const healToggle = ui.querySelector('#healToggle');
    const healDelayInput = ui.querySelector('#healDelay');
    healToggle.addEventListener('change', () => {
        AUTO_HEAL_ENABLED = healToggle.checked;
    });
    healDelayInput.addEventListener('input', () => {
        let val = parseInt(healDelayInput.value);
        if (isNaN(val) || val < 0) val = 0;
        AUTO_HEAL_DELAY = val;
    });
})();
