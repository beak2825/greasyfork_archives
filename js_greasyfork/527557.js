// ==UserScript==
// @name         学习通自动刷视频
// @version      1.0
// @description  学习通自动播放、防暂停（无视答题弹窗）、自动下一节功能且跳过章节测试
// @author       hu89h
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1398926
// @downloadURL https://update.greasyfork.org/scripts/527557/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527557/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局变量
    let video = null;
    let isAutoNextEnabled = false;
    let lastVideoUrl = "";
    let retryCount = 0; // 新增重试计数器
    const MAX_RETRY = 3; // 最大重试次数
    // UI样式
    const style = document.createElement('style');
    style.innerHTML = `
        .h_Bbutton {
            transition: all 0.3s linear;
            position: fixed;
            padding: 10px;
            border: none;
            background: linear-gradient(45deg, #0219f2, #c804ea);
            color: #fffae5;
            border-radius: 5px;
            box-shadow: 8px 4px 10px 3px #ccc;
            cursor: pointer;
            font-weight: bold;
            width: 120px;
            z-index: 10000;
        }
        .h_Bbutton:active {
            transform: translateY(2px);
        }
        .h_Bbutton:hover {
            opacity: 0.8;
        }
        .bottom_text {
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #51f;
            color: #fffae5;
            padding: 3px 5px;
            font-size: 12px;
            border-radius: 3px;
            z-index: 10000;
        }
    `;
    document.head.appendChild(style);

    // 创建防暂停按钮
    const stopPauseButton = document.createElement('button');
    stopPauseButton.className = 'h_Bbutton';
    stopPauseButton.innerHTML = '防暂停';
    stopPauseButton.style.bottom = '30px';
    stopPauseButton.style.left = '20px';
    document.body.appendChild(stopPauseButton);

    // 创建自动下一节按钮
    const autoNextButton = document.createElement('button');
    autoNextButton.className = 'h_Bbutton';
    autoNextButton.innerHTML = '自动下一节';
    autoNextButton.style.bottom = '80px';
    autoNextButton.style.left = '20px';
    document.body.appendChild(autoNextButton);

    // 状态显示
    const statusText = document.createElement('div');
    statusText.className = 'bottom_text';
    statusText.innerText = '脚本已加载';
    document.body.appendChild(statusText);

    // 安全执行函数包装器
    function safeExecute(fn) {
        return function() {
            try {
                fn();
                return true;
            } catch(e) {
                console.error('执行错误:', e);
                statusText.innerText = '错误: ' + e.message;
                return false;
            }
        };
    }

    // 监听控制台消息
    function setupConsoleObserver() {
        // 保存原始的console.log方法
        const originalLog = console.log;

        // 重写console.log以拦截消息
        console.log = function() {
            // 调用原始方法，保持正常打印
            originalLog.apply(console, arguments);

            // 检查是否是目标消息
            const message = Array.from(arguments).join(' ');
            if (message.includes("学习是一种信仰") || message.includes("v9")) {
                console.log("检测到页面动态加载，尝试重新初始化视频...");
                statusText.innerText = '检测到页面变化，重新初始化...';

                // 延迟执行初始化，给页面一些时间加载
                setTimeout(() => {
                    initVideo();
                }, 2000);
            }
        };
    }

    // 监听URL变化（另一种检测方式）
    function setupUrlChangeObserver() {
        // 创建一个定时器检查URL变化
        setInterval(() => {
            try {
                // 尝试获取当前播放的视频URL
                const currentIframe = document.querySelectorAll('iframe')[0];
                if (!currentIframe) return;

                const innerIframe = currentIframe.contentWindow.document.querySelectorAll('iframe')[0];
                if (!innerIframe) return;

                const currentVideo = innerIframe.contentWindow.document.querySelector('video');
                if (!currentVideo) return;

                const currentSrc = currentVideo.src || currentVideo.currentSrc;

                // 如果视频URL变化，说明已切换到新视频
                if (currentSrc && currentSrc !== lastVideoUrl) {
                    console.log("检测到视频URL变化，重新初始化...");
                    statusText.innerText = '检测到新视频，重新初始化...';
                    lastVideoUrl = currentSrc;

                    // 重新初始化视频
                    initVideo();
                }
            } catch (e) {
                console.error("URL变化检测失败", e);
            }
        }, 3000);
    }

    // 监听DOM变化（用于检测视频播放器的变化）
    function setupDomChangeObserver() {
        // 创建一个MutationObserver实例，在DOM变化时检查视频
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 节点添加，可能是新视频加载
                    setTimeout(() => {
                        const currentVideo = getVideoElement();
                        if (currentVideo && currentVideo !== video) {
                            console.log("检测到DOM变化，发现新视频元素");
                            statusText.innerText = '检测到DOM变化，重新初始化...';
                            initVideo();
                        }
                    }, 1000);
                }
            }
        });

        // 开始观察document的变化，包括子树
        observer.observe(document, { childList: true, subtree: true });
    }

    // 获取视频元素（抽取为独立函数方便复用）
    function getVideoElement() {
        try {
            let iframe = document.querySelectorAll('iframe')[0];
            if (!iframe) return null;

            let iframeDoc = iframe.contentWindow.document;
            let innerIframe = iframeDoc.querySelectorAll('iframe')[0];
            if (!innerIframe) return null;

            let innerIframeDoc = innerIframe.contentWindow.document;
            return innerIframeDoc.querySelector('video');
        } catch (e) {
            console.error("获取视频元素失败", e);
            return null;
        }
    }

    // 初始化视频
    function initVideo() {
        try {
            let iframe = document.querySelectorAll('iframe')[0];
            if (!iframe) throw new Error('找不到主iframe');

            let iframeDoc = iframe.contentWindow.document;
            let innerIframe = iframeDoc.querySelectorAll('iframe')[0];
            if (!innerIframe) throw new Error('找不到内部iframe');

            let innerIframeDoc = innerIframe.contentWindow.document;

            // 尝试点击播放按钮
            let playButton = innerIframeDoc.querySelector('.vjs-big-play-button');
            if (playButton) {
                console.log("发现播放按钮，点击播放...");
                playButton.click();
            }

            // 获取视频元素
            video = innerIframeDoc.querySelector('video');

            if (video) {
                console.log("视频已加载");
                statusText.innerText = '视频已加载';

                // 保存当前视频URL
                lastVideoUrl = video.src || video.currentSrc;

                // 启用防暂停
                enableStopPause();

                // 如果之前启用了自动下一节，则继续启用
                if (isAutoNextEnabled) {
                    enableAutoNext(true);
                }

                // 自动播放（静音以避开浏览器限制）
                video.muted = true;
                video.play().then(() => {
                    statusText.innerText = '视频已自动播放';
                }).catch(e => {
                    console.error('自动播放失败:', e);
                    statusText.innerText = '自动播放失败，请手动点击';
                });

                return true;
            } else {
                console.log("未找到视频元素");
                statusText.innerText = '未找到视频，自动跳转下一节';
                clickNextChapter();
                return false;
            }
        } catch (e) {
            console.error("初始化视频失败", e);
            statusText.innerText = '初始化失败: ' + e.message;
            return false;
        }
    }
// 新增通用下一节点击方法
function clickNextChapter() {
    let nextButtons = document.querySelectorAll('.nextChapter');
    if (nextButtons.length > 0) {
        nextButtons[0].click();
        console.log('已点击通用下一节按钮');
        statusText.innerText = '已跳转下一节，尝试重新初始化...';

        // 延迟后重新初始化
        setTimeout(() => {
            initVideo();
        }, 3000);
    } else {
        console.warn('找不到通用的下一节按钮');
        statusText.innerText = '错误：找不到下一节按钮';
    }
}

    // 防暂停功能
    function enableStopPause() {
        if (!video) return false;

        // 重写pause方法
        video.pause = function() {
            console.log('暂停被阻止');
            statusText.innerText = '已阻止视频暂停';
        };

        stopPauseButton.style.background = 'linear-gradient(45deg, #02c2f2, #04ea1c)';
        stopPauseButton.innerHTML = '防暂停已启用';
        return true;
    }

    // 自动下一节功能
    function enableAutoNext(keepState = false) {
        if (!video) return false;

        if (!keepState) {
            isAutoNextEnabled = !isAutoNextEnabled;
        }

        if (isAutoNextEnabled) {
            // 先移除之前可能的监听器，避免重复
            video.removeEventListener('ended', clickNextVideo);
            // 添加视频结束事件监听
            video.addEventListener('ended', clickNextVideo);
            autoNextButton.style.background = 'linear-gradient(45deg, #02c2f2, #04ea1c)';
            autoNextButton.innerHTML = '自动下一节已启用';
            statusText.innerText = '自动下一节已启用';
        } else {
            // 移除视频结束事件监听
            video.removeEventListener('ended', clickNextVideo);
            autoNextButton.style.background = 'linear-gradient(45deg, #0219f2, #c804ea)';
            autoNextButton.innerHTML = '自动下一节';
            statusText.innerText = '自动下一节已禁用';
        }

        return true;
    }

    // 点击下一节视频
        function clickNextVideo() {
        // 优先查找新版本"下一节"按钮
        let nextButton = document.querySelector('a.nextChapter');

        // 如果找不到则尝试旧版按钮
        if (!nextButton) {
            nextButton = document.getElementById('prevNextFocusNext');
        }

        if (nextButton) {
            nextButton.click();
            console.log("已点击下一节按钮");
            statusText.innerText = '正在跳转到下一节...';
            retryCount = 0; // 重置计数器

            // 增强型初始化检测
            const initAfterJump = () => {
                if (!initVideo()) {
                    if (retryCount < MAX_RETRY) {
                        retryCount++;
                        console.log(`初始化失败，正在第${retryCount}次重试...`);
                        statusText.innerText = `正在第${retryCount}次尝试加载...`;
                        setTimeout(initAfterJump, 3000);
                    } else {
                        console.log("超过最大重试次数，尝试强制跳转");
                        statusText.innerText = '内容加载异常，建议手动操作';
                        // 强制跳转作为最后手段
                        document.querySelector('a.nextChapter')?.click();
                    }
                }
            };

            // 首次延迟检测
            setTimeout(initAfterJump, 5000);
        } else {
            statusText.innerText = '未找到有效的下一节按钮';
            console.error('未找到下一节按钮');
            // 尝试通过课程结构跳转
            tryCourseStructureJump();
        }
    }

    // 新增课程结构跳转方法
    function tryCourseStructureJump() {
        // 查找课程目录中的已完成章节
        const courseItems = document.querySelectorAll('.chapter_item');
        if (courseItems.length > 0) {
            // 查找最近未完成的章节
            const currentItem = Array.from(courseItems).find(item =>
                item.querySelector('.posCatalog_icon')?.classList.contains('currents')
            );

            if (currentItem) {
                const nextItem = currentItem.nextElementSibling;
                if (nextItem) {
                    const link = nextItem.querySelector('a');
                    if (link) {
                        console.log("通过课程目录跳转到下一节");
                        link.click();
                        statusText.innerText = '通过目录跳转中...';
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 绑定按钮事件
    stopPauseButton.onclick = safeExecute(() => {
        if (!video) {
            if (!initVideo()) {
                alert('请确保视频已加载');
                return;
            }
        }
        enableStopPause();
    });

    autoNextButton.onclick = safeExecute(() => {
        if (!video) {
            if (!initVideo()) {
                alert('请确保视频已加载');
                return;
            }
        }
        enableAutoNext();
    });

    // 初始化所有监听器
    function initAllObservers() {
        // 设置控制台监听
        setupConsoleObserver();
        // 设置URL变化监听
        setupUrlChangeObserver();
        // 设置DOM变化监听
        setupDomChangeObserver();
    }

    // 页面加载完成后自动初始化
    const initInterval = setInterval(() => {
        if (initVideo()) {
            clearInterval(initInterval);
            console.log('视频初始化成功');
            statusText.innerText = '视频初始化成功';
            initAllObservers();
        } else if (retryCount >= MAX_RETRY) {
            clearInterval(initInterval);
            statusText.innerText = '初始化失败，请检查页面';
        }
    }, 2000);

    // 立即初始化观察器（不等待视频加载）
    initAllObservers();
})();