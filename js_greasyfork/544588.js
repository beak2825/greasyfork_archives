// ==UserScript==
// @name         Wiji 粘贴图片上传
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  增加 wiki.js 对 粘贴图片到 md 编辑器的支持
// @author       You
// @match        http://192.168.1.111:7001/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.111
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544588/Wiji%20%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/544588/Wiji%20%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = window.setInterval(registerPaste, 1000);


    function registerPaste() {

        // 获取编辑器元素
        const editor = document.querySelector('div.editor-markdown-editor');
        if (!editor) {
            console.error('未找到编辑器元素');
            return;
        } else {
            window.clearInterval(intervalId);
        }

        // 添加粘贴事件监听
            editor.addEventListener('paste', async (event) => {
                // 获取剪贴板数据
                const items = event.clipboardData.items;
                for (let item of items) {
                    if (item.type.indexOf('image') !== -1) {
                        event.preventDefault();

                        // 获取图片文件
                        const file = item.getAsFile();
                        if (!file) continue;

                        // 生成新文件名（全部小写）
                        const fileExt = file.name.split('.').pop().toLowerCase();
                        const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')).toLowerCase();
                        const randomId = generateShortRandomId();
                        const newFileName = `${fileNameWithoutExt}-${randomId}.${fileExt}`.toLowerCase();


                        // 构造上传请求
                        try {
                            // 获取当前页面URL
                            const currentUrl = window.location.origin;
                            const uploadUrl = `${currentUrl}/u`;

                            // 获取JWT
                            const jwt = document.cookie.split('; ')
                                .find(row => row.startsWith('jwt='))
                                ?.split('=')[1];

                            if (!jwt) {
                                console.error('未找到JWT token');
                                return;
                            }

                            // 构造FormData
                            const formData = new FormData();
                            formData.append('mediaUpload', JSON.stringify({folderId: 0}));
                            formData.append('mediaUpload', file, newFileName);

                            // 发送上传请求
                            const response = await fetch(uploadUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${jwt}`
                                },
                                body: formData
                            });

                            // 检查响应状态
                            if (response.ok) {
                                console.log('图片上传成功');
                                // 插入Markdown图片语法
                                const markdownText = `![${newFileName}](/${newFileName})`;
                                document.execCommand('insertText', false, markdownText);
                            } else {
                                console.error('图片上传失败:', response.status);
                            }
                        } catch (error) {
                            console.error('上传错误:', error);
                        }
                    }
                }
            });
    }

    // 生成8位随机字符串
    function generateShortRandomId() {
        return Math.random().toString(36).substring(2, 10);
    }


})();