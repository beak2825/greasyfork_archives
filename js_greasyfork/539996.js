// ==UserScript==
// @name         Bloxd.io Ultimate Mod Menu
// @namespace    https://bloxd.io/
// @version      2.0
// @description  Adds a mod menu with Auto-Clicker, Flying, X-Ray, No-Clip, and more!
// @author       KING BLOXD
// @match        https://bloxd.io/
// @icon         https://bloxd.io/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539996/Bloxdio%20Ultimate%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/539996/Bloxdio%20Ultimate%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== MOD MENU SETUP =====
    let menuOpen = false;
    let autoClickerEnabled = false;
    let flyEnabled = false;
    let speedEnabled = false;
    let noClipEnabled = false;
    let xrayEnabled = false;
    let autoMineEnabled = false;
    let reachHackEnabled = false;
    let speedMultiplier = 2;
    let reachDistance = 10; // Default reach

    // Create the mod menu button
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Mod Menu';
    menuButton.style.position = 'fixed';
    menuButton.style.bottom = '20px';
    menuButton.style.right = '20px';
    menuButton.style.zIndex = '9999';
    menuButton.style.padding = '10px';
    menuButton.style.backgroundColor = '#4CAF50';
    menuButton.style.color = 'white';
    menuButton.style.border = 'none';
    menuButton.style.borderRadius = '5px';
    menuButton.style.cursor = 'pointer';
    document.body.appendChild(menuButton);

    // Create the mod menu panel
    const menuPanel = document.createElement('div');
    menuPanel.style.position = 'fixed';
    menuPanel.style.bottom = '60px';
    menuPanel.style.right = '20px';
    menuPanel.style.width = '250px';
    menuPanel.style.backgroundColor = '#2c3e50';
    menuPanel.style.borderRadius = '5px';
    menuPanel.style.padding = '10px';
    menuPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    menuPanel.style.display = 'none';
    menuPanel.style.zIndex = '9999';
    document.body.appendChild(menuPanel);

    // Toggle menu visibility
    menuButton.addEventListener('click', () => {
        menuOpen = !menuOpen;
        menuPanel.style.display = menuOpen ? 'block' : 'none';
    });

    // ===== MOD FEATURES =====

    // Auto-Clicker
    const autoClickerToggle = createToggleButton('Auto-Clicker: OFF', autoClickerEnabled);
    autoClickerToggle.addEventListener('click', () => {
        autoClickerEnabled = !autoClickerEnabled;
        updateButton(autoClickerToggle, 'Auto-Clicker', autoClickerEnabled);
    });
    menuPanel.appendChild(autoClickerToggle);

    // Auto-Mine (breaks blocks in front of you)
    const autoMineToggle = createToggleButton('Auto-Mine: OFF', autoMineEnabled);
    autoMineToggle.addEventListener('click', () => {
        autoMineEnabled = !autoMineEnabled;
        updateButton(autoMineToggle, 'Auto-Mine', autoMineEnabled);
    });
    menuPanel.appendChild(autoMineToggle);

    // Flying
    const flyToggle = createToggleButton('Fly: OFF', flyEnabled);
    flyToggle.addEventListener('click', () => {
        flyEnabled = !flyEnabled;
        updateButton(flyToggle, 'Fly', flyEnabled);
    });
    menuPanel.appendChild(flyToggle);

    // No-Clip (walk through blocks)
    const noClipToggle = createToggleButton('No-Clip: OFF', noClipEnabled);
    noClipToggle.addEventListener('click', () => {
        noClipEnabled = !noClipEnabled;
        updateButton(noClipToggle, 'No-Clip', noClipEnabled);
        if (noClipEnabled) {
            document.body.style.cursor = 'crosshair';
        } else {
            document.body.style.cursor = 'default';
        }
    });
    menuPanel.appendChild(noClipToggle);

    // Speed Boost
    const speedToggle = createToggleButton(`Speed (${speedMultiplier}x): OFF`, speedEnabled);
    speedToggle.addEventListener('click', () => {
        speedEnabled = !speedEnabled;
        updateButton(speedToggle, `Speed (${speedMultiplier}x)`, speedEnabled);
    });
    menuPanel.appendChild(speedToggle);

    // X-Ray (see through blocks)
    const xrayToggle = createToggleButton('X-Ray: OFF', xrayEnabled);
    xrayToggle.addEventListener('click', () => {
        xrayEnabled = !xrayEnabled;
        updateButton(xrayToggle, 'X-Ray', xrayEnabled);
        if (xrayEnabled) {
            document.querySelectorAll('.block').forEach(block => {
                block.style.opacity = '0.3';
            });
        } else {
            document.querySelectorAll('.block').forEach(block => {
                block.style.opacity = '1';
            });
        }
    });
    menuPanel.appendChild(xrayToggle);

    // Reach Hack (mine from far away)
    const reachToggle = createToggleButton(`Reach (${reachDistance} blocks): OFF`, reachHackEnabled);
    reachToggle.addEventListener('click', () => {
        reachHackEnabled = !reachHackEnabled;
        updateButton(reachToggle, `Reach (${reachDistance} blocks)`, reachHackEnabled);
    });
    menuPanel.appendChild(reachToggle);

    // ===== HELPER FUNCTIONS =====
    function createToggleButton(text, isEnabled) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.width = '100%';
        button.style.margin = '5px 0';
        button.style.padding = '8px';
        button.style.backgroundColor = isEnabled ? '#4CAF50' : '#e74c3c';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        return button;
    }

    function updateButton(button, text, isEnabled) {
        button.textContent = `${text}: ${isEnabled ? 'ON' : 'OFF'}`;
        button.style.backgroundColor = isEnabled ? '#4CAF50' : '#e74c3c';
    }

    // ===== GAME HACKS =====

    // Auto-Clicker Logic
    setInterval(() => {
        if (autoClickerEnabled) {
            const clickEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(clickEvent);
        }
    }, 100);

    // Auto-Mine Logic (breaks blocks in front of player)
    setInterval(() => {
        if (!autoMineEnabled || !window.player) return;

        // Simulate clicking in front of the player
        const breakEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(breakEvent);
    }, 300);

    // Flying Logic
    document.addEventListener('keydown', (e) => {
        if (!flyEnabled || !window.player) return;

        if (e.key === ' ') { // Space = Fly Up
            window.player.y += 1;
        } else if (e.key === 'Shift') { // Shift = Fly Down
            window.player.y -= 1;
        }
    });

    // No-Clip Logic (walk through walls)
    const originalCollision = true; // (May need adjustment)
    setInterval(() => {
        if (!window.player) return;
        window.player.noClip = noClipEnabled;
    }, 100);

    // Speed Boost Logic
    const originalMoveSpeed = 0.2;
    setInterval(() => {
        if (!window.player) return;
        window.player.speed = speedEnabled ? originalMoveSpeed * speedMultiplier : originalMoveSpeed;
    }, 100);

    // Reach Hack Logic
    const originalReach = 5; // Default reach
    setInterval(() => {
        if (!window.player) return;
        window.player.reach = reachHackEnabled ? reachDistance : originalReach;
    }, 100);
})();