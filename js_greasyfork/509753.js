// ==UserScript==
// @name         自适应屏蔽按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加一个自适应大小的按钮来屏蔽当前网页
// @match        *://*/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/509753/%E8%87%AA%E9%80%82%E5%BA%94%E5%B1%8F%E8%94%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/509753/%E8%87%AA%E9%80%82%E5%BA%94%E5%B1%8F%E8%94%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createBlockButton() {
        const button = document.createElement('button');
        button.textContent = '屏蔽此网页';
        button.id = 'block-page-button';
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.bottom = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#ff4d4d';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';

        // 添加悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#ff1a1a';
        }
        button.onmouseout = function() {
            this.style.backgroundColor = '#ff4d4d';
        }

        // 添加点击事件
        button.onclick = function() {
            const currentURL = window.location.href;
            const blockedURLs = GM_getValue('blockedURLs', []);
            blockedURLs.push(currentURL);
            GM_setValue('blockedURLs', blockedURLs);
            alert('此页面已被添加到屏蔽列表');
            window.location.href = 'about:blank';
        }

        document.body.appendChild(button);
        return button;
    }

    // 调整按钮大小
    function adjustButtonSize() {
        const button = document.getElementById('block-page-button');
        if (!button) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const size = Math.min(viewportWidth, viewportHeight) * 0.1; // 按钮大小为视口较小边的10%

        button.style.width = `${size}px`;
        button.style.height = `${size}px`;
        button.style.fontSize = `${size * 0.2}px`; // 字体大小为按钮大小的20%
    }

    // 检查当前页面是否被屏蔽
    function checkIfBlocked() {
        const currentURL = window.location.href;
        const blockedURLs = GM_getValue('blockedURLs', []);
        if (blockedURLs.includes(currentURL)) {
            window.location.href = 'about:blank';
        }
    }

    // 初始化
    function init() {
        checkIfBlocked();
        const button = createBlockButton();
        adjustButtonSize();
        window.addEventListener('resize', adjustButtonSize);
    }

    // 当DOM加载完成后运行初始化函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();