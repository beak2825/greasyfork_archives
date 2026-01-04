// ==UserScript==
// @name Linkvertise Bypasser - English
// @namespace Violentmonkey Scripts
// @match *://*.linkvertise.com/*
// @grant none
// @version 1.0
// @description This userscript bypasses Linkvertise links and takes you directly to the destination page.
// @description:de Dieses Userscript umgeht Linkvertise-Links und führt Sie direkt zur Zielseite.
// @icon64 https://i.imgur.com/1234567.png
// @downloadURL https://update.greasyfork.org/scripts/485275/Linkvertise%20Bypasser%20-%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/485275/Linkvertise%20Bypasser%20-%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var link = document.querySelector("a[href^='https://linkvertise.com/']");
        if (link) {
            window.location.href = link.href.replace("https://linkvertise.com/", "https://direct-link.net/");
        }
    };
})();
