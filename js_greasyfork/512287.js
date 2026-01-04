// ==UserScript==
// @name         lulu订单批量查询助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在订单查询网站上添加批量查询功能，支持去重和单个快递单号复制，界面美观且响应式
// @author
// @match        http://27.25.142.133:5000/logistics*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512287/lulu%E8%AE%A2%E5%8D%95%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512287/lulu%E8%AE%A2%E5%8D%95%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API 基础 URL
    const API_URL = "http://27.25.142.133:5000/logistics";

    // 创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 批量查询面板样式 */
        #batch-query-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            background-color: #ffffff;
            border: 2px solid #ff5722;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        #batch-query-panel h2 {
            text-align: center;
            color: #ff5722;
            margin-bottom: 20px;
        }
        #batch-query-panel textarea {
            width: 100%;
            height: 120px;
            font-size: 16px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: vertical;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        #batch-query-panel .button-group {
            display: flex;
            justify-content: space-between;
        }
        #batch-query-panel button {
            width: 48%;
            padding: 12px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #batch-query-panel button#start-query {
            background-color: #ff5722;
            color: #fff;
        }
        #batch-query-panel button#close-panel {
            background-color: #ccc;
            color: #000;
        }
        #batch-query-panel button#start-query:hover {
            background-color: #e64a19;
        }
        #batch-query-panel button#close-panel:hover {
            background-color: #b3b3b3;
        }
        /* 加载提示样式 */
        #loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            font-size: 20px;
            color: #fff;
            flex-direction: column;
        }
        /* 进度条样式 */
        #progress-bar-container {
            width: 80%;
            background-color: #f3f3f3;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 20px;
        }
        #progress-bar {
            width: 0%;
            height: 20px;
            background-color: #4caf50;
            transition: width 0.3s;
        }
        #progress-text {
            margin-top: 10px;
            font-size: 16px;
        }
        /* 结果弹窗样式 */
        #result-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        }
        #result-modal-content {
            width: 95%;
            max-width: 900px;
            background-color: #fff;
            border-radius: 10px;
            padding: 25px;
            overflow-y: auto;
            position: relative;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        #result-modal-content h2 {
            text-align: center;
            color: #ff5722;
            margin-bottom: 20px;
        }
        #result-modal-content table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        #result-modal-content th, #result-modal-content td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
            font-size: 14px;
        }
        #result-modal-content th {
            background-color: #ff5722;
            color: #fff;
            position: sticky;
            top: 0;
        }
        #result-modal-content tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        #result-modal-content td.tracking-number {
            cursor: pointer;
            color: #2196F3;
            text-decoration: underline;
        }
        #result-modal-content td.tracking-number:hover {
            color: #1976D2;
        }
        #result-modal-content button#close-result-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #ff5722;
        }
        #result-modal-content button#close-result-modal:hover {
            color: #e64a19;
        }
        #result-modal-content .action-buttons {
            margin-top: 20px;
            text-align: right;
        }
        #result-modal-content .action-buttons button {
            padding: 10px 20px;
            font-size: 16px;
            margin-left: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #result-modal-content .action-buttons button#export-csv {
            background-color: #2196F3;
            color: #fff;
        }
        #result-modal-content .action-buttons button#export-csv:hover {
            background-color: #1976D2;
        }
        /* 响应式设计 */
        @media (max-width: 600px) {
            #batch-query-panel {
                padding: 20px;
            }
            #result-modal-content {
                padding: 20px;
            }
            #batch-query-panel textarea {
                height: 100px;
            }
            #batch-query-panel button {
                padding: 10px;
                font-size: 14px;
            }
            #result-modal-content table th, #result-modal-content table td {
                padding: 8px;
                font-size: 12px;
            }
            #result-modal-content .action-buttons button {
                padding: 8px 16px;
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);

    // 创建批量查询面板
    const panel = document.createElement('div');
    panel.id = 'batch-query-panel';
    panel.innerHTML = `
        <h2>订单批量查询</h2>
        <textarea id="order-input" placeholder="请输入订单号，多个订单号请用逗号、顿号或换行分隔"></textarea>
        <div class="button-group">
            <button id="start-query">开始查询</button>
            <button id="close-panel">关闭</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 关闭批量查询面板
    document.getElementById('close-panel').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    // 处理查询按钮点击
    document.getElementById('start-query').addEventListener('click', () => {
        const input = document.getElementById('order-input').value;
        const orderNumbers = parseOrderNumbers(input);

        if (orderNumbers.length === 0) {
            alert('请输入至少一个订单号！');
            return;
        }

        // 去重：仅移除完全相同的条目（所有字段相同）
        // Since initially we don't have all fields, we'll handle duplicates after fetching
        // For now, remove exact order number duplicates
        const uniqueOrders = [...new Set(orderNumbers)];

        // 显示加载提示和进度条
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.innerHTML = `
            <div>查询中，请稍候...</div>
            <div id="progress-bar-container">
                <div id="progress-bar"></div>
            </div>
            <div id="progress-text">0 / ${uniqueOrders.length}</div>
        `;
        document.body.appendChild(loading);

        const results = [];

        // 使用异步函数逐一查询
        (async () => {
            for (let i = 0; i < uniqueOrders.length; i++) {
                const order = uniqueOrders[i];
                const result = await queryOrder(order);
                results.push(result);

                // 更新进度条和进度文本
                const progressBar = document.getElementById('progress-bar');
                const progressText = document.getElementById('progress-text');
                progressBar.style.width = `${((i + 1) / uniqueOrders.length) * 100}%`;
                progressText.innerText = `${i + 1} / ${uniqueOrders.length}`;
            }

            // 移除加载提示
            document.body.removeChild(loading);

            // 去除完全重复的条目
            const finalResults = removeExactDuplicates(results);

            // 显示结果
            displayResults(finalResults);

            // 关闭批量查询面板
            panel.style.display = 'none';
        })();
    });

    // 解析订单号
    function parseOrderNumbers(input) {
        // 使用正则表达式分隔符：逗号、顿号、换行
        return input.split(/[\n,，、]+/).map(s => s.trim()).filter(s => s);
    }

    // 去除完全重复的订单（所有字段相同）
    function removeExactDuplicates(orders) {
        const unique = [];
        const seen = new Set();

        orders.forEach(order => {
            const key = JSON.stringify(order);
            if (!seen.has(key)) {
                unique.push(order);
                seen.add(key);
            }
        });

        return unique;
    }

    // 查询单个订单
    async function queryOrder(order_number) {
        try {
            const response = await fetch(`${API_URL}?order_number=${encodeURIComponent(order_number)}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP 错误: ${response.status}`);
            }

            const data = await response.json();

            if (data.message) {
                return {
                    "订单号": order_number,
                    "快递公司": "-",
                    "产品名称": "-",
                    "数量": "-",
                    "快递单号": "-",
                    "信息": data.message,
                };
            } else {
                return {
                    "订单号": order_number,
                    "快递公司": data.company || 'N/A',
                    "产品名称": data.product_name || 'N/A',
                    "数量": data.quantity || 'N/A',
                    "快递单号": data.tracking_number || '未找到快递单号',
                    "信息": data.info || 'N/A',
                };
            }
        } catch (error) {
            return {
                "订单号": order_number,
                "快递公司": "查询失败",
                "产品名称": "-",
                "数量": "-",
                "快递单号": "-",
                "信息": error.message,
            };
        }
    }

    // 显示查询结果
    function displayResults(results) {
        // 创建结果弹窗
        const resultModal = document.createElement('div');
        resultModal.id = 'result-modal';
        resultModal.innerHTML = `
            <div id="result-modal-content">
                <button id="close-result-modal">✖</button>
                <h2>查询结果</h2>
                <table>
                    <thead>
                        <tr>
                            <th>订单号</th>
                            <th>快递公司</th>
                            <th>产品名称</th>
                            <th>数量</th>
                            <th>快递单号</th>
                            <th>信息</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(r => `
                            <tr>
                                <td>${r["订单号"]}</td>
                                <td>${r["快递公司"]}</td>
                                <td>${r["产品名称"]}</td>
                                <td>${r["数量"]}</td>
                                <td class="tracking-number" title="点击复制">${r["快递单号"]}</td>
                                <td>${r["信息"]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="action-buttons">
                    <button id="export-csv">💾 导出为 CSV</button>
                </div>
            </div>
        `;
        document.body.appendChild(resultModal);

        // 关闭结果弹窗
        document.getElementById('close-result-modal').addEventListener('click', () => {
            document.body.removeChild(resultModal);
        });

        // 复制单个快递单号
        const trackingCells = resultModal.querySelectorAll('td.tracking-number');
        trackingCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const trackingNumber = cell.innerText.trim();
                if (trackingNumber && trackingNumber !== '-' && trackingNumber !== '未找到快递单号') {
                    navigator.clipboard.writeText(trackingNumber).then(() => {
                        alert('快递单号已复制到剪贴板！');
                    }).catch(err => {
                        alert('复制失败：' + err);
                    });
                }
            });
        });

        // 导出为 CSV
        document.getElementById('export-csv').addEventListener('click', () => {
            const csvContent = convertToCSV(results);
            downloadCSV(csvContent, 'order_query_results.csv');
        });
    }

    // 转换为 CSV 格式
    function convertToCSV(data) {
        const headers = ["订单号", "快递公司", "产品名称", "数量", "快递单号", "信息"];
        const rows = data.map(row => headers.map(field => `"${row[field] || ''}"`).join(','));
        return [headers.join(','), ...rows].join('\n');
    }

    // 下载 CSV 文件
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})();