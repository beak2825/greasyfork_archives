// ==UserScript==
// @name         Minesweeper Pattern Display
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Display Pattern on the board screen
// @author       Elmgren
// @match        https://minesweeper.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526365/Minesweeper%20Pattern%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/526365/Minesweeper%20Pattern%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the MaintenanceLineBlock div
    const maintenanceLineBlock = document.getElementById('MaintenanceLineBlock');

    // Ensure the MaintenanceLineBlock exists
    if (maintenanceLineBlock) {
        // Create an image container
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex'; // Display images side by side
        imageContainer.style.justifyContent = 'center'; // Center images in the container
        imageContainer.style.alignItems = 'center'; // Align images vertically

        // Example images and corresponding text
        const items = [
            { imgSrc: 'https://minesweeper.online/img/help/1-1/4.png', text: '1-1' },
            { imgSrc: 'https://minesweeper.online/img/help/1-1p/4.png', text: '1-1+' },
            { imgSrc: 'https://minesweeper.online/img/help/1-2/4.png', text: '1-2' },
            { imgSrc: 'https://minesweeper.online/img/help/1-2p/4.png', text: '1-2+' },
            { imgSrc: 'https://minesweeper.online/img/help/1-2-1/3.png', text: '1-2-1' },
            { imgSrc: 'https://minesweeper.online/img/help/1-2-2-1/3.png', text: '1-2-2-1' },
        ];

        // Add images and text to the container
        items.forEach((item) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.style.marginLeft = '10px'; // Space between images

            // Create the text above the image
            const text = document.createElement('div');
            text.textContent = item.text;
            text.style.textAlign = 'center'; // Center the text above the image
            text.style.marginBottom = '5px'; // Space between text and image

            // Create the image
            const img = document.createElement('img');
            img.src = item.imgSrc;
            img.style.width = '100px'; // Adjust size as needed
            img.style.height = '100px'; // Adjust size as needed

            // Append text and image to the item wrapper
            itemWrapper.appendChild(text);
            itemWrapper.appendChild(img);

            // Append item wrapper to the main container
            imageContainer.appendChild(itemWrapper);
        });

        // Append the image container to the MaintenanceLineBlock
        maintenanceLineBlock.appendChild(imageContainer);
    }
})();