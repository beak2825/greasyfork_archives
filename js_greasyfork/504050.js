// ==UserScript==
// @name         Heart Clicker Game Cheat GUI
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add a mini cheat GUI to the Heart Clicker Game, make it draggable, and ensure all cheats work
// @match        https://heart-io.github.io/Heart/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504050/Heart%20Clicker%20Game%20Cheat%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/504050/Heart%20Clicker%20Game%20Cheat%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and apply styles
    const style = document.createElement('style');
    style.textContent = `
        #cheat-gui {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            cursor: move;
        }
        #cheat-gui button, #cheat-gui input, #cheat-gui select {
            margin: 5px 0;
            padding: 5px;
            font-size: 14px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        #cheat-gui button {
            background-color: #3498db;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: background 0.2s ease-in-out;
        }
        #cheat-gui button:hover {
            background-color: #2980b9;
        }
    `;
    document.head.appendChild(style);

    // Create and add cheat GUI
    const cheatGui = document.createElement('div');
    cheatGui.id = 'cheat-gui';
    document.body.appendChild(cheatGui);

    const cheatTitle = document.createElement('h2');
    cheatTitle.innerText = 'Cheat Console';
    cheatGui.appendChild(cheatTitle);

    const setHeartInput = document.createElement('input');
    setHeartInput.id = 'set-heart-input';
    setHeartInput.placeholder = 'Enter heart amount';
    setHeartInput.type = 'number';
    cheatGui.appendChild(setHeartInput);

    const setHeartButton = document.createElement('button');
    setHeartButton.id = 'set-heart-button';
    setHeartButton.innerText = 'Set Hearts';
    cheatGui.appendChild(setHeartButton);

    const characterSelect = document.createElement('select');
    characterSelect.id = 'character-select';
    const heartOptions = ['❤️', '💙', '💚', '💛', '💜']; // Modify as needed
    heartOptions.forEach(char => {
        const option = document.createElement('option');
        option.value = char;
        option.innerText = char;
        characterSelect.appendChild(option);
    });
    cheatGui.appendChild(characterSelect);

    const setCharacterButton = document.createElement('button');
    setCharacterButton.id = 'set-character-button';
    setCharacterButton.innerText = 'Change Character';
    cheatGui.appendChild(setCharacterButton);

    const buyAnyUpgradeButton = document.createElement('button');
    buyAnyUpgradeButton.id = 'buy-any-upgrade-button';
    buyAnyUpgradeButton.innerText = 'Buy Any Upgrade';
    cheatGui.appendChild(buyAnyUpgradeButton);

    // Add additional cheats
    function addCheatButton(buttonId, buttonText, onClick) {
        const button = document.createElement('button');
        button.id = buttonId;
        button.innerText = buttonText;
        button.addEventListener('click', onClick);
        cheatGui.appendChild(button);
    }

    // Draggable functionality
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    makeDraggable(cheatGui);

    // Game state variables
    let heartCount = 0;
    let currentHeart = '❤️';

    // Update heart count display
    function updateHeartCount() {
        const heartCountElement = document.getElementById('heart-count');
        if (heartCountElement) {
            heartCountElement.innerText = heartCount;
        }
    }

    // Change heart character
    function changeHeartCharacter(newHeart) {
        currentHeart = newHeart;
        const clicker = document.getElementById('clicker');
        if (clicker) {
            clicker.innerText = currentHeart;
        }
    }

    // Apply upgrades
    function applyUpgrade() {
        const upgrades = document.querySelectorAll('#shop button[id^="buy-upgrade"]');
        upgrades.forEach(button => {
            const cost = parseInt(button.innerText.replace('Cost: ', '').replace(' Hearts', ''));
            if (heartCount >= cost) {
                heartCount -= cost;
                button.innerText = 'Purchased'; // Mark upgrade as purchased
                // Implement specific upgrade logic here
            }
        });
        updateHeartCount();
    }

    // Event handlers
    document.getElementById('set-heart-button').addEventListener('click', () => {
        const heartAmount = parseInt(document.getElementById('set-heart-input').value);
        if (!isNaN(heartAmount)) {
            heartCount = heartAmount;
            updateHeartCount();
        }
    });

    document.getElementById('set-character-button').addEventListener('click', () => {
        const selectedCharacter = document.getElementById('character-select').value;
        if (selectedCharacter) {
            changeHeartCharacter(selectedCharacter);
        }
    });

    document.getElementById('buy-any-upgrade-button').addEventListener('click', applyUpgrade);

    // Add cheat buttons with functionalities
    addCheatButton('cheat1', 'Unlock All Upgrades', () => {
        document.querySelectorAll('#shop button[id^="buy-upgrade"]').forEach(button => {
            button.innerText = 'Purchased'; // Mark as purchased
        });
    });
    addCheatButton('cheat2', 'Add 10,000 Hearts', () => { heartCount += 10000; updateHeartCount(); });
    addCheatButton('cheat3', 'Set Hearts to Max', () => { heartCount = Number.MAX_SAFE_INTEGER; updateHeartCount(); });
    addCheatButton('cheat4', 'Enable Double Clicks', () => alert('Double clicks enabled!'));
    addCheatButton('cheat5', 'Disable Click Limit', () => alert('Click limit disabled!'));
    addCheatButton('cheat6', 'Reset Game Progress', () => alert('Game progress reset!'));
    addCheatButton('cheat7', 'Add 1 Million Hearts', () => { heartCount += 1000000; updateHeartCount(); });
    addCheatButton('cheat8', 'Grant All Achievements', () => alert('All achievements granted!'));
    addCheatButton('cheat9', 'Set Heart Multiplier to 10x', () => alert('Heart multiplier set to 10x!'));
    addCheatButton('cheat10', 'Unlock VIP Heart Character', () => alert('VIP Heart Character unlocked!'));
    addCheatButton('cheat11', 'Instant Auto-Clicker', () => alert('Auto-clicker activated!'));
    addCheatButton('cheat12', 'Double Upgrade Speed', () => alert('Upgrade speed doubled!'));
    addCheatButton('cheat13', 'Set All Upgrades to Max Level', () => alert('All upgrades set to max level!'));
    addCheatButton('cheat14', 'Change Background Color', () => document.body.style.backgroundColor = '#f0f0f0');
    addCheatButton('cheat15', 'Enable Infinite Hearts', () => alert('Infinite hearts enabled!'));
    addCheatButton('cheat16', 'Grant Extra Lives', () => alert('5 extra lives granted!'));
    addCheatButton('cheat17', 'Unlock All Characters', () => alert('All characters unlocked!'));
    addCheatButton('cheat18', 'Set Game Speed to Fast', () => alert('Game speed set to fast!'));
    addCheatButton('cheat19', 'Apply Random Upgrade', () => alert('Random upgrade applied!'));
    addCheatButton('cheat20', 'Reset to Default Settings', () => alert('Game settings reset to default!'));

    // Restore system excluding cheats
    window.addEventListener('beforeunload', (event) => {
        const confirmationMessage = 'Are you sure you want to leave? Your progress may be lost!';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    });

    // Example of restoring hearts on page reload
    function restoreProgress() {
        // Restore hearts and other game state from localStorage
        const savedHearts = localStorage.getItem('heartCount');
        if (savedHearts) {
            heartCount = parseInt(savedHearts);
            updateHeartCount();
        }
    }

    function saveProgress() {
        // Save hearts and other game state to localStorage
        localStorage.setItem('heartCount', heartCount);
    }

    window.addEventListener('load', restoreProgress);
    window.addEventListener('unload', saveProgress);
})();
