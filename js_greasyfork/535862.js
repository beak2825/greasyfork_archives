// ==UserScript==
// @name         在Github和Deepwiki页面右下角添加互相跳转的浮动按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/535862-github-to-deepwiki-jump
// @version      2025.09.15
// @description  一个小小的快捷方式，带来大大的方便
// @license      MIT
// @match        https://github.com/*
// @match        https://deepwiki.com/*
// @icon         https://github.githubassets.com/favicons/favicon.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535862/%E5%9C%A8Github%E5%92%8CDeepwiki%E9%A1%B5%E9%9D%A2%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B7%BB%E5%8A%A0%E4%BA%92%E7%9B%B8%E8%B7%B3%E8%BD%AC%E7%9A%84%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/535862/%E5%9C%A8Github%E5%92%8CDeepwiki%E9%A1%B5%E9%9D%A2%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B7%BB%E5%8A%A0%E4%BA%92%E7%9B%B8%E8%B7%B3%E8%BD%AC%E7%9A%84%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    function createFloatingButton() {
        const path = window.location.pathname;
        const button = document.createElement('a');

        // 设置按钮样式
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.bottom = '20px';
        button.style.backgroundColor = '#2b3137';
        button.style.color = 'white';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.textDecoration = 'none';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontWeight = 'bold';
        button.style.zIndex = '9999';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 根据当前域名设置不同的按钮文本和链接
        if (window.location.hostname === 'deepwiki.com') {
            button.textContent = '返回GitHub';
            button.href = `https://github.com${path}`;
        } else {
            button.textContent = '跳转Deepwiki';
            button.href = `https://deepwiki.com${path}`;
        }

        button.target = '_blank';

        // 添加悬停效果
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#3f4a56';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#2b3137';
        });

        // 添加到页面
        document.body.appendChild(button);
    }

    // 页面加载完成后创建按钮
    window.addEventListener('load', createFloatingButton);
})();