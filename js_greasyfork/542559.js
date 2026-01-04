// ==UserScript==
// @name         feedly 批量打开最近一天 feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量打开最近一天 feed, 方便 pixiv
// @description:en  批量打开最近一天 feed, 方便 pixiv
// @author       IITII
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://feedly.com/*
// @icon         https://avatars.githubusercontent.com/u/33705067?v=4
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/542559/feedly%20%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E6%9C%80%E8%BF%91%E4%B8%80%E5%A4%A9%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/542559/feedly%20%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E6%9C%80%E8%BF%91%E4%B8%80%E5%A4%A9%20feed.meta.js
// ==/UserScript==



(async function () {
    'use strict';
    // 右上角添加按钮, 点击批量打开 articleUrls
    console.log('feedly 批量打开脚本已加载');
    let button = jQuery('<button id="feedly_batch">批量打开最近一天 feed</button>')
    button.css({
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    button.on('click', () => {
        let lastDay = jQuery('.StreamPage > .row > div > h2:first-child')
        let lastDayArticles = jQuery('.StreamPage > .row > div > h2:first-child + div')
        let articles = lastDayArticles.find('article a')
        let articleUrls = articles.map((i, a) => {
            return a.href;
        }).get()
        console.log('找到文章数量:', articleUrls.length);
        if (articleUrls.length === 0) {
            alert('没有找到文章链接');
            return;
        }
        articleUrls.forEach((url, i) => {
            // 如果没有 Tampermonkey 扩展支持，可以使用 window.open(url, '_blank') 但会被浏览器拦截
            // 这里使用 GM_openInTab 来打开新标签页 GM_openInTab(url, { active: false, insert: true });
            // 这里使用 setTimeout 来延时打开新标签页
            setTimeout(() => {
                console.log('打开文章:', url);
                // 打开新窗口
                GM_openInTab(url, { active: false, insert: true });
            }, 100 * i); // 每个链接间隔100毫秒打开
        });
    });
    jQuery('body').append(button);

})();
