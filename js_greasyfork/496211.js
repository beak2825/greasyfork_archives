// ==UserScript==
// @name         一件复制lilishop项目token
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  获取lilishop accessToken
// @author       RyanRan
// @match        *://*.pickmall.cn/*
// @match        *://*.dllll.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496211/%E4%B8%80%E4%BB%B6%E5%A4%8D%E5%88%B6lilishop%E9%A1%B9%E7%9B%AEtoken.user.js
// @updateURL https://update.greasyfork.org/scripts/496211/%E4%B8%80%E4%BB%B6%E5%A4%8D%E5%88%B6lilishop%E9%A1%B9%E7%9B%AEtoken.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建按钮元素
    const button = document.createElement('button');
    button.innerText = 'Copy AccessToken';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    // 点击按钮时复制 accessToken 到剪贴板
    button.addEventListener('click', () => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            // 创建一个临时的 textarea 元素来复制文本
            const textarea = document.createElement('textarea');
            textarea.value = accessToken;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            button.innerText = 'Copy success';
            button.style.backgroundColor = 'green';
            setTimeout(()=>{
                button.innerText = 'Copy AccessToken';
                button.style.backgroundColor = '#007BFF';
            },3000)

            console.log('AccessToken 已复制到剪贴板');
        } else {
            console.log('AccessToken 未找到');
        }
    });
})();