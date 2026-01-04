// ==UserScript==
// @name         朱雀自动转盘抽奖及统计
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  实现朱雀的抽奖功能，自动获取CSRF Token与Cookie，并显示抽奖结果，支持进度显示和停止功能，抽奖之后可以一键出售道具和上传
// @author       banner
// @match        https://zhuque.in/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527838/%E6%9C%B1%E9%9B%80%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%9B%98%E6%8A%BD%E5%A5%96%E5%8F%8A%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/527838/%E6%9C%B1%E9%9B%80%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%9B%98%E6%8A%BD%E5%A5%96%E5%8F%8A%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义奖品信息和对应价值
    const prizeMap = {
        "1": { "Name": "一等奖: 改名卡", "Value": 240000 },
        "2": { "Name": "二等奖: 神佑(VIP) 7 天卡", "Value": 80000 },
        "3": { "Name": "三等奖: 邀请卡", "Value": 64000 },
        "4": { "Name": "四等奖: 自动释放技能道具卡 7 天卡", "Value": 24000 },
        "5": { "Name": "五等奖: 上传 20 GiB", "Value": 2280 },
        "6": { "Name": "六等奖: 上传 10 GiB", "Value": 1140 },
        "7": { "Name": "未中奖", "Value": 0 }
    };

    // 全局状态变量
    let isRunning = false;
    let stopRequested = false;
    let totalCost = 0;
    let totalValue = 0;
    let prizeSummary = {};
    let totalUpload = 0;  // 记录上传的总量

    // 初始化奖品统计
    function resetStats() {
        totalCost = 0;
        totalValue = 0;
        totalUpload = 0;
        prizeSummary = {};
        Object.keys(prizeMap).forEach(prizeId => {
            prizeSummary[prizeId] = { "Count": 0, "TotalValue": 0 };
        });
    }

    // 创建UI界面
    function createUI() {
        setTimeout(() => {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.backgroundColor = '#fff';
            container.style.padding = '20px';
            container.style.border = '1px solid #ccc';
            container.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.1)';
            container.style.zIndex = '9999';

            const title = document.createElement('h3');
            title.textContent = '抽奖统计';
            container.appendChild(title);

            // 输入区域
            const inputContainer = document.createElement('div');
            inputContainer.style.margin = '10px 0';

            // 抽奖次数输入
            const timesDiv = document.createElement('div');
            timesDiv.style.marginBottom = '10px';
            timesDiv.innerHTML = '<label>抽奖次数: </label><input type="number" value="60" min="1" style="width: 80px;">';
            inputContainer.appendChild(timesDiv);

            // 间隔时间输入
            const intervalDiv = document.createElement('div');
            intervalDiv.style.marginBottom = '10px';
            intervalDiv.innerHTML = '<label>间隔(ms): </label><input type="number" value="300" min="0" style="width: 80px;">';
            inputContainer.appendChild(intervalDiv);

            container.appendChild(inputContainer);

            // 控制按钮
            const button = document.createElement('button');
            button.textContent = '开始抽奖';
            button.style.margin = '10px 0';
            container.appendChild(button);

            // 结果显示区域
            const resultContainer = document.createElement('div');
            resultContainer.style.marginTop = '20px';
            resultContainer.style.borderTop = '1px solid #ccc';
            resultContainer.style.paddingTop = '10px';
            container.appendChild(resultContainer);

            document.body.appendChild(container);

            // 事件监听
            button.addEventListener('click', async () => {
                if (isRunning) {
                    stopRequested = true;
                    return;
                }

                const timesInput = timesDiv.querySelector('input');
                const intervalInput = intervalDiv.querySelector('input');

                const requestTimes = parseInt(timesInput.value) || 10;
                const interval = parseInt(intervalInput.value) || 1000;

                if (requestTimes < 1) {
                    alert('抽奖次数至少为1次');
                    return;
                }

                if (interval < 300) {
                    alert('为了避免给站点服务器带来较大负荷，不建议300ms一下的间隔，建议将间隔时长调制500ms以上');
                    return;
                }

                isRunning = true;
                stopRequested = false;
                button.textContent = '停止抽奖';
                resetStats();

                resultContainer.innerHTML = `
                    <div class="status">准备中...</div>
                    <div class="progress">当前进度: 0/${requestTimes}</div>
                    <div class="results"></div>
                    <button class="sellButton" style="display: none;">一键出售</button>
                `;

                try {
                    for (let i = 1; i <= requestTimes; i++) {
                        if (stopRequested) break;

                        await sendRequest();
                        await new Promise(r => setTimeout(r, interval));

                        // 更新进度显示
                        resultContainer.querySelector('.progress').textContent =
                            `当前进度: ${i}/${requestTimes}`;
                    }
                } finally {
                    isRunning = false;
                    button.textContent = '开始抽奖';
                    updateResults(resultContainer);

                    // 显示出售按钮
                    const sellButton = resultContainer.querySelector('.sellButton');
                    sellButton.style.display = 'inline-block';

                    // 销售按钮点击事件
                    sellButton.addEventListener('click', async () => {
                        await handleSellRequest(); // 执行出售请求
                    });
                }
            });
        }, 1000);  // 延迟1秒执行UI创建
    }

    // 发送抽奖请求
    async function sendRequest() {
        try {
            const response = await fetch("https://zhuque.in/api/gaming/spinThePrizeWheel", {
                method: "POST",
                headers: {
                    "X-Csrf-Token": document.querySelector('meta[name="x-csrf-token"]').content,
                    "Cookie": document.cookie
                }
            });

            if (response.ok) {
                const data = await response.json();
                const prizeId = String(data.data.prize);

                if (prizeMap[prizeId]) {
                    prizeSummary[prizeId].Count++;
                    prizeSummary[prizeId].TotalValue += prizeMap[prizeId].Value;
                    totalCost += 1500;
                    totalValue += prizeMap[prizeId].Value;

                    // 处理上传量
                    if (prizeId === "5") {
                        totalUpload += 20;  // 上传20 GiB
                    } else if (prizeId === "6") {
                        totalUpload += 10;  // 上传10 GiB
                    }
                }
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    // 更新结果展示
    function updateResults(container) {
        let html = '<h4>抽奖结果:</h4>';

        // 按价值降序排列
        const sorted = Object.entries(prizeMap)
            .sort((a, b) => b[1].Value - a[1].Value)
            .forEach(([id, prize]) => {
                const count = prizeSummary[id].Count;
                html += `${prize.Name}: ${count}次 (价值 ${prizeSummary[id].TotalValue}灵石)<br>`;
            });

        html += `<br>总消耗: ${totalCost}灵石<br>`;
        html += `总价值: ${totalValue}灵石<br>`;
        html += `<b>净${totalValue >= totalCost ? '盈利' : '亏损'}: ${Math.abs(totalValue - totalCost)}灵石</b>`;

        container.querySelector('.results').innerHTML = html;
    }

    // 处理出售请求（包括回收与出售上传量）
    async function handleSellRequest() {
        let allRecycleSuccess = true;  // 标记是否所有回收操作都成功

        // 首先回收道具：ID 1, 2, 3, 4
        for (let id = 1; id <= 4; id++) {
            const prizeCount = prizeSummary[id] ? prizeSummary[id].Count : 0;
            if (prizeCount > 0) {
                // 回收每个道具的数量
                const recycleSuccess = await recycleMagicCard(id, prizeCount);
                if (!recycleSuccess) {
                    allRecycleSuccess = false;  // 如果有回收失败，标记为失败
                }
            }
        }



        // 然后出售上传量：仅处理 ID 为 5 和 6 的上传量
        if (totalUpload > 0) {
            // 计算出售的总上传量，按 GiB 出售
            const totalBonus = 127 * totalUpload; // 每 GiB 127 灵石
            const response = await fetch("https://zhuque.in/api/transaction/create", {
                method: "POST",
                headers: {
                    "X-Csrf-Token": document.querySelector('meta[name="x-csrf-token"]').content,
                    "Cookie": document.cookie,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: 2,
                    unit: "GiB",
                    bonus: totalBonus,
                    upload: totalUpload
                })
            });

            if (response.ok) {
                console.log(`成功提交，交易上传 ${totalUpload} GiB，预计获得 ${totalUpload * 127} 灵石`);
            } else {
                const errorText = await response.text();  // 获取错误信息
                console.log(`出售失败: ${errorText}`);
                allRecycleSuccess = false;  // 如果有回收失败，标记为失败
            }
        } else {
            console.log('没有上传量可出售');
        }

        // 如果所有道具回收成功，提示用户
        if (allRecycleSuccess) {
            console.log('所有道具回收成功!');
            alert('所有道具回收成功!');
        } else {
            alert('道具回收失败，错误详情查看控制台')
        }
    }

    // 回收道具：ID 1, 2, 3, 4
    async function recycleMagicCard(id, count) {
        let success = true;  // 标记是否回收成功

        // 回收多个道具的情况，循环回收 `count` 次
        for (let i = 0; i < count; i++) {
            const response = await fetch("https://zhuque.in/api/mall/recycleMagicCard", {
                method: "POST",
                headers: {
                    "X-Csrf-Token": document.querySelector('meta[name="x-csrf-token"]').content,
                    "Cookie": document.cookie,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            });

            if (response.ok) {
                console.log(`道具 ID ${id} 第 ${i + 1} 次回收成功!`);
            } else {
                const errorText = await response.text();
                console.log(`回收失败: ${errorText}`);
                success = false;  // 如果有任何失败，标记为失败
            }

            // 添加 100ms 的延迟
            await new Promise(r => setTimeout(r, 100));
        }

        return success;  // 返回回收是否成功
    }


    // 初始化
    resetStats();
    createUI();
})();
