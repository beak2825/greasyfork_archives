// ==UserScript==
// @name         智慧树自动刷网课
// @namespace    https://github.com/injahow
// @version      0.1.4
// @description  智慧树自动播放网课视频，支持调速默认15倍速
// @author       injahow
// @match        *://ent.toujianyun.com/lesson*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435893/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/435893/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==
 setTimeout(function() {
    'use strict';
 
    var videoLists = document.getElementsByClassName('el-scrollbar__view')[0];//视频目录
    var current_play_video = videoLists.getElementsByClassName('current_play')[0];//当前视频单元
    var clearfix_video_i = 0;//当前视频对应的列表id
    var next_video_i = 0;
    var clearfix_video = document.getElementsByClassName('clearfix video');//可播放的视频列表
    var lists_length = clearfix_video.length;
 
    var speedTab = document.getElementsByClassName('speedTab speedTab15')[0];
    speedTab.id = 'mySpeedTab';
    var setSpeed = document.getElementById('mySpeedTab');
    /**
     * 设置15倍速，如果报错请适当调低
     */
    setSpeed.setAttribute('rate', '15');
    setSpeed.click();
 },10000)