// ==UserScript==
// @name         Aywas Mystery Egg Parser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parse mystery egg contents and display them in a list
// @author       Alana #70812
// @match        https://www.aywas.com/inventory/details/*
// @match        https://www.aywas.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497835/Aywas%20Mystery%20Egg%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/497835/Aywas%20Mystery%20Egg%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to parse mystery egg contents
    function parseMysteryEggs() {
        const eggList = [];
        // Find image elements within the specified div class
        const images = document.querySelectorAll('.center img');
        images.forEach(img => {
            // Extract alt-text from each image
            const altText = img.alt.trim();
            // Parse alt-text to extract egg contents
            const eggContent = parseAltText(altText);
            // Add egg content to the list
            if (eggContent) {
                eggList.push(eggContent);
            }
        });
        // Display the parsed egg contents
        displayEggList(eggList);
        // Save the parsed egg list to localStorage
        saveToLocalStorage(eggList);
    }

    // Function to parse alt-text and extract egg contents
    function parseAltText(altText) {
        // Check if alt-text contains any of the specified levels
        const levels = ['Metal-level', 'Bronze-level', 'Blue-level', 'Gold-level'];
        const levelRegex = new RegExp(levels.join('|'), 'i');
        const levelMatch = altText.match(levelRegex);
        if (levelMatch) {
            // Extract species name after the level
            const speciesRegex = /(?:Metal|Bronze|Blue|Gold)-level\s+(\w+)/i;
            const speciesMatch = altText.match(speciesRegex);
            if (speciesMatch && speciesMatch[1]) {
                return `${levelMatch[0]} ${speciesMatch[1]}`;
            }
        }
        return null; // Return null if alt-text doesn't match the expected format
    }

    // Function to create the buttons for different pages
    function createButtons() {
        const url = window.location.href;
        if (url.includes('/inventory/details/')) {
            createParseButton();
        } else {
            createClearButton();
            createToggleListButton();
        }
    }

    // Function to create the Parse Mystery Eggs button
    function createParseButton() {
        const button = document.createElement('button');
        button.textContent = 'Parse Mystery Eggs';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.addEventListener('click', parseMysteryEggs);
        document.body.appendChild(button);
    }

    // Function to create the Clear Egg button
    function createClearButton() {
        const button = document.createElement('button');
        button.textContent = 'Clear Egg';
        button.style.position = 'fixed';
        button.style.bottom = '75px';
        button.style.left = '90px'; // Adjusted left position
        button.addEventListener('click', clearEgg);
        document.body.appendChild(button);
    }


    // Function to create the Hide/Show List button
    function createToggleListButton() {
        const button = document.createElement('button');
        button.textContent = 'Hide List';
        button.style.position = 'fixed';
        button.style.bottom = '50px'; // Adjusted bottom position
        button.style.left = '20px';
        button.addEventListener('click', toggleList);
        document.body.appendChild(button);

        // Function to toggle the text content of the button
        function toggleButtonText() {
            button.textContent = button.textContent === 'Hide List' ? 'Show List' : 'Hide List';
        }

        // Function to toggle the list visibility and update button text
        function toggleList() {
            const list = document.getElementById('mysteryEggList');
            if (list) {
                const listDisplayStyle = window.getComputedStyle(list).getPropertyValue('display');
                list.style.display = listDisplayStyle === 'none' ? 'block' : 'none';
                toggleButtonText();
            }
        }

        return button;
    }

    // Function to create the Clear List button
    function createClearListButton() {
        const button = document.createElement('button');
        button.textContent = 'Clear List';
        button.style.position = 'fixed';
        button.style.bottom = '75px'; // Adjusted bottom position
        button.style.left = '20px';
        button.addEventListener('click', clearList);
        document.body.appendChild(button);
    }

    // Function to clear the entire list
    function clearList() {
        const list = document.getElementById('mysteryEggList');
        if (list) {
            list.innerHTML = ''; // Clear all list items
            localStorage.removeItem('mysteryEggList'); // Clear stored list data
        }
    }





    // Function to clear the top entry in the list
    function clearEgg() {
        const list = document.getElementById('mysteryEggList');
        if (list && list.children.length > 0) {
            list.removeChild(list.firstChild);
            // Update the localStorage if needed
            const eggList = Array.from(list.children).map(item => item.textContent);
            saveToLocalStorage(eggList);
        }
    }

    // Function to toggle the display of the list
    function toggleList() {
        const list = document.getElementById('mysteryEggList');
        if (list) {
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Function to display the parsed egg contents in a floating list
    function displayEggList(eggList) {
        // Clear any existing list
        const existingList = document.getElementById('mysteryEggList');
        if (existingList) {
            existingList.parentNode.removeChild(existingList);
        }
        // Create a new list element
        const list = document.createElement('ul');
        list.id = 'mysteryEggList';
        list.style.position = 'fixed';
        list.style.bottom = '100px';
        list.style.left = '20px';
        list.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        list.style.padding = '10px';
        list.style.border = '1px solid #ccc';
        list.style.borderRadius = '5px';
        eggList.forEach(egg => {
            // Create list item for each egg content
            const listItem = document.createElement('li');
            listItem.textContent = egg;
            list.appendChild(listItem);
        });
        // Add the list to the page
        document.body.appendChild(list);
    }

    // Function to save the parsed egg list to localStorage
    function saveToLocalStorage(eggList) {
        localStorage.setItem('mysteryEggList', JSON.stringify(eggList));
    }

    // Function to load the parsed egg list from localStorage
    function loadFromLocalStorage() {
        const storedEggList = localStorage.getItem('mysteryEggList');
        if (storedEggList) {
            const eggList = JSON.parse(storedEggList);
            displayEggList(eggList);
        }
    }

    // Initialize the script
    createButtons();
    loadFromLocalStorage();
    createClearListButton();
})();
