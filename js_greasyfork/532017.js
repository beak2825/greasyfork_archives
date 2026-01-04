// ==UserScript==
// @name         新球体育网让球指数扩展
// @namespace    http://dol.freevar.com/
// @version      0.3
// @description  新球体育网（球探）手机端网页，在让球指数页面里增加一个公司选择菜单，按开盘时间列出各家公司。
// @author       Dolphin
// @run-at       document-idle
// @match        https://m.titan007.com/asian/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      txt.titan007.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532017/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E8%AE%A9%E7%90%83%E6%8C%87%E6%95%B0%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/532017/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E8%AE%A9%E7%90%83%E6%8C%87%E6%95%B0%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #statsTab {border-collapse: collapse; margin:auto;}
        #statsTab tr:nth-child(odd) {background-color: #eee;}
        #statsTab td, #statsTab th {border: 1px solid #888; font-size: 16px; text-align: center;padding:0 5px;}
    `);

    // 公司数据
    const companies = [
        {companyId:1, name:"澳门"}, {companyId:3, name:"Crown"}, {companyId:8, name:"Bet365"},
        {companyId:12, name:"易胜博"}, {companyId:14, name:"伟德"}, {companyId:17, name:"明陞"},
        {companyId:23, name:"金宝博"}, {companyId:24, name:"12Bet"}, {companyId:31, name:"利记"},
        {companyId:35, name:"盈禾"}, {companyId:42, name:"18Bet"}, {companyId:47, name:"平博"},
        {companyId:48, name:"香港"}, {companyId:9, name:"威廉"}, {companyId:19, name:"Interw"},
        {companyId:"open", name:"开盘"}
    ];

    // 创建公司选择器
    function createSelector() {
        const select = document.createElement('select');
        select.className = "btn";
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.companyId;
            option.textContent = company.name;
            select.appendChild(option);
        });
        return select;
    }

    // 解析game数组
    function parseGameArray(responseText) {
        const regex = /var game=Array\((.*?)\);/s;
        const match = responseText.match(regex);
        if (!match) return [];
        const content = match[1];
        const elements = content.match(/"((?:\\"|[^"])*?)"/g) || [];
        return elements.map(s => s.slice(1, -1).replace(/\\"/g, '"'));
    }

    // 解析gameDetail数组
    function parseGameDetailArray(responseText) {
        const regex = /var gameDetail=Array\((.*?)\);/s;
        const match = responseText.match(regex);
        if (!match) return [];
        const content = match[1];
        const elements = content.match(/"((?:\\"|[^"])*?)"/g) || [];
        return elements.map(s => s.slice(1, -1).replace(/\\"/g, '"'));
    }

    // 创建公司映射
    function createCompanyMap(games) {
        const map = new Map();
        for (const gameStr of games) {
            const parts = gameStr.split('|');
            if (parts.length < 3) continue;
            const companyId = parts[1];
            const companyName = parts[2];
            map.set(companyId, companyName);
        }
        return map;
    }

    // 处理详细数据获取开盘时间
    function processGameDetails(gameDetails, companyMap) {
        const openingTimes = {};
        for (const detailStr of gameDetails) {
            const [companyIdPart, ...rest] = detailStr.split('^');
            if (!companyIdPart || rest.length === 0) continue;
            const companyId = companyIdPart;
            const companyName = companyMap.get(companyId);
            if (!companyName) continue;

            const blocks = rest.join('^').split(';').filter(b => b.trim() !== '');
            let earliestTime = null;
            for (const block of blocks) {
                const fields = block.split('|');
                if (fields.length < 8) continue;
                const timeStr = fields[3];
                const year = fields[7];
                const [monthDay, timePart] = timeStr.split(' ');
                const [month, day] = monthDay.split('-');
                const [hours, minutes] = timePart.split(':');
                const date = new Date(year, month - 1, day, hours, minutes);
                if (isNaN(date.getTime())) continue;
                if (!earliestTime || date < earliestTime) earliestTime = date;
            }
            if (earliestTime) openingTimes[companyName] = earliestTime;
        }
        return openingTimes;
    }

    // 创建开盘时间表格
    function createOpeningTable(openingTimes) {
        const entries = Object.entries(openingTimes)
            .map(([company, date]) => ({ company, date }))
            .sort((a, b) => a.date - b.date);

        const table = document.createElement('table');
        table.id = 'statsTab';
        // 表头
        const header = document.createElement('tr');
        ['公司', '开盘时间'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            header.appendChild(th);
        });
        table.appendChild(header);

        // 表格内容
        entries.forEach(entry => {
            const row = document.createElement('tr');
            // 公司名称
            const companyTd = document.createElement('td');
            companyTd.textContent = entry.company;
            row.appendChild(companyTd);
            // 开盘时间
            const timeTd = document.createElement('td');
            const month = String(entry.date.getMonth() + 1).padStart(2, '0');
            const day = String(entry.date.getDate()).padStart(2, '0');
            const hours = String(entry.date.getHours()).padStart(2, '0');
            const minutes = String(entry.date.getMinutes()).padStart(2, '0');
            timeTd.textContent = `${month}-${day} ${hours}:${minutes}`;
            row.appendChild(timeTd);
            table.appendChild(row);
        });

        document.querySelector('div#content').prepend(table);
    }

    // 转换时间格式
    function parseTime(timeStr) {
        const year = timeStr.substr(0,4);
        const month = timeStr.substr(4,2)-1;
        const day = timeStr.substr(6,2);
        const hour = timeStr.substr(8,2);
        const minute = timeStr.substr(10,2);
        const second = timeStr.substr(12,2);
        return new Date(year, month, day, hour, minute, second);
    }

    // 时间格式化函数
    function formatTime(timeStr) {
        const date = parseTime(timeStr);
        return `${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ` +
               `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
    }

    // 计算持续时间
    function calculateDuration(data) {
        const trends = [];
        let currentTrend = null;
        let startIndex = 0;

        for (let i = 0; i < data.length; i++) {
            const home = parseFloat(data[i].HomeOdds);
            const away = parseFloat(data[i].AwayOdds);
            const trend = home > away ? 'home' : home < away ? 'away' : 'equal';

            if (trend !== currentTrend && currentTrend !== null) {
                trends.push({
                    start: startIndex,
                    end: i-1,
                    trend: currentTrend
                });
                startIndex = i;
            }
            currentTrend = trend;
        }
        trends.push({start: startIndex, end: data.length-1, trend: currentTrend});

        const durationMap = new Map();
        for (const trend of trends.filter(t => t.trend !== 'equal')) {
            const startTime = parseTime(data[trend.end].ModifyTime);
            const endTime = parseTime(data[Math.max(trend.start - 1, 0)].ModifyTime);
            const duration = Math.round((endTime - startTime)/1000);

            if (duration > 0) {
                // 修改为HH:mm:ss格式
                const hours = Math.floor(duration/3600);
                const minutes = Math.floor((duration%3600)/60);
                const seconds = duration%60;
                durationMap.set(trend.end,
                    `${String(hours)}:` +
                    `${String(minutes).padStart(2,'0')}:` +
                    `${String(seconds).padStart(2,'0')}`
                );
            }
        }
        return durationMap;
    }

    // 创建表格
    function createTable(data) {
        const durationMap = calculateDuration(data);
        const table = document.createElement('table');
        table.id = 'statsTab';

        // 添加表头
        const header = document.createElement('tr');
        ['主水', '让球', '客水', '更新时间', '持续时间'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            header.appendChild(th);
        });
        table.appendChild(header);

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            const home = parseFloat(item.HomeOdds);
            const away = parseFloat(item.AwayOdds);

            // 创建单元格
            const createCell = (value, compare) => {
                const td = document.createElement('td');
                td.textContent = value;
                if (compare === 'home') td.style.backgroundColor = home > away ? '#fcc' : home < away ? '#cfc' : '';
                if (compare === 'away') td.style.backgroundColor = away > home ? '#fcc' : away < home ? '#cfc' : '';
                return td;
            };

            row.appendChild(createCell(item.HomeOdds, 'home'));
            row.appendChild(createCell(item.PanKou));
            row.appendChild(createCell(item.AwayOdds, 'away'));
            row.appendChild(createCell(formatTime(item.ModifyTime)));

            const durationTd = document.createElement('td');
            if (durationMap.has(index)) durationTd.textContent = durationMap.get(index);
            row.appendChild(durationTd);

            table.appendChild(row);
        });
        return table;
    }

    // 主逻辑
    const selector = createSelector();
    document.querySelector('div.btns').prepend(selector);

    selector.addEventListener('change', function () {
        // 删除旧表格
        const oldTable = document.querySelector('#statsTab');
        if (oldTable) oldTable.remove();

        if (this.value === 'open') {
            const url = `https://txt.titan007.com/1x2/${scheduleId}.js`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    const games = parseGameArray(response.responseText);
                    const gameDetails = parseGameDetailArray(response.responseText);
                    const companyMap = createCompanyMap(games);
                    const openingTimes = processGameDetails(gameDetails, companyMap);
                    createOpeningTable(openingTimes);
                }
            });
        } else {
            // 请求数据
            const url = `/HandicapDataInterface.ashx?scheid=${scheduleId}&type=3&oddskind=${oddskind}&companyid=${this.value}&isHalf=${isHalf}`;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    // 过滤数据
                    const firstEmptyIndex = data.findIndex(d => d.HappenTime === "");
                    const startIndex = Math.max(0, firstEmptyIndex - 2);
                    data = data.slice(startIndex);

                    // 插入新表格
                    const table = createTable(data);
                    document.querySelector('div#content').prepend(table);
                }
            };
            xhr.send();
        }
    });
})();