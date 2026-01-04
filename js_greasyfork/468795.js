// ==UserScript==
// @name         百度移动去广告
// @namespace    http://tampermonkey.net/
// @version      5.4.6
// @icon         https://www.baidu.com/favicon.ico
// @description  这只针对百度移动 也去除掉了底部总要打开app
// @author       xiaobao
// @match        *://*.baidu.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468795/%E7%99%BE%E5%BA%A6%E7%A7%BB%E5%8A%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/468795/%E7%99%BE%E5%BA%A6%E7%A7%BB%E5%8A%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function () {
    setInterval(() => {
        $(".ec_wise_ad").remove()
        $("#page-copyright").remove()
        let sz = document.querySelectorAll("body>div")
        sz.forEach(a => {
            if (a.style.length > 10) {
                if (a.style[0] == "position"
                    && a.style[1] == "bottom"
                    && a.style[2] == "left"
                    && a.style[3] == "z-index"
                    && a.style[4] == "width"
                    && a.style[5] == "height"
                    && a.style[12] == "background-attachment"
                    && a.style[20] == "display") {
                    a.remove()
                }
            }
        })
    }, 5000);
})


