// ==UserScript==
// @name         链接选中
// @version      0.4
// @namespace    https://greasyfork.org/users/1171320
// @description  在链接上禁用拖拽行为，左键滑动时选择文本而不是打开链接。
// @author       yzcjd
// @author2     ChatGPT4 辅助
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532160/%E9%93%BE%E6%8E%A5%E9%80%89%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/532160/%E9%93%BE%E6%8E%A5%E9%80%89%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let startX = 0;
    let startY = 0;
    let isDraggingLink = false;
    let linkBeingDragged = null;
    const DRAG_THRESHOLD = 5; // 像素

    // 设置 user-select 样式
    const style = document.createElement('style');
    style.textContent = `
        a {
            user-select: text !important;
            -webkit-user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    // 禁用所有链接的拖拽属性
    const disableDrag = (el) => {
        if (el.tagName === 'A') {
            el.setAttribute('draggable', 'false');
        }
    };

    const observer = new MutationObserver(() => {
        document.querySelectorAll('a').forEach(disableDrag);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('a').forEach(disableDrag);

    // 鼠标按下
    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // 仅处理左键
        const link = findLink(e.target);
        if (!link) return;

        startX = e.clientX;
        startY = e.clientY;
        isDraggingLink = true;
        linkBeingDragged = link;
    });

    // 鼠标抬起时，根据是否滑动来决定是否拦截 click
    document.addEventListener('mouseup', (e) => {
        if (!isDraggingLink || !linkBeingDragged) return;

        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
            // 明确是滑动选择了文字，而不是点击
            linkBeingDragged.setAttribute('data-ignore-click', 'true');
        }

        // 重置状态
        isDraggingLink = false;
        linkBeingDragged = null;
    });

    // 捕获阶段处理点击，阻止滑动后引起的“伪点击”
    document.addEventListener('click', (e) => {
        const link = findLink(e.target);
        if (link && link.getAttribute('data-ignore-click') === 'true') {
            e.stopImmediatePropagation();
            e.preventDefault();
            link.removeAttribute('data-ignore-click');
        }
    }, true); // ← 必须使用捕获阶段！！！

    // 工具函数：查找最接近的链接
    function findLink(el) {
        while (el && el !== document.body) {
            if (el.tagName === 'A') return el;
            el = el.parentElement;
        }
        return null;
    }
})();