// ==UserScript==
// @name         Bloxd.io Scaffold (Auto-Place Block Under Player) with Toggle + Status
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-place blocks under player in Bloxd.io using NoaHook, toggle with Z key, with visible status text on screen.
// @author       zNxrd
// @match        *://*.bloxd.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534678/Bloxdio%20Scaffold%20%28Auto-Place%20Block%20Under%20Player%29%20with%20Toggle%20%2B%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/534678/Bloxdio%20Scaffold%20%28Auto-Place%20Block%20Under%20Player%29%20with%20Toggle%20%2B%20Status.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scaffoldEnabled = false;
    let gameLoaded = false;

    // Add status display
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '10px';
    statusDiv.style.left = '10px';
    statusDiv.style.padding = '5px 10px';
    statusDiv.style.background = 'rgba(0, 0, 0, 0.5)';
    statusDiv.style.color = '#0f0';
    statusDiv.style.fontSize = '16px';
    statusDiv.style.fontFamily = 'monospace';
    statusDiv.style.zIndex = '9999';
    statusDiv.style.pointerEvents = 'none';
    statusDiv.textContent = 'Scaffold Status: Disabled';
    document.body.appendChild(statusDiv);

    function updateStatusText() {
        statusDiv.textContent = `Scaffold Status: ${scaffoldEnabled ? 'Enabled' : 'Disabled'}`;
        statusDiv.style.color = scaffoldEnabled ? '#0f0' : '#f00';
    }

    // Toggle scaffold with "Z" key
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'z') {
            scaffoldEnabled = !scaffoldEnabled;
            updateStatusText();
            console.log(`[Scaffold] ${scaffoldEnabled ? 'Enabled' : 'Disabled'}`);
        }
    });

    const waitForGame = () => {
        const interval = setInterval(() => {
            if (window.noa && window.SendPacket && noa.entities) {
                gameLoaded = true;
                clearInterval(interval);
                console.log('[Scaffold] Game detected. Ready.');
                startScaffold();
            }
        }, 250);
    };

    function isBlockBelow(pos) {
        const x = Math.floor(pos[0]);
        const y = Math.floor(pos[1]) - 1;
        const z = Math.floor(pos[2]);
        const blockId = noa.world.getBlock(x, y, z);
        return blockId !== 0;
    }

    function placeBlockBelow(pos) {
        const x = Math.floor(pos[0]);
        const y = Math.floor(pos[1]) - 1;
        const z = Math.floor(pos[2]);

        // Set your block type here (e.g., dirt = 1)
        const blockType = 1;

        SendPacket(2, `place|${x},${y},${z},${blockType}`);
    }

    function startScaffold() {
        function tick() {
            if (scaffoldEnabled) {
                const playerId = noa.playerEntity;
                const pos = noa.entities.getPosition(playerId);

                if (pos && !isBlockBelow(pos)) {
                    placeBlockBelow(pos);
                }
            }
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    updateStatusText();
    waitForGame();
})();
