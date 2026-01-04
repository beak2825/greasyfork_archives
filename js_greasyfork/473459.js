// ==UserScript==
// @name         Krunker.io Cheat
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Aim assist cheat for Krunker.io with toggleable menu using the M key and logging errors
// @author       Alphabreak
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473459/Krunkerio%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/473459/Krunkerio%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create menu elements
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    menuContainer.style.padding = '20px';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.color = 'white';
    menuContainer.style.display = 'none'; // Start with menu hidden
    menuContainer.innerHTML = `
        <h2>Cheat Menu</h2>
        <button id="toggleButton">Toggle Aim Assist</button>
        <div id="errorLog"></div>
    `;
    document.body.appendChild(menuContainer);

    const canvas = document.getElementById('gameCanvas');
    let aimAssistEnabled = false;
    let menuVisible = false;

    function aimAt(targetX, targetY) {
        const playerX = canvas.width / 2;
        const playerY = canvas.height / 2;
        const deltaX = targetX - playerX;
        const deltaY = targetY - playerY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = parseInt(document.getElementById('distanceValue').textContent, 10);
        const mouseX = playerX + Math.cos(angle) * distance;
        const mouseY = playerY + Math.sin(angle) * distance;

        const event = new MouseEvent('mousemove', {
            clientX: mouseX,
            clientY: mouseY,
        });

        canvas.dispatchEvent(event);
    }

    function toggleAimAssist() {
        aimAssistEnabled = !aimAssistEnabled;
        const toggleButton = document.getElementById('toggleButton');
        toggleButton.textContent = aimAssistEnabled ? 'Aim Assist ON' : 'Aim Assist OFF';
    }

    function toggleMenu() {
        menuVisible = !menuVisible;
        menuContainer.style.display = menuVisible ? 'block' : 'none';
    }

    function logError(error) {
        const errorLog = document.getElementById('errorLog');
        const errorItem = document.createElement('p');
        errorItem.textContent = error;
        errorLog.appendChild(errorItem);
    }

    canvas.addEventListener('touchstart', function(event) {
        if (event.touches.length === 2 && aimAssistEnabled && menuVisible) {
            event.preventDefault(); // Prevent unintended interactions
            const target = document.querySelector('.enemy'); // Change this selector to target enemies
            if (target) {
                try {
                    const rect = target.getBoundingClientRect();
                    const targetX = rect.left + rect.width / 2;
                    const targetY = rect.top + rect.height / 2;
                    aimAt(targetX, targetY);
                } catch (error) {
                    logError(error.message);
                }
            }
        }
    });

    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', toggleAimAssist);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'm' || event.key === 'M') {
            toggleMenu();
        }
    });
})();
