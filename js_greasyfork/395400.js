// ==UserScript==
// @name         Spiegel DisablefooterBlock
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove Footer from Spiegel Hompage
// @author       Phil
// @match        https://*.spiegel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395400/Spiegel%20DisablefooterBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/395400/Spiegel%20DisablefooterBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('footer[data-area="footer"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



