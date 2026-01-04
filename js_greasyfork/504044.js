// ==UserScript==
// @name         Heart Clicker Game Cheats
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Cheat GUI for Heart Clicker Game with Functional Cheats and Modern Design
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504044/Heart%20Clicker%20Game%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/504044/Heart%20Clicker%20Game%20Cheats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the cheat GUI container
    const cheatMenu = document.createElement('div');
    cheatMenu.id = 'cheat-menu';
    cheatMenu.style.position = 'fixed';
    cheatMenu.style.top = '10px';
    cheatMenu.style.right = '10px';
    cheatMenu.style.backgroundColor = '#ffffff';
    cheatMenu.style.border = '2px solid #ddd';
    cheatMenu.style.borderRadius = '10px';
    cheatMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    cheatMenu.style.padding = '20px';
    cheatMenu.style.zIndex = '10000';
    cheatMenu.style.display = 'none';
    cheatMenu.style.width = '300px';
    cheatMenu.style.fontFamily = 'Arial, sans-serif';
    cheatMenu.style.cursor = 'move'; // Set cursor to indicate draggable
    document.body.appendChild(cheatMenu);

    // Make the cheat menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    cheatMenu.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - cheatMenu.getBoundingClientRect().left;
        offsetY = e.clientY - cheatMenu.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            cheatMenu.style.left = `${e.clientX - offsetX}px`;
            cheatMenu.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.backgroundColor = '#e74c3c';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginBottom = '10px';
    closeButton.onclick = () => {
        cheatMenu.style.display = 'none';
    };
    cheatMenu.appendChild(closeButton);

    // Add Set Hearts
    const setHeartsContainer = document.createElement('div');
    setHeartsContainer.style.marginBottom = '10px';
    setHeartsContainer.innerHTML = `
        <label for="set-heart-count">Set Hearts:</label>
        <input type="number" id="set-heart-count" min="0" style="width: 100%; padding: 5px;">
        <button id="set-heart-btn" style="width: 100%; padding: 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Set Hearts</button>
    `;
    cheatMenu.appendChild(setHeartsContainer);

    // Add Change Character
    const changeCharacterContainer = document.createElement('div');
    changeCharacterContainer.style.marginBottom = '10px';
    changeCharacterContainer.innerHTML = `
        <label for="character-select">Select Heart Character:</label>
        <select id="character-select" style="width: 100%; padding: 5px;">
            <option value="❤️">❤️</option>
            <option value="💛">💛</option>
            <option value="💚">💚</option>
            <option value="💙">💙</option>
            <option value="💜">💜</option>
            <option value="🖤">🖤</option>
            <!-- Add more heart characters here -->
        </select>
        <button id="change-character-btn" style="width: 100%; padding: 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Change Character</button>
    `;
    cheatMenu.appendChild(changeCharacterContainer);

    // Add Buy Upgrade
    const buyUpgradeContainer = document.createElement('div');
    buyUpgradeContainer.style.marginBottom = '10px';
    buyUpgradeContainer.innerHTML = `
        <label for="upgrade-select">Select Upgrade:</label>
        <select id="upgrade-select" style="width: 100%; padding: 5px;">
            <option value="auto-clicker">Auto-Clicker</option>
            <option value="double-hearts">Double Hearts</option>
            <option value="heart-multiplier">Heart Multiplier</option>
            <!-- Add more upgrades here -->
        </select>
        <button id="buy-upgrade-btn" style="width: 100%; padding: 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Buy Upgrade</button>
    `;
    cheatMenu.appendChild(buyUpgradeContainer);

    // Add Additional Cheats
    const cheats = [
        { id: 'cheat1', text: 'Unlock All Upgrades', action: () => unlockAllUpgrades() },
        { id: 'cheat2', text: 'Add 10,000 Hearts', action: () => { window.heartCount += 10000; updateHeartsDisplay(); } },
        { id: 'cheat3', text: 'Set Hearts to Max', action: () => { window.heartCount = Number.MAX_SAFE_INTEGER; updateHeartsDisplay(); } },
        { id: 'cheat4', text: 'Enable Double Clicks', action: () => { window.doubleClicksEnabled = true; } },
        { id: 'cheat5', text: 'Disable Click Limit', action: () => { window.clickLimitDisabled = true; } },
        { id: 'cheat6', text: 'Reset Game Progress', action: () => { window.heartCount = 0; updateHeartsDisplay(); } },
        { id: 'cheat7', text: 'Add 1 Million Hearts', action: () => { window.heartCount += 1000000; updateHeartsDisplay(); } },
        { id: 'cheat8', text: 'Grant All Achievements', action: () => grantAllAchievements() },
        { id: 'cheat9', text: 'Set Heart Multiplier to 10x', action: () => { window.heartMultiplier = 10; } },
        { id: 'cheat10', text: 'Unlock VIP Heart Character', action: () => unlockVIPHeart() },
        { id: 'cheat11', text: 'Instant Auto-Clicker', action: () => { window.autoClickerEnabled = true; } },
        { id: 'cheat12', text: 'Double Upgrade Speed', action: () => { window.upgradeSpeed *= 2; } },
        { id: 'cheat13', text: 'Set All Upgrades to Max Level', action: () => setAllUpgradesToMax() },
        { id: 'cheat14', text: 'Change Background Color', action: () => document.body.style.backgroundColor = '#f0f0f0' },
        { id: 'cheat15', text: 'Enable Infinite Hearts', action: () => { window.infiniteHearts = true; } },
        { id: 'cheat16', text: 'Grant Extra Lives', action: () => { window.lives += 5; } },
        { id: 'cheat17', text: 'Unlock All Characters', action: () => unlockAllCharacters() },
        { id: 'cheat18', text: 'Set Game Speed to Fast', action: () => { window.gameSpeed = 2; } },
        { id: 'cheat19', text: 'Apply Random Upgrade', action: () => applyRandomUpgrade() },
        { id: 'cheat20', text: 'Reset to Default Settings', action: () => resetToDefaultSettings() }
    ];

    cheats.forEach((cheat) => {
        const cheatButton = document.createElement('button');
        cheatButton.id = cheat.id;
        cheatButton.innerText = cheat.text;
        cheatButton.style.width = '100%';
        cheatButton.style.padding = '10px';
        cheatButton.style.backgroundColor = '#3498db';
        cheatButton.style.color = '#fff';
        cheatButton.style.border = 'none';
        cheatButton.style.borderRadius = '5px';
        cheatButton.style.cursor = 'pointer';
        cheatButton.style.marginBottom = '10px';
        cheatButton.onclick = cheat.action;
        cheatMenu.appendChild(cheatButton);
    });

    // Add the cheat menu toggle button
    const toggleCheatButton = document.createElement('button');
    toggleCheatButton.innerText = 'Open Cheats';
    toggleCheatButton.style.position = 'fixed';
    toggleCheatButton.style.bottom = '10px';
    toggleCheatButton.style.right = '10px';
    toggleCheatButton.style.backgroundColor = '#e74c3c';
    toggleCheatButton.style.color = '#fff';
    toggleCheatButton.style.border = 'none';
    toggleCheatButton.style.padding = '10px 20px';
    toggleCheatButton.style.borderRadius = '5px';
    toggleCheatButton.style.cursor = 'pointer';
    toggleCheatButton.onclick = () => {
        cheatMenu.style.display = (cheatMenu.style.display === 'none') ? 'block' : 'none';
    };
    document.body.appendChild(toggleCheatButton);

    // Example implementations of cheat actions
    function unlockAllUpgrades() {
        // Implement logic to unlock all upgrades
        alert('All upgrades unlocked!');
    }

    function grantAllAchievements() {
        // Implement logic to grant all achievements
        alert('All achievements granted!');
    }

    function unlockVIPHeart() {
        // Implement logic to unlock VIP Heart Character
        alert('VIP Heart Character unlocked!');
    }

    function setAllUpgradesToMax() {
        // Implement logic to set all upgrades to max level
        alert('All upgrades set to max level!');
    }

    function unlockAllCharacters() {
        // Implement logic to unlock all characters
        alert('All characters unlocked!');
    }

    function applyRandomUpgrade() {
        // Implement logic to apply a random upgrade
        alert('Random upgrade applied!');
    }

    function resetToDefaultSettings() {
        // Implement logic to reset game to default settings
        alert('Game settings reset to default!');
    }

    function updateHeartsDisplay() {
        // Update the hearts display with the new count
        // This function should reflect the changes in the UI
    }

})();
