// ==UserScript==
// @name         虎牙自动发弹幕_定制
// @namespace    https://item.taobao.com/item.htm?spm=a2oq0.12575281.0.0.6aaf1debJ6Iafr&ft=t&id=605165564935
// @description  ctrl + V粘贴时，自动发送 （虎牙自动发弹幕【淘宝店铺（因稀有才珍贵）制作】）
// @version      1.0
// @author       淘宝店铺（因稀有才珍贵）制作
// @match        https://www.huya.com/*
// @icon         https://www.huya.com/favicon.ico
// @require      https://cdn.jsdelivr.net/combine/gh/domg007/gomg@master/AutoSend_Huya_HuaCai.js
// @license      因稀有才珍贵
// @downloadURL https://update.greasyfork.org/scripts/441019/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95_%E5%AE%9A%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441019/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95_%E5%AE%9A%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    !!$("#J_roomTitle").length && AutoSend_Huya_HuaCai("957bb2b3548c5a224651e97ba7483531");
})();