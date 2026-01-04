// ==UserScript==
// @name         E站里站授权登录 - GitHub OAuth 回调处理
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  处理 GitHub OAuth 回调
// @author       牛子哥
// @match        https://exhentai.org/callback*
// @grant        GM_xmlhttpRequest
// @connect      github.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520316/E%E7%AB%99%E9%87%8C%E7%AB%99%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%20-%20GitHub%20OAuth%20%E5%9B%9E%E8%B0%83%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/520316/E%E7%AB%99%E9%87%8C%E7%AB%99%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%20-%20GitHub%20OAuth%20%E5%9B%9E%E8%B0%83%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 处理回调
    async function handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code && state) {
            try {
                const clientId = localStorage.getItem('github_client_id');
                const clientSecret = localStorage.getItem('github_client_secret');
                const savedState = localStorage.getItem('oauth_state');

                if (state !== savedState) {
                    throw new Error('状态不匹配，可能存在安全风险');
                }

                // 使用 GM_xmlhttpRequest 获取访问令牌
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://github.com/login/oauth/access_token',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: code,
                        state: state
                    }),
                    onload: function (response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.access_token) {
                                // 将令牌发送回主页面
                                window.opener.postMessage({
                                    type: 'github_oauth_success',
                                    token: data.access_token
                                }, 'https://exhentai.org');

                                // 关闭回调窗口
                                window.close();
                            } else {
                                throw new Error('获取访问令牌失败');
                            }
                        } catch (error) {
                            showError(error.message);
                        }
                    },
                    onerror: function (error) {
                        showError('请求失败: ' + error.error);
                    }
                });
            } catch (error) {
                showError(error.message);
            }
        }
    }

    function showError(message) {
        console.error('OAuth 回调处理错误:', message);
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.9);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            ">
                <h3 style="color: #ff3b30;">授权失败</h3>
                <p style="color: #666;">${message}</p>
                <button onclick="window.close()" style="
                    padding: 8px 16px;
                    background: #007aff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">关闭窗口</button>
            </div>
        `;
    }

    // 页面加载完成后处理回调
    handleCallback();
})(); 