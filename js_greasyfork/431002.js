// ==UserScript==
// @name         Youtube Never Pause
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  YouTube auto pause dialog will never shows up
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431004/Youtube%20Never%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/431004/Youtube%20Never%20Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(() => {
        window._lact = window._fact = Date.now();
    }, 1000)
})();