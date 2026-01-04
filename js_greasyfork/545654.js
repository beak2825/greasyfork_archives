// ==UserScript==
// @name         B站视频恰饭广告跳过
// @namespace    https://space.bilibili.com/508469689
// @version      0.8
// @description  基于弹幕的指路而制作的广告跳过器
// @author       SerenMaze
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545654/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%81%B0%E9%A5%AD%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/545654/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%81%B0%E9%A5%AD%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const modalStyles = `
        #bilibili-danmaku-seeker-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
        }
        #bilibili-danmaku-seeker-modal-content {
            background-color: #fff;
            margin: 15% auto;
            padding: 0;
            border: none;
            border-radius: 8px;
            width: 80%;
            max-width: 500px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
            font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            overflow: hidden;
        }
        #bilibili-danmaku-seeker-modal-header {
            padding: 16px 20px;
            background-color: #f6f6f6;
            color: #212121;
            font-size: 16px;
            font-weight: 500;
            border-bottom: 1px solid #e5e9ef;
            border-radius: 8px 8px 0 0;
        }
        #bilibili-danmaku-seeker-modal-body {
            padding: 0;
            max-height: 400px;
            overflow-y: auto;
        }
        .bilibili-danmaku-seeker-option {
            padding: 12px 20px;
            cursor: pointer;
            border-bottom: 1px solid #e5e9ef;
            transition: background-color 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bilibili-danmaku-seeker-option:hover {
            background-color: #f4f5f7;
        }
        .bilibili-danmaku-seeker-option:last-child {
            border-bottom: none;
        }
        .bilibili-danmaku-seeker-time {
            font-weight: bold;
            color: #fb7299;
        }
        .bilibili-danmaku-seeker-text {
            flex-grow: 1;
            margin-left: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #6d757a;
        }
        #bilibili-danmaku-seeker-modal-footer {
            padding: 12px 20px;
            background-color: #f6f6f6;
            text-align: right;
            border-top: 1px solid #e5e9ef;
            border-radius: 0 0 8px 8px;
        }
        .bilibili-danmaku-seeker-button {
            padding: 6px 12px;
            margin-left: 10px;
            border: 1px solid #ccd0d7;
            border-radius: 4px;
            background-color: #fff;
            color: #6d757a;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .bilibili-danmaku-seeker-button:hover {
            background-color: #f4f5f7;
            color: #212121;
        }
        .bilibili-danmaku-seeker-button-primary {
            background-color: #00a1d6;
            border-color: #00a1d6;
            color: white;
        }
        .bilibili-danmaku-seeker-button-primary:hover {
            background-color: #00b5e5;
        }
    `;

    function waitForElm(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            if (timeout > 0) {
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }, timeout);
            }
        });
    }

    function parseTimeString(text) {
        let seconds = -1;
        const originalText = text;

        text = text.replace(/：/g, ':');

        const timeHMSRegex = /(?:\D|^)(\d{1,2}):([0-5]?\d):([0-5]?\d)(?=\D|$)/;
        const hmsMatch = text.match(timeHMSRegex);
        if (hmsMatch) {
            const hours = parseInt(hmsMatch[1], 10);
            const minutes = parseInt(hmsMatch[2], 10);
            const secs = parseInt(hmsMatch[3], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59 && secs >= 0 && secs <= 59) {
                seconds = hours * 3600 + minutes * 60 + secs;
                return { seconds, format: `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}` };
            }
        }

        const timeHMChineseRegex = /(?:\D|^)(\d{1,2})小时([0-5]?\d)分(?=\D|$)/;
        const hmChineseMatch = text.match(timeHMChineseRegex);
        if (hmChineseMatch) {
            const hours = parseInt(hmChineseMatch[1], 10);
            const minutes = parseInt(hmChineseMatch[2], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59) {
                seconds = hours * 3600 + minutes * 60;
                return { seconds, format: `${hours}小时${minutes}分` };
            }
        }

        const timeHMSChineseRegex = /(?:\D|^)(\d{1,2})小时([0-5]?\d)分([0-5]?\d)秒(?=\D|$)/;
        const hmsChineseMatch = text.match(timeHMSChineseRegex);
        if (hmsChineseMatch) {
            const hours = parseInt(hmsChineseMatch[1], 10);
            const minutes = parseInt(hmsChineseMatch[2], 10);
            const secs = parseInt(hmsChineseMatch[3], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59 && secs >= 0 && secs <= 59) {
                seconds = hours * 3600 + minutes * 60 + secs;
                return { seconds, format: `${hours}小时${minutes}分${secs}秒` };
            }
        }

        const timeColonRegex = /(?:\D|^)(\d{1,2}):([0-5]?\d)(?=\D|$)/;
        const colonMatch = text.match(timeColonRegex);
        if (colonMatch) {
            const minutes = parseInt(colonMatch[1], 10);
            const secs = parseInt(colonMatch[2], 10);
            if (minutes >= 0 && minutes <= 99 && secs >= 0 && secs <= 59) {
                 seconds = minutes * 60 + secs;
                 return { seconds, format: `${minutes}:${secs < 10 ? '0' + secs : secs}` };
            }
        }

        const timeChineseRegex = /(?:\D|^)(\d{1,3})分([0-5]?\d)秒(?=\D|$)/;
        const chineseMatch = text.match(timeChineseRegex);
        if (chineseMatch) {
            const minutes = parseInt(chineseMatch[1], 10);
            const secs = parseInt(chineseMatch[2], 10);
            if (minutes >= 0 && minutes <= 99 && secs >= 0 && secs <= 59) {
                seconds = minutes * 60 + secs;
                return { seconds, format: `${minutes}分${secs}秒` };
            }
        }

        return { seconds, format: null };
    }

    let wasPlaying = false;
    let seekerButton = null;
    let seekerButtonWrap = null;

    async function createAndInsertButton() {
        let shareItemWrap = null;
        let attempts = 0;
        const maxAttempts = 50;
        const retryInterval = 300;
        while (!shareItemWrap && attempts < maxAttempts) {
            shareItemWrap = document.querySelector('.toolbar-left-item-wrap:has(.video-share), .toolbar-left-item-wrap:has(.video-share-wrap)');
            if (!shareItemWrap) {
                attempts++;
                console.log(`[B站弹幕跳转] 等待分享按钮容器加载... (尝试 ${attempts}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            }
        }
        if (!shareItemWrap) {
             console.warn("[B站弹幕跳转] 超时：未能找到分享按钮的 .toolbar-left-item-wrap 容器。");
             return;
        }
        console.log("[B站弹幕跳转] 找到分享按钮容器:", shareItemWrap);
        if (document.getElementById('bilibili-danmaku-seeker-button-inline')) {
            console.log("[B站弹幕跳转] 按钮已存在");
            return;
        }
        seekerButton = document.createElement('button');
        seekerButton.id = 'bilibili-danmaku-seeker-button-inline';
        seekerButton.textContent = '⏩';
        seekerButton.title = '根据当前弹幕刷的时间跳过';
        Object.assign(seekerButton.style, {
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            padding: '0 4px',
            margin: '0 0 0 4px',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: '26px',
            height: '26px',
            color: '#9499a0',
            backgroundColor: 'transparent',
            transition: 'color 0.3s, background-color 0.3s',
            verticalAlign: 'middle',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            flexShrink: '0'
        });
        seekerButton.addEventListener('mouseenter', () => {
            seekerButton.style.color = '#61666d';
            seekerButton.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        seekerButton.addEventListener('mouseleave', () => {
            seekerButton.style.color = '#9499a0';
            seekerButton.style.backgroundColor = 'transparent';
        });
        seekerButton.addEventListener('click', showTimeSelectionModal);
        seekerButtonWrap = document.createElement('div');
        seekerButtonWrap.className = 'toolbar-left-item-wrap';
        Object.assign(seekerButtonWrap.style, {
             display: 'inline-flex',
             alignItems: 'center',
             height: '32px',
        });
        seekerButtonWrap.appendChild(seekerButton);
        const toolbarLeftMain = shareItemWrap.parentNode;
        if (toolbarLeftMain && toolbarLeftMain.classList.contains('video-toolbar-left-main')) {
            toolbarLeftMain.insertBefore(seekerButtonWrap, shareItemWrap.nextSibling);
            console.log("[B站弹幕跳转] 按钮已成功插入到分享按钮右侧。");
        } else {
            console.error("[B站弹幕跳转] 无法定位到正确的父容器 .video-toolbar-left-main 来插入按钮。");
            if (shareItemWrap.parentNode) {
                 shareItemWrap.parentNode.insertBefore(seekerButtonWrap, shareItemWrap.nextSibling);
                 console.log("[B站弹幕跳转] Fallback: 按钮已插入到分享按钮容器之后。");
            } else {
                 console.error("[B站弹幕跳转] Fallback 也失败：shareItemWrap 没有 parentNode。");
            }
        }
    }

    async function showTimeSelectionModal() {
        console.log("--- 开始显示时间选择模态框 ---");
        const player = getPlayer();
        if (player) {
            try {
                if (typeof player.paused === 'boolean') {
                    wasPlaying = !player.paused;
                } else if (typeof player.getState === 'function') {
                    wasPlaying = player.getState() === 'PLAYING';
                } else {
                    wasPlaying = true;
                }
                console.log("暂停前播放状态:", wasPlaying);
                if (wasPlaying) {
                    if (typeof player.pause === 'function') {
                        player.pause();
                        console.log("视频已暂停");
                    } else if (player.video && typeof player.video.pause === 'function') {
                        player.video.pause();
                        console.log("视频已暂停 (通过 player.video)");
                    }
                }
            } catch (e) {
                console.warn("暂停视频时出错:", e);
            }
        } else {
            console.warn("暂停视频失败：未找到播放器对象");
        }
        const danmakuContainer = document.querySelector('.bpx-player-row-dm-wrap');
        if (!danmakuContainer) {
            console.warn("未找到弹幕容器 '.bpx-player-row-dm-wrap'");
            alert('未找到弹幕容器，请确保弹幕已开启且正在播放。');
            resumeIfWasPlaying();
            return;
        }
        const danmakuElements = danmakuContainer.querySelectorAll('.bili-danmaku-x-dm');
        console.log(`找到 ${danmakuElements.length} 个弹幕项`);
        if (danmakuElements.length === 0) {
            console.warn("弹幕容器内未找到任何弹幕项 '.bili-danmaku-x-dm'");
            alert('弹幕容器内未找到弹幕项，请确保弹幕已开启且正在播放。');
            resumeIfWasPlaying();
            return;
        }
        const timeEntries = [];
        danmakuElements.forEach((element) => {
            const danmakuText = element.textContent.trim();
            if (danmakuText) {
                const { seconds, format } = parseTimeString(danmakuText);
                if (seconds >= 0 && format) {
                    const displayText = danmakuText.length > 30 ? danmakuText.substring(0, 30) + '...' : danmakuText;
                    timeEntries.push({
                        time: seconds,
                        format: format,
                        element: element,
                        fullText: danmakuText,
                        displayText: displayText
                    });
                }
            }
        });
        if (timeEntries.length === 0) {
            console.log('未在当前屏幕弹幕中找到时间文本');
            alert('当前屏幕上没有找到包含时间的弹幕 (格式示例: XX:XX:XX, XX:XX, X时X分X秒, X分X秒)');
            resumeIfWasPlaying();
            return;
        }
        createAndShowModal(timeEntries);
    }
    function createAndShowModal(timeEntries) {
        if (!document.getElementById('bilibili-danmaku-seeker-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'bilibili-danmaku-seeker-styles';
            styleSheet.innerText = modalStyles;
            document.head.appendChild(styleSheet);
        }
        const modal = document.createElement('div');
        modal.id = 'bilibili-danmaku-seeker-modal';
        const modalContent = document.createElement('div');
        modalContent.id = 'bilibili-danmaku-seeker-modal-content';
        const modalHeader = document.createElement('div');
        modalHeader.id = 'bilibili-danmaku-seeker-modal-header';
        modalHeader.textContent = '请选择要跳转的时间';
        const modalBody = document.createElement('div');
        modalBody.id = 'bilibili-danmaku-seeker-modal-body';
        timeEntries.forEach(entry => {
            const option = document.createElement('div');
            option.className = 'bilibili-danmaku-seeker-option';
            option.dataset.time = entry.time;
            const timeSpan = document.createElement('span');
            timeSpan.className = 'bilibili-danmaku-seeker-time';
            timeSpan.textContent = entry.format;
            const textSpan = document.createElement('span');
            textSpan.className = 'bilibili-danmaku-seeker-text';
            textSpan.textContent = entry.displayText;
            textSpan.title = entry.fullText;
            option.appendChild(timeSpan);
            option.appendChild(textSpan);
            option.addEventListener('click', () => {
                const selectedTime = parseFloat(option.dataset.time);
                console.log(`用户选择了时间: ${entry.format} (${selectedTime}s)`);
                closeModal(modal);
                seekToTimeAndResume(selectedTime);
            });
            modalBody.appendChild(option);
        });
        const modalFooter = document.createElement('div');
        modalFooter.id = 'bilibili-danmaku-seeker-modal-footer';
        const cancelButton = document.createElement('button');
        cancelButton.className = 'bilibili-danmaku-seeker-button';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            console.log("用户取消选择");
            closeModal(modal);
            resumeIfWasPlaying();
        });
        modalFooter.appendChild(cancelButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                console.log("用户点击背景关闭模态框");
                closeModal(modal);
                resumeIfWasPlaying();
            }
        });
        document.body.appendChild(modal);
        modal.style.display = 'block';
        console.log("时间选择模态框已显示");
    }
    function closeModal(modalElement) {
        if (modalElement && modalElement.parentNode) {
            modalElement.parentNode.removeChild(modalElement);
            console.log("时间选择模态框已关闭并移除");
        }
    }
    function getPlayer() {
        let player = null;
        if (window.player && (typeof window.player.seek === 'function' || typeof window.player.currentTime === 'number' || typeof window.player.pause === 'function')) {
             console.log("找到播放器对象在路径: window.player (直接访问)");
             return window.player;
        }
        const playerPaths = [
            'player',
            '__INITIAL_STATE__.videoData.player',
            'bilibiliPlayer',
            '__INITIAL_STATE__.player'
        ];
        for (const path of playerPaths) {
            try {
                player = path.split('.').reduce((obj, prop) => obj && obj[prop], window);
                if (player && (
                    typeof player.seek === 'function' ||
                    typeof player.currentTime === 'number' ||
                    typeof player.pause === 'function' ||
                    (player.video && (typeof player.video.seek === 'function' || typeof player.video.pause === 'function'))
                )) {
                    console.log(`找到播放器对象在路径: window.${path}`);
                    return player;
                }
                player = null;
            } catch (e) {
                console.log(`查找播放器路径 ${path} 时出错:`, e.message);
            }
        }
        console.warn("未能找到可用的 B站 播放器对象。");
        return null;
    }
    function seekToTimeAndResume(targetTime) {
        const player = getPlayer();
        if (!player) {
            alert(`跳转失败：未找到播放器对象。
请手动跳转到 ${targetTime} 秒。`);
            return;
        }
        try {
            if (typeof player.seek === 'function') {
                player.seek(targetTime);
            } else if (player.video && typeof player.video.seek === 'function') {
                player.video.seek(targetTime);
            } else if (typeof player.currentTime !== 'undefined') {
                player.currentTime = targetTime;
            } else {
                throw new Error("播放器对象没有可用的 seek 或 currentTime 方法/属性");
            }
            console.log(`视频已跳转到 ${targetTime} 秒`);
            setTimeout(() => {
                if (wasPlaying) {
                    console.log("恢复播放");
                    if (typeof player.play === 'function') {
                        player.play();
                    } else if (player.video && typeof player.video.play === 'function') {
                        player.video.play();
                    } else {
                        console.warn("播放器对象没有可用的 play 方法");
                    }
                } else {
                    console.log("视频在暂停前是暂停状态，保持暂停。");
                }
            }, 300);
        } catch (error) {
            console.error("跳转或恢复播放过程中发生错误:", error);
            alert(`操作失败: ${error.message}
请手动跳转到 ${targetTime} 秒。`);
            setTimeout(() => {
                if (wasPlaying) resumeIfWasPlaying(true);
            }, 500);
        }
    }
    function resumeIfWasPlaying(force = false) {
        if (wasPlaying || force) {
            const player = getPlayer();
            if (player) {
                console.log("尝试恢复播放 (在 resumeIfWasPlaying 中)");
                try {
                         if (typeof player.play === 'function') {
                             player.play();
                         } else if (player.video && typeof player.video.play === 'function') {
                             player.video.play();
                         }
                } catch (e) {
                    console.warn("恢复播放时出错:", e);
                }
            }
        }
    }
        function handleKeyDown(event) {
        if ((event.key === 'o' || event.key === 'O' || event.keyCode === 79) && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && !event.target.isContentEditable) {
            console.log("[B站弹幕跳转] 检测到 'O' 键按下");
            showTimeSelectionModal();
        }
    }

    // 添加全局键盘事件监听器
    document.addEventListener('keydown', handleKeyDown);

    const init = async () => {
        if (document.getElementById('bilibili-danmaku-seeker-button-inline')) {
             console.log("内联按钮已存在，跳过创建");
             return;
        }
        try {
             await createAndInsertButton();
        } catch (e) {
             console.error("初始化按钮时出错:", e);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 2000);
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log("检测到URL变化");
            setTimeout(() => {
                if (!document.getElementById('bilibili-danmaku-seeker-button-inline')) {
                    console.log("URL变化后，尝试重新创建按钮...");
                    init();
                } else {
                    console.log("URL变化后，按钮已存在。");
                }
            }, 3000);
        } else {
            if (!document.getElementById('bilibili-danmaku-seeker-button-inline')) {
                 if (!window._seekerButtonCheckTimer) {
                     window._seekerButtonCheckTimer = setTimeout(() => {
                         console.log("DOM变化，检查并尝试创建按钮...");
                         init();
                         window._seekerButtonCheckTimer = null;
                     }, 2000);
                 }
            }
        }
    }).observe(document, { subtree: true, childList: true });
})();
