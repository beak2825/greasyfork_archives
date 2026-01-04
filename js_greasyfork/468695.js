// ==UserScript==
// @name         蒲公英
// @description  小红书蒲公英辅助工具
// @namespace    https://gitee.com/strategytechnology/tappermonkey
// @license      MIT
// @version      1.1.0
// @author       Andy Zhou
// @match        https://pgy.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.2/xlsx.mini.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468695/%E8%92%B2%E5%85%AC%E8%8B%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/468695/%E8%92%B2%E5%85%AC%E8%8B%B1.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const baseUrl = 'https://pgy.xiaohongshu.com';
    //当前搜索词
    let searchWord = '';
    //当前词的数据
    let searchWordData = {};
    //博主画像
    let wordKolProfile = {};
    //上游关键词
    let upSearchWords = [];
    //下游关键词
    let downSearchWords = [];

    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            if (this.responseURL.startsWith(`${baseUrl}/api/solar/content_square/searchwords/effectdata/query`)) {
                const result = JSON.parse(this.responseText)
                upSearchWords = result.data?.upSearchWords
                downSearchWords = result.data?.downSearchWords
            } else if (this.responseURL.startsWith(`${baseUrl}/api/solar/content_square/searchWordStatData`)) {
                const result = JSON.parse(this.responseText)
                searchWordData = result.data?.searchWordData
                wordKolProfile = result.data?.wordKolProfile
                searchWord = decodeURIComponent((new RegExp('[?&]searchWord=([^&#]*)')).exec(this.responseURL)[1]);
                if (searchWordData) {
                    addExportButton();
                }
            }
        });
        nativeSend.apply(this, arguments);
    };

    //添加导出按钮
    function addExportButton() {
        const id = 'content-download-button';
        if (document.getElementById(id)) {
            return;
        }
        const parentElement = document.getElementsByClassName('search-header')[0];
        const newElement = document.createElement("button");
        newElement.id = id;
        newElement.style = "margin-left: 10px;margin-right: auto;color: #fff;background-color: #3c66ff;min-height: 32px;padding: 0 16px;border-radius: 4px;";
        newElement.textContent = `导出`
        parentElement.insertBefore(newElement, parentElement.lastChild);
        newElement.addEventListener("click", exportData);
    }

    const headerNames = ["关键词类型", "关键词", "相关性排名", "搜索指数", "关联阅读量", "关联内容量", "分级", "参考搜索指数", "搜索指数差值", "参考阅读量", "阅读量差值"];

    //导出数据
    function exportData() {
        const wb = XLSX.utils.book_new();
        let datas = [];
        datas.push(['当前搜索词', searchWord, 0, parseInt(searchWordData.searchScore), parseInt(searchWordData.readNum), searchWordData.noteNum]);
        for (const row of upSearchWords) {
            datas.push(['上游搜索词', row.searchWord, row.relevanceRank, parseInt(row.searchScore), parseInt(row.readTotalCount), row.noteNum]);
        }
        for (const row of downSearchWords) {
            datas.push(['下游搜索词', row.searchWord, row.relevanceRank, parseInt(row.searchScore), parseInt(row.readTotalCount), row.noteNum]);
        }
        const tmpList = datas.filter(item => item[3] && item[4]).sort((a, b) => b[3] - a[3]).slice(1, -1);
        const originX = parseInt(tmpList.map(item => item[3]).reduce((a, b) => a + b) / tmpList.length);
        const originY = parseInt(tmpList.map(item => item[4]).reduce((a, b) => a + b) / tmpList.length);
        datas.forEach(row => {
            const point = { x: row[3], y: row[4] }
            let level;
            if (point.x >= originX && point.y >= originY) {
                level = "S";
            } else if (point.x >= originX && point.y < originY) {
                level = "A";
            } else if (point.x < originX && point.y >= originY) {
                level = "B";
            } else {
                level = "C";
            }
            row.push(level);
            row.push(originX);
            row.push(point.x - originX);
            row.push(originY);
            row.push(point.y - originY);
        });
        const ws = XLSX.utils.aoa_to_sheet([headerNames, ...datas]);
        XLSX.utils.book_append_sheet(wb, ws, searchWord);
        XLSX.writeFile(wb, `${searchWord}.xlsx`);
    }
})();