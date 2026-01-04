// ==UserScript==
// @name         Youtube Music Replace White-Background Favicon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the youtube music favicon with a white background with one with a transparent background.
// @author       Ricky Brent
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370406/Youtube%20Music%20Replace%20White-Background%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/370406/Youtube%20Music%20Replace%20White-Background%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (var i = 0; i < window.document.getElementsByTagName('link').length; i++) {
        if (window.document.getElementsByTagName('link')[i].rel == "icon") {
            window.document.getElementsByTagName('link')[i].href = "https://s.ytimg.com/yts/img/music/web/favicon_32-vflt9h9D7.png"
            return;
        }
    }
})();