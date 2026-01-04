// ==UserScript==
// @name         B站和部分网站视频倍速调整
// @namespace    https://greasyfork.org/zh-CN/users/824275-%E6%97%A0%E6%95%8C%E5%A4%A7%E7%88%86%E7%82%B8
// @version      1.0.4
// @description  '+'、'-'控制倍速或ctrl+up/down；下限0.1倍，上限16倍速，
// @author       无敌大爆炸
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433764/B%E7%AB%99%E5%92%8C%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/433764/B%E7%AB%99%E5%92%8C%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function(){
    'use strict';

    //获取B站视频资源
    var video=document.querySelector('video')==null ? document.querySelector('.bilibili-player-video bwp-video'):document.querySelector('video');
    if(video)
    {
        var speedRate=0.5;
        document.onkeydown = function(e) {
            var keyCode = e.keyCode || e.which || e.charCode;
            var ctrl_Key = e.ctrlKey ;
            //ctrl+up组合键或者+键，提高视频播放速率      上限控制在16倍速，下限控制在0.1倍速
            if((ctrl_Key && keyCode == 38)|| keyCode==107) {
                if((video.playbackRate+speedRate)<=16)
                video.playbackRate+=speedRate;
                else
                    {
                        video.playbackRate=16;
                        alert("视频播放速率已达上限");
                    }
            }
            //ctrl+down组合键或者-键，降低视频播放速率
            if((ctrl_Key && keyCode == 40)||keyCode==109) {
                if((video.playbackRate-speedRate)>=0.1)
                    video.playbackRate-=speedRate;
                else
                    {
                        video.playbackRate=0.1;
                        alert("视频播放速率已达下限");
                    }
              }
            e.preventDefault();
            return false;
          }
    } 
    
})();