// ==UserScript==
// @name         Кураторы Форума общий скрипт black russia.  (BR -Счетчик тем/РП биографии)
// @namespace    http://tampermonkey.net/
// @version      2.1 (BR - Жалобы / РП биографии)
// @description  *Данный скрипт очень полезный для ГКФ/ЗГКФ/КФ
// @author       Fantom_Stark/Dany_Forbs
// @match        https://forum.blackrussia.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530712/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20black%20russia%20%20%28BR%20-%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530712/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20black%20russia%20%20%28BR%20-%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Массив стоковых цветов для дней недели
    const dayColors = {
        "Пн": "#cccccc",   // Пн (стоковый цвет)
        "Вт": "#cccccc",   // Вт
        "Ср": "#cccccc",   // Ср
        "Чт": "#cccccc",   // Чт
        "Пт": "#cccccc",   // Пт
        "Сб": "#cccccc",   // Сб
        "Вс": "#cccccc",   // Вс
    };

    // Массив цветов для изменения при наведении
    const hoverColors = {
        "Пн": "#FF5733",   // Пн
        "Вт": "#33FF57",   // Вт
        "Ср": "#3357FF",   // Ср
        "Чт": "#9C27B0",   // Чт
        "Пт": "#00BCD4",   // Пт
        "Сб": "#FFEB3B",   // Сб
        "Вс": "#8D6E63",   // Вс
    };

    // Функция для создания элемента с подсчетом
    function createCountElement(count, text, day) {
        var countElement = document.createElement('div');
        countElement.className = 'count-element';
        countElement.textContent = text + ': ' + count;

        // Получаем стоковый цвет для дня
        const color = dayColors[day] || "#cccccc";
        const hoverColor = hoverColors[day] || "#cccccc";

        // Стиль элемента с учетом стокового цвета
        countElement.style.fontFamily = 'Arial, sans-serif';
        countElement.style.fontSize = '14px';  // Уменьшаем размер шрифта
        countElement.style.color = '#ffffff';
        countElement.style.backgroundColor = color;  // Устанавливаем стоковый цвет
        countElement.style.padding = '5px';  // Уменьшаем отступы
        countElement.style.margin = '2px 0';  // Уменьшаем отступы между элементами
        countElement.style.borderRadius = '5px';
        countElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        countElement.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        // Анимация при наведении
        countElement.addEventListener('mouseover', function() {
            countElement.style.backgroundColor = hoverColor;  // Меняем цвет при наведении
            countElement.style.transform = 'scale(1.05)';
        });

        countElement.addEventListener('mouseout', function() {
            countElement.style.backgroundColor = color;  // Возвращаем стоковый цвет
            countElement.style.transform = 'scale(1)';
        });

        return countElement;
    }

    // Функция для получения дня недели и даты в формате ДД.ММ.ГГГГ
    function getDayOfWeekAndFullDate(dateString) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex];

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${dayOfWeek} ${day}.${month}.${year}`;
    }

    // Функция для получения даты создания темы
    function getThreadCreationDate(element) {
        const dateElement = element.querySelector('time[datetime]');
        if (dateElement) {
            const dateTimeString = dateElement.getAttribute('datetime');
            return dateTimeString.split('T')[0]; // Возвращаем только дату (без времени)
        }
        return null;
    }

    // Функция для проверки, находится ли тема в пределах текущей недели
    function isWithinCurrentWeek(threadDate) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const threadDateObj = new Date(threadDate);
        return threadDateObj >= oneWeekAgo && threadDateObj <= currentDate;
    }

    // Основная функция для подсчета элементов
    async function countElements() {
        // 1. Получаем все темы с нужными классами для "в ожидании" и "на рассмотрении"
        var elementsWaiting = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elementsUnderReview = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        // 2. Подсчитываем количество тем
        var waitingCount = elementsWaiting.length;
        var underReviewCount = elementsUnderReview.length;

        // 3. Получаем все темы на странице
        const currentPageThreads = document.querySelectorAll('.structItem.structItem--thread');

        // 4. Создаем объект для хранения количества тем по дням недели
        const weekCounts = {
            "Пн": {date: '', count: 0},
            "Вт": {date: '', count: 0},
            "Ср": {date: '', count: 0},
            "Чт": {date: '', count: 0},
            "Пт": {date: '', count: 0},
            "Сб": {date: '', count: 0},
            "Вс": {date: '', count: 0}
        };

        // 5. Перебираем все темы и считаем темы по дням недели
        currentPageThreads.forEach(element => {
            const threadDate = getThreadCreationDate(element);
            if (threadDate && isWithinCurrentWeek(threadDate)) {
                const dayOfWeekAndFullDate = getDayOfWeekAndFullDate(threadDate);
                const dayOfWeek = dayOfWeekAndFullDate.split(' ')[0];

                weekCounts[dayOfWeek].count++;
                weekCounts[dayOfWeek].date = dayOfWeekAndFullDate;
            }
        });

        // 6. Создаем контейнер для счетчика тем за неделю
        const counterContainerWeek = document.createElement('div');
        counterContainerWeek.style.position = 'absolute';
        counterContainerWeek.style.top = '10px';
        counterContainerWeek.style.left = '10px';
        counterContainerWeek.style.zIndex = '9999';
        counterContainerWeek.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerWeek.style.padding = '10px';
        counterContainerWeek.style.borderRadius = '8px';
        counterContainerWeek.style.color = '#fff';
        counterContainerWeek.style.fontFamily = 'Arial, sans-serif';
        counterContainerWeek.style.fontSize = '14px';
        counterContainerWeek.style.maxWidth = '300px';
        counterContainerWeek.style.maxHeight = '300px';
        counterContainerWeek.style.overflowY = 'auto';
        counterContainerWeek.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementWeek = document.createElement('div');
        headerElementWeek.textContent = 'Темы за неделю по дням:';
        headerElementWeek.style.fontWeight = 'bold';
        headerElementWeek.style.marginBottom = '10px';
        counterContainerWeek.appendChild(headerElementWeek);

        // Добавляем количество тем по дням недели в контейнер
        for (const day in weekCounts) {
            if (weekCounts[day].date !== '') {
                counterContainerWeek.appendChild(createCountElement(weekCounts[day].count, `${weekCounts[day].date}`, day));
            }
        }

        // 7. Создаем контейнер для счетчика тем в ожидании и на рассмотрении (в правом верхнем углу)
        const counterContainerStatus = document.createElement('div');
        counterContainerStatus.style.position = 'absolute';
        counterContainerStatus.style.top = '10px';  // Размещаем в верхней части
        counterContainerStatus.style.right = '10px';  // Размещаем справа
        counterContainerStatus.style.zIndex = '9999';
        counterContainerStatus.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerStatus.style.padding = '10px';
        counterContainerStatus.style.borderRadius = '8px';
        counterContainerStatus.style.color = '#fff';
        counterContainerStatus.style.fontFamily = 'Arial, sans-serif';
        counterContainerStatus.style.fontSize = '14px';
        counterContainerStatus.style.maxWidth = '200px';
        counterContainerStatus.style.maxHeight = '200px';
        counterContainerStatus.style.overflowY = 'auto';
        counterContainerStatus.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementStatus = document.createElement('div');
        headerElementStatus.textContent = 'Статус тем:';
        headerElementStatus.style.fontWeight = 'bold';
        headerElementStatus.style.marginBottom = '10px';
        counterContainerStatus.appendChild(headerElementStatus);

        // Добавляем количество тем в ожидании и на рассмотрении
        const waitingElement = createCountElement(waitingCount, `В ожидании`, 'Пн');
        const underReviewElement = createCountElement(underReviewCount, `На рассмотрении`, 'Вт');
        counterContainerStatus.appendChild(waitingElement);
        counterContainerStatus.appendChild(underReviewElement);

        // Вставляем контейнеры в body
        document.body.appendChild(counterContainerWeek);
        document.body.appendChild(counterContainerStatus);
    }

    // Вызываем функцию при загрузке страницы
    window.onload = function() {
        countElements();
    };
    (function() {
    'use strict';

    // Функция для проверки, что это раздел биографий
    function isBiographySection() {
        // Проверяем несколько способов определения раздела биографий
        const breadcrumb = document.querySelector('.p-breadcrumbs');
        if (breadcrumb) {
            const breadcrumbText = breadcrumb.textContent.toLowerCase();
            if (breadcrumbText.includes('рп-биографии') ||
                breadcrumbText.includes('биографи') ||
                document.URL.includes('/forums/РП-биографии')) {
                return true;
            }
        }

        // Проверяем заголовок темы
        const title = document.querySelector('.p-title-value');
        if (title && title.textContent.toLowerCase().includes('биографи')) {
            return true;
        }

        // Проверяем URL
        if (document.URL.includes('биографи')) {
            return true;
        }

        return false;
    }

    // Функция для очистки текста от не-слов
    function cleanText(text) {
        // Удаляем BB-коды и HTML теги
        text = text.replace(/\[.*?\]/g, ' ');
        text = text.replace(/<.*?>/g, ' ');

        // Удаляем смайлики и эмодзи
        text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, ' '); // Эмодзи
        text = text.replace(/[\u{1F300}-\u{1F5FF}]/gu, ' '); // Символы и пиктограммы
        text = text.replace(/[\u{1F680}-\u{1F6FF}]/gu, ' '); // Транспорт и карты
        text = text.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ' '); // Флаги
        text = text.replace(/[;:][)(]|[)(][;:]|:[()]|\([;:)]|[:;]-?[()DPp]|\(-?[:;]|<3/gi, ' '); // Текстовые смайлы

        // Удаляем цифры, года, даты (только отдельные числа)
        text = text.replace(/\b\d+\b/g, ' '); // Любые отдельные числа

        // Удаляем специальные символы, оставляем только буквы, дефисы и пробелы
        text = text.replace(/[^\w\sа-яА-ЯёЁ\-]/g, ' ');

        // Удаляем лишние пробелы
        text = text.trim().replace(/\s+/g, ' ');

        return text;
    }

    // Функция для подсчета слов
    function countWords(text) {
        // Очищаем текст
        text = cleanText(text);
        if (text === '') return 0;

        // Разделяем на слова и фильтруем
        const words = text.split(' ').filter(word => {
            // Исключаем пустые строки
            return word.length > 0 &&
                   // Исключаем слова содержащие только цифры
                   !/^\d+$/.test(word);
        });

        return words.length;
    }

    // Функция для проверки, что это первое сообщение темы
    function isFirstPost(post) {
        // Находим все сообщения в теме
        const allPosts = document.querySelectorAll('.message--post');
        if (allPosts.length === 0) return false;

        // Первое сообщение - это первое в списке
        return post === allPosts[0];
    }

    // Функция для добавления счетчика к посту
    function addWordCounterToPost(post) {
        // Проверяем, что это раздел биографий
        if (!isBiographySection()) {
            return;
        }

        // Проверяем, что это ПЕРВОЕ сообщение темы
        if (!isFirstPost(post)) {
            return;
        }

        // Ищем контент поста
        const content = post.querySelector('.bbWrapper');
        if (!content) return;

        // Пропускаем пустые посты или посты с малым количеством текста
        if (content.textContent.trim().length < 50) {
            return;
        }

        // Удаляем предыдущий счетчик если есть
        const existingCounter = post.querySelector('.word-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // Получаем текст без цитат
        let text = content.innerHTML;

        // Удаляем цитаты
        text = text.replace(/<blockquote.*?<\/blockquote>/gs, '');
        text = text.replace(/\[quote.*?\[\/quote\]/gs, '');

        // Удаляем подписи
        const signature = content.querySelector('.message-signature');
        if (signature) {
            text = text.replace(signature.outerHTML, '');
        }

        // Получаем чистый текст
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';

        // Удаляем лишние пробелы и переносы
        cleanText = cleanText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // Считаем слова
        const rawWordCount = countWords(cleanText);
        // Вычитаем 15 слов
        const finalWordCount = Math.max(0, rawWordCount - 15);

        // Создаем элемент счетчика
        const counter = document.createElement('div');
        counter.className = 'word-counter';
        counter.style.cssText = `
            margin: 15px 0;
            padding: 12px;
            border-radius: 8px;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        // Определяем цвет в зависимости от количества слов
        let color, status, icon;
        if (finalWordCount >= 200 && finalWordCount <= 600) {
            color = '#28a745';
            status = 'Соответствует требованиям';
            icon = '✅';
        } else if (finalWordCount < 200) {
            color = '#dc3545';
            status = `Меньше 200 слов (не хватает ${200 - finalWordCount})`;
            icon = '❌';
        } else {
            color = '#dc3545';
            status = `Больше 600 слов (лишних ${finalWordCount - 600})`;
            icon = '❌';
        }

        counter.innerHTML = `
            <div style="color: ${color}; font-size: 16px; margin-bottom: 5px;">
                ${icon} <strong>Слов в биографии: ${finalWordCount}</strong>
            </div>
            <div style="color: #6c757d; font-size: 12px; margin-bottom: 3px;">
                (с учетом вычета 15 слов, изначально: ${rawWordCount})
            </div>
            <div style="color: ${color}; font-size: 12px; margin-bottom: 5px;">
                ${status}
            </div>
            <div style="font-size: 11px; color: #6c757d;">
                Требования: 200-600 слов (учитывается вычет 15 слов)
            </div>
        `;

        // Добавляем счетчик после контента
        content.parentNode.insertBefore(counter, content.nextSibling);

        console.log('Счетчик слов:', {
            'Изначально слов': rawWordCount,
            'После вычета': finalWordCount,
            'Текст для проверки': cleanText.substring(0, 100) + '...'
        });
    }

    // Функция для обработки всех постов на странице
    function processAllPosts() {
        if (!isBiographySection()) {
            console.log('Это не раздел биографий, скрипт не активирован');
            return;
        }

        console.log('Раздел биографий обнаружен, активирую счетчик слов...');

        const posts = document.querySelectorAll('.message--post');
        console.log('Найдено постов:', posts.length);

        // Обрабатываем только первый пост
        if (posts.length > 0) {
            addWordCounterToPost(posts[0]);
        }
    }

    // Запускаем при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllPosts);
    } else {
        processAllPosts();
    }

    // Обработка динамически загружаемого контента
    const observer = new MutationObserver(function(mutations) {
        if (!isBiographySection()) return;

        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('message--post')) {
                        // Проверяем, что это первое сообщение
                        const allPosts = document.querySelectorAll('.message--post');
                        if (allPosts.length > 0 && node === allPosts[0]) {
                            setTimeout(() => addWordCounterToPost(node), 500);
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })})();

})();
