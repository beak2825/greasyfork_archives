// ==UserScript==
// @name         去除QQ直接打开链接提示已停止访问该网页
// @namespace    https://space.bilibili.com/438144654?spm_id_from=333.1007.0.0
// @version      V1.2
// @description  当使用QQ客户端直接打开别人发送的链接时跳转浏览器打开会被QQ拦截提示网页停止访问，开启后自动跳转访问目标URL
// @author       我大E了啊
// @license      GNU GPLv3
// @match        *://c.pc.qq.com/*
// @icon         https://www.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539358/%E5%8E%BB%E9%99%A4QQ%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/539358/%E5%8E%BB%E9%99%A4QQ%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = new URL(window.location.href);
    const targetUrlParam = currentUrl.searchParams.get('url');

    if (targetUrlParam) {
        // 解码URL（处理 %2F 等编码字符）
        let decodedUrl = decodeURIComponent(targetUrlParam);

        if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
            if (decodedUrl.endsWith('/')) {
                decodedUrl = decodedUrl.slice(0, -1);
            }
            console.log(`Bypassing QQ redirect, going to: ${decodedUrl}`);
            window.location.replace(decodedUrl);
        }
    }
})();