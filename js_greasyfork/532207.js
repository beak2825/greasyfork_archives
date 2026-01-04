// ==UserScript==
// @name         奶牛地图统计
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  实时统计各地图人数和队伍数
// @author       XiaoR
// @match        http://111.170.18.193:40622/cnparty.php
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532207/%E5%A5%B6%E7%89%9B%E5%9C%B0%E5%9B%BE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/532207/%E5%A5%B6%E7%89%9B%E5%9C%B0%E5%9B%BE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

GM_addStyle(`
#stats-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.9);
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    max-height: 80vh;
    overflow-y: auto;
}
.stats-item {
    margin: 8px 0;
    font-size: 14px;
    color: #333;
}
.stats-title {
    font-weight: bold;
    margin-bottom: 12px;
    color: #2c3e50;
}
`);

// 在原有代码末尾添加统计功能
(function() {
    'use strict';

    // 创建统计面板
    const statsPanel = document.createElement('div');
    statsPanel.id = 'stats-panel';
    statsPanel.innerHTML = '<div class="stats-title">地图实时统计</div>';
    document.body.appendChild(statsPanel);

function updateStatistics() {
    const mapStats = new Map();
    const rows = document.querySelectorAll('#raw_data tbody tr:not([style*="display: none"])');

    rows.forEach(row => {
        const gameMode = row.cells[1].textContent.trim(); // 第二列为游戏模式
        // 过滤铁牛模式
        if (gameMode === '铁牛') return;

        const mapName = row.cells[0].textContent;
        const playerCount = parseInt(row.cells[2].textContent) || 0;
        const teamCount = 1;

        if(mapStats.has(mapName)) {
            const existing = mapStats.get(mapName);
            existing.players += playerCount;
            existing.teams += teamCount;
        } else {
            mapStats.set(mapName, {players: playerCount, teams: teamCount});
        }
    });

    // 更新显示（添加过滤铁牛后的统计）
    statsPanel.innerHTML = `
        <div class="stats-title">地图实时统计（共 ${rows.length} 条记录）</div>
        ${[...mapStats].map(([map, data]) => `
            <div class="stats-item">
                ${map}：
                <span style="color:#27ae60">${data.players}人</span> /
                <span style="color:#2980b9">${data.teams}队</span>
            </div>
        `).join('')}
    `;
}

    // 每3秒更新一次 + 初始化执行
    setInterval(updateStatistics, 3000);
    updateStatistics();

})();