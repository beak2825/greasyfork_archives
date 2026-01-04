// ==UserScript==
// @name        hao123-每日一新
// @namespace   Violentmonkey Scripts
// @match       https://www.hao123.com/
// @grant       none
// @version     1.0
// @author      wangJF
// @grant       GM_xmlhttpRequest
// @require     https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @description 2021/7/1上午11:02:49 hao123去广告，背景图每日一换
// @downloadURL https://update.greasyfork.org/scripts/428747/hao123-%E6%AF%8F%E6%97%A5%E4%B8%80%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428747/hao123-%E6%AF%8F%E6%97%A5%E4%B8%80%E6%96%B0.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
  //切换背景图片为bing
  'use strict';
    GM_xmlhttpRequest({
        url:"https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
        method :"GET",
        onload:function(xhr){
          var resJson = JSON.parse(xhr.responseText);
          var picUrl ="url("+'https://cn.bing.com' + resJson.images[0].url+")";
          $("#gameyixingTop").css("background-image",picUrl);
        }
    });
  var gameyixingTop = document.getElementById("gameyixingTop");
  gameyixingTop.classList.remove("ewc");
  gameyixingTop.style.backgroundRepeat = "repeat";
  gameyixingTop.style.backgroundPosition = "left 0px";
  gameyixingTop.classList.remove("s-sbg2");
  var headerStyle = document.getElementById('header').style;
  headerStyle.backgroundColor = "rgba(255,255,255,0.5)";
  headerStyle.top = "0px";
  headerStyle.height = "89px";
  headerStyle.border = 0;
  $("#topColumn").css("background-color","rgba(255,255,255,0.5)");
  $(".layout-right").remove();
  $(".layout-left").remove();
  $(".hotsearchCon").remove();
  $(".notice").remove();
  $(".hotword").remove();
  $("#skinbtn").remove();
  $("#shortcut-box").remove();
  $("#footer").remove();
  $("script").remove();
  $("#topbeWrapper").remove();
  var spread = document.querySelector(".spread");
  setTimeout(function(){
    spread.click();
    $(".siye").remove();
  }, 1500);
})(jQuery);