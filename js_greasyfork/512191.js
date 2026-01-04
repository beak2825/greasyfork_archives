// ==UserScript==
// @name         小众软件去广告
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  去广告
// @author       You
// @match        https://www.appinn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appinn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512191/%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/512191/%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义一个函数用于隐藏包含 "FD" 的 article 元素
    function hideFDAritcles() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const spanElements = article.querySelectorAll('span');
            spanElements.forEach(span => {
                if (span.textContent.trim() === 'FD') {
                    article.style.display = 'none';
                }
            });
        });
        const divfd = document.querySelector('div.test.latestPost.post-box.vertical')
        if(divfd){
            divfd.style.display='none'
        }
        const sectionfd = document.querySelector('section.featured-section.clearfix').style.display='none'
        if(sectionfd){
            sectionfd.style.display='none'
        }
        console.log('没有足够的元素');
    }

    // 页面加载完成后执行隐藏操作
    window.onload = function() {
        hideFDAritcles(); // 执行一次隐藏操作

        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(() => {
            hideFDAritcles(); // 当 DOM 变化时重新执行隐藏操作
        });

        // 开始观察整个文档的 DOM 变动
        observer.observe(document.body, {
            // 监听直接子节点的变动
            childList: true,
            // 监听整个 DOM 树中的节点变动
            subtree: true,
        });
    };


})();