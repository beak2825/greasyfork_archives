// ==UserScript==
// @name        nhentai 滾動導航
// @description 在頁面添加按鈕以快速導航到頂部、中央和底部，浮懸並在滑鼠靠近時顯示。
// @namespace   xspeed.net
// @license     MIT
// @version     2.2
// @icon        https://nhentai.net/favicon.ico
// @match       *://nhentai.net/*
// @match       *://e-hentai.org/*
// @match       *://exhentai.org/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/499071/nhentai%20%E6%BB%BE%E5%8B%95%E5%B0%8E%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/499071/nhentai%20%E6%BB%BE%E5%8B%95%E5%B0%8E%E8%88%AA.meta.js
// ==/UserScript==

"use strict";

(function() {
    function addScrollButtons() {
        const container = document.createElement('div');
        container.id = 'scroll-nav-container';
        container.style.position = 'fixed';
        container.style.right = '10px';
        container.style.top = '40%';
        container.style.transform = 'translateY(-50%)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.zIndex = '9999';
        container.style.opacity = '0'; // 初始透明度設為0
        container.style.transition = 'opacity 0.3s ease-in-out'; // 增加過渡效果

        // 添加按鈕
        const createButton = (text, onClick) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.style.padding = '10px';
            btn.style.backgroundColor = '#000';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', onClick);
            container.appendChild(btn);
        };

        createButton('↑', () => window.scrollTo(0, 0));
        createButton('⇵', () => window.scrollTo(0, window.innerHeight / 2));
        createButton('↓', () => window.scrollTo(0, document.body.scrollHeight));

        // 滑鼠進入時顯示，離開時隱藏
        container.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
        });

        container.addEventListener('mouseleave', () => {
            container.style.opacity = '0';
        });

        document.body.appendChild(container);

        // 添加 CSS 以實現浮懸效果
        const style = document.createElement('style');
        style.textContent = `
            #scroll-nav-container:hover {
                opacity: 1;
            }
            #scroll-nav-container {
                pointer-events: none; /* 使按鈕在未顯示時不會影響滑鼠事件 */
            }
            #scroll-nav-container button {
                pointer-events: auto; /* 使按鈕本身能夠響應滑鼠事件 */
            }
        `;
        document.head.appendChild(style);
    }

    addScrollButtons();
})();
