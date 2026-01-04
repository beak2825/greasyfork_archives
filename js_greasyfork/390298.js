// ==UserScript==
// @name         tyqp
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tyqp.user.js
// @author       小鱼
// @include      https://tixcraft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390298/tyqp.user.js
// @updateURL https://update.greasyfork.org/scripts/390298/tyqp.meta.js
// ==/UserScript==

// 买票张数，默认1张
// 买多张就把这个数字改成2，3或者4
const ticketNumber = 1;

(function() {
    'use strict';

    // 第一步：购票方式强制选择“电脑配位”
    var buyTypeCheckbox = document.querySelector("#select_form_auto");
    if (buyTypeCheckbox) buyTypeCheckbox.checked = 1;

    // 第二步：手动点击你想买的有票的区
    // 只有显示为“热卖中”和显示余数量的可以点

    // 第三步：自动设置购买数量，默认为1
    var buyAmount = document.querySelector(".mobile-select");
    if (buyAmount) buyAmount.value = ticketNumber;

    var agreeBox = document.querySelector("#TicketForm_agree");
    if (agreeBox) agreeBox.checked = 1;

    // 第五步：自动把光标聚焦到验证码输入框
    var captchaBox = document.querySelector("#TicketForm_verifyCode");
    if (captchaBox) captchaBox.focus();

    // 第六步：手动输入验证码

    // 第七步：回车，效果为自动点击“下一步”
    // 也就是提交订单
    document.onkeydown = function() {
        if (window.event.keyCode == "13") {
            document.querySelector("#ticketPriceSubmit").click();
        }
    };


})();