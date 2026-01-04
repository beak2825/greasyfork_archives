// ==UserScript==
// @name         Boosty: Расширенное управление контентом
// @version      3.1
// @description  Автоматически раскрывает посты «Читать далее», подгружает комментарии и ответы
// @match        https://boosty.to/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483009/Boosty%3A%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BD%D1%82%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/483009/Boosty%3A%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BD%D1%82%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ==================================================================================
     * РАЗДЕЛ 1: КОНФИГУРАЦИЯ И СЕЛЕКТОРЫ
     * ==================================================================================
     */
    
    // Централизованное хранилище настроек, CSS-классов и селекторов элементов.
    const CONFIG = {
        // Объект с селекторами для поиска элементов на странице.
        SELECTORS: {
            // Корневые контейнеры постов и основного контента.
            POST_ROOT: '[data-test-id="COMMON_POST:ROOT"]',
            // Контейнер в шапке сайта для размещения кнопки настроек.
            HEADER_CONTAINER: 'div[class*="TopMenuRight"], div[class*="TopMenu"][class*="Right"]',
            // Заголовок отдельного поста (используется для определения контекста страницы).
            SINGLE_POST_HEADER: 'div[class*="BasePostHeader"][class*="headerRightBlock"]',
            // Футер отдельного поста (место для дополнительной кнопки управления).
            SINGLE_POST_FOOTER: 'div[class*="PostFooter"][class*="rightBlock"]',
            // Обертка карточки поста в ленте.
            POST_WRAPPER: 'article[class*="Feed-scss--module_itemWrap"]',

            // Кнопки раскрытия полного текста поста ("Читать далее").
            BTN_READ_MORE_POST: [
                '[class*="Post_readMore_"]',
                '[class*="Post-scss--module_readMore_"]',
                '[class*="ExpandableText_expandButton_"]',
                '[class*="ExpandableContent_expandButton_"]',
                'button[class*="readMore"]:not([class*="showMore"])',
                '.readMoreBlock button',
                'button[class*="ReadMoreButton-scss--module_root"]:not([class*="ShowMore-scss--module_button"]):not([class*="CommentView-scss--module_showMoreButton"])'
            ].join(', '),

            // Кнопки подгрузки дополнительных комментариев (пагинация).
            BTN_LOAD_COMMENTS: [
                '[class*="ShowMore_showMore"]',
                '[class*="CommentView_showMore"]',
                '[class*="ShowMore-scss--module_button"]'
            ].join(', '),

            // Кнопки раскрытия вложенных веток ответов.
            BTN_LOAD_REPLIES: [
                '[class*="Comment_repliesButton"]',
                '[class*="Comment-scss--module_repliesButton"]',
                'button[class*="repliesButton"]'
            ].join(', '),

            // Кнопки разворачивания длинного текста внутри комментария.
            BTN_EXPAND_COMMENT_TEXT: [
                '[class*="CommentView-scss--module_showMoreButton"]',
                '[class*="Comment-scss--module_readMore"]'
            ].join(', '),

            // Кнопка "Загрузить ещё" в ленте (альтернатива скроллу).
            BTN_LOAD_MORE_FEED: [
                'div[class*="Feed-scss--module_center"] button',
                'button[class*="ContainedButton-scss--module_button"]:not([class*="Post-scss"]):not([class*="Subscriber"]):not([class*="Subscription"]):not([class*="Donation"]):not([class*="SideBar"]):not([class*="AuthorCard"]):not([data-test-id*="goToBlog"])'
            ].join(', '),

            // Селекторы изображений для управления их загрузкой в режиме экономии трафика.
            CONTENT_IMAGES: [
                'div[class*="PostContent-scss"] img',
                'div[class*="Comment-scss"] img'
            ].join(', '),

            // Индикаторы загрузки (спиннеры) для отслеживания состояния AJAX-запросов.
            SPINNERS: [
                '[class*="Loader-scss"]',
                '[data-test-id="loader"]',
                'div[class*="spinner"]'
            ].join(', ')
        },

        // Имена CSS-классов для генерируемых элементов интерфейса.
        CLASSES: {
            GEAR_CONTAINER: 'bx-settings-container',
            GEAR_ICON: 'bx-icon-gear',
            MENU: 'bx-dropdown-menu',
            OVERLAY: 'bx-modal-overlay',
            PROGRESS_BAR: 'bx-progress-bar',
            PROGRESS_FILL: 'bx-progress-fill',
            HIDDEN_IMAGE: 'bx-hidden-image-placeholder',
            TOAST: 'bx-toast-notification',
            PROCESSING: 'bx-element-processing'
        },

        // Ключевые слова для текстового поиска кнопок (резервный метод).
        TEXT_MATCH: {
            POST: ['читать далее'],
            COMMENT_TEXT: ['раскрыть комментарий'],
            LOAD_COMMENTS: ['показать ещё комментарии'],
            LOAD_REPLIES: ['показать ещё ответы']
        },

        // Список слов и выражений, наличие которых запрещает автоматический клик (фильтр безопасности).
        DANGER_WORDS: ['донат', 'donate', 'поддерж', 'support', 'subscribe', 'подписаться', 'купить', 'buy', 'pay', 'send', 'отправить', 'money', 'rub', '₽', 'gift', 'goal', 'цель', 'сбор', 'перейти в блог', 'go to blog']
    };

    // Загрузка сохраненного пользовательского селектора из локального хранилища, если он существует.
    try {
        const sessionSelector = sessionStorage.getItem('bx_auto_selector_readmore');
        const localSelector = localStorage.getItem('bx_auto_selector_readmore');
        const savedSelector = sessionSelector || localSelector;

        if (savedSelector) {
            CONFIG.SELECTORS.BTN_READ_MORE_POST = savedSelector + ', ' + CONFIG.SELECTORS.BTN_READ_MORE_POST;
        }
    } catch (e) {}

    /**
     * ==================================================================================
     * РАЗДЕЛ 2: УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ (UIController)
     * ==================================================================================
     */
    
    // Класс отвечает за создание и управление визуальными элементами: кнопкой настроек, меню, оверлеем и уведомлениями.
    class UIController {
        constructor(queueManager) {
            this.queueManager = queueManager;
            this.elements = {}; 
            // Инициализация настроек скрипта с значениями по умолчанию.
            this.settings = {
                expandPosts: true,
                autoLoadNewPosts: false,
                autoStart: false,
                maxScrollSteps: 50,
                autoClickLoadMore: false,
                expandComments: true,
                expandReplies: true,
                expandCommentText: true,
                turboMode: true,
                restoreOnFinish: true,
                delayMin: 60,
                delayMax: 120,
                finalDelay: 500,
                smartSpeed: true,
                speedThreshold: 5,
                fastDelayMin: 10,
                fastDelayMax: 20
            };
            this.loadSettings();
        }

        // Инициализация контроллера: внедрение стилей и запуск наблюдения за DOM.
        init() {
            this.injectStyles();
            this.startHeaderObserver();

            // Слушатель событий хранилища для синхронизации настроек между вкладками.
            window.addEventListener('storage', (e) => {
                if (e.key === 'bx_settings') {
                    this.loadSettings();
                    // При необходимости здесь можно обновить состояние активного меню.
                }
            });
        }

        // Загрузка настроек из LocalStorage.
        loadSettings() {
            const saved = localStorage.getItem('bx_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        }

        // Сохранение текущих настроек в LocalStorage.
        saveSettings() {
            localStorage.setItem('bx_settings', JSON.stringify(this.settings));
        }

        // Внедрение CSS-стилей для элементов интерфейса скрипта.
        injectStyles() {
            const css = `
                /* Базовый контейнер кнопки настроек */
                .${CONFIG.CLASSES.GEAR_CONTAINER} {
                    display: flex; align-items: center; justify-content: center;
                    width: 40px; height: 40px; border-radius: 50%;
                    cursor: pointer; color: inherit;
                    position: relative;
                    transition: background-color 0.2s, opacity 0.2s;
                    margin-right: 8px;
                    pointer-events: auto !important;
                }
                .${CONFIG.CLASSES.GEAR_CONTAINER}.bx-header-btn { z-index: 20001; }
                .${CONFIG.CLASSES.GEAR_CONTAINER}.bx-content-btn { z-index: auto; }
                .${CONFIG.CLASSES.GEAR_CONTAINER}:hover { background-color: rgba(255, 255, 255, 0.1); opacity: 1; }
                .${CONFIG.CLASSES.GEAR_ICON} {
                    display: inline-flex; align-items: center; justify-content: center;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%; height: 100%; pointer-events: none; will-change: transform;
                }
                .${CONFIG.CLASSES.GEAR_ICON} svg { width: 24px; height: 24px; min-width: 24px; min-height: 24px; fill: currentColor; }
                .${CONFIG.CLASSES.GEAR_CONTAINER}.active .${CONFIG.CLASSES.GEAR_ICON} { transform: rotate(180deg); }

                /* Выпадающее меню настроек */
                .${CONFIG.CLASSES.MENU} {
                    position: fixed; top: 60px; right: 20px; width: 320px;
                    background-color: var(--background-color, #1a1a1a);
                    border: 1px solid rgba(128,128,128,0.2); border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5); padding: 16px; z-index: 20005;
                    color: var(--text-color, #fff); font-family: sans-serif; display: none;
                }
                .${CONFIG.CLASSES.MENU}.visible { display: block; }

                /* Элементы меню */
                .bx-menu-title {
                    text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 12px;
                    padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; user-select: none; transition: color 0.2s;
                }
                .bx-menu-title:hover { color: #f4511e; }
                .bx-menu-title::after { content: '✕'; float: right; font-size: 12px; color: #777; margin-top: 2px; }
                .bx-menu-title:hover::after { color: #fff; }

                .bx-category-header {
                    font-size: 11px; font-weight: bold; color: #bbb;
                    text-transform: uppercase; margin: 12px 0 6px 0; letter-spacing: 0.5px;
                    cursor: pointer; display: flex; justify-content: space-between; align-items: center;
                    user-select: none; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .bx-category-header:hover { color: #fff; }
                .bx-category-header::after { content: '▼'; font-size: 8px; transition: transform 0.2s; }
                .bx-category-header.collapsed::after { transform: rotate(-90deg); }

                .bx-category-content { overflow: hidden; transition: max-height 0.3s ease-out; }
                .bx-category-content.collapsed { max-height: 0; }

                .bx-input-group { display: flex; justify-content: space-between; margin-bottom: 10px; gap: 10px; }
                .bx-input-row { display: flex; flex-direction: column; flex: 1; }
                .bx-input-row span { font-size: 11px; color: #aaa; margin-bottom: 4px; }
                .bx-input-row input {
                    background: #333; border: 1px solid #555; color: #fff;
                    padding: 4px; border-radius: 4px; width: 100%; box-sizing: border-box;
                }

                .bx-overlay-controls {
                    margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05);
                    border-radius: 8px; width: 100%; box-sizing: border-box;
                }
                .bx-overlay-title { font-size: 12px; color: #ccc; margin-bottom: 8px; text-align: left; }

                .bx-btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: background 0.2s; }
                .bx-label { display: flex; align-items: center; margin-bottom: 10px; cursor: pointer; user-select: none; }
                .bx-checkbox { margin-right: 10px; transform: scale(1.2); }
                .bx-divider { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 12px 0; }
                .bx-btn-primary { background: #f4511e; color: white; }
                .bx-btn-primary:hover { background: #d84315; }
                .bx-btn-restore { background: #4caf50; color: white; margin-top: 8px; }

                /* Оверлей блокировки экрана */
                .${CONFIG.CLASSES.OVERLAY} {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.85); z-index: 20000;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: sans-serif;
                }
                .bx-overlay-content { text-align: center; width: 400px; max-width: 90%; }
                .bx-status-text { margin-bottom: 16px; font-size: 18px; }
                .${CONFIG.CLASSES.PROGRESS_BAR} {
                    width: 100%; height: 8px; background: #444; border-radius: 4px; overflow: hidden; margin-bottom: 20px;
                    transition: opacity 0.3s;
                }
                .${CONFIG.CLASSES.PROGRESS_FILL} {
                    height: 100%; background: #f4511e; width: 0%; transition: width 0.3s ease;
                }
                .bx-btn-cancel { background: #e53935; color: white; width: auto; padding: 8px 32px; }

                /* Стилизация скрытых изображений */
                .${CONFIG.CLASSES.HIDDEN_IMAGE} {
                    display: flex; align-items: center; justify-content: center;
                    background: #222; border: 1px dashed #555; color: #777;
                    font-size: 12px; margin: 4px 0; width: 100%; box-sizing: border-box;
                    transition: height 0.2s, min-height 0.2s;
                }
                .bx-content-image-layout { min-height: 150px; height: auto; }

                @keyframes bx-fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

                /* Всплывающие уведомления */
                .${CONFIG.CLASSES.TOAST} {
                    position: fixed; bottom: 30px; right: 30px;
                    background: rgba(30, 30, 30, 0.95); border-left: 4px solid #4caf50;
                    color: #fff; padding: 12px 24px; border-radius: 4px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.4); z-index: 21000;
                    font-size: 14px; font-weight: 500; pointer-events: none;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity 0.4s cubic-bezier(0.2, 0, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0, 0.2, 1);
                    max-width: 300px; width: auto; line-height: 1.4; right: 20px;
                }
                .${CONFIG.CLASSES.TOAST}.visible { opacity: 1; transform: translateY(0); }

                /* Класс для элементов в процессе обработки */
                .${CONFIG.CLASSES.PROCESSING} {
                    opacity: 0.6 !important; pointer-events: none !important;
                    cursor: wait !important; transition: opacity 0.2s;
                }

                /* Оптимизация рендеринга для активного состояния */
                .bx-active article[class*="Feed-scss--module_itemWrap"],
                .bx-active div[class*="Post-scss--module_root"] {
                    content-visibility: auto; contain-intrinsic-size: 1px 800px;
                    contain: layout style paint;
                }
                .bx-active div[class*="Comment-scss--module_root"] {
                    content-visibility: auto; contain-intrinsic-size: 1px 150px;
                }
                .bx-force-frozen { content-visibility: hidden !important; contain: strict !important; pointer-events: none !important; }

                /* Глобальный режим скрытия медиа-контента */
                .bx-global-blind-mode img, .bx-global-blind-mode video, .bx-global-blind-mode canvas,
                .bx-global-blind-mode iframe, .bx-global-blind-mode embed, .bx-global-blind-mode object,
                .bx-global-blind-mode [class*="Player"], .bx-global-blind-mode [class*="Video"],
                .bx-global-blind-mode svg, .bx-global-blind-mode [class*="avatar"], .bx-global-blind-mode [style*="background-image"] {
                    visibility: hidden !important; opacity: 0 !important;
                    transition: none !important; animation: none !important;
                }
            `;
            GM_addStyle(css);
        }

        // Наблюдение за изменениями DOM для внедрения кнопок управления.
        startHeaderObserver() {
            const inject = () => {
                // Обработка изменения URL для сброса состояния при навигации SPA.
                if (window.location.href !== this.lastUrl) {
                    this.loadSettings();
                    this.lastUrl = window.location.href;
                    this._hasAutoStarted = false;
                    if (this.queueManager && this.queueManager.isRunning) {
                        this.queueManager.stop();
                    }
                }

                // Вставка кнопки настроек в шапку сайта.
                const headerTarget = document.querySelector(CONFIG.SELECTORS.HEADER_CONTAINER);
                if (headerTarget) {
                    let headerBtn = headerTarget.querySelector(':scope > .' + CONFIG.CLASSES.GEAR_CONTAINER);
                    if (!headerBtn) {
                        headerBtn = this.createGearButton('header');
                        if (headerTarget.firstChild) headerTarget.insertBefore(headerBtn, headerTarget.firstChild);
                        else headerTarget.appendChild(headerBtn);
                    }
                }

                // Вставка кнопки настроек в футер (только для режима одиночного поста).
                const singlePostFooter = document.querySelector(CONFIG.SELECTORS.SINGLE_POST_FOOTER);
                const isPostUrl = window.location.href.includes('/posts/');
                const isSinglePostMode = isPostUrl && !!singlePostFooter;

                if (isSinglePostMode) {
                    const footerTarget = document.querySelector(CONFIG.SELECTORS.SINGLE_POST_FOOTER);
                    if (footerTarget) {
                        let footerBtn = footerTarget.querySelector(':scope > .' + CONFIG.CLASSES.GEAR_CONTAINER);
                        if (!footerBtn) {
                            footerBtn = this.createGearButton('content');
                            if (footerTarget.firstChild) footerTarget.insertBefore(footerBtn, footerTarget.firstChild);
                            else footerTarget.appendChild(footerBtn);
                        }
                    }
                } else {
                    const extraBtns = document.querySelectorAll(CONFIG.SELECTORS.SINGLE_POST_FOOTER + ' .' + CONFIG.CLASSES.GEAR_CONTAINER);
                    extraBtns.forEach(btn => btn.remove());
                }

                // Запуск автоматической обработки при наличии соответствующих настроек.
                if (this.settings.autoStart && !this._hasAutoStarted && isSinglePostMode) {
                    this._hasAutoStarted = true;
                    setTimeout(() => this.queueManager.start(this.settings), 500);
                }
            };

            inject();
            window.addEventListener('load', inject);

            // Использование MutationObserver для отслеживания динамических изменений.
            const observer = new MutationObserver((mutations) => {
                let shouldInject = false;
                for (const m of mutations) {
                    if (m.addedNodes.length) {
                        shouldInject = true;
                        break;
                    }
                }
                if (shouldInject) inject();
            });

            const appRoot = document.querySelector('#root') || document.body;
            observer.observe(appRoot, { childList: true, subtree: true });
        }

        // Создание DOM-элемента кнопки настроек.
        createGearButton(type = 'header') {
            const container = document.createElement('div');
            container.className = CONFIG.CLASSES.GEAR_CONTAINER;

            if (type === 'header') {
                container.classList.add('bx-header-btn');
            } else {
                container.classList.add('bx-content-btn');
            }

            container.title = 'Настройки авторазвертывания';
            container.innerHTML = `
                <span class="${CONFIG.CLASSES.GEAR_ICON}">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </span>
            `;

            container.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu(container);
            });
            return container;
        }

        // Переключение видимости меню настроек.
        toggleMenu(anchor = null) {
            if (this.elements.menu && this.elements.menu.classList.contains('visible')) {
                this.closeMenu();
                return;
            }
            this.renderMenu();

            if (anchor) {
                anchor.offsetHeight;
                anchor.classList.add('active');
            }

            setTimeout(() => {
                const outsideClick = (e) => {
                    const clickedAnchor = anchor && anchor.contains(e.target);
                    if (!this.elements.menu.contains(e.target) && !clickedAnchor) {
                        this.closeMenu();
                        document.removeEventListener('mousedown', outsideClick);
                    }
                };
                document.addEventListener('mousedown', outsideClick);
            }, 50);
        }

        // Закрытие меню настроек.
        closeMenu() {
            if (this.elements.menu) this.elements.menu.classList.remove('visible');
            const activeAnchors = document.querySelectorAll('.' + CONFIG.CLASSES.GEAR_CONTAINER + '.active');
            activeAnchors.forEach(el => el.classList.remove('active'));
        }

        // Рендеринг HTML-структуры меню настроек.
        renderMenu() {
            if (!this.elements.menu) {
                this.elements.menu = document.createElement('div');
                this.elements.menu.className = CONFIG.CLASSES.MENU;
                document.body.appendChild(this.elements.menu);
            }

            const s = this.settings;
            const uiState = JSON.parse(localStorage.getItem('bx_menu_ui_state') || '{}');
            const isCollapsed = (id) => (uiState[id] === undefined ? true : uiState[id]);
            const cls = (id) => isCollapsed(id) ? 'collapsed' : '';

            this.elements.menu.innerHTML = `
                <div class="bx-menu-title">Настройки развертывания</div>

                <div class="bx-category-header ${cls('cat-speed')}" data-target="cat-speed">Скорость и Тайминги</div>
                <div id="cat-speed" class="bx-category-content ${cls('cat-speed')}">
                    <div id="bx-reset-defaults" style="font-size: 12px; color: #aaa; margin-bottom: 5px; cursor: pointer; text-decoration: underline dotted; margin-top: 8px;" title="Нажмите, чтобы сбросить тайминги по умолчанию">Стандартная скорость (мс) [Сброс]:</div>
                    <div class="bx-input-group">
                        <div class="bx-input-row"><span>Min</span><input type="number" id="bx-delay-min" value="${s.delayMin}"></div>
                        <div class="bx-input-row"><span>Max</span><input type="number" id="bx-delay-max" value="${s.delayMax}"></div>
                        <div class="bx-input-row"><span>Wait (End)</span><input type="number" id="bx-final-delay" value="${s.finalDelay}" title="Ожидание прогрузки перед финишем"></div>
                    </div>
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-smart-speed" ${s.smartSpeed?'checked':''}><span style="color: #4fc3f7;">Умное ускорение (при очереди)</span></label>
                    <div id="bx-smart-speed-options" style="display: ${s.smartSpeed ? 'block' : 'none'}; padding-left: 10px; border-left: 2px solid #4fc3f7; margin-bottom: 10px;">
                        <div class="bx-input-group"><div class="bx-input-row"><span>Порог (шт)</span><input type="number" id="bx-speed-threshold" value="${s.speedThreshold}"></div></div>
                        <div class="bx-input-group">
                            <div class="bx-input-row"><span>Fast Min</span><input type="number" id="bx-fast-min" value="${s.fastDelayMin}"></div>
                            <div class="bx-input-row"><span>Fast Max</span><input type="number" id="bx-fast-max" value="${s.fastDelayMax}"></div>
                        </div>
                    </div>
                </div>

                <div class="bx-divider"></div>

                <div class="bx-category-header ${cls('cat-text')}" data-target="cat-text">Раскрытие текста (Без подгрузки)</div>
                <div id="cat-text" class="bx-category-content ${cls('cat-text')}">
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-posts" ${s.expandPosts?'checked':''}><span>Посты: "Читать далее"</span></label>
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-comment-text" ${s.expandCommentText?'checked':''}><span>Комменты: "Раскрыть комментарий"</span></label>
                </div>

                <div class="bx-category-header ${cls('cat-load')}" data-target="cat-load">Загрузка данных (Скролл / API)</div>
                <div id="cat-load" class="bx-category-content ${cls('cat-load')}">
                    <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:10px;">
                        <label class="bx-label" title="Автоматически запускать скрипт при открытии страницы"><input type="checkbox" class="bx-checkbox" id="bx-opt-autostart" ${s.autoStart?'checked':''}><span>Автоматическая загрузка постов</span></label>
                        <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-autoscroll" ${s.autoLoadNewPosts?'checked':''}><span>Авто-скролл вниз</span></label>
                        <div id="bx-wrapper-scroll-limit" style="margin-left: 24px; display: ${s.autoLoadNewPosts?'block':'none'}; font-size: 11px; color: #aaa;">Макс. экранов: <input type="number" id="bx-max-scrolls" value="${s.maxScrollSteps || 50}" style="width: 50px; background: #333; border: 1px solid #555; color: white; padding: 2px;"></div>
                        <label class="bx-label" id="bx-wrapper-loadmore" style="margin-left: 24px; display: ${s.autoLoadNewPosts?'flex':'none'};" title="Автоматически нажимать кнопку 'Загрузить ещё', если она появится вместо скролла"><input type="checkbox" class="bx-checkbox" id="bx-opt-loadmore-btn" ${s.autoClickLoadMore?'checked':''}><span>Нажимать кн. "Загрузить ещё"</span></label>
                    </div>
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-comments" ${s.expandComments?'checked':''}><span>Комменты: "Показать ещё"</span></label>
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-replies" ${s.expandReplies?'checked':''}><span>Ответы: "Показать ответы"</span></label>
                </div>

                <div class="bx-category-header ${cls('cat-opt')}" data-target="cat-opt" style="color: #ffb74d;">Оптимизация</div>
                <div id="cat-opt" class="bx-category-content ${cls('cat-opt')}">
                    <label class="bx-label"><input type="checkbox" class="bx-checkbox" id="bx-opt-turbo" ${s.turboMode?'checked':''}><span>Turbo Mode (Без картинок)</span></label>
                    <label class="bx-label" id="bx-restore-wrapper" style="font-size:12px; margin-left:24px; display:${s.turboMode?'flex':'none'}"><input type="checkbox" class="bx-checkbox" id="bx-opt-restore" ${s.restoreOnFinish?'checked':''}><span>Загрузить в конце</span></label>
                </div>

                <div class="bx-divider"></div>
                <button class="bx-btn bx-btn-primary" id="bx-run-btn">Применить и Старт</button>
                <button class="bx-btn bx-btn-restore" id="bx-img-btn" style="display:${s.turboMode?'block':'none'}">Загрузить скрытые картинки</button>
                <div id="bx-clear-selectors" style="font-size:11px; color:#e53935; margin-top:10px; cursor:pointer; text-align:center; text-decoration:underline;">Сбросить авто-селекторы</div>
            `;

            this.elements.menu.classList.add('visible');
            this.bindEvents();
        }

        // Привязка обработчиков событий к элементам меню.
        bindEvents() {
            const m = this.elements.menu;

            m.querySelector('#bx-clear-selectors').onclick = () => {
                localStorage.removeItem('bx_auto_selector_readmore');
                sessionStorage.removeItem('bx_auto_selector_readmore');
                this.showToast('Селекторы сброшены. Обновите страницу.');
            };

            m.querySelector('.bx-menu-title').onclick = () => this.closeMenu();

            m.querySelectorAll('.bx-category-header').forEach(header => {
                header.onclick = () => {
                    const targetId = header.dataset.target;
                    const content = m.querySelector('#' + targetId);

                    header.classList.toggle('collapsed');
                    content.classList.toggle('collapsed');

                    const uiState = JSON.parse(localStorage.getItem('bx_menu_ui_state') || '{}');
                    uiState[targetId] = header.classList.contains('collapsed');
                    localStorage.setItem('bx_menu_ui_state', JSON.stringify(uiState));
                };
            });

            const bind = (k, id) => {
                m.querySelector(id).onchange = (e) => {
                    this.settings[k] = e.target.checked;
                    this.saveSettings();
                    if (k === 'turboMode') {
                        m.querySelector('#bx-img-btn').style.display = e.target.checked ? 'block' : 'none';
                        m.querySelector('#bx-restore-wrapper').style.display = e.target.checked ? 'flex' : 'none';
                    }
                    if (k === 'smartSpeed') {
                        m.querySelector('#bx-smart-speed-options').style.display = e.target.checked ? 'block' : 'none';
                    }
                    if (k === 'autoLoadNewPosts') {
                        m.querySelector('#bx-wrapper-loadmore').style.display = e.target.checked ? 'flex' : 'none';
                        m.querySelector('#bx-wrapper-scroll-limit').style.display = e.target.checked ? 'block' : 'none';
                    }
                };
            };

            bind('expandPosts', '#bx-opt-posts');
            bind('autoStart', '#bx-opt-autostart');
            bind('autoLoadNewPosts', '#bx-opt-autoscroll');
            bind('autoClickLoadMore', '#bx-opt-loadmore-btn');
            bind('expandCommentText', '#bx-opt-comment-text');
            bind('expandComments', '#bx-opt-comments');
            bind('expandReplies', '#bx-opt-replies');
            bind('turboMode', '#bx-opt-turbo');
            bind('restoreOnFinish', '#bx-opt-restore');
            bind('smartSpeed', '#bx-opt-smart-speed');

            m.querySelector('#bx-max-scrolls').onchange = (e) => {
                this.settings.maxScrollSteps = parseInt(e.target.value) || 50;
                this.saveSettings();
            };

            const saveInputs = () => {
                this.settings.delayMin = parseInt(m.querySelector('#bx-delay-min').value) || 60;
                this.settings.delayMax = parseInt(m.querySelector('#bx-delay-max').value) || 100;
                this.settings.finalDelay = parseInt(m.querySelector('#bx-final-delay').value) || 1500;
                this.settings.speedThreshold = parseInt(m.querySelector('#bx-speed-threshold').value) || 10;
                this.settings.fastDelayMin = parseInt(m.querySelector('#bx-fast-min').value) || 20;
                this.settings.fastDelayMax = parseInt(m.querySelector('#bx-fast-max').value) || 50;
                this.saveSettings();
            };

            ['#bx-delay-min', '#bx-delay-max', '#bx-final-delay', '#bx-speed-threshold', '#bx-fast-min', '#bx-fast-max']
                .forEach(sel => m.querySelector(sel).onchange = saveInputs);

            m.querySelector('#bx-reset-defaults').onclick = () => {
                const defaults = {
                    expandPosts: true, autoLoadNewPosts: false, autoStart: false, maxScrollSteps: 50,
                    autoClickLoadMore: false, expandComments: true, expandReplies: true, expandCommentText: true,
                    turboMode: true, restoreOnFinish: true, delayMin: 60, delayMax: 120, finalDelay: 500,
                    smartSpeed: true, speedThreshold: 5, fastDelayMin: 10, fastDelayMax: 20
                };
                Object.assign(this.settings, defaults);

                m.querySelector('#bx-opt-posts').checked = defaults.expandPosts;
                m.querySelector('#bx-opt-autostart').checked = defaults.autoStart;
                m.querySelector('#bx-opt-autoscroll').checked = defaults.autoLoadNewPosts;
                m.querySelector('#bx-opt-loadmore-btn').checked = defaults.autoClickLoadMore;
                m.querySelector('#bx-opt-comments').checked = defaults.expandComments;
                m.querySelector('#bx-opt-replies').checked = defaults.expandReplies;
                m.querySelector('#bx-opt-comment-text').checked = defaults.expandCommentText;
                m.querySelector('#bx-opt-turbo').checked = defaults.turboMode;
                m.querySelector('#bx-opt-restore').checked = defaults.restoreOnFinish;
                m.querySelector('#bx-opt-smart-speed').checked = defaults.smartSpeed;

                m.querySelector('#bx-max-scrolls').value = defaults.maxScrollSteps;
                m.querySelector('#bx-delay-min').value = defaults.delayMin;
                m.querySelector('#bx-delay-max').value = defaults.delayMax;
                m.querySelector('#bx-final-delay').value = defaults.finalDelay;
                m.querySelector('#bx-speed-threshold').value = defaults.speedThreshold;
                m.querySelector('#bx-fast-min').value = defaults.fastDelayMin;
                m.querySelector('#bx-fast-max').value = defaults.fastDelayMax;

                m.querySelector('#bx-img-btn').style.display = defaults.turboMode ? 'block' : 'none';
                m.querySelector('#bx-restore-wrapper').style.display = defaults.turboMode ? 'flex' : 'none';
                m.querySelector('#bx-smart-speed-options').style.display = defaults.smartSpeed ? 'block' : 'none';
                m.querySelector('#bx-wrapper-loadmore').style.display = defaults.autoLoadNewPosts ? 'flex' : 'none';

                this.saveSettings();

                const el = m.querySelector('#bx-reset-defaults');
                const originalText = el.textContent;
                el.textContent = 'Настройки восстановлены!';
                el.style.color = '#4caf50';
                setTimeout(() => { el.textContent = originalText; el.style.color = '#aaa'; }, 1000);
            };

            m.querySelector('#bx-run-btn').onclick = () => { this.closeMenu(); this.queueManager.start(this.settings); };
            m.querySelector('#bx-img-btn').onclick = () => DomPatcher.restoreAllImages();
        }

        // Создание оверлея состояния процесса с элементами управления.
        createOverlay(initialStatus) {
            if (this.elements.overlay) {
                this.elements.overlay.querySelector('#bx-status').textContent = initialStatus;
                this.elements.overlay.querySelector('#bx-progress').style.width = '0%';
                this.elements.overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                return;
            }

            const overlay = document.createElement('div');
            overlay.className = CONFIG.CLASSES.OVERLAY;
            document.body.style.overflow = 'hidden';
            const s = this.settings;

            overlay.innerHTML = `
                <div class="bx-overlay-content">
                    <div class="bx-status-text" id="bx-status">${initialStatus}</div>
                    <div class="${CONFIG.CLASSES.PROGRESS_BAR}">
                        <div class="${CONFIG.CLASSES.PROGRESS_FILL}" id="bx-progress"></div>
                    </div>

                    <div class="bx-overlay-controls">
                        <div class="bx-overlay-title">Управление параметрами на лету</div>
                        <div class="bx-input-group">
                            <div class="bx-input-row"><span>Min</span><input type="number" id="bx-live-min" value="${s.delayMin}"></div>
                            <div class="bx-input-row"><span>Max</span><input type="number" id="bx-live-max" value="${s.delayMax}"></div>
                            <div class="bx-input-row"><span>Wait</span><input type="number" id="bx-live-final" value="${s.finalDelay}" title="Wait (End)"></div>
                        </div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 8px 0 8px 0; padding-top: 8px;">
                            <div style="font-size: 11px; color: #4fc3f7; margin-bottom: 5px; text-align: left;">Настройки ускорения (Turbo/Smart):</div>
                            <div class="bx-input-group">
                                <div class="bx-input-row"><span>Порог</span><input type="number" id="bx-live-threshold" value="${s.speedThreshold}"></div>
                                <div class="bx-input-row"><span>Fast Min</span><input type="number" id="bx-live-fast-min" value="${s.fastDelayMin}"></div>
                                <div class="bx-input-row"><span>Fast Max</span><input type="number" id="bx-live-fast-max" value="${s.fastDelayMax}"></div>
                            </div>
                        </div>
                        <button class="bx-btn bx-btn-primary" id="bx-live-update" style="font-size: 12px; padding: 6px;">Применить новые параметры</button>
                    </div>
                    <div style="height: 15px;"></div>
                    <button class="bx-btn bx-btn-cancel" id="bx-cancel-btn">Отмена</button>
                </div>
            `;

            document.body.appendChild(overlay);
            this.elements.overlay = overlay;

            overlay.querySelector('#bx-cancel-btn').addEventListener('click', () => {
                this.queueManager.stop();
            });

            overlay.querySelector('#bx-live-update').addEventListener('click', (e) => {
                const btn = e.target;
                const newValues = {
                    delayMin: parseInt(overlay.querySelector('#bx-live-min').value) || 60,
                    delayMax: parseInt(overlay.querySelector('#bx-live-max').value) || 120,
                    finalDelay: parseInt(overlay.querySelector('#bx-live-final').value) || 500,
                    speedThreshold: parseInt(overlay.querySelector('#bx-live-threshold').value) || 5,
                    fastDelayMin: parseInt(overlay.querySelector('#bx-live-fast-min').value) || 10,
                    fastDelayMax: parseInt(overlay.querySelector('#bx-live-fast-max').value) || 20
                };

                Object.assign(this.settings, newValues);
                this.saveSettings();
                this.queueManager.updateLiveSettings(newValues);

                const oldText = btn.textContent;
                btn.textContent = 'Сохранено и применено!';
                btn.style.background = '#4caf50';
                setTimeout(() => { btn.textContent = oldText; btn.style.background = ''; }, 1000);
            });
        }

        // Обновление текстового статуса в оверлее.
        updateStatus(text) {
             if (this.elements.overlay) {
                 this.elements.overlay.querySelector('#bx-status').textContent = text;
             }
        }

        // Обновление прогресс-бара и статуса с защитой от частых перерисовок (requestAnimationFrame).
        updateProgress(current, total, customText = null) {
            if (!this.elements.overlay) return;
            if (this._rafPending) return;

            this._rafPending = true;
            requestAnimationFrame(() => {
                if (!this.elements.overlay) {
                    this._rafPending = false;
                    return;
                }
                const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
                const text = customText || `Обработано ${current} из ${total}`;
                const bar = this.elements.overlay.querySelector('#bx-progress');
                const status = this.elements.overlay.querySelector('#bx-status');

                if (status) status.textContent = text;
                if (bar) bar.style.width = `${percentage}%`;
                this._rafPending = false;
            });
        }

        // Удаление оверлея из DOM.
        removeOverlay() {
            if (this.elements.overlay) {
                this.elements.overlay.remove();
                this.elements.overlay = null;
                document.body.style.overflow = '';
            }
        }

        closeOverlayWithDelay(delayMs = 1500) {
            setTimeout(() => {
                this.removeOverlay();
            }, delayMs);
        }

        // Отображение всплывающего уведомления (Toast).
        showToast(text, duration = 3000) {
            let toast = document.querySelector('.' + CONFIG.CLASSES.TOAST);
            if (!toast) {
                toast = document.createElement('div');
                toast.className = CONFIG.CLASSES.TOAST;
                document.body.appendChild(toast);
            }

            toast.textContent = text;
            if (this._toastTimer) clearTimeout(this._toastTimer);

            requestAnimationFrame(() => {
                toast.classList.add('visible');
                this._toastTimer = setTimeout(() => {
                    toast.classList.remove('visible');
                }, duration);
            });
        }
    }

    /**
     * ==================================================================================
     * РАЗДЕЛ 3: ВЗАИМОДЕЙСТВИЕ С DOM (DomPatcher)
     * ==================================================================================
     */
    
    // Класс содержит статические методы для анализа DOM, выполнения кликов и перехвата ресурсов.
    class DomPatcher {
        static isRestoring = false;
        static isTurboActive = false;

        // Проверка элемента на принадлежность к опасным действиям (донат, подписка).
        static isDangerElement(el) {
            const text = (el.innerText || '').toLowerCase();
            const cls = (el.className || '').toLowerCase();
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            const testId = (el.getAttribute('data-test-id') || '').toLowerCase();

            if (testId.includes('donation') || testId.includes('subscribe') || testId.includes('gotoblog')) return true;
            if (CONFIG.DANGER_WORDS.some(w => text.includes(w))) return true;
            if (cls.includes('donate') || cls.includes('support') || cls.includes('subscribe') || cls.includes('payment') || cls.includes('gotoblog')) return true;
            if (CONFIG.DANGER_WORDS.some(w => aria.includes(w))) return true;
            const dangerParent = el.closest('[class*="Donation"], [class*="Support"], [class*="Subscribe"], [class*="Payment"]');
            if (dangerParent) return true;

            return false;
        }

        // Сканирование переданного узла DOM на наличие целевых интерактивных элементов.
        static scanNode(contextNode, settings, tasks, processedSet, isFresh = false) {
            if (!contextNode || !contextNode.querySelectorAll) return;

            const addIfValid = (type, btn) => {
                // Если элемент найден только что (isFresh), мы доверяем Observer'у и пропускаем тяжелую проверку видимости.
                const isVisible = isFresh || DomPatcher.isVisible(btn);
                if (!processedSet.has(btn) && isVisible) {
                    if (DomPatcher.isDangerElement(btn)) return;
                    tasks.push({ type, el: btn });
                }
            };

            if (settings.expandPosts) {
                const btns = contextNode.querySelectorAll(CONFIG.SELECTORS.BTN_READ_MORE_POST);
                btns.forEach(btn => addIfValid('post', btn));
            }
            if (settings.expandCommentText) {
                contextNode.querySelectorAll(CONFIG.SELECTORS.BTN_EXPAND_COMMENT_TEXT)
                    .forEach(btn => addIfValid('comment_text', btn));
            }
            if (settings.expandComments) {
                contextNode.querySelectorAll(CONFIG.SELECTORS.BTN_LOAD_COMMENTS)
                    .forEach(btn => addIfValid('load_comments', btn));
            }
            if (settings.expandReplies) {
                contextNode.querySelectorAll(CONFIG.SELECTORS.BTN_LOAD_REPLIES)
                    .forEach(btn => addIfValid('load_replies', btn));
            }
        }

        // Полное сканирование документа (используется при инициализации).
        static scan(settings) {
            const tasks = [];
            const processed = QueueManager.getProcessedSet();
            DomPatcher.scanNode(document.body, settings, tasks, processed, false);

            // Резервный поиск по тексту, если CSS-селекторы не сработали.
            const searchTargets = [];
            if (settings.expandPosts) searchTargets.push({ type: 'post', words: CONFIG.TEXT_MATCH.POST });
            if (settings.expandCommentText) searchTargets.push({ type: 'comment_text', words: CONFIG.TEXT_MATCH.COMMENT_TEXT });
            if (settings.expandComments) searchTargets.push({ type: 'load_comments', words: CONFIG.TEXT_MATCH.LOAD_COMMENTS });
            if (settings.expandReplies) searchTargets.push({ type: 'load_replies', words: CONFIG.TEXT_MATCH.LOAD_REPLIES });

            if (searchTargets.length > 0) {
                const allButtons = document.getElementsByTagName('button');
                let cssFoundCount = document.querySelectorAll(CONFIG.SELECTORS.BTN_READ_MORE_POST).length;
                let textPostFoundCount = 0;
                let lastPostBtn = null;

                for (let btn of allButtons) {
                    if (processed.has(btn)) continue;
                    if (!btn.innerText) continue;
                    const text = btn.innerText.trim().toLowerCase();
                    if (text.length > 50 || text.length < 3) continue;
                    if (DomPatcher.isDangerElement(btn)) continue;
                    if (!DomPatcher.isVisible(btn)) continue;

                    for (const target of searchTargets) {
                        if (target.words.some(word => text.includes(word))) {
                             const alreadyInTasks = tasks.some(t => t.el === btn);
                             if (!alreadyInTasks) {
                                 tasks.push({ type: target.type, el: btn });
                                 if (target.type === 'post') {
                                     textPostFoundCount++;
                                     lastPostBtn = btn;
                                 }
                             }
                             break;
                        }
                    }
                }

                if (settings.expandPosts && cssFoundCount === 0 && textPostFoundCount > 0 && lastPostBtn) {
                    DomPatcher.repairSelector(lastPostBtn);
                }
            }
            return tasks;
        }

        // Проверка видимости элемента (оптимизирована через offsetParent).
        static isVisible(el) {
            return el.offsetParent !== null;
        }

        // Анализ кнопки и попытка создать новый CSS-селектор, если старый не работает.
        static repairSelector(btn) {
            if (!btn.className) return;
            const classes = (typeof btn.className === 'string' ? btn.className : '').split(/\s+/);
            let bestClass = classes.find(c => c.toLowerCase().includes('readmore'));
            let isSmartMatch = !!bestClass;

            if (!bestClass) {
                 const badWords = ['container', 'wrapper', 'root', 'box', 'layout', 'grid', 'flex'];
                 const candidates = classes.filter(c => !badWords.some(bw => c.toLowerCase().includes(bw)));
                 bestClass = candidates.sort((a, b) => b.length - a.length)[0];
            }

            if (bestClass) {
                let newSelector;
                const isSemantic = /btn|button|more|show|expand|action|read/i.test(bestClass);

                if (/donate|pay|support|sub|money/i.test(bestClass)) return;
                if (bestClass.length < 5 || bestClass.includes('Button-scss') || bestClass === 'button') return;
                if (!isSmartMatch && !isSemantic) return;

                if (isSmartMatch) {
                    const match = bestClass.match(/^(.*readmore[-_]?)/i);
                    if (match && match[1]) {
                        newSelector = `[class*="${match[1]}"]`;
                    } else {
                        newSelector = '.' + bestClass;
                    }
                } else {
                    newSelector = '.' + bestClass;
                }

                if (newSelector && !CONFIG.SELECTORS.BTN_READ_MORE_POST.includes(newSelector)) {
                    CONFIG.SELECTORS.BTN_READ_MORE_POST = newSelector + ', ' + CONFIG.SELECTORS.BTN_READ_MORE_POST;
                    sessionStorage.setItem('bx_auto_selector_readmore', newSelector);
                    localStorage.setItem('bx_selector_trust_level', '0');
                }
            }
        }

        // Выполнение безопасного клика с предварительной прокруткой и обработкой состояния.
        static async executeClick(task, settings) {
            const btn = task.el;
            if (!document.body.contains(btn)) return;

            if (DomPatcher.isDangerElement(btn)) return;

            try {
                btn.scrollIntoView({ block: 'center', behavior: 'instant' });
                await new Promise(resolve => setTimeout(resolve, 1));
            } catch (e) {}

            btn.classList.add(CONFIG.CLASSES.PROCESSING);

            try {
                btn.click();
                const tempSelector = sessionStorage.getItem('bx_auto_selector_readmore');
                if (tempSelector && btn.matches(tempSelector)) {
                    let trustLevel = parseInt(localStorage.getItem('bx_selector_trust_level') || '0');
                    trustLevel++;
                    localStorage.setItem('bx_selector_trust_level', trustLevel);

                    if (trustLevel >= 15 && localStorage.getItem('bx_auto_selector_readmore') !== tempSelector) {
                        localStorage.setItem('bx_auto_selector_readmore', tempSelector);
                        if (QueueManager._instance && QueueManager._instance.ui) {
                             QueueManager._instance.ui.showToast('Новый селектор проверен и сохранен!');
                        }
                    }
                }
            } catch (e) {
                btn.classList.remove(CONFIG.CLASSES.PROCESSING);
                throw e;
            }
        }

        // Обработка изображений внутри узла для режима Turbo.
        static suppressImagesInNode(node) {
            if (node.tagName === 'IMG') {
                DomPatcher._processImg(node);
            }
            else if (node.querySelectorAll) {
                const images = node.querySelectorAll('img');
                images.forEach(img => DomPatcher._processImg(img));
            }
        }

        // Установка перехватчика свойств src/srcset прототипа HTMLImageElement.
        static installImageInterceptor() {
            if (DomPatcher._interceptorInstalled) return;

            ['src', 'srcset'].forEach(prop => {
                const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, prop);
                if (!descriptor) return;

                Object.defineProperty(HTMLImageElement.prototype, prop, {
                    set: function(value) {
                        if (DomPatcher.isRestoring) {
                            descriptor.set.call(this, value);
                            return;
                        }

                        if (!DomPatcher.isTurboActive) {
                            descriptor.set.call(this, value);
                            return;
                        }

                        if (value && typeof value === 'string' && !value.startsWith('data:')) {
                             const lowerVal = value.toLowerCase();
                             if (lowerVal.includes('smile') || lowerVal.includes('emoji') || lowerVal.includes('avatar') || lowerVal.includes('icon')) {
                                 descriptor.set.call(this, value);
                                 return;
                             }

                             const w = this.getAttribute('width');
                             const h = this.getAttribute('height');
                             if ((w && parseInt(w) < 50) || (h && parseInt(h) < 50)) {
                                 descriptor.set.call(this, value);
                                 return;
                             }

                             const cls = (this.getAttribute('class') || '').toLowerCase();
                             if (cls.includes('avatar') || cls.includes('user') || cls.includes('icon') || cls.includes('emoji') ||
                                 cls.includes('cover') || cls.includes('subscription') || cls.includes('level') || cls.includes('badge')) {
                                 descriptor.set.call(this, value);
                                 return;
                             }

                             const key = 'original' + prop.charAt(0).toUpperCase() + prop.slice(1);
                             this.dataset[key] = value;
                             this.dataset.pendingSrc = "true";
                             this.classList.add('bx-hidden-image-placeholder');

                             const placeholder = prop === 'src'
                                ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                : "";

                             if (prop === 'src' && w && h) {
                                 this.style.aspectRatio = `${w} / ${h}`;
                                 this.style.height = 'auto';
                             }

                             descriptor.set.call(this, placeholder);
                        } else {
                            descriptor.set.call(this, value);
                        }
                    },
                    get: function() {
                        const key = 'original' + prop.charAt(0).toUpperCase() + prop.slice(1);
                        return this.dataset[key] || descriptor.get.call(this);
                    }
                });
            });

            DomPatcher._interceptorInstalled = true;
        }

        // Внутренняя логика обработки тега img (сокрытие и сохранение оригинала).
        static _processImg(img) {
            if (img.dataset.pendingSrc) {
                if (img.closest(CONFIG.SELECTORS.POST_ROOT) || img.closest('[class*="PostContent"]')) {
                    if (!img.style.aspectRatio) {
                        img.classList.add('bx-content-image-layout');
                    }
                }
                else {
                    const cls = (img.className || '').toLowerCase();
                    if (cls.includes('cover') || cls.includes('subscription') || cls.includes('level') || cls.includes('badge')) {
                         DomPatcher.isRestoring = true;
                         img.src = img.dataset.originalSrc;
                         DomPatcher.isRestoring = false;

                         img.removeAttribute('data-pending-src');
                         img.classList.remove(CONFIG.CLASSES.HIDDEN_IMAGE);
                         img.classList.remove('bx-hidden-image-placeholder');
                         img.style.aspectRatio = '';
                         img.style.height = '';
                         return;
                    }
                }
                return;
            }

            const cls = (img.className || '').toLowerCase();
            if (cls.includes('avatar') || img.src.includes('smile') || img.src.includes('emoji') ||
                cls.includes('cover') || cls.includes('subscription') || cls.includes('level') || cls.includes('badge')) return;

            const originalSrc = img.src;
            const originalSrcset = img.srcset;

            if ((!originalSrc || originalSrc.startsWith('data:')) && !originalSrcset) return;

            img.dataset.pendingSrc = "true";
            img.dataset.originalStyles = img.getAttribute('style') || '';
            if (originalSrc && !originalSrc.startsWith('data:')) img.dataset.originalSrc = originalSrc;
            if (originalSrcset) img.dataset.originalSrcset = originalSrcset;

            const w = img.getAttribute('width') || img.width;
            const h = img.getAttribute('height') || img.height;
            if (w && h && w > 50 && h > 50) {
                 img.style.aspectRatio = `${w} / ${h}`;
            } else {
                 img.classList.add('bx-content-image-layout');
            }

            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            img.srcset = "";
            img.classList.add(CONFIG.CLASSES.HIDDEN_IMAGE);
        }

        // Восстановление всех скрытых изображений на странице.
        static restoreAllImages() {
            DomPatcher.isRestoring = true;
            DomPatcher.isTurboActive = false;

            const images = document.querySelectorAll(`img[data-pending-src]`);
            let count = 0;
            images.forEach(img => {
                if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
                if (img.dataset.originalSrcset) img.srcset = img.dataset.originalSrcset;

                const originalStyles = img.dataset.originalStyles || '';
                img.setAttribute('style', originalStyles);

                img.style.aspectRatio = '';
                img.style.height = '';

                img.removeAttribute('data-pending-src');
                img.removeAttribute('data-original-styles');
                img.removeAttribute('data-original-src');
                img.removeAttribute('data-original-srcset');
                img.classList.remove(CONFIG.CLASSES.HIDDEN_IMAGE);
                img.classList.remove('bx-hidden-image-placeholder');
                img.classList.remove('bx-content-image-layout');
                count++;
            });

            DomPatcher.isRestoring = false;
        }
    }

    try {
        DomPatcher.installImageInterceptor();
    } catch(e) { console.error('Interceptor Init Error:', e); }

    /**
     * ==================================================================================
     * РАЗДЕЛ 4: УПРАВЛЕНИЕ ОЧЕРЕДЬЮ ЗАДАЧ (QueueManager)
     * ==================================================================================
     */
    
    // Класс координирует поиск задач, их выполнение, авто-скролл и виртуализацию DOM.
    class QueueManager {
        constructor() {
            this.queue = [];
            this.isRunning = false;
            this.ui = null;
            this.processedNodes = new WeakSet();
            this.enqueuedNodes = new WeakSet();
            this.isWaitingForFinalCheck = false;
            this.lastScrollHeight = 0;
            this.scrollCount = 0;
            this.scrollRetries = 0;
            this.totalDiscovered = 0;
            this.completedTasks = 0;
            this.globalObserver = null;

            this.stepsSinceHibernate = 0;
            this.hibernatedMap = new Map();
            this.lastInteraction = new WeakMap();
            this.hibernationCandidates = new WeakMap();

            this._executionStartTime = 0;
            this.lagMultiplier = 1;
            this.lastLoopEnd = 0;
            this.expectedDelay = 0;
        }

        static getProcessedSet() {
            if (!this._instance) this._instance = new QueueManager();
            return this._instance.processedNodes;
        }

        setUI(uiController) {
            this.ui = uiController;
        }

        updateLiveSettings(newVals) {
            if (this.settings) {
                Object.assign(this.settings, newVals);
            }
        }

        // Запуск процесса обработки.
        start(settings) {
            this.settings = settings;
            this.isRunning = true;
            this.ui.createOverlay('Сканирование...');

            document.body.classList.add('bx-active');

            if (this.settings.turboMode) {
                DomPatcher.isTurboActive = true;
                document.body.classList.add('bx-global-blind-mode');
            } else {
                DomPatcher.isTurboActive = false;
                document.body.classList.remove('bx-global-blind-mode');
            }

            this.queue = [];
            this.totalDiscovered = 0;
            this.completedTasks = 0;

            this.processedNodes = new WeakSet();
            this.enqueuedNodes = new WeakSet();
            this.isWaitingForFinalCheck = false;
            this.lastScrollHeight = 0;
            this.scrollCount = 0;
            this.scrollCount = 0;
            this.scrollRetries = 0;
            this.stepsSinceHibernate = 0;
            this.hibernatedMap = new Map();
            this.lagMultiplier = 1;
            this.lastLoopEnd = 0;
            this.expectedDelay = 0;

            this.startGlobalObserver();
            this.scanFull();

            setTimeout(() => this.processQueueLoop(), 100);
        }

        // Остановка процесса и очистка ресурсов.
        stop() {
            this.isRunning = false;
            this.queue = [];

            this.stopGlobalObserver();
            document.body.classList.remove('bx-active');

            DomPatcher.isTurboActive = false;
            document.body.classList.remove('bx-global-blind-mode');

            this.restoreHibernated();

            if (this.settings && this.settings.turboMode) {
                 this.ui.updateStatus('Восстановление картинок...');
                 DomPatcher.restoreAllImages();
            }

            this.ui.updateStatus('Остановлено пользователем.');
            this.ui.closeOverlayWithDelay(800);
        }

        // Добавление новых задач, найденных Наблюдателем.
        addTasksFromNode(node) {
            const newTasks = [];
            DomPatcher.scanNode(node, this.settings, newTasks, this.processedNodes, true);

            let addedCount = 0;
            newTasks.forEach(task => {
                if (!this.enqueuedNodes.has(task.el)) {
                    this.queue.push(task);
                    this.enqueuedNodes.add(task.el);
                    this.totalDiscovered++;
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                this.sortQueue();
            }

            this.ui.updateProgress(this.completedTasks, this.totalDiscovered);
        }

        // Полное сканирование страницы (используется при запуске).
        scanFull() {
            const foundTasks = DomPatcher.scan(this.settings);
            let addedCount = 0;
            foundTasks.forEach(task => {
                 if (!this.enqueuedNodes.has(task.el)) {
                    this.queue.push(task);
                    this.enqueuedNodes.add(task.el);
                    this.totalDiscovered++;
                    addedCount++;
                 }
            });

            if (addedCount > 0) {
                this.sortQueue();
            }

            this.ui.updateProgress(this.completedTasks, this.totalDiscovered);
        }

        // Сортировка очереди задач по их позиции на экране и приоритету типа.
        sortQueue() {
            const tasksWithPos = this.queue.map(task => {
                if (!task.el.isConnected) return { task, top: Infinity };
                return { task, top: task.el.getBoundingClientRect().top };
            });

            const getPriority = (type) => {
                if (['load_comments', 'load_replies', 'post'].includes(type)) return 0;
                if (type === 'comment_text') return 1;
                return 0;
            };

            const LOCALITY_THRESHOLD = 800;

            tasksWithPos.sort((a, b) => {
                const diff = a.top - b.top;

                if (Math.abs(diff) > LOCALITY_THRESHOLD) {
                    return diff;
                }

                const pA = getPriority(a.task.type);
                const pB = getPriority(b.task.type);

                if (pA !== pB) {
                    return pA - pB;
                }

                return diff;
            });

            this.queue = tasksWithPos.map(item => item.task);
        }

        // Ожидание изменения контента в заданном узле (синхронизация с AJAX).
        async waitForContentChange(context, timeout = 3000) {
            if (!context) return;

            return new Promise(resolve => {
                let solved = false;
                const finish = () => {
                    if (solved) return;
                    solved = true;
                    observer.disconnect();
                    resolve();
                };

                const observer = new MutationObserver((mutations) => {
                    if (mutations.some(m => m.addedNodes.length > 0)) {
                        finish();
                    }
                });

                observer.observe(context, { childList: true, subtree: true });
                setTimeout(finish, timeout);
            });
        }

        // Функция прерывания для передачи управления основному потоку браузера.
        async yieldToMain() {
            if (performance.now() - this._executionStartTime > 50) {
                await new Promise(resolve => setTimeout(resolve, 0));
                this._executionStartTime = performance.now();
            }
        }

        // Основной цикл обработки очереди задач.
        async processQueueLoop() {
            if (!this.isRunning) return;

            // Мониторинг производительности и адаптация задержек (Lag prevention).
            const now = performance.now();
            if (this.lastLoopEnd > 0) {
                const actualPause = now - this.lastLoopEnd;
                const lag = actualPause - this.expectedDelay - 10;

                if (lag > 100) {
                    if (this.lagMultiplier < 3) {
                         this.lagMultiplier = 3; 
                         this.ui.updateStatus("🐢 BRAKING (LAG DETECTED)");
                    }
                } else {
                    if (this.lagMultiplier > 1) {
                        this.lagMultiplier = Math.max(1, this.lagMultiplier - 0.1);
                    }
                }
            }
            
            this._executionStartTime = performance.now();

            const batchSize = (this.settings.smartSpeed && this.queue.length > 5) ? 3 : 1;
            let tasksProcessedInBatch = 0;

            while (tasksProcessedInBatch < batchSize) {
                await this.yieldToMain();

                if (this.queue.length === 0) {
                    if (!this.isWaitingForFinalCheck) {
                        this.isWaitingForFinalCheck = true;
                        const wait = this.settings.finalDelay || 1500;
                        this.ui.updateStatus(`Ожидание прогрузки (${wait}мс)...`);
                        this.expectedDelay = wait;
                        this.lastLoopEnd = performance.now();
                        setTimeout(() => this.processQueueLoop(), wait);
                        return;
                    }

                    if (this.settings.autoClickLoadMore) {
                        const candidates = document.querySelectorAll(CONFIG.SELECTORS.BTN_LOAD_MORE_FEED);
                        let loadMoreBtn = null;

                        for (const btn of candidates) {
                            if (DomPatcher.isVisible(btn) && !DomPatcher.isDangerElement(btn)) {
                                loadMoreBtn = btn;
                                break;
                            }
                        }

                        if (loadMoreBtn) {
                            this.ui.updateStatus('🖱 Нажатие "Загрузить еще"...');
                            await this.yieldToMain();
                            loadMoreBtn.click();
                            this.isWaitingForFinalCheck = false;
                            this.scrollRetries = 0;
                            this.expectedDelay = 2500;
                            this.lastLoopEnd = performance.now();
                            setTimeout(() => this.processQueueLoop(), 2500);
                            return;
                        }
                    }

                    if (this.settings.autoLoadNewPosts) {
                        const currentHeight = document.body.scrollHeight;
                        const maxSteps = this.settings.maxScrollSteps || 50;
                        const hasSpinners = document.querySelector(CONFIG.SELECTORS.SPINNERS);

                        if (hasSpinners) {
                             this.scrollRetries = 0;
                             this.ui.updateStatus('⏳ Обнаружен индикатор загрузки...');
                             this.expectedDelay = 1000;
                             this.lastLoopEnd = performance.now();
                             setTimeout(() => this.processQueueLoop(), 1000);
                             return;
                        }

                        if (currentHeight > this.lastScrollHeight && this.scrollCount < maxSteps) {
                            this.scrollCount++;
                            this.scrollRetries = 0;
                            this.ui.updateStatus(`⏬ Скролл ${this.scrollCount}/${maxSteps}...`);
                            await this.yieldToMain();

                            window.scrollTo(0, document.body.scrollHeight);
                            this.lastScrollHeight = document.body.scrollHeight;

                            this.isWaitingForFinalCheck = false;
                            this.expectedDelay = 2500;
                            this.lastLoopEnd = performance.now();
                            setTimeout(() => this.processQueueLoop(), 2500);
                            return;
                        }
                        else if (this.scrollCount < maxSteps && this.scrollRetries < 3) {
                            this.scrollRetries++;
                            const statusText = this.settings.autoClickLoadMore
                                ? `⏳ Ждем кнопку или контент (${this.scrollRetries}/3)...`
                                : `⏳ Ожидание контента (${this.scrollRetries}/3)...`;

                            this.ui.updateStatus(statusText);
                            window.scrollBy(0, -100);

                            setTimeout(() => {
                                 if (this.queue.length > 20) {
                                     this.ui.updateStatus(`🚧 Backpressure: Очередь ${this.queue.length} задач. Скролл отменен.`);
                                     this.lastLoopEnd = 0;
                                     this.processQueueLoop();
                                     return;
                                 }

                                 window.scrollTo(0, document.body.scrollHeight);
                                 this.lastLoopEnd = 0;
                                 this.processQueueLoop();
                            }, 1000);
                            return;
                        }
                        else {
                            if (this.scrollCount >= maxSteps) {
                                console.warn('[BoostyScript] 🛑 Остановка: Достигнут лимит экранов (Max Steps).');
                            } else {
                                console.warn(`[BoostyScript] 🏁 Остановка: Лента закончилась (Iron Limit: ${this.scrollRetries}/3 попыток).`);
                            }
                        }
                    }

                    this.finish();
                    return;
                }

                this.isWaitingForFinalCheck = false;
                this.scrollRetries = 0;

                const task = this.queue.shift();
                const parentPost = task.el.closest(CONFIG.SELECTORS.POST_WRAPPER);
                if (parentPost) {
                    this.lastInteraction.set(parentPost, performance.now());
                }

                this.processedNodes.add(task.el);

                try {
                    await DomPatcher.executeClick(task, this.settings);

                    if (['load_comments', 'load_replies'].includes(task.type)) {
                         const context = parentPost || task.el.parentNode;
                         if (context) {
                             this.ui.updateStatus('⏳ Синхронизация потоков...');
                             await this.waitForContentChange(context, 2500);
                             this.addTasksFromNode(context);
                         }
                    }

                } catch (e) {
                    console.error('[BoostyScript] Ошибка при клике:', e);
                } finally {
                    this.completedTasks++;
                    tasksProcessedInBatch++;
                    this.stepsSinceHibernate++;
                }
            } 

            if (this.stepsSinceHibernate >= 20) {
                this.stepsSinceHibernate = 0;
                await this.yieldToMain();
                this.checkAndHibernate();
            }

            let min = this.settings.delayMin;
            let max = this.settings.delayMax;
            let isFast = false;

            if (this.settings.smartSpeed && this.queue.length >= this.settings.speedThreshold) {
                min = this.settings.fastDelayMin;
                max = this.settings.fastDelayMax;
                isFast = true;
            }

            const delay = Math.floor(Math.random() * (max - min + 1)) + min;

            const actionText = (tasksProcessedInBatch > 0) ? 'Обработано' : 'Ожидание';
            const speedText = isFast ? '🚀 TURBO' : 'Normal';
            const statusText = `${actionText} ${this.completedTasks}/${this.totalDiscovered} | ${speedText}`;
            this.ui.updateProgress(this.completedTasks, this.totalDiscovered, statusText);

            const finalDelay = Math.floor(delay * this.lagMultiplier);
            this.expectedDelay = finalDelay;
            this.lastLoopEnd = performance.now();

            setTimeout(() => this.processQueueLoop(), finalDelay);
        }

        // Проверка и скрытие контента, ушедшего за пределы экрана, для экономии памяти.
        checkAndHibernate() {
            if (!this.settings.turboMode) return;

            const posts = document.querySelectorAll(CONFIG.SELECTORS.POST_WRAPPER);
            const buffer = 3000;
            let checkedCount = 0;
            const checkLimit = 50;
            let hibernatedCount = 0;

            for (const post of posts) {
                if (checkedCount >= checkLimit) break;
                if (this.hibernatedMap.has(post)) continue;

                const rect = post.getBoundingClientRect();
                checkedCount++;

                if (rect.bottom < -buffer) {
                     const now = performance.now();
                     if (!this.hibernationCandidates.has(post)) {
                         this.hibernationCandidates.set(post, now);
                         continue;
                     }
                     if (now - this.hibernationCandidates.get(post) < 10000) {
                         continue;
                     }

                     let isProtected = false;
                     if (this.queue.length > 0) {
                         for (const task of this.queue) {
                             if (post.contains(task.el)) {
                                 isProtected = true;
                                 break;
                             }
                         }
                     }

                     if (isProtected) {
                         continue;
                     }

                     const lastActive = this.lastInteraction.get(post) || 0;
                     if (performance.now() - lastActive < 5000) {
                         continue;
                     }

                     const fragment = document.createDocumentFragment();
                     const height = rect.height;
                     if (height < 10) continue; 

                     while (post.firstChild) {
                         fragment.appendChild(post.firstChild);
                     }

                     post.style.height = `${height}px`;
                     post.style.containIntrinsicSize = `1px ${height}px`; 
                     post.classList.add('bx-hibernated-placeholder');

                     this.hibernatedMap.set(post, fragment);
                     this.hibernationCandidates.delete(post);
                     hibernatedCount++;
                } else {
                     this.hibernationCandidates.delete(post);
                }
            }
        }

        // Восстановление скрытого контента.
        restoreHibernated() {
            if (this.hibernatedMap.size === 0) return;

            this.ui.updateStatus('Восстановление контента...');

            for (const [post, fragment] of this.hibernatedMap) {
                post.appendChild(fragment);
                post.style.height = '';
                post.style.containIntrinsicSize = '';
                post.classList.remove('bx-hibernated-placeholder');
            }

            this.hibernatedMap.clear();
            window.dispatchEvent(new Event('resize'));
        }

        // Завершение работы.
        finish() {
            this.isRunning = false;
            this.stopGlobalObserver();

            this.restoreHibernated();

            DomPatcher.isTurboActive = false;
            document.body.classList.remove('bx-global-blind-mode');

            if (this.settings.turboMode && (this.settings.restoreOnFinish !== false)) {
                 DomPatcher.restoreAllImages();
            }

            this.ui.removeOverlay();
            this.ui.showToast('✅ Готово! Все задачи выполнены.', 4000);
        }

        // Единый глобальный наблюдатель изменений DOM.
        startGlobalObserver() {
            if (this.globalObserver) return;

            let targetNode = document.querySelector('div[class*="Feed-scss--module_feed"]');
            if (!targetNode) {
                targetNode = document.querySelector('main') || document.querySelector('[class*="MasterLayout-scss--module_content"]');
            }
            if (!targetNode) targetNode = document.querySelector('#root');
            if (!targetNode) return;

            this.globalObserver = new MutationObserver((mutations) => {
                const nodesToScan = new Set();
                let hasChanges = false;

                for (const m of mutations) {
                    if (m.type !== 'childList') continue;

                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) { 
                            if (node.tagName === 'DIV' || node.tagName === 'ARTICLE') {
                                if (this.settings.turboMode) {
                                    DomPatcher.suppressImagesInNode(node);
                                }
                                nodesToScan.add(node);
                                hasChanges = true;
                            }
                        }
                    }
                }

                if (hasChanges) {
                    requestAnimationFrame(() => {
                        if (!this.isRunning) return;
                        nodesToScan.forEach(node => this.addTasksFromNode(node));
                    });
                }
            });

            this.globalObserver.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        }

        stopGlobalObserver() {
            if (this.globalObserver) {
                this.globalObserver.disconnect();
                this.globalObserver = null;
            }
        }
    }

    /**
     * ==================================================================================
     * РАЗДЕЛ 5: ИНИЦИАЛИЗАЦИЯ И API
     * ==================================================================================
     */
    
    // Создание экземпляров классов и экспорт глобального API.
    const queueManager = new QueueManager();
    QueueManager._instance = queueManager;

    const ui = new UIController(queueManager);
    queueManager.setUI(ui);

    if (document.body) {
        ui.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            ui.init();
        });
    }

    const api = {
        openSettings: () => ui.toggleMenu(),
        start: () => queueManager.start(ui.settings),
        stop: () => queueManager.stop(),
        restoreImages: () => DomPatcher.restoreAllImages()
    };

    window.BoostyManager = api;

    try {
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.BoostyManager = api;
        }
    } catch (e) {}

})();