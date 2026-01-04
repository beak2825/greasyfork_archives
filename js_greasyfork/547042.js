// ==UserScript==
// @name         ShlomoMacro - Hat Switcher
// @namespace    https://github.com/shlomoMacro
// @version      1.0.0
// @description  Quick hat switching with keybinds for MooMoo.io
// @author       Shlomo1412
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/547042/ShlomoMacro%20-%20Hat%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/547042/ShlomoMacro%20-%20Hat%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State ---
    let ws = null;
    const msgpack = window.msgpack || window.msgpack5 || null;
    
    // Hat IDs for MooMoo.io
    const hatIDs = {
        bull: 7,        // Bull Helmet
        booster: 12,    // Booster Hat  
        turret: 53,     // Turret Gear
        soldier: 6,     // Soldier Helmet
        tank: 40,       // Tank Gear
        flipper: 31     // Flipper Hat
    };

    // Keybind mapping
    const keybinds = {
        't': hatIDs.bull,       // Bull helmet
        'g': hatIDs.turret,     // Turret gear
        'b': hatIDs.soldier,    // Soldier helmet
        'z': hatIDs.tank,       // Tank gear
        'f': hatIDs.flipper     // Flipper hat
        // Shift will be handled separately
    };

    // Track pressed keys
    const keysPressed = {};
    let lastHatChange = 0;
    const changeDelay = 150; // ms delay between hat changes

    // Modal state
    let modalOpen = false;
    let awaitingBind = null; // { action, currentKey }

    // --- Protocol helpers ---
    function sendTuple(tuple) {
        if (!ws || !msgpack) return;
        try {
            ws.send(new Uint8Array(msgpack.encode(tuple)));
        } catch (e) {
            console.log('ShlomoMacro: Failed to send packet', e);
        }
    }

    // --- Hat Functions ---
    function equipHat(hatID) {
        const now = Date.now();
        if (now - lastHatChange < changeDelay) return;
        
        try {
            // Try to equip first (if we already own it)
            sendTuple(['c', [0, hatID, 0]]);
            
            // Also try to buy it in case we don't own it
            setTimeout(() => {
                sendTuple(['c', [1, hatID, 0]]); // Buy
                setTimeout(() => {
                    sendTuple(['c', [0, hatID, 0]]); // Equip again
                }, 50);
            }, 50);
            
            lastHatChange = now;
            console.log(`ShlomoMacro: Equipped hat ID ${hatID}`);
        } catch (e) {
            console.log(`ShlomoMacro: Failed to equip hat ${hatID}:`, e);
        }
    }

    // --- Modal Functions ---
    function createModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'shlomo-keybind-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            z-index: 999999;
            font-family: Arial, sans-serif;
        `;

        // Create modal content
        const content = document.createElement('div');
        content.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(17,24,39,.95), rgba(30,41,59,.9));
            border: 2px solid rgba(148,163,184,.3);
            border-radius: 12px;
            padding: 20px;
            min-width: 400px;
            max-width: 500px;
            color: #e2e8f0;
            box-shadow: 0 10px 40px rgba(0,0,0,.6);
        `;

        // Header
        const header = document.createElement('div');
        header.innerHTML = '<h2 style="margin: 0 0 20px 0; color: #60a5fa; text-align: center;">ShlomoMacro Keybinds</h2>';

        // Keybind list
        const keybindList = document.createElement('div');
        keybindList.id = 'shlomo-keybind-list';
        
        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid rgba(148,163,184,.2);
            text-align: center;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
        `;
        closeBtn.onclick = hideModal;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset to Defaults';
        resetBtn.style.cssText = `
            background: #f59e0b;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
        `;
        resetBtn.onclick = resetToDefaults;

        footer.appendChild(closeBtn);
        footer.appendChild(resetBtn);

        content.appendChild(header);
        content.appendChild(keybindList);
        content.appendChild(footer);
        modal.appendChild(content);
        document.body.appendChild(modal);

        return modal;
    }

    function showModal() {
        if (modalOpen) return;
        modalOpen = true;
        
        let modal = document.getElementById('shlomo-keybind-modal');
        if (!modal) {
            modal = createModal();
        }
        
        updateKeybindList();
        modal.style.display = 'block';
    }

    function hideModal() {
        modalOpen = false;
        awaitingBind = null;
        const modal = document.getElementById('shlomo-keybind-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function updateKeybindList() {
        const list = document.getElementById('shlomo-keybind-list');
        if (!list) return;

        let html = '';
        
        // Regular keybinds
        for (const [key, hatID] of Object.entries(keybinds)) {
            const hatName = Object.keys(hatIDs).find(name => hatIDs[name] === hatID);
            html += createKeybindRow(key, hatName, hatID);
        }
        
        // Special keybind for shift
        html += createKeybindRow('shift', 'booster', hatIDs.booster, true);
        
        list.innerHTML = html;
    }

    function createKeybindRow(key, hatName, hatID, isSpecial = false) {
        const displayKey = key === 'shift' ? 'Left Shift' : key.toUpperCase();
        const displayName = hatName.charAt(0).toUpperCase() + hatName.slice(1) + ' Hat';
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(148,163,184,.1);">
                <div style="flex: 1;">
                    <strong>${displayName}</strong><br>
                    <small style="color: #94a3b8;">ID: ${hatID}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="background: rgba(59,130,246,.2); color: #93c5fd; padding: 4px 8px; border-radius: 4px; min-width: 60px; text-align: center;">
                        ${displayKey}
                    </span>
                    <button onclick="rebindKey('${hatName}', '${key}', ${isSpecial})" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Rebind
                    </button>
                </div>
            </div>
        `;
    }

    function rebindKey(hatName, currentKey, isSpecial = false) {
        awaitingBind = { hatName, currentKey, isSpecial };
        
        // Update the button text
        const buttons = document.querySelectorAll('#shlomo-keybind-list button');
        buttons.forEach(btn => {
            if (btn.textContent === 'Rebind' && btn.onclick.toString().includes(hatName)) {
                btn.textContent = 'Press key...';
                btn.style.background = '#f59e0b';
            }
        });
    }

    function resetToDefaults() {
        // Reset to original keybinds
        keybinds.t = hatIDs.bull;
        keybinds.g = hatIDs.turret;
        keybinds.b = hatIDs.soldier;
        keybinds.z = hatIDs.tank;
        keybinds.f = hatIDs.flipper;
        
        // Remove any custom keybinds
        for (const key in keybinds) {
            if (!['t', 'g', 'b', 'z', 'f'].includes(key)) {
                delete keybinds[key];
            }
        }
        
        updateKeybindList();
        console.log('ShlomoMacro: Reset to default keybinds');
    }

    // Make functions global so they can be called from HTML
    window.rebindKey = rebindKey;

    // --- WebSocket hook ---
    function attachWS(sock) {
        if (ws) return;
        ws = sock;
        console.log('ShlomoMacro: WebSocket connected');
    }

    // Patch send to capture the first gameplay socket
    if (!WebSocket.prototype.__shlomoPatched) {
        WebSocket.prototype.__shlomoPatched = true;
        const _send = WebSocket.prototype.send;
        WebSocket.prototype.send = function(...args) {
            try { attachWS(this); } catch {}
            return _send.apply(this, args);
        };
    }

    // --- Keyboard Events ---
    window.addEventListener('keydown', (e) => {
        // Skip if typing in chat (but not if modal is open for rebinding)
        if (document.activeElement && document.activeElement.id && 
            document.activeElement.id.toLowerCase() === 'chatbox' && !awaitingBind) return;
        
        const key = e.key.toLowerCase();
        
        // Handle rebinding
        if (awaitingBind) {
            handleRebind(e);
            return;
        }
        
        // Handle modal toggle
        if (key === 'k') {
            if (modalOpen) {
                hideModal();
            } else {
                showModal();
            }
            return;
        }
        
        // Skip other actions if modal is open
        if (modalOpen) return;
        
        // Prevent duplicate key events
        if (keysPressed[key]) return;
        keysPressed[key] = true;
        
        // Handle Shift + other combinations for booster hat
        if (e.shiftKey && key === 'shift') {
            console.log('ShlomoMacro: Shift pressed - equipping booster hat');
            equipHat(hatIDs.booster);
            return;
        }
        
        // Handle regular keybinds
        if (keybinds[key]) {
            console.log(`ShlomoMacro: ${key.toUpperCase()} pressed - equipping hat ID ${keybinds[key]}`);
            equipHat(keybinds[key]);
        }
    });

    function handleRebind(e) {
        e.preventDefault();
        
        const newKey = e.key.toLowerCase();
        
        // Ignore modifier-only keys
        if (['shift', 'control', 'alt', 'meta'].includes(newKey)) {
            return;
        }
        
        // Cancel on Escape
        if (newKey === 'escape') {
            awaitingBind = null;
            updateKeybindList();
            return;
        }
        
        // Check for conflicts
        const conflict = Object.entries(keybinds).find(([key, value]) => key === newKey);
        if (conflict && conflict[0] !== awaitingBind.currentKey) {
            alert(`Key "${newKey.toUpperCase()}" is already bound to another hat!`);
            return;
        }
        
        // Apply the new binding
        const { hatName, currentKey, isSpecial } = awaitingBind;
        
        if (isSpecial) {
            // Can't rebind shift keybind for now (would need special handling)
            alert('Shift keybind cannot be changed');
            awaitingBind = null;
            updateKeybindList();
            return;
        }
        
        // Remove old binding
        delete keybinds[currentKey];
        
        // Add new binding
        keybinds[newKey] = hatIDs[hatName];
        
        awaitingBind = null;
        updateKeybindList();
        
        console.log(`ShlomoMacro: Rebound ${hatName} hat from ${currentKey.toUpperCase()} to ${newKey.toUpperCase()}`);
    }

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        keysPressed[key] = false;
    });

    // --- Initialization ---
    console.log('ShlomoMacro: Hat Switcher loaded');
    console.log('ShlomoMacro: Keybinds:');
    console.log('  T - Bull Helmet');
    console.log('  Left Shift - Booster Hat');
    console.log('  G - Turret Gear');
    console.log('  B - Soldier Helmet');
    console.log('  Z - Tank Gear');
    console.log('  F - Flipper Hat');

})();
