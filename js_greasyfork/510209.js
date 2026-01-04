// ==UserScript==
// @name         Linux.do简化版超级链接获取器（支持拖拽）
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      3.2
// @description  就是想跳转到用户的主题下面右键点击时智能获取链接并显示在可拖拽的框中，可编辑链接并跳转，同时禁用默认右键菜单
// @match        https://linux.do/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510209/Linuxdo%E7%AE%80%E5%8C%96%E7%89%88%E8%B6%85%E7%BA%A7%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%99%A8%EF%BC%88%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510209/Linuxdo%E7%AE%80%E5%8C%96%E7%89%88%E8%B6%85%E7%BA%A7%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E5%99%A8%EF%BC%88%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #super-link-status {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: move;
        }
        #super-link-status input {
            width: 300px;
            margin-right: 5px;
            padding: 2px 5px;
            cursor: text;
        }
        #super-link-status button {
            padding: 2px 5px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    // 创建状态显示框
    const statusBox = document.createElement('div');
    statusBox.id = 'super-link-status';
    statusBox.innerHTML = `
        <input type="text" id="super-link-edit" placeholder="右键点击获取链接...">
        <button id="super-jump-button">跳转</button>
    `;
    document.body.appendChild(statusBox);

    // 添加拖拽功能
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    statusBox.addEventListener('mousedown', function(e) {
        if (e.target === statusBox) {
            isDragging = true;
            dragOffsetX = e.clientX - statusBox.getBoundingClientRect().left;
            dragOffsetY = e.clientY - statusBox.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            statusBox.style.left = (e.clientX - dragOffsetX) + 'px';
            statusBox.style.top = (e.clientY - dragOffsetY) + 'px';
            statusBox.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 超级链接检测函数
    function superDetectLink(element) {
        // 检查href属性
        if (element.href) {
            return element.href;
        }

        // 检查所有可能包含链接的属性
        const potentialAttributes = ['src', 'data-href', 'data-url', 'data-link'];
        for (let attr of potentialAttributes) {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                if (value && value.match(/^(https?:\/\/|\/)/)) {
                    return value;
                }
            }
        }

        // 检查所有data-*属性
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.value.match(/^(https?:\/\/|\/)/)) {
                return attr.value;
            }
        }

        // 检查onclick属性
        const onclickAttr = element.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/['"]((https?:\/\/|\/)[^'"]+)['"]/);
            if (match) {
                return match[1];
            }
        }

        // 检查内部文本是否包含URL
        const text = element.textContent;
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            return urlMatch[0];
        }

        return null;
    }

    // 递归搜索链接
    function recursivelySearchForLink(element) {
        const link = superDetectLink(element);
        if (link) {
            return link;
        }

        for (let child of element.children) {
            const childLink = recursivelySearchForLink(child);
            if (childLink) {
                return childLink;
            }
        }

        return null;
    }

    // 右键点击事件处理函数
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // 禁用默认右键菜单

        const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
        let content = '';

        if (clickedElement) {
            content = recursivelySearchForLink(clickedElement) || '';
        }

        if (!content) {
            content = `在 (${e.pageX}, ${e.pageY}) 处没有找到链接`;
        } else if (!content.endsWith('/activity/topics')) {
            content += '/activity/topics';
        }

        const linkEdit = document.getElementById('super-link-edit');
        linkEdit.value = content;
    });

    // 跳转按钮功能
    document.getElementById('super-jump-button').addEventListener('click', function() {
        const linkEdit = document.getElementById('super-link-edit');
        const url = linkEdit.value.trim();
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('请输入有效的链接！');
        }
    });
})();