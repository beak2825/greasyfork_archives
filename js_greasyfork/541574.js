// ==UserScript==
// @name         by chatgpt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a color picker to choose any brush color in Drawaria
// @author       belen
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541574/by%20chatgpt.user.js
// @updateURL https://update.greasyfork.org/scripts/541574/by%20chatgpt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', () => {
        // Create a color picker input
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.position = 'absolute';
        colorPicker.style.top = '10px';
        colorPicker.style.right = '10px';
        colorPicker.style.zIndex = 9999;
        colorPicker.title = 'Pick your custom brush color';

        // Add to the page
        document.body.appendChild(colorPicker);

        // Hook into the game's brush color logic
        colorPicker.addEventListener('input', () => {
            const brush = window?.canvasInstance?.brush;
            if (brush) {
                brush.color = colorPicker.value;
                console.log('[Drawaria] Custom brush color set to:', colorPicker.value);
            }
        });

        console.log('[Drawaria] Custom color picker loaded.');
    });
})();
