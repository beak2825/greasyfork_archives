// ==UserScript==
// @name         Scratch Custom GUI and Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add custom GUI and functionality enhancements to Scratch with Scratch API integration
// @match        https://scratch.mit.edu/*
// @match        https://scratch.mit.edu/projects/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505476/Scratch%20Custom%20GUI%20and%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/505476/Scratch%20Custom%20GUI%20and%20Enhancements.meta.js
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

    // Function to create a page
    function createPage(id, title, content) {
        const page = document.createElement('div');
        page.id = id;
        page.style.display = 'none';
        page.style.position = 'fixed';
        page.style.top = '10px';
        page.style.left = '10px';
        page.style.backgroundColor = '#ffffff';
        page.style.border = '1px solid #ddd';
        page.style.padding = '10px';
        page.style.zIndex = 1000;
        page.style.borderRadius = '5px';
        page.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        page.style.fontFamily = 'Arial, sans-serif';
        page.innerHTML = `<h2>${title}</h2>${content}<button onclick="closePage('${id}')">X</button>`;
        document.body.appendChild(page);
    }

    // Function to create the main GUI
    function createMainGUI() {
        const mainGUI = document.createElement('div');
        mainGUI.id = 'main-gui';
        mainGUI.style.position = 'fixed';
        mainGUI.style.top = '10px';
        mainGUI.style.right = '10px';
        mainGUI.style.backgroundColor = '#ffffff';
        mainGUI.style.border = '1px solid #ddd';
        mainGUI.style.padding = '10px';
        mainGUI.style.zIndex = 1000;
        mainGUI.style.borderRadius = '5px';
        mainGUI.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        mainGUI.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(mainGUI);

        const pages = ['block-editor', 'block-color-changer', 'custom-block-maker', 'theme-changer', 'modifiers'];

        pages.forEach(pageId => {
            const button = document.createElement('button');
            button.innerText = pageId.replace(/-/g, ' ').toUpperCase();
            button.style.margin = '5px';
            button.style.padding = '5px 10px';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.onclick = function() {
                pages.forEach(id => {
                    document.getElementById(id).style.display = (id === pageId) ? 'block' : 'none';
                });
            };
            mainGUI.appendChild(button);
        });

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close GUI';
        closeButton.style.margin = '5px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = '#fff';
        closeButton.onclick = function() {
            mainGUI.style.display = (mainGUI.style.display === 'none') ? 'block' : 'none';
        };
        mainGUI.appendChild(closeButton);
    }

    // Function to create the Block Editor page
    function createBlockEditorPage() {
        createPage('block-editor', 'Block Editor', `
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
        `);

        window.createCustomBlock = function() {
            const blockName = document.getElementById('block-name').value;
            const blockColor = document.getElementById('block-color').value;
            const blockInsideColor = document.getElementById('block-inside-color').value;
            console.log('Creating custom block:', blockName, blockColor, blockInsideColor);
            // Implement logic to create a custom block using Scratch API
            // For demonstration purposes, this is a placeholder
        };
    }

    // Function to create the Block Color Changer page
    function createBlockColorChangerPage() {
        createPage('block-color-changer', 'Block Color Changer', `
            <label for="block-select-color">Select Block:</label>
            <select id="block-select-color">
                <!-- Populate with block options dynamically -->
            </select>
            <br/><br/>
            <label for="block-new-color">New Block Color:</label>
            <input type="color" id="block-new-color" />
            <br/><br/>
            <button onclick="changeBlockColor()">Change Color</button>
        `);

        window.changeBlockColor = function() {
            const blockId = document.getElementById('block-select-color').value;
            const newColor = document.getElementById('block-new-color').value;
            console.log('Changing block color to:', newColor);
            // Implement logic to change the color of the selected block
            // Use Scratch API to update the block color
        };
    }

    // Function to create the Custom Block Maker page
    function createCustomBlockMakerPage() {
        createPage('custom-block-maker', 'Custom Block Maker', `
            <label for="block-name-new">Block Name:</label>
            <input type="text" id="block-name-new" />
            <br/><br/>
            <label for="block-color-new">Block Color:</label>
            <input type="color" id="block-color-new" />
            <br/><br/>
            <label for="block-inside-color-new">Inside Color:</label>
            <input type="color" id="block-inside-color-new" />
            <br/><br/>
            <button onclick="createNewCustomBlock()">Create Block</button>
        `);

        window.createNewCustomBlock = function() {
            const blockName = document.getElementById('block-name-new').value;
            const blockColor = document.getElementById('block-color-new').value;
            const blockInsideColor = document.getElementById('block-inside-color-new').value;
            console.log('Creating new custom block:', blockName, blockColor, blockInsideColor);
            // Implement logic to create a new custom block with the specified properties
            // Integrate with Scratch API to add this block to Scratch
        };
    }

    // Function to create the Theme Changer page
    function createThemeChangerPage() {
        createPage('theme-changer', 'Theme Changer', `
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
        `);

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
    }

    // Function to create the Modifiers page
    function createModifiersPage() {
        createPage('modifiers', 'Modifiers', `
            <label for="modifier-name">Modifier Name:</label>
            <input type="text" id="modifier-name" />
            <br/><br/>
            <button onclick="addModifier()">Add Modifier</button>
            <br/><br/>
            <div id="modifiers-list"></div>
        `);

        window.addModifier = function() {
            const modifierName = document.getElementById('modifier-name').value;
            console.log('Adding modifier:', modifierName);
            // Implement logic to add a modifier to Scratch blocks
            const modifiersList = document.getElementById('modifiers-list');
            const modifierItem = document.createElement('div');
            modifierItem.textContent = modifierName;
            modifiersList.appendChild(modifierItem);
        };
    }

    // Initialize GUI and pages
    createMainGUI();
    createBlockEditorPage();
    createBlockColorChangerPage();
    createCustomBlockMakerPage();
    createThemeChangerPage();
    createModifiersPage();
})();
