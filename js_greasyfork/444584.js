// ==UserScript==
// @name         河南专技学习辅助
// @version      v1.0
// @description  河南专技学习辅助(仅供学习交流使用)
// @author       cs
// @match        *://*.ghlearning.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/790766
// @downloadURL https://update.greasyfork.org/scripts/444584/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/444584/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 简单解决冲突
    // 自动切换音频播放
    function selectStream() {
        let currentMode = document.getElementsByClassName("pv-active")[0].innerText
        if (currentMode !== "音频") {
            console.log("切换音频")
            document.getElementsByClassName("pv-stream-select")[0].getElementsByTagName("span")[1].click();
            setTimeout(function () {
                let playElement = document.getElementsByClassName("pv-playpause pv-iconfont pv-icon-btn-play").length;
                if (playElement > 0) {
                    console.log("自动播放按钮点击", document.getElementsByClassName("pv-playpause pv-iconfont pv-icon-btn-play")[0].click());
                }
            }, 2000);
        }
    }

    // 进入需要学习的课程
    function enterCourse() {
        let courseListLength = document.getElementsByClassName("item-box").length;
        if (courseListLength > 0) {
            for (let i = 0; i < courseListLength; i++) {
                let courseProcess = document.getElementsByClassName("sr-only")[i * 2].innerText;
                if ( courseProcess !== "100.0%") {
                    document.getElementsByClassName("item-box")[i].click();
                    break;
                }
            }
            setTimeout(function () {
                alert("恭喜您完成已选的所有课程！");
                clearInterval(enterCourseInterval);
            }, 1000);
        }
    }

    //自动返回课程目录
    function backToCourseList() {
        if (document.getElementsByClassName("btn btn-primary")[1].innerText === "返回课程列表") {
            document.getElementsByClassName("btn btn-primary")[1].click()
        }
        if (document.getElementsByClassName("clearfix")[1].innerText === "您已完成该课程学习"){
            history.back();//返回
        }
    }

    //播放视频，刷新单元测试
    function playVideo() {
        let text = document.getElementsByClassName("clearfix videoLi active")[0].innerText;
        if (text.match(/[0-9]+%/)[0] === "100%"){
            for (let m = 0; m < document.getElementsByClassName("video-info ellipsis-1").length; m++) {
                if (document.getElementsByClassName("badge")[m].innerText != "100%"){
                    document.getElementsByClassName("clearfix videoLi")[m].click();
                    break;
                }
            }
        }
        let len = document.getElementsByClassName("text-newBlue f24 center").length
        if (len > 0 && document.getElementsByClassName("text-newBlue f24 center")[0].innerText === "单元测试"){
            window.location.reload();
        }

        let modalElements = document.getElementsByClassName("modal");
        for (let m = 0; m < modalElements.length; m++) {
            if (modalElements[m].getElementsByClassName("modal-body")[0].innerText === "初始化计时异常，请重新点击播放按钮。"){
               modalElements[m].getElementsByClassName("btn btn-primary")[0].click();
            }
        }
    }

    // 检测当前页面位置
    let currentPos = function(){
        // 列表页
        let myCourse = document.getElementById("tran");
        if (myCourse != undefined && myCourse.innerText === "我的课程") {
            return "courseList";
        }
        // 详情页
        let rightCourseList = document.getElementsByClassName("course-list");
        if (rightCourseList != undefined && rightCourseList.length > 0) {
            return "courseDetail";
        }
        return undefined;
    }();

    if (currentPos === "courseDetail") { // 课程详情页
        // 自动播放音频
        let streamInterval = setInterval(selectStream, 5000);
        // 播放视频
        let playVideoInterVal = setInterval(playVideo, 8000);
        // 返回列表
        let backToListInterval = setInterval(backToCourseList, 1000);
    } else if (currentPos === "courseList"){ // 课程列表页
        let enterCourseInterval = setInterval(enterCourse, 2000);
    }
})();