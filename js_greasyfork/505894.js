// ==UserScript==
// @name         国家中小学智慧教育平台-课程教学小助手
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  Web端下载视频和课件、教学设计、学习任务单、课后练习
// @author       You
// @match        https://basic.smartedu.cn/syncClassroom/*
// @match        https://basic.smartedu.cn/qualityCourse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505894/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%AF%BE%E7%A8%8B%E6%95%99%E5%AD%A6%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/505894/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%AF%BE%E7%A8%8B%E6%95%99%E5%AD%A6%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let window = unsafeWindow;
    let g_headers = null;

    // 获取当前课程名
    function getClassName(){
        let course_name = document.getElementsByClassName("course-detail-name")[0].innerText;
        let class_name = document.querySelector("#zxxcontent > div.course-detail > div.course-detail-top > div.course-detail-header > div:nth-child(3) > div > div > button.rts___tab.rts___btn.style-module_tab-nav_yOa1m.style-module_active_YItIU.rts___tab___selected");
        if (class_name) {
            class_name = class_name.innerText;
        } else {
            class_name = '第一课时';
        }
        let resource_name = document.getElementsByClassName("study-list-item study-list-item-active")[0].getElementsByClassName("study-list-text")[0].innerText;
        console.log(`course_name==>${course_name}, class_name==>${class_name}, resource_name==>${resource_name}`);
        let name = `${course_name}-${class_name}-${resource_name}`;
        return name;
    }

    // 处理响应并创建下载链接
    function downloadPdf(response, file_name = null) {
        if (!response.ok) {
            console.error('网络响应不成功:', response.status);
            return;
        }
        // 响应标头
        let contentLength = response.headers.get('Content-Length');
        let lengthInBytes = parseInt(contentLength, 10);
        if (lengthInBytes / (1024 * 1024) > 1) {
            contentLength = `${Math.ceil(lengthInBytes / (1024 * 1024))} MB`;
        } else {
            contentLength = `${Math.ceil(lengthInBytes / 1024)} KB`;
        }
        let contentRange = response.headers.get('Content-Range');
        let contentType = response.headers.get('Content-Type');
        console.log(`状态码:${response.status}, Content-Length:${contentLength}, Content-Range:${contentRange}, Content-Type:${contentType}`);
        if (response.status !== 200) {
            console.log('状态代码不匹配:', response.status);
            return;
        }
        // 文件信息
        if (!file_name) {
            file_name = getClassName() + '.pdf';
        }
        console.log('file_name==>', file_name)
        // 准备下载
        response.blob().then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file_name; // 指定下载时的文件名
            document.body.appendChild(a);
            a.click(); // 触发点击下载
            document.body.removeChild(a); // 清理DOM

            // 清理Object URL
            URL.revokeObjectURL(url);
        }).catch(err => {
            console.error('下载PDF时出错:', err);
        });
    }

    // 网址检查
    function check_url(url, t){
        if (url.endsWith(t)) {
            return true;
        } else {
            return false;
        }
    }

    // 保存原来的fetch方法
    const originalFetch = window.fetch;

    // 重写fetch方法
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);

        // 在这里过滤你想要的资源，例如只处理图片
        if (check_url(response.url, '.pdf')) {
            console.log('[fetch]加载的特定资源:', response.url);
            let pathname = window.location.pathname;
            if (pathname.includes("classActivity") || pathname.includes("qualityCourse")) {// 课程包
                let rsp = response.clone();
                downloadPdf(rsp);
            } else if (pathname.includes("examinationpapers")){// 练习
                let file_name = decodeURIComponent(response.url.split('/').at(-1));
                file_name = file_name.replace('.pdf', '（无水印）.pdf');
                downloadPdf(response, file_name);
                // 直接返回，不用生成加了水印的PDF
                return;
            }
        }

        return response;
    };

    // 保存原始的 open 和 send 方法
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    // 重写 open 方法
    XMLHttpRequest.prototype.open = function(method, url) {
        // 将 URL 存储在当前 XMLHttpRequest 实例的属性中
        this._requestUrl = url; // 使用自定义属性
        if (url.includes('resource_keys')) {
            console.log("[XMLHttpRequest.prototype.open]", method, url);
        }

        return originalXhrOpen.apply(this, arguments);
    };

    // 重写 send 方法
    XMLHttpRequest.prototype.send = function(...args) {
        // 在 send 方法中获取请求的 URL
        //console.log('Request URL in send:', this._requestUrl, this._requestUrl.includes('keys'));
        let url = this._requestUrl;

        // 保存原有的 onreadystatechange 事件处理程序
        const originalOnReadyStateChange = this.onreadystatechange;
        // 监听 onreadystatechange 事件
        this.onreadystatechange = function() {
            // 调用原有的事件处理程序（如果存在）
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this);
            }
            // 自定义逻辑
            if (this.readyState === XMLHttpRequest.DONE) { // 请求完成
                if (url.includes('.m3u8')) {
                    let headers = this.headers;
                    if (headers && headers['X-ND-AUTH']) {
                        let headers_json = JSON.stringify(headers);
                        g_headers = headers_json;
                    }
                } else {
                    // 屏蔽调试信息
                    //return;
                    // 你可以在这里处理响应数据
                    // 例如，解析 JSON 数据
                    if (url.includes('resource_keys')) {
                        try {
                            // 获取响应数据
                            const response = this.responseText;
                            console.log('[XMLHttpRequest.prototype.send] original response:', response);
                            const jsonResponse = JSON.parse(response);
                            console.log('[XMLHttpRequest.prototype.send] JSON     response:', jsonResponse);
                            const key = jsonResponse.key;
                            if (key) {
                                console.log("[XMLHttpRequest.prototype.send] 服务器返回key:", key);
                                //copyToClipboard(key);
                            }
                        } catch (e) {
                            console.error('Failed to parse JSON:', e);
                        }
                    }
                }

            }
        };

        // 调用原始的 send 方法
        return originalXhrSend.apply(this, args);
    };

    // 复制到剪切板的函数
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
    }

    // 复制到剪切板且弹窗的函数
    const copyToClipboardAndAlert = (text, reopen = true) => {
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                icon: 'success',
                title: '成功！',
                html: `${text}<br><strong>已复制到剪切板。</strong>`,
                showConfirmButton: true,
                confirmButtonText: '好的',
                timer: 3000, // 设置多久后自动关闭
                timerProgressBar: true, // 显示计时条
                willClose: () => {
                    if (reopen) {
                        showAlert(); // 复制后，重新显示原始弹窗
                    }
                }
            });
        }).catch(err => {
            Swal.fire({
                title: '失败！',
                text: '无法复制到剪切板，发生错误。',
                icon: 'error',
                confirmButtonText: '好的'
            });
        });
    };

    // base64编码
    function base64EncodeUnicode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // 定义弹出窗口
    const showAlert = () => {
        let headers = g_headers;
        let key = videojs.getAllPlayers()[0].monkey();
        if (key) {
            key = base64EncodeUnicode(key);
        } else {
            key = '未获取到密钥或无需密钥！'
        }
        let name = getClassName();
        Swal.fire({
            icon: 'question',
            title: name,
            html: `
                <strong>【猫捉】解析m3u8→设置请求头→自定义密钥</strong><br>
                <strong>设置请求头:</strong><br>${headers}<br>
                <strong>自定义密钥:</strong><br>${key}
            `,
            confirmButtonText: '复制请求头',
            showDenyButton: true,
            denyButtonText: '复制密钥',
            showCancelButton: true,
            cancelButtonText: '复制课程名',
            allowOutsideClick: false, // 外部点击关闭弹窗
        }).then((result) => {
            if (result.isConfirmed) {
                copyToClipboardAndAlert(headers);
            } else if (result.isDenied) {
                copyToClipboardAndAlert(key);
            } else {
                copyToClipboardAndAlert(name, false);
            }
        });
    };

    // 键盘点击
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyH') {
            console.log('H 键被按下');
            // 处理 H 键的逻辑
        } else if (event.code === 'KeyK') {
            console.log('K 键被按下');
            // 处理 K 键的逻辑
            let key = videojs.players.vjs_video_1.monkey();
            let key_base64 = base64EncodeUnicode(key);
            console.log(`key==>${key}, key_base64==>${key_base64}`);
            copyToClipboard(key_base64);
        } else if (event.code === 'KeyV') {
            try {
                // 显示弹出窗口
                showAlert();
            } catch (error) {
                // 处理异常的代码
                console.error('m3u8密钥获取失败:', error);
                // 启用本地替代功能需要打开控制台？
                //https://learn.microsoft.com/zh-cn/microsoft-edge/devtools-guide-chromium/javascript/overrides
                Swal.fire('m3u8密钥获取失败', `<strong>message：</strong>${error.message}<br><strong>tips：</strong>F12打开控制台，播放视频，然后刷新网页，<br>再重试！`, 'error');
            } finally {
                // 可选的代码，无论是否发生异常都会执行
                //console.log('执行完毕');
            }
        } else if (event.code === 'KeyT') {
            Swal.fire({
                title: '欢迎使用 SweetAlert2!',
                text: '这是一个甜美的提示框。',
                icon: 'success',
                confirmButtonText: '好的'
            });
        }
    });

    // 添加点击事件监听器
    document.addEventListener('click', function(event) {
        // 获取被点击的元素
        const clickedElement = event.target;

        // 获取元素的innerText
        const innerText = clickedElement.innerText;

        // 打印innerText到控制台
        console.log('Clicked element innerText:', innerText);
    });
})();