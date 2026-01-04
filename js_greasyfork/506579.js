// ==UserScript==
// @name         ꃳ꒤ꃳꃳ꒒ꏂꃳꋬ꓄ꁝꇙꋬꋊ꒯ꍌꏂ꓄ꂵꌦ40
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A script executor with a draggable GUI and copy/paste functionality that only works after injection
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506579/%EA%83%B3%EA%92%A4%EA%83%B3%EA%83%B3%EA%92%92%EA%8F%82%EA%83%B3%EA%8B%AC%EA%93%84%EA%81%9D%EA%87%99%EA%8B%AC%EA%8B%8A%EA%92%AF%EA%8D%8C%EA%8F%82%EA%93%84%EA%82%B5%EA%8C%A640.user.js
// @updateURL https://update.greasyfork.org/scripts/506579/%EA%83%B3%EA%92%A4%EA%83%B3%EA%83%B3%EA%92%92%EA%8F%82%EA%83%B3%EA%8B%AC%EA%93%84%EA%81%9D%EA%87%99%EA%8B%AC%EA%8B%8A%EA%92%AF%EA%8D%8C%EA%8F%82%EA%93%84%EA%82%B5%EA%8C%A640.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI container
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '100px';
    guiContainer.style.left = '100px';
    guiContainer.style.width = '420px';  // Width adjusted for proper alignment
    guiContainer.style.backgroundColor = '#c7c7c7';
    guiContainer.style.borderRadius = '15px';
    guiContainer.style.padding = '20px';
    guiContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.cursor = 'move';
    document.body.appendChild(guiContainer);

    // Create the text area for code input
    const codeBox = document.createElement('textarea');
    codeBox.style.width = '95%';
    codeBox.style.height = '150px';
    codeBox.style.borderRadius = '10px';
    codeBox.style.border = 'none';
    codeBox.style.padding = '10px';
    codeBox.style.fontSize = '14px';
    codeBox.style.resize = 'none';
    codeBox.style.backgroundColor = '#f0f0f0';
    codeBox.style.outline = 'none';
    codeBox.style.overflowY = 'auto';  // Enable vertical scrolling
    codeBox.style.whiteSpace = 'pre-wrap';  // Preserve line breaks and wrap long lines
    guiContainer.appendChild(codeBox);

    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap'; // Allow buttons to wrap on small screens
    buttonContainer.style.marginTop = '15px';
    guiContainer.appendChild(buttonContainer);

    // Create a common button style
    const buttonStyle = {
        border: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold', // Make text bold
        cursor: 'pointer',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        flex: '1',
        margin: '0 5px'
    };

    // Create the Inject button
    const injectBtn = document.createElement('button');
    injectBtn.innerText = 'Inject';
    Object.assign(injectBtn.style, buttonStyle);
    buttonContainer.appendChild(injectBtn);

    // Create the Execute button
    const executeBtn = document.createElement('button');
    executeBtn.innerText = 'Execute';
    Object.assign(executeBtn.style, buttonStyle);
    executeBtn.disabled = true;
    buttonContainer.appendChild(executeBtn);

    // Create the Clear button
    const clearBtn = document.createElement('button');
    clearBtn.innerText = 'Clear';
    Object.assign(clearBtn.style, buttonStyle);
    clearBtn.disabled = true;
    buttonContainer.appendChild(clearBtn);

    // Create the Copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerText = 'Copy';
    Object.assign(copyBtn.style, buttonStyle);
    copyBtn.disabled = true; // Initially disabled
    buttonContainer.appendChild(copyBtn);

    // Create the Paste button
    const pasteBtn = document.createElement('button');
    pasteBtn.innerText = 'Paste';
    Object.assign(pasteBtn.style, buttonStyle);
    pasteBtn.disabled = true; // Initially disabled
    buttonContainer.appendChild(pasteBtn);

    let isInjected = false;

    // Inject Button Logic
    injectBtn.addEventListener('click', () => {
        isInjected = true;
        executeBtn.disabled = false;
        clearBtn.disabled = false;
        copyBtn.disabled = false; // Enable Copy button
        pasteBtn.disabled = false; // Enable Paste button
        alert('Injected successfully!');
    });

    // Execute Button Logic
    executeBtn.addEventListener('click', () => {
        if (isInjected) {
            try {
                eval(codeBox.value);
                alert('Script executed successfully!');
            } catch (error) {
                alert('Error executing script: ' + error.message);
            }
        } else {
            alert('Please inject first!');
        }
    });

    // Clear Button Logic
    clearBtn.addEventListener('click', () => {
        if (isInjected) {
            codeBox.value = '';
        } else {
            alert('Please inject first!');
        }
    });

    // Copy Button Logic
    copyBtn.addEventListener('click', () => {
        if (isInjected) {
            codeBox.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } else {
            alert('Please inject first!');
        }
    });

    // Paste Button Logic
    pasteBtn.addEventListener('click', async () => {
        if (isInjected) {
            try {
                const clipboardText = await navigator.clipboard.readText();
                codeBox.value = clipboardText;
                alert('Pasted from clipboard!');
            } catch (error) {
                alert('Failed to paste from clipboard: ' + error.message);
            }
        } else {
            alert('Please inject first!');
        }
    });

    // Dragging functionality for the GUI
    let isDragging = false;
    let offsetX, offsetY;

    guiContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - parseInt(window.getComputedStyle(guiContainer).left);
        offsetY = e.clientY - parseInt(window.getComputedStyle(guiContainer).top);
        guiContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            guiContainer.style.left = e.clientX - offsetX + 'px';
            guiContainer.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        guiContainer.style.cursor = 'move';
    });

    // Make the GUI draggable on touch devices as well
    guiContainer.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - parseInt(window.getComputedStyle(guiContainer).left);
        offsetY = touch.clientY - parseInt(window.getComputedStyle(guiContainer).top);
        guiContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            const touch = e.touches[0];
            guiContainer.style.left = touch.clientX - offsetX + 'px';
            guiContainer.style.top = touch.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('touchend', function() {
        isDragging = false;
        guiContainer.style.cursor = 'move';
    });

})();
