// ==UserScript==
// @name         cleanAhdictionaryComAds
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  clean ahdictionary.com ads!
// @author       mooring@codernotes.club
// @match        *.ahdictionary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahdictionary.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/450174/cleanAhdictionaryComAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450174/cleanAhdictionaryComAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        'body{font-size:20px!important}',
        '.container{width:1024px;margin:0 auto;}',
        '#header{height:150px;margin-bottom:20px;}form{top:97px}.branding{top:10px}',
        '.container>.container1, .container>.container2,.container>.container3>.omega',
        ',#results .rtseg > div[align="right"],#footer{display:none!important}',
        '.container>.container3 > *,hr[align="left"]{width:100%;}',
        '.container>.container3,#results{width:unset}',
        '.slideshow-results{background-size:calc(100% + 4px) 36px;background-repeat: no-repeat;width:100%;background-position:-2px 0}',
        '.slideshow-results .top{padding-right: 50px;width: calc(100% - 30px);font-size: 14px;}',
        '.slideshow-results p{font-size: 14px;}',
        '.jcarousel-skin-tango .jcarousel-container-horizontal{margin:0 auto}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.appendChild(style)
})();