// ==UserScript==000000000000000000000000
// @namespace     xiagiegie
// @name         不许看p站
// @version      1.0
// @description  不许色色
// @author       xiagiegie
// @match        https://cn.pornhub.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      xiagiegieshoufa
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450724/%E4%B8%8D%E8%AE%B8%E7%9C%8Bp%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/450724/%E4%B8%8D%E8%AE%B8%E7%9C%8Bp%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    let body = document.getElementsByTagName("body")[0]
    body.innerHTML = ""
    let willAppear = document.createElement("div")
    willAppear.innerText = "别看p站了,快去学习!"
    willAppear.style.cssText = "font-size: 46px;margin: 200px auto;width: 0ch;height: 2ch;overflow: hidden;"
    body.appendChild(willAppear)
        // 写个递归的定时器，从而实现动画
    setTimeout(() => {
        willAppear.style.width = "2ch"
    }, 500)
    setTimeout(() => {
        willAppear.style.width = "4ch"
    }, 1000)
    setTimeout(() => {
        willAppear.style.width = "7ch"
    }, 1500)
    setTimeout(() => {
        willAppear.style.width = "10ch"
    }, 2000)
    setTimeout(() => {
        willAppear.style.width = "12ch"
    }, 2500)
    setTimeout(() => {
        willAppear.style.width = "14ch"
    }, 3000)
    setTimeout(() => {
        willAppear.style.width = "16ch"
    }, 3500)
    setTimeout(() => {
        willAppear.style.width = "18ch"
        let button = document.createElement("button")
        button.innerHTML = "点我去学习"
        button.style.cssText = "position: absolute; top:300px;right:730px"
        body.appendChild(button)
        button.onclick = function() {
            window.location.href = "https://www.bilibili.com/video/BV1Eb411u7Fw?spm_id_from=333.337.search-card.all.click"
        }
    }, 4000)
})();