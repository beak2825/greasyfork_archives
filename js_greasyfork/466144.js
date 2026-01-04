// ==UserScript==
// @name         虎牙直播间自动跑房发弹幕
// @namespace    https://item.taobao.com/item.htm?id=670749376549
// @note         ↑是淘宝宝贝链接噢，欢迎进店定制脚本
// @version      1.23.0419.01
// @description  自动打开直播间发送指定弹幕后自动进入下个直播间【淘宝店铺（因稀有才珍贵）制作】_1.23.0525
// @author       【淘宝店铺（因稀有才珍贵）】
// @match        *://www.huya.com/*
// @exclude      https://www.huya.com/g
// @icon         https://a.msstatic.com/huya/main3/widget/list-tags/img/blueRay_tips_9d4b7.png
// @require      https://fastly.jsdelivr.net/combine/gh/domg007/gomg@V1.2.0216.07/liveAutoSend5_Huya.js
// @grant        GM_openInTab
// @grant        GM_notification
// @license      因稀有才珍贵
// @downloadURL https://update.greasyfork.org/scripts/466144/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E8%B7%91%E6%88%BF%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466144/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E8%B7%91%E6%88%BF%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

$(window).ready(() =>{
	liveAutoSend("e19c75636d33b1723d89ab0b7571af02");
});