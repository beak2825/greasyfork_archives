// ==UserScript==
// @name         Tldraw Chinese Font Support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为Tldraw添加中文字体支持，自动监听字体变化
// @author       Your Name
// @match        https://www.tldraw.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521205/Tldraw%20Chinese%20Font%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/521205/Tldraw%20Chinese%20Font%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加字体样式
    // 四种字体：draw : 手写字体
    // sans : 无衬线字体，与中文的黑体对应
    // serif : 衬线字体，与中文的宋体对应
    // mono : 等宽字体，与中文的等宽字体对应
    const fontStyles = `
        [data-font="draw"] {
            font-family: "字语青梅硬笔", "LXGW WenKai", cursive !important;
        }
        [data-font="sans"] {
            font-family: "仓耳玄三01简繁", "PingFang SC", sans-serif !important;
        }
        [data-font="serif"] {
            font-family: "FZYouSongS 509R", "宋体", "STSong", serif !important;
        }
        [data-font="mono"] {
            font-family: "等距更纱黑体 SC" "LXGW WenKai Mono", "Source Han Mono SC", monospace !important;
        }
    `;

    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = fontStyles;
    document.head.appendChild(styleElement);

    // 创建 MutationObserver 来监听属性变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-font') {
                const element = mutation.target;
                const fontType = element.getAttribute('data-font');
                console.log('Font changed to:', fontType);
            }
        });
    });

    // 监听配置
    const observerConfig = {
        attributes: true,
        attributeFilter: ['data-font'],
        subtree: true
    };

    // 等待页面加载完成后开始监听
    window.addEventListener('load', () => {
        // 开始监听整个文档
        observer.observe(document.body, observerConfig);
        console.log('Chinese font support enabled');
    });
})();