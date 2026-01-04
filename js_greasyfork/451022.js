// ==UserScript==
// @name         cleanLongmanDicAds
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  clean ldoceonline.com ads, make page more clear
// @author       mooring@codernotes.club
// @match        *.ldoceonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ldoceonline.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/451022/cleanLongmanDicAds.user.js
// @updateURL https://update.greasyfork.org/scripts/451022/cleanLongmanDicAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.topslot-container,[id^="div-gpt-ad"],[id^="ad_"],ins,.responsive_cell2',
        ',.content > .carousel,.text_welcome>h1:not(:first-child)',
        ',.impactify-style-impact',
        '{display:none!important}',
        '[class*="responsive_cell"]{clear:both;margin: 0 auto;float:unset}',
        '.entry_content{font-size: 14pt}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css; 
    document.body.previousElementSibling.appendChild(style)
})();