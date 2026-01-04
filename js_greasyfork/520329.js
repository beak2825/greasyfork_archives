// ==UserScript==
// @name         西北师范大学自动刷课保存
// @namespace    http://learning.zk211.com/
// @version      2025-03-13
// @description  西北师范大学自动刷课保存(http://learning.zk211.com/)
// @author       TFTF-Breeze
// @license      ABOL=2.0
// @match        http://learning.zk211.com/xbsflearning/console/*
// @icon         http://nwnu.zk211.com/xbsf/console/images/logo60.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520329/%E8%A5%BF%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/520329/%E8%A5%BF%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

// 定义一个函数，输出当前时间
function printCurrentTime() {
    let win = window[1];
    let duration = win.document.querySelector(".nowstatus");//您正在学习章节状态栏
    let student;
    if(duration != null){
        student = duration.textContent;//您正在学习章节状态
    }
    if(student == '已完成学习'){
        win.document.querySelector("#saveBtn").click();//保存学习进度

        let course = win.document.querySelectorAll("#listUL > li > ul > li");//课程目录
        let course_this = win.document.querySelector("#listUL > li > ul > .active").getAttribute('sec');//当前学习的课程
        if(course[course_this] != null){
            course[course_this].click();
        }else{
            alert('已经全部播放完毕！！！');
        }
    }else{
        //不够播放时间继续播放
        let play = document.querySelector(".vjs-icon-placeholder")//点击播放;
        if(play != null){
            play.click();
            console.log("已点击播放！！！");
        }
    }


    let Learning_detection = document.querySelector(".fish-modal-confirm-btns > button");//学习检测
    if(Learning_detection != null){
        Learning_detection.click(); //确认学习检测
        console.log("已确认学习检测！！！");
    }
}

(function() {
    'use strict';

    // 每5秒运行一次printCurrentTime函数
    setInterval(printCurrentTime, 5000);

})();