// ==UserScript==
// @name         讯飞配音导出工具
// @namespace    http://your.namespace.com
// @version      0.2
// @description  Capture links starting with "/synth" in network requests and control button state.
// @author       Hubit123
// @license      MIT
// @match        https://www.xfzhizuo.cn/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/479061/%E8%AE%AF%E9%A3%9E%E9%85%8D%E9%9F%B3%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/479061/%E8%AE%AF%E9%A3%9E%E9%85%8D%E9%9F%B3%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    let capturedBlobUrls = []; // 用于保存捕获的链接的数组
    let isButtonEnabled = false; // 用于跟踪按钮是否启用
    let generateButton; // 存储生成音频按钮元素
    let newButton; // 存储新的下载音频按钮元素
    let clearButton; // 存储用于清空链接的按钮

    const open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.startsWith('/synth')) {
            // capturedBlobUrls.push(url);
            // console.log(`Captured Blob Link:${url}`);
            // 检查链接是否以 "/synth" 开头，然后发送异步请求
            this.addEventListener('load', function() {
                if (this.status === 200 && this.response.byteLength > 10) {
                    console.log(`Captured Blob Link:${url}`);
                    // console.log('Response:', this.response);
                    // 在这里处理返回的值，this.responseText 包含了响应的内容
                    capturedBlobUrls.push([url, new Blob([this.response])]);
                }
            });
            isButtonEnabled = true;
            if (newButton) {
                newButton.style.opacity = '1';
            }
        }
        open.apply(this, arguments);
    };

    // 获取具有以 "custom-header_previewBtn__" 开头的类名的元素
    generateButton = document.querySelector('[class^="custom-header_previewBtn__"]');

    if (generateButton && getCookie('uid') != '') {
        // 隐藏原生成音频按钮
        generateButton.style.display = 'none';

        // 创建一个新按钮
        newButton = document.createElement('div');
        newButton.className = generateButton.className + ' generate_button';
        newButton.textContent = '下载音频';

        // 添加新按钮到页面
        generateButton.parentNode.insertBefore(newButton, generateButton);

        // 添加点击事件处理程序到新按钮
        newButton.addEventListener('click', function() {
            if (isButtonEnabled) {
                // 获取具有以 "custom-header_workName__" 开头的类名的元素
                const workNameElement = document.querySelector('[class^="custom-header_workName__"]');
                let audioName = 'noname';
                if (workNameElement) {
                    // 获取元素的文本内容
                    audioName = workNameElement.textContent;
                    console.log('Audio Name:', audioName);
                }
                // 检查是否有捕获的链接
                if (capturedBlobUrls.length == 1) {
                    const capturedBlobUrl = capturedBlobUrls.pop(); // 取出最新的链接
                    // 创建一个用于下载的链接
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(capturedBlobUrl[1]);
                    a.download = audioName + '.wav';

                    // 将 URL 中的内容部分提取出来
                    const contentPart = capturedBlobUrl[0].split('&').find(part => part.startsWith('content='));

                    if (contentPart) {
                        // 解码内容部分
                        a.download = decodeURIComponent(contentPart.substring(8)).replace(/(\r\n|\r|\n)/g, '') + '.wav';
                    }

                    // 模拟点击下载链接
                    a.click();

                    // 清空捕获的链接数组
                    capturedBlobUrls = [];
                    console.log('clear list');
                } else if(capturedBlobUrls.length > 1){
                    // 检查是否有捕获的链接
                    const zip = new JSZip();
                    capturedBlobUrls.forEach((capturedBlobUrl, index) => {
                        // 创建一个包含WAV文件头部和数据的Blob
                        const wavBlob = capturedBlobUrl[1];

                        // 将 URL 中的内容部分提取出来
                        const contentPart = capturedBlobUrl[0].split('&').find(part => part.startsWith('content='));
                        let zipFileName = `${audioName}_${index}.wav`;
                        if (contentPart) {
                            // 解码内容部分
                            zipFileName = index + '_' + decodeURIComponent(contentPart.substring(8)).replace(/(\r\n|\r|\n)/g, '') + '.wav';
                        }

                        // 将每个blob添加到zip文件
                        zip.file(zipFileName, wavBlob);

                        console.log(`zip index ${index} file name ${zipFileName}`);
                    });
                    zip.generateAsync({ type: 'blob' })
                        .then(content => {
                        // 创建一个用于下载的链接
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(content);
                        a.download = `${audioName}.zip`;

                        // 模拟点击下载链接
                        a.click();

                        // 清空捕获的链接数组
                        capturedBlobUrls = [];
                        console.log('clear list');
                    });
                }
                else {
                    // 如果没有捕获的链接，按钮置灰并禁用
                    newButton.style.opacity = '0.5';
                    isButtonEnabled = false;
                }
                // 下载完成后重新启用按钮
                isButtonEnabled = false;
                newButton.style.opacity = '0.5';
            }
        });
    }

    function triggerClickEvent(element) {
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            element.dispatchEvent(event);
        } else if (document.createEventObject) {
            element.fireEvent('onclick');
        }
    }

    function handleShortcutKey(event) {
        // Check if the key combination is Ctrl + S
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            // 清空捕获的链接数组
            capturedBlobUrls = [];
            console.log('clear list');
            // Find the element with a class that starts with "custom-header_draftBtn__"
            const draftButton = document.querySelector('[class^="custom-header_draftBtn__"]');
            if (draftButton) {
                // Trigger a click event on the element
                triggerClickEvent(draftButton);
            }
        }
    }

    // Add a keyboard shortcut event listener
    document.addEventListener('keydown', handleShortcutKey);

    isButtonEnabled = false;
    newButton.style.opacity = '0.5';
})();
