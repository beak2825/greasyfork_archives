// ==UserScript==
// @name         Remove lenta.ru banner
// @namespace    https://lenta.ru/
// @version      0.2
// @description  Remove big top banner on header
// @author       You
// @match        *://*.lenta.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lenta.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485335/Remove%20lentaru%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/485335/Remove%20lentaru%20banner.meta.js
// ==/UserScript==

(function() {
  'use strict';
    // Define the array of classes to check
    const CLASSES = ['layout__header-ghost', 'js-layout-header', 'js-site-container', 'layout__footer-ghost', 'layout__footer'];

    // Get all the child elements of the layout__container class
    let elements = document.querySelectorAll('.layout__container > *');

    // Loop through the elements
    for (let i = 0; i < elements.length; i++) {
        // Get the element's class list
        let classList = elements[i].classList;

        // Check if the element has any of the classes in the array
        let hasClass = false;
        for (let j = 0; j < CLASSES.length; j++) {
            if (classList.contains(CLASSES[j])) {
                hasClass = true;
                break;
            }
        }

        // If the element does not have any of the classes, remove it from the DOM
        if (!hasClass) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }

})();