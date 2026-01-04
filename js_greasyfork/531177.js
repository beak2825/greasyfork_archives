// ==UserScript==
// @name         Bushiroad商店增强功能整合版
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  显示库存 + 显示隐藏的购物车按钮
// @match        https://bushiroad-store.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531177/Bushiroad%E5%95%86%E5%BA%97%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531177/Bushiroad%E5%95%86%E5%BA%97%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 通用样式 ===
    const commonStyle = {
        position: 'fixed',
        bottom: '20px',
        zIndex: '9999',
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        userSelect: 'none',
        cursor: 'grab'
    };

    // === 库存显示 ===
    function showInventory(quantity, message = '') {
        const oldDisplay = document.getElementById('inventory-display');
        if (oldDisplay) oldDisplay.remove();

        const displayDiv = document.createElement('div');
        displayDiv.id = 'inventory-display';
        Object.assign(displayDiv.style, commonStyle, {
            right: '20px',
            minWidth: '180px'
        });

        let statusColor = '#F44336';
        if (quantity > 10) statusColor = '#4CAF50';
        else if (quantity > 0) statusColor = '#FFC107';

        displayDiv.innerHTML = `
            <div style="margin-bottom: 5px;">
                <span style="color: ${statusColor}; font-size: 18px;">${quantity}</span>
                <span> 件在庫</span>
            </div>
            ${message ? `<div style="font-size: 13px;">${message}</div>` : ''}
        `;

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.color = '#ccc';
        closeBtn.onclick = () => displayDiv.remove();
        displayDiv.appendChild(closeBtn);

        enableDrag(displayDiv);
        document.body.appendChild(displayDiv);
    }

    // === 支付按钮 ===
    function createToggleButton(targetDiv) {
        const button = document.createElement('div');
        button.id = 'payment-toggle-button';
        button.style.right = '220px';
        Object.assign(button.style, commonStyle);

        let shown = !targetDiv.hasAttribute('hidden');
        button.innerHTML = shown ? '🙈 隐藏按钮' : '💳 显示按钮';

        button.onclick = () => {
            if (shown) {
                targetDiv.setAttribute('hidden', '');
                button.innerHTML = '💳 显示按钮';
            } else {
                targetDiv.removeAttribute('hidden');
                button.innerHTML = '🙈 隐藏按钮';
            }
            shown = !shown;
        };

        enableDrag(button);
        document.body.appendChild(button);
    }

    // === 拖动功能封装 ===
    function enableDrag(el) {
        let isDragging = false, offsetX = 0, offsetY = 0;

        el.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            el.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                el.style.left = `${e.clientX - offsetX}px`;
                el.style.top = `${e.clientY - offsetY}px`;
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            el.style.cursor = 'grab';
        });
    }

    // === 库存监听 ===
    const checkInventory = setInterval(function () {
        const jsonData = document.querySelector('script[type="application/json"][data-product-json]');
        if (!jsonData) return;

        try {
            const productData = JSON.parse(jsonData.textContent);

            if (productData?.inventories) {
                const inventoryKeys = Object.keys(productData.inventories);
                if (inventoryKeys.length > 0) {
                    const firstInventory = productData.inventories[inventoryKeys[0]];
                    showInventory(firstInventory.inventory_quantity, firstInventory.inventory_message || '');
                    clearInterval(checkInventory);
                    return;
                }
            }

            if (productData?.variants?.[0]) {
                showInventory(productData.variants[0].inventory_quantity);
                clearInterval(checkInventory);
            }
        } catch (e) {
            console.log('JSON解析错误:', e);
        }
    }, 500);

    // === 初始化支付按钮 ===
    function initPaymentToggle() {
        const observer = new MutationObserver(() => {
            const targetDiv = document.querySelector('.product-form__payment-container');
            if (targetDiv) {
                targetDiv.removeAttribute('hidden');
                createToggleButton(targetDiv);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', initPaymentToggle);
})();
