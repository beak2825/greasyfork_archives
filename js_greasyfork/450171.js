// ==UserScript==
// @name         cleanMacmillandictionaryComAds
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  clean macmillandictionary.com ads
// @author       mooring@codernotes.club
// @match        *.macmillandictionary.com/*
// @match        *.macmillanthesaurus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=macmillandictionary.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/450171/cleanMacmillandictionaryComAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450171/cleanMacmillandictionaryComAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '.limit-max-width > .row:nth-child(2),.limit-max-width > .row:nth-child(4)',
        ',[id*="google_ads"]',
        ',.left-content .thes-links',
        ',.max-90em,#potw+.limit-max-width',
        ',.limit-max-width > .center-xs .responsive-img',
        '{display:none!important}',
        '.floating-search{display:block!important}',
        '.col-sm-8,.col-sm-content-with-leftslot{max-width:unset;}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.appendChild(style)
})();