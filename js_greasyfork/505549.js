// ==UserScript==
// @name         Scratch Custom GUI with Block Color Changer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Custom GUI for Scratch with block color changing functionality
// @match        https://scratch.mit.edu/projects/*
// @match        https://scratch.mit.edu/editor/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505549/Scratch%20Custom%20GUI%20with%20Block%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/505549/Scratch%20Custom%20GUI%20with%20Block%20Color%20Changer.meta.js
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

    // Add global hand-drawn styles
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
            populateBlockOptions(); // Populate block options dynamically
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

        // Populate block options for color changer
        function populateBlockOptions() {
            const blockSelect = document.getElementById('block-select-color');
            // This example assumes some predefined blocks
            // In practice, you would dynamically generate this list based on the Scratch project
            blockSelect.innerHTML = `
                <option value="block1">Block 1</option>
                <option value="block2">Block 2</option>
            `;
        }

        // Function to change block color
        window.changeBlockColor = function() {
            const blockId = document.getElementById('block-select-color').value;
            const newColor = document.getElementById('block-new-color').value;
            console.log('Changing block color to:', newColor);

            // Make API request to update block color
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.scratch.mit.edu/projects/${blockId}/blocks/${blockId}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    color: newColor
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        alert('Block color changed successfully!');
                    } else {
                        alert('Failed to change block color.');
                    }
                }
            });
        };

        // Function to create a custom block
        window.createCustomBlock = function() {
            const name = document.getElementById('block-name').value;
            const color = document.getElementById('block-color').value;
            const insideColor = document.getElementById('block-inside-color').value;

            console.log('Creating custom block:', { name, color, insideColor });

            // API request to create custom block (example logic)
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.scratch.mit.edu/projects/custom-blocks",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    name: name,
                    color: color,
                    insideColor: insideColor
                }),
                onload: function(response) {
                    if (response.status === 201) {
                        alert('Custom block created successfully!');
                    } else {
                        alert('Failed to create custom block.');
                    }
                }
            });
        };

        // Function to apply theme
        window.applyTheme = function() {
            const theme = document.getElementById('theme-select').value;
            const imageUrl = document.getElementById('theme-image-url').value;

            console.log('Applying theme:', theme, imageUrl);

            // Apply theme styles
            if (theme === 'image') {
                document.body.style.backgroundImage = `url(${imageUrl})`;
            } else {
                document.body.className = `theme-${theme}`;
            }

            alert('Theme applied successfully!');
        };

        // Function to add a modifier
        window.addModifier = function() {
            const modifierName = document.getElementById('modifier-name').value;

            const modifierList = document.getElementById('modifiers-list');
            const modifierDiv = document.createElement('div');
            modifierDiv.textContent = modifierName;
            modifierList.appendChild(modifierDiv);

            console.log('Modifier added:', modifierName);
        };
    }

    // Initialize GUI
    createAndOpenGUI();
})();
