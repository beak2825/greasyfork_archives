// ==UserScript==
// @name         雷速体育亚盘统计
// @namespace    http://dol.freevar.com/
// @version      0.85
// @description  在雷速移动端网页加入多场比赛亚盘统计功能，点击“选赛”后，在每个比分下可以选择特定比赛进行让球亚盘统计，点击“统计”将加载数据并显示统计结果表格。
// @author       Dolphin
// @match        https://m.leisu.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      pay.jcyqr.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529697/%E9%9B%B7%E9%80%9F%E4%BD%93%E8%82%B2%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/529697/%E9%9B%B7%E9%80%9F%E4%BD%93%E8%82%B2%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 样式定义
    GM_addStyle(`
    input[type="checkbox"] {
    -webkit-appearance: auto;
    -moz-appearance: auto;
    appearance: auto;
    width: 5vw;
    height: 5vw;
    border: initial;
    background: initial;
    }
        .stats-table { border-collapse:collapse; margin:auto;}
        .stats-table tr:nth-child(odd) {background:#fff;}
        .stats-table td, .stats-table th { font-size:4vw; border:1px solid #ccc; text-align:center; padding:0 1vw; }
        .highlight-green { background:#cfc }
        .highlight-red { background:#fcc }
        #analysisButtons button {background:#fd4; padding:1vw 3vw; border-radius:1vw;}
    `);
 
    // 修改UserAgent
    Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 14; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070336) NetType/WIFI Language/zh_CN',
        configurable: true,
        writable: false,
    });
 
    // 全局变量
    let selectedMatches = new Map();
    let resultContainer = null;
    let isShowing = false;
    const companyNameMap = {
    'BE****': 'Bet365',
    '澳****': '澳门',
    '皇****': '皇冠',
    '金****': '金宝博',
    'No****': '1xBet',
    '香****': '香港',
    '易****': '易胜博',
    'Red****': '平博',
    '18****': '18Bet',
    '盈****': '盈禾',
    '利****': '利记',
    '壹****': '12Bet',
    'In****': 'Interw',
    '伟****': '伟德',
    '威****': '威廉',
    '明****': '明陞',
    '立****': '立博'
};
 
    // 添加控制按钮
    function addControlButtons() {
        const adbanner=document.querySelector('div.detail-banner');
        if(adbanner) adbanner.style.display='none';
        const container = document.createElement('div');
        container.id = 'analysisButtons';
        container.innerHTML = `
            <button id="btnStats">选赛</button>
            <button id="btnToggle">统计</button>
        `;
 
        document.querySelector('div.classTab').appendChild(container);
 
        // 绑定事件
        document.getElementById('btnStats').addEventListener('click', replaceMintxt);
        document.getElementById('btnToggle').addEventListener('click', toggleAnalysis);
    }
 
    // 切换显示状态
    async function toggleAnalysis() {
        const btn = document.getElementById('btnToggle');
        if (isShowing) {
            // 隐藏状态
            if (resultContainer) {
                resultContainer.remove();
                resultContainer = null;
            }
            btn.textContent = '统计';
            btn.style.background='#fd4';
            isShowing = false;
        } else {
            // 显示状态
            btn.style.background='#f66';
            btn.textContent = '加载中';
            try {
                await fetchAndRenderData();
                btn.textContent = '删表';
                btn.style.background='#6be';
                isShowing = true;
            } catch (e) {
                btn.textContent = '统计';
                alert('数据加载失败: ' + e);
            }
        }
    }
 
    // 替换mintxt为复选框
    function replaceMintxt() {
        document.querySelectorAll('p.mintxt').forEach(p => {
            const parent = p.closest('.leisu-tab-td');
            const link = parent.querySelector('a[href^="/live/detail-"]');
            if (!link) return;
            const matchId = link.href.split('-').pop();
            link.setAttribute('href', link.href.replace('/detail-', '/data-'));
            link.setAttribute('target', '_blank');
 
            // 获取比分差值
            const scoreText = p.previousElementSibling.textContent;
            const [home, away] = scoreText.split('-').map(Number);
            const diff = home - away;
 
            // 创建复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            checkbox.addEventListener('change', e => {
                if (e.target.checked) {
                    selectedMatches.set(matchId, diff);
                } else {
                    selectedMatches.delete(matchId);
                }
            });
 
            p.replaceWith(checkbox);
        });
        const stbtn=document.getElementById('btnStats');
        stbtn.textContent = '✅';
    }
 
    // 获取并渲染数据
    async function fetchAndRenderData() {
        const timestamp = Date.now();
        const sign = generateRandomString(32);
        const currentMatchId = window.location.pathname.split('-').pop();
 
        // 获取当前比赛数据
        const currentData = await requestOdds(currentMatchId, sign, timestamp);
        const { initialOdds, liveOdds } = processCurrentData(currentData);
 
        // 获取选中比赛数据
        const statsRequests = [];
        for (const [matchId, diff] of selectedMatches) {
            statsRequests.push(
                requestOdds(matchId, sign, timestamp)
                    .then(data => ({ matchId, data }))
                    .catch(e => {
                        alert(`比赛 ${matchId} 获取亚盘数据失败: ${e.message}`);
                        return null;
                    })
            );
        }
 
        const statsResults = await Promise.all(statsRequests);
        const companyStats = processStatsData(statsResults);
 
        // 渲染结果
        renderAnalysisResult(companyStats, initialOdds, liveOdds);
    }
 
    // 处理当前比赛数据
function processCurrentData(data) {
    const initialOdds = new Map();
    const liveOdds = new Map();

    data.data.forEach(companyGroup => {
        const initial = companyGroup.find(e => e.is_begin_odds === 1);
        const live = companyGroup.find(e => e.is_begin_odds === 0);
        const getCompanyName = (entry) => companyNameMap[entry.company_name] || entry.company_name;

        if (initial) {
            const company = getCompanyName(initial);
            initialOdds.set(company, {
                home: initial.home_winner,
                draw: initial.draw,
                away: initial.away_winner
            });
        }

        if (live) {
            const company = getCompanyName(live);
            liveOdds.set(company, {
                home: live.home_winner,
                draw: live.draw,
                away: live.away_winner
            });
        }
    });

    return { initialOdds, liveOdds };
}
 
    // 处理统计数据
    function processStatsData(allData) {
        const stats = new Map();
 
        allData.forEach(({ matchId, data }) => {
            data.data.forEach(companyGroup => {
                companyGroup.forEach(entry => {
                    if (entry.is_begin_odds !== 1) return;
 
                    const company = companyNameMap[entry.company_name] || entry.company_name;
                    if (!stats.has(company)) {
                        stats.set(company, {
                            count: 0,
                            hit: 0,
                            home: entry.home_winner,
                            draw: entry.draw,
                            away: entry.away_winner
                        });
                    }
 
                    const record = stats.get(company);
                    record.count++;
 
                    // 获取当前比赛的差值
                    const diff = selectedMatches.get(matchId);
                    if (typeof diff !== 'number') return;
 
                    const draw = parseFloat(entry.draw);
                    if (diff === draw) {
                        record.hit++;
                    } else if (diff > draw && entry.home_winner < entry.away_winner) {
                        record.hit++;
                    } else if (diff < draw && entry.away_winner < entry.home_winner) {
                        record.hit++;
                    }
                });
            });
        });
 
        return stats;
    }
 
    // 渲染分析结果
    function renderAnalysisResult(stats, initialOdds, liveOdds) {
        // 清理旧容器
        if (resultContainer) {
            resultContainer.remove();
        }
 
        resultContainer = document.createElement('div');
        resultContainer.className = 'stats-container';
 
        // 统计表格
        const statsTable = document.createElement('table');
        statsTable.className = 'stats-table';
        statsTable.innerHTML = `
            <thead>
                <tr>
                    <th>公司</th>
                    <th>开盘</th>
                    <th>命中</th>
                    <th>命中率</th>
                    <th>主队</th>
                    <th>让球</th>
                    <th>客队</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        // 即时数据表格
        const liveTable = document.createElement('table');
        liveTable.className = 'stats-table';
        liveTable.innerHTML = `
            <thead>
                <tr>
                    <th>公司</th>
                    <th>即时主队</th>
                    <th>即时让球</th>
                    <th>即时客队</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        // 按命中率降序列出公司统计表格
        const statsArray = Array.from(stats.entries());
        statsArray.sort((a, b) => {
            const aHitRate = a[1].count ? a[1].hit / a[1].count : 0;
            const bHitRate = b[1].count ? b[1].hit / b[1].count : 0;
            return bHitRate - aHitRate;
        });

        statsArray.forEach(([company, data]) => {
            const row = statsTable.insertRow();
            const initial = initialOdds.get(company) || {};

            row.innerHTML = `
        <td>${company}</td>
        <td>${data.count}</td>
        <td>${data.hit}</td>
        <td>${data.count ? (data.hit / data.count * 100).toFixed(1) + '%' : ''}</td>
        <td>${initial.home || ''}</td>
        <td>${initial.draw || ''}</td>
        <td>${initial.away || ''}</td>
    `;
            highlightCells(row.querySelectorAll('td:nth-child(5), td:nth-child(7)'));
        });

        // 填充即时数据
        liveOdds.forEach((data, company) => {
            const row = liveTable.insertRow();
            row.innerHTML = `
                <td>${company}</td>
                <td>${data.home}</td>
                <td>${data.draw}</td>
                <td>${data.away}</td>
            `;
            highlightCells(row.querySelectorAll('td:nth-child(2), td:nth-child(4)'));
        });
 
        // 组装容器
        resultContainer.append(statsTable, liveTable);
        document.querySelector('div.classTab').after(resultContainer);
    }
 
    // 辅助函数
    function highlightCells(cells) {
        if (cells.length !== 2) return;
 
        const [cellA, cellB] = cells;
        const valueA = parseFloat(cellA.textContent);
        const valueB = parseFloat(cellB.textContent);
 
        cellA.classList.remove('highlight-green', 'highlight-red');
        cellB.classList.remove('highlight-green', 'highlight-red');
 
        if (isNaN(valueA) || isNaN(valueB)) return;
 
        if (valueA < valueB) {
            cellA.classList.add('highlight-green');
            cellB.classList.add('highlight-red');
        } else if (valueA > valueB) {
            cellA.classList.add('highlight-red');
            cellB.classList.add('highlight-green');
        }
    }
 
    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
 
    function requestOdds(matchId, sign, timestamp) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://pay.jcyqr.com/odds?sign=${sign}&timestamp=${timestamp}&match_id=${matchId}&type=4`,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('数据解析失败'));
                        }
                    } else {
                        reject(new Error(`HTTP ${res.status}`));
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }
 
    //链接替换成数据页面并在新窗口打开
    function modifyLink(a) {
        const originalHref = a.getAttribute('href');
        if (originalHref && originalHref.includes('/live/detail-')) {
            const newHref = originalHref.replace('/live/detail-', '/live/data-');
            a.setAttribute('href', newHref);
        }
        a.setAttribute('target', '_blank');
    }
 
    function livePageMod() {
        // 初始处理已有链接
        document.querySelectorAll('li.ftb-lier-base a.linkk').forEach(a => {
            modifyLink(a);
        });
 
        // 使用MutationObserver监控动态加载的内容
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('li.ftb-lier-base')) {
                        const link = node.querySelector('a.linkk');
                        if (link) modifyLink(link);
                    }
                }
            }
        });
 
        // 开始观察列表容器
        const listContainer = document.querySelector('ul.dataList');
        if (listContainer) {
            observer.observe(listContainer, {
                childList: true,
                subtree: false
            });
        }
    }
 
    //初始化
    const intervalId = setInterval(() => {
        const liElement = document.querySelector('li.ftb-lier-base');
        const divElement = document.querySelector('div.classTab');
 
        // 如果任一元素存在则执行对应函数
        if (liElement || divElement) {
            if (liElement) livePageMod();
            if (divElement) addControlButtons();
            clearInterval(intervalId); // 清除定时器
        }
    }, 1000);
 
})();