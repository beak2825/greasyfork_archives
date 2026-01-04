// ==UserScript==
// @name         课堂自用
// @namespace    http://tmpermonkey.net/
// @version      0.1
// @description  福大长江雨课堂自用,无答题
// @author       alep
// @match        https://*.yuketang.cn/pro/lms/*/*/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443287/%E8%AF%BE%E5%A0%82%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443287/%E8%AF%BE%E5%A0%82%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function goNextVideo(){
        var url = window.location.href;
        var newVideoId = parseInt(/video\/([0-9]+)$/.exec(url)[1]) + 1;
        var newUrl = url.replace(/video\/[0-9]+$/,"video/" + newVideoId);
        window.location.href = newUrl;
    }
 
    function PlayandSpeed(){
        try{
            var video_elem = document.querySelector("video");
            if(video_elem != null){
                video_elem.muted = true;
                if(document.querySelector('.xt_video_player_big_play_layer').className.match('pause')){
                    video_elem.play();
                }
                video_elem.playbackRate = 2.0;
                document.querySelector(".xt_video_player_speed").click();
                var speed = document.querySelector(".xt_video_player_common_list");
                var speedChild = speed.firstChild;
                speedChild.click();
            }
        }catch(e){
            console.log(e);
        }
    }
 
    function main(){
        var progress = 'null';
       // PlayandSpeed();
 
        try{
            progress = document.querySelectorAll('span.text')[1].textContent.split("：")[1];
        }catch(e){
            console.log('读取时出错，查看是否为video');
            var elem= document.querySelector('#video-box');
            if(elem.innerHTML == ''){
                goNextVideo();
                return;
            }else{
                location.reload();
            }
        }
        try{
            progress = parseInt(progress.split("%")[0]);
            document.querySelector('div.title-fl:first-child').innerText = '脚本检测到进度：' + progress + '%';
            if(progress >= 95){
                goNextVideo();
                return;
            }
            setTimeout(main, 1000);
        }catch(e){
           console.log('读取时出错，尝试重试');
           location.reload();
        }
 
    }
 
    var url = window.location.href;
    if (url.match("/video")){
        if (window.onurlchange === null) {
            window.addEventListener("urlchange", () => {
                setTimeout(main, 2000);
 
            });
        }
        setTimeout(main, 2000);
    }
    // Your code here...
})();