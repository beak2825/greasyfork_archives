// ==UserScript==
// @name         Boosty Title Modifier
// @version      0.45
// @description  Добавляет время поста в заголовок *вкладки*
// @match        https://boosty.to/*
// @grant        none
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483006/Boosty%20Title%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/483006/Boosty%20Title%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЯ ---
    // Этот раздел содержит переменные, управляющие состоянием скрипта.
    // - currentFormattedTitle: Хранит текущий, нами установленный, заголовок вкладки (например, "2023.10.26 15:30 - Название поста").
    //                         Используется "Защитником" для восстановления заголовка, если Boosty попытается его сбросить.
    // - currentPostId: ID поста (data-post-id), который в данный момент отображается и заголовок которого мы модифицировали.
    //                  Помогает избежать повторной обработки того же поста при обновлениях DOM и сбросить заголовок при уходе со страницы.
    // - titleObserver: Экземпляр MutationObserver ("Защитник"). Следит за элементом <title> и предотвращает его изменение
    //                  другими скриптами Boosty, пока мы находимся на странице поста.
    // - bodyObserver: Экземпляр MutationObserver ("Искатель"). Следит за <body> на предмет появления/исчезновения
    //                 контента поста. Он отвечает за первоначальное обнаружение данных поста и сброс состояния при уходе.
    let currentFormattedTitle = null; // Текущий отформатированный заголовок
    let currentPostId = null; // ID поста, который мы сейчас отслеживаем
    let titleObserver = null; // "Защитник" заголовка вкладки
    let bodyObserver = null; // "Искатель" контента

    // --- КАТЕГОРИЯ: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И КОНСТАНТЫ ---
    // Вспомогательные утилиты для парсинга и поиска данных.

    // - monthsRu: Словарь для преобразования сокращенных русских названий месяцев в числовой формат (MM).
    const monthsRu = { 'янв': '01', 'фев': '02', 'мар': '03', 'апр': '04', 'мая': '05', 'июн': '06', 'июл': '07', 'авг': '08', 'сент': '09', 'окт': '10', 'нояб': '11', 'дек': '12' };
    
    // - monthsEn: Словарь для преобразования сокращенных английских названий месяцев в числовой формат (MM).
    const monthsEn = { 'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12' };


    /**
     * Парсит строку даты Boosty (например, "26 окт 2023 в 15:30" или "Oct 27 12:01") в стандартизированный формат "YYYY.MM.DD HH MM".
     * @param {string} dateStr - Исходная строка даты/времени из DOM.
     * @returns {string} - Отформатированная строка или исходная строка, если парсинг не удался.
     */
    function parseBoostyDate(dateStr) {
        try {
            // Приводим к нижнему регистру и убираем запятые для унификации
            const lowerDateStr = dateStr.toLowerCase().replace(/,/g, ''); 
            const parts = lowerDateStr.split(' '); // ["oct", "27", "2023", "at", "12:01"] или ["27", "окт", "2023", "в", "12:01"] или ["27", "oct", "12:01"]

            let day, monthStr, year, time, month;

            // 1. Найти время (XX:XX)
            time = parts.find(p => p.includes(':'));
            if (!time) {
                // Если нет времени (например, "только что"), выходим
                return dateStr;
            }
            
            // 2. Найти месяц
            monthStr = parts.find(p => monthsRu[p] || monthsEn[p]);
            if (!monthStr) {
                // Если нет месяца (странный формат), выходим
                return dateStr;
            }
            
            // 3. Определить словарь месяцев
            let monthMap = monthsRu[monthStr] ? monthsRu : monthsEn;
            month = monthMap[monthStr];

            // 4. Найти день (число, которое не является годом и не содержит ":")
            day = parts.find(p => !isNaN(parseInt(p, 10)) && p.length <= 2 && !p.includes(':'));
            if (!day) {
                return dateStr; // Не нашли день
            }

            // 5. Найти год (число из 4 цифр)
            year = parts.find(p => !isNaN(parseInt(p, 10)) && p.length === 4);
            if (!year) {
                year = new Date().getFullYear(); // Если год не указан, берем текущий
            }
            
            // 6. Форматирование
            time = time.replace(/:/g, '').padStart(4, '0');
            day = day.padStart(2, '0');

            return `${year}.${month}.${day} ${time.slice(0, 2)} ${time.slice(2)}`;

        } catch (e) {
            console.error("[Title Modifier] Parse Error:", e, dateStr);
            return dateStr; // Возвращаем исходную строку в случае ошибки
        }
    }


    /**
     * Ищет элемент с датой создания поста внутри контейнера поста.
     * @param {HTMLElement} postElement - DOM-элемент поста (с [data-test-id="COMMON_POST:ROOT"]).
     * @returns {string} - Текстовое содержимое элемента времени или пустая строка.
     */
    function getPostTime(postElement) {
        // Ищем по селекторам. Сначала по data-test-id (более надежный),
        // затем по части имени класса (менее надежный, но запасной).
        const timeElement = postElement.querySelector('[data-test-id="COMMON_CREATEDAT:ROOT"]') || postElement.querySelector('[class*="CreatedAt"]');
        return timeElement?.textContent?.trim() || '';
    }

    // --- КАТЕГОРИЯ: НАБЛЮДАТЕЛИ (MUTATION OBSERVERS) ---

    /**
     * "Защитник" (Наблюдатель 1)
     * Активируется *после* того, как "Искатель" найдет пост и установит заголовок.
     * Его задача - следить за тегом <title> и немедленно отменять любые изменения,
     * которые пытаются внести скрипты Boosty (например, при скролле или других событиях SPA).
     */
    function startTitleObserver() {
        // Если старый "Защитник" активен, отключаем его.
        if (titleObserver) titleObserver.disconnect();

        const titleElement = document.querySelector('title');
        if (!titleElement) return; // Не можем найти title (маловероятно)

        titleObserver = new MutationObserver(() => {
            // Если мы сохранили наш формат заголовка И текущий заголовок в DOM *не* равен нашему
            if (currentFormattedTitle && document.title !== currentFormattedTitle) {
                // Boosty попытался сбросить заголовок!
                // 1. Немедленно отключаем "Защитника", чтобы наш следующий вызов не вызвал рекурсию.
                titleObserver.disconnect();
                // 2. Возвращаем наш правильный заголовок.
                document.title = currentFormattedTitle;
                // 3. Подключаем "Защитника" снова, чтобы продолжать следить за <title>.
                titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
            }
        });

        // Начинаем наблюдение за <title> и его дочерними узлами (текстом внутри).
        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }

    /**
     * "Искатель" (Наблюдатель 2)
     * Это основной наблюдатель, который постоянно следит за <body>.
     * Его задача - обнаружить, что пользователь перешел на страницу поста (или она загрузилась),
     * извлечь данные (ID, заголовок, время) и запустить "Защитника".
     * Он также отвечает за сброс состояния (отключение "Защитника"), когда пользователь уходит
     * со страницы поста (например, обратно в ленту).
     */
    function startBodyObserver() {
        if (bodyObserver) bodyObserver.disconnect();

        bodyObserver = new MutationObserver(() => {
            // Ищем *первый* пост в главной колонке (column-1).
            // Это гарантирует, что мы смотрим на основной контент, а не на посты в боковой панели.
            const postElement = document.querySelector('#column-1 [data-test-id="COMMON_POST:ROOT"]');

            if (!postElement) {
                // --- Сценарий 1: Пост не найден ---
                // Мы не на странице поста или ленты (например, в настройках, сообщениях).
                // Или страница еще не загрузилась.

                // Если у нас был ID отслеживаемого поста (т.е. мы *были* на странице поста)
                if (currentPostId) {
                    // Значит, мы ушли со страницы поста.
                    if (titleObserver) titleObserver.disconnect(); // Отключаем "Защитника".
                    currentPostId = null; // Сбрасываем состояние.
                    currentFormattedTitle = null;
                    // Boosty вернет свой заголовок по умолчанию (например, "Блог автора").
                }
                return; // Делать нечего.
            }

            // --- Сценарий 2: Пост найден (postElement существует) ---

            // Теперь нам нужно понять, это страница *одного* поста или лента.
            // Признак страницы поста - наличие заголовка H1.
            // (В ленте заголовки постов - H2).
            const h1Title = postElement.querySelector('h1[data-test-id="COMMON_POST_POSTCONTENT:TITLE"], h1[class*="PostSubscriptionBlock-scss--module_title"], h1[class*="Post-scss--module_title"]');
            const postId = postElement.dataset.postId; // Получаем ID поста

            if (h1Title && postId) {
                // --- Сценарий 2а: Мы на странице поста (H1 найден) ---

                // Если ID поста совпадает с тем, что мы уже обрабатывали,
                // значит, это просто внутреннее обновление DOM (например, комменты подгрузились).
                if (postId === currentPostId) {
                    return; // Ничего не делаем, "Защитник" уже работает.
                }

                // --- Это новый пост! (переход на другой пост или первая загрузка) ---
                if (titleObserver) titleObserver.disconnect(); // Отключаем старого "Защитника" (если был).

                currentPostId = postId; // Запоминаем ID нового поста.
                const rawTime = getPostTime(postElement);
                const rawTitle = h1Title.textContent.trim();

                if (rawTime && rawTitle) {
                    // Форматируем данные
                    const formattedTime = parseBoostyDate(rawTime);
                    const newTitle = `${formattedTime} - ${rawTitle}`;

                    // Устанавливаем наш заголовок
                    document.title = newTitle;
                    currentFormattedTitle = newTitle; // Сохраняем его для "Защитника"

                    // Запускаем "Защитника", чтобы этот заголовок не сбросился.
                    startTitleObserver();
                }

            } else {
                // --- Сценарий 2б: Мы в ленте (H1 не найден) ---

                // Если у нас был ID отслеживаемого поста (т.е. мы *только что* ушли со страницы поста
                // обратно в ленту, нажав "назад" или на логотип)
                if (currentPostId) {
                    // Мы ушли со страницы поста в ленту.
                    if (titleObserver) titleObserver.disconnect(); // Отключаем "Защитника".
                    currentPostId = null; // Сбрасываем состояние.
                    currentFormattedTitle = null;
                    // Boosty вернет свой заголовок (например, "Лента").
                }
                // (Если currentPostId уже null, значит мы просто скроллим ленту, ничего не делаем)
            }
        });

        // Начинаем наблюдение за всем <body> и его дочерними элементами.
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    // --- КАТЕГОРИЯ: ПЕРВЫЙ ЗАПУСК ---
    // Ждем, пока <body> будет доступен, прежде чем запускать "Искателя".
    if (document.body) {
        startBodyObserver();
    } else {
        window.addEventListener('DOMContentLoaded', startBodyObserver);
    }

})();