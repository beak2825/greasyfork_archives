// ==UserScript==
// @name         91huayi_auto_class(91华医公需课选修课视频考试我全都要)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  91huayi_auto_class_
// @author       Acdtms4zfx
// @match        *://*.91huayi.com/course_ware/*
// @grant        none
// @license      CC BY-NC-ND 2.0 DEED
// @downloadURL https://update.greasyfork.org/scripts/490588/91huayi_auto_class%2891%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%E9%80%89%E4%BF%AE%E8%AF%BE%E8%A7%86%E9%A2%91%E8%80%83%E8%AF%95%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490588/91huayi_auto_class%2891%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%E9%80%89%E4%BF%AE%E8%AF%BE%E8%A7%86%E9%A2%91%E8%80%83%E8%AF%95%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81%29.meta.js
// ==/UserScript==

// 公需课 ： 自动尝试跳过问题
// 选修课 ： 自动尝试跳过课程

(function() {
    'use strict'
    alert = console.log;
    console.log('91huayi_auto_class_v3');
    var wait_time=6;
    function enableStartExam(){
        var btn_exam = $("#jrks");
        showExam(true);
        var p = $("<p>   </p>");
        p.appendTo(btn_exam);
        setTimeout(() => {
            p.trigger('click');
        }, wait_time);
    }
    function sleep(time, unit){
        if(time == null){time = wait_time * 1000;}
        if(unit != null){time = time * 1000;}
        for(var t = Date.now();Date.now() - t <= time;);
    }
    sleep();
    var fuc = setInterval(function() {
        if (typeof(banSeek)=="undefined"){
            console.log("无法判断是否能自动跳过课程，请自己尝试。");
        }else{
            if (banSeek=="off"){
                enableStartExam();
            };
        };
        document.querySelector("#video > div > div.pv-video-wrap > video").muted=true; //启用未交互后台播放
        document.querySelector("#video > div > div.pv-video-wrap > video").play(); //播放
        document.querySelector("#video > div > div.pv-video-wrap > video").volume=0; //播放器静音
        closeBangZhu(); //关闭提示弹窗
        if (document.querySelector("#video > div > div.pv-line-tips") != null){
            document.querySelector("#video > div > div.pv-line-tips > a").click();
        }; //切换线路
        if (document.querySelector("#video > div > div.pv-ask-modal-wrap") != null){
            document.querySelector("#video > div > div.pv-ask-modal-wrap").remove();
        }; //清除问题
        if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right") != null){
            for (var i=1;i<=document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right").childElementCount;i++){
                if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button") != null){
                    if(document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button").className.indexOf('pv-icon-volumeon') != -1){
                        document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button").click();
                    };
                };
            };
        }; //播放按钮静音
        if (if_rate_play==true){
            if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right") != null){
                for (var i=1;i<=document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right").childElementCount;i++){
                    if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > div > div") != null){
                        if(document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > div > div").className.indexOf('pv-rate-select') != -1){
                            if(document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control.pv-stream-hide > div.pv-controls > div.pv-controls-right > div.pv-component-wrap.pv-small-hide.pv-btn-radius > div > div").childElementCount != 0){
                                //document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > div > div > div:nth-child(1)").setAttribute("data-rate",16);//MaxPower!!!
                                document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > div > div > div:nth-child(1)").click();
                            }
                        }
                    };
                };
            };
        };//加速播放
        initialSign(); //调用签到保活（保持播放）
        while (document.querySelector("#video > div > div.sign-in-menu > div > div.sign-in-wrap > div.sign-in-wrap_btn > span") != null){
            document.querySelector("#video > div > div.sign-in-menu > div > div.sign-in-wrap > div.sign-in-wrap_btn > span").click();
        }; //签到
        //Skip video, use at you own risk!!!
        //showExam(true);
        //delCookie("playState");
        //addCourseWarePlayRecord();
        //Skip video, use at you own risk!!!
        document.querySelector("#jrks").click();
    },wait_time * 1000);
})();