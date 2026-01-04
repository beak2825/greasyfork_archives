// ==UserScript==
// @name         Remove RichDuck (Skroutz) reels
// @license      GNU General Public License v3.0
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides elements with class tl-reels
// @author       nikant
// @match        https://www.skroutz.gr/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/506024/Remove%20RichDuck%20%28Skroutz%29%20reels.user.js
// @updateURL https://update.greasyfork.org/scripts/506024/Remove%20RichDuck%20%28Skroutz%29%20reels.meta.js
// ==/UserScript==

GM_addStyle(`
    .tl-reels,
    .timeline-shop-the-look,
    .tl-articles {
        display: none !important;
    }
`);