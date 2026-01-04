// ==UserScript==
// @name         新球体育网胜平负初盘
// @namespace    http://dol.freevar.com/
// @version      0.9
// @description  新球体育网（球探）手机端网页，在胜平负指数页面里按初盘时间顺序列出公司表格，并在指数变化页面里显示盘口持续时间，点击返还率转换成让1.75球以内的亚盘。
// @author       Dolphin
// @run-at       document-idle
// @match        *://m.titan007.com/compensate/*
// @match        *://m.titan007.com/CompensateDetail/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532466/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E8%83%9C%E5%B9%B3%E8%B4%9F%E5%88%9D%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/532466/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E8%83%9C%E5%B9%B3%E8%B4%9F%E5%88%9D%E7%9B%98.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    function crtInitTable() {
        // 创建公司信息映射表（欧赔ID -> 公司信息）
        var companyMap = {};
        game.forEach(function (g) {
            var parts = g.split("|");
            companyMap[parts[1]] = {
                id: parts[0],
                name: parts[2]
            };
        });
 
        // 创建表格元素
        var table = document.createElement("table");
        table.style = 'text-align:center; border-collapse:collapse; margin:auto;';
 
        // 创建表头
        var thead = document.createElement("thead");
        thead.innerHTML = "<tr><th>公司</th><th>胜</th><th>平</th><th>负</th><th>初盘时间</th></tr>";
        table.appendChild(thead);
 
        // 创建数据缓存用于排序
        var tableData = [];
        gameDetail.forEach(function (detail) {
            var parts = detail.split("^");
            if (parts.length < 2) return;
 
            var oupeiId = parts[0];
            var company = companyMap[oupeiId];
            if (!company) return;
 
            var records = parts[1].split(";").filter(Boolean);
            if (records.length === 0) return;
 
            // 获取最后一条记录（初盘数据）
            var firstRecord = records[records.length - 1].split("|");
 
            // 存储需要排序的数据
            tableData.push({
                company: company,
                record: firstRecord,
                timestamp: new Date(`${firstRecord[7]}-${firstRecord[3].replace(" ", "T")}:00`) // 构造完整时间
            });
        });
 
        // 按时间升序排序
        tableData.sort((a, b) => a.timestamp - b.timestamp);
 
        // 创建表格内容
        var tbody = document.createElement("tbody");
        tableData.forEach(item => {
            var tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.onclick = function () {
                window.open(`/CompensateDetail/${item.company.id}/${scheduleId}.htm`);
            };
 
            tr.innerHTML = `
        <td>${item.company.name}</td>
        <td style='padding:0 8px; border:1px solid #888;'>${item.record[0]}</td>
        <td style='padding:0 8px; border:1px solid #888;'>${item.record[1]}</td>
        <td style='padding:0 8px; border:1px solid #888;'>${item.record[2]}</td>
        <td>${item.record[3]}</td>
    `;
 
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
 
        // 插入到content容器顶部
        var contentDiv = document.getElementById("content");
        if (contentDiv) {
            contentDiv.insertBefore(table, contentDiv.firstChild);
        }
    }
 
    function timeDuration() {
        // 获取表格中的所有行，排除表头
        const tbody = document.querySelectorAll('tbody')[1];
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(1);
 
        tbody.querySelector('tr').cells[2].textContent = '持续时间';
        document.querySelector('tr').cells[2].textContent = '持续时间';
 
        for (let i = 0; i < rows.length - 1; i++) {
            const currentRow = rows[i];
            const nextRow = rows[i + 1];
 
            // 解析当前行时间
            const currentTd = currentRow.cells[5];
            const currentDivs = currentTd.querySelectorAll('div');
            const currentDate = currentDivs[0].textContent.trim();
            const currentTime = currentDivs[1].textContent.trim();
            const currentYear = new Date().getFullYear();
            const currentDateTime = new Date(`${currentYear}-${currentDate} ${currentTime}`);
 
            // 解析下一行时间
            const nextTd = nextRow.cells[5];
            const nextDivs = nextTd.querySelectorAll('div');
            const nextDate = nextDivs[0].textContent.trim();
            const nextTime = nextDivs[1].textContent.trim();
            const nextDateTime = new Date(`${currentYear}-${nextDate} ${nextTime}`);
 
            // 计算时间差（毫秒）
            const diff = currentDateTime - nextDateTime;
 
            // 转换为日时分格式
            const totalSeconds = Math.floor(diff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
 
            let durationStr = "";
            if (days > 0) {
                durationStr = `${days}日${hours}时${minutes}分`;
            } else if (hours > 0) {
                durationStr = `${hours}时${minutes}分`;
            } else {
                durationStr = `${minutes}分`;
            }
 
            // 将结果填入下一行的第五个td（索引4）
            nextRow.cells[4].textContent = durationStr;
        }
 
        // 添加点击返还率转换成亚盘
        rows.forEach(row => {
            row.cells[3].addEventListener('click', function () {
                // 获取当前行的前3个单元格的数值
                const homeOdds = parseFloat(row.cells[0].textContent);
                const drawOdds = parseFloat(row.cells[1].textContent);
                const awayOdds = parseFloat(row.cells[2].textContent);
 
                // 调用转换函数
                const result = convertAsianHandicap(homeOdds, drawOdds, awayOdds);
 
                // 弹出提示框显示结果
                alert(`胜: ${homeOdds} 平: ${drawOdds} 负: ${awayOdds}\n胜率: ${(result.pWin * 100).toFixed(2)}% 平率: ${(result.pDraw * 100).toFixed(2)}% 负率: ${(result.pLose * 100).toFixed(2)}%\n${result.upperOdds} 🦶 ${result.handicap} ⚽ ${result.lowerOdds}`);
            });
        });
    }
 
function convertAsianHandicap(oddsWin, oddsDraw, oddsLose) {
    // 计算隐含概率
    const invWin = 1 / oddsWin;
    const invDraw = 1 / oddsDraw;
    const invLose = 1 / oddsLose;
    const sum = invWin + invDraw + invLose;
 
    const pWin = invWin / sum;
    const pDraw = invDraw / sum;
    const pLose = invLose / sum;
 
    // 确定上盘（胜率较高的队伍）
    const isUpperHome = pWin > pLose;
    const upperProb = isUpperHome ? pWin : pLose;
 
    // 判断是否超出范围
    let handicap = null;
    let withinRange = true;
 
    if (upperProb >= 0.804348) {
        withinRange = false;
    } else if (upperProb < 0.390295) {
        handicap = 0;
    } else if (upperProb < 0.4625) {
        handicap = 0.25;
    } else if (upperProb < 0.52857) {
        handicap = 0.5;
    } else if (upperProb < 0.578125) {
        handicap = 0.75;
    } else if (upperProb < 0.637931) {
        handicap = 1;
    } else if (upperProb < 0.685185) {
        handicap = 1.25;
    } else if (upperProb < 0.74) {
        handicap = 1.5;
    } else if (upperProb < 0.804348) {
        handicap = 1.75;
    } else {
        withinRange = false;
    }
 
    // 构建返回结果
    const result = {
        pWin,
        pDraw,
        pLose,
        upperOdds:0,
        handicap:'让超过1.75球',
        lowerOdds:0
    };
 
    // 如果超出范围，仅返回概率
    if (!withinRange) {
        return result;
    }
 
    // 计算亚盘赔率
    let upperOdds, lowerOdds;
 
    if (handicap === 0) {
        // 让球数为0，按双方胜率的反比例分配赔率
        const a = isUpperHome ? pWin : pLose;
        const b = isUpperHome ? pLose : pWin;
 
        // 上盘赔率 = 1.8 + 0.3 * (1 - a / (a + b))
        upperOdds = 1.8 + (0.3 * (1 - a / (a + b)));
        lowerOdds = 1.8 + (0.3 * (1 - b / (a + b)));
    } else {
        // 非零让球数，确定区间并计算赔率
        let low, high;
 
        switch (handicap) {
            case 0.25:
                low = 0.390295;
                high = 0.4625;
                break;
            case 0.5:
                low = 0.4625;
                high = 0.52857;
                break;
            case 0.75:
                low = 0.52857;
                high = 0.578125;
                break;
            case 1:
                low = 0.578125;
                high = 0.637931;
                break;
            case 1.25:
                low = 0.637931;
                high = 0.685185;
                break;
            case 1.5:
                low = 0.685185;
                high = 0.74;
                break;
            case 1.75:
                low = 0.74;
                high = 0.804348;
                break;
            default:
                low = 0;
                high = 0;
                break;
        }
 
        // 线性插值得到赔率
        const fraction = (upperProb - low) / (high - low);
        upperOdds = 2.1 - (fraction * 0.3);
        lowerOdds = 3.9 - upperOdds;
    }
 
    // 如果上盘是客队，让球数为负，并交换赔率
    if (!isUpperHome) {
        handicap = -handicap;
        [upperOdds, lowerOdds] = [lowerOdds, upperOdds];
    }
 
    // 添加亚盘信息到结果中
    result.handicap = handicap;
    result.upperOdds = upperOdds.toFixed(3);
    result.lowerOdds = lowerOdds.toFixed(3);
 
    return result;
}
 
    if (location.href.includes('m.titan007.com/compensate/')) crtInitTable();
    else if (location.href.includes('m.titan007.com/CompensateDetail/')) timeDuration();
})();