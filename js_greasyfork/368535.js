// ==UserScript==
// @name         powerline.io debug
// @version      0.2
// @description  Powerline.io debug mode
// @author       Shaun Mitchell
// @match        *://powerline.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/187968
// @downloadURL https://update.greasyfork.org/scripts/368535/powerlineio%20debug.user.js
// @updateURL https://update.greasyfork.org/scripts/368535/powerlineio%20debug.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(unsafeWindow, "debug", {
        get: function() {
            return true;
        },
        set: function(x) {
            console.log("Cannot change value of debug variable.");
        }
    });
})();