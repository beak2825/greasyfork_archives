// ==UserScript==
// @name         Auto Replace CAPTCHA Text
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tự động thay thế bất kỳ văn bản CAPTCHA nào thành "Bạn không phải Ngọc Thành"
// @author       duong030909
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534346/Auto%20Replace%20CAPTCHA%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/534346/Auto%20Replace%20CAPTCHA%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Các từ khóa CAPTCHA cần dò
    const captchaKeywords = [
        'captcha',
        "I'm not a robot",
        'I am not a robot',
        'xác minh',
        'robot'
    ];

    const replacementText = "Bạn không phải Ngọc Thành";

    function replaceCaptchaText() {
        const elements = document.querySelectorAll('body *');
        elements.forEach(el => {
            if (el.children.length === 0 && el.innerText.trim() !== "") {
                const text = el.innerText.toLowerCase();
                if (captchaKeywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                    el.innerText = replacementText;
                }
            }
        });
    }

    replaceCaptchaText();

    const observer = new MutationObserver(replaceCaptchaText);
    observer.observe(document.body, { childList: true, subtree: true });
})();
