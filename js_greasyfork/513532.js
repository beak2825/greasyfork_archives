// ==UserScript==
// @name         Remove Readonly from Quantity Input
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the readonly attribute from the quantity input field on turkepinstore.com
// @author       ChatGPT
// @match        https://turkepinstore.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513532/Remove%20Readonly%20from%20Quantity%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/513532/Remove%20Readonly%20from%20Quantity%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run when the page has loaded
    window.addEventListener('load', function() {
        // Select the quantity input field by its attributes
        const quantityInput = document.querySelector('input[name="quantity"]');
        if (quantityInput) {
            // Remove the readonly attribute
            quantityInput.removeAttribute('readonly');
            console.log('Readonly attribute removed from quantity input');
        }
    });
})();