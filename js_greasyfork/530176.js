// ==UserScript==
// @name         洛谷个人介绍取消隐藏
// @namespace    https://greasyfork.org/zh-CN/scripts/530176
// @namespace    http://www.luogu.com.cn/user/527300
// @version      0.4
// @description  在洛谷的个人主页自动取消隐藏个人介绍
// @author       W_C_B_H（白猫戴黑帽）
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530176/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/530176/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showIntro() {
        const divIntro = document.getElementsByClassName("introduction marked");
        divIntro[0].style = "";
        const cards = document.getElementsByClassName('card padding-default');
        const redBox = cards[cards.length - 1].childNodes[4];
        redBox.textContent = '\n由于系统没有维护，该内容仍然可见。\n';
    }
    window.onload = showIntro;
})();