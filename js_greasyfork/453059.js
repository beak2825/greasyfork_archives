// ==UserScript==
// @name         cleanGushiwenCnAds
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  clean https://so.gushiwen.cn/mingju/juv.aspx?id=5f20170d7269 ads
// @author       mooring@codernotes.club
// @match        *.gushiwen.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gushiwen.cn
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/453059/cleanGushiwenCnAds.user.js
// @updateURL https://update.greasyfork.org/scripts/453059/cleanGushiwenCnAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        'div[class*="content"],.right .juzioncont,.right .abcd',
        ',div[id^="threeWeixin"]',
        '{display:none!important}',
        '.maintopbc .maintop .cont{max-width: 100%!important}',
        '.maintopbc .maintop .cont .right{width:fit-content!important;}',
        '.maintopbc .maintop .cont .right .son2{float:left!important}',
        '.main3{max-width: calc(100% - 100px) !important;}',
        '.main3 >.left{width: 100% !important}',
        '.main3 >.right{display:none!important}',
    ].join('')
    var style = document.createElement('style'); style.innerText = css; 
    document.body.previousElementSibling.appendChild(style)
})();