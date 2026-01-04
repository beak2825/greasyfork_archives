// ==UserScript==
// @name         岐黄天使刷课助手 - 视频导航模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.1
// @description  岐黄天使刷课助手的视频播放页面导航模块，负责视频播放页面的上一课/下一课功能。
// @author       AI助手
// ==/UserScript==

// 视频导航模块 - 专门处理视频播放页面的导航
(function() {
    'use strict';

    // 初始化视频导航
    window.initVideoNavigation = function() {
        console.log('初始化视频导航');

        // 创建导航按钮
        createNavigationButtons();

        // 监听视频结束事件
        listenVideoEnd();
    };

    // 创建导航按钮
    function createNavigationButtons() {
        // 检查是否已存在导航按钮
        if (document.querySelector('.qh-nav-buttons')) {
            console.log('导航按钮已存在，无需创建');
            return;
        }

        console.log('创建导航按钮');

        // 创建导航按钮容器
        const navContainer = document.createElement('div');
        navContainer.className = 'qh-nav-buttons';
        navContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 36px;
            z-index: 9999;
        `;

        // 创建上一课按钮
        const prevButton = document.createElement('div');
        prevButton.className = 'qh-prev-btn';
        prevButton.textContent = '上一课';
        prevButton.style.cssText = `
            padding: 10px 20px;
            background-color: #40b65a;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            user-select: none;
        `;

        // 创建下一课按钮
        const nextButton = document.createElement('div');
        nextButton.className = 'qh-next-btn';
        nextButton.textContent = '下一课';
        nextButton.style.cssText = `
            padding: 10px 20px;
            background-color: #40b65a;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            user-select: none;
        `;

        // 添加按钮到容器
        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);

        // 添加容器到页面
        document.body.appendChild(navContainer);

        // 绑定事件
        prevButton.addEventListener('click', function() {
            navigateToPrevVideo();
        });

        nextButton.addEventListener('click', function() {
            navigateToNextVideo();
        });

        console.log('导航按钮创建完成');
    }

    // 监听视频结束事件
    function listenVideoEnd() {
        // 定义视频结束处理函数
        window.videoEndHandler = function() {
            console.log('视频播放结束，准备切换到下一个视频');

            // 防止重复触发
            if (window.qh.isNavigating) {
                console.log('导航已在进行中，忽略视频结束事件');
                return;
            }

            // 延迟一秒后切换到下一课，避免与其他事件冲突
            setTimeout(() => {
                navigateToNextVideo();
            }, 1000);
        };

        // 查找并监听所有视频元素
        function findAndListenVideos() {
            console.log('查找视频元素并添加结束事件监听器');

            // 查找页面中的视频元素
            const videoElements = document.querySelectorAll('video');
            let foundVideos = false;

            videoElements.forEach(video => {
                // 移除之前可能存在的事件监听器
                video.removeEventListener('ended', window.videoEndHandler);

                // 添加事件监听器
                video.addEventListener('ended', window.videoEndHandler);
                console.log('已为视频添加结束事件监听器');
                foundVideos = true;

                // 监听视频进度
                monitorVideoProgress(video);
            });

            // 如果没有找到视频元素，尝试在iframe中查找
            if (!foundVideos) {
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        if (!iframe.contentDocument && iframe.contentWindow) {
                            console.log('尝试通过contentWindow访问iframe内容');
                            const iframeDoc = iframe.contentWindow.document;
                            processIframeVideos(iframeDoc);
                        } else if (iframe.contentDocument) {
                            console.log('尝试通过contentDocument访问iframe内容');
                            const iframeDoc = iframe.contentDocument;
                            processIframeVideos(iframeDoc);
                        } else {
                            console.log('无法访问iframe内容，可能是跨域限制');
                        }
                    } catch (e) {
                        console.error('访问iframe内容时出错:', e);
                    }
                });
            }
        }

        // 处理iframe中的视频
        function processIframeVideos(iframeDoc) {
            if (!iframeDoc) {
                console.log('iframe文档为空');
                return;
            }

            const iframeVideos = iframeDoc.querySelectorAll('video');

            if (iframeVideos.length > 0) {
                console.log(`在iframe中找到 ${iframeVideos.length} 个视频元素`);

                iframeVideos.forEach(video => {
                    // 移除之前可能存在的事件监听器
                    video.removeEventListener('ended', window.videoEndHandler);

                    // 添加事件监听器
                    video.addEventListener('ended', window.videoEndHandler);
                    console.log('已为iframe视频添加结束事件监听器');

                    // 监听视频进度
                    monitorVideoProgress(video);
                });
            } else {
                console.log('在iframe中未找到视频元素');
            }
        }

        // 监听视频进度，处理视频结束但未触发ended事件的情况
        function monitorVideoProgress(video) {
            // 创建进度监听器
            const progressInterval = setInterval(() => {
                if (!video || video.paused || video.ended || !video.duration) {
                    return;
                }

                // 计算进度百分比
                const progress = Math.floor((video.currentTime / video.duration) * 100);

                // 如果进度接近100%（大于等于99%），认为视频已结束
                if (progress >= 99) {
                    console.log('视频进度达到99%以上，视为已结束');
                    clearInterval(progressInterval);

                    // 防止重复触发
                    if (window.qh.isNavigating) {
                        console.log('导航已在进行中，忽略视频进度事件');
                        return;
                    }

                    // 延迟一秒后切换到下一课
                    setTimeout(() => {
                        navigateToNextVideo();
                    }, 1000);
                }
            }, 2000); // 每2秒检查一次

            // 保存interval ID，以便在需要时清除
            if (!window.qh.progressIntervals) {
                window.qh.progressIntervals = [];
            }
            window.qh.progressIntervals.push(progressInterval);
        }

        // 初始查找视频
        findAndListenVideos();

        // 使用MutationObserver监听DOM变化，处理动态加载的视频
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    // 检查是否添加了视频元素或iframe
                    const hasNewVideo = Array.from(mutation.addedNodes).some(node =>
                        node.nodeName === 'VIDEO' ||
                        (node.querySelectorAll && node.querySelectorAll('video').length > 0) ||
                        node.nodeName === 'IFRAME' ||
                        (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)
                    );

                    if (hasNewVideo) {
                        console.log('检测到新的视频元素或iframe被添加到DOM，重新查找视频');
                        findAndListenVideos();
                    }
                }
            });
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };

        // 开始观察
        observer.observe(document.body, config);

        // 保存observer，以便在需要时断开连接
        window.qh.videoObserver = observer;
    }

    // 导航到上一个视频
    function navigateToPrevVideo() {
        console.log('导航到上一个视频');

        // 防止重复触发
        if (window.qh.isNavigating) {
            console.log('导航已在进行中，忽略本次请求');
            return;
        }

        // 设置导航状态
        window.qh.isNavigating = true;

        try {
            // 尝试查找原始的上一课按钮
            const originalPrevButton = document.querySelector('.prev-next .btns:first-child');

            if (originalPrevButton) {
                console.log('找到原始上一课按钮，模拟点击');

                // 模拟点击原始按钮
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                originalPrevButton.dispatchEvent(clickEvent);
            } else {
                console.log('未找到原始上一课按钮，尝试其他方法');

                // 尝试使用window.prev函数（如果存在）
                if (typeof window.prev === 'function') {
                    console.log('使用window.prev函数');
                    window.prev();
                }
                // 尝试使用脚本中的导航函数
                else if (typeof window.navigateToPrevCourse === 'function') {
                    console.log('使用脚本导航函数navigateToPrevCourse');
                    window.navigateToPrevCourse();
                }
                // 尝试查找其他可能的上一课按钮
                else {
                    console.log('尝试查找其他可能的上一课按钮');

                    // 尝试查找包含"上一"文本的按钮或链接
                    const prevElements = Array.from(document.querySelectorAll('a, button, div')).filter(el =>
                        el.textContent && el.textContent.includes('上一') &&
                        getComputedStyle(el).display !== 'none'
                    );

                    if (prevElements.length > 0) {
                        console.log('找到可能的上一课元素，点击第一个');
                        prevElements[0].click();
                    } else {
                        console.log('未找到任何可能的上一课元素');
                        alert('无法导航到上一课，请手动切换');
                    }
                }
            }
        } catch (e) {
            console.error('导航到上一课出错:', e);
        }

        // 5秒后重置导航状态
        setTimeout(() => {
            window.qh.isNavigating = false;
        }, 5000);
    }

    // 导航到上一课的兼容函数（与UI模块保持一致）
    function navigateToPrevCourse() {
        console.log('[视频导航] 调用 navigateToPrevCourse (兼容函数)');
        navigateToPrevVideo();
    }

    // 导航到下一个视频
    function navigateToNextVideo() {
        console.log('导航到下一个视频');

        // 防止重复触发
        if (window.qh.isNavigating) {
            console.log('导航已在进行中，忽略本次请求');
            return;
        }

        // 设置导航状态
        window.qh.isNavigating = true;

        try {
            // 尝试查找原始的下一课按钮
            const originalNextButton = document.querySelector('.prev-next .btns:last-child');

            if (originalNextButton) {
                console.log('找到原始下一课按钮，模拟点击');

                // 模拟点击原始按钮
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                originalNextButton.dispatchEvent(clickEvent);
            } else {
                console.log('未找到原始下一课按钮，尝试其他方法');

                // 尝试使用window.next函数（如果存在）
                if (typeof window.next === 'function') {
                    console.log('使用window.next函数');
                    window.next();
                }
                // 尝试使用脚本中的导航函数
                else if (typeof window.navigateToNextCourse === 'function') {
                    console.log('使用脚本导航函数navigateToNextCourse');
                    window.navigateToNextCourse();
                }
                // 尝试查找其他可能的下一课按钮
                else {
                    console.log('尝试查找其他可能的下一课按钮');

                    // 尝试查找包含"下一"文本的按钮或链接
                    const nextElements = Array.from(document.querySelectorAll('a, button, div')).filter(el =>
                        el.textContent && el.textContent.includes('下一') &&
                        getComputedStyle(el).display !== 'none'
                    );

                    if (nextElements.length > 0) {
                        console.log('找到可能的下一课元素，点击第一个');
                        nextElements[0].click();
                    } else {
                        console.log('未找到任何可能的下一课元素');
                        alert('无法导航到下一课，请手动切换');
                    }
                }
            }
        } catch (e) {
            console.error('导航到下一课出错:', e);
        }

        // 5秒后重置导航状态
        setTimeout(() => {
            window.qh.isNavigating = false;
        }, 5000);
    }

    // 导航到下一课的兼容函数（与UI模块保持一致）
    function navigateToNextCourse() {
        console.log('[视频导航] 调用 navigateToNextCourse (兼容函数)');
        navigateToNextVideo();
    }

    // 导出函数
    window.navigateToPrevVideo = navigateToPrevVideo;
    window.navigateToNextVideo = navigateToNextVideo;
    window.navigateToPrevCourse = navigateToPrevCourse;
    window.navigateToNextCourse = navigateToNextCourse;
})();
