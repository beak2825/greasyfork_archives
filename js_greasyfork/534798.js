// ==UserScript==
// @name         NGA优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在NGA页面滚动时显示右下角回到顶部按钮，点击立即回到顶部并隐藏按钮
// @author       Grok
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534798/NGA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534798/NGA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建回到顶部按钮
    const createBackToTopButton = () => {
        const button = document.createElement('div');
        button.className = 'nga-back-to-top';
        button.innerHTML = `
            <span class="back-top">
                <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.82145 0.626818C5.20459 0.272889 5.79541 0.27289 6.17855 0.626819L10.1175 4.26545C10.786 4.88302 10.3491 6 9.43893 6H1.56107C0.650938 6 0.213979 4.88302 0.882518 4.26545L4.82145 0.626818Z" fill="currentColor"></path>
                </svg>
                顶部
            </span>
        `;
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .nga-back-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: #fff;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
                padding: 8px 12px;
                font-size: 14px;
                color: #333;
            }
            .nga-back-to-top.show {
                opacity: 1;
                visibility: visible;
            }
            .nga-back-to-top:hover {
                background: #f5f5f5;
            }
            .nga-back-to-top .back-top {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(button);
        return button;
    };

    // 初始化
    const init = () => {
        const button = createBackToTopButton();

        // 点击立即回到顶部并隐藏按钮
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            button.classList.remove('show');
        });

        // 滚动事件监听
        window.addEventListener('scroll', () => {
            // 当滚动超过200px时显示按钮
            if (window.scrollY > 200) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        });
    };

    // 页面加载完成后执行
    window.addEventListener('load', init);
})();