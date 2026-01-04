// ==UserScript==
// @name         cleanSitePointAds
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  clean sitepoint.com ads
// @author       mooring@codernotes.club
// @match        *.sitepoint.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sitepoint.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/450066/cleanSitePointAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450066/cleanSitePointAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '[data-display],.custom-content,[aria-label~="sidebar"] > aside,[aria-label~="sidebar"] > aside+.sticky,.proper-ad-unit',
        '{display:none!important}',
        '.md\\:grid{display:block!important;margin:0 auto;}',
        '.max-w-screen-md{max-width:1200px}',
        '[aria-label~="sidebar"]{display:flex}',
        '[aria-label~="sidebar"] > .flex{display:flex;flex-direction:row}',
        '[aria-label~="sidebar"] [class*="my-"]{margin-right:1rem}',
       ].join('')
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style);
})();