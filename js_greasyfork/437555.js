// ==UserScript==
// @name    YouTube滾輪前進後退
// @description 前進後退1秒
// @version 1.0.21
// @match https://www.youtube.com/*
// @ 上行由@include改成@match，避免警告
// @exclude https://www.youtube.com/live_chat*
// @namespace https://greasyfork.org/users/857147
// @downloadURL https://update.greasyfork.org/scripts/437555/YouTube%E6%BB%BE%E8%BC%AA%E5%89%8D%E9%80%B2%E5%BE%8C%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/437555/YouTube%E6%BB%BE%E8%BC%AA%E5%89%8D%E9%80%B2%E5%BE%8C%E9%80%80.meta.js
// ==/UserScript==
var video,ele,oldHref,videoCurrentTime=0
//window.addEventListener('mousemove',windowMove,false)//預設為false，則為監聽冒泡階段；若改為true，就是監聽捕獲階段
//windowMove()
const style=document.createElement('style');style.appendChild(document.createTextNode('.YtPlayerProgressBarHostHidden{all:unset!important}'));document.head.appendChild(style)
//↑2024-8-29讓Shorts的隱藏滾動條失效↑
setInterval(windowMove,100)
function windowMove(){//console.log(location.href)
  if(document.querySelector('yt-page-navigation-progress')&&!document.querySelector('yt-page-navigation-progress').hidden){return}//2023/6/25加入，避免抓不到正確video
  if(location.href==oldHref&&video){return}
//if(location.href=='https://www.youtube.com/'){video=document.getElementById('inline-player').querySelector('video');ele=video?video.parentElement.parentElement:null}//2022/1/30加入，讓預覽也加入滾輪
//if(location.href=='https://www.youtube.com/'){video=document.querySelector('.video-stream.html5-main-video[data-no-fullscreen]');ele=video?video.parentElement.parentElement:null}//2023/4/4因為YouTube改版，將上行改成這行，讓預覽也加入滾輪
//if(location.href=='https://www.youtube.com/'){video=document.querySelector('.video-stream.html5-main-video[data-no-fullscreen]');ele=video?video.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement:null}//2024/4/21因為YouTube改版，將上行改成這行，讓預覽也加入滾輪
//if(location.href=='https://www.youtube.com/'){video=document.querySelector('.video-stream.html5-main-video[data-no-fullscreen]');ele=video?document.getElementById('media-container'):null}//2024/6/25將上行改成這行比較直接，讓預覽也加入滾輪
  if(location.href=='https://www.youtube.com/'){ele=document.getElementById('media-container-link');video=ele?ele.querySelector('video'):null}//2024/6/26將上行改成這行比較直接，讓預覽也加入滾輪
  else{video=document.querySelector('.video-stream.html5-main-video[src]');ele=video;video&&console.log('video',video)}//選中有src屬性的<video>

 if(video){
  start()
//window.removeEventListener('mousemove',windowMove,false)
 }
 oldHref=location.href
}

function start()
{
 //try{document.querySelector('ytd-reel-video-renderer[is-active]').querySelector('#progress-bar-line').removeAttribute("hidden")}catch(e){}//使Shorts的進度條一律顯示
 //try{document.querySelector('ytd-reel-video-renderer[is-active]').querySelector('#overlay').querySelector('#progress-bar-line').removeAttribute("hidden")}catch(e){}//2023-11-3以上改此行
 //try{document.querySelector('ytd-reel-video-renderer[is-active]').querySelector('#progress-bar-line').removeAttribute("hidden")}catch(e){}//2023-12-5以上改此行
 //if(ele!=video){ele.parentElement.addEventListener('click',function(e){location.href=ele.querySelector('.ytp-title').querySelector('a').href;e.preventDefault();e.stopPropagation()},true)}//click預覽影片會沒反應
 if(ele!=video){ele.addEventListener('click',function(e){videoCurrentTime=video.currentTime},true)}//true:把這個 listener添加到捕獲階段，原本是用冒泡階段的onclick會導致video.currentTime被系統提前歸零
 else{if(location.href.indexOf('t=')==-1){video.currentTime=videoCurrentTime;videoCurrentTime=0}}//2022/12/25加入，若URL有播放時間，則video.currentTime不處理
 ele.onmousewheel=function(e){e.preventDefault();if(e.wheelDelta>0){video.currentTime-=1}else{video.currentTime+=1}}
}

/*過去寫法
//@include https://www.youtube.com/*
//@exclude https://www.youtube.com/embed*
//@exclude https://www.youtube.com/live_chat_replay*
console.log('YouTube網址：'+location.href)
var tmp=setInterval(function(){
        if(location.href.indexOf('watch')!=-1){console.log('執行腳本！');clearInterval(tmp);start()}
        },1000)
function start()
{
 var video=document.getElementsByClassName('video-stream html5-main-video')
 video=video[video.length-1]//取得陣列最後1個元素
 video.addEventListener("mousewheel",
 function(e){e.preventDefault();if(e.wheelDelta>0){video.currentTime+=1}else{video.currentTime-=1}})
}
*/
