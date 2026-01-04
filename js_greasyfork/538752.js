// ==UserScript==
// @name         Ultimate Auto Clicker (Compact UI, Cursor-based)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Best auto-clicker: clean, compact UI, Ctrl+E toggle, and cursor-based clicking (Mac-friendly too!) 🚀🖱️💻
// @author       Marley
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538752/Ultimate%20Auto%20Clicker%20%28Compact%20UI%2C%20Cursor-based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538752/Ultimate%20Auto%20Clicker%20%28Compact%20UI%2C%20Cursor-based%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ Prevent duplicate UI
    if (window.__ultimateClickerLoaded) return;
    window.__ultimateClickerLoaded = true;

    let autoClicking = false;
    let intervalId = null;
    const intervalMs = 100;

    // ✅ Track cursor position
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ✅ Auto-click function
    function clickUnderCursor() {
        const el = document.elementFromPoint(mouseX, mouseY);
        if (el) el.click();
    }

    // ✅ Toggle function
    function toggleClicker() {
        autoClicking = !autoClicking;
        statusDot.style.backgroundColor = autoClicking ? '#00ff80' : '#ff4d4d';
        toggleBtn.textContent = autoClicking ? 'Stop' : 'Start';

        if (autoClicking) {
            intervalId = setInterval(clickUnderCursor, intervalMs);
        } else {
            clearInterval(intervalId);
        }
    }

    // ✅ Keyboard toggle: Ctrl + E
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key.toLowerCase() === 'e') {
            toggleClicker();
        }
    });

    // === ✅ UI CREATION ===
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.left = '20px';
    panel.style.zIndex = '999999';
    panel.style.background = '#1e1e1e';
    panel.style.border = '1px solid #444';
    panel.style.borderRadius = '6px';
    panel.style.padding = '6px 10px';
    panel.style.display = 'flex';
    panel.style.alignItems = 'center';
    panel.style.gap = '8px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '12px';
    panel.style.color = '#eee';
    panel.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Start';
    toggleBtn.style.padding = '4px 8px';
    toggleBtn.style.fontSize = '12px';
    toggleBtn.style.backgroundColor = '#007bff';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.addEventListener('click', toggleClicker);

    const statusDot = document.createElement('div');
    statusDot.style.width = '10px';
    statusDot.style.height = '10px';
    statusDot.style.borderRadius = '50%';
    statusDot.style.backgroundColor = '#ff4d4d';
    statusDot.title = 'Clicker Status';

    const label = document.createElement('span');
    label.textContent = 'Auto-Clicker';

    panel.appendChild(label);
    panel.appendChild(statusDot);
    panel.appendChild(toggleBtn);
    document.body.appendChild(panel);
})();
