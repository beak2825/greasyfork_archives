// ==UserScript==
// @name         Disable Double-Tap Zoom Globally
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  disables nasty vendor-specific touch features that are annoying
// @author       The_GTA
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37504/Disable%20Double-Tap%20Zoom%20Globally.user.js
// @updateURL https://update.greasyfork.org/scripts/37504/Disable%20Double-Tap%20Zoom%20Globally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.document.body.style.touchAction = "manipulation";
})();