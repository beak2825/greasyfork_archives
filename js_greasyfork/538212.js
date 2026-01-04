// ==UserScript==
// @name         Auto Respawn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the respawn button when you die in battledudes.io.
// @author       M.
// @match        *://battledudes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538212/Auto%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/538212/Auto%20Respawn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const btn = document.querySelector('#respawn_button');
        if (btn && btn.offsetParent !== null) {
            btn.click();
        }
    }, 400);
})();