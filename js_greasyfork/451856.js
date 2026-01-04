// ==UserScript==
// @name        安大雨课堂
// @namespace   Violentmonkey Scripts
// @match       https://ahuyjs.yuketang.cn/pro/lms/*/video/*
// @grant       none
// @version     1.1
// @author      lownz
// @description 个人自用，只有视频跳转功能，建议搭配浏览器自动播放和静音使用
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451856/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/451856/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==
setTimeout(function video() {
    console.log('start');
    var video = document.querySelector('video');
    var reg = /.*?video\/(\d{8})/;
    url_num = window.location.href.match(reg);
    next_url_num = Number(url_num[1])+1;
    next_url = 'https://ahuyjs.yuketang.cn/pro/lms/9pfAisB7s3A/14240397/video/'+ next_url_num;
    console.log(next_url)
    if(video!=null){
      if(video.length != 0){
        console.log('播放');
        setInterval(function jump(){
          var c= video.currentTime;
          var d = video.duration;
          var pr =(c/d*100);
          document.title =( pr+"%");
          if(pr>97){
              window.location.href = next_url;
              console.log("跳转到下一节");
              }},1000)
      }else {
              console.log("未知错误！");
          }
    }
  else if(video==null){
     window.location.href = next_url;
     console.log("作业，跳转到下一节");
  }
},6000)