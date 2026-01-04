// ==UserScript==
// @name        双卫网答题的加V：在另一位网友的基础上改动了一下，还可能随时被和有需要的加V：yaoxuexi2024
// @namespace   Violentmonkey Scripts
// @match       https://*sww.com.cn/*
// @grant       none
// @version     2.999
// @author      kubixueyiren
// @description 只答题。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502399/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%AD%94%E9%A2%98%E7%9A%84%E5%8A%A0V%EF%BC%9A%E5%9C%A8%E5%8F%A6%E4%B8%80%E4%BD%8D%E7%BD%91%E5%8F%8B%E7%9A%84%E5%9F%BA%E7%A1%80%E4%B8%8A%E6%94%B9%E5%8A%A8%E4%BA%86%E4%B8%80%E4%B8%8B%EF%BC%8C%E8%BF%98%E5%8F%AF%E8%83%BD%E9%9A%8F%E6%97%B6%E8%A2%AB%E5%92%8C%E6%9C%89%E9%9C%80%E8%A6%81%E7%9A%84%E5%8A%A0V%EF%BC%9Ayaoxuexi2024.user.js
// @updateURL https://update.greasyfork.org/scripts/502399/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%AD%94%E9%A2%98%E7%9A%84%E5%8A%A0V%EF%BC%9A%E5%9C%A8%E5%8F%A6%E4%B8%80%E4%BD%8D%E7%BD%91%E5%8F%8B%E7%9A%84%E5%9F%BA%E7%A1%80%E4%B8%8A%E6%94%B9%E5%8A%A8%E4%BA%86%E4%B8%80%E4%B8%8B%EF%BC%8C%E8%BF%98%E5%8F%AF%E8%83%BD%E9%9A%8F%E6%97%B6%E8%A2%AB%E5%92%8C%E6%9C%89%E9%9C%80%E8%A6%81%E7%9A%84%E5%8A%A0V%EF%BC%9Ayaoxuexi2024.meta.js
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