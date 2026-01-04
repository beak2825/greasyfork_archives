// ==UserScript==
// @name         Heav.io Menu Blocker
// @namespace    http://tampermonkey.net/
// @version      Extraman
// @description  Blocks the menu button in Heav.io with a circle.
// @author       Studz
// @match        https://heav.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476517/Heavio%20Menu%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/476517/Heavio%20Menu%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a circle div element
    const circle = document.createElement('div');
    circle.style.width = '50px';
    circle.style.height = '50px';
    circle.style.background = 'red';
    circle.style.borderRadius = '50%';
    circle.style.position = 'absolute';
    circle.style.top = '10px';
    circle.style.left = '10px';
    circle.style.zIndex = '9999';
    circle.style.pointerEvents = 'none'; // Make it non-clickable

    // Append the circle to the body
    document.body.appendChild(circle);

    // Function to block the menu button
    function blockMenu() {
        const menuButton = document.querySelector('.menu-button'); // Adjust the selector as needed
        if (menuButton) {
            menuButton.style.display = 'none'; // Hide the menu button
        }
    }

    // Call the blockMenu function
    blockMenu();
})();
