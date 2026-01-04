// ==UserScript==
// @name         叔叔不约自动聊天
// @namespace    zhaoxiaqian
// @version      1.0
// @description  叔叔不约只配女 并自动问好
// @author       WWBNQ
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487163/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/487163/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function pd() {
        var tab = document.querySelector("#partnerInfoText")
        if (tab) {
            var tabText = tab.innerText
        if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
            fs("你好啊");
        } else if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
            fs("你好");
            //主动离开();
        }
                 }
    }

    function fs(xiaoxi) {
        var xx = xiaoxi;
        var xxs1 = document.getElementsByClassName("readSign").length
        var msgInput = document.querySelector("#msgInput")
        var sendButton = document.querySelector("a.button-link.msg-send")
        msgInput.value = xx;
        do{
            msgInput.dispatchEvent(new Event('input'))
            msgInput.dispatchEvent(new Event('change'))
            sendButton.click();
            var xxs2 = document.getElementsByClassName("readSign").length
            }
        while(xxs1==xxs2)
    }

    function dflk() {
        var lk = document.querySelector("span.chat-control").innerText
        if(lk == '离开'){
            document.querySelector("span.chat-control").click();
            document.querySelector("span.chat-control").click();
        }
        if(lk=="从新开始"){
            document.querySelector("span.chat-control").click();
        }
    }

        function zdlk() {
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

        setInterval(() => {
            dflk();
            pd();
        }, 1000);

    })();