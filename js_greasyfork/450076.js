// ==UserScript==
// @name         cleanHackrIOAds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  clean hackr.io ads
// @author       mooring@codernotes.club
// @match        hackr.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackr.io
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/450076/cleanHackrIOAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450076/cleanHackrIOAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '[class*="ezoic-ad"],.primis-placeholder',
        '{display:none!important}',
       ].join('')
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style);
})();