// ==UserScript==
// @name         esxi_web_cum
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 ESXi 虚拟机管理页面中展示所有虚拟机，并按名称排序，并在控制台输出排序前和排序后的表格内容,并将虚拟机列表高度设置为855px
// @match        https://192.168.3.50/*
// @downloadURL https://update.greasyfork.org/scripts/511980/esxi_web_cum.user.js
// @updateURL https://update.greasyfork.org/scripts/511980/esxi_web_cum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查表格数据是否加载完成
    const isTableDataLoaded = () => {
        const table = document.querySelector('table.k-selectable');
        return table && table.querySelectorAll('tbody tr').length > 0;
    };

    // 模拟点击箭头图标展开下拉菜单
    const triggerArrowheadClick = (observer) => {
        const arrowheadIcon = document.querySelector('span.k-icon.k-i-arrowhead-s');
        if (arrowheadIcon) {
            console.log("找到箭头图标，正在触发点击展开下拉菜单...");
            arrowheadIcon.click();
            observer.disconnect(); // 停止观察
            observeSortAscButton(); // 开始监听“按升序排序”按钮
        } else {
            console.log("未找到箭头图标。");
        }
    };

    // 模拟点击“按升序排序”图标
    const clickSortAscButton = () => {
        const sortAscButton = document.querySelector('span.k-sprite.k-i-sort-asc');
        if (sortAscButton) {
            console.log("找到 '按升序排序' 按钮，正在触发点击...");
            sortAscButton.click();
            // 排序完成后设置高度
            setTimeout(setContentHeight, 500); // 延迟 500 毫秒以确保排序完成
        } else {
            console.log("未找到 '按升序排序' 按钮。");
        }
    };

    const setContentHeight = () => {
        const gridContainer = document.querySelector('div.ui-resizable.k-grid.k-widget.k-reorderable.k-grid-scroll');
        const gridContent = document.querySelector('div.k-grid-content');

        if (gridContainer) {
            console.log("排序完成，强制设置gridContainer高度为855px...");
            gridContainer.style.setProperty("height", "855px", "important");

            if (gridContent) {
                const adjustedHeight = `${gridContainer.offsetHeight - 98}px`;
                console.log(`设置gridContent高度为: ${adjustedHeight}...`);
                gridContent.style.setProperty("height", adjustedHeight, "important");
            } else {
                console.log("未找到 'div.k-grid-content' 元素。");
            }
        } else {
            console.log("未找到 'div.ui-resizable.k-grid.k-widget.k-reorderable.k-grid-scroll' 元素。");
        }
    };

    // 使用 MutationObserver 监听“按升序排序”按钮的出现
    const observeSortAscButton = () => {
        const sortObserver = new MutationObserver(() => {
            if (document.querySelector('span.k-sprite.k-i-sort-asc')) {
                clickSortAscButton(); // 触发点击“按升序排序”按钮
                sortObserver.disconnect(); // 停止观察
            }
        });
        sortObserver.observe(document.body, { childList: true, subtree: true });
    };

    // 监听 DOM 变化，等待表格加载完成后点击箭头图标
    const observer = new MutationObserver(() => {
        if (isTableDataLoaded()) {
            console.log("表格数据已加载，尝试点击箭头图标...");
            triggerArrowheadClick(observer); // 数据加载后点击箭头图标
        }
    });

    // 开始观察整个文档的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });
})();

