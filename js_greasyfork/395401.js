// ==UserScript==
// @name         Spiegel DisableHighlights
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Disable Highlights on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395401/Spiegel%20DisableHighlights.user.js
// @updateURL https://update.greasyfork.org/scripts/395401/Spiegel%20DisableHighlights.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [data-area="block>topic:highlights"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();


