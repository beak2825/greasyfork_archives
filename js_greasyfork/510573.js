// ==UserScript==
// @name         Key Press Display
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Displays the keys being pressed on the screen with customization options, positioning, and a toggleable GUI via the 'H' key.
// @author       Arjun
// @grant        none
// @match        https://shellshock.io/
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/510573/Key%20Press%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/510573/Key%20Press%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keyDisplayDiv = document.createElement('div');
    keyDisplayDiv.style.position = 'fixed';
    keyDisplayDiv.style.top = '10px';
    keyDisplayDiv.style.right = '10px';
    keyDisplayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    keyDisplayDiv.style.color = 'white';
    keyDisplayDiv.style.padding = '10px';
    keyDisplayDiv.style.borderRadius = '8px';
    keyDisplayDiv.style.fontFamily = 'Arial, sans-serif';
    keyDisplayDiv.style.fontSize = '20px';
    keyDisplayDiv.style.zIndex = '9999';
    keyDisplayDiv.style.textAlign = 'center';
    keyDisplayDiv.style.cursor = 'move';  // Set cursor to move
    document.body.appendChild(keyDisplayDiv);

    const guiDiv = document.createElement('div');
    guiDiv.style.position = 'fixed';
    guiDiv.style.bottom = '10px';
    guiDiv.style.right = '50%';
    guiDiv.style.transform = 'translateX(50%)';
    guiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    guiDiv.style.color = 'white';
    guiDiv.style.padding = '15px';
    guiDiv.style.borderRadius = '10px';
    guiDiv.style.fontFamily = 'Arial, sans-serif';
    guiDiv.style.fontSize = '14px';
    guiDiv.style.zIndex = '10000';
    guiDiv.style.width = '240px';
    guiDiv.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
    guiDiv.style.transition = 'opacity 0.3s ease';
    guiDiv.style.textAlign = 'center';
    guiDiv.style.cursor = 'move';  // Set cursor to move
    guiDiv.innerHTML = `
        <label for="bgColor">Background:</label><br>
        <input type="color" id="bgColor" value="#000000" style="border-radius: 5px; padding: 5px; border: none;"><br><br>
        <label for="fontColor">Font Color:</label><br>
        <input type="color" id="fontColor" value="#FFFFFF" style="border-radius: 5px; padding: 5px; border: none;"><br><br>
        <label for="fontSize">Font Size: <span id="fontSizeValue">20</span>px</label><br>
        <input type="range" id="fontSize" min="10" max="50" value="20" style="width: 100%; border-radius: 5px;"><br><br>
        <label for="position">Position:</label><br>
        <select id="position" style="border-radius: 5px; padding: 5px; width: 100%; border: none; background-color: rgba(255, 255, 255, 0.1); color: white;">
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="center">Center</option>
            <option value="top-center">Top Center</option>
            <option value="bottom-center">Bottom Center</option>
        </select><br><br>
        <button id="closeGui" style="padding: 10px; width: 100%; background-color: rgba(255, 255, 255, 0.2); border: none; border-radius: 8px; color: white; cursor: pointer;">Close GUI[H]</button>
    `;
    document.body.appendChild(guiDiv);

    const pressedKeys = new Set();
    let capsLockActive = false;
    let isGuiVisible = false;

    document.addEventListener('keydown', (event) => {
        if (isTyping()) return; // Prevent logging while typing

        if (event.key === 'CapsLock') {
            capsLockActive = !capsLockActive;
            displayCapsLock();
        } else if (event.key === 'h' || event.key === 'H') {  // Toggle GUI on "H" key press
            toggleGuiVisibility();
        } else {
            pressedKeys.add(event.key);
        }
        updateDisplay();
    });

    document.addEventListener('keyup', (event) => {
        if (isTyping()) return; // Prevent logging while typing

        if (event.key !== 'CapsLock') {
            pressedKeys.delete(event.key);
        }
        updateDisplay();
    });

    // Function to check if the user is typing in an input field
    function isTyping() {
        const activeElement = document.activeElement;
        return activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
    }

    // Toggle GUI visibility function
    function toggleGuiVisibility() {
        if (isGuiVisible) {
            guiDiv.style.opacity = '0';
            setTimeout(() => guiDiv.style.display = 'none', 300);
        } else {
            guiDiv.style.display = 'block';
            setTimeout(() => guiDiv.style.opacity = '1', 10);
        }
        isGuiVisible = !isGuiVisible;
    }

    const bgColorInput = document.getElementById('bgColor');
    const fontColorInput = document.getElementById('fontColor');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const positionSelect = document.getElementById('position');
    const closeGuiButton = document.getElementById('closeGui');

    bgColorInput.addEventListener('input', () => {
        keyDisplayDiv.style.backgroundColor = bgColorInput.value;
    });

    fontColorInput.addEventListener('input', () => {
        keyDisplayDiv.style.color = fontColorInput.value;
    });

    fontSizeInput.addEventListener('input', () => {
        const fontSize = fontSizeInput.value;
        keyDisplayDiv.style.fontSize = fontSize + 'px';
        fontSizeValue.textContent = fontSize;
    });

    positionSelect.addEventListener('change', () => {
        switch (positionSelect.value) {
            case 'top-right':
                keyDisplayDiv.style.top = '10px';
                keyDisplayDiv.style.right = '10px';
                keyDisplayDiv.style.bottom = '';
                keyDisplayDiv.style.left = '';
                keyDisplayDiv.style.transform = '';
                break;
            case 'top-left':
                keyDisplayDiv.style.top = '10px';
                keyDisplayDiv.style.left = '10px';
                keyDisplayDiv.style.bottom = '';
                keyDisplayDiv.style.right = '';
                keyDisplayDiv.style.transform = '';
                break;
            case 'bottom-right':
                keyDisplayDiv.style.bottom = '10px';
                keyDisplayDiv.style.right = '10px';
                keyDisplayDiv.style.top = '';
                keyDisplayDiv.style.left = '';
                keyDisplayDiv.style.transform = '';
                break;
            case 'bottom-left':
                keyDisplayDiv.style.bottom = '10px';
                keyDisplayDiv.style.left = '10px';
                keyDisplayDiv.style.top = '';
                keyDisplayDiv.style.right = '';
                keyDisplayDiv.style.transform = '';
                break;
            case 'center':
                keyDisplayDiv.style.top = '50%';
                keyDisplayDiv.style.left = '50%';
                keyDisplayDiv.style.bottom = '';
                keyDisplayDiv.style.right = '';
                keyDisplayDiv.style.transform = 'translate(-50%, -50%)';
                break;
            case 'top-center':
                keyDisplayDiv.style.top = '10px';
                keyDisplayDiv.style.left = '50%';
                keyDisplayDiv.style.bottom = '';
                keyDisplayDiv.style.right = '';
                keyDisplayDiv.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-center':
                keyDisplayDiv.style.bottom = '10px';
                keyDisplayDiv.style.left = '50%';
                keyDisplayDiv.style.top = '';
                keyDisplayDiv.style.right = '';
                keyDisplayDiv.style.transform = 'translateX(-50%)';
                break;
        }
    });

    closeGuiButton.addEventListener('click', () => {
        guiDiv.style.opacity = '0';
        setTimeout(() => guiDiv.style.display = 'none', 300);
        isGuiVisible = false;
    });

    function updateDisplay() {
        if (pressedKeys.size > 0) {
            keyDisplayDiv.innerText = Array.from(pressedKeys).join(' + ');
        } else if (!capsLockActive) {
            keyDisplayDiv.innerText = '';
        }
    }

    function displayCapsLock() {
        if (capsLockActive) {
            keyDisplayDiv.innerText = 'Caps Lock On';
            setTimeout(() => {
                keyDisplayDiv.innerText = '';
                updateDisplay();
            }, 1000);
        } else {
            updateDisplay();
        }
    }

    // Dragging functionality
    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
                element.style.right = '';
                element.style.bottom = '';
                element.style.transform = '';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    makeDraggable(keyDisplayDiv);  // Enable dragging for key display div
    makeDraggable(guiDiv);  // Enable dragging for GUI div

    keyDisplayDiv.addEventListener('selectstart', (e) => {
        e.preventDefault();  // Prevent text selection
    });
})();

