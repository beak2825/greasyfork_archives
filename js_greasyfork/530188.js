// ==UserScript==
// @name         Wishlist Cards Indicator 2.0
// @namespace    http://animestars.org/
// @version      3.9
// @description  Обводка карт из списка желаемого
// @author       Sandr
// @license      MIT
// @match        *://*.animestars.org/*
// @match        *://*.animesss.com/*
// @match        *://*.animesss.tv/*
// @match        *://*.asstars.tv/*
// @match        *://*.astars.club/*
// @match        *://*.asstars.online/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://i.imgur.com/nozwUMi.png
// @downloadURL https://update.greasyfork.org/scripts/530188/Wishlist%20Cards%20Indicator%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/530188/Wishlist%20Cards%20Indicator%2020.meta.js
// ==/UserScript==


(function () {
    'use strict';

function watchForFullCardList() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (
                    node.nodeType === 1 &&
                    node.classList.contains('anime-cards--full-page')
                ) {
                    // Нашли нужный контейнер — подождём чуть-чуть, потом подсветим
                    setTimeout(() => {
                        highlightWishlistCards();
                    }, 1000);
                }
            }
        }
    });

    // Наблюдаем за телом документа (или любым более подходящим родителем)
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}


    // Список доступных цветов для подсветки
    const colorPalette = {
       "red": "красный",
       "orange": "оранжевый",
       "gold": "золотой",
       "yellow": "жёлтый",
       "lime": "лаймовый",
       "lightgreen": "светло-зелёный",
       "green": "зелёный",
       "cyan": "бирюзовый",
       "lightblue": "светло-синий",
       "blue": "синий",
       "darkblue": "тёмно-синий",
       "purple": "фиолетовый",
       "magenta": "маджента",
       "gray": "серый",
       "white": "белый"
    };

    let highlightColor = GM_getValue('highlightColor', 'green'); // По умолчанию цвет зеленый
    let skipLockedCards = GM_getValue('skipLockedCards', true);

    function getUserId() {
        const userElement = document.querySelector('.lgn__name span');
        return userElement ? userElement.textContent.trim() : null;
    }

    function getWishlist() {
        const userId = getUserId();
        if (!userId) return [];
        let wishlist = GM_getValue(`wishlist_${userId}`);
        if (!wishlist) {
            wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`)) || [];
            if (wishlist.length > 0) {
                GM_setValue(`wishlist_${userId}`, wishlist);
                localStorage.removeItem(`wishlist_${userId}`);
            }
        }
        return wishlist;
    }

    function saveList(key, list) {
        const userId = getUserId();
        if (userId) {
            GM_setValue(`${key}_${userId}`, list);
        }
    }

    function getPageCards() {
        return [...document.querySelectorAll('.remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .card-show__placeholder')];
    }

function highlightWishlistCards() {
    let wishlist = getWishlist();
    let cards = getPageCards();

    cards.forEach((card) => {
        const href = card.getAttribute('href') || card.dataset.href;
        const cardId = href ? parseInt(href.match(/(\d+)/)?.[0], 10) : parseInt(card.getAttribute('data-id'), 10);

        if (cardId && wishlist.includes(cardId)) {
            card.style.outline = `3px solid ${highlightColor}`;
            card.style.transform = 'scale(0.97)';
        } else {
            card.style.outline = '';
            card.style.transform = '';
        }
    });
}

    function updateHighlightColor(color) {
        highlightColor = color;
        GM_setValue('highlightColor', color);
        highlightWishlistCards();
    }

    // Создаём палитру цветов
    function createColorPalette() {
        let paletteContainer = document.createElement('div');
        paletteContainer.style.position = 'fixed';
        paletteContainer.style.top = '50%';
        paletteContainer.style.right = '10px';
        paletteContainer.style.transform = 'translateY(-50%)';
        paletteContainer.style.zIndex = '1000';
        paletteContainer.style.display = 'grid';
        paletteContainer.style.gridTemplateColumns = 'repeat(5, 40px)'; // 5 колонок
        paletteContainer.style.gridGap = '5px';

        for (let color of Object.keys(colorPalette)) {
            let colorButton = document.createElement('button');
            colorButton.style.width = '40px';
            colorButton.style.height = '40px';
            colorButton.style.border = 'none';
            colorButton.style.borderRadius = '5px';
            colorButton.style.cursor = 'pointer';
            colorButton.style.backgroundColor = color;
            colorButton.addEventListener('click', () => updateHighlightColor(color));
            paletteContainer.appendChild(colorButton);
        }

        document.body.appendChild(paletteContainer);
    }

    // Регистрируем команду
    GM_registerMenuCommand("Выбрать цвет подсветки", createColorPalette);
    GM_registerMenuCommand("Очистить список желаемого", clearWishlist);
    GM_registerMenuCommand("Переключить пропуск зафиксированых", toggleSkipLocked);

function toggleSkipLocked() {
    skipLockedCards = !skipLockedCards;
    GM_setValue('skipLockedCards', skipLockedCards);
    showNotification(`Зафиксированые карты теперь ${skipLockedCards ? 'пропускаются' : 'учитываются'} при добавлении`);
    highlightWishlistCards(); // не обязательно, но вдруг полезно
}

function addCardsToWishlist(cards) {
    let wishlist = getWishlist();
    let addedCount = 0;
    showNotification('Добавление карт...');

    cards.forEach((card) => {
        // Пропускаем заблокированные карты
        const lockBtn = card.querySelector('.card-offer-lock-btn[data-locked="1"]');
        if (lockBtn && skipLockedCards) return;

        const href = card.getAttribute('href') || card.dataset.href;
        const cardId = href ? parseInt(href.match(/(\d+)/)?.[0], 10) : parseInt(card.getAttribute('data-id'), 10);

        if (cardId && !wishlist.includes(cardId)) {
            wishlist.push(cardId);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        saveList('wishlist', wishlist);
        highlightWishlistCards();
        showNotification(`${addedCount} карт добавлено!`);
    } else {
        showNotification(`Нет новых карт для добавления`);
    }
}
    function removeCardsFromWishlist(cards) {
        let wishlist = getWishlist();
        let removedCount = 0;

        cards.forEach((card) => {
            const href = card.getAttribute('href') || card.dataset.href;
            const cardId = href ? parseInt(href.match(/(\d+)/)?.[0], 10) : parseInt(card.getAttribute('data-id'), 10);

            if (cardId && wishlist.includes(cardId)) {
                wishlist = wishlist.filter(id => id !== cardId);
                removedCount++;
            }
        });

        saveList('wishlist', wishlist);
        highlightWishlistCards();

        if (removedCount > 0) {
            showNotification('Карты удалены!');
        }

        if (removedCount > 0) {
            updateMobileCounter(removedCount);
        }
    }

    function updateMobileCounter(count) {
        const counterElement = document.querySelector('.mobile-counter');
        if (counterElement) {
            counterElement.textContent = count;
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '15px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = '#fff';
        notification.style.borderRadius = '8px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '1000';
        notification.style.textAlign = 'center';
        notification.style.maxWidth = '80%';

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2500);
    }

function createButtons() {
    const url = window.location.href;
    const isNeedPage = url.includes('/cards/need/') || url.includes('/cards/need/page/');
    const isUserCardsPage = url.includes('/user/') && url.includes('/cards/') && !isNeedPage;
    const isVideoPage = !!document.querySelector('.page__stats-caption span.fal.fa-bookmark');
    if (!isNeedPage && !isUserCardsPage && !isVideoPage) return;

    // === Сохраняемое состояние панели ===
    let collapsed = GM_getValue('panelCollapsed', true);

    // === Панель кнопок ===
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = collapsed ? '-70px' : '10px';
    panel.style.transform = 'translateY(-50%)';
    panel.style.zIndex = '1000';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '10px';
    panel.style.transition = 'left 0.3s ease';

    if (isNeedPage) {
        const addButton = document.createElement('button');
        Object.assign(addButton.style, {
            padding: '10px',
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
        });
        addButton.textContent = '➕';
        addButton.addEventListener('click', () => addCardsToWishlist(getPageCards()));
        panel.appendChild(addButton);
    }

    const removeButton = document.createElement('button');
    Object.assign(removeButton.style, {
        padding: '10px',
        backgroundColor: '#FF5733',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
    });
    removeButton.textContent = '🗑️';
    removeButton.addEventListener('click', () => removeCardsFromWishlist(getPageCards()));
    panel.appendChild(removeButton);

    document.body.appendChild(panel);

    // === Кнопка-стрелка ===
    const toggle = document.createElement('div');
    toggle.textContent = collapsed ? '❯' : '❮';
    Object.assign(toggle.style, {
        position: 'fixed',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '10px',
        height: '50px',
        background: '#89929b',
        color: 'white',
        borderRadius: '0 6px 6px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: '1001',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'none'
    });

    // === Переключатель панели (с сохранением состояния) ===
    toggle.addEventListener('click', () => {
        collapsed = !collapsed;
        GM_setValue('panelCollapsed', collapsed);
        panel.style.left = collapsed ? '-70px' : '10px';
        toggle.textContent = collapsed ? '❯' : '❮';
    });

    document.body.appendChild(toggle);
}



    function observeFeedUpdates() {
        if (!window.location.href.includes('/cards/') && !window.location.href.includes('/trades/')) return;
        let observer = new MutationObserver(() => highlightWishlistCards());
        observer.observe(document.body, { childList: true, subtree: true });
    }
    function clearWishlist() {
    const userId = getUserId();
    if (userId) {
        GM_setValue(`wishlist_${userId}`, []);
        showNotification("Список желаемого очищен!");
        highlightWishlistCards(); // чтобы обновить визуально
      }
   }
    createButtons();
    highlightWishlistCards();
    observeFeedUpdates();

    watchForFullCardList();
})();

