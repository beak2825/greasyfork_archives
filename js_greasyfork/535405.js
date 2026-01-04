// ==UserScript==
// @name         Replace inventory button with yard button
// @namespace    http://tampermonkey.net/
// @version      2025-05-04
// @description  Replaces inventory button with yard button
// @author       Disk217
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535405/Replace%20inventory%20button%20with%20yard%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/535405/Replace%20inventory%20button%20with%20yard%20button.meta.js
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
            const invButton = elem.childNodes[1].childNodes[0]
            invButton.textContent = "Yard"
            invButton.href = invButton.href.replace("25","24")
        } catch(e) {
            return false
        }
        return true
    })




})();