// ==UserScript==
// @name         EneteduAssistant-教师网培中心2X速(稳定版)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license      MIT
// @description  助力enetedu自动学习：自动2X倍速、自动调低音量、自动切换下一课程等
// @author       beabaed@gmail.com, && OCGT
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/ChoiceCourse*
// @match        https://onlinenew.enetedu.com/gtcfla/MyTrainCourse/OnlineCourse*
// @match        https://onlinenew.enetedu.com/gtcfla/MyTrainCourse/ChoiceCourse*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/522675/EneteduAssistant-%E6%95%99%E5%B8%88%E7%BD%91%E5%9F%B9%E4%B8%AD%E5%BF%832X%E9%80%9F%28%E7%A8%B3%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522675/EneteduAssistant-%E6%95%99%E5%B8%88%E7%BD%91%E5%9F%B9%E4%B8%AD%E5%BF%832X%E9%80%9F%28%E7%A8%B3%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 配置区 ==========
    const SCRIPT_VERSION = '2.2';   // 更新脚本版本号
    const volumeLevel = 0.1;         // 音量(10%)
    const playbackRate = 2.0;        // 播放速率(2倍)，已为最优
    const checkInterval = 2000;      // 轮询检测(毫秒)

    // ========== 初始化状态显示 ==========
    GM_addStyle(`
      #eneteduHelperStatus {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 999999;
      }
    `);

    let statusDiv = document.createElement('div');
    statusDiv.id = 'eneteduHelperStatus';
    statusDiv.textContent = `EneteduHelper v${SCRIPT_VERSION}: 脚本初始化...`;
    document.body.appendChild(statusDiv);

    // 用于更新状态栏 / 控制台日志
    function updateStatus(msg) {
        if (statusDiv) {
            statusDiv.textContent = `EneteduHelper v${SCRIPT_VERSION}: ${msg}`;
        } else {
            console.log(`EneteduHelper: ${msg}`);
        }
    }

    // 禁用 goPAGE()，避免移动端检测拦截
    window.goPAGE = function () {};

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        updateStatus('页面加载完成，开始检测 iframe 播放器...');
        initIframeMonitor();
    });

    /**
     * 轮询监控 iframe，等待播放器（Aliplayer 或 <video>）加载完成
     */
    function initIframeMonitor() {
        const timer = setInterval(() => {
            let iframe = document.querySelector('iframe');
            if (!iframe) {
                updateStatus('未找到 iframe，继续等待...');
                return;
            }
            let iframeDoc;
            try {
                iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            } catch (e) {
                updateStatus('无法访问 iframe（跨域或安全限制），脚本可能无法正常工作');
                clearInterval(timer);
                return;
            }
            if (!iframeDoc) {
                updateStatus('iframeDoc 为空，继续等待...');
                return;
            }

            // Aliplayer 会在 id="courseCon" 处初始化
            let container = iframeDoc.getElementById('courseCon');
            if (container) {
                let videoEl = container.querySelector('video');
                if (videoEl) {
                    updateStatus('检测到 <video>，开始控制播放...');
                    clearInterval(timer);

                    // 如果 iframe 内定义了 h5_player，可尝试拿到它
                    const iframeWindow = iframeDoc.defaultView;
                    let h5_player = iframeWindow ? iframeWindow.h5_player : null;

                    setupVideoControl(videoEl, h5_player);
                    startPopupMonitor();
                    startProgressPoller();  // 开启[100%]即时检测
                } else {
                    updateStatus('找到 Aliplayer 容器，但尚未加载出 <video>...');
                }
            } else {
                updateStatus('未找到 #courseCon 播放器容器，继续等待...');
            }
        }, checkInterval);
    }

    /**
     * 设置视频播放：2X倍速、音量、静音、自动播放
     * 并监听 ended 事件 -> playNextCourse()
     */
    function setupVideoControl(videoEl, aliplayerObj) {
        try {
            videoEl.muted = true;                   // 静音
            videoEl.volume = volumeLevel;           // 音量
            videoEl.playbackRate = playbackRate;    // 倍速
            videoEl.play().catch(() => {
                updateStatus('自动播放被阻止，请手动点击播放');
            });
        } catch (err) {
            console.error('设置视频参数出错:', err);
        }

        // HTML5 <video> ended
        videoEl.addEventListener('ended', () => {
            updateStatus('检测到 video ended，自动跳转下一课...');
            playNextCourse();
        });

        // Aliplayer 自带 ended 回调
        if (aliplayerObj && typeof aliplayerObj.on === 'function') {
            aliplayerObj.on('ended', () => {
                updateStatus('检测到 Aliplayer ended，自动跳转下一课...');
                playNextCourse();
            });
        }

        // ========== 新增：持续检测并恢复“倍速、音量、静音” ==========
        setInterval(() => {
            // 1. 若被暂停则重新播放
            if (videoEl.paused) {
                videoEl.play().catch(() => {});
                updateStatus('检测到视频暂停，已尝试恢复播放');
            }

            // 2. 若播放速率被重置，则恢复到设定值
            if (videoEl.playbackRate !== playbackRate) {
                videoEl.playbackRate = playbackRate;
                updateStatus(`检测到播放速率被重置，已恢复为 ${playbackRate}x`);
            }

            // 3. 如果希望音量也一直保持固定值，可以再加一段
            if (videoEl.volume !== volumeLevel) {
                videoEl.volume = volumeLevel;
                updateStatus(`检测到音量被重置，已恢复为 ${volumeLevel * 100}%`);
            }

            // 4. 若需要持续保持静音
            if (!videoEl.muted) {
                videoEl.muted = true;
                updateStatus('检测到取消静音，再次静音');
            }
        }, 3000);
    }

    /**
     * 轮询检测外层页面是否有弹窗 .layui-layer-page
     * 如果有就自动点击确认按钮 .layui-layer-btn0
     */
    function startPopupMonitor() {
        setInterval(() => {
            let popup = document.querySelector('.layui-layer-page');
            if (popup) {
                let confirmBtn = popup.querySelector('.layui-layer-btn0');
                if (confirmBtn) {
                    confirmBtn.click();
                    updateStatus('检测到弹窗，已自动点击【确认】');
                }
            }
        }, 3000);
    }

    /**
     * 每隔 2 秒检测当前正在播放章节的进度是否达到 [100%]
     * 如果已达 100%，立即调用 playNextCourse() 跳转下一课
     */
    function startProgressPoller() {
        setInterval(() => {
            let currentItem = getCurrentPlayingLi();
            if (!currentItem) return;

            let spanEl = currentItem.querySelector('span');
            if (!spanEl) return;

            // 检测进度是否包含 "100%"
            if (spanEl.innerText.includes('100%')) {
                updateStatus('检测到当前进度已达[100%]，立即跳转下一课...');
                playNextCourse();
            }
        }, 2000);
    }

    /**
     * 获取“当前正在播放”的章节 li
     * - 依据 style="background-color: #ccc5c5;"
     */
    function getCurrentPlayingLi() {
        let courseItems = document.querySelectorAll('.classcenter-chapter2 ul li');
        for (let li of courseItems) {
            let bgColor = window.getComputedStyle(li).backgroundColor;
            if (bgColor === 'rgb(204, 197, 197)') {
                return li;
            }
        }
        return null;
    }

    /**
     * 自动跳转到下一课：
     * - 查找当前章节 li => 从下一项开始，若 span 不含 "100%" 即跳转
     * - 如果全部完成则返回上一页
     */
    function playNextCourse() {
        let courseItems = document.querySelectorAll('.classcenter-chapter2 ul li');
        if (!courseItems.length) {
            updateStatus('未找到课程列表，无法跳转下一课...');
            return;
        }

        let currentIndex = -1;
        for (let i = 0; i < courseItems.length; i++) {
            let bgColor = window.getComputedStyle(courseItems[i]).backgroundColor;
            if (bgColor === 'rgb(204, 197, 197)') {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex === -1) {
            updateStatus('未检测到当前播放章节 (背景 #ccc5c5)，无法定位下一课');
            return;
        }

        // 从下一项开始，找进度 != 100% 的章节
        for (let i = currentIndex + 1; i < courseItems.length; i++) {
            let spanEl = courseItems[i].querySelector('span');
            if (spanEl && !spanEl.innerText.includes('100%')) {
                let onClickVal = courseItems[i].getAttribute('onclick');
                if (onClickVal) {
                    let match = onClickVal.match(/location\.href='([^']+)'/);
                    if (match && match[1]) {
                        updateStatus('发现下一课未完成，正在跳转...');
                        window.location.href = match[1];
                        return;
                    }
                }
            }
        }

        // 全部完成或找不到 => 返回上一页
        updateStatus('所有课程已完成，返回上一页');
        window.history.back();
    }
})();
