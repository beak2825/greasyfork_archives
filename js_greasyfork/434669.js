// ==UserScript==
// @name         福建省执业药师继续教育
// @namespace    http://fjlpa.mtnet.com.cn/
// @version      1.3.1
// @description  执业药师继续教育--考试自动显示答案
// @match        http://fjlpa.mtnet.com.cn/examination/LN.*?
// @match        http://fjlpa.mtnet.com.cn/video/.*?
// @downloadURL https://update.greasyfork.org/scripts/434669/%E7%A6%8F%E5%BB%BA%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/434669/%E7%A6%8F%E5%BB%BA%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setInterval(() => {
        if(typeof  player!="undefined"){
            player.volume=0;
            if(player.currentTime<player.duration)
            if(player.paused==true)player.play();
            $('#bulletTime').val(9999999999);}
        var answer_tag=document.getElementById("answerDiv");
        if(answer_tag)answer_tag.setAttribute('style', '');
 
    },3e3);
 
 
})();



// ==UserScript==
// @name        优课在线自动挂机
// @namespace   https://osu.ppy.sh/u/376831
// @include     *www.uooconline.com/learn/*
// @version     1.0
// @description 优课在线自动挂机脚本，支持失去焦点继续播放、自动播放下一节
// @grant       none
// ==/UserScript==
$(document).ready(function () {
  setInterval(function () {
    var btn = $('div.btn.btn-danger.next');
    btn.click();
  }, 1000);
});