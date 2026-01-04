// ==UserScript==
// [url=home.php?mod=space&uid=170990]@name[/url]         获取并复制当前页面Cookies
// [url=home.php?mod=space&uid=467642]@namespace[/url]    http://tampermonkey.net/
// [url=home.php?mod=space&uid=1248337]@version[/url]      1.3
// @description  点击按钮获取当前页面的 cookies
// [url=home.php?mod=space&uid=686208]@AuThor[/url]       yagizaMJ
// [url=home.php?mod=space&uid=195849]@match[/url]        *://*/*
// [url=home.php?mod=space&uid=609072]@grant[/url]        none
// @grant        yagizaMJ
// @license      yagizaMJ
// @code         yagizaMJ
// @name    获取并复制当前页面Cookies1.3    
// @match        *://*./*
// @version 0.0.1.20250731162000
// @namespace https://greasyfork.org/users/276180
// @downloadURL https://update.greasyfork.org/scripts/544219/%E8%8E%B7%E5%8F%96%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2Cookies13.user.js
// @updateURL https://update.greasyfork.org/scripts/544219/%E8%8E%B7%E5%8F%96%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2Cookies13.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 创建主按钮
    const button = document.createElement('button');
    button.innerText = '获取 Cookies';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '14px';
 
    // 主按钮点击事件
    button.addEventListener('click', () => {
        const cookies = document.cookie;
 
        // 创建显示框
        const output = document.createElement('pre');
        output.id = 'cookie-output';
        output.style.position = 'fixed';
        output.style.bottom = '100px';
        output.style.right = '20px';
        output.style.zIndex = '9999';
        output.style.backgroundColor = '#fff';
        output.style.border = '1px solid #ccc';
        output.style.padding = '10px';
        output.style.maxWidth = '400px';
        output.style.maxHeight = '200px';
        output.style.overflow = 'auto';
        output.style.fontFamily = 'monospace';
        output.style.fontSize = '12px';
        output.style.whiteSpace = 'pre-wrap';
        output.innerText = cookies || '(无 cookies)';
 
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.innerText = '&#128203; 复制到剪贴板';
        copyButton.disabled = !cookies;
        copyButton.style.position = 'fixed';
        copyButton.style.bottom = '60px';
        copyButton.style.right = '20px';
        copyButton.style.zIndex = '9999';
        copyButton.style.padding = '8px 12px';
        copyButton.style.backgroundColor = cookies ? '#2196F3' : '#ccc';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = cookies ? 'pointer' : 'not-allowed';
        copyButton.style.fontFamily = 'Arial, sans-serif';
        copyButton.style.fontSize = '12px';
 
        // 复制功能
        copyButton.addEventListener('click', () => {
            if (!cookies) return;
 
            navigator.clipboard.writeText(cookies).then(() => {
                // 显示提示信息
                const tip = document.createElement('div');
                tip.innerText = '&#9989; 已复制到剪贴板';
                tip.style.position = 'fixed';
                tip.style.bottom = '240px';
                tip.style.right = '20px';
                tip.style.zIndex = '9999';
                tip.style.backgroundColor = '#333';
                tip.style.color = '#fff';
                tip.style.padding = '8px 12px';
                tip.style.borderRadius = '4px';
                tip.style.fontSize = '12px';
                tip.style.fontFamily = 'Arial, sans-serif';
                tip.style.transition = 'opacity 0.5s';
                document.body.appendChild(tip);
 
                // 2秒后淡出提示
                setTimeout(() => {
                    tip.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(tip)) {
                            document.body.removeChild(tip);
                        }
                    }, 500);
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制 cookies 失败，请重试');
            });
        });
 
        document.body.appendChild(output);
        document.body.appendChild(copyButton);
 
        // 5秒后自动移除元素
        setTimeout(() => {
            if (document.body.contains(output)) document.body.removeChild(output);
            if (document.body.contains(copyButton)) document.body.removeChild(copyButton);
        }, 5000);
    });
 
    // 添加主按钮到页面
    document.body.appendChild(button);
})();