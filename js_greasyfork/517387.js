// ==UserScript==
// @name         GC Arrow Key Next/ Previous page navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Shiba
// @description  Navigate to next/previous pages with arrow keys
// @match        https://www.grundos.cafe/market/*
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/market/browseshop/?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517387/GC%20Arrow%20Key%20Next%20Previous%20page%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/517387/GC%20Arrow%20Key%20Next%20Previous%20page%20navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 39) {
            const nextLink = Array.from(document.querySelectorAll("a")).find(a => a.textContent.includes("Next"));
            if (nextLink) {
                nextLink.click();
            }
        }

        if (event.keyCode === 37) {
            const prevLink = Array.from(document.querySelectorAll("a")).find(a => a.textContent.includes("Previous"));
            if (prevLink) {
                prevLink.click();
            }
        }
    });
})();
