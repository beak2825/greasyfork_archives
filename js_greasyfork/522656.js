// ==UserScript==
// @name         Zerodha Kite. Hide Left watchlist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Toggle the left container on Kite Zerodha's Holdings page with a button.
// @author       Nilesh Agarwal <NileshAgarwal10@gmail.com>
// @match        https://kite.zerodha.com/holdings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522656/Zerodha%20Kite%20Hide%20Left%20watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/522656/Zerodha%20Kite%20Hide%20Left%20watchlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'toggle-left-container';
        button.textContent = 'Toggle Left Panel';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.zIndex = '1000';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        // Add click event to toggle the visibility of the container-left
        button.addEventListener('click', function() {
            const containerLeft = document.querySelector('.container-left');
            if (containerLeft) {
                if (containerLeft.style.display === 'none') {
                    containerLeft.style.display = 'block';
                } else {
                    containerLeft.style.display = 'none';
                }
            }
        });
    }

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        const containerLeft = document.querySelector('.container-left');
        if (containerLeft) {
            // Initially hide the container-left
            containerLeft.style.display = 'none';
        }

        // Create the toggle button
        createToggleButton();
    });
})();
