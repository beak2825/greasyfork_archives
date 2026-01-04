// ==UserScript==
// @name         Replace Youtube Country-code
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Replace Youtube Logo Country code
// @author       Kotoki1337
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394496/Replace%20Youtube%20Country-code.user.js
// @updateURL https://update.greasyfork.org/scripts/394496/Replace%20Youtube%20Country-code.meta.js
// ==/UserScript==

(function() {
    'use strict';

 document.getElementById("country-code").innerHTML = "BETA"
 document.getElementById("#logo-container > span.content-region").innerHTML = "BETA"
})();