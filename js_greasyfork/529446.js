// ==UserScript==
// @name         Nodeloc 自建图床快捷上传
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 nodeloc.com 的评论框旁添加图片上传功能，支持粘贴/拖拽上传，提示在右下角
// @author       BreezeZhang
// @match        https://*.nodeloc.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      nodeloc.com
// @connect      *
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/529446/Nodeloc%20%E8%87%AA%E5%BB%BA%E5%9B%BE%E5%BA%8A%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/529446/Nodeloc%20%E8%87%AA%E5%BB%BA%E5%9B%BE%E5%BA%8A%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config = {
        EASYIMAGE_API_URL: GM_getValue('EASYIMAGE_API_URL', ''),
        EASYIMAGE_TOKEN: GM_getValue('EASYIMAGE_TOKEN', ''),
        LANKONG_API_URL: GM_getValue('LANKONG_API_URL', ''),
        LANKONG_EMAIL: GM_getValue('LANKONG_EMAIL', ''),
        LANKONG_PASSWORD: GM_getValue('LANKONG_PASSWORD', ''),
        UPLOAD_TYPE: GM_getValue('UPLOAD_TYPE', 'easyimage')
    };

    if (!config.EASYIMAGE_API_URL || !config.EASYIMAGE_TOKEN) {
        setTimeout(showConfigModal, 0);
        return;
    }

    setTimeout(initScript, 0);

    function extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return '';
        }
    }

    function showConfigModal(isUpdate = false) {
        if (document.querySelector('.easyimage-config-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'easyimage-config-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000;';

        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background-color:#fff;padding:20px;border-radius:8px;width:350px;box-shadow:0 4px 6px rgba(0,0,0,0.1);display:flex;flex-direction:column;';

        const title = document.createElement('h3');
        title.textContent = isUpdate ? '更新配置' : '初始配置';
        title.style.cssText = 'margin-bottom:20px;text-align:center;color:#333;font-size:1.2em;';
        modalContent.appendChild(title);

        const uploadTypeLabel = document.createElement('label');
        uploadTypeLabel.textContent = '选择图床类型:';
        uploadTypeLabel.style.cssText = 'display:block;margin-bottom:5px;color:#666;font-size:0.9em;';
        modalContent.appendChild(uploadTypeLabel);

        const uploadTypeSelect = document.createElement('select');
        uploadTypeSelect.style.cssText = 'width:100%;padding:8px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;font-size:1em;';
        ['easyimage', 'lankong'].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type === 'easyimage' ? '简单图床' : '兰空图床';
            uploadTypeSelect.appendChild(option);
        });
        uploadTypeSelect.value = config.UPLOAD_TYPE;
        modalContent.appendChild(uploadTypeSelect);

        const apiLabel = document.createElement('label');
        apiLabel.textContent = 'API URL:';
        apiLabel.style.cssText = 'display:block;margin-bottom:5px;color:#666;font-size:0.9em;';
        modalContent.appendChild(apiLabel);

        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.value = config.UPLOAD_TYPE === 'easyimage' ? config.EASYIMAGE_API_URL : config.LANKONG_API_URL;
        apiInput.style.cssText = 'width:100%;padding:8px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;font-size:1em;';
        modalContent.appendChild(apiInput);

        const tokenLabel = document.createElement('label');
        tokenLabel.textContent = 'Token:';
        tokenLabel.style.cssText = apiLabel.style.cssText;
        modalContent.appendChild(tokenLabel);

        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.value = config.UPLOAD_TYPE === 'easyimage' ? config.EASYIMAGE_TOKEN : '';
        tokenInput.style.cssText = apiInput.style.cssText;
        modalContent.appendChild(tokenInput);

        const emailLabel = document.createElement('label');
        emailLabel.textContent = '邮箱:';
        emailLabel.style.cssText = apiLabel.style.cssText;
        modalContent.appendChild(emailLabel);

        const emailInput = document.createElement('input');
        emailInput.type = 'text';
        emailInput.value = config.UPLOAD_TYPE === 'lankong' ? config.LANKONG_EMAIL : '';
        emailInput.style.cssText = apiInput.style.cssText;
        modalContent.appendChild(emailInput);

        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = '密码:';
        passwordLabel.style.cssText = apiLabel.style.cssText;
        modalContent.appendChild(passwordLabel);

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.value = config.UPLOAD_TYPE === 'lankong' ? config.LANKONG_PASSWORD : '';
        passwordInput.style.cssText = apiInput.style.cssText;
        modalContent.appendChild(passwordInput);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;justify-content:flex-end;margin-top:20px;';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '保存';
        confirmBtn.style.cssText = 'padding:10px 20px;background-color:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:1em;margin-right:10px;transition:background-color 0.3s ease;';
        confirmBtn.addEventListener('click', () => {
            const apiUrl = apiInput.value.trim();
            const token = tokenInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const uploadType = uploadTypeSelect.value;
            if (!apiUrl || (uploadType === 'easyimage' && !token) || (uploadType === 'lankong' && (!email || !password))) {
                alert('请填写所有必填字段！');
                return;
            }
            config.UPLOAD_TYPE = uploadType;
            GM_setValue('UPLOAD_TYPE', config.UPLOAD_TYPE);
            if (uploadType === 'easyimage') {
                config.EASYIMAGE_API_URL = apiUrl;
                config.EASYIMAGE_TOKEN = token;
                GM_setValue('EASYIMAGE_API_URL', config.EASYIMAGE_API_URL);
                GM_setValue('EASYIMAGE_TOKEN', config.EASYIMAGE_TOKEN);
            } else if (uploadType === 'lankong') {
                config.LANKONG_API_URL = apiUrl;
                config.LANKONG_EMAIL = email;
                config.LANKONG_PASSWORD = password;
                GM_setValue('LANKONG_API_URL', config.LANKONG_API_URL);
                GM_setValue('LANKONG_EMAIL', config.LANKONG_EMAIL);
                GM_setValue('LANKONG_PASSWORD', config.LANKONG_PASSWORD);
            }
            document.body.removeChild(modal);
            if (isUpdate) alert('配置更新成功！');
            initScript();
        });
        buttonContainer.appendChild(confirmBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding:10px 20px;background-color:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-size:1em;transition:background-color 0.3s ease;';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (!isUpdate) alert('配置未完成，脚本将无法运行！');
        });
        buttonContainer.appendChild(cancelBtn);

        modalContent.appendChild(buttonContainer);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', e => {
            if (e.target === modal) document.body.removeChild(modal);
        });

        confirmBtn.addEventListener('mouseover', () => confirmBtn.style.backgroundColor = '#45a049');
        confirmBtn.addEventListener('mouseout', () => confirmBtn.style.backgroundColor = '#4CAF50');
        cancelBtn.addEventListener('mouseover', () => cancelBtn.style.backgroundColor = '#da190b');
        cancelBtn.addEventListener('mouseout', () => cancelBtn.style.backgroundColor = '#f44336');

        uploadTypeSelect.addEventListener('change', () => {
            const uploadType = uploadTypeSelect.value;
            if (uploadType === 'easyimage') {
                apiLabel.textContent = 'API URL:';
                tokenLabel.textContent = 'Token:';
                [emailLabel, emailInput, passwordLabel, passwordInput].forEach(el => el.style.display = 'none');
                apiInput.value = config.EASYIMAGE_API_URL || 'https://example.com/api/index.php';
                tokenInput.value = config.EASYIMAGE_TOKEN || '';
            } else if (uploadType === 'lankong') {
                apiLabel.textContent = '兰空图床域名:';
                tokenLabel.textContent = 'Token:';
                [emailLabel, emailInput, passwordLabel, passwordInput].forEach(el => el.style.display = 'block');
                apiInput.value = config.LANKONG_API_URL || 'https://你的兰空图床域名';
                tokenInput.value = '';
                emailInput.value = config.LANKONG_EMAIL || 'YOUR_EMAIL_HERE';
                passwordInput.value = config.LANKONG_PASSWORD || 'YOUR_PASSWORD_HERE';
            }
        });
        uploadTypeSelect.dispatchEvent(new Event('change'));
    }

    function initScript() {
        const checkComposerFooter = () => {
            const composerFooter = document.querySelector('.Composer-footer');
            if (composerFooter && !composerFooter.querySelector('.easyimage-upload-container')) {
                createUploadButton();
                setupPasteAndDrop();
                addPlaceholder();
            } else {
                setTimeout(checkComposerFooter, 100);
            }
        };

        checkComposerFooter();

        const observer = new MutationObserver(checkComposerFooter);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createUploadButton() {
        const composerFooter = document.querySelector('.Composer-footer');
        if (!composerFooter || composerFooter.querySelector('.easyimage-upload-container')) return false;

        const uploadContainer = document.createElement('li');
        uploadContainer.className = 'item-easyimage easyimage-upload-container';
        uploadContainer.style.cssText = 'display:inline-block';

        const uploadButton = document.createElement('button');
        uploadButton.className = 'Button Button--icon Button--link hasIcon';
        uploadButton.setAttribute('type', 'button');
        uploadButton.setAttribute('title', '');
        uploadButton.setAttribute('aria-label', '上传图片');
        uploadButton.setAttribute('data-original-title', '上传图片');

        const uploadIcon = document.createElement('i');
        uploadIcon.className = 'icon fas fa-image Button-icon';
        uploadIcon.setAttribute('aria-hidden', 'true');

        const uploadLabel = document.createElement('span');
        uploadLabel.className = 'Button-label';
        uploadLabel.textContent = '上传图片';

        uploadButton.appendChild(uploadIcon);
        uploadButton.appendChild(uploadLabel);

        const updateButton = document.createElement('button');
        updateButton.className = 'Button Button--icon Button--link hasIcon';
        updateButton.setAttribute('type', 'button');
        updateButton.setAttribute('title', '');
        updateButton.setAttribute('aria-label', '更新配置');
        updateButton.setAttribute('data-original-title', '更新配置');

        const updateIcon = document.createElement('i');
        updateIcon.className = 'icon fas fa-cog Button-icon';
        updateIcon.setAttribute('aria-hidden', 'true');

        const updateLabel = document.createElement('span');
        updateLabel.className = 'Button-label';
        updateLabel.textContent = '更新配置';

        updateButton.appendChild(updateIcon);
        updateButton.appendChild(updateLabel);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        uploadContainer.appendChild(uploadButton);
        uploadContainer.appendChild(updateButton);
        uploadContainer.appendChild(fileInput);

        composerFooter.insertBefore(uploadContainer, composerFooter.lastChild);

        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length === 0) return;
            const file = fileInput.files[0];
            uploadButton.textContent = '正在上传...';
            uploadButton.disabled = true;
            uploadImage(file, (success, result) => {
                uploadButton.textContent = '上传图片';
                uploadButton.disabled = false;
                if (success) insertMarkdown(result);
                else alert('上传失败：' + result);
            });
        });
        updateButton.addEventListener('click', () => showConfigModal(true));

        return true;
    }

    function setupPasteAndDrop() {
        const textEditor = document.querySelector('.TextEditor-editor');
        if (!textEditor || textEditor.dataset.pasteDropSetup) return;

        textEditor.dataset.pasteDropSetup = 'true';

        textEditor.addEventListener('paste', event => {
            const items = (event.clipboardData || window.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === 0) {
                    event.preventDefault();
                    uploadImage(items[i].getAsFile(), (success, result) => {
                        if (success) insertMarkdown(result);
                        else alert('上传失败：' + result);
                    });
                    break;
                }
            }
        });

        let uploadInProgress = false;
        textEditor.addEventListener('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        textEditor.addEventListener('drop', event => {
            event.preventDefault();
            event.stopPropagation();
            if (uploadInProgress) return;
            const files = event.dataTransfer.files;
            if (files.length > 0 && files[0].type.indexOf('image') === 0) {
                uploadInProgress = true;
                uploadImage(files[0], (success, result) => {
                    uploadInProgress = false;
                    if (success) insertMarkdown(result);
                    else alert('上传失败：' + result);
                });
            }
        });
    }

    function addPlaceholder() {
        const textEditor = document.querySelector('.TextEditor-editor');
        if (!textEditor || textEditor.querySelector('.easyimage-placeholder')) return;

        const placeholder = document.createElement('div');
        placeholder.className = 'easyimage-placeholder';
        placeholder.textContent = '拖拽或粘贴图片可以上传图片';
        placeholder.style.cssText = 'position:absolute;bottom:10px;right:10px;color:#aaa;font-size:12px;pointer-events:none;z-index:1';

        textEditor.parentElement.appendChild(placeholder);

        textEditor.addEventListener('input', () => {
            placeholder.style.display = textEditor.value.trim() ? 'none' : 'block';
        });
    }

    function uploadImage(file, callback) {
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
        if (window.uploadedFiles && window.uploadedFiles[fileKey]) {
            return callback(true, window.uploadedFiles[fileKey]);
        }

        if (config.UPLOAD_TYPE === 'easyimage') {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('token', config.EASYIMAGE_TOKEN);

            fetchWithTimeout(config.EASYIMAGE_API_URL, {
                method: 'POST',
                body: formData
            }, 10000)
            .then(response => response.json())
            .then(result => {
                if (result.result === 'success' && result.code === 200) {
                    window.uploadedFiles = window.uploadedFiles || {};
                    window.uploadedFiles[fileKey] = result.url;
                    callback(true, result.url);
                } else {
                    callback(false, result.message || '服务器返回错误');
                }
            })
            .catch(error => callback(false, '网络错误：' + error.message));
        } else if (config.UPLOAD_TYPE === 'lankong') {
            fetchWithTimeout(`${config.LANKONG_API_URL}/api/v1/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: config.LANKONG_EMAIL,
                    password: config.LANKONG_PASSWORD
                })
            }, 10000)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    const token = data.data.token;
                    const formData = new FormData();
                    formData.append('image', file);
                    fetchWithTimeout(`${config.LANKONG_API_URL}/api/v1/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                    }, 10000)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status) {
                            window.uploadedFiles = window.uploadedFiles || {};
                            window.uploadedFiles[fileKey] = result.data.url;
                            callback(true, result.data.url);
                        } else {
                            callback(false, result.message || '上传失败');
                        }
                    })
                    .catch(error => callback(false, '网络错误：' + error.message));
                } else {
                    callback(false, data.message || '获取Token失败');
                }
            })
            .catch(error => callback(false, '网络错误：' + error.message));
        }
    }

    function insertMarkdown(url) {
        const textEditor = document.querySelector('.TextEditor-editor');
        if (textEditor) {
            const markdown = `![image](${url})`;
            const start = textEditor.selectionStart;
            const end = textEditor.selectionEnd;
            textEditor.value = textEditor.value.substring(0, start) + markdown + textEditor.value.substring(end);
            textEditor.focus();
            textEditor.setSelectionRange(start + markdown.length, start + markdown.length);
            showSuccessMessage();
        }
    }

    function showSuccessMessage() {
        const composerContent = document.querySelector('.Composer-content');
        if (!composerContent) return;

        const successMsg = document.createElement('div');
        successMsg.textContent = '🎉 图片上传成功！';
        successMsg.style.cssText = 'color:#4CAF50;margin:5px 0';
        composerContent.insertBefore(successMsg, composerContent.firstChild);
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 2000);
    }

    function fetchWithTimeout(resource, options = {}, timeout = 10000) {
        return Promise.race([
            fetch(resource, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), timeout))
        ]);
    }
})();