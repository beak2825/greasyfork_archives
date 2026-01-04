// ==UserScript==
// @name         Dark Mode Simulator
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Simulate dark mode by adjusting color contrast on any website
// @author       Your Name
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473399/Dark%20Mode%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/473399/Dark%20Mode%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🌙 Simulate Dark Mode';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.padding = '10px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = 'transparent';
    toggleButton.style.color = 'var(--text-color)';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(toggleButton);

    let darkModeSimulated = localStorage.getItem('darkModeSimulated') === 'true';
    setSimulatedMode(darkModeSimulated);

    toggleButton.addEventListener('click', () => {
        darkModeSimulated = !darkModeSimulated;
        setSimulatedMode(darkModeSimulated);
        localStorage.setItem('darkModeSimulated', darkModeSimulated);
    });

    function setSimulatedMode(isDarkModeSimulated) {
        if (isDarkModeSimulated) {
            // Adjust color contrast, background, and other properties to simulate dark mode
            document.documentElement.style.filter = 'invert(100%)';
            document.documentElement.style.backgroundColor = '#1a1a1a';
            document.documentElement.style.color = '#ffffff';
            toggleButton.textContent = '☀️ Simulate Light Mode';
        } else {
            // Reset properties to simulate light mode
            document.documentElement.style.filter = 'invert(0%)';
            document.documentElement.style.backgroundColor = '#ffffff';
            document.documentElement.style.color = '#000000';
            toggleButton.textContent = '🌙 Simulate Dark Mode';
        }
    }
})();
