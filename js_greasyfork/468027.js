// ==UserScript==
// @name         CSDN解除复制限制
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  copy csdn content
// @author       yanqi Cheng
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468027/CSDN%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/468027/CSDN%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    "use strict"
    let created = false
    // 创建弹窗
    function createPopup(text) {
        const popup = document.createElement("div")
        popup.className = "erick-popup fadein"
        popup.innerText = text
        document.body.appendChild(popup)
        setTimeout(() => {
            popup.remove()
            created = false
        }, 1500)
    }
    // 添加样式
    function addStyle(style) {
        const styleEL = document.createElement("style")
        document.getElementsByTagName("head")[0].appendChild(styleEL)
        styleEL.appendChild(document.createTextNode(style))
    }

    addStyle(`
            @keyframes fadeInAnimation {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .fadein {
                animation: fadeInAnimation ease 0.5s;
                animation-iteration-count: 1;
                animation-fill-mode: forwards;
            }
            .erick-popup {
                opacity: 0;
                position: fixed;
                z-index: 999999999;
                top: 50%;
                left: 50%;
                margin: -20px 0 0 -100px;
                height: 40px;
                width: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50px;
                color: #333;
                background: #ffffff;
                box-shadow: 1px 1px 8px #d9d9d9, -1px -1px 8px #ffffff;
        }`)
    // 设置代码块可编辑
    document.querySelectorAll('pre').forEach(el => {
        el.contentEditable = true
    })
    document.body.onkeyup = function (e) {
        if (e.ctrlKey && e.key === "c") {
            // 使用异步宏任务，等待CSDN同步代码执行完毕
            setTimeout(() => {
                const loginPopup = document.querySelector(".passport-login-container")
                loginPopup && loginPopup.remove && loginPopup.remove()

                const copyContent = window.getSelection().toString()
                navigator.clipboard.writeText(copyContent)
                !created && createPopup("复制成功@yanqiCheng")
                created = true
            })
        }
    }
})();