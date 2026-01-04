// ==UserScript==
// @name         Douyu 礼物统计
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  统计斗鱼礼物数据
// @author       KaitoHH
// @match        https://www.douyu.com/*
// @grant        @grant    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/33703/Douyu%20%E7%A4%BC%E7%89%A9%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/33703/Douyu%20%E7%A4%BC%E7%89%A9%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

var giftCnt = {};
var msgMonitor;
var showTableFlag = false;
var req = require("shark/lang/observer").on("mod.chat.msg.msg", function(e) {
    if (!e) return;
    var msg = jQuery(e).find(".chat-msg-item").text();
    var gift = jQuery(e).find(".gift-name").text();
    var combo = jQuery(e).find(".hy-org").text();
    var count = 1;
    if (combo && combo.indexOf("连击") != -1) {
        count = parseInt(combo);
        if (count == 10) count--;
        else if (combo % 10 === 0) count = 10;
        else count = 1;
    }
    if (gift.length === 0) gift = "other_msg";
    if (msgMonitor && msg == msgMonitor) gift = msgMonitor;
    if (giftCnt[gift] === undefined) {
        giftCnt[gift] = count;
    } else {
        giftCnt[gift] += count;
    }
    if (showTableFlag) {
        console.clear();
        console.table(giftCnt);
    }
});

unsafeWindow.clearTable = function() {
    giftCnt = {};
};

unsafeWindow.showTable = function() {
    showTableFlag = true;
};

unsafeWindow.hideTable = function() {
    showTableFlag = false;
};

unsafeWindow.printTable = function() {
    console.table(giftCnt);
};

unsafeWindow.setMonitor = function(keyword) {
    msgMonitor = keyword;
};
