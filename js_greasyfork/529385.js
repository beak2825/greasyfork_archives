// ==UserScript==
// @name         鲸猜足球网初始亚盘统计
// @namespace    http://dol.freevar.com/
// @version      0.87
// @description  鲸猜足球手机端网页（https://wap.jczq.com/）初始亚盘水位高亮显示，并加入两队多场赛事初始亚盘统计功能。在球队页面自动切换到近期赛程，点击比赛自动切换到亚指页面，点击统计后自动返回上一页。
// @author       Dolphin
// @run-at       document-idle
// @match        *://wap.jczq.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529385/%E9%B2%B8%E7%8C%9C%E8%B6%B3%E7%90%83%E7%BD%91%E5%88%9D%E5%A7%8B%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/529385/%E9%B2%B8%E7%8C%9C%E8%B6%B3%E7%90%83%E7%BD%91%E5%88%9D%E5%A7%8B%E4%BA%9A%E7%9B%98%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        #statsTable {
            border-collapse: collapse;
            margin: auto;
        }
        #statsTable tr:nth-child(odd) {background-color: #fff;}
        #statsTable td, #statsTable th {
            text-align: center;
            border: 1px solid #ccc;
            padding: 0 0.05rem;
        }
        button.ctrlBtn {
            margin-right: .12rem;
        }
    `);

    // 元素查找函数
    function findItemByText(text) {
        return Array.from(document.querySelectorAll('div.item')).find(el => el.textContent.trim() === text);
    }
    let lastHash='';
    // URL哈希检测函数
    function checkHash() {
        const currentHash = window.location.hash;
        if (currentHash === lastHash) return;
        lastHash = currentHash;
        if (currentHash.includes('/data/team/')) {
            const item = findItemByText('比赛');
            item?.click();
        } else if (currentHash.includes('/match/live/')) {
            const item = findItemByText('指数');
            item?.click();
            creatBtns();
        } else if (currentHash.includes('/match/plan/')) {
            const indexItem = findItemByText('指数');
            if (indexItem) {
                const mouseEventOptions = { bubbles: true, cancelable: true,};
                indexItem.dispatchEvent(new MouseEvent('mousedown', mouseEventOptions));
                indexItem.dispatchEvent(new MouseEvent('mouseup', mouseEventOptions));
                const touch = new Touch({ identifier: 1, target: indexItem });
                indexItem.dispatchEvent(new TouchEvent('touchstart', { touches: [touch], bubbles: true }));
                indexItem.dispatchEvent(new TouchEvent('touchend', { changeTouches: [touch], bubbles: true }));
                creatBtns();
            }
        }
    }

    // 添加功能按钮
    function creatBtns() {
        new MutationObserver((_, observer) => {
            const divs = document.querySelectorAll('#app div.item.item_');
            if ([...divs].some(div => div.textContent.trim() === '亚指')) {
                const asiaItem = findItemByText('亚指');
                asiaItem.click();
                if (!document.querySelector(`button.ctrlBtn`)) {
                    const buttons = ['清除', '显示', '统计'];
                    const colors = ['#fcc', '#ccf', '#cfc'];
                    buttons.forEach((text, i) => {
                        const btn = document.createElement('button');
                        btn.textContent = text;
                        btn.style.backgroundColor = colors[i];
                        btn.value = text;
                        btn.className = 'ctrlBtn';
                        asiaItem.parentNode.insertBefore(btn, asiaItem);
                    });
                    addEventListeners();
                }
                observer.disconnect();
            }
        }).observe(document.getElementById('app'), { childList: true, subtree: true });
    }

    // 添加事件监听器
    function addEventListeners() {
        const statBtn = document.querySelector('button[value="统计"]');
        statBtn?.addEventListener('click', handleStat);

        const clearBtn = document.querySelector('button[value="清除"]');
        clearBtn?.addEventListener('click', handleClear);

        const showBtn = document.querySelector('button[value="显示"]');
        showBtn?.addEventListener('click', handleShow);
    }

    // 统计功能处理
    function handleStat() {
        const scoreDiv = document.querySelector('.score-2');
        if (!scoreDiv) {
            alert('找不到完场比分！');
            return;
        }

        const [homeScore, awayScore] = scoreDiv.textContent.trim().split(':').map(Number);
        const diff = homeScore - awayScore;
        if (isNaN(diff)) {
            alert('没有比分！');
            return;
        }

        const companies = Array.from(document.querySelectorAll('.lst-item')).map(companyEl => {
            const name = companyEl.querySelector('.lst-item-company')?.textContent.trim();
            const initialSection = companyEl.querySelector('.f-flex:first-child');
            const rates = initialSection?.querySelectorAll('.lst-item-rate') || [];
            return {
                name,
                home: parseFloat(rates[0]?.textContent),
                spread: parseFloat(rates[1]?.textContent),
                away: parseFloat(rates[2]?.textContent)
            };
        });

        let allMiss = true;
        const stats = JSON.parse(localStorage.getItem('asianStats') || '{}');

        companies.forEach(company => {
            const { name, home, spread, away } = company;
            if (!name) return;

            let isHit = false;
            if (diff === spread) {
                isHit = true;
            } else if (diff > spread && home < away) {
                isHit = true;
            } else if (diff < spread && away < home) {
                isHit = true;
            }

            stats[name] = stats[name] || { total: 0, hits: 0 };
            stats[name].total++;
            if (isHit) stats[name].hits++;
            allMiss = allMiss && !isHit;
        });

        if (allMiss) alert('本场比赛全部公司的初盘都没命中！');
        localStorage.setItem('asianStats', JSON.stringify(stats));
        window.history.back();
    }

    // 清除数据
    function handleClear() {
        localStorage.removeItem('asianStats');
        alert('已清除所有统计数据！');
    }

    // 显示/隐藏表格
function handleShow() {
    const btn = this;
    const mHd = document.querySelector('.m-hd[style="top: unset;"]');

    if (btn.textContent === '显示') {
        btn.textContent = '隐藏';

        const stats = JSON.parse(localStorage.getItem('asianStats') || '{}');
        if (!Object.keys(stats).length) {
            alert('暂无统计数据');
            btn.textContent = '显示';
            return;
        }

        const table = document.createElement('table');
        table.id='statsTable';

        // 表头
        const thead = table.createTHead();
        thead.innerHTML = `
            <tr>
                <th>公司</th>
                <th>开盘</th>
                <th>命中</th>
                <th>命中率</th>
                <th>主队</th>
                <th>让球</th>
                <th>客队</th>
            </tr>
        `;

        // 表体
        const tbody = table.createTBody();
        for (const [name, data] of Object.entries(stats)) {
            const row = tbody.insertRow();

            // 查找当前公司是否存在页面中
            const companyEl = Array.from(document.querySelectorAll('.lst-item')).find(
                el => el.querySelector('.lst-item-company')?.textContent.trim() === name
            );

            // 获取初盘数据（如果有）
            let rates = [];
            if (companyEl) {
                const initialSection = companyEl.querySelector('.f-flex:first-child');
                rates = initialSection?.querySelectorAll('.lst-item-rate') || [];
            }

            // 填充行数据
            row.innerHTML = `
                <td>${name}</td>
                <td>${data.total}</td>
                <td>${data.hits}</td>
                <td>${(data.hits/data.total*100).toFixed(1)}%</td>
                <td>${rates[0]?.textContent || ''}</td>
                <td>${rates[1]?.textContent || ''}</td>
                <td>${rates[2]?.textContent || ''}</td>
            `;

            // 设置颜色（仅当有开盘数据时）
            if (companyEl) {
                const homeCell = row.cells[4];
                const awayCell = row.cells[6];
                const homeVal = parseFloat(homeCell.textContent);
                const awayVal = parseFloat(awayCell.textContent);

                if (!isNaN(homeVal) && !isNaN(awayVal)) {
                    if (homeVal < awayVal) {
                        homeCell.style.backgroundColor = '#cfc';
                        awayCell.style.backgroundColor = '#fcc';
                    } else if (homeVal > awayVal) {
                        homeCell.style.backgroundColor = '#fcc';
                        awayCell.style.backgroundColor = '#cfc';
                    }
                }
            }
        }

        mHd.parentNode.insertBefore(table, mHd);
    } else {
        btn.textContent = '显示';
        document.getElementById('statsTable')?.remove();
    }
}

    // 初始化检查
    checkHash();
    setInterval(checkHash, 2000);
})();