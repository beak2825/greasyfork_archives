// ==UserScript==
// @name         AR书籍积分自动计算器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动计算AR书籍的积分，支持切换不同孩子的AR基准值
// @author       snailshell
// @match        https://www.arbookfind.com/bookdetail.aspx*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543289/AR%E4%B9%A6%E7%B1%8D%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543289/AR%E4%B9%A6%E7%B1%8D%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 - 支持多个孩子的AR基准值
    const config = {
        B1: 10.0, // AR/AR基准的积分
        B2: 1.0, // 词数/10000的加成系数
        B3: 10.0, // 超额AR奖励的加成系数
        children: [ // 孩子列表及各自的AR基准值
            { name: "Ruby", arBase: 7.0 },
            { name: "Ethan", arBase: 3.4 }
        ],
        currentChildIndex: 0, // 当前选中的孩子索引
        C_type: { // 类型系数
            'Fiction': 0,
            'Nonfiction': 0.2,
            '默认': 0
        },
        MaxScore: 30.0 // 最大积分上限
    };

    // 计算B1+B2+B3的总和（用于类型奖励计算）
    const B_total = config.B1 + config.B2 + config.B3;

    // 从页面提取书籍信息
    function extractBookInfo() {
        // 提取书名
        const titleElement = document.querySelector('#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle');

        // 提取AR等级（多重提取策略）
        let arLevel = null;
        const arLabelElement = document.querySelector('#ctl00_ContentPlaceHolder1_ucBookDetail_lblATOSName');

        if (arLabelElement) {
            // 方法1: 检查同一单元格内的文本
            const fullText = arLabelElement.parentElement.textContent;
            const arMatch = fullText.match(/ATOS Book Level:?\s*([\d.]+)/i);
            if (arMatch && arMatch[1]) {
                arLevel = parseFloat(arMatch[1]);
            }

            // 方法2: 检查相邻文本节点
            if (arLevel === null && arLabelElement.nextSibling) {
                const nextText = arLabelElement.nextSibling.textContent.trim();
                if (nextText) {
                    arLevel = parseFloat(nextText.replace(/[^\d.]/g, ''));
                }
            }

            // 方法3: 检查父单元格的下一个单元格
            if (arLevel === null) {
                const parentTd = arLabelElement.closest('td');
                if (parentTd && parentTd.nextElementSibling) {
                    const valueText = parentTd.nextElementSibling.textContent.trim();
                    arLevel = parseFloat(valueText.replace(/[^\d.]/g, ''));
                }
            }
        }

        // 提取总词数
        const wordCountElement = document.querySelector('#ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount');

        // 提取类别
        const categoryElement = document.querySelector('#ctl00_ContentPlaceHolder1_ucBookDetail_lblFictionNonFiction');

        return {
            title: titleElement ? titleElement.textContent.trim() : '未知书名',
            arLevel: arLevel || null,
            wordCount: wordCountElement ? parseInt(wordCountElement.textContent.replace(/[^\d]/g, '')) : null,
            category: categoryElement ? categoryElement.textContent.trim() : '未知类别'
        };
    }

    // 计算积分（类型奖励基于B1+B2+B3总和）
    function calculatePoints(bookInfo) {
        if (!bookInfo.arLevel || !bookInfo.wordCount) {
            return null;
        }

        // 获取当前选中孩子的AR基准值
        const currentChild = config.children[config.currentChildIndex];
        const typeCoefficient = config.C_type[bookInfo.category] || config.C_type['默认'];

        // 计算各项得分
        const score1 = config.B1 * (bookInfo.arLevel / currentChild.arBase);
        const score2 = config.B2 * (bookInfo.wordCount / 10000);
        const score3 = config.B3 * Math.max(0, bookInfo.arLevel - currentChild.arBase);
        // 类型奖励积分 = (B1+B2+B3) × (类型系数)
        const score4 = B_total * typeCoefficient;

        // 基础分总和（不含类型奖励）
        const baseTotal = score1 + score2 + score3;
        // 加上类型奖励后的总分
        const totalScore = baseTotal + score4;
        const finalScore = Math.min(totalScore, config.MaxScore);

        return {
            finalScore: parseFloat(finalScore.toFixed(2)),
            details: {
                childName: currentChild.name,
                arBase: currentChild.arBase,
                score1: parseFloat(score1.toFixed(2)),
                score2: parseFloat(score2.toFixed(2)),
                score3: parseFloat(score3.toFixed(2)),
                score4: parseFloat(score4.toFixed(2)), // 类型奖励积分
                typeCoefficient: typeCoefficient,
                baseTotal: parseFloat(baseTotal.toFixed(2)), // 基础分总和
                totalBeforeCap: parseFloat(totalScore.toFixed(2)),
                B_total: B_total // B1+B2+B3的总和
            }
        };
    }

    // 切换孩子并重新计算积分
    function switchChild(index, bookInfo, widget) {
        config.currentChildIndex = index;
        const pointsResult = calculatePoints(bookInfo);
        updateResultDisplay(widget, bookInfo, pointsResult);
    }

    // 更新结果显示（显示基于B1+B2+B3的类型奖励）
    function updateResultDisplay(widget, bookInfo, pointsResult) {
        const resultDiv = widget.querySelector('.result-div');
        if (pointsResult) {
            resultDiv.innerHTML = `
                <p style="font-size:18px; text-align:center; margin:10px 0;">
                    <strong>该书标准积分: ${pointsResult.finalScore}</strong>
                </p>
                <button id="toggleDetails" style="width:100%; padding:5px; background:#e8f5e9; border:1px solid #4CAF50; border-radius:3px; cursor:pointer;">
                    查看计算细节
                </button>
                <div id="calculationDetails" style="display:none; margin-top:10px; font-size:14px;">
                    <p>当前姓名: ${pointsResult.details.childName} (AR基准: ${pointsResult.details.arBase})</p>
                    <p>1. 书籍AR/基准AR 积分: ${pointsResult.details.score1} (基数: ${config.B1})</p>
                    <p>2. 词数/10000 积分: ${pointsResult.details.score2} (基数: ${config.B2})</p>
                    <p>3. AR难度奖励 积分: ${pointsResult.details.score3} (加成系数: ${config.B3})</p>
                    <p>4. Fiction/NonFiction 奖励积分: ${pointsResult.details.score4}
                       (加成系数: ${pointsResult.details.typeCoefficient})</p>
                    <p>注意：单本书最大积分上限: ${config.MaxScore}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style="text-align:center; color:#d32f2f;">无法计算积分 - 缺少必要信息</p>`;
        }

        // 重新绑定细节显示/隐藏事件
        const toggleBtn = resultDiv.querySelector('#toggleDetails');
        const detailsDiv = resultDiv.querySelector('#calculationDetails');
        if (toggleBtn && detailsDiv) {
            toggleBtn.addEventListener('click', () => {
                detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
                toggleBtn.textContent = detailsDiv.style.display === 'none' ? '查看计算细节' : '隐藏计算细节';
            });
        }
    }

    // 创建并显示积分浮动框
    function createPointsWidget(bookInfo, pointsResult) {
        // 创建容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px; /* 稍微加宽以适应更长的计算细节 */
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;

        // 标题部分
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 8px;
        `;
        header.innerHTML = `<h3 style="margin:0; color:#2E7D32;">书籍积分计算</h3>`;
        container.appendChild(header);

        // 孩子选择部分
        const childSelector = document.createElement('div');
        childSelector.style.cssText = `
            margin-bottom: 10px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 5px;
        `;

        let childButtonsHtml = '<p><strong>选择你的姓名:</strong></p><div style="display: flex; gap: 10px;">';
        config.children.forEach((child, index) => {
            childButtonsHtml += `
                <button class="child-btn" data-index="${index}" style="
                    padding: 5px 10px;
                    border: 1px solid #4CAF50;
                    border-radius: 3px;
                    background: ${index === config.currentChildIndex ? '#4CAF50' : '#e8f5e9'};
                    color: ${index === config.currentChildIndex ? 'white' : 'black'};
                    cursor: pointer;
                ">
                    ${child.name} (${child.arBase})
                </button>
            `;
        });
        childButtonsHtml += '</div>';
        childSelector.innerHTML = childButtonsHtml;
        container.appendChild(childSelector);

        // 书籍信息
        const bookInfoDiv = document.createElement('div');
        bookInfoDiv.style.marginBottom = '10px';
        bookInfoDiv.innerHTML = `
            <p><strong>书名:</strong> ${bookInfo.title}</p>
            <p><strong>AR等级:</strong> ${bookInfo.arLevel || '无法获取'}</p>
            <p><strong>总词数:</strong> ${bookInfo.wordCount ? bookInfo.wordCount.toLocaleString() : '无法获取'}</p>
            <p><strong>类别:</strong> ${bookInfo.category}</p>
        `;
        container.appendChild(bookInfoDiv);

        // 积分结果
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-div';
        resultDiv.style.padding = '10px';
        resultDiv.style.borderRadius = '5px';
        resultDiv.style.backgroundColor = '#f1f8e9';
        container.appendChild(resultDiv);

        // 添加到页面
        document.body.appendChild(container);

        // 更新结果显示
        updateResultDisplay(container, bookInfo, pointsResult);

        // 绑定孩子切换事件
        childSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('child-btn')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                // 更新按钮样式
                childSelector.querySelectorAll('.child-btn').forEach(b => {
                    const i = parseInt(b.getAttribute('data-index'));
                    b.style.background = i === index ? '#4CAF50' : '#e8f5e9';
                    b.style.color = i === index ? 'white' : 'black';
                });
                // 切换孩子并重新计算
                switchChild(index, bookInfo, container);
            }
        });
    }

    // 优化加载速度：动态检测元素加载
    function init() {
        // 尝试提取信息
        let bookInfo = extractBookInfo();

        // 如果已获取关键信息，直接创建界面
        if (bookInfo.wordCount) {
            createPointsWidget(bookInfo, calculatePoints(bookInfo));
            return;
        }

        // 否则短间隔检测
        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            bookInfo = extractBookInfo();

            // 检查是否获取到关键信息或达到最大尝试次数
            if (bookInfo.wordCount || attempts > 10) {
                clearInterval(timer);
                createPointsWidget(bookInfo, calculatePoints(bookInfo));
            }
        }, 200); // 每200ms检测一次
    }

    // 页面就绪后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
