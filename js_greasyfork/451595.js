// ==UserScript==
// @name         知乎免登录
// @namespace    https://github.com/LeroyK111
// @version      1.0
// @description  自动关闭知乎模态框登录
// @author       LeroyK
// @match        https://*.zhihu.com/*
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01srv7hA1DUnu9uS0CN_!!6000000000220-2-tps-198-200.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451595/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451595/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const zhihu = setInterval(()=>{
        let btn = document.querySelector(".Modal-closeButton")
        if (btn) {
            btn.click()
        }}, 100)


    // Your code here...
    })();