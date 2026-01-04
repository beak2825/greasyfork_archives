// ==UserScript==
// @name         google aistudio 聊天界面美化
// @namespace    Bronya0
// @version      2.3
// @description  优化 aistudio.google.com/prompts/new_chat 界面的样式，包括侧边栏、内容宽度、设置面板和字体。左侧禁用点击折叠+右侧虚化+内容缩窄+中文友好字体+去掉鼠标放上去的边框线+淡黄背景
// @author       Bronya0
// @match        https://aistudio.google.com/prompts/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543479/google%20aistudio%20%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/543479/google%20aistudio%20%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义 CSS 样式
    const customCSS = `

.empty-space.clickable {
    pointer-events: none;
}

.settings-items-wrapper, .content-container {
    width: 250px !important;
}

.chat-turn-container {
    border: none !important;
}

.promo-gallery {
    display: none !important;
}


.inline-code{
    background: #ce601c1a !important;
    color: #9e3f00 !important;
    border: 0 !important;
}

.settings-items-wrapper {
    opacity: .5 !important;
}

:root .light-theme{
    --color-gradient-background-top: #f8f7f6 !important;
    --color-gradient-background: #f8f7f6 !important;
    --color-canvas-background: #f8f7f6 !important;
    --color-v3-surface:  #f8f7f6 !important;
}

.light-theme .gmat-body-medium, .light-theme ms-cmark-node blockquote, ms-cmark-node .light-theme blockquote, .light-theme ms-cmark-node div, ms-cmark-node .light-theme div, .light-theme ms-cmark-node dl, ms-cmark-node .light-theme dl, .light-theme ms-cmark-node dt, ms-cmark-node .light-theme dt, .light-theme ms-cmark-node td, ms-cmark-node .light-theme td, .light-theme ms-cmark-node th, ms-cmark-node .light-theme th, .light-theme ms-cmark-node li, ms-cmark-node .light-theme li, .light-theme ms-cmark-node p, ms-cmark-node .light-theme p, .light-theme ms-cmark-node section, ms-cmark-node .light-theme section{
    font-size: 16px !important;
    line-height: 30px !important;
    font-family: "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, "PingFang SC", "Arial", sans-serif !important;
}

.turn-content h3 span, .turn-content h2 span, .turn-content h4 span{
    font-family: "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, "PingFang SC", "Arial", sans-serif !important;
}

code{
    font-family: consolas;
}

    `;

    // 注入 CSS
    GM_addStyle(customCSS);

    // 自动关闭右侧配置面板
    function closeSettingsPanel() {
        // 找到“关闭”按钮
        const closeBtn = document.querySelector('button[aria-label="Close run settings panel"]');
        if (closeBtn) {
            closeBtn.click();
            console.log('已关闭右侧配置面板');
            return true; // 找到了并点掉
        }
        return false; // 还没找到
    }

    // 观察 DOM，直到按钮出现
    const observer = new MutationObserver(() => {
        if (closeSettingsPanel()) {
            observer.disconnect(); // 找到并关闭后就停止监听
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });


    // 在控制台输出日志，方便调试
    console.log('aistudio.google.com 界面美化脚本已应用。');
})();