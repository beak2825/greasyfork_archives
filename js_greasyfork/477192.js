// ==UserScript==
// @name         知乎日报标题修改
// @namespace    人工智能AIGC大本营
// @author       Justin
// @version      1.0
// @description  将知乎日报网站的标题改为文章的实际标题
// @match        https://daily.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477192/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/477192/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 获取文章的实际标题，如果没有则返回空字符串
function getArticleTitle() {
    var titleElement = document.querySelector('.DailyHeader-title');
    if (titleElement) {
        return titleElement.textContent.trim();
    } else {
        return '';
    }
}

// 修改网站的标题，如果文章标题为空则不修改
function changeSiteTitle() {
    var articleTitle = getArticleTitle();
    if (articleTitle) {
        document.title = articleTitle + ' - 知乎日报';
    }
}

// 监听页面加载完成后执行修改标题的函数
window.addEventListener('load', changeSiteTitle);

})();
