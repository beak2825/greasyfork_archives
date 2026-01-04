// ==UserScript==
// @name         Lite Duckduckgo Remove Tracking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove tracking lite Duckduckgo using get method
// @author       Benyamin Limanto <me@benyamin.xyz>
// @match        https://lite.duckduckgo.com/*
// @icon         https://icons.duckduckgo.com/ip2/duckduckgo.com.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445571/Lite%20Duckduckgo%20Remove%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/445571/Lite%20Duckduckgo%20Remove%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var l = document.querySelectorAll("td a");
    for (var i=0; i<l.length; i++) {
        var el = l[i];
        el.attributes["href"].value = decodeURIComponent(el.attributes["href"].value.replace("//duckduckgo.com/l/?","").split("&")[0].replace("uddg=",""));
    }
})();