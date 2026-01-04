// ==UserScript==
// @name         河北软件职业技术学院-视频播放
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  视频自动播放下一个
// @author       xiajie
// @match        http://*.cj-edu.com/studyAuthentication*
// @match        http://*.cj-edu.com/StartLearning*
// @match        https://*.cj-edu.com/studyAuthentication*
// @match        https://*.cj-edu.com/StartLearning*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cj-edu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/480798/%E6%B2%B3%E5%8C%97%E8%BD%AF%E4%BB%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/480798/%E6%B2%B3%E5%8C%97%E8%BD%AF%E4%BB%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var check = setInterval(function(){
        var len = $('#myVideo_html5_api').length;
        if(len > 0){
            console.log('检测到视频');
            clearInterval(check);
            videoPlay();
            videoStatus()
        }
    },1000);

    function videoPlay(){
        window.myVid = $('#myVideo_html5_api')[0];
        myVid.muted = true;
        myVid.play();
        myVid.playbackRate = 8;
    }

    function videoStatus(){
        setInterval(function(){
            var status = myVid.paused;
            if(status == true){
                myVid.play();
                myVid.playbackRate = 8;
            }
        },3000)
    }

})();