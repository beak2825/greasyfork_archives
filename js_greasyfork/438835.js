// ==UserScript==
// @name         Investing Adblock Popup remover
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Remove ad popup
// @author       DarioGabriel
// @match        *investing.com*
// @include      *investing.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438835/Investing%20Adblock%20Popup%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/438835/Investing%20Adblock%20Popup%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {

        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(selector, callback), 100); // Check every 100ms
            }
        }

        function getDivsByClassRegex(regex) {
            const allDivs = document.querySelectorAll('div');
            const matchingDivs = [];

            allDivs.forEach(div => {
                const classList = div.className; // Get the full string of class names
                if (regex.test(classList)) {
                    matchingDivs.push(div);
                }
            });

            return matchingDivs;
        }

        // Example usage:
        // Create a regex to match class names containing "special" or starting with "my-"
        const myRegex = /^[a-z0-9]{5,6}$/;
        const filteredDivs = getDivsByClassRegex(myRegex);

        console.log(filteredDivs); // This will output a NodeList of div elements that match the regex

        filteredDivs.forEach(divElement => {
            if (divElement.className != "hidden") {
                divElement.remove();
            }
        });
    }
})();