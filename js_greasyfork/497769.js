// ==UserScript==
// @name         播放优化
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  播放页面“ F |shift + F”全屏  “<”后退秒  “>”前进面  “↑”“↓”调节音量   直接点击数字键就可以调节倍速 （输入数字 1.5 就是 1.5倍）单独为bilibili做支持
// @author       You
// @match        *://*/*
// @match        *:///*/*
// @icon         https://www.nunuyy3.org/favicon.ico
// @grant        none
// @license      ***
// @downloadURL https://update.greasyfork.org/scripts/497769/%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497769/%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

function find_video(ele){
    let videos = ele.querySelectorAll('video');
    let current_video = videos[0];
    let vid ;
    let i =0;

    if(videos.length>0){
        vid = videos[0];
        while(i<videos.length && video.src==''){
            vid = videos[i++];
        }
        return vid;
    }else{
        return find_video(ele.parentElement)
    }
}
(function video_tool() {
    'use strict';
    var videos = document.getElementsByTagName('video');
    window.video = videos[0];
    var load_count = 10;
    var playbackRate ='';

    var i = 0;

    document.onmousemove=(e)=>{
        let tar = e.target;
        let i=0;
        let current_video = null
        window.video = find_video(tar);
    }

    if(video){
        while(i<videos.length && video.src==''){
            video = videos[i++];
        }
    }
    function enterFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    }

    function setPlaybackRate(){
        console.log(playbackRate)
        if(playbackRate>0){
            console.log(playbackRate,video)

            if(isNaN(playbackRate)){
                playbackRate = 1
            }
            video.playbackRate = playbackRate;
        }
        playbackRate = '';
    }

    document.onkeydown=function(e){
        console.log(e);
        console.log(e.keyCode);
        if(!isNaN(e.key) || e.keyCode == 110 /* '.'*/ ){
            playbackRate += e.key;
            setTimeout(setPlaybackRate,500);
        }else{
            if(e.keyCode==188){
                video.currentTime = video.currentTime - 5;
            }
            if(e.keyCode==190){
                console.log(video);
                console.log(video.currentTime= video.currentTime + 5 );
            }
            if(e.keyCode==38){
                video.volume = video.volume - 5;
            }
            if(e.keyCode==40){
                video.volume= video.volume + 5;
            }
            // 按下F键
            if(e.keyCode==70 && !e.shiftKey && !e.altKey && !e.ctrlKey){
                let vw = video.offsetWidth;
                let vh = video.offsetHeight;
                let p = video;
                let full_ele;
                if(location.href.indexOf('bilibili.com')>=0){
                    full_ele = document.querySelector('.bpx-player-container.bpx-state-paused.bpx-state-no-cursor')
                }else{
                    do{
                        full_ele =p;
                        p = p.parentElement;
                        console.log(p,`${vw}:${p.offsetWidth }   ,  ${vh}:${p.offsetHeight}`)
                    }while(p.offsetWidth == vw && p.offsetHeight == vh);
                }
                console.log(full_ele)
                console.log(video)
                enterFullScreen(full_ele);
            }
            // 按下 Alt + F 键
            if(e.keyCode==70 && e.shiftKey){
                enterFullScreen(video);
            }
        }
    }
})();