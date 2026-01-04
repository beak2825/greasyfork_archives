// ==UserScript==
// @name         B站页面布局调整
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调整B站页面布局，使其更加美观
// @match        https://*.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466180/B%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/466180/B%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.bili-feed4-layout, .bili-feed4 .bili-header .bili-header__channel { max-width: calc(1198px + 2 * var(--layout-padding)); }');
  GM_addStyle('.i_wrapper { width: 100%; max-width: 1298px; margin: 0 auto; padding: 0 56px; }');

})();
