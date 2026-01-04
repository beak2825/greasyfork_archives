// ==UserScript==
// @name         简书jianshu文章阅读极简优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  只有1kb,简书样式优化加去广告。
// @author       极简实用
// @match        https://www.jianshu.com/p/*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/520982/%E7%AE%80%E4%B9%A6jianshu%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%9E%81%E7%AE%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520982/%E7%AE%80%E4%B9%A6jianshu%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%9E%81%E7%AE%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载
    window.onload = function() {
        // 获取包含文章内容的元素
        const articles = document.querySelectorAll('article._2rhmJa');

        // 隐藏整篇内容
        document.body.innerHTML = '';

        articles.forEach(article => {
            // 将指定的内容添加到 body
            document.body.appendChild(article);
        });

        // 修改字体大小
        document.body.style.fontSize = '20px';

        // 设置最大宽度和居中显示，同时添加左右边距
        document.body.style.maxWidth = 'calc(100vw - 40px)';
        document.body.style.margin = '0 auto';
        document.body.style.padding = '0 20px';  // 设置左右各20px的边距

        // 可选：设置 line-height 以改善可读性
        document.body.style.lineHeight = '1.6';
    };
})();
