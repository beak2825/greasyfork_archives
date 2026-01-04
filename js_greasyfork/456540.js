// ==UserScript==
// @name         CSDN免登录复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  copy code without login from csdn, auto readmore
// @author       PathOfLife
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456540/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456540/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("pre").forEach(preEle => {
        const hideCodeBox = preEle.querySelector(".hide-preCode-box");
        const codeBox = preEle.querySelector("code")
        hideCodeBox.style.display = "none";
        preEle.style.height = "auto";
        preEle.style.userSelect = "auto";
        codeBox.style.userSelect = "auto";
    });
})();