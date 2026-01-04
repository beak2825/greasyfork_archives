// ==UserScript==
// @name         屏蔽比特蜂巢论坛装饰元素
// @namespace    https://pting.club/
// @version      1.0
// @description  屏蔽论坛中的彩虹ID和头像框
// @match        *://pting.club/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532637/%E5%B1%8F%E8%94%BD%E6%AF%94%E7%89%B9%E8%9C%82%E5%B7%A2%E8%AE%BA%E5%9D%9B%E8%A3%85%E9%A5%B0%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/532637/%E5%B1%8F%E8%94%BD%E6%AF%94%E7%89%B9%E8%9C%82%E5%B7%A2%E8%AE%BA%E5%9D%9B%E8%A3%85%E9%A5%B0%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    GM_addStyle(`
        .decorationStoreColorText2,
        .decorationStoreColorText3,
        .decorationStoreColorText11,
        .decorationStoreColorText13 {
            all: unset !important;
        }
        .decorationAvatarFrameImageSource {
            display: none !important;
        }
    `);
})();