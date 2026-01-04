// ==UserScript==
// @name         OAIFree RefreshTokens登录
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  支持多个refresh token，用户可随时选择token并自动登录，方便切换账号
// @author       You
// @license      Liunx.do
// @match        https://new.oaifree.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      token.oaifree.com
// @connect      chat.oaifree.com
// @downloadURL https://update.greasyfork.org/scripts/513613/OAIFree%20RefreshTokens%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/513613/OAIFree%20RefreshTokens%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 预设的多个refresh token
    const refreshTokens = [
        'You RefreshTokens',
        // 添加更多的refresh token
    ];

    // 获取当前时间戳
    function getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    // 检查 st 是否过期
    function isSTExpired() {
        const expireAt = GM_getValue('expire_at', 0);
        console.log("st expire at: "+ expireAt);
        return isNaN(expireAt) || getCurrentTimestamp() >= expireAt;
    }

    // 使用 rt 换取 at
    function getAccessToken(refreshToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://token.oaifree.com/api/auth/refresh',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `refresh_token=${refreshToken}`,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if(data.access_token){
                            resolve(data.access_token);
                        }else{
                            reject('Failed to generate access token, response: ' + JSON.stringify(data));
                        }
                    } else {
                        reject('Failed to refresh access token');
                    }
                },
                onerror: function(e) {
                    console.error(e);
                    reject('Failed to refresh access token');
                }
            });
        });
    }

    // 使用 at 生成 st
    function getShareToken(accessToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://chat.oaifree.com/token/register',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: `unique_name=${generateRandomHex(8)}&access_token=${accessToken}&expires_in=0&site_limit=&gpt35_limit=-1&gpt4_limit=-1&show_conversations=true`,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        GM_setValue('expire_at', data.expire_at);
                        if(data.token_key){
                            resolve(data.token_key);
                        }else{
                            reject('Failed to generate share token, response: ' + JSON.stringify(data));
                        }
                    } else {
                        reject('Failed to generate share token');
                    }
                },
                onerror: function(e) {
                    console.error(e);
                    reject('Failed to generate share token');
                }
            });
        });
    }

    // 生成随机字符串
    function generateRandomHex(length) {
        let result = '';
        const characters = '0123456789abcdef';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // 自动登录
    function autoLogin(shareToken) {
        const loginUrl = `https://new.oaifree.com/auth/login_share?token=${shareToken}`;
        console.log('Logging in with URL: ' + loginUrl);
        window.location.href = loginUrl;
    }

    // 选择token并登录
    async function selectTokenAndLogin(index) {
        try {
            const refreshToken = refreshTokens[index];
            console.log('Using refresh token: ' + refreshToken);
            const accessToken = await getAccessToken(refreshToken);
            console.log('Access token obtained: ' + accessToken);
            const shareToken = await getShareToken(accessToken);
            console.log('Share token obtained: ' + shareToken);
            GM_setValue("share_token", shareToken);
            autoLogin(shareToken);
        } catch (error) {
            console.error('Login failed:', error);
            alert('登录失败，请查看控制台获取详细信息。');
        }
    }

    // 为每个token注册菜单命令
    refreshTokens.forEach((token, index) => {
        GM_registerMenuCommand(`切换到 Token ${index + 1}`, () => selectTokenAndLogin(index));
    });

    // 检查是否需要刷新token并自动登录（仅在登录页面执行）
    if (window.location.pathname === '/auth/login_auth0') {
        (async function() {
            try {
                let shareToken = GM_getValue("share_token");
                if (isSTExpired() || !shareToken) {
                    console.log('ST token is expired or not found. Please select a token from the userscript menu to login.');
                } else {
                    console.log('ST token is still valid. Auto-logging in...');
                    autoLogin(shareToken);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }
})();