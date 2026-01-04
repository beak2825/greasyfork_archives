// ==UserScript==
// @name         Pixel Warfare Quick GUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a simple, retro-styled GUI for Pixel Warfare with weapon tips and mock stats
// @author       You
// @match        https://www.crazygames.com/game/pixel-warfare
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540254/Pixel%20Warfare%20Quick%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/540254/Pixel%20Warfare%20Quick%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI container
    const gui = document.createElement('div');
    gui.id = 'pixelWarfareQuickGui';
    gui.style.position = 'fixed';
    gui.style.top = '20px';
    gui.style.right = '20px';
    gui.style.background = '#000';
    gui.style.color = '#ff00ff'; // Neon magenta for a bold, retro vibe
    gui.style.padding = '10px';
    gui.style.border = '2px solid #ff00ff';
    gui.style.fontFamily = '"Press Start 2P", monospace'; // 8-bit font
    gui.style.fontSize = '10px';
    gui.style.zIndex = '10000';
    gui.style.cursor = 'move';
    gui.style.userSelect = 'none';
    gui.style.borderRadius = '5px';
    gui.style.maxWidth = '200px';

    // GUI content
    gui.innerHTML = `
        <h3 style="margin: 0; font-size: 12px; text-align: center;">Quick GUI</h3>
        <button id="toggleGui" style="width: 100%; background: #ff0000; color: #fff; border: none; padding: 4px; cursor: pointer; font-family: inherit; font-size: 10px;">Hide</button>
        <div id="guiContent">
            <p style="margin: 5px 0;"><strong>Weapons:</strong></p>
            <ul style="list-style: none; padding: 0; margin: 5px 0;">
                <li>Sniper: Long-range (RMB)</li>
                <li>Shotgun: Close-up power</li>
                <li>Rocket: Group damage</li>
                <li>MGun: Rapid fire</li>
            </ul>
            <p style="margin: 5px 0;"><strong>Stats:</strong></p>
            <ul style="list-style: none; padding: 0; margin: 5px 0;">
                <li>Kills: <span id="kills">0</span></li>
                <li>Deaths: <span id="deaths">0</span></li>
                <li>K/D: <span id="kd">0.0</span></li>
            </ul>
        </div>
    `;

    // Add retro font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    document.body.appendChild(gui);

    // Make GUI draggable
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
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

    // Toggle GUI visibility
    const toggleButton = document.getElementById('toggleGui');
    const guiContent = document.getElementById('guiContent');
    toggleButton.addEventListener('click', () => {
        if (guiContent.style.display === 'none') {
            guiContent.style.display = 'block';
            toggleButton.textContent = 'Hide';
            toggleButton.style.background = '#ff0000';
        } else {
            guiContent.style.display = 'none';
            toggleButton.textContent = 'Show';
            toggleButton.style.background = '#00ff00';
        }
    });

    // Simulate stats (no live data access in Unity WebGL)
    setInterval(() => {
        const kills = Math.floor(Math.random() * 30);
        const deaths = Math.floor(Math.random() * 15);
        document.getElementById('kills').textContent = kills;
        document.getElementById('deaths').textContent = deaths;
        document.getElementById('kd').textContent = deaths > 0 ? (kills / deaths).toFixed(1) : kills.toFixed(1);
    }, 3000);
})();