// ==UserScript==
// @name         OAIFree Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动判断AT是否过期，如果过期则重新获取，并自动跳转登陆，同时在控制台打印日志输出
// @author       You
// @match        https://new.oaifree.com/auth/login_auth0
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      token.oaifree.com
// @connect      chat.openai.com
// @connect      chatgpt.com
// @license      MLT
// @downloadURL https://update.greasyfork.org/scripts/503037/OAIFree%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/503037/OAIFree%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查 at 是否过期
    function isATExpired() {
        const expireAt = GM_getValue('expire_at', 0);
        console.log("Access Token expire at: "+ expireAt )
        return isNaN(expireAt) || Date.now() >= expireAt;
    }

    // 获取 at
    function getAccessToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://chat.openai.com/api/auth/session',
                onload: function(response) {
                    console.log(response.responseText)
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.accessToken) {
                            const accessToken = data.accessToken
                            const expireAt = new Date(data.expires).getTime()
                            GM_setValue("access_token", accessToken)
                            GM_setValue("expire_at", expireAt)
                            resolve(accessToken)
                        } else {
                            reject('Failed to get Access Token, response: ' + data);
                        }
                    } else {
                        reject('Failed to refresh Access Token');
                    }
                },
                onerror: function(e) {
                    console.error(e)
                    reject('Failed to refresh Access Token');
                }
            });
        });
    }

    // 自动登录
    function autoLogin(accessToken) {
        GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://new.oaifree.com/auth/login_token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: `action=token&access_token=${accessToken}`,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.code == 0) {
                            window.location.href = 'https://new.oaifree.com'
                        } else {
                            console.log('Access Token login failed.');
                        }
                    }
                },
                onerror: function(e) {
                    console.error(e)
                }
            });
    }

    (async function() {
        try {
            let accessToken = GM_getValue('access_token', 0);
            if (isATExpired()) {
                console.log('Access Token is expired. Refreshing tokens...');
                accessToken = await getAccessToken();
                console.log('Access Token obtained: ' + accessToken);
            } else {
                console.log('Access Token is still valid.');
            }
            autoLogin(accessToken);
        } catch (error) {
            console.error(error);
        }
    })();
})();