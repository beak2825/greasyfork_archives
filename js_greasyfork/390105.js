// ==UserScript==
// @name         AutoRozwijanie
// @namespace    chujwiecotuwpisac.pl
// @version      0.1
// @description  Przejmujemy kontrolę nad tym gunwem.
// @author       Ja
// @match        https://uonetplus.vulcan.net.pl/kielce/Start.mvc/Index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390105/AutoRozwijanie.user.js
// @updateURL https://update.greasyfork.org/scripts/390105/AutoRozwijanie.meta.js
// ==/UserScript==

(function() {

    var button = document.querySelectorAll('div[style="float: right; cursor: pointer;"]');
    for ( var i = 0; i < button.length; i++){
    button[i].click();}
})();