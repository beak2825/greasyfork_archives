// ==UserScript==
// @name         自动刷网课
// @namespace    lax2333
// @version      1.01.202412301317
// @description  继续教育平台刷网课
// @author       lax2333
// @match        https://xlvideo.edueva.org/*
// @match        https://xjufe.ketangx.net/*
// @icon         https://xjufe.ketangx.net/Content/images/Logo/logo02.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489205/%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489205/%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
console.log("脚本执行")
    //添加js代码到body用于后期使用
    function add_js_to_body(){
        // 创建一个新的 script 元素
    var customScript = document.createElement('script');

    // 在这里放入你想要执行的 JavaScript 代码，这里是示例代码
    var customCode = `


var isCompleted = false;
var isFirstSeek = true;
var curWatchTime = 0;

function showMessage(msg) {
    layer.msg(msg, {
        icon: 0,
        time: 2000
    });
}

//初始化播放器
function initialPlayer() {

    var h = $("#vedio").height();
    var w = $(window).width();
    if ($(".column_btn").hasClass("column_btn_g")) w -= $(".right_nav").width();
    var $div = $("#Player_Mooc");
    window.createCCH5Player({
        'vid': $div.data("vid"),
        'siteid': $div.data("user"),
        'playerid': $div.data("playid"),
        'banDrag': $div.data("seek"),
        'playtype': 1,
        'playertype': 1,
        'mediatype': 1,
        'autoStart': false,
		'showRateBtn': false,//隐藏倍速
		'rate_allow_change': false,//禁用倍速
        'width': w + "px",
        'height': h + "px",
        'parentNode': document.getElementById("Player_Mooc")
    });
}

//获取当前视频的时长：秒
function getDuration() {
    return window.cc_js_Player.getDuration();
}

//获取当前视频的播放进度：秒
function getCurrentTime() {
    //window.cc_js_Player.pause();
    return window.cc_js_Player.getPosition();
}

//跳转到指定秒的位置
function seekVideoTime(seconds) {
    window.cc_js_Player.jumpToTime(seconds);
}

function resumeVedio() {
    window.cc_js_Player.play();
}

function pauseVedio() {
    window.cc_js_Player.pause();
}

function destroyVideo() {
    window.cc_js_Player.destroy();
}

function nextCourseware() {
    saveHistory();

    var time = $("#time_" + $("#hidCourseResourceId").val()).html();
    $("#time_" + $("#hidCourseResourceId").val()).html(time.substring(time.indexOf('/') + 1, time.length) + "/" + time.substring(time.indexOf('/') + 1, time.length));

    layer.confirm('您已观看完该视频，是否要观看下一个？', {
        btn: ['是', '否']
    }, function () {
        if ($("#hidNextCourseResourceId").val() != "")
            window.location.replace("/StudyDuration/Index?cid=" + $("#hidCourseId").val() + "&uid=" + $("#hidUserId").val() + "&rid=" + $("#hidNextCourseResourceId").val() + "&t=" + $("#hidType").val());
        else
            showMessage("没有下一个视频！");
    }, function (index) {
        layer.close(index);
    });
}

function getStudyData() {
    var iTime = curWatchTime;
    if (iTime < 1) iTime = getCurrentTime();   //当前进度
    var data = new Object();
    data.CourseResourceId = $("#hidCourseResourceId").val();
    data.CourseResourceName = $("#hidCourseResourceName").val();
    data.ResInfoId = $("#hidResInfoId").val();
    data.ResDuration = $("#hidResDuration").val();
    data.CourseChanelId = $("#hidCourseChanelId").val();
    data.ChanelId = $("#hidChanelId").val();
    data.ChapterId = $("#hidChapterId").val();
    data.CourseId = $("#hidCourseId").val();
    data.UserId = $("#hidUserId").val();
    //data.StudyDuration = getPlayVideoTime(); //播放时间
    //data.CurrentVideoTime = getCurrentTime();   //当前进度
    data.StudyDuration = iTime;
    data.CurrentVideoTime = iTime;
    data.Type = $("#hidType").val();
    data.BeginStudyTime = $("#hidBeginStudyTime").val();
    data.DeviceType = 0; //PC
    return data;
}

function saveHistory() {
    var isRes = false;
    if (isCompleted || $("#hidUserId").val().length < 1) return isRes;
    //console.log("saveHistory：" + $("#hidUserId").val() + "-" + isCompleted + "-" + $("#hidIsStudyOver").val() + "-" + $("#hidIsRight").val());
    if ($("#hidIsStudyOver").val() == "0" && $("#hidIsRight").val() == "1") {
        isRes = true;
        $.ajax({
            url: '/StudyDuration/SaveForMCTS',
            type: 'post',
            cache: false,
            async: true,
            dataType: "json",
            data: {
                model: getStudyData()
            },
            success: function (data) {
                curWatchTime = 0; //还原0点
                isCompleted = true;
            },
            error: function () {
            }
        });
    }
    return isRes;
}



function loadMenu() {
    var li_width = $("#divNavTabs li").width();
    var li_count = $("#divNavTabs li").length;
    var menu_width = li_width * li_count;
    $("#divNavTabs").width(menu_width);
}

function prevClick() {
    var li_width = $(".nav_tab1 .menu1 li").width();
    var tab_width = $(".nav_tab1 .tab-menu").width();
    var menu_width = $(".nav_tab1 .menu1").width();
    var cha = tab_width - (Math.abs($(".nav_tab1 .menu1").position().left) + li_width);
    if (tab_width < menu_width && cha >= li_width) {
        var left = $(".nav_tab1 .menu1").position().left;
        $(".nav_tab1 .menu1").animate({ left: (left - 83) }, 100);
        //$(".menu1").css({left:(left-83)});
    }
}

function nextClick() {
    var li_width = $(".nav_tab1 .menu1 li").width();
    var tab_width = $(".nav_tab1 .tab-menu").width();
    var menu_width = $(".nav_tab1 .menu1").width();
    var cha = $(".nav_tab1 .menu1").position().left;
    if (tab_width < menu_width && cha < 0) {
        var left = $(".nav_tab1 .menu1").position().left;
        $(".nav_tab1 .menu1").animate({ left: (left + 83) }, 100);
        //		$(".menu1").css({left:(left+83)});
    }
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    }
    return "";
}

//笔记列表
function noteList() {
    $("#divNoteList").load('/StudyDuration/GetVideoNote', {
        userId: $("#hidUserId").val(),
        courseresourceId: $("#hidCourseResourceId").val(),
        t: $("#hidType").val(),
    }, function () {
    });
}
//保存笔记
function saveNote() {
    if ($("#hidUserId").val() != "") {
        $.ajax({
            url: '/StudyDuration/SaveVideoNote',
            type: 'post',
            cache: false,
            async: false,
            dataType: "json",
            data: {
                model: getSaveNoteData()
            },
            success: function (data) {
                if (data.Success) {
                    hideNote(); //隐藏添加框
                    resumeVedio(); //继续播放
                    noteList(); //刷新列表
                } else {
                    showMessage(data.Message);
                }
            }
        });
    }
}
//获取笔记数据
function getSaveNoteData() {
    var iTime = curWatchTime;
    if (iTime < 1) iTime = getCurrentTime();   //当前进度
    var data = new Object();
    data.CourseResourceId = $("#hidCourseResourceId").val();
    data.CourseResourceName = $("#hidCourseResourceName").val();
    data.ResInfoId = $("#hidResInfoId").val();
    data.Note = $("#noteContent").val();
    data.CourseChanelId = $("#hidCourseChanelId").val();
    data.ChanelId = $("#hidChanelId").val();
    data.ChapterId = $("#hidChapterId").val();
    data.CourseId = $("#hidCourseId").val();
    data.UserId = $("#hidUserId").val();
    data.CurrentVideoTime = iTime
    data.Type = $("#hidType").val();
    data.BeginStudyTime = $("#hidBeginStudyTime").val();
    data.DeviceType = 0; //PC
    return data;
}
//删除笔记
function deleteNote(id) {
    if ($("#hidUserId").val() != "") {
        $.ajax({
            url: '/StudyDuration/DelVideoNote',
            type: 'post',
            cache: false,
            async: false,
            dataType: "json",
            data: {
                Id: id,
                t: $("#hidType").val(),
            },
            success: function (data) {
                if (data.Success) {
                    noteList();
                } else {
                    showMessage(data.Message);
                }
            }
        });
    }
}

//跳转到笔记所在播放时间点
//seconds:当前记录笔记的视频播放时间点
function jumpNoteVideo(seconds) {
    seekVideoTime(seconds);
}
//弹出添加笔记框
function openNote() {
    //暂停视频
    pauseVedio();
    $(".addNoteFrom").show();
    document.getElementById('noteContent').focus()
}
//隐藏添加笔记
function hideNote() {
    //继续播放
    resumeVedio();
    $("#noteContent").val("");
    $(".addNoteFrom").hide();
}


//视频初始化完成时
function onCCH5PlayerLoaded() {
    isCompleted = false;
    isFirstSeek = true;
    initialPlayer();
    //var secs = $("#hidprogress").val();
    //if (secs.length < 1) return;
    //var seek = parseInt(secs);
    //if (isNaN(seek) || seek < 1) return;
    //seekVideoTime(seek);
    //pauseVedio();
    if ($("#hidIsStudyOver").val() == "1") {
        showMessage("温馨提示：当前小节视频已学完。您可以从右侧目录中选择尚未学完的视频继续学习（视频前圆点为灰色或半绿色表示未完成）！");
    }
}

//播放器开始播放时
function on_CCH5player_play(video, vid) {
    if (!isFirstSeek) return;
    var isec = parseInt($("#hidProgress").val());
    if (isec < 1) return;
    var icur = getCurrentTime();
    var ilen = getDuration();
    if (icur < isec && isec < ilen) {
        seekVideoTime(isec);
        isFirstSeek = true;
    }
}

//播放结束时
function on_CCH5player_ended(video, vid) {
    curWatchTime = getDuration();
    nextCourseware();
}

$(window).resize(function () {

});

/*
window.onbeforeunload = function (e) {
    saveHistory();
    console.log("onbeforeunload:" + isCompleted);
    e.returnValue = false;
}

window.onunload = function (e) {
    saveHistory();
    console.log("onunload:" + isCompleted);
    e.returnValue = false;
}
*/

$(window).bind("beforeunload", function (e) {
    var isRes = saveHistory();
    e.returnValue = false;
    return isRes;
});

//$(window).bind("unload", function (e) {
//    alert("unload：" + e.returnValue);
//});



`;

    // 将代码添加到 script 元素中
    customScript.text = customCode;

    // 将 script 元素添加到页面的 body 中
    document.body.appendChild(customScript);
    };
add_js_to_body();

    var isLogicExecuted = false; // 标记直播视频执行变量，表示逻辑是否已执行
    // 定义函数：循环执行
    function loopProject() {



        var clickToContinueElement = document.evaluate("//*[text()='点击继续']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (clickToContinueElement) {
            clickToContinueElement.click(); // 点击包含文本“点击继续”的元素
        }

        var targetElement1 = document.querySelector(".layui-layer-btn0");
        if (targetElement1) {
            targetElement1.click();
        }

        var replayBtnElement = document.querySelector("#replaybtn");
        if (replayBtnElement) {
            replayBtnElement.click();
        }


        //执行完成播放视频
        try {
            // 执行完成播放视频
            var videotime = getDuration();
            seekVideoTime(videotime);
        } catch (error) {
            // 捕获到错误后不做任何处理，即忽略该错误
            };



if (!isLogicExecuted && document.readyState === 'complete') {
    // 开启直播自动完成
    live_video_autoStart();
    isLogicExecuted = true; // 将标记变量设为true，表示逻辑已执行
};






        console.log("循环");
    }

    // 设置定时器，每一秒执行一次查找元素、检测视频并自动播放
    setInterval(loopProject, 1000);

    //直播自动完成观看代码
    function live_video_autoStart(){

    //设置直播观看开始时间
    var currentDate = new Date();// 创建一个表示当前时间的 Date 对象
    var year = currentDate.getFullYear();// 获取当前年份
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');// 获取当前月份（注意月份从 0 开始，需要加 1），并补零
    var day = String(currentDate.getDate()).padStart(2, '0');// 获取当前日期，并补零
    var hours = String(currentDate.getHours()).padStart(2, '0');// 获取当前小时数，并补零
    var minutes = String(currentDate.getMinutes()).padStart(2, '0');// 获取当前分钟数，并补零
    var seconds = String(currentDate.getSeconds()).padStart(2, '0');// 获取当前秒数，并补零
    hours = hours - 5; //当前时间往前五小时
    var videotime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    //console.log(videotime);  // 输出当前时间，格式为 'YYYY-MM-DD HH:MM:SS'

    window.TM_PLAYBACK_ENTERS = videotime;
    //直播学习时间最长点

                try {
    localStorage.setItem(key, vd.duration);
        } catch (error) {
            // 捕获到错误后不做任何处理，即忽略该错误
            };



        console.log("完成直播观看 开始时间：" + window.TM_PLAYBACK_ENTERS)
    };
    //开启直播自动完成
    live_video_autoStart()






























    //结尾
})();