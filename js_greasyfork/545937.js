// ==UserScript==
// @name         V2EX Image Uploader (CodeMirror Compatible)
// @namespace    http://tampermonkey.net/1436051
// @version      1.2
// @description  在 V2EX 评论区和新主题发布区快速上传图片并插入链接，支持拖拽、选择文件和粘贴上传。兼容 CodeMirror 编辑器。
// @author       dogxi (updated by Lome & Gemini)
// @match        https://www.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @match        https://www.v2ex.com/write*
// @match        https://v2ex.com/write*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.imgur.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545937/V2EX%20Image%20Uploader%20%28CodeMirror%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545937/V2EX%20Image%20Uploader%20%28CodeMirror%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMGUR_CLIENT_ID_KEY = 'imgurClientId';
    let CLIENT_ID = GM_getValue(IMGUR_CLIENT_ID_KEY, null);

    // [无需修改] 样式和大部分核心函数保持不变
    const STYLE = `
        .imgur-upload-btn { background: none; border: none; color: #778087; cursor: pointer; font-size: 13px; padding: 0; margin-left: 15px; text-decoration: none; transition: color 0.2s ease; display: inline-block; vertical-align: middle; }
        .imgur-upload-btn:hover { color: #4d5256; text-decoration: underline; }
        /* ... 其他样式保持不变 ... */
        .hidden { display: none !important; }
        .imgur-upload-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10001; }
        .imgur-upload-modal-content { background-color: #fff; padding: 20px; border-radius: 3px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); max-width: 450px; width: 90%; position: relative; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
        .imgur-upload-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e2e2; }
        .imgur-upload-modal-title { font-size: 15px; font-weight: normal; color: #000; }
        .imgur-upload-modal-close { cursor: pointer; font-size: 18px; color: #ccc; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease; }
        .imgur-upload-modal-close:hover { color: #999; }
        .imgur-upload-dropzone { border: 1px dashed #ccc; padding: 25px; text-align: center; margin-bottom: 15px; cursor: pointer; border-radius: 3px; transition: border-color 0.2s ease; font-size: 13px; color: #666; }
        .imgur-upload-dropzone:hover { border-color: #999; }
        .imgur-upload-dropzone.dragover { border-color: #778087; background-color: #f9f9f9; }
        .imgur-upload-preview { margin-top: 10px; max-width: 100%; max-height: 150px; border-radius: 2px; }
        .imgur-upload-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e2e2e2; }
        .imgur-upload-config-btn { background: none; border: none; color: #778087; cursor: pointer; font-size: 12px; padding: 0; }
        .imgur-upload-config-btn:hover { color: #4d5256; text-decoration: underline; }
        .imgur-upload-submit-btn { background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 3px; color: #333; cursor: pointer; font-size: 12px; padding: 6px 12px; transition: all 0.2s ease; }
        .imgur-upload-submit-btn:hover { background-color: #e8e8e8; }
        .imgur-upload-submit-btn:disabled { background-color: #f9f9f9; color: #ccc; cursor: not-allowed; }
        .imgur-upload-config-panel { margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 3px; border: 1px solid #e2e2e2; }
        .imgur-upload-config-row { display: flex; align-items: center; margin-bottom: 8px; }
        .imgur-upload-config-row:last-child { margin-bottom: 0; }
        .imgur-upload-config-label { font-size: 12px; color: #666; width: 70px; flex-shrink: 0; }
        .imgur-upload-config-input { flex: 1; padding: 3px 6px; border: 1px solid #ccc; border-radius: 2px; font-size: 12px; }
        .imgur-upload-config-save { background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 2px; color: #333; cursor: pointer; font-size: 11px; margin-left: 6px; padding: 3px 8px; }
        .imgur-upload-config-save:hover { background-color: #e8e8e8; }
        .imgur-upload-modal-status { color: #666; font-size: 12px; text-align: center; }
        .imgur-upload-modal-status.success { color: #5cb85c; }
        .imgur-upload-modal-status.error { color: #d9534f; }
        .imgur-paste-status { position: absolute; bottom: 5px; right: 10px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 4px 8px; font-size: 12px; border-radius: 3px; z-index: 10000; pointer-events: none; transition: opacity 0.3s ease; }
        .imgur-paste-status.success { background-color: #5cb85c; }
        .imgur-paste-status.error { background-color: #d9534f; }
    `;

    function addStyle() { /* ... */ } // implementation unchanged
    function createUploadModal(editorElement) { /* ... */ } // implementation unchanged
    function setupModalEvents(modal, editorElement) { /* ... */ } // implementation unchanged

    function showPasteStatus(editor, message, type) {
        // CodeMirror's parent is the target for status element
        const wrapper = editor.CodeMirror ? editor : editor.parentElement;
        let statusEl = wrapper.querySelector('.imgur-paste-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'imgur-paste-status';
            if (getComputedStyle(wrapper).position === 'static') {
                wrapper.style.position = 'relative';
            }
            wrapper.appendChild(statusEl);
        }
        statusEl.textContent = message;
        statusEl.className = 'imgur-paste-status ' + (type || '');
        statusEl.style.opacity = 1;
        const timeout = type === 'success' ? 2000 : 5000;
        setTimeout(() => { if (statusEl) statusEl.style.opacity = 0; }, timeout);
    }

    function uploadPastedImage(file, editorElement) {
        showPasteStatus(editorElement, '图片上传中...', 'info');
        const formData = new FormData();
        formData.append('image', file);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: { "Authorization": "Client-ID " + CLIENT_ID },
            data: formData,
            responseType: "json",
            onload: function(response) {
                try {
                    const responseData = typeof response.response === 'string' ? JSON.parse(response.response) : response.response;
                    if (response.status === 200 && responseData.success) {
                        const imageUrl = responseData.data.link;
                        insertLink(editorElement, imageUrl); // Use the new universal insert function
                        showPasteStatus(editorElement, '上传成功！', 'success');
                    } else {
                        const errorMessage = responseData?.data?.error?.message || responseData?.data?.error || `上传失败 (${response.status})`;
                        console.error('Imgur 粘贴上传错误:', response);
                        showPasteStatus(editorElement, `上传失败: ${errorMessage}`, 'error');
                    }
                } catch (e) {
                    console.error('解析响应失败:', e, response);
                    showPasteStatus(editorElement, '响应解析失败', 'error');
                }
            },
            onerror: function(error) {
                console.error('GM_xmlhttpRequest 错误:', error);
                showPasteStatus(editorElement, '网络请求失败', 'error');
            }
        });
    }

    // [重大更新] 统一的链接插入函数，兼容 CodeMirror 和普通 textarea
    function insertLink(editor, imageUrl) {
        const isCodeMirror = !!editor.CodeMirror;

        if (isCodeMirror) {
            const doc = editor.CodeMirror.getDoc();
            const cursor = doc.getCursor();
            const line = doc.getLine(cursor.line);
            const prefix = (cursor.ch > 0 && !/\s/.test(line.charAt(cursor.ch - 1))) ? '\n' : '';
            const suffix = (cursor.ch < line.length && !/\s/.test(line.charAt(cursor.ch))) ? '\n' : '';
            const finalInsert = prefix + imageUrl + suffix;
            doc.replaceSelection(finalInsert);
            editor.CodeMirror.focus();
        } else { // Fallback for standard textarea
            const { value, selectionStart, selectionEnd } = editor;
            const prefix = (selectionStart > 0 && !/\s/.test(value[selectionStart - 1])) ? '\n' : '';
            const suffix = (value.length > selectionEnd && !/\s/.test(value[selectionEnd])) ? '\n' : '';
            const finalInsert = prefix + imageUrl + suffix;
            editor.value = value.substring(0, selectionStart) + finalInsert + value.substring(selectionEnd);
            const newCursorPosition = selectionStart + finalInsert.length - suffix.length;
            editor.selectionStart = editor.selectionEnd = newCursorPosition;
            editor.focus();
            editor.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }
    }

    // [重大更新] handlePasteUpload 现在接受第二个参数 `editorElement`
    function handlePasteUpload(e, editorElement) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        let imageFile = null;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                imageFile = item.getAsFile();
                break;
            }
        }
        if (imageFile) {
            e.preventDefault();
            if (!CLIENT_ID) {
                // `editorElement` is either the CodeMirror div or the textarea
                showPasteStatus(editorElement, '请先点击"上传图片"按钮配置 Imgur ID', 'error');
                return;
            }
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const fileExtension = imageFile.type.split('/')[1] || 'png';
            const renamedFile = new File([imageFile], `v2ex-paste-${timestamp}.${fileExtension}`, { type: imageFile.type });
            uploadPastedImage(renamedFile, editorElement);
        }
    }

    function waitForElement(selector, callback, timeout = 10000) { /* ... */ } // implementation unchanged

    // [重大更新] 重构安装逻辑，以 CodeMirror 为主
    function setupUploader(editorElement, buttonContainer) {
        const isCodeMirror = !!editorElement.CodeMirror;
        const targetElement = isCodeMirror ? editorElement : editorElement; // For events, CM div is the target

        if (targetElement && !targetElement.dataset.pasteHandlerAttached) {
            targetElement.addEventListener('paste', (e) => handlePasteUpload(e, editorElement));
            targetElement.dataset.pasteHandlerAttached = 'true';
            console.log('V2EX Uploader: Paste handler attached to', isCodeMirror ? 'CodeMirror Editor' : editorElement.id);
        }

        if (editorElement && buttonContainer && !buttonContainer.querySelector('.imgur-upload-btn')) {
            const uploadBtn = document.createElement('a');
            uploadBtn.className = 'imgur-upload-btn';
            uploadBtn.textContent = '上传图片';
            uploadBtn.href = 'javascript:void(0);';
            uploadBtn.title = '上传图片到 Imgur';
            buttonContainer.appendChild(uploadBtn);
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                createUploadModal(editorElement); // Pass the correct editor element
            });
            console.log('V2EX Uploader: Upload button added.');
        }
    }

    // [重大更新] 主初始化逻辑
    function init() {
        // Inject styles first
        const styleElement = document.createElement('style');
        styleElement.textContent = STYLE;
        document.head.appendChild(styleElement);

        // 1. 处理创建新主题页面 (CodeMirror)
        if (window.location.pathname.startsWith('/write')) {
            waitForElement('.CodeMirror', (editorDiv) => {
                const label = document.querySelector('.cell .form-label');
                setupUploader(editorDiv, label);
            });
        }

        // 2. 处理帖子详情页的回复框 (标准 textarea)
        if (window.location.pathname.startsWith('/t/')) {
            const setupReplyBox = (scope) => {
                const textarea = scope.querySelector('#reply_content');
                if (textarea && !textarea.dataset.pasteHandlerAttached) {
                    const header = scope.querySelector('#reply-box .cell.flex-one-row > div:first-child');
                    setupUploader(textarea, header);
                }
            };

            setupReplyBox(document); // Handle initial static reply box

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        setupReplyBox(document);
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Stubs for unchanged functions
    addStyle = function() { /* see init */ };
    createUploadModal = function(editorElement) { const modal = document.createElement('div'); modal.className = 'imgur-upload-modal'; const content = document.createElement('div'); content.className = 'imgur-upload-modal-content'; content.innerHTML = ` <div class="imgur-upload-modal-header"> <div class="imgur-upload-modal-title">上传图片</div> <div class="imgur-upload-modal-close">×</div> </div> <div class="imgur-upload-dropzone"> <div>点击选择图片或拖拽图片到此处</div> <div style="font-size: 11px; color: #999; margin-top: 5px;">支持 JPG, PNG, GIF 格式</div> </div> <div class="imgur-upload-actions"> <button class="imgur-upload-config-btn">⚙️ 配置</button> <button class="imgur-upload-submit-btn" disabled>确认上传</button> </div> <div class="imgur-upload-config-panel hidden"> <div class="imgur-upload-config-row"> <div class="imgur-upload-config-label">Imgur ID:</div> <input type="text" class="imgur-upload-config-input" placeholder="请输入 Imgur Client ID" value="${CLIENT_ID || ''}"> <button class="imgur-upload-config-save">保存</button> </div> <div style="font-size: 11px; color: #666; margin-top: 8px;"> 在 <a href="https://api.imgur.com/oauth2/addclient" target="_blank">https://api.imgur.com/oauth2/addclient</a> 注册获取(无回调) </div> </div> `; modal.appendChild(content); document.body.appendChild(modal); setupModalEvents(modal, editorElement); return modal; };
    setupModalEvents = function(modal, editorElement) { const closeBtn = modal.querySelector('.imgur-upload-modal-close'); const dropzone = modal.querySelector('.imgur-upload-dropzone'); const configBtn = modal.querySelector('.imgur-upload-config-btn'); const configPanel = modal.querySelector('.imgur-upload-config-panel'); const configInput = modal.querySelector('.imgur-upload-config-input'); const configSave = modal.querySelector('.imgur-upload-config-save'); const submitBtn = modal.querySelector('.imgur-upload-submit-btn'); let selectedFile = null; function closeModal() { if (document.body.contains(modal)) document.body.removeChild(modal); } closeBtn.addEventListener('click', closeModal); modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); }); configBtn.addEventListener('click', () => configPanel.classList.toggle('hidden')); configSave.addEventListener('click', () => { const newClientId = configInput.value.trim(); if (newClientId) { GM_setValue(IMGUR_CLIENT_ID_KEY, newClientId); CLIENT_ID = newClientId; configPanel.classList.add('hidden'); } }); const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none'; modal.appendChild(fileInput); dropzone.addEventListener('click', () => fileInput.click()); fileInput.addEventListener('change', (e) => handleFileSelect(e.target.files[0])); dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); }); dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); }); dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); const files = e.dataTransfer.files; if (files.length > 0) handleFileSelect(files[0]); }); function handleFileSelect(file) { if (!file || !file.type.match(/image\/.*/)) return; selectedFile = file; const reader = new FileReader(); reader.onload = function(e) { let preview = modal.querySelector('.imgur-upload-preview'); if (preview) preview.remove(); const img = document.createElement('img'); img.src = e.target.result; img.className = 'imgur-upload-preview'; dropzone.appendChild(img); submitBtn.disabled = false; dropzone.querySelector('div').textContent = '已选择: ' + file.name; }; reader.readAsDataURL(file); } submitBtn.addEventListener('click', () => { if (!selectedFile) return; if (!CLIENT_ID) { configPanel.classList.remove('hidden'); return; } submitBtn.disabled = true; submitBtn.textContent = '上传中...'; uploadToImgur(selectedFile, editorElement, modal); }); };
    waitForElement = function(selector, callback, timeout = 10000) { const intervalTime = 100; let timeElapsed = 0; const interval = setInterval(() => { const element = document.querySelector(selector); if (element) { clearInterval(interval); callback(element); } timeElapsed += intervalTime; if (timeElapsed >= timeout) { clearInterval(interval); } }, intervalTime); };


    // --- 脚本启动 ---
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();