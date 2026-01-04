// ==UserScript==
// @name         PlayOrDownload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  We Should try!
// @author       You
// @match        https://x99av.com/video/**
// @match       https://api.theporn.xyz/video/**
// @icon         https://www.google.com/s2/favicons?domain=x99av.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430348/PlayOrDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/430348/PlayOrDownload.meta.js
// ==/UserScript==
/*jshint esversion: 6 */


var num = -1;
var localhost;
var m3u8_ClassName;
var video_play;


function addDIV(video_play,num){


    
console.log("host:"+localhost);
    let btn1 = document.createElement("button");
     btn1.setAttribute("id","btn1")

    let btn2 = document.createElement("button");
      btn2.setAttribute("id","btn2")
      let videoTg = document.getElementById(video_play);
    if(!videoTg){
        videoTg = document.getElementById("orginal_video_player").parentNode;
    }else {
        videoTg = document.getElementById(video_play).parentNode;
    }
    btn1.innerHTML = "播放";
    btn2.innerHTML = "下载";

        videoTg.appendChild(btn1);
        videoTg.appendChild(btn2);



 document.getElementById("btn1").onclick=function () {

     window.open("http://www.m3u8player.top/?play="+localhost+findM3U8());};


 document.getElementById("btn2").onclick=function () {

     window.open("https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source="+localhost+findM3U8());};
     };




function findM3U8(m3u8_className) {
      let sc = document.getElementsByClassName(m3u8_ClassName)[0].getElementsByTagName("script")[0].innerHTML;
      let m3u8 = sc.substring(sc.indexOf("/video/"),sc.indexOf("m3u8?et=")+4);
        console.log("m3u8:"+m3u8)

        if (m3u8==null||m3u8==''){
            alert("m3u8为空")
            return ;
        };



      //  let input = document.getElementById("customInput");
      //  input.value = m3u8;
      //  input.select();
      //  document.execCommand("copy");
       // alert(m3u8);

        return m3u8;
    };

function play(){


}

function isReady(){
     let url = window.location.href;
    if(url.includes("https://x99av.com/")){
      video_play="video-player-container";
      m3u8_ClassName = "pb-3 pb-e-lg-30 __player__container";

    }else if(url.includes("https://api.theporn.xyz/")){
         video_play="download-button";
      m3u8_ClassName = "ui 16:9 embed color-loader";
    }
    localhost ="https://"+ window.location.host;
     let b1 = url.search("video") !=-1;
       let b2 = url.search("m3u8") ==-1;
       let b = b1&&b2;
       console.log(b);
        if (!b){
            return;
        }
    console.log("video_play"+video_play);
   console.log(" m3u8_ClassName"+ m3u8_ClassName)
 addDIV(video_play,num);
}
window.onload = function(){ isReady();}





