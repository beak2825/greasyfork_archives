// ==UserScript==
// @name         [MWI]Guild Members Table Sorting
// @name:zh-CN   [银河奶牛]公会成员表格排序
// @namespace    https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-guid-members-table-sorting
// @version      1.0.6
// @description  Add sorting functionality to the guild members table in Milky Way Idle game
// @description:zh-CN  为银河放置游戏的公会成员表格添加排序功能
// @author       shenhuanjie
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @homepage     https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-guid-members-table-sorting
// @supportURL   https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-guid-members-table-sorting/-/issues
// @downloadURL https://update.greasyfork.org/scripts/535219/%5BMWI%5DGuild%20Members%20Table%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/535219/%5BMWI%5DGuild%20Members%20Table%20Sorting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断用户语言环境
    const isChinese = navigator.language.includes('zh');

    const messages = {
        zh: {
            scriptStarted: '公会成员表格排序脚本已启动',
            tableNotFound: '未找到公会成员表格，等待用户点击重试',
            tableFound: '已找到公会成员表格，开始绑定排序功能',
            headerClicked: '第 {column} 列表头被点击，当前点击次数: {count}',
            resetSort: '第 {column} 列表头第三次被点击，重置表格排序',
            sortDirectionChanged: '第 {column} 列的排序方向切换为: {direction}',
            sortCompleted: '第 {column} 列排序完成',
            styleAdded: '已添加必要表格样式',
            hideButton: '已隐藏转让会长按钮'
        },
        en: {
            scriptStarted: 'Guild members table sorting script has been started',
            tableNotFound: 'Guild members table not found. Waiting for user click to retry',
            tableFound: 'Guild members table found. Starting to bind sorting function',
            headerClicked: 'The header of column {column} has been clicked. Current click count: {count}',
            resetSort: 'The header of column {column} has been clicked for the third time. Resetting table sorting',
            sortDirectionChanged: 'The sorting direction of column {column} has been changed to: {direction}',
            sortCompleted: 'Sorting of column {column} is completed',
            styleAdded: 'Necessary table styles have been added',
            hideButton: 'The "Transfer Guild Master" button has been hidden'
        }
    };

    function getMessage(key, replacements = {}) {
        const lang = isChinese? 'zh' : 'en';
        let message = messages[lang][key];
        for (const [placeholder, value] of Object.entries(replacements)) {
            message = message.replace(`{${placeholder}}`, value);
        }
        return message;
    }

    console.log(getMessage('scriptStarted'));

    let table = null;
    let hideTransferBtn = null;
    function initTableSort() {
        // 使用属性选择器进行模糊匹配
        table = document.querySelector('[class^="GuildPanel_membersTable__"]');
        if (!table) {
            // console.log(getMessage('tableNotFound'));
            return;
        }
        console.log(getMessage('tableFound'));

        const headers = table.querySelectorAll('th');
        let sortDirections = Array(headers.length).fill(null);
        let clickCounts = Array(headers.length).fill(0);
        const initialRows = Array.from(table.querySelectorAll('tbody tr'));

        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                clickCounts[index]++;
                // console.log(getMessage('headerClicked', { column: index + 1, count: clickCounts[index] }));

                if (clickCounts[index] === 3) {
                    // console.log(getMessage('resetSort', { column: index + 1 }));
                    const tbody = table.querySelector('tbody');
                    initialRows.forEach(row => tbody.appendChild(row));
                    headers.forEach(h => {
                        h.classList.remove('asc', 'desc');
                    });
                    sortDirections[index] = null;
                    clickCounts[index] = 0;
                    return;
                }

                const rows = Array.from(table.querySelectorAll('tbody tr'));

                if (sortDirections[index] === 'asc') {
                    sortDirections[index] = 'desc';
                } else {
                    sortDirections[index] = 'asc';
                }
                // console.log(getMessage('sortDirectionChanged', { column: index + 1, direction: sortDirections[index] }));

                headers.forEach(h => {
                    h.classList.remove('asc', 'desc');
                });

                if (sortDirections[index] === 'asc') {
                    header.classList.add('asc');
                } else {
                    header.classList.add('desc');
                }

                rows.sort((a, b) => {
                    const keyA = getCellValue(a, index);
                    const keyB = getCellValue(b, index);

                    let comparison;
                    if (typeof keyA === 'number' && typeof keyB === 'number') {
                        comparison = keyA - keyB;
                    } else if (typeof keyA ==='string' && typeof keyB ==='string') {
                        comparison = keyA.localeCompare(keyB);
                    } else if (keyA instanceof SVGElement && keyB instanceof SVGElement) {
                        const useA = keyA.querySelector('use');
                        const useB = keyB.querySelector('use');
                        const hrefA = useA? useA.getAttribute('href') : '';
                        const hrefB = useB? useB.getAttribute('href') : '';
                        comparison = hrefA.localeCompare(hrefB);
                    } else {
                        comparison = 0;
                    }

                    return sortDirections[index] === 'asc'? comparison : -comparison;
                });

                const tbody = table.querySelector('tbody');
                rows.forEach(row => tbody.appendChild(row));
                // console.log(getMessage('sortCompleted', { column: index + 1 }));
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            th {
                cursor: pointer;
            }
            th.asc::after {
                content: ' ↑';
            }
            th.desc::after {
                content: ' ↓';
            }
        `;
        document.head.appendChild(style);
        console.log(getMessage('styleAdded'));
    }

    initTableSort();

    if (!table) {
        document.addEventListener('click', function clickHandler() {
            initTableSort();
            if (table) {
                document.removeEventListener('click', clickHandler);
            }
        });
    }

    if(!hideTransferBtn){
        document.addEventListener('click', function clickHandler() {
            // 隐藏转让会长按钮
            const actionButtonDivs = document.querySelectorAll('[class^="GuildPanel_actionButtons__"]');
            actionButtonDivs.forEach(div => {
                const buttons = div.querySelectorAll('button');
                buttons.forEach(button => {
                    const targetText = isChinese? '转让会长' : 'Transfer Guild Master';
                    if (button.textContent.trim() === targetText) {
                        button.style.display = 'none';
                        console.log(getMessage('hideButton'));
                        hideTransferBtn = true;
                    }
                });
            });
        });
    }

    function getCellValue(row, index) {
        const cell = row.querySelectorAll('td')[index];
        const svg = cell.querySelector('svg');
        if (svg) {
            return svg;
        }
        const text = cell.textContent.trim();
        const num = parseFloat(text);
        return isNaN(num)? text : num;
    }
})();