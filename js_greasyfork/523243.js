// ==UserScript==
// @name         Toggle Red Outline for All Elements
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a 1px red outline to all elements on the page with a keyboard shortcut to toggle it on/off.
// @author       Drewby123
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523243/Toggle%20Red%20Outline%20for%20All%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/523243/Toggle%20Red%20Outline%20for%20All%20Elements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isOutlineEnabled = false; // Track the state of the outline
    const style = document.createElement('style');
    style.id = 'red-outline-style';
    style.innerHTML = `
        * {
            outline: 1px solid red !important;
        }
    `;

    // Function to toggle the outline
    const toggleOutline = () => {
        isOutlineEnabled = !isOutlineEnabled;
        if (isOutlineEnabled) {
            document.head.appendChild(style);
        } else {
            const existingStyle = document.getElementById('red-outline-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
    };

    // Add a keyboard shortcut (Ctrl+Shift+O)
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'i') {
            toggleOutline();
        }
    });
})();
