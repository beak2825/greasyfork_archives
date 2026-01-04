// ==UserScript==
// @name         Google 搜索框保持圆角 + 去建议 + 保留阴影
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  保持 Google 搜索框圆角，保留阴影，禁止点击变尖
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @match        https://www.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536054/Google%20%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BF%9D%E6%8C%81%E5%9C%86%E8%A7%92%20%2B%20%E5%8E%BB%E5%BB%BA%E8%AE%AE%20%2B%20%E4%BF%9D%E7%95%99%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/536054/Google%20%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BF%9D%E6%8C%81%E5%9C%86%E8%A7%92%20%2B%20%E5%8E%BB%E5%BB%BA%E8%AE%AE%20%2B%20%E4%BF%9D%E7%95%99%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* 隐藏搜索建议下拉 */
        form[role="search"] .aajZCb {
            display: none !important;
        }

        /* 保持固定圆角，允许原始阴影 */
        form[role="search"] .RNNXgb {
            border-radius: 24px !important;
            overflow: hidden;
        }

        form[role="search"] .RNNXgb:hover,
        form[role="search"] .RNNXgb:focus-within {
            border-radius: 24px !important;
        }
    `;
    document.head.appendChild(style);
})();
