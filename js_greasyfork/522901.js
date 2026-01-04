// ==UserScript==
// @name         GetCourse ID Collector
// @namespace    https://dev-postnov.ru/
// @version      3.2.0
// @description  Виджет для сбора ID уроков и тренингов на страницах GetCourse с адаптивной контрастностью
// @author       Daniil Postnov
// @match        *://*/teach/control/stream/*
// @match        *://*/teach/control/*
// @match        *://*/teach/*
// @match        *://*/teach
// @match        *://*/teach/control
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522901/GetCourse%20ID%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/522901/GetCourse%20ID%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== ФУНКЦИИ ДЛЯ КОНТРАСТНОЙ ПОДСТАНОВКИ ЦВЕТА ======

    // Определяем яркость цвета (0...255) на основе R,G,B
    function getLuminance(colorStr) {
        // Ищем в формате rgb(...) / rgba(...)
        const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (!rgbMatch) {
            // Если фон не найден (transparent и т.д.), возвращаем белую яркость
            return 255;
        }
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);

        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Возвращаем пару (bg, text) для контрастной плашки
    function getContrastingColors(parentBgColor) {
        const lum = getLuminance(parentBgColor);

        const lightBg = '#F0F0F0';
        const lightText = '#000000';
        const darkBg = '#333333';
        const darkText = '#FFFFFF';

        // Выбираем «тёмная плашка» при светлом фоне, и наоборот
        if (lum > 127) {
            return {
                bg: darkBg,
                text: darkText
            };
        } else {
            return {
                bg: lightBg,
                text: lightText
            };
        }
    }

    // ====== DEBOUNCE ======
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ====== СЕЛЕКТОРЫ И ОБЩИЕ ПЕРЕМЕННЫЕ ======

    const LESSON_SELECTORS = [
        '.lesson-list li a',
        '.lesson-is-hidden',
        '[onclick*="/teach/control/lesson/view/id/"]'
    ].join(', ');

    // Получение настроек
    let wrapSymbols = GM_getValue('wrapSymbols', '');

    let isUpdating = false; // флаг для защиты от рекурсии

    // ====== EXTRACT ID ======
    function extractId(element) {
        let id = null;

        if (element.href) {
            const match = element.href.match(/\/id\/(\d+)/);
            if (match) id = match[1];
        }
        if (!id && element.getAttribute('onclick')) {
            const match = element.getAttribute('onclick').match(/\/id\/(\d+)/);
            if (match) id = match[1];
        }
        return id;
    }

    // Получение символов обрамления
    function getWrapSymbols() {
        // Получаем строку с символами
        const symbols = GM_getValue('wrapSymbols', '');
        
        // Если строка пустая, возвращаем пустые символы
        if (!symbols) return { left: '', right: '' };
        
        // Если строка содержит один символ, используем его с обеих сторон
        if (symbols.length === 1) return { left: symbols, right: symbols };
        
        // Иначе берем первый символ для левой части, второй для правой
        return { 
            left: symbols.charAt(0), 
            right: symbols.charAt(1) 
        };
    }

    // Функция для форматирования ID согласно настройкам
    function formatId(id) {
        if (!id) return null;
        const { left, right } = getWrapSymbols();
        return `${left}${id}${right}`;
    }

    // Функция для форматирования ID с одинарными символами обрамления
    function formatIdSingle(id) {
        if (!id) return null;
        const { left, right } = getWrapSymbols();
        return `${left}${id}${right}`;
    }

    // Функция для извлечения числового ID из форматированной строки
    function getCleanId(idStr) {
        // Извлекаем только числовое значение ID, отбрасывая кавычки и другие символы
        const match = idStr.match(/(\d+)/);
        return match ? match[1] : idStr;
    }

    // ====== ДОБАВЛЕНИЕ МЕТКИ ID ======
    function createIdLabel(id, parentElement) {
        const label = document.createElement('span');
        label.className = 'id-label';
        label.textContent = `ID: ${id}`;
        label.title = 'Нажмите, чтобы скопировать';

        // Определяем цвет фона родителя и выставляем контрастный
        const computedStyle = window.getComputedStyle(parentElement);
        const bgColorParent = computedStyle.backgroundColor;
        const {
            bg,
            text
        } = getContrastingColors(bgColorParent);

        label.style.backgroundColor = bg;
        label.style.color = text;

        // Клик по плашке (копирование)
        label.addEventListener('click', () => {
            GM_setClipboard(formatIdSingle(id));
            label.textContent = 'Скопировано!';
            setTimeout(() => {
                label.textContent = `ID: ${id}`;
            }, 1000);
        });

        return label;
    }

    // ====== ПОКАЗ ID ======
    function showIds() {
        if (isUpdating) return;
        isUpdating = true;

        try {
            // Удаляем старые плашки
            document.querySelectorAll('.id-label').forEach(label => label.remove());

            // ТРЕНИНГИ
            document.querySelectorAll('.training-row a').forEach(link => {
                const id = extractId(link);
                if (id) {
                    const td = link.closest('td');
                    if (td) {
                        const label = createIdLabel(id, td);
                        td.appendChild(label);
                    }
                }
            });

            // УРОКИ
            document.querySelectorAll(LESSON_SELECTORS).forEach(element => {
                const id = extractId(element);
                if (id) {
                    // 1) Пытаемся найти <td>
                    let container = element.closest('td');

                    // 2) Если нет <td>, пробуем найти <li>
                    if (!container) {
                        container = element.closest('li');
                    }

                    // 3) Если и <li> нет, как fallback берём родителя
                    if (!container) {
                        container = element.parentElement;
                    }

                    if (container) {
                        const label = createIdLabel(id, container);
                        container.appendChild(label);
                    }
                }
            });

        } catch (error) {
            console.error('Error in showIds:', error);
            GM_notification('Произошла ошибка при обновлении ID', 'GetCourse Widget');
        } finally {
            isUpdating = false;
        }
    }

    // ====== ОБРАБОТЧИК MUTATION OBSERVER ======
    const observer = new MutationObserver(
        debounce((mutations) => {
            const hasRelevantChanges = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType !== 1) return false;
                    const isOurElement =
                        node.classList?.contains('id-label') ||
                        node.classList?.contains('get-id-widget-panel') ||
                        node.classList?.contains('get-id-widget-tooltip') ||
                        node.classList?.contains('get-id-widget-settings');
                    return !isOurElement;
                });
            });
            if (hasRelevantChanges && !isUpdating) {
                if (!document.querySelector('.get-id-widget-panel')) {
                    addWidget();
                }
                showIds();
            }
        }, 100)
    );

    // Функция для закрытия окон интерфейса
    function closeWidgetWindows() {
        // Закрываем буфер если открыт
        const tooltip = document.querySelector('.get-id-widget-tooltip');
        if (tooltip && tooltip.classList.contains('show')) {
            tooltip.classList.remove('show');
            tooltip.style.display = 'none';
            const viewButton = document.querySelector('.get-id-widget-panel button:nth-child(2)');
            if (viewButton) viewButton.textContent = 'Посмотреть буфер';
        }
        
        // Закрываем настройки если открыты
        const settings = document.querySelector('.get-id-widget-settings');
        if (settings) {
            settings.remove();
        }
    }

    // ====== НАСТРОЙКИ ВИДЖЕТА ======
    function showSettings() {
        // Сначала закроем все окна
        closeWidgetWindows();
        
        // Создаем панель настроек
        const settings = document.createElement('div');
        settings.className = 'get-id-widget-settings';
        
        // Текущие значения
        const currentWrapSymbols = GM_getValue('wrapSymbols', '');
        
        // HTML для настроек
        settings.innerHTML = `
            <div class="settings-header">Настройки</div>
            <div class="settings-row">
                <label for="wrap-symbols">Символы обрамления:</label>
                <input type="text" id="wrap-symbols" 
                       value="${currentWrapSymbols}" 
                       placeholder="«»  ''  "">
            </div>
            <div class="settings-info">
                Оставьте поле пустым, чтобы копировать ID без обрамления
            </div>
            <div class="settings-buttons">
                <button id="save-settings">Сохранить</button>
                <button id="cancel-settings">Отмена</button>
            </div>
        `;
        
        // Добавляем в общий контейнер
        const widgetContainer = document.querySelector('.get-id-widget-container');
        if (widgetContainer) {
            widgetContainer.appendChild(settings);
        } else {
            document.body.appendChild(settings);
        }
        
        // Обработчики для кнопок
        document.getElementById('save-settings').addEventListener('click', () => {
            const newWrapSymbols = document.getElementById('wrap-symbols').value;
            
            // Сохраняем в хранилище
            GM_setValue('wrapSymbols', newWrapSymbols);
            
            // Обновляем глобальные переменные
            wrapSymbols = newWrapSymbols;
            
            // Уведомление и закрытие
            GM_notification('Настройки сохранены', 'GetCourse Widget');
            settings.remove();
            
            // Обновляем отображение ID на странице
            showIds();
            
            // Если открыт буфер, обновляем его содержимое с новым форматированием
            const tooltip = document.querySelector('.get-id-widget-tooltip');
            if (tooltip && tooltip.classList.contains('show')) {
                navigator.clipboard.readText()
                    .then(currentText => {
                        // Извлекаем и снова форматируем ID с новыми символами
                        const currentIds = parseClipboardContent(currentText);
                        
                        // Переформатируем ID с новыми символами
                        const updatedTrainingIds = currentIds.trainings
                            .map(id => getCleanId(id))
                            .map(id => formatIdSingle(id));
                            
                        const updatedLessonIds = currentIds.lessons
                            .map(id => getCleanId(id))
                            .map(id => formatIdSingle(id));
                        
                        // Формируем новый текст буфера
                        let clipboardText = '';
                        if (updatedTrainingIds.length > 0) {
                            clipboardText += `/* Тренинги */\n${updatedTrainingIds.join(', ')}`;
                        }
                        if (updatedLessonIds.length > 0) {
                            if (clipboardText) clipboardText += '\n\n';
                            clipboardText += `/* Уроки */\n${updatedLessonIds.join(', ')}`;
                        }
                        
                        // Обновляем буфер обмена и tooltip
                        if (clipboardText) {
                            GM_setClipboard(clipboardText);
                            updateTooltipContent(clipboardText);
                        }
                    })
                    .catch(() => {
                        // Ничего не делаем, если не удалось прочитать буфер
                    });
            }
        });
        
        document.getElementById('cancel-settings').addEventListener('click', () => {
            settings.remove();
        });
    }

    // ====== ДОБАВЛЕНИЕ ПАНЕЛИ И ТУЛТИПА ======
    function addWidget() {
        if (document.querySelector('.get-id-widget-panel')) return;

        // Создаем общий контейнер для всех элементов интерфейса
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'get-id-widget-container';
        document.body.appendChild(widgetContainer);

        const panel = document.createElement('div');
        panel.className = 'get-id-widget-panel';

        const copyButton = document.createElement('button');
        const viewButton = document.createElement('button');
        const settingsButton = document.createElement('button');

        copyButton.textContent = 'Скопировать ID';
        viewButton.textContent = 'Посмотреть буфер';
        settingsButton.textContent = '';

        panel.appendChild(copyButton);
        panel.appendChild(viewButton);
        panel.appendChild(settingsButton);
        widgetContainer.appendChild(panel);

        // Тултип для буфера
        const tooltip = document.createElement('div');
        tooltip.className = 'get-id-widget-tooltip';
        widgetContainer.appendChild(tooltip);

        // Вызываем applyStyles()
        applyStyles();

        // ------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ -------
        function updateButtonText(button, text, isError = false) {
            button.textContent = text;
            button.style.backgroundColor = isError ? '#f44336' : '#386278';
        }

        function getUniqueArray(arr) {
            // Сначала очищаем ID от обрамления и приводим к числовому виду
            const cleanIds = arr.map(idStr => getCleanId(idStr));
            // Затем ищем уникальные числовые ID
            const uniqueCleanIds = [...new Set(cleanIds)];
            // Затем форматируем их обратно согласно текущим настройкам
            return uniqueCleanIds.map(id => formatIdSingle(id));
        }

        // Парсинг буфера
        function parseClipboardContent(content) {
            const result = {
                trainings: [],
                lessons: []
            };

            const trainingsMatch = content.match(/\/\* Тренинги \*\/([\s\S]*?)(?=\/\* Уроки \*\/|$)/);
            if (trainingsMatch) {
                const trainingsContent = trainingsMatch[1].trim();
                if (trainingsContent) {
                    result.trainings = trainingsContent.split(/,\s*/).filter(id => id.length > 0);
                }
            }

            const lessonsMatch = content.match(/\/\* Уроки \*\/([\s\S]*)/);
            if (lessonsMatch) {
                const lessonsContent = lessonsMatch[1].trim();
                if (lessonsContent) {
                    result.lessons = lessonsContent.split(/,\s*/).filter(id => id.length > 0);
                }
            }
            return result;
        }

        // ------- ОБРАБОТЧИКИ СОБЫТИЙ -------
        // Копирование
        copyButton.addEventListener('click', () => {
            updateButtonText(copyButton, 'Собираем ID...');

            try {
                const trainingLinks = document.querySelectorAll('.training-row a');
                const newTrainingIds = Array.from(trainingLinks)
                    .map(link => extractId(link))
                    .filter(Boolean)
                    .map(id => formatIdSingle(id));

                const newLessonIds = Array.from(document.querySelectorAll(LESSON_SELECTORS))
                    .map(el => extractId(el))
                    .filter(Boolean)
                    .map(id => formatIdSingle(id));

                navigator.clipboard.readText()
                    .then(currentText => {
                        const currentIds = parseClipboardContent(currentText);
                        const updatedTrainingIds = getUniqueArray([...currentIds.trainings, ...newTrainingIds]);
                        const updatedLessonIds = getUniqueArray([...currentIds.lessons, ...newLessonIds]);

                        let clipboardText = '';
                        if (updatedTrainingIds.length > 0) {
                            clipboardText += `/* Тренинги */\n${updatedTrainingIds.join(', ')}`;
                        }
                        if (updatedLessonIds.length > 0) {
                            if (clipboardText) clipboardText += '\n\n';
                            clipboardText += `/* Уроки */\n${updatedLessonIds.join(', ')}`;
                        }
                        if (!clipboardText) {
                            clipboardText = 'Не найдено ID для копирования';
                        }

                        GM_setClipboard(clipboardText);
                        GM_notification('ID скопированы!', 'GetCourse Widget');
                        updateButtonText(copyButton, 'Скопировано');
                        setTimeout(() => updateButtonText(copyButton, 'Скопировать ID'), 3000);

                        // Обновим тултип если он открыт
                        if (tooltip.classList.contains('show')) {
                            updateTooltipContent(clipboardText);
                        }
                    })
                    .catch(() => {
                        updateButtonText(copyButton, 'Ошибка чтения буфера ❌', true);
                        setTimeout(() => updateButtonText(copyButton, 'Скопировать ID'), 3000);
                    });
            } catch (error) {
                console.error('Error copying IDs:', error);
                updateButtonText(copyButton, 'Ошибка ❌', true);
                setTimeout(() => updateButtonText(copyButton, 'Скопировать ID'), 3000);
            }
        });

        // Функция обновления содержимого тултипа с кнопкой очистки
        function updateTooltipContent(content) {
            if (!content || content === 'Не найдено ID для копирования' || content === 'Буфер обмена пуст') {
                tooltip.innerHTML = `
                <div class="tooltip-wrapper">
                    <button class="clear-buffer-btn disabled">
                        <div class="clear-button-content">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjEwLjAwMDIiIGN5PSI0LjU4MzMzIiByeD0iNi42NjY2NyIgcnk9IjIuMDgzMzMiIHN0cm9rZT0iI0Q3MDIwMiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE2LjY1NzggNC42ODk5OUMxNi42NTc4IDQuNjg5OTkgMTUuNjcxMiAxMS44MTYgMTUuMjIwMiAxNS4wNzQ2QzE1LjA4MTYgMTYuMTEzMyAxNC4zMDY3IDE2Ljk1MzYgMTMuMjgyNiAxNy4xNzU3QzExLjExNTQgMTcuNjA4MSA4Ljg4NDEzIDE3LjYwODEgNi43MTY5MyAxNy4xNzU3QzUuNjkyODYgMTYuOTUzNiA0LjkxNzk1IDE2LjExMzMgNC43NzkzNyAxNS4wNzQ2QzQuMzI4MzcgMTEuODE2IDMuMzQxOCA0LjY4OTk0IDMuMzQxOCA0LjY4OTk0IiBzdHJva2U9IiNENzAyMDIiIHN0cm9rZS13aWR0aD0iMS4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS42NjY3IDEzLjMzMzNWMTAiIHN0cm9rZT0iI0Q3MDIwMiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTguMzMzMTcgMTMuMzMzM1YxMCIgc3Ryb2tlPSIjRDcwMjAyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" class="trash-icon" alt="Корзина" />
                            <span class="clear-text">Очистить буфер</span>
                        </div>
                    </button>
                    <div class="tooltip-content">Буфер обмена пуст</div>
                </div>
                `;
                return;
            }
            
            // Иконка корзины в формате base64
            const trashIcon = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjEwLjAwMDIiIGN5PSI0LjU4MzMzIiByeD0iNi42NjY2NyIgcnk9IjIuMDgzMzMiIHN0cm9rZT0iI0Q3MDIwMiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE2LjY1NzggNC42ODk5OUMxNi42NTc4IDQuNjg5OTkgMTUuNjcxMiAxMS44MTYgMTUuMjIwMiAxNS4wNzQ2QzE1LjA4MTYgMTYuMTEzMyAxNC4zMDY3IDE2Ljk1MzYgMTMuMjgyNiAxNy4xNzU3QzExLjExNTQgMTcuNjA4MSA4Ljg4NDEzIDE3LjYwODEgNi43MTY5MyAxNy4xNzU3QzUuNjkyODYgMTYuOTUzNiA0LjkxNzk1IDE2LjExMzMgNC43NzkzNyAxNS4wNzQ2QzQuMzI4MzcgMTEuODE2IDMuMzQxOCA0LjY4OTk0IDMuMzQxOCA0LjY4OTk0IiBzdHJva2U9IiNENzAyMDIiIHN0cm9rZS13aWR0aD0iMS4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS42NjY3IDEzLjMzMzNWMTAiIHN0cm9rZT0iI0Q3MDIwMiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTguMzMzMTcgMTMuMzMzM1YxMCIgc3Ryb2tlPSIjRDcwMjAyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" class="trash-icon" alt="Корзина" />`;
            
            tooltip.innerHTML = `
                <div class="tooltip-wrapper">
                    <button class="clear-buffer-btn">
                        <div class="clear-button-content">
                            ${trashIcon}
                            <span class="clear-text">Очистить буфер</span>
                        </div>
                    </button>
                    <div class="tooltip-content">${content}</div>
                </div>
            `;

            // Добавляем обработчик для кнопки очистки
            const clearButton = tooltip.querySelector('.clear-buffer-btn');
            if (clearButton) {
                clearButton.addEventListener('click', function() {
                    // Проверяем, идет ли уже обратный отсчет
                    if (this.classList.contains('countdown')) return;
                    
                    // Добавляем класс для отсчета
                    this.classList.add('countdown');
                    
                    // Получаем контент кнопки и делаем его полупрозрачным
                    const buttonContent = this.querySelector('.clear-button-content');
                    buttonContent.classList.add('dimmed');
                    
                    // Меняем текст на "Да, точно очистить"
                    const clearText = this.querySelector('.clear-text');
                    clearText.textContent = 'Да, точно очистить';
                    
                    // Добавляем таймер
                    const timerSpan = document.createElement('span');
                    timerSpan.className = 'timer';
                    timerSpan.textContent = '3s';
                    this.appendChild(timerSpan);
                    
                    let secondsLeft = 3;
                    const timer = this.querySelector('.timer');
                    
                    // Запускаем обратный отсчет
                    const countdownInterval = setInterval(() => {
                        secondsLeft--;
                        timer.textContent = secondsLeft + 's';
                        
                        if (secondsLeft <= 0) {
                            clearInterval(countdownInterval);
                            // Восстанавливаем исходный вид кнопки, но оставляем текст "Да, точно очистить"
                            this.classList.remove('countdown');
                            buttonContent.classList.remove('dimmed');
                            timer.remove();
                            
                            // Добавляем обработчик для реального удаления
                            this.addEventListener('click', function onceDelete() {
                                GM_setClipboard('');
                                GM_notification('Буфер обмена очищен!', 'GetCourse Widget');
                                // Полностью обновляем интерфейс для пустого буфера
                                updateTooltipContent('');
                                // Удаляем этот одноразовый обработчик
                                this.removeEventListener('click', onceDelete);
                            }, { once: true }); // once: true - обработчик выполнится только один раз
                        }
                    }, 1000);
                });
            }
        }

        // Просмотр буфера
        viewButton.addEventListener('click', () => {
            // Закрываем настройки если открыты
            const settings = document.querySelector('.get-id-widget-settings');
            if (settings) settings.remove();
            
            if (tooltip.classList.contains('show')) {
                tooltip.classList.remove('show');
                tooltip.style.display = 'none';
                viewButton.textContent = 'Посмотреть буфер';
            } else {
                navigator.clipboard.readText()
                    .then(bufferContent => {
                        updateTooltipContent(bufferContent);
                        tooltip.classList.add('show');
                        tooltip.style.display = 'block';
                        tooltip.style.maxHeight = `${window.innerHeight - 100}px`;
                        tooltip.style.overflowY = 'auto';
                        viewButton.textContent = 'Закрыть буфер';
                    })
                    .catch(() => {
                        tooltip.innerHTML = '<div class="tooltip-content">Ошибка чтения буфера</div>';
                        tooltip.classList.add('show');
                        tooltip.style.display = 'block';
                        viewButton.textContent = 'Закрыть буфер';
                    });
            }
        });
        
        // Кнопка настроек
        settingsButton.addEventListener('click', showSettings);
    }

    // ====== applyStyles() (CSS-ЧАСТЬ ОПУЩЕНА) ======
    // Функция для применения стилей
    function applyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
.lesson-list li {
  position: relative !important;
}

      /* Общий контейнер для элементов интерфейса */
      .get-id-widget-container {
        position: fixed !important;
        top: 20px !important;
        right: 50% !important;
        transform: translateX(50%) !important;
        z-index: 999999 !important;
        font-family: 'Manrope', 'Roboto', sans-serif !important;
        width: 600px !important;
      }

      /* Панель виджета */
      .get-id-widget-panel {
        width: auto;
        background-color: #333D46 !important;
        border-radius: 16px !important;
        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2) !important;
        display: flex !important;
        align-items: center !important;
        padding: 13px 15px !important;
        gap: 15px !important;
        backdrop-filter: blur(5px) !important;
        justify-content: space-between !important;
      }

      /* Стили кнопок */
      .get-id-widget-panel button {
        background-color: #386278 !important;
        color: #fff !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 6px 11px !important;
        font-size: 18px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 5px !important;
        margin: 0 !important;
        font-family: 'Manrope', 'Roboto', sans-serif !important;
        line-height: 1.366em !important;
      }

      /* Дизайн кнопки копирования */
      .get-id-widget-panel button:nth-child(1) {
        width: 310px !important;
        height: 47px !important;
        flex-grow: 0 !important;
      }
      
      /* Добавляем иконку для кнопки копирования */
      .get-id-widget-panel button:nth-child(1)::before {
        content: "" !important;
        display: inline-block !important;
        width: 24px !important;
        height: 24px !important;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjUgMTAuNVY4Ljc1QzEwLjUgOC4wNTk2NCAxMS4wNTk2IDcuNSAxMS43NSA3LjVIMTUuNzVDMTYuNDQwNCA3LjUgMTcgOC4wNTk2NCAxNyA4Ljc1VjEzLjI1QzE3IDEzLjk0MDQgMTYuNDQwNCAxNC41IDE1Ljc1IDE0LjVIMTMuNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cmVjdCB4PSI3IiB5PSIxMC41IiB3aWR0aD0iNi41IiBoZWlnaHQ9IjciIHJ4PSIxLjI1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxyZWN0IHg9IjMiIHk9IjMuNSIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K') !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }

      /* Дизайн кнопки просмотра буфера */
      .get-id-widget-panel button:nth-child(2) {
        background-color: #3D505D !important;
        width: 200px !important;
        height: 47px !important;
        border: none !important;
      }

      /* Дизайн кнопки настроек */
      .get-id-widget-panel button:nth-child(3) {
        background-color: #3D505D !important;
        width: 50px !important;
        height: 47px !important;
        border: none !important;
        padding: 6px 11px !important;
        font-size: 0 !important; /* Убираем текст */
      }
      
      /* Добавляем иконку настроек */
      .get-id-widget-panel button:nth-child(3)::before {
        content: "" !important;
        display: inline-block !important;
        width: 24px !important;
        height: 24px !important;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjY1MzA0IDE5LjEzNjZMMTAuMTc5MyAyMC4zMjAxQzEwLjQ5ODkgMjEuMDM5OCAxMS4yMTI1IDIxLjUwMzYgMTIgMjEuNTAzNlYyMS41MDM2QzEyLjc4NzUgMjEuNTAzNiAxMy41MDEyIDIxLjAzOTggMTMuODIwOCAyMC4zMjAxTDE0LjM0NyAxOS4xMzY2QzE0LjUzNDMgMTguNzE2NyAxNC44NDk0IDE4LjM2NjYgMTUuMjQ3NCAxOC4xMzYyVjE4LjEzNjJDMTUuNjQ3OCAxNy45MDUyIDE2LjExMTEgMTcuODA2OCAxNi41NzA5IDE3Ljg1NTFMMTcuODU4NSAxNy45OTIxQzE4LjY0MTUgMTguMDc1IDE5LjM5OTggMTcuNjg4NyAxOS43OTMzIDE3LjAwNjdWMTcuMDA2N0MyMC4xODcyIDE2LjMyNTEgMjAuMTQyNSAxNS40NzUzIDE5LjY3OTIgMTQuODM4OEwxOC45MTY5IDEzLjc5MTRDMTguNjQ1NSAxMy40MTU2IDE4LjUwMDQgMTIuOTYzNCAxOC41MDI3IDEyLjQ5OThWMTIuNDk5OEMxOC41MDI2IDEyLjAzNzYgMTguNjQ5IDExLjU4NzIgMTguOTIwOSAxMS4yMTMzTDE5LjY4MzIgMTAuMTY1OUMyMC4xNDY1IDkuNTI5MzYgMjAuMTkxMyA4LjY3OTU4IDE5Ljc5NzMgNy45OTc5N1Y3Ljk5Nzk3QzE5LjQwMzggNy4zMTU5NSAxOC42NDU1IDYuOTI5NzQgMTcuODYyNSA3LjAxMjU2TDE2LjU3NDkgNy4xNDk2MkMxNi4xMTUxIDcuMTk3OSAxNS42NTE4IDcuMDk5NSAxNS4yNTE0IDYuODY4NVY2Ljg2ODVDMTQuODUyNiA2LjYzNjgzIDE0LjUzNzQgNi4yODQ4OCAxNC4zNTEgNS44NjMwOEwxMy44MjA4IDQuNjc5NTlDMTMuNTAxMiAzLjk1OTg0IDEyLjc4NzUgMy40OTYwOSAxMiAzLjQ5NjA5VjMuNDk2MDlDMTEuMjEyNSAzLjQ5NjA5IDEwLjQ5ODkgMy45NTk4NCAxMC4xNzkzIDQuNjc5NTlMOS42NTMwNCA1Ljg2MzA4QzkuNDY2NiA2LjI4NDg4IDkuMTUxNDIgNi42MzY4MyA4Ljc1MjY3IDYuODY4NVY2Ljg2ODVDOC4zNTIxOSA3LjA5OTUgNy44ODg5MSA3LjE5NzkgNy40MjkxMSA3LjE0OTYyTDYuMTM3NTggNy4wMTI1NkM1LjM1NDU2IDYuOTI5NzQgNC41OTYyNSA3LjMxNTk1IDQuMjAyNzcgNy45OTc5N1Y3Ljk5Nzk3QzMuODA4NzggOC42Nzk1OCAzLjg1MzQ5IDkuNTI5MzYgNC4zMTY4MiAxMC4xNjU5TDUuMDc5MTQgMTEuMjEzM0M1LjM1MSAxMS41ODcyIDUuNDk3MzkgMTIuMDM3NiA1LjQ5NzMxIDEyLjQ5OThWMTIuNDk5OEM1LjQ5NzM5IDEyLjk2MjEgNS4zNTEgMTMuNDEyNSA1LjA3OTE0IDEzLjc4NjRMNC4zMTY4MiAxNC44MzM4QzMuODUzNDkgMTUuNDcwMyAzLjgwODc4IDE2LjMyMDEgNC4yMDI3NyAxNy4wMDE3VjE3LjAwMTdDNC41OTY2MSAxNy42ODMzIDUuMzU0NjYgMTguMDY5NCA2LjEzNzU4IDE3Ljk4NzFMNy40MjUxMSAxNy44NTAxQzcuODg0OTEgMTcuODAxOCA4LjM0ODE5IDE3LjkwMDIgOC43NDg2NiAxOC4xMzEyVjE4LjEzMTJDOS4xNDg5MSAxOC4zNjIyIDkuNDY1NTUgMTguNzE0MiA5LjY1MzA0IDE5LjEzNjZWMTkuMTM2NloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjExLjk5OTciIGN5PSIxMi40OTk3IiByPSIyLjY0ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==') !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }

      /* Эффект наведения на кнопки */
      .get-id-widget-panel button:hover {
        opacity: .9 !important;
      }

      /* Тултип для отображения буфера */
      .get-id-widget-tooltip {
        width: 100% !important;
        display: none !important;
        background-color: #fff !important;
        color: #222 !important;
        padding: 0 16px !important;
        border-radius: 8px !important;
        font-size: 14px !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
        white-space: pre-line !important;
        z-index: 999999 !important;
        margin-top: 10px !important;
      }

      /* Видимость тултипа */
      .get-id-widget-tooltip.show {
        display: block !important;
      }
      
      /* Обертка для контента и кнопки */
      .tooltip-wrapper {
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
      }

      /* Содержимое тултипа */
      .tooltip-content {
        flex: 1 !important;
        max-height: none !important;
        overflow-y: visible !important;
        padding: 10px;
        background: #efefef;
        border-radius: 12px;        
      }
      
      /* Кнопка очистки буфера */
      .clear-buffer-btn {
        width: max-content !important;
        height: auto !important;
        min-width: auto !important;
        padding: 8px 10px !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        background-color: #FFF6F6 !important;
        color: #D70202 !important;
        font-size: 14px !important;
        display: flex !important;
        justify-content: flex-start !important;
        align-items: center !important;
        transition: all 0.2s !important;
        position: relative !important;
        gap: 5px !important;
        font-family: Inter, sans-serif !important;
        font-weight: 400 !important;
        letter-spacing: -0.03em !important;
        line-height: 1.3 !important;
      }
      
      /* Отключенная кнопка */
      .clear-buffer-btn.disabled {
        background-color: #F5F5F5 !important;
        cursor: default !important;
      }

      .clear-buffer-btn.disabled {
        pointer-events: none !important;
        user-select: none !important;
      }
      
      .clear-buffer-btn.disabled .clear-button-content {
        opacity: 0.5 !important;
      }
      
      /* Содержимое кнопки */
      .clear-button-content {
        display: flex !important;
        align-items: center !important;
        gap: 5px !important;
        font-size: 16px !important; 
      }
      
      /* Полупрозрачное содержимое */
      .clear-button-content.dimmed {
        opacity: 0.3 !important;
        pointer-events: none !important;
      }
      
      /* Иконка корзины */
      .trash-icon {
        width: 20px !important;
        height: 20px !important;
      }

      .clear-buffer-btn.disabled .trash-icon,
      .clear-buffer-btn.disabled .clear-text {
        filter: grayscale(1);
      }
      
      /* Текст очистки */
      .clear-text {
        display: inline-block !important;
      }
      
      /* Таймер */
      .timer {
        display: inline-block !important;
        font-weight: 400 !important;
        margin-left: 10px !important;
        color: #D70202 !important;
        // position: absolute !important;
        // right: 8px !important;
      }
      
      .clear-buffer-btn:hover {
        background-color: #ffebeb !important;
      }

      /* Стили для плашек с ID */
      .id-label {
      position: absolute !important;
      right: 20px !important;
      bottom: 20px !important;
        display: inline-block !important;
        margin-left: 10px !important;
        padding: 4px 10px !important;
        border-radius: 4px !important;
        color: #000;
        font-size: 14px !important;
        cursor: pointer !important;
        transition: opacity 0.2s ease-out !important;
        z-index: 100 !important;
        width: max-content !important;
        transform: translateZ(0) !important;
      }

      /* Эффект наведения на плашки */
      .id-label:hover {
        opacity: 0.8 !important;
      }

      /* Убираем прозрачность у training-row, чтобы ID были видны */
      .training-row td a {
        opacity: 1 !important;
      }

      /* Стили для ID внутри скрытых уроков */
      .lesson-is-hidden .id-label {
        margin-left: 5px !important;
        vertical-align: middle !important;
      }
      
      /* Стили для панели настроек */
      .get-id-widget-settings {
        position: fixed !important;
        top: 80px !important;
        right: 20px !important;
        background-color: white !important;
        padding: 15px !important;
        border-radius: 8px !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
        z-index: 9999999 !important;
        width: 300px !important;
      }
      
      .settings-header {
        font-size: 16px !important;
        font-weight: bold !important;
        margin-bottom: 15px !important;
        color: #333 !important;
      }
      
      .settings-row {
        margin-bottom: 10px !important;
        display: flex !important;
        flex-direction: column !important;
      }
      
      .settings-row label {
        margin-bottom: 5px !important;
        font-size: 14px !important;
        color: #444 !important;
      }
      
      .settings-row input {
        padding: 8px !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        font-size: 14px !important;
      }
      
      .settings-info {
        font-size: 12px !important;
        color: #666 !important;
        margin-bottom: 15px !important;
      }
            
      .settings-buttons {
        display: flex !important;
        justify-content: space-between !important;
      }
      
      .settings-buttons button {
        padding: 8px 15px !important;
        border: none !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        cursor: pointer !important;
      }
      
      #save-settings {
        background-color: #8F93FF !important;
        color: white !important;
        flex: 1 !important;
        margin-right: 8px !important;
      }
      
      #cancel-settings {
        background-color: #f5f5f5 !important;
        color: #333 !important;
        width: auto !important;
      }
      
      .settings-buttons button:hover {
        opacity: 0.9 !important;
      }
    `;
        document.head.appendChild(styleElement);
    }

    // ====== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ======
    window.addEventListener('load', () => {
        if (!document.body) {
            console.error('Body element not found');
            return;
        }
        addWidget();
        showIds();
    });

    // Подключаем observer
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();