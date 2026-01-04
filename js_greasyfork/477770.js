// ==UserScript==
// @name         人邮学院自动学习脚本
// @namespace    yumi1.top
// @version      1.0
// @description  人邮学院自动看视频和答题 赣南科技学院 自动学习脚本  https://gnust.rymooc.com/
// @author       yichen
// @match        https://gnust.rymooc.com/*
// @icon         https://www.yumi1.top/img/3.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477770/%E4%BA%BA%E9%82%AE%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477770/%E4%BA%BA%E9%82%AE%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CourseManager {
        constructor() {
            this.lessonIds = [];
            this.currentIndex = 0;
            this.finish = false;
            this.maxAttempts = 5;  // 最大尝试次数
            this.loopCount = 0;    // 当前尝试次数
        }

        // 初始化
        initialize() {
            try {
                // 判断是否在课程列表页面
                if (window.location.href.includes('/course/show/50')) {
                    console.log('当前在课程列表页面，开始获取课程ID...');
                    // 清理旧数据
                    localStorage.removeItem('lessonIds');
                    localStorage.removeItem('currentIndex');
                    this.getLessonIds();
                    if (this.lessonIds.length > 0) {
                        this.startLearning();
                    } else {
                        console.error('未能获取到课程列表');
                    }
                }
                // 判断是否在学习页面
                else if (window.location.href.includes('/course/learn/50')) {
                    console.log('当前在学习页面，处理视频...');
                    // 确保有存储的课程数据
                    const storedIds = localStorage.getItem('lessonIds');
                    if (!storedIds) {
                        console.log('未找到课程数据，返回课程列表页面...');
                        window.location.href = '/course/show/50';
                        return;
                    }
                    this.handleVideo();
                }
            } catch (error) {
                console.error('初始化时发生错误:', error);
            }
        }

        // 获取所有课程ID
        getLessonIds() {
            const lessonItems = document.querySelectorAll('.lesson-item');
            lessonItems.forEach(item => {
                // 获取data-id属性
                const id = item.getAttribute('data-id');
                // 检查是否有考试标记
                const isExam = item.querySelector('.type');
                if (id && !isExam) {
                    this.lessonIds.push(id);
                    console.log(`获取到课程ID: ${id}`);
                }
            });
            // 保存到localStorage
            localStorage.setItem('lessonIds', JSON.stringify(this.lessonIds));
            localStorage.setItem('currentIndex', '0');
            console.log('总共获取到 ' + this.lessonIds.length + ' 个课程');
        }

        // 开始学习流程
        startLearning() {
            const firstId = this.lessonIds[0];
            if (firstId) {
                console.log('开始第一课...');
                window.location.href = `/course/learn/50?lessonId=${firstId}`;
            }
        }

        // 处理视频播放
        handleVideo() {
            const video = document.querySelector('video');
            if (video) {
                console.log('找到视频元素');
                video.addEventListener('play', () => {
                    console.log('正在播放');
                    setTimeout(1000)
                    video.play();
                    video.currentTime = video.duration;
                });
                this.checkVideoFinished();
            } else {
                console.log('未找到视频元素');
            }
        }

        // 检测视频完成
        checkVideoFinished() {
            const checkInterval = setInterval(() => {
                const finishedElement = document.querySelector("#CourseFinished");
                const video = document.querySelector('video');
                if (finishedElement || (video && (video.ended || video.currentTime >= video.duration - 1))) {
                    clearInterval(checkInterval);
                    console.log('视频播放完成，准备答题...');
                    this.finish = true;
                    // 视频完成后调用答题流程
                    this.startAnswerProcess();
                }
            }, 1000);
        }
        // 新增：开始答题流程
        startAnswerProcess() {
            console.log('开始答题流程');
            this.clickNextButton();
        }
        // 修改：点击下一页按钮
        clickNextButton() {
            const nextButton = document.querySelector('.btn-nextLessonItem');
            if (nextButton) {
                console.log('找到下一页按钮，点击...');
                nextButton.click();
                setTimeout(() => this.answerQuestion(), 1000);
            } else {
                console.log('未找到下一页按钮');
                if (this.loopCount < this.maxAttempts) {
                    console.log(`尝试点击下一页按钮 (${this.loopCount + 1}/${this.maxAttempts})`);
                    this.loopCount++;
                    setTimeout(() => this.clickNextButton(), 1000);
                } else {
                    console.log('已达到最大尝试次数，进入下一课');
                    this.goToNextLesson();
                }
            }
        }
        // 修改：答题方法
        answerQuestion() {
            const checkbox = document.querySelector('.choice-item');
            if (checkbox) {
                console.log('找到选项，开始答题');
                checkbox.click();
                setTimeout(() => this.submitAnswer(), 1000);
            } else {
                const correctAnswer = document.querySelector('#radio2');
                if (correctAnswer) {
                    console.log('找到正确答案选项');
                    correctAnswer.click();
                    setTimeout(() => this.submitAnswer(), 1000);
                } else {
                    console.log('未找到答题选项，可能不是答题页面');
                    this.goToNextLesson();
                }
            }
        }
        // 修改：提交答案
        submitAnswer() {
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                console.log('提交答案');
                submitButton.click();
                // 等待答题结果，然后进入下一课
                setTimeout(() => this.goToNextLesson(), 2000);
            } else {
                console.log('未找到提交按钮');
                this.goToNextLesson();
            }
        }
        // 跳转到下一课
        goToNextLesson() {
            try {
                if (!this.finish) {
                    console.log('视频未完成，不进行跳转');
                    return;
                }
                const ids = JSON.parse(localStorage.getItem('lessonIds') || '[]');
                let currentIndex = parseInt(localStorage.getItem('currentIndex') || '0');
                if (!Array.isArray(ids) || ids.length === 0) {
                    console.error('未找到课程列表，重新获取...');
                    this.getLessonIds();
                    return;
                }
                currentIndex++;
                if (currentIndex < ids.length) {
                    localStorage.setItem('currentIndex', currentIndex.toString());
                    const nextLessonId = ids[currentIndex];
                    console.log(`准备进入下一课 (${currentIndex + 1}/${ids.length}), 课程ID: ${nextLessonId}`);
                    setTimeout(() => {
                        const nextUrl = `/course/learn/50?lessonId=${nextLessonId}`;
                        console.log('跳转到:', nextUrl);
                        window.location.href = nextUrl;
                        this.finish = false;
                    }, 2000);
                } else {
                    console.log('所有课程已完成！');
                    localStorage.removeItem('lessonIds');
                    localStorage.removeItem('currentIndex');
                }
            } catch (error) {
                console.error('goToNextLesson发生错误:', error);
                this.initialize();
            }
        }
    }

    // 启动脚本
    const courseManager = new CourseManager();
    console.log('脚本启动');
    courseManager.initialize();
})();