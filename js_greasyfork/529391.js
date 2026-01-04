// ==UserScript==
// @name         粘贴图片自动上传图床
// @namespace    https://skyimg.de/
// @version      1.2.5
// @license      MIT
// @author       skyimg.net
// @connect      skyimg.net
// @description  检测粘贴的图片，自动上传至SkyImg并根据域名配置返回不同格式的链接
// @match        *://*/*
// @exclude      /^https?:\/\/(?:[^\/]*\.)?google\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?bing\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?skyimg\.net\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?linux\.do\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?x\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?youtube\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?facebook\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?instagram\.com\/.*/
// @exclude      /^https?:\/\/(?:[^\/]*\.)?telegram\.org\/.*/
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/529391/%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/529391/%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        apiUrl: 'https://skyimg.net/api/upload',
        webp: true, // 是否转换为WebP格式
        notificationDuration: {
            info: 3000,    // 信息提示的持续时间
            success: 3500, // 成功提示的持续时间
            warning: 4000, // 警告提示的持续时间
            error: 4000    // 错误提示的持续时间
        },
        // 链接格式类型
        linkFormats: {
            url: 'URL格式',        // 纯URL
            md: 'Markdown格式',    // ![image](URL)
            bbc: 'BBCode格式'      // [img]URL[/img]
        }
    };

    // 读取配置：链接格式设置（包括各域名）
    let domainFormatSettings = GM_getValue('domainFormatSettings', {
        'default': 'md' // 默认使用Markdown格式
    });
    // 读取配置：token 设置
    let uploadToken = GM_getValue('uploadToken', '');

    GM_registerMenuCommand('配置链接格式', showFormatSettingsDialog);
    GM_registerMenuCommand('配置上传 Token', showTokenSettingsDialog);


    function showFormatSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 23px 0 rgba(0, 0, 0, 0.2)';
        dialog.style.maxWidth = '500px';
        dialog.style.width = '90%';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflowY = 'auto';
        dialog.style.zIndex = '10000';
        dialog.style.fontFamily = 'Arial, sans-serif';

        // 对话框标题
        const title = document.createElement('h2');
        title.textContent = '配置链接格式';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#333';
        dialog.appendChild(title);

        // 说明文本
        const desc = document.createElement('p');
        desc.textContent = '为不同域名配置粘贴图片后生成的链接格式。不在列表中的域名将使用默认格式。 其中域名支持通配符匹配，例如：*.example.com';
        desc.style.marginBottom = '15px';
        desc.style.color = '#666';
        dialog.appendChild(desc);

        // 默认格式设置
        const defaultSection = document.createElement('div');
        defaultSection.style.marginBottom = '20px';
        defaultSection.style.padding = '10px';
        defaultSection.style.backgroundColor = '#f5f5f5';
        defaultSection.style.borderRadius = '4px';

        const defaultLabel = document.createElement('label');
        defaultLabel.textContent = '默认格式：';
        defaultLabel.style.fontWeight = 'bold';
        defaultLabel.style.display = 'block';
        defaultLabel.style.marginBottom = '5px';
        defaultSection.appendChild(defaultLabel);

        const defaultSelect = document.createElement('select');
        defaultSelect.style.width = '100%';
        defaultSelect.style.padding = '8px';
        defaultSelect.style.borderRadius = '4px';
        defaultSelect.style.border = '1px solid #ddd';

        for (const [value, text] of Object.entries(config.linkFormats)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if (domainFormatSettings['default'] === value) {
                option.selected = true;
            }
            defaultSelect.appendChild(option);
        }
        defaultSection.appendChild(defaultSelect);
        dialog.appendChild(defaultSection);



        // 现有域名配置列表
        const domainList = document.createElement('div');
        domainList.style.marginBottom = '20px';
        Object.entries(domainFormatSettings).forEach(([domain, format]) => {
            if (domain !== 'default') {
                const domainRow = createDomainRow(domain, format);
                domainList.appendChild(domainRow);
            }
        });
        dialog.appendChild(domainList);
        const addButton = document.createElement('button');
        addButton.textContent = '添加新域名';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.padding = '10px 15px';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        addButton.style.marginRight = '10px';
        addButton.addEventListener('click', () => {
            const newDomain = prompt('请输入域名（例如：example.com 或 *.example.com）：');
            if (newDomain && newDomain.trim() !== '' && newDomain !== 'default') {
                if (!domainFormatSettings[newDomain]) {
                    domainFormatSettings[newDomain] = domainFormatSettings['default'];
                    const domainRow = createDomainRow(newDomain, domainFormatSettings[newDomain]);
                    domainList.appendChild(domainRow);
                } else {
                    alert('该域名已存在！');
                }
            }
        });
        dialog.appendChild(addButton);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.style.backgroundColor = '#2196F3';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px 15px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', () => {

            domainFormatSettings['default'] = defaultSelect.value;
            GM_setValue('domainFormatSettings', domainFormatSettings);
            document.body.removeChild(overlay);
            showToast('设置已保存', 'success');
        });
        dialog.appendChild(saveButton);

        function createDomainRow(domain, format) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '10px';
            row.style.padding = '10px';
            row.style.backgroundColor = '#f9f9f9';
            row.style.borderRadius = '4px';

            const domainText = document.createElement('div');
            domainText.textContent = domain;
            domainText.style.flexGrow = '1';
            domainText.style.marginRight = '10px';
            row.appendChild(domainText);

            const formatSelect = document.createElement('select');
            formatSelect.style.padding = '5px';
            formatSelect.style.marginRight = '10px';
            formatSelect.style.borderRadius = '4px';
            formatSelect.style.border = '1px solid #ddd';

            for (const [value, text] of Object.entries(config.linkFormats)) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                if (format === value) {
                    option.selected = true;
                }
                formatSelect.appendChild(option);
            }

            formatSelect.addEventListener('change', () => {
                domainFormatSettings[domain] = formatSelect.value;
            });
            row.appendChild(formatSelect);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.backgroundColor = '#F44336';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.padding = '5px 10px';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.addEventListener('click', () => {
                delete domainFormatSettings[domain];
                row.remove();
            });
            row.appendChild(deleteBtn);

            return row;
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.appendChild(dialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        document.body.appendChild(overlay);
    }

    function showTokenSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 23px 0 rgba(0, 0, 0, 0.2)';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '80%';
        dialog.style.zIndex = '10000';
        dialog.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h2');
        title.textContent = '配置上传 Token';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#333';
        dialog.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = '请输入用于云端同步的 Token（64 位字母数字，留空则不使用）。可前往 skyimg.net 网站获取';
        desc.style.marginBottom = '15px';
        desc.style.color = '#666';
        dialog.appendChild(desc);

        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.placeholder = 'Token';
        tokenInput.value = uploadToken;
        tokenInput.style.width = 'calc(100% - 20px)';
        tokenInput.style.padding = '8px';
        tokenInput.style.marginBottom = '15px';
        tokenInput.style.borderRadius = '4px';
        tokenInput.style.border = '1px solid #ddd';
        dialog.appendChild(tokenInput);

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.backgroundColor = '#2196F3';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px 15px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', function() {
            const tokenVal = tokenInput.value.trim();
            if (tokenVal !== '' && !/^[A-Za-z0-9]{64}$/.test(tokenVal)) {
                alert('Token 格式不正确，必须是 64 位的字母数字');
                return;
            }
            uploadToken = tokenVal;
            GM_setValue('uploadToken', uploadToken);
            document.body.removeChild(overlay);
            showToast('Token 已保存', 'success');

        });
        dialog.appendChild(saveButton);

         const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.appendChild(dialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        document.body.appendChild(overlay);

    }

    // 监听粘贴事件
    document.addEventListener('paste', function(e) {
        // 获取剪贴板数据
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        // 遍历剪贴板项，查找是否存在图像数据
        const items = clipboardData.items;
        let imageFile = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                imageFile = items[i].getAsFile();
                break;
            }
        }

        // 如果剪贴板中没有图像，则直接返回，不进行任何处理
        if (!imageFile) return;

        // 有图像数据后，再判断当前光标是否位于有效的输入区域中
        const activeElement = document.activeElement;
        if (!isValidInputField(activeElement)) {
            showToast('当前不在发帖界面，无法上传图片', 'warning');
            return;
        }

        // 阻止默认粘贴行为
        e.preventDefault();
        e.stopPropagation();

        // 上传图片
        uploadImage(imageFile, activeElement);
    });

    /**
     * 检查元素是否为有效的输入字段
     * @param {Element} element - 要检查的DOM元素
     * @returns {boolean} 是否为有效输入字段
     */
    function isValidInputField(element) {
        if (!element) return false;

        // 检查常规输入元素
        if (element.tagName === 'TEXTAREA' ||
            element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
            return true;
        }

        // 检查contenteditable元素
        if (element.getAttribute('contenteditable') === 'true') {
            return true;
        }

        // 检查CodeMirror编辑器
        if (element.classList.contains('CodeMirror-line') ||
            element.closest('.CodeMirror-line') ||
            element.closest('.CodeMirror')) {
            return true;
        }

        // 其他富文本编辑器检测
        // CKEditor
        if (element.classList.contains('cke_editable') || element.closest('.cke_editable')) {
            return true;
        }

        // TinyMCE
        if (element.id && element.id.indexOf('mce_') === 0 || element.closest('.mce-content-body')) {
            return true;
        }

        // Quill
        if (element.classList.contains('ql-editor') || element.closest('.ql-editor')) {
            return true;
        }

        return false;
    }

    /**
     * 上传图片到API
     * @param {File} file - 要上传的图片文件
     * @param {Element} targetElement - 目标输入元素
     */
    function uploadImage(file, targetElement) {
        showToast('正在上传图片...', 'info');

        const formData = new FormData();
        formData.append('file', file);

        // 根据配置决定是否调用webp转换接口
        const url = config.webp ? `${config.apiUrl}?webp=true` : config.apiUrl;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: formData,
            responseType: 'json',
            headers: (uploadToken && /^[A-Za-z0-9]{64}$/.test(uploadToken))
                ? { 'x-sync-token': uploadToken }
                : {},
            onload: function(response) {
                handleUploadResponse(response, targetElement);
            },
            onerror: function(error) {
                console.error('上传失败:', error);
                showToast('图片上传失败，请重试', 'error');
            }
        });
    }

    /**
     * 处理上传响应
     * @param {Object} response - API响应
     * @param {Element} targetElement - 目标输入元素
     */
    function handleUploadResponse(response, targetElement) {
        if (response.status !== 200 || !response.response || !Array.isArray(response.response) || response.response.length === 0) {
            showToast('图片上传失败：服务器响应异常', 'error');
            return;
        }

        const imageData = response.response[0];
        if (!imageData.url) {
            showToast('图片上传失败：响应数据不完整', 'error');
            return;
        }

        // 获取当前域名以确定链接格式。支持通配符匹配，例如配置 "*.example.com" 可匹配所有相关域名
        const currentDomain = window.location.hostname;
        let formatType = domainFormatSettings[currentDomain];
        if (!formatType) {
            // 遍历带通配符的配置项
            for (const key in domainFormatSettings) {
                if (key === 'default') continue;
                if (key.indexOf('*') !== -1) {
                    const escaped = key.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
                    const pattern = '^' + escaped.replace(/\*/g, '.*') + '$';
                    const regex = new RegExp(pattern);
                    if (regex.test(currentDomain)) {
                        formatType = domainFormatSettings[key];
                        break;
                    }
                }
            }
        }
        formatType = formatType || domainFormatSettings['default'];

        // 构建对应格式的图片链接
        const imageUrl = imageData.url;
        let formattedLink;

        switch(formatType) {
            case 'url':
                formattedLink = imageUrl;
                break;
            case 'bbc':
                formattedLink = `[img]${imageUrl}[/img]`;
                break;
            case 'md':
            default:
                formattedLink = `![image](${imageUrl})`;
                break;
        }

        // 插入到输入框
        insertTextToElement(targetElement, formattedLink);
        showToast('图片上传成功！', 'success');
    }

    /**
     * 向元素插入文本
     * @param {Element} element - 目标元素
     * @param {string} text - 要插入的文本
     */
    function insertTextToElement(element, text) {
        if (!element) return;

        // 标准输入框
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            const startPos = element.selectionStart || 0;
            const endPos = element.selectionEnd || startPos;
            const beforeText = element.value.substring(0, startPos);
            const afterText = element.value.substring(endPos);

            element.value = beforeText + text + afterText;

            // 设置光标位置
            const newCursorPos = startPos + text.length;
            element.selectionStart = newCursorPos;
            element.selectionEnd = newCursorPos;
            element.focus();
            return;
        }

        // contenteditable元素
        if (element.getAttribute('contenteditable') === 'true') {
            document.execCommand('insertText', false, text);
            return;
        }

        // CodeMirror特殊处理
        const codeMirrorLine = element.closest('.CodeMirror-line') || element;
        if (codeMirrorLine.classList.contains('CodeMirror-line') || element.closest('.CodeMirror')) {
            // 尝试找到CodeMirror实例
            const codeMirrorElement = element.closest('.CodeMirror');
            if (codeMirrorElement && codeMirrorElement.CodeMirror) {
                const cm = codeMirrorElement.CodeMirror;
                const doc = cm.getDoc();
                const cursor = doc.getCursor();
                doc.replaceRange(text, cursor);
            } else {
                // 退回到简单的DOM插入
                try {
                    document.execCommand('insertText', false, text);
                } catch (e) {
                    console.error('无法插入文本:', e);
                    showToast('无法自动插入图片链接，请手动复制', 'warning');
                    copyToClipboard(text);
                }
            }
            return;
        }

        // 其他常见编辑器尝试
        try {
            document.execCommand('insertText', false, text);
        } catch (e) {
            // 如果无法确定如何插入，则复制到剪贴板
            showToast('无法自动插入图片链接，已复制到剪贴板', 'warning');
            copyToClipboard(text);
        }
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    /**
     * 显示Toast通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (info, success, warning, error)
     */
    function showToast(message, type = 'info') {
        // 获取对应类型的通知持续时间
        const duration = config.notificationDuration[type] || 3000;
        let toast = document.getElementById('skyimg-toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'skyimg-toast';
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.right = '20px';
            toast.style.padding = '12px 20px';
            toast.style.borderRadius = '8px';
            toast.style.fontSize = '15px';
            toast.style.fontFamily = '"Segoe UI", Tahoma, sans-serif';
            toast.style.zIndex = '9999';
            toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            toast.style.transform = 'translateY(-20px)';
            document.body.appendChild(toast);
        }

        // 根据类型设置不同的背景颜色
        switch(type) {
            case 'success':
                toast.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
                break;
            case 'warning':
                toast.style.backgroundColor = 'rgba(255, 152, 0, 0.9)';
                break;
            case 'error':
                toast.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
                break;
            default: // info
                toast.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
                break;
        }
        toast.style.color = '#fff';

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        // 自动关闭通知
        clearTimeout(toast.hideTimeout);
        toast.hideTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
        }, duration);
    }
})();