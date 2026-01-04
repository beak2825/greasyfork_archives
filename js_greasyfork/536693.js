// ==UserScript==
// @name         16图床 for NodeSeek
// @namespace    https://www.nodeseek.com/
// @version      0.1.6
// @description  在NodeSeek论坛的编辑器中快速把图片上传到16图床并引用
// @author       湘铭呀！
// @match        *://www.nodeseek.com/*
// @icon         https://111666.best/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/536693/16%E5%9B%BE%E5%BA%8A%20for%20NodeSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/536693/16%E5%9B%BE%E5%BA%8A%20for%20NodeSeek.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 图床配置
    const imgHost = {
        type: "CustomImageHost", // 图床类型, 仅支持 16图床 (https://i.111666.best)
        url: "https://i.111666.best", // 图床地址, 带上协议头
        token: "YOUR-TOKEN", // 图床 token, 可选, 用于 Auth-Token 头进行身份验证
    };
    const mdImgName = 0; // 0: 使用图片文件名, 其他值则名称固定为该值
    const submitByKey = true; // 是否按下 Ctrl+Enter 后触发发帖动作

    // 页面加载完毕后载入功能
    window.addEventListener('load', initEditorEnhancer, false);

    function initEditorEnhancer() {
        // 监听粘贴事件
        document.addEventListener('paste', (event) => handlePasteEvt(event));

        // 给编辑器绑定拖拽事件
        var dropZone = document.getElementById('code-mirror-editor');
        // 阻止默认行为
        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy'; // 显示为复制图标
        });

        // 处理文件拖放
        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();

            log('正在处理拖放内容...');
            let imageFiles = [];
            for (let file of e.dataTransfer.files) {
                if (/^image\//i.test(file.type)) { // 确保只处理图片文件
                    imageFiles.push(file);
                    log(`拖放的文件名: ${file.name}`);
                }
            }
            log(`拖放的图片数量: ${imageFiles.length}`);
            if (imageFiles.length === 0) {
                log('你拖放的内容好像没有图片哦', 'red');
                return;
            }

            // 调整uploadImage函数以接受File对象数组
            uploadImage(imageFiles.map(file => {
                return {
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file
                };
            }));
        });

        // 修改图片按钮的行为
        let checkExist = setInterval(function () {
            const oldElement = document.querySelector('.toolbar-item.i-icon.i-icon-pic[title="图片"]');
            if (oldElement) {
                clearInterval(checkExist);
                const newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                newElement.addEventListener('click', handleImgBtnClick);
            }
        }, 200);

        // 监听 Ctrl+Enter 快捷键
        if (submitByKey)
            document.addEventListener('keydown', function (event) {
                if (event.ctrlKey && event.key === 'Enter') {
                    // 获取按钮元素
                    const button = document.querySelector('.submit.btn');
                    // 触发点击事件
                    button.click();
                }
            });
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
        // 创建一个隐藏的文件输入元素
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true; // 允许多选文件
        input.accept = 'image/*'; // 仅接受图片文件

        // 当文件被选择后的处理
        input.onchange = e => {
            const files = e.target.files; // 获取用户选择的文件列表
            if (files.length) {
                const items = [...files].map(file => ({
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file
                }));
                uploadImage(items);
            }
        };

        // 触发文件输入框的点击事件
        input.click();
    }

    // 处理并上传图片
    async function uploadImage(items) {
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
                if (imageFiles.length > 1)
                    log(`上传第 ${i + 1} / ${imageFiles.length} 张图片...`);
                else
                    log(`上传图片...`);
                let file = imageFiles[i];
                await uploadToCustomImageHost(file);
            }
        } else {
            log('你粘贴的内容好像没有图片哦', 'red');
        }
    }

    // 上传到 16图床
    async function uploadToCustomImageHost(file) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            if (imgHost.token) {
                headers['Auth-Token'] = imgHost.token;
            }

            let formData = new FormData();
            formData.append('image', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/image`,
                headers: headers,
                data: formData,
                onload: (rsp) => {
                    try {
                        let rspJson = JSON.parse(rsp.responseText);
                        if (rsp.status !== 200 || !rspJson.ok) {
                            log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                            reject(rspJson?.message || '上传失败');
                            return;
                        }
                        // Handle API response with 'src' field
                        if (rspJson.src) {
                            let imgName = mdImgName === 0 ? file.name : mdImgName;
                            // Construct full URL by prepending imgHost.url to src
                            let fullUrl = `${imgHost.url}${rspJson.src}`;
                            insertToEditor(`![${imgName}](${fullUrl})`);
                            log('图片上传成功', 'green');
                        } else {
                            log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                            insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)}`);
                        }
                        resolve();
                    } catch (error) {
                        log(`图片上传失败: 响应解析错误 ${error.message}`, 'red');
                        reject(error);
                    }
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }

    // 插入到编辑器
    function insertToEditor(markdownLink) {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            const codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                const cursor = codeMirrorInstance.getCursor();
                codeMirrorInstance.replaceRange(`\n${markdownLink} \n`, cursor);
            }
        }
        if (markdownLink.startsWith('!['))
            log('图片已插入到编辑器~', 'green');
    }

    // 在编辑器打印日志
    function log(message, color = '') {
        if (!document.getElementById('editor-enhance-logs')) {
            initEditorLogDiv();
        }
        const logDiv = document.getElementById('editor-enhance-logs');
        logDiv.innerHTML = `<div${color ? ` style="color: ${color};` : ''}">   ${message} </div>`;

        console.log(`[16ImageHosting-Editor-Enhancer] ${message}`);
    }

    // 初始化显示日志的容器
    function initEditorLogDiv() {
        const logDiv = document.createElement('div');
        logDiv.id = 'editor-enhance-logs';
        logDiv.innerHTML = '';
        document.body.appendChild(logDiv);

        const editorToolbarDiv = document.querySelector('.mde-toolbar');
        editorToolbarDiv.appendChild(logDiv);
    }
})();