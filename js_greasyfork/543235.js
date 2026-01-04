// ==UserScript==
// @name         豆瓣读书添加Z-Library搜索链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在豆瓣读书页面添加Z-Library搜索链接
// @author       Leonecho
// @match        https://book.douban.com/subject/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543235/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%B7%BB%E5%8A%A0Z-Library%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/543235/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%B7%BB%E5%8A%A0Z-Library%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 延迟执行，确保页面元素完全加载
        setTimeout(function() {
            addZLibraryLink();
        }, 1000);
    });

    function addZLibraryLink() {
        try {
            // 获取书名
            const titleElement = document.querySelector("#wrapper > h1 > span");
            if (!titleElement) {
                console.log('未找到书名元素');
                return;
            }

            const bookTitle = titleElement.textContent || titleElement.innerText;
            if (!bookTitle) {
                console.log('书名为空');
                return;
            }

            // 查找ISBN所在的span元素
            const infoDiv = document.querySelector("#info");
            if (!infoDiv) {
                console.log('未找到info区域');
                return;
            }

            // 查找包含"ISBN:"的span元素
            const spans = infoDiv.querySelectorAll('span.pl');
            let isbnSpan = null;

            for (let span of spans) {
                if (span.textContent.includes('ISBN:')) {
                    isbnSpan = span;
                    break;
                }
            }

            if (!isbnSpan) {
                console.log('未找到ISBN标签');
                return;
            }

            // 创建搜书链接元素
            const searchSpan = document.createElement('span');
            searchSpan.className = 'pl';
            searchSpan.textContent = '搜书:';

            const zlibLink = document.createElement('a');
            zlibLink.href = `https://z-library.sk/s/${encodeURIComponent(bookTitle)}`;
            zlibLink.textContent = 'Z-Library';
            zlibLink.target = '_blank'; // 在新标签页打开
            zlibLink.style.marginLeft = '5px';

            const br = document.createElement('br');

            // 查找ISBN行的<br>标签
            const parent = isbnSpan.parentNode;
            let currentElement = isbnSpan;
            let targetBr = null;

            // 向后查找直到找到<br>标签
            while (currentElement && currentElement.nextSibling) {
                currentElement = currentElement.nextSibling;
                if (currentElement.nodeName === 'BR') {
                    targetBr = currentElement;
                    break;
                }
            }

            if (targetBr) {
                // 在<br>标签后插入新元素
                const nextSibling = targetBr.nextSibling;

                // 插入搜书标签
                parent.insertBefore(searchSpan, nextSibling);
                // 插入Z-lib链接
                parent.insertBefore(zlibLink, nextSibling);
                // 插入换行
                parent.insertBefore(br, nextSibling);
            } else {
                console.log('未找到ISBN行的<br>标签');
            }

            console.log(`已添加Z-Library搜索链接: ${bookTitle}`);

        } catch (error) {
            console.error('添加Z-Library链接时出错:', error);
        }
    }

    // 如果页面已经加载完成，直接执行
    if (document.readyState === 'complete') {
        setTimeout(function() {
            addZLibraryLink();
        }, 1000);
    }
})();