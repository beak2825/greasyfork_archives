// ==UserScript==
// @name         Word and Image Blocker - Settings - UI
// @namespace    https://github.com/def-initive/
// @version      1.0
// @description  This is the UI script. It's seperate so you can toggle the UI on and off. Use this script to add and delete words and phrases. Toggle off and on in the violentmonkey extension. Blocking works without this toggled on.
// @author       def-initive
// @match        *://*/*
// @exclude      *://github.com/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481834/Word%20and%20Image%20Blocker%20-%20Settings%20-%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/481834/Word%20and%20Image%20Blocker%20-%20Settings%20-%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create the UI element
    function createUI() {
        // Get the blocked phrases from local storage
        var storedPhrases = localStorage.getItem('blockedPhrases');
        var blockedPhrases = storedPhrases ? JSON.parse(storedPhrases) : [];

        // Create a container element for the UI
        var container = document.createElement('div');
        container.className = 'blocked-phrases-settings-container'; // Add a class for identification
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.padding = '10px';
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';
        container.style.zIndex = '9999';

        // Create a heading for the UI
        var heading = document.createElement('h2');
        heading.textContent = 'Blocked Phrases Settings';
        container.appendChild(heading);

        // Create an unordered list to display the phrases
        var list = document.createElement('ul');

        // Function to remove a phrase from the list and update the UI
        function removePhrase(index) {
            blockedPhrases.splice(index, 1);
            updateUI();
            saveToLocalStorage();
        }

        // Add each blocked phrase to the list
        blockedPhrases.forEach(function (phrase, index) {
            var listItem = document.createElement('li');
            listItem.textContent = phrase;

            // Create a "Remove" button for each phrase
            var removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.style.marginLeft = '5px';
            removeButton.addEventListener('click', function () {
                removePhrase(index);
            });

            listItem.appendChild(removeButton);
            list.appendChild(listItem);
        });

        container.appendChild(list);

        // Create an "Add Words" button
        var addButton = document.createElement('button');
        addButton.textContent = 'Add Words';
        addButton.addEventListener('click', function () {
            // Prompt the user to enter new words
            var newWords = prompt('Enter new words or phrases (comma-separated):');
            if (newWords) {
                // Split the entered words and add them to the blocked phrases list
                var newWordsArray = newWords.split(',').map(function (word) {
                    return word.trim();
                });
                blockedPhrases = blockedPhrases.concat(newWordsArray);

                // Update the UI with the new list of blocked phrases
                updateUI();
                saveToLocalStorage();
            }
        });

        container.appendChild(addButton);

        // Append the container to the document body
        document.body.appendChild(container);

        // Function to update the UI with the latest list of blocked phrases
        function updateUI() {
            list.innerHTML = ''; // Clear the existing list

            // Add each blocked phrase to the list
            blockedPhrases.forEach(function (phrase, index) {
                var listItem = document.createElement('li');
                listItem.textContent = phrase;

                // Create a "Remove" button for each phrase
                var removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.style.marginLeft = '5px';
                removeButton.addEventListener('click', function () {
                    removePhrase(index);
                });

                listItem.appendChild(removeButton);
                list.appendChild(listItem);
            });
        }

        // Function to save the updated list to local storage
        function saveToLocalStorage() {
            localStorage.setItem('blockedPhrases', JSON.stringify(blockedPhrases));
        }
    }

    // Create the UI when the script is executed
    createUI();
})();
