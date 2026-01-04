// ==UserScript==
// @name         翼狐脚本(作者 海岛奇兵 微信 haidaoqibing456)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  try to take over the world!
// @author       You
// @include       https://lib.yiihuu.com/*
// @icon         https://lib.yiihuu.com/assets/pc/designer/static/img/logo3.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459370/%E7%BF%BC%E7%8B%90%E8%84%9A%E6%9C%AC%28%E4%BD%9C%E8%80%85%20%E6%B5%B7%E5%B2%9B%E5%A5%87%E5%85%B5%20%E5%BE%AE%E4%BF%A1%20haidaoqibing456%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459370/%E7%BF%BC%E7%8B%90%E8%84%9A%E6%9C%AC%28%E4%BD%9C%E8%80%85%20%E6%B5%B7%E5%B2%9B%E5%A5%87%E5%85%B5%20%E5%BE%AE%E4%BF%A1%20haidaoqibing456%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

play_first();
    var bool = false
    window.onload = begin;
    function begin(){
        setInterval(function(){//重复判断是否播放结束
            var wb = document.querySelector('span.pv-time-current').innerText
            var wb1 = document.querySelector('span.pv-time-duration').innerText
            if(wb != "00:00" && wb == wb1){
                setTimeout(play_next,1000);
            }
        },3000)
    }
    function play_next(){
        var list = document.querySelectorAll("li.normal")
        for(var i=0;i<list.length;i++){
            if(list[i].getAttribute("class")=="normal list_num current"){
                if(i!=list.length-1){
                    list[i+1].click();
                    break;
                }
            }
        }
    }

    function play_first(){
        var do_play = document.querySelector("img#begin_play")
        do_play.click()
    }



})();