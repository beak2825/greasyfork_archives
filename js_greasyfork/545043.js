// ==UserScript==
// @name         superfortune click - prod
// @namespace    superfortune.xyz
// @version      2025-08-08
// @description  superfortune auto click
// @author       Skye
// @match        https://app.superfortune.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.superfortune.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545043/superfortune%20click%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/545043/superfortune%20click%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置 =====
    const CLICK_DELAY = 400; // 点击间隔（毫秒）
    const CHECK_INTERVAL = 2000; // 检查间隔（毫秒）
    let MAX_CLICK_COUNT = 0; // 最大点击次数，动态获取
    const PAUSE_INTERVAL = 100; // 每隔多少次点击暂停一次
    const PAUSE_MIN = 300; // 暂停最小时间（毫秒）
    const PAUSE_MAX = 1000; // 暂停最大时间（毫秒）

    // 点击次数计数器，动态获取
    let clickCount = 0;

    // 日志封装，带时间戳和前缀
    function log(msg) {
        console.log(`[Superfortune][${new Date().toLocaleTimeString()}] ${msg}`);
    }

    // 时间格式化辅助函数（毫秒转"X.Y秒"）
    function formatMs(ms) {
        return `${(ms / 1000).toFixed(1)}秒`;
    }

    // 异步延迟函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 检测按钮是否可用
    function checkButton() {
        const btn = document.querySelector('button.font-slidefu.cursor-pointer');
        if (!btn) {
            log('未找到目标按钮');
            return null;
        }
        if (btn.disabled) {
            log('按钮禁用');
            return null;
        }
        log('按钮可用');
        return btn;
    }

    // 获取页面中的今日打击次数和最大打击次数
    function getClickCounts() {
        // 1. 用 XPath 获取目标 div
        const xpath = "/html/body/div/div[1]/div/div/div[4]/div[3]";
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const targetDiv = result.singleNodeValue;
        if (!targetDiv) {
            log('未找到指定 XPath 的 div');
            return { clickCount: 0, maxClickCount: 0 };
        }
        // 2. 在该div下查找所有<p>标签，筛选出内容为纯数字的p
        const pList = Array.from(targetDiv.querySelectorAll('p'));
        const numberPs = pList.filter(p => /^\d+$/.test(p.textContent.trim()));
        // 3. 取第一个和第二个数字
        const clickCount = parseInt(numberPs[0]?.textContent || '0', 10);
        const maxClickCount = parseInt(numberPs[1]?.textContent || '0', 10);
        return { clickCount, maxClickCount };
    }

    // 执行点击操作
    async function executeClick(btn, remainCount) {
        log('开始执行点击操作');
        for (let i = 0; i < remainCount; i++) {
            // 检查按钮是否可用，如果禁用则等待
            while (btn.disabled) {
                await delay(100);
            }
            // 执行点击
            btn.click();
            clickCount++;
            const currentClickNumber = i + 1; // 当前是第几次点击（从1开始）
            log(`第 ${currentClickNumber} / ${remainCount} 次点击完成`);
            // 检查是否需要暂停
            if (clickCount % PAUSE_INTERVAL === 0) {
                const pauseTime = PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN);
                log(`已完成 ${PAUSE_INTERVAL} 次点击，随机暂停 ${formatMs(pauseTime)}`);
                await delay(pauseTime);
            } else {
                // 正常点击间隔
                await delay(CLICK_DELAY);
            }
        }
        log(`点击操作完成，共执行 ${remainCount} 次点击`);
    }

    // 主要检测和点击循环
    async function mainLoop(remainCount) {
        try {
            // 检测按钮
            const btn = checkButton();
            if (btn) {
                // 执行点击
                await executeClick(btn, remainCount);
                log('脚本执行完毕');
                return;
            } else {
                // 如果按钮不可用，等待后重试
                log(`${formatMs(CHECK_INTERVAL)}后重新检测`);
                setTimeout(() => mainLoop(remainCount), CHECK_INTERVAL);
            }
        } catch (error) {
            log(`执行过程中发生错误: ${error.message}`);
            setTimeout(() => mainLoop(remainCount), CHECK_INTERVAL);
        }
    }

    // 主入口
    function main() {
        log('Superfortune自动点击脚本已启动...');
        // 等待页面完全加载后再执行我们的主函数，以确保所有DOM元素都可用
        window.addEventListener('load', function() {
            log('页面加载完毕，15秒后开始执行任务。');
            setTimeout(() => {
                // 页面加载后再获取点击次数
                const { clickCount: initialClickCount, maxClickCount } = getClickCounts();
                clickCount = initialClickCount;
                MAX_CLICK_COUNT = maxClickCount;
                const remainCount = Math.max(0, MAX_CLICK_COUNT - clickCount);
                log(`最大点击次数: ${MAX_CLICK_COUNT}`);
                log(`当前已点击次数: ${clickCount}`);
                log(`剩余可点击次数: ${remainCount}`);
                // log(`点击间隔: ${CLICK_DELAY}毫秒`);
                // log(`每隔 ${PAUSE_INTERVAL} 次点击暂停 ${PAUSE_MIN}-${PAUSE_MAX}毫秒`);
                if (remainCount === 0) {
                    log('剩余可点击次数为0，脚本自动停止。');
                    return;
                }
                mainLoop(remainCount);
            }, 15000);
        });
    }

    main();
})();