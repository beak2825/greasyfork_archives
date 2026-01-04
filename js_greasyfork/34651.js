// To run, install GreaseMonkey or TamperMonkey extension in your browser
// Copy this code into new user script, and enable

// ==UserScript==
// @name         Disable Youtube next video autoplay
// @version      1.4
// @description  This script prevents Youtube from autoplaying the next video by switching the autoplay toggle to "off"
// @author       Jeff Bellucci
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/34651/Disable%20Youtube%20next%20video%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/34651/Disable%20Youtube%20next%20video%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function uncheck(toggle) {
        if (toggle.hasAttribute("checked")) {
            toggle.click();
        }
    }

    function disableAfterLoad() {
        var autoplayToggle = document.getElementById('toggle');
        if (autoplayToggle) {
            uncheck(autoplayToggle);
        } else {
            setTimeout(disableAfterLoad, 500);
        }
    }

    disableAfterLoad();
})();