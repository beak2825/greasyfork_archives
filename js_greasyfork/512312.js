// ==UserScript==
// @name         白兔大转盘
// @version      1.0
// @author       P
// @icon         https://club.hares.top/favicon.ico
// @description  点击开始按钮后每3秒访问网址以进行抽奖
// @match        https://club.hares.top/lucky-wheel.php
// @license      MIT
// @grant        GM_xmlhttpRequest
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/512312/%E7%99%BD%E5%85%94%E5%A4%A7%E8%BD%AC%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/512312/%E7%99%BD%E5%85%94%E5%A4%A7%E8%BD%AC%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化奖项计数器
    let prizeCounts = {
        '参与奖': 0,
        '六等奖': 0,
        '五等奖': 0,
        '四等奖': 0,
        '三等奖': 0,
        '二等奖': 0,
        '一等奖': 0
    };
    let isDrawing = false; // 是否正在抽奖的标志

    // 创建显示计数的提示框
    const counterBox = document.createElement('div');
    counterBox.style.position = 'fixed';
    counterBox.style.top = '10px';
    counterBox.style.right = '10px';
    counterBox.style.padding = '10px';
    counterBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    counterBox.style.color = 'white';
    counterBox.style.borderRadius = '5px';
    counterBox.style.zIndex = '9999';
    counterBox.style.fontSize = '14px';
    document.body.appendChild(counterBox);

    // 更新提示框内容
    function updateCounterBox() {
        counterBox.innerHTML = '奖项计数:<br>';
        for (const [prize, count] of Object.entries(prizeCounts)) {
            counterBox.innerHTML += `${prize}: ${count}<br>`;
        }
    }

    // 请求抽奖接口并更新奖项计数
    function fetchPrizeData() {
        if (!isDrawing) return;

        const apiUrl = 'https://club.hares.top/api/general?action=wheel';

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer undefined',
                'x-requested-with': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                const rid = data.rid;

                // 根据rid更新奖项计数
                switch (rid) {
                    case 0:
                        prizeCounts['参与奖']++;
                        break;
                    case 6:
                        prizeCounts['六等奖']++;
                        break;
                    case 5:
                        prizeCounts['五等奖']++;
                        break;
                    case 4:
                        prizeCounts['四等奖']++;
                        break;
                    case 3:
                        prizeCounts['三等奖']++;
                        break;
                    case 2:
                        prizeCounts['二等奖']++;
                        break;
                    case 1:
                        prizeCounts['一等奖']++;
                        break;
                    default:
                        console.error('未知的奖项ID:', rid);
                }

                // 更新提示框
                updateCounterBox();
            })
            .catch(error => {
                console.error('请求抽奖接口失败:', error);
            });
    }

    // 创建控制按钮
    const startButton = document.createElement('button');
    startButton.innerHTML = '开始抽奖';
    startButton.style.position = 'fixed';
    startButton.style.top = '350px';
    startButton.style.right = '10px';
    startButton.style.padding = '10px';
    startButton.style.zIndex = '9999';
    startButton.onclick = function() {
        if (!isDrawing) {
            isDrawing = true;
            startButton.innerHTML = '抽奖中...';
        }
    };
    document.body.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.innerHTML = '停止抽奖';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '400px';
    stopButton.style.right = '10px';
    stopButton.style.padding = '10px';
    stopButton.style.zIndex = '9999';
    stopButton.onclick = function() {
        isDrawing = false;
        startButton.innerHTML = '开始抽奖';
    };
    document.body.appendChild(stopButton);

    // 每3秒请求一次抽奖接口
    setInterval(fetchPrizeData, 3000);

})();
