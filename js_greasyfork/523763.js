// ==UserScript==
// @name         PANIC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Combat Logging / Emergency button
// @author       Earth1283
// @match        https://www.mine-craft.io/*
// @grant        GM_addStyle
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/523763/PANIC.user.js
// @updateURL https://update.greasyfork.org/scripts/523763/PANIC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the panic button element
    var panicButton = document.createElement('button');
    panicButton.innerText = 'PANIC';

    // Apply some basic styles
    panicButton.style.position = 'fixed';
    panicButton.style.bottom = '20px';
    panicButton.style.right = '20px';
    panicButton.style.padding = '15px 30px';
    panicButton.style.fontSize = '18px';
    panicButton.style.backgroundColor = '#ff0000';
    panicButton.style.color = 'white';
    panicButton.style.border = 'none';
    panicButton.style.borderRadius = '10px';
    panicButton.style.cursor = 'pointer';
    panicButton.style.zIndex = '9999';
    panicButton.style.fontWeight = 'bold';
    panicButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

    // Add event listener to redirect when clicked
    panicButton.addEventListener('click', function() {
        window.location.href = 'https://www.mine-craft.io';
    });

    // Add the panic button to the body of the page
    document.body.appendChild(panicButton);
})();
