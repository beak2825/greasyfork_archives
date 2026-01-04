// ==UserScript==
// @name               DuckDuckGo Enhancer
// @name:zh-CN         DuckDuckGo 增强
// @name:zh-TW         DuckDuckGo 增強
// @description        Enhance Your DuckDuckGo Experience - Double-Click To Top / Instant Cross-Engine Search / Focused Keyword Highlighting / Dual-Column Results View / Quick Category Navigation / Search Syntax Helper / Result Item Widget / Powerful Keyboard Shortcuts
// @description:zh-CN  增强 DuckDuckGo 浏览体验 - 双点即达页首/跨引擎即刻搜/聚焦搜索文本/分栏结果视图/快捷类别导航/搜索语法助手/结果项小工具/全功能快捷键
// @description:zh-TW  增强 DuckDuckGo 瀏覽體驗 - 雙点即达页首/跨引擎即刻搜/聚焦搜尋文字/分欄結果視圖/快速類別導覽/搜尋語法助手/結果項小工具/全功能快捷鍵
// @version            1.4.0
// @icon               https://raw.githubusercontent.com/MiPoNianYou/UserScripts/refs/heads/main/Icons/DuckDuckGo-Enhancer-Icon.svg
// @author             念柚
// @namespace          https://github.com/MiPoNianYou/UserScripts
// @supportURL         https://github.com/MiPoNianYou/UserScripts/issues
// @license            AGPL-3.0
// @match              https://duckduckgo.com/*
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532614/DuckDuckGo%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532614/DuckDuckGo%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const Config = {
    ELEMENT_SELECTORS: {
      INTERACTIVE_ELEMENT:
        'a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])',
      SEARCH_FORM: "#search_form",
      SEARCH_INPUT: "#search_form_input",
      HEADER_SEARCH_AREA: "div.header__content.header__search",
      HEADER_ACTIONS: ".header--aside",
      CONTENT_WRAPPER: "#web_content_wrapper",
      LAYOUT_CONTAINER: "#react-layout > div > div",
      MAINLINE_SECTION: 'section[data-testid="mainline"]',
      SIDEBAR: 'section[data-testid="sidebar"]',
      RESULTS_CONTAINER: "ol.react-results--main",
      WEB_RESULT: 'article[data-testid="result"]',
      WEB_RESULT_OPTIONS_CONTAINER: "div.OHr0VX9IuNcv6iakvT6A",
      WEB_RESULT_OPTIONS_BUTTON: "button.cxQwADb9kt3UnKwcXKat",
      WEB_RESULT_TITLE_LINK: 'h2 a[data-testid="result-title-a"]',
      WEB_RESULT_TITLE_SPAN: 'h2 a[data-testid="result-title-a"] span',
      WEB_RESULT_SNIPPET: 'div[data-result="snippet"] > div > span > span',
      WEB_RESULT_URL: 'a[data-testid="result-extras-url-link"] p span',
      IMAGE_RESULT: 'div[data-testid="zci-images"] figure',
      IMAGE_CAPTION: "figcaption p span",
      VIDEO_RESULT:
        'div[data-testid="zci-videos"] article.O9Ipab51rBntYb0pwOQn',
      VIDEO_TITLE: "h2 span.kY2IgmnCmOGjharHErah",
      NEWS_RESULT: "article a.ksuAj6IYz34FJu0vGKNy",
      NEWS_TITLE: "h2.WctuDfRzXeUleKwpnBCx",
      NEWS_SNIPPET: "div.kY2IgmnCmOGjharHErah p",
      NAV_TAB: "#react-duckbar nav ul:first-of-type > li > a",
      PAGE_SEPARATOR_LI: "li._LX3Dolif_D4E_6W6Fbr",
      FEEDBACK_BUTTON_CONTAINER: "div.TccjmKV6RraCaCw5L9gd",
      PRIVACY_PROMO_CONTAINER:
        "div.header--aside__item.header--aside__item--hidden-lg",
    },
    CSS_CLASSES: {
      ACTIVE_NAV_TAB: "SnptgjT2zdOhGYfNng6g",
      SEARCH_ENGINE_GROUP: "ddge-search-engine-group",
      SEARCH_ENGINE_BUTTON: "ddge-search-engine-button",
      SEARCH_ENGINE_ICON: "ddge-search-engine-icon",
      KEYWORD_HIGHLIGHT: "ddge-keyword-highlight",
      HIGHLIGHTING_DISABLED: "ddge-highlighting-disabled",
      COPY_LINK_BUTTON: "ddge-copy-link-button",
      RESULT_ACTION_ICON_WRAPPER: "ddge-result-action-icon-wrapper",
      RESULT_ACTION_TEXT_LABEL: "ddge-result-action-text-label",
      COPY_LINK_BUTTON_COPIED: "ddge-copied",
      COPY_LINK_BUTTON_FAILED: "ddge-failed",
      SITE_SEARCH_BUTTON: "ddge-site-search-button",
      SITE_BLOCK_BUTTON: "ddge-site-block-button",
      SYNTAX_SHORTCUT_BUTTON: "ddge-syntax-shortcut-button",
      DUAL_COLUMN_LAYOUT: "ddge-dual-column-layout",
      DUAL_COLUMN_ACTIVE: "ddge-dual-column-active",
      TOGGLE_BUTTON_WRAPPER: "ddge-toggle-wrapper",
      TOGGLE_BUTTON: "ddge-toggle-button",
      MATERIAL_BUTTON: "ddge-material-button",
    },
    ELEMENT_IDS: {
      HIGHLIGHT_TOGGLE_WRAPPER: "ddge-highlight-toggle-wrapper",
      SYNTAX_SHORTCUTS_CONTAINER: "ddge-syntax-shortcuts-container",
      DUAL_COLUMN_TOGGLE_WRAPPER: "ddge-dual-column-toggle-wrapper",
    },
    STORAGE_KEYS_FEATURES: {
      HIGHLIGHT_ENABLED: "ddge_highlightEnabled",
      DUAL_COLUMN_ENABLED: "ddge_dualColumnEnabled",
    },
    KEYBINDING_CONFIG: {
      SHORTCUTS: [
        {
          id: "toggleHighlight",
          key: "h",
          actionIdentifier: "handleHighlightToggle",
        },
        {
          id: "toggleDualColumn",
          key: "d",
          actionIdentifier: "handleDualColumnToggle",
        },
        {
          id: "navigateToNextTab",
          key: "]",
          actionIdentifier: "navigateTabsNext",
        },
        {
          id: "navigateToPrevTab",
          key: "[",
          actionIdentifier: "navigateTabsPrev",
        },
      ],
    },
  };

  Config.FEATURE_CONFIGS = {
    HIGHLIGHT_SELECTORS: {
      web: {
        itemSelector: Config.ELEMENT_SELECTORS.WEB_RESULT,
        targetSelectors: [
          Config.ELEMENT_SELECTORS.WEB_RESULT_TITLE_SPAN,
          Config.ELEMENT_SELECTORS.WEB_RESULT_SNIPPET,
        ],
      },
      images: {
        itemSelector: Config.ELEMENT_SELECTORS.IMAGE_RESULT,
        targetSelectors: [Config.ELEMENT_SELECTORS.IMAGE_CAPTION],
      },
      videos: {
        itemSelector: Config.ELEMENT_SELECTORS.VIDEO_RESULT,
        targetSelectors: [Config.ELEMENT_SELECTORS.VIDEO_TITLE],
      },
      news: {
        itemSelector: Config.ELEMENT_SELECTORS.NEWS_RESULT,
        targetSelectors: [
          Config.ELEMENT_SELECTORS.NEWS_TITLE,
          Config.ELEMENT_SELECTORS.NEWS_SNIPPET,
        ],
      },
    },
    ALTERNATE_SEARCH_ENGINES: [
      {
        id: "google",
        name: "Google",
        urlTemplate: "https://www.google.com/search?q=",
        iconHost: "www.google.com",
        shortcutKey: "z",
      },
      {
        id: "bing",
        name: "Bing",
        urlTemplate: "https://www.bing.com/search?q=",
        iconHost: "www.bing.com",
        shortcutKey: "x",
      },
      {
        id: "baidu",
        name: "Baidu",
        urlTemplate: "https://www.baidu.com/s?wd=",
        iconHost: "www.baidu.com",
        shortcutKey: "c",
      },
    ],
    SYNTAX_SHORTCUTS: [
      {
        id: "exact",
        text: "精确搜索",
        syntax: '""',
        actionIdentifier: "applyExactPhrase",
      },
      {
        id: "exclude",
        text: "搜索排除",
        syntax: "-",
        actionIdentifier: "applyExclusion",
      },
      {
        id: "site",
        text: "限定站点",
        syntax: "site:",
        actionIdentifier: "appendOperator",
      },
      {
        id: "filetype",
        text: "筛选文件",
        syntax: "filetype:",
        actionIdentifier: "appendOperator",
      },
    ],
  };

  Config.FEATURE_CONFIGS.ALTERNATE_SEARCH_ENGINES.forEach((engine) => {
    if (engine.shortcutKey) {
      Config.KEYBINDING_CONFIG.SHORTCUTS.push({
        id: `search_${engine.id}`,
        key: engine.shortcutKey,
        actionIdentifier: `triggerSearchEngine_${engine.id}`,
      });
    }
  });

  const State = {
    isHighlightActive: false,
    isDualColumnActive: false,
    currentKeybindingConfig: null,

    initialize() {
      this.isHighlightActive = GM_getValue(
        Config.STORAGE_KEYS_FEATURES.HIGHLIGHT_ENABLED,
        false
      );
      this.isDualColumnActive = GM_getValue(
        Config.STORAGE_KEYS_FEATURES.DUAL_COLUMN_ENABLED,
        false
      );
      this.currentKeybindingConfig = JSON.parse(
        JSON.stringify(Config.KEYBINDING_CONFIG)
      );
    },

    setHighlightState(isActive) {
      this.isHighlightActive = isActive;
      try {
        GM_setValue(Config.STORAGE_KEYS_FEATURES.HIGHLIGHT_ENABLED, isActive);
      } catch (e) {}
    },

    setDualColumnState(isActive) {
      this.isDualColumnActive = isActive;
      try {
        GM_setValue(Config.STORAGE_KEYS_FEATURES.DUAL_COLUMN_ENABLED, isActive);
      } catch (e) {}
    },
  };

  const UserInterface = {
    SETTINGS: {
      UI_FONT_STACK: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      ANIMATION_DURATION_MS: 200,
      ANIMATION_EASING_STANDARD: "cubic-bezier(0, 0, 0.58, 1)",
      ANIMATION_EASING_APPLE_SMOOTH_OUT: "cubic-bezier(0.25, 1, 0.5, 1)",
      BUTTON_TRANSFORM_DURATION: "0.1s",
      COPY_FEEDBACK_DURATION_MS: 1500,
    },
    STRINGS: {
      HIGHLIGHT_TOGGLE_LABEL: "文本聚焦",
      DUAL_COLUMN_TOGGLE_LABEL: "分栏视图",
      COPY_BUTTON_DEFAULT_ARIA_LABEL: "拷贝此页网址",
      COPY_BUTTON_SUCCESS_ARIA_LABEL: "拷贝完成",
      COPY_BUTTON_FAILURE_ARIA_LABEL: "拷贝失败",
      COPY_BUTTON_TEXT_LABEL: "拷贝当前网链",
      SITE_SEARCH_BUTTON_ARIA_LABEL: "站内搜索此域名",
      SITE_SEARCH_BUTTON_TEXT_LABEL: "仅搜此站内容",
      BLOCK_SITE_BUTTON_ARIA_LABEL: "屏蔽此域名结果",
      BLOCK_SITE_BUTTON_TEXT_LABEL: "屏蔽此域结果",
      SVG_ICON_COPY_LINK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125.354 123.975"><g fill="currentColor"><path d="M37.31 14.844v4.394c0 .782.05 1.563.196 2.246h-1.123c-4.59 0-6.934 2.979-6.934 7.569v73.828c0 4.883 2.637 7.568 7.715 7.568H88.19c5.078 0 7.666-2.685 7.666-7.568V68.945l7.861-7.861v41.895c0 10.253-5.03 15.332-15.137 15.332H36.725c-10.059 0-15.137-5.079-15.137-15.332V28.955c0-10.01 4.883-15.332 14.6-15.332h1.172c-.05.39-.05.83-.05 1.22m66.4 13.872-7.854 7.846v-7.51c0-4.59-2.295-7.568-6.885-7.568h-1.172c.147-.683.195-1.465.195-2.246v-4.394c0-.39 0-.83-.048-1.221h1.172c9.685 0 14.519 5.235 14.592 15.093M73.248 10.01h4.492c2.881 0 4.59 1.806 4.59 4.834v5.127c0 3.027-1.709 4.834-4.59 4.834H47.614c-2.881 0-4.59-1.807-4.59-4.834v-5.127c0-3.028 1.709-4.834 4.59-4.834h4.443C52.399 4.492 56.989 0 62.653 0s10.253 4.492 10.595 10.01m-14.843.39c0 2.295 1.904 4.248 4.248 4.248 2.392 0 4.248-1.953 4.248-4.248 0-2.392-1.856-4.296-4.248-4.296-2.344 0-4.248 1.904-4.248 4.296"/><path d="M50.983 84.62c0 1.66-1.416 3.026-3.076 3.026h-6.788c-1.66 0-3.076-1.367-3.076-3.027s1.367-3.027 3.076-3.027h6.788c1.709 0 3.076 1.367 3.076 3.027M63 69.384H41.119a3.063 3.063 0 0 1-3.076-3.076c0-1.66 1.367-2.979 3.076-2.979h27.942Zm22.923-22.9-5.572 5.566H41.119c-1.66 0-3.076-1.367-3.076-3.028 0-1.66 1.416-3.076 3.076-3.076h43.116c.623 0 1.205.2 1.689.537m27.754-4.735 3.662-3.71c1.758-1.759 1.758-4.151.049-5.86l-1.172-1.172c-1.562-1.563-4.004-1.367-5.664.244l-3.662 3.662Zm-54.736 49.17 9.96-4.443 41.163-41.065-6.885-6.787-41.065 41.065-4.687 9.619c-.44.879.586 2.002 1.514 1.611"/></g></svg>`,
      SVG_ICON_COPY_SUCCESS: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.389 100.146"><path d="M98.389 88.281c0 2.051-1.71 3.662-3.76 3.662H3.662A3.627 3.627 0 0 1 0 88.281c0-2.05 1.611-3.71 3.662-3.71H94.63c2.05 0 3.76 1.66 3.76 3.71m0-25.586c0 2.051-1.71 3.711-3.76 3.711H3.662c-2.05 0-3.662-1.66-3.662-3.71a3.627 3.627 0 0 1 3.662-3.663H94.63c2.05 0 3.76 1.611 3.76 3.662m0-25.586c0 2.1-1.71 3.711-3.76 3.711h-33.4c-2.05 0-3.662-1.611-3.662-3.71a3.626 3.626 0 0 1 3.663-3.663h33.398c2.05 0 3.76 1.612 3.76 3.662m0-25.586c0 2.1-1.71 3.711-3.76 3.711H61.23c-2.05 0-3.662-1.611-3.662-3.71a3.627 3.627 0 0 1 3.663-3.663h33.398c2.05 0 3.76 1.612 3.76 3.662M49.658 24.805c0 13.574-11.377 24.853-24.804 24.853C11.23 49.658.049 38.477.049 24.805.049 11.23 11.23 0 24.854 0c13.574 0 24.804 11.23 24.804 24.805M33.643 13.818 21.777 30.371l-6.006-6.494c-.537-.586-1.318-1.074-2.343-1.074-1.71 0-3.028 1.318-3.028 3.076 0 .683.196 1.611.782 2.197l8.252 9.082c.634.684 1.66 1.026 2.441 1.026 1.074 0 2.05-.44 2.588-1.123l14.16-19.727c.44-.635.684-1.27.684-1.807 0-1.757-1.416-3.027-3.077-3.027-1.074 0-2.001.537-2.587 1.318" fill="currentColor"/></svg>`,
      SVG_ICON_COPY_FAILURE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.389 100.146"><path d="M98.389 88.281c0 2.051-1.71 3.662-3.76 3.662H3.662A3.627 3.627 0 0 1 0 88.281c0-2.05 1.611-3.71 3.662-3.71H94.63c2.05 0 3.76 1.66 3.76 3.71m0-25.586c0 2.051-1.71 3.711-3.76 3.711H3.662c-2.05 0-3.662-1.66-3.662-3.71a3.627 3.627 0 0 1 3.662-3.663H94.63c2.05 0 3.76 1.611 3.76 3.662m0-25.586c0 2.1-1.71 3.711-3.76 3.711h-33.4c-2.05 0-3.662-1.611-3.662-3.71a3.626 3.626 0 0 1 3.663-3.663h33.398c2.05 0 3.76 1.612 3.76 3.662m0-25.586c0 2.1-1.71 3.711-3.76 3.711H61.23c-2.05 0-3.662-1.611-3.662-3.71a3.627 3.627 0 0 1 3.663-3.663h33.398c2.05 0 3.76 1.612 3.76 3.662M49.658 24.805c0 13.574-11.377 24.853-24.804 24.853C11.23 49.658.049 38.477.049 24.805.049 11.23 11.23 0 24.854 0c13.574 0 24.804 11.23 24.804 24.805M31.885 13.28l-7.178 7.178-6.64-6.592a2.977 2.977 0 0 0-4.151 0c-1.172 1.074-1.123 2.979 0 4.15l6.543 6.641-7.129 7.178c-1.27 1.27-1.074 3.174.147 4.395 1.171 1.171 3.076 1.416 4.345.146L25 29.199l6.64 6.592a3.04 3.04 0 0 0 4.2 0c1.123-1.123 1.123-3.027 0-4.2l-6.592-6.64 7.178-7.129c1.27-1.27 1.025-3.222-.147-4.394-1.22-1.172-3.125-1.416-4.394-.147" fill="currentColor"/></svg>`,
      SVG_ICON_SITE_SEARCH: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.791 130.127"><g fill="currentColor"><path d="M96.436 26.22v52.855a26.1 26.1 0 0 0-7.862-7.82V26.319c0-4.834-2.783-7.568-7.666-7.568H29.834c-5.078 0-7.666 2.783-7.666 7.568v73.828c0 4.834 2.588 7.569 7.666 7.569h22.483a26 26 0 0 0 7.906 7.861h-30.78c-10.058 0-15.136-5.127-15.136-15.332V26.221c0-10.205 5.078-15.332 15.136-15.332H81.3c10.107 0 15.136 5.078 15.136 15.332"/><path d="M76.904 52.637c0 1.709-1.27 3.027-2.978 3.027h-37.06c-1.759 0-3.028-1.318-3.028-3.027 0-1.66 1.27-2.979 3.027-2.979h37.06c1.71 0 2.98 1.319 2.98 2.979m-.001-17.041c0 1.709-1.27 3.076-2.978 3.076h-37.06c-1.759 0-3.028-1.367-3.028-3.076 0-1.66 1.27-2.93 3.027-2.93h37.06c1.71 0 2.98 1.27 2.98 2.93m-2.491 77.539c10.791 0 19.678-8.887 19.678-19.727 0-10.79-8.887-19.726-19.678-19.726-10.84 0-19.726 8.935-19.726 19.726 0 10.84 8.886 19.727 19.726 19.727m0-6.592c-7.178 0-13.135-5.957-13.135-13.184 0-7.128 5.957-13.086 13.135-13.086S87.55 86.231 87.55 93.36c0 7.227-5.957 13.184-13.135 13.184m25.781 16.943c2.246 0 3.907-1.709 3.907-4.15 0-1.074-.538-2.1-1.319-2.881L89.99 103.613l-5.908 5.713 12.744 12.647c.977 1.025 2.002 1.513 3.369 1.513"/></g></svg>`,
      SVG_ICON_BLOCK_SITE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.316 111.365"><path d="M22.48 36.399v56.173c0 4.883 2.636 7.568 7.714 7.568H81.22c1.675 0 3.08-.292 4.203-.865l6.114 6.108c-2.424 1.752-5.722 2.619-9.878 2.619H29.755c-10.059 0-15.137-5.078-15.137-15.283V28.546Zm74.267-17.753v64.112l-7.861-7.862V18.793c0-4.883-2.588-7.617-7.666-7.617H30.194c-1.654 0-3.05.29-4.174.855l-6.105-6.105c2.429-1.742 5.716-2.612 9.84-2.612h51.904c10.059 0 15.088 5.176 15.088 15.332M51.78 65.668H37.226c-1.807 0-3.077-1.27-3.077-2.93 0-1.758 1.27-3.076 3.077-3.076h8.541Zm25.485-20.069c0 1.71-1.319 3.028-3.028 3.028h-11.62L56.61 42.62h17.627c1.71 0 3.028 1.318 3.028 2.978m0-17.04c0 1.708-1.319 3.027-3.028 3.027H45.575L39.57 25.58h34.668c1.71 0 3.028 1.318 3.028 2.978m21.532 75.537c1.514 1.465 3.906 1.465 5.322 0 1.465-1.513 1.465-3.906 0-5.37L12.567 7.22a3.787 3.787 0 0 0-5.37 0c-1.417 1.417-1.417 3.907 0 5.323Z" fill="currentColor"/></svg>`,
      EXCLUDED_NAV_TAB_TEXT: "地图",
    },

    injectStyles() {
      const styles = `
        :root {
          --ctp-frappe-red: rgb(231, 130, 132);
          --ctp-frappe-maroon: rgb(234, 153, 156);
          --ctp-frappe-yellow: rgb(229, 200, 144);
          --ctp-frappe-green: rgb(166, 209, 137);
          --ctp-frappe-teal: rgb(129, 200, 190);
          --ctp-frappe-blue: rgb(140, 170, 238);
          --ctp-frappe-text: rgb(198, 208, 245);
          --ctp-frappe-subtext0: rgb(165, 173, 206);
          --ctp-frappe-overlay1: rgb(131, 139, 167);
          --ctp-frappe-overlay0: rgb(115, 121, 148);
          --ctp-frappe-surface2: rgb(98, 104, 128);
          --ctp-frappe-surface1: rgb(81, 87, 109);
          --ctp-frappe-surface0: rgb(65, 69, 89);
          --ctp-frappe-base: rgb(48, 52, 70);
          --ctp-frappe-mantle: rgb(41, 44, 60);
          --ctp-frappe-crust: rgb(35, 38, 52);

          --ddge-text-primary: var(--ctp-frappe-text);
          --ddge-text-secondary: var(--ctp-frappe-subtext0);
          --ddge-bg-surface0: var(--ctp-frappe-surface0);
          --ddge-bg-surface1: var(--ctp-frappe-surface1);
          --ddge-bg-surface2: var(--ctp-frappe-surface2);
          --ddge-bg-base: var(--ctp-frappe-base);
          --ddge-border-color: rgb(from var(--ctp-frappe-surface1) r g b / 0.4);
          --ddge-border-color-stronger: rgb(from var(--ctp-frappe-overlay0) r g b / 0.6);
          --ddge-button-bg: rgb(from var(--ctp-frappe-surface0) r g b / 0.8);
          --ddge-button-hover-bg: rgb(from var(--ctp-frappe-surface1) r g b / 0.85);
          --ddge-button-active-bg: rgb(from var(--ctp-frappe-surface2) r g b / 0.9);
          --ddge-button-border: var(--ddge-border-color);
          --ddge-button-text: var(--ddge-text-primary);
          --ddge-button-shadow-hover: 0 0 10px 1px rgb(from var(--ctp-frappe-blue) r g b / 0.15);
          --ddge-highlight-bg: rgb(from var(--ctp-frappe-yellow) r g b / 0.3);
          --ddge-result-action-default-color:var(--ctp-frappe-overlay1);
          --ddge-copy-link-button-hover-color: var(--ctp-frappe-blue);
          --ddge-copy-link-button-copied-color: var(--ctp-frappe-green);
          --ddge-copy-link-button-failed-color: var(--ctp-frappe-red);
          --ddge-site-search-button-hover-color: var(--ctp-frappe-teal);
          --ddge-site-block-button-hover-color: var(--ctp-frappe-maroon);
          --ddge-dual-col-result-bg: rgb(from var(--ctp-frappe-mantle) r g b / 0.2);
          --ddge-dual-col-result-border: rgb(from var(--ctp-frappe-surface0) r g b / 0.3);
          --ddge-toggle-button-disabled-opacity: 0.5;
          --ddge-shadow-color: rgb(from var(--ctp-frappe-crust) r g b / 0.1);
        }

        .${Config.CSS_CLASSES.SEARCH_ENGINE_GROUP} {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          max-width: 800px;
          margin: 12px auto;
          padding: 0 10px;
        }
        .${Config.CSS_CLASSES.MATERIAL_BUTTON} {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 7px 14px;
          border: 1px solid var(--ddge-button-border);
          border-radius: 8px;
          box-sizing: border-box;
          font-family: ${this.SETTINGS.UI_FONT_STACK};
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ddge-button-text);
          text-align: center;
          background-color: var(--ddge-button-bg);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: background-color ${this.SETTINGS.ANIMATION_DURATION_MS}ms ${this.SETTINGS.ANIMATION_EASING_STANDARD},
                      border-color ${this.SETTINGS.ANIMATION_DURATION_MS}ms ${this.SETTINGS.ANIMATION_EASING_STANDARD},
                      transform ${this.SETTINGS.BUTTON_TRANSFORM_DURATION} ${this.SETTINGS.ANIMATION_EASING_STANDARD},
                      box-shadow ${this.SETTINGS.ANIMATION_DURATION_MS}ms ${this.SETTINGS.ANIMATION_EASING_STANDARD};
          box-shadow: 0 1px 2px var(--ddge-shadow-color);
        }
        .${Config.CSS_CLASSES.MATERIAL_BUTTON}:hover {
          background-color: var(--ddge-button-hover-bg);
          border-color: var(--ddge-border-color-stronger);
          transform: translateY(-1px);
          box-shadow: var(--ddge-button-shadow-hover);
        }
        .${Config.CSS_CLASSES.MATERIAL_BUTTON}:active {
          background-color: var(--ddge-button-active-bg);
          transform: translateY(0px) scale(0.98);
          box-shadow: none;
        }

        .${Config.CSS_CLASSES.SEARCH_ENGINE_BUTTON} {
           flex-grow: 1;
           flex-basis: 110px;
           flex-shrink: 0;
           min-width: 110px;
        }
        .${Config.CSS_CLASSES.SEARCH_ENGINE_ICON} {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          vertical-align: middle;
        }
        #${Config.ELEMENT_IDS.SYNTAX_SHORTCUTS_CONTAINER} {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .${Config.CSS_CLASSES.KEYWORD_HIGHLIGHT} {
          padding: 0 2px;
          border-radius: 3px;
          color: inherit;
          background-color: var(--ddge-highlight-bg);
          box-shadow: none;
        }
        .${Config.CSS_CLASSES.TOGGLE_BUTTON_WRAPPER} {
          display: inline-flex;
          align-items: center;
          margin-right: 10px;
          vertical-align: middle;
        }
        .${Config.CSS_CLASSES.TOGGLE_BUTTON} {
          padding: 5px 12px;
          font-size: 13px;
          line-height: 1.2;
          opacity: 1;
          transition: opacity ${this.SETTINGS.ANIMATION_DURATION_MS}ms ${this.SETTINGS.ANIMATION_EASING_STANDARD};
        }

        #${Config.ELEMENT_IDS.HIGHLIGHT_TOGGLE_WRAPPER}.${Config.CSS_CLASSES.HIGHLIGHTING_DISABLED} > button,
        #${Config.ELEMENT_IDS.DUAL_COLUMN_TOGGLE_WRAPPER}:not(.${Config.CSS_CLASSES.DUAL_COLUMN_ACTIVE}) > button {
          opacity: var(--ddge-toggle-button-disabled-opacity);
        }

        ${Config.ELEMENT_SELECTORS.WEB_RESULT} {
          position: relative;
        }
        ${Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_CONTAINER} {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON},
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON},
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON} {
          position: relative;
          top: 0px;
          display: inline-flex;
          align-items: center;
          height: 28px;
          padding: 0;
          margin-left: 4px;
          border: none;
          border-radius: 6px;
          background-color: transparent;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
          transition: opacity 0.2s ease-in-out,
                      background-color 0.2s ${this.SETTINGS.ANIMATION_EASING_STANDARD},
                      color 0.15s ${this.SETTINGS.ANIMATION_EASING_STANDARD};
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON} {
          color: var(--ddge-result-action-default-color);
        }
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON} {
          color: var(--ddge-result-action-default-color);
        }
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON} {
          color: var(--ddge-result-action-default-color);
        }


        ${Config.ELEMENT_SELECTORS.WEB_RESULT}:hover .${Config.CSS_CLASSES.COPY_LINK_BUTTON},
        ${Config.ELEMENT_SELECTORS.WEB_RESULT}:hover .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON},
        ${Config.ELEMENT_SELECTORS.WEB_RESULT}:hover .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON} {
          opacity: 1;
          pointer-events: auto;
        }

        .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px;
          transition: transform 0.25s ${this.SETTINGS.ANIMATION_EASING_STANDARD};
          z-index: 1;
        }
        .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} svg {
          width: 14px;
          height: 14px;
          display: block;
          fill: currentColor;
        }

        .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
          opacity: 0;
          transform: translateX(5px)  scaleX(0.8);
          transform-origin: left center;
          white-space: nowrap;
          margin-left: 0px;
          padding-right: 0px;
          font-size: 10.5px;
          font-weight: 500;
          line-height: 28px;
          max-width: 0;
          overflow: hidden;
          transition: max-width 0.25s ${this.SETTINGS.ANIMATION_EASING_STANDARD} 0.05s,
                      opacity 0.2s ${this.SETTINGS.ANIMATION_EASING_STANDARD} 0.1s,
                      transform 0.25s ${this.SETTINGS.ANIMATION_EASING_APPLE_SMOOTH_OUT} 0.05s,
                      margin-left 0.25s ${this.SETTINGS.ANIMATION_EASING_STANDARD} 0.05s,
                      padding-right 0.25s ${this.SETTINGS.ANIMATION_EASING_STANDARD} 0.05s;
          pointer-events: none;
        }

        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:hover,
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:hover,
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:hover {
          background-color: var(--ddge-bg-surface0);
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:hover {
          color: var(--ddge-copy-link-button-hover-color);
        }
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:hover {
          color: var(--ddge-site-search-button-hover-color);
        }
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:hover {
          color: var(--ddge-site-block-button-hover-color);
        }


        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER},
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER},
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
          transform: translateX(-2px);
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL},
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL},
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:hover .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
          opacity: 1;
          transform: translateX(0) scaleX(1);
          max-width: 120px;
          margin-left: -2px;
          padding-right: 7px;
          pointer-events: auto;
        }

        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER},
        .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER},
        .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
            transform: scale(0.9) translateX(-2px);
        }
         .${Config.CSS_CLASSES.COPY_LINK_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL},
         .${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL},
         .${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}:active .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
           transform: scaleX(1) translateX(0) scaleY(0.95);
        }

        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED},
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED} {
            opacity: 1 !important;
            pointer-events: auto !important;
            background-color: var(--ddge-bg-surface0) !important;
            padding-right: 7px !important;
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED} .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER},
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED} .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
            transform: translateX(0) !important;
        }
         .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED} .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL},
         .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED} .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
            opacity: 1 !important;
            transform: translateX(0) scaleX(1) !important;
            max-width: 120px !important;
            margin-left: 6px !important;
            padding-right: 7px !important;
        }
         .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED} .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
            color: var(--ddge-copy-link-button-copied-color) !important;
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED} .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
            color: var(--ddge-copy-link-button-copied-color) !important;
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED} .${Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER} {
            color: var(--ddge-copy-link-button-failed-color) !important;
        }
        .${Config.CSS_CLASSES.COPY_LINK_BUTTON}.${Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED} .${Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL} {
            color: var(--ddge-copy-link-button-failed-color) !important;
        }

        ${Config.ELEMENT_SELECTORS.HEADER_ACTIONS} {
          display: flex;
          align-items: center;
        }

        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.CONTENT_WRAPPER} {
            max-width: none !important;
            width: auto !important;
            padding: 0 20px !important;
        }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.LAYOUT_CONTAINER} {
            display: block !important;
            width: 100% !important;
        }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.MAINLINE_SECTION} {
            float: none !important;
            width: 100% !important;
            max-width: none !important;
            margin-right: 0 !important;
        }
         body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.SIDEBAR} {
            position: absolute !important;
            left: -9999px !important;
            display: none !important;
         }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} {
          width: 100%;
          padding: 0;
          overflow: auto;
          list-style: none;
          margin-top: 20px;
        }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER}::after {
           content: "";
           display: table;
           clear: both;
        }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} > li:not(${Config.ELEMENT_SELECTORS.PAGE_SEPARATOR_LI}) {
           float: left !important;
           width: calc(50% - 15px) !important;
           min-height: 160px !important;
           margin: 0 7.5px 15px 7.5px !important;
           padding: 18px !important;
           border: 1px solid var(--ddge-dual-col-result-border) !important;
           border-radius: 10px !important;
           box-sizing: border-box !important;
           overflow: hidden !important;
           background-color: var(--ddge-dual-col-result-bg) !important;
           box-shadow: 0 1px 3px var(--ddge-shadow-color);
           transition: border-color 0.2s ${this.SETTINGS.ANIMATION_EASING_STANDARD}, background-color 0.2s ${this.SETTINGS.ANIMATION_EASING_STANDARD};
        }
         body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} > li:not(${Config.ELEMENT_SELECTORS.PAGE_SEPARATOR_LI}):hover {
             border-color: var(--ctp-frappe-overlay0);
             background-color: rgb(from var(--ctp-frappe-surface0) r g b / 0.3);
         }
         body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} > ${Config.ELEMENT_SELECTORS.PAGE_SEPARATOR_LI} {
             float: none !important;
             clear: both !important;
             width: 100% !important;
             min-height: auto !important;
             margin: 25px 0 !important;
             padding: 0 !important;
             border: none !important;
             box-sizing: content-box !important;
             overflow: visible !important;
             background: none !important;
         }
         body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} > ${Config.ELEMENT_SELECTORS.PAGE_SEPARATOR_LI} > div {
             text-align: center;
         }
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} ${Config.ELEMENT_SELECTORS.WEB_RESULT_TITLE_SPAN},
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} ${Config.ELEMENT_SELECTORS.WEB_RESULT_SNIPPET},
        body.${Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT} ${Config.ELEMENT_SELECTORS.RESULTS_CONTAINER} ${Config.ELEMENT_SELECTORS.WEB_RESULT_URL} {
            overflow-wrap: break-word !important;
            word-break: break-word !important;
            hyphens: auto !important;
        }
      `;
      try {
        GM_addStyle(styles);
      } catch (e) {
        const styleElement = document.createElement("style");
        styleElement.textContent = styles;
        (document.head || document.documentElement).appendChild(styleElement);
      }
    },

    createButton(options) {
      const button = document.createElement("button");
      button.type = "button";
      if (options.className) button.className = options.className;
      if (options.id) button.id = options.id;
      if (options.text) button.textContent = options.text;
      if (options.innerHTML) button.innerHTML = options.innerHTML;
      if (options.ariaLabel)
        button.setAttribute("aria-label", options.ariaLabel);
      if (options.onClick)
        button.addEventListener(
          "click",
          options.onClick,
          options.useCapture ?? false
        );
      if (options.dataset) {
        for (const key in options.dataset)
          button.dataset[key] = options.dataset[key];
      }
      return button;
    },

    createToggleButton(wrapperId, config, isActive, handler) {
      const existingToggle = document.getElementById(wrapperId);
      if (existingToggle) return existingToggle.querySelector("button");

      const headerActionsContainer = document.querySelector(
        Config.ELEMENT_SELECTORS.HEADER_ACTIONS
      );
      if (!headerActionsContainer) return null;

      const toggleElement = document.createElement("div");
      toggleElement.id = wrapperId;
      toggleElement.classList.add(Config.CSS_CLASSES.TOGGLE_BUTTON_WRAPPER);
      if (config.activeClass)
        toggleElement.classList.toggle(config.activeClass, isActive);
      if (config.disabledClass)
        toggleElement.classList.toggle(config.disabledClass, !isActive);

      const toggleButtonEl = this.createButton({
        className: `${Config.CSS_CLASSES.TOGGLE_BUTTON} ${Config.CSS_CLASSES.MATERIAL_BUTTON}`,
        text: config.label,
        ariaLabel: config.label,
        onClick: handler,
        useCapture: true,
      });
      toggleButtonEl.setAttribute("aria-pressed", String(isActive));
      toggleElement.appendChild(toggleButtonEl);

      const referenceNode = config.insertAfterId
        ? document.getElementById(config.insertAfterId)?.nextSibling
        : headerActionsContainer.firstChild;
      headerActionsContainer.insertBefore(toggleElement, referenceNode || null);
      return toggleButtonEl;
    },
  };

  const FeatureManager = {
    initializeFeatures() {
      this.insertSyntaxShortcuts();
      this.insertEngineButtons();
      this.insertHighlightToggle();
      this.insertDualColumnToggle();
      this.insertCopyLinkButtons();
      this.insertSiteSearchButtons();
      this.insertBlockSiteButtons();
      this.removeUselessButtons();
      this.applyInitialFeatureStates();
    },

    applyInitialFeatureStates() {
      this.applyDualColumnLayout();
      this.updateHighlightToggleVisuals();
      this.updateDualColumnToggleVisuals();
      this.refreshHighlights();
    },

    insertEngineButtons() {
      const searchForm = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_FORM
      );
      if (!searchForm || !searchForm.parentNode) return;
      const existingGroup = document.querySelector(
        `.${Config.CSS_CLASSES.SEARCH_ENGINE_GROUP}`
      );
      if (existingGroup) existingGroup.remove();

      const engineGroupEl = document.createElement("div");
      engineGroupEl.className = Config.CSS_CLASSES.SEARCH_ENGINE_GROUP;

      Config.FEATURE_CONFIGS.ALTERNATE_SEARCH_ENGINES.forEach((engine) => {
        const engineButtonEl = UserInterface.createButton({
          className: `${Config.CSS_CLASSES.SEARCH_ENGINE_BUTTON} ${Config.CSS_CLASSES.MATERIAL_BUTTON}`,
          onClick: (event) => {
            event.preventDefault();
            this.triggerSearchEngine(engine.id);
          },
        });
        const engineIconEl = document.createElement("img");
        engineIconEl.className = Config.CSS_CLASSES.SEARCH_ENGINE_ICON;
        engineIconEl.src = `https://icons.duckduckgo.com/ip3/${engine.iconHost}.ico`;
        engineIconEl.alt = `${engine.name} Icon`;
        const engineNameText = document.createTextNode(
          `转至 ${engine.name} 搜索`
        );
        engineButtonEl.appendChild(engineIconEl);
        engineButtonEl.appendChild(engineNameText);
        engineGroupEl.appendChild(engineButtonEl);
      });
      searchForm.parentNode.insertBefore(engineGroupEl, searchForm.nextSibling);
    },

    applyHighlightsToNode(node, keywords) {
      if (!node || !keywords || keywords.length === 0) return;
      const nodeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let textNodeToProcess;
      const nodesToProcess = [];
      while ((textNodeToProcess = nodeWalker.nextNode())) {
        if (
          textNodeToProcess.parentElement &&
          textNodeToProcess.parentElement.closest(
            `script, style, .${Config.CSS_CLASSES.KEYWORD_HIGHLIGHT}`
          )
        )
          continue;
        nodesToProcess.push(textNodeToProcess);
      }
      const keywordRegex = new RegExp(
        keywords.map(this.escapeRegex).join("|"),
        "gi"
      );
      nodesToProcess.forEach((textNode) => {
        const text = textNode.nodeValue;
        if (!text) return;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        while ((match = keywordRegex.exec(text)) !== null) {
          const index = match.index;
          const matchedText = match[0];
          if (index > lastIndex)
            fragment.appendChild(
              document.createTextNode(text.substring(lastIndex, index))
            );
          const mark = document.createElement("mark");
          mark.className = Config.CSS_CLASSES.KEYWORD_HIGHLIGHT;
          mark.appendChild(document.createTextNode(matchedText));
          fragment.appendChild(mark);
          lastIndex = index + matchedText.length;
        }
        if (lastIndex < text.length)
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex))
          );
        if (fragment.hasChildNodes())
          textNode.parentNode?.replaceChild(fragment, textNode);
      });
    },

    removeHighlights() {
      document
        .querySelectorAll(`.${Config.CSS_CLASSES.KEYWORD_HIGHLIGHT}`)
        .forEach((highlightElement) => {
          const parentElement = highlightElement.parentNode;
          if (parentElement) {
            const textNode = document.createTextNode(
              highlightElement.textContent || ""
            );
            parentElement.replaceChild(textNode, highlightElement);
            parentElement.normalize();
          }
        });
    },

    refreshHighlights() {
      this.removeHighlights();
      if (!State.isHighlightActive) return;
      const searchInputElement = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_INPUT
      );
      if (!searchInputElement) return;
      const searchQuery = searchInputElement.value.trim();
      if (!searchQuery) return;
      const searchKeywords = searchQuery.split(/\s+/).filter(Boolean);
      if (searchKeywords.length === 0) return;

      const pageType = this.getCurrentPageType();
      const config = Config.FEATURE_CONFIGS.HIGHLIGHT_SELECTORS[pageType];
      if (!config || !config.itemSelector || !config.targetSelectors) return;

      const resultItems = document.querySelectorAll(config.itemSelector);
      resultItems.forEach((item) => {
        config.targetSelectors.forEach((selector) => {
          const targetElements = item.querySelectorAll(selector);
          targetElements.forEach((element) =>
            this.applyHighlightsToNode(element, searchKeywords)
          );
        });
      });
    },

    handleHighlightToggle(event) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      State.setHighlightState(!State.isHighlightActive);
      this.updateHighlightToggleVisuals();
      this.refreshHighlights();
    },

    updateHighlightToggleVisuals() {
      const toggleElement = document.getElementById(
        Config.ELEMENT_IDS.HIGHLIGHT_TOGGLE_WRAPPER
      );
      if (toggleElement) {
        toggleElement.classList.toggle(
          Config.CSS_CLASSES.HIGHLIGHTING_DISABLED,
          !State.isHighlightActive
        );
        const button = toggleElement.querySelector("button");
        if (button)
          button.setAttribute("aria-pressed", String(State.isHighlightActive));
      }
    },

    insertHighlightToggle() {
      UserInterface.createToggleButton(
        Config.ELEMENT_IDS.HIGHLIGHT_TOGGLE_WRAPPER,
        {
          label: UserInterface.STRINGS.HIGHLIGHT_TOGGLE_LABEL,
          disabledClass: Config.CSS_CLASSES.HIGHLIGHTING_DISABLED,
        },
        State.isHighlightActive,
        this.handleHighlightToggle.bind(this)
      );
    },

    getCurrentPageType() {
      const urlParams = new URLSearchParams(window.location.search);
      const iaParam = urlParams.get("ia");
      if (iaParam === "images") return "images";
      if (iaParam === "videos") return "videos";
      if (iaParam === "news") return "news";
      return "web";
    },

    applyDualColumnLayout() {
      const pageType = this.getCurrentPageType();
      const shouldApply = State.isDualColumnActive && pageType === "web";
      document.body.classList.toggle(
        Config.CSS_CLASSES.DUAL_COLUMN_LAYOUT,
        shouldApply
      );
    },

    handleDualColumnToggle(event) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      State.setDualColumnState(!State.isDualColumnActive);
      this.applyDualColumnLayout();
      this.updateDualColumnToggleVisuals();
    },

    updateDualColumnToggleVisuals() {
      const toggleElement = document.getElementById(
        Config.ELEMENT_IDS.DUAL_COLUMN_TOGGLE_WRAPPER
      );
      if (toggleElement) {
        toggleElement.classList.toggle(
          Config.CSS_CLASSES.DUAL_COLUMN_ACTIVE,
          State.isDualColumnActive && this.getCurrentPageType() === "web"
        );
        const button = toggleElement.querySelector("button");
        if (button)
          button.setAttribute("aria-pressed", String(State.isDualColumnActive));
      }
    },

    insertDualColumnToggle() {
      UserInterface.createToggleButton(
        Config.ELEMENT_IDS.DUAL_COLUMN_TOGGLE_WRAPPER,
        {
          label: UserInterface.STRINGS.DUAL_COLUMN_TOGGLE_LABEL,
          activeClass: Config.CSS_CLASSES.DUAL_COLUMN_ACTIVE,
          insertAfterId: Config.ELEMENT_IDS.HIGHLIGHT_TOGGLE_WRAPPER,
        },
        State.isDualColumnActive,
        this.handleDualColumnToggle.bind(this)
      );
    },

    _getDomainFromUrl(urlString) {
      if (!urlString) return null;
      try {
        let domain = new URL(urlString).hostname;
        if (domain.startsWith("www.")) {
          domain = domain.substring(4);
        }
        return domain;
      } catch (e) {
        return null;
      }
    },

    insertCopyLinkButtons() {
      const resultElements = document.querySelectorAll(
        Config.ELEMENT_SELECTORS.WEB_RESULT
      );
      resultElements.forEach((resultElement) => {
        if (
          resultElement.querySelector(`.${Config.CSS_CLASSES.COPY_LINK_BUTTON}`)
        )
          return;
        const optionsContainer = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_CONTAINER
        );
        const optionsButton = optionsContainer?.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_BUTTON
        );
        const titleLinkElement = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_TITLE_LINK
        );
        if (
          !optionsContainer ||
          !optionsButton ||
          !titleLinkElement ||
          !titleLinkElement.href
        )
          return;

        const copyUrl = titleLinkElement.href;
        let feedbackTimeoutId = null;

        const iconWrapper = document.createElement("span");
        iconWrapper.className = Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER;
        iconWrapper.innerHTML = UserInterface.STRINGS.SVG_ICON_COPY_LINK;

        const textLabel = document.createElement("span");
        textLabel.className = Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL;
        textLabel.textContent = UserInterface.STRINGS.COPY_BUTTON_TEXT_LABEL;

        const copyButton = UserInterface.createButton({
          className: Config.CSS_CLASSES.COPY_LINK_BUTTON,
          ariaLabel: UserInterface.STRINGS.COPY_BUTTON_DEFAULT_ARIA_LABEL,
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            clearTimeout(feedbackTimeoutId);
            navigator.clipboard
              .writeText(copyUrl)
              .then(() => {
                iconWrapper.innerHTML =
                  UserInterface.STRINGS.SVG_ICON_COPY_SUCCESS;
                textLabel.textContent =
                  UserInterface.STRINGS.COPY_BUTTON_SUCCESS_ARIA_LABEL;
                copyButton.setAttribute(
                  "aria-label",
                  UserInterface.STRINGS.COPY_BUTTON_SUCCESS_ARIA_LABEL
                );
                copyButton.classList.remove(
                  Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED
                );
                copyButton.classList.add(
                  Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED
                );
                copyButton.disabled = true;
                feedbackTimeoutId = setTimeout(() => {
                  if (
                    copyButton.classList.contains(
                      Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED
                    )
                  ) {
                    iconWrapper.innerHTML =
                      UserInterface.STRINGS.SVG_ICON_COPY_LINK;
                    textLabel.textContent =
                      UserInterface.STRINGS.COPY_BUTTON_TEXT_LABEL;
                    copyButton.setAttribute(
                      "aria-label",
                      UserInterface.STRINGS.COPY_BUTTON_DEFAULT_ARIA_LABEL
                    );
                    copyButton.classList.remove(
                      Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED
                    );
                    copyButton.disabled = false;
                  }
                }, UserInterface.SETTINGS.COPY_FEEDBACK_DURATION_MS);
              })
              .catch(() => {
                iconWrapper.innerHTML =
                  UserInterface.STRINGS.SVG_ICON_COPY_FAILURE;
                textLabel.textContent =
                  UserInterface.STRINGS.COPY_BUTTON_FAILURE_ARIA_LABEL;
                copyButton.setAttribute(
                  "aria-label",
                  UserInterface.STRINGS.COPY_BUTTON_FAILURE_ARIA_LABEL
                );
                copyButton.classList.remove(
                  Config.CSS_CLASSES.COPY_LINK_BUTTON_COPIED
                );
                copyButton.classList.add(
                  Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED
                );
                copyButton.disabled = true;
                feedbackTimeoutId = setTimeout(() => {
                  if (
                    copyButton.classList.contains(
                      Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED
                    )
                  ) {
                    iconWrapper.innerHTML =
                      UserInterface.STRINGS.SVG_ICON_COPY_LINK;
                    textLabel.textContent =
                      UserInterface.STRINGS.COPY_BUTTON_TEXT_LABEL;
                    copyButton.setAttribute(
                      "aria-label",
                      UserInterface.STRINGS.COPY_BUTTON_DEFAULT_ARIA_LABEL
                    );
                    copyButton.classList.remove(
                      Config.CSS_CLASSES.COPY_LINK_BUTTON_FAILED
                    );
                    copyButton.disabled = false;
                  }
                }, UserInterface.SETTINGS.COPY_FEEDBACK_DURATION_MS);
              });
          },
        });
        copyButton.appendChild(iconWrapper);
        copyButton.appendChild(textLabel);
        optionsContainer.insertBefore(copyButton, optionsButton);
      });
    },

    insertSiteSearchButtons() {
      const resultElements = document.querySelectorAll(
        Config.ELEMENT_SELECTORS.WEB_RESULT
      );
      resultElements.forEach((resultElement) => {
        if (
          resultElement.querySelector(
            `.${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}`
          )
        )
          return;
        const optionsContainer = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_CONTAINER
        );
        const titleLinkElement = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_TITLE_LINK
        );

        if (!optionsContainer || !titleLinkElement) return;

        const url = titleLinkElement.href;
        const domain = this._getDomainFromUrl(url);

        if (!domain) return;

        const iconWrapper = document.createElement("span");
        iconWrapper.className = Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER;
        iconWrapper.innerHTML = UserInterface.STRINGS.SVG_ICON_SITE_SEARCH;

        const textLabel = document.createElement("span");
        textLabel.className = Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL;
        textLabel.textContent =
          UserInterface.STRINGS.SITE_SEARCH_BUTTON_TEXT_LABEL;

        const siteSearchButton = UserInterface.createButton({
          className: Config.CSS_CLASSES.SITE_SEARCH_BUTTON,
          ariaLabel: UserInterface.STRINGS.SITE_SEARCH_BUTTON_ARIA_LABEL,
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            const searchInput = document.querySelector(
              Config.ELEMENT_SELECTORS.SEARCH_INPUT
            );
            const searchForm = document.querySelector(
              Config.ELEMENT_SELECTORS.SEARCH_FORM
            );
            if (searchInput && searchForm) {
              const currentQuery = searchInput.value
                .trim()
                .replace(/site:[\w.-]+\s*/gi, "")
                .trim();
              searchInput.value = `site:${domain} ${currentQuery}`.trim();
              searchForm.submit();
            }
          },
        });
        siteSearchButton.appendChild(iconWrapper);
        siteSearchButton.appendChild(textLabel);

        const copyLinkButton = optionsContainer.querySelector(
          `.${Config.CSS_CLASSES.COPY_LINK_BUTTON}`
        );
        if (copyLinkButton) {
          optionsContainer.insertBefore(siteSearchButton, copyLinkButton);
        } else {
          const optionsButton = optionsContainer.querySelector(
            Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_BUTTON
          );
          optionsContainer.insertBefore(siteSearchButton, optionsButton);
        }
      });
    },

    insertBlockSiteButtons() {
      const resultElements = document.querySelectorAll(
        Config.ELEMENT_SELECTORS.WEB_RESULT
      );
      resultElements.forEach((resultElement) => {
        if (
          resultElement.querySelector(
            `.${Config.CSS_CLASSES.SITE_BLOCK_BUTTON}`
          )
        )
          return;
        const optionsContainer = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_CONTAINER
        );
        const titleLinkElement = resultElement.querySelector(
          Config.ELEMENT_SELECTORS.WEB_RESULT_TITLE_LINK
        );

        if (!optionsContainer || !titleLinkElement) return;

        const url = titleLinkElement.href;
        const domain = this._getDomainFromUrl(url);

        if (!domain) return;

        const iconWrapper = document.createElement("span");
        iconWrapper.className = Config.CSS_CLASSES.RESULT_ACTION_ICON_WRAPPER;
        iconWrapper.innerHTML = UserInterface.STRINGS.SVG_ICON_BLOCK_SITE;

        const textLabel = document.createElement("span");
        textLabel.className = Config.CSS_CLASSES.RESULT_ACTION_TEXT_LABEL;
        textLabel.textContent =
          UserInterface.STRINGS.BLOCK_SITE_BUTTON_TEXT_LABEL;

        const blockSiteButton = UserInterface.createButton({
          className: Config.CSS_CLASSES.SITE_BLOCK_BUTTON,
          ariaLabel: UserInterface.STRINGS.BLOCK_SITE_BUTTON_ARIA_LABEL,
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            const searchInput = document.querySelector(
              Config.ELEMENT_SELECTORS.SEARCH_INPUT
            );
            const searchForm = document.querySelector(
              Config.ELEMENT_SELECTORS.SEARCH_FORM
            );
            if (searchInput && searchForm) {
              let currentQuery = searchInput.value.trim();
              const blockSiteTerm = `-site:${domain}`;
              const blockSiteRegex = new RegExp(
                this.escapeRegex(blockSiteTerm),
                "i"
              );

              if (!currentQuery.match(blockSiteRegex)) {
                currentQuery = `${currentQuery} ${blockSiteTerm}`.trim();
              }
              searchInput.value = currentQuery;
              searchForm.submit();
            }
          },
        });
        blockSiteButton.appendChild(iconWrapper);
        blockSiteButton.appendChild(textLabel);

        const siteSearchButton = optionsContainer.querySelector(
          `.${Config.CSS_CLASSES.SITE_SEARCH_BUTTON}`
        );
        if (siteSearchButton) {
          optionsContainer.insertBefore(blockSiteButton, siteSearchButton);
        } else {
          const copyLinkButton = optionsContainer.querySelector(
            `.${Config.CSS_CLASSES.COPY_LINK_BUTTON}`
          );
          if (copyLinkButton) {
            optionsContainer.insertBefore(blockSiteButton, copyLinkButton);
          } else {
            const optionsButton = optionsContainer.querySelector(
              Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_BUTTON
            );
            optionsContainer.insertBefore(blockSiteButton, optionsButton);
          }
        }
      });
    },

    removeUselessButtons() {
      const feedbackContainer = document.querySelector(
        Config.ELEMENT_SELECTORS.FEEDBACK_BUTTON_CONTAINER
      );
      if (feedbackContainer) {
        feedbackContainer.remove();
      }

      const privacyPromoContainer = document.querySelector(
        Config.ELEMENT_SELECTORS.PRIVACY_PROMO_CONTAINER
      );
      if (privacyPromoContainer) {
        privacyPromoContainer.remove();
      }

      const allOptionsButtons = document.querySelectorAll(
        Config.ELEMENT_SELECTORS.WEB_RESULT_OPTIONS_BUTTON
      );
      allOptionsButtons.forEach((button) => button.remove());
    },

    applyExactPhrase() {
      const input = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_INPUT
      );
      if (!input) return;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;
      if (start !== null && end !== null && start !== end) {
        const selectedText = value.substring(start, end);
        const prefix = value.substring(0, start);
        const suffix = value.substring(end);
        if (prefix.endsWith('"') && suffix.startsWith('"')) {
          input.setSelectionRange(start, end);
        } else {
          input.value = `${prefix}"${selectedText}"${suffix}`;
          input.setSelectionRange(start + 1, end + 1);
        }
      } else {
        if (value && (!value.startsWith('"') || !value.endsWith('"'))) {
          input.value = `"${value}"`;
        }
        input.setSelectionRange(input.value.length, input.value.length);
      }
      input.focus();
    },

    applyExclusion() {
      const input = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_INPUT
      );
      if (!input) return;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;
      let newValue;
      let newCursorPos;
      if (start !== null && end !== null && start !== end) {
        const selectedText = value.substring(start, end);
        newValue = `${value.substring(
          0,
          start
        )}-${selectedText}${value.substring(end)}`;
        newCursorPos = start + 1;
        const newEndPos = end + 1;
        input.value = newValue;
        input.setSelectionRange(newCursorPos, newEndPos);
      } else {
        const currentCursorPos = start !== null ? start : value.length;
        newValue = `${value.substring(0, currentCursorPos)}-${value.substring(
          currentCursorPos
        )}`;
        newCursorPos = currentCursorPos + 1;
        input.value = newValue;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
      input.focus();
    },

    appendOperatorToSearch(operator) {
      const input = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_INPUT
      );
      if (!input) return;
      const currentValue = input.value;
      const prefix =
        currentValue.length > 0 && !currentValue.endsWith(" ") ? " " : "";
      const operatorWithSpace = `${prefix}${operator} `;
      input.value = `${currentValue}${operatorWithSpace}`;
      const newCursorPos = input.value.length;
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    },

    insertSyntaxShortcuts() {
      let shortcutsContainer = document.getElementById(
        Config.ELEMENT_IDS.SYNTAX_SHORTCUTS_CONTAINER
      );
      if (shortcutsContainer) shortcutsContainer.remove();
      const searchArea = document.querySelector(
        Config.ELEMENT_SELECTORS.HEADER_SEARCH_AREA
      );
      if (!searchArea || !searchArea.firstChild) return;

      shortcutsContainer = document.createElement("div");
      shortcutsContainer.id = Config.ELEMENT_IDS.SYNTAX_SHORTCUTS_CONTAINER;
      Config.FEATURE_CONFIGS.SYNTAX_SHORTCUTS.forEach((config) => {
        const button = UserInterface.createButton({
          className: `${Config.CSS_CLASSES.SYNTAX_SHORTCUT_BUTTON} ${Config.CSS_CLASSES.MATERIAL_BUTTON}`,
          text: config.text,
          onClick: (e) => {
            e.preventDefault();
            if (config.actionIdentifier === "appendOperator")
              this.appendOperatorToSearch(config.syntax);
            else if (config.actionIdentifier === "applyExactPhrase")
              this.applyExactPhrase();
            else if (config.actionIdentifier === "applyExclusion")
              this.applyExclusion();
          },
        });
        shortcutsContainer.appendChild(button);
      });
      searchArea.insertBefore(shortcutsContainer, searchArea.firstChild);
    },

    navigateTabs(direction) {
      const allTabElements = Array.from(
        document.querySelectorAll(Config.ELEMENT_SELECTORS.NAV_TAB)
      );
      if (allTabElements.length === 0) return;
      const visibleTabElements = allTabElements.filter(
        (tab) =>
          tab.textContent.trim() !== UserInterface.STRINGS.EXCLUDED_NAV_TAB_TEXT
      );
      if (visibleTabElements.length === 0) return;

      const currentTabIndex = allTabElements.findIndex((tab) =>
        tab.classList.contains(Config.CSS_CLASSES.ACTIVE_NAV_TAB)
      );
      let isMapTabActive = false;
      let activeTabIndexInVisible = -1;

      if (currentTabIndex !== -1) {
        if (
          allTabElements[currentTabIndex].textContent.trim() ===
          UserInterface.STRINGS.EXCLUDED_NAV_TAB_TEXT
        )
          isMapTabActive = true;
        else
          activeTabIndexInVisible = visibleTabElements.findIndex((tab) =>
            tab.classList.contains(Config.CSS_CLASSES.ACTIVE_NAV_TAB)
          );
      } else {
        const tabUrlParams = new URLSearchParams(window.location.search);
        if (tabUrlParams.get("iaxm") === "maps") isMapTabActive = true;
      }

      let nextTabIndex;
      const numVisibleTabs = visibleTabElements.length;
      if (isMapTabActive || activeTabIndexInVisible === -1) {
        nextTabIndex = direction === "next" ? 0 : numVisibleTabs - 1;
      } else {
        nextTabIndex =
          direction === "next"
            ? (activeTabIndexInVisible + 1) % numVisibleTabs
            : (activeTabIndexInVisible - 1 + numVisibleTabs) % numVisibleTabs;
      }
      const nextTabElement = visibleTabElements[nextTabIndex];
      if (nextTabElement) nextTabElement.click();
    },

    triggerSearchEngine(engineId) {
      const engine = Config.FEATURE_CONFIGS.ALTERNATE_SEARCH_ENGINES.find(
        (e) => e.id === engineId
      );
      if (!engine) return;
      const currentSearchInput = document.querySelector(
        Config.ELEMENT_SELECTORS.SEARCH_INPUT
      );
      const query = currentSearchInput ? currentSearchInput.value.trim() : "";
      if (query) {
        const searchURL = `${engine.urlTemplate}${encodeURIComponent(query)}`;
        window.open(searchURL, "_blank", "noopener,noreferrer");
      }
    },
    escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
  };

  const EventManager = {
    domObserver: null,
    debouncedRunPageEnhancements: null,
    keydownListener: null,
    SETTINGS: {
      SCROLL_TOP_TRIGGER_RATIO: 0.2,
      DOM_OBSERVER_DELAY_MS: 1000,
    },

    init() {
      this.debouncedRunPageEnhancements = this.debounce(
        FeatureManager.initializeFeatures.bind(FeatureManager),
        this.SETTINGS.DOM_OBSERVER_DELAY_MS
      );
      this.domObserver = new MutationObserver(
        this.debouncedRunPageEnhancements
      );
      this.keydownListener = this.createKeyboardListener();
      window.addEventListener("keydown", this.keydownListener, true);
      document.addEventListener(
        "dblclick",
        this.handleDoubleClickToTop.bind(this),
        { passive: true }
      );
      this.observeDOM();
    },

    debounce(callback, delayMs) {
      let timeoutId;
      return function debounced(...args) {
        const later = () => {
          clearTimeout(timeoutId);
          callback(...args);
        };
        clearTimeout(timeoutId);
        timeoutId = setTimeout(later, delayMs);
      };
    },

    handleDoubleClickToTop(event) {
      const viewportWidth = window.innerWidth;
      const scrollTriggerX =
        viewportWidth * (1 - this.SETTINGS.SCROLL_TOP_TRIGGER_RATIO);
      if (
        event.clientX > scrollTriggerX &&
        !event.target.closest(Config.ELEMENT_SELECTORS.INTERACTIVE_ELEMENT)
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    createKeyboardListener() {
      const specialActionHandlers = {
        handleHighlightToggle:
          FeatureManager.handleHighlightToggle.bind(FeatureManager),
        handleDualColumnToggle:
          FeatureManager.handleDualColumnToggle.bind(FeatureManager),
        navigateTabsNext: () => FeatureManager.navigateTabs("next"),
        navigateTabsPrev: () => FeatureManager.navigateTabs("prev"),
      };
      Config.FEATURE_CONFIGS.ALTERNATE_SEARCH_ENGINES.forEach((engine) => {
        if (engine.shortcutKey) {
          specialActionHandlers[`triggerSearchEngine_${engine.id}`] = () =>
            FeatureManager.triggerSearchEngine(engine.id);
        }
      });

      const shortcutActionMap = {};
      State.currentKeybindingConfig.SHORTCUTS.forEach((shortcut) => {
        if (shortcut.key) {
          const lowerKey = shortcut.key.toLowerCase();
          if (
            shortcut.actionIdentifier &&
            specialActionHandlers[shortcut.actionIdentifier]
          ) {
            shortcutActionMap[lowerKey] =
              specialActionHandlers[shortcut.actionIdentifier];
          }
        }
      });

      return function handleKeyDown(event) {
        if (!(event.altKey || event.ctrlKey)) return;
        const targetElement = event.target;
        const targetElementTag = targetElement?.tagName?.toLowerCase();
        if (
          targetElementTag === "input" ||
          targetElementTag === "textarea" ||
          targetElementTag === "select" ||
          targetElement?.isContentEditable
        ) {
          return;
        }
        const pressedKey = event.key.toLowerCase();
        const actionToExecute = shortcutActionMap[pressedKey];
        if (typeof actionToExecute === "function") {
          event.preventDefault();
          actionToExecute(event);
        }
      };
    },

    observeDOM() {
      if (document.body) {
        FeatureManager.initializeFeatures();
        this.domObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            if (document.body) {
              FeatureManager.initializeFeatures();
              this.domObserver.observe(document.body, {
                childList: true,
                subtree: true,
              });
            }
          },
          { once: true }
        );
      }
    },
  };

  const ScriptManager = {
    init() {
      try {
        State.initialize();
        UserInterface.injectStyles();
        EventManager.init();
      } catch (error) {}
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ScriptManager.init(), {
      once: true,
    });
  } else {
    ScriptManager.init();
  }
})();
