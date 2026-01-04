// ==UserScript==
// @name         Autosave Form Inputs and Display Saved Entries
// @namespace    http://tampermonkey.net/
// @version      2024-08-13
// @description  Autosaves and displays entries from a single input field. Entries can be recovered or deleted. Dropdown only shows when clicking on the input field
// @author       Lawrence d'Aniello
// @match        https://example.com/* // Customize to match your target website
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503200/Autosave%20Form%20Inputs%20and%20Display%20Saved%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/503200/Autosave%20Form%20Inputs%20and%20Display%20Saved%20Entries.meta.js
// ==/UserScript==


(function() {
    'use strict';


    let inputField;
    let searchButton;
    let savedInputEntries = JSON.parse(localStorage.getItem('savedInputEntries1')) || [];


    function initScript() {
        
    // Example selectors - change these to match the specific site
    const inputField = document.querySelector('input[type="text"]'); // Change CSS selector to match your input field
    const searchButton = document.querySelector('button'); // Change CSS selector to match your search button


        if (!inputField || !searchButton) {
            setTimeout(initScript, 1000);
            return;
        }


        inputField.setAttribute('autocomplete', 'off');
        setupEventListeners();
    }


    function setupEventListeners() {
        inputField.addEventListener('focus', displaySavedInputEntries);
        document.addEventListener('click', handleClick);
        inputField.addEventListener('input', hideSavedInputEntries);
        if (searchButton) {
            searchButton.addEventListener('click', forceInputSave);
        }
        window.addEventListener('beforeunload', forceInputSave);
        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                forceInputSave();
            }
        });
    }


    function forceInputSave() {
        const currentValue = inputField.value.trim();
        if (currentValue && !savedInputEntries.includes(currentValue)) {
            savedInputEntries.unshift(currentValue);
            if (savedInputEntries.length > 15) {
                savedInputEntries.pop();
            }
            localStorage.setItem('savedInputEntries1', JSON.stringify(savedInputEntries));
        }
        hideSavedInputEntries();
    }


    function displaySavedInputEntries() {
        hideSavedInputEntries();


        const dropdown = document.createElement('ul');
        dropdown.id = 'savedInputEntriesDropdown1';
        dropdown.style.cssText = `
            list-style-type: none;
            padding: 5px;
            border: 1px solid #ccc;
            position: absolute;
            background-color: #fff;
            z-index: 1000;
            max-height: 150px;
            overflow-y: auto;
        `;


        const inputRect = inputField.getBoundingClientRect();
        dropdown.style.left = `${inputRect.left}px`;
        dropdown.style.top = `${inputRect.bottom + window.scrollY}px`;
        dropdown.style.width = `${inputRect.width}px`;


        savedInputEntries.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                padding: 5px;
                cursor: pointer;
                position: relative;
                transition: background-color 0.3s, color 0.3s;
            `;
            listItem.textContent = entry;


            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.style.cssText = `
                display: none;
                background: none;
                border: none;
                color: red;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            `;


            listItem.appendChild(deleteButton);


            listItem.addEventListener('mouseover', () => {
                listItem.style.backgroundColor = '#f0f0f0';
                listItem.style.color = '#333';
                deleteButton.style.display = 'inline';
            });


            listItem.addEventListener('mouseout', () => {
                listItem.style.backgroundColor = '#fff';
                listItem.style.color = '#000';
                deleteButton.style.display = 'none';
            });


            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteEntry(entry);
            });


            listItem.addEventListener('click', () => {
                inputField.value = entry;
                hideSavedInputEntries();
                inputField.focus();
            });


            dropdown.appendChild(listItem);
        });


        document.body.appendChild(dropdown);
    }


    function hideSavedInputEntries() {
        const existingDropdown = document.getElementById('savedInputEntriesDropdown1');
        if (existingDropdown) {
            existingDropdown.remove();
        }
    }


    function handleClick(event) {
        if (event.target !== inputField && !inputField.contains(event.target)) {
            hideSavedInputEntries();
        } else if (event.target === inputField) {
            displaySavedInputEntries();
        }
    }


    function deleteEntry(entryToDelete) {
        savedInputEntries = savedInputEntries.filter(entry => entry !== entryToDelete);
        localStorage.setItem('savedInputEntries1', JSON.stringify(savedInputEntries));
        displaySavedInputEntries();
    }


    initScript();
})();
