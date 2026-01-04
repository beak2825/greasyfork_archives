// ==UserScript==
// @name         浪潮大学“爱学习”自动课程学习助手
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动点击浪潮大学“爱学习”平台课程的课件学习，课件学习完成后自动切换至下一个未完成的课件
// @author       yn
// @match        https://edu.inspur.com/*
// @icon         https://picobd.yunxuetang.cn/sys/18653182312/images/202009/05d332081dbc4370b1dd7b184def21de.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534480/%E6%B5%AA%E6%BD%AE%E5%A4%A7%E5%AD%A6%E2%80%9C%E7%88%B1%E5%AD%A6%E4%B9%A0%E2%80%9D%E8%87%AA%E5%8A%A8%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534480/%E6%B5%AA%E6%BD%AE%E5%A4%A7%E5%AD%A6%E2%80%9C%E7%88%B1%E5%AD%A6%E4%B9%A0%E2%80%9D%E8%87%AA%E5%8A%A8%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查当前URL是否包含目标路径
    const isValidPath = () => {
        return location.hash.includes('#/study/course/detail/');
    };
    // 所有课件
    let courseList = [];
    // 检查所有课件是否已学完
    function checkAllCompleted() {
        // 获取所有课件列表元素
        const totalCourses = courseList.length;
        // 统计已完成的课件数量
        const completedCourses = courseList.filter(course => {
            // 没有"需学"或"需再学"标记的即为已完成
            return !(hasTextContent(course, "需学") || hasTextContent(course, "需再学"));
        }).length;

        console.log(`所有课件数量：${totalCourses}`);
        console.log(`已完成 ${completedCourses} 个课件`);
        return totalCourses === completedCourses;
    }

    // 检查并切换到下一个未完成的课件
    function checkAndSwitchToNext() {

        // 查找并开始学习下一个未完成的课件
        for (let i = 0; i < courseList.length; i++) {
            const course = courseList[i];
            // “需学”或“需再学”标记的
            if (hasTextContent(course, "需学") || hasTextContent(course, '需再学')) {
                const courseTitleElement = course.querySelector('.chapter-item-title');
                const courseTitle = courseTitleElement ? courseTitleElement.textContent.trim() : '未知课件';

                // 检查是否处于学习中
                const learningIcon = course.querySelector('.icon-com.icon-com-play');
                if (learningIcon) {
                    console.log(`【${courseTitle}】 学习中...`);
                    return;
                }
                console.clear();
                console.log(`开始学习课件：【${courseTitle}】`);


                const expandIcon = course.querySelector('.guide-expand-control-icon');
                if (expandIcon) {
                    expandIcon.click();
                }
                if (courseTitleElement) {
                    courseTitleElement.click();
                }
                return;
            }
        }

    }

    // 检查元素是否包含特定文本的辅助函数
    function hasTextContent(element, text) {
        const spans = element.querySelectorAll('span');
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].textContent.includes(text)) {
                return true;
            }
        }
        return false;
    }

    // 检查网址
    if (!isValidPath()) {
        console.log('非课程学习页面');
        return;
    }


    console.log('开始自动学习......');
    // 每隔一段时间检查是否需要切换课件（10秒）
    const checkInterval = setInterval(() => {
        courseList = Array.from(document.querySelectorAll('.chapter-list-box.required'));
        if (courseList.length === 0) return;
        // 如果所有课件都已完成，则清除定时器
        if (checkAllCompleted()) {
            console.log('学习任务已完成，停止自动检查');
            clearInterval(checkInterval);
            return;
        }
        checkAndSwitchToNext();

    }, 10000);


})();