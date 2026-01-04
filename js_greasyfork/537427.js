// ==UserScript==
// @name         Remove GoComics Paywall
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide the GoComics paywall without triggering detection.
// @author       Yoned Mikay
// @match        https://www.gocomics.com/*
// @grant        GM_addStyle
// @icon         https://www.gocomics.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537427/Remove%20GoComics%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/537427/Remove%20GoComics%20Paywall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .Paywall_upsell__b1P3R,
        .Paywall_upsell__background__KW_M0,
        .Paywall_upsell__container__LILRF,
        .Paywall_upsell__contents__ml3Ad,
        .Paywall_upsell__imageContainer__LG4nq,
        .Paywall_upsell__image__CJgdo,
        .Paywall_upsell__copy__BwUGS {
            opacity: 0.01 !important;
            pointer-events: none !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            transform: scale(0.01) !important;
        }

        body,
        html {
            overflow: auto !important;
            position: static !important;
        }

        [class*="__lock-scroll"],
        [style*="overflow: hidden"] {
            overflow: auto !important;
            position: static !important;
        }
    `);
})();