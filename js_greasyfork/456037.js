// ==UserScript==
// @name         cleanCPlusPlusComAds
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  clean https://cplusplus.com/ ads
// @author       mooring@codernotes.club
// @match        https://cplusplus.com/*
// @match        https://cpp.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cplusplus.com
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/456037/cleanCPlusPlusComAds.user.js
// @updateURL https://update.greasyfork.org/scripts/456037/cleanCPlusPlusComAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.C_bn,.bsa_fixed-leaderboard',
        '{display:none!important}',
        '.comped>.top .ace_editor{height:calc(100% - 400px)!important;font-size:16px;}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();