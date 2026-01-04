// ==UserScript==
// @name         Hostinger Domain Filter
// @version      0.1
// @description  filter domains by price
// @author       TMBMode
// @match        https://hpanel.hostinger.com/domains/domain-checker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hostinger.com
// @grant        none
// @namespace https://greasyfork.org/users/1039237
// @downloadURL https://update.greasyfork.org/scripts/468543/Hostinger%20Domain%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/468543/Hostinger%20Domain%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitFor(query, callback, interval=200) {
        let trigger = null,
            loop = setInterval(() => {
            trigger = document.querySelector(query);
            if (trigger) {
                clearInterval(loop);
                callback();
            }
        }, interval);
    }
    waitFor('#results-top-mark', () => {
        document.getElementById('results-top-mark').parentNode.oncontextmenu = () => {
            const priceNodes = document.querySelectorAll('h1.h-m-0');
            if (priceNodes.length === 0) {
                alert("there aren't any prices shown");
                return false
            }
            let maxPrice = NaN;
            while(isNaN(maxPrice)) {
                maxPrice = parseFloat(prompt('price limit (dollars):'));
            }
            priceNodes.forEach((el) => {
                if (parseFloat(el.textContent.replace('$','')) > maxPrice) {
                    el.parentNode.parentNode.parentNode.style.display = 'none';
                }
            });
            return false;
        }
    });
})();