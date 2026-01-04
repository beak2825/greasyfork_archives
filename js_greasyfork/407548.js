// ==UserScript==
// @name         Neusoft
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击
// @author       spark
// @match        https://www.bjjnts.cn/*
// @exclude      https://www.bjjnts.cn/userCourse
// @exclude      https://www.bjjnts.cn/userCenter
// @exclude      https://www.bjjnts.cn/login
// @exclude      https://www.bjjnts.cn/userSetting
// @exclude      https://www.bjjnts.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407548/Neusoft.user.js
// @updateURL https://update.greasyfork.org/scripts/407548/Neusoft.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").bind('DOMNodeInserted', function(e) {
        if($(".layui-layer-title").length >0){
            setTimeout(function (){
                $(".layui-layer-btn0").click();
            }, 3000);
        }
        if($('.face_recogn').css('display')=='block'){
            setTimeout(function (){
                $(".face_startbtn").click();
            }, 3000);

        }
    });

    $(".new_demoul").bind('DOMNodeInserted', function(e) {
        if( $(".course_study_sonmenu.on").length>0){
            setTimeout(function (){
                if($(".course_study_sonmenu.on").parent().next().children("div").children("a").attr("data-lock")=="0"){
                    $(".course_study_sonmenu.on").parent().next().children("div").children("a").click();
                }
            }, 10000);
        }

    });
})();