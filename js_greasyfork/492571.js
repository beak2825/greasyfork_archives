// ==UserScript==
// @name         叔叔不约自动问候
// @namespace    wwbnq
// @version      0.1
// @description  叔叔不约自动发送问候语
// @author       WWBNQ
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492571/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%80%99.user.js
// @updateURL https://update.greasyfork.org/scripts/492571/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%97%AE%E5%80%99.meta.js
// ==/UserScript==

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
        // 如果自己已发消息数量为0，则认为是新匹配
        if (rightMessageCount === 0) {
            // 输入，在这里设置问候语
            msgInput.value = "你好鸭！"
            msgInput.dispatchEvent(new Event('input'))
            msgInput.dispatchEvent(new Event('change'))

            // 发送
            if (msgInput.value == "你好鸭！" && sendButton) {
                sendButton.click();
            }
         }
    }


    function init() {
        setInterval(() => {
            stay()
        }, 1000);
    }

    setTimeout(init, 5000);
    })();