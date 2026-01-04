// ==UserScript==
// @name         Bilibili Lottery Tracker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Track lottery results from Bilibili and display them on the webpage.
// @author       Your Name
// @match        https://www.bilibili.com/blackboard/era*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512089/Bilibili%20Lottery%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/512089/Bilibili%20Lottery%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //清空存储数据 localStorage.clear();
    // 假设我们有一个二维数组来模拟表格,读取旧信息
    let dataTable = JSON.parse(localStorage.getItem('lotteryResults')) || [];
    console.log("dataTable0:", dataTable)
    const maxLengths = [25, 20, 20];
    // 计算每一列的最大宽度
    //dataTable.forEach(row => {
    //    row.forEach((item, index) => {
    //        maxLengths[index] = Math.max(maxLengths[index], item.toString().length);
    //    });
    //console.log("maxLengths:", maxLengths)
    //});
    // 创建一个元素来显示结果
    function createDisplayElement() {
        const pre = document.createElement('pre');
        pre.id = 'lottery-results';
        pre.style.position = 'fixed';
        pre.style.bottom = '10px';
        pre.style.right = '10px';
        pre.style.backgroundColor = '#fff';
        pre.style.padding = '10px';
        pre.style.border = '1px solid #ccc';
        pre.style.zIndex = '9999';
        pre.style.fontFamily = 'Arial, sans-serif'; // 设置字体
        pre.style.fontSize = '14px'; // 设置字体大小
        document.body.appendChild(pre);

        // 添加输入框和按钮
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'fixed';
        inputContainer.style.bottom = '40px';
        inputContainer.style.left = '10px';
        inputContainer.style.zIndex = '9999';
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.fontSize = '14px'; // 设置字体大小

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = localStorage.getItem('refreshInterval') || '2';
        intervalInput.placeholder = '刷新间隔（分钟）';
        intervalInput.style.width = '40px';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.onclick = () => {
            const interval = parseInt(intervalInput.value);
            localStorage.setItem('refreshInterval', interval);
            alert('刷新间隔已保存为 ' + interval + ' 分钟');
        };

        inputContainer.appendChild(intervalInput);
        inputContainer.appendChild(saveButton);
        document.body.appendChild(inputContainer);
    }

    // 提取并显示结果
    function extractAndDisplayResults() {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const records = document.querySelectorAll('.c1 .record');
                for (let i = records.length - 1; i >= 0; i--) {
                    const record = records[i];
                    // 使用记录的文本内容作为唯一标识符
                    const recordText = record.textContent;
                    const normalizedStr = recordText.toString().replace(/\s+/g, '');// 移除首尾空白字符，并将中间多余的空白字符缩减为单个空格
                    const part = normalizedStr.split("通过抽奖获得了");
                    const part1 = normalizedStr.split(",");
                    const userName = part[0];
                    const prize = part[1];
                    const timeString = new Date().toLocaleString('chinese',{ hour12: false });
                    let found = dataTable.some(row => row[0] === prize && row[1] === userName);
                    if(!found){
                        dataTable.push([prize, userName, timeString]); // 将数据添加到表格中
                        }
                }
                console.log("dataTable1:", dataTable)
                localStorage.setItem('lotteryResults', JSON.stringify(dataTable));
                checkForSpecialPrize(dataTable); // 检查是否有特殊奖品
                updateDisplay(dataTable);
            }, 5000); // 等待5秒后再执行
        });
    }

    // 更新显示的结果
    function updateDisplay(dataTable) {
        const display = document.getElementById('lottery-results');
        let displayText = `Datalength: ${dataTable.length}, Last Updated: ${new Date().toLocaleString('chinese',{hour12: false})}\n`;
        // 使用制表符分隔每列，并填充字符串以对齐
        dataTable.forEach(row => {
            let formattedRow = '';
            row.forEach((item, index) => {
                const paddingLength = 2 * (maxLengths[index] - item.toString().length);
                formattedRow += item.toString().padEnd(paddingLength); // + '\t';
            });
            displayText += formattedRow.trimEnd() + '\n'; // 去除最后一个制表符，并添加额外的换行符
        });
        display.textContent = displayText;
    }

    // 检查是否有特殊奖品
    function checkForSpecialPrize(dataTable) {
        if (dataTable.length > 10) {
            const lastRow = dataTable[dataTable.length - 1];
            const specialPrizes = ["冰箱贴", "角色立牌", "邦布抱枕", "菲林", "iPhone15", "主机", "MacBookAir"];
            if (specialPrizes.some(prize => lastRow[1].includes(prize))) {
                alert(`注意！最后一条记录包含特殊奖品: ${lastRow[1]}`);
            }
        }
    }

    // 初始化脚本
    function init() {
        createDisplayElement();
        extractAndDisplayResults();
        // 获取上次保存的刷新间隔
        const refreshInterval = localStorage.getItem('refreshInterval') || 2;
        setTimeout(function(){
            location.reload(); //更新网页
        }, refreshInterval * 60 * 1000); // 每2分钟执行一次
    }

    // 启动
    init();
})();