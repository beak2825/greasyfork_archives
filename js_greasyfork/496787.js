// ==UserScript==
// @name         ChatGPT ToDo List
// @namespace    https://your.namespace.com
// @version      0.7
// @description  A small, modern TO DO list for dang ChatGPT
// @author       Emree.el on instagram :)
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496787/ChatGPT%20ToDo%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/496787/ChatGPT%20ToDo%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adds a funny little checkbox to the top right corner
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.position = 'fixed';
    checkbox.style.top = '10px';
    checkbox.style.right = '10px';
    document.body.appendChild(checkbox);

    // Function to show/hide the panel based on checkbox state
    function togglePanel() {
        const panel = document.getElementById('custom-panel');
        if (checkbox.checked) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    checkbox.addEventListener('change', togglePanel);

    // Create the panel... lol
    const panel = document.createElement('div');
    panel.id = 'custom-panel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '10px';
    panel.style.width = '200px';
    panel.style.height = '300px';
    panel.style.overflowY = 'auto'; // Changed from overflowX to overflowY
    panel.style.display = 'none';
    panel.style.border = '1px solid #171717'; // Set border color
    panel.style.background = '#171717'; // Set background color
    document.body.appendChild(panel);

    // Retrieve stored text from storage
    function retrieveStoredTexts() {
        const storedTexts = JSON.parse(GM_getValue('storedTexts', '[]'));
        const uniqueTexts = new Set(storedTexts);
        uniqueTexts.forEach(text => {
            const newText = document.createElement('div');
            newText.textContent = text;
            panel.prepend(newText);
            const deleteButton = document.createElement('button'); // Moved delete button creation here
            deleteButton.textContent = 'Delete';
            deleteButton.style.marginLeft = '5px';
            deleteButton.style.color = 'red'; // Set delete button text color to red
            deleteButton.addEventListener('click', function() {
                newText.remove();
                storedTexts.splice(storedTexts.indexOf(text), 1); // Remove text from stored texts
                GM_setValue('storedTexts', JSON.stringify(storedTexts)); // Update stored texts
            });
            newText.appendChild(deleteButton);
        });
    }

    // Call the function to retrieve stored text
    retrieveStoredTexts();

    // Create text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter text';
    textInput.style.background = '#212121'; // Set textbox color
    panel.appendChild(textInput);

    // Function to add entered text to the panel
    function addText() {
        const text = textInput.value.trim();
        if (text !== '') {
            const newText = document.createElement('div');
            newText.textContent = text;
            panel.prepend(newText);
            const deleteButton = document.createElement('button'); // Moved delete button creation here
            deleteButton.textContent = 'Delete';
            deleteButton.style.marginLeft = '5px';
            deleteButton.style.color = 'red'; // Set delete button text color to red
            deleteButton.addEventListener('click', function() {
                newText.remove();
                storedTexts.splice(storedTexts.indexOf(text), 1); // Remove text from stored texts
                GM_setValue('storedTexts', JSON.stringify(storedTexts)); // Update stored texts
            });
            newText.appendChild(deleteButton);
            textInput.value = '';
            storeText(text); // Store text
        }
    }

    // Function to store entered text in storage
    function storeText(text) {
        let storedTexts = JSON.parse(GM_getValue('storedTexts', '[]'));
        storedTexts.push(text); // Store text
        GM_setValue('storedTexts', JSON.stringify(storedTexts.filter(Boolean))); // Update stored texts, filter out empty strings
    }

    // Add event listener to the text input to add text
    textInput.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            addText();
        }
    });

})();
