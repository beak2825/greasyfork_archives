// ==UserScript==
// @name         去除洛谷所有广告
// @namespace    https://www.luogu.com.cn/user/365751
// @version      0.4.0
// @description  去除洛谷所有广告，包括首页大图和题目、题解、讨论、比赛页广告
// @author       cooluo
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com.cn/problem/solution/*
// @match        https://www.luogu.com.cn/discuss/*
// @match        https://www.luogu.com/discuss/*
// @match        https://www.luogu.com.cn/contest/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531102/%E5%8E%BB%E9%99%A4%E6%B4%9B%E8%B0%B7%E6%89%80%E6%9C%89%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/531102/%E5%8E%BB%E9%99%A4%E6%B4%9B%E8%B0%B7%E6%89%80%E6%9C%89%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var flag = 0;
    setInterval(function () {
        var currentUrl = window.location.href;
        if (currentUrl.includes('solution')) {
            var block1 = document.querySelector("#app > div.main-container.lside-bar > main > div > div > div.side > div.l-card");
            if (block1.innerHTML.includes('不要')) document.querySelector("#app > div.main-container.lside-bar > main > div > div > div.side > div:nth-child(3)").remove();
            else document.querySelector("#app > div.main-container.lside-bar > main > div > div > div.side > div:nth-child(2)").remove();
        }
        else if (currentUrl.includes('problem')) document.querySelector("#app > div.main-container.lside-bar > main > div > div > div.side > div:nth-child(5)").remove();
        else if (currentUrl.includes('discuss')) document.querySelector("#app > div.main-container.lside-bar > main > div > div > div.side > div:nth-child(2)").remove();
        else if (currentUrl.includes('contest')) document.querySelector("#app > div.main-container > main > div > div.full-container > section.side > div:nth-child(3)").remove();
        else if (!flag) {
            document.getElementsByClassName('am-u-md-8')[0].remove();
            var Fortune = document.getElementsByClassName('am-u-md-4 lg-punch am-text-center')[0];
            Fortune.style = 'position: relative; left:33%';
            flag = 1;
        }
    }, 1000);
})();