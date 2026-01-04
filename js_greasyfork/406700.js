// ==UserScript==
// @name         Block Google Analytics (johanb)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block Google Analytics (johanb).js
// @author       johanb
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406700/Block%20Google%20Analytics%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406700/Block%20Google%20Analytics%20%28johanb%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = document.createElement("script");
    a.type = "text/javascript";
    a.innerText = 'window["_gaUserPrefs"] = { ioo : function() { return true; } }';
    document.documentElement.insertBefore(a, document.documentElement.firstChild);

})();