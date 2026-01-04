// ==UserScript==
// @name         安徽高考分数录取查询验证码自动填写
// @namespace    http://tampermonkey.net/
// @version      2025-07-24
// @description  一生使用一次的脚本qwq
// @author       pttsrd
// @match        https://cx.ahzsks.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543555/%E5%AE%89%E5%BE%BD%E9%AB%98%E8%80%83%E5%88%86%E6%95%B0%E5%BD%95%E5%8F%96%E6%9F%A5%E8%AF%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/543555/%E5%AE%89%E5%BE%BD%E9%AB%98%E8%80%83%E5%88%86%E6%95%B0%E5%BD%95%E5%8F%96%E6%9F%A5%E8%AF%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动填写验证码


    function autofillCaptchaWithRetry(maxRetry = 20, interval = 300) {
        let tryCount = 0;
        function tryFill() {
            tryCount++;
            console.log('[验证码脚本] 第' + tryCount + '次尝试');
            const yzmInput = document.getElementById('yzm');
            if (!yzmInput) {
                console.log('[验证码脚本] 未找到输入框, 第' + tryCount + '次');
                if (tryCount < maxRetry) setTimeout(tryFill, interval);
                return;
            }
            const rightDivs = document.getElementsByClassName('right');
            let found = false;
            for (let i = 0; i < rightDivs.length; i++) {
                const input = rightDivs[i].querySelector('input#yzm');
                if (input) {
                    let node = input.nextSibling;
                    while (node && node.nodeType !== 3) {
                        node = node.nextSibling;
                    }
                    if (node) {
                        const captcha = node.textContent.trim();
                        console.log('[验证码脚本] 检测到验证码文本:', captcha);
                        if (/^\d{4}$/.test(captcha)) {
                            yzmInput.value = captcha;
                            console.log('[验证码脚本] 已自动填写验证码:', captcha);
                            found = true;
                        }
                    }
                    break;
                }
            }
            if (!found && tryCount < maxRetry) {
                setTimeout(tryFill, interval);
            } else if (!found) {
                console.log('[验证码脚本] 未能自动填写验证码');
            }
        }
        tryFill();
    }

    // 页面加载后自动执行，使用更稳健的方式
    window.addEventListener('load', function() {
        autofillCaptchaWithRetry();
    });
})();