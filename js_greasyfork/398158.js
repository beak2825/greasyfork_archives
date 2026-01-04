// ==UserScript==
// @name         打开B站视频观看2分钟才会自动点赞&自动播放&自动网页全屏
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  哔哩哔哩-自动点赞。
// @author       y-hh
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/398158/%E6%89%93%E5%BC%80B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B2%E5%88%86%E9%92%9F%E6%89%8D%E4%BC%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/398158/%E6%89%93%E5%BC%80B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B2%E5%88%86%E9%92%9F%E6%89%8D%E4%BC%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==
var dianzhan = document.getElementsByClassName('like');
var play_bottom=document.getElementsByClassName('bilibili-player-iconfont bilibili-player-iconfont-start');
var play_max=document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-web-fullscreen');

var like ="like";
var like2 ="like on";
var video_playing="bilibili-player-video-btn bilibili-player-video-btn-start";
var video_stop="bilibili-player-video-btn bilibili-player-video-btn-start video-state-pause";

var myDate = new Date();
window.onload =(function() {
    'use strict';

    //输出时间
    var time=setInterval(function () {
        console.log( "1.时间………………………………");
        console.log(myDate.getHours()+"H,"+myDate.getMinutes()+"M");
        clearInterval(time);

    },500);

    //打开自动播放
  var auto_ply_t=setInterval(function () {
        console.log("2。````````````````"+play_bottom[0].className);
         play_bottom[0].click();
         console.log("自动播放了");

        clearInterval(auto_ply_t );
                                   },1500);

    //打开自动网页全屏
      var auto_ply_max_t=setInterval(function () {
        console.log("3。````````````````"+play_max[0].className);
         play_max[0].click();
         console.log("自动全屏了");

        clearInterval(auto_ply_max_t );
                                   },1500);

    //看了2分钟才点赞
    var dianzhan_t=setInterval(function () {
        //console.log("3.````````````````"+dianzhan[0].className);
        if (dianzhan[0].className == like)
        {
         dianzhan[0].click();
         console.log("点赞了");
        }else if(dianzhan[0].className ==like2){
         console.log("点过赞了");
        }
        clearInterval(dianzhan_t );
                                   },120000);
}
)();
