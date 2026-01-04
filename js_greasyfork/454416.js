// ==UserScript==
// @name         虎牙自动送礼物_定制版
// @namespace    https://item.taobao.com/item.htm?id=670749376549
// @note         ↑是淘宝宝贝链接噢，欢迎进店定制脚本
// @version      1.0
// @description  直播间自动送礼物【淘宝店铺（因稀有才珍贵）制作】_默认送星星5个_右击开始按钮，可以多个直播间一起操作
// @author       【淘宝店铺（因稀有才珍贵）制作】
// @require      https://fastly.jsdelivr.net/combine/gh/domg007/gomg@V1.2.1108.01/autoSendGift.js
// @match        https://www.huya.com/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @icon         https://www.huya.com/favicon.ico
// @license      因稀有才珍贵
// @downloadURL https://update.greasyfork.org/scripts/454416/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E7%89%A9_%E5%AE%9A%E5%88%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454416/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E7%89%A9_%E5%AE%9A%E5%88%B6%E7%89%88.meta.js
// ==/UserScript==

(function() {

    !!$("#J_roomTitle").length && autoSendGift("6b1fd52beede37ab0bef2b38fe3f0615");

})();