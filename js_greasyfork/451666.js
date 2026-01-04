// ==UserScript==
// @name         cleanEpubReaderPage
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  clean cambridge.org ads
// @author       mooring@codernotes.club
// @match        *.freebusinessapps.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebusinessapps.net
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/451666/cleanEpubReaderPage.user.js
// @updateURL https://update.greasyfork.org/scripts/451666/cleanEpubReaderPage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.text-center,.board .board-footer,.page-footer,.mys-wrapper,ins[class*="adsbygoogle"]',
        ',.board .board-row .board-col-left:first-child,header.page-header',
        '{display:none!important}',
        '.board .board-row .board-col-right{padding:0 10px;}',
        '.board-col-right p{margin-bottom: 5px}',
        '.board-col-right .spacer30{height: 5px}',
        '.toolbar {height: auto;padding: 0;width: 100%;}',
        'body>main.page-main{margin:0 auto;width:800px!important}',
        '.board-rows{position:relative}',
        '#lbl-selected-file{width: 240px;position: absolute;top: 32px;left: 300px;font-size:14px}',
        '.board-rows > .board-row:nth-child(3){position:absolute;right:0; top: 22px;border-bottom:none}',
        '.btn{font-size:12px!important;padding:5px!important}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();