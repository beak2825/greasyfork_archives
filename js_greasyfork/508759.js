// ==UserScript==
// @name         Minecraft Classic Block Color Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the colors of blocks in Minecraft Classic
// @author       You
// @match        https://classic.minecraft.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508759/Minecraft%20Classic%20Block%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/508759/Minecraft%20Classic%20Block%20Color%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your block color changes here
    const blockColors = {
        'block-id-1': '#ff0000', // Replace 'block-id-1' with actual block ID and color
        'block-id-2': '#00ff00', // Replace 'block-id-2' with actual block ID and color
        // Add more blocks and colors as needed
    };

    // Function to change block colors
    function changeBlockColors() {
        Object.keys(blockColors).forEach(blockId => {
            const elements = document.querySelectorAll(`.block-class-${blockId}`); // Adjust selector as needed
            elements.forEach(element => {
                element.style.backgroundColor = blockColors[blockId];
            });
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', changeBlockColors);
})();
