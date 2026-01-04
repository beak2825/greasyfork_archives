// ==UserScript==
// @name         Shell Shockers Mouse Color Changer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change mouse color in Shell Shockers using an RGB color wheel
// @author       You
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484076/Shell%20Shockers%20Mouse%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/484076/Shell%20Shockers%20Mouse%20Color%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create an RGB color picker dialog
    function showColorPicker() {
        const color = prompt('Choose a color using RGB values (e.g., 255, 0, 0 for red):');
        if (color) {
            const [red, green, blue] = color.split(',').map(value => parseInt(value.trim(), 10));
            const isValidColor = !isNaN(red) && !isNaN(green) && !isNaN(blue) &&
                                 red >= 0 && red <= 255 &&
                                 green >= 0 && green <= 255 &&
                                 blue >= 0 && blue <= 255;

            if (isValidColor) {
                const newMouseColor = `rgb(${red}, ${green}, ${blue})`;
                const gameCanvas = document.getElementById('game-canvas');

                if (gameCanvas) {
                    gameCanvas.style.cursor = `url('data:image/svg+xml;utf8,<svg fill="${encodeURIComponent(newMouseColor)}" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12"/></svg>'), auto`;
                }
            } else {
                alert('Invalid RGB values. Please try again.');
            }
        }
    }

    // Add an event listener to trigger the color picker when the game loads
    window.addEventListener('load', () => {
        showColorPicker();
    });
})();