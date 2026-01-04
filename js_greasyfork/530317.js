// ==UserScript==
// @name         YYETS Auto Captcha
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用ddddOCR自动识别验证码
// @author       Ano_via
// @match        https://yyets.click/*
// @grant        GM_xmlhttpRequest
// @license      Private (Personal Use Only)
// @downloadURL https://update.greasyfork.org/scripts/530317/YYETS%20Auto%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/530317/YYETS%20Auto%20Captcha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标验证码图片和输入框的选择器，根据实际情况修改
    const CAPTCHA_IMG_SELECTOR = 'img[alt="验证码"]';
    const CAPTCHA_INPUT_SELECTOR = '[name="captcha"]';

    // 识别验证码函数
    function recognizeCaptcha(imgUrl, input) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: imgUrl,
            responseType: 'blob',
            onload: function(response) {
                const blob = response.response;
                const formData = new FormData();
                formData.append('image', blob, 'captcha.png');

                fetch('https://2fa.work.gd:5000/ocr', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {
                            if (input) {
                                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, data.result);
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                console.log('验证码已自动填入:', data.result);
                            }
                        }
                    })
                    .catch(error => console.error('识别失败:', error));
            },
            onerror: function(error) {
                console.error('图片下载失败:', error);
            }
        });
    }

    // 处理验证码图片变化
    function handleCaptchaChange() {
        const imgs = document.querySelectorAll(CAPTCHA_IMG_SELECTOR);
        imgs.forEach(img => {
            const input = img.closest('form')?.querySelector(CAPTCHA_INPUT_SELECTOR);
            if (img && input && !img.dataset.checked) {
                img.dataset.checked = 'true';  // 标记此图片已处理
                recognizeCaptcha(img.src, input);
            }
        });
    }

    // 监控验证码图片的 src 属性变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const img = mutation.target;
                const input = img.closest('form')?.querySelector(CAPTCHA_INPUT_SELECTOR);
                if (img && input) {
                    img.dataset.checked = 'false';  // 重置已处理标记
                    recognizeCaptcha(img.src, input);
                }
            }
        });
    });

    // 初始化识别，启动定时器每秒执行一次
    window.addEventListener('load', function() {
        handleCaptchaChange();  // 页面加载时先执行一次
        setInterval(handleCaptchaChange, 1000);  // 每秒执行一次

        // 启动观察验证码图片的 src 属性变化
        const imgs = document.querySelectorAll(CAPTCHA_IMG_SELECTOR);
        imgs.forEach(img => {
            observer.observe(img, { attributes: true, attributeFilter: ['src'] });
        });
    });
})();
