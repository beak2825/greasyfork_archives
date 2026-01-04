// ==UserScript==
// @name         叔叔不约只配女并自动问好，自动重开
// @namespace    shllwetalk
// @version      1.1
// @description  叔叔不约只配女 并自动问好，自动重开
// @author       shallwetalk
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503155/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%A5%BD%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%87%8D%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/503155/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%A5%BD%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%87%8D%E5%BC%80.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 问候语
    const GREETING = "你好呀";
    let isReMatchingEnabled = true; // 设置为 true 表示开启重新匹配，false 表示关闭
    let isHelloEnabled = true; // 设置为 true 表示开启打招呼，false 表示关闭

    function stay() {
        const msgInput = document.querySelector("#msgInput");
        const sendButton = document.querySelector("a.button-link.msg-send");
        const rightMessageCount = document.querySelectorAll(".message.right").length;

        if (rightMessageCount !== 0) return;

        msgInput.value = GREETING;
        msgInput.dispatchEvent(new Event('input'));
        msgInput.dispatchEvent(new Event('change'));

        if (msgInput.value === GREETING && sendButton) sendButton.click();
    }

    function leave() {
        const leftButton = document.querySelector("a.button-link.chat-control");
        if (leftButton) leftButton.click();

        const leftSecondButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
        if (leftSecondButton) leftSecondButton.click();

        const restartButton = document.querySelector("span.chat-control");
        if (restartButton && restartButton.innerText) {
            if (restartButton.innerText === "离开") {
                restartButton.click();
                setTimeout(() => restartButton.click(), 500);
            } else if (restartButton.innerText === "重新开始") {
                restartButton.click();
            }
        }
    }

    function leave1() {
        const restartButton = document.querySelector("span.chat-control");
        if (restartButton && restartButton.innerText) {
            if (restartButton.innerText === "离开") {
                restartButton.click();
                setTimeout(() => restartButton.click(), 500);
            } else if (restartButton.innerText === "重新开始") {
                restartButton.click();
            }
        }
    }

    function checkPartnerGender() {
        const tab = document.querySelector("#partnerInfoText");
        const tabText = tab ? tab.innerText.trim() : null;
        if(isReMatchingEnabled){
            leave1();
        }
        if (tabText && tabText.includes("女生")) {
            if(isHelloEnabled){
                stay();
            }
        } else if (tabText && tabText.includes("男生")) {
            leave();
        }
    }

    function init() {
        checkPartnerGender();
    }

    setInterval(checkPartnerGender, 2000); // 每两秒检查一次性别
    setTimeout(init, 5000); // 延迟5秒后启动脚本
})();