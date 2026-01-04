// ==UserScript==
// @name         Simplify Embedded YouTube Player
// @description  Automatically collapse More videos popup in YouTube.
// @namespace    https://greasyfork.org/users/1458847
// @license      MIT
// @match        https://www.youtube-nocookie.com/*
// @match        https://www.youtube.com/embed/*
// @version      2.0
// @downloadURL https://update.greasyfork.org/scripts/535320/Simplify%20Embedded%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/535320/Simplify%20Embedded%20YouTube%20Player.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var style = document.createElement("style");
    style.textContent = `
    .ytp-pause-overlay-container{
        display: none !important;
    }

    .ytp-watermark{
        display: none !important;
    }

    .ytp-paid-content-overlay{
        display: none !important;
    }

    .caption-window {
        display: unset !important;
    }
    `;

    document.querySelector("head").appendChild(style);
})();