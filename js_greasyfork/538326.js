// ==UserScript==
// @name         1900-选中文本搜索按钮
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  选中文本搜索按钮
// @author       陛下
// @match        https://*.ws/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538326/1900-%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/538326/1900-%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let button;

    // ✅ 创建按钮元素
    function createSearchButton() {
        button = document.createElement('button');
        button.innerText = '🧲 搜磁力';
        Object.assign(button.style, {
            position: 'absolute',
            zIndex: 9999,
            padding: '4px 8px',
            fontSize: '12px',
            background: '#f1f1f1',
            border: '1px solid #aaa',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'opacity 0.2s',
        });
        button.addEventListener('click', () => {
            const text = window.getSelection().toString().trim();
            if (text) {
                const q = encodeURIComponent(text);
                window.open(`https://cili.re/search?q=${q}`, '_blank');
            }
            hideButton();
        });
        document.body.appendChild(button);
    }

    // ✅ 展示按钮
    function showButtonAt(x, y) {
        button.style.left = `${x}px`;
        button.style.top = `${y + 20}px`;
        button.style.display = 'block';
    }

    function hideButton() {
        button.style.display = 'none';
    }

    // ✅ 监听选中事件
    document.addEventListener('mouseup', (e) => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const pageX = rect.left + window.scrollX;
            const pageY = rect.top + window.scrollY;
            showButtonAt(pageX, pageY);
        } else {
            hideButton();
        }
    });

    // 如果点页面其他地方，隐藏按钮
    document.addEventListener('mousedown', (e) => {
        if (button && !button.contains(e.target)) {
            hideButton();
        }
    });

    createSearchButton();
})();
