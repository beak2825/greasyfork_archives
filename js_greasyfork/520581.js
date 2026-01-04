// ==UserScript==
// @name         Metrics Extractor for Xiaohongshu Note Manager
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  聪明豆专属！！在小红书创作者后台的笔记管理页面提取并展示指标数据（浏览量、评论数、点赞数、收藏数、转发数），并每隔5秒自动更新。
// @author       zhongjing du
// @match        https://creator.xiaohongshu.com/new/note-manager*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520581/Metrics%20Extractor%20for%20Xiaohongshu%20Note%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/520581/Metrics%20Extractor%20for%20Xiaohongshu%20Note%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止脚本多次运行
    if (document.getElementById('metrics-extractor-container')) {
        console.log('Metrics Extractor 已经运行，退出脚本。');
        return;
    }

    const metrics = ['浏览量', '评论数', '点赞数', '收藏数', '转发数'];
    let categorizedData = [];
    let totals = {
        '浏览量': 0,
        '评论数': 0,
        '点赞数': 0,
        '收藏数': 0,
        '转发数': 0
    };

    /**
     * 提取指标数据
     * @returns {boolean} 是否成功提取数据
     */
    function extractMetrics() {
        console.log('开始提取指标数据...');

        // 选择位于 div.icon_list 内的 div.icon 元素
        const iconDivs = document.querySelectorAll('div.icon_list div.icon');
        console.log('找到的div.icon数量:', iconDivs.length);
        let numbers = [];

        iconDivs.forEach((div, index) => {
            if (!div.dataset.processed) { // 检查是否已处理
                // 使用 :scope > span 选择器，确保选择 div.icon 的直接子 span
                const span = div.querySelector(':scope > span');
                if (span) {
                    // 使用 innerText 代替 textContent
                    const numberText = span.innerText.trim();
                    console.log(`div.icon #${index + 1} - 提取到的span文本: "${numberText}"`);
                    
                    // 检查是否有数字
                    const digitMatch = numberText.match(/\d+/g);
                    if (digitMatch) {
                        // 将所有找到的数字部分连接起来
                        const cleanedNumber = digitMatch.join('');
                        console.log(`div.icon #${index + 1} - 清理后的数字字符串: "${cleanedNumber}"`);
                        
                        const number = parseInt(cleanedNumber, 10);
                        if (!isNaN(number)) {
                            numbers.push(number);
                            console.log(`div.icon #${index + 1} - 解析后的数字: ${number}`);
                            // 标记为已处理
                            div.dataset.processed = 'true';
                        } else {
                            console.warn(`div.icon #${index + 1} - 无法解析数字: "${cleanedNumber}"`);
                        }
                    } else {
                        console.warn(`div.icon #${index + 1} - span内未找到数字`);
                    }
                } else {
                    console.warn(`div.icon #${index + 1} - 未找到span元素`);
                }
            } else {
                console.log(`div.icon #${index + 1} - 已处理，跳过。`);
            }
        });

        console.log('提取到的数字数组:', numbers);

        if (numbers.length === 0) {
            console.warn('未提取到任何新数字。');
            return false;
        }

        // 分类数据，每5个数字对应一个数据项
        for (let i = 0; i < numbers.length; i += metrics.length) {
            const item = {};
            metrics.forEach((metric, idx) => {
                if (i + idx < numbers.length) {
                    item[metric] = numbers[i + idx];
                } else {
                    item[metric] = null;
                }
            });
            categorizedData.push(item);
        }

        console.log('分类后的数据:', categorizedData);

        // 计算总数
        metrics.forEach(metric => {
            totals[metric] = categorizedData.reduce((sum, item) => {
                return sum + (item[metric] || 0);
            }, 0);
        });

        console.log('各指标总数:', totals);

        // 更新面板
        updateMetricsPanel();

        return true;
    }

    /**
     * 创建指标展示面板
     */
    function createMetricsPanel() {
        console.log('创建指标面板...');
        // 创建样式
        const style = document.createElement('style');
        style.innerHTML = `
        #metrics-extractor-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            padding: 15px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-height: 90vh;
            overflow-y: auto;
        }
        #metrics-extractor-container h2 {
            text-align: center;
            margin-top: 0;
            font-size: 18px;
        }
        #metrics-extractor-container table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        #metrics-extractor-container th, #metrics-extractor-container td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            font-size: 14px;
        }
        #metrics-extractor-container th {
            background-color: #f2f2f2;
        }
        #metrics-extractor-container button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 10px;
        }
        #metrics-extractor-container button:hover {
            background-color: #45a049;
        }
        #metrics-extractor-details {
            display: none;
            max-height: 300px;
            overflow-y: auto;
        }
        `;
        document.head.appendChild(style);

        // 创建容器
        const container = document.createElement('div');
        container.id = 'metrics-extractor-container';

        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '指标总数';
        container.appendChild(title);

        // 创建总数表格
        const totalsTable = document.createElement('table');
        const totalsThead = document.createElement('thead');
        const totalsHeaderRow = document.createElement('tr');
        const metricHeader = document.createElement('th');
        metricHeader.textContent = '指标';
        const totalHeader = document.createElement('th');
        totalHeader.textContent = '总数';
        totalsHeaderRow.appendChild(metricHeader);
        totalsHeaderRow.appendChild(totalHeader);
        totalsThead.appendChild(totalsHeaderRow);
        totalsTable.appendChild(totalsThead);

        const totalsTbody = document.createElement('tbody');
        for (const [metric, total] of Object.entries(totals)) {
            const row = document.createElement('tr');
            const metricCell = document.createElement('td');
            metricCell.textContent = metric;
            const totalCell = document.createElement('td');
            totalCell.textContent = total;
            row.appendChild(metricCell);
            row.appendChild(totalCell);
            totalsTbody.appendChild(row);
        }
        totalsTable.appendChild(totalsTbody);
        container.appendChild(totalsTable);

        // 创建按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'metrics-extractor-toggle';
        toggleButton.textContent = '显示详细数据';
        container.appendChild(toggleButton);

        // 创建详细数据部分
        const detailsSection = document.createElement('div');
        detailsSection.id = 'metrics-extractor-details';

        const detailsTitle = document.createElement('h2');
        detailsTitle.textContent = '详细数据';
        detailsSection.appendChild(detailsTitle);

        const detailsTable = document.createElement('table');
        const detailsThead = document.createElement('thead');
        const detailsHeaderRow = document.createElement('tr');
        const projectHeader = document.createElement('th');
        projectHeader.textContent = '项目';
        detailsHeaderRow.appendChild(projectHeader);
        metrics.forEach(metric => {
            const th = document.createElement('th');
            th.textContent = metric;
            detailsHeaderRow.appendChild(th);
        });
        detailsThead.appendChild(detailsHeaderRow);
        detailsTable.appendChild(detailsThead);

        const detailsTbody = document.createElement('tbody');
        detailsTable.appendChild(detailsTbody);
        detailsSection.appendChild(detailsTable);

        container.appendChild(detailsSection);
        document.body.appendChild(container);

        // 创建导出按钮
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出CSV';
        container.appendChild(exportButton);

        // 添加导出按钮点击事件
        exportButton.addEventListener('click', () => {
            let csvContent = '项目,浏览量,评论数,点赞数,收藏数,转发数\n';
            categorizedData.forEach((item, index) => {
                csvContent += `${index + 1},${item['浏览量']},${item['评论数']},${item['点赞数']},${item['收藏数']},${item['转发数']}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'metrics_data.csv';
            a.click();
            URL.revokeObjectURL(url);
        });

        // 添加按钮点击事件
        toggleButton.addEventListener('click', () => {
            if (detailsSection.style.display === 'none' || detailsSection.style.display === '') {
                detailsSection.style.display = 'block';
                toggleButton.textContent = '隐藏详细数据';
            } else {
                detailsSection.style.display = 'none';
                toggleButton.textContent = '显示详细数据';
            }
        });

        console.log('指标面板已创建。');
    }

    /**
     * 更新指标展示面板的数据
     */
    function updateMetricsPanel() {
        console.log('更新指标面板数据...');
        const totalsTableBody = document.querySelector('#metrics-extractor-container table tbody');
        const detailsTableBody = document.querySelector('#metrics-extractor-details table tbody');

        // 更新总数表格
        totalsTableBody.innerHTML = '';
        for (const [metric, total] of Object.entries(totals)) {
            const row = document.createElement('tr');
            const metricCell = document.createElement('td');
            metricCell.textContent = metric;
            const totalCell = document.createElement('td');
            totalCell.textContent = total;
            row.appendChild(metricCell);
            row.appendChild(totalCell);
            totalsTableBody.appendChild(row);
        }

        // 更新详细数据表格
        detailsTableBody.innerHTML = '';
        categorizedData.forEach((item, index) => {
            const row = document.createElement('tr');
            const projectCell = document.createElement('td');
            projectCell.textContent = index + 1;
            row.appendChild(projectCell);
            metrics.forEach(metric => {
                const cell = document.createElement('td');
                cell.textContent = item[metric] !== null ? item[metric] : '-';
                row.appendChild(cell);
            });
            detailsTableBody.appendChild(row);
        });

        console.log('指标面板数据已更新。');
    }

    /**
     * 等待指定的条件满足
     * @param {Function} conditionFunction - 返回布尔值的函数，表示条件是否满足
     * @param {number} timeout - 最大等待时间（毫秒）
     * @param {number} interval - 检查间隔时间（毫秒）
     * @returns {Promise<boolean>} 条件是否在超时前满足
     */
    function waitFor(conditionFunction, timeout = 30000, interval = 500) { // 延长超时时间至30秒
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkCondition = () => {
                if (conditionFunction()) {
                    resolve(true);
                } else if (Date.now() - startTime >= timeout) {
                    resolve(false);
                } else {
                    setTimeout(checkCondition, interval);
                }
            };
            checkCondition();
        });
    }

    /**
     * 初始化脚本
     */
    async function init() {
        console.log('Metrics Extractor 脚本初始化...');
        // 等待 div.icon_list 内至少有 1 个 div.icon 元素，并且其 span 内有内容
        const elementsLoaded = await waitFor(() => {
            const icons = document.querySelectorAll('div.icon_list div.icon');
            if (icons.length >= 1) { // 根据实际情况调整
                return Array.from(icons).every(div => {
                    const span = div.querySelector(':scope > span');
                    return span && span.innerText.trim() !== '';
                });
            }
            return false;
        }, 30000, 500); // 延长超时时间至30秒

        if (!elementsLoaded) {
            console.warn('等待目标元素超时，未找到足够的div.icon元素或span内无内容。');
            return;
        }

        // 创建指标面板
        createMetricsPanel();

        // 提取初始数据
        extractMetrics();

        // 设置定时器，每5秒重新检测并提取数据
        setInterval(() => {
            console.log('定时提取指标数据...');
            extractMetrics();
        }, 5000); // 每5秒执行一次

        console.log('Metrics Extractor 脚本运行完毕。');
    }

    // 运行初始化函数
    init();

})();
