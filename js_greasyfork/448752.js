// ==UserScript==
// @name         暑期教师培训
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description    学无止境，勇攀高峰！
// @author         网络服务（QQ：953278312）
// @include        *www.zxx.edu.cn/teacherTraining*
// @grant        unsafeWindow
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/448752/%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/448752/%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t=0;
    setTimeout(function(){
        if(document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j').length==1){
            document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j')[0].click()
            setTimeout(function(){
                document.querySelector('video').playbackRate =16
                //document.querySelector('video').currentTime=document.querySelector('video').duration;
                document.getElementsByClassName('vjs-icon-placeholder')[0].click()
            },5000)
        }else{
            document.querySelector('video').playbackRate =16
            //document.querySelector('video').currentTime=document.querySelector('video').duration;
            document.getElementsByClassName('vjs-icon-placeholder')[0].click()
        }
        document.querySelector('video').controls=true
        t= window.setInterval(study,10000);//重复执行某个方法
    },10000);
    function study() {
        if(document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-paused').length==1){
            document.getElementsByClassName('vjs-icon-placeholder')[0].click()
        }
        var str =document.getElementsByClassName ('course-video-reload');
        if(str.length!=0){
            //str[0].click ();
            location.reload();
        }
    }
    // Your code here...
})();