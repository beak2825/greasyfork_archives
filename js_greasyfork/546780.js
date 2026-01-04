// ==UserScript==
// @name         CraftNite Schematics Loader (Local + Picker + Auto Msg)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Load custom .schematic files into CraftNite and auto announce script author
// @license      All rights reserved
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546780/CraftNite%20Schematics%20Loader%20%28Local%20%2B%20Picker%20%2B%20Auto%20Msg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546780/CraftNite%20Schematics%20Loader%20%28Local%20%2B%20Picker%20%2B%20Auto%20Msg%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------- Overlay --------------------
    const overlay = document.createElement('div');
    overlay.innerText = 'CraftNite Script Loaded ✅';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.padding = '6px 12px';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.color = 'lime';
    overlay.style.fontSize = '14px';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.zIndex = '9999';
    overlay.style.borderRadius = '5px';
    document.body.appendChild(overlay);

    // -------------------- Schematics --------------------
    const schematics = {
        hall: 'https://www.minecraft-schematics.com/download/26063',
        arena: 'https://www.minecraft-schematics.com/download/26010',
        person: null
    };

    let placementPos = null;
    let lastPickedSchematic = null;
    let personSchematic = null;

    const filePath = '/mnt/data/Adventure Time by Kaizen87.schem';
    fetch(filePath)
        .then(res => res.arrayBuffer())
        .then(buf => { personSchematic = new Uint8Array(buf); })
        .catch(err => console.error('Failed to load local schematic:', err));

    // -------------------- Chat Hook --------------------
    const originalSendChat = GAME.a865.sendChat;
    GAME.a865.sendChat = function(msg) {
        if (msg.startsWith('//')) {
            const args = msg.slice(2).split(' ');
            const command = args[0].toLowerCase();

            if (command === 'pos') {
                placementPos = GAME.a865.player.position.clone();
                addCustomChat('Schematics', `Placement position set to: ${placementPos.x.toFixed(1)}, ${placementPos.y.toFixed(1)}, ${placementPos.z.toFixed(1)}`);
            } else if (command === 'person') {
                if (!placementPos) return addCustomChat('Schematics', 'Error: Set position first with //pos');
                if (!personSchematic) return addCustomChat('Schematics', 'Error: Local schematic not loaded yet!');
                cheatnite.worldedit.loadSchematic(personSchematic, placementPos);
                addCustomChat('Schematics', 'Local schematic placed!');
            } else if (command === 'pick') {
                if (!placementPos) return addCustomChat('Schematics', 'Error: Set position first with //pos');
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.schem';
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const arrayBuffer = await file.arrayBuffer();
                    lastPickedSchematic = new Uint8Array(arrayBuffer);
                    cheatnite.worldedit.loadSchematic(lastPickedSchematic, placementPos);
                    addCustomChat('Schematics', `Picked schematic "${file.name}" placed!`);
                };
                input.click();
            } else if (command === 'last') {
                if (!placementPos) return addCustomChat('Schematics', 'Error: Set position first with //pos');
                if (!lastPickedSchematic) return addCustomChat('Schematics', 'Error: No schematic picked yet!');
                cheatnite.worldedit.loadSchematic(lastPickedSchematic, placementPos);
                addCustomChat('Schematics', 'Last picked schematic placed!');
            } else if (schematics[command]) {
                if (!placementPos) return addCustomChat('Schematics', 'Error: Set position first with //pos');
                loadSchematic(schematics[command], placementPos);
            } else {
                addCustomChat('Schematics', `Unknown command: ${command}`);
            }
        } else {
            originalSendChat.call(this, msg);
        }
    };

    // -------------------- Load Schematic --------------------
    async function loadSchematic(url, pos) {
        addCustomChat('Schematics', `Loading schematic from ${url}...`);
        const response = await fetch(url);
        if (!response.ok) return addCustomChat('Schematics', 'Failed to load schematic!');
        const arrayBuffer = await response.arrayBuffer();
        const schematicData = new Uint8Array(arrayBuffer);
        cheatnite.worldedit.loadSchematic(schematicData, pos);
        addCustomChat('Schematics', 'Schematic placed!');
    }

    // -------------------- Custom Chat --------------------
    function addCustomChat(sender, message) {
        GAME.a865.addChatMessage(`[${sender}] ${message}`);
    }

    // -------------------- Auto Message on Join --------------------
    const originalJoinRound = GAME.a865.joinRound;
    GAME.a865.joinRound = function(...args) {
        const result = originalJoinRound.apply(this, args);
        setTimeout(() => {
            originalSendChat.call(GAME.a865, 'using a script made by havvingyy and noorie');
        }, 2000); // Slight delay to ensure chat is ready
        return result;
    };

})();
