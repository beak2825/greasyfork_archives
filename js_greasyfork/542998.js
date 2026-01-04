// ==UserScript==
// @name         Hexadecimal Decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Decodes selected hexadecimal text and shows an alert with the decoded text
// @author       enDoctore
// @license      CC BY 4.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542998/Hexadecimal%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/542998/Hexadecimal%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable to store the selected hexadecimal text
    let selectedHex = '';

    // Listen for the context menu event
    document.addEventListener('contextmenu', function(event) {
        // Get the selected text
        selectedHex = window.getSelection().toString().trim();

        // Check if the selected text is hexadecimal
        if (isHexadecimal(selectedHex)) {
            // Create a custom context menu item
            const menuItem = document.createElement('div');
            menuItem.innerText = 'Decode Hexadecimal';
            menuItem.style.position = 'absolute';
            menuItem.style.backgroundColor = '#fff';
            menuItem.style.border = '1px solid #ccc';
            menuItem.style.padding = '5px';
            menuItem.style.zIndex = '1000';
            document.body.appendChild(menuItem);

            // Position the menu item
            menuItem.style.left = `${event.pageX}px`;
            menuItem.style.top = `${event.pageY}px`;

            // Add click event to the menu item
            menuItem.addEventListener('click', function() {
                const decodedText = hexToString(selectedHex);
                alert(`${decodedText}`);
                menuItem.remove(); // Remove the menu item after use
            });

            // Remove the menu item when clicking elsewhere
            document.addEventListener('click', function() {
                menuItem.remove();
            }, { once: true });
        }
    });

    function isHexadecimal(str) {
        return /^[0-9A-Fa-f]+$/.test(str);
    }

    function hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }
})();