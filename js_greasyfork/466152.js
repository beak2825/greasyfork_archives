// ==UserScript==
// @name         屏蔽知乎右下角登录屏蔽
// @namespace    your-namespace
// @version      1.0
// @description  屏蔽知乎右下角广告
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466152/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%99%BB%E5%BD%95%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466152/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%99%BB%E5%BD%95%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加屏蔽广告的样式
    GM_addStyle(`
        .css-ysn1om,
        .css-1izy64v {
            display: none !important;
        }
    `);
})();
