// ==UserScript==
// @name         jx职业技能提升免验证自动化
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  （仅适用于江西省）自动点击未观看的课程，自动点击确定，自动下一章,自动刷新页面，去除**验证。
// @author       anonymous
// @match        https://jiangxi.zhipeizaixian.com/lessonStudy/*
// @license      GPL-3.0-or-later
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/415530/jx%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E5%85%8D%E9%AA%8C%E8%AF%81%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/415530/jx%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E5%85%8D%E9%AA%8C%E8%AF%81%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //去除摄像头验证
    console.log(is_supported_userMedia);
    window.setInterval(showalert, 1000);
function showalert()
    {
    isface=0;
    beginFaceSign=0;
    is_supported_userMedia='';
    isPlay=true;
    }
    //自动点击确认继续观看
    var seace=0;
    var num=Math.round(Math.random()*(7-3))+3;
    if($("a[data-lock='1']").length>0){
        setTimeout(function (){
            $("a[data-lock='0']").last().click();
        }, 2000);
    }
    //自动进入下一章节视频
    $("body").bind('DOMNodeInserted', function(e) {
        var roundtime=Math.round(Math.random()*10000);
        if($(".layui-layer-title").length >0){
            setTimeout(function (){
                $(".layui-layer-btn0").click();
            }, roundtime);
        }
        if($('.face_recogn').css('display')=='block'){
            setTimeout(function (){
                $(".face_startbtn").click();
            }, roundtime);

        }
    });

    // 播放结束
    video.addEventListener('ended', function(e) {
        var roundtime=(Math.round(Math.random()*(20-5))+5)*1000;
        if(seace==num&&$("a[data-lock='1']").length>0){
            location.reload();
        }
         setTimeout(function (){
                if($(".course_study_sonmenu.on").parent().next().children("div").children("a").attr("data-lock")=="0"){
                    $(".course_study_sonmenu.on").parent().next().children("div").children("a").click();
                }
            }, roundtime);
        seace++;
    })
})();