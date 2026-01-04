// ==UserScript==
// @name         YouTube 稍后再看重定向
// @name:en      YouTube Watch Later Redirect
// @name:zh-CN   YouTube 稍后再看重定向
// @name:zh-TW   YouTube 稍後再看重定向
// @namespace    http://tampermonkey.net/
// @version      1.1.20250326
// @author       JerryYang
// @description  重定向YouTube稍后再看的视频链接到原始视频链接，并在新标签页中打开视频。
// @description:en  Redirect YouTube Watch Later video links to their original video and open in a new tab.
// @description:zh-CN  重定向YouTube稍后再看的视频链接到原始视频链接，并在新标签页中打开视频。
// @description:zh-TW  重定向YouTube稍後再看的影片連結到原始影片，並在新標籤頁中開啟影片。
// @license      GPL-3.0 License
// @homepage     https://github.com/JerryYang-30/Open-UserScripts
// @supportURL   https://github.com/JerryYang-30/Open-UserScripts/issues
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/507417/YouTube%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/507417/YouTube%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

/*
支持多语言
*/

// 语言支持：英语 (en), 简体中文 (zh-CN), 繁体中文 (zh-TW)
const userLanguage = navigator.language || navigator.userLanguage;

// 多语言翻译资源
const translations = {
    "en": {
        "notificationMessage": "All videos have been successfully redirected!",
        "enableNotification": "Enable Notification",
        "disableNotification": "Disable Notification",
        "adjustNotificationStyle": "Adjust Notification Style",
        "resetDefaults": "Reset to Default Settings",
        "confirmSave": "Are you sure you want to save the changes?",
        "confirmReset": "Are you sure you want to reset to default settings? This action cannot be undone!",
        "savedMessage": "Settings saved, click OK to refresh the page.",
        "resetMessage": "Default settings restored, click OK to refresh the page.",
        "enableNotificationMessage": "Notification has been enabled, click OK to refresh for changes to take effect.",
        "disableNotificationMessage": "Notification has been disabled, click OK to refresh for changes to take effect.",
        "adjustPanelH2Title": "Adjust the style of the prompt box(leave blank to not modify)",
        "adjustPanelPosition": "Select prompt box location",
        "adjustPanelWidth": "Prompt box width (can also be auto)",
        "adjustPanelHeight": "Prompt box length (can also be auto)",
        "adjustPanelHideAfter": "The display time of the prompt box (milliseconds, just enter the number)",
        "adjustPanelCustomMessage": "Custom prompt words",
        "adjustPanelSave": "Save",
        "adjustPanelCancel": "Cancel",
        "adjustPanelReset": "Restore default settings",
        "adjustPanelPlaceholder": "Currently ",
        "exportList": "Export Watch Later List",
        "exportSuccess": "Export successful! The file has been saved to your downloads folder.",
        "noVideosFound": "No videos found in the Watch Later list."
    },
    "zh-CN": {
        "notificationMessage": "全部视频已成功重定向！",
        "enableNotification": "启用提示框",
        "disableNotification": "禁用提示框",
        "adjustNotificationStyle": "调整提示框样式",
        "resetDefaults": "恢复默认设置",
        "confirmSave": "确定要保存修改吗？此操作不可撤销！",
        "confirmReset": "确定要恢复默认设置吗？此操作不可撤销！",
        "savedMessage": "设置已保存，点击确定刷新页面以生效。",
        "resetMessage": "默认设置已恢复，点击确定刷新页面以生效。",
        "enableNotificationMessage": "提示框已启用，点击确定刷新后生效。",
        "disableNotificationMessage": "提示框已禁用，点击确定刷新后生效。",
        "adjustPanelH2Title": "调整提示框样式(留空则不修改)",
        "adjustPanelPosition": "选择提示框位置",
        "adjustPanelWidth": "提示框宽度（可以填auto）",
        "adjustPanelHeight": "提示框长度（可以填auto）",
        "adjustPanelHideAfter": "提示框显示时间（毫秒，输入数字即可）",
        "adjustPanelCustomMessage": "自定义提示词",
        "adjustPanelSave": "保存",
        "adjustPanelCancel": "取消",
        "adjustPanelReset": "恢复默认设置",
        "adjustPanelPlaceholder": "当前为",
        "exportList": "导出稍后观看列表",
        "exportSuccess": "导出成功！文件已保存到下载文件夹。",
        "noVideosFound": "稍后观看列表中未找到视频。"
    },
    "zh-TW": {
        "notificationMessage": "全部影片已成功重新導向！",
        "enableNotification": "啟用提示框",
        "disableNotification": "禁用提示框",
        "adjustNotificationStyle": "調整提示框樣式",
        "resetDefaults": "恢復預設設定",
        "confirmSave": "確定要保存修改嗎？此操作不可撤銷！",
        "confirmReset": "確定要恢復預設設定嗎？此操作不可撤銷！",
        "savedMessage": "設定已保存，點擊確定刷新頁面以生效。",
        "resetMessage": "預設設定已恢復，點擊確定刷新頁面以生效。",
        "enableNotificationMessage": "提示框已啟用，點擊確定刷新後生效。",
        "disableNotificationMessage": "提示框已禁用，點擊確定刷新後生效。",
        "adjustPanelH2Title": "调整提示框样式(留空则不修改)",
        "adjustPanelPosition": "選擇提示框位置",
        "adjustPanelWidth": "提示框寬度（可以填auto）",
        "adjustPanelHeight": "提示框長度 (可以填auto)",
        "adjustPanelHideAfter": "提示框顯示時間 (毫秒，輸入數字即可)",
        "adjustPanelCustomMessage": "自定義提示詞",
        "adjustPanelSave": "保存",
        "adjustPanelCancel": "取消",
        "adjustPanelReset": "恢復默認設置",
        "adjustPanelPlaceholder": "當前爲",
        "exportList": "導出稍後觀看列表",
        "exportSuccess": "導出成功！文件已保存到下載文件夾。",
        "noVideosFound": "稍後觀看列表中未找到影片。"
    }
};

// 根据用户语言设置获取翻译
const lang = userLanguage.startsWith('zh-TW') ? 'zh-TW' :
userLanguage.startsWith('zh') ? 'zh-CN' : 'en';
const t = translations[lang];

// 主函数
(function() {
    'use strict';

/*
先判断当前是否为稍后再看页面
*/

    let lastUrl = window.location.href;  // 保存上一次的 URL

    // 初次加载时初始化
    if (window.location.href == "https://www.youtube.com/playlist?list=WL") {
        redirector();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 检查 Shadow DOM 中的元素
                    if (node.shadowRoot) {
                        const targetElement = node.shadowRoot.querySelector('yt-formatted-string.title.style-scope.ytd-guide-entry-renderer');
                        if (targetElement) {
                            targetElement.addEventListener('click', () => {
                                //console.log('YouTube稍后再看脚本 - 点击了“稍后观看”按钮');
                                redirector();
                            });
                        }
                    }
                    // 处理非 Shadow DOM 元素
                    if (node.matches('yt-formatted-string.title.style-scope.ytd-guide-entry-renderer')) {
                        node.addEventListener('click', () => {
                            //console.log('YouTube稍后再看脚本 - 点击了“稍后观看”按钮');
                            redirector();
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 监听 URL 变化 (pushState 和 popstate)
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        onUrlChange();
    };

    window.addEventListener('popstate', onUrlChange); // 处理前进和后退按钮

/*
对稍后再看页面作重定向处理
*/

// 重定向
    function redirector() {
        const observer = new MutationObserver((mutationsList, observer) => {
            // 查询稍后再看列表中的视频元素
            const items = document.querySelectorAll('div#content.style-scope.ytd-playlist-video-renderer');

            if (items.length > 0) {
                showNotification(items.length);
                observer.disconnect();

                items.forEach(item => {
                    if (!item.dataset.redirectBound) {
                        item.dataset.redirectBound = true;

                        // 获取缩略图和标题区域
                        const thumbnail = item.querySelector('ytd-thumbnail#thumbnail');
                        const metaArea = item.querySelector('div#meta');

                        if (thumbnail && metaArea) {
                            // 处理缩略图区域
                            const videoTitle = metaArea.querySelector('a#video-title');
                            if (videoTitle) {
                                const href = videoTitle.getAttribute('href');
                                if (href && href.includes('list=WL')) {
                                    const videoId = href.match(/v=([^&]+)/)[1];
                                    const originalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                                    // 存储原始URL到缩略图元素
                                    thumbnail.setAttribute('data-original-url', originalUrl);
                                    
                                    // 为缩略图内的所有可点击元素添加事件处理
                                    thumbnail.querySelectorAll('a, img, .yt-core-image').forEach(element => {
                                        
                                        // 左键点击缩略图
                                        element.addEventListener('click', function(event) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            window.open(originalUrl, '_blank');
                                            return false;
                                        });

                                        // 中键点击缩略图
                                        element.addEventListener('auxclick', function(event) {
                                            if (event.button === 1) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                window.open(originalUrl, '_blank');
                                                return false;
                                            }
                                        });
                                    });
                                }
                            }

                            // 处理标题区域
                            metaArea.addEventListener('mouseover', function() {
                                const videoTitle = metaArea.querySelector('a#video-title');
                                if (videoTitle) {
                                    const href = videoTitle.getAttribute('href');
                                    if (href && href.includes('list=WL')) {
                                        const videoId = href.match(/v=([^&]+)/)[1];
                                        const originalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                                        videoTitle.setAttribute('data-original-url', originalUrl);
                                    }
                                }
                            });

                            // 左键点击标题
                            metaArea.addEventListener('click', function(event) {
                                handleLinkClick(event);
                            });

                            // 中键点击标题
                            metaArea.addEventListener('auxclick', function(event) {
                                if (event.button === 1) {
                                    handleLinkClick(event);
                                }
                            });
                        }
                    }
                });
            }
        });

        // 监听 DOM 变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleLinkClick(event) { // 处理左键和中键点击稍后再看视频的行为
        const target = event.target;
        if (target.hasAttribute('href') && target.getAttribute('href').includes('@')) {
            return; // 点击的是作者主页链接，直接跳转，不重定向
        }

        const linkElement = target.closest('div#meta.style-scope.ytd-playlist-video-renderer').querySelector('a#video-title');
        if (linkElement) {
            const originalUrl = linkElement.getAttribute('data-original-url');
            if (originalUrl) {
                event.preventDefault();  // 阻止默认跳转行为
                event.stopPropagation(); // 阻止事件冒泡
                window.open(originalUrl, '_blank');  // 在新标签页中打开原视频链接
                return false;  // 防止进一步的默认跳转行为
            }
        }
    }

    // 页面跳转或 URL 变化时触发重新初始化脚本
    function onUrlChange() {
        if (window.location.href !== lastUrl) {
            //console.log('YouTube稍后再看脚本 - 检测到 URL 变化: ', window.location.href);
            if (window.location.href == "https://www.youtube.com/playlist?list=WL") {
                redirector();
            }
            lastUrl = window.location.href;  // 更新 lastUrl
        }
    }

/*
提示框及其菜单
*/

    // 默认设置
    const defaultSettings = {
        showNotification: true,
        position: 'bottom-right',
        width: 'auto',
        height: 'auto',
        hideAfter: 3000,
        customMessage: t.notificationMessage  // 默认提示词
    };

    // 注册菜单项
    function registerMenuCommands() {
        if (!getSettings().showNotification) {
            GM_registerMenuCommand(t.enableNotification, toggleNotification);
        } else {
            GM_registerMenuCommand(t.disableNotification, toggleNotification);
            GM_registerMenuCommand(t.adjustNotificationStyle, createStyleAdjustmentPanel);
        }
        
        // 添加导出列表菜单项
        GM_registerMenuCommand(t.exportList, exportWatchLaterList);
    }

    // 打开提示框开关菜单
    function toggleNotification() {
        const settings = getSettings();
        const newShowNotification = !settings.showNotification;
        saveSettings({ ...settings, showNotification: newShowNotification });

        // 更新菜单项显示状态
        updateMenuCommands();
    }

    // 更新菜单项显示状态
    function updateMenuCommands() {
        const settings = getSettings();
        const newShowNotification = !settings.showNotification;
        alert(`${newShowNotification ? t.enableNotificationMessage : t.disableNotificationMessage}`);
        location.reload(); // 刷新页面
    }

    // 初次注册菜单项
    registerMenuCommands();

    // 创建样式调整面板并使用 Shadow DOM
    function createStyleAdjustmentPanel() {
        const settings = getSettings();
        // 创建容器，并为其附加 Shadow DOM
        const panelContainer = document.createElement('div');
        panelContainer.style.position = 'fixed';
        panelContainer.style.top = '0';
        panelContainer.style.left = '0';
        panelContainer.style.width = '100vw';
        panelContainer.style.height = '100vh';
        panelContainer.style.zIndex = '10001';
        panelContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 添加遮罩效果

        const shadowRoot = panelContainer.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
        <style>
            #panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                z-index: 10002;
                width: 300px;
                height: auto;
            }
            button {
                margin-top: 15px;
            }
            #reset {
                position: absolute;
                bottom: 10px;
                right: 10px;
            }
        </style>
        <div id="panel">
            <h2>${t.adjustPanelH2Title}</h2>
            <label>
                ${t.adjustPanelPosition}(now at ${settings.position}):<br>
                <select id="position-select">
                    <option value="bottom-right">bottom-right</option>
                    <option value="top-right">top-right</option>
                    <option value="top-left">top-left</option>
                    <option value="bottom-left">bottom-left</option>
                </select>
            </label><br>
            <label>
                ${t.adjustPanelWidth}:<br>
                <input type="text" id="width" placeholder="${t.adjustPanelPlaceholder}${settings.width}">
            </label><br>
            <label>
                ${t.adjustPanelHeight}:<br>
                <input type="text" id="height" placeholder="${t.adjustPanelPlaceholder}${settings.height}">
            </label><br>
            <label>
                ${t.adjustPanelHideAfter}:<br>
                <input type="number" id="hideAfter" placeholder="${t.adjustPanelPlaceholder}${settings.hideAfter}ms">
            </label><br>
            <label>
                ${t.adjustPanelCustomMessage}:<br>
                <input type="text" id="customMessage" placeholder="${t.adjustPanelPlaceholder}“${settings.customMessage}”">
            </label><br>
            <button id="save">${t.adjustPanelSave}</button>
            <button id="cancel">${t.adjustPanelCancel}</button>
            <button id="reset">${t.adjustPanelReset}</button> <!-- 添加恢复默认设置按钮 -->
        </div>
    `;

        // 将面板插入到页面中
        document.documentElement.appendChild(panelContainer);

        const positionSelect = shadowRoot.querySelector('#position-select');
        window.selectedPosition = settings.position;

        // 监听 select 元素的 change 事件
        positionSelect.addEventListener('change', function(event) {
            selectedPosition = event.target.value; // 获取当前选择的值
            console.log('稍后再看Selected position:', selectedPosition);

            // 将选择的值保存到一个变量或状态中
            // 如果需要在点击保存按钮时使用
            window.selectedPosition = selectedPosition;
            //console.log('稍后再看window.selectedPosition为：', window.selectedPosition);
        });

        // 绑定事件到 Shadow DOM 中的元素
        // shadowRoot.getElementById('save').addEventListener('click', () => saveSettingsByPanel(shadowRoot));
        // 使用全局变量
        window.shadowRoot = shadowRoot;
        shadowRoot.getElementById('save').addEventListener('click', () => {
            const confirmed = confirm(t.confirmSave);
            if (!confirmed) {
                return;
            }

            const settings = getSettings();
            const newPosition = window.selectedPosition;
            // 获取其他设置值，如果为空则保持原值
            const shadowRoot = window.shadowRoot;
            const newWidth = shadowRoot.getElementById('width').value || settings.width;
            const newHeight = shadowRoot.getElementById('height').value || settings.height;
            const newHideAfter = parseInt(shadowRoot.getElementById('hideAfter').value, 10) || settings.hideAfter;
            const newCustomMessage = shadowRoot.getElementById('customMessage').value;

            const newSettings = {
                ...settings,
                position: newPosition,
                width: newWidth,
                height: newHeight,
                hideAfter: newHideAfter,
                customMessage: newCustomMessage
            };

            saveSettings(newSettings);

            // 提示并刷新页面
            alert(t.savedMessage);
            location.reload(); // 刷新页面
        });

        shadowRoot.getElementById('cancel').addEventListener('click', () => {
            panelContainer.remove(); // 关闭面板
        });

        // 绑定恢复默认设置按钮的点击事件，并弹出确认框
        shadowRoot.getElementById('reset').addEventListener('click', () => {
            const confirmed = confirm(t.confirmReset);
            if (confirmed) {
                restoreDefaultSettings();
                alert(t.resetMessage);
                location.reload(); // 刷新页面
            }
        });
    }

    // 不想为了传递一个shadowRoot参数，而定义一个函数
    // function saveSettingsByPanel(shadowRoot){
    //     const confirmed = confirm(t.confirmSave);
    //     if (!confirmed) {
    //         return;
    //     }

    //     //console.log("稍后再看selectedPosition为：", window.selectedPosition);
    //     const settings = getSettings();
    //     const newPosition = window.selectedPosition;
    //     // 获取其他设置值，如果为空则保持原值
    //     const newWidth = shadowRoot.getElementById('width').value || settings.width;
    //     const newHeight = shadowRoot.getElementById('height').value || settings.height;
    //     const newHideAfter = parseInt(shadowRoot.getElementById('hideAfter').value, 10) || settings.hideAfter;
    //     const newCustomMessage = shadowRoot.getElementById('customMessage').value || settings.customMessage;

    //     const newSettings = {
    //         ...settings,
    //         position: newPosition,
    //         width: newWidth,
    //         height: newHeight,
    //         hideAfter: newHideAfter,
    //         customMessage: newCustomMessage
    //     };

    //     saveSettings(newSettings);

    //     // 提示并刷新页面
    //     alert(t.savedMessage);
    //     location.reload(); // 刷新页面
    // }

    // 恢复默认设置的函数
    function restoreDefaultSettings() {
        GM_setValue('position', defaultSettings.position);
        GM_setValue('width', defaultSettings.width);
        GM_setValue('height', defaultSettings.height);
        GM_setValue('hideAfter', defaultSettings.hideAfter);
        GM_setValue('customMessage', defaultSettings.customMessage);
    }

    // 从存储中获取设置
    function getSettings() {
        return {
            showNotification: GM_getValue('showNotification', defaultSettings.showNotification),
            position: GM_getValue('position', defaultSettings.position),
            width: GM_getValue('width', defaultSettings.width),
            height: GM_getValue('height', defaultSettings.height),
            hideAfter: GM_getValue('hideAfter', defaultSettings.hideAfter),
            customMessage: GM_getValue('customMessage', defaultSettings.customMessage)
        };
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue('showNotification', settings.showNotification);
        GM_setValue('position', settings.position);
        GM_setValue('width', settings.width);
        GM_setValue('height', settings.height);
        GM_setValue('hideAfter', settings.hideAfter);
        GM_setValue('customMessage', settings.customMessage);
    }

    // 创建或更新提示框
    function createNotification() {
        const settings = getSettings();
        const notification = document.getElementById('redirect-notification') || document.createElement('div');
        notification.id = 'redirect-notification';
        notification.style.position = 'fixed';
        notification.style[settings.position.split('-')[0]] = '20px';
        notification.style[settings.position.split('-')[1]] = '20px';
        notification.style.width = settings.width;
        notification.style.height = settings.height;
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.fontSize = '16px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        notification.style.zIndex = '10000';
        notification.style.opacity = '0'; // 初始隐藏
        notification.style.transition = 'opacity 0.5s'; // 动画效果
        document.body.appendChild(notification);
        return notification;
    }

    // 显示提示框，并在规定时间内自动消失
    function showNotification(itemCount) {
        const settings = getSettings();
        if (!settings.showNotification) return;
        const notification = createNotification();
        notification.textContent = settings.customMessage;
        notification.style.opacity = '1'; // 显示提示框

        // 在指定时间后自动隐藏提示框
        setTimeout(() => {
            notification.style.opacity = '0'; // 隐藏提示框
        }, settings.hideAfter);
    }

    // 导出稍后观看列表
    function exportWatchLaterList() {
        // 确保当前页面是稍后观看列表
        if (window.location.href !== "https://www.youtube.com/playlist?list=WL") {
            window.open("https://www.youtube.com/playlist?list=WL", "_blank");
            return;
        }
        
        // 等待页面加载完成
        setTimeout(() => {
            const items = document.querySelectorAll('div#content.style-scope.ytd-playlist-video-renderer');
            
            if (items.length === 0) {
                alert(t.noVideosFound);
                return;
            }
            
            let videoLinks = [];
            let videoTitles = [];
            let videoAuthors = [];
            let authorLinks = [];
            
            items.forEach(item => {
                const metaArea = item.querySelector('div#meta');
                if (metaArea) {
                    // 获取视频标题和链接
                    const videoTitle = metaArea.querySelector('a#video-title');
                    if (videoTitle) {
                        const href = videoTitle.getAttribute('href');
                        if (href && href.includes('list=WL')) {
                            // 获取视频链接及标题
                            const videoId = href.match(/v=([^&]+)/)[1];
                            const originalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                            const title = videoTitle.textContent.trim();
                            videoLinks.push(originalUrl);
                            videoTitles.push(title);
                            
                            // 获取作者信息
                            const authorElement = metaArea.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
                            if (authorElement) {
                                const authorName = authorElement.textContent.trim();
                                const authorUrl = `https://www.youtube.com${authorElement.getAttribute('href')}`;
                                videoAuthors.push(authorName);
                                authorLinks.push(authorUrl);
                            } else {
                                videoAuthors.push('Unknown Author');
                                authorLinks.push('');
                            }
                        }
                    }
                }
            });
            
            if (videoLinks.length > 0) {
                // 创建导出内容，添加视频总数信息
                let exportContent = `Totally ${videoLinks.length} videos exported!\n\n`;
                
                // 添加带序号的视频信息
                for (let i = 0; i < videoLinks.length; i++) {
                    exportContent += `Video index: ${i + 1}\n${videoTitles[i]}\nauthor: ${videoAuthors[i]}, ${authorLinks[i]}\n${videoLinks[i]}\n\n`;
                }
                
                // 创建下载链接
                const blob = new Blob([exportContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const date = new Date();
                const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
                a.href = url;
                a.download = `YouTube-Watch-Later-List-${dateString}.txt`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                alert(t.exportSuccess);
            } else {
                alert(t.noVideosFound);
            }
        }, 2000); // 给页面加载留出足够时间
    }

})();