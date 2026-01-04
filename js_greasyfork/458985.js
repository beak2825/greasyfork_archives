// ==UserScript==
// @name         Don't stop video on tab change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents sites like instagram from stopping videos on tab change.
// @author       Can Kurt
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458985/Don%27t%20stop%20video%20on%20tab%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/458985/Don%27t%20stop%20video%20on%20tab%20change.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("visibilitychange", function(event) {
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener("webkitvisibilitychange", function(event) {
        event.stopImmediatePropagation();
    }, true);
})();