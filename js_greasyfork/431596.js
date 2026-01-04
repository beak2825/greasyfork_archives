// ==UserScript==
// @name         xjtudj
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  刷课
// @author       cho
// @match        http://xjtudj.edu.cn/course_detail.html?navId=course_list*
// @match        http://xjtudj.edu.cn/djnfo.html?navId=zone_index&zTempId=learnPlan*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/431596/xjtudj.user.js
// @updateURL https://update.greasyfork.org/scripts/431596/xjtudj.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function updatalist() {
        var id = Number(sessionStorage.getItem("playid"));
        sessionStorage.removeItem("playid");
        id = id + 1
        sessionStorage.setItem('playid', id);
    }
    function openlist() {
        if (sessionStorage.getItem(sessionStorage.getItem("playid")) == null) {
            alert("没有课程")
        } else {
            setTimeout(function () { window.location.href = sessionStorage.getItem(sessionStorage.getItem("playid")); }, 500);
        }
    }
    function fakeplay() {
        var reg = /course_detail\.html\?navId=course_list\&courseId=([a-z0-9]{32})\&coursewareId=([a-z0-9]{32})$/;
        var msg = reg.exec(window.location.href);
        if (msg != null) {
            var courseId = msg[1];
            var coursewareId = msg[2];
            safePostAsy($host + '/client/course/getLearnedHistory',
                {
                    "courseId": courseId,
                    "coursewareId": coursewareId,
                    "progress": 0
                },
                function (res) {
                    if (res.isSuccess) {
                        if (coursewareId == res.data.coursewareId) {
                            var DuringTime = res.data.courseAllTime
                            if (DuringTime > 0) {
                                safePost($host + '/client/course/setFinished',
                                    {
                                        "courseId": courseId,
                                        "coursewareId": coursewareId,
                                        "progress": DuringTime
                                    },
                                    function (res) {
                                        if (res.isSuccess) {
                                            if (coursewareId == res.data.coursewareId) {
                                                var progressHtml = "";
                                                progressHtml = "<div class='progress-o'>本集学习进度<i>" + res.data.rateStr + '%' + "</i></div>" +
                                                    "<div class='progress-t'>" +
                                                    "<div class='progress-t-0' style='width: " + res.data.rateStr + "%;'></div></div>";
                                                $("#progressBar").html(progressHtml);
                                                setTimeout(function () {
                                                    updatalist();
                                                    openlist();
                                                }, 500);
                                            }
                                        }
                                    })
                            }
                        }
                    }
                })
            var videoElement = document.getElementsByTagName("video")[0];
            if (videoElement) {
                videoElement.pause();
                videoElement.removeAttribute('src'); // empty source
                videoElement.load();
            }
        }
    }
    function getlist() {
        let courseList = document.getElementsByClassName('course_see');
        let j = 0;
        sessionStorage.clear();
        for (let i = 0; i < courseList.length; i++) {
            if (courseList[i].className != "course_see finished") {
                sessionStorage.setItem(j, courseList[i].href);
                j++;
            }
        }
        sessionStorage.setItem('playid', 0);
    }

    function run() {
        if (document.getElementsByClassName('loc_font')[0].innerText.indexOf("学习计划") > 0) {
            setTimeout(function () {
                getlist();
            }, 2000);
            if (sessionStorage.length == 1) {
                alert("没有课了");
            } else {
                setTimeout(function () { openlist(); }, 3000);
            }
        } else if (document.getElementsByClassName('loc_font')[0].innerText.indexOf("课程资源") > 0) {
            fakeplay();
        } else {
            "pass"
        }
    }

    setInterval(function () { location.reload() }, 30000);
    if (document.getElementsByClassName('loc_font')[0].innerText.indexOf("课程资源") > 0) {
        setTimeout(function () { fakeplay(); }, 1000);
    } else {
        window.onload = function () {
            setTimeout(function () { run(); }, 5000);
        };
    }


})();