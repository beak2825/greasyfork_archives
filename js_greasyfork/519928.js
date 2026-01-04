// ==UserScript==
// @name         两小无猜网地址提取
// @namespace    https://greasyfork.org/zh-CN/scripts/519928-%E4%B8%A4%E5%B0%8F%E6%97%A0%E7%8C%9C%E7%BD%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96
// @version      1.3
// @description  提取两小无猜网的资源地址
// @match        https://cnyww.douyin123.vip/app/index.php?i=1&c=entry&*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519928/%E4%B8%A4%E5%B0%8F%E6%97%A0%E7%8C%9C%E7%BD%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519928/%E4%B8%A4%E5%B0%8F%E6%97%A0%E7%8C%9C%E7%BD%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const linkEl = document.querySelector('.title-bar__title');
        if (!linkEl) return; // 若无此元素，则不处理

        // 检查 window.config.lesson.document_info 是否存在
        if (window.config && window.config.lesson && window.config.lesson.document_info) {
            let info = window.config.lesson.document_info;
            // 转义 "\/" 为 "/"
            info = info.replace(/\\\//g, '/');

            // 匹配百度网盘链接与提取码
            const linkRegex = /(https:\/\/pan\.baidu\.com\/s\/[^\s]+)\?pwd=([0-9A-Za-z]+)/;
            const match = info.match(linkRegex);

            if (match) {
                // 若匹配成功，更新链接和文本
                const baiduLink = match[1] + "?pwd=" + match[2];
                const pwd = match[2];

                linkEl.href = baiduLink;
                linkEl.textContent = linkEl.textContent.trim() + " 提取码：" + pwd;
                linkEl.target = "_blank"; // 新标签页打开
            } else {
                // 未匹配到链接
                linkEl.href = "#";
                linkEl.textContent=info
                //linkEl.textContent = "未找到链接";
            }
        } else {
            // 未找到document_info或对应结构
            linkEl.href = "#";
            linkEl.textContent = "未找到链接";
        }
    }, 2000);
})();

