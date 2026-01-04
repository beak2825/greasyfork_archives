// ==UserScript==
// @name         山东省大数据工程专业技术人员专业课自动看课
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自动遍历视频列表，找到第一个未完成的视频，修改其li标签class并模拟点击，引入短时延迟以避免循环卡顿，并连续播放直到全部完成。自动处理alert弹窗。
// @match        http://119.148.160.19:18006/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542503/%E5%B1%B1%E4%B8%9C%E7%9C%81%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/542503/%E5%B1%B1%E4%B8%9C%E7%9C%81%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 立即重写 alert 函数，确保最早生效 ---
    const originalAlert = window.alert;
    window.alert = function(message) {
        console.log('🚫 alert 弹窗被拦截，内容：', message);
        return true; // 模拟点击“确定”
    };

    // --- 配置项 ---
    // 用于标记视频已完成的文本。现在使用不带括号的“已完成”。
    const COMPLETED_PREFIX = '已完成';
    // 目标 class 名称，用于触发视频加载。
    const TARGET_CLASS = 'lesson-select';
    // 脚本检查视频状态或寻找下一个视频的频率（毫秒）。
    const MAIN_CHECK_INTERVAL_MS = 3000; // 3秒
    // 脚本在页面加载完毕后，额外等待的秒数（毫秒）。
    const INITIAL_DELAY_MS = 5000; // 5秒
    // 在激活一个视频后（设置class并点击），等待多长时间再允许主循环重新检查列表（毫秒）。
    // 这给视频播放器留出加载和开始的时间，避免快速切换。
    const ACTIVATION_COOLDOWN_MS = 3000; // 3秒冷却时间

    // --- 内部状态变量 ---
    let mainLoopIntervalId = null;
    let currentVideoPlayingIndex = -1;
    let isActivatingVideo = false; // 新增标志，防止在激活视频时重复触发

    /**
     * 查找列表中**第一个**未完成的视频，并修改其 class 属性，然后模拟点击来触发播放。
     * @returns {boolean} 如果找到并处理了未完成视频，返回 true；否则（所有视频都已完成）返回 false。
     */
    function findAndActivateNextUnfinishedVideo() {
        // 如果我们正在激活一个视频，就暂停查找，等待冷却期结束
        if (isActivatingVideo) {
            console.log('⏳ 正在激活视频冷却中，暂停查找下一个视频...');
            return true; // 假装已激活，但实际是等待冷却
        }

        console.log('🤖 正在寻找下一个未完成的视频...');

        const ulControl = document.querySelector('ul.ul-control');
        if (!ulControl) {
            console.warn('⚠️ 未找到 <ul class="ul-control"> 元素。请检查选择器是否正确或页面是否已完全加载。');
            return false;
        }

        const allVideoListItems = ulControl.querySelectorAll('li');
        if (allVideoListItems.length === 0) {
            console.warn('⚠️ 在 <ul class="ul-control"> 中未找到任何 <li> 元素。请检查选择器。');
            return false;
        }

        for (let i = 0; i < allVideoListItems.length; i++) {
            const liElement = allVideoListItems[i];
            const spanElement = liElement.querySelector('span');

            if (spanElement && spanElement.innerText) {
                const videoTitle = spanElement.innerText.trim();

                // 检查视频标题是否**不包含**“已完成”
                if (!videoTitle.includes(COMPLETED_PREFIX)) { // <-- 已修改为 includes
                    console.log(`✅ 找到未完成视频: "${videoTitle}" (索引: ${i})。`);

                    // 检查这是否就是我们当前正在处理的视频，并且它已经包含了目标 class。
                    // 如果是，表示它已经在加载或播放中，无需重复操作。
                    if (i === currentVideoPlayingIndex && liElement.classList.contains(TARGET_CLASS)) {
                        console.log(`ℹ️ 视频 "${videoTitle}" (索引: ${i}) 正在处理中（已包含 ${TARGET_CLASS}）。等待其完成。`);
                        return true;
                    }

                    // --- 核心激活逻辑 ---
                    // 设置激活视频标志，阻止重复触发
                    isActivatingVideo = true;
                    currentVideoPlayingIndex = i; // 更新当前正在处理的视频索引。

                    console.log(`➡️ 尝试修改所有 <li> 标签的 class，并将当前 <li> 的 class 设置为 "${TARGET_CLASS}"。`);
                    // 首先移除所有其他 li 的 TARGET_CLASS，确保只有一个被选中
                    allVideoListItems.forEach(item => {
                        if (item !== liElement && item.classList.contains(TARGET_CLASS)) {
                            item.classList.remove(TARGET_CLASS);
                        }
                    });
                    liElement.className = TARGET_CLASS; // 这将替换当前 <li> 上原有的所有 class

                    console.log(`➡️ 模拟点击该 <li> 标签。`);
                    liElement.click();
                    console.log("我已点击" + liElement);

                    // 在成功激活视频后，设置一个冷却时间，防止 mainLoop 立即再次触发查找
                    setTimeout(() => {
                        isActivatingVideo = false; // 冷却时间结束后，允许再次查找
                        console.log('✅ 视频激活冷却结束，允许下次循环查找...');
                    }, ACTIVATION_COOLDOWN_MS);

                    return true; // 找到并处理了一个未完成视频，立即退出循环。
                }
            }
        }

        console.log('🎉 所有视频已全部完成！脚本将停止运行。');
        clearInterval(mainLoopIntervalId);
        currentVideoPlayingIndex = -1;
        return false;
    }

    /**
     * 处理当前页面上存在的视频播放器元素：静音、播放，并设置播放结束监听器。
     */
    function handleVideoPlayer() {
        const videoElement = document.querySelector('video');

        if (videoElement) {
            console.log('🎥 检测到视频播放器，正在管理播放...');

            // 确保视频静音，这是自动播放的关键
            if (!videoElement.muted) {
                videoElement.muted = true;
                console.log('🔇 视频已静音。');
            }

            // 如果视频处于暂停状态，尝试播放它。
            if (videoElement.paused) {
                 videoElement.play()
                    .then(() => {
                        console.log('▶️ 视频已开始/恢复播放。');
                    })
                    .catch(error => {
                        console.warn('⚠️ 视频播放被浏览器阻止或失败：', error);
                        // 如果播放失败，立即重置索引并尝试查找下一个视频，防止卡死。
                        currentVideoPlayingIndex = -1;
                        isActivatingVideo = false; // 允许立即查找下一个
                        findAndActivateNextUnfinishedVideo();
                    });
            }

            // 设置视频播放结束的监听器。
            if (videoElement.__gm_onended_listener) {
                videoElement.removeEventListener('ended', videoElement.__gm_onended_listener);
            }
            videoElement.__gm_onended_listener = () => {
                console.log('⏹️ 当前视频播放结束。');
                // 视频播放结束后，给网站留出足够的时间来更新 DOM。
                setTimeout(() => {
                    currentVideoPlayingIndex = -1;
                    isActivatingVideo = false; // 允许立即查找下一个
                    findAndActivateNextUnfinishedVideo();
                }, 8000);
            };
            videoElement.addEventListener('ended', videoElement.__gm_onended_listener);

        } else {
            console.log('🔍 当前页面未找到视频播放器元素。');
            currentVideoPlayingIndex = -1;
            isActivatingVideo = false; // 如果没有视频元素，也允许再次查找
        }
    }

    /**
     * 主循环函数：**始终优先**查找并激活下一个未完成的视频，然后管理视频播放器。
     */
    function mainLoop() {
        // 如果当前正在激活一个视频（处于冷却期），或者没有未完成视频需要处理，则不执行 handleVideoPlayer。
        // findAndActivateNextUnfinishedVideo 内部会处理 isActivatingVideo 的逻辑。
        const videoActivated = findAndActivateNextUnfinishedVideo();

        if (videoActivated) {
            handleVideoPlayer();
        }
    }

    // --- 脚本初始化 ---
    window.addEventListener('load', function() {
        console.log('🚀 页面已加载完毕。脚本将在 ' + (INITIAL_DELAY_MS / 1000) + ' 秒后开始执行主要逻辑...');
        setTimeout(() => {
            console.log('🚀 油猴脚本启动成功！开始定期检查并自动播放视频...');
            // 首次调用主循环，立即开始处理。
            mainLoop();
            mainLoopIntervalId = setInterval(mainLoop, MAIN_CHECK_INTERVAL_MS);
        }, INITIAL_DELAY_MS);
    });

})();