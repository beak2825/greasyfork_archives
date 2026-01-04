// ==UserScript==
// @name         百度题库自动展开
// @namespace    http://tampermonkey.net/
// @version      v0.31
// @description  百度题库自动展开，若自动展开失败就刷新页面，去除页面内的浮动广告。
// @author       沧浪之水
// @match        https://easylearn.baidu.com/edu-page/tiangong/*
// @icon         https://edu-fe.cdn.bcebos.com/public/business-cop-icon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483669/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/483669/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function clickExerciseBtn() {
        document.querySelector(".exercise-btn.exercise-btn-4").click();
    }

    function clickExerciseBtn2() {
        document.querySelector(".expand-btn").click();
    }


    function runClick() {

        // 获取所有 `class="toogle-btn"` 标签
        var elements = document.querySelectorAll(".toogle-btn");

        // 循环点击所有标签
        for (var i = 0; i < elements.length; i++) {
            elements[i].click();
        }

        // 在 一定时长后调用 clickExerciseBtn() 函数
        setTimeout(clickExerciseBtn, 500);
        setTimeout(clickExerciseBtn2, 1000);


    }

    // 调用脚本
    setTimeout(runClick, 1000);
    // 监听 DOM 元素添加事件
    const timer = setInterval(() => {
        // 执行命令
        document.querySelector(".vip-banner-cont").remove();
        document.querySelector(".vip-card-warp").remove();

        // 检查是否成功执行
        if (!document.querySelector(".vip-banner-cont")) {
            // 停止定时器
            clearInterval(timer);
        }
    }, 1000);

})();
