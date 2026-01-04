// ==UserScript==
// @name         Spiegel DisableBentoBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove Bento Block from Spigel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395395/Spiegel%20DisableBentoBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395395/Spiegel%20DisableBentoBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>Bento-Box"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



