// ==UserScript==
// @name         Spiegel DisableMeistgelesenplus
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable Meistgelesen on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395404/Spiegel%20DisableMeistgelesenplus.user.js
// @updateURL https://update.greasyfork.org/scripts/395404/Spiegel%20DisableMeistgelesenplus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [data-area="block>topic:meistgelesen_bei_spiegel+"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();





