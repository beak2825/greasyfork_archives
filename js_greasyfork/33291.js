// ==UserScript==
// @name        测试
// @description 测试kakankank
// @namespace   https://www.panda.tv/
// @author      ceshi
// @include     https://www.panda.tv/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33291/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/33291/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

$("#J-color-list-level").mouseover();
$(".room-chat-tools clearfix").append("<script type='text/javascript'>function hideOT(){ $('#J-color-list-level > li:nth-child(2)').attr('class','color-item');$('#J-color-list-level > li:nth-child(3)').attr('class','color-item');$('#J-color-list-level > li:nth-child(4)').attr('class','color-item');$('#J-color-list-level > li:nth-child(5)').attr('class','color-item');$('#J-color-list-level > li:nth-child(6)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(1)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(2)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(3)').attr('class','color-item');$('#J-color-list-fans > li:nth-child(4)').attr('class','color-item'); }</script><a href=javascript:voide(); onclick='hideOT()'>解开颜色</a></p>");
$("#J-color-list-level").mouseout();