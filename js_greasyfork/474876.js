// ==UserScript==
// @name         Mouse Click Buttons for sploop.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds left and right mouse click buttons to the top left corner of the sploop.io webpage.
// @author       hayden422
// @match        https://sploop.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474876/Mouse%20Click%20Buttons%20for%20sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/474876/Mouse%20Click%20Buttons%20for%20sploopio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container div
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.padding = '10px';
    document.body.appendChild(container);

    // Create left mouse click button
    const leftClickButton = document.createElement('button');
    leftClickButton.textContent = 'LMB';
    leftClickButton.style.padding = '10px 25px';
    leftClickButton.style.backgroundColor = '#007bff';
    leftClickButton.style.color = '#fff';
    leftClickButton.style.border = 'none';
    leftClickButton.style.cursor = 'pointer';
    container.appendChild(leftClickButton);

    // Create right mouse click button
    const rightClickButton = document.createElement('button');
    rightClickButton.textContent = 'RMB';
    rightClickButton.style.padding = '10px 25px';
    rightClickButton.style.backgroundColor = '#dc3545';
    rightClickButton.style.color = '#fff';
    rightClickButton.style.border = 'none';
    rightClickButton.style.cursor = 'pointer';
    container.appendChild(rightClickButton);

    // Function to toggle button color
    function toggleButtonColor(button) {
        const originalColor = button.dataset.originalColor || '';
        const currentColor = button.style.backgroundColor || '';

        if (originalColor && currentColor) {
            button.style.backgroundColor = currentColor === originalColor ? '#f0f0f0' : originalColor;
        } else {
            button.dataset.originalColor = currentColor;
            button.style.backgroundColor = '#f0f0f0';
        }
    }

    // Add mousedown event listeners to toggle button colors
    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Left mouse button (LMB)
            toggleButtonColor(leftClickButton);
        } else if (event.button === 2) { // Right mouse button (RMB)
            toggleButtonColor(rightClickButton);
        }
    });

    // Add mouseup event listeners to reset button colors
    document.addEventListener('mouseup', () => {
        leftClickButton.style.backgroundColor = '#007bff';
        rightClickButton.style.backgroundColor = '#dc3545';
    });
})();