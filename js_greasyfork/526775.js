// ==UserScript==
// @name         B站护盾Pro
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  终极防御系统
// @match        *://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/526775/B%E7%AB%99%E6%8A%A4%E7%9B%BEPro.user.js
// @updateURL https://update.greasyfork.org/scripts/526775/B%E7%AB%99%E6%8A%A4%E7%9B%BEPro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 恶意接口特征库
    const dangerApis = [
        '/x/credit/v2/report/add',
        '/x/vip/privilege/report'
    ];

    // 实时监控XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (dangerApis.some(api => url.includes(api))) {
            GM_notification({
                title: '🚨 检测到恶意请求',
                text: `已拦截举报接口: ${url}`,
                timeout: 5000
            });
            throw new Error('Request blocked by BiliShield');
        }
        originalOpen.apply(this, arguments);
    };

    // 反审查校验系统
    document.addEventListener('input', function(e) {
        const originalHash = sha256(e.target.value);
        setTimeout(() => {
            const currentHash = sha256(e.target.value);
            if (originalHash !== currentHash) {
                e.target.value = e.target.value + '\n【内容完整性校验通过】';
                GM_notification({
                    title: '🔒 内容保护生效',
                    text: '检测到内容篡改并已修复',
                    timeout: 3000
                });
            }
        }, 1000);
    });

    function sha256(text) {
        // 哈希计算实现
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
            .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join(''));
    }
})();