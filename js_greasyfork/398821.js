// ==UserScript==
// @name         视频速度控制器、视频网课学习必备、加速学习。
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  H5视频速度控制器，视频学习必备、加速学习。操作：减小速度：'Alt+<'，加大速度：'Alt+>'，恢复初始速度：'Alt+?'。长期更新，放心使用，评论意见看到必回
// @author       南墙
// @license      AGPL License
// @include  *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398821/%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8%E3%80%81%E8%A7%86%E9%A2%91%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0%E5%BF%85%E5%A4%87%E3%80%81%E5%8A%A0%E9%80%9F%E5%AD%A6%E4%B9%A0%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/398821/%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8%E3%80%81%E8%A7%86%E9%A2%91%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0%E5%BF%85%E5%A4%87%E3%80%81%E5%8A%A0%E9%80%9F%E5%AD%A6%E4%B9%A0%E3%80%82.meta.js
// ==/UserScript==
(function () {
    'use strict';
     function updatespeed(){
      document.getElementById('speeddivcur').innerHTML='speed:'+document.querySelector('video').playbackRate.toFixed(2);
    }

    var div = document.createElement("div");
    div.innerHTML = '<div id="speeddiv" style="position: fixed;left: 10px;bottom: 10px;z-index: 9999999;font-size: 50px;display: none;background-color: #1abc9c;color: #ecf0f1;border-radius: 3px;padding: 5px;opacity: 0.8;"></div>';
    document.getElementsByTagName('body')[0].appendChild(div);

    var div2 = document.createElement("div");
    div2.innerHTML = '<div id="speeddivcur" style="position: fixed;left: 10px;top: 10px;z-index: 9999999;font-size: 20px;display: block;background-color: #2980b9;color: #ffffff;border-radius: 3px;padding: 5px;opacity: 0.6;"></div>';
    document.getElementsByTagName('body')[0].appendChild(div2);
    document.getElementById('speeddivcur').innerHTML='speed:'+document.querySelector('video').playbackRate.toFixed(2);
    var cspeed=sessionStorage.getItem("cspeed");
    if(cspeed){
       var sInt=setInterval(function(){
         document.querySelector('video').playbackRate = cspeed;
         updatespeed();
       },100)
       setTimeout(function(){
         clearInterval(sInt);
       },10000)
    }
//  return;
    var itime='';

    document.onkeydown = function (event) {
            if(!document.querySelector('video')) return;
            clearInterval(sInt);
            event = event || window.event
            var fg=false;
            if (event.keyCode == 190 && event.altKey) {
                document.querySelector('video').playbackRate += 0.2
                fg=true
            }
            if (event.keyCode == 188 && event.altKey) {
                document.querySelector('video').playbackRate -= 0.2
                fg=true
            }
            if (event.keyCode == 191 && event.altKey) {
                document.querySelector('video').playbackRate = 1
                fg=true
            }
            if(fg){
              if(itime!==''){
                clearTimeout(itime);
              }
              sessionStorage.setItem("cspeed",document.querySelector('video').playbackRate );
              document.getElementById('speeddiv').style.display='block'
              document.getElementById('speeddiv').innerHTML='播放速度:'+document.querySelector('video').playbackRate.toFixed(2);
              updatespeed();
              itime=setTimeout(function(){
                  document.getElementById('speeddiv').style.display='none'
              },2000)
            }
        }
        // Your code here...
})();