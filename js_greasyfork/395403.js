// ==UserScript==
// @name         Spiegel DisableMeineInhalte
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable Meine Inhalte Block on spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395403/Spiegel%20DisableMeineInhalte.user.js
// @updateURL https://update.greasyfork.org/scripts/395403/Spiegel%20DisableMeineInhalte.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [class="lg:sticky"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        // s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



