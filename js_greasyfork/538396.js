// ==UserScript==
// @name         DevBlueChat
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  自动短信登录流程 + 文件下载监控 + 黑名单过滤，支持自定义配置，提升工作效率
// @author       Eachann
// @match        https://codigger.onecloud.cn/*
// @icon         https://files.catbox.moe/8l13tx.jpg
// @homepage     https://github.com/eachann1024/ILoveWork/blob/master/DevXiaoHui.js
// @supportURL   https://github.com/eachann1024/ILoveWork/issues
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538396/DevBlueChat.user.js
// @updateURL https://update.greasyfork.org/scripts/538396/DevBlueChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    const CONFIG_KEYS = {
        DOWNLOAD_ENABLED: 'downloadEnabled',
        BLACKLIST_ENABLED: 'blacklistEnabled',
        FILE_BLACKLIST: 'fileBlacklist',
        PHONE_NUMBER: 'phoneNumber',
        AUTO_RECONNECT: 'autoReconnect',
        CUSTOM_ICON_TITLE: 'customIconTitle'
    };

    // 默认配置
    const DEFAULT_CONFIG = {
        [CONFIG_KEYS.DOWNLOAD_ENABLED]: true,
        [CONFIG_KEYS.BLACKLIST_ENABLED]: false,
        [CONFIG_KEYS.FILE_BLACKLIST]: '.exe,.bat,.cmd,.scr,.pif',
        [CONFIG_KEYS.PHONE_NUMBER]: '',
        [CONFIG_KEYS.AUTO_RECONNECT]: true,
        [CONFIG_KEYS.CUSTOM_ICON_TITLE]: true
    };

    // 上传状态标记
    let isUploading = false;
    let uploadTimer = null;

    // 已下载文件记录 (使用 Set 存储文件的唯一标识)
    const downloadedFiles = new Set();

    // 下载节流控制
    let lastDownloadTime = 0;
    const DOWNLOAD_THROTTLE_INTERVAL = 3000; // 3秒内只允许触发一次下载

    // 生成文件唯一标识
    function generateFileId(requestData) {
        // 使用文件名、消息ID、用户ID等信息生成唯一标识
        const fileName = requestData.fileName || '';
        const msgId = requestData.msgId || '';
        const userId = requestData.chatUserId || '';
        return `${fileName}_${msgId}_${userId}`;
    }

    // 检查文件是否已下载过
    function isFileAlreadyDownloaded(requestData) {
        const fileId = generateFileId(requestData);
        return downloadedFiles.has(fileId);
    }

    // 记录文件已下载
    function markFileAsDownloaded(requestData) {
        const fileId = generateFileId(requestData);
        downloadedFiles.add(fileId);
        console.log('📝 记录文件下载:', requestData.fileName, '(ID:', fileId, ')');
    }

    // 设置上传状态
    function setUploadingState(isUpload) {
        isUploading = isUpload;
        if (isUpload) {
            console.log('📤 检测到文件上传，临时禁用下载功能');
            // 清除之前的定时器
            if (uploadTimer) {
                clearTimeout(uploadTimer);
            }
            // 20秒后恢复下载功能
            uploadTimer = setTimeout(() => {
                isUploading = false;
                console.log('✅ 文件上传冷却结束，恢复下载功能');
            }, 20000);
        }
    }

    // 获取配置
    function getConfig(key) {
        return GM_getValue(key, DEFAULT_CONFIG[key]);
    }

    // 设置配置
    function setConfig(key, value) {
        GM_setValue(key, value);
    }

    // 创建设置界面
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 0;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            min-width: 480px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            overflow: hidden;
        `;

        const downloadEnabled = getConfig(CONFIG_KEYS.DOWNLOAD_ENABLED);
        const blacklistEnabled = getConfig(CONFIG_KEYS.BLACKLIST_ENABLED);
        const autoReconnect = getConfig(CONFIG_KEYS.AUTO_RECONNECT);
        const customIconTitle = getConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE);

        panel.innerHTML = `
            <div style="padding: 32px;">

                <h3 style="margin: 0 0 32px 0; font-size: 28px; font-weight: 300; text-align: center;">脚本设置</h3>

                <!-- 自定义图标和标题开关 -->
                <div style="margin: 24px 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                    <div>
                        <div style="font-size: 18px; font-weight: 500; margin-bottom: 4px;">修改标题与图标</div>
                        <div style="color: #888; font-size: 14px;">DDDD</div>
                    </div>
                    <div id="iconTitleToggle" style="
                        width: 60px; height: 32px; border-radius: 16px; cursor: pointer; position: relative;
                        background: ${customIconTitle ? '#E31937' : '#333'};
                        transition: all 0.3s ease;
                    ">
                        <div style="
                            width: 28px; height: 28px; border-radius: 50%; background: white;
                            position: absolute; top: 2px; left: ${customIconTitle ? '30px' : '2px'};
                            transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                    </div>
                </div>

                <!-- 自动重新连接开关 -->
                <div style="margin: 24px 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                    <div>
                        <div style="font-size: 18px; font-weight: 500; margin-bottom: 4px;">自动重新连接(Beta)</div>
                        <div style="color: #888; font-size: 14px;">连接断开时自动点击重新连接</div>
                    </div>
                    <div id="reconnectToggle" style="
                        width: 60px; height: 32px; border-radius: 16px; cursor: pointer; position: relative;
                        background: ${autoReconnect ? '#E31937' : '#333'};
                        transition: all 0.3s ease;
                    ">
                        <div style="
                            width: 28px; height: 28px; border-radius: 50%; background: white;
                            position: absolute; top: 2px; left: ${autoReconnect ? '30px' : '2px'};
                            transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                    </div>
                </div>

                <!-- 下载功能开关 -->
                <div style="margin: 24px 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                    <div>
                        <div style="font-size: 18px; font-weight: 500; margin-bottom: 4px;">启用文件下载功能</div>
                        <div style="color: #888; font-size: 14px;">自动检测并下载聊天中的文件</div>
                    </div>
                    <div id="downloadToggle" style="
                        width: 60px; height: 32px; border-radius: 16px; cursor: pointer; position: relative;
                        background: ${downloadEnabled ? '#E31937' : '#333'};
                        transition: all 0.3s ease;
                    ">
                        <div style="
                            width: 28px; height: 28px; border-radius: 50%; background: white;
                            position: absolute; top: 2px; left: ${downloadEnabled ? '30px' : '2px'};
                            transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                    </div>
                </div>

                <!-- 黑名单开关 -->
                <div style="margin: 24px 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                    <div>
                        <div style="font-size: 18px; font-weight: 500; margin-bottom: 4px;">启用黑名单过滤</div>
                        <div style="color: #888; font-size: 14px;">过滤指定类型的文件</div>
                    </div>
                    <div id="blacklistToggle" style="
                        width: 60px; height: 32px; border-radius: 16px; cursor: pointer; position: relative;
                        background: ${blacklistEnabled ? '#E31937' : '#333'};
                        transition: all 0.3s ease;
                    ">
                        <div style="
                            width: 28px; height: 28px; border-radius: 50%; background: white;
                            position: absolute; top: 2px; left: ${blacklistEnabled ? '30px' : '2px'};
                            transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                    </div>
                </div>

                <!-- 黑名单输入 -->
                <div style="margin: 24px 0;">
                    <label style="font-size: 18px; font-weight: 500; display: block; margin-bottom: 12px;">文件扩展名黑名单</label>
                    <input type="text" id="fileBlacklist" value="${getConfig(CONFIG_KEYS.FILE_BLACKLIST)}"
                           style="
                               width: 100%; padding: 16px; border: 1px solid #333; border-radius: 8px;
                               background: #1a1a1a; color: white; font-size: 16px; box-sizing: border-box;
                               transition: border-color 0.3s ease;
                           "
                           placeholder="例如：.js,.zip,.exe,.bat">
                    <small style="color: #888; font-size: 12px; margin-top: 8px; display: block;">用逗号分隔多个扩展名</small>
                </div>

                <!-- 手机号输入 -->
                <div style="margin: 24px 0;">
                    <label style="font-size: 18px; font-weight: 500; display: block; margin-bottom: 12px;">手机号码</label>
                    <input type="tel" id="phoneNumber" value="${getConfig(CONFIG_KEYS.PHONE_NUMBER)}"
                           style="
                               width: 100%; padding: 16px; border: 1px solid #333; border-radius: 8px;
                               background: #1a1a1a; color: white; font-size: 16px; box-sizing: border-box;
                               transition: border-color 0.3s ease;
                           "
                           placeholder="请输入手机号码">
                    <small style="color: #888; font-size: 12px; margin-top: 8px; display: block;">用于自动登录功能</small>
                </div>

                <!-- 按钮区域 -->
                <div style="margin-top: 40px; display: flex; gap: 16px; justify-content: flex-end;">
                    <button id="cancelSettings" style="
                        padding: 12px 32px; border: 1px solid #333; border-radius: 8px;
                        background: transparent; color: #888; font-size: 16px; cursor: pointer;
                        transition: all 0.3s ease;
                    ">取消</button>
                    <button id="saveSettings" style="
                        padding: 12px 32px; border: none; border-radius: 8px;
                        background: #E31937; color: white; font-size: 16px; cursor: pointer;
                        transition: all 0.3s ease; font-weight: 500;
                    ">保存设置</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 切换按钮状态
        let downloadState = downloadEnabled;
        let blacklistState = blacklistEnabled;
        let reconnectState = autoReconnect;
        let iconTitleState = customIconTitle;

        // 自定义图标标题切换
        const iconTitleToggle = panel.querySelector('#iconTitleToggle');
        iconTitleToggle.onclick = () => {
            iconTitleState = !iconTitleState;
            const toggle = iconTitleToggle.querySelector('div');
            iconTitleToggle.style.background = iconTitleState ? '#E31937' : '#333';
            toggle.style.left = iconTitleState ? '30px' : '2px';
        };

        // 自动重新连接切换
        const reconnectToggle = panel.querySelector('#reconnectToggle');
        reconnectToggle.onclick = () => {
            reconnectState = !reconnectState;
            const toggle = reconnectToggle.querySelector('div');
            reconnectToggle.style.background = reconnectState ? '#E31937' : '#333';
            toggle.style.left = reconnectState ? '30px' : '2px';
        };

        // 下载功能切换
        const downloadToggle = panel.querySelector('#downloadToggle');
        downloadToggle.onclick = () => {
            downloadState = !downloadState;
            const toggle = downloadToggle.querySelector('div');
            downloadToggle.style.background = downloadState ? '#E31937' : '#333';
            toggle.style.left = downloadState ? '30px' : '2px';
        };

        // 黑名单切换
        const blacklistToggle = panel.querySelector('#blacklistToggle');
        blacklistToggle.onclick = () => {
            blacklistState = !blacklistState;
            const toggle = blacklistToggle.querySelector('div');
            blacklistToggle.style.background = blacklistState ? '#E31937' : '#333';
            toggle.style.left = blacklistState ? '30px' : '2px';
        };

        // 输入框焦点效果
        const fileBlacklistInput = panel.querySelector('#fileBlacklist');
        fileBlacklistInput.onfocus = () => {
            fileBlacklistInput.style.borderColor = '#E31937';
        };
        fileBlacklistInput.onblur = () => {
            fileBlacklistInput.style.borderColor = '#333';
        };

        // 按钮悬停效果
        const saveBtn = panel.querySelector('#saveSettings');
        const cancelBtn = panel.querySelector('#cancelSettings');

        saveBtn.onmouseenter = () => {
            saveBtn.style.background = '#ff1f47';
            saveBtn.style.transform = 'translateY(-2px)';
        };
        saveBtn.onmouseleave = () => {
            saveBtn.style.background = '#E31937';
            saveBtn.style.transform = 'translateY(0)';
        };

        cancelBtn.onmouseenter = () => {
            cancelBtn.style.borderColor = '#666';
            cancelBtn.style.color = '#fff';
        };
        cancelBtn.onmouseleave = () => {
            cancelBtn.style.borderColor = '#333';
            cancelBtn.style.color = '#888';
        };

        // 保存设置
        saveBtn.onclick = () => {
            setConfig(CONFIG_KEYS.DOWNLOAD_ENABLED, downloadState);
            setConfig(CONFIG_KEYS.BLACKLIST_ENABLED, blacklistState);
            setConfig(CONFIG_KEYS.FILE_BLACKLIST, fileBlacklistInput.value);
            setConfig(CONFIG_KEYS.PHONE_NUMBER, document.querySelector('#phoneNumber').value);
            setConfig(CONFIG_KEYS.AUTO_RECONNECT, reconnectState);
            setConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE, iconTitleState);
            document.body.removeChild(panel);

            // 显示保存成功提示并刷新页面
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10001;
                background: #E31937; color: white; padding: 16px 24px;
                border-radius: 8px; font-size: 16px; font-weight: 500;
                box-shadow: 0 4px 20px rgba(227, 25, 55, 0.3);
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = '✅ 设置已保存，页面即将刷新...';

            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);

            // 2秒后刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        };

        // 取消设置
        cancelBtn.onclick = () => {
            document.body.removeChild(panel);
        };
    }

    // 注册菜单命令
    GM_registerMenuCommand('打开设置', createSettingsPanel);

    // 检查当前路由是否为登录页
    function isLoginPage() {
        return window.location.href.includes('/chat/#/login');
    }

    // 检查当前路由是否为聊天页
    function isChatPage() {
        return window.location.href.includes('/chat/#/chat');
    }

    // ==================== HTTP 请求监听 ====================

    // 检查文件是否在黑名单中
    function isFileBlacklisted(fileName) {
        if (!getConfig(CONFIG_KEYS.BLACKLIST_ENABLED)) return false;

        const blacklist = getConfig(CONFIG_KEYS.FILE_BLACKLIST).split(',').map(ext => ext.trim().toLowerCase());
        const fileExt = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return blacklist.includes(fileExt);
    }

    // 触发下载按钮点击
    function triggerDownload() {
        // 检查下载节流
        const currentTime = Date.now();
        if (currentTime - lastDownloadTime < DOWNLOAD_THROTTLE_INTERVAL) {
            console.log('⏱️ 下载节流中，跳过本次触发 (距离上次下载', Math.round((currentTime - lastDownloadTime) / 1000), '秒)');
            return false;
        }

        try {
            // 多种选择器尝试查找下载图标
            const selectors = [
                'svg.svg-icon.link use[href="#icon-下载"]',
                'svg[aria-hidden="true"].svg-icon.link use[href="#icon-下载"]',
                'use[href="#icon-下载"]',
                'svg.svg-icon.link',
                '.svg-icon.link'
            ];

            let downloadIcons = [];

            // 尝试不同的选择器
            for (let selector of selectors) {
                downloadIcons = document.querySelectorAll(selector);
                if (downloadIcons.length > 0) {
                    // console.log(`✅ 找到 ${downloadIcons.length} 个下载图标，使用选择器: ${selector}`);
                    break;
                }
            }

            if (downloadIcons.length > 0) {
                // 获取最后一个（最新的）下载图标
                const lastDownloadIcon = downloadIcons[downloadIcons.length - 1];

                // 调试信息：输出元素结构
                console.warn('🔍 找到的下载图标元素:', {
                    tagName: lastDownloadIcon.tagName,
                    className: lastDownloadIcon.className,
                    outerHTML: lastDownloadIcon.outerHTML.substring(0, 200),
                    parentElement: lastDownloadIcon.parentElement ? lastDownloadIcon.parentElement.outerHTML.substring(0, 200) : 'null'
                });

                // 尝试不同的点击目标
                let clickTarget = null;

                if (lastDownloadIcon.tagName === 'use') {
                    // 如果是 use 元素，找到父级 svg
                    clickTarget = lastDownloadIcon.closest('svg');
                } else if (lastDownloadIcon.tagName === 'svg') {
                    // 如果直接是 svg 元素
                    clickTarget = lastDownloadIcon;
                } else {
                    // 其他情况，直接使用该元素
                    clickTarget = lastDownloadIcon;
                }

                console.warn('🎯 选择的点击目标:', {
                    tagName: clickTarget ? clickTarget.tagName : 'null',
                    className: clickTarget ? clickTarget.className : 'null',
                    outerHTML: clickTarget ? clickTarget.outerHTML.substring(0, 200) : 'null'
                });

                if (clickTarget) {
                    // 使用最有效的点击方式
                    try {
                        // 方式1: 直接点击
                        clickTarget.click();
                        lastDownloadTime = Date.now(); // 更新最后下载时间
                        console.log('✅ 自动触发文件下载 (直接点击)');
                        return true;
                    } catch (e) {
                        try {
                            // 方式2: 简化的事件分发 (已验证有效)
                            const clickEvent = new Event('click', { bubbles: true });
                            clickTarget.dispatchEvent(clickEvent);
                            lastDownloadTime = Date.now(); // 更新最后下载时间
                            console.log('✅ 自动触发文件下载 (事件分发)');
                            return true;
                        } catch (e2) {
                            console.error('❌ 下载触发失败:', e2);
                        }
                    }
                }
            } else {
                console.warn('⚠️ 未找到下载图标，可能页面还未完全加载');

                // 尝试查找所有可能的下载相关元素
                const allSvgs = document.querySelectorAll('svg');
                console.log(`🔍 页面中共有 ${allSvgs.length} 个 SVG 元素`);

                // 输出一些调试信息
                allSvgs.forEach((svg, index) => {
                    if (svg.classList.contains('svg-icon') || svg.classList.contains('link')) {
                        console.log(`SVG ${index}:`, svg.outerHTML.substring(0, 100));
                    }
                });
            }
        } catch (error) {
            console.error('❌ 触发下载失败:', error);
        }
        return false;
    }

    // 监听DOM变化，等待新的下载按钮出现
    function watchForNewDownloadButton() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查新增的节点中是否有下载按钮
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 在新增的节点中查找下载图标
                            const downloadIcon = node.querySelector && node.querySelector('svg.svg-icon.link use[href="#icon-下载"]');
                            if (downloadIcon) {
                                console.log('🎯 检测到新的下载按钮，尝试点击');
                                setTimeout(() => {
                                    if (triggerDownload()) {
                                        observer.disconnect(); // 成功后停止监听
                                    }
                                }, 100);
                            }
                        }
                    });
                }
            });
        });

        // 监听聊天区域的变化
        const chatContainer = document.querySelector('.chat-content') ||
                             document.querySelector('.message-list') ||
                             document.querySelector('.chat-messages') ||
                             document.body;

        if (chatContainer) {
            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });

            // 5秒后停止监听，避免无限监听
            setTimeout(() => {
                observer.disconnect();
                console.warn('⏰ DOM监听超时，停止监听新下载按钮');
            }, 5000);
        }
    }

    // 拦截 XMLHttpRequest
    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;

            // 监听请求载荷（发送的数据）
            if (xhr._url) {
                // 检查是否是上传请求
                if (xhr._url.includes('file/upload')) {
                    setUploadingState(true);
                }
                // 检查是否是 add/record 请求
                else if (xhr._url.includes('add/record') && data) {
                    try {
                        let requestData;

                        // 尝试解析请求数据
                        if (typeof data === 'string') {
                            requestData = JSON.parse(data);
                        } else if (data instanceof FormData) {
                            // 如果是 FormData，尝试获取数据
                            const formDataObj = {};
                            for (let [key, value] of data.entries()) {
                                formDataObj[key] = value;
                            }
                            requestData = formDataObj;
                        } else {
                            requestData = data;
                        }

                        console.log('🔍 监听到 add/record 请求载荷:', requestData);

                        // 检查是否是文件类型
                        if (requestData && requestData.chatType === 'file') {
                            console.log('📁 检测到文件消息:', requestData.fileName);

                            // 检查是否启用下载功能且不在上传状态
                            if (!getConfig(CONFIG_KEYS.DOWNLOAD_ENABLED) || isUploading) {
                                console.log('⚠️ 文件下载功能已禁用或正在上传中');
                                return originalSend.call(this, data);
                            }

                            // 检查文件是否在黑名单中
                            if (isFileBlacklisted(requestData.fileName)) {
                                console.log('🚫 文件在黑名单中，跳过下载:', requestData.fileName);
                                return originalSend.call(this, data);
                            }

                            // 延迟触发下载，等待DOM更新
                            setTimeout(() => {
                                triggerDownload();
                            }, 1000);

                            // 如果第一次尝试失败，使用 MutationObserver 监听DOM变化
                            setTimeout(() => {
                                if (!triggerDownload()) {
                                    watchForNewDownloadButton();
                                }
                            }, 2000);
                        }
                    } catch (error) {
                        console.error('❌ 解析请求载荷失败:', error);
                    }
                }
            }

            return originalSend.call(this, data);
        };
    }

    // 拦截 fetch
    function interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = function(...args) {
            const url = args[0];
            const options = args[1] || {};

            // 检查是否是上传请求
            if (url && url.includes && url.includes('file/upload')) {
                setUploadingState(true);
            }
            // 检查是否是 add/record 请求并且有请求体
            else if (url && url.includes && url.includes('add/record') && options.body) {
                try {
                    let requestData;

                    // 尝试解析请求数据
                    if (typeof options.body === 'string') {
                        requestData = JSON.parse(options.body);
                    } else {
                        requestData = options.body;
                    }

                    console.log('🔍 监听到 fetch add/record 请求载荷:', requestData);

                    // 检查是否是文件类型
                    if (requestData && requestData.chatType === 'file') {
                        console.log('📁 检测到文件消息:', requestData.fileName);

                        // 检查是否启用下载功能且不在上传状态
                        if (!getConfig(CONFIG_KEYS.DOWNLOAD_ENABLED) || isUploading) {
                            console.log('⚠️ 文件下载功能已禁用或正在上传中');
                            return originalFetch.apply(this, args);
                        }

                        // 检查文件是否在黑名单中
                        if (isFileBlacklisted(requestData.fileName)) {
                            console.log('🚫 文件在黑名单中，跳过下载:', requestData.fileName);
                            return originalFetch.apply(this, args);
                        }

                        // 延迟触发下载，等待DOM更新
                        setTimeout(() => {
                            triggerDownload();
                        }, 1000);

                        // 如果第一次尝试失败，使用 MutationObserver 监听DOM变化
                        setTimeout(() => {
                            if (!triggerDownload()) {
                                watchForNewDownloadButton();
                            }
                        }, 2000);
                    }
                } catch (error) {
                    console.error('❌ 解析 fetch 请求载荷失败:', error);
                }
            }

            return originalFetch.apply(this, args);
        };
    }

    // ==================== 页面图标和标题修改 ====================

    // 设置图标 SVG (直接嵌入，无背景，居中显示)
    const SETTINGS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`;

    // 将 SVG 转换为 Data URL (无背景，透明)
    const CHROME_SETTINGS_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SETTINGS_ICON_SVG)}`;

    // 修改页面图标和标题
    function updatePageIconAndTitle() {
        // 检查是否启用自定义图标和标题功能
        if (!getConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE)) {
            console.log('⚠️ 自定义图标和标题功能已禁用');
            return;
        }

        try {
            // 修改页面标题
            document.title = 'Settings';

            // 移除所有现有的图标链接
            const existingIcons = document.querySelectorAll('link[rel*="icon"]');
            existingIcons.forEach(icon => icon.remove());

            // 创建新的 favicon (SVG格式，透明背景，居中显示)
            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/svg+xml';
            favicon.href = CHROME_SETTINGS_ICON;
            document.head.appendChild(favicon);

            // 添加额外的图标类型以确保兼容性
            const iconTypes = [
                { rel: 'shortcut icon', type: 'image/svg+xml' },
                { rel: 'apple-touch-icon', type: 'image/svg+xml' }
            ];

            iconTypes.forEach(iconType => {
                const newIcon = document.createElement('link');
                newIcon.rel = iconType.rel;
                newIcon.type = iconType.type;
                newIcon.href = CHROME_SETTINGS_ICON;
                document.head.appendChild(newIcon);
            });

            console.log('✅ 页面图标和标题已更新为 Settings (使用嵌入的SVG图标，无背景，居中显示)');
        } catch (error) {
            console.error('❌ 更新页面图标和标题失败:', error);
        }
    }

    // ==================== 主要功能初始化 ====================

    // 初始化所有功能
    function initializeFeatures() {
        // 修改页面图标和标题
        updatePageIconAndTitle();

        // 监听页面标题变化
        watchTitleChanges();

        // 如果在登录页，执行登录逻辑
        if (isLoginPage()) {
            console.warn('当前是登录页面，执行自动登录');
            executeAutoLogin();
        }

        // 如果在聊天页或登录页，都启动HTTP监听
        if (isChatPage() || isLoginPage()) {
            console.warn('启动HTTP请求监听');
            interceptXHR();
            interceptFetch();
        }

        // 监听连接断开弹窗
        watchDisconnectModal();
    }

    /**
     * 等待元素加载完成
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间(ms)
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                console.error(`等待元素超时: ${selector}`);
                reject(new Error(`等待元素超时: ${selector}`));
            }, timeout);
        });
    }

    /**
     * 设置输入框的值并触发事件
     * @param {Element} input - 输入框元素
     * @param {string} value - 要设置的值
     */
    function setInputValue(input, value) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 主要逻辑 - 短信登录流程
    async function executeAutoLogin() {
        try {
            const phoneNumber = getConfig(CONFIG_KEYS.PHONE_NUMBER);
            if (!phoneNumber) {
                console.warn('未设置手机号，跳过自动登录');
                return;
            }

            // 1.5. 选择COC域名
            try {
                const cocDomain = document.querySelector('.domain-item span');
                if (cocDomain && cocDomain.textContent.includes('COC')) {
                    cocDomain.closest('.domain-item').click();
                    await new Promise(resolve => setTimeout(resolve, 100));
                } else {
                    // 如果没有直接找到，尝试查找所有域名选项
                    const domainItems = document.querySelectorAll('.domain-item');
                    for (let item of domainItems) {
                        if (item.textContent.includes('COC')) {
                            item.click();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('域名选择失败:', error);
            }

            // 2. 点击短信登录标签
            const smsTab = await waitForElement('.ant-tabs-tab');
            if (smsTab) {
                // 查找包含"短信登录"文本的标签
                const tabs = document.querySelectorAll('.ant-tabs-tab');
                for (let tab of tabs) {
                    if (tab.textContent.includes('短信登录')) {
                        tab.click();
                        await new Promise(resolve => setTimeout(resolve, 100));
                        break;
                    }
                }
            }

            // 3. 等待手机号输入框并输入手机号
            const phoneInput = await waitForElement('input[name="phone"]');
            setInputValue(phoneInput, phoneNumber);
            await new Promise(resolve => setTimeout(resolve, 100));

            // 4. 点击发送验证码按钮
            const codeBtn = await waitForElement('.code-btn.mini-font-size');
            codeBtn.click();
            await new Promise(resolve => setTimeout(resolve, 200));

            // 5. 等待验证码输入框并自动填写验证码
            const codeInput = await waitForElement('input[name="code"]');
            setInputValue(codeInput, '123456');
            await new Promise(resolve => setTimeout(resolve, 100));

            // 6. 点击登录按钮
            const loginBtn = await waitForElement('.ant-btn.ant-btn-primary.login-btn');
            loginBtn.click();


        } catch (error) {
            console.error('自动短信登录脚本执行失败:', error);
        }
    }

    // 监听连接断开弹窗
    function watchDisconnectModal() {
        // 检查是否启用自动重新连接
        if (!getConfig(CONFIG_KEYS.AUTO_RECONNECT)) {
            console.log('⚠️ 自动重新连接功能已禁用');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是连接断开弹窗
                            const modalContent = node.querySelector('.ant-modal-confirm-content');
                            if (modalContent && modalContent.textContent.includes('连接断开，请刷新重试')) {
                                console.log('🔍 检测到连接断开弹窗，尝试自动重新连接');
                                // 查找并点击重新连接按钮
                                const reconnectBtn = node.querySelector('.ant-modal-confirm-btns .ant-btn:not(.ant-btn-primary)');
                                if (reconnectBtn) {
                                    setTimeout(() => {
                                        reconnectBtn.click();
                                        console.log('✅ 已点击重新连接按钮');
                                    }, 500);
                                }
                            }
                        }
                    });
                }
            });
        });

        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监听页面标题变化，确保始终显示 Settings
    function watchTitleChanges() {
        // 检查是否启用自定义图标和标题功能
        if (!getConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE)) {
            return;
        }

        // 创建一个 MutationObserver 来监听 title 元素的变化
        const titleObserver = new MutationObserver(() => {
            if (getConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE) && document.title !== 'Settings') {
                document.title = 'Settings';
                console.log('🔄 页面标题已重置为 Settings');
            }
        });

        // 监听 head 元素的变化
        if (document.head) {
            titleObserver.observe(document.head, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        // 定期检查标题（备用方案）
        setInterval(() => {
            if (getConfig(CONFIG_KEYS.CUSTOM_ICON_TITLE) && document.title !== 'Settings') {
                document.title = 'Settings';
            }
        }, 2000);
    }

    // ==================== 脚本启动 ====================

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        initializeFeatures();
    } else {
        window.addEventListener('load', () => {
            initializeFeatures();
        });
    }

    // 添加延迟执行作为备用方案
    setTimeout(() => {
        initializeFeatures();
    }, 1000);
})();
