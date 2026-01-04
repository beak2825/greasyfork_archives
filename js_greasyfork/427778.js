// ==UserScript==
// @name         cleanJianshuAds
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  clean Jianshu.com Ads
// @author       mooring@codernotes.club
// @match        https://www.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?domain=jianshu.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/427778/cleanJianshuAds.user.js
// @updateURL https://update.greasyfork.org/scripts/427778/cleanJianshuAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.adad_container,[iframe],*[aria-label],#__next>footer+div:last-child{display:none!important;}',
        '[role="main"] { width: calc(100vw - 360px)!important; }',
        '[role="main"] >._gp-ck{width:-webkit-fill-available!important}',
        '#__next>footer>[class^="_"]>[class^="_"]{ width: calc(100vw - 160px)!important;}',
        '#__next>footer>[class^="_"] textarea{width: calc(100vw - 570px)!important;}'
    ].join('')
    var style = document.createElement('style');
    style.innerText=css;
    document.body.previousElementSibling.appendChild(style)
})();