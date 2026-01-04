// ==UserScript==
// @name         NavyFieldTask
// @namespace    https://github.com/usawjq/NF2TASK
// @version      1.1
// @icon         https://fastly.jsdelivr.net/gh/usawjq/testRepository/42.jpg
// @description  优化NavyField用户页面布局，添加战斗数据显示
// @author       海底两万里工作室
// @license      Apache-2.0
// @match        https://club.navyfield.com.hk/*
// @grant        GM_xmlhttpRequest
// @connect      club.navyfield.com.hk
// @downloadURL https://update.greasyfork.org/scripts/520373/NavyFieldTask.user.js
// @updateURL https://update.greasyfork.org/scripts/520373/NavyFieldTask.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加处理主页面导航的函数
    function addSummaryButton() {
        // 根据当前页面选择合适的容器
        let container;
        const currentUrl = window.location.href;
        const tabList = document.querySelector('.kpn_tab ul');

        if (tabList) {
            // 在任何包含 kpn_tab 的页面中添加导航项
            const newLi = document.createElement('li');
            newLi.className = 'off';
            newLi.style.cssText = 'border-left:1px solid #D7D7D7;';

            // 创建span容器
            const span = document.createElement('span');
            span.style.cursor = 'pointer';
            newLi.appendChild(span);

            // 将新的导航项添加到列表中
            tabList.appendChild(newLi);
            container = span;
        }

        if (!container) return;

        // 添加文本样式
        container.textContent = '战绩汇总';

        // 添加悬停效果
        const parentLi = container.parentElement;
        parentLi.addEventListener('mouseenter', () => {
            parentLi.style.backgroundColor = '#F7F7F7';
        });

        parentLi.addEventListener('mouseleave', () => {
            parentLi.style.backgroundColor = '';
        });

        // 添加点击事件
        container.addEventListener('click', () => {
            window.location.href = 'https://club.navyfield.com.hk/plugin.php?id=nf2_users#li3';
        });
    }

    // 修改初始化函数
    function init() {
        // 根据当前页面URL决定执行哪个功能
        const currentUrl = window.location.href;

        // 只要页面中有 kpn_tab，就添加战绩汇总按钮
        if (document.querySelector('.kpn_tab')) {
            addSummaryButton();
        }

        if (currentUrl.includes('plugin.php?id=nf2_users') && window.location.hash === '#li3') {
            checkAndSwitchToSimplifiedChinese();
            fetchBattleData();
        }
    }

    // 当DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 确保我们在正确的页面上
    if (window.location.hash !== '#li3') return;

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        /* 调整整体页面宽度 */
        .wp_1240 {
            width: 100% !important;
            max-width: none !important;
            padding: 0 20px;
            box-sizing: border-box;
        }

        /* 调整内容容器宽度 */
        .wp {
            width: 100% !important;
            max-width: none !important;
        }

        /* 内容区域布局 */
        .kp_nf4 {
            width: 100% !important;
        }

        .kpn_list {
            width: 100% !important;
        }

        /* 选项卡样式调整 */
        .kpn_tab ul {
            width: 100% !important;
        }

        /* 内容区域样式 */
        #myTab1_Content3 {
            width: 100% !important;
            display: flex !important;
            gap: 20px;
            padding: 20px 0;
        }

        /* 进一步减小左侧任务区域宽度 */
        .daily-missions {
            width: 50%;
            min-width: 0;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* 修改右侧容器样式 */
        .battle-data-container {
            width: 50%;
            flex-shrink: 0;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: auto;
        }

        /* 移除 iframe 相关样式 */
        .battle-iframe {
            display: none;
        }

        /* 任务表格样式 */
        .daily-missions table {
            width: 100%;
            border-collapse: collapse;
        }

        .daily-missions td {
            padding: 4px 8px;
            font-size: 14px;
            line-height: 1.4;
        }

        /* 排行榜样式 */
        #daily_rank {
            margin-bottom: 15px;
            cursor: pointer;
        }

        #daily_rank .data {
            font-weight: bold;
            color: #666;
        }

        /* 任务标题样式 */
        .daily-missions .data {
            font-weight: bold;
            color: #444;
            display: inline-block;
            margin-bottom: 8px;
        }

        /* 任务图标样式 */
        .daily-missions img {
            vertical-align: middle;
            cursor: pointer;
        }

        /* 底部说明文字样式 */
        .daily-missions tr[style*="text-align:center"] td {
            color: #666;
            font-size: 12px;
            line-height: 1.6;
        }

        /* 调整 kpn_tab_c 的内边距和表格位置 */
        .kpn_tab_c {
            padding: 0px 20px !important;
            text-align: center;
        }

        /* 调整表格上边距，使用vh单位实现自适应 */
        .dt.mtm {
            margin-top: 10vh !important;
            min-margin-top: 85px !important;
        }

        /* 调整 #hd 元素样式 */
        #hd {
            width: 100% !important;
            margin-top: 0 !important;
        }
        #hd .wp {
            display: none !important;
        }

        /* 调整右侧表格单元格内边距 */
        .battle-data-container .dt td,
        .battle-data-container .dt th {
            padding: 0px !important;
        }

        /* 隐藏 kpn_tab */
        .battle-data-container .kp_nf4 .kpn_list .kpn_tab {
            display: none !important;
        }

        /* 隐藏搜索底部元素 */
        .vk_search_bottom.cl {
            display: none !important;
        }

        /* 隐藏背景图片和logo */
        body {
            background-image: none !important;
        }

        .logo {
            display: none !important;
        }

        img[src*="bg_body.jpg"],
        img[src*="logo.png"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 在 fetchBattleData 函数前添加这个新函数
    function simplifyMissionText(text) {
        return text
            // 替换国籍舰船任务
            .replace(/使用(.+?)国籍舰船参战并胜利(\d+)场，即可领取奖励(\d+)个奖章/g, '$1胜$2场，奖$3章')
            .replace(/使用(.+?)国籍舰船参战并胜利(\d+)场，奖(\d+)章/g, '$1胜$2场，奖$3章')

            // 替换舰种任务，保持中文名称
            .replace(/使用(驱逐舰|轻巡洋舰|装甲巡洋舰|战列巡洋舰|战列舰|航空母舰|潜艇).*?胜利(\d+)场，.*?(\d+)个奖章/g,
                (_, ship, times, reward) => {
                    const shipTypeMap = {
                        '驱逐舰': '驱逐',
                        '轻巡洋舰': '轻巡',
                        '装甲巡洋舰': '装甲',
                        '战列巡洋舰': '战巡',
                        '战列舰': '战列',
                        '航空母舰': '航母',
                        '潜艇': '潜艇'
                    };
                    const shortName = shipTypeMap[ship] || ship;
                    return `${shortName}胜${times}场，奖${reward}章`;
                })

            // 替换超级战役任务
            .replace(/参与(\d+)场超级战役并获胜且每场攻击值大于10万，即可领取奖励(\d+)个?(.+)/g, '超战$1场，$2$3')

            // 替换闪电战任务
            .replace(/参与(\d+)场闪电战并获得胜利，即可领取奖励(\d+)个?(.+)/g, '闪电战$1场，奖$2$3');
    }

    // 修改 calculateMissionProgress 函数中的战斗数据处理逻辑
    function calculateMissionProgress(battleData, targetDate) {
        console.log('开始统计，目标日期:', targetDate);
        console.log('战斗数据条数:', battleData.length);

        // 创建一个 Set 来存储已处理的战斗记录ID（使用时间+舰船名作为唯一标识）
        const processedBattles = new Set();

        // 过滤出当天的战斗数据，避免重复计算
        const todayBattles = battleData.filter(battle => {
            const cells = battle.getElementsByTagName('td');
            if (cells.length < 6) return false;

            const dateCell = cells[0];
            const shipName = cells[1].textContent.trim();
            if (!dateCell) return false;

            // 从日期单元格中提取日期部分（格式：YYYY-MM-DD）
            const battleDate = dateCell.textContent.trim().split(' ')[0];
            const battleTime = dateCell.textContent.trim(); // 完整的时间戳

            // 创建唯一标识
            const battleId = `${battleTime}-${shipName}`;

            // 检查是否是今天的战斗且未被处理过
            const isToday = battleDate === targetDate;
            if (isToday && !processedBattles.has(battleId)) {
                processedBattles.add(battleId);
                console.log('找到新的当天战斗记录:', battleTime, shipName);
                return true;
            }

            return false;
        });

        console.log('当日不重复战斗数据条数:', todayBattles.length);

        // 初始化统计对象
        const stats = {
            nations: {
                '花旗': 0,
                '雾都': 0,
                '樱花': 0,
                '铁血': 0,
                '乌拉': 0,
                '凯旋': 0,
                '撒丁': 0,
                '炎黄': 0
            },
            shipTypes: {
                '战列': 0,
                '战巡': 0,
                '航母': 0,
                '轻巡': 0,
                '驱逐': 0,
                '潜艇': 0,
                '装甲舰': 0
            },
            // 添加阵营-舰种统计矩阵
            nationShipStats: {},
            superBattles: 0
        };

        // 初始化 nationShipStats
        Object.keys(stats.shipTypes).forEach(shipType => {
            stats.nationShipStats[shipType] = {};
            Object.keys(stats.nations).forEach(nation => {
                stats.nationShipStats[shipType][nation] = 0;
            });
        });

        // 修改处理战斗数据的逻辑
        todayBattles.forEach(battle => {
            const cells = battle.getElementsByTagName('td');
            if (cells.length < 6) return;

            const shipName = cells[1].textContent.trim();
            const damage = parseInt(cells[2].textContent);
            const result = cells[5].textContent.trim();
            const [minutes, seconds] = cells[4].textContent.split(':').map(n => parseInt(n.trim()));
            const durationInMinutes = minutes + seconds/60;

            // 只统计胜利且满5分钟且有伤害的战斗
            if (result === '胜' && durationInMinutes >= 5 && damage > 0) {
                let battleNation = null;
                let battleShipType = null;

                // 特殊处理炎黄舰船
                if (shipName.includes('重庆号') || shipName.includes('民生') ||  shipName.includes('民权')  || shipName.includes('定远') ||
                    shipName.includes('中山') || shipName.includes('明斯克') || shipName.includes('海龙') || shipName.includes('033') ||
                    shipName.includes('明昭') || shipName.includes('衍功号') || shipName.includes('靖海侯') || shipName.includes('施琅') ||
                    shipName.includes('成功号') || shipName.includes('辽宁')) {
                    battleNation = '炎黄';
                    if (shipName.includes('定远')) {
                        battleShipType = '装甲舰';
                    } else if (shipName.includes('重庆') || shipName.includes('中山')) {
                        battleShipType = '轻巡';
                    } else if (shipName.includes('民权') || shipName.includes('民生')) {
                        battleShipType = '驱逐';
                    } else if (shipName.includes('明斯克')) {
                        battleShipType = '航母';
                    } else if (shipName.includes('海龙') || shipName.includes('033')) {
                        battleShipType = '潜艇';
                    } else if (shipName.includes('明昭') || shipName.includes('衍功号') || shipName.includes('靖海侯')) {
                        battleShipType = '战列';
                    } else if (shipName.includes('施琅') || shipName.includes('成功号') || shipName.includes('辽宁')) {
                        battleShipType = '战列';
                    }
                } else {
                    // 处理其他国籍舰船
                    for (const nation of Object.keys(stats.nations)) {
                        if (shipName.includes(nation)) {
                            battleNation = nation;
                            break;
                        }
                    }

                    // 处理舰种
                    for (const type of Object.keys(stats.shipTypes)) {
                        if (shipName.includes(type)) {
                            battleShipType = type;
                            break;
                        }
                    }

                    // 特殊处理铁血装甲舰
                    if (shipName.includes('装甲') && shipName.includes('铁血')) {
                        battleNation = '铁血';
                        battleShipType = '装甲舰';
                    }
                }

                // 只有在确定了国籍和舰种时才计入统计
                if (battleNation && battleShipType) {
                    stats.nations[battleNation]++;
                    stats.shipTypes[battleShipType]++;
                    stats.nationShipStats[battleShipType][battleNation]++;

                    console.log(`有效战斗统计: ${battleNation} ${battleShipType}`);
                }

                // 统计超级战役（胜利且伤害超过10万）
                if (damage > 100000) {
                    stats.superBattles++;
                    console.log('超级战役 +1');
                }
            }
        });

        console.log('统计结果:', stats);
        return stats;
    }

    // 添加创建统计表格的函数
    function createStatsTable(stats) {
        const nations = ['花旗', '雾都', '樱花', '铁血', '乌拉', '凯旋', '撒丁', '炎黄'];
        const shipTypes = ['战列', '战巡', '航母', '轻巡', '驱逐', '潜艇', '装甲舰'];

        // 计算每个阵营的总胜利场次
        const nationTotals = nations.map(nation => {
            const total = shipTypes.reduce((sum, shipType) =>
                sum + (stats.nationShipStats?.[shipType]?.[nation] || 0), 0);
            return total;
        });

        return `
            <div class="stats-explanation">
                以下统计均为：满五分钟且有伤害的胜利场次
            </div>
            <table class="stats-table">
                <tr>
                    <th>舰种\\阵营</th>
                    ${nations.map(nation => `<th>${nation}</th>`).join('')}
                    <th>胜场总计</th>
                </tr>
                ${shipTypes.map(shipType => {
                    const totalForShipType = nations.reduce((sum, nation) =>
                        sum + (stats.nationShipStats?.[shipType]?.[nation] || 0), 0);

                    return `
                        <tr>
                            <td>${shipType}</td>
                            ${nations.map(nation => {
                                const value = stats.nationShipStats?.[shipType]?.[nation] || 0;
                                return `<td class="${value === 0 ? '' : value < 3 ? 'non-zero' : 'highlight'}">${value === 0 ? '-' : value}</td>`;
                            }).join('')}
                            <td class="total-column">${totalForShipType === 0 ? '-' : totalForShipType}</td>
                        </tr>
                    `;
                }).join('')}
                <tr class="nation-totals">
                    <td>阵营胜场</td>
                    ${nationTotals.map(total =>
                        `<td>${total === 0 ? '-' : total}</td>`
                    ).join('')}
                    <td>${nationTotals.reduce((a, b) => a + b, 0)}</td>
                </tr>
            </table>
        `;
    }

    // 修改 processDailyMissions 函数
    function processDailyMissions(stats) {
        console.log('开始处理任务显示，统数据:', stats);

        setTimeout(() => {
            const dailyMissions = document.querySelector('.daily-missions');
            if (!dailyMissions) {
                console.log('未找到任务容器元素');
                return;
            }

            const cells = dailyMissions.getElementsByTagName('td');
            console.log('找到任务单元格数量:', cells.length);

            // 处理任务文本
            for (let cell of cells) {
                if (cell.querySelector('img')) continue;
                if (cell.getAttribute('colspan') === '4') {
                    // 处理底部提示文本
                    if (cell.textContent.includes('任何玩家给查出恶意')) {
                        cell.style.textAlign = 'center';
                        cell.style.paddingTop = '10px';
                        cell.style.color = '#666';
                        cell.style.fontSize = '12px';
                        cell.innerHTML = '时间计算以服务器时间为';
                    }
                    continue;
                }

                const originalText = cell.textContent.trim();
                if (originalText && !cell.querySelector('.data')) {
                    console.log('处理任务文本:', originalText);

                    // 如果是闪电战任务，直接简化显示
                    if (originalText.includes('闪电战')) {
                        cell.textContent = simplifyMissionText(originalText);
                        continue;
                    }

                    let progressText = '';
                    let currentProgress = 0;
                    let requiredProgress = 0;

                    // 匹配国籍任务
                    let match = originalText.match(/使用(.+?)国籍舰船参战并胜利(\d+)场/);
                    if (match) {
                        const [_, nation, required] = match;
                        requiredProgress = parseInt(required);
                        // 从 nationShipStats 中获取该国籍的所有胜利场次总和
                        currentProgress = Object.values(stats.nationShipStats)
                            .reduce((sum, shipTypeStats) => sum + (shipTypeStats[nation] || 0), 0);
                        console.log(`国籍任务匹配: ${nation}, 进度: ${currentProgress}/${requiredProgress}`);
                    }

                    // 匹配舰种任务
                    if (!match) {
                        match = originalText.match(/使用(驱逐舰|轻巡洋舰|装甲巡洋舰|战列巡洋舰|战列舰|航空母舰|潜艇).*?胜利(\d+)场/);
                        if (match) {
                            const [_, shipType, required] = match;
                            const shipTypeMap = {
                                '驱逐舰': '驱逐',
                                '轻巡洋舰': '轻巡',
                                '装甲巡洋舰': '装甲舰',
                                '战列巡洋舰': '战巡',
                                '战列舰': '战列',
                                '航空母舰': '航母',
                                '潜艇': '潜艇'
                            };
                            const type = shipTypeMap[shipType];
                            requiredProgress = parseInt(required);
                            // 从 nationShipStats 中获取该舰种的所有胜利场次总和
                            currentProgress = Object.keys(stats.nations)
                                .reduce((sum, nation) => sum + (stats.nationShipStats[type]?.[nation] || 0), 0);
                            console.log(`舰种任务匹配: ${type}, 进度: ${currentProgress}/${requiredProgress}`);
                        }
                    }

                    // 匹配超级战役任务
                    if (!match) {
                        match = originalText.match(/参与(\d+)场超级战役.*?10万/);
                        if (match) {
                            const [_, required] = match;
                            requiredProgress = parseInt(required);
                            currentProgress = stats.superBattles;
                            console.log(`超级战役任务匹配: 进度: ${currentProgress}/${requiredProgress}`);
                        }
                    }

                    // 如果是需要显示进度的任务
                    if (requiredProgress > 0) {
                        const isCompleted = currentProgress >= requiredProgress;
                        const color = isCompleted ? 'red' : currentProgress > 0 ? 'blue' : 'inherit';
                        progressText = `<span style="color: ${color};">(${currentProgress}/${requiredProgress})</span> `;
                        const simplifiedText = simplifyMissionText(originalText);
                        cell.innerHTML = progressText + simplifiedText;
                        console.log(`设置任务显示: ${progressText}${simplifiedText}`);
                    } else {
                        cell.textContent = simplifyMissionText(originalText);
                    }
                }
            }

            // 创建格容器
            const statsContainer = document.createElement('div');
            statsContainer.className = 'stats-container';
            statsContainer.style.cssText = `
                margin: 20px 0;
                padding: 15px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;

            // 添加表格样式
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .stats-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .stats-table th,
                .stats-table td {
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #ddd;
                }
                .stats-table th {
                    background-color: #f5f5f5;
                }
                .stats-table .highlight {
                    color: red;
                    font-weight: bold;
                }
                .stats-table .non-zero {
                    color: blue;
                }
                .stats-table .total-column {
                    font-weight: bold;
                    background-color: #f9f9f9;
                }
                .stats-table .nation-totals {
                    font-weight: bold;
                    background-color: #f5f5f5;
                }
                .stats-explanation {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            `;
            document.head.appendChild(styleElement);

            // 创建并添加表格
            statsContainer.innerHTML = createStatsTable(stats);

            // 将表格添加到任务列表后面
            dailyMissions.appendChild(statsContainer);
        }, 500);
    }

    // 修改 fetchBattleData 函数中的相关部分
    function fetchBattleData() {
        console.log('开始获取战斗数据');

        const contentArea = document.querySelector('#myTab1_Content3');
        if (!contentArea) {
            console.log('未找到内容区域');
            return;
        }

        const missionsContainer = document.createElement('div');
        missionsContainer.className = 'daily-missions';

        while (contentArea.firstChild) {
            missionsContainer.appendChild(contentArea.firstChild);
        }

        const container = document.createElement('div');
        container.className = 'battle-data-container';

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://club.navyfield.com.hk/plugin.php?id=battle',
            onload: function(response) {
                console.log('获取到战斗数据响应');

                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const kpNf4 = doc.querySelector('.kp_nf4');
                    if (kpNf4) {
                        // 获取当前日期（服务器时区）
						const today = new Date();

						// 设置时区为东八区（北京时间）
						today.setUTCHours(today.getUTCHours() + 8);

						// 格式化为 YYYY-MM-DD
						const targetDate = today.toISOString().split('T')[0];

						console.log(targetDate);

                        const normalBattleRows = Array.from(doc.querySelectorAll('.dt.mtm tr:not(:first-child)'));
                        const bannedBattleRows = Array.from(doc.querySelectorAll('#bannedtable tr'));
                        const allBattleRows = [...normalBattleRows, ...bannedBattleRows];

                        console.log('找到战斗记录行数:', {
                            normal: normalBattleRows.length,
                            banned: bannedBattleRows.length,
                            total: allBattleRows.length
                        });

                        const stats = calculateMissionProgress(allBattleRows, targetDate);
                        processDailyMissions(stats);

                        // 添加样式
                        const styleElement = document.createElement('style');
                        styleElement.textContent = `
                            .battle-data-container .kp_nf4 {
                                margin: 0 !important;
                                padding: 10px !important;
                                width: 100% !important;
                            }
                            .battle-data-container table {
                                width: 100% !important;
                                margin: 0 !important;
                            }
                            .battle-data-container #ft,
                            .battle-data-container .a_h,
                            .battle-data-container .a_mu {
                                display: none !important;
                            }
                            /* 添加有效战记录的样式 */
                            .battle-row-valid {
                                background-color: #e3f2fd !important;
                                color: #1976d2 !important;
                            }
                        `;
                        document.head.appendChild(styleElement);

                        // 修改处理战斗记录行样式的选择器
                        const displayRows = kpNf4.querySelectorAll('.dt.mtm tr:not(:first-child), #bannedtable tr');
                        displayRows.forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            if (cells.length >= 6) {
                                const damage = parseInt(cells[2].textContent);
                                const [minutes, seconds] = cells[4].textContent.split(':').map(n => parseInt(n.trim()));
                                const durationInMinutes = minutes + seconds/60;
                                const result = cells[5].textContent;

                                // 修改判断条件：只有胜利的战斗才标记为有效
                                if (result === '胜' && damage > 0 && durationInMinutes >= 5) {
                                    row.classList.add('battle-row-valid');
                                }
                            }
                        });

                        container.appendChild(kpNf4);

                        const scripts = container.getElementsByTagName('script');
                        for (let script of scripts) {
                            script.remove();
                        }
                    }
                }
            }
        });

        contentArea.appendChild(missionsContainer);
        contentArea.appendChild(container);
    }

    // 在 init 函数之前添加以下函数
    function checkAndSwitchToSimplifiedChinese() {
        const stranLink = document.querySelector('#u179stranlink');
        if (stranLink && stranLink.textContent.includes('切換繁體')) {
            // 当前是简体中文，不需要切换
            return;
        }

        // 如果是繁中文，调用换函数
        if (typeof StranBody === 'function') {
            StranBody();
        }
    }
})();
