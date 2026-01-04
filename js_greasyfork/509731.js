// ==UserScript==
// @name         Ping  mod
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Displays ping on moomoo.io, ensuring pingDisplay appears on screen
// @author       Guilherme
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509731/Ping%20%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/509731/Ping%20%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the "hidden" and ensure the pingDisplay is displayed
    function showPing() {
        let pingElement = document.getElementById('pingDisplay');

        if (pingElement) {
            // Remove any styling that may be hiding the element
            pingElement.removeAttribute('hidden');  // Remove "hidden"
            pingElement.style.display = 'block';    // Make sure it is visible
            pingElement.style.visibility = 'visible'; // Force visibility
            pingElement.style.opacity = '1';        // Make sure it's not invisible

            // Define visual styles
            pingElement.style.position = 'absolute';
            pingElement.style.top = '10px';
            pingElement.style.left = '10px';
            pingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            pingElement.style.color = 'white';
            pingElement.style.padding = '5px';
            pingElement.style.borderRadius = '5px';
            pingElement.style.zIndex = '9999';      // Ensures it is above other elements
            pingElement.style.fontSize = '16px';    // Set the font size
            pingElement.style.fontFamily = 'Arial, sans-serif'; // Clean font
            pingElement.style.width = 'auto';       //Adjusts the width to the content
            pingElement.style.textAlign = 'center'; // Center the text

            console.log('Ping exibido corretamente!');
        } else {
            console.log('Elemento de ping não encontrado.');
        }
    }

    // Checks and displays ping immediately after page load
    window.onload = function() {
        showPing();
    };
})();