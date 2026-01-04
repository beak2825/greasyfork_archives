// ==UserScript==
// @name         Auto-delete “翻译：” History Items
// @namespace    chatglm.cn
// @version      3.0
// @description  Automatically click the delete button for history entries whose title starts with “翻译：”
// @match        https://chatglm.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537706/Auto-delete%20%E2%80%9C%E7%BF%BB%E8%AF%91%EF%BC%9A%E2%80%9D%20History%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/537706/Auto-delete%20%E2%80%9C%E7%BF%BB%E8%AF%91%EF%BC%9A%E2%80%9D%20History%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteTranslateItems() {
        // 找到所有 class="title" 元素
        document.querySelectorAll('.title').forEach(titleEl => {
            const text = titleEl.textContent.trim();
            if (text.startsWith('翻译：')||text.startsWith('写作：')) {
                // 向上找到最近的 .history-item 容器
                const historyItem = titleEl.closest('.history-item');
                if (!historyItem) return;

                // 在该容器内找到 class="delete"（或 .delete-item）元素
                const deleteBtn = historyItem.querySelector('.delete, .delete-item');
                if (deleteBtn) {
                    deleteBtn.click();
                    console.log(`[AutoDelete] 已删除:“${text}”`);
                }
            }
        });
    }

    // 初次执行
    deleteTranslateItems();

    // 每 5 秒检查一次
    setInterval(deleteTranslateItems, 5000);
})();
