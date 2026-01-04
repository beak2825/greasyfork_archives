// ==UserScript==
// @name         武汉理工大学教务系统成绩修改
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  修改武汉理工大学教务系统查询到的成绩信息，骗骗兄弟就行了别把自己骗了喵
// @author       ETO
// @match        https://jwxt.whut.edu.cn/jwapp/sys/homeapp/home/index.html*
// @match        https://jwxt.whut.edu.cn/jwapp/sys/cjcx/*
// @match        https://jwxt.whut.edu.cn/jwapp/sys/cjgl/*
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541489/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/541489/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义目标 title 列表
    const targetTitles = ['2024-2025-2'];

    // 定义一个函数，用于修改成绩显示
    function modifyGrades() {
        // 首先检查特定元素的 title 是否符合要求
        const titleElement = document.querySelector(
            '#root > div > div > div.tabPagesRoot___3EQoJ.tabPages___3232i > div.tabPanelRoot___MzXA2 > div > div > div.container___1qOJG > div > div.leftPart___2bI2f > div.container___3Vw9C > div.titleContainer___FcNGA > div.extraSelect___1zZvu > div > div > span.ant-select-selection-item'
        );
        let targetTitle = null;
        if (titleElement) {
            targetTitle = titleElement.getAttribute('title');
            if (!targetTitles.includes(targetTitle)) {
                targetTitle = null; // 如果 title 不符合要求，设置为 null
            }
        }

        // 查找所有符合选择器路径的元素
        const gradeElements = document.querySelectorAll(
            '#root > div > div > div.tabPagesRoot___3EQoJ.tabPages___3232i > div.tabPanelRoot___MzXA2 > div > div > div.container___1qOJG > div > div.leftPart___2bI2f > div.container___3Vw9C > div.tabContentContainer___151Dp > div > div > div > div > div > div.main___1likm > div.bigLine___G9eW9'
        );

        // 遍历找到的元素并修改文本内容
        gradeElements.forEach(element => {
            const text = element.textContent;
            // 检查 targetTitle 是否符合要求，并且文本不是“成绩: 100”
            if (targetTitle && text !== '成绩: 100') {
                element.textContent = '成绩: 100';
            }
        });

        // 定义要处理的表格ID列表
        const tableIds = ['#pinnedtabledqxq-index-table', '#tabledqxq-index-table'];
        tableIds.forEach(tableId => {
            // 查找表格并修改特定单元格
            if (!window[tableId.replace('#', '') + 'Found']) {
                let table = document.querySelector(tableId);
                if (table) {
                    window[tableId.replace('#', '') + 'Found'] = true;
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        const rows = tbody.querySelectorAll('tr');
                        rows.forEach(row => {
                            // 检查目标title是否符合要求
                            const targetTd = row.querySelector('td:nth-child(3) > span');
                            if (targetTd) {
                                const title = targetTd.getAttribute('title');
                                if (targetTitles.includes(title)) {
                                    const totalScoreTd = row.querySelector('td:nth-child(2) > div > span');
                                    if (totalScoreTd) {
                                        totalScoreTd.textContent = '100';
                                    }
                                    const firstPassScoreTd = row.querySelector('td:nth-child(6) > span');
                                    if (firstPassScoreTd) {
                                        firstPassScoreTd.textContent = '100';
                                    }
                                    const gpaTd = row.querySelector('td:nth-child(15) > div > span');
                                    if (gpaTd) {
                                        gpaTd.textContent = '5';
                                    }
                                    const truePassTd = row.querySelector('td:nth-child(20) > span');
                                    if (truePassTd) {
                                        truePassTd.textContent = '是';
                                    }
                                }
                            }

                            // 修改td:nth-child(1)中的链接样式
                            const detailsTd = row.querySelector('td:nth-child(1) a.j-row-edit');
                            if (detailsTd) {
                                detailsTd.style.color = '#2196F3';
                                detailsTd.style.cursor = 'pointer';
                                detailsTd.disabled = false;
                            }
                        });
                    } else {
                        console.log(`未找到表格的tbody: ${tableId}`);
                    }
                } else {
                    console.log(`未找到表格: ${tableId}`);
                }
            }
        });

        // 定义要处理的新表格ID列表
        const newTableIds = ['#pinnedtablexqgpajs-index-table', '#tablexqgpajs-index-table'];
        newTableIds.forEach(tableId => {
            // 查找表格并修改特定单元格
            if (!window[tableId.replace('#', '') + 'Found']) {
                let table = document.querySelector(tableId);
                if (table) {
                    window[tableId.replace('#', '') + 'Found'] = true;
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        const rows = tbody.querySelectorAll('tr');
                        rows.forEach(row => {
                            // 检查目标title是否符合要求
                            const targetTitleTd = row.querySelector('td:nth-child(2) > span');
                            if (targetTitleTd) {
                                const title = targetTitleTd.textContent;
                                if (targetTitles.includes(title)) {
                                    const colsToModify = [13, 16, 19];
                                    colsToModify.forEach(colIndex => {
                                        const colTd = row.querySelector(`td:nth-child(${colIndex}) > span`);
                                        if (colTd) {
                                            colTd.textContent = '5.000';
                                        }
                                    });
                                    const colsToModifyToOne = [14, 15, 17, 18, 20, 21];
                                    colsToModifyToOne.forEach(colIndex => {
                                        const colTd = row.querySelector(`td:nth-child(${colIndex}) > span`);
                                        if (colTd) {
                                            colTd.textContent = '1';
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        console.log(`未找到表格的tbody: ${tableId}`);
                    }
                } else {
                    console.log(`未找到表格: ${tableId}`);
                }
            }
        });
    }

    // 立即执行一次，处理已经加载的元素
    modifyGrades();

    // 设置一个定时器，每秒检查一次新加载的元素
    setInterval(modifyGrades, 1000);

    // 监听 MutationObserver，当DOM发生变化时执行修改
    const observer = new MutationObserver(modifyGrades);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();