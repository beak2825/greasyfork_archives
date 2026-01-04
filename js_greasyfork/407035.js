// ==UserScript==
// @name        csdn论坛改造： 1.去除了论坛右侧广告和底部推荐。 2.去除“展开阅读全文”的限制。 3.帖子自动翻页，完美“破解”10贴/页的问题。 4.调整一些版面使得更易于浏览。
// @namespace   Violentmonkey Scripts
// @match       https://bbs.csdn.net/*
// @grant       none
// @version     1.1
// @author      sysdzw
// @description csdn论坛改造：1.去除论坛右侧广告和底部推荐。 2.去除“展开阅读全文”的限制。 3.帖子自动翻页，完美“破解”10贴/页的问题。 4.调整一些版面使得更易于浏览。
// @downloadURL https://update.greasyfork.org/scripts/407035/csdn%E8%AE%BA%E5%9D%9B%E6%94%B9%E9%80%A0%EF%BC%9A%201%E5%8E%BB%E9%99%A4%E4%BA%86%E8%AE%BA%E5%9D%9B%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E5%92%8C%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90%E3%80%82%202%E5%8E%BB%E9%99%A4%E2%80%9C%E5%B1%95%E5%BC%80%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E2%80%9D%E7%9A%84%E9%99%90%E5%88%B6%E3%80%82%203%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%EF%BC%8C%E5%AE%8C%E7%BE%8E%E2%80%9C%E7%A0%B4%E8%A7%A3%E2%80%9D10%E8%B4%B4%E9%A1%B5%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82%204%E8%B0%83%E6%95%B4%E4%B8%80%E4%BA%9B%E7%89%88%E9%9D%A2%E4%BD%BF%E5%BE%97%E6%9B%B4%E6%98%93%E4%BA%8E%E6%B5%8F%E8%A7%88%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/407035/csdn%E8%AE%BA%E5%9D%9B%E6%94%B9%E9%80%A0%EF%BC%9A%201%E5%8E%BB%E9%99%A4%E4%BA%86%E8%AE%BA%E5%9D%9B%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E5%92%8C%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90%E3%80%82%202%E5%8E%BB%E9%99%A4%E2%80%9C%E5%B1%95%E5%BC%80%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E2%80%9D%E7%9A%84%E9%99%90%E5%88%B6%E3%80%82%203%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%EF%BC%8C%E5%AE%8C%E7%BE%8E%E2%80%9C%E7%A0%B4%E8%A7%A3%E2%80%9D10%E8%B4%B4%E9%A1%B5%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82%204%E8%B0%83%E6%95%B4%E4%B8%80%E4%BA%9B%E7%89%88%E9%9D%A2%E4%BD%BF%E5%BE%97%E6%9B%B4%E6%98%93%E4%BA%8E%E6%B5%8F%E8%A7%88%E3%80%82.meta.js
// ==/UserScript==

//设置发帖按钮
$(".btns").prepend("<li style='background:green;border-radius:5px;height: 32px; margin-top: 6px;'><a style='color:#fff; line-height:32px;' href='" + $("a:contains('我要发贴')").attr("href") + "'>发帖</a></li>");
$("#rightList").remove();//移除右侧栏
$("#post_feed_wrap").remove();
$(".post_recommend").remove();
$("#left-box").css("cssText","float: left;width:100% !important;");//加宽左框
$(".topic_r").css("width","100%");//加宽帖子正文区域 
$(".control").css("cssText","bottom:0px !important;");//时间靠底部
 
//到底部自动翻页
$(window).scroll(function(){
  var scrollTop = $(this).scrollTop();
  var windowHeight = $(this).height();
  var scrollHeight = $(document).height();
  if(scrollTop + windowHeight == scrollHeight){
    $(".next_page")[0].click();
  }
});

//去掉展开阅读全文
$(document).ready(function(){
  if($(".omit_wrap").css("display")=="block"){
    $(".tips").click();
  }
});