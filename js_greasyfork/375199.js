// ==UserScript==
// @name         v2ex自动领取每日奖励
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  v2ex自动领取每日奖励，打开v2自动领取
// @author       zz
// @match        *.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375199/v2ex%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E5%A5%96%E5%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/375199/v2ex%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E5%A5%96%E5%8A%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var innerEleList = document.getElementsByClassName("inner") || [];
    for (var i = 0; i < innerEleList.length; i++) {
        if (innerEleList[i].textContent.includes("领取今日的登录奖励")) {
            window.location.href='/mission/daily';
            break;
        }
    }

    var getPrizeEle = document.getElementsByClassName("super normal button")[0];
    console.log(getPrizeEle);
    if (getPrizeEle && getPrizeEle.value == "领取 X 铜币") {
        console.log("开始领取");
        getPrizeEle.click();
    }

    getPrizeEle = document.getElementsByClassName("super normal button")[0];
    if (getPrizeEle && getPrizeEle.value == "查看我的账户余额") {
        console.log("领取完毕，跳转")
        window.location.href='/';
    }
})();