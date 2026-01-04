// ==UserScript==
// @name             VIP视频解析
// @description      视频网站VIP解析快捷按钮，个人使用
// @version          1.0
// @namespace        http://blog.yahocen.xyz
// @author           Yahocen
// @include          *://www.iqiyi.com/*
// @include          *://v.qq.com/*
// @include          *://v.youku.com/*
// @require          https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405207/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/405207/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

$(function(){
  //初始化参数
  let wbhref = location.href;
  let vphref = "http://pub.yahocen.xyz/vipvp/index.php?url=";
  
  //弹出播放框
  window.yahocen = function(){
    window.open(vphref + wbhref)
  }
  
  //根据不同网站添加入口按钮
  if(wbhref.indexOf("iqiyi") > 0 && $("#realFlashbox").length > 0){
    let but = "<div class='func-item'><div class='func-inner'><a title='点击播放高清解析视频' style='font-size:14px;background-color:red;color:white;padding:5px;border-radius:3px;cursor:pointer;border:0;' onclick='yahocen()'>VIP入口</a></div></div>";
    $("#block-E .player-mnb-right .qy-flash-func").append(but);
  }else if(wbhref.indexOf("youku") > 0 && $("#playerBox").length > 0){
    let but = "<li class='play-fn-li fn-phonewatch' style='background:red;'><a title='点击播放高清解析视频' style='font-size:14px;color: white;border-radius:3px;cursor:pointer;border:0;' onclick='yahocen()'>VIP入口</a></li>";
    $(".module-playbox .nav-mamu .play-fn").append(but);
  }else if(wbhref.indexOf("qq") > 0 && $("#mod_player").length > 0){
    let but = "<div style='position: absolute;top: 0;background: 0 0;left: 250px;line-height: 3rem;'><a title='点击播放高清解析视频' style='color: white;border:0;padding: 5px 6px;border-radius: 12px;background-color: red;font-size: 12px;line-height: 24px;text-align: center;white-space: nowrap;cursor: pointer;' onclick='yahocen()'>VIP入口</a></div>";
    $("#mod_barrage_container").append(but);
  }
  
})