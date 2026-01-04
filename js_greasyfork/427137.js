// ==UserScript==
// @name         慕课学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  国科大慕课学习，鼠标离开界面不会暂停，且不用在视频中答题
// @author       You

// @match        http://mooc1.ecourse.ucas.ac.cn/ananas/modules/video/index.html?**
// @icon         https://www.google.com/s2/favicons?domain=ucas.ac.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427137/%E6%85%95%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/427137/%E6%85%95%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t2 = window.setInterval(function() {

       var eles = document.getElementsByClassName('vjs-big-play-button');
       var btn = eles[0];
       if(btn.hidden == false){
           btn.click();
       }



    },100)

    var tstop = window.setTimeout(function() {

       var stop = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-playing")[0];
       stop.onclick = function(){
            window.clearInterval(t2);
           console.log('stop');
           var start = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
           start.onclick = function(){
               window.setInterval(t2);
           };
       };
    },1000)


    /*var tv = window.setTimeout(function() {

       var video = document.getElementById("video_html5_api")[0];
       video.onclick = function(){
            window.clearInterval(t2);
           console.log('stop');
           var start = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
           start.onclick = function(){
               window.setInterval(t2);
           };
       };;
    },1100)

    function stopF(){
        window.clearInterval(t2);
        console.log(1);
        var start = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
        start.onclick = startF;
    }

    function startF(){
         window.setInterval(t2);
    }
*/




})();