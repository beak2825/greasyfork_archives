// ==UserScript==
// @name         回到顶部、前往底部
// @version      0.2
// @description  显示 回到顶部、前往底部 按钮
// @author       BIGFA
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9995 0.499512L16.9492 5.44926L15.535 6.86347L12.9995 4.32794V9.99951H10.9995L10.9995 4.32794L8.46643 6.86099L7.05222 5.44678L11.9995 0.499512ZM10.9995 13.9995L10.9995 19.6704L8.46448 17.1353L7.05026 18.5496L12 23.4995L16.9497 18.5498L15.5355 17.1356L12.9995 19.6716V13.9995H10.9995Z"></path></svg>
// @noframes
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1445135
// @downloadURL https://update.greasyfork.org/scripts/529706/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529706/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 在页面加载完成后延迟执行 main_ 函数
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        setTimeout(() => main_(), 1000);
    } else {
        document.addEventListener("DOMContentLoaded", function () { setTimeout(() => main_(), 1000) });
    }

    // 主函数，创建按钮并使用 window 作为滚动目标
    function main_() {
        let scrollElement = window; // 统一使用 window 作为滚动目标
        createButtonToTop(scrollElement);
        createButtonToBottom(scrollElement);
    }

    // 滚动到顶部的函数
    function scrollToTop(element) {
        if (element === window) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            element.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 滚动到底部的函数
    function scrollToBottom(element) {
        if (element === window) {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else {
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        }
    }

    // 创建“回到顶部”按钮
    function createButtonToTop(scrollElement) {
        const btn = document.createElement('div');
        btn.innerHTML = '<svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor"><title>回到顶部(右键隐藏该按钮)</title><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM13 12H16L12 8L8 12H11V16H13V12Z"></path></svg>';
        btn.style.color = 'rgba(0,0,0,0.2)'; // 默认透明度20%
        btn.style.position = 'fixed';
        btn.style.right = '50px';
        btn.style.bottom = '55px';
        btn.style.cursor = 'pointer';
        btn.style.background = 'transparent';
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.transition = 'color 0.3s ease, transform 0.3s ease'; // 添加过渡效果
        btn.style.zIndex = '9999'; // 设置高 z-index 值，确保在最上层
        btn.addEventListener('mouseover', () => {
            btn.style.color = 'rgba(0,0,0,0.9)'; // 悬停时透明度90%
            btn.style.transform = 'scale(1.1)'; // 放大10%
        });
        btn.addEventListener('mouseout', () => {
            btn.style.color = 'rgba(0,0,0,0.2)'; // 恢复透明度20%
            btn.style.transform = 'scale(1)'; // 恢复原始大小
        });
        btn.onclick = () => scrollToTop(scrollElement);
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            btn.style.display = 'none';
        };
        document.body.appendChild(btn);
    }

    // 创建“前往底部”按钮
    function createButtonToBottom(scrollElement) {
        const btn = document.createElement('div');
        btn.innerHTML = '<svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor"><title>前往底部(右键隐藏该按钮)</title><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM13 12V8H11V12H8L12 16L16 12H13Z"></path></svg>';
        btn.style.color = 'rgba(0,0,0,0.2)'; // 默认透明度20%
        btn.style.position = 'fixed';
        btn.style.right = '50px';
        btn.style.bottom = '5px';
        btn.style.cursor = 'pointer';
        btn.style.background = 'transparent';
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.transition = 'color 0.3s ease, transform 0.3s ease'; // 添加过渡效果
        btn.style.zIndex = '9999'; // 设置高 z-index 值，确保在最上层
        btn.addEventListener('mouseover', () => {
            btn.style.color = 'rgba(0,0,0,0.9)'; // 悬停时透明度90%
            btn.style.transform = 'scale(1.1)'; // 放大10%
        });
        btn.addEventListener('mouseout', () => {
            btn.style.color = 'rgba(0,0,0,0.2)'; // 恢复透明度20%
            btn.style.transform = 'scale(1)'; // 恢复原始大小
        });
        btn.onclick = () => scrollToBottom(scrollElement);
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            btn.style.display = 'none';
        };
        document.body.appendChild(btn);
    }
})();