// ==UserScript==
// @name         刷课
// @namespace    www.lngbzx.gov.cn
// @version      0.0.1
// @description  感谢小咖啡
// @author       yanfeng822@gmail.com
// @license      GPLv3
// @match        http://www.lngbzx.gov.cn/student/enterCourse.do* 
// @grant        none
// @icon         https://avatars3.githubusercontent.com/u/25388328
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/535145/%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/535145/%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const debug = 1;
    console.log("%c感谢您使用本插件，请自觉使用。", "color: red; font-style: italic");
    $("video").remove()
    $("iframe").remove()
    $("body").append("<h1>视频已屏蔽，正在上课</h1>")
    function sendMessage() {
        var watchId = document.getElementsByName('watchId')[0].value;
        var courseId = document.getElementsByName('courseId')[0].value;
        var courseStudentId = document.getElementsByName('courseStudentId')[0].value;
        $.ajax({
            type: "GET",
            url: "/student/video/json/ajaxRecordCourseWatchingTime.do?_x=" + Math.random() + "&watchId=" + watchId + "&courseId=" + courseId + "&courseStudentId=" + courseStudentId,
            data: "{}",
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus, xhr) {
                console.log(data)
            },
            error: function(msg) {
                console.error(msg)
            }
        });
    }
    for (var i = 0; i <= 100; i++) {
        sendMessage();
        setTimeout("window.close()",1500);
    }
})();