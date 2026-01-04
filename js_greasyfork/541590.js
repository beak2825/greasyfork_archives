// ==UserScript==
// @name         AGSV盒子审核助手
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  盒子审核页面按钮固定，添加状态更改模拟
// @author       AGSV骄阳
// @match        https://www.agsvpt.com/nexusphp/seed-box-records?tableFilters[status][value]=0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541719/AGSV%E7%9B%92%E5%AD%90%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541719/AGSV%E7%9B%92%E5%AD%90%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .action-buttons {
            display: flex; /* 使用flex布局 */
            gap: 10px; /* 按钮之间的间隔 */
            align-items: center; /* 垂直居中对齐按钮 */
            justify-content: flex-start; /* 左对齐按钮 */
        }

        .action-button {
            background-color: white; /* 按钮背景为白色 */
            border: 1px solid #ccc; /* 按钮边框颜色 */
            padding: 5px 10px; /* 按钮内边距 */
            border-radius: 5px; /* 圆角效果 */
            cursor: pointer; /* 鼠标悬停时显示为可点击 */
            text-align: center; /* 文本居中 */
        }

        .action-button:hover {
            background-color: #f0f0f0; /* 鼠标悬停时背景颜色变化 */
        }

        .button-container {
            display: flex; /* 使用flex布局以排列按钮 */
            justify-content: flex-start; /* 左对齐 */
        }

        .highlight {
            background-color: red; /* 高亮按钮背景颜色 */
            color: white; /* 高亮按钮字体颜色 */
        }
    `);

    // 添加一个空的表头列，用于放置自定义按钮
    function addEmptyHeaderColumn() {
        const headerRow = document.querySelector('thead tr'); // 选择表头的第一行
        if (headerRow) {
            const emptyHeaderCell = document.createElement('th'); // 创建一个新的表头单元格
            emptyHeaderCell.style.width = '80px'; // 设置单元格宽度
            headerRow.insertBefore(emptyHeaderCell, headerRow.firstChild); // 将新单元格插入到表头行的第一位置
        }
    }

    // 创建自定义按钮并添加到表格行中
    function createButtons() {
        const rows = document.querySelectorAll('tr'); // 获取所有表格行
        const keywords = ["azure", "google cloud", "aws", "oracle cloud", "digital ocean", "linode", "vultr", "甲骨文", "oracle"];
        const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase()); // 将关键词转为小写以便比较

        rows.forEach(row => {
            const editButton = row.querySelector('a[dusk="filament.tables.action.edit"]'); // 查找编辑按钮
            const changeStatusButton = row.querySelector('button[dusk="filament.tables.action.audit"]'); // 查找更改状态按钮

            // 如果当前行已存在按钮容器则返回
            if (editButton && changeStatusButton) {
                const existingContainer = row.querySelector('.button-container');
                if (existingContainer) {
                    return; // 如果已经存在按钮容器，就跳过
                }

                // 创建按钮容器
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');

                // 创建"编辑"按钮
                const newEditButton = document.createElement('div');
                newEditButton.classList.add('action-button');
                newEditButton.innerText = '编辑'; // 按钮文本
                newEditButton.onclick = () => {
                    window.location.href = editButton.href; // 点击按钮时跳转到编辑页面
                };

                // 创建"更改状态"按钮
                const newChangeStatusButton = document.createElement('div');
                newChangeStatusButton.classList.add('action-button');
                newChangeStatusButton.innerText = '更改状态'; // 按钮文本
                newChangeStatusButton.onclick = () => {
                    const isHighlighted = newChangeStatusButton.classList.contains('highlight'); // 检查按钮是否被高亮
                    changeStatusButton.click(); // 触发内置更改状态按钮的点击事件
                    monitorModal(isHighlighted); // 监控弹窗以自动选择相应单选框
                };

                // 检查行中的<span>元素以确定是否需要高亮
                const spanElements = row.querySelectorAll('span');
                let highlightStatus = false;

                spanElements.forEach(span => {
                    const spanText = span.textContent.trim().toLowerCase(); // 获取<span>文本并转为小写
                    if (lowerCaseKeywords.includes(spanText)) { // 检查是否包含关键词
                        highlightStatus = true; // 若匹配，则标记为高亮
                    }
                });

                // 如果需要高亮，则为按钮添加高亮样式
                if (highlightStatus) {
                    newChangeStatusButton.classList.add('highlight');
                }

                // 将按钮添加到容器中并插入到表格行中
                buttonContainer.appendChild(newEditButton);
                buttonContainer.appendChild(newChangeStatusButton);
                row.insertBefore(buttonContainer, row.firstChild); // 将按钮容器插入到行的最前面
            }
        });
    }

    // 监控弹窗变化以自动选择单选框
    function monitorModal(isHighlighted) {
        // 创建观察者以监视DOM变化
        const observer = new MutationObserver(() => {
            // 查找弹窗中对应的单选框并点击
            const radioToClick = isHighlighted
                ? document.querySelector('input[name="mountedTableActionData.status"][value="2"]') // 高亮情况下选择状态2
                : document.querySelector('input[name="mountedTableActionData.status"][value="1"]'); // 非高亮情况下选择状态1

            if (radioToClick) {
                radioToClick.click(); // 点击相应的单选框
                observer.disconnect(); // 点击后断开观察
            }
        });

        // 监视整个文档变化
        observer.observe(document.body, {
            childList: true, // 观察直接子节点的新增或移除
            subtree: true // 观察所有后代节点
        });
    }

    addEmptyHeaderColumn(); // 在表头添加空列
    createButtons(); // 创建并添加自定义按钮到表格

    // 监视表格变化以动态创建按钮
    const observer = new MutationObserver(() => {
        createButtons(); // 在表格变化时重新创建按钮
    });

    const table = document.querySelector('table'); // 获取表格元素
    if (table) {
        observer.observe(table, {
            childList: true, // 观察直接子节点的新增或移除
            subtree: true // 观察所有后代节点
        });
    }
})();
