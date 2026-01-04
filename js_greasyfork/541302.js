// ==UserScript==
// @name         GunCAD Index Anim Background Disabler
// @namespace    http://tampermonkey.net/
// @version      2025-07-01
// @description  Disables animated bg that hammers gpu's for no reason
// @author       Shootist
// @match        https://guncadindex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=guncadindex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541302/GunCAD%20Index%20Anim%20Background%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/541302/GunCAD%20Index%20Anim%20Background%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bgwrapper = document.getElementById('bgwrapper');
    if (document.cookie.indexOf('stopAnim=true') == 0) {
        // Already disabled
        return
    } else {
        // Set cookie and pause animation
        document.cookie = 'stopAnim=true;path=/';
        bgwrapper.style.animationPlayState = 'paused';
    }
})();