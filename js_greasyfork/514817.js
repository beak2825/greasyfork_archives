// ==UserScript==
// @name         复制 Cookie
// @namespace    http://tampermonkey.net/
// @match        https://www.kuafuzys.com/*
// @match        https://bbs.52huahua.cc/*
// @match        https://www.kuafuzy.com/*
// @version      1.0.1
// @description  添加一个按钮点击后复制当前页面的 Cookie 信息到剪切板（兼容写法）
// @author       PYY
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514817/%E5%A4%8D%E5%88%B6%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/514817/%E5%A4%8D%E5%88%B6%20Cookie.meta.js
// ==/UserScript==

    (function () {
        'use strict';

        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '📋 复制 Cookie';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 14px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        button.style.fontSize = '14px';

        document.body.appendChild(button);

        button.addEventListener('click', () => {
            const cookie = document.cookie;
            if (!cookie) {
                alert('⚠️ 当前页面没有 Cookie 可复制');
                return;
            }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(cookie).then(() => {
                    alert('✅ Cookie 已复制到剪切板！');
                    console.log('[Cookie]', cookie);
                }).catch(err => {
                    console.error('❌ 复制失败：', err);
                    alert('❌ 无法复制 Cookie（权限问题）');
                });
            } else {
                // fallback 写法
                const textarea = document.createElement('textarea');
                textarea.value = cookie;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    const success = document.execCommand('copy');
                    alert(success ? '✅ Cookie 已复制（兼容方式）' : '❌ 复制失败');
                } catch (err) {
                    console.error('复制异常：', err);
                    alert('❌ 复制失败（异常）');
                }
                document.body.removeChild(textarea);
            }
        });
    })();
