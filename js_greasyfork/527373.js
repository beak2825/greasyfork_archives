// ==UserScript==
// @name         Nova Hill Off-white (Based on Nova Hill Flashbang)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change all text on Nova Hill to Montserrat Bold and apply a non-blinding off-white theme that repairs your vision slowly.
// @author       fajay, modified by christmaswreath
// @match        https://nova-hill.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/527373/Nova%20Hill%20Off-white%20%28Based%20on%20Nova%20Hill%20Flashbang%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527373/Nova%20Hill%20Off-white%20%28Based%20on%20Nova%20Hill%20Flashbang%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.body.style.fontFamily = 'Montserrat, sans-serif';
    document.body.style.fontWeight = 'bold';
    document.body.style.backgroundColor = '#f0f0f0';
    document.body.style.color = '#000000';

    // Define classes to exclude
    const excludeClasses = [
        'bucks-icon', 'bits-icon', 'messages-icon', 'friends-icon',
        'candy-icon', 'special-e-icon', 'special-icon', 'arrow-down',
        'svgsprite',  'warning'
    ];

    let elements = document.querySelectorAll('*');
    elements.forEach(el => {
        // Check if element has any of the excluded classes
        const hasExcludedClass = excludeClasses.some(className =>
            el.classList.contains(className)
        );

        // Only apply background color if not an excluded class
        if (!hasExcludedClass) {
            el.style.backgroundColor = '#f0f0f0';
        }

        el.style.color = '#000000';
        el.style.fontFamily = 'Montserrat, sans-serif';
        el.style.fontWeight = 'bold';
    });

    // Create and inject CSS for making icons black
    const style = document.createElement('style');
    style.textContent = `
        .bucks-icon, .bits-icon, .messages-icon, .friends-icon,
        .candy-icon, .special-e-icon, .special-icon, .arrow-down {
            background-color: transparent !important;
            filter: brightness(0) !important;
        }
    `;
    document.head.appendChild(style);
})();