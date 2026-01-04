// ==UserScript==
// @name         MPP Neon-ify
// @namespace    https://github.com/Kirogii
// @version      0.1
// @description  Makes some text neon ie (Chat),(Title),(Notification Box Text)
// @author       Kirogii
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
 
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533754/MPP%20Neon-ify.user.js
// @updateURL https://update.greasyfork.org/scripts/533754/MPP%20Neon-ify.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- Configuration ---
    const neonColor = 'cyan'; // Change the neon color here
    const elementSelectors = [
        'bg',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'button',
        '.neon-text', // Add a class to any element to apply the effect
        '#chat input',
        '#chat ul li .name',
        '#chat ul li .message',
        '.ugly-button',
        '#room-notice',
        '#volume-label',
        '#status',
        '#getcrown-btn',
        '#vanish-btn',
        '#lang-btn',
        '#client-settings-btn',
        '#room-settings-btn',
        '#clearchat-btn',
        '#account-btn',
        '.client-settings-button',
        '#piano' // Apply to the piano element
        // Add more selectors as needed
    ];
 
    // --- CSS Injection ---
    const css = `
        ${elementSelectors.join(', ')} {
            text-shadow: 0 0 5px ${neonColor}, 0 0 10px ${neonColor}, 0 0 20px ${neonColor};
            color: ${neonColor};
        }
    `;
 
    GM_addStyle(css);
 
})();