// ==UserScript==
// @name         cleanCidianwangComAds
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  clean https://www.cidianwang.com/shuowenjiezi/ ads
// @author       mooring@codernotes.club
// @match        *.cidianwang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cidianwang.com
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/453064/cleanCidianwangComAds.user.js
// @updateURL https://update.greasyfork.org/scripts/453064/cleanCidianwangComAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.xcx_img,.xcx_info,.left>[class^="top"]>div',
        ',script[src*="js/right"] + div',
        ',script[src*="js/left"]+div',
        ',script[charset="gb2312"] + div',
        ',.weixin,#adsf,.sideqr_left',
        ',.content>div>iframe',
        '{display:none!important}',
    ].join('')
    var style = document.createElement('style'); style.innerText = css; 
    document.body.previousElementSibling.appendChild(style)
})();