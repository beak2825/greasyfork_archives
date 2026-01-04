// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2
// ==UserScript==
// @name         Clear Torn LocalStorage
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to clear localStorage and refresh the page on torn.com
// @author       swrv [3069664]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504892/Clear%20Torn%20LocalStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/504892/Clear%20Torn%20LocalStorage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run in the top window
    if (window !== window.top) return;

    // Check if localStorage was just cleared
    if (sessionStorage.getItem('localStorageCleared')) {
        sessionStorage.removeItem('localStorageCleared');
        alert('localStorage has been cleared.');
    }

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Clear LocalStorage';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '2147483647';
    button.style.padding = '5px 10px';
    button.style.fontSize = '12px';
    button.style.backgroundColor = '#f0f0f0';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';

    // Add click event listener
    button.addEventListener('click', function() {
        localStorage.clear();
        sessionStorage.setItem('localStorageCleared', 'true');
        location.reload();
    });

    // Add the button to the page
    document.body.appendChild(button);
})();

