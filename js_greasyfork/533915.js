// ==UserScript==
// @name         DIC Music 封面自动转存图床
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  将封面链接输入框中的其它图床链接转存替换为海豚官方图床
// @author       YourName
// @match        https://dicmusic.com/upload.php
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      dicmusic.com
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533915/DIC%20Music%20%E5%B0%81%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%AD%98%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/533915/DIC%20Music%20%E5%B0%81%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%AD%98%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        maxRetries: 3,          // 最大重试次数
        retryDelay: 1000,       // 重试延迟(毫秒)
        debounceTime: 500,      // 防抖时间(毫秒)
        observerTimeout: 5000,   // 观察者超时时间(毫秒)
        checkInterval: 1000      // 检查元素间隔(毫秒)
    };

    // 调试日志函数
    function debugLog(...args) {
        const timestamp = new Date().toISOString();
        const logMessage = `[DIC转存][${timestamp}] ` + args.join(' ');
        GM_log(logMessage);
        console.log(logMessage);
    }

    // 错误日志函数
    function errorLog(...args) {
        const timestamp = new Date().toISOString();
        const errorMessage = `[DIC转存-ERROR][${timestamp}] ` + args.join(' ');
        GM_log(errorMessage);
        console.error(errorMessage);
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 重试机制
    async function withRetry(fn, retries = CONFIG.maxRetries, delay = CONFIG.retryDelay) {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0) throw error;
            debugLog(`操作失败，剩余重试次数: ${retries}，错误:`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 1.5); // 指数退避
        }
    }

    // 显示通知
    function showNotification(title, text, isError = false) {
        try {
            GM_notification({
                title: title,
                text: text,
                timeout: 3000,
                highlight: true
            });
        } catch (e) {
            errorLog('显示通知失败:', e.message);
        }
    }

    // 检查URL是否有效
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 获取文件扩展名
    function getFileExtension(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const lastDotIndex = pathname.lastIndexOf('.');
            if (lastDotIndex === -1) return '.jpg';
            return pathname.substring(lastDotIndex);
        } catch (e) {
            return '.jpg';
        }
    }

    // 下载图片并上传到官方图床
    function downloadAndUploadImage(url) {
        return new Promise((resolve, reject) => {
            debugLog('开始下载图片:', url);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        debugLog('图片下载成功');
                        const blob = response.response;
                        const fileName = 'cover_' + Date.now() + getFileExtension(url);
                        const file = new File([blob], fileName, { type: blob.type });

                        uploadToDIC(file)
                            .then(url => resolve(url))
                            .catch(error => reject(error));
                    } else {
                        reject(new Error(`下载失败: HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('图片下载失败: ' + error.statusText));
                },
                ontimeout: function() {
                    reject(new Error('图片下载超时'));
                }
            });
        });
    }

    // 上传到DIC图床
    function uploadToDIC(file) {
        return new Promise((resolve, reject) => {
            debugLog('开始上传文件:', file.name);

            const authKey = document.querySelector('input[name="auth"]')?.value;
            if (!authKey) {
                return reject(new Error('无法获取认证信息'));
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('auth', authKey);

            debugLog('准备发送上传请求...');

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://dicmusic.com/upload.php?action=imgupload',
                data: formData,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    debugLog('收到上传响应:', response.status, response.responseText);

                    try {
                        const json = JSON.parse(response.responseText);

                        if (json.name) {
                            const imageUrl = json.name.replace(/\\\//g, '/');
                            debugLog('获取到图片URL:', imageUrl);
                            resolve(imageUrl);
                        } else if (json.msg) {
                            reject(new Error(json.msg));
                        } else {
                            reject(new Error('响应中未找到图片URL'));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('上传请求失败: ' + error.statusText));
                },
                ontimeout: function() {
                    reject(new Error('上传请求超时'));
                }
            });
        });
    }

    // 创建转存按钮
    function createTransferButton(uploadButton) {
        const transferButton = document.createElement('input');
        transferButton.type = 'button';
        transferButton.value = '自动转存图床';
        transferButton.className = 'dic-transfer-button'; // 添加类名以便查找
        transferButton.style.marginLeft = '5px';

        // 使用防抖和重试机制包装点击事件
        transferButton.onclick = debounce(function() {
            withRetry(() => {
                const imageInput = document.getElementById('image');
                if (!imageInput) {
                    throw new Error('找不到封面输入框');
                }

                const imageUrl = imageInput.value.trim();
                if (!imageUrl) {
                    showNotification('提示', '请先输入封面链接');
                    return Promise.resolve();
                }

                if (!isValidUrl(imageUrl)) {
                    showNotification('错误', '请输入有效的图片URL', true);
                    return Promise.resolve();
                }

                debugLog('开始转存图片:', imageUrl);

                // 显示处理中提示
                const originalButtonText = transferButton.value;
                transferButton.value = '处理中...';
                transferButton.disabled = true;

                return downloadAndUploadImage(imageUrl)
                    .then(newUrl => {
                        debugLog('转存成功，新URL:', newUrl);
                        imageInput.value = newUrl;
                        showNotification('转存成功', '封面已自动转存到官方图床');
                    })
                    .catch(error => {
                        errorLog('转存失败:', error.message);
                        showNotification('转存失败', error.message || '转存过程中出错', true);
                        throw error; // 继续传播错误以便重试
                    })
                    .finally(() => {
                        transferButton.value = originalButtonText;
                        transferButton.disabled = false;
                    });
            }).catch(finalError => {
                errorLog('所有重试尝试失败:', finalError.message);
            });
        }, CONFIG.debounceTime);

        return transferButton;
    }

    // 确保按钮存在
    function ensureButtonExists() {
        // 检查是否已经存在我们的按钮
        const existingButton = document.querySelector('.dic-transfer-button');
        if (existingButton) {
            debugLog('转存按钮已存在');
            return;
        }

        // 查找上传按钮
        const uploadButton = document.querySelector('input[onclick="imgUpload()"]');
        if (!uploadButton) {
            debugLog('未找到上传按钮，等待下次检查');
            return;
        }

        // 创建并插入转存按钮
        const transferButton = createTransferButton(uploadButton);
        uploadButton.parentNode.insertBefore(transferButton, uploadButton.nextSibling);
        debugLog('转存按钮已添加');
    }

    // 主初始化函数
    function init() {
        debugLog('脚本初始化开始');

        // 立即尝试添加按钮
        ensureButtonExists();

        // 设置MutationObserver监控DOM变化
        const observer = new MutationObserver(debounce(() => {
            debugLog('检测到DOM变化，重新检查按钮');
            ensureButtonExists();
        }, 300));

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 设置定期检查的定时器作为后备
        const checkInterval = setInterval(ensureButtonExists, CONFIG.checkInterval);

        // 5秒后检查一次作为额外保障
        setTimeout(ensureButtonExists, 5000);

        debugLog('脚本初始化完成');
    }

    // 启动脚本
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 0);
    } else {
        window.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }
})();