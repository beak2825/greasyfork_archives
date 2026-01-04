// ==UserScript==
// @name         Custom Scratch Blocks & Themes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize Scratch blocks and apply themes with a modern UI
// @author       YourName
// @match        https://scratch.mit.edu/projects/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505448/Custom%20Scratch%20Blocks%20%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/505448/Custom%20Scratch%20Blocks%20%20Themes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI elements
    const guiOverlay = document.createElement('div');
    const openButton = document.createElement('button');
    const themeChooser = document.createElement('select');

    // Set up the GUI overlay (initially hidden)
    guiOverlay.style.position = 'fixed';
    guiOverlay.style.top = '50px';
    guiOverlay.style.right = '50px';
    guiOverlay.style.padding = '20px';
    guiOverlay.style.backgroundColor = '#f8f8f8';
    guiOverlay.style.border = '2px solid #333';
    guiOverlay.style.borderRadius = '10px';
    guiOverlay.style.zIndex = '9999';
    guiOverlay.style.display = 'none';
    guiOverlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    guiOverlay.style.cursor = 'move';
    guiOverlay.innerHTML = `
        <div style="text-align: right;"><button id="closeGui" style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">X</button></div>
        <h3 style="font-family: Arial, sans-serif; margin-top: 0;">Custom Scratch Blocks</h3>
        <label for="blockColor" style="font-family: Arial, sans-serif;">Choose Block Color:</label>
        <input type="color" id="blockColor" name="blockColor" value="#ff0000" style="margin-bottom: 10px;">
        <br>
        <button id="applyChanges" style="font-family: Arial, sans-serif; padding: 5px 10px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Apply Changes</button>
        <br><br>
        <label for="themeChooser" style="font-family: Arial, sans-serif;">Choose Theme:</label>
        <select id="themeChooser" style="font-family: Arial, sans-serif; padding: 5px; margin-top: 5px;">
            <option value="default">Default</option>
            <option value="cupcake">Cupcake Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="moon">Moon Theme</option>
            <option value="sun">Sun Theme</option>
        </select>
    `;

    // Set up the open button
    openButton.textContent = 'Open Customizer';
    openButton.style.position = 'fixed';
    openButton.style.bottom = '20px';
    openButton.style.right = '20px';
    openButton.style.padding = '10px 20px';
    openButton.style.backgroundColor = '#3498db';
    openButton.style.color = 'white';
    openButton.style.border = 'none';
    openButton.style.borderRadius = '10px';
    openButton.style.cursor = 'pointer';
    openButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    openButton.style.fontFamily = 'Arial, sans-serif';

    document.body.appendChild(guiOverlay);
    document.body.appendChild(openButton);

    // Make the GUI draggable
    let isDragging = false;
    let offsetX, offsetY;

    guiOverlay.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - guiOverlay.getBoundingClientRect().left;
        offsetY = e.clientY - guiOverlay.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            guiOverlay.style.left = (e.clientX - offsetX) + 'px';
            guiOverlay.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Toggle GUI visibility
    document.getElementById('closeGui').addEventListener('click', function() {
        guiOverlay.style.display = 'none';
        openButton.style.display = 'block';
    });

    openButton.addEventListener('click', function() {
        guiOverlay.style.display = 'block';
        openButton.style.display = 'none';
    });

    // Function to change block colors
    function changeBlockColors(color) {
        const blocks = document.querySelectorAll('.blocklyBlockBackground');
        blocks.forEach(block => {
            block.setAttribute('fill', color);
        });
    }

    // Apply changes when button is clicked
    document.getElementById('applyChanges').addEventListener('click', function() {
        const selectedColor = document.getElementById('blockColor').value;
        changeBlockColors(selectedColor);
    });

    // Theme chooser functionality
    document.getElementById('themeChooser').addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
    });

    // Function to apply themes
    function applyTheme(theme) {
        switch (theme) {
            case 'cupcake':
                document.body.style.backgroundColor = '#fbd7e1';
                break;
            case 'dark':
                document.body.style.backgroundColor = '#2c3e50';
                document.body.style.color = '#ecf0f1';
                break;
            case 'moon':
                document.body.style.backgroundColor = '#3a3d5a';
                document.body.style.color = '#f0e5d8';
                break;
            case 'sun':
                document.body.style.backgroundColor = '#f1c40f';
                document.body.style.color = '#2c3e50';
                break;
            default:
                document.body.style.backgroundColor = '';
                document.body.style.color = '';
                break;
        }
    }

})();
