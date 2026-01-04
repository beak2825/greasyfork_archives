// ==UserScript==
// @name         慕课学习v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动播放、视频内自动答题
// @author       You
// @match        http://mooc1.ecourse.ucas.ac.cn/ananas/modules/video/index.html?**
// @icon         https://www.google.com/s2/favicons?domain=ucas.ac.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460346/%E6%85%95%E8%AF%BE%E5%AD%A6%E4%B9%A0v2.user.js
// @updateURL https://update.greasyfork.org/scripts/460346/%E6%85%95%E8%AF%BE%E5%AD%A6%E4%B9%A0v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var quizradio = window.setInterval(function() {
       if(document.getElementsByClassName('tkTopic')){
           //var ul = document.getElementsByClassName('tkItem_ul')[0];
           //var lis = ul.getElementsByTagName("li");
           var ins = document.getElementsByName('ans-videoquiz-opt');

           for (var i = 0; i < ins.length; i++) {
               let in1 = ins[i];
               in1.checked = true;
               //let li = lis[i];
               //let in1 = li.getElementsByTagName('input');
               //in1[0].check = true;
               var button = document.getElementById('videoquiz-submit');
               button.click();
               //sleep(1000);
               if(window.getComputedStyle(document.getElementById('spanNot')).display == 'block')
                   break;
               else
                   continue;
           }
       }
    },1000)
    var t2 = window.setInterval(function() {

       var eles = document.getElementsByClassName('vjs-big-play-button');
       var btn = eles[0];
       if(btn.hidden == false){
           btn.click();
       }



    },100)

    var tstop = window.setTimeout(function() {

       var stop = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-playing")[0];
       stop.onclick = function(){
            window.clearInterval(t2);
           console.log('stop');
           var start = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
           start.onclick = function(){
               window.setInterval(t2);
           };
       };
    },1000)
})();