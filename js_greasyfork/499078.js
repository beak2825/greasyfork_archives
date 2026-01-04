// ==UserScript==
// @name         Rutracker Movies Form
// @namespace    https://rutracker.org/forum/tracker.php?type=movies
// @version      2024-06-27
// @license      MIT
// @description  Simplifies Rutracker search form for movies
// @author       You
// @match        *://rutracker.org/forum/tracker.php?type=movies*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499078/Rutracker%20Movies%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/499078/Rutracker%20Movies%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeElementById(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.remove();
        } else {
            console.warn(`Element with ID '${elementId}' not found.`);
        }
    }

    for (const id of ['logo', 'main-nav', 'tr-form', 'page_header']) {
        removeElementById(id);
    }

    // Function to get the value of a specific query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to create and append an input field to the top of the page
    function appendInputField() {
        // Get the 'nm' parameter from the URL
        const nmValue = getQueryParam('nm');

        // Create a new input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.style.width = '800px';
        inputField.style.fontSize = '16px';
        inputField.value = nmValue;
        inputField.id = 'searchInput';

        // Add event listener for Enter key
        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                // Prevent default form submission
                event.preventDefault();
                // Get the value from the input field
                const newValue = inputField.value;
                // Redirect to the new URL
                window.location.href = `https://rutracker.org/forum/tracker.php?type=movies&nm=${encodeURIComponent(newValue)}&o=10`;
            }
        });

        // Create a container for the input field
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.width = '100%';
        container.style.backgroundColor = 'white';
        container.style.zIndex = '1000'; // Ensure it stays on top
        container.style.padding = '10px';
        container.appendChild(inputField);

        // Append the container to the body
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Call the function to append the input field
    appendInputField();

    if (getQueryParam('nm') == null) {
        setTimeout(() => {
            const input = document.getElementById('searchInput');
            input.focus();
        }, 500);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === '`' || event.key === 'ё') {
            event.preventDefault();
            const input = document.getElementById('searchInput');
            input.focus();
            input.select();
        }
    });

})();
