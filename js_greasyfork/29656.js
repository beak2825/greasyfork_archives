// ==UserScript==
// @version  1.0.2
// @name Bye YouTube Autoplay
// @description Removes the autoplay up next feature on YouTube.
// @match    *://www.youtube.com/*
// @run-at   document-start
// @grant    none
// @noframes
// @namespace https://greasyfork.org/users/105361
// @downloadURL https://update.greasyfork.org/scripts/29656/Bye%20YouTube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/29656/Bye%20YouTube%20Autoplay.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function removeAPUN() {
        var autoplaybar = document.getElementsByClassName('autoplay-bar')[0];
        if (autoplaybar) {
            autoplaybar.removeAttribute('class');
            document.getElementsByClassName('checkbox-on-off')[0].remove();
        }
    }
    window.addEventListener('readystatechange', removeAPUN, true);
    window.addEventListener('spfdone', removeAPUN);
}());