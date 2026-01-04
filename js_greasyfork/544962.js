// ==UserScript==
// @name         VoidBoost Universal Title Changer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Изменить заголовок страницы на название фильма/проекта и добавить кнопки качества видео
// @author       You
// @match        https://member.voidboost.com/admin/post/*/show
// @match        https://member.voidboost.com/admin/post/*/edit
// @match        https://member.voidboost.com/admin/queue*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544962/VoidBoost%20Universal%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/544962/VoidBoost%20Universal%20Title%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения названия и года из текста
    function extractTitleAndYear(text) {
        // Ищем паттерн "Название (Оригинальное название) (Год)"
        const match1 = text.match(/^(.+?)\s*\([^)]+\)\s*\((\d{4})\)$/);
        if (match1) {
            return `${match1[1].trim()} (${match1[2]})`;
        }

        // Ищем паттерн "Название (Год)"
        const match2 = text.match(/^(.+?)\s*\((\d{4})\)$/);
        if (match2) {
            return `${match2[1].trim()} (${match2[2]})`;
        }

        // Если не нашли год, возвращаем как есть
        return text.trim();
    }

    // Функция для изменения заголовка
    function changeTitle() {
        let newTitle = '';

        // Случай 1: Страница показа проекта (/admin/post/*/show)
        if (window.location.pathname.includes('/admin/post/') && window.location.pathname.includes('/show')) {
            const movieTitle = document.querySelector('h1');
            if (movieTitle && movieTitle.textContent.trim()) {
                newTitle = extractTitleAndYear(movieTitle.textContent.trim());
            }
        }

        // Случай 2: Страница редактирования (/admin/post/*/edit)
        else if (window.location.pathname.includes('/admin/post/') && window.location.pathname.includes('/edit')) {
            const editHeader = document.querySelector('h1');
            if (editHeader && editHeader.textContent.includes('Редактирование проекта')) {
                // Извлекаем название из текста "Редактирование проекта «Название»"
                const match = editHeader.textContent.match(/«(.+?)»/);
                if (match) {
                    newTitle = extractTitleAndYear(match[1]);
                }
            }
        }

        // Случай 3: Страница списка файлов (/admin/queue)
        else if (window.location.pathname.includes('/admin/queue')) {
            const filterHeader = document.querySelector('h2');
            if (filterHeader) {
                const movieLink = filterHeader.querySelector('a[href*="post_id"]');
                const yearSmall = filterHeader.querySelector('small');

                if (movieLink && yearSmall) {
                    const movieName = movieLink.textContent.trim();
                    const year = yearSmall.textContent.trim();
                    newTitle = `${movieName} ${year}`;
                } else {
                    // Альтернативный способ через регулярное выражение
                    const headerText = filterHeader.textContent;
                    const match = headerText.match(/«(.+?)»\s*(.+?)\s+в переводе/);
                    if (match) {
                        newTitle = `${match[1]} ${match[2]}`;
                    }
                }
            }
        }

        // Устанавливаем новый заголовок если найден
        if (newTitle && newTitle !== document.title) {
            document.title = newTitle;
            console.log('Заголовок изменен на:', newTitle);
        }
    }

    // Функция для парсинга ссылок на качества из строки
    function parseVideoQualities(fileString) {
        const qualities = [];
        // Находим все совпадения для паттерна [качество]ссылка
        const regex = /\[(\d+p)\](https:\/\/[^,\s]+)/g;
        let match;

        while ((match = regex.exec(fileString)) !== null) {
            qualities.push({
                quality: match[1],
                url: match[2]
            });
        }

        return qualities;
    }

    // Функция для копирования текста в буфер обмена
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Скопировано в буфер обмена:', text);
        }).catch(function(err) {
            console.error('Ошибка копирования:', err);
        });
    }

    // Функция для создания кнопок качества
    function createQualityButtons(qualities) {
        const container = document.createElement('div');
        container.style.cssText = `
            text-align: center;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f8f9;
            border-radius: 5px;
            border: 1px solid #e1e1e1;
        `;

        const title = document.createElement('div');
        title.textContent = 'Копировать ссылку на качество:';
        title.style.cssText = `
            margin-bottom: 10px;
            font-weight: bold;
            color: #333;
            font-size: 14px;
        `;
        container.appendChild(title);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
        `;

        qualities.forEach(item => {
            const button = document.createElement('button');
            button.textContent = item.quality;
            button.className = 'ui button small blue';
            button.style.cssText = `
                margin: 2px;
                padding: 8px 12px;
                font-size: 12px;
                min-width: 60px;
            `;

            button.addEventListener('click', function(e) {
                e.preventDefault();
                copyToClipboard(item.url);

                // Визуальная обратная связь
                const originalText = button.textContent;
                button.textContent = '✓';
                button.style.backgroundColor = '#21ba45';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 1000);
            });

            buttonsContainer.appendChild(button);
        });

        container.appendChild(buttonsContainer);
        return container;
    }

    // Функция для добавления кнопок качества в модальное окно
    function addQualityButtonsToModal() {
        const modal = document.getElementById('preview-file-modal');
        if (!modal) return;

        // Ждем загрузки iframe
        const iframe = modal.querySelector('iframe');
        if (!iframe) return;

        iframe.addEventListener('load', function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // Ищем скрипт с данными плеера
                const scripts = iframeDoc.querySelectorAll('script');
                let playerData = null;

                scripts.forEach(script => {
                    const scriptText = script.textContent;
                    if (scriptText.includes('new Playerjs') && scriptText.includes('file:')) {
                        // Извлекаем строку file
                        const fileMatch = scriptText.match(/file:\s*'([^']+)'/);
                        if (fileMatch) {
                            playerData = fileMatch[1];
                        }
                    }
                });

                if (playerData) {
                    const qualities = parseVideoQualities(playerData);

                    if (qualities.length > 0) {
                        // Находим контейнер с действиями
                        const actionsDiv = modal.querySelector('.actions');

                        if (actionsDiv) {
                            // Удаляем старые кнопки качества, если они есть
                            const existingQualityButtons = modal.querySelector('.quality-buttons-container');
                            if (existingQualityButtons) {
                                existingQualityButtons.remove();
                            }

                            // Создаем и вставляем кнопки качества
                            const qualityButtonsContainer = createQualityButtons(qualities);
                            qualityButtonsContainer.className = 'quality-buttons-container';

                            actionsDiv.parentNode.insertBefore(qualityButtonsContainer, actionsDiv);
                        }
                    }
                }
            } catch (e) {
                console.error('Ошибка при обработке iframe:', e);
            }
        });
    }

    // Отслеживание открытия модального окна
    function setupModalObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('ui') && node.classList.contains('modal')) {
                        // Модальное окно появилось
                        setTimeout(addQualityButtonsToModal, 100);
                    }
                });

                // Проверяем изменения в существующих модальных окнах
                if (mutation.type === 'childList') {
                    const modal = document.getElementById('preview-file-modal');
                    if (modal && modal.style.display !== 'none' && !modal.classList.contains('hidden')) {
                        setTimeout(addQualityButtonsToModal, 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Инициализация
    function init() {
        changeTitle();

        // Настраиваем наблюдатель только для страниц с очередью файлов
        if (window.location.pathname.includes('/admin/queue')) {
            setupModalObserver();

            // Также отслеживаем клики по кнопкам предпросмотра
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('preview-file')) {
                    setTimeout(addQualityButtonsToModal, 500);
                }
            });
        }
    }

    // Выполняем сразу после загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Отслеживаем динамические изменения для заголовка
    const titleObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                changeTitle();
            }
        });
    });

    // Начинаем наблюдение за изменениями в DOM
    if (document.body) {
        titleObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Добавляем задержки для медленной загрузки
    setTimeout(changeTitle, 500);
    setTimeout(changeTitle, 1000);
})();