// ==UserScript==
// @name         岐黄天使刷课助手 - 视频播放模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.2
// @description  岐黄天使刷课助手的视频播放控制模块，负责视频的自动播放、暂停和状态管理。
// @author       AI助手
// ==/UserScript==

// 视频播放模块
(function() {
    'use strict';

    // 切换自动学习状态
    window.toggleAutoLearn = function() {
        // 获取当前状态，如果GM_getValue不可用，则使用localStorage
        let isRunning;
        if (typeof GM_getValue !== 'undefined') {
            isRunning = GM_getValue('qh-is-running', false);
        } else {
            isRunning = localStorage.getItem('qh-is-running') === 'true';
        }

        // 切换状态
        isRunning = !isRunning;

        // 保存新状态
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('qh-is-running', isRunning);
        } else {
            localStorage.setItem('qh-is-running', isRunning.toString());
        }

        console.log('切换自动学习状态:', isRunning ? '开始' : '暂停');

        if (isRunning) {
            // 开始自动学习
            if(window.qh && window.qh.updateStatus) window.qh.updateStatus('自动学习已开始');

            // 设置定时器，定期检查和播放视频
            if (!window.qh.autoPlayInterval) {
                window.qh.autoPlayInterval = setInterval(autoPlayVideo, 5000);

                // 立即执行一次
                setTimeout(autoPlayVideo, 500);
            }

            // 尝试播放所有视频
            setTimeout(() => {
                try {
                    // 直接调用视频播放函数
                    const videos = document.querySelectorAll('video');
                    if (videos.length > 0) {
                        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('找到视频，尝试播放');
                        console.log('找到视频，尝试播放');

                        videos.forEach(video => {
                            // 设置视频属性
                            video.loop = true;
                            video.muted = true;
                            video.playbackRate = 2.0;

                            // 尝试播放视频
                            try {
                                const playPromise = video.play();

                                if (playPromise !== undefined) {
                                    playPromise.then(() => {
                                        console.log('视频播放成功');
                                        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('视频播放成功');
                                    }).catch(error => {
                                        console.error('视频播放失败:', error);
                                        // 尝试使用其他方法播放
                                        setTimeout(() => {
                                            try {
                                                video.play();
                                            } catch (e) {
                                                console.error('重试播放失败:', e);
                                            }
                                        }, 1000);
                                    });
                                }
                            } catch (e) {
                                console.error('播放视频出错:', e);
                            }
                        });
                    }

                    // 检查iframe中的视频
                    const frames = document.querySelectorAll('iframe');
                    for (const frame of frames) {
                        try {
                            const frameDoc = frame.contentDocument || frame.contentWindow.document;
                            const frameVideos = frameDoc.querySelectorAll('video');

                            if (frameVideos.length > 0) {
                                if(window.qh && window.qh.updateStatus) window.qh.updateStatus('在iframe中找到视频，尝试播放');
                                console.log('在iframe中找到视频，尝试播放');

                                frameVideos.forEach(video => {
                                    // 设置视频属性
                                    video.loop = false; // 不循环播放
                                    video.muted = true;
                                    // 不修改播放速度，使用默认速度

                                    // 尝试播放视频
                                    try {
                                        const playPromise = video.play();

                                        if (playPromise !== undefined) {
                                            playPromise.then(() => {
                                                console.log('iframe视频播放成功');
                                                if(window.qh && window.qh.updateStatus) window.qh.updateStatus('iframe视频播放成功');
                                            }).catch(error => {
                                                console.error('iframe视频播放失败:', error);
                                                // 尝试使用其他方法播放
                                                setTimeout(() => {
                                                    try {
                                                        video.play();
                                                    } catch (e) {
                                                        console.error('重试播放iframe视频失败:', e);
                                                    }
                                                }, 1000);
                                            });
                                        }
                                    } catch (e) {
                                        console.error('播放iframe视频出错:', e);
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('无法访问iframe内容:', e);
                        }
                    }
                } catch (e) {
                    console.error('播放视频出错:', e);
                }
            }, 1000);
        } else {
            // 暂停自动学习
            if(window.qh && window.qh.updateStatus) window.qh.updateStatus('自动学习已暂停');

            // 清除定时器
            if (window.qh.autoPlayInterval) {
                clearInterval(window.qh.autoPlayInterval);
                window.qh.autoPlayInterval = null;
            }

            // 暂停所有视频
            pauseAllVideos();
        }

        // 更新按钮状态
        if(window.qh && window.qh.updateButtonStatus) window.qh.updateButtonStatus();
    };

    // 播放iframe中的视频
    window.playAllVideos = function() {
        // 尝试播放iframe中的视频
        const frames = document.querySelectorAll('iframe');
        frames.forEach(frame => {
            try {
                const frameDoc = frame.contentDocument || frame.contentWindow.document;
                const frameVideos = frameDoc.querySelectorAll('video');
                frameVideos.forEach(video => {
                    // 设置视频属性
                    video.loop = false; // 不循环播放
                    video.muted = true;
                    // 不修改播放速度，使用默认速度

                    // 尝试播放视频
                    try {
                        const playPromise = video.play();

                        // 处理播放承诺
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                console.log('iframe视频播放成功');
                            }).catch(error => {
                                console.error('iframe视频播放失败:', error);
                                // 尝试使用其他方法播放
                                setTimeout(() => {
                                    try {
                                        video.play();
                                    } catch (e) {
                                        console.error('重试播放iframe视频失败:', e);
                                    }
                                }, 1000);
                            });
                        }
                    } catch (e) {
                        console.error('播放iframe视频出错:', e);
                    }
                });
            } catch (e) {
                console.error('无法访问iframe内容:', e);
            }
        });
    };

    // 暂停所有视频
    window.pauseAllVideos = function() {
        document.querySelectorAll('video').forEach(video => video.pause());
        const frames = document.querySelectorAll('iframe');
        frames.forEach(frame => {
            try {
                const frameDoc = frame.contentDocument || frame.contentWindow.document;
                frameDoc.querySelectorAll('video').forEach(video => video.pause());
            } catch (e) { /*忽略*/ }
                });
        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('所有视频已暂停');
        console.log('所有视频已暂停');
    };

    // 主要功能：自动播放视频
    window.autoPlayVideo = function() {
        console.log('[自动播放] 检查视频...');
        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('自动播放检查中...');

        let videoPlayed = false;

        // 改进视频检测逻辑，不依赖标记属性
        const allVideos = [];

        // 检查主文档中的视频
        const mainVideos = Array.from(document.querySelectorAll('video'));
        allVideos.push(...mainVideos);

        // 检查iframe中的视频（增强错误处理）
        const frames = document.querySelectorAll('iframe');
        for (const frame of frames) {
            try {
                // 尝试多种方式访问iframe内容
                let frameDoc = null;
                try {
                    frameDoc = frame.contentDocument;
                } catch (e) {
                    try {
                        frameDoc = frame.contentWindow.document;
                    } catch (e2) {
                        console.debug('[自动播放] 无法访问iframe内容 (跨域限制):', frame.src);
                        continue;
                    }
                }

                if (frameDoc) {
                    const frameVideos = Array.from(frameDoc.querySelectorAll('video'));
                    allVideos.push(...frameVideos);
                    console.log(`[自动播放] 在iframe中找到 ${frameVideos.length} 个视频`);
                }
            } catch (e) {
                console.debug('[自动播放] 跳过无法访问的iframe:', e.message);
            }
        }

        if (allVideos.length === 0) {
            if(window.qh && window.qh.updateStatus) window.qh.updateStatus('未找到可播放视频');
            console.log('[自动播放] 未找到视频元素。');

            // 如果没有视频，尝试导航到下一课
            if (window.qh && window.qh.courseList && window.qh.courseList.length > 0) {
                console.log('[自动播放] 尝试导航到列表中的下一课。');
                if(window.qh && window.qh.updateStatus) window.qh.updateStatus('尝试导航下一课');
                if (typeof navigateToNextCourse === 'function') {
                    navigateToNextCourse();
                } else if (typeof window.navigateToNextCourse === 'function') {
                    window.navigateToNextCourse();
                }
            }
            return;
        }

        console.log(`[自动播放] 找到 ${allVideos.length} 个视频元素`);

        // 改进视频播放逻辑
        for (const video of allVideos) {
            // 检查视频是否需要播放（更全面的条件）
            const needsPlay = video.paused ||
                             video.ended ||
                             video.readyState === 0 ||
                             (video.currentTime === 0 && video.duration > 0);

            if (needsPlay) {
                console.log('[自动播放] 找到需要播放的视频，尝试播放:', {
                    paused: video.paused,
                    ended: video.ended,
                    readyState: video.readyState,
                    currentTime: video.currentTime,
                    duration: video.duration
                });

                // 设置视频属性
                video.loop = false; // 确保非循环，以便ended事件触发
                video.muted = true;

                // 尝试播放视频
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('[自动播放] 视频开始播放成功');
                        updateVideoListeners(video); // 添加或更新事件监听器
                        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('视频播放中...');

                        // 尝试检测当前课程名称
                        const courseName = detectCurrentCourseInHierarchy(video) || '视频课程';
                        if(window.qh && window.qh.updateCurrentCourse) window.qh.updateCurrentCourse(courseName);

                        videoPlayed = true;
                    }).catch(error => {
                        console.warn('[自动播放] 播放视频失败:', error.message);
                        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('视频播放失败: ' + error.message);
                    });
                } else {
                    console.log('[自动播放] 视频播放方法未返回Promise，可能已开始播放');
                    videoPlayed = true;
                }

                if (videoPlayed) break; // 每次只尝试播放一个视频
            }
        }

        if (!videoPlayed) {
            console.log('[自动播放] 所有视频都在播放中或无需操作。');
            if(window.qh && window.qh.updateStatus) window.qh.updateStatus('视频状态正常');
        }
    };

    // 检测当前课程名称的辅助函数
    function detectCurrentCourseInHierarchy(videoElement) {
        try {
            // 尝试从页面标题获取
            const titleElement = document.getElementById('kcTitle');
            if (titleElement && titleElement.textContent.trim()) {
                return titleElement.textContent.trim();
            }

            // 尝试从视频元素的父级容器获取
            if (videoElement) {
                let parent = videoElement.parentElement;
                while (parent && parent !== document.body) {
                    const titleEl = parent.querySelector('.title, .course-title, .video-title, h1, h2, h3');
                    if (titleEl && titleEl.textContent.trim()) {
                        return titleEl.textContent.trim();
                    }
                    parent = parent.parentElement;
                }
            }

            // 尝试从当前课程列表获取
            if (window.qh && window.qh.courseList && window.qh.currentCourseIndex >= 0) {
                const currentCourse = window.qh.courseList[window.qh.currentCourseIndex];
                if (currentCourse && currentCourse.title) {
                    return currentCourse.title;
                }
            }

            return null;
        } catch (e) {
            console.debug('检测课程名称时出错:', e);
            return null;
        }
    }

    // 查找并点击未完成的课程
    window.findAndClickUnfinishedCourse = function(doc) {
        // 查找未完成的视频链接
        const unfinishedLinks = doc.querySelectorAll('.append-plugin-tip > a, .content-unstart a, .content-learning a');
        if (unfinishedLinks.length > 0) {
            updateStatus('找到未完成的课程，即将播放');

            // 收集所有课程链接，用于上一课/下一课导航
            if (typeof collectCourseLinks === 'function') {
                collectCourseLinks(doc);
            }

            // 点击第一个未完成的课程
            try {
                unfinishedLinks[0].click();
            } catch (e) {
                console.error('点击未完成课程失败:', e);
                updateStatus('点击未完成课程失败');
            }
        } else {
            updateStatus('未找到未完成的课程，可能已全部完成');

            // 检查是否有课程列表
            const coursesInList = doc.querySelectorAll('.mycourse-row');
            if (coursesInList.length > 0) {
                // 收集课程列表
                if (typeof collectCoursesFromList === 'function') {
                    collectCoursesFromList(doc);
                }

                // 遍历课程列表，查找未完成的课程
                for (let i = 0; i < coursesInList.length; i++) {
                    const courseRow = coursesInList[i];
                    const courseState = courseRow.innerText.includes('未完成') || courseRow.innerText.includes('未开始');

                    if (courseState) {
                        updateStatus('在课程列表中找到未完成课程，即将打开');

                        try {
                            const courseLink = courseRow.querySelector('a');
                            if (courseLink) {
                                courseLink.click();
                                break;
                            }
                        } catch (e) {
                            console.error('点击课程列表中的未完成课程失败:', e);
                        }
                    }
                }
            }
        }
    };

    // 检查进度指示器
    window.checkProgressIndicator = function(doc) {
        // 首先尝试从<div class="jc_hd w-80">当前视频已观看时长：<span id="schedule">100%</span>获取进度
        const scheduleElement = doc.getElementById('schedule');
        if (scheduleElement) {
            const progressText = scheduleElement.textContent.trim();
            const progressMatch = progressText.match(/(\d+)%/);
            if (progressMatch && progressMatch[1]) {
                const progress = parseInt(progressMatch[1]);
                console.log('从schedule元素获取到进度:', progress + '%');
                updateProgress(progress);

                // 如果进度为100%，自动切换到下一个课程
                if (progress === 100) {
                    // 防止重复触发
                    if (window.qh.isNavigating) {
                        console.log('导航已在进行中，忽略进度100%事件');
                        return;
                    }

                    console.log('当前视频已完成，准备切换到下一个课程');
                    updateStatus('视频播放完成，准备切换到下一个课程');

                    // 设置导航状态标志
                    window.qh.isNavigating = true;

                    // 延迟一秒后切换到下一课
                    setTimeout(() => {
                        // 使用navigateToNextCourse函数切换到下一课
                        if (typeof navigateToNextCourse === 'function') {
                            navigateToNextCourse();
                        }

                        // 5秒后重置导航状态标志，避免卡死
                        setTimeout(() => {
                            window.qh.isNavigating = false;
                        }, 5000);
                    }, 1000);
                }
                return;
            }
        }

        // 如果没有找到schedule元素，尝试其他进度指示器
        const progressIndicator = doc.getElementById('realPlayVideoTime');
        if (progressIndicator) {
            const progress = parseInt(progressIndicator.innerText);
            updateProgress(progress);

            // 如果进度为100%，自动切换到下一个课程
            if (progress === 100) {
                // 防止重复触发
                if (window.qh.isNavigating) {
                    console.log('导航已在进行中，忽略进度100%事件');
                    return;
                }

                console.log('当前视频已完成，准备切换到下一个课程');
                updateStatus('视频播放完成，准备切换到下一个课程');

                // 设置导航状态标志
                window.qh.isNavigating = true;

                // 延迟一秒后切换到下一课
                setTimeout(() => {
                    // 使用navigateToNextCourse函数切换到下一课
                    if (typeof navigateToNextCourse === 'function') {
                        navigateToNextCourse();
                    }

                    // 5秒后重置导航状态标志，避免卡死
                    setTimeout(() => {
                        window.qh.isNavigating = false;
                    }, 5000);
                }, 1000);
            }
        }

        // 尝试查找其他可能的进度指示器
        const jcHdElements = doc.querySelectorAll('.jc_hd');
        for (const jcHd of jcHdElements) {
            if (jcHd.textContent.includes('当前视频已观看时长')) {
                const progressText = jcHd.textContent;
                const progressMatch = progressText.match(/(\d+)%/);
                if (progressMatch && progressMatch[1]) {
                    const progress = parseInt(progressMatch[1]);
                    console.log('从jc_hd元素获取到进度:', progress + '%');
                    updateProgress(progress);

                    // 如果进度为100%，自动切换到下一个课程
                    if (progress === 100) {
                        // 防止重复触发
                        if (window.qh.isNavigating) {
                            console.log('导航已在进行中，忽略进度100%事件');
                            return;
                        }

                        console.log('当前视频已完成，准备切换到下一个课程');
                        updateStatus('视频播放完成，准备切换到下一个课程');

                        // 设置导航状态标志
                        window.qh.isNavigating = true;

                        // 延迟一秒后切换到下一课
                        setTimeout(() => {
                            // 使用navigateToNextCourse函数切换到下一课
                            if (typeof navigateToNextCourse === 'function') {
                                navigateToNextCourse();
                            }

                            // 5秒后重置导航状态标志，避免卡死
                            setTimeout(() => {
                                window.qh.isNavigating = false;
                            }, 5000);
                        }, 1000);
                    }
                    return;
                }
            }
        }
    };

    function updateVideoListeners(videoElement) {
        if (!videoElement) return;
        const qh = window.qh || {};

        const onPlay = () => { if(qh.updateStatus) qh.updateStatus('视频播放中...'); };
        const onPause = () => { if(qh.updateStatus) qh.updateStatus('视频已暂停'); };
        const onEnded = () => handleVideoEnd(videoElement); // 直接传递videoElement
        const onTimeUpdate = () => {
            if (videoElement.duration && videoElement.currentTime) {
                const progress = (videoElement.currentTime / videoElement.duration) * 100;
                if(qh.updateProgress) qh.updateProgress(Math.round(progress));
            }
        };

        videoElement.addEventListener('play', onPlay);
        videoElement.addEventListener('pause', onPause);
        videoElement.addEventListener('ended', onEnded);
        videoElement.addEventListener('timeupdate', onTimeUpdate);

        // 存储事件监听器以便移除
        videoElement.qhListeners = { onPlay, onPause, onEnded, onTimeUpdate };
        if(qh.updateStatus) qh.updateStatus('视频监听器已更新');
    }
    window.updateVideoListeners = updateVideoListeners;

    function handleVideoEnd(videoElement) {
        console.log('视频播放结束事件触发');
        if(window.qh && window.qh.updateStatus) window.qh.updateStatus('视频播放完毕');
        if(window.qh && window.qh.updateProgress) window.qh.updateProgress(100);

        if (window.qh && window.qh.dailyLimitManager) {
            window.qh.dailyLimitManager.notifyVideoWatched();
            if (window.qh.dailyLimitManager.state.isLimitReached) {
                console.log('[VideoPlayer] 每日上限达到，停止自动播放。');
                if(window.qh && window.qh.updateStatus) window.qh.updateStatus('每日上限，停止播放');
                // 如果 toggleAutoLearn 是全局的，并且当前是运行状态，则调用它来暂停
                let isRunning = false;
                if (typeof GM_getValue !== 'undefined') { isRunning = GM_getValue('qh-is-running', false); }
                else { isRunning = localStorage.getItem('qh-is-running') === 'true'; }
                if (isRunning && typeof window.toggleAutoLearn === 'function') {
                    window.toggleAutoLearn(); // 这会设置 isRunning 为 false 并更新UI
                }
                return; // 不再尝试播放下一个
            }
        }

        // 尝试播放列表中的下一个视频或课程
        if (typeof navigateToNextCourse === 'function') {
            console.log('准备导航到下一课...');
            if(window.qh && window.qh.updateStatus) window.qh.updateStatus('准备导航到下一课...');
            setTimeout(navigateToNextCourse, 2000); // 延迟2秒再跳转
        } else {
            console.warn('navigateToNextCourse 函数不可用');
             if(window.qh && window.qh.updateStatus) window.qh.updateStatus('无法自动导航到下一课');
        }
    }
    window.handleVideoEnd = handleVideoEnd;

    function detectCurrentCourseInHierarchy(videoElement) {
        let currentElement = videoElement;
        for (let i = 0; i < 5; i++) { // 向上查找5层
            if (!currentElement) break;
            // 尝试常见的标题类名或ID (需要根据实际网站结构调整)
            const titleEl = currentElement.querySelector('.title, .course-title, #courseName, #videoName');
            if (titleEl && titleEl.textContent.trim()) {
                return titleEl.textContent.trim();
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    console.log('[模块加载] videoPlayer 模块已加载');

    // 模块加载时检查并恢复自动播放状态
    (function() {
        const isRunning = GM_getValue('qh-is-running', false);
        console.log('[VideoPlayer] 模块加载时，检测到 qh-is-running:', isRunning);
        if (isRunning) {
            console.log('[VideoPlayer] 自动学习先前已开启，尝试恢复播放和UI状态。');
            // 确保UI状态更新
            if (window.qh && typeof window.qh.updateStatus === 'function') {
                window.qh.updateStatus('自动学习进行中...');
            }
            if (window.qh && typeof window.qh.updateButtonStatus === 'function') {
                window.qh.updateButtonStatus(); // 这会更新按钮文本为"暂停"
            }

            // 启动或恢复播放检查定时器
            if (!window.qh.autoPlayInterval) {
                console.log('[VideoPlayer] 恢复 autoPlayInterval 定时器。');
                window.qh.autoPlayInterval = setInterval(autoPlayVideo, 5000); // 与 toggleAutoLearn 中一致
                setTimeout(autoPlayVideo, 500); // 立即尝试播放
            } else {
                console.log('[VideoPlayer] autoPlayInterval 定时器已存在。');
            }
            // 确保视频尝试播放的逻辑也执行
             setTimeout(() => autoPlayVideo(), 1000); // 延迟一点确保页面元素加载完毕
        } else {
            console.log('[VideoPlayer] 自动学习先前未开启或已手动暂停。');
        }
    })();
})();
