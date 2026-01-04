// ==UserScript==
// @name         哔哩哔哩视频自动倍速播放（可记住用户设定值并自动设置播放速度）
// @license MIT
// @description  哔哩哔哩（bilibili.com）视频自动倍速播放，智能记忆用户设定的视频倍速并存储在本地，播放全站视频都会自动使用该倍速，例如全站视频都用1.25倍速播放，不用每次播放视频都要设置倍速。。修正不能自己修改速率的问题，增加快捷键切换速率，shift 1 2 3 5 = 1 2 1.25 1.5
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/users/875679-ijet
// @version      1.1.7
// @author       elmagnifico
// @match      *://www.bilibili.com/video/*
// @match      *://www.bilibili.com/medialist/play/watchlater/p*
// @match      *://www.bilibili.com/bangumi/play/ep*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491620/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%8F%AF%E8%AE%B0%E4%BD%8F%E7%94%A8%E6%88%B7%E8%AE%BE%E5%AE%9A%E5%80%BC%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/491620/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%8F%AF%E8%AE%B0%E4%BD%8F%E7%94%A8%E6%88%B7%E8%AE%BE%E5%AE%9A%E5%80%BC%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var player_speed = 2; // Default video speed
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

     window.addEventListener("keydown", (function(t) {
         if (t.shiftKey) {
             if (t.keyCode == 49) {
                 player_speed = 1;
                 localStorage.setItem("user_video_speed", player_speed);
             } else if ( t.keyCode == 50) {
                 player_speed = 2;
                 localStorage.setItem("user_video_speed", player_speed);
             } else if ( t.keyCode == 51) {
                 player_speed = 1.25;
                 localStorage.setItem("user_video_speed", player_speed);
             } else if ( t.keyCode == 53) {
                 player_speed = 1.5;
                 localStorage.setItem("user_video_speed", player_speed);
             } else if ( t.keyCode == 84) {
                 let bt = document.getElementsByClassName("item backup")[0];
                 if (bt) {
                     bt.click();
                 }
                 else {
                     document.getElementsByClassName("back-top")[0].click();
                 }
             }
             if (t.keyCode != 16) {
                 console.log("User changed the speed to: " + player_speed);
             }
         }
     }));

    setInterval(function(){
        for(let i=0; i<speed_arr.length; i++){
            (document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item ").length ? document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item ") : document.querySelector('ul.squirtle-speed-select-list').children)[i].onmousedown = function(){
                player_speed = parseFloat(this.innerHTML);
                localStorage.setItem("user_video_speed", player_speed);
                console.log("User changed the speed to: " + player_speed);
            }
        }
        if(document.querySelector(".bpx-player-ctrl-playbackrate"))
        {
            var speed = (document.querySelector(".bpx-player-ctrl-playbackrate-result")).innerHTML;
            if(speed == "倍速")
            {
                speed = 1;
            }
            else
            {
                speed = parseFloat(speed);
            }

            if(speed != player_speed){
                console.log("cur speed : " + speed);
                console.log("speed not same,change to: " + player_speed);
                (document.querySelector("li[data-value='" + player_speed + "']")|| Array.from(document.querySelectorAll('li.squirtle-select-item ')).filter((i) => {return i.innerText == player_speed.toFixed(1) + 'x'})[0]).click();
            }
        }
    }, 2000);

})();