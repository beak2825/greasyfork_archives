// ==UserScript==
// @name         Telegram Scraper (Menu Commands v2.3.3 - Human-like Defaults)
// @name:ru      Telegram Scraper (Команды меню v2.3.3 - Человекоподобные значения по умолчанию)
// @namespace    http://tampermonkey.net/
// @version      2.3.3
// @description  Scrapes Telegram, sends to n8n. GUI, auto-start, random channels, more human-like default timings.
// @description:ru Собирает сообщения из Telegram, отправляет в n8n. GUI, автозапуск, случайные каналы, более человекоподобные тайминги по умолчанию.
// @author       Igor Lebedev (Adapted by Gemini Pro)
// @license      MIT
// @homepageURL  https://github.com/LebedevIV/telegram-web-scraper
// @supportURL   https://github.com/LebedevIV/telegram-web-scraper/issues
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/z/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538176/Telegram%20Scraper%20%28Menu%20Commands%20v233%20-%20Human-like%20Defaults%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538176/Telegram%20Scraper%20%28Menu%20Commands%20v233%20-%20Human-like%20Defaults%29.meta.js
// ==/UserScript==

/*
    ENGLISH COMMENTS:
    This script scrapes messages from Telegram channels and sends them to an n8n webhook.
    Key Features:
    - Single/Multi-channel scraping.
    - GM_config GUI for settings with more human-like default timings.
    - Message age limit.
    - Channel navigation.
    - Randomized delays.
    - Tampermonkey menu commands.
    - Scheduled auto-start for multi-channel scraping.
    - Option to randomize channel scraping order.

    РУССКИЕ КОММЕНТАРИИ:
    Этот скрипт собирает сообщения из Telegram-каналов и отправляет их на веб-хук n8n.
    Ключевые особенности:
    - Сбор данных с одного/нескольких каналов.
    - GUI настроек через GM_config с более человекоподобными таймингами по умолчанию.
    - Ограничение по возрасту сообщений.
    - Навигация по каналам.
    - Рандомизированные задержки.
    - Команды управления через меню Tampermonkey.
    - Автоматический запуск сбора со всех каналов по расписанию.
    - Опция случайного порядка сбора каналов.
*/

(function() {
    'use strict';

    // --- GLOBAL SCRIPT VARIABLES (NOT SETTINGS) ---
    let isScrapingSingle = false;
    let isMultiChannelScrapingActive = false;
    let currentChannelIndex = 0;
    let currentScrapingChannelInfo = null;
    let consecutiveScrollsWithoutNewFound = 0;
    let autoStartCheckInterval = null;
    const LAST_AUTO_SCRAPE_DATE_KEY = 'TeleScraper_lastAutoScrapeDate';

    // --- SCRIPT CONSTANTS ---
    const TARGET_CHANNELS_DATA_ORIGINAL = [
        { name: '@e1_news', id: '-1049795479' }, { name: '@RU66RU', id: '-1278627542' },
        { name: '@ekb4tv', id: '-1184077858' }, { name: '@rentv_news', id: '-1310155678' },
        { name: '@TauNewsEkb', id: '-1424016223' }, { name: '@BEZUMEKB', id: '-1739473739' },
        { name: '@zhest_dtp66', id: '-2454557093' }, { name: '@sverdlovskaya_oblasti', id: '-1673288653' },
        { name: '@novosti_ekb66', id: '-1662411694' }
    ];
    let currentTargetChannels = [...TARGET_CHANNELS_DATA_ORIGINAL];
    const SETTINGS_REQUIRING_RELOAD = ['N8N_WEBHOOK_URL'];

    function consoleLog(message, isError = false) {
        const prefix = "[TeleScraper]";
        if (isError) { console.error(`${prefix} ${message}`); }
        else { console.log(`${prefix} ${message}`); }
    }
    function updateStatusForConsole(message, isError = false) {
        consoleLog(message, isError);
    }
    consoleLog(`v${GM_info.script.version} Script execution started.`);

    const GM_CONFIG_ID = `TeleScraperConfig_v${GM_info.script.version.replace(/\./g, '_')}`; // на время разработки настройки сбрасываются от версии к версии до дефолтных
    // const GM_CONFIG_ID = 'TeleScraperUserSettings'; // Любое уникальное статическое имя // При достижении стабильных версий настройки можно будет сохранять

    let configFields = {
        'N8N_WEBHOOK_URL': {
            'label': 'N8N Webhook URL:',
            'type': 'text',
            'default': 'http://localhost:5678/webhook/telegram-scraped-news',
            'section': ['Main Settings / Основные настройки'],
        },
        'MAX_MESSAGE_AGE_HOURS': {
            'label': 'Max message age (hours):',
            'type': 'int',
            'default': 24,
            'min': 1, 'max': 720
        },
        'BASE_SCRAPE_INTERVAL_MS': {
            'label': 'Base scrape interval (ms) (scroll up frequency):',
            'type': 'int',
            'default': 45000, // Increased default / Увеличено значение по умолчанию
            'min': 15000,     // Recommended minimum / Рекомендуемый минимум
            'title': 'Main pause between processing message chunks. Recommended min: 15000ms. / Основная пауза между обработкой порций сообщений. Рекомендуемый мин: 15000мс.'
        },
        'BASE_SCROLL_PAUSE_MS': {
            'label': 'Pause after scroll action (ms):',
            'type': 'int',
            'default': 7000,  // Increased default / Увеличено значение по умолчанию
            'min': 3000,      // Recommended minimum / Рекомендуемый минимум
            'title': 'Pause after each scroll. Recommended min: 3000ms. / Пауза после каждой прокрутки. Рекомендуемый мин: 3000мс.'
        },
        'BASE_SEND_DELAY_MS': {
            'label': 'Delay before sending each message to n8n (ms):',
            'type': 'int',
            'default': 1500,  // Increased default / Увеличено значение по умолчанию
            'min': 500,       // Recommended minimum / Рекомендуемый минимум
            'title': 'Pause between sending individual messages. Recommended min: 500ms. / Пауза между отправкой отдельных сообщений. Рекомендуемый мин: 500мс.'
        },
        'CONSECUTIVE_SCROLLS_LIMIT': {
            'label': 'Empty scrolls limit (stops channel if no new messages found after N scrolls):',
            'type': 'int',
            'default': 5,
            'min': 2 // At least 2 to be sure / Минимум 2 для уверенности
        },
        // Auto Start Section
        'AUTO_START_ENABLED': {
            'label': 'Enable Automatic Scraping (All Channels) [reloading the page is required / требуется перезагрузка страницы]:',
            'type': 'checkbox', 'default': false,
            'section': ['Automatic Start / Автоматический запуск'],
            'title': 'If checked, the script will attempt to run "Scrape All Listed Channels" daily at the specified time, if the Telegram Web tab is open. / Если отмечено, скрипт попытается запустить "Собрать со всех каналов" ежедневно в указанное время, если вкладка Telegram Web открыта.'
        },
        'AUTO_START_TIME': {
            'label': 'Scheduled Start Time (HH:MM, 24-hour local time):',
            'type': 'text', 'default': '10:00', 'size': 5,
            'title': 'Example: 09:30 for 9:30 AM, 22:15 for 10:15 PM'
        },
        // Fine-tuning Section
        'RANDOMIZE_CHANNEL_ORDER': {
            'label': 'Randomize channel order for multi-scrape:',
            'type': 'checkbox', 'default': true,
            'section': ['Fine-tuning (pauses and attempts) / Тонкие настройки (паузы и попытки)'],
            'title': 'If checked, the order of channels from TARGET_CHANNELS_DATA will be shuffled before each multi-channel scrape. / Если отмечено, порядок каналов из TARGET_CHANNELS_DATA будет перемешан перед каждым многоканальным сбором.'
        },
        'NAVIGATION_INITIATION_PAUSE_MS': {
            'label': 'Pause after navigation hash change (ms):',
            'type': 'int', 'default': 4000, 'min': 2000, // Increased default & min / Увеличены значения по умолчанию и минимум
            'title': 'Recommended min: 2000ms. / Рекомендуемый мин: 2000мс.'
        },
        'CHANNEL_ACTIVATION_ATTEMPT_PAUSE_MS': {
            'label': 'Pause between channel activation attempts (ms):',
            'type': 'int', 'default': 1000, 'min': 500, // Increased default & min / Увеличены значения по умолчанию и минимум
            'title': 'Recommended min: 500ms. / Рекомендуемый мин: 500мс.'
        },
        'MAX_CHANNEL_ACTIVATION_ATTEMPTS': { 'label': 'Max channel activation attempts:', 'type': 'int', 'default': 25, 'min': 1 },
        'BASE_SCROLL_ACTION_PAUSE_MS': {
            'label': 'Short pause before/after scroll action (ms):',
            'type': 'int', 'default': 800, 'min': 200, // Increased default & min / Увеличены значения по умолчанию и минимум
            'title': 'Recommended min: 200ms. / Рекомендуемый мин: 200мс.'
        },
        'BASE_SCROLL_BOTTOM_PROG_PAUSE_MS': {
            'label': 'Pause during programmatic scroll to bottom (ms):',
            'type': 'int', 'default': 1200, 'min': 500, // Increased default & min / Увеличены значения по умолчанию и минимум
            'title': 'Recommended min: 500ms. / Рекомендуемый мин: 500мс.'
        },
        'BASE_SCROLL_BOTTOM_CLICK_PAUSE_MS': {
            'label': 'Pause after "scroll to bottom" button click (ms):',
            'type': 'int', 'default': 3000, 'min': 1500, // Increased default & min / Увеличены значения по умолчанию и минимум
            'title': 'Recommended min: 1500ms. / Рекомендуемый мин: 1500мс.'
        },
        'SCROLL_BOTTOM_PROGRAMMATIC_ITERATIONS': { 'label': 'Programmatic scroll to bottom iterations:', 'type': 'int', 'default': 3, 'min': 1 },
        'MAX_GO_TO_BOTTOM_CLICKS': { 'label': 'Max clicks on "scroll to bottom" button (with badge):', 'type': 'int', 'default': 3, 'min': 0 },
        'RANDOMNESS_FACTOR_MAJOR': {
            'label': 'Randomness factor for major pauses (0.0-1.0):',
            'type': 'float', 'default': 0.4, 'min': 0, 'max': 1, // Increased default / Увеличено значение по умолчанию
            'title': 'Adds variability. 0.3 means +/-15%. Higher values = more random. / Добавляет вариативности. 0.3 означает +/-15%. Большие значения = больше случайности.'
        },
        'RANDOMNESS_FACTOR_MINOR': {
            'label': 'Randomness factor for minor pauses (0.0-1.0):',
            'type': 'float', 'default': 0.25, 'min': 0, 'max': 1, // Increased default / Увеличено значение по умолчанию
            'title': 'Adds variability. 0.15 means +/-7.5%. Higher values = more random. / Добавляет вариативности. 0.15 означает +/-7.5%. Большие значения = больше случайности.'
        },
        'USE_FOCUS_IN_SCROLL_UP': { 'label': 'Use focus() during scroll up (experimental):', 'type': 'checkbox', 'default': false }
    };

    for (const key in configFields) {
        if (configFields.hasOwnProperty(key)) {
            let labelSuffix = ` (по умолчанию: ${configFields[key].default})`;
            if (SETTINGS_REQUIRING_RELOAD.includes(key)) {
                labelSuffix += ' [требуется перезагрузка / reload required]';
            }
            // Add min recommendation to label if not already in title
            // Добавление рекомендации по минимуму в метку, если ее еще нет в title
            if (configFields[key].min && !configFields[key].title?.includes('Recommended min') && !configFields[key].title?.includes('Рекомендуемый мин')) {
                 labelSuffix += ` (рек. мин: ${configFields[key].min})`;
            }
            configFields[key].label += labelSuffix;
        }
    }

    const configEventHandlers = { /* ... (CSS and other handlers - no changes from v2.3.2) ... */
        'open': function(doc) {
            const urlFieldInputId = `${GM_CONFIG_ID}_field_N8N_WEBHOOK_URL`;
            const style = doc.createElement('style');
            style.textContent = `
                #${GM_CONFIG_ID}_wrapper { font-family: Arial, sans-serif; }
                #${GM_CONFIG_ID}_header { background-color: #4a4a4a; color: white; padding: 10px; font-size: 1.2em; margin-bottom: 10px; }
                .section_header { background-color: #f0f0f0; padding: 8px; margin-top: 15px; margin-bottom: 5px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; font-weight: bold; color: #333; }
                .config_var { margin: 10px 15px; padding: 8px 0; border-bottom: 1px solid #eee; display: flex; flex-direction: column; }
                .config_var label { display: block; margin-bottom: 5px; color: #555; font-size: 0.9em; font-weight: normal; text-align: left; }
                .config_var input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; margin-left: 0; width: 280px; max-width: 100%; }
                #${urlFieldInputId} { width: 100% !important; min-width: 450px !important; }
                .config_var input[type="checkbox"] { width: auto !important; margin-right: auto; align-self: flex-start; }
                #${GM_CONFIG_ID}_buttons_holder { padding: 15px; text-align: right; border-top: 1px solid #ddd; background-color: #f9f9f9; }
                #${GM_CONFIG_ID}_saveBtn, #${GM_CONFIG_ID}_resetBtn, #${GM_CONFIG_ID}_closeBtn { padding: 8px 15px; margin-left: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
                #${GM_CONFIG_ID}_saveBtn { background-color: #4CAF50; color: white; }
                #${GM_CONFIG_ID}_resetBtn { background-color: #f44336; color: white; }
                #${GM_CONFIG_ID}_closeBtn { background-color: #bbb; color: black; }
            `;
            doc.head.appendChild(style);
            const firstInput = doc.querySelector('input[type="text"], input[type="number"], input[type="checkbox"]');
            if (firstInput) { firstInput.focus(); }
        },
        'save': function() {
            consoleLog("Настройки сохранены.");
            alert("Настройки сохранены! Некоторые изменения (URL, автозапуск) могут потребовать перезагрузки или вступят в силу при следующей проверке.");
            setupAutoStart();
        },
        'reset': function() {
            consoleLog("Настройки сброшены.");
            alert("Настройки сброшены! Перезагрузите страницу.");
            setupAutoStart();
        }
    };

    let gmConfigInitialized = false;
    try { /* ... (GM_config.init - no changes from v2.3.2) ... */
        if (typeof GM_config !== 'undefined' && typeof GM_info !== 'undefined') {
            GM_config.init({
                'id': GM_CONFIG_ID, 'title': `Настройки Telegram Scraper v${GM_info.script.version}`,
                'fields': configFields, 'events': configEventHandlers,
                'frameStyle': { width: '1000px', height: '75vh', minHeight: '500px', border: '1px solid rgb(0, 0, 0)', margin: '0px', maxHeight: '95%', maxWidth: '95%', opacity: '1', overflow: 'auto', padding: '0px', position: 'fixed', zIndex: '9999' }
            });
            gmConfigInitialized = true;
            consoleLog("GM_config инициализирован.");
        } else {
            if (typeof GM_config === 'undefined') consoleLog("GM_config не определен.", true);
            if (typeof GM_info === 'undefined') consoleLog("GM_info не определен.", true);
        }
    } catch (e) {
        consoleLog("Ошибка инициализации GM_config: " + e, true);
        alert("Ошибка инициализации GM_config.");
    }

    function getConfigValue(key, defaultValue) { /* ... (no changes from v2.3.2) ... */
        if (gmConfigInitialized && typeof GM_config.get === 'function' && (typeof GM_config.isInit === 'undefined' || GM_config.isInit) ) {
            try {
                const val = GM_config.get(key);
                return typeof val !== 'undefined' ? val : defaultValue;
            } catch (e) {
                consoleLog(`Ошибка при вызове GM_config.get('${key}'): ${e}. Используется значение по умолчанию.`, true);
                const field = configFields[key];
                return field && typeof field.default !== 'undefined' ? field.default : defaultValue;
            }
        }
        const field = configFields[key];
        return field && typeof field.default !== 'undefined' ? field.default : defaultValue;
    }
    function getRandomizedInterval(baseInterval, randomnessFactorKey = 'RANDOMNESS_FACTOR_MAJOR') { /* ... (no changes from v2.3.2) ... */
        const defaultFactor = configFields[randomnessFactorKey] ? configFields[randomnessFactorKey].default : 0.3; // This default is for the factor itself if key is missing
        const factor = getConfigValue(randomnessFactorKey, defaultFactor); // getConfigValue will use its own default from configFields if key exists
        const delta = baseInterval * factor * (Math.random() - 0.5) * 2;
        return Math.max(50, Math.round(baseInterval + delta));
    }

    async function checkAndRunAutoScrape() { /* ... (no changes from v2.3.2) ... */
        if (!gmConfigInitialized || (typeof GM_config !== 'undefined' && typeof GM_config.isInit !== 'undefined' && !GM_config.isInit) ) {
            consoleLog("[AutoStart] GM_config еще не готов для проверки автозапуска.");
            return;
        }
        if (!getConfigValue('AUTO_START_ENABLED', false)) { return; }
        if (isScrapingSingle || isMultiChannelScrapingActive) { return; }
        const scheduledTimeStr = getConfigValue('AUTO_START_TIME', '10:00');
        const parts = scheduledTimeStr.split(':');
        if (parts.length !== 2) { consoleLog(`[AutoStart] Неверный формат времени: ${scheduledTimeStr}.`, true); return; }
        const scheduledHour = parseInt(parts[0], 10);
        const scheduledMinute = parseInt(parts[1], 10);
        if (isNaN(scheduledHour) || isNaN(scheduledMinute) || scheduledHour < 0 || scheduledHour > 23 || scheduledMinute < 0 || scheduledMinute > 59) {
            consoleLog(`[AutoStart] Неверные значения времени: ${scheduledTimeStr}.`, true); return;
        }
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const lastRunDate = GM_getValue(LAST_AUTO_SCRAPE_DATE_KEY, null);
        if (lastRunDate === todayStr) { return; }
        if (now.getHours() === scheduledHour && now.getMinutes() === scheduledMinute) {
            consoleLog(`[AutoStart] Наступило время для автоматического запуска (${scheduledTimeStr})!`);
            updateStatusForConsole(`Автозапуск в ${scheduledTimeStr}...`);
            GM_setValue(LAST_AUTO_SCRAPE_DATE_KEY, todayStr);
            await startMultiChannelScrapeMenu(true);
        }
    }
    function setupAutoStart() { /* ... (no changes from v2.3.2) ... */
        if (autoStartCheckInterval) { clearInterval(autoStartCheckInterval); autoStartCheckInterval = null; }
        if (getConfigValue('AUTO_START_ENABLED', false)) {
            consoleLog("[AutoStart] Автозапуск включен. Проверка времени каждую минуту.");
            checkAndRunAutoScrape();
            autoStartCheckInterval = setInterval(checkAndRunAutoScrape, 60000);
        } else {
            consoleLog("[AutoStart] Автозапуск выключен.");
        }
    }

    // --- CORE SCRAPING FUNCTIONS ---
    // (isTargetChannelActive, parseTimestampFromBubble, extractDataFromMessageElement, sendToN8N, processCurrentMessages, tryScrollUp, scrollToBottom, scrapingLoopSingleChannel, scrapeSingleChannelProcess)
    // Definitions are the same as in v2.3.2
    function isTargetChannelActive() {
        if (!currentScrapingChannelInfo || !currentScrapingChannelInfo.id) { return false; }
        const chatInfoContainer = document.querySelector('#column-center .chat.active .sidebar-header .chat-info');
        if (!chatInfoContainer) { return false; }
        const avatarElement = chatInfoContainer.querySelector('.avatar[data-peer-id]');
        if (avatarElement && avatarElement.dataset && avatarElement.dataset.peerId) {
            const displayedPeerId = avatarElement.dataset.peerId;
            if (displayedPeerId === currentScrapingChannelInfo.id) {
                consoleLog(`[isTargetActive] Channel "${currentScrapingChannelInfo.name}" (ID: ${currentScrapingChannelInfo.id}) IS ACTIVE.`);
                return true;
            }
        }
        return false;
    }
    function parseTimestampFromBubble(bubbleElement) {
        if (bubbleElement && bubbleElement.dataset && bubbleElement.dataset.timestamp) {
            return parseInt(bubbleElement.dataset.timestamp, 10) * 1000;
        }
        return null;
    }
    function extractDataFromMessageElement(messageElement) {
        const channelNameForSource = currentScrapingChannelInfo ? currentScrapingChannelInfo.name : 'unknown_channel';
        const data = {
            title: '', text: '', link: null, pubDate: null,
            source: `t.me/${channelNameForSource.replace('@','')}`,
            messageId: null, rawHtmlContent: messageElement.innerHTML
        };
        const parentBubble = messageElement.closest('.bubble.channel-post');
        if (!parentBubble) { consoleLog(`[Extractor] Parent bubble not found: ${messageElement.textContent.substring(0,50)}...`, true); return null; }
        data.messageId = parentBubble.dataset.mid;
        if (!data.messageId) { consoleLog(`[Extractor] Message ID not found: ${parentBubble.outerHTML.substring(0,100)}...`, true); return null; }
        const timestamp = parseTimestampFromBubble(parentBubble);
        if (!timestamp) { consoleLog(`[Extractor] Timestamp not parsed for ID ${data.messageId} in ${channelNameForSource}`, true); return null; }
        data.pubDate = new Date(timestamp).toISOString();
        const oldestAllowedDate = new Date();
        oldestAllowedDate.setHours(oldestAllowedDate.getHours() - getConfigValue('MAX_MESSAGE_AGE_HOURS', 24));
        if (new Date(timestamp) < oldestAllowedDate) {
            consoleLog(`[Extractor] Msg ID ${data.messageId} (PubDate: ${data.pubDate}) in ${channelNameForSource} OLDER than ${getConfigValue('MAX_MESSAGE_AGE_HOURS', 24)} hours. STOP_SCROLLING.`);
            return 'STOP_SCROLLING';
        }
        const strongElements = Array.from(messageElement.querySelectorAll('strong'));
        if (strongElements.length > 0) {
            const firstStrong = strongElements.find(s => {
                const anchor = s.closest('a');
                return !anchor || !(anchor.href.includes(`/${channelNameForSource.replace('@','')}`) || anchor.href.includes(`/${channelNameForSource}`));
            });
            if (firstStrong) data.title = firstStrong.innerText.trim();
        }
        let fullText = '';
        const channelNamePartForLinkComparison = channelNameForSource.replace('@','');
        messageElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) { fullText += node.textContent; }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'A' && node.classList.contains('anchor-url')) {
                    fullText += node.innerText;
                    if (!data.link && node.href && node.target === '_blank' && !node.href.startsWith('https://t.me/')) data.link = node.href;
                }
                else if (node.tagName !== 'STRONG' || (data.title && !node.innerText.trim().startsWith(data.title) && !data.title.includes(node.innerText.trim()))) {
                    const isCustomEmoji = node.matches && (node.matches('img.custom-emoji') || node.matches('custom-emoji-element') || node.querySelector('img.custom-emoji'));
                    const isSticker = node.matches && (node.matches('.media-sticker-wrapper') || node.matches('tg-sticker'));
                    const isReactions = node.matches && (node.matches('reactions-element') || node.classList.contains('reactions'));
                    let isChannelSignatureLink = false;
                    if (node.tagName === 'A' && node.href) {
                        const hrefLower = node.href.toLowerCase();
                        if (hrefLower.includes(`t.me/${channelNamePartForLinkComparison.toLowerCase()}`) || hrefLower.includes(`/${channelNamePartForLinkComparison.toLowerCase()}`)) {
                            if (node.innerText.toLowerCase().includes(channelNamePartForLinkComparison.toLowerCase())) isChannelSignatureLink = true;
                        }
                    }
                    if (!isChannelSignatureLink && node.querySelector(`a[href*="/${channelNamePartForLinkComparison}"]`)) {
                        const nestedLink = node.querySelector(`a[href*="/${channelNamePartForLinkComparison}"]`);
                        if (nestedLink.innerText.toLowerCase().includes(channelNamePartForLinkComparison.toLowerCase())) isChannelSignatureLink = true;
                    }
                    if (!isCustomEmoji && !isSticker && !isReactions && !isChannelSignatureLink) fullText += node.innerText || node.textContent;
                }
            }
        });
        data.text = fullText.replace(/\s+/g, ' ').trim();
        if (!data.title && data.text) data.title = data.text.substring(0, 120) + (data.text.length > 120 ? '...' : '');
        if (data.title && data.text.toLowerCase().startsWith(data.title.toLowerCase())) data.text = data.text.substring(data.title.length).trim();
        return data;
    }
    function sendToN8N(payload) {
        const n8nWebhookUrl = getConfigValue('N8N_WEBHOOK_URL', '');
        if (!n8nWebhookUrl) { updateStatusForConsole('N8N URL не настроен!', true); return; }
        const channelName = currentScrapingChannelInfo ? currentScrapingChannelInfo.name : 'N/A';
        const channelId = currentScrapingChannelInfo ? currentScrapingChannelInfo.id : 'N/A';
        updateStatusForConsole(`Отправка ID ${payload.messageId} (Канал: ${channelName} [${channelId}], Date: ${payload.pubDate})...`);
        GM_xmlhttpRequest({
            method: "POST", url: n8nWebhookUrl, data: JSON.stringify(payload), headers: { "Content-Type": "application/json" },
            onload: function(response) { updateStatusForConsole(`n8n ответ для ID ${payload.messageId}: ${response.status}`); consoleLog(`[Sender] N8N Response for ID ${payload.messageId}: ${response.status} ${response.responseText.substring(0,100)}`); },
            onerror: function(response) { updateStatusForConsole(`n8n ошибка для ID ${payload.messageId}: ${response.status}`, true); consoleLog(`[Sender] N8N Error for ID ${payload.messageId}: ${response.status} ${response.responseText.substring(0,100)}`, true); }
        });
    }
    async function processCurrentMessages() {
        if (!isScrapingSingle && !isMultiChannelScrapingActive) return { foundNew: false, stopScrolling: false };
        if (!currentScrapingChannelInfo) { consoleLog("processCurrentMessages: currentScrapingChannelInfo is not set.", true); return { foundNew: false, stopScrolling: true, error: "Канал не установлен" };}
        if (!isTargetChannelActive()) { updateStatusForConsole(`Канал ${currentScrapingChannelInfo.name} не активен (process).`, true); return { foundNew: false, stopScrolling: true, error: `Канал ${currentScrapingChannelInfo.name} не активен` }; }
        updateStatusForConsole(`Поиск в ${currentScrapingChannelInfo.name}...`);
        const messageElements = document.querySelectorAll('.bubble.channel-post .message span.translatable-message, .bubble.channel-post .text-content');
        let foundNew = false; let stopDueToAge = false;
        for (let i = messageElements.length - 1; i >= 0; i--) {
            if (!isScrapingSingle && !isMultiChannelScrapingActive) break;
            const el = messageElements[i]; const parentBubble = el.closest('.bubble.channel-post'); const msgId = parentBubble ? parentBubble.dataset.mid : null;
            if (msgId) {
                const articleData = extractDataFromMessageElement(el);
                if (articleData === 'STOP_SCROLLING') { stopDueToAge = true; const ts = parentBubble?.dataset.timestamp ? new Date(parseInt(parentBubble.dataset.timestamp,10)*1000).toISOString() : 'N/A'; updateStatusForConsole(`Старые сообщения (ID: ${msgId}, Date: ${ts}). Стоп.`); break; }
                if (articleData && articleData.title && (articleData.text || articleData.link)) {
                    consoleLog(`[Proc] ID ${msgId} (${articleData.pubDate.substring(11,19)}) к отправке.`); sendToN8N(articleData); foundNew = true;
                    await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SEND_DELAY_MS', 1000), 'RANDOMNESS_FACTOR_MINOR')));
                } else if (articleData) { consoleLog(`[Proc] ID ${msgId} пропущено (нет данных).`); }
                else { consoleLog(`[Proc] ID ${msgId} ошибка извлечения.`, true); }
            }
        }
        return { foundNew, stopScrolling: stopDueToAge };
    }
    async function tryScrollUp() {
        if (!isScrapingSingle && !isMultiChannelScrapingActive) return;
        await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_ACTION_PAUSE_MS', 300), 'RANDOMNESS_FACTOR_MINOR')));
        updateStatusForConsole('Скролл вверх...');
        const messageBubbles = document.querySelectorAll('.bubbles-inner .bubble.channel-post');
        if (messageBubbles.length > 0) {
            const topBubble = messageBubbles[0]; if (typeof topBubble.tabIndex === 'undefined' || topBubble.tabIndex === -1) topBubble.tabIndex = -1;
            try {
                consoleLog(`Скролл к верхнему ID: ${topBubble.dataset.mid} (scrollIntoView)`); topBubble.scrollIntoView({ behavior: 'auto', block: 'start' });
                await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_ACTION_PAUSE_MS', 300), 'RANDOMNESS_FACTOR_MINOR')));
                if (getConfigValue('USE_FOCUS_IN_SCROLL_UP', false)) { consoleLog(`Фокус на верхний ID: ${topBubble.dataset.mid}`); topBubble.focus({ preventScroll: true }); }
                await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_PAUSE_MS', 5000))));
            } catch (e) {
                consoleLog(`Ошибка scrollIntoView/focus: ${e.message}`, true); updateStatusForConsole('Ошибка скролла вверх. Стандартный метод...', true);
                const scrollArea = document.querySelector('div.bubbles-inner')?.parentElement || document.querySelector('.scrollable-y.chat-history-list') || document.querySelector('.bubbles > .scrollable-y');
                if (scrollArea) { scrollArea.scrollTop = 0; scrollArea.dispatchEvent(new WheelEvent('wheel', { deltaY: -1000, bubbles: true, cancelable: true })); await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_PAUSE_MS', 5000))));}
            }
        } else {
            updateStatusForConsole('Нет сообщений для скролла вверх. Стандартный метод.');
            const scrollArea = document.querySelector('div.bubbles-inner')?.parentElement || document.querySelector('.scrollable-y.chat-history-list') || document.querySelector('.bubbles > .scrollable-y');
            if (scrollArea) { scrollArea.scrollTop = 0; scrollArea.dispatchEvent(new WheelEvent('wheel', { deltaY: -1000, bubbles: true, cancelable: true })); await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_PAUSE_MS', 5000))));}
            else { updateStatusForConsole('Нет области скролла и нет сообщений.', true); }
        }
    }
    async function scrollToBottom() {
        updateStatusForConsole('Прокрутка к последним сообщениям...');
        const scrollableArea = document.querySelector('div.bubbles-inner')?.parentElement || document.querySelector('.scrollable-y.chat-history-list') || document.querySelector('.bubbles > .scrollable-y');
        if (!scrollableArea) { updateStatusForConsole('Ошибка: Не найдена область для прокрутки вниз.', true); return false; }
        let goToBottomButton; let clicksMade = 0; const maxClicks = getConfigValue('MAX_GO_TO_BOTTOM_CLICKS', 3);
        await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_ACTION_PAUSE_MS', 300), 'RANDOMNESS_FACTOR_MINOR')));
        while (clicksMade < maxClicks) {
            if (!isScrapingSingle && !isMultiChannelScrapingActive && clicksMade > 0) { updateStatusForConsole('Прокрутка вниз прервана.'); return false; }
            goToBottomButton = document.querySelector('.bubbles-go-down.chat-secondary-button:not(.is-hidden):not([style*="display: none"])');
            const badge = goToBottomButton ? goToBottomButton.querySelector('.badge:not(.is-badge-empty)') : null;
            if (goToBottomButton && badge && typeof goToBottomButton.click === 'function') {
                const unreadCountText = badge.textContent; updateStatusForConsole(`Клик по кнопке "вниз" (${unreadCountText || 'несколько'} непрочитанных)...`);
                consoleLog(`[ScrollToBottom] Clicking "go to bottom" button (unread: ${unreadCountText}). Click ${clicksMade + 1}`);
                goToBottomButton.click(); clicksMade++;
                await new Promise(resolve => setTimeout(resolve, getRandomizedInterval(getConfigValue('BASE_SCROLL_BOTTOM_CLICK_PAUSE_MS', 2500))));
            } else { consoleLog('[ScrollToBottom] "Go to bottom" button with counter not found or empty.'); break; }
        }
        updateStatusForConsole('Программная прокрутка вниз...'); let prevScrollHeight = 0; const scrollIterations = getConfigValue('SCROLL_BOTTOM_PROGRAMMATIC_ITERATIONS', 3);
        for (let i = 0; i < scrollIterations; i++) {
            if (!isScrapingSingle && !isMultiChannelScrapingActive) { updateStatusForConsole('Прокрутка вниз прервана.'); return false; }
            prevScrollHeight = scrollableArea.scrollHeight; scrollableArea.scrollTop = scrollableArea.scrollHeight;
            updateStatusForConsole(`Прокрутка вниз... (итерация ${i + 1}/${scrollIterations})`);
            await new Promise(resolve => setTimeout(resolve, getRandomizedInterval(getConfigValue('BASE_SCROLL_BOTTOM_PROG_PAUSE_MS', 700), 'RANDOMNESS_FACTOR_MINOR')));
            if (i > 0 && scrollableArea.scrollHeight - prevScrollHeight < 50) { consoleLog('[ScrollToBottom] Scroll height changed minimally.'); break; }
        }
        const lastMessageGroup = document.querySelector('.bubbles-inner .bubbles-group-last');
        if (lastMessageGroup) {
            consoleLog('[ScrollToBottom] Found .bubbles-group-last, scrolling to it.'); updateStatusForConsole('Точная прокрутка к последней группе...');
            lastMessageGroup.scrollIntoView({ behavior: 'auto', block: 'end' });
            await new Promise(resolve => setTimeout(resolve, getRandomizedInterval(getConfigValue('BASE_SCROLL_BOTTOM_PROG_PAUSE_MS', 700) / 2, 'RANDOMNESS_FACTOR_MINOR')));
        } else { consoleLog('[ScrollToBottom] .bubbles-group-last not found.'); }
        goToBottomButton = document.querySelector('.bubbles-go-down.chat-secondary-button:not(.is-hidden):not([style*="display: none"])');
        if (goToBottomButton && typeof goToBottomButton.click === 'function' && clicksMade < maxClicks) {
            const finalBadge = goToBottomButton.querySelector('.badge:not(.is-badge-empty)');
            if (!finalBadge) { consoleLog('[ScrollToBottom] "Go to bottom" button (no counter) is active, final click.'); updateStatusForConsole('Финальный клик по кнопке "вниз"...'); goToBottomButton.click(); await new Promise(resolve => setTimeout(resolve, getRandomizedInterval(getConfigValue('BASE_SCROLL_BOTTOM_CLICK_PAUSE_MS', 2500) / 2))); }
        }
        updateStatusForConsole('Прокрутка к последним сообщениям завершена.'); return true;
    }
    async function scrapingLoopSingleChannel() {
        if (!isScrapingSingle) { consoleLog(`[Loop-${currentScrapingChannelInfo.name}] Остановлен (isScrapingSingle=false).`); return; }
        if (isMultiChannelScrapingActive && !isScrapingSingle) { consoleLog(`[Loop-${currentScrapingChannelInfo.name}] Остановлен (multi active, single false).`); return; }
        await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('BASE_SCROLL_ACTION_PAUSE_MS', 300), 'RANDOMNESS_FACTOR_MINOR')));
        const { foundNew, stopScrolling, error } = await processCurrentMessages();
        if (error) { updateStatusForConsole(error + `. Прерываю для ${currentScrapingChannelInfo.name}.`, true); return; }
        if (stopScrolling) { updateStatusForConsole(`Лимит по дате для ${currentScrapingChannelInfo.name}. Завершаю.`); return; }
        if (foundNew) { consecutiveScrollsWithoutNewFound = 0; }
        else { consecutiveScrollsWithoutNewFound++; consoleLog(`[Loop-${currentScrapingChannelInfo.name}] Ничего нового. Счетчик: ${consecutiveScrollsWithoutNewFound}`);}
        if (consecutiveScrollsWithoutNewFound >= getConfigValue('CONSECUTIVE_SCROLLS_LIMIT', 5)) {
            updateStatusForConsole(`Нет новых сообщений для ${currentScrapingChannelInfo.name} после ${getConfigValue('CONSECUTIVE_SCROLLS_LIMIT', 5)} прокруток. Завершаю.`); return;
        }
        await tryScrollUp();
        if (isScrapingSingle) {
           const baseNextInterval = !foundNew ? getConfigValue('BASE_SCRAPE_INTERVAL_MS', 30000) : getConfigValue('BASE_SCRAPE_INTERVAL_MS', 30000) / 2;
           await new Promise(r => setTimeout(r, getRandomizedInterval(baseNextInterval)));
           if (isScrapingSingle) await scrapingLoopSingleChannel();
        }
    }
    async function scrapeSingleChannelProcess(channelInfoObject) {
        if (!channelInfoObject || !channelInfoObject.id || !channelInfoObject.name) { consoleLog("Ошибка: Некорректные данные канала в scrapeSingleChannelProcess", true); return false; }
        if (!isScrapingSingle && !isMultiChannelScrapingActive) { consoleLog(`scrapeSingleChannelProcess для ${channelInfoObject.name} не может быть запущен (флаги).`); return false; }
        currentScrapingChannelInfo = channelInfoObject;
        consoleLog(`--- Начало скрапинга канала: ${currentScrapingChannelInfo.name} (ID: ${currentScrapingChannelInfo.id}) ---`);
        updateStatusForConsole(`Скрапинг: ${currentScrapingChannelInfo.name}`);
        const targetHashForNavigation = `#${currentScrapingChannelInfo.name}`;
        let navigationNeeded = true;
        const chatInfoContainerInitial = document.querySelector('#column-center .chat.active .sidebar-header .chat-info');
        let initialDisplayedPeerId = null;
        if (chatInfoContainerInitial) {
            const avatarElementInitial = chatInfoContainerInitial.querySelector('.avatar[data-peer-id]');
            if (avatarElementInitial) { initialDisplayedPeerId = avatarElementInitial.dataset.peerId; }
        }
        if (initialDisplayedPeerId === currentScrapingChannelInfo.id) { consoleLog(`[Nav] Уже на канале ${currentScrapingChannelInfo.name} (peerId совпадает).`); navigationNeeded = false; }
        else if (window.location.hash.toLowerCase() === targetHashForNavigation.toLowerCase() && initialDisplayedPeerId) { consoleLog(`[Nav] URL hash is ${targetHashForNavigation} or peerId (${initialDisplayedPeerId}) present, but expecting ${currentScrapingChannelInfo.id}. Will wait for peerId activation.`); navigationNeeded = false; }
        if (navigationNeeded) {
            consoleLog(`Перехожу на канал ${targetHashForNavigation}...`); window.location.hash = targetHashForNavigation;
            await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('NAVIGATION_INITIATION_PAUSE_MS', 2500), 'RANDOMNESS_FACTOR_MAJOR')));
        }
        let activationAttempts = 0; const maxActivationAttempts = getConfigValue('MAX_CHANNEL_ACTIVATION_ATTEMPTS', 25);
        consoleLog(`Ожидание активации канала ${currentScrapingChannelInfo.name} (ID: ${currentScrapingChannelInfo.id}) по peer-id...`);
        while (activationAttempts < maxActivationAttempts) {
            if (!isScrapingSingle && !isMultiChannelScrapingActive) { consoleLog("Остановка во время ожидания активации канала."); return false; }
            if (isTargetChannelActive()) break;
            activationAttempts++; updateStatusForConsole(`Ожидание ${currentScrapingChannelInfo.name} (${activationAttempts}/${maxActivationAttempts})`);
            await new Promise(r => setTimeout(r, getRandomizedInterval(getConfigValue('CHANNEL_ACTIVATION_ATTEMPT_PAUSE_MS', 700), 'RANDOMNESS_FACTOR_MINOR')));
        }
        if (!isTargetChannelActive()) { updateStatusForConsole(`Не удалось активировать ${currentScrapingChannelInfo.name} (ID: ${currentScrapingChannelInfo.id}) по peer-id. Пропускаю.`, true); return false; }
        consoleLog(`Канал ${currentScrapingChannelInfo.name} активен. Прокрутка вниз.`);
        const scrolledToBottom = await scrollToBottom();
        if (!scrolledToBottom) { if (isScrapingSingle || isMultiChannelScrapingActive) { updateStatusForConsole(`Ошибка прокрутки вниз для ${currentScrapingChannelInfo.name}.`, true); } return false; }
        if (!isScrapingSingle && !isMultiChannelScrapingActive) { consoleLog("Остановка после прокрутки вниз."); return false;}
        updateStatusForConsole(`Скрапинг вверх для ${currentScrapingChannelInfo.name}...`);
        consecutiveScrollsWithoutNewFound = 0; await scrapingLoopSingleChannel();
        consoleLog(`--- Скрапинг канала ${currentScrapingChannelInfo.name} завершен/остановлен ---`); return true;
    }

    // --- MENU COMMAND HANDLERS ---
    function shuffleArray(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

    async function startSingleChannelScrapeMenu() {
        consoleLog("Команда 'Scrape Current Channel' вызвана. / 'Scrape Current Channel' command called.");
        if (isScrapingSingle || isMultiChannelScrapingActive) {
            alert("Скрапинг уже запущен. / Scraping is already running.");
            consoleLog("Скрапинг уже запущен.", true); return;
        }
        let displayedPeerId = null;
        const chatInfoContainer = document.querySelector('#column-center .chat.active .sidebar-header .chat-info');
        if (chatInfoContainer) { const avatarElement = chatInfoContainer.querySelector('.avatar[data-peer-id]'); if (avatarElement && avatarElement.dataset && avatarElement.dataset.peerId) displayedPeerId = avatarElement.dataset.peerId; }
        let channelInfoToScrape = null;
        if (displayedPeerId) {
            channelInfoToScrape = TARGET_CHANNELS_DATA_ORIGINAL.find(ch => ch.id === displayedPeerId);
            if (channelInfoToScrape) consoleLog(`[startSingle] Канал определен по peer-id: ${channelInfoToScrape.name}`);
            else consoleLog(`[startSingle] Peer-id ${displayedPeerId} не найден в TARGET_CHANNELS_DATA.`);
        } else consoleLog(`[startSingle] Не удалось получить peer-id.`);
        if (!channelInfoToScrape) {
            let hash = window.location.hash.substring(1);
            if (hash) {
                const queryParamIndex = hash.indexOf('?'); if (queryParamIndex !== -1) hash = hash.substring(0, queryParamIndex);
                channelInfoToScrape = TARGET_CHANNELS_DATA_ORIGINAL.find(ch => ch.id === hash);
                if (!channelInfoToScrape) { let nameToCompare = hash; if (!hash.startsWith('@') && isNaN(parseInt(hash))) nameToCompare = '@' + hash; channelInfoToScrape = TARGET_CHANNELS_DATA_ORIGINAL.find(ch => ch.name.toLowerCase() === nameToCompare.toLowerCase()); }
                if (channelInfoToScrape) consoleLog(`[startSingle] Канал определен по hash "${hash}": ${channelInfoToScrape.name}`);
                else consoleLog(`[startSingle] Канал не определен по hash "${hash}".`);
            }
        }
        if (!channelInfoToScrape) { alert("Не удалось определить текущий канал."); consoleLog("Не удалось определить текущий канал.", true); return; }
        isScrapingSingle = true; consoleLog(`--- Начало ОДИНОЧНОЙ сессии для ${channelInfoToScrape.name} ---`);
        alert(`Начинаю скрапинг текущего канала: ${channelInfoToScrape.name}.`);
        await scrapeSingleChannelProcess(channelInfoToScrape);
        isScrapingSingle = false;
        if (!isMultiChannelScrapingActive) { updateStatusForConsole("Скрапинг текущего канала завершен."); consoleLog("--- ОДИНОЧНАЯ сессия скрапинга завершена ---"); alert(`Скрапинг канала ${channelInfoToScrape.name} завершен.`); }
        currentScrapingChannelInfo = null;
    }
    async function startMultiChannelScrapeMenu(isAutoStart = false) {
        if (!isAutoStart) {
            consoleLog("Команда 'Scrape All Listed Channels' вызвана. / 'Scrape All Listed Channels' command called.");
            if (isScrapingSingle || isMultiChannelScrapingActive) { alert("Скрапинг уже запущен. / Scraping is already running."); consoleLog("Скрапинг уже запущен.", true); return; }
            if (!confirm(`Начать скрапинг ${TARGET_CHANNELS_DATA_ORIGINAL.length} каналов? / Start scraping ${TARGET_CHANNELS_DATA_ORIGINAL.length} channels?`)) { consoleLog("Мульти-скрапинг отменен. / Multi-scrape cancelled."); return; }
        } else {
            if (isScrapingSingle || isMultiChannelScrapingActive) { consoleLog("[AutoStart] Скрапинг уже запущен, автозапуск пропущен. / Scraping in progress, auto-start skipped."); return; }
            consoleLog("[AutoStart] Запуск мульти-скрапинга по расписанию. / Starting scheduled multi-scrape.");
        }
        isMultiChannelScrapingActive = true; currentChannelIndex = 0;
        if (getConfigValue('RANDOMIZE_CHANNEL_ORDER', true)) { consoleLog("Перемешивание порядка каналов... / Randomizing channel order..."); currentTargetChannels = shuffleArray([...TARGET_CHANNELS_DATA_ORIGINAL]); }
        else { currentTargetChannels = [...TARGET_CHANNELS_DATA_ORIGINAL]; }
        consoleLog("--- Начало МУЛЬТИ-СКРАПИНГА --- / --- Starting MULTI-CHANNEL SCRAPING ---");
        if (!isAutoStart) alert("Начинаю скрапинг всех каналов. / Starting scrape of all channels.");
        while (currentChannelIndex < currentTargetChannels.length && isMultiChannelScrapingActive) {
            isScrapingSingle = true; const channelInfo = currentTargetChannels[currentChannelIndex];
            updateStatusForConsole(`[${currentChannelIndex + 1}/${currentTargetChannels.length}] Запуск для: ${channelInfo.name} / Starting for: ${channelInfo.name}`);
            const success = await scrapeSingleChannelProcess(channelInfo);
            isScrapingSingle = false;
            if (!isMultiChannelScrapingActive) { consoleLog("Мульти-скрапинг остановлен. / Multi-scrape stopped."); break; }
            if (!success) consoleLog(`Проблема со скрапингом канала ${channelInfo.name}, пропускаю. / Problem scraping ${channelInfo.name}, skipping.`, true);
            currentChannelIndex++;
            if (currentChannelIndex < currentTargetChannels.length && isMultiChannelScrapingActive) {
                const pauseDuration = getRandomizedInterval(getConfigValue('BASE_SCROLL_PAUSE_MS', 5000) * 1.5, 'RANDOMNESS_FACTOR_MAJOR');
                updateStatusForConsole(`Пауза ${Math.round(pauseDuration/1000)}с перед ${currentTargetChannels[currentChannelIndex].name} / Pausing ${Math.round(pauseDuration/1000)}s before ${currentTargetChannels[currentChannelIndex].name}`);
                await new Promise(r => setTimeout(r, pauseDuration));
            }
        }
        if (isMultiChannelScrapingActive) {
            updateStatusForConsole("Скрапинг ВСЕХ каналов завершен. / Scraping of ALL channels finished.");
            if (!isAutoStart) alert("Скрапинг всех каналов завершен! / Scraping of all channels finished!");
            else consoleLog("[AutoStart] Автоматический сбор завершен. / Auto-scrape finished.");
        }
        isMultiChannelScrapingActive = false; isScrapingSingle = false; currentScrapingChannelInfo = null;
    }
    function stopAllScrapingActivitiesMenu() {
        consoleLog("Команда 'Stop All Scraping' вызвана. / 'Stop All Scraping' command called.", true);
        isScrapingSingle = false; isMultiChannelScrapingActive = false;
        updateStatusForConsole('Скрапинг остановлен пользователем. / Scraping stopped by user.'); alert("Все процессы скрапинга остановлены. / All scraping processes stopped.");
    }
    function toggleAutoStartMenu() {
        const currentAutoStart = getConfigValue('AUTO_START_ENABLED', false);
        const newAutoStart = !currentAutoStart;
        GM_config.set('AUTO_START_ENABLED', newAutoStart); GM_config.save();
        alert(`Автозапуск ${newAutoStart ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}. / Auto-start ${newAutoStart ? 'ENABLED' : 'DISABLED'}.`);
        consoleLog(`Автозапуск ${newAutoStart ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'} через меню. / Auto-start ${newAutoStart ? 'ENABLED' : 'DISABLED'} via menu.`);
        setupAutoStart();
    }

    // --- REGISTER MENU COMMANDS ---
    if (typeof GM_registerMenuCommand === 'function') {
        if (gmConfigInitialized) {
            GM_registerMenuCommand("Scrape Current Channel / Собрать с текущего канала", startSingleChannelScrapeMenu, "C");
            GM_registerMenuCommand("Scrape All Listed Channels / Собрать со всех каналов", () => startMultiChannelScrapeMenu(false), "A");
            GM_registerMenuCommand("Toggle Auto-Start / Вкл/Выкл Автозапуск", toggleAutoStartMenu, "T");
            GM_registerMenuCommand("Stop All Scraping / Остановить всё", stopAllScrapingActivitiesMenu, "S");
            GM_registerMenuCommand("Script Settings... / Настройки скрипта...", () => GM_config.open(), "O");
            consoleLog("Команды меню Tampermonkey зарегистрированы. / Tampermonkey menu commands registered.");
        } else {
            consoleLog("GM_config не был успешно инициализирован. / GM_config was not successfully initialized.", true); alert("Ошибка: GM_config не инициализирован. / Error: GM_config not initialized.");
            GM_registerMenuCommand("Scrape Current Channel / Собрать с текущего канала", startSingleChannelScrapeMenu, "C");
            GM_registerMenuCommand("Scrape All Listed Channels / Собрать со всех каналов",() => startMultiChannelScrapeMenu(false), "A");
            GM_registerMenuCommand("Stop All Scraping / Остановить всё", stopAllScrapingActivitiesMenu, "S");
            consoleLog("Основные команды меню Tampermonkey зарегистрированы. / Basic Tampermonkey menu commands registered.");
        }
    } else {
        consoleLog("GM_registerMenuCommand не доступна. / GM_registerMenuCommand is not available.", true); alert("Tampermonkey API GM_registerMenuCommand не доступно. / Tampermonkey API GM_registerMenuCommand is not available.");
    }

    // Initialize auto-start check after a short delay to ensure GM_config is fully ready.
    // Инициализация проверки автозапуска после небольшой задержки, чтобы GM_config был полностью готов.
    if (gmConfigInitialized) {
        setTimeout(() => {
            consoleLog("Первоначальная настройка автозапуска после задержки. / Initial auto-start setup after delay.");
            setupAutoStart();
        }, 1000); // 1 second delay / Задержка в 1 секунду
    }

})();
console.log(`[Telegram Scraper v${GM_info.script.version}] Script IIFE execution completed.`);
