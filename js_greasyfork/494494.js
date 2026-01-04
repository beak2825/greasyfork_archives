// ==UserScript==
// @name         自动消息
// @namespace    wwbnq
// @version      0.98.2
// @description  叔叔不约自动消息
// @author       WWBNQ
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494494/%E8%87%AA%E5%8A%A8%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/494494/%E8%87%AA%E5%8A%A8%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==


//整体流程：每秒执行一次检查，每次检查中先检查当前是否为男生，再检查是否为新男生


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

    function stay() {
        //输入框
        var msgInput = document.querySelector("#msgInput")
        //发送按钮
        var sendButton = document.querySelector("a.button-link.msg-send")
        // 自己已发消息数量
        var rightMessageCount = document.querySelectorAll(".message.right").length;

        // 若已经发送消息则直接返回
        if (rightMessageCount !== 0) {
            return;
        }
        // 如果自己已发消息数量为0，则认为是新女生
        if (rightMessageCount === 0) {
            // 输入，在这里设置问候语
            msgInput.value = "晒选姓别脚I笨需要吗"
            msgInput.dispatchEvent(new Event('input'))
            msgInput.dispatchEvent(new Event('change'))

            // 发送
            if (msgInput.value == "晒选姓别脚I笨需要吗" && sendButton) {
                sendButton.click();
            }
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

            if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
                // 如果是男生，调用 stay() 函数
                stay();
            } else if (tabText && typeof tabText == 'string' && tabText.indexOf("生") != -1) {
                // 如果是生，调用 leave() 函数
                leave();
            }

        }, 500);
    }

    setTimeout(init, 2500);
    })();