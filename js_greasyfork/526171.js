// ==UserScript==
// @name         Amazon Order Management
// @namespace    http://tampermonkey.net/
// @version      3.8-clean
// @description  修复消息图标居中，隐藏插件 Logo，添加订单查询功能，并屏蔽广告横幅 by 祀尘
// @author       祀尘
// @match        https://sellercentral.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526171/Amazon%20Order%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/526171/Amazon%20Order%20Management.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 1️⃣ 隐藏插件 Logo ***/
    function hidePluginLogo() {
        const logoContainer = document.querySelector('.logo-btn-container');
        if (logoContainer) logoContainer.style.display = 'none';
    }

    /*** 2️⃣ 修复 "消息" 按钮错位 ***/
    function fixMessageIcon() {
        const messageLink = document.querySelector('a[aria-label="消息"]');
        const messageIcon = document.querySelector('.utility-bar-icon.sc-nav-kat-icon-mail');

        if (messageLink) {
            Object.assign(messageLink.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
            });
        }

        if (messageIcon) {
            Object.assign(messageIcon.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '20px',
                width: '20px',
                margin: 'auto',
            });
        }
    }

    /*** 3️⃣ 添加 "查询订单" 按钮 ***/
    function addOrderSearchButton() {
        if (document.querySelector('#order-search-container')) return;

        const messageButton = document.querySelector('a[aria-label*="消息"], a[aria-label*="Messages"]');
        if (!messageButton) return;

        const container = document.createElement('div');
        container.id = 'order-search-container';
        Object.assign(container.style, {
            position: 'relative',
            marginRight: '40px',
            display: 'inline-block',
        });

        const orderButton = document.createElement('button');
        Object.assign(orderButton, {
            id: 'order-search-button',
            textContent: '查询订单',
        });

        Object.assign(orderButton.style, {
            cursor: 'pointer',
            color: '#ffffff',
            background: 'transparent',
            border: '1px solid #ffffff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            height: '36px',
            lineHeight: '36px',
        });

        const inputContainer = document.createElement('div');
        Object.assign(inputContainer, {
            id: 'order-input-container',
        });

        Object.assign(inputContainer.style, {
            display: 'none',
            position: 'absolute',
            top: '50px',
            left: '0',
            width: '160px',
            padding: '10px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
        });

        const inputBox = document.createElement('input');
        Object.assign(inputBox, {
            id: 'order-input-box',
            type: 'text',
            placeholder: '输入订单号',
        });

        Object.assign(inputBox.style, {
            width: '93%',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px',
        });

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
        });

        const confirmButton = document.createElement('button');
        Object.assign(confirmButton, {
            id: 'confirm-order-search',
            textContent: '确定',
        });

        Object.assign(confirmButton.style, {
            padding: '5px 10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#0073bb',
            color: '#ffffff',
        });

        const cancelButton = document.createElement('button');
        Object.assign(cancelButton, {
            id: 'cancel-order-search',
            textContent: '取消',
        });

        Object.assign(cancelButton.style, {
            padding: '5px 10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#f2f2f2',
            color: '#333',
        });

        orderButton.addEventListener('click', () => {
            inputContainer.style.display = 'block';
            inputBox.focus();
        });

        inputBox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') searchOrder();
        });

        confirmButton.addEventListener('click', searchOrder);
        cancelButton.addEventListener('click', closeOrderSearch);

        function searchOrder() {
            const orderId = inputBox.value.trim();
            if (orderId) {
                window.open(`https://sellercentral.amazon.com/orders-v3/order/${orderId}`, '_blank');
                closeOrderSearch();
            }
        }

        function closeOrderSearch() {
            inputBox.value = '';
            inputContainer.style.display = 'none';
        }

        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) closeOrderSearch();
        });

        buttonContainer.append(confirmButton, cancelButton);
        inputContainer.append(inputBox, buttonContainer);
        container.append(orderButton, inputContainer);
        messageButton.parentNode.insertBefore(container, messageButton);
    }

    /*** 4️⃣ 屏蔽广告横幅 ***/
    function removeAdBanner() {
        const ad = document.querySelector('.ad-static-image-banner');
        if (ad) ad.style.display = 'none';
    }

    /*** 5️⃣ 初始化功能 ***/
    function init() {
        hidePluginLogo();
        fixMessageIcon();
        addOrderSearchButton();
        removeAdBanner();
    }

    /*** 6️⃣ 监听 DOM 变化，确保动态元素也处理 ***/
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                init();
                break;
            }
        }
    });

    const targetNode = document.querySelector('#sc-global-header') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    window.addEventListener('load', init);
})();
