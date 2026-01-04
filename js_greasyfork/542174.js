// ==UserScript==
// @name         表格内容抓取工具（增强版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  浮窗抓取分页表格，支持导出CSV，自定义页数，表格显示结果，可拖动调大小。
// @author       kierin
// @match        https://web.jiai.pro/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542174/%E8%A1%A8%E6%A0%BC%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542174/%E8%A1%A8%E6%A0%BC%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TABLE_SELECTOR = '#DataTables_Table_0';
    const NEXT_PAGE_BUTTON_SELECTOR = '#DataTables_Table_0_next';

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    function initializeScraper() {
        if (document.getElementById('scrape-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'scrape-panel';
        panel.innerHTML = `
            <div id="scrape-panel-header">
                <span>表格内容抓取</span>
                <button id="close-panel-btn">X</button>
            </div>
            <div id="scrape-panel-body">
                <label for="pages-to-scrape">抓取页数:</label>
                <input type="number" id="pages-to-scrape" value="1" min="1">
                <button id="start-scrape-btn">开始抓取</button>
                <button id="export-csv-btn">导出 CSV</button>
                <div id="status-indicator" style="font-size: 12px; margin-top: 5px; color: #888;">等待操作...</div>
                <hr>
                <div id="table-container" style="overflow:auto; max-height:300px;">
                    <table id="scraped-table" border="1" cellspacing="0" cellpadding="4" style="width:100%; border-collapse: collapse; font-size:12px;">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div id="resize-handle" style="width: 15px; height: 15px; background: #ccc; position: absolute; right: 0; bottom: 0; cursor: se-resize;"></div>
            </div>
        `;
        document.body.appendChild(panel);

        GM_addStyle(`
        #scrape-panel {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 500px;
            height: 400px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            color: #333;
            overflow: hidden;
        }
        #scrape-panel-header {
            padding: 10px;
            background-color: #3498db;
            color: #fff;
            cursor: move;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #close-panel-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }
        #scrape-panel-body {
            padding: 10px;
            height: calc(100% - 50px);
            box-sizing: border-box;
            position: relative;
        }
        #scrape-panel-body label {
            margin-right: 10px;
        }
        #scrape-panel-body input[type="number"] {
            width: 60px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #scrape-panel-body button {
            padding: 5px 10px;
            background-color: #2ecc71;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 5px;
        }
        #scrape-panel-body button:hover {
            background-color: #27ae60;
        }
        #scrape-panel-body hr {
            margin: 10px 0;
            border: none;
            border-top: 1px solid #ccc;
        }
        #resize-handle:hover {
            background-color: #bbb;
        }
                `);

        const header = document.getElementById('scrape-panel-header');
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.cursor = 'move';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });

        document.getElementById('close-panel-btn').addEventListener('click', () => panel.style.display = 'none');

        document.getElementById('start-scrape-btn').addEventListener('click', async () => {
            const pagesToScrape = parseInt(document.getElementById('pages-to-scrape').value, 10);
            const statusIndicator = document.getElementById('status-indicator');
            const table = document.getElementById('scraped-table');
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');
            thead.innerHTML = '';
            tbody.innerHTML = '';

            for (let i = 0; i < pagesToScrape; i++) {
                statusIndicator.textContent = `正在抓取第 ${i + 1} 页...`;

                const dataTable = document.querySelector(TABLE_SELECTOR);
                if (!dataTable) {
                    statusIndicator.textContent = '❌ 未找到表格！';
                    return;
                }

                const rows = dataTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const tr = document.createElement('tr');
                    cells.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.innerText.trim();
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                if (i === 0) {
                    const headers = dataTable.querySelectorAll('thead tr th');
                    const headRow = document.createElement('tr');
                    headers.forEach(th => {
                        const thEl = document.createElement('th');
                        thEl.textContent = th.innerText.trim();
                        headRow.appendChild(thEl);
                    });
                    thead.appendChild(headRow);
                }

                if (i < pagesToScrape - 1) {
                    const nextPageButton = document.querySelector(NEXT_PAGE_BUTTON_SELECTOR);
                    if (nextPageButton && !nextPageButton.classList.contains('disabled')) {
                        nextPageButton.click();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        break;
                    }
                }
            }

            statusIndicator.textContent = '✅ 抓取完成！';
        });

        document.getElementById('export-csv-btn').addEventListener('click', () => {
            const table = document.getElementById('scraped-table');
            let csv = '';
            table.querySelectorAll('tr').forEach(row => {
                const rowData = Array.from(row.querySelectorAll('th,td')).map(cell =>
                    `"${cell.innerText.replace(/"/g, '""')}"`
                ).join(',');
                csv += rowData + '\n';
            });

            if (!csv.trim()) {
                alert('没有数据可导出');
                return;
            }

            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `table_data_${new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16)}.csv`;
            link.click();
        });

        // 浮窗右下角拖动缩放
        const resizeHandle = document.getElementById('resize-handle');
        resizeHandle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(window.getComputedStyle(panel).width, 10);
            const startHeight = parseInt(window.getComputedStyle(panel).height, 10);

            function doDrag(e) {
                panel.style.width = (startWidth + e.clientX - startX) + 'px';
                panel.style.height = (startHeight + e.clientY - startY) + 'px';
            }

            function stopDrag() {
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            }

            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });
    }

    waitForElement(TABLE_SELECTOR, () => {
        console.log('✅ 表格已加载，初始化抓取工具...');
        initializeScraper();
    });

})();
