// ==UserScript==
// @name         Immortal Client v7.0 – Demon Ascension Edition
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  The ultimate bloxd.io experience: Demon-themed glowing hotbar, AutoTool logic, animated crosshair, FPS boost, and much more.
// @author       IMMORTAL_DEMON_999
// @match        https://bloxd.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540494/Immortal%20Client%20v70%20%E2%80%93%20Demon%20Ascension%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/540494/Immortal%20Client%20v70%20%E2%80%93%20Demon%20Ascension%20Edition.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Cache DOM elements and reduce reflows
    const doc = document;
    const head = doc.head;
    const body = doc.body;

    // Optimized style injection
    const immortalStyle = doc.createElement('style');
    immortalStyle.textContent = `
        .item {
            outline: none !important;
            box-shadow: none !important;
            border: none !important;
        }
        .SelectedItem {
            outline: none !important;
            box-shadow: 0 0 15px 5px rgba(255, 0, 0, 1), 0 0 20px 10px rgba(255, 0, 0, 0.6) !important;
            border: 2px solid #ff0000 !important;
        }
        #immortalHUD, #immortalStats {
            font-family: monospace;
            color: white;
            z-index: 9999;
            pointer-events: none;
        }
        #immortalHUD {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.6);
            border: 2px solid crimson;
            border-radius: 12px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .keyBox {
            background: rgba(255,255,255,0.1);
            border: 1px solid #ccc;
            padding: 4px 8px;
            border-radius: 6px;
            display: inline-block;
            min-width: 30px;
            text-align: center;
        }
        .activeKey {
            background: crimson;
            color: black;
            font-weight: bold;
        }
        #immortalStats {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            border: 2px solid red;
            padding: 10px;
            border-radius: 12px;
        }
    `;
    head.appendChild(immortalStyle);

    // HUD Display - pre-cache elements
    const immortalHUD = doc.createElement('div');
    immortalHUD.id = 'immortalHUD';
    immortalHUD.innerHTML = `
        <div id="key-W" class="keyBox">W</div>
        <div style="display: flex; gap: 4px">
            <div id="key-A" class="keyBox">A</div>
            <div id="key-S" class="keyBox">S</div>
            <div id="key-D" class="keyBox">D</div>
        </div>
        <div id="key-Shift" class="keyBox">Shift</div>
        <div style="display: flex; gap: 4px">
            <div id="key-LMB" class="keyBox">LMB</div>
            <div id="key-RMB" class="keyBox">RMB</div>
        </div>
        <div id="cpsDisplay">CPS: 0</div>
        <div id="fpsDisplay">FPS: 0</div>
    `;
    body.appendChild(immortalHUD);

    // Cache HUD elements
    const keyElements = {
        'W': doc.getElementById('key-W'),
        'A': doc.getElementById('key-A'),
        'S': doc.getElementById('key-S'),
        'D': doc.getElementById('key-D'),
        'Shift': doc.getElementById('key-Shift'),
        'LMB': doc.getElementById('key-LMB'),
        'RMB': doc.getElementById('key-RMB')
    };
    const cpsDisplay = doc.getElementById('cpsDisplay');
    const fpsDisplay = doc.getElementById('fpsDisplay');

    // Optimized key handling
    const keyMap = {
        'KeyW': 'W', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D',
        'ShiftLeft': 'Shift', 'ShiftRight': 'Shift'
    };

    function handleKeyDown(e) {
        const id = keyMap[e.code];
        if (id && keyElements[id]) keyElements[id].classList.add('activeKey');
    }

    function handleKeyUp(e) {
        const id = keyMap[e.code];
        if (id && keyElements[id]) keyElements[id].classList.remove('activeKey');
    }

    doc.addEventListener('keydown', handleKeyDown);
    doc.addEventListener('keyup', handleKeyUp);

    // Optimized mouse handling
    let cps = 0;
    function handleMouseDown(e) {
        if (e.button === 0) {
            keyElements.LMB.classList.add('activeKey');
            cps++;
        } else if (e.button === 2) {
            keyElements.RMB.classList.add('activeKey');
        }
    }

    function handleMouseUp(e) {
        if (e.button === 0) keyElements.LMB.classList.remove('activeKey');
        if (e.button === 2) keyElements.RMB.classList.remove('activeKey');
    }

    doc.addEventListener('mousedown', handleMouseDown);
    doc.addEventListener('mouseup', handleMouseUp);

    // Optimized CPS counter
    let cpsInterval = setInterval(() => {
        cpsDisplay.textContent = 'CPS: ' + cps;
        cps = 0;
    }, 1000);

    // Optimized FPS counter
    let frames = 0;
    let lastFpsUpdate = performance.now();
    function countFrames(now) {
        frames++;
        
        if (now - lastFpsUpdate >= 1000) {
            fpsDisplay.textContent = 'FPS: ' + frames;
            frames = 0;
            lastFpsUpdate = now;
        }
        
        requestAnimationFrame(countFrames);
    }
    requestAnimationFrame(countFrames);

    // Stats Panel
    const immortalStats = doc.createElement('div');
    immortalStats.id = 'immortalStats';
    immortalStats.innerHTML = `
        <div><strong>IMMORTAL CLIENT v7.0</strong></div>
        <div>Theme: Demon Ascension</div>
        <div>Skin Mod: Active</div>
        <div>ESP: Coming Soon</div>
        <div>AutoTool: ENABLED</div>
        <div>Custom UI: Active</div>
        <div>⚔️ True Immortal Mode</div>
    `;
    body.appendChild(immortalStats);

    // Optimized crosshair - cache selector and run once
    let crosshairChecked = false;
    function updateCrosshair() {
        if (!crosshairChecked) {
            const crosshair = doc.querySelector(".CrossHair");
            if (crosshair) {
                crosshair.textContent = "";
                crosshair.style.backgroundImage = "url(https://i.imgur.com/1MnSP24.pngww)";
                crosshair.style.backgroundRepeat = "no-repeat";
                crosshair.style.backgroundSize = "contain";
                crosshair.style.width = "19px";
                crosshair.style.height = "19px";
                crosshairChecked = true;
            }
        }
    }
    setTimeout(updateCrosshair, 1000);

    // Optimized AutoTool System
    let lastToolCheck = 0;
    function autoToolCheck(now) {
        if (now - lastToolCheck >= 150) {
            const player = unsafeWindow.players?.[unsafeWindow.playerIndex];
            const blocks = unsafeWindow.blocks;
            if (player && blocks) {
                const target = blocks.find(block => {
                    const dx = player.x - block.x;
                    const dy = player.y - block.y;
                    const dz = player.z - block.z;
                    return (dx * dx + dy * dy + dz * dz) < 25 && block.breakable;
                });

                if (target) {
                    const bestTool = getToolForBlock(target.type);
                    if (bestTool !== -1 && player.selectedItem !== bestTool) {
                        unsafeWindow.setHeld(bestTool);
                    }
                }
            }
            lastToolCheck = now;
        }
        requestAnimationFrame(autoToolCheck);
    }
    requestAnimationFrame(autoToolCheck);

    function getToolForBlock(blockType) {
        const blockToolMap = {
            "stone": 1,
            "dirt": 2,
            "wood": 3,
            "sand": 2,
            "leaves": 4,
        };
        return blockToolMap[blockType] ?? -1;
    }

    // Cleanup function
    window.addEventListener('beforeunload', () => {
        doc.removeEventListener('keydown', handleKeyDown);
        doc.removeEventListener('keyup', handleKeyUp);
        doc.removeEventListener('mousedown', handleMouseDown);
        doc.removeEventListener('mouseup', handleMouseUp);
        clearInterval(cpsInterval);
    });

    console.log("IMMORTAL CLIENT v7.0 – Demon Ascension fully loaded (OPTIMIZED).");
})();