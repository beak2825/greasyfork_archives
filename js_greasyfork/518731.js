// ==UserScript==
// @name         Ozon Sort by Reviews
// @version      0.7
// @description  Добавляет кнопку для сортировки товаров по количеству отзывов
// @author       Jipok
// @match        https://www.ozon.ru/*
// @grant        none
// @license      MIT
// @namespace    https://gist.github.com/Jipok/cda67abb99078c85ca452a7a261384ac
// @downloadURL https://update.greasyfork.org/scripts/518731/Ozon%20Sort%20by%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/518731/Ozon%20Sort%20by%20Reviews.meta.js
// ==/UserScript==


(function() {
'use strict';

    function extractReviewCount(element) {
        const reviewText = Array.from(element.querySelectorAll('*'))
            .map(el => el.textContent)
            .find(text => text && text.includes('отзыв'));

        if (!reviewText) return 0;

        const match = reviewText.match(/(\d+[\s,]?\d*)\s*отзыв/);
        return match ? parseInt(match[1].replace(/[\s,]/g, '')) : 0;
    }

    function sortByReviews() {
        const products = Array.from(document.querySelectorAll('div[data-index]')).filter(el => {
            return el.querySelector('img') &&
                   el.querySelector('a[href*="/product/"]') &&
                   el.textContent.includes('₽');
        });

        if (!products.length) {
            console.log('Товары не найдены');
            return;
        }

        const container = products[0].parentElement;
        if (!container) return;

        const sortedProducts = [...products].sort((a, b) => {
            const reviewsA = extractReviewCount(a);
            const reviewsB = extractReviewCount(b);
            return reviewsB - reviewsA;
        });

        container.innerHTML = '';
        sortedProducts.forEach(product => {
            container.appendChild(product);
        });

        window.scrollTo(0, 0);
    }

    // Стили для попапа
    const style = document.createElement('style');
    style.textContent = `
        .loading-popup {
            position: fixed;
            bottom: 2rem;
            right: 1rem;
            background: white;
            padding: 1.25rem;
            border-radius: 0.75rem;
            box-shadow: 0 0.125rem 0.625rem rgba(0,0,0,0.2);
            z-index: 9999;
            display: none;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 1rem;
        }
        .loading-popup.visible {
            display: block;
        }
        .loading-popup-content {
            margin-bottom: 0.75rem;
        }
        .loading-popup-cancel {
            background: #ff4d4d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            width: 100%;
        }
        .loading-popup-cancel:hover {
            background: #ff3333;
        }

        @media (min-width: 768px) {
            .desktop-buttons-container {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-left: 16px;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
            .desktop-buttons-container button {
                padding: 8px 16px !important;
                height: 40px !important;
                line-height: 20px !important;
                border-radius: 4px !important;
                font-size: 14px !important;
            }
        }

        @media (max-width: 767px) {
            .mobile-buttons-container {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Создаем попап
    const popup = document.createElement('div');
    popup.className = 'loading-popup';
    popup.innerHTML = `
        <div class="loading-popup-content">
            Загружено товаров: <span id="pagesCount">0</span>
        </div>
        <button class="loading-popup-cancel">Отменить загрузку</button>
    `;
    document.body.appendChild(popup);

    let loadingCancelled = false;

    // Обработчики отмены
    popup.querySelector('.loading-popup-cancel').addEventListener('click', () => {
        loadingCancelled = true;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            loadingCancelled = true;
        }
    });

    async function loadPages(pages = 7) {
        const loadButton = document.querySelector('#ozonLoadMore');
        loadButton.disabled = true;
        loadButton.innerHTML = 'Загрузка...';
        popup.classList.add('visible');
        const pagesCount = document.getElementById('pagesCount');

        let loadedPages = 0;
        let initialProducts = document.querySelectorAll('div[data-index]').length;
        pagesCount.textContent = initialProducts;

        const scrollInterval = setInterval(() => {
            if (!loadingCancelled) {
                window.scrollTo(0, document.body.scrollHeight);
                const currentProducts = document.querySelectorAll('div[data-index]').length;
                const newProducts = currentProducts
                pagesCount.textContent = newProducts;
            } else {
                clearInterval(scrollInterval);
                window.scrollTo(0, 0);
                loadButton.disabled = false;
                loadButton.innerHTML = 'Загрузить больше';
                popup.classList.remove('visible');
            }
        }, 500);

        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations) => {
                const hasNewProducts = mutations.some(mutation =>
                    Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === 1 && node.querySelector?.('[data-index]')
                    )
                );

                if (hasNewProducts) {
                    loadedPages++;
                    const currentProducts = document.querySelectorAll('div[data-index]').length;
                    const newProducts = currentProducts;
                    pagesCount.textContent = newProducts;

                    if (loadedPages >= pages || loadingCancelled) {
                        clearInterval(scrollInterval);
                        observer.disconnect();
                        window.scrollTo(0, 0);
                        loadButton.disabled = false;
                        loadButton.innerHTML = 'Загрузить больше';
                        popup.classList.remove('visible');
                        resolve();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function createButtons() {
        const buttonsContainer = document.createElement('div');

        const buttonStyle = `
            font-family: Sans;
            font-size: 0.875rem;
            font-weight: 400;
            height: 2rem;
            line-height: 2rem;
            border-radius: 1rem;
            padding: 0 1rem;
            background: #005bff;
            color: white;
            border: none;
            cursor: pointer;
            position: relative;
            transition: 0.2s cubic-bezier(0.4,0,0.2,1);
            white-space: nowrap;
        `;

        const loadButton = document.createElement('button');
        loadButton.id = 'ozonLoadMore';
        loadButton.innerHTML = 'Загрузить больше';
        loadButton.style.cssText = buttonStyle;

        const sortButton = document.createElement('button');
        sortButton.id = 'ozonCustomSort';
        sortButton.innerHTML = 'Сортировать по отзывам';
        sortButton.style.cssText = buttonStyle;

        [loadButton, sortButton].forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.opacity = '0.8';
            });
            button.addEventListener('mouseout', () => {
                button.style.opacity = '1';
            });
        });

        loadButton.addEventListener('click', () => loadPages(7));
        sortButton.addEventListener('click', sortByReviews);

        buttonsContainer.appendChild(loadButton);
        buttonsContainer.appendChild(sortButton);

        return buttonsContainer;
    }

    function addButtons() {
        if (document.querySelector('#ozonCustomSort')) return;

        const buttons = createButtons();

        // Пробуем десктопное расположение
        const sortContainer = document.querySelector('div[data-widget="searchResultsSort"]');
        if (sortContainer) {
            buttons.className = 'desktop-buttons-container';
            const parentContainer = sortContainer;
            parentContainer.style.position = 'relative';
            parentContainer.appendChild(buttons);
            return;
        }

        // Если не вышло, пробуем мобильное
        const paginator = document.querySelector('div#paginator');
        if (paginator) {
            buttons.className = 'mobile-buttons-container';
            paginator.parentNode.insertBefore(buttons, paginator);
        }
    }

    for (let i = 1; i < 5; i++) {
        setTimeout(addButtons, i * 550);
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            for (let i = 0; i < 5; i++) {
                setTimeout(addButtons, i * 550);
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();