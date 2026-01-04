// ==UserScript==
// @name         Shikimori Comments Pagination
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  Пагинация комментариев
// @author       karuma
// @license      MIT
// @match        https://shikimori.one/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534577/Shikimori%20Comments%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/534577/Shikimori%20Comments%20Pagination.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CONFIG ---------------------------------------------------------------------------------------

    const COMMENTS_PER_PAGE = 5; // Число комментариев на странице
    const CHECK_INTERVAL = 500; // Частота проверки элементов на странице (Не ставить сликшом маленький)
    const TimeoutToScroll = 400; // Задержка перед скролом к пагинатору. (После нажатия на вперед/назад)
    const BackButtonScroll = true; // Прокрутка к началу после нажатия на "назад" (Удобнее читать комментарии по порядку)
    const ScrollAnimation = 'instant';// 'instant' для мгновенной или 'smooth' для плавной прокрутки
    const EnableScroll = true; // true/false - после после обновления блока комментариев скролл до пагинатора
    const CustomView = true; // Кастомный вид спойлеров/картинок

     /*
     Стилевые переменные в RGBA формате
     rgba(90, 120, 160, 0.25) Где первые 3 значения количество Красного/Зеленого/Синего в диапазоне от 0 до 255
     а 3 значение прозрачность элемента от 0 до 1, где 1 - это полностью не прозрачный
     */
    const STYLE_VARS = {
        // Основные: прозрачность, скругление, ширина поля
        OPACITY: '0.8', // Общая прозрачность (0-1)
        BUTTON_RADIUS: '0.375rem', // Скругление углов
        INPUT_WIDTH: '3.2rem', // Ширина поля ввода

        // Цвета: наследуют стили страницы по умолчанию
        colors: {
            text: 'inherit', // Цвет текста inherit - Такой же как на странице
            buttonText: 'inherit', // Цвет текста кнопок
            primary: 'rgba(90,120,160,0.25)', // Цвет кнопок
            primaryHover: 'rgba(90,120,160,0.35)', // Цвет кнопок при наведении
            inputBg: 'rgba(255,255,255,0.1)', // Фон поля ввода
            inputBorder: 'rgba(150,150,150,0.3)' // Граница поля
        },

        // Отступы: в rem/em для адаптивности
        spacing: {
            gap: '0.5rem', // Расстояние между элементами (8px)
            margin: '1.5rem 0', // Внешние отступы контейнера
            padding: '0.5rem 0.75rem', // Внутренние отступы
            buttonPadding: '0.25em 0.6em', // Отступы кнопок
            inputPadding: '0.25em 0.4em' // Отступы поля
        },

        // Шрифты: относительные размеры (rem/em)
        typography: {
            fontSize: '0.95rem', // Основной размер (~15px)
            buttonFontSize: '0.85rem', // Размер кнопок (~13.5px)
            infoFontSize: '0.8rem', // Размер текста "Страница X из Y"
            lineHeight: '1.2' // Межстрочный интервал (120%)
        },

        // Анимации: плавные переходы
        transitions: {
            button: 'background-color 0.2s ease, transform 0.15s ease', // Эффекты кнопок
            hoverTransform: 'translateY(-1px)' // Сдвиг при наведении
        }
    };
    // CONFIG ---------------------------------------------------------------------------------------

    // Функция для получения CSS-переменных со страницы
    function getCSSCustomProperty(prop, fallback) {
        if (typeof document === 'undefined') return fallback;
        return getComputedStyle(document.documentElement).getPropertyValue(prop) || fallback;
    }

    // Инициализация стилей с возможностью переопределения
    function initStyles() {
        // Попробуем получить значения из CSS-переменных, если они есть
        const rootStyles = getComputedStyle(document.documentElement);

        // Обновляем STYLE_VARS значениями из CSS-переменных (если они существуют)
        STYLE_VARS.colors.text = getCSSCustomProperty('--text-color', STYLE_VARS.colors.text);
        STYLE_VARS.colors.buttonText = getCSSCustomProperty('--button-text-color', STYLE_VARS.colors.buttonText);
        STYLE_VARS.colors.primary = getCSSCustomProperty('--primary-color', STYLE_VARS.colors.primary);

        // Добавляем глобальные стили
        GM_addStyle(`
        .shiki-comments-loading {
            opacity: 0.7;
            pointer-events: none;
        }
    `);
    }

    function addStylesPaginator() {
        const stylePaginator = document.createElement('style');
        stylePaginator.textContent = `
        .shiki-comments-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: ${STYLE_VARS.spacing.gap};
            margin: ${STYLE_VARS.spacing.margin};
            padding: ${STYLE_VARS.spacing.padding};
            background-color: transparent;
            font-family: inherit;
            font-size: ${STYLE_VARS.typography.fontSize};
            color: ${STYLE_VARS.colors.text};
        }

        .shiki-comments-pagination button {
            opacity: ${STYLE_VARS.OPACITY};
            appearance: none;
            background-color: ${STYLE_VARS.colors.primary};
            color: ${STYLE_VARS.colors.buttonText};
            border: 1px solid transparent;
            border-radius: ${STYLE_VARS.BUTTON_RADIUS};
            padding: ${STYLE_VARS.spacing.buttonPadding};
            font-size: ${STYLE_VARS.typography.buttonFontSize};
            line-height: ${STYLE_VARS.typography.lineHeight};
            cursor: pointer;
            transition: ${STYLE_VARS.transitions.button};
        }

        .shiki-comments-pagination button:hover:not(:disabled) {
            background-color: ${STYLE_VARS.colors.primaryHover};
            transform: ${STYLE_VARS.transitions.hoverTransform};
        }

        .shiki-comments-pagination input {
            width: ${STYLE_VARS.INPUT_WIDTH};
            text-align: center;
            padding: ${STYLE_VARS.spacing.inputPadding};
            border: 1px solid ${STYLE_VARS.colors.inputBorder};
            border-radius: ${STYLE_VARS.BUTTON_RADIUS};
            font-size: ${STYLE_VARS.typography.buttonFontSize};
            background-color: ${STYLE_VARS.colors.inputBg};
            color: inherit;
            opacity: ${STYLE_VARS.OPACITY};
        }

        .page-info {
            font-size: ${STYLE_VARS.typography.infoFontSize};
            opacity: ${STYLE_VARS.OPACITY};
            margin: 0 ${STYLE_VARS.spacing.gap};
        }
    `;
        document.head.appendChild(stylePaginator);
    }

    // Инициализация
    initStyles();
    addStylesPaginator();
    function addStyles () {
        // Создаем элемент style
        const styleElement = document.createElement('style');

        // Добавляем CSS-правила
        styleElement.textContent = `
         .b-spoiler_inline.opened {
         background-color: #f5f5f5;
         color: #333;
         padding: 2px 4px;
         border-radius: 3px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        .b-spoiler_block {
            cursor: pointer;
            display: inline;
            margin: 0 1px;
        }
        .b-spoiler_block > span[tabindex="0"] {
            display: inline;
            padding: 1px 4px;
            background-color: #687687;
            color: #fff;
            font-size: 12px;
            font-family: inherit;
            border-radius: 2px;
            transition: all 0.15s ease;
            line-height: 1.3;
        }
        .b-spoiler_block:hover > span[tabindex="0"] {
            background-color: #5a6775;
        }
        .b-spoiler_block.is-opened > span[tabindex="0"] {
            background-color: #f5f5f5;
            color: #333;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        .b-spoiler_block > div {
            display: none;
            margin-top: 3px;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 2px;
            border: 1px solid #e0e0e0;
        }
        .b-spoiler_block.is-opened > div {
            display: block;
        }
`;

        // Добавляем в head документа
        document.head.appendChild(styleElement);
    }

    if (CustomView) {
        addStyles();
    }


    /* ========== ОБРАБОТКА СПОЙЛЕРОВ И УДАЛЕНИЯ ========== */

    // Функция для раскрытия/закрытия inline-спойлеров (текстовых)
    function bindSpoilerDeleteButtons(container) {
        container.querySelectorAll('.b-spoiler_inline').forEach(spoiler => {
            // Клонируем элемент (это удалит все предыдущие обработчики)
            const newSpoiler = spoiler.cloneNode(true);

            // Добавляем наш обработчик
            newSpoiler.addEventListener('click', async function(e) {
                e.stopPropagation(); // Останавливаем всплытие

                if (this.classList.contains('opened')) {
                    // Закрываем спойлер
                    if (this.dataset.originalContent) {
                        this.innerHTML = this.dataset.originalContent;
                    }
                    this.classList.remove('opened');
                } else {
                    // Открываем спойлер
                    this.dataset.originalContent = this.innerHTML;
                    this.innerHTML = this.textContent.trim();
                    this.classList.add('opened');
                }
            });

            // Заменяем оригинальный элемент клоном
            spoiler.parentNode.replaceChild(newSpoiler, spoiler);
        });
    }

    // Кликабельность картинок
    function initImageModalViewer(container) {
        const containerEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;

        if (!containerEl) return;

        containerEl.querySelectorAll('img').forEach(el => {
            if (!el.src || el.closest('.b-video')) return;

            const originalStyles = el.getAttribute('style');
            const preview = el.cloneNode(true);

            preview.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Создание модального окна при клике
                const modal = document.createElement('div');
                modal.style.cssText = `
                display: flex;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                cursor: zoom-out;
                align-items: center;
                justify-content: center;
                overflow: auto;
            `;

                const img = document.createElement('img');
                img.src = el.src.replace('/thumbnail/', '/original/').replace('/x48/', '/x160/');
                img.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                display: block;
                object-fit: contain;
                animation: fadeInScale 0.3s ease-out;
            `;

                const closeBtn = document.createElement('span');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 30px;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                color: white;
                text-shadow: 0 0 5px rgba(0,0,0,0.8);
                z-index: 10000;
            `;

                const style = document.createElement('style');
                style.textContent = `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
                document.head.appendChild(style);

                const close = () => {
                    modal.remove();
                    style.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', onKeydown);
                };

                const onKeydown = (e) => {
                    if (e.key === 'Escape') close();
                };

                modal.addEventListener('click', e => {
                    if (e.target === modal || e.target === img) close();
                });
                closeBtn.addEventListener('click', close);
                document.addEventListener('keydown', onKeydown);

                modal.append(img, closeBtn);
                document.body.append(modal);
                document.body.style.overflow = 'hidden';
            });

            el.parentNode.replaceChild(preview, el);

            if (originalStyles) {
                preview.setAttribute('style', originalStyles);
            }

            if (!originalStyles || !originalStyles.includes('cursor:')) {
                preview.style.cursor = 'zoom-in';
            }
        });
    }

    function initVideoModalViewer(container) {
        const containerEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;

        if (!containerEl) return;

        containerEl.querySelectorAll('.b-video.youtube .video-link').forEach(link => {
            if (!link.dataset.href) return;

            const youtubeUrl = link.dataset.href;
            const videoId = youtubeUrl.match(/embed\/([^?]+)/)?.[1] ||
                  youtubeUrl.match(/youtu\.be\/([^?]+)/)?.[1] ||
                  youtubeUrl.match(/v=([^&]+)/)?.[1];

            if (!videoId) return;

            const preview = link.querySelector('img');
            if (!preview) return;

            const originalStyles = preview.getAttribute('style');
            link.removeAttribute('href');

            link.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();

                const modal = document.createElement('div');
                modal.style.cssText = `
                display: flex;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                cursor: zoom-out;
                align-items: center;
                justify-content: center;
                overflow: auto;
            `;

                const videoContainer = document.createElement('div');
                videoContainer.style.cssText = `
                position: relative;
                width: 90vw;
                max-width: 1200px;
                height: 0;
                padding-bottom: 56.25%;
                animation: fadeInScale 0.3s ease-out;
            `;

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            `;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'autoplay');

                const closeBtn = document.createElement('span');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 30px;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                color: white;
                text-shadow: 0 0 5px rgba(0,0,0,0.8);
                z-index: 10000;
            `;

                const style = document.createElement('style');
                style.textContent = `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
                document.head.appendChild(style);

                const close = () => {
                    modal.remove();
                    style.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', onKeydown);
                };

                const onKeydown = (e) => {
                    if (e.key === 'Escape') close();
                };

                modal.addEventListener('click', e => {
                    if (e.target === modal) close();
                });
                closeBtn.addEventListener('click', close);
                document.addEventListener('keydown', onKeydown);

                videoContainer.appendChild(iframe);
                modal.append(videoContainer, closeBtn);
                document.body.append(modal);
                document.body.style.overflow = 'hidden';
            };

            if (!originalStyles || !originalStyles.includes('cursor:')) {
                preview.style.cursor = 'zoom-in';
            }
        });
    }


    /* ========== КЛАСС ДЛЯ РАБОТЫ С БЛОКАМИ КОММЕНТАРИЕВ ========== */

    class CommentsBlock {
        constructor(container) {
            // Инициализация свойств
            this.container = container; // DOM-элемент контейнера
            this.loader = container.querySelector('.comments-loader');// Элемент загрузки
            this.fetchId = null;// ID для запросов
            this.entityId = null; // Может быть topicId или userId
            this.entityType = null; // 'Topic' или 'User'
            this.currentPage = this.loader.getAttribute('currentpage') || 1;// Текущая страница
            this.totalPages = 1;// Всего страниц
            this.pagination = null;// Элемент пагинации
            this.dataskip = parseInt(this.loader.getAttribute('data-skip'));
            this.datacount = parseInt(this.loader.getAttribute('data-count'));
            this.init();
        }
        // Основная инициализация
        init() {
            if (!this.loader) return;

            const ids = this.getCommentsIDs();
            if (!ids) return;

            this.fetchId = ids.fetchId;
            this.entityId = ids.entityId;
            this.entityType = ids.entityType;
            // Рассчитываем общее количество страниц
            const commentsCount = this.datacount + this.dataskip || 0;
            this.totalPages = Math.max(1, Math.ceil(commentsCount / COMMENTS_PER_PAGE));
        }

        // Создание и загрузка блока комментариев
        async CreateCommentsBlock() {
            // Проверяем наличие всех необходимых данных перед загрузкой
            if (!this.hasRequiredAttributes()) {
                console.error('Cannot create comments block - missing required attributes');
                return false;
            }

            await this.loadComments();
            this.renderPagination();
        }

        // Проверка наличия всех необходимых атрибутов
        hasRequiredAttributes() {
            if (!this.loader) {
                console.error('Missing comments loader element');
                return false;
            }

            const urlTemplate = this.loader.getAttribute('data-clickloaded-url-template');
            if (!urlTemplate) {
                console.error('Missing data-clickloaded-url-template attribute');
                return false;
            }

            this.ids = this.getCommentsIDs();
            if (!this.ids || !this.ids.fetchId || !this.ids.entityId || !this.ids.entityType) {
                console.error('Invalid or missing IDs in URL template');
                return false;
            }

            const count = this.loader.getAttribute('data-count');
            if (!count) {
                console.error('Missing data-count attribute');
                return false;
            }

            return true;
        }
        // Получение идентификаторов топика
        getCommentsIDs() {
            try {
                const urlTemplate = this.loader.getAttribute('data-clickloaded-url-template');
                if (!urlTemplate) return null;

                const matches = urlTemplate.match(/\/fetch\/(\d+)\/(Topic|User)\/(\d+)/);
                if (!matches || matches.length < 4) return null;

                return {
                    fetchId: matches[1],
                    entityId: matches[3],
                    entityType: matches[2] // 'Topic' или 'User'
                };
            } catch (error) {
                console.error('Error parsing comment IDs:', error);
                return null;
            }
        }

        //Создание Url для запроса
        buildCommentsUrl(offset) {
            // Формируем URL в зависимости от типа сущности
            if (this.entityType === 'User') {
                return `https://shikimori.one/comments/fetch/${this.fetchId}/User/${this.entityId}/${offset}/${COMMENTS_PER_PAGE}`;
            } else {
                // По умолчанию считаем, что это Topic
                return `https://shikimori.one/comments/fetch/${this.fetchId}/Topic/${this.entityId}/${offset}/${COMMENTS_PER_PAGE}`;
            }
        }
        // Отправка запроса на сервер
        async fetchComments(url, maxRetries = 4, initialRetryDelay = 2000) {
            let lastError = null;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await fetch(url);

                    // Обработка HTTP-ошибок
                    if (!response.ok) {
                        // Особый случай: Too Many Requests (429)
                        if (response.status === 429) {
                            const retryAfter = parseInt(response.headers.get('Retry-After') || initialRetryDelay / 1000, 10);
                            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                            continue; // Повторяем попытку без увеличения счетчика
                        }
                        throw new Error(`HTTP error ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    if (!data?.content) throw new Error('Invalid response format: missing content');
                    return data;

                } catch (error) {
                    lastError = error;

                    if (attempt < maxRetries) {
                        const currentDelay = initialRetryDelay * Math.pow(2, attempt - 1);
                        await new Promise(resolve => setTimeout(resolve, currentDelay));
                    }
                }
            }

            throw lastError || new Error('All retry attempts failed');
        }
        // Основная функция загрузки
        async loadComments() {
            try {
                const offset = (this.currentPage - 1) * COMMENTS_PER_PAGE;
                this.container.classList.add('shiki-comments-loading');
                const data = await this.fetchComments(this.buildCommentsUrl(offset));
                this.container.innerHTML = data.content;
                // Создаем и добавляем loader
                const loaderDiv = document.createElement('div');
                loaderDiv.style.display = 'none';
                loaderDiv.className = 'comments-loader';
                loaderDiv.setAttribute('data-count',this.datacount);
                loaderDiv.setAttribute('data-skip',this.dataskip);
                loaderDiv.setAttribute('data-clickloaded-url-template',this.loader.getAttribute('data-clickloaded-url-template'));
                loaderDiv.setAttribute('currentpage',this.currentPage);
                // Добавляем новый loader в контейнер
                this.container.appendChild(loaderDiv);

                jQuery(this.container).process(data.JS_EXPORTS);
                if (CustomView) {
                    bindSpoilerDeleteButtons(this.container);
                    initImageModalViewer(this.container);
                    initVideoModalViewer(this.container);
                }
            } catch (error) {
                console.error('Ошибка загрузки комментариев:', error);
            } finally {
                this.container.classList.remove('shiki-comments-loading');
            }
        }


        // Создание интерфейса пагинации
        renderPagination() {
            if (this.pagination) {
                this.pagination.remove(); // Удаляем старую пагинацию
            }
            
            // Создаем новый элемент пагинации
            this.pagination = document.createElement('div');
            this.pagination.className = 'shiki-comments-pagination';
            this.pagination.innerHTML = `
                <button class="prev-page">&lt; Назад</button>
                <span class="page-info">Страница ${this.currentPage} из ${this.totalPages}</span>
                <input type="number" class="page-input" min="1" max="${this.totalPages}" value="${this.currentPage}">
                <button class="next-page">Вперед &gt;</button>
            `;

            // Находим editor-container (может быть рядом с контейнером или в другом месте)
            const editorContainer = this.container.closest('.b-topic')?.querySelector('.editor-container') ||
                  document.querySelector('.editor-container');

            // Вставляем после editor-container если найден, иначе после контейнера комментариев
            const insertAfter = editorContainer || this.container;
            insertAfter.parentNode.insertBefore(this.pagination, insertAfter.nextSibling);


            // Удаляем старый пагинатор, если он есть сразу после нового
            const oldPagination = this.pagination.nextElementSibling;
            if (oldPagination && oldPagination.classList.contains('shiki-comments-pagination')) {
                oldPagination.remove();
            }



            function ScrollIntoElement(container,position='bottom') {
                if (EnableScroll) {
                    setTimeout(() => {
                        let scrollPosition = 0;
                        // Получаем позицию элемента относительно документа
                        const elementRect = container.getBoundingClientRect();
                        if (position === 'bottom'){
                         scrollPosition = elementRect.bottom + window.pageYOffset - window.innerHeight + 80;
                        }
                        else {scrollPosition = elementRect.top + window.pageYOffset - 80;}

                        // Добавляем отступ
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: ScrollAnimation
                        });
                    },TimeoutToScroll) // Задержка
                }
            }
            // Обработчики событий для кнопок пагинации
            this.pagination.querySelector('.prev-page').addEventListener('click', async () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    await this.loadComments();
                    this.renderPagination(); // Обновляем отображение
                    if (BackButtonScroll){
                        ScrollIntoElement(this.container, 'top');
                    }
                    else{
                        ScrollIntoElement(this.pagination);
                    }
                }
            });

            // Обработчик для поля ввода страницы
            this.pagination.querySelector('.next-page').addEventListener('click', async () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    await this.loadComments();
                    this.renderPagination();
                    ScrollIntoElement(this.pagination);
                }
            });

            this.pagination.querySelector('.page-input').addEventListener('change', async (e) => {
                const newPage = parseInt(e.target.value, 10);
                if (newPage >= 1 && newPage <= this.totalPages) {
                    this.currentPage = newPage;
                    await this.loadComments();
                    this.renderPagination();
                    ScrollIntoElement(this.pagination);
                }
            });
        }
    }

    /* ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ФУНКЦИИ ========== */
    let initializedBlocks = new WeakMap(); // Хранит инициализированные блоки
    let isInitializing = false; // Флаг для защиты от повторной инициализации

    async function init() {
        if (isInitializing) return;
        isInitializing = true;

        console.log('Parallel INIT started');
        const updatedBlocks = document.querySelectorAll('.b-comments');

        try {
            // Создаем массив промисов для всех блоков
            const initializationPromises = Array.from(updatedBlocks).map(async (container) => {
                try {
                    if (!initializedBlocks.has(container)) {
                        const instance = new CommentsBlock(container);
                        initializedBlocks.set(container, instance);
                        await instance.CreateCommentsBlock();
                        console.log('Successfully initialized:', container);
                    } 
                } catch (error) {
                    console.error(`Error processing block ${container}:`, error);
                    // Пробрасываем ошибку дальше, если нужно прервать все операции
                    throw error;
                }
            });

            // Ожидаем завершения ВСЕХ операций параллельно
            await Promise.all(initializationPromises);

        } catch (error) {
            console.error('Global initialization error:', error);
        } finally {
            isInitializing = false;
        }
    }

    let checkInterval = null;
    let lastKnownBlocks = [];


    // Функция для проверки новых блоков комментариев на странице и инициализации
    async function observeNewComments() {
        if (checkInterval) clearInterval(checkInterval);

        console.log("Запуск наблюдения за .b-comments");

        checkInterval = setInterval(async () => {
            const currentBlocks = Array.from(document.querySelectorAll('.b-comments'));

            if (currentBlocks.length !== lastKnownBlocks.length ||
                currentBlocks.some(block => !lastKnownBlocks.includes(block))) {
                console.log("Обнаружены изменения в .b-comments");
                await init();
                lastKnownBlocks = currentBlocks;
            }
        }, CHECK_INTERVAL);

        const initialBlocks = Array.from(document.querySelectorAll('.b-comments'));
        if (initialBlocks.length > 0) {
            await init();
            lastKnownBlocks = initialBlocks;
        }
    }

    function stopObserving() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }
    window.addEventListener('popstate', (event) => {
        //window.location.reload();
        //document.querySellectorAll('.shiki-comments-pagination').forEach(element => element.remove());
        console.log('Сработал popstate!', event.state);
    });
    observeNewComments();

})();