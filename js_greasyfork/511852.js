// ==UserScript==
// @name         豆瓣读书 Zlib 之间快捷跳转
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Adds a hyperlink to the ISBN on Douban book pages to search on Zlib.
// @author       tianyw0
// @match        https://book.douban.com/subject/*
// @match        https://singlelogin.re/book/*
// @match        https://z-library.sk/book/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511852/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20Zlib%20%E4%B9%8B%E9%97%B4%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/511852/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20Zlib%20%E4%B9%8B%E9%97%B4%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 ISBN 号
    function getDoubanISBN() {
        const infoDiv = document.querySelector('#info');
        if (infoDiv) {
            const infoText = infoDiv.textContent;
            const isbnRegex = /ISBN:\s*(\d{13}|\d{10})/i;
            const match = infoText.match(isbnRegex);
            if (match) {
                return match[1].trim();
            }
        }
        return null;
    }

    // 将 ISBN 改成超链接
    function genZlibLink() {
        const isbn = getDoubanISBN();
        if (isbn) {
            const bookname = document.querySelector('span[property="v:itemreviewed"]').textContent;
            const infoDiv = document.querySelector('#info');
            const spans = infoDiv.querySelectorAll('span.pl');
            for (let span of spans) {
                if (span.textContent.trim() === 'ISBN:') {
                    const nextSpan = span.nextSibling;
                    if (nextSpan) {
                        const link = document.createElement('a');
                        link.href = `https://z-library.sk/s/${isbn + ' ' + bookname}`;
                        link.target = '_blank';
                        link.textContent = nextSpan.textContent;
                        span.insertAdjacentElement('afterend', link);
                        console.log(nextSpan);
                        nextSpan.remove();
                        break;
                    }
                }
            }
        }
    }
    window.addEventListener('load', genZlibLink);

    function genDoubanLink() {
        // 获取书籍标题
        const bookTitleElement = document.querySelector('h1[itemprop="name"]')
        const bookName = bookTitleElement.innerText.trim();
        if (bookTitleElement && bookName) {
            // 构建豆瓣搜索链接
            const doubanSearchUrl = `https://www.douban.com/search?cat=1001&source=suggest&q=${encodeURIComponent(bookName)}`;

            // 创建一个超链接元素
            const linkElement = document.createElement('a');
            linkElement.href = doubanSearchUrl;
            linkElement.target = '_blank'; // 在新标签页中打开链接
            linkElement.innerText = bookName;
            linkElement.className = 'douban-search-link'; // 添加CSS类

            // 替换原有的书籍标题元素
            bookTitleElement.innerHTML = '';
            bookTitleElement.appendChild(linkElement);

            // 添加CSS样式
            const style = document.createElement('style');
            style.textContent = `
                .douban-search-link {
                    color: #428bca; /* 设置超链接颜色 */
                    text-decoration: none; /* 去掉下划线 */
                }
                .douban-search-link:hover {
                    text-decoration: underline; /* 鼠标悬停时显示下划线 */
                }
            `;
            document.head.appendChild(style);
        }
    }
    window.addEventListener('load', genDoubanLink);
})();