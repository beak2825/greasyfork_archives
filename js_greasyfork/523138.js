// ==UserScript==
// @name         搜索引擎切换|搜索跳转(支持PC端+移动端)
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  快速切换搜索引擎，支持PC端、移动端，自动提取搜索关键词，一键跳转，自动隐藏、自动显示。目前支持谷歌、百度、Yandex、Bilibili、知乎等等
// @author       DQIT
// @match        *://*.google.com*/search*
// @match        *://*.google.com.hk*/search*
// @match        *://*.bing.com/search*
// @match        *://*.baidu.com/s*
// @match        *://chatgpt.com/*
// @match        *://metaso.cn/*
// @match        *://weixin.sogou.com/weixin*
// @match        *://search.bilibili.com/all*
// @match        *://m.bilibili.com/search*
// @match        *://*.zhihu.com/search*
// @match        *://*.xiaohongshu.com/explore*
// @match        *://*.douyin.com/search/*
// @match        *://*.yandex.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.perplexity.ai/*
// @match        *://*.quark.sm.cn/*
// @grant        GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526871/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%7C%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%28%E6%94%AF%E6%8C%81PC%E7%AB%AF%2B%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526871/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%7C%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%28%E6%94%AF%E6%8C%81PC%E7%AB%AF%2B%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 搜索引擎列表
    const engins = [
        { name: "Google", searchUrl: "https://www.google.com/search?q="},
        { name: "Bing", searchUrl: "https://www.bing.com/search?q="},
        { name: "百度", searchUrl: "https://www.baidu.com/s?wd="},
        { name: "夸克", searchUrl: "https://quark.sm.cn/s?q="},
        { name: "Yandex", searchUrl: "https://yandex.com/search/?text="},
        { name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q="},
        { name: "ChatGPT", searchUrl: "https://chatgpt.com/?hints=search&q="},
        { name: "秘塔", searchUrl: "https://metaso.cn/?q="},
        { name: "Youtube", searchUrl: "https://www.youtube.com/results?search_query="},
        { name: "GitHub", searchUrl: "https://github.com/search?q="},
        { name: "知乎", searchUrl: "https://www.zhihu.com/search?q="},
        { name: "B站", searchUrl: "https://search.bilibili.com/all?keyword="},
        { name: "微信", searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query="},
        { name: "小红书", searchUrl: "https://www.xiaohongshu.com/explore?q="},
        { name: "抖音", searchUrl: "https://www.douyin.com/search/"},
        { name: "Perplexity", searchUrl: "https://www.perplexity.ai/?q="},
    ];

    const paramNames = ["wd", "q", "query", "keyword", "text", "word", "search_query"]

    function getSearchKeyword() {
        const queryString = window.location.search;
        if (!queryString) {
            return null;
        }
        const urlParams = new URLSearchParams(queryString);
        for (const paramName of paramNames) {
            if (urlParams.has(paramName)) {
                return urlParams.get(paramName);
            }
        }
        return null;
    }

    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
        /* 公共样式 */
        :root {
        --bg-blur: 12px;
        --button-spacing: 8px;
        }

        /* 设备检测容器 */
        #search-tool-container {
            position: fixed;
            backdrop-filter: blur(var(--bg-blur));
            -webkit-backdrop-filter: blur(var(--bg-blur));
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 9999
        }

        /* 彩色模糊背景元素 */
        #search-tool-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 30%,
                rgba(79, 96, 204, 0.2) 0%,
                rgba(100, 100, 255, 0.2) 100%);
            filter: blur(40px);
            z-index: -1;
        }

        /* PC端样式 */
        @media (min-width: 768px) {
            #search-tool-container {
                width: 100px;
                height: 700px;
                top: 150px;
                left: 10px;
                padding: 16px 8px;
                display: flex;
                flex-direction: column;
                gap: var(--button-spacing);
            }

            .search-tool-button {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
                display: flex;
                justify-content: center;
            }

            .search-tool-button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateX(3px);
            }
        }

        /* 移动端样式 */
        @media (max-width: 767px) {
            #search-tool-container {
                width: 100%;
                height: 40px;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 4px 8px;
                display: flex;
                overflow-x: auto;
                scrollbar-width: none;
                border-radius: 8px 8px 0 0;
                background: linear-gradient(135deg, rgb(212, 227, 252, 0.4), rgb(240, 239, 253, 0.4));
            }

            #search-tool-container::-webkit-scrollbar {
                display: none;
            }

            .search-tool-button {
                flex-shrink: 0;
                min-width: 60px;
                height: 32px;
                margin: 0 4px;
                padding: 0 12px;
                border-radius: 16px;
                background: rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: rgba(0, 0, 0, 0.9);
            }

            .search-tool-button:active {
                transform: scale(0.95);
            }
        }

        /* 白天模式 */
        @media (prefers-color-scheme: light) {
            #search-tool-container {
                background-color: rgba(255, 255, 255, 0.7);
            }
        }

        /* 夜间模式 */
        @media (prefers-color-scheme: dark) {
            #search-tool-container {
                background-color: rgba(0, 0, 0, 0.5);
            }
        }

        /* 夜间模式按钮调整 */
        @media (prefers-color-scheme: dark) {
            .search-tool-button {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.9);
            }
        }
        `;
        document.head.appendChild(style);
    }

    // 创建按钮
    function createSearchTool(){
        //创建容器
        const container = document.createElement('div');
        container.id = 'search-tool-container';

        //创建按钮
        for (const engine of engins) {
            const btn = document.createElement('div');
            btn.classList.add('search-tool-button')
            btn.textContent = engine.name;
            // 绑定点击跳转事件
            btn.addEventListener('click', function() {
                let keyword = getSearchKeyword()
                window.open(engine.searchUrl + encodeURIComponent(keyword),'_self')
            });
            container.appendChild(btn);
        }

        //显示容器
        document.body.appendChild(container);

        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                // 向下滚动，隐藏横条
                container.style.display = 'none';
            } else {
                // 向上滚动，显示横条
                container.style.display = 'inline-flex';
            }

            lastScrollTop = scrollTop;
        });

    }

    function init(){
        let keyword = getSearchKeyword();
        if(!keyword){
            //未提取到关键词不显示
            return;
        } else {
            createStyle();
            createSearchTool(keyword);
        }

    }

    // 使用 MutationObserver 来确保脚本在动态加载的页面上也能正常工作
    const observer = new MutationObserver((mutations, obs) => {
        const body = document.querySelector('body');
        if (body) {
            init();
            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();