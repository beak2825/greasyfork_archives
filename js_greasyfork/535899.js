// ==UserScript==
// @name         搜索引擎切换器 / Search Engine Switcher (右侧固定版)
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description   在右侧固定显示多个搜索引擎选项，支持一键切换Google、Bing、百度、ChatGPT等11大搜索平台。新标签页打开。
// @author       PengzhanYin [Modified version]
// @match        *://www.google.com.hk*/search*
// @match        *://www.google.com/search*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://chatgpt.com/*
// @match        *://weixin.sogou.com/weixin*
// @match        *://search.bilibili.com/all*
// @match        *://www.youtube.com/results*
// @match        *://m.youtube.com/results*
// @match        *://www.zhihu.com/search*
// @match        *://github.com/search*
// @match        *://www.xiaohongshu.com/explore*
// @match        *://www.douyin.com/search/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535899/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%20%20Search%20Engine%20Switcher%20%28%E5%8F%B3%E4%BE%A7%E5%9B%BA%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535899/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%20%20Search%20Engine%20Switcher%20%28%E5%8F%B3%E4%BE%A7%E5%9B%BA%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlMapping = [
        { name: "Google", searchUrl: "https://www.google.com/search?q=", keyName: "q", testUrl: /https:\/\/www\.google\.(com|com\.hk)\/search.*/ },
        { name: "Bing", searchUrl: "https://www.bing.com/search?q=", keyName: "q", testUrl: /https:\/\/(www|cn)\.bing\.com\/search.*/ },
        { name: "百度", searchUrl: "https://www.baidu.com/s?wd=", keyName: "wd", testUrl: /https:\/\/www\.baidu\.com\/(s|baidu).*/ },
        { name: "ChatGPT", searchUrl: "https://chatgpt.com/?hints=search&q=", keyName: "q", testUrl: /https:\/\/chatgpt\.com\/.*/ },
        { name: "微信", searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query=", keyName: "query", testUrl: /https:\/\/weixin\.sogou\.com\/weixin.*/ },
        { name: "哔站", searchUrl: "https://search.bilibili.com/all?keyword=", keyName: "keyword", testUrl: /https:\/\/search\.bilibili\.com\/all.*/ },
        { name: "油管", searchUrl: "https://www.youtube.com/results?search_query=", keyName: "search_query", testUrl: /https:\/\/(www|m)\.youtube\.com\/results.*/ },
        { name: "知乎", searchUrl: "https://www.zhihu.com/search?q=", keyName: "q", testUrl: /https:\/\/www\.zhihu\.com\/search.*/ },
        { name: "GitHub", searchUrl: "https://github.com/search?q=", keyName: "q", testUrl: /https:\/\/github\.com\/search.*/ },
        { name: "小红书", searchUrl: "https://www.xiaohongshu.com/explore?q=", keyName: "q", testUrl: /https:\/\/www\.xiaohongshu\.com\/explore.*/ },
        { name: "抖音", searchUrl: "https://www.douyin.com/search/", keyName: "q", testUrl: /https:\/\/www\.douyin\.com\/search\/.*/ },
    ];

    const FONT_SIZE = '14px';
    const SIDEBAR_WIDTH = '110px';

    function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        if (variable === "q" && window.location.pathname.startsWith("/search/")) {
            return decodeURIComponent(window.location.pathname.replace("/search/", ""));
        }
        return "";
    }

    function getKeywords() {
        for (const item of urlMapping) {
            if (item.testUrl.test(window.location.href)) {
                return getQueryVariable(item.keyName);
            }
        }
        return "";
    }

    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
            #search-sidebar {
                position: fixed;
                top: 100px;
                right: 0;
                width: ${SIDEBAR_WIDTH};
                max-height: 70vh;
                overflow-y: auto;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 8px 0 0 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 2147483647;
                font-size: ${FONT_SIZE};
                padding: 8px 0;
                transition: all 0.3s ease;
            }
            #search-sidebar.collapsed {
                right: -${SIDEBAR_WIDTH};
            }
            #search-sidebar-toggle {
                position: absolute;
                left: -20px;
                top: 0;
                width: 20px;
                height: 50px;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 8px 0 0 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.1);
                user-select: none;
                z-index: 2147483646;
            }
            #search-sidebar-toggle:after {
                content: "<";
                font-size: 12px;
            }
            #search-sidebar.collapsed #search-sidebar-toggle:after {
                content: ">";
            }
            #search-sidebar-title {
                font-weight: bold;
                text-align: center;
                padding: 5px 0;
                margin-bottom: 5px;
                border-bottom: 1px solid #ddd;
                user-select: none;
            }
            #search-sidebar-content {
                transition: opacity 0.3s ease;
            }
            #search-sidebar.collapsed #search-sidebar-content {
                opacity: 0;
                pointer-events: none;
            }
            #search-sidebar a {
                display: block;
                padding: 8px 12px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.3s;
                cursor: pointer;
            }
            #search-sidebar a:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            #search-sidebar a.current {
                background-color: rgba(0, 0, 0, 0.05);
                font-weight: bold;
            }
            .dark-mode #search-sidebar, .dark-mode #search-sidebar-toggle {
                background-color: rgba(50, 50, 50, 0.9);
            }
            .dark-mode #search-sidebar-title {
                border-bottom: 1px solid #444;
            }
            .dark-mode #search-sidebar a {
                color: #fff;
            }
            .dark-mode #search-sidebar a:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            .dark-mode #search-sidebar a.current {
                background-color: rgba(255, 255, 255, 0.05);
            }
        `;
        document.head.appendChild(style);
    }

    function createSearchSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'search-sidebar';

        // 读取本地存储的折叠状态
        const isCollapsed = localStorage.getItem('search-sidebar-collapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }

        // 创建折叠/展开按钮
        const toggle = document.createElement('div');
        toggle.id = 'search-sidebar-toggle';
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            // 保存折叠状态到本地存储
            localStorage.setItem('search-sidebar-collapsed', sidebar.classList.contains('collapsed'));
        });
        sidebar.appendChild(toggle);

        const title = document.createElement('div');
        title.id = 'search-sidebar-title';
        title.innerText = '搜索引擎';
        sidebar.appendChild(title);

        // 创建内容容器
        const content = document.createElement('div');
        content.id = 'search-sidebar-content';
        sidebar.appendChild(content);

        // 确定当前搜索引擎
        let currentEngine = '';
        for (const item of urlMapping) {
            if (item.testUrl.test(window.location.href)) {
                currentEngine = item.name;
                break;
            }
        }

        const keywords = getKeywords();

        for (const item of urlMapping) {
            const a = document.createElement('a');

            // 使用urlBuilder函数（如果存在）或直接连接searchUrl和关键词
            if (item.urlBuilder) {
                a.href = item.urlBuilder(keywords);
            } else {
                a.href = item.searchUrl + encodeURIComponent(keywords);
            }

            a.innerText = item.name;
            a.target = '_blank'; // 在新标签页打开

            // 标记当前搜索引擎
            if (item.name === currentEngine) {
                a.classList.add('current');
            }

            content.appendChild(a);
        }

        document.body.appendChild(sidebar);
    }

    function updateTheme() {
        document.body.classList.toggle('dark-mode', isDarkMode());
    }

    function init() {
        // 确保只初始化一次
        if (document.getElementById('search-sidebar')) {
            return;
        }

        createStyle();
        createSearchSidebar();
        updateTheme();

        // 监听主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addListener(updateTheme);

        console.log("[搜索引擎切换器] 初始化完成");
    }

    // 谷歌搜索页面可能是动态加载的，所以需要使用多种方法确保脚本运行

    // 方法1: DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 500); // 延迟确保DOM完全准备好
        });
    }

    // 方法2: window.onload
    window.addEventListener('load', function() {
        setTimeout(init, 1000); // 延迟更长时间以确保所有动态内容加载完成
    });

    // 方法3: 立即执行 + 定时检查
    setTimeout(init, 500);

    // 方法4: 定期检查是否需要重新初始化
    setInterval(function() {
        if (!document.getElementById('search-sidebar') && document.body) {
            console.log("[搜索引擎切换器] 重新初始化");
            init();
        }
    }, 2000);

    // 方法5: MutationObserver 监视DOM变化
    const observer = new MutationObserver((mutations, obs) => {
        if (document.body && !document.getElementById('search-sidebar')) {
            console.log("[搜索引擎切换器] 通过MutationObserver初始化");
            setTimeout(init, 500); // 延迟初始化
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 方法6: 监听URL变化 (对Google SPA特别有用)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log("[搜索引擎切换器] URL变化，重新检查初始化");
            if (!document.getElementById('search-sidebar') && document.body) {
                setTimeout(init, 500);
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();