// ==UserScript==
// @name               Fix Scrollbar Position on Page Up/Page Down in ContentEditable
// @name:zh-TW         修正 ContentEditable 中按下 Page Up/Page Down 時滾動條位置不正確問題
// @namespace          Violentmonkey Scripts
// @match              https://chatgpt.com/c/*
// @grant              none
// @version            1.0
// @author             JohnnyZhou@TW
// @description        Prevents scrollbar misalignment when pressing Page Up/Page Down in the prompt input area of contenteditable elements by handling key events and adjusting cursor position accordingly.
// @description:zh-TW  當在 contenteditable 元素的提示輸入區域按下 Page Up/Page Down 鍵時，通過處理按鍵事件並調整游標位置，防止滾動條位置錯位。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518665/Fix%20Scrollbar%20Position%20on%20Page%20UpPage%20Down%20in%20ContentEditable.user.js
// @updateURL https://update.greasyfork.org/scripts/518665/Fix%20Scrollbar%20Position%20on%20Page%20UpPage%20Down%20in%20ContentEditable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 將游標移動到指定元素的開頭
     * @param {HTMLElement} element - 目標元素
     */
    function setCaretToStart(element) {
        const range = document.createRange();
        const sel = window.getSelection();

        // 找到第一個可編輯的子節點
        let firstNode = element.querySelector('p, span, div');
        if (firstNode) {
            range.setStart(firstNode, 0);
        } else {
            range.setStart(element, 0);
        }
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * 將游標移動到指定元素的結尾
     * @param {HTMLElement} element - 目標元素
     */
    function setCaretToEnd(element) {
        const range = document.createRange();
        const sel = window.getSelection();

        // 找到最後一個可編輯的子節點
        let lastNode = getLastEditableNode(element);
        if (lastNode) {
            if (lastNode.nodeType === Node.TEXT_NODE) {
                range.setStart(lastNode, lastNode.textContent.length);
            } else {
                range.setStart(lastNode, lastNode.childNodes.length);
            }
        } else {
            range.setStart(element, element.childNodes.length);
        }
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * 遞迴查找最後一個可編輯的子節點
     * @param {HTMLElement} element - 目標元素
     * @returns {Node} 最後一個可編輯的子節點
     */
    function getLastEditableNode(element) {
        if (!element) return null;
        if (element.lastChild) {
            return getLastEditableNode(element.lastChild);
        }
        return element;
    }

    /**
     * 綁定鍵盤事件到目標元素
     * @param {HTMLElement} editableDiv - 可編輯的目標元素
     */
    function bindKeyEvents(editableDiv) {
        if (!editableDiv) return;

        editableDiv.addEventListener('keydown', (event) => {
            if (event.key === 'PageUp') {
                event.preventDefault(); // 阻止預設行為
                setCaretToStart(editableDiv); // 將游標移動到開頭
            } else if (event.key === 'PageDown') {
                event.preventDefault(); // 阻止預設行為
                setCaretToEnd(editableDiv); // 將游標移動到結尾
            }
        });
    }

    /**
     * 使用 MutationObserver 監聽目標元素的出現
     */
    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const editableDiv = document.getElementById('prompt-textarea');
            if (editableDiv) {
                bindKeyEvents(editableDiv);
                obs.disconnect(); // 停止監聽
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 立即嘗試綁定，如果元素已存在
    const existingDiv = document.getElementById('prompt-textarea');
    if (existingDiv) {
        bindKeyEvents(existingDiv);
    } else {
        // 如果元素尚未存在，開始監聽
        observeDOM();
    }

})();
