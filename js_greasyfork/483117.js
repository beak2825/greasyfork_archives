// ==UserScript==
// @name         Captcha Resolver
// @namespace    http://your.namespace/
// @version      0.1
// @description  Resolve captcha and copy result to clipboard
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483117/Captcha%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/483117/Captcha%20Resolver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加右键点击事件监听器
    document.addEventListener('contextmenu', function(event) {
        // 检查是否右键点击了验证码
        if (isCaptcha(event.target)) {
            event.preventDefault(); // 阻止默认右键点击行为
            // 获取验证码图像的 base64 编码
            var captchaImage = event.target.src;
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = function() {
                canvas.width = this.width;
                canvas.height = this.height;
                context.drawImage(this, 0, 0);
                var base64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
                // 调用后端接口进行图像识别
                callBackendAPI(base64);
            };
            image.src = captchaImage;
        }
    });

    // 检查是否右键点击了验证码的函数
    function isCaptcha(element) {
        // 在这里添加识别验证码元素的逻辑，例如根据元素的类名、ID 或其他属性来判断是否为验证码
        // 示例：假设验证码元素有 "captcha" 类名
        return element.classList.contains('captcha');
    }

    // 调用后端接口进行图像识别的函数
    function callBackendAPI(base64Image) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://124.221.112.109:5000/perform_ocr',
            data: JSON.stringify({ image: base64Image }),
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    var result = JSON.parse(response.responseText).result;
                    // 将识别结果复制到剪贴板
                    GM_setClipboard(result, 'text');
                    // 提示用户复制成功
                    GM_notification('验证码结果已复制到剪贴板', 'Notification', 'https://example.com/icon.png');
                } else {
                    console.error('API调用失败', response.statusText);
                    // 提示用户操作失败
                    GM_notification('操作失败，请重试', 'Notification', 'https://example.com/icon.png');
                }
            },
            onerror: function(error) {
                console.error('API调用失败', error);
                // 提示用户操作失败
                GM_notification('操作失败，请重试', 'Notification', 'https://example.com/icon.png');
            }
        });
    }
})();
