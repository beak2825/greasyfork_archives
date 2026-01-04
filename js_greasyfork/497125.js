// ==UserScript==
// @name         2024聊城专技
// @namespace    https://greasyfork.org/users/728857
// @version      2024-06-05
// @description  学习
// @author       why3303
// @match        https://*.chinahrt.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497125/2024%E8%81%8A%E5%9F%8E%E4%B8%93%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/497125/2024%E8%81%8A%E5%9F%8E%E4%B8%93%E6%8A%80.meta.js
// ==/UserScript==




var courseUrl = "https://gp.chinahrt.com/index.html#/v_selected_course?trainplanId=716a40e7598447ae831a0c518b3214bd&platformId=291&hidePlanEndDate=false"

function selectCourse(){
    if(document.getElementsByClassName("course-list cb").length == 0){
        setTimeout(() => {
            selectCourse();
        }, 200);
    }else{
        var courseList = document.getElementsByClassName("course-list cb")[0].getElementsByTagName("li");
        for(var i = 0; i < courseList.length; i++) {
            var course = courseList[i];
            if(course.getElementsByClassName("progress-line")[0].innerText.indexOf("100%") == -1){
                course.getElementsByTagName("span")[0].click();
                setInterval(() => {
                    window.close();
                }, 500);
                break;
            }
        }
    }

}

function selectLesson(){
    if(document.getElementsByTagName("ul").length == 0){
        setTimeout(() => {
            selectLesson()
        }, 200);
    }else{
        var lessonList = document.getElementsByTagName("ul")[2].getElementsByTagName("li");
        for(var i = 0; i < lessonList.length; i++){
            var lesson = lessonList[i];
            if(lesson.getElementsByTagName("a")[1].innerText.indexOf("已学完") == -1){
                setInterval(() => {
                    window.close();
                }, 500);
                lesson.getElementsByTagName("a")[0].click();
                break;
            }
        }
    }
}

function openVideoPage(){
    document.getElementsByClassName("video-container")
    if(document.getElementsByClassName("video-container").length == 0){
        setTimeout(() => {
            openVideoPage()
        }, 200);
    }else{
        window.location.href = document.getElementsByClassName("video-container")[0].getElementsByTagName("iframe")[0].src;
    }
}

function playVideo(){
    var videoCtrl = document.getElementsByTagName("video")[0];
    videoCtrl.muted = true;
    videoCtrl.play();
    videoCtrl.addEventListener("ended", (event) => {
        setTimeout(() => {
            window.location.href = courseUrl;
        }, 3000);
      });
}

(function() {
    'use strict';
    // Your code here...


    if(document.location.href == courseUrl){
        setTimeout(() => {
            selectCourse();
        }, 200);
    }

    else if(document.location.href.indexOf("v_courseDetails") >= 0){
        setTimeout(() => {
            selectLesson()
        }, 200);
    }

    else if(document.location.href.indexOf("v_video") >= 0){
        setTimeout(() => {
            openVideoPage()
        }, 200);
    }

    else if(document.location.href.indexOf("videoPlay/playEncrypt") >= 0){
        setTimeout(() => {
            if(document.getElementById("video") == null){
                window.location.reload();
            }else{
                playVideo();
            }
        }, 2000);
    }

    else if(document.location.href.indexOf("v_trainplan_list") >= 0){

    }

    else if(document.location.href.indexOf("kaptcha") >= 0){

    }

    else if(document.location.href.indexOf("commonLogin") >= 0){
        setInterval(() => {
            if(document.getElementById("app").innerHTML.indexOf("退出登录") >= 0){
                window.location.href = courseUrl;
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            }
        }, 200);
    }

    else{
        window.location.href = "https://gp.chinahrt.com/index.html#/commonLogin"
    }


})();