// ==UserScript==
// @name         新版 辽宁省干部在线学习网 服务器挂机 代刷课（挂自然时长）                                       +V：yaoxuexi2024
// @name         +V：yaoxuexi2024
// @namespace    lngbzx.gov.cn
// @version      1.4.4
// @description  +V：yaoxuexi2024
// @author       qingcaomc@gmail.com
// @license      GPLv3
// @match        http://*.lngbzx.gov.cn/student/enterCourse.do*
// @grant        none
// @icon         https://avatars3.githubusercontent.com/u/25388328
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/501544/%E6%96%B0%E7%89%88%20%E8%BE%BD%E5%AE%81%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91%20%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8C%82%E6%9C%BA%20%E4%BB%A3%E5%88%B7%E8%AF%BE%EF%BC%88%E6%8C%82%E8%87%AA%E7%84%B6%E6%97%B6%E9%95%BF%EF%BC%89%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2BV%EF%BC%9Ayaoxuexi2024.user.js
// @updateURL https://update.greasyfork.org/scripts/501544/%E6%96%B0%E7%89%88%20%E8%BE%BD%E5%AE%81%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91%20%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8C%82%E6%9C%BA%20%E4%BB%A3%E5%88%B7%E8%AF%BE%EF%BC%88%E6%8C%82%E8%87%AA%E7%84%B6%E6%97%B6%E9%95%BF%EF%BC%89%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2BV%EF%BC%9Ayaoxuexi2024.meta.js
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