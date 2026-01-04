// ==UserScript==
// @name         Google Ads 页面处理（性能优化最终修正版）
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  修正了总预算未显示在总计行的问题，确保脚本正常运行并提升性能
// @author
// @match        https://ads.google.com/aw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523343/Google%20Ads%20%E9%A1%B5%E9%9D%A2%E5%A4%84%E7%90%86%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%9C%80%E7%BB%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523343/Google%20Ads%20%E9%A1%B5%E9%9D%A2%E5%A4%84%E7%90%86%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%9C%80%E7%BB%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 5px 8px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            white-space: nowrap;
            z-index: 9999;
            display: none;
            font-size: 12px;
        }
        .progress-bar-container {
            position: relative;
            width: 100%;
            height: 24px;
            background-color: #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background-color: #4285F4;
        }
        .text-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            pointer-events: none;
            color: white;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // 创建全局悬浮提示框
    const globalTooltip = document.createElement('div');
    globalTooltip.className = 'custom-tooltip';
    document.body.appendChild(globalTooltip);

    // 工具函数：从字符串中提取数字部分，支持含逗号的数字
    function extractNumber(text) {
        const match = text.match(/(?:US\$|\$|¥|€)?([\d,]+(?:\.\d+)?)/);
        if (match) {
            // 移除逗号，转换为数字
            return parseFloat(match[1].replace(/,/g, ''));
        }
        return null;
    }

    // 修改费用样式
    function updateCostElement(costElement, percentage, costText) {
        // 检查是否已经处理过
        if (costElement.dataset.processed === 'true') return;
        costElement.dataset.processed = 'true';

        // 创建进度条容器
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';

        // 创建已花费部分（动态颜色）
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${Math.min(percentage, 100)}%`;

        // 根据百分比动态改变颜色
        if (percentage < 50) {
            progressBar.style.backgroundColor = 'green';
        } else if (percentage < 80) {
            progressBar.style.backgroundColor = 'orange';
        } else {
            progressBar.style.backgroundColor = 'red';
        }

        // 创建文字内容（居中显示）
        const textOverlay = document.createElement('div');
        textOverlay.className = 'text-overlay';
        textOverlay.textContent = `${costText}`;

        // 将子元素添加到容器
        progressBarContainer.appendChild(progressBar);
        progressBarContainer.appendChild(textOverlay);

        // 清空原始内容并添加新样式
        costElement.innerHTML = '';
        costElement.appendChild(progressBarContainer);

        // 添加鼠标悬浮效果，显示百分比
        costElement.addEventListener('mouseenter', (e) => {
            globalTooltip.textContent = `已花费 ${percentage.toFixed(2)}%`;
            globalTooltip.style.left = e.pageX + 10 + 'px';
            globalTooltip.style.top = e.pageY + 10 + 'px';
            globalTooltip.style.display = 'block';
        });

        costElement.addEventListener('mousemove', (e) => {
            globalTooltip.style.left = e.pageX + 10 + 'px';
            globalTooltip.style.top = e.pageY + 10 + 'px';
        });

        costElement.addEventListener('mouseleave', () => {
            globalTooltip.style.display = 'none';
        });
    }

    // 主处理函数
    function processData(targetNode = document) {
        // 获取所有未处理的行，排除总计行
        const rows = targetNode.querySelectorAll('.particle-table-row:not(.particle-table-summary-row):not(.processed)');

        let totalBudget = 0; // 初始化总预算

        rows.forEach(row => {
            row.classList.add('processed');

            const budgetElement = row.querySelector('.ess-cell-ellipsis.budget-amount');
            const costElement = row.querySelector('ess-cell[essfield="stats.cost"]');

            if (budgetElement && costElement) {
                const budgetText = budgetElement.textContent.trim();
                const costText = costElement.textContent.trim();

                const budgetValue = extractNumber(budgetText);
                const costValue = extractNumber(costText);

                if (budgetValue && costValue !== null) {
                    const percentage = (costValue / budgetValue) * 100;
                    updateCostElement(costElement, percentage, costText);
                }

                // 累加预算值
                if (budgetValue !== null && !isNaN(budgetValue)) {
                    totalBudget += budgetValue;
                }
            }

            // 为预算和出价列添加悬浮计算值
            const targetElements = row.querySelectorAll('.ess-cell-ellipsis.budget-amount:not(.tooltip-processed), .bid-cell:not(.tooltip-processed)');

            targetElements.forEach(el => {
                el.classList.add('tooltip-processed');

                const text = el.textContent.trim();
                let calculatedValue = null;

                const dollarMatch = text.match(/(?:US\$|\$|¥|€)?([\d,]+(?:\.\d+)?)(?:\/(?:天|day))?/);
                if (dollarMatch) {
                    const originalValue = parseFloat(dollarMatch[1].replace(/,/g, ''));
                    calculatedValue = (originalValue * 0.2).toFixed(2);
                }

                const percentageMatch = text.match(/(\d+(?:\.\d+)?)%/);
                if (percentageMatch) {
                    const originalValue = parseFloat(percentageMatch[1]);
                    calculatedValue = (originalValue * 0.2).toFixed(2);
                }

                if (calculatedValue !== null) {
                    el.addEventListener('mouseenter', (e) => {
                        globalTooltip.textContent = `计算值：${calculatedValue}`;
                        globalTooltip.style.left = e.pageX + 10 + 'px';
                        globalTooltip.style.top = e.pageY + 10 + 'px';
                        globalTooltip.style.display = 'block';
                    });

                    el.addEventListener('mousemove', (e) => {
                        globalTooltip.style.left = e.pageX + 10 + 'px';
                        globalTooltip.style.top = e.pageY + 10 + 'px';
                    });

                    el.addEventListener('mouseleave', () => {
                        globalTooltip.style.display = 'none';
                    });
                }
            });
        });

        // 处理总计行
        const summaryRow = targetNode.querySelector('.particle-table-summary-row.particle-table-last-row:not(.processed)');
        if (summaryRow) {
            summaryRow.classList.add('processed');

            const costElement = summaryRow.querySelector('ess-cell[essfield="stats.cost"]');
            const budgetElement = summaryRow.querySelector('.ess-cell-ellipsis.budget-amount');

            // 如果总预算元素存在，更新其文本内容
            if (budgetElement) {
                // 显示总预算值
                budgetElement.textContent = `总预算：${totalBudget.toFixed(2)}`;
            } else {
                // 如果总计行中没有预算单元格，则创建一个新的单元格并添加到总计行中
                const newBudgetCell = document.createElement('div');
                newBudgetCell.className = 'ess-cell-ellipsis budget-amount';
                newBudgetCell.textContent = `总预算：${totalBudget.toFixed(2)}`;

                // 根据页面结构，将新单元格插入到总计行中合适的位置
                // 这里假设和其他行的预算列位置一致，需要根据实际情况调整
                const referenceCell = summaryRow.querySelector('ess-cell[essfield="campaign.name"]');
                if (referenceCell) {
                    // 在参考单元格之后插入新单元格
                    summaryRow.insertBefore(newBudgetCell, referenceCell.nextSibling);
                } else {
                    // 如果找不到参考单元格，直接添加到行尾
                    summaryRow.appendChild(newBudgetCell);
                }
            }

            // 处理总费用元素
            if (costElement) {
                const costText = costElement.textContent.trim();
                const totalCost = extractNumber(costText);

                if (totalCost && totalBudget) {
                    const percentage = (totalCost / totalBudget) * 100;
                    updateCostElement(costElement, percentage, costText);
                }
            }
        }
    }

    // Debounce 函数
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver(debounce((mutationsList) => {
        let shouldProcess = false;
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            processData(document);
        }
    }, 300));

    // 开始观察 document.body
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次处理
    processData(document);
})();
