// ==UserScript==
// @name         cleanCambridgeOrgAds
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  clean cambridge.org ads
// @author       mooring@codernotes.club
// @match        dictionary.cambridge.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cambridge.org
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/450156/cleanCambridgeOrgAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450156/cleanCambridgeOrgAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '[role="main"] .x .lmb-15,[role="main"] .x .hfr-s,[role="main"] .x .hfl-m,.topslot-container',
        ',.lcs>.hax,[layout="nodisplay"],#searchForm [amp-access-template]',
        ',#searchForm .hoh > span > i, #searchForm .hoh > span > button[aria-label*="Choose"]',
        ',[data-show-pron="true"],[data-google-query-id],.lmb-10 +div[amp-access]',
        '{display:none!important}',
        '.lcs .cdo-translations{width:100%}',
        '#searchForm{display: grid;align-content: center;justify-content: center;}',
        '#page-content,.ltab,.lt2b{width: calc(100% - 50px)}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css; 
    document.body.previousElementSibling.appendChild(style)
})();