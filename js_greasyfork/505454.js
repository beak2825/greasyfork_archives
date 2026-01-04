// ==UserScript==
// @name         Advanced Scratch Block Customizer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Customize Scratch blocks, create custom blocks, and access advanced settings with a modern UI.
// @match        *://scratch.mit.edu/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505454/Advanced%20Scratch%20Block%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/505454/Advanced%20Scratch%20Block%20Customizer.meta.js
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
            top: 20px;
            right: 20px;
            width: 400px;
            height: 600px;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            padding: 20px;
            display: none;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            color: #333;
        }
        #scratchCustomizerGui h2 {
            margin-top: 0;
            font-size: 24px;
            text-align: center;
            color: #007bff;
        }
        #scratchCustomizerGui .gui-section {
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        #scratchCustomizerGui .gui-section h3 {
            font-size: 20px;
            color: #333;
        }
        #scratchCustomizerGui button {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 12px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: #007bff;
            color: #fff;
            transition: background-color 0.3s;
        }
        #scratchCustomizerGui button:hover {
            background: #0056b3;
        }
        #scratchCustomizerGui button:active {
            background: #004494;
        }
        #scratchCustomizerGui .color-picker,
        #scratchCustomizerGui select,
        #scratchCustomizerGui input,
        #scratchCustomizerGui textarea {
            width: calc(100% - 22px);
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #ddd;
            box-sizing: border-box;
        }
        #scratchCustomizerGui .custom-block {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        #scratchCustomizerGui .custom-block input {
            margin-right: 10px;
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
            font-size: 16px;
            transition: background-color 0.3s;
        }
        #openScratchCustomizerButton:hover {
            background: #0056b3;
        }
        #openScratchCustomizerButton:active {
            background: #004494;
        }
        #scratchCustomizerGui .theme-option {
            display: inline-block;
            margin: 0 10px;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
        }
        #scratchCustomizerGui .theme-option:hover {
            background: #f0f0f0;
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
    guiTitle.innerText = 'Advanced Scratch Customizer';
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
        <div id="customBlockEditor" class="gui-section" style="display: none;">
            <h4>Custom Block Editor</h4>
            <label>Block Name:</label>
            <input type="text" id="customBlockName" placeholder="Enter block name">
            <label>Block Color:</label>
            <input type="color" id="customBlockColor" class="color-picker">
            <label>Block Function:</label>
            <textarea id="customBlockFunction" rows="4" placeholder="Enter block function code"></textarea>
            <button id="saveCustomBlockButton">Save Block</button>
        </div>
    `;
    guiContainer.appendChild(customBlockSection);

    // Section: Theme Chooser
    const themeSection = document.createElement('div');
    themeSection.className = 'gui-section';
    themeSection.innerHTML = `
        <h3>Theme Chooser</h3>
        <div id="themeOptions">
            <div class="theme-option" id="defaultTheme">Default</div>
            <div class="theme-option" id="darkTheme">Dark</div>
            <div class="theme-option" id="cupcakeTheme">Cupcake</div>
            <div class="theme-option" id="moonTheme">Moon</div>
            <div class="theme-option" id="sunTheme">Sun</div>
        </div>
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
            control: ['Wait 1 Sec', 'Repeat 10 Times'],
            sensing: ['Ask and Wait', 'Touching Color'],
            operators: ['Pick Random 1 to 10', 'Join', 'Letter of'],
            variables: ['Set Variable', 'Change Variable']
        };

        blocks[category].forEach(block => {
            const option = document.createElement('option');
            option.value = block;
            option.text = block;
            blockSelector.appendChild(option);
        });
    }

    // Event Listener for Apply Block Color Button
    document.getElementById('applyBlockColorButton').addEventListener('click', () => {
        const blockType = document.getElementById('specificBlockSelector').value;
        const blockColor = document.getElementById('blockColorPicker').value;
        const textColor = document.getElementById('blockTextColorPicker').value;
        const bgColor = document.getElementById('blockBgColorPicker').value;

        applyBlockStyles(blockType, blockColor, textColor, bgColor);
    });

    // Event Listener for Create Custom Block Button
    document.getElementById('createCustomBlockButton').addEventListener('click', () => {
        document.getElementById('customBlockEditor').style.display = 'block';
    });

    // Event Listener for Modify Block Function Button
    document.getElementById('modifyBlockFunctionButton').addEventListener('click', () => {
        document.getElementById('customBlockEditor').style.display = 'block';
    });

    // Event Listener for Save Custom Block Button
    document.getElementById('saveCustomBlockButton').addEventListener('click', () => {
        const name = document.getElementById('customBlockName').value;
        const color = document.getElementById('customBlockColor').value;
        const functionCode = document.getElementById('customBlockFunction').value;

        // Save the custom block (to be implemented)
        alert(`Saved custom block: ${name}\nColor: ${color}\nFunction: ${functionCode}`);
    });

    // Event Listener for Apply Theme Button
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.id.replace('Theme', '');
            applyTheme(theme);
        });
    });

    // Event Listener for Open Settings Button
    document.getElementById('openSettingsButton').addEventListener('click', () => {
        openCustomSettings();
    });

    // Function to apply block styles
    function applyBlockStyles(blockType, blockColor, textColor, bgColor) {
        alert(`Applying styles to block: ${blockType}\nColor: ${blockColor}\nText Color: ${textColor}\nBackground Color: ${bgColor}`);
        // Implement style application to blocks here
    }

    // Function to apply a theme
    function applyTheme(theme) {
        alert(`Applying theme: ${theme}`);
        // Implement theme application to the Scratch website here
    }

    // Function to open custom settings (To be implemented)
    function openCustomSettings() {
        alert('Custom Settings not yet implemented.');
    }
})();
