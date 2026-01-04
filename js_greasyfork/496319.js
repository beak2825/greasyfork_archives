// ==UserScript==
// @name         叔叔不约自动问三
// @namespace    xiaoc
// @version      1.47.5
// @description  叔叔不约自动发送问候三
// @author       xiaoC
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496319/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%97%AE%E4%B8%89.user.js
// @updateURL https://update.greasyfork.org/scripts/496319/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%97%AE%E4%B8%89.meta.js
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
        if (rightMessageCount !== 2) {
            return;
        }
        // 如果自己已发消息数量为2，则认为是新匹配
        if (rightMessageCount === 2) {
            // 输入，在这里设置问候语
            msgInput.value = "[𝟛𝟝𝟟𝟚𝟠𝟚𝟠𝟝𝟘𝟟Q"
            msgInput.dispatchEvent(new Event('input'))
            msgInput.dispatchEvent(new Event('change'))

            // 发送
            if (msgInput.value == "[𝟛𝟝𝟟𝟚𝟠𝟚𝟠𝟝𝟘𝟟Q" && sendButton) {
                sendButton.click();
            }
         }
    }


    function init() {
        setInterval(() => {
            stay()
        }, 100);
    }

    setTimeout(init, 500);
    })();