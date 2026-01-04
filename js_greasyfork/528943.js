// ==UserScript==
// @name         豆瓣 Z-Library 资源链接（个人使用）
// @version      0.3
// @description  在豆瓣书籍页面添加 Z-Library 资源链接
// @match        https://www.douban.com/*
// @match        https://book.douban.com/*
// @match        https://search.douban.com/*
// @grant        GM_xmlhttpRequest
// @connect      zh.z-lib.gs
// @namespace https://greasyfork.org/users/1442757
// @downloadURL https://update.greasyfork.org/scripts/528943/%E8%B1%86%E7%93%A3%20Z-Library%20%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528943/%E8%B1%86%E7%93%A3%20Z-Library%20%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .zlib-link {
            display: inline-block;
            margin-top: 5px;
            padding: 3px 8px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 3px;
            font-size: 12px;
        }
        .zlib-link:hover {
            background-color: #45a049;
            color: white !important;
            text-decoration: none !important;
        }
        .zlib-link-detail {
            display: inline-block;
            margin: 10px 0;
            padding: 6px 12px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 3px;
            font-size: 14px;
        }
            /* 新增所有状态的颜色强制 */
        .zlib-link-detail:link,
        .zlib-link-detail:visited,
        .zlib-link-detail:hover,
        .zlib-link-detail:active {
            background-color: #4CAF50 !important;
            color: white !important;
            text-decoration: none !important;
        }
        .zlib-link-detail:hover {
            background-color: #45a049;
            color: white !important;
            text-decoration: none !important;
        }
    `;
    document.head.appendChild(style);

    // 为详情页添加链接
    function addZLibraryLinkToDetail() {
        // 检查是否是书籍详情页
        const titleElement = document.querySelector('h1');
        const infoDiv = document.querySelector('#info');

        if (titleElement && infoDiv && !document.querySelector('.zlib-link-detail')) {
            const bookTitle = titleElement.textContent.trim();

            // 创建容器
            const container = document.createElement('div');
            container.style.marginTop = '20px';

            // 创建 Z-Library 链接
            const zlibLink = document.createElement('a');
            zlibLink.href = `https://zh.z-lib.gs/s/${encodeURIComponent(bookTitle)}`;
            zlibLink.className = 'zlib-link-detail';
            zlibLink.textContent = '在 Z-Library 中搜索此书';
            zlibLink.target = '_blank';

            container.appendChild(zlibLink);

            // 插入到合适的位置
            const insertTarget = document.querySelector('#interest_sect_level');
            if (insertTarget) {
                insertTarget.parentNode.insertBefore(container, insertTarget);
            }
        }
    }

    // 为列表页添加链接
    function addZLibraryLinksToList() {
        // 查找所有书籍条目
        const bookItems = document.querySelectorAll('.result-list .result, .subject-item, .item');

        bookItems.forEach(item => {
            // 检查是否已经添加了链接
            if (item.querySelector('.zlib-link')) return;

            // 获取书名
            const titleElement = item.querySelector('h3 a, h2 a, .title a, .title-text');
            if (!titleElement) return;

            const bookTitle = titleElement.textContent.trim();

            // 创建 Z-Library 链接
            const zlibLink = document.createElement('a');
            zlibLink.href = `https://zh.z-lib.gs/s/${encodeURIComponent(bookTitle)}`;
            zlibLink.className = 'zlib-link';
            zlibLink.textContent = '跳转至Z-Library资源';
            zlibLink.target = '_blank';

            // 在书籍信息中添加链接
            const infoDiv = item.querySelector('.content, .info') || titleElement.parentElement;
            if (infoDiv) {
                infoDiv.appendChild(document.createElement('br'));
                infoDiv.appendChild(zlibLink);
            }
        });
    }

    // 主函数
    function addZLibraryLinks() {
        addZLibraryLinkToDetail();
        addZLibraryLinksToList();
    }

    // 立即执行一次
    addZLibraryLinks();

    // 页面加载完成后执行
    window.addEventListener('load', addZLibraryLinks);

    // 对于动态加载的内容，使用 MutationObserver 监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addZLibraryLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();