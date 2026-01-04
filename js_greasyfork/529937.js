// ==UserScript==
// @name         SoLo's Agma.io Font Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change Fonts in Agma.io!
// @author       Discord @xrsn
// @match        *://agma.io/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529937/SoLo%27s%20Agmaio%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/529937/SoLo%27s%20Agmaio%20Font%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of 15 fonts to choose from
    const fonts = [
        'Anton',
        'Cormorant Garamond',
        'Roboto',
        'Open Sans',
        'Lora',
        'Poppins',
        'Montserrat',
        'Merriweather',
        'Playfair Display',
        'Raleway',
        'Lato',
        'Oswald',
        'Source Sans Pro',
        'Quicksand',
        'Roboto Slab'
    ];

    // Create the container for the font changer UI
    const fontChangerContainer = document.createElement('div');
    fontChangerContainer.style.position = 'fixed';
    fontChangerContainer.style.top = '50px';
    fontChangerContainer.style.right = '10px';
    fontChangerContainer.style.zIndex = '9999';
    fontChangerContainer.style.padding = '10px';
    fontChangerContainer.style.backgroundColor = '#333';
    fontChangerContainer.style.color = '#fff';
    fontChangerContainer.style.borderRadius = '8px';
    fontChangerContainer.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
    fontChangerContainer.style.fontFamily = 'Arial, sans-serif';
    fontChangerContainer.style.display = 'none'; // Hide the menu by default

    // Create and style the "SoLo's Font Changer" label
    const label = document.createElement('span');
    label.textContent = "SoLo's Font Changer";
    label.style.fontSize = '16px';
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '10px';
    label.style.display = 'block';
    fontChangerContainer.appendChild(label);

    // Create the font selector dropdown
    const fontSelector = document.createElement('select');
    fontSelector.style.width = '200px';
    fontSelector.style.padding = '5px';
    fontSelector.style.backgroundColor = '#444';
    fontSelector.style.border = '1px solid #ccc';
    fontSelector.style.borderRadius = '5px';
    fontSelector.style.fontSize = '14px';
    fontSelector.style.color = '#fff';

    // Add the font options to the dropdown
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        fontSelector.appendChild(option);
    });

    fontChangerContainer.appendChild(fontSelector);
    document.body.appendChild(fontChangerContainer);

    // Create the compact button to show/hide the font changer
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⚙️';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '8px';
    toggleButton.style.backgroundColor = '#007BFF';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.fontSize = '18px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'none'; // Hide button by default

    document.body.appendChild(toggleButton);

    // Toggle the visibility of the font changer container when the button is clicked
    toggleButton.addEventListener('click', () => {
        if (fontChangerContainer.style.display === 'none') {
            fontChangerContainer.style.display = 'block';
        } else {
            fontChangerContainer.style.display = 'none';
        }
    });

    // Function to check if we're in the menu
    function isInMenu() {
        // Assuming that the main menu has elements like #menu or a certain class
        return document.querySelector('.main-menu') !== null || document.querySelector('#menu') !== null;
    }

    // Function to update button visibility based on being in the menu
    function updateButtonVisibility() {
        if (isInMenu()) {
            toggleButton.style.display = 'block'; // Show the button if in the menu
        } else {
            toggleButton.style.display = 'none'; // Hide the button if not in the menu
        }
    }

    // Initially check the menu state
    updateButtonVisibility();

    // Listen for changes in the DOM to detect when the menu is shown or hidden
    const observer = new MutationObserver(updateButtonVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    // Load the Google Fonts stylesheets for each font
    fonts.forEach(font => {
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap');
        `);
    });

    // Apply the selected font to the page
    fontSelector.addEventListener('change', () => {
        const selectedFont = fontSelector.value;
        document.body.style.fontFamily = `${selectedFont}, sans-serif`;
    });
})();
