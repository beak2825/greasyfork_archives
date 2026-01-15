// ==UserScript==
// @name         Card Helper AStars | AnimeStars | ASStars
// @namespace    animestars.org
// @version      7.39
// @description  Отображения спроса карт и Авто-Лут карточек с просмотра
// @author       bmr
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @match        https://animesss.com/*
// @match        https://animesss.tv/*
// @match        https://ass.astars.club/*
// @match        https://as2.asstars.tv/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530853/Card%20Helper%20AStars%20%7C%20AnimeStars%20%7C%20ASStars.user.js
// @updateURL https://update.greasyfork.org/scripts/530853/Card%20Helper%20AStars%20%7C%20AnimeStars%20%7C%20ASStars.meta.js
// ==/UserScript==

const specialUserData = { // ЛЮТАЯ СМЕШНЯФКА (если хотите вырезать изменённые баннеры и клеймо у админов, удалите всё это отсюда и до...)
    'firstaid': { tagline: 'тихий и безопасный', poster: 'https://i.ibb.co/9HKtMFBj/2025-09-17-001908840.png' },
    'okimoto': { tagline: 'фанат bemore', poster: 'https://i.ibb.co/9HKtMFBj/2025-09-17-001908840.png' },
    'aletr0': { tagline: 'к ручке westerx', poster: 'https://i.ibb.co/LzLzvknG/2025-09-18-173543206.png' },
    'scheusal': { tagline: 'хз кто', poster: 'https://i.ibb.co/9HKtMFBj/2025-09-17-001908840.png' },
    'sunset': { tagline: 'бесконечный цикл овуляции', poster: 'https://i.ibb.co/v6hh2Vb8/2025-09-16-234458646.png' },
    'ohaywizz': { tagline: 'тикток мейкер, пиар менеджер, долбаёб', poster: 'https://i.ibb.co/JFrYDzFm/2025-09-17-001133782.png' },
    'barret': { tagline: 'следящий за ролями, важно', poster: 'https://i.ibb.co/9HKtMFBj/2025-09-17-001908840.png' },
    'cliff': { tagline: 'кто мой хозяин?', poster: 'https://i.ibb.co/QjMNYPqF/2025-09-18-183219846.png' }
}; // (..и до сюда)

const DELAY = 1800;

let posterObserver = null;
let isAutoLootEnabled = localStorage.getItem('isAutoLootEnabled') === 'true';
let autoLootIntervalId = null;
const AUTO_LOOT_INTERVAL_DURATION = 190000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let cardCounter = 0;
const cardClasses = '.remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .history__body-item, .card-pack__card';

let currentNotification = {
    element: null,
    id: null,
    type: null,
    timeoutId: null
};

function displayNotification(id, message, type = 'temporary', options = {}) {
    if (window.location.pathname.includes('/pm/') || window.location.pathname.includes('emotions.php') || window.location.pathname.includes('/messages/')) {
        return;
    }

    const { total, current, isSuccess = true, duration = 3500, sticky = false } = options;
    if (currentNotification.element && currentNotification.id !== id) {
        if (currentNotification.timeoutId) clearTimeout(currentNotification.timeoutId);
        if (currentNotification.element.parentNode) {
            currentNotification.element.remove();
        }
        currentNotification.element = null;
        currentNotification.id = null;
    }

    let notificationElement = currentNotification.element;

    if (!notificationElement || currentNotification.id !== id || (currentNotification.type === 'progress' && type !== 'progress')) {
        if (notificationElement && notificationElement.parentNode) {
            notificationElement.remove();
        }
        notificationElement = document.createElement('div');
        notificationElement.className = 'card-helper-status-notification';
        document.body.appendChild(notificationElement);
        currentNotification.element = notificationElement;
        currentNotification.id = id;
    }

    currentNotification.type = type;
    let iconHtml = '';
    if (type === 'progress') {
        iconHtml = '<div class="card-helper-spinner"></div>';
        if (total !== undefined && current !== undefined) {
            let countText = total === 'неизвестно' ? `${current}` : `${current}/${total}`;
            let progressMessageSuffix = `Обработано ${countText}`;
            message = `${message} ${progressMessageSuffix}`;
        }
    } else if (type === 'completion' || type === 'temporary') {
        const iconClass = isSuccess ?
        'card-helper-checkmark' : 'card-helper-crossmark';
        const iconChar = isSuccess ? '✔' : '✖';
        iconHtml = `<span class="${iconClass}">${iconChar}</span>`;
    }

    notificationElement.innerHTML = `
        <div class="ch-status-icon-container">${iconHtml}</div>
        <span class="card-helper-status-text">${message}</span>
    `;
    requestAnimationFrame(() => {
        notificationElement.classList.add('show');
    });
    if (currentNotification.timeoutId) {
        clearTimeout(currentNotification.timeoutId);
        currentNotification.timeoutId = null;
    }

    if (!sticky && (type === 'completion' || type === 'temporary')) {
        currentNotification.timeoutId = setTimeout(() => {
            hideCurrentNotification(id);
        }, duration);
    }
}

function updateNotificationProgress(id, messagePrefix, current, total) {
    if (currentNotification.id === id && currentNotification.type === 'progress') {
        const textElement = currentNotification.element.querySelector('.card-helper-status-text');
        let countText = total === 'неизвестно' ? `${current}` : `${current}/${total}`;
        let progressMessageSuffix = `Обработано ${countText}`;
        const fullMessage = `${messagePrefix} ${progressMessageSuffix}`;

        if (textElement && textElement.textContent !== fullMessage) {
            textElement.textContent = fullMessage;
        }
    } else {
        displayNotification(id, messagePrefix, 'progress', { current, total, sticky: true });
    }
}

function completeProgressNotification(id, message, isSuccess = true, duration = 3500) {
    displayNotification(id, message, 'completion', { isSuccess, duration });
}

function showTemporaryMessage(id, message, isSuccess = true, duration = 3500) {
    displayNotification(id, message, 'temporary', { isSuccess, duration });
}

function hideCurrentNotification(idToHide) {
    if (currentNotification.element && currentNotification.id === idToHide) {
        const element = currentNotification.element;
        element.classList.remove('show');
        if (currentNotification.timeoutId) {
            clearTimeout(currentNotification.timeoutId);
            currentNotification.timeoutId = null;
        }
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
            if (currentNotification.element === element) {
                currentNotification.element = null;
                currentNotification.id = null;
                currentNotification.type = null;
            }
        }, 400);
    }
}

function getCurrentDomain() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}`;
}

async function loadCard(cardId, maxRetries = 2, initialRetryDelay = 2500) {
    const cacheKey = 'cardId: ' + cardId;
    const cachedCard = await getCard(cacheKey);
    if (cachedCard) {
        return cachedCard;
    }

    const currentDomain = getCurrentDomain();
    let popularityCount = 0, needCount = 0, tradeCount = 0;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        if (attempt > 1) {
            const retryDelay = initialRetryDelay * Math.pow(1.5, attempt - 2);
            console.warn(`Карта ${cardId}: Попытка ${attempt}/${maxRetries + 1}. Ждем ${retryDelay / 1000}с перед повтором...`);
            await sleep(retryDelay);
        } else {
            await sleep(DELAY);
        }

        try {
            const mainCardPageResponse = await fetch(`${currentDomain}/cards/users/?id=${cardId}`);

            if (mainCardPageResponse.status === 403) {
                console.error(`Карта ${cardId}: Попытка ${attempt} - Ошибка 403 Forbidden.`);
                if (attempt === maxRetries + 1) return null;
                continue;
            }
            if (!mainCardPageResponse.ok) {
                console.error(`Карта ${cardId}: Попытка ${attempt} - Ошибка HTTP ${mainCardPageResponse.status}.`);
                if (attempt === maxRetries + 1) return null;
                continue;
            }

            const mainCardPageHtml = await mainCardPageResponse.text();
            const mainCardPageDoc = new DOMParser().parseFromString(mainCardPageHtml, 'text/html');

            popularityCount = parseInt(mainCardPageDoc.querySelector('#owners-count')?.textContent.trim(), 10) || 0;
            needCount = parseInt(mainCardPageDoc.querySelector('#owners-need')?.textContent.trim(), 10) || 0;
            tradeCount = parseInt(mainCardPageDoc.querySelector('#owners-trade')?.textContent.trim(), 10) || 0;

            if (popularityCount === 0 && needCount === 0 && tradeCount === 0) {
                if (attempt < maxRetries + 1) {
                    console.warn(`Карта ${cardId}: Попытка ${attempt} - все счетчики 0, повторяем.`);
                    continue;
                }
                console.warn(`Карта ${cardId}: Попытка ${attempt} (последняя) - принимаем нулевые счетчики.`);
            }

            const finalCardData = { popularityCount, needCount, tradeCount };
            await cacheCard(cacheKey, finalCardData);
            return finalCardData;

        } catch (error) {
            console.error(`Карта ${cardId}: Попытка ${attempt} - Исключение при загрузке:`, error);
            if (attempt === maxRetries + 1) return null;
        }
    }

    console.error(`Карта ${cardId}: Все ${maxRetries + 1} попытки загрузки не удались.`);
    return null;
}

function extractOwnerIdFromUrl(urlString) {
    try {
        const url = new URL(urlString, window.location.origin);
        const nameParam = url.searchParams.get('name');
        if (nameParam) {
            return nameParam;
        }
    } catch (e) {
        console.warn("Could not parse URL to get 'name' parameter:", urlString, e);
    }
    const match = urlString.match(/\/user\/([^\/]+)\/cards/);
    if (match && match[1]) {
        return match[1];
    }
    const broadMatch = urlString.match(/\/user\/([^\/?#]+)/);
    if (broadMatch && broadMatch[1] && broadMatch[1].toLowerCase() !== 'cards') {
        return broadMatch[1];
    }
    return null;
}

async function updateCardInfo(cardId, element) {
    if (!cardId || !element) return;

    try {
        const cardData = await loadCard(cardId);

        let stats = element.querySelector('.card-stats');
        if (stats) {
            stats.classList.remove('card-stats--placeholder', 'loading');
            stats.style.borderColor = '#ffffff';
            stats.style.borderStyle = 'dashed';
        } else {
            const oldStats = element.querySelector('.card-stats');
            if (oldStats) oldStats.remove();
            stats = document.createElement('div');
            stats.className = 'card-stats';
            element.appendChild(stats);
        }

        if (!cardData) {
            stats.innerHTML = '<span>Не удалось загрузить данные</span>';
            return;
        }

        const currentMode = getCardStatsMode();
        stats.classList.add(currentMode === 'full' ? 'card-stats--full' : 'card-stats--minimalistic');
        stats.classList.remove('card-stats--placeholder');

        if (currentMode === 'full') {
            stats.innerHTML = `
                <div class="stat-line"><i class="fas fa-users"></i> Имеют ${cardData.popularityCount}</div>
                <div class="stat-line"><i class="fas fa-heart"></i> Хотят ${cardData.needCount}</div>
                <div class="stat-line"><i class="fas fa-sync-alt"></i> Обмен ${cardData.tradeCount}</div>
            `;
        } else {
            stats.innerHTML = `
                <span title="Владельцев"><i class="fas fa-users"></i> ${cardData.popularityCount}</span>
                <span title="Хотят получить"><i class="fas fa-heart"></i> ${cardData.needCount}</span>
                <span title="Готовы обменять"><i class="fas fa-sync-alt"></i> ${cardData.tradeCount}</span>
            `;
        }
    } catch (error) {
        console.error("Критическая ошибка в updateCardInfo для cardId " + cardId + ":", error);
    }
}

function clearMarkFromCards() { cleanByClass('div-marked'); }
function removeAllLinkIcons() { cleanByClass('link-icon'); }
function cleanByClass(className) { document.querySelectorAll('.' + className).forEach(item => item.remove()); }

function getCardsOnPage() {
    return Array.from(document.querySelectorAll(cardClasses)).filter(cardEl => cardEl.offsetParent !== null);
}

async function processCards() {
    if (isCardRemeltPage()) {
        const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
        if (Object.keys(storedData).length < 1) { await readyRemeltCards(); return; }
    }
    removeMatchingWatchlistItems(); removeAllLinkIcons(); clearMarkFromCards();

    const cardsOnPage = getCardsOnPage();
    const cardsToProcess = cardsOnPage.filter(cardEl => !cardEl.querySelector('.card-stats:not(.card-stats--placeholder)'));

    let totalCardsToProcess = cardsToProcess.length;
    if (!totalCardsToProcess) return;

    const buttonId = 'processCards';
    startAnimation(buttonId);
    displayNotification(buttonId, 'Проверка спроса:', 'progress', { current: 0, total: totalCardsToProcess, sticky: true });
    let processedCardCount = 0;

    for (const cardElement of cardsToProcess) {
        if (cardElement.classList.contains('trade__inventory-item--lock') || cardElement.classList.contains('remelt__inventory-item--lock')) {
            processedCardCount++;
            continue;
        };

        const statsElement = cardElement.querySelector('.card-stats.card-stats--placeholder');
        if (statsElement) {
            statsElement.classList.add('loading');
        }

        let cardId = await getCardId(cardElement);
        if (cardId) {
            await updateCardInfo(cardId, cardElement);
        }

        processedCardCount++;
        updateNotificationProgress(buttonId, 'Проверено карт:', processedCardCount, totalCardsToProcess);

        if (cardElement.classList.contains('lootbox__card')) {
            cardElement.addEventListener('click', removeAllLinkIcons);
        }
    }
    completeProgressNotification(buttonId, 'Проверка спроса завершена', true);
    stopAnimation(buttonId);
}

function getCardStatsMode() {
    return localStorage.getItem('cardStatsMode') || 'minimalistic';
}

function setCardStatsMode(mode) {
    localStorage.setItem('cardStatsMode', mode);
}

function removeMatchingWatchlistItems() {
    const watchlistItems = document.querySelectorAll('.watchlist__item');
    if (watchlistItems.length == 0) return;
    let initialCount = watchlistItems.length;
    watchlistItems.forEach(item => {
        const episodesText = item.querySelector('.watchlist__episodes')?.textContent.trim();
        if (episodesText) {
            const matches = episodesText.match(/[\d]+/g);
            if (matches) {
                const currentEpisode = parseInt(matches[0], 10);
                const totalEpisodes = parseInt(matches.length === 4 ? matches[3] : matches[1], 10);
                if (currentEpisode === totalEpisodes) item.remove();
            }
        }
    });
    let currentCount = document.querySelectorAll('.watchlist__item').length;
    if (initialCount > currentCount) {
        showTemporaryMessage('watchlistUpdate', `Из списка удалены просмотренные аниме. Осталось: ${currentCount}`, true);
    }
}

function startAnimation(id) {
    const buttonElement = document.getElementById(id);
    if (buttonElement) {
        buttonElement.classList.add('is-working');
        buttonElement.style.animationPlayState = 'paused';
        const iconElement = buttonElement.querySelector('span[class*="fa-"]');
        if (iconElement) {
            iconElement.style.animation = 'pulseIcon 1s ease-in-out infinite';
        }
    }
}

function stopAnimation(id) {
    const buttonElement = document.getElementById(id);
    if (buttonElement) {
        buttonElement.classList.remove('is-working');
        if (!buttonElement.matches(':hover')) {
             buttonElement.style.animationPlayState = 'running';
        }
        const iconElement = buttonElement.querySelector('span[class*="fa-"]');
        if (iconElement) {
            iconElement.style.animation = '';
        }
    }
}

function getButton(id, iconClassFASuffix, percent, tooltipText, clickFunction) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = percent + '%';
    wrapper.style.right = '1%';
    wrapper.style.zIndex = '1000';

    const buttonElement = document.createElement('button');
    buttonElement.id = id;
    buttonElement.classList.add('anim-interactive-button');

    const icon = document.createElement('span');
    icon.className = 'fal fa-' + iconClassFASuffix;
    buttonElement.appendChild(icon);

    let tooltipTimeout;
    const tooltip = document.createElement('div');
    tooltip.className = 'anim-button-tooltip';
    tooltip.textContent = tooltipText;

    buttonElement.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(-50%) translateX(0px)';
        buttonElement.style.animationPlayState = 'paused';
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
    });

    buttonElement.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-50%) translateX(10px)';
        if (!buttonElement.classList.contains('is-working')) {
            buttonElement.style.animationPlayState = 'running';
        }
    });

    buttonElement.addEventListener('click', (e) => {
        e.stopPropagation();
        clickFunction(e);
        if (window.innerWidth <= 768) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) translateX(0px)';
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-50%) translateX(10px)';
            }, 1500);
        }
    });

    wrapper.appendChild(buttonElement);
    wrapper.appendChild(tooltip);
    return wrapper;
}

function createToggleStatsModeButton(topPercent) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = topPercent + '%';
    wrapper.style.right = '1%';
    wrapper.style.zIndex = '9998';

    const button = document.createElement('button');
    button.id = 'toggleStatsModeButton';
    button.className = 'anim-interactive-button anim-interactive-button--small-toggle';

    const icon = document.createElement('span');

    function updateButtonAppearance() {
        const currentMode = getCardStatsMode();
        if (currentMode === 'minimalistic') {
            icon.className = 'fal fa-ellipsis-h';
        } else {
            icon.className = 'fal fa-list-alt';
        }
    }

    button.appendChild(icon);
    updateButtonAppearance();

    const tooltip = document.createElement('div');
    tooltip.className = 'anim-button-tooltip';
    tooltip.textContent = "Перекл. режимы отображения спроса";

    let tooltipTimeout;

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const oldMode = getCardStatsMode();
        const newMode = oldMode === 'minimalistic' ? 'full' : 'minimalistic';
        setCardStatsMode(newMode);
        updateButtonAppearance();

        const modeName = newMode === 'full' ? 'Полный' : 'Мин';
        showTemporaryMessage('modeSwitched', `Режим статистики изменен на: ${modeName}.`, true, 4000);

        if (window.innerWidth <= 768) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) translateX(0px)';
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-50%) translateX(10px)';
            }, 1500);
        }
    });

    button.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(-50%) translateX(0px)';
        button.style.animationPlayState = 'paused';
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
    });

    button.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-50%) translateX(10px)';
        if (!button.classList.contains('is-working')) {
           button.style.animationPlayState = 'running';
        }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(tooltip);

    return wrapper;
}

function addUpdateButton() {
    if (window.location.pathname.includes('/pm/') || window.location.pathname.includes('emotions.php') || window.frameElement) return;

    const uiContainer = document.createElement('div');
    uiContainer.id = 'cardHelperUiContainer';
    uiContainer.className = 'card-helper-ui-container';
    document.body.appendChild(uiContainer);

    if (!document.getElementById('processCards')) {
        uiContainer.appendChild(getButton('processCards', 'star', 0, 'Узнать спрос', processCards));
    }
    if (isMyCardPage() && !document.getElementById('readyToCharge')) {
        uiContainer.appendChild(getButton('readyToCharge', 'handshake', 0, 'Отметить всё как "Готов обменять"', readyToCharge));
    }
    if (isCardRemeltPage() && !document.getElementById('readyRemeltCards')) {
        uiContainer.appendChild(getButton('readyRemeltCards', 'yin-yang', 0, 'Кешировать карточки', readyRemeltCards));
    }
    if (!document.getElementById('clearCacheButton')) {
        uiContainer.appendChild(getButton('clearCacheButton', 'trash', 0, 'Очистить кеш карт', clearCardCache));
    }
    if (!document.getElementById('promoCodeLinkButton')) {
        document.body.appendChild(createPromoCodeButton());
    }
    if (!document.getElementById('toggleStatsModeButton')) {
        uiContainer.appendChild(createToggleStatsModeButton(0));
    }
    if (!document.getElementById('toggleAutoLootButton')) {
        uiContainer.appendChild(createToggleAutoLootButton(0));
    }

    createToggleUI_Button();
}

function createToggleUI_Button() {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    button.id = 'toggleUiButton';
    button.className = 'anim-interactive-button';

    const icon = document.createElement('span');
    button.appendChild(icon);

    const uiContainer = document.getElementById('cardHelperUiContainer');

    function updateState() {
        const isHidden = localStorage.getItem('isUiHidden') === 'true';
        if (isHidden) {
            uiContainer.classList.add('card-helper-ui-container--hidden');
            button.classList.add('ui-hidden');
            icon.className = 'fal fa-chevron-left';
        } else {
            uiContainer.classList.remove('card-helper-ui-container--hidden');
            button.classList.remove('ui-hidden');
            icon.className = 'fal fa-chevron-right';
        }
    }

    button.addEventListener('click', () => {
        const isCurrentlyHidden = localStorage.getItem('isUiHidden') === 'true';
        localStorage.setItem('isUiHidden', !isCurrentlyHidden);
        updateState();
    });

    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    updateState();
}

function displayUnreadMessagesBadge() {
    try {
        const messageLink = document.querySelector('a[href="/pm/"]');
        if (!messageLink) return;

        const countSpan = messageLink.querySelector('span:last-child');
        if (!countSpan || !countSpan.textContent) return;

        const match = countSpan.textContent.match(/\d+/);
        if (!match) return;

        const unreadCount = parseInt(match[0], 10);
        if (unreadCount === 0) return;

        const avatarContainer = document.querySelector('.header__ava');
        if (!avatarContainer) return;

        let badge = avatarContainer.querySelector('.pm-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'pm-badge';
            avatarContainer.appendChild(badge);
        }
        badge.textContent = unreadCount;
    } catch (e) {
        console.error("Ошибка при отображении значка сообщений:", e);
    }
}

function addPlaceholderToCard(cardElement) {
    if (!cardElement || typeof cardElement.querySelector !== 'function') return;
    if (cardElement.querySelector('.card-stats')) return;
    if (window.location.pathname.startsWith('/clubs/boost')) return;
    if (cardElement.closest('.lc_chat_li')) return;

    const placeholder = document.createElement('div');
    placeholder.className = 'card-stats card-stats--placeholder';
    placeholder.innerHTML = '<span>Узнать спрос</span>';

    const onClick = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (placeholder.classList.contains('loading')) return;
        placeholder.classList.add('loading');

        try {
            const cardId = await getCardId(cardElement);
            if (cardId) {
                await updateCardInfo(cardId, cardElement);
            } else {
                placeholder.innerHTML = '<span>Ошибка ID</span>';
                placeholder.classList.remove('loading');
            }
        } catch (error) {
            console.error("Ошибка при запросе спроса для одной карты:", error);
            placeholder.innerHTML = '<span>Ошибка</span>';
        }
    };

    placeholder.addEventListener('click', onClick);
    cardElement.appendChild(placeholder);
}

function addDemandPlaceholders() {
    if (window.location.pathname.startsWith('/clubs/boost')) {
        return;
    }

    const cardsOnPage = getCardsOnPage();
    cardsOnPage.forEach(cardElement => {
        if (cardElement.querySelector('.card-stats')) {
            return;
        }

        if (cardElement.closest('.lc_chat_li')) {
             return;
        }

        const placeholder = document.createElement('div');
        placeholder.className = 'card-stats card-stats--placeholder';
        placeholder.innerHTML = '<span>Узнать спрос</span>';

        const onClick = async (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (placeholder.classList.contains('loading')) return;
            placeholder.classList.add('loading');

            try {
                const cardId = await getCardId(cardElement);
                if (cardId) {
                    await updateCardInfo(cardId, cardElement);
                } else {
                    placeholder.innerHTML = '<span>Ошибка ID</span>';
                    placeholder.classList.remove('loading');
                }
            } catch (error) {
                console.error("Ошибка при запросе спроса для одной карты:", error);
                placeholder.innerHTML = '<span>Ошибка</span>';
                placeholder.classList.remove('loading');
            }
        };

        placeholder.addEventListener('click', onClick);
        cardElement.appendChild(placeholder);
    });
}

function isMyCardPage() {
    const pathname = window.location.pathname;
    const search = window.location.search;

    const oldPattern = /^\/user\/[^\/]+\/cards(\/page\/\d+\/)?$/;
    if (oldPattern.test(pathname)) {
        return true;
    }

    if (pathname === '/user/cards/' && search.startsWith('?name=')) {
        const params = new URLSearchParams(search);
        if (params.get('name') && params.get('name').length > 0) {
            return true;
        }
    }

    return false;
}

function isCardRemeltPage() { return (/^\/cards_remelt\//).test(window.location.pathname); }

async function readyRemeltCards() {
    const buttonId = 'readyRemeltCards';
    const notificationId = 'remeltCache';
    showTemporaryMessage(notificationId, 'Запрос на кеширование всех карт..', true, 2000);

    const userCardsLinkElement = document.querySelector('a.ncard__tabs-btn[href*="/user/"][href*="/cards/"]');
    const relativeHref = userCardsLinkElement ? userCardsLinkElement.href : null;

    if (!relativeHref) {
        showTemporaryMessage(notificationId, 'Не найдена ссылка на страницу "Мои карты" для начала кеширования.', false, 5000);
        return;
    }

    const absoluteHref = new URL(relativeHref, window.location.origin).href;

    removeMatchingWatchlistItems();
    removeAllLinkIcons();
    clearMarkFromCards();
    startAnimation(buttonId);

    try {
        await scrapeAllPages(absoluteHref);
    } catch (e) {
        showTemporaryMessage(notificationId, 'Произошла ошибка при кешировании.', false, 5000);
    } finally {
        stopAnimation(buttonId);
    }
}

function getCanonicalIdFromCacheByItemInstanceId(itemInstanceIdToFind) {
    const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
    if (!itemInstanceIdToFind) return null;

    for (const ownerKey in storedData) {
        if (Array.isArray(storedData[ownerKey])) {
            const foundCardData = storedData[ownerKey].find(card => card.itemInstanceId === itemInstanceIdToFind);
            if (foundCardData && foundCardData.canonicalCardId) {
                return foundCardData.canonicalCardId;
            }
        }
    }
    console.warn(`Канонический ID для экземпляра ${itemInstanceIdToFind} не найден в кеше animeCardsData.`);
    return null;
}

async function fetchWithRetries(url, retries = 2, delay = 2500) {
    for (let i = 0; i <= retries; i++) {
        try {
            const r = await fetch(url);
            if (r.ok) {
                return await r.text();
            }
            console.warn(`(Кеширование) Попытка ${i + 1} загрузить ${url} не удалась. Статус: ${r.status}`);
        } catch (e) {
            console.error(`(Кеширование) Попытка ${i + 1} загрузить ${url} не удалась. Ошибка:`, e);
        }
        if (i < retries) {
            await sleep(delay * (i + 1));
        }
    }
    console.error(`(Кеширование) Не удалось загрузить страницу ${url} после ${retries + 1} попыток.`);
    return null;
}

async function scrapeAllPages(firstPageHref) {
    const notificationId = 'scrapeAllPages';
    try {
        const firstPageResponse = await fetchWithRetries(firstPageHref);
        if (!firstPageResponse) {
            throw new Error(`Не удалось загрузить первую страницу: ${firstPageHref}`);
        }
        const firstPageDoc = new DOMParser().parseFromString(firstPageResponse, 'text/html');

        let storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
        let totalCardsInProfile = -1;

        const titleElement = firstPageDoc.querySelector('h1.ncard__main-title.ncard__main-title-2.as-center.bolder');
        if (titleElement) {
            const match = titleElement.textContent.match(/\((\d+)\s*шт\.\)/);
            if (match && match[1]) {
                totalCardsInProfile = parseInt(match[1], 10);
            }
        }

        const countCurrentlyCachedCards = () => {
            let count = 0;
            for (const ownerKey in storedData) {
                if (Array.isArray(storedData[ownerKey])) {
                    count += storedData[ownerKey].length;
                }
            }
            return count;
        };

        if (totalCardsInProfile !== -1) {
            let currentTotalCached = countCurrentlyCachedCards();
            if (totalCardsInProfile === currentTotalCached && currentTotalCached > 0) {
                showTemporaryMessage(notificationId, 'Кеш карточек уже актуален.', true);
                await processCards();
                return;
            }
        }

        const calculatedTotalForDisplay = totalCardsInProfile > 0 ? totalCardsInProfile : 'неизвестно';
        displayNotification(notificationId, 'Кеширование страниц:', 'progress', { current: countCurrentlyCachedCards(), total: calculatedTotalForDisplay, sticky: true });

        const currentAccountOwnerIdForCacheKey = extractOwnerIdFromUrl(firstPageHref);

        async function processBatchInStorage(doc) {
            const cardsElements = doc.querySelectorAll('.anime-cards__item');
            let newCardsThisBatch = 0;
            for (let i = 0; i < cardsElements.length; i += 10) {
                const cardGroup = Array.from(cardsElements).slice(i, i + 10);
                for (const cardEl of cardGroup) {
                    const itemInstanceId = cardEl.getAttribute('data-owner-id');
                    const canonicalCardId = cardEl.getAttribute('data-id');

                    if (!currentAccountOwnerIdForCacheKey || !itemInstanceId || !canonicalCardId) {
                        console.warn("Пропуск карты в scrapeAllPages: отсутствует itemInstanceId, canonicalCardId или ID владельца коллекции.", cardEl, "AccountOwnerID:", currentAccountOwnerIdForCacheKey);
                        continue;
                    }

                    const ownerKey = 'o_' + currentAccountOwnerIdForCacheKey;
                    if (!storedData[ownerKey]) storedData[ownerKey] = [];

                    if (!storedData[ownerKey].find(c => c.itemInstanceId === itemInstanceId)) {
                        storedData[ownerKey].push({
                            itemInstanceId: itemInstanceId,
                            canonicalCardId: canonicalCardId,
                            name: cardEl.getAttribute('data-name'),
                            rank: cardEl.getAttribute('data-rank'),
                            animeLink: cardEl.getAttribute('data-anime-link'),
                            image: cardEl.querySelector('img')?.getAttribute('src') || cardEl.getAttribute('data-image'),
                            ownerId: currentAccountOwnerIdForCacheKey
                        });
                        newCardsThisBatch++;
                    }
                }
                await sleep(10);
            }
            updateNotificationProgress(notificationId, 'Кешировано карт:', countCurrentlyCachedCards(), calculatedTotalForDisplay);
        }

        await processBatchInStorage(firstPageDoc);

        const pagination = firstPageDoc.querySelector('.pagination__pages');
        if (pagination) {
            const pageLinks = Array.from(pagination.querySelectorAll('a[href*="page="]'));
            let lastPageNumber = 1;

            if (pageLinks.length > 0) {
                const numbers = pageLinks
                    .map(a => {
                        const href = a.getAttribute('href');
                        if (!href) return null;
                        const match = href.match(/page=(\d+)/);
                        return match ? parseInt(match[1], 10) : null;
                    })
                    .filter(n => n !== null && n > 0);

                if (numbers.length > 0) {
                    lastPageNumber = Math.max(...numbers);
                }
            }

            if (lastPageNumber > 1) {
                for (let i = 2; i <= lastPageNumber; i++) {
                    const pageUrlObject = new URL(firstPageHref);
                    pageUrlObject.searchParams.set('page', i);
                    const pageUrl = pageUrlObject.href;
                    const pageHTML = await fetchWithRetries(pageUrl);
                    if (pageHTML) {
                        const nextPageDoc = new DOMParser().parseFromString(pageHTML, 'text/html');
                        await processBatchInStorage(nextPageDoc);
                    }
                    await sleep(1000 + Math.random() * 1500);
                    if (i % 5 === 0) {
                        localStorage.setItem('animeCardsData', JSON.stringify(storedData));
                    }
                }
            }
        } else {
             console.warn("(Кеширование) Блок пагинации не найден. Будет обработана только первая страница.");
        }

        localStorage.setItem('animeCardsData', JSON.stringify(storedData));
        completeProgressNotification(notificationId, 'Кеширование завершено. Всего в кеше: ' + countCurrentlyCachedCards(), true);
        await processCards();
    } catch (error) {
        console.error("Ошибка в scrapeAllPages:", error);
        completeProgressNotification(notificationId, 'Ошибка кеширования страниц.', false);
    }
}

async function getCardId(cardElement) {
    let cardId = cardElement.getAttribute('data-card-id') || cardElement.getAttribute('card-id');

    if (!cardId && cardElement.tagName === 'A' && typeof cardElement.hasAttribute === 'function' && cardElement.hasAttribute('href')) {
        const href = cardElement.getAttribute('href');
        if (href) {
            let match = href.match(/\/cards\/users\/\?id=(\d+)/);
            if (match && match[1]) {
                cardId = match[1];
            } else {
                match = href.match(/\/cards\/(\d+)\/users\//);
                if (match && match[1]) {
                    cardId = match[1];
                }
            }
        }
    }

    if (!cardId && typeof cardElement.matches === 'function') {
        if (cardElement.matches('.anime-cards__item') || cardElement.matches('.lootbox__card')) {
            cardId = cardElement.getAttribute('data-id');
        } else if (cardElement.matches('.remelt__inventory-item')) {
            const instanceIdFromRemelt = cardElement.getAttribute('data-id');
            if (instanceIdFromRemelt) {
                const canonicalIdFromCache = getCanonicalIdFromCacheByItemInstanceId(instanceIdFromRemelt);
                if (canonicalIdFromCache) {
                    cardId = canonicalIdFromCache;
                } else {
                     console.warn(`Не найден канонический ID в кеше для remelt item с instanceId ${instanceIdFromRemelt}.`);
                }
            }
        }
    }

    if (!cardId && cardElement.tagName !== 'A') {
        const linkElement = cardElement.querySelector('a[href*="/cards/users/?id="], a[href*="/cards/"][href*="/users/"]');
        if (linkElement) {
            const href = linkElement.getAttribute('href');
            let match = href.match(/\/cards\/users\/\?id=(\d+)/);
            if (match && match[1]) {
                cardId = match[1];
            } else {
                match = href.match(/\/cards\/(\d+)\/users\//);
                if (match && match[1]) {
                    cardId = match[1];
                }
            }
        }
    }

    return cardId;
}

async function getFirstCardByOwner(ownerId) {
    const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
    const key = 'o_' + ownerId;
    return storedData[key]?.[0] || null;
}

async function readyToCharge() {
    const buttonId = 'readyToCharge';
    displayNotification(buttonId, 'Подготовка к отметке карт...', 'progress', {sticky: true});
    let cardsOnPage = getCardsOnPage();
    if (!cardsOnPage || cardsOnPage.length === 0) { completeProgressNotification(buttonId, 'Карты на странице не найдены.', false); return; }
    const cardsToProcess = cardsOnPage.filter(cardEl => !cardEl.classList.contains('trade__inventory-item--lock'));
    const totalCardsToProcess = cardsToProcess.length;
    if (totalCardsToProcess === 0) { completeProgressNotification(buttonId, 'Нет карт для отметки.', false); return; }
    updateNotificationProgress(buttonId, 'Отмечаем карт:', 0, totalCardsToProcess);
    startAnimation(buttonId); clearMarkFromCards(); cardCounter = 0;
    let successfullyProcessedCount = 0, attemptedToProcessCount = 0;
    for (const cardElement of cardsToProcess) {
        cardElement.classList.add('charging-card');
        let idToSend = cardElement.getAttribute('data-owner-id') || await getCardId(cardElement);
        attemptedToProcessCount++;
        if (idToSend) {
            await sleep(1000 + Math.random() * 500);
            try { if (await readyToChargeCard(idToSend)) successfullyProcessedCount++; }
            catch (error) { console.error("Ошибка при отметке карты " + idToSend + ":", error); }
        }
        updateNotificationProgress(buttonId, 'Обработано карт:', attemptedToProcessCount, totalCardsToProcess);
        cardElement.classList.remove('charging-card');
    }
    completeProgressNotification(buttonId, `Отправлено на обмен ${cardCounter} из ${successfullyProcessedCount} (${attemptedToProcessCount} попыток).`, true, 5000);
    stopAnimation(buttonId);
}

async function readyToChargeCard(card_id_to_send) {
    try {
        await sleep(DELAY * 2 + Math.random() * DELAY);
        const data = await $.ajax({ url: "/engine/ajax/controller.php?mod=trade_ajax", type: "post", data: { action: "propose_add", type: 1, card_id: card_id_to_send, user_hash: dle_login_hash }, dataType: "json", cache: false });
        if (data?.error) {
            if (data.error === 'Слишком часто, подождите пару секунд и повторите действие') {
                await sleep(2500 + Math.random() * 1000); return await readyToChargeCard(card_id_to_send);
            }
            console.warn(`Ошибка от сервера (карта ${card_id_to_send}): ${data.error}`); return false;
        }
        if (data?.status == "added") { cardCounter++; return true; }
        if (data?.status == "deleted") { await sleep(1000); return await readyToChargeCard(card_id_to_send); }
        console.warn(`Неожиданный ответ от сервера для карты ${card_id_to_send}:`, data); return false;
    } catch (e) {
        console.error(`readyToChargeCard AJAX/исключение (ID ${card_id_to_send}):`, e.statusText || e.message || e);
        return false;
    }
}

function createPromoCodeButton() {
    const promoUrl = "/cards/pack/";

    const buttonElement = document.createElement('button');
    buttonElement.id = 'promoCodeLinkButton';
    buttonElement.className = 'anim-interactive-button promo-code-button-custom';

    const icon = document.createElement('span');
    icon.className = 'fal fa-gift';

    const text = document.createElement('span');
    text.textContent = 'Открытие Паков';

    buttonElement.appendChild(icon);
    buttonElement.appendChild(text);

    buttonElement.addEventListener('click', (e) => {
        e.preventDefault();

        const realSiteButton = document.querySelector('a.ncard__tabs-btn[href="/cards/pack/"]');

        if (realSiteButton) {
            realSiteButton.click();
        } else {
            window.location.href = promoUrl;
        }
    });

    return buttonElement;
}

function manageAutoLootInterval() {
    if (isAutoLootEnabled) {
        if (autoLootIntervalId === null) {
            autoLootIntervalId = setInterval(checkNewCard, AUTO_LOOT_INTERVAL_DURATION);
        }
    } else {
        if (autoLootIntervalId !== null) {
            clearInterval(autoLootIntervalId);
            autoLootIntervalId = null;
        }
    }
}

function ILoveAdmins() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'user' && pathParts[2] && !pathParts[3]) {
        const username = pathParts[2].toLowerCase();
        const userData = specialUserData[username];

        if (userData) {
            if (userData.tagline) {
                const allTaglines = document.querySelectorAll('.usp__group span.tagline');
                allTaglines.forEach(taglineSpan => {
                    if (!taglineSpan.closest('.dle-popup-userprofile') && !taglineSpan.closest('.nix-dialog-user')) {
                        taglineSpan.textContent = userData.tagline;
                    }
                });
            }
            if (userData.poster) {
                const posterDiv = document.querySelector('.usn__poster');
                if (posterDiv) {
                    const videoBG = posterDiv.querySelector('video#profilebg');
                    if (videoBG) {
                        videoBG.remove();
                    }
                    const newBackgroundStyle = `#000 url(${userData.poster}) center center / cover no-repeat`;
                    posterDiv.style.setProperty('background', newBackgroundStyle, 'important');

                    if (posterObserver) posterObserver.disconnect();

                    posterObserver = new MutationObserver((mutations) => {
                        for (const mutation of mutations) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                                if (posterDiv.style.background !== newBackgroundStyle) {
                                    posterDiv.style.setProperty('background', newBackgroundStyle, 'important');
                                }
                            }
                            if (mutation.type === 'childList') {
                                const resurrectedVideo = posterDiv.querySelector('video#profilebg');
                                if (resurrectedVideo) resurrectedVideo.remove();
                            }
                        }
                    });

                    posterObserver.observe(posterDiv, { attributes: true, attributeFilter: ['style'], childList: true });
                }
            }
        }
    }

    const allPopups = document.querySelectorAll(
        '.dle-popup-userprofile, .nix-dialog-user'
    );

    allPopups.forEach(popup => {
        const nameElement = popup.querySelector('.uspnew__name');
        const taglineSpan = popup.querySelector('.usp__group span.tagline');

        if (!nameElement || !taglineSpan) return;

        const username = nameElement.textContent.trim().toLowerCase();
        const userData = specialUserData[username];

        if (userData && userData.tagline) {
            taglineSpan.textContent = userData.tagline;
        }
    });
}

function createToggleAutoLootButton(topPercent) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = topPercent + '%';
    wrapper.style.right = '1%';
    wrapper.style.zIndex = '9997';

    const button = document.createElement('button');
    button.id = 'toggleAutoLootButton';
    button.className = 'anim-interactive-button anim-interactive-button--small-toggle';

    const icon = document.createElement('span');
    button.appendChild(icon);

    const tooltip = document.createElement('div');
    tooltip.className = 'anim-button-tooltip';
    wrapper.appendChild(button);
    wrapper.appendChild(tooltip);

    function updateAppearance() {
        if (isAutoLootEnabled) {
            icon.className = 'fal fa-robot';
            tooltip.textContent = 'Авто-лут ВКЛ';
        } else {
            icon.className = 'fal fa-power-off';
            tooltip.textContent = 'Авто-лут ВЫКЛ';
        }
    }

    updateAppearance();

    let tooltipTimeout;

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        isAutoLootEnabled = !isAutoLootEnabled;
        localStorage.setItem('isAutoLootEnabled', isAutoLootEnabled);
        manageAutoLootInterval();
        updateAppearance();

        showTemporaryMessage('autoLootToggle', `Авто-лут карт теперь ${isAutoLootEnabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}.`, true, 3000);

        if (window.innerWidth <= 768) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) translateX(0px)';
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-50%) translateX(10px)';
            }, 1500);
        }
    });

    button.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(-50%) translateX(0px)';
        button.style.animationPlayState = 'paused';
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
    });

    button.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-50%) translateX(10px)';
        if (!button.classList.contains('is-working')) {
            button.style.animationPlayState = 'running';
        }
    });

    return wrapper;
}

const style = document.createElement('style');
style.textContent = `
@keyframes glowEffect {
    0% { box-shadow: 0 0 5px #6c5ce7; }
    50% { box-shadow: 0 0 20px #6c5ce7; }
    100% { box-shadow: 0 0 5px #6c5ce7; }
}

@keyframes glowChargeEffect {
    0% { box-shadow: 0 0 7px #4CAF50; }
    50% { box-shadow: 0 0 25px #4CAF50; }
    100% { box-shadow: 0 0 7px #4CAF50; }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes breatheShadowInteractive {
    0% { box-shadow: 0 0 6px rgba(108, 92, 231, 0.2); transform: scale(1); }
    50% { box-shadow: 0 0 12px rgba(108, 92, 231, 0.5); transform: scale(1.02); }
    100% { box-shadow: 0 0 6px rgba(108, 92, 231, 0.2); transform: scale(1); }
}

@keyframes pulseWorkingBorderInteractive {
    0% { box-shadow: 0 0 0 0px rgba(86, 200, 239, 0.7), 0 3px 8px rgba(0,0,0,0.25); }
    70% { box-shadow: 0 0 0 10px rgba(86, 200, 239, 0), 0 5px 12px rgba(0,0,0,0.3); }
    100% { box-shadow: 0 0 0 0px rgba(86, 200, 239, 0), 0 3px 8px rgba(0,0,0,0.25); }
}

@keyframes pulseIcon {
    0% { transform: scale(1) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.2) rotate(0deg); opacity: 0.7; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes cardHelperSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.processing-card {
    position: relative;
}
.processing-card img {
    position: relative;
    z-index: 2;
}
.processing-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    z-index: 1;
    animation: glowEffect 1.5s infinite;
    pointer-events: none;
}

.charging-card {
    position: relative;
}
.charging-card img {
    position: relative;
    z-index: 2;
}
.charging-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    z-index: 1;
    animation: glowChargeEffect 1.5s infinite;
    pointer-events: none;
}

.card-stats {
    position: relative;
    background: linear-gradient(34deg, #4e2264 0%, #943aca 55%);
    padding: 8px;
    color: white;
    font-size: 12px;
    margin-top: 5px;
    border-radius: 5px;
    display: flex;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease;
    z-index: 0 !important;
    box-shadow: 0px 0px 8px 0px #a367dc;
    border: 1px dashed #ffffff !important;
}

.card-stats--minimalistic {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-stats--full {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
}

.card-stats--full .stat-line {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
}

.card-stats--full .stat-line:last-child {
    margin-bottom: 0;
}

.card-stats--full .stat-line i.fas {
    margin-right: 6px;
    font-size: 13px;
    width: 16px;
    text-align: center;
}

.card-stats--placeholder {
    background: #4a4a4a;
    box-shadow: none;
    border: 1px dashed #777;
    cursor: pointer;
    justify-content: center;
}

.card-stats--placeholder:hover {
    background: #5f5f5f;
}

.card-stats--placeholder.loading {
    color: transparent;
    pointer-events: none;
    position: relative;
}

.card-stats--placeholder.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid #666;
    border-top: 2px solid #ddd;
    border-radius: 50%;
    animation: cardHelperSpin 0.8s linear infinite;
}

.card-stats--full .stat-line {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
}
.card-stats--full .stat-line:last-child {
    margin-bottom: 0;
}
.card-stats--full .stat-line i.fas {
    margin-right: 6px;
    font-size: 13px;
    width: 16px;
    text-align: center;
}
.history__inner {
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: 15px !important;
}

.history__body {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 15px !important;
    padding: 15px !important;
    border-radius: 8px !important;
}

@media screen and (min-width: 769px) {
    .history__body-item {
        width: 120px !important;
        height: auto !important;
        transition: transform 0.2s !important;
    }
    .history__body-item img {
        width: 120px !important;
        height: auto !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
    }
}

.history__body-item:hover {
    transform: scale(1.05) !important;
    z-index: 2 !important;
}
.card-stats span {
    display: flex;
    align-items: center;
    gap: 4px;
}
.lootbox__card {
    position: relative !important;
}
.card-stats span i {
    font-size: 14px;
}

@media screen and (max-width: 768px) {
    .history__body-item,
    .history__body-item img {
        width: 100px !important;
    }
    .processing-card::before,
    .charging-card::before {
        top: -1px !important;
        left: -1px !important;
        right: -1px !important;
        bottom: -1px !important;
        opacity: 0.5 !important;
    }
    div[style*="position: fixed"][style*="right: 1%"] {
        transform: scale(0.9);
        transform-origin: bottom right;
    }
    .anim-interactive-button {
        width: 40px !important;
        height: 40px !important;
    }
    .anim-interactive-button span[class*="fa-"] {
        font-size: 18px !important;
    }
    #promoCodeLinkButton.anim-interactive-button.promo-code-button-custom {
        padding: 0 !important;
    }
    #promoCodeLinkButton.anim-interactive-button.promo-code-button-custom span:not(.fal) {
        display: none !important;
    }
    #promoCodeLinkButton.anim-interactive-button.promo-code-button-custom .fal {
        margin-right: 0 !important;
    }
    #promoCodeLinkButton {
        right: 1%;
    }
    #promoCodeLinkButton,
    #toggleStatsModeButton {
        transform: scale(0.9);
        transform-origin: bottom left;
    }
    .anim-button-tooltip {
        font-size: 11px !important;
        padding: 5px 8px !important;
    }
    .card-stats {
        padding: 4px;
        font-size: 10px;
    }
    .card-stats span i {
        font-size: 12px !important;
    }
    .remelt__inventory-list {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
    }
    .remelt__inventory-item {
        width: 100% !important;
        margin: 0 !important;
    }
    .remelt__inventory-item img {
        width: 100% !important;
        height: auto !important;
    }
    .remelt__inventory-item .card-stats {
        width: 100% !important;
        margin-top: 4px !important;
    }
}

.anim-interactive-button {
    background-color: #6c5ce7;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: breatheShadowInteractive 2.5s infinite ease-in-out;
    outline: none;
    position: relative;
    text-decoration: none;
}
.anim-interactive-button span[class*="fa-"] {
    display: inline-block;
    font-size: 20px;
    transition: transform 0.25s ease-out;
}
.anim-interactive-button:hover {
    background-color: #5f51e3;
    transform: scale(1.12) translateY(-3px);
    box-shadow: 0 7px 18px rgba(0, 0, 0, 0.25);
}
.anim-interactive-button:hover span[class*="fa-"] {
    transform: rotate(18deg);
}
.anim-interactive-button:active {
    background-color: #5245c9;
    transform: scale(0.93) translateY(0px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition-duration: 0.08s;
}
.anim-interactive-button:active span[class*="fa-"] {
    transform: rotate(-8deg) scale(0.88);
}
.anim-interactive-button.is-working {
    animation: pulseWorkingBorderInteractive 1s infinite ease-in-out, breatheShadowInteractive 2.5s infinite ease-in-out paused !important;
}
.anim-interactive-button.is-working:hover {
    transform: scale(1.05) translateY(-1px);
}
.anim-button-tooltip {
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%) translateX(10px);
    background-color: #2d3436;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.25s ease, transform 0.25s ease;
    white-space: nowrap;
    z-index: 1001;
    pointer-events: none;
}
.card-helper-status-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #3e444c;
    color: #f0f0f0;
    padding: 10px 18px;
    border-radius: 6px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    opacity: 0;
    transition: opacity 0.4s ease, bottom 0.4s ease;
    max-width: 380px;
    min-width: 280px;
    box-sizing: border-box;
}
.card-helper-status-notification.show {
    opacity: 1;
    bottom: 30px;
}
.ch-status-icon-container {
    margin-right: 10px;
    display: flex;
    align-items: center;
    height: 18px;
}
.card-helper-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #666;
    border-top: 2px solid #ddd;
    border-radius: 50%;
    animation: cardHelperSpin 0.8s linear infinite;
}
.card-helper-checkmark,
.card-helper-crossmark {
    font-size: 18px;
    line-height: 1;
}
.card-helper-checkmark {
    color: #76c779;
}
.card-helper-crossmark {
    color: #e57373;
}
.card-helper-status-text {
    white-space: normal;
    text-align: left;
    line-height: 1.3;
}
.promo-code-button-custom {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    width: auto;
    height: auto;
    padding: 10px 18px;
    border-radius: 25px;
    text-decoration: none;
    font-size: 14px;
    line-height: 1.2;
}
.promo-code-button-custom .fal {
    margin-right: 8px;
    font-size: 16px;
}

.toggle-stats-button {
    position: fixed;
    bottom: 70px;
    left: 20px;
    z-index: 9998;
    width: auto;
    height: auto;
    padding: 8px 15px;
    border-radius: 20px;
    text-decoration: none;
    font-size: 13px;
    line-height: 1.2;
}
.toggle-stats-button .fal {
    margin-right: 6px;
    font-size: 14px;
}
#scrolltop {
    display: none !important;
}
.card-helper-ui-container {
    position: fixed;
    top: 42%;
    right: 1%;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 25px;
    transition: right 0.4s ease-in-out;
}
.card-helper-ui-container--hidden {
    right: -60px;
}
.card-helper-ui-container > div[style*="position: fixed"] {
    position: relative !important;
    transform: none !important;
}
#toggleUiButton {
    position: fixed;
    top: 35%;
    right: 1%;
    z-index: 9999;
    width: 35px;
    height: 35px;
    transition: right 0.4s ease-in-out;
}
#toggleUiButton span {
    font-size: 16px !important;
}
#toggleUiButton.ui-hidden {
    right: 10px;
}
.header__ava {
    position: relative;
}
.DLEPush {
z-index: 2001;
position: fixed;
right: 20px;
top: 55px;
}
.pm-badge {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 20px;
    height: 20px;
    background-color: white;
    color: black;
    font-size: 12px;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    z-index: 10;
    pointer-events: none;
`;

document.head.appendChild(style);

function clearIcons() {
    $('.card-notification:first')?.click();
}

function autoRepeatCheck() {
    clearIcons();
    checkGiftCard(document);
    const volumeButton = document.querySelector('.adv_volume.volume_on');
    if (volumeButton) {
        volumeButton.click();
    }
}

async function checkGiftCard(doc) {
    const button = doc.querySelector('#gift-icon');
    if (!button) return;
    const giftCode = button.getAttribute('data-code');
    if (!giftCode) return;
    try {
        const response = await fetch('/engine/ajax/controller.php?mod=gift_code_game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ code: giftCode, user_hash: dle_login_hash })
        });
        const data = await response.json();
        if (data.status === 'ok') {
            showTemporaryMessage('giftStatus', data.text, true);
            button.remove();
        } else if (data.text) {
            showTemporaryMessage('giftStatus', data.text, false);
        }
    } catch (error) {
        console.error("Error checking gift card:", error);
        showTemporaryMessage('giftError', "Ошибка проверки гифт карты.", false);
    }
}

async function checkNewCard() {
    if (!isAutoLootEnabled) {
        return;
    }

    const userHash = window.dle_login_hash;
    if (!userHash) {
        setTimeout(() => {
            if (window.dle_login_hash) {
                checkNewCard();
            }
        }, 2000);
        return;
    }

    const currentDateTime = new Date();
    const localStorageKey = 'checkCardStopped' + userHash;
    const currentHourMarker = currentDateTime.toISOString().slice(0, 13);

    if (localStorage.getItem(localStorageKey) === currentHourMarker && !isAutoLootEnabled) {
        return;
    }
     if (localStorage.getItem(localStorageKey) === currentHourMarker) {
        return;
    }

    try {
        await sleep(DELAY * 2);

        const cardForWatchPayload = {
            user_hash: userHash
        };

        const responseText = await $.ajax({
            url: "/ajax/card_for_watch/",
            type: "post",
            data: cardForWatchPayload,
            cache: false
        });

        if (typeof responseText === 'string') {
            let jsonData;
            if (responseText.startsWith("cards{") && responseText.endsWith("}")) {
                try {
                    const jsonString = responseText.substring(5);
                    jsonData = JSON.parse(jsonString);
                } catch (e) {
                }
            }

            if (jsonData && jsonData.if_reward && jsonData.if_reward.toLowerCase() === "yes") {
                if (jsonData.reward_limit !== undefined && parseInt(jsonData.reward_limit, 10) === 0) {
                    localStorage.setItem(localStorageKey, currentHourMarker);
                }
            }
        }
    } catch (e) {
        let errorMsg = "Ошибка автосбора: ";
        if (e.status !== undefined) errorMsg += `HTTP ${e.status} `;
        if (e.statusText) errorMsg += `${e.statusText} `;
    }
}

async function setCache(key, data, baseTtlInSeconds = 86400) {
    const jitterPercent = 0.10;
    const jitter = Math.round(baseTtlInSeconds * jitterPercent * (Math.random() * 2 - 1));
    const finalTtlInSeconds = baseTtlInSeconds + jitter;
    const expires = Date.now() + finalTtlInSeconds * 1000;
    const cacheData = { data, expires };
    try {
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
        console.error("Ошибка при записи в localStorage (возможно, переполнен):", e);
        showTemporaryMessage('localStorageError', 'Ошибка записи в localStorage.', false);
    }
}

async function getCache(key) {
    const cacheDataJSON = localStorage.getItem(key);
    if (!cacheDataJSON) return null;
    try {
        const cacheData = JSON.parse(cacheDataJSON);
        if (!cacheData || typeof cacheData !== 'object' || !cacheData.expires || !('data' in cacheData) || Date.now() > cacheData.expires) {
             localStorage.removeItem(key); return null;
        }
        return cacheData.data;
    } catch (e) {
        localStorage.removeItem(key); return null;
    }
}

async function cacheCard(key, data) { await setCache(key, data); }
async function getCard(key) { return await getCache(key); }

function clearCardCache() {
    let clearedCount = 0, animeCardsDataCleared = false;
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cardId: ')) {
            try { const parsed = JSON.parse(localStorage.getItem(key)); if (parsed?.data && parsed.expires) { localStorage.removeItem(key); clearedCount++; } } catch (e) {}
        } else if (key === 'animeCardsData') { localStorage.removeItem(key); animeCardsDataCleared = true; }
    });
    showTemporaryMessage('cacheCleared', `Очищено ${clearedCount} карт. ${animeCardsDataCleared ? "Общий кеш очищен." : ""}`, true);
}

async function picOnTradesPage() {
    if (!window.location.pathname.startsWith('/trades/')) {
        return;
    }

    const CACHE_PREFIX = 'trade_preview_';
    await new Promise(resolve => setTimeout(resolve, 100));

    const tradeItems = document.querySelectorAll('.trade__list-item');
    if (tradeItems.length === 0) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        return;
    }

    const activeTradeIds = new Set();
    tradeItems.forEach(item => {
        const url = item.href;
        if (url) {
            const match = url.match(/\/trades\/offers\/(\d+)\//);
            if (match && match[1]) {
                activeTradeIds.add(match[1]);
            }
        }
    });

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
            const tradeId = key.replace(CACHE_PREFIX, '');
            if (!activeTradeIds.has(tradeId)) {
                localStorage.removeItem(key);
            }
        }
    }

    for (const item of tradeItems) {
        if (item.classList.contains('trade-item-enhanced')) continue;
        item.classList.add('trade-item-enhanced');

        const url = item.href;
        const tradeIdMatch = url ? url.match(/\/trades\/offers\/(\d+)\//) : null;
        if (!tradeIdMatch) continue;

        const tradeId = tradeIdMatch[1];
        const cacheKey = CACHE_PREFIX + tradeId;
        let imageUrl = localStorage.getItem(cacheKey);

        if (!imageUrl) {
            try {
                const response = await fetch(url);
                if (!response.ok) continue;

                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');

                const userBlocks = Array.from(doc.querySelectorAll('.trade__main-user'));
                let requestedCardImage = null;

                for (const block of userBlocks) {
                    if (block.textContent.includes('Вы хотите получить')) {
                        const itemsContainer = block.nextElementSibling;
                        if (itemsContainer && itemsContainer.classList.contains('trade__main-items')) {
                            requestedCardImage = itemsContainer.querySelector('img');
                        }
                        break;
                    }
                }

                if (requestedCardImage) {
                    const rawUrl = requestedCardImage.dataset.src || requestedCardImage.src;
                    if (rawUrl) {
                        imageUrl = new URL(rawUrl, url).href;
                        localStorage.setItem(cacheKey, imageUrl);
                    }
                }
            } catch (error) {
                console.error(`[Card Helper] Ошибка при загрузке данных для обмена ${tradeId}:`, error);
                continue;
            }
        }

        if (imageUrl) {
            const originalContentWrapper = document.createElement('div');
            originalContentWrapper.style.display = 'flex';
            originalContentWrapper.style.alignItems = 'center';
            originalContentWrapper.style.gap = '15px';

            while (item.firstChild) {
                originalContentWrapper.appendChild(item.firstChild);
            }
            item.appendChild(originalContentWrapper);

            const previewImage = document.createElement('img');
            previewImage.src = imageUrl;
            previewImage.title = 'Карта, которую вы хотите получить';
            previewImage.style.cssText = 'width: 50px; height: auto; border-radius: 5px; margin-left: 15px; border: 1px solid #444;';

            item.appendChild(previewImage);
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'space-between';
        }
    }
}

function setupTradePageObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const tradeListPage = document.querySelector('.trade__list');
        if (tradeListPage) {
            picOnTradesPage();
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

(function() {
    'use-strict';
    function initializeScript() {
        if (typeof $ === 'undefined') { console.error("jQuery не найден."); }
        if (typeof dle_login_hash === 'undefined') console.warn("dle_login_hash не определена.");
        addUpdateButton();
        manageAutoLootInterval();
        setInterval(autoRepeatCheck, 2000);
        $('#tg-banner')?.remove(); try { localStorage.setItem('notify18', 'closed'); localStorage.setItem('hideTelegramAs', 'true'); } catch (e) {}

        picOnTradesPage();
        displayUnreadMessagesBadge();
        ILoveAdmins();
        setTimeout(addDemandPlaceholders, 1000);

        setInterval(ILoveAdmins, 500);
    }

function setupGlobalObserver() {
    const cardClasses = '.remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .history__body-item, .card-pack__card';

    const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-id']
    };

    const observer = new MutationObserver((mutationsList, observer) => {

        observer.disconnect();

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(cardClasses)) {
                            addPlaceholderToCard(node);
                        }
                        const newCards = node.querySelectorAll(cardClasses);
                        newCards.forEach(card => addPlaceholderToCard(card));
                    }
                }
            }

            if (mutation.type === 'attributes' && mutation.attributeName === 'data-id') {
                const changedElement = mutation.target;
                if (changedElement && changedElement.matches && changedElement.matches(cardClasses)) {
                    const oldStats = changedElement.querySelector('.card-stats');
                    if (oldStats) {
                        oldStats.remove();
                    }
                    addPlaceholderToCard(changedElement);
                }
            }
        }

        displayUnreadMessagesBadge();
        ILoveAdmins();

        if (document.querySelector('.trade__list')) {
            picOnTradesPage();
        }

        observer.observe(document.body, config);
    });

    observer.observe(document.body, config);
}

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeScript();
            setupGlobalObserver();
        });
    } else {
        initializeScript();
        setupGlobalObserver();
    }
})();