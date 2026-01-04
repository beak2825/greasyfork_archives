// ==UserScript==
// @name         B站直达合集页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改B站视频页的合集链接格式
// @author       AntaresFeng
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528515/B%E7%AB%99%E7%9B%B4%E8%BE%BE%E5%90%88%E9%9B%86%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/528515/B%E7%AB%99%E7%9B%B4%E8%BE%BE%E5%90%88%E9%9B%86%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const targetSelector = '#mirror-vdcon div.video-pod__header div.header-top div.left > a';
    const newPathTemplate = '/{uid}/lists/{sid}';

    function modifyCollectionLink() {
        const link = document.querySelector(targetSelector);
        if (!link) return;

        try {
            const originalUrl = new URL(link.href);

            // 提取用户ID（从路径中）
            const uid = originalUrl.pathname.split('/')[1];

            // 提取sid参数
            const sid = originalUrl.searchParams.get('sid');

            if (uid && sid) {
                // 构建新URL
                const newPath = newPathTemplate
                    .replace('{uid}', uid)
                    .replace('{sid}', sid);

                // 保留原协议和域名，只修改路径部分
                link.href = `//${originalUrl.host}${newPath}`;

                // 可选：移除监听器（如果需要）
                // observer.disconnect();
            }
        } catch (e) {
            console.error('B站合集链接修改失败:', e);
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        if (document.querySelector(targetSelector)) {
            modifyCollectionLink();
        }
    });

    // 开始观察整个文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 立即执行一次检查（用于页面已加载完成的情况）
    modifyCollectionLink();
})();