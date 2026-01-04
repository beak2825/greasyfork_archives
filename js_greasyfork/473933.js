// ==UserScript==
// @name         Remove HowtoGeek ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove howtogeek ads
// @author       You
// @match        https://www.howtogeek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=howtogeek.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473933/Remove%20HowtoGeek%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/473933/Remove%20HowtoGeek%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.addEventListener("load", (event) => {
     let ad_divs = document.querySelectorAll('div[id*="ad"]')
     for(let i = 0; i < ad_divs.length; i++){
         ad_divs[i].remove()
     }
     });
})();