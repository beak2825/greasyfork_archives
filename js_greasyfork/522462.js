// ==UserScript==
// @name         华医网|多开视频|跳过问答
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  优化不能多开视频学习的问题（现在1个课程理论上最快可以1个钟学完所有内容），定时清除烦人的课堂问答和温馨提示。
// @author       3042702458
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522462/%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A4%9A%E5%BC%80%E8%A7%86%E9%A2%91%7C%E8%B7%B3%E8%BF%87%E9%97%AE%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/522462/%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A4%9A%E5%BC%80%E8%A7%86%E9%A2%91%7C%E8%B7%B3%E8%BF%87%E9%97%AE%E7%AD%94.meta.js
// ==/UserScript==
window.onload = function(){
    var checkPlayState = null,
    href = window.location.href.split("/");
    href = href[href.length - 1].split("?")[0],
    getCookie = function(sKey) {
        var sCookie = document.cookie;
        if (!sCookie) return null;

        var sTag = sKey + "=";

        var iBegin = sCookie.indexOf(sTag);
        if (iBegin < 0) return null;

        iBegin += sTag.length;

        var iEnd = sCookie.indexOf(";", iBegin);
        if (iEnd < 0) iEnd = sCookie.length;

        return sCookie.substring(iBegin, iEnd);
    },
    delCookie = function (name, path, domain) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            var pathSegment = path ? ";path=" + path : "";
            var domainSegment = domain ? ";domain=" + domain : "";
            document.cookie = name + "=" + cval + pathSegment + domainSegment + ";expires=" + exp.toGMTString();
        }

    };
    delCookie("playState");
    if(href === 'course.aspx'){
        const pace_btn = document.getElementsByClassName('pace_btn')[0],
        input_element = document.createElement('input');
        Object.assign(input_element, {
            type: "button",
            value:"播放10个视频",
            id:"myAutoPlay"
        });
        pace_btn.append(input_element);

        document.getElementById('myAutoPlay').onclick = ()=>{
            document.querySelectorAll('.course').forEach((content, index)=>{
                if(index > 9)return;
                if(!content.textContent.includes('待考试')){
                    setTimeout(()=>{
                        const cwid = content.getElementsByTagName('h3')[0].getElementsByTagName('a')[0].getAttribute('href').split('cwid=')[1].split("'")[0];
                        if(document.cookie.includes('playState'))delCookie("playState");
                        console.log(index, document.cookie.includes('playState'));
                        window.open("https://cme28.91huayi.com/course_ware/course_ware_polyv.aspx?ff=0&ft=0&cwid=" + cwid);
                    }, index * 5000)
                }
            });
        }
    }

    setInterval(()=>{
        if(document.cookie.includes('playState'))delCookie("playState")
    }, 10);

    const oajax = $.ajax;
    $.ajax = function(e,t){
        if(e.success){
            e.success = function(data){}
        }
        oajax.call(this, e, t)
    };

    setInterval(function () {
        const video = document.getElementsByTagName('video')[0];
        if(video)video.volume = 0;

        try {
            if ($('.pv-ask-head').length && $('.pv-ask-head').length > 0) {
                console.log("检测到问题对话框，尝试跳过");
                $(".pv-ask-skip").click();
            };
        } catch (err) {};
        try {
            if ($('.signBtn').length && $('.signBtn').length > 0) {
                console.log("检测到签到对话框，尝试跳过");
                $(".signBtn").click();
            };
        } catch (err) {};
        try {
            if ($("button[onclick='closeProcessbarTip()']").length && $("button[onclick='closeProcessbarTip()']").length > 0 && $("div[id='div_processbar_tip']").css("display") == "block") {
                console.log("检测到温馨提示对话框（不能拖拽），尝试跳过");//
                //$("button[onclick='closeBangZhu()']").click();
                $("button[onclick='closeProcessbarTip()']").click();
            };
        } catch (err) {};
        try {
            if ($("button[class='btn_sign']").length && $("button[class='btn_sign']").length > 0) {
                console.log("检测到温馨提示对话框（疲劳提醒），尝试跳过");
                $("button[class='btn_sign']").click();
            };
        } catch (err) {};
        try {
            var state = document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
            if ($('video').prop('paused') == true && state != "已完成") {
                console.log("视频意外暂停，恢复播放");
                $('video').get(0).play();
                $('video').prop('volumed') = 0;
                $('video').prop('muted') = true;
            } else if (state == "已完成") {
                document.querySelector("video").pause();
            };
        } catch (err) {};
    }, 2000);
}