// ==UserScript==
// @name         Union Build Auto Transfer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automates transfer process on app.union.build/transfer with refresh persistence.
// @author       @dami16z
// @match        https://app.union.build/transfer*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535449/Union%20Build%20Auto%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/535449/Union%20Build%20Auto%20Transfer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_VALUE = "0.00001";
    const MAX_WAIT_TIME = 10000;
    const MIN_DELAY = 3000;
    const MAX_DELAY = 5000;
    const PAGE_INACTIVE_TIMEOUT = 15000;
    const SCRIPT_ID = "union_build_auto_transfer_v1"; // << 修改为固定ID

    function saveState(state) {
        try {
            localStorage.setItem(SCRIPT_ID + "_state", JSON.stringify(state));
            console.log("已保存脚本状态:", state);
        } catch (e) {
            console.error("保存状态失败:", e);
        }
    }

    function loadState() {
        try {
            const savedState = localStorage.getItem(SCRIPT_ID + "_state");
            if (savedState) {
                const state = JSON.parse(savedState);
                console.log("已加载脚本状态:", state);
                return state;
            }
        } catch (e) {
            console.error("加载状态失败:", e);
        }
        return { step: "start", attempts: 0, lastActive: Date.now() };
    }

    async function waitForElement(selector, timeout = MAX_WAIT_TIME) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    }

    function clickElement(element) {
        return new Promise((resolve) => {
            if (element) {
                updateActivityTimestamp();
                element.click();
                console.log(`点击元素: ${element.textContent || element.nodeName}`);
                setTimeout(resolve, 500); // 短暂延时确保点击事件处理
            } else {
                console.error("未找到需要点击的元素");
                resolve(); // 继续执行，避免Promise卡住
            }
        });
    }

    function randomDelay(min = MIN_DELAY, max = MAX_DELAY) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`等待 ${delay / 1000} 秒...`);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async function waitForButtonEnabled(selector, timeout = MAX_WAIT_TIME) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                return button;
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // 短暂轮询间隔
        }
        throw new Error(`按钮 ${selector} 未变为可用状态`);
    }

    async function findButtonByText(textContent, timeout = MAX_WAIT_TIME) {
        try {
            // 尝试jQuery :contains (如果enhanceQuerySelector未成功或页面有jQuery)
            return await waitForElement(`button:contains("${textContent}")`, timeout);
        } catch (error) {
            console.log(`未能通过 :contains 找到按钮 "${textContent}"，尝试其他方法...`);
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const buttons = Array.from(document.querySelectorAll('button'));
                // 精确或部分匹配
                let button = buttons.find(btn => btn.textContent && btn.textContent.trim().includes(textContent));
                if (button) {
                    console.log(`通过文本内容找到按钮: ${textContent}`);
                    updateActivityTimestamp();
                    return button;
                }
                // 尝试小写匹配
                const lowercaseText = textContent.toLowerCase();
                button = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes(lowercaseText));
                if (button) {
                    console.log(`通过小写文本找到按钮: ${button.textContent}`);
                    updateActivityTimestamp();
                    return button;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`未能找到文本为 "${textContent}" 的按钮`);
        }
    }

    function updateActivityTimestamp() {
        const state = loadState(); // 加载当前状态以避免覆盖其他可能由异步操作更新的部分
        state.lastActive = Date.now();
        saveState(state);
        // console.log("页面活动时间戳已更新"); // 可以减少这个日志的频率
    }

    function isPageStuck() {
        const state = loadState();
        const inactiveTime = Date.now() - state.lastActive;
        const isStuck = inactiveTime > PAGE_INACTIVE_TIMEOUT;
        if (isStuck) {
            console.warn(`页面已卡住 ${inactiveTime / 1000} 秒无活动`);
        }
        return isStuck;
    }

    function prepareForRefresh(currentStep) {
        const state = loadState();
        state.step = currentStep;
        state.refreshTime = Date.now();
        state.attempts = (state.attempts || 0) + 1;
        saveState(state);
        sessionStorage.setItem(SCRIPT_ID + "_refreshing", "true"); // 使用SCRIPT_ID确保唯一性
        console.log(`准备刷新页面，当前步骤: ${currentStep}, 尝试次数: ${state.attempts}`);
    }

    function isRecoveringFromRefresh() {
        const isRefreshing = sessionStorage.getItem(SCRIPT_ID + "_refreshing") === "true";
        if (isRefreshing) {
            sessionStorage.removeItem(SCRIPT_ID + "_refreshing"); // 使用后移除
            return true;
        }
        return false;
    }

    async function performTransferProcess() {
        try {
            console.log("======= 开始新的转账流程 =======");
            let state = loadState(); // 在流程开始时加载状态
            updateActivityTimestamp(); // 更新活动时间

            if (isRecoveringFromRefresh()) { // 这个判断需要在loadState之后
                console.log(`从刷新恢复，尝试从步骤 "${state.step}" 继续`);
            }
            // shouldSkipTo的逻辑依赖于isRecoveringFromRefresh和state.step
            let shouldSkipTo = (isRecoveringFromRefresh() && state.step) ? state.step : "start";


            if (shouldSkipTo === "start" || shouldSkipTo === "input_amount") {
                state.step = "input_amount"; saveState(state);
                const inputBox = await waitForElement('#amount'); // 假设输入框ID是 'amount'
                inputBox.focus();
                inputBox.value = INPUT_VALUE;
                inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                console.log(`输入金额: ${INPUT_VALUE}`);
                updateActivityTimestamp();
                await randomDelay(500, 1000);
            }

            state = loadState(); // 重新加载状态，以防异步操作间隙有变化
            if (shouldSkipTo === "start" || shouldSkipTo === "input_amount" || shouldSkipTo === "transfer_ready") {
                state.step = "transfer_ready"; saveState(state);
                const transferReadyBtn = await findButtonByText("Transfer ready"); // 根据实际按钮文本修改
                await clickElement(transferReadyBtn);
                updateActivityTimestamp();
            }

            state = loadState();
            if (shouldSkipTo === "start" || shouldSkipTo === "input_amount" || shouldSkipTo === "transfer_ready" || shouldSkipTo === "submit") {
                state.step = "submit"; saveState(state);
                const submitBtn = await findButtonByText("Submit"); // 根据实际按钮文本修改
                await clickElement(submitBtn);
                updateActivityTimestamp();
            }

            state.step = "new_transfer"; saveState(state); // 更新状态为准备开始新转账或查找返回按钮
            try {
                const newTransferBtn = await findButtonByText("New transfer"); // 根据实际按钮文本修改
                await clickElement(newTransferBtn);
                updateActivityTimestamp();
            } catch (newTransferError) {
                console.warn(`未找到 "New transfer" 按钮: ${newTransferError.message}`);
                console.log("尝试查找其他可能的返回/继续按钮...");
                const possibleButtonTexts = ["Back", "Return", "Continue", "OK", "Done", "Confirm", "新转账", "返回", "完成"];
                let buttonFound = false;
                for (const text of possibleButtonTexts) {
                    try {
                        const alternativeBtn = await findButtonByText(text, 3000); // 较短超时查找备选按钮
                        console.log(`找到替代按钮: ${text}`);
                        await clickElement(alternativeBtn);
                        buttonFound = true;
                        updateActivityTimestamp();
                        break;
                    } catch (e) {
                        // 未找到此文本的按钮，继续尝试下一个
                    }
                }
                if (!buttonFound) {
                    // 检查是否已经回到了有金额输入框的页面
                    const isBackOnTransferForm = document.querySelector('#amount') !== null;
                    if (isBackOnTransferForm) {
                        console.log("已检测到转账表单 (金额输入框存在)，认为已返回，准备下一轮转账。");
                        updateActivityTimestamp();
                    } else {
                        console.log("未找到返回按钮且不在转账表单页面，可能需要刷新或流程已意外结束。");
                        throw new Error("界面可能卡住或流程意外导向，无法找到明确的操作按钮返回转账表单。");
                    }
                }
            }

            state = loadState();
            state.step = "start"; // 成功完成一轮，重置步骤为开始
            state.attempts = 0; // 如果流程成功，重置尝试次数
            state.lastActive = Date.now();
            saveState(state);
            console.log("转账流程成功完成一轮");

        } catch (error) {
            console.error(`转账流程出错: ${error.message}`);
            const currentState = loadState(); // 获取当前状态以决定是否刷新
            if (isPageStuck() || (error.message && error.message.includes("超时")) || (error.message && error.message.includes("未变为可用状态")) || (error.message && error.message.includes("无法找到操作按钮"))) {
                console.warn("检测到页面卡住或关键元素超时，准备刷新恢复...");
                prepareForRefresh(currentState.step); // 使用当前步骤准备刷新
                setTimeout(() => {
                    console.log("执行页面刷新...");
                    location.reload();
                }, 500);
                return new Promise(() => {}); // 返回一个永远不解析的Promise，以停止当前执行链
            }
            throw error; // 如果不是卡住或超时，则重新抛出错误由主循环处理
        }
    }

    function enhanceQuerySelector() {
        // 这个函数尝试模拟 :contains 选择器，但如果页面本身加载了jQuery，jQuery的 :contains 通常更可靠。
        // 对于现代浏览器，可以考虑使用更标准的DOM遍历方法替代。
        // 为简化，这里保持原样，但注意其局限性。
        if (typeof window.jQuery === 'undefined') { // 仅在jQuery未定义时增强
            Document.prototype.querySelectorAll = (function(originalQuerySelectorAll) {
                return function(selector) {
                    try {
                        if (selector.includes(':contains(')) {
                            const match = selector.match(/(.*):contains\("([^"]*)"\)(.*)/);
                            if (match) {
                                const [, beforeContains, containsText, afterContains] = match;
                                const baseSelector = (beforeContains + afterContains).trim() || '*';
                                const allElements = originalQuerySelectorAll.call(this, baseSelector);
                                return Array.from(allElements).filter(el => el.textContent && el.textContent.includes(containsText));
                            }
                        }
                        return originalQuerySelectorAll.call(this, selector);
                    } catch (e) {
                        console.error('选择器错误:', e, "选择器:", selector);
                        return originalQuerySelectorAll.call(this, selector); // 发生错误时回退
                    }
                };
            })(Document.prototype.querySelectorAll);

            Document.prototype.querySelector = function(selector) {
                const elements = this.querySelectorAll(selector);
                return elements.length ? elements[0] : null;
            };

            // Element原型也需要更新，以确保在元素上下文中调用也能使用增强版
            Element.prototype.querySelectorAll = Document.prototype.querySelectorAll;
            Element.prototype.querySelector = Document.prototype.querySelector;
             console.log("QuerySelector enhanced with :contains support (basic).");
        } else {
            console.log("jQuery detected, :contains selector should work natively.");
        }
    }


    function setupActivityMonitors() {
        const userEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove']; // 添加mousemove
        userEvents.forEach(eventType => {
            document.addEventListener(eventType, () => { updateActivityTimestamp(); }, { passive: true });
        });

        // 监控 fetch 和 XHR
        if (typeof window.fetch === 'function') {
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                updateActivityTimestamp();
                return originalFetch.apply(this, args);
            };
        }

        if (typeof XMLHttpRequest !== 'undefined') {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(...args) {
                this.addEventListener('loadend', updateActivityTimestamp, { passive: true }); // 监控请求完成
                return originalOpen.apply(this, args);
            };
        }
        // 定期检查页面是否卡住的逻辑已在主循环的错误处理和isPageStuck中实现
        // 可以额外增加一个定时器，定期更新时间戳，防止页面无任何事件但也未卡住的情况
        setInterval(() => {
            // console.log("Periodic activity update check"); // 用于调试
            // 只是为了确保如果页面有背景活动但无用户交互或网络请求，时间戳也能更新
            // 但要注意这个本身也可能被视为一种“活动”，所以updateActivityTimestamp内部的逻辑很重要
            if (!isPageStuck()) { // 仅在页面未卡住时更新，避免掩盖卡住状态
                 // updateActivityTimestamp(); // 这个可能过于频繁，如果上面事件监控足够可以考虑去掉
            } else {
                console.warn("Periodic check: Page seems stuck based on last activity.");
            }
        }, Math.min(10000, PAGE_INACTIVE_TIMEOUT / 2)); // 每10秒或超时时间的一半检查一次
    }

    async function startAutomation() {
        enhanceQuerySelector(); // 尽早执行，确保后续选择器可用
        setupActivityMonitors();

        if (!localStorage.getItem(SCRIPT_ID + "_state")) {
            saveState({ step: "start", attempts: 0, lastActive: Date.now() });
        }

        console.log("===== 自动转账程序已启动 (Tampermonkey) =====");
        console.log(`脚本ID: ${SCRIPT_ID}`);
        console.log(`金额设置为: ${INPUT_VALUE}`);
        console.log(`当前页面: ${window.location.href}`);

        let stateOnStart = loadState();
        if (isRecoveringFromRefresh() && stateOnStart.step) { // 确保stateOnStart.step有效
            console.log(`从页面刷新中恢复，当前状态: ${JSON.stringify(stateOnStart)}`);
        } else if (stateOnStart.step !== "start") {
            console.log(`脚本启动时检测到非初始状态: ${JSON.stringify(stateOnStart)}。将尝试从 ${stateOnStart.step} 继续。`);
        }


        let consecutiveErrors = 0;
        const MAX_CONSECUTIVE_ERRORS = 3; // 定义最大连续错误次数

        while (true) {
            try {
                await performTransferProcess();
                consecutiveErrors = 0; // 成功执行后重置错误计数
                let currentState = loadState();
                currentState.attempts = 0; // 成功完成一轮，重置特定于刷新的尝试次数
                saveState(currentState);
                await randomDelay(); // 完成一轮后的随机等待
            } catch (error) {
                consecutiveErrors++;
                console.error(`主循环出错 (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): ${error.message}`);
                const currentState = loadState(); // 获取最新状态

                if (isPageStuck() || consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                    if (isPageStuck()) console.warn("主循环检测到页面卡住，准备刷新页面...");
                    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) console.error(`连续发生 ${consecutiveErrors} 次错误，程序将刷新页面并尝试重新启动...`);

                    prepareForRefresh(currentState.step || "start"); // 如果步骤未知，则从start开始
                    setTimeout(() => {
                        console.log("执行页面刷新 (由于卡住或过多错误)...");
                        location.reload();
                    }, 1000); // 给一点时间让日志记录
                    // 等待页面刷新，这是一个不会 resolve 的 Promise
                    await new Promise(() => {});
                }
                // 如果错误次数未达上限且页面未卡住，则在下次循环前等待一段时间
                await randomDelay(MIN_DELAY * 2, MAX_DELAY * 2); // 出错后等待更长时间
            }
        }
    }

    // 确保DOM加载完成后再启动自动化，以防元素查找过早失败
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutomation);
    } else {
        startAutomation();
    }

})();