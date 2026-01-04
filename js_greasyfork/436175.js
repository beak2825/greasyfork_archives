// ==UserScript==
// @name         Vio-V Darkmode Signaturen Fix
// @version      1.0
// @author       sprayz
// @description  Fixes the display of dynamic signatures in dark mode
// @namespace    https://forum.vio-v.com
// @match        https://forum.vio-v.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436175/Vio-V%20Darkmode%20Signaturen%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/436175/Vio-V%20Darkmode%20Signaturen%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let images = document.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
        let image = images[i];
        if (!image.src.startsWith("https://signatures.vio-v.com/")) {
            continue;
        }

        image.style.backgroundColor = "white";
    }
})();