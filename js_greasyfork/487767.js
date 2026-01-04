// ==UserScript==
// @name         Infinite Craft Element Cheat
// @namespace    https://duckwithsunglasses.com
// @version      1.02
// @description  Adds a visual GUI for quickly editing your browser's local storage, allowing you to add whatever custom object you want.
// @author       You
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487767/Infinite%20Craft%20Element%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/487767/Infinite%20Craft%20Element%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script starting...");

    // Function to parse and stringify JSON data from/to local storage
    function getCraftData() {
        console.log("Fetching craft data...");
        return JSON.parse(localStorage.getItem('infinite-craft-data') || '{"elements":[]}');
    }

    function setCraftData(data) {
        console.log("Setting craft data...");
        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
    }

    // Function to add a new element to the data
    function addElement(text, emoji, discovered) {
        console.log("Adding new element...");
        var data = getCraftData();
        data.elements.push({ text: text, emoji: emoji, discovered: discovered });
        setCraftData(data);
    }

    // Function to create and append GUI elements
    function createGUI() {
        console.log("Creating GUI...");

        var container = document.createElement('div');
        container.innerHTML = `
            <style>
                #container {
                    padding-top: 50px;
                    padding-left: 10px;
                    position: absolute;
                }
            </style>
            <div id="container">
                <h2>Add New Element:</h2>
                <input type="text" id="element-text" placeholder="Element Name"><br>
                <input type="text" id="element-emoji" placeholder="Emoji"><br>
                <label for="element-discovered">New Discovery?:</label>
                <input type="checkbox" id="element-discovered"><br>
                <button id="add-element-btn">Add Element</button>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listener to the "Add Element" button
        document.getElementById('add-element-btn').addEventListener('click', function() {
            console.log("Add Element button clicked...");
            var text = document.getElementById('element-text').value.trim();
            var emoji = document.getElementById('element-emoji').value.trim();
            var discovered = document.getElementById('element-discovered').checked;

            if (text && emoji) {
                console.log("Element name and emoji entered...");
                addElement(text, emoji, discovered);
                console.log("Reloading page...");
                // Reload the page to reflect changes
                window.location.reload();
            } else {
                console.error('Please enter both element name and emoji.');
                alert('Please enter both element name and emoji.');
            }
        });
    }

    // Call the function to create the GUI when the page is loaded
    console.log("Waiting for page to load...");
    // Set a timeout to ensure the script doesn't get stuck indefinitely
    var timeout = setTimeout(function() {
        console.error("Page load timeout. Proceeding anyway...");
        createGUI();

            // remove search cus god damn autosnap is annoying
    var sidebarInput = document.querySelector('.sidebar-input');
    if (sidebarInput) {
        sidebarInput.remove();
    } else {
        console.log('Element with class "sidebar-input" not found.');
    }
    }, 1000); // 5 seconds timeout

    window.addEventListener('load', function() {
        clearTimeout(timeout); // Cancel the timeout if the page loads successfully
        createGUI();

            var sidebarInput = document.querySelector('.sidebar-input');
    if (sidebarInput) {
        sidebarInput.remove();
    } else {
        console.log('Element with class "sidebar-input" not found.');
    }
    });

})();