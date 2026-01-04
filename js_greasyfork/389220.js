// ==UserScript==
// @name 搜狐号文章去广告
// @namespace Zeko Scripts
// @match *://www.sohu.com/*
// @grant none
// @description 去重搜狐号相关文章页面广告，热门图集，搜狐号分享，推荐阅读，大家都在看，分享到。调整页面显示布局
// @author zeko zhang
// @version 1.0.0
// @icon http://img.mp.itc.cn/upload/20161029/591ce8990ed64b55855cd95579434384.png
// @downloadURL https://update.greasyfork.org/scripts/389220/%E6%90%9C%E7%8B%90%E5%8F%B7%E6%96%87%E7%AB%A0%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/389220/%E6%90%9C%E7%8B%90%E5%8F%B7%E6%96%87%E7%AB%A0%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


$(() => {
  $("#right-side-bar").remove();
  $("#articleAllsee").remove();
  $("#god_bottom_banner").remove();
  $("#left-bottom-ad").remove();
  $("#article-do").remove();
  $("#backsohucom").remove();
  $(".groom-read").remove();
  
  $(".article-page #article-container .main").css("width", 900);
})