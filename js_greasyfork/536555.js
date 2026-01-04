// ==UserScript==
// @name         获取 Cookie 和 UA（抖音创作者中心）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  仅在 https://creator.douyin.com/ 生效，点击按钮获取 cookie 和 UA
// @author       OpenAI
// @match        https://creator.douyin.com/*
// @grant        none
// @license      GPL-3.0	
// @downloadURL https://update.greasyfork.org/scripts/536555/%E8%8E%B7%E5%8F%96%20Cookie%20%E5%92%8C%20UA%EF%BC%88%E6%8A%96%E9%9F%B3%E5%88%9B%E4%BD%9C%E8%80%85%E4%B8%AD%E5%BF%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536555/%E8%8E%B7%E5%8F%96%20Cookie%20%E5%92%8C%20UA%EF%BC%88%E6%8A%96%E9%9F%B3%E5%88%9B%E4%BD%9C%E8%80%85%E4%B8%AD%E5%BF%83%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '取';

    // 设置样式：顶部居中，尺寸小巧
    Object.assign(button.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '9999',
        padding: '4px 8px',
        fontSize: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    });

    // 控制台输出
    console.log('🍪 Cookie:', cookie);
    console.log('🧭 User-Agent:', ua);
    
    // 组合要复制的文本
    const textToCopy = `{"cookie": "${cookie}", "ua": "${ua}"}`;
    
    // 使用 Clipboard API 复制到剪贴板
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('✅ Cookie 和 UA 已复制到剪贴板!');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('❌ 自动复制失败，请手动复制控制台内容\n(Chrome 需要 HTTPS 才能使用剪贴板API)');
        });

    // 添加到页面
    document.body.appendChild(button);
})();