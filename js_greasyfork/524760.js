// ==UserScript==
// @name         Tetr.io Revive run Script
// @namespace    http://tampermonkey.net/
// @version      2025-1-24 V2
// @description  Press space every second on Tetr.io with a toggle button
// @author       You
// @match        https://tetr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tetr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524760/Tetrio%20Revive%20run%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/524760/Tetrio%20Revive%20run%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Variable to control whether the spacebar pressing is active
    let isActive = false;

    // Function to simulate a key press
    function pressSpace() {
        if (isActive) {
            // Get the game canvas or fallback to document
            const gameCanvas = document.querySelector('canvas') || document.body;

            const eventDown = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: ' ',
                code: 'Space',
                keyCode: 32,
                which: 32,
                target: gameCanvas,
            });
            const eventUp = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: ' ',
                code: 'Space',
                keyCode: 32,
                which: 32,
                target: gameCanvas,
            });

            // Dispatch the keydown event
            gameCanvas.dispatchEvent(eventDown);

            // Delay the keyup event to simulate a realistic keypress
            setTimeout(() => {
                gameCanvas.dispatchEvent(eventUp);
            }, 100); // 100ms delay
        }
    }

    // Create a button and append it to the bottom-left corner
    const button = document.createElement('button');
    button.textContent = 'OFF';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';
    button.style.padding = '10px';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.fontSize = '16px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    document.body.appendChild(button);

    // Custom delay function with random time between 20 and 100ms
    function delay(min, max) {
        const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min; // Random delay between min and max
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    }

    async function performBurst() {
        for (let i = 0; i < 20; i++) {
            pressSpace();
            await delay(20, 100);
        }
    }

    // Toggle functionality for the button
    button.addEventListener('click', () => {
        isActive = !isActive;
        button.textContent = isActive ? 'ON' : 'OFF';
        button.style.backgroundColor = isActive ? 'green' : 'red';
        performBurst();
        setInterval(performBurst, 5000);
    });
})();
