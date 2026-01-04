// ==UserScript==
// @name     知乎PAD适应
// @namespace xl
// @version  190318.1
// @description 知乎网页适应PAD浏览
// @author   xl
// @match    https://www.zhihu.com/*
// @require  https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/380534/%E7%9F%A5%E4%B9%8EPAD%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/380534/%E7%9F%A5%E4%B9%8EPAD%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

$(function(){
  // 首页
  $(".ContentLayout").css({"display":"block","width":"100%"});
  $(".ContentLayout-mainColumn").css({"display":"block","width":"100%"});
  $(".ContentLayout-sideColumn").css({"display":"block","width":"100%"});
  
  // 回答页面
  $(".Question-main").css({"display":"block","width":"100%"});
  $(".ListShortcut").css({"display":"block","width":"100%"});
  $(".Question-sideColumn,.Question-sideColumn--sticky").css({"display":"block","width":"100%"});
  $(".Question-mainColumn").css({"display":"block","width":"100%"});
});