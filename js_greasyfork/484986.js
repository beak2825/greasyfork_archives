// ==UserScript==
// @name         TechPowerUp VGA BIOS 收藏增强器
// @namespace    http://tampermonkey.net/Owwkmidream
// @version      1.1
// @description  在 TechPowerUp 的 VGA BIOS 收藏表格中添加包含功率限制详细信息的额外列，并输出调试信息
// @author       Owwkmidream
// @match        https://www.techpowerup.com/vgabios/?*
// @grant        none
// @license       GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/484986/TechPowerUp%20VGA%20BIOS%20%E6%94%B6%E8%97%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484986/TechPowerUp%20VGA%20BIOS%20%E6%94%B6%E8%97%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数用于向表头添加新列
    function addNewColumnsToHeader(table) {
        const headerRow = table.querySelector('thead > tr');
        const newHeaders = ['目标 (W)', '限制 (W)', '调整范围'];
        newHeaders.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
    }

    // 函数用于向每行添加带有数据的新列
    function addNewColumnsToRows(table, data) {
        const rows = table.querySelectorAll('tbody > tr');
        rows.forEach((row, index) => {
            const detailLink = row.querySelector('a[href*="/vgabios/"]');
            if (detailLink && data[detailLink.href]) {
                const { target, limit, adjRangeMin, adjRangeMax } = data[detailLink.href];
                const newCellsData = [target, limit, `${adjRangeMin}, ${adjRangeMax}`];
                newCellsData.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    row.appendChild(td);
                });
            } else {
                const newCellsData = ['N/A', 'N/A', 'N/A'];
                newCellsData.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    row.appendChild(td);
                });
            }
        });
    }

    // 函数用于获取并处理每个详细页面
    async function fetchAndProcessDetailsPage(url) {
        const response = await fetch(url);
        const pageText = await response.text();
        const powerLimitRegex = /Board power limit\s+Target: ([\d.]+) W\s+Limit: ([\d.]+) W\s+Adj. Range: ([^%]+%)\s*,\s*([^%]+%)/;
        const matches = pageText.match(powerLimitRegex);
        if (matches && matches.length === 5) {
            return {
                target: matches[1],
                limit: matches[2],
                adjRangeMin: matches[3],
                adjRangeMax: matches[4]
            };
        }
        return null;
    }

    // 增强集合页面的主要函数
    async function enhanceCollectionPage() {
        const collectionTable = document.querySelector('.bioslist');
        if (!collectionTable) {
            return;
        }

        addNewColumnsToHeader(collectionTable);

        const detailLinks = [...collectionTable.querySelectorAll('a[href*="/vgabios/"]')];
        const powerLimitDetails = {};

        // 使用 Promise.all 异步获取详细信息
        const fetchPromises = detailLinks.map(link => fetchAndProcessDetailsPage(link.href));
        const detailsResults = await Promise.all(fetchPromises);

        detailsResults.forEach((details, index) => {
            if (details) {
                powerLimitDetails[detailLinks[index].href] = details;
            }
        });

        addNewColumnsToRows(collectionTable, powerLimitDetails);
    }

    // 创建一个新的按钮并添加到表单中
    const runScriptButton = document.createElement('button');
    runScriptButton.textContent = 'Run Script';
    runScriptButton.type = 'button';
    const form = document.querySelector('form[action="/vgabios/"]');
    form.appendChild(runScriptButton);

    // 当按钮被点击时，运行主函数
    runScriptButton.addEventListener('click', enhanceCollectionPage);
})();

