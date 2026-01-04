// ==UserScript==
// @name         Jandan Items Hider
// @namespace    https://github.com/zhhtdm/jandan-items-hider
// @version      1.0
// @description  隐藏 Jandan 网条目 (热榜、无聊图、树洞等)
// @author       lzh
// @match        https://jandan.net/*
// @match        https://jandan.net
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/537549/Jandan%20Items%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/537549/Jandan%20Items%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = location.hostname + '_hiddenIds';

    function getHiddenIds() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveHiddenIds(ids) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }

    function getHiddenIdSet(ids = null) {
        return new Set(ids || getHiddenIds());
    }

    const hiddenIds = getHiddenIds();
    const hiddenIdSet = getHiddenIdSet(hiddenIds);

    // 注册菜单项
    GM_registerMenuCommand(' ↩ 恢复上一条', () => {
        hiddenIds.pop();
        saveHiddenIds(hiddenIds);
        location.reload();
    });

    GM_registerMenuCommand('🧹恢复全部隐藏条目', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    function processItem(item) {

        if (item.dataset.handled === 'true') return;
        item.dataset.handled = 'true';

        let a = item.querySelector('div.comment-meta > a');
        if (!a) {
            a = item.querySelector("div.hot-title > a")
            if (!a)
                return;
        }

        const id = a.href.trim();

        if (hiddenIdSet.has(id)) {
            item.style.display = 'none';
            return;
        }

        // Create hide button
        const btn = document.createElement('button');
        btn.textContent = ' X';
        // btn.style.fontSize = '12px';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.opacity = '0.75';
        btn.style.cursor = 'pointer';
        btn.style.color = "#888";
        btn.classList = 'float-end comment-num';

        btn.addEventListener('click', () => {
            item.style.display = 'none';
            hiddenIds.push(id);
            saveHiddenIds(hiddenIds);
            hiddenIdSet.add(id);
        });

        a.before(btn);
    }

    function main() {
        document.querySelectorAll('div.comment-row').forEach(processItem);
        document.querySelectorAll('div.hot-item').forEach(processItem);
    }

    function observeItems() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue; // 只处理元素节点

                    // 直接是 .comment-row
                    if (node.matches('div.comment-row') || node.matches('div.hot-item')) {
                        processItem(node);
                    }

                    // // 内部包含 .comment-row
                    // const innerRows = node.querySelectorAll?.('.comment-row');
                    // innerRows?.forEach?.(processCommentRow);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', main); // 初始执行一次
    observeItems(); // 后续动态变化监听

})();
