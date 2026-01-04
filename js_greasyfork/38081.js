// ==UserScript==
// @name         apactix抢票
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个在apactix上抢票的小助手
// @author       sfdye
// @match        https://booking.apactix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38081/apactix%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/38081/apactix%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

// 设置抢票张数
const ticAmount = 8;

// 设置抢票区域
const section = "B";

(function() {
    'use strict';

    var areaObj = getAreaBySec(section);

    if (areaObj) {
        // 设置区域
        jQuery('div#section-sel').html('YOUR PREFERRED SECTION IS <big>'+ areaObj.description.replace(/ *\<[^)]*\> */g, "") + '</big>');
        assignPrice(areaObj);
    }

    var ticQuantity = document.getElementById("qty_0");
    // 设置张数
    if (ticQuantity) ticQuantity.value = ticAmount;

    var capKey = document.getElementById("capKey");
    if (capKey) capKey.focus();

    var addtocart = document.getElementById("addtocart-btn");
    if (addtocart) {
        // 提交
        addtocart.click();
    }

})();