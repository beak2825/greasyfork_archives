// ==UserScript==
// @name         自动学习并监控视频播放、分页和学时判断
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动检测学时，判断课程是否完成，若未完成则进入相应选修或必修课开始学习。自动播放视频和翻页。找到未完成任务后即开始学习，避免重复检测，并检测视频播放结束。
// @author       You
// @match        https://rcxf.cddyjy.com/dyjy/civilServant
// @grant        none
// updateURL     https://update.greasyfork.org/scripts/512533/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%B9%B6%E7%9B%91%E6%8E%A7%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E3%80%81%E5%88%86%E9%A1%B5%E5%92%8C%E5%AD%A6%E6%97%B6%E5%88%A4%E6%96%AD.user.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512533/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%B9%B6%E7%9B%91%E6%8E%A7%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E3%80%81%E5%88%86%E9%A1%B5%E5%92%8C%E5%AD%A6%E6%97%B6%E5%88%A4%E6%96%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/512533/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%B9%B6%E7%9B%91%E6%8E%A7%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E3%80%81%E5%88%86%E9%A1%B5%E5%92%8C%E5%AD%A6%E6%97%B6%E5%88%A4%E6%96%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let retryCount = 0; // 用于跟踪尝试次数
    const maxRetries = 3; // 最大重试次数

    // 延迟执行，等待页面完全加载
    setTimeout(function() {
        checkStudyHoursAndStart(); // 先判断学时，再进入相应的课程
    }, 5000); // 5秒后执行，等待页面内容加载完成

    // 获取学时信息并根据情况启动相应的学习流程
    function checkStudyHoursAndStart() {
        const requiredCourseInfo = document.querySelector('div.course-period-item.course-period-item-1');
        const electiveCourseInfo = document.querySelector('div.course-period-item.course-period-item-2');

        let isRequiredCourseComplete = false;
        let isElectiveCourseComplete = false;

        // 检查必修课学时
        if (requiredCourseInfo) {
            const requiredCourseHours = requiredCourseInfo.querySelectorAll('p');
            if (requiredCourseHours.length >= 2) {
                const totalRequiredHours = parseFloat(requiredCourseHours[0].innerText.match(/\d+(\.\d+)?/)[0]); // 总学时
                const completedRequiredHours = parseFloat(requiredCourseHours[1].innerText.match(/\d+(\.\d+)?/)[0]); // 已完成学时

                console.log(`必修课总学时: ${totalRequiredHours}`);
                console.log(`必修课已完成学时: ${completedRequiredHours}`);

                if (completedRequiredHours >= totalRequiredHours) {
                    console.log('必修课已完成');
                    isRequiredCourseComplete = true;
                }
            }
        }

        // 检查选修课学时
        if (electiveCourseInfo) {
            const electiveCourseHours = electiveCourseInfo.querySelectorAll('p');
            if (electiveCourseHours.length >= 2) {
                const totalElectiveHours = parseFloat(electiveCourseHours[0].innerText.match(/\d+(\.\d+)?/)[0]); // 总学时
                const completedElectiveHours = parseFloat(electiveCourseHours[1].innerText.match(/\d+(\.\d+)?/)[0]); // 已完成学时

                console.log(`选修课总学时: ${totalElectiveHours}`);
                console.log(`选修课已完成学时: ${completedElectiveHours}`);

                if (completedElectiveHours >= totalElectiveHours) {
                    console.log('选修课已完成');
                    isElectiveCourseComplete = true;
                }
            }
        }

        // 判断是必修课还是选修课未完成，并进入相应的课程
        if (!isRequiredCourseComplete) {
            enterRequiredCourse(); // 必修课未完成，进入必修课
        } else if (!isElectiveCourseComplete) {
            enterElectiveCourse(); // 选修课未完成，进入选修课
        } else {
            console.log('所有课程已完成');
        }
    }

    // 进入必修课学习
    function enterRequiredCourse() {
        // 查找包含“必修课”文字的选项卡并点击
        const requiredCourseTab = Array.from(document.querySelectorAll('div.ant-tabs-tab')).find(tab => tab.innerText.includes('必修课'));
        if (requiredCourseTab) {
            console.log('找到 "必修课" 选项卡，准备点击...');
            requiredCourseTab.click(); // 点击必修课tab
            setTimeout(checkForIncompleteTask, 3000); // 等待加载后检查未完成任务
        } else {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.log(`未找到 "必修课" 选项卡，等待5秒后再次尝试查找... (第${retryCount}次重试)`);
                setTimeout(enterRequiredCourse, 5000); // 5秒后再次查找必修课选项卡
            } else {
                console.log('超过最大重试次数，刷新页面重新开始...');
                location.reload(); // 超过重试次数后刷新页面重新开始
            }
        }
    }

    // 进入选修课学习
    function enterElectiveCourse() {
        // 查找包含“选修课”文字的选项卡并点击
        const electiveCourseTab = Array.from(document.querySelectorAll('div.ant-tabs-tab')).find(tab => tab.innerText.includes('选修课'));
        if (electiveCourseTab) {
            console.log('找到 "选修课" 选项卡，准备点击...');
            electiveCourseTab.click(); // 点击选修课tab
            setTimeout(checkForIncompleteTask, 3000); // 等待加载后检查未完成任务
        } else {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.log(`未找到 "选修课" 选项卡，等待5秒后再次尝试查找... (第${retryCount}次重试)`);
                setTimeout(enterElectiveCourse, 5000); // 5秒后再次查找选修课选项卡
            } else {
                console.log('超过最大重试次数，刷新页面重新开始...');
                location.reload(); // 超过重试次数后刷新页面重新开始
            }
        }
    }

    // 检查是否有未完成的任务，找到第一个即开始学习
    function checkForIncompleteTask() {
        const divs = document.querySelectorAll('div.ant-col.ant-col-12');

        for (let div of divs) {
            if (div.innerText.includes('未完成')) {
                const studyButton = Array.from(div.querySelectorAll('button')).find(button => button.innerText.includes('去 学 习'));
                if (studyButton) {
                    console.log('找到第一个 "去 学 习" 按钮，准备点击...');
                    studyButton.click(); // 点击第一个 "去 学 习" 按钮
                    setTimeout(waitForVideoAndPlay, 3000); // 点击后等待3秒，再检测视频并播放
                    return; // 找到第一个未完成任务后立即停止检查
                }
            }
        }

        // 如果没有找到未完成的任务，尝试点击下一页
        goToNextPage();
    }

    // 点击下一页
    function goToNextPage() {
        const nextPageButton = document.querySelector('[title="下一页"]');
        if (nextPageButton) {
            console.log('未找到 "未完成" 任务，点击 "下一页"...');
            nextPageButton.click();
            setTimeout(checkForIncompleteTask, 3000);
        } else {
            console.log('未找到 "下一页" 按钮，可能已经是最后一页。');
        }
    }

       // 直接查找并点击 "Play Video" 按钮
    function waitForVideoAndPlay() {
        const playButton = Array.from(document.querySelectorAll('button')).find(button => button.innerText.includes('Play Video'));

        if (playButton) {
            console.log('找到 "Play Video" 按钮，准备点击播放...');
            playButton.click(); // 直接点击播放按钮
        }

        const video = document.querySelector('video'); // 选择 <video> 元素，确认是否存在视频

        if (video) {
            console.log('检测到视频元素，开始监控播放状态...');
            // 自动播放视频
            video.play();

            // 添加监听器，当视频播放结束时执行操作
            video.addEventListener('ended', function() {
                console.log('视频播放结束，准备关闭...');
                const closeButton = Array.from(document.querySelectorAll('button')).find(button => button.innerText.includes('关闭'));
                if (closeButton) {
                    closeButton.click();
                }
                console.log('视频关闭后刷新页面...');
                setTimeout(() => location.reload(), 1000); // 关闭后1秒刷新页面
            });
        } else {
            console.log('未检测到视频元素，请检查视频的标签结构。');
        }
    }

})();