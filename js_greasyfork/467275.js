// ==UserScript==
// @name         Pardus Speed Hacker
// @namespace    fear.math@gmail.com
// @version      2.0.1
// @description  Automatically fills in usernames while hacking in Pardus
// @author       Math and ChatGPT and Wes
// @match        http*://*.pardus.at/hack.php
// @match        http*://*.pardus.at/alliance.php?id=*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467275/Pardus%20Speed%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/467275/Pardus%20Speed%20Hacker.meta.js
// ==/UserScript==

//2.0.1 has allowed to use this script across multiple universes
//2.0 has added functionality to add specific faction members from an alliance to the prepped list
 
(function() {
    'use strict';
 
    // Function for the Alliance page
    function alliancePageFunction() {
 
        var insertLocation = document.getElementsByTagName('table');
        var table = insertLocation[insertLocation.length-1];
 
        function addMembersToLocalStorage(colorMatch) {
 
            const storedMembers = localStorage.getItem(identifyLocalStorage());
 
            let members = [];
 
            if (storedMembers) {
                try {
                    members = JSON.parse(storedMembers);
                } catch (error) {
                    console.error('Error parsing stored names:', error);
                }
            }
 
            for (var x = 0; x < table.rows.length-2; x++){
 
                var rows = table.rows[x].getElementsByTagName("font");
 
                for (var i = 0; i < rows.length; i++) {
 
                    var name = rows[i].innerText;
                    var color = rows[i].getAttribute("color");
 
                    if (color == colorMatch) {
                        members.push(name);
                    }
 
                }
            }
 
 
            localStorage.setItem(identifyLocalStorage(), JSON.stringify(members));
        }
 
        // Create and append the button to the page
        var tableRow = document.createElement("tr");
        var tableData = document.createElement("td");
        tableData.colSpan = "6";
        tableData.align = "center";
 
        var buttonF = document.createElement("button");
        var buttonE = document.createElement("button");
        var buttonU = document.createElement("button");
 
        buttonF.innerHTML = "Add Federation";
        buttonF.addEventListener("click", function(){addMembersToLocalStorage("#4f97ce")});
        tableData.appendChild(buttonF);
 
        buttonE.innerHTML = "Add Empire";
        buttonE.addEventListener("click", function(){addMembersToLocalStorage("#d21414")});
        tableData.appendChild(buttonE);
 
        buttonU.innerHTML = "Add Union";
        buttonU.addEventListener("click", function(){addMembersToLocalStorage("#caca34")});
        tableData.appendChild(buttonU);
 
 
        // Insert the button
        tableRow.appendChild(tableData);
        insertLocation[insertLocation.length-1].appendChild(tableRow);
    }
 
    // Function for the Hack page
    function hackPageFunction() {
 
    // Create a text field for the user to enter the list of names
    const namesField = document.createElement('textarea');
    namesField.style.display = 'block';
    namesField.style.width = '300px';
    namesField.style.height = '200px';
    namesField.placeholder = 'Enter names, one per line or separated by tabs\n\nThen press "H" repeatedly to hack everyone on the list';
 
    // Find the table with a style that contains "bgd.gif"
    const targetTable = document.querySelector('table[style*="bgd.gif"]');
 
    // Insert the names field before the target table
    targetTable.parentNode.insertBefore(namesField, targetTable);
 
    // Retrieve stored usernames from localStorage
    const storedUsernames = localStorage.getItem(identifyLocalStorage());
    let usernames = [];
 
    if (storedUsernames) {
        try {
            usernames = JSON.parse(storedUsernames);
        } catch (error) {
            console.error('Error parsing stored usernames:', error);
        }
    }
 
    // Function to check if a font element with size "+1" containing the name exists on the page
    function hasMatchingNameOnPage(name) {
        const fontElements = document.querySelectorAll('font[size="+1"]');
        for (const fontElement of fontElements) {
            if (fontElement.textContent.toLowerCase() === name.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
 
    // Remove the top name from the list if a matching font element is found on page load
    if (usernames.length > 0) {
        const topName = usernames[0];
        if (hasMatchingNameOnPage(topName)) {
            usernames.shift();
        }
    }
 
    // Prepopulate the names field
    namesField.value = usernames.join('\n');
 
    // Store the updated list in localStorage
    localStorage.setItem(identifyLocalStorage(), JSON.stringify(usernames));
 
    // Function to handle key presses
    function handleKeyPress(event) {
        // Don't do anything if the key is being held down
        if (event.repeat) {
            return;
        }
 
        const tagName = event.target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
            return; // Skip key press handling when the target is a text field
        }
 
        if (event.key === 'h' || event.key === 'H') {
            event.preventDefault();
 
            // Split the entered names into an array
            const enteredNames = namesField.value.trim().split(/[\n\t]+/);
 
            // Ignore empty lines and trim whitespace from each name
            const usernames = enteredNames.filter(name => name.trim() !== '').map(name => name.trim());
 
            if (usernames.length === 0) {
                console.log('No usernames entered.');
                return;
            }
 
            // Get the username dropdown field by name attribute
            const usernameDropdown = document.querySelector('input[name="lookup_name"]');
            const selectedUsername = document.querySelector('select[name="player"] option:checked')?.textContent || '';
 
            if (usernames.length > 0) {
                // Get the first name from the array
                const firstName = usernames[0].toLowerCase();
 
                // Check if the first name matches the dropdown value and the selected name
                if (firstName === usernameDropdown.value.toLowerCase() &&
                    firstName === selectedUsername.toLowerCase()) {
                    // Click the "doHackButton" if the name matches
                    const hackButton = document.querySelector('#doHackButton');
                    hackButton.click();
                } else {
                    // If the first name wasn't found, remove it so we don't try it again
                    if (firstName === usernameDropdown.value.toLowerCase()) {
                        usernames.shift();
 
                        // Update the names field
                        namesField.value = usernames.join('\n');
 
                        localStorage.setItem(identifyLocalStorage(), JSON.stringify(usernames));
                    }
 
                    // Set the value of the dropdown field to the first name in the array
                    usernameDropdown.value = usernames[0];
 
                    // Get the form containing the lookup field and click the lookup button
                    const form = usernameDropdown.closest('form');
                    const button = form.querySelector('button');
                    button.click();
                }
            }
        }
    }
 
    // Add event listener for key presses
    document.addEventListener('keydown', handleKeyPress);
 
    // Function to handle changes in the names field
    function handleNamesFieldChange() {
        const enteredNames = namesField.value.trim().split(/[\n\t]+/);
        const usernames = enteredNames.filter(name => name.trim() !== '').map(name => name.trim());
        localStorage.setItem(identifyLocalStorage(), JSON.stringify(usernames));
    }
 
    // Add event listener for changes in the names field
    namesField.addEventListener('input', handleNamesFieldChange);
    }
 
    // Get the current page URL
    var currentPage = window.location.href;
 
    // Check the current page and execute the corresponding function
    if (currentPage.includes('alliance.php?id=')) {
        alliancePageFunction();
    } else if (currentPage.includes('hack.php')) {
        hackPageFunction();
    } else {
        console.log('Unknown page');
    }

     function identifyLocalStorage() {
        const url = window.location.href;
        if (url.includes('artemis.pardus.at')) {
            return 'ArtemisUsernames';
        } else if (url.includes('orion.pardus.at')) {
            return 'OrionUsernames';
        } else if (url.includes('pegasus.pardus.at')) {
            return 'PegasusUsernames';
        } else {
            return;
        }
    }
 
})();