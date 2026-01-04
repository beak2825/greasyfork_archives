// ==UserScript==
// @name         cleanMerriam-websterAds
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  clean Merriam-webster.com Ads
// @author       mooring@codernotes.club
// @match        *.merriam-webster.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=merriam-webster.com
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/450152/cleanMerriam-websterAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450152/cleanMerriam-websterAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.container.mt-3,.adthrive-ad,.global-footer,.additional-content-area,#subscribe-unabridged,.widget.learn_more,#learn-more-anchor',
        ',#definition-wrapper > .row > :not(:first-child),.open-web-comments-header + .pitc-div,.wap-ad-area-placeholder,div.adthrive-ad-cls[data-google-query-id],div[id^="mw-ad-slot"][class]{display:none!important;position:fixed!important;left:-9999px;top:-9999px;}',
        '.container .row .left-content.col-xl-8{flex:unset;max-width:unset;}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();