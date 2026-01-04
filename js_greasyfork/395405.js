// ==UserScript==
// @name         Spiegel DisablePodcasts
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Disable Podcasts on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395405/Spiegel%20DisablePodcasts.user.js
// @updateURL https://update.greasyfork.org/scripts/395405/Spiegel%20DisablePodcasts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [data-component="PodLoveWebPlayer"]')
    badSpans.forEach((s) => {
      while(s !== undefined && s.tagName != "DIV") {
        s = s.parentElement
      }
      if(s !== undefined) {
        // s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();



