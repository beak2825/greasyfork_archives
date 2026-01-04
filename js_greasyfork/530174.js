// ==UserScript==
// @name         NodeSeek 编辑器图床增强脚本
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在 NodeSeek 支持点击、拖拽和粘贴上传图片16 图床兼容自建（兰空图床/简单图床），并插入 Markdown 格式到编辑器
// @author       ZhangBreeze
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530174/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%9B%BE%E5%BA%8A%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530174/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%9B%BE%E5%BA%8A%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认图床相关常量
    const SIXTEEN_API_TOKEN_KEY = 'sixteenToken';
    const IMAGE_HOST_KEY = 'imageHost';

    // 只在首次未设置时设为16图床
    (function initSixteenDefault() {
        if (!GM_getValue(IMAGE_HOST_KEY)) {
            GM_setValue(IMAGE_HOST_KEY, 'sixteen');
        }
    })();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const editorWrapper = document.querySelector('#cm-editor-wrapper');
    const codeMirror = document.querySelector('.CodeMirror.cm-s-default.cm-s-nsk.CodeMirror-wrap.CodeMirror-overlayscroll');
    const cmInstance = document.querySelector('.CodeMirror')?.CodeMirror;

    function addUploadHint(container) {
        if (!container) return;
        const existingHint = container.querySelector('.upload-hint-text');
        if (existingHint) return;
        const hint = document.createElement('div');
        hint.className = 'upload-hint-text';
        hint.textContent = '支持拖拽或粘贴上传图片';
        hint.style.position = 'absolute';
        hint.style.bottom = '5px';
        hint.style.right = '5px';
        hint.style.color = '#888';
        hint.style.fontSize = '12px';
        hint.style.zIndex = '10';
        hint.style.pointerEvents = 'none';
        container.style.position = 'relative';
        container.appendChild(hint);
    }

    if (editorWrapper) {
        addUploadHint(editorWrapper);
    } else if (codeMirror) {
        addUploadHint(codeMirror);
    }

    function showUploadHint(container, fileCount) {
        if (!container) return;
        const existingHints = document.querySelectorAll('[id^="upload-hint-"]');
        existingHints.forEach(hint => hint.remove());
        const uploadHint = document.createElement('div');
        uploadHint.textContent = `正在上传 ${fileCount} 张图片，请稍等`;
        uploadHint.style.position = 'absolute';
        uploadHint.style.top = '50%';
        uploadHint.style.left = '50%';
        uploadHint.style.transform = 'translate(-50%, -50%)';
        uploadHint.style.color = '#666';
        uploadHint.style.fontSize = '14px';
        uploadHint.style.background = 'rgba(0, 0, 0, 0.1)';
        uploadHint.style.padding = '5px 10px';
        uploadHint.style.borderRadius = '3px';
        uploadHint.style.zIndex = '20';
        uploadHint.style.maxWidth = '80%';
        uploadHint.style.whiteSpace = 'nowrap';
        uploadHint.style.overflow = 'hidden';
        uploadHint.style.textOverflow = 'ellipsis';
        uploadHint.id = 'upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror');
        container.appendChild(uploadHint);
    }

    function removeUploadHint(container) {
        const uploadHint = document.getElementById('upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror'));
        if (uploadHint) uploadHint.remove();
    }

    function addSettingsIcon() {
        const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
        if (!uploadIcon) return;
        const existingSettingsIcon = uploadIcon.parentNode.querySelector('.settings-icon');
        if (existingSettingsIcon) return;
        const settingsIcon = document.createElement('span');
        settingsIcon.className = 'toolbar-item i-icon settings-icon';
        settingsIcon.style.cursor = 'pointer';
        settingsIcon.style.marginLeft = '5px';
        settingsIcon.style.display = 'inline-block';
        settingsIcon.style.verticalAlign = 'middle';
        settingsIcon.style.width = '16px';
        settingsIcon.style.height = '16px';
        settingsIcon.title = '选择图床';
        settingsIcon.innerHTML = `
            <svg style="width: 100%; height: 100%; fill: currentColor;">
                <use data-v-0f04b1f4="" href="#setting-two"></use>
            </svg>
        `;
        uploadIcon.parentNode.insertBefore(settingsIcon, uploadIcon.nextSibling);
        settingsIcon.addEventListener('click', () => {
            showSettingsModal();
        });
    }

    function observeToolbar() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
                    if (uploadIcon) {
                        addSettingsIcon();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        addSettingsIcon();
    }

    observeToolbar();

    function showSettingsModal() {
        const existingModal = document.querySelector('#image-host-settings-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'image-host-settings-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = 'linear-gradient(135deg, #ffffff, #f0f4f8)';
        modal.style.padding = '25px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.zIndex = '1000';
        modal.style.width = '370px';
        modal.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        modal.style.color = '#333';

        const currentHost = GM_getValue('imageHost', 'sixteen');
        let currentSixteenToken = GM_getValue('sixteenToken', '');
        const currentLankongToken = GM_getValue('lankongCustomToken', '');
        const currentLankongApi = GM_getValue('lankongCustomApi', '');
        const currentCloudflareImgbedApi = GM_getValue('cloudflareImgbedApi');
        const currentCloudflareImgbedAuthCode = GM_getValue('cloudflareImgbedAuthCode');
        const currentCloudflareImgbedCompress = GM_getValue('cloudflareImgbedCompress', true);
        const currentSimpleImgbedApi = GM_getValue('simpleImgbedApi', 'http://127.0.0.1/api/index.php');
        const currentSimpleImgbedToken = GM_getValue('simpleImgbedToken', '');

        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #2c3e50;">图床设置</h3>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">选择图床：</label>
            <select id="image-host-select" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                <option value="lankong-custom" ${currentHost === 'lankong-custom' ? 'selected' : ''}>LSKY 接口</option>
                <option value="sixteen" ${currentHost === 'sixteen' ? 'selected' : ''}>16 图床</option>
                <option value="uhsea" ${currentHost === 'uhsea' ? 'selected' : ''}>屋舍图床</option>
                <option value="cloudflare-imgbed" ${currentHost === 'cloudflare-imgbed' ? 'selected' : ''}>Cloudflare ImgBed</option>
                <option value="simple-imgbed" ${currentHost === 'simple-imgbed' ? 'selected' : ''}>简单图床</option>
            </select>

            <div id="lankong-token-section" style="display: ${currentHost === 'lankong-custom' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">兰空图床 API 端点：</label>
                <input type="text" id="lankong-api-input" value="${currentLankongApi}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="https://example.com/api/v1/upload">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">兰空图床 Token：</label>
                <input type="text" id="lankong-token-input" value="${currentLankongToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请输入 Token">
            </div>

            <div id="sixteen-token-section" style="display: ${currentHost === 'sixteen' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">16 图床 Auth-Token：</label>
                <input type="text" id="sixteen-token-input" value="${currentSixteenToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请手动填写">
                <div style="font-size:12px;color:#888;margin-top:2px;">如需token请访问 <a href="https://111666.best/" target="_blank">16图床官网</a></div>
            </div>

            <div id="cloudflare-imgbed-section" style="display: ${currentHost === 'cloudflare-imgbed' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">Cloudflare ImgBed 域名：</label>
                <input type="text" id="cloudflare-imgbed-api-input" value="${currentCloudflareImgbedApi}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="https://img.yourdomain.link">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">Cloudflare ImgBed Auth Code：</label>
                <input type="text" id="cloudflare-imgbed-auth-input" value="${currentCloudflareImgbedAuthCode}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请输入 Auth Code">
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                    <input type="checkbox" id="cloudflare-imgbed-compress-checkbox" ${currentCloudflareImgbedCompress ? 'checked' : ''} style="margin-right: 8px;">
                    <label for="cloudflare-imgbed-compress-checkbox" style="font-size: 14px; color: #34495e; cursor: pointer;">开启服务器端压缩</label>
                </div>
            </div>

            <div id="simple-imgbed-section" style="display: ${currentHost === 'simple-imgbed' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">简单图床 API 地址：</label>
                <input type="text" id="simple-imgbed-api-input" value="${currentSimpleImgbedApi}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333;" placeholder="如：http://127.0.0.1/api/index.php">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">简单图床 Token：</label>
                <input type="text" id="simple-imgbed-token-input" value="${currentSimpleImgbedToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333;" placeholder="请输入 Token">
                <div style="font-size:12px;color:#888;margin-top:2px;">请在简单图床 设置-API设置-Token API 管理 中查找</div>
            </div>

            <div style="text-align: right;">
                <button id="save-settings-btn" style="background: linear-gradient(90deg, #4CAF50, #45a049); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s;">保存</button>
                <button id="close-settings-btn" style="background: linear-gradient(90deg, #f44336, #e53935); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-left: 10px; transition: background 0.3s;">关闭</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.4)';
        overlay.style.zIndex = '999';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const hostSelect = document.querySelector('#image-host-select');
        const lankongTokenSection = document.querySelector('#lankong-token-section');
        const sixteenTokenSection = document.querySelector('#sixteen-token-section');
        const cloudflareImgbedSection = document.querySelector('#cloudflare-imgbed-section');
        const simpleImgbedSection = document.querySelector('#simple-imgbed-section');

        hostSelect.addEventListener('change', () => {
            lankongTokenSection.style.display = hostSelect.value === 'lankong-custom' ? 'block' : 'none';
            sixteenTokenSection.style.display = hostSelect.value === 'sixteen' ? 'block' : 'none';
            cloudflareImgbedSection.style.display = hostSelect.value === 'cloudflare-imgbed' ? 'block' : 'none';
            simpleImgbedSection.style.display = hostSelect.value === 'simple-imgbed' ? 'block' : 'none';
        });

        document.querySelector('#save-settings-btn').addEventListener('click', () => {
            const selectedHost = hostSelect.value;
            GM_setValue('imageHost', selectedHost);

            if (selectedHost === 'sixteen') {
                const sixteenTokenInput = document.querySelector('#sixteen-token-input').value;
                GM_setValue('sixteenToken', sixteenTokenInput);
            } else if (selectedHost === 'lankong-custom') {
                const lankongTokenInput = document.querySelector('#lankong-token-input').value;
                const lankongApiInput = document.querySelector('#lankong-api-input').value;
                GM_setValue('lankongCustomToken', lankongTokenInput);
                GM_setValue('lankongCustomApi', lankongApiInput);
            } else if (selectedHost === 'cloudflare-imgbed') {
                const cloudflareImgbedApiInput = document.querySelector('#cloudflare-imgbed-api-input').value;
                const cloudflareImgbedAuthInput = document.querySelector('#cloudflare-imgbed-auth-input').value;
                const cloudflareImgbedCompressCheckbox = document.querySelector('#cloudflare-imgbed-compress-checkbox').checked;
                GM_setValue('cloudflareImgbedApi', cloudflareImgbedApiInput);
                GM_setValue('cloudflareImgbedAuthCode', cloudflareImgbedAuthInput);
                GM_setValue('cloudflareImgbedCompress', cloudflareImgbedCompressCheckbox);
            } else if (selectedHost === 'simple-imgbed') {
                const simpleImgbedApiInput = document.querySelector('#simple-imgbed-api-input').value;
                const simpleImgbedTokenInput = document.querySelector('#simple-imgbed-token-input').value;
                GM_setValue('simpleImgbedApi', simpleImgbedApiInput);
                GM_setValue('simpleImgbedToken', simpleImgbedTokenInput);
            }

            modal.remove();
            overlay.remove();
        });

        document.querySelector('#close-settings-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        const saveBtn = document.querySelector('#save-settings-btn');
        const closeBtn = document.querySelector('#close-settings-btn');
        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.background = 'linear-gradient(90deg, #45a049, #4CAF50)';
        });
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        });
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'linear-gradient(90deg, #e53935, #f44336)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
        });
    }

    let isUploading = false;

    document.addEventListener('click', function(e) {
        const target = e.target.closest('span.toolbar-item.i-icon.i-icon-pic');
        if (target && !isUploading) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        }
    }, true);

    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files.length > 0 && !isUploading) {
            isUploading = true;
            const files = Array.from(e.target.files);
            uploadMultipleFiles(files, editorWrapper || codeMirror).finally(() => {
                isUploading = false;
                fileInput.value = '';
            });
        }
    });

    if (editorWrapper) {
        editorWrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) editorWrapper.style.border = '2px dashed #000';
        });
        editorWrapper.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorWrapper.style.border = '';
        });
        editorWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorWrapper.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, editorWrapper).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
    }

    if (editorWrapper) {
        editorWrapper.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, editorWrapper).finally(() => isUploading = false);
            }
        });
    } else if (codeMirror) {
        codeMirror.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, codeMirror).finally(() => isUploading = false);
            }
        });
    }

    if (codeMirror) {
        codeMirror.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) codeMirror.style.border = '2px dashed #000';
        });
        codeMirror.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeMirror.style.border = '';
        });
        codeMirror.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeMirror.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, codeMirror).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
    }

    async function uploadMultipleFiles(files, container) {
        if (files.length === 0) return;
        showUploadHint(container, files.length);
        const selectedHost = GM_getValue('imageHost', 'sixteen');
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            if (selectedHost === 'lankong-custom' || selectedHost === 'uhsea' || selectedHost === 'cloudflare-imgbed' || selectedHost === 'simple-imgbed') {
                formData.append('image', file, file.name);
            } else {
                formData.append('image', file, file.name);
            }
            return uploadToImageHost(formData, file.name, selectedHost);
        });
        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('批量上传失败:', error);
            alert('部分或全部图片上传失败，请查看控制台了解详情。');
        } finally {
            removeUploadHint(container);
        }
    }

    function uploadToImageHost(formData, fileName, host) {
        return new Promise(async (resolve, reject) => {
            const selectedHost = host;
            let apiUrl, headers = {};

            if (selectedHost === 'cloudflare-imgbed') {
                const baseApiUrl = GM_getValue('cloudflareImgbedApi', '').trim();
                const authCode = GM_getValue('cloudflareImgbedAuthCode', '').trim();
                const enableCompress = GM_getValue('cloudflareImgbedCompress', true);

                if (!baseApiUrl) {
                    console.error('Cloudflare ImgBed 需要设置域名');
                    reject(new Error('Cloudflare ImgBed 需要设置域名'));
                    return;
                }
                if (!authCode) {
                    console.error('Cloudflare ImgBed 需要设置 Auth Code');
                    reject(new Error('Cloudflare ImgBed 需要设置 Auth Code'));
                    return;
                }

                const cleanedBaseUrl = baseApiUrl.endsWith('/') && baseApiUrl !== '/' ? baseApiUrl.slice(0, -1) : baseApiUrl;
                apiUrl = `${cleanedBaseUrl}/upload?authCode=${encodeURIComponent(authCode)}`;
                apiUrl += '&serverCompress=' + enableCompress;

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: headers,
                    data: formData,
                    onload: (response) => {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (response.status >= 200 && response.status < 300 && Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].src) {
                                const imageUrl = cleanedBaseUrl + jsonResponse[0].src;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('Cloudflare-ImgBed 上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            }
                            else {
                                console.error('Cloudflare-ImgBed 上传成功但返回格式无效或失败:', jsonResponse);
                                const errorMessage = jsonResponse && (jsonResponse.message || jsonResponse.error || JSON.stringify(jsonResponse));
                                reject(new Error(`上传失败：服务器返回无效响应或错误 (${response.status}): ${errorMessage}`));
                            }
                        } catch (error) {
                            console.error('解析 Cloudflare-ImgBed 响应错误:', error);
                            reject(new Error(`解析服务器响应失败: ${error.message}`));
                        }
                    },
                    onerror: (error) => {
                        console.error('Cloudflare-ImgBed 上传错误详情:', error);
                        reject(new Error(`上传请求失败: ${error.statusText || error.message || JSON.stringify(error)}`));
                    },
                    ontimeout: () => {
                        console.error('Cloudflare-ImgBed 请求超时');
                        reject(new Error('上传请求超时'));
                    },
                    timeout: 30000
                });

            } else if (selectedHost === 'lankong') {
                reject(new Error('已移除银星图床功能'));
            } else if (selectedHost === 'lankong-custom') {
                const api = GM_getValue('lankongCustomApi', '').trim();
                const token = GM_getValue('lankongCustomToken', '').trim();
                if (!api) { console.error('兰空图床需要设置 API 端点'); reject(new Error('兰空图床需要设置 API 端点')); return; }
                if (!token) { console.error('兰空图床需要设置 Token'); reject(new Error('兰空图床需要设置 Token')); return; }
                apiUrl = api;
                headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl, headers: headers, data: formData, timeout: 10000,
                    onload: (response) => {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (response.status === 200 && jsonResponse && jsonResponse.data && jsonResponse.data.links && jsonResponse.data.links.url) {
                                const imageUrl = jsonResponse.data.links.url;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('兰空图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('兰空图床上传成功但未获取到有效链接:', jsonResponse);
                                reject(new Error('Invalid response from 兰空图床'));
                            }
                        } catch (error) {
                            console.error('解析兰空图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('兰空图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('兰空图床请求超时'); reject(new Error('Timeout')); }
                });

            } else if (selectedHost === 'uhsea') {
                apiUrl = 'https://uhsea.com/Frontend/upload';
                headers = {};
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl, headers: headers, data: formData, timeout: 10000,
                    onload: (response) => {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (response.status === 200 && jsonResponse && jsonResponse.data) {
                                const imageUrl = jsonResponse.data;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('屋舍图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('屋舍图床上传成功但未获取到有效链接:', jsonResponse);
                                reject(new Error('Invalid response from Uhsea'));
                            }
                        } catch (error) {
                            console.error('解析屋舍图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('屋舍图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('屋舍图床请求超时'); reject(new Error('Timeout')); }
                });

            } else if (selectedHost === 'sixteen') {
                apiUrl = 'https://i.111666.best/image';
                const token = GM_getValue('sixteenToken', '').trim();
                if (!token) { console.error('16 图床需要设置 Auth-Token'); reject(new Error('16 图床需要设置 Auth-Token')); return; }
                headers = { 'Auth-Token': token };
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl, headers: headers, data: formData, timeout: 10000,
                    onload: (response) => {
                        try {
                            if (response.status === 200 && response.responseText) {
                                const jsonResponse = JSON.parse(response.responseText);
                                if (jsonResponse.ok && jsonResponse.src) {
                                    const imageUrl = `https://i.111666.best${jsonResponse.src}`;
                                    const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                    console.log('16 图床上传成功，Markdown:', markdownImage);
                                    insertToEditor(markdownImage);
                                    resolve();
                                } else {
                                    console.error('16 图床返回的响应无效:', jsonResponse);
                                    reject(new Error('Invalid response from 16 图床'));
                                }
                            } else {
                                console.error('16 图床上传失败:', response.responseText);
                                reject(new Error(`Upload failed on 16 图床: ${response.status} ${response.statusText}`));
                            }
                        } catch (error) {
                            console.error('解析 16 图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('16 图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('16 图床请求超时'); reject(new Error('Timeout')); }
                });
            } else if (selectedHost === 'simple-imgbed') {
                apiUrl = GM_getValue('simpleImgbedApi', '').trim();
                const token = GM_getValue('simpleImgbedToken', '').trim();
                if (!apiUrl) {
                    console.error('简单图床需要设置 API 地址');
                    reject(new Error('简单图床需要设置 API 地址'));
                    return;
                }
                if (!token) {
                    console.error('简单图床需要设置 Token');
                    reject(new Error('简单图床需要设置 Token'));
                    return;
                }
                formData.append('token', token);
                headers = {};
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: headers,
                    data: formData,
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (response.status === 200 && jsonResponse && jsonResponse.result === 'success' && jsonResponse.url) {
                                const imageUrl = jsonResponse.url;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('简单图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('简单图床上传成功但未获取到有效链接:', jsonResponse);
                                reject(new Error('Invalid response from 简单图床'));
                            }
                        } catch (error) {
                            console.error('解析简单图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('简单图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('简单图床请求超时'); reject(new Error('Timeout')); }
                });
            } else {
                console.error(`未知的图床选项: ${selectedHost}`);
                reject(new Error(`未知的图床选项: ${selectedHost}`));
            }
        });
    }

    function insertToEditor(markdown) {
        if (cmInstance) {
            const cursor = cmInstance.getCursor();
            cmInstance.replaceRange(markdown + '\n', cursor);
            console.log('已插入 Markdown 到编辑器');
        } else {
            const editable = document.querySelector('.CodeMirror textarea') || document.querySelector('textarea');
            if (editable) {
                const start = editable.selectionStart;
                const end = editable.selectionEnd;
                editable.value = editable.value.substring(0, start) + markdown + '\n' + editable.value.substring(end);
                editable.selectionStart = editable.selectionEnd = start + markdown.length + 1;
                console.log('已插入 Markdown 到 textarea');
                const event = new Event('input', { bubbles: true });
                editable.dispatchEvent(event);
            } else {
                console.error('未找到可编辑的 CodeMirror 实例或 textarea');
            }
        }
    }
})();