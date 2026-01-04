// ==UserScript==
// @name         Neopets Pound Pet Logger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Logs pet names seen in the Neopian Pound
// @author       Moxsee
// @match        https://www.neopets.com/pound/adopt.phtml
// @icon         https://www.google.com/s2/favicons?domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510339/Neopets%20Pound%20Pet%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/510339/Neopets%20Pound%20Pet%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a sidebar to display logged names
    const sidebar = document.createElement('div');
    sidebar.style.position = 'fixed';
    sidebar.style.top = '10px';
    sidebar.style.right = '10px';
    sidebar.style.width = '250px'; // Increased width
    sidebar.style.height = '300px'; // Increased height
    sidebar.style.padding = '10px';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.border = '1px solid #ccc';
    sidebar.style.zIndex = '1000';
    sidebar.style.overflowY = 'auto'; // Allow vertical scrolling
    sidebar.innerHTML = `<h2>Logged Pet Names</h2><ul id="petNameList"></ul><button id="clearLog">Clear Log</button>`;
    document.body.appendChild(sidebar);

    // Function to load saved pet names from local storage
    function loadPetNames() {
        const petNames = JSON.parse(localStorage.getItem('neopetsPetNames')) || [];
        const petNameList = document.getElementById('petNameList');
        petNameList.innerHTML = ''; // Clear the current list
        petNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            petNameList.appendChild(li); // Append pet names at the bottom
        });
    }

    // Function to log pet names
    function logPetNames() {
        const petElements = document.querySelectorAll('[id^=pet][id$=_name]');
        const petNames = JSON.parse(localStorage.getItem('neopetsPetNames')) || [];
        
        petElements.forEach(petElement => {
            const petName = petElement.textContent.trim();
            if (!petNames.includes(petName)) {
                petNames.push(petName); // Add new name to the array
                localStorage.setItem('neopetsPetNames', JSON.stringify(petNames));
                
                // Create a new list item and insert it at the top
                const petNameList = document.getElementById('petNameList');
                const li = document.createElement('li');
                li.textContent = petName;
                petNameList.insertBefore(li, petNameList.firstChild); // Insert new entry at the top
            }
        });
    }

    // Event listener for the clear log button
    document.getElementById('clearLog').addEventListener('click', () => {
        localStorage.removeItem('neopetsPetNames');
        loadPetNames(); // Refresh the list
    });

    // Load existing pet names when the script runs
    loadPetNames();
    
    // Check for new pet names every 1 second
    setInterval(logPetNames, 1000);
})();