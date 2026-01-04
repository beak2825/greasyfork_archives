// ==UserScript==
// @name         ezi自觉学习脚本
// @namespace    http://tampermonkey.net/
// @version      1.32a
// @description  请自觉遵守中央八项规定并自动播放和切换在线课程视频，该版本完整地学完整个专题
// @match        *://*.zjce.gov.cn/*  
// @grant        none
// @license      BSD-2-Clause
// @author       zsanjin.de(ai版)
// @downloadURL https://update.greasyfork.org/scripts/523207/ezi%E8%87%AA%E8%A7%89%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523207/ezi%E8%87%AA%E8%A7%89%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 控制全局自动运行状态
    window.autoProgressStopped = false;
    window.processedCourses = new Set(); // 记录已处理的课程
 
    // 隐藏播放图标
    const style = document.createElement('style');
    style.textContent = `
        .dplayer-playing .dplayer-bezel {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
 
    // 获取随机间隔时间(约1分钟，±10秒)
    function getRandomInterval() {
        return Math.floor(Math.random() * (70000 - 50000 + 1) + 50000);
    }
 
    // 获取课程唯一标识符
    function getCourseIdentifier(courseElement) {
        try {
            const title = courseElement.querySelector('.left-name')?.textContent?.trim() || '';
            const duration = courseElement.querySelector('.tip-clock')?.nextElementSibling?.textContent?.trim() || '';
            return `${title}-${duration}`;
        } catch (error) {
            console.error('获取课程标识符失败:', error);
            return null;
        }
    }
 
    // 等待视频元素加载
    async function waitForVideoElement(timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                return videoElement;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('视频元素加载超时');
    }
 
    // 尝试播放视频
    async function playVideo() {
        try {
            const videoElement = await waitForVideoElement();
 
            if (videoElement.readyState >= 2) {
                const playPromise = videoElement.play();
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('视频开始播放');
                    return true;
                }
            } else {
                return new Promise((resolve) => {
                    videoElement.addEventListener('canplay', async () => {
                        const playPromise = videoElement.play();
                        if (playPromise !== undefined) {
                            await playPromise;
                            console.log('视频开始播放(在canplay事件后)');
                            resolve(true);
                        }
                    }, { once: true });
                });
            }
 
            const playButton = document.querySelector('.dplayer-play-icon');
            if (playButton) {
                playButton.click();
                console.log('已点击播放按钮');
            }
 
            return true;
        } catch (error) {
            console.error('播放视频时出错:', error);
            return false;
        }
    }
 
    // 检查视频进度
    function checkVideoProgress() {
        try {
            const progressBar = document.querySelector('.ant-progress-bg');
            return progressBar ? parseInt(progressBar.style.width) : 0;
        } catch (error) {
            console.error('获取进度出错:', error);
            return 0;
        }
    }
 
    // 检查是否是最后一个视频
    function isLastVideo() {
        try {
            const allVideos = document.querySelectorAll('.set-content');
            const currentVideo = document.querySelector('.set-content.active');
 
            if (!allVideos.length || !currentVideo) {
                return true;
            }
 
            const currentIndex = Array.from(allVideos).indexOf(currentVideo);
            return currentIndex === allVideos.length - 1;
        } catch (error) {
            console.error('检查是否为最后视频时出错:', error);
            return true;
        }
    }
 
    // 切换到下一个视频
    async function switchToNextVideo() {
        try {
            const allVideos = document.querySelectorAll('.set-content');
            const currentVideo = document.querySelector('.set-content.active');
 
            if (!allVideos.length || !currentVideo) {
                return false;
            }
 
            const currentIndex = Array.from(allVideos).indexOf(currentVideo);
            const nextVideo = allVideos[currentIndex + 1];
 
            if (nextVideo) {
                console.log('尝试切换到下一集');
                nextVideo.click();
 
                const titleElement = nextVideo.querySelector('.set-title');
                if (titleElement) {
                    titleElement.click();
                }
 
                let attempts = 0;
                const maxAttempts = 5;
 
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const success = await playVideo();
                    if (success) {
                        console.log(`成功播放视频，尝试次数：${attempts + 1}`);
                        return true;
                    }
                    attempts++;
                    console.log(`播放尝试 ${attempts} 失败，将重试...`);
                }
            }
            return false;
        } catch (error) {
            console.error('切换下一集时出错:', error);
            return false;
        }
    }
 
    // 返回课程列表
    async function returnToCourseList() {
        try {
            history.back();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
        } catch (error) {
            console.error('返回课程列表失败:', error);
            return false;
        }
    }
 
    // 处理视频播放
let hasUserInteracted = false;
 
// 监听用户交互
document.addEventListener('click', () => {
    hasUserInteracted = true;
});
 
async function playVideo() {
    const videoElement = document.querySelector('video');
    try {
        if (hasUserInteracted) {
            await videoElement.play();
            return true;
        }
        videoElement.muted = true; // 静音播放不需要用户交互
        await videoElement.play();
        return true;
    } catch (error) {
        console.error('视频播放失败:', error);
        return false;
    }
}
 
async function handleVideoPlayback() {
    try {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.paused) {
            console.log('检测到视频暂停，尝试重新播放');
            return await playVideo();
        }
        return true;
    } catch (error) {
        console.error('处理视频播放时出错:', error);
        return false;
    }
}
 
    // 处理单个专题内的所有视频
    async function handleCourseVideos() {
        while (!window.autoProgressStopped) {
            const progress = checkVideoProgress();
            console.log(`当前视频进度: ${progress}%`);
 
            if (progress >= 100) {
                if (!isLastVideo()) {
                    console.log('切换到下一个视频');
                    const switched = await switchToNextVideo();
                    if (!switched) break;
                } else {
                    console.log('当前专题所有视频已完成');
                    return true;
                }
            }
 
            await handleVideoPlayback();
            await new Promise(resolve => setTimeout(resolve, getRandomInterval()));
        }
        return false;
    }
 
    async function loadAllCourses() {
        console.log('开始加载所有专题...');
        const startTime = Date.now();
        const timeLimit = 5 * 60 * 100; // 5分钟/10 超时限制
        let loadAttempts = 0;
        const maxAttempts = 20;
        let previousCoursesCount = 0;
        let noChangeCount = 0;
 
        const possibleClassNames = [
            'show_all',
            'look-more',
            'show-more',
            'load-more',
            'more',
            'all'
        ];
 
        const possibleTexts = [
            '查看全部',
            '查看更多',
            '加载更多',
            '展开全部',
            '展开更多',
            '显示全部',
            '显示更多'
        ];
 
        while (!window.autoProgressStopped && loadAttempts < maxAttempts) {
            if (Date.now() - startTime > timeLimit) {
                console.log('加载超时，继续执行后续操作');
                break;
            }
 
            await new Promise(resolve => setTimeout(resolve, 2000));
 
            const currentCoursesCount = document.querySelectorAll('.video-item').length;
            let loadMoreButton = null;
 
            // 1. 通过类名直接查找
            for (const className of possibleClassNames) {
                const elements = document.getElementsByClassName(className);
                if (elements.length > 0) {
                    loadMoreButton = elements[0];
                    break;
                }
            }
 
            // 2. 通过文本内容查找
            if (!loadMoreButton) {
                const allElements = document.querySelectorAll('div, span, button, a');
                for (const element of allElements) {
                    const text = (element.textContent || '').trim();
                    if (possibleTexts.some(t => text.includes(t))) {
                        const style = window.getComputedStyle(element);
                        if (style.display !== 'none' &&
                            style.visibility !== 'hidden' &&
                            element.offsetParent !== null) {
                            loadMoreButton = element;
                            break;
                        }
                    }
                }
            }
 
            // 3. 尝试查找包含这些文本的父元素
            if (!loadMoreButton) {
                const allElements = document.querySelectorAll('div, span, button, a');
                for (const element of allElements) {
                    if (element.querySelector('span, img')) {
                        const text = (element.textContent || '').trim();
                        if (possibleTexts.some(t => text.includes(t))) {
                            const style = window.getComputedStyle(element);
                            if (style.display !== 'none' &&
                                style.visibility !== 'hidden' &&
                                element.offsetParent !== null) {
                                loadMoreButton = element;
                                break;
                            }
                        }
                    }
                }
            }
 
            if (currentCoursesCount === previousCoursesCount) {
                noChangeCount++;
                if (noChangeCount >= 3) {
                    console.log('课程数量连续3次未变化，可能已加载完成');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const finalCheckCount = document.querySelectorAll('.video-item').length;
                    if (finalCheckCount === currentCoursesCount) {
                        console.log('确认加载完成');
                        break;
                    }
                }
            } else {
                noChangeCount = 0;
            }
 
            if (loadMoreButton) {
                try {
                    console.log(`尝试加载更多... 当前课程数量: ${currentCoursesCount}`);
 
                    try {
                        loadMoreButton.click();
                    } catch (e) {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        loadMoreButton.dispatchEvent(clickEvent);
                    }
 
                    previousCoursesCount = currentCoursesCount;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    loadAttempts++;
 
                } catch (error) {
                    console.error('点击加载更多按钮时出错:', error);
                    loadAttempts++;
                }
            } else {
                console.log('未找到加载更多按钮，等待确认...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                const newCount = document.querySelectorAll('.video-item').length;
                if (newCount === currentCoursesCount) {
                    noChangeCount++;
                }
            }
        }
 
        const finalCoursesCount = document.querySelectorAll('.video-item').length;
        console.log(`专题加载完成，共加载 ${finalCoursesCount} 个专题`);
 
        await new Promise(resolve => setTimeout(resolve, 3000));
 
        return {
            success: true,
            totalCourses: finalCoursesCount,
            timeSpent: (Date.now() - startTime) / 1000,
            attempts: loadAttempts
        };
    }
 
    // 检查专题是否完成
    function isCourseCompleted(courseElement) {
        try {
            const progressText = courseElement.querySelector('.ellipsis.desc-author.progerss').textContent.trim();
            return progressText.includes('已完成') || progressText.includes('100%');
        } catch (error) {
            return false;
        }
    }
 
    // 获取所有未完成的专题
    function getUncompletedCourses() {
        const courses = document.querySelectorAll('.video-item');
        return Array.from(courses).filter(course => {
            const courseId = getCourseIdentifier(course);
            return courseId && !window.processedCourses.has(courseId) && !isCourseCompleted(course);
        });
    }
 
    // 修改主要自动学习流程
    async function startAutoLearning() {
        // 首先加载所有专题
        await loadAllCourses();
        
        while (!window.autoProgressStopped) {
            const uncompletedCourses = getUncompletedCourses();
            
            if (uncompletedCourses.length === 0) {
                console.log('所有专题已完成！');
                return;
            }
 
            console.log(`剩余 ${uncompletedCourses.length} 个未完成专题`);
            const currentCourse = uncompletedCourses[0];
            const courseId = getCourseIdentifier(currentCourse);
            
            if (courseId) {
                // 记录当前处理的课程
                window.processedCourses.add(courseId);
                
                // 进入专题
                const coverImage = currentCourse.querySelector('.base-image');
                if (coverImage) {
                    console.log(`开始处理专题: ${courseId}`);
                    coverImage.click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    // 处理专题内的所有视频
                    await handleCourseVideos();
                    
                    // 返回专题列表
                    await returnToCourseList();
                    
                    // 重新加载所有专题，以检查页面更新
                    await loadAllCourses(); // 添加此行以确保页面加载完成
                }
            }
            
            // 等待一段时间后继续下一个专题
            await new Promise(resolve => setTimeout(resolve, getRandomInterval()));
        }
    }
 
    // 修改启动函数，确保在DOM加载完成后再开始
    function initAutoLearning() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startAutoLearning);
        } else {
            startAutoLearning();
        }
    }
 
    // 启动自动学习
    console.log('准备开始自动学习...');
    initAutoLearning();
 
    // 添加停止功能
    window.stopAutoProgress = function() {
        console.log('正在停止自动学习...');
        window.autoProgressStopped = true;
    };
 
    console.log('提示：可以通过在控制台输入 stopAutoProgress() 来停止脚本');
})();