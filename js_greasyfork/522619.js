// ==UserScript==
// @name         快团团表格排序
// @namespace    https://dongliwei.cn/
// @version      0.1.1
// @description  使用Sortable.js库为table行添加拖拽排序功能
// @author       DongLiwei
// @match        https://ktt.pinduoduo.com/orders/web_print_common*
// @grant        GM_addScript
// @grant        GM_setValue
// @grant        GM_getValue
// @license    MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js
// @downloadURL https://update.greasyfork.org/scripts/522619/%E5%BF%AB%E5%9B%A2%E5%9B%A2%E8%A1%A8%E6%A0%BC%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/522619/%E5%BF%AB%E5%9B%A2%E5%9B%A2%E8%A1%A8%E6%A0%BC%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建MutationObserver观察器
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            // 检查是否添加了符合条件的table
            if (mutation.type === 'childList') {
                const tables = document.querySelectorAll('table.goods-table');
                tables.forEach(table => {
                    const tbody = table.querySelector('tbody');
                    if (tbody && tbody.children.length > 0) {
                        // 在tbody内容加载完成后初始化拖拽排序
                        initializeSortable(tbody);
                    }
                });
            }
        });
    });

    // 配置观察选项，监控整个文档的DOM变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始化Sortable.js
    function initializeSortable(tbody) {
        new Sortable(tbody, {
            handle: 'tr',  // 可以指定拖动的handle，这里是tr
            animation: 150, // 拖拽动画效果
            ghostClass: 'sortable-ghost', // 拖拽时的样式
            chosenClass: 'sortable-chosen', // 选中的行的样式
            dragClass: 'sortable-drag' // 正在拖动的行的样式
        });
    }
})();