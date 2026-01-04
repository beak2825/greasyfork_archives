// ==UserScript==
// @name         Sploop.io Text Colour Changer [Menu on "O" key]
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  press "o" ingame! (Reload the page or switch server after selecting colour)
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://i.postimg.cc/T190gtSm/lootbox.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492516/Sploopio%20Text%20Colour%20Changer%20%5BMenu%20on%20%22O%22%20key%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/492516/Sploopio%20Text%20Colour%20Changer%20%5BMenu%20on%20%22O%22%20key%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let textColor = localStorage.getItem('textColor') || '#3A58FE';
    let colorPickerVisible = false;

    const { fillText } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
        this.fillStyle = textColor;
        fillText.call(this, ...arguments);
    };

    function toggleColorPickerMenu() {
        if (!colorPickerVisible) {
            const colorPickerMenu = document.createElement('div');
            colorPickerMenu.id = 'colorPickerMenu';
            colorPickerMenu.style.position = 'fixed';
            colorPickerMenu.style.top = '10px';
            colorPickerMenu.style.left = '10px';
            colorPickerMenu.style.background = 'white';
            colorPickerMenu.style.padding = '10px';
            colorPickerMenu.style.border = '1px solid #ccc';
            colorPickerMenu.style.zIndex = '9999';

            const colorPickerLabel = document.createElement('label');
            colorPickerLabel.textContent = 'Font Color:';
            colorPickerLabel.style.marginRight = '5px';

            const colorPickerInput = document.createElement('input');
            colorPickerInput.type = 'color';
            colorPickerInput.value = textColor;
            colorPickerInput.addEventListener('change', function() {
                textColor = colorPickerInput.value;
                localStorage.setItem('textColor', textColor);
                const canvas = document.getElementById("game-canvas");
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = textColor;
            });

            const gradientButton = document.createElement('button');
            gradientButton.textContent = 'Cool Gradient Colour';
            gradientButton.addEventListener('click', function() {
                textColor = createGradient();
                localStorage.setItem('textColor', textColor);
                const canvas = document.getElementById("game-canvas");
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = textColor;
            });

            const instructionText = document.createElement('p');
            instructionText.textContent = 'Die and switch servers to change font instantly';
            instructionText.style.fontSize = '12px';
            instructionText.style.marginTop = '10px';

            colorPickerMenu.appendChild(colorPickerLabel);
            colorPickerMenu.appendChild(colorPickerInput);
            colorPickerMenu.appendChild(document.createElement('br'));
            colorPickerMenu.appendChild(gradientButton);
            colorPickerMenu.appendChild(instructionText);
            document.body.appendChild(colorPickerMenu);
            colorPickerVisible = true;
        } else {
            const colorPickerMenu = document.getElementById('colorPickerMenu');
            colorPickerMenu.remove();
            colorPickerVisible = false;
        }
    }

    function createGradient() {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, '#affcaf');
        grd.addColorStop(0.1, '#12dff3');
        grd.addColorStop(0.2, '#70a2ff');
        grd.addColorStop(0.3, '#ff2e63');
        grd.addColorStop(0.4, '#f8d800');
        grd.addColorStop(0.5, '#ff2e63');
        grd.addColorStop(0.6, '#70a2ff');
        grd.addColorStop(0.7, '#12dff3');
        grd.addColorStop(0.8, '#affcaf');
        return grd;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'o' || event.key === 'O') {
            toggleColorPickerMenu();
        }
    });
})();