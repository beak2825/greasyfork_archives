// ==UserScript==
// @name         GitHub to Gitingest 按钮
// @name:en      GitHub to Gitingest Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 GitHub 仓库页面添加跳转到 Gitingest 的按钮
// @description:en   Adds a "One-click Jump to Gitingest" button to GitHub repository pages.
// @author       Doiiars (https://doiiars.com)
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527278/GitHub%20to%20Gitingest%20%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/527278/GitHub%20to%20Gitingest%20%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在仓库页面
    if (!location.pathname.split('/')[2]) return;

    // 创建按钮
    function createButton() {
        // 创建容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            display: inline-block;
            margin-left: 4px;
            vertical-align: middle;
        `;

        // 创建阴影元素
        const shadow = document.createElement('div');
        shadow.style.cssText = `
            position: absolute;
            width: calc(100% - 1px);
            height: calc(100% - 6px);
            background-color: rgb(17, 24, 39);
            border-radius: 4px;
            bottom: 2px;
            right: 2px;
        `;

        // 创建按钮
        const button = document.createElement('a');
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            top: -4px;
            left: -4px;
            padding: 0 7px;
            height: 20px;
            background-color: #ffc480;
            border: 1px solid rgb(17, 24, 39);
            color: rgb(17, 24, 39);
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            text-decoration: none;
            font-size: 12px;
            line-height: 18px;
            font-weight: 500;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
            transition: transform 0.1s ease-out;
        `;
        button.textContent = 'Gitingest';

        // 添加悬停效果
        container.onmouseover = () => {
            button.style.transform = 'translate(-1px, -1px)';
        };
        container.onmouseout = () => {
            button.style.transform = 'none';
        };

        // 获取当前仓库路径
        const path = location.pathname;
        button.onclick = (e) => {
            e.preventDefault();
            window.open(`https://gitingest.com${path}`, '_blank');
        };

        // 组装按钮
        container.appendChild(shadow);
        container.appendChild(button);

        // 查找目标位置
        const targetElement = document.querySelector('#repo-title-component > span.Label.Label--secondary.v-align-middle.mr-1.d-none.d-md-block');
        if (targetElement) {
            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
        }
    }

    // 初始执行
    createButton();

    // 处理页面动态加载
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const targetElement = document.querySelector('#repo-title-component > span.Label.Label--secondary.v-align-middle.mr-1.d-none.d-md-block');
                if (targetElement && !targetElement.nextSibling?.textContent?.includes('Gitingest')) {
                    createButton();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();