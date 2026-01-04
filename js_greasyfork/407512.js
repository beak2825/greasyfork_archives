// ==UserScript==
// @name         哔哩哔哩视频自动倍速播放（可记住用户设定值并自动设置播放速度）
// @description  哔哩哔哩（bilibili.com）视频自动倍速播放，智能记忆用户设定的视频倍速并存储在本地，播放全站视频都会自动使用该倍速，例如全站视频都用1.25倍速播放，不用每次播放视频都要设置倍速。。
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.0
// @author       Tsing
// @include      *://www.bilibili.com/video/*
// @include      *://www.bilibili.com/medialist/play/watchlater/p*
// @include      *://www.bilibili.com/bangumi/play/ep*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407512/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%8F%AF%E8%AE%B0%E4%BD%8F%E7%94%A8%E6%88%B7%E8%AE%BE%E5%AE%9A%E5%80%BC%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/407512/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%8F%AF%E8%AE%B0%E4%BD%8F%E7%94%A8%E6%88%B7%E8%AE%BE%E5%AE%9A%E5%80%BC%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var player_speed = 1.25; // Default video speed
    var speed_arr = [0.5, 0.75, 1, 1.25, 1.5, 2]; // Video speed control panel data-value
    var v = localStorage.getItem("user_video_speed");
    if(!v){ // Localstorage Null
        localStorage.setItem("user_video_speed", player_speed);
    }else{
        if(speed_arr.indexOf(parseFloat(v)) != "-1"){ // Speed value valid
            player_speed = parseFloat(v);
        }else{ // Speed value invalid
            localStorage.setItem("user_video_speed", player_speed);
        }
    }

    setInterval(function(){
        for(let i=0; i<speed_arr.length; i++){
            document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list ")[i].onmousedown = function(){
                player_speed = parseFloat(this.innerHTML);
                localStorage.setItem("user_video_speed", player_speed);
                console.log("User changed the speed to: " + player_speed);
            }
        }
        var speed = parseFloat(document.querySelector(".bilibili-player-active").innerHTML);
        if(speed != player_speed){
            document.querySelector("li[data-value='" + player_speed + "']").click();
        }
    }, 500);

})();