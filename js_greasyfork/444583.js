// ==UserScript==
// @name         中国教研网3.8
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      v3.8
// @description  尝试修复网络卡顿页面自动刷新
// @author       You
// @match        *://*.zgjiaoyan.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444583/%E4%B8%AD%E5%9B%BD%E6%95%99%E7%A0%94%E7%BD%9138.user.js
// @updateURL https://update.greasyfork.org/scripts/444583/%E4%B8%AD%E5%9B%BD%E6%95%99%E7%A0%94%E7%BD%9138.meta.js
// ==/UserScript==

(function () {
    let username;
    'use strict';

    // 全部课程学完标志
    const COURSE_FINISH = "courseFinish";
    // 写入localStorage标志
    const WRITE_FINISH_FLAG = "writeFinishFlag";
    // 课程进度前缀
    const COURSE_PROCESS_PREFIX = "course_process_prefix_";
    // 当前课程名
    const CURRENT_COURSE_NAME = 'current_course_name';
    // 通识课程规定时长 冗余一小时 防止数据不准确
    const COMMON_TIME_REQUIRE = 2766;
    // 专业课程规定时长 冗余两小时 防止数据不准确
    const MAJOR_TIME_REQUIRE = 19240;
    // 当前视频总时间数
    const CURRENT_VIDEO_TOTAL_TIME = "current_video_total_time";

    // 当前循环
    let currentInterval = null;
    // 当前路径名称
    let currentPathname = "";
    // 当前页
    let currentPageIndex = 0;
    // 当前分类
    let currentCategory = 0;

    function setName() {
        if (document.getElementsByClassName("user-name").length > 0) {
            username = document.getElementsByClassName("user-name")[0].innerText;
        } else if (document.getElementsByClassName("login-name").length > 0) {
            username = document.getElementsByClassName("login-name")[0].innerText;
        } else {
            window.location.reload();
        }
        document.title = username;
        writeLog("用户名:" + username);
    }

    // 存储数据
    function setStorage(key, val) {
        localStorage.setItem(key, val);
    }

    // 获取数据
    function getStorage(key) {
        return localStorage.getItem(key);
    }

    // 删除数据
    function removeStorage(key) {
        localStorage.removeItem(key)
    }

    // 延迟函数
    function sleep(d) {
        for (let t = Date.now(); Date.now() - t <= d;) {

        }
    }

    // 写日志
    function writeLog(str) {
        return false;
        console.log(str);
    }

    // 首页
    function homeFunction() {
        setName();
        // 检测全部学完标记
        let courseFinish = getStorage(username + COURSE_FINISH);
        if (courseFinish === "true") {
            alert("恭喜,您已学完所有课程!");
            return true;
        }
        // 写入标记检测
        let writeFinishFlag = getStorage(username + WRITE_FINISH_FLAG);
        if (writeFinishFlag === null) {
            initCourseProcess();
        }
        // 跳转第一个课程
        let historyBody = document.getElementsByClassName("history-body")[0];
        let trainList = historyBody.getElementsByClassName("item");
        // 检测不到数据就刷新页面(防止页面卡顿)
        if (trainList.length === 0) {
            window.location.reload();
            return true;
        }
        for (let index = 0; index < trainList.length; index++) {
            let trainTitle = trainList[index].getElementsByClassName("title")[0].innerText;
            if (trainTitle === "高中学科教师培训项目") {
                writeLog("首页:点击" + trainTitle);
                trainList[index].getElementsByClassName("btn to-learn")[0].click();
                return true;
            }
        }
    }


    // 点击看课
    function clickLook(course) {
        let taskList = course.getElementsByClassName("task-list")[0];
        let taskItem = taskList.getElementsByClassName("task-item");
        for (let taskItemIndex = 0; taskItemIndex < taskItem.length; taskItemIndex++) {
            let taskItemTitle = taskItem[taskItemIndex].getElementsByClassName("task-title")[0].innerText;
            if (taskItemTitle === "看课") {
                writeLog("我的工作室:点击课程" + course.getElementsByClassName("title")[0].innerText);
                setStorage(username + CURRENT_COURSE_NAME, course.getElementsByClassName("title")[0].innerText)
                taskItem[taskItemIndex].click();
                window.open(window.location, '_self').close();
            }
        }
    }

    // 判断是否全部学完
    function isAllEnded() {
        let commonTime = calcTime("common", "must") + calcTime("common", "select");
        let majorTime = calcTime("major", "must") + calcTime("major", "select");
        return commonTime >= COMMON_TIME_REQUIRE && majorTime >= MAJOR_TIME_REQUIRE;
    }

    // eduType: common 通用类 subject:学科类
    // type: must:必修 type:选修
    function calcTime(eduType, type) {
        let eduClass = eduType === "common" ? "general-edu" : "subject-edu";
        let itemIndex = type === "must" ? 0 : 1;
        let totalTime = 0;
        let timeItem = document.getElementsByClassName(eduClass)[0].getElementsByClassName("item")[itemIndex].getElementsByClassName(
            "item-info");
        for (let index = 0; index < timeItem.length; index++) {
            totalTime += parseInt(timeItem[index].lastElementChild.innerText);
        }
        return totalTime;
    }

    // 我的工作室
    function workspaceFunction() {
        // 检测用户名
        setName();
        // 判断是否全部完成
        if (isAllEnded()) {
            setStorage(username + COURSE_FINISH, "true");
            window.location.href = "/train/home";
            return true;
        }
        // 没有检测到分类就刷新页面
        let courseCategory = document.getElementsByClassName("tab-item");
        if (courseCategory.length === 0) {
            writeLog("我的工作室:未检测到分类");
            window.location.reload();
            return true;
        }
        // 遍历课程列表
        for (let categoryIndex = 0; categoryIndex < courseCategory.length; categoryIndex++) {
            if (currentCategory > categoryIndex) {
                continue;
            }
            if (currentCategory < categoryIndex) {
                currentCategory = categoryIndex;
                courseCategory[categoryIndex].click();
                writeLog("我的工作室:点击分类" + currentCategory);
                setTimeout(workspaceFunction, 3000);
                return true;
            }
            let major = document.getElementsByClassName("sub-list")[0].getElementsByClassName("label")[0].innerText.replace("：", "");
            let majorCourseProcess = getStorage(username + COURSE_PROCESS_PREFIX + major);
            let courseList = document.getElementsByClassName("task-item");
            if (courseList.length === 0) {
                writeLog("我的工作室:未发现课程");
                window.location.reload();
                return true;
            }
            for (let courseIndex = 0; courseIndex < courseList.length; courseIndex++) {
                let isTopItem = courseList[courseIndex].getElementsByClassName("task-infos");
                if (isTopItem.length === 0) {
                    continue;
                }
                let courseTitle = courseList[courseIndex].getElementsByClassName("title")[0].innerText;
                let courseProcess = getStorage(username + COURSE_PROCESS_PREFIX + courseTitle);
                writeLog("课程标题:" + courseTitle + "专业:" + major);
                if (currentCategory === 1 && majorCourseProcess !== "true" && courseTitle !== major) {
                    continue;
                }
                if (courseProcess === null || courseProcess !== "true") {
                    clickLook(courseList[courseIndex]);
                    return true;
                }
            }
        }
    }

    //课程列表
    function courseListFunction() {
        setName();
        if (document.getElementsByClassName("list-wrapper").length === 0) {
            window.location.reload();
            return true;
        }
        let courseList = document.getElementsByClassName("list-wrapper")[0].getElementsByClassName("item");
        if (courseList.length === 0) {
            writeLog("视频列表页:未发现视频");
            window.location.reload();
            return true;
        }
        let pages = document.getElementsByClassName("ivu-page-item");
        let pageCount = pages.length === 0 ? 1 : pages.length;
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            if (currentPageIndex > pageIndex) {
                continue;
            }
            if (pageIndex > currentPageIndex) {
                currentPageIndex = pageIndex;
                pages[pageIndex].click();
                writeLog("视频列表页:点击页" + currentPageIndex);
                setTimeout(courseListFunction, 3000);
                return true;
            }

            for (let courseListIndex = 0; courseListIndex < courseList.length; courseListIndex++) {
                let courseCategory = courseList[courseListIndex].getElementsByClassName("icon-type")[0].innerText;
                let coursePass = courseList[courseListIndex].getElementsByClassName("pass");
                if (coursePass.length === 0) {
                    let totalTime = courseList[courseListIndex].getElementsByClassName("total-time")[0].innerText;
                    setStorage(username + CURRENT_VIDEO_TOTAL_TIME, parseInt(totalTime));
                    courseList[courseListIndex].getElementsByClassName("item-cover")[0].click();
                    window.open(window.location, '_self').close();
                    return true;
                }
            }
        }
        setStorage(username + COURSE_PROCESS_PREFIX + getStorage(username + CURRENT_COURSE_NAME), "true");
        window.location.href = "/train/home";
    }

    //课程详情页
    function courseDetailFunction() {
        setName();
        document.title = username + "-" + getStorage(username + CURRENT_COURSE_NAME);
        // 判断当前是不是图片
        let iframeCount = document.getElementsByClassName("iframe");
        let docWrapper = document.getElementsByClassName("doc-wrapper");
        if (iframeCount.length > 0 || docWrapper.length > 0) {
            writeLog("视频详情页:跳过课件");
            let videoList = document.getElementsByClassName("res-item");
            for (let videoIndex = 0; videoIndex < videoList.length; videoIndex++) {
                if (videoList[videoIndex].className.split(" ").includes("active")) {
                    if (videoList[videoIndex + 1] !== undefined) {
                        videoList[videoIndex + 1].getElementsByClassName("res-name")[0].click();
                    } else {
                        window.location.href = "/train/home";
                        clearInterval(currentInterval);
                        return true;
                    }
                }
            }
        }

        // 评价跳过
        let comment = document.getElementsByClassName("questionnaire-wrapper");
        if (comment[0] !== undefined && (comment[0].style.display !== "none")) {
            writeLog("视频详情页:跳过评价");
            let commentTitle = comment[0].getElementsByClassName("info-title")[0].innerText;
            if (commentTitle === "您的评价是给老师的鼓励") {
                comment[0].getElementsByClassName("cancel")[0].click();
                let totalTime = parseInt(getStorage(username + CURRENT_VIDEO_TOTAL_TIME));
                let currentTime = parseInt(document.getElementsByClassName("state")[0].innerText.replace(/[^0-9]/ig, ""));
                if (currentTime >= totalTime) {
                    window.location.href = "/train/home";
                    clearInterval(currentInterval);
                    return true;
                }
            }
        }
        // 点我计时
        let alarmCLockWrapper = document.getElementsByClassName("alarmClock-wrapper");
        if (alarmCLockWrapper[0] !== undefined && (alarmCLockWrapper[0].style.display !== "none")) {
            writeLog("视频详情页:跳过计时");
            alarmCLockWrapper[0].click();
        }
        // 点击下一节课程
        let endedMask = document.getElementsByClassName("ended-mask");
        if (endedMask[0] !== undefined && (endedMask[0].style.display !== "none")) {
            writeLog("视频详情页:下一节课");
            // 是否有下一节课
            let nextButton = endedMask[0].getElementsByClassName("next");
            if (nextButton.length !== 0) {
                nextButton[0].click();
            } else {
                window.location.href = "/train/home"
                clearInterval(currentInterval);
                return true;
            }
        }
    }

    // 初始化标记数据
    function initCourseProcess() {
        // 总课程完结标记
        setStorage(username + COURSE_FINISH, "false");
        // 写入标记标记
        setStorage(username + WRITE_FINISH_FLAG, "true");
    }

    // 移除标记数据
    function removeCourseProcess() {
        // 用户名
        removeStorage(CURRENT_COURSE_NAME);
        // 总课程完结标记
        removeStorage(COURSE_FINISH);
        // 写入标记标记
        removeStorage(WRITE_FINISH_FLAG);
    }

    //确定当前位置
    function initCurrentPos() {
        let pathname = window.location.pathname;
        if (pathname === currentPathname) {
            return true;
        }
        currentPathname = pathname;
        clearInterval(currentInterval);
        if (pathname.indexOf("train/home") === 1) { // 首页
            writeLog("首页");
            setTimeout(homeFunction, 3000)
        } else if (pathname.indexOf("train/workspace") === 1) { // 我的工作室
            writeLog("我的工作室");
            setTimeout(workspaceFunction, 3000)
        } else if (pathname.indexOf("train/guide/course/list") === 1) { // 课程列表
            writeLog("课程列表");
            setTimeout(courseListFunction, 3000)
        } else if (pathname.indexOf("grain/course") === 1) { // 课程详情
            writeLog("课程详情")
            currentInterval = setInterval(courseDetailFunction, 3000);
        }
    }

    // vue单页面 无跳转刷新 需要定时判断当前所在位置
    setInterval(initCurrentPos, 2000);
})();