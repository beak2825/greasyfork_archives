// ==UserScript==
// @name         京东.淘宝.天猫.把手机网页转为电脑网页,到达原始地址
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  手机分享的商品链接很长，电脑打开长链时，自动转原始网页,到达原始地址。
// @author       yezi_jinn
// @match        *://item.m.jd.com/product/*.html*
// @match        *://item.taobao.com/item.htm*
// @match        *://detail.tmall.com/item.htm*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542246/%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%8A%8A%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BA%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5%2C%E5%88%B0%E8%BE%BE%E5%8E%9F%E5%A7%8B%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/542246/%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%8A%8A%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BA%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5%2C%E5%88%B0%E8%BE%BE%E5%8E%9F%E5%A7%8B%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 京东链接处理
    if (location.hostname === 'item.m.jd.com') {
        // 直接从路径提取商品ID
        const path = location.pathname;
        const idStart = path.lastIndexOf('/') + 1;
        const idEnd = path.indexOf('.html', idStart);

        if (idEnd > idStart) {
            const id = path.substring(idStart, idEnd);
            window.stop();
            location.replace(`https://item.jd.com/${id}.html`);
        }
        return;
    }

    // 淘宝/天猫链接处理
    if (location.hostname.includes('taobao.com') ||
        location.hostname.includes('tmall.com')) {

        // 关键修复：检查是否已经是简洁链接
        const search = location.search;
        if (search.split('&').length <= 2 &&
            (search.includes('?id=') || search.includes('&id='))) {
            // 已经是电脑版链接，不处理
            return;
        }

        // 提取ID
        const idIndex = search.indexOf('id=');
        if (idIndex !== -1) {
            const idStart = idIndex + 3;
            let idEnd = search.indexOf('&', idStart);
            if (idEnd === -1) idEnd = search.length;

            const id = search.substring(idStart, idEnd);

            // 验证ID为纯数字
            if (/^\d+$/.test(id)) {
                window.stop();

                // 根据域名选择目标URL
                const isTmall = location.hostname.includes('tmall');
                const newUrl = isTmall
                    ? `https://detail.tmall.com/item.htm?id=${id}`
                    : `https://item.taobao.com/item.htm?id=${id}`;

                // 仅在不同时才重定向
                if (location.href !== newUrl) {
                    location.replace(newUrl);
                }
            }
        }
    }
})();