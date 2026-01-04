// ==UserScript==
// @name         123AV修改页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让网页标题自动换行显示
// @author       qwwei
// @match        *://123AV.COM/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519090/123AV%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/519090/123AV%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加样式
    const css = `
        /* 通用标题选择器 */
        h1, h2, h3, h4, h5, h6,
        .title,
        [class*="title"],
        a[title],
        div[class*="detail"] a,
        .video-title,
        .post-title,
        .article-title {
            white-space: normal !important;
            word-break: break-word !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            line-height: 1.4 !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 创建观察器以处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        clearTimeout(window._titleUpdateTimeout);
        window._titleUpdateTimeout = setTimeout(() => {
            const titles = document.querySelectorAll(`
                h1, h2, h3, h4, h5, h6,
                .title,
                [class*="title"],
                a[title],
                div[class*="detail"] a,
                .video-title,
                .post-title,
                .article-title
            `);

            titles.forEach(title => {
                if (title) {
                    title.style.whiteSpace = 'normal';
                    title.style.wordBreak = 'break-word';
                    title.style.wordWrap = 'break-word';
                    title.style.overflowWrap = 'break-word';
                    title.style.lineHeight = '1.4';
                }
            });
        }, 100);
    });

    // 添加到脚本中
window.addEventListener('error', function(e) {
    console.log('Caught error:', e);
    e.preventDefault(); // 阻止错误显示
});
    async function fetchWithRetry(url, retries = 3) {
    for(let i = 0; i < retries; i++) {
        try {
            return await fetch(url);
        } catch(err) {
            if(i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000 * (i + 1))); // 延迟重试
        }
    }
}

    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面卸载时清理
    window.addEventListener('unload', () => observer.disconnect());
})();