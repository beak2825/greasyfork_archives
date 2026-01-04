// ==UserScript==
// @name         Spiegel DisableSportDaten
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove Bento Block from Spigel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395409/Spiegel%20DisableSportDaten.user.js
// @updateURL https://update.greasyfork.org/scripts/395409/Spiegel%20DisableSportDaten.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>sportdaten"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



