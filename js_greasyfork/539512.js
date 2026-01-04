// ==UserScript==
// @name          Ozon Interface Enhancer
// @namespace     https://github.com/Zaomil
// @version       1.1.1
// @description   Улучшает интерфейс Ozon.by: сортирует отзывы, раскрывает описание, отслеживает цены, строит графики цен
// @author        Zaomil
// @license       GPL-3.0-or-later
// @icon          https://ozon.by/favicon.ico
// @match         https://*.ozon.by/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @grant         GM_notification
// @run-at        document-idle
// @homepageURL   https://github.com/Zaomil/ozon-enhancer
// @supportURL    https://github.com/Zaomil/ozon-enhancer/issues
// @connect       ozon.by
// @downloadURL https://update.greasyfork.org/scripts/539512/Ozon%20Interface%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/539512/Ozon%20Interface%20Enhancer.meta.js
// ==/UserScript==

// Copyright (C) 2025 Zaomil
// Licensed under the GNU General Public License v3 or later
// See <https://www.gnu.org/licenses/> for details.

(function() {
    'use strict';

    // Конфигурация по умолчанию
    const DEFAULT_CONFIG = {
        sortReviews: true,
        expandDescription: true,
        trackPrices: true,
        maxTrackedItems: 6,
        priceDropNotifications: true
    };

    // Цветовая схема для темной темы интерфейса
    const DARK_THEME = {
        background: "#121212",
        surface: "#1e1e1e",
        primary: "#BB86FC",
        primaryVariant: "#3700B3",
        secondary: "#03DAC6",
        text: "#E0E0E0",
        textSecondary: "#A0A0A0",
        error: "#CF6679",
        success: "#00C853",
        warning: "#FFAB00",
        border: "rgba(255,255,255,0.1)",
        shadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
        iconFilter: "none"
    };

    // Текущая цветовая схема
    const COLORS = DARK_THEME;

    // Форматировщик для белорусских рублей
    const BYN_FORMATTER = new Intl.NumberFormat('ru-BY', {
        style: 'currency',
        currency: 'BYN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Управление конфигурацией пользователя
    const CONFIG = {
        get sortReviews() {
            return GM_getValue('sortReviews', DEFAULT_CONFIG.sortReviews);
        },
        set sortReviews(value) {
            GM_setValue('sortReviews', value);
        },
        get expandDescription() {
            return GM_getValue('expandDescription', DEFAULT_CONFIG.expandDescription);
        },
        set expandDescription(value) {
            GM_setValue('expandDescription', value);
        },
        get trackPrices() {
            return GM_getValue('trackPrices', DEFAULT_CONFIG.trackPrices);
        },
        set trackPrices(value) {
            GM_setValue('trackPrices', value);
        },
        get maxTrackedItems() {
            const stored = GM_getValue('maxTrackedItems', DEFAULT_CONFIG.maxTrackedItems);
            return Math.max(stored, DEFAULT_CONFIG.maxTrackedItems);
        },
        set maxTrackedItems(value) {
            GM_setValue('maxTrackedItems', value);
        },
        get trackedItems() {
            return GM_getValue('trackedItems', []);
        },
        set trackedItems(value) {
            GM_setValue('trackedItems', value);
        },
        get priceDropNotifications() {
            return GM_getValue('priceDropNotifications', DEFAULT_CONFIG.priceDropNotifications);
        },
        set priceDropNotifications(value) {
            GM_setValue('priceDropNotifications', value);
        },
        get currentPanelTab() {
            return GM_getValue('currentPanelTab', 'settings');
        },
        set currentPanelTab(value) {
            GM_setValue('currentPanelTab', value);
        },
        get lastPriceCheckTime() {
            return GM_getValue('lastPriceCheckTime', null);
        },
        set lastPriceCheckTime(value) {
            GM_setValue('lastPriceCheckTime', value);
        }
    };

    // Применение цветовой схемы к интерфейсу
    function applyThemeStyles() {
        if (panelCreated) {
            refreshPanelStyles();
            refreshPanel();
        }
        refreshToggleButton();
        applyIconStyles();
    }

    // Применение стилей к иконкам
    function applyIconStyles() {
        const icons = document.querySelectorAll('#ozon-enhancer-panel img, #ozon-enhancer-panel .material-icons');
        icons.forEach(icon => {
            icon.style.filter = COLORS.iconFilter;
        });
    }

    // Обновление стилей кнопки переключения панели
    function refreshToggleButton() {
        const toggle = document.getElementById('ozon-enhancer-toggle');
        if (toggle) {
            toggle.style.background = `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryVariant})`;
        }
    }

    // Состояние скрипта
    let isSortingApplied = false;
    let panelCreated = false;
    let isDescriptionExpanded = false;
    let currentTab = CONFIG.currentPanelTab;
    let notificationQueue = [];
    let isNotificationShowing = false;
    let dragStartIndex = null;
    let moScheduled = false;

    // Селекторы для элементов страницы
    const SELECTORS = {
        price: [
            '[data-widget="webPrice"]',
            '[itemprop="price"]',
            '.ui-p0-v',
            '.ui-q5',
            '.ui-q0',
            '.ui-o0',
            '.ui-o6'
        ],
        gallerySelectors: [
            '.gallery-modal',
            '.image-gallery',
            '.zoom-modal',
            '[class*="galleryContainer"]',
            '.image-viewer',
            '.image-slider'
        ]
    };

    // Парсинг цены из текста
    function parsePriceText(text) {
        if (!text) return null;

        const cleaned = text.replace(/\s|[\u00A0\u2007\u202F]/g, '')
            .replace(/[^\d.,]/g, '');

        const lastCommaIndex = cleaned.lastIndexOf(',');
        const lastDotIndex = cleaned.lastIndexOf('.');
        const useCommaAsDecimal = lastCommaIndex > lastDotIndex;

        const normalized = useCommaAsDecimal
            ? cleaned.replace(/\./g, '').replace(',', '.')
            : cleaned.replace(/,/g, '');

        const num = parseFloat(normalized);
        return Number.isFinite(num) && num > 0 ? num : null;
    }

    // Извлечение артикула товара из URL
    function extractProductArticle() {
        const urlMatch = location.pathname.match(/\/(\d+)(?:\/|\?|$)/);
        if (urlMatch?.[1]) return urlMatch[1];

        try {
            const jsonLd = document.querySelector('script[type="application/ld+json"]');
            if (jsonLd) {
                const data = JSON.parse(jsonLd.textContent);
                return data.sku || data.offers?.sku || data.productID;
            }
        } catch (e) {
            console.error('Ошибка при парсинге JSON-LD:', e);
        }

        const metaArticle = document.querySelector('meta[property="og:url"]');
        if (metaArticle) {
            const metaMatch = metaArticle.content.match(/\/(\d+)(?:\/|\?|$)/);
            if (metaMatch?.[1]) return metaMatch[1];
        }

        const cartButtons = document.querySelectorAll('[data-widget="webAddToCart"]');
        for (const btn of cartButtons) {
            const article = btn.getAttribute('data-article-id');
            if (article) return article;
        }

        return null;
    }

    // Получение названия товара
    function extractProductName() {
        return document.querySelector('h1')?.textContent?.trim() || 'Неизвестный товар';
    }

    // Получение текущей цены товара
    function extractCurrentPrice() {
        try {
            const jsonLd = document.querySelector('script[type="application/ld+json"]');
            if (jsonLd) {
                try {
                    const data = JSON.parse(jsonLd.textContent);
                    const price = data?.offers?.price || (Array.isArray(data?.offers) ? data.offers[0]?.price : null);
                    if (price) {
                        const parsed = parsePriceText(String(price));
                        if (parsed) return parsed;
                    }
                } catch (e) {
                    console.error('Ошибка при парсинге JSON-LD:', e);
                }
            }

            for (const selector of SELECTORS.price) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const price = parsePriceText(element.textContent);
                    if (price && price > 1) return price;
                }
            }
            return null;
        } catch (e) {
            console.error('Ошибка при извлечении цены:', e);
            return null;
        }
    }

    // Отслеживание текущего товара
    function trackCurrentProduct() {
        if (!CONFIG.trackPrices) {
            showToast('Включите отслеживание цен в настройках расширения', 'warning');
            return false;
        }

        if (CONFIG.trackedItems.length >= CONFIG.maxTrackedItems) {
            showToast(`Достигнут лимит отслеживаемых товаров (${CONFIG.maxTrackedItems})`, 'error');
            return false;
        }

        const article = extractProductArticle();
        if (!article) {
            showToast('Не удалось определить артикул товара', 'error');
            return false;
        }

        if (CONFIG.trackedItems.some(item => item.article === article)) {
            showToast('Этот товар уже отслеживается', 'info');
            return false;
        }

        const name = extractProductName();
        const price = extractCurrentPrice();
        const url = location.href.split('?')[0];

        if (!price) {
            showToast('Не удалось определить цену товара', 'error');
            return false;
        }

        const newItem = {
            article,
            name,
            url,
            currentPrice: price,
            initialPrice: price,
            priceHistory: [{
                price,
                date: new Date().toISOString().split('T')[0]
            }],
            addedDate: new Date().toISOString(),
            lastNotifiedPrice: price,
            lastUpdated: Date.now(),
            notificationThreshold: 0.2
        };

        CONFIG.trackedItems = [...CONFIG.trackedItems, newItem];
        showToast(`Товар добавлен в отслеживание: ${name}`, 'success');
        return true;
    }

    // Отслеживание товара по артикулу
    function trackProductByArticle(article) {
        if (!CONFIG.trackPrices) {
            showToast('Включите отслеживание цен в настройках расширения', 'warning');
            return Promise.resolve(false);
        }

        if (!article || !/^\d+$/.test(article)) {
            showToast('Пожалуйста, введите корректный артикул товара', 'error');
            return Promise.resolve(false);
        }

        if (CONFIG.trackedItems.length >= CONFIG.maxTrackedItems) {
            showToast(`Достигнут лимит отслеживаемых товаров (${CONFIG.maxTrackedItems})`, 'error');
            return Promise.resolve(false);
        }

        if (CONFIG.trackedItems.some(item => item.article === article)) {
            showToast('Этот товар уже отслеживается', 'info');
            return Promise.resolve(false);
        }

        const url = `https://ozon.by/product/${article}/`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 15000,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const name = doc.querySelector('h1')?.textContent?.trim() || `Товар #${article}`;
                        const price = extractPriceFromDocument(doc);

                        if (!price) {
                            showToast('Не удалось определить цену товара', 'error');
                            resolve(false);
                            return;
                        }

                        const newItem = {
                            article,
                            name,
                            url,
                            currentPrice: price,
                            initialPrice: price,
                            priceHistory: [{
                                price,
                                date: new Date().toISOString().split('T')[0]
                            }],
                            addedDate: new Date().toISOString(),
                            lastNotifiedPrice: price,
                            lastUpdated: Date.now(),
                            notificationThreshold: 0.2
                        };

                        CONFIG.trackedItems = [...CONFIG.trackedItems, newItem];
                        showToast(`Товар добавлен в отслеживание: ${name}`, 'success');
                        resolve(true);
                    } catch (e) {
                        console.error('Ошибка при добавлении товара:', e);
                        showToast('Ошибка при добавлении товара', 'error');
                        resolve(false);
                    }
                },
                onerror: function() {
                    showToast('Ошибка при загрузке данных товара', 'error');
                    resolve(false);
                },
                ontimeout: function() {
                    showToast('Превышено время ожидания ответа от сервера', 'error');
                    resolve(false);
                }
            });
        });
    }

    // Извлечение цены из DOM документа
    function extractPriceFromDocument(doc) {
        try {
            const jsonLd = doc.querySelector('script[type="application/ld+json"]');
            if (jsonLd) {
                try {
                    const data = JSON.parse(jsonLd.textContent);
                    const price = data?.offers?.price || (Array.isArray(data?.offers) ? data.offers[0]?.price : null);
                    if (price) {
                        const parsed = parsePriceText(String(price));
                        if (parsed) return parsed;
                    }
                } catch (e) {
                    console.error('Ошибка при парсинге JSON-LD:', e);
                }
            }

            for (const selector of SELECTORS.price) {
                const elements = doc.querySelectorAll(selector);
                for (const element of elements) {
                    const price = parsePriceText(element.textContent);
                    if (price && price > 0) return price;
                }
            }
            return null;
        } catch (e) {
            console.error('Ошибка при извлечении цены из документа:', e);
            return null;
        }
    }

    // Обновление цены отслеживаемого товара
    function updateTrackedItemPrice(article, newPrice) {
        let priceDropDetected = false;
        let notificationItem = null;
        let oldPrice = null;

        const updatedItems = CONFIG.trackedItems.map(item => {
            if (item.article === article) {
                if (item.currentPrice === newPrice) {
                     return item;
                }

                const threshold = item.notificationThreshold !== undefined ?
                                 item.notificationThreshold :
                                 0.2;

                const history = [...item.priceHistory, {
                    price: newPrice,
                    date: new Date().toISOString()
                }];

                const priceDiff = item.currentPrice - newPrice;
                let newLastNotifiedPrice = item.lastNotifiedPrice;

                if (newPrice < item.currentPrice &&
                    priceDiff >= threshold &&
                    (item.lastNotifiedPrice === null || newPrice < item.lastNotifiedPrice)) {
                    priceDropDetected = true;
                    notificationItem = { ...item, priceHistory: history };
                    oldPrice = item.currentPrice;
                    newLastNotifiedPrice = newPrice;
                }

                return {
                    ...item,
                    currentPrice: newPrice,
                    priceHistory: history,
                    lastNotifiedPrice: newLastNotifiedPrice,
                    lastUpdated: Date.now()
                };
            }
            return item;
        });

        CONFIG.trackedItems = updatedItems;

        if (priceDropDetected && CONFIG.priceDropNotifications && notificationItem) {
            const priceDiff = (oldPrice - newPrice).toFixed(2);
            notificationQueue.push({
                title: "🔔 Цена снизилась!",
                text: `${notificationItem.name}: ${BYN_FORMATTER.format(newPrice)} (↓${BYN_FORMATTER.format(priceDiff)})`,
                image: "https://ozon.by/favicon.ico",
                url: notificationItem.url
            });

            processNotificationQueue();
        }

        return priceDropDetected;
    }

    // Показ всплывающего уведомления
    function showToast(message, type = 'info') {
        const colors = {
            info: COLORS.primary,
            success: COLORS.success,
            warning: COLORS.warning,
            error: COLORS.error
        };

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${COLORS.surface};
            color: ${colors[type] || COLORS.text};
            border-left: 4px solid ${colors[type] || COLORS.primary};
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: toastIn 0.3s ease-out;
            font-size: 14px;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Обработка очереди уведомлений
    function processNotificationQueue() {
        if (isNotificationShowing || notificationQueue.length === 0) return;

        isNotificationShowing = true;
        const notification = notificationQueue.shift();

        if (GM_notification) {
            GM_notification({
                title: notification.title,
                text: notification.text,
                image: notification.image,
                timeout: 5000,
                onclick: () => window.open(notification.url, '_blank'),
                ondone: () => {
                    isNotificationShowing = false;
                    setTimeout(processNotificationQueue, 1000);
                }
            });
        } else {
            showToast(`${notification.title} - ${notification.text}`, 'info');
            isNotificationShowing = false;
            setTimeout(processNotificationQueue, 500);
        }
    }

    // Удаление товара из отслеживания
    function removeTrackedItem(article) {
        CONFIG.trackedItems = CONFIG.trackedItems.filter(item => item.article !== article);
        showToast('Товар удалён из отслеживания', 'info');
    }

    // Проверка цен отслеживаемых товаров
    function checkTrackedPrices(force = false) {
        if (!CONFIG.trackPrices || CONFIG.trackedItems.length === 0) return;

        const now = Date.now();
        const lastCheckTime = CONFIG.lastPriceCheckTime ? new Date(CONFIG.lastPriceCheckTime).getTime() : null;
        const minCheckInterval = 30 * 60 * 1000;

        if (!force && lastCheckTime && (now - lastCheckTime < minCheckInterval)) {
            return;
        }

        CONFIG.lastPriceCheckTime = new Date().toISOString();

        const requests = CONFIG.trackedItems
            .filter(item => {
                return force || !item.lastUpdated || (now - item.lastUpdated) > minCheckInterval;
            })
            .map(item => {
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: item.url,
                        timeout: 10000,
                        onload: function(response) {
                            try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, "text/html");
                                const price = extractPriceFromDocument(doc);
                                if (price) updateTrackedItemPrice(item.article, price);
                            } catch (e) {
                                console.error('Ошибка при обновлении цены товара:', e);
                            }
                            resolve();
                        },
                        onerror: function() {
                            resolve();
                        },
                        ontimeout: function() {
                            resolve();
                        }
                    });
                });
            });

        if (requests.length === 0) return;

        Promise.all(requests).then(() => {
            if (panelCreated) refreshPanel();
            showToast(`Проверено ${requests.length} товаров`, 'info');
        });
    }

    // Автоматическое раскрытие описания товара
    function expandDescription() {
        if (isDescriptionExpanded || !CONFIG.expandDescription) return;
        if (!location.pathname.includes('/product/')) return;

        const buttonTexts = ['Показать полностью', 'Развернуть описание', 'Читать полностью', 'Показать всё', 'Развернуть'];

        for (const btn of document.querySelectorAll('button, [role="button"]')) {
            const btnText = btn.textContent?.trim() || '';
            if (buttonTexts.some(text => btnText.includes(text)) &&
                btn.offsetParent !== null &&
                btn.getAttribute('aria-expanded') !== 'true') {
                try {
                    btn.click();
                    isDescriptionExpanded = true;
                    return;
                } catch (e) {
                    console.error('Ошибка при раскрытии описания:', e);
                }
            }
        }
    }

    // Форматирование даты
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    // Показ настроек товара
    function showItemSettings(item) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.4s ease-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: ${COLORS.surface};
            border-radius: 12px;
            padding: 20px;
            width: min(90vw, 400px);
            max-height: 90vh;
            overflow: hidden;
            box-shadow: ${COLORS.shadow};
            color: ${COLORS.text};
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        `;

        modal.appendChild(modalContent);

        const title = document.createElement('div');
        title.textContent = `Настройки товара: ${item.name.substring(0, 50)}${item.name.length > 50 ? '...' : ''}`;
        title.style.cssText = `
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: ${COLORS.primary};
            text-shadow: 0 0 10px rgba(187, 134, 252, 0.3);
        `;
        modalContent.appendChild(title);

        const thresholdContainer = document.createElement('div');
        thresholdContainer.style.cssText = `
            margin: 15px 0;
        `;

        const thresholdLabel = document.createElement('label');
        thresholdLabel.textContent = 'Порог уведомления (BYN):';
        thresholdLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: ${COLORS.text};
        `;
        thresholdContainer.appendChild(thresholdLabel);

        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.step = '0.1';
        thresholdInput.min = '0.1';
        thresholdInput.value = item.notificationThreshold !== undefined ?
                               item.notificationThreshold :
                               0.2;
        thresholdInput.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 1px solid ${COLORS.border};
            border-radius: 6px;
            background: rgba(255,255,255,0.05);
            color: ${COLORS.text};
            font-size: 16px;
            box-sizing: border-box;
        `;
        thresholdContainer.appendChild(thresholdInput);

        modalContent.appendChild(thresholdContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';
        cancelButton.style.cssText = `
            padding: 10px 20px;
            background: rgba(255,255,255,0.1);
            color: ${COLORS.text};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            flex: 1;
        `;
        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.background = 'rgba(255,255,255,0.15)';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.background = 'rgba(255,255,255,0.1)';
        });
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });
        buttonsContainer.appendChild(cancelButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';
        saveButton.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.primaryVariant});
            color: ${COLORS.background};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            flex: 1;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        saveButton.addEventListener('mouseover', () => {
            saveButton.style.transform = 'scale(1.03)';
            saveButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.transform = 'none';
            saveButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
        saveButton.addEventListener('click', () => {
            const value = parseFloat(thresholdInput.value);
            if (!isNaN(value) && value > 0) {
                const updatedItems = CONFIG.trackedItems.map(trackedItem => {
                    if (trackedItem.article === item.article) {
                        return {
                            ...trackedItem,
                            notificationThreshold: value
                        };
                    }
                    return trackedItem;
                });
                CONFIG.trackedItems = updatedItems;
                showToast('Настройки товара сохранены', 'success');
            } else {
                showToast('Некорректное значение порога', 'error');
            }
            modal.remove();
        });
        buttonsContainer.appendChild(saveButton);

        modalContent.appendChild(buttonsContainer);
        document.body.appendChild(modal);
    }

    // Показ графика цены товара
    function showPriceChart(item) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.4s ease-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #000000;
            border-radius: 12px;
            padding: 20px;
            width: min(90vw, 800px);
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            animation: scaleIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        `;

        modal.appendChild(modalContent);

        const title = document.createElement('div');
        title.textContent = `История цены: ${item.name}`;
        title.style.cssText = `
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: ${COLORS.primary};
            text-shadow: 0 0 10px rgba(187,134,252,0.3);
        `;
        modalContent.appendChild(title);

        // Информационная панель с ключевыми метриками
        const infoRow = document.createElement('div');
        infoRow.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
            background: rgba(30,30,30,0.6);
            border-radius: 10px;
            padding: 15px;
            backdrop-filter: blur(10px);
        `;

        const initialPrice = item.initialPrice;
        const currentPrice = item.currentPrice;
        const minPrice = Math.min(...item.priceHistory.map(p => p.price));
        const maxPrice = Math.max(...item.priceHistory.map(p => p.price));
        const diff = currentPrice - initialPrice;
        const diffPercent = ((Math.abs(diff) / initialPrice) * 100).toFixed(1);

        infoRow.innerHTML = `
            <div style="text-align:center; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <div style="font-size:12px; color:${COLORS.textSecondary}; margin-bottom: 5px;">Текущая</div>
                <div style="font-weight:700; font-size:18px; color:${diff < 0 ? COLORS.success : COLORS.text}">
                    ${BYN_FORMATTER.format(currentPrice)}
                </div>
                <div style="font-size:13px; color:${diff === 0 ? COLORS.textSecondary : diff < 0 ? COLORS.success : COLORS.error}; margin-top:5px;">
                    ${diff === 0 ? 'Без изменений' :
                     diff < 0 ? `▼ ${BYN_FORMATTER.format(Math.abs(diff))} (${diffPercent}%)` :
                     `▲ ${BYN_FORMATTER.format(diff)} (${diffPercent}%)`}
                </div>
            </div>
            <div style="text-align:center; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <div style="font-size:12px; color:${COLORS.textSecondary}; margin-bottom: 5px;">Начальная</div>
                <div style="font-weight:700; font-size:18px;">${BYN_FORMATTER.format(initialPrice)}</div>
            </div>
            <div style="text-align:center; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <div style="font-size:12px; color:${COLORS.textSecondary}; margin-bottom: 5px;">Минимальная</div>
                <div style="font-weight:700; font-size:18px; color:${COLORS.success}">${BYN_FORMATTER.format(minPrice)}</div>
            </div>
            <div style="text-align:center; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <div style="font-size:12px; color:${COLORS.textSecondary}; margin-bottom: 5px;">Максимальная</div>
                <div style="font-weight:700; font-size:18px; color:${COLORS.error}">${BYN_FORMATTER.format(maxPrice)}</div>
            </div>
        `;
        modalContent.appendChild(infoRow);

        if (item.priceHistory.length < 2) {
            const message = document.createElement('div');
            message.textContent = 'Недостаточно данных для построения графика';
            message.style.cssText = 'text-align: center; color: #666; padding: 40px 0;';
            modalContent.appendChild(message);
        } else {
            const chartContainer = document.createElement('div');
            chartContainer.style.cssText = 'height: 350px; position: relative;';
            modalContent.appendChild(chartContainer);

            const canvas = document.createElement('canvas');
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            chartContainer.appendChild(canvas);

            // Используем requestAnimationFrame
            requestAnimationFrame(() => {
                if (!canvas.parentElement) return;

                // Устанавливаем размеры canvas
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                const ctx = canvas.getContext('2d');
                ctx.scale(dpr, dpr);

                if (!ctx) return;

                const sortedHistory = [...item.priceHistory].sort((a, b) =>
                    new Date(a.date) - new Date(b.date)
                );
                const prices = sortedHistory.map(entry => entry.price);
                const dates = sortedHistory.map(entry => {
                    const date = new Date(entry.date);
                    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
                });

                const minVal = Math.min(...prices);
                const maxVal = Math.max(...prices);
                const range = maxVal - minVal || 1;

                const padding = { top: 40, right: 30, bottom: 50, left: 60 };
                const graphWidth = rect.width - padding.left - padding.right;
                const graphHeight = rect.height - padding.top - padding.bottom;

                // Функция для преобразования значения в координаты
                const getX = (index) => padding.left + (index / (prices.length - 1)) * graphWidth;
                const getY = (value) => padding.top + graphHeight - ((value - minVal) / range * graphHeight);

                // Очистка canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Рисуем сетку
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;

                // Горизонтальные линии
                const horizontalLineCount = 5;
                for (let i = 0; i <= horizontalLineCount; i++) {
                    const value = minVal + (i / horizontalLineCount) * range;
                    const y = getY(value);

                    ctx.beginPath();
                    ctx.moveTo(padding.left, y);
                    ctx.lineTo(rect.width - padding.right, y);
                    ctx.stroke();

                    // Подписи цен
                    ctx.fillStyle = COLORS.textSecondary;
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    ctx.font = '11px sans-serif';
                    ctx.fillText(BYN_FORMATTER.format(value), padding.left - 8, y);
                }

                // Вертикальные линии
                const dateStep = Math.max(1, Math.floor(dates.length / 6));
                for (let i = 0; i < dates.length; i += dateStep) {
                    const x = getX(i);

                    ctx.beginPath();
                    ctx.moveTo(x, padding.top);
                    ctx.lineTo(x, padding.top + graphHeight);
                    ctx.stroke();

                    // Подписи дат
                    ctx.fillStyle = COLORS.textSecondary;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.font = '11px sans-serif';
                    ctx.fillText(dates[i], x, padding.top + graphHeight + 8);
                }

                // Рисуем область под графиком с градиентом
                const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphHeight);
                gradient.addColorStop(0, 'rgba(187, 134, 252, 0.3)');
                gradient.addColorStop(1, 'rgba(187, 134, 252, 0.05)');

                ctx.beginPath();
                ctx.moveTo(getX(0), getY(prices[0]));
                for (let i = 1; i < prices.length; i++) {
                    ctx.lineTo(getX(i), getY(prices[i]));
                }
                ctx.lineTo(getX(prices.length - 1), padding.top + graphHeight);
                ctx.lineTo(getX(0), padding.top + graphHeight);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();

                // Рисуем линию графика
                ctx.beginPath();
                ctx.moveTo(getX(0), getY(prices[0]));
                for (let i = 1; i < prices.length; i++) {
                    ctx.lineTo(getX(i), getY(prices[i]));
                }
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = COLORS.primary;
                ctx.shadowColor = 'rgba(187, 134, 252, 0.5)';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Рисуем точки на ключевых позициях
                const importantPoints = [
                    0, // начальная точка
                    prices.length - 1, // конечная точка
                    prices.indexOf(minVal), // минимальная цена
                    prices.indexOf(maxVal) // максимальная цена
                ];

                importantPoints.forEach(index => {
                    if (index < 0 || index >= prices.length) return;

                    const x = getX(index);
                    const y = getY(prices[index]);

                    // Внешний круг
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.fillStyle = COLORS.primary;
                    ctx.fill();

                    // Внутренний круг
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = COLORS.background;
                    ctx.fill();

                    // Подпись значения
                    ctx.fillStyle = COLORS.text;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.font = '12px sans-serif';
                    ctx.fillText(BYN_FORMATTER.format(prices[index]), x, y - 12);
                });
            });
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; justify-content: center; gap: 12px; margin-top: 20px;';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Экспорт данных';
        exportBtn.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(45deg, ${COLORS.secondary}, #018786);
            color: ${COLORS.background};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        exportBtn.innerHTML = '<span style="font-size:16px">📊</span> ' + exportBtn.textContent;
        exportBtn.addEventListener('mouseover', () => {
            exportBtn.style.transform = 'translateY(-2px)';
            exportBtn.style.boxShadow = '0 6px 14px rgba(0,0,0,0.4)';
        });
        exportBtn.addEventListener('mouseout', () => {
            exportBtn.style.transform = 'none';
            exportBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        exportBtn.addEventListener('click', () => {
            const data = {
                name: item.name,
                article: item.article,
                priceHistory: item.priceHistory
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `ozon_price_history_${item.article}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Данные экспортированы', 'success');
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.style.cssText = `
            padding: 10px 24px;
            background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.primaryVariant});
            color: ${COLORS.background};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        closeBtn.innerHTML = '<span style="font-size:16px">✕</span> ' + closeBtn.textContent;
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.transform = 'translateY(-2px)';
            closeBtn.style.boxShadow = '0 6px 14px rgba(0,0,0,0.4)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.transform = 'none';
            closeBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        closeBtn.addEventListener('click', () => modal.remove());

        buttonsContainer.appendChild(exportBtn);
        buttonsContainer.appendChild(closeBtn);
        modalContent.appendChild(buttonsContainer);

        // Добавляем обработчик закрытия по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);

        // Добавляем обработчик Escape для закрытия
        const handleEscape = (e) => {
            if (e.key === 'Escape') modal.remove();
        };
        document.addEventListener('keydown', handleEscape);

        // Убираем обработчик при закрытии модального окна
        const observer = new MutationObserver(() => {
            if (!document.body.contains(modal)) {
                document.removeEventListener('keydown', handleEscape);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });
    }

    // Создание панели управления
    function createControlPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const existingPanel = document.getElementById('ozon-enhancer-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'ozon-enhancer-panel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${COLORS.surface};
            border-radius: 12px;
            padding: 0;
            box-shadow: ${COLORS.shadow};
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 380px;
            max-height: 80vh;
            overflow: hidden;
            border: 1px solid ${COLORS.border};
            display: flex;
            flex-direction: column;
            color: ${COLORS.text};
            transform: translateY(10px);
            animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        `;

        const header = document.createElement('div');
        header.innerHTML = `<span style="font-size: 20px; margin-right: 8px;">⚡</span> Ozon Enhancer`;
        header.style.cssText = `
            font-weight: 600;
            font-size: 16px;
            padding: 14px 16px;
            background: linear-gradient(45deg, ${COLORS.background}, rgba(30,30,30,0.9));
            color: ${COLORS.primary};
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            border-bottom: 1px solid ${COLORS.border};
            text-shadow: 0 0 10px rgba(187, 134, 252, 0.3);
        `;

        panel.appendChild(header);

        const tabContainer = document.createElement('div');
        tabContainer.id = 'ozon-tab-container';
        tabContainer.style.cssText = `
            display: flex;
            background: ${COLORS.background};
            border-bottom: 1px solid ${COLORS.border};
        `;

        const createTab = (id, label) => {
            const tab = document.createElement('div');
            tab.dataset.tab = id;
            tab.textContent = label;
            tab.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                border-bottom: 2px solid transparent;
                flex: 1;
                text-align: center;
            `;

            if (currentTab === id) {
                tab.style.borderBottomColor = COLORS.primary;
                tab.style.color = COLORS.primary;
                tab.style.background = 'rgba(187, 134, 252, 0.1)';
            } else {
                tab.style.color = COLORS.textSecondary;
            }

            tab.addEventListener('click', () => {
                currentTab = id;
                CONFIG.currentPanelTab = id;
                refreshPanel();
            });

            return tab;
        };

        tabContainer.appendChild(createTab('settings', 'Настройки'));
        tabContainer.appendChild(createTab('tracking', 'Отслеживание'));

        panel.appendChild(tabContainer);

        const contentContainer = document.createElement('div');
        contentContainer.id = 'ozon-panel-content';
        contentContainer.style.cssText = `
            padding: 0;
            overflow-y: auto;
            flex-grow: 1;
        `;
        panel.appendChild(contentContainer);

        document.body.appendChild(panel);
        refreshPanel();

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.title = 'Закрыть панель';
        closeBtn.style.cssText = `
            position: absolute;
            top: 14px;
            right: 14px;
            background: rgba(255,255,255,0.1);
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: ${COLORS.text};
            font-size: 20px;
            line-height: 1;
            transition: all 0.2s;
        `;
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
            closeBtn.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.transform = 'rotate(0)';
        });
        closeBtn.addEventListener('click', () => {
            panel.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                panel.remove();
                panelCreated = false;
            }, 300);
        });
        header.appendChild(closeBtn);

        return panel;
    }

    // Обновление стилей панели
    function refreshPanelStyles() {
        const panel = document.getElementById('ozon-enhancer-panel');
        if (!panel) return;

        panel.style.background = COLORS.surface;
        panel.style.color = COLORS.text;
        panel.style.borderColor = COLORS.border;
        panel.style.boxShadow = COLORS.shadow;

        const header = panel.querySelector('div:first-child');
        if (header) {
            header.style.background = `linear-gradient(45deg, ${COLORS.background}, rgba(30,30,30,0.9))`;
            header.style.color = COLORS.primary;
            header.style.borderBottomColor = COLORS.border;
        }

        const tabContainer = document.getElementById('ozon-tab-container');
        if (tabContainer) {
            tabContainer.style.background = COLORS.background;
            tabContainer.style.borderBottomColor = COLORS.border;
        }
    }

    // Обновление содержимого панели
    function refreshPanel() {
        if (!panelCreated) return;

        const tabContainer = document.getElementById('ozon-tab-container');
        if (tabContainer) {
            const tabs = tabContainer.querySelectorAll('[data-tab]');
            tabs.forEach(tab => {
                if (tab.dataset.tab === currentTab) {
                    tab.style.borderBottomColor = COLORS.primary;
                    tab.style.color = COLORS.primary;
                    tab.style.background = 'rgba(187, 134, 252, 0.1)';
                } else {
                    tab.style.borderBottomColor = 'transparent';
                    tab.style.color = COLORS.textSecondary;
                    tab.style.background = 'transparent';
                }
            });
        }

        const contentContainer = document.getElementById('ozon-panel-content');
        if (!contentContainer) return;

        contentContainer.innerHTML = '';

        switch (currentTab) {
            case 'settings':
                renderSettingsTab(contentContainer);
                break;
            case 'tracking':
                renderTrackingTab(contentContainer);
                break;
        }
    }

    // Рендер вкладки настроек
    function renderSettingsTab(container) {
        const settingsContainer = document.createElement('div');
        settingsContainer.style.padding = '16px';
        container.appendChild(settingsContainer);

        settingsContainer.appendChild(createToggle(
            'Сортировка отзывов (от худших)',
            '📊',
            CONFIG.sortReviews,
            checked => {
                CONFIG.sortReviews = checked;
                if (checked) {
                    isSortingApplied = false;
                    sortReviews();
                }
            }
        ));

        settingsContainer.appendChild(createToggle(
            'Авто-раскрытие описания',
            '📝',
            CONFIG.expandDescription,
            checked => {
                CONFIG.expandDescription = checked;
                if (checked) expandDescription();
            }
        ));

        settingsContainer.appendChild(createToggle(
            'Отслеживание цен',
            '💰',
            CONFIG.trackPrices,
            checked => CONFIG.trackPrices = checked
        ));

        settingsContainer.appendChild(createToggle(
            'Уведомления о снижении цен',
            '🔔',
            CONFIG.priceDropNotifications,
            checked => CONFIG.priceDropNotifications = checked
        ));
    }

    // Рендер вкладки отслеживания
    function renderTrackingTab(container) {
        const trackingContainer = document.createElement('div');
        trackingContainer.style.padding = '16px';
        container.appendChild(trackingContainer);

        const headerRow = document.createElement('div');
        headerRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        `;

        const title = document.createElement('div');
        title.textContent = 'Отслеживание цен';
        title.style.cssText = `
            font-weight: 600;
            font-size: 15px;
            color: ${COLORS.text};
        `;
        headerRow.appendChild(title);

        const stats = document.createElement('div');
        stats.textContent = `${CONFIG.trackedItems.length} из ${CONFIG.maxTrackedItems}`;
        stats.style.cssText = `
            font-size: 13px;
            color: ${COLORS.textSecondary};
        `;
        headerRow.appendChild(stats);
        trackingContainer.appendChild(headerRow);

        const actionsRow = document.createElement('div');
        actionsRow.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        `;

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Обновить цены';
        refreshButton.style.cssText = `
            background: rgba(255,255,255,0.1);
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            color: ${COLORS.text};
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s;
        `;
        refreshButton.innerHTML = '🔄 ' + refreshButton.textContent;
        refreshButton.addEventListener('mouseover', () => {
            refreshButton.style.background = 'rgba(255,255,255,0.15)';
            refreshButton.style.transform = 'translateY(-1px)';
        });
        refreshButton.addEventListener('mouseout', () => {
            refreshButton.style.background = 'rgba(255,255,255,0.1)';
            refreshButton.style.transform = 'none';
        });
        refreshButton.addEventListener('click', () => {
            refreshButton.textContent = 'Обновление...';
            refreshButton.disabled = true;
            checkTrackedPrices(true);
            setTimeout(() => {
                refreshButton.textContent = 'Обновить цены';
                refreshButton.disabled = false;
            }, 3000);
        });
        actionsRow.appendChild(refreshButton);

        if (location.pathname.includes('/product/')) {
            const addButton = document.createElement('button');
            addButton.textContent = 'Добавить текущий';
            addButton.style.cssText = `
                background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.primaryVariant});
                color: ${COLORS.background};
                border: none;
                padding: 10px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-weight: 500;
                transition: all 0.2s;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            `;
            addButton.innerHTML = '➕ ' + addButton.textContent;
            addButton.addEventListener('mouseover', () => {
                addButton.style.transform = 'scale(1.03)';
                addButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            });
            addButton.addEventListener('mouseout', () => {
                addButton.style.transform = 'none';
                addButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            });
            addButton.addEventListener('click', () => trackCurrentProduct() && refreshPanel());
            actionsRow.appendChild(addButton);
        }

        trackingContainer.appendChild(actionsRow);

        const importExportRow = document.createElement('div');
        importExportRow.style.cssText = `
            display: flex;
            gap: 8px;
            margin: 12px 0 15px;
        `;

        const exportButton = document.createElement('button');
        exportButton.textContent = 'Экспорт данных';
        exportButton.style.cssText = `
            flex: 1;
            padding: 10px;
            background: linear-gradient(45deg, ${COLORS.secondary}, #018786);
            color: ${COLORS.background};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        exportButton.innerHTML = '📤 ' + exportButton.textContent;
        exportButton.addEventListener('mouseover', () => {
            exportButton.style.transform = 'scale(1.03)';
            exportButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });
        exportButton.addEventListener('mouseout', () => {
            exportButton.style.transform = 'none';
            exportButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
        exportButton.addEventListener('click', () => {
            const data = JSON.stringify(CONFIG.trackedItems, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `ozon_tracking_data_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        const importButton = document.createElement('button');
        importButton.textContent = 'Импорт данных';
        importButton.style.cssText = `
            flex: 1;
            padding: 10px;
            background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.primaryVariant});
            color: ${COLORS.background};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        importButton.innerHTML = '📥 ' + importButton.textContent;
        importButton.addEventListener('mouseover', () => {
            importButton.style.transform = 'scale(1.03)';
            importButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });
        importButton.addEventListener('mouseout', () => {
            importButton.style.transform = 'none';
            importButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
        importButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        const currentItems = [...CONFIG.trackedItems];

                        importedData.forEach(importedItem => {
                            const existingIndex = currentItems.findIndex(item => item.article === importedItem.article);

                            if (existingIndex >= 0) {
                                const existingItem = currentItems[existingIndex];
                                const mergedHistory = [...existingItem.priceHistory];

                                importedItem.priceHistory.forEach(importedPrice => {
                                    if (!mergedHistory.some(p => p.date === importedPrice.date)) {
                                        mergedHistory.push(importedPrice);
                                    }
                                });

                                mergedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

                                currentItems[existingIndex] = {
                                    ...existingItem,
                                    priceHistory: mergedHistory,
                                    initialPrice: Math.min(existingItem.initialPrice, importedItem.initialPrice),
                                    currentPrice: importedItem.currentPrice || existingItem.currentPrice,
                                    notificationThreshold: importedItem.notificationThreshold !== undefined ?
                                        importedItem.notificationThreshold : existingItem.notificationThreshold
                                };
                            } else {
                                currentItems.push({
                                    ...importedItem,
                                    notificationThreshold: importedItem.notificationThreshold !== undefined ?
                                        importedItem.notificationThreshold : 0.2
                                });
                            }
                        });

                        CONFIG.trackedItems = currentItems;
                        refreshPanel();
                        showToast(`Успешно импортировано ${importedData.length} товаров`, 'success');
                    } catch (error) {
                        showToast('Ошибка при импорте данных: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            });

            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 100);
        });

        importExportRow.appendChild(exportButton);
        importExportRow.appendChild(importButton);
        trackingContainer.appendChild(importExportRow);

        const manualAddForm = document.createElement('div');
        manualAddForm.style.cssText = `
            display: flex;
            gap: 8px;
            margin: 12px 0 20px;
        `;

        const articleInput = document.createElement('input');
        articleInput.type = 'text';
        articleInput.placeholder = 'Введите артикул товара';
        articleInput.style.cssText = `
            flex-grow: 1;
            padding: 10px;
            border: 1px solid ${COLORS.border};
            border-radius: 6px;
            font-size: 13px;
            background: rgba(255,255,255,0.05);
            color: ${COLORS.text};
            outline: none;
            transition: all 0.2s;
        `;
        articleInput.addEventListener('focus', () => {
            articleInput.style.borderColor = COLORS.primary;
            articleInput.style.boxShadow = `0 0 0 2px ${COLORS.primary}33`;
        });
        articleInput.addEventListener('blur', () => {
            articleInput.style.borderColor = COLORS.border;
            articleInput.style.boxShadow = 'none';
        });

        const manualAddButton = document.createElement('button');
        manualAddButton.textContent = 'Добавить';
        manualAddButton.style.cssText = `
            background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.primaryVariant});
            color: ${COLORS.background};
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        manualAddButton.addEventListener('mouseover', () => {
            manualAddButton.style.transform = 'scale(1.03)';
            manualAddButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });
        manualAddButton.addEventListener('mouseout', () => {
            manualAddButton.style.transform = 'none';
            manualAddButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
        manualAddButton.addEventListener('click', () => {
            const article = articleInput.value.trim();
            if (!article) {
                showToast('Пожалуйста, введите артикул товара', 'error');
                return;
            }

            manualAddButton.textContent = 'Добавление...';
            manualAddButton.disabled = true;

            trackProductByArticle(article).then(success => {
                manualAddButton.textContent = 'Добавить';
                manualAddButton.disabled = false;
                if (success) {
                    articleInput.value = '';
                    refreshPanel();
                }
            });
        });

        manualAddForm.appendChild(articleInput);
        manualAddForm.appendChild(manualAddButton);
        trackingContainer.appendChild(manualAddForm);

        const trackedItemsContainer = document.createElement('div');
        trackedItemsContainer.id = 'ozon-tracked-items';
        trackedItemsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 4px;
        `;

        if (CONFIG.trackedItems.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.textContent = 'Нет отслеживаемых товаров';
            emptyState.style.cssText = `
                text-align: center;
                padding: 30px 15px;
                color: ${COLORS.textSecondary};
                font-size: 13px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
            `;
            trackedItemsContainer.appendChild(emptyState);
        } else {
            CONFIG.trackedItems.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.dataset.index = index;
                itemEl.draggable = true;
                itemEl.style.cssText = `
                    background: linear-gradient(45deg, rgba(30,30,30,0.8), rgba(50,50,50,0.4));
                    border-radius: 8px;
                    padding: 12px;
                    position: relative;
                    transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    cursor: grab;
                `;
                itemEl.addEventListener('mouseover', () => {
                    itemEl.style.transform = 'translateY(-2px)';
                    itemEl.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
                });
                itemEl.addEventListener('mouseout', () => {
                    itemEl.style.transform = 'none';
                    itemEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                });

                itemEl.addEventListener('dragstart', (e) => {
                    dragStartIndex = parseInt(itemEl.dataset.index);
                    e.dataTransfer.setData('text/plain', dragStartIndex.toString());
                    itemEl.style.opacity = '0.4';
                });

                itemEl.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    itemEl.style.border = `2px dashed ${COLORS.primary}`;
                });

                itemEl.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                itemEl.addEventListener('dragleave', () => {
                    itemEl.style.border = 'none';
                });

                itemEl.addEventListener('drop', (e) => {
                    e.preventDefault();
                    itemEl.style.border = 'none';

                    const dragEndIndex = parseInt(itemEl.dataset.index);
                    if (dragStartIndex === dragEndIndex) return;

                    const items = [...CONFIG.trackedItems];
                    const draggedItem = items[dragStartIndex];
                    items.splice(dragStartIndex, 1);
                    items.splice(dragEndIndex, 0, draggedItem);

                    CONFIG.trackedItems = items;
                    refreshPanel();
                });

                itemEl.addEventListener('dragend', () => {
                    itemEl.style.opacity = '1';
                    dragStartIndex = null;
                });

                const itemName = document.createElement('a');
                itemName.href = item.url;
                itemName.textContent = item.name.length > 40 ? item.name.substring(0, 40) + '...' : item.name;
                itemName.title = item.name;
                itemName.target = '_blank';
                itemName.style.cssText = `
                    font-weight: 500;
                    display: block;
                    margin-bottom: 8px;
                    text-decoration: none;
                    color: ${COLORS.primary};
                    font-size: 14px;
                    transition: all 0.2s;
                `;
                itemName.addEventListener('mouseover', () => {
                    itemName.style.textShadow = `0 0 8px ${COLORS.primary}80`;
                });
                itemName.addEventListener('mouseout', () => {
                    itemName.style.textShadow = 'none';
                });

                const priceInfo = document.createElement('div');
                const initialPrice = item.initialPrice;
                const currentPrice = item.currentPrice;
                const diff = currentPrice - initialPrice;
                const diffPercent = ((Math.abs(diff) / initialPrice) * 100).toFixed(1);

                priceInfo.innerHTML = `
                    <div style="font-size: 16px; font-weight: 700; color: ${diff < 0 ? COLORS.success : COLORS.text}">
                        ${BYN_FORMATTER.format(currentPrice)}
                    </div>
                    <div style="font-size: 13px; color: ${COLORS.textSecondary}; margin-top: 4px;">
                        ${diff === 0 ? 'Без изменений' :
                         diff < 0 ? `▼ ${BYN_FORMATTER.format(Math.abs(diff))} (${diffPercent}%)` :
                         `▲ ${BYN_FORMATTER.format(diff)} (${diffPercent}%)`}
                    </div>
                    <div style="font-size: 12px; color: ${COLORS.textSecondary}; margin-top: 2px;">
                        Добавлен: ${new Date(item.addedDate).toLocaleDateString()}
                    </div>
                `;

                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.cssText = `
                    display: flex;
                    justify-content: flex-end;
                    gap: 6px;
                    margin-top: 10px;
                `;

                const settingsBtn = document.createElement('button');
                settingsBtn.title = 'Настройки товара';
                settingsBtn.style.cssText = `
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    color: ${COLORS.text};
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                `;
                settingsBtn.innerHTML = '⚙️ Настройки';
                settingsBtn.addEventListener('mouseover', () => {
                    settingsBtn.style.background = 'rgba(255,255,255,0.15)';
                    settingsBtn.style.transform = 'translateY(-1px)';
                });
                settingsBtn.addEventListener('mouseout', () => {
                    settingsBtn.style.background = 'rgba(255,255,255,0.1)';
                    settingsBtn.style.transform = 'none';
                });
                settingsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showItemSettings(item);
                });

                const chartBtn = document.createElement('button');
                chartBtn.title = 'Показать график цены';
                chartBtn.style.cssText = `
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    color: ${COLORS.text};
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                `;
                chartBtn.innerHTML = '📈 График';
                chartBtn.addEventListener('mouseover', () => {
                    chartBtn.style.background = 'rgba(255,255,255,0.15)';
                    chartBtn.style.transform = 'translateY(-1px)';
                });
                chartBtn.addEventListener('mouseout', () => {
                    chartBtn.style.background = 'rgba(255,255,255,0.1)';
                    chartBtn.style.transform = 'none';
                });
                chartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPriceChart(item);
                });

                const removeBtn = document.createElement('button');
                removeBtn.title = 'Удалить из отслеживания';
                removeBtn.style.cssText = `
                    padding: 6px 12px;
                    background: rgba(255, 100, 100, 0.1);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    color: ${COLORS.error};
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                `;
                removeBtn.innerHTML = '✕ Удалить';
                removeBtn.addEventListener('mouseover', () => {
                    removeBtn.style.background = 'rgba(255, 100, 100, 0.2)';
                    removeBtn.style.transform = 'translateY(-1px)';
                });
                removeBtn.addEventListener('mouseout', () => {
                    removeBtn.style.background = 'rgba(255, 100, 100, 0.1)';
                    removeBtn.style.transform = 'none';
                });
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    removeTrackedItem(item.article);
                    refreshPanel();
                });

                buttonsContainer.appendChild(settingsBtn);
                buttonsContainer.appendChild(chartBtn);
                buttonsContainer.appendChild(removeBtn);

                itemEl.appendChild(itemName);
                itemEl.appendChild(priceInfo);
                itemEl.appendChild(buttonsContainer);
                trackedItemsContainer.appendChild(itemEl);
            });
        }

        trackingContainer.appendChild(trackedItemsContainer);

        if (CONFIG.lastPriceCheckTime) {
            const lastCheckTime = new Date(CONFIG.lastPriceCheckTime);
            const lastCheck = document.createElement('div');
            lastCheck.textContent = `Последняя проверка: ${lastCheckTime.toLocaleDateString('ru-RU')} ${lastCheckTime.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;
            lastCheck.style.cssText = `
                font-size: 12px;
                color: ${COLORS.textSecondary};
                text-align: right;
                margin-top: 10px;
            `;
            trackingContainer.appendChild(lastCheck);
        }
    }

    // Создание элемента переключателя
    function createToggle(label, icon, checked, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid ${COLORS.border};
        `;

        const iconEl = document.createElement('div');
        iconEl.textContent = icon;
        iconEl.style.cssText = 'font-size: 18px; margin-right: 10px; width: 22px; text-align: center;';
        container.appendChild(iconEl);

        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            font-weight: 500;
            font-size: 13px;
            color: ${COLORS.text};
        `;
        textContainer.appendChild(labelEl);
        container.appendChild(textContainer);

        const toggleContainer = document.createElement('label');
        toggleContainer.style.cssText = `
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
            flex-shrink: 0;
        `;

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = checked;
        toggleInput.style.cssText = `
            opacity: 0;
            width: 0;
            height: 0;
        `;
        toggleInput.addEventListener('change', () => onChange(toggleInput.checked));

        const toggleSlider = document.createElement('span');
        toggleSlider.style.cssText = `
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #444;
            transition: .4s;
            border-radius: 22px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
        `;

        const toggleKnob = document.createElement('span');
        toggleKnob.style.cssText = `
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        `;

        toggleSlider.appendChild(toggleKnob);
        toggleContainer.appendChild(toggleInput);
        toggleContainer.appendChild(toggleSlider);
        container.appendChild(toggleContainer);

        const updateToggleStyle = () => {
            if (toggleInput.checked) {
                toggleSlider.style.backgroundColor = COLORS.primary;
                toggleSlider.style.boxShadow = `inset 0 0 8px ${COLORS.primary}80`;
                toggleKnob.style.transform = 'translateX(18px)';
                iconEl.style.textShadow = `0 0 8px ${COLORS.primary}80`;
            } else {
                toggleSlider.style.backgroundColor = '#444';
                toggleSlider.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)';
                toggleKnob.style.transform = 'translateX(0)';
                iconEl.style.textShadow = 'none';
            }
        };
        toggleInput.addEventListener('change', updateToggleStyle);
        updateToggleStyle();

        return container;
    }

    // Создание кнопки активации панели
    function createPanelToggle() {
        if (document.getElementById('ozon-enhancer-toggle')) return;

        const toggle = document.createElement('button');
        toggle.id = 'ozon-enhancer-toggle';
        toggle.innerHTML = '<span style="font-size: 16px; margin-right: 6px;">⚡</span> Ozon Enhancer';
        toggle.addEventListener('click', createControlPanel);
        document.body.appendChild(toggle);
        return toggle;
    }

    // Проверка открытия галереи изображений
    function isGalleryOpen() {
        for (const selector of SELECTORS.gallerySelectors) {
            if (document.querySelector(selector)) {
                return true;
            }
        }
        return false;
    }

    // Сортировка отзывов по рейтингу
    function sortReviews() {
        if (!CONFIG.sortReviews || isSortingApplied) return;
        if (!location.pathname.includes('/product/')) return;

        const urlObj = new URL(location.href);
        const params = urlObj.searchParams;

        if (params.get('sort') !== 'score_asc') {
            params.set('sort', 'score_asc');
            history.replaceState(null, '', urlObj.toString());
            isSortingApplied = true;
            setTimeout(() => window.location.href = urlObj.toString(), 100);
        }
    }

    // Управление DOM-обновлениями
    function scheduleDomUpdate() {
        if (moScheduled) return;
        moScheduled = true;

        requestAnimationFrame(() => {
            moScheduled = false;
            createPanelToggle();
            isDescriptionExpanded = false;
            expandDescription();

            const toggleBtn = document.getElementById('ozon-enhancer-toggle');
            if (toggleBtn) {
                toggleBtn.style.display = isGalleryOpen() ? 'none' : 'flex';
            }
        });
    }

    // Добавление глобальных стилей
    GM_addStyle(`
        #ozon-enhancer-panel {
            transition: all 0.3s ease;
        }

        #ozon-enhancer-toggle {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryVariant}) !important;
            color: ${COLORS.background} !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 10px 16px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4) !important;
            transition: all 0.2s ease !important;
            display: flex;
            align-items: center;
            gap: 6px;
            animation: pulse 2s infinite;
        }

        #ozon-enhancer-toggle:hover {
            background: linear-gradient(135deg, #9a65d1 0%, #5d3a9e 100%) !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5) !important;
            animation: none;
        }

        #ozon-enhancer-toggle:active {
            transform: translateY(0) scale(1) !important;
        }

        #ozon-tracked-items::-webkit-scrollbar {
            width: 6px;
        }
        #ozon-tracked-items::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }
        #ozon-tracked-items::-webkit-scrollbar-thumb {
            background: ${COLORS.primary};
            border-radius: 4px;
        }

        #ozon-panel-content::-webkit-scrollbar {
            width: 6px;
        }
        #ozon-panel-content::-webkit-scrollbar-track {
            background: transparent;
        }
        #ozon-panel-content::-webkit-scrollbar-thumb {
            background: ${COLORS.primary};
            border-radius: 4px;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(187, 134, 252, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(187, 134, 252, 0); }
            100% { box-shadow: 0 0 0 0 rgba(187, 134, 252, 0); }
        }

        @keyframes toastIn {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes toastOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100px); opacity: 0; }
        }
    `);

    // Обработчики изменения истории браузера
    const updateState = (type) => {
        const orig = history[type];
        return function() {
            const result = orig.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };
    };

    history.pushState = updateState('pushState');
    history.replaceState = updateState('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));

    // Инициализация скрипта
    function init() {
        if (CONFIG.maxTrackedItems < DEFAULT_CONFIG.maxTrackedItems) {
            CONFIG.maxTrackedItems = DEFAULT_CONFIG.maxTrackedItems;
        }

        applyThemeStyles();

        createPanelToggle();
        sortReviews();
        expandDescription();

        const observer = new MutationObserver(scheduleDomUpdate);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let expandAttempts = 0;
        const expandInterval = setInterval(() => {
            if (!location.pathname.includes('/product/')) return;
            if (isDescriptionExpanded || expandAttempts >= 5) {
                clearInterval(expandInterval);
                return;
            }
            expandDescription();
            expandAttempts++;
        }, 3000);

        setInterval(() => checkTrackedPrices(), 6 * 60 * 60 * 1000);
        setTimeout(() => checkTrackedPrices(), 60000);

        window.addEventListener('beforeunload', () => {
            clearInterval(expandInterval);
            observer.disconnect();
        });
    }

    // Запуск скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    // Обработка смены URL
    window.addEventListener('locationchange', () => {
        isSortingApplied = false;
        isDescriptionExpanded = false;
        sortReviews();
        expandDescription();
        if (panelCreated) refreshPanel();
    });
})();
