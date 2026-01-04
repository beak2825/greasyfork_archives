// ==UserScript==
// @name         把微博上的 "网页链接" 打回原型url
// @namespace    http://tampermonkey.net/ 
// @version      1.0
// @description  微博会自动把所有url转成"网页链接" 或 "微博正文"，分不清，我把url全还原回来。
// @author       barnett
// @match        https://weibo.com/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491347/%E6%8A%8A%E5%BE%AE%E5%8D%9A%E4%B8%8A%E7%9A%84%20%22%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%22%20%E6%89%93%E5%9B%9E%E5%8E%9F%E5%9E%8Burl.user.js
// @updateURL https://update.greasyfork.org/scripts/491347/%E6%8A%8A%E5%BE%AE%E5%8D%9A%E4%B8%8A%E7%9A%84%20%22%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%22%20%E6%89%93%E5%9B%9E%E5%8E%9F%E5%9E%8Burl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 使用 MutationObserver 监听 DOM 变化
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 执行替换操作
                    replaceLinks();
                }
            });
        });

        // 开始观察 body 元素及其子元素的变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 替换操作函数
        function replaceLinks() {
            // 获取页面上所有的 <a> 标签
            var links = document.querySelectorAll('a');

            // 遍历所有的 <a> 标签
            links.forEach(function(link) {
                // 获取链接的文本内容
                var text = link.textContent || link.innerText;
                // 获取链接的 href 属性
                var href = link.getAttribute('href');

                // 检查文本中是否包含 "网页链接" 或 "微博正文"
                if (text.includes('网页链接') || text.includes('微博正文')) {
                    // 替换文本内容为处理后的 URL
                    link.textContent = decodeURIComponent(href.replace(/^\/\/weibo\.cn\/sinaurl\?u=/, ''));
                }
            });
        }
    });
})();