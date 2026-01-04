// ==UserScript==
// @name         Back to Top Button
// @namespace    github.com/aioi50
// @version      1.0
// @description  右下角固定返回顶部按钮
// @author       Cline
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526355/Back%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526355/Back%20to%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.id = 'backToTopBtn';

    // 设置按钮样式
    btn.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        font-size: 24px;
        border: none;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s;
        display: none;
        z-index: 9999;
    `;

    // 添加按钮到页面
    document.body.appendChild(btn);

    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
            btn.style.opacity = '0.8';
        } else {
            btn.style.opacity = '0';
            setTimeout(() => { btn.style.display = 'none' }, 300);
        }
    });

    // 点击事件处理
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

})();
