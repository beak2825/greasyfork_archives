// ==UserScript==
// @name         Canvas Rainbow Effect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a rainbow effect to the canvas by coloring all pixels randomly.
// @author       Your Name
// @match        https://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474853/Canvas%20Rainbow%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/474853/Canvas%20Rainbow%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const canvas = document.getElementById('canvas'); // Pixelplace canvas element

    // Function to generate a random rainbow color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to apply the rainbow effect to all pixels
    function applyRainbowEffect() {
        const pixels = document.querySelectorAll('.pixel'); // All pixels on the canvas

        // Loop through each pixel and set a random color
        pixels.forEach((pixel) => {
            pixel.style.backgroundColor = getRandomColor();
        });
    }

    // Apply the rainbow effect when the page loads
    applyRainbowEffect();

})();
