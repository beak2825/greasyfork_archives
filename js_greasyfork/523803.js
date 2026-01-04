// ==UserScript==
// @name         破解拦截100
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  破解拦截100，显示“视频嗅探”功能的下载按钮
// @author       破解拦截100
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523803/%E7%A0%B4%E8%A7%A3%E6%8B%A6%E6%88%AA100.user.js
// @updateURL https://update.greasyfork.org/scripts/523803/%E7%A0%B4%E8%A7%A3%E6%8B%A6%E6%88%AA100.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的样式元素
    const style = document.createElement('style');
    style.textContent = `
        .ybd_video_slide_d_ownItem_btn {
            display: inline !important;
        }
    `;

    // 将样式元素添加到页面的 head 部分
    document.head.appendChild(style);

    // 确保目标元素立即显示
    document.querySelectorAll('.ybd_video_slide_d_ownItem_btn').forEach(el => {
        el.style.display = 'inline';
    });
})();