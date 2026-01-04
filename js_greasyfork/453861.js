// ==UserScript==
// @name         至善学堂
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  视频不暂停
// @author       meow
// @match        https://xnjz.yunxuetang.cn/kng/course/package/*
// @icon         https://picobd.yunxuetang.cn/sys/15828173620/images/202108/c6999294b8f74f0ba718f7fde5d4e879.png?r=41702125
// @license      AGPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453861/%E8%87%B3%E5%96%84%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/453861/%E8%87%B3%E5%96%84%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    console.log("miado");
    var startTime=new Date().getTime();

    var dingShiId= window.setInterval(function(){
        if(new Date().getTime()-startTime>6000000){
            //超过6000秒，移除定时器
            clearInterval(dingShiId)
        }

        //点弹窗
        var btn = document.querySelector('#reStartStudy');
        if(btn!=null){
            myMousedown = true;
            btn.onclick();
            console.log("meow");
        }

        //定时器：1000毫秒一次
    }, 1000);

})();