// ==UserScript==
// @name         百度网盘视频倍数播放
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在视频播放页添加了几个倍数播放按钮
// @author       Linhj
// @match        *://*.pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382913/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/382913/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.onload=function(){
         var btn1=document.createElement("button");
         var node0=document.createTextNode("1倍");
         btn1.appendChild(node0);
         var elm0=document.getElementById("layoutMain");
         elm0.appendChild(btn1);
         btn1.style.position="absolute";
         btn1.style.left="50px";
         btn1.style.top="100px";
         btn1.style.height="25px";
         btn1.style.width="60px";
         btn1.onclick=function(){
             window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1)
             Toast('原速播放',2000)
         }
         var btn125=document.createElement("button");
         btn125.style.position="absolute";
         btn125.style.left="50px";
         btn125.style.top="125px";
         btn125.style.height="25px";
         btn125.style.width="60px";
         var node=document.createTextNode("1.25倍");
         btn125.appendChild(node);
         var elm=document.getElementById("layoutMain");
         elm.appendChild(btn125);

         btn125.onclick=function(){
             window.videojs.getPlayers("layoutMain").html5player.tech_.setPlaybackRate(1.25)
             Toast('1.25倍速播放',2000)
         }
        
         var btn15=document.createElement("button");
         var node2=document.createTextNode("1.5倍");
         btn15.appendChild(node2);
         btn15.style.position="absolute";
         btn15.style.left="50px";
         btn15.style.top="150px";
         btn15.style.height="25px";
         btn15.style.width="60px";
         elm.appendChild(btn15);
         btn15.onclick=function(){
             window.videojs.getPlayers("layoutMain").html5player.tech_.setPlaybackRate(1.5)
             Toast('1.5倍速播放',2000)
         };

         var btn175=document.createElement("button");
         btn175.style.position="absolute";
         btn175.style.left="50px";
         btn175.style.top="175px";
         btn175.style.height="25px";
         btn175.style.width="60px";
         var node3=document.createTextNode("1.75倍");
         btn175.appendChild(node3);
         elm.appendChild(btn175);
         btn175.onclick=function(){
             window.videojs.getPlayers("layoutMain").html5player.tech_.setPlaybackRate(1.75)
             Toast('1.75倍速播放',2000)
         }

         var btn2=document.createElement("button");
         btn2.style.position="absolute";
         btn2.style.left="50px";
         btn2.style.top="200px";
         btn2.style.height="25px";
         btn2.style.width="60px";
         var node4=document.createTextNode("2倍");
         btn2.appendChild(node4);
         elm.appendChild(btn2);
         btn2.onclick=function(){
             window.videojs.getPlayers("layoutMain").html5player.tech_.setPlaybackRate(2)
             Toast('2倍速播放',2000)
         }

         var btn25=document.createElement("button");
         btn25.style.position="absolute";
         btn25.style.left="50px";
         btn25.style.top="225px";
         btn25.style.height="25px";
         btn25.style.width="60px";
         var node5=document.createTextNode("2.5倍");
         btn25.appendChild(node5);
         elm.appendChild(btn25);
         btn25.onclick=function(){
             window.videojs.getPlayers("layoutMain").html5player.tech_.setPlaybackRate(2.5)
             Toast('2.5倍速播放',2000)
         }


      function Toast(msg,duration){
          duration=isNaN(duration)?3000:duration;
          var m = document.createElement('div');
          m.innerHTML = msg;
          m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
          document.body.appendChild(m);
          setTimeout(function() {
              var d = 0.5;
              m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
              m.style.opacity = '0';
              setTimeout(function() { document.body.removeChild(m) }, d * 1000);
          }, duration);
    }




     }

    // Your code here...
})();