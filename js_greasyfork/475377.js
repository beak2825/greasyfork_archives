// ==UserScript==
// @name         Landiannews Auto Dark Mode
// @namespace    https://greasyfork.org/zh-CN/users/737511
// @version      1.0
// @description  Enable dark mode on landiannews.com
// @author       Bush2021
// @match        https://www.landiannews.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475377/Landiannews%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/475377/Landiannews%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Check for the presence of the page element body.theme-light
    const lightModeBody = document.querySelector('body.theme-light');
    if (lightModeBody) {
        // Replace with body.theme-dark
        lightModeBody.classList.remove('theme-light');
        lightModeBody.classList.add('theme-dark');
        // Change the background color to black
        lightModeBody.style.backgroundColor = '#000E1E';
    }
})();
