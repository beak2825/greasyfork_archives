// ==UserScript==
// @name         ibon抢票
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  一个帮助在ibon上抢票的小脚本
// @author       小鱼
// @include      https://*.ibon.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37972/ibon%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/37972/ibon%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

// 买票张数，默认1张
// 买多张就把这个数字改成2，3或者4
const ticketNumber = 1;

// 是否接受不连起来的的座位，默认是接受
// 接受就把false改成true
const sitTogether = false;

(function() {
    'use strict';

    // 尝试绕过流量限制
    if (typeof currentsecond != 'undefined' && currentsecond) {
        currentsecond = 1;
    }

    if (typeof targetURL != 'undefined' && targetURL) {
        window.location = targetURL;
    }

    // 第一步：购票方式强制选择“电脑配位”
    var buyTypeCheckbox = document.querySelector("#ctl00_ContentPlaceHolder1_BUY_TYPE_2");
    if (buyTypeCheckbox) buyTypeCheckbox.checked = true;

    // 第二步：手动点击你想买的有票的区
    // 只有显示为“热卖中”和显示余数量的可以点

    // 第三步：自动设置购买数量，默认为1
    var buyAmount = document.querySelector("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL");
    if (buyAmount) buyAmount.value = ticketNumber;

    // 第四步：设置不连位座位
    var sitTogetherCheckBox = document.querySelector("#ctl00_ContentPlaceHolder1_ATYPE");
    if (sitTogetherCheckBox) sitTogetherCheckBox.checked = !sitTogether;

    // 第五步：自动把光标聚焦到验证码输入框
    var captchaBox = document.querySelector("#ctl00_ContentPlaceHolder1_CHK");
    if (captchaBox) captchaBox.focus();

    // 第六步：手动输入验证码

    // 第七步：回车，效果为自动点击“下一步”
    // 也就是提交订单
    document.onkeydown = function() {
        if (window.event.keyCode == "13") {
            document.querySelector("#ctl00_ContentPlaceHolder1_AddShopingCart").click();
        }
    };


})();