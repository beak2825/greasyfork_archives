// ==UserScript==
// @name         Infinite craft shitty menu
// @namespace    http://tampermonkey.net/
// @version      6.91
// @description  Made by gpt
// @author       Whathedogdoinn
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493677/Infinite%20craft%20shitty%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/493677/Infinite%20craft%20shitty%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the image you provided
    var imageUrl = 'https://cdn.discordapp.com/avatars/917452678446075914/9c7c98b9c6c846f8650be1b10755c6fb.webp?size=80';

    // Variable to track whether the menu is open
    var menuOpen = false;

    // Function to create and append the button
    function addButtonToSideControls() {
        // Create a new button element
        var button = document.createElement('button');

        // Set the button's HTML content to an image with the provided URL
        button.innerHTML = '<img src="' + imageUrl + '" style="width: 100%;">';

        // Add a class to the button for styling
        button.classList.add('custom-button');

        // Apply custom dimensions to the button
        button.style.width = '20.986px';
        button.style.height = '23.535px';

        // Find the first element with the class "side-controls"
        var sideControls = document.querySelector('.side-controls');

        // Append the button to the found element
        if (sideControls) {
            sideControls.appendChild(button);
        }
    }

    // Function to toggle the menu
    function toggleMenu(event) {
        var menu = document.querySelector('.custom-menu');
        if (!menu) {
            createMenu(event.target);
            menuOpen = true;
            return;
        }
        menu.remove();
        menuOpen = false;
    }

    // Function to create the menu
    function createMenu(button) {
        var menu = document.createElement('div');
        menu.classList.add('custom-menu');

        // Add a section for adding elements
        var addElementsSection = document.createElement('div');
        addElementsSection.innerHTML = `
            <h3>Add Elements</h3>
            <input type="text" id="element-name" placeholder="Name">
            <input type="text" id="element-emoji" placeholder="Emoji">
            <button id="add-element-button">Add Element</button>
            <div>
                <label for="discovered-checkbox">Discovered:</label>
                <input type="checkbox" id="discovered-checkbox">
            </div>
        `;
        menu.appendChild(addElementsSection);

        // Position the menu above the side-controls class
        var sideControls = document.querySelector('.side-controls');
        if (sideControls) {
            var rect = sideControls.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = '50px';
            menu.style.left = '10px';
        }

        // Add click event listener to close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menu.contains(event.target)) {
                menu.remove();
                menuOpen = false;
            }
        });

        // Add click event listener to prevent menu from closing when clicking inside
        menu.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Add click event listener to the "Add Element" button
        var addButton = menu.querySelector('#add-element-button');
        addButton.addEventListener('click', function() {
            var nameInput = menu.querySelector('#element-name');
            var emojiInput = menu.querySelector('#element-emoji');
            var name = nameInput.value;
            var emoji = emojiInput.value;
            var discovered = document.querySelector('#discovered-checkbox').checked;
            if (name && emoji) {
                addElement(name, emoji, discovered);
                nameInput.value = '';
                emojiInput.value = '';
            }
        });

        // Append the menu to the body
        document.body.appendChild(menu);
    }

    // Function to add a new element
    function addElement(name, emoji, discovered) {
        var existingData = JSON.parse(localStorage.getItem("infinite-craft-data")) || { elements: [] };
        var newElement = {"text": name, "emoji": emoji, "discovered": discovered};
        existingData.elements.push(newElement);
        localStorage.setItem("infinite-craft-data", JSON.stringify(existingData));
        location.reload();
    }

    // Check for the presence of the target element every 500 milliseconds
    var checkInterval = setInterval(function() {
        var sideControls = document.querySelector('.side-controls');
        // If the target element is found, add the button and clear the interval
        if (sideControls) {
            addButtonToSideControls();
            clearInterval(checkInterval);
        }
    }, 500);

    // Attach click event listener to the document to create the menu when the button is clicked
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('custom-button') && !menuOpen) {
            toggleMenu(event);
        }
    });

    // Prevent key presses from being detected by the search bar when the menu is open
    document.addEventListener('keydown', function(event) {
        if (menuOpen) {
            event.stopPropagation();
        }
    });
})();
