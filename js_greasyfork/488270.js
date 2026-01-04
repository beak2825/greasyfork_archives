// ==UserScript==
// @name         Copy on Ctrl + Shift + C
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy text when pressing Ctrl+Shift+C. This can be especially used on Firefox (opens devtools normally). Devtools can still be toggled using Ctrl+Shift+I.
// @author       kenshin.rorona
// @include      *://*
// @grant        none
// @run-at       document-idle
// @license      MIT
// credit: https://github.com/jscher2000/Ctrl-Shift-C-Should-Copy/blob/main/content.js
// @downloadURL https://update.greasyfork.org/scripts/488270/Copy%20on%20Ctrl%20%2B%20Shift%20%2B%20C.user.js
// @updateURL https://update.greasyfork.org/scripts/488270/Copy%20on%20Ctrl%20%2B%20Shift%20%2B%20C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* Intercept and check keydown events for Ctrl+Shift+C */

    document.body.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C") {
            // Copy the selection to the clipboard
            document.execCommand('copy');
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);

    /* Intercept and check keyup events for Ctrl+Shift+C */

    document.body.addEventListener('keyup', function(evt) {
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C") {
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);
})();