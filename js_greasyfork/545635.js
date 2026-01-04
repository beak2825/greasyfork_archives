// ==UserScript==
// @name         千川eCPM计算器
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  eCPM值显示两位小数
// @author       You
// @match        https://qianchuan.jinritemai.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545635/%E5%8D%83%E5%B7%9DeCPM%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545635/%E5%8D%83%E5%B7%9DeCPM%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 千川eCPM计算器启动...');

    let currentUrl = window.location.href;
    let isAutoCalculating = false;
    let ecpmColumn = null;

    function createCalculatorPanel() {
        const panel = document.createElement('div');
        panel.id = 'ecpm-calculator-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 450px;
            background: #fff;
            border: 2px solid #1890ff;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        panel.innerHTML = `
            <div id="panel-header" style="
                background: linear-gradient(135deg, #1890ff, #40a9ff);
                color: white;
                padding: 12px 15px;
                border-radius: 6px 6px 0 0;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                white-space: nowrap;
            ">
                <span id="panel-title" style="font-weight: 600; font-size: 14px;">🚀 千川eCPM计算器</span>
                <div style="display: flex; gap: 5px;">
                    <button id="minimize-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">−</button>
                    <button id="close-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">×</button>
                </div>
            </div>
            <div id="panel-content" style="padding: 15px;">
                <div style="margin-bottom: 15px; padding: 12px; background: #f0f9ff; border-radius: 6px; border-left: 4px solid #1890ff;">
                    <div style="font-weight: 600; color: #1890ff; margin-bottom: 8px;">eCPM计算公式</div>
                    <div style="font-size: 12px; color: #666; line-height: 1.4;">
                        • <strong>有出价时:</strong> 出价 × CTR × CVR × 1000<br>
                        • <strong>无出价时:</strong> (客单价÷ROI) × CTR × CVR × 1000<br>
                        • <strong>eCPM列显示在表格左侧，与表格行对齐</strong>
                    </div>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: #f6f8fa; border-radius: 6px;">
                    <label style="font-size: 12px; font-weight: 600; color: #333;">客单价设置:</label>
                    <input id="unit-price" type="number" value="39.9" step="0.1" style="
                        width: 80px;
                        margin-left: 8px;
                        padding: 4px 8px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                        font-size: 12px;
                    "> 元
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: #fff7e6; border-radius: 6px; border: 1px solid #ffd666;">
                    <label style="display: flex; align-items: center; font-size: 12px; color: #333;">
                        <input id="auto-calculate" type="checkbox" checked style="margin-right: 8px;">
                        <span style="font-weight: 600;">页面切换时自动计算eCPM</span>
                    </label>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <button id="analyze-btn" style="
                        padding: 10px;
                        background: #52c41a;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                    ">📊 分析数据</button>
                    <button id="calculate-btn" style="
                        padding: 10px;
                        background: #1890ff;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                    ">🚀 计算eCPM</button>
                </div>

                <button id="clear-btn" style="
                    width: 100%;
                    padding: 8px;
                    background: #fa8c16;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 15px;
                ">🧹 清除结果</button>

                <div id="result-display" style="
                    background: #fafafa;
                    border: 1px solid #e8e8e8;
                    border-radius: 6px;
                    padding: 12px;
                    font-size: 11px;
                    max-height: 250px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                    font-family: 'Consolas', 'Monaco', monospace;
                    line-height: 1.4;
                ">点击"分析数据"开始...</div>
            </div>
        `;

        document.body.appendChild(panel);
        setupPanelEvents();
        makePanelDraggable();
        setupPageChangeListener();
    }

    function setupPanelEvents() {
        document.getElementById('minimize-btn').onclick = (e) => {
            e.stopPropagation();
            toggleMinimize();
        };

        document.getElementById('close-btn').onclick = (e) => {
            e.stopPropagation();
            document.getElementById('ecpm-calculator-panel').remove();
            if (ecpmColumn) {
                ecpmColumn.remove();
                ecpmColumn = null;
            }
        };

        document.getElementById('analyze-btn').onclick = analyzeTableData;
        document.getElementById('calculate-btn').onclick = calculateAllECPM;
        document.getElementById('clear-btn').onclick = clearAllResults;
    }

    function setupPageChangeListener() {
        // 监听URL变化
        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                onPageChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听浏览器前进后退
        window.addEventListener('popstate', onPageChange);

        // 监听点击事件（分页按钮等）
        document.addEventListener('click', (e) => {
            // 检查是否点击了分页相关的元素
            const target = e.target;
            if (target.matches('.ovui-pagination *') ||
                target.closest('.ovui-pagination') ||
                target.textContent.includes('下一页') ||
                target.textContent.includes('上一页') ||
                /^\d+$/.test(target.textContent.trim())) {

                setTimeout(onPageChange, 1000); // 延迟1秒等待页面加载
            }
        });

        logResult('✅ 页面变化监听已启动');
    }

    function onPageChange() {
        const autoCalculate = document.getElementById('auto-calculate');
        if (autoCalculate && autoCalculate.checked && !isAutoCalculating) {
            isAutoCalculating = true;
            logResult('\n🔄 检测到页面变化，自动重新计算...');

            // 清除旧结果
            clearAllResults();

            // 等待页面加载完成后自动计算
            setTimeout(() => {
                analyzeTableData();
                setTimeout(() => {
                    calculateAllECPM();
                    isAutoCalculating = false;
                }, 1000);
            }, 2000);
        }
    }

    function toggleMinimize() {
        const content = document.getElementById('panel-content');
        const panel = document.getElementById('ecpm-calculator-panel');
        const btn = document.getElementById('minimize-btn');
        const title = document.getElementById('panel-title');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            panel.style.width = '450px';
            btn.textContent = '−';
            title.textContent = '🚀 千川eCPM计算器';
        } else {
            content.style.display = 'none';
            panel.style.width = '200px';
            btn.textContent = '+';
            title.textContent = '🚀 eCPM计算器';
        }
    }

    function makePanelDraggable() {
        const panel = document.getElementById('ecpm-calculator-panel');
        const header = document.getElementById('panel-header');

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            if (e.target.id === 'minimize-btn' || e.target.id === 'close-btn') {
                return;
            }

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = panel.offsetTop - pos2;
            let newLeft = panel.offsetLeft - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth));

            panel.style.top = newTop + "px";
            panel.style.left = newLeft + "px";
            panel.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function logResult(message) {
        const display = document.getElementById('result-display');
        if (display) {
            display.textContent += message + '\n';
            display.scrollTop = display.scrollHeight;
        }
        console.log(message);
    }

    function clearLog() {
        const display = document.getElementById('result-display');
        if (display) display.textContent = '';
    }

    function getTables() {
        const tables = document.querySelectorAll('table.ovui-table');
        let headerTable = null;
        let dataTable = null;

        tables.forEach(table => {
            const hasHeaders = table.querySelectorAll('th').length > 0;
            const hasData = table.querySelectorAll('tbody tr').length > 0;

            if (hasHeaders && !hasData) {
                headerTable = table;
            } else if (hasData) {
                dataTable = table;
            }
        });

        return { headerTable, dataTable };
    }

    // 改进的行验证函数，跳过汇总行和表头扩展行
    function isSummaryRow(row) {
        try {
            const cells = row.querySelectorAll('td');

            // 检查是否为汇总行
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent.trim();
                if (cellText.includes('共') && cellText.includes('条计划')) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // 新增函数：检查是否为表头扩展行或状态行
    function isHeaderExtensionRow(row) {
        try {
            const cells = row.querySelectorAll('td');

            // 如果行的单元格数量太少，可能是表头扩展行
            if (cells.length < 5) {
                return true;
            }

            // 检查是否包含状态显示信息（如图片中的第二行）
            let hasStatusInfo = false;
            let hasActualData = false;

            for (let cell of cells) {
                const cellText = cell.textContent.trim();
                const innerHTML = cell.innerHTML;

                // 检查是否包含状态相关的内容
                if (cellText.includes('计划状态') ||
                    cellText.includes('投放状态') ||
                    innerHTML.includes('status') ||
                    cell.querySelector('.status')) {
                    hasStatusInfo = true;
                }

                // 检查是否有实际的数据（数字、链接等）
                if (cellText.match(/^\d+/) ||
                    cell.querySelector('a[href]') ||
                    cellText.includes('ID:')) {
                    hasActualData = true;
                    break;
                }
            }

            // 如果只有状态信息而没有实际数据，认为是表头扩展行
            return hasStatusInfo && !hasActualData;

        } catch (error) {
            return false;
        }
    }

    // 使用你提供的准确分析函数
    function analyzeTableData() {
        clearLog();
        logResult('📊 === 开始分析表格数据 ===');

        const { headerTable, dataTable } = getTables();

        if (!headerTable || !dataTable) {
            logResult('❌ 未找到完整的表格结构！');
            return;
        }

        const headers = headerTable.querySelectorAll('th');
        const headerTexts = Array.from(headers).map(h => h.textContent.trim());

        const planNameColumnIndex = headerTexts.findIndex(text => text.includes('计划名称'));
        const bidColumnIndex = headerTexts.findIndex(text => text.includes('出价'));
        const roiColumnIndex = headerTexts.findIndex(text => text.includes('ROI目标'));
        const ctrColumnIndex = headerTexts.findIndex(text => text.includes('点击率'));
        const cvrColumnIndex = headerTexts.findIndex(text => text.includes('转化率'));

        logResult(`表头列位置:`);
        logResult(`- 计划名称列: ${planNameColumnIndex >= 0 ? planNameColumnIndex : '未找到'}`);
        logResult(`- 出价列: ${bidColumnIndex >= 0 ? bidColumnIndex : '未找到'}`);
        logResult(`- ROI目标列: ${roiColumnIndex >= 0 ? roiColumnIndex : '未找到'}`);
        logResult(`- 点击率列: ${ctrColumnIndex >= 0 ? ctrColumnIndex : '未找到'}`);
        logResult(`- 转化率列: ${cvrColumnIndex >= 0 ? cvrColumnIndex : '未找到'}`);

        const rows = dataTable.querySelectorAll('tbody tr');
        logResult(`\n找到 ${rows.length} 行数据`);

        let validRows = 0;
        let skippedRows = 0;

        rows.forEach((row, index) => {
            // 检查是否为汇总行
            if (isSummaryRow(row)) {
                const cells = row.querySelectorAll('td');
                const firstCellText = cells.length > 0 ? cells[0].textContent.trim() : '';
                logResult(`第${index + 1}行: ⏭️ 跳过汇总行 - "${firstCellText.substring(0, 30)}..."`);
                skippedRows++;
                return;
            }

            // 检查是否为表头扩展行
            if (isHeaderExtensionRow(row)) {
                logResult(`第${index + 1}行: ⏭️ 跳过表头扩展行/状态行`);
                skippedRows++;
                return;
            }

            const cells = row.querySelectorAll('td');

            let bid = 0, roi = 0, ctr = 0, cvr = 0;

            if (bidColumnIndex >= 0 && cells[bidColumnIndex]) {
                const bidText = cells[bidColumnIndex].textContent.trim();
                if (bidText !== '-' && bidText.match(/^\d+\.?\d*$/)) {
                    bid = parseFloat(bidText);
                }
            }

            if (roiColumnIndex >= 0 && cells[roiColumnIndex]) {
                const roiText = cells[roiColumnIndex].textContent.trim();
                if (roiText.includes('日总支付ROI')) {
                    const match = roiText.match(/(\d+\.?\d*)/);
                    if (match) roi = parseFloat(match[1]);
                }
            }

            if (ctrColumnIndex >= 0 && cells[ctrColumnIndex]) {
                const ctrText = cells[ctrColumnIndex].textContent.trim();
                if (ctrText.includes('%')) {
                    const ctrValue = parseFloat(ctrText.replace(/[^0-9.-]/g, ''));
                    if (ctrValue > 0) ctr = ctrValue;
                }
            }

            if (cvrColumnIndex >= 0 && cells[cvrColumnIndex]) {
                const cvrText = cells[cvrColumnIndex].textContent.trim();
                if (cvrText.includes('%')) {
                    const cvrValue = parseFloat(cvrText.replace(/[^0-9.-]/g, ''));
                    if (cvrValue > 0) cvr = cvrValue;
                }
            }

            const canCalculate = (bid > 0 || roi > 0) && ctr > 0 && cvr > 0;

            if (canCalculate) {
                validRows++;
                const formula = bid > 0 ? '出价公式' : 'ROI公式';
                logResult(`第${index + 1}行: ✅ 可计算 (${formula}) - 出价:${bid || '无'}, ROI:${roi || '无'}, CTR:${ctr}%, CVR:${cvr}%`);
            } else {
                logResult(`第${index + 1}行: ❌ 不可计算 - 出价:${bid || '无'}, ROI:${roi || '无'}, CTR:${ctr}%, CVR:${cvr}%`);
            }
        });

        logResult(`\n📊 分析结果:`);
        logResult(`- 总行数: ${rows.length}`);
        logResult(`- 跳过行数: ${skippedRows} (汇总行+表头扩展行)`);
        logResult(`- 有效数据行: ${rows.length - skippedRows}`);
        logResult(`- 可计算行数: ${validRows}`);
        logResult(`- 无效行数: ${rows.length - skippedRows - validRows}`);
        logResult('\n📊 === 分析完成 ===');
    }

    function calculateAllECPM() {
        clearLog();
        logResult('🚀 === 开始计算eCPM ===');

        const unitPrice = parseFloat(document.getElementById('unit-price').value) || 39.9;
        logResult(`客单价设置: ${unitPrice}元`);

        const { headerTable, dataTable } = getTables();

        if (!headerTable || !dataTable) {
            logResult('❌ 未找到表格结构！');
            if (!isAutoCalculating) {
                alert('❌ 未找到表格数据，请刷新页面后重试！');
            }
            return;
        }

        // 先清除所有旧的eCPM列
        clearAllResults();

        // 获取列索引
        const headers = headerTable.querySelectorAll('th');
        const headerTexts = Array.from(headers).map(h => h.textContent.trim());

        const bidColumnIndex = headerTexts.findIndex(text => text.includes('出价'));
        const roiColumnIndex = headerTexts.findIndex(text => text.includes('ROI目标'));
        const ctrColumnIndex = headerTexts.findIndex(text => text.includes('点击率'));
        const cvrColumnIndex = headerTexts.findIndex(text => text.includes('转化率'));

        const rows = dataTable.querySelectorAll('tbody tr');
        let successCount = 0;
        let skippedCount = 0;
        let ecpmValues = [];

        rows.forEach((row, index) => {
            try {
                // 检查是否为汇总行
                if (isSummaryRow(row)) {
                    logResult(`第${index + 1}行: ⏭️ 跳过汇总行`);
                    skippedCount++;
                    ecpmValues.push({ value: 0, text: '-', title: '汇总行' });
                    return;
                }

                // 检查是否为表头扩展行
                if (isHeaderExtensionRow(row)) {
                    logResult(`第${index + 1}行: ⏭️ 跳过表头扩展行/状态行`);
                    skippedCount++;
                    ecpmValues.push({ value: 0, text: '-', title: '状态行' });
                    return;
                }

                const cells = row.querySelectorAll('td');

                let bid = 0, roi = 0, ctr = 0, cvr = 0;

                // 使用原始的列索引
                if (bidColumnIndex >= 0 && cells[bidColumnIndex]) {
                    const bidText = cells[bidColumnIndex].textContent.trim();
                    if (bidText !== '-' && bidText.match(/^\d+\.?\d*$/)) {
                        bid = parseFloat(bidText);
                    }
                }

                if (roiColumnIndex >= 0 && cells[roiColumnIndex]) {
                    const roiText = cells[roiColumnIndex].textContent.trim();
                    if (roiText.includes('日总支付ROI')) {
                        const match = roiText.match(/(\d+\.?\d*)/);
                        if (match) roi = parseFloat(match[1]);
                    }
                }

                if (ctrColumnIndex >= 0 && cells[ctrColumnIndex]) {
                    const ctrText = cells[ctrColumnIndex].textContent.trim();
                    if (ctrText.includes('%')) {
                        const ctrValue = parseFloat(ctrText.replace(/[^0-9.-]/g, ''));
                        if (ctrValue > 0) ctr = ctrValue;
                    }
                }

                if (cvrColumnIndex >= 0 && cells[cvrColumnIndex]) {
                    const cvrText = cells[cvrColumnIndex].textContent.trim();
                    if (cvrText.includes('%')) {
                        const cvrValue = parseFloat(cvrText.replace(/[^0-9.-]/g, ''));
                        if (cvrValue > 0) cvr = cvrValue;
                    }
                }

                // 计算eCPM
                let ecpm = 0;
                let formula = '';
                let calculation = '';

                if ((bid > 0 || roi > 0) && ctr > 0 && cvr > 0) {
                    const ctrDecimal = ctr / 100;
                    const cvrDecimal = cvr / 100;

                    if (bid > 0) {
                        ecpm = bid * ctrDecimal * cvrDecimal * 1000;
                        formula = '出价公式';
                        calculation = `${bid} × ${ctrDecimal} × ${cvrDecimal} × 1000 = ${ecpm.toFixed(2)}`;
                    } else if (roi > 0) {
                        ecpm = (unitPrice / roi) * ctrDecimal * cvrDecimal * 1000;
                        formula = 'ROI公式';
                        calculation = `(${unitPrice} ÷ ${roi}) × ${ctrDecimal} × ${cvrDecimal} × 1000 = ${ecpm.toFixed(2)}`;
                    }

                    logResult(`第${index + 1}行: ${calculation}`);
                    successCount++;

                    ecpmValues.push({
                        value: ecpm,
                        text: ecpm.toFixed(2),  // 修改：显示两位小数
                        title: `eCPM: ${ecpm.toFixed(2)} (${formula})`
                    });
                } else {
                    ecpmValues.push({
                        value: 0,
                        text: '-',
                        title: '无法计算eCPM'
                    });
                }

            } catch (error) {
                logResult(`第${index + 1}行处理出错: ${error.message}`);
                console.error('处理行数据出错:', error);
                ecpmValues.push({
                    value: 0,
                    text: '错误',
                    title: '计算出错'
                });
            }
        });

        // 创建浮动的eCPM列，传入计算好的数据
        createFloatingECPMColumn(headerTable, dataTable, ecpmValues);

        logResult(`\n🚀 === 计算完成 ===`);
        logResult(`跳过行数: ${skippedCount} (汇总行+表头扩展行)`);
        logResult(`成功计算: ${successCount} 行`);

        if (successCount > 0) {
            if (!isAutoCalculating) {
                alert(`🎉 成功计算了 ${successCount} 行数据的eCPM！\n跳过了 ${skippedCount} 个无效行\neCPM列显示在表格左侧。`);
            }
        } else {
            if (!isAutoCalculating) {
                alert(`😅 没有找到可计算的数据行！`);
            }
        }
    }

    function createFloatingECPMColumn(headerTable, dataTable, ecpmValues) {
        if (ecpmColumn) {
            ecpmColumn.remove();
        }

        // 获取表头和数据表格的位置
        const headerRect = headerTable.getBoundingClientRect();
        const dataRect = dataTable.getBoundingClientRect();

        // 创建eCPM列容器，稍微增加宽度以容纳两位小数
        ecpmColumn = document.createElement('div');
        ecpmColumn.id = 'floating-ecpm-column';
        ecpmColumn.style.cssText = `
            position: fixed;
            left: ${Math.min(headerRect.left, dataRect.left) - 60}px;
            top: ${headerRect.top}px;
            width: 55px;
            background: white;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: -2px 0 8px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 添加表头
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #52c41a, #73d13d);
            color: white;
            text-align: center;
            font-weight: bold;
            padding: 8px 4px;
            font-size: 12px;
            border-bottom: 1px solid #389e0d;
            height: ${headerRect.height - 2}px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        header.textContent = 'eCPM';
        ecpmColumn.appendChild(header);

        // 添加数据行，与表格行高度对齐
        const dataRows = dataTable.querySelectorAll('tbody tr');
        ecpmValues.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.className = 'ecpm-data-cell';

            // 获取对应表格行的高度
            let rowHeight = 40; // 默认高度
            if (dataRows[index]) {
                rowHeight = dataRows[index].offsetHeight;
            }

            cell.style.cssText = `
                padding: 4px 2px;
                text-align: center;
                font-size: 10px;
                border-bottom: 1px solid #f0f0f0;
                height: ${rowHeight}px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                ${item.value > 0 ?
                    'background: linear-gradient(135deg, #52c41a, #73d13d); color: white; font-weight: bold;' :
                    'background: #f5f5f5; color: #999;'
                }
            `;
            cell.textContent = item.text;
            cell.title = item.title;
            ecpmColumn.appendChild(cell);
        });

        document.body.appendChild(ecpmColumn);

        // 监听滚动和窗口变化，保持位置同步
        function updatePosition() {
            const newHeaderRect = headerTable.getBoundingClientRect();
            const newDataRect = dataTable.getBoundingClientRect();
            ecpmColumn.style.left = `${Math.min(newHeaderRect.left, newDataRect.left) - 60}px`;
            ecpmColumn.style.top = `${newHeaderRect.top}px`;
        }

        // 监听多种滚动容器
        const scrollContainers = [
            window,
            document.querySelector('.ovui-table-wrapper'),
            document.querySelector('.table-container'),
            document.querySelector('.ovui-table-scroll'),
            dataTable.closest('.ovui-scrollbar')
        ].filter(Boolean);

        scrollContainers.forEach(container => {
            container.addEventListener('scroll', updatePosition, { passive: true });
        });

        window.addEventListener('resize', updatePosition);

        logResult('✅ eCPM浮动列已创建并定位到表格左侧');
    }

    function clearAllResults() {
        if (ecpmColumn) {
            ecpmColumn.remove();
            ecpmColumn = null;
        }

        clearLog();
        logResult('🧹 已清除所有eCPM列');
    }

    // 启动
    setTimeout(() => {
        createCalculatorPanel();
    }, 1000);

})();
