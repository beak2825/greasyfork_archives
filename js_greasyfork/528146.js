// ==UserScript==
// @name         Stop Rubik
// @namespace    http://tampermonkey.net/
// @version      2025-02-26
// @description  Stops execution when T is pressed
// @author       You
// @match        https://ikwbb.github.io/rubik-guide/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528146/Stop%20Rubik.user.js
// @updateURL https://update.greasyfork.org/scripts/528146/Stop%20Rubik.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Event listener for keypress
    document.addEventListener('keydown', function(event) {
        if (event.key === 't' || event.key === 'T') {
            tmpStop();
        }
    });
})();