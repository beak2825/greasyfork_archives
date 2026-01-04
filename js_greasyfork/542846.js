// ==UserScript==
// @name         南+编辑器快捷上传图床
// @namespace    https://www.summer-plus.net/
// @version      0.0.2
// @description  为 南+ 编辑器增加图片上传功能，使用个人CloudFlare ImgBed图床
// @author       shixiong
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @icon         https://www.summer-plus.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/542846/%E5%8D%97%2B%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/542846/%E5%8D%97%2B%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_UID = "southplus_user_uid";
    let userUid = localStorage.getItem(STORAGE_KEY_UID);

    if (!userUid) {
        // 如果在用户详情页则解析 UID
        if (location.pathname === "/u.php") {
            const h1 = document.querySelector("h1.u-h1");
            if (h1) {
                userUid = h1.textContent.trim();
                localStorage.setItem(STORAGE_KEY_UID, userUid);
                console.log("[SouthPlus] 成功保存 UID:", userUid);
            }
        } else {
            // 第一次使用时弹出提示再跳转
            alert("首次使用脚本，需要前往个人详情页以获取您的UID，点击确定后将跳转。");
            location.href = "https://www.summer-plus.net/u.php";
        }
    }

    // 上传配置（用户可在这里直接填写自定义目录）
    const imgHost = {
        url: "https://pics.j8.pics/upload", // 图床上传地址
        authCode: "",           // 上传认证码，集拔图床未设置认证码，无需填写！
        domain: "https://pics.j8.pics",    // 图床域名
        uploadFolder: "/test",                 // 可不填，也可自定义，请勿填写特殊字符！
        uploadChannel: "telegram",
        serverCompress: true,
        autoRetry: true,
        uploadNameType: "default",
        returnFormat: "default"
    };

    // 根据 UID + 用户配置生成上传目录
    function getUploadFolder() {
        let customDir = imgHost.uploadFolder || "";
        if (customDir && !customDir.startsWith("/")) {
            customDir = "/" + customDir;
        }
        return userUid ? ("/" + userUid + customDir) : "SummerPlus";
    }

    const mdImgName = 0; // 0: 使用图床返回的原始名称

    // 页面加载完毕后载入功能
    window.addEventListener('load', initEditorEnhancer, false);

    function initEditorEnhancer() {
        // 监听粘贴事件
        document.addEventListener('paste', (event) => handlePasteEvt(event));

        // 给编辑器绑定拖拽事件
        var dropZone = document.getElementsByClassName('rinsp-reply-refresh-free')[0];
        if (dropZone) {
            dropZone.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

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
            let picUrls = [];
            event.preventDefault();
            for (let i = 0; i < imageFiles.length; i++) {
                if (imageFiles.length > 1) {
                    log(`上传第 ${i + 1} / ${imageFiles.length} 张图片...`);
                } else {
                    log(`上传图片...`);
                }
                let file = imageFiles[i];
                await uploadToPersonalImgBed(file, picUrls);
            }
            log("图片上传成功~<br>在需要插入的地方右键粘贴即可~", "green");
            GM_setClipboard(picUrls.join('\n'));
        } else {
            log('粘贴的内容好像没有图片哦', 'red');
        }
    }

    // 上传到个人图床
    async function uploadToPersonalImgBed(file, picUrls) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append('file', file);

            const params = new URLSearchParams({
                authCode: imgHost.authCode,
                serverCompress: imgHost.serverCompress,
                uploadChannel: imgHost.uploadChannel,
                uploadFolder: getUploadFolder(), // ✅ 动态生成目录
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
                            const imgUrl = `${imgHost.domain}${rspJson[0].src}`;
                            const fileName = mdImgName === 0 ? file.name : mdImgName;
                            picUrls.push(`[img]${imgUrl}[/img]`);
                            log('图片上传成功~', 'green');
                        } else {
                            log('图片上传失败，接口返回格式异常', 'red');
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

    // 在编辑器打印日志
    function log(message, color = '') {
        if (!document.getElementById('editor-enhance-logs')) {
            initEditorLogDiv();
        }
        const logDiv = document.getElementById('editor-enhance-logs');
        logDiv.innerHTML = `<div${color ? ` style="color: ${color};"` : ''}>&nbsp;&nbsp;&nbsp;${message}&nbsp;</div>`;
        console.log(`[SouthPlus-Editor-Enhance] ${message}`);
    }

    // 初始化显示日志的容器
    function initEditorLogDiv() {
        const logDiv = document.createElement('div');
        logDiv.id = 'editor-enhance-logs';
        logDiv.innerHTML = '';
        document.body.appendChild(logDiv);

        const editorToolbarDiv = document.getElementsByClassName('f_one')[2];
        if (editorToolbarDiv) {
            editorToolbarDiv.appendChild(logDiv);
        }
    }

})();
