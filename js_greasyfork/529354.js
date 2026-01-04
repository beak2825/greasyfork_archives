// ==UserScript==
// @name         网上读书园地签到功能增强
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在指定UL菜单中添加带自定义链接的菜单项
// @author       YourName
// @match        *://www.readfree.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529354/%E7%BD%91%E4%B8%8A%E8%AF%BB%E4%B9%A6%E5%9B%AD%E5%9C%B0%E7%AD%BE%E5%88%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529354/%E7%BD%91%E4%B8%8A%E8%AF%BB%E4%B9%A6%E5%9B%AD%E5%9C%B0%E7%AD%BE%E5%88%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        targetMenuId: 'myitem_menu',  // 目标菜单容器的ID
        linkText: '签到',         // 链接显示文本
        linkHref: 'https://www.readfree.net/bbs/thread-5924299-1-1.html',  // 链接地址
        linkTarget: '_self',        // 链接打开方式
        maxWaitTime: 5000            // 最大等待时间（毫秒）
    };

    function createMenuItem() {
        const menu = document.getElementById(config.targetMenuId);
        if (!menu || menu.tagName !== 'UL') return false;

        // 创建菜单项结构
        const li = document.createElement('li');
        const a = document.createElement('a');

        // 配置链接属性
        a.textContent = config.linkText;
        a.href = config.linkHref;
        a.target = config.linkTarget;
        a.style.cssText = 'color: inherit; text-decoration: none;';

        // 组合元素
        li.appendChild(a);
        menu.appendChild(li);
        return true;
    }

    // 立即尝试创建
    if (createMenuItem()) return;

    // 动态等待机制
    const startTime = Date.now();
    const timer = setInterval(() => {
        if (createMenuItem() || Date.now() - startTime > config.maxWaitTime) {
            clearInterval(timer);
        }
    }, 100);
})();