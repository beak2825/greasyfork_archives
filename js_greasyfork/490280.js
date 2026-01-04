// ==UserScript==
// @name 滚动到页面顶部和底部按钮
// @namespace https://viayoo.com/
// @version 1.1
// @description 添加两个按钮：一个滚动到页面顶部，另一个滚动到页面底部
// @author a stupid duck
// @run-at document-end
// @match https://*/*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/490280/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490280/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top-button';
    scrollToTopButton.innerHTML = '▲ 顶部';
    scrollToTopButton.style.position = 'fixed';
    scrollToTopButton.style.bottom = '50px';
    scrollToTopButton.style.right = '20px';
    scrollToTopButton.style.zIndex = '9999';
    scrollToTopButton.style.cursor = 'pointer';
    scrollToTopButton.style.display = 'none';
    scrollToTopButton.style.padding = '5px 10px';
    scrollToTopButton.style.backgroundColor = '#f0f0f0';
    scrollToTopButton.style.color = 'black';
    scrollToTopButton.style.border = 'none';
    scrollToTopButton.style.borderRadius = '4px';
    scrollToTopButton.style.fontSize = '14px';
    scrollToTopButton.style.opacity = '0.7';
    scrollToTopButton.title = '滚动到页面顶部';

    var scrollToBottomButton = document.createElement('button');
    scrollToBottomButton.className = 'scroll-to-bottom-button';
    scrollToBottomButton.innerHTML = '底部 ▼';
    scrollToBottomButton.style.position = 'fixed';
    scrollToBottomButton.style.bottom = '20px';
    scrollToBottomButton.style.right = '20px';
    scrollToBottomButton.style.zIndex = '9999';
    scrollToBottomButton.style.cursor = 'pointer';
    scrollToBottomButton.style.display = 'none';
    scrollToBottomButton.style.padding = '5px 10px';
    scrollToBottomButton.style.backgroundColor = '#f0f0f0';
    scrollToBottomButton.style.color = 'black';
    scrollToBottomButton.style.border = 'none';
    scrollToBottomButton.style.borderRadius = '4px';
    scrollToBottomButton.style.fontSize = '14px';
    scrollToBottomButton.style.opacity = '0.7';
    scrollToBottomButton.title = '滚动到页面底部';

    scrollToTopButton.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    scrollToBottomButton.onclick = function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    document.body.appendChild(scrollToTopButton);
    document.body.appendChild(scrollToBottomButton);

    window.addEventListener('scroll', function() {
        var showButtons = window.pageYOffset > 100;
        scrollToTopButton.style.display = showButtons ? 'block' : 'none';
        scrollToBottomButton.style.display = showButtons ? 'block' : 'none';
    });
})();