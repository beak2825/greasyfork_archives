// ==UserScript==
// @name         ssby-自动匹配并自动离开
// @namespace    wwbnq
// @version      0.1
// @description  自动匹配脚本（增强版）
// @author       WWBNQ
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @match        *://*.unclenoway.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529592/ssby-%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%A6%BB%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/529592/ssby-%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%A6%BB%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GREETING = "你好！";

    // 打印日志函数
    function log(message) {
        console.log(`[SSBY-DEBUG] ${message}`);
    }

    function isPartnerLeftBySystemMessage() {
        const systemMessages = document.querySelectorAll('.sys-msg.sys-msg-red');
        for (const message of systemMessages) {
            const partnerInfo = message.querySelector("#partnerInfoText");
            if (partnerInfo && partnerInfo.innerText.trim() === "对方离开了。") {
                log("检测到系统消息：对方离开了。");
                return true;
            }
        }
        return false;
    }

    function isDisconnected() {
        const systemMessages = document.querySelectorAll('.sys-msg.sys-msg-red');
        for (const message of systemMessages) {
            const partnerInfo = message.querySelector("#partnerInfoText");
            if (partnerInfo && partnerInfo.innerText.trim() === "您断开了连线。") {
                log("检测到自身状态：您断开了连线。");
                return true;
            }
        }
        return false;
    }

    function stay() {
        try {
            const msgInput = document.querySelector("#msgInput");
            const sendButton = document.querySelector("a.button-link.msg-send");
            const rightMessageCount = document.querySelectorAll(".message.right").length;

            const isPartnerLeft = () => {
                const partnerInfo = document.querySelector("#partnerInfoText");
                const leftBySystem = isPartnerLeftBySystemMessage();
                if (!partnerInfo || partnerInfo.innerText.trim() === "对方离开了。" || leftBySystem) {
                    log("检测到对方已离开，准备处理离开逻辑。");
                    return true;
                }
                return false;
            };

            if (isPartnerLeft()) {
                handlePartnerLeft();
                return;
            }

            if (rightMessageCount !== 0) {
                log("已有发送的消息，无需再次发送问候语。");
                return;
            }

            if (!msgInput || !sendButton) {
                log("未找到消息输入框或发送按钮，准备处理离开逻辑。");
                handlePartnerLeft();
                return;
            }

            msgInput.value = GREETING;
            msgInput.dispatchEvent(new Event('input'));
            msgInput.dispatchEvent(new Event('change'));

            if (isPartnerLeft()) {
                handlePartnerLeft();
                return;
            }

            if (msgInput.value === GREETING) {
                log("发送问候语：" + GREETING);
                sendButton.click();
            }
        } catch (e) {
            log("stay 函数发生错误：" + e.message);
        }
    }

    function leave() {
        try {
            const leaveButton = document.querySelector("a.button-link.chat-control");
            if (leaveButton) {
                log("点击离开按钮。");
                leaveButton.click();

                // 检查是否存在二次确认的离开按钮
                setTimeout(() => {
                    const confirmLeaveButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
                    if (confirmLeaveButton && confirmLeaveButton.innerText === "离开") {
                        log("点击二次确认的离开按钮。");
                        confirmLeaveButton.click();
                    }
                }, 500); // 延迟500ms以确保弹窗加载完成
            }
        } catch (e) {
            log("leave 函数发生错误：" + e.message);
        }
    }

    function handlePartnerLeft() {
        try {
            let leaveButton = document.querySelector("span.chat-control");

            if (leaveButton && leaveButton.innerText === "离开") {
                log("检测到离开按钮，点击离开。");
                leaveButton.click();

                // 检查是否存在二次确认的离开按钮
                setTimeout(() => {
                    const confirmLeaveButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
                    if (confirmLeaveButton && confirmLeaveButton.innerText === "离开") {
                        log("点击二次确认的离开按钮。");
                        confirmLeaveButton.click();
                    }
                }, 500); // 延迟500ms以确保弹窗加载完成
            } else {
                // 检查是否满足重新开始的前置条件
                const disconnectedMessage = Array.from(document.querySelectorAll('.sys-msg.sys-msg-red')).find(message => {
                    const partnerInfo = message.querySelector("#partnerInfoText");
                    return partnerInfo && partnerInfo.innerText.trim() === "您断开了连线。";
                });

                if (disconnectedMessage) {
                    log("检测到断开连线消息，尝试点击重新开始按钮。");
                    // 精确定位“重新开始”按钮
                    const restartButton = document.querySelector(".bar-footer.msg-footer .chat-control");
                    if (restartButton && restartButton.innerText === "重新开始") {
                        log("点击重新开始按钮。");
                        restartButton.click();
                    }
                }
            }
        } catch (e) {
            log("handlePartnerLeft 函数发生错误：" + e.message);
        }
    }

    function init() {
        setInterval(() => {
            try {
                const tab = document.querySelector("#partnerInfoText");
                const tabText = tab ? tab.innerText.trim() : '';

                // 判断自身状态是否为“您断开了连线”
                if (isDisconnected()) {
                    log("检测到自身状态：您断开了连线，进入重新开始逻辑。");
                    handlePartnerLeft();
                    return;
                }

                if (tabText === "对方离开了。" || isPartnerLeftBySystemMessage()) {
                    log("检测到对方离开，进入离开处理逻辑。");
                    handlePartnerLeft();
                    return;
                }

                if (tabText.includes("女生")) {
                    log("检测到对方为女生，保持会话。");
                    stay();
                } else if (tabText.includes("男生")) {
                    log("检测到对方为男生，离开会话。");
                    leave();
                } else {
                    log("未知状态，等待进一步检测。");
                }
            } catch (e) {
                log("init 函数发生错误：" + e.message);
            }
        }, 500);
    }

    setTimeout(() => {
        log("初始化脚本...");
        init();
    }, 5000);
})();