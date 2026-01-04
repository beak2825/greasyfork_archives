// ==UserScript==
// @name         虎牙Lite 直播网页精简版 Huya Lite
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  去除广告，主播动态等无关元素，仅保留直播
// @author       Meteora
// @match        https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408921/%E8%99%8E%E7%89%99Lite%20%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E7%B2%BE%E7%AE%80%E7%89%88%20Huya%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/408921/%E8%99%8E%E7%89%99Lite%20%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E7%B2%BE%E7%AE%80%E7%89%88%20Huya%20Lite.meta.js
// ==/UserScript==

//大主播
$('#J_spbg').remove();
$('#J_mainRoom > div.room-wrap > div.room-footer').remove();

//活动
$('#matchComponent2').remove();

//通用
$('#wrap-income').remove();
$('#J_roomGgTop').remove();
$('#J_mainRoom > div.room-footer').remove();
$('#J-weekRank').remove();

//比赛页面，直播下方的内容
$('#match-cms-content').remove();

//延迟删除
setTimeout(function(){
  //漂浮广告
  $('#chatRoom > div.room-gg-chat').remove();
  //任务红点
  $('#J_hd_nav_user > b').remove();
  //活动
  $('.tt-diyActLayer').remove();
  console.log("Completed!");
},10*1000);