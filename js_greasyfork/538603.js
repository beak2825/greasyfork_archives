// ==UserScript==
// @name         短信宝发送记录导出
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  发送记录导出
// @author       2dbfun@gmail.com
// @match        https://console.smsbao.com/*
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @icon         https://console.smsbao.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538603/%E7%9F%AD%E4%BF%A1%E5%AE%9D%E5%8F%91%E9%80%81%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/538603/%E7%9F%AD%E4%BF%A1%E5%AE%9D%E5%8F%91%E9%80%81%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const PAGE_LOAD_DELAY = 2000; // 等待下一页加载的延迟时间（毫秒）。如果您的网络较慢，可以适当增加此值。
    const TARGET_PAGE_URL = 'https://console.smsbao.com/#/general/log/mt'; // 定义目标页面URL

    let originalTitle = document.title; // 保存原始页面标题

    /**
     * 主函数，脚本入口
     */
    function initialize() {
        // 使用延时确保页面动态内容（如表格）已由Vue.js渲染完成
        setTimeout(() => {
            addStyles();
            addCollectButton();
        }, 1500);
    }

    /**
     * 在页面右上角添加“采集数据”按钮
     */
    function addCollectButton() {
        // 防止重复添加按钮
        if (document.getElementById('gemini-collect-btn')) {
            return;
        }
        const button = document.createElement('button');
        button.innerHTML = '导出发送记录'; // 使用一个软盘图标增加辨识度
        button.id = 'gemini-collect-btn';
        button.addEventListener('click', handleCollectionProcess);
        document.body.appendChild(button);
    }

    /**
     * 为按钮添加样式
     */
    function addStyles() {
        GM_addStyle(`
            #gemini-collect-btn {
                position: fixed;
                top: 15px;
                right: 560px;
                z-index: 99999;
                padding: 10px 20px;
                background-color: #409EFF; /* Element UI 主题蓝色 */
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 14px 0 rgba(0, 118, 255, 0.39);
                transition: all 0.3s ease-in-out;
            }
            #gemini-collect-btn:hover {
                background-color: #66b1ff;
                transform: translateY(-2px);
            }
            #gemini-collect-btn:disabled {
                background-color: #a0cfff;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
        `);
    }

    /**
     * 点击按钮后的主处理流程
     */
    async function handleCollectionProcess() {
        // 检查当前URL，如果不是目标页面则跳转
        if (window.location.href !== TARGET_PAGE_URL) {
            //alert('当前不在“发送记录”页面，将自动为您跳转。\n请在页面加载完成后，重新点击【采集数据】按钮。');
            window.location.href = TARGET_PAGE_URL;
            return; // 终止本次执行，等待页面跳转
        }

        const button = document.getElementById('gemini-collect-btn');
        if (!button) return;

        originalTitle = document.title; // 开始时再次获取，确保是最新标题
        button.disabled = true;
        button.innerText = '采集中...';
        document.title = '采集中...';

        try {
            // 1. 获取表头
            const headers = getTableHeaders();
            if (headers.length === 0) {
                alert('无法找到表格头部，请确认页面已加载完成。');
                return;
            }

            const allRowsData = [headers];
            let pageCount = 1;

            // 2. 循环采集所有页面的数据
            while (true) {
                const progressText = `采集中 (第 ${pageCount} 页)...`;
                button.innerText = progressText;
                document.title = progressText;

                // 采集当前页数据
                const currentPageRows = getCurrentPageData();
                allRowsData.push(...currentPageRows);

                // 查找并点击下一页按钮
                const nextButton = document.querySelector("button.btn-next:not([disabled])");
                if (nextButton) {
                    nextButton.click();
                    pageCount++;
                    // 等待页面AJAX加载完成
                    await sleep(PAGE_LOAD_DELAY);
                } else {
                    // 没有下一页了，结束循环
                    break;
                }
            }

            // 3. 导出为 Excel
            if (allRowsData.length > 1) { // 确认采集到了数据（除了表头）
                exportToExcel(allRowsData);
                button.innerText = '采集完成!';
                document.title = '导出完成!';
            } else {
                alert('没有采集到任何数据！');
                button.innerText = '导出发送记录';
                document.title = originalTitle; // 没有数据也恢复标题
            }

        } catch (error) {
            console.error('采集过程中发生错误:', error);
            alert('采集失败，请按F12打开控制台查看错误信息。');
            button.innerText = '采集失败';
            document.title = '采集失败';
        } finally {
            // 3秒后恢复按钮和标题，无论成功或失败
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = '导出发送记录';
                document.title = originalTitle;
            }, 3000);
        }
    }

    /**
     * 获取表头字段
     * @returns {string[]} 表头数组
     */
    function getTableHeaders() {
        // 使用更稳定的选择器来定位表头
        const headerCells = document.querySelectorAll('.el-table__header-wrapper thead tr th');
        if (!headerCells || headerCells.length === 0) {
             console.error("无法使用 .el-table__header-wrapper 找到表头，尝试备用 XPath");
             // 使用XPath作为备用方案
             const headerPath = "//table[contains(@class, 'el-table__header')]/thead/tr/th";
             const headerNodes = document.evaluate(headerPath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
             const headers = [];
             let currentNode = headerNodes.iterateNext();
             while (currentNode) {
                 headers.push(currentNode.textContent.trim());
                 currentNode = headerNodes.iterateNext();
             }
              // 根据要求，去掉最后一个字段（通常是“操作”）
             if (headers.length > 0) {
                headers.pop();
                headers.pop();
                
             }
             return headers;
        }

        const headers = Array.from(headerCells).map(th => th.textContent.trim());
        // 根据要求，去掉最后一个字段（通常是“操作”）
        if (headers.length > 0) {
            headers.pop();
            headers.pop();
        }
        return headers;
    }


    /**
     * 获取当前页面的所有行数据
     * @returns {Array<string[]>} 当前页数据二维数组
     */
    function getCurrentPageData() {
        const rowsData = [];
        // 使用更稳定的选择器
        const rowNodes = document.querySelectorAll('.el-table__body-wrapper tbody tr.el-table__row');

        rowNodes.forEach(row => {
            const rowData = [];
            const cellNodes = row.querySelectorAll('td');

            // 遍历单元格，但不包括最后一个
            for (let i = 0; i < cellNodes.length - 1; i++) {
                rowData.push(cellNodes[i].textContent.trim());
            }
            rowsData.push(rowData);
        });

        return rowsData;
    }

    /**
     * 将数据导出为 XLSX 文件
     * @param {Array<string[]>} data - 包含表头和所有行数据的二维数组
     */
    function exportToExcel(data) {
        // 获取日期范围
        const startDateEl = document.querySelector('input[placeholder="开始日期"]');
        const endDateEl = document.querySelector('input[placeholder="结束日期"]');

        const startDate = startDateEl ? startDateEl.value : 'nodate';
        const endDate = endDateEl ? endDateEl.value : 'nodate';

        // 生成文件名
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${startDate}~${endDate}-发送记录.xlsx`;

        // 使用 SheetJS 创建工作簿
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '发送记录');

        // 触发下载
        XLSX.writeFile(wb, fileName);
    }

    /**
     * 简单的延时函数
     * @param {number} ms - 毫秒数
     * @returns {Promise<void>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 监听 'load' 和 hash change 事件，确保在SPA页面切换后脚本也能正确初始化
    window.addEventListener('load', initialize);
    window.addEventListener('hashchange', initialize);

})();
