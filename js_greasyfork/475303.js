// ==UserScript==
// @name         iPort Paste Chrome OS
// @namespace    http://yournamespace.example.com
// @version      1.0
// @description  Adds a modern, draggable GUI for copying and pasting text on Chrome OS.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475303/iPort%20Paste%20Chrome%20OS.user.js
// @updateURL https://update.greasyfork.org/scripts/475303/iPort%20Paste%20Chrome%20OS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container div for the GUI
    const guiContainer = document.createElement('div');
    guiContainer.innerHTML = `
        <div id="greasyforkDragHandle" style="background-color: #3498db; height: 30px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 15px; border-top-right-radius: 15px;">
            <h1 style="margin: 0; padding: 10px; background-color: transparent; color: white; font-size: 18px;">iPort Paste Chrome OS</h1>
            <button id="greasyforkCloseButton" style="background: none; border: none; color: white; font-size: 20px; padding: 0 10px; cursor: pointer;">&times;</button>
        </div>
        <div id="greasyforkContent" style="padding: 20px;">
            <div style="display: flex; flex-direction: column;">
                <textarea id="greasyforkInput" rows="4" cols="30" placeholder="Paste your text here..." style="resize: none; padding: 10px; background-color: #f2f2f2; border: none; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;"></textarea>
                <button id="greasyforkCopyButton" style="padding: 10px; background-color: #007BFF; color: white; border: none; cursor: pointer; margin-top: 10px; transition: background-color 0.3s; border-radius: 15px;">Copy Text</button>
                <button id="greasyforkDeleteButton" style="padding: 10px; background-color: #e74c3c; color: white; border: none; cursor: pointer; margin-top: 10px; transition: background-color 0.3s; border-radius: 15px;">Delete Text</button>
                <button id="greasyforkPasteButton" style="padding: 10px; background-color: #27ae60; color: white; border: none; cursor: pointer; margin-top: 10px; transition: background-color 0.3s; border-radius: 15px;">Paste</button>
            </div>
        </div>
        <div id="settingsBar" style="background-color: #3498db; color: white; text-align: center; cursor: pointer; padding: 5px; border-radius: 0 0 15px 15px;">Settings</div>
        <div id="settingsPane" style="display: none; background-color: #f2f2f2; padding: 10px; border-radius: 0 0 15px 15px;">
            <h3>GUI Color</h3>
            <input type="color" id="guiColorPicker" value="#3498db">
            <h3>Coding Mode</h3>
            <label for="codingModeToggle">Enable Coding Mode:</label>
            <input type="checkbox" id="codingModeToggle">
            <h3>Bold Text</h3>
            <label for="boldTextToggle">Enable Bold Text:</label>
            <input type="checkbox" id="boldTextToggle">
            <h3>Text Size</h3>
            <input type="range" id="textSizeInput" min="8" max="48" value="16">
            <span id="textSizeLabel">16px</span>
            <h3>Text Color</h3>
            <input type="color" id="textColorPicker" value="#000000">
            <h3>Font Family</h3>
            <select id="fontSelector">
                <option value="Arial, sans-serif">Arial</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
            </select>
        </div>
    `;

    // Add styles for the container
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '100px';
    guiContainer.style.right = '10px';
    guiContainer.style.backgroundColor = '#f2f2f2'; // Change the background color of the GUI
    guiContainer.style.borderRadius = '15px'; // Rounded corners for the GUI container
    guiContainer.style.border = '2px solid #3498db'; // Add an outline to the GUI container
    guiContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.3)';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.width = '300px';
    guiContainer.style.userSelect = 'none';

    // Add styles for the drag handle
    const dragHandle = guiContainer.querySelector('#greasyforkDragHandle');
    dragHandle.style.cursor = 'move';

    // Make the GUI movable
    let isDragging = false;
    let offsetX, offsetY;
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - guiContainer.getBoundingClientRect().left;
        offsetY = e.clientY - guiContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            guiContainer.style.top = (e.clientY - offsetY) + 'px';
            guiContainer.style.left = (e.clientX - offsetX) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Toggle settings pane
    const settingsBar = guiContainer.querySelector('#settingsBar');
    const settingsPane = guiContainer.querySelector('#settingsPane');
    settingsBar.addEventListener('click', function() {
        settingsPane.style.display = settingsPane.style.display === 'block' ? 'none' : 'block';
    });

    // Handle GUI color change
    const guiColorPicker = guiContainer.querySelector('#guiColorPicker');
    guiColorPicker.addEventListener('input', function() {
        const newColor = guiColorPicker.value;
        guiContainer.style.backgroundColor = newColor;
        dragHandle.style.backgroundColor = newColor;
        settingsBar.style.backgroundColor = newColor;
    });

    // Handle Coding Mode toggle
    const codingModeToggle = guiContainer.querySelector('#codingModeToggle');
    const inputText = guiContainer.querySelector('#greasyforkInput');

    codingModeToggle.addEventListener('change', function() {
        if (codingModeToggle.checked) {
            inputText.style.color = 'green'; // Set text color to green when Coding Mode is enabled
            inputText.setAttribute('spellcheck', 'false'); // Disable spellcheck
        } else {
            inputText.style.color = 'black'; // Set text color back to black when Coding Mode is disabled
            inputText.removeAttribute('spellcheck'); // Enable spellcheck
        }
    });

    // Handle Bold Text toggle
    const boldTextToggle = guiContainer.querySelector('#boldTextToggle');
    boldTextToggle.addEventListener('change', function() {
        if (boldTextToggle.checked) {
            inputText.style.fontWeight = 'bold'; // Set text to bold when Bold Text is enabled
        } else {
            inputText.style.fontWeight = 'normal'; // Set text to normal weight when Bold Text is disabled
        }
    });

    // Update the text size, text color, and font family
    const textSizeInput = guiContainer.querySelector('#textSizeInput');
    const textColorPicker = guiContainer.querySelector('#textColorPicker');
    const textSizeLabel = guiContainer.querySelector('#textSizeLabel');
    const fontSelector = guiContainer.querySelector('#fontSelector');

    textSizeInput.addEventListener('input', function() {
        const newSize = textSizeInput.value + 'px';
        inputText.style.fontSize = newSize;
        textSizeLabel.textContent = newSize;
    });

    textColorPicker.addEventListener('input', function() {
        const newColor = textColorPicker.value;
        inputText.style.color = newColor;
    });

    fontSelector.addEventListener('change', function() {
        const selectedFont = fontSelector.value;
        inputText.style.fontFamily = selectedFont;
    });

    // Add click event listener to the "Copy Text" button
    const copyButton = guiContainer.querySelector('#greasyforkCopyButton');
    copyButton.addEventListener('click', function() {
        inputText.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });

    // Add click event listener to the "Paste" button
    const pasteButton = guiContainer.querySelector('#greasyforkPasteButton');
    pasteButton.addEventListener('click', async function() {
        const clipboardText = await navigator.clipboard.readText();
        inputText.value = clipboardText;
        inputText.style.color = 'black'; // Set the text color to black
        inputText.style.fontWeight = 'normal'; // Set the font weight to normal
        inputText.select(); // Select the pasted text to make it visible
        inputText.focus(); // Ensure the textarea is focused after pasting
    });

    // Add click event listener to the "Delete Text" button
    const deleteButton = guiContainer.querySelector('#greasyforkDeleteButton');
    deleteButton.addEventListener('click', function() {
        inputText.value = ''; // Clear the textarea
    });

    // Append the GUI container to the document body
    document.body.appendChild(guiContainer);
})();
