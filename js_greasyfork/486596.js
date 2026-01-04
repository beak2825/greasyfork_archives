// ==UserScript==
// @name         Google Docs blend webapp window decoration/theme color with header
// @namespace    https://greasyfork.org/users/1257389
// @version      1.0.00
// @description  Set theme color based on Google Docs header's background color
// @author       dvirzxc
// @match        https://docs.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486596/Google%20Docs%20blend%20webapp%20window%20decorationtheme%20color%20with%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/486596/Google%20Docs%20blend%20webapp%20window%20decorationtheme%20color%20with%20header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getBackgroundColor() {
        const selector = '[class*=docs-grille-]';
        const elementClass = document.querySelector(selector);
        if (elementClass) {
            const element = elementClass.querySelector('#docs-chrome:not(.docs-hub-chrome)');
            if (element) {
                const style = window.getComputedStyle(element);
                return style.backgroundColor;
            }
        }
        return '#ffffff'; // Return white when there's no selector to be found
    }

    // Function to set the meta tag
    function setChromeThemeColor(color) {
        const metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        metaThemeColor.setAttribute('content', color);
        document.head.appendChild(metaThemeColor);
    }

    // Run
    const backgroundColor = getBackgroundColor();
    setChromeThemeColor(backgroundColor);
})();
