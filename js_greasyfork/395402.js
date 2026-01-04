// ==UserScript==
// @name         Spiegel DisableLebenBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable Leben Block on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395402/Spiegel%20DisableLebenBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395402/Spiegel%20DisableLebenBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>highlight:leben"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();





