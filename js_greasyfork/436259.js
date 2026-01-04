// ==UserScript==
// @name         自动关闭知乎登录窗口等
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  打开知乎文章总是弹出烦人的登录窗口，通过此脚本自动关闭知乎登录窗口,新增删除右下角登陆提示div
// @author       zhaoqd
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436259/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436259/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer1 = setInterval(() => {
        let btn = document.querySelector('.Modal-closeButton')
        if(btn){
            btn.click()
            clearInterval(timer1)
        }
    },100)
    let timer2 = setInterval(() => {
        let loginDiv = document.querySelector('.css-1ynzxqw')
        if(loginDiv){
            loginDiv.remove()
            clearInterval(timer2)
        }
    },100)
})();