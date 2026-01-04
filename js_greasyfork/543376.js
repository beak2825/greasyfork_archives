// ==UserScript==
// @name         屏蔽暂停广告
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  屏蔽暂停时的广告
// @author       You
// @match        https://www.kuhh4jo.com/vod/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuhh4jo.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543376/%E5%B1%8F%E8%94%BD%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/543376/%E5%B1%8F%E8%94%BD%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    #mse > div.video-ad-pause__Container-sc-fbf39d88-0.kTljfd{
    display:none !important;
}

    `)
    // Your code here...
})();