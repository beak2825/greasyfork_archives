// ==UserScript==
// @name         熊猫直播工具箱
// @namespace    undefined
// @version      0.0.2
// @description  熊猫直播工具箱:自动按照人气排序、去除大广告
// @author       Svend
// @match        *://www.panda.tv/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/36663/%E7%86%8A%E7%8C%AB%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/36663/%E7%86%8A%E7%8C%AB%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

$(document).ready(function() {
  removeAD();
  sortVideoList();
});

function removeAD(){
  $('.video-list-item cate-slider-wrapper').remove();
}

function sortVideoList() {
  var sortHtml = $('.video-list-item').sort(function(a, b){
    var numberAStr = $(a).find('.video-number').text();
    var numberBStr = $(b).find('.video-number').text();
    var numberA = numberAStr.endsWith('万') ? parseFloat(numberAStr.replace('万', '')) * 10000 : parseFloat(numberAStr);
    var numberB = numberBStr.endsWith('万') ? parseFloat(numberBStr.replace('万', '')) * 10000 : parseFloat(numberBStr);
    if (numberA > numberB){
      return -1;
    } else {
      return 1;
    }
  });

  $('.video-list').html(sortHtml);
}