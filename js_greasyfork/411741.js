// ==UserScript==
// @name         石铁继续教育小助手
// @namespace    http://jxjy.stdu.edu.cn/student/
// @version      1.2
// @description  石家庄铁道大学继续教育学院
// @author       SA.Li
// @match        http://jxjy.stdu.edu.cn/student/*
// @match        http://220.194.70.38/student/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411741/%E7%9F%B3%E9%93%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411741/%E7%9F%B3%E9%93%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // Your code here...
        let videodom=document.querySelector('video')
        setTimeout(function () {
     setInterval(function(){
         $("#rememberTime").click();
         console.log("接着看吧，时长已记录");
       if(videodom!==null){
            if(videodom.ended==true){
              document.querySelector('#nextChapter').click()
                console.log("下一节开始播放");
            }
           if(videodom.paused==true){
              document.querySelector('.vjs-poster').click()
               console.log("继续播放");}
           
        }
        }, 5000)}, 9000)

})();