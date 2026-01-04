// ==UserScript==
// @name         cleanXdicnetAds
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  clean zdic.net ads, make page more clear
// @author       mooring@codernotes.club
// @match        *.zdic.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zdic.net
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/451019/cleanXdicnetAds.user.js
// @updateURL https://update.greasyfork.org/scripts/451019/cleanXdicnetAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.topslot_container,[class*=adsbygoogle],header.sticky > :not(form),iframe[src*="baidu.com"]{display:none!important}',
        'body.context-zh-cn header{display:flex;justify-content: center;padding: 1em;align-items: center;flex-direction: column;}',
        'body.context-zh-cn{padding:0!important;}',
        'header.sticky>.header_bot.res_s{display: block!important;width: 100%;}',
        'body.headerMinimized header.sticky{padding:1.8em 1em 1.1em 1em!important;}',
        '.navigation .tabsNavigation{margin-top:30px!important}'
    ].join('')
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();