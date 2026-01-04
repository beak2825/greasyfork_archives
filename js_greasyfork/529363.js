// ==UserScript==
// @name         NS 简单图床快捷上传
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 Nodeseek.com 的发送评论按钮旁添加图片上传功能，支持粘贴/拖拽上传，提示在右下角
// @author       BreezeZhang
// @match        https://*.nodeseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      nodeseek.com
// @connect      *
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/529363/NS%20%E7%AE%80%E5%8D%95%E5%9B%BE%E5%BA%8A%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/529363/NS%20%E7%AE%80%E5%8D%95%E5%9B%BE%E5%BA%8A%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let EASYIMAGE_API_URL = GM_getValue('EASYIMAGE_API_URL', '');
    let EASYIMAGE_TOKEN = GM_getValue('EASYIMAGE_TOKEN', '');
    let LANKONG_API_URL = GM_getValue('LANKONG_API_URL', '');
    let LANKONG_EMAIL = GM_getValue('LANKONG_EMAIL', '');
    let LANKONG_PASSWORD = GM_getValue('LANKONG_PASSWORD', '');
    let UPLOAD_TYPE = GM_getValue('UPLOAD_TYPE', 'easyimage');

    if (!EASYIMAGE_API_URL || !EASYIMAGE_TOKEN) {
        showConfigModal();
        return;
    }
    initScript();

    // 提取域名（仅用于日志和提示）
    function extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            console.error('无效的 API URL:', url, e);
            return '';
        }
    }

    function showConfigModal(isUpdate = false) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            width: 350px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        `;

        const title = document.createElement('h3');
        title.textContent = isUpdate ? '更新配置' : '初始配置';
        title.style.cssText = `
            margin-bottom: 20px;
            text-align: center;
            color: #333;
            font-size: 1.2em;
        `;

        const uploadTypeLabel = document.createElement('label');
        uploadTypeLabel.textContent = '选择图床类型:';
        uploadTypeLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 0.9em;
        `;

        const uploadTypeSelect = document.createElement('select');
        uploadTypeSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
        `;
        const easyImageOption = document.createElement('option');
        easyImageOption.value = 'easyimage';
        easyImageOption.textContent = '简单图床';
        const lankongOption = document.createElement('option');
        lankongOption.value = 'lankong';
        lankongOption.textContent = '兰空图床';
        uploadTypeSelect.appendChild(easyImageOption);
        uploadTypeSelect.appendChild(lankongOption);
        uploadTypeSelect.value = UPLOAD_TYPE;

        const apiLabel = document.createElement('label');
        apiLabel.textContent = 'API URL:';
        apiLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 0.9em;
        `;

        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.value = UPLOAD_TYPE === 'easyimage' ? EASYIMAGE_API_URL : LANKONG_API_URL;
        apiInput.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
        `;

        const tokenLabel = document.createElement('label');
        tokenLabel.textContent = 'Token:';
        tokenLabel.style.cssText = apiLabel.style.cssText;

        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.value = UPLOAD_TYPE === 'easyimage' ? EASYIMAGE_TOKEN : '';
        tokenInput.style.cssText = apiInput.style.cssText;

        const emailLabel = document.createElement('label');
        emailLabel.textContent = '邮箱:';
        emailLabel.style.cssText = apiLabel.style.cssText;

        const emailInput = document.createElement('input');
        emailInput.type = 'text';
        emailInput.value = UPLOAD_TYPE === 'lankong' ? LANKONG_EMAIL : '';
        emailInput.style.cssText = apiInput.style.cssText;

        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = '密码:';
        passwordLabel.style.cssText = apiLabel.style.cssText;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.value = UPLOAD_TYPE === 'lankong' ? LANKONG_PASSWORD : '';
        passwordInput.style.cssText = apiInput.style.cssText;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        `;

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '保存';
        confirmBtn.style.cssText = `
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            margin-right: 10px;
            transition: background-color 0.3s ease;
        `;
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

            UPLOAD_TYPE = uploadType;
            GM_setValue('UPLOAD_TYPE', UPLOAD_TYPE);

            if (uploadType === 'easyimage') {
                EASYIMAGE_API_URL = apiUrl;
                EASYIMAGE_TOKEN = token;
                GM_setValue('EASYIMAGE_API_URL', EASYIMAGE_API_URL);
                GM_setValue('EASYIMAGE_TOKEN', EASYIMAGE_TOKEN);
            } else if (uploadType === 'lankong') {
                LANKONG_API_URL = apiUrl;
                LANKONG_EMAIL = email;
                LANKONG_PASSWORD = password;
                GM_setValue('LANKONG_API_URL', LANKONG_API_URL);
                GM_setValue('LANKONG_EMAIL', LANKONG_EMAIL);
                GM_setValue('LANKONG_PASSWORD', LANKONG_PASSWORD);
            }

            document.body.removeChild(modal);
            if (isUpdate) alert('配置更新成功！');
            initScript();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s ease;
        `;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (!isUpdate) alert('配置未完成，脚本将无法运行！');
        });

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);

        modalContent.appendChild(title);
        modalContent.appendChild(uploadTypeLabel);
        modalContent.appendChild(uploadTypeSelect);
        modalContent.appendChild(apiLabel);
        modalContent.appendChild(apiInput);
        modalContent.appendChild(tokenLabel);
        modalContent.appendChild(tokenInput);
        modalContent.appendChild(emailLabel);
        modalContent.appendChild(emailInput);
        modalContent.appendChild(passwordLabel);
        modalContent.appendChild(passwordInput);
        modalContent.appendChild(buttonContainer);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        });

        confirmBtn.addEventListener('mouseover', () => {
            confirmBtn.style.backgroundColor = '#45a049';
        });
        confirmBtn.addEventListener('mouseout', () => {
            confirmBtn.style.backgroundColor = '#4CAF50';
        });

        cancelBtn.addEventListener('mouseover', () => {
            cancelBtn.style.backgroundColor = '#da190b';
        });
        cancelBtn.addEventListener('mouseout', () => {
            cancelBtn.style.backgroundColor = '#f44336';
        });

        uploadTypeSelect.addEventListener('change', () => {
            const uploadType = uploadTypeSelect.value;
            if (uploadType === 'easyimage') {
                apiLabel.textContent = 'API URL:';
                tokenLabel.textContent = 'Token:';
                emailLabel.style.display = 'none';
                emailInput.style.display = 'none';
                passwordLabel.style.display = 'none';
                passwordInput.style.display = 'none';
                apiInput.value = EASYIMAGE_API_URL || 'https://example.com/api/index.php';
                tokenInput.value = EASYIMAGE_TOKEN || '';
            } else if (uploadType === 'lankong') {
                apiLabel.textContent = '兰空图床域名:';
                tokenLabel.textContent = 'Token:';
                emailLabel.style.display = 'block';
                emailInput.style.display = 'block';
                passwordLabel.style.display = 'block';
                passwordInput.style.display = 'block';
                apiInput.value = LANKONG_API_URL || 'https://你的兰空图床域名';
                tokenInput.value = '';
                emailInput.value = LANKONG_EMAIL || 'YOUR_EMAIL_HERE';
                passwordInput.value = LANKONG_PASSWORD || 'YOUR_PASSWORD_HERE';
            }
        });

        uploadTypeSelect.dispatchEvent(new Event('change'));
    }

    function initScript() {
        createUploadButton();
        setupPasteAndDrop();
        addPlaceholder();
        const observer = new MutationObserver(() => {
            createUploadButton();
            setupPasteAndDrop();
            addPlaceholder();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createUploadButton() {
        const topicSelect = document.querySelector('.topic-select');
        if (!topicSelect || topicSelect.querySelector('.easyimage-upload-container')) return;
        const submitBtn = topicSelect.querySelector('.submit.btn');
        if (!submitBtn) return;
        const container = document.createElement('div');
        container.className = 'easyimage-upload-container';
        container.style.cssText = 'margin:5px 0;display:inline-block';
        const uploadButton = document.createElement('button');
        uploadButton.textContent = '📷 上传图片';
        uploadButton.style.cssText = 'padding:5px 10px;background-color:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;margin-right:10px';
        const updateButton = document.createElement('button');
        updateButton.textContent = '⚙️ 更新配置';
        updateButton.style.cssText = 'padding:5px 10px;background-color:#2196F3;color:white;border:none;border-radius:3px;cursor:pointer;margin-right:10px';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        container.appendChild(uploadButton);
        container.appendChild(updateButton);
        container.appendChild(fileInput);
        submitBtn.parentElement.insertBefore(container, submitBtn);
        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length === 0) return;
            const file = fileInput.files[0];
            uploadButton.textContent = '正在上传...';
            uploadButton.disabled = true;
            uploadImage(file, (success, result) => {
                uploadButton.textContent = '📷 上传图片';
                uploadButton.disabled = false;
                if (success) insertMarkdown(result);
                else alert('上传失败：' + result);
            });
        });
        updateButton.addEventListener('click', () => showConfigModal(true));
    }

    function setupPasteAndDrop() {
        const editor = document.querySelector('.CodeMirror');
        if (!editor) return;
        const cm = editor.CodeMirror;
        if (!cm) return;
        if (editor.dataset.pasteDropSetup) return;
        editor.dataset.pasteDropSetup = 'true';
        cm.on('paste', (cmInstance, event) => {
            const items = (event.clipboardData || window.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === 0) {
                    event.preventDefault();
                    const file = items[i].getAsFile();
                    uploadImage(file, (success, result) => {
                        if (success) insertMarkdown(result);
                        else alert('上传失败：' + result);
                    });
                    break;
                }
            }
        });
        let uploadInProgress = false;
        editor.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });
        editor.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (uploadInProgress) {
                console.log('Drop event skipped: upload in progress');
                return;
            }
            const files = event.dataTransfer.files;
            if (files.length > 0 && files[0].type.indexOf('image') === 0) {
                const file = files[0];
                console.log('Starting upload for file:', file.name);
                uploadInProgress = true;
                uploadImage(file, (success, result) => {
                    uploadInProgress = false;
                    if (success) {
                        insertMarkdown(result);
                        console.log('Upload completed for:', file.name);
                    } else {
                        alert('上传失败：' + result);
                        console.log('Upload failed for:', file.name, result);
                    }
                });
            } else {
                console.log('No image file dropped');
            }
        });
    }

    function addPlaceholder() {
        const editor = document.querySelector('.CodeMirror');
        if (!editor || editor.querySelector('.easyimage-placeholder')) return;
        const placeholder = document.createElement('div');
        placeholder.className = 'easyimage-placeholder';
        placeholder.textContent = '拖拽或粘贴图片可以上传图片';
        placeholder.style.cssText = 'position:absolute;bottom:10px;right:10px;color:#aaa;font-size:12px;pointer-events:none;z-index:1';
        editor.appendChild(placeholder);
        const cm = editor.CodeMirror;
        if (cm) {
            cm.on('change', () => {
                placeholder.style.display = cm.getValue().trim() ? 'none' : 'block';
            });
        }
    }

    function uploadImage(file, callback) {
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
        if (window.uploadedFiles && window.uploadedFiles[fileKey]) {
            console.log('File already uploaded:', fileKey);
            return callback(true, window.uploadedFiles[fileKey]);
        }

        if (UPLOAD_TYPE === 'easyimage') {
            const apiDomain = extractDomain(EASYIMAGE_API_URL);
            console.log('Uploading to:', EASYIMAGE_API_URL, 'Domain:', apiDomain, 'with token:', EASYIMAGE_TOKEN);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('token', EASYIMAGE_TOKEN);
            // 使用 unsafeWindow.fetch 发起请求，绕过 Tampermonkey 的 @connect 限制
            unsafeWindow.fetch(EASYIMAGE_API_URL, {
                method: 'POST',
                body: formData,
                timeout: 10000 // 10 秒超时（fetch 本身不支持 timeout，需手动实现）
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Response:', result);
                if (result.result === 'success' && result.code === 200) {
                    if (!window.uploadedFiles) window.uploadedFiles = {};
                    window.uploadedFiles[fileKey] = result.url;
                    callback(true, result.url);
                } else {
                    callback(false, result.message || '服务器返回错误');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                callback(false, '网络错误：' + error.message);
            });
        } else if (UPLOAD_TYPE === 'lankong') {
            const apiDomain = extractDomain(LANKONG_API_URL);
            console.log('Fetching token from:', LANKONG_API_URL, 'Domain:', apiDomain);
            unsafeWindow.fetch(`${LANKONG_API_URL}/api/v1/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: LANKONG_EMAIL,
                    password: LANKONG_PASSWORD
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    const token = data.data.token;
                    console.log('Token: ', token);
                    const formData = new FormData();
                    formData.append('image', file);
                    unsafeWindow.fetch(`${LANKONG_API_URL}/api/v1/upload`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData,
                        timeout: 10000 // 10 秒超时（fetch 本身不支持 timeout，需手动实现）
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.status) {
                            if (!window.uploadedFiles) window.uploadedFiles = {};
                            window.uploadedFiles[fileKey] = result.data.url;
                            callback(true, result.data.url);
                        } else {
                            callback(false, result.message || '上传失败');
                        }
                    })
                    .catch(error => {
                        console.error('Upload error:', error);
                        callback(false, '网络错误：' + error.message);
                    });
                } else {
                    callback(false, data.message || '获取Token失败');
                }
            })
            .catch(error => {
                console.error('Fetch token error:', error);
                callback(false, '网络错误：' + error.message);
            });
        }
    }

    function insertMarkdown(url) {
        const markdown = `![image](${url})`;
        const editor = document.querySelector('.CodeMirror');
        if (editor) {
            const cm = editor.CodeMirror;
            if (cm) {
                cm.replaceRange(markdown, cm.getCursor());
                cm.focus();
                showSuccessMessage();
            }
        }
    }

    function showSuccessMessage() {
        const topicSelect = document.querySelector('.topic-select');
        const successMsg = document.createElement('div');
        successMsg.textContent = '🎉 图片上传成功！';
        successMsg.style.cssText = 'color:#4CAF50;margin:5px 0';
        topicSelect.insertBefore(successMsg, topicSelect.firstChild);
        setTimeout(() => successMsg.remove(), 2000);
    }
})();