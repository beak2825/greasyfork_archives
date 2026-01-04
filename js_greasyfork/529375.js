// ==UserScript==
// @name         Web表格导出助手
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  从网页中提取表格并导出为Excel
// @match        *://*/*
// @grant        none
// @license      All Rights Reserved
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/529375/Web%E8%A1%A8%E6%A0%BC%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529375/Web%E8%A1%A8%E6%A0%BC%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建菜单按钮
    function createMenuButton() {
        const button = document.createElement('div');
        button.innerHTML = '📊';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 1px 2px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        button.onclick = extractTables;
        document.body.appendChild(button);
    }

    // 生成随机文件名
    function generateRandomFileName() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomString = Array.from(
            {length: 6},
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        const date = new Date();
        const dateStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        return `${document.title || randomString}_${dateStr}`;
    }

    // 导出Excel
    function exportToExcel(tables, index = null) {
        if (index !== null) {
            // 导出特定表格
            const table = tables[index];
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(table);
            XLSX.utils.book_append_sheet(wb, ws, `Table ${index + 1}`);

            const fileName = `${generateRandomFileName()}_table${index + 1}.xlsx`;
            XLSX.writeFile(wb, fileName);
        } else {
            // 导出所有表格
            tables.forEach((table, idx) => {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(table);
                XLSX.utils.book_append_sheet(wb, ws, `Table ${idx + 1}`);

                const fileName = `${generateRandomFileName()}_table${idx + 1}.xlsx`;
                XLSX.writeFile(wb, fileName);
            });
        }
    }

    // 提取表格数据
    function extractTables() {
        const tables = Array.from(document.querySelectorAll('table')).map(table => {
            // 提取表格数据
            return Array.from(table.rows).map(row =>
                Array.from(row.cells).map(cell => cell.innerText.trim())
            );
        });

        if (tables.length === 0) {
            alert('未找到任何表格');
            return;
        }

        // 创建对话框
        const previewHtml = tables.map((table, index) => `
            <div id="tablePreview${index}" style="
                margin-bottom: 15px;
                background-color: #f9f9f9;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s, box-shadow 0.3s;
            ">
                <div style="
                    background-color: #2196F3;
                    color: white;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <h5 style="margin: 0;">表格 ${index + 1}</h5>
                    <button onclick="document.dispatchEvent(new CustomEvent('exportSpecificTable', {detail: ${index}}))"
                        style="
                            background-color: white;
                            color: #2196F3;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 5px;
                            cursor: pointer;
                            transition: background-color 0.3s;
                        "
                        onmouseover="this.style.backgroundColor='#f0f0f0'"
                        onmouseout="this.style.backgroundColor='white'"
                    >
                        导出
                    </button>
                </div>
                <div style="
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 10px;
                ">
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                    ">
                        ${table.slice(0, 5).map(row => `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                ${row.map(cell => `
                                    <td style="
                                        padding: 8px;
                                        text-align: left;
                                        max-width: 150px;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    ">${cell}</td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>
        `).join('');

        const dialogHtml = `
            <div id="tableExportDialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.2);
                max-width: 600px;
                width: 95%;
                max-height: 100%;
                overflow: auto;
                z-index: 10001;
                padding: 20px;
            ">
                <div style="
                    background: linear-gradient(135deg, #2196F3, #1565c0);
                    color: white;
                    padding: 15px;
                    border-radius: 10px 10px 0 0;
                    margin: -20px -20px 20px;
                    text-align: center;
                ">
                    <h3 style="margin: 0;">选择要导出的表格</h3>
                </div>

                <div id="tablePreviewContainer">
                    ${previewHtml}
                </div>

                <div style="
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    gap: 15px;
                ">
                    <button id="exportAllBtn" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    "
                    onmouseover="this.style.backgroundColor='#45a049'"
                    onmouseout="this.style.backgroundColor='#4CAF50'"
                    >
                        导出所有表格
                    </button>
                    <button id="cancelBtn" style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    "
                    onmouseover="this.style.backgroundColor='#d32f2f'"
                    onmouseout="this.style.backgroundColor='#f44336'"
                    >
                        取消
                    </button>
                </div>
            </div>
            <div id="tableExportOverlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(5px);
                z-index: 10000;
            "></div>
        `;

        // 创建对话框
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = dialogHtml;
        document.body.appendChild(tempDiv.firstElementChild);
        document.body.appendChild(tempDiv.lastElementChild);

        // 添加悬停效果
        const previews = document.querySelectorAll('[id^="tablePreview"]');
        previews.forEach(preview => {
            preview.addEventListener('mouseenter', () => {
                preview.style.transform = 'scale(1.02)';
                preview.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            });
            preview.addEventListener('mouseleave', () => {
                preview.style.transform = 'scale(1)';
                preview.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });

        // 添加事件监听
        document.getElementById('exportAllBtn').onclick = () => {
            exportToExcel(tables);
            closeDialog();
        };

        document.getElementById('cancelBtn').onclick = closeDialog;
        document.getElementById('tableExportOverlay').onclick = closeDialog;

        // 监听导出特定表格事件
        document.addEventListener('exportSpecificTable', (e) => {
            exportToExcel(tables, e.detail);
            closeDialog();
        });
    }

    // 关闭对话框
    function closeDialog() {
        const dialog = document.getElementById('tableExportDialog');
        const overlay = document.getElementById('tableExportOverlay');
        if (dialog) dialog.remove();
        if (overlay) overlay.remove();
    }

    // 初始化
    function init() {
        createMenuButton();
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();