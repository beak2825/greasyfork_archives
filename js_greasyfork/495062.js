// ==UserScript==
// @name         bypass fluxus By Stickx
// @homepageURL  https://discord.gg/byMKdEURYV
// @namespace    https://greasyfork.org/en/users/1302141-conel
// @version      1.1
// @description  bypass fluxus use api stickx
// @author       conel
// @match        https://flux.li/android/external/start.php?HWID=*
// @icon         https://stickx.top/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495062/bypass%20fluxus%20By%20Stickx.user.js
// @updateURL https://update.greasyfork.org/scripts/495062/bypass%20fluxus%20By%20Stickx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var siteUrl = "https://stickx.top/key-fluxus/?url=" + encodeURIComponent(window.location.href);
    window.location.href = siteUrl;
})();
