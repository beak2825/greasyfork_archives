// ==UserScript==
// @name         Enhanced Scratch UI and Block Editor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance Scratch UI with custom block colors, themes, and more.
// @match        https://scratch.mit.edu/projects/*
// @match        https://scratch.mit.edu/editor/*
// @match        https://scratch.mit.edu/ideas*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505557/Enhanced%20Scratch%20UI%20and%20Block%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/505557/Enhanced%20Scratch%20UI%20and%20Block%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to add global styles
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // Add global styles for the GUI
    addGlobalStyle(`
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        #scratch-custom-gui {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #fef9e9;
            border: 2px solid #d1a3a4;
            padding: 15px;
            z-index: 1000;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            font-family: 'Comic Sans MS', cursive, sans-serif;
            color: #333;
            display: none;
        }
        #scratch-custom-gui h2 {
            font-size: 24px;
            border-bottom: 2px dashed #d1a3a4;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        #scratch-custom-gui button {
            margin: 5px;
            padding: 8px 15px;
            border: 2px solid #d1a3a4;
            border-radius: 8px;
            background-color: #f8d5d5;
            color: #333;
            cursor: pointer;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 14px;
        }
        #scratch-custom-gui button:hover {
            background-color: #e8b1b4;
        }
        #scratch-custom-gui input[type="color"],
        #scratch-custom-gui input[type="text"],
        #scratch-custom-gui select {
            border: 2px solid #d1a3a4;
            border-radius: 8px;
            padding: 5px;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 14px;
        }
        #scratch-custom-gui #gui-content {
            margin-top: 15px;
        }
        #scratch-custom-gui #modifiers-list div {
            margin: 5px 0;
            padding: 5px;
            border: 1px dashed #d1a3a4;
            border-radius: 8px;
            background-color: #fbe8e8;
        }
        #theme-styles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    `);

    // Create and open GUI
    function createAndOpenGUI() {
        const gui = document.createElement('div');
        gui.id = 'scratch-custom-gui';
        gui.innerHTML = `
            <h2>Custom Scratch GUI</h2>
            <button id="open-block-color-changer">Block Color Changer</button>
            <button id="open-block-editor">Block Editor</button>
            <button id="open-theme-changer">Theme Changer</button>
            <button id="open-modifiers">Modifiers</button>
            <button id="close-gui">Close</button>
            <div id="gui-content"></div>
        `;
        document.body.appendChild(gui);

        // Event listeners for buttons
        document.getElementById('open-block-color-changer').addEventListener('click', openBlockColorChanger);
        document.getElementById('open-block-editor').addEventListener('click', openBlockEditor);
        document.getElementById('open-theme-changer').addEventListener('click', openThemeChanger);
        document.getElementById('open-modifiers').addEventListener('click', openModifiers);
        document.getElementById('close-gui').addEventListener('click', closeGUI);

        // Open GUI initially
        gui.style.display = 'block';
    }

    // Function to open block color changer
    function openBlockColorChanger() {
        document.getElementById('gui-content').innerHTML = `
            <h3>Block Color Changer</h3>
            <label for="block-select-color">Select Block:</label>
            <select id="block-select-color">
                <!-- Populate with block options dynamically -->
            </select>
            <br/><br/>
            <label for="block-new-color">New Block Color:</label>
            <input type="color" id="block-new-color" />
            <br/><br/>
            <label for="block-inside-color">Inside Color:</label>
            <input type="color" id="block-inside-color" />
            <br/><br/>
            <button onclick="changeBlockColor()">Change Color</button>
        `;
        populateBlockOptions(); // Populate block options dynamically
    }

    // Function to open block editor
    function openBlockEditor() {
        document.getElementById('gui-content').innerHTML = `
            <h3>Block Editor</h3>
            <label for="block-name">Block Name:</label>
            <input type="text" id="block-name" />
            <br/><br/>
            <label for="block-color">Block Color:</label>
            <input type="color" id="block-color" />
            <br/><br/>
            <label for="block-inside-color">Inside Color:</label>
            <input type="color" id="block-inside-color" />
            <br/><br/>
            <label for="block-function">Function:</label>
            <input type="text" id="block-function" />
            <br/><br/>
            <button onclick="createCustomBlock()">Create Custom Block</button>
        `;
    }

    // Function to open theme changer
    function openThemeChanger() {
        document.getElementById('gui-content').innerHTML = `
            <h3>Theme Changer</h3>
            <label for="theme-select">Select Theme:</label>
            <select id="theme-select">
                <option value="cupcake">Cupcake</option>
                <option value="candy">Candy</option>
                <option value="dark">Dark</option>
                <option value="marshmallow">Marshmallow</option>
                <option value="bloody">Bloody</option>
                <option value="image">Image</option>
            </select>
            <br/><br/>
            <label for="theme-image-url" id="image-url-label" style="display: none;">Image URL:</label>
            <input type="text" id="theme-image-url" style="display: none;" />
            <br/><br/>
            <button onclick="applyTheme()">Apply Theme</button>
        `;
        document.getElementById('theme-select').addEventListener('change', function() {
            document.getElementById('image-url-label').style.display = this.value === 'image' ? 'block' : 'none';
            document.getElementById('theme-image-url').style.display = this.value === 'image' ? 'block' : 'none';
        });
    }

    // Function to open modifiers
    function openModifiers() {
        document.getElementById('gui-content').innerHTML = `
            <h3>Modifiers</h3>
            <label for="modifier-name">Modifier Name:</label>
            <input type="text" id="modifier-name" />
            <br/><br/>
            <button onclick="addModifier()">Add Modifier</button>
            <br/><br/>
            <div id="modifiers-list"></div>
        `;
    }

    // Populate block options for color changer
    function populateBlockOptions() {
        const blockSelect = document.getElementById('block-select-color');
        // This example assumes some predefined blocks
        // In practice, you might need to fetch block data from Scratch's editor API
        const blocks = [
            { id: 'block1', name: 'Block 1' },
            { id: 'block2', name: 'Block 2' },
            { id: 'block3', name: 'Block 3' }
        ];
        blocks.forEach(block => {
            const option = document.createElement('option');
            option.value = block.id;
            option.textContent = block.name;
            blockSelect.appendChild(option);
        });
    }

    // Change block color
    function changeBlockColor() {
        const blockId = document.getElementById('block-select-color').value;
        const color = document.getElementById('block-new-color').value;
        const insideColor = document.getElementById('block-inside-color').value;
        console.log(`Changing block ${blockId} color to ${color}, inside color ${insideColor}`);
        // Implement the actual API call to change the block color
    }

    // Create custom block
    function createCustomBlock() {
        const name = document.getElementById('block-name').value;
        const color = document.getElementById('block-color').value;
        const insideColor = document.getElementById('block-inside-color').value;
        const func = document.getElementById('block-function').value;
        console.log(`Creating custom block: ${name}, Color: ${color}, Inside Color: ${insideColor}, Function: ${func}`);
        // Implement the actual API call to create a custom block
    }

    // Apply theme
    function applyTheme() {
        const theme = document.getElementById('theme-select').value;
        const imageUrl = document.getElementById('theme-image-url').value;
        console.log(`Applying theme: ${theme}, Image URL: ${imageUrl}`);
        // Implement the actual API call to apply the theme
    }

    // Add modifier
    function addModifier() {
        const name = document.getElementById('modifier-name').value;
        const modifiersList = document.getElementById('modifiers-list');
        const div = document.createElement('div');
        div.textContent = name;
        modifiersList.appendChild(div);
        console.log(`Added modifier: ${name}`);
    }

    // Close the GUI
    function closeGUI() {
        document.getElementById('scratch-custom-gui').style.display = 'none';
    }

    // Initialize GUI creation
    createAndOpenGUI();
})();
