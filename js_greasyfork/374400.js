// ==UserScript==
// @name     全民电影广告去除
// @namespace 全民电影广告去除
// @description 主要去除无用元素及AD
// @version  0.0.3
// @grant    none
// @match *://*.yn-dove.cn/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374400/%E5%85%A8%E6%B0%91%E7%94%B5%E5%BD%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/374400/%E5%85%A8%E6%B0%91%E7%94%B5%E5%BD%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

//删除页面广告链接
$("#ad1616").remove();

//删除淘客广告链接
$("#taoke").remove();

//删除NAV广告链接
$(".menulist.hidden-xs li:eq(6)").remove();

//删除无用按钮
$(".item.clearfix li:eq(0)").remove();

//修改首页广告链接为影片链接
$(".hy-index-menu.clearfix .item .clearfix li:eq(3) a").attr('href','list-dianying-all-all-all-103.html'); 
$(".hy-index-menu.clearfix .item .clearfix li:eq(3) a").attr('title','喜剧影片');
$(".hy-index-menu.clearfix .item .clearfix li:eq(3) a").attr('target','_self');
$(".hy-index-menu.clearfix .item .clearfix li:eq(3) a span").text("喜剧影片");