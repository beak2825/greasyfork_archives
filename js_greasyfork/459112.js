// ==UserScript==
// @name         lanzou+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  蓝奏云粘贴验证码并自动下载
// @author       You
// @include      *://*.lanzou*.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanzoul.com
// @grant        none
// @license      GLPv3
// @downloadURL https://update.greasyfork.org/scripts/459112/lanzou%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/459112/lanzou%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wait(s) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, s * 1000)
        })
    }

    function getItem(item, isClick = false, outSeconds = 3) {
        return new Promise((resolve, reject) => {
            let target = document.querySelector(item)
            let repeat = setInterval(() => {
                if (target) {
                    clearInterval(repeat)
                    if (isClick) {
                        target.click()
                    }
                    resolve(target)
                }
            }, 100)
            setTimeout(() => {
                clearInterval(repeat)
                reject("Not Found")
            }, outSeconds * 1000)
        })

    }

    function autoClose(seconds = 5) {
        setTimeout(() => {
            open("", "_self")
            window.close()
        }, seconds * 1000)
    }

    async function lanZouAutoClick() {
        if (location.href.includes("file")) {
            // 文件下载页
            await wait(5)
            await getItem("#sub div", true)
            await wait(1)
            await getItem("#go a", true)
            autoClose()
        } else {
            // 验证码填写页
            let inputBox = document.getElementById("pwd")
            inputBox.value = await navigator.clipboard.readText()
            await getItem(".passwddiv-btn", true)
            await wait(1)
            await getItem("#downajax a", true)
            autoClose()
        }
    }

    lanZouAutoClick()
})();