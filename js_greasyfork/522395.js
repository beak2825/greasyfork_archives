// ==UserScript==
// @name         bili防沉迷
// @namespace    http://tampermonkey.net/
// @version      2024-12-33
// @description  x
// @author       You
// @match        https://www.bilibili.com/*
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522395/bili%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522395/bili%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

        function addStyle() {
        let s1 = document.createElement("style");
        s1.innerHTML =
            ".bili-header__channel, .bili-feed4-layout, .header-channel-fixed, .search-panel, .adblock-tips, .recommend-list-container, .rec-list, .pop-live-small-mode {display:none !important;}";
        document.getElementsByTagName("HEAD").item(0).appendChild(s1);
    }
    addStyle();
})();