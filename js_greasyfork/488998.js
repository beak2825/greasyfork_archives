// ==UserScript==
// @name         知轩藏书跳转起点图看评价
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在知轩藏书的书名旁添加跳转到起点图的链接
// @author       icescat
// @match        https://zxcs.info/*
// @match        https://www.zxcs.info/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488998/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E8%B7%B3%E8%BD%AC%E8%B5%B7%E7%82%B9%E5%9B%BE%E7%9C%8B%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/488998/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E8%B7%B3%E8%BD%AC%E8%B5%B7%E7%82%B9%E5%9B%BE%E7%9C%8B%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择页面上的所有可能包含书名的元素
    const bookElements = document.querySelectorAll('a[rel="content"], dl#plist dt > a, div.name-box > a.name, div.book-info > h1, div.book-info.fl h4 a');

    // 遍历每个选中的元素
    bookElements.forEach(element => {
        let bookName = element.textContent.trim(); // 默认直接使用元素的文本内容作为书名

        // 如果文本被《》包围，则提取《》内的内容作为书名
        const bookNameMatch = bookName.match(/《(.*?)》/);
        if (bookNameMatch) {
            bookName = bookNameMatch[1];
        }

        // 构建指向书评网站的URL，使用encodeURIComponent确保URL的正确编码
        const reviewSiteUrl = `https://www.qidiantu.com/book/${encodeURIComponent(bookName)}`;

        // 创建一个新的链接元素，用于放置搜索图标
        const link = document.createElement('a');
        link.href = reviewSiteUrl; // 设置链接的目标地址为书评网站的搜索结果
        link.textContent = '🔍'; // 使用emoji作为搜索图标
        link.target = '_blank'; // 确保链接在新标签页中打开
        link.style.marginRight = '10px'; // 设置链接的右外边距，确保与其他内容有适当间隔
        link.style.display = 'inline-block'; // 设置链接的显示类型，保证它不会破坏周围的布局
        link.style.verticalAlign = 'middle'; // 垂直对齐方式为中间，确保图标与文本对齐

        element.before(link); // 在每个书名元素之前插入搜索图标链接
    });
})();
