// ==UserScript==
// @name         幸运大转盘盘自动抽奖工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动点击大转盘抽奖，可设置抽到特定物品多少次后暂停
// @author       saitenasuk
// @match        https://hhanclub.top/lucky.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545947/%E5%B9%B8%E8%BF%90%E5%A4%A7%E8%BD%AC%E7%9B%98%E7%9B%98%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545947/%E5%B9%B8%E8%BF%90%E5%A4%A7%E8%BD%AC%E7%9B%98%E7%9B%98%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抽奖结果列表，用户可以在这里添加可能的结果
    const prizeList = [
        "魔力 100",
        "魔力 1000",
        "魔力 2000",
        "魔力 5000",
        "魔力 500000",
        "补签卡 1",
        "上传量 2 GB",
        "上传量 5 GB",
        "彩虹 ID 7 Day(s)",
        "VIP 7 Day(s)",
        "邀请 1"
    ];

    // 创建控制界面
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.left = '20px';
        panel.style.zIndex = '99999';
        panel.style.backgroundColor = 'white';
        panel.style.padding = '15px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        panel.style.fontFamily = 'Arial, sans-serif';

        panel.innerHTML = `
            <h3 style="margin-top:0;">自动抽奖控制器</h3>
            <div style="margin-bottom:10px;">
                <label for="targetPrize">目标物品:</label>
                <select id="targetPrize" style="margin-left:5px;padding:3px;">
                    ${prizeList.map(prize => `<option value="${prize}">${prize}</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:10px;">
                <label for="targetCount">目标次数:</label>
                <input type="number" id="targetCount" value="1" min="1" style="margin-left:5px;padding:3px;width:60px;">
            </div>
            <div style="margin-bottom:10px;">
                <label>当前计数:</label>
                <span id="currentCount" style="font-weight:bold;margin-left:5px;">0</span>
            </div>
            <div style="margin-bottom:10px;">
                <label>总抽奖次数:</label>
                <span id="totalDraws" style="font-weight:bold;margin-left:5px;">0</span>
            </div>
            <div style="margin-bottom:10px;">
                <label>延迟设置(毫秒):</label>
                <input type="number" id="delayTime" value="2000" min="500" style="margin-left:5px;padding:3px;width:80px;">
                <span style="font-size:12px;color:#666;">(转盘转动时间)</span>
            </div>
            <div>
                <button id="startBtn" style="padding:5px 15px;background-color:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;">开始</button>
                <button id="stopBtn" style="padding:5px 15px;background-color:#f44336;color:white;border:none;border-radius:3px;cursor:pointer;margin-left:5px;" disabled>停止</button>
            </div>
        `;

        document.body.appendChild(panel);

        return {
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            targetPrize: document.getElementById('targetPrize'),
            targetCount: document.getElementById('targetCount'),
            currentCount: document.getElementById('currentCount'),
            totalDraws: document.getElementById('totalDraws'),
            delayTime: document.getElementById('delayTime')
        };
    }

    // 初始化变量
    let isRunning = false;
    let currentCount = 0;
    let totalDraws = 0;
    let targetPrize = '';
    let targetCount = 1;
    let delayTime = 2000;
    let controlPanel;
    let checkPopupInterval; // 弹窗检查定时器

    // 自动点击抽奖按钮
    function clickLotteryButton() {
        if (!isRunning) return;

        const lotteryButton = document.getElementById('lotteryButton');
        if (lotteryButton) {
            console.log('点击抽奖按钮');
            lotteryButton.click();

            // 启动弹窗检查定时器
            startCheckPopup();
        } else {
            console.log('未找到抽奖按钮，1秒后重试');
            if (isRunning) {
                setTimeout(clickLotteryButton, 1000);
            }
        }
    }

    // 开始检查弹窗
    function startCheckPopup() {
        // 清除之前的定时器，避免多个定时器同时运行
        if (checkPopupInterval) {
            clearInterval(checkPopupInterval);
        }

        // 每500ms检查一次弹窗是否出现
        checkPopupInterval = setInterval(() => {
            checkAndCloseResult();
        }, 500);
    }

    // 检查并关闭结果弹窗
    function checkAndCloseResult() {
        if (!isRunning) {
            clearInterval(checkPopupInterval);
            return;
        }

        // 查找弹窗容器（根据提供的HTML，弹窗容器是id为open-window的元素）
        const popupContainer = document.getElementById('open-window');
        if (popupContainer && popupContainer.style.display !== 'none') {
            console.log('检测到弹窗');

            // 清除检查定时器
            clearInterval(checkPopupInterval);

            // 获取抽奖结果文本
            const resultText = document.querySelector('.info p')?.textContent;
            if (resultText) {
                // 提取奖品信息
                const prize = resultText.replace('恭喜本次抽奖获得: ', '').trim();
                console.log('抽到了:', prize);

                // 更新计数
                totalDraws++;
                controlPanel.totalDraws.textContent = totalDraws;

                // 检查是否是目标奖品
                if (prize === targetPrize) {
                    currentCount++;
                    controlPanel.currentCount.textContent = currentCount;

                    // 检查是否达到目标次数
                    if (currentCount >= targetCount) {
                        stopAutoDraw();
                        alert(`已成功抽到【${targetPrize}】${targetCount}次！`);
                        return;
                    }
                }
            } else {
                console.log('未找到结果文本');
            }

            // 点击确认按钮关闭弹窗
            const confirmBtn = document.getElementById('confirm');
            if (confirmBtn) {
                console.log('点击确认按钮');
                confirmBtn.click();

                // 等待弹窗关闭和转盘准备就绪后继续抽奖
                setTimeout(() => {
                    if (isRunning) {
                        clickLotteryButton();
                    }
                }, delayTime);
            } else {
                console.log('未找到确认按钮，1秒后重试');
                if (isRunning) {
                    setTimeout(checkAndCloseResult, 1000);
                }
            }
        }
    }

    // 开始自动抽奖
    function startAutoDraw() {
        targetPrize = controlPanel.targetPrize.value;
        targetCount = parseInt(controlPanel.targetCount.value);
        delayTime = parseInt(controlPanel.delayTime.value);

        currentCount = 0;
        totalDraws = 0;
        controlPanel.currentCount.textContent = currentCount;
        controlPanel.totalDraws.textContent = totalDraws;

        isRunning = true;
        controlPanel.startBtn.disabled = true;
        controlPanel.stopBtn.disabled = false;

        console.log(`开始自动抽奖，目标：抽到【${targetPrize}】${targetCount}次，延迟：${delayTime}ms`);
        clickLotteryButton();
    }

    // 停止自动抽奖
    function stopAutoDraw() {
        isRunning = false;
        if (checkPopupInterval) {
            clearInterval(checkPopupInterval);
        }
        controlPanel.startBtn.disabled = false;
        controlPanel.stopBtn.disabled = true;
        console.log('已停止自动抽奖');
    }

    // 初始化
    function init() {
        controlPanel = createControlPanel();

        // 绑定按钮事件
        controlPanel.startBtn.addEventListener('click', startAutoDraw);
        controlPanel.stopBtn.addEventListener('click', stopAutoDraw);

        console.log('自动抽奖工具已加载');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();