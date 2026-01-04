// ==UserScript==
// @name         超星图片和文件上传工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快速上传图片到超星
// @author       榛铭
// @license      MIT
// @match        https://mooc1.chaoxing.com/mooc-ans/coursestar*
// @connect      mooc-upload-ans.chaoxing.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/518487/%E8%B6%85%E6%98%9F%E5%9B%BE%E7%89%87%E5%92%8C%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/518487/%E8%B6%85%E6%98%9F%E5%9B%BE%E7%89%87%E5%92%8C%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 榛铭

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 简化设备检测和通知功能
    const utils = {
        isMobile: () => /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent),
        notify: (title, body) => {
            typeof Notification !== 'undefined' &&
            Notification.permission === "granted" &&
            new Notification(title, { body });
        }
    };

    // 添加一个通用的触摸反馈函数
    function addTouchFeedback(btn) {
        btn.addEventListener('touchstart', () => {
            btn.style.background = '#45a049';
            btn.style.transform = 'scale(0.98)';
        });
        btn.addEventListener('touchend', () => {
            btn.style.background = '#4CAF50';
            btn.style.transform = 'scale(1)';
        });
    }

    // 创建上传按钮和界面
    function createUploadUI() {
        const isMobile = utils.isMobile();

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, ${isMobile ? '0.8' : '0.5'});
            z-index: 9998;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: ${isMobile ? '40px' : '20px'};
            border-radius: ${isMobile ? '16px' : '12px'};
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
            width: ${isMobile ? '100%' : '500px'};
            max-width: 800px;
            text-align: center;
            max-height: 98vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        `;

        // 创建拖放区域
        const dropZone = document.createElement('div');
        dropZone.style.cssText = `
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: ${isMobile ? '60px 20px' : '40px 20px'};
            margin: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // 添加云朵图标
        const cloudIcon = document.createElement('div');
        cloudIcon.innerHTML = '☁️';
        cloudIcon.style.cssText = `
            font-size: ${isMobile ? '48px' : '32px'};
            margin-bottom: 15px;
            color: #666;
        `;

        // 修改标题和提示文字
        const title = document.createElement('div');
        title.innerHTML = '点击选择图片或者拖拽图片到这里或者粘贴图片(Ctrl+V)';
        title.style.cssText = `
            color: #666;
            font-size: ${isMobile ? '28px' : '16px'};
            margin-bottom: 10px;
            line-height: 1.5;
        `;

        const uploadBtn = document.createElement('input');
        uploadBtn.type = 'file';
        uploadBtn.multiple = true;
        uploadBtn.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            border: 0;
        `;
        uploadBtn.accept = '*/*';
        uploadBtn.capture = 'camera';

        // 将所有元素添加到拖放区域
        dropZone.appendChild(cloudIcon);
        dropZone.appendChild(title);
        dropZone.appendChild(uploadBtn);

        // 添加拖放区域的hover效果
        dropZone.addEventListener('mouseover', () => {
            dropZone.style.borderColor = '#4CAF50';
            dropZone.style.backgroundColor = '#f8f8f8';
        });

        dropZone.addEventListener('mouseout', () => {
            dropZone.style.borderColor = '#ccc';
            dropZone.style.backgroundColor = 'transparent';
        });

        // 添加拖放功能
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#4CAF50';
            dropZone.style.backgroundColor = '#f8f8f8';
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#ccc';
            dropZone.style.backgroundColor = 'transparent';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                uploadBtn.files = files;
                const event = new Event('change', { bubbles: true });
                uploadBtn.dispatchEvent(event);
            }
            dropZone.style.borderColor = '#ccc';
            dropZone.style.backgroundColor = 'transparent';
        });

        dropZone.onclick = () => uploadBtn.click();

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            right: ${isMobile ? '20px' : '15px'};
            top: ${isMobile ? '20px' : '15px'};
            width: ${isMobile ? '60px' : '40px'};
            height: ${isMobile ? '60px' : '40px'};
            border: none;
            background: none;
            font-size: ${isMobile ? '48px' : '32px'};
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(container);
        };

        // 添加上传列表容器
        const uploadList = document.createElement('div');
        uploadList.style.cssText = `
            margin-top: 20px;
            width: 100%;
            display: none;
        `;

        container.appendChild(closeBtn);
        container.appendChild(dropZone);
        container.appendChild(uploadList);

        document.body.appendChild(overlay);
        document.body.appendChild(container);

        // 处理文件选择
        uploadBtn.onchange = async (e) => {
            const files = e.target.files;
            if (!files.length) return;

            // 显示上传列表
            uploadList.style.display = 'block';
            uploadList.innerHTML = ''; // 清空之前的上传记录

            // 只有多个文件时才创建批量复制按钮
            if (files.length > 1) {
                const batchCopyButtons = createBatchCopyButtons(uploadList);
                container.appendChild(batchCopyButtons);
            }

            // 为每个文件创建进度条
            for (const file of files) {
                const fileContainer = document.createElement('div');
                fileContainer.style.cssText = `
                    margin: 15px 0;
                    padding: 15px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    ${isMobile ? 'font-size: 28px;' : 'font-size: 14px;'}
                `;

                const fileName = document.createElement('div');
                fileName.textContent = file.name;
                fileName.style.cssText = `
                    margin-bottom: 10px;
                    color: #333;
                `;

                const fileProgress = document.createElement('div');
                fileProgress.style.cssText = `
                    width: 100%;
                    height: ${isMobile ? '16px' : '8px'};
                    background: #eee;
                    border-radius: ${isMobile ? '8px' : '4px'};
                    overflow: hidden;
                `;

                const fileProgressInner = document.createElement('div');
                fileProgressInner.style.cssText = `
                    width: 0%;
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #45a049);
                    border-radius: ${isMobile ? '8px' : '4px'};
                    transition: width 0.3s ease;
                `;

                const fileStatus = document.createElement('div');
                fileStatus.style.cssText = `
                    margin-top: 10px;
                    color: #666;
                `;

                fileProgress.appendChild(fileProgressInner);
                fileContainer.appendChild(fileName);
                fileContainer.appendChild(fileProgress);
                fileContainer.appendChild(fileStatus);
                uploadList.appendChild(fileContainer);

                try {
                    // 获取上传参数
                    const response = await fetch('https://mooc1.chaoxing.com/mooc-ans/coursestar');
                    const text = await response.text();

                    const timeMatch = text.match(/window\["currentTime"\]\s*=\s*\'(\d{13})\'/);
                    const encMatch = text.match(/window\["uploadEnc"\]\s*=\s*\'([a-f0-9]{32})\'/);

                    if (!timeMatch || !encMatch) {
                        throw new Error('获取上传参数失败');
                    }

                    // 根据文件类型选择不同的上传URL
                    let uploadUrl;
                    const formData = new FormData();

                    if (file.type.startsWith('image/')) {
                        // 图片使用专门的上传接口
                        uploadUrl = `https://mooc-upload-ans.chaoxing.com/ueditorupload/upload-image?uid=&enc2=${encMatch[1]}&t=${timeMatch[1]}&encode=utf-8`;
                        formData.append('id', 'WU_FILE_0');
                        formData.append('name', file.name);
                        formData.append('type', file.type);
                        formData.append('lastModifiedDate', new Date().toString());
                        formData.append('size', file.size);
                        formData.append('upfile', file);
                    } else {
                        // 其他文件使用通用上传接口
                        uploadUrl = `https://mooc-upload-ans.chaoxing.com/upload/uploadNew?t=${timeMatch[1]}&enc2=${encMatch[1]}&userId=`;
                        formData.append('file', file);
                    }

                    // 上传文件
                    const uploadPromise = new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const percent = (event.loaded / event.total * 100).toFixed(1);
                                const speed = (event.loaded / 1024 / 1024 / (Date.now() - startTime) * 1000).toFixed(1);
                                fileStatus.textContent = `上传中: ${percent}% (${speed}MB/s)`;
                                fileProgressInner.style.width = percent + '%';
                            }
                        };

                        xhr.onload = () => resolve(JSON.parse(xhr.response));
                        xhr.onerror = () => reject(new Error('上传失败'));

                        xhr.open('POST', uploadUrl);
                        xhr.withCredentials = true;
                        xhr.send(formData);
                    });

                    const startTime = Date.now();
                    const result = await uploadPromise;

                    // 处理结果
                    if (result.url) {
                        const url = file.type.startsWith('image/') ?
                            result.url :
                            `https://sharewh.chaoxing.com/share/download/${result.url}`;

                        fileStatus.textContent = '上传成功';
                        fileStatus.className = 'file-status';  // 添加类名以便识别
                        fileContainer.dataset.fileUrl = url;   // 存储URL到DOM元素中

                        // 添加复制按钮
                        const copyBtns = document.createElement('div');
                        copyBtns.style.cssText = `
                            display: flex;
                            gap: 10px;
                            margin-top: 10px;
                            flex-wrap: wrap;
                        `;

                        // 创建按钮的函数
                        const createCopyButton = (text, copyContent) => {
                            const btn = document.createElement('button');
                            btn.textContent = text;
                            btn.style.cssText = `
                                padding: ${isMobile ? '40px' : '20px'};
                                background: #4CAF50;
                                color: white;
                                border: none;
                                border-radius: ${isMobile ? '16px' : '12px'};
                                cursor: pointer;
                                font-size: ${isMobile ? '32px' : '16px'};
                                -webkit-tap-highlight-color: transparent;
                                flex: 1;
                                min-width: ${isMobile ? '32px' : '16px'};
                            `;

                            addTouchFeedback(btn);

                            btn.onclick = () => {
                                GM_setClipboard(copyContent);
                                btn.textContent = '已复制!';
                                setTimeout(() => {
                                    btn.textContent = text;
                                }, 2000);
                            };

                            return btn;
                        };

                        // 创建三个复制按钮
                        const originalBtn = createCopyButton('原链接', url);
                        const bbcodeBtn = createCopyButton('BBCode', `[img]${url}[/img]`);
                        const markdownBtn = createCopyButton('Markdown', `![](${url})`);

                        copyBtns.appendChild(originalBtn);
                        copyBtns.appendChild(bbcodeBtn);
                        copyBtns.appendChild(markdownBtn);

                        fileContainer.appendChild(copyBtns);
                    } else {
                        throw new Error('服务器未返回有效链接');
                    }

                } catch (error) {
                    fileStatus.textContent = `上传失败: ${error.message}`;
                    fileStatus.style.color = '#ff4444';
                }
            }

            // 清除文件选择
            e.target.value = '';
        };

        return container; // 返回container对象
    }

    // 简化批量复制按钮的创建
    function createBatchCopyButtons(uploadList) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background: #f8f8f8;
            border-radius: 12px;
            font-size: ${utils.isMobile() ? '32px' : '16px'};
        `;

        container.innerHTML = '<div style="font-weight:bold;margin-bottom:15px;color:#333">批量复制</div>';

        const formats = [
            ['原链接', 'original', urls => urls.join('\n')],
            ['BBCode', 'bbcode', urls => urls.map(url => `[img]${url}[/img]`).join('\n')],
            ['Markdown', 'markdown', urls => urls.map(url => `![](${url})`).join('\n')]
        ];

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display:flex;flex-direction:column;gap:15px';

        formats.forEach(([text, format, formatter]) => {
            const btn = document.createElement('button');
            btn.textContent = `复制所有${text}`;
            btn.style.cssText = `
                padding: ${utils.isMobile() ? '25px' : '12px'};
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: inherit;
                cursor: pointer;
                transition: all 0.2s;
            `;

            addTouchFeedback(btn);

            btn.onclick = () => {
                const urls = Array.from(uploadList.children)
                    .filter(el => el.querySelector('.file-status')?.textContent === '上传成功')
                    .map(el => el.dataset.fileUrl);

                if (!urls.length) {
                    btn.textContent = '没有可复制的链接';
                } else {
                    GM_setClipboard(formatter(urls));
                    btn.textContent = '已复制!';
                }
                setTimeout(() => btn.textContent = `复制所有${text}`, 2000);
            };

            btnContainer.appendChild(btn);
        });

        container.appendChild(btnContainer);
        return container;
    }

    // 初始化
    function init() {
        const triggerBtn = document.createElement('button');
        triggerBtn.textContent = '📤 上传文件';
        triggerBtn.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: ${utils.isMobile() ? '40px 80px' : '20px 40px'};
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: ${utils.isMobile() ? '50px' : '25px'};
            font-size: ${utils.isMobile() ? '36px' : '24px'};
            font-weight: 500;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 9997;
            -webkit-tap-highlight-color: transparent;
        `;

        triggerBtn.onclick = () => createUploadUI();
        document.body.appendChild(triggerBtn);

        // 只在支持环境下请求通知权限
        if (typeof Notification !== 'undefined' && Notification.permission === "default") {
            Notification.requestPermission();
        }

        // 添加剪贴板粘贴支持（仅在非移动端）
        if (!utils.isMobile()) {
            document.addEventListener('paste', handlePaste);
        }
    }

    // 处理粘贴事件
    async function handlePaste(e) {
        // 检查是否在文本输入区域中粘贴
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const items = e.clipboardData.items;
        let hasImage = false;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                hasImage = true;
                const file = item.getAsFile();
                if (file) {
                    // 创建一个带有时间戳的文件名
                    const timestamp = new Date().getTime();
                    const newFile = new File([file], `pasted_image_${timestamp}.png`, {
                        type: file.type
                    });

                    // 创建上传UI
                    const container = createUploadUI();
                    const uploadBtn = container.querySelector('input[type="file"]');

                    // 创建一个新的 FileList 对象
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(newFile);
                    uploadBtn.files = dataTransfer.files;

                    // 触发 change 事件
                    const event = new Event('change', { bubbles: true });
                    uploadBtn.dispatchEvent(event);
                }
                break;
            }
        }

        if (hasImage) {
            e.preventDefault();
            utils.notify('超星图床', '检测到图片粘贴，正在处理上传...');
        }
    }

    // 初始化
    init();
})();