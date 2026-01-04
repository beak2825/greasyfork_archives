// ==UserScript==
// @name         叔叔不约只配女并自动问好
// @namespace    wwbnq
// @version      0.8
// @description  叔叔不约只配女 并自动问好
// @author       WWBNQ
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483290/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483290/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%A5%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ************在这里定义问候语*************
    const GREETING = "你好鸭！";

    // 当检测到新女生时，发送问候语
    function stay() {
        const msgInput = document.querySelector("#msgInput");  // 输入框
        const sendButton = document.querySelector("a.button-link.msg-send");  // 发送按钮
        const rightMessageCount = document.querySelectorAll(".message.right").length;  // 已发送的消息数量

        // 若已经发送消息则直接返回
        if (rightMessageCount !== 0) return;

        // 如果自己已发消息数量为0，则认为是新女生
        msgInput.value = GREETING;  // 设置问候语
        msgInput.dispatchEvent(new Event('input'));  // 触发输入事件
        msgInput.dispatchEvent(new Event('change'));  // 触发更改事件

        // 发送消息
        if (msgInput.value === GREETING && sendButton) sendButton.click();
    }

    // 当检测到对方是男生时，离开聊天并重新开始
    function leave() {
        const leftButton = document.querySelector("a.button-link.chat-control");  // 离开按钮
        if (leftButton) leftButton.click();

        const leftSecondButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");  // 确认离开按钮
        if (leftSecondButton) leftSecondButton.click();

        const restartButton = document.querySelector("span.chat-control");  // 重新开始按钮
        if (restartButton && restartButton.innerText) {
            if (restartButton.innerText === "离开") {
                restartButton.click();
                setTimeout(() => restartButton.click(), 500);
            } else if (restartButton.innerText === "重新开始") {
                restartButton.click();
            } else {
                console.error("error restartButton");
            }
        }
    }

    // 初始化函数，设置每秒检查一次当前对方信息
    function init() {
        setInterval(() => {
            const tab = document.querySelector("#partnerInfoText");  // 对方信息标签
            const tabText = tab ? tab.innerText : null;

            // ***********在这里修改想匹配的性别***********
            if (tabText && tabText.includes("女生")) {
                stay();  // 若为女生，调用 stay() 函数
            } else if (tabText && tabText.includes("男生")) {
                leave();  // 若为男生，调用 leave() 函数
            }
        }, 1000);
    }

    // 延迟5秒后启动脚本
    setTimeout(init, 5000);
})();
