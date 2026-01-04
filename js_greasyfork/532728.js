// ==UserScript==
// @name         Bilibili反跟踪
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除B站链接中的追踪参数(spm_id_from和vd_source)
// @author       Seshi Rin
// @match        *://*.bilibili.com/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/532728/Bilibili%E5%8F%8D%E8%B7%9F%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/532728/Bilibili%E5%8F%8D%E8%B7%9F%E8%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理单个URL的函数
    function cleanUrl(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);

            // 需要删除的参数
            const paramsToRemove = ['spm_id_from', 'vd_source'];

            // 删除指定的参数
            paramsToRemove.forEach(param => {
                params.delete(param);
            });

            // 重建URL
            const newSearch = params.toString();
            urlObj.search = newSearch ? `?${newSearch}` : '';
            return urlObj.toString();
        } catch (e) {
            return url; // 如果URL解析失败，返回原始URL
        }
    }

    // 处理页面中的所有链接
    function processLinks() {
        const links = document.getElementsByTagName('a');
        for (let link of links) {
            if (link.href.includes('bilibili.com')) {
                const cleanedUrl = cleanUrl(link.href);
                link.href = cleanedUrl;
            }
        }
    }

    // 初始处理
    processLinks();

    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        processLinks();
    });

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察文档变化
    observer.observe(document.body, config);
})();