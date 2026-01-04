// ==UserScript==
// @name         新球体育网亚盘统计
// @namespace    http://dol.freevar.com/
// @version      1.08
// @description  新球体育网（球探）手机端网页，在赛程页面加入“统计”按钮，统计当前页面里所有已完场的比赛。在分析页面加入“统计”,“表格”,“预测”按钮，“统计”按钮统计当前页面这场比赛。“表格”按钮生成各个公司对已统计场次的准确性表格，误差越低的公司越准确。选择公司后可点击“预测”按钮，预测赛果仅供参考。
// @author       Dolphin
// @match        https://m.titan007.com/info/*
// @match        https://m.titan007.com/Analy/Analysis/*
// @match        https://m.titan007.com/analy/Analysis/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529205/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/529205/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 公司映射
    const COMPANY_MAP = {
        '澳门': 1,
        '皇冠': 3,
        'Bet365': 8,
        '易胜博': 12,
        '伟德': 14,
        '明陞': 17,
        '金宝博': 23,
        '12Bet': 24,
        '利记': 31,
        '盈禾': 35,
        '18Bet': 42,
        '平博': 47,
        '香港': 48,
        '威廉': 9,
        'Inter': 19,
        '1xBet': 50
    };

    // 公司ID到名称的映射
    const COMPANY_ID_TO_NAME = {};
    Object.keys(COMPANY_MAP).forEach(name => {
        COMPANY_ID_TO_NAME[COMPANY_MAP[name]] = name;
    });

    // 创建按钮
    function createButton(text, onClick, disabled = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.fontSize = '16px';
        button.style.margin = '5px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    }

    // 获取存储的数据
    function getStoredData() {
        const stored = localStorage.getItem('asianStats');
        return stored ? JSON.parse(stored) : {};
    }

    // 保存数据到存储
    function saveData(data) {
        localStorage.setItem('asianStats', JSON.stringify(data));
    }

    // 清除数据
    function clearData() {
        localStorage.removeItem('asianStats');
        alert('统计数据已清除！');
    }

    // 获取实际比分差
    function getActualScoreDiff(scoreText) {
        const match = scoreText.match(/(\d+):(\d+)/);
        if (match) {
            return parseInt(match[1]) - parseInt(match[2]);
        }
        return null;
    }

    // 计算预期比分差
    function calculateExpectDiff(detail) {
        const drawOdds = detail.firstDrawOdds || 0;
        return drawOdds + (detail.firstAwayOdds - detail.firstHomeOdds) / 2;
    }

    // 请求赔率数据
    async function fetchOddsData(scheduleId) {
        try {
            const response = await fetch(`/HandicapDataInterface.ashx?scheid=${scheduleId}&type=1&oddskind=0&isHalf=0`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取赔率数据失败:', error);
            throw error;
        }
    }

    // 处理比赛数据
    async function processMatchData(matches, updateProgress) {
        const storedData = getStoredData();
        let processedCount = 0;

        for (const match of matches) {
            try {
                const oddsData = await fetchOddsData(match.id);
                
                if (oddsData && oddsData.companies) {
                    // 计算标准比分差
                    const companyDiffs = [];
                    
                    oddsData.companies.forEach(company => {
                        const detail = company.details.find(d => d.num === 1);
                        if (detail && detail.firstHomeOdds !== undefined && detail.firstAwayOdds !== undefined) {
                            const expectDiff = calculateExpectDiff(detail);
                            companyDiffs.push(expectDiff);
                        }
                    });

                    if (companyDiffs.length > 0) {
                        // 找到最接近实际比分差的预期比分差作为标准
                        const standardDiff = companyDiffs.reduce((closest, current) => {
                            return Math.abs(current - match.actualDiff) < Math.abs(closest - match.actualDiff) ? current : closest;
                        }, companyDiffs[0]);

                        // 计算各公司的误差并存储
                        oddsData.companies.forEach(company => {
                            const detail = company.details.find(d => d.num === 1);
                            if (detail && detail.firstHomeOdds !== undefined && detail.firstAwayOdds !== undefined) {
                                const companyName = COMPANY_ID_TO_NAME[company.companyId];
                                if (companyName) {
                                    const expectDiff = calculateExpectDiff(detail);
                                    const expectError = expectDiff - standardDiff;
                                    
                                    if (!storedData[companyName]) {
                                        storedData[companyName] = {};
                                    }
                                    
                                    storedData[companyName][match.id] = {
                                        expectDiff: expectDiff,
                                        expectError: expectError
                                    };
                                }
                            }
                        });
                    }
                }
                
                processedCount++;
                updateProgress(processedCount, matches.length);
                
                // 间隔100毫秒
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`处理比赛 ${match.id} 失败:`, error);
                alert(`获取比赛 ${match.id} 数据失败: ${error.message}`);
            }
        }
        
        return storedData;
    }

    // 处理信息页面
    function handleInfoPage() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) return;

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right';

        const clearButton = createButton('清除', clearData);
        clearButton.style.background = '#fbb';
        const statsButton = createButton('统计', handleStats);
        statsButton.style.background = '#bfb';

        buttonContainer.appendChild(clearButton);
        buttonContainer.appendChild(statsButton);
        contentDiv.insertBefore(buttonContainer, contentDiv.firstChild);

        async function handleStats() {
            statsButton.disabled = true;
            
            // 获取所有比赛数据
            const matches = [];
            const trElements = document.querySelectorAll('tr[onclick]');
            
            trElements.forEach(tr => {
                // 从onclick属性获取比赛ID
                const match = tr.getAttribute('onclick').match(/ToAnaly\((\d+)/);
                if (match) {
                    const scheduleId = match[1];
                    
                    // 查找比分
                    let scoreText = '';
                    const redSpan = tr.querySelector('span[style*="color:red"], span.red');
                    if (redSpan) {
                        scoreText = redSpan.textContent;
                    }
                    
                    const actualDiff = getActualScoreDiff(scoreText);
                    if (actualDiff !== null) {
                        matches.push({
                            id: scheduleId,
                            actualDiff: actualDiff
                        });
                    }
                }
            });

            if (matches.length === 0) {
                alert('未找到可统计的比赛数据');
                statsButton.disabled = false;
                return;
            }

            // 更新进度
            function updateProgress(current, total) {
                statsButton.textContent = `${current}/${total}`;
            }

            try {
                const finalData = await processMatchData(matches, updateProgress);
                saveData(finalData);
                alert(`统计完成，共处理 ${matches.length} 场比赛`);
            } catch (error) {
                alert('统计过程中发生错误');
            } finally {
                statsButton.disabled = false;
                statsButton.textContent = '统计';
            }
        }
    }

    // 处理分析页面
    function handleAnalysisPage() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv || typeof scheduleId === 'undefined') return;

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right';

        const clearButton = createButton('清除', clearData);
        clearButton.style.background = '#fbb';
        const statsButton = createButton('统计', handleStats);
        statsButton.style.background = '#ffb';
        const tableButton = createButton('表格', handleTable);
        tableButton.style.background = '#bfb';
        const predictButton = createButton('预测', handlePredict);
        predictButton.style.background = '#bbf';

        buttonContainer.appendChild(clearButton);
        buttonContainer.appendChild(statsButton);
        buttonContainer.appendChild(tableButton);
        buttonContainer.appendChild(predictButton);
        contentDiv.insertBefore(buttonContainer, contentDiv.firstChild);

        let tableData = null;

        async function handleStats() {
            statsButton.disabled = true;
            
            // 获取实际比分差
            const homeScoreElem = document.getElementById('homeScore');
            const guestScoreElem = document.getElementById('guestScore');
            
            if (!homeScoreElem || !guestScoreElem) {
                alert('未找到比分数据');
                statsButton.disabled = false;
                return;
            }
            
            const homeScore = parseInt(homeScoreElem.textContent);
            const guestScore = parseInt(guestScoreElem.textContent);
            const actualDiff = homeScore - guestScore;

            const matches = [{
                id: scheduleId,
                actualDiff: actualDiff
            }];

            function updateProgress(current, total) {
                statsButton.textContent = `${current}/${total}`;
            }

            try {
                const finalData = await processMatchData(matches, updateProgress);
                saveData(finalData);
            } catch (error) {
                alert('统计过程中发生错误');
            } finally {
                statsButton.disabled = false;
                statsButton.textContent = '统计';
            }
        }

        async function handleTable() {
            tableButton.disabled = true;
            
            try {
                const oddsData = await fetchOddsData(scheduleId);
                const storedData = getStoredData();
                
                if (!oddsData || !oddsData.companies) {
                    throw new Error('未获取到赔率数据');
                }

                tableData = [];

                // 计算各公司数据
                Object.keys(COMPANY_MAP).forEach(companyName => {
                    const companyId = COMPANY_MAP[companyName];
                    const companyData = oddsData.companies.find(c => c.companyId === companyId);
                    
                    const record = {
                        company: companyName,
                        openingCount: 0,
                        avgError: 0,
                        drawOdds: '没开盘',
                        oddsDiff: '没开盘',
                        expectDiff: null,
                        selected: false
                    };

                    // 计算开盘次数和平均误差
                    if (storedData[companyName]) {
                        const matches = Object.values(storedData[companyName]);
                        record.openingCount = matches.length;
                        if (matches.length > 0) {
                            const totalError = matches.reduce((sum, match) => sum + Math.abs(match.expectError), 0);
                            record.avgError = totalError / matches.length;
                        }
                    }

                    // 获取当前比赛的赔率数据
                    if (companyData) {
                        const detail = companyData.details.find(d => d.num === 1);
                        if (detail) {
                            const drawOdds = detail.firstDrawOdds || 0;
                            record.drawOdds = drawOdds + '⚽';
                            record.oddsDiff = (detail.firstAwayOdds - detail.firstHomeOdds).toFixed(2);
                            record.expectDiff = calculateExpectDiff(detail);
                        }
                    }

                    tableData.push(record);
                });

                // 按平均误差排序
                tableData.sort((a, b) => a.avgError - b.avgError);

                // 创建表格
                createTable(tableData);
                
            } catch (error) {
                alert('生成表格失败: ' + error.message);
            } finally {
                tableButton.disabled = false;
            }
        }

        function createTable(data) {
            // 移除旧的表格
            const oldTable = document.getElementById('asianStatsTable');
            const oldResult = document.getElementById('predictionResult');
            if (oldTable) oldTable.remove();
            if (oldResult) oldResult.remove();

            const table = document.createElement('table');
            table.id = 'asianStatsTable';
            table.style.borderCollapse = 'collapse';
            table.style.margin = '0 auto';
            table.style.fontSize = '16px';
            table.style.textAlign = 'center';

            // 表头
            const header = table.createTHead();
            const headerRow = header.insertRow();
            const headers = ['公司', '开盘', '平均误差', '让球', '水差', '选'];
            
            headers.forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                th.style.border = '1px solid #888';
                th.style.backgroundColor = '#eee';
                headerRow.appendChild(th);
            });

            // 表格内容
            const tbody = table.createTBody();
            data.forEach(item => {
                const row = tbody.insertRow();
                
                [item.company, item.openingCount, item.avgError.toFixed(5), item.drawOdds, item.oddsDiff].forEach(text => {
                    const cell = row.insertCell();
                    cell.textContent = text;
                    cell.style.border = '1px solid #888';
                });

                // 选择框
                const selectCell = row.insertCell();
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.selected;
                checkbox.style.position = 'initial';
                checkbox.addEventListener('change', () => {
                    item.selected = checkbox.checked;
                });
                selectCell.appendChild(checkbox);
                selectCell.style.border = '1px solid #888';
            });

            buttonContainer.parentNode.insertBefore(table, buttonContainer.nextSibling);
        }

        function handlePredict() {
            if (!tableData) {
                alert('请先生成表格');
                return;
            }

            const selectedCompanies = tableData.filter(item => item.selected);
            if (selectedCompanies.length < 2) {
                alert('请选择至少两个公司');
                return;
            }

            // 按平均误差排序
            selectedCompanies.sort((a, b) => a.avgError - b.avgError);

            // 分组
            let smallErrorGroup, largeErrorGroup;
            
            if (selectedCompanies.length % 2 === 1) {
                // 奇数个，去掉中间的那个
                const midIndex = Math.floor(selectedCompanies.length / 2);
                smallErrorGroup = selectedCompanies.slice(0, midIndex);
                largeErrorGroup = selectedCompanies.slice(midIndex + 1);
            } else {
                // 偶数个，平均分组
                const midIndex = selectedCompanies.length / 2;
                smallErrorGroup = selectedCompanies.slice(0, midIndex);
                largeErrorGroup = selectedCompanies.slice(midIndex);
            }

            // 计算总和
            const smallErrorSum = smallErrorGroup.reduce((sum, company) => sum + company.expectDiff, 0);
            const largeErrorSum = largeErrorGroup.reduce((sum, company) => sum + company.expectDiff, 0);
            const avgExpectDiff = selectedCompanies.reduce((sum, company) => sum + company.expectDiff, 0) / selectedCompanies.length;

            // 预测结果
            let prediction = '';
            if (smallErrorSum > largeErrorSum) {
                prediction = '主队赢盘';
            } else if (smallErrorSum < largeErrorSum) {
                prediction = '客队赢盘';
            } else {
                prediction = '水低者赢';
            }

            // 显示结果
            showPredictionResult(avgExpectDiff, prediction, smallErrorSum / smallErrorGroup.length, largeErrorSum / largeErrorGroup.length);
        }

        function showPredictionResult(avgExpectDiff, prediction, smallErrorAvg, largeErrorAvg) {
            const oldResult = document.getElementById('predictionResult');
            if (oldResult) oldResult.remove();

            const resultDiv = document.createElement('div');
            resultDiv.id = 'predictionResult';
            resultDiv.style.textAlign = 'center';
            resultDiv.style.fontSize = '16px';
            resultDiv.style.backgroundColor = '#fee';

            resultDiv.innerHTML = `
                <div>让球: ${avgExpectDiff.toFixed(5)} ⚽ 预测: ${prediction}</div>
                <div>较准确公司: ${smallErrorAvg.toFixed(5)} 误差大公司: ${largeErrorAvg.toFixed(5)}</div>
            `;

            const table = document.getElementById('asianStatsTable');
            if (table) {
                table.parentNode.insertBefore(resultDiv, table.nextSibling);
            } else {
                buttonContainer.parentNode.insertBefore(resultDiv, buttonContainer.nextSibling);
            }
        }
    }

    // 根据URL判断页面类型并初始化
    if (window.location.href.includes('/info/')) {
        handleInfoPage();
    } else if (window.location.href.includes('/Analy/Analysis/') || window.location.href.includes('/analy/Analysis/')) {
        handleAnalysisPage();
    }
})();