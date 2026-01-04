// ==UserScript==
// @name         NodeSeek 编辑器个人图床 + Emoji集成
// @namespace    https://www.nodeseek.com/
// @version      0.1.2
// @description  为 NodeSeek 编辑器增加图片上传功能和Emoji选择器，使用个人CloudFlare ImgBed图床，支持上传频率限制
// @author       astom
// @match        *://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        GM_xmlhttpRequest
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/541998/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%AA%E4%BA%BA%E5%9B%BE%E5%BA%8A%20%2B%20Emoji%E9%9B%86%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/541998/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%AA%E4%BA%BA%E5%9B%BE%E5%BA%8A%20%2B%20Emoji%E9%9B%86%E6%88%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 个人图床配置，先去部署图床，然后改下面前三个就行！！！
    const imgHost = {
        url: "https://xxxxx.org/upload", // 图床上传地址，将你的地址替换一下！！！
        authCode: "xxxxx", // 上传认证码，后台设置的，换成你自己的！！！
        domain: "https://xxxxx.org", // 图床域名，用于拼接完整链接，换成你自己的！！！
        uploadChannel: "telegram", // 上传渠道
        serverCompress: true, // 服务端压缩
        autoRetry: true, // 失败时自动重试
        uploadNameType: "default", // 文件命名方式
        returnFormat: "default" // 返回链接格式
    };

    const mdImgName = 0; // 0: 使用图床返回的原始名称, 其他值则名称固定为该值
    const submitByKey = true; // 是否按下 Ctrl+Enter 后触发发帖动作

    // 上传频率限制配置
    let lastUploadTime = 0; // 记录上次上传时间戳
    const uploadInterval = 10000; // 上传间隔限制：10秒（毫秒）

    // Emoji 配置
    const emojiConfig = {
        pickerUrl: 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js',
        width: 380,
        height: 420
    };

    // 页面加载完毕后载入功能
    window.addEventListener('load', initEditorEnhancer, false);

    function initEditorEnhancer() {
        // 监听粘贴事件
        document.addEventListener('paste', (event) => handlePasteEvt(event));

        // 给编辑器绑定拖拽事件
        var dropZone = document.getElementById('code-mirror-editor');
        if (dropZone) {
            // 阻止默认行为
            dropZone.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            // 处理文件拖放
            dropZone.addEventListener('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                log('正在处理拖放内容...');
                let imageFiles = [];
                for (let file of e.dataTransfer.files) {
                    if (/^image\//i.test(file.type)) {
                        imageFiles.push(file);
                        log(`拖放的文件名: ${file.name}`);
                    }
                }
                log(`拖放的图片数量: ${imageFiles.length}`);
                if (imageFiles.length === 0) {
                    log('你拖放的内容好像没有图片哦', 'red');
                    return;
                }

                uploadImage(imageFiles.map(file => {
                    return {
                        kind: 'file',
                        type: file.type,
                        getAsFile: () => file
                    };
                }));
            });
        }

        // 修改图片按钮的行为并添加Emoji按钮
        let checkExist = setInterval(function () {
            const oldElement = document.querySelector('.toolbar-item.i-icon.i-icon-pic[title="图片"]');
            if (oldElement) {
                clearInterval(checkExist);
                const newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                newElement.addEventListener('click', handleImgBtnClick);

                // 添加Emoji按钮
                addEmojiButton(newElement.parentNode);
            }
        }, 200);

        // 监听 Ctrl+Enter 快捷键
        if (submitByKey) {
            document.addEventListener('keydown', function (event) {
                if (event.ctrlKey && event.key === 'Enter') {
                    const button = document.querySelector('.submit.btn');
                    if (button) button.click();
                }
            });
        }

        // 定期检查并确保Emoji按钮存在
        setInterval(ensureEmojiButton, 2000);
    }

    // 粘贴事件处理
    function handlePasteEvt(event) {
        log('正在处理粘贴内容...');
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        if (items.length === 0) {
            log('你粘贴的内容好像没有图片哦', 'red');
            return;
        }
        uploadImage(items);
    }

    // 图片按钮点击事件处理
    function handleImgBtnClick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';

        input.onchange = e => {
            const files = e.target.files;
            if (files.length) {
                const items = [...files].map(file => ({
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file
                }));
                uploadImage(items);
            }
        };

        input.click();
    }

    // 处理并上传图片
    async function uploadImage(items) {
        // 检查上传频率限制
        const now = Date.now();
        const timeSinceLastUpload = now - lastUploadTime;

        if (lastUploadTime > 0 && timeSinceLastUpload < uploadInterval) {
            const remainingTime = Math.ceil((uploadInterval - timeSinceLastUpload) / 1000);
            log(`上传频率限制：请等待 ${remainingTime} 秒后再试`, 'orange');
            return;
        }

        // 更新上传时间戳
        lastUploadTime = now;

        let imageFiles = [];

        for (let item of items) {
            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                let blob = item.getAsFile();
                imageFiles.push(blob);
            }
        }

        if (imageFiles.length > 0) {
            event.preventDefault();
            for (let i = 0; i < imageFiles.length; i++) {
                if (imageFiles.length > 1) {
                    log(`上传第 ${i + 1} / ${imageFiles.length} 张图片...`);
                } else {
                    log(`上传图片...`);
                }
                let file = imageFiles[i];
                await uploadToPersonalImgBed(file);
            }
        } else {
            log('你粘贴的内容好像没有图片哦', 'red');
        }
    }

    // 上传到个人CloudFlare ImgBed图床
    async function uploadToPersonalImgBed(file) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append('file', file);

            // 构建URL参数
            const params = new URLSearchParams({
                authCode: imgHost.authCode,
                serverCompress: imgHost.serverCompress,
                uploadChannel: imgHost.uploadChannel,
                autoRetry: imgHost.autoRetry,
                uploadNameType: imgHost.uploadNameType,
                returnFormat: imgHost.returnFormat
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}?${params.toString()}`,
                data: formData,
                onload: (rsp) => {
                    try {
                        let rspJson = JSON.parse(rsp.responseText);
                        if (rsp.status !== 200) {
                            log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                            reject(rsp.statusText);
                            return;
                        }

                        if (Array.isArray(rspJson) && rspJson.length > 0 && rspJson[0].src) {
                            // 图片上传成功
                            const imgUrl = `${imgHost.domain}${rspJson[0].src}`;
                            const fileName = mdImgName === 0 ? file.name : mdImgName;
                            insertToEditor(`![${fileName}](${imgUrl})`);
                            log('图片上传成功~', 'green');
                            // 确保Emoji按钮仍然存在
                            setTimeout(ensureEmojiButton, 100);
                        } else {
                            log('图片上传失败，接口返回格式异常', 'red');
                            insertToEditor(`图片上传失败，接口返回: ${JSON.stringify(rspJson)}`);
                        }
                    } catch (e) {
                        log(`图片上传失败，解析响应出错: ${e.message}`, 'red');
                        reject(e);
                    }
                    resolve();
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status || 'Network Error'} ${error.statusText || ''}`, 'red');
                    reject(error);
                }
            });
        });
    }

    // 插入到编辑器
    function insertToEditor(content, isEmoji = false) {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            const codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                const cursor = codeMirrorInstance.getCursor();
                if (isEmoji) {
                    // 表情符号直接插入，不添加换行符
                    codeMirrorInstance.replaceRange(content, cursor);
                } else {
                    // 图片等其他内容保持原有格式（前后换行）
                    codeMirrorInstance.replaceRange(`\n${content} \n`, cursor);
                }
            }
        }
    }

    // 在编辑器打印日志
    function log(message, color = '') {
        if (!document.getElementById('editor-enhance-logs')) {
            initEditorLogDiv();
        }
        const logDiv = document.getElementById('editor-enhance-logs');
        logDiv.innerHTML = `<div${color ? ` style="color: ${color};"` : ''}>&nbsp;&nbsp;&nbsp;${message}&nbsp;</div>`;
        console.log(`[NodeSeek-Editor-Enhance] ${message}`);
    }

    // 初始化显示日志的容器
    function initEditorLogDiv() {
        const logDiv = document.createElement('div');
        logDiv.id = 'editor-enhance-logs';
        logDiv.innerHTML = '';
        document.body.appendChild(logDiv);

        const editorToolbarDiv = document.querySelector('.mde-toolbar');
        if (editorToolbarDiv) {
            editorToolbarDiv.appendChild(logDiv);
        }
    }

    // === Emoji 功能 ===
    let emojiPicker = null;

    // 添加Emoji按钮
    function addEmojiButton(toolbar) {
        // 检查是否已存在emoji按钮，如果不存在则创建
        if (!toolbar.querySelector('.emoji-btn')) {
            const emojiBtn = document.createElement('span');
            emojiBtn.className = 'toolbar-item emoji-btn';
            emojiBtn.title = 'Emoji';
            emojiBtn.innerHTML = '😊';
            emojiBtn.style.cssText = 'cursor: pointer; font-size: 18px; margin-left: 8px;';
            emojiBtn.addEventListener('click', toggleEmojiPicker);
            toolbar.appendChild(emojiBtn);
        }
    }

    // 确保Emoji按钮始终存在的检查函数
    function ensureEmojiButton() {
        const toolbar = document.querySelector('.mde-toolbar');
        if (toolbar && !toolbar.querySelector('.emoji-btn')) {
            addEmojiButton(toolbar);
        }
    }

    // 切换Emoji选择器
    async function toggleEmojiPicker(event) {
        if (emojiPicker) {
            closeEmojiPicker();
        } else {
            await createEmojiPicker(event);
        }
        event.stopPropagation();
    }

    // 创建Emoji选择器
    async function createEmojiPicker(event) {
        // 加载emoji-picker-element
        if (!window.customElements.get('emoji-picker')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = emojiConfig.pickerUrl;
            document.head.appendChild(script);

            await new Promise(resolve => {
                const check = setInterval(() => {
                    if (window.customElements.get('emoji-picker')) {
                        clearInterval(check);
                        resolve();
                    }
                }, 100);
            });
        }

        // 计算位置 - 智能定位，避免超出屏幕
        const rect = event.target.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算水平位置
        let left = rect.left - emojiConfig.width / 2;
        // 确保不超出左边界
        left = Math.max(10, left);
        // 确保不超出右边界
        left = Math.min(left, viewportWidth - emojiConfig.width - 10);

        // 计算垂直位置 - 优先显示在按钮下方，如果空间不够则显示在上方
        let top;
        let actualHeight = emojiConfig.height;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow >= emojiConfig.height + 10) {
            // 下方空间足够，显示在按钮下方
            top = rect.bottom + 5;
        } else if (spaceAbove >= emojiConfig.height + 10) {
            // 上方空间足够，显示在按钮上方
            top = rect.top - emojiConfig.height - 5;
        } else {
            // 上下空间都不够，选择空间较大的一边，并调整高度
            if (spaceBelow > spaceAbove) {
                top = rect.bottom + 5;
                actualHeight = Math.min(emojiConfig.height, spaceBelow - 15);
            } else {
                top = 10;
                actualHeight = Math.min(emojiConfig.height, spaceAbove - 15);
            }
        }

        // 创建容器
        emojiPicker = document.createElement('div');
        emojiPicker.style.cssText = `
            position: fixed; top: ${top}px; left: ${left}px;
            width: ${emojiConfig.width}px; height: ${actualHeight}px;
            background: #fff; border: 1px solid #ddd; border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10001;
            animation: fadeIn 0.18s;
        `;

        const pickerElement = document.createElement('emoji-picker');
        pickerElement.style.cssText = 'width: 100%; height: 100%;';
        pickerElement.addEventListener('emoji-click', handleEmojiSelect);

        emojiPicker.appendChild(pickerElement);
        document.body.appendChild(emojiPicker);

        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', outsideClickHandler);
        }, 10);
    }

    // 处理Emoji选择
    function handleEmojiSelect(event) {
        const emoji = event.detail.unicode;
        insertToEditor(emoji, true); // 传递 isEmoji = true 参数
        closeEmojiPicker();
    }

    // 关闭Emoji选择器
    function closeEmojiPicker() {
        if (emojiPicker) {
            emojiPicker.remove();
            emojiPicker = null;
            document.removeEventListener('click', outsideClickHandler);
            // 确保Emoji按钮仍然存在
            setTimeout(ensureEmojiButton, 50);
        }
    }

    // 外部点击处理
    function outsideClickHandler(event) {
        if (emojiPicker && !emojiPicker.contains(event.target) &&
            !event.target.classList.contains('emoji-btn') &&
            !event.target.closest('.emoji-btn')) {
            closeEmojiPicker();
        }
    }

    // 添加CSS动画
    if (!document.getElementById('emoji-style')) {
        const style = document.createElement('style');
        style.id = 'emoji-style';
        style.innerHTML = `
            @keyframes fadeIn {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .emoji-btn:hover { background: #f2f2f2; border-radius: 4px; }
        `;
        document.head.appendChild(style);
    }

})();
