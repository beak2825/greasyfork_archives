// ==UserScript==
// @name         周老师爱研修
// @namespace    http://tampermonkey.net/
// @version      2024-11-16
// @description  周老师正在认真研修
// @author       强锅锅
// @match        *://ipx.yanxiu.com/*
// @icon         http://i.yanxiu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517650/%E5%91%A8%E8%80%81%E5%B8%88%E7%88%B1%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/517650/%E5%91%A8%E8%80%81%E5%B8%88%E7%88%B1%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

// 周老师研修流程
// 1) 选课页面，循环查询未修完的必修课程，打开第一个；
// 2）自动从课程内第一个课件开始播放，播完后播放下一节；
// 3）如果没有下一节，关闭当前页面；
// 4）看完课件，返回选课页面会先刷新一遍；
// 5）重复以上步骤。


(function() {
    'use strict';
    var MAX_RETRY_TIMES = 3;
    var g_interval = 5000; // 循环检测周期，单位ms
    var g_isFocused = true; // 本页面是否在焦点上
    var g_closeTimes = 0; // 页面尝试关闭达到3次，才关闭页面，防止某些空课程导致误关闭
    var g_activeResItemIndex = 0; // 活动课件下标
    var g_firstTimePlay = true; // 首次播放标志位

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // 切走
    window.onblur = function () {
        console&&console.log("【系统】本页面失去焦点");
        g_isFocused = false;
    };
    // 切回来
    window.onfocus = function () {
        console&&console.log("【系统】本页面获得焦点");
        g_isFocused = true;
        refreshCourseStatus();
    };
    function clearCloseTimes()
    {
        console.log("【系统】清空关闭页面计数");
        g_closeTimes = 0;
    }
    function closeThisPage()
    {
        g_closeTimes++;
        console.log("【看课】未找到下一节，尝试关闭页面，当前是第"+ g_closeTimes + "/" + MAX_RETRY_TIMES + "次");
        if (g_closeTimes > MAX_RETRY_TIMES) {
            console.log("【看课】看完了，关闭页面");
            window.close();
        }
    }
    function muteVideo()
    {
        if (document.querySelector(".vcp-volume-muted") == null && document.querySelector(".vcp-volume-icon") != null) {
            document.querySelector(".vcp-volume-icon").click();
            console.log("【看课】静音...");
        }
    }
    function confirmMsg()
    {
        if (document.querySelector(".ivu-modal-confirm") != null && document.querySelector(".ivu-modal-confirm").textContent.search("切换至本终端") != -1) {
            document.querySelector(".ivu-modal-confirm button.ivu-btn-primary").click();
            console.log("【看课】检测到提示框，点击确认");
        }
    }
    function getActiveRestItem(index)
    {
        var items = document.querySelectorAll(".resource-list li.res-item");
        if (items.length -1 < index) {
            return null;
        }
        return items[index];
    }
    function getActiveRestItemIndex()
    {
        var items = document.querySelectorAll(".resource-list li.res-item");
        for(let i = 0;i < items.length; i++) {
            if (items[i].classList.contains("active")) {
                return i;
            }
        }
        return -1;
    }
    function nextResItem(index)
    {
        var item = getActiveRestItem(index);
        if (item == null) {
            closeThisPage();
            return;
        }
        item.querySelector("div p").click();
    }
    function playPics()
    {
         if (document.querySelector("iframe") != null && document.querySelector("iframe").src.search("preview.yanxiu.com") != -1) {
            // 图片材料
            console.log("【看课】本页是图片，下一节...");
            sleep(1000);
            var activeResItemIndex = getActiveRestItemIndex();
            if (activeResItemIndex == -1) {
                console.error("【系统】找不到活动课件，请刷新页面...");
                return;
            }
            nextResItem(++activeResItemIndex);
        }
    }
    function videoEnded()
    {
        return document.querySelector("div.ended-mask") != null && document.querySelector("div.ended-mask").style.display != "none";
    }
    function nextVideo()
    {
        console.log("【看课】播放下一个视频...");
        sleep(1000);
        g_firstTimePlay = false;
        if (videoEnded()){
            if (document.querySelector(".next") != null) {
                // 播放完毕，出现下一节
                clearCloseTimes();
                document.querySelector(".next").click();
            } else {
                // 没有下一节，尝试关闭
                closeThisPage();
            }
            return;
        }
    }
    function jumpToFirstResItem()
    {
        if (g_firstTimePlay) {
            g_firstTimePlay = false;
            // 首次播放，从第一个课件开始
            console.log("【看课】首次播放，从第一个课件开始");
            var firstItem = document.querySelector(".resource-list li.res-item div p");
            if (firstItem != null) {
                firstItem.click();
                sleep(1000);
            }
        }
    }
    function playVideo()
    {
        if (videoEnded()) {
            // 已经结束
            nextVideo();
            return;
        }
        if (document.querySelector("video") != null && document.querySelector("video").paused) {
            // 继续播放暂停的视频
            document.querySelector("video").play(); // 不一定成功
        }
        if (document.querySelector("video") != null) {
            document.querySelector("video").addEventListener("ended", function() {
                console.log("【看课】课程播放完毕");
                nextVideo();
            });
        }
        muteVideo();
    }
    function playResItem()
    {
        playVideo();
        playPics();
    }
    function startCourse()
    {
        if(!g_isFocused) {
            console.log("【选课】焦点不在当前页面，跳过选课...");
            return;
        }
        var courses = document.querySelectorAll('div.learn-btn');
        var nextPages = document.querySelectorAll("button.btn-next.is-last");
        // 查找没修完的必修课，开始看课
        for (let i = 0; i < courses.length; i++) {
            var course = courses[i];
            if (course.parentElement.textContent.search("必修") != -1 && course.parentElement.textContent.search("100%") == -1) {
                course.click();
                console.log("【选课】打开课程 " + course.parentElement.textContent);
                return;
            }
        }
        // 本页修完
        for (let j = 0; j < nextPages.length; j++) {
            if (nextPages[j].ariaDisabled == "false") {
                console.log("【选课】本页修完，下一页 ");
                nextPages[j].click();
                return;
            }
        }
        // 全部修完
        console.log("【选课】全部修完了");
        sleep(g_interval * 120);
    }
    function refreshCourseStatus()
    {
        var pack = document.querySelector(".pack-name");
        if (g_isFocused && pack != null) {
            if (pack.textContent == "看课") {
                console.log("【系统】刷新网页");
                sleep(1500);
                location.reload();
            }
        }
    }

    // 主函数
    function main()
    {
        console.log("【选课】研修当前页面，第一个还未修完的课程...");
        startCourse();
        jumpToFirstResItem();
        playResItem();
        confirmMsg();
        console.log("【系统】当前页面激活状态：" + g_isFocused);
    }
    setInterval(function() {
        main();
    }, g_interval);
})();