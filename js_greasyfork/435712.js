// ==UserScript==
// @name         福大长江雨课堂自用
// @namespace    http://tmpermonkey.net/
// @version      0.5
// @description  福大长江雨课堂自用,无答题
// @author       alep
// @match        https://changjiang.yuketang.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435712/%E7%A6%8F%E5%A4%A7%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435712/%E7%A6%8F%E5%A4%A7%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var progress = null;
    var i = 0;

    function goNextVideo(){
        var url_split = window.location.href.split("/");
        var new_video_id = parseInt(url_split.pop()) + 1;
        url_split.push(new_video_id);
        var new_url = url_split.join("/")
        window.location.href = new_url;
    }

    function PlayandSpeed(){
        try{
            var promise = null;
            var video_elem = document.querySelector("video");
            if(video_elem != null){
                video_elem.muted = true;
                var mute = document.querySelector(".xt_video_player_common_icon");
                if(!mute.className.match('muted')){
                    mute.click()
                }
                var speed = document.querySelector("xt-speedlist")
                if(speed){
                    var double_speed = speed.firstChild.firstChild
                    if(!mute.className.match('active')){
                        speed.style.display = 'block';
                        speed.style.opacity = 100;
                        double_speed.click();
                    }
                }
                if(document.querySelector('.xt_video_player_big_play_layer').className.match('pause_show')){
                    promise = video_elem.play();
                }
            }
        }catch(e){
            console.log(e);
        }
    }

    function getProgressInterval(){
        progress = document.querySelectorAll('span.text')[1].textContent.split("：")[1];
        if(progress){
            progress = parseInt(progress.split("%")[0]);
            document.querySelector('div.title-fl:first-child').innerText = '脚本检测到进度：' + progress + '%';
        }
    }

    function goNextPage(){
       if(progress >= 95 || document.querySelector("#video-box").innerHTML==""){
            goNextVideo();
            console.log('下一个视频');
       }
    }

    function main(){
        var interval_progress = window.setInterval(getProgressInterval,1000);
        var interval_next_page = window.setInterval(goNextPage,1000);
        var interval_play = window.setInterval(PlayandSpeed,1000);
    }

    window.onload=function(){
        main();
    };


})();