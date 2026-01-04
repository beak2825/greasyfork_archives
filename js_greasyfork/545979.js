// ==UserScript==
// @name         水源图床上传工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  向水源图床上传图片，自动携带cookie
// @author       Labyrinth
// @icon         https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/f/2/3/f23eba8f728e684ad7c9fc3529083e03cc054fc2.svg
// @match        https://shuiyuan.sjtu.edu.cn/*
// @match        https://notes.sjtu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      notes.sjtu.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/545979/%E6%B0%B4%E6%BA%90%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545979/%E6%B0%B4%E6%BA%90%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cookie处理函数
    function getCookiesForDomain(domain) {
        const cookies = document.cookie.split(';');
        const domainCookies = [];
        cookies.forEach(cookie => {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie) {
                domainCookies.push(trimmedCookie);
            }
        });
        return domainCookies.join('; ');
    }

    // 检查是否在notes.sjtu.edu.cn域名下，如果是则保存cookie
    function saveCookiesIfNeeded() {
        if (window.location.hostname === 'notes.sjtu.edu.cn') {
            const cookies = getCookiesForDomain('notes.sjtu.edu.cn');
            if (cookies) {
                GM_setValue('notes_sjtu_cookies', cookies);
                console.log('已保存水源笔记Cookie');
            }
        }
    }

    // 获取保存的cookie
    function getSavedCookies() {
        return GM_getValue('notes_sjtu_cookies', '');
    }

    // 创建上传按钮和界面
    function createUploadInterface() {
        // 创建上传容器
        const uploadContainer = document.createElement('div');
        uploadContainer.id = 'shuiyuan-upload-container';
        uploadContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            display: none;
        `;

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: #007bff;
            color: white;
            padding: 10px;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        titleBar.innerHTML = `
            <span>水源图床上传</span>
            <span id="close-upload-panel" style="cursor: pointer; font-size: 18px;">&times;</span>
        `;

        // 创建内容区域
        const content = document.createElement('div');
        content.style.padding = '15px';

        const savedCookies = getSavedCookies();
        const isNotesPage = window.location.hostname === 'notes.sjtu.edu.cn';

        content.innerHTML = `
            <div style="margin-bottom: 15px; padding: 8px; border-radius: 4px; ${savedCookies ? 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 'background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'}">
                <div style="font-weight: bold; margin-bottom: 5px;">登录状态:</div>
                <div style="font-size: 12px;">
                    ${savedCookies ? '✅ 已检测到登录Cookie' : '❌ 未检测到登录Cookie'}
                </div>
                ${!isNotesPage && !savedCookies ? '<div style="font-size: 11px; margin-top: 5px;">请先访问 <a href="https://notes.sjtu.edu.cn" target="_blank" style="color: #721c24;">notes.sjtu.edu.cn</a> 登录</div>' : ''}
                ${isNotesPage ? '<button id="refresh-cookies-btn" style="width: 100%; margin-top: 5px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">刷新登录状态</button>' : ''}
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">选择图片:</label>
                <input type="file" id="image-input" accept="image/*" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px;">
                <div style="text-align: center; color: #666; font-size: 12px; margin-bottom: 8px;">或</div>
                <div id="paste-area" style="width: 100%; height: 80px; border: 2px dashed #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa; transition: all 0.3s ease;">
                    <div style="text-align: center; color: #666; font-size: 13px;">
                        <div>📋 点击此处并按 Ctrl+V 粘贴图片</div>
                        <div style="font-size: 11px; margin-top: 3px;">或右键选择"粘贴"</div>
                    </div>
                </div>
                <div id="paste-preview" style="margin-top: 8px; display: none;">
                    <div style="font-size: 12px; color: #28a745; margin-bottom: 5px;">✅ 已粘贴图片:</div>
                    <img id="preview-image" style="max-width: 100%; max-height: 100px; border-radius: 4px; border: 1px solid #ddd;">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <button id="upload-btn" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!savedCookies ? 'disabled' : ''}>上传图片</button>
            </div>
            <div id="upload-status" style="padding: 8px; border-radius: 4px; display: none;"></div>
            <div id="upload-result" style="margin-top: 10px; display: none;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">图片链接:</label>
                <textarea id="result-url" readonly style="width: 100%; height: 40px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; resize: none; margin-bottom: 5px;"></textarea>

                <label style="display: block; margin-bottom: 5px; font-weight: bold;">HTML格式:</label>
                <textarea id="result-html" readonly style="width: 100%; height: 40px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; resize: none; margin-bottom: 5px;"></textarea>

                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Markdown格式:</label>
                <textarea id="result-markdown" readonly style="width: 100%; height: 40px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; resize: none; margin-bottom: 10px;"></textarea>

                <div style="display: flex; gap: 5px;">
                    <button id="copy-url-btn" style="flex: 1; padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">复制链接</button>
                    <button id="copy-html-btn" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">复制HTML</button>
                    <button id="copy-markdown-btn" style="flex: 1; padding: 8px; background: #fd7e14; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">复制MD</button>
                </div>
            </div>
        `;

        uploadContainer.appendChild(titleBar);
        uploadContainer.appendChild(content);
        document.body.appendChild(uploadContainer);

        // 创建触发按钮
        const triggerBtn = document.createElement('button');
        triggerBtn.id = 'show-upload-panel';
        triggerBtn.innerHTML = '📷 上传图片';
        triggerBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9998;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(triggerBtn);

        return { uploadContainer, triggerBtn };
    }

    // 粘贴处理相关函数
    let pastedFile = null;

    // 处理粘贴事件
    function handlePaste(e) {
        e.preventDefault();

        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    setPastedImage(file);
                    break;
                }
            }
        }
    }

    // 设置粘贴的图片
    function setPastedImage(file) {
        pastedFile = file;

        // 创建预览
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewDiv = document.getElementById('paste-preview');
            const previewImg = document.getElementById('preview-image');

            previewImg.src = e.target.result;
            previewDiv.style.display = 'block';

            // 更新粘贴区域样式
            const pasteArea = document.getElementById('paste-area');
            pasteArea.style.borderColor = '#28a745';
            pasteArea.style.background = '#d4edda';
        };
        reader.readAsDataURL(file);

        // 清空文件选择器
        const fileInput = document.getElementById('image-input');
        fileInput.value = '';
    }

    // 获取当前选择的文件（文件选择器或粘贴）
    function getCurrentFile() {
        if (pastedFile) {
            return pastedFile;
        }

        const fileInput = document.getElementById('image-input');
        return fileInput.files[0] || null;
    }

    // 清除粘贴的图片
    function clearPastedImage() {
        pastedFile = null;
        const previewDiv = document.getElementById('paste-preview');
        const pasteArea = document.getElementById('paste-area');

        if (previewDiv) previewDiv.style.display = 'none';
        if (pasteArea) {
            pasteArea.style.borderColor = '#ddd';
            pasteArea.style.background = '#f8f9fa';
            // 确保粘贴区域失去焦点
            if (document.activeElement === pasteArea) {
                pasteArea.blur();
            }
        }
    }

    // 上传图片到水源图床
    async function uploadToShuiyuan(file) {
        return new Promise((resolve) => {
            try {
                // 创建FormData
                const formData = new FormData();
                formData.append('image', file);

                // 获取保存的Cookie
                const savedCookies = getSavedCookies();

                // 构建请求头
                const headers = {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                };

                // 如果有保存的Cookie，则添加到请求头
                if (savedCookies) {
                    headers["Cookie"] = savedCookies;
                }

                // 使用GM_xmlhttpRequest来绕过CORS限制
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://notes.sjtu.edu.cn/uploadimage",
                    headers: headers,
                    data: formData,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                // 尝试解析JSON响应
                                const responseText = response.responseText.trim();
                                console.log('服务器响应:', responseText); // 调试日志

                                const jsonResponse = JSON.parse(responseText);
                                let imageUrl;

                                // 检查不同可能的响应格式
                                if (jsonResponse.link) {
                                    imageUrl = jsonResponse.link;
                                } else if (jsonResponse.url) {
                                    imageUrl = jsonResponse.url;
                                } else if (jsonResponse.data && jsonResponse.data.link) {
                                    imageUrl = jsonResponse.data.link;
                                } else if (jsonResponse.data && jsonResponse.data.url) {
                                    imageUrl = jsonResponse.data.url;
                                } else {
                                    // 如果找不到预期的字段，使用整个响应作为URL
                                    imageUrl = responseText;
                                }

                                console.log('提取的图片链接:', imageUrl); // 调试日志

                                resolve({
                                    success: true,
                                    url: imageUrl,
                                    message: '上传成功！'
                                });
                            } catch (e) {
                                console.log('JSON解析失败，使用原始响应:', e);
                                // 如果不是JSON格式，直接使用原始响应
                                resolve({
                                    success: true,
                                    url: response.responseText.trim(),
                                    message: '上传成功！'
                                });
                            }
                        } else {
                            resolve({
                                success: false,
                                message: `上传失败: ${response.status} ${response.statusText}`
                            });
                        }
                    },
                    onerror: function(error) {
                        resolve({
                            success: false,
                            message: `上传失败: 网络错误`
                        });
                    },
                    ontimeout: function() {
                        resolve({
                            success: false,
                            message: `上传失败: 请求超时`
                        });
                    },
                    timeout: 30000 // 30秒超时
                });
            } catch (error) {
                resolve({
                    success: false,
                    message: `上传失败: ${error.message}`
                });
            }
        });
    }

    // 显示状态信息
    function showStatus(message, isError = false) {
        const statusDiv = document.getElementById('upload-status');
        statusDiv.style.display = 'block';
        statusDiv.style.background = isError ? '#f8d7da' : '#d4edda';
        statusDiv.style.color = isError ? '#721c24' : '#155724';
        statusDiv.style.border = `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`;
        statusDiv.textContent = message;
    }

    // 隐藏状态信息
    function hideStatus() {
        const statusDiv = document.getElementById('upload-status');
        statusDiv.style.display = 'none';
    }

    // 复制到剪贴板
    async function copyToClipboard(text, type = '链接') {
        try {
            await navigator.clipboard.writeText(text);
            showStatus(`${type}已复制到剪贴板！`);
            setTimeout(hideStatus, 2000);
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showStatus(`${type}已复制到剪贴板！`);
            setTimeout(hideStatus, 2000);
        }
    }

    // 使面板可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const titleBar = element.querySelector('div');

        titleBar.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 初始化插件
    function init() {
        // 如果在notes.sjtu.edu.cn域名下，保存cookie
        saveCookiesIfNeeded();

        // 如果不在notes.sjtu.edu.cn域名下且没有保存的cookie，显示提示
        if (window.location.hostname !== 'notes.sjtu.edu.cn' && !getSavedCookies()) {
            console.warn('未找到水源笔记的Cookie，请先访问 https://notes.sjtu.edu.cn 登录后再使用上传功能');
        }

        const { uploadContainer, triggerBtn } = createUploadInterface();

        // 使面板可拖拽
        makeDraggable(uploadContainer);

        // 绑定事件
        triggerBtn.addEventListener('click', () => {
            uploadContainer.style.display = 'block';
            triggerBtn.style.display = 'none';
        });

        document.getElementById('close-upload-panel').addEventListener('click', () => {
            uploadContainer.style.display = 'none';
            triggerBtn.style.display = 'block';

            // 关闭面板时将焦点回到页面主体
            document.body.focus();
            const mainContent = document.querySelector('main, #main, .main-content, body');
            if (mainContent) {
                mainContent.focus();
            }
        });

        document.getElementById('upload-btn').addEventListener('click', async () => {
            // 检查是否有登录Cookie
            const savedCookies = getSavedCookies();
            if (!savedCookies) {
                showStatus('请先登录水源笔记！访问 https://notes.sjtu.edu.cn 登录后再使用上传功能。', true);
                return;
            }

            const file = getCurrentFile();

            if (!file) {
                showStatus('请先选择或粘贴图片文件！', true);
                return;
            }

            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                showStatus('请选择有效的图片文件！', true);
                return;
            }

            // 验证文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                showStatus('图片文件不能超过10MB！', true);
                return;
            }

            showStatus('正在上传，请稍候...');

            const result = await uploadToShuiyuan(file);

            if (result.success) {
                showStatus(result.message);
                const imageUrl = result.url;

                // 填充不同格式的文本框
                document.getElementById('result-url').value = imageUrl;
                document.getElementById('result-html').value = `<img src="${imageUrl}" alt="uploaded image" />`;
                document.getElementById('result-markdown').value = `![uploaded image](${imageUrl})`;

                document.getElementById('upload-result').style.display = 'block';

                // 清除粘贴的图片和文件选择器
                clearPastedImage();
                document.getElementById('image-input').value = '';

                // 修复焦点问题：将焦点移回页面主体
                document.body.focus();
                // 如果页面有主要内容区域，也可以尝试聚焦到那里
                const mainContent = document.querySelector('main, #main, .main-content, body');
                if (mainContent) {
                    mainContent.focus();
                }
            } else {
                showStatus(result.message, true);
                document.getElementById('upload-result').style.display = 'none';
            }
        });

        document.getElementById('copy-url-btn').addEventListener('click', () => {
            const url = document.getElementById('result-url').value;
            if (url) {
                copyToClipboard(url, '链接');
            }
        });

        document.getElementById('copy-html-btn').addEventListener('click', () => {
            const html = document.getElementById('result-html').value;
            if (html) {
                copyToClipboard(html, 'HTML代码');
            }
        });

        document.getElementById('copy-markdown-btn').addEventListener('click', () => {
            const markdown = document.getElementById('result-markdown').value;
            if (markdown) {
                copyToClipboard(markdown, 'Markdown代码');
            }
        });

        // 刷新Cookie按钮事件（仅在notes.sjtu.edu.cn页面显示）
        const refreshCookiesBtn = document.getElementById('refresh-cookies-btn');
        if (refreshCookiesBtn) {
            refreshCookiesBtn.addEventListener('click', () => {
                saveCookiesIfNeeded();
                showStatus('已刷新登录状态');
                setTimeout(() => {
                    location.reload(); // 重新加载页面以更新界面
                }, 1000);
            });
        }

        // 粘贴区域相关事件
        const pasteArea = document.getElementById('paste-area');
        const fileInput = document.getElementById('image-input');

        // 粘贴区域点击聚焦（为了接收粘贴事件）
        pasteArea.addEventListener('click', () => {
            pasteArea.focus();
            // 短暂聚焦后自动失焦，避免长时间持有焦点
            setTimeout(() => {
                if (document.activeElement === pasteArea) {
                    pasteArea.blur();
                }
            }, 100);
        });

        // 设置粘贴区域可聚焦
        pasteArea.tabIndex = 0;

        // 粘贴成功后自动失焦
        const originalHandlePaste = handlePaste;
        const enhancedHandlePaste = function(e) {
            originalHandlePaste(e);
            // 粘贴完成后失焦
            setTimeout(() => {
                if (document.activeElement === pasteArea) {
                    pasteArea.blur();
                }
            }, 50);
        };

        // 监听粘贴事件
        pasteArea.addEventListener('paste', enhancedHandlePaste);
        document.addEventListener('paste', (e) => {
            // 如果上传面板是可见的，处理全局粘贴
            if (uploadContainer.style.display !== 'none') {
                enhancedHandlePaste(e);
            }
        });

        // 文件选择器变化时清除粘贴的图片
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                clearPastedImage();
            }
        });

        // 拖拽支持
        pasteArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            pasteArea.style.borderColor = '#007bff';
            pasteArea.style.background = '#e3f2fd';
        });

        pasteArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!pastedFile) {
                pasteArea.style.borderColor = '#ddd';
                pasteArea.style.background = '#f8f9fa';
            }
        });

        pasteArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                setPastedImage(files[0]);
            } else {
                pasteArea.style.borderColor = '#ddd';
                pasteArea.style.background = '#f8f9fa';
            }
        });

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'U') {
                e.preventDefault();
                if (uploadContainer.style.display === 'none') {
                    uploadContainer.style.display = 'block';
                    triggerBtn.style.display = 'none';
                } else {
                    uploadContainer.style.display = 'none';
                    triggerBtn.style.display = 'block';
                }
            }
        });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
