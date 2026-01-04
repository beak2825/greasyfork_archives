// ==UserScript==
// @name         国家中小学智慧教育平台
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      v1.0
// @description  国家中小学智慧教育平台1.0
// @author       You
// @match        *://*.smartedu.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/469692/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/469692/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pathname = window.location.pathname;
    if (pathname.endsWith("courseDetail")) {
        function clickFirstCourse() {
            let folderList = document.getElementsByClassName("fish-collapse-header");
            if (folderList.length > 0) {
                for (let i = 0; i < folderList.length; i++) {
                    folderList[i].click();
                }
            }
            let courseList = document.getElementsByClassName("resource-item resource-item-train");
            if (courseList.length > 0) {
                for (let i = 0; i < courseList.length; i++) {
                    let statusButtonList = courseList[i].getElementsByClassName("status-icon");
                    if (statusButtonList.length > 0) {
                        // 进行中
                        let icon = statusButtonList[0].getElementsByClassName("iconfont");
                        if (icon.length > 0) {
                            let title = icon[0].getAttribute("title");
                            if (title === "进行中" || title === "未开始") {
                                courseList[i].click();
                                setTimeout(function (){
                                    console.log("video click");
                                    document.getElementsByClassName("vjs-tech")[0].muted = true;
                                    document.getElementsByClassName("vjs-poster")[0].click();
                                }, 2000);
                                break;
                            }
                        }
                    }
                }
            }
        }
        // 检测课程列表并自动播放未完成课程
        setTimeout(clickFirstCourse, 5000);

        // 自动播放
        setInterval(function () {
            let buttons = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused");
            0 != buttons.length && buttons[0].click()
        }, 500);
    }
})();