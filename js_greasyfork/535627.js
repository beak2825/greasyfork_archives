// ==UserScript==
// @name         AI Chat Template Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Universal template system with upward menu and cross-platform support
// @author       Dieha
// @license      MIT
// @match        https://aistudio.google.com/app*
// @match        https://chat.qwen.ai/*
// @match        https://chat.qwen.com/*
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535627/AI%20Chat%20Template%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/535627/AI%20Chat%20Template%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================ CONFIGURATION ================
    const GLOBAL_CONFIG = {
        buttonText: "Шаблоны",
        maxMenuDepth: 5,
        animationDuration: 200, // ms
        retryInterval: 1500,
        debugMode: true // Включите для отладки, особенно на AI Studio
    };

    const TEMPLATE_DATA = [
        {
            categoryName: "Основные Задачи",
            items: [
                { label: "Код файлов", text: "Напишите полный код изменяемых файл[ов/а]\n" },
                {
                    label: "Объяснения", // Уровень 0 (относительно категории)
                    subItems: [
                        { label: "Объясни (ELI5)", text: "Объясни [ТЕМА] так, как будто мне 5 лет." }, // Уровень 1
                        { label: "Подробно с примерами", text: "Объясни [ТЕМА] подробно, приведи примеры." },
                        {
                            label: "Сложные Аналогии", // Уровень 1
                            subItems: [ // Уровень 2
                                { label: "Аналогия для Технаря", text: "Объясни [ТЕМА] через аналогию из IT." },
                                { label: "Аналогия для Гуманитария", text: "Объясни [ТЕМА] через аналогию из литературы."}
                            ]
                        }
                    ]
                },
            ]
        },
        {
            categoryName: "Работа с кодом",
            items: [
                {
                    label: "Рефакторинг",
                    text: "Проведи рефакторинг следующего кода:\n```\n[ВСТАВЬТЕ КОД]\n```"
                },
                {
                    label: "Поиск ошибок",
                    text: "Найди и исправь ошибки в коде:\n```\n[ВСТАВЬТЕ КОД]\n```"
                }
            ]
        }
    ];

    const PLATFORM_SETTINGS = {
        'aistudio.google.com': {
            // buttonContainer: ".prompt-input-wrapper-container", // Оставляем этот, если prepend работает
            buttonContainer: ".prompt-input-wrapper-container > .text-wrapper", // Попробуем так, чтобы кнопка была слева от текстового поля
            // buttonContainer: ".prompt-input-wrapper-container > div:nth-child(2)", // Если хотим перед первой кнопкой "add-chunk-menu"
            textAreaSelector: 'textarea[aria-label="Type something or pick one from prompt gallery"]', // ОБНОВЛЕНО
            insertMethod: "react", // Оставляем react, он должен хорошо работать с Angular (на котором построен AI Studio)
            buttonStyle: {
                background: "#2D2E30",
                border: "1px solid #454545",
                hoverBackground: "#3A3C3F",
                textColor: "#E3E3E3"
            }
        },
        'chat.deepseek.com': {
            buttonContainer: "div.ec4f5d61",
            textAreaSelector: "textarea#chat-input",
            insertMethod: "advanced", // ВОЗВРАЩАЕМ advanced
            buttonStyle: {
                background: "transparent",
                border: "1px solid #5E5E5E",
                hoverBackground: "#2D2F33",
                textColor: "#F8FAFF"
            }
        },
        'chat.qwen.ai': { // Также для chat.qwen.com, т.к. detectPlatform ищет по .includes()
            buttonContainer: ".chat-message-input-container-inner > div.flex.items-center.min-h-\\[56px\\]",
            textAreaSelector: "textarea#chat-input",
            insertMethod: "standard",
            buttonStyle: {
                background: "#2B2B2B",
                border: "1px solid #4A4A4A",
                hoverBackground: "#3A3A3A",
                textColor: "#E0E0E0"
            }
        }
    };
    // Добавим chat.qwen.com, если его конфигурация идентична chat.qwen.ai
    if (!PLATFORM_SETTINGS['chat.qwen.com'] && PLATFORM_SETTINGS['chat.qwen.ai']) {
        PLATFORM_SETTINGS['chat.qwen.com'] = { ...PLATFORM_SETTINGS['chat.qwen.ai'] };
    }


    // ================ GLOBAL STATE ================
    let mainMenu = null;
    let templateButton = null;
    const activeSubmenus = []; // Массив для хранения активных подменю
    let currentPlatform = null;

    // ================ STYLES ================
    GM_addStyle(`
        .template-system-container {
            position: relative;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
            z-index: 99999;
        }

        .template-main-button {
            display: flex;
            align-items: center;
            height: 36px;
            padding: 0 16px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            box-sizing: border-box;
            user-select: none;
        }

        .template-main-button:hover {
            filter: brightness(1.1);
        }

        .template-main-button::after {
            content: "▼";
            font-size: 0.7em;
            margin-left: 8px;
            opacity: 0.7;
            transition: transform 0.2s ease;
        }

        .template-main-button.active::after {
            transform: rotate(180deg);
        }

        .template-menu-wrapper {
            position: fixed; /* Позиционирование left/bottom/top будет через JS */
            min-width: 280px;
            max-height: 70vh;
            overflow-y: auto;
            /* Изначальный сдвиг для анимации "всплытия" */
            transform: translateY(10px);
            opacity: 0;
            visibility: hidden;
            /* Плавный переход для opacity и transform, visibility меняется резко с задержкой */
            transition: opacity ${GLOBAL_CONFIG.animationDuration}ms ease, transform ${GLOBAL_CONFIG.animationDuration}ms ease, visibility 0s linear ${GLOBAL_CONFIG.animationDuration}ms;
            z-index: 100000;
            pointer-events: none;
        }

        .template-menu-wrapper.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0); /* Возврат на место */
            pointer-events: all;
            transition-delay: 0s; /* Убрать задержку для visibility при показе */
        }

        .template-menu-content {
            background: #2D2E30;
            border-radius: 12px; /* Можно оставить 12px со всех сторон или 12px 12px 0 0 если всегда сверху */
            box-shadow: 0 0px 32px rgba(0,0,0,0.3); /* Тень изменена, т.к. меню может быть и снизу */
            padding: 12px 0;
            /* margin-bottom: 10px;  Убрано, т.к. позиционирование точное */
        }

        .menu-category-header {
            padding: 10px 20px 8px;
            font-size: 12px;
            font-weight: 600;
            color: #909090;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #404040;
            margin: 0 12px 6px;
        }

        .menu-item {
            position: relative;
            padding: 12px 20px;
            color: #E3E3E3;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            transition: background 0.15s ease;
            margin: 0 8px;
            border-radius: 6px;
        }

        .menu-item:hover {
            background: #3A3C3F;
        }

        .menu-item.has-submenu::after {
            content: "▶";
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #A0A0A0;
        }

        .submenu-container {
            position: fixed; /* ИЗМЕНЕНО: было absolute, теперь fixed для корректного positionSubmenu */
            background: #353638;
            min-width: 260px;
            border-radius: 8px;
            box-shadow: 4px 4px 24px rgba(0,0,0,0.3);
            padding: 8px 0;
            display: none; /* Будет 'block' при показе */
            z-index: 100001;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #252526;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: #454545;
            border-radius: 4px;
        }
    `);

    // ================ CORE FUNCTIONS ================
    function logDebug(...args) {
        if (GLOBAL_CONFIG.debugMode) {
            console.log("[ACTA]", ...args);
        }
    }

    function logError(...args) {
        if (GLOBAL_CONFIG.debugMode) {
            console.error("[ACTA]", ...args);
        }
    }

    function initializeSystem() {
        currentPlatform = detectPlatform();

        if (!currentPlatform) {
            logDebug("Platform not detected. Retrying...");
            retryInitialization();
            return;
        }

        if (!validatePlatformConfig(currentPlatform)) {
            logDebug("Platform config invalid or elements not found. Retrying...", currentPlatform);
            retryInitialization();
            return;
        }

        if (isAlreadyInitialized()) {
            logDebug("System already initialized.");
            return;
        }

        try {
            createUIElements();
            setupEventHandlers();
            logDebug("Initialization complete for platform:", window.location.hostname);
        } catch (error) {
            logError("Error during initialization:", error);
        }
    }

    function detectPlatform() {
        const hostname = window.location.hostname;
        for (const domain of Object.keys(PLATFORM_SETTINGS)) {
            if (hostname.includes(domain)) return PLATFORM_SETTINGS[domain];
        }
        return null;
    }

    function validatePlatformConfig(config) {
        if (!config || !config.buttonContainer || !config.textAreaSelector) {
            logError("Platform config is missing essential selectors.");
            return false;
        }
        const buttonContainerEl = document.querySelector(config.buttonContainer);
        const textAreaEl = document.querySelector(config.textAreaSelector);

        if (!buttonContainerEl) {
            logDebug(`Button container ("${config.buttonContainer}") not found.`);
        }
        if (!textAreaEl) {
            logDebug(`Text area ("${config.textAreaSelector}") not found.`);
        }
        return !!buttonContainerEl && !!textAreaEl;
    }

    function createUIElements() {
        const buttonHost = document.querySelector(currentPlatform.buttonContainer);
        if (!buttonHost) {
            logError("Button host container not found, cannot create UI elements.");
            return; // Добавлена проверка
        }

        const container = document.createElement("div");
        container.className = "template-system-container";

        templateButton = document.createElement("div");
        templateButton.className = "template-main-button";
        templateButton.textContent = GLOBAL_CONFIG.buttonText;

        Object.assign(templateButton.style, {
            background: currentPlatform.buttonStyle.background,
            border: currentPlatform.buttonStyle.border,
            color: currentPlatform.buttonStyle.textColor
        });
        templateButton.addEventListener('mouseenter', () => {
            if (currentPlatform.buttonStyle.hoverBackground) {
                templateButton.style.setProperty('background', currentPlatform.buttonStyle.hoverBackground, 'important');
            }
        });
        templateButton.addEventListener('mouseleave', () => {
            templateButton.style.background = currentPlatform.buttonStyle.background;
        });


        container.appendChild(templateButton);
        buttonHost.prepend(container);

        mainMenu = document.createElement("div");
        mainMenu.className = "template-menu-wrapper";

        const menuContent = document.createElement("div");
        menuContent.className = "template-menu-content";

        TEMPLATE_DATA.forEach(category => {
            const categoryHeader = document.createElement("div");
            categoryHeader.className = "menu-category-header";
            categoryHeader.textContent = category.categoryName;
            menuContent.appendChild(categoryHeader);

            category.items.forEach(item => {
                menuContent.appendChild(createMenuItem(item, 0)); // Начальная глубина 0
            });
        });

        mainMenu.appendChild(menuContent);
        document.body.appendChild(mainMenu);
    }

    function createMenuItem(itemData, depth) { // depth - глубина текущего элемента
        const itemElement = document.createElement("div");
        itemElement.className = "menu-item";
        itemElement.textContent = itemData.label;

        if (itemData.subItems && depth < GLOBAL_CONFIG.maxMenuDepth) {
            itemElement.classList.add("has-submenu");
            const submenu = createSubMenu(itemData.subItems, depth + 1); // Подменю будет на depth + 1
            setupSubmenuBehavior(itemElement, submenu, depth + 1); // Передаем глубину создаваемого подменю
        } else if (itemData.text) {
            itemElement.dataset.template = itemData.text;
        }
        return itemElement;
    }

    function createSubMenu(items, depth) {
        const submenu = document.createElement("div");
        submenu.className = "submenu-container";
        submenu.dataset.depth = depth; // Сохраняем глубину для управления

        items.forEach(item => {
            submenu.appendChild(createMenuItem(item, depth)); // Элементы подменю на той же глубине, что и само подменю
        });
        return submenu;
    }

    function removeSubmenu(submenuElement) {
        if (!submenuElement) return;
        const index = activeSubmenus.indexOf(submenuElement);
        if (index > -1) {
            activeSubmenus.splice(index, 1);
        }
        submenuElement.remove();
    }

    function closeSubmenusFromDepth(targetDepth) {
        const toRemove = [];
        for (let i = activeSubmenus.length - 1; i >= 0; i--) {
            const sub = activeSubmenus[i];
            if (parseInt(sub.dataset.depth, 10) >= targetDepth) {
                toRemove.push(sub); // Собираем для удаления
            }
        }
        toRemove.forEach(sub => removeSubmenu(sub));
    }

    function setupSubmenuBehavior(parentItem, submenu, submenuDepth) {
        parentItem.addEventListener("mouseenter", () => {
            closeSubmenusFromDepth(submenuDepth); // Закрыть подменю этого и более глубоких уровней от других веток

            document.body.appendChild(submenu); // Важно добавить в DOM до getBoundingClientRect/offsetWidth
            positionSubmenu(parentItem, submenu);
            activeSubmenus.push(submenu);
        });

        // Чтобы подменю не закрывалось при переходе с родителя на него
        let PItimer, SUtimer;
        parentItem.addEventListener("mouseleave", (e) => {
            PItimer = setTimeout(() => {
                if (!submenu.matches(':hover')) { // Если курсор не над подменю
                    removeSubmenu(submenu);
                }
            }, 100); // Небольшая задержка
        });
        submenu.addEventListener("mouseenter", () => clearTimeout(PItimer)); // Отменить закрытие, если вошли в подменю

        submenu.addEventListener("mouseleave", (e) => {
            SUtimer = setTimeout(() => {
                if (!parentItem.matches(':hover')) { // Если курсор не над родительским элементом
                    removeSubmenu(submenu);
                }
            }, 100);
        });
        parentItem.addEventListener("mouseenter", () => clearTimeout(SUtimer)); // Отменить закрытие, если вернулись на родителя
    }


    function positionSubmenu(parentElement, submenu) {
        submenu.style.display = "block"; // Показать для измерения размеров
        const parentRect = parentElement.getBoundingClientRect();
        const submenuRect = submenu.getBoundingClientRect(); // Получить размеры после display: block
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = parentRect.right + 5;
        let top = parentRect.top;

        // Проверка правой границы
        if (left + submenuRect.width > viewportWidth - 10) {
            left = parentRect.left - submenuRect.width - 5;
        }
        // Если и слева не помещается (очень широкое подменю или родитель у края)
        if (left < 10) {
            left = 10;
        }

        // Проверка нижней границы
        if (top + submenuRect.height > viewportHeight - 10) {
            top = viewportHeight - submenuRect.height - 10;
        }
        // Если и сверху не помещается (очень высокое подменю или родитель у края)
        if (top < 10) {
            top = 10;
        }

        submenu.style.left = `${left}px`;
        submenu.style.top = `${top}px`;
    }

    function setupEventHandlers() {
        if (!templateButton || !mainMenu) {
            logError("Cannot setup event handlers: button or menu not created.");
            return;
        }
        templateButton.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMainMenu();
        });

        document.addEventListener("click", (e) => {
            // Проверяем, был ли клик вне кнопки И вне главного меню И вне любого активного подменю
            if (mainMenu.classList.contains("visible") &&
                !templateButton.contains(e.target) &&
                !mainMenu.contains(e.target) &&
                !activeSubmenus.some(submenu => submenu.contains(e.target))) {
                closeAllMenus();
            }
        });

        // Обработчик выбора шаблона (привязан к mainMenu, чтобы не слушать весь документ без нужды)
        mainMenu.addEventListener("click", (e) => {
            const targetItem = e.target.closest(".menu-item:not(.has-submenu)"); // Только элементы без подменю
            if (targetItem && targetItem.dataset.template) {
                insertTemplateText(targetItem.dataset.template);
                closeAllMenus();
            }
        });
        // То же для подменю (они в body, поэтому слушаем body, но проверяем класс)
        document.body.addEventListener("click", (e) => {
            const targetItem = e.target.closest(".submenu-container .menu-item:not(.has-submenu)");
            if (targetItem && targetItem.dataset.template) {
                insertTemplateText(targetItem.dataset.template);
                closeAllMenus();
            }
        });


        window.addEventListener("resize", () => { if(mainMenu.classList.contains("visible")) updateMenuPosition(); });
        window.addEventListener("scroll", () => { if(mainMenu.classList.contains("visible")) updateMenuPosition(); }, true);
    }

    function toggleMainMenu() {
        const становитсяВидимым = !mainMenu.classList.contains("visible");
        mainMenu.classList.toggle("visible");
        templateButton.classList.toggle("active");

        if (становитсяВидимым) {
            updateMenuPosition(); // Позиционируем при открытии
        } else {
            closeSubmenusFromDepth(0); // Закрыть все подменю при закрытии главного
        }
    }

    function updateMenuPosition() {
        if (!mainMenu || !mainMenu.classList.contains("visible") || !templateButton) return;

        const buttonRect = templateButton.getBoundingClientRect();
        mainMenu.style.visibility = 'hidden'; // Скрыть на время измерений, чтобы избежать мигания
        mainMenu.style.display = 'block';    // Убедиться, что display не none
        const menuHeight = mainMenu.offsetHeight;
        const menuWidth = mainMenu.offsetWidth;
        mainMenu.style.display = '';       // Вернуть как было (если был не block)
        mainMenu.style.visibility = '';    // Вернуть видимость

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 10; // Отступ от кнопки

        // Вертикальное позиционирование
        // Приоритет НАД кнопкой, если кнопка в нижней половине И есть место,
        // ИЛИ если места сверху больше, чем снизу (и снизу не хватает)
        let menuTop, menuBottom = "auto";

        if ( (buttonRect.top > viewportHeight / 2 && buttonRect.top >= menuHeight + margin) ||
            (buttonRect.top >= menuHeight + margin && (viewportHeight - buttonRect.bottom) < menuHeight + margin && (viewportHeight - buttonRect.bottom) < buttonRect.top) ) {
            // Позиционируем НАД кнопкой
            menuTop = "auto";
            menuBottom = `${viewportHeight - buttonRect.top + margin}px`;
            mainMenu.style.borderRadius = "12px 12px 0 0"; // Если меню сверху
        } else {
            // Позиционируем ПОД кнопкой
            menuTop = `${buttonRect.bottom + margin}px`;
            menuBottom = "auto";
            mainMenu.style.borderRadius = "0 0 12px 12px"; // Если меню снизу
        }
        // Коррекция, если меню выходит за пределы экрана по высоте
        if (menuTop !== "auto") {
            const topNum = parseFloat(menuTop);
            if (topNum < margin) menuTop = `${margin}px`;
            if (topNum + menuHeight > viewportHeight - margin) {
                menuTop = `${Math.max(margin, viewportHeight - menuHeight - margin)}px`;
            }
        } else if (menuBottom !== "auto") {
            const bottomNum = parseFloat(menuBottom);
            // Если mainMenu.style.bottom установлено, то top вычисляется браузером.
            // Нам нужно проверить, не уходит ли верхний край меню за пределы viewport.
            // (viewportHeight - bottomNum - menuHeight) - это будет координата top.
            if ((viewportHeight - bottomNum - menuHeight) < margin) {
                menuBottom = `${Math.max(margin, viewportHeight - menuHeight - margin)}px`;
                // Это не совсем то, это изменит bottom, что сдвинет top.
                // Лучше установить maxHeight, если не помещается
            }
        }

        mainMenu.style.top = menuTop;
        mainMenu.style.bottom = menuBottom;


        // Горизонтальное позиционирование
        if (buttonRect.left + menuWidth > viewportWidth - 20) {
            mainMenu.style.left = "auto";
            mainMenu.style.right = `${Math.max(10, viewportWidth - (buttonRect.right))}px`; // Выровнять по правому краю кнопки или по краю экрана
        } else {
            mainMenu.style.left = `${buttonRect.left}px`;
            mainMenu.style.right = "auto";
        }
    }

    function insertTemplateText(text) {
        const textArea = document.querySelector(currentPlatform.textAreaSelector);
        if (!textArea) {
            logError("Textarea not found for inserting text.");
            return;
        }

        // ИЗМЕНЕНИЕ ЗДЕСЬ: Убираем обработку плейсхолдеров с prompt
        let finalTtext = text;
        // Конец изменения

        try {
            // Запоминаем текущее значение и позицию курсора
            const start = textArea.selectionStart;
            const end = textArea.selectionEnd;
            const originalValue = textArea.value;

            // Формируем новый текст
            const newValue = originalValue.substring(0, start) + finalTtext + originalValue.substring(end);

            if (currentPlatform.insertMethod === "react") {
                insertForReact(textArea, newValue, finalTtext.length, start);
            } else if (currentPlatform.insertMethod === "advanced") {
                insertWithEvents(textArea, newValue, finalTtext.length, start);
            } else {
                standardInsert(textArea, newValue, finalTtext.length, start);
            }
        } catch (error) {
            logError("Insert error, trying fallback:", error);
            fallbackInsert(textArea, finalTtext); // В fallback передаем только сам шаблон
        }
        textArea.focus();
    }

    // Обновленные функции вставки для установки курсора после вставленного текста
    function setCursorPosition(textArea, position) {
        textArea.selectionStart = textArea.selectionEnd = position;
    }

    function insertForReact(textArea, text, insertedTextLength, originalStart) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textArea, text);
        const ev = new Event("input", { bubbles: true });
        textArea.dispatchEvent(ev);
        setCursorPosition(textArea, originalStart + insertedTextLength);
    }

    function insertWithEvents(textArea, text, insertedTextLength, originalStart) {
        // Попробуем сначала "родной" способ, как в React, на случай если он сработает
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(textArea, text);
        } else {
            textArea.value = text; // Если сеттер не нашелся, используем прямое присваивание
        }

        // Отправляем разнообразные события
        // Порядок может иметь значение
        textArea.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
        textArea.dispatchEvent(new Event('keydown', { bubbles: true, cancelable: true, key: 'a', char: 'a', keyCode: 65 })); // имитация нажатия клавиши
        textArea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, inputType: 'insertText' }));
        textArea.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true, key: 'a', char: 'a', keyCode: 65 }));
        textArea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        // textArea.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true })); // Может быть не нужно сразу блюрить

        setCursorPosition(textArea, originalStart + insertedTextLength);
        // Иногда нужно еще раз сфокусироваться после всех манипуляций
        textArea.focus();
    }

    function standardInsert(textArea, text, insertedTextLength, originalStart) {
        textArea.value = text;
        textArea.dispatchEvent(new Event("input", { bubbles: true }));
        setCursorPosition(textArea, originalStart + insertedTextLength);
    }

    function fallbackInsert(textArea, textToInsert) {
        textArea.focus();
        // document.execCommand более не рекомендуется, но может быть последним средством
        // Простая вставка в текущую позицию курсора
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        textArea.value = textArea.value.substring(0, start) + textToInsert + textArea.value.substring(end);
        setCursorPosition(textArea, start + textToInsert.length);
    }


    function closeAllMenus() {
        if (mainMenu) mainMenu.classList.remove("visible");
        if (templateButton) templateButton.classList.remove("active");
        closeSubmenusFromDepth(0); // Закрыть все подменю (глубина 0 и больше)
    }

    function retryInitialization() {
        logDebug(`Retrying initialization in ${GLOBAL_CONFIG.retryInterval}ms...`);
        setTimeout(initializeSystem, GLOBAL_CONFIG.retryInterval);
    }

    function isAlreadyInitialized() {
        return !!document.querySelector(".template-system-container");
    }

    // ================ INITIALIZATION ================
    // Запускаем инициализацию после полной загрузки страницы или с небольшой задержкой,
    // чтобы дать шанс динамическим элементам появиться.
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(initializeSystem, 500); // Небольшая задержка перед первой попыткой
    } else {
        window.addEventListener("DOMContentLoaded", () => setTimeout(initializeSystem, 500));
    }

    // MutationObserver для отслеживания изменений в DOM, если начальная инициализация не удалась
    const observer = new MutationObserver((mutations, obs) => {
        if (!isAlreadyInitialized()) {
            logDebug("DOM changed, attempting re-initialization.");
            initializeSystem(); // Попытка инициализации при изменениях DOM
        }
        // Если уже инициализировано, можно остановить наблюдение, если это целесообразно
        // else { obs.disconnect(); logDebug("System initialized, observer disconnected."); }
    });

    // Начинаем наблюдение за body, если элементы могут появляться динамически
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();