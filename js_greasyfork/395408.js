// ==UserScript==
// @name         Spiegel DisableSpiegelPlus
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove SpiegelPus Article Links from Spiegel Homepage
// @author       Phil with help from Sim
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395408/Spiegel%20DisableSpiegelPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/395408/Spiegel%20DisableSpiegelPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('g[id^="l-splus-flag"]')
    badSpans.forEach((s) => {
        while(s !== undefined && s.tagName != "ARTICLE") {
        s = s.parentElement
    }
    if (s !== undefined) {
    //s.style.backgroundColor = 'rgb(255,0,0)'
    s.remove()
      }
    })
  
    var badSpans = document.querySelectorAll('g[id^="m-splus-flag"]')
    badSpans.forEach((s) => {
        while(s !== undefined && s.tagName != "ARTICLE") {
        s = s.parentElement
    }
    if (s !== undefined) {
    //s.style.backgroundColor = 'rgb(255,0,0)'
    s.remove()
      }
    })
  
  
  
})();
