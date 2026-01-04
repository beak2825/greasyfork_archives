// ==UserScript==
// @name         百度网盘视频倍速播放（增强版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在视频播放页添加了几个倍数播放按钮（1、1.25、1.5、2、3）
// @author       Linhj
// @match        https://pan.baidu.com/play/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390822/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/390822/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.onload=function(){
       
        var btn1=document.createElement("button");
         var node1=document.createTextNode("1倍");
         btn1.appendChild(node1);
         var elm=document.getElementById("video-toolbar");
         elm.appendChild(btn1);

         btn1.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1)
         }
          btn1.style.marginLeft="300px";
       
         var btn125=document.createElement("button");
         var node=document.createTextNode("1.25倍");
         btn125.appendChild(node);
         var elm=document.getElementById("video-toolbar");
         elm.appendChild(btn125);

         btn125.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.25)
         }

       
         var btn15=document.createElement("button");
         var node2=document.createTextNode("1.5倍");
         btn15.appendChild(node2);
         elm.appendChild(btn15);
         btn15.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.5)
         };

         var btn175=document.createElement("button");
         var node3=document.createTextNode("1.75倍");
         btn175.appendChild(node3);
         elm.appendChild(btn175);
         btn175.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.75)
         }

         var btn2=document.createElement("button");
         var node4=document.createTextNode("2倍");
         btn2.appendChild(node4);
         elm.appendChild(btn2);
         btn2.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(2)
         }
       
       var btn4=document.createElement("button");
         var node5=document.createTextNode("3倍");
         btn4.appendChild(node5);
         elm.appendChild(btn4);
         btn4.onclick=function(){
              window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(3)
         }




     }

    // Your code here...
})();