// ==UserScript==
// @name         Image Uploader to Markdown to CloudFlare-ImgBed
// @namespace    http://tampermonkey.net/
// @version      0.4.2-beta
// @description  适配于 CloudFlare-ImgBed 的粘贴上传并生成markdown的脚本, CloudFlare-ImgBed : https://github.com/MarSeventh/CloudFlare-ImgBed
// @author       calg
// @match        *://*/*
// @exclude      *://*.jpg
// @exclude      *://*.jpeg
// @exclude      *://*.png
// @exclude      *://*.gif
// @exclude      *://*.webp
// @exclude      *://*.pdf
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
// @downloadURL https://update.greasyfork.org/scripts/529816/Image%20Uploader%20to%20Markdown%20to%20CloudFlare-ImgBed.user.js
// @updateURL https://update.greasyfork.org/scripts/529816/Image%20Uploader%20to%20Markdown%20to%20CloudFlare-ImgBed.meta.js
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
            uploadFolder: 'apiupload' // 指定上传目录
        },
        NOTIFICATION_DURATION: 3000, // 通知显示时间（毫秒）
        MARKDOWN_TEMPLATE: '![{filename}]({url})', // Markdown 模板
        AUTO_COPY_URL: false, // 是否自动复制URL到剪贴板
        ALLOWED_HOSTS: ['*'], // 允许在哪些网站上运行，* 表示所有网站
        MAX_FILE_SIZE: 5 * 1024 * 1024 // 最大文件大小（5MB）
    };

    // 获取用户配置并确保所有必需的字段都存在
    const userConfig = GM_getValue('userConfig', {});
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
        if (!Array.isArray(CONFIG.ALLOWED_HOSTS)) {
            CONFIG.ALLOWED_HOSTS = DEFAULT_CONFIG.ALLOWED_HOSTS;
        }
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

    // 添加通知样式
    GM_addStyle(`
        .img-upload-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            max-width: 300px;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(20px);
        }
        .img-upload-notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        .img-upload-success {
            background-color: #4caf50;
            color: white;
        }
        .img-upload-error {
            background-color: #f44336;
            color: white;
        }
        .img-upload-info {
            background-color: #2196F3;
            color: white;
        }
        .img-upload-close {
            float: right;
            margin-left: 10px;
            cursor: pointer;
            opacity: 0.8;
        }
        .img-upload-close:hover {
            opacity: 1;
        }

        .img-upload-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .img-upload-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
        .img-upload-modal h2 {
            margin: 0 0 20px;
            color: #333;
            font-size: 18px;
        }
        .img-upload-form-group {
            margin-bottom: 20px;
        }
        .img-upload-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        .img-upload-help-text {
            margin-top: 4px;
            color: #666;
            font-size: 12px;
        }
        .img-upload-form-group input[type="text"],
        .img-upload-form-group input[type="number"],
        .img-upload-form-group textarea {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            box-sizing: border-box;
        }
        .img-upload-form-group textarea {
            min-height: 100px;
        }
        .img-upload-form-group input[type="checkbox"] {
            margin-right: 8px;
        }
        .img-upload-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        .img-upload-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        .img-upload-button-primary {
            background: #2196F3;
            color: white;
        }
        .img-upload-button-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .img-upload-button:hover {
            opacity: 0.9;
        }
        .img-upload-error {
            color: #ffffff;
            font-size: 12px;
            margin-top: 4px;
        }
        .img-upload-info-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #2196F3;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 16px;
            font-size: 12px;
            margin-left: 4px;
            cursor: help;
        }
        .img-upload-form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background-color: white;
        }
        .img-upload-input-group {
            display: flex;
            align-items: center;
        }
        .img-upload-input-group input {
            flex: 1;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .img-upload-input-group-text {
            padding: 8px 12px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-left: none;
            border-radius: 0 4px 4px 0;
            color: #666;
        }
        .img-upload-checkbox-label {
            display: flex !important;
            align-items: center;
            font-weight: normal !important;
        }
        .img-upload-checkbox-label input {
            margin-right: 8px;
        }

        .img-upload-dropzone {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(33, 150, 243, 0.2);
            border: 3px dashed #2196F3;
            z-index: 9998;
            box-sizing: border-box;
        }
        .img-upload-dropzone.active {
            display: block;
        }
        .img-upload-dropzone-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 18px;
            color: #2196F3;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
    `);

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
            showNotification('复制失败：' + err.message, 'error');
        }
        document.body.removeChild(textarea);
    }

    // 检查文件大小
    function checkFileSize(file) {
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            showNotification(`文件大小超过限制（${Math.round(CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB）`, 'error');
            return false;
        }
        return true;
    }

    // 检查当前网站是否允许上传
    function isAllowedHost() {
        const currentHost = window.location.hostname;
        log(`检查当前域名是否允许: ${currentHost}`);

        // 如果允许所有网站
        if (CONFIG.ALLOWED_HOSTS.includes('*')) {
            log('允许所有网站');
            return true;
        }

        // 清理和标准化域名列表
        const allowedHosts = CONFIG.ALLOWED_HOSTS.map(host => {
            // 移除协议前缀
            host = host.replace(/^https?:\/\//, '');
            // 移除路径和查询参数
            host = host.split('/')[0];
            // 移除端口号
            host = host.split(':')[0];
            return host.toLowerCase().trim();
        });

        log(`允许的域名列表: ${JSON.stringify(allowedHosts, null, 2)}`);

        // 检查当前域名是否在允许列表中
        const isAllowed = allowedHosts.some(host => {
            // 完全匹配
            if (host === currentHost) {
                log(`域名完全匹配: ${host}`);
                return true;
            }
            // 通配符匹配（例如 *.example.com）
            if (host.startsWith('*.') && currentHost.endsWith(host.slice(1))) {
                log(`域名通配符匹配: ${host}`);
                return true;
            }
            return false;
        });

        if (!isAllowed) {
            log(`当前域名 ${currentHost} 不在允许列表中`, 'warn');
        }

        return isAllowed;
    }

    // 修改事件监听器添加方式
    function addPasteListener() {
        if (hasEventListener(document, 'paste')) {
            return;
        }

        document.addEventListener('paste', async function (event) {
            if (!isAllowedHost()) return;

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
                                    imageUrl = `${baseUrl}/${path}`;
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
                            const errorMsg = `解析服务器响应失败：${e.message}`;
                            log(errorMsg, 'error');
                            log(`原始响应: ${response.responseText}`, 'error');
                            showNotification(errorMsg, 'error');
                        }
                    } else {
                        let errorMsg = '上传失败';
                        try {
                            const errorResponse = JSON.parse(response.responseText);
                            errorMsg += '：' + (errorResponse.message || response.statusText);
                            log(`上传失败: ${JSON.stringify(errorResponse, null, 2)}`, 'error');
                        } catch (e) {
                            errorMsg += `（状态码：${response.status}）`;
                            log(`上传失败: 状态码 ${response.status}`, 'error');
                            log(`原始响应: ${response.responseText}`, 'error');
                        }
                        showNotification(errorMsg, 'error');
                    }
                },
                onerror: function (error) {
                    const errorMsg = '网络错误：无法连接到图床服务器';
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

    // 创建配置界面
    function createConfigModal() {
        const overlay = document.createElement('div');
        overlay.className = 'img-upload-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'img-upload-modal';

        const content = `
            <h2>图床上传配置 <a href="https://cfbed.sanyue.de/api/upload.html" target="_blank" style="font-size: 12px; color: #2196F3; text-decoration: none;">(API文档)</a></h2>
            <form id="img-upload-config-form">
                <div class="img-upload-form-group">
                    <label>认证码</label>
                    <input type="text" name="AUTH_CODE" value="${CONFIG.AUTH_CODE}" required>
                    <div class="img-upload-help-text">用于验证上传请求的密钥</div>
                </div>
                <div class="img-upload-form-group">
                    <label>服务器地址</label>
                    <input type="text" name="SERVER_URL" value="${CONFIG.SERVER_URL}" required>
                    <div class="img-upload-help-text">图床服务器的URL地址, 不需要添加/upload</div>
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
                    <div class="img-upload-help-text">选择图片上传的存储通道</div>
                </div>
                <div class="img-upload-form-group">
                    <label>文件命名方式</label>
                    <select name="uploadNameType">
                        <option value="default" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'default' ? 'selected' : ''}>默认（前缀_原名）</option>
                        <option value="index" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'index' ? 'selected' : ''}>仅前缀</option>
                        <option value="origin" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'origin' ? 'selected' : ''}>仅原名</option>
                        <option value="short" ${CONFIG.UPLOAD_PARAMS.uploadNameType === 'short' ? 'selected' : ''}>短链接</option>
                    </select>
                    <div class="img-upload-help-text">选择上传后的文件命名方式</div>
                </div>
                <div class="img-upload-form-group">
                    <label>上传目录</label>
                    <input type="text" name="uploadFolder" value="${CONFIG.UPLOAD_PARAMS.uploadFolder}">
                    <div class="img-upload-help-text">指定上传目录，使用相对路径，例如：img/test</div>
                </div>
                <div class="img-upload-form-group">
                    <label>通知显示时间</label>
                    <input type="number" name="NOTIFICATION_DURATION" value="${CONFIG.NOTIFICATION_DURATION}" min="1000" step="500">
                    <div class="img-upload-help-text">通知消息显示的时间（毫秒）</div>
                </div>
                <div class="img-upload-form-group">
                    <label>Markdown模板</label>
                    <input type="text" name="MARKDOWN_TEMPLATE" value="${CONFIG.MARKDOWN_TEMPLATE}">
                    <div class="img-upload-help-text">支持 {filename} 和 {url} 两个变量</div>
                </div>
                <div class="img-upload-form-group">
                    <label>允许的网站</label>
                    <input type="text" name="ALLOWED_HOSTS" value="${CONFIG.ALLOWED_HOSTS.join(',')}">
                    <div class="img-upload-help-text">输入域名，用逗号分隔。例如：nodeseek.com, *.example.com。使用 * 表示允许所有网站。无需输入 http:// 或 https://</div>
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
                <div class="img-upload-buttons">
                    <button type="button" class="img-upload-button img-upload-button-secondary" id="img-upload-cancel">取消</button>
                    <button type="button" class="img-upload-button img-upload-button-secondary" id="img-upload-reset">重置默认值</button>
                    <button type="submit" class="img-upload-button img-upload-button-primary">保存</button>
                </div>
            </form>
        `;

        modal.innerHTML = content;
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // 事件处理
        const form = modal.querySelector('#img-upload-config-form');
        const cancelBtn = modal.querySelector('#img-upload-cancel');
        const resetBtn = modal.querySelector('#img-upload-reset');

        function closeModal() {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        }

        overlay.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有配置到默认值吗？')) {
                CONFIG = { ...DEFAULT_CONFIG };
                GM_setValue('userConfig', {});
                showNotification('配置已重置为默认值！', 'success');
                closeModal();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(form);
                const newConfig = {
                    AUTH_CODE: formData.get('AUTH_CODE'),
                    SERVER_URL: formData.get('SERVER_URL'),
                    UPLOAD_PARAMS: {
                        ...DEFAULT_CONFIG.UPLOAD_PARAMS,
                        uploadChannel: formData.get('uploadChannel'),
                        uploadNameType: formData.get('uploadNameType'),
                        uploadFolder: formData.get('uploadFolder')
                    },
                    NOTIFICATION_DURATION: parseInt(formData.get('NOTIFICATION_DURATION')),
                    MARKDOWN_TEMPLATE: formData.get('MARKDOWN_TEMPLATE'),
                    ALLOWED_HOSTS: formData.get('ALLOWED_HOSTS')
                        .split(',')
                        .map(h => {
                            // 清理域名格式
                            h = h.replace(/^https?:\/\//, '');
                            h = h.split('/')[0];
                            h = h.split(':')[0];
                            return h.toLowerCase().trim();
                        })
                        .filter(h => h), // 移除空值
                    MAX_FILE_SIZE: parseFloat(formData.get('MAX_FILE_SIZE')) * 1024 * 1024,
                    AUTO_COPY_URL: formData.get('AUTO_COPY_URL') === 'on'
                };

                CONFIG = mergeConfig({ ...DEFAULT_CONFIG }, newConfig);
                GM_setValue('userConfig', CONFIG);
                showNotification('配置已更新！', 'success');
                closeModal();
            } catch (error) {
                showNotification('配置格式错误：' + error.message, 'error');
            }
        });

        // 防止点击模态框时关闭
        modal.addEventListener('click', (e) => e.stopPropagation());
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
            menuCommandId = GM_registerMenuCommand('配置图床参数', createConfigModal);
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
                    showNotification('正在上传图片，请稍候...', 'info');
                    await uploadImage(file, targetElement);
                } else {
                    showNotification('只能上传图片文件', 'error');
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

            if (!isAllowedHost()) return;

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