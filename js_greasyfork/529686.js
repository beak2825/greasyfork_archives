// ==UserScript==
// @name         搜索引擎切换器（改）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  🚀 一键切换多个搜索引擎！支持Google、Bing、百度等搜索平台。可拖拽、自动隐藏，提升您的搜索效率。适配暗黑模式，让搜索更智能、更便捷！
// @author       coccvo
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtVJREFUWEfNlk1oE1EQx/+JK42JQVsLfpwEPURQa/1CKtKD4MWSg+hBoaCVBJR6sUqvehOMBaVaktJeQgXxIqZnhYIWilIUJCoeBcUqKobUfK6+tzvb997uJsRNGxdCNvvmzfzmP/Nm40OLL1+L44MAdBVEfz4IX88ophN9ON6zld8vw+VjAPqVM924OXh4Gfy7u7w6+gyJ+/NcAZ1l24qLqfp/ATAiUsPp3m090DuGdWvb8OV7Xtp/ZM8WzNw7wcUV95LaNgXIKH7jKcYfv+F21Iz0LT5rZP3Qzk2YTZ2UKm0DuD4xh2t/P2oQ+k2ZiF66tnfi1YevUuarNT9K5So3CwY05H+XrXVxr2MP0HFTMxZlI6Cjlx7hycuPkvP2Y+P4kSvYgIozF2197ghQrlShrfJbxpv7JvFpekDafPD8Q8xNnLJq63aCxPI52Xg6BaRULBZDKpWyZ8dHDLBr2wa8Tp92ZPxnAKtM+tIA9ZkBeXmU5xs7gvisqEj9xOeA2GT1BtLesw8w/37BCiIG3j8whBeTtywXBMJs1GFHSbi+C2qBiI6Z3eW3tlcJRiKGa2YbCoWQz+cd26DRtyHrzgpzSpmLwSkoPWO/FVhbvEYBjHKZALUyZ2u3dwdQKRYsezYQVRkaBojH40gmk1wBJwAWgGWuqmAqxobBmDSM6jWdsq5HIhFks9maALSn8Osn7h5YLyoQAfDOC8A3AB1Ugn3nhtA7nHDNQWxEUwHPJTBbwOj6WmWArmNkh7/pTcgBxEZk9xdmF7CmvdNS4k5XEOXCohqcncOQ1yak/Xoul+Pnm32Hw2FbGdRZ4XQCuIoNNqForhOAmw+aFXp/v1GydNoW0wuAVQ52UyqVoGkaMpkMotGoxEQAJoQU0yuAVRIHFaQxTxBtU1MoVvmfFb7eLIB6lTQaVy6FcZDq7WziuiPESgIsHWFBiZUGkBoXQKEVAFJVWw7wBwL5ZxuvPFSKAAAAAElFTkSuQmCC
// @match        *://www.google.com*/search*
// @match        *://chat.baidu.com/*
// @match        *://sou.com/*
// @match        *://www.n.cn/*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://chatgpt.com/*
// @match        *://ygocdb.com/*
// @match        *://weixin.sogou.com/weixin*
// @match        *://search.bilibili.com/all*
// @match        *://www.emojiall.com/*
// @match        *://metaso.cn/*
// @match        *://s.weibo.com/*
// @match        *://www.zhihu.com/search*
// @match        *://github.com/search*
// @match        *://www.xiaohongshu.com/explore*
// @match        *://www.douyin.com/search/*
// @grant        unsafeWindow
// @grant        window.onload
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529686/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529686/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlMapping = [
        { name: "谷歌🎨", searchUrl: "https://www.google.com/search?q=", keyName: "q", testUrl: /https:\/\/www\.google\.(com|com\.hk)\/search.*/ },
        { name: "百度AI💡", searchUrl: "https://chat.baidu.com/search?word=", keyName: "word", testUrl: /https:\/\/chat.baidu.com\/search\.*/ },
        { name: "秘塔AI🤖", searchUrl: "https://metaso.cn/?q=", keyName: "q", testUrl: /https:\/\/metaso\.cn\/*/ },
        { name: "纳米AI⚛️", searchUrl: "https://www.n.cn/?q=", keyName: "q", testUrl: /https:\/\/www\.n\.cn\/*/ },
        { name: "Bilibili📺", searchUrl: "https://search.bilibili.com/all?keyword=", keyName: "keyword", testUrl: /https:\/\/search\.bilibili\.com\/all.*/ },
        { name: "Bing🔍️", searchUrl: "https://cn.bing.com/search?form=QBRE&q=", keyName: "q", testUrl: /https:\/\/cn\.bing\.com\/search\?form\=QBRE\&.*/ },
        { name: "百度🐻", searchUrl: "https://www.baidu.com/s?wd=", keyName: "wd", testUrl: /https:\/\/www\.baidu\.com\/(s|baidu).*/ },
        { name: "百鸽🟦", searchUrl: "https://ygocdb.com/?search=", keyName: "search", testUrl: /https:\/\/ygocdb\.com\/.*/ },
        { name: "微信💚", searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query=", keyName: "query", testUrl: /https:\/\/weixin\.sogou\.com\/weixin.*/ },
        { name: "微博👁️", searchUrl: "https://s.weibo.com/weibo?q=", keyName: "q", testUrl: /https:\/\/s\.weibo\.com\/.*/ },
        { name: "知乎📚", searchUrl: "https://www.zhihu.com/search?q=", keyName: "q", testUrl: /https:\/\/www\.zhihu\.com\/search.*/ },
        { name: "ICON✡️", searchUrl: "https://www.flaticon.com/search?word=", keyName: "word", testUrl: /https:\/\/www\.flaticon\.com\/search.*/ },
        { name: "Emojiall😀", searchUrl: "https://www.emojiall.com/zh-hans/search_results?keywords=", keyName: "keywords", testUrl: /https:\/\/www\.emojiall\.com\/zh-hans\/search_results.*/ },
        { name: "GitHub🐙", searchUrl: "https://github.com/search?q=", keyName: "q", testUrl: /https:\/\/github\.com\/search.*/ },
        { name: "小红书📕", searchUrl: "https://www.xiaohongshu.com/explore?q=", keyName: "q", testUrl: /https:\/\/www\.xiaohongshu\.com\/explore.*/ },
        { name: "抖音🎵", searchUrl: "https://www.douyin.com/search/", keyName: "q", testUrl: /https:\/\/www\.douyin\.com\/search\/.*/ },
    ];

    const ICON_SIZE = '28px';
    const LIST_WIDTH = '95px';
    const FONT_SIZE = '14px';
    const AUTO_HIDE_DELAY = 5000; // 5 seconds

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
            #search-app-box {
                position: fixed;
                top: 100px;
                left: 0;
                width: ${ICON_SIZE};
                height: ${ICON_SIZE};
                background-color: transparent;
                z-index: 2147483647;
                cursor: move;
                font-size: ${FONT_SIZE};
                transition: left 0.3s ease-in-out;
            }
            #search-app-icon {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: ${ICON_SIZE};
                user-select: none;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 0 50% 50% 0;
            }
            #search-engine-list {
                position: absolute;
                top: 0;
                left: ${ICON_SIZE};
                width: ${LIST_WIDTH};
                max-height: 70vh;
                overflow-y: auto;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                opacity: 0;
                visibility: hidden;
                transform: translateX(-10px);
                transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            }
            #search-engine-list a {
                display: block;
                padding: 8px 12px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.3s;
            }
            #search-engine-list a:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            .dark-mode #search-app-icon {
                background-color: rgba(50, 50, 50, 0.7);
            }
            .dark-mode #search-engine-list {
                background-color: rgba(50, 50, 50, 0.9);
            }
            .dark-mode #search-engine-list a {
                color: #fff;
            }
            .dark-mode #search-engine-list a:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            #search-app-box.hidden {
                left: -8px;
            }
            #search-app-box.dragging {
                transition: none;
            }
        `;
        document.head.appendChild(style);
    }

    function createSearchBox() {
        const div = document.createElement('div');
        div.id = 'search-app-box';

        const icon = document.createElement('div');
        icon.id = 'search-app-icon';
        icon.innerText = '🔍';
        div.appendChild(icon);

        const listContainer = document.createElement('div');
        listContainer.id = 'search-engine-list';

        for (const item of urlMapping) {
            const a = document.createElement('a');
            a.href = item.searchUrl + encodeURIComponent(getKeywords());
            a.innerText = item.name;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = a.href;
            });
            listContainer.appendChild(a);
        }

        div.appendChild(listContainer);
        document.body.appendChild(div);

        let hideTimeout;

        function showSearchBox() {
            div.classList.remove('hidden');
            clearTimeout(hideTimeout);
        }

        function hideSearchBox() {
            div.classList.add('hidden');
        }

        function resetHideTimer() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hideSearchBox, AUTO_HIDE_DELAY);
        }

        div.addEventListener('mouseenter', () => {
            showSearchBox();
            listContainer.style.opacity = '1';
            listContainer.style.visibility = 'visible';
            listContainer.style.transform = 'translateX(0)';
        });

        div.addEventListener('mouseleave', () => {
            listContainer.style.opacity = '0';
            listContainer.style.visibility = 'hidden';
            listContainer.style.transform = 'translateX(-10px)';
            resetHideTimer();
        });

        // 拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        div.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = div.offsetLeft;
            startTop = div.offsetTop;
            showSearchBox();
            e.preventDefault();
            div.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            div.style.left = `${startLeft + dx}px`;
            div.style.top = `${startTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            resetHideTimer();
            div.classList.remove('dragging');
        });

        // 初始化隐藏定时器
        resetHideTimer();
    }

    function updateTheme() {
        document.body.classList.toggle('dark-mode', isDarkMode());
    }

    function init() {
        createStyle();
        createSearchBox();
        updateTheme();

        // 监听主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addListener(updateTheme);
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
