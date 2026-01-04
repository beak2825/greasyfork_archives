// ==UserScript==
// @name         500彩票网亚盘统计
// @namespace    http://dol.freevar.com/
// @version      0.5
// @description  在数据分析页面的盘路单元格，添加对应比赛的亚盘对比链接，方便快速统计。在亚盘对比页里增加多场比赛统计功能和高亮显示高低水位。
// @author       Dolphin
// @match        https://odds.500.com/fenxi/shuju-*
// @match        https://odds.500.com/fenxi/yazhi-*
// @match        https://odds.500.com/fenxi/daxiao-*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530019/500%E5%BD%A9%E7%A5%A8%E7%BD%91%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/530019/500%E5%BD%A9%E7%A5%A8%E7%BD%91%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        div.customBtns { text-align:center }
        div.customBtns button { margin:0 5px; padding:4px 8px;}
        #statsTable {border-collapse: collapse; margin:auto;}
        #statsTable tr:nth-child(odd) {background-color: #eee;}
        #statsTable th, #statsTable td {border: 1px solid #ccf; font-size: 16px; text-align: center;padding:0 5px;}
    `);

    // 立即执行加载函数
    if (typeof oddsLoadAll === 'function') {
        oddsLoadAll();
    }

    // 添加控制按钮
    function addControlButtons() {
        const target = document.querySelector('.odds_content.odds_yazhi');
        if (!target) return;

        const container = document.createElement('div');
        container.className = 'customBtns';
        container.innerHTML = `
            <button id="clearBtn" style="background-color:#fcc;">清除</button>
            <button id="toggleBtn" style="background-color:#cfc;">显示</button>
            <button id="statsBtn" style="background-color:#ccf;">统计</button>
        `;
        target.parentNode.insertBefore(container, target);

        // 绑定事件
        document.getElementById('statsBtn').addEventListener('click', handleStats);
        document.getElementById('toggleBtn').addEventListener('click', toggleTable);
        document.getElementById('clearBtn').addEventListener('click', clearStats);
    }

    // 解析水位数值
    function parseWater(text) {
        const num = text.match(/[\d\.]+/);
        return parseFloat(num[0]);
    }

    // 命中判断逻辑
    function isHit(scoreDiff, handicap, homeWater, awayWater) {
        const total = scoreDiff + handicap;
        if (total === 0) return true;
        if (homeWater === awayWater) return false;
        return total > 0 ? homeWater < awayWater : awayWater < homeWater;
    }

    // 统计处理
    function handleStats() {
        // 获取比分
        const scoreElem = document.querySelector('.odds_hd_bf strong');
        const [home, away] = scoreElem.textContent.split(':').map(Number);
        const scoreDiff = home - away;
        if (!isNaN(scoreElem)) return alert('没有比分！');

        // 初始化统计数据
        let stats = JSON.parse(localStorage.getItem('asianStats') || '{}');
        const currentInitialHits = [];

        // 遍历所有公司
        const rows = document.querySelectorAll('#datatb tr[xls="row"]');
        rows.forEach(row => {
            const company = row.querySelector('.tb_plgs a').title;

            // 提取即时盘口数据
            const instant = row.querySelector('td:nth-child(3) table tr');
            const iHome = parseWater(instant.children[0].textContent);
            const iHandi = parseFloat(instant.children[1].getAttribute('ref'));
            const iAway = parseWater(instant.children[2].textContent);

            // 提取初始盘口数据
            const initial = row.querySelector('td:nth-child(5) table tr');
            const initHome = parseWater(initial.children[0].textContent);
            const initHandi = parseFloat(initial.children[1].getAttribute('ref'));
            const initAway = parseWater(initial.children[2].textContent);

            // 更新统计数据
            if (!stats[company]) stats[company] = { instant: [0, 0], initial: [0, 0] };

            // 即时盘口统计
            stats[company].instant[0]++;
            if (isHit(scoreDiff, iHandi, iHome, iAway)) stats[company].instant[1]++;

            // 初始盘口统计
            stats[company].initial[0]++;
            const initHit = isHit(scoreDiff, initHandi, initHome, initAway);
            if (initHit) stats[company].initial[1]++;
            currentInitialHits.push(initHit);
        });

        // 保存数据并检查特殊情况
        localStorage.setItem('asianStats', JSON.stringify(stats));
        const allHit = currentInitialHits.every(h => h);
        const allMiss = currentInitialHits.every(h => !h);
        if (allHit || allMiss) alert(`所有公司初盘${allHit ? '全对✔' : '全错❌'}`);
        window.close();
    }

    // 表格切换
    function toggleTable() {
        const btn = document.getElementById('toggleBtn');
        const table = document.getElementById('statsTable');

        if (table) {
            table.remove();
            btn.textContent = '显示';
            return;
        }

        // 创建新表格
        const stats = JSON.parse(localStorage.getItem('asianStats') || '{}');
        const rows = Array.from(document.querySelectorAll('#datatb tr[xls="row"]'))
            .map(row => {
                const company = row.querySelector('.tb_plgs a').title;
                const instant = row.querySelector('td:nth-child(3) table tr');
                const initial = row.querySelector('td:nth-child(5) table tr');
                return {
                    company,
                    iHome: parseWater(instant.children[0].textContent),
                    iHandi: parseFloat(instant.children[1].getAttribute('ref')),
                    iAway: parseWater(instant.children[2].textContent),
                    initHome: parseWater(initial.children[0].textContent),
                    initHandi: parseFloat(initial.children[1].getAttribute('ref')),
                    initAway: parseWater(initial.children[2].textContent),
                    stats: stats[company] || { instant: [0, 0], initial: [0, 0] }
                };
            })
            .sort((a, b) =>
                (b.stats.initial[1] / b.stats.initial[0] || 0) -
                (a.stats.initial[1] / a.stats.initial[0] || 0)
            );

        // 构建表格
        const statsTable = document.createElement('table');
        statsTable.id = "statsTable";
        statsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>公司</th>
                        <th colspan="6">即时盘口</th>
                        <th colspan="6">初始盘口</th>
                    </tr>
                    <tr>
                        <th>名称</th>
                        <th>开盘</th>
                        <th>命中</th>
                        <th>命中率</th>
                        <th>主水</th>
                        <th>让球</th>
                        <th>客水</th>
                        <th>开盘</th>
                        <th>命中</th>
                        <th>命中率</th>
                        <th>主水</th>
                        <th>让球</th>
                        <th>客水</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.company}</td>
                            <td>${row.stats.instant[0]}</td>
                            <td>${row.stats.instant[1]}</td>
                            <td>${(row.stats.instant[1] / row.stats.instant[0] * 100 || 0).toFixed(1)}%</td>
                            <td style="background:${row.iHome < row.iAway ? '#cfc' : row.iHome > row.iAway ? '#fcc' : ''}">${row.iHome}</td>
                            <td>${row.iHandi}</td>
                            <td style="background:${row.iAway < row.iHome ? '#cfc' : row.iAway > row.iHome ? '#fcc' : ''}">${row.iAway}</td>
                            <td>${row.stats.initial[0]}</td>
                            <td>${row.stats.initial[1]}</td>
                            <td>${(row.stats.initial[1] / row.stats.initial[0] * 100 || 0).toFixed(1)}%</td>
                            <td style="background:${row.initHome < row.initAway ? '#cfc' : row.initHome > row.initAway ? '#fcc' : ''}">${row.initHome}</td>
                            <td>${row.initHandi}</td>
                            <td style="background:${row.initAway < row.initHome ? '#cfc' : row.initAway > row.initHome ? '#fcc' : ''}">${row.initAway}</td>
                        </tr>
                    `).join('')}
                </tbody>
        `;

        // 插入表格
        document.querySelector('div.customBtns').appendChild(statsTable);
        btn.textContent = '隐藏';
    }

    // 清除数据
    function clearStats() {
        localStorage.removeItem('asianStats');
        alert('已清除所有统计数据！');
    }

    // 分析页面添加亚指链接
    function addLinks() {
        document.querySelectorAll('td.dz').forEach(dzTd => {
            const row = dzTd.closest('tr');

            // 获取右边第四个td（第七个单元格，索引6）
            const targetTd = row.cells[6];
            if (!targetTd || targetTd.querySelector('a.yazhi')) return;

            // 获取原始链接并替换
            const link = dzTd.querySelector('a');
            if (!link) return;
            const newHref = link.href.replace('shuju', 'yazhi');

            // 添加点击事件
            const yazhiLink = document.createElement('a');
            yazhiLink.innerHTML = targetTd.innerHTML;
            yazhiLink.href = newHref;
            yazhiLink.target = '_blank';
            yazhiLink.className ='yazhi';
            targetTd.innerHTML = '';
            targetTd.appendChild(yazhiLink);
        });
    }

    // 初始化
    if (location.href.includes('odds.500.com/fenxi/shuju-')) {
        addLinks();
        // 监听复选框变化
        document.body.addEventListener('change', function (e) {
            if (e.target.matches('input[type="checkbox"]')) {
                // 延迟执行确保DOM更新
                setTimeout(addLinks, 1000);
            }
        });
    }
    if (location.href.includes('odds.500.com/fenxi/yazhi-')) addControlButtons();
})();