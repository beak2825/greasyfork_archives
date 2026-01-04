// ==UserScript==
// @name         PreviewCart
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  предпросмотр корзины
// @author       HashBrute
// @match        https://lzt.market/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      DDM
// @downloadURL https://update.greasyfork.org/scripts/533868/PreviewCart.user.js
// @updateURL https://update.greasyfork.org/scripts/533868/PreviewCart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .cart-hover-preview {
        position: absolute;
        width: 280px;
        max-width: 280px;
        background: #1f1f1f;
        border: 1px solid #363636;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        z-index: 999999;
        overflow: hidden;
        display: none;
        pointer-events: auto !important;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        box-sizing: border-box;
        max-height: 90vh;
    }

    .cart-hover-preview * {
        box-sizing: border-box;
    }

    .cart-hover-arrow {
        position: absolute;
        top: -8px;
        left: 50%;
        margin-left: -7px;
        width: 14px;
        height: 14px;
        background: #1f1f1f;
        transform: rotate(45deg);
        border-left: 1px solid #363636;
        border-top: 1px solid #363636;
        z-index: 1;
    }

    .cart-hover-content {
        padding: 12px;
        position: relative;
        z-index: 2;
        background: #1f1f1f;
        border-radius: 8px;
        max-height: calc(90vh - 24px);
        overflow-y: auto;
    }

    .cart-hover-header {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #363636;
    }

    .cart-hover-title {
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
    }

    .cart-hover-count {
        background: #0daf77;
        color: white;
        border-radius: 12px;
        padding: 3px 9px;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
        margin-left: 10px;
    }

    .cart-hover-items {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 12px;
        scrollbar-width: thin;
        scrollbar-color: #363636 #1f1f1f;
    }

    .cart-hover-items::-webkit-scrollbar {
        width: 4px;
    }

    .cart-hover-items::-webkit-scrollbar-track {
        background: #1f1f1f;
    }

    .cart-hover-items::-webkit-scrollbar-thumb {
        background-color: #363636;
        border-radius: 3px;
    }

    .cart-hover-item {
        padding: 9px 0;
        border-bottom: 1px solid #363636;
        font-size: 13px;
    }

    .cart-hover-item:hover {
        background: rgba(255,255,255,0.03);
    }

    .cart-hover-item:last-child {
        border-bottom: none;
    }

    .cart-hover-item-title {
        color: #fff;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
    }

    .cart-hover-item-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    .cart-hover-item-seller {
        color: #949494;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 65%;
    }

    .cart-hover-item-price {
        color: #0daf77;
        font-weight: 700;
        font-size: 12px;
        background: rgba(13, 175, 119, 0.15);
        padding: 4px 8px;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .cart-hover-empty {
        text-align: center;
        padding: 20px 0;
        color: #949494;
        font-size: 13px;
    }

    .cart-hover-footer {
        flex-direction: column;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #363636;
    }

    .cart-hover-total {
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    .cart-hover-total-price {
        background: #0daf77;
        color: white;
        padding: 5px 12px;
        border-radius: 5px;
        font-size: 14px;
    }

    .cart-hover-buttons {
        display: flex;
        gap: 10px;
        width: 100%;
    }

    .cart-hover-button {
        text-align: center;
        background: #0daf77;
        color: white !important;
        border-radius: 5px;
        font-weight: 600;
        text-decoration: none !important;
        transition: background 0.2s;
        font-size: 13px;
        border: none;
        cursor: pointer;
        padding: 9px 15px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cart-hover-button-cart {
        padding: 9px;
        flex: 0 0 40px;
    }

    .cart-hover-button:hover {
        background: #09965e;
    }

    .cart-loader {
        text-align: center;
        padding: 20px;
    }

    .cart-loader-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(13, 175, 119, 0.3);
        border-radius: 50%;
        border-top-color: #0daf77;
        animation: cart-spin 1s linear infinite;
    }

    @keyframes cart-spin {
        to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .cart-hover-preview {
            width: calc(100vw - 20px);
            max-width: 320px;
        }

        .cart-hover-item-price {
            font-size: 11px;
            padding: 3px 6px;
        }

        .cart-hover-button {
            font-size: 12px;
            padding: 8px 12px;
        }
    }
`);


    let cartPreviewEl = null;
    let cartData = null;
    let lastFetchTime = 0;
    let previewTimeout = null;
    const FETCH_COOLDOWN = 5000; 


    let isInitialized = false;

    const DEBUG_MODE = false; 


    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('[LZT Cart Preview]', ...args);
        }
    }

    function errorLog(...args) {
        console.error('[LZT Cart Preview]', ...args);
    }


    function findCartElement() {
        try {
            const selectors = [
                '.navCart.navLink',
                '.navTab.PopupClosed a[href*="cart"]',
                '.navTab a[href*="cart"]',
                'a[href*="cart"]',
                'a[href*="mass-buy/cart"]',
                '.link--internal[href*="cart"]',
                '.p-navgroup-link[href*="cart"]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element;
                }
            }

            const iconSelectors = [
                'svg.feather-shopping-cart',
                '.fa-shopping-cart',
                'i.fa-cart'
            ];

            for (const selector of iconSelectors) {
                const icon = document.querySelector(selector);
                if (icon) {
                    const parent = icon.closest('a') || icon.closest('button') || icon.closest('.navTab') || icon.parentElement;
                    if (parent) {
                        return parent;
                    }
                    return icon;
                }
            }

            return null;
        } catch (error) {
            return null;
        }
    }


    function initCartPreview() {
        if (isInitialized) {
            return;
        }

        const cartElement = findCartElement();
        if (!cartElement) {
            setTimeout(initCartPreview, 2000);
            return;
        }

        cartPreviewEl = document.createElement('div');
        cartPreviewEl.className = 'cart-hover-preview';
        cartPreviewEl.innerHTML = '<div class="cart-hover-arrow"></div><div class="cart-hover-content"><div class="cart-loader"><div class="cart-loader-spinner"></div></div></div>';

        document.body.appendChild(cartPreviewEl);

        function updatePosition() {
            try {
                const rect = cartElement.getBoundingClientRect();
                if (!rect || rect.width === 0) {
                    return;
                }

                const scrollTop = window.scrollY || document.documentElement.scrollTop;

                cartPreviewEl.style.position = 'absolute';
                cartPreviewEl.style.zIndex = '999999';

                const windowWidth = window.innerWidth;
                const previewWidth = 280;

                let leftPos = rect.left + (rect.width / 2) - (previewWidth / 2);

                if (leftPos < 10) leftPos = 10;
                if (leftPos + previewWidth > windowWidth - 10) {
                    leftPos = windowWidth - previewWidth - 10;
                }

                cartPreviewEl.style.top = (rect.bottom + scrollTop + 5) + 'px';
                cartPreviewEl.style.left = leftPos + 'px';

                const arrowEl = cartPreviewEl.querySelector('.cart-hover-arrow');
                if (arrowEl) {
                    const arrowLeftPos = (rect.left + (rect.width / 2) - leftPos);

                    const minArrowPos = 15; 
                    const maxArrowPos = previewWidth - 15 - 14; 

                    let finalArrowPos = Math.max(minArrowPos, Math.min(arrowLeftPos, maxArrowPos));
                    arrowEl.style.left = finalArrowPos + 'px';
                    arrowEl.style.right = 'auto';
                    arrowEl.style.marginLeft = '0';
                }

                debugLog('Обновлена позиция окна:', {
                    top: cartPreviewEl.style.top,
                    left: cartPreviewEl.style.left
                });
            } catch (error) {
                errorLog('Ошибка при обновлении позиции:', error);
            }
        }

        window.addEventListener('resize', updatePosition);
        document.addEventListener('scroll', updatePosition, { passive: true });

        const enterHandler = function(e) {
            clearTimeout(previewTimeout);
            updatePosition(); 
            handleCartHover();
        };

        const leaveHandler = function(e) {
            previewTimeout = setTimeout(() => {
                if (cartPreviewEl) {
                    cartPreviewEl.style.display = 'none';
                }
            }, 300);
        };


        cartElement.addEventListener('mouseenter', enterHandler);
        cartElement.addEventListener('mouseleave', leaveHandler);


        cartElement.addEventListener('touchstart', enterHandler, { passive: true });


        cartPreviewEl.addEventListener('mouseenter', function(e) {
            clearTimeout(previewTimeout);
        });

        cartPreviewEl.addEventListener('mouseleave', function(e) {
            if (cartPreviewEl) {
                cartPreviewEl.style.display = 'none';
            }
        });

        window.showCartPreview = function() {
            if (cartPreviewEl && cartElement) {
                updatePosition();
                handleCartHover();
                return;
            } else {
                return;
            }
        };

        isInitialized = true;
    }

    async function handleCartHover() {
        if (!cartPreviewEl) {
            return;
        }

        cartPreviewEl.style.display = 'block';
        cartPreviewEl.style.visibility = 'visible';

        const now = Date.now();
        if (!cartData || now - lastFetchTime > FETCH_COOLDOWN) {
            try {
                cartPreviewEl.querySelector('.cart-hover-content').innerHTML = '<div class="cart-loader"><div class="cart-loader-spinner"></div></div>';

                debugLog('Запрос данных корзины...');
                const response = await fetch('https://lzt.market/user/cart', {
                    credentials: 'include',
                    cache: 'no-cache' 
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const html = await response.text();
                cartData = parseCartData(html);
                lastFetchTime = Date.now();
                renderCartPreview();
            } catch (error) {
                if (cartPreviewEl && cartPreviewEl.querySelector('.cart-hover-content')) {
                    cartPreviewEl.querySelector('.cart-hover-content').innerHTML = '<div class="cart-hover-empty">Ошибка загрузки</div>';
                }
            }
        } else {
            debugLog('Используем закешированные данные корзины');
            renderCartPreview();
        }
    }

    function parseCartData(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const items = [];
            const itemElements = doc.querySelectorAll('.marketIndexItem');


            itemElements.forEach((item, index) => {
                try {
                    const titleEl = item.querySelector('.marketIndexItem--Title');
                    const priceEl = item.querySelector('.marketIndexItem--Price .Value');
                    const sellerEl = item.querySelector('.username');

                    if (titleEl && priceEl) {
                        items.push({
                            title: titleEl.textContent.trim(),
                            price: priceEl.textContent.trim(),
                            seller: sellerEl ? sellerEl.textContent.trim() : 'Продавец'
                        });
                    }
                } catch (e) {
                    errorLog('Ошибка при парсинге товара:', e);
                }
            });

            if (items.length === 0) {
                try {
                    const alternativeItems = doc.querySelectorAll('.structItem--product, .cart-item, [class*="cart-item"]');
                    debugLog('Альтернативный поиск товаров:', alternativeItems.length);

                    alternativeItems.forEach((item, index) => {
                        try {
                            const titleEl = item.querySelector('[class*="title"], .item-title, h3, h4, .structItem-title');
                            const priceEl = item.querySelector('[class*="price"], .product-price, .price, .cost');
                            const sellerEl = item.querySelector('.username, .seller, [class*="seller"]');

                            if (titleEl && priceEl) {
                                items.push({
                                    title: titleEl.textContent.trim(),
                                    price: priceEl.textContent.trim().replace(/[^\d.,]/g, ''),
                                    seller: sellerEl ? sellerEl.textContent.trim() : 'Продавец'
                                });
                            }
                        } catch (e) {
                            errorLog('Ошибка при парсинге альтернативного товара:', e);
                        }
                    });
                } catch (e) {
                    errorLog('Ошибка при альтернативном парсинге товаров:', e);
                }
            }

            let totalCount = '0';
            try {
                const countSelectors = [
                    '.marketCart-subtitle span',
                    '.cart-count',
                    '[class*="cart-count"]',
                    '.badge',
                    '.counter'
                ];

                for (const selector of countSelectors) {
                    const countEl = doc.querySelector(selector);
                    if (countEl) {
                        totalCount = countEl.textContent.trim();
                        break;
                    }
                }

                if (totalCount === '0' && items.length > 0) {
                    totalCount = items.length.toString();
                }
            } catch (e) {
                errorLog('Ошибка при парсинге количества:', e);
                if (items.length > 0) {
                    totalCount = items.length.toString();
                }
            }

            let totalPrice = '0 ₽';
            try {
                const priceSelectors = [
                    '.marketCart-title-green',
                    '.cart-total',
                    '[class*="cart-total"]',
                    '.total-price',
                    '.price.total'
                ];

                for (const selector of priceSelectors) {
                    const priceEl = doc.querySelector(selector);
                    if (priceEl) {
                        totalPrice = priceEl.textContent.trim();
                        break;
                    }
                }

                if ((totalPrice === '0 ₽' || totalPrice === '0₽') && items.length > 0) {
                    let sum = 0;
                    items.forEach(item => {
                        const price = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.'));
                        if (!isNaN(price)) {
                            sum += price;
                        }
                    });

                    if (sum > 0) {
                        totalPrice = sum + ' ₽';
                    }
                }

                if (!totalPrice.includes('₽')) {
                    totalPrice += ' ₽';
                }

                if (totalPrice.includes('₽') && !totalPrice.includes(' ₽')) {
                    totalPrice = totalPrice.replace('₽', ' ₽');
                }
            } catch (e) {
                errorLog('Ошибка при парсинге цены:', e);
            }

            return {
                items: items,
                count: totalCount,
                totalPrice: totalPrice
            };
        } catch (error) {
            errorLog('Ошибка при парсинге данных корзины:', error);
            return {
                items: [],
                count: '0',
                totalPrice: '0 ₽'
            };
        }
    }

    function renderCartPreview() {
        if (!cartPreviewEl || !cartData) {
            errorLog('Невозможно отрендерить предпросмотр: отсутствуют необходимые данные');
            return;
        }

        const contentEl = cartPreviewEl.querySelector('.cart-hover-content');
        if (!contentEl) {
            errorLog('Не найден элемент содержимого');
            return;
        }

        if (!cartData.items || cartData.items.length === 0) {
            contentEl.innerHTML = '<div class="cart-hover-empty">Ваша корзина пуста</div>';
            return;
        }

        let html = `
            <div class="cart-hover-header">
                <div class="cart-hover-title">Корзина</div>
                <div class="cart-hover-count">${cartData.count}</div>
            </div>
            <div class="cart-hover-items">
        `;

        cartData.items.forEach(item => {
            let price = item.price || '0';

            if (!price.includes('₽')) {
                price += ' ₽';
            }

            if (price.includes('₽') && !price.includes(' ₽')) {
                price = price.replace('₽', ' ₽');
            }

            html += `
                <div class="cart-hover-item">
                    <div class="cart-hover-item-title">${item.title || 'Товар'}</div>
                    <div class="cart-hover-item-details">
                        <span class="cart-hover-item-seller">${item.seller || 'Продавец'}</span>
                        <span class="cart-hover-item-price">${price}</span>
                    </div>
                </div>
            `;
        });

        let formattedTotal = cartData.totalPrice || '0 ₽';

        if (!formattedTotal.includes('₽')) {
            formattedTotal += ' ₽';
        }

        if (formattedTotal.includes('₽') && !formattedTotal.includes(' ₽')) {
            formattedTotal = formattedTotal.replace('₽', ' ₽');
        }

        html += `
            </div>
            <div class="cart-hover-footer">
                <div class="cart-hover-total">Итого: <span class="cart-hover-total-price">${formattedTotal}</span></div>
            </div>
            <div class="cart-hover-buttons">
                <a href="https://lzt.market/mass-buy/cart" class="cart-hover-button cart-hover-button-mass">Массовая покупка</a>
                <a href="https://lzt.market/user/cart" class="cart-hover-button cart-hover-button-cart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </a>
            </div>
        `;

        contentEl.innerHTML = html;
        debugLog('Предпросмотр корзины отрендерен');

        cartPreviewEl.style.display = 'block';
        cartPreviewEl.style.visibility = 'visible';
    }


    function checkPageReady() {
        try {
            if (document.body) {
                const cartElement = findCartElement();

                if (cartElement) {
                    debugLog('Страница загружена, корзина найдена, запускаем скрипт');
                    initScript();
                } else {
                    debugLog('Страница загружена, но корзина не найдена. Ожидаем...');
                    setTimeout(checkPageReady, 1000);
                }
            } else {
                debugLog('Страница еще не полностью загружена, ожидаем...');
                setTimeout(checkPageReady, 500);
            }
        } catch (error) {
            errorLog('Ошибка при проверке загрузки страницы:', error);
            setTimeout(checkPageReady, 1000);
        }
    }

    function initScript() {
        try {
            debugLog('Запуск скрипта предпросмотра корзины...');
            // Проверяем, есть ли уже элемент предпросмотра
            if (document.querySelector('.cart-hover-preview') || isInitialized) {
                debugLog('Элемент предпросмотра уже существует');
                return;
            }

            initCartPreview();
        } catch (error) {
            errorLog('Ошибка при инициализации скрипта:', error);
        }
    }

    setTimeout(() => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(checkPageReady, 500));
        } else {
            checkPageReady();
        }
    }, 500);

    const observer = new MutationObserver((mutations) => {
        if (!isInitialized) {
            const cartElement = findCartElement();
            if (cartElement) {
                debugLog('DOM изменился, корзина найдена, инициализируем предпросмотр');
                initScript();
            }
        }
    });

    try {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            debugLog('MutationObserver запущен');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
                debugLog('MutationObserver запущен после загрузки DOM');
            });
        }
    } catch (error) {
        errorLog('Ошибка при установке MutationObserver:', error);
        setInterval(() => {
            if (!isInitialized) {
                checkPageReady();
            }
        }, 3000);
    }

})();