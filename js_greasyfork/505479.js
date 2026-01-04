// ==UserScript==
// @name         Scratch Block Color Changer with GUI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change Scratch block colors and modify blocks in Scratch projects using a custom GUI
// @match        https://scratch.mit.edu/projects/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505479/Scratch%20Block%20Color%20Changer%20with%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/505479/Scratch%20Block%20Color%20Changer%20with%20GUI.meta.js
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

    // Create and open GUI
    function createAndOpenGUI() {
        const gui = document.createElement('div');
        gui.id = 'scratch-custom-gui';
        gui.style.position = 'fixed';
        gui.style.top = '10px';
        gui.style.right = '10px';
        gui.style.backgroundColor = '#ffffff';
        gui.style.border = '1px solid #ddd';
        gui.style.padding = '10px';
        gui.style.zIndex = 1000;
        gui.style.borderRadius = '5px';
        gui.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        gui.style.fontFamily = 'Arial, sans-serif';
        gui.style.display = 'none';

        // Main GUI content
        gui.innerHTML = `
            <h2>Custom Scratch GUI</h2>
            <button onclick="openBlockColorChanger()">Block Color Changer</button>
            <button onclick="openBlockEditor()">Block Editor</button>
            <button onclick="openThemeChanger()">Theme Changer</button>
            <button onclick="openModifiers()">Modifiers</button>
            <button onclick="closeGUI()">Close</button>
            <div id="gui-content"></div>
        `;
        document.body.appendChild(gui);

        // Function to open the GUI
        window.openGUI = function() {
            gui.style.display = 'block';
        };

        // Function to close the GUI
        window.closeGUI = function() {
            gui.style.display = 'none';
        };

        // Function to open block color changer
        window.openBlockColorChanger = function() {
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
                <button onclick="changeBlockColor()">Change Color</button>
            `;
        };

        // Function to open block editor
        window.openBlockEditor = function() {
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
                <button onclick="createCustomBlock()">Create Custom Block</button>
            `;
        };

        // Function to open theme changer
        window.openThemeChanger = function() {
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
        };

        // Function to open modifiers
        window.openModifiers = function() {
            document.getElementById('gui-content').innerHTML = `
                <h3>Modifiers</h3>
                <label for="modifier-name">Modifier Name:</label>
                <input type="text" id="modifier-name" />
                <br/><br/>
                <button onclick="addModifier()">Add Modifier</button>
                <br/><br/>
                <div id="modifiers-list"></div>
            `;
        };

        // Function to change block color
        window.changeBlockColor = function() {
            const blockId = document.getElementById('block-select-color').value;
            const newColor = document.getElementById('block-new-color').value;
            console.log('Changing block color to:', newColor);
            // Implement logic to change the color of the selected block using Scratch API
            // For demonstration purposes, this is a placeholder
        };

        // Function to create a custom block
        window.createCustomBlock = function() {
            const blockName = document.getElementById('block-name').value;
            const blockColor = document.getElementById('block-color').value;
            const blockInsideColor = document.getElementById('block-inside-color').value;
            console.log('Creating custom block:', blockName, blockColor, blockInsideColor);
            // Implement logic to create a custom block using Scratch API
            // For demonstration purposes, this is a placeholder
        };

        // Function to apply theme
        window.applyTheme = function() {
            const theme = document.getElementById('theme-select').value;
            const imageUrl = document.getElementById('theme-image-url').value;

            const themes = {
                'cupcake': `
                    body { background-color: #fbe8e8; color: #6a1b29; }
                    .stage { background: #fcdada; }
                    .backdrop { background: #f6a7b1; }
                `,
                'candy': `
                    body { background-color: #f5a623; color: #fff; }
                    .stage { background: #f79c42; }
                    .backdrop { background: #f4b043; }
                `,
                'dark': `
                    body { background-color: #333; color: #f5f5f5; }
                    .stage { background: #555; }
                    .backdrop { background: #444; }
                `,
                'marshmallow': `
                    body { background-color: #fff; color: #000; }
                    .stage { background: #f5f5f5; }
                    .backdrop { background: #e0e0e0; }
                `,
                'bloody': `
                    body { background-color: #3e0d0d; color: #f5f5f5; }
                    .stage { background: #6a0b0b; }
                    .backdrop { background: #9e0f0f; }
                `,
                'image': `
                    body { background-image: url('${imageUrl}'); color: #ffffff; }
                    .stage { background: rgba(0, 0, 0, 0.5); }
                    .backdrop { background: rgba(0, 0, 0, 0.5); }
                `
            };

            if (theme === 'image') {
                document.getElementById('image-url-label').style.display = 'block';
                document.getElementById('theme-image-url').style.display = 'block';
            } else {
                document.getElementById('image-url-label').style.display = 'none';
                document.getElementById('theme-image-url').style.display = 'none';
                applyThemeStyles(themes[theme]);
            }
        };

        function applyThemeStyles(css) {
            let existingStyle = document.getElementById('theme-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            const style = document.createElement('style');
            style.id = 'theme-style';
            style.innerHTML = css;
            document.head.appendChild(style);
        }

        // Function to add a modifier
        window.addModifier = function() {
            const modifierName = document.getElementById('modifier-name').value;
            console.log('Adding modifier:', modifierName);
            const modifiersList = document.getElementById('modifiers-list');
            const modifierItem = document.createElement('div');
            modifierItem.textContent = modifierName;
            modifiersList.appendChild(modifierItem);
        };
    }

    // Add global styles for the GUI
    addGlobalStyle(`
        #scratch-custom-gui button {
            margin: 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
        }
        #scratch-custom-gui button:hover {
            background-color: #0056b3;
        }
        #scratch-custom-gui input[type="color"] {
            margin: 5px 0;
        }
    `);

    // Create and open the GUI
    createAndOpenGUI();
})();
