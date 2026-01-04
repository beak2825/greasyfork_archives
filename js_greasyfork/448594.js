// ==UserScript==
// @name         国家中小学智慧教育平台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autoplay
// @author       hui
// @match      https://*.zxx.edu.cn/teacherTraining/*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448594/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/448594/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

window.onload = function () {
  try {
      var t = 0
    setInterval(() => {
      if(document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j')[0]!=null){document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j')[0].click()}//课程详情页自动点击【开始学习】
      if(document.getElementsByClassName('vjs-big-play-button')[0]!=null){document.getElementsByClassName('vjs-big-play-button')[0].click()};//播放视频
      if(document.getElementsByClassName('vjs-mute-control vjs-control vjs-button vjs-vol-3')[0]!=null){document.getElementsByClassName('vjs-mute-control vjs-control vjs-button vjs-vol-3')[0].click()};//静音
      if(document.querySelector("video").playbackRate!=null) {document.querySelector("video").playbackRate = 16};//最高16倍速
      //var time = document.getElementsByClassName('vjs-duration-display')[0].innerText;
      //检测是否学习完毕
      var list = document.getElementsByClassName('resource-item resource-item-train')//列表
      var i
      for (i = 0; i < list.length; i++){
          var wancheng=list[i].getElementsByTagName('div')[0].title;//已学完
          //var studying=list[i].getElementsByClassName('index-module_progress1_1Qwt_')[0].title;//学习中
         // var nostudying=list[i].getElementsByClassName('index-module_progress0_1WBkd')[0].title;//未学习
          if(wancheng=="已学完"){
              var wanchengnum = i + 1;//获取到第几个视频
         // }else if(studying=="进行中"){
           //   document.getElementsByClassName('vjs-big-play-button')[0].click();;
         // }else if(nostudying=="未开始"){
           //   document.getElementsByClassName('vjs-big-play-button')[0].click();
          };
      };
       var list_active = document.getElementsByClassName('resource-item resource-item-train resource-item-active')[0]//当前课程
       var list_active_title=list_active.getElementsByTagName('div')[0].title;
        if(list_active_title=="已学完"){
        list[wanchengnum].click();
        }
        if(t==50){
            location.href="https://www.zxx.edu.cn/teacherTrainingNav/train";
        }
        console.log(t)
        t++
    }, 6 * 1000);//6秒检测一次
  } catch (error) {}
};