// ==UserScript==
// @name         Add marketplace button
// @namespace    http://tampermonkey.net/
// @version      2025-05-08
// @description  Replaces inventory button with yard button
// @author       Disk217
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535404/Add%20marketplace%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/535404/Add%20marketplace%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(id, callback) {
        const interval = setInterval(function() {
            const element = document.getElementById(id);
            if (element && callback(element)) {
                clearInterval(interval);

            }
        }, 100); // Check every 100ms
    }

    waitForElement("sidebar", function(elem) {
        try {
            const bar = elem.childNodes[1]
            const marketplace = document.createElement("a")
            marketplace.textContent = "Marketplace"
            marketplace.href = "index.php?page=35"
            const br = document.createElement("br")
            bar.appendChild(br)
            bar.appendChild(marketplace)
        } catch(e) {
            return false
        }
        return true
    })




})();