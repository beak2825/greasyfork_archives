// ==UserScript==
// @name         Torn Reload Panda
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a reload button with a panda icon to www.torn.com with customizable positioning and styling
// @author       YourName
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491009/Torn%20Reload%20Panda.user.js
// @updateURL https://update.greasyfork.org/scripts/491009/Torn%20Reload%20Panda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the reload button
    const reloadButton = document.createElement('div');
    reloadButton.innerHTML = '<img src="https://www.svgrepo.com/show/229200/panda.svg" width="40" height="40" style="border-radius: 60%; cursor: pointer;">';
    reloadButton.style.position = 'fixed'; // Positioning
    reloadButton.style.top = '30px'; // Adjust as needed
    reloadButton.style.left = '20px'; // Adjust as needed
    reloadButton.style.width = '40px'; // Size
    reloadButton.style.height = '40px'; // Size
    reloadButton.style.zIndex = '999999';
    reloadButton.style.backgroundColor = 'none'; // Background color
    reloadButton.style.display = 'flex'; // Flex display for centering
    reloadButton.style.justifyContent = 'center'; // Center content horizontally
    reloadButton.style.alignItems = 'center'; // Center content vertically
    reloadButton.onclick = function() {
        location.reload(); // Reload the page when clicked
    };

    // Append the reload button to the document body
    document.body.appendChild(reloadButton);
})();
