// ==UserScript==
// @name         hhanclub自动抽奖增强版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动执行hhanclub抽奖，支持数据持久化和统计分析
// @author       Timi
// @match        https://hhanclub.top/lucky.php
// @grant        none
// @icon         https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAKEE2ie35c8Z7uFMM3o7kGs8JLlxdoAA-EZAAKUwPlULub89nlMf6Y2BA.ico
// @run-at       document-ready
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/545932/hhanclub%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545932/hhanclub%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 抽奖API配置
    const LOTTERY_API = 'https://hhanclub.top/plugin/lucky-draw';

    // 存储键名
    const STORAGE_KEY = 'hhanclub_lottery_stats';

    // 全局变量
    let singleCost = 2000; // 默认单次消耗
    let currentViewMode = 'current'; // current | total

    // 主控制逻辑变量
    let lotteryInterval = null;
    let consecutiveErrors = 0;
    let dynamicInterval = 7000;
    let currentRoundStartCount = 0; // 全局变量存储本轮起始计数

    // 统计数据变量
    let currentStats = {
        lotteryCount: 0,
        winCount: 0,
        cost: 0,
        beansWon: 0,
        invites: 0,
        rainbowDays: 0,
        vipDays: 0,
        makeupCards: 0,
        uploadGB: 0,
        prizeStats: {}
    };

    let totalStats = {
        totalLotteryCount: 0,
        totalWinCount: 0,
        totalCost: 0,
        totalBeansWon: 0,
        totalInvites: 0,
        totalRainbowDays: 0,
        totalVipDays: 0,
        totalMakeupCards: 0,
        totalUploadGB: 0,
        totalPrizeStats: {}
    };

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'lottery-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            min-width: 280px;
            max-width: 500px;
            min-height: 200px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            padding: 15px;
            resize: both;
            overflow: auto;
        `;

        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007bff;">🎲 自动抽奖工具</h3>
            </div>
            <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>💰 憨豆余额: <span id="bean-balance" style="color: #28a745; font-weight: bold;">检测中...</span></span>
                </div>
                <div style="margin-top: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span>🎯 单次消耗: <span id="single-cost" style="color: #dc3545;">2000</span></span>
                    <span>📊 最多可抽: <span id="max-possible" style="color: #007bff; font-weight: bold;">-</span> 次</span>
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <label>抽奖间隔 (秒):</label>
                <input type="number" id="lottery-interval" value="7" min="3" max="300" style="width: 60px; margin-left: 10px;">
                <span style="font-size: 11px; color: #666; margin-left: 5px;">实际: <span id="current-interval">7</span>s</span>
            </div>
            <div style="margin-bottom: 10px;">
                <label>最大抽奖次数:</label>
                <input type="number" id="max-lottery-count" value="10" min="1" max="1000" style="width: 60px; margin-left: 10px;">
                <button id="set-max-possible" style="background: #17a2b8; color: white; border: none; padding: 4px 8px; border-radius: 3px; font-size: 11px; margin-left: 5px; cursor: pointer;">设为最大</button>
            </div>
            <div style="text-align: center; margin-bottom: 15px;">
                <button id="start-lottery" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; margin-right: 5px; cursor: pointer;">开始抽奖</button>
                <button id="stop-lottery" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;" disabled>停止抽奖</button>
            </div>
            <div style="border-top: 1px solid #eee; padding-top: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 12px; color: #666;">
                        状态: <span id="lottery-status" style="color: #28a745;">等待开始</span>
                    </div>
                    <select id="view-mode" style="padding: 2px 5px; font-size: 11px; border: 1px solid #ccc; border-radius: 3px;">
                        <option value="current">本次数据</option>
                        <option value="total">总计数据</option>
                    </select>
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                    已抽奖: <span id="lottery-count">0</span> 次 | 中奖: <span id="win-count">0</span> 次 | 消耗: <span id="cost-beans">0</span> 憨豆
                </div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                    <span style="color: #666;">盈亏: </span>
                    <span id="profit-loss" style="font-weight: bold;">-</span> 憨豆
                    <span style="color: #666; margin-left: 10px;">盈亏率: </span>
                    <span id="profit-rate" style="font-weight: bold;">-</span>
                </div>
                <div id="prize-stats" style="font-size: 11px; color: #666; margin-top: 5px; display: none; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <strong>🎁 奖品统计</strong>
                        <button id="toggle-detailed-stats" style="background: #6c757d; color: white; border: none; padding: 2px 6px; border-radius: 2px; font-size: 10px; cursor: pointer;">详细</button>
                    </div>
                    <div id="summary-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; margin-bottom: 5px; font-size: 10px;">
                        <div>💰 获得憨豆: <span id="total-beans-won" style="color: #28a745; font-weight: bold;">0</span></div>
                        <div>📧 邀请数: <span id="total-invites" style="color: #007bff; font-weight: bold;">0</span></div>
                        <div>🌈 彩虹ID: <span id="total-rainbow-days" style="color: #e83e8c; font-weight: bold;">0</span>天</div>
                        <div>🎫 VIP: <span id="total-vip-days" style="color: #fd7e14; font-weight: bold;">0</span>天</div>
                        <div>📝 补签卡: <span id="total-makeup-cards" style="color: #6f42c1; font-weight: bold;">0</span>个</div>
                        <div>⬆️ 上传量: <span id="total-upload" style="color: #20c997; font-weight: bold;">0</span>GB</div>
                    </div>
                    <div id="detailed-prize-list" style="max-height: 120px; overflow-y: auto; margin-top: 3px; border: 1px solid #ddd; border-radius: 3px; padding: 3px; resize: both; min-height: 40px; display: none;"></div>
                </div>
                <div style="text-align: center; margin-bottom: 8px; display: flex; justify-content: center; gap: 10px;">
                    <button id="reset-current-data"
                        style="background: #ffc107; color: #212529; border: none; padding: 4px 10px; border-radius: 3px; font-size: 11px; cursor: pointer;">
                        重置本次数据
                    </button>
                    <button id="clear-total-data"
                        style="background: #6c757d; color: white; border: none; padding: 4px 10px; border-radius: 3px; font-size: 11px; cursor: pointer;">
                        清空历史数据
                    </button>
                </div>
                <div id="lottery-log" style="max-height: 150px; overflow-y: auto; background: #f8f9fa; padding: 5px; border-radius: 4px; font-size: 11px; margin-top: 10px; display: none;">
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        console.log('控制面板已添加:', document.getElementById('lottery-control-panel'));
        return panel;
    }

    // 动态获取单次消耗憨豆
    function getSingleCost() {
        const costElement = document.querySelector('.use-bean');
        if (costElement) {
            const match = costElement.textContent.match(/(\d+)/);
            if (match) {
                singleCost = parseInt(match[1]);
                document.getElementById('single-cost').textContent = singleCost;
                console.log('动态获取单次消耗:', singleCost);
                return singleCost;
            }
        }
        console.log('使用默认单次消耗:', singleCost);
        return singleCost;
    }

    // 获取憨豆余额
    function getBeanBalance() {
        const beanElement = document.querySelector('.bean-number');
        if (!beanElement) {
            console.error('未找到憨豆余额元素 (.bean-number)');
            addLog('❌ 无法获取憨豆余额', 'error');
            return 0;
        }
        const balance = parseFloat(beanElement.textContent.trim());
        return isNaN(balance) ? 0 : balance;
    }

    // 更新余额显示
    function updateBalanceDisplay() {
        const balance = getBeanBalance();
        const cost = getSingleCost();
        const maxPossible = Math.floor(balance / cost);

        const beanBalanceElement = document.getElementById('bean-balance');
        const maxPossibleElement = document.getElementById('max-possible');
        const startButton = document.getElementById('start-lottery');

        if (beanBalanceElement && maxPossibleElement && startButton) {
            beanBalanceElement.textContent = balance.toLocaleString();
            maxPossibleElement.textContent = maxPossible.toLocaleString();

            if (balance < cost) {
                startButton.disabled = true;
                startButton.textContent = '余额不足';
                startButton.style.background = '#6c757d';
            } else {
                startButton.disabled = false;
                startButton.textContent = '开始抽奖';
                startButton.style.background = '#28a745';
            }
        } else {
            console.error('余额显示元素未找到');
            addLog('❌ 余额显示元素未加载', 'error');
        }

        return maxPossible;
    }

    // 数据持久化相关
    function saveStatsData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    function loadStatsData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
        return {
            totalLotteryCount: 0,
            totalWinCount: 0,
            totalCost: 0,
            totalBeansWon: 0,
            totalInvites: 0,
            totalRainbowDays: 0,
            totalVipDays: 0,
            totalMakeupCards: 0,
            totalUploadGB: 0,
            totalPrizeStats: {}
        };
    }

    function clearTotalData() {
        if (confirm('确定要清空所有历史数据吗？此操作无法撤销！')) {
            localStorage.removeItem(STORAGE_KEY);
            totalStats = loadStatsData();
            updateDisplay();
            addLog('✅ 历史数据已清空', 'success');
        }
    }

    // 解码Unicode字符串
    function decodeUnicode(str) {
        try {
            return str.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } catch (error) {
            return str;
        }
    }

    // 执行单次抽奖
    async function performLottery() {
        try {
            const response = await fetch(LOTTERY_API, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                    'content-length': '0',
                    'origin': 'https://hhanclub.top',
                    'priority': 'u=1, i',
                    'referer': 'https://hhanclub.top/lucky.php',
                    'sec-ch-ua': '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                    'sec-ch-ua-arch': 'x86',
                    'sec-ch-ua-bitness': '64',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': 'Windows',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',
                    'x-requested-with': 'XMLHttpRequest'
                }
            });

            const resultText = await response.text();

            let parsedResult = null;
            try {
                parsedResult = JSON.parse(resultText);
            } catch (e) {
                // 如果不是JSON格式，保持原文本
            }

            return {
                success: response.ok,
                status: response.status,
                data: resultText,
                parsed: parsedResult
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 添加日志
    function addLog(message, type = 'info') {
        const logContainer = document.getElementById('lottery-log');
        if (!logContainer) {
            console.error('日志容器未找到');
            return;
        }
        logContainer.style.display = 'block';

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');

        let color = '#666';
        switch (type) {
            case 'error': color = '#dc3545'; break;
            case 'success': color = '#28a745'; break;
            case 'warning': color = '#ffc107'; break;
            case 'info':
            default: color = '#666'; break;
        }

        logEntry.style.cssText = `margin-bottom: 3px; color: ${color};`;
        logEntry.textContent = `[${timestamp}] ${message}`;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        if (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    // 解析奖品内容
    function parsePrizeText(prizeText) {
        const result = {
            type: 'unknown',
            name: prizeText,
            value: 0,
            unit: ''
        };

        if (prizeText.includes('魔力') || prizeText.includes('憨豆')) {
            const match = prizeText.match(/(\d+)/);
            if (match) {
                result.type = 'beans';
                result.value = parseInt(match[1]);
                result.name = '憨豆';
                result.unit = '';
            }
        }
        else if (prizeText.includes('邀请')) {
            const match = prizeText.match(/(\d+)/);
            if (match) {
                result.type = 'invite';
                result.value = parseInt(match[1]);
                result.name = '邀请';
                result.unit = '';
            }
        }
        else if (prizeText.includes('彩虹')) {
            const match = prizeText.match(/(\d+)/);
            if (match) {
                result.type = 'rainbow';
                result.value = parseInt(match[1]);
                result.name = '彩虹ID';
                result.unit = '天';
            }
        }
        else if (prizeText.includes('VIP')) {
            const match = prizeText.match(/(\d+)/);
            if (match) {
                result.type = 'vip';
                result.value = parseInt(match[1]);
                result.name = 'VIP';
                result.unit = '天';
            }
        }
        else if (prizeText.includes('补签卡')) {
            const match = prizeText.match(/(\d+)/);
            if (match) {
                result.type = 'makeup';
                result.value = parseInt(match[1]);
                result.name = '补签卡';
                result.unit = '个';
            }
        }
        else if (prizeText.includes('上传量')) {
            const match = prizeText.match(/(\d+(?:\.\d+)?)\s*GB/);
            if (match) {
                result.type = 'upload';
                result.value = parseFloat(match[1]);
                result.name = '上传量';
                result.unit = 'GB';
            }
        }

        return result;
    }

    // 更新显示
    function updateDisplay() {
        const viewMode = document.getElementById('view-mode')?.value || 'current';

        let displayData;
        if (viewMode === 'current') {
            displayData = {
                lotteryCount: currentStats.lotteryCount,
                winCount: currentStats.winCount,
                cost: currentStats.cost,
                beansWon: currentStats.beansWon,
                invites: currentStats.invites,
                rainbowDays: currentStats.rainbowDays,
                vipDays: currentStats.vipDays,
                makeupCards: currentStats.makeupCards,
                uploadGB: currentStats.uploadGB,
                prizeStats: currentStats.prizeStats
            };
        } else {
            displayData = {
                lotteryCount: totalStats.totalLotteryCount,
                winCount: totalStats.totalWinCount,
                cost: totalStats.totalCost,
                beansWon: totalStats.totalBeansWon,
                invites: totalStats.totalInvites,
                rainbowDays: totalStats.totalRainbowDays,
                vipDays: totalStats.totalVipDays,
                makeupCards: totalStats.totalMakeupCards,
                uploadGB: totalStats.totalUploadGB,
                prizeStats: totalStats.totalPrizeStats
            };
        }

        // 更新基本统计
        document.getElementById('lottery-count').textContent = displayData.lotteryCount;
        document.getElementById('win-count').textContent = displayData.winCount;
        document.getElementById('cost-beans').textContent = displayData.cost.toLocaleString();

        // 更新奖品统计
        document.getElementById('total-beans-won').textContent = displayData.beansWon.toLocaleString();
        document.getElementById('total-invites').textContent = displayData.invites.toLocaleString();
        document.getElementById('total-rainbow-days').textContent = displayData.rainbowDays.toLocaleString();
        document.getElementById('total-vip-days').textContent = displayData.vipDays.toLocaleString();
        document.getElementById('total-makeup-cards').textContent = displayData.makeupCards.toLocaleString();
        document.getElementById('total-upload').textContent = displayData.uploadGB.toLocaleString();

        // 更新盈亏
        updateProfitLoss(displayData);

        // 更新详细奖品列表
        updateDetailedPrizeList(displayData);
    }

    // 更新盈亏计算
    function updateProfitLoss(data) {
        const profit = data.beansWon - data.cost;
        const profitElement = document.getElementById('profit-loss');
        const rateElement = document.getElementById('profit-rate');

        if (profitElement && rateElement) {
            profitElement.textContent = profit.toLocaleString();
            if (profit > 0) {
                profitElement.style.color = '#28a745';
                profitElement.textContent = '+' + profit.toLocaleString();
            } else if (profit < 0) {
                profitElement.style.color = '#dc3545';
            } else {
                profitElement.style.color = '#666';
            }

            if (data.cost > 0) {
                const rate = (profit / data.cost * 100).toFixed(1);
                rateElement.textContent = rate + '%';
                if (parseFloat(rate) > 0) {
                    rateElement.style.color = '#28a745';
                } else if (parseFloat(rate) < 0) {
                    rateElement.style.color = '#dc3545';
                } else {
                    rateElement.style.color = '#666';
                }
            } else {
                rateElement.textContent = '-';
                rateElement.style.color = '#666';
            }
        }
    }

    // 更新详细奖品列表
    function updateDetailedPrizeList(data) {
        const prizeList = document.getElementById('detailed-prize-list');
        if (!prizeList) return;

        prizeList.innerHTML = '';

        // 计算总中奖次数用于百分比
        const totalWins = Object.values(data.prizeStats).reduce((sum, count) => sum + count, 0);

        if (totalWins === 0) {
            prizeList.innerHTML = '<div style="text-align: center; color: #999; padding: 10px;">暂无奖品数据</div>';
            return;
        }

        Object.entries(data.prizeStats)
            .sort((a, b) => b[1] - a[1])
            .forEach(([prize, count]) => {
                const percentage = ((count / totalWins) * 100).toFixed(1);
                const item = document.createElement('div');
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="flex: 1; text-align: left;">${prize}</span>
                        <span style="color: #007bff; margin: 0 5px;">${count}次</span>
                        <span style="color: #28a745; font-size: 9px;">${percentage}%</span>
                    </div>
                `;
                item.style.cssText = 'margin: 1px 0; padding: 2px 3px; background: #e9ecef; border-radius: 2px; font-size: 10px;';
                prizeList.appendChild(item);
            });
    }

    // 更新奖品统计
    function updatePrizeStats(prizeText) {
        // 更新当前统计
        currentStats.winCount++;
        const prize = parsePrizeText(prizeText);

        switch (prize.type) {
            case 'beans':
                currentStats.beansWon += prize.value;
                totalStats.totalBeansWon += prize.value;
                break;
            case 'invite':
                currentStats.invites += prize.value;
                totalStats.totalInvites += prize.value;
                break;
            case 'rainbow':
                currentStats.rainbowDays += prize.value;
                totalStats.totalRainbowDays += prize.value;
                break;
            case 'vip':
                currentStats.vipDays += prize.value;
                totalStats.totalVipDays += prize.value;
                break;
            case 'makeup':
                currentStats.makeupCards += prize.value;
                totalStats.totalMakeupCards += prize.value;
                break;
            case 'upload':
                currentStats.uploadGB += prize.value;
                totalStats.totalUploadGB += prize.value;
                break;
        }

        // 更新奖品统计
        if (currentStats.prizeStats[prizeText]) {
            currentStats.prizeStats[prizeText]++;
        } else {
            currentStats.prizeStats[prizeText] = 1;
        }

        if (totalStats.totalPrizeStats[prizeText]) {
            totalStats.totalPrizeStats[prizeText]++;
        } else {
            totalStats.totalPrizeStats[prizeText] = 1;
        }

        // 更新总计
        totalStats.totalWinCount++;

        // 保存数据
        saveStatsData(totalStats);

        updateDisplay();
        document.getElementById('prize-stats').style.display = 'block';
    }

    // 更新消耗统计
    function updateCostStats() {
        currentStats.cost += singleCost;
        currentStats.lotteryCount++;

        totalStats.totalCost += singleCost;
        totalStats.totalLotteryCount++;

        saveStatsData(totalStats);
        updateDisplay();
        setTimeout(updateBalanceDisplay, 100);
    }

    // 执行单次抽奖
    async function performSingleLottery(maxCount) {
        // 计算本轮已抽次数
        const roundCount = currentStats.lotteryCount - currentRoundStartCount;

        if (roundCount >= maxCount) {
            stopLottery();
            addLog(`🎯 本轮达到最大抽奖次数 (${maxCount})，自动停止`, 'info');
            addLog(`📊 会话总计: ${currentStats.lotteryCount} 次抽奖，${currentStats.winCount} 次中奖`, 'info');
            return;
        }

        addLog(`🎯 执行第 ${currentStats.lotteryCount + 1} 次抽奖 (本轮第 ${roundCount + 1}/${maxCount}) (间隔: ${dynamicInterval / 1000}s)`, 'info');

        const result = await performLottery();

        if (result.success && result.parsed) {
            const data = result.parsed;

            if (data.ret === 0) {
                consecutiveErrors = 0;
                dynamicInterval = parseInt(document.getElementById('lottery-interval')?.value || 7) * 1000;
                document.getElementById('current-interval').textContent = dynamicInterval / 1000;

                if (lotteryInterval) {
                    clearInterval(lotteryInterval);
                    lotteryInterval = setInterval(() => {
                        performSingleLottery(maxCount);
                    }, dynamicInterval);
                }

                const prizeText = decodeUnicode(data.data.prize_text || '未知奖品');
                const recordId = data.data.winning_record_id || '';

                addLog(`🎉 恭喜！抽中了: ${prizeText} (记录ID: ${recordId})`, 'success');

                updatePrizeStats(prizeText);
                updateCostStats();

            } else if (data.ret === -1) {
                const errorMsg = decodeUnicode(data.msg || '未知错误');

                if (errorMsg.includes('重复点击') || errorMsg.includes('请稍后')) {
                    consecutiveErrors++;
                    if (consecutiveErrors >= 3) {
                        dynamicInterval = Math.min(dynamicInterval * 1.5, 30000);
                        document.getElementById('current-interval').textContent = Math.round(dynamicInterval / 1000);
                        addLog(`⚠️ ${errorMsg}，已调整间隔至 ${Math.round(dynamicInterval / 1000)} 秒`, 'warning');

                        if (lotteryInterval) {
                            clearInterval(lotteryInterval);
                            lotteryInterval = setInterval(() => {
                                performSingleLottery(maxCount);
                            }, dynamicInterval);
                        }
                    } else {
                        addLog(`⚠️ ${errorMsg}，将在下次继续尝试 (${consecutiveErrors}/3)`, 'warning');
                    }
                } else if (errorMsg.includes('次数') || errorMsg.includes('用完') || errorMsg.includes('余额不足')) {
                    addLog(`❌ ${errorMsg}，已停止抽奖`, 'error');
                    stopLottery();
                    return;
                } else {
                    consecutiveErrors++;
                    addLog(`❌ ${errorMsg} (${consecutiveErrors}/3)`, 'error');
                    updateCostStats();
                }
            } else {
                consecutiveErrors++;
                addLog(`⚠️ 未知响应状态: ret=${data.ret}, msg=${decodeUnicode(data.msg || '')}`, 'warning');
                updateCostStats();
            }
        } else if (result.success) {
            addLog(`✅ 抽奖完成，响应: ${result.data.substring(0, 100)}...`, 'success');
            consecutiveErrors = 0;
            updateCostStats();
        } else {
            consecutiveErrors++;
            addLog(`❌ 请求失败: ${result.error || result.status} (${consecutiveErrors}/3)`, 'error');
            if (consecutiveErrors < 3) {
                updateCostStats();
            }
        }
    }

    function stopLottery() {
        if (lotteryInterval) {
            clearInterval(lotteryInterval);
            lotteryInterval = null;
        }

        document.getElementById('lottery-status').textContent = '已停止';
        document.getElementById('lottery-status').style.color = '#dc3545';
        document.getElementById('start-lottery').disabled = false;
        document.getElementById('stop-lottery').disabled = true;

        const baseInterval = parseInt(document.getElementById('lottery-interval')?.value || 7);
        document.getElementById('current-interval').textContent = baseInterval;

        addLog('🛑 抽奖已停止', 'info');
    }

    function startLottery() {
        const intervalInput = document.getElementById('lottery-interval');
        const maxCountInput = document.getElementById('max-lottery-count');

        if (!intervalInput || !maxCountInput) {
            addLog('❌ 控制面板未正确加载，无法开始抽奖', 'error');
            console.error('缺少必要的输入元素:', { intervalInput, maxCountInput });
            return;
        }

        const maxCount = parseInt(maxCountInput.value) || 10;
        dynamicInterval = parseInt(intervalInput.value) * 1000 || 7000;

        // 不再重置当前统计 - 保持会话期间的累计数据
        consecutiveErrors = 0;

        // 记录本轮抽奖的起始次数，用于判断是否达到本轮最大次数
        currentRoundStartCount = currentStats.lotteryCount;

        document.getElementById('current-interval').textContent = dynamicInterval / 1000;

        document.getElementById('lottery-status').textContent = '运行中...';
        document.getElementById('lottery-status').style.color = '#ffc107';
        document.getElementById('start-lottery').disabled = true;
        document.getElementById('stop-lottery').disabled = false;

        addLog(`🚀 开始抽奖，本轮最大次数: ${maxCount}，基础间隔: ${dynamicInterval / 1000}秒`, 'info');
        addLog(`📊 当前会话已累计: ${currentStats.lotteryCount} 次抽奖，${currentStats.winCount} 次中奖`, 'info');

        performSingleLottery(maxCount);
        lotteryInterval = setInterval(() => {
            performSingleLottery(maxCount);
        }, dynamicInterval);
    }

    // 重置本次数据
    function resetCurrentData() {
        if (lotteryInterval) {
            addLog('⚠️ 请先停止抽奖再重置数据', 'warning');
            return;
        }

        if (confirm('确定要重置本次会话的数据吗？这将清空当前显示的所有本次统计数据！')) {
            currentStats = {
                lotteryCount: 0,
                winCount: 0,
                cost: 0,
                beansWon: 0,
                invites: 0,
                rainbowDays: 0,
                vipDays: 0,
                makeupCards: 0,
                uploadGB: 0,
                prizeStats: {}
            };

            updateDisplay();
            document.getElementById('prize-stats').style.display = 'none';
            addLog('✅ 本次会话数据已重置', 'success');
        }
    }

    // 初始化
    function init() {
        // 加载历史数据
        totalStats = loadStatsData();

        const panel = createControlPanel();
        if (!panel || !document.getElementById('lottery-control-panel')) {
            console.error('控制面板创建失败');
            addLog('❌ 控制面板创建失败', 'error');
            return;
        }

        // 绑定事件
        document.getElementById('start-lottery').addEventListener('click', startLottery);
        document.getElementById('stop-lottery').addEventListener('click', stopLottery);

        document.getElementById('set-max-possible').addEventListener('click', () => {
            const maxPossible = updateBalanceDisplay();
            document.getElementById('max-lottery-count').value = maxPossible;
        });

        document.getElementById('view-mode').addEventListener('change', updateDisplay);

        document.getElementById('clear-total-data').addEventListener('click', clearTotalData);

        document.getElementById('reset-current-data').addEventListener('click', resetCurrentData);

        document.getElementById('toggle-detailed-stats').addEventListener('click', () => {
            const detailedList = document.getElementById('detailed-prize-list');
            const button = document.getElementById('toggle-detailed-stats');

            if (detailedList.style.display === 'none') {
                detailedList.style.display = 'block';
                button.textContent = '隐藏';
            } else {
                detailedList.style.display = 'none';
                button.textContent = '详细';
            }
        });

        // 面板拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        const titleBar = panel.querySelector('h3').parentElement;
        titleBar.style.cursor = 'move';
        titleBar.style.userSelect = 'none';

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        console.log('🎲 hhanclub自动抽奖增强版脚本已加载！');

        // 初始化显示
        updateBalanceDisplay();
        updateDisplay();

        // 定期更新余额
        setInterval(() => {
            updateBalanceDisplay();
            getSingleCost(); // 定期检查单次消耗
        }, 10000);

        addLog('增强版脚本已就绪！支持数据持久化、本次/总计切换、动态消耗检测和详细统计分析', 'success');
        addLog('💡 提示：可通过下拉框切换查看本次数据或历史总计数据', 'info');
        addLog('🔄 说明：本次数据会在整个会话期间累计，多次开始/停止抽奖不会重置', 'info');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();