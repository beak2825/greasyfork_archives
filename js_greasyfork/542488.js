// ==UserScript==
// @name         JW.ORG VTT 链接处理与跳转
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动监控、复制 VTT 链接，并提供在新标签页跳转到指定链接的选项。
// @author       Gemini
// @match        *://*.jw.org/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542488/JWORG%20VTT%20%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86%E4%B8%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542488/JWORG%20VTT%20%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86%E4%B8%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户在这里指定一个链接。脚本将询问是否跳转到此链接。
    const userSpecifiedLink = 'https://subtitle-extractor-53534823510.europe-west1.run.app/'; // 在这里输入你想要跳转的链接

    // 该变量用于存储脚本自动从网络请求中找到的 VTT 链接。
    let foundVttLink = null;

    // 保存原始的 XMLHttpRequest.prototype.open 方法
    const originalOpen = XMLHttpRequest.prototype.open;

    // 覆盖 XMLHttpRequest.prototype.open，以直接在主程序中拦截所有 XHR 请求
    XMLHttpRequest.prototype.open = function(method, url) {
        // 检查 URL 是否以 ".vtt" 结尾（不区分大小写）
        if (typeof url === 'string' && url.toLowerCase().endsWith('.vtt')) {
            console.log('✅ 检测到 VTT 文件链接: ' + url);
            foundVttLink = url;

            // 将找到的链接复制到剪切板
            GM_setClipboard(foundVttLink, 'text');
            console.log('📋 链接已成功复制到剪切板。');

            // 如果用户指定了跳转链接，则弹出确认窗口
            if (userSpecifiedLink) {
                const isConfirmed = window.confirm(
                    '检测到 VTT 文件链接: \n' + url +'\n\n是否跳转到您指定的链接？\n' + userSpecifiedLink
                );

                if (isConfirmed) {
                    // 在新标签页中打开链接
                    window.open(userSpecifiedLink, '_blank');
                }
            }
        }

        // 调用原始方法，确保请求正常发送
        originalOpen.apply(this, arguments);
    };

})();