// ==UserScript==
// @license MIT
// @name         网页安全检查
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检查网页是否安全，如不安全则提示用户
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480954/%E7%BD%91%E9%A1%B5%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/480954/%E7%BD%91%E9%A1%B5%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'YOUR_GOOGLE_SAFE_BROWSING_API_KEY';  // 替换为你的 Google Safe Browsing API 密钥

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 发送请求到 Google Safe Browsing API
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            client: {
                clientId: 'YourClientId',
                clientVersion: '1.0',
            },
            threatInfo: {
                threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                platformTypes: ['ANY_PLATFORM'],
                threatEntryTypes: ['URL'],
                threatEntries: [{ url: currentUrl }],
            },
        }),
        onload: function(response) {
            const result = JSON.parse(response.responseText);

            if (result.matches && result.matches.length > 0) {
                // 如果存在威胁匹配，则认为网页不安全，弹出提示框
                const confirmUnsafe = confirm('此网站可能存在安全风险，是否确认进入？');

                if (!confirmUnsafe) {
                    // 用户选择取消，则重定向到安全页面（可根据需要修改）
                    window.location.href = 'https://www.google.com/';
                }
            }
        },
    });

})();
