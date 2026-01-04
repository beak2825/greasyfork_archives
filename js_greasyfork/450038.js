// ==UserScript==
// @name         党建学习平台
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  根据大佬“https://greasyfork.org/zh-CN/users/131929-in-pink-spring”的《党建学习平台伪播放4.0(alpha)》改写，如有侵权联系删除
// @author       mtfx
// @match        http://xjtudj.edu.cn/course_detail.html?navId=course_list*
// @grant        none
// @icon         http://xjtudj.edu.cn/images/logo.png
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450038/%E5%85%9A%E5%BB%BA%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/450038/%E5%85%9A%E5%BB%BA%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function (){
    'use strict';

    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "假装完成";
    button.style.width = "70px";
    button.style.height = "32px";
    button.style.align = "center";

    //绑定按键点击功能
    button.onclick = function (){
        var con = confirm("确定要假装看完本视频吗？\n确定后本视频进度将变为100%");
        if(con == 1){
            finish();
        }
        return;
    };

    var x = document.getElementsByClassName('per_title')[0];
    setTimeout(function(){
        x.append(button);
    },20);

    //以下代码来自《党建学习平台伪播放4.0(alpha)》
    function finish(){
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
                                        if(confirm('已完成该课程！\n点击“确定”返回上一页，点击“取消”留在当前页。')==1) {
                                            window.history.go(-1);
                                        }
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

    }

})();