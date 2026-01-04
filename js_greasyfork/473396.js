// ==UserScript==
// @name         Dark/Light Mode Toggle
// @namespace    http://your.namespace.com
// @version      1.2
// @description  Toggle between dark and light mode on any website
// @author       Your Name
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473396/DarkLight%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/473396/DarkLight%20Mode%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dark/Light Mode';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    document.body.appendChild(toggleButton);

    let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    setMode(darkModeEnabled);

    toggleButton.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled;
        setMode(darkModeEnabled);
        localStorage.setItem('darkModeEnabled', darkModeEnabled);
    });

    function setMode(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.style.backgroundColor = '#1a1a1a';
            document.documentElement.style.color = '#ffffff';
        } else {
            document.documentElement.style.backgroundColor = '#ffffff';
            document.documentElement.style.color = '#000000';
        }
    }
})();
