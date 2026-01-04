// ==UserScript==
// @name         百度wenku精简
// @namespace    https://github.com/HelloCodeMing/baidu-wenku/
// @version      0.2
// @description  根据https://github.com/HelloCodeMing/baidu-wenku/提供的脚本制作,特别感谢
// @author       You
// @include        *://wenku.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370185/%E7%99%BE%E5%BA%A6wenku%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/370185/%E7%99%BE%E5%BA%A6wenku%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

//HelloCodeMing提供的样式精简代码
$(".aside").remove();
$("#doc #hd").remove();
$(".crubms-wrap").remove();
$(".user-bar").remove();
$("#doc-header").remove();
$(".reader-tools-bar-wrap").remove();
$(".fix-searchbar-wrap").remove();
$("#bottom-doc-list-8").remove();
$(".ft").remove();
$("#ft").remove();
$("#docBubble").remove();
$('.hd').remove();
$('.wk-other-new-cntent').remove();
$('#html-reader-go-more').remove();
$('.new-wm').remove();
$('#bottom-download').remove();
$('#pay-page').remove();
$('.banner-wrap').remove();
$('#next_doc_box').remove();
$('.high-quality-doc').remove();
$("body").attr("margin", "auto");
//去掉VIP浮动提示层
$(".new-ico-wkmember-free-doc").remove();
//增加打印下载按钮
$(".bd-wrap").css('position','relative');
$(".body body-v3").css('position','absolute');
$(".body body-v3").css('left','20%');
$(".bd-wrap").css('position','relative');
$(".bd-wrap").append('<input type="button" value=" 打 印 PDF " onclick="window.print()" style="display:inline;position: fixed;right: 20%;top: 40px">');
$("#scrollUpIco").remove();