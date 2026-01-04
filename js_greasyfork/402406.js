// ==UserScript==
// @name         block_google_analytics
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  block google analytics
// @author       hypnguyen1209
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402406/block_google_analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/402406/block_google_analytics.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = document.createElement("script");
    a.type = "text/javascript";
    a.innerText = 'window["_gaUserPrefs"] = { ioo : function() { return true; } }';
    document.documentElement.insertBefore(a, document.documentElement.firstChild);

})();