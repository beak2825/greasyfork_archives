// ==UserScript==
// @name         BetsAPIodds
// @namespace    http://dol.freevar.com/
// @version      0.1
// @description  将所有跳转到比赛页面的链接替换成365盘口走势链接，显示365每一个盘口的持续时间和升跌，移除所有滚球走势。
// @author       Dolphin
// @run-at       document-idle
// @match        https://cn.betsapi.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535115/BetsAPIodds.user.js
// @updateURL https://update.greasyfork.org/scripts/535115/BetsAPIodds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function processTables() {
        const tables = document.querySelectorAll('table.table-sm');
        tables.forEach((table, tableIndex) => {
            // 移除第一个单元格不为空的行
            Array.from(table.querySelectorAll('tr')).forEach(tr => {
                const firstTd = tr.querySelector('td:first-child');
                if (firstTd && firstTd.textContent.trim() !== '') tr.remove();
            });

            // 处理时间差
            const trs = Array.from(table.querySelectorAll('tr'));
            for (let i = 0; i < trs.length - 1; i++) {
                const currentTr = trs[i];
                const nextTr = trs[i + 1];
                const currentDt = currentTr.querySelector('[data-dt]').dataset.dt;
                const nextDt = nextTr.querySelector('[data-dt]').dataset.dt;

                const diffMs = new Date(currentDt) - new Date(nextDt);
                const days = Math.floor(diffMs / 864e5);
                const hours = Math.floor((diffMs % 864e5) / 36e5);
                const minutes = Math.round((diffMs % 36e5) / 6e4);

                let timeStr = [];
                if (days > 0) timeStr.push(`${days}日`);
                if (hours > 0 || days > 0) timeStr.push(`${hours}时`);
                timeStr.push(`${minutes}分`);

                nextTr.querySelector('td:nth-child(2)').textContent = timeStr.join('');
            }

            // 处理第二个表格的颜色
            if (tableIndex === 1) {
                const colorTrs = Array.from(table.querySelectorAll('tr'));
                for (let i = 0; i < colorTrs.length - 1; i++) {
                    const currentTr = colorTrs[i];
                    const nextTr = colorTrs[i + 1];
                    const currentTd3 = currentTr.children[2];
                    const nextTd3 = nextTr.children[2];
                    const currentTd5 = currentTr.children[4];
                    const nextTd5 = nextTr.children[4];

                    // 处理第三列
                    const val3 = parseFloat(currentTd3.textContent);
                    const nextVal3 = parseFloat(nextTd3.textContent);
                    if (val3 > nextVal3) currentTd3.style.backgroundColor = '#fcc';
                    else if (val3 < nextVal3) currentTd3.style.backgroundColor = '#cfc';

                    // 处理第五列
                    const val5 = parseFloat(currentTd5.textContent);
                    const nextVal5 = parseFloat(nextTd5.textContent);
                    if (val5 > nextVal5) currentTd5.style.backgroundColor = '#fcc';
                    else if (val5 < nextVal5) currentTd5.style.backgroundColor = '#cfc';
                }
            }
        });
    }

    if (location.pathname.includes('/rs/bet365/'))processTables();

    if (location.pathname.includes('/ciz/soccer') || location.pathname.includes('/ce/soccer') || location.pathname.includes('/cs/soccer') || location.pathname.includes('/l/')) {
        const links = document.getElementsByTagName('a');
        // 遍历每个a标签
        for (let link of links) {
            let href = link.getAttribute('href');
            // 检查href是否存在且以'/r/'开头
            if (href && href.startsWith('/r/')) {
                // 替换路径中的'/r/'为'/rs/bet365/'
                const newHref = href.replace('/r/', '/rs/bet365/');
                link.setAttribute('href', newHref);
            }
        }
    }
})();