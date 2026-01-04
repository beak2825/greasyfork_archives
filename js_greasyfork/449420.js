// ==UserScript==
// @name         cleanIsraynotarrayAds
// @namespace    https://coderntoes.club/sms
// @version      0.11
// @description  clean israynotarray.com google ads
// @author       mooring@codernotes.club
// @match        https://israynotarray.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=israynotarray.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/449420/cleanIsraynotarrayAds.user.js
// @updateURL https://update.greasyfork.org/scripts/449420/cleanIsraynotarrayAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerText = [
        '.site-overview-wrap>div:last-child',
        '.footer>.footer-inner>.copyright+div',
        '.post-meta>div:not(.post-meta-item)',
        '.post-footer>div:not([class])',
        ':is(ins){display:none!important;}'
    ].join(',');
    document.body.previousElementSibling.appendChild(style);
})();