// ==UserScript==
// @name         2021重庆人社专技继续教育小节自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只支持选修小节自动播放
// @author       XXX
// @match        http*://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427880/2021%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E4%B8%93%E6%8A%80%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/427880/2021%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E4%B8%93%E6%8A%80%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
   
    setInterval(function(){
       //获取播放时间和视频时间
        var min_time = parseInt($('#minStudyTime').text());
        var studied_time =  parseInt($('#studiedTime').text());
        if(min_time-studied_time<=1){
 //刷新网页学习下一段
            window.location.reload();
        }
        console.log('已经学习:'+studied_time+' |总时间:'+min_time);
    }, 1000*30);
    // Your code here...
})();