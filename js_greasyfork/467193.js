// ==UserScript==
// @name         ABCya Mod Bar
// @description  Adds a mod bar with various modes to ABCya website
// @match        https://www.abcya.com/*
// @version 0.0.1.20230527020350
// @namespace https://greasyfork.org/users/1085312
// @downloadURL https://update.greasyfork.org/scripts/467193/ABCya%20Mod%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/467193/ABCya%20Mod%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a mod bar container
    const modBar = document.createElement('div');
    modBar.id = 'modBar';
    document.body.appendChild(modBar);

    // Create buttons for each mode
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Debug Mode';
    modBar.appendChild(debugButton);

    const errorButton = document.createElement('button');
    errorButton.textContent = 'Error Mode';
    modBar.appendChild(errorButton);

    const outputButton = document.createElement('button');
    outputButton.textContent = 'Output Mode';
    modBar.appendChild(outputButton);

    const scriptButton = document.createElement('button');
    scriptButton.textContent = 'Script Mode';
    modBar.appendChild(scriptButton);

    const syncButton = document.createElement('button');
    syncButton.textContent = 'Sync Mode';
    modBar.appendChild(syncButton);

    // Event listeners for each mode button
    debugButton.addEventListener('click', function() {
        // Enable debug mode logic
        // Add your code here for enabling debug mode
    });

    errorButton.addEventListener('click', function() {
        // Enable error mode logic
        // Add your code here for enabling error mode
    });

    outputButton.addEventListener('click', function() {
        // Enable output mode logic
        // Add your code here for enabling output mode
    });

    scriptButton.addEventListener('click', function() {
        // Enable script mode logic
        // Add your code here for enabling script mode
    });

    syncButton.addEventListener('click', function() {
        // Enable sync mode logic
        // Add your code here for enabling sync mode
    });

})();
