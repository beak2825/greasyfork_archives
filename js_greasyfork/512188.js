// ==UserScript==
// @name         esxi_web_cum_with_Specific_propSet_Trigger
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  仅对包含特定 propSet 内容的 SOAP 请求触发排序和高度调整
// @match        https://192.168.3.50/*
// @downloadURL https://update.greasyfork.org/scripts/512188/esxi_web_cum_with_Specific_propSet_Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/512188/esxi_web_cum_with_Specific_propSet_Trigger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要匹配的 propSet XML 片段
    const TARGET_PROPSET_SNIPPET = `
        <propSet><type>VirtualMachine</type><all>false</all>
        <pathSet>name</pathSet><pathSet>config.annotation</pathSet>
        <pathSet>config.defaultPowerOps</pathSet><pathSet>config.extraConfig</pathSet>
        <pathSet>config.hardware.memoryMB</pathSet><pathSet>config.hardware.numCPU</pathSet>
        <pathSet>config.hardware.numCoresPerSocket</pathSet><pathSet>config.guestId</pathSet>
        <pathSet>config.guestFullName</pathSet><pathSet>config.version</pathSet>
        <pathSet>config.template</pathSet><pathSet>datastore</pathSet>
        <pathSet>guest</pathSet><pathSet>runtime</pathSet>
        <pathSet>summary.storage</pathSet><pathSet>summary.runtime</pathSet>
        <pathSet>summary.quickStats</pathSet><pathSet>effectiveRole</pathSet></propSet>
    `.replace(/\s+/g, ''); // 去除空白字符便于匹配

    // 检查请求数据是否包含目标 propSet 片段
    const containsTargetPropSet = (data) => {
        return data && data.replace(/\s+/g, '').includes(TARGET_PROPSET_SNIPPET);
    };

    // 监听表格数据加载完成
    const observeTableDataLoad = () => {
        return new Promise((resolve) => {
            const tableObserver = new MutationObserver(() => {
                const table = document.querySelector('table.k-selectable');
                const rows = table ? table.querySelectorAll('tbody tr') : [];

                if (rows.length > 0) {
                    console.log("表格数据已加载完成，准备触发排序...");
                    tableObserver.disconnect(); // 停止观察
                    resolve(); // 表格数据加载完成
                }
            });
            tableObserver.observe(document.body, { childList: true, subtree: true });
        });
    };

    // 点击箭头图标展开下拉菜单
    const triggerArrowheadClick = () => {
        const arrowheadIcon = document.querySelector('span.k-icon.k-i-arrowhead-s');
        if (arrowheadIcon) {
            console.log("找到箭头图标，正在触发点击展开下拉菜单...");
            arrowheadIcon.click();
        }
    };

    // 触发排序按钮点击事件
    const triggerSortAscButton = () => {
        const sortAscButton = document.querySelector('span.k-sprite.k-i-sort-asc');
        if (sortAscButton) {
            console.log("找到 '按升序排序' 按钮，尝试触发排序事件...");

            // 触发完整的排序事件序列
            sortAscButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
            sortAscButton.dispatchEvent(new FocusEvent('focus', { bubbles: true, cancelable: true }));
            sortAscButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            sortAscButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            sortAscButton.click(); // 触发 click 事件

            setTimeout(setContentHeight, 500); // 延迟 500 毫秒以确保排序完成
        }
    };

    // 设置容器高度
    const setContentHeight = () => {
        const gridContainer = document.querySelector('div.ui-resizable.k-grid.k-widget.k-reorderable.k-grid-scroll');
        const gridContent = document.querySelector('div.k-grid-content');

        if (gridContainer) {
            console.log("排序完成，强制设置 gridContainer 高度为 855px...");
            gridContainer.style.setProperty("height", "855px", "important");

            if (gridContent) {
                const adjustedHeight = `${gridContainer.offsetHeight - 98}px`;
                console.log(`设置 gridContent 高度为: ${adjustedHeight}...`);
                gridContent.style.setProperty("height", adjustedHeight, "important");
            }
        }
    };

    // 拦截并检测 XMLHttpRequest 请求内容
    const interceptXMLHttpRequest = () => {
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function(data) {
            // 检查请求数据是否包含目标 propSet 内容
            if (typeof data === "string" && containsTargetPropSet(data)) {
                console.log("匹配到指定的 propSet 内容，准备触发排序和高度调整...");

                // 顺序执行：等待表格加载 -> 点击箭头 -> 触发排序
                observeTableDataLoad()
                    .then(() => {
                        triggerArrowheadClick();
                        setTimeout(triggerSortAscButton, 100); // 100ms 延迟以确保菜单展开
                    });
            }
            return originalSend.apply(this, [data]);
        };
    };

    // 初始化拦截
    interceptXMLHttpRequest();

    console.log("XML 拦截已初始化，仅对包含特定 propSet 内容的请求触发排序和高度调整。");
})();
