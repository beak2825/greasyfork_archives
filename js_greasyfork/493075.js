// ==UserScript==
// @name         Махане на коли с цена по договаряне
// @namespace    http://tampermonkey.net/
// @version      2024-04-20
// @description  Махане на коли с цена по договаряне от cars.bg
// @author       You
// @match        https://www.cars.bg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cars.bg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493075/%D0%9C%D0%B0%D1%85%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D0%BA%D0%BE%D0%BB%D0%B8%20%D1%81%20%D1%86%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%BE%20%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D0%B0%D1%80%D1%8F%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/493075/%D0%9C%D0%B0%D1%85%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D0%BA%D0%BE%D0%BB%D0%B8%20%D1%81%20%D1%86%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%BE%20%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D0%B0%D1%80%D1%8F%D0%BD%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and remove elements
    function checkAndRemove(element) {
        let priceElement = element.querySelector('h6.price');
        if (priceElement && priceElement.textContent.includes('цена по договаряне')) {
            element.remove();
        }
    }

    // Set up a periodic check every 3 seconds
    setInterval(() => {
        let elements = document.querySelectorAll('[data-item]');
        elements.forEach(checkAndRemove);
    }, 1000);

})();