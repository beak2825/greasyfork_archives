// ==UserScript==
// @name         国家智慧教育公共服务平台 教师能力提升中心 刷课
// @namespace    
// @license      CC BY-NC-SA
// @version      0.2
// @description  仅支持进入播放页面后自动静音播放、播放下一集。
// @author       B4a
// @match        https://core.teacher.vocational.smartedu.cn/p/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449115/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E6%95%99%E5%B8%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%AD%E5%BF%83%20%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449115/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E6%95%99%E5%B8%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%AD%E5%BF%83%20%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(myfunc, 2000);
    function myfunc(){
        var elevideo = document.getElementsByTagName("video")[0];
        elevideo.muted = true;
        elevideo.play();
        console.log("开始播放");
        var num_ep = document.getElementsByClassName("video-title").length;
        var current = 1;
        elevideo.addEventListener('ended', function () { //结束
            if (current<=num_ep){
                console.log("播放结束，切换下一个");
                document.getElementsByClassName("video-title")[current].click();
                current += 1;
                setTimeout(mute, 1000);
            }
            else {
                console.log("播放结束");
            }
        }, false);
    }
    function mute() {
        var elevideo = document.getElementsByTagName("video")[0];
        elevideo.muted = true;
    }
})();