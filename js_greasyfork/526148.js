// ==UserScript==
// @name         移动端微软Rewards每日任务优化版
// @version      2025.02.07.1
// @description  修复定时功能失效问题，增强浏览器兼容性，完整注释版
// @author       优化助手
// @match        https://*.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @namespace    https://greasyfork.org/zh-CN/users/1192640-huaisha1224
// @downloadURL https://update.greasyfork.org/scripts/526148/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526148/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

// 配置区 =======================================================================
const CONFIG = {
    MAX_REWARDS: 30,                  // 最大执行次数
    PAUSE_EVERY: 5,                   // 每N次暂停一次
    PAUSE_DURATION: 960000,           // 暂停时长16分钟（960000ms）
    RANDOM_DELAY: [10000, 30000],     // 随机延迟范围[最小,最大]（毫秒）
    DAILY_PAUSE_MINUTES: 1440,        // 每天完成任务后暂停的分钟数（默认1440分钟=24小时）
    SCROLL_DELAY: 5000,               // 页面下翻延迟时间（5秒）
    API_KEY: "",                      // 热门词API密钥
    DOMAINS: [                        // 轮换域名池
        'www.bing.com',
        'cn.bing.com',
        'm.bing.com',
        'global.bing.com'
    ],
    USER_AGENT: 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
};

// 核心逻辑 =====================================================================
(function() {
    'use strict';
    
    // 初始化环境
    initEnvironment(); // 初始化页面样式和状态
    registerMenu();    // 注册用户菜单
    checkSchedule();   // 检查是否到达预定运行时间

    // 主执行逻辑
    if (shouldExecute()) {
        prepareKeywords().then(exec).catch(fallbackKeywords);
    }

    // 初始化环境 ==============================================================
    function initEnvironment() {
        // 添加状态面板样式
        GM_addStyle(`
            #rewardStatus {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 12px;
            }
        `);
        // 修改页面标题
        document.title = `[Rewards AI] ${document.title}`;
        // 更新状态面板
        updateStatus();
    }

    // 注册用户菜单 ============================================================
    function registerMenu() {
        GM_registerMenuCommand('🚀 启动任务', startTask); // 启动任务
        GM_registerMenuCommand('🛑 终止任务', () => {
            GM_setValue('Counter', CONFIG.MAX_REWARDS + 10); // 终止任务
            GM_setValue('NextRunTime', null); // 清空下次运行时间
        });
        GM_registerMenuCommand('📋 复制状态', () => GM_setClipboard(getStatus())); // 复制状态
        GM_registerMenuCommand('⏰ 设置每日暂停时间', setDailyPauseMinutes); // 设置暂停时间
    }

    // 检查定时任务 ============================================================
    function checkSchedule() {
        const nextRun = GM_getValue('NextRunTime'); // 获取下次运行时间
        if (nextRun && Date.now() >= new Date(nextRun).getTime()) {
            // 如果当前时间超过预定时间，则重置计数器并启动任务
            GM_setValue('Counter', 0);
            GM_setValue('NextRunTime', null);
            startTask();
        }
    }

    // 状态管理 ================================================================
    function getStatus() {
        const lastRun = GM_getValue('LastRunTime', '从未运行'); // 获取最后运行时间
        const nextRun = GM_getValue('NextRunTime', '未计划');   // 获取下次运行时间
        return `进度: ${GM_getValue('Counter', 0)}/${CONFIG.MAX_REWARDS}
最后运行: ${lastRun}
下次运行: ${nextRun}
暂停时间: ${GM_getValue('DailyPauseMinutes', CONFIG.DAILY_PAUSE_MINUTES)}分钟`;
    }

    function updateStatus() {
        let statusEl = document.getElementById('rewardStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'rewardStatus';
            document.body.appendChild(statusEl);
        }
        statusEl.innerHTML = getStatus().replace(/\n/g, '<br>'); // 更新状态面板内容
    }

    // 执行逻辑 ================================================================
    function exec(keywords) {
        updateStatus(); // 更新状态面板
        const counter = GM_getValue('Counter', 0); // 获取当前计数器
        
        if (counter >= CONFIG.MAX_REWARDS) {
            handleCompletion(); // 如果达到最大执行次数，则完成任务
            return;
        }

        // 页面下翻功能
        setTimeout(smoothScrollToBottom, CONFIG.SCROLL_DELAY);

        // 执行搜索
        setTimeout(() => {
            performSearch(keywords[counter]); // 执行搜索
            GM_setValue('Counter', counter + 1); // 更新计数器
            
            if ((counter + 1) % CONFIG.PAUSE_EVERY === 0) {
                // 每执行N次后暂停
                setTimeout(() => exec(keywords), CONFIG.PAUSE_DURATION);
            } else {
                exec(keywords); // 继续执行
            }
        }, randomDelay()); // 随机延迟
    }

    // 完成任务 ================================================================
    function handleCompletion() {
        showCompletion(); // 显示完成提示
        scheduleNextRun(); // 安排下次运行
        GM_setValue('Counter', 0); // 重置计数器
    }

    // 安排下次运行 ============================================================
    function scheduleNextRun() {
        const pauseMinutes = GM_getValue('DailyPauseMinutes', CONFIG.DAILY_PAUSE_MINUTES); // 获取暂停时间
        const nextRunTime = new Date(Date.now() + pauseMinutes * 60000); // 计算下次运行时间
        
        GM_setValue('NextRunTime', nextRunTime.toLocaleString()); // 保存下次运行时间
        GM_setValue('LastRunTime', new Date().toLocaleString());  // 保存最后运行时间
        
        console.log(`下次运行时间已设置: ${nextRunTime}`); // 输出日志
        updateStatus(); // 更新状态面板
    }

    // 设置每日暂停时间 ========================================================
    function setDailyPauseMinutes() {
        const minutes = prompt('请输入每天完成任务后暂停的分钟数：', GM_getValue('DailyPauseMinutes', CONFIG.DAILY_PAUSE_MINUTES));
        if (minutes && !isNaN(minutes) && minutes > 0) {
            GM_setValue('DailyPauseMinutes', parseFloat(minutes)); // 保存用户输入的暂停时间
            alert(`已设置每日暂停时间为 ${minutes} 分钟`);
        } else {
            alert('输入无效，请输入一个大于0的数字');
        }
    }

    // 页面下翻功能 ============================================================
    function smoothScrollToBottom() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollStep = Math.floor(scrollHeight / 10);
        let currentPosition = 0;

        const scrollInterval = setInterval(() => {
            if (currentPosition < scrollHeight) {
                window.scrollBy(0, scrollStep); // 逐步下翻页面
                currentPosition += scrollStep;
            } else {
                clearInterval(scrollInterval); // 到达底部后停止
            }
        }, 200);
    }

    // 其他工具函数 ============================================================
    function generateRandomString(length) {
        return [...Array(length)].map(() => 
            Math.random().toString(36)[2]?.toUpperCase() || 
            Math.floor(Math.random() * 10)
        ).join('');
    }

    function randomDelay() {
        return Math.floor(Math.random() * (CONFIG.RANDOM_DELAY[1] - CONFIG.RANDOM_DELAY[0])) + CONFIG.RANDOM_DELAY[0];
    }

    function shuffleArray(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // 异常处理 ================================================================
    function fallbackKeywords() {
        console.warn('使用备用关键词库');
        exec(defaultKeywords());
    }

    function showCompletion() {
        GM_openInTab('https://rewards.microsoft.com/'); // 打开奖励页面
        alert('🎉 任务完成！已为您打开奖励页面');
    }

    function shouldExecute() {
        return location.host.includes('bing') && 
               !location.search.includes('br_msg=completed') &&
               GM_getValue('Counter',0) < CONFIG.MAX_REWARDS;
    }

    function startTask() {
        GM_setValue('Counter', 0); // 重置计数器
        location.href = `https://${CONFIG.DOMAINS[0]}/?br_msg=AI_Optimized`; // 跳转到Bing首页
    }
})();