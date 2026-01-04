// ==UserScript==
// @name         实时自动切换课程
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  当课程进度达到100%时自动切换到下一个课程
// @author       You
// @match        https://onlinenew.enetedu.com/gdlnnu/MyTrainCourse/OnlineCourse?coursetype=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507060/%E5%AE%9E%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/507060/%E5%AE%9E%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 打印调试信息
    function debugLog(message) {
        console.log(`[DEBUG] ${message}`);
    }

    // 查找并返回下一个未完成的课程
    function findNextCourse() {
        // 查找所有课程项
        let courseItems = document.querySelectorAll('.classcenter-chapter2 ul li');

        for (let course of courseItems) {
            // 获取课程进度文本
            let progressText = course.querySelector('span').innerText;

            // 如果进度不是100%，返回这个课程的元素
            if (!progressText.includes('[100%]')) {
                debugLog(`找到未完成的课程: ${progressText}`);
                return course;
            }
        }
        debugLog('所有课程都已完成');
        return null;
    }

    // 检查当前课程的进度并切换课程
    function checkCourseCompletion() {
        let currentCourse = document.querySelector('.classcenter-chapter2 ul li[style*="background-color"]');
        let currentCourseProgress = currentCourse ? currentCourse.querySelector('span').innerText : '[0%]';

        // 如果当前课程已达到100%，自动切换到下一个课程
        if (currentCourseProgress.includes('[100%]')) {
            debugLog('当前课程已完成，正在查找下一个课程...');
            let nextCourse = findNextCourse();

            if (nextCourse) {
                debugLog('正在跳转到下一个课程...');
                nextCourse.click(); // 模拟点击下一个未完成的课程
            } else {
                debugLog('没有找到未完成的课程');
            }
        } else {
            debugLog(`当前课程进度: ${currentCourseProgress}`);
        }
    }

    // 定时执行函数，每3min检查一次课程进度
    setInterval(() => {
        checkCourseCompletion();
    }, 18000); // 每5秒检查一次课程进度

})();
