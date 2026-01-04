// ==UserScript==
// @name         华东师范大学培训
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.4
// @description  华东师范大学培训脚本
// @author       You
// @match        *://*.edueva.org/*
// @match        *://ecnu.edueva.org/PrjStudent/Index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edueva.org
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456161/%E5%8D%8E%E4%B8%9C%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/456161/%E5%8D%8E%E4%B8%9C%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function videoDetail() {
         // 详情页下一个自动播放方法改写
            window.nextCourseware = function () {
                saveHistory();
                var time = $("#time_" + $("#hidCourseResourceId").val()).html();
                $("#time_" + $("#hidCourseResourceId").val()).html(time.substring(time.indexOf('/') + 1, time.length) + "/" + time.substring(time.indexOf('/') + 1, time.length));

                if ($("#hidNextCourseResourceId").val() != "") {
                    var videoUrl = $("#hidVideoUrl").val();
                    window.location.replace(videoUrl + "?cid=" + $("#hidCourseId").val() + "&uid=" + $("#hidUserId").val() + "&rid=" + $("#hidNextCourseResourceId").val() + "&t=" + $("#hidType").val());
                }else{
                    showMessage("没有下一个视频！");
                }
            };

            // 暂停后自动播放
            setInterval(function () {
                const player = window.cc_js_Player;
                if (player !== undefined && player.getVideoState() === "pause") {
                   player.play();
                }
            }, 3000);
$(window).unbind("beforeunload");
    }
    window.addEventListener('load', (event) => {
        const pathname = window.location.pathname.toLowerCase();
        console.log(pathname);
        // 视频详情页
        switch (pathname) {
            case "/studyduration/index":
                console.log("video detail");
                videoDetail();
                break;
        }
    });
})();