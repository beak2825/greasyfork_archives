// ==UserScript==
// @name         妖火快速回顶部（改）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  美化内容：1.按钮样式：将按钮改为圆形，并增加阴影效果。2.颜色过渡：添加鼠标悬停时的颜色和缩放效果。3.平滑滚动：保持平滑滚动效果。
// @license MIT
// @author       cradms
// @match        *://yaohuo.me/bbs*
// @match        *://www.yaohuo.me/bbs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518195/%E5%A6%96%E7%81%AB%E5%BF%AB%E9%80%9F%E5%9B%9E%E9%A1%B6%E9%83%A8%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518195/%E5%A6%96%E7%81%AB%E5%BF%AB%E9%80%9F%E5%9B%9E%E9%A1%B6%E9%83%A8%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    const svg = `
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 14v28" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 26l12-12 12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6h24" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    const button = document.createElement('div');
    button.innerHTML = svg;
    Object.assign(button.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#007bff',
        borderRadius: '50%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        visibility: 'hidden',
        transition: 'background-color 0.3s, transform 0.3s'
    });
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.style.visibility = window.scrollY > 300 ? 'visible' : 'hidden';
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#0056b3';
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#007bff';
        button.style.transform = 'scale(1)';
    });
})();