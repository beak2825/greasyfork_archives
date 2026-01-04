// ==UserScript==
// @name         cleanCssTricksAds
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  clean css-tricks.com ads
// @author       mooring@codernotes.club
// @match        *.css-tricks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=css-tricks.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/450062/cleanCssTricksAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450062/cleanCssTricksAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
        .page-wrap header.mega-header{padding:0}
        .page-wrap .articles-and-sidebar{grid-template-columns:minmax(0,1fr)}
        .page-wrap .header-sponsor-grid{grid-template-columns:1fr}
        .page-wrap .entry-unrelated.sidebar,
        .page-wrap .popular-articles > .popular-header,
        .page-wrap .header-sponsor-grid .header-sponsor,
        .page-wrap .site-note
        {display:none!important}
        .page-wrap .mega-header > p,
        .page-wrap .header-sponsor-grid .header-text .header-intro,
        .page-wrap .header-sponsor-grid .header-text .header-intro p,
        .page-wrap .article-content > p
        {max-width:unset}
        footer.site-footer{margin:calc(var(--gap)*3) 0 0 0}
    `;
    let style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style);
})();