// ==UserScript==
// @name         AWS Console Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keyboard hotkeys
// @author       nchicong41@gmail.com
// @match        https://*.aws.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372372/AWS%20Console%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/372372/AWS%20Console%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(e) {
        if (e.altKey) {
            e.preventDefault();

            if (document.querySelector(".nav-menu-content-close").offsetParent) {
                document.querySelector('.nav-menu-content-close').click();
            } else {
                document.querySelector('.nav-elt-label').click();
                document.querySelector("#awsc-services-search-autocomplete").value = "";
            }
        }
    });
})();