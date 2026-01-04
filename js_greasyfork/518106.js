// ==UserScript==
// @name         HTML Warper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Warps and messes around with the HTML of a site, with a protected GUI at the top of the page.
// @author       cybuds
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518106/HTML%20Warper.user.js
// @updateURL https://update.greasyfork.org/scripts/518106/HTML%20Warper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let guiContainer = null;
    let reopenButton = null;
    const originalState = new Map();

    // Helper to create the GUI
    const createGUI = () => {
        if (guiContainer) return;

        // Main GUI container
        guiContainer = document.createElement('div');
        guiContainer.id = 'htmlWarperGui';
        guiContainer.style.position = 'fixed';
        guiContainer.style.top = '0';
        guiContainer.style.left = '0';
        guiContainer.style.width = '100%';
        guiContainer.style.padding = '10px';
        guiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        guiContainer.style.color = 'white';
        guiContainer.style.borderBottom = '2px solid white';
        guiContainer.style.zIndex = '99999';
        guiContainer.style.fontFamily = 'Arial, sans-serif';
        guiContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px;">HTML Warper</h3>
                <button id="closeGui">Close GUI</button>
            </div>
            <div style="margin-top: 10px;">
                <button id="randomizeText">Randomize Text</button>
                <button id="rotateElements">Rotate Elements</button>
                <button id="changeColors">Change Colors</button>
                <button id="blurText">Blur Text</button>
                <button id="enlargeElements">Enlarge Elements</button>
                <button id="hideRandom">Hide Random Elements</button>
                <button id="undoChanges">Undo Changes</button>
            </div>
        `;
        document.body.appendChild(guiContainer);

        // Event listeners for GUI buttons
        document.getElementById('randomizeText').addEventListener('click', randomizeText);
        document.getElementById('rotateElements').addEventListener('click', rotateElements);
        document.getElementById('changeColors').addEventListener('click', changeColors);
        document.getElementById('blurText').addEventListener('click', blurText);
        document.getElementById('enlargeElements').addEventListener('click', enlargeElements);
        document.getElementById('hideRandom').addEventListener('click', hideRandomElements);
        document.getElementById('undoChanges').addEventListener('click', undoChanges);

        // Close GUI
        document.getElementById('closeGui').addEventListener('click', () => {
            guiContainer.style.display = 'none';
            reopenButton.style.display = 'block';
        });
    };

    // Create reopen button
    const createReopenButton = () => {
        reopenButton = document.createElement('button');
        reopenButton.innerText = 'Reopen GUI';
        reopenButton.style.position = 'fixed';
        reopenButton.style.bottom = '10px';
        reopenButton.style.right = '10px';
        reopenButton.style.padding = '10px';
        reopenButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        reopenButton.style.color = 'white';
        reopenButton.style.border = '1px solid white';
        reopenButton.style.borderRadius = '5px';
        reopenButton.style.zIndex = '99999';
        reopenButton.style.fontFamily = 'Arial, sans-serif';
        reopenButton.style.display = 'none';
        document.body.appendChild(reopenButton);

        reopenButton.addEventListener('click', () => {
            guiContainer.style.display = 'block';
            reopenButton.style.display = 'none';
        });
    };

    // Functions for the effects (excluding the GUI)
    const randomizeText = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.innerText);
            if (el.children.length === 0) el.innerText = Math.random().toString(36).substring(7);
        });
    };

    const rotateElements = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.style.transform);
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
    };

    const changeColors = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.style.backgroundColor);
            el.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        });
    };

    const blurText = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.style.filter);
            el.style.filter = 'blur(2px)';
        });
    };

    const enlargeElements = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.style.transform);
            el.style.transform = 'scale(1.5)';
        });
    };

    const hideRandomElements = () => {
        document.querySelectorAll('*:not(#htmlWarperGui):not(#htmlWarperGui *)').forEach((el) => {
            if (!originalState.has(el)) originalState.set(el, el.style.display);
            if (Math.random() > 0.7) el.style.display = 'none';
        });
    };

    const undoChanges = () => {
        originalState.forEach((value, element) => {
            element.innerText = value || '';
            element.style.transform = '';
            element.style.backgroundColor = '';
            element.style.filter = '';
            element.style.display = '';
        });
        originalState.clear();
    };

    // Initialize GUI and reopen button
    createGUI();
    createReopenButton();
})();
