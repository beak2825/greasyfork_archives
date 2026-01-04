// ==UserScript==
// @name         Disable full screen api
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When wathcing Youtube, double click won't enable fullscreen mode.
// @author       luanjunyi@gmail.com
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470372/Disable%20full%20screen%20api.user.js
// @updateURL https://update.greasyfork.org/scripts/470372/Disable%20full%20screen%20api.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.documentElement.requestFullscreen = function () {
        console.log('HTML5 Fullscreen mode is disabled from Tampermonkey script.');
        return false;
    };
})();