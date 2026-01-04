// ==UserScript==
// @name         叔叔不约自动匹配女
// @namespace    seventeen
// @version      1.0
// @description  叔叔不约自动匹配女1.0
// @author       seventeen
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @match        *://*.pingzishuo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494046/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E5%A5%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/494046/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E5%A5%B3.meta.js
// ==/UserScript==





//输入框
// document.querySelector("#msgInput").value


// //离开按钮(左边)
// document.querySelector("a.button-link.chat-control").click()
// document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger").click()

// //离开-重开按钮(中间)
// document.querySelector("span.chat-control").click()
// document.querySelector("span.chat-control").innerText == '离开' / '重新开始'

(function () {

    'use strict';

    // 声明一个标志变量，用于判断是否已经发送消息
    var messageSent = false;

    function stay() {
        //输入框
        var msgInput = document.querySelector("#msgInput")
        //发送按钮
        var sendButton = document.querySelector("a.button-link.msg-send")

        // 判断是否已经发送消息，如果是则直接返回
        if (messageSent) {
            return;
        }

        // 输入
        msgInput.value = "晚上会yang吗"
        msgInput.dispatchEvent(new Event('input'))
        msgInput.dispatchEvent(new Event('change'))

        // 发送
        if (msgInput.value == "晚上会yang吗" && sendButton) {
            sendButton.click();
            // 设置标志变量为 true，表示已经发送消息
            messageSent = true;
        }
    }

    function leave() {
        var leftButton = document.querySelector("a.button-link.chat-control");
        if (leftButton) leftButton.click()
        var leftSecondButton = document.querySelector(
            "span.actions-modal-button.actions-modal-button-bold.color-danger")
        if (leftSecondButton) leftSecondButton.click()

        var restartButton = document.querySelector("span.chat-control")
        if (restartButton && restartButton.innerText) {
            if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
                restartButton.click()
                setTimeout(function () {
                    restartButton.click()
                }, 500)
            } else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
restartButton.click()
            } else {
                console.log("error restartButton")
            }
        }
    }

    function init() {
        setInterval(() => {
            var tab = document.querySelector("#partnerInfoText")
            if (tab) var tabText = tab.innerText

            if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
                // 如果是女生，调用 stay() 函数
                stay();
            
            } else if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
                // 如果是男生，调用 leave() 函数
                leave();
                // 重置标志变量为 false，以便在下一次匹配到女生时再次发送消息
                messageSent = false;
            }

        }, 1000);
    }

    setTimeout(init, 5000);

})();