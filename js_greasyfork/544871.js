// ==UserScript==
// @name         Perplexity Плейграунд Адвансед русский!
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Добавляет расширенные функции в Perplexity Playground.
// @match        https://playground.perplexity.ai/
// @author       YouTubeDrawaria
// @grant        none
// @license      MIT
// @icon         https://playground.perplexity.ai/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/544871/Perplexity%20%D0%9F%D0%BB%D0%B5%D0%B9%D0%B3%D1%80%D0%B0%D1%83%D0%BD%D0%B4%20%D0%90%D0%B4%D0%B2%D0%B0%D0%BD%D1%81%D0%B5%D0%B4%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%21.user.js
// @updateURL https://update.greasyfork.org/scripts/544871/Perplexity%20%D0%9F%D0%BB%D0%B5%D0%B9%D0%B3%D1%80%D0%B0%D1%83%D0%BD%D0%B4%20%D0%90%D0%B4%D0%B2%D0%B0%D0%BD%D1%81%D0%B5%D0%B4%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Вы можете изменить этот селектор, если изменится id селектора модели
    const SELECT_MODEL_ID = 'lamma-select';
    const DEFAULT_MODEL_VALUE = 'sonar-reasoning-pro'; // Модель по умолчанию для выбора

    // Определяем CSS-селекторы для ключевых элементов страницы
    const SELECTORS = {
        CHAT_CONTAINER_ROOT: 'div.flex.h-full.min-h-screen.flex-col > div.flex.h-full.grow',
        CHAT_MESSAGES_SCROLL_CONTAINER: 'div.pt-md.md\\:pt-lg.grow.md\\:border-x',
        MESSAGE_BUBBLE_COMMON: '.px-md.py-sm.max-w-full.break-words.rounded-lg.border.text-left.shadow-sm',
        MESSAGE_TEXT_CONTAINER: '.prose',
        INPUT_TEXTAREA: 'textarea[placeholder="Ask anything…"]',
        TEXTAREA_PARENT_CONTAINER: 'div.bg-raised.w-full', // Родитель textarea для позиционирования счетчика
        HEADER_RIGHT_SECTION: '.gap-sm.flex.items-center', // Правая секция, где находятся "sonar" и "Try Perplexity"
        // Контейнер, который содержит кнопку корзины и grow-div textarea
        INPUT_CONTROLS_ROW: 'div.px-md.py-md.border-t.md\\:border-x > div.gap-x-sm.flex.items-center',
        CLEAR_CHAT_BUTTON: 'button[aria-label="Clear Chat"]', // Кнопка корзины
    };

    // Расширенные категоризированные промпты для выпадающего меню
    const ALL_CATEGORIZED_PROMPTS = {
        "Игровые промпты": [
            { name: "Простая HTML игра", text: `Создайте игру в одном HTML-файле. Не используйте data:image/png;base64. Генерируйте графику, используя фигуры и SVG.` },
            { name: "Полная игра", text: `Сгенерируйте ресурсы, спрайты, ассеты, звуковые эффекты, музыку, механики, концепции, игровые дизайны, идеи и особенности для полноценной игры. Будьте точны, умны и лаконичны.` },
            { name: "Воссоздать игру", text: `Создайте подробный промпт для ИИ, чтобы воссоздать существующую игру. Шаг за шагом объясните, как он должен подходить к воссозданию, включая анализ оригинальной игры, определение ключевых механик, создание ассетов, реализацию кода и фазы тестирования. Будьте тщательны в каждой детали.` },
            { name: "Сложная HTML игра", text: `Создайте игру в одном HTML-файле с большой картой, добавьте элементы, объекты, детали и лучшую графику. Будьте точны, умны и лаконичны. Используйте только фигуры и SVG для всей графики (без base64encoded или PNG изображений). Вся графика должна быть создана с использованием фигур и SVG-путей, без внешних ресурсов, с плавными анимациями и переходами, подходящей пошаговой боевой механикой, отзывчивыми элементами пользовательского интерфейса, системой управления здоровьем, четырьмя различными движениями с расчетом случайного урона, вражеским ИИ с базовой логикой атаки и визуальной обратной связью для атак и урона.` },
            { name: "Детализированная игра", text: `Улучшите, расширьте и усовершенствуйте существующую игру. Игра должна иметь большую карту и включать элементы, объекты, детали и лучшую графику, а также улучшенных и детализированных персонажей. Я хочу, чтобы вся игра была в одном файле. Не используйте base64encoded или PNG изображения; вы должны создавать графику с максимальной сложностью, детализацией и улучшением, используя только фигуры и SVG. Сделайте игру максимально хорошей и большой. Кроме того, добавьте больше типов платформ, создайте больше типов врагов, реализуйте различные эффекты усилений, установите систему уровней, разработайте различные окружения, разработайте более сложный ИИ врагов, сделайте движения игроков более плавными и улучшите пользовательский интерфейс как для игрока, так и для врагов.` }
        ],
        "Веб-промпты": [
            { name: "Современный веб-сайт", text: `Создайте код для современной целевой страницы веб-сайта, которая. Убедитесь, что она выглядит красиво и хорошо спроектирована.` }
        ],
        "Промпты персонажа": [
            { name: "Описание персонажа", text: `Сделайте длинное описание, описывающее все о персонаже с дополнительной подробной информацией. Сделайте профессиональное описание, подробно описывающее все об изображении с более подробной информацией.` }
        ],
        "Промпты песни": [
            { name: "Атрибуты песни", text: `Дайте мне атрибуты песни, разделенные запятыми. Атрибуты песни, разделенные запятыми.` }
        ],
        "Промпты Gemini": [
            { name: "Сгенерировать 4 изображения X", text: `Сгенерировать 4 новых разных [X] в 4 изображениях каждый.` }
        ],
        "Промпты для скриптинга/разработки": [
            { name: "Создать скрипт Drawaria", text: `Создайте полный скрипт Tampermonkey для drawaria.online со следующей начальной структурой:\n // ==UserScript==\n// @name New Userscript\n// @namespace http://tampermonkey.net/\n// @version 1.0\n// @description try to take over the world!\n// @author YouTubeDrawaria\n// @match https://drawaria.online/*\n// @grant none\n// @license MIT\n// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online\n// ==/UserScript==\n\n(function() {\n    'use strict';\n\n    // Ваш код здесь...\n})();\n` },
            { name: "Улучшить скрипт Drawaria", text: `Улучшите, обновите, максимизируйте, удивите, создайте реализм и высокий уровень детализации в скрипте для drawaria.online. Мне нужны элементы X на экране, музыка, эффекты, частицы, блики и хорошо анимированный и детализированный интерфейс со всем. Не используйте заполнители, .mp3 или data:image/png;base64. Вы должны создавать графику сами, без заменяемых файлов.` },
            { name: "Атрибуты игры (Drawaria)", text: `Дайте мне атрибуты игры. Включите: иконку игры (<link rel="icon" href="https://drawaria.online/avatar/cache/ab53c430-1b2c-11f0-af95-072f6d4ed084.1749767757401.jpg" type="image/x-icon">) и фоновую музыку с автовоспроизведением по клику: (<audio id="bg-music" src="https://www.myinstants.com/media/sounds/super-mini-juegos-2.mp3" loop></audio><script>const music = document.getElementById('bg-music'); document.body.addEventListener('click', () => { if (music.paused) { music.play(); } });</script>).` },
            { name: "Информация об API Cubic Engine", text: `Предоставьте информацию о широко используемых API, которые не размещены на Vercel, не имеют проблем с CORS при использовании из браузеров/оболочек, могут быть быстро интегрированы в Cubic Engine / Drawaria и являются бесплатными и готовыми к использованию.` },
            { name: "Интегрировать функцию Cubic Engine", text: `Для интеграции нового дополнения в модуль Cubic Engine мне нужен полный обновленный код функции. Это включает кнопку со всеми ее свойствами, триггеры с их идентификаторами, слушатели этого события и файлы, которые его выполняют. Предоставьте только код обновленной функции, а не код Cubic Engine с нуля.` }
        ]
    };

    let featuresInitialized = false; // Флаг для предотвращения двойной инициализации

    // SVG-иконка загрузки (похожа на корзину)
    const DOWNLOAD_ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-download">
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
            <polyline points="7 11 12 16 17 11"></polyline>
            <line x1="12" y1="4" x2="12" y2="16"></line>
        </svg>
    `;

    /**
     * Устанавливает модель ИИ по умолчанию в селекторе 'lamma-select'.
     */
    function setDefaultModel() {
        const select = document.getElementById(SELECT_MODEL_ID);
        if (select && select.value !== DEFAULT_MODEL_VALUE) {
            select.value = DEFAULT_MODEL_VALUE;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Perplexity Playground Advanced: Модель установлена на '${DEFAULT_MODEL_VALUE}'.`);
        }
    }

    /**
     * Создает HTML-кнопку с предопределенными стилями (серая тема).
     * @param {string} text - Текст кнопки.
     * @param {function} onClick - Функция, выполняемая при клике.
     * @param {string} [buttonColor='#4a4a50'] - Цвет фона кнопки.
     * @param {object} [styles={}] - Дополнительные CSS-стили.
     * @returns {HTMLButtonElement}
     */
    function createButton(text, onClick, buttonColor = '#4a4a50', styles = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background-color: ${buttonColor};
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: opacity 0.3s ease;
            white-space: nowrap;
            ${Object.entries(styles).map(([key, value]) => `${key}:${value};`).join('')}
        `;
        button.onmouseover = () => button.style.opacity = '0.8';
        button.onmouseout = () => button.style.opacity = '1';
        button.onclick = onClick;
        return button;
    }

    /**
     * Создает кнопку с иконкой с предопределенными стилями (круглая, серая).
     * @param {string} svgContent - SVG-код иконки.
     * @param {string} title - Текст подсказки при наведении (tooltip).
     * @param {function} onClick - Функция, выполняемая при клике.
     * @param {string} [buttonColor='#4a4a50'] - Цвет фона кнопки.
     * @param {object} [styles={}] - Дополнительные CSS-стили.
     * @returns {HTMLButtonElement}
     */
    function createIconButton(svgContent, title, onClick, buttonColor = '#4a4a50', styles = {}) {
        const button = document.createElement('button');
        button.innerHTML = svgContent;
        button.title = title;
        button.style.cssText = `
            background-color: ${buttonColor};
            color: white;
            padding: 0;
            border: none;
            border-radius: 9999px; /* Круглый */
            cursor: pointer;
            transition: opacity 0.3s ease, background-color 0.15s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px; /* Размер похож на кнопку корзины */
            width: 40px;  /* Квадратный */
            flex-shrink: 0;
            ${Object.entries(styles).map(([key, value]) => `${key}:${value};`).join('')}
        `;
        button.onmouseover = () => { button.style.opacity = '0.8'; button.style.backgroundColor = '#5c5c63'; }; // Слегка светлее при наведении
        button.onmouseout = () => { button.style.opacity = '1'; button.style.backgroundColor = buttonColor; }; // Вернуть к исходному цвету
        button.onclick = onClick;
        return button;
    }

    /**
     * Создает выпадающее меню (select) с группами опций (optgroups) для категоризации (серая тема).
     * @param {object} categorizedOptions - Объект с категориями и опциями.
     * @param {function} onSelect - Функция, выполняемая при выборе опции.
     * @param {string} [placeholder="Выбрать промпт"] - Текст заполнителя.
     * @param {string} [dropdownColor='#4a4a50'] - Цвет фона выпадающего списка.
     * @returns {HTMLSelectElement}
     */
    function createCategorizedDropdown(categorizedOptions, onSelect, placeholder = "Выбрать промпт", dropdownColor = '#4a4a50') {
        const select = document.createElement('select');
        select.style.cssText = `
            background-color: ${dropdownColor};
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: opacity 0.3s ease;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position: right 8px top 50%;
            background-size: 16px;
            min-width: 150px;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = placeholder;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        for (const category in categorizedOptions) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            categorizedOptions[category].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.text;
                option.textContent = opt.name;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }

        select.onchange = (event) => {
            if (event.target.value) {
                onSelect(event.target.value);
                event.target.value = ""; // Сбросить до заполнителя
            }
        };
        return select;
    }

    /**
     * Создает и отображает модальное окно.
     * @param {string} title - Заголовок модального окна.
     * @param {string} contentHtml - HTML-содержимое модального окна.
     */
    function showModal(title, contentHtml) {
        const existingModalOverlay = document.getElementById('perplexity-custom-modal-overlay');
        if (existingModalOverlay) {
            existingModalOverlay.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'perplexity-custom-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        const modalContent = document.createElement('div');
        modalContent.id = 'perplexity-custom-modal';
        modalContent.style.cssText = `
            background-color: #2b2b30;
            color: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            max-width: 80%;
            max-height: 80%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            position: relative;
        `;

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            color: #6366f1;
            font-size: 1.2em;
            text-align: center;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: #aaa;
            font-size: 1.2em;
            cursor: pointer;
        `;
        closeButton.onclick = () => modalOverlay.remove();

        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = contentHtml;
        modalContent.appendChild(contentDiv);

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // --- Основные функции чата ---

    /** Получает текущее содержимое чата. */
    function getCurrentChatContent() {
        const chatBubbles = document.querySelectorAll(SELECTORS.MESSAGE_BUBBLE_COMMON);
        let chatContent = [];

        chatBubbles.forEach(bubble => {
            const isUserMessage = bubble.parentElement && bubble.parentElement.classList.contains('justify-end');
            let messageText = '';
            const proseElement = bubble.querySelector(SELECTORS.MESSAGE_TEXT_CONTAINER);
            messageText = proseElement ? proseElement.innerText.trim() : bubble.innerText.trim();

            if (messageText) {
                chatContent.push({
                    type: isUserMessage ? 'Пользователь' : 'Perplexity',
                    text: messageText,
                    timestamp: new Date().toISOString()
                });
            }
        });
        return chatContent;
    }

    /** Сохраняет текущую беседу в localStorage. */
    function saveCurrentChat() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            alert('Нет беседы для сохранения.');
            return;
        }

        const chatName = prompt("Введите имя для этой беседы:", `Чат ${new Date().toLocaleString()}`);
        if (chatName) {
            try {
                const savedChats = JSON.parse(localStorage.getItem('perplexity_playground_chats') || '[]');
                savedChats.push({ name: chatName, timestamp: new Date().toISOString(), messages: chatContent });
                localStorage.setItem('perplexity_playground_chats', JSON.stringify(savedChats));
                alert(`Беседа "${chatName}" успешно сохранена.`);
            } catch (e) {
                console.error("Ошибка при сохранении беседы:", e);
                alert("Ошибка при сохранении беседы.");
            }
        }
    }

    /** Загружает и отображает сохраненные беседы, позволяя просматривать или удалять их. */
    function loadSavedChats() {
        const savedChats = JSON.parse(localStorage.getItem('perplexity_playground_chats') || '[]');
        if (savedChats.length === 0) {
            alert('Нет сохраненных бесед.');
            return;
        }

        let chatListHtml = '<ul style="list-style-type: none; padding: 0;">';
        savedChats.forEach((chat, index) => {
            chatListHtml += `
                <li style="margin-bottom: 10px; background-color: #3a3a40; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.9em; color: #ccc;">${chat.name} (${new Date(chat.timestamp).toLocaleString()})</span>
                    <div>
                        <button class="view-chat-btn" data-index="${index}" style="background-color: #6366f1; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-right: 5px;">Просмотр</button>
                        <button class="delete-chat-btn" data-index="${index}" style="background-color: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;">Удалить</button>
                    </div>
                </li>
            `;
        });
        chatListHtml += '</ul>';

        showModal('Сохраненные беседы', chatListHtml);

        document.querySelectorAll('.view-chat-btn').forEach(button => {
            button.onclick = (e) => {
                const index = e.target.dataset.index;
                const chatToView = savedChats[index];
                let chatViewHtml = '<div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto;">';
                chatToView.messages.forEach(msg => {
                    const align = msg.type === 'Пользователь' ? 'right' : 'left';
                    const bgColor = msg.type === 'Пользователь' ? '#007bff' : '#333';
                    chatViewHtml += `<div style="text-align: ${align}; margin-bottom: 10px;">
                                        <div style="display: inline-block; background-color: ${bgColor}; padding: 8px 12px; border-radius: 10px; max-width: 90%; word-wrap: break-word;">
                                            <strong style="color: ${msg.type === 'Пользователь' ? '#cceeff' : '#aaffaa'};">${msg.type}:</strong> ${msg.text}
                                        </div>
                                    </div>`;
                });
                chatViewHtml += '</div>';
                showModal(`Просмотр беседы: ${chatToView.name}`, chatViewHtml);
            };
        });

        document.querySelectorAll('.delete-chat-btn').forEach(button => {
            button.onclick = (e) => {
                const indexToDelete = parseInt(e.target.dataset.index);
                if (confirm(`Вы уверены, что хотите удалить беседу "${savedChats[indexToDelete].name}"?`)) {
                    savedChats.splice(indexToDelete, 1);
                    localStorage.setItem('perplexity_playground_chats', JSON.stringify(savedChats));
                    alert('Беседа удалена.');
                    document.getElementById('perplexity-custom-modal-overlay')?.remove();
                    loadSavedChats();
                }
            };
        });
    }

    /** Экспортирует текущую беседу в текстовый файл. */
    function exportChatToText() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            alert('Нет беседы для экспорта.');
            return;
        }

        let exportText = `--- Беседа Perplexity Playground (${new Date().toLocaleString()}) ---\n\n`;
        chatContent.forEach(msg => {
            exportText += `${msg.type}: ${msg.text}\n\n`;
        });
        exportText += `--- Конец беседы ---\n`;

        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `perplexity_chat_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Беседа экспортирована в текстовый файл.');
    }

    /**
     * Устанавливает значение элемента ввода таким образом, чтобы React его распознал.
     * @param {HTMLElement} element - DOM-элемент input/textarea.
     * @param {string} value - Новое значение для установки.
     */
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
        const event = new Event('input', { bubbles: true });
        valueSetter.call(element, value);
        element.dispatchEvent(event);
    }

    /**
     * Вставляет предопределенный промпт в текстовое поле ввода.
     * @param {string} promptText - Текст промпта для вставки.
     */
    function handlePromptSelection(promptText) {
        const inputTextArea = document.querySelector(SELECTORS.INPUT_TEXTAREA);
        if (inputTextArea) {
            setNativeValue(inputTextArea, promptText);
            inputTextArea.focus();
        }
    }

    /** Настраивает счетчик символов и слов в текстовом поле. */
    function setupCharacterCounter() {
        const inputTextArea = document.querySelector(SELECTORS.INPUT_TEXTAREA);
        if (!inputTextArea) return;

        const container = inputTextArea.closest(SELECTORS.TEXTAREA_PARENT_CONTAINER);
        if (!container) return;

        if (document.getElementById('perplexity-char-word-counter')) {
            return; // Счетчик уже существует
        }

        const counterSpan = document.createElement('span');
        counterSpan.id = 'perplexity-char-word-counter';
        counterSpan.style.cssText = `
            position: absolute;
            bottom: 8px;
            right: 12px;
            font-size: 10px;
            color: #888;
            pointer-events: none;
            z-index: 10;
        `;
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        container.appendChild(counterSpan);

        const updateCounter = () => {
            const text = inputTextArea.value;
            const charCount = text.length;
            const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            counterSpan.textContent = `Символов: ${charCount} | Слов: ${wordCount}`;
        };

        inputTextArea.addEventListener('input', updateCounter);
        updateCounter(); // Инициализация счетчика
    }

    /**
     * Добавляет функцию редактирования и переотправки к пузырьку сообщения.
     * @param {HTMLElement} messageBubble - Пузырек сообщения, к которому нужно добавить функцию.
     */
    function addEditAndResendToMessage(messageBubble) {
        if (messageBubble.dataset.hasEditListener) {
            return; // Уже обработано
        }
        messageBubble.dataset.hasEditListener = 'true';

        // Разрешить редактирование/переотправку только сообщений ПОЛЬЗОВАТЕЛЯ
        const isUserMessage = messageBubble.parentElement && messageBubble.parentElement.classList.contains('justify-end');

        if (isUserMessage) {
            messageBubble.style.cursor = 'pointer';
            messageBubble.style.transition = 'filter 0.15s ease-in-out'; // Переход для фильтра

            messageBubble.addEventListener('click', function(event) {
                // event.stopPropagation(); // Раскомментировать, если не нужно, чтобы клик распространялся

                let messageText = '';
                const proseElement = messageBubble.querySelector(SELECTORS.MESSAGE_TEXT_CONTAINER);
                messageText = proseElement ? proseElement.innerText.trim() : messageBubble.innerText.trim();

                const inputTextArea = document.querySelector(SELECTORS.INPUT_TEXTAREA);
                if (inputTextArea && messageText) {
                    setNativeValue(inputTextArea, messageText);
                    inputTextArea.focus();
                }
            });

            // Визуальный эффект при наведении курсора (hover)
            messageBubble.onmouseenter = () => {
                 messageBubble.style.filter = 'brightness(1.1)'; // Слегка ярче
            };
            messageBubble.onmouseleave = () => {
                 messageBubble.style.filter = ''; // Вернуть к исходному состоянию
            };
        }
    }


    /** Настраивает наблюдателя для добавления функции редактирования/переотправки к новым сообщениям. */
    function setupEditAndResendObserver() {
        const chatContainer = document.querySelector(SELECTORS.CHAT_MESSAGES_SCROLL_CONTAINER);

        if (!chatContainer) {
            console.warn("Perplexity Playground Advanced Features: Контейнер сообщений для наблюдателя (Редактировать и переотправить) не найден.");
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Узел элемента
                            if (node.matches(SELECTORS.MESSAGE_BUBBLE_COMMON)) {
                                addEditAndResendToMessage(node);
                            }
                            node.querySelectorAll(SELECTORS.MESSAGE_BUBBLE_COMMON).forEach(addEditAndResendToMessage);
                        }
                    });
                }
            }
        });

        observer.observe(chatContainer, { childList: true, subtree: true });

        // Применить функцию к существующим сообщениям при загрузке
        document.querySelectorAll(SELECTORS.MESSAGE_BUBBLE_COMMON).forEach(addEditAndResendToMessage);
        console.log("Perplexity Playground Advanced Features: Функция 'Редактировать и переотправить' настроена.");
    }

    // --- Функция: Импорт текстовых файлов и OCR ---

    // Динамическая загрузка Tesseract.js:
    function loadTesseractJs() {
        return new Promise((resolve, reject) => {
            if (window.Tesseract) {
                console.log("Tesseract.js уже загружен.");
                resolve();
                return;
            }
            console.log("Загрузка Tesseract.js с CDN...");
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
            script.onload = () => {
                if (window.Tesseract) {
                    console.log("Tesseract.js успешно загружен.");
                    resolve();
                } else {
                    console.error("Tesseract.js не найден после загрузки скрипта.");
                    reject(new Error("Tesseract.js не найден после загрузки скрипта."));
                }
            };
            script.onerror = (e) => {
                console.error("Ошибка при загрузке Tesseract.js:", e);
                reject(new Error("Ошибка при загрузке Tesseract.js с CDN."));
            };
            document.head.appendChild(script);
        });
    }

    // Динамическая загрузка pdf.js:
    function loadPdfJs() {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                console.log("pdf.js уже загружен.");
                resolve();
                return;
            }
            console.log("Загрузка pdf.js с CDN...");
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js";
            script.onload = function() {
                try {
                    if (window.pdfjsLib) {
                        // Убедитесь, что workerSrc настроен правильно
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";
                        console.log("pdf.js и workerSrc успешно настроены.");
                        resolve();
                    } else {
                        console.error("pdfjsLib не найден после загрузки скрипта.");
                        reject(new Error("pdfjsLib не найден после загрузки скрипта."));
                    }
                } catch (e) {
                    console.error("Ошибка при настройке pdfjsLib.GlobalWorkerOptions.workerSrc:", e);
                    reject(e);
                }
            };
            script.onerror = (e) => {
                console.error("Ошибка при загрузке pdf.js:", e);
                reject(new Error("Ошибка при загрузке pdf.js с CDN."));
            };
            document.head.appendChild(script);
        });
    }

    // Динамическая загрузка mammoth.js:
    function loadMammothJs() {
        return new Promise((resolve, reject) => {
            if (window.mammoth) {
                console.log("mammoth.js уже загружен.");
                resolve();
                return;
            }
            console.log("Загрузка mammoth.js с CDN...");
            const script = document.createElement('script');
            script.src = "https://unpkg.com/mammoth/mammoth.browser.min.js";
            script.onload = () => {
                if (window.mammoth) {
                    console.log("mammoth.js успешно загружен.");
                    resolve();
                } else {
                    console.error("mammoth не найден после загрузки скрипта.");
                    reject(new Error("mammoth не найден после загрузки скрипта."));
                }
            };
            script.onerror = (e) => {
                console.error("Ошибка при загрузке mammoth.js:", e);
                reject(new Error("Ошибка при загрузке mammoth.js с CDN."));
            };
            document.head.appendChild(script);
        });
    }


    /**
     * Читает файл как текст.
     * @param {File} file - Файл для чтения.
     * @returns {Promise<string>} Промис, разрешающийся содержимым файла.
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => {
                console.error(`Ошибка FileReader для файла ${file.name}:`, e);
                reject(e);
            };
            reader.readAsText(file);
        });
    }

    /**
     * Извлекает текст из PDF-файла.
     * @param {File} file - PDF-файл для обработки.
     * @returns {Promise<string>} Промис, разрешающийся извлеченным текстом.
     */
    async function extractTextFromPdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const loadingTask = window.pdfjsLib.getDocument({ data: typedarray });
                    const pdf = await loadingTask.promise;
                    let text = '';
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const content = await page.getTextContent();
                        // Объединить текстовые элементы пробелом и добавить разрыв строки на страницу
                        text += content.items.map(item => item.str).join(' ') + '\n';
                    }
                    resolve(text);
                } catch (err) {
                    console.error(`Ошибка при извлечении текста из PDF ${file.name}:`, err);
                    reject(new Error(`Ошибка при обработке PDF: ${err.message || err}. Убедитесь, что это не отсканированный PDF без текстового слоя.`));
                }
            };
            reader.onerror = (e) => {
                console.error(`Ошибка FileReader при чтении PDF ${file.name}:`, e);
                reject(e);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Извлекает текст из DOCX-файла (Word).
     * @param {File} file - DOCX-файл для обработки.
     * @returns {Promise<string>} Промис, разрешающийся извлеченным текстом.
     */
    async function extractTextFromDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    // mammoth.js возвращает объект с 'value' (текст) и 'messages'
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    if (result.messages.length > 0) {
                        console.warn(`Сообщения mammoth.js при обработке ${file.name}:`, result.messages);
                    }
                    resolve(result.value.trim());
                } catch (err) {
                    console.error(`Ошибка при извлечении текста из DOCX ${file.name}:`, err);
                    reject(new Error(`Ошибка при обработке DOCX: ${err.message || err}.`));
                }
            };
            reader.onerror = (e) => {
                console.error(`Ошибка FileReader при чтении DOCX ${file.name}:`, e);
                reject(e);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Обрабатывает список файлов и вставляет их в текстовое поле.
     * @param {FileList} files - Файлы для обработки.
     */
    async function processDroppedFiles(files) {
        const inputTextArea = document.querySelector(SELECTORS.INPUT_TEXTAREA);
        if (!inputTextArea) {
            console.warn("Текстовое поле ввода не найдено.");
            return;
        }

        let allContent = '';
        const importButton = document.getElementById('perplexity-import-button'); // Получить кнопку импорта

        // Сохранить оригинальный заголовок и цвет кнопки для восстановления позже
        const originalButtonTitle = importButton ? importButton.title : '';
        const originalButtonBackgroundColor = importButton ? importButton.style.backgroundColor : '';

        for (const file of files) {
            const textFileExtensions = new Set([
                'txt', 'html', 'htm', 'css', 'js', 'json', 'csv', 'xml', 'md', 'log',
                'yaml', 'yml', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'go', 'php',
                'rb', 'sh', 'bat', 'ps1', 'psm1', 'ini', 'cfg', 'conf', 'env', 'rs', 'ts', 'jsx', 'tsx', 'vue'
            ]);
            const textMimeTypes = [
                'text/', 'application/json', 'application/xml', 'application/javascript',
                'application/x-sh', 'application/x-python', 'application/x-yaml'
            ];
            const imageFileExtensions = new Set(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']);

            const fileNameParts = file.name.split('.');
            const fileExtension = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : '';

            const isKnownTextFile = textFileExtensions.has(fileExtension) || textMimeTypes.some(type => file.type.startsWith(type));
            const isImage = imageFileExtensions.has(fileExtension) || file.type.startsWith('image/');
            const isPdf = fileExtension === 'pdf' || file.type === 'application/pdf';
            const isDocx = fileExtension === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            if (isKnownTextFile) {
                try {
                    const content = await readFileAsText(file);
                    if (allContent !== '') {
                        allContent += `\n\n--- Содержимое файла: ${file.name} ---\n\n`; // Четкий разделитель
                    }
                    allContent += content;
                } catch (error) {
                    console.error(`Ошибка при чтении текстового файла ${file.name}:`, error);
                    alert(`Не удалось прочитать файл: ${file.name}. Возможно, это бинарный, поврежденный или несовместимой кодировки файл. Пропущен. Подробности в консоли.`);
                }
            } else if (isImage) {
                if (importButton) {
                    importButton.style.backgroundColor = '#6366f1'; // Цвет "активный"
                    importButton.title = `Загрузка OCR для изображения: ${file.name}...`;
                }
                try {
                    await loadTesseractJs(); // Дождаться загрузки Tesseract.js
                    const { data: { text } } = await Tesseract.recognize(
                        file,
                        'spa+eng', // Поддерживает испанский и английский. Настройте по необходимости.
                        {
                            logger: m => {
                                if (importButton && m.status === 'recognizing') {
                                    importButton.title = `OCR ${file.name}: ${Math.round(m.progress * 100)}%`;
                                }
                            }
                        }
                    );
                    if (allContent !== '') {
                        allContent += `\n\n--- Текст, извлеченный из изображения: ${file.name} ---\n\n`;
                    }
                    allContent += text.trim();
                } catch (error) {
                    console.error(`Ошибка при обработке изображения ${file.name} с помощью OCR:`, error);
                    alert(`Не удалось извлечь текст из изображения: ${file.name}. Ошибка: ${error.message}. Подробности в консоли.`);
                }
            } else if (isPdf) {
                if (importButton) {
                    importButton.style.backgroundColor = '#6366f1';
                    importButton.title = `Загрузка PDF.js для: ${file.name}...`;
                }
                try {
                    await loadPdfJs(); // Дождаться загрузки pdf.js
                    importButton.title = `Обработка PDF: ${file.name}...`; // Обновить статус
                    const text = await extractTextFromPdf(file);
                    if (allContent !== '') {
                        allContent += `\n\n--- Текст, извлеченный из PDF: ${file.name} ---\n\n`;
                    }
                    allContent += text.trim();
                } catch (error) {
                    console.error(`Ошибка при извлечении текста из PDF ${file.name}:`, error);
                    alert(`Не удалось извлечь текст из PDF: ${file.name}. Ошибка: ${error.message}. Подробности в консоли.`);
                }
            } else if (isDocx) {
                if (importButton) {
                    importButton.style.backgroundColor = '#6366f1';
                    importButton.title = `Загрузка Mammoth.js для: ${file.name}...`;
                }
                try {
                    await loadMammothJs(); // Дождаться загрузки mammoth.js
                    importButton.title = `Обработка Word: ${file.name}...`; // Обновить статус
                    const text = await extractTextFromDocx(file);
                    if (allContent !== '') {
                        allContent += `\n\n--- Текст, извлеченный из Word: ${file.name} ---\n\n`;
                    }
                    allContent += text;
                } catch (error) {
                    console.error(`Ошибка при извлечении текста из Word ${file.name}:`, error);
                    alert(`Не удалось извлечь текст из Word: ${file.name}. Ошибка: ${error.message}. Подробности в консоли.`);
                }
            }
            else {
                alert(`Этот скрипт предназначен для извлечения текста из простых файлов (таких как код, текстовые документы и т.д.), изображений, PDF или документов Word (.docx). Он не может извлекать содержимое из сложных бинарных файлов другого типа. Пропущен: ${file.name}`);
            }
        }

        // Восстановить заголовок и цвет кнопки после обработки всех файлов
        if (importButton) {
            importButton.title = originalButtonTitle;
            importButton.style.backgroundColor = originalButtonBackgroundColor;
        }

        if (allContent) {
            // Добавляет содержимое в textarea, сохраняя существующее содержимое
            setNativeValue(inputTextArea, inputTextArea.value + (inputTextArea.value ? '\n\n' : '') + allContent);
            inputTextArea.focus();
            inputTextArea.scrollTop = inputTextArea.scrollHeight; // Прокрутить до конца
        }
    }

    /** Настраивает кнопку импорта файлов с функцией Drag & Drop. */
    function setupImportButton() {
        const inputControlsRow = document.querySelector(SELECTORS.INPUT_CONTROLS_ROW);
        const clearChatButton = document.querySelector(SELECTORS.CLEAR_CHAT_BUTTON);

        if (!inputControlsRow || !clearChatButton) {
            console.warn("Perplexity Playground Advanced Features: Контейнер элементов управления или кнопка корзины для добавления кнопки импорта не найдены.");
            return;
        }

        if (document.getElementById('perplexity-import-button')) {
            return; // Кнопка уже существует
        }

        // Создать скрытый input для файла
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        // Разрешает выбор текстовых файлов, изображений для OCR, PDF и DOCX
        fileInput.accept = `
            .txt,.html,.htm,.css,.js,.json,.csv,.xml,.md,.log,.yaml,.yml,.py,.java,.c,.cpp,.h,.hpp,.go,.php,.rb,.sh,.bat,.ps1,.psm1,.ini,.cfg,.conf,.env,.rs,.ts,.jsx,.tsx,.vue,
            .png,.jpg,.jpeg,.bmp,.gif,.webp,
            .pdf,application/pdf,
            .docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
            text/*,application/json,application/xml,application/javascript,application/x-sh,application/x-python,application/x-yaml,image/*
        `.replace(/\s/g, ''); // Удаляет пробелы для чистого строкового значения

        // Создать кнопку-иконку для импорта
        const importButton = createIconButton(
            DOWNLOAD_ICON_SVG,
            'Импортировать текстовые файлы, изображения, PDF или Word (перетащите или нажмите)',
            () => fileInput.click()
        );
        importButton.id = 'perplexity-import-button'; // Добавить ID кнопке

        // Слушатели событий для Drag & Drop на кнопке
        importButton.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            importButton.style.border = '2px dashed #6366f1'; // Пунктирная синяя рамка
            importButton.style.backgroundColor = '#5c5c63';
        });

        importButton.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            importButton.style.border = 'none'; // Отменить
            importButton.style.backgroundColor = '#4a4a50';
        });

        importButton.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            importButton.style.border = 'none';
            importButton.style.backgroundColor = '#4a4a50';

            if (e.dataTransfer.files.length > 0) {
                processDroppedFiles(e.dataTransfer.files);
            }
        });

        // Слушатель события для выбора файлов через диалог
        fileInput.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                processDroppedFiles(event.target.files);
                event.target.value = ''; // Очистить input для возможности последовательных выборов
            }
        });

        // Создать новый контейнер для кнопок слева (корзина и импорт)
        const leftButtonsContainer = document.createElement('div');
        leftButtonsContainer.style.display = 'flex';
        leftButtonsContainer.style.flexDirection = 'column';
        leftButtonsContainer.style.gap = '8px'; // Промежуток между кнопками (gap-sm)
        leftButtonsContainer.style.alignItems = 'flex-start'; // Выровнять кнопки по левому краю в столбце

        // Переместить кнопку корзины в этот новый контейнер
        clearChatButton.remove(); // Удалить из оригинального положения
        leftButtonsContainer.appendChild(clearChatButton);

        // Добавить новую кнопку импорта в этот контейнер
        leftButtonsContainer.appendChild(importButton);

        // Вставить новый контейнер на место оригинальной кнопки корзины
        inputControlsRow.prepend(leftButtonsContainer);

        console.log("Perplexity Playground Advanced Features: Кнопка 'Импорт' и корзина сгруппированы.");
    }


    // --- Инициализация скрипта ---
    function initializeFeatures() {
        if (featuresInitialized) {
            return; // Предотвращает двойную инициализацию
        }
        featuresInitialized = true;

        // Установить модель по умолчанию (должно быть сделано после того, как select появится в DOM)
        setDefaultModel();

        const headerRightSection = document.querySelector(SELECTORS.HEADER_RIGHT_SECTION);
        if (headerRightSection) {
            // Ищем существующие кнопки, чтобы вставить наши перед ними
            const existingSonarButton = headerRightSection.querySelector('a[href="https://sonar.perplexity.ai"]');

            // Добавить пользовательские кнопки в обратном порядке, чтобы они отображались слева направо
            // Желаемый порядок: выпадающий список промптов, Загрузить, Сохранить, Экспорт, sonar, Try Perplexity

            // Добавить кнопку Экспорт беседы (серая)
            const exportButton = createButton('Экспорт чата', exportChatToText);
            headerRightSection.insertBefore(exportButton, existingSonarButton);

            // Добавить кнопку Сохранить беседу (серая)
            const saveButton = createButton('Сохранить чат', saveCurrentChat);
            headerRightSection.insertBefore(saveButton, existingSonarButton);

            // Добавить кнопку Загрузить беседу (серая)
            const loadButton = createButton('Загрузить чат', loadSavedChats);
            headerRightSection.insertBefore(loadButton, existingSonarButton);

            // Добавить комбинированное выпадающее меню промптов (серое)
            const promptsDropdown = createCategorizedDropdown(ALL_CATEGORIZED_PROMPTS, handlePromptSelection, "Расширенные промпты");
            headerRightSection.insertBefore(promptsDropdown, existingSonarButton);

            console.log("Perplexity Playground Advanced Features: Кнопки заголовка и меню промптов добавлены.");
        } else {
            console.warn("Perplexity Playground Advanced Features: Правая секция заголовка для добавления кнопок не найдена.");
        }

        // Настроить счетчик символов/слов
        setupCharacterCounter();

        // Настроить функцию редактирования и переотправки для пузырьков сообщений
        setupEditAndResendObserver();

        // Настроить кнопку импорта текстовых файлов
        setupImportButton();
    }

    // Использовать MutationObserver, чтобы убедиться, что DOM полностью загружен и ключевые элементы доступны.
    const appRootObserver = new MutationObserver((mutations, obs) => {
        // Проверяем, присутствуют ли критические элементы UI
        if (
            document.querySelector(SELECTORS.INPUT_TEXTAREA) &&
            document.querySelector(SELECTORS.CHAT_MESSAGES_SCROLL_CONTAINER) &&
            document.getElementById(SELECT_MODEL_ID) &&
            document.querySelector(SELECTORS.INPUT_CONTROLS_ROW) &&
            document.querySelector(SELECTORS.CLEAR_CHAT_BUTTON) // Убедиться, что кнопка корзины присутствует
        ) {
            initializeFeatures();
            obs.disconnect(); // Отключить наблюдатель после успешной инициализации
        }
    });

    // Начать наблюдение за 'body' на предмет изменений в DOM
    appRootObserver.observe(document.body, { childList: true, subtree: true });

    // Запасной вариант: Если элементы уже присутствуют при выполнении скрипта (например, быстрая перезагрузка)
    if (
        document.querySelector(SELECTORS.INPUT_TEXTAREA) &&
        document.querySelector(SELECTORS.CHAT_MESSAGES_SCROLL_CONTAINER) &&
        document.getElementById(SELECT_MODEL_ID) &&
        document.querySelector(SELECTORS.INPUT_CONTROLS_ROW) &&
        document.querySelector(SELECTORS.CLEAR_CHAT_BUTTON)
    ) {
        initializeFeatures();
    }

})();