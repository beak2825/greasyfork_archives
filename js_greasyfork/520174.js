// ==UserScript==
// @name         Change levelval and levelbar in Drawaria
// @namespace    http://tampermonkey.net/
// @version      2024-11-03
// @description  Change levelval and levelbar on your drawaria profile!
// @match        https://drawaria.online/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520174/Change%20levelval%20and%20levelbar%20in%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/520174/Change%20levelval%20and%20levelbar%20in%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the profile elements to load
    window.addEventListener('load', () => {
        // Get elements for level value and level bar
        const levelValElem = document.getElementById('levelval');
        const levelBarElem = document.getElementById('levelbar').querySelector('path');

        // Create UI container for controls
        const controlContainer = document.createElement('div');
        controlContainer.style.position = 'fixed';
        controlContainer.style.bottom = '10px';
        controlContainer.style.left = '10px';
        controlContainer.style.background = '#ffffff';
        controlContainer.style.padding = '10px';
        controlContainer.style.border = '1px solid #ccc';
        controlContainer.style.borderRadius = '8px';
        controlContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        controlContainer.style.zIndex = '9999';

        // Create slider for level value
        const levelSlider = document.createElement('input');
        levelSlider.type = 'range';
        levelSlider.min = 1;
        levelSlider.max = 100;
        levelSlider.value = parseInt(levelValElem.textContent, 10);
        levelSlider.style.width = '100%';

        // Display current level value
        const levelDisplay = document.createElement('div');
        levelDisplay.textContent = `Level: ${levelSlider.value}`;
        levelDisplay.style.marginTop = '8px';
        levelDisplay.style.textAlign = 'center';

        // Update level value and display
        levelSlider.addEventListener('input', () => {
            const level = levelSlider.value;
            levelValElem.textContent = level;
            levelDisplay.textContent = `Level: ${level}`;
            updateLevelBar(level);
        });

        // Button to reset level to default
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.marginTop = '10px';
        resetButton.style.width = '100%';
        resetButton.style.padding = '5px';
        resetButton.style.background = '#f44336';
        resetButton.style.color = '#fff';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';

        resetButton.addEventListener('click', () => {
            levelSlider.value = 0;
            levelValElem.textContent = '0';
            levelDisplay.textContent = 'Level: 0';
            updateLevelBar(0);
        });

        // Function to update the level bar based on the level value
        function updateLevelBar(level) {
            const endAngle = (level / 101) * Math.PI * 2;
            const x = 0.5 + 0.475 * Math.cos(endAngle - Math.PI / 2);
            const y = 0.5 + 0.475 * Math.sin(endAngle - Math.PI / 2);
            levelBarElem.setAttribute('d', `M 0.5 0.025 A 0.475 0.475 0 ${level >= 50 ? 1 : 0} 1 ${x} ${y}`);
        }

        // Append controls to the container
        controlContainer.appendChild(levelSlider);
        controlContainer.appendChild(levelDisplay);
        controlContainer.appendChild(resetButton);

        // Add the container to the body
        document.body.appendChild(controlContainer);
    });
})();
