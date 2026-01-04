// ==UserScript==
// @name     BT电影天堂插件
// @namespace com.ldtt
// @description 显示下载地址
// @author icexmoon@qq.com
// @version  1
// @grant    none
// @include        *//ldytt.com/down/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421485/BT%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421485/BT%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
function run(){
  console.log("11111");
  $("#video-down").children("div.movie_dl").attr("style","");
  $("div#gzhtg").hide();
}
run()