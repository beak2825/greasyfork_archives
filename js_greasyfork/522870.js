// ==UserScript==
// @name         Base64 自动检测与跳转
// @version      1.0
// @description  检测页面中的 Base64 内容，当复制时自动解码并跳转到目标 URL。
// @source        https://github.com/Phinsin666/Base64-Automatic
// @author       Phinsin666
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/385149
// @downloadURL https://update.greasyfork.org/scripts/522870/Base64%20%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E4%B8%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522870/Base64%20%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E4%B8%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 监听页面的 "copy" 事件
    document.addEventListener('copy', function (event) {
        // 从剪贴板中获取用户复制的文本
        const copiedText = window.getSelection().toString().trim();

        if (copiedText) {
            try {
                // 尝试将复制的文本作为 Base64 解码
                const decodedText = atob(copiedText);

                // 检查解码后的内容是否为有效的 URL
                if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
                    console.log('检测到有效的 Base64 编码 URL:', decodedText);

                    // 自动跳转到目标地址
                    window.location.href = decodedText;
                } else {
                    console.warn('解码后的内容不是有效的 URL:', decodedText);
                }
            } catch (error) {
                console.error('复制的文本不是有效的 Base64 编码:', error);
            }
        }
    });
})();
