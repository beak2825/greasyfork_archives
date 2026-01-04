// ==UserScript==
// @name         Remove CBTimer Watermarks
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动删除cbtimer.com所有分页中的水印图片
// @author       Andy Lu @ G318
// @match        *://www.cbtimer.com/timer*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539588/Remove%20CBTimer%20Watermarks.user.js
// @updateURL https://update.greasyfork.org/scripts/539588/Remove%20CBTimer%20Watermarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化后的选择器
    const watermarkSelector = 'img[src*="waterprint"]';

    // 初始化观察器
    const observer = new MutationObserver(mutations => {
        scanAndRemove();
    });

    // 更高效的观察配置
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    // 启动持续观察
    observer.observe(document.body, observerConfig);

    // 立即执行首次扫描
    scanAndRemove();

    // 核心处理函数
    function scanAndRemove() {
        // 查询所有匹配元素
        const watermarks = document.querySelectorAll(watermarkSelector);

        if (watermarks.length > 0) {
            // 批量移除元素
            watermarks.forEach(img => {
                img.remove();
                console.log('已移除水印：', img.src);
            });

            // 新增分页切换事件监听
            bindPaginationEvents();
        }
    }

    // 处理分页切换事件
    function bindPaginationEvents() {
        // 监听所有分页按钮的点击事件
        document.querySelectorAll('.pagination-button').forEach(btn => {
            btn.addEventListener('click', () => {
                // 添加延时处理确保新内容加载完成
                setTimeout(scanAndRemove, 300);
            });
        });
    }

    // 添加防抖优化
    let debounceTimer;
    window.addEventListener('resize', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scanAndRemove, 200);
    });
})();