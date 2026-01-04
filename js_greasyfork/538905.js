// ==UserScript==
// @name         Vaaaz.Dev Button - Absolute Position
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a Vaaaz.Dev button (icon only) to the far right of the header using absolute positioning to avoid layout shifts.
// @author       Your Name
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538905/VaaazDev%20Button%20-%20Absolute%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/538905/VaaazDev%20Button%20-%20Absolute%20Position.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        // Find the main header container.
        // Based on the HTML you provided, 'div.container.clearfix' is the most suitable
        // parent for absolute positioning that encompasses the whole header layout.
        // It's also the div that your more specific selector resolves to.
        const targetContainer = document.querySelector('div.container.clearfix');

        if (targetContainer) {
            // Make the target container a positioning context if it's not already.
            // This is crucial for absolute positioning to work relative to it.
            // We check its current computed style to avoid overriding existing non-static positioning.
            const currentPosition = window.getComputedStyle(targetContainer).position;
            if (currentPosition === 'static') {
                targetContainer.style.position = 'relative';
            }

            // Create a new div to wrap our button.
            // This wrapper will be absolutely positioned.
            const buttonWrapper = document.createElement('div');
            buttonWrapper.id = 'vaaaz-dev-custom-button-wrapper'; // Give it a unique ID for easier CSS targeting

            // Apply absolute positioning to the wrapper
            buttonWrapper.style.position = 'absolute';
            // Adjust 'right' and 'top' values below to fine-tune its exact position.
            // 'right: 10px' will place it 10 pixels from the right edge of the targetContainer.
            // 'top: 10px' will place it 10 pixels from the top edge of the targetContainer.
            buttonWrapper.style.right = '-70px';
            buttonWrapper.style.top = '10px';
            buttonWrapper.style.zIndex = '1000'; // Ensure it appears on top of other elements

            // Create the anchor tag for the button
            const newLink = document.createElement('a');
            newLink.href = 'https://vaaaz.dev/chart';
            newLink.target = '_blank'; // Open in a new tab
            newLink.ariaLabel = 'Vaaaz.Dev Chart'; // Accessibility label

            // Create the image element for the SVG icon
            const svgImg = document.createElement('img');
            svgImg.src = 'https://vaaaz.dev/images/FLATICON.svg';
            svgImg.alt = 'Vaaaz.Dev Chart'; // Alt text for accessibility
            svgImg.style.width = '25px'; // Set the desired width of the icon
            svgImg.style.height = '25px'; // Set the desired height of the icon
            svgImg.style.display = 'block'; // Ensures the image behaves as a block within its container

            // Append the SVG image directly to the link (no text)
            newLink.appendChild(svgImg);

            // Append the link to the wrapper div
            buttonWrapper.appendChild(newLink);

            // Append the wrapper div to the target container
            targetContainer.appendChild(buttonWrapper);

        } else {
            console.error('Vaaaz.Dev Button: Could not find the main header container (div.container.clearfix).');
        }
    }

    // Run the function after the page has loaded
    window.addEventListener('load', addButton);

})();