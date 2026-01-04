// ==UserScript==
// @name         特定页面视频暂停检测
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  检测 hifa.shuoguoyun.com 页面中视频暂停，通过聚合推送通知（Token内置），并在右侧面板显示状态和控制通知。
// @author       Your Name
// @match        *://hifa.shuoguoyun.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      tui.juhe.cn
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/538545/%E7%89%B9%E5%AE%9A%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538545/%E7%89%B9%E5%AE%9A%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VIDEO_ID = 'bjy-player-teacher';
    const PUSH_API_URL = 'https://tui.juhe.cn/api/plus/pushApi';
    const SERVICE_ID = 'HsCOtSZ';
    const USER_TOKEN = ''; // <<< 在这里设置您的固定Token

    let videoElement = null;
    let eventListenerAttached = false;
    let statusPanel = null;
    let statusTextElement = null;
    let lastStatusText = '';

    let notificationToggle = null;

    // --- 节流函数 ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // --- 注入CSS样式 ---
    GM_addStyle(`
        #videoStatusPanel_userscript {
            position: fixed;
            top: 70%;
            right: 0;
            transform: translateY(-50%);
            background-color: rgba(50, 50, 50, 0.85);
            color: white;
            padding: 10px 15px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 13px;
            box-shadow: -2px 0px 5px rgba(0,0,0,0.4);
            text-align: left;
            min-width: 150px; /* 可以适当减小宽度 */
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #videoStatusPanel_userscript div {
            margin-bottom: 3px;
        }
        #videoStatusText_userscript {
            font-weight: bold;
            color: #FFD700;
            text-align: center;
            padding: 8px 0; /* 增加一点上下padding */
            border-top: 1px solid #777;
            margin-top: 8px; /* 增加与上方元素的间距 */
        }
        #videoStatusPanel_userscript label {
            display: inline-block;
            margin-right: 8px;
            color: #ddd;
        }
        #videoStatusPanel_userscript input[type="checkbox"] {
            vertical-align: middle;
        }
        #videoStatusPanel_userscript .panel-title {
            text-align: center;
            font-weight: bold;
            padding-bottom: 5px;
            border-bottom: 1px solid #777;
            color: #eee;
        }
        #videoStatusPanel_userscript .input-group {
            display: flex;
            align-items: center;
        }
    `);

    // --- 创建状态面板 ---
    function createStatusPanel() {
        if (document.getElementById('videoStatusPanel_userscript')) {
            statusPanel = document.getElementById('videoStatusPanel_userscript');
            statusTextElement = document.getElementById('videoStatusText_userscript');
            notificationToggle = document.getElementById('notificationToggle_userscript');
            return;
        }

        statusPanel = document.createElement('div');
        statusPanel.id = 'videoStatusPanel_userscript';

        const panelTitleElement = document.createElement('div');
        panelTitleElement.className = 'panel-title';
        panelTitleElement.textContent = '视频监控';
        statusPanel.appendChild(panelTitleElement);

        // 通知开关
        const notificationGroup = document.createElement('div');
        notificationGroup.className = 'input-group';
        const notificationLabel = document.createElement('label');
        notificationLabel.htmlFor = 'notificationToggle_userscript';
        notificationLabel.textContent = '开启暂停通知:';
        notificationToggle = document.createElement('input');
        notificationToggle.type = 'checkbox';
        notificationToggle.id = 'notificationToggle_userscript';
        notificationToggle.checked = GM_getValue('notificationEnabled_v07', false); // 使用新key避免与旧版本冲突
        notificationToggle.addEventListener('change', (event) => {
            GM_setValue('notificationEnabled_v07', event.target.checked);
            console.log('通知状态已保存:', event.target.checked);
            if (event.target.checked && !USER_TOKEN) { // 检查硬编码的TOKEN
                alert('脚本内未配置有效的USER_TOKEN！');
            }
        });
        notificationGroup.appendChild(notificationLabel);
        notificationGroup.appendChild(notificationToggle);
        statusPanel.appendChild(notificationGroup);

        // 状态显示
        statusTextElement = document.createElement('div');
        statusTextElement.id = 'videoStatusText_userscript';
        statusTextElement.textContent = '检测中...';
        statusPanel.appendChild(statusTextElement);

        document.body.appendChild(statusPanel);
        console.log('状态面板已创建 (Token内置)。');
    }

    function updateStatusPanelText(status) {
        if (statusTextElement && lastStatusText !== status) {
            statusTextElement.textContent = status;
            lastStatusText = status;
        }
    }

    // --- 发送通知 ---
    function sendPushNotification(title, content) {
        if (!USER_TOKEN) {
            console.error('错误：USER_TOKEN 未在脚本中定义！');
            updateStatusPanelText('状态: Token未配置!');
            alert('脚本内未配置有效的USER_TOKEN，无法发送通知。');
            return;
        }

        const params = new URLSearchParams();
        params.append('token', USER_TOKEN);
        params.append('title', title);
        params.append('content', content);
        params.append('service_id', SERVICE_ID);

        console.log('发送推送通知:', { title, content, service_id: SERVICE_ID });

        GM_xmlhttpRequest({
            method: 'POST',
            url: PUSH_API_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params.toString(),
            onload: function(response) {
                console.log('推送通知响应:', response.responseText);
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse.code === 200 || jsonResponse.status === true || (typeof jsonResponse.message === 'string' && jsonResponse.message.includes("成功"))) {
                        console.log('通知发送成功!');
                        updateStatusPanelText('状态: 已暂停 (通知成功)');
                    } else {
                        console.error('通知发送失败:', jsonResponse.message || '未知错误');
                        updateStatusPanelText(`状态: 暂停 (通知失败: ${jsonResponse.message || ''})`);
                        alert(`通知发送失败: ${jsonResponse.message || '请检查Token和网络'}`);
                    }
                } catch (e) {
                    console.error('解析推送响应错误:', e, response.responseText);
                    updateStatusPanelText('状态: 已暂停 (通知响应异常)');
                }
            },
            onerror: function(response) {
                console.error('推送通知请求错误:', response);
                updateStatusPanelText('状态: 已暂停 (通知请求失败)');
                alert('通知请求失败，请检查网络或油猴脚本的跨域权限设置。');
            }
        });
    }

    function handleVideoPause(event) {
        const currentTime = new Date().toLocaleString('zh-CN', { hour12: false });
        const statusMsg = `状态: 已暂停 (时间: ${currentTime.split(' ')[1]})`;
        console.log(`视频 (ID: ${VIDEO_ID}) 已暂停于 ${currentTime}`);
        updateStatusPanelText(statusMsg);

        if (GM_getValue('notificationEnabled_v07', false)) {
            const title = "视频播放通知";
            const content = `视频 ${document.title || '未知页面'} 已停止播放，停止时间为 ${currentTime}`; // 增加了页面标题
            sendPushNotification(title, content);
        }
    }

    function handleVideoPlay(event) {
        console.log(`视频 (ID: ${VIDEO_ID}) 已播放.`);
        updateStatusPanelText('状态: 播放中');
    }

    function attachListenersToVideo() {
        if (videoElement && !eventListenerAttached) {
            videoElement.addEventListener('pause', handleVideoPause);
            videoElement.addEventListener('play', handleVideoPlay);
            eventListenerAttached = true;
            console.log(`已为视频 (ID: ${VIDEO_ID}) 添加暂停/播放监听器。`);

            if (videoElement.paused) {
                updateStatusPanelText('状态: 已暂停');
            } else {
                updateStatusPanelText('状态: 播放中');
            }
        } else if (videoElement && eventListenerAttached) {
             if (videoElement.paused) {
                updateStatusPanelText('状态: 已暂停');
            } else {
                updateStatusPanelText('状态: 播放中');
            }
        }
    }

    const checkVideoPresenceAndState = throttle(() => {
        let videoJustFoundOrReconfirmed = false;
        if (!videoElement || !document.body.contains(videoElement)) {
            videoElement = document.getElementById(VIDEO_ID);
            if (videoElement) {
                console.log(`通过 Observer 找到/确认视频元素 (ID: ${VIDEO_ID})。`);
                videoJustFoundOrReconfirmed = true;
                eventListenerAttached = false;
            } else {
                updateStatusPanelText('状态: 未找到视频');
                return;
            }
        }

        if (videoElement && (!eventListenerAttached || videoJustFoundOrReconfirmed)) {
            attachListenersToVideo();
        } else if (videoElement && eventListenerAttached) {
            if (videoElement.paused) {
                if(!statusTextElement.textContent.includes('已暂停')) {
                     updateStatusPanelText('状态: 已暂停');
                }
            } else {
                if(!statusTextElement.textContent.includes('播放中')) {
                    updateStatusPanelText('状态: 播放中');
                }
            }
        }

        if (!videoElement || !eventListenerAttached) {
            const dialogWrapper = document.querySelector('div.el-dialog__wrapper[style*="z-index: 2003"]');
            if (dialogWrapper && dialogWrapper.style.display !== 'none') {
                videoElement = document.getElementById(VIDEO_ID);
                 if (videoElement && !eventListenerAttached) {
                    console.log(`播放器容器可见，为视频 (ID: ${VIDEO_ID}) 附加监听器。`);
                    attachListenersToVideo();
                }
            }
        }
    }, 250);


    function init() {
        createStatusPanel();
        videoElement = document.getElementById(VIDEO_ID);

        if (videoElement) {
            console.log(`初始找到视频元素 (ID: ${VIDEO_ID})。`);
            attachListenersToVideo();
        } else {
            console.log(`页面加载时未找到视频元素 (ID: ${VIDEO_ID})，将通过 MutationObserver 监测。`);
            updateStatusPanelText('状态: 搜索视频中...');
        }

        const observer = new MutationObserver((mutationsList, observerInstance) => {
            checkVideoPresenceAndState();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'id', 'class']
        });
        console.log('MutationObserver 已启动。');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();