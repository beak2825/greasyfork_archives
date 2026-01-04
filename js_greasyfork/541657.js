// ==UserScript==
// @name         Floating Color Palette for Drawaria
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0
// @description  Adds a floating color palette to Drawaria for quick color selection.
// @author       Lucas
// @match        https://www.drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541657/Floating%20Color%20Palette%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/541657/Floating%20Color%20Palette%20for%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

    const palette = document.createElement('div');
    palette.style.position = 'fixed';
    palette.style.top = '80px';
    palette.style.left = '10px';
    palette.style.zIndex = '9999';
    palette.style.background = '#222';
    palette.style.padding = '5px';
    palette.style.borderRadius = '6px';
    palette.style.display = 'flex';
    palette.style.gap = '5px';
    palette.style.flexWrap = 'wrap';

    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.style.backgroundColor = color;
        btn.style.width = '20px';
        btn.style.height = '20px';
        btn.style.border = '2px solid white';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '3px';
        btn.title = color;

        btn.addEventListener('click', () => {
            const colorInput = document.querySelector('input[type=color]');
            if (colorInput) {
                colorInput.value = color;
                colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        palette.appendChild(btn);
    });

    document.body.appendChild(palette);
})();
