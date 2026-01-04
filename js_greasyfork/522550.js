// ==UserScript==
// @name         Boltp for NodeSeek
// @namespace    https://www.nodeseek.com/
// @version      0.1.0
// @description  在NodeSeek论坛的编辑器中快速把图片上传到闪电图床并引用
// @author       Boltp Team
// @match        *://www.nodeseek.com/*
// @icon         https://www.boltp.com/logo.ico
// @grant        GM_xmlhttpRequest
// @license      MPL-2.0 License
// @supportURL   https://www.boltp.com/page/NodeSeek
// @homepageURL  https://www.boltp.com/page/NodeSeek
// @downloadURL https://update.greasyfork.org/scripts/522550/Boltp%20for%20NodeSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/522550/Boltp%20for%20NodeSeek.meta.js
// ==/UserScript==

/**
 * 
 * 
 * 当前版本更新日志
 * 0.0.11 - 2025.01.01          !!!更新前注意备份您的配置!!!
 * - 新增 支持 0-RTT/telegraph 项目
 */

(function () {
    'use strict';

    // 图床配置, 默认提供的是这位大佬的 https://www.nodeseek.com/post-38305-1 , 这个图床上传限制 5p / IP / 小时
    // 当 type 为 LskyPro 时以下所有配置项均有用, 为 Chevereto 时 url 和 token 有用, 为 Telegraph / EasyImages 时只有 url 有用
    // Telegraph 官网 https://telegra.ph/ 在大陆被阻断, 可以使用 https://github.com/cf-pages/Telegraph-Image 提供的服务或者自己部署
    // Telegraph2 by @Xiefengshang 使用的是 https://github.com/0-RTT/telegraph 项目(个人考虑到其缓存做的更好所以使用)
    // EasyImages 官网 https://png.cm/ 限制单 ip 每天上传 3 张, 项目地址 https://github.com/icret/EasyImages2.0, 这个图床真烂, 两套接口不统一下, 文档也不写几句话
    const imgHost = {
        type: "LskyPro", // 图床类型, 支持 LskyPro / Telegraph / Telegraph2 / Chevereto / EasyImages
        url: "https://www.boltp.com", // 图床地址, 带上协议头
        token: null, // 图床 token, 可选, 不填则为游客上传, LskyPro 在 /user/tokens 生成, Chevereto 必填, 在 /settings/api 生成, EasyImages 填写则使用后端接口上传, 不填写则使用前端接口上传
        storageId: null, // 图床存储策略ID, 可选项, 不填则为默认策略, 普通用户可在上传页抓包得到, 管理员可以在后台看到
    };
    const mdImgName = 0; // 0(非 Telegraph): 使用图床返回的原始名称, 其他值则名称固定为该值
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

            // 调整uploadImage函数以接受File对象数组而不是DataTransferItemList
            uploadImage(imageFiles.map(file => {
                return {
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file
                };
            }));
        });

        // 修改图片按钮的行为
        // 图片按钮
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
        uploadImage(items)
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

        // 触发文件输入框的点击事件，打开文件选择窗口
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
                let formData = new FormData();
                formData.append('file', file);
                if (imgHost.type === 'LskyPro') {
                    if (imgHost.storageId) formData.append('strategy_id', imgHost.storageId);
                    await uploadToLsky(formData);
                } else if (imgHost.type === 'Telegraph') {
                    await uploadToTelegraph(formData);
                } else if (imgHost.type === 'Telegraph2') {
                    await uploadToTelegraph2(formData);
                } else if (imgHost.type === 'Chevereto') {
                    await uploadToChevereto(file);
                } else if (imgHost.type === 'EasyImages') {
                    await uploadToEasyImages(file);
                } else {
                    log(`暂不支持的图床类型: ${imgHost.type}, 取消上传`, 'red');
                    return;
                }
            }

        } else {
            log('你粘贴的内容好像没有图片哦', 'red');
        }
    }

    async function uploadToLsky(formData) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            if (imgHost.token)
                headers['Authorization'] = `Bearer ${imgHost.token}`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/api/v1/upload`,
                headers: headers,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);
                    if (rsp.status !== 200) {
                        log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                        reject(rspJson.message);
                    }
                    if (rspJson.status === true) {
                        // 图片上传成功
                        if (rspJson?.data?.links?.markdown)
                            insertToEditor(mdImgName === 0 ? rspJson.data.links.markdown : `![${mdImgName}](${rspJson.data.links.url})`);
                        else {
                            log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                            insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)})`);
                        }
                    } else
                        log(`图片上传失败: ${rspJson.message}`, 'red');
                    resolve();
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }

    async function uploadToTelegraph(formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/upload`,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);
                    rspJson = rspJson[0];
                    if (rsp.status !== 200) {
                        log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                        reject(rspJson.message);
                    }
                    if (rspJson) {
                        // 图片上传成功
                        if (rspJson?.src)
                            insertToEditor(`![${mdImgName}](${imgHost.url}${rspJson.src})`);
                        else {
                            log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                            insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)})`);
                        }
                    } else
                        log(`图片上传失败: ${JSON.stringify(rspJson)}`, 'red');
                    resolve();
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }

    async function uploadToTelegraph2(formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/upload`,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);

                    if (rsp.status !== 200 || !rspJson || !rspJson.data) {
                        log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                        reject(rspJson?.message || '图片上传失败，缺少 data 字段');
                    }

                    const result = rspJson.data;

                    // 图片上传成功
                    if (result) {
                        insertToEditor(`![${mdImgName}](${result})`);
                        log('图片上传成功');
                        resolve(result);
                    } else {
                        log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                        insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)}`);
                        resolve();
                    }
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }

    async function uploadToChevereto(file) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            if (!imgHost.token) {
                log('Chevereto 图床需配置 token', 'red');
                reject('Chevereto 图床需要 token, 请填写 token 后重试');
                return;
            }
            headers['X-API-Key'] = imgHost.token;
            let formData = new FormData();
            formData.append('source', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/api/1/upload`,
                headers: headers,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);
                    if (rsp.status !== 200) {
                        log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                        reject(rspJson?.success?.message || rspJson?.error?.message);
                    }
                    if (rspJson.status_code === 200) {
                        // 图片上传成功
                        let imgUrl = rspJson.image.url || rspJson.image.url_viewer || rspJson.image.url_short;
                        if (imgUrl)
                            insertToEditor(mdImgName === 0 ? `![${rspJson.image.filename}](${imgUrl})` : `![${mdImgName}](${imgUrl})`);
                        else {
                            log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                            insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)})`);
                        }
                    } else
                        log(`图片上传失败: ${rspJson?.success?.message || rspJson?.error?.message}`, 'red');
                    resolve();
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }

    async function uploadToEasyImages(file) {
        return new Promise((resolve, reject) => {
            let url = imgHost.url;
            let formData = new FormData();
            if (imgHost.token) {
                // 带token, 使用后端接口上传
                url += '/api/index.php'
                formData.append('token', imgHost.token);
                formData.append('image', file);
            } else {
                // 不带token, 使用前端接口上传
                url += '/app/upload.php'
                formData.append('file', file);
                // 十位时间戳作为sign
                formData.append('sign', Math.floor(Date.now() / 1000));
            }


            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);
                    if (rsp.status !== 200) {
                        log(`图片上传失败: ${rsp.status} ${rsp.statusText}`, 'red');
                        reject(rspJson.result);
                    }
                    if (rspJson.code === 200) {
                        // 图片上传成功
                        if (rspJson?.url)
                            insertToEditor(`![${(mdImgName === 0 ? rspJson.srcName : mdImgName)}](${rspJson.url})`);
                        else {
                            log('图片上传成功, 但接口返回有误, 原始返回已粘贴到编辑器', 'red');
                            insertToEditor(`图片上传成功, 但接口返回有误: ${JSON.stringify(rspJson)})`);
                        }
                    } else
                        log(`图片上传失败: ${JSON.stringify(rspJson)}`, 'red');
                    resolve();
                },
                onerror: (error) => {
                    log(`图片上传失败: ${error.status} ${error.statusText}`, 'red');
                    reject(error);
                }
            });
        });
    }


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
        logDiv.innerHTML = `<div${color ? ` style="color: ${color};` : ''}">&nbsp;&nbsp;&nbsp;${message}&nbsp;</div>`;

        console.log(`[NodeSeek-Editor-Enhance] ${message}`);
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
