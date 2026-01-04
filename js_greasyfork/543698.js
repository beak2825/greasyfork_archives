// ==UserScript==
// @name         聚合搜索
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  整合网页搜索，优化UI，深色模式支持, 在 https://greasyfork.org/zh-CN/scripts/436613-%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2/   的基础上改进。优化了秘塔AI页面的位置和当前搜索引擎高亮。
// @author       Peng Shiyu, 海洋空氣, xubairr
// @match        *://www.baidu.com/s*
// @match        *://*.bing.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.com/search*
// @match        *://metaso.cn/search*
// @match        *://metaso.cn/search/*
// @match        *://duckduckgo.com/?q*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543698/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/543698/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 搜索网址配置
    const urlMapping = [
        { name: '百度', searchUrl: 'https://www.baidu.com/s?wd=', keyName: 'wd', testUrl: /https:\/\/www\.baidu\.com\/s.*/ },
        { name: '必应国内版', searchUrl: 'https://www.bing.com/search?ensearch=0&q=', keyName: 'q', testUrl: /https:\/\/www\.bing\.com\/search.*/ },
        { name: '必应国际版', searchUrl: 'https://www.bing.com/search?ensearch=1&q=', keyName: 'q', testUrl: /https:\/\/www\.bing\.com\/search.*/ },
        { name: 'Google', searchUrl: 'https://www.google.com/search?q=', keyName: 'q', testUrl: /https:\/\/www\.google\.com\/search.*/ },
        { name: 'Google.hk', searchUrl: 'https://www.google.com.hk/search?q=', keyName: 'q', testUrl: /https:\/\/www\.google\.com\.hk\/search.*/ },
        { name: '秘塔AI', searchUrl: 'https://metaso.cn?q=', keyName: 'q', testUrl: /https:\/\/metaso\.cn\/.*/ },
        { name: 'DuckDuckGo', searchUrl: 'https://duckduckgo.com/?q=', keyName: 'q', testUrl: /https:\/\/duckduckgo\.com\/.*(\?q=.*)?/ }
    ];

    // 获取 URL 参数
    function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const pairs = query.split("&");
        for (let pair of pairs) {
            const [key, value] = pair.split("=");
            if (key === variable) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    // 获取当前关键词
    function getKeywords() {
        for (let item of urlMapping) {
            if (item.testUrl.test(window.location.href)) {
                return getQueryVariable(item.keyName);
            }
        }
        return '';
    }

    // 判断是否为深色模式
    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 判断当前搜索引擎
    function getCurrentEngine() {
        for (let item of urlMapping) {
            if (item.testUrl.test(window.location.href)) {
                return item.name;
            }
        }
        return null;
    }

    // 添加 UI 元素
    function addBox() {
        // 删除旧的
        const oldBox = document.getElementById('search-app-box');
        if (oldBox) oldBox.remove();

        const keywords = getKeywords();
        const darkMode = isDarkMode();
        const currentEngine = getCurrentEngine(); // 获取当前搜索引擎名称

        // 创建主容器
        const div = document.createElement('div');
        div.id = 'search-app-box';

        // --- 优化1: 根据页面调整位置 ---
        let topPosition = '160px'; // 默认位置

        // 对秘塔AI页面单独调整高度
        if (window.location.hostname.includes('metaso.cn')) {
            topPosition = '47vh'; // 屏幕一半的位置
        }

        div.style.cssText = `
            position: fixed;
            top: ${topPosition};
            left: 20px;
            width: 120px;
            background-color: ${darkMode ? '#2d2d2d' : '#ffffff'};
            color: ${darkMode ? '#f0f0f0' : '#333333'};
            font-size: 13px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 99999;
            padding: 10px 0;
            transition: background-color 0.3s ease, color 0.3s ease;
        `;
        document.body.insertAdjacentElement("afterBegin", div);

        // 标题
        const title = document.createElement('div');
        title.innerText = "🔍 聚合搜索";
        title.style.cssText = `
            text-align: center;
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 14px;
        `;
        div.appendChild(title);

        // 搜索链接
        urlMapping.forEach((item, index) => {
            const a = document.createElement('a');
            a.href = item.searchUrl + encodeURIComponent(keywords);
            a.target = '_self';
            a.innerText = item.name;
            a.style.cssText = `
                display: block;
                padding: 8px 12px;
                text-decoration: none;
                color: inherit;
                transition: background-color 0.2s ease;
                border-radius: 4px;
                margin: 0 6px;
                cursor: pointer;
            `;

            // --- 优化2: 高亮当前搜索引擎 ---
            if (item.name === currentEngine) {
                a.style.backgroundColor = darkMode ? 'rgba(66, 133, 244, 0.3)' : 'rgba(66, 133, 244, 0.2)'; // 使用 Google 蓝的半透明作为高亮色
                a.style.fontWeight = 'bold';
                // 可以根据需要调整高亮颜色
                // a.style.color = darkMode ? '#4285f4' : '#1a73e8'; // 改变文字颜色
            }

            // 点击事件：在当前页面跳转
            a.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = item.searchUrl + encodeURIComponent(keywords);
            });

            a.onmouseenter = () => {
                // 鼠标悬停时，临时覆盖高亮背景色
                a.style.backgroundColor = darkMode ? '#444' : '#eaeaea';
            };
            a.onmouseleave = () => {
                // 鼠标离开时，恢复高亮背景色或透明
                if (item.name === currentEngine) {
                    a.style.backgroundColor = darkMode ? 'rgba(66, 133, 244, 0.3)' : 'rgba(66, 133, 244, 0.2)';
                } else {
                    a.style.backgroundColor = 'transparent';
                }
            };
            div.appendChild(a);
        });
    }

    // 页面变化监听
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', addBox);
    }

    // 初始化
    window.addEventListener('load', addBox);
    // 对于单页应用，URL 变化时也需要重新添加
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });

    function onUrlChange() {
        // 简单的防抖，避免频繁调用
        setTimeout(addBox, 100);
    }

})();