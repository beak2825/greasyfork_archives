// ==UserScript==
// @name         JuejinUtils
// @namespace    http://tampermonkey.net/
// @version      2025-06-03
// @description  1. 链接直接跳转；2. 隐藏登录提示
// @author       popobaba
// @license      MIT
// @match        https://link.juejin.cn/?target=*
// @match        https://link.juejin.cn?target=*
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538143/JuejinUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/538143/JuejinUtils.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let host = window.location.host
    console.log("host", host)
    if (host == 'link.juejin.cn') {
        // https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fextensions%2Freference%2F
        let targetUrl = decodeURIComponent(window.location.search.substring('?.target='.length - 1));
        console.log('targetUrl', targetUrl);
        window.location.href = targetUrl;
    }

    if (host == 'juejin.cn') {
        let interval = setInterval(() => {
            // 隐藏登录引导提示框
            let ele = document.getElementsByClassName('bottom-login-guide')
            console.log("loginguide: ", ele)
            if (ele.length > 0) {
                ele[0].style.display = 'none'
                clearInterval(interval)
            }
        }, 1000);

    }

})();