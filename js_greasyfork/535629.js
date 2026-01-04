// ==UserScript==
// @name         Google Search Custom Sidebar
// @name:zh-TW   Google 搜尋自訂側邊欄
// @name:ja      Google検索カスタムサイドバー
// @namespace    https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version      0.4.2
// @description  Customizable Google Search sidebar: quick filters (lang, time, filetype, country, date), site search, Verbatim & Personalization tools.
// @description:zh-TW Google 搜尋自訂側邊欄：快速篩選(語言、時間、檔案類型、國家、日期)、站內搜尋、一字不差與個人化工具。
// @description:ja Google検索カスタムサイドバー：高速フィルター(言語,期間,ファイル形式,国,日付)、サイト検索、完全一致検索とパーソナライズツール。
// @match        https://www.google.com/search*
// @include      /^https:\/\/(?:ipv4|ipv6|www)\.google\.(?:[a-z\.]+)\/search\?(?:.+&)?q=[^&]+(?:&.+)?$/
// @exclude      /^https:\/\/(?:ipv4|ipv6|www)\.google\.(?:[a-z\.]+)\/search\?(?:.+&)?(?:tbm=(?:isch|shop|bks|flm|fin|lcl)|udm=(?:2|28|50))(?:&.+)?$/
// @icon         https://www.google.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-idle
// @author       StonedKhajiit
// @license      MIT
// @require      https://update.greasyfork.org/scripts/535624/1629293/Google%20Search%20Custom%20Sidebar%20-%20i18n.js
// @require      https://update.greasyfork.org/scripts/535625/1629294/Google%20Search%20Custom%20Sidebar%20-%20Styles.js
// @downloadURL https://update.greasyfork.org/scripts/535629/Google%20Search%20Custom%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/535629/Google%20Search%20Custom%20Sidebar.meta.js
// ==/UserScript==

/**
 * @file Google Search Custom Sidebar
 * This script injects a customizable sidebar into Google search results pages,
 * offering advanced filtering options, site search capabilities, and quick-access tools.
 * It is designed to be highly modular, configurable, and maintainable.
 */
(function() {
    'use strict';

    // --- Script Constants & Configuration ---

    const SCRIPT_INTERNAL_NAME = 'GoogleSearchCustomSidebar';
    const SCRIPT_VERSION = '0.4.2'; // version bumped for changes
    const LOG_PREFIX = `[${SCRIPT_INTERNAL_NAME} v${SCRIPT_VERSION}]`;

    /**
     * @constant {string[]} DEFAULT_SECTION_ORDER
     * Defines the default display order for sections in the sidebar.
     */
    const DEFAULT_SECTION_ORDER = [
        'sidebar-section-language', 'sidebar-section-time', 'sidebar-section-filetype',
        'sidebar-section-occurrence',
        'sidebar-section-country', 'sidebar-section-date-range', 'sidebar-section-site-search', 'sidebar-section-tools'
    ];

    /**
     * @constant {Object} defaultSettings
     * Contains the default configuration for the script. This object serves as a fallback
     * for any missing settings and is used when resetting the configuration.
     */
    const defaultSettings = {
        sidebarPosition: { left: 0, top: 80 },
        sectionStates: {},
        theme: 'system',
        hoverMode: false,
        idleOpacity: 0.8,
        sidebarWidth: 135,
        sidebarHeight: 85,
        fontSize: 12.5,
        headerIconSize: 16,
        verticalSpacingMultiplier: 0.5,
        interfaceLanguage: 'auto',
        customColors: {
            bgColor: '',
            textColor: '',
            linkColor: '',
            selectedColor: '',
            inputTextColor: '',
            borderColor: '',
            dividerColor: '',
            btnBgColor: '',
            btnHoverBgColor: '',
            activeBgColor: '',
            activeTextColor: '',
            activeBorderColor: '',
            headerIconColor: ''
        },
        visibleSections: {
            'sidebar-section-language': true, 'sidebar-section-time': true, 'sidebar-section-filetype': true,
            'sidebar-section-occurrence': true,
            'sidebar-section-country': true, 'sidebar-section-date-range': true,
            'sidebar-section-site-search': true, 'sidebar-section-tools': true
        },
        sectionDisplayMode: 'remember',
        accordionMode: false,
        resetButtonLocation: 'topBlock',
        verbatimButtonLocation: 'header',
        advancedSearchLinkLocation: 'header',
        personalizationButtonLocation: 'tools',
        googleScholarShortcutLocation: 'tools',
        googleTrendsShortcutLocation: 'tools',
        googleDatasetSearchShortcutLocation: 'tools',
        countryDisplayMode: 'iconAndText',
        scrollbarPosition: 'right',
        showResultStats: true,
        customLanguages: [],
        customTimeRanges: [],
        customFiletypes: [
            { text: "📄Documents", value: "pdf OR docx OR doc OR odt OR rtf OR txt" },
            { text: "💹Spreadsheets", value: "xlsx OR xls OR ods OR csv" },
            { text: "📊Presentations", value: "pptx OR ppt OR odp OR key" },
        ],
        customCountries: [],
        displayLanguages: [],
        displayCountries: [],
        favoriteSites: [
            // == SINGLE SITES: GENERAL KNOWLEDGE & REFERENCE ==
            { text: 'Wikipedia (EN)', url: 'en.wikipedia.org' },
            { text: 'Wiktionary', url: 'wiktionary.org' },
            { text: 'Internet Archive', url: 'archive.org' },

            // == SINGLE SITES: DEVELOPER & TECH ==
            { text: 'GitHub', url: 'github.com' },
            { text: 'GitLab', url: 'gitlab.com' },
            { text: 'Stack Overflow', url: 'stackoverflow.com' },
            { text: 'Hacker News', url: 'news.ycombinator.com' },
            { text: 'Greasy Fork', url: 'greasyfork.org' },

            // == SINGLE SITES: SOCIAL, FORUMS & COMMUNITIES ==
            { text: 'Reddit', url: 'reddit.com' },
            { text: 'X', url: 'x.com' },
            { text: 'Mastodon', url: 'mastodon.social' },
            { text: 'Bluesky', url: 'bsky.app' },
            { text: 'Lemmy', url: 'lemmy.world' },

            // == SINGLE SITES: ENTERTAINMENT, ARTS & HOBBIES ==
            { text: 'IMDb', url: 'imdb.com' },
            { text: 'TMDb', url: 'themoviedb.org' },
            { text: 'Letterboxd', url: 'letterboxd.com' },
            { text: 'Metacritic', url: 'metacritic.com' },
            { text: 'OpenCritic', url: 'opencritic.com' },
            { text: 'Steam', url: 'store.steampowered.com' },
            { text: 'Bandcamp', url: 'bandcamp.com' },
            { text: 'Last.fm', url: 'last.fm' },

            // == COMBINED SITE GROUPS ==
            {
                text: '💬Social',
                url: 'x.com OR facebook.com OR instagram.com OR threads.net OR bluesky.social OR mastodon.social OR reddit.com OR tumblr.com OR linkedin.com OR lemmy.world'
            },
            {
                text: '📦Repositories',
                url: 'github.com OR gitlab.com OR bitbucket.org OR codeberg.org OR sourceforge.net'
            },
            {
                text: '🎓Academics',
                url: 'scholar.google.com OR arxiv.org OR researchgate.net OR jstor.org OR academia.edu OR pubmed.ncbi.nlm.nih.gov OR semanticscholar.org OR core.ac.uk'
            },
            {
                text: '📰News',
                url: 'bbc.com/news OR reuters.com OR apnews.com OR nytimes.com OR theguardian.com OR cnn.com OR wsj.com'
            },
            {
                text: '🎨Creative',
                url: 'behance.net OR dribbble.com OR artstation.com OR deviantart.com'
            }
        ],
        enableSiteSearchCheckboxMode: true,
        showFaviconsForSiteSearch: true,
        enableFiletypeCheckboxMode: true,
        sidebarCollapsed: false,
        draggableHandleEnabled: true,
        enabledPredefinedOptions: {
            language: ['lang_en'],
            country: ['countryUS'],
            time: ['d', 'w', 'm', 'y', 'h'],
            filetype: ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'txt']
        },
        sidebarSectionOrder: [...DEFAULT_SECTION_ORDER],
        hideGoogleLogoWhenExpanded: false,
    };

    /**
     * @constant {Object<string, string>} IDS
     * A centralized collection of all DOM element IDs used throughout the script.
     * Uses a 'gscs-' prefix and a BEM-like naming convention to prevent conflicts with the host page.
     */
    const IDS = {
        SIDEBAR: 'gscs-sidebar',
        SETTINGS_OVERLAY: 'gscs-settings-overlay',
        SETTINGS_WINDOW: 'gscs-settings-window',
        COLLAPSE_BUTTON: 'gscs-sidebar-collapse-button',
        SETTINGS_BUTTON: 'gscs-sidebar-settings-button',
        TOOL_RESET_BUTTON: 'gscs-tool-reset-button',
        TOOL_VERBATIM: 'gscs-tool-verbatim',
        TOOL_PERSONALIZE: 'gscs-tool-personalize-search',
        TOOL_GOOGLE_SCHOLAR: 'gscs-tool-google-scholar',
        TOOL_GOOGLE_TRENDS: 'gscs-tool-google-trends',
        TOOL_GOOGLE_DATASET_SEARCH: 'gscs-tool-google-dataset-search',
        APPLY_SELECTED_SITES_BUTTON: 'gscs-apply-selected-sites-button',
        APPLY_SELECTED_FILETYPES_BUTTON: 'gscs-apply-selected-filetypes-button',
        FIXED_TOP_BUTTONS: 'gscs-sidebar-fixed-top-buttons',
        SETTINGS_MESSAGE_BAR: 'gscs-settings-message-bar',
        SETTING_WIDTH: 'gscs-setting-sidebar-width',
        SETTING_HEIGHT: 'gscs-setting-sidebar-height',
        SETTING_FONT_SIZE: 'gscs-setting-font-size',
        SETTING_HEADER_ICON_SIZE: 'gscs-setting-header-icon-size',
        SETTING_VERTICAL_SPACING: 'gscs-setting-vertical-spacing',
        SETTING_INTERFACE_LANGUAGE: 'gscs-setting-interface-language',
        SETTING_SECTION_MODE: 'gscs-setting-section-display-mode',
        SETTING_ACCORDION: 'gscs-setting-accordion-mode',
        SETTING_DRAGGABLE: 'gscs-setting-draggable-handle',
        SETTING_RESET_LOCATION: 'gscs-setting-reset-button-location',
        SETTING_VERBATIM_LOCATION: 'gscs-setting-verbatim-button-location',
        SETTING_ADV_SEARCH_LOCATION: 'gscs-setting-adv-search-link-location',
        SETTING_PERSONALIZE_LOCATION: 'gscs-setting-personalize-button-location',
        SETTING_SCHOLAR_LOCATION: 'gscs-setting-scholar-shortcut-location',
        SETTING_TRENDS_LOCATION: 'gscs-setting-trends-shortcut-location',
        SETTING_DATASET_SEARCH_LOCATION: 'gscs-setting-dataset-search-shortcut-location',
        SETTING_SITE_SEARCH_CHECKBOX_MODE: 'gscs-setting-site-search-checkbox-mode',
        SETTING_SHOW_FAVICONS: 'gscs-setting-show-favicons',
        SETTING_FILETYPE_SEARCH_CHECKBOX_MODE: 'gscs-setting-filetype-search-checkbox-mode',
        SETTING_COUNTRY_DISPLAY_MODE: 'gscs-setting-country-display-mode',
        SETTING_THEME: 'gscs-setting-theme',
        SETTING_HOVER: 'gscs-setting-hover-mode',
        SETTING_OPACITY: 'gscs-setting-idle-opacity',
        SETTING_HIDE_GOOGLE_LOGO: 'gscs-setting-hide-google-logo',
        SETTING_SCROLLBAR_POSITION: 'gscs-setting-scrollbar-position',
        SETTING_SHOW_RESULT_STATS: 'gscs-setting-show-result-stats',
        CUSTOM_COLORS_CONTAINER: 'gscs-custom-colors-container',
        SETTING_COLOR_BG_COLOR: 'gscs-setting-color-bg-color',
        SETTING_COLOR_TEXT_COLOR: 'gscs-setting-color-text-color',
        SETTING_COLOR_LINK_COLOR: 'gscs-setting-color-link-color',
        SETTING_COLOR_SELECTED_COLOR: 'gscs-setting-color-selected-color',
        SETTING_COLOR_INPUT_TEXT_COLOR: 'gscs-setting-color-input-text-color',
        SETTING_COLOR_BORDER_COLOR: 'gscs-setting-color-border-color',
        SETTING_COLOR_DIVIDER_COLOR: 'gscs-setting-color-divider-color',
        SETTING_COLOR_BTN_BG_COLOR: 'gscs-setting-color-btn-bg-color',
        SETTING_COLOR_BTN_HOVER_BG_COLOR: 'gscs-setting-color-btn-hover-bg-color',
        SETTING_COLOR_ACTIVE_BG_COLOR: 'gscs-setting-color-active-bg-color',
        SETTING_COLOR_ACTIVE_TEXT_COLOR: 'gscs-setting-color-active-text-color',
        SETTING_COLOR_ACTIVE_BORDER_COLOR: 'gscs-setting-color-active-border-color',
        SETTING_COLOR_HEADER_ICON_COLOR: 'gscs-setting-color-header-icon-color',
        RESET_CUSTOM_COLORS_BTN: 'gscs-reset-custom-colors-btn',
        TAB_PANE_GENERAL: 'gscs-tab-pane-general',
        TAB_PANE_APPEARANCE: 'gscs-tab-pane-appearance',
        TAB_PANE_FEATURES: 'gscs-tab-pane-features',
        TAB_PANE_CUSTOM: 'gscs-tab-pane-custom',
        SITES_LIST: 'gscs-custom-sites-list',
        LANG_LIST: 'gscs-custom-languages-list',
        TIME_LIST: 'gscs-custom-time-ranges-list',
        FT_LIST: 'gscs-custom-filetypes-list',
        COUNTRIES_LIST: 'gscs-custom-countries-list',
        NEW_SITE_NAME: 'gscs-new-site-name',
        NEW_SITE_URL: 'gscs-new-site-url',
        ADD_SITE_BTN: 'gscs-add-site-button',
        NEW_LANG_TEXT: 'gscs-new-lang-text',
        NEW_LANG_VALUE: 'gscs-new-lang-value',
        ADD_LANG_BTN: 'gscs-add-lang-button',
        NEW_TIME_TEXT: 'gscs-new-timerange-text',
        NEW_TIME_VALUE: 'gscs-new-timerange-value',
        ADD_TIME_BTN: 'gscs-add-timerange-button',
        NEW_FT_TEXT: 'gscs-new-ft-text',
        NEW_FT_VALUE: 'gscs-new-ft-value',
        ADD_FT_BTN: 'gscs-add-ft-button',
        NEW_COUNTRY_TEXT: 'gscs-new-country-text',
        NEW_COUNTRY_VALUE: 'gscs-new-country-value',
        ADD_COUNTRY_BTN: 'gscs-add-country-button',
        DATE_MIN: 'gscs-date-min',
        DATE_MAX: 'gscs-date-max',
        DATE_RANGE_ERROR_MSG: 'gscs-date-range-error-msg',
        SIDEBAR_SECTION_ORDER_LIST: 'gscs-sidebar-section-order-list',
        NOTIFICATION_CONTAINER: 'gscs-notification-container',
        MODAL_ADD_NEW_OPTION_BTN: 'gscs-modal-add-new-option-btn',
        MODAL_PREDEFINED_CHOOSER_CONTAINER: 'gscs-modal-predefined-chooser-container',
        MODAL_PREDEFINED_CHOOSER_LIST: 'gscs-modal-predefined-chooser-list',
        MODAL_PREDEFINED_CHOOSER_ADD_BTN: 'gscs-modal-predefined-chooser-add-btn',
        MODAL_PREDEFINED_CHOOSER_CANCEL_BTN: 'gscs-modal-predefined-chooser-cancel-btn',
        CLEAR_SITE_SEARCH_OPTION: 'gscs-clear-site-search-option',
        CLEAR_FILETYPE_SEARCH_OPTION: 'gscs-clear-filetype-search-option',
        RESULT_STATS_CONTAINER: 'gscs-result-stats-container'
    };

    /**
     * @constant {Object[]} COLOR_MAPPINGS
     * Maps settings UI color pickers to their corresponding CSS custom properties.
     * Each object defines the DOM element ID of the color picker, the key in the settings object,
     * and an array of CSS variables it controls.
     */
    const COLOR_MAPPINGS = [
        { id: IDS.SETTING_COLOR_BG_COLOR,           key: 'bgColor',         cssVars: ['--sidebar-bg-color'] },
        { id: IDS.SETTING_COLOR_TEXT_COLOR,         key: 'textColor',       cssVars: ['--sidebar-text-color', '--sidebar-tool-btn-hover-text'] },
        { id: IDS.SETTING_COLOR_LINK_COLOR,         key: 'linkColor',       cssVars: ['--sidebar-link-color', '--sidebar-link-hover-color', '--sidebar-header-btn-hover-color'] },
        { id: IDS.SETTING_COLOR_SELECTED_COLOR,     key: 'selectedColor',   cssVars: ['--sidebar-selected-color'] },
        { id: IDS.SETTING_COLOR_INPUT_TEXT_COLOR,   key: 'inputTextColor',  cssVars: ['--sidebar-input-text'] },
        { id: IDS.SETTING_COLOR_BORDER_COLOR,       key: 'borderColor',     cssVars: ['--sidebar-border-color', '--sidebar-tool-btn-border', '--sidebar-input-border', '--sidebar-tool-btn-hover-border'] },
        { id: IDS.SETTING_COLOR_DIVIDER_COLOR,      key: 'dividerColor',    cssVars: ['--sidebar-section-border-color'] },
        { id: IDS.SETTING_COLOR_BTN_BG_COLOR,       key: 'btnBgColor',      cssVars: ['--sidebar-tool-btn-bg', '--sidebar-input-bg'] },
        { id: IDS.SETTING_COLOR_BTN_HOVER_BG_COLOR, key: 'btnHoverBgColor', cssVars: ['--sidebar-tool-btn-hover-bg'] },
        { id: IDS.SETTING_COLOR_ACTIVE_BG_COLOR,    key: 'activeBgColor',   cssVars: ['--sidebar-tool-btn-active-bg', '--sidebar-header-btn-active-bg'] },
        { id: IDS.SETTING_COLOR_ACTIVE_TEXT_COLOR,  key: 'activeTextColor', cssVars: ['--sidebar-tool-btn-active-text', '--sidebar-header-btn-active-color', '--sidebar-tool-btn-text'] },
        { id: IDS.SETTING_COLOR_ACTIVE_BORDER_COLOR,key: 'activeBorderColor', cssVars: ['--sidebar-tool-btn-active-border'] },
        { id: IDS.SETTING_COLOR_HEADER_ICON_COLOR,  key: 'headerIconColor', cssVars: ['--sidebar-header-btn-color'] },
    ];

    /**
     * @constant {Object<string, string>} CSS
     * A centralized collection of all CSS class names used for styling and state management.
     * Follows a BEM-like convention (Block__Element--Modifier) for clarity and to prevent style conflicts.
     */
    const CSS = {
        // State Modifiers (BEM-like)
        IS_SIDEBAR_COLLAPSED: 'is-sidebar-collapsed',
        IS_SECTION_COLLAPSED: 'is-section-collapsed',
        IS_SELECTED: 'is-selected',
        IS_ACTIVE: 'is-active',
        IS_DRAGGING: 'is-dragging',
        IS_DRAG_OVER: 'is-drag-over',
        IS_ERROR_VISIBLE: 'is-error-visible',
        HAS_ERROR: 'has-error',

        // Theme Classes
        THEME_LIGHT: 'gscs-theme-light',
        THEME_DARK: 'gscs-theme-dark',
        THEME_MINIMAL: 'gscs-theme-minimal',
        THEME_MINIMAL_LIGHT: 'gscs-theme-minimal--light',
        THEME_MINIMAL_DARK: 'gscs-theme-minimal--dark',

        // Components & Blocks
        SIDEBAR_HEADER: 'gscs-sidebar__header',
        SIDEBAR_CONTENT_WRAPPER: 'gscs-sidebar__content-wrapper',
        DRAG_HANDLE: 'gscs-sidebar__drag-handle',
        SETTINGS_BUTTON: 'gscs-settings-button',
        HEADER_BUTTON: 'gscs-header-button',
        SECTION: 'gscs-section',
        FIXED_TOP_BUTTONS_ITEM: 'gscs-fixed-top-buttons__item',
        SECTION_TITLE: 'gscs-section__title',
        SECTION_CONTENT: 'gscs-section__content',
        FILTER_OPTION: 'gscs-filter-option',
        CHECKBOX_SITE: 'gscs-checkbox--site',
        CHECKBOX_FILETYPE: 'gscs-checkbox--filetype',
        BUTTON_APPLY_SITES: 'gscs-button--apply-sites',
        BUTTON_APPLY_FILETYPES: 'gscs-button--apply-filetypes',
        DATE_INPUT_LABEL: 'gscs-date-input__label',
        DATE_INPUT_FIELD: 'gscs-date-input__field',
        BUTTON: 'gscs-button',
        CUSTOM_LIST: 'gscs-custom-list',
        CUSTOM_LIST_ITEM_CONTROLS: 'gscs-custom-list__item-controls',
        BUTTON_EDIT_ITEM: 'gscs-button--edit-item',
        BUTTON_DELETE_ITEM: 'gscs-button--delete-item',
        CUSTOM_LIST_INPUT_GROUP: 'gscs-custom-list__input-group',
        BUTTON_ADD_CUSTOM: 'gscs-button--add-custom',
        SETTINGS_HEADER: 'gscs-settings__header',
        SETTINGS_CLOSE_BTN: 'gscs-settings__close-button',
        SETTINGS_TABS: 'gscs-settings__tabs',
        TAB_BUTTON: 'gscs-tab-button',
        SETTINGS_TAB_CONTENT: 'gscs-settings__tab-content',
        TAB_PANE: 'gscs-tab-pane',
        SETTING_ITEM: 'gscs-setting-item',
        SETTING_ITEM_LABEL_INLINE: 'gscs-setting-item__label--inline',
        SETTINGS_FOOTER: 'gscs-settings__footer',
        BUTTON_SAVE: 'gscs-button--save',
        BUTTON_CANCEL: 'gscs-button--cancel',
        BUTTON_RESET: 'gscs-button--reset',
        SETTING_ITEM_SIMPLE: 'gscs-setting-item--simple',
        SETTING_RANGE_VALUE: 'gscs-setting-item__range-value',
        SETTING_RANGE_HINT: 'gscs-setting-item__range-hint',
        SECTION_ORDER_LIST: 'gscs-section-order-list',
        INPUT_ERROR_MSG: 'gscs-input-error-message',
        DATE_RANGE_ERROR_MSG: 'gscs-date-range-error-message',
        MESSAGE_BAR: 'gscs-message-bar',
        MSG_INFO: 'gscs-message-bar--info',
        MSG_SUCCESS: 'gscs-message-bar--success',
        MSG_WARNING: 'gscs-message-bar--warning',
        MSG_ERROR: 'gscs-message-bar--error',
        BUTTON_MANAGE_CUSTOM: 'gscs-button--manage-custom',
        NOTIFICATION: 'gscs-notification',
        NTF_INFO: 'gscs-notification--info',
        NTF_SUCCESS: 'gscs-notification--success',
        NTF_WARNING: 'gscs-notification--warning',
        NTF_ERROR: 'gscs-notification--error',
        DRAG_ICON: 'gscs-drag-icon',
        FAVICON: 'gscs-favicon',
        BUTTON_REMOVE_FROM_LIST: 'gscs-button--remove-from-list',
        MODAL_BUTTON_ADD_NEW: 'gscs-modal__add-new-button',
        MODAL_PREDEFINED_CHOOSER: 'gscs-modal-predefined-chooser',
        MODAL_PREDEFINED_CHOOSER_ITEM: 'gscs-modal-predefined-chooser__item',
        SETTING_VALUE_HINT: 'gscs-setting-value-hint'
    };

    /**
     * @constant {Object<string, string>} DATA_ATTR
     * A collection of `data-*` attribute names used to store state or metadata directly on DOM elements.
     */
    const DATA_ATTR = {
        FILTER_TYPE: 'filterType', FILTER_VALUE: 'filterValue', SITE_URL: 'siteUrl', SECTION_ID: 'sectionId',
        FILETYPE_VALUE: 'filetypeValue',
        LIST_ID: 'listId', INDEX: 'index', LISTENER_ATTACHED: 'listenerAttached', TAB: 'tab', MANAGE_TYPE: 'managetype',
        ITEM_TYPE: 'itemType', ITEM_ID: 'itemId'
    };

    /**
     * @constant {string} STORAGE_KEY
     * The key used for storing the script's settings in the browser's local storage via GM_setValue/GM_getValue.
     */
    const STORAGE_KEY = 'googleSearchCustomSidebarSettings_v1';

    /**
     * @constant {Object<string, string>} SVG_ICONS
     * A collection of SVG icon strings. Storing them as strings allows them to be easily injected into the DOM
     * without needing to fetch external files.
     */
    const SVG_ICONS = {
        chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        reset: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        verbatim: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(-4.3875 -3.2375) scale(1.15)"><path d="M6 17.5c0 1.5 1.5 2.5 3 2.5h1.5c1.5 0 3-1 3-2.5V9c0-1.5-1.5-2.5-3-2.5H9C7.5 6.5 6 7.5 6 9v8.5z"/><path d="M15 17.5c0 1.5 1.5 2.5 3 2.5h1.5c1.5 0 3-1 3-2.5V9c0-1.5-1.5-2.5-3-2.5H18c-1.5 0-3 1-3 2.5v8.5z"/></g></svg>`,
        magnifyingGlass: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        add: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        update: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        personalization: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        dragGrip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`,
        removeFromList: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        googleScholar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 11.24L3.62 9 12 5.11 20.38 9 12 14.24zM5 13.18V17.5a1.5 1.5 0 001.5 1.5h11A1.5 1.5 0 0019 17.5v-4.32l-7 3.82-7-3.82z"/></svg>`,
        googleTrends: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>`,
        googleDatasetSearch: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M3 18v-2h18v2H3Zm0-5v-2h18v2H3Zm0-5V6h18v2H3Z"/></svg>`
    };

    /**
     * @constant {Object} SERVICE_SHORTCUT_CONFIG
     * A centralized configuration for all external service shortcut buttons.
     * This object drives the generic shortcut button creation function.
     */
    const SERVICE_SHORTCUT_CONFIG = {
        googleScholar: {
            id: IDS.TOOL_GOOGLE_SCHOLAR,
            svgIcon: SVG_ICONS.googleScholar,
            titleKey: 'tooltip_google_scholar_search',
            textKey: 'tool_google_scholar',
            serviceNameKey: 'service_name_google_scholar',
            baseUrl: 'https://scholar.google.com/scholar',
            queryParam: 'q',
            homepage: 'https://scholar.google.com/'
        },
        googleTrends: {
            id: IDS.TOOL_GOOGLE_TRENDS,
            svgIcon: SVG_ICONS.googleTrends,
            titleKey: 'tooltip_google_trends_search',
            textKey: 'tool_google_trends',
            serviceNameKey: 'service_name_google_trends',
            baseUrl: 'https://trends.google.com/trends/explore',
            queryParam: 'q',
            homepage: 'https://trends.google.com/trends/'
        },
        googleDatasetSearch: {
            id: IDS.TOOL_GOOGLE_DATASET_SEARCH,
            svgIcon: SVG_ICONS.googleDatasetSearch,
            titleKey: 'tooltip_google_dataset_search',
            textKey: 'tool_google_dataset_search',
            serviceNameKey: 'service_name_google_dataset_search',
            baseUrl: 'https://datasetsearch.research.google.com/search',
            queryParam: 'query',
            homepage: 'https://datasetsearch.research.google.com/'
        }
    };

    /**
     * @constant {Object} PREDEFINED_OPTIONS
     * A data structure containing all built-in, non-customizable filter options
     * for various categories like language, country, etc. The text is stored as a key
     * for internationalization.
     */
    const PREDEFINED_OPTIONS = {
        language: [ { textKey: 'predefined_lang_en', value: 'lang_en' }, { textKey: 'predefined_lang_ja', value: 'lang_ja' }, { textKey: 'predefined_lang_ko', value: 'lang_ko' }, { textKey: 'predefined_lang_fr', value: 'lang_fr' }, { textKey: 'predefined_lang_de', value: 'lang_de' }, { textKey: 'predefined_lang_es', value: 'lang_es' }, { textKey: 'predefined_lang_it', value: 'lang_it' }, { textKey: 'predefined_lang_pt', value: 'lang_pt' }, { textKey: 'predefined_lang_ru', value: 'lang_ru' }, { textKey: 'predefined_lang_ar', value: 'lang_ar' }, { textKey: 'predefined_lang_hi', value: 'lang_hi' }, { textKey: 'predefined_lang_nl', value: 'lang_nl' }, { textKey: 'predefined_lang_tr', value: 'lang_tr' }, { textKey: 'predefined_lang_vi', value: 'lang_vi' }, { textKey: 'predefined_lang_th', value: 'lang_th' }, { textKey: 'predefined_lang_id', value: 'lang_id' }, { textKey: 'predefined_lang_zh_tw', value: 'lang_zh-TW' }, { textKey: 'predefined_lang_zh_cn', value: 'lang_zh-CN' }, { textKey: 'predefined_lang_zh_all', value: 'lang_zh-TW|lang_zh-CN' }, ],
        country: [ { textKey: 'predefined_country_us', value: 'countryUS' }, { textKey: 'predefined_country_gb', value: 'countryGB' }, { textKey: 'predefined_country_ca', value: 'countryCA' }, { textKey: 'predefined_country_au', value: 'countryAU' }, { textKey: 'predefined_country_de', value: 'countryDE' }, { textKey: 'predefined_country_fr', value: 'countryFR' }, { textKey: 'predefined_country_jp', value: 'countryJP' }, { textKey: 'predefined_country_kr', value: 'countryKR' }, { textKey: 'predefined_country_cn', value: 'countryCN' }, { textKey: 'predefined_country_in', value: 'countryIN' }, { textKey: 'predefined_country_br', value: 'countryBR' }, { textKey: 'predefined_country_mx', value: 'countryMX' }, { textKey: 'predefined_country_es', value: 'countryES' }, { textKey: 'predefined_country_it', value: 'countryIT' }, { textKey: 'predefined_country_ru', value: 'countryRU' }, { textKey: 'predefined_country_nl', value: 'countryNL' }, { textKey: 'predefined_country_sg', value: 'countrySG' }, { textKey: 'predefined_country_hk', value: 'countryHK' }, { textKey: 'predefined_country_tw', value: 'countryTW' }, { textKey: 'predefined_country_my', value: 'countryMY' }, { textKey: 'predefined_country_vn', value: 'countryVN' }, { textKey: 'predefined_country_ph', value: 'countryPH' }, { textKey: 'predefined_country_th', value: 'countryTH' }, { textKey: 'predefined_country_za', value: 'countryZA' }, { textKey: 'predefined_country_tr', value: 'countryTR' }, ],
        time: [ { textKey: 'predefined_time_h', value: 'h' }, { textKey: 'predefined_time_h2', value: 'h2' }, { textKey: 'predefined_time_h6', value: 'h6' }, { textKey: 'predefined_time_h12', value: 'h12' }, { textKey: 'predefined_time_d', value: 'd' }, { textKey: 'predefined_time_d2', value: 'd2' }, { textKey: 'predefined_time_d3', value: 'd3' }, { textKey: 'predefined_time_w', value: 'w' }, { textKey: 'predefined_time_m', value: 'm' }, { textKey: 'predefined_time_y', value: 'y' }, ],
        filetype: [ { textKey: 'predefined_filetype_pdf', value: 'pdf' }, { textKey: 'predefined_filetype_docx', value: 'docx' }, { textKey: 'predefined_filetype_doc', value: 'doc' }, { textKey: 'predefined_filetype_xlsx', value: 'xlsx' }, { textKey: 'predefined_filetype_xls', value: 'xls' }, { textKey: 'predefined_filetype_pptx', value: 'pptx' }, { textKey: 'predefined_filetype_ppt', value: 'ppt' }, { textKey: 'predefined_filetype_txt', value: 'txt' }, { textKey: 'predefined_filetype_rtf', value: 'rtf' }, { textKey: 'predefined_filetype_html', value: 'html' }, { textKey: 'predefined_filetype_htm', value: 'htm' }, { textKey: 'predefined_filetype_xml', value: 'xml' }, { textKey: 'predefined_filetype_jpg', value: 'jpg' }, { textKey: 'predefined_filetype_png', value: 'png' }, { textKey: 'predefined_filetype_gif', value: 'gif' }, { textKey: 'predefined_filetype_svg', value: 'svg' }, { textKey: 'predefined_filetype_bmp', value: 'bmp' }, { textKey: 'predefined_filetype_js', value: 'js' }, { textKey: 'predefined_filetype_css', value: 'css' }, { textKey: 'predefined_filetype_py', value: 'py' }, { textKey: 'predefined_filetype_java', value: 'java' }, { textKey: 'predefined_filetype_cpp', value: 'cpp' }, { textKey: 'predefined_filetype_cs', value: 'cs' }, { textKey: 'predefined_filetype_kml', value: 'kml'}, { textKey: 'predefined_filetype_kmz', value: 'kmz'}, ]
    };

    /**
     * @constant {Object[]} ALL_SECTION_DEFINITIONS
     * The single source of truth for all sidebar sections. This array of objects defines
     * the properties and behavior of each section, such as its ID, type, title,
     * associated URL parameters, and keys for accessing settings.
     */
    const ALL_SECTION_DEFINITIONS = [
        { id: 'sidebar-section-language', type: 'filter', titleKey: 'section_language', scriptDefined: [{textKey:'filter_any_language',v:''}], param: 'lr', predefinedOptionsKey: 'language', customItemsKey: 'customLanguages', displayItemsKey: 'displayLanguages' },
        { id: 'sidebar-section-time', type: 'filter', titleKey: 'section_time', scriptDefined: [{textKey:'filter_any_time',v:''}], param: 'qdr', predefinedOptionsKey: 'time', customItemsKey: 'customTimeRanges' },
        { id: 'sidebar-section-filetype', type: 'filetype', titleKey: 'section_filetype', scriptDefined: [{ textKey: 'filter_any_format', v: '' }], param: 'as_filetype', predefinedOptionsKey: 'filetype', customItemsKey: 'customFiletypes' },
        {
            id: 'sidebar-section-occurrence',
            type: 'filter',
            titleKey: 'section_occurrence',
            scriptDefined: [
                { textKey: 'filter_occurrence_any', v: 'any' },
                { textKey: 'filter_occurrence_title', v: 'title' },
                { textKey: 'filter_occurrence_text', v: 'body' },
                { textKey: 'filter_occurrence_url', v: 'url' },
                { textKey: 'filter_occurrence_links', v: 'links' }
            ],
            param: 'as_occt'
        },
        { id: 'sidebar-section-country', type: 'filter', titleKey: 'section_country', scriptDefined: [{textKey:'filter_any_country',v:''}], param: 'cr', predefinedOptionsKey: 'country', customItemsKey: 'customCountries', displayItemsKey: 'displayCountries' },
        { id: 'sidebar-section-date-range', type: 'date', titleKey: 'section_date_range' },
        { id: 'sidebar-section-site-search', type: 'site', titleKey: 'section_site_search', scriptDefined: [{ textKey: 'filter_any_site', v:''}] },
        { id: 'sidebar-section-tools', type: 'tools', titleKey: 'section_tools' }
    ];

    // --- Global State Variables ---
    let sidebar = null, systemThemeMediaQuery = null;
    const MIN_SIDEBAR_TOP_POSITION = 1;
    let debouncedSaveSettings;
    let globalMessageTimeout = null;
	
    /**
     * @module LocalizationService
     * Manages all internationalization (i18n) aspects of the script.
     * It merges built-in and external translation packs, detects the user's locale,
     * and provides a unified interface for retrieving translated strings.
     * This module ensures that all user-facing text can be easily localized.
     */
    const LocalizationService = (function() {
        const builtInTranslations = {
            'en': {
                scriptName: 'Google Search Custom Sidebar', settingsTitle: 'Google Search Custom Sidebar Settings', manageOptionsTitle: 'Manage Options', manageSitesTitle: 'Manage Favorite Sites', manageLanguagesTitle: 'Manage Language Options', manageCountriesTitle: 'Manage Country/Region Options', manageTimeRangesTitle: 'Manage Time Ranges', manageFileTypesTitle: 'Manage File Types', section_language: 'Language', section_time: 'Time', section_filetype: 'File Type', section_country: 'Country/Region', section_date_range: 'Date Range', section_site_search: 'Site Search', section_tools: 'Tools',
                section_occurrence: 'Keyword Location',
                filter_any_language: 'Any Language', filter_any_time: 'Any Time', filter_any_format: 'Any Format', filter_any_country: 'Any Country/Region', filter_any_site: 'Any Site',
                filter_occurrence_any: 'Anywhere in the page', filter_occurrence_title: 'In the title of the page', filter_occurrence_text: 'In the text of the page', filter_occurrence_url: 'In the URL of the page',
                filter_occurrence_links: 'In links to the page',
                filter_clear_site_search: 'Clear Site Search', filter_clear_tooltip_suffix: '(Clear)', predefined_lang_zh_tw: 'Traditional Chinese', predefined_lang_zh_cn: 'Simplified Chinese', predefined_lang_zh_all: 'All Chinese', predefined_lang_en: 'English', predefined_lang_ja: 'Japanese', predefined_lang_ko: 'Korean', predefined_lang_fr: 'French', predefined_lang_de: 'German', predefined_lang_es: 'Spanish', predefined_lang_it: 'Italian', predefined_lang_pt: 'Portuguese', predefined_lang_ru: 'Russian', predefined_lang_ar: 'Arabic', predefined_lang_hi: 'Hindi', predefined_lang_nl: 'Dutch', predefined_lang_tr: 'Turkish', predefined_lang_vi: 'Vietnamese', predefined_lang_th: 'Thai', predefined_lang_id: 'Indonesian', predefined_country_tw: '🇹🇼 Taiwan', predefined_country_jp: '🇯🇵 Japan', predefined_country_kr: '🇰🇷 South Korea', predefined_country_cn: '🇨🇳 China', predefined_country_hk: '🇭🇰 Hong Kong', predefined_country_sg: '🇸🇬 Singapore', predefined_country_my: '🇲🇾 Malaysia', predefined_country_vn: '🇻🇳 Vietnam', predefined_country_ph: '🇵🇭 Philippines', predefined_country_th: '🇹🇭 Thailand', predefined_country_us: '🇺🇸 United States', predefined_country_ca: '🇨🇦 Canada', predefined_country_br: '🇧🇷 Brazil', predefined_country_mx: '🇲🇽 Mexico', predefined_country_gb: '🇬🇧 United Kingdom', predefined_country_de: '🇩🇪 Germany', predefined_country_fr: '🇫🇷 France', predefined_country_it: '🇮🇹 Italy', predefined_country_es: '🇪🇸 Spain', predefined_country_ru: '🇷🇺 Russia', predefined_country_nl: '🇳🇱 Netherlands', predefined_country_au: '🇦🇺 Australia', predefined_country_in: '🇮🇳 India', predefined_country_za: '🇿🇦 South Africa', predefined_country_tr: '🇹🇷 Turkey', predefined_time_h: 'Past hour', predefined_time_h2: 'Past 2 hours', predefined_time_h6: 'Past 6 hours', predefined_time_h12: 'Past 12 hours', predefined_time_d: 'Past 24 hours', predefined_time_d2: 'Past 2 days', predefined_time_d3: 'Past 3 days', predefined_time_w: 'Past week', predefined_time_m: 'Past month', predefined_time_y: 'Past year', predefined_filetype_pdf: 'PDF', predefined_filetype_docx: 'Word (docx)', predefined_filetype_doc: 'Word (doc)', predefined_filetype_xlsx: 'Excel (xlsx)', predefined_filetype_xls: 'Excel (xls)', predefined_filetype_pptx: 'PowerPoint (pptx)', predefined_filetype_ppt: 'PowerPoint (ppt)', predefined_filetype_txt: 'Plain Text', predefined_filetype_rtf: 'Rich Text Format', predefined_filetype_html: 'Web Page (html)', predefined_filetype_htm: 'Web Page (htm)', predefined_filetype_xml: 'XML', predefined_filetype_jpg: 'JPEG Image', predefined_filetype_png: 'PNG Image', predefined_filetype_gif: 'GIF Image', predefined_filetype_svg: 'SVG Image', predefined_filetype_bmp: 'BMP Image', predefined_filetype_js: 'JavaScript', predefined_filetype_css: 'CSS', predefined_filetype_py: 'Python', predefined_filetype_java: 'Java', predefined_filetype_cpp: 'C++', predefined_filetype_cs: 'C#', predefined_filetype_kml: 'Google Earth (kml)', predefined_filetype_kmz: 'Google Earth (kmz)',
                tool_reset_filters: 'Reset Filters', tool_verbatim_search: 'Verbatim Search', tool_advanced_search: 'Advanced Search', tool_apply_date: 'Apply Dates',
                tool_personalization_toggle: 'Personalization', tool_apply_selected_sites: 'Apply Selected',
                tool_apply_selected_filetypes: 'Apply Selected',
                tool_google_scholar: 'Scholar',
                tooltip_google_scholar_search: 'Search current keywords on Google Scholar',
                service_name_google_scholar: 'Google Scholar',
                tool_google_trends: 'Trends',
                tooltip_google_trends_search: 'Explore current keywords on Google Trends',
                service_name_google_trends: 'Google Trends',
                tool_google_dataset_search: 'Dataset Search',
                tooltip_google_dataset_search: 'Search keywords on Google Dataset Search',
                service_name_google_dataset_search: 'Google Dataset Search',
                link_advanced_search_title: 'Open Google Advanced Search page', tooltip_site_search: 'Search within {siteUrl}', tooltip_clear_site_search: 'Remove site: restriction', tooltip_toggle_personalization_on: 'Click to turn Personalization ON (Results tailored to you)', tooltip_toggle_personalization_off: 'Click to turn Personalization OFF (More generic results)', settings_tab_general: 'General', settings_tab_appearance: 'Appearance', settings_tab_features: 'Features', settings_tab_custom: 'Custom', settings_close_button_title: 'Close', settings_interface_language: 'Interface Language:', settings_language_auto: 'Auto (Browser Default)', settings_section_mode: 'Section Collapse Mode:', settings_section_mode_remember: 'Remember State', settings_section_mode_expand: 'Expand All', settings_section_mode_collapse: 'Collapse All',
                settings_accordion_mode: 'Accordion Mode (only when "Remember State" is active)',
                settings_accordion_mode_hint_desc: 'When enabled, expanding one section will automatically collapse other open sections.',
                settings_enable_drag: 'Enable Dragging', settings_reset_button_location: 'Reset Button Location:', settings_verbatim_button_location: 'Verbatim Button Location:', settings_adv_search_location: '"Advanced Search" Link Location:', settings_personalize_button_location: 'Personalization Button Location:',
                settings_scholar_location: 'Google Scholar Shortcut Location:',
                settings_trends_location: 'Google Trends Shortcut Location:',
                settings_dataset_search_location: 'Dataset Search Shortcut Location:',
                settings_enable_site_search_checkbox_mode: 'Enable Checkbox Mode for Site Search',
                settings_enable_site_search_checkbox_mode_hint: 'Allows selecting multiple favorite sites for a combined (OR) search.',
                settings_show_favicons: 'Show Favicons for Site Search',
                settings_show_favicons_hint: 'Displays a website icon next to single-site entries for better identification.',
                settings_enable_filetype_search_checkbox_mode: 'Enable Checkbox Mode for Filetype Search',
                settings_enable_filetype_search_checkbox_mode_hint: 'Allows selecting multiple filetypes for a combined (OR) search.',
                settings_location_tools: 'Tools Section', settings_location_top: 'Top Block', settings_location_header: 'Sidebar Header', settings_location_hide: 'Hide', settings_sidebar_width: 'Sidebar Width (px)', settings_width_range_hint: '(Range: 90-270, Step: 5)', settings_sidebar_height: 'Sidebar Height (vh)', settings_height_range_hint: '(Range: 25-100, Step: 5)', settings_font_size: 'Base Font Size (px)', settings_font_size_range_hint: '(Range: 8-24, Step: 0.5)', settings_header_icon_size: 'Header Icon Size (px)', settings_header_icon_size_range_hint: '(Range: 8-32, Step: 0.5)', settings_vertical_spacing: 'Vertical Spacing', settings_vertical_spacing_range_hint: '(Multiplier Range: 0.05-1.5, Step: 0.05)', settings_theme: 'Theme:', settings_theme_system: 'Follow System', settings_theme_light: 'Light', settings_theme_dark: 'Dark', settings_theme_minimal_light: 'Minimal (Light)', settings_theme_minimal_dark: 'Minimal (Dark)', settings_hover_mode: 'Hover Mode', settings_idle_opacity: 'Idle Opacity:', settings_opacity_range_hint: '(Range: 0.1-1.0, Step: 0.05)', settings_country_display: 'Country/Region Display:', settings_country_display_icontext: 'Icon & Text', settings_country_display_text: 'Text Only', settings_country_display_icon: 'Icon Only', settings_scrollbar_position: 'Scrollbar Position:', settings_scrollbar_right: 'Right (Default)', settings_scrollbar_left: 'Left', settings_scrollbar_hidden: 'Hidden', settings_show_result_stats: 'Show Search Result Stats',
                settings_advanced_color_options: 'Advanced Color Options',
                settings_reset_colors_button: 'Reset Colors',
                settings_color_bg_color: 'Background Color',
                settings_color_text_color: 'Main Text Color',
                settings_color_link_color: 'Link & Title Color',				
                settings_color_selected_color: 'Selected Item Text Color',
                settings_color_input_text_color: 'Input Field Text Color',
                settings_color_border_color: 'Main Border Color',
                settings_color_divider_color: 'Section Divider Color',
                settings_color_btn_bg_color: 'Button Background Color',
                settings_color_btn_hover_bg_color: 'Button Hover BG Color',
                settings_color_active_bg_color: 'Active Item BG Color',
                settings_color_active_text_color: 'Active Item Text/Icon Color',
                settings_color_active_border_color: 'Active Item Border Color',
                settings_color_header_icon_color: 'Header Icon Color',
                settings_visible_sections: 'Visible Sections:', settings_section_order: 'Adjust Sidebar Section Order (Drag & Drop):',
                settings_section_order_hint: '(Drag items to reorder. Only affects checked sections)',
                settings_no_orderable_sections: 'No visible sections to order.',
                settings_move_up_title: 'Move Up',
                settings_move_down_title: 'Move Down',
                settings_hide_google_logo: 'Hide Google Logo when sidebar is expanded',
                settings_hide_google_logo_hint: 'Useful if the sidebar is placed in the top-left corner with a minimal theme.',
                settings_custom_intro: 'Manage filter options for each section:',
                settings_manage_sites_button: 'Manage Favorite Sites...', settings_manage_languages_button: 'Manage Language Options...', settings_manage_countries_button: 'Manage Country/Region Options...', settings_manage_time_ranges_button: 'Manage Time Ranges...', settings_manage_file_types_button: 'Manage File Types...', settings_save_button: 'Save Settings', settings_cancel_button: 'Cancel', settings_reset_all_button: 'Reset All',
                modal_label_enable_predefined: 'Enable Predefined {type}:',
                modal_label_my_custom: 'My Custom {type}:',
                modal_label_display_options_for: 'Display Options for {type} (Drag to Sort):',
                modal_button_add_new_option: 'Add New Option...',
                modal_button_add_predefined_option: 'Add Predefined...',
                modal_button_add_custom_option: 'Add Custom...',
                modal_placeholder_name: 'Name', modal_placeholder_domain: 'Domain (e.g., site.com OR example.net/path)',
                modal_placeholder_text: 'Text', modal_placeholder_value: 'Value (e.g., pdf OR docx)',
                modal_hint_domain: 'Format: domain/path (e.g., `wikipedia.org/wiki/Page` or `site.com`). Use `OR` (case-insensitive, space separated) for multiple.',
                modal_hint_language: 'Format: starts with `lang_`, e.g., `lang_ja`, `lang_zh-TW`. Use `|` for multiple.', modal_hint_country: 'Format: `country` + 2-letter uppercase code, e.g., `countryDE`', modal_hint_time: 'Format: `h`, `d`, `w`, `m`, `y`, optionally followed by numbers, e.g., `h1`, `d7`, `w`',
                modal_hint_filetype: 'Format: extension (e.g., `pdf`). Use `OR` (case-insensitive, space separated) for multiple (e.g., `docx OR xls`).',
                modal_tooltip_domain: 'Enter domain(s) with optional path(s). Use OR for multiple, e.g., site.com/path OR example.org',
                modal_tooltip_language: 'Format: lang_xx or lang_xx-XX, separate multiple with |', modal_tooltip_country: 'Format: countryXX (XX = uppercase country code)', modal_tooltip_time: 'Format: h, d, w, m, y, optionally followed by numbers',
                modal_tooltip_filetype: 'File extension(s). Use OR for multiple, e.g., pdf OR docx',
                modal_button_add_title: 'Add', modal_button_update_title: 'Update Item', modal_button_cancel_edit_title: 'Cancel Edit', modal_button_edit_title: 'Edit', modal_button_delete_title: 'Delete', modal_button_remove_from_list_title: 'Remove from list', modal_button_complete: 'Done', value_empty: '(empty)', date_range_from: 'From:', date_range_to: 'To:', sidebar_collapse_title: 'Collapse', sidebar_expand_title: 'Expand', sidebar_drag_title: 'Drag', sidebar_settings_title: 'Settings',
                alert_invalid_start_date: 'Invalid start date', alert_invalid_end_date: 'Invalid end date', alert_end_before_start: 'End date cannot be earlier than start date', alert_start_in_future: 'Start date cannot be in the future', alert_end_in_future: 'End date cannot be in the future', alert_select_date: 'Please select a date', alert_error_applying_date: 'Error applying date range', alert_error_applying_filter: 'Error applying filter {type}={value}', alert_error_applying_site_search: 'Error applying site search for {site}', alert_error_clearing_site_search: 'Error clearing site search', alert_error_resetting_filters: 'Error resetting filters', alert_error_toggling_verbatim: 'Error toggling Verbatim search', alert_error_toggling_personalization: 'Error toggling Personalization search', alert_enter_display_name: 'Please enter the display name for {type}.', alert_enter_value: 'Please enter the corresponding value for {type}.', alert_invalid_value_format: 'The value format for {type} is incorrect. {hint}', alert_duplicate_name: 'Custom item display name "{name}" already exists. Please use a different name.', alert_update_failed_invalid_index: 'Update failed: Invalid item index.', alert_edit_failed_missing_fields: 'Cannot edit: Input or button fields not found.',
                alert_no_more_predefined_to_add: 'No more predefined {type} options available to add.',
                alert_no_keywords_for_shortcut: 'No keywords found in current search to use for {service_name}.',
                alert_error_opening_link: 'Error opening link for {service_name}.',
                alert_generic_error: 'An unexpected error occurred. Please check the console or try again. Context: {context}',
                confirm_delete_item: 'Are you sure you want to delete the custom item "{name}"?', confirm_remove_item_from_list: 'Are you sure you want to remove "{name}" from this display list?', confirm_reset_settings: 'Are you sure you want to reset all settings to their default values?', alert_settings_reset_success: 'Settings have been reset to default. You can continue editing or click "Save Settings" to confirm.', confirm_reset_all_menu: 'Are you sure you want to reset all settings to their default values?\nThis cannot be undone and requires a page refresh to take effect.', alert_reset_all_menu_success: 'All settings have been reset to defaults.\nPlease refresh the page to apply the changes.', alert_reset_all_menu_fail: 'Failed to reset settings via menu command! Please check the console.', alert_init_fail: '{scriptName} initialization failed. Some features may not work. Please check the console for technical details.\nTechnical Error: {error}', menu_open_settings: '⚙️ Open Settings', menu_reset_all_settings: '🚨 Reset All Settings',
            },
        };
        let effectiveTranslations = JSON.parse(JSON.stringify(builtInTranslations));
        let _currentLocale = 'en';

        /**
         * Merges external translation data (from the i18n companion script)
         * with the built-in English translations. It also ensures that all languages
         * have a complete set of keys, falling back to English if a key is missing.
         * @private
         */
        function _mergeExternalTranslations() {
            if (typeof window.GSCS_Namespace !== 'undefined' && typeof window.GSCS_Namespace.i18nPack === 'object' && typeof window.GSCS_Namespace.i18nPack.translations === 'object') {
                const externalTranslations = window.GSCS_Namespace.i18nPack.translations;
                for (const langCode in externalTranslations) {
                    if (Object.prototype.hasOwnProperty.call(externalTranslations, langCode)) {
                        if (!effectiveTranslations[langCode]) {
                            effectiveTranslations[langCode] = {};
                        }
                        for (const key in externalTranslations[langCode]) {
                            if (Object.prototype.hasOwnProperty.call(externalTranslations[langCode], key)) {
                                effectiveTranslations[langCode][key] = externalTranslations[langCode][key];
                            }
                        }
                    }
                }
                 // After merging, ensure 'en' from builtInTranslations acts as a fallback for all known languages
                const englishDefaults = builtInTranslations.en;
                for (const langCode in effectiveTranslations) {
                    if (langCode !== 'en' && Object.prototype.hasOwnProperty.call(effectiveTranslations, langCode)) {
                        for (const key in englishDefaults) {
                            if (Object.prototype.hasOwnProperty.call(englishDefaults, key) && typeof effectiveTranslations[langCode][key] === 'undefined') {
                                effectiveTranslations[langCode][key] = englishDefaults[key];
                            }
                        }
                    }
                }

            } else {
                console.warn(`${LOG_PREFIX} [i18n] External i18n pack (window.GSCS_Namespace.i18nPack) not found or invalid. Using built-in translations only.`);
            }
            // Ensure all keys from builtInTranslations.en exist in 'en' to prevent errors
            // if i18n.js is older or missing keys.
            const ensureKeys = (lang, defaults) => {
                if (!effectiveTranslations[lang]) effectiveTranslations[lang] = {};
                for (const key in defaults) {
                    if (!effectiveTranslations[lang][key]) {
                        effectiveTranslations[lang][key] = defaults[key]; // Fallback to built-in English if key is missing in target lang
                    }
                }
            };
            ensureKeys('en', builtInTranslations.en); // Ensure English is complete based on built-in
        }

        /**
         * Detects the user's preferred language from the browser settings.
         * It attempts to match specific locales (e.g., "en-US") first, then generic
         * languages (e.g., "en"), and finally falls back to English.
         * @private
         * @returns {string} The detected locale code.
         */
        function _detectBrowserLocale() {
            let locale = 'en'; // Default
            try {
                if (navigator.languages && navigator.languages.length) {
                    locale = navigator.languages[0];
                } else if (navigator.language) {
                    locale = navigator.language;
                }
            } catch (e) {
                console.warn(`${LOG_PREFIX} [i18n] Error accessing navigator.language(s):`, e);
            }

            // Try to match full locale (e.g., "zh-TW")
            if (effectiveTranslations[locale]) return locale;

            // Try to match generic part (e.g., "zh" from "zh-TW")
            if (locale.includes('-')) {
                const parts = locale.split('-');
                if (parts.length > 0 && effectiveTranslations[parts[0]]) return parts[0];
                // Try "language-Script" (e.g., "zh-Hant") if applicable, though less common for userscripts
                if (parts.length > 2 && effectiveTranslations[`${parts[0]}-${parts[1]}`]) return `${parts[0]}-${parts[1]}`;
            }
            return 'en'; // Fallback to English
        }

        /**
         * Updates the active locale based on user settings or browser detection.
         * If the user has selected a specific language, it's used; otherwise, it auto-detects.
         * @private
         * @param {Object} settingsToUse - The current settings object to read the interfaceLanguage from.
         */
        function _updateActiveLocale(settingsToUse) {
            let newLocale = 'en'; // Default
            const langSettingSource = (settingsToUse && Object.keys(settingsToUse).length > 0 && typeof settingsToUse.interfaceLanguage === 'string')
                ? settingsToUse
                : defaultSettings; // Fallback to defaultSettings if settingsToUse is empty/invalid

            const userSelectedLang = langSettingSource.interfaceLanguage;

            if (userSelectedLang && userSelectedLang !== 'auto') {
                if (effectiveTranslations[userSelectedLang]) {
                    newLocale = userSelectedLang;
                } else if (userSelectedLang.includes('-')) {
                    const genericLang = userSelectedLang.split('-')[0];
                    if (effectiveTranslations[genericLang]) {
                        newLocale = genericLang;
                    } else {
                        newLocale = _detectBrowserLocale(); // Fallback to browser if specific parts aren't found
                    }
                } else {
                    newLocale = _detectBrowserLocale(); // Fallback if selected lang doesn't exist
                }
            } else { // 'auto' or undefined
                newLocale = _detectBrowserLocale();
            }

            if (_currentLocale !== newLocale) {
                _currentLocale = newLocale;
            }
             // Warn if the chosen language isn't exactly what was set (e.g. "fr-CA" setting becomes "fr" due to availability)
            if (userSelectedLang && userSelectedLang !== 'auto' && _currentLocale !== userSelectedLang && !userSelectedLang.startsWith(_currentLocale.split('-')[0])) {
                console.warn(`${LOG_PREFIX} [i18n] User selected language "${userSelectedLang}" was not fully available or matched. Using best match: "${_currentLocale}".`);
            }
        }

        _mergeExternalTranslations(); // Merge external translations once at service creation

        /**
         * Retrieves a translated string for a given key.
         * It searches in the current locale, then the generic part of the locale, and finally
         * falls back to English if the key is not found.
         * @param {string} key - The translation key (e.g., 'settingsTitle').
         * @param {Object} [replacements={}] - An object of placeholders to replace in the string (e.g., {siteUrl: 'example.com'}).
         * @returns {string} The translated (and formatted) string.
         */
        function getString(key, replacements = {}) {
            let str = `[ERR: ${key} @ ${_currentLocale}]`; // Default error string
            let found = false;

            // 1. Try current locale
            if (effectiveTranslations[_currentLocale] && typeof effectiveTranslations[_currentLocale][key] !== 'undefined') {
                str = effectiveTranslations[_currentLocale][key];
                found = true;
            }
            // 2. If current locale has a generic part (e.g., "zh" from "zh-TW"), try that
            else if (_currentLocale.includes('-')) {
                const genericLang = _currentLocale.split('-')[0];
                if (effectiveTranslations[genericLang] && typeof effectiveTranslations[genericLang][key] !== 'undefined') {
                    str = effectiveTranslations[genericLang][key];
                    found = true;
                }
            }

            // 3. If not found and current locale is not English, fallback to English
            if (!found && _currentLocale !== 'en') {
                if (effectiveTranslations['en'] && typeof effectiveTranslations['en'][key] !== 'undefined') {
                    str = effectiveTranslations['en'][key];
                    found = true;
                }
            }

            // 4. If still not found (even in English), it's a critical miss
            if (!found) {
                if (!(effectiveTranslations['en'] && typeof effectiveTranslations['en'][key] !== 'undefined')) {
                    console.error(`${LOG_PREFIX} [i18n] CRITICAL: Missing translation for key: "${key}" in BOTH locale: "${_currentLocale}" AND default locale "en".`);
                } else {
                    // This case should ideally not be hit if English is complete in builtInTranslations
                    str = effectiveTranslations['en'][key]; // Should have been caught by step 3 if _currentLocale wasn't 'en'
                    found = true;
                }
                if(!found) str = `[ERR_NF: ${key}]`; // Final error if truly not found anywhere
            }

            // Replace placeholders
            if (typeof str === 'string') {
                for (const placeholder in replacements) {
                    if (Object.prototype.hasOwnProperty.call(replacements, placeholder)) {
                        str = str.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
                    }
                }
            } else {
                 console.error(`${LOG_PREFIX} [i18n] CRITICAL: Translation for key "${key}" is not a string:`, str);
                 return `[INVALID_TYPE_FOR_KEY: ${key}]`;
            }
            return str;
        }

        return {
            getString: getString,
            getCurrentLocale: function() { return _currentLocale; },
            getTranslationsForLocale: function(locale = 'en') { return effectiveTranslations[locale] || effectiveTranslations['en']; },
            initializeBaseLocale: function() { _updateActiveLocale(defaultSettings); },
            updateActiveLocale: function(activeSettings) { _updateActiveLocale(activeSettings); },
            getAvailableLocales: function() {
                const locales = new Set(['auto', 'en']); // 'auto' and 'en' are always options
                Object.keys(effectiveTranslations).forEach(lang => {
                    // Only add if it's a valid language pack (not just an empty object)
                    if (Object.keys(effectiveTranslations[lang]).length > 0) {
                        locales.add(lang);
                    }
                });
                return Array.from(locales).sort((a, b) => {
                    if (a === 'auto') return -1;
                    if (b === 'auto') return 1;
                    if (a === 'en' && b !== 'auto') return -1;
                    if (b === 'en' && a !== 'auto') return 1;

                    let nameA = a, nameB = b;
                    try { nameA = new Intl.DisplayNames([a],{type:'language'}).of(a); } catch(e){}
                    try { nameB = new Intl.DisplayNames([b],{type:'language'}).of(b); } catch(e){}
                    return nameA.localeCompare(nameB);
                });
            }
        };
    })();

    // A convenient shorthand for accessing the localization service's getString method.
    const _ = LocalizationService.getString;

    /**
     * @module Utils
     * A collection of general-purpose utility functions used throughout the script.
     * These functions are stateless and perform common tasks like debouncing,
     * deep object merging, and number clamping.
     */
    const Utils = {
        /**
         * Creates a debounced function that delays invoking `func` until after `wait`
         * milliseconds have elapsed since the last time the debounced function was invoked.
         * @param {Function} func - The function to debounce.
         * @param {number} wait - The number of milliseconds to delay.
         * @returns {Function} Returns the new debounced function.
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const context = this;
                const later = () => {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
		
        /**
         * Recursively merges properties of one or more source objects into a target object.
         * If a key exists in both the target and source, and both values are objects,
         * it will recursively merge them. Otherwise, the value from the source will overwrite the target.
         * @param {Object} target - The object to merge properties into.
         * @param {Object} source - The object to merge properties from.
         * @returns {Object} The modified target object.
         */
        mergeDeep: function(target, source) {
            if (!source) return target; // If source is undefined or null, return target as is.
            target = target || {}; // Ensure target is an object if it's initially null/undefined.

            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    const targetValue = target[key];
                    const sourceValue = source[key];

                    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                        // Recurse for nested objects
                        target[key] = Utils.mergeDeep(targetValue, sourceValue);
                    } else if (typeof sourceValue !== 'undefined') {
                        // Assign if sourceValue is a primitive, array, or explicitly undefined
                        target[key] = sourceValue;
                    }
                    // If sourceValue is undefined, target[key] remains unchanged (implicit else)
                }
            }
            return target;
        },

        /**
         * Clamps a number within the inclusive lower and upper bounds.
         * @param {number} num - The number to clamp.
         * @param {number} min - The lower bound.
         * @param {number} max - The upper bound.
         * @returns {number} The clamped number.
         */
        clamp: function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },

        /**
         * Parses a string that may contain an emoji or symbol at the beginning.
         * This is primarily used for country/region names that include a flag.
         * @param {string} fullText - The text to parse.
         * @returns {{icon: string, text: string}} An object with the extracted icon and the remaining text.
         */
        parseIconAndText: function(fullText) {
            // Regex to match one or more non-letter, non-number characters at the beginning, followed by optional whitespace
            const match = fullText.match(/^(\P{L}\P{N}\s*)+/u);
            let icon = '';
            let text = fullText;

            if (match && match[0].trim() !== '') {
                icon = match[0].trim(); // Trim to remove trailing spaces from the icon part
                text = fullText.substring(icon.length).trim(); // Trim to remove leading spaces from the text part
            }
            return { icon, text };
        },

        /**
         * Safely gets the current window's URL as a URL object.
         * @returns {URL|null} A URL object, or null if an error occurs.
         */
        getCurrentURL: function() {
            try {
                return new URL(window.location.href);
            } catch (e) {
                console.error(`${LOG_PREFIX} Error creating URL object:`, e);
                return null;
            }
        },

        /**
         * Parses a string containing values separated by " OR " into an array.
         * The separator is case-insensitive and handles multiple spaces.
         * @param {string} valueString - The string to parse (e.g., "pdf OR docx").
         * @returns {string[]} An array of the parsed values.
         */
        parseCombinedValue: function(valueString) {
            if (typeof valueString !== 'string' || !valueString.trim()) {
                return [];
            }
            // Split by " OR " (case-insensitive, with spaces around OR)
            return valueString.split(/\s+OR\s+/i).map(s => s.trim()).filter(s => s.length > 0);
        },

        /**
         * Cleans a specific operator (like 'site' or 'filetype') from the query string.
         * @param {string} query - The original query string.
         * @param {string} operator - The operator name to clean (e.g., 'site').
         * @returns {string} The cleaned query string.
         */
        _cleanQueryByOperator: function(query, operator) {
            if (!query || !operator) return '';
            // Create a dynamic regex to match only the specified operator
            const singleOperatorRegexComplex = new RegExp(`\\s*(?:\\(\\s*)?(?:(?:${operator}):[\\w.:\\/~%?#=&+-]+(?:\\s+OR\\s+|$))+[^)]*\\)?\\s*`, 'gi');
            const singleOperatorRegexSimple = new RegExp(`\\s*${operator}:[\\w.:\\/~%?#=&+-]+\\s*`, 'gi');
            
            let cleanedQuery = query.replace(singleOperatorRegexComplex, ' ');
            cleanedQuery = cleanedQuery.replace(singleOperatorRegexSimple, ' ');
            
            return cleanedQuery.replace(/\s\s+/g, ' ').trim();
        }
    };
	
    /**
     * @module NotificationManager
     * Handles the display of temporary, non-blocking notifications to the user.
     * It creates a dedicated container in the DOM and manages the lifecycle of
     * notification elements, including timed fade-outs.
     */
    const NotificationManager = (function() {
        let container = null;

        /**
         * Initializes the notification container, creating and appending it to the DOM if it doesn't exist.
         */
        function init() {
            if (document.getElementById(IDS.NOTIFICATION_CONTAINER)) {
                container = document.getElementById(IDS.NOTIFICATION_CONTAINER);
                return;
            }
            container = document.createElement('div');
            container.id = IDS.NOTIFICATION_CONTAINER;
            if (document.body) {
                document.body.appendChild(container);
            } else {
                // This case should be rare as script runs at document-idle
                console.error(LOG_PREFIX + " NotificationManager.init(): document.body is not available!");
                container = null; // Ensure container is null if append fails
            }
        }

        /**
         * Displays a notification message.
         * @param {string} messageKey - The localization key for the message.
         * @param {Object} [messageArgs={}] - Placeholders to replace in the message string.
         * @param {('info'|'success'|'warning'|'error')} [type='info'] - The type of notification, affecting its appearance.
         * @param {number} [duration=3000] - The duration in milliseconds before the notification fades out. A duration <= 0 creates a persistent notification.
         * @returns {HTMLElement|null} The created notification element, or null if the container is not available.
         */
        function show(messageKey, messageArgs = {}, type = 'info', duration = 3000) {
            if (!container) {
                // Fallback to alert if container isn't initialized
                const alertMsg = (typeof _ === 'function' && _(messageKey, messageArgs) && !(_(messageKey, messageArgs).startsWith('[ERR:')))
                    ? _(messageKey, messageArgs)
                    : `${messageKey} (args: ${JSON.stringify(messageArgs)})`; // Basic fallback if _ is not ready
                alert(alertMsg);
                return null;
            }

            const notificationElement = document.createElement('div');
            notificationElement.classList.add(CSS.NOTIFICATION);

            const typeClass = CSS[`NTF_${type.toUpperCase()}`] || CSS.NTF_INFO; // Fallback to info type
            notificationElement.classList.add(typeClass);

            notificationElement.textContent = _(messageKey, messageArgs);

            if (duration <= 0) { // Persistent notification, add a close button
                const closeButton = document.createElement('span');
                closeButton.innerHTML = '×'; // Simple 'x'
                closeButton.style.cursor = 'pointer';
                closeButton.style.marginLeft = '10px';
                closeButton.style.float = 'right'; // Position to the right
                closeButton.onclick = () => notificationElement.remove();
                notificationElement.appendChild(closeButton);
            }

            container.appendChild(notificationElement);

            if (duration > 0) {
                setTimeout(() => {
                    notificationElement.style.opacity = '0'; // Start fade out
                    setTimeout(() => notificationElement.remove(), 500); // Remove after fade out
                }, duration);
            }
            return notificationElement; // Return the element for potential further manipulation
        }

        return { init: init, show: show };
    })();

    /**
     * Creates a generic list item element for use in management modals.
     * This function handles the creation of the item's text, drag handle, and control buttons (edit/delete).
     * @param {number} index - The index of the item in its source array.
     * @param {Object} item - The data object for the list item.
     * @param {string} listId - The ID of the parent list element.
     * @param {Object} mapping - The configuration mapping object for this list type from `getListMapping`.
     * @returns {HTMLLIElement} The fully constructed list item element.
     */
    function createGenericListItem(index, item, listId, mapping) {
        const listItem = document.createElement('li');
        listItem.dataset[DATA_ATTR.INDEX] = index;
        listItem.dataset[DATA_ATTR.LIST_ID] = listId;
        listItem.dataset[DATA_ATTR.ITEM_ID] = item.id || item.value || item.url; // Unique ID for the item itself
        listItem.draggable = true; // All modal list items are draggable

        const dragIconSpan = document.createElement('span');
        dragIconSpan.classList.add(CSS.DRAG_ICON);
        dragIconSpan.innerHTML = SVG_ICONS.dragGrip;
        listItem.appendChild(dragIconSpan);

        const textSpan = document.createElement('span');

        // Favicon logic for Site Search list in the modal
        const currentSettings = SettingsManager.getCurrentSettings();
        if (listId === IDS.SITES_LIST && currentSettings.showFaviconsForSiteSearch && item.url && !item.url.includes(' OR ')) {
            const favicon = document.createElement('img');
            favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${item.url}`;
            favicon.classList.add(CSS.FAVICON);
            favicon.loading = 'lazy';
            textSpan.prepend(favicon);
        }

        let displayText = item.text;
        let paramName = ''; // To show "param=value"

        if (item.type === 'predefined' && item.originalKey) {
            displayText = _(item.originalKey);
            if (listId === IDS.COUNTRIES_LIST) { // Special handling for country icon+text
                const parsed = Utils.parseIconAndText(displayText);
                displayText = `${parsed.icon} ${parsed.text}`.trim();
            }
        }

        // Determine param name for display
        if (mapping) { // Mapping comes from getListMapping
            if (listId === IDS.LANG_LIST) paramName = ALL_SECTION_DEFINITIONS.find(s => s.id === 'sidebar-section-language').param;
            else if (listId === IDS.COUNTRIES_LIST) paramName = ALL_SECTION_DEFINITIONS.find(s => s.id === 'sidebar-section-country').param;
            else if (listId === IDS.SITES_LIST) paramName = 'site'; // Site search uses `site:` in query
            else if (listId === IDS.TIME_LIST) paramName = ALL_SECTION_DEFINITIONS.find(s => s.id === 'sidebar-section-time').param;
            else if (listId === IDS.FT_LIST) {
                const ftSection = ALL_SECTION_DEFINITIONS.find(s => s.id === 'sidebar-section-filetype');
                if (ftSection) paramName = ftSection.param;
            }
        }

        const valueForDisplay = item.value || item.url || _('value_empty');
        const fullTextContent = `${displayText} (${paramName}=${valueForDisplay})`;
        textSpan.appendChild(document.createTextNode(fullTextContent));
        textSpan.title = fullTextContent;
        listItem.appendChild(textSpan);

        const controlsSpan = document.createElement('span');
        controlsSpan.classList.add(CSS.CUSTOM_LIST_ITEM_CONTROLS);

        // Determine if item is "custom" or "predefined" for button display
        if (item.type === 'custom' || listId === IDS.SITES_LIST || listId === IDS.TIME_LIST || listId === IDS.FT_LIST) {
            // Sites, Time, Filetype lists are always treated as "custom" in terms of editability
            controlsSpan.innerHTML =
                `<button class="${CSS.BUTTON_EDIT_ITEM}" title="${_('modal_button_edit_title')}">${SVG_ICONS.edit}</button> ` +
                `<button class="${CSS.BUTTON_DELETE_ITEM}" title="${_('modal_button_delete_title')}">${SVG_ICONS.delete}</button>`;
            listItem.dataset[DATA_ATTR.ITEM_TYPE] = 'custom';
        } else if (item.type === 'predefined') {
            // Languages, Countries in mixed mode can have predefined items that can be removed (not deleted from source)
            controlsSpan.innerHTML =
                `<button class="${CSS.BUTTON_REMOVE_FROM_LIST}" title="${_('modal_button_remove_from_list_title')}">${SVG_ICONS.removeFromList}</button>`;
            listItem.dataset[DATA_ATTR.ITEM_TYPE] = 'predefined';
        }
        listItem.appendChild(controlsSpan);
        return listItem;
    }

    /**
     * Populates a list element within a modal with items.
     * @param {string} listId - The ID of the <ul> element to populate.
     * @param {Array<Object>} items - An array of item data objects to render.
     * @param {Document|HTMLElement} [contextElement=document] - The context in which to find the list element.
     */
    function populateListInModal(listId, items, contextElement = document) {
        const listElement = contextElement.querySelector(`#${listId}`);
        if (!listElement) {
            console.warn(`${LOG_PREFIX} List element not found: #${listId} in context`, contextElement);
            return;
        }
        listElement.innerHTML = ''; // Clear existing items
        const fragment = document.createDocumentFragment();
        const mapping = getListMapping(listId); // Get mapping for param name display

        if (!Array.isArray(items)) items = []; // Ensure items is an array

        items.forEach((item, index) => {
            fragment.appendChild(createGenericListItem(index, item, listId, mapping));
        });
        listElement.appendChild(fragment);
    }

    /**
     * Retrieves the configuration object for a specific custom list type.
     * This centralized mapping provides all necessary information for managing a list,
     * such as the keys for accessing settings, DOM element selectors, and localization keys.
     * @param {string} listId - The ID of the list to get the mapping for.
     * @returns {Object|null} The configuration object, or null if not found.
     */
    function getListMapping(listId) {
        const listMappings = {
            [IDS.SITES_LIST]:     { itemsArrayKey: 'favoriteSites',           customItemsMasterKey: null,                 valueKey: 'url',   populateFn: populateListInModal, textInput: `#${IDS.NEW_SITE_NAME}`,    valueInput: `#${IDS.NEW_SITE_URL}`,    addButton: `#${IDS.ADD_SITE_BTN}`,    nameKey: 'section_site_search', isSortableMixed: false, predefinedSourceKey: null },
            [IDS.LANG_LIST]:      { itemsArrayKey: 'displayLanguages',        customItemsMasterKey: 'customLanguages',    valueKey: 'value', populateFn: populateListInModal, textInput: `#${IDS.NEW_LANG_TEXT}`,    valueInput: `#${IDS.NEW_LANG_VALUE}`,    addButton: `#${IDS.ADD_LANG_BTN}`,    nameKey: 'section_language',    isSortableMixed: true,  predefinedSourceKey: 'language' },
            [IDS.COUNTRIES_LIST]: { itemsArrayKey: 'displayCountries',      customItemsMasterKey: 'customCountries',  valueKey: 'value', populateFn: populateListInModal, textInput: `#${IDS.NEW_COUNTRY_TEXT}`, valueInput: `#${IDS.NEW_COUNTRY_VALUE}`, addButton: `#${IDS.ADD_COUNTRY_BTN}`, nameKey: 'section_country',   isSortableMixed: true,  predefinedSourceKey: 'country' },
            [IDS.TIME_LIST]:      { itemsArrayKey: 'customTimeRanges',        customItemsMasterKey: null,                 valueKey: 'value', populateFn: populateListInModal, textInput: `#${IDS.NEW_TIME_TEXT}`,    valueInput: `#${IDS.NEW_TIME_VALUE}`,    addButton: `#${IDS.ADD_TIME_BTN}`,    nameKey: 'section_time',        isSortableMixed: false, predefinedSourceKey: 'time' }, // predefinedSourceKey for enabling checkbox list
            [IDS.FT_LIST]:        { itemsArrayKey: 'customFiletypes',         customItemsMasterKey: null,                 valueKey: 'value', populateFn: populateListInModal, textInput: `#${IDS.NEW_FT_TEXT}`,      valueInput: `#${IDS.NEW_FT_VALUE}`,      addButton: `#${IDS.ADD_FT_BTN}`,      nameKey: 'section_filetype',    isSortableMixed: false, predefinedSourceKey: 'filetype' },// predefinedSourceKey for enabling checkbox list
        };
        return listMappings[listId] || null;
    }

    /**
     * Validates the format of a user-provided value in a custom item input field.
     * It uses regular expressions to check against expected formats for different types
     * (e.g., language codes, domains, filetypes). It also provides visual feedback on the input element.
     * @param {HTMLInputElement} inputElement - The input element to validate.
     * @returns {boolean} True if the input is valid or empty, false otherwise.
     */
    function validateCustomInput(inputElement) {
        if (!inputElement) return false; // Should not happen if called correctly
        const value = inputElement.value.trim();
        const id = inputElement.id;
        let isValid = false;
        let isEmpty = value === '';

        // Basic validation: name/text fields cannot be empty
        if (id === IDS.NEW_SITE_NAME || id === IDS.NEW_LANG_TEXT || id === IDS.NEW_TIME_TEXT || id === IDS.NEW_FT_TEXT || id === IDS.NEW_COUNTRY_TEXT) {
            isValid = !isEmpty;
        } else if (id === IDS.NEW_SITE_URL) {
            // Allow domains with paths, or TLD/SLD
            const singleSiteRegex = /^(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})(?:\/[a-zA-Z0-9_.\-~%!$&()*+,;=:@/]+)*\/?)$|(?:^\.(?:[a-zA-Z0-9-]{1,63}\.)*[a-zA-Z]{2,63}$)/;
            const parts = Utils.parseCombinedValue(value); // Handles " OR " separation
            if (isEmpty) isValid = true;
            else if (parts.length > 0) isValid = parts.every(part => singleSiteRegex.test(part));
            else isValid = false;
        } else if (id === IDS.NEW_LANG_VALUE) {
            // Language code format: lang_xx or lang_xx-XX, multiple with |
            isValid = isEmpty || /^lang_[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,4})?(?:\|lang_[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,4})?)*$/.test(value);
        } else if (id === IDS.NEW_TIME_VALUE) {
            // Time value format: h, d, w, m, y, optionally followed by numbers
            isValid = isEmpty || /^[hdwmy]\d*$/.test(value);
        } else if (id === IDS.NEW_FT_VALUE) {
            // Filetype format: extension, multiple with " OR "
            const singleFiletypeRegex = /^[a-zA-Z0-9]+$/;
            const parts = Utils.parseCombinedValue(value);
            if (isEmpty) isValid = true;
            else if (parts.length > 0) isValid = parts.every(part => singleFiletypeRegex.test(part));
            else isValid = false;
        } else if (id === IDS.NEW_COUNTRY_VALUE) {
            // Country code format: countryXX (XX = uppercase country code)
            isValid = isEmpty || /^country[A-Z]{2}$/.test(value);
        }

        // Visual feedback
        inputElement.classList.remove('input-valid', 'input-invalid', CSS.HAS_ERROR); // Clear previous states
        _clearInputError(inputElement); // Clear any existing error message for this input

        if (!isEmpty) { // Only add validation classes if not empty
            inputElement.classList.add(isValid ? 'input-valid' : 'input-invalid');
            if (!isValid) inputElement.classList.add(CSS.HAS_ERROR); // Red border for error
        }

        return isValid || isEmpty; // Return true if format is valid OR if it's empty (emptiness check is separate)
    }

    /**
     * Finds the dedicated error message element associated with a specific input field.
     * @private
     * @param {HTMLInputElement} inputElement - The input field.
     * @returns {HTMLElement|null} The error message element, or null if not found.
     */
    function _getInputErrorElement(inputElement) {
        if (!inputElement || !inputElement.id) return null;
        // Try to find the specific error message span for this input
        let errorEl = inputElement.nextElementSibling;
        if (errorEl && errorEl.classList.contains(CSS.INPUT_ERROR_MSG) && errorEl.id === `${inputElement.id}-error-msg`) {
            return errorEl;
        }
        // Fallback: search within parent div if structured that way
        const parentDiv = inputElement.parentElement;
        if (parentDiv) {
            return parentDiv.querySelector(`#${inputElement.id}-error-msg`);
        }
        return null;
    }

    /**
     * Displays a validation error message for a specific input field.
     * @private
     * @param {HTMLInputElement} inputElement - The input field to show the error for.
     * @param {string} messageKey - The localization key for the error message.
     * @param {Object} [messageArgs={}] - Placeholders for the error message.
     */
    function _showInputError(inputElement, messageKey, messageArgs = {}) {
        if (!inputElement) return;
        const errorElement = _getInputErrorElement(inputElement);
        if (errorElement) {
            errorElement.textContent = _(messageKey, messageArgs);
            errorElement.classList.add(CSS.IS_ERROR_VISIBLE);
        }
        inputElement.classList.add(CSS.HAS_ERROR);
        inputElement.classList.remove('input-valid'); // Remove valid class if error
    }

    /**
     * Clears any validation error message and styling from an input field.
     * @private
     * @param {HTMLInputElement} inputElement - The input field to clear the error from.
     */
    function _clearInputError(inputElement) {
        if (!inputElement) return;
        const errorElement = _getInputErrorElement(inputElement);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove(CSS.IS_ERROR_VISIBLE);
        }
        inputElement.classList.remove(CSS.HAS_ERROR, 'input-invalid');
    }

    /**
     * Clears all validation errors within a specific input group container.
     * @private
     * @param {HTMLElement} inputGroupElement - The container element for the input group.
     */
    function _clearAllInputErrorsInGroup(inputGroupElement) {
        if (!inputGroupElement) return;
        inputGroupElement.querySelectorAll(`input[type="text"]`).forEach(input => {
            _clearInputError(input);
            input.classList.remove('input-valid', 'input-invalid'); // Also clear validation classes
        });
    }

    /**
     * Shows a global message, typically in a message bar within the settings window.
     * Can also fall back to the NotificationManager or a standard alert if the target element isn't found.
     * @private
     * @param {string} messageKey - The localization key for the message.
     * @param {Object} [messageArgs={}] - Placeholders for the message string.
     * @param {('info'|'success'|'warning'|'error')} [type='info'] - The type of message.
     * @param {number} [duration=3000] - Duration in ms. A value <= 0 makes it persistent until cleared.
     * @param {string} [targetElementId=IDS.SETTINGS_MESSAGE_BAR] - The ID of the message bar element.
     */
    function _showGlobalMessage(messageKey, messageArgs = {}, type = 'info', duration = 3000, targetElementId = IDS.SETTINGS_MESSAGE_BAR) {
        const messageBar = document.getElementById(targetElementId);
        if (!messageBar) {
            // If specific target (like modal message bar) not found, try general notification or alert
            if (targetElementId !== IDS.SETTINGS_MESSAGE_BAR && NotificationManager && typeof NotificationManager.show === 'function') {
                NotificationManager.show(messageKey, messageArgs, type, duration > 0 ? duration : 5000); // Longer for notifications if persistent
            } else {
                 const alertMsg = (typeof _ === 'function' && _(messageKey, messageArgs) && !(_(messageKey, messageArgs).startsWith('[ERR:')))
                    ? _(messageKey, messageArgs)
                    : `${messageKey} (args: ${JSON.stringify(messageArgs)})`;
                alert(alertMsg);
            }
            return;
        }

        if (globalMessageTimeout && targetElementId === IDS.SETTINGS_MESSAGE_BAR) { // Clear previous timeout for main settings bar
            clearTimeout(globalMessageTimeout);
            globalMessageTimeout = null;
        }

        messageBar.textContent = _(messageKey, messageArgs);
        messageBar.className = `${CSS.MESSAGE_BAR}`; // Reset classes
        messageBar.classList.add(CSS[`MSG_${type.toUpperCase()}`] || CSS.MSG_INFO); // Add type-specific class
        messageBar.style.display = 'block';

        if (duration > 0 && targetElementId === IDS.SETTINGS_MESSAGE_BAR) {
            globalMessageTimeout = setTimeout(() => {
                messageBar.style.display = 'none';
                messageBar.textContent = '';
                messageBar.className = CSS.MESSAGE_BAR; // Reset classes
            }, duration);
        }
    }
	
    /**
     * Validates input fields for a new or edited custom item and prepares the data object.
     * @private
     * @param {HTMLInputElement} textInput - The input for the item's display text.
     * @param {HTMLInputElement} valueInput - The input for the item's value.
     * @param {string} itemTypeName - The localized name of the item type (e.g., "Language") for error messages.
     * @param {string} listId - The ID of the list the item belongs to.
     * @returns {{isValid: boolean, text?: string, value?: string, errorField?: HTMLInputElement}} An object indicating validity and containing data or the field with an error.
     */
    function _validateAndPrepareCustomItemData(textInput, valueInput, itemTypeName, listId) {
        if (!textInput || !valueInput) {
            _showGlobalMessage('alert_edit_failed_missing_fields', {}, 'error', 0); // Persistent error
            return { isValid: false };
        }
        _clearInputError(textInput);
        _clearInputError(valueInput);

        const text = textInput.value.trim();
        const value = valueInput.value.trim();
        let hint = '';

        if (text === '') {
            _showInputError(textInput, 'alert_enter_display_name', { type: itemTypeName });
            textInput.focus();
            return { isValid: false, errorField: textInput };
        } else {
             // If text is not empty, ensure no lingering error style
            textInput.classList.remove(CSS.HAS_ERROR);
        }


        if (value === '') {
            _showInputError(valueInput, 'alert_enter_value', { type: itemTypeName });
            valueInput.focus();
            return { isValid: false, errorField: valueInput };
        } else {
            const isValueFormatValid = validateCustomInput(valueInput); // This also handles visual feedback
            if (!isValueFormatValid) {
                 if (valueInput.classList.contains('input-invalid')) {
                     valueInput.focus();
                     return { isValid: false, errorField: valueInput };
                 }
                if (listId === IDS.COUNTRIES_LIST) hint = _('modal_tooltip_country');
                else if (listId === IDS.LANG_LIST) hint = _('modal_tooltip_language');
                else if (listId === IDS.TIME_LIST) hint = _('modal_tooltip_time');
                else if (listId === IDS.FT_LIST) hint = _('modal_tooltip_filetype');
                else if (listId === IDS.SITES_LIST) hint = _('modal_tooltip_domain');

                _showInputError(valueInput, 'alert_invalid_value_format', { type: itemTypeName, hint: hint });
                valueInput.focus();
                return { isValid: false, errorField: valueInput };
            }
        }
        return { isValid: true, text: text, value: value };
    }

    /**
     * Checks if a custom item with the same display name already exists in a list.
     * The check is case-insensitive.
     * @private
     * @param {string} text - The display text to check for duplicates.
     * @param {Array<Object>} itemsToCheck - The array of items to check against.
     * @param {string} listId - The ID of the list being checked.
     * @param {number} editingIndex - The index of the item being edited, to exclude it from the check.
     * @param {Object|null} editingItemInfoRef - Reference to the object holding information about the item currently being edited.
     * @returns {boolean} True if a duplicate is found, false otherwise.
     */
    function _isDuplicateCustomItem(text, itemsToCheck, listId, editingIndex, editingItemInfoRef) {
        const lowerText = text.toLowerCase();
        return itemsToCheck.some((item, idx) => {
            const itemIsCustom = item.type === 'custom' ||
                                 listId === IDS.SITES_LIST ||
                                 listId === IDS.TIME_LIST ||
                                 listId === IDS.FT_LIST;
            if (!itemIsCustom) return false;

            if (editingItemInfoRef && editingItemInfoRef.listId === listId && editingIndex === idx) {
                if (editingItemInfoRef.originalText?.toLowerCase() === lowerText) {
                    return false;
                }
            }
            return item.text.toLowerCase() === lowerText;
        });
    }
	
    /**
     * Applies the appropriate theme classes to a given DOM element based on the current theme setting.
     * It handles standard themes (light, dark, system) and minimal themes.
     * @param {HTMLElement} element - The DOM element to apply the theme to.
     * @param {string} themeSetting - The current theme setting (e.g., 'system', 'dark', 'minimal-light').
     */
    function applyThemeToElement(element, themeSetting) {
        if (!element) return;
        // Remove all potential theme classes first
        element.classList.remove(
            CSS.THEME_LIGHT, CSS.THEME_DARK,
            CSS.THEME_MINIMAL, CSS.THEME_MINIMAL_LIGHT, CSS.THEME_MINIMAL_DARK
        );

        let effectiveTheme = themeSetting;
        const isSettingsOrModal = element.id === IDS.SETTINGS_WINDOW ||
                                  element.id === IDS.SETTINGS_OVERLAY ||
                                  element.classList.contains('settings-modal-content') ||
                                  element.classList.contains('settings-modal-overlay');

        if (isSettingsOrModal) {
            if (themeSetting === 'minimal-light') effectiveTheme = 'light';
            else if (themeSetting === 'minimal-dark') effectiveTheme = 'dark';
        }

        switch (effectiveTheme) {
            case 'dark':
                element.classList.add(CSS.THEME_DARK);
                break;
            case 'minimal-light':
                element.classList.add(CSS.THEME_MINIMAL, CSS.THEME_MINIMAL_LIGHT);
                break;
            case 'minimal-dark':
                element.classList.add(CSS.THEME_MINIMAL, CSS.THEME_MINIMAL_DARK);
                break;
            case 'system':
                const systemIsDark = systemThemeMediaQuery && systemThemeMediaQuery.matches;
                element.classList.add(systemIsDark ? CSS.THEME_DARK : CSS.THEME_LIGHT);
                break;
            case 'light':
            default:
                element.classList.add(CSS.THEME_LIGHT);
                break;
        }
    }

    /**
     * @module PredefinedOptionChooser
     * A UI component that appears within a modal, allowing users to select and add
     * predefined options (like languages or countries) to a sortable display list.
     */
    const PredefinedOptionChooser = (function() {
        let _chooserContainer = null;
        let _currentListId = null;
        let _currentPredefinedSourceKey = null;
        let _currentDisplayItemsArrayRef = null; // Reference to the array like settings.displayLanguages
        let _currentModalContentContext = null; // The modal body where this chooser is shown
        let _onAddCallback = null;

        /**
         * Builds the HTML for the predefined option chooser modal.
         * @param {string} listId - The ID of the list being managed.
         * @param {string} predefinedSourceKey - The key for the predefined options in PREDEFINED_OPTIONS.
         * @param {Array<Object>} displayItemsArrayRef - A reference to the current array of items being displayed.
         * @returns {string|null} The generated HTML string for the chooser, or null if no options are available.
         */
        function _buildChooserHTML(listId, predefinedSourceKey, displayItemsArrayRef) {
            const allPredefinedSystemOptions = PREDEFINED_OPTIONS[predefinedSourceKey] || [];

            const currentDisplayedValues = new Set(
                displayItemsArrayRef.filter(item => item.type === 'predefined').map(item => item.value)
            );

            const availablePredefinedToAdd = allPredefinedSystemOptions.filter(
                opt => !currentDisplayedValues.has(opt.value)
            );

            if (availablePredefinedToAdd.length === 0) {
                const itemTypeName = getListMapping(listId)?.nameKey ? _(getListMapping(listId).nameKey) : predefinedSourceKey;
                _showGlobalMessage('alert_no_more_predefined_to_add', { type: itemTypeName }, 'info', 3000, IDS.SETTINGS_MESSAGE_BAR);
                return null;
            }

            const listItemsHTML = availablePredefinedToAdd.map(opt => {
                let displayText = _(opt.textKey);
                 if (listId === IDS.COUNTRIES_LIST) {
                    const parsed = Utils.parseIconAndText(displayText);
                    displayText = `${parsed.icon} ${parsed.text}`.trim();
                }
                const sanitizedValueForId = opt.value.replace(/[^a-zA-Z0-9-_]/g, '');
                return `
                    <li class="${CSS.MODAL_PREDEFINED_CHOOSER_ITEM}">
                        <input type="checkbox" value="${opt.value}" id="chooser-${sanitizedValueForId}">
                        <label for="chooser-${sanitizedValueForId}">${displayText}</label>
                    </li>`;
            }).join('');

            return `
                <ul id="${IDS.MODAL_PREDEFINED_CHOOSER_LIST}">${listItemsHTML}</ul>
                <div class="chooser-buttons" style="text-align: right; margin-top: 10px;">
                    <button id="${IDS.MODAL_PREDEFINED_CHOOSER_ADD_BTN}" class="${CSS.BUTTON}" style="margin-right: 5px;">${_('modal_button_add_title')}</button>
                    <button id="${IDS.MODAL_PREDEFINED_CHOOSER_CANCEL_BTN}" class="${CSS.BUTTON}">${_('settings_cancel_button')}</button>
                </div>`;
        }

        /**
         * Handles the click event of the "Add" button in the chooser. It gathers selected
         * values and triggers the callback function.
         * @private
         */
        function _handleAdd() {
            if (!_chooserContainer) return;
            const selectedValues = [];
            _chooserContainer.querySelectorAll(`#${IDS.MODAL_PREDEFINED_CHOOSER_LIST} input[type="checkbox"]:checked`).forEach(cb => {
                selectedValues.push(cb.value);
            });

            if (selectedValues.length > 0 && typeof _onAddCallback === 'function') {
                _onAddCallback(selectedValues, _currentPredefinedSourceKey, _currentDisplayItemsArrayRef, _currentListId, _currentModalContentContext);
            }
            hide();
        }

        /**
         * Shows the predefined option chooser UI.
         * @param {string} manageType - The type of item being managed (e.g., 'language').
         * @param {string} listId - The ID of the list to add items to.
         * @param {string} predefinedSourceKey - The key to look up predefined options.
         * @param {Array<Object>} displayItemsArrayRef - A reference to the settings array that will be modified.
         * @param {HTMLElement} contextElement - The parent element where the chooser will be inserted.
         * @param {Function} onAddCb - The callback function to execute when items are added.
         */
        function show(manageType, listId, predefinedSourceKey, displayItemsArrayRef, contextElement, onAddCb) {
            hide();

            _currentListId = listId;
            _currentPredefinedSourceKey = predefinedSourceKey;
            _currentDisplayItemsArrayRef = displayItemsArrayRef;
            _currentModalContentContext = contextElement;
            _onAddCallback = onAddCb;

            const chooserHTML = _buildChooserHTML(listId, predefinedSourceKey, displayItemsArrayRef);
            if (!chooserHTML) return;

            _chooserContainer = document.createElement('div');
            _chooserContainer.id = IDS.MODAL_PREDEFINED_CHOOSER_CONTAINER;
            _chooserContainer.classList.add(CSS.MODAL_PREDEFINED_CHOOSER);
            _chooserContainer.innerHTML = chooserHTML;

            const addNewBtn = contextElement.querySelector(`#${IDS.MODAL_ADD_NEW_OPTION_BTN}`);
            if (addNewBtn && addNewBtn.parentNode) {
                addNewBtn.insertAdjacentElement('afterend', _chooserContainer);
            } else {
                const mainListElement = contextElement.querySelector(`#${listId}`);
                mainListElement?.insertAdjacentElement('beforebegin', _chooserContainer);
            }
            _chooserContainer.style.display = 'block';

            _chooserContainer.querySelector(`#${IDS.MODAL_PREDEFINED_CHOOSER_ADD_BTN}`).addEventListener('click', _handleAdd);
            _chooserContainer.querySelector(`#${IDS.MODAL_PREDEFINED_CHOOSER_CANCEL_BTN}`).addEventListener('click', hide);
        }

        /**
         * Hides and cleans up the chooser UI.
         */
        function hide() {
            if (_chooserContainer) {
                _chooserContainer.remove();
                _chooserContainer = null;
            }
            _currentListId = null;
            _currentPredefinedSourceKey = null;
            _currentDisplayItemsArrayRef = null;
            _currentModalContentContext = null;
            _onAddCallback = null;
        }

        return {
            show: show,
            hide: hide,
            isOpen: function() { return !!_chooserContainer; }
        };
    })();

    /**
     * @module ModalManager
     * Manages the creation, display, and interaction logic for all modal dialogs.
     * This module is responsible for the complex UI where users manage their custom
     * lists of sites, languages, etc., including adding, editing, deleting, and reordering items.
     */
    const ModalManager = (function() {
        let _currentModal = null;
        let _currentModalContent = null;
        let _editingItemInfo = null;
        let _draggedListItem = null;

        const modalConfigsData = {
            'site':     { modalTitleKey: 'manageSitesTitle',     listId: IDS.SITES_LIST,     itemsArrayKey: 'favoriteSites',           customItemsMasterKey: null,                 textPKey: 'modal_placeholder_name',   valPKey: 'modal_placeholder_domain', hintKey: 'modal_hint_domain',   fmtKey: 'modal_tooltip_domain',   isSortableMixed: false, predefinedSourceKey: null,       hasPredefinedToggles: false, manageType: 'site' },
            'language': { modalTitleKey: 'manageLanguagesTitle', listId: IDS.LANG_LIST,      itemsArrayKey: 'displayLanguages',        customItemsMasterKey: 'customLanguages',    textPKey: 'modal_placeholder_text',   valPKey: 'modal_placeholder_value',  hintKey: 'modal_hint_language', fmtKey: 'modal_tooltip_language', predefinedSourceKey: 'language', isSortableMixed: true,         hasPredefinedToggles: false, manageType: 'language' },
            'country':  { modalTitleKey: 'manageCountriesTitle', listId: IDS.COUNTRIES_LIST, itemsArrayKey: 'displayCountries',      customItemsMasterKey: 'customCountries',  textPKey: 'modal_placeholder_text',   valPKey: 'modal_placeholder_value',  hintKey: 'modal_hint_country',  fmtKey: 'modal_tooltip_country',  predefinedSourceKey: 'country',  isSortableMixed: true,         hasPredefinedToggles: false, manageType: 'country'  },
            'time':     { modalTitleKey: 'manageTimeRangesTitle',listId: IDS.TIME_LIST,      itemsArrayKey: 'customTimeRanges',        customItemsMasterKey: null,                 textPKey: 'modal_placeholder_text',   valPKey: 'modal_placeholder_value',  hintKey: 'modal_hint_time',     fmtKey: 'modal_tooltip_time',     predefinedSourceKey: 'time',     isSortableMixed: false,        hasPredefinedToggles: true, manageType: 'time' },
            'filetype': { modalTitleKey: 'manageFileTypesTitle', listId: IDS.FT_LIST,        itemsArrayKey: 'customFiletypes',         customItemsMasterKey: null,                 textPKey: 'modal_placeholder_text',   valPKey: 'modal_placeholder_value',  hintKey: 'modal_hint_filetype', fmtKey: 'modal_tooltip_filetype', predefinedSourceKey: 'filetype', isSortableMixed: false,        hasPredefinedToggles: true, manageType: 'filetype' },
        };

        /**
         * Creates the HTML for the section that allows users to enable/disable
         * predefined options (e.g., for time ranges or filetypes).
         * @private
         * @param {string} currentOptionType - The key for the option type in `PREDEFINED_OPTIONS`.
         * @param {string} typeNameKey - The localization key for the name of this option type.
         * @param {Object} predefinedOptionsSource - A reference to the `PREDEFINED_OPTIONS` object.
         * @param {Set<string>} enabledPredefinedValues - A set of the currently enabled predefined values.
         * @returns {string} The generated HTML string.
         */
        function _createPredefinedOptionsSectionHTML(currentOptionType, typeNameKey, predefinedOptionsSource, enabledPredefinedValues) {
            const label = _(typeNameKey);
            const optionsHTML = (predefinedOptionsSource[currentOptionType] || []).map(option => {
                const checkboxId = `predefined-${currentOptionType}-${option.value.replace(/[^a-zA-Z0-9-_]/g, '')}`;
                const translatedOptionText = _(option.textKey);
                const isChecked = enabledPredefinedValues.has(option.value);
                return `
                    <li>
                        <input type="checkbox" id="${checkboxId}" value="${option.value}" data-option-type="${currentOptionType}" ${isChecked ? 'checked' : ''}>
                        <label for="${checkboxId}">${translatedOptionText}</label>
                    </li>`;
            }).join('');

            return `
                <label style="font-weight: bold;">${_('modal_label_enable_predefined', { type: label })}</label>
                <ul class="predefined-options-list" data-option-type="${currentOptionType}">${optionsHTML}</ul>`;
        }
		
        /**
         * Creates the HTML for the list of custom/display items and the input fields
         * for adding/editing them within a modal.
         * @private
         * @param {string} currentListId - The ID for the `<ul>` element.
         * @param {string} textPlaceholderKey - The localization key for the text input's placeholder.
         * @param {string} valuePlaceholderKey - The localization key for the value input's placeholder.
         * @param {string} hintKey - The localization key for the hint text below the inputs.
         * @param {string} formatTooltipKey - The localization key for the value input's tooltip.
         * @param {string} itemTypeName - The localized name of the item type.
         * @param {boolean} [isSortableMixed=false] - True if the list mixes user-custom and predefined items.
         * @returns {string} The generated HTML string.
         */
        function _createModalListAndInputHTML(currentListId, textPlaceholderKey, valuePlaceholderKey, hintKey, formatTooltipKey, itemTypeName, isSortableMixed = false) {
            const mapping = getListMapping(currentListId);
            const typeNameToDisplay = itemTypeName || (mapping ? _(mapping.nameKey) : 'Items');

            let headerHTML = '';
            let addNewOptionButtonHTML = '';

            if (isSortableMixed) {
                headerHTML = `<label style="font-weight: bold; margin-top: 0.5em; display: block;">${_('modal_label_display_options_for', {type: typeNameToDisplay})}</label>`;
                addNewOptionButtonHTML = `
                    <div style="margin-bottom: 0.5em;">
                        <button id="${IDS.MODAL_ADD_NEW_OPTION_BTN}" class="${CSS.MODAL_BUTTON_ADD_NEW} ${CSS.BUTTON}">${_('modal_button_add_new_option')}</button>
                    </div>`;
            } else {
                 headerHTML = `<label style="font-weight: bold; margin-top: 0.5em; display: block;">${_('modal_label_my_custom', { type: typeNameToDisplay })}</label>`;
            }

            const textInputId = mapping ? mapping.textInput.substring(1) : `new-custom-${currentListId}-text`;
            const valueInputId = mapping ? mapping.valueInput.substring(1) : `new-custom-${currentListId}-value`;
            const addButtonId = mapping ? mapping.addButton.substring(1) : `add-custom-${currentListId}-button`;

            const inputGroupHTML = `
                <div class="${CSS.CUSTOM_LIST_INPUT_GROUP}">
                    <div>
                        <input type="text" id="${textInputId}" placeholder="${_(textPlaceholderKey)}">
                        <span id="${textInputId}-error-msg" class="${CSS.INPUT_ERROR_MSG}"></span>
                    </div>
                    <div>
                        <input type="text" id="${valueInputId}" placeholder="${_(valuePlaceholderKey)}" title="${_(formatTooltipKey)}">
                        <span id="${valueInputId}-error-msg" class="${CSS.INPUT_ERROR_MSG}"></span>
                    </div>
                    <button id="${addButtonId}" class="${CSS.BUTTON_ADD_CUSTOM} custom-list-action-button" data-list-id="${currentListId}" title="${_('modal_button_add_title')}">${SVG_ICONS.add}</button>
                    <button class="cancel-edit-button" style="display: none;" title="${_('modal_button_cancel_edit_title')}">${SVG_ICONS.close}</button>
                </div>`;
            const hintHTML = `<span class="${CSS.SETTING_VALUE_HINT}">${_(hintKey)}</span>`;

            return `${addNewOptionButtonHTML}${headerHTML}<ul id="${currentListId}" class="${CSS.CUSTOM_LIST}"></ul>${inputGroupHTML}${hintHTML}`;
        }

        /**
         * Resets the modal's input fields and buttons from an "editing" state back to a "new item" state.
         * @private
         * @param {HTMLElement} [contextElement=_currentModalContent] - The context in which to find the elements.
         */
        function _resetEditStateInternal(contextElement = _currentModalContent) {
            if (_editingItemInfo) {
                const mapping = getListMapping(_editingItemInfo.listId);
                if (_editingItemInfo.addButton) {
                    _editingItemInfo.addButton.innerHTML = SVG_ICONS.add;
                    _editingItemInfo.addButton.title = _('modal_button_add_title');
                    _editingItemInfo.addButton.classList.remove('update-mode');
                }
                if (_editingItemInfo.cancelButton) {
                    _editingItemInfo.cancelButton.style.display = 'none';
                }

                if (mapping && contextElement) {
                    const textInput = contextElement.querySelector(mapping.textInput);
                    const valueInput = contextElement.querySelector(mapping.valueInput);
                    const inputGroup = textInput?.closest(`.${CSS.CUSTOM_LIST_INPUT_GROUP}`);
                    if(inputGroup) _clearAllInputErrorsInGroup(inputGroup);

                    if (textInput) { textInput.value = ''; textInput.classList.remove('input-valid', 'input-invalid', CSS.HAS_ERROR); _clearInputError(textInput); }
                    if (valueInput) { valueInput.value = ''; valueInput.classList.remove('input-valid', 'input-invalid', CSS.HAS_ERROR); _clearInputError(valueInput); }
                }
            }
            _editingItemInfo = null;
        }

        /**
         * Prepares the modal's input fields for editing an existing item by populating them
         * with the item's data and changing the "Add" button to an "Update" button.
         * @private
         * @param {Object} item - The item data object.
         * @param {number} index - The index of the item.
         * @param {string} listId - The ID of the parent list.
         * @param {Object} mapping - The configuration mapping for this list type.
         * @param {HTMLElement} contextElement - The modal's content element.
         */
        function _prepareEditItemActionInternal(item, index, listId, mapping, contextElement) {
            const textInput = contextElement.querySelector(mapping.textInput);
            const valueInput = contextElement.querySelector(mapping.valueInput);
            const addButton = contextElement.querySelector(mapping.addButton);
            const cancelButton = addButton?.parentElement?.querySelector('.cancel-edit-button');

            if (textInput && valueInput && addButton && cancelButton) {
                if (_editingItemInfo && (_editingItemInfo.listId !== listId || _editingItemInfo.index !== index)) {
                    _resetEditStateInternal(contextElement);
                }

                textInput.value = item.text;
                valueInput.value = item[mapping.valueKey] || item.value;

                _editingItemInfo = {
                    listId,
                    index,
                    originalValue: item[mapping.valueKey] || item.value,
                    originalText: item.text,
                    addButton,
                    cancelButton,
                    arrayKey: mapping.itemsArrayKey || mapping.displayArrayKey
                };

                addButton.innerHTML = SVG_ICONS.update;
                addButton.title = _('modal_button_update_title');
                addButton.classList.add('update-mode');
                cancelButton.style.display = 'inline-block';

                validateCustomInput(valueInput);
                validateCustomInput(textInput);
                textInput.focus();
            } else {
                const errorSourceInput = textInput || valueInput || addButton?.closest(`.${CSS.CUSTOM_LIST_INPUT_GROUP}`)?.querySelector('input[type="text"]');
                if (errorSourceInput) _showInputError(errorSourceInput, 'alert_edit_failed_missing_fields');
                else _showGlobalMessage('alert_edit_failed_missing_fields', {}, 'error', 0, _currentModalContent?.querySelector(`#${IDS.SETTINGS_MESSAGE_BAR}`) ? IDS.SETTINGS_MESSAGE_BAR : null);
            }
        }

        /**
         * Handles clicks on edit, delete, or remove buttons within a custom list in a modal.
         * @private
         * @param {Event} event - The click event.
         * @param {HTMLElement} contextElement - The modal's content element.
         * @param {Array<Object>} itemsArrayRef - A reference to the array of items being modified.
         */
        function _handleCustomListActionsInternal(event, contextElement, itemsArrayRef) {
            const button = event.target.closest(`button.${CSS.BUTTON_EDIT_ITEM}, button.${CSS.BUTTON_DELETE_ITEM}, button.${CSS.BUTTON_REMOVE_FROM_LIST}`);
            if (!button) return;

            const listItem = button.closest(`li[data-${DATA_ATTR.INDEX}][data-list-id]`);
            if (!listItem) return;

            const index = parseInt(listItem.dataset[DATA_ATTR.INDEX], 10);
            const listId = listItem.getAttribute('data-list-id');

            if (isNaN(index) || !listId || index < 0 || index >= itemsArrayRef.length) return;

            const mapping = getListMapping(listId);
            if (!mapping) return;

            const item = itemsArrayRef[index];
            if (!item) return;

            const itemIsTrulyCustom = item.type === 'custom' ||
                                     (!item.type && (listId === IDS.SITES_LIST || listId === IDS.TIME_LIST || listId === IDS.FT_LIST));

            if (button.classList.contains(CSS.BUTTON_DELETE_ITEM) && itemIsTrulyCustom) {
                if (confirm(_('confirm_delete_item', { name: item.text }))) {
                    if (_editingItemInfo && _editingItemInfo.listId === listId && _editingItemInfo.index === index) {
                        _resetEditStateInternal(contextElement);
                    }
                    itemsArrayRef.splice(index, 1);
                    mapping.populateFn(listId, itemsArrayRef, contextElement);
                }
            } else if (button.classList.contains(CSS.BUTTON_REMOVE_FROM_LIST) && item.type === 'predefined') {
                if (confirm(_('confirm_remove_item_from_list', { name: (item.originalKey ? _(item.originalKey) : item.text) }))) {
                    itemsArrayRef.splice(index, 1);
                    mapping.populateFn(listId, itemsArrayRef, contextElement);
                }
            } else if (button.classList.contains(CSS.BUTTON_EDIT_ITEM) && itemIsTrulyCustom) {
                _prepareEditItemActionInternal(item, index, listId, mapping, contextElement);
            }
        }

        /**
         * Handles the submission of the form for adding or updating a custom item.
         * It performs validation, checks for duplicates, and then updates the item array.
         * @private
         * @param {string} listId - The ID of the list being modified.
         * @param {HTMLElement} contextElement - The modal's content element.
         * @param {Array<Object>} itemsArrayRef - A reference to the array of items.
         */
        function _handleCustomItemSubmitInternal(listId, contextElement, itemsArrayRef) {
            const mapping = getListMapping(listId);
            if (!mapping) return;

            const itemTypeName = _(mapping.nameKey);
            const textInput = contextElement.querySelector(mapping.textInput);
            const valueInput = contextElement.querySelector(mapping.valueInput);

            const inputGroup = textInput?.closest(`.${CSS.CUSTOM_LIST_INPUT_GROUP}`);
            if (inputGroup) _clearAllInputErrorsInGroup(inputGroup);

            const validationResult = _validateAndPrepareCustomItemData(textInput, valueInput, itemTypeName, listId);
            if (!validationResult.isValid) {
                if (validationResult.errorField) validationResult.errorField.focus();
                return;
            }

            const { text, value } = validationResult;
            const editingIdx = (_editingItemInfo && _editingItemInfo.listId === listId) ? _editingItemInfo.index : -1;

            let isDuplicate;
            if (mapping.isSortableMixed) {
                isDuplicate = _isDuplicateCustomItem(text, itemsArrayRef, listId, editingIdx, _editingItemInfo);
            } else {
                isDuplicate = itemsArrayRef.some((item, idx) => {
                    if (editingIdx === idx && (_editingItemInfo?.originalText?.toLowerCase() === text.toLowerCase())) return false;
                    return item.text.toLowerCase() === text.toLowerCase();
                });
            }

            if (isDuplicate) {
                if (textInput) _showInputError(textInput, 'alert_duplicate_name', { name: text });
                textInput?.focus();
                return;
            }

            let newItemData;
            if (listId === IDS.SITES_LIST) {
                newItemData = { text: text, url: value };
            } else if (mapping.isSortableMixed) {
                newItemData = { id: value, text: text, value: value, type: 'custom' };
            } else {
                newItemData = { text: text, value: value };
            }

            const itemBeingEdited = (editingIdx > -1) ? itemsArrayRef[editingIdx] : null;
            const itemBeingEditedIsCustom = itemBeingEdited &&
                                           (itemBeingEdited.type === 'custom' ||
                                            listId === IDS.SITES_LIST ||
                                            listId === IDS.TIME_LIST ||
                                            listId === IDS.FT_LIST);

            if (editingIdx > -1 && itemBeingEditedIsCustom) {
                itemsArrayRef[editingIdx] = {...itemsArrayRef[editingIdx], ...newItemData };
                _resetEditStateInternal(contextElement);
            } else {
                itemsArrayRef.push(newItemData);
            }

            mapping.populateFn(listId, itemsArrayRef, contextElement);

            if (!_editingItemInfo || _editingItemInfo.listId !== listId) {
                if (textInput) { textInput.value = ''; _clearInputError(textInput); textInput.focus(); }
                if (valueInput) { valueInput.value = ''; _clearInputError(valueInput); }
            }
        }

        /**
         * Determines which list item is the drop target during a drag-and-drop operation.
         * @private
         * @param {HTMLElement} container - The list container (`<ul>`).
         * @param {number} y - The current y-coordinate of the cursor.
         * @returns {HTMLElement|undefined} The list item element that is the drop target.
         */
        function _getDragAfterModalListItem(container, y) {
            const draggableElements = [...container.querySelectorAll(`li[draggable="true"]:not(.${CSS.IS_DRAGGING})`)];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        /**
         * Handles the `dragstart` event for a list item in a modal.
         * @private
         * @param {DragEvent} event - The `dragstart` event.
         */
        function _handleModalListDragStart(event) {
            if (!event.target.matches('li[draggable="true"]')) return;
            _draggedListItem = event.target;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', _draggedListItem.dataset.index);
            _draggedListItem.classList.add(CSS.IS_DRAGGING);

            const list = _draggedListItem.closest('ul');
            if (list) { list.querySelectorAll(`li:not(.${CSS.IS_DRAGGING})`).forEach(li => li.style.pointerEvents = 'none'); }
        }

        /**
         * Handles the `dragover` event to provide visual feedback for the drop target.
         * @private
         * @param {DragEvent} event - The `dragover` event.
         */
        function _handleModalListDragOver(event) {
            event.preventDefault();
            const listElement = event.currentTarget;
            listElement.querySelectorAll(`li.${CSS.IS_DRAG_OVER}`).forEach(li => li.classList.remove(CSS.IS_DRAG_OVER));

            const targetItem = event.target.closest('li[draggable="true"]');
            if (targetItem && targetItem !== _draggedListItem) {
                targetItem.classList.add(CSS.IS_DRAG_OVER);
            } else {
                const afterElement = _getDragAfterModalListItem(listElement, event.clientY);
                if (afterElement) {
                    afterElement.classList.add(CSS.IS_DRAG_OVER);
                }
            }
        }
		
        /**
         * Handles the `dragleave` event to clear visual feedback.
         * @private
         * @param {DragEvent} event - The `dragleave` event.
         */
        function _handleModalListDragLeave(event) {
            const listElement = event.currentTarget;
            if (event.relatedTarget && listElement.contains(event.relatedTarget)) return;
            listElement.querySelectorAll(`li.${CSS.IS_DRAG_OVER}`).forEach(li => li.classList.remove(CSS.IS_DRAG_OVER));
        }

        /**
         * Handles the `drop` event to reorder the items in the backing array.
         * @private
         * @param {DragEvent} event - The `drop` event.
         * @param {string} listId - The ID of the list being modified.
         * @param {Array<Object>} itemsArrayRef - A reference to the array of items.
         */
        function _handleModalListDrop(event, listId, itemsArrayRef) {
            event.preventDefault();
            if (!_draggedListItem) return;

            const draggedIndexOriginal = parseInt(event.dataTransfer.getData('text/plain'), 10);
            if (isNaN(draggedIndexOriginal) || draggedIndexOriginal < 0 || draggedIndexOriginal >= itemsArrayRef.length) {
                _handleModalListDragEnd(event.currentTarget);
                return;
            }

            const listElement = event.currentTarget;
            const mapping = getListMapping(listId);
            if (!mapping) { _handleModalListDragEnd(listElement); return; }

            const draggedItemData = itemsArrayRef[draggedIndexOriginal];
            if (!draggedItemData) { _handleModalListDragEnd(listElement); return; }

            const itemsWithoutDragged = itemsArrayRef.filter((item, index) => index !== draggedIndexOriginal);
            const afterElement = _getDragAfterModalListItem(listElement, event.clientY);
            let newIndexInSplicedArray;

            if (afterElement) {
                const originalIndexOfAfterElement = parseInt(afterElement.dataset.index, 10);
                let countSkipped = 0; newIndexInSplicedArray = -1;
                for(let i=0; i < itemsArrayRef.length; i++) {
                    if (i === draggedIndexOriginal) continue;
                    if (i === originalIndexOfAfterElement) {
                        newIndexInSplicedArray = countSkipped;
                        break;
                    }
                    countSkipped++;
                }
                 if (newIndexInSplicedArray === -1 && originalIndexOfAfterElement === itemsArrayRef.length -1 && draggedIndexOriginal < originalIndexOfAfterElement) {
                    newIndexInSplicedArray = itemsWithoutDragged.length;
                } else if (newIndexInSplicedArray === -1) {
                    newIndexInSplicedArray = itemsWithoutDragged.length;
                }
            } else {
                newIndexInSplicedArray = itemsWithoutDragged.length;
            }

            itemsWithoutDragged.splice(newIndexInSplicedArray, 0, draggedItemData);
            itemsArrayRef.length = 0;
            itemsWithoutDragged.forEach(item => itemsArrayRef.push(item));

            _handleModalListDragEnd(listElement);
            mapping.populateFn(listId, itemsArrayRef, _currentModalContent);

            const newLiElements = listElement.querySelectorAll('li');
            newLiElements.forEach((li, idx) => {
                li.dataset.index = idx;
            });
        }

        /**
         * Cleans up the state and styling after a drag-and-drop operation ends.
         * @private
         * @param {HTMLElement} listElement - The list container element.
         */
        function _handleModalListDragEnd(listElement) {
            if (_draggedListItem) {
                _draggedListItem.classList.remove(CSS.IS_DRAGGING);
            }
            _draggedListItem = null;
            (listElement || _currentModalContent)?.querySelectorAll(`li.${CSS.IS_DRAG_OVER}`).forEach(li => li.classList.remove(CSS.IS_DRAG_OVER));
            _currentModalContent?.querySelectorAll(`ul.${CSS.CUSTOM_LIST} li[draggable="true"]`).forEach(li => li.style.pointerEvents = '');
        }

        /**
         * Adds a new predefined item to a display list in a modal.
         * @private
         * @param {string[]} selectedValues - The values of the predefined items to add.
         * @param {string} predefinedSourceKey - The key for looking up the predefined item data.
         * @param {Array<Object>} displayItemsArrayRef - A reference to the array of items to modify.
         * @param {string} listIdToUpdate - The ID of the list to repopulate.
         * @param {HTMLElement} modalContentContext - The modal's content element.
         */
        function _addPredefinedItemsToModalList(selectedValues, predefinedSourceKey, displayItemsArrayRef, listIdToUpdate, modalContentContext) {
            const mapping = getListMapping(listIdToUpdate);
            if (!mapping) return;

            selectedValues.forEach(value => {
                const predefinedOpt = PREDEFINED_OPTIONS[predefinedSourceKey]?.find(p => p.value === value);
                if (predefinedOpt && !displayItemsArrayRef.some(item => item.value === value && item.type === 'predefined')) {
                    displayItemsArrayRef.push({
                        id: predefinedOpt.value,
                        text: _(predefinedOpt.textKey),
                        value: predefinedOpt.value,
                        type: 'predefined',
                        originalKey: predefinedOpt.textKey
                    });
                }
            });
            mapping.populateFn(listIdToUpdate, displayItemsArrayRef, modalContentContext);
        }

        /**
         * Binds all necessary event listeners for a modal's content.
         * Uses event delegation to efficiently handle events for list items and controls.
         * @private
         * @param {HTMLElement} modalContent - The modal's content element.
         * @param {Array<Object>} itemsArrayRef - A reference to the array of items being managed.
         * @param {string|null} [listIdForDragDrop=null] - The ID of the list that should have drag-and-drop enabled.
         */
        function _bindModalContentEventsInternal(modalContent, itemsArrayRef, listIdForDragDrop = null) {
            if (!modalContent || modalContent.dataset.modalEventsBound === 'true') return;

            modalContent.addEventListener('click', (event) => {
                const target = event.target;
                const listIdForAction = listIdForDragDrop || target.closest('[data-list-id]')?.dataset.listId || target.closest(`.${CSS.BUTTON_ADD_CUSTOM}`)?.dataset.listId;

                const addNewOptionButton = target.closest(`#${IDS.MODAL_ADD_NEW_OPTION_BTN}`);
                if (addNewOptionButton && listIdForAction) {
                    const mapping = getListMapping(listIdForAction);
                    const configForModal = modalConfigsData[Object.keys(modalConfigsData).find(key => modalConfigsData[key].listId === listIdForAction)];

                    if (mapping && configForModal && configForModal.predefinedSourceKey && configForModal.isSortableMixed) {
                         PredefinedOptionChooser.show(
                            configForModal.manageType, listIdForAction, configForModal.predefinedSourceKey,
                            itemsArrayRef, modalContent, _addPredefinedItemsToModalList
                        );
                    } else if (mapping) {
                         modalContent.querySelector(mapping.textInput)?.focus();
                    }
                    return;
                }

                const addButton = target.closest(`.${CSS.BUTTON_ADD_CUSTOM}.custom-list-action-button`);
                const itemControlButton = target.closest(`button.${CSS.BUTTON_EDIT_ITEM}, button.${CSS.BUTTON_DELETE_ITEM}, button.${CSS.BUTTON_REMOVE_FROM_LIST}`);
                const cancelEditButton = target.closest('.cancel-edit-button');

                if (itemControlButton && listIdForAction) { _handleCustomListActionsInternal(event, modalContent, itemsArrayRef); }
                else if (addButton && listIdForAction) { _handleCustomItemSubmitInternal(listIdForAction, modalContent, itemsArrayRef); }
                else if (cancelEditButton) { _resetEditStateInternal(modalContent); }
            });

            modalContent.addEventListener('input', (event) => {
                const target = event.target;
                if (target.matches('input[type="text"]')) {
                    _clearInputError(target);
                    validateCustomInput(target);
                }
            });

            if (listIdForDragDrop) {
                const draggableListElement = modalContent.querySelector(`#${listIdForDragDrop}`);
                if (draggableListElement && draggableListElement.dataset.dragEventsBound !== 'true') {
                    draggableListElement.dataset.dragEventsBound = 'true';
                    draggableListElement.addEventListener('dragstart', _handleModalListDragStart);
                    draggableListElement.addEventListener('dragover', _handleModalListDragOver);
                    draggableListElement.addEventListener('dragleave', _handleModalListDragLeave);
                    draggableListElement.addEventListener('drop', (e) => _handleModalListDrop(e, listIdForDragDrop, itemsArrayRef));
                    draggableListElement.addEventListener('dragend', () => _handleModalListDragEnd(draggableListElement));
                }
            }
            modalContent.dataset.modalEventsBound = 'true';
        }

        return {
            /**
             * Shows a modal dialog.
             * @param {string} titleKey - The localization key for the modal's title.
             * @param {string} contentHTML - The HTML string to be injected into the modal's body.
             * @param {Function} onCompleteCallback - A callback function to execute when the user clicks the "Done" button.
             * @param {string} currentTheme - The current theme to apply to the modal.
             * @returns {HTMLElement} The content element of the created modal.
             */
            show: function(titleKey, contentHTML, onCompleteCallback, currentTheme) {
                this.hide();

                _currentModal = document.createElement('div');
                _currentModal.className = 'settings-modal-overlay';
                applyThemeToElement(_currentModal, currentTheme);

                _currentModalContent = document.createElement('div');
                _currentModalContent.className = 'settings-modal-content';
                applyThemeToElement(_currentModalContent, currentTheme);

                const headerHTML = `
                    <div class="settings-modal-header">
                        <h4>${_(titleKey)}</h4>
                        <button class="settings-modal-close-btn" title="${_('settings_close_button_title')}">${SVG_ICONS.close}</button>
                    </div>`;
                const bodyHTML = `<div class="settings-modal-body">${contentHTML}</div>`;
                const footerHTML = `
                    <div class="settings-modal-footer">
                        <button class="modal-complete-btn">${_('modal_button_complete')}</button>
                    </div>`;

                _currentModalContent.innerHTML = headerHTML + bodyHTML + footerHTML;
                _currentModal.appendChild(_currentModalContent);

                const self = this;
                const closeModalHandler = (event) => {
                    if (event.target === _currentModal || event.target.closest('.settings-modal-close-btn')) {
                        self.hide(true);
                    }
                };
                const completeModalHandler = () => {
                    if (typeof onCompleteCallback === 'function') {
                        onCompleteCallback(_currentModalContent);
                    }
                    self.hide(false);
                };

                _currentModal.addEventListener('click', closeModalHandler);
                _currentModalContent.querySelector('.modal-complete-btn').addEventListener('click', completeModalHandler);
				_currentModalContent.querySelector('.settings-modal-close-btn').addEventListener('click', () => self.hide(true));
                _currentModalContent.addEventListener('click', (event) => event.stopPropagation());

                document.body.appendChild(_currentModal);
                return _currentModalContent;
            },

            /**
             * Hides and destroys the currently visible modal.
             * @param {boolean} [isCancel=false] - Indicates if the hide action was a cancellation.
             */
            hide: function(isCancel = false) {
                PredefinedOptionChooser.hide();
                if (_currentModal) {
                    const inputGroup = _currentModalContent?.querySelector(`.${CSS.CUSTOM_LIST_INPUT_GROUP}`);
                    if (inputGroup) _clearAllInputErrorsInGroup(inputGroup);
                    _resetEditStateInternal();
                    _currentModal.remove();
                }
                _currentModal = null;
                _currentModalContent = null;
                _handleModalListDragEnd();
            },

            /**
             * Opens a specific type of management modal based on the provided configuration.
             * @param {string} manageType - The type of items to manage (e.g., 'site', 'language').
             * @param {Object} currentSettingsRef - A reference to the main settings object.
             * @param {Object} PREDEFINED_OPTIONS_REF - A reference to the predefined options data.
             * @param {Function} onModalCompleteCallback - The callback to execute when the modal is completed.
             */
            openManageCustomOptions: function(manageType, currentSettingsRef, PREDEFINED_OPTIONS_REF, onModalCompleteCallback) {
                const config = modalConfigsData[manageType];
                if (!config) { console.error("Error: Could not get config for manageType:", manageType); return; }

                const mapping = getListMapping(config.listId);
                if (!mapping) { console.error("Error: Could not get mapping for listId:", config.listId); return; }

                const tempItems = JSON.parse(JSON.stringify(currentSettingsRef[config.itemsArrayKey] || []));
                let contentHTML = '';
                const itemTypeNameForDisplay = _(mapping.nameKey);

                if (config.isSortableMixed) {
                    contentHTML += _createModalListAndInputHTML(config.listId, config.textPKey, config.valPKey, config.hintKey, config.fmtKey, itemTypeNameForDisplay, true);
                } else if (config.hasPredefinedToggles && config.predefinedSourceKey && PREDEFINED_OPTIONS_REF[config.predefinedSourceKey]) {
                    const enabledValues = new Set(currentSettingsRef.enabledPredefinedOptions[config.predefinedSourceKey] || []);
                    contentHTML += _createPredefinedOptionsSectionHTML(config.predefinedSourceKey, mapping.nameKey, PREDEFINED_OPTIONS_REF, enabledValues);
                    contentHTML += '<hr style="margin: 1em 0;">';
                    contentHTML += _createModalListAndInputHTML(config.listId, config.textPKey, config.valPKey, config.hintKey, config.fmtKey, itemTypeNameForDisplay, false);
                } else {
                    contentHTML += _createModalListAndInputHTML(config.listId, config.textPKey, config.valPKey, config.hintKey, config.fmtKey, itemTypeNameForDisplay, false);
                }

                const modalContentElement = this.show(
                    config.modalTitleKey,
                    contentHTML,
                    (modalContent) => {
                        let newEnabledPredefs = null;
                        if (config.hasPredefinedToggles && config.predefinedSourceKey) {
                            newEnabledPredefs = Array.from(modalContent.querySelectorAll(`.predefined-options-list input[data-option-type="${config.predefinedSourceKey}"]:checked`)).map(cb => cb.value);
                        }
                        onModalCompleteCallback(tempItems, newEnabledPredefs, config.itemsArrayKey, config.predefinedSourceKey, config.customItemsMasterKey, config.isSortableMixed, manageType);
                    },
                    currentSettingsRef.theme
                );

                if (modalContentElement) {
                    if (mapping && mapping.populateFn) {
                        mapping.populateFn(config.listId, tempItems, modalContentElement);
                    }
                    _bindModalContentEventsInternal(modalContentElement, tempItems, config.listId);
                }
            },

            /**
             * Globally resets the edit state, useful when closing modals or switching tabs.
             */
            resetEditStateGlobally: function() { _resetEditStateInternal(_currentModalContent || document); },

            /**
             * Checks if a modal is currently open.
             * @returns {boolean} True if a modal is open.
             */
            isModalOpen: function() { return !!_currentModal; }
        };
    })();

    /**
     * @module SettingsUIPaneGenerator
     * A utility module responsible for generating the HTML content for each tab
     * within the main settings window. It decouples the HTML structure from the
     * core logic of the `SettingsManager`.
     */
    const SettingsUIPaneGenerator = (function() {
        /**
         * Creates the HTML content for the "General" settings tab.
         * @returns {string} The HTML string for the pane.
         */
        function createGeneralPaneHTML() {
            const langOpts = LocalizationService.getAvailableLocales().map(lc => {
                let dn;
                if (lc === 'auto') {
                    dn = _('settings_language_auto');
                } else {
                    try {
                        dn = new Intl.DisplayNames([lc], { type: 'language' }).of(lc);
                        dn = dn.charAt(0).toUpperCase() + dn.slice(1);
                    } catch (e) {
                        dn = lc;
                    }
                    dn = `${dn} (${lc})`;
                }
                return `<option value="${lc}">${dn}</option>`;
            }).join('');

            const locationOptionsHTML = `
                <option value="tools">${_('settings_location_tools')}</option>
                <option value="topBlock">${_('settings_location_top')}</option>
                <option value="header">${_('settings_location_header')}</option>
                <option value="none">${_('settings_location_hide')}</option>`;

            return `
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_INTERFACE_LANGUAGE}">${_('settings_interface_language')}</label>
                    <select id="${IDS.SETTING_INTERFACE_LANGUAGE}">${langOpts}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_SECTION_MODE}">${_('settings_section_mode')}</label>
                    <select id="${IDS.SETTING_SECTION_MODE}">
                        <option value="remember">${_('settings_section_mode_remember')}</option>
                        <option value="expandAll">${_('settings_section_mode_expand')}</option>
                        <option value="collapseAll">${_('settings_section_mode_collapse')}</option>
                    </select>
                    <div style="margin-top:0.6em;">
                        <input type="checkbox" id="${IDS.SETTING_ACCORDION}">
                        <label for="${IDS.SETTING_ACCORDION}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_accordion_mode')}</label>
                        <div class="${CSS.SETTING_VALUE_HINT}" style="margin-top:0.3em; margin-left:1.7em; font-weight:normal;">${_('settings_accordion_mode_hint_desc')}</div>
                    </div>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_DRAGGABLE}">
                    <label for="${IDS.SETTING_DRAGGABLE}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_enable_drag')}</label>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_RESET_LOCATION}">${_('settings_reset_button_location')}</label>
                    <select id="${IDS.SETTING_RESET_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_VERBATIM_LOCATION}">${_('settings_verbatim_button_location')}</label>
                    <select id="${IDS.SETTING_VERBATIM_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_ADV_SEARCH_LOCATION}">${_('settings_adv_search_location')}</label>
                    <select id="${IDS.SETTING_ADV_SEARCH_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_PERSONALIZE_LOCATION}">${_('settings_personalize_button_location')}</label>
                    <select id="${IDS.SETTING_PERSONALIZE_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_SCHOLAR_LOCATION}">${_('settings_scholar_location')}</label>
                    <select id="${IDS.SETTING_SCHOLAR_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_TRENDS_LOCATION}">${_('settings_trends_location')}</label>
                    <select id="${IDS.SETTING_TRENDS_LOCATION}">${locationOptionsHTML}</select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_DATASET_SEARCH_LOCATION}">${_('settings_dataset_search_location')}</label>
                    <select id="${IDS.SETTING_DATASET_SEARCH_LOCATION}">${locationOptionsHTML}</select>
                </div>`;
        }

        /**
         * Creates the HTML content for the "Appearance" settings tab.
         * @returns {string} The HTML string for the pane.
         */
        function createAppearancePaneHTML() {
            const colorOptionsGrid = COLOR_MAPPINGS.map(map => {
                const labelTextKey = `settings_color_${map.key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                return `<label for="${map.id}">${_(labelTextKey)}</label><input type="color" id="${map.id}">`;
            }).join('');

            return `
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_WIDTH}">${_('settings_sidebar_width')}</label>
                    <span class="${CSS.SETTING_RANGE_HINT}">${_('settings_width_range_hint')}</span>
                    <input type="range" id="${IDS.SETTING_WIDTH}" min="90" max="270" step="5"><span class="${CSS.SETTING_RANGE_VALUE}"></span>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_HEIGHT}">${_('settings_sidebar_height')}</label>
                    <span class="${CSS.SETTING_RANGE_HINT}">${_('settings_height_range_hint')}</span>
                    <input type="range" id="${IDS.SETTING_HEIGHT}" min="25" max="100" step="5"><span class="${CSS.SETTING_RANGE_VALUE}"></span>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_FONT_SIZE}">${_('settings_font_size')}</label>
                    <span class="${CSS.SETTING_RANGE_HINT}">${_('settings_font_size_range_hint')}</span>
                    <input type="range" id="${IDS.SETTING_FONT_SIZE}" min="8" max="24" step="0.5"><span class="${CSS.SETTING_RANGE_VALUE}"></span>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_HEADER_ICON_SIZE}">${_('settings_header_icon_size')}</label>
                    <span class="${CSS.SETTING_RANGE_HINT}">${_('settings_header_icon_size_range_hint')}</span>
                    <input type="range" id="${IDS.SETTING_HEADER_ICON_SIZE}" min="8" max="32" step="0.5"><span class="${CSS.SETTING_RANGE_VALUE}"></span>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_VERTICAL_SPACING}">${_('settings_vertical_spacing')}</label>
                    <span class="${CSS.SETTING_RANGE_HINT}">${_('settings_vertical_spacing_range_hint')}</span>
                    <input type="range" id="${IDS.SETTING_VERTICAL_SPACING}" min="0.05" max="1.5" step="0.05"><span class="${CSS.SETTING_RANGE_VALUE}"></span>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_THEME}">${_('settings_theme')}</label>
                    <select id="${IDS.SETTING_THEME}">
                        <option value="system">${_('settings_theme_system')}</option>
                        <option value="light">${_('settings_theme_light')}</option>
                        <option value="dark">${_('settings_theme_dark')}</option>
                        <option value="minimal-light">${_('settings_theme_minimal_light')}</option>
                        <option value="minimal-dark">${_('settings_theme_minimal_dark')}</option>
                    </select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_HOVER}"><label for="${IDS.SETTING_HOVER}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_hover_mode')}</label>
                    <div style="margin-top:0.8em;padding-left:1.5em;">
                        <label for="${IDS.SETTING_OPACITY}" style="display:block;margin-bottom:0.4em;font-weight:normal;">${_('settings_idle_opacity')}</label>
                        <span class="${CSS.SETTING_RANGE_HINT}" style="width:auto;display:inline-block;margin-right:1em;">${_('settings_opacity_range_hint')}</span>
                        <input type="range" id="${IDS.SETTING_OPACITY}" min="0.1" max="1.0" step="0.05" style="width:calc(100% - 18em);vertical-align:middle;display:inline-block;">
                        <span class="${CSS.SETTING_RANGE_VALUE}" style="display:inline-block;min-width:3em;text-align:right;vertical-align:middle;"></span>
                    </div>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_COUNTRY_DISPLAY_MODE}">${_('settings_country_display')}</label>
                    <select id="${IDS.SETTING_COUNTRY_DISPLAY_MODE}">
                        <option value="iconAndText">${_('settings_country_display_icontext')}</option>
                        <option value="textOnly">${_('settings_country_display_text')}</option>
                        <option value="iconOnly">${_('settings_country_display_icon')}</option>
                    </select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <label for="${IDS.SETTING_SCROLLBAR_POSITION}">${_('settings_scrollbar_position')}</label>
                    <select id="${IDS.SETTING_SCROLLBAR_POSITION}">
                        <option value="right">${_('settings_scrollbar_right')}</option>
                        <option value="left">${_('settings_scrollbar_left')}</option>
                        <option value="hidden">${_('settings_scrollbar_hidden')}</option>
                    </select>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_HIDE_GOOGLE_LOGO}">
                    <label for="${IDS.SETTING_HIDE_GOOGLE_LOGO}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_hide_google_logo')}</label>
                    <div class="${CSS.SETTING_VALUE_HINT}" style="margin-top:0.3em; margin-left:1.7em; font-weight:normal;">${_('settings_hide_google_logo_hint')}</div>
                </div>
                <hr style="margin:1.2em 0;">
                <div id="${IDS.CUSTOM_COLORS_CONTAINER}" class="${CSS.SETTING_ITEM}">
                    <label style="font-weight:bold; width:100%; margin-bottom: 0.8em;">${_('settings_advanced_color_options')}</label>
                    <div style="display:grid; grid-template-columns: auto 1fr; gap: 0.8em 1em; align-items: center; width: 100%;">${colorOptionsGrid}</div>
                    <button id="${IDS.RESET_CUSTOM_COLORS_BTN}" style="margin-top: 1em;">${_('settings_reset_colors_button')}</button>
                </div>`;
        }

        /**
         * Creates the HTML content for the "Features" settings tab.
         * @returns {string} The HTML string for the pane.
         */
        function createFeaturesPaneHTML() {
            const visItemsHTML = ALL_SECTION_DEFINITIONS.map(def => {
                const dn = _(def.titleKey) || def.id;
                return `<div class="${CSS.SETTING_ITEM} ${CSS.SETTING_ITEM_SIMPLE}"><input type="checkbox" id="setting-visible-${def.id}" data-${DATA_ATTR.SECTION_ID}="${def.id}"><label for="setting-visible-${def.id}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${dn}</label></div>`;
            }).join('');

            return `
                <p>${_('settings_visible_sections')}</p>${visItemsHTML}
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_SITE_SEARCH_CHECKBOX_MODE}">
                    <label for="${IDS.SETTING_SITE_SEARCH_CHECKBOX_MODE}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_enable_site_search_checkbox_mode')}</label>
                    <div class="${CSS.SETTING_VALUE_HINT}" style="margin-top:0.3em; margin-left:1.7em; font-weight:normal;">${_('settings_enable_site_search_checkbox_mode_hint')}</div>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_SHOW_FAVICONS}">
                    <label for="${IDS.SETTING_SHOW_FAVICONS}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_show_favicons')}</label>
                    <div class="${CSS.SETTING_VALUE_HINT}" style="margin-top:0.3em; margin-left:1.7em; font-weight:normal;">${_('settings_show_favicons_hint')}</div>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_FILETYPE_SEARCH_CHECKBOX_MODE}">
                    <label for="${IDS.SETTING_FILETYPE_SEARCH_CHECKBOX_MODE}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_enable_filetype_search_checkbox_mode')}</label>
                    <div class="${CSS.SETTING_VALUE_HINT}" style="margin-top:0.3em; margin-left:1.7em; font-weight:normal;">${_('settings_enable_filetype_search_checkbox_mode_hint')}</div>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <input type="checkbox" id="${IDS.SETTING_SHOW_RESULT_STATS}">
                    <label for="${IDS.SETTING_SHOW_RESULT_STATS}" class="${CSS.SETTING_ITEM_LABEL_INLINE}">${_('settings_show_result_stats')}</label>
                </div>
                <hr style="margin:1.2em 0;">
                <p style="font-weight:bold;margin-bottom:0.5em;">${_('settings_section_order')}</p>
                <p class="${CSS.SETTING_VALUE_HINT}" style="font-size:0.9em;margin-top:-0.3em;margin-bottom:0.7em;">${_('settings_section_order_hint')}</p>
                <ul id="${IDS.SIDEBAR_SECTION_ORDER_LIST}" class="${CSS.SECTION_ORDER_LIST}"></ul>`;
        }

        /**
         * Creates the HTML content for the "Custom" settings tab.
         * @returns {string} The HTML string for the pane.
         */
        function createCustomPaneHTML() {
            return `
                <div class="${CSS.SETTING_ITEM}">
                    <p>${_('settings_custom_intro')}</p>
                    <button class="${CSS.BUTTON_MANAGE_CUSTOM}" data-${DATA_ATTR.MANAGE_TYPE}="site">${_('settings_manage_sites_button')}</button>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <button class="${CSS.BUTTON_MANAGE_CUSTOM}" data-${DATA_ATTR.MANAGE_TYPE}="language">${_('settings_manage_languages_button')}</button>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <button class="${CSS.BUTTON_MANAGE_CUSTOM}" data-${DATA_ATTR.MANAGE_TYPE}="country">${_('settings_manage_countries_button')}</button>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <button class="${CSS.BUTTON_MANAGE_CUSTOM}" data-${DATA_ATTR.MANAGE_TYPE}="time">${_('settings_manage_time_ranges_button')}</button>
                </div>
                <div class="${CSS.SETTING_ITEM}">
                    <button class="${CSS.BUTTON_MANAGE_CUSTOM}" data-${DATA_ATTR.MANAGE_TYPE}="filetype">${_('settings_manage_file_types_button')}</button>
                </div>`;
        }
        return { createGeneralPaneHTML, createAppearancePaneHTML, createFeaturesPaneHTML, createCustomPaneHTML };
    })();

    /**
     * @module SectionOrderDragHandler
     * Manages the drag-and-drop functionality for reordering sections in the settings window.
     * It is a self-contained module that handles all necessary drag events.
     */
    const SectionOrderDragHandler = (function() {
        let _draggedItem = null; let _listElement = null; let _settingsRef = null; let _onOrderUpdateCallback = null;
        function getDragAfterElement(container, y) { const draggableElements = [...container.querySelectorAll(`li[draggable="true"]:not(.${CSS.IS_DRAGGING})`)]; return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; } }, { offset: Number.NEGATIVE_INFINITY }).element; }
        function handleDragStart(event) { _draggedItem = event.target; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', _draggedItem.dataset.sectionId); _draggedItem.classList.add(CSS.IS_DRAGGING); if (_listElement) { _listElement.querySelectorAll(`li:not(.${CSS.IS_DRAGGING})`).forEach(li => li.style.pointerEvents = 'none'); } }
        function handleDragOver(event) { event.preventDefault(); if (!_listElement) return; _listElement.querySelectorAll(`li.${CSS.IS_DRAG_OVER}`).forEach(li => { li.classList.remove(CSS.IS_DRAG_OVER); }); const targetItem = event.target.closest('li[draggable="true"]'); if (targetItem && targetItem !== _draggedItem) { targetItem.classList.add(CSS.IS_DRAG_OVER); } else if (!targetItem && _listElement.contains(event.target)) { const afterElement = getDragAfterElement(_listElement, event.clientY); if (afterElement) { afterElement.classList.add(CSS.IS_DRAG_OVER); } } }
        function handleDragLeave(event) { const relatedTarget = event.relatedTarget; if (_listElement && (!relatedTarget || !_listElement.contains(relatedTarget))) { _listElement.querySelectorAll(`li.${CSS.IS_DRAG_OVER}`).forEach(li => { li.classList.remove(CSS.IS_DRAG_OVER); }); } }
        function handleDrop(event) {
            event.preventDefault(); if (!_draggedItem || !_listElement || !_settingsRef || !_onOrderUpdateCallback) return;
            const draggedSectionId = event.dataTransfer.getData('text/plain');
            let currentVisibleOrder = _settingsRef.sidebarSectionOrder.filter(id => _settingsRef.visibleSections[id]);
            const oldIndexInVisible = currentVisibleOrder.indexOf(draggedSectionId);
            if (oldIndexInVisible > -1) { currentVisibleOrder.splice(oldIndexInVisible, 1); } else { handleDragEnd(); return; }
            const afterElement = getDragAfterElement(_listElement, event.clientY);
            if (afterElement) { const targetId = afterElement.dataset.sectionId; const newIndexInVisible = currentVisibleOrder.indexOf(targetId); if (newIndexInVisible > -1) { currentVisibleOrder.splice(newIndexInVisible, 0, draggedSectionId); } else { currentVisibleOrder.push(draggedSectionId); }
            } else { currentVisibleOrder.push(draggedSectionId); }
            const hiddenSectionOrder = _settingsRef.sidebarSectionOrder.filter(id => !_settingsRef.visibleSections[id]);
            _settingsRef.sidebarSectionOrder = [...currentVisibleOrder, ...hiddenSectionOrder];
            handleDragEnd(); _onOrderUpdateCallback();
        }
        function handleDragEnd() { if (_draggedItem) { _draggedItem.classList.remove(CSS.IS_DRAGGING); } _draggedItem = null; if (_listElement) { _listElement.querySelectorAll('li').forEach(li => { li.classList.remove(CSS.IS_DRAG_OVER); li.style.pointerEvents = ''; }); } }
        function initialize(listEl, currentSettings, orderUpdateCallback) { _listElement = listEl; _settingsRef = currentSettings; _onOrderUpdateCallback = orderUpdateCallback; if (_listElement && _listElement.dataset.sectionOrderDragBound !== 'true') { _listElement.addEventListener('dragstart', handleDragStart); _listElement.addEventListener('dragover', handleDragOver); _listElement.addEventListener('dragleave', handleDragLeave); _listElement.addEventListener('drop', handleDrop); _listElement.addEventListener('dragend', handleDragEnd); _listElement.dataset.sectionOrderDragBound = 'true'; } }
        function destroy() { if (_listElement && _listElement.dataset.sectionOrderDragBound === 'true') { _listElement.removeEventListener('dragstart', handleDragStart); _listElement.removeEventListener('dragover', handleDragOver); _listElement.removeEventListener('dragleave', handleDragLeave); _listElement.removeEventListener('drop', handleDrop); _listElement.removeEventListener('dragend', handleDragEnd); delete _listElement.dataset.sectionOrderDragBound; } _listElement = null; _settingsRef = null; _onOrderUpdateCallback = null; }
        return { initialize, destroy };
    })();
	
    /**
     * @module SettingsManager
     * The central controller for all script settings. It handles loading settings from storage,
     * saving them, validating their integrity, and managing the entire settings UI,
     * including its creation, population with data, and event handling.
     */
    const SettingsManager = (function() {
        let _settingsWindow = null; let _settingsOverlay = null; let _currentSettings = {};
        let _settingsBackup = {}; let _defaultSettingsRef = null; let _isInitialized = false;
        let _applySettingsToSidebar_cb = ()=>{}; let _buildSidebarUI_cb = ()=>{};
        let _applySectionCollapseStates_cb = ()=>{}; let _initMenuCommands_cb = ()=>{};
        let _renderSectionOrderList_ext_cb = ()=>{};

        /**
         * A helper to populate a range slider and its associated value display in the settings UI.
         * @private
         * @param {HTMLElement} win - The settings window element.
         * @param {string} id - The ID of the range input element.
         * @param {number|string} value - The value to set.
         * @param {Function} [formatFn=(val) => val] - An optional function to format the displayed value.
         */
        function _populateSliderSetting_internal(win, id, value, formatFn = (val) => val) {
            const i = win.querySelector(`#${id}`);
            if (i) {
                i.value = value;
                let vs = i.parentNode.querySelector(`.${CSS.SETTING_RANGE_VALUE}`);
                if (vs) {
                    vs.textContent = formatFn(value);
                }
            }
        }
		
        /**
         * Populates the "General" tab in the settings window with current setting values.
         * @private
         * @param {HTMLElement} win - The settings window element.
         * @param {Object} s - The current settings object.
         */
        function _populateGeneralSettings_internal(win, s) {
            const lS = win.querySelector(`#${IDS.SETTING_INTERFACE_LANGUAGE}`);
            if (lS) lS.value = s.interfaceLanguage;
            const sMS = win.querySelector(`#${IDS.SETTING_SECTION_MODE}`),
                acC = win.querySelector(`#${IDS.SETTING_ACCORDION}`);
            if (sMS && acC) {
                sMS.value = s.sectionDisplayMode;
                const iRM = s.sectionDisplayMode === 'remember';
                acC.disabled = !iRM;
                acC.checked = iRM ? s.accordionMode : false;
                const accordionHint = acC.parentElement.querySelector(`.${CSS.SETTING_VALUE_HINT}`);
                if (accordionHint) accordionHint.style.color = iRM ? '' : 'grey';
            }
            const dC = win.querySelector(`#${IDS.SETTING_DRAGGABLE}`);
            if (dC) dC.checked = s.draggableHandleEnabled;
            const rLS = win.querySelector(`#${IDS.SETTING_RESET_LOCATION}`);
            if (rLS) rLS.value = s.resetButtonLocation;
            const vLS = win.querySelector(`#${IDS.SETTING_VERBATIM_LOCATION}`);
            if (vLS) vLS.value = s.verbatimButtonLocation;
            const aSLS = win.querySelector(`#${IDS.SETTING_ADV_SEARCH_LOCATION}`);
            if (aSLS) aSLS.value = s.advancedSearchLinkLocation;
            const pznLS = win.querySelector(`#${IDS.SETTING_PERSONALIZE_LOCATION}`);
            if (pznLS) pznLS.value = s.personalizationButtonLocation;
            const schLS = win.querySelector(`#${IDS.SETTING_SCHOLAR_LOCATION}`);
            if (schLS) schLS.value = s.googleScholarShortcutLocation;
            const trnLS = win.querySelector(`#${IDS.SETTING_TRENDS_LOCATION}`);
            if (trnLS) trnLS.value = s.googleTrendsShortcutLocation;
            const dsLS = win.querySelector(`#${IDS.SETTING_DATASET_SEARCH_LOCATION}`);
            if (dsLS) dsLS.value = s.googleDatasetSearchShortcutLocation;
        }

        /**
         * Populates the "Appearance" tab in the settings window with current setting values.
         * @private
         * @param {HTMLElement} win - The settings window element.
         * @param {Object} s - The current settings object.
         */
        function _populateAppearanceSettings_internal(win, s) {
            _populateSliderSetting_internal(win, IDS.SETTING_WIDTH, s.sidebarWidth);
            _populateSliderSetting_internal(win, IDS.SETTING_HEIGHT, s.sidebarHeight);
            _populateSliderSetting_internal(win, IDS.SETTING_FONT_SIZE, s.fontSize, v => parseFloat(v).toFixed(1));
            _populateSliderSetting_internal(win, IDS.SETTING_HEADER_ICON_SIZE, s.headerIconSize, v => parseFloat(v).toFixed(1));
            _populateSliderSetting_internal(win, IDS.SETTING_VERTICAL_SPACING, s.verticalSpacingMultiplier, v => `x ${parseFloat(v).toFixed(2)}`);
            _populateSliderSetting_internal(win, IDS.SETTING_OPACITY, s.idleOpacity, v => parseFloat(v).toFixed(2));
            const tS = win.querySelector(`#${IDS.SETTING_THEME}`);
            if (tS) tS.value = s.theme;
            const cDS = win.querySelector(`#${IDS.SETTING_COUNTRY_DISPLAY_MODE}`);
            if (cDS) cDS.value = s.countryDisplayMode;
            const scrollbarPos = win.querySelector(`#${IDS.SETTING_SCROLLBAR_POSITION}`);
            if (scrollbarPos) scrollbarPos.value = s.scrollbarPosition;
            const hC = win.querySelector(`#${IDS.SETTING_HOVER}`),
                oI = win.querySelector(`#${IDS.SETTING_OPACITY}`);
            if (hC && oI) {
                hC.checked = s.hoverMode;
                const iHE = s.hoverMode;
                oI.disabled = !iHE;
                const oC = oI.closest('div');
                if (oC) {
                    oC.style.opacity = iHE ? '1' : '0.6';
                    oC.style.pointerEvents = iHE ? 'auto' : 'none';
                }
            }
            const hideLogoCb = win.querySelector(`#${IDS.SETTING_HIDE_GOOGLE_LOGO}`);
            if (hideLogoCb) hideLogoCb.checked = s.hideGoogleLogoWhenExpanded;

            const isDark = s.theme.includes('dark') || (s.theme === 'system' && systemThemeMediaQuery && systemThemeMediaQuery.matches);
            const colorDefaults = {
                bgColor: isDark ? '#202124' : '#ffffff',
                textColor: isDark ? '#bdc1c6' : '#3c4043',
                linkColor: isDark ? '#8ab4f8' : '#1a0dab',
                selectedColor: isDark ? '#e8eaed' : '#000000',
                inputTextColor: isDark ? '#e8eaed' : '#202124',
                borderColor: isDark ? '#5f6368' : '#dadce0',
                dividerColor: isDark ? '#3c4043' : '#eeeeee',
                btnBgColor: isDark ? '#303134' : '#f8f9fa',
                btnHoverBgColor: isDark ? '#3c4043' : '#e8eaed',
                activeBgColor: isDark ? '#8ab4f8' : '#e8f0fe',
                activeTextColor: isDark ? '#202124' : '#1967d2',
                activeBorderColor: isDark ? '#8ab4f8' : '#aecbfa',
                headerIconColor: isDark ? '#bdc1c6' : '#5f6368',
            };
            COLOR_MAPPINGS.forEach(map => {
                const picker = win.querySelector(`#${map.id}`);
                if (picker) {
                    picker.value = s.customColors[map.key] || colorDefaults[map.key];
                }
            });
        }

        /**
         * Populates the "Features" tab in the settings window with current setting values.
         * @private
         * @param {HTMLElement} win - The settings window element.
         * @param {Object} s - The current settings object.
         * @param {Function} renderFn - A callback function to render the section order list.
         */
        function _populateFeatureSettings_internal(win, s, renderFn) {
            win.querySelectorAll(`#${IDS.TAB_PANE_FEATURES} input[type="checkbox"][data-${DATA_ATTR.SECTION_ID}]`)?.forEach(cb => {
                const sId = cb.getAttribute(`data-${DATA_ATTR.SECTION_ID}`);
                if (sId && s.visibleSections.hasOwnProperty(sId)) {
                    cb.checked = s.visibleSections[sId];
                } else if (sId && _defaultSettingsRef.visibleSections.hasOwnProperty(sId)) {
                    cb.checked = _defaultSettingsRef.visibleSections[sId] ?? false;
                }
            });
            const siteSearchCheckboxModeEl = win.querySelector(`#${IDS.SETTING_SITE_SEARCH_CHECKBOX_MODE}`);
            if (siteSearchCheckboxModeEl) siteSearchCheckboxModeEl.checked = s.enableSiteSearchCheckboxMode;
            const showFaviconsEl = win.querySelector(`#${IDS.SETTING_SHOW_FAVICONS}`);
            if (showFaviconsEl) showFaviconsEl.checked = s.showFaviconsForSiteSearch;
            const filetypeSearchCheckboxModeEl = win.querySelector(`#${IDS.SETTING_FILETYPE_SEARCH_CHECKBOX_MODE}`);
            if (filetypeSearchCheckboxModeEl) filetypeSearchCheckboxModeEl.checked = s.enableFiletypeCheckboxMode;
            const showResultStatsEl = win.querySelector(`#${IDS.SETTING_SHOW_RESULT_STATS}`);
            if (showResultStatsEl) showResultStatsEl.checked = s.showResultStats;
            renderFn(s);
        }

        /**
         * Ensures the correct settings tab is visible based on the last active tab or a default.
         * @private
         */
        function _initializeActiveSettingsTab_internal() {
            if (!_settingsWindow) return;
            const tC = _settingsWindow.querySelector(`.${CSS.SETTINGS_TABS}`),
                cC = _settingsWindow.querySelector(`.${CSS.SETTINGS_TAB_CONTENT}`);
            if (!tC || !cC) return;
            const aTB = tC.querySelector(`.${CSS.TAB_BUTTON}.${CSS.IS_ACTIVE}`);
            const tT = (aTB && aTB.dataset[DATA_ATTR.TAB]) ? aTB.dataset[DATA_ATTR.TAB] : 'general';
            tC.querySelectorAll(`.${CSS.TAB_BUTTON}`).forEach(b => b.classList.toggle(CSS.IS_ACTIVE, b.dataset[DATA_ATTR.TAB] === tT));
            cC.querySelectorAll(`.${CSS.TAB_PANE}`).forEach(p => p.classList.toggle(CSS.IS_ACTIVE, p.dataset[DATA_ATTR.TAB] === tT));
        }

        /**
         * Loads settings from storage using GM_getValue.
         * @private
         * @returns {Object} The parsed settings object from storage, or an empty object on error.
         */
        function _loadFromStorage() {
            try {
                const s = GM_getValue(STORAGE_KEY, '{}');
                return JSON.parse(s || '{}');
            } catch (e) {
                console.error(`${LOG_PREFIX} Error loading/parsing settings:`, e);
                return {};
            }
        }

        /**
         * Ensures the display arrays for languages and countries are valid and populated.
         * For new users or corrupted settings where these arrays are missing or empty,
         * this function populates them based on the script's default predefined options.
         * This replaces a more complex legacy migration system.
         * @private
         * @param {Object} settings - The settings object to validate and potentially modify.
         */
        function _migrateToDisplayArraysIfNecessary(settings) {
            const displayTypes = [{
                displayKey: 'displayLanguages',
                predefinedKey: 'language',
                defaultEnabled: defaultSettings.enabledPredefinedOptions.language
            }, {
                displayKey: 'displayCountries',
                predefinedKey: 'country',
                defaultEnabled: defaultSettings.enabledPredefinedOptions.country
            }];

            displayTypes.forEach(typeInfo => {
                // Check if the display array is missing, invalid, or empty.
                if (!Array.isArray(settings[typeInfo.displayKey]) || settings[typeInfo.displayKey].length === 0) {
                    console.log(`${LOG_PREFIX} Initializing '${typeInfo.displayKey}' with default predefined options.`);
                    const newDisplayArray = [];
                    const addedValues = new Set();
                    const defaultOptionsToEnable = typeInfo.defaultEnabled || [];

                    defaultOptionsToEnable.forEach(val => {
                        const predefinedOpt = PREDEFINED_OPTIONS[typeInfo.predefinedKey]?.find(p => p.value === val);
                        if (predefinedOpt && !addedValues.has(predefinedOpt.value)) {
                            newDisplayArray.push({
                                id: predefinedOpt.value,
                                text: _(predefinedOpt.textKey), // Text is for reference, will be re-translated on UI build
                                value: predefinedOpt.value,
                                type: 'predefined',
                                originalKey: predefinedOpt.textKey
                            });
                            addedValues.add(predefinedOpt.value);
                        }
                    });
                    settings[typeInfo.displayKey] = newDisplayArray;
                }
            });
        }

        /**
         * Validates and merges core settings like sidebar position and state.
         * @private
         */
        function _validateAndMergeCoreSettings_internal(target, source, defaults) {
            if (typeof target.sidebarPosition !== 'object' || target.sidebarPosition === null || Array.isArray(target.sidebarPosition)) {
                target.sidebarPosition = JSON.parse(JSON.stringify(defaults.sidebarPosition));
            }
            target.sidebarPosition.left = parseInt(target.sidebarPosition.left, 10) || defaults.sidebarPosition.left;
            target.sidebarPosition.top = parseInt(target.sidebarPosition.top, 10) || defaults.sidebarPosition.top;
            if (typeof target.sectionStates !== 'object' || target.sectionStates === null || Array.isArray(target.sectionStates)) {
                target.sectionStates = {};
            }
            target.sidebarCollapsed = !!target.sidebarCollapsed;
            target.draggableHandleEnabled = typeof target.draggableHandleEnabled === 'boolean' ? target.draggableHandleEnabled : defaults.draggableHandleEnabled;
            target.interfaceLanguage = typeof source.interfaceLanguage === 'string' ? source.interfaceLanguage : defaults.interfaceLanguage;
        }

        /**
         * Validates and merges appearance-related settings like dimensions, fonts, and colors.
         * @private
         */
        function _validateAndMergeAppearanceSettings_internal(target, source, defaults) {
            target.sidebarWidth = Utils.clamp(parseInt(target.sidebarWidth, 10) || defaults.sidebarWidth, 90, 270);
            target.sidebarHeight = Utils.clamp(parseInt(target.sidebarHeight, 10) || defaults.sidebarHeight, 25, 100);
            target.fontSize = Utils.clamp(parseFloat(target.fontSize) || defaults.fontSize, 8, 24);
            target.headerIconSize = Utils.clamp(parseFloat(target.headerIconSize) || defaults.headerIconSize, 8, 32);
            target.verticalSpacingMultiplier = Utils.clamp(parseFloat(target.verticalSpacingMultiplier) || defaults.verticalSpacingMultiplier, 0.05, 1.5);
            target.idleOpacity = Utils.clamp(parseFloat(target.idleOpacity) || defaults.idleOpacity, 0.1, 1.0);
            target.hoverMode = !!target.hoverMode;
            const validThemes = ['system', 'light', 'dark', 'minimal-light', 'minimal-dark'];
            if (target.theme === 'minimal') target.theme = 'minimal-light';
            else if (!validThemes.includes(target.theme)) target.theme = defaults.theme;
            target.hideGoogleLogoWhenExpanded = typeof source.hideGoogleLogoWhenExpanded === 'boolean' ? source.hideGoogleLogoWhenExpanded : defaults.hideGoogleLogoWhenExpanded;

            if (typeof source.customColors === 'object' && source.customColors !== null && !Array.isArray(source.customColors)) {
                target.customColors = {};
                const colorRegex = /^#[0-9a-fA-F]{6}$/;
                COLOR_MAPPINGS.forEach(map => {
                    if (typeof source.customColors[map.key] === 'string' && (source.customColors[map.key] === '' || colorRegex.test(source.customColors[map.key]))) {
                        target.customColors[map.key] = source.customColors[map.key];
                    } else {
                        target.customColors[map.key] = '';
                    }
                });
            } else {
                target.customColors = JSON.parse(JSON.stringify(defaults.customColors));
            }
        }

        /**
         * Validates and merges feature-related settings like section visibility and button locations.
         * @private
         */
        function _validateAndMergeFeatureSettings_internal(target, source, defaults) {
            if (typeof target.visibleSections !== 'object' || target.visibleSections === null || Array.isArray(target.visibleSections)) {
                target.visibleSections = JSON.parse(JSON.stringify(defaults.visibleSections));
            }
            const validSectionIDs = new Set(ALL_SECTION_DEFINITIONS.map(def => def.id));
            Object.keys(defaults.visibleSections).forEach(id => {
                if (!validSectionIDs.has(id)) {
                    console.warn(`${LOG_PREFIX} Invalid section ID in defaultSettings.visibleSections: ${id}`);
                } else if (typeof target.visibleSections[id] !== 'boolean') {
                    target.visibleSections[id] = defaults.visibleSections[id] ?? true;
                }
            });
            const validSectionModes = ['remember', 'expandAll', 'collapseAll'];
            if (!validSectionModes.includes(target.sectionDisplayMode)) target.sectionDisplayMode = defaults.sectionDisplayMode;
            target.accordionMode = !!target.accordionMode;
            target.enableSiteSearchCheckboxMode = typeof target.enableSiteSearchCheckboxMode === 'boolean' ? target.enableSiteSearchCheckboxMode : defaults.enableSiteSearchCheckboxMode;
            target.showFaviconsForSiteSearch = typeof target.showFaviconsForSiteSearch === 'boolean' ? target.showFaviconsForSiteSearch : defaults.showFaviconsForSiteSearch;
            target.enableFiletypeCheckboxMode = typeof target.enableFiletypeCheckboxMode === 'boolean' ? target.enableFiletypeCheckboxMode : defaults.enableFiletypeCheckboxMode;
            const validButtonLocations = ['header', 'topBlock', 'tools', 'none'];
            if (!validButtonLocations.includes(target.resetButtonLocation)) target.resetButtonLocation = defaults.resetButtonLocation;
            if (!validButtonLocations.includes(target.verbatimButtonLocation)) target.verbatimButtonLocation = defaults.verbatimButtonLocation;
            if (!validButtonLocations.includes(target.advancedSearchLinkLocation)) target.advancedSearchLinkLocation = defaults.advancedSearchLinkLocation;
            if (!validButtonLocations.includes(target.personalizationButtonLocation)) {
                target.personalizationButtonLocation = defaults.personalizationButtonLocation;
            }
            if (!validButtonLocations.includes(target.googleScholarShortcutLocation)) {
                target.googleScholarShortcutLocation = defaults.googleScholarShortcutLocation;
            }
            if (!validButtonLocations.includes(target.googleTrendsShortcutLocation)) {
                target.googleTrendsShortcutLocation = defaults.googleTrendsShortcutLocation;
            }
            if (!validButtonLocations.includes(target.googleDatasetSearchShortcutLocation)) {
                target.googleDatasetSearchShortcutLocation = defaults.googleDatasetSearchShortcutLocation;
            }
            const validCountryDisplayModes = ['iconAndText', 'textOnly', 'iconOnly'];
            if (!validCountryDisplayModes.includes(target.countryDisplayMode)) target.countryDisplayMode = defaults.countryDisplayMode;
            const validScrollbarPositions = ['right', 'left', 'hidden'];
            if (!validScrollbarPositions.includes(target.scrollbarPosition)) target.scrollbarPosition = defaults.scrollbarPosition;
            target.showResultStats = typeof source.showResultStats === 'boolean' ? source.showResultStats : defaults.showResultStats;
        }

        /**
         * Validates and merges user-defined custom lists (e.g., favorite sites).
         * @private
         */
        function _validateAndMergeCustomLists_internal(target, source, defaults) {
            const listKeys = ['favoriteSites', 'customLanguages', 'customTimeRanges', 'customFiletypes', 'customCountries'];
            listKeys.forEach(key => {
                target[key] = Array.isArray(target[key]) ? target[key].filter(item => item && typeof item.text === 'string' && typeof item[key === 'favoriteSites' ? 'url' : 'value'] === 'string' && item.text.trim() !== '' && item[key === 'favoriteSites' ? 'url' : 'value'].trim() !== '') : JSON.parse(JSON.stringify(defaults[key]));
            });
        }

        /**
         * Validates and merges the settings for enabled predefined options.
         * @private
         */
        function _validateAndMergePredefinedOptions_internal(target, source, defaults) {
            target.enabledPredefinedOptions = target.enabledPredefinedOptions || {};
            ['time', 'filetype'].forEach(type => {
                if (!target.enabledPredefinedOptions[type] || !Array.isArray(target.enabledPredefinedOptions[type])) {
                    target.enabledPredefinedOptions[type] = JSON.parse(JSON.stringify(defaults.enabledPredefinedOptions[type] || []));
                }
                const savedTypeOptions = source.enabledPredefinedOptions?.[type];
                if (PREDEFINED_OPTIONS[type] && Array.isArray(savedTypeOptions)) {
                    const validValues = new Set(PREDEFINED_OPTIONS[type].map(opt => opt.value));
                    target.enabledPredefinedOptions[type] = savedTypeOptions.filter(val => typeof val === 'string' && validValues.has(val));
                } else if (!PREDEFINED_OPTIONS[type]) {
                    target.enabledPredefinedOptions[type] = [];
                }
            });
            if (target.displayLanguages && target.enabledPredefinedOptions) target.enabledPredefinedOptions.language = [];
            if (target.displayCountries && target.enabledPredefinedOptions) target.enabledPredefinedOptions.country = [];
        }

        /**
         * Validates and finalizes the order of sidebar sections.
         * @private
         */
        function _finalizeSectionOrder_internal(target, source, defaults) {
            const finalOrder = [];
            const currentVisibleOrderSet = new Set();
            const validSectionIDs = new Set(ALL_SECTION_DEFINITIONS.map(def => def.id));
            const orderSource = (Array.isArray(source.sidebarSectionOrder) && source.sidebarSectionOrder.length > 0) ? source.sidebarSectionOrder : defaults.sidebarSectionOrder;
            orderSource.forEach(id => {
                if (typeof id === 'string' && validSectionIDs.has(id) && target.visibleSections[id] === true && !currentVisibleOrderSet.has(id)) {
                    finalOrder.push(id);
                    currentVisibleOrderSet.add(id);
                }
            });
            defaults.sidebarSectionOrder.forEach(id => {
                if (typeof id === 'string' && validSectionIDs.has(id) && target.visibleSections[id] === true && !currentVisibleOrderSet.has(id)) {
                    finalOrder.push(id);
                }
            });
            target.sidebarSectionOrder = finalOrder;
        }

        /**
         * Takes a raw settings object (e.g., from storage) and merges it with default settings,
         * performing validation and sanitation to ensure a clean, usable settings object.
         * @private
         * @param {Object} saved - The raw settings object loaded from storage.
         * @returns {Object} The validated and merged settings object.
         */
        function _validateAndMergeSettings(saved) {
            let newSettings = JSON.parse(JSON.stringify(_defaultSettingsRef));
            newSettings = Utils.mergeDeep(newSettings, saved);

            _validateAndMergeCoreSettings_internal(newSettings, saved, _defaultSettingsRef);
            _validateAndMergeAppearanceSettings_internal(newSettings, saved, _defaultSettingsRef);
            _validateAndMergeFeatureSettings_internal(newSettings, saved, _defaultSettingsRef);
            _validateAndMergeCustomLists_internal(newSettings, saved, _defaultSettingsRef);
            _migrateToDisplayArraysIfNecessary(newSettings);

            ['displayLanguages', 'displayCountries'].forEach(displayKey => {
                if (!Array.isArray(newSettings[displayKey])) {
                    newSettings[displayKey] = JSON.parse(JSON.stringify(_defaultSettingsRef[displayKey])) || [];
                }
                newSettings[displayKey] = newSettings[displayKey].filter(item =>
                    item && typeof item.id === 'string' &&
                    (item.type === 'predefined' ? (typeof item.text === 'string' && typeof item.originalKey === 'string') : typeof item.text === 'string') &&
                    typeof item.value === 'string' &&
                    (item.type === 'predefined' || item.type === 'custom')
                );
            });

            _validateAndMergePredefinedOptions_internal(newSettings, saved, _defaultSettingsRef);
            _finalizeSectionOrder_internal(newSettings, saved, _defaultSettingsRef);

            return newSettings;
        }

        // A map of element IDs to their live update event handler functions.
        const _sEH_internal = {
            [IDS.SETTING_WIDTH]: (t, vS) => _hSLI(t, 'sidebarWidth', vS, 90, 270, 5),
            [IDS.SETTING_HEIGHT]: (t, vS) => _hSLI(t, 'sidebarHeight', vS, 25, 100, 5),
            [IDS.SETTING_FONT_SIZE]: (t, vS) => _hSLI(t, 'fontSize', vS, 8, 24, 0.5, v => parseFloat(v).toFixed(1)),
            [IDS.SETTING_HEADER_ICON_SIZE]: (t, vS) => _hSLI(t, 'headerIconSize', vS, 8, 32, 0.5, v => parseFloat(v).toFixed(1)),
            [IDS.SETTING_VERTICAL_SPACING]: (t, vS) => _hSLI(t, 'verticalSpacingMultiplier', vS, 0.05, 1.5, 0.05, v => `x ${parseFloat(v).toFixed(2)}`),
            [IDS.SETTING_OPACITY]: (t, vS) => _hSLI(t, 'idleOpacity', vS, 0.1, 1.0, 0.05, v => parseFloat(v).toFixed(2)),
            [IDS.SETTING_INTERFACE_LANGUAGE]: (t) => {
                const nL = t.value;
                if (_currentSettings.interfaceLanguage !== nL) {
                    _currentSettings.interfaceLanguage = nL;
                    LocalizationService.updateActiveLocale(_currentSettings);
                    _initMenuCommands_cb();
                    publicApi.populateWindow();
                    _buildSidebarUI_cb();
                }
            },
            [IDS.SETTING_THEME]: (t) => {
                _currentSettings.theme = t.value;
                _populateAppearanceSettings_internal(_settingsWindow, _currentSettings);
                _applySettingsToSidebar_cb(_currentSettings);
            },
            [IDS.SETTING_HOVER]: (t) => {
                _currentSettings.hoverMode = t.checked;
                const oI = _settingsWindow.querySelector(`#${IDS.SETTING_OPACITY}`);
                if (oI) {
                    const iHE = _currentSettings.hoverMode;
                    oI.disabled = !iHE;
                    const oC = oI.closest('div');
                    if (oC) {
                        oC.style.opacity = iHE ? '1' : '0.6';
                        oC.style.pointerEvents = iHE ? 'auto' : 'none';
                    }
                }
                _applySettingsToSidebar_cb(_currentSettings);
            },
            [IDS.SETTING_DRAGGABLE]: (t) => {
                _currentSettings.draggableHandleEnabled = t.checked;
                _applySettingsToSidebar_cb(_currentSettings);
                DragManager.setDraggable(t.checked, sidebar, sidebar?.querySelector(`.${CSS.DRAG_HANDLE}`), _currentSettings, debouncedSaveSettings);
            },
            [IDS.SETTING_ACCORDION]: (t) => {
                const sMS = _settingsWindow.querySelector(`#${IDS.SETTING_SECTION_MODE}`);
                if (sMS?.value === 'remember') _currentSettings.accordionMode = t.checked;
                else {
                    t.checked = false;
                    _currentSettings.accordionMode = false;
                }
                _applySettingsToSidebar_cb(_currentSettings);
                _applySectionCollapseStates_cb();
            },
            [IDS.SETTING_SECTION_MODE]: (t) => {
                _currentSettings.sectionDisplayMode = t.value;
                const aC = _settingsWindow.querySelector(`#${IDS.SETTING_ACCORDION}`);
                if (aC) {
                    const iRM = t.value === 'remember';
                    aC.disabled = !iRM;
                    if (aC.parentElement.querySelector(`.${CSS.SETTING_VALUE_HINT}`)) aC.parentElement.querySelector(`.${CSS.SETTING_VALUE_HINT}`).style.color = iRM ? '' : 'grey';
                    if (!iRM) {
                        aC.checked = false;
                        _currentSettings.accordionMode = false;
                    } else {
                        aC.checked = _settingsBackup?.accordionMode ?? _currentSettings.accordionMode ?? _defaultSettingsRef.accordionMode;
                        _currentSettings.accordionMode = aC.checked;
                    }
                }
                _applySettingsToSidebar_cb(_currentSettings);
                _applySectionCollapseStates_cb();
            },
            [IDS.SETTING_RESET_LOCATION]: (t) => {
                _currentSettings.resetButtonLocation = t.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_VERBATIM_LOCATION]: (t) => {
                _currentSettings.verbatimButtonLocation = t.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_ADV_SEARCH_LOCATION]: (t) => {
                _currentSettings.advancedSearchLinkLocation = t.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_PERSONALIZE_LOCATION]: (target) => {
                _currentSettings.personalizationButtonLocation = target.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_SCHOLAR_LOCATION]: (target) => {
                _currentSettings.googleScholarShortcutLocation = target.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_TRENDS_LOCATION]: (target) => {
                _currentSettings.googleTrendsShortcutLocation = target.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_DATASET_SEARCH_LOCATION]: (target) => {
                _currentSettings.googleDatasetSearchShortcutLocation = target.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_SITE_SEARCH_CHECKBOX_MODE]: (target) => {
                _currentSettings.enableSiteSearchCheckboxMode = target.checked;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_SHOW_FAVICONS]: (target) => {
                _currentSettings.showFaviconsForSiteSearch = target.checked;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_FILETYPE_SEARCH_CHECKBOX_MODE]: (target) => {
                _currentSettings.enableFiletypeCheckboxMode = target.checked;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_COUNTRY_DISPLAY_MODE]: (t) => {
                _currentSettings.countryDisplayMode = t.value;
                _buildSidebarUI_cb();
            },
            [IDS.SETTING_SCROLLBAR_POSITION]: (t) => {
                _currentSettings.scrollbarPosition = t.value;
                _applySettingsToSidebar_cb(_currentSettings);
            },
            [IDS.SETTING_SHOW_RESULT_STATS]: (t) => {
                _currentSettings.showResultStats = t.checked;
                ResultStatsManager.toggle(_currentSettings.showResultStats);
            },
            [IDS.SETTING_HIDE_GOOGLE_LOGO]: (t) => {
                _currentSettings.hideGoogleLogoWhenExpanded = t.checked;
                _applySettingsToSidebar_cb(_currentSettings);
            },
            [IDS.RESET_CUSTOM_COLORS_BTN]: () => {
                _currentSettings.customColors = JSON.parse(JSON.stringify(_defaultSettingsRef.customColors));
                _populateAppearanceSettings_internal(_settingsWindow, _currentSettings);
                _applySettingsToSidebar_cb(_currentSettings);
            }
        };

        /**
         * Generic handler for range slider input events.
         * @private
         */
        function _hSLI(t, sK, vS, min, max, step, fFn = v => v) {
            const v = Utils.clamp((step === 1 || step === 5) ? parseInt(t.value, 10) : parseFloat(t.value), min, max);
            if (isNaN(v)) _currentSettings[sK] = _defaultSettingsRef[sK];
            else _currentSettings[sK] = v;
            if (vS) vS.textContent = fFn(_currentSettings[sK]);
            _applySettingsToSidebar_cb(_currentSettings);
        }

        /**
         * The main event handler for live updates in the settings window.
         * @private
         * @param {Event} e - The input or change event.
         */
        function _lUH_internal(e) {
            const t = e.target;
            if (!t) return;
            const sI = t.id;
            const vS = (t.type === 'range') ? t.parentNode.querySelector(`.${CSS.SETTING_RANGE_VALUE}`) : null;

            if (t.type === 'color') {
                const colorMapping = COLOR_MAPPINGS.find(m => m.id === t.id);
                if (colorMapping) {
                    if (!_currentSettings.customColors) _currentSettings.customColors = {};
                    _currentSettings.customColors[colorMapping.key] = t.value;
                    _applySettingsToSidebar_cb(_currentSettings);
                    return;
                }
            }

            if (_sEH_internal[sI]) {
                if (t.type === 'range') _sEH_internal[sI](t, vS);
                else _sEH_internal[sI](t);
            }
        }
		
        const publicApi = {
            /**
             * Initializes the SettingsManager.
             * @param {Object} defaultSettingsObj - The default settings.
             * @param {Function} applyCb - Callback to apply settings to the sidebar.
             * @param {Function} buildCb - Callback to rebuild the sidebar UI.
             * @param {Function} collapseCb - Callback to apply section collapse states.
             * @param {Function} menuCb - Callback to initialize menu commands.
             * @param {Function} renderOrderCb - Callback to render the section order list.
             */
            initialize: function(defaultSettingsObj, applyCb, buildCb, collapseCb, menuCb, renderOrderCb) {
                if (_isInitialized) return;
                _defaultSettingsRef = defaultSettingsObj;
                _applySettingsToSidebar_cb = applyCb;
                _buildSidebarUI_cb = buildCb;
                _applySectionCollapseStates_cb = collapseCb;
                _initMenuCommands_cb = menuCb;
                _renderSectionOrderList_ext_cb = renderOrderCb;
                this.load();
                this.buildSkeleton();
                _isInitialized = true;
            },

            /**
             * Loads settings from storage and validates them.
             */
            load: function() {
                const s = _loadFromStorage();
                _currentSettings = _validateAndMergeSettings(s);
                LocalizationService.updateActiveLocale(_currentSettings);
            },

            /**
             * Saves the current settings to storage.
             * @param {string} [logContext='SaveBtn'] - Context for logging the save action.
             */
            save: function(logContext = 'SaveBtn') {
                try {
                    ['displayLanguages', 'displayCountries'].forEach(displayKey => {
                        const mapping = getListMapping(displayKey === 'displayLanguages' ? IDS.LANG_LIST : IDS.COUNTRIES_LIST);
                        if (mapping && mapping.customItemsMasterKey && _currentSettings[displayKey] && Array.isArray(_currentSettings[mapping.customItemsMasterKey])) {
                            const displayItems = _currentSettings[displayKey];
                            const currentDisplayCustomItems = displayItems.filter(item => item.type === 'custom');
                            const currentDisplayCustomItemValues = new Set(currentDisplayCustomItems.map(item => item.value));

                            const newMasterList = (_currentSettings[mapping.customItemsMasterKey] || [])
                                .filter(masterItem => currentDisplayCustomItemValues.has(masterItem.value))
                                .map(oldMasterItem => {
                                    const correspondingDisplayItem = currentDisplayCustomItems.find(d => d.value === oldMasterItem.value);
                                    return correspondingDisplayItem ? {
                                        text: correspondingDisplayItem.text,
                                        value: oldMasterItem.value
                                    } : oldMasterItem;
                                });

                            currentDisplayCustomItems.forEach(dispItem => {
                                if (!newMasterList.find(mi => mi.value === dispItem.value)) {
                                    newMasterList.push({
                                        text: dispItem.text,
                                        value: dispItem.value
                                    });
                                }
                            });
                            _currentSettings[mapping.customItemsMasterKey] = newMasterList;
                        }
                    });

                    GM_setValue(STORAGE_KEY, JSON.stringify(_currentSettings));
                    console.log(`${LOG_PREFIX} Settings saved by SM${logContext ? ` (${logContext})` : ''}.`);
                    _settingsBackup = JSON.parse(JSON.stringify(_currentSettings));
                } catch (e) {
                    console.error(`${LOG_PREFIX} SM save error:`, e);
                    NotificationManager.show('alert_generic_error', {
                        context: 'saving settings'
                    }, 'error', 5000);
                }
            },

            /**
             * Resets the current settings to the script's defaults.
             */
            reset: function() {
                if (confirm(_('confirm_reset_settings'))) {
                    _currentSettings = JSON.parse(JSON.stringify(_defaultSettingsRef));
                    _migrateToDisplayArraysIfNecessary(_currentSettings);
                    if (!_currentSettings.sidebarSectionOrder || _currentSettings.sidebarSectionOrder.length === 0) {
                        _currentSettings.sidebarSectionOrder = [..._defaultSettingsRef.sidebarSectionOrder];
                    }
                    LocalizationService.updateActiveLocale(_currentSettings);
                    this.populateWindow();
                    _applySettingsToSidebar_cb(_currentSettings);
                    _buildSidebarUI_cb();
                    _initMenuCommands_cb();
                    _showGlobalMessage('alert_settings_reset_success', {}, 'success', 4000);
                }
            },

            /**
             * Resets all settings from a menu command, requiring a page refresh.
             */
            resetAllFromMenu: function() {
                if (confirm(_('confirm_reset_all_menu'))) {
                    try {
                        GM_setValue(STORAGE_KEY, JSON.stringify(_defaultSettingsRef));
                        alert(_('alert_reset_all_menu_success'));
                    } catch (e) {
                        _showGlobalMessage('alert_reset_all_menu_fail', {}, 'error', 0);
                    }
                }
            },

            /**
             * Returns the current settings object.
             * @returns {Object} The current settings.
             */
            getCurrentSettings: function() {
                return _currentSettings;
            },

            /**
             * Builds the skeleton HTML for the settings window and overlay.
             */
            buildSkeleton: function() {
                if (_settingsWindow) return;
                _settingsOverlay = document.createElement('div');
                _settingsOverlay.id = IDS.SETTINGS_OVERLAY;
                _settingsWindow = document.createElement('div');
                _settingsWindow.id = IDS.SETTINGS_WINDOW;

                _settingsWindow.innerHTML = `
                    <div class="${CSS.SETTINGS_HEADER}">
                        <h3>${_('settingsTitle')}</h3>
                        <button class="${CSS.SETTINGS_CLOSE_BTN}" title="${_('settings_close_button_title')}">${SVG_ICONS.close}</button>
                    </div>
                    <div id="${IDS.SETTINGS_MESSAGE_BAR}" class="${CSS.MESSAGE_BAR}" style="display: none;"></div>
                    <div class="${CSS.SETTINGS_TABS}">
                        <button class="${CSS.TAB_BUTTON} ${CSS.IS_ACTIVE}" data-${DATA_ATTR.TAB}="general">${_('settings_tab_general')}</button>
                        <button class="${CSS.TAB_BUTTON}" data-${DATA_ATTR.TAB}="appearance">${_('settings_tab_appearance')}</button>
                        <button class="${CSS.TAB_BUTTON}" data-${DATA_ATTR.TAB}="features">${_('settings_tab_features')}</button>
                        <button class="${CSS.TAB_BUTTON}" data-${DATA_ATTR.TAB}="custom">${_('settings_tab_custom')}</button>
                    </div>
                    <div class="${CSS.SETTINGS_TAB_CONTENT}">
                        <div class="${CSS.TAB_PANE} ${CSS.IS_ACTIVE}" data-${DATA_ATTR.TAB}="general" id="${IDS.TAB_PANE_GENERAL}"></div>
                        <div class="${CSS.TAB_PANE}" data-${DATA_ATTR.TAB}="appearance" id="${IDS.TAB_PANE_APPEARANCE}"></div>
                        <div class="${CSS.TAB_PANE}" data-${DATA_ATTR.TAB}="features" id="${IDS.TAB_PANE_FEATURES}"></div>
                        <div class="${CSS.TAB_PANE}" data-${DATA_ATTR.TAB}="custom" id="${IDS.TAB_PANE_CUSTOM}"></div>
                    </div>
                    <div class="${CSS.SETTINGS_FOOTER}">
                        <button class="${CSS.BUTTON_RESET}">${_('settings_reset_all_button')}</button>
                        <button class="${CSS.BUTTON_CANCEL}">${_('settings_cancel_button')}</button>
                        <button class="${CSS.BUTTON_SAVE}">${_('settings_save_button')}</button>
                    </div>`;

                _settingsOverlay.appendChild(_settingsWindow);
                document.body.appendChild(_settingsOverlay);
                this.bindEvents();
            },

            /**
             * Populates the settings window with content and current values.
             */
            populateWindow: function() {
                if (!_settingsWindow) return;
                try {
                    // Update translatable texts
                    _settingsWindow.querySelector(`.${CSS.SETTINGS_HEADER} h3`).textContent = _('settingsTitle');
                    _settingsWindow.querySelector(`.${CSS.SETTINGS_CLOSE_BTN}`).title = _('settings_close_button_title');
                    _settingsWindow.querySelector(`button[data-${DATA_ATTR.TAB}="general"]`).textContent = _('settings_tab_general');
                    _settingsWindow.querySelector(`button[data-${DATA_ATTR.TAB}="appearance"]`).textContent = _('settings_tab_appearance');
                    _settingsWindow.querySelector(`button[data-${DATA_ATTR.TAB}="features"]`).textContent = _('settings_tab_features');
                    _settingsWindow.querySelector(`button[data-${DATA_ATTR.TAB}="custom"]`).textContent = _('settings_tab_custom');
                    _settingsWindow.querySelector(`.${CSS.BUTTON_RESET}`).textContent = _('settings_reset_all_button');
                    _settingsWindow.querySelector(`.${CSS.BUTTON_CANCEL}`).textContent = _('settings_cancel_button');
                    _settingsWindow.querySelector(`.${CSS.BUTTON_SAVE}`).textContent = _('settings_save_button');

                    // Re-generate tab content
                    const paneGeneral = _settingsWindow.querySelector(`#${IDS.TAB_PANE_GENERAL}`);
                    if (paneGeneral) paneGeneral.innerHTML = SettingsUIPaneGenerator.createGeneralPaneHTML();
                    const paneAppearance = _settingsWindow.querySelector(`#${IDS.TAB_PANE_APPEARANCE}`);
                    if (paneAppearance) paneAppearance.innerHTML = SettingsUIPaneGenerator.createAppearancePaneHTML();
                    const paneFeatures = _settingsWindow.querySelector(`#${IDS.TAB_PANE_FEATURES}`);
                    if (paneFeatures) paneFeatures.innerHTML = SettingsUIPaneGenerator.createFeaturesPaneHTML();
                    const paneCustom = _settingsWindow.querySelector(`#${IDS.TAB_PANE_CUSTOM}`);
                    if (paneCustom) paneCustom.innerHTML = SettingsUIPaneGenerator.createCustomPaneHTML();

                    // Populate values
                    _populateGeneralSettings_internal(_settingsWindow, _currentSettings);
                    _populateAppearanceSettings_internal(_settingsWindow, _currentSettings);
                    _populateFeatureSettings_internal(_settingsWindow, _currentSettings, _renderSectionOrderList_ext_cb);
                    ModalManager.resetEditStateGlobally();
                    _initializeActiveSettingsTab_internal();
                    this.bindLiveUpdateEvents();
                    this.bindFeaturesTabEvents();
                } catch (e) {
                    _showGlobalMessage('alert_init_fail', {
                        scriptName: SCRIPT_INTERNAL_NAME,
                        error: "Settings UI pop err"
                    }, 'error', 0);
                }
            },

            /**
             * Shows the settings window.
             */
            show: function() {
                if (!_settingsOverlay || !_settingsWindow) return;
                _settingsBackup = JSON.parse(JSON.stringify(_currentSettings));
                LocalizationService.updateActiveLocale(_currentSettings);
                this.populateWindow();
                applyThemeToElement(_settingsWindow, _currentSettings.theme);
                applyThemeToElement(_settingsOverlay, _currentSettings.theme);
                _settingsOverlay.style.display = 'flex';
            },

            /**
             * Hides the settings window.
             * @param {boolean} [isCancel=false] - If true, reverts any live changes to their pre-opening state.
             */
            hide: function(isCancel = false) {
                if (!_settingsOverlay) return;
                ModalManager.resetEditStateGlobally();
                if (ModalManager.isModalOpen()) ModalManager.hide(true);
                _settingsOverlay.style.display = 'none';
                const messageBar = document.getElementById(IDS.SETTINGS_MESSAGE_BAR);
                if (messageBar) messageBar.style.display = 'none';
                if (isCancel && _settingsBackup && Object.keys(_settingsBackup).length > 0) {
                    _currentSettings = JSON.parse(JSON.stringify(_settingsBackup));
                    LocalizationService.updateActiveLocale(_currentSettings);
                    this.populateWindow();
                    _applySettingsToSidebar_cb(_currentSettings);
                    _buildSidebarUI_cb();
                    _initMenuCommands_cb();
                } else if (isCancel) {
                    console.warn(`${LOG_PREFIX} SM: Cancelled, no backup to restore or backup was identical.`);
                }
            },

            /**
             * Binds the main, one-time events for the settings window using event delegation.
             */
            bindEvents: function() {
                if (!_settingsWindow || _settingsWindow.dataset.eventsBound === 'true') return;

                _settingsWindow.addEventListener('click', (e) => {
                    const target = e.target;
                    // Close, Cancel, Save, Reset buttons
                    if (target.closest(`.${CSS.SETTINGS_CLOSE_BTN}`)) this.hide(true);
                    else if (target.closest(`.${CSS.BUTTON_CANCEL}`)) this.hide(true);
                    else if (target.closest(`.${CSS.BUTTON_SAVE}`)) {
                        this.save();
                        LocalizationService.updateActiveLocale(_currentSettings);
                        _initMenuCommands_cb();
                        _buildSidebarUI_cb();
                        this.hide(false);
                    } else if (target.closest(`.${CSS.BUTTON_RESET}`)) this.reset();
                    // Tab navigation
                    else if (target.closest(`.${CSS.TAB_BUTTON}`) && !target.closest(`.${CSS.IS_ACTIVE}`)) {
                        ModalManager.resetEditStateGlobally();
                        const tabToActivate = target.closest(`.${CSS.TAB_BUTTON}`).dataset[DATA_ATTR.TAB];
                        if (!tabToActivate) return;
                        _settingsWindow.querySelectorAll(`.${CSS.TAB_BUTTON}`).forEach(b => b.classList.remove(CSS.IS_ACTIVE));
                        target.closest(`.${CSS.TAB_BUTTON}`).classList.add(CSS.IS_ACTIVE);
                        _settingsWindow.querySelector(`.${CSS.SETTINGS_TAB_CONTENT}`)?.querySelectorAll(`.${CSS.TAB_PANE}`)?.forEach(p => p.classList.remove(CSS.IS_ACTIVE));
                        _settingsWindow.querySelector(`.${CSS.SETTINGS_TAB_CONTENT} .${CSS.TAB_PANE}[data-${DATA_ATTR.TAB}="${tabToActivate}"]`)?.classList.add(CSS.IS_ACTIVE);
                    }
                    // Manage custom buttons
                    else if (target.closest(`.${CSS.BUTTON_MANAGE_CUSTOM}`)) {
                        const manageType = target.closest(`.${CSS.BUTTON_MANAGE_CUSTOM}`).dataset[DATA_ATTR.MANAGE_TYPE];
                        if (manageType) {
                            ModalManager.openManageCustomOptions(manageType, _currentSettings, PREDEFINED_OPTIONS,
                                (updatedItemsArray, newEnabledPredefs, itemsArrayKey, predefinedOptKey) => {
                                    if (itemsArrayKey) _currentSettings[itemsArrayKey] = updatedItemsArray;
                                    if (predefinedOptKey && newEnabledPredefs) {
                                        if (!_currentSettings.enabledPredefinedOptions) _currentSettings.enabledPredefinedOptions = {};
                                        _currentSettings.enabledPredefinedOptions[predefinedOptKey] = newEnabledPredefs;
                                    }
                                    _buildSidebarUI_cb();
                                }
                            );
                        }
                    }
                });

                _settingsWindow.dataset.eventsBound = 'true';
            },

            /**
             * Binds events for controls that provide a live preview of changes (e.g., sliders, color pickers).
             */
            bindLiveUpdateEvents: function() {
                if (!_settingsWindow) return;
                const liveUpdateHandler = (e) => {
                    const target = e.target;
                    if (target && _sEH_internal[target.id]) {
                        const rangeValueSpan = (target.type === 'range') ? target.parentNode.querySelector(`.${CSS.SETTING_RANGE_VALUE}`) : null;
                        _sEH_internal[target.id](target, rangeValueSpan);
                    } else if (target && target.type === 'color') {
                        _lUH_internal(e);
                    }
                };

                _settingsWindow.removeEventListener('input', _lUH_internal);
                _settingsWindow.removeEventListener('change', _lUH_internal);

                _settingsWindow.addEventListener('input', liveUpdateHandler);
                _settingsWindow.addEventListener('change', liveUpdateHandler);

                const resetColorsBtn = _settingsWindow.querySelector(`#${IDS.RESET_CUSTOM_COLORS_BTN}`);
                if (resetColorsBtn) {
                    resetColorsBtn.removeEventListener('click', _sEH_internal[IDS.RESET_CUSTOM_COLORS_BTN]);
                    resetColorsBtn.addEventListener('click', _sEH_internal[IDS.RESET_CUSTOM_COLORS_BTN]);
                }
            },

            /**
             * Binds events specific to the "Features" tab, such as section visibility checkboxes.
             */
            bindFeaturesTabEvents: function() {
                const featuresPane = _settingsWindow?.querySelector(`#${IDS.TAB_PANE_FEATURES}`);
                if (!featuresPane) return;
                featuresPane.querySelectorAll(`input[type="checkbox"][data-${DATA_ATTR.SECTION_ID}]`).forEach(checkbox => {
                    checkbox.removeEventListener('change', this._handleVisibleSectionChange);
                    checkbox.addEventListener('change', this._handleVisibleSectionChange.bind(this));
                });

                const orderListElement = featuresPane.querySelector(`#${IDS.SIDEBAR_SECTION_ORDER_LIST}`);
                if (orderListElement) {
                    SectionOrderDragHandler.initialize(orderListElement, _currentSettings, () => {
                        _renderSectionOrderList_ext_cb(_currentSettings);
                        _buildSidebarUI_cb();
                    });
                }
            },

            /**
             * Handles changes to the visibility of a section.
             * @private
             * @param {Event} e - The change event from a visibility checkbox.
             */
            _handleVisibleSectionChange: function(e) {
                const target = e.target;
                const sectionId = target.getAttribute(`data-${DATA_ATTR.SECTION_ID}`);
                if (sectionId && _currentSettings.visibleSections.hasOwnProperty(sectionId)) {
                    _currentSettings.visibleSections[sectionId] = target.checked;
                    _finalizeSectionOrder_internal(_currentSettings, _currentSettings, _defaultSettingsRef);
                    _renderSectionOrderList_ext_cb(_currentSettings);
                    _buildSidebarUI_cb();
                }
            },
        };
        return publicApi;
    })();

    /**
     * @module DragManager
     * Manages the dragging functionality for the main sidebar, allowing the user
     * to reposition it on the screen.
     */
    const DragManager = (function() {
        let _isDragging = false; let _dragStartX, _dragStartY, _sidebarStartX, _sidebarStartY;
        let _sidebarElement, _handleElement; let _settingsManagerRef, _saveCallbackRef;

        /**
         * Safely extracts client coordinates (x, y) from a mouse or touch event.
         * This utility function handles both desktop (mousedown, mousemove) and mobile (touchstart, touchmove) events.
         * @param {MouseEvent|TouchEvent} e - The browser event object.
         * @returns {{x: number, y: number}} An object containing the x and y coordinates.
         */
        function _getEventCoordinates(e) { return (e.touches && e.touches.length > 0) ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }

        /**
         * Initiates a drag operation.
         * @private
         * @param {MouseEvent|TouchEvent} e - The start event.
         */
        function _startDrag(e) {
            const currentSettings = _settingsManagerRef.getCurrentSettings();
            if (!currentSettings.draggableHandleEnabled || currentSettings.sidebarCollapsed || (e.type === 'mousedown' && e.button !== 0)) {
                return;
            }
            e.preventDefault();
            _isDragging = true;
            const coords = _getEventCoordinates(e);
            _dragStartX = coords.x;
            _dragStartY = coords.y;
            _sidebarStartX = _sidebarElement.offsetLeft;
            _sidebarStartY = _sidebarElement.offsetTop;
            _sidebarElement.style.cursor = 'grabbing';
            _sidebarElement.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        }

        /**
         * Handles the dragging movement.
         * @private
         * @param {MouseEvent|TouchEvent} e - The move event.
         */
        function _drag(e) {
            if (!_isDragging) return;
            e.preventDefault();
            const coords = _getEventCoordinates(e);
            const dx = coords.x - _dragStartX;
            const dy = coords.y - _dragStartY;
            let newLeft = _sidebarStartX + dx;
            let newTop = _sidebarStartY + dy;

            const maxLeft = window.innerWidth - (_sidebarElement?.offsetWidth ?? 0);
            const maxTop = window.innerHeight - (_sidebarElement?.offsetHeight ?? 0);
            newLeft = Utils.clamp(newLeft, 0, maxLeft);
            newTop = Utils.clamp(newTop, MIN_SIDEBAR_TOP_POSITION, maxTop);

            if (_sidebarElement) {
                _sidebarElement.style.left = `${newLeft}px`;
                _sidebarElement.style.top = `${newTop}px`;
            }
        }

        /**
         * Stops the drag operation and saves the new position.
         * @private
         */
        function _stopDrag() {
            if (_isDragging) {
                _isDragging = false;
                if (_sidebarElement) {
                    _sidebarElement.style.cursor = 'default';
                    _sidebarElement.style.userSelect = '';
                }
                document.body.style.cursor = '';

                const currentSettings = _settingsManagerRef.getCurrentSettings();
                if (!currentSettings.sidebarPosition) currentSettings.sidebarPosition = {};
                currentSettings.sidebarPosition.left = _sidebarElement.offsetLeft;
                currentSettings.sidebarPosition.top = _sidebarElement.offsetTop;

                if (typeof _saveCallbackRef === 'function') {
                    _saveCallbackRef('Drag Stop');
                }
            }
        }
        return {
            /**
             * Initializes the DragManager with necessary elements and callbacks.
             * @param {HTMLElement} sidebarEl - The main sidebar element.
             * @param {HTMLElement} handleEl - The specific drag handle element.
             * @param {Object} settingsMgr - A reference to the SettingsManager.
             * @param {Function} saveCb - The debounced save settings callback.
             */
            init: function(sidebarEl, handleEl, settingsMgr, saveCb) {
                _sidebarElement = sidebarEl;
                _handleElement = handleEl;
                _settingsManagerRef = settingsMgr;
                _saveCallbackRef = saveCb;

                if (_handleElement) {
                    _handleElement.addEventListener('mousedown', _startDrag);
                    _handleElement.addEventListener('touchstart', _startDrag, { passive: false });
                }
                document.addEventListener('mousemove', _drag);
                document.addEventListener('touchmove', _drag, { passive: false });
                document.addEventListener('mouseup', _stopDrag);
                document.addEventListener('touchend', _stopDrag);
                document.addEventListener('touchcancel', _stopDrag);
            },

            /**
             * Enables or disables the dragging functionality.
             * @param {boolean} isEnabled - Whether dragging should be enabled.
             * @param {HTMLElement} sidebarEl - The main sidebar element.
             * @param {HTMLElement} handleEl - The drag handle element.
             */
            setDraggable: function(isEnabled, sidebarEl, handleEl) {
                _sidebarElement = sidebarEl;
                _handleElement = handleEl;
                if (_handleElement) {
                    _handleElement.style.display = isEnabled ? 'block' : 'none';
                }
            }
        };
    })();

    /**
     * @module ResultStatsManager
     * Manages the display of search result statistics (count and time) in the sidebar.
     * It uses a robust combination of polling and MutationObserver to reliably find
     * the statistics element on the Google search results page, which can load asynchronously.
     */
    const ResultStatsManager = (function() {
        let _container = null;
        let _observer = null;
        let _isUpdating = false;
        let _pollingInterval = null;
        let _pollCount = 0;
        const MAX_POLLS = 16;
        const POLLING_INTERVAL_MS = 250;
        let _statsDisplayed = false;

        /**
         * Parses the raw statistics string from Google's result-stats element
         * and formats it into a more compact "count (time)" string.
         * @private
         * @param {string} text - The raw text content from the #result-stats element.
         * @returns {string} The formatted statistics string, or an empty string if parsing fails.
         */
        function _parseAndFormatStats(text) {
            if (!text) return '';

            const timeRegex = /[（\(]([\d,.]+)\s*\S+[）\)]/i;
            const timeMatch = text.match(timeRegex);

            if (!timeMatch) {
                const fallbackTimeRegex = /[（\(]([\d,.]+)\s*s[）\)]/i;
                const fallbackTimeMatch = text.match(fallbackTimeRegex);
                if (!fallbackTimeMatch) {
                    return '';
                }
                timeMatch = fallbackTimeMatch;
            }

            const timeStr = timeMatch[1].replace(',', '.');
            let textWithoutTime = text.replace(timeMatch[0], '');

            const numberRegex = /[\d.,\s ]+/g;
            let allNumbers = textWithoutTime.match(numberRegex) || [];

            if (allNumbers.length === 0) {
                return '';
            }

            let largestNumber = 0;
            allNumbers.forEach(numStr => {
                const cleanNumStr = numStr.trim().replace(/[.,\s ]/g, '');
                if (cleanNumStr) {
                    const num = parseInt(cleanNumStr, 10);
                    if (!isNaN(num) && num > largestNumber) {
                        largestNumber = num;
                    }
                }
            });

            if (largestNumber === 0) {
                 if (!/\s0\s/.test(textWithoutTime)) {
                   return '';
                 }
            }

            const formattedCount = new Intl.NumberFormat('en-US').format(largestNumber);
            return `${formattedCount} (${timeStr}s)`;
        }

        /**
         * Updates the displayed statistics in the sidebar if the source element is found.
         * @private
         * @returns {boolean} True if the stats were successfully displayed, false otherwise.
         */
        function _updateDisplay() {
            if (_isUpdating) return false;

            if (!SettingsManager.getCurrentSettings().showResultStats) {
                _clearDisplay();
                return true;
            }

            const sourceEl = document.getElementById('result-stats');
            if (!sourceEl || !_container) {
                _clearDisplay();
                return false;
            }

            const formattedText = _parseAndFormatStats(sourceEl.textContent);
            const displayEl = _container.querySelector('#gscs-result-stats-display');

            if (formattedText) {
                _isUpdating = true;
                if (displayEl && displayEl.textContent !== formattedText) {
                    displayEl.textContent = formattedText;
                }
                if (_container.style.display === 'none') {
                    _container.style.display = '';
                }
                _statsDisplayed = true;
                _isUpdating = false;
                return true;
            } else {
                _clearDisplay();
                return false;
            }
        }

        /**
         * Clears the displayed statistics from the sidebar.
         * @private
         */
        function _clearDisplay() {
            if (_container) {
                _isUpdating = true;
                const displayEl = _container.querySelector('#gscs-result-stats-display');
                if (displayEl && displayEl.textContent !== '') {
                    displayEl.textContent = '';
                }
                 if (_container.style.display !== 'none') {
                    _container.style.display = 'none';
                }
                _isUpdating = false;
            }
        }

        /**
         * Stops the polling interval used to find the stats element.
         * @private
         */
        function _stopPolling() {
            if (_pollingInterval) {
                clearInterval(_pollingInterval);
                _pollingInterval = null;
            }
        }

        /**
         * Starts a robust check for the statistics element, using both polling and a MutationObserver.
         * @private
         */
        function _startRobustCheck() {
            if (_updateDisplay()) {
                return;
            }

            _stopPolling();
            _pollCount = 0;
            _pollingInterval = setInterval(() => {
                _pollCount++;
                if (_updateDisplay() || _pollCount >= MAX_POLLS) {
                    _stopPolling();
                }
            }, POLLING_INTERVAL_MS);

            if (_observer) _observer.disconnect();
            const targetNode = document.body;
            if (!targetNode) return;

            _observer = new MutationObserver(() => {
                 if (document.getElementById('result-stats')) {
                    _updateDisplay();
                    _stopPolling();
                    _observer.disconnect();
                }
            });
            _observer.observe(targetNode, { childList: true, subtree: true });
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!_statsDisplayed) {
                    _updateDisplay();
                }
            }, 500);
        });

        return {
            /**
             * Initializes the manager, starting the search for the stats element.
             */
            init: function() {
                _statsDisplayed = false;
                _startRobustCheck();
            },

            /**
             * Creates the container element for the stats display.
             * @param {DocumentFragment} parentFragment - The fragment to append the container to.
             */
            createContainer: function(parentFragment) {
                _container = document.createElement('div');
                _container.id = IDS.RESULT_STATS_CONTAINER;
                const display = document.createElement('div');
                display.id = 'gscs-result-stats-display';
                _container.appendChild(display);
                parentFragment.appendChild(_container);
                _container.style.display = 'none';
            },

            /**
             * Public method to trigger a manual update of the stats display.
             */
            update: _updateDisplay,

            /**
             * Toggles the visibility of the stats display based on user settings.
             * @param {boolean} show - Whether to show or hide the stats.
             */
            toggle: function(show) {
                if (show) {
                    if (!_statsDisplayed) {
                       _startRobustCheck();
                    } else {
                       _updateDisplay();
                    }
                } else {
                    _clearDisplay();
                }
            }
        };
    })();
	
    /**
     * @module URLActionManager
     * The core action handler of the script. It is responsible for applying all filters
     * by generating new Google search URLs with the appropriate parameters and then
     * navigating the browser to them. It handles a variety of URL parameters, including
     * the complex `tbs` parameter and query-modifying operators like `site:`.
     */
    const URLActionManager = (function() {
        function _getURLObject() { try { return new URL(window.location.href); } catch (e) { console.error(`${LOG_PREFIX} Error creating URL object: `, e); return null; }}
        function _navigateTo(url) { window.location.href = url.toString(); }
        function _setSearchParam(urlObj, paramName, value) { urlObj.searchParams.set(paramName, value); }
        function _deleteSearchParam(urlObj, paramName) { urlObj.searchParams.delete(paramName); }
        function _getTbsParts(urlObj) { const tbs = urlObj.searchParams.get('tbs'); return tbs ? tbs.split(',').filter(p => p.trim() !== '') : []; }
        function _setTbsParam(urlObj, tbsPartsArray) { const newTbsValue = tbsPartsArray.join(','); if (newTbsValue) { _setSearchParam(urlObj, 'tbs', newTbsValue); } else { _deleteSearchParam(urlObj, 'tbs'); }}

        /**
         * A generic function to generate a new URL based on a modification function.
         * @param {Function} urlModifier - A function that takes a URL object and modifies it.
         * @returns {string|null} The string representation of the modified URL, or null on error.
         */
        function generateURL(urlModifier) {
            try {
                const u = _getURLObject();
                if (!u) return null;
                urlModifier(u);
                return u.toString();
            } catch (e) {
                console.error(`${LOG_PREFIX} Error generating URL:`, e);
                return null;
            }
        }

        const publicApi = {
            generateURLObject: _getURLObject,
            generateResetFiltersURL: function() {
                return generateURL(u => {
                    const q = u.searchParams.get('q') || '';
                    const nP = new URLSearchParams();
                    // Clean both site and filetype operators
                    let cQ = Utils._cleanQueryByOperator(q, 'site');
                    cQ = Utils._cleanQueryByOperator(cQ, 'filetype');

                    if (cQ) { nP.set('q', cQ); }
                    u.search = nP.toString();
                    _deleteSearchParam(u, 'tbs'); _deleteSearchParam(u, 'lr'); _deleteSearchParam(u, 'cr');
                    _deleteSearchParam(u, 'as_filetype'); _deleteSearchParam(u, 'as_occt');
                });
            },
            generateToggleVerbatimURL: function() {
                return generateURL(u => {
                    let tP = _getTbsParts(u);
                    const vP = 'li:1';
                    const iCA = tP.includes(vP);
                    tP = tP.filter(p => p !== vP);
                    if (!iCA) { tP.push(vP); }
                    _setTbsParam(u, tP);
                });
            },
            generateTogglePersonalizationURL: function() {
                return generateURL(u => {
                    const isActive = publicApi.isPersonalizationActive();
                    if (isActive) { _setSearchParam(u, 'pws', '0'); }
                    else { _deleteSearchParam(u, 'pws'); }
                });
            },
            generateFilterURL: function(type, value) {
                return generateURL(u => {
                    let tbsParts = _getTbsParts(u);
                    const isTimeFilter = type === 'qdr';
                    const isStandaloneParam = ['lr', 'cr', 'as_occt'].includes(type);

                    if (isTimeFilter) {
                        let processedTbsParts = tbsParts.filter(p => !p.startsWith(`qdr:`) && !p.startsWith('cdr:') && !p.startsWith('cd_min:') && !p.startsWith('cd_max:'));
                        if (value !== '') processedTbsParts.push(`qdr:${value}`);
                        _setTbsParam(u, processedTbsParts);
                    } else if (isStandaloneParam) {
                        _deleteSearchParam(u, type);
                        if (value !== '' && !(type === 'as_occt' && value === 'any')) {
                            _setSearchParam(u, type, value);
                        }
                    } else if (type === 'as_filetype') {
                        let currentQuery = u.searchParams.get('q') || '';
                        // MODIFIED: Only clean 'filetype:' operators
                        currentQuery = Utils._cleanQueryByOperator(currentQuery, 'filetype');

                        if (value !== '') {
                            _setSearchParam(u, 'q', (currentQuery + ` filetype:${value}`).trim());
                        } else {
                            if (currentQuery) _setSearchParam(u, 'q', currentQuery);
                            else _deleteSearchParam(u, 'q');
                        }
                        _deleteSearchParam(u, 'as_filetype');
                    }
                });
            },
            generateSiteSearchURL: function(siteCriteria) {
                return generateURL(u => {
                    const sitesToSearch = Array.isArray(siteCriteria) ? siteCriteria.flatMap(sc => Utils.parseCombinedValue(sc)) : Utils.parseCombinedValue(siteCriteria);
                    const uniqueSites = [...new Set(sitesToSearch.map(s => s.toLowerCase()))];
                    if (uniqueSites.length === 0) return;
                    let q = u.searchParams.get('q') || '';
                    // MODIFIED: Only clean 'site:' operators
                    q = Utils._cleanQueryByOperator(q, 'site');
                    let siteQueryPart = uniqueSites.map(s => `site:${s}`).join(' OR ');
                    const nQ = `${q} ${siteQueryPart}`.trim();
                    _setSearchParam(u, 'q', nQ);
                    // Clear other filters that conflict with site search
                    _deleteSearchParam(u, 'cr'); _deleteSearchParam(u, 'as_filetype');
                });
            },
            generateCombinedFiletypeSearchURL: function(filetypeCriteria) {
                 return generateURL(u => {
                    const filetypesToSearch = Array.isArray(filetypeCriteria) ? filetypeCriteria.flatMap(fc => Utils.parseCombinedValue(fc)) : Utils.parseCombinedValue(filetypeCriteria);
                    const uniqueFiletypes = [...new Set(filetypesToSearch.map(f => f.toLowerCase()))];
                    if (uniqueFiletypes.length === 0) return;
                    let q = u.searchParams.get('q') || '';
                    // MODIFIED: Only clean 'filetype:' operators
                    q = Utils._cleanQueryByOperator(q, 'filetype');
                    let filetypeQueryPart = uniqueFiletypes.map(ft => `filetype:${ft}`).join(' OR ');
                    const nQ = `${q} ${filetypeQueryPart}`.trim();
                    _setSearchParam(u, 'q', nQ);
                    _deleteSearchParam(u, 'as_filetype');
                });
            },
            generateClearSiteSearchURL: function() {
                return generateURL(u => {
                    const q = u.searchParams.get('q') || '';
                    // MODIFIED: Only clean 'site:' operators
                    let nQ = Utils._cleanQueryByOperator(q, 'site');
                    if (nQ) { _setSearchParam(u, 'q', nQ); } else { _deleteSearchParam(u, 'q'); }
                });
            },
            generateClearFiletypeSearchURL: function() {
                 return generateURL(u => {
                    let q = u.searchParams.get('q') || '';
                    // MODIFIED: Only clean 'filetype:' operators
                    q = Utils._cleanQueryByOperator(q, 'filetype');
                    if (q) { _setSearchParam(u, 'q', q); } else { _deleteSearchParam(u, 'q'); }
                    _deleteSearchParam(u, 'as_filetype');
                });
            },
            generateDateRangeURL: function(dateMinStr, dateMaxStr) {
                return generateURL(u => {
                    let dateTbsPart = 'cdr:1';
                    if (dateMinStr) { const [y, m, d] = dateMinStr.split('-'); dateTbsPart += `,cd_min:${m}/${d}/${y}`; }
                    if (dateMaxStr) { const [y, m, d] = dateMaxStr.split('-'); dateTbsPart += `,cd_max:${m}/${d}/${y}`; }
                    let tbsParts = _getTbsParts(u);
                    let preservedTbsParts = tbsParts.filter(p => !p.startsWith('qdr:') && !p.startsWith('cdr:') && !p.startsWith('cd_min:') && !p.startsWith('cd_max:'));
                    let newTbsParts = [...preservedTbsParts, dateTbsPart];
                    _setTbsParam(u, newTbsParts);
                });
            },
            triggerResetFilters: function() {
                const url = publicApi.generateResetFiltersURL();
                if(url) _navigateTo(url);
                else NotificationManager.show('alert_error_resetting_filters', {}, 'error', 5000);
            },
            triggerToggleVerbatim: function() {
                const url = publicApi.generateToggleVerbatimURL();
                if(url) _navigateTo(url);
                else NotificationManager.show('alert_error_toggling_verbatim', {}, 'error', 5000);
            },
            triggerTogglePersonalization: function() {
                const url = publicApi.generateTogglePersonalizationURL();
                if (url) _navigateTo(url);
                else NotificationManager.show('alert_error_toggling_personalization', {}, 'error', 5000);
            },
            applyFilter: function(type, value) {
                if (type === 'as_filetype' && Utils.parseCombinedValue(value).length > 1) {
                    publicApi.applyCombinedFiletypeSearch(value);
                    return;
                }
                const url = publicApi.generateFilterURL(type, value);
                if (url) _navigateTo(url);
                else NotificationManager.show('alert_error_applying_filter', { type, value }, 'error', 5000);
            },
            applySiteSearch: function(siteCriteria) {
                const url = publicApi.generateSiteSearchURL(siteCriteria);
                if (url) _navigateTo(url);
                else {
                    const siteForError = Array.isArray(siteCriteria) ? siteCriteria.join(', ') : siteCriteria;
                    NotificationManager.show('alert_error_applying_site_search', { site: siteForError }, 'error', 5000);
                }
            },
            applyCombinedFiletypeSearch: function(filetypeCriteria) {
                const url = publicApi.generateCombinedFiletypeSearchURL(filetypeCriteria);
                if (url) _navigateTo(url);
                else {
                    const ftForError = Array.isArray(filetypeCriteria) ? filetypeCriteria.join(', ') : filetypeCriteria;
                    NotificationManager.show('alert_error_applying_filter', { type: 'filetype (combined)', value: ftForError }, 'error', 5000);
                }
            },
            clearSiteSearch: function() {
                const url = publicApi.generateClearSiteSearchURL();
                if(url) _navigateTo(url);
                else NotificationManager.show('alert_error_clearing_site_search', {}, 'error', 5000);
            },
            clearFiletypeSearch: function() {
                const url = publicApi.generateClearFiletypeSearchURL();
                if (url) _navigateTo(url);
                else NotificationManager.show('alert_error_applying_filter', { type: 'filetype', value: '(clear)' }, 'error', 5000);
            },
            applyDateRange: function(dateMinStr, dateMaxStr) {
                const url = publicApi.generateDateRangeURL(dateMinStr, dateMaxStr);
                if(url) _navigateTo(url);
                else NotificationManager.show('alert_error_applying_date', {}, 'error', 5000);
            },
            isPersonalizationActive: function() { try { const u = _getURLObject(); return u ? u.searchParams.get('pws') !== '0' : true; } catch(e) { console.warn(`${LOG_PREFIX} [URLActionManager.isPersonalizationActive] Error:`, e); return true; }},
            isVerbatimActive: function() { try { const u = _getURLObject(); return u ? /li:1/.test(u.searchParams.get('tbs') || '') : false; } catch (e) { console.warn(`${LOG_PREFIX} Error checking verbatim status:`, e); return false; }},
        };
        return publicApi;
    })();

    /**
     * Injects the script's CSS styles into the page.
     * It relies on the companion style script to populate `window.GSCS_Namespace.stylesText`.
     */
    function addGlobalStyles() { if (typeof window.GSCS_Namespace !== 'undefined' && typeof window.GSCS_Namespace.stylesText === 'string') { const cleanedCSS = window.GSCS_Namespace.stylesText.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1').replace(/\n\s*\n/g, '\n'); GM_addStyle(cleanedCSS); } else { console.error(`${LOG_PREFIX} CRITICAL: CSS styles provider not found.`); if (typeof IDS !== 'undefined' && IDS.SIDEBAR) { GM_addStyle(`#${IDS.SIDEBAR} { border: 3px dashed red !important; padding: 15px !important; background: white !important; color: red !important; } #${IDS.SIDEBAR}::before { content: "Error: CSS Missing!"; }`);} } }

    /**
     * Sets up a listener to detect changes in the system's color scheme (light/dark mode).
     * This allows the sidebar to automatically update its theme when the user's system theme changes,
     * provided the "Follow System" theme option is selected.
     */
    function setupSystemThemeListener() { if (systemThemeMediaQuery && systemThemeMediaQuery._sidebarThemeListener) { try { systemThemeMediaQuery.removeEventListener('change', systemThemeMediaQuery._sidebarThemeListener); } catch (e) {} systemThemeMediaQuery._sidebarThemeListener = null; } if (window.matchMedia) { systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); const listener = () => { const cs = SettingsManager.getCurrentSettings(); if (sidebar && cs.theme === 'system') { applyThemeToElement(sidebar, 'system'); } }; systemThemeMediaQuery.addEventListener('change', listener); systemThemeMediaQuery._sidebarThemeListener = listener; } }

    /**
     * Builds the basic HTML structure (skeleton) for the sidebar and injects it into the page.
     * This initial structure includes the header with collapse, drag, and settings buttons.
     */
    function buildSidebarSkeleton() { sidebar = document.createElement('div'); sidebar.id = IDS.SIDEBAR; const header = document.createElement('div'); header.classList.add(CSS.SIDEBAR_HEADER); const collapseBtn = document.createElement('button'); collapseBtn.id = IDS.COLLAPSE_BUTTON; collapseBtn.innerHTML = SVG_ICONS.chevronLeft; collapseBtn.title = _('sidebar_collapse_title'); const dragHandle = document.createElement('div'); dragHandle.classList.add(CSS.DRAG_HANDLE); dragHandle.title = _('sidebar_drag_title'); const settingsBtn = document.createElement('button'); settingsBtn.id = IDS.SETTINGS_BUTTON; settingsBtn.classList.add(CSS.SETTINGS_BUTTON); settingsBtn.innerHTML = SVG_ICONS.settings; settingsBtn.title = _('sidebar_settings_title'); header.appendChild(collapseBtn); header.appendChild(dragHandle); header.appendChild(settingsBtn); sidebar.appendChild(header); document.body.appendChild(sidebar); }

    /**
     * Applies all visual settings (position, dimensions, theme, colors, etc.) to the sidebar element.
     * This function is called whenever a relevant setting is changed.
     * @param {Object} [settingsToApply] - The settings object to apply. If not provided, it uses the current settings.
     */
    function applySettings(settingsToApply) {
        if (!sidebar) return;
        const currentSettings = settingsToApply || SettingsManager.getCurrentSettings();
        let targetTop = currentSettings.sidebarPosition.top;
        targetTop = Math.max(MIN_SIDEBAR_TOP_POSITION, targetTop);
        sidebar.style.left = `${currentSettings.sidebarPosition.left}px`;
        sidebar.style.top = `${targetTop}px`;
        sidebar.style.setProperty('--sidebar-font-base-size', `${currentSettings.fontSize}px`);
        sidebar.style.setProperty('--sidebar-header-icon-base-size', `${currentSettings.headerIconSize}px`);
        sidebar.style.setProperty('--sidebar-spacing-multiplier', currentSettings.verticalSpacingMultiplier);
        sidebar.style.setProperty('--sidebar-max-height', `${currentSettings.sidebarHeight}vh`);
        if (!currentSettings.sidebarCollapsed) { sidebar.style.width = `${currentSettings.sidebarWidth}px`; }
        else { sidebar.style.width = '40px';}
        applyThemeToElement(sidebar, currentSettings.theme);
        if (sidebar._hoverListeners) { sidebar.removeEventListener('mouseenter', sidebar._hoverListeners.enter); sidebar.removeEventListener('mouseleave', sidebar._hoverListeners.leave); sidebar._hoverListeners = null; sidebar.style.opacity = '1';}
        if (currentSettings.hoverMode && !currentSettings.sidebarCollapsed) { const idleOpacityValue = currentSettings.idleOpacity; sidebar.style.opacity = idleOpacityValue.toString(); const enterL = () => { if (!currentSettings.sidebarCollapsed) sidebar.style.opacity = '1'; }; const leaveL = () => { if (!currentSettings.sidebarCollapsed) sidebar.style.opacity = idleOpacityValue.toString(); }; sidebar.addEventListener('mouseenter', enterL); sidebar.addEventListener('mouseleave', leaveL); sidebar._hoverListeners = { enter: enterL, leave: leaveL }; }
        else { sidebar.style.opacity = '1'; }
        applySidebarCollapseVisuals(currentSettings.sidebarCollapsed);

        const colors = currentSettings.customColors;
        COLOR_MAPPINGS.forEach(map => {
            map.cssVars.forEach(cssVar => {
                if (colors[map.key]) {
                    sidebar.style.setProperty(cssVar, colors[map.key]);
                } else {
                    sidebar.style.removeProperty(cssVar);
                }
            });
        });

        sidebar.classList.remove('scrollbar-left', 'scrollbar-hidden');
        if (currentSettings.scrollbarPosition === 'left') {
            sidebar.classList.add('scrollbar-left');
        } else if (currentSettings.scrollbarPosition === 'hidden') {
            sidebar.classList.add('scrollbar-hidden');
        }

        const googleLogo = document.querySelector('#logo');
        if (googleLogo) {
            if (currentSettings.hideGoogleLogoWhenExpanded && !currentSettings.sidebarCollapsed) {
                googleLogo.style.visibility = 'hidden';
            } else {
                googleLogo.style.visibility = 'visible';
            }
        }

        ResultStatsManager.toggle(currentSettings.showResultStats);
    }
	
    /**
     * Parses a time filter value (e.g., 'h', 'd2', 'w') into a comparable number of minutes.
     * This is used for sorting time filter options logically.
     * @private
     * @param {string} timeValue - The time value string.
     * @returns {number} The equivalent number of minutes, or Infinity for invalid/any-time values.
     */
    function _parseTimeValueToMinutes(timeValue) { if (!timeValue || typeof timeValue !== 'string') return Infinity; const match = timeValue.match(/^([hdwmy])(\d*)$/i); if (!match) return Infinity; const unit = match[1].toLowerCase(); const number = parseInt(match[2] || '1', 10); if (isNaN(number)) return Infinity; switch (unit) { case 'h': return number * 60; case 'd': return number * 24 * 60; case 'w': return number * 7 * 24 * 60; case 'm': return number * 30 * 24 * 60; case 'y': return number * 365 * 24 * 60; default: return Infinity; } }

    /**
     * Prepares and sorts the final list of filter options to be displayed in a section.
     * It combines script-defined options, predefined user-enabled options, and custom user-added options.
     * @private
     * @param {string} sectionId - The ID of the section being prepared.
     * @param {Object[]} scriptDefinedOptions - Options hardcoded in the script (e.g., "Any Time").
     * @param {Object} currentSettings - The current settings object.
     * @param {Object} predefinedOptionsSource - A reference to the PREDEFINED_OPTIONS object.
     * @returns {Object[]} The final, sorted array of option objects to be rendered.
     */
    function _prepareFilterOptions(sectionId, scriptDefinedOptions, currentSettings, predefinedOptionsSource) {
        const finalOptions = [];
        const tempAddedValues = new Set();
        const sectionDef = ALL_SECTION_DEFINITIONS.find(s => s.id === sectionId);
        if (!sectionDef) return [];

        const isSortableMixedType = sectionDef.displayItemsKey && Array.isArray(currentSettings[sectionDef.displayItemsKey]);
        const isFiletypeCheckboxModeActive = sectionId === 'sidebar-section-filetype' && currentSettings.enableFiletypeCheckboxMode;
        const isSiteCheckboxModeActive = sectionId === 'sidebar-section-site-search' && currentSettings.enableSiteSearchCheckboxMode;
        const isOccurrenceSection = sectionId === 'sidebar-section-occurrence';

        if (scriptDefinedOptions) {
            scriptDefinedOptions.forEach(opt => {
                if (opt && typeof opt.textKey === 'string' && typeof opt.v === 'string') {
                    if (isOccurrenceSection) {
                        const translatedText = _(opt.textKey);
                        finalOptions.push({ text: translatedText, value: opt.v, originalText: translatedText, isCustom: false, isAnyOption: (opt.v === '') });
                        tempAddedValues.add(opt.v);
                    } else if (opt.v === '') {
                        if (!((isFiletypeCheckboxModeActive && sectionId === 'sidebar-section-filetype') ||
                              (isSiteCheckboxModeActive && sectionId === 'sidebar-section-site-search'))) {
                            const translatedText = (sectionId === 'sidebar-section-site-search') ? _('filter_any_site') : _(opt.textKey);
                            finalOptions.push({ text: translatedText, value: opt.v, originalText: translatedText, isCustom: false, isAnyOption: true });
                            tempAddedValues.add(opt.v);
                        }
                    }
                }
            });
        }
        if (isOccurrenceSection) return finalOptions;

        if (isSortableMixedType) {
            const displayItems = currentSettings[sectionDef.displayItemsKey] || [];
            displayItems.forEach(item => {
                if (!tempAddedValues.has(item.value)) {
                    let displayText = item.text;
                    if (item.type === 'predefined' && item.originalKey) {
                        displayText = _(item.originalKey);
                        if (sectionId === 'sidebar-section-country') {
                            const parsed = Utils.parseIconAndText(displayText);
                            displayText = `${parsed.icon} ${parsed.text}`.trim();
                        }
                    }
                    finalOptions.push({ text: displayText, value: item.value, originalText: displayText, isCustom: item.type === 'custom' });
                    tempAddedValues.add(item.value);
                }
            });
        } else {
            const predefinedKey = sectionDef.predefinedOptionsKey;
            const customKey = sectionDef.customItemsKey;
            const predefinedOptsFromSource = predefinedOptionsSource && predefinedKey ? (predefinedOptionsSource[predefinedKey] || []) : [];
            const customOptsFromSettings = customKey ? (currentSettings[customKey] || []) : [];
            let enabledPredefinedSystemVals;

            if (isFiletypeCheckboxModeActive && sectionId === 'sidebar-section-filetype') {
                enabledPredefinedSystemVals = currentSettings.enabledPredefinedOptions[predefinedKey] || [];
            } else {
                enabledPredefinedSystemVals = predefinedKey ? (currentSettings.enabledPredefinedOptions[predefinedKey] || []) : [];
            }

            const itemsForThisSection = [];
            const enabledSet = new Set(enabledPredefinedSystemVals);

            if (Array.isArray(predefinedOptsFromSource)) {
                predefinedOptsFromSource.forEach(opt => {
                    if (opt && typeof opt.textKey === 'string' && typeof opt.value === 'string' && enabledSet.has(opt.value) && !tempAddedValues.has(opt.value)) {
                        const translatedText = _(opt.textKey);
                        itemsForThisSection.push({ text: translatedText, value: opt.value, originalText: translatedText, isCustom: false });
                    }
                });
            }

            const validCustomOptions = Array.isArray(customOptsFromSettings) ? customOptsFromSettings.filter(cOpt => cOpt && typeof cOpt.text === 'string' && typeof cOpt.value === 'string') : [];
            validCustomOptions.forEach(opt => {
                if (!tempAddedValues.has(opt.value)){
                    itemsForThisSection.push({ text: opt.text, value: opt.value, originalText: opt.text, isCustom: true });
                }
            });

            itemsForThisSection.forEach(opt => {
                 if (!tempAddedValues.has(opt.value)){
                    finalOptions.push(opt);
                    tempAddedValues.add(opt.value);
                }
            });
        }

        if (scriptDefinedOptions && !isOccurrenceSection) {
            scriptDefinedOptions.forEach(opt => {
                if (opt && typeof opt.textKey === 'string' && typeof opt.v === 'string' && opt.v !== '' && !tempAddedValues.has(opt.v)) {
                    const translatedText = _(opt.textKey);
                    finalOptions.push({ text: translatedText, value: opt.v, originalText: translatedText, isCustom: false });
                    tempAddedValues.add(opt.v);
                }
            });
        }

        if (!isSortableMixedType && !isOccurrenceSection) {
            let anyOptionToSortSeparately = null;
            const anyOptionIdx = finalOptions.findIndex(opt => opt.isAnyOption === true);

            if (anyOptionIdx !== -1) {
                anyOptionToSortSeparately = finalOptions.splice(anyOptionIdx, 1)[0];
            }

            finalOptions.sort((a, b) => {
                const isTimeSection = (sectionId === 'sidebar-section-time');
                if (isTimeSection) {
                    const timeA = _parseTimeValueToMinutes(a.value);
                    const timeB = _parseTimeValueToMinutes(b.value);
                    if (timeA !== Infinity || timeB !== Infinity) {
                        if (timeA !== timeB) return timeA - timeB;
                    }
                }
                const sTA = a.originalText || a.text;
                const sTB = b.originalText || b.text;
                const sL = LocalizationService.getCurrentLocale() === 'en' ? undefined : LocalizationService.getCurrentLocale();
                return sTA.localeCompare(sTB, sL, { numeric: true, sensitivity: 'base' });
            });

            if (anyOptionToSortSeparately) {
                finalOptions.unshift(anyOptionToSortSeparately);
            }
        }
        return finalOptions;
    }

    /**
     * Creates a DOM element for a single filter option.
     * @private
     * @param {Object} optionData - The data for the option.
     * @param {string} filterParam - The URL parameter this option controls.
     * @param {boolean} isCountrySection - Flag indicating if this is for the country section (for special icon handling).
     * @param {string} countryDisplayMode - The current display mode for countries.
     * @returns {HTMLElement} The created option element.
     */
    function _createFilterOptionElement(optionData, filterParam, isCountrySection, countryDisplayMode) { const optionElement = document.createElement('div'); optionElement.classList.add(CSS.FILTER_OPTION); const displayText = optionData.text; if (isCountrySection) { const { icon, text: countryTextOnly } = Utils.parseIconAndText(displayText); switch (countryDisplayMode) { case 'textOnly': optionElement.textContent = countryTextOnly || displayText; break; case 'iconOnly': if (icon) { optionElement.innerHTML = `<span class="country-icon-container">${icon}</span>`; } else { optionElement.textContent = countryTextOnly || displayText; } break; case 'iconAndText': default: if (icon) { const textPart = countryTextOnly || displayText.substring(icon.length).trim(); optionElement.innerHTML = `<span class="country-icon-container">${icon}</span>${textPart}`; } else { optionElement.textContent = displayText; } break; } } else { optionElement.textContent = displayText; } optionElement.title = `${displayText} (${filterParam}=${optionData.value || _('filter_clear_tooltip_suffix')})`; optionElement.dataset[DATA_ATTR.FILTER_TYPE] = filterParam; optionElement.dataset[DATA_ATTR.FILTER_VALUE] = optionData.value; return optionElement; }

    /**
     * The main function for building or rebuilding the entire sidebar UI based on current settings.
     * It clears the existing content and dynamically creates all visible sections and controls in the correct order.
     */
    function buildSidebarUI() { if (!sidebar) { console.error("Sidebar element not ready for buildSidebarUI"); return; } const currentSettings = SettingsManager.getCurrentSettings(); const header = sidebar.querySelector(`.${CSS.SIDEBAR_HEADER}`); if (!header) { console.error("Sidebar header not found in buildSidebarUI"); return; } sidebar.querySelectorAll(`#${IDS.FIXED_TOP_BUTTONS}, .${CSS.SIDEBAR_CONTENT_WRAPPER}`).forEach(el => el.remove()); header.querySelectorAll(`.${CSS.HEADER_BUTTON}:not(#${IDS.SETTINGS_BUTTON}):not(#${IDS.COLLAPSE_BUTTON}), a.${CSS.HEADER_BUTTON}`).forEach(el => el.remove()); const rBL = currentSettings.resetButtonLocation; const vBL = currentSettings.verbatimButtonLocation; const aSL = currentSettings.advancedSearchLinkLocation; const pznBL = currentSettings.personalizationButtonLocation; const schL = currentSettings.googleScholarShortcutLocation; const trnL = currentSettings.googleTrendsShortcutLocation; const dsL = currentSettings.googleDatasetSearchShortcutLocation; const settingsButtonRef = header.querySelector(`#${IDS.SETTINGS_BUTTON}`); _buildSidebarHeaderControls(header, settingsButtonRef, rBL, vBL, aSL, pznBL, schL, trnL, dsL, currentSettings); const fixedTopControlsContainer = _buildSidebarFixedTopControls(rBL, vBL, aSL, pznBL, schL, trnL, dsL, currentSettings); if (fixedTopControlsContainer) { header.after(fixedTopControlsContainer); } const contentWrapper = document.createElement('div'); contentWrapper.classList.add(CSS.SIDEBAR_CONTENT_WRAPPER); const sectionDefinitionsMap = new Map(ALL_SECTION_DEFINITIONS.map(def => [def.id, def])); const sectionsFragment = _buildSidebarSections(sectionDefinitionsMap, rBL, vBL, aSL, pznBL, schL, trnL, dsL, currentSettings, PREDEFINED_OPTIONS); contentWrapper.appendChild(sectionsFragment); sidebar.appendChild(contentWrapper); _initializeSidebarEventListenersAndStates(); }

    /**
     * Builds all the individual section elements for the sidebar.
     * @private
     * @returns {DocumentFragment} A document fragment containing all the generated section elements.
     */
    function _buildSidebarSections(sectionDefinitionMap, rBL, vBL, aSL, pznBL, schL, trnL, dsL, currentSettings, PREDEFINED_OPTIONS_REF) { const contentFragment = document.createDocumentFragment(); currentSettings.sidebarSectionOrder.forEach(sectionId => { if (!currentSettings.visibleSections[sectionId]) return; const sectionData = sectionDefinitionMap.get(sectionId); if (!sectionData) { console.warn(`${LOG_PREFIX} No definition for section ID: ${sectionId}`); return; } let sectionElement = null; const sectionTitleKey = sectionData.titleKey; const sectionIdForDisplay = sectionData.id; switch (sectionData.type) { case 'filter': sectionElement = createFilterSection(sectionIdForDisplay, sectionTitleKey, sectionData.scriptDefined, sectionData.param, currentSettings, PREDEFINED_OPTIONS_REF, currentSettings.countryDisplayMode); break; case 'filetype': sectionElement = _createFiletypeSectionElement(sectionIdForDisplay, sectionTitleKey, sectionData.scriptDefined, sectionData.param, currentSettings, PREDEFINED_OPTIONS_REF); break; case 'date': sectionElement = _createDateSectionElement(sectionIdForDisplay, sectionTitleKey); break; case 'site': sectionElement = _createSiteSearchSectionElement(sectionIdForDisplay, sectionTitleKey, currentSettings); break; case 'tools': sectionElement = _createToolsSectionElement( sectionIdForDisplay, sectionTitleKey, rBL, vBL, aSL, pznBL, schL, trnL, dsL ); break; default: console.warn(`${LOG_PREFIX} Unknown section type: ${sectionData.type} for ID: ${sectionIdForDisplay}`); break; } if (sectionElement) contentFragment.appendChild(sectionElement); }); return contentFragment; }

    /**
     * Creates a filter section element with its options.
     * @param {string} id - The section's ID.
     * @param {string} titleKey - The localization key for the section title.
     * @param {Object[]} scriptDefinedOptions - Hardcoded options for this section.
     * @param {string} filterParam - The URL parameter this section controls.
     * @param {Object} currentSettings - The current settings object.
     * @param {Object} predefinedOptionsSource - The source of predefined options.
     * @param {string} countryDisplayMode - The display mode for countries.
     * @returns {HTMLElement|null} The created section element.
     */
    function createFilterSection(id, titleKey, scriptDefinedOptions, filterParam, currentSettings, predefinedOptionsSource, countryDisplayMode) { if (!sidebar) return null; const { section, sectionContent, sectionTitle } = _createSectionShell(id, titleKey); sectionTitle.textContent = _(titleKey); const fragment = document.createDocumentFragment(); const isCountrySection = (id === 'sidebar-section-country'); const combinedOptions = _prepareFilterOptions(id, scriptDefinedOptions, currentSettings, predefinedOptionsSource); combinedOptions.forEach(option => { fragment.appendChild(_createFilterOptionElement(option, filterParam, isCountrySection, countryDisplayMode)); }); sectionContent.innerHTML = ''; sectionContent.appendChild(fragment); if (!sectionContent.dataset.filterClickListenerAttached) { sectionContent.addEventListener('click', function(event) { const target = event.target.closest(`.${CSS.FILTER_OPTION}`); if (target && target.classList.contains(CSS.FILTER_OPTION)) { event.preventDefault(); const clickedFilterType = target.dataset[DATA_ATTR.FILTER_TYPE]; const clickedFilterValue = target.dataset[DATA_ATTR.FILTER_VALUE]; if (typeof clickedFilterType !== 'undefined' && typeof clickedFilterValue !== 'undefined') { this.querySelectorAll(`.${CSS.FILTER_OPTION}`).forEach(opt => opt.classList.remove(CSS.IS_SELECTED)); target.classList.add(CSS.IS_SELECTED); if (clickedFilterValue === '' || (clickedFilterType === 'as_occt' && clickedFilterValue === 'any') ) { const defaultVal = (clickedFilterType === 'as_occt') ? 'any' : ''; const anyOpt = this.querySelector(`.${CSS.FILTER_OPTION}[data-${DATA_ATTR.FILTER_VALUE}="${defaultVal}"]`); if (anyOpt) anyOpt.classList.add(CSS.IS_SELECTED); } URLActionManager.applyFilter(clickedFilterType, clickedFilterValue); } } }); sectionContent.dataset.filterClickListenerAttached = 'true'; } return section; }

    /**
     * Creates the "Site Search" section element.
     * @private
     * @param {string} sectionId - The section's ID.
     * @param {string} titleKey - The localization key for the section title.
     * @param {Object} currentSettings - The current settings object.
     * @returns {HTMLElement} The created section element.
     */
    function _createSiteSearchSectionElement(sectionId, titleKey, currentSettings) {
        const { section, sectionContent, sectionTitle } = _createSectionShell(sectionId, titleKey);
        sectionTitle.textContent = _(titleKey);
        populateSiteSearchList(sectionContent, currentSettings.favoriteSites, currentSettings.enableSiteSearchCheckboxMode, currentSettings.showFaviconsForSiteSearch);
        return section;
    }

    /**
     * Populates the content of the "Site Search" section. This function can be called
     * to rebuild the list when settings change.
     * @param {HTMLElement} sectionContentElement - The content element of the site search section.
     * @param {Object[]} favoriteSitesArray - The array of favorite sites from settings.
     * @param {boolean} checkboxModeEnabled - Whether checkbox mode is active.
     * @param {boolean} showFaviconsEnabled - Whether to show favicons.
     */
    function populateSiteSearchList(sectionContentElement, favoriteSitesArray, checkboxModeEnabled, showFaviconsEnabled) {
        if (!sectionContentElement) { console.error("Site search section content element missing"); return; }
        sectionContentElement.innerHTML = '';

        const sites = Array.isArray(favoriteSitesArray) ? favoriteSitesArray : [];
        const listFragment = document.createDocumentFragment();

        const clearOptDiv = document.createElement('div');
        clearOptDiv.classList.add(CSS.FILTER_OPTION);
        clearOptDiv.id = IDS.CLEAR_SITE_SEARCH_OPTION;
        clearOptDiv.title = _('tooltip_clear_site_search');
        clearOptDiv.textContent = _('filter_any_site');
        clearOptDiv.dataset[DATA_ATTR.FILTER_TYPE] = 'site_clear';
        sectionContentElement.appendChild(clearOptDiv);

        const listElement = document.createElement('ul');
        listElement.classList.add(CSS.CUSTOM_LIST);
        if (checkboxModeEnabled) {
            listElement.classList.add('checkbox-mode-enabled');
        }

        sites.forEach((site, index) => {
            if (site?.text && site?.url) {
                const li = document.createElement('li');
                const siteValue = site.url;
                const isGroup = siteValue.includes(' OR ');

                if (checkboxModeEnabled) {
                    const uniqueId = `site-cb-${index}-${Date.now()}`;
                    const checkbox = document.createElement('input');
                    checkbox.id = uniqueId;
                    checkbox.type = 'checkbox';
                    checkbox.value = siteValue;
                    checkbox.classList.add(CSS.CHECKBOX_SITE);
                    checkbox.dataset[DATA_ATTR.SITE_URL] = siteValue;
                    li.appendChild(checkbox);

                    const label = document.createElement('label');
                    label.htmlFor = uniqueId;
                    if (showFaviconsEnabled && !isGroup) {
                        const favicon = document.createElement('img');
                        favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${siteValue}`;
                        favicon.classList.add(CSS.FAVICON);
                        favicon.loading = 'lazy';
                        label.appendChild(favicon);
                    }
                    label.appendChild(document.createTextNode(site.text));
                    label.dataset[DATA_ATTR.SITE_URL] = siteValue;
                    label.title = _('tooltip_site_search', { siteUrl: siteValue.replace(/\s+OR\s+/gi, ', ') });
                    li.appendChild(label);
                } else {
                    const divOpt = document.createElement('div');
                    divOpt.classList.add(CSS.FILTER_OPTION);
                    if (showFaviconsEnabled && !isGroup) {
                        const favicon = document.createElement('img');
                        favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${siteValue}`;
                        favicon.classList.add(CSS.FAVICON);
                        favicon.loading = 'lazy';
                        divOpt.appendChild(favicon);
                    }
                    divOpt.appendChild(document.createTextNode(site.text));
                    divOpt.dataset[DATA_ATTR.SITE_URL] = siteValue;
                    divOpt.title = _('tooltip_site_search', { siteUrl: siteValue.replace(/\s+OR\s+/gi, ', ') });
                    li.appendChild(divOpt);
                }

                listFragment.appendChild(li);
            }
        });
        listElement.appendChild(listFragment);
        sectionContentElement.appendChild(listElement);

        if (checkboxModeEnabled) {
            let applyButton = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_SITES_BUTTON}`);
            if (!applyButton) {
                applyButton = document.createElement('button');
                applyButton.id = IDS.APPLY_SELECTED_SITES_BUTTON;
                applyButton.classList.add(CSS.BUTTON, CSS.BUTTON_APPLY_SITES);
                applyButton.textContent = _('tool_apply_selected_sites');
                sectionContentElement.appendChild(applyButton);
            }
            applyButton.disabled = true;
            applyButton.style.display = 'none';
        }

        // Use event delegation for site search interactions.
        if (!sectionContentElement.dataset.siteSearchListenerAttached) {
            sectionContentElement.dataset.siteSearchListenerAttached = 'true';
            sectionContentElement.addEventListener('click', (event) => {
                const target = event.target;
                const currentSettings = SettingsManager.getCurrentSettings();
                const isCheckboxMode = currentSettings.enableSiteSearchCheckboxMode;
                const clearSiteOpt = target.closest(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`);

                if (clearSiteOpt) {
                    URLActionManager.clearSiteSearch();
                    sectionContentElement.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}, label.${CSS.IS_SELECTED}`).forEach(o => o.classList.remove(CSS.IS_SELECTED));
                    clearSiteOpt.classList.add(CSS.IS_SELECTED);
                    if (isCheckboxMode) {
                        sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_SITE}`).forEach(cb => cb.checked = false);
                        _updateApplySitesButtonState(sectionContentElement);
                    }
                } else if (isCheckboxMode) {
                    const labelElement = target.closest('label');
                    if (labelElement && labelElement.dataset[DATA_ATTR.SITE_URL]) {
                        event.preventDefault();
                        const siteUrlOrCombined = labelElement.dataset[DATA_ATTR.SITE_URL];
                        sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_SITE}`).forEach(cb => {
                            const correspondingLabel = sectionContentElement.querySelector(`label[for="${cb.id}"]`);
                            cb.checked = (cb.value === siteUrlOrCombined);
                            if(correspondingLabel) correspondingLabel.classList.toggle(CSS.IS_SELECTED, cb.checked);
                        });
                        URLActionManager.applySiteSearch(siteUrlOrCombined);
                        _updateApplySitesButtonState(sectionContentElement);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                } else {
                    const siteOptionDiv = target.closest(`div.${CSS.FILTER_OPTION}:not(#${IDS.CLEAR_SITE_SEARCH_OPTION})`);
                    if (siteOptionDiv && siteOptionDiv.dataset[DATA_ATTR.SITE_URL]) {
                        const siteUrlOrCombined = siteOptionDiv.dataset[DATA_ATTR.SITE_URL];
                        sectionContentElement.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}`).forEach(o => o.classList.remove(CSS.IS_SELECTED));
                        URLActionManager.applySiteSearch(siteUrlOrCombined);
                        siteOptionDiv.classList.add(CSS.IS_SELECTED);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                }
            });

            sectionContentElement.addEventListener('change', (event) => {
                if (event.target.matches(`input[type="checkbox"].${CSS.CHECKBOX_SITE}`)) {
                    _updateApplySitesButtonState(sectionContentElement);
                    const label = sectionContentElement.querySelector(`label[for="${event.target.id}"]`);
                    if (label) label.classList.toggle(CSS.IS_SELECTED, event.target.checked);
                    if (event.target.checked) {
                        sectionContentElement.querySelector(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                }
            });

            const applyBtn = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_SITES_BUTTON}`);
            if(applyBtn && !applyBtn.dataset[DATA_ATTR.LISTENER_ATTACHED]){
                applyBtn.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true';
                applyBtn.addEventListener('click', () => {
                    const selectedValues = Array.from(sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_SITE}:checked`)).map(cb => cb.value);
                    if (selectedValues.length > 0) {
                        URLActionManager.applySiteSearch(selectedValues);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                });
            }
        }
    }

    /**
     * Creates the "File Type" section element.
     * @private
     * @param {string} sectionId - The section's ID.
     * @param {string} titleKey - The localization key for the section title.
     * @param {Object[]} scriptDefinedOptions - Hardcoded options for this section.
     * @param {string} filterParam - The URL parameter this section controls.
     * @param {Object} currentSettings - The current settings object.
     * @param {Object} predefinedOptionsSource - The source of predefined options.
     * @returns {HTMLElement} The created section element.
     */
    function _createFiletypeSectionElement(sectionId, titleKey, scriptDefinedOptions, filterParam, currentSettings, predefinedOptionsSource) {
        const { section, sectionContent, sectionTitle } = _createSectionShell(sectionId, titleKey);
        sectionTitle.textContent = _(titleKey);
        populateFiletypeList(sectionContent, scriptDefinedOptions, currentSettings, predefinedOptionsSource, filterParam);
        return section;
    }
	
    /**
     * Populates the content of the "File Type" section.
     * @param {HTMLElement} sectionContentElement - The content element of the file type section.
     * @param {Object[]} scriptDefinedOpts - Hardcoded options for this section.
     * @param {Object} currentSettings - The current settings object.
     * @param {Object} predefinedOptsSource - The source of predefined options.
     * @param {string} filterParam - The URL parameter this section controls.
     */
    function populateFiletypeList(sectionContentElement, scriptDefinedOpts, currentSettings, predefinedOptsSource, filterParam) {
        if (!sectionContentElement) { console.error("Filetype section content element missing"); return; }
        sectionContentElement.innerHTML = '';

        const checkboxModeEnabled = currentSettings.enableFiletypeCheckboxMode;
        const combinedOptions = _prepareFilterOptions('sidebar-section-filetype', scriptDefinedOpts, currentSettings, predefinedOptsSource);
        const listFragment = document.createDocumentFragment();

        const clearOptDiv = document.createElement('div');
        clearOptDiv.classList.add(CSS.FILTER_OPTION);
        clearOptDiv.id = IDS.CLEAR_FILETYPE_SEARCH_OPTION;
        clearOptDiv.title = _('filter_clear_tooltip_suffix');
        clearOptDiv.textContent = _('filter_any_format');
        clearOptDiv.dataset[DATA_ATTR.FILTER_TYPE] = 'filetype_clear';
        sectionContentElement.appendChild(clearOptDiv);

        const listElement = document.createElement('ul');
        listElement.classList.add(CSS.CUSTOM_LIST);
        if (checkboxModeEnabled) {
            listElement.classList.add('checkbox-mode-enabled');
        }

        combinedOptions.forEach((option, index) => {
            if (option.isAnyOption) return;

            const li = document.createElement('li');
            const filetypeValue = option.value;

            if (checkboxModeEnabled) {
                const checkbox = document.createElement('input');
                const uniqueId = `ft-cb-${index}-${Date.now()}`;
                checkbox.type = 'checkbox';
                checkbox.id = uniqueId;
                checkbox.value = filetypeValue;
                checkbox.classList.add(CSS.CHECKBOX_FILETYPE);
                checkbox.dataset[DATA_ATTR.FILETYPE_VALUE] = filetypeValue;
                li.appendChild(checkbox);

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.dataset[DATA_ATTR.FILETYPE_VALUE] = filetypeValue;
                label.title = `${option.text} (${filterParam}=${filetypeValue.replace(/\s+OR\s+/gi, ', ')})`;
                label.textContent = option.text;
                li.appendChild(label);
            } else {
                const divOpt = document.createElement('div');
                divOpt.classList.add(CSS.FILTER_OPTION);
                divOpt.dataset[DATA_ATTR.FILTER_TYPE] = filterParam;
                divOpt.dataset[DATA_ATTR.FILTER_VALUE] = filetypeValue;
                divOpt.title = `${option.text} (${filterParam}=${filetypeValue.replace(/\s+OR\s+/gi, ', ')})`;
                divOpt.textContent = option.text;
                li.appendChild(divOpt);
            }
            listFragment.appendChild(li);
        });
        listElement.appendChild(listFragment);
        sectionContentElement.appendChild(listElement);

        if (checkboxModeEnabled) {
            let applyButton = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_FILETYPES_BUTTON}`);
            if(!applyButton) {
                applyButton = document.createElement('button');
                applyButton.id = IDS.APPLY_SELECTED_FILETYPES_BUTTON;
                applyButton.classList.add(CSS.BUTTON, CSS.BUTTON_APPLY_FILETYPES);
                applyButton.textContent = _('tool_apply_selected_filetypes');
                sectionContentElement.appendChild(applyButton);
            }
            applyButton.disabled = true;
            applyButton.style.display = 'none';
        }

        // Use event delegation for filetype search interactions.
        if (!sectionContentElement.dataset.filetypeClickListenerAttached) {
            sectionContentElement.dataset.filetypeClickListenerAttached = 'true';
            sectionContentElement.addEventListener('click', (event) => {
                const target = event.target;
                const isCheckboxMode = SettingsManager.getCurrentSettings().enableFiletypeCheckboxMode;
                const clearFiletypeOpt = target.closest(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`);

                if (clearFiletypeOpt) {
                    URLActionManager.clearFiletypeSearch();
                    sectionContentElement.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}, label.${CSS.IS_SELECTED}`).forEach(o => o.classList.remove(CSS.IS_SELECTED));
                    clearFiletypeOpt.classList.add(CSS.IS_SELECTED);
                    if (isCheckboxMode) {
                        sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}`).forEach(cb => cb.checked = false);
                        _updateApplyFiletypesButtonState(sectionContentElement);
                    }
                } else if (isCheckboxMode) {
                    const labelElement = target.closest('label');
                    if (labelElement && labelElement.dataset[DATA_ATTR.FILETYPE_VALUE]) {
                        event.preventDefault();
                        const filetypeValueOrCombined = labelElement.dataset[DATA_ATTR.FILETYPE_VALUE];
                        sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}`).forEach(cb => {
                            const correspondingLabel = sectionContentElement.querySelector(`label[for="${cb.id}"]`);
                            cb.checked = (cb.value === filetypeValueOrCombined);
                             if(correspondingLabel) correspondingLabel.classList.toggle(CSS.IS_SELECTED, cb.checked);
                        });
                        URLActionManager.applyCombinedFiletypeSearch(filetypeValueOrCombined);
                        _updateApplyFiletypesButtonState(sectionContentElement);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                } else {
                    const optionDiv = target.closest(`div.${CSS.FILTER_OPTION}:not(#${IDS.CLEAR_FILETYPE_SEARCH_OPTION})`);
                    if (optionDiv && optionDiv.dataset[DATA_ATTR.FILTER_VALUE]) {
                        const clickedFilterType = optionDiv.dataset[DATA_ATTR.FILTER_TYPE];
                        const clickedFilterValueOrCombined = optionDiv.dataset[DATA_ATTR.FILTER_VALUE];
                        sectionContentElement.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}`).forEach(o => o.classList.remove(CSS.IS_SELECTED));
                        optionDiv.classList.add(CSS.IS_SELECTED);
                        URLActionManager.applyFilter(clickedFilterType, clickedFilterValueOrCombined);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                }
            });

            sectionContentElement.addEventListener('change', (event) => {
                if (event.target.matches(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}`)) {
                    _updateApplyFiletypesButtonState(sectionContentElement);
                    const label = sectionContentElement.querySelector(`label[for="${event.target.id}"]`);
                    if (label) label.classList.toggle(CSS.IS_SELECTED, event.target.checked);
                    if (event.target.checked) {
                        sectionContentElement.querySelector(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                }
            });

            const applyBtn = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_FILETYPES_BUTTON}`);
            if (applyBtn && !applyBtn.dataset[DATA_ATTR.LISTENER_ATTACHED]) {
                applyBtn.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true';
                applyBtn.addEventListener('click', () => {
                    const selectedValues = Array.from(sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}:checked`)).map(cb => cb.value);
                    if (selectedValues.length > 0) {
                        URLActionManager.applyCombinedFiletypeSearch(selectedValues);
                        sectionContentElement.querySelector(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`)?.classList.remove(CSS.IS_SELECTED);
                    }
                });
            }
        }
    }

    /**
     * Updates the state (enabled/disabled, visible/hidden) of the "Apply Selected" button
     * in the site search section based on how many checkboxes are checked.
     * @private
     * @param {HTMLElement} sectionContentElement - The content element of the site search section.
     */
    function _updateApplySitesButtonState(sectionContentElement) {
        if (!sectionContentElement) return;
        const applyButton = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_SITES_BUTTON}`);
        if (!applyButton) return;
        const checkedCount = sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_SITE}:checked`).length;
        applyButton.disabled = checkedCount === 0;
        applyButton.style.display = checkedCount > 0 ? 'inline-flex' : 'none';
    }

    /**
     * Updates the state of the "Apply Selected" button in the file type section.
     * @private
     * @param {HTMLElement} sectionContentElement - The content element of the file type section.
     */
    function _updateApplyFiletypesButtonState(sectionContentElement) {
        if (!sectionContentElement) return;
        const applyButton = sectionContentElement.querySelector(`#${IDS.APPLY_SELECTED_FILETYPES_BUTTON}`);
        if (!applyButton) return;
        const checkedCount = sectionContentElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}:checked`).length;
        applyButton.disabled = checkedCount === 0;
        applyButton.style.display = checkedCount > 0 ? 'inline-flex' : 'none';
    }
	
    /**
     * Renders the draggable list of sections in the "Features" tab of the settings window.
     * @param {Object} settingsRef - A reference to the current settings object.
     */
    function renderSectionOrderList(settingsRef) { const settingsWindowEl = document.getElementById(IDS.SETTINGS_WINDOW); const orderListElement = settingsWindowEl?.querySelector(`#${IDS.SIDEBAR_SECTION_ORDER_LIST}`); if (!orderListElement) return; orderListElement.innerHTML = ''; const currentSettings = settingsRef || SettingsManager.getCurrentSettings(); const visibleOrderedSections = currentSettings.sidebarSectionOrder.filter(id => currentSettings.visibleSections[id]); if (visibleOrderedSections.length === 0) { orderListElement.innerHTML = `<li><span style="font-style:italic;color:var(--settings-tab-color);">${_('settings_no_orderable_sections')}</span></li>`; return; } const fragment = document.createDocumentFragment(); visibleOrderedSections.forEach((sectionId) => { const definition = ALL_SECTION_DEFINITIONS.find(def => def.id === sectionId); const displayName = definition ? _(definition.titleKey) : sectionId; const listItem = document.createElement('li'); listItem.dataset.sectionId = sectionId; listItem.draggable = true; const dragIconSpan = document.createElement('span'); dragIconSpan.classList.add(CSS.DRAG_ICON); dragIconSpan.innerHTML = SVG_ICONS.dragGrip; listItem.appendChild(dragIconSpan); const nameSpan = document.createElement('span'); nameSpan.textContent = displayName; listItem.appendChild(nameSpan); fragment.appendChild(listItem); }); orderListElement.appendChild(fragment); }

    /**
     * Initializes the script's menu commands using `GM_registerMenuCommand`.
     * This adds "Open Settings" and "Reset All Settings" options to the Tampermonkey menu.
     */
    function _initMenuCommands() { if (typeof GM_registerMenuCommand === 'function') { const openSettingsText = _('menu_open_settings'); const resetAllText = _('menu_reset_all_settings'); if (typeof GM_unregisterMenuCommand === 'function') { try { GM_unregisterMenuCommand(openSettingsText); } catch (e) {} try { GM_unregisterMenuCommand(resetAllText);   } catch (e) {} } GM_registerMenuCommand(openSettingsText, SettingsManager.show.bind(SettingsManager)); GM_registerMenuCommand(resetAllText, SettingsManager.resetAllFromMenu.bind(SettingsManager)); } }

    /**
     * Creates the basic shell for a sidebar section (the section container, title, and content elements).
     * @private
     * @param {string} id - The ID for the main section element.
     * @param {string} titleKey - The localization key for the section's title.
     * @returns {{section: HTMLElement, sectionContent: HTMLElement, sectionTitle: HTMLElement}} An object containing the created elements.
     */
    function _createSectionShell(id, titleKey) { const section = document.createElement('div'); section.id = id; section.classList.add(CSS.SECTION); const sectionTitle = document.createElement('div'); sectionTitle.classList.add(CSS.SECTION_TITLE); sectionTitle.textContent = _(titleKey); section.appendChild(sectionTitle); const sectionContent = document.createElement('div'); sectionContent.classList.add(CSS.SECTION_CONTENT); section.appendChild(sectionContent); return { section, sectionContent, sectionTitle }; }

    /**
     * Creates the "Date Range" section element.
     * @private
     * @param {string} sectionId - The section's ID.
     * @param {string} titleKey - The localization key for the section title.
     * @returns {HTMLElement} The created section element.
     */
    function _createDateSectionElement(sectionId, titleKey) { const { section, sectionContent, sectionTitle } = _createSectionShell(sectionId, titleKey); sectionTitle.textContent = _(titleKey); const today = new Date(); const yyyy = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0'); const todayString = `${yyyy}-${mm}-${dd}`; sectionContent.innerHTML = `<label class="${CSS.DATE_INPUT_LABEL}" for="${IDS.DATE_MIN}">${_('date_range_from')}</label><input type="date" class="${CSS.DATE_INPUT_FIELD}" id="${IDS.DATE_MIN}" max="${todayString}"><label class="${CSS.DATE_INPUT_LABEL}" for="${IDS.DATE_MAX}">${_('date_range_to')}</label><input type="date" class="${CSS.DATE_INPUT_FIELD}" id="${IDS.DATE_MAX}" max="${todayString}"><span id="${IDS.DATE_RANGE_ERROR_MSG}" class="${CSS.DATE_RANGE_ERROR_MSG} ${CSS.INPUT_ERROR_MSG}"></span><button class="${CSS.BUTTON} apply-date-range">${_('tool_apply_date')}</button>`; return section; }

    /**
     * A factory function to create a standard button element used throughout the sidebar.
     * @private
     * @param {Object} options - The button's configuration.
     * @param {string|null} [options.id=null] - The ID for the button.
     * @param {string} options.className - The CSS class for the button.
     * @param {string} options.svgIcon - The SVG icon string.
     * @param {string|null} [options.textContent=null] - The text content for the button.
     * @param {string} options.title - The title attribute (tooltip) for the button.
     * @param {Function} options.clickHandler - The click event handler.
     * @param {boolean} [options.isActive=false] - Whether the button should be in an active state.
     * @returns {HTMLButtonElement} The created button element.
     */
    function _createStandardButton({ id = null, className, svgIcon, textContent = null, title, clickHandler, isActive = false }) { const button = document.createElement('button'); if (id) button.id = id; button.classList.add(className); if (isActive) button.classList.add(CSS.IS_ACTIVE); button.title = title; let content = svgIcon || ''; if (textContent) { content = svgIcon ? `${svgIcon} <span>${textContent}</span>` : `<span>${textContent}</span>`; } button.innerHTML = content.trim(); if (clickHandler) { if (!button.dataset[DATA_ATTR.LISTENER_ATTACHED]) { button.addEventListener('click', clickHandler); button.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; } } return button; }

    /**
     * Creates the Personalization toggle button.
     * @private
     * @param {('tools'|'header'|'topBlock')} [forLocation='tools'] - The location where the button will be placed.
     * @returns {HTMLButtonElement} The created button element.
     */
    function _createPersonalizationButtonHTML(forLocation = 'tools') { const personalizationActive = URLActionManager.isPersonalizationActive(); const isIconOnlyLocation = (forLocation === 'header'); const svgIcon = SVG_ICONS.personalization || ''; const displayText = !isIconOnlyLocation ? _('tool_personalization_toggle') : ''; const titleKey = personalizationActive ? 'tooltip_toggle_personalization_off' : 'tooltip_toggle_personalization_on'; return _createStandardButton({ id: IDS.TOOL_PERSONALIZE, className: (forLocation === 'header') ? CSS.HEADER_BUTTON : CSS.BUTTON, svgIcon: svgIcon, textContent: displayText, title: _(titleKey), clickHandler: () => URLActionManager.triggerTogglePersonalization(), isActive: personalizationActive }); }

    /**
     * Creates the "Advanced Search" link element.
     * @private
     * @param {boolean} [isButtonLike=false] - If true, styles the link to look like a button.
     * @returns {HTMLAnchorElement} The created anchor element.
     */
    function _createAdvancedSearchElementHTML(isButtonLike = false) { const el = document.createElement('a'); let iconHTML = SVG_ICONS.magnifyingGlass || ''; if (isButtonLike) { el.classList.add(CSS.BUTTON); el.innerHTML = `${iconHTML} <span>${_('tool_advanced_search')}</span>`; } else { el.classList.add(CSS.HEADER_BUTTON); el.innerHTML = iconHTML; } const baseUrl = "https://www.google.com/advanced_search"; let finalUrl = baseUrl; try { const currentFullUrl = Utils.getCurrentURL(); if (currentFullUrl) { const currentQuery = currentFullUrl.searchParams.get('q'); if (currentQuery) { let queryWithoutSite = Utils._cleanQueryByOperator(currentQuery, 'site'); queryWithoutSite = Utils._cleanQueryByOperator(queryWithoutSite, 'filetype'); if (queryWithoutSite) { finalUrl = `${baseUrl}?as_q=${encodeURIComponent(queryWithoutSite)}`; } } } } catch (e) { console.warn(`${LOG_PREFIX} Error constructing advanced search URL with query:`, e); } el.href = finalUrl; el.target = "_blank"; el.rel = "noopener noreferrer"; el.title = _('link_advanced_search_title'); return el; }

    /**
     * Creates a generic shortcut button for a specified Google service.
     * @private
     * @param {string} serviceId - The key for the service in SERVICE_SHORTCUT_CONFIG (e.g., 'googleScholar').
     * @param {('tools'|'header'|'topBlock')} [forLocation='tools'] - The location where the button will be placed.
     * @returns {HTMLButtonElement|null} The created button element, or null if config is not found.
     */
    function _createServiceShortcutButton(serviceId, forLocation = 'tools') {
        const config = SERVICE_SHORTCUT_CONFIG[serviceId];
        if (!config) {
            console.warn(`${LOG_PREFIX} No configuration found for service shortcut: ${serviceId}`);
            return null;
        }

        const isIconOnlyLocation = (forLocation === 'header');
        const displayText = !isIconOnlyLocation ? _(config.textKey) : '';

        // The click handler logic is now generic and reusable
        const clickHandler = () => {
            try {
                const currentUrl = Utils.getCurrentURL();
                if (currentUrl) {
                    const query = currentUrl.searchParams.get('q');
                    if (query) {
                        const serviceUrl = `${config.baseUrl}?${config.queryParam}=${encodeURIComponent(query)}`;
                        // Use GM_openInTab for better control, falling back to window.open
                        if (typeof GM_openInTab === 'function') {
                            GM_openInTab(serviceUrl, { active: true, insert: true });
                        } else {
                            window.open(serviceUrl, '_blank');
                        }
                    } else {
                        window.open(config.homepage, '_blank');
                        NotificationManager.show('alert_no_keywords_for_shortcut', { service_name: _(config.serviceNameKey) }, 'info');
                    }
                }
            } catch (e) {
                console.error(`${LOG_PREFIX} Error opening ${config.serviceNameKey}:`, e);
                NotificationManager.show('alert_error_opening_link', { service_name: _(config.serviceNameKey) }, 'error');
            }
        };

        return _createStandardButton({
            id: config.id,
            className: (forLocation === 'header') ? CSS.HEADER_BUTTON : CSS.BUTTON,
            svgIcon: config.svgIcon || '',
            textContent: displayText,
            title: _(config.titleKey),
            clickHandler: clickHandler
        });
    }

    /**
     * Builds and inserts the control buttons and links into the sidebar header.
     * @private
     */
    function _buildSidebarHeaderControls(headerEl, settingsBtnRef, rBL, vBL, aSL, pznBL, schL, trnL, dsL, settings) { const verbatimActive = URLActionManager.isVerbatimActive(); const buttonsInOrder = []; if (aSL === 'header' && settings.advancedSearchLinkLocation !== 'none') { buttonsInOrder.push(_createAdvancedSearchElementHTML(false)); } if (schL === 'header' && settings.googleScholarShortcutLocation !== 'none') { buttonsInOrder.push(_createServiceShortcutButton('googleScholar', 'header')); } if (trnL === 'header' && settings.googleTrendsShortcutLocation !== 'none') { buttonsInOrder.push(_createServiceShortcutButton('googleTrends', 'header')); } if (dsL === 'header' && settings.googleDatasetSearchShortcutLocation !== 'none') { buttonsInOrder.push(_createServiceShortcutButton('googleDatasetSearch', 'header')); } if (vBL === 'header' && settings.verbatimButtonLocation !== 'none') { buttonsInOrder.push(_createStandardButton({ id: IDS.TOOL_VERBATIM, className: CSS.HEADER_BUTTON, svgIcon: SVG_ICONS.verbatim, title: _('tool_verbatim_search'), clickHandler: URLActionManager.triggerToggleVerbatim, isActive: verbatimActive })); } if (pznBL === 'header' && settings.personalizationButtonLocation !== 'none') { buttonsInOrder.push(_createPersonalizationButtonHTML('header')); } if (rBL === 'header' && settings.resetButtonLocation !== 'none') { buttonsInOrder.push(_createStandardButton({ id: IDS.TOOL_RESET_BUTTON, className: CSS.HEADER_BUTTON, svgIcon: SVG_ICONS.reset, title: _('tool_reset_filters'), clickHandler: URLActionManager.triggerResetFilters })); } buttonsInOrder.forEach(btn => { if (btn && settingsBtnRef) { headerEl.insertBefore(btn, settingsBtnRef); } else if (btn) { headerEl.appendChild(btn); } }); }

    /**
     * Builds the container and controls for the "Top Block" area of the sidebar.
     * @private
     * @returns {HTMLElement|null} The created container element, or null if no controls are placed there.
     */
    function _buildSidebarFixedTopControls(rBL, vBL, aSL, pznBL, schL, trnL, dsL, currentSettings) { const fTBC = document.createElement('div'); fTBC.id = IDS.FIXED_TOP_BUTTONS; const fTF = document.createDocumentFragment(); const verbatimActive = URLActionManager.isVerbatimActive(); if (currentSettings.showResultStats) { ResultStatsManager.createContainer(fTF); } if (rBL === 'topBlock' && currentSettings.resetButtonLocation !== 'none') { const btn = _createStandardButton({ id: IDS.TOOL_RESET_BUTTON, className: CSS.BUTTON, svgIcon: SVG_ICONS.reset, textContent: _('tool_reset_filters'), title: _('tool_reset_filters'), clickHandler: URLActionManager.triggerResetFilters }); const bD = document.createElement('div'); bD.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bD.appendChild(btn); fTF.appendChild(bD); } if (pznBL === 'topBlock' && currentSettings.personalizationButtonLocation !== 'none') { const btnPzn = _createPersonalizationButtonHTML('topBlock'); const bDPzn = document.createElement('div'); bDPzn.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDPzn.appendChild(btnPzn); fTF.appendChild(bDPzn); } if (vBL === 'topBlock' && currentSettings.verbatimButtonLocation !== 'none') { const btnVerbatim = _createStandardButton({ id: IDS.TOOL_VERBATIM, className: CSS.BUTTON, svgIcon: SVG_ICONS.verbatim, textContent: _('tool_verbatim_search'), title: _('tool_verbatim_search'), clickHandler: URLActionManager.triggerToggleVerbatim, isActive: verbatimActive }); const bDVerbatim = document.createElement('div'); bDVerbatim.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDVerbatim.appendChild(btnVerbatim); fTF.appendChild(bDVerbatim); } if (aSL === 'topBlock' && currentSettings.advancedSearchLinkLocation !== 'none') { const linkEl = _createAdvancedSearchElementHTML(true); const bDAdv = document.createElement('div'); bDAdv.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDAdv.appendChild(linkEl); fTF.appendChild(bDAdv); } if (schL === 'topBlock' && currentSettings.googleScholarShortcutLocation !== 'none') { const btnSch = _createServiceShortcutButton('googleScholar', 'topBlock'); if (btnSch) { const bDSch = document.createElement('div'); bDSch.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDSch.appendChild(btnSch); fTF.appendChild(bDSch); } } if (trnL === 'topBlock' && currentSettings.googleTrendsShortcutLocation !== 'none') { const btnTrn = _createServiceShortcutButton('googleTrends', 'topBlock'); if (btnTrn) { const bDTrn = document.createElement('div'); bDTrn.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDTrn.appendChild(btnTrn); fTF.appendChild(bDTrn); } } if (dsL === 'topBlock' && currentSettings.googleDatasetSearchShortcutLocation !== 'none') { const btnDs = _createServiceShortcutButton('googleDatasetSearch', 'topBlock'); if (btnDs) { const bDDs = document.createElement('div'); bDDs.classList.add(CSS.FIXED_TOP_BUTTONS_ITEM); bDDs.appendChild(btnDs); fTF.appendChild(bDDs); } } if (fTF.childElementCount > 0) { fTBC.appendChild(fTF); return fTBC; } return null; }

    /**
     * Creates the "Tools" section element.
     * @private
     * @returns {HTMLElement|null} The created section element, or null if no tools are configured to be in this section.
     */
    function _createToolsSectionElement(sectionId, titleKey, rBL, vBL, aSL, pznBL, schL, trnL, dsL) { const { section, sectionContent, sectionTitle } = _createSectionShell(sectionId, titleKey); sectionTitle.textContent = _(titleKey); const frag = document.createDocumentFragment(); const verbatimActive = URLActionManager.isVerbatimActive(); const currentSettings = SettingsManager.getCurrentSettings(); if (rBL === 'tools' && currentSettings.resetButtonLocation !== 'none') { const btn = _createStandardButton({ id: IDS.TOOL_RESET_BUTTON, className: CSS.BUTTON, svgIcon: SVG_ICONS.reset, textContent: _('tool_reset_filters'), title: _('tool_reset_filters'), clickHandler: URLActionManager.triggerResetFilters }); frag.appendChild(btn); } if (pznBL === 'tools' && currentSettings.personalizationButtonLocation !== 'none') { const btnPzn = _createPersonalizationButtonHTML('tools'); frag.appendChild(btnPzn); } if (vBL === 'tools' && currentSettings.verbatimButtonLocation !== 'none') { const btnVerbatim = _createStandardButton({ id: IDS.TOOL_VERBATIM, className: CSS.BUTTON, svgIcon: SVG_ICONS.verbatim, textContent: _('tool_verbatim_search'), title: _('tool_verbatim_search'), clickHandler: URLActionManager.triggerToggleVerbatim, isActive: verbatimActive }); frag.appendChild(btnVerbatim); } if (aSL === 'tools' && currentSettings.advancedSearchLinkLocation !== 'none') { frag.appendChild(_createAdvancedSearchElementHTML(true)); } if (schL === 'tools' && currentSettings.googleScholarShortcutLocation !== 'none') { const btnSch = _createServiceShortcutButton('googleScholar', 'tools'); if (btnSch) frag.appendChild(btnSch); } if (trnL === 'tools' && currentSettings.googleTrendsShortcutLocation !== 'none') { const btnTrn = _createServiceShortcutButton('googleTrends', 'tools'); if (btnTrn) frag.appendChild(btnTrn); } if (dsL === 'tools' && currentSettings.googleDatasetSearchShortcutLocation !== 'none') { const btnDs = _createServiceShortcutButton('googleDatasetSearch', 'tools'); if (btnDs) frag.appendChild(btnDs); } if (frag.childElementCount > 0) { sectionContent.appendChild(frag); return section; } return null; }

    /**
     * Validates the date range input fields.
     * @private
     * @param {HTMLInputElement} minInput - The start date input.
     * @param {HTMLInputElement} maxInput - The end date input.
     * @param {HTMLElement} errorMsgElement - The element for displaying errors.
     * @returns {boolean} True if the dates are valid.
     */
    function _validateDateInputs(minInput, maxInput, errorMsgElement) { _clearElementMessage(errorMsgElement, CSS.IS_ERROR_VISIBLE); minInput.classList.remove(CSS.HAS_ERROR); maxInput.classList.remove(CSS.HAS_ERROR); let isValid = true; const today = new Date(); today.setHours(0, 0, 0, 0); const startDateStr = minInput.value; const endDateStr = maxInput.value; let startDate = null; let endDate = null; if (startDateStr) { startDate = new Date(startDateStr); startDate.setHours(0,0,0,0); if (startDate > today) { _showElementMessage(errorMsgElement, 'alert_start_in_future', {}, CSS.IS_ERROR_VISIBLE); minInput.classList.add(CSS.HAS_ERROR); isValid = false; } } if (endDateStr) { endDate = new Date(endDateStr); endDate.setHours(0,0,0,0); if (endDate > today && !maxInput.getAttribute('max')) { if (isValid) _showElementMessage(errorMsgElement, 'alert_end_in_future', {}, CSS.IS_ERROR_VISIBLE); else errorMsgElement.textContent += " " + _('alert_end_in_future'); maxInput.classList.add(CSS.HAS_ERROR); isValid = false; } } if (startDate && endDate && startDate > endDate) { if (isValid) _showElementMessage(errorMsgElement, 'alert_end_before_start', {}, CSS.IS_ERROR_VISIBLE); else errorMsgElement.textContent += " " + _('alert_end_before_start'); minInput.classList.add(CSS.HAS_ERROR); maxInput.classList.add(CSS.HAS_ERROR); isValid = false; } return isValid; }

    /**
     * Adds event listeners to the date range input fields.
     */
    function addDateRangeListener() { const dateRangeSection = sidebar?.querySelector('#sidebar-section-date-range'); if (!dateRangeSection) return; const applyButton = dateRangeSection.querySelector('.apply-date-range'); const errorMsgElement = dateRangeSection.querySelector(`#${IDS.DATE_RANGE_ERROR_MSG}`); const dateMinInput = dateRangeSection.querySelector(`#${IDS.DATE_MIN}`); const dateMaxInput = dateRangeSection.querySelector(`#${IDS.DATE_MAX}`); if (!applyButton || !errorMsgElement || !dateMinInput || !dateMaxInput) { console.warn(`${LOG_PREFIX} Date range elements not found for listener setup.`); return; } const handleDateValidation = () => { const isValid = _validateDateInputs(dateMinInput, dateMaxInput, errorMsgElement); applyButton.disabled = !isValid; }; if (!dateMinInput.dataset[DATA_ATTR.LISTENER_ATTACHED]) { dateMinInput.addEventListener('input', handleDateValidation); dateMinInput.addEventListener('change', handleDateValidation); dateMinInput.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; } if (!dateMaxInput.dataset[DATA_ATTR.LISTENER_ATTACHED]) { dateMaxInput.addEventListener('input', handleDateValidation); dateMaxInput.addEventListener('change', handleDateValidation); dateMaxInput.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; } if (!applyButton.dataset[DATA_ATTR.LISTENER_ATTACHED]) { applyButton.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; applyButton.addEventListener('click', () => { if (!_validateDateInputs(dateMinInput, dateMaxInput, errorMsgElement)) return; URLActionManager.applyDateRange(dateMinInput.value, dateMaxInput.value); }); } handleDateValidation(); }

    /**
     * A helper function that calls other functions to initialize all sidebar states and listeners after the UI is built.
     */
    function _initializeSidebarEventListenersAndStates() { addDateRangeListener(); addToolButtonListeners(); initializeSelectedFilters(); applySectionCollapseStates(); ResultStatsManager.update(); }

    /**
     * Clears the text content and removes the visibility class from a message element.
     * @private
     */
    function _clearElementMessage(element, visibleClass = CSS.IS_ERROR_VISIBLE) { if(!element)return; element.textContent=''; element.classList.remove(visibleClass);}

    /**
     * Shows a message in a specific DOM element.
     * @private
     */
    function _showElementMessage(element, messageKey, messageArgs = {}, visibleClass = CSS.IS_ERROR_VISIBLE) { if(!element)return; element.textContent=_(messageKey,messageArgs); element.classList.add(visibleClass);}

    /**
     * Adds event listeners to tool buttons that might be in different locations.
     */
    function addToolButtonListeners() { const queryAreas = [ sidebar?.querySelector(`.${CSS.SIDEBAR_HEADER}`), sidebar?.querySelector(`#${IDS.FIXED_TOP_BUTTONS}`), sidebar?.querySelector(`#sidebar-section-tools .${CSS.SECTION_CONTENT}`) ].filter(Boolean); queryAreas.forEach(area => { area.querySelectorAll(`#${IDS.TOOL_VERBATIM}:not([data-${DATA_ATTR.LISTENER_ATTACHED}])`).forEach(b => { b.addEventListener('click', URLActionManager.triggerToggleVerbatim); b.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; }); area.querySelectorAll(`#${IDS.TOOL_RESET_BUTTON}:not([data-${DATA_ATTR.LISTENER_ATTACHED}])`).forEach(b => { b.addEventListener('click', URLActionManager.triggerResetFilters); b.dataset[DATA_ATTR.LISTENER_ATTACHED] = 'true'; }); }); }

    /**
     * Applies the visual styles for the sidebar's collapsed or expanded state.
     * @param {boolean} isCollapsed - Whether the sidebar is currently collapsed.
     */
    function applySidebarCollapseVisuals(isCollapsed) { if(!sidebar)return; const collapseButton = sidebar.querySelector(`#${IDS.COLLAPSE_BUTTON}`); if(isCollapsed){ sidebar.classList.add(CSS.IS_SIDEBAR_COLLAPSED); if(collapseButton){ collapseButton.innerHTML = SVG_ICONS.chevronRight; collapseButton.title = _('sidebar_expand_title');}} else{ sidebar.classList.remove(CSS.IS_SIDEBAR_COLLAPSED); if(collapseButton){ collapseButton.innerHTML = SVG_ICONS.chevronLeft; collapseButton.title = _('sidebar_collapse_title');}} }

    /**
     * Applies the collapsed/expanded state to all sections based on the current settings.
     */
    function applySectionCollapseStates() { if(!sidebar)return; const currentSettings = SettingsManager.getCurrentSettings(); const sections = sidebar.querySelectorAll(`.${CSS.SIDEBAR_CONTENT_WRAPPER} .${CSS.SECTION}`); sections.forEach(section => { const content = section.querySelector(`.${CSS.SECTION_CONTENT}`); const title = section.querySelector(`.${CSS.SECTION_TITLE}`); const sectionId = section.id; if (content && title && sectionId) { let shouldBeCollapsed = false; if (currentSettings.sectionDisplayMode === 'collapseAll') { shouldBeCollapsed = true; } else if (currentSettings.sectionDisplayMode === 'expandAll') { shouldBeCollapsed = false; } else { shouldBeCollapsed = currentSettings.sectionStates?.[sectionId] === true; } content.classList.toggle(CSS.IS_SECTION_COLLAPSED, shouldBeCollapsed); title.classList.toggle(CSS.IS_SECTION_COLLAPSED, shouldBeCollapsed); if (currentSettings.sectionDisplayMode === 'remember') { if (!currentSettings.sectionStates) currentSettings.sectionStates = {}; currentSettings.sectionStates[sectionId] = shouldBeCollapsed; } } }); }
	
    /**
     * Initializes the visual state of all filter options in the sidebar to reflect the
     * current URL's search parameters upon page load.
     */
    function initializeSelectedFilters() {
        if (!sidebar) return;
        try {
            const currentUrl = URLActionManager.generateURLObject();
            if (!currentUrl) return;
            const params = currentUrl.searchParams;
            const currentTbs = params.get('tbs') || '';
            const currentQuery = params.get('q') || '';

            ALL_SECTION_DEFINITIONS.forEach(sectionDef => {
                if (sectionDef.type === 'filter' && sectionDef.param && sectionDef.id !== 'sidebar-section-filetype' && sectionDef.id !== 'sidebar-section-site-search') {
                     _initializeStandaloneFilterState(params, sectionDef.id, sectionDef.param);
                }
            });
            _initializeTimeFilterState(currentTbs);
            _initializeVerbatimState();
            _initializePersonalizationState();
            _initializeDateRangeInputs(currentTbs);
            _initializeSiteSearchState(currentQuery);
            _initializeFiletypeSearchState(currentQuery, params.get('as_filetype'));
        } catch (e) {
            console.error(`${LOG_PREFIX} Error initializing filter highlights:`, e);
        }
    }

    /**
     * Sets the selected state for options in a standard filter section based on URL parameters.
     * @private
     * @param {URLSearchParams} params - The current URL search parameters.
     * @param {string} sectionId - The ID of the section to initialize.
     * @param {string} paramToGetFromURL - The URL parameter key to check.
     */
    function _initializeStandaloneFilterState(params, sectionId, paramToGetFromURL) {
        const sectionElement = sidebar?.querySelector(`#${sectionId}`);
        if (!sectionElement) return;
        const urlValue = params.get(paramToGetFromURL);
        const options = sectionElement.querySelectorAll(`.${CSS.FILTER_OPTION}`);
        let anOptionWasSelectedBasedOnUrl = false;

        options.forEach(opt => {
            const optionValue = opt.dataset[DATA_ATTR.FILTER_VALUE];
            const isSelected = (urlValue !== null && urlValue === optionValue);
            opt.classList.toggle(CSS.IS_SELECTED, isSelected);
            if (isSelected) anOptionWasSelectedBasedOnUrl = true;
        });

        if (!anOptionWasSelectedBasedOnUrl) {
            const defaultOptionQuery = (paramToGetFromURL === 'as_occt')
                ? `.${CSS.FILTER_OPTION}[data-${DATA_ATTR.FILTER_VALUE}="any"]`
                : `.${CSS.FILTER_OPTION}[data-${DATA_ATTR.FILTER_VALUE}=""]`;
            const defaultOpt = sectionElement.querySelector(defaultOptionQuery);
            if (defaultOpt) {
                defaultOpt.classList.add(CSS.IS_SELECTED);
            }
        }
    }

    /**
     * Sets the selected state for the time filter based on the 'tbs' URL parameter.
     * @private
     * @param {string} currentTbs - The current value of the 'tbs' URL parameter.
     */
    function _initializeTimeFilterState(currentTbs){ const timeSection = sidebar?.querySelector('#sidebar-section-time'); if(!timeSection) return; const qdrMatch = currentTbs.match(/qdr:([^,]+)/); const activeQdrValue = qdrMatch ? qdrMatch[1] : null; const hasDateRange = /cdr:1/.test(currentTbs); const timeOptions = timeSection.querySelectorAll(`.${CSS.FILTER_OPTION}`); timeOptions.forEach(opt => { const optionValue = opt.dataset[DATA_ATTR.FILTER_VALUE]; let shouldBeSelected = false; if(hasDateRange){ shouldBeSelected = (optionValue === ''); } else if(activeQdrValue){ shouldBeSelected = (optionValue === activeQdrValue); } else { shouldBeSelected = (optionValue === ''); } opt.classList.toggle(CSS.IS_SELECTED, shouldBeSelected); }); }

    /**
     * Sets the active state of the Verbatim search button.
     * @private
     */
    function _initializeVerbatimState(){ const isVerbatimActiveNow = URLActionManager.isVerbatimActive(); sidebar?.querySelectorAll(`#${IDS.TOOL_VERBATIM}`).forEach(b=>b.classList.toggle(CSS.IS_ACTIVE, isVerbatimActiveNow)); }

    /**
     * Sets the active state of the Personalization toggle button.
     * @private
     */
    function _initializePersonalizationState() { const isActive = URLActionManager.isPersonalizationActive(); sidebar?.querySelectorAll(`#${IDS.TOOL_PERSONALIZE}`).forEach(button => { button.classList.toggle(CSS.IS_ACTIVE, isActive); const titleKey = isActive ? 'tooltip_toggle_personalization_off' : 'tooltip_toggle_personalization_on'; button.title = _(titleKey); const svgIcon = SVG_ICONS.personalization || ''; const isIconOnly = button.classList.contains(CSS.HEADER_BUTTON) && !button.classList.contains(CSS.BUTTON); const currentText = !isIconOnly ? _('tool_personalization_toggle') : ''; let newHTML = ''; if(svgIcon) newHTML += svgIcon; if(currentText) newHTML += (svgIcon && currentText ? ' ' : '') + `<span>${currentText}</span>`; button.innerHTML = newHTML.trim(); }); }

    /**
     * Sets the values of the date range inputs based on the 'tbs' URL parameter.
     * @private
     * @param {string} currentTbs - The current value of the 'tbs' URL parameter.
     */
    function _initializeDateRangeInputs(currentTbs){ const dateSection = sidebar?.querySelector('#sidebar-section-date-range'); if (!dateSection) return; const dateMinInput = dateSection.querySelector(`#${IDS.DATE_MIN}`); const dateMaxInput = dateSection.querySelector(`#${IDS.DATE_MAX}`); const errorMsgElement = dateSection.querySelector(`#${IDS.DATE_RANGE_ERROR_MSG}`); const applyButton = dateSection.querySelector('.apply-date-range'); if (errorMsgElement) _clearElementMessage(errorMsgElement, CSS.IS_ERROR_VISIBLE); if (/cdr:1/.test(currentTbs)) { const minMatch = currentTbs.match(/cd_min:(\d{1,2})\/(\d{1,2})\/(\d{4})/); const maxMatch = currentTbs.match(/cd_max:(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (dateMinInput) dateMinInput.value = minMatch ? `${minMatch[3]}-${minMatch[1].padStart(2, '0')}-${minMatch[2].padStart(2, '0')}` : ''; if (dateMaxInput) dateMaxInput.value = maxMatch ? `${maxMatch[3]}-${maxMatch[1].padStart(2, '0')}-${maxMatch[2].padStart(2, '0')}` : ''; } else { if (dateMinInput) dateMinInput.value = ''; if (dateMaxInput) dateMaxInput.value = ''; } if (dateMinInput && dateMaxInput && errorMsgElement && applyButton) { const isValid = _validateDateInputs(dateMinInput, dateMaxInput, errorMsgElement); applyButton.disabled = !isValid; } }

    /**
     * Sets the selected state for the site search options based on 'site:' operators in the query.
     * @private
     * @param {string} currentQuery - The current search query string.
     */
    function _initializeSiteSearchState(currentQuery){
        const siteSearchSectionContent = sidebar?.querySelector('#sidebar-section-site-search .'+CSS.SECTION_CONTENT);
        if (!siteSearchSectionContent) return;

        const clearSiteOptDiv = siteSearchSectionContent.querySelector(`#${IDS.CLEAR_SITE_SEARCH_OPTION}`);
        const listElement = siteSearchSectionContent.querySelector('ul.' + CSS.CUSTOM_LIST);
        const currentSettings = SettingsManager.getCurrentSettings();
        const checkboxModeEnabled = currentSettings.enableSiteSearchCheckboxMode;

        siteSearchSectionContent.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}, label.${CSS.IS_SELECTED}`).forEach(opt => opt.classList.remove(CSS.IS_SELECTED));
        if (checkboxModeEnabled && listElement) {
            listElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_SITE}`).forEach(cb => cb.checked = false);
        }

        const siteMatches = [...currentQuery.matchAll(/(?<!\S)site:([\w.:\/~%?#=&+-]+)(?!\S)/gi)];
        let activeSiteUrlsFromQuery = siteMatches.map(match => match[1].toLowerCase());
        activeSiteUrlsFromQuery.sort();

        if (activeSiteUrlsFromQuery.length > 0) {
            if(clearSiteOptDiv) clearSiteOptDiv.classList.remove(CSS.IS_SELECTED);
            let customOptionFullyMatched = false;

            if (listElement) {
                const customSiteOptions = Array.from(listElement.querySelectorAll(checkboxModeEnabled ? 'label' : `div.${CSS.FILTER_OPTION}`));
                for (const optElement of customSiteOptions) {
                    const customSiteValue = optElement.dataset[DATA_ATTR.SITE_URL];
                    if (!customSiteValue) continue;

                    const definedCustomSites = Utils.parseCombinedValue(customSiteValue).map(s => s.toLowerCase()).sort();
                    if (definedCustomSites.length > 0 && definedCustomSites.length === activeSiteUrlsFromQuery.length && definedCustomSites.every((val, index) => val === activeSiteUrlsFromQuery[index])) {
                        if (checkboxModeEnabled) {
                            const checkbox = listElement.querySelector(`input[type="checkbox"][value="${customSiteValue}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                        optElement.classList.add(CSS.IS_SELECTED);
                        customOptionFullyMatched = true;
                        break;
                    }
                }
            }

            if (!customOptionFullyMatched && listElement && checkboxModeEnabled) {
                activeSiteUrlsFromQuery.forEach(url => {
                    const checkbox = listElement.querySelector(`input[type="checkbox"].${CSS.CHECKBOX_SITE}[value="${url}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        const label = listElement.querySelector(`label[for="${checkbox.id}"]`);
                        if(label) label.classList.add(CSS.IS_SELECTED);
                    }
                });
            } else if (!customOptionFullyMatched && listElement && !checkboxModeEnabled && activeSiteUrlsFromQuery.length === 1) {
                const singleSiteInQuery = activeSiteUrlsFromQuery[0];
                const optionDiv = listElement.querySelector(`div.${CSS.FILTER_OPTION}[data-${DATA_ATTR.SITE_URL}="${singleSiteInQuery}"]`);
                if (optionDiv) optionDiv.classList.add(CSS.IS_SELECTED);
            }
        } else {
            if (clearSiteOptDiv) clearSiteOptDiv.classList.add(CSS.IS_SELECTED);
        }

        if (checkboxModeEnabled) {
            _updateApplySitesButtonState(siteSearchSectionContent);
        }
    }

    /**
     * Sets the selected state for the file type options based on 'filetype:' operators or the 'as_filetype' parameter.
     * @private
     * @param {string} currentQuery - The current search query string.
     * @param {string|null} asFiletypeParam - The value of the 'as_filetype' URL parameter.
     */
    function _initializeFiletypeSearchState(currentQuery, asFiletypeParam) {
        const filetypeSectionContent = sidebar?.querySelector('#sidebar-section-filetype .'+CSS.SECTION_CONTENT);
        if (!filetypeSectionContent) return;

        const clearFiletypeOptDiv = filetypeSectionContent.querySelector(`#${IDS.CLEAR_FILETYPE_SEARCH_OPTION}`);
        const listElement = filetypeSectionContent.querySelector('ul.' + CSS.CUSTOM_LIST);
        const currentSettings = SettingsManager.getCurrentSettings();
        const checkboxModeEnabled = currentSettings.enableFiletypeCheckboxMode;

        filetypeSectionContent.querySelectorAll(`.${CSS.FILTER_OPTION}.${CSS.IS_SELECTED}, label.${CSS.IS_SELECTED}`).forEach(opt => opt.classList.remove(CSS.IS_SELECTED));
        if (checkboxModeEnabled && listElement) {
            listElement.querySelectorAll(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}`).forEach(cb => cb.checked = false);
        }

        let activeFiletypesFromQuery = [];
        const filetypeMatches = [...currentQuery.matchAll(/(?<!\S)filetype:([\w.:\/~%?#=&+-]+)(?!\S)/gi)];

        if (filetypeMatches.length > 0) {
            activeFiletypesFromQuery = filetypeMatches.map(match => match[1].toLowerCase());
        } else if (asFiletypeParam && !currentQuery.includes('filetype:')) {
             activeFiletypesFromQuery = Utils.parseCombinedValue(asFiletypeParam).map(ft => ft.toLowerCase());
        }
        activeFiletypesFromQuery.sort();

        if (activeFiletypesFromQuery.length > 0) {
            if(clearFiletypeOptDiv) clearFiletypeOptDiv.classList.remove(CSS.IS_SELECTED);
            let customOptionFullyMatched = false;

            if (listElement) {
                const customFiletypeOptions = Array.from(listElement.querySelectorAll(checkboxModeEnabled ? 'label' : `div.${CSS.FILTER_OPTION}`));
                for (const optElement of customFiletypeOptions) {
                    const customFtValueAttr = checkboxModeEnabled ? optElement.dataset[DATA_ATTR.FILETYPE_VALUE] : optElement.dataset[DATA_ATTR.FILTER_VALUE];
                    if (!customFtValueAttr) continue;

                    const definedCustomFiletypes = Utils.parseCombinedValue(customFtValueAttr).map(s => s.toLowerCase()).sort();
                     if (definedCustomFiletypes.length > 0 && definedCustomFiletypes.length === activeFiletypesFromQuery.length && definedCustomFiletypes.every((val, index) => val === activeFiletypesFromQuery[index])) {
                        if (checkboxModeEnabled) {
                            const checkbox = listElement.querySelector(`input[type="checkbox"][value="${customFtValueAttr}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                        optElement.classList.add(CSS.IS_SELECTED);
                        customOptionFullyMatched = true;
                        break;
                    }
                }
            }

            if (!customOptionFullyMatched && listElement && checkboxModeEnabled) {
                activeFiletypesFromQuery.forEach(ft => {
                    const checkbox = listElement.querySelector(`input[type="checkbox"].${CSS.CHECKBOX_FILETYPE}[value="${ft}"]`);
                    if (checkbox) {
                         checkbox.checked = true;
                         const label = listElement.querySelector(`label[for="${checkbox.id}"]`);
                         if(label) label.classList.add(CSS.IS_SELECTED);
                    }
                });
            } else if (!customOptionFullyMatched && listElement && !checkboxModeEnabled && activeFiletypesFromQuery.length === 1) {
                const singleFtInQuery = activeFiletypesFromQuery[0];
                const optionDiv = listElement.querySelector(`div.${CSS.FILTER_OPTION}[data-${DATA_ATTR.FILTER_VALUE}="${singleFtInQuery}"]`);
                if (optionDiv) optionDiv.classList.add(CSS.IS_SELECTED);
            }
        } else {
             if (clearFiletypeOptDiv) clearFiletypeOptDiv.classList.add(CSS.IS_SELECTED);
        }
        if (checkboxModeEnabled) {
            _updateApplyFiletypesButtonState(filetypeSectionContent);
        }
    }

    /**
     * Binds the main event listeners for the sidebar itself, primarily using event delegation.
     * This includes clicks on the settings and collapse buttons, as well as section titles.
     */
    function bindSidebarEvents() {
        if (!sidebar) return;
        const collapseButton = sidebar.querySelector(`#${IDS.COLLAPSE_BUTTON}`);
        const settingsButton = sidebar.querySelector(`#${IDS.SETTINGS_BUTTON}`);
        if (collapseButton) collapseButton.title = _('sidebar_collapse_title');
        if (settingsButton) settingsButton.title = _('sidebar_settings_title');

        // Use a single delegated event listener for the entire sidebar for efficiency.
        sidebar.addEventListener('click', (e) => {
            const settingsBtnTarget = e.target.closest(`#${IDS.SETTINGS_BUTTON}`);
            if (settingsBtnTarget) { SettingsManager.show(); return; }
            const collapseBtnTarget = e.target.closest(`#${IDS.COLLAPSE_BUTTON}`);
            if (collapseBtnTarget) { toggleSidebarCollapse(); return; }
            const sectionTitleTarget = e.target.closest(`.${CSS.SIDEBAR_CONTENT_WRAPPER} .${CSS.SECTION_TITLE}`);
            if (sectionTitleTarget && !sidebar.classList.contains(CSS.IS_SIDEBAR_COLLAPSED)) { handleSectionCollapse(e); return; }
        });

        sidebar.addEventListener('mousedown', (event) => {
            if (event.button !== 1) { return; } // Middle-click only
            const target = event.target.closest(`.${CSS.FILTER_OPTION}, label[data-site-url], label[data-filetype-value]`);
            if (!target) { return; }
            event.preventDefault();

            let targetUrl = null;
            const dataset = target.dataset;

            if (target.id === IDS.CLEAR_SITE_SEARCH_OPTION) { targetUrl = URLActionManager.generateClearSiteSearchURL(); }
            else if (target.id === IDS.CLEAR_FILETYPE_SEARCH_OPTION) { targetUrl = URLActionManager.generateClearFiletypeSearchURL(); }
            else if (dataset.siteUrl) { targetUrl = URLActionManager.generateSiteSearchURL(dataset.siteUrl); }
            else if (dataset.filetypeValue) { targetUrl = URLActionManager.generateCombinedFiletypeSearchURL(dataset.filetypeValue); }
            else if (dataset.filterType && typeof dataset.filterValue !== 'undefined') { targetUrl = URLActionManager.generateFilterURL(dataset.filterType, dataset.filterValue); }

            if (targetUrl && typeof GM_openInTab === 'function') {
                GM_openInTab(targetUrl, { active: false, insert: true });
            }
        });
    }

    /**
     * Toggles the collapsed/expanded state of the entire sidebar and saves the new state.
     */
    function toggleSidebarCollapse() { const cs = SettingsManager.getCurrentSettings(); cs.sidebarCollapsed = !cs.sidebarCollapsed; applySettings(cs); SettingsManager.save('Sidebar Collapse');}

    /**
     * Handles a click on a section title to expand or collapse it.
     * It also manages the accordion effect if enabled.
     * @param {Event} event - The click event.
     */
    function handleSectionCollapse(event) { const title = event.target.closest(`.${CSS.SECTION_TITLE}`); if (!title || sidebar?.classList.contains(CSS.IS_SIDEBAR_COLLAPSED) || title.closest(`#${IDS.FIXED_TOP_BUTTONS}`)) return; const section = title.closest(`.${CSS.SECTION}`); if (!section) return; const content = section.querySelector(`.${CSS.SECTION_CONTENT}`); const sectionId = section.id; if (!content || !sectionId) return; const currentSettings = SettingsManager.getCurrentSettings(); const isCurrentlyCollapsed = content.classList.contains(CSS.IS_SECTION_COLLAPSED); const shouldBeCollapsedAfterClick = !isCurrentlyCollapsed; let overallStateChanged = false; if (currentSettings.accordionMode && !shouldBeCollapsedAfterClick) { const sectionsContainer = section.parentElement; if (_applyAccordionEffectToSections(sectionId, sectionsContainer, currentSettings)) overallStateChanged = true; } if (_toggleSectionVisualState(section, title, content, sectionId, shouldBeCollapsedAfterClick, currentSettings)) overallStateChanged = true; if (overallStateChanged && currentSettings.sectionDisplayMode === 'remember') { debouncedSaveSettings('Section Collapse/Accordion'); } }

    /**
     * Collapses all other sections when one is expanded in accordion mode.
     * @private
     * @returns {boolean} True if any section's state was changed.
     */
    function _applyAccordionEffectToSections(clickedSectionId, allSectionsContainer, currentSettings) { let stateChangedForAccordion = false; allSectionsContainer?.querySelectorAll(`.${CSS.SECTION}`)?.forEach(otherSection => { if (otherSection.id !== clickedSectionId) { const otherContent = otherSection.querySelector(`.${CSS.SECTION_CONTENT}`); const otherTitle = otherSection.querySelector(`.${CSS.SECTION_TITLE}`); if (otherContent && !otherContent.classList.contains(CSS.IS_SECTION_COLLAPSED)) { otherContent.classList.add(CSS.IS_SECTION_COLLAPSED); otherTitle?.classList.add(CSS.IS_SECTION_COLLAPSED); if (currentSettings.sectionDisplayMode === 'remember') { if (!currentSettings.sectionStates) currentSettings.sectionStates = {}; if (currentSettings.sectionStates[otherSection.id] !== true) { currentSettings.sectionStates[otherSection.id] = true; stateChangedForAccordion = true; } } } } }); return stateChangedForAccordion; }

    /**
     * Toggles the visual state of a single section and updates its state in the settings if necessary.
     * @private
     * @returns {boolean} True if the section's state was changed.
     */
    function _toggleSectionVisualState(sectionEl, titleEl, contentEl, sectionId, newCollapsedState, currentSettings) { let sectionStateActuallyChanged = false; const isCurrentlyCollapsed = contentEl.classList.contains(CSS.IS_SECTION_COLLAPSED); if (isCurrentlyCollapsed !== newCollapsedState) { contentEl.classList.toggle(CSS.IS_SECTION_COLLAPSED, newCollapsedState); titleEl.classList.toggle(CSS.IS_SECTION_COLLAPSED, newCollapsedState); sectionStateActuallyChanged = true; } if (currentSettings.sectionDisplayMode === 'remember') { if (!currentSettings.sectionStates) currentSettings.sectionStates = {}; if (currentSettings.sectionStates[sectionId] !== newCollapsedState) { currentSettings.sectionStates[sectionId] = newCollapsedState; if (!sectionStateActuallyChanged) sectionStateActuallyChanged = true; } } return sectionStateActuallyChanged; }

    /**
     * The main entry point for the script. It orchestrates the initialization process,
     * including loading dependencies, settings, and building the UI.
     */
    function initializeScript() {
        console.log(LOG_PREFIX + " Initializing script...");
        debouncedSaveSettings = Utils.debounce(() => SettingsManager.save('Debounced Save'), 800);
        try {
            addGlobalStyles(); NotificationManager.init(); LocalizationService.initializeBaseLocale();
            SettingsManager.initialize( defaultSettings, applySettings, buildSidebarUI, applySectionCollapseStates, _initMenuCommands, renderSectionOrderList );
            setupSystemThemeListener(); buildSidebarSkeleton();
            DragManager.init( sidebar, sidebar.querySelector(`.${CSS.DRAG_HANDLE}`), SettingsManager, debouncedSaveSettings );
            const initialSettings = SettingsManager.getCurrentSettings();
            DragManager.setDraggable(initialSettings.draggableHandleEnabled, sidebar, sidebar.querySelector(`.${CSS.DRAG_HANDLE}`));
            applySettings(initialSettings); buildSidebarUI(); bindSidebarEvents(); _initMenuCommands();
            ResultStatsManager.init();
            console.log(`${LOG_PREFIX} Script initialization complete. Final effective locale: ${LocalizationService.getCurrentLocale()}`);
        } catch (error) {
            console.error(`${LOG_PREFIX} [initializeScript] CRITICAL ERROR DURING INITIALIZATION:`, error, error.stack);
            const scriptNameForAlert = (typeof _ === 'function' && _('scriptName') && !(_('scriptName').startsWith('[ERR:'))) ? _('scriptName') : SCRIPT_INTERNAL_NAME;
            if (typeof NotificationManager !== 'undefined' && NotificationManager.show) { NotificationManager.show('alert_init_fail', { scriptName: scriptNameForAlert, error: error.message }, 'error', 0); }
            else { _showGlobalMessage('alert_init_fail', { scriptName: scriptNameForAlert, error: error.message }, 'error', 0); }
            if(sidebar && sidebar.remove) sidebar.remove(); const settingsOverlayEl = document.getElementById(IDS.SETTINGS_OVERLAY); if(settingsOverlayEl) settingsOverlayEl.remove(); ModalManager.hide();
        }
    }

    /**
     * This section handles the loading of external dependencies (styles and i18n).
     * It waits for custom events dispatched by the companion scripts before initializing the main script.
     * A timeout is included as a fallback in case the events do not fire.
     */
    if (document.getElementById(IDS.SIDEBAR)) { console.warn(`${LOG_PREFIX} Sidebar with ID "${IDS.SIDEBAR}" already exists. Skipping initialization.`); return; }
    const dependenciesReady = { styles: false, i18n: false }; let initializationAttempted = false; let timeoutFallback;
    function checkDependenciesAndInitialize() { if (initializationAttempted) return; if (dependenciesReady.styles && dependenciesReady.i18n) { console.log(`${LOG_PREFIX} All dependencies ready. Initializing script.`); clearTimeout(timeoutFallback); initializationAttempted = true; if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') { initializeScript(); } else { window.addEventListener('DOMContentLoaded', initializeScript, { once: true }); } } }
    document.addEventListener('gscsStylesLoaded', function stylesLoadedHandler() { console.log(`${LOG_PREFIX} Event "gscsStylesLoaded" received.`); dependenciesReady.styles = true; checkDependenciesAndInitialize(); }, { once: true });
    document.addEventListener('gscsi18nLoaded', function i18nLoadedHandler() { console.log(`${LOG_PREFIX} Event "gscsi18nLoaded" received.`); dependenciesReady.i18n = true; checkDependenciesAndInitialize(); }, { once: true });
    timeoutFallback = setTimeout(() => { if (initializationAttempted) return; console.log(`${LOG_PREFIX} Fallback: Checking dependencies after timeout.`); if (typeof window.GSCS_Namespace !== 'undefined') { if (typeof window.GSCS_Namespace.stylesText === 'string' && window.GSCS_Namespace.stylesText.trim() !== '' && !dependenciesReady.styles) { console.log(`${LOG_PREFIX} Fallback: Styles found via namespace.`); dependenciesReady.styles = true; } if (typeof window.GSCS_Namespace.i18nPack === 'object' && Object.keys(window.GSCS_Namespace.i18nPack.translations || {}).length > 0 && !dependenciesReady.i18n) { console.log(`${LOG_PREFIX} Fallback: i18n pack found via namespace.`); dependenciesReady.i18n = true; } } if (dependenciesReady.styles && dependenciesReady.i18n) { checkDependenciesAndInitialize(); } else { console.error(`${LOG_PREFIX} Fallback: Dependencies still not fully loaded after timeout. Styles: ${dependenciesReady.styles}, i18n: ${dependenciesReady.i18n}.`); if (!initializationAttempted) { console.warn(`${LOG_PREFIX} Attempting to initialize with potentially incomplete dependencies due to fallback timeout.`); if (!dependenciesReady.styles) { console.warn(`${LOG_PREFIX} Styles dependency forced true in fallback.`); dependenciesReady.styles = true; } if (!dependenciesReady.i18n) { console.warn(`${LOG_PREFIX} i18n dependency forced true in fallback.`); dependenciesReady.i18n = true; } checkDependenciesAndInitialize(); } } }, 2000);
    if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
        if (typeof window.GSCS_Namespace !== 'undefined') {
            if (typeof window.GSCS_Namespace.stylesText === 'string' && window.GSCS_Namespace.stylesText.trim() !== '' && !dependenciesReady.styles) {
                dependenciesReady.styles = true;
            }
            if (typeof window.GSCS_Namespace.i18nPack === 'object' && Object.keys(window.GSCS_Namespace.i18nPack.translations || {}).length > 0 && !dependenciesReady.i18n) {
                dependenciesReady.i18n = true;
            }
        }
        if (dependenciesReady.styles && dependenciesReady.i18n && !initializationAttempted) {
            checkDependenciesAndInitialize();
        }
    }
})();