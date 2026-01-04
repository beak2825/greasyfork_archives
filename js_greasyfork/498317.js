// ==UserScript==
// @name         全新革命性工具：用用户脚本的力量摧毁搜索
// @namespace    https://greasyfork.org/en/scripts/498317-%E5%85%A8%E6%96%B0%E9%9D%A9%E5%91%BD%E6%80%A7%E5%B7%A5%E5%85%B7-%E7%94%A8%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC%E7%9A%84%E5%8A%9B%E9%87%8F%E6%91%A7%E6%AF%81%E6%90%9C%E7%B4%A2
// @version      1.2
// @description  全新革命性工具：用用户脚本的力量摧毁搜索。
// @license      MIT
// @author       yingli
// @match        https://www.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498317/%E5%85%A8%E6%96%B0%E9%9D%A9%E5%91%BD%E6%80%A7%E5%B7%A5%E5%85%B7%EF%BC%9A%E7%94%A8%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC%E7%9A%84%E5%8A%9B%E9%87%8F%E6%91%A7%E6%AF%81%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/498317/%E5%85%A8%E6%96%B0%E9%9D%A9%E5%91%BD%E6%80%A7%E5%B7%A5%E5%85%B7%EF%BC%9A%E7%94%A8%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC%E7%9A%84%E5%8A%9B%E9%87%8F%E6%91%A7%E6%AF%81%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

GM_addStyle(`
    /* 高亮覆盖样式 */
    .highlight-overlay {
        position: absolute;
        pointer-events: none;
        z-index: 9999;
        border: 2px solid rgba(0, 0, 255, 0.5);
        background-color: rgba(0, 0, 255, 0.1);
    }

    /* 信息框样式 */
    .info-box {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 10000;
        padding: 10px;
        background-color: #333; /* 深色模式背景 */
        color: #fff; /* 深色模式文本颜色 */
        border: 1px solid #fff; /* 白色边框 */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        font-family: 'Droid Sans Mono', monospace; /* Droid Sans Mono 字体 */
        font-size: 12px;
        max-width: 300px;
    }
`);

(function() {
    'use strict';

    let 高亮覆盖 = null;
    let 信息框 = null;

    function 显示高亮覆盖(元素) {
        if (!高亮覆盖) {
            高亮覆盖 = document.createElement('div');
            高亮覆盖.classList.add('highlight-overlay');
            document.body.appendChild(高亮覆盖);
        }

        const 边界 = 元素.getBoundingClientRect();
        高亮覆盖.style.top = `${边界.top + window.scrollY}px`;
        高亮覆盖.style.left = `${边界.left + window.scrollX}px`;
        高亮覆盖.style.width = `${边界.width}px`;
        高亮覆盖.style.height = `${边界.height}px`;
        高亮覆盖.style.display = 'block';
    }

    function 隐藏高亮覆盖() {
        if (高亮覆盖) {
            高亮覆盖.style.display = 'none';
        }
    }

    function 显示信息框(元素) {
        if (!信息框) {
            信息框 = document.createElement('div');
            信息框.classList.add('info-box');
            document.body.appendChild(信息框);
        }

        const 边界 = 元素.getBoundingClientRect();
        const 元素标签名 = 元素.tagName.toLowerCase();
        const 元素ID = 元素.id ? `#${元素.id}` : '';
        const 类名 = 元素.className ? `.${元素.className.replace(/\s+/g, '.')}` : '';
        const 信息 = `${元素标签名}${元素ID}${类名}`;

        信息框.textContent = `${信息}`;
        // 信息框定位在高亮覆盖上方或下方
        const 信息框边界 = 信息框.getBoundingClientRect();
        const 窗口高度 = window.innerHeight;

        if (边界.top - 信息框边界.height > 0) {
            // 放置在高亮覆盖上方
            信息框.style.top = `${边界.top + window.scrollY - 信息框边界.height}px`;
        } else {
            // 放置在高亮覆盖下方
            信息框.style.top = `${边界.bottom + window.scrollY}px`;
        }
        信息框.style.left = `${边界.left + window.scrollX}px`;
        信息框.style.display = 'block';
    }

    function 隐藏信息框() {
        if (信息框) {
            信息框.style.display = 'none';
        }
    }

    document.body.addEventListener('mouseover', function(event) {
        event.preventDefault();
        event.stopPropagation();
        显示高亮覆盖(event.target);
        显示信息框(event.target);
    }, true);

    document.body.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // 如果点击的是文档主体，则清除高亮和信息框
        if (event.target === document.body) {
            隐藏高亮覆盖();
            隐藏信息框();
        } else {
            // 移除点击的元素
            event.target.remove();
            隐藏高亮覆盖();
            隐藏信息框();
        }
    }, true);

})();
