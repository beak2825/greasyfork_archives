// ==UserScript==
// @name         兵器网络教育平台刷课助手
// @namespace    http://framist.top/
// @version      0.1
// @description  兵器网络教育平台刷课助手，自动并快速刷课，一个草草的初期版本
// @author       You
// @match        https://www.bqrcy.com/Home/User/course?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bqrcy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479717/%E5%85%B5%E5%99%A8%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479717/%E5%85%B5%E5%99%A8%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 在页面加载完成后执行
    window.addEventListener('load', function() {
       setInterval(function() {
           // Get the video element
           var video = document.querySelector('video');
           if (video) {
               video.playbackRate = 16.0;
               video.ontimeupdate = null;
               if (video.currentTime < video.duration - 10){
                   video.currentTime = video.duration - 5;
               }
               video.play();
           }
           checkAndAutoConfirm();
        }, 1000); // 每秒检查一次
        //is_vip = 1; //todo

    });

        // Wait for the DOM content to be loaded
    document.addEventListener('DOMContentLoaded', function() {

    });

    // 监视确认框并自动点击确定
    function checkAndAutoConfirm() {
        // 检查是否有确认框
        if (window.confirm) {
            // 弹出确认框，并自动点击确定
            window.confirm = function() {
                return true;
            };
        }
    }

})();