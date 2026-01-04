// ==UserScript==
// @name         AC Custom Background
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Replace the default background image of Anime Academy with a custom external URL and make it cover the entire page without repeating. Users can set the image via an interactive button in the settings menu, and it will persist across page reloads.
// @author       Asriel
// @license MIT
// @match        https://anime.academy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511262/AC%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/511262/AC%20Custom%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply the custom background image
    function applyCustomBackground(url) {
        if (url) {
            document.documentElement.style.cssText = `
                background-image: url("${url}") !important;
                background-color: #000 !important;
                background-position: center center !important;
                background-attachment: fixed !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
            `;

            document.body.style.cssText = `
                background-image: url("${url}") !important;
                background-color: #000 !important;
                background-position: center center !important;
                background-attachment: fixed !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
            `;
        }
    }

    // Load the saved background URL from localStorage
    const savedImageUrl = localStorage.getItem('customBackgroundUrl');
    if (savedImageUrl) {
        applyCustomBackground(savedImageUrl);
    }

    // Function to create and display the custom image URL input menu
    function createInputMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.zIndex = '10001';
        menu.style.padding = '20px';
        menu.style.backgroundColor = '#fff';
        menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        menu.style.borderRadius = '10px';
        menu.style.textAlign = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter image URL here...';
        input.value = savedImageUrl || '';
        input.style.width = '300px';
        input.style.padding = '10px';
        input.style.marginBottom = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';

        const applyButton = document.createElement('button');
        applyButton.innerText = 'Apply Background';
        applyButton.style.marginLeft = '10px';
        applyButton.style.padding = '10px';
        applyButton.style.backgroundColor = '#573699';
        applyButton.style.color = '#fff';
        applyButton.style.border = 'none';
        applyButton.style.borderRadius = '5px';
        applyButton.style.cursor = 'pointer';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#ccc';
        closeButton.style.color = '#000';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        // Append input, apply button, and close button to menu
        menu.appendChild(input);
        menu.appendChild(applyButton);
        menu.appendChild(document.createElement('br'));
        menu.appendChild(closeButton);

        // Append menu to body
        document.body.appendChild(menu);

        // Event listener for apply button
        applyButton.addEventListener('click', () => {
            const imageUrl = input.value.trim();
            if (imageUrl) {
                localStorage.setItem('customBackgroundUrl', imageUrl); // Save the URL to localStorage
                applyCustomBackground(imageUrl);
                menu.remove(); // Close the menu after applying
            } else {
                alert('Please enter a valid URL.');
            }
        });

        // Event listener for close button
        closeButton.addEventListener('click', () => {
            menu.remove(); // Close the menu without applying
        });
    }

    // Function to add the button to the settings menu
    function addButtonToSettings() {
        const settingsMenu = document.querySelector('.options_settings');
        if (settingsMenu) {
            const setBackgroundButton = document.createElement('button');
            setBackgroundButton.innerText = 'Set Custom Background';
            setBackgroundButton.style.marginTop = '10px';
            setBackgroundButton.style.padding = '10px';
            setBackgroundButton.style.backgroundColor = '#573699';
            setBackgroundButton.style.color = '#fff';
            setBackgroundButton.style.border = 'none';
            setBackgroundButton.style.borderRadius = '5px';
            setBackgroundButton.style.cursor = 'pointer';

            // Add event listener to the button to open the input menu
            setBackgroundButton.addEventListener('click', createInputMenu);

            settingsMenu.appendChild(setBackgroundButton);
        } else {
            console.warn('Settings menu not found. The custom background button could not be added.');
        }
    }

    // Wait for the settings menu to load before adding the button
    window.addEventListener('load', addButtonToSettings);

})();
