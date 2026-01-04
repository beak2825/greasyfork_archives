// ==UserScript==
// @name         Spiegel DisableDeinSPIEGELBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove Dein Spiegel block from Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395399/Spiegel%20DisableDeinSPIEGELBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395399/Spiegel%20DisableDeinSPIEGELBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>DeinSPIEGEL"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



