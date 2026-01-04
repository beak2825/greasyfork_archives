// ==UserScript==
// @name         [KPX] Sulane Kaevanduse Auto-Clicker
// @namespace    https://www.sulane.net/
// @version      0.1
// @description  Automatically clicks active buttons on the Sulane page
// @author       KPCX
// @match        https://www.sulane.net/avaleht.php?asukoht=erikaevandusq5
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sulane.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500730/%5BKPX%5D%20Sulane%20Kaevanduse%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/500730/%5BKPX%5D%20Sulane%20Kaevanduse%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click on an element
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element && !element.disabled) {
            element.click();
        }
    }

    // Click the buttons when they are active
    setInterval(() => {
        clickElement('#kaeva'); // Click "Kaeva" button
        clickElement('#tala'); // Click "Lisa tala" button
        clickElement('#torvik'); // Click "Lisa tõrvik" button
    }, 10); // Adjust the interval as needed
})();
