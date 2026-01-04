// ==UserScript==
// @name         强制对话消息气泡全宽 chatglm.cn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Override max-width style for specific elements on chatglm.cn
// @author       yimiaoxiehou
// @match        https://chatglm.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498336/%E5%BC%BA%E5%88%B6%E5%AF%B9%E8%AF%9D%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E5%85%A8%E5%AE%BD%20chatglmcn.user.js
// @updateURL https://update.greasyfork.org/scripts/498336/%E5%BC%BA%E5%88%B6%E5%AF%B9%E8%AF%9D%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E5%85%A8%E5%AE%BD%20chatglmcn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个新的style元素
    var style = document.createElement('style');
    // 设置style元素的文本内容，覆盖所有.maxWidth类和.init-page.pc的直接子元素中类名为warp的max-width样式
    style.textContent = `
        .maxWidth,
        .wrap,
        .warp,
        .conversation-list,
        .conversation-item{
            max-width: unset !important;
        }
        svg,
        #wm_div_id{
            opacity: 0;
        }
        .detail-container{
          min-width: unset !important;
        }
        .dialogue .detail * {
          max-width: unset !important;
        }
        .dialogue .detail .item[data-v-68bdacfc] {
          max-width: unset !important;
          min-width: 100% !important;
        }
        .aside[data-v-61a5fb42] {
          max-width: 160px!important;
        }

    `;
    // 将style元素插入到head中
    document.head.appendChild(style);
})();