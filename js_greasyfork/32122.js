// ==UserScript==
// @name         Google Search Translate Button Dutch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a Translate button to the Google Search page
// @author       Dolorfox
// @match        *www.google.nl/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32122/Google%20Search%20Translate%20Button%20Dutch.user.js
// @updateURL https://update.greasyfork.org/scripts/32122/Google%20Search%20Translate%20Button%20Dutch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var search = document.getElementById("lst-ib").value;
    var url = "https://translate.google.com/#auto/nl/" + search;
    document.getElementById("hdtb-msb-vis").innerHTML += `<div class="hdtb-mitem hdtb-imb"><a class="q qs" href="${url}">Translate</a></div>`;
})();