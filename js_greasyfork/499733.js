// ==UserScript==
// @name         Serieslan Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Select video provider option automatically and change the background color of the page to improve visibility and reduce eye strain
// @author       JJJ
// @match        https://serieslan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=serieslan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499733/Serieslan%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/499733/Serieslan%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const CLASS_SELECTOR = 'div.sels > button.selop';
    const STORAGE_KEY = 'selectedOption';

    // CSS styles for the custom menu and page background
    const menuStyles = `
            /* Set background color to #2F353A for all elements */
            body,div, li, ul, header, footer {
                background-color: #2F353A !important;
            }
            
            /* Set text color to white for all text elements */
            body, p, h1, h2, h3, h4, h5, h6, span, a, li, div:not(#customMenu div), button:not(#customMenu button) {
                color: white !important;
            }
            
            /* Additional styles to improve visibility on links, if needed */
            a:not(#customMenu a) {
                text-decoration: underline !important;
            }
    
            #customMenu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 255, 255, 0.95) !important; /* Ensure background color is not overridden */
                border: 2px solid #000;
                padding: 15px;
                z-index: 9999;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                font-family: Arial, sans-serif;
                width: 300px;
                text-align: center;
                color: black !important; /* Ensure text color is not overridden */
            }
    
            #customMenu select {
                width: 100% !important;
                padding: 10px !important;
                margin-bottom: 10px !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                background-color: #FFFFFF !important; /* Ensure background color is white */
                color: black !important; /* Ensure text color is not overridden */
                -webkit-appearance: none !important; /* Disable default styling */
                -moz-appearance: none !important; /* Disable default styling */
                appearance: none !important; /* Disable default styling */
            }
    
            #customMenu button {
                padding: 10px 20px;
                border: none;
                background-color: #007bff !important; /* Ensure background color is not overridden */
                color: white !important; /* Ensure text color is not overridden */
                font-size: 14px;
                cursor: pointer;
                border-radius: 4px;
            }
    
            #customMenu button:hover {
                background-color: #0056b3 !important; /* Ensure hover background color is not overridden */
            }
        `;

    // Function to create the dropdown menu
    function createDropdownMenu(options) {
        const dropdownMenu = document.createElement('select');
        dropdownMenu.id = 'optionDropdown';

        options.forEach((option) => {
            const dropdownOption = document.createElement('option');
            dropdownOption.value = option.getAttribute('title') || option.textContent.trim();
            dropdownOption.textContent = option.getAttribute('title') || option.textContent.trim();
            dropdownMenu.appendChild(dropdownOption);
        });

        return dropdownMenu;
    }

    // Function to toggle the menu visibility
    function toggleMenu() {
        const menu = document.getElementById('customMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            console.log('Menu toggled, new display:', menu.style.display);
        } else {
            console.log('Menu element not found.');
        }
    }

    // Function to handle option selection
    function handleOptionSelection() {
        const selectedOptionValue = document.getElementById('optionDropdown').value;
        const options = document.querySelectorAll(CLASS_SELECTOR);

        options.forEach((option) => {
            if ((option.getAttribute('title') || option.textContent.trim()) === selectedOptionValue) {
                option.click();
                localStorage.setItem(STORAGE_KEY, selectedOptionValue);
                toggleMenu();
            }
        });
    }

    // Function to create the custom menu
    function createCustomMenu() {
        const options = document.querySelectorAll(CLASS_SELECTOR);

        const dropdownMenu = createDropdownMenu(options);
        const selectedOptionValue = localStorage.getItem(STORAGE_KEY);
        if (selectedOptionValue !== null) {
            dropdownMenu.value = selectedOptionValue;
        }

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.addEventListener('click', handleOptionSelection);

        const customMenu = document.createElement('div');
        customMenu.id = 'customMenu';
        customMenu.style.display = 'none';
        customMenu.appendChild(dropdownMenu);
        customMenu.appendChild(confirmButton);

        document.body.appendChild(customMenu);
        console.log('Custom menu created and added to the body');
    }

    // Function to automatically select the saved option
    function autoSelectOption() {
        const selectedOptionValue = localStorage.getItem(STORAGE_KEY);
        if (selectedOptionValue !== null) {
            const options = document.querySelectorAll(CLASS_SELECTOR);
            options.forEach((option) => {
                if ((option.getAttribute('title') || option.textContent.trim()) === selectedOptionValue) {
                    option.click();
                }
            });
        }
    }

    // Function to initialize the script
    function init() {
        const styleElement = document.createElement('style');
        styleElement.textContent = menuStyles;
        document.head.appendChild(styleElement);
        console.log('Styles added to the head');

        createCustomMenu();

        document.addEventListener('keydown', function (event) {
            if (event.key === 'F2') {
                console.log('F2 key pressed');
                toggleMenu();
            }
        });

        setTimeout(autoSelectOption, 100); // Delay execution to allow page load

        console.log('Script initialized');
    }

    // Run the script
    init();
})();