// ==UserScript==
// @name         风纪委员投票助手(优化稳定版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  b站风纪委员投票自动化工具 - 修复异步问题/增强稳定性
// @license      MIT
// @author       asksowhat
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/judgement*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533492/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8%E5%8A%A9%E6%89%8B%28%E4%BC%98%E5%8C%96%E7%A8%B3%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533492/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8%E5%8A%A9%E6%89%8B%28%E4%BC%98%E5%8C%96%E7%A8%B3%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        BASE_DELAY: 3000,      // 基础延迟时间
        HUMANIZE_FACTOR: 0.3,   // 人类操作随机因子
        MAX_RETRY: 3            // 最大重试次数
    };

    let timers = [];            // 存储所有定时器
    let retryCount = 0;         // 当前重试次数

    // 主入口
    async function main() {
        clearAllTimers();
        try {
            await executeFlow();
            retryCount = 0; // 成功执行后重置重试计数器
        } catch (error) {
            GM_log(`执行出错: ${error.message}`);
            if (retryCount++ < CONFIG.MAX_RETRY) {
                await delay(getHumanizedDelay(5000));
                location.reload();
            }
        }
    }

    // 完整执行流程
    async function executeFlow() {
        await enterVotePage();
        await performVotingProcess();
        await handlePostSubmission();
        await checkCompletion();
    }

    /********************
     * 核心功能模块
     ********************/

    // 进入投票页面
    async function enterVotePage() {
        const startBtn = await waitForElement('.vote-btn:has-text("开始众议")', 10000);
        if (startBtn) {
            await humanClick(startBtn);
            return;
        }

        const noTaskBtn = await waitForElement('.vote-btn:has-text("无新任务")', 5000);
        if (noTaskBtn) {
            await delay(getHumanizedDelay(5000));
            location.reload();
        }
    }

    // 执行投票过程
    async function performVotingProcess() {
        // 等待选项加载
        await waitForElement('.vote-options', 15000);

        // 选择选项
        await selectVoteOption();
        await delay(getHumanizedDelay(3000));

        // 处理匿名提交
        if (await handleAnonymous()) {
            GM_log('已选择匿名提交');
        }

        // 提交投票
        await submitVote();
    }

    // 处理投票后操作
    async function handlePostSubmission() {
        // 等待提交完成
        await waitForElement('.post-submit-area', 20000);
        
        // 下一个投票或完成
        const nextBtn = await waitForElement('button:has-text("开始下一个")', 10000);
        if (nextBtn) {
            await humanClick(nextBtn);
            await delay(getHumanizedDelay(8000));
            main(); // 重启流程
        }
    }

    /********************
     * 工具函数
     ********************/
    
    // 带随机性的延迟
    function getHumanizedDelay(base) {
        return base * (1 + CONFIG.HUMANIZE_FACTOR * Math.random());
    }

    // 模拟人类点击
    async function humanClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width * (0.3 + 0.4 * Math.random());
        const y = rect.top + rect.height * (0.3 + 0.4 * Math.random());
        
        element.dispatchEvent(
            new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y })
        );
        await delay(200 + 300 * Math.random());
        element.click();
    }

    // 智能选择投票选项
    async function selectVoteOption() {
        const options = {
            'positive': ['好', '合适'],
            'neutral': ['普通', '中', '一般'],
            'negative': ['差', '不合适'],
            'unknown': ['无法判断']
        };

        const weights = {
            positive: 40,  // 40% 概率
            neutral: 30,   // 30%
            negative: 20,  // 20%
            unknown: 10    // 10%
        };

        const selectedType = weightedRandom(weights);
        const targetText = options[selectedType][Math.floor(Math.random() * options[selectedType].length)];

        const buttons = await waitForElements('button.vote-option', 5000);
        const targetBtn = buttons.find(btn => btn.textContent.trim() === targetText);
        
        if (targetBtn) {
            await humanClick(targetBtn);
            GM_log(`已选择选项: ${targetText}`);
            return true;
        }
        return false;
    }

    // 带权重的随机选择
    function weightedRandom(weights) {
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        const rand = Math.random() * total;
        let current = 0;
        
        for (const [key, weight] of Object.entries(weights)) {
            current += weight;
            if (rand <= current) return key;
        }
    }

    // 等待元素出现 (加强版)
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    reject(new Error(`等待元素超时: ${selector}`));
                } else {
                    setTimeout(check, 200 + 300 * Math.random());
                }
            };
            check();
        });
    }

    // 清除所有定时器
    function clearAllTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    // 延迟函数
    function delay(ms) {
        return new Promise(resolve => timers.push(setTimeout(resolve, ms)));
    }

    /********************
     * 初始化
     ********************/
    window.addEventListener('load', () => {
        GM_addStyle(`
            .vote-highlight {
                box-shadow: 0 0 8px rgba(0, 150, 255, 0.5) !important;
                transition: all 0.3s ease;
            }
        `);
        main();
    });

    // 防止重复执行
    if (window.hasRun) return;
    window.hasRun = true;
})();