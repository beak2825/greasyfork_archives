// ==UserScript==
// @name         网页模式切换器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过浮动按钮切换网页白昼/黑夜模式
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528422/%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528422/%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 模式状态存储
    let isWhiteMode = GM_getValue('whiteMode', true);

    // 创建控制按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${isWhiteMode ? '#fff' : '#000'};
        color: ${isWhiteMode ? '#000' : '#fff'};
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 9999;
        transition: all 0.3s;
    `;
    toggleBtn.innerHTML = isWhiteMode ? '🌞' : '🌛';
    document.body.appendChild(toggleBtn);

    // 模式切换函数
    function toggleColorScheme() {
        isWhiteMode = !isWhiteMode;
        GM_setValue('whiteMode', isWhiteMode);

        toggleBtn.style.background = isWhiteMode ? '#fff' : '#000';
        toggleBtn.style.color = isWhiteMode ? '#000' : '#fff';
        toggleBtn.innerHTML = isWhiteMode ? '🌞' : '🌛';

        // 切换样式
        if(isWhiteMode) {
            applyWhiteMode();
        } else {
            removeWhiteMode();
        }
    }

    // 应用白色模式
    function applyWhiteMode() {
        const css = `
        html, body, div, p, span, h1, h2, h3, h4, h5, h6 {
            background: #ffffff !important;
            color: #000000 !important;
            background-color: #ffffff !important;
        }
        * {
            color: #000000 !important;
            text-shadow: none !important;
        }
        img:not([src*=".svg"]), video {
            filter: brightness(100%) !important;
        }
        ::-webkit-scrollbar { background: #f0f0f0 }
        ::-webkit-scrollbar-thumb { background: #c0c0c0 }
        `;

        if(!window.whiteModeStyle) {
            window.whiteModeStyle = document.createElement('style');
            document.head.appendChild(window.whiteModeStyle);
        }
        window.whiteModeStyle.textContent = css;
    }

    // 移除白色模式
    function removeWhiteMode() {
        if(window.whiteModeStyle) {
            window.whiteModeStyle.textContent = '';
        }
    }

    // 初始化应用
    if(isWhiteMode) applyWhiteMode();

    // 绑定点击事件
    toggleBtn.addEventListener('click', toggleColorScheme);
    toggleBtn.addEventListener('mousedown', () => {
        toggleBtn.style.transform = 'scale(0.9)';
    });
    toggleBtn.addEventListener('mouseup', () => {
        toggleBtn.style.transform = 'scale(1)';
    });

    // 动态元素监听
    new MutationObserver(() => {
        if(isWhiteMode) applyWhiteMode();
    }).observe(document, { subtree: true, childList: true });
})();