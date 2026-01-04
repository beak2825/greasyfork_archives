// ==UserScript==
// @name         Spiegel DisableBundesligaOnStartpage
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable Bundesliga on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395397/Spiegel%20DisableBundesligaOnStartpage.user.js
// @updateURL https://update.greasyfork.org/scripts/395397/Spiegel%20DisableBundesligaOnStartpage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [data-area="block>topic:fußball-bundesliga"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();


