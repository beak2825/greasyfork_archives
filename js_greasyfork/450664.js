// ==UserScript==
// @name         QQ管家拦截页面直接加载
// @namespace    https://c.pc.qq.com/
// @version      1.0
// @description  qq管家经常会拦截一些群友发的‘有意思’的网址,这个简单的小脚本能绕开管家检测直接进入页面，省得每次都需要复制一次
// @author       U2y
// @match        https://c.pc.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450664/QQ%E7%AE%A1%E5%AE%B6%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/450664/QQ%E7%AE%A1%E5%AE%B6%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myURL = document.querySelector("#url")
    window.location.href = myURL.innerText
})();