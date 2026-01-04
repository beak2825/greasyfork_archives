// ==UserScript==
// @name         cleanDictCnAds
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  clean dict.cn ads, make page more clear
// @author       mooring@codernotes.club
// @match        *.dict.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dict.cn
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/451020/cleanDictCnAds.user.js
// @updateURL https://update.greasyfork.org/scripts/451020/cleanDictCnAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
    '[class*=Google],.sc-fx+div,[id^="div-gpt-ad"],[data-ad-slot],.copyright,.ad_banner,#dshared{display:none!important}',
    ].join('')
    var style = document.createElement('style'); style.innerText = css; 
    document.body.previousElementSibling.appendChild(style)
})();