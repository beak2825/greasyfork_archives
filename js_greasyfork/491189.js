// ==UserScript==
// @name         Phitron Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Convert white backgrounds to dark mode and black text to a different color on Phitron.io
// @author       Your Name
// @match        https://phitron.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491189/Phitron%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/491189/Phitron%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceColors() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const bgColor = window.getComputedStyle(element).backgroundColor;
            if (bgColor && bgColor.toLowerCase() === 'rgb(255, 255, 255)') {
                element.style.backgroundColor = '#212121';
            }

            const textColor = window.getComputedStyle(element).color;
            if (textColor && (isBlackish(textColor) || textColor.toLowerCase() === 'rgb(56, 56, 46)')) {
                element.style.color = '#2E95D3';
            }
        });
    }

    function isBlackish(color) {
        const [r, g, b] = color.match(/\d+/g).map(Number);
        return r < 50 && g < 50 && b < 50;
    }

    // Replace white background color and invert black text color
    replaceColors();

    // Observe DOM changes and apply changes dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            replaceColors();
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });
})();
