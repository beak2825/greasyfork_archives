// ==UserScript==
// @name         Solution-Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽洛谷题解页面并删除相关链接
// @author       Gemini
// @match        https://www.luogu.com.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545583/Solution-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545583/Solution-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 根据浏览器语言设置，选择合适的提示文本
    function getBlockMessage() {
        const lang = navigator.language.toLowerCase();
        if (lang.startsWith('zh')) {
            return '此页面疑似为题解，我们已为您屏蔽，如需打开，请在Tampermonkey中关闭Solution-Helper脚本。';
        } else {
            return 'This page appears to be a solution. We have blocked it for you. To view it, please disable the Solution-Helper script in Tampermonkey.';
        }
    }

    // 检查当前 URL 是否是题解页面
    const isSolutionPage = window.location.href.startsWith('https://www.luogu.com.cn/problem/solution/');

    // 如果是题解页面，则执行屏蔽操作
    if (isSolutionPage) {
        // 清空页面所有内容
        document.documentElement.innerHTML = '';

        // 创建并插入提示信息
        const message = getBlockMessage();
        const style = `
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: sans-serif;
                background-color: #f0f2f5;
                text-align: center;
            }
            .block-message {
                padding: 2em;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                color: #333;
                font-size: 1.5em;
                max-width: 80%;
            }
        `;
        document.head.innerHTML = `<style>${style}</style>`;
        document.body.innerHTML = `<div class="block-message">${message}</div>`;
        return; // 脚本停止执行，不再进行后续操作
    }

    // 监听页面变化，动态删除“查看题解”链接
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 查找并删除所有指向题解的 a 标签
                document.querySelectorAll('a[href*="/problem/solution/"]').forEach(link => {
                    link.remove();
                });
            }
        });
    });

    // 配置观察器，观察整个 body 元素及其子元素的变动
    const observerConfig = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, observerConfig);

    // 页面加载完成后立即执行一次删除操作
    window.addEventListener('load', () => {
        document.querySelectorAll('a[href*="/problem/solution/"]').forEach(link => {
            link.remove();
        });
    });

})();