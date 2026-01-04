// ==UserScript==
// @name         时魔计算 仅限学校
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  计算每个种子每小时魔力值 Updated by 雅哲
// @author       雅哲
// @match        https://pt.btschool.club/torrents.php*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/536312/%E6%97%B6%E9%AD%94%E8%AE%A1%E7%AE%97%20%E4%BB%85%E9%99%90%E5%AD%A6%E6%A0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/536312/%E6%97%B6%E9%AD%94%E8%AE%A1%E7%AE%97%20%E4%BB%85%E9%99%90%E5%AD%A6%E6%A0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const T0 = 200, N0 = 7, B0 = 100, L = 1000;
    let sortAsc = false;

    function estimateA(Ti, Si, Ni) {
        const ageF = 1 - Math.pow(10, -Ti / T0);
        const popF = 1 + Math.sqrt(2) * Math.pow(10, -(Ni - 1) / (N0 - 1));
        return ageF * Si * popF;
    }
    function parseWeeks(dateStr) {
        const now = new Date();
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            const d = new Date(dateStr.replace(/-/g,'/'));
            return (now - d) / (1000*60*60*24*7);
        }
        const zh = dateStr.match(/(\d{2})年\D*(\d{1,2})月/);
        if (zh) {
            const y = +zh[1] + 2000, m = +zh[2] - 1;
            return (now - new Date(y,m,1)) / (1000*60*60*24*7);
        }
        return 0.01;
    }
    function parseSize(s) {
        const m = s.match(/([\d.]+)\s*(GB|MB|TB)/i);
        if (!m) return 0;
        let v = +m[1], u = m[2].toUpperCase();
        if (u==='TB') v*=1024;
        else if (u==='MB') v/=1024;
        return v;
    }
    function sortByColumn(idx) {
        const tbody = document.querySelector('table.torrents>tbody');
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(2); // 跳过表头+汇总行
        rows.sort((a,b) => {
            const va = parseFloat(a.children[idx].innerText)||0;
            const vb = parseFloat(b.children[idx].innerText)||0;
            return sortAsc ? va - vb : vb - va;
        });
        rows.forEach(r=>tbody.appendChild(r));
        sortAsc = !sortAsc;
    }

    function enhance() {
        const tbody = document.querySelector('table.torrents>tbody');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        if (rows.length < 2) return;

        const header = rows[0];
        if (!header.querySelector('.bi-header')) {
            const th = document.createElement('td');
            th.className = 'colhead bi-header';
            th.textContent = '每小时魔力值';
            th.style.cursor = 'pointer';
            const idx = header.children.length;
            th.addEventListener('click', () => sortByColumn(idx));
            header.appendChild(th);
        }

        if (!tbody.querySelector('.summary-row')) {
            const sumRow = document.createElement('tr');
            sumRow.className = 'summary-row';
            const cell = document.createElement('td');
            cell.colSpan = header.children.length;
            cell.style.padding = '6px';
            cell.style.background = '#eef';
            // 先占位，稍后填值
            cell.innerHTML = '汇总计算中...';
            sumRow.appendChild(cell);
            tbody.insertBefore(sumRow, rows[1]);
        }

        let totalSize = 0;      // GB
        let totalBi = 0;        // 每小时总魔力
        for (let i = 2; i < rows.length; i++) {
            const cells = rows[i].children;
            if (cells.length < 6) continue;

            // 1. 发布时间
            let ds = '';
            const sp = cells[3].querySelector('span[title]');
            if (sp) ds = sp.title;
            else ds = cells[3].innerText.replace(/\s|<br.*?>/g,'');

            const Ti = parseWeeks(ds);
            // 2. 文件大小
            const Si = parseSize(cells[4].innerText.trim());
            totalSize += Si;
            // 3. 做种人数
            const Ni = parseInt(cells[5].innerText.trim(),10) || 1;

            // 4. 计算 A_i、Bi
            const Ai = estimateA(Ti, Si, Ni);
            const Bi = B0 * 2/Math.PI * Math.atan(Ai / L);
            totalBi += Bi;

            // 5. 显示 Bi
            // 如果已存在则跳过
            if (!cells[cells.length-1].classList.contains('bi-cell')) {
                const td = document.createElement('td');
                td.className = 'bi-cell';
                td.textContent = Bi.toFixed(2);
                td.style.textAlign = 'right';
                td.style.fontWeight = 'bold';
                td.style.color = Bi >= 1 ? 'green' : 'gray';
                rows[i].appendChild(td);
            }
        }

        const summaryCell = tbody.querySelector('.summary-row td');
        const magic1h = totalBi;
        const magic24h = magic1h * 24;
        const magic30d = magic24h * 30;
        summaryCell.innerHTML =
            `<b>本页总大小：</b>${totalSize.toFixed(2)} GB &nbsp;&nbsp;`+
            `<b>每小时总魔力：</b>${magic1h.toFixed(2)} &nbsp;&nbsp;`+
            `<b>24 小时：</b>${magic24h.toFixed(2)} &nbsp;&nbsp;`+
            `<b>30 天：</b>${magic30d.toFixed(2)}`;
    }

    window.addEventListener('load', () => setTimeout(enhance, 800));
})();
