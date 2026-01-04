// ==UserScript==
// @name         ExHentai Image Style Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply CSS to #img on exhentai.org/s/*
// @match        https://exhentai.org/s/*
// @match        https://e-hentai.org/s/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537980/ExHentai%20Image%20Style%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/537980/ExHentai%20Image%20Style%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #img {
            max-height: 87vh !important;
            height: auto !important;
            width: auto !important;
            margin: auto !important;
        }
        .e-hentai-infinite-scroll.s .auto-load-img {
            max-height: 87vh !important;
            height: auto !important;
            width: auto !important;
            margin: auto !important;
        }
    `);
})();
