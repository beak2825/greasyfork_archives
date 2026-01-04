// ==UserScript==
// @name         xx职业技能提升自动点击
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动点击未观看的课程，自动点击确定，自动下一章,自动刷新页面，省去频繁点击的烦恼
// @author       spark
// @match        https://www.bjjnts.cn/lessonStudy/*
// @license      GPL-3.0-or-later
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407493/xx%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/407493/xx%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var seace=0;
    var num=Math.round(Math.random()*(7-3))+3;
    if($("a[data-lock='1']").length>0){
        setTimeout(function (){
            $("a[data-lock='0']").last().click();
        }, 5000);
    }

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