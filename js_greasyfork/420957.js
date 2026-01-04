// ==UserScript==
// @name         Cults3d Ad Hider
// @namespace    http://infinities-within.net/
// @version      0.1
// @description  Remove clickbait and obnoxious ads from Cults3d.
// @author       Kintar
// @match        https://cults3d.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420957/Cults3d%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/420957/Cults3d%20Ad%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function killElement(elem) {
        if (elem) {
            elem.remove();
        }
    }

    function checkAndKill() {
        var topOfPage = document.getElementById("zone-search-results-top");
        if (topOfPage) {
            topOfPage.remove();
        }
        var ads = document.getElementsByClassName("ob-widget ob-grid-layout AR_16");
        ads.forEach(killElement);

        var inlines = document.getElementsByClassName("crea crea--clip");
        inlines.forEach(killElement);

        setTimeout(checkAndKill, 3000);
    }

    setTimeout(checkAndKill, 1000);
})();
