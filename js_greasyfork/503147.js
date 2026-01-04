// ==UserScript==
// @name         Ventionware Deadshot.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a custom crosshair to deadshot.io with UI to enable/disable and change colors, plus smooth rainbow text. THIS IS OUTDATED. THE LATEST IS https://greasyfork.org/en/scripts/524040-deadshot-io-ventionware-v2
// @author       TheApkDownloader
// @icon         https://deadshot.io/favicon.png
// @match        https://deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503147/Ventionware%20Deadshotio.user.js
// @updateURL https://update.greasyfork.org/scripts/503147/Ventionware%20Deadshotio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables to store crosshair and its colors
    let crosshairEnabled = true;
    let leftClickColor = 'green';
    let rightClickColor = 'orange';

    // Create a crosshair element
    const crosshair = document.createElement('div');
    crosshair.id = 'custom-crosshair';
    crosshair.style.position = 'fixed';
    crosshair.style.width = '20px'; 
    crosshair.style.height = '20px'; 
    crosshair.style.backgroundColor = 'transparent';
    crosshair.style.border = '2px solid red'; 
    crosshair.style.left = '50%';
    crosshair.style.top = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.zIndex = '9999'; 
    document.body.appendChild(crosshair);

    // UI Container
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.bottom = '20px';
    uiContainer.style.right = '20px';
    uiContainer.style.padding = '10px';
    uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    uiContainer.style.color = 'white';
    uiContainer.style.borderRadius = '5px';
    uiContainer.style.zIndex = '10000';
    uiContainer.style.display = 'none'; // Hidden by default
    document.body.appendChild(uiContainer);

    // UI Title
    const uiTitle = document.createElement('div');
    uiTitle.textContent = 'Ventionware Crosshair';
    uiTitle.style.fontSize = '16px';
    uiTitle.style.fontWeight = 'bold';
    uiTitle.style.marginBottom = '10px';
    uiContainer.appendChild(uiTitle);

    // UI Elements
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Crosshair';
    toggleButton.style.marginBottom = '10px';
    toggleButton.style.display = 'block';
    uiContainer.appendChild(toggleButton);

    const leftColorInput = document.createElement('input');
    leftColorInput.type = 'color';
    leftColorInput.value = '#00FF00'; // Default green
    leftColorInput.style.marginBottom = '10px';
    uiContainer.appendChild(document.createTextNode('LMB Color: '));
    uiContainer.appendChild(leftColorInput);

    const rightColorInput = document.createElement('input');
    rightColorInput.type = 'color';
    rightColorInput.value = '#FFA500'; // Default orange
    rightColorInput.style.marginBottom = '10px';
    uiContainer.appendChild(document.createTextNode('RMB Color: '));
    uiContainer.appendChild(rightColorInput);

    const toggleUI = document.createElement('button');
    toggleUI.textContent = 'Settings';
    toggleUI.style.position = 'fixed';
    toggleUI.style.bottom = '20px';
    toggleUI.style.right = '20px';
    toggleUI.style.padding = '10px';
    toggleUI.style.zIndex = '10001';
    toggleUI.style.borderRadius = '5px';
    toggleUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toggleUI.style.color = 'white';
    document.body.appendChild(toggleUI);

    // Toggle Crosshair on/off
    toggleButton.addEventListener('click', () => {
        crosshairEnabled = !crosshairEnabled;
        crosshair.style.display = crosshairEnabled ? 'block' : 'none';
    });

    // Update colors on input change
    leftColorInput.addEventListener('input', (e) => {
        leftClickColor = e.target.value;
    });

    rightColorInput.addEventListener('input', (e) => {
        rightClickColor = e.target.value;
    });

    // Toggle UI visibility
    toggleUI.addEventListener('click', () => {
        uiContainer.style.display = uiContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Event listeners for mouse clicks
    document.addEventListener('mousedown', function(e) {
        if (!crosshairEnabled) return;
        if (e.button === 0) { 
            crosshair.style.borderColor = leftClickColor;
        }
        if (e.button === 2) { 
            if (!e.buttons || e.buttons === 2) { 
                crosshair.style.borderColor = rightClickColor;
            }
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (!crosshairEnabled) return;
        if (e.button === 0 || e.button === 2) { 
            if (e.buttons & 1) { 
                crosshair.style.borderColor = leftClickColor;
            } else {
                crosshair.style.borderColor = 'red'; 
            }
        }
    });

    // Prevent context menu from appearing on right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Rainbow Glowing Text with Smooth Transition
    const rainbowText = document.createElement('div');
    rainbowText.textContent = 'Ventionware Deadshot.io';
    rainbowText.style.position = 'fixed';
    rainbowText.style.top = '10px';
    rainbowText.style.left = '10px';
    rainbowText.style.fontSize = '24px';
    rainbowText.style.fontWeight = 'bold';
    rainbowText.style.backgroundClip = 'text';
    rainbowText.style.color = 'white';
    rainbowText.style.zIndex = '10001';
    rainbowText.style.animation = 'rainbow 5s infinite linear';
    document.body.appendChild(rainbowText);

    // Add smooth color transition
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes rainbow {
            0% { color: red; }
            16% { color: orange; }
            33% { color: yellow; }
            50% { color: green; }
            66% { color: blue; }
            83% { color: indigo; }
            100% { color: violet; }
        }
    `;
    document.head.appendChild(style);

})();
