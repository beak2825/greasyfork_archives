// ==UserScript==
// @name         Spiegel DisableSpiegelBackstage
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove Bento Article Links from Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395407/Spiegel%20DisableSpiegelBackstage.user.js
// @updateURL https://update.greasyfork.org/scripts/395407/Spiegel%20DisableSpiegelBackstage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('a[class="text-black block"][href^="https://www.spiegel.de/backstage/"]')
    badSpans.forEach((s) => {
    while(s !== undefined && (s.attributes[2] == undefined || s.attributes[2].nodeValue != "block>topic") ){
        s = s.parentElement
    }
    if (s !== undefined) {
    //s.style.backgroundColor = 'rgb(255,0,0)'
    s.remove()
      }
    })
})();
