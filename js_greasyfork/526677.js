// ==UserScript==
// @name         国家中小学智慧教育平台
// @namespace    https://basic.smartedu.cn/
// @version      2025-02-08
// @description  国家中小学智慧教育平台(https://basic.smartedu.cn/)
// @author       TFTF-Breeze
// @license      ABOL=1.0
// @match        https://basic.smartedu.cn/teacherTraining/*
// @icon         https://basic.smartedu.cn/img/logo-icon.afa526cf.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526677/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/526677/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

// 定义一个函数，输出当前时间
function printCurrentTime() {
    let duration = document.getElementsByTagName('video')[0].duration;//视频总时长
    let current = document.getElementsByTagName('video')[0].currentTime;//视频当前播放时长
    if(duration-1 <= current){
        //打开所有目录
        let course_top = document.querySelectorAll(".fish-collapse-header");
        for(let i=0;i<=course_top.length-1;i++){
            if(course_top[i].querySelector("div > i > svg").style[0] == undefined){
                course_top[i].click();
            }
        }

        let course = document.querySelectorAll(".resource-item > div:nth-child(2) > div");//课程目录
        for(let i=0;i<=course.length-1;i++){
            if(course[i].querySelector("div") != null){
                if(i < course.length-1){
                    course[i+1].click();
                }else{
                    alert('视频已经全部播放完毕！！！');
                }
            }
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