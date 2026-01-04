// ==UserScript==
// @name       x.com DEMO mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blur usernames and IDs on X.com for DEMO mode, with hover to reveal or hide
// @author       Grok & https://x.com/scavenger869
// @match        https://x.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530770/xcom%20DEMO%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530770/xcom%20DEMO%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式，控制模糊和悬浮效果
    GM_addStyle(`
        /* 默认模糊效果 */
        button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2) {
            filter: blur(5px);
            transition: filter 0.3s ease; /* 平滑过渡效果 */
        }

        /* 选项1：鼠标悬浮时移除模糊效果 */
        button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2):hover {
            filter: blur(0);
        }

        /* 选项2：鼠标悬浮时隐藏元素（注释掉选项1后启用） */
        /*
        button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2):hover {
            display: none;
        }
        */
    `);

    // 函数：确保元素被正确处理（如果需要额外的JavaScript逻辑）
    function applyBlur() {
        const usernameElements = document.querySelectorAll('button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2)');
        usernameElements.forEach(element => {
            // 确保元素有模糊效果（CSS已处理，这里可以留空）
            // 如果需要额外的JavaScript逻辑，可以在这里添加
        });
    }

    // 初次运行
    applyBlur();

    // 使用MutationObserver监听页面变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            applyBlur(); // 每次页面有变化时重新处理
        });
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();