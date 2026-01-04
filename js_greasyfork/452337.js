// ==UserScript==
// @name         安大雨课堂刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  123
// @author       You
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match        https://ahuyjs.yuketang.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452337/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452337/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function video() {
    var video = document.querySelector('video');
    var reg = /.*?video\/(\d{8})/;
    var url_num = window.location.href.match(reg);
    var next_url_num = Number(url_num[1])+1;
    var next_url = `${window.location.href.split('video')[0]}video/${next_url_num}`;
    if(video!=null){
      if(video.length != 0){
        setInterval(function jump(){
          var c= video.currentTime;
          var d = video.duration;
          var pr =(c/d*100);
          document.title =( pr+"%");
          if(pr==100){
              window.location.href = next_url;
              }},1000)
      }else {
              console.log("未知错误！");
          }
    }
  else if(video==null){
     window.location.href = next_url;
  }
},6000)
})();