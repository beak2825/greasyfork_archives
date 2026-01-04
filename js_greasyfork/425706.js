

    // ==UserScript==
    // @name         石家庄铁道大学继续教育学院视频播放
    // @namespace    http://tampermonkey.net/
    // @version      0.4
    // @description  实现石家庄铁道大学继续教育学院视频播放，视频暂停后自动播放，自动切换下一章节
    // @author       陈孤岛
    // @match        http://jxjy.stdu.edu.cn/*
    // @match        http://220.194.70.38/student/*
    // @icon         https://www.google.com/s2/favicons?domain=stdu.edu.cn
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425706/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/425706/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Your code here...
        let videodom=document.querySelector('video')
        setTimeout(function () {
     setInterval(function(){

       if(videodom!==null){
            if(videodom.ended==true){
              document.querySelector('#nextChapter').click()

            }
           if(videodom.paused==true){
              document.querySelector('.vjs-poster').click()}
        }
        }, 3000)}, 3000)








    })();

