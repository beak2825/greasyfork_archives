// ==UserScript==
// @name         叔叔不约只配女生
// @namespace    shushubuyue
// @version      1.1
// @description  在 shushubuyue.net 网站上自动匹配聊天对象，若为“女生”则自动发送问候语，否则自动断开并重新开始。
// @author       akai
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544425/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/544425/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置区 ---
    const config = {
        // 匹配成功后自动发送的消息。如果不想自动发送，请将这里设置为空字符串 ''
        autoReplyMessage: '你好呀',
        // 是否在控制台 (F12) 打印详细日志
        debugMode: true,
        // 拟人化点击的随机延迟范围 (单位：毫秒)
        minDelay: 300,
        maxDelay: 800,
        // 防抖延迟：页面停止变化150毫秒后，再执行检查
        debounceWait: 150
    };
    // ---

    let hasSentMessage = false;
    let isActionInProgress = false; // 操作锁
    let debounceTimer;              // 防抖计时器

    function log(message) {
        if (config.debugMode) {
            console.log(`[叔叔不约脚本] ${new Date().toLocaleTimeString()}: ${message}`);
        }
    }

    /**
     * 拟人化点击函数 (集成操作锁)
     */
    function humanizedClick(element, callback) {
        if (!element || isActionInProgress) return;

        isActionInProgress = true; // 【加锁】
        const randomDelay = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
        log(`准备点击: "${element.innerText.trim()}"，将在 ${randomDelay} 毫秒后执行。`);

        setTimeout(() => {
            log(`执行点击: "${element.innerText.trim()}"`);
            element.click();
            // 如果有回调函数，则执行
            if (callback) {
                callback();
            }
            // 点击后等待页面反应，然后解锁
            setTimeout(() => {
                isActionInProgress = false; // 【解锁】
            }, 500);
        }, randomDelay);
    }

    /**
     * 发送消息
     */
    function sendMessage(message) {
        if (!message) return; // 如果配置的消息为空，则不发送

        const msgInput = document.querySelector("#msgInput");
        const sendButton = document.querySelector(".button-link.msg-send");

        if (msgInput && sendButton) {
            log(`准备发送消息: "${message}"`);
            msgInput.value = message;
            msgInput.dispatchEvent(new Event('input', { bubbles: true }));
            humanizedClick(sendButton);
            hasSentMessage = true;
        }
    }

    /**
     * 执行离开并重新开始的操作
     */
    function leaveAndRestart() {
        hasSentMessage = false; // 重置发送状态

        // 优先寻找“重新开始”按钮
        const restartButton = Array.from(document.querySelectorAll("span.chat-control"))
                                   .find(btn => btn.innerText.trim() === "重新开始");
        if (restartButton) {
            humanizedClick(restartButton);
            return;
        }

        // 如果找不到，则执行“离开”的两步操作
        const leaveButton = document.querySelector("a.button-link.chat-control");
        if (leaveButton) {
            humanizedClick(leaveButton, () => {
                // 在点击“离开”的回调中，再点击“确认”
                const confirmButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
                if (confirmButton) {
                    // 这里的点击也需要拟人化，但不需要再加锁
                    const randomDelay = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
                    setTimeout(() => {
                        log('点击弹窗中的“确认离开”按钮');
                        confirmButton.click();
                    }, randomDelay);
                }
            });
        }
    }

    /**
     * 核心检查逻辑
     */
    function doWork() {
        if (isActionInProgress) return;

        const partnerInfo = document.querySelector("#partnerInfoText");

        if (partnerInfo && partnerInfo.innerText.trim() !== "") {
            const partnerText = partnerInfo.innerText;
            if (partnerText.includes("女生")) {
                if (!hasSentMessage) {
                    log(`匹配成功: [${partnerText}]。`);
                    sendMessage(config.autoReplyMessage);
                }
            } else {
                log(`匹配对象: [${partnerText}]。不符合条件。`);
                leaveAndRestart();
            }
        } else {
            // 如果没找到伙伴信息，则检查是否存在“重新开始”按钮
            const restartButton = Array.from(document.querySelectorAll("span.chat-control"))
                                       .find(btn => btn.innerText.trim() === "重新开始");
            if (restartButton) {
                log("未检测到伙伴，但发现了“重新开始”按钮，执行点击。");
                leaveAndRestart();
            } else {
                log("未检测到伙伴，也未发现可操作按钮，等待页面更新...");
            }
        }
    }

    /**
     * 防抖处理函数
     */
    function debouncedHandleMutation() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doWork, config.debounceWait);
    }

    // --- 启动脚本 ---
    log("专业优化版脚本已启动...");

    const appObserver = new MutationObserver((mutations, obs) => {
        const appElement = document.getElementById('app');
        if (appElement) {
            log("#app 元素已加载，开始监视页面变化。");
            obs.disconnect();

            const mainObserver = new MutationObserver(debouncedHandleMutation);
            mainObserver.observe(appElement, {
                childList: true,
                subtree: true,
                characterData: true // 监视文本内容变化
            });

            debouncedHandleMutation();
        }
    });

    appObserver.observe(document.body, { childList: true });

})();