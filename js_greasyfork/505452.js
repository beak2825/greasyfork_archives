// ==UserScript==
// @name         Advanced Scratch Block Customizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Customize Scratch blocks, create custom blocks, and access advanced settings.
// @match        *://scratch.mit.edu/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505452/Advanced%20Scratch%20Block%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/505452/Advanced%20Scratch%20Block%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the main GUI container
    const guiContainer = document.createElement('div');
    guiContainer.id = 'scratchCustomizerGui';
    document.body.appendChild(guiContainer);

    // Style the GUI
    GM_addStyle(`
        #scratchCustomizerGui {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 450px;
            height: 700px;
            background: #f5f5f5;
            border: 2px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            padding: 20px;
            display: none;
        }
        #scratchCustomizerGui h2 {
            margin-top: 0;
            font-size: 20px;
            text-align: center;
        }
        #scratchCustomizerGui .gui-section {
            margin-bottom: 20px;
        }
        #scratchCustomizerGui button {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 10px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #scratchCustomizerGui .color-picker,
        #scratchCustomizerGui select {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
        }
        #openScratchCustomizerButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #007bff;
            color: #fff;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            z-index: 10001;
        }
    `);

    // Add an Open button to toggle the GUI
    const openButton = document.createElement('button');
    openButton.id = 'openScratchCustomizerButton';
    openButton.innerText = 'Open Customizer';
    document.body.appendChild(openButton);

    // Event to open/close the GUI
    openButton.addEventListener('click', () => {
        guiContainer.style.display = guiContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Add close button to GUI
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
        guiContainer.style.display = 'none';
    });
    guiContainer.appendChild(closeButton);

    // GUI Title
    const guiTitle = document.createElement('h2');
    guiTitle.innerText = 'Scratch Block Customizer';
    guiContainer.appendChild(guiTitle);

    // Section: Block Selection and Modification
    const blockSelectionSection = document.createElement('div');
    blockSelectionSection.className = 'gui-section';
    blockSelectionSection.innerHTML = `
        <h3>Select and Modify Block</h3>
        <label>Select Block Category:</label>
        <select id="blockCategorySelector">
            <option value="motion">Motion</option>
            <option value="looks">Looks</option>
            <option value="sound">Sound</option>
            <option value="events">Events</option>
            <option value="control">Control</option>
            <option value="sensing">Sensing</option>
            <option value="operators">Operators</option>
            <option value="variables">Variables</option>
            <!-- Add more block categories if needed -->
        </select>
        <label>Select Specific Block:</label>
        <select id="specificBlockSelector">
            <!-- This will be dynamically populated based on category -->
        </select>
        <label>Pick a Block Color:</label>
        <input type="color" id="blockColorPicker" class="color-picker">
        <label>Pick a Text Color:</label>
        <input type="color" id="blockTextColorPicker" class="color-picker">
        <label>Pick a Block Background Color:</label>
        <input type="color" id="blockBgColorPicker" class="color-picker">
        <button id="applyBlockColorButton">Apply Changes</button>
    `;
    guiContainer.appendChild(blockSelectionSection);

    // Section: Custom Block Editor
    const customBlockSection = document.createElement('div');
    customBlockSection.className = 'gui-section';
    customBlockSection.innerHTML = `
        <h3>Custom Block Editor</h3>
        <button id="createCustomBlockButton">Create New Block</button>
        <button id="modifyBlockFunctionButton">Modify Block Functions</button>
    `;
    guiContainer.appendChild(customBlockSection);

    // Section: Theme Chooser
    const themeSection = document.createElement('div');
    themeSection.className = 'gui-section';
    themeSection.innerHTML = `
        <h3>Theme Chooser</h3>
        <select id="themeSelector">
            <option value="default">Default</option>
            <option value="dark">Dark Theme</option>
            <option value="cupcake">Cupcake Theme</option>
            <option value="moon">Moon Theme</option>
            <option value="sun">Sun Theme</option>
        </select>
        <button id="applyThemeButton">Apply Theme</button>
    `;
    guiContainer.appendChild(themeSection);

    // Section: Custom Settings
    const settingsSection = document.createElement('div');
    settingsSection.className = 'gui-section';
    settingsSection.innerHTML = `
        <h3>Custom Settings</h3>
        <button id="openSettingsButton">Open Settings</button>
    `;
    guiContainer.appendChild(settingsSection);

    // Event Listener for Block Category Selection
    document.getElementById('blockCategorySelector').addEventListener('change', function() {
        const category = this.value;
        populateSpecificBlocks(category);
    });

    // Populate specific blocks based on the selected category
    function populateSpecificBlocks(category) {
        const blockSelector = document.getElementById('specificBlockSelector');
        blockSelector.innerHTML = ''; // Clear existing options

        // Define blocks based on categories
        const blocks = {
            motion: ['Move 10 Steps', 'Turn Right', 'Turn Left'],
            looks: ['Say Hello', 'Think Hmm', 'Switch Costume'],
            sound: ['Play Sound', 'Stop All Sounds'],
            events: ['When Flag Clicked', 'When Key Pressed'],
            control: ['Wait 1 Sec', 'Repeat 10'],
            sensing: ['Touching Mouse Pointer', 'Distance to Mouse'],
            operators: ['Add 1 + 2', 'Subtract 2 - 1'],
            variables: ['Set My Variable', 'Change My Variable'],
            // Add more blocks as needed
        };

        // Populate the block selector
        blocks[category].forEach(block => {
            const option = document.createElement('option');
            option.value = block.toLowerCase().replace(/\s/g, '-');
            option.innerText = block;
            blockSelector.appendChild(option);
        });
    }

    // Event Listener for Apply Block Color Button
    document.getElementById('applyBlockColorButton').addEventListener('click', () => {
        const blockType = document.getElementById('specificBlockSelector').value;
        const blockColor = document.getElementById('blockColorPicker').value;
        const textColor = document.getElementById('blockTextColorPicker').value;
        const bgColor = document.getElementById('blockBgColorPicker').value;

        // Apply color and appearance changes to the selected block
        applyBlockStyles(blockType, blockColor, textColor, bgColor);
    });

    // Event Listener for Custom Block Editor
    document.getElementById('createCustomBlockButton').addEventListener('click', () => {
        // Open a custom block creator window or modal
        createCustomBlock();
    });

    document.getElementById('modifyBlockFunctionButton').addEventListener('click', () => {
        // Open block function modifier
        modifyBlockFunction();
    });

    // Event Listener for Apply Theme Button
    document.getElementById('applyThemeButton').addEventListener('click', () => {
        const selectedTheme = document.getElementById('themeSelector').value;
        applyTheme(selectedTheme);
    });

    document.getElementById('openSettingsButton').addEventListener('click', () => {
        // Open custom settings window or modal
        openCustomSettings();
    });

    // Function to apply block styles
    function applyBlockStyles(blockType, blockColor, textColor, bgColor) {
        const block = document.querySelector(`.scratch-block-${blockType}`);
        if (block) {
            block.style.backgroundColor = blockColor;
            block.style.color = textColor;
            block.style.borderColor = bgColor;
        }
    }

    // Function to create a custom block (To be implemented)
    function createCustomBlock() {
        alert('Custom Block Creator not yet implemented.');
    }

    // Function to modify block functions (To be implemented)
    function modifyBlockFunction() {
        alert('Block Function Modifier not yet implemented.');
    }

    // Function to apply a theme
    function applyTheme(theme) {
        alert('Theme ' + theme + ' applied!');
    }

    // Function to open custom settings (To be implemented)
    function openCustomSettings() {
        alert('Custom Settings not yet implemented.');
    }
})();
