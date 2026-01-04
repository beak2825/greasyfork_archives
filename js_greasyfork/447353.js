// ==UserScript==
// @name         律师云学院助手
// @namespace    https://github.com/shiba2046/greasemonkey-scripts
// @version      0.8
// @description  自动刷律协培训课程，支持自动切换章节播放
// @author       Pengus
// @match        https://lawschool.lawyerpass.com/course/*
// @match        https://lawschool.lawyerpass.com/center/*
// @icon         https://lawschool.lawyerpass.com/assets/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447353/%E5%BE%8B%E5%B8%88%E4%BA%91%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447353/%E5%BE%8B%E5%B8%88%E4%BA%91%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// --- 配置区 ---
const CONFIG = {
    CHECK_INTERVAL_MS: 5000,         // 检查间隔（毫秒）
    COURSE_CHECK_INTERVAL_MS: 5000,   // 课程内检查间隔（毫秒）
    COMPLETION_THRESHOLD: 99,          // 完成阈值（百分比）
    ELEMENT_WAIT_TIMEOUT: 10000,       // 等待元素超时时间（毫秒）
    ELEMENT_CHECK_INTERVAL: 500,       // 检查元素间隔（毫秒）
    DEBUG: true                        // 调试模式
};

// --- 功能说明 ---
// 1. 自动播放课程视频
// 2. 自动检测并处理弹窗
// 3. 自动监控播放进度
// 4. 自动切换到下一个未完成的章节
// 5. 所有章节完成后自动进入下一课程
// 6. 显示课程进度和章节完成情况

// --- 工具函数 ---
const $ = {
    // 查找单个元素（同步）
    get: (selector) => document.querySelector(selector),
    
    // 查找多个元素（同步）
    getAll: (selector) => document.querySelectorAll(selector),
    
    // 等待元素出现（异步）
    waitForElement: async (selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                $.log(`找到元素: ${selector}`);
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, CONFIG.ELEMENT_CHECK_INTERVAL));
        }
        $.log(`等待元素超时: ${selector}`);
        return null;
    },

    // 等待多个元素出现（异步）
    waitForElements: async (selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                $.log(`找到${elements.length}个元素: ${selector}`);
                return elements;
            }
            await new Promise(resolve => setTimeout(resolve, CONFIG.ELEMENT_CHECK_INTERVAL));
        }
        $.log(`等待元素超时: ${selector}`);
        return [];
    },
    
    // 等待多个元素并转换为数组（异步）
    waitForElementsArray: async (selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) => {
        const elements = await $.waitForElements(selector, timeout);
        return Array.from(elements || []);
    },
    
    // XPath查询
    xpath: (xpath) => document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext(),
    
    // 检查URL是否包含文本
    urlHas: (text) => document.location.href.includes(text),
    
    // 日志输出
    log: (...args) => CONFIG.DEBUG && console.log('[律师云学院助手]', ...args)
};

// --- 视频控制 ---
const VideoControl = {
    // 当前正在处理的章节索引
    currentChapterIndex: 0,
    
    // 播放视频
    async play() {
        const playBtn = await $.waitForElement(".prism-play-btn");
        if (playBtn && !$.get(".prism-play-btn.playing")) {
            $.log('开始播放视频');
            playBtn.click();
            return true;
        }
        return false;
    },

    // 处理弹窗
    async handlePopup() {
        const confirmBtn = await $.waitForElement(".ant-modal-confirm-btns > button");
        if (confirmBtn) {
            $.log('关闭弹窗');
            confirmBtn.click();
            await this.play();
            return true;
        }
        return false;
    },

    // 获取所有进度元素
    async getAllProgressElements() {
        return await $.waitForElementsArray('div.name.pull-left > div.ng-star-inserted');
    },
    
    // 获取特定章节的进度
    async getChapterProgress(index = this.currentChapterIndex) {
        const progressElements = await this.getAllProgressElements();
        if (progressElements.length === 0 || !progressElements[index]) return 0;
        
        const progressText = progressElements[index].innerText.split('：')[1];
        return parseInt(progressText) || 0;
    },

    // 获取当前章节的进度
    async getProgress() {
        return await this.getChapterProgress();
    },

    // 获取所有章节元素
    async getChapterElements() {
        return await $.waitForElementsArray('.list-wrapper .list-box');
    },
    
    // 点击特定的章节
    async clickChapter(index) {
        const chapterElements = await this.getChapterElements();
        if (chapterElements.length > index) {
            $.log(`点击章节 ${index + 1}`);
            chapterElements[index].click();
            this.currentChapterIndex = index;
            return true;
        }
        return false;
    },

    // 获取所有章节的进度
    async getAllChapterProgress() {
        const progressElements = await this.getAllProgressElements();
        const results = [];
        
        for (let i = 0; i < progressElements.length; i++) {
            const progressText = progressElements[i].innerText.split('：')[1];
            const progress = parseInt(progressText) || 0;
            results.push({
                index: i,
                progress: progress,
                completed: progress >= CONFIG.COMPLETION_THRESHOLD
            });
        }
        
        return results;
    },

    // 检查完成状态并处理多章节
    async checkCompletion() {
        const progressElements = await this.getAllProgressElements();
        if (progressElements.length === 0) return false;
        
        // 获取当前章节进度
        const currentProgress = await this.getChapterProgress();
        $.log(`当前章节 ${this.currentChapterIndex + 1}/${progressElements.length} 进度: ${currentProgress}%`);
        
        // 如果当前章节完成
        if (currentProgress >= CONFIG.COMPLETION_THRESHOLD) {
            // 获取所有章节的进度状态
            const allProgress = await this.getAllChapterProgress();
            
            // 查找下一个未完成的章节
            const nextIncomplete = allProgress.find(item => 
                !item.completed && item.index > this.currentChapterIndex
            );
            
            // 如果找到了下一个未完成的章节，切换到它
            if (nextIncomplete) {
                $.log(`当前章节已完成，切换到章节 ${nextIncomplete.index + 1}/${progressElements.length}`);
                await this.clickChapter(nextIncomplete.index);
                setTimeout(() => this.play(), 1000); // 短暂延迟后播放视频
                return true;
            }
            
            // 如果所有章节都完成，点击下一步
            const allCompleted = allProgress.every(item => item.completed);
            if (allCompleted) {
                const entranceBtn = await $.waitForElement('.entrance');
                if (entranceBtn) {
                    $.log('所有章节完成，点击下一步');
                    entranceBtn.click();
                    return true;
                }
            }
        }
        
        return false;
    },

    // 更新标题显示当前进度
    async updateTitle() {
        const titleEl = await $.waitForElement(".title");
        if (!titleEl) return;
        
        const allProgress = await this.getAllChapterProgress();
        if (allProgress.length === 0) return;
        
        const currentProgress = await this.getProgress();
        const courseName = titleEl.textContent.trim().split(' ')[0];
        
        // 计算总体完成情况
        const completedChapters = allProgress.filter(item => item.completed).length;
        const totalChapters = allProgress.length;
        
        document.title = `${currentProgress}% - [${completedChapters}/${totalChapters}] ${courseName}`;
        
        // 在控制台输出所有章节的进度情况
        if (CONFIG.DEBUG) {
            console.table(allProgress.map(item => ({
                章节号: item.index + 1,
                进度: item.progress + '%',
                完成: item.completed ? '✓' : '✗'
            })));
        }
    }
};

// --- 课程列表控制 ---
const CourseList = {
    // 显示统计信息
    async showStats() {
        const username = await $.waitForElement('.username');
        if (!username) return;
        
        const done = (await $.waitForElements('.text-green')).length;
        const notDone = (await $.waitForElements('.text-yellow')).length;
        const total = done + notDone;
        
        const statsHtml = `<br/> 共 ${total} 课，已完成 ${done} 课，未完成 ${notDone} 课`;
        username.innerHTML += statsHtml;
        $.log('更新统计信息:', { total, done, notDone });
    },

    // 查找并开始未完成课程
    async findAndStartCourse() {
        const startBtn = await $.waitForElement("button.issue-btn.issue-default-btn.ng-star-inserted");
        if (startBtn) startBtn.click();

        const progressElements = await $.waitForElements('.progress-num');
        const unfinishedProgress = Array.from(progressElements)
            .find(el => el.innerText === '0%');
            
        if (unfinishedProgress) {
            const courseLink = unfinishedProgress.parentElement.parentElement.querySelector('a');
            if (courseLink) {
                $.log('开始新课程');
                courseLink.click();
                return true;
            }
        }
        return false;
    }
};

// --- 主程序 ---
(function() {
    'use strict';

    // 页面加载完成后的初始化
    window.addEventListener('load', async () => {
        if ($.urlHas('trainPlan')) {
            await CourseList.showStats();
        } else if ($.urlHas('course')) {
            // 页面加载时立即检查课程状态
            await VideoControl.updateTitle();
            await VideoControl.handlePopup();
            await VideoControl.play();
        }
    }, false);

    // 定期检查（针对课程列表）
    setInterval(async () => {
        try {
            if ($.urlHas('trainPlan')) {
                await CourseList.findAndStartCourse();
            }
        } catch (error) {
            $.log('执行出错:', error);
        }
    }, CONFIG.CHECK_INTERVAL_MS);
    
    // 更频繁地检查课程内容（针对视频播放）
    setInterval(async () => {
        try {
            if ($.urlHas('course')) {
                await VideoControl.updateTitle();
                await VideoControl.checkCompletion();
                await VideoControl.handlePopup();
                await VideoControl.play();
            }
        } catch (error) {
            $.log('执行出错:', error);
        }
    }, CONFIG.COURSE_CHECK_INTERVAL_MS);
})();