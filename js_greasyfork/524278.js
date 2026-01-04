// ==UserScript==
// @name        网页table标签数据获取
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     1.0.1
// @author      hgz
// @description 获取github中网页元素table的数据
// @icon        https://github.com/favicon.ico
// @noframes    
// @grant       none
// @match       *://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/524278/%E7%BD%91%E9%A1%B5table%E6%A0%87%E7%AD%BE%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524278/%E7%BD%91%E9%A1%B5table%E6%A0%87%E7%AD%BE%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
"use strict";
const getTable=async ()=>{
    const tableEls = document.querySelectorAll('markdown-accessiblity-table table');
    const data = [];
    for (const tableEl of tableEls) {
        const headers = tableEl.querySelectorAll('thead th');
        const headerNames = Array.from(headers).map(header => header.textContent);
        const rows = tableEl.querySelectorAll('tbody tr');
        const jsonArray = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            const rowData = {};
            headerNames.forEach((header, index) => {
                rowData[header] = cells[index].textContent;
            });
            return rowData;
        });
        data.push(jsonArray);
    }
    return data
};
var defUtil = {
    getTable
};
const getVideo_zone = async () => {
    const data = await defUtil.getTable();
    const templateDefineData = {};
    for (let datum of data) {
        templateDefineData[datum[0]['名称']] = [];
        for (let i = 1; i < datum.length - 1; i++) {
            templateDefineData[datum[0]['名称']].push(datum[i]['名称']);
        }
    }
    return templateDefineData
};
var bilibiliAPICollect = {
    getVideo_zone
};
window.addEventListener('load', () => {
    defUtil.getTable().then(data => {
        console.log('github页面table数据', data);
    });
    bilibiliAPICollect.getVideo_zone().then(map => {
        console.log('bilibili-API-collect仓库视频分区数据', map);
    });
});
