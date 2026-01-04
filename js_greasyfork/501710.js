// ==UserScript==
// @name         Boosty Tag Formatter
// @version      1.2
// @description  Отображение тегов текстом в посте на Boosty в одну строку
// @match        https://boosty.to/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/501710/Boosty%20Tag%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/501710/Boosty%20Tag%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КАТЕГОРИЯ: СТРАТЕГИЯ РАБОТЫ СКРИПТА ---
    // 1. Ищем [data-test-id="COMMON_POST:ROOT"] (пост)
    // 2. Внутри него ищем [class*="PostTags-scss--module_root"] (контейнер тегов)
    // 3. Собираем теги, создаем свой блок
    // 4. Вставляем свой блок ПЕРЕД (2)
    // 5. Прячем (2)

    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ КОНСТАНТЫ ---
    // Этот раздел содержит константы, используемые во всем скрипте.
    // - CUSTOM_CLASS: CSS-класс, который присваивается новому, созданному нами блоку с тегами.
    //                 (В данной версии скрипта не используется для стилизации, но полезен для отладки).
    const CUSTOM_CLASS = 'custom-tags-added';

    // --- КАТЕГОРИЯ: ОСНОВНАЯ ЛОГИКА (ОБРАБОТКА ПОСТА) ---
    // Эта функция отвечает за обработку одного элемента поста.
    // Она находит оригинальные теги, извлекает их текст, создает новый
    // форматированный блок и скрывает старый.
    function processPost(postElement) {
        // --- ШАГ 1: ПРОВЕРКА НА ПОВТОРНУЮ ОБРАБОТКУ ---
        // - postElement: DOM-элемент поста, который нужно обработать.
        // - postElement.dataset.tagsFormatted: Мы устанавливаем data-атрибут 'tags-formatted'
        //   в 'true' после первой обработки, чтобы избежать повторного форматирования
        //   этого же поста (например, при срабатывании MutationObserver).
        if (postElement.dataset.tagsFormatted) return;
        postElement.dataset.tagsFormatted = 'true'; // Ставим метку сразу

        // --- ШАГ 2: ПОИСК ОРИГИНАЛЬНОГО КОНТЕЙНЕРА ТЕГОВ ---
        // - tagsContainer: DOM-элемент, содержащий "пузырьки" тегов.
        //   Селектор [class*="..."] используется, т.к. Boosty использует
        //   динамически генерируемые имена классов.
        const tagsContainer = postElement.querySelector('[class*="PostTags-scss--module_root"]');

        if (!tagsContainer) {
            // Если контейнер тегов не найден, дальнейшая обработка невозможна.
            return;
        }

        // --- ШАГ 3: СБОР ТЕКСТА ТЕГОВ ---
        // - tags: NodeList (коллекция) DOM-элементов, содержащих текст каждого тега.
        //   Используется такой же "нестабильный" селектор по части класса.
        const tags = tagsContainer.querySelectorAll('[class*="PostTag-scss--module_title"]');
        if (tags.length === 0) {
            // Если тегов нет, но контейнер есть, мы все равно прячем контейнер,
            // чтобы он не занимал пустое место.
            tagsContainer.style.display = 'none';
            return;
        }

        // - tagsText: Конечная строка, содержащая все теги через запятую.
        //   Мы используем Array.from() для преобразования NodeList в массив,
        //   .map() для извлечения textContent, .trim() для очистки от пробелов,
        //   .filter() для удаления пустых тегов и .join() для объединения.
        const tagsText = Array.from(tags).map(tag => {
            return tag.textContent.trim();
        }).filter(text => text).join(', ');

        if (!tagsText) return; // На случай, если все теги были пустыми

        // --- ШАГ 4: СОЗДАНИЕ НОВОГО БЛОКА ---
        // - tagsDisplay: Новый DOM-элемент (div), который будет содержать
        //   нашу строку с тегами.
        const tagsDisplay = document.createElement('div');
        tagsDisplay.className = CUSTOM_CLASS;
        // Применяем базовые стили для отделения блока от контента
        tagsDisplay.style.marginTop = '10px';
        tagsDisplay.style.padding = '10px';
        tagsDisplay.style.borderTop = '1px solid #eee';
        tagsDisplay.innerHTML = `<strong>Теги:</strong> ${tagsText}`;

        // --- ШАГ 5: ВСТАВКА НОВОГО БЛОКА ---
        // Мы вставляем наш новый блок (tagsDisplay) в DOM
        // прямо перед старым контейнером тегов (tagsContainer).
        tagsContainer.parentNode.insertBefore(tagsDisplay, tagsContainer);

        // --- ШАГ 6: СКРЫТИЕ СТАРОГО БЛОКА ---
        // Прячем оригинальный контейнер, чтобы не было дублирования.
        tagsContainer.style.display = 'none';
    }

    // --- КАТЕГОРИЯ: НАБЛЮДАТЕЛЬ ЗА ИЗМЕНЕНИЯМИ DOM ---
    // Этот раздел отвечает за отслеживание новых постов, которые появляются
    // на странице динамически (например, при бесконечной прокрутке).
    // - observer: Экземпляр MutationObserver, который следит за DOM.
    const observer = new MutationObserver((mutations) => {
        // - mutations: Список всех изменений, произошедших с момента последней проверки.
        for (const mutation of mutations) {
            // Нас интересуют только добавленные узлы (addedNodes)
            if (mutation.addedNodes.length === 0) continue;

            // - node: Конкретный DOM-узел, который был добавлен.
            for (const node of mutation.addedNodes) {
                // Проверяем, что это узел-элемент (а не текст, комментарий и т.д.)
                if (node.nodeType === 1) { // 1 = ELEMENT_NODE
                    
                    // Сценарий 1: Добавился сам узел поста
                    if (node.matches('[data-test-id="COMMON_POST:ROOT"]')) {
                        processPost(node);
                    }
                    
                    // Сценарий 2: Добавился контейнер, ВНУТРИ которого есть посты
                    // (На случай, если посты загружаются пачкой)
                    // - newPosts: Коллекция постов, найденных внутри добавленного узла.
                    const newPosts = node.querySelectorAll('[data-test-id="COMMON_POST:ROOT"]');
                    newPosts.forEach(processPost);
                }
            }
        }
    });

    // --- КАТЕГОРИЯ: ЗАПУСК И ИНИЦИАЛИЗАЦИЯ ---
    // Этот раздел запускает выполнение скрипта.

    // 1. Первичная обработка:
    // Ищем все посты, которые уже существуют на странице в момент загрузки скрипта,
    // и обрабатываем каждый из них.
    document.querySelectorAll('[data-test-id="COMMON_POST:ROOT"]').forEach(processPost);

    // 2. Запуск наблюдателя:
    // Говорим "observer" начать следить за `document.body` (всей страницей).
    // - childList: true - следить за добавлением/удалением дочерних элементов.
    // - subtree: true - следить за изменениями на любом уровне вложенности (а не только прямых потомков body).
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();