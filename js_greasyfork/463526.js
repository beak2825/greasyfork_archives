// ==UserScript==
// @name         FX678 网站自动关注重点消息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FX678，保持重要事件选中！
// @author       DK.Wang
// @match        *://rl.fx678.com/*

// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fx678.com
// @grant        none
// @note         2023-04-08 1.0 FX678网站自动重要信息
// @downloadURL https://update.greasyfork.org/scripts/463526/FX678%20%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8%E9%87%8D%E7%82%B9%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/463526/FX678%20%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8%E9%87%8D%E7%82%B9%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    console.log("Link:" + window.location.href);

    // FX678
    if (window.location.href.indexOf('rl.fx678.com')>-1) {
        $("a:contains('重要指标')").click();
    }
})();