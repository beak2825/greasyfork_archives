// ==UserScript==
// @name             YouTube Incremental Subtitles Sidebar - Modernized
// @namespace        http://tampermonkey.net/
// @version          3.0.2 // バージョン更新 (オーバーレイコントロールの表示/非表示をマウスオーバーで制御)
// @description      Modernized UI. Persistent subtitle monitoring. Normal mode minimizes to corner (X icon). Overlay mode has its own minimize (X icon) and mode switch (⇄ icon). Enhanced hover effects for minimized states. When minimized (even from overlay mode), native YouTube subtitles will be shown. Overlay controls fade in on mouseover of text area or controls, and fade out on mouseleave from sidebar.
// @author           You (Modified by AI Designer)
// @match            *://*.youtube.com/*
// @exclude          *://music.youtube.com/*
// @exclude          *://*.youtube.com/embed/*
// @exclude          *://*.youtube.com/live_chat*
// @exclude          *://*.youtube.com/live_chat_replay*
// @exclude          *://studio.youtube.com/*
// @icon             data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGMDAwMCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIxLjU4IDcuMTljLS4yMy0uODYtLjkxLTEuNTQtMS43Ny0xLjc3QzE4LjI1IDUgMTIgNSAxMiA1cy02LjI1IDAtNy44MS40MmMtLjg2LjIzLTEuNTQuOTEtMS43NyAxLjc3QzIgOC43NSAyIDEyIDIgMTJzMCAzLjI1LjQyIDQuODFjLjIzLjg2LjkxIDEuNTQgMS43NyAxLjc3QzUuNzUgMTkgMTIgMTkgMTIgMTlzNi4yNSAwIDcuODEtLjQyYy44Ni0uMjMgMS41NC0uOTEgMS43Ny0xLjc3QzIyIDE1LjI1IDIyIDEyIDIyIDEyczAtMy4yNS0uNDItNC44MXpNOS41IDE1LjVWOC41bDYuNSAzLjUtNi41IDMuNXoiLz48L3N2Zz4=
// @grant            GM_addStyle
// @grant            GM_setValue
// @grant            GM_getValue
// @run-at           document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537025/YouTube%20Incremental%20Subtitles%20Sidebar%20-%20Modernized.user.js
// @updateURL https://update.greasyfork.org/scripts/537025/YouTube%20Incremental%20Subtitles%20Sidebar%20-%20Modernized.meta.js
// ==/UserScript==

// --- Script Main Logic ---
(function() {
    'use strict';

    // --- グローバル状態変数 ---
    let accumulatedSubtitles = '';    // 蓄積された字幕テキスト
    let previousFullCaptionText = ''; // 前回処理したYouTube字幕のフルテキスト
    let currentLang = '';             // 現在の字幕言語

    let currentFontSize = GM_getValue('sidebarFontSize', 14);
    let currentFontFamilyKey = GM_getValue('sidebarFontFamilyKey', 'default');
    let isSidebarCollapsed = GM_getValue('sidebarCollapsed', false);      // 通常モードのサイドバーが最小化されているか
    let lastExpandedHeight = GM_getValue('sidebarSize', { height: '450px' }).height; // 通常モード展開時の高さ
    let isOverlayModeActive = GM_getValue('sidebarOverlayModeActive', false); // オーバーレイモードが有効か
    let isOverlayMinimized = GM_getValue('overlayMinimized', false);      // オーバーレイモード自体が最小化されているか

    // --- 定数定義 ---
    const DEFAULT_FONT_SIZE = 14;
    const MIN_FONT_SIZE = 10;
    const MAX_FONT_SIZE = 24;
    const FONT_SIZE_STEP = 1;
    const FONT_FAMILIES = {
        'default': '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
        'メイリオ (日)': '"メイリオ", Meiryo, sans-serif',
        'Noto Sans JP (日)': '"Noto Sans JP", sans-serif',
        'BIZ UDPゴシック (日)': '"BIZ UDPGothic", sans-serif',
        '源ノ角ゴシック (日)': '"Source Han Sans JP", "源ノ角ゴシック JP", "Noto Sans CJK JP", sans-serif',
        'Open Sans (欧文)': '"Open Sans", sans-serif',
        'Lato (欧文)': '"Lato", sans-serif',
        'Roboto (欧文)': '"Roboto", sans-serif',
        'Verdana (欧文)': 'Verdana, Geneva, sans-serif',
        '手書き風 (日)': '"Sawarabi Gothic", "自家製 Rounded M+", "Rounded Mplus 1c", cursive, sans-serif',
        '教科書体 (日)': '"教科書ICA", "教科書体", serif',
        'ピクセル風 (日/欧)': '"PixelMplus10", "DotGothic16", "Press Start 2P", monospace, sans-serif',
        'UD丸ゴシック (日)': '"M PLUS Rounded 1c", "ヒラギノ丸ゴ ProN W4", "Hiragino Maru Gothic ProN", sans-serif',
        'Comic Sans MS (欧文)': '"Comic Sans MS", "Comic Sans", cursive, sans-serif',
        'Impact (欧文)': 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans-serif',
    };
    const DEFAULT_FONT_FAMILY_KEY = 'default';

    // オーバーレイモード展開時のスタイル
    const OVERLAY_MODE_BACKGROUND_RGB = '20, 20, 20';
    const OVERLAY_MODE_BACKGROUND_OPACITY = 0.80;
    const OVERLAY_MODE_TEXT_COLOR = '#FFFFFF';

    // オーバーレイモードのコントロールボタン共通スタイル用
    const OVERLAY_CONTROL_BUTTON_BG_RGB = '30,30,30';
    const OVERLAY_CONTROL_BUTTON_BG_OPACITY = 0.75;
    const OVERLAY_CONTROL_BUTTON_TEXT_COLOR = '#E0E0E0';
    const OVERLAY_CONTROL_BUTTON_BORDER_RGB = '60,60,60';
    const OVERLAY_CONTROL_BUTTON_BORDER_OPACITY = 0.7;
    const OVERLAY_CONTROL_ICON_SIZE = "18px";

    // オーバーレイモード展開時のデフォルト位置・サイズ
    const OVERLAY_MODE_DEFAULT_WIDTH = '70%';
    const OVERLAY_MODE_DEFAULT_HEIGHT = '120px';
    const OVERLAY_MODE_DEFAULT_TOP = '85%';
    const OVERLAY_MODE_DEFAULT_LEFT = '50%';
    const OVERLAY_MODE_DEFAULT_TRANSFORM = 'translateX(-50%)';

    // 共通の最小化ボタン（プレースホルダー）関連の定数
    const MINIMIZED_BUTTON_SIZE = '44px';
    const MINIMIZED_ICON_SIZE = '20px';
    const MINIMIZED_BUTTON_BOTTOM_OFFSET = '20px';
    const MINIMIZED_BUTTON_RIGHT_OFFSET = '20px';


    // --- SVGアイコン定義 ---
    const HEADER_ICON_SIZE = "18px";
    const SVG_ICONS = {
        close: `<svg viewBox="0 0 24 24" width="${HEADER_ICON_SIZE}" height="${HEADER_ICON_SIZE}" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
        fontIncrease: `<svg viewBox="0 0 24 24" width="16px" height="16px" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        fontDecrease: `<svg viewBox="0 0 24 24" width="16px" height="16px" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>`,
        clear: `<svg viewBox="0 0 24 24" width="${HEADER_ICON_SIZE}" height="${HEADER_ICON_SIZE}" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        subtitleLineIcon: `<svg viewBox="0 0 24 24" fill="currentColor" width="${MINIMIZED_ICON_SIZE}" height="${MINIMIZED_ICON_SIZE}"><rect x="4" y="7" width="16" height="2.5"></rect><rect x="4" y="12" width="16" height="2.5"></rect><rect x="4" y="17" width="12" height="2.5"></rect></svg>`,
        switchView: `<svg viewBox="0 0 24 24" width="${HEADER_ICON_SIZE}" height="${HEADER_ICON_SIZE}" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zm10.02-6v3H10v2h7.01v3L21 9l-3.99-4z"/></svg>`,
        closeOverlayControl: `<svg viewBox="0 0 24 24" width="${OVERLAY_CONTROL_ICON_SIZE}" height="${OVERLAY_CONTROL_ICON_SIZE}" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
        switchViewOverlayControl: `<svg viewBox="0 0 24 24" width="${OVERLAY_CONTROL_ICON_SIZE}" height="${OVERLAY_CONTROL_ICON_SIZE}" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zm10.02-6v3H10v2h7.01v3L21 9l-3.99-4z"/></svg>`,
    };

    // --- UI要素生成補助関数 ---
    function createIconButton(id, title, svgIconHtml, baseClass = 'yt-sidebar-icon-button') {
        const button = document.createElement('button');
        if (id) button.id = id;
        button.title = title;
        button.classList.add(baseClass);
        button.innerHTML = svgIconHtml;
        return button;
    }

    // --- サイドバーのコアUI要素の構築 ---
    const sidebar = document.createElement('div');
    sidebar.id = 'youtube-incremental-subtitles-sidebar';

    const header = document.createElement('div');
    header.id = 'yt-sidebar-header';
    const titleContainer = document.createElement('div'); titleContainer.id = 'yt-sidebar-title-container'; const title = document.createElement('span'); title.id = 'yt-sidebar-title'; title.textContent = '字幕履歴'; titleContainer.appendChild(title); header.appendChild(titleContainer);
    const controlsContainer = document.createElement('div'); controlsContainer.id = 'yt-sidebar-controls';
    const fontSizeControl = document.createElement('div'); fontSizeControl.className = 'yt-sidebar-control-group';
    const decreaseFontButton = createIconButton(null, 'フォント縮小', SVG_ICONS.fontDecrease);
    const fontSizeDisplay = document.createElement('span'); fontSizeDisplay.id = 'yt-font-size-display';
    const increaseFontButton = createIconButton(null, 'フォント拡大', SVG_ICONS.fontIncrease);
    fontSizeControl.appendChild(decreaseFontButton); fontSizeControl.appendChild(fontSizeDisplay); fontSizeControl.appendChild(increaseFontButton); controlsContainer.appendChild(fontSizeControl);
    const fontFamilySelect = document.createElement('select'); fontFamilySelect.id = 'yt-font-family-select'; fontFamilySelect.title = 'フォント選択';
    for (const key in FONT_FAMILIES) { const option = document.createElement('option'); option.value = key; option.textContent = key; fontFamilySelect.appendChild(option); }
    controlsContainer.appendChild(fontFamilySelect);
    const clearButton = createIconButton('youtube-subtitles-clear-button', 'クリア', SVG_ICONS.clear); controlsContainer.appendChild(clearButton);
    const enterOverlayModeButton = createIconButton('yt-sidebar-enter-overlay-button', 'オーバーレイモードに切り替え', SVG_ICONS.switchView); controlsContainer.appendChild(enterOverlayModeButton);
    const minimizeSidebarButton = createIconButton('yt-sidebar-minimize-button', '最小化', SVG_ICONS.close); controlsContainer.appendChild(minimizeSidebarButton);
    header.appendChild(controlsContainer);
    sidebar.appendChild(header);

    const sidebarTextContent = document.createElement('div');
    sidebarTextContent.id = 'yt-sidebar-text-content';
    sidebar.appendChild(sidebarTextContent);

    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'yt-sidebar-resize-handle';
    sidebar.appendChild(resizeHandle);

    const overlayControls = document.createElement('div');
    overlayControls.id = 'yt-sidebar-overlay-controls';
    const exitOverlayToNormalButton = createIconButton('yt-overlay-exit-to-normal-button', '通常モードに戻る (展開表示)', SVG_ICONS.switchViewOverlayControl, 'yt-overlay-control-button');
    const minimizeOverlayButton = createIconButton('yt-overlay-minimize-button', 'オーバーレイを最小化', SVG_ICONS.closeOverlayControl, 'yt-overlay-control-button');
    overlayControls.appendChild(minimizeOverlayButton);
    overlayControls.appendChild(exitOverlayToNormalButton);
    sidebar.appendChild(overlayControls);

    const minimizedPlaceholder = document.createElement('div');
    minimizedPlaceholder.id = 'yt-sidebar-minimized-placeholder';
    minimizedPlaceholder.innerHTML = SVG_ICONS.subtitleLineIcon;
    sidebar.appendChild(minimizedPlaceholder);

    document.body.appendChild(sidebar);

    // --- スタイル関連ユーティリティ関数 ---
    let ytColors = {};
    function parseRgb(rgbString) { if (!rgbString || !rgbString.includes('rgb')) return null; const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d\.]+)?\)/); return match ? `${match[1]},${match[2]},${match[3]}` : null; }
    function getYouTubeColors() {
        const rootStyle = getComputedStyle(document.documentElement);
        const bodyStyle = getComputedStyle(document.body);
        const isDarkMode = document.documentElement.getAttribute('dark') === 'true' || (parseRgb(rootStyle.getPropertyValue('--yt-spec-general-background-a').trim() || bodyStyle.backgroundColor) || "0,0,0").split(',').reduce((acc, val) => acc + parseInt(val), 0) < 384;
        let bodyBgRgb = parseRgb(rootStyle.getPropertyValue('--yt-spec-base-background').trim() || bodyStyle.backgroundColor) || (isDarkMode ? '28,28,28' : '248,248,248');
        let headerBgRgb = parseRgb(rootStyle.getPropertyValue('--yt-spec-surface').trim() || rootStyle.getPropertyValue('--yt-spec-menu-background').trim()) || (isDarkMode ? '32,32,32' : '244,244,244');
        let mainText = rootStyle.getPropertyValue('--yt-spec-text-primary').trim() || bodyStyle.color || (isDarkMode ? '#f1f1f1' : '#030303');
        let titleText = rootStyle.getPropertyValue('--yt-spec-text-secondary').trim() || mainText;
        let generalBackgroundA = parseRgb(rootStyle.getPropertyValue('--yt-spec-general-background-a').trim() || bodyStyle.backgroundColor) || (isDarkMode ? '28,28,28' : '255,255,255');
        let buttonBg, buttonText, buttonBorder, buttonHoverBg, buttonActiveBg;
        if (isDarkMode) {
            buttonBg = rootStyle.getPropertyValue('--yt-spec-badge-chip-background').trim() || 'rgba(255,255,255,0.1)';
            buttonText = rootStyle.getPropertyValue('--yt-spec-text-primary').trim() || '#f1f1f1';
            buttonBorder = rootStyle.getPropertyValue('--yt-spec-10-percent-layer').trim() || 'rgba(255,255,255,0.15)';
            buttonHoverBg = rootStyle.getPropertyValue('--yt-spec-hover-background').trim() || 'rgba(255,255,255,0.2)';
            buttonActiveBg = 'rgba(255,255,255,0.25)';
        } else {
            buttonBg = rootStyle.getPropertyValue('--yt-spec-badge-chip-background').trim() || 'rgba(0,0,0,0.05)';
            buttonText = rootStyle.getPropertyValue('--yt-spec-text-primary').trim() || '#0f0f0f';
            buttonBorder = rootStyle.getPropertyValue('--yt-spec-10-percent-layer').trim() || 'rgba(0,0,0,0.1)';
            buttonHoverBg = rootStyle.getPropertyValue('--yt-spec-hover-background').trim() || 'rgba(0,0,0,0.1)';
            buttonActiveBg = 'rgba(0,0,0,0.15)';
        }
        return {
            bodyBg: `rgba(${bodyBgRgb}, 0.96)`, mainText: mainText,
            headerBg: `rgba(${headerBgRgb}, 0.98)`, border: rootStyle.getPropertyValue('--yt-spec-10-percent-layer').trim() || (isDarkMode ? '#4a4a4a' : '#e0e0e0'),
            buttonBg: buttonBg, buttonText: buttonText, buttonBorder: buttonBorder, buttonHoverBg: buttonHoverBg, buttonActiveBg: buttonActiveBg,
            scrollbarTrack: `rgba(${parseRgb(bodyStyle.backgroundColor) || (isDarkMode ? '20,20,20' : '230,230,230')}, 0.3)`,
            scrollbarThumb: rootStyle.getPropertyValue('--yt-spec-icon-disabled').trim() || (isDarkMode ? '#666' : '#aaa'),
            titleText: titleText,
            handleColor: rootStyle.getPropertyValue('--yt-spec-icon-active-other').trim() || (isDarkMode ? '#909090' : '#707070'),
            selectArrowColor: isDarkMode ? 'f1f1f1' : '0f0f0f',
            generalBackgroundA_rgb: generalBackgroundA,
            isDarkMode: isDarkMode
        };
    }

    // --- 動的スタイル適用関数 ---
    function applyDynamicStyles() {
        ytColors = getYouTubeColors();
        const styleSheet = document.getElementById('yt-sidebar-dynamic-styles') || document.createElement('style');
        styleSheet.id = 'yt-sidebar-dynamic-styles';

        let baseSidebarBg = ytColors.bodyBg;
        let baseSidebarColor = ytColors.mainText;
        let baseSidebarTextContentColor = ytColors.mainText;
        let baseResizeHandleColor = ytColors.handleColor;
        let baseBorderColor = `1px solid ${ytColors.border} !important`;

        if (isOverlayModeActive && !isOverlayMinimized) {
            baseSidebarBg = `rgba(${OVERLAY_MODE_BACKGROUND_RGB}, ${OVERLAY_MODE_BACKGROUND_OPACITY}) !important`;
            baseSidebarColor = `${OVERLAY_MODE_TEXT_COLOR} !important`;
            baseSidebarTextContentColor = `${OVERLAY_MODE_TEXT_COLOR} !important`;
            baseResizeHandleColor = `${OVERLAY_MODE_TEXT_COLOR} !important`;
            baseBorderColor = '1px solid rgba(255,255,255,0.1) !important';
        }

        const selectArrowSVG = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23${ytColors.selectArrowColor}" d="M7 10l5 5 5-5z"/></svg>`);

        let minimizedPlaceholderBgNormal, minimizedPlaceholderBgHover;
        let minimizedPlaceholderIconColorNormal, minimizedPlaceholderIconColorHover;
        let minimizedPlaceholderShadowNormal, minimizedPlaceholderShadowHover;
        const generalBgRgbArray = ytColors.generalBackgroundA_rgb.split(',');

        if (ytColors.isDarkMode) {
            minimizedPlaceholderBgNormal = `rgba(${generalBgRgbArray[0]}, ${generalBgRgbArray[1]}, ${generalBgRgbArray[2]}, 0.5)`;
            minimizedPlaceholderBgHover = `rgba(${generalBgRgbArray[0]}, ${generalBgRgbArray[1]}, ${generalBgRgbArray[2]}, 0.8)`;
            minimizedPlaceholderIconColorNormal = 'rgba(241,241,241,0.65)';
            minimizedPlaceholderIconColorHover = '#f1f1f1';
            minimizedPlaceholderShadowNormal = '0 1px 4px rgba(0, 0, 0, 0.4)';
            minimizedPlaceholderShadowHover = '0px 5px 15px rgba(0, 0, 0, 0.45)';
        } else {
            minimizedPlaceholderBgNormal = `rgba(${generalBgRgbArray[0]}, ${generalBgRgbArray[1]}, ${generalBgRgbArray[2]}, 0.5)`;
            minimizedPlaceholderBgHover = `rgba(210, 210, 210, 0.9)`;
            minimizedPlaceholderIconColorNormal = 'rgba(15,15,15,0.55)';
            minimizedPlaceholderIconColorHover = '#0f0f0f';
            minimizedPlaceholderShadowNormal = '0 1px 4px rgba(0, 0, 0, 0.12)';
            minimizedPlaceholderShadowHover = '0px 5px 15px rgba(0, 0, 0, 0.22)';
        }

        const overlayCtrlBtnBg = `rgba(${OVERLAY_CONTROL_BUTTON_BG_RGB}, ${OVERLAY_CONTROL_BUTTON_BG_OPACITY}) !important`;
        const overlayCtrlBtnHoverBg = `rgba(${OVERLAY_CONTROL_BUTTON_BG_RGB}, ${Math.min(1, OVERLAY_CONTROL_BUTTON_BG_OPACITY + 0.15)}) !important`;
        const overlayCtrlBtnColor = `${OVERLAY_CONTROL_BUTTON_TEXT_COLOR} !important`;
        const overlayCtrlBtnBorder = `1px solid rgba(${OVERLAY_CONTROL_BUTTON_BORDER_RGB}, ${OVERLAY_CONTROL_BUTTON_BORDER_OPACITY}) !important`;

        styleSheet.textContent = `
            #youtube-incremental-subtitles-sidebar:not(.sidebar-minimized-to-corner) {
                background-color: ${baseSidebarBg}; color: ${baseSidebarColor};
                border: ${baseBorderColor};
            }
            #yt-sidebar-header {
                background-color: ${ytColors.headerBg} !important;
                border-bottom: 1px solid ${ytColors.border} !important;
            }
            #yt-sidebar-title { color: ${ytColors.titleText} !important; }
            .yt-sidebar-icon-button, #yt-font-family-select {
                background-color: transparent !important; color: ${ytColors.buttonText} !important;
                border: 1px solid transparent !important;
            }
            .yt-sidebar-icon-button:hover, #yt-font-family-select:hover { background-color: ${ytColors.buttonHoverBg} !important; }
            .yt-sidebar-icon-button:active, #yt-font-family-select:active { background-color: ${ytColors.buttonActiveBg} !important; }
            #yt-font-family-select {
                background-image: url("data:image/svg+xml,${selectArrowSVG}");
                border: 1px solid ${ytColors.buttonBorder} !important; background-color: ${ytColors.buttonBg} !important;
            }
            #yt-font-family-select option {
                background-color: ${ytColors.isDarkMode ? 'rgb(40, 40, 40)' : 'rgb(240, 240, 240)'} !important;
                color: ${ytColors.mainText} !important;
            }
            #yt-sidebar-text-content { color: ${baseSidebarTextContentColor}; }
            #yt-sidebar-text-content::-webkit-scrollbar-track { background: ${ytColors.scrollbarTrack} !important; }
            #yt-sidebar-text-content::-webkit-scrollbar-thumb { background: ${ytColors.scrollbarThumb} !important; }
            #yt-sidebar-resize-handle::before { border-color: ${baseResizeHandleColor}; }
            #yt-font-size-display {
                color: ${ytColors.mainText} !important; border: 1px solid ${ytColors.buttonBorder} !important;
                background-color: ${ytColors.buttonBg} !important;
            }
            .yt-overlay-control-button {
                background-color: ${overlayCtrlBtnBg}; color: ${overlayCtrlBtnColor};
                border: ${overlayCtrlBtnBorder};
            }
            .yt-overlay-control-button:hover { background-color: ${overlayCtrlBtnHoverBg}; }
            #yt-sidebar-minimized-placeholder {
                background-color: ${minimizedPlaceholderBgNormal};
                color: ${minimizedPlaceholderIconColorNormal};
                opacity: 0.75;
                box-shadow: ${minimizedPlaceholderShadowNormal};
            }
            #yt-sidebar-minimized-placeholder:hover {
                background-color: ${minimizedPlaceholderBgHover};
                color: ${minimizedPlaceholderIconColorHover};
                opacity: 1;
                transform: scale(1.1);
                box-shadow: ${minimizedPlaceholderShadowHover};
            }
        `;
        if (!styleSheet.parentNode) document.head.appendChild(styleSheet);
    }

    // --- 初期静的スタイル (GM_addStyle) ---
    GM_addStyle(`
        :root {
            --sidebar-border-radius: 12px;
            --sidebar-button-size: 30px;
            --sidebar-button-padding: 0;
            --header-icon-size: ${HEADER_ICON_SIZE};
            --sidebar-control-gap: 4px;
            --minimized-button-size-const: ${MINIMIZED_BUTTON_SIZE};
            --minimized-button-bottom: ${MINIMIZED_BUTTON_BOTTOM_OFFSET};
            --minimized-button-right: ${MINIMIZED_BUTTON_RIGHT_OFFSET};
            --overlay-control-button-size: 32px;
        }
        #youtube-incremental-subtitles-sidebar {
            position: fixed; z-index: 10000;
            display: none;
            flex-direction: column;
            font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
            user-select: none;
            box-sizing: border-box;
        }
        #youtube-incremental-subtitles-sidebar:not(.sidebar-minimized-to-corner) {
            min-width: 150px; min-height: 40px;
            max-height: 90vh; max-width: 90vw;
            border-radius: var(--sidebar-border-radius);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08);
            overflow: hidden;
            cursor: default;
        }
        #yt-sidebar-header {
            display: none;
            justify-content: space-between; align-items: center;
            padding: 0 12px; cursor: default; flex-shrink: 0; height: 44px;
            box-sizing: border-box;
        }
        #yt-sidebar-title-container { flex-grow: 1; margin-right: 12px; overflow: hidden; }
        #yt-sidebar-title { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        #yt-sidebar-controls { display: flex; align-items: center; gap: var(--sidebar-control-gap); flex-shrink: 0; margin-left: auto; }
        .yt-sidebar-icon-button {
            background: transparent; border: none; padding: var(--sidebar-button-padding);
            width: var(--sidebar-button-size); height: var(--sidebar-button-size);
            border-radius: 50%; cursor: pointer !important; display: inline-flex;
            align-items: center; justify-content: center;
            transition: background-color 0.15s ease-in-out; flex-shrink: 0;
        }
        .yt-sidebar-icon-button svg { width: var(--header-icon-size); height: var(--header-icon-size); fill: currentColor; display: block; }
        .yt-sidebar-control-group { display: flex; align-items: center; gap: 0; }
        .yt-sidebar-control-group .yt-sidebar-icon-button { border-radius: 0; width:28px; }
        .yt-sidebar-control-group .yt-sidebar-icon-button:first-child { border-top-left-radius: 15px; border-bottom-left-radius: 15px;}
        .yt-sidebar-control-group .yt-sidebar-icon-button:last-child { border-top-right-radius: 15px; border-bottom-right-radius: 15px;}
        #yt-font-size-display { padding: 0 8px; font-size: 13px; border-radius: 0; min-width: 30px; text-align: center; height: var(--sidebar-button-size); line-height:var(--sidebar-button-size); box-sizing: border-box; }
        #yt-font-family-select { appearance: none; -webkit-appearance: none; -moz-appearance: none; padding: 0 2em 0 0.7em; height: var(--sidebar-button-size); border-radius: calc(var(--sidebar-button-size) / 2); background-repeat: no-repeat; background-position: right .7em top 50%; background-size: .65em auto; font-size: 13px; box-sizing: border-box; cursor:pointer !important; transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out; }
        #yt-sidebar-text-content {
            display: none;
            flex-grow: 1; padding: 12px 16px;
            overflow-y: auto; white-space: pre-wrap; line-height: 1.65;
            cursor: default; font-size: ${currentFontSize}px;
        }
        #yt-sidebar-text-content::-webkit-scrollbar { width: 8px; }
        #yt-sidebar-text-content::-webkit-scrollbar-thumb { border-radius: 4px; }
        #yt-sidebar-resize-handle {
            display: none;
            position: absolute; bottom: 0; left: 0; width: 20px; height: 20px;
            cursor: sw-resize !important; z-index: 10;
            align-items: flex-end; justify-content: flex-start;
            padding: 4px; box-sizing: border-box;
        }
        #yt-sidebar-resize-handle::before { content: ''; position: absolute; bottom: 4px; left: 4px; width: 8px; height: 8px; border-bottom: 2.5px solid; border-left: 2.5px solid; opacity: 0.5; transition: opacity 0.2s ease; }
        #yt-sidebar-resize-handle:hover::before { opacity: 0.8; }
        #yt-sidebar-overlay-controls {
            display: none;
            position: absolute; top: 8px; right: 8px;
            z-index: 25;
            flex-direction: row-reverse;
            gap: 6px;
            opacity: 1; /* 初期値はJSで制御するが、CSSでのデフォルトは1としておく */
            transition: opacity 0.2s ease-in-out; /* --- 変更点: トランジション追加 --- */
        }
        .yt-overlay-control-button {
            padding: 0;
            width: var(--overlay-control-button-size); height: var(--overlay-control-button-size);
            border-radius: 50%;
            cursor: pointer !important; display: inline-flex;
            align-items: center; justify-content: center;
            transition: background-color 0.15s ease-in-out;
            flex-shrink: 0;
        }
        .yt-overlay-control-button svg { display: block; }
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner {
            width: var(--minimized-button-size-const);
            height: var(--minimized-button-size-const);
            bottom: var(--minimized-button-bottom);
            right: var(--minimized-button-right);
            top: auto !important; left: auto !important;
            transform: none !important;
            border-radius: 50%;
            overflow: visible;
            cursor: pointer;
            border: none !important;
            background-color: transparent !important;
            box-shadow: none !important;
        }
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner #yt-sidebar-header,
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner #yt-sidebar-text-content,
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner #yt-sidebar-resize-handle,
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner #yt-sidebar-overlay-controls {
            display: none !important;
        }
        #yt-sidebar-minimized-placeholder {
            display: none;
            width: 100%; height: 100%;
            border-radius: 50%;
            align-items: center; justify-content: center;
            transition-property: background-color, opacity, box-shadow, transform, color;
            transition-duration: 0.2s;
            transition-timing-function: ease-in-out;
            transform: scale(1);
        }
        #youtube-incremental-subtitles-sidebar.sidebar-minimized-to-corner #yt-sidebar-minimized-placeholder {
            display: flex;
        }
    `);

    // --- ネイティブ字幕表示制御 ---
    let nativeSubtitlesStyleElement = null;
    function toggleNativeSubtitlesVisibility(hide) {
        if (hide) {
            if (!nativeSubtitlesStyleElement) { nativeSubtitlesStyleElement = document.createElement('style'); nativeSubtitlesStyleElement.id = 'yt-hide-native-subs-style'; document.head.appendChild(nativeSubtitlesStyleElement); }
            nativeSubtitlesStyleElement.textContent = `body div#movie_player.playing-mode .ytp-caption-window-container, body div#movie_player.paused-mode .ytp-caption-window-container, body div#movie_player .ytp-caption-window-container { display: none !important; visibility: hidden !important; }`;
        } else {
            if (nativeSubtitlesStyleElement) { nativeSubtitlesStyleElement.textContent = ''; }
        }
    }

    // --- オーバーレイコントロール表示/非表示ヘルパー ---
    function showOverlayControls() {
        if (isOverlayModeActive && !isOverlayMinimized) {
            overlayControls.style.opacity = '1';
        }
    }

    function hideOverlayControls() {
        if (isOverlayModeActive && !isOverlayMinimized) {
            overlayControls.style.opacity = '0';
        }
    }


    // --- UI全体の状態管理と表示更新 ---
    function updateSidebarUI() {
        sidebar.classList.remove('sidebar-minimized-to-corner');
        minimizedPlaceholder.style.display = 'none';
        header.style.display = 'none';
        sidebarTextContent.style.display = 'none';
        resizeHandle.style.display = 'none';
        overlayControls.style.display = 'none';
        overlayControls.style.opacity = ''; // --- 変更点: 他のモードでopacityリセット ---
        sidebar.style.cursor = 'default';

        if (isOverlayModeActive && !isOverlayMinimized) {
            toggleNativeSubtitlesVisibility(true);
        } else {
            toggleNativeSubtitlesVisibility(false);
        }

        if (sidebar.style.display !== 'flex') return;

        if (isOverlayModeActive) {
            if (isOverlayMinimized) {
                sidebar.classList.add('sidebar-minimized-to-corner');
                minimizedPlaceholder.style.display = 'flex';
                minimizedPlaceholder.title = 'オーバーレイ字幕を再表示';
                sidebar.style.width = MINIMIZED_BUTTON_SIZE;
                sidebar.style.height = MINIMIZED_BUTTON_SIZE;
                sidebar.style.top = ''; sidebar.style.left = ''; sidebar.style.right = ''; sidebar.style.bottom = '';
                sidebar.style.transform = '';
            } else { // オーバーレイ展開時
                const pos = GM_getValue('sidebarOverlayModePosition', { top: OVERLAY_MODE_DEFAULT_TOP, left: OVERLAY_MODE_DEFAULT_LEFT, transform: OVERLAY_MODE_DEFAULT_TRANSFORM });
                const size = GM_getValue('sidebarOverlayModeSize', { width: OVERLAY_MODE_DEFAULT_WIDTH, height: OVERLAY_MODE_DEFAULT_HEIGHT });
                sidebar.style.top = pos.top;
                sidebar.style.left = pos.left;
                sidebar.style.transform = pos.transform || '';
                sidebar.style.right = 'auto';
                sidebar.style.width = size.width;
                sidebar.style.height = size.height;
                sidebar.style.bottom = 'auto';

                sidebarTextContent.style.display = 'block';
                resizeHandle.style.display = 'flex';
                overlayControls.style.display = 'flex';
                overlayControls.style.opacity = '0'; // --- 変更点: 初期は透明 ---
            }
        } else { // 通常モード
            if (isSidebarCollapsed) {
                sidebar.classList.add('sidebar-minimized-to-corner');
                minimizedPlaceholder.style.display = 'flex';
                minimizedPlaceholder.title = '字幕履歴を展開';
                sidebar.style.width = MINIMIZED_BUTTON_SIZE;
                sidebar.style.height = MINIMIZED_BUTTON_SIZE;
                sidebar.style.top = ''; sidebar.style.left = ''; sidebar.style.right = ''; sidebar.style.bottom = '';
                sidebar.style.transform = '';
            } else {
                header.style.display = 'flex';
                sidebarTextContent.style.display = 'block';
                resizeHandle.style.display = 'flex';

                const pos = GM_getValue('sidebarPosition', { top: '80px', right: '20px', left: null });
                const size = GM_getValue('sidebarSize', { width: '360px', height: '450px' });
                sidebar.style.top = pos.top;
                if (pos.left !== null && pos.left !== undefined && pos.left !== 'auto') {
                    sidebar.style.left = pos.left; sidebar.style.right = 'auto';
                } else {
                    sidebar.style.left = 'auto'; sidebar.style.right = pos.right;
                }
                sidebar.style.transform = '';
                sidebar.style.width = size.width;
                sidebar.style.height = lastExpandedHeight || size.height;
                sidebar.style.bottom = 'auto';

                if (sidebarTextContent.style.display === 'block') {
                    sidebarTextContent.textContent = formatDisplayText(accumulatedSubtitles, currentLang);
                    sidebarTextContent.scrollTop = sidebarTextContent.scrollHeight;
                }
            }
        }
        applyDynamicStyles();
        setupDragListener();
    }

    // --- イベントリスナー (各種UI操作) ---
    enterOverlayModeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOverlayModeActive) {
            GM_setValue('sidebarPosition', { top: sidebar.style.top, left: sidebar.style.left, right: sidebar.style.right });
            if (!isSidebarCollapsed) {
                GM_setValue('sidebarSize', { width: sidebar.style.width, height: sidebar.style.height });
            }
            GM_setValue('sidebarCollapsed', isSidebarCollapsed);
        }
        isOverlayModeActive = true;
        isOverlayMinimized = false;
        GM_setValue('sidebarOverlayModeActive', isOverlayModeActive);
        GM_setValue('overlayMinimized', isOverlayMinimized);
        updateSidebarUI();
    });

    minimizeSidebarButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOverlayModeActive) return;
        if (!isSidebarCollapsed) {
            lastExpandedHeight = sidebar.style.height;
        }
        isSidebarCollapsed = true;
        GM_setValue('sidebarCollapsed', isSidebarCollapsed);
        updateSidebarUI();
    });

    exitOverlayToNormalButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOverlayModeActive) {
            if (!isOverlayMinimized) {
                GM_setValue('sidebarOverlayModePosition', { top: sidebar.style.top, left: sidebar.style.left, transform: sidebar.style.transform });
                GM_setValue('sidebarOverlayModeSize', { width: sidebar.style.width, height: sidebar.style.height });
            }
            GM_setValue('overlayMinimized', isOverlayMinimized);
        }
        isOverlayModeActive = false;
        isSidebarCollapsed = false;
        isOverlayMinimized = false;
        GM_setValue('sidebarOverlayModeActive', isOverlayModeActive);
        GM_setValue('sidebarCollapsed', isSidebarCollapsed);
        updateSidebarUI();
    });

    minimizeOverlayButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOverlayModeActive) return;
        if (!isOverlayMinimized) {
            GM_setValue('sidebarOverlayModePosition', { top: sidebar.style.top, left: sidebar.style.left, transform: sidebar.style.transform });
            GM_setValue('sidebarOverlayModeSize', { width: sidebar.style.width, height: sidebar.style.height });
        }
        isOverlayMinimized = true;
        GM_setValue('overlayMinimized', isOverlayMinimized);
        updateSidebarUI();
    });

    minimizedPlaceholder.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOverlayModeActive && isOverlayMinimized) {
            isOverlayMinimized = false;
            GM_setValue('overlayMinimized', isOverlayMinimized);
        } else if (!isOverlayModeActive && isSidebarCollapsed) {
            isSidebarCollapsed = false;
            GM_setValue('sidebarCollapsed', isSidebarCollapsed);
        }
        updateSidebarUI();
    });

    // --- フォント・クリア処理 ---
    function updateFontStyles() {
        fontSizeDisplay.textContent = `${currentFontSize}px`;
        sidebarTextContent.style.fontSize = `${currentFontSize}px`;
        sidebarTextContent.style.fontFamily = FONT_FAMILIES[currentFontFamilyKey];
        if (sidebarTextContent.style.display === 'block' && sidebar.style.display === 'flex' &&
            ((isOverlayModeActive && !isOverlayMinimized) || (!isOverlayModeActive && !isSidebarCollapsed))) {
            sidebarTextContent.textContent = formatDisplayText(accumulatedSubtitles, currentLang);
        }
    }
    decreaseFontButton.addEventListener('click', (e) => { e.stopPropagation(); if (currentFontSize > MIN_FONT_SIZE) { currentFontSize -= FONT_SIZE_STEP; GM_setValue('sidebarFontSize', currentFontSize); updateFontStyles(); } });
    increaseFontButton.addEventListener('click', (e) => { e.stopPropagation(); if (currentFontSize < MAX_FONT_SIZE) { currentFontSize += FONT_SIZE_STEP; GM_setValue('sidebarFontSize', currentFontSize); updateFontStyles(); } });
    fontFamilySelect.addEventListener('change', (e) => { e.stopPropagation(); currentFontFamilyKey = e.target.value; GM_setValue('sidebarFontFamilyKey', currentFontFamilyKey); updateFontStyles(); });
    clearButton.addEventListener('click', (e) => { e.stopPropagation(); accumulatedSubtitles = ''; previousFullCaptionText = ''; if (sidebarTextContent.style.display === 'block' && sidebar.style.display === 'flex') { sidebarTextContent.textContent = ''; } });


    // --- ドラッグ・リサイズ処理 ---
    let isDraggingSidebar = false;
    let sidebarInitialX, sidebarInitialY, mouseInitialX, mouseInitialY;
    let currentDragTarget = null;

    function dragStartHandler(e) {
        if (sidebar.classList.contains('sidebar-minimized-to-corner')) return;
        if (e.target.closest('button, select, input, a, #yt-sidebar-resize-handle, #yt-sidebar-minimized-placeholder, #yt-sidebar-overlay-controls')) {
            return;
        }
        isDraggingSidebar = true;
        const rect = sidebar.getBoundingClientRect();
        sidebarInitialX = rect.left; sidebarInitialY = rect.top;
        mouseInitialX = e.clientX; mouseInitialY = e.clientY;
        if (sidebar.style.right !== 'auto' && sidebar.style.right !== '') {
            sidebar.style.left = `${rect.left}px`; sidebar.style.right = 'auto';
        }
        document.body.style.cursor = 'default'; document.body.style.userSelect = 'none';
        sidebar.style.userSelect = 'none'; if (sidebarTextContent) sidebarTextContent.style.userSelect = 'none';
    }
    function setupDragListener() {
        if (currentDragTarget) { currentDragTarget.removeEventListener('mousedown', dragStartHandler); }
        currentDragTarget = sidebar; // ドラッグ対象はサイドバー全体（ヘッダーだけでなく）
        if (currentDragTarget) { currentDragTarget.addEventListener('mousedown', dragStartHandler); }
    }

    let isResizing = false;
    let resizeMouseStartX, resizeMouseStartY, resizeInitialWidth, resizeInitialHeight, resizeInitialLeft, resizeInitialTop;
    resizeHandle.addEventListener('mousedown', (e) => {
        if (sidebar.classList.contains('sidebar-minimized-to-corner')) return;
        e.stopPropagation(); isResizing = true;
        resizeMouseStartX = e.clientX; resizeMouseStartY = e.clientY;
        const rect = sidebar.getBoundingClientRect();
        resizeInitialWidth = rect.width; resizeInitialHeight = rect.height;
        resizeInitialLeft = rect.left; resizeInitialTop = rect.top;
        document.body.style.cursor = 'sw-resize'; document.body.style.userSelect = 'none';
        sidebar.style.userSelect = 'none'; if (sidebarTextContent) sidebarTextContent.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingSidebar) {
            e.preventDefault();
            const deltaX = e.clientX - mouseInitialX; const deltaY = e.clientY - mouseInitialY;
            let newLeft = sidebarInitialX + deltaX; let newTop = sidebarInitialY + deltaY;
            const maxLeft = window.innerWidth - sidebar.offsetWidth;
            const maxTop = window.innerHeight - sidebar.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            sidebar.style.left = `${newLeft}px`; sidebar.style.top = `${newTop}px`;
            if (isOverlayModeActive && sidebar.style.transform) { sidebar.style.transform = ''; }
        } else if (isResizing) {
            if (sidebar.classList.contains('sidebar-minimized-to-corner')) return;
            e.preventDefault();
            const deltaX = e.clientX - resizeMouseStartX; const deltaY = e.clientY - resizeMouseStartY;
            let newWidth = resizeInitialWidth - deltaX; let newHeight = resizeInitialHeight + deltaY;
            const minWidth = parseFloat(getComputedStyle(sidebar).minWidth) || 150;
            let minHeightVal;
             if(isOverlayModeActive && !isOverlayMinimized) {
                minHeightVal = parseFloat(MINIMIZED_BUTTON_SIZE) || 44; // オーバーレイ展開時はヘッダーがないので、ボタンサイズを最小高さの目安にする
            } else { // 通常モード展開時
                minHeightVal = parseFloat(getComputedStyle(sidebar).minHeight) || (header.offsetHeight || 44);
            }
            const maxWidth = Math.max(minWidth, window.innerWidth * 0.9);
            const maxHeight = Math.max(minHeightVal, window.innerHeight * 0.9);
            newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
            newHeight = Math.max(minHeightVal, Math.min(newHeight, maxHeight));
            let newLeft = resizeInitialLeft + (resizeInitialWidth - newWidth);
            if (newLeft < 0) { newWidth = Math.max(minWidth, newWidth + newLeft); newLeft = 0; }
            if (newLeft + newWidth > window.innerWidth) { newWidth = Math.max(minWidth, window.innerWidth - newLeft); }
            if (resizeInitialTop + newHeight > window.innerHeight) { newHeight = Math.max(minHeightVal, window.innerHeight - resizeInitialTop); }
            sidebar.style.width = `${newWidth}px`; sidebar.style.height = `${newHeight}px`;
            sidebar.style.left = `${newLeft}px`;
            if (isOverlayModeActive && sidebar.style.transform) { sidebar.style.transform = ''; }
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingSidebar || isResizing) {
            document.body.style.cursor = 'default';
            if (!sidebar.classList.contains('sidebar-minimized-to-corner')) {
                let currentPosition = { top: sidebar.style.top, left: sidebar.style.left, right: sidebar.style.right, transform: sidebar.style.transform };
                let currentSize = { width: sidebar.style.width, height: sidebar.style.height };
                if (isOverlayModeActive && !isOverlayMinimized) {
                    GM_setValue('sidebarOverlayModePosition', { top: currentPosition.top, left: currentPosition.left, transform: currentPosition.transform });
                    GM_setValue('sidebarOverlayModeSize', currentSize);
                } else if (!isOverlayModeActive && !isSidebarCollapsed) {
                    let normalPositionToSave = { top: currentPosition.top, left: null, right: null };
                    if (sidebar.style.left !== 'auto' && sidebar.style.left !== '') { normalPositionToSave.left = currentPosition.left; }
                    else { normalPositionToSave.right = currentPosition.right; }
                    GM_setValue('sidebarPosition', normalPositionToSave);
                    GM_setValue('sidebarSize', currentSize);
                    lastExpandedHeight = currentSize.height;
                }
            }
            isDraggingSidebar = false; isResizing = false;
            document.body.style.userSelect = '';
            sidebar.style.userSelect = ''; if (sidebarTextContent) sidebarTextContent.style.userSelect = '';
        }
    });

    // --- 字幕処理ユーティリティ ---
    function getCurrentVisibleCaptionText(captionContainer) {
        let fullText = ""; const captionWindow = captionContainer.querySelector('.caption-window');
        if (!captionWindow || captionWindow.style.display === 'none') { currentLang = ''; return ""; }
        currentLang = captionWindow.getAttribute('lang') || '';
        fullText = Array.from(captionWindow.querySelectorAll('.ytp-caption-segment')).map(segment => segment.textContent).join('').replace(/\n+/g, ' ');
        return fullText.trim();
    }
    function ultraNormalizeText(text) { if (typeof text !== 'string') return ''; return text.replace(/[\s\n]+/g, ''); }
    function formatDisplayText(text, lang) {
        let formattedText = text;
        if (lang.startsWith('ja')) { formattedText = formattedText.replace(/[\s　]+/g, ''); }
        formattedText = formattedText.replace(/([。.])(?!\n)/g, '$1\n');
        return formattedText;
    }

    // --- 字幕監視ロジック ---
    let subtitleProcessingObserver = null;
    let captionContainerObserver = null;
    let captionContainerElement = null;

    function setupSubtitleProcessingObserver() {
        if (!captionContainerElement) return false;
        if (subtitleProcessingObserver) subtitleProcessingObserver.disconnect();
        subtitleProcessingObserver = new MutationObserver(mutations => {
            const currentVisibleText = getCurrentVisibleCaptionText(captionContainerElement);
            if (currentVisibleText !== previousFullCaptionText) {
                let textToAdd = "";
                if (currentVisibleText) {
                    const normCurrent = ultraNormalizeText(currentVisibleText);
                    const normPrevious = ultraNormalizeText(previousFullCaptionText);
                    if (previousFullCaptionText && normCurrent.startsWith(normPrevious) && normCurrent.length > normPrevious.length) {
                        if (currentVisibleText.startsWith(previousFullCaptionText)) {
                            textToAdd = currentVisibleText.substring(previousFullCaptionText.length);
                        } else { let tempText = currentVisibleText; if (accumulatedSubtitles.length > 0) { let bestOriginalOverlapLength = 0; const ultraNormalizedAccumulated = ultraNormalizeText(accumulatedSubtitles); for (let len = Math.min(tempText.length, 30); len >= 1; len--) { const originalPrefixOfTemp = tempText.substring(0, len); if (ultraNormalizedAccumulated.endsWith(ultraNormalizeText(originalPrefixOfTemp))) { bestOriginalOverlapLength = len; break; } } textToAdd = tempText.substring(bestOriginalOverlapLength); } else { textToAdd = tempText; } }
                    } else { let tempText = currentVisibleText; if (accumulatedSubtitles.length > 0) { let bestOriginalOverlapLength = 0; const ultraNormalizedAccumulated = ultraNormalizeText(accumulatedSubtitles); for (let len = Math.min(tempText.length, accumulatedSubtitles.length, 50); len >= 1; len--) { const originalPrefixOfTemp = tempText.substring(0, len); if (ultraNormalizedAccumulated.endsWith(ultraNormalizeText(originalPrefixOfTemp))) { bestOriginalOverlapLength = len; break; } } textToAdd = tempText.substring(bestOriginalOverlapLength); } else { textToAdd = tempText; } }
                }

                const trimmedTextToAdd = textToAdd.trim();
                if (trimmedTextToAdd) {
                    let prefix = "";
                    if (accumulatedSubtitles.length > 0) {
                        if (!currentLang.startsWith('ja') && !/[\s\n]$/.test(accumulatedSubtitles) && !/^\s/.test(trimmedTextToAdd)) { prefix = " "; }
                    }
                    accumulatedSubtitles += prefix + trimmedTextToAdd;
                }
                previousFullCaptionText = currentVisibleText;

                const shouldUpdateDOM = sidebar.style.display === 'flex' && (
                    (isOverlayModeActive && !isOverlayMinimized) ||
                    (!isOverlayModeActive && !isSidebarCollapsed)
                );
                if (shouldUpdateDOM && sidebarTextContent.style.display === 'block') {
                    sidebarTextContent.textContent = formatDisplayText(accumulatedSubtitles, currentLang);
                    sidebarTextContent.scrollTop = sidebarTextContent.scrollHeight;
                } else if (!currentVisibleText && accumulatedSubtitles && shouldUpdateDOM && sidebarTextContent.style.display === 'block') {
                    sidebarTextContent.textContent = formatDisplayText(accumulatedSubtitles, currentLang);
                }
            } else if (captionContainerElement.querySelector('.caption-window')) {
                const newLang = captionContainerElement.querySelector('.caption-window').getAttribute('lang') || '';
                if (currentVisibleText && newLang !== currentLang) {
                    currentLang = newLang;
                    const shouldUpdateDOM = sidebar.style.display === 'flex' && (
                        (isOverlayModeActive && !isOverlayMinimized) ||
                        (!isOverlayModeActive && !isSidebarCollapsed)
                    );
                    if (accumulatedSubtitles && shouldUpdateDOM && sidebarTextContent.style.display === 'block') {
                        sidebarTextContent.textContent = formatDisplayText(accumulatedSubtitles, currentLang);
                    }
                }
            }
        });
        try {
            subtitleProcessingObserver.observe(captionContainerElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'lang', 'class'], attributeOldValue: true });
        } catch(e) { console.warn("Sidebar: Error observing caption container.", e); return false; }
        return true;
    }
    function startSubtitleObservation() {
        if (subtitleProcessingObserver) return;
        captionContainerElement = document.getElementById('ytp-caption-window-container');
        if (captionContainerElement) {
            if (captionContainerObserver) { captionContainerObserver.disconnect(); captionContainerObserver = null; }
            setupSubtitleProcessingObserver();
            console.log("Sidebar: Subtitle observation started on existing container.");
        } else {
            if (captionContainerObserver) captionContainerObserver.disconnect();
            captionContainerObserver = new MutationObserver((mutations, obs) => {
                captionContainerElement = document.getElementById('ytp-caption-window-container');
                if (captionContainerElement) {
                    obs.disconnect(); captionContainerObserver = null;
                    setupSubtitleProcessingObserver();
                    console.log("Sidebar: Subtitle observation started on newly appeared container.");
                }
            });
            captionContainerObserver.observe(document.body, { childList: true, subtree: true });
            console.warn("Sidebar: Caption container not found. Observing body for its appearance to start observation.");
        }
    }
    function stopSubtitleObservation() {
        if (subtitleProcessingObserver) { subtitleProcessingObserver.disconnect(); subtitleProcessingObserver = null; }
        if (captionContainerObserver) { captionContainerObserver.disconnect(); captionContainerObserver = null; }
        captionContainerElement = null;
        console.log("Sidebar: Subtitle observation stopped.");
    }

    // --- YouTube字幕ボタン監視 ---
    let subtitlesButtonObserver = null;
    function setSidebarVisibilityBasedOnYTButton(isVisible) {
        sidebar.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) { updateSidebarUI(); }
    }
    function observeYouTubeSubtitleButton() {
        if (subtitlesButtonObserver) subtitlesButtonObserver.disconnect();
        const ytSubtitlesButton = document.querySelector('.ytp-subtitles-button');
        if (ytSubtitlesButton) {
            const initiallyActive = ytSubtitlesButton.getAttribute('aria-pressed') === 'true';
            setSidebarVisibilityBasedOnYTButton(initiallyActive);
            if (initiallyActive) { startSubtitleObservation(); } else { stopSubtitleObservation(); }
            subtitlesButtonObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'aria-pressed') {
                        const isActive = ytSubtitlesButton.getAttribute('aria-pressed') === 'true';
                        setSidebarVisibilityBasedOnYTButton(isActive);
                        if (isActive) { startSubtitleObservation(); } else { stopSubtitleObservation(); }
                    }
                });
            });
            subtitlesButtonObserver.observe(ytSubtitlesButton, { attributes: true, attributeFilter: ['aria-pressed'] });
        } else { setSidebarVisibilityBasedOnYTButton(false); stopSubtitleObservation(); setTimeout(observeYouTubeSubtitleButton, 1000); }
    }

    // --- オーバーレイコントロール表示制御イベント ---
    sidebarTextContent.addEventListener('mouseenter', showOverlayControls);
    overlayControls.addEventListener('mouseenter', showOverlayControls);
    sidebar.addEventListener('mouseleave', hideOverlayControls); // サイドバー全体から出たら非表示


    // --- 初期化・ページ遷移対応 ---
    function initializeSidebarState() {
        accumulatedSubtitles = ''; previousFullCaptionText = ''; currentLang = '';
        if (sidebarTextContent) sidebarTextContent.textContent = '';
        isOverlayModeActive = GM_getValue('sidebarOverlayModeActive', false);
        isSidebarCollapsed = GM_getValue('sidebarCollapsed', false);
        isOverlayMinimized = GM_getValue('overlayMinimized', false);
        lastExpandedHeight = GM_getValue('sidebarSize', { height: '450px' }).height;
        currentFontSize = GM_getValue('sidebarFontSize', DEFAULT_FONT_SIZE);
        currentFontFamilyKey = GM_getValue('sidebarFontFamilyKey', DEFAULT_FONT_FAMILY_KEY);
        if(fontFamilySelect) fontFamilySelect.value = currentFontFamilyKey;
        updateSidebarUI();
        updateFontStyles();
        observeYouTubeSubtitleButton();
    }
    const themeObserver = new MutationObserver(() => { applyDynamicStyles(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dark', 'style', 'class'] });

    let lastUrl = location.href;
    function onUrlChange() { // URL変更（ページ遷移）を検知
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (currentUrl.includes('/watch') || sidebar.style.display === 'flex') { // 動画ページへの遷移か、サイドバーが表示されている場合のみ再初期化
                console.log("Sidebar: URL changed to video page or sidebar was visible, re-initializing.", lastUrl, "->", currentUrl);
                stopSubtitleObservation();
                if (subtitlesButtonObserver) { subtitlesButtonObserver.disconnect(); subtitlesButtonObserver = null; }
                setTimeout(initializeSidebarState, 700); // 少し遅延させて新しいページの要素読み込みを待つ
            } else {
                console.log("Sidebar: URL changed, but not a video page and sidebar not visible. Stopping observation.", currentUrl);
                stopSubtitleObservation(); // 字幕監視のみ停止
                if (subtitlesButtonObserver) { subtitlesButtonObserver.disconnect(); subtitlesButtonObserver = null; }
                sidebar.style.display = 'none'; // 念のためサイドバーを非表示に
            }
        }
    }

    // YouTubeのSPA(Single Page Application)ナビゲーションに対応
    // 'yt-navigate-finish' はナビゲーション完了後に発火
    document.body.addEventListener('yt-navigate-finish', onUrlChange);
    // 'yt-player-updated' はプレーヤーの状態が更新されたときに発火（例：動画変更時）
    // これも監視することで、字幕ボタンの再監視や状態リセットの精度を上げる
    document.body.addEventListener('yt-player-updated', (e) => {
        console.log("Sidebar: yt-player-updated detected.");
        // URLが変わっていなくてもプレーヤーが更新される場合があるため、字幕ボタンの再監視を試みる
        if (subtitlesButtonObserver) { subtitlesButtonObserver.disconnect(); subtitlesButtonObserver = null; }
        setTimeout(observeYouTubeSubtitleButton, 500); // 少し遅延させてプレーヤーの準備を待つ

        // 状況によっては accumulatedSubtitles をリセットする必要があるかもしれない
        // 例えば、同じURLのままプレイリストの次の動画に移った場合など
        // 今回は onUrlChange での対応を主とする
    });


    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeSidebarState, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initializeSidebarState, 1000));
    }

})(); // --- End of Script Main Logic ---