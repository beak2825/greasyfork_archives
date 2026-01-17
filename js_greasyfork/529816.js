// ==UserScript==
// @name         ImgBed Markdown Uploader
// @name:zh-CN   ImgBed Markdown 上传
// @namespace    http://tampermonkey.net/
// @version      0.5.0-beta
// @description  适配于 CloudFlare-ImgBed 的粘贴上传并生成markdown的脚本, CloudFlare-ImgBed : https://github.com/MarSeventh/CloudFlare-ImgBed
// @description:zh-CN 适配于 CloudFlare-ImgBed 的粘贴上传并生成markdown的脚本, CloudFlare-ImgBed : https://github.com/MarSeventh/CloudFlare-ImgBed
// @description:zh-cn 适配于 CloudFlare-ImgBed 的粘贴上传并生成markdown的脚本, CloudFlare-ImgBed : https://github.com/MarSeventh/CloudFlare-ImgBed
// @author       calg
// @match        https://*.linux.do/*
// @match        https://*.nodeseek.com/*
// @exclude      *://*/*.jpg*
// @exclude      *://*/*.jpeg*
// @exclude      *://*/*.png*
// @exclude      *://*/*.gif*
// @exclude      *://*/*.webp*
// @exclude      *://*/*.pdf*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_unregisterMenuCommand
// @grant        GM_log
// @license      MIT
// @icon         https://raw.githubusercontent.com/MarSeventh/CloudFlare-ImgBed/refs/heads/main/logo.png
// @downloadURL https://update.greasyfork.org/scripts/529816/ImgBed%20Markdown%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/529816/ImgBed%20Markdown%20Uploader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 防止重复注入
    if (window.imageUploaderInitialized) {
        return;
    }
    window.imageUploaderInitialized = true;

    // 创建一个唯一的命名空间
    const SCRIPT_NAMESPACE = 'image_uploader_' + GM_info.script.version.replace(/\./g, '_');

    // 存储菜单命令ID
    let menuCommandId = null;

    const MENU_LABEL_CONFIG = '配置图床参数';

    // 简单的字符混淆处理 (保护 API Key)
    function obfuscate(str) {
        if (!str || str === 'AUTH_CODE') return str;
        try {
            const shifted = str.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 5)).join('');
            return btoa(shifted);
        } catch (e) { return str; }
    }

    function deobfuscate(str) {
        if (!str || str === 'AUTH_CODE') return str;
        try {
            const decoded = atob(str);
            return decoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 5)).join('');
        } catch (e) { return str; }
    }

    // 检查是否已经存在事件监听器
    function hasEventListener(element, eventName) {
        const key = `${SCRIPT_NAMESPACE}_${eventName}`;
        return element[key] === true;
    }

    // 标记事件监听器已添加
    function markEventListener(element, eventName) {
        const key = `${SCRIPT_NAMESPACE}_${eventName}`;
        element[key] = true;
    }

    function setupSidebarScrolling(sidebar) {
        if (!sidebar) return;
        const initKey = `${SCRIPT_NAMESPACE}_sidebar_scroll_setup`;
        if (sidebar[initKey]) return;
        sidebar[initKey] = true;

        const header = sidebar.querySelector('.img-upload-sidebar-header');
        const tabs = sidebar.querySelector('.img-upload-sidebar-tabs');
        const scroller = sidebar.querySelector('.img-upload-sidebar-content');
        if (!scroller) return;

        const updateScrollerHeight = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            const tabsHeight = tabs ? tabs.offsetHeight : 0;
            const available = window.innerHeight - headerHeight - tabsHeight;
            scroller.style.height = `${Math.max(0, available)}px`;
            scroller.style.overflowY = 'auto';
            scroller.style.minHeight = '0';
            scroller.style.webkitOverflowScrolling = 'touch';
        };

        updateScrollerHeight();
        window.addEventListener('resize', updateScrollerHeight);

        if (!hasEventListener(scroller, 'wheel')) {
            scroller.addEventListener('wheel', (e) => {
                if (scroller.scrollHeight <= scroller.clientHeight + 1) return;
                scroller.scrollTop += e.deltaY;
                e.preventDefault();
            }, { passive: false });
            markEventListener(scroller, 'wheel');
        }
    }

    // 默认配置信息
    const DEFAULT_CONFIG = {
        AUTH_CODE: 'AUTH_CODE', // 替换为你的认证码
        SERVER_URL: 'https://SERVER_URL', // 替换为实际的服务器地址
        UPLOAD_PARAMS: {
            serverCompress: true,
            uploadChannel: 'telegram', // 可选 telegram 和 cfr2
            autoRetry: true,
            uploadNameType: 'index', // 可选值为[default, index, origin, short]
            returnFormat: 'full',
            uploadFolder: 'apiupload' // 指定上传目录，用相对路径表示，例如上传到img/test目录需填img/test
        },
        NOTIFICATION_DURATION: 3000, // 通知显示时间（毫秒）
        MARKDOWN_TEMPLATE: '![{filename}]({url})', // Markdown 模板
        AUTO_COPY_URL: false, // 是否自动复制URL到剪贴板
        MAX_FILE_SIZE: 5 * 1024 * 1024 // 最大文件大小（5MB）
    };

    // 获取用户配置并确保所有必需的字段都存在
    const userConfig = GM_getValue('userConfig', {});

    // 如果存在加密的 AUTH_CODE，先解密
    if (userConfig.AUTH_CODE) {
        userConfig.AUTH_CODE = deobfuscate(userConfig.AUTH_CODE);
    }

    let CONFIG = {};

    // 深度合并配置
    function mergeConfig(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = target[key] || {};
                mergeConfig(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    // 确保所有默认配置项都存在
    CONFIG = mergeConfig({ ...DEFAULT_CONFIG }, userConfig);

    // 验证配置的完整性
    function validateConfig() {
        if (typeof CONFIG.NOTIFICATION_DURATION !== 'number') {
            CONFIG.NOTIFICATION_DURATION = DEFAULT_CONFIG.NOTIFICATION_DURATION;
        }
        if (typeof CONFIG.MAX_FILE_SIZE !== 'number') {
            CONFIG.MAX_FILE_SIZE = DEFAULT_CONFIG.MAX_FILE_SIZE;
        }
        if (typeof CONFIG.MARKDOWN_TEMPLATE !== 'string') {
            CONFIG.MARKDOWN_TEMPLATE = DEFAULT_CONFIG.MARKDOWN_TEMPLATE;
        }
        if (typeof CONFIG.AUTO_COPY_URL !== 'boolean') {
            CONFIG.AUTO_COPY_URL = DEFAULT_CONFIG.AUTO_COPY_URL;
        }
    }

    validateConfig();

    GM_addStyle(`
        :root {
            --img-ui-primary: #2563eb;
            --img-ui-bg: rgba(255, 255, 255, 0.85);
            --img-ui-text: #1e293b;
            --img-ui-border: rgba(226, 232, 240, 0.8);
            --img-ui-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .img-upload-notification {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 12px 20px;
            border-radius: 12px;
            z-index: 10001;
            max-width: 320px;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: var(--img-ui-shadow);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .img-upload-notification.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .img-upload-success {
            background-color: rgba(34, 197, 94, 0.9);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .img-upload-error {
            background-color: rgba(239, 68, 68, 0.9);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .img-upload-info {
            background-color: rgba(37, 99, 235, 0.9);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .img-upload-close {
            cursor: pointer;
            font-size: 16px;
            opacity: 0.7;
            transition: opacity 0.2s;
            line-height: 1;
        }
        .img-upload-close:hover {
            opacity: 1;
        }

        .img-upload-sidebar {
            position: fixed;
            top: 0;
            right: -420px;
            width: 400px;
            height: 100vh;
            height: 100dvh;
            background: var(--img-ui-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-left: 1px solid var(--img-ui-border);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
            z-index: 10000;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            color: var(--img-ui-text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            pointer-events: auto;
            overflow: hidden;
        }
        .img-upload-sidebar.show {
            right: 0;
        }
        .img-upload-sidebar-header {
            padding: 24px;
            border-bottom: 1px solid var(--img-ui-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .img-upload-sidebar-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }
        .img-upload-sidebar-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
            min-height: 0;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
        }
        .img-upload-form-group {
            margin-bottom: 24px;
        }
        .img-upload-form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }
        .img-upload-help-text {
            margin-top: 6px;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.4;
        }
        .img-upload-form-group input:not([type="checkbox"]):not([type="radio"]),
        .img-upload-form-group textarea,
        .img-upload-form-group select {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.8);
            color: #1e293b;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .img-upload-form-group input:focus,
        .img-upload-form-group select:focus,
        .img-upload-form-group textarea:focus {
            outline: none;
            border-color: var(--img-ui-primary);
            background: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .img-upload-buttons {
            padding: 24px;
            border-top: 1px solid var(--img-ui-border);
            display: flex;
            gap: 12px;
            background: rgba(255, 255, 255, 0.5);
            position: sticky;
            bottom: 0;
            z-index: 1;
        }
        .img-upload-button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .img-upload-button-primary {
            background: var(--img-ui-primary);
            color: white;
        }
        .img-upload-button-primary:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }
        .img-upload-button-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        .img-upload-button-secondary:hover {
            background: #e5e7eb;
        }
        .img-upload-input-group {
            display: flex;
            align-items: center;
        }
        .img-upload-input-group input {
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
        }
        .img-upload-input-group-text {
            padding: 10px 14px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: none;
            border-radius: 0 10px 10px 0;
            color: #64748b;
            font-size: 14px;
        }
        .img-upload-checkbox-label {
            display: flex !important;
            align-items: center;
            font-weight: 500 !important;
            cursor: pointer;
        }
        .img-upload-checkbox-label input {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            cursor: pointer;
        }

        .img-upload-dropzone {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(37, 99, 235, 0.1);
            backdrop-filter: blur(4px);
            z-index: 9999;
            box-sizing: border-box;
        }
        .img-upload-dropzone.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .img-upload-dropzone-message {
            background: white;
            padding: 32px 48px;
            border-radius: 24px;
            font-size: 20px;
            font-weight: 700;
            color: var(--img-ui-primary);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
            border: 2px dashed var(--img-ui-primary);
        }
        .img-upload-sidebar-tabs {
            display: flex;
            padding: 0 24px;
            border-bottom: 1px solid var(--img-ui-border);
            gap: 20px;
        }
        .img-upload-tab {
            padding: 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        .img-upload-tab.active {
            color: var(--img-ui-primary);
            border-bottom-color: var(--img-ui-primary);
        }
        .img-upload-tab-panel {
            display: none;
            flex-direction: column;
        }
        .img-upload-tab-panel.active {
            display: flex;
        }

        .img-upload-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
            padding: 4px;
        }
        .img-upload-gallery-item {
            position: relative;
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            background: #f1f5f9;
            border: 1px solid var(--img-ui-border);
            cursor: pointer;
            transition: transform 0.2s;
        }
        .img-upload-gallery-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .img-upload-gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .img-upload-gallery-actions {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            padding: 4px;
            display: flex;
            justify-content: center;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .img-upload-gallery-item:hover .img-upload-gallery-actions {
            opacity: 1;
        }
        .img-upload-gallery-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .img-upload-gallery-btn:hover {
            background: rgba(255, 255, 255, 0.4);
        }
        .img-upload-load-more {
            width: auto;
            align-self: center;
            padding: 8px 16px;
            margin: 16px 0;
            background: transparent;
            border: 1px solid var(--img-ui-border);
            border-radius: 20px;
            color: #64748b;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .img-upload-gallery-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 4px;
            margin-bottom: 10px;
        }
        .img-upload-refresh-btn {
            background: none;
            border: none;
            color: var(--img-ui-primary);
            font-size: 13px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .img-upload-refresh-btn:hover {
            opacity: 0.8;
        }
        .img-upload-gallery-btn-danger:hover {
            background: rgba(239, 68, 68, 0.6) !important;
        }
    `);

    // 添加通知样式
    // 创建或获取配置侧边栏
    function getOrCreateSidebar() {
        let sidebar = document.getElementById('img-upload-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'img-upload-sidebar';
            sidebar.className = 'img-upload-sidebar';
            document.body.appendChild(sidebar);
        }
        return sidebar;
    }

    // 创建配置界面 (侧边栏模式)
    function createConfigModal() {
        const sidebar = getOrCreateSidebar();

        const content = `
            <div class="img-upload-sidebar-header">
                <div>
                    <h2>图床助手</h2>
                    <a href="https://cfbed.sanyue.de/api/" target="_blank" style="font-size: 12px; color: var(--img-ui-primary); text-decoration: none; font-weight: 500;">查看 API 文档</a>
                </div>
                <div class="img-upload-close" id="img-upload-sidebar-close">✕</div>
            </div>
            <div class="img-upload-sidebar-tabs">
                <div class="img-upload-tab active" data-tab="gallery">图库</div>
                <div class="img-upload-tab" data-tab="config">设置</div>
            </div>
            <div class="img-upload-sidebar-content">
                <!-- 图库面板 -->
                <div class="img-upload-tab-panel active" id="img-upload-panel-gallery">
                    <div class="img-upload-gallery-header">
                        <span style="font-size: 12px; color: #94a3b8;">${CONFIG.UPLOAD_PARAMS.uploadFolder || 'apiupload'} 目录</span>
                        <button id="img-upload-refresh-gallery" class="img-upload-refresh-btn">
                            <span>↻</span> 刷新列表
                        </button>
                    </div>
                    <div id="img-upload-gallery-container" class="img-upload-gallery-grid">
                        <div style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px 0;">
                            正在加载图片...
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; width: 100%;">
                        <button id="img-upload-load-more-btn" class="img-upload-load-more" style="display: none;">加载更多</button>
                    </div>
                </div>

                <!-- 设置面板 -->
                <div class="img-upload-tab-panel" id="img-upload-panel-config">
                    <form id="img-upload-config-form">
                        <div class="img-upload-form-group">
                            <label>认证码</label>
                            <input type="password" name="AUTH_CODE" value="${CONFIG.AUTH_CODE}" required>
                            <div class="img-upload-help-text">用于验证上传和列表请求的密钥</div>
                        </div>
                        <div class="img-upload-form-group">
                            <label>服务器地址</label>
                            <input type="text" name="SERVER_URL" value="${CONFIG.SERVER_URL}" required>
                            <div class="img-upload-help-text">图床服务器的URL地址</div>
                        </div>
                        <div class="img-upload-form-group">
                            <label>上传通道</label>
                            <select name="uploadChannel">
                                <option value="telegram" ${CONFIG.UPLOAD_PARAMS.uploadChannel === 'telegram' ? 'selected' : ''}>Telegram</option>
                                <option value="cfr2" ${CONFIG.UPLOAD_PARAMS.uploadChannel === 'cfr2' ? 'selected' : ''}>CloudFlare R2</option>
                                <option value="s3" ${CONFIG.UPLOAD_PARAMS.uploadChannel === 's3' ? 'selected' : ''}>S3 Compatible</option>
                                <option value="discord" ${CONFIG.UPLOAD_PARAMS.uploadChannel === 'discord' ? 'selected' : ''}>Discord</option>
                                <option value="huggingface" ${CONFIG.UPLOAD_PARAMS.uploadChannel === 'huggingface' ? 'selected' : ''}>HuggingFace</option>
                            </select>
                        </div>
                        <div class="img-upload-form-group">
                            <label>文件命名方式</label>
                            <select name="uploadNameType">
                                <option value="default" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'default' ? 'selected' : ''}>默认（前缀_原名）</option>
                                <option value="index" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'index' ? 'selected' : ''}>仅前缀</option>
                                <option value="origin" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'origin' ? 'selected' : ''}>仅原名</option>
                                <option value="short" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'short' ? 'selected' : ''}>短链接</option>
                            </select>
                        </div>
                        <div class="img-upload-form-group">
                            <label>上传目录</label>
                            <input type="text" name="uploadFolder" value="${CONFIG.UPLOAD_PARAMS.uploadFolder}">
                            <div class="img-upload-help-text">相对路径，例如：apiupload</div>
                        </div>
                        <div class="img-upload-form-group">
                            <label>Markdown模板</label>
                            <input type="text" name="MARKDOWN_TEMPLATE" value="${CONFIG.MARKDOWN_TEMPLATE}">
                            <div class="img-upload-help-text">支持 {filename} 和 {url}</div>
                        </div>
                        <div class="img-upload-form-group">
                            <label>最大文件大小</label>
                            <div class="img-upload-input-group">
                                <input type="number" name="MAX_FILE_SIZE" value="${CONFIG.MAX_FILE_SIZE / 1024 / 1024}" min="1" step="1">
                                <span class="img-upload-input-group-text">MB</span>
                            </div>
                        </div>
                        <div class="img-upload-form-group">
                            <label class="img-upload-checkbox-label">
                                <input type="checkbox" name="AUTO_COPY_URL" ${CONFIG.AUTO_COPY_URL ? 'checked' : ''}>
                                自动复制URL到剪贴板
                            </label>
                        </div>
                    </form>
                    <div class="img-upload-buttons">
                        <button type="button" class="img-upload-button img-upload-button-secondary" id="img-upload-reset">重置</button>
                        <button type="submit" form="img-upload-config-form" class="img-upload-button img-upload-button-primary">保存设置</button>
                    </div>
                </div>
            </div>
        `;

        sidebar.innerHTML = content;
        setupSidebarScrolling(sidebar);

        // 使用 timeout 确保 DOM 渲染后再添加 show 类触发动画
        setTimeout(() => {
            sidebar.classList.add('show');
            // 默认加载图库
            fetchGallery(false);
        }, 10);

        // 事件处理
        const form = sidebar.querySelector('#img-upload-config-form');
        const closeBtn = sidebar.querySelector('#img-upload-sidebar-close');
        const resetBtn = sidebar.querySelector('#img-upload-reset');
        const tabs = sidebar.querySelectorAll('.img-upload-tab');
        const refreshBtn = sidebar.querySelector('#img-upload-refresh-gallery');
        const loadMoreBtn = sidebar.querySelector('#img-upload-load-more-btn');
        const galleryContainer = sidebar.querySelector('#img-upload-gallery-container');

        let galleryStart = 0;
        const galleryCount = 30;

        // 切换标签
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                sidebar.querySelectorAll('.img-upload-tab-panel').forEach(p => p.classList.remove('active'));
                sidebar.querySelector(`#img-upload-panel-${targetPanel}`).classList.add('active');

                // 首次切换到图库时自动加载
                if (targetPanel === 'gallery' && galleryStart === 0) {
                    fetchGallery(false);
                }
            });
        });

        // 获取图片列表
        async function fetchGallery(isLoadMore = false) {
            if (!requireRuntimeConfig('获取图片列表')) {
                const msg = `未完成图床配置，请先在油猴菜单中打开「${MENU_LABEL_CONFIG}」填写认证码与服务器地址。`;
                if (!isLoadMore) {
                    galleryContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #f44336; padding: 40px 0;">${escapeHtml(msg)}</div>`;
                }
                loadMoreBtn.style.display = 'none';
                loadMoreBtn.disabled = false;
                return;
            }

            if (!isLoadMore) {
                galleryStart = 0;
                galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px 0;">正在加载...</div>';
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.textContent = '加载中...';
                loadMoreBtn.disabled = true;
            }

            const queryParams = new URLSearchParams({
                start: galleryStart,
                count: galleryCount,
                dir: CONFIG.UPLOAD_PARAMS.uploadFolder || 'apiupload'
            }).toString();

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.SERVER_URL}/api/manage/list?${queryParams}`,
                headers: {
                    'Authorization': `Bearer ${CONFIG.AUTH_CODE}`
                },
                onload: function (response) {
                    loadMoreBtn.disabled = false;

                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.files && result.files.length > 0) {
                                if (!isLoadMore) galleryContainer.innerHTML = '';

                                result.files.forEach(file => {
                                    const baseUrl = CONFIG.SERVER_URL.replace(/\/+$/, '');
                                    const imageUrl = `${baseUrl}/file/${file.name.replace(/^\/+/, '')}`;

                                    const item = document.createElement('div');
                                    item.className = 'img-upload-gallery-item';
                                    item.innerHTML = `
                                        <img src="${imageUrl}" loading="lazy">
                                        <div class="img-upload-gallery-actions">
                                            <button class="img-upload-gallery-btn" data-action="copy">复制</button>
                                            <button class="img-upload-gallery-btn img-upload-gallery-btn-danger" data-action="delete">删除</button>
                                        </div>
                                    `;

                                    // 操作事件
                                    item.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        copyToClipboard(imageUrl);
                                    });

                                    item.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        if (confirm('确定要删除这张图片吗？此操作不可恢复。')) {
                                            if (!requireRuntimeConfig('删除图片')) return;
                                            const deleteUrl = `${CONFIG.SERVER_URL}/api/manage/delete/${encodeURIComponent(file.name.replace(/^\/+/, ''))}`;
                                            GM_xmlhttpRequest({
                                                method: 'GET',
                                                url: deleteUrl,
                                                headers: {
                                                    'Authorization': `Bearer ${CONFIG.AUTH_CODE}`
                                                },
                                                onload: function (response) {
                                                    if (response.status === 200) {
                                                        showNotification('图片已删除', 'success');
                                                        item.remove();
                                                    } else {
                                                        showNotification(buildHttpErrorMessage('删除图片', response), 'error');
                                                    }
                                                },
                                                onerror: function () {
                                                    showNotification(buildNetworkErrorMessage('删除图片'), 'error');
                                                }
                                            });
                                        }
                                    });

                                    galleryContainer.appendChild(item);
                                });

                                galleryStart += result.files.length;
                                if (result.files.length >= galleryCount) {
                                    loadMoreBtn.style.display = 'block';
                                    loadMoreBtn.textContent = '加载更多';
                                } else {
                                    loadMoreBtn.style.display = 'none';
                                }
                            } else {
                                if (!isLoadMore) {
                                    galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px 0;">暂无图片</div>';
                                }
                                loadMoreBtn.style.display = 'none';
                            }
                        } catch (e) {
                            showNotification(`解析图片列表响应失败：${e.message}。请确认后端返回的是 JSON，且接口路径正确。`, 'error');
                        }
                    } else {
                        const msg = buildHttpErrorMessage('获取图片列表', response);
                        showNotification(msg, 'error');
                        if (!isLoadMore) {
                            galleryContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #f44336; padding: 40px 0;">${escapeHtml(msg)}</div>`;
                        }
                        loadMoreBtn.style.display = 'none';
                    }
                },
                onerror: function () {
                    const msg = buildNetworkErrorMessage('获取图片列表');
                    showNotification(msg, 'error');
                    if (!isLoadMore) {
                        galleryContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #f44336; padding: 40px 0;">${escapeHtml(msg)}</div>`;
                    }
                    loadMoreBtn.disabled = false;
                }
            });
        }

        // 刷新列表
        refreshBtn.addEventListener('click', () => fetchGallery(false));

        // 加载更多
        loadMoreBtn.addEventListener('click', () => fetchGallery(true));

        function closeSidebar() {
            sidebar.classList.remove('show');
        }

        closeBtn.addEventListener('click', closeSidebar);

        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有配置到默认值吗？')) {
                CONFIG = { ...DEFAULT_CONFIG };
                GM_setValue('userConfig', {});
                showNotification('配置已重置为默认值！', 'success');
                closeSidebar();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(form);
                const newConfig = {
                    AUTH_CODE: formData.get('AUTH_CODE'),
                    SERVER_URL: formData.get('SERVER_URL').replace(/\/+$/, ''),
                    UPLOAD_PARAMS: {
                        ...DEFAULT_CONFIG.UPLOAD_PARAMS,
                        uploadChannel: formData.get('uploadChannel'),
                        uploadNameType: formData.get('uploadNameType'),
                        uploadFolder: formData.get('uploadFolder')
                    },
                    MARKDOWN_TEMPLATE: formData.get('MARKDOWN_TEMPLATE'),
                    MAX_FILE_SIZE: parseFloat(formData.get('MAX_FILE_SIZE')) * 1024 * 1024,
                    AUTO_COPY_URL: formData.get('AUTO_COPY_URL') === 'on'
                };

                CONFIG = mergeConfig({ ...DEFAULT_CONFIG }, newConfig);

                // 保存时加密 AUTH_CODE
                const configToSave = JSON.parse(JSON.stringify(CONFIG));
                configToSave.AUTH_CODE = obfuscate(configToSave.AUTH_CODE);
                GM_setValue('userConfig', configToSave);

                showNotification('配置已更新！', 'success');
                closeSidebar();
            } catch (error) {
                showNotification(`保存配置失败：${error.message}。请检查服务器地址格式（需以 http:// 或 https:// 开头）以及各项输入是否完整。`, 'error');
            }
        });
    }

    // 添加日志函数
    function log(message, type = 'info') {
        const prefix = '[Image Uploader]';
        switch (type) {
            case 'error':
                console.error(`${prefix} ❌ ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️ ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ ${message}`);
                break;
            default:
                console.log(`${prefix} ℹ️ ${message}`);
        }
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, (ch) => {
            switch (ch) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return ch;
            }
        });
    }

    function isPlaceholderAuthCode(value) {
        const v = String(value || '').trim();
        return !v || v === 'AUTH_CODE';
    }

    function isPlaceholderServerUrl(value) {
        const v = String(value || '').trim();
        return !v || v === 'https://SERVER_URL' || v.includes('SERVER_URL');
    }

    function getRuntimeConfigProblems() {
        const problems = [];
        if (isPlaceholderAuthCode(CONFIG.AUTH_CODE)) {
            problems.push('未配置认证码（AUTH_CODE/API Key）');
        }
        if (isPlaceholderServerUrl(CONFIG.SERVER_URL)) {
            problems.push('未配置服务器地址（SERVER_URL）');
        } else if (!/^https?:\/\//i.test(String(CONFIG.SERVER_URL || '').trim())) {
            problems.push('服务器地址必须以 http:// 或 https:// 开头');
        }
        return problems;
    }

    function requireRuntimeConfig(actionName, { notify = true } = {}) {
        const problems = getRuntimeConfigProblems();
        if (problems.length === 0) return true;

        const message = `${actionName}前请先完成配置：${problems.join('；')}。请在油猴菜单中打开「${MENU_LABEL_CONFIG}」进行设置。`;
        if (notify) showNotification(message, 'error');
        return false;
    }

    function safeParseJson(text) {
        if (typeof text !== 'string' || !text.trim()) return null;
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    }

    function extractMessageFromBody(responseText) {
        const json = safeParseJson(responseText);
        if (!json) return '';
        if (typeof json === 'string') return json;
        if (Array.isArray(json)) return '';
        return String(json.message || json.msg || json.error || json.detail || '').trim();
    }

    function truncateForToast(text, maxLen = 120) {
        const s = String(text || '').replace(/\s+/g, ' ').trim();
        if (s.length <= maxLen) return s;
        return s.slice(0, maxLen) + '…';
    }

    function buildHttpErrorMessage(actionName, response) {
        const status = Number(response && response.status);
        const statusText = String((response && response.statusText) || '').trim();
        const bodyMessage = extractMessageFromBody(response && response.responseText);
        const detail = truncateForToast(bodyMessage || statusText);

        let base = '';
        switch (status) {
            case 400:
                base = `${actionName}失败（400）：请求参数错误。请检查通道/目录/命名方式等参数是否为后端支持的值。`;
                break;
            case 401:
                base = `${actionName}失败（401）：认证失败，认证码/API Key 错误或已过期。请打开「${MENU_LABEL_CONFIG}」更新 AUTH_CODE，并确认 SERVER_URL 指向你的图床服务。`;
                break;
            case 403:
                base = `${actionName}失败（403）：无权限访问该接口。请确认该认证码具备对应权限（如“列表/删除/上传”）。`;
                break;
            case 404:
                base = `${actionName}失败（404）：接口不存在。请检查 SERVER_URL 是否正确，以及后端版本是否支持该接口。`;
                break;
            case 413:
                base = `${actionName}失败（413）：文件过大，超过服务器限制。可在「${MENU_LABEL_CONFIG}」调整“最大文件大小”，并确认后端上传限制。`;
                break;
            case 415:
                base = `${actionName}失败（415）：不支持的文件类型。请上传图片（image/*）。`;
                break;
            case 429:
                base = `${actionName}失败（429）：请求过于频繁，请稍后再试。`;
                break;
            default:
                if (status >= 500 && status <= 599) {
                    base = `${actionName}失败（${status}）：服务器异常。请查看后端日志或稍后重试。`;
                } else if (status > 0) {
                    base = `${actionName}失败（${status}）。`;
                } else {
                    base = `${actionName}失败：请求未完成（可能是网络/证书/拦截问题）。请检查 SERVER_URL 是否可访问。`;
                }
        }

        if (detail && !base.includes(detail)) {
            return `${base}（${detail}）`;
        }
        return base;
    }

    function buildNetworkErrorMessage(actionName) {
        return `${actionName}失败：网络错误，无法连接到图床服务器。请检查 SERVER_URL 是否可访问/HTTPS 证书是否正常，并在「${MENU_LABEL_CONFIG}」确认配置。`;
    }

    // 显示通知的函数
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `img-upload-notification img-upload-${type}`;

        const closeBtn = document.createElement('span');
        closeBtn.className = 'img-upload-close';
        closeBtn.textContent = '✕';
        closeBtn.onclick = () => removeNotification(notification);

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;

        notification.appendChild(closeBtn);
        notification.appendChild(messageSpan);
        document.body.appendChild(notification);

        // 添加显示动画
        setTimeout(() => notification.classList.add('show'), 10);

        // 自动消失
        const timeout = setTimeout(() => removeNotification(notification), CONFIG.NOTIFICATION_DURATION);

        // 鼠标悬停时暂停消失
        notification.addEventListener('mouseenter', () => clearTimeout(timeout));
        notification.addEventListener('mouseleave', () => setTimeout(() => removeNotification(notification), 1000));
    }

    // 移除通知
    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification('链接已复制到剪贴板！', 'success');
        } catch (err) {
            showNotification(`复制失败：${err && err.message ? err.message : '浏览器禁止写入剪贴板'}。请手动复制链接。`, 'error');
        }
        document.body.removeChild(textarea);
    }

    // 检查文件大小
    function checkFileSize(file) {
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            const sizeMb = (file.size / 1024 / 1024).toFixed(2);
            const limitMb = Math.round(CONFIG.MAX_FILE_SIZE / 1024 / 1024);
            showNotification(`文件过大：${sizeMb}MB，超过当前限制 ${limitMb}MB。可在「${MENU_LABEL_CONFIG}」调整“最大文件大小”，并确认后端限制。`, 'error');
            return false;
        }
        return true;
    }

    // 修改事件监听器添加方式
    function addPasteListener() {
        if (hasEventListener(document, 'paste')) {
            return;
        }

        document.addEventListener('paste', async function (event) {
            const activeElement = document.activeElement;
            if (!activeElement || !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
                return;
            }

            const items = event.clipboardData.items;
            let hasImage = false;

            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    hasImage = true;
                    event.preventDefault();
                    const blob = item.getAsFile();

                    if (!checkFileSize(blob)) {
                        return;
                    }

                    if (!requireRuntimeConfig('上传图片')) {
                        return;
                    }
                    showNotification('正在上传图片，请稍候...', 'info');
                    await uploadImage(blob, activeElement);
                    break;
                }
            }

            if (!hasImage) {
                return;
            }
        });

        markEventListener(document, 'paste');
    }

    // 上传图片
    async function uploadImage(blob, targetElement) {
        if (!requireRuntimeConfig('上传图片')) return;

        const formData = new FormData();
        const filename = `pasted-image-${Date.now()}.png`;
        formData.append('file', blob, filename);

        log(`开始上传图片: ${filename} (${(blob.size / 1024).toFixed(2)}KB)`);
        log(`上传参数: ${JSON.stringify(CONFIG.UPLOAD_PARAMS, null, 2)}`);

        const queryParams = new URLSearchParams({
            ...CONFIG.UPLOAD_PARAMS
        }).toString();

        try {
            log(`正在发送请求到: ${CONFIG.SERVER_URL}/upload`);
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.SERVER_URL}/upload?${queryParams}`,
                headers: {
                    'Authorization': `Bearer ${CONFIG.AUTH_CODE}`
                },
                data: formData,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            log(`服务器响应: ${JSON.stringify(result, null, 2)}`);

                            if (result && result.length > 0) {
                                let imageUrl = result[0].src;
                                if (!imageUrl.startsWith('http')) {
                                    // 处理相对路径，确保 URL 拼接正确
                                    const baseUrl = CONFIG.SERVER_URL.replace(/\/+$/, '');
                                    const path = imageUrl.replace(/^\/+/, '');
                                    imageUrl = `${baseUrl}/file/${path}`;
                                }
                                log(`上传成功，图片URL: ${imageUrl}`, 'success');
                                insertMarkdownImage(imageUrl, targetElement, filename);
                                showNotification('图片上传成功！', 'success');

                                if (CONFIG.AUTO_COPY_URL) {
                                    log('自动复制URL到剪贴板');
                                    copyToClipboard(imageUrl);
                                }
                            } else {
                                const errorMsg = '上传成功但未获取到图片链接，请检查服务器响应';
                                log(errorMsg, 'error');
                                showNotification(errorMsg, 'error');
                            }
                        } catch (e) {
                            const errorMsg = `解析上传响应失败：${e.message}。后端可能返回了非 JSON 内容，请检查 SERVER_URL/反代配置。`;
                            log(errorMsg, 'error');
                            log(`原始响应: ${response.responseText}`, 'error');
                            showNotification(errorMsg, 'error');
                        }
                    } else {
                        const errorMsg = buildHttpErrorMessage('上传图片', response);
                        log(`上传失败: 状态码 ${response.status}`, 'error');
                        if (response && typeof response.responseText === 'string' && response.responseText.trim()) {
                            log(`原始响应: ${response.responseText}`, 'error');
                        }
                        showNotification(errorMsg, 'error');
                    }
                },
                onerror: function (error) {
                    const errorMsg = buildNetworkErrorMessage('上传图片');
                    log(`${errorMsg}: ${error}`, 'error');
                    showNotification(errorMsg, 'error');
                }
            });
        } catch (error) {
            const errorMsg = `上传过程发生错误：${error.message}`;
            log(errorMsg, 'error');
            showNotification(errorMsg, 'error');
        }
    }

    // 在输入框中插入 Markdown 格式的图片链接
    function insertMarkdownImage(imageUrl, element, filename) {
        const markdownImage = CONFIG.MARKDOWN_TEMPLATE
            .replace('{url}', imageUrl)
            .replace('{filename}', filename.replace(/\.[^/.]+$/, '')); // 移除文件扩展名

        const start = element.selectionStart;
        const end = element.selectionEnd;
        const text = element.value;

        element.value = text.substring(0, start) + markdownImage + text.substring(end);
        element.selectionStart = element.selectionEnd = start + markdownImage.length;
        element.focus();
    }



    // 修改注册配置菜单函数
    function registerMenuCommands() {
        // 如果已经存在菜单，先注销
        if (menuCommandId) {
            try {
                GM_unregisterMenuCommand(menuCommandId);
            } catch (e) {
                console.log('Unregister menu failed:', e);
            }
        }

        // 注册新菜单
        try {
            menuCommandId = GM_registerMenuCommand(MENU_LABEL_CONFIG, createConfigModal);
        } catch (e) {
            console.log('Register menu failed:', e);
            // 如果注册失败，尝试延迟重试
            setTimeout(registerMenuCommands, 1000);
        }
    }

    // 创建拖拽区域
    function createDropZone() {
        const dropZone = document.createElement('div');
        dropZone.className = 'img-upload-dropzone';

        const message = document.createElement('div');
        message.className = 'img-upload-dropzone-message';
        message.textContent = '释放鼠标上传图片';

        dropZone.appendChild(message);
        document.body.appendChild(dropZone);
        return dropZone;
    }

    // 修改拖拽事件监听器添加方式
    function handleDragAndDrop() {
        if (hasEventListener(document, 'drag')) {
            return;
        }

        const dropZone = createDropZone();
        let activeElement = null;

        // 处理拖拽文件
        async function handleFiles(files, targetElement) {
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    if (!checkFileSize(file)) {
                        continue;
                    }
                    if (!requireRuntimeConfig('上传图片')) {
                        continue;
                    }
                    showNotification('正在上传图片，请稍候...', 'info');
                    await uploadImage(file, targetElement);
                } else {
                    showNotification('不支持的文件类型：仅支持图片（image/*）', 'error');
                }
            }
        }

        // 监听拖拽事件
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            activeElement = document.activeElement;
            if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
                dropZone.classList.add('active');
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            const rect = document.documentElement.getBoundingClientRect();
            if (e.clientX <= rect.left || e.clientX >= rect.right ||
                e.clientY <= rect.top || e.clientY >= rect.bottom) {
                dropZone.classList.remove('active');
            }
        });

        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');

            if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
                const files = Array.from(e.dataTransfer.files);
                await handleFiles(files, activeElement);
            }
        });

        markEventListener(document, 'drag');
    }

    // 修改初始化函数
    function init() {
        // 检查是否已经初始化
        if (document[SCRIPT_NAMESPACE]) {
            log('脚本已经初始化，跳过');
            return;
        }
        document[SCRIPT_NAMESPACE] = true;

        log(`初始化图片上传脚本 v${GM_info.script.version}`);
        log(`当前配置: ${JSON.stringify(CONFIG, null, 2)}`);

        // 清理可能存在的旧实例
        cleanup();

        // 初始化功能
        addPasteListener();
        handleDragAndDrop();

        // 确保菜单注册成功
        const registerMenu = () => {
            if (!menuCommandId) {
                log('注册配置菜单');
                registerMenuCommands();
            }
        };

        // 立即注册一次
        registerMenu();

        // 在不同的时机尝试注册菜单
        window.addEventListener('load', registerMenu);
        document.addEventListener('readystatechange', registerMenu);

        // 定期检查菜单是否存在
        setInterval(registerMenu, 5000);

        log('初始化完成');
    }

    // 添加清理函数
    function cleanup() {
        // 移除可能存在的旧的拖拽区域
        const oldDropZones = document.querySelectorAll('.img-upload-dropzone');
        oldDropZones.forEach(zone => zone.remove());

        // 移除可能存在的旧的通知
        const oldNotifications = document.querySelectorAll('.img-upload-notification');
        oldNotifications.forEach(notification => notification.remove());

        // 注销可能存在的旧菜单
        if (menuCommandId) {
            try {
                GM_unregisterMenuCommand(menuCommandId);
                menuCommandId = null;
            } catch (e) {
                console.log('Cleanup menu failed:', e);
            }
        }
    }

    // 在页面 DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
