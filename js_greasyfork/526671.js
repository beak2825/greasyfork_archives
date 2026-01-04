// ==UserScript==
// @name         洛谷帖子自动跳转器
// @namespace    https://greasyfork.org/zh-CN/scripts/526671
// @namespace    http://www.luogu.com.cn/user/527300
// @version      0.4
// @description  在洛谷的讨论页面自动跳转到洛谷帖子保存站（需要挂个梯子）
// @author       W_C_B_H（白猫戴黑帽）
// @match        https://www.luogu.com.cn/discuss/*
// @match        https://www.luogu.com/discuss/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526671/%E6%B4%9B%E8%B0%B7%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526671/%E6%B4%9B%E8%B0%B7%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    const lastPart = url.split('/').pop();
    const lastNumber = isNaN(lastPart) ? null : Number(lastPart);
    if (lastNumber !== null)
    {
        window.location.href = "https://lglg.top/" + lastNumber;
    }
    else
    {
        console.log("url 最后一部分非数字");
    }
})();