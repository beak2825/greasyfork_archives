// ==UserScript==
// @name         Bilibili 列表随机播放
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动获取播放列表并随机播放视频
// @author       0808
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524606/Bilibili%20%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/524606/Bilibili%20%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /** 配置选项 **/
    const CONFIG = {
        randomButtonClass: "randomBtn",
        activeClass: "startRandom",
        scrollDelay: 200,
        timeoutDelay: 5000,
        waitTime: 2000,
        excludeLastX: 0, // 忽略最后的 X 个视频
        maxScrollAttempts: 1, // 滚动到顶部或底部后再滚动 X 次
        buttonText: "随机",
        logPrefix: "[列表随机播放]", // 日志前缀
        colorEnable: 'rgba(0,174,236, 1)',
        colorDisable: 'rgba(0,174,236, 0.4)',
        colorHover: 'rgba(0,174,236, 0.7)',
        localStorageKey: "randomVideoEnabled",
        videoSelectorList: [
            "ul.list-box > li > a > div.clickitem",
            ".base-video-sections-v1 .video-section-list .video-episode-card",
            "#playlist-video-action-list .action-list-inner .action-list-item .title",
        ],
        scrollContainerSelector: "#playlist-video-action-list",
        targetElementSelector: 'div.list-playway-btn.list-tool-btn[title="列表循环"]',
    };

    /** 初始化脚本 **/
    const state = {
        isRandomEnabled: getLocalStorage() === 1,
        videoList: [],
        isScrolling: false, // 添加滚动标志位
    };

    /** 封装 console.log，自动添加前缀 **/
    function log(message) {
        console.log(`${CONFIG.logPrefix} ${message}`);
    }

    setTimeout(() => {
        init();
    }, CONFIG.timeoutDelay);

    /** 主初始化函数 **/
    function init() {
        getVideoList();
        createRandomButton();
        if (state.isRandomEnabled) startRandomPlayback();
    }

    /** 创建随机播放按钮 **/
    function createRandomButton() {
        // 找到目标元素
        const targetElement = document.querySelector(CONFIG.targetElementSelector);

        if (targetElement) {
            // 创建按钮
            const button = document.createElement("button");
            button.textContent = CONFIG.buttonText;
            button.className = `${CONFIG.randomButtonClass} ${state.isRandomEnabled ? CONFIG.activeClass : ""}`;

            // 设置按钮样式
            button.style.backgroundColor = state.isRandomEnabled ? CONFIG.colorEnable : CONFIG.colorDisable;
            button.style.transition = 'background-color 0.3s';
            button.style.color = '#ffffff';
            button.style.fontSize = '15px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '10px';
            button.style.border = '0px solid #ffffff';
            button.style.paddingLeft = '10px';
            button.style.paddingRight = '10px';
            button.style.marginBottom = '2px';
            button.style.marginLeft = '10px'; // 添加左边距，与目标元素保持一定距离

            // 添加悬停效果
            button.addEventListener("mouseover", function () {
                button.style.backgroundColor = CONFIG.colorHover;
            });
            button.addEventListener("mouseout", function () {
                button.style.backgroundColor = state.isRandomEnabled ? CONFIG.colorEnable : CONFIG.colorDisable;
            });

            // 添加点击事件
            button.addEventListener("click", toggleRandomPlayback);

            // 将按钮插入到目标元素后面
            targetElement.insertAdjacentElement('afterend', button);
        } else {
            log("未找到目标元素，按钮创建失败");
        }
    }

    /** 切换随机播放状态 **/
    function toggleRandomPlayback(event) {
        event.stopPropagation();
        const button = event.target;

        state.isRandomEnabled = !state.isRandomEnabled;

        if (state.isRandomEnabled) {
            log("已开启随机播放");
            button.classList.add(CONFIG.activeClass);
            button.style.backgroundColor = CONFIG.colorEnable;
            setLocalStorage(1);
            startRandomPlayback();
            // 如果正在滚动，则忽略点击事件
            if (!state.isScrolling) {
                getVideoList();
            }
        } else {
            log("已关闭随机播放");
            button.classList.remove(CONFIG.activeClass);
            button.style.backgroundColor = CONFIG.colorDisable;
            setLocalStorage(0);
        }
    }

    /** 开始随机播放功能 **/
    function startRandomPlayback() {
        const videoEl = document.querySelector("div.bpx-player-video-wrap > video");
        if (videoEl) {
            videoEl.addEventListener("ended", handleVideoEnd);
        }
    }

    /** 视频播放结束时的处理 **/
    function handleVideoEnd(event) {
        if (state.isRandomEnabled) {
            event.stopImmediatePropagation();
            playNextVideo();
        }
    }

    /** 随机播放下一个视频 **/
    function playNextVideo() {
        const availableVideos = state.videoList.slice(0, state.videoList.length - CONFIG.excludeLastX); // 排除最后X个视频

        if (availableVideos.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableVideos.length);
            const nextVideo = availableVideos[randomIndex];
            if (nextVideo) {
                nextVideo.click();
                log(`当前正在随机播放第 ${randomIndex + 1} / ${state.videoList.length - CONFIG.excludeLastX} 个视频： [${nextVideo.title}]`);
            }
        } else {
            log("没有可用的视频进行随机播放");
        }
    }

    /** 获取视频列表 **/
    function getVideoList() {
        const container = document.querySelector(CONFIG.scrollContainerSelector);
        if (container) {
            simulateScroll(container, () => {
                for (const selector of CONFIG.videoSelectorList) {
                    const videos = Array.from(document.querySelectorAll(selector));
                    if (videos.length > 0) {
                        state.videoList = videos;
                        log(`视频列表更新成功，读取到 ${state.videoList.length - CONFIG.excludeLastX} 个视频`);
                        return;
                    }
                }
                log("获取视频列表失败,请刷新重试");
            });
        }
    }

    /** 模拟滚动 **/
    function simulateScroll(container, callback) {
        // 设置滚动标志位
        state.isScrolling = true;
        log("开始滚动");

        let scrollAttemptsTop = 0; // 向上滚动次数计数器
        let scrollAttemptsBottom = 0; // 向下滚动次数计数器

        function scrollToTop(container, onComplete) {
            const tolerance = 2; // 容许的误差
            const interval = setInterval(() => {
                const { scrollTop } = container;

                // 检查是否接近顶部
                if (scrollTop <= tolerance) {
                    log("已到达顶部");
                    clearInterval(interval);

                    // 如果未达到最大滚动次数，继续滚动
                    if (scrollAttemptsTop < CONFIG.maxScrollAttempts) {
                        scrollAttemptsTop++;
                        log(`滚动到顶部，正在进行第 ${scrollAttemptsTop} 次滚动`);
                        setTimeout(() => scrollToTop(container, onComplete), CONFIG.waitTime);
                    } else {
                        // 达到最大滚动次数，结束滚动
                        onComplete();
                    }
                } else {
                    // 动态调整滚动步长，避免跳动
                    container.scrollTop -= container.clientHeight / 4 * 3;
                }
            }, CONFIG.scrollDelay);
        }

        function scrollToBottom(container, onComplete) {
            const tolerance = 2; // 容许的误差
            const interval = setInterval(() => {
                const { scrollTop, scrollHeight, clientHeight } = container;
                const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

                // 检查是否接近底部
                if (distanceToBottom <= tolerance) {
                    log("已到达底部");
                    clearInterval(interval);

                    // 如果未达到最大滚动次数，继续滚动
                    if (scrollAttemptsBottom < CONFIG.maxScrollAttempts) {
                        scrollAttemptsBottom++;
                        log(`滚动到底部，正在进行第 ${scrollAttemptsBottom} 次滚动`);
                        setTimeout(() => scrollToBottom(container, onComplete), CONFIG.waitTime);
                    } else {
                        // 达到最大滚动次数，结束滚动
                        onComplete();
                    }
                } else {
                    // 动态调整滚动步长，避免跳动
                    container.scrollTop += clientHeight / 4 * 3;
                }
            }, CONFIG.scrollDelay);
        }

        // 先滚动到顶部
        scrollToTop(container, () => {
            // 滚动到顶部完成后，再滚动到底部
            setTimeout(() => {
                scrollToBottom(container, () => {
                    // 滚动结束后清除标志位
                    state.isScrolling = false;
                    log("滚动结束");
                    callback();
                });
            }, CONFIG.waitTime);
        });
    }

    /** 本地存储操作 **/
    function setLocalStorage(value) {
        localStorage.setItem(CONFIG.localStorageKey, value);
    }

    function getLocalStorage() {
        return parseInt(localStorage.getItem(CONFIG.localStorageKey), 10) || 0;
    }
})();