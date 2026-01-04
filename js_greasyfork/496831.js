// ==UserScript==
    // @name         Fluxus Bypasser New
    // @homepageURL  https://discord.gg/feliciaxxx
    // @namespace    fluxus bypass
    // @version      1.3
    // @description  bypass fluxus new
    // @author       FeliciaXxx
    // @match        https://flux.li/android/external/start.php?HWID=*
    // @icon         https://flux.li/favicon.ico
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496831/Fluxus%20Bypasser%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/496831/Fluxus%20Bypasser%20New.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
        var siteUrl = "http://134.255.218.3:1167/api/fluxus/v1?url=" + encodeURIComponent(window.location.href);
        window.location.href = siteUrl;
    })();