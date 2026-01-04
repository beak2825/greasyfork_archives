// ==UserScript==
// @name         Right-Click Dotted Outline
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  Adds a blue dotted outline around the element you right-click on, and updates the outline as you move the cursor while right-clicking
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510013/Right-Click%20Dotted%20Outline.user.js
// @updateURL https://update.greasyfork.org/scripts/510013/Right-Click%20Dotted%20Outline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRightClicking = false;
    let highlightedElement = null;

    document.addEventListener('mousedown', (event) => {
        if (event.button === 2) { // Right-click
            isRightClicking = true;
            highlightElement(event.target);

            document.addEventListener('mousemove', highlightOnHover);
            document.addEventListener('mouseup', stopRightClick);
        }
    });

    function highlightElement(element) {
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }

        element.style.outline = '2px dotted blue';
        highlightedElement = element;
    }

    function highlightOnHover(event) {
        if (isRightClicking) {
            highlightElement(event.target);
        }
    }

    function stopRightClick(event) {
        if (event.button === 2) { // Right-click
            isRightClicking = false;

            if (highlightedElement) {
                highlightedElement.style.outline = '';
            }

            document.removeEventListener('mousemove', highlightOnHover);
            document.removeEventListener('mouseup', stopRightClick);
        }
    }
})();