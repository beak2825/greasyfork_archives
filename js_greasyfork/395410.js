// ==UserScript==
// @name         Spiegel DisableVideoBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable VideoBlock on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395410/Spiegel%20DisableVideoBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395410/Spiegel%20DisableVideoBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>video"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })

})();



