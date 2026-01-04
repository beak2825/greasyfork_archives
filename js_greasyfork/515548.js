// ==UserScript==
// @name         copy
// @namespace    http://quhou.top/
// @version      2024-11-04/1
// @description  开源破解一些网站的禁止复制，免登录/vip复制
// @author       xygodcyx
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515548/copy.user.js
// @updateURL https://update.greasyfork.org/scripts/515548/copy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!navigator || !navigator.clipboard) {
        console.warn("对不起，您的浏览器不支持破解复制，请更换新版的浏览器。------来自 破解禁止复制 插件")
        return
    }

    let copyBtn = document.createElement("button")
    let x = 0
    let y = 0

    window.addEventListener("mouseup", function () {
        if (selectText) {
            showCopyBtn()
        }
    })
    window.addEventListener("mousemove", function (e) {
        x = e.clientX
        y = e.clientY
    })
    window.addEventListener("mousedown", function (e) {
        const target = e.target
        if (target !== copyBtn) {
            hideCopyBtn()
        }
    })

    function showCopyBtn(e) {
        copyBtn.style.left = x + 30 + "px"
        copyBtn.style.top = y - 30 + "px"
        copyBtn.style.visibility = "visible"
    }

    function hideCopyBtn() {
        copyBtn.style.visibility = "hidden"
    }

    // Your code here...
    window.addEventListener("load", function (e) {
        copyBtn.style.padding = "5px"
        copyBtn.style.fontSize = "22px"
        copyBtn.style.color = "#000"
        copyBtn.style.backgroundColor = "#F5F5F5"
        copyBtn.style.border = "0"
        copyBtn.textContent = "复制"
        copyBtn.style.position = "fixed"
        copyBtn.style.zIndex = "99999999"
        copyBtn.style.cursor = "pointer"
        copyBtn.addEventListener("click", function () {
            hideCopyBtn()
            setCopyText()
        })
        hideCopyBtn()
        document.body.append(copyBtn)
    })

    let selectText = ""
    document.addEventListener("selectionchange", function (e) {
        selectText = document.getSelection().toString().trim()
        if (selectText === "") return
    })
    document.addEventListener("selectstart", function () {
    })
    document.addEventListener("select", function () {
    })

    function setCopyText() {
        navigator.clipboard.writeText(selectText).then(res => {
            showSuccess()
        }).catch(() => {
            showError()
        }).finally(()=>{
            selectText = ""
        })
    }

    function showSuccess() {
        showText("#B2F2BB", "复制成功")
    }

    function showError() {
        showText("#FFABAB", "复制失败")
    }

    /**
     * @param {string} bg
     * @param {string} text
     * */
    function showText(bg, text) {
        const textDom = document.createElement("p")
        textDom.style.padding = "5px"
        textDom.style.fontSize = "16px"
        textDom.textContent = text
        textDom.style.color = "#FFF"
        textDom.style.position = "fixed"
        textDom.style.left = x + "px"
        textDom.style.top = y + "px"
        textDom.style.backgroundColor = bg
        textDom.style.zIndex = "99999999"
        document.body.append(textDom)

        const interval = setInterval(() => {
            let y = textDom.style.top.slice(0, -2)
            y -= 2
            textDom.style.top = y + "px"
        }, 16)
        const timeout = setTimeout(() => {
            textDom.remove()
            clearInterval(interval)
            clearTimeout(timeout)
        }, 16 * 40)
    }
})();