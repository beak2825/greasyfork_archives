// ==UserScript==
// @name        测试获取数据
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/498781/%E6%B5%8B%E8%AF%95%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498781/%E6%B5%8B%E8%AF%95%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面中的目标元素
    function getData() {
        // 获取目标元素内容
        const 标注时间 = document.querySelector('.el-descriptions-item:nth-child(4) .el-descriptions-item__content')?.textContent.trim();
        const 工单id = document.querySelector('.el-descriptions-item:nth-child(1) .el-descriptions-item__content')?.textContent.trim();
        const 标注员 = document.querySelector('.g-tips > span')?.textContent.trim();
        const 质检员 = document.querySelector('.el-descriptions-item:nth-child(3) .el-descriptions-item__content')?.textContent.trim();
        const 纠错类型 = document.querySelector('tbody:nth-child(2) .el-descriptions-item__cell:nth-child(8)')?.textContent.trim();
        const 错误原因 = document.querySelector('.el-table_47_column_162_column_164 > .cell')?.textContent.trim();

        return {
            标注时间: 标注时间 || '',
            工单id: 工单id || '',
            标注员: 标注员 || '',
            质检员: 质检员 || '',
            纠错类型: 纠错类型 || '',
            错误原因: 错误原因 || ''
        };
    }

    // 将数据转换为 CSV 格式
    function convertToCSV(data) {
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(header => obj[header]).join(','));

        return [headers.join(','), ...rows].join('\n');
    }

    // 触发 CSV 下载
    function downloadCSV(data) {
        const csvContent = convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 点击下一页按钮
    function goToNextPage() {
        const nextPageButton = document.querySelector('i.el-icon-arrow-right');
        if (nextPageButton) {
            nextPageButton.click();
        } else {
            console.log('找不到下一页按钮');
        }
    }

    // 触发元素
    function triggerElement() {
        const triggerElem = document.querySelector('h4.hl-text');
        if (triggerElem) {
            triggerElem.click();
        } else {
            console.log('找不到触发元素');
        }
    }

    // 主函数
    async function main() {
        let data = [];
        const numPages = 5; // 设置要获取的页数，可以根据需要调整
        for (let i = 0; i < numPages; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 等待页面加载完成
            triggerElement(); // 触发元素
            await new Promise(resolve => setTimeout(resolve, 2000)); // 等待触发完成
            data.push(getData());
            goToNextPage();
        }
        downloadCSV(data);
    }

    // 在页面上添加按钮以触发数据提取和下载
    function addButton() {
        const button = document.createElement('button');
        button.textContent = '导出数据';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.onclick = () => {
            main();
        };

        document.body.appendChild(button);
    }

    // 初始化
    function init() {
        addButton();
    }

    // 等待页面加载完成后执行初始化
    window.addEventListener('load', init);
})();