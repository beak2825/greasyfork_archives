// ==UserScript==
// @name         新球体育网亚盘统计
// @namespace    http://dol.freevar.com/
// @version      1.11
// @description  新球体育网（球探）手机端网页。在分析页面加入“统计”,“表格”,“开关”按钮，“统计”按钮统计当前页面这场比赛。“表格”按钮生成各个公司对已统计场次的命中率表格。“开关”按钮在最近赛事里显示统计按钮。根据命中率高的低水，和命中率低的高水判断赛果。
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

    // 公司列表和对应的ID
    const companies = {
        '澳门': 1,
        'Bet365': 8,
        '易胜博': 12,
        '伟德': 14,
        '明陞': 17,
        '金宝博': 23,
        '12bet': 24,
        '利记': 31,
        '盈禾': 35,
        '18Bet': 42,
        '平博': 47,
        '香港': 48,
        '威廉': 9,
        'Interw': 19,
        '1xBet': 50
    };

    // 默认选中的公司
    const defaultSelected = ['澳门', 'Bet365', '易胜博', '伟德', '金宝博', '12bet', '利记', '盈禾', '18Bet', '平博', '香港', '威廉', 'Interw', '1xBet'];

    // 控制面板和按钮状态
    let ctrlPanel = null;
    let isTableMode = false;
    let tableContainer = null;
    let isOpenMode = false;

    // 初始化函数
    function init() {
        // 创建控制面板
        createControlPanel();

        // 初始化公司选择状态
        initCompanySelection();

        // 绑定按钮事件
        bindButtonEvents();
    }

    // 创建控制面板
    function createControlPanel() {
        // 获取content元素
        const content = document.getElementById('content');
        if (!content) return;

        // 创建控制面板容器
        ctrlPanel = document.createElement('div');
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

        // 添加公司按钮
        for (const companyName in companies) {
            const li = document.createElement('li');
            li.textContent = companyName;
            li.dataset.company = companyName;
            li.style.cssText = `
                padding: 2px 5px;
                border: 1px dashed #0170CA;
                cursor: pointer;
                background: #fff;
            `;

            li.addEventListener('click', function() {
                toggleCompanySelection(this);
            });

            companyList.appendChild(li);
        }

        ctrlPanel.appendChild(companyList);

        // 创建按钮
        const buttons = [
            { id: 'clearBtn', text: '清除', color:'#FF6B6B'},
            { id: 'statsBtn', text: '统计', color:'#4CAF50'},
            { id: 'tableBtn', text: '表格', color:'#2196F3'},
            { id: 'toggleBtn', text: '开', color:'#FF9800'}
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 2px 5px;
                margin: 5px 5px 5px 0px;
                background-color: ${btn.color};
                color: white;
                cursor: pointer;
                font-size: 16px;
            `;
            ctrlPanel.appendChild(button);
        });

        // 插入到content的第一个元素前
        content.insertBefore(ctrlPanel, content.firstChild);
    }

    // 初始化公司选择状态
    function initCompanySelection() {
        const storage = getStorage();

        // 如果没有存储数据，初始化默认选择
        if (!storage.selectComp) {
            const selectComp = {};
            for (const companyName in companies) {
                selectComp[companyName] = defaultSelected.includes(companyName);
            }
            storage.selectComp = selectComp;
            saveStorage(storage);
        }

        // 更新UI显示
        updateCompanySelectionUI();
    }

    // 切换公司选择状态
    function toggleCompanySelection(element) {
        const companyName = element.dataset.company;
        const storage = getStorage();

        if (storage.selectComp && storage.selectComp.hasOwnProperty(companyName)) {
            storage.selectComp[companyName] = !storage.selectComp[companyName];
            saveStorage(storage);

            // 更新UI
            if (storage.selectComp[companyName]) {
                element.style.background = '#ffb';
            } else {
                element.style.background = '#fff';
            }
        }
    }

    // 更新公司选择UI
    function updateCompanySelectionUI() {
        const storage = getStorage();
        if (!storage.selectComp) return;

        const companyItems = ctrlPanel.querySelectorAll('li[data-company]');
        companyItems.forEach(item => {
            const companyName = item.dataset.company;
            if (storage.selectComp[companyName]) {
                item.style.background = '#ffb';
            } else {
                item.style.background = '#fff';
            }
        });
    }

    // 获取选中的公司
    function getSelectedCompanies() {
        const storage = getStorage();
        if (!storage.selectComp) return [];

        return Object.keys(storage.selectComp).filter(company => storage.selectComp[company]);
    }

    // 绑定按钮事件
    function bindButtonEvents() {
        // 清除按钮
        document.getElementById('clearBtn').addEventListener('click', clearStats);

        // 统计按钮
        document.getElementById('statsBtn').addEventListener('click', async function() {
            // 检查比赛ID
            if (typeof scheduleId === 'undefined') {
                alert('未找到比赛ID');
                return;
            }

            // 检查比分
            const homeScoreEl = document.getElementById('homeScore');
            const guestScoreEl = document.getElementById('guestScore');
            if (!homeScoreEl || !guestScoreEl) {
                alert('没有比分！');
                return;
            }

            const homeScore = parseInt(homeScoreEl.textContent);
            const guestScore = parseInt(guestScoreEl.textContent);

            // 调用通用统计函数
            await performStats(scheduleId, homeScore, guestScore, this);
        });

        // 表格按钮
        document.getElementById('tableBtn').addEventListener('click', showTable);

        // 开/关按钮
        document.getElementById('toggleBtn').addEventListener('click', toggleMatchStats);
    }

    // 通用统计函数
    async function performStats(matchId, homeScore, guestScore, buttonElement) {
        const scoreDiff = homeScore - guestScore; // 实际比分差

        // 获取选中的公司
        const selectedCompanies = getSelectedCompanies();
        if (selectedCompanies.length === 0) {
            alert('至少选择一家公司');
            return;
        }

        // 禁用按钮
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.textContent = '统计中';
        }

        try {
            // 获取所有公司的数据
            const companyData = await fetchAllCompanyData(selectedCompanies, matchId);

            // 计算基准时间
            const baseTime = calculateBaseTime(companyData);
            if (!baseTime) {
                alert('无法计算基准时间，可能没有有效的开盘数据');
                return;
            }

            // 计算各个公司的预测结果
            const results = {};
            for (const companyName in companyData) {
                const data = companyData[companyName];
                if (data.length === 0) continue;

                // 找到基准时间或之前的最新数据
                const latestData = findLatestDataBeforeTime(data, baseTime);
                if (!latestData) continue;

                // 计算是否命中
                const isHit = calculateHit(latestData, scoreDiff);
                results[companyName] = isHit;
            }

            // 保存结果到本地存储
            saveResults(matchId, results);

            // 返回统计结果
            const hitCount = Object.values(results).filter(isHit => isHit).length;
            const totalCount = Object.keys(results).length;

            if (buttonElement) {
                alert(`已统计 ${totalCount} 家公司，${hitCount} 家命中`);
            }

            return { matchId, results, hitCount, totalCount };
        } catch (error) {
            alert(`统计出错: ${error.message}`);
            throw error;
        } finally {
            // 恢复按钮状态
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.textContent = buttonElement.id === 'statsBtn' ? '统计' : '统';
            }
        }
    }

    // 获取所有公司的数据
    async function fetchAllCompanyData(selectedCompanies, matchId) {
        const companyData = {};
        const promises = [];

        for (const companyName of selectedCompanies) {
            const companyId = companies[companyName];
            const promise = fetchCompanyData(companyId, matchId)
                .then(data => {
                    companyData[companyName] = data;
                })
                .catch(error => {
                    alert(`获取${companyName}数据失败:`, error);
                    companyData[companyName] = [];
                });

            promises.push(promise);

            // 添加延迟以避免请求过于频繁
            //await new Promise(resolve => setTimeout(resolve, 100));
        }

        await Promise.all(promises);
        return companyData;
    }

    // 获取单个公司数据
    async function fetchCompanyData(companyId, matchId) {
        const url = `/HandicapDataInterface.ashx?scheid=${matchId}&type=3&oddskind=0&companyid=${companyId}&isHalf=0`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    // 计算基准时间
    function calculateBaseTime(companyData) {
        let baseTime = null;

        for (const companyName in companyData) {
            const data = companyData[companyName];
            if (data.length === 0) continue;

            // 过滤出HappenTime为空的数据（即时盘口）
            const instantData = data.filter(item => item.HappenTime === "");
            if (instantData.length === 0) continue;

            // 找到最早的数据时间
            const earliestTime = instantData.reduce((earliest, item) => {
                const time = item.ModifyTime;
                return time < earliest ? time : earliest;
            }, instantData[0].ModifyTime);

            // 更新基准时间（取最晚的）
            if (!baseTime || earliestTime > baseTime) {
                baseTime = earliestTime;
            }
        }

        return baseTime;
    }

    // 查找指定时间之前的最新数据
    function findLatestDataBeforeTime(data, targetTime) {
        // 过滤出HappenTime为空的数据
        const instantData = data.filter(item => item.HappenTime === "");

        // 按时间排序（从新到旧）
        instantData.sort((a, b) => b.ModifyTime.localeCompare(a.ModifyTime));

        // 找到第一个小于等于目标时间的数据
        return instantData.find(item => item.ModifyTime <= targetTime);
    }

    // 查找最早的数据
    function findEarliestData(data) {
        // 过滤出HappenTime为空的数据
        const instantData = data.filter(item => item.HappenTime === "");
        if (instantData.length === 0) return null;

        // 按时间排序（从早到晚）
        instantData.sort((a, b) => a.ModifyTime.localeCompare(b.ModifyTime));

        // 返回最早的数据
        return instantData[0];
    }

    // 计算是否命中
    function calculateHit(data, scoreDiff) {
        const panKou = parseFloat(data.PanKou);
        const homeOdds = parseFloat(data.HomeOdds);
        const awayOdds = parseFloat(data.AwayOdds);

        // 当盘口等于实际比分差时
        if (scoreDiff === panKou) {
            return true;
        }
        // 当实际比分差大于盘口，且主队赔率小于客队赔率时
        else if (scoreDiff > panKou && homeOdds < awayOdds) {
            return true;
        }
        // 当实际比分差小于盘口，且主队赔率大于客队赔率时
        else if (scoreDiff < panKou && homeOdds > awayOdds) {
            return true;
        }

        return false;
    }

    // 保存结果
    function saveResults(matchId, results) {
        const storage = getStorage();

        if (!storage.result) {
            storage.result = {};
        }

        for (const companyName in results) {
            if (!storage.result[companyName]) {
                storage.result[companyName] = {};
            }
            storage.result[companyName][matchId] = results[companyName];
        }

        saveStorage(storage);
    }

    // 清除统计
    function clearStats() {
        if (confirm('确定要删除所有已统计的数据吗？')) {
            localStorage.removeItem('asianStats');
            if (confirm('是否恢复默认选择的公司？')) {
                initCompanySelection(); // 重新初始化
            }
        }
    }

    // 显示表格
    async function showTable() {
        // 切换表格模式
        isTableMode = !isTableMode;
        const tableBtn = document.getElementById('tableBtn');

        if (isTableMode) {
            tableBtn.textContent = '隐藏';
            await createTable();
        } else {
            tableBtn.textContent = '表格';
            removeTable();
        }
    }

    // 创建表格
    async function createTable() {
        // 检查比赛ID
        if (typeof scheduleId === 'undefined') {
            alert('未找到比赛ID');
            isTableMode = false;
            document.getElementById('tableBtn').textContent = '表格';
            return;
        }

        // 获取选中的公司
        const selectedCompanies = getSelectedCompanies();
        if (selectedCompanies.length === 0) {
            alert('至少选择一家公司');
            isTableMode = false;
            document.getElementById('tableBtn').textContent = '表格';
            return;
        }

        // 禁用表格按钮
        const tableBtn = document.getElementById('tableBtn');
        tableBtn.disabled = true;
        tableBtn.textContent = '加载中';

        try {
            // 获取公司数据
            const companyData = await fetchAllCompanyData(selectedCompanies, scheduleId);

            // 计算基准时间
            const baseTime = calculateBaseTime(companyData);
            if (!baseTime) {
                alert('无法计算基准时间，可能没有有效的开盘数据');
                return;
            }

            // 创建表格数据
            const tableData = [];
            for (const companyName of selectedCompanies) {
                const data = companyData[companyName];
                if (data.length === 0) continue;

                // 找到基准时间的数据
                const baseData = findLatestDataBeforeTime(data, baseTime);
                if (!baseData) continue;

                // 找到最早的数据
                const earliestData = findEarliestData(data);

                // 计算命中率
                const stats = calculateCompanyStats(companyName);

                tableData.push({
                    company: companyName,
                    openCount: stats.openCount,
                    hitRate: stats.hitRate,
                    homeOdds: baseData.HomeOdds,
                    panKou: baseData.PanKou,
                    awayOdds: baseData.AwayOdds,
                    earliestHomeOdds: earliestData.HomeOdds,
                    earliestPanKou: earliestData.PanKou,
                    earliestAwayOdds: earliestData.AwayOdds
                });
            }

            // 按命中率降序排序
            tableData.sort((a, b) => b.hitRate - a.hitRate);

            // 创建表格
            createTableHTML(tableData, baseTime);
        } catch (error) {
            alert(`创建表格出错: ${error.message}`);
        } finally {
            // 恢复按钮状态
            tableBtn.disabled = false;
            tableBtn.textContent = '隐藏';
        }
    }

    // 计算公司统计
    function calculateCompanyStats(companyName) {
        const storage = getStorage();
        let openCount = 0;
        let hitCount = 0;

        if (storage.result && storage.result[companyName]) {
            const results = storage.result[companyName];
            openCount = Object.keys(results).length;
            hitCount = Object.values(results).filter(isHit => isHit).length;
        }

        const hitRate = openCount > 0 ? ((hitCount / openCount) * 100) : 0;

        return {
            openCount,
            hitRate
        };
    }

    // 创建表格HTML
    function createTableHTML(tableData, baseTime) {
        // 移除旧的表格
        removeTable();

        // 创建表格容器
        tableContainer = document.createElement('div');
        tableContainer.id = 'statsTable';
        tableContainer.style.cssText = `
            text-align: center;
            font-size: 16px;
            overflow-x: auto;
        `;

        // 创建表格
        const table = document.createElement('table');
        table.style.cssText = `
            border-collapse: collapse;
            margin: 0px auto;
        `;

        // 表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background: #0170CA; color: white;">
                <th style="border: 1px solid #888;">公司</th>
                <th style="border: 1px solid #888;">开盘</th>
                <th style="border: 1px solid #888;">命中率</th>
                <th style="border: 1px solid #888;">主水</th>
                <th style="border: 1px solid #888;">让球</th>
                <th style="border: 1px solid #888;">客水</th>
                <th style="border: 1px solid #888;">初主</th>
                <th style="border: 1px solid #888;">初让</th>
                <th style="border: 1px solid #888;">初客</th>
            </tr>
        `;
        table.appendChild(thead);

        // 表格内容
        const tbody = document.createElement('tbody');

        tableData.forEach(row => {
            const tr = document.createElement('tr');

            // 确定赔率单元格的背景色
            const homeBg = row.homeOdds > row.awayOdds ? '#fdd' :
                          row.homeOdds < row.awayOdds ? '#dfd' : '';
            const awayBg = row.awayOdds > row.homeOdds ? '#fdd' :
                          row.awayOdds < row.homeOdds ? '#dfd' : '';

            tr.innerHTML = `
                <td style="border: 1px solid #888;">${row.company}</td>
                <td style="border: 1px solid #888;">${row.openCount}</td>
                <td style="border: 1px solid #888;">${row.hitRate.toFixed(2)}%</td>
                <td style="border: 1px solid #888; background: ${homeBg};">${row.homeOdds}</td>
                <td style="border: 1px solid #888;">${row.panKou}</td>
                <td style="border: 1px solid #888; background: ${awayBg};">${row.awayOdds}</td>
                <td style="border: 1px solid #888;">${row.earliestHomeOdds}</td>
                <td style="border: 1px solid #888;">${row.earliestPanKou}</td>
                <td style="border: 1px solid #888;">${row.earliestAwayOdds}</td>
            `;
            tbody.appendChild(tr);
        });

        // 底部行 - 显示基准时间
        if (tableData.length > 0) {
            const tfoot = document.createElement('tfoot');
            // 格式化基准时间
            const timeStr = formatTime(baseTime);
            tfoot.innerHTML = `
                <tr>
                    <td colspan="6" style="border: 1px solid #888;">
                        盘口时间: ${timeStr}
                    </td>
                </tr>
            `;
            table.appendChild(tfoot);
        }

        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // 插入到控制面板后
        ctrlPanel.parentNode.insertBefore(tableContainer, ctrlPanel.nextSibling);
    }

    // 格式化时间
    function formatTime(timeStr) {
        if (!timeStr || timeStr.length !== 14) return timeStr;

        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        const hour = timeStr.substring(8, 10);
        const minute = timeStr.substring(10, 12);

        return `${month}/${day} ${hour}:${minute}`;
    }

    // 移除表格
    function removeTable() {
        if (tableContainer && tableContainer.parentNode) {
            tableContainer.parentNode.removeChild(tableContainer);
            tableContainer = null;
        }
    }

    // 切换比赛统计模式
    function toggleMatchStats() {
        const toggleBtn = document.getElementById('toggleBtn');
        isOpenMode = !isOpenMode;

        if (isOpenMode) {
            toggleBtn.textContent = '关';
            addStatsButtonsToMatches();
        } else {
            toggleBtn.textContent = '开';
            removeStatsButtonsFromMatches();
        }
    }

    // 添加统计按钮到比赛
    function addStatsButtonsToMatches() {
        const matches = document.querySelectorAll('#nearMatchDiv li.matchData');

        matches.forEach(match => {
            // 检查是否已经添加了按钮
            if (match.querySelector('.stats-btn')) return;

            // 创建统计按钮
            const statsBtn = document.createElement('button');
            statsBtn.textContent = '统';
            statsBtn.className = 'stats-btn';
            statsBtn.style.cssText = `
                padding: 0px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                font-size: 16px;
            `;

            // 绑定点击事件
            statsBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                await handleMatchStats(match, this);
            });

            // 插入到team gt元素后
            const oddDiv = match.querySelector('div.odd');
            if (oddDiv) {
                match.insertBefore(statsBtn, oddDiv);
            }
        });
    }

    // 处理比赛统计
    async function handleMatchStats(matchElement, button) {
        // 获取比赛ID
        const onclickAttr = matchElement.getAttribute('onclick');
        const matchId = onclickAttr ? onclickAttr.match(/\d+/g)[0] : null;

        if (!matchId) {
            alert('未找到比赛ID');
            return;
        }

        // 获取比分
        const scoreElement = matchElement.querySelector('.score2');
        if (!scoreElement) {
            alert('没有完场比分！');
            return;
        }

        // 解析比分
        const scoreText = scoreElement.textContent;
        const scoreMatch = scoreText.match(/(\d+)-(\d+)/);
        if (!scoreMatch) {
            alert('无法解析比分');
            return;
        }

        const homeScore = parseInt(scoreMatch[1]);
        const guestScore = parseInt(scoreMatch[2]);

        // 调用通用统计函数
        await performStats(matchId, homeScore, guestScore, button);
    }

    // 从比赛移除统计按钮
    function removeStatsButtonsFromMatches() {
        const statsBtns = document.querySelectorAll('.stats-btn');
        statsBtns.forEach(btn => {
            btn.parentNode.removeChild(btn);
        });
    }

    // 获取存储数据
    function getStorage() {
        const data = localStorage.getItem('asianStats');
        return data ? JSON.parse(data) : {};
    }

    // 保存存储数据
    function saveStorage(data) {
        localStorage.setItem('asianStats', JSON.stringify(data));
    }
    init();
})();