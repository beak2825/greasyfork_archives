// ==UserScript==
// @name        remove-element-shift+click
// @description a userscript that allows you to detect elements when you hover over them, highlight them, and remove them when you press Shift + Click. This script works on any webpage.
// @namespace   Violentmonkey Scripts
// @match       https://*/*
// @grant       none
// @version     1.0
// @author      maanimis
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527816/remove-element-shift%2Bclick.user.js
// @updateURL https://update.greasyfork.org/scripts/527816/remove-element-shift%2Bclick.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let hoveredElement = null;
    let originalOutline = '';

    const highlightElement = (element) => {
        if (hoveredElement) {
            resetElementStyle(hoveredElement);
        }
        hoveredElement = element;
        originalOutline = element.style.outline;
        element.style.outline = '2px solid red';
    };

    const resetElementStyle = (element) => {
        element.style.outline = originalOutline;
    };

    const handleMouseOver = (event) => {
        highlightElement(event.target);
    };

    const handleMouseOut = () => {
        if (hoveredElement) {
            resetElementStyle(hoveredElement);
        }
    };

    const handleClick = (event) => {
        if (event.shiftKey && hoveredElement) {
            event.preventDefault();
            hoveredElement.remove();
            hoveredElement = null;
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
})();
