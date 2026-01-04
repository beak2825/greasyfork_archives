// ==UserScript==
// @name          7BTVFZ Control Emotes Panel 2.6.53 
// @version       2.6.53
// @description   Twitch emoji blocking in Chat with a management interface and context menu .
// @author        Gullampis810_tapeavion
// @license       Proprietary (c) tapeavion
// @match         www.twitch.tv/*
// @match         https://blank.org/*
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @connect       raw.githubusercontent.com
// @grant         GM_xmlhttpRequest
// @icon         https://raw.githubusercontent.com/ftpobpl47hGTN56/Twitch_emote-blocker_chromeEXT_present_mainpage_7BTVFZTV/refs/heads/main/images/256-tfr5jftjfr5.ico
// @namespace     http://tampermonkey.net/
// @tag           twitch
// @tag           emote-blocker
// @tag           chat-filter
// @tag           block-emotes
// @tag           twitch-chat
// @tag           7tv
// @tag           bttv
// @tag           ffz
// @tag           twitch-channel
// @tag           block all emotes

// @downloadURL https://update.greasyfork.org/scripts/520235/7BTVFZ%20Control%20Emotes%20Panel%202653.user.js
// @updateURL https://update.greasyfork.org/scripts/520235/7BTVFZ%20Control%20Emotes%20Panel%202653.meta.js
// ==/UserScript==



// Версия 2.6.56 от 23.08.2025 clear_twitch_chat_recycler.js

(function () {
    'use strict';
    console.log('[ChatRecycler] Скрипт chat_recycler.js загружен в Tampermonkey');

    // --- Хранилище лимита сообщений ---
    function getStoredLimit() {
        if (window.getStorage) {
            const storedLimit = window.getStorage('chatMessageLimit');
            if (storedLimit !== undefined && !isNaN(parseInt(storedLimit))) {
                return parseInt(storedLimit);
            }
            window.setStorage('chatMessageLimit', 19);
        }
        return 19;
    }

    function setStoredLimit(newLimit) {
        if (window.setStorage) {
            window.setStorage('chatMessageLimit', newLimit);
        }
    }

    let MAX_MESSAGES = getStoredLimit();
    console.log('[ChatRecycler] Инициализирован MAX_MESSAGES:', MAX_MESSAGES);

    // --- Функции подсчёта ---
    async function getMessageCount() {
        const selectors = [
            '[data-test-selector="chat-scrollable-area__message-container"]',
            '.chat-scrollable-area__message-container',
            '[role="log"]'
        ];
        let chatContainer = null;
        for (const selector of selectors) {
            chatContainer = document.querySelector(selector);
            if (chatContainer) break;
        }
        if (!chatContainer) return 0;
        // Ждем стабилизации DOM
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 90;
            const checkMessages = () => {
                const messages = chatContainer.querySelectorAll('div.chat-line__message.tw-relative, div.chat-line__message[data-processed="true"]');
                if (messages.length > 0 || attempts >= maxAttempts) {
                    resolve(messages.length);
                } else {
                    attempts++;
                    setTimeout(checkMessages, 1000);
                }
            };
            checkMessages();
        });
    }

    function getLayoutContainerCount() {
        return document.querySelectorAll('.Layout-sc-1xcs6mc-0').length;
    }

    // --- Универсальное удаление сообщений ---
    function deleteMessages(count) {
        const messages = document.querySelectorAll('.chat-line__message');
        const toRemove = Math.min(messages.length, count);
        for (let i = 0; i < toRemove; i++) {
            if (messages[i] && messages[i].parentNode) {
                messages[i].parentNode.removeChild(messages[i]);
            }
        }
    }

    // --- Автоматическое удаление при превышении лимита ---
    async function autoDeleteMessages() {
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) MAX_MESSAGES = currentLimit;
        const messageCount = await getMessageCount();
        if (messageCount > MAX_MESSAGES) {
            deleteMessages(messageCount - MAX_MESSAGES);
            await updateTooltip();
        }
    }

    // --- Универсальный тултип ---
    async function updateTooltip() {
        const tooltip = document.querySelector('#chat-counter-tooltip');
        if (!tooltip) return;
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) MAX_MESSAGES = currentLimit;
        const messageCount = await getMessageCount();
        tooltip.textContent = `${messageCount}/${MAX_MESSAGES}`;
    }

    // --- Кнопка очистки чата ---
    function addClearChatButton() {
        const inputButtonsContainer = document.querySelector('[data-test-selector="chat-input-buttons-container"]');
        if (!inputButtonsContainer) return;
        if (document.querySelector('#clear-chat-button')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'Layout-sc-1xcs6mc-0 ScTooltipWrapper-sc-31h4d9-0 tw-tooltip-wrapper';
        wrapper.style.display = 'inline-block';
        wrapper.style.position = 'relative';

        const clearChatButton = document.createElement('button');
        clearChatButton.id = 'clear-chat-button';
        clearChatButton.setAttribute('aria-label', 'Clear Chat');
        clearChatButton.className = 'ScCoreButton-sc-ocjdkq-0 kJMgAB';
        clearChatButton.style.marginRight = '4px';
        clearChatButton.innerHTML = `<div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
            <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bLZXTb">Clear Chat</div>
        </div>`;
        clearChatButton.addEventListener('click', async () => {
            deleteMessages(200);
            await updateTooltip();
        });

        const tooltip = document.createElement('div');
        tooltip.id = 'chat-counter-tooltip';
        tooltip.className = 'tw-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '125%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.fontWeight = '600';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.backgroundColor = 'var(--color-background-tooltip)';
        tooltip.style.color = 'var(--color-text-tooltip)';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';
        tooltip.style.zIndex = '999';

        wrapper.addEventListener('mouseenter', async () => {
            await updateTooltip();
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        wrapper.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });

        wrapper.appendChild(clearChatButton);
        wrapper.appendChild(tooltip);
        inputButtonsContainer.insertBefore(wrapper, inputButtonsContainer.firstChild);
        updateTooltip();
    }

    // --- Секция лимита сообщений в настройках ---
    function addMessageLimitSection() {
        const settingsContent = document.querySelector('.chat-settings__content');
        if (!settingsContent) return;
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) MAX_MESSAGES = currentLimit;

        if (document.querySelector('#message-limit-section')) {
            const existingButton = document.querySelector('#message-limit-section .hGDXYq');
            const existingInput = document.querySelector('#message-limit-input');
            if (existingButton) existingButton.textContent = MAX_MESSAGES;
            if (existingInput) existingInput.value = MAX_MESSAGES;
            return;
        }

        const section = document.createElement('div');
        section.id = 'message-limit-section';
        section.className = 'Layout-sc-1xcs6mc-0 igZqfU';

        const messageLimitButton = document.createElement('button');
        messageLimitButton.className = 'ScInteractableBase-sc-ofisyf-0 ScInteractableDefault-sc-ofisyf-1 CayVJ imYKMv tw-interactable';
        messageLimitButton.setAttribute('data-a-target', 'message-limit-selector');
        messageLimitButton.innerHTML = `<div class="Layout-sc-1xcs6mc-0 dCYttJ">
            <div class="Layout-sc-1xcs6mc-0 dtSdDz"> Message Limit </div>
            <div class="Layout-sc-1xcs6mc-0 hGDXYq">${MAX_MESSAGES}</div>
            <div class="Layout-sc-1xcs6mc-0 fuLBqz">
                <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                    </svg>
                </div>
            </div>
        </div>`;

        const inputContainer = document.createElement('div');
        inputContainer.id = 'message-limit-input-container';
        inputContainer.className = 'Layout-sc-1xcs6mc-0';
        inputContainer.style.display = 'none';
        inputContainer.style.padding = '8px';
        inputContainer.innerHTML = `<label for="message-limit-input" class="CoreText-sc-1txzju1-0 yIWOC">Установить лимит сообщений</label>
        <input id="message-limit-input" type="number" min="1" value="${MAX_MESSAGES}" style="width: 100%; padding: 4px; margin-top: 4px;" />`;

        messageLimitButton.addEventListener('click', () => {
            inputContainer.style.display = inputContainer.style.display === 'none' ? 'block' : 'none';
            const input = inputContainer.querySelector('#message-limit-input');
            if (input) input.value = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        });

        inputContainer.addEventListener('input', (e) => {
            if (e.target.id === 'message-limit-input') {
                const newLimit = parseInt(e.target.value);
                if (newLimit > 0) {
                    if (typeof setStoredLimit === 'function') setStoredLimit(newLimit);
                    MAX_MESSAGES = newLimit;
                    messageLimitButton.querySelector('.hGDXYq').textContent = newLimit;
                    updateTooltip();
                }
            }
        });

        section.appendChild(messageLimitButton);
        section.appendChild(inputContainer);
        settingsContent.appendChild(section);
    }

    // --- DOM наблюдатель ---
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = async function (mutationsList, observer) {
            const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]') ||
                document.querySelector('.chat-scrollable-area__message-container') ||
                document.querySelector('[role="log"]');
            const inputButtonsContainer = document.querySelector('[data-test-selector="chat-input-buttons-container"]');
            const settingsContent = document.querySelector('.chat-settings__content');

            if (chatContainer && mutationsList.some(mutation => mutation.target.closest('.chat-scrollable-area__message-container') ||
                mutation.target.closest('[role="log"]'))) {
                await updateTooltip();
            }
            if (inputButtonsContainer && !document.querySelector('#clear-chat-button')) {
                addClearChatButton();
            }
            if (settingsContent && !document.querySelector('#message-limit-section')) {
                addMessageLimitSection();
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // --- Смена канала ---
    function observeURLChanges() {
        let lastChannel = null;
        const reinitialize = () => {
            addClearChatButton();
            addMessageLimitSection();
            updateTooltip();
        };
        const checkChatChange = () => {
            const welcomeMessage = document.querySelector('[data-a-target="chat-welcome-message"]');
            const linkElement = document.querySelector('a.tw-link[href*="#WYSIWGChatInputEditor_SkipChat"]');
            let currentChannel = lastChannel;
            if (linkElement) {
                currentChannel = linkElement.getAttribute('href').split('#')[0];
            }
            if (welcomeMessage && (currentChannel !== lastChannel)) {
                lastChannel = currentChannel;
                setTimeout(reinitialize, 2000);
            }
        };
        const observer = new MutationObserver((mutations) => {
            const welcomeMessage = document.querySelector('[data-a-target="chat-welcome-message"]');
            if (mutations.some(mutation => mutation.target.closest('[data-a-target="chat-welcome-message"]') ||
                mutation.target.closest('.chat-scrollable-area__message-container') ||
                mutation.target.closest('[role="log"]') ||
                mutation.target.closest('a.tw-link'))) {
                checkChatChange();
            }
        });
        urlObserver = observer;
        observer.observe(document, { subtree: true, childList: true });
        setInterval(checkChatChange, 500);
    }

    // --- Инициализация ---
    let autoDeleteInterval = null;
    let urlObserver = null;
    async function init() {
        window.deleteMessages = deleteMessages;
        if (autoDeleteInterval) clearInterval(autoDeleteInterval);
        if (urlObserver) urlObserver.disconnect();

        setTimeout(() => {
            addClearChatButton();
            addMessageLimitSection();
            updateTooltip();
        }, 1000);

        autoDeleteInterval = setInterval(async () => {
            await autoDeleteMessages();
        }, 500);

        observeDOM();
        observeURLChanges();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 2000);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
    }
})();





(function () {
    'use strict';

        console.log("Скрипт запущен в чате");


    // Подключаем Chart.js через CDN
const chartJsScript = document.createElement('script');
chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
chartJsScript.async = true;
document.head.appendChild(chartJsScript);


    // === объект для хранения текущих стилей кнопки DeleteButton в случае пересоздания и сброса стиля //
    let currentDeleteButtonStyles = {
        background: 'rgb(168, 77, 77)', // Начальный цвет из hoverStyle
        color: ' #fff',
        hoverBackground: 'linear-gradient(135deg, #f75557 0%, #480a0c 56%, #4e1314 98%, #ff4d4d 100%)'
    };

    let blockedEmotes = [];
    let blockedChannels = [];

        // глобальное определение для поисковой строки
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Функция для безопасного получения и парсинга данных
    function loadData(key, defaultValue) {
        const rawData = GM_getValue(key, defaultValue);
        try {
            return typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        } catch (e) {
            console.error(`Ошибка при парсинге ${key}:`, e);
            return defaultValue; // Возвращаем значение по умолчанию в случае ошибки
        }
    }

    // Загружаем данные при старте
    blockedEmotes = loadData("blockedEmotes", []);
    blockedChannels = loadData("blockedChannels", []);
    console.log("[7BTTVFZ Control Emotes Panel] Загружены blockedEmotes:", blockedEmotes);
    console.log("[7BTTVFZ Control Emotes Panel] Загружены blockedChannels:", blockedChannels);

    let isPanelOpen = GM_getValue('isPanelOpen', false);



//=== Функция для перемещения панели ===//
function makePanelDraggable(panel) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    // Создаем заголовок, за который можно перетаскивать
    const dragHandle = document.createElement('div');
    dragHandle.style.width = '100%';
    dragHandle.style.height = '656px';
    dragHandle.style.background = 'rgba(0, 0, 0, 0.0)';
    dragHandle.style.cursor = 'grab';
    dragHandle.style.position = 'absolute';
    dragHandle.style.top = '0';
    dragHandle.style.left = '0';
    dragHandle.style.zIndex = '-1';
    dragHandle.style.borderRadius = '8px 8px 0 0';
    panel.appendChild(dragHandle);

    // Начало перемещения
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        dragHandle.style.cursor = 'grabbing';
    });

    // Перемещение панели
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
    });

    // Остановка перемещения
    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
    });
}

//===================================== Панель управления =======================================//
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed'; // Фиксируем панель на экране
    controlPanel.style.bottom = '124px'; // Располагаем панель на 124px от нижней границы экрана
    controlPanel.style.right = '380px'; // Располагаем панель на 310px от правой границы экрана
    controlPanel.style.width = '690px'; // Ширина панели
    controlPanel.style.height = '656px'; // Высота панели
    controlPanel.style.backgroundColor = ' #5c5065'; // Цвет фона панели
    controlPanel.style.background = '-webkit-linear-gradient(270deg, hsla(50, 76%, 56%, 1) 0%, hsla(32, 83%, 49%, 1) 25%, hsla(0, 37%, 37%, 1) 59%, hsla(276, 47%,         24%, 1) 79%, hsla(261, 11%, 53%, 1) 100%)'; // Применяем градиентный фон

    controlPanel.style.border = '1px solid #ccc'; // Цвет и стиль границы панели
    controlPanel.style.borderRadius = '8px'; // Скругляем углы панели
    controlPanel.style.padding = '10px'; // Отступы внутри панели
    controlPanel.style.boxShadow = 'rgb(0 0 0) 0px 18px 29px 3px'; // Добавляем тень панели
    controlPanel.style.zIndex = 10000; // Устанавливаем высокий z-index, чтобы панель была поверх других элементов
    controlPanel.style.fontFamily = 'Arial, sans-serif'; // Шрифт текста на панели
    controlPanel.style.transition = 'height 0.3s ease'; // Плавное изменение высоты при изменении
    controlPanel.style.overflow = 'hidden'; // Скрытие содержимого, если оно выходит за пределы панели


        // Метка версии внизу панели
const versionLabel = document.createElement('div');
versionLabel.innerText = 'v.2.6.53';
versionLabel.style.position = 'absolute';
versionLabel.style.top = '4px';
versionLabel.style.right = '610px';
versionLabel.style.color = ' #3e2155';
versionLabel.style.fontSize = '12px';
versionLabel.style.fontFamily = 'Arial, sans-serif';
versionLabel.style.fontWeight = 'bold';
controlPanel.appendChild(versionLabel);


// Добавляем панель в DOM и активируем перетаскивание
document.body.appendChild(controlPanel);
makePanelDraggable(controlPanel);


// ======== Создаём кнопку шестерёнки для настроек ======== //
const settingsButton = document.createElement('button');
settingsButton.innerHTML = '<img src="https://raw.githubusercontent.com/sopernik566/Control_Emotes_Panel_Twitch_JS/dec21031f3f5d70d26b43c11ab4cb5b401b6c67d/settingsbttn7btttvttvffz.png" alt="Settings" style="width: 28px; height: 28px; vertical-align: middle; background: #5d5d5d; border-radius: 8px; border: 1px solid #333333;">';
settingsButton.style.width = '28px';
settingsButton.style.height = '28px';
settingsButton.style.position = 'absolute';
settingsButton.style.top = '3px';
settingsButton.style.right = '657px';
settingsButton.style.background = 'transparent';
settingsButton.style.border = 'none';
settingsButton.style.color = ' #fff';
settingsButton.style.cursor = 'pointer';
settingsButton.style.zIndex = '10001';
settingsButton.title = getTranslation('settingsTitle');
controlPanel.appendChild(settingsButton);

// Добавляем CSS для попапа и анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .settings-popup {
        position: fixed;
        top: 20%;
        left: 30%;
        width: 40%;
        height: 60%;
        background: linear-gradient(181deg, hsla(50, 76%, 56%, 1) 0%, hsla(0, 37%, 37%, 1) 59%, hsla(276, 47%, 24%, 1) 79%);
        border: 1px solid #bda3d7;
        border-radius: 12px;
        z-index: 10002;
        padding: 10px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        box-shadow: 6px 12px 20px 9px rgb(0 0 0 / 74%);
        transform: translateY(-100%);
        opacity: 0;
    }

    .popup-enter {
        animation: slideDown 0.3s ease-in-out forwards;
    }

    .popup-exit {
        animation: slideUp 0.3s ease-in-out forwards;
    }

    @keyframes slideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }

    .settings-popup .close-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #2f213b;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
    }

    .settings-popup .settings-title {
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #2f213b;
        font-weight: bold;
    }

    .settings-popup .settings-content {
        font-size: 14px;
        color: #fff;
    }

    .settings-popup .settings-description {
        margin: 0 0 12px 0;
        color: #2f213b;
    }

    .settings-popup .watchdog-section,
    .settings-popup .language-section,
    .settings-popup .font-size-section {
        margin-top: 15px;
    }

    .settings-popup .watchdog-label,
    .settings-popup .language-label,
    .settings-popup .font-size-label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        color: #2f213b;
    }

    .settings-popup .watchdog-interval,
    .settings-popup .language-select,
    .settings-popup .font-size-input {
        width: 125px;
        padding: 6px;
        border-radius: 6px;
        border: 1px solid #bda3d7;
        background: rgb(47, 33, 59);
        color: #bda3d7;
        font-size: 14px;
    }

    .settings-popup .language-select {
        width: 125px;
    }
`;
document.head.appendChild(styleSheet);

// Функция для получения переводов
function getTranslation(key, lang = GM_getValue('language', 'ru')) {
    const translations = {
        ru: {
            settingsFailed: 'Не удалось загрузить настройки',
            watchdogUpdated: 'Интервал watchdog обновлён до {interval}с',
            watchdogInvalid: 'Интервал должен быть минимум 1 секунда',
            languageUpdated: 'Язык интерфейса обновлён',
            closeButton: 'Закрыть',
            settingsTitle: 'Настройки',
            settingsDescription: 'Настройте параметры панели',
            watchdogLabel: 'Интервал проверки Watchdog (секунды):',
            languageLabel: 'Язык интерфейса:',
            blockedEmotesList: 'Список заблокированных эмодзи',
            platformLabel: 'Платформа',
            nameLabel: 'Имя',
            dateTimeLabel: 'Дата-Время',
            goToLastElement: 'Перейти к последнему элементу',
            showStatsChart: 'Показать статистику',
            deleteAll: 'Удалить все',
            export: 'Экспорт',
            import: 'Импорт',
            unblockAll: 'Разблокировать все эмодзи',
            blockAll: 'Заблокировать все эмодзи',
            searchPlaceholder: 'Поиск в списке заблокированных…',
            searchButton: 'Поиск',
            twitchChannelLabel: 'Twitch-канал',
            addChannelPlaceholder: 'Введите канал для добавления',
            addChannelButton: 'Добавить'
        },
        en: {
            settingsFailed: 'Failed to load settings',
            watchdogUpdated: 'Watchdog interval updated to {interval}s',
            watchdogInvalid: 'Interval must be at least 1 second',
            languageUpdated: 'Interface language updated',
            closeButton: 'Close',
            settingsTitle: 'Settings',
            settingsDescription: 'Configure panel settings',
            watchdogLabel: 'Watchdog check interval (seconds):',
            languageLabel: 'Interface language:',
            blockedEmotesList: 'List of Blocked Emotes',
            platformLabel: 'Platform',
            nameLabel: 'Name',
            dateTimeLabel: 'Date-Time',
            goToLastElement: 'Go to Last Element',
            showStatsChart: 'Show Stats Chart',
            deleteAll: 'Delete All',
            export: 'Export',
            import: 'Import',
            unblockAll: 'Unblock All Emotes',
            blockAll: 'Block All Emotes',
            searchPlaceholder: 'Search in blocked list…',
            searchButton: 'Search',
            twitchChannelLabel: 'Twitch Channel',
            addChannelPlaceholder: 'Type to add channel',
            addChannelButton: 'Add it'
        }
    };
    return translations[lang][key] || translations.ru[key];
}

// Функция для обновления переводов панели
function updatePanelTranslations(lang = GM_getValue('language', 'ru')) {
    const blockedEmotesList = document.querySelector('.blocked-emotes-list');
    if (blockedEmotesList) {
        blockedEmotesList.textContent = getTranslation('blockedEmotesList', lang);
    }

    const platformLabel = document.querySelector('.platform-label');
    if (platformLabel) {
        platformLabel.textContent = getTranslation('platformLabel', lang);
    }

    const nameLabel = document.querySelector('.name-label');
    if (nameLabel) {
        nameLabel.textContent = getTranslation('nameLabel', lang);
    }

    const dateTimeLabel = document.querySelector('.date-time-label');
    if (dateTimeLabel) {
        dateTimeLabel.textContent = getTranslation('dateTimeLabel', lang);
    }

    const goToLastElement = document.querySelector('.go-to-last-element');
    if (goToLastElement) {
        goToLastElement.textContent = getTranslation('goToLastElement', lang);
    }

    const showStatsChart = document.querySelector('.show-stats-chart');
    if (showStatsChart) {
        showStatsChart.textContent = getTranslation('showStatsChart', lang);
    }

    const deleteAll = document.querySelector('.delete-all');
    if (deleteAll) {
        deleteAll.textContent = getTranslation('deleteAll', lang);
    }

    const exportButton = document.querySelector('.export-button');
    if (exportButton) {
        exportButton.textContent = getTranslation('export', lang);
    }

    const importButton = document.querySelector('.import-button');
    if (importButton) {
        importButton.textContent = getTranslation('import', lang);
    }

    const unblockAll = document.querySelector('.unblock-all');
    if (unblockAll) {
        unblockAll.textContent = getTranslation('unblockAll', lang);
    }

    const blockAll = document.querySelector('.block-all');
    if (blockAll) {
        blockAll.textContent = getTranslation('blockAll', lang);
    }

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.placeholder = getTranslation('searchPlaceholder', lang);
    }

    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.textContent = getTranslation('searchButton', lang);
    }

    const twitchChannelLabel = document.querySelector('.twitch-channel-label');
    if (twitchChannelLabel) {
        twitchChannelLabel.textContent = getTranslation('twitchChannelLabel', lang);
    }

    const addChannelInput = document.querySelector('.add-channel-input');
    if (addChannelInput) {
        addChannelInput.placeholder = getTranslation('addChannelPlaceholder', lang);
    }

    const addChannelButton = document.querySelector('.add-channel-button');
    if (addChannelButton) {
        addChannelButton.textContent = getTranslation('addChannelButton', lang);
    }

    settingsButton.title = getTranslation('settingsTitle', lang);
}

// Инициализация переводов панели при загрузке
const scriptVersion = '2.6.53';
updatePanelTranslations();

// Обработчик клика по кнопке настроек
settingsButton.onclick = () => {
    if (document.querySelector('.settings-popup')) {
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/sopernik566/Control_Emotes_Panel_Twitch_JS/refs/heads/main/settingsPopup.html',
        onload: function(response) {
            try {
                const popup = document.createElement('div');
                popup.innerHTML = response.responseText;
                // Убедимся, что класс .settings-popup добавлен только один раз
                const popupContainer = popup.querySelector('.settings-popup') || popup;
                popupContainer.className = 'settings-popup';
                document.body.appendChild(popupContainer);

                // Запускаем анимацию открытия
                requestAnimationFrame(() => {
                    popupContainer.classList.add('popup-enter');
                });

                const lang = GM_getValue('language', 'ru');
                const closeButton = popupContainer.querySelector('.close-button');
                if (closeButton) {
                    closeButton.textContent = getTranslation('closeButton', lang);
                    closeButton.onclick = () => {
                        popupContainer.classList.remove('popup-enter');
                        popupContainer.classList.add('popup-exit');
                        popupContainer.addEventListener('animationend', () => {
                            popupContainer.remove();
                        }, { once: true });
                    };
                    closeButton.onmouseover = () => {
                        closeButton.style.background = ' #a88cc7';
                    };
                    closeButton.onmouseout = () => {
                        closeButton.style.background = ' #2f213b';
                    };
                } else {
                    console.error('[7BTTVFZ Control Emotes Panel] Кнопка закрытия не найдена');
                }

                const settingsTitle = popupContainer.querySelector('.settings-title');
                if (settingsTitle) {
                    settingsTitle.textContent = getTranslation('settingsTitle', lang);
                }

                const settingsDescription = popupContainer.querySelector('.settings-description');
                if (settingsDescription) {
                    settingsDescription.textContent = getTranslation('settingsDescription', lang);
                }

                const watchdogLabel = popupContainer.querySelector('.watchdog-label');
                if (watchdogLabel) {
                    watchdogLabel.textContent = getTranslation('watchdogLabel', lang);
                }

                const languageLabel = popupContainer.querySelector('.language-label');
                if (languageLabel) {
                    languageLabel.textContent = getTranslation('languageLabel', lang);
                }

                const watchdogInput = popupContainer.querySelector('.watchdog-interval');
                if (watchdogInput) {
                    watchdogInput.value = GM_getValue('watchdogInterval', 10);
                    watchdogInput.onchange = () => {
                        const interval = parseInt(watchdogInput.value, 10);
                        if (interval >= 1) {
                            GM_setValue('watchdogInterval', interval);
                            console.log(`[7BTTVFZ Control Emotes Panel] Интервал watchdog установлен: ${interval} сек`);
                            showNotification(getTranslation('watchdogUpdated', lang).replace('{interval}', interval), 3000);
                        } else {
                            showNotification(getTranslation('watchdogInvalid', lang), 3000);
                            console.log('[7BTTVFZ Control Emotes Panel] Неверный интервал watchdog');
                        }
                    };
                }

                const languageSelect = popupContainer.querySelector('.language-select');
                if (languageSelect) {
                    languageSelect.value = GM_getValue('language', 'ru');
                    languageSelect.onchange = () => {
                        const newLang = languageSelect.value;
                        GM_setValue('language', newLang);
                        console.log(`[7BTTVFZ Control Emotes Panel] Язык интерфейса изменён на: ${newLang}`);
                        showNotification(getTranslation('languageUpdated', newLang), 3000);
                        if (closeButton) closeButton.textContent = getTranslation('closeButton', newLang);
                        if (settingsTitle) settingsTitle.textContent = getTranslation('settingsTitle', newLang);
                        if (settingsDescription) settingsDescription.textContent = getTranslation('settingsDescription', newLang);
                        if (watchdogLabel) watchdogLabel.textContent = getTranslation('watchdogLabel', newLang);
                        if (languageLabel) languageLabel.textContent = getTranslation('languageLabel', newLang);
                        updatePanelTranslations(newLang);
                    };
                }

                // Поддержка настройки размера шрифта (если активирована)
                const fontSizeInput = popupContainer.querySelector('.font-size-input');
                if (fontSizeInput) {
                    fontSizeInput.value = GM_getValue('buttonFontSize', 16);
                    fontSizeInput.onchange = () => {
                        const size = parseInt(fontSizeInput.value, 10);
                        if (size >= 1 && size <= 35) {
                            GM_setValue('buttonFontSize', size);
                            console.log(`[7BTTVFZ Control Emotes Panel] Размер шрифта установлен: ${size}px`);
                            showNotification(`Font size updated to ${size}px`, 3000);
                        } else {
                            showNotification('Font size must be between 1 and 35', 3000);
                            console.log('[7BTTVFZ Control Emotes Panel] Неверный размер шрифта');
                        }
                    };
                }

                console.log('[7BTTVFZ Control Emotes Panel] Попап настроек загружен с GitHub');
            } catch (err) {
                console.error('[7BTTVFZ Control Emotes Panel] Ошибка загрузки попапа:', err);
                showNotification(getTranslation('settingsFailed', lang), 3000);
                createFallbackSettingsPopup();
            }
        },
        onerror: function(err) {
            console.error('[7BTTVFZ Control Emotes Panel] Ошибка загрузки с GitHub:', err);
            showNotification(getTranslation('settingsFailed', GM_getValue('language', 'ru')), 3000);
            createFallbackSettingsPopup();
        }
    });
};

// Резервный попап на случай сбоя
function createFallbackSettingsPopup() {
    const settingsPopup = document.createElement('div');
    settingsPopup.className = 'settings-popup';
    const lang = GM_getValue('language', 'ru');

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = getTranslation('closeButton', lang);
    closeButton.onclick = () => {
        settingsPopup.classList.remove('popup-enter');
        settingsPopup.classList.add('popup-exit');
        settingsPopup.addEventListener('animationend', () => {
            settingsPopup.remove();
        }, { once: true });
    };
    closeButton.onmouseover = () => {
        closeButton.style.background = ' #a88cc7';
    };
    closeButton.onmouseout = () => {
        closeButton.style.background = ' #2f213b';
    };

    settingsPopup.appendChild(closeButton);
    settingsPopup.innerHTML += `
        <h3 class="settings-title">${getTranslation('settingsTitle', lang)}</h3>
        <div class="settings-content">
            <p class="settings-description">${getTranslation('settingsFailed', lang)}</p>
        </div>
    `;
    document.body.appendChild(settingsPopup);

    // Запускаем анимацию открытия
    requestAnimationFrame(() => {
        settingsPopup.classList.add('popup-enter');
    });
}
// ================ конец end of popupsettings ==================== //




//---------------Текст title  "Название"  "лист" список list of BlockedEmotes ------------------------//
const title = document.createElement('h4');
title.innerText = 'list of BlockedEmotes';
title.style.margin = '-5px 0px 10px'; // Отступы сверху и снизу
title.style.color = ' #2a1e38'; // Обновленный цвет
title.style.position = 'relative'; // Устанавливаем позицию относительно
title.style.bottom = '35px'; // Сдвиг по вертикали
title.style.width = '190px';
controlPanel.appendChild(title);



//--------------- Список заблокированных каналов ------------------//
const list = document.createElement('ul');
list.id = 'blockedList';
list.style.position = 'relative';
list.style.bottom = '34px';
list.style.border = '1px solid #ffffff'; // Белая граница
list.style.borderRadius = '0px 0px 8px 8px'; // Скругление углов
list.style.boxShadow = ' rgb(0 0 0 / 67%) -18px 69px 40px 0 inset '; // Вставка тени в контейнер
list.style.listStyle = 'none'; // Убираем стандартные маркеры списка
list.style.padding = '0'; // Убираем отступы
list.style.margin = '-14px 0px 10px'; // Отступ снизу
list.style.maxHeight = '570px'; // Устанавливаем максимальную высоту
list.style.height = '410px'; // Высота списка
list.style.overflowY = 'auto'; // Включаем вертикальную прокрутку


//==================================== ГРАДИЕНТ ФОН СПИСОК =================================================//
// Добавляем линейный градиент фона с кроссбраузерностью
list.style.background = 'linear-gradient(45deg, hsla(292, 44%, 16%, 1) 0%, hsla(173, 29%, 48%, 1) 100%)';
list.style.background = '-moz-linear-gradient(45deg, hsla(292, 44%, 16%, 1) 0%, hsla(173, 29%, 48%, 1) 100%)'; // Для Firefox
list.style.background = '-webkit-linear-gradient(45deg, hsla(292, 44%, 16%, 1) 0%, hsla(173, 29%, 48%, 1) 100%)'; // Для Safari и Chrome
list.style.filter = 'progid: DXImageTransform.Microsoft.gradient(startColorstr="#36173b", endColorstr="#589F97", GradientType=1)'; // Для старых версий IE
list.style.color = ' #fff'; // Белый цвет текста

//==========  кастомный scroll bar для списка =============//
const style = document.createElement('style');
style.innerHTML = `
#blockedList::-webkit-scrollbar {
  width: 25px; /* Ширина скроллбара */
}

#blockedList::-webkit-scrollbar-thumb {
  background-color: #C1A5EF; /* Цвет бегунка */
  border-radius: 8px; /* Скругление бегунка */
  border: 3px solid #4F3E6A; /* Внутренний отступ (цвет трека) */
  height: 80px; /* Высота бегунка */
}

#blockedList::-webkit-scrollbar-thumb:hover {
  background-color: #C6AEFF; /* Цвет бегунка при наведении */
}

#blockedList::-webkit-scrollbar-thumb:active {
  background-color: #B097C9; /* Цвет бегунка при активном состоянии */
}

#blockedList::-webkit-scrollbar-track {
  background: #455565; /* Цвет трека */
  border-radius: 0px 0px 8px 0px; /* Скругление только нижнего правого угла */
}

#blockedList::-webkit-scrollbar-track:hover {
  background-color: #455565; /* Цвет трека при наведении */
}

#blockedList::-webkit-scrollbar-track:active {
  background-color: #455565; /* Цвет трека при активном состоянии */
}

`;
document.head.appendChild(style);

// hover blocked-item элемент списка //
const hoverStyle = document.createElement('style');
hoverStyle.innerHTML = `
    .blocked-item {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .blocked-item:hover {
        background-color: rgba(167, 54, 54, 0.52);
        color: #42d13a;
    }
    .blocked-item:hover span {
        color: #42d13a;
    }
    .new-item {
        background-color:#28a828;
        transition: background-color 0.3s ease;
    }
    .new-item:hover {
        background-color: #3a2252;
        color: #af7fcf;
    }
    .new-item:hover span {
        color: #af7fcf;
    }
    #sortContainer button {
        background: none;
        border: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        padding: 0 10px;
        transition: color 0.3s ease;
    }
    #sortContainer button:hover {
        color: #9ae048;
    }
`;
document.head.appendChild(hoverStyle);



const highlightStyle = document.createElement('style');
highlightStyle.innerHTML = `
    .blocked-item .highlight {
        background-color: #FFEB3B  !important; /* Красный фон для подсветки */
        color:rgb(0, 0, 0) !important; /* Белый текст для контраста */
        padding: 0 2px !important;
        border-radius: 2px !important;
        transition: background-color 0.5s ease !important;
    }
    .blocked-item.highlight-item {
        background-color: rgba(163, 161, 18, 0.83) !important; /* Полупрозрачная красная подсветка для всего элемента */
        transition: background-color 0.5s ease !important;
    }
     .last-item-highlight {
          background-color: #279479; /* Полупрозрачный золотой фон */
          transition: background-color 0.5s ease; /* Плавное исчезновение */
}
`;
document.head.appendChild(highlightStyle);

document.head.appendChild(style);

const buttonColor = ' #907cad'; // Общий цвет для кнопок
const buttonShadow = '0 4px 8px rgba(0, 0, 0, 0.6)'; // Тень для кнопок (60% прозрачности)



// Функция для обновления списка заблокированных каналов

// Переменные для хранения ID заблокированных элементов
let blockedEmoteIDs = new Set();
let blockedChannelIDs = new Set();
let newlyAddedIds = new Set();

function updateBlockedList() {
    list.innerHTML = '';

    // Очистка и обновление Set для быстрого поиска ID
    blockedEmoteIDs.clear();
    blockedChannelIDs.clear();

    function createListItem(channel, isNew = false) {
        const item = document.createElement('li');
        item.className = 'blocked-item';
        item.dataset.id = channel.id;

        if (isNew) {
            item.classList.add('new-item');
            setTimeout(() => {
                item.classList.remove('new-item');
            }, 1800000);
        }

        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.padding = '5px';
        item.style.borderBottom = '1px solid #eee';

        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.justifyContent = 'space-between';
        topRow.style.alignItems = 'center';

        const channelName = document.createElement('span');
        if (channel.platform === 'TwitchChannel') {
            channelName.innerText = `${channel.platform} > name emote: ${channel.emoteName}`;
        } else {
            channelName.innerText = `${channel.platform} > ${channel.emoteName}`;
        }
        channelName.classList.add('list-item-text');
        channelName.style.flex = '1';
        channelName.style.fontSize = '14px';
        channelName.style.fontWeight = 'bold';
        channelName.style.whiteSpace = 'nowrap';
        channelName.style.overflow = 'hidden';
        channelName.style.textOverflow = 'ellipsis';
        topRow.appendChild(channelName);

        const dateInfo = document.createElement('span');
        const date = new Date(channel.date);
        dateInfo.innerText = isNaN(date.getTime())
            ? 'Unknown Date'
            : date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        dateInfo.classList.add('list-item-date');
        dateInfo.style.marginRight = '30px';
        dateInfo.style.fontSize = '14px';
        topRow.appendChild(dateInfo);

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Delete';
        removeButton.classList.add('delete-button');
        console.log("[7BTTVFZ Control Emotes Panel] Создана кнопка Delete для элемента:", channel.id);

        // Используем сохранённые стили из currentDeleteButtonStyles
        removeButton.style.background = currentDeleteButtonStyles.background;
        removeButton.style.color = currentDeleteButtonStyles.color;
        removeButton.style.height = '35px';
        removeButton.style.width = '75px';
        removeButton.style.fontWeight = 'bold';
        removeButton.style.fontSize = '16px';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '4px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.6)';
        removeButton.style.display = 'flex';
        removeButton.style.alignItems = 'center';
        removeButton.style.justifyContent = 'center';
        removeButton.style.transition = 'background 0.3s ease';
        removeButton.style.opacity = '1';
        removeButton.style.visibility = 'visible';

        // Добавляем обработчики наведения
        removeButton.onmouseover = () => {
            removeButton.style.background = currentDeleteButtonStyles.hoverBackground;
        };
        removeButton.onmouseout = () => {
            removeButton.style.background = currentDeleteButtonStyles.background;
        };

        removeButton.onclick = function () {
            if (channel.platform === 'TwitchChannel') {
                blockedChannels = blockedChannels.filter(c => c.id !== channel.id);
                blockedChannelIDs.delete(channel.id);
                GM_setValue("blockedChannels", JSON.stringify(blockedChannels, null, 2));
            } else {
                blockedEmotes = blockedEmotes.filter(c => c.id !== channel.id);
                blockedEmoteIDs.delete(channel.id);
                GM_setValue("blockedEmotes", JSON.stringify(blockedEmotes, null, 2));
            }

            newlyAddedIds.delete(channel.id);
            updateBlockedList();
            updateCounter();
            showEmoteForChannel(channel);
        };

        topRow.appendChild(removeButton);
        item.appendChild(topRow);

        const channelLink = document.createElement('span');
        channelLink.classList.add('list-item-link');
        channelLink.style.fontSize = '14px';
        channelLink.style.wordBreak = 'break-word';
        channelLink.style.marginTop = '1px';

        if (channel.platform === 'TwitchChannel') {
            channelLink.innerText = `(prefix: ${channel.name || 'Unknown'})`;
        } else {
            channelLink.innerText = '(prefix: N/A)';
        }
        item.appendChild(channelLink);

        return item;
    }

    // Заполняем списки и обновляем Set
    blockedChannels.forEach(channel => {
        blockedChannelIDs.add(channel.id);
        const isNew = newlyAddedIds.has(channel.id) && Array.from(newlyAddedIds).pop() === channel.id;
        list.appendChild(createListItem(channel, isNew));
    });

    blockedEmotes.forEach(channel => {
        blockedEmoteIDs.add(channel.id);
        const isNew = newlyAddedIds.has(channel.id) && Array.from(newlyAddedIds).pop() === channel.id;
        list.appendChild(createListItem(channel, isNew));
    });

    // Прокручиваем к последнему добавленному элементу внутри контейнера list
    if (newlyAddedIds.size > 0) {
        const lastAddedId = Array.from(newlyAddedIds).pop();
        const newItem = list.querySelector(`[data-id="${lastAddedId}"]`);
        if (newItem) {
            // Вычисляем позицию нового элемента относительно контейнера list
            const itemOffsetTop = newItem.offsetTop; // Позиция элемента относительно начала списка
            const listHeight = list.clientHeight; // Видимая высота контейнера list
            const itemHeight = newItem.clientHeight; // Высота самого элемента

            // Вычисляем, куда нужно прокрутить, чтобы элемент оказался вверху видимой области
            const scrollPosition = itemOffsetTop - (listHeight / 2) + (itemHeight / 2);

            // Плавно прокручиваем list к нужной позиции
            list.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    // Очищаем список новых ID после отображения
    newlyAddedIds.clear();
}

// Добавляем список в панель управления
controlPanel.appendChild(list);




// Создаём контейнер для поисковой строки
const searchContainer = document.createElement('div');
searchContainer.style.display = 'flex';
searchContainer.style.gap = '5px';
searchContainer.style.top = '500px';
searchContainer.style.position = 'relative';

// Создаём поисковую строку
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search in blocked list...';
searchInput.style.background = ' #192427';
searchInput.style.width = '459px';
searchInput.style.left = '132px';
searchInput.style.color = ' #b69dcf';
searchInput.style.fontWeight = 'bold';
searchInput.style.height = '35px';
searchInput.style.padding = '5px';
searchInput.style.border = '1px solid #b69dcf';
searchInput.style.borderRadius = '4px';
searchInput.style.boxShadow = ' #4c2a5e 0px 4px 6px inset';
searchInput.style.position = 'relative';
searchInput.style.bottom = '50px';

// Создаём кнопку поиска
const searchButton = document.createElement('button');
searchButton.innerText = 'Search'; // Меняем текст на "Search"
searchButton.style.background = buttonColor;
searchButton.style.position = 'relative';
searchButton.style.bottom = '50px';
searchButton.style.color = ' #fff';
searchButton.style.border = 'none';
searchButton.style.width = '72px';
 searchButton.style.left = '132px';
searchButton.style.borderRadius = '4px';
searchButton.style.padding = '5px 10px';
searchButton.style.cursor = 'pointer';
searchButton.style.fontSize = '16px';
searchButton.style.fontWeight = 'bold';
searchButton.style.boxShadow = buttonShadow;

// Добавляем ховер-эффекты для кнопки поиска
searchButton.onmouseover = function() {
    searchButton.style.background = '-webkit-linear-gradient(135deg, #443157 0%,rgb(90, 69, 122) 56%, #443157 98%, #443157 100%)';
};
searchButton.onmouseout = function() {
    searchButton.style.background = buttonColor;
};

// Обработчик кнопки поиска
searchButton.onclick = () => {
    const searchTerm = searchInput.value.trim();
    filterBlockedList(searchTerm); // Запускаем фильтрацию
};

function filterBlockedList(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    console.log("[7BTTVFZ Control Emotes Panel] Поисковый запрос (lowerSearchTerm):", lowerSearchTerm);

    let filteredList = [];

    // Фильтрация списка
    if (!lowerSearchTerm) {
        filteredList = [...blockedChannels, ...blockedEmotes];
        console.log("[7BTTVFZ Control Emotes Panel] Поиск пустой, отображаем все элементы:", filteredList);
    } else {
        filteredList = [...blockedChannels, ...blockedEmotes].filter(item => {
            const emoteName = item.emoteName || '';
            const platform = item.platform || '';
            const name = item.name || '';
            const matches =
                emoteName.toLowerCase().includes(lowerSearchTerm) ||
                platform.toLowerCase().includes(lowerSearchTerm) ||
                name.toLowerCase().includes(lowerSearchTerm);
            console.log(`[7BTTVFZ Control Emotes Panel] Проверяем элемент: ${JSON.stringify(item)}, совпадение: ${matches}`);
            return matches;
        });
        console.log("[7BTTVFZ Control Emotes Panel] Результаты фильтрации:", filteredList);
    }

    // Сохраняем текущую позицию скролла
    const currentScrollPosition = list.scrollTop;
    console.log("[7BTTVFZ Control Emotes Panel] Текущая позиция скролла перед обновлением:", currentScrollPosition);

    // Получаем текущие элементы в DOM
    const currentItems = list.querySelectorAll('.blocked-item');
    const existingIds = new Set([...currentItems].map(item => item.dataset.id));

    // Удаляем элементы, которые не прошли фильтрацию
    currentItems.forEach(item => {
        const itemId = item.dataset.id;
        if (!filteredList.some(f => f.id === itemId)) {
            item.remove();
        }
    });

    // Добавляем или обновляем элементы
    filteredList.forEach(channel => {
        const itemId = channel.id;
        let item = list.querySelector(`[data-id="${itemId}"]`);

        if (!item) {
            // Если элемента нет, создаём новый
            item = createListItem(channel);
            list.appendChild(item);
        }

        // Применяем подсветку, если есть поисковый запрос
        if (lowerSearchTerm) {
            const spans = item.querySelectorAll('span');
            spans.forEach(span => {
                const originalText = span.textContent || '';
                if (originalText.toLowerCase().includes(lowerSearchTerm)) {
                    const regex = new RegExp(`(${lowerSearchTerm})`, 'gi');
                    const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
                    span.innerHTML = highlightedText;
                }
            });
        }
    });

    // Прокрутка к первому элементу
    if (filteredList.length > 0) {
        const firstItem = list.querySelector('.blocked-item');
        if (firstItem) {
            console.log("[7BTTVFZ Control Emotes Panel] Найден первый элемент для прокрутки:", firstItem);
            const firstItemOffset = firstItem.offsetTop;
            list.scrollTop = firstItemOffset - (list.clientHeight / 2) + (firstItem.clientHeight / 2);
            console.log("[7BTTVFZ Control Emotes Panel] Установлен scrollTop:", list.scrollTop);
        } else {
            console.log("[7BTTVFZ Control Emotes Panel] Первый элемент не найден в DOM!");
        }
    } else {
        // Если список пуст, восстанавливаем скролл
        console.log("[7BTTVFZ Control Emotes Panel] Список пуст, восстанавливаем скролл на:", currentScrollPosition);
        list.scrollTop = currentScrollPosition;
    }

    updateCounter();
}

// Добавляем элементы в контейнер поиска
searchContainer.appendChild(searchInput);
searchContainer.appendChild(searchButton); //   searchButton


// Добавляем контейнер поиска в панель управления
controlPanel.appendChild(searchContainer);

// Далее продолжаем с добавлением списка
controlPanel.appendChild(list);


//================= Функционал для добавления нового канала в список заблокированных ==================//
const inputContainer = document.createElement('div');
inputContainer.style.display = 'flex';
inputContainer.style.gap = '5px';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'type to add channel ';
input.style.position = 'relative';
input.style.background = ' #192427';
input.style.color = ' #b69dcf';
input.style.flex = '1';
input.style.fontWeight = 'bold'; // Жирный текст
input.style.height = '35px'; // Отступ между кнопкой и поисковой строкой
input.style.padding = '5px';
input.style.border = '1px solid #b69dcf';
input.style.borderRadius = '4px';
input.style.top = '15px'; // Отступ между кнопкой и поисковой строкой
// Добавление тени с фиолетовым цветом (35% прозрачности) внутрь
input.style.boxShadow = ' #4c2a5e 0px 4px 6px inset'; // Тень фиолетового цвета внутри

//================== Add it Button =====================//
// ==================== Кнопка добавления ===================== //
const addButton = document.createElement('button');
addButton.innerText = 'Add it';
addButton.style.background = buttonColor;
addButton.style.top = '15px'; // Отступ между кнопкой и поисковой строкой
addButton.style.position = 'relative';
addButton.style.color = ' #fff';
addButton.style.border = 'none';
addButton.style.width = '72px';
addButton.style.borderRadius = '4px';
addButton.style.padding = '5px 10px';
addButton.style.cursor = 'pointer';
addButton.style.boxShadow = buttonShadow; // Тень для кнопки "Add it"

// Увеличиваем размер текста и делаем его жирным
addButton.style.fontSize = '16px'; // Увеличиваем размер текста
addButton.style.fontWeight = 'bold'; // Жирный текст

// Генерация уникального ID
function generateID() {
    return `emote_${Date.now()}`; // Генерация ID на основе времени
}

addButton.onclick = (event) => {
    event.preventDefault();
    const channel = input.value.trim();
    const platform = platformSelect.value;

    if (channel) {
        let emoteName = channel;
        let emoteUrl = channel;
        const emoteId = generateRandomID();

        // Проверка на дублирование
        const isDuplicate = platform === 'TwitchChannel'
            ? blockedChannels.some(e => e.name === channel && e.platform === platform)
            : blockedEmotes.some(e => e.emoteUrl === channel && e.platform === platform);

        if (isDuplicate) {
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cChannel/Emote already blocked: ${channel}`,
                'color: rgb(255, 165, 0); font-weight: bold;',
                'color: rgb(255, 165, 0);');
            return;
        }

        if (platform === '7tv' || platform === 'bttTV' || platform === 'ffz') {
            const img = document.querySelector(`img[src="${channel}"]`);
            if (img) {
                emoteName = img.alt || channel.split('/').pop();
                emoteUrl = img.src || channel;
            }

            const newEmote = {
                id: emoteId,
                name: emoteUrl,
                platform: platform,
                emoteName: emoteName,
                emoteUrl: emoteUrl,
                date: new Date().toISOString()
            };

            blockedEmotes.push(newEmote);
            blockedEmoteIDs.add(emoteId);
            newlyAddedIds.add(emoteId);
            GM_setValue("blockedEmotes", JSON.stringify(blockedEmotes, null, 2));
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cAdded to blockedEmotes:`,
                'color: rgb(0, 255, 0); font-weight: bold;',
                'color: rgb(0, 255, 0);', newEmote);
        } else if (platform === 'TwitchChannel') {
            const prefix = channel.split(/[^a-zA-Z0-9]/)[0];
            emoteUrl = prefix;

            const newChannel = {
                id: emoteId,
                name: emoteUrl,
                platform: platform,
                emoteName: emoteName,
                emoteUrl: emoteUrl,
                date: new Date().toISOString()
            };

            blockedChannels.push(newChannel);
            blockedChannelIDs.add(emoteId);
            newlyAddedIds.add(emoteId);
            GM_setValue("blockedChannels", JSON.stringify(blockedChannels, null, 2));
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cAdded to blockedChannels:`,
                'color: rgb(0, 255, 0); font-weight: bold;',
                'color: rgb(0, 255, 0);', newChannel);
        }

        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (chatContainer) {
            toggleEmotesInNode(chatContainer);
        }

        updateBlockedList();
        updateCounter();
        input.value = '';
    }
};



// ==================== Создание выпадающего списка платформ ===================== //
const platformSelect = document.createElement('select');
platformSelect.style.top = '15px'; // Отступ между кнопкой и поисковой строкой
platformSelect.style.position = 'relative';
platformSelect.style.height = '35px'; // Высота выпадающего списка
platformSelect.style.border = '1px solid #c1a5ef';
platformSelect.style.background = ' #192427';
platformSelect.style.borderRadius = '4px';
platformSelect.style.padding = '5px';
platformSelect.style.fontWeight = 'bold'; // Жирный текст
platformSelect.style.color = ' #b69dcf';

const platforms = ['TwitchChannel', '7tv', 'bttTV', 'ffz'];
platforms.forEach(platform => {
    const option = document.createElement('option');
    option.value = platform;
    option.innerText = platform;
    platformSelect.appendChild(option);
});

// ==================== Подсказки для выбора платформы ===================== //
platformSelect.addEventListener('change', () => {
    const placeholderText = {
        'TwitchChannel': 'example prefix abcd123',
        '7tv': 'link example: https://cdn.7tv.app/emote/00000000000000000000000000/2x.webp',
        'bttTV': 'link example: https://cdn.betterttv.net/emote/000000000000000000000000/2x.webp',
        'ffz': 'link example: https://cdn.frankerfacez.com/emote/0000/2'
    };
    input.placeholder = placeholderText[platformSelect.value];
});

// ==================== Добавление выпадающего списка в контейнер ===================== //
inputContainer.appendChild(platformSelect);



//----------------Единый контейнер для кнопок -------------------------//
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex'; // Используем flexbox для расположения кнопок в строку
buttonContainer.style.alignItems = 'baseline'; // Используем flexbox для расположения кнопок в строку
buttonContainer.style.alignContent = 'stretch';



buttonContainer.style.gap = '13px'; // Задаем промежуток между кнопками
buttonContainer.style.bottom = '113px'; // Отступ сверху для контейнера кнопок
buttonContainer.style.position = 'relative'; // Позиционирование относительно
buttonContainer.style.fontWeight = 'bold'; // Жирный текст для контейнера кнопок
buttonContainer.style.fontSize = '16px'; // Размер шрифта для кнопок
buttonContainer.style.width = '668px'; // Ширина кнопок (увеличена для эффекта растяжения




//-------------- Кнопка "Delete all" ------------------------//
const clearAllButton = document.createElement('button');
clearAllButton.innerText = 'Delete all'; // Текст на кнопке
clearAllButton.style.background = buttonColor; // Цвет фона кнопки
clearAllButton.style.color = ' #fff'; // Цвет текста кнопки
clearAllButton.style.border = 'none'; // Убираем бордер у кнопки
clearAllButton.style.borderRadius = '4px'; // Скругленные углы кнопки
clearAllButton.style.padding = '5px 10px'; // Отступы внутри кнопки
clearAllButton.style.cursor = 'pointer'; // Курсор в виде руки при наведении
clearAllButton.style.boxShadow = buttonShadow; // Тень для кнопки "Delete all"

buttonContainer.appendChild(clearAllButton); // Добавляем кнопку в контейнер

// Обработчик события для кнопки "Delete all"
clearAllButton.onclick = () => {
    blockedEmotes = [];
    blockedChannels = [];
    GM_setValue("blockedEmotes", JSON.stringify(blockedEmotes, null, 2));
    GM_setValue("blockedChannels", JSON.stringify(blockedChannels, null, 2));
    console.log("[7BTTVFZ Control Emotes Panel] Очищены blockedEmotes и blockedChannels");
    updateBlockedList();
    updateCounter();
};


//----------------- export Button --------------------//
const exportButton = document.createElement('button');
exportButton.innerText = 'Export';
exportButton.style.background = buttonColor;
exportButton.style.color = ' #fff';
exportButton.style.border = 'none';
exportButton.style.borderRadius = '4px';
exportButton.style.padding = '5px 10px';
exportButton.style.cursor = 'pointer';
exportButton.style.boxShadow = buttonShadow; // Тень для кнопки "Export"
buttonContainer.appendChild(exportButton);
exportButton.onclick = () => {
    const combinedData = {
        blockedEmotes: blockedEmotes,
        blockedChannels: blockedChannels
    };
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blocked_data.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log("[7BTTVFZ Control Emotes Panel] Экспортированы данные:", combinedData);
};


//================= importButton ========================//
// Перемещаем создание fileInput в глобальную область, чтобы избежать дублирования
let fileInput = null;

// Функция для создания кнопки "Import"
function createImportButton() {
    const button = document.createElement('button');
    button.innerText = 'Import';
    button.style.background = buttonColor;
    button.style.color = ' #fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = buttonShadow;
    return button;
}

// Функция для создания или переиспользования элемента input типа "file"
function createFileInput() {
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.style.display = 'none';
        fileInput.onchange = handleFileChange;
        document.body.appendChild(fileInput);
    }
    return fileInput;
}

// Инициализация кнопки "Import"
const importButton = createImportButton();
buttonContainer.appendChild(importButton);

importButton.onclick = () => {
    const input = createFileInput();
    input.value = ''; // Сбрасываем значение для повторного выбора файла
    input.click();
};

// Обработка изменений файла
function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("[7BTTVFZ Control Emotes Panel] Файл не выбран");
        return;
    }
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.onerror = () => {
        console.error("[7BTTVFZ Control Emotes Panel] Ошибка чтения файла");
        alert('Ошибка при чтении файла!');
    };
    reader.readAsText(file);
}

// Обработка загрузки файла
function handleFileLoad(event) {
    try {
        const importedData = JSON.parse(event.target.result);

        if (!importedData || (!importedData.blockedEmotes && !importedData.blockedChannels)) {
            throw new Error('Неверный формат файла! Ожидается объект с blockedEmotes и/или blockedChannels');
        }

        processImportedData(importedData);
        updateInterface();
        console.log("[7BTTVFZ Control Emotes Panel] Импорт успешно завершен");
    } catch (err) {
        console.error('[7BTTVFZ Control Emotes Panel] Ошибка при парсинге файла:', err);
        alert(`Ошибка импорта: ${err.message}`);
    }
}

// Обработка импортированных данных
// Обработка импортированных данных
function processImportedData(importedData) {
    blockedEmotes = [];
    blockedChannels = [];
    blockedEmoteIDs.clear();
    blockedChannelIDs.clear();
    newlyAddedIds.clear();

    // Функция для извлечения префикса из emoteName для TwitchChannel (запасной вариант)
    function extractPrefix(emoteName, platform) {
        if (platform === 'TwitchChannel' && emoteName) {
            // Предполагаем, что emoteName имеет формат "prefix_emote"
            const parts = emoteName.split('_');
            return parts.length > 1 ? parts[0] : emoteName;
        }
        return '';
    }

    if (Array.isArray(importedData.blockedEmotes)) {
        importedData.blockedEmotes.forEach(emote => {
            const newId = emote.id && !blockedEmoteIDs.has(emote.id) && !blockedChannelIDs.has(emote.id)
                ? emote.id
                : generateRandomID();

            const newEmote = {
                id: newId,
                name: emote.name || emote.emoteUrl || '',
                platform: emote.platform || 'unknown',
                emoteName: emote.emoteName || getDefaultEmoteName(emote),
                emoteUrl: emote.emoteUrl || emote.name || '',
                date: emote.date || new Date().toISOString()
            };

            blockedEmotes.push(newEmote);
            blockedEmoteIDs.add(newId);
            newlyAddedIds.add(newId);
        });
    }

    if (Array.isArray(importedData.blockedChannels)) {
        importedData.blockedChannels.forEach(channel => {
            const newId = channel.id && !blockedChannelIDs.has(channel.id) && !blockedEmoteIDs.has(channel.id)
                ? channel.id
                : generateRandomID();

            // Проверяем и устанавливаем префикс для TwitchChannel
            let channelName = channel.prefix || channel.channelName || channel.name || channel.emoteUrl || '';
            if (channel.platform === 'TwitchChannel' && !channelName) {
                channelName = extractPrefix(channel.emoteName, channel.platform);
            }

            const newChannel = {
                id: newId,
                name: channelName || 'Unknown', // Запасное значение, если ничего не удалось извлечь
                platform: channel.platform || 'TwitchChannel',
                emoteName: channel.emoteName || getDefaultEmoteName(channel),
                emoteUrl: channel.emoteUrl || channel.name || '',
                date: channel.date || new Date().toISOString()
            };

            blockedChannels.push(newChannel);
            blockedChannelIDs.add(newId);
            newlyAddedIds.add(newId);
        });
    }

    GM_setValue("blockedEmotes", JSON.stringify(blockedEmotes, null, 2));
    GM_setValue("blockedChannels", JSON.stringify(blockedChannels, null, 2));
    console.log("[7BTTVFZ Control Emotes Panel] Импортированы blockedEmotes:", blockedEmotes);
    console.log("[7BTTVFZ Control Emotes Panel] Импортированы blockedChannels:", blockedChannels);
}

// Функция обновления интерфейса
function updateInterface() {
    blockedEmotes = loadData("blockedEmotes", []);
    blockedChannels = loadData("blockedChannels", []);

    blockedEmoteIDs.clear();
    blockedChannelIDs.clear();
    blockedEmotes.forEach(emote => blockedEmoteIDs.add(emote.id));
    blockedChannels.forEach(channel => blockedChannelIDs.add(channel.id));

    updateBlockedList();
    updateCounter();

    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (chatContainer) {
        toggleEmotesInNode(chatContainer); // Используем toggleEmotesInNode вместо hideEmotesForChannel
    } else {
        console.log(
            "%c[7BTTVFZ Control Emotes Panel]%c Контейнер чата не найден при обновлении интерфейса",
            'color:rgb(218, 93, 9); font-weight: bold;',
            'color: rgb(218, 93, 9);'
        );
    }
}

// ------------- Функция скрытия эмодзи в чате
function hideEmotesForChannel(chatContainer) {
    console.log("[7BTTVFZ Control Emotes Panel] Запуск hideEmotesForChannel");
    const emotes = chatContainer.querySelectorAll('.chat-line__message img, .chat-line__message .emote, .chat-line__message .bttv-emote, .chat-line__message .seventv-emote');

    emotes.forEach(emote => {
        const emoteUrl = emote.src || '';
        const emoteAlt = emote.getAttribute('alt') || '';
        let blockedEntry = null;

        // Проверяем, заблокирован ли эмодзи
        if (emoteUrl.includes('7tv.app')) {
            blockedEntry = blockedEmotes.find(e => e.platform === '7tv' && e.emoteUrl === emoteUrl);
        } else if (emoteUrl.includes('betterttv.net')) {
            blockedEntry = blockedEmotes.find(e => e.platform === 'bttTV' && e.emoteUrl === emoteUrl);
        } else if (emoteAlt) {
            blockedEntry = blockedChannels.find(e => e.platform === 'TwitchChannel' && emoteAlt.startsWith(e.name));
        }

        // Устанавливаем data-emote-id, если эмодзи заблокирован
        if (blockedEntry && !emote.getAttribute('data-emote-id')) {
            emote.setAttribute('data-emote-id', blockedEntry.id);
        }

        const emoteId = emote.getAttribute('data-emote-id');
        const isBlocked = emoteId && (blockedChannels.some(e => e.id === emoteId) || blockedEmotes.some(e => e.id === emoteId));

        // Скрываем или показываем эмодзи
        emote.style.display = isBlocked ? 'none' : '';
        console.log(`[7BTTVFZ Control Emotes Panel] Эмодзи ${emoteAlt || emoteUrl} (ID: ${emoteId || 'не установлен'}) ${isBlocked ? 'скрыт' : 'показан'}`);
    });
}

// Функция получения имени эмотикона по умолчанию
function getDefaultEmoteName(channel) {
    if (channel.platform === '7tv' || channel.platform === 'bttTV') {
        return channel.name.split('/').slice(-2, -1)[0] || 'No Name';
    } else if (channel.platform === 'ffz') {
        return channel.emoteName || channel.name.split('/').pop() || 'No Name';
    } else if (channel.platform === 'TwitchChannel') {
        return channel.name.split(/[^a-zA-Z0-9]/)[0] || 'No Name';
    } else {
        return 'No Name';
    }
}





// Добавляем кнопку "Unblock All Emotes" в контейнер кнопок
const unblockAllButton = document.createElement('button');
unblockAllButton.innerText = 'Unblock All Emotes';
unblockAllButton.style.background = buttonColor;
unblockAllButton.style.color = ' #fff';
unblockAllButton.style.border = 'none';
unblockAllButton.style.borderRadius = '4px';
unblockAllButton.style.padding = '5px 10px';
unblockAllButton.style.cursor = 'pointer';
unblockAllButton.style.boxShadow = buttonShadow; // Тень для кнопки "Unblock All Emotes"
buttonContainer.appendChild(unblockAllButton);

// Добавляем кнопку "Back To Block All Emotes" в контейнер кнопок
const blockAllButton = document.createElement('button');
blockAllButton.innerText = 'Back To Block All Emotes';
blockAllButton.style.background = buttonColor;
blockAllButton.style.color = ' #fff';
blockAllButton.style.border = 'none';
blockAllButton.style.borderRadius = '4px';
blockAllButton.style.padding = '5px 10px';
blockAllButton.style.cursor = 'pointer';
blockAllButton.style.boxShadow = buttonShadow; // Тень для кнопки "Back To Block All Emotes"
buttonContainer.appendChild(blockAllButton);

// Обработчик события для кнопки "Unblock All Emotes"
unblockAllButton.onclick = () => {
    const unblockedEmotes = GM_getValue('unblockedEmotes', []);
    const unblockedChannels = GM_getValue('unblockedChannels', []);
    if (blockedEmotes.length > 0 || blockedChannels.length > 0) {
        GM_setValue('unblockedEmotes', blockedEmotes);
        GM_setValue('unblockedChannels', blockedChannels);
        blockedEmotes = [];
        blockedChannels = [];
        GM_setValue('blockedEmotes', JSON.stringify(blockedEmotes, null, 2)); // Исправлено
        GM_setValue('blockedChannels', JSON.stringify(blockedChannels, null, 2)); // Исправлено
        console.log("[7BTTVFZ Control Emotes Panel] Разблокированы все: unblockedEmotes:", blockedEmotes, "unblockedChannels:", blockedChannels);
        updateBlockedList();
        updateCounter();
        showAllEmotes();
    }
};

// Функция для отображения всех смайлов в чате
function showAllEmotes() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (chatContainer) {
        const emotes = chatContainer.querySelectorAll('.chat-line__message img, .chat-line__message .emote, .chat-line__message .bttv-emote, .chat-line__message .seventv-emote');
        emotes.forEach(emote => {
            emote.style.display = ''; // Сбросить стиль display для отображения смайлов
        });
    }
}

// Обработчик события для кнопки "Back To Block All Emotes"
blockAllButton.onclick = () => {
    const unblockedEmotes = GM_getValue('unblockedEmotes', []);
    const unblockedChannels = GM_getValue('unblockedChannels', []);
    if (unblockedEmotes.length > 0 || unblockedChannels.length > 0) {
        blockedEmotes = unblockedEmotes;
        blockedChannels = unblockedChannels;
        GM_setValue('blockedEmotes', JSON.stringify(blockedEmotes));
        GM_setValue('blockedChannels', JSON.stringify(blockedChannels));
        GM_setValue('unblockedEmotes', []);
        GM_setValue('unblockedChannels', []);
        console.log("[7BTTVFZ Control Emotes Panel] Заблокированы все обратно: blockedEmotes:", blockedEmotes, "blockedChannels:", blockedChannels);

        // Обновляем список и счетчик
        updateBlockedList();
        updateCounter();

        // Применяем скрытие эмодзи в чате
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (chatContainer) {
            toggleEmotesInNode(chatContainer);
            console.log("[7BTTVFZ Control Emotes Panel] Применено скрытие эмодзи после восстановления блокировки");
        } else {
            console.log(
                "%c[7BTTVFZ Control Emotes Panel]%c Контейнер чата не найден при восстановлении блокировки",
                'color:rgb(218, 93, 9); font-weight: bold;',
                'color: rgb(218, 93, 9);'
            );
        }
    }
};



// Кнопка "Show Stats Chart"
const showStatsButton = document.createElement('button');
showStatsButton.innerText = 'Show Stats Chart';
showStatsButton.style.cursor = 'pointer';
showStatsButton.style.position = 'relative';
showStatsButton.style.right = '1%';



// Создаём модальное окно для диаграммы
const chartModal = document.createElement('div');
chartModal.style.position = 'fixed';
chartModal.style.top = '35%';
chartModal.style.left = '35%';
chartModal.style.width = '35%';
chartModal.style.height = '55%';
chartModal.style.display = 'none'; // Скрыто по умолчанию
chartModal.style.justifyContent = 'center';
chartModal.style.alignItems = 'center';
chartModal.style.zIndex = '10001';

// Создаём контейнер для диаграммы
const chartContainer = document.createElement('div');
chartContainer.style.background = 'linear-gradient(315deg, hsla(285, 61%, 12%, 1) 0%, hsla(186, 26%, 21%, 1) 55%, hsla(284, 9%, 48%, 1) 100%)';chartContainer.style.padding = '20px';
chartContainer.style.borderRadius = '20px';
chartContainer.style.boxShadow = '16px 20px 20px 5px #0000008c';
chartContainer.style.border = '2px solid #24888e';
chartContainer.style.position = 'relative';
chartContainer.style.width = '600px';
chartContainer.style.maxHeight = '80vh';
chartContainer.style.overflowY = 'auto';

// Создаём кнопку закрытия модального окна
const closeChartButton = document.createElement('button');
closeChartButton.innerText = 'Close';
closeChartButton.style.position = 'absolute';
closeChartButton.style.top = '10px';
closeChartButton.style.right = '10px';
closeChartButton.style.background = ' #944646';
closeChartButton.style.color = ' #fff';
closeChartButton.style.border = 'none';
closeChartButton.style.borderRadius = '4px';
closeChartButton.style.padding = '5px 10px';
closeChartButton.style.cursor = 'pointer';
closeChartButton.onclick = () => {
    chartModal.style.display = 'none';
    // Уничтожаем диаграмму, чтобы избежать утечек памяти
    const existingChart = Chart.getChart('statsChart');
    if (existingChart) {
        existingChart.destroy();
    }
};

// Создаём элемент canvas для диаграммы
const chartCanvas = document.createElement('canvas');
chartCanvas.id = 'statsChart';
chartCanvas.style.maxWidth = '100%';
chartCanvas.style.height = '400px';

// Добавляем элементы в модальное окно
chartContainer.appendChild(closeChartButton);
chartContainer.appendChild(chartCanvas);
chartModal.appendChild(chartContainer);
document.body.appendChild(chartModal);

// Обработчик клика на кнопку "Show Stats Chart"
showStatsButton.onclick = () => {
    // Показываем модальное окно
    chartModal.style.display = 'flex';

    // Собираем данные для диаграммы
    const twitchCount = blockedChannels.length;
    const bttvCount = blockedEmotes.filter(channel => channel.platform === 'bttTV').length;
    const tv7Count = blockedEmotes.filter(channel => channel.platform === '7tv').length;
    const ffzCount = blockedEmotes.filter(channel => channel.platform === 'ffz').length;

    // Данные для диаграммы
    const chartData = {
        labels: ['Twitch', 'BTTV', '7TV', 'FFZ'],
        datasets: [{
            label: 'Blocked Emotes by Platform',
            data: [twitchCount, bttvCount, tv7Count, ffzCount],
            backgroundColor: [
                'rgba(96, 37, 136, 0.6)',  // Twitch
                'rgba(214, 95, 91, 0.6)',  // BTTV
                'rgba(34, 196, 196, 0.6)',  // 7TV
                'rgba(121, 117, 117, 0.66)'   // FFZ
            ],
            borderColor: [
                'rgb(130, 255, 99)',
                'rgb(97, 183, 240)',
                'rgb(255, 238, 86)',
                'rgb(74, 221, 221)'
            ],
            borderWidth: 1
        }]
    };

    // Уничтожаем старую диаграмму, если она существует
    const existingChart = Chart.getChart('statsChart');
    if (existingChart) {
        existingChart.destroy();
    }

    // Создаём новую диаграмму
    new Chart(chartCanvas, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: ' #E5E7EB' // Цвет текста легенды
                    }
                },
                title: {
                    display: true,
                    text: 'Blocked Emotes by Platform',
                    color: ' #E5E7EB' // Цвет текста заголовка
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Blocked Emotes',
                        color: ' #E5E7EB' // Цвет текста заголовка оси Y
                    },
                    ticks: {
                        color: ' #E5E7EB' // Цвет текста значений на оси Y
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Platform',
                        color: ' #E5E7EB' // Цвет текста заголовка оси X
                    },
                    ticks: {
                        color: ' #E5E7EB' // Цвет текста значений на оси X
                    }
                }
            }
        }
    });
};


//======================= Счётчик ========================//
const counter = document.createElement('div');
counter.style.display = 'flex';
counter.style.flexDirection = 'row';
counter.style.justifyContent = 'center';
counter.style.width = '460px';
counter.style.backgroundColor = ' #b69dcf'; // Белый фон
counter.style.color = ' #4c2a5e'; // Цвет текста (темно-фиолетовый)
counter.style.border = '3px solid #4c2a5e'; // Граница того же цвета, что и текст
counter.style.borderRadius = '8px'; // Радиус скругления границы
counter.style.padding = '5px 0px'; // Отступы для удобства
counter.style.marginLeft = '6px'; // Отступ слева для отделения от других элементов
counter.style.fontWeight = 'bold'; // Жирное начертание текста
counter.style.fontSize = '16px'; // Устанавливаем размер шрифта для лучшей видимости
counter.style.bottom = '545px'; // Обновленное положение сверху
counter.style.left = '202px'; // Обновленное положение справа
counter.style.position = 'relative '; // Относительное позиционирование для точного расположения

controlPanel.appendChild(counter);

// Функция для обновления счётчика
function updateCounter() {
    const twitchCount = blockedChannels.length;
    const bttvCount = blockedEmotes.filter(channel => channel.platform === 'bttTV').length;
    const tv7Count = blockedEmotes.filter(channel => channel.platform === '7tv').length;
    const ffzCount = blockedEmotes.filter(channel => channel.platform === 'ffz').length;
    const totalCount = twitchCount + bttvCount + tv7Count + ffzCount;
    counter.innerText = `Twitch: ${twitchCount} | BTTV: ${bttvCount} | 7TV: ${tv7Count} | FFZ: ${ffzCount} | Total: ${totalCount}`;
}

// Добавляем элементы на страницу
inputContainer.appendChild(input);
inputContainer.appendChild(addButton);
controlPanel.appendChild(inputContainer);

// Перемещаем контейнер кнопок вниз
controlPanel.appendChild(buttonContainer);

document.body.appendChild(controlPanel);

// Вызываем функцию обновления счётчика
updateCounter();




//============= Создаем кнопку "Open Panel  " ===================//
// Загружаем сохранённое состояние переключателя из хранилища

const openPanelButton = document.createElement('button');
openPanelButton.innerText = 'panel control emotes';
openPanelButton.style.fontWeight = 'bold';
openPanelButton.style.top = '22px';
openPanelButton.style.right = '1344px';
openPanelButton.style.position = 'fixed'; // Фиксированное положение
openPanelButton.style.width = '200px'; // Фиксированная ширина кнопки
openPanelButton.style.height = '41px'; // Фиксированная высота кнопки
openPanelButton.style.background = ' #5d5d5d'; // Цвет кнопки
openPanelButton.style.color = ' #171c1c';
openPanelButton.style.border = 'none'; // Без границ
openPanelButton.style.borderRadius = '20px'; // Закругленные углы
openPanelButton.style.padding = '10px';
openPanelButton.style.cursor = 'pointer';
openPanelButton.style.zIndex = 10000; // Высокий z-index
openPanelButton.style.transition = 'background 0.3s ease'; // Плавное изменение фона
openPanelButton.style.display = 'flex';
openPanelButton.style.alignItems = 'center';
openPanelButton.style.justifyContent = 'space-between'; // Чтобы текст и переключатель были по разным краям

// Создаем контейнер для переключателя (темная рамка)
const switchContainer = document.createElement('div');
switchContainer.style.width = '44px'; // Увеличиваем ширину контейнера на 6px
switchContainer.style.height = '27px'; // Увеличиваем высоту контейнера на 6px
switchContainer.style.borderRadius = '13px'; // Скругленные углы
switchContainer.style.backgroundColor = ' #171c1c';  // Темно сеая рамка для кружка
switchContainer.style.position = 'relative'; // Для абсолютного позиционирования кружка
switchContainer.style.transition = 'background 0.3s ease'; // Плавное изменение фона контейнера
openPanelButton.appendChild(switchContainer);

// Создаем фиолетовый кружок (переключатель кружок )
const switchCircle = document.createElement('div');
switchCircle.style.width = '19px'; // Увеличиваем ширину кружка на 3px
switchCircle.style.height = '19px'; // Увеличиваем высоту кружка на 3px
switchCircle.style.borderRadius = '50%'; // Кружок
switchCircle.style.backgroundColor = ' #5d5d5d'; // темно Серый  цвет кружка
switchCircle.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.8)'; // Тень для кружка
switchCircle.style.position = 'absolute'; // Абсолютное позиционирование внутри контейнера
switchCircle.style.top = '3px'; // Отступ сверху
switchCircle.style.left = '3px'; // Отступ слева
switchCircle.style.transition = 'transform 0.3s ease'; // Плавное движение
switchContainer.appendChild(switchCircle);

// Функция для обновления состояния переключателя
const updateSwitchState = () => {
    if (isPanelOpen) {
        openPanelButton.style.background = ' #5d5d5d'; // Цвет кнопки при открытой панели
        switchCircle.style.transform = 'translateX(20px)'; // Перемещаем кружок вправо
        switchContainer.style.backgroundColor = ' #464646'; // Цвет контейнера в включённом состоянии
        controlPanel.style.display = 'block'; // Показываем панель
        controlPanel.style.height = '656px'; // Устанавливаем полную высоту
    } else {
        openPanelButton.style.background = ' #5d5d5d'; // Цвет кнопки при закрытой панели
        switchCircle.style.transform = 'translateX(0)'; // Перемещаем кружок влево
        switchContainer.style.backgroundColor = ' #171c1c'; // Цвет контейнера в выключенном состоянии
        controlPanel.style.display = 'none'; // Скрываем панель
        controlPanel.style.height = '0px'; // Сворачиваем панель
    }
};

// Обработчик клика для переключения состояния панели
openPanelButton.onclick = () => {
    isPanelOpen = !isPanelOpen; // Переключаем состояние
    GM_setValue('isPanelOpen', isPanelOpen); // Сохраняем состояние
    updateSwitchState(); // Обновляем видимость и переключатель
};


// Инициализация состояния при загрузке
window.addEventListener('load', () => {
    document.body.appendChild(openPanelButton);
    updateSwitchState(); // Устанавливаем начальное состояние панели и переключателя

    const updateButtonPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        openPanelButton.style.top = `${windowHeight * 0.005}px`; // 5% от высоты окна
        openPanelButton.style.right = `400px`; // Фиксированный отступ 50px от правого
    };

    updateButtonPosition();
    window.addEventListener('resize', updateButtonPosition);
});

// ==========================  end of open panelButton  ================================= //



// ===================  Вставки в контейнер  "penPanelButton" рядом с кнопкой "Go Ad-Free for Free" =================== //
// Функция для Вставки в контейнер  "penPanelButton" рядом с кнопкой "Go Ad-Free for Free"
function addOpenPanelButtonToNav() {
    // Находим контейнер кнопки "Notifications"
    const notificationsButtonContainer = document.querySelector('button[aria-label="Open Notifications"]')?.closest('.Layout-sc-1xcs6mc-0.czRfnU');
    if (!notificationsButtonContainer) {
        console.error('[7BTTVFZ Control Emotes Panel] Контейнер для кнопки "Notifications" не найден');
        return;
    }

    // Проверяем, не добавлена ли кнопка уже
    if (notificationsButtonContainer.querySelector('#openPanelButton')) {
        console.log('[7BTTVFZ Control Emotes Panel] Кнопка openPanelButton уже добавлена');
        return;
    }

    // Создаём контейнер для openPanelButton, чтобы соответствовать стилю Twitch
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'Layout-sc-1xcs6mc-0 cwtKyw tw-mg-x-05'; // Добавляем tw-mg-x-05 для отступов
    buttonWrapper.style.marginLeft = '10px'; // Отступ слева от кнопки Notifications
    buttonWrapper.style.marginRight = '5px'; // Отступ справа для следующего элемента

    // Создаём внутренний контейнер для стилизации
    const innerWrapper = document.createElement('div');
    innerWrapper.className = 'InjectLayout-sc-1i43xsx-0 kBtJDm';

    // Применяем классы Twitch к openPanelButton для единообразного стиля
    openPanelButton.classList.add('ScCoreButton-sc-ocjdkq-0', 'kIbAir', 'ScButtonIcon-sc-9yap0r-0', 'eSFFfM');
    openPanelButton.id = 'openPanelButton';
    openPanelButton.setAttribute('aria-label', 'Toggle Control Emotes Panel');
    openPanelButton.setAttribute('data-a-target', 'control-emotes-panel-toggle');

    // Добавляем кнопку во внутренний контейнер
    innerWrapper.appendChild(openPanelButton);
    buttonWrapper.appendChild(innerWrapper);

    // Вставляем новый контейнер после кнопки "Notifications"
    notificationsButtonContainer.insertAdjacentElement('afterend', buttonWrapper);

    // Устанавливаем position: relative, чтобы кнопка следовала потоку
    openPanelButton.style.position = 'relative';
    openPanelButton.style.top = '0';
    openPanelButton.style.right = '0';

    console.log('[7BTTVFZ Control Emotes Panel] Кнопка openPanelButton добавлена рядом с "Notifications"');
}

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Ждём, пока навигационная панель загрузится
    const checkNav = setInterval(() => {
        const notificationsButton = document.querySelector('button[aria-label="Open Notifications"]');
        if (notificationsButton) {
            addOpenPanelButtonToNav();
            clearInterval(checkNav);
        }
    }, 1000); // Проверяем каждую секунду
});
// ============================= end of Вставки в контейнер  "penPanelButton"  =============================== //


//================== Блокировка и Запуск скрытия эмодзи в чате ==================//

//=============== Генерация случайного ID ===============//
function generateRandomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomLength = Math.floor(Math.random() * 67) + 1; // Случайная длина от 1 до 68
    let randomID = '';
    for (let i = 0; i < randomLength; i++) {
        randomID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `emote_${randomID}`;
}



// Оптимизированная версия toggleEmotesInNode
const debouncedToggleEmotes = debounce(toggleEmotesInNode, 100);

async function toggleEmotesInNode(node) {
    try {
        console.log(`%c[${new Date().toISOString()}] %c[7BTTVFZ Control Emotes Panel] %ctoggleEmotesInNode - starting`,
            'color: rgb(63, 136, 219);',
            'color: rgb(52, 163, 148); font-weight: bold;');

        const emotes = node.querySelectorAll('.chat-line__message img, .chat-line__message .emote, .chat-line__message .bttv-emote, .chat-line__message .seventv-emote');
        console.log(`[7BTTVFZ Control Emotes Panel] Найдено эмодзи для обработки: ${emotes.length}`);

        for (const emote of emotes) {
            const emoteUrl = emote.src || emote.getAttribute('srcset')?.split(' ')[0] || '';
            const emoteAlt = emote.getAttribute('alt') || '';
            let blockedEntry = null;

            if (emoteUrl.includes('7tv.app')) {
                blockedEntry = blockedEmotes.find(e => e.platform === '7tv' && e.emoteUrl === emoteUrl);
            } else if (emoteUrl.includes('betterttv.net')) {
                blockedEntry = blockedEmotes.find(e => e.platform === 'bttTV' && e.emoteUrl === emoteUrl);
            } else if (emoteUrl.includes('frankerfacez.com')) {
                blockedEntry = blockedEmotes.find(e => e.platform === 'ffz' && e.emoteUrl === emoteUrl);
            } else if (emoteAlt) {
                blockedEntry = blockedChannels.find(e => e.platform === 'TwitchChannel' && emoteAlt.startsWith(e.name));
            }

            if (blockedEntry && !emote.getAttribute('data-emote-id')) {
                emote.setAttribute('data-emote-id', blockedEntry.id);
            }

            const emoteId = emote.getAttribute('data-emote-id');
            const isBlocked = emoteId && (blockedChannels.some(e => e.id === emoteId) || blockedEmotes.some(e => e.id === emoteId));

            emote.style.display = isBlocked ? 'none' : '';
            console.log(`[7BTTVFZ Control Emotes Panel] Эмодзи ${emoteAlt || emoteUrl} (ID: ${emoteId || 'не установлен'}) ${isBlocked ? 'скрыт' : 'показан'}`);
        }

        console.log(`%c[${new Date().toISOString()}] %c[7BTTVFZ Control Emotes Panel] %ctoggleEmotesInNode - completed`,
            'color: rgb(63, 136, 219);',
            'color: rgb(52, 163, 148); font-weight: bold;');
    } catch (error) {
        console.error(`[ERROR] Ошибка в toggleEmotesInNode:`, error);
    }
}
// Используем дебаунс в наблюдателе
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                console.log(`%cНовый узел добавлен в DOM`,
                    'color:rgb(29, 202, 136) ;');
                debouncedToggleEmotes(node);
            }
        });
    });
});



function observeChatContainer() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (chatContainer) {
        // Успешно - зеленый цвет
           console.log(
             '%c[7BTTVFZ Control Emotes Panel]%c Контейнер чата найден, начинаем наблюдение',
             'color: #00C4B4; font-weight: bold;', // Стиль для [7BTTVFZ Control Emotes Panel]
             'color: #00C4B4;' // Стиль для остального текста
           );
        observer.disconnect(); // Останавливаем старое наблюдение
        observer.observe(chatContainer, { childList: true, subtree: true });
        toggleEmotesInNode(chatContainer); // Проверяем существующие сообщения
    } else {
        // Неуспешно  - красный цвет
            console.log(
              '%c[7BTTVFZ Control Emotes Panel]%c Контейнер чата не найден, повторная попытка через 500мс',
              'color: #FF5555; font-weight: bold;', // Стиль для [7BTTVFZ Control Emotes Panel]
              'color: #FF5555;' // Стиль для остального текста
            );
        setTimeout(observeChatContainer, 500);
    }
}

// Добавляем наблюдение за изменениями на более высоком уровне DOM
function startRootObserver() {
    const rootObserver = new MutationObserver(() => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        // Состояние контейнера чата - зеленый если найден, красный если не найден
           console.log(
             '%c[7BTTVFZ Control Emotes Panel]%c RootObserver: контейнер чата %c' + (chatContainer ? 'найден' : 'не найден'),
             'color: #1E90FF; font-weight: bold;', // Стиль для [7BTTVFZ Control Emotes Panel] (DodgerBlue)
             'color: #1E90FF;', // Стиль для "RootObserver: контейнер чата"
             `color: ${chatContainer ? ' #00C4B4' : ' #FF5555'}; font-weight: bold;` // Зеленый (#00C4B4) или красный (#FF5555) для статуса
           );

        if (chatContainer) {
            observeChatContainer();
        }
    });
    rootObserver.observe(document.body, { childList: true, subtree: true });
    // Запуск RootObserver - синий цвет (информационный)
         console.log(
           '%c[7BTTVFZ Control Emotes Panel]%c RootObserver запущен',
           'color: #1E90FF; font-weight: bold;', // Стиль для [7BTTVFZ Control Emotes Panel] (DodgerBlue)
           'color: #1E90FF;' // Стиль для остального текста
         );

}

// Запускаем наблюдение
startRootObserver();


let lastUrl = location.href;

function checkUrlChange() {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        console.log('[7BTTVFZ Control Emotes Panel] URL изменился, перезапускаем наблюдение за чатом');
        ContextMenuManager.removeMenu(); // Удаляем контекстное меню
        lastUrl = currentUrl;
        observeChatContainer();
    }
    setTimeout(checkUrlChange, 1000);
}

checkUrlChange();




//=============== Контекстное меню ===============//
const contextMenuStyle = document.createElement('style');
contextMenuStyle.innerHTML = `
  .custom-context-menu {
     position: absolute;
     background:rgb(19, 88, 39);
     border: 1px solid #ccc;
     padding: 5px;
     z-index: 10002;
     cursor: pointer;
     color: #fff;
     transition: background 0.3s ease;
     user-select: none;
     min-width: 150px;
     box-shadow: 0 2px 8px 2px #8BC34A;
     border-radius: 8px;
   }
     .custom-context-menu:hover {
        background:rgb(16, 68, 30);
   }
`;
document.head.appendChild(contextMenuStyle);

const ContextMenuManager = {
    menu: null,
    isProcessing: false, // Флаг для предотвращения многократных нажатий

    createMenu(event, emotePrefix, platform, emoteName) {
        this.removeMenu();
        const menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        menu.style.top = `${event.pageY}px`;
        menu.style.left = `${event.pageX}px`;
        menu.innerText = `Block Emote (${emoteName || 'Unknown'})`;
        console.log(`%c[${new Date().toISOString()}] %c[7BTTVFZ Control Emotes Panel] %cContext menu created at:`,
            'color: rgb(85, 113, 165);',
            'color: rgb(85, 113, 165); font-weight: bold;',
            'color: rgb(85, 113, 165);', event.pageX, event.pageY);

        document.body.appendChild(menu);
        this.menu = menu;

        menu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isProcessing) return; // Пропускаем, если обработка уже идет
            this.isProcessing = true;

            console.log(`%c[${new Date().toISOString()}] %c[7BTTVFZ Control Emotes Panel] %cBlocking emote: ${emoteName}`,
                'color: rgb(209, 89, 129);',
                'color: rgb(255, 50, 50); font-weight: bold;',
                'color: rgb(209, 89, 129);');

            this.blockEmote(emotePrefix, platform, emoteName);
            this.removeMenu();
            this.isProcessing = false;
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) this.removeMenu();
        }, { once: true });
    },

    removeMenu() {
        if (this.menu) {
            console.log(`%c[${new Date().toISOString()}] %c[7BTTVFZ Control Emotes Panel] %cRemoving context menu`,
                'color: rgb(209, 89, 129);',
                'color: rgb(115, 2, 160); font-weight: bold;',
                'color: white;');
            this.menu.remove();
            this.menu = null;
        }
    },

    blockEmote(emotePrefix, platform, emoteName) {
        const emoteId = generateRandomID();
        const currentDateTime = new Date().toISOString();
        const newEntry = {
            id: emoteId,
            name: emotePrefix, // Префикс (например, "guwu")
            platform: platform,
            emoteName: emoteName || emotePrefix.split('/').pop() || 'Unknown', // Полное название (например, "guwuPopcorn")
            emoteUrl: platform === 'TwitchChannel' ? emotePrefix : emotePrefix, // Для Twitch используем префикс как URL
            date: currentDateTime
        };

        const isDuplicate = platform === 'TwitchChannel'
            ? blockedChannels.some(e => e.name === newEntry.name && e.platform === newEntry.platform)
            : blockedEmotes.some(e => e.emoteUrl === newEntry.emoteUrl && e.platform === newEntry.platform);

        if (isDuplicate) {
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cEmote already blocked: ${newEntry.emoteName}`,
                'color: rgb(255, 165, 0); font-weight: bold;',
                'color: rgb(255, 165, 0);');
            return;
        }

        if (platform === 'TwitchChannel') {
            blockedChannels.push(newEntry);
            blockedChannelIDs.add(emoteId);
            newlyAddedIds.add(emoteId);
            GM_setValue("blockedChannels", JSON.stringify(blockedChannels, null, 2));
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cAdded to blockedChannels:`,
                'color: rgb(0, 255, 0); font-weight: bold;',
                'color: rgb(0, 255, 0);', newEntry);
        } else {
            blockedEmotes.push(newEntry);
            blockedEmoteIDs.add(emoteId);
            newlyAddedIds.add(emoteId);
            GM_setValue("blockedEmotes", JSON.stringify(blockedEmotes, null, 2));
            console.log(`%c[7BTTVFZ Control Emotes Panel] %cAdded to blockedEmotes:`,
                'color: rgb(0, 255, 0); font-weight: bold;',
                'color: rgb(0, 255, 0);', newEntry);
        }

        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (chatContainer) {
            toggleEmotesInNode(chatContainer);
        }

        updateBlockedList();
        updateCounter();
    }
};

//=============== Обработчик контекстного меню ===============//
// блокировка сайлов правой кнопкой //
document.addEventListener('contextmenu', (event) => {
    const target = event.target;
    if (target.tagName === 'IMG' && target.closest('.chat-line__message')) {
        event.preventDefault();
        const emoteUrl = target.src || target.getAttribute('srcset')?.split(' ')[0] || '';
        const emoteAlt = target.getAttribute('alt') || '';
        const dataProvider = target.getAttribute('data-provider') || '';
        let emotePrefix = '';
        let platform = '';
        let emoteName = emoteAlt;

        console.log(`[${new Date().toISOString()}] [7BTTVFZ Control Emotes Panel] Context menu triggered for:`, emoteUrl, emoteAlt, 'data-provider:', dataProvider);

        // Определяем платформу и префикс
        if (dataProvider === 'bttv' && emoteUrl.includes('betterttv.net')) {
            emotePrefix = emoteUrl || `https://cdn.betterttv.net/emote/${target.getAttribute('data-id')}/2x.webp`;
            platform = 'bttTV';
            console.log("[7BTTVFZ Control Emotes Panel] Detected bttv emote (via data-provider):", emotePrefix);
        } else if (dataProvider === 'ffz' && emoteUrl.includes('frankerfacez.com')) {
            emotePrefix = emoteUrl || `https://cdn.frankerfacez.com/emote/${target.getAttribute('data-id')}/2`;
            platform = 'ffz';
            emoteName = emoteAlt;
            console.log("[7BTTVFZ Control Emotes Panel] Detected ffz emote (via data-provider):", emotePrefix);
        } else if (dataProvider === 'ffz' && emoteUrl.includes('7tv.app')) {
            emotePrefix = emoteUrl || `https://cdn.7tv.app/emote/${target.getAttribute('data-id')}/2x.webp`;
            platform = '7tv';
            console.log("[7BTTVFZ Control Emotes Panel] Detected 7tv emote (via data-provider):", emotePrefix);
        } else if (emoteUrl.includes('betterttv.net')) {
            emotePrefix = emoteUrl;
            platform = 'bttTV';
            console.log("[7BTTVFZ Control Emotes Panel] Detected bttv emote (via URL):", emoteUrl);
        } else if (emoteUrl.includes('7tv.app')) {
            emotePrefix = emoteUrl;
            platform = '7tv';
            console.log("[7BTTVFZ Control Emotes Panel] Detected 7tv emote (via URL):", emoteUrl);
        } else if (emoteUrl.includes('frankerfacez.com')) {
            emotePrefix = emoteUrl;
            platform = 'ffz';
            emoteName = emoteAlt;
            console.log("[7BTTVFZ Control Emotes Panel] Detected ffz emote (via URL):", emoteUrl);
        } else if (emoteAlt) {
            // Обновленная логика для TwitchChannel
            const match = emoteAlt.match(/^([a-z0-9]+)([A-Z].*)$/); // Ищем префикс до первой заглавной буквы
            if (match) {
                emotePrefix = match[1]; // Например, "lowti3" из "lowti3Face3"
                emoteName = emoteAlt;   // Полное название, например "lowti3Face3"
            } else {
                // Если не удалось разделить, используем первую группу символов до не-букв/цифр как запасной вариант
                emotePrefix = emoteAlt.split(/[^a-zA-Z0-9]/)[0] || emoteAlt;
                emoteName = emoteAlt;
            }
            platform = 'TwitchChannel';
            console.log("[7BTTVFZ Control Emotes Panel] Detected TwitchChannel emote:", emoteAlt, "prefix:", emotePrefix);
        }

        if (emotePrefix && platform) {
            console.log(`[7BTTVFZ Control Emotes Panel] Creating context menu for emote with prefix: ${emotePrefix}, platform: ${platform}`);
            ContextMenuManager.createMenu(event, emotePrefix, platform, emoteName);
        } else {
            console.log("[7BTTVFZ Control Emotes Panel] Could not determine platform or prefix, using fallback TwitchChannel");
            ContextMenuManager.createMenu(event, emoteAlt || emoteUrl, 'TwitchChannel', emoteAlt || 'Unknown');
        }
    }
});

//=============== Запуск ===============//
observeChatContainer();







//====================== Управление высотой панели =======================
function closePanel() {
    isPanelOpen = false;
    GM_setValue('isPanelOpen', isPanelOpen);
    controlPanel.style.height = '0px'; // Плавно уменьшаем высоту
    setTimeout(() => {
        if (!isPanelOpen) controlPanel.style.display = 'none'; // Полностью скрываем после завершения анимации
    }, 150); // Таймер соответствует времени анимации
}

//----------------- Анимация сворачивания панели-------------------------
function openPanel() {
    isPanelOpen = true;
    GM_setValue('isPanelOpen', isPanelOpen);
    controlPanel.style.display = 'block'; // Делаем панель видимой
    setTimeout(() => {
        controlPanel.style.height = '656px'; // Плавно увеличиваем высоту
    }, 0); // Устанавливаем высоту с задержкой для работы анимации
}

//========================== Переключение состояния панели Управления 'openPanelButton' ===============================
openPanelButton.onclick = () => {
    isPanelOpen = !isPanelOpen; // Переключаем состояние панели (открыта/закрыта)
    GM_setValue('isPanelOpen', isPanelOpen);

    // Перемещаем переключатель (круглый элемент), когда панель открывается или закрывается
    switchCircle.style.transform = isPanelOpen ? 'translateX(20px)' : 'translateX(0)';

    // Меняем цвет фона контейнера в зависимости от состояния панели
     // switchContainer.style.backgroundColor = isPanelOpen ? ' #9e9e9e' : ' #171c1c'; //
     // закоментируем убрав  временно для будущих версий  switchContainer //

    // Переключаем видимость панели: открываем или закрываем
    if (isPanelOpen) {
        openPanel(); // Вызов функции для открытия панели
    } else {
        closePanel(); // Вызов функции для закрытия панели
    }
};

// Инициализация состояния
updateSwitchState(); // Убедимся, что переключатель синхронизирован с начальным состоянием
updateBlockedList();
updateCounter();





//============== Минипанель с кнопками сортировки по категориям =================//
const sortContainer = document.createElement('div');
sortContainer.id = 'sortContainer';
sortContainer.style.display = 'flex';
sortContainer.style.justifyContent = 'space-around';
sortContainer.style.backgroundColor = ' rgb(89 51 114)';
sortContainer.style.padding = '5px';
sortContainer.style.marginBottom = '37px';
sortContainer.style.position = 'relative';
sortContainer.style.top = '57px';
sortContainer.style.borderRadius = '8px 8px 0 0'; // Закругление только верхних углов
sortContainer.style.border = '1px solid rgb(255, 255, 255)';
sortContainer.style.boxShadow = ' rgb(0 0 0 / 0%) 0px 15px 6px 0px'; // Использование RGBA для прозрачности
sortContainer.style.zIndex = 'inherit'; // Наследует z-index от родителя

// Определение начальных значений для currentSortOrder
let currentSortOrder = {
    name: 'asc',
    platform: 'asc',
    date: 'asc'
};

// Кнопки сортировки
const sortByNameButton = document.createElement('button');
sortByNameButton.innerHTML = 'Name ▲';
sortByNameButton.style.cursor = 'pointer';
sortByNameButton.style.position = 'relative';
sortByNameButton.style.left = '13%';

sortByNameButton.onclick = () => {
    const order = currentSortOrder.name === 'asc' ? 'desc' : 'asc';
    currentSortOrder.name = order;
    sortByNameButton.innerHTML = `Name ${order === 'asc' ? '▲' : '▼'}`; // Переключение стрелочки
    sortblockedEmotes('name', order);
};
sortContainer.appendChild(sortByNameButton);

const sortByPlatformButton = document.createElement('button');
sortByPlatformButton.innerHTML = 'Platform ▲';
sortByPlatformButton.style.cursor = 'pointer';
sortByPlatformButton.style.position = 'relative';
sortByPlatformButton.style.right = '118px';

sortByPlatformButton.onclick = () => {
    const order = currentSortOrder.platform === 'asc' ? 'desc' : 'asc';
    currentSortOrder.platform = order;
    sortByPlatformButton.innerHTML = `Platform ${order === 'asc' ? '▲' : '▼'}`;
    sortblockedEmotes('platform', order);
};
sortContainer.appendChild(sortByPlatformButton);

const sortByDateButton = document.createElement('button');
sortByDateButton.innerHTML = 'Date-Time ▲';
sortByDateButton.style.cursor = 'pointer';
sortByDateButton.style.top = '0px';
sortByDateButton.style.position = 'relative';
sortByDateButton.style.left = '9px';
sortByDateButton.onclick = () => {
    const order = currentSortOrder.date === 'asc' ? 'desc' : 'asc';
    currentSortOrder.date = order;
    sortByDateButton.innerHTML = `Date ${order === 'asc' ? '▲' : '▼'}`;
    sortblockedEmotes('date', order);
};
sortContainer.appendChild(sortByDateButton);

// Добавляем контейнер сортировки в панель управления
controlPanel.insertBefore(sortContainer, title);


// ---------- goToLast    Button ------------- //
const goToLastButton = document.createElement('button');
goToLastButton.innerHTML = 'Go To Last Element ▼'; // Короткое название
goToLastButton.style.cursor = 'pointer';
goToLastButton.style.position = 'relative';
goToLastButton.style.right = '2%'; // Сдвигаем чуть левее для баланса

goToLastButton.onclick = () => {
    goToLastAddedItem();
};
sortContainer.appendChild(goToLastButton);
sortContainer.appendChild(showStatsButton);




//============== Функция для сортировки списка =================//
function sortblockedEmotes(criteria, order) {
    const sortFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            comparison = a.emoteName.localeCompare(b.emoteName);
        } else if (criteria === 'platform') {
            comparison = a.platform.localeCompare(b.platform);
        } else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };

    // Сортируем оба массива
    blockedEmotes.sort(sortFunc);
    blockedChannels.sort(sortFunc);

    // Обновляем интерфейс после сортировки
    updateBlockedList();
}
//============== Обработчики событий для кнопок =================//
const buttons = [addButton, clearAllButton, exportButton, importButton, unblockAllButton, blockAllButton];
buttons.forEach(button => {
    button.onmouseover = function() {
        button.style.background = '-webkit-linear-gradient(135deg, #443157 0%,rgb(90, 69, 122) 56%, #443157 98%, #443157 100%)'; // Изменение фона при наведении
    };
    button.onmouseout = function() {
        button.style.background = buttonColor; // Возвращаем исходный цвет
    };
});



// ========= Функция для прокрутки к последнему добавленному элементу ============= //
function goToLastAddedItem() {
    const allItems = [...blockedEmotes, ...blockedChannels];
    if (allItems.length === 0) {
        console.log("[7BTTVFZ Control Emotes Panel] Список пуст, некуда прокручивать");
        return;
    }

    // Находим элемент с самой поздней датой
    const lastItem = allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    });

    // Ищем элемент в DOM по его ID
    let lastElement = list.querySelector(`[data-id="${lastItem.id}"]`);
    if (lastElement) {
        // Подсвечиваем элемент
        lastElement.classList.add('last-item-highlight');

        // Прокручиваем к элементу
        const itemOffsetTop = lastElement.offsetTop;
        const listHeight = list.clientHeight;
        const itemHeight = lastElement.clientHeight;
        const scrollPosition = itemOffsetTop - (listHeight / 2) + (itemHeight / 2);
        list.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        // Убираем подсветку через 60 секунд
        setTimeout(() => {
            lastElement.classList.remove('last-item-highlight');
            console.log(`[7BTTVFZ Control Emotes Panel] Подсветка убрана с элемента: ${lastItem.emoteName}`);
        }, 60000); // 60000 мс = 1 минута

        console.log(`[7BTTVFZ Control Emotes Panel] Прокручено и подсвечено: ${lastItem.emoteName} (ID: ${lastItem.id})`);
    } else {
        console.log("[7BTTVFZ Control Emotes Panel] Последний элемент не найден в DOM, обновляем список");
        updateBlockedList();
        setTimeout(() => {
            lastElement = list.querySelector(`[data-id="${lastItem.id}"]`);
            if (lastElement) {
                lastElement.classList.add('last-item-highlight');
                const itemOffsetTop = lastElement.offsetTop;
                const listHeight = list.clientHeight;
                const itemHeight = lastElement.clientHeight;
                const scrollPosition = itemOffsetTop - (listHeight / 2) + (itemHeight / 2);
                list.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    lastElement.classList.remove('last-item-highlight');
                    console.log(`[7BTTVFZ Control Emotes Panel] Подсветка убрана с элемента после обновления: ${lastItem.emoteName}`);
                }, 60000);
                console.log(`[7BTTVFZ Control Emotes Panel] Успешно прокручено и подсвечено после обновления: ${lastItem.emoteName}`);
            }
        }, 100);
    }
}

console.log(getComputedStyle(controlPanel).display);
console.log("[7BTTVFZ Control Emotes Panel] Opening control panel...");
console.log("[7BTTVFZ Control Emotes Panel] Creating control panel...");
console.log("[7BTTVFZ Control Emotes Panel] Adding button...");
console.log("[7BTTVFZ Control Emotes Panel] Updating channel list...");
console.log("[7BTTVFZ Control Emotes Panel] Creating file input element...");
// Удаляем некорректные логи с event, так как они не в контексте события
console.log("[7BTTVFZ Control Emotes Panel] Processing imported channels...");
console.log("[7BTTVFZ Control Emotes Panel] Updating interface...");
console.log("[7BTTVFZ Control Emotes Panel] Showing all emotes in chat...");
console.log("[7BTTVFZ Control Emotes Panel] Blocking all emotes...");
console.log("[7BTTVFZ Control Emotes Panel] Hiding emotes for a channel...");
console.log(`%c[7BTTVFZ Control Emotes Panel] %cWaiting for chat container...`,
    'color:rgb(255, 114, 173); font-weight: bold;', // Стиль для [7BTTVFZ Control Emotes Panel]
    'color: rgb(255, 114, 173)  ;'); // Стиль для остального текста

console.log("[7BTTVFZ Control Emotes Panel] Creating context menu...");





// Добавляем переменные для отслеживания состояния
let lastKnownBlockedCount = blockedEmotes.length + blockedChannels.length;
let lastCheckTime = Date.now();
let isRestarting = false;

// Функция проверки состояния блокировки
function checkBlockingStatus() {
    console.log(`%c[WATCHDOG] %cПроверка состояния блокировки...`,
        'color:rgb(221, 101, 175); font-weight: bold;',
        'color: rgb(164, 207, 44) ;');

    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (!chatContainer) {
        console.log(
            "%c[WATCHDOG]%c Контейнер чата не найден, перезапускаем наблюдение",
            'color:rgb(172, 147, 223); font-weight: bold;',
            'color: rgb(164, 207, 44) ;');
        observeChatContainer(); // Перезапускаем наблюдение
        return false;
    }

    const emotes = chatContainer.querySelectorAll('.chat-line__message img, .chat-line__message .emote, .chat-line__message .bttv-emote, .chat-line__message .seventv-emote');
    if (emotes.length === 0) {
        console.log("[WATCHDOG] Эмодзи в чате не найдены, пропускаем проверку");
        return true;
    }

    let failureDetected = false;

    emotes.forEach((emote, index) => {
        if (index > 5) return;
        const emoteId = emote.getAttribute('data-emote-id');
        const shouldBeBlocked = emoteId && (blockedChannels.some(e => e.id === emoteId) || blockedEmotes.some(e => e.id === emoteId));
        const isVisible = emote.style.display !== 'none';

        if (shouldBeBlocked && isVisible) {
            console.log(`[WATCHDOG] Обнаружен сбой: эмодзи с ID ${emoteId} должен быть скрыт, но виден!`);
            failureDetected = true;
        } else if (!shouldBeBlocked && !isVisible) {
            console.log(`[WATCHDOG] Обнаружен сбой: эмодзи с ID ${emoteId} не должен быть скрыт, но скрыт!`);
            failureDetected = true;
        }
    });

    const currentBlockedCount = blockedEmotes.length + blockedChannels.length;
    if (currentBlockedCount !== lastKnownBlockedCount) {
        console.log(
            `%c[WATCHDOG] %cКоличество заблокированных элементов изменилось: %c${lastKnownBlockedCount} -> ${currentBlockedCount}`,
            'color: rgb(221, 101, 175); font-weight: bold;',
            'color: rgb(164, 207, 44);',
            'color: rgb(255, 165, 0); font-weight: bold;'
        );
        lastKnownBlockedCount = currentBlockedCount;
    }

    return !failureDetected;
}

function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.innerText = message; // Добавляем текст
    notification.style.position = 'relative';
    notification.style.bottom = '99%';
    notification.style.maxWidth = '155px';
    notification.style.left = '61%';
    notification.style.backgroundColor = ' #341d41';
    notification.style.color = ' #30aa54';
    notification.style.padding = '6px';
    notification.style.borderRadius = '40px';
    notification.style.boxShadow = 'rgb(130, 113, 148) 1px 1px 7px 4px';
    notification.style.zIndex = '1001';
    notification.style.fontSize = '10px';

    // Начальные стили для анимации (уменьшенный размер)
    notification.style.transform = 'scale(0)'; // Начинаем с масштаба 0
    notification.style.opacity = '0'; // Начинаем с прозрачности 0
    notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Плавный переход для масштаба и прозрачности

    document.body.appendChild(notification);

    // Запускаем анимацию увеличения после добавления в DOM
    setTimeout(() => {
        notification.style.transform = 'scale(1)'; // Увеличиваем до нормального размера
        notification.style.opacity = '1'; // Делаем полностью видимым
    }, 10); // Небольшая задержка для запуска перехода

    // Удаляем уведомление после завершения длительности
    setTimeout(() => {
        // Добавляем анимацию исчезновения перед удалением (опционально)
        notification.style.transform = 'scale(0)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300); // Соответствует времени transition
    }, duration);
}

// Функция перезапуска логики блокировки
function restartBlockingLogic() {
    if (isRestarting) return;
    isRestarting = true;
   // Перезапуск логики - оранжевый цвет (в процессе)
          console.log(
            '%c[WATCHDOG]%c Перезапуск логики блокировки...',
            'color: #FF4500; font-weight: bold;', // Стиль для [WATCHDOG] (OrangeRed)
            'color: #FF4500;' // Стиль для остального текста
          );
    showNotification(" chat not found ... waiting... ", 3000); // уведомление о перезапуске когда сбой  failure

    observer.disconnect();
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (chatContainer) {
        const emotes = chatContainer.querySelectorAll('.chat-line__message img, .chat-line__message .emote, .chat-line__message .bttv-emote, .chat-line__message .seventv-emote');
        emotes.forEach(emote => {
            emote.style.display = '';
            emote.removeAttribute('data-emote-id');
        });
        observeChatContainer();
        toggleEmotesInNode(chatContainer);
    } else {
        observeChatContainer();
    }

    updateBlockedList();
    updateCounter();
    setTimeout(() => {
        isRestarting = false;
        // Перезапуск завершен - зеленый цвет (успех)
              console.log(
                '%c[WATCHDOG]%c Перезапуск завершен',
                'color: #00C4B4; font-weight: bold;', // Стиль для [WATCHDOG] (Teal)
                'color: #00C4B4;' // Стиль для остального текста
              );
    }, 1000); // Задержка для предотвращения спама
}

// Периодическая проверка состояния (watchdog)
function startWatchdog() {
    const interval = GM_getValue('watchdogInterval', 10) * 1000; // Секунды в миллисекунды
    setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastCheckTime < 5000) return;
        lastCheckTime = currentTime;

        const isWorking = checkBlockingStatus();
        if (!isWorking) {
            console.log(
                '%c[WATCHDOG]%c Обнаружен сбой в работе блокировки, перезапуск...',
                'color: #FFA500; font-weight: bold;',
                'color: #FFA500;'
            );
            restartBlockingLogic();
        } else {
            console.log(
                `%c[WATCHDOG] %cБлокировка работает корректно!`,
                'color:rgb(6, 167, 0); font-weight: bold;',
                'color: rgb(164, 207, 44);'
            );
        }
    }, interval); // Используем динамический интервал
}


    //================  Модуль управления темами ================== //
    (function () {
        // Определяем начальный массив тем
       //================ Модуль управления темами ================== //
(function () {
    // Резервные темы (используются, если загрузка с GitHub не удалась)
    const fallbackThemes = [
        {
            name: 'default',
            displayName: 'Default Theme',
            styles: {
                controlPanel: {
                    background: '-webkit-linear-gradient(270deg, hsla(50, 76%, 56%, 1) 0%, hsla(32, 83%, 49%, 1) 25%, hsla(0, 37%, 37%, 1) 59%, hsla(276, 47%, 24%, 1) 79%, hsla(261, 11%, 53%, 1) 100%)',
                    border: '1px solid #ccc',
                    boxShadow: 'rgb(0 0 0) 0px 18px 29px 3px',
                    color: ' #fff'
                },
                lastItemHighlight: {
                    backgroundColor: ' #ffd700'
                },
                openPanelButton: {
                    background: ' #4c2a5e',
                    color: ' #bda3d7',
                    border: 'none'
                },
                switchContainer: {
                    backgroundColor: ' #ccb8eb5c',
                    activeBackgroundColor: ' #bda3d7'
                },
                switchCircle: {
                    backgroundColor: ' #4c2a5e',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
                },
                list: {
                    background: '-webkit-linear-gradient(45deg, hsla(292, 44%, 16%, 1) 0%, hsla(173, 29%, 48%, 1) 100%)',
                    border: '1px solid #ffffff',
                    color: ' #fff',
                    scrollbarThumb: ' #C1A5EF',
                    scrollbarTrack: ' #455565'
                },
                counter: {
                    backgroundColor: ' #b69dcf',
                    color: ' #4c2a5e',
                    border: '3px solid #4c2a5e'
                },
                sortContainer: {
                    backgroundColor: 'rgb(89, 51, 114)',
                    border: '1px solid rgb(255, 255, 255)',
                    color: ' #fff'
                },
                title: {
                    color: ' #2a1e38'
                },
                buttons: {
                    background: ' #907cad',
                    color: ' #fff'
                },
                versionLabel: {
                    color: 'rgb(62, 33, 85)'
                },
                searchInput: {
                    background: ' #192427',
                    color: ' #b69dcf',
                    border: '1px solid #b69dcf'
                },
                input: {
                    background: ' #192427',
                    color: ' #b69dcf',
                    border: '1px solid #b69dcf'
                },
                themeSelect: {
                    background: ' #192427',
                    color: ' #b69dcf',
                    border: '1px solid #c1a5ef'
                },
                platformSelect: {
                    background: ' #192427',
                    color: ' #b69dcf',
                    border: '1px solid #c1a5ef'
                },
                deleteButton: {
                    background: ' #944646',
                    color: ' #fff',
                    hoverBackground: 'linear-gradient(135deg, #480a0c 56%, #ca5d5f 98%, #8b4040 100%)'
                },
                listItemText: {
                    color: ' #ffffff'
                },
                listItemLink: {
                    color: ' #b3e0f2'
                },
                listItemDate: {
                    color: ' #cccccc'
                },
                chartWrapper: {
                    backgroundColor: ' #fff',
                    border: '1px solid #ffffff',
                    color: ' #000'
                }
            }
        }
    ];

    // Загружаем кэшированные темы или используем резервные
    let themes = GM_getValue('themes', fallbackThemes);
    let selectedThemeName = GM_getValue('selectedTheme', 'default');

    // Функция для загрузки тем с GitHub
    async function loadThemesFromGitHub() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/sopernik566/Control_Emotes_Panel_Twitch_JS/refs/heads/main/themes.json',
                onload: function (response) {
                    try {
                        const loadedThemes = JSON.parse(response.responseText);
                        console.log('[7BTV Control Emotes Panel] Темы загружены с GitHub:', loadedThemes);
                        themes = loadedThemes;
                        GM_setValue('themes', themes); // Кэшируем темы локально
                        resolve(themes);
                    } catch (err) {
                        console.error('[7BTV Control Emotes Panel] Ошибка парсинга тем с GitHub:', err);
                        reject(err);
                    }
                },
                onerror: function (err) {
                    console.error('[7BTV Control Emotes Panel] Ошибка загрузки тем с GitHub:', err);
                    reject(err);
                }
            });
        });
    }

    // Функция для сохранения тем в хранилище
    function saveThemes() {
        GM_setValue('themes', themes);
        console.log('[7BTV Control Emotes Panel] Темы сохранены в хранилище:', themes);
    }

    // Функция для сохранения выбранной темы
    function saveSelectedTheme(themeName) {
        selectedThemeName = themeName;
        GM_setValue('selectedTheme', themeName);
        console.log('[7BTV Control Emotes Panel] Выбранная тема сохранена:', themeName);
    }

    // Функция для применения темы
    function applyTheme(themeName) {
        const theme = themes.find(t => t.name === themeName) || themes[0];
        if (!theme) {
            console.warn(`[7BTV Control Emotes Panel] Тема ${themeName} не найдена, используется 'default'`);
            applyTheme('default');
            return;
        }

        console.log(`[7BTV Control Emotes Panel] Применение темы: ${themeName}`);

        const currentPanelDisplay = controlPanel.style.display;
        const currentPanelHeight = controlPanel.style.height;

        if (openPanelButton) {
            Object.assign(openPanelButton.style, theme.styles.openPanelButton);
            openPanelButton.style.position = 'fixed';
            openPanelButton.style.zIndex = '10000';
            openPanelButton.style.transition = 'background 0.3s ease';
        }

        if (switchContainer) {
            Object.assign(switchContainer.style, {
                backgroundColor: isPanelOpen ? theme.styles.switchContainer.activeBackgroundColor : theme.styles.switchContainer.backgroundColor,
                width: '44px',
                height: '27px',
                borderRadius: '13px',
                position: 'relative',
                transition: 'background 0.3s ease'
            });
        }

        if (switchCircle) {
            Object.assign(switchCircle.style, theme.styles.switchCircle);
            switchCircle.style.width = '19px';
            switchCircle.style.height = '19px';
            switchCircle.style.borderRadius = '50%';
            switchCircle.style.position = 'absolute';
            switchCircle.style.top = '3px';
            switchCircle.style.left = '3px';
            switchCircle.style.transition = 'transform 0.3s ease';
        }

        if (controlPanel) {
            Object.assign(controlPanel.style, theme.styles.controlPanel);
            controlPanel.style.display = currentPanelDisplay;
            controlPanel.style.height = currentPanelHeight;
            controlPanel.style.transition = 'height 0.3s ease';
        }

        if (list) {
            Object.assign(list.style, theme.styles.list);
            const styleElement = document.getElementById('customScrollbarStyle') || document.createElement('style');
            styleElement.id = 'customScrollbarStyle';
            styleElement.innerHTML = `
                #blockedList::-webkit-scrollbar { width: 25px; }
                #blockedList::-webkit-scrollbar-thumb {
                    background-color: ${theme.styles.list.scrollbarThumb};
                    border-radius: 8px;
                    border: 3px solid #4F3E6A;
                    height: 80px;
                }
                #blockedList::-webkit-scrollbar-thumb:hover { background-color: ${theme.styles.list.scrollbarThumb}; }
                #blockedList::-webkit-scrollbar-thumb:active { background-color: ${theme.styles.list.scrollbarThumb}; }
                #blockedList::-webkit-scrollbar-track {
                    background: ${theme.styles.list.scrollbarTrack};
                    border-radius: 0px 0px 8px 0px;
                }
                #blockedList::-webkit-scrollbar-track:hover { background: ${theme.styles.list.scrollbarTrack}; }
                #blockedList::-webkit-scrollbar-track:active { background: ${theme.styles.list.scrollbarTrack}; }
            `;
            if (!document.getElementById('customScrollbarStyle')) {
                document.head.appendChild(styleElement);
            }
        }

        const lastItemHighlightStyle = document.createElement('style');
        lastItemHighlightStyle.id = 'lastItemHighlightStyle';
        lastItemHighlightStyle.innerHTML = `
            .last-item-highlight {
                background-color: ${theme.styles.lastItemHighlight?.backgroundColor || ' #ffd700'};
                transition: background-color 0.5s ease;
            }
        `;
        const existingStyle = document.getElementById('lastItemHighlightStyle');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(lastItemHighlightStyle);

        if (counter) {
            Object.assign(counter.style, theme.styles.counter);
            counter.style.display = 'flex';
        }

        if (sortContainer) {
            Object.assign(sortContainer.style, theme.styles.sortContainer);
            sortContainer.style.display = 'flex';
        }

        if (title) {
            Object.assign(title.style, theme.styles.title);
            title.style.display = 'block';
        }

        const buttons = [addButton, clearAllButton, exportButton, importButton, unblockAllButton, blockAllButton, searchButton];
        buttons.forEach(button => {
            Object.assign(button.style, theme.styles.buttons);
            button.onmouseover = () => {
                button.style.background = '-webkit-linear-gradient(135deg, #443157 0%, rgb(90, 69, 122) 56%, #443157 98%, #443157 100%)';
            };
            button.onmouseout = () => {
                button.style.background = theme.styles.buttons.background;
            };
        });

        if (versionLabel) {
            Object.assign(versionLabel.style, theme.styles.versionLabel);
        }

        if (searchInput) {
            Object.assign(searchInput.style, theme.styles.searchInput);
        }

        if (input) {
            Object.assign(input.style, theme.styles.input);
        }

        if (platformSelect) {
            Object.assign(platformSelect.style, theme.styles.platformSelect);
        }

        if (themeSelect) {
            Object.assign(themeSelect.style, theme.styles.themeSelect);
        }

        const deleteButtons = list.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            Object.assign(button.style, theme.styles.deleteButton, {
                height: '35px',
                width: '75px',
                fontWeight: 'bold',
                fontSize: '16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s ease'
            });
            button.onmouseover = () => {
                button.style.background = theme.styles.deleteButton.hoverBackground;
            };
            button.onmouseout = () => {
                button.style.background = theme.styles.deleteButton.background;
            };
        });

        currentDeleteButtonStyles = {
            background: theme.styles.deleteButton.background,
            color: theme.styles.deleteButton.color,
            hoverBackground: theme.styles.deleteButton.hoverBackground
        };
        console.log('[7BTV Control Emotes Panel] Сохранены стили кнопки Delete:', currentDeleteButtonStyles);

        if (list) {
            const listItemTexts = list.querySelectorAll('.list-item-text');
            const listItemLinks = list.querySelectorAll('.list-item-link');
            const listItemDates = list.querySelectorAll('.list-item-date');
            listItemTexts.forEach(span => {
                Object.assign(span.style, theme.styles.listItemText);
            });
            listItemLinks.forEach(span => {
                Object.assign(span.style, theme.styles.listItemLink);
            });
            listItemDates.forEach(span => {
                Object.assign(span.style, theme.styles.listItemDate);
            });
        }

        saveSelectedTheme(themeName);
    }

    // Функция для обновления селектора тем
    function updateThemeSelector() {
        themeSelect.innerHTML = ''; // Очищаем текущие опции
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.name;
            option.innerText = theme.displayName;
            if (theme.name === selectedThemeName) {
                option.selected = true;
            }
            themeSelect.appendChild(option);
        });
    }

    // Инициализация интерфейса выбора тем
    const themeSelectorContainer = document.createElement('div');
    themeSelectorContainer.style.position = 'relative';
    themeSelectorContainer.style.bottom = '100px';
    themeSelectorContainer.style.width = '126px';
    themeSelectorContainer.style.left = '0px';
    themeSelectorContainer.style.zIndex = '10001';

    const themeSelect = document.createElement('select');
    themeSelect.style.padding = '5px';
    themeSelect.style.height = '35px';
    themeSelect.style.width = '126px';
    themeSelect.style.borderRadius = '4px';
    themeSelect.style.background = ' #192427';
    themeSelect.style.color = ' #b69dcf';
    themeSelect.style.border = '1px solid #b69dcf';

    themeSelect.onchange = () => {
        const selectedTheme = themeSelect.value;
        applyTheme(selectedTheme);
    };

    themeSelectorContainer.appendChild(themeSelect);
    controlPanel.appendChild(themeSelectorContainer);

    // Загружаем темы с GitHub и инициализируем интерфейс
    loadThemesFromGitHub()
        .then(() => {
            updateThemeSelector();
            applyTheme(selectedThemeName);
        })
        .catch(() => {
            console.warn('[7BTV Control Emotes Panel] Не удалось загрузить темы с GitHub, использую кэшированные или резервные');
            updateThemeSelector();
            applyTheme(selectedThemeName);
        });


// Запускаем watchdog
startWatchdog();
})();

})()})();