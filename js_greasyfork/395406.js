// ==UserScript==
// @name         Spiegel DisableSocialBar
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  disable SocialBar on Spiegel Homepage
// @author       Phil
// @match        https://www.spiegel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395406/Spiegel%20DisableSocialBar.user.js
// @updateURL https://update.greasyfork.org/scripts/395406/Spiegel%20DisableSocialBar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('div [data-component="FeatureBar"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s = s.parentElement
        s.remove()
      }
    })
})();


