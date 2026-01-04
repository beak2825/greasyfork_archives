// ==UserScript==
// @name         xzan9's Deadshot.io Aimbot Helper
// @namespace    http://tampermonkey.net/
// @version      2024-05-18
// @description  Adds Aimbot feature to Deadshot.io with a professional UI. Made by xzan9. Press B to enable Aimbot.
// @author       You
// @match        *://deadshot.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506905/xzan9%27s%20Deadshotio%20Aimbot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/506905/xzan9%27s%20Deadshotio%20Aimbot%20Helper.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let aimbotEnabled = false;
    let uiVisible = true;
 
    // Create the UI
    function createUI() {
        const container = document.createElement('div');
        container.id = 'helperUI';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.color = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.fontFamily = 'Arial, sans-serif';
 
        const aimbotButton = document.createElement('button');
        aimbotButton.textContent = 'Aimbot: OFF (Press B to enable)';
        aimbotButton.style.marginRight = '5px';
        aimbotButton.onclick = () => {
            aimbotEnabled = !aimbotEnabled;
            aimbotButton.textContent = aimbotEnabled ? 'Aimbot: ON (Press B to disable)' : 'Aimbot: OFF (Press B to enable)';
        };
 
        const toggleInfo = document.createElement('div');
        toggleInfo.textContent = 'Press F6 to hide/show this menu';
        toggleInfo.style.marginTop = '10px';
 
        const credits = document.createElement('div');
        credits.textContent = 'Made by xzan9';
        credits.style.marginTop = '10px';
        credits.style.fontSize = 'smaller';
        credits.style.color = '#ccc';
 
        container.appendChild(aimbotButton);
        container.appendChild(toggleInfo);
        container.appendChild(credits);
        document.body.appendChild(container);
    }
 
    // Toggle UI visibility
    function toggleUI() {
        const container = document.getElementById('helperUI');
        if (uiVisible) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
        }
        uiVisible = !uiVisible;
    }
 
    // Function for Aimbot
    function aimbot() {
        if (!aimbotEnabled) return;
 
        const enemies = document.querySelectorAll('.enemy-character'); // Updated with actual enemy selector
        const crosshair = document.querySelector('.game-crosshair'); // Updated with actual crosshair selector
 
        if (enemies.length === 0) return;
 
        let nearestEnemy = null;
        let nearestDistance = Infinity;
 
        enemies.forEach(enemy => {
            const rect = enemy.getBoundingClientRect();
            const crosshairRect = crosshair.getBoundingClientRect();
            const distance = Math.hypot(rect.left - crosshairRect.left, rect.top - crosshairRect.top);
 
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
 
        if (nearestEnemy) {
            // Move crosshair towards the nearest enemy
            crosshair.style.left = `${nearestEnemy.getBoundingClientRect().left + nearestEnemy.clientWidth / 2}px`;
            crosshair.style.top = `${nearestEnemy.getBoundingClientRect().top + nearestEnemy.clientHeight / 2}px`;
        }
    }
 
    // Initialize the UI and run the functions periodically
    createUI();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F6') {
            toggleUI();
        }
        if (e.key === 'b' || e.key === 'B') {
            aimbotEnabled = !aimbotEnabled;
            const aimbotButton = document.querySelector('#helperUI button');
            aimbotButton.textContent = aimbotEnabled ? 'Aimbot: ON (Press B to disable)' : 'Aimbot: OFF (Press B to enable)';
        }
    });
 
    setInterval(aimbot, 100);
 
})();