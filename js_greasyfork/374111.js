// ==UserScript==
// @name        Compact 12306
// @description 缩小新版 12306 的页面宽度
// @author      Arnie97
// @version     2018.11.09
// @license     CC0
// @namespace   https://github.com/Arnie97
// @match       https://kyfw.12306.cn/otn/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/374111/Compact%2012306.user.js
// @updateURL https://update.greasyfork.org/scripts/374111/Compact%2012306.meta.js
// ==/UserScript==

$(() => {
  $('.header-right').width(780);
  $('.nav,.wrapper').width(980);
  $('.nav-item').width(120);
  $('.content').attr('style', 'min-height: 0px;');
  $('.nav-con>li').attr('style', 'width: 120px; padding-left: 20px;');
  for (var i = 2; i <= 6; i++) $('.nav-col' + i).width(i * 120);
});
