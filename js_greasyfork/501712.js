// ==UserScript==
// @name         Boosty Image URL Cleaner
// @version      1.11
// @description  Удаление параметров mw и mh из ссылок на изображения на Boosty, если не указано "&croped",  позволяет загружать изображения-превью в оригинальном разрешении
// @match        *://*.boosty.to/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/501712/Boosty%20Image%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/501712/Boosty%20Image%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- (Этот скрипт оптимизирован для эффективности) ---
    // --- (Использует MutationObserver для обработки только НОВЫХ img) ---
    // --- (Использует Map для кэширования уже обработанных URL) ---

    // --- КАТЕГОРИЯ: КЭШИРОВАНИЕ И СОСТОЯНИЕ ---
    // Этот раздел содержит переменные, используемые для оптимизации и отслеживания состояния.
    // - urlCleanCache: Map-объект для кэширования.
    //   - Ключ: Оригинальный URL изображения.
    //   - Значение: Уже очищенный URL.
    //   - Это предотвращает повторную обработку одного и того же URL (например,
    //     одинаковых аватарок в комментариях) и значительно ускоряет скрипт.
    const urlCleanCache = new Map();

    // --- КАТЕГОРИЯ: ОСНОВНАЯ ЛОГИКА ---
    // Функции, выполняющие основную работу скрипта.

    /**
     * Принимает URL, очищает его от параметров 'mw' и 'mh',
     * если в нем нет параметра "&croped".
     * Использует кэширование для быстрого ответа.
     *
     * @param {string} url - Оригинальный URL изображения.
     * @returns {string} - Очищенный URL.
     */
    function cleanURL(url) {
        // 1. Сначала проверяем, нет ли уже готового URL в кэше
        if (urlCleanCache.has(url)) {
            return urlCleanCache.get(url);
        }

        // 2. Если в кэше нет, проводим анализ и очистку
        let urlParts = url.split('?');
        
        // Если URL вообще не содержит параметров (нет '?'),
        // он уже "чистый". Кэшируем его как есть.
        if (urlParts.length < 2) {
            urlCleanCache.set(url, url); // Кэшируем "чистый" URL (он же = оригиналу)
            return url;
        }

        let baseUrl = urlParts[0];
        // Собираем обратно строку запроса, на случай если в ней был '?'
        let queryString = urlParts.slice(1).join('?'); 
        let searchParams = new URLSearchParams(queryString);

        // 3. Главное условие:
        // Если в строке запроса есть "&croped" (или "croped" как первый параметр),
        // мы НЕ трогаем 'mw' и 'mh', т.к. они нужны для кадрирования.
        // Мы проверяем именно `queryString`, а не `searchParams.has`
        // для точного соответствия оригинальной логике (поиск подстроки).
        if (!queryString.includes('&croped') && !queryString.startsWith('croped=')) {
            // Удаляем параметры, отвечающие за ограничение размера
            searchParams.delete('mw');
            searchParams.delete('mh');
        }

        // 4. Собираем URL обратно
        const newQueryString = searchParams.toString();
        const finalUrl = newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;

        // 5. Сохраняем результат в кэш
        urlCleanCache.set(url, finalUrl);
        return finalUrl;
    }

    // --- КАТЕГОРИЯ: ОБРАБОТКА DOM ---
    // Функции, которые взаимодействуют с элементами на странице.

    /**
     * Обрабатывает один DOM-узел <img>.
     * Проверяет, является ли он целевым изображением Boosty,
     * и применяет к нему `cleanURL` для `src` и `srcset`.
     *
     * @param {Node} node - DOM-узел для проверки.
     */
    function processImage(node) {
        // Убеждаемся, что это:
        // 1. Элемент (nodeType === 1)
        // 2. Тег <img> с `src`, содержащим "boosty.to/image"
        // 3. Элемент, который мы еще не обрабатывали (нет `data-cleaned="true"`)
        // Селектор :not([data-cleaned="true"]) - ключевой для производительности.
        if (node.nodeType === 1 &&
            node.matches('img[src*="boosty.to/image"]:not([data-cleaned="true"])')) {

            // Помечаем сразу, чтобы избежать повторной обработки
            // этим же скриптом или другим колбэком MutationObserver.
            node.dataset.cleaned = 'true';

            // Чистим основной `src`
            // (cleanURL быстро возьмет из кэша, если URL уже встречался)
            if (node.src) {
                node.src = cleanURL(node.src);
            }

            // Чистим `srcset`, который используется для адаптивных изображений
            if (node.srcset) {
                // `srcset` - это строка вида "url1 100w, url2 200w, ..."
                node.srcset = node.srcset.split(',') // -> ["url1 100w", " url2 200w"]
                    .map(srcEntry => {
                        const parts = srcEntry.trim().split(' '); // -> ["url1", "100w"] или ["url2"]
                        const url = parts[0];
                        const size = parts[1] || ''; // '100w' или пустая строка
                        
                        // Чистим только URL, а дескриптор размера (size) оставляем
                        return `${cleanURL(url)} ${size}`;
                    })
                    .join(', '); // Собираем обратно в строку
            }
        }
    }

    // --- КАТЕГОРИЯ: НАБЛЮДЕНИЕ ЗА DOM И ИНИЦИАЛИЗАЦИЯ ---
    // Код, который запускает скрипт и отслеживает будущие изменения.

    // 1. Создание Наблюдателя (MutationObserver)
    // Это современный и очень эффективный способ реагировать
    // на добавление новых элементов на страницу (например, при
    // бесконечной прокрутке или открытии комментариев).
    const observer = new MutationObserver((mutations) => {
        // Перебираем все зафиксированные мутации
        for (const mutation of mutations) {
            // Нас интересуют только *добавленные* узлы
            for (const node of mutation.addedNodes) {
                // А. Если добавлен сам <img>
                // (nodeType === 1 нужен, чтобы отсеять текст, комменты и т.д.)
                if (node.nodeType === 1) {
                    processImage(node);
                }

                // Б. Если добавлен контейнер (например, <div> с постом),
                // ищем <img> *внутри* него.
                // `node.querySelectorAll` существует только у элементов.
                if (node.querySelectorAll) {
                    node.querySelectorAll('img[src*="boosty.to/image"]:not([data-cleaned="true"])')
                        .forEach(processImage);
                }
            }
        }
    });

    // 2. Запуск наблюдателя
    // Мы "прикрепляем" его к document.body и говорим:
    // - childList: true -> следи за добавлением/удалением дочерних элементов
    // - subtree: true   -> следи за всеми потомками, а не только прямыми
    observer.observe(document.body, { childList: true, subtree: true });

    // 3. Первоначальная обработка
    // Наблюдатель `observer` сработает только на *новые* элементы.
    // Эта строка находит и обрабатывает все картинки, которые
    // уже были на странице в момент запуска скрипта.
    document.querySelectorAll('img[src*="boosty.to/image"]:not([data-cleaned="true"])')
        .forEach(processImage);
})();