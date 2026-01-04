// ==UserScript==
// @name         MIMIU只配女
// @namespace    mimiu
// @version      4.1
// @description  【架构修复】修复因操作锁导致的匹配中断问题，确保脚本在每次操作后都能重新检查页面状态。
// @author       akai
// @match        *://*.mimiu.chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544428/MIMIU%E5%8F%AA%E9%85%8D%E5%A5%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/544428/MIMIU%E5%8F%AA%E9%85%8D%E5%A5%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const config = {
        debugMode: true,
        minDelay: 400, // 拟人化点击最小延迟
        maxDelay: 900, // 拟人化点击最大延迟
        debounceWait: 150 // 防抖延迟：页面停止变化150毫秒后，再执行检查
    };
    // ---

    let matchFoundAndPaused = false;
    let isActionInProgress = false; // 操作锁，防止并发执行
    let debounceTimer;              // 防抖计时器

    function log(message) {
        if (config.debugMode) {
            console.log(`[MIMIU脚本] ${new Date().toLocaleTimeString()}: ${message}`);
        }
    }

    /**
     * 【架构修复】拟人化点击函数 (集成操作锁和自动重检)
     */
    function humanizedClick(element) {
        // 如果元素不存在，或已上锁，则忽略本次点击请求
        if (!element || isActionInProgress) return;

        isActionInProgress = true; // 【加锁】
        const randomDelay = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
        log(`准备点击: "${element.innerText.trim()}"，将在 ${randomDelay} 毫秒后执行。`);

        setTimeout(() => {
            log(`执行点击: "${element.innerText.trim()}"`);
            element.click();
            // 点击后，等待页面反应，然后解锁并重新检查
            setTimeout(() => {
                log("操作锁已释放，强制重新触发一次页面检查。");
                isActionInProgress = false; // 【解锁】
                // 强制触发一次检查，确保脚本不会因缺少页面变化而卡住
                debouncedHandleMutation();
            }, 500); // 500ms 是一个安全的页面反应延迟
        }, randomDelay);
    }

    /**
     * 检查并关闭网络异常弹窗
     */
    function checkForNetworkErrorPopup() {
        const confirmButton = document.querySelector('.van-dialog__confirm');
        if (confirmButton) {
            humanizedClick(confirmButton);
            return true;
        }
        return false;
    }

    /**
     * 通过文字内容查找并点击“离开”或“重新匹配”按钮
     */
    function leaveAndRestart() {
        const buttonTexts = ['离开', '重新匹配'];
        const allButtons = document.querySelectorAll('button, div');
        for (const btn of allButtons) {
            if (buttonTexts.includes(btn.innerText.trim())) {
                // 在发起异步点击前，先重置暂停状态
                matchFoundAndPaused = false;
                humanizedClick(btn);
                return;
            }
        }
    }

    /**
     * 核心检查逻辑
     */
    function doWork() {
        // 在真正执行检查前，再次确认是否已上锁
        if (isActionInProgress) return;

        // 1. 优先处理弹窗
        if (checkForNetworkErrorPopup()) return;

        // 2. 检查是否已暂停
        if (matchFoundAndPaused) return;

        // 3. 执行匹配逻辑
        const allDivs = document.querySelectorAll('div');
        let partnerInfoEl = null;
        for (const div of allDivs) {
            const text = div.innerText.trim();
            if ((text === '男生' || text === '女生') && div.children.length === 0) {
                partnerInfoEl = div;
                break;
            }
        }

        if (partnerInfoEl) {
            const partnerText = partnerInfoEl.innerText;
            if (partnerText.includes("女")) {
                log(`匹配成功: [${partnerText}]。脚本暂停，请您手动开始聊天。`);
                matchFoundAndPaused = true;
            } else {
                log(`匹配对象: [${partnerText}]。不符合条件。`);
                leaveAndRestart();
            }
        } else {
            // 【逻辑优化】如果没有匹配到伙伴，不应盲目重启。
            // 只有在明确看到“离开”或“重新匹配”按钮时，才执行操作。
            const buttonTexts = ['离开', '重新匹配'];
            const allButtons = document.querySelectorAll('button, div');
            let foundActionableButton = false;
            for (const btn of allButtons) {
                if (buttonTexts.includes(btn.innerText.trim())) {
                    foundActionableButton = true;
                    break;
                }
            }

            if (foundActionableButton) {
                log("未检测到伙伴，但发现了可操作按钮，执行离开/重开。");
                leaveAndRestart();
            } else {
                log("未检测到伙伴，也未发现可操作按钮，等待页面更新...");
                // Do nothing and wait for the next mutation.
            }
        }
    }

    /**
     * 【核心优化】防抖处理函数
     */
    function debouncedHandleMutation() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doWork, config.debounceWait);
    }

    // --- 启动脚本 ---
    log("脚本已启动 (v4.1 - 架构修复版)...");

    const appObserver = new MutationObserver((mutations, obs) => {
        const appElement = document.getElementById('app');
        if (appElement) {
            log("#app 元素已加载，开始监视页面变化。");
            obs.disconnect();

            const mainObserver = new MutationObserver(debouncedHandleMutation);
            mainObserver.observe(appElement, {
                childList: true,
                subtree: true
            });

            debouncedHandleMutation();
        }
    });

    appObserver.observe(document.body, { childList: true });

})();
