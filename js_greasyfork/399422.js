// ==UserScript==
// @name         remove ads
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://sexinsex.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399422/remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/399422/remove%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.getElementById("ad_text");
    if (div) {
        var parent = div.parentElement;
        parent.removeChild(div);
    }
    var div2 = document.getElementById("ad_headerbanner");
    if (div2) {
        var parent2 = div2.parentElement;
        parent2.removeChild(div2);
    }
})();