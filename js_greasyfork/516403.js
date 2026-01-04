// ==UserScript==
// @name         Google“下一页”布局优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调整谷歌搜索中文界面的分页布局，使"下一页"文字显示在箭头下方。既然谷歌不管了，我就让AI写一个脚本优化一下。
// @author       经本正一
// @match        *://www.google.com/search*
// @match        *://www.google.com.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516403/Google%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A1%B5%E2%80%9D%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/516403/Google%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A1%B5%E2%80%9D%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并注入CSS样式
    const style = document.createElement('style');
    style.textContent = `
        #pnnext {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-decoration: none !important;
        }

        #pnnext svg {
            margin-bottom: 4px !important;
        }
    `;
    document.head.appendChild(style);
})();