// ==UserScript==
// @name         党建学习平台伪播放4.0(alpha)
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description  注：4.1版使用方法为，点击我的空间-详情-去观看，若提示“已完成该课程”即本次刷课成功。
// @author       Dabble
// @match        http://xjtudj.edu.cn/course_detail.html?navId=course_list*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369449/%E5%85%9A%E5%BB%BA%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E4%BC%AA%E6%92%AD%E6%94%BE40%28alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369449/%E5%85%9A%E5%BB%BA%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E4%BC%AA%E6%92%AD%E6%94%BE40%28alpha%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg = /course_detail\.html\?navId=course_list\&courseId=([a-z0-9]{32})\&coursewareId=([a-z0-9]{32})$/;
    var msg = reg.exec(window.location.href);
    if(msg != null){
        var courseId = msg[1];
        var coursewareId = msg[2];
        safePostAsy($host + '/client/course/getLearnedHistory',
                    {
            "courseId": courseId,
            "coursewareId": coursewareId,
            "progress": 0
        },
                    function (res) {
            if(res.isSuccess) {
                if (coursewareId == res.data.coursewareId) {
                    var DuringTime = res.data.courseAllTime
                    if(DuringTime>0){
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
                                    alert("已完成该课程1");
                                    window.history.go(-1);
                                }
                            }
                        })
                    }
                }
            }
        })
        var videoElement = document.getElementsByTagName("video")[0];
        if(videoElement){
            videoElement.pause();
            videoElement.removeAttribute('src'); // empty source
            videoElement.load();
        }
    }
})();
