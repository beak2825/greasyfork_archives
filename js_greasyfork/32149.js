// ==UserScript==
// @name         Google Search Translate Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a Translate button to the Google Search page
// @author       gllms
// @match        *www.google.com/search*
// @grant        none
// @licence      https://opensource.org/licenses/mit-license.php
// @downloadURL https://update.greasyfork.org/scripts/32149/Google%20Search%20Translate%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/32149/Google%20Search%20Translate%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var search = document.getElementById("lst-ib").value;
    var url = encodeURI("https://translate.google.com/#auto/en/" + search);
    document.getElementById("hdtb-msb-vis").innerHTML += `<div class="hdtb-mitem hdtb-imb"><a class="q qs" href="${url}">Translate</a></div>`;
})();