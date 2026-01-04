// ==UserScript==
// @name         Pixel Warfare Stats GUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a draggable stats GUI for Pixel Warfare on CrazyGames
// @author       You
// @match        https://www.crazygames.com/game/pixel-warfare
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540250/Pixel%20Warfare%20Stats%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/540250/Pixel%20Warfare%20Stats%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI container
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.right = '10px';
    gui.style.background = '#333';
    gui.style.color = '#0f0';
    gui.style.padding = '10px';
    gui.style.border = '2px solid #0f0';
    gui.style.fontFamily = '"Courier New", monospace'; // Retro 8-bit style
    gui.style.zIndex = '9999';
    gui.style.cursor = 'move';
    gui.style.userSelect = 'none';
    gui.style.borderRadius = '5px';

    // Sample stats (since we can't access live game data, these are placeholders)
    gui.innerHTML = `
        <h3 style="margin: 0; font-size: 16px;">Pixel Warfare Stats</h3>
        <ul style="list-style: none; padding: 0; font-size: 14px;">
            <li>Kills: <span id="kills">0</span></li>
            <li>Deaths: <span id="deaths">0</span></li>
            <li>K/D Ratio: <span id="kd">0.0</span></li>
            <li>Weapons: Shotgun, Sniper, Rocket Launcher, Machinegun</li>
        </ul>
    `;

    document.body.appendChild(gui);

    // Make GUI draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    gui.addEventListener('mousedown', (e) => {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            gui.style.left = currentX + 'px';
            gui.style.top = currentY + 'px';
            gui.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Simulate stats update (since we can't access game data directly)
    // In a real scenario, you'd need to hook into the game's API if available
    setInterval(() => {
        document.getElementById('kills').textContent = Math.floor(Math.random() * 50); // Placeholder
        document.getElementById('deaths').textContent = Math.floor(Math.random() * 20); // Placeholder
        const kills = parseInt(document.getElementById('kills').textContent);
        const deaths = parseInt(document.getElementById('deaths').textContent);
        document.getElementById('kd').textContent = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
    }, 5000);
})();