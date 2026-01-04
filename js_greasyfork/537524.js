// ==UserScript==
// @name            Google Images Tools Enhanced
// @name:en         Google Images Tools Enhanced
// @name:zh-TW      Google 圖片工具強化版
// @name:ja         Google 画像検索ツール拡張
// @namespace       https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version         1.2.6
// @description     Enhances Google Images with a custom toolbar and expanded filter options: Exact Size, Aspect Ratio, File Type, Region/Site Search & more.
// @description:en  Enhances Google Images with a custom toolbar and expanded filter options: Exact Size, Aspect Ratio, File Type, Region/Site Search & more.
// @description:zh-TW 以自訂工具列強化 Google 圖片搜尋，提供精確尺寸、長寬比、檔案類型、地區/站內搜尋等更多篩選及自訂選項。
// @description:ja    カスタムツールバーで Google 画像検索を強化。正確なサイズ、アスペクト比、ファイル形式、地域/サイト内検索など、拡張されたフィルターとカスタマイズオプションを提供。
// @icon            https://www.google.com/s2/favicons?sz=64&domain=google.com
// @author          StonedKhajiit
// @license         MIT
// @include         http*://*.google.tld/search*tbm=isch*
// @include         http*://*.google.tld/search*udm=2&*
// @include         http*://*.google.tld/search*udm=2
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/537524/Google%20Images%20Tools%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/537524/Google%20Images%20Tools%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config & Constants
    const DEBUG_MODE = false;
    const GITE_SETTINGS_GM_KEY = 'GITE_USER_SETTINGS_V1';
    
    // Selectors
    const GITE_TOOLBAR_CONTAINER_ID = 'gite-toolbar-container';
    const BEFORE_APPBAR_SELECTOR = '#before-appbar';
    const NATIVE_TOOLBAR_SELECTOR_TO_HIDE = '[data-st-u="top_nav"]';
    const GITE_SETTINGS_BUTTON_ID = 'gite-settings-toolbar-button';
    const GITE_RESULT_STATS_DISPLAY_ID = 'gite-result-stats-display';
    const GITE_LANG_KEY_ATTR = 'data-gite-lang-key';

    // Sticky Toolbar Constants
    const GITE_STICKY_TOP_COMPACT = 70;   // Height when scrolling down or no chips
    const GITE_STICKY_TOP_EXPANDED = 135; // Height when scrolling up with chips visible

    // DOM Builder Helper
    function el(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        for (const [key, val] of Object.entries(attrs)) {
            if (key === 'className') element.className = val;
            else if (key === 'style' && typeof val === 'object') Object.assign(element.style, val);
            else if (key === 'dataset' && typeof val === 'object') Object.assign(element.dataset, val);
            else if (key.startsWith('on') && typeof val === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), val);
            } else if (['innerHTML', 'textContent', 'value', 'title', 'href', 'target', 'role', 'tabIndex', 'id', 'min', 'max', 'step', 'type', 'placeholder', 'checked', 'selected', 'disabled', 'for'].includes(key)) {
                element[key] = val;
            } else if (val !== null && val !== undefined && val !== false) {
                element.setAttribute(key, val);
            }
        }
        if (!Array.isArray(children)) children = [children];
        children.forEach(child => {
            if (child === null || child === undefined) return;
            if (child instanceof Node) element.appendChild(child);
            else element.appendChild(document.createTextNode(String(child)));
        });
        return element;
    }
	
// CSS Styles
    const GITE_STYLES = `
        :root {
            /* Colors */
            --gite-primary: #1a73e8;
            --gite-primary-bg: #e8f0fe;
            --gite-bg: #ffffff;
            --gite-surface: #f8f9fa;
            --gite-border: #dadce0;
            --gite-border-light: #e8eaed;
            --gite-text: #3c4043;
            --gite-text-secondary: #70757a;
            --gite-hover: #ededed;
            --gite-danger: #d93025;
            --gite-danger-bg: #fce8e6;
            
            /* UI */
            --gite-toast-bg: #323232;
            --gite-toast-text: #ffffff;
            --gite-shadow: 0 4px 16px rgba(0,0,0,0.2);
            --gite-menu-shadow: 0 2px 10px 0 rgba(0,0,0,0.2);
            --gite-font: 'Roboto', 'Arial', sans-serif;
            
            /* Theme & Dimensions */
            --gite-toolbar-bg: #ffffff;
            --gite-menu-bg: #ffffff;
            --gite-btn-active-text: #1a73e8;
            --gite-btn-active-bg: #e8f0fe;
            --gite-toolbar-height: 34px;
            --gite-btn-height: 28px;
            --gite-input-height: 24px;
            --gite-sidebar-width: 200px;
            --gite-menu-font-size: 14px;
            --gite-menu-line-height: 1.5;
            
            /* Sticky Toolbar Variables */
            --gite-sticky-top: 70px;
        }

        html.gite-detected-dark-theme {
            --gite-primary: #8ab4f8;
            --gite-primary-bg: #394457;
            --gite-bg: #202124;
            --gite-surface: #303134;
            --gite-border: #5f6368;
            --gite-border-light: #3c4043;
            --gite-text: #e8eaed;
            --gite-text-secondary: #9aa0a6;
            --gite-hover: #3c4043;
            --gite-danger: #f28b82;
            --gite-danger-bg: #5c2b29;
            --gite-toast-bg: #e8eaed;
            --gite-toast-text: #202124;
            --gite-menu-shadow: 0 2px 10px 0 rgba(0,0,0,0.5);
            --gite-toolbar-bg: #1f1f1f;
            --gite-menu-bg: #303134;
            --gite-btn-active-text: #8ab4f8;
            --gite-btn-active-bg: rgba(138, 180, 248, 0.15);
        }

        ${NATIVE_TOOLBAR_SELECTOR_TO_HIDE} { display: none !important; }
        
        /* Hide Native Chips Option */
        html.gite-hide-native-chips .rfiSsc, 
        html.gite-hide-native-chips .sBbkle { display: none !important; }

        /* Toolbar */
        #${GITE_TOOLBAR_CONTAINER_ID} {
            position: relative; 
            background-color: var(--gite-toolbar-bg);
            padding: 2px 16px;
            padding-right: 150px;
            display: flex; 
            align-items: center; 
            gap: 4px;
            flex-wrap: wrap; 
            font-family: var(--gite-font);
            font-size: var(--gite-menu-font-size);
            box-sizing: border-box; 
            z-index: 100;
            min-height: var(--gite-toolbar-height);
        }

        /* Sticky Toolbar Mode */
        #${GITE_TOOLBAR_CONTAINER_ID}.gite-toolbar-sticky {
            position: sticky;
            top: var(--gite-sticky-top);
            z-index: 100;
            width: auto;
            margin: 0;
            border-radius: 0;
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid var(--gite-border-light);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: top 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .gite-filters-group { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; width: 100%; }
        .gite-utilities-group {
            position: absolute; right: 16px; top: 0; bottom: 0;
            display: flex; align-items: center; gap: 4px;
            background-color: var(--gite-toolbar-bg);
            padding-left: 10px;
        }

        .gite-tb-group { position: relative; flex-shrink: 0; }

        .gite-tb-btn {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 3px 8px; 
            border-radius: 3px;
            color: var(--gite-text); 
            cursor: pointer; user-select: none;
            border: 1px solid transparent; 
            transition: background 0.1s, color 0.1s;
            text-decoration: none !important;
            height: var(--gite-btn-height); 
            box-sizing: border-box;
            background-color: transparent;
            font-size: inherit;
        }
        .gite-tb-btn:hover, .gite-tb-btn.open { background-color: var(--gite-hover); color: var(--gite-text); }
        .gite-tb-btn:focus-visible { outline: 2px solid var(--gite-primary); }
        
        .gite-tb-btn.active { 
            background-color: var(--gite-btn-active-bg); 
            color: var(--gite-btn-active-text); 
            font-weight: 500;
        }
        .gite-tb-btn.active .gite-tb-arrow { border-top-color: var(--gite-btn-active-text); opacity: 1; }
        
        .gite-tb-icon { width: 16px; height: 16px; fill: currentColor; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .gite-tb-icon svg { width: 100%; height: 100%; }
        .gite-tb-arrow { width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 3px solid currentColor; margin-left: 1px; opacity: 0.6; flex-shrink: 0; }

        .gite-tb-btn.style-text .gite-tb-icon { display: none; }
        .gite-tb-btn.style-icon .gite-btn-text { display: none; }
        .gite-tb-btn.style-icon .gite-tb-arrow { display: none; }

        .gite-tb-adv-link { padding: 3px; width: 28px; justify-content: center; }
        .gite-tb-adv-link .gite-btn-text { display: none; }
        .gite-tb-adv-link:visited { color: var(--gite-text); }

        .gite-tb-btn.clear-action { color: var(--gite-danger); margin-left: 4px; }
        .gite-tb-btn.clear-action:hover { background-color: var(--gite-danger-bg); color: var(--gite-danger); }
        .gite-tb-btn.clear-action .gite-tb-icon { fill: var(--gite-danger); }

        #${GITE_SETTINGS_BUTTON_ID} {
            color: var(--gite-text-secondary);
            padding: 4px; border-radius: 50%; display: inline-flex;
            cursor: pointer; flex-shrink: 0;
        }
        #${GITE_SETTINGS_BUTTON_ID}:hover { background-color: var(--gite-hover); color: var(--gite-text); }
        #${GITE_SETTINGS_BUTTON_ID} svg { width: 18px; height: 18px; fill: currentColor; }

        #${GITE_RESULT_STATS_DISPLAY_ID} {
            font-size: 13px; color: var(--gite-text);
            margin: 0 4px; white-space: nowrap; cursor: default;
        }

        /* Menus */
        .gite-menu-dropdown {
            position: absolute; top: 100%; left: 0; margin-top: 1px;
            background: var(--gite-menu-bg); border: 1px solid var(--gite-border);
            border-radius: 4px; box-shadow: var(--gite-menu-shadow);
            min-width: 180px; padding: 4px 0; 
            z-index: 2147483647; 
            display: none; 
            max-height: calc(85vh - 50px); 
            overflow-y: auto; 
            text-align: left;
            font-size: var(--gite-menu-font-size);
            line-height: var(--gite-menu-line-height);
        }
        .gite-menu-dropdown.show { display: block; }

        .gite-menu-dropdown::-webkit-scrollbar { width: 8px; }
        .gite-menu-dropdown::-webkit-scrollbar-track { background: transparent; }
        .gite-menu-dropdown::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .gite-menu-dropdown::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
        html.gite-detected-dark-theme .gite-menu-dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        html.gite-detected-dark-theme .gite-menu-dropdown::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

        a.gite-menu-item, div.gite-menu-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 4px 12px;
            color: var(--gite-text); text-decoration: none;
            cursor: pointer; transition: background 0.05s;
            white-space: nowrap;
        }
        a.gite-menu-item:hover, div.gite-menu-item:hover, a.gite-menu-item.focus, div.gite-menu-item.focus, a.gite-menu-item:focus, div.gite-menu-item:focus { 
            background-color: var(--gite-hover); 
            text-decoration: none; color: var(--gite-text); outline: none;
        }
        
        a.gite-menu-item.selected, div.gite-menu-item.selected { font-weight: 500; color: var(--gite-primary); background-color: var(--gite-primary-bg); }
        html.gite-detected-dark-theme a.gite-menu-item.selected, html.gite-detected-dark-theme div.gite-menu-item.selected { background-color: rgba(138, 180, 248, 0.1); }
        
        .gite-check-icon { width: 14px; height: 14px; fill: currentColor; margin-left: 8px; visibility: hidden; }
        .gite-menu-item.selected .gite-check-icon { visibility: visible; }
        .gite-menu-separator { margin: 2px 0; border-top: 1px solid var(--gite-border); opacity: 0.5; }

        /* Layouts */
        .gite-menu-row-container { display: flex; width: max-content; }
        .gite-menu-col { display: flex; flex-direction: column; min-width: 160px; padding: 2px 0; }
        .gite-menu-col:not(:last-child) { border-right: 1px solid var(--gite-border-light); }
        
        .gite-menu-masonry { column-count: 2; column-gap: 0; width: max-content; min-width: 320px; max-width: 80vw; }
        .gite-menu-masonry .gite-menu-item { break-inside: avoid; }
        .gite-menu-masonry-header { border-bottom: 1px solid var(--gite-border-light); margin-bottom: 2px; }

        /* Embedded Components */
        .gite-embedded-picker { 
            padding: 8px; display: flex; flex-direction: column; gap: 8px; 
            min-width: 150px; border-left: 1px solid var(--gite-border-light);
            background: var(--gite-surface);
        }
        .gite-embedded-header { font-size: 12px; font-weight: 500; color: var(--gite-text-secondary); margin-bottom: 2px; }
        .gite-embedded-input { 
            width: 100%; box-sizing: border-box; 
            border: 1px solid var(--gite-border); border-radius: 4px;
            padding: 3px 6px; font-size: 13px; font-family: inherit;
            background: var(--gite-bg); color: var(--gite-text);
        }
        .gite-embedded-input.error { border-color: var(--gite-danger); }
        .gite-embedded-apply-btn {
            margin-top: 4px; width: 100%;
            background: var(--gite-primary); color: #fff;
            border: none; border-radius: 4px; padding: 4px;
            cursor: pointer; font-size: 12px; font-weight: 500;
        }
        .gite-embedded-apply-btn:hover { filter: brightness(1.1); }
        
        .gite-menu-input-row { 
            padding: 4px 12px; display: flex; align-items: center; gap: 4px; 
            border-bottom: 1px solid var(--gite-border-light); margin-bottom: 2px;
            box-sizing: border-box; width: 100%;
        }
        .gite-menu-input { 
            width: 72px; padding: 2px 4px; 
            border: 1px solid var(--gite-border); border-radius: 3px; 
            background: var(--gite-bg); color: var(--gite-text); 
            font-size: 13px; text-align: center; height: 24px;
            -moz-appearance: textfield;
        }
        html.gite-detected-dark-theme .gite-menu-input { color-scheme: dark; }
        .gite-menu-btn-icon { 
            padding: 2px; width: 24px; height: 24px;
            background: var(--gite-primary); color: #fff; 
            border: none; border-radius: 3px; cursor: pointer; 
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .gite-menu-btn-icon svg { width: 14px; height: 14px; fill: currentColor; }

        .gite-palette-grid { 
            display: grid; grid-template-columns: repeat(4, 1fr); 
            gap: 8px; padding: 8px 12px; width: 180px; box-sizing: border-box;
        }
        a.gite-swatch { 
            display: block; width: 28px; height: 28px; 
            border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); 
            cursor: pointer; box-sizing: border-box; 
            transition: transform 0.1s; margin: 0 auto;
        }
        a.gite-swatch:hover, a.gite-swatch:focus { transform: scale(1.15); outline: none; }
        a.gite-swatch.selected { 
            border-color: transparent; 
            box-shadow: 0 0 0 2px var(--gite-bg), 0 0 0 4px var(--gite-primary); 
            z-index: 1; transform: scale(1.1); 
        }
		
        /* Settings Modal */
        .gite-modal-overlay { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: rgba(0,0,0,0.6); z-index: 2147483647; 
            display: flex; align-items: center; justify-content: center; 
            opacity: 0; pointer-events: none; transition: opacity 0.15s; 
            font-family: var(--gite-font); font-size: 13px; 
        }
        .gite-modal-overlay.open { opacity: 1; pointer-events: auto; }
        .gite-panel { 
            background: var(--gite-bg); color: var(--gite-text); 
            width: 800px; height: 550px; max-width: 95%; max-height: 95%; 
            border-radius: 8px; box-shadow: var(--gite-shadow); 
            display: flex; overflow: hidden; border: 1px solid var(--gite-border); 
        }
        .gite-sidebar { 
            width: var(--gite-sidebar-width); background: var(--gite-surface); 
            border-right: 1px solid var(--gite-border); display: flex; 
            flex-direction: column; overflow-y: auto; flex-shrink: 0; 
        }
        .gite-sidebar-header { 
            padding: 12px 16px; font-weight: bold; color: var(--gite-primary); 
            border-bottom: 1px solid var(--gite-border); display: flex; gap: 8px; 
            font-size: 15px; align-items: center; flex-shrink: 0; height: 48px; box-sizing: border-box;
        }
        .gite-sidebar-header svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }
        .gite-nav-item { 
            padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; 
            color: var(--gite-text-secondary); border-left: 3px solid transparent; 
            font-size: 13px; user-select: none; 
        }
        .gite-nav-item:hover { background: var(--gite-hover); color: var(--gite-text); }
        .gite-nav-item.active { 
            background: rgba(26, 115, 232, 0.08); color: var(--gite-primary); 
            border-left-color: var(--gite-primary); font-weight: 500; 
        }
        html.gite-detected-dark-theme .gite-nav-item.active { background: rgba(138, 180, 248, 0.1); }
        .gite-nav-item svg { width: 16px; height: 16px; fill: currentColor; opacity: 0.8; flex-shrink: 0; }
        
        .gite-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .gite-header { 
            padding: 0 20px; height: 48px; border-bottom: 1px solid var(--gite-border); 
            display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; 
        }
        .gite-header h2 { margin: 0; font-size: 16px; font-weight: 500; }
        .gite-close-btn { 
            background: none; border: none; font-size: 22px; color: var(--gite-text-secondary); 
            cursor: pointer; padding: 4px; border-radius: 4px; line-height: 1; 
        }
        .gite-close-btn:hover { background: var(--gite-hover); color: var(--gite-text); }
        .gite-scroll-area { flex: 1; overflow-y: auto; padding: 16px 20px; }
        
        .gite-input-group { margin-bottom: 12px; }
        .gite-input-group label { display: block; margin-bottom: 4px; font-weight: 500; font-size: 12px; color: var(--gite-text-secondary); }
        .gite-control-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed var(--gite-border-light); min-height: 28px; }
        .gite-input { 
            width: 100%; height: var(--gite-input-height); padding: 0 8px; 
            border: 1px solid var(--gite-border); border-radius: 4px; 
            background: var(--gite-surface); color: var(--gite-text); 
            font-size: 13px; box-sizing: border-box; 
        }
        
        input[type=range].gite-range-input { width: 100%; background: transparent; margin: 4px 0; height: 24px; cursor: pointer; display: block; }
        
        .gite-option-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
        .gite-option-check-item { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px; border-radius: 4px; cursor: pointer; user-select: none; }
        .gite-option-check-item:hover { background: var(--gite-surface); }
        .gite-toggle { position: relative; width: 34px; height: 18px; display: inline-block; flex-shrink: 0; }
        .gite-toggle input { opacity: 0; width: 0; height: 0; }
        .gite-slider { position: absolute; top:0;left:0;right:0;bottom:0; background: #bdc1c6; transition:.2s; border-radius:18px; cursor: pointer; }
        .gite-slider:before { position: absolute; content:""; height:14px; width:14px; left:2px; bottom:2px; background:white; transition:.2s; border-radius:50%; box-shadow:0 1px 2px rgba(0,0,0,0.2); }
        input:checked + .gite-slider { background: var(--gite-primary); }
        input:checked + .gite-slider:before { transform: translateX(16px); }
        
        .gite-add-box { background: var(--gite-surface); padding: 8px; border-radius: 6px; margin-bottom: 12px; border: 1px solid var(--gite-border); display: flex; gap: 6px; align-items: center; }
        
        .gite-list { list-style: none; padding: 0; margin: 0; border: 1px solid var(--gite-border); border-radius: 6px; max-height: 220px; overflow-y: auto; }
        .gite-list-item { display: flex; align-items: center; padding: 0 12px; height: 32px; background: var(--gite-bg); border-bottom: 1px solid var(--gite-border-light); font-size: 13px; }
        .gite-list-item:hover { background: var(--gite-surface); }
        .gite-item-label { flex: 1; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display:flex; align-items:center; gap:8px;}
        .gite-item-actions { display: flex; gap: 4px; opacity: 0.6; }
        .gite-list-item:hover .gite-item-actions { opacity: 1; }
        
        .gite-icon-btn { width: 24px; height: 24px; cursor: pointer; color: var(--gite-text-secondary); background: transparent; border: 1px solid transparent; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
        .gite-icon-btn svg { width: 16px; height: 16px; fill: currentColor; }
        .gite-icon-btn:hover { background: rgba(0,0,0,0.05); color: var(--gite-text); }
        .gite-icon-btn.danger:hover { color: var(--gite-danger); background: var(--gite-danger-bg); }
		
        .gite-category-footer { margin-top: 15px; padding-top: 10px; border-top: 1px dashed var(--gite-border-light); text-align: right; }
        .gite-btn-reset-cat { background: var(--gite-surface); border: 1px solid var(--gite-border); color: var(--gite-text-secondary); font-size: 12px; padding: 4px 10px; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; transition: 0.2s; height: 26px; }
        .gite-btn-reset-cat:hover { color: var(--gite-danger); background: var(--gite-danger-bg); border-color: var(--gite-danger-bg); }
        .gite-btn-reset-cat svg { width: 14px; height: 14px; fill: currentColor; }
        
        .gite-footer { height: 50px; padding: 0 20px; border-top: 1px solid var(--gite-border); display: flex; justify-content: space-between; align-items: center; background: var(--gite-surface); flex-shrink: 0; }
        .gite-footer-right { display: flex; gap: 8px; }
        .gite-btn { height: 28px; padding: 0 12px; border: 1px solid var(--gite-border); border-radius: 4px; background: var(--gite-bg); color: var(--gite-text); font-size: 13px; cursor: pointer; font-weight: 500; transition: 0.1s; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; }
        .gite-btn:hover { background: var(--gite-hover); }
        .gite-btn-primary { background: var(--gite-primary); color: #fff; border:none; }
        .gite-btn-primary:hover { background: #1557b0; }
        .gite-btn-danger { color: var(--gite-danger); }
        
        .gite-toast-container { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 2147483647; pointer-events: none; display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .gite-toast { background: var(--gite-toast-bg); color: var(--gite-toast-text); padding: 10px 20px; border-radius: 4px; font-size: 13px; opacity: 0; transform: translateY(10px); transition: 0.2s; display: flex; align-items: center; gap: 8px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .gite-toast.show { opacity: 1; transform: translateY(0); }
        
        /* Date Picker */
        .gite-custom-date-picker { background: var(--gite-bg); color: var(--gite-text); border: 1px solid var(--gite-border); border-radius: 8px; box-shadow: var(--gite-shadow); padding: 24px; display: flex; flex-direction: column; min-width: 180px; max-width: 90vw; box-sizing: border-box; }
        .gite-datepicker-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; }
        .gite-date-row { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 16px; width: 100%; }
        .gite-custom-date-picker input[type="date"] { width: 100%; padding: 8px 12px; border: 1px solid var(--gite-border); border-radius: 4px; background: var(--gite-surface); color: var(--gite-text); outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .gite-datepicker-actions { display: flex; justify-content: flex-end; margin-top: 12px; width: 100%; gap: 8px; }
        
        /* Animations */
        .gite-ripple { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); }
        .gite-ripple::after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #000 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .3s, opacity .3s; }
        .gite-ripple:active::after { transform: scale(0, 0); opacity: 0.1; transition: 0s; }
        html.gite-detected-dark-theme .gite-ripple::after { background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); }
    `;
	
// Section: Icons
    const GITE_ICONS = {
        gear: '<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.07,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
        size: '<svg viewBox="0 0 24 24"><path d="M21 15h2v2h-2v-2zm0-4h2v2h-2v-2zm2 8h-2v2c1 0 2-1 2-2zM13 3h2v2h-2V3zm8 4h2v2h-2V7zm0-4v2h2c0-1-1-2-2-2zM1 7h2v2H1V7zm16-4h2v2h-2V3zm0 16h2v2h-2v-2zM3 3C2 3 1 4 1 5h2V3zm6 0h2v2H9V3zM5 3h2v2H5V3zm-4 8v8c0 1.1.9 2 2 2h12V11H1v8z"/></svg>',
        exactSize: '<svg viewBox="0 0 24 24"><path d="M2,6v12h20V6H2z M20,16H4V8h16V16z M6,12h2v-2H6V12z M10,12h2v-2h-2V12z M14,12h2v-2h-2V12z"/></svg>',
        aspectRatio: '<svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/></svg>',
        color: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
        time: '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
        region: '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/></svg>',
        site: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        refresh: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
        check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        clear: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        type: '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
        usageRights: '<svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>',
        fileType: '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
        edit: '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
        delete: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
        sliders: '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',
        arrowRight: '<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
        globe: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
    };

    // Section: I18N Strings
    const GITE_I18N_STRINGS = {
        'en': {
            'filter_title_size': "Size", 'filter_title_exact_size': "Exact size", 'filter_title_aspect_ratio': "Aspect ratio",
            'filter_title_color': "Color", 'filter_title_type': "Type", 'filter_title_time': "Time",
            'filter_title_usage_rights': "Usage rights", 'filter_title_file_type': "File type",
            'filter_title_region': "Region", 'filter_title_site_search': "Site Search", 'filter_title_advanced_search': "Advanced Search",

            'btn_clear': "Clear", 'btn_apply': "Apply", 'btn_cancel': "Cancel", 'btn_close': "Close",
            'btn_save_and_close': "Save & Close", 'btn_delete': "Delete", 'btn_edit_label': "Edit Label",
            'btn_save_changes': "Save", 'btn_add_new_exact_size': "Add Size", 'btn_add_new_site': "Add Site",
            'btn_reset_all_settings': "Reset All to Defaults", 'btn_reset_general_settings': "Reset General Settings",

            'option_text_size_any': "Any size", 'option_text_size_large': "Large", 'option_text_size_medium': "Medium", 'option_text_size_icon': "Icon",
            'option_text_size_qsvga': "Larger than 400×300", 'option_text_size_vga': "Larger than 640×480", 'option_text_size_svga': "Larger than 800×600", 'option_text_size_xga': "Larger than 1024×768",
            'option_text_size_2mp': "Larger than 2MP", 'option_text_size_4mp': "Larger than 4MP", 'option_text_size_6mp': "Larger than 6MP", 'option_text_size_8mp': "Larger than 8MP",
            'option_text_size_10mp': "Larger than 10MP", 'option_text_size_12mp': "Larger than 12MP", 'option_text_size_15mp': "Larger than 15MP", 'option_text_size_20mp': "Larger than 20MP",
            'option_text_size_40mp': "Larger than 40MP", 'option_text_size_70mp': "Larger than 70MP",

            'option_text_exact_size_any': "Any exact size", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD Port.)", 
            'option_text_exact_size_768x1024': "768×1024 (XGA Port.)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K Portrait)",
            'exact_size_placeholder_width': "Width", 'exact_size_placeholder_height': "Height",

            'option_text_ar_any': "Any aspect ratio", 'option_text_ar_tall': "Tall", 'option_text_ar_square': "Square", 'option_text_ar_wide': "Wide", 'option_text_ar_panoramic': "Panoramic",

            'option_text_color_any': "Any color", 'option_text_color_full': "Full color", 'option_text_color_bw': "Black and white", 'option_text_color_transparent': "Transparent",
            'option_text_color_palette_red': "Red", 'option_text_color_palette_orange': "Orange", 'option_text_color_palette_yellow': "Yellow", 'option_text_color_palette_green': "Green",
            'option_text_color_palette_teal': "Teal", 'option_text_color_palette_blue': "Blue", 'option_text_color_palette_purple': "Purple", 'option_text_color_palette_pink': "Pink",
            'option_text_color_palette_white': "White", 'option_text_color_palette_gray': "Gray", 'option_text_color_palette_black': "Black", 'option_text_color_palette_brown': "Brown",

            'option_text_type_any': "Any type", 'option_text_type_face': "Face", 'option_text_type_photo': "Photo", 'option_text_type_clipart': "Clip art", 'option_text_type_lineart': "Line drawing", 'option_text_type_gif': "GIF",

            'option_text_time_any': "Any time",
            'option_text_time_past_15m': "Past 15 minutes", 'option_text_time_past_30m': "Past 30 minutes", 'option_text_time_past_hour': "Past hour",
            'option_text_time_past_3h': "Past 3 hours", 'option_text_time_past_6h': "Past 6 hours", 'option_text_time_past_9h': "Past 9 hours", 'option_text_time_past_12h': "Past 12 hours",
            'option_text_time_past_15h': "Past 15 hours", 'option_text_time_past_18h': "Past 18 hours", 'option_text_time_past_21h': "Past 21 hours", 'option_text_time_past_24h': "Past 24 hours",
            'option_text_time_past_2d': "Past 2 days", 'option_text_time_past_3d': "Past 3 days", 'option_text_time_past_4d': "Past 4 days", 'option_text_time_past_5d': "Past 5 days", 'option_text_time_past_6d': "Past 6 days",
            'option_text_time_past_week': "Past week", 'option_text_time_past_2w': "Past 2 weeks", 'option_text_time_past_3w': "Past 3 weeks",
            'option_text_time_past_month': "Past month", 'option_text_time_past_2m': "Past 2 months", 'option_text_time_past_3m': "Past 3 months", 'option_text_time_past_4m': "Past 4 months",
            'option_text_time_past_5m': "Past 5 months", 'option_text_time_past_6m': "Past 6 months", 'option_text_time_past_7m': "Past 7 months", 'option_text_time_past_8m': "Past 8 months",
            'option_text_time_past_9m': "Past 9 months", 'option_text_time_past_10m': "Past 10 months", 'option_text_time_past_11m': "Past 11 months", 'option_text_time_past_year': "Past year",
            'option_text_time_past_2y': "Past 2 years", 'option_text_time_past_3y': "Past 3 years", 'option_text_time_past_4y': "Past 4 years", 'option_text_time_past_5y': "Past 5 years",
            'option_text_time_past_6y': "Past 6 years", 'option_text_time_past_7y': "Past 7 years", 'option_text_time_past_8y': "Past 8 years", 'option_text_time_past_9y': "Past 9 years", 'option_text_time_past_10y': "Past 10 years",
            'option_text_time_custom_range': "Custom range...", 'datepicker_label_from': "From:", 'datepicker_label_to': "To:",

            'option_text_rights_any': "Not filtered by license", 'option_text_rights_cc': "Creative Commons licenses", 'option_text_rights_commercial': "Commercial & other licenses",

            'option_text_filetype_any': "Any format", 'option_text_filetype_jpg': "JPG files", 'option_text_filetype_jpeg': "JPEG files", 'option_text_filetype_gif': "GIF files", 'option_text_filetype_png': "PNG files",
            'option_text_filetype_bmp': "BMP files", 'option_text_filetype_svg': "SVG files", 'option_text_filetype_webp': "WEBP files", 'option_text_filetype_avif': "AVIF files",
            'option_text_filetype_ico': "ICO files", 'option_text_filetype_raw': "RAW files",

            'option_text_region_any': "Any region", 'option_text_region_ca': "Canada", 'option_text_region_us': "United States", 'option_text_region_mx': "Mexico",
            'option_text_region_ar': "Argentina", 'option_text_region_br': "Brazil", 'option_text_region_cl': "Chile", 'option_text_region_co': "Colombia", 'option_text_region_pe': "Peru",
            'option_text_region_gb': "United Kingdom", 'option_text_region_fr': "France", 'option_text_region_de': "Germany", 'option_text_region_it': "Italy", 'option_text_region_es': "Spain",
            'option_text_region_al': "Albania", 'option_text_region_at': "Austria", 'option_text_region_by': "Belarus", 'option_text_region_be': "Belgium", 'option_text_region_ba': "Bosnia and Herzegovina",
            'option_text_region_bg': "Bulgaria", 'option_text_region_hr': "Croatia", 'option_text_region_cz': "Czech Republic", 'option_text_region_dk': "Denmark", 'option_text_region_ee': "Estonia",
            'option_text_region_fi': "Finland", 'option_text_region_gr': "Greece", 'option_text_region_hu': "Hungary", 'option_text_region_is': "Iceland", 'option_text_region_ie': "Ireland",
            'option_text_region_lv': "Latvia", 'option_text_region_lt': "Lithuania", 'option_text_region_lu': "Luxembourg", 'option_text_region_nl': "Netherlands", 'option_text_region_no': "Norway",
            'option_text_region_pl': "Poland", 'option_text_region_pt': "Portugal", 'option_text_region_ro': "Romania", 'option_text_region_ru': "Russia", 'option_text_region_rs': "Serbia",
            'option_text_region_sk': "Slovakia", 'option_text_region_si': "Slovenia", 'option_text_region_se': "Sweden", 'option_text_region_ch': "Switzerland", 'option_text_region_tr': "Turkey", 'option_text_region_ua': "Ukraine",
            'option_text_region_jp': "Japan", 'option_text_region_kr': "South Korea", 'option_text_region_tw': "Taiwan", 'option_text_region_cn': "China", 'option_text_region_hk': "Hong Kong",
            'option_text_region_in': "India", 'option_text_region_id': "Indonesia", 'option_text_region_il': "Israel", 'option_text_region_my': "Malaysia", 'option_text_region_ph': "Philippines",
            'option_text_region_sa': "Saudi Arabia", 'option_text_region_sg': "Singapore", 'option_text_region_th': "Thailand", 'option_text_region_ae': "United Arab Emirates", 'option_text_region_vn': "Vietnam",
            'option_text_region_au': "Australia", 'option_text_region_nz': "New Zealand", 'option_text_region_eg': "Egypt", 'option_text_region_ng': "Nigeria", 'option_text_region_za': "South Africa",
            'option_text_site_any': "Any site",

            'alert_size_already_saved': "This size is already saved.", 'alert_custom_size_deleted': "Custom size deleted: ", 'alert_custom_size_saved': "Custom size saved: ",
            'alert_invalid_domain': "Invalid domain format.", 'alert_datepicker_select_dates': "Please select a start and end date.",
            'alert_datepicker_end_before_start': "End date cannot be earlier than start date.", 'alert_datepicker_invalid_date': "Invalid date selected.",
            'alert_exact_size_invalid_input': "Please enter valid width and height.", 'alert_confirm_delete_option_prefix': "Delete \"",
            'alert_label_updated': "Label updated.", 'alert_exact_size_added': "New exact size added.", 'alert_exact_size_deleted': "Saved size deleted.",
            'alert_site_label_empty': "Site label cannot be empty.", 'alert_site_domain_empty': "Site domain cannot be empty.", 'alert_site_already_saved': "This site/domain is already saved.",
            'alert_site_added': "New site added.", 'alert_site_deleted': "Saved site deleted.",
            'alert_settings_reset_to_default': "All settings have been reset to default.", 'alert_settings_saved': "Settings saved successfully.",
            'gm_menu_gite_settings': "⚙️ GITE Settings", 'gm_menu_reset_all_gite_settings': "🚨 Reset All Settings", 'gm_please_reload': "Please reload the page for changes to take full effect.",
            'settings_panel_title': "GITE Settings", 'settings_tab_general': "General", 'settings_tab_exact_size': "Exact Size", 'settings_tab_size': "Size",
            'settings_tab_time': "Time", 'settings_tab_region': "Region", 'settings_tab_site_search': "Site Search",
            
            'settings_label_language': "Script Language:", 
            'settings_lang_auto': "Auto-detect", 
            'settings_lang_en': "English", 
            'settings_lang_zh_TW': "Traditional Chinese (繁體中文)", 
            'settings_lang_ja': "Japanese (日本語)",
            'settings_lang_de': "German (Deutsch)", 
            'settings_lang_es': "Spanish (Español)", 
            'settings_lang_fr': "French (Français)", 
            'settings_lang_it': "Italian (Italiano)", 
            'settings_lang_ru': "Russian (Русский)",

            'settings_label_showtoolbarbutton': "Show settings button on toolbar:", 'settings_label_showresultstats': "Show result stats on toolbar:",
            'settings_label_theme': "Theme:", 'settings_theme_auto': "Auto-detect", 'settings_theme_light': "Light", 'settings_theme_dark': "Dark",
            'settings_label_toolbar_font_size': "Menu Font Size (px):", 'settings_label_toolbar_line_height': "Menu Line Height:",
            'settings_label_showregionflags': "Show country flags in Region filter:", 'settings_label_showfavicons': "Show favicons in Site Search filter:",
            'settings_label_showadvsearch': "Show Advanced Search button:", 'settings_label_btn_style': "Button Style:", 'settings_btn_style_text': "Text Only", 'settings_btn_style_icon': "Icon Only", 'settings_btn_style_both': "Icon + Text",
            'alert_confirm_reset_all_settings': "Are you sure you want to reset ALL GITE settings to their defaults? This cannot be undone.",
            'settings_enable_filter_category_prefix': "Enable \"", 'settings_enable_filter_category_suffix': "\" filter",
            'settings_label_show_exact_size_inputs_in_menu': "Show manual input in Exact Size menu:",
            'settings_options_for_category_prefix': "Options for \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Reset \"", 'btn_reset_options_for_category_suffix': "\" Options",
            'settings_section_predefined_options': "Predefined Options:", 'settings_section_your_saved_sizes': "Your Saved Sizes:",
            'settings_label_add_new_exact_size': "Add New Exact Size:", 'settings_placeholder_label_optional': "Label (optional)",
            'settings_label_enable_site_search_filter': "Enable \"Site Search\" filter", 'settings_section_your_saved_sites': "Your Saved Sites:",
            'settings_label_add_new_site': "Add New Site:", 'settings_placeholder_site_label': "Label (e.g., Reddit)", 'settings_placeholder_site_domain': "Domain (e.g., reddit.com)",
            'settings_no_saved_items_placeholder': "No saved items yet.",
            'settings_label_layout_two_col': "Use two-column layout:", 'settings_label_layout_multi_col': "Use multi-column (masonry) layout:", 'settings_label_embedded_date': "Show date picker directly in menu:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Toolbar Position:",
            'settings_layout_standard': "Standard (Embedded)",
            'settings_layout_sticky': "Sticky (Floating)",
            'settings_label_hide_chips': "Hide Suggestion Chips:"
        },
        'zh-TW': {
            'filter_title_size': "大小", 'filter_title_exact_size': "精確尺寸", 'filter_title_aspect_ratio': "長寬比",
            'filter_title_color': "顏色", 'filter_title_type': "類型", 'filter_title_time': "時間",
            'filter_title_usage_rights': "使用權限", 'filter_title_file_type': "檔案類型",
            'filter_title_region': "地區", 'filter_title_site_search': "站內搜尋", 'filter_title_advanced_search': "進階搜尋",

            'btn_clear': "清除", 'btn_apply': "套用", 'btn_cancel': "取消", 'btn_close': "關閉",
            'btn_save_and_close': "儲存並關閉", 'btn_delete': "刪除", 'btn_edit_label': "編輯標籤",
            'btn_save_changes': "儲存", 'btn_add_new_exact_size': "新增", 'btn_add_new_site': "新增",
            'btn_reset_all_settings': "重置所有設定", 'btn_reset_general_settings': "重置一般設定",

            'option_text_size_any': "任何大小", 'option_text_size_large': "大型", 'option_text_size_medium': "中型", 'option_text_size_icon': "圖示",
            'option_text_size_qsvga': "大於 400×300", 'option_text_size_vga': "大於 640×480", 'option_text_size_svga': "大於 800×600", 'option_text_size_xga': "大於 1024×768",
            'option_text_size_2mp': "大於 2MP", 'option_text_size_4mp': "大於 4MP", 'option_text_size_6mp': "大於 6MP", 'option_text_size_8mp': "大於 8MP",
            'option_text_size_10mp': "大於 10MP", 'option_text_size_12mp': "大於 12MP", 'option_text_size_15mp': "大於 15MP", 'option_text_size_20mp': "大於 20MP",
            'option_text_size_40mp': "大於 40MP", 'option_text_size_70mp': "大於 70MP",

            'option_text_exact_size_any': "任何精確尺寸", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (筆電)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (超寬 FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (超寬 QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD 縱向)",
            'option_text_exact_size_768x1024': "768×1024 (XGA 縱向)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K 縱向)",
            'exact_size_placeholder_width': "寬", 'exact_size_placeholder_height': "高",

            'option_text_ar_any': "任何長寬比", 'option_text_ar_tall': "高", 'option_text_ar_square': "正方形", 'option_text_ar_wide': "寬幅", 'option_text_ar_panoramic': "全景",

            'option_text_color_any': "任何色彩", 'option_text_color_full': "全彩", 'option_text_color_bw': "黑白", 'option_text_color_transparent': "透明背景",
            'option_text_color_palette_red': "紅色", 'option_text_color_palette_orange': "橘色", 'option_text_color_palette_yellow': "黃色", 'option_text_color_palette_green': "綠色",
            'option_text_color_palette_teal': "藍綠色", 'option_text_color_palette_blue': "藍色", 'option_text_color_palette_purple': "紫色", 'option_text_color_palette_pink': "粉紅色",
            'option_text_color_palette_white': "白色", 'option_text_color_palette_gray': "灰色", 'option_text_color_palette_black': "黑色", 'option_text_color_palette_brown': "棕色",

            'option_text_type_any': "任何類型", 'option_text_type_face': "臉部特寫", 'option_text_type_photo': "相片", 'option_text_type_clipart': "美工圖案", 'option_text_type_lineart': "線條藝術畫", 'option_text_type_gif': "GIF 動畫",

            'option_text_time_any': "不限時間",
            'option_text_time_past_15m': "過去 15 分鐘", 'option_text_time_past_30m': "過去 30 分鐘", 'option_text_time_past_hour': "過去 1 小時",
            'option_text_time_past_3h': "過去 3 小時", 'option_text_time_past_6h': "過去 6 小時", 'option_text_time_past_9h': "過去 9 小時", 'option_text_time_past_12h': "過去 12 小時",
            'option_text_time_past_15h': "過去 15 小時", 'option_text_time_past_18h': "過去 18 小時", 'option_text_time_past_21h': "過去 21 小時", 'option_text_time_past_24h': "過去 24 小時",
            'option_text_time_past_2d': "過去 2 天", 'option_text_time_past_3d': "過去 3 天", 'option_text_time_past_4d': "過去 4 天", 'option_text_time_past_5d': "過去 5 天", 'option_text_time_past_6d': "過去 6 天",
            'option_text_time_past_week': "過去 1 週", 'option_text_time_past_2w': "過去 2 週", 'option_text_time_past_3w': "過去 3 週",
            'option_text_time_past_month': "過去 1 個月", 'option_text_time_past_2m': "過去 2 個月", 'option_text_time_past_3m': "過去 3 個月", 'option_text_time_past_4m': "過去 4 個月",
            'option_text_time_past_5m': "過去 5 個月", 'option_text_time_past_6m': "過去 6 個月", 'option_text_time_past_7m': "過去 7 個月", 'option_text_time_past_8m': "過去 8 個月",
            'option_text_time_past_9m': "過去 9 個月", 'option_text_time_past_10m': "過去 10 個月", 'option_text_time_past_11m': "過去 11 個月", 'option_text_time_past_year': "過去 1 年",
            'option_text_time_past_2y': "過去 2 年", 'option_text_time_past_3y': "過去 3 年", 'option_text_time_past_4y': "過去 4 年", 'option_text_time_past_5y': "過去 5 年",
            'option_text_time_past_6y': "過去 6 年", 'option_text_time_past_7y': "過去 7 年", 'option_text_time_past_8y': "過去 8 年", 'option_text_time_past_9y': "過去 9 年", 'option_text_time_past_10y': "過去 10 年",
            'option_text_time_custom_range': "自訂日期範圍...", 'datepicker_label_from': "開始:", 'datepicker_label_to': "結束:",

            'option_text_rights_any': "不限使用權", 'option_text_rights_cc': "創用 CC 授權", 'option_text_rights_commercial': "商業和其他授權",

            'option_text_filetype_any': "不限格式", 'option_text_filetype_jpg': "JPG", 'option_text_filetype_jpeg': "JPEG", 'option_text_filetype_gif': "GIF", 'option_text_filetype_png': "PNG", 'option_text_filetype_bmp': "BMP",
            'option_text_filetype_svg': "SVG", 'option_text_filetype_webp': "WEBP", 'option_text_filetype_avif': "AVIF", 'option_text_filetype_ico': "ICO", 'option_text_filetype_raw': "RAW",

            'option_text_region_any': "不限地區", 'option_text_region_ca': "加拿大", 'option_text_region_us': "美國", 'option_text_region_mx': "墨西哥",
            'option_text_region_ar': "阿根廷", 'option_text_region_br': "巴西", 'option_text_region_cl': "智利", 'option_text_region_co': "哥倫比亞", 'option_text_region_pe': "秘魯",
            'option_text_region_gb': "英國", 'option_text_region_fr': "法國", 'option_text_region_de': "德國", 'option_text_region_it': "義大利", 'option_text_region_es': "西班牙",
            'option_text_region_al': "阿爾巴尼亞", 'option_text_region_at': "奧地利", 'option_text_region_by': "白俄羅斯", 'option_text_region_be': "比利時", 'option_text_region_ba': "波士尼亞與赫塞哥維納",
            'option_text_region_bg': "保加利亞", 'option_text_region_hr': "克羅埃西亞", 'option_text_region_cz': "捷克", 'option_text_region_dk': "丹麥", 'option_text_region_ee': "愛沙尼亞",
            'option_text_region_fi': "芬蘭", 'option_text_region_gr': "希臘", 'option_text_region_hu': "匈牙利", 'option_text_region_is': "冰島", 'option_text_region_ie': "愛爾蘭",
            'option_text_region_lv': "拉脫維亞", 'option_text_region_lt': "立陶宛", 'option_text_region_lu': "盧森堡", 'option_text_region_nl': "荷蘭", 'option_text_region_no': "挪威",
            'option_text_region_pl': "波蘭", 'option_text_region_pt': "葡萄牙", 'option_text_region_ro': "羅馬尼亞", 'option_text_region_ru': "俄羅斯", 'option_text_region_rs': "塞爾維亞",
            'option_text_region_sk': "斯洛伐克", 'option_text_region_si': "斯洛維尼亞", 'option_text_region_se': "瑞典", 'option_text_region_ch': "瑞士", 'option_text_region_tr': "土耳其", 'option_text_region_ua': "烏克蘭",
            'option_text_region_jp': "日本", 'option_text_region_kr': "韓國", 'option_text_region_tw': "台灣", 'option_text_region_cn': "中國", 'option_text_region_hk': "香港",
            'option_text_region_in': "印度", 'option_text_region_id': "印尼", 'option_text_region_il': "以色列", 'option_text_region_my': "馬來西亞", 'option_text_region_ph': "菲律賓",
            'option_text_region_sa': "沙烏地阿拉伯", 'option_text_region_sg': "新加坡", 'option_text_region_th': "泰國", 'option_text_region_ae': "阿拉伯聯合大公國", 'option_text_region_vn': "越南",
            'option_text_region_au': "澳洲", 'option_text_region_nz': "紐西蘭", 'option_text_region_eg': "埃及", 'option_text_region_ng': "奈及利亞", 'option_text_region_za': "南非",
            'option_text_site_any': "不限網站",

            'alert_size_already_saved': "此尺寸已儲存。", 'alert_custom_size_deleted': "已刪除自訂尺寸: ", 'alert_custom_size_saved': "已儲存自訂尺寸: ",
            'alert_invalid_domain': "網域格式無效。", 'alert_datepicker_select_dates': "請選擇開始和結束日期。", 'alert_datepicker_end_before_start': "結束日期不能早於開始日期。",
            'alert_datepicker_invalid_date': "選擇的日期無效，請重新選擇。", 'alert_exact_size_invalid_input': "請輸入有效的寬度和高度 (正整數)。",
            'alert_confirm_delete_option_prefix': "確定刪除「", 'alert_label_updated': "標籤已更新。", 'alert_exact_size_added': "新尺寸已新增。", 'alert_exact_size_deleted': "尺寸已刪除。",
            'alert_site_label_empty': "網站標籤不得為空。", 'alert_site_domain_empty': "網站網域不得為空。", 'alert_site_already_saved': "此網站/網域已儲存。",
            'alert_site_added': "新網站已新增。", 'alert_site_deleted': "網站已刪除。",
            'alert_settings_reset_to_default': "所有設定已重置為預設值。", 'alert_settings_saved': "設定已儲存。",
            'gm_menu_gite_settings': "⚙️ GITE 設定", 'gm_menu_reset_all_gite_settings': "🚨 重置所有 GITE 設定", 'gm_please_reload': "請重新載入頁面以套用變更。",
            'settings_panel_title': "GITE 設定", 'settings_tab_general': "一般設定", 'settings_tab_exact_size': "精確尺寸", 'settings_tab_size': "大小",
            'settings_tab_time': "時間", 'settings_tab_region': "地區", 'settings_tab_site_search': "站內搜尋",
            
            'settings_label_language': "腳本語言:", 
            'settings_lang_auto': "自動偵測", 
            'settings_lang_en': "英文 (English)", 
            'settings_lang_zh_TW': "繁體中文", 
            'settings_lang_ja': "日文 (日本語)",
            'settings_lang_de': "德文 (Deutsch)", 
            'settings_lang_es': "西班牙文 (Español)", 
            'settings_lang_fr': "法文 (Français)", 
            'settings_lang_it': "義大利文 (Italiano)", 
            'settings_lang_ru': "俄文 (Русский)",

            'settings_label_showtoolbarbutton': "在工具列顯示設定按鈕:", 'settings_label_showresultstats': "在工具列顯示搜尋結果數量:",
            'settings_label_theme': "主題:", 'settings_theme_auto': "自動偵測", 'settings_theme_light': "淺色", 'settings_theme_dark': "深色",
            'settings_label_toolbar_font_size': "選單文字大小 (px):", 'settings_label_toolbar_line_height': "選單行高:",
            'settings_label_showregionflags': "在「地區」選單中顯示國旗：", 'settings_label_showfavicons': "在「站內搜尋」選單中顯示網站圖示：",
            'settings_label_showadvsearch': "在工具列顯示進階搜尋按鈕：", 'settings_label_btn_style': "按鈕樣式:", 'settings_btn_style_text': "僅文字", 'settings_btn_style_icon': "僅圖示", 'settings_btn_style_both': "圖示 + 文字",
            'alert_confirm_reset_all_settings': "確定要將所有設定重置為預設值嗎？此操作無法復原。",
            'settings_enable_filter_category_prefix': "啟用「", 'settings_enable_filter_category_suffix': "」篩選器",
            'settings_label_show_exact_size_inputs_in_menu': "在選單中顯示手動輸入框：",
            'settings_options_for_category_prefix': "「", 'settings_options_for_category_suffix': "」的選項",
            'btn_reset_options_for_category_prefix': "重置「", 'btn_reset_options_for_category_suffix': "」選項",
            'settings_section_predefined_options': "預定義選項:", 'settings_section_your_saved_sizes': "自訂尺寸:",
            'settings_label_add_new_exact_size': "新增精確尺寸:", 'settings_placeholder_label_optional': "標籤 (選填)",
            'settings_label_enable_site_search_filter': "啟用「站內搜尋」篩選器", 'settings_section_your_saved_sites': "自訂網站:",
            'settings_label_add_new_site': "新增網站:", 'settings_placeholder_site_label': "標籤 (例：Reddit)", 'settings_placeholder_site_domain': "網域 (例：reddit.com)",
            'settings_no_saved_items_placeholder': "尚無儲存的項目。",
            'settings_label_layout_two_col': "啟用雙欄式佈局：", 'settings_label_layout_multi_col': "啟用多欄式（瀑布流）佈局：", 'settings_label_embedded_date': "在選單中顯示自訂日期輸入框：",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "工具列位置:",
            'settings_layout_standard': "標準 (嵌入頁頭)",
            'settings_layout_sticky': "釘選 (隨頁面捲動)",
            'settings_label_hide_chips': "隱藏建議關鍵字 (Chips):"
        },
        'ja': {
            'filter_title_size': "サイズ", 'filter_title_exact_size': "正確なサイズ", 'filter_title_aspect_ratio': "アスペクト比",
            'filter_title_color': "色", 'filter_title_type': "種類", 'filter_title_time': "期間",
            'filter_title_usage_rights': "ライセンス", 'filter_title_file_type': "ファイル形式",
            'filter_title_region': "地域", 'filter_title_site_search': "サイト内検索", 'filter_title_advanced_search': "詳細検索",

            'btn_clear': "クリア", 'btn_apply': "適用", 'btn_cancel': "キャンセル", 'btn_close': "閉じる",
            'btn_save_and_close': "保存して閉じる", 'btn_delete': "削除", 'btn_edit_label': "ラベルを編集",
            'btn_save_changes': "保存", 'btn_add_new_exact_size': "追加", 'btn_add_new_site': "追加",
            'btn_reset_all_settings': "すべてリセット", 'btn_reset_general_settings': "一般設定をリセット",

            'option_text_size_any': "すべてのサイズ", 'option_text_size_large': "大", 'option_text_size_medium': "中", 'option_text_size_icon': "アイコン",
            'option_text_size_qsvga': "400×300 以上", 'option_text_size_vga': "640×480 以上", 'option_text_size_svga': "800×600 以上", 'option_text_size_xga': "1024×768 以上",
            'option_text_size_2mp': "2MP 以上", 'option_text_size_4mp': "4MP 以上", 'option_text_size_6mp': "6MP 以上", 'option_text_size_8mp': "8MP 以上",
            'option_text_size_10mp': "10MP 以上", 'option_text_size_12mp': "12MP 以上", 'option_text_size_15mp': "15MP 以上", 'option_text_size_20mp': "20MP 以上",
            'option_text_size_40mp': "40MP 以上", 'option_text_size_70mp': "70MP 以上",

            'option_text_exact_size_any': "すべての正確なサイズ", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD 縦)",
            'option_text_exact_size_768x1024': "768×1024 (XGA 縦)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K 縦)",
            'exact_size_placeholder_width': "幅", 'exact_size_placeholder_height': "高さ",

            'option_text_ar_any': "全アスペクト比", 'option_text_ar_tall': "縦長", 'option_text_ar_square': "正方形", 'option_text_ar_wide': "横長", 'option_text_ar_panoramic': "パノラマ",

            'option_text_color_any': "すべての色", 'option_text_color_full': "フルカラー", 'option_text_color_bw': "白黒", 'option_text_color_transparent': "透明",
            'option_text_color_palette_red': "赤", 'option_text_color_palette_orange': "オレンジ", 'option_text_color_palette_yellow': "黄", 'option_text_color_palette_green': "緑",
            'option_text_color_palette_teal': "青緑", 'option_text_color_palette_blue': "青", 'option_text_color_palette_purple': "紫", 'option_text_color_palette_pink': "ピンク",
            'option_text_color_palette_white': "白", 'option_text_color_palette_gray': "グレー", 'option_text_color_palette_black': "黒", 'option_text_color_palette_brown': "茶",

            'option_text_type_any': "すべての種類", 'option_text_type_face': "顔", 'option_text_type_photo': "写真", 'option_text_type_clipart': "クリップアート", 'option_text_type_lineart': "線画", 'option_text_type_gif': "GIF",

            'option_text_time_any': "期間指定なし",
            'option_text_time_past_15m': "過去15分", 'option_text_time_past_30m': "過去30分", 'option_text_time_past_hour': "過去1時間",
            'option_text_time_past_3h': "過去3時間", 'option_text_time_past_6h': "過去6時間", 'option_text_time_past_9h': "過去9時間", 'option_text_time_past_12h': "過去12時間",
            'option_text_time_past_15h': "過去15時間", 'option_text_time_past_18h': "過去18時間", 'option_text_time_past_21h': "過去21時間", 'option_text_time_past_24h': "過去24時間",
            'option_text_time_past_2d': "過去2日", 'option_text_time_past_3d': "過去3日", 'option_text_time_past_4d': "過去4日", 'option_text_time_past_5d': "過去5日", 'option_text_time_past_6d': "過去6日",
            'option_text_time_past_week': "過去1週間", 'option_text_time_past_2w': "過去2週間", 'option_text_time_past_3w': "過去3週間",
            'option_text_time_past_month': "過去1か月", 'option_text_time_past_2m': "過去2か月", 'option_text_time_past_3m': "過去3か月", 'option_text_time_past_4m': "過去4か月",
            'option_text_time_past_5m': "過去5か月", 'option_text_time_past_6m': "過去6か月", 'option_text_time_past_7m': "過去7か月", 'option_text_time_past_8m': "過去8か月",
            'option_text_time_past_9m': "過去9か月", 'option_text_time_past_10m': "過去10か月", 'option_text_time_past_11m': "過去11か月", 'option_text_time_past_year': "過去1年",
            'option_text_time_past_2y': "過去2年", 'option_text_time_past_3y': "過去3年", 'option_text_time_past_4y': "過去4年", 'option_text_time_past_5y': "過去5年",
            'option_text_time_past_6y': "過去6年", 'option_text_time_past_7y': "過去7年", 'option_text_time_past_8y': "過去8年", 'option_text_time_past_9y': "過去9年", 'option_text_time_past_10y': "過去10年",
            'option_text_time_custom_range': "期間を指定...", 'datepicker_label_from': "開始日:", 'datepicker_label_to': "終了日:",

            'option_text_rights_any': "すべて", 'option_text_rights_cc': "クリエイティブ・コモンズ", 'option_text_rights_commercial': "商用およびその他のライセンス",

            'option_text_filetype_any': "すべての形式", 'option_text_filetype_jpg': "JPG", 'option_text_filetype_jpeg': "JPEG", 'option_text_filetype_gif': "GIF", 'option_text_filetype_png': "PNG", 'option_text_filetype_bmp': "BMP",
            'option_text_filetype_svg': "SVG", 'option_text_filetype_webp': "WEBP", 'option_text_filetype_avif': "AVIF", 'option_text_filetype_ico': "ICO", 'option_text_filetype_raw': "RAW",

            'option_text_region_any': "すべての地域", 'option_text_region_ca': "カナダ", 'option_text_region_us': "アメリカ", 'option_text_region_mx': "メキシコ",
            'option_text_region_ar': "アルゼンチン", 'option_text_region_br': "ブラジル", 'option_text_region_cl': "チリ", 'option_text_region_co': "コロンビア", 'option_text_region_pe': "ペルー",
            'option_text_region_gb': "イギリス", 'option_text_region_fr': "フランス", 'option_text_region_de': "ドイツ", 'option_text_region_it': "イタリア", 'option_text_region_es': "スペイン",
            'option_text_region_al': "アルバニア", 'option_text_region_at': "オーストリア", 'option_text_region_by': "ベラルーシ", 'option_text_region_be': "ベルギー", 'option_text_region_ba': "ボスニア・ヘルツェゴビナ",
            'option_text_region_bg': "ブルガリア", 'option_text_region_hr': "クロアチア", 'option_text_region_cz': "チェコ", 'option_text_region_dk': "デンマーク", 'option_text_region_ee': "エストニア",
            'option_text_region_fi': "フィンランド", 'option_text_region_gr': "ギリシャ", 'option_text_region_hu': "ハンガリー", 'option_text_region_is': "アイスランド", 'option_text_region_ie': "アイルランド",
            'option_text_region_lv': "ラトビア", 'option_text_region_lt': "リトアニア", 'option_text_region_lu': "ルクセンブルク", 'option_text_region_nl': "オランダ", 'option_text_region_no': "ノルウェー",
            'option_text_region_pl': "ポーランド", 'option_text_region_pt': "ポルトガル", 'option_text_region_ro': "ルーマニア", 'option_text_region_ru': "ロシア", 'option_text_region_rs': "セルビア",
            'option_text_region_sk': "スロバキア", 'option_text_region_si': "スロベニア", 'option_text_region_se': "スウェーデン", 'option_text_region_ch': "スイス", 'option_text_region_tr': "トルコ", 'option_text_region_ua': "ウクライナ",
            'option_text_region_jp': "日本", 'option_text_region_kr': "韓国", 'option_text_region_tw': "台湾", 'option_text_region_cn': "中国", 'option_text_region_hk': "香港",
            'option_text_region_in': "インド", 'option_text_region_id': "インドネシア", 'option_text_region_il': "イスラエル", 'option_text_region_my': "マレーシア", 'option_text_region_ph': "フィリピン",
            'option_text_region_sa': "サウジアラビア", 'option_text_region_sg': "シンガポール", 'option_text_region_th': "タイ", 'option_text_region_ae': "アラブ首長国連邦", 'option_text_region_vn': "ベトナム",
            'option_text_region_au': "オーストラリア", 'option_text_region_nz': "ニュージーランド", 'option_text_region_eg': "エジプト", 'option_text_region_ng': "ナイジェリア", 'option_text_region_za': "南アフリカ",
            'option_text_site_any': "すべてのサイト",

            'alert_size_already_saved': "このサイズは既に保存されています。", 'alert_custom_size_deleted': "サイズを削除しました。", 'alert_custom_size_saved': "サイズを保存しました。",
            'alert_invalid_domain': "無効なドメイン形式です。", 'alert_datepicker_select_dates': "開始日と終了日を選択してください。",
            'alert_datepicker_end_before_start': "終了日を開始日より前にすることはできません。", 'alert_datepicker_invalid_date': "無効な日付です。",
            'alert_exact_size_invalid_input': "有効な幅と高さを入力してください。", 'alert_confirm_delete_option_prefix': "「",
            'alert_label_updated': "ラベルを更新しました。", 'alert_exact_size_added': "サイズを追加しました。", 'alert_exact_size_deleted': "サイズを削除しました。",
            'alert_site_label_empty': "ラベルは空にできません。", 'alert_site_domain_empty': "ドメインは空にできません。", 'alert_site_already_saved': "このサイトは既に保存されています。",
            'alert_site_added': "サイトを追加しました。", 'alert_site_deleted': "サイトを削除しました。", 'alert_settings_reset_to_default': "設定をリセットしました。", 'alert_settings_saved': "設定を保存しました。",
            'gm_menu_gite_settings': "⚙️ GITE 設定", 'gm_menu_reset_all_gite_settings': "🚨 すべての設定をリセット", 'gm_please_reload': "変更を適用するにはリロードしてください。",
            'settings_panel_title': "GITE 設定", 'settings_tab_general': "一般設定", 'settings_tab_exact_size': "正確なサイズ", 'settings_tab_size': "サイズ",
            'settings_tab_time': "期間", 'settings_tab_region': "地域", 'settings_tab_site_search': "サイト内検索",
            
            'settings_label_language': "言語:", 
            'settings_lang_auto': "自動検出", 
            'settings_lang_en': "英語 (English)", 
            'settings_lang_zh_TW': "繁体字中国語 (繁體中文)", 
            'settings_lang_ja': "日本語",
            'settings_lang_de': "ドイツ語 (Deutsch)", 
            'settings_lang_es': "スペイン語 (Español)", 
            'settings_lang_fr': "フランス語 (Français)", 
            'settings_lang_it': "イタリア語 (Italiano)", 
            'settings_lang_ru': "ロシア語 (Русский)",

            'settings_label_showtoolbarbutton': "ツールバーに設定ボタンを表示:", 'settings_label_showresultstats': "ツールバーに結果数を表示:",
            'settings_label_theme': "テーマ:", 'settings_theme_auto': "自動検出", 'settings_theme_light': "ライト", 'settings_theme_dark': "ダーク",
            'settings_label_toolbar_font_size': "メニューのフォントサイズ (px):", 'settings_label_toolbar_line_height': "メニューの行の高さ:",
            'settings_label_showregionflags': "地域メニューに国旗を表示:", 'settings_label_showfavicons': "サイト内検索メニューにアイコンを表示:",
            'settings_label_showadvsearch': "詳細検索ボタンを表示:", 'settings_label_btn_style': "ボタンのスタイル:", 'settings_btn_style_text': "テキストのみ", 
            'settings_btn_style_icon': "アイコンのみ", 'settings_btn_style_both': "アイコン + テキスト",
            'alert_confirm_reset_all_settings': "すべての設定をリセットしてもよろしいですか？",
            'settings_enable_filter_category_prefix': "「", 'settings_enable_filter_category_suffix': "」フィルターを有効にする",
            'settings_label_show_exact_size_inputs_in_menu': "メニューに手動入力欄を表示:",
            'settings_options_for_category_prefix': "「", 'settings_options_for_category_suffix': "」のオプション",
            'btn_reset_options_for_category_prefix': "「", 'btn_reset_options_for_category_suffix': "」オプションをリセット",
            'settings_section_predefined_options': "事前定義オプション:", 'settings_section_your_saved_sizes': "保存したサイズ:",
            'settings_label_add_new_exact_size': "サイズを追加:", 'settings_placeholder_label_optional': "ラベル (オプション)",
            'settings_label_enable_site_search_filter': "「サイト内検索」フィルターを有効にする", 'settings_section_your_saved_sites': "保存したサイト:",
            'settings_label_add_new_site': "サイトを追加:", 'settings_placeholder_site_label': "ラベル (例: Reddit)", 'settings_placeholder_site_domain': "ドメイン (例: reddit.com)",
            'settings_no_saved_items_placeholder': "保存されたアイテムはありません。",
            'settings_label_layout_two_col': "2列レイアウトを使用:", 'settings_label_layout_multi_col': "マルチカラム（メイソンリー）レイアウトを使用:", 'settings_label_embedded_date': "メニューに日付選択を表示:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "ツールバーの位置:",
            'settings_layout_standard': "標準 (ヘッダー内)",
            'settings_layout_sticky': "固定 (フローティング)",
            'settings_label_hide_chips': "検索候補チップを非表示:"
        },
        'de': {
            'filter_title_size': "Größe", 'filter_title_exact_size': "Genaue Größe", 'filter_title_aspect_ratio': "Seitenverhältnis",
            'filter_title_color': "Farbe", 'filter_title_type': "Typ", 'filter_title_time': "Zeit",
            'filter_title_usage_rights': "Nutzungsrechte", 'filter_title_file_type': "Dateityp",
            'filter_title_region': "Region", 'filter_title_site_search': "Websitesuche", 'filter_title_advanced_search': "Erweiterte Suche",

            'btn_clear': "Löschen", 'btn_apply': "Anwenden", 'btn_cancel': "Abbrechen", 'btn_close': "Schließen",
            'btn_save_and_close': "Speichern & Schließen", 'btn_delete': "Löschen", 'btn_edit_label': "Label bearbeiten",
            'btn_save_changes': "Speichern", 'btn_add_new_exact_size': "Hinzufügen", 'btn_add_new_site': "Hinzufügen",
            'btn_reset_all_settings': "Alle zurücksetzen", 'btn_reset_general_settings': "Allgemeine Einstellungen zurücksetzen",

            'option_text_size_any': "Beliebige Größe", 'option_text_size_large': "Groß", 'option_text_size_medium': "Mittel", 'option_text_size_icon': "Symbol",
            'option_text_size_qsvga': "Größer als 400×300", 'option_text_size_vga': "Größer als 640×480", 'option_text_size_svga': "Größer als 800×600", 'option_text_size_xga': "Größer als 1024×768",
            'option_text_size_2mp': "Größer als 2 MP", 'option_text_size_4mp': "Größer als 4 MP", 'option_text_size_6mp': "Größer als 6 MP", 'option_text_size_8mp': "Größer als 8 MP",
            'option_text_size_10mp': "Größer als 10 MP", 'option_text_size_12mp': "Größer als 12 MP", 'option_text_size_15mp': "Größer als 15 MP", 'option_text_size_20mp': "Größer als 20 MP",
            'option_text_size_40mp': "Größer als 40 MP", 'option_text_size_70mp': "Größer als 70 MP",

            'option_text_exact_size_any': "Beliebige genaue Größe", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD Port.)",
            'option_text_exact_size_768x1024': "768×1024 (XGA Port.)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K Portrait)",
            'exact_size_placeholder_width': "Breite", 'exact_size_placeholder_height': "Höhe",

            'option_text_ar_any': "Beliebiges Format", 'option_text_ar_tall': "Hochformat", 'option_text_ar_square': "Quadratisch", 'option_text_ar_wide': "Breitbild", 'option_text_ar_panoramic': "Panorama",

            'option_text_color_any': "Beliebige Farbe", 'option_text_color_full': "Vollfarbe", 'option_text_color_bw': "Schwarz-Weiß", 'option_text_color_transparent': "Transparent",
            'option_text_color_palette_red': "Rot", 'option_text_color_palette_orange': "Orange", 'option_text_color_palette_yellow': "Gelb", 'option_text_color_palette_green': "Grün",
            'option_text_color_palette_teal': "Blaugrün", 'option_text_color_palette_blue': "Blau", 'option_text_color_palette_purple': "Lila", 'option_text_color_palette_pink': "Rosa",
            'option_text_color_palette_white': "Weiß", 'option_text_color_palette_gray': "Grau", 'option_text_color_palette_black': "Schwarz", 'option_text_color_palette_brown': "Braun",

            'option_text_type_any': "Beliebiger Typ", 'option_text_type_face': "Gesicht", 'option_text_type_photo': "Foto", 'option_text_type_clipart': "Clipart", 'option_text_type_lineart': "Strichzeichnung", 'option_text_type_gif': "GIF",

            'option_text_time_any': "Beliebige Zeit",
            'option_text_time_past_15m': "Letzte 15 Min.", 'option_text_time_past_30m': "Letzte 30 Min.", 'option_text_time_past_hour': "Letzte Stunde",
            'option_text_time_past_3h': "Letzte 3 Stunden", 'option_text_time_past_6h': "Letzte 6 Stunden", 'option_text_time_past_9h': "Letzte 9 Stunden", 'option_text_time_past_12h': "Letzte 12 Stunden",
            'option_text_time_past_15h': "Letzte 15 Stunden", 'option_text_time_past_18h': "Letzte 18 Stunden", 'option_text_time_past_21h': "Letzte 21 Stunden", 'option_text_time_past_24h': "Letzte 24 Stunden",
            'option_text_time_past_2d': "Letzte 2 Tage", 'option_text_time_past_3d': "Letzte 3 Tage", 'option_text_time_past_4d': "Letzte 4 Tage", 'option_text_time_past_5d': "Letzte 5 Tage", 'option_text_time_past_6d': "Letzte 6 Tage",
            'option_text_time_past_week': "Letzte Woche", 'option_text_time_past_2w': "Letzte 2 Wochen", 'option_text_time_past_3w': "Letzte 3 Wochen",
            'option_text_time_past_month': "Letzter Monat", 'option_text_time_past_2m': "Letzte 2 Monate", 'option_text_time_past_3m': "Letzte 3 Monate", 'option_text_time_past_4m': "Letzte 4 Monate",
            'option_text_time_past_5m': "Letzte 5 Monate", 'option_text_time_past_6m': "Letzte 6 Monate", 'option_text_time_past_7m': "Letzte 7 Monate", 'option_text_time_past_8m': "Letzte 8 Monate",
            'option_text_time_past_9m': "Letzte 9 Monate", 'option_text_time_past_10m': "Letzte 10 Monate", 'option_text_time_past_11m': "Letzte 11 Monate", 'option_text_time_past_year': "Letztes Jahr",
            'option_text_time_past_2y': "Letzte 2 Jahre", 'option_text_time_past_3y': "Letzte 3 Jahre", 'option_text_time_past_4y': "Letzte 4 Jahre", 'option_text_time_past_5y': "Letzte 5 Jahre",
            'option_text_time_past_6y': "Letzte 6 Jahre", 'option_text_time_past_7y': "Letzte 7 Jahre", 'option_text_time_past_8y': "Letzte 8 Jahre", 'option_text_time_past_9y': "Letzte 9 Jahre", 'option_text_time_past_10y': "Letzte 10 Jahre",
            'option_text_time_custom_range': "Zeitraum...", 'datepicker_label_from': "Von:", 'datepicker_label_to': "Bis:",

            'option_text_rights_any': "Alle Lizenzen", 'option_text_rights_cc': "Creative Commons-Lizenzen", 'option_text_rights_commercial': "Kommerzielle & andere Lizenzen",

            'option_text_filetype_any': "Beliebiges Format", 'option_text_filetype_jpg': "JPG-Dateien", 'option_text_filetype_jpeg': "JPEG-Dateien", 'option_text_filetype_gif': "GIF-Dateien", 'option_text_filetype_png': "PNG-Dateien",
            'option_text_filetype_bmp': "BMP-Dateien", 'option_text_filetype_svg': "SVG-Dateien", 'option_text_filetype_webp': "WEBP-Dateien", 'option_text_filetype_avif': "AVIF-Dateien",
            'option_text_filetype_ico': "ICO-Dateien", 'option_text_filetype_raw': "RAW-Dateien",

            'option_text_region_any': "Beliebige Region", 'option_text_region_ca': "Kanada", 'option_text_region_us': "Vereinigte Staaten", 'option_text_region_mx': "Mexiko",
            'option_text_region_ar': "Argentinien", 'option_text_region_br': "Brasilien", 'option_text_region_cl': "Chile", 'option_text_region_co': "Kolumbien", 'option_text_region_pe': "Peru",
            'option_text_region_gb': "Vereinigtes Königreich", 'option_text_region_fr': "Frankreich", 'option_text_region_de': "Deutschland", 'option_text_region_it': "Italien", 'option_text_region_es': "Spanien",
            'option_text_region_al': "Albanien", 'option_text_region_at': "Österreich", 'option_text_region_by': "Weißrussland", 'option_text_region_be': "Belgien", 'option_text_region_ba': "Bosnien und Herzegowina",
            'option_text_region_bg': "Bulgarien", 'option_text_region_hr': "Kroatien", 'option_text_region_cz': "Tschechien", 'option_text_region_dk': "Dänemark", 'option_text_region_ee': "Estland",
            'option_text_region_fi': "Finnland", 'option_text_region_gr': "Griechenland", 'option_text_region_hu': "Ungarn", 'option_text_region_is': "Island", 'option_text_region_ie': "Irland",
            'option_text_region_lv': "Lettland", 'option_text_region_lt': "Litauen", 'option_text_region_lu': "Luxemburg", 'option_text_region_nl': "Niederlande", 'option_text_region_no': "Norwegen",
            'option_text_region_pl': "Polen", 'option_text_region_pt': "Portugal", 'option_text_region_ro': "Rumänien", 'option_text_region_ru': "Russland", 'option_text_region_rs': "Serbien",
            'option_text_region_sk': "Slowakei", 'option_text_region_si': "Slowenien", 'option_text_region_se': "Schweden", 'option_text_region_ch': "Schweiz", 'option_text_region_tr': "Türkei", 'option_text_region_ua': "Ukraine",
            'option_text_region_jp': "Japan", 'option_text_region_kr': "Südkorea", 'option_text_region_tw': "Taiwan", 'option_text_region_cn': "China", 'option_text_region_hk': "Hongkong",
            'option_text_region_in': "Indien", 'option_text_region_id': "Indonesien", 'option_text_region_il': "Israel", 'option_text_region_my': "Malaysia", 'option_text_region_ph': "Philippinen",
            'option_text_region_sa': "Saudi-Arabien", 'option_text_region_sg': "Singapur", 'option_text_region_th': "Thailand", 'option_text_region_ae': "Vereinigte Arabische Emirate", 'option_text_region_vn': "Vietnam",
            'option_text_region_au': "Australien", 'option_text_region_nz': "Neuseeland", 'option_text_region_eg': "Ägypten", 'option_text_region_ng': "Nigeria", 'option_text_region_za': "Südafrika",
            'option_text_site_any': "Beliebige Website",

            'alert_size_already_saved': "Diese Größe ist bereits gespeichert.", 'alert_custom_size_deleted': "Benutzerdefinierte Größe gelöscht.", 'alert_custom_size_saved': "Benutzerdefinierte Größe gespeichert.",
            'alert_invalid_domain': "Ungültiges Domain-Format.", 'alert_datepicker_select_dates': "Bitte wählen Sie Start- und Enddatum.",
            'alert_datepicker_end_before_start': "Das Enddatum darf nicht vor dem Startdatum liegen.", 'alert_datepicker_invalid_date': "Ungültiges Datum.",
            'alert_exact_size_invalid_input': "Bitte geben Sie eine gültige Breite und Höhe ein.", 'alert_confirm_delete_option_prefix': "Löschen \"",
            'alert_label_updated': "Label aktualisiert.", 'alert_exact_size_added': "Neue genaue Größe hinzugefügt.", 'alert_exact_size_deleted': "Gespeicherte Größe gelöscht.",
            'alert_site_label_empty': "Website-Label darf nicht leer sein.", 'alert_site_domain_empty': "Website-Domain darf nicht leer sein.", 'alert_site_already_saved': "Diese Website/Domain ist bereits gespeichert.",
            'alert_site_added': "Neue Website hinzugefügt.", 'alert_site_deleted': "Gespeicherte Website gelöscht.",
            'alert_settings_reset_to_default': "Alle Einstellungen wurden auf Standard zurückgesetzt.", 'alert_settings_saved': "Einstellungen erfolgreich gespeichert.",
            'gm_menu_gite_settings': "⚙️ GITE Einstellungen", 'gm_menu_reset_all_gite_settings': "🚨 Alle Einstellungen zurücksetzen", 'gm_please_reload': "Bitte laden Sie die Seite neu, damit die Änderungen wirksam werden.",
            'settings_panel_title': "GITE Einstellungen", 'settings_tab_general': "Allgemein", 'settings_tab_exact_size': "Genaue Größe", 'settings_tab_size': "Größe",
            'settings_tab_time': "Zeit", 'settings_tab_region': "Region", 'settings_tab_site_search': "Websitesuche",
            
            'settings_label_language': "Sprache:", 
            'settings_lang_auto': "Automatisch", 
            'settings_lang_en': "Englisch (English)", 
            'settings_lang_zh_TW': "Traditionelles Chinesisch (繁體中文)", 
            'settings_lang_ja': "Japanisch (日本語)",
            'settings_lang_de': "Deutsch", 
            'settings_lang_es': "Spanisch (Español)", 
            'settings_lang_fr': "Französisch (Français)", 
            'settings_lang_it': "Italienisch (Italiano)", 
            'settings_lang_ru': "Russisch (Русский)",

            'settings_label_showtoolbarbutton': "Einstellungen-Button in der Symbolleiste anzeigen:", 'settings_label_showresultstats': "Ergebnisstatistiken in der Symbolleiste anzeigen:",
            'settings_label_theme': "Thema:", 'settings_theme_auto': "Automatisch", 'settings_theme_light': "Hell", 'settings_theme_dark': "Dunkel",
            'settings_label_toolbar_font_size': "Menü Schriftgröße (px):", 'settings_label_toolbar_line_height': "Menü Zeilenhöhe:",
            'settings_label_showregionflags': "Länderflaggen im Regionen-Filter anzeigen:", 'settings_label_showfavicons': "Favicons im Websitesuche-Filter anzeigen:",
            'settings_label_showadvsearch': "Button für erweiterte Suche anzeigen:", 'settings_label_btn_style': "Button-Stil:", 'settings_btn_style_text': "Nur Text",
            'settings_btn_style_icon': "Nur Symbol", 'settings_btn_style_both': "Symbol + Text",
            'alert_confirm_reset_all_settings': "Sind Sie sicher, dass Sie ALLE GITE-Einstellungen zurücksetzen möchten? Dies kann nicht rückgängig gemacht werden.",
            'settings_enable_filter_category_prefix': "Filter \"", 'settings_enable_filter_category_suffix': "\" aktivieren",
            'settings_label_show_exact_size_inputs_in_menu': "Manuelle Eingabe im Menü anzeigen:",
            'settings_options_for_category_prefix': "Optionen für \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Optionen für \"", 'btn_reset_options_for_category_suffix': "\" zurücksetzen",
            'settings_section_predefined_options': "Vordefinierte Optionen:", 'settings_section_your_saved_sizes': "Ihre gespeicherten Größen:",
            'settings_label_add_new_exact_size': "Neue genaue Größe hinzufügen:", 'settings_placeholder_label_optional': "Label (optional)",
            'settings_label_enable_site_search_filter': "Filter \"Websitesuche\" aktivieren", 'settings_section_your_saved_sites': "Ihre gespeicherten Websites:",
            'settings_label_add_new_site': "Neue Website hinzufügen:", 'settings_placeholder_site_label': "Label (z.B. Reddit)", 'settings_placeholder_site_domain': "Domain (z.B. reddit.com)",
            'settings_no_saved_items_placeholder': "Noch keine gespeicherten Elemente.",
            'settings_label_layout_two_col': "Zweispaltiges Layout verwenden:", 'settings_label_layout_multi_col': "Mehrspaltiges (Masonry) Layout verwenden:", 'settings_label_embedded_date': "Datumsauswahl direkt im Menü anzeigen:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Position der Symbolleiste:",
            'settings_layout_standard': "Standard (Eingebettet)",
            'settings_layout_sticky': "Angeheftet (Schwebend)",
            'settings_label_hide_chips': "Suchvorschläge ausblenden:"
        },
        'es': {
            'filter_title_size': "Tamaño", 'filter_title_exact_size': "Tamaño exacto", 'filter_title_aspect_ratio': "Relación de aspecto", 'filter_title_color': "Color", 'filter_title_type': "Tipo",
            'filter_title_time': "Fecha", 'filter_title_usage_rights': "Derechos de uso", 'filter_title_file_type': "Tipo de archivo", 'filter_title_region': "Región", 'filter_title_site_search': "Búsqueda en el sitio",
            'filter_title_advanced_search': "Búsqueda avanzada",
            'btn_clear': "Borrar", 'btn_apply': "Aplicar", 'btn_cancel': "Cancelar", 'btn_close': "Cerrar", 'btn_save_and_close': "Guardar y cerrar", 'btn_delete': "Eliminar",
            'btn_edit_label': "Editar etiqueta", 'btn_save_changes': "Guardar", 'btn_add_new_exact_size': "Añadir", 'btn_add_new_site': "Añadir",
            'btn_reset_all_settings': "Restablecer todo", 'btn_reset_general_settings': "Restablecer configuración general",
            'option_text_size_any': "Cualquier tamaño", 'option_text_size_large': "Grande", 'option_text_size_medium': "Mediano", 'option_text_size_icon': "Icono",
            'option_text_size_qsvga': "Más de 400×300", 'option_text_size_vga': "Más de 640×480", 'option_text_size_svga': "Más de 800×600", 'option_text_size_xga': "Más de 1024×768",
            'option_text_size_2mp': "Más de 2 MP", 'option_text_size_4mp': "Más de 4 MP", 'option_text_size_6mp': "Más de 6 MP", 'option_text_size_8mp': "Más de 8 MP",
            'option_text_size_10mp': "Más de 10 MP", 'option_text_size_12mp': "Más de 12 MP", 'option_text_size_15mp': "Más de 15 MP", 'option_text_size_20mp': "Más de 20 MP",
            'option_text_size_40mp': "Más de 40 MP", 'option_text_size_70mp': "Más de 70 MP",
            'option_text_exact_size_any': "Cualquier tamaño exacto",
            'exact_size_placeholder_width': "Ancho", 'exact_size_placeholder_height': "Alto",
            'option_text_ar_any': "Cualquier relación de aspecto", 'option_text_ar_tall': "Alto", 'option_text_ar_square': "Cuadrado", 'option_text_ar_wide': "Ancho", 'option_text_ar_panoramic': "Panorámico",
            'option_text_color_any': "Cualquier color", 'option_text_color_full': "A todo color", 'option_text_color_bw': "Blanco y negro", 'option_text_color_transparent': "Transparente",
            'option_text_color_palette_red': "Rojo", 'option_text_color_palette_orange': "Naranja", 'option_text_color_palette_yellow': "Amarillo", 'option_text_color_palette_green': "Verde",
            'option_text_color_palette_teal': "Verde azulado", 'option_text_color_palette_blue': "Azul", 'option_text_color_palette_purple': "Púrpura", 'option_text_color_palette_pink': "Rosa",
            'option_text_color_palette_white': "Blanco", 'option_text_color_palette_gray': "Gris", 'option_text_color_palette_black': "Negro", 'option_text_color_palette_brown': "Marrón",
            'option_text_type_any': "Cualquier tipo", 'option_text_type_face': "Cara", 'option_text_type_photo': "Fotografía", 'option_text_type_clipart': "Imágenes prediseñadas", 'option_text_type_lineart': "Dibujo lineal", 'option_text_type_gif': "GIF",
            'option_text_time_any': "Cualquier fecha", 'option_text_time_past_15m': "Últimos 15 minutos", 'option_text_time_past_30m': "Últimos 30 minutos", 'option_text_time_past_hour': "Última hora",
            'option_text_time_past_3h': "Últimas 3 horas", 'option_text_time_past_6h': "Últimas 6 horas", 'option_text_time_past_9h': "Últimas 9 horas", 'option_text_time_past_12h': "Últimas 12 horas",
            'option_text_time_past_24h': "Últimas 24 horas", 'option_text_time_past_week': "Última semana", 'option_text_time_past_month': "Último mes", 'option_text_time_past_year': "Último año",
            'option_text_time_custom_range': "Intervalo personalizado...", 'datepicker_label_from': "Desde:", 'datepicker_label_to': "Hasta:",
            'option_text_rights_any': "Todas las licencias", 'option_text_rights_cc': "Licencias Creative Commons", 'option_text_rights_commercial': "Licencias comerciales y de otro tipo",
            'option_text_filetype_any': "Cualquier formato", 'option_text_filetype_jpg': "Archivos JPG", 'option_text_filetype_jpeg': "Archivos JPEG", 'option_text_filetype_gif': "Archivos GIF", 'option_text_filetype_png': "Archivos PNG",
            'option_text_filetype_bmp': "Archivos BMP", 'option_text_filetype_svg': "Archivos SVG", 'option_text_filetype_webp': "Archivos WEBP", 'option_text_filetype_avif': "Archivos AVIF",
            'option_text_filetype_ico': "Archivos ICO", 'option_text_filetype_raw': "Archivos RAW",
            'option_text_region_any': "Cualquier región", 'option_text_region_ca': "Canadá", 'option_text_region_us': "Estados Unidos", 'option_text_region_mx': "México",
            'option_text_region_ar': "Argentina", 'option_text_region_br': "Brasil", 'option_text_region_cl': "Chile", 'option_text_region_co': "Colombia", 'option_text_region_pe': "Perú",
            'option_text_region_gb': "Reino Unido", 'option_text_region_fr': "Francia", 'option_text_region_de': "Alemania", 'option_text_region_it': "Italia", 'option_text_region_es': "España",
            'option_text_region_al': "Albania", 'option_text_region_at': "Austria", 'option_text_region_by': "Bielorrusia", 'option_text_region_be': "Bélgica", 'option_text_region_ba': "Bosnia y Herzegovina",
            'option_text_region_bg': "Bulgaria", 'option_text_region_hr': "Croacia", 'option_text_region_cz': "República Checa", 'option_text_region_dk': "Dinamarca", 'option_text_region_ee': "Estonia",
            'option_text_region_fi': "Finlandia", 'option_text_region_gr': "Grecia", 'option_text_region_hu': "Hungría", 'option_text_region_is': "Islandia", 'option_text_region_ie': "Irlanda",
            'option_text_region_lv': "Letonia", 'option_text_region_lt': "Lituania", 'option_text_region_lu': "Luxemburgo", 'option_text_region_nl': "Países Bajos", 'option_text_region_no': "Noruega",
            'option_text_region_pl': "Polonia", 'option_text_region_pt': "Portugal", 'option_text_region_ro': "Rumanía", 'option_text_region_ru': "Rusia", 'option_text_region_rs': "Serbia",
            'option_text_region_sk': "Eslovaquia", 'option_text_region_si': "Eslovenia", 'option_text_region_se': "Suecia", 'option_text_region_ch': "Suiza", 'option_text_region_tr': "Turquía", 'option_text_region_ua': "Ucrania",
            'option_text_region_jp': "Japón", 'option_text_region_kr': "Corea del Sur", 'option_text_region_tw': "Taiwán", 'option_text_region_cn': "China", 'option_text_region_hk': "Hong Kong",
            'option_text_region_in': "India", 'option_text_region_id': "Indonesia", 'option_text_region_il': "Israel", 'option_text_region_my': "Malasia", 'option_text_region_ph': "Filipinas",
            'option_text_region_sa': "Arabia Saudita", 'option_text_region_sg': "Singapur", 'option_text_region_th': "Tailandia", 'option_text_region_ae': "Emiratos Árabes Unidos", 'option_text_region_vn': "Vietnam",
            'option_text_region_au': "Australia", 'option_text_region_nz': "Nueva Zelanda", 'option_text_region_eg': "Egipto", 'option_text_region_ng': "Nigeria", 'option_text_region_za': "Sudáfrica",
            'option_text_site_any': "Cualquier sitio",
            'alert_size_already_saved': "Este tamaño ya está guardado.", 'alert_custom_size_deleted': "Tamaño personalizado eliminado.", 'alert_custom_size_saved': "Tamaño personalizado guardado.",
            'alert_invalid_domain': "Formato de dominio no válido.", 'alert_datepicker_select_dates': "Por favor, seleccione una fecha de inicio y fin.",
            'alert_datepicker_end_before_start': "La fecha de finalización no puede ser anterior a la de inicio.", 'alert_datepicker_invalid_date': "Fecha no válida.",
            'alert_exact_size_invalid_input': "Por favor, introduzca un ancho y alto válidos.", 'alert_confirm_delete_option_prefix': "Eliminar \"",
            'alert_label_updated': "Etiqueta actualizada.", 'alert_exact_size_added': "Nuevo tamaño exacto añadido.", 'alert_exact_size_deleted': "Tamaño guardado eliminado.",
            'alert_site_label_empty': "La etiqueta del sitio no puede estar vacía.", 'alert_site_domain_empty': "El dominio del sitio no puede estar vacío.", 'alert_site_already_saved': "Este sitio/dominio ya está guardado.",
            'alert_site_added': "Nuevo sitio añadido.", 'alert_site_deleted': "Sitio guardado eliminado.",
            'alert_settings_reset_to_default': "Todos los ajustes se han restablecido a los valores predeterminados.", 'alert_settings_saved': "Ajustes guardados correctamente.",
            'gm_menu_gite_settings': "⚙️ Configuración GITE", 'gm_menu_reset_all_gite_settings': "🚨 Restablecer todo", 'gm_please_reload': "Por favor, recarga la página para aplicar los cambios.",
            'settings_panel_title': "Configuración GITE", 'settings_tab_general': "General", 'settings_tab_exact_size': "Tamaño exacto", 'settings_tab_size': "Tamaño",
            'settings_tab_time': "Fecha", 'settings_tab_region': "Región", 'settings_tab_site_search': "Búsqueda en sitio",
            
            'settings_label_language': "Idioma:", 
            'settings_lang_auto': "Automático", 
            'settings_lang_en': "Inglés (English)", 
            'settings_lang_zh_TW': "Chino tradicional (繁體中文)", 
            'settings_lang_ja': "Japonés (日本語)",
            'settings_lang_de': "Alemán (Deutsch)", 
            'settings_lang_es': "Español", 
            'settings_lang_fr': "Francés (Français)", 
            'settings_lang_it': "Italiano (Italiano)", 
            'settings_lang_ru': "Ruso (Русский)",

            'settings_label_showtoolbarbutton': "Mostrar botón de configuración:", 'settings_label_showresultstats': "Mostrar estadísticas de resultados:",
            'settings_label_theme': "Tema:", 'settings_theme_auto': "Automático", 'settings_theme_light': "Claro", 'settings_theme_dark': "Oscuro",
            'settings_label_toolbar_font_size': "Tamaño de fuente del menú (px):", 'settings_label_toolbar_line_height': "Altura de línea del menú:",
            'settings_label_showregionflags': "Mostrar banderas en filtro Región:", 'settings_label_showfavicons': "Mostrar iconos en Búsqueda en sitio:",
            'settings_label_showadvsearch': "Mostrar botón de Búsqueda avanzada:", 'settings_label_btn_style': "Estilo de botón:", 'settings_btn_style_text': "Solo texto",
            'settings_btn_style_icon': "Solo icono", 'settings_btn_style_both': "Icono + Texto",
            'alert_confirm_reset_all_settings': "¿Seguro que quieres restablecer TODOS los ajustes de GITE? Esto no se puede deshacer.",
            'settings_enable_filter_category_prefix': "Habilitar filtro \"", 'settings_enable_filter_category_suffix': "\"",
            'settings_label_show_exact_size_inputs_in_menu': "Mostrar entrada manual en el menú:",
            'settings_options_for_category_prefix': "Opciones para \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Restablecer opciones de \"", 'btn_reset_options_for_category_suffix': "\"",
            'settings_section_predefined_options': "Opciones predefinidas:", 'settings_section_your_saved_sizes': "Tus tamaños guardados:",
            'settings_label_add_new_exact_size': "Añadir nuevo tamaño exacto:", 'settings_placeholder_label_optional': "Etiqueta (opcional)",
            'settings_label_enable_site_search_filter': "Habilitar filtro \"Búsqueda en sitio\"", 'settings_section_your_saved_sites': "Tus sitios guardados:",
            'settings_label_add_new_site': "Añadir nuevo sitio:", 'settings_placeholder_site_label': "Etiqueta (ej. Reddit)", 'settings_placeholder_site_domain': "Dominio (ej. reddit.com)",
            'settings_no_saved_items_placeholder': "No hay elementos guardados.",
            'settings_label_layout_two_col': "Usar diseño de dos columnas:", 'settings_label_layout_multi_col': "Usar diseño de múltiples columnas (masonry):", 'settings_label_embedded_date': "Mostrar selector de fecha en el menú:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Posición de la barra de herramientas:",
            'settings_layout_standard': "Estándar (Incrustado)",
            'settings_layout_sticky': "Fijo (Flotante)",
            'settings_label_hide_chips': "Ocultar sugerencias de búsqueda:"
        },
        'fr': {
            'filter_title_size': "Taille", 'filter_title_exact_size': "Taille exacte", 'filter_title_aspect_ratio': "Proportions", 'filter_title_color': "Couleur", 'filter_title_type': "Type",
            'filter_title_time': "Date", 'filter_title_usage_rights': "Droits d'usage", 'filter_title_file_type': "Type de fichier", 'filter_title_region': "Région", 'filter_title_site_search': "Recherche par site",
            'filter_title_advanced_search': "Recherche avancée",
            'btn_clear': "Effacer", 'btn_apply': "Appliquer", 'btn_cancel': "Annuler", 'btn_close': "Fermer", 'btn_save_and_close': "Enregistrer et fermer", 'btn_delete': "Supprimer",
            'btn_edit_label': "Modifier le libellé", 'btn_save_changes': "Enregistrer", 'btn_add_new_exact_size': "Ajouter", 'btn_add_new_site': "Ajouter",
            'btn_reset_all_settings': "Tout réinitialiser", 'btn_reset_general_settings': "Réinitialiser les paramètres généraux",
            'option_text_size_any': "Toutes tailles", 'option_text_size_large': "Grande", 'option_text_size_medium': "Moyenne", 'option_text_size_icon': "Icône",
            'option_text_size_qsvga': "Plus de 400×300", 'option_text_size_vga': "Plus de 640×480", 'option_text_size_svga': "Plus de 800×600", 'option_text_size_xga': "Plus de 1024×768",
            'option_text_size_2mp': "Plus de 2 MP", 'option_text_size_4mp': "Plus de 4 MP", 'option_text_size_6mp': "Plus de 6 MP", 'option_text_size_8mp': "Plus de 8 MP",
            'option_text_size_10mp': "Plus de 10 MP", 'option_text_size_12mp': "Plus de 12 MP", 'option_text_size_15mp': "Plus de 15 MP", 'option_text_size_20mp': "Plus de 20 MP",
            'option_text_size_40mp': "Plus de 40 MP", 'option_text_size_70mp': "Plus de 70 MP",
            'option_text_exact_size_any': "Toute taille exacte", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD Port.)",
            'option_text_exact_size_768x1024': "768×1024 (XGA Port.)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K Portrait)",
            'exact_size_placeholder_width': "Largeur", 'exact_size_placeholder_height': "Hauteur",
            'option_text_ar_any': "Toutes proportions", 'option_text_ar_tall': "Haute", 'option_text_ar_square': "Carrée", 'option_text_ar_wide': "Large", 'option_text_ar_panoramic': "Panoramique",
            'option_text_color_any': "Toutes couleurs", 'option_text_color_full': "Couleurs", 'option_text_color_bw': "Noir et blanc", 'option_text_color_transparent': "Transparent",
            'option_text_color_palette_red': "Rouge", 'option_text_color_palette_orange': "Orange", 'option_text_color_palette_yellow': "Jaune", 'option_text_color_palette_green': "Vert",
            'option_text_color_palette_teal': "Sarcelle", 'option_text_color_palette_blue': "Bleu", 'option_text_color_palette_purple': "Violet", 'option_text_color_palette_pink': "Rose",
            'option_text_color_palette_white': "Blanc", 'option_text_color_palette_gray': "Gris", 'option_text_color_palette_black': "Noir", 'option_text_color_palette_brown': "Marron",
            'option_text_type_any': "Tous types", 'option_text_type_face': "Visage", 'option_text_type_photo': "Photo", 'option_text_type_clipart': "Images clipart", 'option_text_type_lineart': "Dessin au trait", 'option_text_type_gif': "GIF",
            'option_text_time_any': "Toutes dates", 'option_text_time_past_15m': "Moins de 15 min", 'option_text_time_past_30m': "Moins de 30 min", 'option_text_time_past_hour': "Moins d'une heure",
            'option_text_time_past_3h': "Moins de 3 heures", 'option_text_time_past_6h': "Moins de 6 heures", 'option_text_time_past_9h': "Moins de 9 heures", 'option_text_time_past_12h': "Moins de 12 heures",
            'option_text_time_past_15h': "Moins de 15 heures", 'option_text_time_past_18h': "Moins de 18 heures", 'option_text_time_past_21h': "Moins de 21 heures", 'option_text_time_past_24h': "Moins de 24 heures",
            'option_text_time_past_2d': "Moins de 2 jours", 'option_text_time_past_3d': "Moins de 3 jours", 'option_text_time_past_4d': "Moins de 4 jours", 'option_text_time_past_5d': "Moins de 5 jours", 'option_text_time_past_6d': "Moins de 6 jours",
            'option_text_time_past_week': "Moins d'une semaine", 'option_text_time_past_2w': "Moins de 2 semaines", 'option_text_time_past_3w': "Moins de 3 semaines",
            'option_text_time_past_month': "Moins d'un mois", 'option_text_time_past_2m': "Moins de 2 mois", 'option_text_time_past_3m': "Moins de 3 mois", 'option_text_time_past_4m': "Moins de 4 mois",
            'option_text_time_past_5m': "Moins de 5 mois", 'option_text_time_past_6m': "Moins de 6 mois", 'option_text_time_past_7m': "Moins de 7 mois", 'option_text_time_past_8m': "Moins de 8 mois",
            'option_text_time_past_9m': "Moins de 9 mois", 'option_text_time_past_10m': "Moins de 10 mois", 'option_text_time_past_11m': "Moins de 11 mois", 'option_text_time_past_year': "Moins d'un an",
            'option_text_time_past_2y': "Moins de 2 ans", 'option_text_time_past_3y': "Moins de 3 ans", 'option_text_time_past_4y': "Moins de 4 ans", 'option_text_time_past_5y': "Moins de 5 ans",
            'option_text_time_past_6y': "Moins de 6 ans", 'option_text_time_past_7y': "Moins de 7 ans", 'option_text_time_past_8y': "Moins de 8 ans", 'option_text_time_past_9y': "Moins de 9 ans", 'option_text_time_past_10y': "Moins de 10 ans",
            'option_text_time_custom_range': "Période personnalisée...", 'datepicker_label_from': "De :", 'datepicker_label_to': "À :",
            'option_text_rights_any': "Toutes les licences", 'option_text_rights_cc': "Licences Creative Commons", 'option_text_rights_commercial': "Licences commerciales et autres",
            'option_text_filetype_any': "Tous formats", 'option_text_filetype_jpg': "Fichiers JPG", 'option_text_filetype_jpeg': "Fichiers JPEG", 'option_text_filetype_gif': "Fichiers GIF", 'option_text_filetype_png': "Fichiers PNG",
            'option_text_filetype_bmp': "Fichiers BMP", 'option_text_filetype_svg': "Fichiers SVG", 'option_text_filetype_webp': "Fichiers WEBP", 'option_text_filetype_avif': "Fichiers AVIF",
            'option_text_filetype_ico': "Fichiers ICO", 'option_text_filetype_raw': "Fichiers RAW",
            'option_text_region_any': "Toutes régions", 'option_text_region_ca': "Canada", 'option_text_region_us': "États-Unis", 'option_text_region_mx': "Mexique",
            'option_text_region_ar': "Argentine", 'option_text_region_br': "Brésil", 'option_text_region_cl': "Chili", 'option_text_region_co': "Colombie", 'option_text_region_pe': "Pérou",
            'option_text_region_gb': "Royaume-Uni", 'option_text_region_fr': "France", 'option_text_region_de': "Allemagne", 'option_text_region_it': "Italie", 'option_text_region_es': "Espagne",
            'option_text_region_al': "Albanie", 'option_text_region_at': "Autriche", 'option_text_region_by': "Biélorussie", 'option_text_region_be': "Belgique", 'option_text_region_ba': "Bosnie-Herzégovine",
            'option_text_region_bg': "Bulgarie", 'option_text_region_hr': "Croatie", 'option_text_region_cz': "République tchèque", 'option_text_region_dk': "Danemark", 'option_text_region_ee': "Estonie",
            'option_text_region_fi': "Finlande", 'option_text_region_gr': "Grèce", 'option_text_region_hu': "Hongrie", 'option_text_region_is': "Islande", 'option_text_region_ie': "Irlande",
            'option_text_region_lv': "Lettonie", 'option_text_region_lt': "Lituanie", 'option_text_region_lu': "Luxembourg", 'option_text_region_nl': "Pays-Bas", 'option_text_region_no': "Norvège",
            'option_text_region_pl': "Pologne", 'option_text_region_pt': "Portugal", 'option_text_region_ro': "Roumanie", 'option_text_region_ru': "Russie", 'option_text_region_rs': "Serbie",
            'option_text_region_sk': "Slovaquie", 'option_text_region_si': "Slovénie", 'option_text_region_se': "Suède", 'option_text_region_ch': "Suisse", 'option_text_region_tr': "Turquie", 'option_text_region_ua': "Ukraine",
            'option_text_region_jp': "Japon", 'option_text_region_kr': "Corée du Sud", 'option_text_region_tw': "Taïwan", 'option_text_region_cn': "Chine", 'option_text_region_hk': "Hong Kong",
            'option_text_region_in': "Inde", 'option_text_region_id': "Indonésie", 'option_text_region_il': "Israël", 'option_text_region_my': "Malaisie", 'option_text_region_ph': "Philippines",
            'option_text_region_sa': "Arabie saoudite", 'option_text_region_sg': "Singapour", 'option_text_region_th': "Thaïlande", 'option_text_region_ae': "Émirats arabes unis", 'option_text_region_vn': "Viêt Nam",
            'option_text_region_au': "Australie", 'option_text_region_nz': "Nouvelle-Zélande", 'option_text_region_eg': "Égypte", 'option_text_region_ng': "Nigeria", 'option_text_region_za': "Afrique du Sud",
            'option_text_site_any': "Tous sites",
            'alert_size_already_saved': "Cette taille est déjà enregistrée.", 'alert_custom_size_deleted': "Taille personnalisée supprimée.", 'alert_custom_size_saved': "Taille personnalisée enregistrée.",
            'alert_invalid_domain': "Format de domaine invalide.", 'alert_datepicker_select_dates': "Veuillez sélectionner une date de début et de fin.",
            'alert_datepicker_end_before_start': "La date de fin ne peut pas être antérieure à la date de début.", 'alert_datepicker_invalid_date': "Date invalide.",
            'alert_exact_size_invalid_input': "Veuillez entrer une largeur et une hauteur valides.", 'alert_confirm_delete_option_prefix': "Supprimer \"",
            'alert_label_updated': "Libellé mis à jour.", 'alert_exact_size_added': "Nouvelle taille exacte ajoutée.", 'alert_exact_size_deleted': "Taille enregistrée supprimée.",
            'alert_site_label_empty': "Le libellé du site ne peut pas être vide.", 'alert_site_domain_empty': "Le domaine du site ne peut pas être vide.", 'alert_site_already_saved': "Ce site/domaine est déjà enregistré.",
            'alert_site_added': "Nouveau site ajouté.", 'alert_site_deleted': "Site enregistré supprimé.",
            'alert_settings_reset_to_default': "Tous les paramètres ont été réinitialisés par défaut.", 'alert_settings_saved': "Paramètres enregistrés avec succès.",
            'gm_menu_gite_settings': "⚙️ Paramètres GITE", 'gm_menu_reset_all_gite_settings': "🚨 Tout réinitialiser", 'gm_please_reload': "Veuillez recharger la page pour appliquer les modifications.",
            'settings_panel_title': "Paramètres GITE", 'settings_tab_general': "Général", 'settings_tab_exact_size': "Taille exacte", 'settings_tab_size': "Taille",
            'settings_tab_time': "Date", 'settings_tab_region': "Région", 'settings_tab_site_search': "Recherche par site",
            
            'settings_label_language': "Langue :", 
            'settings_lang_auto': "Détection auto", 
            'settings_lang_en': "Anglais (English)", 
            'settings_lang_zh_TW': "Chinois traditionnel (繁體中文)", 
            'settings_lang_ja': "Japonais (日本語)",
            'settings_lang_de': "Allemand (Deutsch)", 
            'settings_lang_es': "Espagnol (Español)", 
            'settings_lang_fr': "Français", 
            'settings_lang_it': "Italien (Italiano)", 
            'settings_lang_ru': "Russe (Русский)",

            'settings_label_showtoolbarbutton': "Afficher le bouton paramètres :", 'settings_label_showresultstats': "Afficher les stats de résultats :",
            'settings_label_theme': "Thème :", 'settings_theme_auto': "Auto", 'settings_theme_light': "Clair", 'settings_theme_dark': "Sombre",
            'settings_label_toolbar_font_size': "Taille de police du menu (px) :", 'settings_label_toolbar_line_height': "Hauteur de ligne du menu :",
            'settings_label_showregionflags': "Afficher les drapeaux dans le filtre Région :", 'settings_label_showfavicons': "Afficher les favicons dans Recherche par site :",
            'settings_label_showadvsearch': "Afficher le bouton Recherche avancée :", 'settings_label_btn_style': "Style de bouton :", 'settings_btn_style_text': "Texte seul",
            'settings_btn_style_icon': "Icône seule", 'settings_btn_style_both': "Icône + Texte",
            'alert_confirm_reset_all_settings': "Êtes-vous sûr de vouloir réinitialiser TOUS les paramètres GITE ? Cette action est irréversible.",
            'settings_enable_filter_category_prefix': "Activer le filtre \"", 'settings_enable_filter_category_suffix': "\"",
            'settings_label_show_exact_size_inputs_in_menu': "Afficher la saisie manuelle dans le menu :",
            'settings_options_for_category_prefix': "Options pour \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Réinit. options de \"", 'btn_reset_options_for_category_suffix': "\"",
            'settings_section_predefined_options': "Options prédéfinies :", 'settings_section_your_saved_sizes': "Vos tailles enregistrées :",
            'settings_label_add_new_exact_size': "Ajouter une taille exacte :", 'settings_placeholder_label_optional': "Libellé (optionnel)",
            'settings_label_enable_site_search_filter': "Activer le filtre \"Recherche par site\"", 'settings_section_your_saved_sites': "Vos sites enregistrés :",
            'settings_label_add_new_site': "Ajouter un site :", 'settings_placeholder_site_label': "Libellé (ex : Reddit)", 'settings_placeholder_site_domain': "Domaine (ex : reddit.com)",
            'settings_no_saved_items_placeholder': "Aucun élément enregistré.",
            'settings_label_layout_two_col': "Utiliser la mise en page sur 2 colonnes :", 'settings_label_layout_multi_col': "Utiliser la mise en page multi-colonnes :", 'settings_label_embedded_date': "Afficher le sélecteur de date dans le menu :",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Position de la barre d'outils :",
            'settings_layout_standard': "Standard (Intégré)",
            'settings_layout_sticky': "Épinglé (Flottant)",
            'settings_label_hide_chips': "Masquer les suggestions de recherche :"
        },
        'it': {
            'filter_title_size': "Dimensioni", 'filter_title_exact_size': "Dimensioni esatte", 'filter_title_aspect_ratio': "Proporzioni",
            'filter_title_color': "Colore", 'filter_title_type': "Tipo", 'filter_title_time': "Data",
            'filter_title_usage_rights': "Diritti di utilizzo", 'filter_title_file_type': "Tipo di file",
            'filter_title_region': "Regione", 'filter_title_site_search': "Cerca nel sito", 'filter_title_advanced_search': "Ricerca avanzata",

            'btn_clear': "Cancella", 'btn_apply': "Applica", 'btn_cancel': "Annulla", 'btn_close': "Chiudi",
            'btn_save_and_close': "Salva e chiudi", 'btn_delete': "Elimina", 'btn_edit_label': "Modifica etichetta",
            'btn_save_changes': "Salva", 'btn_add_new_exact_size': "Aggiungi", 'btn_add_new_site': "Aggiungi",
            'btn_reset_all_settings': "Reimposta tutto", 'btn_reset_general_settings': "Reimposta impostazioni generali",

            'option_text_size_any': "Qualsiasi dimensione", 'option_text_size_large': "Grandi", 'option_text_size_medium': "Medie", 'option_text_size_icon': "Icone",
            'option_text_size_qsvga': "Maggiori di 400×300", 'option_text_size_vga': "Maggiori di 640×480", 'option_text_size_svga': "Maggiori di 800×600", 'option_text_size_xga': "Maggiori di 1024×768",
            'option_text_size_2mp': "Maggiori di 2 MP", 'option_text_size_4mp': "Maggiori di 4 MP", 'option_text_size_6mp': "Maggiori di 6 MP", 'option_text_size_8mp': "Maggiori di 8 MP",
            'option_text_size_10mp': "Maggiori di 10 MP", 'option_text_size_12mp': "Maggiori di 12 MP", 'option_text_size_15mp': "Maggiori di 15 MP", 'option_text_size_20mp': "Maggiori di 20 MP",
            'option_text_size_40mp': "Maggiori di 40 MP", 'option_text_size_70mp': "Maggiori di 70 MP",

            'option_text_exact_size_any': "Qualsiasi dim. esatta", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD Port.)",
            'option_text_exact_size_768x1024': "768×1024 (XGA Port.)", 'option_text_exact_size_1920x1200': "1920×1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560×1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K Portrait)",
            'exact_size_placeholder_width': "Larghezza", 'exact_size_placeholder_height': "Altezza",

            'option_text_ar_any': "Qualsiasi proporzione", 'option_text_ar_tall': "A sviluppo verticale", 'option_text_ar_square': "Quadrata", 'option_text_ar_wide': "A sviluppo orizzontale", 'option_text_ar_panoramic': "Panoramica",

            'option_text_color_any': "Qualsiasi colore", 'option_text_color_full': "A colori", 'option_text_color_bw': "Bianco e nero", 'option_text_color_transparent': "Trasparente",
            'option_text_color_palette_red': "Rosso", 'option_text_color_palette_orange': "Arancione", 'option_text_color_palette_yellow': "Giallo", 'option_text_color_palette_green': "Verde",
            'option_text_color_palette_teal': "Verde acqua", 'option_text_color_palette_blue': "Blu", 'option_text_color_palette_purple': "Viola", 'option_text_color_palette_pink': "Rosa",
            'option_text_color_palette_white': "Bianco", 'option_text_color_palette_gray': "Grigio", 'option_text_color_palette_black': "Nero", 'option_text_color_palette_brown': "Marrone",

            'option_text_type_any': "Qualsiasi tipo", 'option_text_type_face': "Volto", 'option_text_type_photo': "Foto", 'option_text_type_clipart': "Clip art", 'option_text_type_lineart': "Disegno a tratti", 'option_text_type_gif': "GIF",

            'option_text_time_any': "Qualsiasi data",
            'option_text_time_past_15m': "Ultimi 15 minuti", 'option_text_time_past_30m': "Ultimi 30 minuti", 'option_text_time_past_hour': "Ultima ora",
            'option_text_time_past_3h': "Ultime 3 ore", 'option_text_time_past_6h': "Ultime 6 ore", 'option_text_time_past_9h': "Ultime 9 ore", 'option_text_time_past_12h': "Ultime 12 ore",
            'option_text_time_past_15h': "Ultime 15 ore", 'option_text_time_past_18h': "Ultime 18 ore", 'option_text_time_past_21h': "Ultime 21 ore", 'option_text_time_past_24h': "Ultime 24 ore",
            'option_text_time_past_2d': "Ultimi 2 giorni", 'option_text_time_past_3d': "Ultimi 3 giorni", 'option_text_time_past_4d': "Ultimi 4 giorni", 'option_text_time_past_5d': "Ultimi 5 giorni", 'option_text_time_past_6d': "Ultimi 6 giorni",
            'option_text_time_past_week': "Ultima settimana", 'option_text_time_past_2w': "Ultime 2 settimane", 'option_text_time_past_3w': "Ultime 3 settimane",
            'option_text_time_past_month': "Ultimo mese", 'option_text_time_past_2m': "Ultimi 2 mesi", 'option_text_time_past_3m': "Ultimi 3 mesi", 'option_text_time_past_4m': "Ultimi 4 mesi",
            'option_text_time_past_5m': "Ultimi 5 mesi", 'option_text_time_past_6m': "Ultimi 6 mesi", 'option_text_time_past_7m': "Ultimi 7 mesi", 'option_text_time_past_8m': "Ultimi 8 mesi",
            'option_text_time_past_9m': "Ultimi 9 mesi", 'option_text_time_past_10m': "Ultimi 10 mesi", 'option_text_time_past_11m': "Ultimi 11 mesi", 'option_text_time_past_year': "Ultimo anno",
            'option_text_time_past_2y': "Ultimi 2 anni", 'option_text_time_past_3y': "Ultimi 3 anni", 'option_text_time_past_4y': "Ultimi 4 anni", 'option_text_time_past_5y': "Ultimi 5 anni",
            'option_text_time_past_6y': "Ultimi 6 anni", 'option_text_time_past_7y': "Ultimi 7 anni", 'option_text_time_past_8y': "Ultimi 8 anni", 'option_text_time_past_9y': "Ultimi 9 anni", 'option_text_time_past_10y': "Ultimi 10 anni",
            'option_text_time_custom_range': "Intervallo personalizzato...", 'datepicker_label_from': "Da:", 'datepicker_label_to': "A:",

            'option_text_rights_any': "Tutte le licenze", 'option_text_rights_cc': "Licenze Creative Commons", 'option_text_rights_commercial': "Licenze commerciali e altre licenze",

            'option_text_filetype_any': "Qualsiasi formato", 'option_text_filetype_jpg': "File JPG", 'option_text_filetype_jpeg': "File JPEG", 'option_text_filetype_gif': "File GIF", 'option_text_filetype_png': "File PNG",
            'option_text_filetype_bmp': "File BMP", 'option_text_filetype_svg': "File SVG", 'option_text_filetype_webp': "File WEBP", 'option_text_filetype_avif': "File AVIF",
            'option_text_filetype_ico': "File ICO", 'option_text_filetype_raw': "File RAW",

            'option_text_region_any': "Qualsiasi regione", 'option_text_region_ca': "Canada", 'option_text_region_us': "Stati Uniti", 'option_text_region_mx': "Messico",
            'option_text_region_ar': "Argentina", 'option_text_region_br': "Brasile", 'option_text_region_cl': "Cile", 'option_text_region_co': "Colombia", 'option_text_region_pe': "Perù",
            'option_text_region_gb': "Regno Unito", 'option_text_region_fr': "Francia", 'option_text_region_de': "Germania", 'option_text_region_it': "Italia", 'option_text_region_es': "Spagna",
            'option_text_region_al': "Albania", 'option_text_region_at': "Austria", 'option_text_region_by': "Bielorussia", 'option_text_region_be': "Belgio", 'option_text_region_ba': "Bosnia ed Erzegovina",
            'option_text_region_bg': "Bulgaria", 'option_text_region_hr': "Croazia", 'option_text_region_cz': "Repubblica Ceca", 'option_text_region_dk': "Danimarca", 'option_text_region_ee': "Estonia",
            'option_text_region_fi': "Finlandia", 'option_text_region_gr': "Grecia", 'option_text_region_hu': "Ungheria", 'option_text_region_is': "Islanda", 'option_text_region_ie': "Irlanda",
            'option_text_region_lv': "Lettonia", 'option_text_region_lt': "Lituania", 'option_text_region_lu': "Lussemburgo", 'option_text_region_nl': "Paesi Bassi", 'option_text_region_no': "Norvegia",
            'option_text_region_pl': "Polonia", 'option_text_region_pt': "Portogallo", 'option_text_region_ro': "Romania", 'option_text_region_ru': "Russia", 'option_text_region_rs': "Serbia",
            'option_text_region_sk': "Slovacchia", 'option_text_region_si': "Slovenia", 'option_text_region_se': "Svezia", 'option_text_region_ch': "Svizzera", 'option_text_region_tr': "Turchia", 'option_text_region_ua': "Ucraina",
            'option_text_region_jp': "Giappone", 'option_text_region_kr': "Corea del Sud", 'option_text_region_tw': "Taiwan", 'option_text_region_cn': "Cina", 'option_text_region_hk': "Hong Kong",
            'option_text_region_in': "India", 'option_text_region_id': "Indonesia", 'option_text_region_il': "Israele", 'option_text_region_my': "Malesia", 'option_text_region_ph': "Filippine",
            'option_text_region_sa': "Arabia Saudita", 'option_text_region_sg': "Singapore", 'option_text_region_th': "Thailandia", 'option_text_region_ae': "Emirati Arabi Uniti", 'option_text_region_vn': "Vietnam",
            'option_text_region_au': "Australia", 'option_text_region_nz': "Nuova Zelanda", 'option_text_region_eg': "Egitto", 'option_text_region_ng': "Nigeria", 'option_text_region_za': "Sudafrica",
            'option_text_site_any': "Qualsiasi sito",

            'alert_size_already_saved': "Questa dimensione è già salvata.", 'alert_custom_size_deleted': "Dimensione personalizzata eliminata.", 'alert_custom_size_saved': "Dimensione personalizzata salvata.",
            'alert_invalid_domain': "Formato dominio non valido.", 'alert_datepicker_select_dates': "Seleziona una data di inizio e fine.",
            'alert_datepicker_end_before_start': "La data di fine non può essere precedente a quella di inizio.", 'alert_datepicker_invalid_date': "Data non valida.",
            'alert_exact_size_invalid_input': "Inserisci larghezza e altezza valide.", 'alert_confirm_delete_option_prefix': "Eliminare \"",
            'alert_label_updated': "Etichetta aggiornata.", 'alert_exact_size_added': "Nuova dimensione esatta aggiunta.", 'alert_exact_size_deleted': "Dimensione salvata eliminata.",
            'alert_site_label_empty': "L'etichetta del sito non può essere vuota.", 'alert_site_domain_empty': "Il dominio del sito non può essere vuoto.", 'alert_site_already_saved': "Questo sito/dominio è già salvato.",
            'alert_site_added': "Nuovo sito aggiunto.", 'alert_site_deleted': "Sito salvato eliminato.",
            'alert_settings_reset_to_default': "Tutte le impostazioni sono state ripristinate.", 'alert_settings_saved': "Impostazioni salvate con successo.",
            'gm_menu_gite_settings': "⚙️ Impostazioni GITE", 'gm_menu_reset_all_gite_settings': "🚨 Ripristina tutto", 'gm_please_reload': "Ricarica la pagina per applicare le modifiche.",
            'settings_panel_title': "Impostazioni GITE", 'settings_tab_general': "Generale", 'settings_tab_exact_size': "Dimensioni esatte", 'settings_tab_size': "Dimensioni",
            'settings_tab_time': "Data", 'settings_tab_region': "Regione", 'settings_tab_site_search': "Cerca nel sito",
            
            'settings_label_language': "Lingua:", 
            'settings_lang_auto': "Rilevamento auto", 
            'settings_lang_en': "Inglese (English)", 
            'settings_lang_zh_TW': "Cinese tradizionale (繁體中文)", 
            'settings_lang_ja': "Giapponese (日本語)",
            'settings_lang_de': "Tedesco (Deutsch)", 
            'settings_lang_es': "Spagnolo (Español)", 
            'settings_lang_fr': "Francese (Français)", 
            'settings_lang_it': "Italiano", 
            'settings_lang_ru': "Russo (Русский)",

            'settings_label_showtoolbarbutton': "Mostra pulsante impostazioni:", 'settings_label_showresultstats': "Mostra statistiche risultati:",
            'settings_label_theme': "Tema:", 'settings_theme_auto': "Auto", 'settings_theme_light': "Chiaro", 'settings_theme_dark': "Scuro",
            'settings_label_toolbar_font_size': "Dimensione carattere menu (px):", 'settings_label_toolbar_line_height': "Altezza riga menu:",
            'settings_label_showregionflags': "Mostra bandiere nel filtro Regione:", 'settings_label_showfavicons': "Mostra icone in Cerca nel sito:",
            'settings_label_showadvsearch': "Mostra pulsante Ricerca avanzata:", 'settings_label_btn_style': "Stile pulsante:", 'settings_btn_style_text': "Solo testo",
            'settings_btn_style_icon': "Solo icona", 'settings_btn_style_both': "Icona + Testo",
            'alert_confirm_reset_all_settings': "Sei sicuro di voler ripristinare TUTTE le impostazioni? Questa operazione non può essere annullata.",
            'settings_enable_filter_category_prefix': "Abilita filtro \"", 'settings_enable_filter_category_suffix': "\"",
            'settings_label_show_exact_size_inputs_in_menu': "Mostra input manuale nel menu:",
            'settings_options_for_category_prefix': "Opzioni per \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Reimposta opzioni di \"", 'btn_reset_options_for_category_suffix': "\"",
            'settings_section_predefined_options': "Opzioni predefinite:", 'settings_section_your_saved_sizes': "Le tue dimensioni salvate:",
            'settings_label_add_new_exact_size': "Aggiungi nuova dimensione:", 'settings_placeholder_label_optional': "Etichetta (opzionale)",
            'settings_label_enable_site_search_filter': "Abilita filtro \"Cerca nel sito\"", 'settings_section_your_saved_sites': "I tuoi siti salvati:",
            'settings_label_add_new_site': "Aggiungi nuovo sito:", 'settings_placeholder_site_label': "Etichetta (es. Reddit)", 'settings_placeholder_site_domain': "Dominio (es. reddit.com)",
            'settings_no_saved_items_placeholder': "Nessun elemento salvato.",
            'settings_label_layout_two_col': "Usa layout a due colonne:", 'settings_label_layout_multi_col': "Usa layout multi-colonna:", 'settings_label_embedded_date': "Mostra selettore data nel menu:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Posizione barra degli strumenti:",
            'settings_layout_standard': "Standard (Incorporato)",
            'settings_layout_sticky': "Fisso (Galleggiante)",
            'settings_label_hide_chips': "Nascondi suggerimenti di ricerca:"
        },
        'ru': {
            'filter_title_size': "Размер", 'filter_title_exact_size': "Точный размер", 'filter_title_aspect_ratio': "Соотношение сторон",
            'filter_title_color': "Цвет", 'filter_title_type': "Тип", 'filter_title_time': "Время",
            'filter_title_usage_rights': "Права использования", 'filter_title_file_type': "Тип файла",
            'filter_title_region': "Регион", 'filter_title_site_search': "Поиск по сайту", 'filter_title_advanced_search': "Расширенный поиск",

            'btn_clear': "Очистить", 'btn_apply': "Применить", 'btn_cancel': "Отмена", 'btn_close': "Закрыть",
            'btn_save_and_close': "Сохранить и закрыть", 'btn_delete': "Удалить", 'btn_edit_label': "Изменить метку",
            'btn_save_changes': "Сохранить", 'btn_add_new_exact_size': "Добавить", 'btn_add_new_site': "Добавить",
            'btn_reset_all_settings': "Сбросить всё", 'btn_reset_general_settings': "Сбросить общие настройки",

            'option_text_size_any': "Любой размер", 'option_text_size_large': "Большой", 'option_text_size_medium': "Средний", 'option_text_size_icon': "Значок",
            'option_text_size_qsvga': "Больше чем 400×300", 'option_text_size_vga': "Больше чем 640×480", 'option_text_size_svga': "Больше чем 800×600", 'option_text_size_xga': "Больше чем 1024×768",
            'option_text_size_2mp': "Больше чем 2 МП", 'option_text_size_4mp': "Больше чем 4 МП", 'option_text_size_6mp': "Больше чем 6 МП", 'option_text_size_8mp': "Больше чем 8 МП",
            'option_text_size_10mp': "Больше чем 10 МП", 'option_text_size_12mp': "Больше чем 12 МП", 'option_text_size_15mp': "Больше чем 15 МП", 'option_text_size_20mp': "Больше чем 20 МП",
            'option_text_size_40mp': "Больше чем 40 МП", 'option_text_size_70mp': "Больше чем 70 МП",

            'option_text_exact_size_any': "Любой точный размер", 'option_text_exact_size_1024x768': "1024×768 (XGA)", 'option_text_exact_size_1280x720': "1280×720 (HD)",
            'option_text_exact_size_1366x768': "1366×768 (Laptop)", 'option_text_exact_size_1600x900': "1600×900 (HD+)", 'option_text_exact_size_1920x1080': "1920×1080 (FHD)",
            'option_text_exact_size_2560x1080': "2560×1080 (Ultrawide FHD)", 'option_text_exact_size_2560x1440': "2560×1440 (QHD)", 'option_text_exact_size_3440x1440': "3440×1440 (Ultrawide QHD)",
            'option_text_exact_size_3840x2160': "3840×2160 (4K UHD)", 'option_text_exact_size_7680x4320': "7680×4320 (8K UHD)", 'option_text_exact_size_1080x1920': "1080×1920 (FHD Port.)",
            'option_text_exact_size_768x1024': "768×1024 (XGA Port.)", 'option_text_exact_size_1920x1200': "1920x1200 (WUXGA)", 'option_text_exact_size_2560x1600': "2560x1600 (WQXGA)",
            'option_text_exact_size_5120x2880': "5120×2880 (5K UHD)", 'option_text_exact_size_2160x3840': "2160×3840 (4K Portrait)",
            'exact_size_placeholder_width': "Ширина", 'exact_size_placeholder_height': "Высота",

            'option_text_ar_any': "Любое соотношение", 'option_text_ar_tall': "Высокие", 'option_text_ar_square': "Квадратные", 'option_text_ar_wide': "Широкие", 'option_text_ar_panoramic': "Панорамные",

            'option_text_color_any': "Любой цвет", 'option_text_color_full': "Цветные", 'option_text_color_bw': "Черно-белые", 'option_text_color_transparent': "Прозрачные",
            'option_text_color_palette_red': "Красный", 'option_text_color_palette_orange': "Оранжевый", 'option_text_color_palette_yellow': "Желтый", 'option_text_color_palette_green': "Зеленый",
            'option_text_color_palette_teal': "Бирюзовый", 'option_text_color_palette_blue': "Синий", 'option_text_color_palette_purple': "Фиолетовый", 'option_text_color_palette_pink': "Розовый",
            'option_text_color_palette_white': "Белый", 'option_text_color_palette_gray': "Серый", 'option_text_color_palette_black': "Черный", 'option_text_color_palette_brown': "Коричневый",

            'option_text_type_any': "Любой тип", 'option_text_type_face': "Лица", 'option_text_type_photo': "Фотографии", 'option_text_type_clipart': "Клип-арт", 'option_text_type_lineart': "Рисунки", 'option_text_type_gif': "GIF",

            'option_text_time_any': "За все время",
            'option_text_time_past_15m': "За 15 минут", 'option_text_time_past_30m': "За 30 минут", 'option_text_time_past_hour': "За час",
            'option_text_time_past_3h': "За 3 часа", 'option_text_time_past_6h': "За 6 часов", 'option_text_time_past_9h': "За 9 часов", 'option_text_time_past_12h': "За 12 часов",
            'option_text_time_past_15h': "За 15 часов", 'option_text_time_past_18h': "За 18 часов", 'option_text_time_past_21h': "За 21 час", 'option_text_time_past_24h': "За 24 часа",
            'option_text_time_past_2d': "За 2 дня", 'option_text_time_past_3d': "За 3 дня", 'option_text_time_past_4d': "За 4 дня", 'option_text_time_past_5d': "За 5 дней", 'option_text_time_past_6d': "За 6 дней",
            'option_text_time_past_week': "За неделю", 'option_text_time_past_2w': "За 2 недели", 'option_text_time_past_3w': "За 3 недели",
            'option_text_time_past_month': "За месяц", 'option_text_time_past_2m': "За 2 месяца", 'option_text_time_past_3m': "За 3 месяца", 'option_text_time_past_4m': "За 4 месяца",
            'option_text_time_past_5m': "За 5 месяцев", 'option_text_time_past_6m': "За 6 месяцев", 'option_text_time_past_7m': "За 7 месяцев", 'option_text_time_past_8m': "За 8 месяцев",
            'option_text_time_past_9m': "За 9 месяцев", 'option_text_time_past_10m': "За 10 месяцев", 'option_text_time_past_11m': "За 11 месяцев", 'option_text_time_past_year': "За год",
            'option_text_time_past_2y': "За 2 года", 'option_text_time_past_3y': "За 3 года", 'option_text_time_past_4y': "За 4 года", 'option_text_time_past_5y': "За 5 лет",
            'option_text_time_past_6y': "За 6 лет", 'option_text_time_past_7y': "За 7 лет", 'option_text_time_past_8y': "За 8 лет", 'option_text_time_past_9y': "За 9 лет", 'option_text_time_past_10y': "За 10 лет",
            'option_text_time_custom_range': "За период...", 'datepicker_label_from': "От:", 'datepicker_label_to': "До:",

            'option_text_rights_any': "Все лицензии", 'option_text_rights_cc': "Лицензии Creative Commons", 'option_text_rights_commercial': "Коммерческие и другие лицензии",

            'option_text_filetype_any': "Любой формат", 'option_text_filetype_jpg': "Файлы JPG", 'option_text_filetype_jpeg': "Файлы JPEG", 'option_text_filetype_gif': "Файлы GIF", 'option_text_filetype_png': "Файлы PNG",
            'option_text_filetype_bmp': "Файлы BMP", 'option_text_filetype_svg': "Файлы SVG", 'option_text_filetype_webp': "Файлы WEBP", 'option_text_filetype_avif': "Файлы AVIF",
            'option_text_filetype_ico': "Файлы ICO", 'option_text_filetype_raw': "Файлы RAW",

            'option_text_region_any': "Любой регион", 'option_text_region_ca': "Канада", 'option_text_region_us': "США", 'option_text_region_mx': "Мексика",
            'option_text_region_ar': "Аргентина", 'option_text_region_br': "Бразилия", 'option_text_region_cl': "Чили", 'option_text_region_co': "Колумбия", 'option_text_region_pe': "Перу",
            'option_text_region_gb': "Великобритания", 'option_text_region_fr': "Франция", 'option_text_region_de': "Германия", 'option_text_region_it': "Италия", 'option_text_region_es': "Испания",
            'option_text_region_al': "Албания", 'option_text_region_at': "Австрия", 'option_text_region_by': "Беларусь", 'option_text_region_be': "Бельгия", 'option_text_region_ba': "Босния и Герцеговина",
            'option_text_region_bg': "Болгария", 'option_text_region_hr': "Хорватия", 'option_text_region_cz': "Чехия", 'option_text_region_dk': "Дания", 'option_text_region_ee': "Эстония",
            'option_text_region_fi': "Финляндия", 'option_text_region_gr': "Греция", 'option_text_region_hu': "Венгрия", 'option_text_region_is': "Исландия", 'option_text_region_ie': "Ирландия",
            'option_text_region_lv': "Латвия", 'option_text_region_lt': "Литва", 'option_text_region_lu': "Люксембург", 'option_text_region_nl': "Нидерланды", 'option_text_region_no': "Норвегия",
            'option_text_region_pl': "Польша", 'option_text_region_pt': "Португалия", 'option_text_region_ro': "Румыния", 'option_text_region_ru': "Россия", 'option_text_region_rs': "Сербия",
            'option_text_region_sk': "Словакия", 'option_text_region_si': "Словения", 'option_text_region_se': "Швеция", 'option_text_region_ch': "Швейцария", 'option_text_region_tr': "Турция", 'option_text_region_ua': "Украина",
            'option_text_region_jp': "Япония", 'option_text_region_kr': "Южная Корея", 'option_text_region_tw': "Тайвань", 'option_text_region_cn': "Китай", 'option_text_region_hk': "Гонконг",
            'option_text_region_in': "Индия", 'option_text_region_id': "Индонезия", 'option_text_region_il': "Израиль", 'option_text_region_my': "Малайзия", 'option_text_region_ph': "Филиппины",
            'option_text_region_sa': "Саудовская Аравия", 'option_text_region_sg': "Сингапур", 'option_text_region_th': "Таиланд", 'option_text_region_ae': "ОАЭ", 'option_text_region_vn': "Вьетнам",
            'option_text_region_au': "Австралия", 'option_text_region_nz': "Новая Зеландия", 'option_text_region_eg': "Египет", 'option_text_region_ng': "Нигерия", 'option_text_region_za': "ЮАР",
            'option_text_site_any': "Любой сайт",

            'alert_size_already_saved': "Этот размер уже сохранен.", 'alert_custom_size_deleted': "Пользовательский размер удален: ", 'alert_custom_size_saved': "Пользовательский размер сохранен: ",
            'alert_invalid_domain': "Неверный формат домена.", 'alert_datepicker_select_dates': "Выберите дату начала и окончания.",
            'alert_datepicker_end_before_start': "Дата окончания не может быть раньше даты начала.", 'alert_datepicker_invalid_date': "Неверная дата.",
            'alert_exact_size_invalid_input': "Введите действительные ширину и высоту.", 'alert_confirm_delete_option_prefix': "Удалить \"",
            'alert_label_updated': "Метка обновлена.", 'alert_exact_size_added': "Новый размер добавлен.", 'alert_exact_size_deleted': "Сохраненный размер удален.",
            'alert_site_label_empty': "Метка сайта не может быть пустой.", 'alert_site_domain_empty': "Домен сайта не может быть пустым.", 'alert_site_already_saved': "Этот сайт/домен уже сохранен.",
            'alert_site_added': "Новый сайт добавлен.", 'alert_site_deleted': "Сохраненный сайт удален.",
            'alert_settings_reset_to_default': "Все настройки сброшены по умолчанию.", 'alert_settings_saved': "Настройки успешно сохранены.",
            'gm_menu_gite_settings': "⚙️ Настройки GITE", 'gm_menu_reset_all_gite_settings': "🚨 Сбросить все настройки", 'gm_please_reload': "Пожалуйста, перезагрузите страницу.",
            'settings_panel_title': "Настройки GITE", 'settings_tab_general': "Общие", 'settings_tab_exact_size': "Точный размер", 'settings_tab_size': "Размер",
            'settings_tab_time': "Время", 'settings_tab_region': "Регион", 'settings_tab_site_search': "Поиск по сайту",
            
            'settings_label_language': "Язык скрипта:", 
            'settings_lang_auto': "Автоопределение", 
            'settings_lang_en': "Английский (English)", 
            'settings_lang_zh_TW': "Традиционный китайский (繁體中文)", 
            'settings_lang_ja': "Японский (日本語)",
            'settings_lang_de': "Немецкий (Deutsch)", 
            'settings_lang_es': "Испанский (Español)", 
            'settings_lang_fr': "Французский (Français)", 
            'settings_lang_it': "Итальянский (Italiano)", 
            'settings_lang_ru': "Русский",

            'settings_label_showtoolbarbutton': "Кнопка настроек на панели:", 'settings_label_showresultstats': "Показывать количество результатов:",
            'settings_label_theme': "Тема:", 'settings_theme_auto': "Авто", 'settings_theme_light': "Светлая", 'settings_theme_dark': "Темная",
            'settings_label_toolbar_font_size': "Размер шрифта меню (px):", 'settings_label_toolbar_line_height': "Высота строки меню:",
            'settings_label_showregionflags': "Показывать флаги в фильтре Регион:", 'settings_label_showfavicons': "Показывать значки в Поиске по сайту:",
            'settings_label_showadvsearch': "Показывать кнопку Расширенного поиска:", 'settings_label_btn_style': "Стиль кнопок:", 'settings_btn_style_text': "Только текст",
            'settings_btn_style_icon': "Только значок", 'settings_btn_style_both': "Значок + Текст",
            'alert_confirm_reset_all_settings': "Вы уверены, что хотите сбросить ВСЕ настройки? Это действие нельзя отменить.",
            'settings_enable_filter_category_prefix': "Включить фильтр \"", 'settings_enable_filter_category_suffix': "\"",
            'settings_label_show_exact_size_inputs_in_menu': "Ручной ввод в меню:",
            'settings_options_for_category_prefix': "Опции для \"", 'settings_options_for_category_suffix': "\"",
            'btn_reset_options_for_category_prefix': "Сбросить опции \"", 'btn_reset_options_for_category_suffix': "\"",
            'settings_section_predefined_options': "Предустановленные опции:", 'settings_section_your_saved_sizes': "Ваши сохраненные размеры:",
            'settings_label_add_new_exact_size': "Добавить размер:", 'settings_placeholder_label_optional': "Метка (необязательно)",
            'settings_label_enable_site_search_filter': "Включить фильтр \"Поиск по сайту\"", 'settings_section_your_saved_sites': "Ваши сохраненные сайты:",
            'settings_label_add_new_site': "Добавить сайт:", 'settings_placeholder_site_label': "Метка (напр. Reddit)", 'settings_placeholder_site_domain': "Домен (напр. reddit.com)",
            'settings_no_saved_items_placeholder': "Нет сохраненных элементов.",
            'settings_label_layout_two_col': "Использовать двухколоночный макет:", 'settings_label_layout_multi_col': "Использовать многоколоночный макет:", 'settings_label_embedded_date': "Показывать выбор даты в меню:",
            
            // New Settings v1.2.5
            'settings_label_toolbar_layout': "Расположение панели:",
            'settings_layout_standard': "Стандартное (в шапке)",
            'settings_layout_sticky': "Закрепленное (плавающее)",
            'settings_label_hide_chips': "Скрыть подсказки поиска:"
        }
    };

// Section: Option Definitions
    const GITE_OPTION_DEFINITIONS = {
        size: [
            { id: "gite_size_any", value: "", textKey: "option_text_size_any", defaultEnabled: true },
            { id: "gite_size_large", value: "l", textKey: "option_text_size_large", defaultEnabled: true },
            { id: "gite_size_medium", value: "m", textKey: "option_text_size_medium", defaultEnabled: true },
            { id: "gite_size_icon", value: "i", textKey: "option_text_size_icon", defaultEnabled: true },
            { id: "gite_size_sep1", type: "separator", defaultEnabled: true },
            { id: "gite_size_qsvga", value: "qsvga", textKey: "option_text_size_qsvga", defaultEnabled: true },
            { id: "gite_size_vga", value: "vga", textKey: "option_text_size_vga", defaultEnabled: true },
            { id: "gite_size_svga", value: "svga", textKey: "option_text_size_svga", defaultEnabled: true },
            { id: "gite_size_xga", value: "xga", textKey: "option_text_size_xga", defaultEnabled: true },
            { id: "gite_size_2mp", value: "2mp", textKey: "option_text_size_2mp", defaultEnabled: true },
            { id: "gite_size_4mp", value: "4mp", textKey: "option_text_size_4mp", defaultEnabled: true },
            { id: "gite_size_6mp", value: "6mp", textKey: "option_text_size_6mp", defaultEnabled: true },
            { id: "gite_size_8mp", value: "8mp", textKey: "option_text_size_8mp", defaultEnabled: true },
            { id: "gite_size_10mp", value: "10mp", textKey: "option_text_size_10mp", defaultEnabled: true },
            { id: "gite_size_12mp", value: "12mp", textKey: "option_text_size_12mp", defaultEnabled: true },
            { id: "gite_size_15mp", value: "15mp", textKey: "option_text_size_15mp", defaultEnabled: true },
            { id: "gite_size_20mp", value: "20mp", textKey: "option_text_size_20mp", defaultEnabled: true },
            { id: "gite_size_40mp", value: "40mp", textKey: "option_text_size_40mp", defaultEnabled: true },
            { id: "gite_size_70mp", value: "70mp", textKey: "option_text_size_70mp", defaultEnabled: true },
        ],
        exactSize: [
            { id: "gite_exact_any", value: "", type: "imagesize_clear", textKey: "option_text_exact_size_any", defaultEnabled: true },
            { id: "gite_exact_1024x768", value: "1024x768", type: "imagesize", textKey: "option_text_exact_size_1024x768", defaultEnabled: true },
            { id: "gite_exact_1280x720", value: "1280x720", type: "imagesize", textKey: "option_text_exact_size_1280x720", defaultEnabled: true },
            { id: "gite_exact_1366x768", value: "1366x768", type: "imagesize", textKey: "option_text_exact_size_1366x768", defaultEnabled: true },
            { id: "gite_exact_1600x900", value: "1600x900", type: "imagesize", textKey: "option_text_exact_size_1600x900", defaultEnabled: true },
            { id: "gite_exact_1920x1080", value: "1920x1080", type: "imagesize", textKey: "option_text_exact_size_1920x1080", defaultEnabled: true },
            { id: "gite_exact_1920x1200", value: "1920x1200", type: "imagesize", textKey: "option_text_exact_size_1920x1200", defaultEnabled: false },
            { id: "gite_exact_2560x1080", value: "2560x1080", type: "imagesize", textKey: "option_text_exact_size_2560x1080", defaultEnabled: true },
            { id: "gite_exact_2560x1440", value: "2560x1440", type: "imagesize", textKey: "option_text_exact_size_2560x1440", defaultEnabled: true },
            { id: "gite_exact_2560x1600", value: "2560x1600", type: "imagesize", textKey: "option_text_exact_size_2560x1600", defaultEnabled: true },
            { id: "gite_exact_3440x1440", value: "3440x1440", type: "imagesize", textKey: "option_text_exact_size_3440x1440", defaultEnabled: true },
            { id: "gite_exact_3840x2160", value: "3840x2160", type: "imagesize", textKey: "option_text_exact_size_3840x2160", defaultEnabled: true },
            { id: "gite_exact_5120x2880", value: "5120x2880", type: "imagesize", textKey: "option_text_exact_size_5120x2880", defaultEnabled: true },
            { id: "gite_exact_7680x4320", value: "7680x4320", type: "imagesize", textKey: "option_text_exact_size_7680x4320", defaultEnabled: true },
            { id: "gite_exact_1080x1920", value: "1080x1920", type: "imagesize", textKey: "option_text_exact_size_1080x1920", defaultEnabled: true },
            { id: "gite_exact_2160x3840", value: "2160x3840", type: "imagesize", textKey: "option_text_exact_size_2160x3840", defaultEnabled: false },
            { id: "gite_exact_768x1024", value: "768x1024", type: "imagesize", textKey: "option_text_exact_size_768x1024", defaultEnabled: true },
        ],
        aspectRatio: [
            { id: "ar_any", value: "", textKey: "option_text_ar_any" }, 
            { id: "ar_square", value: "s", textKey: "option_text_ar_square" },
            { id: "ar_wide", value: "w", textKey: "option_text_ar_wide" }, 
            { id: "ar_tall", value: "t", textKey: "option_text_ar_tall" },
            { id: "ar_panoramic", value: "xw", textKey: "option_text_ar_panoramic" }
        ],
        color: {
            prefixOptions: [
                { id: "color_any", value: "", tbsValue: "", textKey: "option_text_color_any" },
                { id: "color_full", value: "color", tbsValue: "ic:color", textKey: "option_text_color_full" },
                { id: "color_bw", value: "gray", tbsValue: "ic:gray", textKey: "option_text_color_bw" },
                { id: "color_trans", value: "trans", tbsValue: "ic:trans", textKey: "option_text_color_transparent" },
                { id: "color_sep", type: "separator"},
            ],
            paletteColors: [
                { id: "pal_red", hex: "#CC0000", tbsValue: "ic:specific,isc:red", type: "palette", textKey: "option_text_color_palette_red" },
                { id: "pal_orange", hex: "#FB940B", tbsValue: "ic:specific,isc:orange", type: "palette", textKey: "option_text_color_palette_orange" },
                { id: "pal_yellow", hex: "#FFFF00", tbsValue: "ic:specific,isc:yellow", type: "palette", textKey: "option_text_color_palette_yellow" },
                { id: "pal_green", hex: "#00CC00", tbsValue: "ic:specific,isc:green", type: "palette", textKey: "option_text_color_palette_green" },
                { id: "pal_teal", hex: "#03C0C6", tbsValue: "ic:specific,isc:teal", type: "palette", textKey: "option_text_color_palette_teal" },
                { id: "pal_blue", hex: "#0000FF", tbsValue: "ic:specific,isc:blue", type: "palette", textKey: "option_text_color_palette_blue" },
                { id: "pal_purple", hex: "#762CA7", tbsValue: "ic:specific,isc:purple", type: "palette", textKey: "option_text_color_palette_purple" },
                { id: "pal_pink", hex: "#FF98BF", tbsValue: "ic:specific,isc:pink", type: "palette", textKey: "option_text_color_palette_pink" },
                { id: "pal_white", hex: "#FFFFFF", tbsValue: "ic:specific,isc:white", type: "palette", textKey: "option_text_color_palette_white" },
                { id: "pal_gray", hex: "#999999", tbsValue: "ic:specific,isc:gray", type: "palette", textKey: "option_text_color_palette_gray" },
                { id: "pal_black", hex: "#000000", tbsValue: "ic:specific,isc:black", type: "palette", textKey: "option_text_color_palette_black" },
                { id: "pal_brown", hex: "#885418", tbsValue: "ic:specific,isc:brown", type: "palette", textKey: "option_text_color_palette_brown" }
            ]
        },
        type: [
            { id: "type_any", tbsValue: "", textKey: "option_text_type_any" }, { id: "type_face", tbsValue: "itp:face", textKey: "option_text_type_face" },
            { id: "type_photo", tbsValue: "itp:photo", textKey: "option_text_type_photo" }, { id: "type_clipart", tbsValue: "itp:clipart", textKey: "option_text_type_clipart" },
            { id: "type_lineart", tbsValue: "itp:lineart", textKey: "option_text_type_lineart" }, { id: "type_gif", tbsValue: "itp:animated", textKey: "option_text_type_gif" }
        ],
        time: [
            { id: "time_any", tbsValue: "", textKey: "option_text_time_any", defaultEnabled: true },
            { id: "time_past_15m", tbsValue: "qdr:n15", textKey: "option_text_time_past_15m", defaultEnabled: false },
            { id: "time_past_30m", tbsValue: "qdr:n30", textKey: "option_text_time_past_30m", defaultEnabled: true },
            { id: "time_past_hour", tbsValue: "qdr:h", textKey: "option_text_time_past_hour", defaultEnabled: true },
            { id: "time_past_3h", tbsValue: "qdr:h3", textKey: "option_text_time_past_3h", defaultEnabled: false },
            { id: "time_past_6h", tbsValue: "qdr:h6", textKey: "option_text_time_past_6h", defaultEnabled: true },
            { id: "time_past_9h", tbsValue: "qdr:h9", textKey: "option_text_time_past_9h", defaultEnabled: false },
            { id: "time_past_12h", tbsValue: "qdr:h12", textKey: "option_text_time_past_12h", defaultEnabled: true },
            { id: "time_past_15h", tbsValue: "qdr:h15", textKey: "option_text_time_past_15h", defaultEnabled: false },
            { id: "time_past_18h", tbsValue: "qdr:h18", textKey: "option_text_time_past_18h", defaultEnabled: false },
            { id: "time_past_21h", tbsValue: "qdr:h21", textKey: "option_text_time_past_21h", defaultEnabled: false },
            { id: "time_past_24h", tbsValue: "qdr:d", textKey: "option_text_time_past_24h", defaultEnabled: true },
            { id: "time_past_2d", tbsValue: "qdr:d2", textKey: "option_text_time_past_2d", defaultEnabled: false },
            { id: "time_past_3d", tbsValue: "qdr:d3", textKey: "option_text_time_past_3d", defaultEnabled: true },
            { id: "time_past_4d", tbsValue: "qdr:d4", textKey: "option_text_time_past_4d", defaultEnabled: false },
            { id: "time_past_5d", tbsValue: "qdr:d5", textKey: "option_text_time_past_5d", defaultEnabled: true },
            { id: "time_past_6d", tbsValue: "qdr:d6", textKey: "option_text_time_past_6d", defaultEnabled: false },
            { id: "time_past_week", tbsValue: "qdr:w", textKey: "option_text_time_past_week", defaultEnabled: true },
            { id: "time_past_2w", tbsValue: "qdr:w2", textKey: "option_text_time_past_2w", defaultEnabled: true },
            { id: "time_past_3w", tbsValue: "qdr:w3", textKey: "option_text_time_past_3w", defaultEnabled: true },
            { id: "time_past_month", tbsValue: "qdr:m", textKey: "option_text_time_past_month", defaultEnabled: true },
            { id: "time_past_2m", tbsValue: "qdr:m2", textKey: "option_text_time_past_2m", defaultEnabled: false },
            { id: "time_past_3m", tbsValue: "qdr:m3", textKey: "option_text_time_past_3m", defaultEnabled: true },
            { id: "time_past_4m", tbsValue: "qdr:m4", textKey: "option_text_time_past_4m", defaultEnabled: false },
            { id: "time_past_5m", tbsValue: "qdr:m5", textKey: "option_text_time_past_5m", defaultEnabled: false },
            { id: "time_past_6m", tbsValue: "qdr:m6", textKey: "option_text_time_past_6m", defaultEnabled: true },
            { id: "time_past_7m", tbsValue: "qdr:m7", textKey: "option_text_time_past_7m", defaultEnabled: false },
            { id: "time_past_8m", tbsValue: "qdr:m8", textKey: "option_text_time_past_8m", defaultEnabled: false },
            { id: "time_past_9m", tbsValue: "qdr:m9", textKey: "option_text_time_past_9m", defaultEnabled: true },
            { id: "time_past_10m", tbsValue: "qdr:m10", textKey: "option_text_time_past_10m", defaultEnabled: false },
            { id: "time_past_11m", tbsValue: "qdr:m11", textKey: "option_text_time_past_11m", defaultEnabled: false },
            { id: "time_past_year", tbsValue: "qdr:y", textKey: "option_text_time_past_year", defaultEnabled: true },
            { id: "time_past_2y", tbsValue: "qdr:y2", textKey: "option_text_time_past_2y", defaultEnabled: true },
            { id: "time_past_3y", tbsValue: "qdr:y3", textKey: "option_text_time_past_3y", defaultEnabled: true },
            { id: "time_past_4y", tbsValue: "qdr:y4", textKey: "option_text_time_past_4y", defaultEnabled: false },
            { id: "time_past_5y", tbsValue: "qdr:y5", textKey: "option_text_time_past_5y", defaultEnabled: false },
            { id: "time_past_6y", tbsValue: "qdr:y6", textKey: "option_text_time_past_6y", defaultEnabled: false },
            { id: "time_past_7y", tbsValue: "qdr:y7", textKey: "option_text_time_past_7y", defaultEnabled: false },
            { id: "time_past_8y", tbsValue: "qdr:y8", textKey: "option_text_time_past_8y", defaultEnabled: false },
            { id: "time_past_9y", tbsValue: "qdr:y9", textKey: "option_text_time_past_9y", defaultEnabled: false },
            { id: "time_past_10y", tbsValue: "qdr:y10", textKey: "option_text_time_past_10y", defaultEnabled: false },
            { id: "time_past_sep", type: "separator", defaultEnabled: true },
            { id: "time_custom", type: "custom_date_trigger", textKey: "option_text_time_custom_range", defaultEnabled: true }
        ],
        usageRights: [
            { id: "rights_any", tbsValue: "", textKey: "option_text_rights_any" }, { id: "rights_cc", tbsValue: "sur:cl", textKey: "option_text_rights_cc" },
            { id: "rights_commercial", tbsValue: "sur:ol", textKey: "option_text_rights_commercial" }
        ],
        fileType: [
            { id: "file_any", value: "", textKey: "option_text_filetype_any" }, 
            { id: "file_jpg", value: "jpg", textKey: "option_text_filetype_jpg" },
            { id: "file_jpeg", value: "jpeg", textKey: "option_text_filetype_jpeg" },
            { id: "file_png", value: "png", textKey: "option_text_filetype_png" }, { id: "file_gif", value: "gif", textKey: "option_text_filetype_gif" },
            { id: "file_bmp", value: "bmp", textKey: "option_text_filetype_bmp" }, { id: "file_svg", value: "svg", textKey: "option_text_filetype_svg" },
            { id: "file_webp", value: "webp", textKey: "option_text_filetype_webp" }, { id: "file_avif", value: "avif", textKey: "option_text_filetype_avif" },
            { id: "file_ico", value: "ico", textKey: "option_text_filetype_ico" }, { id: "file_raw", value: "craw", textKey: "option_text_filetype_raw" }
        ],
        region: [
            { id: "reg_any", value: "", paramName: "cr", textKey: "option_text_region_any", defaultEnabled: true },
            { id: "reg_ca", value: "countryCA", paramName: "cr", textKey: "option_text_region_ca", defaultEnabled: true },
            { id: "reg_us", value: "countryUS", paramName: "cr", textKey: "option_text_region_us", defaultEnabled: true },
            { id: "reg_mx", value: "countryMX", paramName: "cr", textKey: "option_text_region_mx", defaultEnabled: false },
            { id: "reg_ar", value: "countryAR", paramName: "cr", textKey: "option_text_region_ar", defaultEnabled: false },
            { id: "reg_br", value: "countryBR", paramName: "cr", textKey: "option_text_region_br", defaultEnabled: false },
            { id: "reg_cl", value: "countryCL", paramName: "cr", textKey: "option_text_region_cl", defaultEnabled: false },
            { id: "reg_co", value: "countryCO", paramName: "cr", textKey: "option_text_region_co", defaultEnabled: false },
            { id: "reg_pe", value: "countryPE", paramName: "cr", textKey: "option_text_region_pe", defaultEnabled: false },
            { id: "reg_gb", value: "countryGB", paramName: "cr", textKey: "option_text_region_gb", defaultEnabled: true },
            { id: "reg_fr", value: "countryFR", paramName: "cr", textKey: "option_text_region_fr", defaultEnabled: true },
            { id: "reg_de", value: "countryDE", paramName: "cr", textKey: "option_text_region_de", defaultEnabled: true },
            { id: "reg_it", value: "countryIT", paramName: "cr", textKey: "option_text_region_it", defaultEnabled: true },
            { id: "reg_es", value: "countryES", paramName: "cr", textKey: "option_text_region_es", defaultEnabled: true },
            { id: "reg_al", value: "countryAL", paramName: "cr", textKey: "option_text_region_al", defaultEnabled: false },
            { id: "reg_at", value: "countryAT", paramName: "cr", textKey: "option_text_region_at", defaultEnabled: false },
            { id: "reg_by", value: "countryBY", paramName: "cr", textKey: "option_text_region_by", defaultEnabled: false },
            { id: "reg_be", value: "countryBE", paramName: "cr", textKey: "option_text_region_be", defaultEnabled: false },
            { id: "reg_ba", value: "countryBA", paramName: "cr", textKey: "option_text_region_ba", defaultEnabled: false },
            { id: "reg_bg", value: "countryBG", paramName: "cr", textKey: "option_text_region_bg", defaultEnabled: false },
            { id: "reg_hr", value: "countryHR", paramName: "cr", textKey: "option_text_region_hr", defaultEnabled: false },
            { id: "reg_cz", value: "countryCZ", paramName: "cr", textKey: "option_text_region_cz", defaultEnabled: false },
            { id: "reg_dk", value: "countryDK", paramName: "cr", textKey: "option_text_region_dk", defaultEnabled: false },
            { id: "reg_ee", value: "countryEE", paramName: "cr", textKey: "option_text_region_ee", defaultEnabled: false },
            { id: "reg_fi", value: "countryFI", paramName: "cr", textKey: "option_text_region_fi", defaultEnabled: false },
            { id: "reg_gr", value: "countryGR", paramName: "cr", textKey: "option_text_region_gr", defaultEnabled: false },
            { id: "reg_hu", value: "countryHU", paramName: "cr", textKey: "option_text_region_hu", defaultEnabled: false },
            { id: "reg_is", value: "countryIS", paramName: "cr", textKey: "option_text_region_is", defaultEnabled: false },
            { id: "reg_ie", value: "countryIE", paramName: "cr", textKey: "option_text_region_ie", defaultEnabled: false },
            { id: "reg_lv", value: "countryLV", paramName: "cr", textKey: "option_text_region_lv", defaultEnabled: false },
            { id: "reg_lt", value: "countryLT", paramName: "cr", textKey: "option_text_region_lt", defaultEnabled: false },
            { id: "reg_lu", value: "countryLU", paramName: "cr", textKey: "option_text_region_lu", defaultEnabled: false },
            { id: "reg_nl", value: "countryNL", paramName: "cr", textKey: "option_text_region_nl", defaultEnabled: false },
            { id: "reg_no", value: "countryNO", paramName: "cr", textKey: "option_text_region_no", defaultEnabled: false },
            { id: "reg_pl", value: "countryPL", paramName: "cr", textKey: "option_text_region_pl", defaultEnabled: false },
            { id: "reg_pt", value: "countryPT", paramName: "cr", textKey: "option_text_region_pt", defaultEnabled: false },
            { id: "reg_ro", value: "countryRO", paramName: "cr", textKey: "option_text_region_ro", defaultEnabled: false },
            { id: "reg_ru", value: "countryRU", paramName: "cr", textKey: "option_text_region_ru", defaultEnabled: false },
            { id: "reg_rs", value: "countryRS", paramName: "cr", textKey: "option_text_region_rs", defaultEnabled: false },
            { id: "reg_sk", value: "countrySK", paramName: "cr", textKey: "option_text_region_sk", defaultEnabled: false },
            { id: "reg_si", value: "countrySI", paramName: "cr", textKey: "option_text_region_si", defaultEnabled: false },
            { id: "reg_se", value: "countrySE", paramName: "cr", textKey: "option_text_region_se", defaultEnabled: false },
            { id: "reg_ch", value: "countryCH", paramName: "cr", textKey: "option_text_region_ch", defaultEnabled: false },
            { id: "reg_tr", value: "countryTR", paramName: "cr", textKey: "option_text_region_tr", defaultEnabled: false },
            { id: "reg_ua", value: "countryUA", paramName: "cr", textKey: "option_text_region_ua", defaultEnabled: false },
            { id: "reg_jp", value: "countryJP", paramName: "cr", textKey: "option_text_region_jp", defaultEnabled: true },
            { id: "reg_kr", value: "countryKR", paramName: "cr", textKey: "option_text_region_kr", defaultEnabled: true },
            { id: "reg_tw", value: "countryTW", paramName: "cr", textKey: "option_text_region_tw", defaultEnabled: true },
            { id: "reg_cn", value: "countryCN", paramName: "cr", textKey: "option_text_region_cn", defaultEnabled: false },
            { id: "reg_hk", value: "countryHK", paramName: "cr", textKey: "option_text_region_hk", defaultEnabled: false },
            { id: "reg_in", value: "countryIN", paramName: "cr", textKey: "option_text_region_in", defaultEnabled: false },
            { id: "reg_id", value: "countryID", paramName: "cr", textKey: "option_text_region_id", defaultEnabled: false },
            { id: "reg_il", value: "countryIL", paramName: "cr", textKey: "option_text_region_il", defaultEnabled: false },
            { id: "reg_my", value: "countryMY", paramName: "cr", textKey: "option_text_region_my", defaultEnabled: false },
            { id: "reg_ph", value: "countryPH", paramName: "cr", textKey: "option_text_region_ph", defaultEnabled: false },
            { id: "reg_sa", value: "countrySA", paramName: "cr", textKey: "option_text_region_sa", defaultEnabled: false },
            { id: "reg_sg", value: "countrySG", paramName: "cr", textKey: "option_text_region_sg", defaultEnabled: false },
            { id: "reg_th", value: "countryTH", paramName: "cr", textKey: "option_text_region_th", defaultEnabled: false },
            { id: "reg_ae", value: "countryAE", paramName: "cr", textKey: "option_text_region_ae", defaultEnabled: false },
            { id: "reg_vn", value: "countryVN", paramName: "cr", textKey: "option_text_region_vn", defaultEnabled: false },
            { id: "reg_au", value: "countryAU", paramName: "cr", textKey: "option_text_region_au", defaultEnabled: true },
            { id: "reg_nz", value: "countryNZ", paramName: "cr", textKey: "option_text_region_nz", defaultEnabled: true },
            { id: "reg_eg", value: "countryEG", paramName: "cr", textKey: "option_text_region_eg", defaultEnabled: false },
            { id: "reg_ng", value: "countryNG", paramName: "cr", textKey: "option_text_region_ng", defaultEnabled: false },
            { id: "reg_za", value: "countryZA", paramName: "cr", textKey: "option_text_region_za", defaultEnabled: false }
        ],
        site: [
            { id: "site_any", value: "", type: "site_clear", textKey: "option_text_site_any", defaultEnabled: true }
        ]
    };

// Section: Default Settings
    function _generateDefaults(catKey) {
        const defs = GITE_OPTION_DEFINITIONS[catKey];
        if (catKey === 'color') return [...defs.prefixOptions, ...defs.paletteColors].map(d => ({ ...d, isEnabled: true }));
        return (defs || []).map(d => ({ ...d, isEnabled: d.defaultEnabled !== false }));
    }

    const GITE_DEFAULT_SETTINGS = {
        general: {
            selectedLanguage: "auto",
            showSettingsButtonOnToolbar: true,
            showResultStats: true,
            showAdvancedSearchButton: true,
            themePreference: "auto",
            toolbarFontSize: "14.0",
            toolbarLineHeight: "1.5",
            toolbarButtonStyle: "text",
            showRegionFlags: true,
            toolbarLayout: "standard",
            hideNativeChips: false
        },
        filters: {
            size: { enabled: true, useTwoColumnLayout: false, options: _generateDefaults('size') },
            exactSize: { enabled: true, useTwoColumnLayout: false, showInputsInMenu: true, predefinedOptions: _generateDefaults('exactSize'), userDefinedOptions: [] },
            aspectRatio: { enabled: true, options: _generateDefaults('aspectRatio') },
            color: { enabled: true, options: _generateDefaults('color') },
            type: { enabled: true, options: _generateDefaults('type') },
            time: { enabled: true, useTwoColumnLayout: false, showEmbeddedDatePicker: false, options: _generateDefaults('time') },
            usageRights: { enabled: true, options: _generateDefaults('usageRights') },
            fileType: { enabled: true, options: _generateDefaults('fileType') },
            region: { enabled: true, useMultiColumnLayout: false, options: _generateDefaults('region') },
            site: {
                enabled: true,
                useMultiColumnLayout: false,
                showFavicons: true,
                userDefinedOptions: [
                    // Enabled by Default
                    { id: "site_wiki", label: "Wikipedia", value: "wikipedia.org", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_reddit", label: "Reddit", value: "reddit.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_commons", label: "Wikimedia Commons", value: "commons.wikimedia.org", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_flickr", label: "Flickr", value: "flickr.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_artstation", label: "ArtStation", value: "artstation.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_behance", label: "Behance", value: "behance.net", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_unsplash", label: "Unsplash", value: "unsplash.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_pexels", label: "Pexels", value: "pexels.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_twitter", label: "X (Twitter)", value: "twitter.com OR x.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_500px", label: "500px", value: "500px.com", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_archive", label: "Internet Archive", value: "archive.org", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_archive_today", label: "archive.today", value: "archive.ph OR archive.today OR archive.is", isEnabled: true, isCustom: true, type: 'site_filter' },
                    { id: "site_cara", label: "Cara", value: "cara.app", isEnabled: true, isCustom: true, type: 'site_filter' },
                    
                    // Disabled by Default
                    { id: "site_threads", label: "Threads", value: "threads.net", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_instagram", label: "Instagram", value: "instagram.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_facebook", label: "Facebook", value: "facebook.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_bluesky", label: "Bluesky", value: "bsky.app", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_mastodon", label: "Mastodon (social)", value: "mastodon.social", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_tumblr", label: "Tumblr", value: "tumblr.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_pinterest", label: "Pinterest", value: "pinterest.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_pixiv", label: "Pixiv", value: "pixiv.net", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_deviantart", label: "DeviantArt", value: "deviantart.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_dribbble", label: "Dribbble", value: "dribbble.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_pixabay", label: "Pixabay", value: "pixabay.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_giphy", label: "GIPHY", value: "giphy.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_youtube", label: "YouTube", value: "youtube.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_vimeo", label: "Vimeo", value: "vimeo.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_linkedin", label: "LinkedIn", value: "linkedin.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_europeana", label: "Europeana", value: "europeana.eu", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_dpla", label: "DPLA", value: "dp.la", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_loc", label: "Library of Congress", value: "loc.gov", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_si", label: "Smithsonian", value: "si.edu", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_britishmuseum", label: "British Museum", value: "britishmuseum.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_met", label: "The Met", value: "metmuseum.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_rijks", label: "Rijksmuseum", value: "rijksmuseum.nl", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_tate", label: "Tate", value: "tate.org.uk", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_nga", label: "National Gallery of Art", value: "nga.gov", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_artic", label: "Art Institute of Chicago", value: "artic.edu", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_cleveland", label: "Cleveland Museum of Art", value: "clevelandart.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_getty", label: "Getty", value: "getty.edu", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_nypl", label: "NYPL Digital Collections", value: "digitalcollections.nypl.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_wellcome", label: "Wellcome Collection", value: "wellcomecollection.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_bodleian", label: "Bodleian Libraries", value: "bodleian.ox.ac.uk", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_biodiversity", label: "Biodiversity Heritage Library", value: "biodiversitylibrary.org", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_ndl", label: "National Diet Library", value: "dl.ndl.go.jp", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_archives_gov", label: "National Archives (US)", value: "archives.gov", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_oldbook", label: "Old Book Illustrations", value: "oldbookillustrations.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_rumsey", label: "David Rumsey Map Collection", value: "davidrumsey.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_nasa", label: "NASA", value: "nasa.gov", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_natgeo", label: "National Geographic", value: "nationalgeographic.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_magnum", label: "Magnum Photos", value: "magnumphotos.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_ign", label: "IGN", value: "ign.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_vogue", label: "Vogue", value: "vogue.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_archdigest", label: "Architectural Digest", value: "architecturaldigest.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_nature", label: "Nature Portfolio", value: "nature.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_cgmeetup", label: "CGMeetup", value: "cgmeetup.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_artfol", label: "Artfol", value: "artfol.me", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_getty", label: "Getty Images", value: "gettyimages.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_shutterstock", label: "Shutterstock", value: "shutterstock.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_adobe_stock", label: "Adobe Stock", value: "stock.adobe.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_alamy", label: "Alamy", value: "alamy.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_dreamstime", label: "Dreamstime", value: "dreamstime.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_canva", label: "Canva (Content)", value: "canva.com", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_lemmy", label: "Lemmy (world)", value: "lemmy.world", isEnabled: false, isCustom: true, type: 'site_filter' },
                    { id: "site_steam", label: "Steam Community", value: "steamcommunity.com", isEnabled: false, isCustom: true, type: 'site_filter' }
                ]
            }
        }
    };
	
// Section: Global State & Utilities
    let giteSettings = {};
    let giteSettingsPanelElement = null;
    let currentGiteSettingsForPanel = {};
    let isSettingsPanelOpen = false;
    let currentlyOpenMenuId = null;
    let resultStatsObserver = null;
    let menuObserver = null;
    let CURRENT_LANGUAGE = 'en';

    function log(...args) { if (DEBUG_MODE) console.log('[GITE]', ...args); }
    function error(...args) { console.error('[GITE]', ...args); }

    function getLocalizedString(key, lang = CURRENT_LANGUAGE, fallbackText = null) {
        const effectiveLang = GITE_I18N_STRINGS[lang] ? lang : 'en';
        const text = GITE_I18N_STRINGS[effectiveLang]?.[key] || GITE_I18N_STRINGS['en']?.[key];
        return text !== undefined ? text : (fallbackText || key);
    }

    function initializeCurrentLanguage() {
        let preferred = giteSettings?.general?.selectedLanguage || 'auto';
        if (preferred === 'auto') {
            const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hk') || browserLang.startsWith('zh-hant')) CURRENT_LANGUAGE = 'zh-TW';
            else if (browserLang.startsWith('ja')) CURRENT_LANGUAGE = 'ja';
            else if (browserLang.startsWith('de')) CURRENT_LANGUAGE = 'de';
            else if (browserLang.startsWith('es')) CURRENT_LANGUAGE = 'es';
            else if (browserLang.startsWith('fr')) CURRENT_LANGUAGE = 'fr';
            else if (browserLang.startsWith('it')) CURRENT_LANGUAGE = 'it';
            else if (browserLang.startsWith('ru')) CURRENT_LANGUAGE = 'ru';
            else CURRENT_LANGUAGE = 'en';
        } else {
            CURRENT_LANGUAGE = GITE_I18N_STRINGS[preferred] ? preferred : 'en';
        }
    }

    function updateAllLocalizableElements(parent = document) {
        if (!parent || typeof parent.querySelectorAll !== 'function') return;
        parent.querySelectorAll(`[${GITE_LANG_KEY_ATTR}]`).forEach(elem => {
            const key = elem.getAttribute(GITE_LANG_KEY_ATTR);
            const targetAttr = elem.getAttribute('data-gite-lang-target-attr');
            const text = getLocalizedString(key);
            
            if (targetAttr) {
                elem.setAttribute(targetAttr, text);
            } else if (elem.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(elem.type)) {
                elem.value = text;
            } else if (elem.tagName === 'INPUT' && elem.hasAttribute('placeholder')) {
                elem.setAttribute('placeholder', text);
            } else {
                let hasChildren = elem.children.length > 0;
                if (!hasChildren) elem.textContent = text;
                else {
                    for (const node of elem.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') node.nodeValue = ' ' + text;
                    }
                }
            }
        });
    }

    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode.toUpperCase().split('').map(char => 0x1F1E6 + (char.charCodeAt(0) - 65));
        return String.fromCodePoint(...codePoints);
    }

    function injectStyles() {
        if (document.getElementById('gite-styles')) return;
        const style = document.createElement('style');
        style.id = 'gite-styles';
        style.type = 'text/css';
        style.textContent = GITE_STYLES;
        if (document.head) document.head.appendChild(style);
    }

    function detectAndApplyThemeClass() {
        const htmlElement = document.documentElement;
        let pref = giteSettings?.general?.themePreference || 'auto';
        let isDark = false;
        
        if (pref === 'auto') {
            const googleTheme = document.documentElement.getAttribute('data-theme');
            if (googleTheme === 'dark' || googleTheme === 'light') {
                isDark = (googleTheme === 'dark');
            } else {
                const bgColor = window.getComputedStyle(document.body).backgroundColor;
                const rgb = bgColor.match(/\d+/g);
                if (rgb) isDark = (parseInt(rgb[0]) < 128 && parseInt(rgb[1]) < 128 && parseInt(rgb[2]) < 128);
                else isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        } else {
            isDark = (pref === 'dark');
        }
        htmlElement.classList.toggle('gite-detected-dark-theme', isDark);
    }

    // Live Theme Listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (giteSettings?.general?.themePreference === 'auto') detectAndApplyThemeClass();
    });

    function showToast(messageKey, isLiteral = false) {
        let container = document.querySelector('.gite-toast-container');
        if (!container) {
            container = el('div', { className: 'gite-toast-container' });
            document.body.appendChild(container);
        }
        const msg = isLiteral ? messageKey : getLocalizedString(messageKey);
        const toast = el('div', { className: 'gite-toast' });
        toast.innerHTML = `${GITE_ICONS.check} <span>${msg}</span>`;
        container.appendChild(toast);
        
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Section: Advanced Query Parser
    class GiteQueryParser {
        constructor(queryString) {
            this.tokens = [];
            this.tokenize(queryString || "");
        }

        tokenize(str) {
            const pattern = /("[^"]*")|(AROUND\s*\(\s*\d+\s*\))|(-?(?:site|imagesize|filetype|ext|intitle|allintitle|inurl|allinurl|before|after|related):[^\s\(\)]+)|(\(|\))|(\s+(?:OR|\||AND)\s+)|([^\s\(\)]+)|(\s+)/gi;
            
            let match;
            while ((match = pattern.exec(str)) !== null) {
                if (match[1]) {
                    this.tokens.push({ type: 'QUOTED', value: match[1] });
                } else if (match[2]) {
                    this.tokens.push({ type: 'OP_COMPLEX', value: match[2] });
                } else if (match[3]) {
                    const lowerVal = match[3].toLowerCase();
                    if (lowerVal.match(/^-?(site|imagesize|filetype|ext):/)) {
                        this.tokens.push({ type: 'OP_TARGET', value: match[3], subType: lowerVal.split(':')[0].replace(/^-/, '') });
                    } else {
                        this.tokens.push({ type: 'OP_PRESERVE', value: match[3] });
                    }
                } else if (match[4]) {
                    this.tokens.push({ type: 'PAREN', value: match[4] });
                } else if (match[5]) {
                    this.tokens.push({ type: 'BOOLEAN', value: match[5] }); // OR, AND
                } else if (match[6]) {
                    this.tokens.push({ type: 'TEXT', value: match[6] });
                } else if (match[7]) {
                    this.tokens.push({ type: 'SPACE', value: match[7] });
                }
            }
        }

        // Remove tokens of a specific subtype (e.g., remove all 'site' tokens)
        // excludeNegative: if true, only remove "site:...", keep "-site:..."
        removeTargetTokens(subType, excludeNegative = true) {
            this.tokens = this.tokens.map(t => {
                if (t.type === 'OP_TARGET' && (t.subType === subType || (subType === 'file' && (t.subType === 'filetype' || t.subType === 'ext')))) {
                    if (excludeNegative && t.value.startsWith('-')) return t; // Keep negative operators
                    return { ...t, type: 'DELETED', value: '' };
                }
                return t;
            });
            this.cleanup();
        }

        // Append a new token to the end, ensuring proper spacing
        append(text) {
            if (this.tokens.length > 0 && this.tokens[this.tokens.length - 1].type !== 'SPACE') {
                this.tokens.push({ type: 'SPACE', value: ' ' });
            }
            this.tokens.push({ type: 'OP_TARGET', value: text, subType: 'appended' });
        }

        // Logic cleaner: Remove empty parens, dangling ORs, duplicate spaces
        cleanup() {
            // 1. Remove DELETED tokens from array
            this.tokens = this.tokens.filter(t => t.type !== 'DELETED');

            let changed = true;
            while(changed) {
                changed = false;
                const significant = [];
                this.tokens.forEach((t, i) => {
                    if (t.type !== 'SPACE') significant.push({ ...t, index: i });
                });

                const toDeleteIndices = new Set();

                for (let i = 0; i < significant.length; i++) {
                    const curr = significant[i];
                    const next = significant[i+1];
                    const prev = significant[i-1];

                    // Empty Parens: ( )
                    if (curr.type === 'PAREN' && curr.value === '(' && next && next.type === 'PAREN' && next.value === ')') {
                        toDeleteIndices.add(curr.index);
                        toDeleteIndices.add(next.index);
                        changed = true;
                    }

                    // Dangling Boolean
                    if (curr.type === 'BOOLEAN') {
                        // Case: Start of query OR ...
                        if (!prev || prev.type === 'PAREN' && prev.value === '(') {
                            toDeleteIndices.add(curr.index);
                            changed = true;
                        }
                        // Case: ... OR End of query
                        else if (!next || next.type === 'PAREN' && next.value === ')') {
                            toDeleteIndices.add(curr.index);
                            changed = true;
                        }
                    }
                }

                if (changed) {
                    this.tokens = this.tokens.filter((_, idx) => !toDeleteIndices.has(idx));
                }
            }
        }

        toString() {
            // Simple join, then squash multiple spaces
            return this.tokens
                .map(t => t.value)
                .join('')
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        // Helper for state detection
        hasTargetToken(subType) {
            // subType: 'site', 'imagesize', etc.
            return this.tokens.some(t => 
                t.type === 'OP_TARGET' && 
                (t.subType === subType || (subType === 'file' && (t.subType === 'filetype' || t.subType === 'ext'))) &&
                !t.value.startsWith('-') // Usually we check positive state
            );
        }

        // Helper to extract values for manual entry detection
        getTargetValues(subType) {
            return this.tokens
                .filter(t => 
                    t.type === 'OP_TARGET' && 
                    (t.subType === subType || (subType === 'file' && (t.subType === 'filetype' || t.subType === 'ext'))) &&
                    !t.value.startsWith('-')
                )
                .map(t => t.value.replace(/^-?(?:site|imagesize|filetype|ext):/i, ''));
        }
    }
	
    // Section: Core Logic - URL Sanitization
    function sanitizeUrlOnLoad() {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        let tbs = params.get('tbs') || "";
        let q = params.get('q') || "";
        let hasChanges = false;

        // Clean Region 'cr' vs 'ctr' conflicts
        if (params.has('cr')) {
            const newTbs = tbs.split(',').filter(p => !p.startsWith('ctr:')).join(',');
            if (newTbs !== tbs) {
                if (newTbs) params.set('tbs', newTbs); else params.delete('tbs');
                hasChanges = true;
            }
        }
        
        // Clean Filetype: If as_filetype exists, remove filetype: from q to avoid conflict
        if (params.has('as_filetype')) {
            const parser = new GiteQueryParser(q);
            if (parser.hasTargetToken('filetype') || parser.hasTargetToken('ext')) {
                parser.removeTargetTokens('file'); // Removes filetype: and ext:
                const newQ = parser.toString();
                if (newQ !== q) { params.set('q', newQ); hasChanges = true; }
            }
        }

        if (hasChanges) {
            const newUrl = url.toString();
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }

    // Section: Core Logic - State Detection
    function checkActiveState(catKey) {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const q = params.get('q') || "";
        const tbs = params.get('tbs') || "";
        const tbsTokens = tbs.split(',').map(t => t.trim().toLowerCase());
        
        // Initialize Parser for Q-based parameters
        const parser = new GiteQueryParser(q);

        const activeTokens = new Set();
        
        // 1. Add Standard URL parameters
        ['as_filetype', 'imgsz', 'imgar'].forEach(p => { if (params.has(p)) activeTokens.add(`${p}=${params.get(p).toLowerCase()}`); });
        
        // 2. Add Region (cr) parameters
        if (params.has('cr')) {
            const crVal = params.get('cr').toLowerCase();
            crVal.split('|').forEach(part => {
                activeTokens.add(`cr=${part}`);
                activeTokens.add(`tbs=ctr:${part}`);
            });
            activeTokens.add(`cr=${crVal}`);
        }

        // 3. Add TBS parameters
        tbsTokens.forEach(t => { 
            if (t) { 
                activeTokens.add(`tbs=${t}`); 
                activeTokens.add(t); 
            } 
        });

        // 4. Extract Q-based tokens using Parser
        const siteValues = parser.getTargetValues('site');
        siteValues.forEach(v => activeTokens.add(`site:${v.toLowerCase()}`));
        
        const sizeValues = parser.getTargetValues('imagesize');
        sizeValues.forEach(v => activeTokens.add(`imagesize:${v.toLowerCase()}`));

        const fileValues = parser.getTargetValues('file');
        fileValues.forEach(v => activeTokens.add(`filetype:${v.toLowerCase()}`));

        const options = [...(giteSettings.filters[catKey].options || []), ...(giteSettings.filters[catKey].userDefinedOptions || []), ...(giteSettings.filters[catKey].predefinedOptions || [])];
        let activeOptions = [];
        const manualValues = [];

        options.forEach(opt => {
            if (opt.type === 'separator') return;
            if (opt.value === "" && !opt.tbsValue && !opt.type?.endsWith('_clear')) return;
            
            const val = opt.tbsValue !== undefined ? opt.tbsValue : opt.value;
            if (opt.id.endsWith('_any')) return;

            let isActive = false;
            
            if (catKey === 'site') {
                if (val.includes(' OR ')) {
                    const parts = val.split(' OR ').map(s => s.trim().toLowerCase().replace(/^site:/i, ''));
                    const lowerSiteValues = siteValues.map(s => s.toLowerCase());
                    if (parts.length > 0 && parts.every(p => lowerSiteValues.includes(p))) isActive = true;
                } else {
                    const domain = val.toLowerCase().replace(/^site:/i, '');
                    if (domain && siteValues.some(s => s.toLowerCase() === domain)) isActive = true;
                }
            } 
            else if (catKey === 'fileType') {
                if (val && (activeTokens.has(`as_filetype=${val.toLowerCase()}`) || activeTokens.has(`filetype:${val.toLowerCase()}`))) isActive = true;
            }
            else if (catKey === 'exactSize') {
                 if (val && activeTokens.has(`imagesize:${val.toLowerCase()}`)) isActive = true;
            }
            else if (catKey === 'region') {
                if (val && (activeTokens.has(`cr=${val.toLowerCase()}`) || activeTokens.has(`tbs=ctr:${val.toLowerCase()}`))) isActive = true;
            }
            else if (catKey === 'size') { 
                if (['l','m','i'].includes(val)) { if (activeTokens.has(`tbs=isz:${val}`) || activeTokens.has(`imgsz=${val}`)) isActive = true; } 
                else if (val && (activeTokens.has(`imgsz=${val}`) || activeTokens.has(`tbs=islt:${val}`))) isActive = true;
            }
            else if (catKey === 'aspectRatio') { if (val && activeTokens.has(`imgar=${val.toLowerCase()}`)) isActive = true; }
            else if (catKey === 'color') {
                if (opt.type === 'palette') {
                    const reqTokens = opt.tbsValue.split(',').map(t => `tbs=${t.trim().toLowerCase()}`);
                    if (reqTokens.every(t => activeTokens.has(t))) isActive = true;
                } else { if (activeTokens.has(`tbs=${opt.tbsValue.toLowerCase()}`)) isActive = true; }
            }
            else if (catKey === 'time') {
                if (opt.type === 'custom_date_trigger') { if (Array.from(activeTokens).some(t => t.startsWith('tbs=cdr:1'))) isActive = true; } 
                else if (opt.tbsValue && activeTokens.has(`tbs=${opt.tbsValue.toLowerCase()}`)) isActive = true;
            }
            else { 
                 if (opt.paramName === 'tbs' || ['type','usageRights'].includes(catKey)) { if (val && activeTokens.has(`tbs=${val.toLowerCase()}`)) isActive = true; } 
                 else { if (val && activeTokens.has(`${opt.paramName || catKey}=${val.toLowerCase()}`)) isActive = true; }
            }
            if (isActive) activeOptions.push(opt);
        });

        // Manual Detection
        if (catKey === 'site') {
            const menuDomains = new Set();
            options.forEach(opt => {
                if(opt.value) opt.value.split(/\s+OR\s+/i).forEach(s => menuDomains.add(s.trim().toLowerCase().replace(/^site:/i, '')));
            });
            siteValues.forEach(domain => {
                if (!menuDomains.has(domain.toLowerCase())) manualValues.push({ label: domain, value: domain });
            });
        }
        else if (catKey === 'exactSize') {
            const menuSizes = new Set(options.map(o => o.value.toLowerCase()));
            sizeValues.forEach(sz => {
                if (!menuSizes.has(sz.toLowerCase())) manualValues.push({ label: sz, value: sz });
            });
        }
        else if (catKey === 'time') {
            if (activeOptions.some(o => o.type === 'custom_date_trigger')) {
                const min = tbsTokens.find(t => t.startsWith('cd_min:'));
                const max = tbsTokens.find(t => t.startsWith('cd_max:'));
                if (min && max) {
                    activeOptions = activeOptions.filter(o => o.type !== 'custom_date_trigger');
                    const minDate = min.replace('cd_min:', '');
                    const maxDate = max.replace('cd_max:', '');
                    try {
                        const d1 = new Date(minDate);
                        const d2 = new Date(maxDate);
                        if (!isNaN(d1) && !isNaN(d2)) {
                            const fmt = new Intl.DateTimeFormat(CURRENT_LANGUAGE === 'auto' ? undefined : CURRENT_LANGUAGE.replace('_','-'));
                            manualValues.push({ label: `${fmt.format(d1)} - ${fmt.format(d2)}` });
                        } else manualValues.push({ label: `${minDate} - ${maxDate}` });
                    } catch(e) { manualValues.push({ label: `${minDate} - ${maxDate}` }); }
                }
            }
        }
        return { activeOptions, manualValues };
    }
	
// Section: Core Logic - URL Builder
    function buildNewUrl(paramName, paramValue, optionCtx, clearAll = false) {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        let currentQ = params.get('q') || "";
        let currentTbs = params.get('tbs') || "";

        const parser = new GiteQueryParser(currentQ);

        if (clearAll) {
            params.delete('imgsz'); params.delete('imgar'); params.delete('as_filetype'); params.delete('cr'); params.delete('imgc');
            parser.removeTargetTokens('site');
            parser.removeTargetTokens('imagesize');
            parser.removeTargetTokens('file'); 
            params.set('q', parser.toString());

            const tbsKeysToRemove = ['itp', 'ic', 'isc', 'sur', 'qdr', 'cdr', 'cd_min', 'cd_max', 'isz', 'islt', 'isilu', 'ctr'];
            const tbsParts = currentTbs.split(',').filter(p => !tbsKeysToRemove.includes(p.split(':')[0]) && !tbsKeysToRemove.includes(p));
            if (tbsParts.length > 0 && tbsParts[0] !== '') params.set('tbs', tbsParts.join(',')); else params.delete('tbs');
            return url.toString();
        }

        const cat = optionCtx.categoryKey;

        if (cat === 'exactSize' || (optionCtx.type && optionCtx.type.startsWith('imagesize'))) {
            params.delete('imgsz'); params.delete('imgar');
            currentTbs = currentTbs.split(',').filter(p => !p.startsWith('isz:') && !p.startsWith('islt:')).join(',');
            
            parser.removeTargetTokens('imagesize');
            if (paramValue) parser.append(`imagesize:${paramValue}`);
            params.set('q', parser.toString());

        } else if (cat === 'site' || optionCtx.type === 'site_filter') {
            parser.removeTargetTokens('site');
            if (paramValue) {
                if (paramValue.includes(' OR ')) {
                    const parts = paramValue.split(' OR ').map(s => {
                        s = s.trim();
                        return s.toLowerCase().startsWith('site:') ? s : `site:${s}`;
                    });
                    parser.append(parts.join(' OR ')); 
                } else {
                    parser.append(paramValue.toLowerCase().startsWith('site:') ? paramValue : `site:${paramValue}`);
                }
            }
            params.set('q', parser.toString());

        } else if (cat === 'fileType') {
            parser.removeTargetTokens('file');
            params.set('q', parser.toString());
            if (paramValue) params.set('as_filetype', paramValue); 
            else params.delete('as_filetype');

        } else if (cat === 'region') {
             currentTbs = currentTbs.split(',').filter(p => !p.startsWith('ctr:')).join(',');
             if (paramValue) params.set('cr', paramValue); else params.delete('cr');

        } else if (cat === 'size') {
            parser.removeTargetTokens('imagesize');
            params.set('q', parser.toString());
            params.delete('imgsz');
            currentTbs = currentTbs.split(',').filter(p => !p.startsWith('isz:') && !p.startsWith('islt:') && !p.startsWith('isilu:')).join(',');
            if (['l', 'm', 'i'].includes(paramValue)) currentTbs = currentTbs ? `${currentTbs},isz:${paramValue}` : `isz:${paramValue}`;
            else if (paramValue) params.set('imgsz', paramValue);

        } else if (cat === 'aspectRatio') {
            parser.removeTargetTokens('imagesize');
            params.set('q', parser.toString());
            if (paramValue) params.set('imgar', paramValue); else params.delete('imgar');

        } else {
            let tbsParts = currentTbs.split(',').filter(Boolean);
            const prefixMap = { 'color': ['ic','isc'], 'type': ['itp'], 'time': ['qdr','cdr','cd_min','cd_max'], 'usageRights': ['sur'] };
            if (prefixMap[cat]) tbsParts = tbsParts.filter(p => !prefixMap[cat].some(pre => p.startsWith(pre + ':') || p === pre));
            if (optionCtx.tbsValue) optionCtx.tbsValue.split(',').forEach(v => tbsParts.push(v));
            currentTbs = tbsParts.join(',');
        }

        if (currentTbs) params.set('tbs', currentTbs); else params.delete('tbs');
        if (!params.get('q')) params.set('q', ' '); 

        return url.toString().replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2F/g, '/');
    }
	
    // Section: Menu Item Factory
    function createMenuItem(opt, catKey, activeState) {
        if (opt.type === 'separator') return el('div', { className: 'gite-menu-separator' });

        if (opt.type === 'custom_date_trigger') {
            const isActive = activeState.activeOptions.some(o => o.id === opt.id);
            const item = el('div', { className: `gite-menu-item ${isActive ? 'selected' : ''}`, role: 'button', tabIndex: -1, style: "cursor: pointer;" });
            item.append(document.createTextNode(getLocalizedString(opt.textKey)), el('div', { className: 'gite-check-icon', innerHTML: GITE_ICONS.check }));
            item.onclick = (e) => { e.stopPropagation(); openDatePicker(); };
            return item;
        }

        const label = opt.customText || (opt.label) || getLocalizedString(opt.textKey, CURRENT_LANGUAGE, opt.id);
        let pName = opt.paramName || 'q'; 
        if (['color','type','time','usageRights'].includes(catKey)) pName = 'tbs';
        if (catKey === 'fileType') pName = 'as_filetype';
        if (catKey === 'region') pName = 'cr';
        if (catKey === 'aspectRatio') pName = 'imgar';
        if (catKey === 'size') pName = 'imgsz'; 

        const targetUrl = buildNewUrl(pName, opt.value || opt.tbsValue, { ...opt, categoryKey: catKey });
        const isSelected = activeState.activeOptions.some(o => o.id === opt.id);
        
        if (catKey === 'color' && opt.type === 'palette') {
            const swatch = el('a', { className: `gite-swatch ${isSelected ? 'selected' : ''}`, style: `background:${opt.hex}`, title: label, href: targetUrl, tabIndex: -1 });
            swatch.addEventListener('click', (e) => { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); window.location.href = targetUrl; });
            return swatch;
        }

        const item = el('a', { className: `gite-menu-item ${isSelected ? 'selected' : ''}`, href: targetUrl, tabIndex: -1, dataset: { id: opt.id } });
        if (catKey === 'site' && opt.value) item.title = opt.value.replace(/\s+OR\s+/g, ', ');

        const contentDiv = el('div', { style: 'display:flex; align-items:center;' });
        if (catKey === 'region' && giteSettings.general.showRegionFlags && opt.value) contentDiv.appendChild(document.createTextNode(getFlagEmoji(opt.value.replace('country', '')) + ' '));
        if (catKey === 'site' && giteSettings.filters.site.showFavicons && opt.value) {
            if (opt.value.includes(' OR ')) contentDiv.appendChild(el('div', { className: 'gite-tb-icon', innerHTML: GITE_ICONS.globe, style: "margin-right:8px; width:16px; height:16px; color: var(--gite-text-secondary);" }));
            else {
                const domain = opt.value.split(' ')[0]; 
                const favicon = el('img', { className: 'gite-favicon', src: `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`, style: "margin-right:8px; width:16px; height:16px; vertical-align:middle; border-radius:2px;" });
                favicon.onerror = function() { this.style.display = 'none'; };
                contentDiv.appendChild(favicon);
            }
        }
        contentDiv.appendChild(document.createTextNode(label));
        item.append(contentDiv, el('div', { className: 'gite-check-icon', innerHTML: GITE_ICONS.check }));
        item.addEventListener('click', (e) => { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); window.location.href = targetUrl; });
        return item;
    }
	
// Section: UI Builder
    function addFilterCategoryMenu(container, catKey, titleKey, paramName, idPrefix) {
        if (giteSettings.filters[catKey] && giteSettings.filters[catKey].enabled === false) return;

        let title = getLocalizedString(titleKey);
        const iconSvg = GITE_ICONS[catKey] || GITE_ICONS.gear; 
        const globalBtnStyle = giteSettings.general.toolbarButtonStyle || 'text';
        let options = [];
        if (catKey === 'exactSize') options = [...(giteSettings.filters.exactSize.predefinedOptions || [])];
        else if (catKey === 'site') options = _generateDefaults('site');
        else options = giteSettings.filters[catKey].options || [];

        const activeState = checkActiveState(catKey);
        const { activeOptions, manualValues } = activeState;
        const isActive = activeOptions.length > 0 || manualValues.length > 0;
        
        let displayLabel = title;
        if (isActive) {
            const labels = [];
            activeOptions.forEach(opt => { if (opt.value === "" && !opt.tbsValue && !opt.type?.endsWith('clear')) return; labels.push(opt.customText || opt.label || getLocalizedString(opt.textKey, CURRENT_LANGUAGE, opt.id)); });
            manualValues.forEach(mv => labels.push(mv.label));
            if (labels.length > 0) displayLabel = labels.join(', ');
        }

        const btn = el('div', { id: `${idPrefix}-btn`, className: `gite-tb-btn gite-ripple style-${globalBtnStyle} ${isActive ? 'active' : ''}`, tabIndex: 0, role: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
        if (catKey === 'site' && isActive && manualValues.length > 0) btn.title = manualValues.map(m => m.value).join(', ');
        else if (catKey === 'site' && isActive && activeOptions.length > 0) btn.title = activeOptions.map(o => o.value.replace(/\s+OR\s+/g, ', ')).join('; ');
        else if (globalBtnStyle === 'icon') btn.title = displayLabel;

        btn.append(el('div', { className: 'gite-tb-icon', innerHTML: iconSvg }), el('span', { className: 'gite-btn-text', textContent: displayLabel }), el('div', { className: 'gite-tb-arrow' }));
        const menu = el('div', { id: `${idPrefix}-menu`, className: 'gite-menu-dropdown', role: 'menu' });
        
        const catSettings = giteSettings.filters[catKey];
        const appendOptionsTo = (list, container) => { list.forEach(opt => { if(opt.isEnabled !== false) container.appendChild(createMenuItem(opt, catKey, activeState)); }); };
        
        let allOptionsToRender = [...options];
        if (catKey === 'site' && catSettings.userDefinedOptions) allOptionsToRender = [...catSettings.userDefinedOptions, ...options];

        if (catKey === 'color') {
            appendOptionsTo(options.filter(o => o.type !== 'palette'), menu);
            const paletteParams = options.filter(o => o.type === 'palette');
            if (paletteParams.length > 0) {
                const grid = el('div', { className: 'gite-palette-grid' });
                paletteParams.forEach(p => { if (p.isEnabled !== false) grid.appendChild(createMenuItem(p, catKey, activeState)); });
                menu.appendChild(grid);
            }
        } 
        else if (catSettings.useMultiColumnLayout && (catKey === 'region' || catKey === 'site')) {
            const masonryContainer = el('div', { className: 'gite-menu-masonry' });
            let topItems = [], masonryItems = [];
            if (catKey === 'site') {
                const anyOpt = options.find(o => o.id === 'site_any');
                if (anyOpt) topItems.push(anyOpt);
                masonryItems = [...(catSettings.userDefinedOptions||[]), ...options.filter(o => o.id !== 'site_any')];
            } else {
                const anyOpt = options.find(o => o.id === 'reg_any');
                if (anyOpt) topItems.push(anyOpt);
                masonryItems = options.filter(o => o.id !== 'reg_any');
            }
            if (topItems.length > 0) { appendOptionsTo(topItems, menu); menu.appendChild(el('div', { className: 'gite-menu-separator' })); }
            appendOptionsTo(masonryItems, masonryContainer);
            menu.appendChild(masonryContainer);
        }
        else if (catSettings.useTwoColumnLayout || (catKey === 'time' && catSettings.showEmbeddedDatePicker)) {
            const rowContainer = el('div', { className: 'gite-menu-row-container' });
            const leftCol = el('div', { className: 'gite-menu-col' });
            const rightCol = el('div', { className: 'gite-menu-col' });
            
            if (catKey === 'size') {
                appendOptionsTo(options.filter(o => !o.id.includes('mp') && o.type !== 'separator'), leftCol);
                appendOptionsTo(options.filter(o => o.id.includes('mp')), rightCol);
                rowContainer.append(leftCol, rightCol);
            } 
            else if (catKey === 'exactSize') {
                // Left Col: [Any Exact Size] -> [Predefined Options]
                const anyOpt = options.find(o => o.id === 'gite_exact_any');
                const predefined = options.filter(o => o.id !== 'gite_exact_any');
                const custom = catSettings.userDefinedOptions || [];

                if (anyOpt && anyOpt.isEnabled !== false) leftCol.appendChild(createMenuItem(anyOpt, catKey, activeState));
                appendOptionsTo(predefined, leftCol);

                // Right Col: [Manual Input] -> [Custom Options]
                if (catSettings.showInputsInMenu) {
                    const inputRow = el('div', { className: 'gite-menu-input-row' });
                    let activeW = '', activeH = '';
                    const manualSize = manualValues.find(m => m.value.match(/^\d+x\d+$/));
                    if (manualSize) { const dims = manualSize.value.split('x'); activeW = dims[0]; activeH = dims[1]; }
                    const wInput = el('input', { type: 'number', className: 'gite-menu-input', placeholder: 'W', min: 1, value: activeW, style: 'width:48px' });
                    const hInput = el('input', { type: 'number', className: 'gite-menu-input', placeholder: 'H', min: 1, value: activeH, style: 'width:48px' });
                    const goBtn = el('button', { className: 'gite-menu-btn-icon', innerHTML: GITE_ICONS.check, title: getLocalizedString('btn_apply') });
                    const doCustomSize = () => { if(wInput.value && hInput.value) window.location.href = buildNewUrl('q', `${wInput.value}x${hInput.value}`, { categoryKey: 'exactSize', type: 'imagesize' }); };
                    goBtn.onclick = (e) => { e.stopPropagation(); doCustomSize(); };
                    const onKey = (e) => { if(e.key === 'Enter') doCustomSize(); };
                    wInput.onkeydown = onKey; hInput.onkeydown = onKey;
                    inputRow.append(wInput, document.createTextNode('×'), hInput, goBtn);
                    rightCol.appendChild(inputRow);
                }
                appendOptionsTo(custom, rightCol);
                rowContainer.append(leftCol, rightCol);
            }
            else if (catKey === 'time') {
                const longKeys = ['time_past_week', 'time_past_2w', 'time_past_3w', 'time_past_month', 'time_past_2m', 'time_past_3m', 'time_past_4m', 'time_past_5m', 'time_past_6m', 'time_past_7m', 'time_past_8m', 'time_past_9m', 'time_past_10m', 'time_past_11m', 'time_past_year', 'time_past_2y', 'time_past_3y', 'time_past_4y', 'time_past_5y', 'time_past_6y', 'time_past_7y', 'time_past_8y', 'time_past_9y', 'time_past_10y'];
                const leftOpts = options.filter(o => o.type !== 'separator' && o.type !== 'custom_date_trigger' && !longKeys.includes(o.id));
                const rightOpts = options.filter(o => longKeys.includes(o.id));
                const customTrigger = options.find(o => o.type === 'custom_date_trigger');
                
                if (catSettings.useTwoColumnLayout) {
                    appendOptionsTo(leftOpts, leftCol); appendOptionsTo(rightOpts, rightCol);
                    if (!catSettings.showEmbeddedDatePicker && customTrigger?.isEnabled !== false) { rightCol.appendChild(el('div', { className: 'gite-menu-separator' })); rightCol.appendChild(createMenuItem(customTrigger, catKey, activeState)); }
                    rowContainer.append(leftCol, rightCol);
                } else {
                    appendOptionsTo(options.filter(o => o.type !== 'custom_date_trigger'), menu);
                    if (!catSettings.showEmbeddedDatePicker && customTrigger?.isEnabled !== false) menu.appendChild(createMenuItem(customTrigger, catKey, activeState));
                }

                if (catSettings.showEmbeddedDatePicker) {
                    const dateCol = el('div', { className: 'gite-embedded-picker' });
                    dateCol.onclick = (e) => e.stopPropagation(); 
                    const header = el('div', { className: 'gite-embedded-header', textContent: getLocalizedString('option_text_time_custom_range') });
                    let defS = '', defE = '';
                    const tbs = new URL(window.location.href).searchParams.get('tbs') || "";
                    if(tbs.includes('cdr:1')) {
                         const min = tbs.match(/cd_min:(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                         const max = tbs.match(/cd_max:(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                         if(min) defS = `${min[3]}-${min[1].padStart(2,'0')}-${min[2].padStart(2,'0')}`;
                         if(max) defE = `${max[3]}-${max[1].padStart(2,'0')}-${max[2].padStart(2,'0')}`;
                    }
                    const startIn = el('input', { type: 'date', className: 'gite-embedded-input', value: defS });
                    const endIn = el('input', { type: 'date', className: 'gite-embedded-input', value: defE });
                    const applyBtn = el('button', { className: 'gite-embedded-apply-btn', textContent: getLocalizedString('btn_apply') });
                    const validate = () => {
                        const s = startIn.value, e = endIn.value;
                        if(s && e && new Date(s) > new Date(e)) { endIn.classList.add('error'); return false; }
                        endIn.classList.remove('error'); return true;
                    };
                    startIn.onchange = validate; endIn.onchange = validate;
                    const doApply = () => {
                        if(!validate() || !startIn.value || !endIn.value) return;
                        const formatDate = d => { const p = d.split('-'); return `${p[1]}/${p[2]}/${p[0]}`; }; 
                        const tbsVal = `cdr:1,cd_min:${formatDate(startIn.value)},cd_max:${formatDate(endIn.value)}`;
                        window.location.href = buildNewUrl('tbs', tbsVal, { categoryKey: 'time', tbsValue: tbsVal });
                    };
                    applyBtn.onclick = doApply;
                    dateCol.addEventListener('keydown', (e) => { if(e.key === 'Enter') doApply(); });
                    dateCol.append(header, startIn, endIn, applyBtn);
                    
                    if (catSettings.useTwoColumnLayout) rowContainer.appendChild(dateCol);
                    else {
                        const mixedContainer = el('div', { className: 'gite-menu-row-container' });
                        const optsCol = el('div', { className: 'gite-menu-col' });
                        while(menu.firstChild) optsCol.appendChild(menu.firstChild);
                        mixedContainer.append(optsCol, dateCol);
                        menu.appendChild(mixedContainer);
                    }
                }
            } 
            if (menu.children.length === 0) menu.appendChild(rowContainer);
        } 
        else { // Single Column
            if (catKey === 'site') {
                 const anyOpt = allOptionsToRender.find(o => o.id === 'site_any');
                 const otherOpts = allOptionsToRender.filter(o => o.id !== 'site_any');
                 if (anyOpt && anyOpt.isEnabled !== false) menu.appendChild(createMenuItem(anyOpt, catKey, activeState));
                 if (otherOpts.length > 0) { if(anyOpt) menu.appendChild(el('div', { className: 'gite-menu-separator' })); appendOptionsTo(otherOpts, menu); }
            } 
            else if (catKey === 'exactSize') {
                // Single column order: [Manual Input] -> [Any Exact Size] -> [Custom Options] -> [Predefined Options]
                const anyOpt = options.find(o => o.id === 'gite_exact_any');
                const predefined = options.filter(o => o.id !== 'gite_exact_any');
                const custom = catSettings.userDefinedOptions || [];

                // 1. Manual Input
                if (catSettings.showInputsInMenu) {
                    // Note: .gite-menu-input-row already has a bottom border in CSS, so no extra separator needed.
                    const inputRow = el('div', { className: 'gite-menu-input-row' });
                    let activeW = '', activeH = '';
                    const manualSize = manualValues.find(m => m.value.match(/^\d+x\d+$/));
                    if (manualSize) { const dims = manualSize.value.split('x'); activeW = dims[0]; activeH = dims[1]; }
                    const wInput = el('input', { type: 'number', className: 'gite-menu-input', placeholder: 'W', min: 1, value: activeW });
                    const hInput = el('input', { type: 'number', className: 'gite-menu-input', placeholder: 'H', min: 1, value: activeH });
                    const goBtn = el('button', { className: 'gite-menu-btn-icon', innerHTML: GITE_ICONS.check, title: getLocalizedString('btn_apply') });
                    const doCustomSize = () => { if(wInput.value && hInput.value) window.location.href = buildNewUrl('q', `${wInput.value}x${hInput.value}`, { categoryKey: 'exactSize', type: 'imagesize' }); };
                    goBtn.onclick = (e) => { e.stopPropagation(); doCustomSize(); };
                    const onKey = (e) => { if(e.key === 'Enter') doCustomSize(); };
                    wInput.onkeydown = onKey; hInput.onkeydown = onKey;
                    inputRow.append(wInput, document.createTextNode('×'), hInput, goBtn);
                    menu.appendChild(inputRow);
                }

                // 2. Any Exact Size
                if (anyOpt && anyOpt.isEnabled !== false) menu.appendChild(createMenuItem(anyOpt, catKey, activeState));

                // 3. Custom Options
                if (custom.length > 0) {
                    appendOptionsTo(custom, menu);
                }

                // 4. Predefined Options
                if (predefined.length > 0) {
                    appendOptionsTo(predefined, menu);
                }
            }
            else if (catKey === 'region') {
                const anyOpt = options.find(o => o.id === 'reg_any');
                const otherOpts = options.filter(o => o.id !== 'reg_any');
                if (anyOpt && anyOpt.isEnabled !== false) menu.appendChild(createMenuItem(anyOpt, catKey, activeState));
                if (anyOpt && otherOpts.length > 0) menu.appendChild(el('div', { className: 'gite-menu-separator' }));
                appendOptionsTo(otherOpts, menu);
            }
            else appendOptionsTo(options, menu);
        }

        const toggleMenu = (shouldOpen) => {
            if (typeof shouldOpen === 'undefined') shouldOpen = !menu.classList.contains('show');
            document.querySelectorAll('.gite-menu-dropdown').forEach(m => { if (m !== menu) m.classList.remove('show'); });
            document.querySelectorAll('.gite-tb-btn').forEach(b => { if (b !== btn) { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
            if (shouldOpen) {
                menu.classList.add('show'); btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
                currentlyOpenMenuId = menu.id;
                let focusTarget = menu.querySelector('input') || menu.querySelector('a.gite-menu-item, a.gite-swatch');
                if (focusTarget) requestAnimationFrame(() => focusTarget.focus());
            } else {
                menu.classList.remove('show'); btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
                currentlyOpenMenuId = null;
            }
        };

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); toggleMenu(true); } 
            else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); handleToolbarNav(e, btn); }
        });
        btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(); };
        menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); toggleMenu(false); btn.focus(); } else handleMenuNav(e, menu); });

        const wrapper = el('div', { className: 'gite-tb-group' });
        wrapper.append(btn, menu);
        container.appendChild(wrapper);
    }

    // Section: Navigation Helpers
    function handleToolbarNav(e, currentBtn) {
        const allBtns = Array.from(document.querySelectorAll(`#${GITE_TOOLBAR_CONTAINER_ID} .gite-tb-btn`));
        if (!allBtns.length) return;
        const currIdx = allBtns.indexOf(currentBtn);
        let nextIdx = currIdx;
        if (e.key === 'ArrowLeft') nextIdx = currIdx - 1;
        else if (e.key === 'ArrowRight') nextIdx = currIdx + 1;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = allBtns.length - 1;
        if (nextIdx >= 0 && nextIdx < allBtns.length) allBtns[nextIdx].focus();
    }

    function handleMenuNav(e, menu) {
        if (e.target.tagName === 'INPUT' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') return;
        const items = Array.from(menu.querySelectorAll('a.gite-menu-item, a.gite-swatch, button.gite-menu-btn-icon, button.gite-embedded-apply-btn, input:not([type="hidden"])'));
        if (!items.length) return;
        
        let currIdx = items.indexOf(document.activeElement);
        if (currIdx === -1) currIdx = 0;
        let nextIdx = currIdx;

        if (e.key === 'ArrowDown') { e.preventDefault(); nextIdx = (currIdx + 1) % items.length; } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); nextIdx = (currIdx - 1 + items.length) % items.length; } 
        else if (e.key === 'Home') { e.preventDefault(); nextIdx = 0; } 
        else if (e.key === 'End') { e.preventDefault(); nextIdx = items.length - 1; }

        if (nextIdx !== currIdx) items[nextIdx].focus();
    }

    // Section: Toolbar Initialization (Updated v1.2.6)
    function initializeEnhancedFilters() {
        if (document.getElementById(GITE_TOOLBAR_CONTAINER_ID)) return;

        // Apply Native Chips Hiding Logic
        const htmlEl = document.documentElement;
        if (giteSettings.general.hideNativeChips) htmlEl.classList.add('gite-hide-native-chips');
        else htmlEl.classList.remove('gite-hide-native-chips');

        // Determine Layout Mode
        const layoutMode = giteSettings.general.toolbarLayout || 'standard';

        const toolbar = el('div', { id: GITE_TOOLBAR_CONTAINER_ID });
        if (giteSettings.general.toolbarFontSize) {
            let fs = giteSettings.general.toolbarFontSize; if (!fs.includes('px')) fs += 'px';
            toolbar.style.setProperty('--gite-menu-font-size', fs);
        }
        if (giteSettings.general.toolbarLineHeight) toolbar.style.setProperty('--gite-menu-line-height', giteSettings.general.toolbarLineHeight);

        // Populate Content
        const filtersGroup = el('div', { className: 'gite-filters-group' });
        toolbar.appendChild(filtersGroup);

        const categories = [
            { k: 'size', t: 'filter_title_size', p: 'imgsz', id: 'gite-size' },
            { k: 'exactSize', t: 'filter_title_exact_size', p: 'q', id: 'gite-es' },
            { k: 'aspectRatio', t: 'filter_title_aspect_ratio', p: 'imgar', id: 'gite-ar' },
            { k: 'color', t: 'filter_title_color', p: 'tbs', id: 'gite-col' },
            { k: 'type', t: 'filter_title_type', p: 'tbs', id: 'gite-type' },
            { k: 'time', t: 'filter_title_time', p: 'tbs', id: 'gite-time' },
            { k: 'usageRights', t: 'filter_title_usage_rights', p: 'tbs', id: 'gite-rights' },
            { k: 'fileType', t: 'filter_title_file_type', p: 'as_filetype', id: 'gite-file' },
            { k: 'region', t: 'filter_title_region', p: 'cr', id: 'gite-reg' },
            { k: 'site', t: 'filter_title_site_search', p: 'q', id: 'gite-site' }
        ];

        categories.forEach(c => addFilterCategoryMenu(filtersGroup, c.k, c.t, c.p, c.id));

        if (giteSettings.general.showAdvancedSearchButton) {
            const currentQ = new URL(window.location.href).searchParams.get('q') || "";
            const parser = new GiteQueryParser(currentQ);
            parser.removeTargetTokens('site'); parser.removeTargetTokens('imagesize'); parser.removeTargetTokens('file');
            const cleanQ = parser.toString();
            const advBtn = el('a', { className: 'gite-tb-btn gite-tb-adv-link gite-ripple style-icon', href: `https://www.google.com/advanced_image_search?as_q=${encodeURIComponent(cleanQ)}`, title: getLocalizedString('filter_title_advanced_search'), tabIndex: 0 });
            advBtn.append(el('div', { className: 'gite-tb-icon', innerHTML: GITE_ICONS.sliders }));
            filtersGroup.appendChild(advBtn);
        }

        const url = new URL(window.location.href);
        const qVal = url.searchParams.get('q') || "";
        const qParser = new GiteQueryParser(qVal);
        const hasActiveQFilter = qParser.hasTargetToken('site') || qParser.hasTargetToken('imagesize') || qParser.hasTargetToken('file');
        
        const hasFilter = url.searchParams.get('tbs') || url.searchParams.get('imgsz') || url.searchParams.get('imgar') || url.searchParams.get('as_filetype') || url.searchParams.get('cr') || hasActiveQFilter;
        
        if (hasFilter) {
            const btnStyle = giteSettings.general.toolbarButtonStyle || 'text';
            const clearBtn = el('a', { className: `gite-tb-btn gite-ripple clear-action style-${btnStyle}`, href: "javascript:void(0);", title: btnStyle==='icon' ? getLocalizedString('btn_clear') : '', tabIndex: 0 });
            clearBtn.append(el('div', { className: 'gite-tb-icon', innerHTML: GITE_ICONS.clear }), el('span', { className: 'gite-btn-text', textContent: getLocalizedString('btn_clear') }));
            clearBtn.onclick = (e) => { if(e.button===0) { e.preventDefault(); window.location.href = buildNewUrl('', '', {}, true); } };
            filtersGroup.appendChild(clearBtn);
        }

        const utilGroup = el('div', { className: 'gite-utilities-group' });
        toolbar.appendChild(utilGroup);

        if (giteSettings.general.showResultStats) { utilGroup.appendChild(el('span', { id: GITE_RESULT_STATS_DISPLAY_ID })); updateResultStats(); }
        if (giteSettings.general.showSettingsButtonOnToolbar) {
            const setBtn = el('div', { id: GITE_SETTINGS_BUTTON_ID, innerHTML: GITE_ICONS.gear, title: getLocalizedString('gm_menu_gite_settings'), tabIndex: 0, role: 'button' });
            setBtn.onclick = openSettingsPanel;
            utilGroup.appendChild(setBtn);
        }

        // Injection Strategy
        if (layoutMode === 'sticky') {
            injectStickyToolbar(toolbar);
        } else {
            // Standard Embedded
            const anchor = document.querySelector(BEFORE_APPBAR_SELECTOR);
            if (anchor) anchor.parentNode.insertBefore(toolbar, anchor);
        }
    }

    // Sticky Toolbar Logic
    function injectStickyToolbar(toolbar) {
        const target = document.querySelector(BEFORE_APPBAR_SELECTOR);
        if (!target) return;

        toolbar.classList.add('gite-toolbar-sticky');
        toolbar.style.setProperty('--gite-sticky-top', `${GITE_STICKY_TOP_COMPACT}px`);
        
        // Insert BEFORE the parent of before-appbar to escape fixed headers
        target.parentNode.insertBefore(toolbar, target);
        
        setupSmartScrollListener(toolbar);
    }

    function checkForChips() {
        if (giteSettings.general.hideNativeChips) return false;
        // Check outer .rfiSsc and inner containers
        const chips = document.querySelector('.rfiSsc, .sBbkle, .xhjkHe, .TrmO7');
        return chips && chips.offsetHeight > 0;
    }

    function setupSmartScrollListener(toolbar) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = (force) => {
            const currentScrollY = window.scrollY;
            const hasChips = checkForChips();
            const diff = currentScrollY - lastScrollY;

            if (force || Math.abs(diff) > 5) {
                if (!hasChips) {
                    toolbar.style.setProperty('--gite-sticky-top', `${GITE_STICKY_TOP_COMPACT}px`);
                } else {
                    if (diff > 0) { // Down
                        toolbar.style.setProperty('--gite-sticky-top', `${GITE_STICKY_TOP_COMPACT}px`);
                    } else { // Up
                        toolbar.style.setProperty('--gite-sticky-top', `${GITE_STICKY_TOP_EXPANDED}px`);
                    }
                }
            }
            lastScrollY = currentScrollY;
        };

        // Initial check
        handleScroll(true);

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll(false);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
	
// Section: UI Helpers (Popup)
    function openDatePicker() {
        document.querySelectorAll('.gite-menu-dropdown').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.gite-tb-btn').forEach(b => { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
        
        const overlay = el('div', { className: 'gite-datepicker-overlay' });
        const picker = el('div', { className: 'gite-custom-date-picker' });
        const row1 = el('div', { className: 'gite-date-row' }, [ el('label', { for: 'gite-date-start' }, getLocalizedString('datepicker_label_from')), el('input', { type: 'date', id: 'gite-date-start' }) ]);
        const row2 = el('div', { className: 'gite-date-row' }, [ el('label', { for: 'gite-date-end' }, getLocalizedString('datepicker_label_to')), el('input', { type: 'date', id: 'gite-date-end' }) ]);
        
        const actions = el('div', { className: 'gite-datepicker-actions' });
        const applyBtn = el('button', { className: 'gite-btn gite-btn-primary', textContent: getLocalizedString('btn_apply') });
        const close = () => { if(overlay.parentNode) overlay.parentNode.removeChild(overlay); };
        
        const doApply = () => {
            const s = picker.querySelector('#gite-date-start').value, e = picker.querySelector('#gite-date-end').value;
            if(!s || !e) { alert(getLocalizedString('alert_datepicker_select_dates')); return; }
            if(new Date(e) < new Date(s)) { alert(getLocalizedString('alert_datepicker_end_before_start')); return; }
            const formatDate = d => { const p = d.split('-'); return `${p[1]}/${p[2]}/${p[0]}`; }; 
            const tbsVal = `cdr:1,cd_min:${formatDate(s)},cd_max:${formatDate(e)}`;
            window.location.href = buildNewUrl('tbs', tbsVal, { categoryKey: 'time', tbsValue: tbsVal });
            close();
        };

        overlay.onclick = (e) => { if(e.target === overlay) close(); };
        applyBtn.onclick = doApply;
        picker.addEventListener('keydown', (e) => { if (e.key === 'Enter') doApply(); if (e.key === 'Escape') close(); });
        actions.append(applyBtn); picker.append(row1, row2, actions); overlay.appendChild(picker); document.body.appendChild(overlay);
        setTimeout(() => { const i = document.getElementById('gite-date-start'); if(i) i.focus(); }, 50);
    }

    // Section: Settings Panel Logic
    const CAT_TITLE_MAP = { 'general': 'settings_tab_general', 'exactSize': 'filter_title_exact_size', 'aspectRatio': 'filter_title_aspect_ratio', 'usageRights': 'filter_title_usage_rights', 'fileType': 'filter_title_file_type', 'site': 'filter_title_site_search' };
    function getCatTitleKey(k) { return CAT_TITLE_MAP[k] || `filter_title_${k}`; }

    function renderToggle(id, labelKey, checked) {
        const div = el('div', { className: 'gite-control-row' });
        div.innerHTML = `<div class="gite-control-label" ${GITE_LANG_KEY_ATTR}="${labelKey}">${getLocalizedString(labelKey)}</div><label class="gite-toggle gite-ripple"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}><span class="gite-slider"></span></label>`;
        return div;
    }

    function renderRangeSlider(id, labelKey, value, min, max, step, unit = '') {
        const div = el('div', { className: 'gite-control-row', style: "flex-direction:column; align-items:stretch; border:none; padding: 10px 0;" });
        const topRow = el('div', { style: "display:flex; justify-content:space-between; margin-bottom:5px;" });
        topRow.innerHTML = `<span class="gite-control-label" ${GITE_LANG_KEY_ATTR}="${labelKey}">${getLocalizedString(labelKey)}</span><span id="${id}-display" style="font-weight:bold; font-size:12px;">${value}${unit}</span>`;
        const input = el('input', { type: 'range', id: id, className: 'gite-range-input', min, max, step, value });
        input.addEventListener('input', (e) => {
            document.getElementById(`${id}-display`).textContent = `${e.target.value}${unit}`;
            const tb = document.getElementById(GITE_TOOLBAR_CONTAINER_ID);
            if (tb) tb.style.setProperty(id === 'setting-fontsize' ? '--gite-menu-font-size' : '--gite-menu-line-height', id === 'setting-fontsize' ? `${e.target.value}px` : e.target.value);
        });
        div.append(topRow, input);
        return div;
    }

    function renderCustomList(catKey, listId) {
        const ul = el('ul', { className: 'gite-list', id: listId });
        const items = currentGiteSettingsForPanel.filters[catKey].userDefinedOptions || [];
        const createLi = (opt) => {
            const li = el('li', { className: 'gite-list-item' });
            const checkContainer = el('div', { className: 'gite-item-check' });
            const toggle = el('label', { className: 'gite-toggle', style: 'transform:scale(0.7); width:32px;' });
            const chk = el('input', { type: 'checkbox', checked: opt.isEnabled });
            chk.onchange = (e) => { opt.isEnabled = e.target.checked; };
            toggle.append(chk, el('span', { className: 'gite-slider' }));
            checkContainer.appendChild(toggle);

            const labelDiv = el('div', { className: 'gite-item-label' });
            if (catKey === 'site' && giteSettings.filters.site.showFavicons) {
                if(opt.value.includes(' OR ')) labelDiv.appendChild(el('div', { className: 'gite-tb-icon', innerHTML: GITE_ICONS.globe, style: "width:16px;height:16px;margin-right:8px;vertical-align:middle;display:inline-flex;" }));
                else {
                    const domain = opt.value.split(' ')[0];
                    labelDiv.appendChild(el('img', { src: `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`, style: "width:16px;height:16px;margin-right:8px;vertical-align:middle;border-radius:2px;", onerror: function(){this.style.display='none'} }));
                }
            }
            labelDiv.appendChild(document.createTextNode(opt.label || opt.id));
            const displayValue = (catKey === 'site' && opt.value) ? opt.value.replace(/\s+OR\s+/g, ', ') : opt.value;
            const valDiv = el('div', { className: 'gite-item-value', textContent: displayValue, style: "margin-left:auto; margin-right:10px; color:var(--gite-text-secondary); font-size:0.9em;" });
            const actions = el('div', { className: 'gite-item-actions' });
            const editBtn = el('button', { className: 'gite-icon-btn gite-ripple', title: getLocalizedString('btn_edit_label'), innerHTML: GITE_ICONS.edit });
            editBtn.onclick = () => { const newLabel = prompt(getLocalizedString('btn_edit_label'), opt.label); if (newLabel !== null) { opt.label = newLabel; ul.replaceWith(renderCustomList(catKey, listId)); showToast('alert_label_updated'); } };
            const delBtn = el('button', { className: 'gite-icon-btn danger gite-ripple', title: getLocalizedString('btn_delete'), innerHTML: GITE_ICONS.delete });
            delBtn.onclick = () => { const idx = currentGiteSettingsForPanel.filters[catKey].userDefinedOptions.indexOf(opt); if (idx > -1) { currentGiteSettingsForPanel.filters[catKey].userDefinedOptions.splice(idx, 1); li.remove(); } };
            actions.append(editBtn, delBtn); li.append(checkContainer, labelDiv, valDiv, actions);
            return li;
        };
        if (items.length === 0) ul.innerHTML = `<li style="padding:10px;text-align:center;color:var(--gite-text-secondary);font-size:13px;">${getLocalizedString('settings_no_saved_items_placeholder')}</li>`;
        else items.forEach(item => ul.appendChild(createLi(item)));
        return ul;
    }
	
    function switchTab(tabId) {
        if (!giteSettingsPanelElement) return;
        giteSettingsPanelElement.querySelectorAll('.gite-nav-item').forEach(n => n.classList.toggle('active', n.dataset.tab === tabId));
        const contentArea = document.getElementById('gite-settings-content-area');
        const titleArea = document.getElementById('gite-settings-page-title');
        contentArea.innerHTML = '';

        if (tabId === 'general') {
            titleArea.setAttribute(GITE_LANG_KEY_ATTR, 'settings_tab_general'); titleArea.textContent = getLocalizedString('settings_tab_general');
            
            const langGroup = el('div', { className: 'gite-input-group' });
            langGroup.innerHTML = `<label ${GITE_LANG_KEY_ATTR}="settings_label_language">${getLocalizedString('settings_label_language')}</label>`;
            const langSel = el('select', { className: 'gite-input' });
            ['auto', 'en', 'zh-TW', 'ja', 'de', 'es', 'fr', 'it', 'ru'].forEach(l => {
                const opt = el('option', { value: l, textContent: getLocalizedString(`settings_lang_${l.replace('-', '_')}`) });
                if(l === currentGiteSettingsForPanel.general.selectedLanguage) opt.selected = true;
                langSel.appendChild(opt);
            });
            langSel.onchange = (e) => { 
                const val = e.target.value; currentGiteSettingsForPanel.general.selectedLanguage = val;
                initializeCurrentLanguage(); 
                CURRENT_LANGUAGE = val === 'auto' ? (navigator.language||'en').toLowerCase().split('-')[0] : val; 
                if(val === 'auto') initializeCurrentLanguage();
                updateAllLocalizableElements(giteSettingsPanelElement);
                switchTab('general');
            };
            langGroup.appendChild(langSel);

            const themeGroup = el('div', { className: 'gite-input-group' });
            themeGroup.innerHTML = `<label ${GITE_LANG_KEY_ATTR}="settings_label_theme">${getLocalizedString('settings_label_theme')}</label>`;
            const themeSel = el('select', { className: 'gite-input' });
            ['auto', 'light', 'dark'].forEach(t => {
                const opt = el('option', { value: t, textContent: getLocalizedString(`settings_theme_${t}`) });
                if(t === currentGiteSettingsForPanel.general.themePreference) opt.selected = true;
                themeSel.appendChild(opt);
            });
            themeSel.onchange = (e) => { 
                currentGiteSettingsForPanel.general.themePreference = e.target.value;
                const isDark = e.target.value === 'dark' || (e.target.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('gite-detected-dark-theme', isDark);
            };
            themeGroup.appendChild(themeSel);

            const layoutGroup = el('div', { className: 'gite-input-group' });
            layoutGroup.innerHTML = `<label ${GITE_LANG_KEY_ATTR}="settings_label_toolbar_layout">${getLocalizedString('settings_label_toolbar_layout')}</label>`;
            const layoutSel = el('select', { className: 'gite-input' });
            ['standard', 'sticky'].forEach(s => {
                const opt = el('option', { value: s, textContent: getLocalizedString(`settings_layout_${s}`) });
                if(s === (currentGiteSettingsForPanel.general.toolbarLayout || 'standard')) opt.selected = true;
                layoutSel.appendChild(opt);
            });
            layoutSel.onchange = (e) => currentGiteSettingsForPanel.general.toolbarLayout = e.target.value;
            layoutGroup.appendChild(layoutSel);

            const styleGroup = el('div', { className: 'gite-input-group' });
            styleGroup.innerHTML = `<label ${GITE_LANG_KEY_ATTR}="settings_label_btn_style">${getLocalizedString('settings_label_btn_style')}</label>`;
            const styleSel = el('select', { className: 'gite-input' });
            ['text', 'icon', 'both'].forEach(s => {
                const opt = el('option', { value: s, textContent: getLocalizedString(`settings_btn_style_${s}`) });
                if(s === (currentGiteSettingsForPanel.general.toolbarButtonStyle || 'text')) opt.selected = true;
                styleSel.appendChild(opt);
            });
            styleSel.onchange = (e) => currentGiteSettingsForPanel.general.toolbarButtonStyle = e.target.value;
            styleGroup.appendChild(styleSel);

            const fsSlider = renderRangeSlider('setting-fontsize', 'settings_label_toolbar_font_size', parseFloat(currentGiteSettingsForPanel.general.toolbarFontSize), 8, 24, 0.5);
            fsSlider.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.toolbarFontSize = e.target.value + 'px';
            const lhSlider = renderRangeSlider('setting-lineheight', 'settings_label_toolbar_line_height', parseFloat(currentGiteSettingsForPanel.general.toolbarLineHeight), 0.1, 2.5, 0.1);
            lhSlider.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.toolbarLineHeight = e.target.value;

            const t1 = renderToggle('set-btn-toggle', 'settings_label_showtoolbarbutton', currentGiteSettingsForPanel.general.showSettingsButtonOnToolbar);
            t1.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.showSettingsButtonOnToolbar = e.target.checked;
            const t2 = renderToggle('res-stats-toggle', 'settings_label_showresultstats', currentGiteSettingsForPanel.general.showResultStats);
            t2.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.showResultStats = e.target.checked;
            const t3 = renderToggle('adv-search-toggle', 'settings_label_showadvsearch', currentGiteSettingsForPanel.general.showAdvancedSearchButton);
            t3.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.showAdvancedSearchButton = e.target.checked;
            const t4 = renderToggle('reg-flags-toggle', 'settings_label_showregionflags', currentGiteSettingsForPanel.general.showRegionFlags);
            t4.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.showRegionFlags = e.target.checked;
            
            const t5 = renderToggle('hide-chips-toggle', 'settings_label_hide_chips', currentGiteSettingsForPanel.general.hideNativeChips);
            t5.querySelector('input').onchange = (e) => currentGiteSettingsForPanel.general.hideNativeChips = e.target.checked;

            const footer = el('div', { className: 'gite-category-footer' });
            const rstBtn = el('button', { className: 'gite-btn-reset-cat gite-ripple', innerHTML: `${GITE_ICONS.refresh} <span ${GITE_LANG_KEY_ATTR}="btn_reset_general_settings">${getLocalizedString('btn_reset_general_settings')}</span>` });
            rstBtn.onclick = () => { if(confirm(getLocalizedString('btn_reset_general_settings') + '?')) { currentGiteSettingsForPanel.general = JSON.parse(JSON.stringify(GITE_DEFAULT_SETTINGS.general)); switchTab('general'); showToast('alert_settings_reset_to_default'); detectAndApplyThemeClass(); }};
            footer.appendChild(rstBtn);
            
            contentArea.append(langGroup, themeGroup, layoutGroup, styleGroup, el('hr', {style:'border:0;border-top:1px dashed var(--gite-border);margin:12px 0'}), fsSlider, lhSlider, el('hr', {style:'border:0;border-top:1px dashed var(--gite-border);margin:12px 0'}), t1, t2, t3, t4, t5, footer);
        } else {
            const catKey = tabId;
            const catSettings = currentGiteSettingsForPanel.filters[catKey];
            const titleKey = getCatTitleKey(catKey);
            let localizedTitle = getLocalizedString(titleKey);
            
            titleArea.setAttribute(GITE_LANG_KEY_ATTR, titleKey); titleArea.textContent = localizedTitle;

            const enToggle = el('div', { className: 'gite-control-row' });
            enToggle.innerHTML = `<div class="gite-control-label"><span ${GITE_LANG_KEY_ATTR}="settings_enable_filter_category_prefix">${getLocalizedString('settings_enable_filter_category_prefix')}</span><span ${GITE_LANG_KEY_ATTR}="${titleKey}">${localizedTitle}</span><span ${GITE_LANG_KEY_ATTR}="settings_enable_filter_category_suffix">${getLocalizedString('settings_enable_filter_category_suffix')}</span></div><label class="gite-toggle gite-ripple"><input type="checkbox" id="cat-${catKey}-en" ${catSettings.enabled ? 'checked' : ''}><span class="gite-slider"></span></label>`;
            enToggle.querySelector('input').onchange = (e) => catSettings.enabled = e.target.checked;
            contentArea.appendChild(enToggle);

            if (['size', 'exactSize', 'time'].includes(catKey)) {
                const twoColToggle = renderToggle(`cat-${catKey}-2col`, 'settings_label_layout_two_col', catSettings.useTwoColumnLayout);
                twoColToggle.querySelector('input').onchange = (e) => catSettings.useTwoColumnLayout = e.target.checked;
                contentArea.appendChild(twoColToggle);
            }
            if (['region', 'site'].includes(catKey)) {
                const multiColToggle = renderToggle(`cat-${catKey}-multi`, 'settings_label_layout_multi_col', catSettings.useMultiColumnLayout);
                multiColToggle.querySelector('input').onchange = (e) => catSettings.useMultiColumnLayout = e.target.checked;
                contentArea.appendChild(multiColToggle);
            }
            if (catKey === 'time') {
                const embedToggle = renderToggle('time-embed-date', 'settings_label_embedded_date', catSettings.showEmbeddedDatePicker);
                embedToggle.querySelector('input').onchange = (e) => catSettings.showEmbeddedDatePicker = e.target.checked;
                contentArea.appendChild(embedToggle);
            }
            if (catKey === 'exactSize') {
                const inputToggle = renderToggle('es-input-show', 'settings_label_show_exact_size_inputs_in_menu', catSettings.showInputsInMenu);
                inputToggle.querySelector('input').onchange = (e) => catSettings.showInputsInMenu = e.target.checked;
                contentArea.appendChild(inputToggle);
            }
            if (catKey === 'site') {
                const favToggle = renderToggle('site-fav-show', 'settings_label_showfavicons', catSettings.showFavicons);
                favToggle.querySelector('input').onchange = (e) => catSettings.showFavicons = e.target.checked;
                contentArea.appendChild(favToggle);
            }

            if (catKey === 'exactSize' || catKey === 'site') {
                const sectionTitleKey = catKey === 'site' ? 'settings_section_your_saved_sites' : 'settings_section_your_saved_sizes';
                const sectionTitle = el('h3', { textContent: getLocalizedString(sectionTitleKey) });
                sectionTitle.setAttribute(GITE_LANG_KEY_ATTR, sectionTitleKey);
                const addBox = el('div', { className: 'gite-add-box' });
                if (catKey === 'exactSize') {
                    addBox.innerHTML = `<input type="number" id="new-es-w" class="gite-input" placeholder="${getLocalizedString('exact_size_placeholder_width')}" style="width:90px" ${GITE_LANG_KEY_ATTR}="exact_size_placeholder_width" data-gite-lang-target-attr="placeholder"><input type="number" id="new-es-h" class="gite-input" placeholder="${getLocalizedString('exact_size_placeholder_height')}" style="width:90px" ${GITE_LANG_KEY_ATTR}="exact_size_placeholder_height" data-gite-lang-target-attr="placeholder"><input type="text" id="new-es-l" class="gite-input" placeholder="${getLocalizedString('settings_placeholder_label_optional')}" style="flex:1; min-width:80px" ${GITE_LANG_KEY_ATTR}="settings_placeholder_label_optional" data-gite-lang-target-attr="placeholder"><button class="gite-btn gite-btn-primary" id="btn-add-es" ${GITE_LANG_KEY_ATTR}="btn_add_new_exact_size">${getLocalizedString('btn_add_new_exact_size')}</button>`;
                } else {
                    addBox.innerHTML = `<input type="text" id="new-site-d" class="gite-input" placeholder="${getLocalizedString('settings_placeholder_site_domain')}" style="flex:1" ${GITE_LANG_KEY_ATTR}="settings_placeholder_site_domain" data-gite-lang-target-attr="placeholder"><input type="text" id="new-site-l" class="gite-input" placeholder="${getLocalizedString('settings_placeholder_site_label')}" style="flex:1" ${GITE_LANG_KEY_ATTR}="settings_placeholder_site_label" data-gite-lang-target-attr="placeholder"><button class="gite-btn gite-btn-primary" id="btn-add-site" ${GITE_LANG_KEY_ATTR}="btn_add_new_site">${getLocalizedString('btn_add_new_site')}</button>`;
                }
                contentArea.append(sectionTitle, addBox);
                
                setTimeout(() => {
                    const addBtn = addBox.querySelector('button');
                    if(addBtn) addBtn.onclick = () => {
                        const list = currentGiteSettingsForPanel.filters[catKey].userDefinedOptions;
                        if(catKey === 'exactSize') {
                            const w = document.getElementById('new-es-w').value, h = document.getElementById('new-es-h').value, l = document.getElementById('new-es-l').value;
                            if(!w || !h) { alert(getLocalizedString('alert_exact_size_invalid_input')); return; }
                            if(list.some(i => i.value === `${w}x${h}`)) { alert(getLocalizedString('alert_size_already_saved')); return; }
                            list.push({ id: `user_es_${Date.now()}`, width: w, height: h, value: `${w}x${h}`, label: l || `${w}x${h}`, isEnabled: true, type:'imagesize', isCustom: true });
                        } else {
                            let dInput = document.getElementById('new-site-d').value.trim(), l = document.getElementById('new-site-l').value.trim();
                            if(!dInput) { alert(getLocalizedString('alert_site_domain_empty')); return; }
                            if(!l) { alert(getLocalizedString('alert_site_label_empty')); return; }
                            const d = dInput.replace(/,/g, ' ').split(/\s+/).filter(t => t && t.toLowerCase() !== 'or').join(' OR ');
                            if(list.some(i => i.value === d)) { alert(getLocalizedString('alert_site_already_saved')); return; }
                            list.push({ id: `user_site_${Date.now()}`, value: d, label: l, isEnabled: true, type:'site_filter', isCustom: true });
                        }
                        showToast(catKey === 'site' ? 'alert_site_added' : 'alert_exact_size_added');
                        document.getElementById(`list-${catKey}`)?.replaceWith(renderCustomList(catKey, `list-${catKey}`));
                    };
                }, 0);
                contentArea.appendChild(renderCustomList(catKey, `list-${catKey}`));
            }

            const options = catKey === 'exactSize' ? catSettings.predefinedOptions : catSettings.options;
            if (options && options.length > 0) {
                const gridTitle = el('h3', { textContent: getLocalizedString('settings_section_predefined_options'), style: 'margin-top:20px;' });
                gridTitle.setAttribute(GITE_LANG_KEY_ATTR, 'settings_section_predefined_options');
                const grid = el('div', { className: 'gite-option-grid' });
                options.forEach(opt => {
                    if (opt.type === 'separator') return;
                    const label = opt.customText || getLocalizedString(opt.textKey, CURRENT_LANGUAGE, opt.id);
                    const div = el('label', { className: 'gite-option-check-item gite-ripple' });
                    const chk = el('input', { type: 'checkbox', checked: opt.isEnabled !== false });
                    chk.onchange = (e) => { opt.isEnabled = e.target.checked; };
                    div.appendChild(chk);
                    if (catKey === 'region' && currentGiteSettingsForPanel.general.showRegionFlags && opt.paramName === 'cr') div.appendChild(el('span', { className: 'gite-icon-preview', textContent: getFlagEmoji(opt.id.split('_').pop()) }));
                    if (catKey === 'color' && opt.type === 'palette' && opt.hex) div.appendChild(el('span', { className: 'gite-icon-preview', style: `width:12px;height:12px;background:${opt.hex};border-radius:50%;border:1px solid rgba(0,0,0,0.1);` }));
                    if(opt.textKey && !opt.customText) { const span = el('span', { textContent: ' ' + label }); span.setAttribute(GITE_LANG_KEY_ATTR, opt.textKey); div.appendChild(span); } 
                    else div.appendChild(document.createTextNode(' ' + label));
                    grid.appendChild(div);
                });
                contentArea.append(gridTitle, grid);
            }
            
            const footer = el('div', { className: 'gite-category-footer' });
            const rstBtn = el('button', { className: 'gite-btn-reset-cat gite-ripple' });
            rstBtn.innerHTML = `${GITE_ICONS.refresh}<span><span ${GITE_LANG_KEY_ATTR}="btn_reset_options_for_category_prefix">${getLocalizedString('btn_reset_options_for_category_prefix')}</span><span ${GITE_LANG_KEY_ATTR}="${titleKey}">${localizedTitle}</span><span ${GITE_LANG_KEY_ATTR}="btn_reset_options_for_category_suffix">${getLocalizedString('btn_reset_options_for_category_suffix')}</span></span>`;
            rstBtn.onclick = () => {
                if(confirm(getLocalizedString('btn_reset_options_for_category_prefix') + localizedTitle + getLocalizedString('btn_reset_options_for_category_suffix') + '?')) {
                    const defs = GITE_DEFAULT_SETTINGS.filters[catKey];
                    if (catKey === 'exactSize') { catSettings.predefinedOptions = JSON.parse(JSON.stringify(defs.predefinedOptions)); catSettings.userDefinedOptions = JSON.parse(JSON.stringify(defs.userDefinedOptions)); } 
                    else if (catKey === 'site') catSettings.userDefinedOptions = JSON.parse(JSON.stringify(defs.userDefinedOptions));
                    else catSettings.options = JSON.parse(JSON.stringify(defs.options));
                    switchTab(catKey); showToast('alert_settings_reset_to_default');
                }
            };
            footer.appendChild(rstBtn); contentArea.appendChild(footer);
        }
    }

    function ensureSettingsPanelDOM() {
        if (document.getElementById('gite-settings-panel')) return;
        const panelOverlay = el('div', { id: 'gite-settings-panel', className: 'gite-modal-overlay' });
        const navItems = ['general','size','exactSize','aspectRatio','color','type','time','usageRights','fileType','region','site'].map(k => {
            const iconName = k === 'general' ? 'gear' : (['exactSize','site','fileType','usageRights','aspectRatio'].includes(k) ? k : k);
            const titleKey = getCatTitleKey(k);
            return `<div class="gite-nav-item gite-ripple" data-tab="${k}">${GITE_ICONS[iconName]} <span ${GITE_LANG_KEY_ATTR}="${titleKey}">${getLocalizedString(titleKey)}</span></div>`;
        }).join('');

        panelOverlay.innerHTML = `<div class="gite-panel"><div class="gite-sidebar"><div class="gite-sidebar-header">${GITE_ICONS.gear} <span ${GITE_LANG_KEY_ATTR}="settings_panel_title">${getLocalizedString('settings_panel_title')}</span></div>${navItems}</div><div class="gite-content"><div class="gite-header"><h2 id="gite-settings-page-title"></h2><button class="gite-close-btn gite-ripple" id="gite-settings-close">×</button></div><div class="gite-scroll-area" id="gite-settings-content-area"></div><div class="gite-footer"><button class="gite-btn gite-btn-danger gite-ripple" id="gite-settings-reset" ${GITE_LANG_KEY_ATTR}="btn_reset_all_settings">${getLocalizedString('btn_reset_all_settings')}</button><div class="gite-footer-right"><button class="gite-btn gite-ripple" id="gite-settings-cancel" ${GITE_LANG_KEY_ATTR}="btn_cancel">${getLocalizedString('btn_cancel')}</button><button class="gite-btn gite-btn-primary gite-ripple" id="gite-settings-save" ${GITE_LANG_KEY_ATTR}="btn_save_changes">${getLocalizedString('btn_save_changes')}</button></div></div></div></div>`;
        document.body.appendChild(panelOverlay);

        panelOverlay.querySelector('#gite-settings-close').onclick = closeSettingsPanel;
        panelOverlay.querySelector('#gite-settings-cancel').onclick = closeSettingsPanel;
        panelOverlay.querySelector('#gite-settings-save').onclick = saveSettingsFromPanel;
        panelOverlay.querySelector('#gite-settings-reset').onclick = resetAllSettings;
        panelOverlay.querySelectorAll('.gite-nav-item').forEach(item => item.onclick = () => switchTab(item.dataset.tab));
        panelOverlay.onclick = (e) => { if (e.target === panelOverlay) closeSettingsPanel(); };
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isSettingsPanelOpen) closeSettingsPanel(); });
    }

    function openSettingsPanel() {
        if (!giteSettingsPanelElement) ensureSettingsPanelDOM();
        giteSettingsPanelElement = document.getElementById('gite-settings-panel');
        currentGiteSettingsForPanel = JSON.parse(JSON.stringify(giteSettings));
        giteSettingsPanelElement.classList.add('open');
        isSettingsPanelOpen = true;
        switchTab('general');
    }

    function closeSettingsPanel() {
        if (giteSettingsPanelElement) giteSettingsPanelElement.classList.remove('open');
        isSettingsPanelOpen = false;
        const tb = document.getElementById(GITE_TOOLBAR_CONTAINER_ID);
        if(tb) {
            const fs = giteSettings.general.toolbarFontSize, lh = giteSettings.general.toolbarLineHeight;
            tb.style.setProperty('--gite-menu-font-size', fs.includes('px')?fs:`${fs}px`);
            tb.style.setProperty('--gite-menu-line-height', lh);
        }
        detectAndApplyThemeClass();
    }

    function saveSettingsFromPanel() {
        giteSettings = JSON.parse(JSON.stringify(currentGiteSettingsForPanel));
        GM_setValue(GITE_SETTINGS_GM_KEY, JSON.stringify(giteSettings));
        initializeCurrentLanguage();
        detectAndApplyThemeClass();
        const oldTb = document.getElementById(GITE_TOOLBAR_CONTAINER_ID);
        if(oldTb) oldTb.remove();
        initializeEnhancedFilters(); 
        showToast('alert_settings_saved');
        closeSettingsPanel();
    }

    function resetAllSettings() {
        if (confirm(getLocalizedString('alert_confirm_reset_all_settings'))) {
            giteSettings = JSON.parse(JSON.stringify(GITE_DEFAULT_SETTINGS));
            GM_setValue(GITE_SETTINGS_GM_KEY, JSON.stringify(giteSettings));
            alert(getLocalizedString('alert_settings_reset_to_default') + '\n' + getLocalizedString('gm_please_reload'));
            window.location.reload();
        }
    }

    // Section: Initialization
    function updateResultStats() {
        if (!giteSettings.general.showResultStats) return;
        const target = document.getElementById(GITE_RESULT_STATS_DISPLAY_ID);
        const source = document.getElementById('result-stats');
        if (target && source) { target.textContent = source.textContent; target.style.display = 'inline'; }
    }

    function observeResultStats() {
        if (resultStatsObserver) return;
        resultStatsObserver = new MutationObserver(updateResultStats);
        const source = document.getElementById('result-stats');
        if (source) resultStatsObserver.observe(source, { childList: true, subtree: true, characterData: true });
        new MutationObserver(() => { if (document.getElementById('result-stats')) updateResultStats(); }).observe(document.body, { childList: true });
    }

    function loadSettings() {
        const storedNew = GM_getValue(GITE_SETTINGS_GM_KEY);
        if (storedNew) {
            try {
                const parsed = JSON.parse(storedNew);
                giteSettings = JSON.parse(JSON.stringify(GITE_DEFAULT_SETTINGS));
                if (parsed.general) Object.assign(giteSettings.general, parsed.general);
                for (const key in giteSettings.filters) {
                    if (parsed.filters && parsed.filters[key]) {
                        const target = giteSettings.filters[key];
                        const source = parsed.filters[key];
                        if (source.hasOwnProperty('enabled')) target.enabled = source.enabled;
                        if (source.hasOwnProperty('useTwoColumnLayout')) target.useTwoColumnLayout = source.useTwoColumnLayout;
                        if (source.hasOwnProperty('useMultiColumnLayout')) target.useMultiColumnLayout = source.useMultiColumnLayout;
                        if (source.hasOwnProperty('showEmbeddedDatePicker')) target.showEmbeddedDatePicker = source.showEmbeddedDatePicker;
                        
                        if (source.options) {
                            target.options.forEach(defOpt => {
                                const match = source.options.find(s => s.id === defOpt.id);
                                if (match && match.hasOwnProperty('isEnabled')) defOpt.isEnabled = match.isEnabled;
                            });
                        }
                        if (key === 'exactSize') {
                            if (source.predefinedOptions) target.predefinedOptions.forEach(defOpt => { const match = source.predefinedOptions.find(s => s.id === defOpt.id); if (match && match.hasOwnProperty('isEnabled')) defOpt.isEnabled = match.isEnabled; });
                            if (source.userDefinedOptions) target.userDefinedOptions = source.userDefinedOptions;
                            if (source.hasOwnProperty('showInputsInMenu')) target.showInputsInMenu = source.showInputsInMenu;
                        }
                        if (key === 'site') {
                            if (source.userDefinedOptions) target.userDefinedOptions = source.userDefinedOptions;
                            if (source.hasOwnProperty('showFavicons')) target.showFavicons = source.showFavicons;
                        }
                    }
                }
            } catch (e) { error("Error loading settings:", e); giteSettings = JSON.parse(JSON.stringify(GITE_DEFAULT_SETTINGS)); }
        } else {
            giteSettings = JSON.parse(JSON.stringify(GITE_DEFAULT_SETTINGS));
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
    }

    function main() {
        sanitizeUrlOnLoad();
        loadSettings();
        initializeCurrentLanguage();
        injectStyles();
        detectAndApplyThemeClass();
        
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand(getLocalizedString('gm_menu_gite_settings'), openSettingsPanel);
            GM_registerMenuCommand(getLocalizedString('gm_menu_reset_all_gite_settings'), resetAllSettings);
        }

        const runInit = () => {
            initializeEnhancedFilters();
            observeResultStats();
            if (!menuObserver) {
                const debouncedReInit = debounce(() => { const anchor = document.querySelector(BEFORE_APPBAR_SELECTOR); const tb = document.getElementById(GITE_TOOLBAR_CONTAINER_ID); if (anchor && !tb) initializeEnhancedFilters(); }, 200);
                menuObserver = new MutationObserver(debouncedReInit);
                menuObserver.observe(document.body, { childList: true, subtree: true });
            }
        };

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runInit);
        else runInit();

        window.addEventListener('popstate', () => {
            sanitizeUrlOnLoad();
            const tb = document.getElementById(GITE_TOOLBAR_CONTAINER_ID);
            if(tb) tb.remove();
            initializeEnhancedFilters();
        });

        document.addEventListener('click', (e) => {
            if (currentlyOpenMenuId) {
                const menu = document.getElementById(currentlyOpenMenuId);
                const btnId = currentlyOpenMenuId.replace('-menu', '-btn');
                const btn = document.getElementById(btnId);
                if (e.target.closest('.gite-embedded-picker')) return;
                if ((menu && !menu.contains(e.target)) && (btn && !btn.contains(e.target))) {
                    document.querySelectorAll('.gite-menu-dropdown').forEach(m => m.classList.remove('show'));
                    document.querySelectorAll('.gite-tb-btn').forEach(b => { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
                    currentlyOpenMenuId = null;
                }
            }
        });
    }

    main();

})();