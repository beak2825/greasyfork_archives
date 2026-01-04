// ==UserScript==
// @name         金蓝领刷课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  金蓝领培训课程刷课。适用于山东瀚德职业培训学院互联网+职业技能培训网的职业资格线上学习课程。注意：页面刷新后需要在页面随便点击后脚本才能生效。
// @author       小舟
// @license      GPLv3
// @match        https://www.wljnpx.com/user/player/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @supportURL   mailto:arbor78@qq.com
// @downloadURL https://update.greasyfork.org/scripts/473038/%E9%87%91%E8%93%9D%E9%A2%86%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/473038/%E9%87%91%E8%93%9D%E9%A2%86%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('金蓝领自动学,坐等10s');
    setTimeout(start,10000);

    function start(){
        console.log('开始金蓝领自动学。注意：页面刷新后需要在页面随便点击后脚本才能生效。');

        setTimeout(run,2000);

    }

    function run(){
        setInterval(function(){

            let btnPlay=document.querySelector("#player > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-line-hide.pv-base-control > div.pv-controls > div.pv-controls-left > button.pv-playpause.pv-iconfont.pv-icon-btn-play");

            if(!btnPlay)return;
            console.log('金蓝领-找到播放按钮,模拟点击...');
            btnPlay.click();

        },5000);
    }

})();