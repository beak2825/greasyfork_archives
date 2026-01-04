// ==UserScript==
// @name         youtube滚轮翻视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Youtube can now use mouse scroll to forward and backward
// @author       artlan a
// @include        https://www.youtube.com/watch?v=*
// @include      https://www.youtube.com/watch?app=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/469348/youtube%E6%BB%9A%E8%BD%AE%E7%BF%BB%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469348/youtube%E6%BB%9A%E8%BD%AE%E7%BF%BB%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var timer;

let scale = 1
function zoom(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    scale = event.deltaY;
    if (scale > 0){
        vi.currentTime=vit+5;
    }
    else if(scale < 0){
        vi.currentTime=vit-5;
    }
    document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy").style.display="";
        timer = setTimeout(function(){
            document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy").style.display="none"
        }, 300);
}

function pause(event){

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    if(vi.paused){
        vi.play();
    }else{
        vi.pause();
    }
    document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy").style.display="";
        timer = setTimeout(function(){
            document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy").style.display="none"
        }, 300);
    return false
}

window.addEventListener("yt-navigate-finish", function(event) {
    try{
        var vi = document.querySelector("#movie_player > div.html5-video-container > video")
        var vi2 = document.querySelector("#movie_player > div.ytp-chrome-bottom")
        var vi3 = document.querySelector("div#container> div.html5-video-player.ytp-transparent.ytp-exp-bottom-control-flexbox")
        vi.onwheel = zoom
        vi2.onwheel = zoom
        vi3.onwheel = zoom
        vi.oncontextmenu = pause
        vi2.oncontextmenu = pause
        vi3.oncontextmenu = pause
    }catch{}
    try{
        var timer = setTimeout(function(){
            var vi = document.querySelector("#movie_player > div.html5-video-container > video")
            var vi2 = document.querySelector("#movie_player > div.ytp-chrome-bottom")
            var vi3 = document.querySelector("div#container> div.html5-video-player.ytp-transparent.ytp-exp-bottom-control-flexbox")  //如果再出现视频黑边无法用暂停键或弹出了菜单，那就是selector又不对了，因为很多视频不一定selector能选对
            vi.onwheel = zoom
            vi2.onwheel = zoom
            vi3.onwheel = zoom
            vi.oncontextmenu = pause
            vi2.oncontextmenu = pause
            vi3.oncontextmenu = pause
        }, 500);
    }catch{}
    try{
        timer = setTimeout(function(){
            var vi = document.querySelector("#movie_player > div.html5-video-container > video")
            var vi2 = document.querySelector("#movie_player > div.ytp-chrome-bottom")
            var vi3 = document.querySelector("div#container> div.html5-video-player.ytp-transparent.ytp-exp-bottom-control-flexbox")  //如果再出现视频黑边无法用暂停键或弹出了菜单，那就是selector又不对了，因为很多视频不一定selector能选对
            vi.onwheel = zoom
            vi2.onwheel = zoom
            vi3.onwheel = zoom
            vi.oncontextmenu = pause
            vi2.oncontextmenu = pause
            vi3.oncontextmenu = pause
        }, 1000);
    }catch{}
})