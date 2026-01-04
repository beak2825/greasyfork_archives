// ==UserScript==
// @name         bili_上下p控制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ctl + <>键控制上一p或下一p
// @author       kakasearch
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416820/bili_%E4%B8%8A%E4%B8%8Bp%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416820/bili_%E4%B8%8A%E4%B8%8Bp%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function FullScreen() {
        //全屏播放
        var ele = document.getElementsByTagName('video')[0]
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullScreen) {
            ele.webkitRequestFullScreen();
        }
    }
    function isFullscreen(){
            return document.fullscreenElement    ||
                   document.msFullscreenElement  ||
                   document.mozFullScreenElement ||
                   document.webkitFullscreenElement || false;
        }
    let full_flag = 0
    window.document.addEventListener("keydown", function(event){
        var e = window.event
            if(isFullscreen()){full_flag=1}else{full_flag=0}
            if((window.event.ctrlKey)&&(window.event.keyCode==190)){//下一个视频
                document.querySelector("ul > li.ep-item.cursor.visited"
                                      ).nextElementSibling.click()

            }else if((window.event.ctrlKey)&&(window.event.keyCode==188)){//上一个视频
                document.querySelector("ul > li.ep-item.cursor.visited").previousElementSibling.click()
            }
        if(full_flag){
                    //之前是全屏播放的
                    let obser = setInterval(
                    function(){
                            let video= document.querySelector("#bilibili-player video")
                            if(video){
                                clearInterval(obser)
                                FullScreen()
                                full_flag = 0
                            }

                        },200
    )
                }

    });

    // Your code here...
})();