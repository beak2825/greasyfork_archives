// ==UserScript==
// @name        steam群组的批量退出 Steam Group Selective Batch Exit 
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  提供一个选择表格来快速批量退出Steam群组的脚本，并在批量退出后自动刷新页面并显示选择表格
// @author       none
// @match        https://steamcommunity.com/id/*/groups
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508730/steam%E7%BE%A4%E7%BB%84%E7%9A%84%E6%89%B9%E9%87%8F%E9%80%80%E5%87%BA%20Steam%20Group%20Selective%20Batch%20Exit.user.js
// @updateURL https://update.greasyfork.org/scripts/508730/steam%E7%BE%A4%E7%BB%84%E7%9A%84%E6%89%B9%E9%87%8F%E9%80%80%E5%87%BA%20Steam%20Group%20Selective%20Batch%20Exit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并显示选择表格
    function showSelectionTable() {
        let tableHtml = '<div id="group-selection-table" style="position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; background: white; border: 1px solid black; z-index: 1001; overflow: auto; padding: 20px;">' +
            '<h2>选择要退出的群组</h2>' +
            '<button id="select-all" style="margin: 10px;">全选</button>' +
            '<button id="deselect-all" style="margin: 10px;">全不选</button>' +
            '<button id="batch-exit" style="margin: 10px; background: #ff4d4d; color: white;">批量退出选中的群组</button>' +
            '<table id="group-table" style="width: 100%; border-collapse: collapse;">' +
            '<thead><tr><th>选择</th><th>群组名称</th></tr></thead>' +
            '<tbody></tbody>' +
            '</table>' +
            '<button id="close-table" style="position: absolute; top: 10px; right: 10px;">关闭</button>' +
            '</div>';

        let existingTable = document.getElementById('group-selection-table');
        if (existingTable) {
            existingTable.remove();
        }

        let container = document.createElement('div');
        container.innerHTML = tableHtml;
        document.body.appendChild(container);

        // 填充表格
        populateTable();

        // 事件绑定
        document.getElementById('select-all').addEventListener('click', () => selectAllCheckboxes(true));
        document.getElementById('deselect-all').addEventListener('click', () => selectAllCheckboxes(false));
        document.getElementById('batch-exit').addEventListener('click', batchExitGroups);
        document.getElementById('close-table').addEventListener('click', () => container.remove());
    }

    // 填充表格内容
    function populateTable() {
        let groupTableBody = document.querySelector('#group-table tbody');
        groupTableBody.innerHTML = ''; // 清空表格内容

        let groupBlocks = document.querySelectorAll('div.group_block');
        groupBlocks.forEach((groupBlock) => {
            let groupNameElement = groupBlock.querySelector('a.linkTitle');
            let groupName = groupNameElement.textContent.trim();
            let groupUrl = groupNameElement.href;
            let row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="group-checkbox" data-group-url="${groupUrl}"></td>
                <td>${groupName}</td>
            `;
            groupTableBody.appendChild(row);
        });
    }

    // 选择或取消选择所有复选框
    function selectAllCheckboxes(select) {
        document.querySelectorAll('.group-checkbox').forEach(checkbox => {
            checkbox.checked = select;
        });
    }

    // 批量退出选中的群组
    function batchExitGroups() {
        let selectedCheckboxes = document.querySelectorAll('#group-table .group-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('请选择至少一个群组进行退出操作。');
            return;
        }

        let completedCount = 0;
        let total = selectedCheckboxes.length;

        selectedCheckboxes.forEach((checkbox, index) => {
            let groupUrl = checkbox.dataset.groupUrl;
            let groupBlock = Array.from(document.querySelectorAll('div.group_block')).find(block => block.querySelector('a.linkTitle').href === groupUrl);
            let exitButton = groupBlock ? groupBlock.querySelector('a[onclick*="ConfirmLeaveGroup"]') : null;
            if (exitButton) {
                exitButton.click(); // 点击离开组按钮
                console.log(`退出群组：第 ${index + 1} 个群组`);

                // 等待1秒后点击确认按钮
                setTimeout(() => {
                    clickConfirmLeaveButton();
                    completedCount++;
                    if (completedCount === total) {
                        // 刷新页面并重新显示选择表格
                        setTimeout(() => {
                            localStorage.setItem('showSelectionTableAfterReload', 'true');
                            reloadPage(); // 重新加载页面
                        }, 1000); // 等待1秒再重新加载页面
                    }
                }, 1000); // 等待1秒后点击确认离开的按钮
            } else {
                console.warn(`未找到退出按钮：${groupUrl}`);
                completedCount++;
                if (completedCount === total) {
                    // 刷新页面并重新显示选择表格
                    setTimeout(() => {
                        localStorage.setItem('showSelectionTableAfterReload', 'true');
                        reloadPage(); // 重新加载页面
                    }, 1000); // 等待1秒再重新加载页面
                }
            }
        });

        alert(`开始退出 ${selectedCheckboxes.length} 个群组，请等待完成。`);
    }

    // 点击确认弹出框中的“离开组”按钮
    function clickConfirmLeaveButton() {
        setTimeout(() => {
            const leaveGroupButton = document.querySelector('div.btn_green_steamui.btn_medium span');
            if (leaveGroupButton && leaveGroupButton.textContent === '离开组') {
                leaveGroupButton.click();
                console.log('已点击确认框中的“离开组”按钮');
            }
        }, 500); // 增加500毫秒的延时，以确保确认框按钮已加载
    }

    // 重新加载页面以刷新选择表格内容
    function reloadPage() {
        location.reload(); // 刷新整个页面
    }

    // 自动显示选择表格按钮
    function createShowTableButton() {
        let showTableBtn = document.createElement('button');
        showTableBtn.textContent = '显示选择表格';
        showTableBtn.style.position = 'fixed';
        showTableBtn.style.top = '10px';
        showTableBtn.style.right = '10px';
        showTableBtn.style.zIndex = '1000';
        showTableBtn.style.padding = '10px';
        showTableBtn.style.backgroundColor = '#4d90fe';
        showTableBtn.style.color = '#fff';
        showTableBtn.style.border = 'none';
        showTableBtn.style.cursor = 'pointer';
        document.body.appendChild(showTableBtn);

        showTableBtn.addEventListener('click', showSelectionTable);
    }

    // 初始化脚本
    function init() {
        // 检查页面是否有离开组的按钮
        let exitButtons = document.querySelectorAll('a[onclick*="ConfirmLeaveGroup"]');
        if (exitButtons.length > 0) {
            createShowTableButton();
        } else {
            alert('未找到离开组的按钮，请确认你是否登录并进入了正确的页面。');
        }
    }

    // 自动弹出选择表格（如果需要）
    function autoShowTableIfNeeded() {
        if (localStorage.getItem('showSelectionTableAfterReload') === 'true') {
            localStorage.removeItem('showSelectionTableAfterReload');
            showSelectionTable();
        }
    }

    // 等待页面加载完成后运行
    window.onload = () => {
        init();
        autoShowTableIfNeeded();
    };
})();
