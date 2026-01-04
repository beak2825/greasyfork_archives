// ==UserScript==
// @name         xueqiu清理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改网页的标题和图标
// @author       You
// @match        *://xueqiu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519809/xueqiu%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519809/xueqiu%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即执行脚本
    (function() {

        // 批量删除指定的标签
        const elementsToRemove = [
            'div.nav__placeholder',
            'nav.nav.stickyFixed',
            'div.private__domain__association__ad',
            'div.article__author',
            'h1.article__bd__title',
            'div.article__bd__from'
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.remove();
                }
            });
        });

       // 隐藏登录弹窗
        const dialogLogin = document.querySelector(".modals.dimmer.js-shown");
        if (dialogLogin) {
            dialogLogin.style.setProperty("display", "none", "important");
            document.body.classList.remove('scroll-no');
        }


        // 修改网页标题
        document.title = "xx";

       // 定义新的图标地址
    var newIconUrl = 'https://hailuoai.com/assets/logo/favicon.png?v=1'; // 替换为你想要的新图标地址

    // 查找现有的图标链接
    var link = document.querySelector("link[rel*='icon']");

    if (link) {
        // 如果找到了现有的图标链接，则替换其href属性
        link.href = newIconUrl;
    } else {
        // 如果没有找到现有的图标链接，则创建一个新的图标链接
        var newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = newIconUrl;
        document.head.appendChild(newLink);
    }
    })();
})();