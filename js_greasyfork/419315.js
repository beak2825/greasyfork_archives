// ==UserScript==
// @name         SamFW Anti-Adblock Killer
// @description  Blocks adblock detection on samfw.com
// @version      0.1
// @author       LuK1337
// @match        *://samfw.com/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/721956
// @downloadURL https://update.greasyfork.org/scripts/419315/SamFW%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/419315/SamFW%20Anti-Adblock%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let requestDownloadOrig = window.requestDownload;

    window.requestDownload = function(token) {
        window.adBE = undefined;
        return requestDownloadOrig(token);
    };
})();