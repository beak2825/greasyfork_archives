// ==UserScript==
// @name         Disable long press for touchscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Handle long tap event
// @author       Artlan A
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495058/Disable%20long%20press%20for%20touchscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/495058/Disable%20long%20press%20for%20touchscreen.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let longPress = false;
    document.addEventListener('touchstart', function(event) {
        longPress = false;
        setTimeout(function() {
            longPress = true;
        }, 500); // set time scope to determin long tap
    });

    document.addEventListener('touchend', function(event) {
        if (!longPress) {
            return;
        }
        event.preventDefault();
    });

})();