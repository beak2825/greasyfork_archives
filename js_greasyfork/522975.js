// ==UserScript==
// @name         91APP 後台快速編輯選單
// @name:zh-TW   91APP 後台快速編輯選單
// @version      1.0
// @description  在 91APP 商店前台新增快速編輯功能，可快速跳轉至後台編輯頁面
// @description:zh-TW  在 91APP 商店前台新增快速編輯功能，可快速跳轉至後台編輯頁面
// @author       元魁魁
// @match        https://www.example.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91app.com
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1211943
// @downloadURL https://update.greasyfork.org/scripts/522975/91APP%20%E5%BE%8C%E5%8F%B0%E5%BF%AB%E9%80%9F%E7%B7%A8%E8%BC%AF%E9%81%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/522975/91APP%20%E5%BE%8C%E5%8F%B0%E5%BF%AB%E9%80%9F%E7%B7%A8%E8%BC%AF%E9%81%B8%E5%96%AE.meta.js
// ==/UserScript==


// 注入 CSS 樣式
GM_addStyle(`
    .admin-quick-menu {
        position: fixed !important;
        top: 1rem !important;
        right: 1rem !important;
        z-index: 999999 !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        user-select: none !important;
    }

    .menu-container {
        display: flex !important;
        align-items: stretch !important;
        background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2) !important;
        cursor: move !important;
        transition: transform 0.2s, box-shadow 0.2s !important;
    }

    .drag-handle {
        padding: 0 0.5rem !important;
        display: flex !important;
        align-items: center !important;
        color: rgba(255, 255, 255, 0.6) !important;
        cursor: move !important;
    }

    .menu-container:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3) !important;
    }

    .edit-button {
        background: none !important;
        color: white !important;
        padding: 0.625rem 1rem !important;
        border: none !important;
        cursor: pointer !important;
        font-size: 0.875rem !important;
        white-space: nowrap !important;
        font-weight: 500 !important;
        position: relative !important;
        overflow: hidden !important;
    }

    .toggle-button {
        background: none !important;
        color: white !important;
        padding: 0.625rem 0.75rem !important;
        border: none !important;
        border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
    }

    .menu-content {
        display: none !important;
        position: absolute !important;
        right: 0 !important;
        top: calc(100% + 0.5rem) !important;
        width: 16rem !important;
        background-color: white !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid #e5e7eb !important;
        padding: 0.5rem !important;
    }

    .menu-content.show {
        display: block !important;
    }

    .menu-item {
        width: 100% !important;
        text-align: left !important;
        padding: 0.625rem 1rem !important;
        color: #374151 !important;
        border-radius: 0.375rem !important;
        border: none !important;
        cursor: pointer !important;
        font-size: 0.875rem !important;
        background: none !important;
        display: block !important;
        margin: 0.25rem 0 !important;
        transition: all 0.2s !important;
    }

    .menu-item:hover {
        background-color: #f3f4f6 !important;
        color: #4f46e5 !important;
        padding-left: 1.25rem !important;
    }
`);

// 主要程式碼
(function() {
    'use strict';
    function getCurrentPageType() {
    const url = window.location.href;
    if (url.includes('/Article/Detail/')) {
        return 'article';
    } else if (url.includes('/SalePage/Index/')) {
        return 'product';
    }
    return null;
}

function getIdFromUrl() {
    const url = window.location.href;
    const matches = url.match(/\/(\d+)$/);
    return matches ? matches[1] : null;
}

function createAdminMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'admin-quick-menu';
    menuDiv.id = 'adminQuickMenu';

    const pageType = getCurrentPageType();
    const buttonText = pageType ? '編輯此頁' : '管理選單';

    menuDiv.innerHTML = `
        <div class="menu-container" id="menuHeader">
            <div class="drag-handle">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
            </div>
            <button class="edit-button" id="edit-button">${buttonText}</button>
            <button class="toggle-button" id="menu-toggle">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div class="menu-content" id="menu-content">
                <button class="menu-item" id="goto-article-list">部落格後台</button>
                <button class="menu-item" id="goto-channel-list">頻道頁後台</button>
            </div>
        </div>
    `;
    document.body.appendChild(menuDiv);
}


function initializeDrag() {
    const menuDiv = document.getElementById('adminQuickMenu');
    const menuHeader = document.getElementById('menuHeader');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
        if (e.target.tagName.toLowerCase() === 'button') return;

        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        isDragging = true;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, menuDiv);
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    menuHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    menuHeader.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
}

function initializeMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.getElementById('menu-content');
    const editButton = document.getElementById('edit-button');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuContent.classList.toggle('show');
    });

    editButton.addEventListener('click', () => {
        handleEditClick();
    });

    document.addEventListener('click', (e) => {
        if (!menuContent.contains(e.target) && e.target !== menuToggle) {
            menuContent.classList.remove('show');
        }
    });
}

function handleEditClick() {
    const pageType = getCurrentPageType();
    const id = getIdFromUrl();
    const shopId = '2351';

    if (pageType === 'article' && id) {
        window.location.href = `https://store.91app.com/InfoModule/ArticleEdit?shopId=${shopId}&id=${id}`;
    } else if (pageType === 'product' && id) {
        window.location.href = `https://store.91app.com/SalePage/Edit?type=edit&shopId=${shopId}&salepageId=${id}`;
    }
}

function initializeButtons() {
    document.getElementById('goto-article-list').addEventListener('click', () => {
        window.location.href = 'https://store.91app.com/InfoModule/List?shopId=2351';
    });

    document.getElementById('goto-channel-list').addEventListener('click', () => {
        window.location.href = 'https://store.91app.com/ShopCategory/List?shopId=2351';
    });
}

function init() {
    createAdminMenu();
    initializeDrag();
    initializeMenu();
    initializeButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
