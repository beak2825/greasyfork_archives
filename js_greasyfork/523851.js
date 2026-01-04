// ==UserScript==
// @name         47BT论坛图片上传助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为47bt.com论坛添加图片上传功能
// @author       Mobius
// @match        https://47bt.com/forum.php?mod=post*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @icon         https://47bt.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523851/47BT%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523851/47BT%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后再初始化
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始初始化上传按钮');
        setTimeout(addUploadButton, 1000); // 延迟1秒执行，确保编辑器已完全加载
    });

    // 添加上传按钮和设置按钮
    function addUploadButton() {
        // 尝试多个可能的容器
        const postbox = document.querySelector('#postbox, #ct, #e_body, .area');
        if (!postbox) {
            console.error('未找到编辑器容器');
            return;
        }

        // 设置容器为相对定位，这样浮动工具栏才能正确定位
        postbox.style.position = 'relative';

        // 获取编辑器工具栏的位置
        const editorToolbar = document.querySelector('#e_controls');
        const offsetY = 5; // 可以根据需要调整这个值
        const toolbarTop = (editorToolbar ? editorToolbar.offsetTop : 35) + offsetY;

        const style = document.createElement('style');
        style.textContent = `
            .float-toolbar {
                position: absolute;
                left: -45px;
                top: ${toolbarTop}px;  /* 动态设置顶部位置 */
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: all 0.3s ease;
                z-index: 1000;
            }

            /* 当父容器滚动出视图时固定工具栏 */
            .float-toolbar.fixed {
                position: fixed;
                left: ${postbox.getBoundingClientRect().left - 45}px;
                top: 20px;
            }

            .custom-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .custom-btn:hover {
                background: #f5f5f5;
                border-color: #ccc;
                transform: translateX(3px);
            }

            .custom-btn:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                margin-left: 8px;
            }

            .custom-btn:hover::before {
                content: '';
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                border: 5px solid transparent;
                border-right-color: rgba(0, 0, 0, 0.8);
                margin-left: -2px;
            }
        `;
        document.head.appendChild(style);

        // 创建浮动工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'float-toolbar';

        // 创建上传按钮
        const uploadBtn = document.createElement('a');
        uploadBtn.className = 'custom-btn';
        uploadBtn.innerHTML = '📷';
        uploadBtn.setAttribute('data-tooltip', '上传图片');

        // 创建设置按钮
        const settingsBtn = document.createElement('a');
        settingsBtn.className = 'custom-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.setAttribute('data-tooltip', '图床设置');

        // 创建历史记录按钮
        const historyBtn = document.createElement('a');
        historyBtn.className = 'custom-btn';
        historyBtn.innerHTML = '📋'; // 使用剪贴板 emoji
        historyBtn.setAttribute('data-tooltip', '上传历史');

        // 创建相册按钮
        const albumBtn = document.createElement('a');
        albumBtn.className = 'custom-btn';
        albumBtn.innerHTML = '🖼️'; // 相册 emoji
        albumBtn.setAttribute('data-tooltip', '我的相册');

        toolbar.appendChild(uploadBtn);
        toolbar.appendChild(settingsBtn);
        toolbar.appendChild(historyBtn);
        toolbar.appendChild(albumBtn); // 添加相册按钮

        postbox.appendChild(toolbar);

        // 创建文件输入框
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // 添加滚动监听，实现固定定位
        let toolbarRect = toolbar.getBoundingClientRect();
        let postboxRect = postbox.getBoundingClientRect();

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > postboxRect.top) {
                toolbar.classList.add('fixed');
            } else {
                toolbar.classList.remove('fixed');
            }
        });

        // 添加事件监听
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileUpload);
        settingsBtn.addEventListener('click', showSettings);
        historyBtn.addEventListener('click', showHistory);
        albumBtn.addEventListener('click', showAlbums);
    }

    // 改进上传进度显示组件
    function createLoadingElement() {
        const loading = document.createElement('div');
        loading.id = 'upload-loading';
        loading.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
        `;

        loading.innerHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 15px; font-size: 16px; color: #333;">
                    上传进度
                </div>

                <!-- 进度条 -->
                <div class="progress-bar" style="
                    background: #f0f0f0;
                    border-radius: 4px;
                    height: 20px;
                    margin: 10px 0;
                    overflow: hidden;
                ">
                    <div id="progress-fill" style="
                        width: 0%;
                        height: 100%;
                        background: #4CAF50;
                        transition: width 0.3s ease;
                    "></div>
                </div>

                <!-- 详细信息 -->
                <div style="
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 8px;
                    text-align: left;
                    margin-top: 15px;
                    font-size: 13px;
                    color: #666;
                ">
                    <div>总进度：</div>
                    <div id="total-progress">0/0</div>
                    <div>当前文件：</div>
                    <div id="current-file" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</div>
                    <div>上传速度：</div>
                    <div id="upload-speed">0 KB/s</div>
                    <div>剩余时间：</div>
                    <div id="time-remaining">计算中...</div>
                </div>

                <!-- 最近上传预览 -->
                <div id="recent-preview" style="
                    margin-top: 15px;
                    border-radius: 4px;
                    overflow: hidden;
                    display: none;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    width: 100px;
                    height: 100px;
                    margin: 15px auto 0;
                    border: 1px solid #eee;
                "></div>
            </div>
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes progress-animation {
                0% { background-position: 0 0; }
                100% { background-position: 50px 50px; }
            }

            #progress-fill {
                background-image: linear-gradient(
                    -45deg,
                    rgba(255, 255, 255, .2) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, .2) 50%,
                    rgba(255, 255, 255, .2) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 50px 50px;
                animation: progress-animation 2s linear infinite;
            }
        `;
        document.head.appendChild(style);

        return loading;
    }

    // 修改文件上传处理函数
    async function handleFileUpload(event) {
        const files = event.target.files;
        if (!files.length) return;

        const token = GM_getValue('yaocuntu_token');
        if (!token) {
            alert('请先在设置中配置图床token！');
            return;
        }

        // 添加 loading 提示
        const loading = createLoadingElement();
        document.body.appendChild(loading);

        // 获取进度显示元素
        const progressFill = loading.querySelector('#progress-fill');
        const totalProgress = loading.querySelector('#total-progress');
        const currentFile = loading.querySelector('#current-file');
        const uploadSpeed = loading.querySelector('#upload-speed');
        const timeRemaining = loading.querySelector('#time-remaining');
        const preview = loading.querySelector('#recent-preview');

        try {
            let uploadedCount = 0;
            const startTime = Date.now();
            const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
            let uploadedSize = 0;

            for (const file of files) {
                // 更新当前文件信息
                currentFile.textContent = file.name;

                // 显示文件预览
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.style.display = 'block';
                        preview.style.backgroundImage = `url(${e.target.result})`;
                    };
                    reader.readAsDataURL(file);
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('https://yaocuntu.com/api/v1/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Upload response:', result);

                if (result && result.status) {
                    // 更新进度
                    uploadedCount++;
                    uploadedSize += file.size;
                    const percent = (uploadedSize / totalSize) * 100;
                    progressFill.style.width = `${percent}%`;
                    totalProgress.textContent = `${uploadedCount}/${files.length}`;

                    // 计算上传速度和剩余时间
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    const speed = uploadedSize / elapsedTime;
                    const remainingSize = totalSize - uploadedSize;
                    const remainingTime = remainingSize / speed;

                    uploadSpeed.textContent = `${(speed / 1024).toFixed(2)} KB/s`;
                    timeRemaining.textContent = `${Math.ceil(remainingTime)}秒`;

                    // 插入图片
                    if (result.data && result.data.links) {
                        const format = GM_getValue('output_format', 'bbcode');
                        const position = GM_getValue('insert_position', 'cursor');
                        const imagesPerLine = GM_getValue('images_per_line', 1);
                        const spacing = GM_getValue('image_spacing', 5);

                        let insertText = '';
                        switch(format) {
                            case 'bbcode':
                                insertText = result.data.links.bbcode;
                                break;
                            case 'url':
                                insertText = result.data.links.url;
                                break;
                            case 'html':
                                insertText = result.data.links.html;
                                break;
                        }

                        // 根据每行图片数量和间距添加换行和空格
                        if (uploadedCount % imagesPerLine === 0) {
                            insertText += '\n';
                        } else {
                            insertText += ' '.repeat(spacing);
                        }

                        try {
                            insertToEditor(insertText);
                        } catch (e) {
                            console.error('插入文本失败:', e);
                            alert(`文件已上传成功，但插入文本失败。文本内容: ${insertText}`);
                        }

                        // 添加到历史记录
                        addToHistory({
                            url: result.data.links.url,
                            bbcode: result.data.links.bbcode,
                            html: result.data.links.html,
                            filename: file.name
                        });
                    }
                } else {
                    const errorMsg = result ? result.message : '未知错误';
                    alert(`文件 ${file.name} 上传失败：${errorMsg}`);
                }
            }

            // 上传完成后的提示
            const notifyType = GM_getValue('upload_notify', 'toast');
            if (notifyType !== 'none') {
                const message = `成功上传 ${uploadedCount} 张图片`;
                if (notifyType === 'toast') {
                    showToast(message);
                } else if (notifyType === 'alert') {
                    alert(message);
                }
            }

        } catch (error) {
            console.error('Upload error:', error);
            alert('上传出错：' + error.message);
        } finally {
            document.body.removeChild(loading);
            event.target.value = '';
        }
    }

    // 添加一个轻提示函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }

    // 修改显示设置对话框函数
    function showSettings() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            min-width: 400px;
            max-height: 90vh;
            overflow-y: auto;
        `;

        dialog.innerHTML = `
            <div style="
                margin: -20px -20px 20px -20px;
                padding: 15px 20px;
                background: #f5f5f5;
                border-bottom: 1px solid #ddd;
                border-radius: 8px 8px 0 0;
            ">
                <h3 style="margin: 0; color: #333;">图床设置</h3>
            </div>

            <div style="margin-bottom: 20px;">
                <!-- API Token 设置 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">API Token</label>
                    <input type="text" id="token_input" value="${GM_getValue('yaocuntu_token', '')}" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-sizing: border-box;
                        font-family: monospace;
                    ">
                </div>

                <!-- 默认输出格式 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">默认输出格式</label>
                    <select id="format_select" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                    ">
                        <option value="bbcode" ${GM_getValue('output_format') === 'bbcode' ? 'selected' : ''}>BBCode</option>
                        <option value="url" ${GM_getValue('output_format') === 'url' ? 'selected' : ''}>URL</option>
                        <option value="html" ${GM_getValue('output_format') === 'html' ? 'selected' : ''}>HTML</option>
                    </select>
                </div>

                <!-- 图片插入位置 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">图片插入位置</label>
                    <select id="insert_position" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                    ">
                        <option value="cursor" ${GM_getValue('insert_position', 'cursor') === 'cursor' ? 'selected' : ''}>光标位置</option>
                        <option value="start" ${GM_getValue('insert_position') === 'start' ? 'selected' : ''}>文章开头</option>
                        <option value="end" ${GM_getValue('insert_position') === 'end' ? 'selected' : ''}>文章末尾</option>
                    </select>
                </div>

                <!-- 每行图片数量 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">每行图片数量</label>
                    <input type="number" id="images_per_line"
                        value="${GM_getValue('images_per_line', 1)}"
                        min="1" max="10" style="
                        width: 100px;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    ">
                </div>

                <!-- 图片间距 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">图片间距（像素）</label>
                    <input type="number" id="image_spacing"
                        value="${GM_getValue('image_spacing', 5)}"
                        min="0" max="50" style="
                        width: 100px;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    ">
                </div>

                <!-- 上传完成后的提示方式 -->
                <div class="setting-item" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #666;">上传完成提示</label>
                    <select id="upload_notify" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                    ">
                        <option value="none" ${GM_getValue('upload_notify') === 'none' ? 'selected' : ''}>不提示</option>
                        <option value="toast" ${GM_getValue('upload_notify', 'toast') === 'toast' ? 'selected' : ''}>轻提示</option>
                        <option value="alert" ${GM_getValue('upload_notify') === 'alert' ? 'selected' : ''}>弹窗提示</option>
                    </select>
                </div>
            </div>

            <div style="
                text-align: right;
                padding-top: 15px;
                border-top: 1px solid #eee;
            ">
                <button id="save_settings" style="
                    padding: 8px 20px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                ">保存</button>
                <button id="close_settings" style="
                    padding: 8px 20px;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                ">取消</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // 保存设置
        document.getElementById('save_settings').onclick = () => {
            GM_setValue('yaocuntu_token', document.getElementById('token_input').value);
            GM_setValue('output_format', document.getElementById('format_select').value);
            GM_setValue('insert_position', document.getElementById('insert_position').value);
            GM_setValue('images_per_line', parseInt(document.getElementById('images_per_line').value) || 1);
            GM_setValue('image_spacing', parseInt(document.getElementById('image_spacing').value) || 5);
            GM_setValue('upload_notify', document.getElementById('upload_notify').value);
            document.body.removeChild(dialog);
        };

        document.getElementById('close_settings').onclick = () => {
            document.body.removeChild(dialog);
        };
    }

    // 检测编辑器模式
    function getEditorMode() {
        // 先检查纯文本编辑器是否可见
        const textarea = document.querySelector('#fastpostmessage, #e_textarea, #postmessage');
        if (textarea && window.getComputedStyle(textarea).display !== 'none') {
            console.log('检测到纯文本编辑器可见，使用纯文本模式');
            return 'plain';
        }

        // 再检查富文本编辑器是否存在且可见
        const iframe = document.querySelector('#e_iframe');
        if (iframe && window.getComputedStyle(iframe).display !== 'none') {
            console.log('检测到富文本编辑器可见，使用富文本模式');
            return 'rich';
        }

        // 最后检查切换按钮状态（作为后备判断）
        const switchButton = document.querySelector('#e_switchercheck');
        if (switchButton) {
            const mode = switchButton.checked ? 'rich' : 'plain';
            console.log('通过切换按钮判断编辑器模式:', mode);
            return mode;
        }

        console.log('无法确定编辑器模式，默认使用纯文本模式');
        return 'plain';  // 默认使用纯文本模式
    }

    // 插入文本到编辑器
    function insertToEditor(text) {
        console.log('尝试插入文本:', text);

        // 检查编辑器模式
        const mode = getEditorMode();
        console.log('当前编辑器模式:', mode);

        // 根据模式分别处理
        if (mode === 'plain') {
            return insertPlainText(text);
        } else if (mode === 'rich') {
            return insertRichText(text);
        }

        // 如果无法确定模式
        console.error('无法确定编辑器模式');
        alert('插入失败，请手动复制粘贴：' + text);
        return false;
    }

    // 纯文本模式专用的插入函数
    function insertPlainText(text) {
        try {
            const textarea = document.querySelector('#fastpostmessage, #e_textarea, #postmessage');
            if (!textarea) {
                console.error('未找到文本框');
                return false;
            }

            // 先将光标移动到末尾
            textarea.focus();
            textarea.selectionStart = textarea.value.length;
            textarea.selectionEnd = textarea.value.length;

            // 在末尾插入新内容
            const originalContent = textarea.value;
            textarea.value = originalContent + text;

            // 再次确保光标在最后
            const newPos = textarea.value.length;
            textarea.setSelectionRange(newPos, newPos);

            console.log('纯文本插入成功');
            return true;
        } catch (e) {
            console.error('纯文本插入失败:', e);
            return false;
        }
    }

    // 富文本模式专用的插入函数
    function insertRichText(text) {
        try {
            // 检查富文本编辑器是否存在
            const iframe = document.querySelector('#e_iframe');
            if (!iframe) {
                console.error('未找到富文本编辑器');
                return false;
            }

            // 使用论坛自带的插入函数
            if (typeof unsafeWindow.seditor_insertunit === 'function') {
                console.log('使用富文本插入函数');
                unsafeWindow.seditor_insertunit('fastpost', text);
                return true;
            }

            // 如果论坛函数不可用，尝试直接操作编辑器内容
            const editorDoc = iframe.contentWindow.document;
            const selection = editorDoc.getSelection();
            const range = selection.getRangeAt(0);

            // 创建新的文本节点
            const textNode = editorDoc.createTextNode(text);
            range.insertNode(textNode);

            // 移动光标到插入的文本后面
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            console.log('富文本插入成功');
            return true;
        } catch (e) {
            console.error('富文本插入失败:', e);
            return false;
        }
    }

    // 添加历史记录相关函数
    function addToHistory(imageInfo) {
        const history = GM_getValue('upload_history', []);
        const maxHistory = 100; // 最大保存数量

        // 添加新记录到开头
        history.unshift({
            url: imageInfo.url,
            bbcode: imageInfo.bbcode,
            html: imageInfo.html,
            timestamp: Date.now(),
            filename: imageInfo.filename
        });

        // 保持历史记录在最大数量以内
        if (history.length > maxHistory) {
            history.length = maxHistory;
        }

        GM_setValue('upload_history', history);
    }

    // 修改历史记录显示函数
    function showHistory() {
        const history = GM_getValue('upload_history', []);
        const maxHistory = GM_getValue('max_history', 100);

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
            cursor: move;
        `;

        let historyHtml = `
            <div class="dialog-header" style="
                padding: 8px 15px;
                margin: -20px -20px 10px -20px;
                background: #f5f5f5;
                border-bottom: 1px solid #ddd;
                cursor: move;
                user-select: none;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="margin: 0; font-size: 16px;">上传历史</h3>
                    <button id="close_history" style="padding: 4px 8px;">关闭</button>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;
                    font-size: 13px;
                ">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="display: flex; align-items: center;">
                            <label style="margin-right: 4px;">最大记录数：</label>
                            <input type="number" id="max_history" value="${maxHistory}" min="1" max="1000" style="
                                width: 50px;
                                padding: 2px 4px;
                                border: 1px solid #ddd;
                                border-radius: 3px;
                            ">
                            <button id="save_max_history" style="padding: 2px 6px; margin-left: 4px;">保存</button>
                        </div>
                        <button id="clear_history" style="padding: 2px 6px;">清空历史</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <select id="insert_format" style="
                            padding: 2px 4px;
                            border: 1px solid #ddd;
                            border-radius: 3px;
                            font-size: 13px;
                        ">
                            <option value="bbcode">BBCode</option>
                            <option value="url">URL</option>
                            <option value="html">HTML</option>
                        </select>
                        <button id="insert_selected" style="padding: 2px 6px;">插入选中</button>
                        <button id="insert_all" style="padding: 2px 6px;">插入全部</button>
                    </div>
                </div>
            </div>
        `;

        // 定义消息处理函数
        function handleHistoryMessage(event) {
            if (event.data.type === 'insertText') {
                insertToEditor(event.data.text + '\n');
            }
        }

        // 移除可能存在的旧监听器
        window.removeEventListener('message', handleHistoryMessage);
        // 添加新的监听器
        window.addEventListener('message', handleHistoryMessage);

        history.forEach((item, index) => {
            const date = new Date(item.timestamp);
            historyHtml += `
                <div class="history-item" style="
                    border: 1px solid #eee;
                    border-radius: 5px;
                    padding: 10px;
                    background: white;
                ">
                    <div style="display: flex; align-items: start; gap: 10px;">
                        <input type="checkbox" class="history-select" data-index="${index}" style="margin-top: 3px;">
                        <div style="flex-grow: 1;">
                            <div style="margin-bottom: 5px;">
                                <a href="${item.url}" target="_blank" style="word-break: break-all;">${item.filename || '未命名'}</a>
                            </div>
                            <div style="font-size: 12px; color: #666;">
                                ${date.toLocaleString()}
                            </div>
                            <button class="insert-single"
                                    data-bbcode="${item.bbcode}"
                                    data-url="${item.url}"
                                    data-html="${item.html}"
                                    style="margin-top: 5px; padding: 2px 8px;">插入</button>
                        </div>
                    </div>
                </div>
            `;
        });

        historyHtml += `
        `;

        dialog.innerHTML = historyHtml;
        document.body.appendChild(dialog);

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const dragHeader = dialog.querySelector('.dialog-header');

        function startDragging(e) {
            if (e.target.closest('.dialog-header')) {  // 修改这里
                isDragging = true;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                dialog.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function stopDragging() {
            isDragging = false;
        }

        dragHeader.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        // ... 其他事件监听器保持不变 ...

        // 修改关闭事件，确保清理拖动事件监听器
        function cleanup() {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('message', handleHistoryMessage);
            document.body.removeChild(dialog);
        }

        document.getElementById('close_history').onclick = cleanup;

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                cleanup();
            }
        });

        // 添加保存事件
        document.getElementById('save_max_history').onclick = () => {
            const value = parseInt(document.getElementById('max_history').value) || 100;
            GM_setValue('max_history', value);
            if (history.length > value) {
                history.length = value;
                GM_setValue('upload_history', history);
            }
            alert('保存成功');
        };

        // 添加清空历史记录功能
        document.getElementById('clear_history').onclick = () => {
            if (confirm('确定要清空所有上传历史吗？')) {
                GM_setValue('upload_history', []);
                cleanup();
            }
        };

        // 添加批量插入功能
        document.getElementById('insert_selected').onclick = () => {
            const format = document.getElementById('insert_format').value;
            const selected = dialog.querySelectorAll('.history-select:checked');
            if (selected.length === 0) {
                alert('请先选择要插入的图片');
                return;
            }

            let text = '';
            selected.forEach(checkbox => {
                const index = parseInt(checkbox.dataset.index);
                const item = history[index];
                const itemText = format === 'bbcode' ? item.bbcode :
                                format === 'url' ? item.url : item.html;
                text += itemText + '\n';
            });

            window.postMessage({type: 'insertText', text}, '*');
        };

        document.getElementById('insert_all').onclick = () => {
            const format = document.getElementById('insert_format').value;
            let text = '';
            history.forEach(item => {
                const itemText = format === 'bbcode' ? item.bbcode :
                                format === 'url' ? item.url : item.html;
                text += itemText + '\n';
            });

            window.postMessage({type: 'insertText', text}, '*');
        };

        // 在添加事件监听器的部分添加
        dialog.addEventListener('click', (e) => {
            if (e.target.classList.contains('insert-single')) {
                const format = document.getElementById('insert_format').value;
                const button = e.target;
                const text = format === 'bbcode' ? button.dataset.bbcode :
                            format === 'url' ? button.dataset.url : button.dataset.html;
                insertToEditor(text + '\n');
            }
        });
    }

    // 修改相册相关函数
    async function showAlbums() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            width: 90%;
            max-width: 1000px;
            max-height: 85vh;
            overflow: hidden;
        `;

        // 添加加载提示
        dialog.innerHTML = '<div style="text-align: center;">加载中...</div>';
        document.body.appendChild(dialog);

        try {
            // 从API获取相册列表
            const token = GM_getValue('yaocuntu_token');
            const response = await fetch('https://yaocuntu.com/api/v1/albums', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'  // 添加必需的 Accept 头
                }
            });

            if (!response.ok) {
                throw new Error(`获取相册列表失败: ${response.status}`);
            }

            const result = await response.json();
            console.log('相册列表数据:', result); // 添加调试日志

            if (!result.data) {
                throw new Error('返回数据格式不正确');
            }

            let albumsHtml = `
                <div class="dialog-header" style="
                    padding: 8px 15px;
                    margin: -20px -20px 10px -20px;
                    background: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                    cursor: move;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 16px;">我的相册</h3>
                    <button id="close_albums" style="padding: 4px 8px;">关闭</button>
                </div>
                <div style="max-height: calc(85vh - 80px); overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; padding: 5px;">
            `;

            // 处理相册数据
            const albums = Array.isArray(result.data) ? result.data : result.data.data;

            if (albums && albums.length > 0) {
                albums.forEach(album => {
                    albumsHtml += `
                        <div class="album-card" style="
                            border: 1px solid #eee;
                            border-radius: 4px;
                            padding: 8px;
                            background: white;
                            transition: all 0.2s ease;
                            cursor: pointer;
                            hover: {background: #f9f9f9;}
                        ">
                            <div style="
                                font-size: 14px;
                                margin-bottom: 8px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            ">
                                <span style="font-weight: 500;">${album.name}</span>
                                <span style="color: #666; font-size: 12px;">${album.image_num || 0}张</span>
                            </div>
                            <button onclick="window.postMessage({type: 'insertAlbum', albumId: ${album.id}}, '*')" style="
                                width: 100%;
                                padding: 4px 0;
                                background: #f0f0f0;
                                border: 1px solid #ddd;
                                border-radius: 3px;
                                cursor: pointer;
                                font-size: 13px;
                                transition: all 0.2s ease;
                                &:hover {
                                    background: #e8e8e8;
                                }
                            ">插入全部图片</button>
                        </div>
                    `;
                });
            } else {
                albumsHtml += '<div style="text-align: center; grid-column: 1/-1; padding: 20px;">暂无相册</div>';
            }

            albumsHtml += `
                    </div>
                </div>
            `;

            dialog.innerHTML = albumsHtml;

            // 添加拖动功能
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const dragHeader = dialog.querySelector('.dialog-header');

            dragHeader.addEventListener('mousedown', startDragging);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);

            function startDragging(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === dragHeader) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    dialog.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            }

            function stopDragging() {
                isDragging = false;
            }

            // 清理函数
            function cleanup() {
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDragging);
                window.removeEventListener('message', handleAlbumMessage);
                document.body.removeChild(dialog);
            }

            // 处理相册操作
            function handleAlbumMessage(event) {
                if (event.data.type === 'insertAlbum') {
                    insertAlbumPhotos(event.data.albumId);
                    cleanup(); // 插入后关闭对话框
                }
            }

            window.addEventListener('message', handleAlbumMessage);

            // 关闭按钮
            document.getElementById('close_albums').onclick = cleanup;

        } catch (error) {
            console.error('相册列表加载失败:', error);
            dialog.innerHTML = `
                <div style="color: red; text-align: center; padding: 20px;">
                    加载失败：${error.message}
                    <br><br>
                    <button onclick="this.parentElement.parentElement.remove()">关闭</button>
                </div>
            `;
        }
    }

    // 修改插入相册图片的函数
    async function insertAlbumPhotos(albumId) {
        try {
            const token = GM_getValue('yaocuntu_token');
            let allImages = [];

            // 创建加载提示
            const loading = createLoadingElement();
            document.body.appendChild(loading);

            // 获取进度显示元素
            const progressFill = loading.querySelector('#progress-fill');
            const totalProgress = loading.querySelector('#total-progress');
            const currentFile = loading.querySelector('#current-file');

            // 设置初始状态
            currentFile.textContent = '正在获取图片列表...';

            // 获取第一页数据
            let currentUrl = `https://yaocuntu.com/api/v1/images?album_id=${albumId}&page=1`;

            while (currentUrl) {
                const response = await fetch(currentUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`获取相册图片失败: ${response.status}`);
                }

                const result = await response.json();
                console.log('当前页数据:', result);

                if (!result.data?.data) {
                    throw new Error('返回数据格式不正确');
                }

                // 添加当前页的图片
                allImages = allImages.concat(result.data.data);

                // 更新进度
                currentFile.textContent = `已获取 ${allImages.length}/${result.data.total} 张图片`;
                const percent = (allImages.length / result.data.total) * 100;
                progressFill.style.width = `${percent}%`;

                // 获取下一页的 URL
                currentUrl = result.data.next_page_url;
            }

            // 插入图片
            let insertedCount = 0;
            currentFile.textContent = '正在插入图片...';

            for (const image of allImages) {
                try {
                    const bbcode = `[img]${image.links.url}[/img]`;
                    insertToEditor(bbcode + '\n');
                    insertedCount++;

                    // 更新插入进度
                    const percent = (insertedCount / allImages.length) * 100;
                    progressFill.style.width = `${percent}%`;
                    totalProgress.textContent = `${insertedCount}/${allImages.length}`;
                    currentFile.textContent = `正在插入第 ${insertedCount} 张图片`;
                } catch (e) {
                    console.error('插入图片失败:', e);
                }
            }

            document.body.removeChild(loading);

            // 显示完成提示
            const notifyType = GM_getValue('upload_notify', 'toast');
            if (notifyType !== 'none') {
                const message = `成功插入 ${insertedCount} 张图片`;
                if (notifyType === 'toast') {
                    showToast(message);
                } else if (notifyType === 'alert') {
                    alert(message);
                }
            }

            return true;

        } catch (error) {
            console.error('获取相册图片失败:', error);
            alert('插入图片失败：' + error.message);
            const loading = document.getElementById('upload-loading');
            if (loading) {
                document.body.removeChild(loading);
            }
        }
    }
})();