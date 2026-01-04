// ==UserScript==
// @name               Discord Token 登录 (点击触发)
// @description        使用 Discord token 登录 (需点击按钮)
// @author             追风
// @version            1.0
// @license            MIT
// @namespace          http://tampermonkey.net/
// @match              *://*.discord.com/login
// @match              *://*.discord.com/channels/*
// @icon               https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @downloadURL https://update.greasyfork.org/scripts/530814/Discord%20Token%20%E7%99%BB%E5%BD%95%20%28%E7%82%B9%E5%87%BB%E8%A7%A6%E5%8F%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530814/Discord%20Token%20%E7%99%BB%E5%BD%95%20%28%E7%82%B9%E5%87%BB%E8%A7%A6%E5%8F%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建一个按钮，添加到Discord页面
    function createTokenLoginButton() {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = 'Token 登录';
        button.id = 'token-login-button';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#5865F2'; // Discord蓝色
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        // 鼠标悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#4752C4'; // 深一点的Discord蓝色
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#5865F2';
        };
        
        // 点击按钮时才执行token登录流程
        button.addEventListener('click', function() {
            // 弹出提示框请求输入token
            const token = prompt("请输入您的Discord token:", "");
            
            // 如果用户输入了token，则执行登录
            if (token) {
                loginWithToken(token);
            }
        });
        
        // 添加按钮到页面
        document.body.appendChild(button);
    }
    
    // 处理token登录的函数
    function loginWithToken(token) {
        // 创建一个iframe来设置localStorage
        const iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.contentWindow.localStorage.token = '"' + token + '"';
        
        // 1秒后重定向到Discord应用
        setTimeout(() => {
            location.href = "/app";
        }, 1000);
    }
    
    // 等待页面加载完成后添加按钮
    window.addEventListener('load', function() {
        // 稍微延迟添加按钮，确保页面元素都已加载
        setTimeout(createTokenLoginButton, 1000);
    });
})();