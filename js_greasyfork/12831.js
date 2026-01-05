// ==UserScript==
// @name         freeskier.com: anti blockadblock.js
// @namespace    https://github.com/gorhill/uBlock
// @version      0.1
// @description  This will un-hide the video widgets, which are hidden by default
// @author       gorhill
// @match        http://freeskier.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12831/freeskiercom%3A%20anti%20blockadblockjs.user.js
// @updateURL https://update.greasyfork.org/scripts/12831/freeskiercom%3A%20anti%20blockadblockjs.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    var el = document.getElementById("adb-not-enabled");
    if ( el !== null ) {
        el.style.removeProperty("display");
    }
    el = document.getElementById("videoContainer");
    if ( el !== null ) {
        el.style.removeProperty("display");
    }
})();