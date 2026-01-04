// ==UserScript==
// @name         Spiegel DisableAllRubrikBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove AllRubrikenBlock on Spiegel.de hompage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395394/Spiegel%20DisableAllRubrikBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395394/Spiegel%20DisableAllRubrikBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>channel:alle_rubriken"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();





