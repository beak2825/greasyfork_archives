// ==UserScript==
// @name         华医网|多开视频|跳过问答
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  优化了不能多开视频学习的问题（现在1个课程理论上最快可以1个钟学完所有内容），搞定烦人的课堂问答（保证中途不会弹出来）
// @author       浩浩
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523194/%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A4%9A%E5%BC%80%E8%A7%86%E9%A2%91%7C%E8%B7%B3%E8%BF%87%E9%97%AE%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/523194/%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A4%9A%E5%BC%80%E8%A7%86%E9%A2%91%7C%E8%B7%B3%E8%BF%87%E9%97%AE%E7%AD%94.meta.js
// ==/UserScript==
window.onload = ()=>{
    setInterval(delCookie, 1000, "playState");
 
    const oajax = $.ajax;
    $.ajax = function(e,t){
        if(e.success){
            e.success = function(data){}
        }
        oajax.call(this, e, t)
    }
    function killsendQuestion() { //点击跳过按钮版的跳过课堂答题
        var clockms = setInterval(function () {
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
    };
    killsendQuestion()
}