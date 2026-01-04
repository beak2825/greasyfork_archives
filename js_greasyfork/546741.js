// ==UserScript==
// @name         禁用秀家电后台页面横向滚动(保留列表)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  禁用 https://admin.xiujiadian.com/ 页面的整体横向滚动，但尝试保留列表等组件的内部横向滚动条
// @author       You
// @match        https://admin.xiujiadian.com/plat-menu-frontend*
// @match        https://test3-admin.xiujiadian.com/#/private-iframe*

// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546741/%E7%A6%81%E7%94%A8%E7%A7%80%E5%AE%B6%E7%94%B5%E5%90%8E%E5%8F%B0%E9%A1%B5%E9%9D%A2%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%28%E4%BF%9D%E7%95%99%E5%88%97%E8%A1%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546741/%E7%A6%81%E7%94%A8%E7%A7%80%E5%AE%B6%E7%94%B5%E5%90%8E%E5%8F%B0%E9%A1%B5%E9%9D%A2%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%28%E4%BF%9D%E7%95%99%E5%88%97%E8%A1%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyDisableScroll() {
        // 创建或更新CSS样式
        let style = document.getElementById('tm-disable-page-h-scroll');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-disable-page-h-scroll';
            document.head.appendChild(style);
        }
        // 只针对 html 和 body 禁用横向滚动，防止整个页面左右滑动
        // 移除了 div { overflow-x: hidden !important; } 这条过于宽泛的规则
        style.textContent = `
            /* 禁用页面级横向滚动 */
            html, body {
                overflow-x: hidden !important;
                width: 100vw !important;
                max-width: 100vw !important;
                /* position: relative !important; */ /* 通常不需要，避免影响布局 */
            }

            /* 防止内容溢出导致页面级滚动，但不强制隐藏所有div的滚动 */
            /* 注意：如果列表本身或其直接父容器没有显式设置 overflow-x: auto/scroll,
               它可能仍然会继承 hidden。这时需要检查列表元素的实际样式并针对性处理 */
        `;

        // 直接在 window 上监听滚动事件，强制将 scrollX 置为 0
        // 这可以处理通过 JS 触发的页面级横向滚动
        const handleWindowScroll = function() {
            if (window.scrollX > 0) {
                window.scrollTo(0, window.scrollY);
            }
        };

        // 移除之前可能添加的监听器（如果脚本重载）
        window.removeEventListener('scroll', handleWindowScroll);
        // 添加新的监听器
        window.addEventListener('scroll', handleWindowScroll, { passive: false });


        // --- 可选：如果你知道列表容器的选择器，可以在这里添加特定规则 ---
        // 例如，如果列表容器是 class="ant-table-body" (Ant Design 示例)
        // const listContainer = document.querySelector('.ant-table-body');
        // if (listContainer) {
        //     listContainer.style.overflowX = 'auto'; // 或 'scroll'
        //     // 或者通过添加一个类名来应用样式
        // }
        // --- 可选结束 ---
    }

    // 初始执行
    applyDisableScroll();

    // 延迟并重复执行几次以应对动态加载内容
    setTimeout(applyDisableScroll, 1000);
    setTimeout(applyDisableScroll, 3000);

    // 使用 MutationObserver 监听 DOM 变化，动态应用规则
    const observer = new MutationObserver(function() {
        applyDisableScroll();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();



