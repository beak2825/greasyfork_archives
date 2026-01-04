// ==UserScript==
// @name         Fake知乎
// @namespace    https://example.com/
// @description  在常见搜索引擎中屏蔽知乎相关结果，不登陆就不让看，那就不要怪人民放弃它了。
// @run-at       document-start
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://*.baidu.com/*
// @match        *://*.yahoo.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.zhihu.cn/*
// @version      1.4.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522008/Fake%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/522008/Fake%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 屏蔽逻辑实现
    const blockZhihuResults = () => {
        const searchEngines = [
            { name: 'google', selector: 'div.g', filter: (el) => el.innerHTML.includes('zhihu.com') },
            { name: 'bing', selector: '.b_algo', filter: (el) => el.innerHTML.includes('zhihu.com') },
            { name: 'baidu', selector: '.c-container', filter: (el) => el.innerHTML.includes('zhihu.com') },
            { name: 'yahoo', selector: '.dd.algo', filter: (el) => el.innerHTML.includes('zhihu.com') },
            { name: 'duckduckgo', selector: '.result', filter: (el) => el.innerHTML.includes('zhihu.com') },
            { name: 'bing-international', selector: '.b_algo', filter: (el) => el.innerHTML.includes('zhihu.com') || el.querySelector('a')?.href.includes('zhihu.com') },
        ];

        const hostname = window.location.hostname;
        const engine = searchEngines.find((engine) => hostname.includes(engine.name) || (hostname.includes('bing.com') && engine.name === 'bing-international'));

        if (engine) {
            document.querySelectorAll(engine.selector).forEach((result) => {
                if (engine.filter(result)) {
                    result.remove();
                }
            });
        }
    };

    // 新的检测方式：根据关键字进一步剔除
    const removeByKeywords = () => {
        const keywords = ['zhihu.com', '知乎'];
        const containerSelectors = ['div', 'section', 'article', 'main']; // 限定在常见的容器内查找
        containerSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el) => {
                keywords.forEach((keyword) => {
                    if (el.innerHTML.includes(keyword)) {
                        el.remove();
                    }
                });
            });
        });
    };

    // 快速屏蔽逻辑，在 DOMContentLoaded 前尽快执行
    const quickBlock = () => {
        const observer = new MutationObserver(() => {
            blockZhihuResults();
            removeByKeywords();
        });
        const resultContainer = document.querySelector('main, #search, #b_content'); // 限制到搜索结果容器
        if (resultContainer) {
            observer.observe(resultContainer, { childList: true, subtree: true });
        }
    };

    // 动态监控器
    const dynamicObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    blockZhihuResults();
                    removeByKeywords();
                }
            });
        });
    });

    // 初始化
    const init = () => {
        blockZhihuResults();
        removeByKeywords();

        // 启动动态监控
        dynamicObserver.observe(document.body, { childList: true, subtree: true });

        // 监听页面历史记录变化（如翻页或返回）
        window.addEventListener('popstate', () => {
            blockZhihuResults();
            removeByKeywords();
        });
        window.addEventListener('hashchange', () => {
            blockZhihuResults();
            removeByKeywords();
        });
    };

    // 页面加载时执行
    quickBlock();
    init();
})();
