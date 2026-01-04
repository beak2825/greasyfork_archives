// ==UserScript==
// @name         翻页按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据 URL 中的 page 参数添加“上一页”和“下一页”按钮，实现网页内容翻页
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523993/%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523993/%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮的样式
    const style = document.createElement('style');
    style.innerHTML = `
    .pagination-buttons {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 10000;
    }
    .pagination-button {
        width: 80px;
        height: 40px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .pagination-button:hover {
        background-color: #218838;
    }
    `;
    document.head.appendChild(style);

    // 创建按钮容器
    const container = document.createElement('div');
    container.className = 'pagination-buttons';

    // 获取当前页码
    function getCurrentPage() {
        const url = new URL(window.location.href);
        const page = url.searchParams.get('page');
        return page ? parseInt(page) : 1;
    }

    // 设置新的页码
    function setPage(page) {
        const url = new URL(window.location.href);
        if (page > 1) {
            url.searchParams.set('page', page);
        } else {
            url.searchParams.delete('page');
        }
        window.location.href = url.toString();
    }

    // 创建“上一页”按钮
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.innerText = '上一页';
    prevButton.addEventListener('click', () => {
        const currentPage = getCurrentPage();
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    });

    // 创建“下一页”按钮
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.innerText = '下一页';
    nextButton.addEventListener('click', () => {
        const currentPage = getCurrentPage();
        setPage(currentPage + 1);
    });

    // 将按钮添加到容器中
    container.appendChild(prevButton);
    container.appendChild(nextButton);

    // 将容器添加到页面中
    document.body.appendChild(container);
})();