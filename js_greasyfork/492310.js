// ==UserScript==
// @name         简书弹窗优化
// @namespace    http://tampermonkey.net/
// @version      2024-04-12
// @description  移除简书安装客户端弹窗
// @author       LingQi
// @match        *://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492310/%E7%AE%80%E4%B9%A6%E5%BC%B9%E7%AA%97%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492310/%E7%AE%80%E4%B9%A6%E5%BC%B9%E7%AA%97%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(() => {
        if (document.body.hasAttribute("style")) {
            document.body.removeAttribute("style");
            document.body.removeAttribute("class");
            document.querySelector("body > div:nth-child(14) > div > div._23ISFX-mask").classList.add("_23ISFX-mask-hidden");
            document.querySelector("body > div:nth-child(14) > div > div._23ISFX-wrap._23ISFX-wrap-middle").style.display = "none";
            console.log(1);
            clearInterval();
        }
    }, 100);
    window.onload = () => {
    }
})();