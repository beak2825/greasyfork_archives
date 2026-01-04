// ==UserScript==
// @name         LztStreamerModeRework
// @namespace    https://github.com/nellimonix
// @version      1.3.4
// @description  Режим стримера для Lolzteam. Улучшенная и модифицированная версия!
// @author       llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @icon         https://cdn-icons-png.flaticon.com/512/18429/18429788.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543063/LztStreamerModeRework.user.js
// @updateURL https://update.greasyfork.org/scripts/543063/LztStreamerModeRework.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================
    // КОНФИГУРАЦИЯ И НАСТРОЙКИ
    // ===============================

    const CONFIG = {
        STORAGE_KEY: 'lzt_streamer_mode_settings',
        BLUR_INTENSITY: '6px',
        TRANSITION_DURATION: '0.3s',
        MAX_BANWORDS: 1000,
        PRESERVE_FIELDS: ['banwords', 'enabled', 'selected'],
        URL_THREAD: '/threads/8971201/',
        VERSION: GM_info.script.version
    };

    const SELECTORS = {
        CLASSES: {
            BLUR: 'CensorStreamer',
            BLUR_CLICKED: 'CensorStreamerClicked',
            SETTINGS_CONTAINER: 'lztStreamerMode',
            INPUT_CONTAINER: 'lzt_sm_input',
            BANWORD_TAG: 'lzt_sm_input_banword'
        },
        IDS: {
            SAVE_BTN: 'lzt_streamer_mode_save',
            RESET_BTN: 'lzt_streamer_mode_reset',
            BANWORDS_SHOW: 'lzt_sm_banwords_show',
            BANWORDS_IMPORT: 'lzt_sm_banwords_import',
            BANWORDS_EXPORT: 'lzt_sm_banwords_export',
            BANWORDS_INPUT: 'lzt_sm_banwords_input'
        }
    };

    // ===============================
    // НАСТРОЙКИ ПО УМОЛЧАНИЮ
    // ===============================

    const DEFAULT_SETTINGS = {
        main_page: {
            title: 'Основное',
            description: 'LZT Streamer Mode',
            enabled: true
        },
        button_place: {
            title: 'Расположение кнопки настроек',
            choice: {
                nav_tab: {
                    description: 'Вкладка навигации',
                },
                block_menu: {
                    description: 'Блок меню',
                }
            },
            selected: 'nav_tab'
        },
        banwords_page: {
            banwords: [],
            title: 'Запрещенные слова',
            description: 'Блокировать запрещенные слова (укажите их через запятую)',
            enabled: true
        },
        selector_page: {
            title: 'Настройка режима стримера',
            general: {
                title: 'Общие настройки',
                balance: {
                    selectors: [
                        'div#AccountMenu span.left',
                        'div#AccountMenu div.amount',
                        '#MarketMoneyTransferForm .marketRefillBalance--Row:nth-of-type(2) .bigTextHeading',
                        '#MarketMoneyTransferForm div.MarketPopularTransfers',
                        'div.marketUserPanel div.balance-value',
                        'div.marketUserPanel a.holdPayment',
                        'div.marketUserPanel span.balanceNumber'
                    ],
                    disabled_selectors: ['span#NavigationAccountBalance'],
                    ignored_selectors: [],
                    description: 'Скрывать все элементы, отображающие баланс пользователя (меню, переводы и т.д.)',
                    enabled: true
                },
                messages: {
                    selectors: ['#ConversationListItems', 'div.ng-notification div.body'],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать личные сообщения, список диалогов и уведомления о новых сообщениях',
                    enabled: true
                },
                alerts: {
                    selectors: [
                        'div#AlertPanels',
                        'div.account_alerts .alertGroup ol',
                        'div.liveAlert',
                        'div.imDialog'
                    ],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать все уведомления, включая всплывающие',
                    enabled: true
                },
                personal_details: {
                    selectors: ['div.account_security input[name="email"]'],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать элементы в настройках профиля',
                    enabled: true
                }
            },
            forum: {},
            market: {
                title: 'Настройки маркета',
                viewed: {
                    selectors: ['div.marketViewedItems'],
                    disabled_selectors: [],
                    ignored_selectors: ['.marketMyPayments'],
                    description: 'Скрывать блок недавно просмотренных товаров и аккаунтов',
                    enabled: true
                },
                payments: {
                    selectors: ['div.marketMyPayments div.wrapper'],
                    disabled_selectors: [],
                    ignored_selectors: ['.marketViewedItems'],
                    description: 'Скрывать блок последних действий и историю операций',
                    enabled: true
                },
                orders: {
                    selectors: [],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать список купленных товаров и аккаунтов',
                    enabled: true
                },
                login_data: {
                    selectors: [
                        'div.marketItemView--loginData',
                        'div.marketItemView--loginData--box'
                    ],
                    disabled_selectors: [],
                    ignored_selectors: [
                        '.login_details_for_arbitrators',
                        '.make_claim_seller_block',
                        '.recommendation_change_password'
                    ],
                    description: 'Скрывать данные для входа в аккаунт: логин, пароль, email и т.п.',
                    enabled: true
                },
                payment_stats: {
                    selectors: ['div.paymentStats div.stats'],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать сумму платежей за все время / указанный срок',
                    enabled: true
                },
                need_payment: {
                    selectors: ['div.need-payment div.need-payment-item'],
                    disabled_selectors: [],
                    ignored_selectors: [],
                    description: 'Скрывать платежи ожидающие оплаты',
                    enabled: true
                }
            },
            staff: {
                title: 'Настройки команды форума',
                warning: 'Может затронуть некоторые обычные функции, если они используют схожие элементы',
                balance_users: {
                    selectors: [],
                    disabled_selectors: [
                        'div.userContentLinks a[href$="/payments"]',
                        'div.userContentLinks a[href$="/donate-to-forum"]'
                    ],
                    ignored_selectors: [],
                    description: 'Скрывать все элементы, отображающие баланс пользователей',
                    enabled: false
                },
                account_menu: {
                    selectors: [],
                    disabled_selectors: [
                        'a[href="account/email-blacklist"]',
                        'a[href="account/spam-words"]',
                    ],
                    ignored_selectors: [],
                    description: 'Скрывать кнопки в меню аккаунта',
                    enabled: false
            },
            account_links: {
                selectors: [],
                disabled_selectors: [
                    'div.account-links .modLink',
                ],
                ignored_selectors: [],
                description: 'Скрывать иконки премодерации, репортов и службы поддержки',
                enabled: false
            },
            profile_panel: {
                selectors: [],
                disabled_selectors: [
                    'div.banLogs div#logs-buttons-f',
                    'ul.mainTabs a[href$="#staff-notes"]',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки в панели профиля (записи команды форума, журнал изменений)',
                enabled: false
            },
            profile_info: {
                selectors: [],
                disabled_selectors: [
                    'div.profilePage a[href$="/telegram-info"]',
                    'div.profilePage a[href$="/eog-info"]',
                    'div.profilePage div.profile_info_row:nth-of-type(3)'
                ],
                ignored_selectors: [],
                description: 'Скрывать дополнительные функции, связанные с персональной информацией',
                enabled: false
            },
            profile_id: {
                selectors: [],
                disabled_selectors: [
                    'div.profilePage div.profile_info_row:nth-of-type(2)'
                ],
                ignored_selectors: [],
                description: 'Скрывать ID пользователя в профиле',
                enabled: false
            },
            personal_details: {
                selectors: [],
                disabled_selectors: [
                    'div.navigationSideBar a[href="account/moderator-settings"]',
                    'form.personalDetailsForm dl.customFieldEditscamURL',
                    'form.personalDetailsForm dl.customFieldEditlztUnbanAmount',
                    'form.personalDetailsForm dl.customFieldEditlztLikesZeroing',
                    'form.personalDetailsForm dl.customFieldEditlztAwardUserTrophy',
                    'form.personalDetailsForm dl.customFieldEditlztLikesIncreasing',
                    'form.personalDetailsForm dl.customFieldEditlztSympathyZeroing',
                    'form.personalDetailsForm dl.customFieldEditlztSympathyZeroing',
                    'form.personalDetailsForm dl.customFieldEditlztSympathyIncreasing',
                ],
                ignored_selectors: [],
                description: 'Скрывать элементы в настройках профиля',
                enabled: false
            },
            'thread_checkbox': {
                selectors: [],
                disabled_selectors: [
                    'body label[for*="inlineModCheck-thread"]',
                    '.InlineModCheck',
                ],
                ignored_selectors: [],
                description: 'Скрывать чекбоксы для выделения тем',
                enabled: false
            },
            thread_visibility: {
                selectors: [],
                disabled_selectors: [
                    'a[href*="set-deleted-content-visibility"]',
                    '.messageList .message.deleted',
                    '.messageSimpleList .messageSimple.deleted',
                    'div.moderated',
                    'div.deleted'
                ],
                ignored_selectors: [],
                description: 'Скрывать удаленные и премодерациооные темы',
                enabled: false
            },
            shared_ips: {
                selectors: [],
                disabled_selectors: [
                    'div.ipMatches a[href$="/#gauid"]',
                    'div.ipMatches a[href$="/#evercookie"]',
                    'div.ipMatches a[href$="/#fingerprints"]',
                    'div.ipMatches a[href$="/#multiple"]',
                    'div.logInfo li.ipLog span.info-separattor',
                    'div.logInfo li.ipLog span.muted',
                ],
                ignored_selectors: [],
                description: 'Скрывать дополнительную информацию в общих IP',
                enabled: false
            },
            profile_dottes: {
                selectors: [],
                disabled_selectors: [
                    //'div.MenuContainer a[href$="/edit"]',
                    'div.MenuContainer a[href^="spam-cleaner"]',
                    'div.MenuContainer a[href^="support-tickets/list"]',
                    'div.MenuContainer a[href^="members/quick-ban"]',
                    'div.MenuContainer a[href^="members/quick-unban"]',
                    'div.MenuContainer a[href$="/change-logs"]',
                ],
                ignored_selectors: [],
                description: 'Скрывать функции управления над пользователем',
                enabled: false
            },
            comments_control: {
                selectors: [],
                disabled_selectors: [
                    'div.MenuContainer a[href*="/warn"]',
                    'div.MenuContainer a[href*="/unapprove"]',
                    'div.MenuContainer a[href$="/history"]',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки для управления комментариями',
                enabled: false
            },
            thread_control: {
                selectors: [],
                disabled_selectors: [
                    'div.MenuContainer a[href$="/reply-bans"]',
                    'div.MenuContainer a[href$="/user-actions"]',
                    'div.MenuContainer a[href$="/show-posts"]',
                    'div.MenuContainer a[href$="/change-starter"]',
                    'div.MenuContainer a[href$="/reply-bans"]',
                    'div.MenuContainer a[href$="/undelete"]',
                    'div.MenuContainer form[action$="/quick-update"] li:nth-child(2)',
                    'div.MenuContainer #threadViewThreadCheck',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки для управления темами',
                enabled: false
            },
            arbitor_control: {
                selectors: [],
                disabled_selectors: [
                    'div.decideMenuWrapper',
                    'div.quickReply span.QuickUsernameInsert',
                    'div.pageContent div.staffClaimsStats',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки управления арбитражем',
                enabled: false
            },
            moderator_control: {
                selectors: [],
                disabled_selectors: [
                    'div.decideMenuWrapper',
                    'div.quickReply span.QuickThreadMove',
                    'div.pageContent div.staffClaimsStats',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки управления жалобами, недочетами и предложениями',
                enabled: false
            },
            quick_ban: {
                selectors: [],
                disabled_selectors: [
                    'div.profilePage a.siropuManageBan',
                ],
                ignored_selectors: [],
                description: 'Скрывать кнопки для заблокированного пользователя',
                enabled: false
            },
            node_hide: {
                selectors: [],
                disabled_selectors: [
                    '.nodeList .list.node911',
                    '.nodeList .list.node993',
                    '.nodeList .list.node434',
                ],
                ignored_selectors: [],
                description: 'Скрывать разделы для команды форума',
                enabled: false
            },
            market_control: {
                selectors: [],
                disabled_selectors: [
                    '.marketExtraSidebarMenu:has(a[href="games"])',
                    'div.marketItemView--sidebarUser a[href$="/orders"]',
                    'div.marketItemView--sidebarUser a[href$="/payments"]',
                    'div.marketItemView--sidebarUser span.Tooltip',
                ],
                ignored_selectors: [],
                description: 'Скрывать баланс и историю операций пользователя на маркете',
                enabled: false
            },
            search_popup: {
                selectors: [],
                disabled_selectors: [
                    'div.search_results div.Popup',
                ],
                ignored_selectors: [],
                description: 'Скрывать инструменты модератора при поиске',
                enabled: false
            }
            }
        }
    };

    // ===============================
    // КЛАСС УПРАВЛЕНИЯ НАСТРОЙКАМИ
    // ===============================

    class SettingsManager {
        constructor() {
            this.settings = this.loadSettings();
        }

        loadSettings() {
            const stored = GM_getValue(CONFIG.STORAGE_KEY, null);
            if (!stored) {
                this.saveSettings(DEFAULT_SETTINGS);
                return DEFAULT_SETTINGS;
            }
            return this.mergeWithDefaults(stored);
        }

        mergeWithDefaults(userSettings) {
            const merged = structuredClone(DEFAULT_SETTINGS);

            const deepMerge = (target, source) => {
                for (const key in source) {
                    if (!source.hasOwnProperty(key)) continue;

                    const sourceValue = source[key];
                    if (sourceValue === undefined) continue;

                    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
                            target[key] = {};
                        }
                        deepMerge(target[key], sourceValue);
                    } else if (CONFIG.PRESERVE_FIELDS.includes(key)) {
                        target[key] = sourceValue;
                    }
                }
            };

            deepMerge(merged, userSettings);
            return merged;
        }

        saveSettings(settings = this.settings) {
            GM_setValue(CONFIG.STORAGE_KEY, settings);
            this.settings = settings;
        }

        resetSettings() {
            GM_deleteValue(CONFIG.STORAGE_KEY);
            this.settings = DEFAULT_SETTINGS;
        }

        collectSelectors(mode = 'enabled') {
            const collect = (obj) => {
                if (!obj || typeof obj !== 'object' || !this.settings.main_page.enabled) return [];
                return Object.values(obj).flatMap(value => {
                    if (value.enabled && Array.isArray(value[mode === 'enabled' ? 'selectors' : 'disabled_selectors'])) {
                        return value[mode === 'enabled' ? 'selectors' : 'disabled_selectors'];
                    }
                    return collect(value);
                });
            };
            return collect(this.settings);
        }
    }

    // ===============================
    // КЛАСС УПРАВЛЕНИЯ СТИЛЯМИ
    // ===============================

    class StyleManager {
        constructor(settingsManager) {
            this.settingsManager = settingsManager;
            this.init();
        }

        init() {
            const selectors = this.settingsManager.collectSelectors('enabled');
            const disabledSelectors = this.settingsManager.collectSelectors('disabled');

            this.addPathSpecificSelectors(selectors, disabledSelectors);
            this.injectStyles(selectors, disabledSelectors);
        }

        addPathSpecificSelectors(selectors, disabledSelectors) {
            const path = window.location.pathname;

            if (path === "/user/orders" || path === "/viewed") {
                selectors.push('div.MarketItems');
            } else if (path === "/streamer-mode") {
                disabledSelectors.push(
                    'div.pageContent div.error-container',
                    'div.pageContent div.errorOverlay',
                    'div.pageContent div.titleBar',
                    'div.pageContent div.market-selectCategory-block'
                );
            }
        }

        injectStyles(selectors, disabledSelectors) {
            const style = document.createElement('style');
            style.textContent = this.generateCSS(selectors, disabledSelectors);
            document.head.appendChild(style);
        }

        generateCSS(selectors, disabledSelectors) {
            return `
                ${selectors.map(selector => selector).join(', ')} {
                    filter: blur(${CONFIG.BLUR_INTENSITY});
                }

                ${disabledSelectors.map(selector => selector).join(', ')} {
                    display: none !important;
                }

                div.bbCodeHide blockquote.hideContainer {
                    filter: ${this.settingsManager.settings.main_page?.enabled ? `blur(${CONFIG.BLUR_INTENSITY})` : 'none'};
                }

                .member_tabs li a[href*="#change-logs"] {
                    font-size: 0px;
                }

                .member_tabs li a[href*="#change-logs"]:before {
                    content: "История блокировок";
                    font-size: 13px;
                }

                .${SELECTORS.CLASSES.BLUR} {
                    filter: blur(${CONFIG.BLUR_INTENSITY}) !important;
                    transition: filter ${CONFIG.TRANSITION_DURATION} ease !important;
                    position: relative !important;
                    pointer-events: none !important;
                }

                .${SELECTORS.CLASSES.BLUR}:hover {
                    filter: blur(4px) !important;
                }

                .${SELECTORS.CLASSES.BLUR_CLICKED} {
                    filter: none !important;
                    pointer-events: auto !important;
                }

                .${SELECTORS.CLASSES.BLUR}::before {
                    content: '' !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    z-index: 9999 !important;
                    cursor: pointer !important;
                    pointer-events: auto !important;
                    background: transparent !important;
                }

                .${SELECTORS.CLASSES.BLUR_CLICKED}::before {
                    display: none !important;
                }

                /* Стили для интерфейса настроек */
                ${this.getUIStyles()}
            `;
        }

        getUIStyles() {
            return `
                .${SELECTORS.CLASSES.SETTINGS_CONTAINER} .lzt_sm_description {
                    margin: 0 0 10px;
                    color: #949494;
                }

                input.${SELECTORS.CLASSES.INPUT_CONTAINER} {
                    height: 38px;
                    line-height: 38px;
                    padding-left: 4px;
                    border: 0;
                    color: rgb(214, 214, 214);
                    flex-grow: 1;
                    background: none;
                    width: 100px;
                }

                div.${SELECTORS.CLASSES.INPUT_CONTAINER} {
                    font-size: 13px;
                    color: #d6d6d6;
                    border: 0 none #000;
                    box-sizing: border-box;
                    padding: 4px 8px;
                    cursor: text;
                    line-height: 34px;
                    border-radius: 8px;
                    outline: none;
                    display: flex;
                    flex-wrap: wrap;
                    height: unset !important;
                    background: none;
                    box-shadow: 0 0 0 1px #323232;
                }

                .${SELECTORS.CLASSES.SETTINGS_CONTAINER} .textHeading {
                    margin: 0 0 10px;
                }

                .lzt_sm_title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 20px;
                    font-size: 16px;
                    font-weight: 600;
                    border-bottom: 1px solid #242424;
                    margin: -10px -10px 16px -10px;
                    width: 100%;
                    box-sizing: border-box;
                    border-radius: 10px 10px 0 0;
                }

                .ctrlUnit_blocks {
                    border-bottom: 1px solid rgb(36, 36, 36);
                    padding: 20px 20px 16px 20px;
                }

                .ctrlUnit_blocks_button_save {
                    padding: 20px 20px 20px 20px;
                }

                .${SELECTORS.CLASSES.SETTINGS_CONTAINER} .ctrlUnit_blocks label {
                    margin: 0 20px 0 0;
                    white-space: nowrap;
                }

                .ctrlUnit_blocks > dd > * > li {
                    margin: 5px 0 14px;
                    padding-left: 1px;
                }

                .checkbox_streamer {
                    display: flex;
                    gap: 8px;
                    flex-direction: column;
                    flex-wrap: wrap;
                }

                .${SELECTORS.CLASSES.BANWORD_TAG} {
                    border-radius: 6px;
                    display: inline-flex;
                    gap: 5px;
                    padding: 4px 8px;
                    align-items: center;
                    margin: 5px 5px 5px 0;
                    height: 20px;
                    line-height: 20px;
                    background-color: #2d2d2d;
                }

                .${SELECTORS.CLASSES.BANWORD_TAG} span.word {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                }

                .${SELECTORS.CLASSES.BANWORD_TAG} div.remove_word {
                    font-size: 19px;
                    color: #999;
                    cursor: pointer;
                    margin-left: 2px;
                }

                .banwordsOptionsBtn {
                    margin-top: 10px;
                }

                .banwordsOptionsBtn button {
                    margin-right: 5px;
                }

                .radio_choice_container {
                    padding: 10px;
                    background: rgba(45, 45, 45, 0.3);
                    border-radius: 8px;
                    border: 1px solid #323232;
                }

                .radio_choice_title {
                    color: #d6d6d6;
                    font-size: 14px;
                }

                .radio_choice_group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .radio_choice_item label {
                    color: #d6d6d6;
                    font-size: 13px;
                    transition: color 0.2s ease;
                }

                .radio_choice_item label:hover {
                    color: #ffffff;
                }

                .radio_choice_item input[type="radio"] {
                    accent-color: #4a9eff;
                    margin: 0;
                }
            `;
        }
    }

    // ===============================
    // КЛАСС УПРАВЛЕНИЯ БЛЮРОМ
    // ===============================

    class BlurManager {
        constructor(settingsManager) {
            this.settingsManager = settingsManager;
        }

        applyBlur(element, ignoredSelectors = []) {
            const el = element instanceof jQuery ? element[0] : element;
            if (!el || typeof el.classList === 'undefined') return;

            const isIgnored = (target) =>
                ignoredSelectors.some((selector) => target.matches(selector));

            if (isIgnored(el)) {
                el.style.filter = "none";
                return;
            }

            if (el.classList.contains(SELECTORS.CLASSES.BLUR) ||
                el.classList.contains(SELECTORS.CLASSES.BLUR_CLICKED)) return;

            el.classList.add(SELECTORS.CLASSES.BLUR);
            this.addClickHandler(el);
        }

        addClickHandler(el) {
            const handleClick = (event) => {
                if (event.target === el) {
                    event.preventDefault();
                    event.stopPropagation();

                    el.classList.remove(SELECTORS.CLASSES.BLUR);
                    el.classList.add(SELECTORS.CLASSES.BLUR_CLICKED);

                    el.removeEventListener("click", handleClick);
                }
            };

            el.addEventListener("click", handleClick);
        }

        applyCensor(element, banwords = []) {
            const el = element instanceof jQuery ? element[0] : element;
            if (!el || typeof el.classList === 'undefined') return;

            const regex = new RegExp(
                banwords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
                'gi'
            );

            const censorText = (text) => text.replace(regex, match => '*'.repeat(match.length));

            const censorNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const censored = censorText(node.nodeValue);
                    if (node.nodeValue !== censored) {
                        node.nodeValue = censored;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    for (let child of node.childNodes) {
                        censorNode(child);
                    }
                }
            };

            censorNode(el);
        }
    }

    // ===============================
    // КЛАСС УПРАВЛЕНИЯ БАНВОРДАМИ
    // ===============================

    class BanwordManager {
        constructor() {
            this.existingWords = new Set();
        }

        init() {
            const container = document.querySelector(`.${SELECTORS.CLASSES.INPUT_CONTAINER}`);
            const input = document.getElementById(SELECTORS.IDS.BANWORDS_INPUT);

            if (!container || !input) return;

            this.setupEventHandlers(container, input);
            this.loadExistingWords();
        }

        setupEventHandlers(container, input) {
            input.addEventListener('keydown', (e) => this.handleKeyDown(e, container, input));
            input.addEventListener('paste', (e) => this.handlePaste(e, container, input));
        }

        handleKeyDown(e, container, input) {
            if (['Enter', ',', ' '].includes(e.key)) {
                e.preventDefault();
                const parts = input.value.split(',');
                parts.forEach(word => this.addWordTag(word.trim(), container, input));
                input.value = '';
            } else if (e.key === 'Backspace' && input.value === '') {
                this.removeLastTag(container);
            }
        }

        handlePaste(e, container, input) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const parts = paste.split(',');
            parts.forEach(word => this.addWordTag(word.trim(), container, input));
            input.value = '';
        }

        addWordTag(word, container, input) {
            const trimmed = word.trim();
            if (!trimmed || this.existingWords.has(trimmed.toLowerCase())) return;

            const tag = this.createWordTag(trimmed);
            container.insertBefore(tag, input);
            this.existingWords.add(trimmed.toLowerCase());
        }

        createWordTag(word) {
            const isCurrentlyShown = !document.getElementById(SELECTORS.IDS.BANWORDS_SHOW)?.classList.contains('showBanwords');

            const tag = document.createElement('div');
            tag.className = SELECTORS.CLASSES.BANWORD_TAG;

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = isCurrentlyShown ? word : '•'.repeat(word.length);
            span.dataset.real = word;

            const removeBtn = document.createElement('div');
            removeBtn.className = 'remove_word';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                tag.remove();
                this.existingWords.delete(word.toLowerCase());
            });

            tag.appendChild(span);
            tag.appendChild(removeBtn);

            return tag;
        }

        removeLastTag(container) {
            const tags = container.querySelectorAll(`.${SELECTORS.CLASSES.BANWORD_TAG}`);
            if (tags.length > 0) {
                const lastTag = tags[tags.length - 1];
                const word = lastTag.querySelector('.word').dataset.real;
                this.existingWords.delete(word.toLowerCase());
                lastTag.remove();
            }
        }

        loadExistingWords(words = []) {
            const container = document.querySelector(`.${SELECTORS.CLASSES.INPUT_CONTAINER}`);
            const input = document.getElementById(SELECTORS.IDS.BANWORDS_INPUT);

            if (!container || !input) return;

            words.forEach(word => this.addWordTag(word, container, input));
        }

        toggleVisibility() {
            const btn = document.getElementById(SELECTORS.IDS.BANWORDS_SHOW);
            const isCurrentlyShown = !btn.classList.contains('showBanwords');

            if (!isCurrentlyShown) {
                btn.classList.remove('showBanwords');
                btn.classList.add('unshowBanwords');
                btn.textContent = 'Скрыть запрещенные слова';
            } else {
                btn.classList.remove('unshowBanwords');
                btn.classList.add('showBanwords');
                btn.textContent = 'Показать запрещенные слова';
            }

            document.querySelectorAll('.word[data-real]').forEach(span => {
                const real = span.dataset.real;
                span.textContent = isCurrentlyShown ? '•'.repeat(real.length) : real;
            });
        }

        exportWords() {
            const banwordElements = document.querySelectorAll(`.${SELECTORS.CLASSES.BANWORD_TAG} .word`);
            const banwords = Array.from(banwordElements)
                .map(el => el.dataset.real?.trim())
                .filter(word => word && word.length > 0);

            const text = banwords.join(', ');
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'banwords.txt';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        importWords() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.txt';
            fileInput.style.display = 'none';

            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    if (!content) return;

                    const importedWords = content
                        .split(/[\n,]+/)
                        .map(w => w.trim())
                        .filter(w => w.length > 0);

                    const container = document.querySelector(`.${SELECTORS.CLASSES.INPUT_CONTAINER}`);
                    const input = document.getElementById(SELECTORS.IDS.BANWORDS_INPUT);

                    if (!container || !input) return;

                    let addedCount = 0;
                    importedWords.forEach(word => {
                        if (!this.existingWords.has(word.toLowerCase())) {
                            this.addWordTag(word, container, input);
                            addedCount++;
                        }
                    });

                    XenForo.stackAlert(`Импортировано слов: ${addedCount}`, 5000);
                };

                reader.readAsText(file);
            });

            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        }
    }

    // ===============================
    // ГЛАВНЫЙ КЛАСС STREAMER MODE
    // ===============================

    class LZTStreamerMode {
        constructor() {
            this.settingsManager = new SettingsManager();
            this.styleManager = new StyleManager(this.settingsManager);
            this.blurManager = new BlurManager(this.settingsManager);
            this.banwordManager = new BanwordManager();

            this.init();
        }

        init() {
            this.waitForXenForo();
        }

        waitForXenForo() {
            const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

            Object.defineProperty(win, 'XenForo', {
                configurable: true,
                set: (value) => {
                    delete win.XenForo;
                    win.XenForo = value;

                    if (typeof win.XenForo.register === 'function') {
                        this.initXenForoFeatures();
                    }
                }
            });
        }

        initXenForoFeatures() {
            this.registerBlurHandlers();
            this.registerCensorHandlers();
            this.setupUI();
            this.applySpecialFixes();
        }

        registerBlurHandlers() {
            const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

            win.XenForo.applyBlurCustom = (element, ignoredSelectors = []) => {
                this.blurManager.applyBlur(element, ignoredSelectors);
            };

            this.registerSelectors();
        }

        registerSelectors() {
            const { selector_page } = this.settingsManager.settings;
            if (!selector_page || !this.settingsManager.settings.main_page?.enabled) return;

            Object.values(selector_page).forEach(section => {
                Object.values(section).forEach(category => {
                    if (!category.enabled) return;
                    const { selectors = [], ignored_selectors = [] } = category;

                    selectors.forEach(sel => {
                        XenForo.register(sel, function() {
                            XenForo.applyBlurCustom(this, ignored_selectors);
                        });
                    });
                });
            });

            this.registerSpecialHandlers();
        }

        registerSpecialHandlers() {
            const { selector_page } = this.settingsManager.settings;

            // Обработка сообщений
            if (selector_page.general?.messages?.enabled) {
                XenForo.register('li.conversationItem', function() {
                    const container = this.closest('ol');
                    XenForo.applyBlurCustom(container);
                });
            }

            // Обработка MarketItems
            const marketEnabled = selector_page.market?.viewed?.enabled || selector_page.market?.orders?.enabled;
            if (marketEnabled) {
                XenForo.register('div.MarketItems', function() {
                    const path = window.location.pathname;
                    if ((path === "/user/orders" && selector_page.market?.orders?.enabled) ||
                        (path === "/viewed" && selector_page.market?.viewed?.enabled)) {
                        XenForo.applyBlurCustom(this);
                    }
                });
            }

            // Секретный вопрос
            XenForo.register('input[name="secret_answer"]', function() {
                this.setAttribute('type', 'password');
            });

            // Хайды
            XenForo.register('div.bbCodeHide', function() {
                let el = this instanceof jQuery ? this[0] : this;

                const quote = el.querySelector('div.quote');
                const quoteContainer = el.querySelector('blockquote.hideContainer');
                const attribution = el.querySelector('aside div.attribution.type');

                if (quote && quoteContainer && attribution) {
                    XenForo.applyBlurCustom(quoteContainer);
                } else if (quoteContainer) {
                    quoteContainer.style.filter = "none";
                }
            });
        }

        registerCensorHandlers() {
            const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

            win.XenForo.applyCensorCustom = (element, banwords = []) => {
                this.blurManager.applyCensor(element, banwords);
            };

            const { banwords_page, main_page } = this.settingsManager.settings;
            if (!banwords_page?.enabled || !main_page?.enabled) return;

            const banwords = banwords_page.banwords || [];
            const selectors = [
                'div.messageContent', 'div.commentContent', 'div.pageContent div.titleBar',
                '.threadLastPost', '.discussionListItem', 'li.Alert', 'div.liveAlert',
                'ul li.conversationItem', '#page_current_info', '.userStatus',
                'div.ng-notification div.body'
            ];

            selectors.forEach(sel => {
                XenForo.register(sel, function() {
                    XenForo.applyCensorCustom(this, banwords);
                });
            });

            // Специальные обработчики для диалогов
            ['ol li.conversationItem', 'ul li.conversationItem'].forEach(sel => {
                XenForo.register(sel, function() {
                    const container = this.querySelector('.Content');
                    if (container) XenForo.applyCensorCustom(container, banwords);
                });
            });
        }

        setupUI() {
            this.addNavigationButton();

            if (window.location.pathname === "/streamer-mode") {
                this.buildSettingsPage();
            }
        }

        addNavigationButton() {
            const settings = this.settingsManager.settings
            const btnPlaceSelected = settings.button_place.selected

            if (btnPlaceSelected == 'nav_tab') {
                const publicTabs = document.querySelector('ul.account-links');
                if (!publicTabs) return;

                // Настройка ширины поиска если много вкладок
                const publicTabsCount = document.querySelectorAll('ul.account-links .navTab').length;
                const searchBar = document.querySelector('div#searchBar .formPopup');
                if (publicTabsCount >= 7 && searchBar) {
                    searchBar.style.width = '110px';
                }

                const newItem = document.createElement('li');
                newItem.classList.add('navTab', 'PopupClosed');
                newItem.innerHTML = `
                    <a href="/streamer-mode" class="navLink">
                        <div class="counter-container">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 8.93137C22 8.32555 22 8.02265 21.8802 7.88238C21.7763 7.76068 21.6203 7.69609 21.4608 7.70865C21.2769 7.72312 21.0627 7.93731 20.6343 8.36569L17 12L20.6343 15.6343C21.0627 16.0627 21.2769 16.2769 21.4608 16.2914C21.6203 16.3039 21.7763 16.2393 21.8802 16.1176C22 15.9774 22 15.6744 22 15.0686V8.93137Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 9.8C2 8.11984 2 7.27976 2.32698 6.63803C2.6146 6.07354 3.07354 5.6146 3.63803 5.32698C4.27976 5 5.11984 5 6.8 5H12.2C13.8802 5 14.7202 5 15.362 5.32698C15.9265 5.6146 16.3854 6.07354 16.673 6.63803C17 7.27976 17 8.11984 17 9.8V14.2C17 15.8802 17 16.7202 16.673 17.362C16.3854 17.9265 15.9265 18.3854 15.362 18.673C14.7202 19 13.8802 19 12.2 19H6.8C5.11984 19 4.27976 19 3.63803 18.673C3.07354 18.3854 2.6146 17.9265 2.32698 17.362C2 16.7202 2 15.8802 2 14.2V9.8Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </a>
                `;

                publicTabs.prepend(newItem);
            } else if (btnPlaceSelected == 'block_menu') {
                const accountMenu = document.querySelector('div#AccountMenu div.manageItems');
                const accountMenuMobile = document.querySelector('div#AccountMenu div.manage-items');

                var newMenuItem = `
                    <a href="/streamer-mode" class="manageItem">
                        <div class="SvgIcon duotone">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 8.93137C22 8.32555 22 8.02265 21.8802 7.88238C21.7763 7.76068 21.6203 7.69609 21.4608 7.70865C21.2769 7.72312 21.0627 7.93731 20.6343 8.36569L17 12L20.6343 15.6343C21.0627 16.0627 21.2769 16.2769 21.4608 16.2914C21.6203 16.3039 21.7763 16.2393 21.8802 16.1176C22 15.9774 22 15.6744 22 15.0686V8.93137Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 9.8C2 8.11984 2 7.27976 2.32698 6.63803C2.6146 6.07354 3.07354 5.6146 3.63803 5.32698C4.27976 5 5.11984 5 6.8 5H12.2C13.8802 5 14.7202 5 15.362 5.32698C15.9265 5.6146 16.3854 6.07354 16.673 6.63803C17 7.27976 17 8.11984 17 9.8V14.2C17 15.8802 17 16.7202 16.673 17.362C16.3854 17.9265 15.9265 18.3854 15.362 18.673C14.7202 19 13.8802 19 12.2 19H6.8C5.11984 19 4.27976 19 3.63803 18.673C3.07354 18.3854 2.6146 17.9265 2.32698 17.362C2 16.7202 2 15.8802 2 14.2V9.8Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span>Streamer Mode</span>
                    </a>
                `;

                // Вставить в обычное меню
                if (accountMenu) {
                    accountMenu.insertAdjacentHTML("beforeend", newMenuItem);
                }

                // Вставить в мобильное меню
                if (accountMenuMobile) {
                    const mobileVersion = newMenuItem.replace('class="manageItem"', 'class="manage-item"');
                    accountMenuMobile.insertAdjacentHTML("beforeend", mobileVersion);
                }
            } else {
                console.warn('[LZT Streamer Mode] Выбран некорректный параметр в "Расположение кнопки настроек"')
            }
        }

        buildSettingsPage() {
            document.title = 'LZT Streamer Mode [made ❤︎ llimonix]';

            const settingsRoot = document.querySelector('div#headerMover div.pageContent');
            if (!settingsRoot) return;

            const htmlTree = this.buildSettingsHTML();
            settingsRoot.appendChild(htmlTree);

            this.setupSettingsHandlers();
        }

        buildSettingsHTML() {
            const container = document.createElement('div');
            container.className = 'container';

            const mainContentBlock = document.createElement('div');
            mainContentBlock.className = 'mainContentBlock sectionMain';
            container.appendChild(mainContentBlock);

            const lztStreamerMode = document.createElement('div');
            lztStreamerMode.className = SELECTORS.CLASSES.SETTINGS_CONTAINER;
            mainContentBlock.appendChild(lztStreamerMode);

            // Заголовок
            const title = document.createElement('div');
            title.className = 'lzt_sm_title';
            title.textContent = 'LZT Streamer Mode [made ❤︎ llimonix]';
            lztStreamerMode.appendChild(title);

            // Добавляем секции настроек
            this.buildSettingsSections(lztStreamerMode);

            // Кнопки
            this.buildControlButtons(mainContentBlock);

            return container;
        }

        buildSettingsSections(container) {
            const settings = this.settingsManager.settings;

            for (const [pageKey, page] of Object.entries(settings)) {
                const section = this.buildSettingsSection(pageKey, page);
                container.appendChild(section);
            }
        }

        buildSettingsSection(pageKey, page) {
            const dl = document.createElement('dl');
            dl.className = 'ctrlUnit_blocks';

            const heading = document.createElement('div');
            heading.className = 'textHeading';
            heading.textContent = page.title || 'Без названия';
            dl.appendChild(heading);

            if (pageKey === 'main_page') {
                dl.appendChild(this.buildMainPageSettings(pageKey, page));
            } else if (pageKey === 'banwords_page') {
                dl.appendChild(this.buildBanwordsSettings(pageKey, page));
            } else if (pageKey === 'button_place') {
                dl.appendChild(this.buildButtonPlaceSettings(pageKey, page));
            } else {
                dl.appendChild(this.buildCategorizedSettings(pageKey, page));
            }

            return dl;
        }

        buildMainPageSettings(pageKey, page) {
            const div = document.createElement('div');
            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `lzt_sm_${pageKey}`;
            input.checked = page.enabled;

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + (page.description || pageKey)));
            div.appendChild(label);

            return div;
        }

        buildButtonPlaceSettings(pageKey, page) {
            const fragment = document.createDocumentFragment();

            // Радио кнопки для выбора расположения
            if (page.choice) {
                const radioContainer = document.createElement('div');
                radioContainer.className = 'radio_choice_container';
                radioContainer.style.marginTop = '10px';

                // Создаем радио кнопки
                const radioGroup = document.createElement('div');
                radioGroup.className = 'radio_choice_group';

                Object.entries(page.choice).forEach(([choiceKey, choiceData]) => {
                    const radioWrapper = document.createElement('div');
                    radioWrapper.className = 'radio_choice_item';

                    const radioLabel = document.createElement('label');
                    radioLabel.style.cursor = 'pointer';
                    radioLabel.style.display = 'flex';
                    radioLabel.style.alignItems = 'center';
                    radioLabel.style.gap = '8px';

                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = `lzt_sm_${pageKey}_choice`;
                    radioInput.id = `lzt_sm_${pageKey}_${choiceKey}`;
                    radioInput.value = choiceKey;
                    radioInput.checked = page.selected === choiceKey;

                    const radioText = document.createElement('span');
                    radioText.textContent = choiceData.description;

                    radioLabel.appendChild(radioInput);
                    radioLabel.appendChild(radioText);
                    radioWrapper.appendChild(radioLabel);
                    radioGroup.appendChild(radioWrapper);
                });

                radioContainer.appendChild(radioGroup);
                fragment.appendChild(radioContainer);
            }

            return fragment;
        }

        buildBanwordsSettings(pageKey, page) {
            const fragment = document.createDocumentFragment();

            // Чекбокс включения
            const div = document.createElement('div');
            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `lzt_sm_${pageKey}`;
            input.checked = page.enabled;

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + (page.description || pageKey)));
            div.appendChild(label);
            fragment.appendChild(div);

            // Поле ввода
            const dd = document.createElement('dd');
            dd.style.margin = '15px 0 0';

            const inputContainer = document.createElement('div');
            inputContainer.className = SELECTORS.CLASSES.INPUT_CONTAINER;

            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = SELECTORS.IDS.BANWORDS_INPUT;
            textInput.className = SELECTORS.CLASSES.INPUT_CONTAINER;

            inputContainer.appendChild(textInput);
            dd.appendChild(inputContainer);
            fragment.appendChild(dd);

            // Кнопки управления
            const buttonsContainer = this.buildBanwordButtons();
            fragment.appendChild(buttonsContainer);

            return fragment;
        }

        buildBanwordButtons() {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'banwordsOptionsBtn';

            const buttons = [
                { id: SELECTORS.IDS.BANWORDS_SHOW, text: 'Показать запрещенные слова', class: 'showBanwords' },
                { id: SELECTORS.IDS.BANWORDS_IMPORT, text: 'Импортировать слова' },
                { id: SELECTORS.IDS.BANWORDS_EXPORT, text: 'Экспортировать слова' }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.id = btn.id;
                button.className = `button smallButton ${btn.class || ''}`;
                button.textContent = btn.text;
                buttonsContainer.appendChild(button);
            });

            return buttonsContainer;
        }

        buildCategorizedSettings(pageKey, page) {
            const dd = document.createElement('dd');
            const ul = document.createElement('ul');

            for (const [sectionKey, section] of Object.entries(page)) {
                if (['title', 'description', 'enabled'].includes(sectionKey)) continue;
                if (!section || Object.keys(section).length === 0) continue;

                const li = this.buildCategoryItem(pageKey, sectionKey, section);
                ul.appendChild(li);
            }

            dd.appendChild(ul);
            return dd;
        }

        buildCategoryItem(pageKey, sectionKey, section) {
            const li = document.createElement('li');

            const desc = document.createElement('div');
            desc.className = 'lzt_sm_description';
            desc.textContent = section.title || sectionKey;
            li.appendChild(desc);

            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox_streamer';

            if (section.warning) {
                const warningLabel = document.createElement('label');
                warningLabel.className = 'warningText';
                warningLabel.textContent = section.warning;
                checkboxDiv.appendChild(warningLabel);
            }

            for (const [key, item] of Object.entries(section)) {
                if (['title', 'description', 'enabled', 'warning'].includes(key)) continue;
                if (!item.selectors) continue;

                const label = document.createElement('label');
                const input = document.createElement('input');

                input.type = 'checkbox';
                input.id = `lzt_sm_${pageKey}.${sectionKey}.${key}`;
                input.checked = item.enabled;

                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + (item.description || key)));
                checkboxDiv.appendChild(label);
            }

            li.appendChild(checkboxDiv);
            return li;
        }

        buildControlButtons(container) {
            const btnDl = document.createElement('dl');
            btnDl.className = 'ctrlUnit_blocks_button_save';

            const btnDd = document.createElement('dd');
            btnDd.innerHTML = `
                <div style="display: flex; flex-direction: row; gap: 8px; flex-wrap: wrap; align-items: center;">
                    <button class="button primary" id="${SELECTORS.IDS.SAVE_BTN}">Сохранить изменения</button>
                    <button class="button" id="${SELECTORS.IDS.RESET_BTN}">Сбросить настройки</button>
                    <a href="${CONFIG.URL_THREAD}" style="margin-left: auto;">Версия ${CONFIG.VERSION}</a>
                </div>
            `;

            btnDl.appendChild(btnDd);
            container.appendChild(btnDl);
        }

        setupSettingsHandlers() {
            // Инициализация управления банвордами
            this.banwordManager.init();
            this.banwordManager.loadExistingWords(this.settingsManager.settings.banwords_page?.banwords || []);

            // Обработчики кнопок
            this.setupButtonHandlers();
        }

        setupButtonHandlers() {
            const handlers = [
                { id: SELECTORS.IDS.SAVE_BTN, handler: () => this.saveSettings() },
                { id: SELECTORS.IDS.RESET_BTN, handler: () => this.resetSettings() },
                { id: SELECTORS.IDS.BANWORDS_SHOW, handler: () => this.banwordManager.toggleVisibility() },
                { id: SELECTORS.IDS.BANWORDS_IMPORT, handler: () => this.banwordManager.importWords() },
                { id: SELECTORS.IDS.BANWORDS_EXPORT, handler: () => this.banwordManager.exportWords() }
            ];

            handlers.forEach(({ id, handler }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('click', handler);
                }
            });
        }

        saveSettings() {
            const updatedSettings = structuredClone(this.settingsManager.settings);

            // Обновляем настройки чекбоксов
            document.querySelectorAll(`div.${SELECTORS.CLASSES.SETTINGS_CONTAINER} input[type="checkbox"]`).forEach(checkbox => {
                const path = checkbox.id.replace('lzt_sm_', '');
                if (!path) return;

                const keys = path.split('.');
                let current = updatedSettings;

                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (!(key in current)) {
                        console.warn(`Путь не найден: ${key} в ${path}`);
                        return;
                    }
                    current = current[key];
                }

                const lastKey = keys[keys.length - 1];
                if (lastKey in current) {
                    current[lastKey].enabled = checkbox.checked;
                } else {
                    console.warn(`Ключ ${lastKey} не найден в ${path}`);
                }
            });

            document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
                const match = radio.name.match(/^lzt_sm_(.+)_choice$/);
                if (match) {
                    const pageKey = match[1];
                    if (updatedSettings[pageKey] && updatedSettings[pageKey].selected !== undefined) {
                        updatedSettings[pageKey].selected = radio.value;
                    }
                }
            });

            // Обновляем банворды
            const banwordElements = document.querySelectorAll(`.${SELECTORS.CLASSES.BANWORD_TAG} .word`);
            const banwords = Array.from(banwordElements)
                .map(el => el.dataset.real?.trim())
                .filter(word => word && word.length > 0);

            if (updatedSettings.banwords_page) {
                updatedSettings.banwords_page.banwords = banwords;
            }

            this.settingsManager.saveSettings(updatedSettings);

            XenForo.alert('[LZT Streamer Mode] Настройки сохранены', '', 5000);
        }

        resetSettings() {
            this.settingsManager.resetSettings();
            location.reload();
        }

        applySpecialFixes() {
            // Специальные фиксы для API
            const apiUseInfo = document.querySelector('div.profilePage div.profile_info_row:nth-of-type(3)');
            if (apiUseInfo) {
                const apiText = apiUseInfo.querySelector('div.labeled')?.textContent.trim();
                if (apiText && !apiText.includes('API')) {
                    apiUseInfo.style.display = 'revert !important';
                }
            }
        }
    }

    // ===============================
    // ИНИЦИАЛИЗАЦИЯ
    // ===============================

    // Запускаем приложение
    new LZTStreamerMode();

})();