// ==UserScript==
// @name         Remove GeoCoin Count
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove The GeoCoin Count from under your profile
// @author       TheM1sty
// @match        https://www.geoguessr.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475408/Remove%20GeoCoin%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/475408/Remove%20GeoCoin%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified HTML element
    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Find the element with the specified class name and remove it
    const coinCountElement = document.querySelector('.coin-count_root__ADyUV');
    if (coinCountElement) {
        removeElement(coinCountElement);
    }
})();
