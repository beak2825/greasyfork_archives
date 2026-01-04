// ==UserScript==
// @name        打开NestJs中文文档
// @namespace   Violentmonkey Scripts
// @match       https://docs.nestjs.com/*
// @grant       none
// @version     1.0
// @author      Liao Brant
// @description 从nestjs英文文档一键打开中文文档
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/529353/%E6%89%93%E5%BC%80NestJs%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/529353/%E6%89%93%E5%BC%80NestJs%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 配置参数（按需修改）
    const CONFIG = {
        targetDomain: "nest.nodejs.cn",  // 需要切换的目标域名
        buttonColor: "#2196F3",          // 按钮背景颜色
        buttonSize: 40,                  // 按钮尺寸（像素）
        buttonText: "↗",                 // 按钮显示文本
        topOffset: '15px',
        leftOffset: '15px'
    };

    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        .domain-switcher-btn {
            position: fixed;
            left: ${CONFIG.leftOffset};
            top: ${CONFIG.topOffset};
            width: ${CONFIG.buttonSize}px;
            height: ${CONFIG.buttonSize}px;
            border-radius: 50%;
            background-color: ${CONFIG.buttonColor};
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10000;
            font-size: ${CONFIG.buttonSize * 0.6}px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: transform 0.2s, opacity 0.2s;
        }
        .domain-switcher-btn:hover {
            transform: scale(1.1);
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);

    // 创建按钮元素
    const button = document.createElement('button');
    button.className = 'domain-switcher-btn';
    button.title = "在新标签页打开修改域名后的页面";
    button.textContent = CONFIG.buttonText;

    // 添加点击事件处理
    button.addEventListener('click', function() {
        try {
            const currentUrl = new URL(window.location.href);

            // 修改域名并保持其他部分不变
            currentUrl.hostname = CONFIG.targetDomain;

            // 打开新标签页（注意：可能会被浏览器弹出拦截器阻止）
            window.open(currentUrl.href, '_blank');
        } catch (error) {
            console.error('域名切换失败:', error);
        }
    });

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 确保按钮在页面加载完成后可见
    window.addEventListener('load', () => {
        button.style.display = 'block';
    });
})();