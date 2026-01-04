// ==UserScript==
// @name         NovelAI 翻译工具 CORS 支持
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为 NovelAI 图片解析器启用腾讯云和百度翻译 API 跨域支持
// @author       夏影
// @match        https://toys.senriakane.com/novelai-prompt-reader/*
// @match        *://*/*novelai*prompt*reader*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @homepage     https://github.com/Natsukage/novelai-prompt-reader
// @downloadURL https://update.greasyfork.org/scripts/541542/NovelAI%20%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7%20CORS%20%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/541542/NovelAI%20%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7%20CORS%20%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CORS 支持脚本已加载

    // 需要代理的翻译API域名
    const TRANSLATION_APIS = [
        'tmt.tencentcloudapi.com',      // 腾讯云翻译
        'fanyi-api.baidu.com'           // 百度翻译
    ];

    // 检查URL是否是翻译API
    function isTranslationAPI(url) {
        try {
            const urlObj = new URL(url);
            return TRANSLATION_APIS.some(api => urlObj.hostname === api);
        } catch (e) {
            return false;
        }
    }

    // 将Headers对象转换为普通对象
    function headersToObject(headers) {
        const result = {};
        if (headers instanceof Headers) {
            for (const [key, value] of headers.entries()) {
                result[key] = value;
            }
        } else if (headers && typeof headers === 'object') {
            Object.assign(result, headers);
        }
        return result;
    }

    // 使用GM_xmlhttpRequest发送请求
    function makeGMRequest(url, options) {
        return new Promise((resolve, reject) => {
            const headers = headersToObject(options.headers || {});

            // 构建GM_xmlhttpRequest参数
            const gmOptions = {
                method: options.method || 'GET',
                url: url,
                headers: headers,
                data: options.body,
                timeout: 30000,
                onload: function (response) {
                    // 创建Response-like对象
                    const responseObj = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        headers: new Headers(),
                        text: () => Promise.resolve(response.responseText),
                        json: () => {
                            try {
                                return Promise.resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                return Promise.reject(new Error('Invalid JSON response'));
                            }
                        }
                    };

                    // 解析响应头
                    if (response.responseHeaders) {
                        response.responseHeaders.split('\r\n').forEach(header => {
                            const parts = header.split(': ');
                            if (parts.length === 2) {
                                responseObj.headers.set(parts[0], parts[1]);
                            }
                        });
                    }

                    resolve(responseObj);
                },
                onerror: function (error) {
                    reject(new Error(`网络请求失败: ${error.error || '未知错误'}`));
                },
                ontimeout: function () {
                    reject(new Error('请求超时'));
                }
            };

            GM_xmlhttpRequest(gmOptions);
        });
    }

    // 拦截并代理fetch请求
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url, options = {}) {
        const urlString = url.toString();

        // 检查是否是翻译API请求
        if (isTranslationAPI(urlString)) {
            return makeGMRequest(urlString, options);
        }

        // 对于非翻译API请求，使用原始fetch
        return originalFetch.apply(this, arguments);
    };

    // 为了确保脚本在页面加载完成后也能工作，监听DOM变化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            // CORS 支持已就绪
        });
    }

    // 添加页面通知
    function showNotification() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showNotification);
            return;
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                max-width: 300px;
                transition: all 0.3s ease;
            " id="corsNotification">
                ✅ CORS 支持已启用<br>
                <small style="opacity: 0.9;">腾讯云和百度翻译可正常使用</small>
            </div>
        `;

        document.body.appendChild(notification);

        // 3秒后自动隐藏
        setTimeout(() => {
            const elem = document.getElementById('corsNotification');
            if (elem) {
                elem.style.opacity = '0';
                elem.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                    }
                }, 300);
            }
        }, 3000);
    }

    // 显示通知
    showNotification();

    // 添加全局标识，表示CORS支持已启用
    unsafeWindow.NOVELAI_CORS_ENABLED = true;

})();