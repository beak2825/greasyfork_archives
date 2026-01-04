// ==UserScript==
// @name         MaiziEduCracked
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  啧
// @author       皮蛋萌
// @match        *.maiziedu.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378101/MaiziEduCracked.user.js
// @updateURL https://update.greasyfork.org/scripts/378101/MaiziEduCracked.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = document.createElement('style');
    css.innerHTML = 'a.font14.color66:visited{color:lightseagreen}';
    document.body.appendChild(css);
    //document.body.appendChild = 1;
    $(".toolbar").remove();
    //假装购买课程
    $isPaid="True";
    //删除各种监听器
    $('.big-play-button').off('click');
    $('.loading-video').off('click');
    $('.play-control').off('click');
    $('video').off('click');
    $(".play-rate-menu ul li").off('click');
    $(".volume-bar,.volume-dot,.volume-level,.volume-size").off("click");
    console.log($lessonUrl)
    //重新添加监听器，去除验证
    $(".loading-video, .play-control").on("click",function() {
        var e = get_current_lesson_index();
        videoWrap.attr("src", $lessonUrl), videoWrap.load();

    })

    $("video, .big-play-button, .loading-video, .play-control").on("click",function() {
        var e = get_current_lesson_index();
        startPause();
    })
    //$("video, .big-play-button, .loading-video, .play-control").on("click",function(){var e=get_current_lesson_index();"True"==$thisUser&&1==e||2==e?startPause():""==$isPaid&&"True"==$needPay?pop_pay():startPause()})

    //$(".loading-video, .play-control").on("click",function(){var e=get_current_lesson_index();"False"==$thisUser?login_popup("请先登录"):(1==OFF1&&($studentClass.length>0?(videoWrap.attr("src",$vipUrl),videoWrap.load()):1==e||2==e?(videoWrap.attr("src",$lessonUrl),videoWrap.load()):(""!=$isPaid||"True"!=$needPay)&&(videoWrap.attr("src",$lessonUrl),videoWrap.load())),OFF1=!1)})
    //$('video').off('play');
    //记录播放速度
    $(".play-rate-menu ul li").click(function() {
        var e = $(this).text().split("x")[0];
        $(this).addClass("on").siblings().removeClass("on"),
            video.playbackRate = e,
            $(this).parents(".play-rate-menu").siblings("span").text(e + "x")
        var rate = {'1':3,'1.25':2,'1.5':1,'2':0};
        localStorage.pRate = rate[e];
    })
    //
    $(".volume-bar,.volume-dot,.volume-level,.volume-size").off("click").on("click",function(e) {
        updateVolume(e.pageX);
        localStorage.pVolume = e.pageX;
        console.log(localStorage.pVolume);
    })

    try{
        $(".play-rate-menu ul li")[localStorage.pRate].click();
    }catch(err){console.log('Have no LocalStorage Of Rate !!!')}
    try{
        updateVolume(localStorage.pVolume);
    }catch(err){console.log('Have no LocalStorage Of Volume !!!')}
})();