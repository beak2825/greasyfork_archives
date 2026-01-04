// ==UserScript==
// @name         GPT reply/delete/flag/edit/etc. icon Distancer
// @namespace    _pc
// @version      0.4
// @description  Adds margin to GPT reply/delete/flag/edit/etc. icon elements to avoid clicking the wrong icon
// @author       verydelight
// @license      MIT
// @icon         https://www.gayporntube.com/favicon.ico
// @connect      gayporntube.com
// @compatible   Firefox Tampermonkey
// @match        *://*.gayporntube.com/*
// @downloadURL https://update.greasyfork.org/scripts/547660/GPT%20replydeleteflageditetc%20icon%20Distancer.user.js
// @updateURL https://update.greasyfork.org/scripts/547660/GPT%20replydeleteflageditetc%20icon%20Distancer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const SPACING = 25; //spacing in pixels/px
    const style = document.createElement('style');
    style.textContent = `
    #content a:has(.fas) {
    margin-left: ${SPACING}px !important;
    margin-right: ${SPACING}px !important;
    visibility: visible !important;
    }
    #content .main-title a:has(.fas),
    #content .pagination a:has(.fas),
    #content .blog-item-entry-details a:has(.fas),
    #content .gallery-navigation a:has(.fas){
    margin-left: initial !important;
    margin-right: initial !important;
    visibility: initial !important;
    }
    `;
    document.head.appendChild(style);
})();