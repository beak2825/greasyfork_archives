// ==UserScript==
// @name         新球体育网亚盘统计
// @namespace    http://dol.freevar.com/
// @version      1.09
// @description  新球体育网（球探）手机端网页。在分析页面加入“统计”,“表格”,“开关”按钮，“统计”按钮统计当前页面这场比赛。“表格”按钮生成各个公司对已统计场次的准确性表格，误差越低的公司越准确。“开关”按钮在最近赛事里显示统计按钮。预测赛果仅供参考。
// @author       Dolphin
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

    // 公司映射表
    const COMPANY_MAP = {
        '澳门': {id: 1, name: '澳门'},
        'Bet365': {id: 8, name: 'Bet365'},
        '易胜博': {id: 12, name: '易胜博'},
        '伟德': {id: 14, name: '伟德'},
        '明陞': {id: 17, name: '明陞'},
        '金宝博': {id: 23, name: '金宝博'},
        '12bet': {id: 24, name: '12bet'},
        '利记': {id: 31, name: '利记'},
        '盈禾': {id: 35, name: '盈禾'},
        '18Bet': {id: 42, name: '18Bet'},
        '平博': {id: 47, name: '平博'},
        '香港': {id: 48, name: '香港'},
        '威廉': {id: 9, name: '威廉'},
        'Interw': {id: 19, name: 'Interw'},
        '1xBet': {id: 50, name: '1xBet'}
    };

    // 默认选中的公司
    const DEFAULT_SELECTED = ['Bet365', '易胜博', '伟德', '金宝博', '12bet', '利记', '盈禾', '18Bet', '平博'];

    // 全局变量
    let asianStats = null;
    let isOpenMode = false;

    // 初始化
    function init() {
        loadAsianStats();
        createControlPanel();
    }

    // 加载统计数据
    function loadAsianStats() {
        const statsStr = localStorage.getItem('asianStats');
        if (statsStr) {
            try {
                asianStats = JSON.parse(statsStr);
            } catch (e) {
                console.error('解析asianStats失败:', e);
                asianStats = {selectComp: {}, result: {}};
            }
        } else {
            asianStats = {selectComp: {}, result: {}};
        }

        // 初始化选择状态
        Object.keys(COMPANY_MAP).forEach(company => {
            if (asianStats.selectComp[company] === undefined) {
                asianStats.selectComp[company] = DEFAULT_SELECTED.includes(company);
            }
        });
    }

    // 保存统计数据
    function saveAsianStats() {
        localStorage.setItem('asianStats', JSON.stringify(asianStats));
    }

    // 创建控制面板
    function createControlPanel() {
        // 创建容器
        const ctrlPanel = document.createElement('div');
        ctrlPanel.id = 'ctrlPanel';
        ctrlPanel.style.cssText = `
            text-align: right;
            font-size: 16px;
        `;

        // 创建公司列表
        const companyList = document.createElement('ul');
        companyList.style.cssText = `
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        `;

        Object.keys(COMPANY_MAP).forEach(company => {
            const li = document.createElement('li');
            li.textContent = company;
            li.dataset.company = company;
            li.style.cssText = `
                padding: 2px 5px;
                background: ${asianStats.selectComp[company] ? '#ffb' : '#FFF'};
                cursor: pointer;
                font-size: 16px;
                border: 1px dashed #0170CA;
            `;

            li.addEventListener('click', () => {
                asianStats.selectComp[company] = !asianStats.selectComp[company];
                li.style.background = asianStats.selectComp[company] ? '#ffb' : '#FFF';
                saveAsianStats();
            });

            companyList.appendChild(li);
        });

        ctrlPanel.appendChild(companyList);

        // 创建按钮
        const clearBtn = createButton('清除', '#FF6B6B', () => handleClear());
        const statsBtn = createButton('统计', '#4CAF50', () => handleStats());
        const tableBtn = createButton('表格', '#2196F3', () => handleTable());
        const toggleBtn = createButton('开', '#FF9800', () => handleToggle());

        ctrlPanel.appendChild(clearBtn);
        ctrlPanel.appendChild(statsBtn);
        ctrlPanel.appendChild(tableBtn);
        ctrlPanel.appendChild(toggleBtn);

        // 插入到页面
        const contentDiv = document.getElementById('content');
        if (contentDiv && contentDiv.firstChild) {
            contentDiv.insertBefore(ctrlPanel, contentDiv.firstChild);
        } else if (contentDiv) {
            contentDiv.appendChild(ctrlPanel);
        }
    }

    // 创建按钮
    function createButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 2px 5px;
            margin: 5px 5px 5px 0px;
            background: ${color};
            color: white;
            cursor: pointer;
            font-size: 16px;
        `;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 清除数据
    function handleClear() {
        if (confirm('确定要删除所有已统计的数据吗？')) {
            localStorage.removeItem('asianStats');
            asianStats = {selectComp: {}, result: {}};

            // 重置选择状态
            Object.keys(COMPANY_MAP).forEach(company => {
                asianStats.selectComp[company] = DEFAULT_SELECTED.includes(company);
            });

            // 重新渲染公司列表
            document.querySelectorAll('#ctrlPanel li').forEach(li => {
                const company = li.dataset.company;
                li.style.background = asianStats.selectComp[company] ? '#ffb' : '#FFF';
            });
        }
    }

    // 统计当前比赛
    async function handleStats() {
        if (!scheduleId) {
            alert('无法获取比赛ID');
            return;
        }

        // 获取比分
        const homeScoreElem = document.getElementById('homeScore');
        const guestScoreElem = document.getElementById('guestScore');

        if (!homeScoreElem || !guestScoreElem) {
            alert('没有比分！');
            return;
        }

        const homeScore = parseInt(homeScoreElem.textContent);
        const guestScore = parseInt(guestScoreElem.textContent);
        const actualDiff = homeScore - guestScore;

        // 禁用按钮
        const statsBtn = document.querySelector('#ctrlPanel button:nth-child(3)');
        statsBtn.disabled = true;
        statsBtn.textContent = '统计中';

        try {
            await calculateAndSaveStats(scheduleId, actualDiff);
        } catch (error) {
            alert('统计失败: ' + error.message);
        } finally {
            // 恢复按钮
            statsBtn.disabled = false;
            statsBtn.textContent = '统计';
        }
    }

    // 计算并保存统计数据
    async function calculateAndSaveStats(scheduleId, actualDiff) {
        // 获取选中的公司
        const selectedCompanies = Object.keys(COMPANY_MAP).filter(
            company => asianStats.selectComp[company]
        );

        if (selectedCompanies.length === 0) {
            throw new Error('请至少选择一家公司');
        }

        // 获取各公司数据
        const companyData = {};
        const requests = selectedCompanies.map(async company => {
            try {
                const data = await fetchCompanyData(scheduleId, COMPANY_MAP[company].id);
                companyData[company] = data;
            } catch (error) {
                console.error(`获取${company}数据失败:`, error);
                throw new Error(`${company}: ${error.message}`);
            }
        });

        await Promise.all(requests);

        // 过滤有开盘的公司
        const validCompanies = selectedCompanies.filter(
            company => companyData[company] && companyData[company].length > 0
        );

        if (validCompanies.length === 0) {
            throw new Error('没有公司开盘');
        }

        // 找出基准时间
        const baseTime = findBaseTime(companyData, validCompanies);

        // 计算各公司的预期比分差
        const predictions = {};
        validCompanies.forEach(company => {
            const prediction = calculatePrediction(companyData[company], baseTime);
            if (prediction !== null) {
                predictions[company] = prediction;
            }
        });

        // 找出最接近实际比分的公司
        let closestCompany = null;
        let minDiff = Infinity;

        Object.keys(predictions).forEach(company => {
            const diff = Math.abs(predictions[company] - actualDiff);
            if (diff < minDiff) {
                minDiff = diff;
                closestCompany = company;
            }
        });

        if (!closestCompany) {
            throw new Error('无法计算预期比分差');
        }

        // 以最接近的公司为标准，计算各公司的误差
        const standardPrediction = predictions[closestCompany];
        const errors = {};

        Object.keys(predictions).forEach(company => {
            const error = predictions[company] - standardPrediction;
            errors[company] = error;

            // 保存到统计数据
            if (!asianStats.result[company]) {
                asianStats.result[company] = {};
            }
            asianStats.result[company][scheduleId] = error;
        });

        saveAsianStats();
        return errors;
    }

    // 获取公司数据
    async function fetchCompanyData(scheduleId, companyId) {
        const url = `/HandicapDataInterface.ashx?scheid=${scheduleId}&type=3&oddskind=0&companyid=${companyId}&isHalf=0`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('请求失败: ' + error.message);
        }
    }

    // 找出基准时间
    function findBaseTime(companyData, validCompanies) {
        let earliestTimes = [];

        validCompanies.forEach(company => {
            const data = companyData[company];
            // 过滤即时盘口
            const instantData = data.filter(item => item.HappenTime === "");
            if (instantData.length > 0) {
                // 找出最早的时间
                const times = instantData.map(item => item.ModifyTime);
                const earliest = times.reduce((a, b) => a < b ? a : b);
                earliestTimes.push(earliest);
            }
        });

        if (earliestTimes.length === 0) {
            throw new Error('没有找到有效的即时盘口数据');
        }

        // 找出最晚开盘的公司的最早时间
        return earliestTimes.reduce((a, b) => a > b ? a : b);
    }

    // 计算预期比分差
    function calculatePrediction(data, baseTime) {
        // 过滤即时盘口
        const instantData = data.filter(item => item.HappenTime === "");

        // 找出小于等于基准时间的最新数据
        const validData = instantData.filter(item => item.ModifyTime <= baseTime);

        if (validData.length === 0) {
            return null;
        }

        // 按时间降序排序
        validData.sort((a, b) => b.ModifyTime.localeCompare(a.ModifyTime));

        const latest = validData[0];
        const panKou = parseFloat(latest.PanKou);
        const homeOdds = parseFloat(latest.HomeOdds);
        const awayOdds = parseFloat(latest.AwayOdds);

        // 计算预期比分差
        return panKou + (awayOdds - homeOdds) / 2;
    }

    // 生成表格
    async function handleTable() {
        if (!scheduleId) {
            alert('无法获取比赛ID');
            return;
        }

        // 禁用按钮
        const tableBtn = document.querySelector('#ctrlPanel button:nth-child(4)');
        tableBtn.disabled = true;
        tableBtn.textContent = '生成中';

        try {
            await generateTable(scheduleId);
        } catch (error) {
            alert('生成表格失败: ' + error.message);
        } finally {
            // 恢复按钮
            tableBtn.disabled = false;
            tableBtn.textContent = '表格';
        }
    }

    // 生成统计表格
    async function generateTable(scheduleId) {
        // 获取选中的公司
        const selectedCompanies = Object.keys(COMPANY_MAP).filter(
            company => asianStats.selectComp[company]
        );

        if (selectedCompanies.length === 0) {
            throw new Error('请至少选择一家公司');
        }

        // 获取各公司数据
        const companyData = {};
        const requests = selectedCompanies.map(async company => {
            try {
                const data = await fetchCompanyData(scheduleId, COMPANY_MAP[company].id);
                companyData[company] = data;
            } catch (error) {
                console.error(`获取${company}数据失败:`, error);
                companyData[company] = [];
            }
        });

        await Promise.all(requests);

        // 过滤有开盘的公司
        const validCompanies = selectedCompanies.filter(
            company => companyData[company] && companyData[company].length > 0
        );

        if (validCompanies.length === 0) {
            throw new Error('没有公司对本场比赛开盘');
        }

        // 找出基准时间
        const baseTime = findBaseTime(companyData, validCompanies);

        // 计算各公司的统计数据
        const tableData = [];
        let totalPrediction = 0;
        let validCount = 0;

        validCompanies.forEach(company => {
            const data = companyData[company];
            const instantData = data.filter(item => item.HappenTime === "");

            // 找出基准时间的数据
            const baseData = instantData.filter(item => item.ModifyTime <= baseTime);
            if (baseData.length === 0) return;

            baseData.sort((a, b) => b.ModifyTime.localeCompare(a.ModifyTime));
            const latest = baseData[0];

            const panKou = parseFloat(latest.PanKou);
            const homeOdds = parseFloat(latest.HomeOdds);
            const awayOdds = parseFloat(latest.AwayOdds);
            const waterDiff = awayOdds - homeOdds;
            const prediction = panKou + waterDiff / 2;

            // 计算历史平均误差
            const companyResults = asianStats.result[company];
            let avgError = 0;
            let matchCount = 0;

            if (companyResults) {
                const errors = Object.values(companyResults);
                matchCount = errors.length;
                if (matchCount > 0) {
                    const absoluteErrors = errors.map(error => Math.abs(error));
                    const sum = absoluteErrors.reduce((a, b) => a + b, 0);
                    avgError = sum / matchCount;
                }
            }

            tableData.push({
                company,
                matchCount,
                avgError,
                panKou,
                waterDiff,
                prediction
            });

            totalPrediction += prediction;
            validCount++;
        });

        // 按平均误差升序排序
        tableData.sort((a, b) => a.avgError - b.avgError);

        // 创建表格
        createTableElement(tableData, baseTime, totalPrediction / validCount);
    }

    // 创建表格元素
    function createTableElement(tableData, baseTime, avgPrediction) {
        // 移除已存在的表格
        const oldTable = document.querySelector('#statsTable');
        if (oldTable) {
            oldTable.remove();
        }

        // 格式化时间
        const month = baseTime.substring(4, 6);
        const day = baseTime.substring(6, 8);
        const hour = baseTime.substring(8, 10);
        const minute = baseTime.substring(10, 12);
        const timeStr = `${month}/${day} ${hour}:${minute}`;

        // 创建表格
        const table = document.createElement('table');
        table.id = 'statsTable';
        table.style.cssText = `
            border-collapse: collapse;
            margin: 0px auto;
            background: white;
            font-size: 16px;
            text-align: center;
        `;

        // 表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background: #0170CA; color: white;">
                <th style="border: 1px solid #888;">公司</th>
                <th style="border: 1px solid #888;">开盘</th>
                <th style="border: 1px solid #888;">平均误差</th>
                <th style="border: 1px solid #888;">让球</th>
                <th style="border: 1px solid #888;">水差</th>
            </tr>
        `;
        table.appendChild(thead);

        // 表格内容
        const tbody = document.createElement('tbody');
        tableData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="border: 1px solid #888;">${row.company}</td>
                <td style="border: 1px solid #888;">${row.matchCount}</td>
                <td style="border: 1px solid #888;">${row.avgError.toFixed(5)}</td>
                <td style="border: 1px solid #888;">${row.panKou}⚽</td>
                <td style="border: 1px solid #888;">${row.waterDiff.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        // 时间行
        const timeRow = document.createElement('tr');
        timeRow.style.backgroundColor = '#dfd';
        timeRow.innerHTML = `
            <td colspan="3" style="border: 1px solid #888;">
                时间：${timeStr}
            </td>
            <td colspan="2" style="border: 1px solid #888;">
                让球：${avgPrediction.toFixed(4)}
            </td>
        `;
        tbody.appendChild(timeRow);

        // 分组计算
        const groupSize = Math.floor(tableData.length / 2);
        const lowErrorGroup = tableData.slice(0, groupSize);
        const highErrorGroup = tableData.slice(-groupSize);

        const lowAvg = lowErrorGroup.reduce((sum, row) => sum + row.prediction, 0) / groupSize;
        const highAvg = highErrorGroup.reduce((sum, row) => sum + row.prediction, 0) / groupSize;

        // 预测行
        const predictionRow = document.createElement('tr');
        predictionRow.style.backgroundColor = '#fdd';
        let predictionText = '';
        if (lowAvg > highAvg) {
            predictionText = '预测主队赢盘';
        } else if (lowAvg < highAvg) {
            predictionText = '预测客队赢盘';
        } else {
            predictionText = '预测水低者赢';
        }

        predictionRow.innerHTML = `
            <td colspan="3" style="border: 1px solid #888;">
                上${lowAvg.toFixed(4)} 下${highAvg.toFixed(4)}
            </td>
            <td colspan="2" style="border: 1px solid #888;">
                ${predictionText}
            </td>
        `;
        tbody.appendChild(predictionRow);

        table.appendChild(tbody);

        // 插入到控制面板下方
        const ctrlPanel = document.getElementById('ctrlPanel');
        ctrlPanel.parentNode.insertBefore(table, ctrlPanel.nextSibling);
    }

    // 开关模式
    function handleToggle() {
        const toggleBtn = document.querySelector('#ctrlPanel button:nth-child(5)');

        if (!isOpenMode) {
            // 开启模式
            isOpenMode = true;
            toggleBtn.textContent = '关';
            addStatsButtons();
        } else {
            // 关闭模式
            isOpenMode = false;
            toggleBtn.textContent = '开';
            removeStatsButtons();
        }
    }

    // 添加统计按钮到历史比赛
    function addStatsButtons() {
        const matchElements = document.querySelectorAll('#nearMatchDiv li.matchData');

        matchElements.forEach(matchElem => {
            // 检查是否已添加按钮
            if (matchElem.querySelector('.stats-btn')) return;

            // 创建按钮
            const btn = document.createElement('button');
            btn.textContent = '统';
            btn.className = 'stats-btn';
            btn.style.cssText = `
                padding: 0px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                font-size: 16px;
            `;

            btn.addEventListener('click', async (e) => {
                e.stopPropagation();

                // 获取比赛ID（从onclick属性中提取）
                const onclickAttr = matchElem.getAttribute('onclick');
                const match = onclickAttr.match(/GoAnalyUrl\((\d+)\)/);
                if (!match) return;

                const matchId = match[1];

                // 获取比分
                const scoreElem = matchElem.querySelector('.score2');
                if (!scoreElem) return;

                const scoreText = scoreElem.textContent;
                const scoreMatch = scoreText.match(/(\d+)-(\d+)/);
                if (!scoreMatch) return;

                const homeScore = parseInt(scoreMatch[1]);
                const guestScore = parseInt(scoreMatch[2]);
                const actualDiff = homeScore - guestScore;

                // 禁用按钮
                btn.disabled = true;
                btn.textContent = '等';

                try {
                    await calculateAndSaveStats(matchId, actualDiff);
                } catch (error) {
                    alert(`统计失败: ${error.message}`);
                } finally {
                    // 恢复按钮
                    btn.disabled = false;
                    btn.textContent = '统';
                }
            });

            // 插入到球队信息后面
            const oddDiv = matchElem.querySelector('div.odd');
            if (oddDiv) {
                matchElem.insertBefore(btn, oddDiv);
            }
        });
    }

    // 移除统计按钮
    function removeStatsButtons() {
        document.querySelectorAll('.stats-btn').forEach(btn => {
            btn.remove();
        });
    }
    init();
})();