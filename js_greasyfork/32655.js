// ==UserScript==
// @name         Family Stream Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.familystream.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32655/Family%20Stream%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/32655/Family%20Stream%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
        document.getElementsByClassName("track_box")[0].addEventListener("click", function(){
            window.open(document.getElementsByClassName("html5")[0].src);
});
})();