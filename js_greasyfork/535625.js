// ==UserScript==
// @name        Google Search Custom Sidebar - Styles
// @namespace   https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version     0.4.1-styles
// @description Provides CSS styles for the Google Search Custom Sidebar UserScript.
// @author      StonedKhajiit
// @license     MIT
// @grant       none
// ==/UserScript==

/**
 * @file Google Search Custom Sidebar - Styles Provider
 * This script serves as a style provider for the main GSCS userscript.
 * It injects a CSS string into a global namespace object (`window.GSCS_Namespace.stylesText`),
 * which is then read and applied by the main script.
 */
(function() {
    'use strict';

    if (typeof window.GSCS_Namespace === 'undefined') {
        window.GSCS_Namespace = {};
    }

    window.GSCS_Namespace.stylesText = `
        /*
        |--------------------------------------------------------------------------
        | 1. Global Variables & Themes
        |--------------------------------------------------------------------------
        |
        | This section defines all CSS custom properties (variables) for theming.
        | It includes the base light theme, the dark theme override, and minimal theme variations.
        |
        */

        :root {
            /* --- Base Light Theme --- */
            --sidebar-bg-color: #ffffff;
            --sidebar-text-color: #3c4043;
            --sidebar-border-color: #dadce0;
            --sidebar-link-color: #1a0dab;
            --sidebar-link-hover-color: #1a0dab;
            --sidebar-selected-color: #000000;
            --sidebar-section-border-color: #eeeeee;
            --sidebar-tool-btn-bg: #f8f9fa;
            --sidebar-tool-btn-border: #dadce0;
            --sidebar-tool-btn-text: #3c4043;
            --sidebar-tool-btn-hover-bg: #e8eaed;
            --sidebar-tool-btn-hover-border: #bdbdbd;
            --sidebar-tool-btn-hover-text: #3c4043;
            --sidebar-tool-btn-active-bg: #e8f0fe;
            --sidebar-tool-btn-active-text: #1967d2;
            --sidebar-tool-btn-active-border: #aecbfa;
            --sidebar-header-btn-color: #5f6368;
            --sidebar-header-btn-hover-color: #1a0dab;
            --sidebar-header-btn-active-bg: #e8f0fe;
            --sidebar-header-btn-active-color: #1967d2;
            --sidebar-input-bg: #ffffff;
            --sidebar-input-text: #202124;
            --sidebar-input-border: #ccc;
            --sidebar-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
            --sidebar-scrollbar-thumb-color: #a0a0a0;
            --sidebar-scrollbar-track-color: #f0f0f0;
            --sidebar-scrollbar-thumb-hover-color: #777777;

            /* Settings & Modal Variables (Light) */
            --settings-bg-color: #ffffff;
            --settings-text-color: #3c4043;
            --settings-border-color: #eeeeee;
            --settings-header-text-color: #3c4043;
            --settings-close-btn-color: #777777;
            --settings-close-btn-hover-color: #333333;
            --settings-tab-color: #5f6368;
            --settings-tab-active-color: #1a0dab;
            --settings-tab-active-border: #1a0dab;
            --settings-input-bg: #ffffff;
            --settings-input-text: #202124;
            --settings-input-border: #ccc;
            --settings-list-border: #eeeeee;
            --settings-list-item-border: #e0e0e0;
            --settings-list-btn-bg: #f8f8f8;
            --settings-list-btn-hover-bg: #eeeeee;
            --settings-add-btn-bg: #4285f4;
            --settings-add-btn-text: white;
            --settings-add-btn-hover-bg: #3367d6;
            --settings-save-btn-bg: #1a73e8;
            --settings-save-btn-text: white;
            --settings-save-btn-border: #1a73e8;
            --settings-save-btn-hover-bg: #1565c0;
            --settings-cancel-btn-bg: #ffffff;
            --settings-cancel-btn-text: #3c4043;
            --settings-cancel-btn-hover-bg: #f8f9fa;
            --settings-reset-btn-bg: #f8d7da;
            --settings-reset-btn-text: #721c24;
            --settings-reset-btn-border: #f5c6cb;
            --settings-reset-btn-hover-bg: #f5c6cb;
            --settings-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

            /* Message & Notification Variables (Light) */
            --gscs-msg-info-bg: #e7f3fe; --gscs-msg-info-text: #004085; --gscs-msg-info-border: #b8daff;
            --gscs-msg-success-bg: #d4edda; --gscs-msg-success-text: #155724; --gscs-msg-success-border: #c3e6cb;
            --gscs-msg-warning-bg: #fff3cd; --gscs-msg-warning-text: #856404; --gscs-msg-warning-border: #ffeeba;
            --gscs-msg-error-bg: #f8d7da; --gscs-msg-error-text: #721c24; --gscs-msg-error-border: #f5c6cb;
            --gscs-ntf-info-bg: var(--gscs-msg-info-bg); --gscs-ntf-info-text: var(--gscs-msg-info-text); --gscs-ntf-info-border: var(--gscs-msg-info-border);
            --gscs-ntf-success-bg: var(--gscs-msg-success-bg); --gscs-ntf-success-text: var(--gscs-msg-success-text); --gscs-ntf-success-border: var(--gscs-msg-success-border);
            --gscs-ntf-warning-bg: var(--gscs-msg-warning-bg); --gscs-ntf-warning-text: var(--gscs-msg-warning-text); --gscs-ntf-warning-border: var(--gscs-msg-warning-border);
            --gscs-ntf-error-bg: var(--gscs-msg-error-bg); --gscs-ntf-error-text: var(--gscs-msg-error-text); --gscs-ntf-error-border: var(--gscs-msg-error-border);
        }

        :root .gscs-theme-dark {
            /* --- Dark Theme Override --- */
            --sidebar-bg-color: #202124;
            --sidebar-text-color: #bdc1c6;
            --sidebar-border-color: #5f6368;
            --sidebar-link-color: #8ab4f8;
            --sidebar-link-hover-color: #8ab4f8;
            --sidebar-selected-color: #e8eaed;
            --sidebar-section-border-color: #3c4043;
            --sidebar-tool-btn-bg: #303134;
            --sidebar-tool-btn-border: #5f6368;
            --sidebar-tool-btn-text: #8ab4f8;
            --sidebar-tool-btn-hover-bg: #3c4043;
            --sidebar-tool-btn-hover-border: #5f6368;
            --sidebar-tool-btn-hover-text: #bdc1c6;
            --sidebar-tool-btn-active-bg: #8ab4f8;
            --sidebar-tool-btn-active-text: #202124;
            --sidebar-tool-btn-active-border: #8ab4f8;
            --sidebar-header-btn-color: #bdc1c6;
            --sidebar-header-btn-hover-color: #8ab4f8;
            --sidebar-header-btn-active-bg: #8ab4f8;
            --sidebar-header-btn-active-color: #202124;
            --sidebar-input-bg: #303134;
            --sidebar-input-text: #e8eaed;
            --sidebar-input-border: #5f6368;
            --sidebar-shadow: 0 2px 5px 0 rgba(0,0,0,0.3), 0 2px 10px 0 rgba(0,0,0,0.24);
            --sidebar-scrollbar-thumb-color: #5f6368;
            --sidebar-scrollbar-track-color: var(--sidebar-bg-color);
            --sidebar-scrollbar-thumb-hover-color: #7a7f83;

            /* Settings & Modal Variables (Dark) */
            --settings-bg-color: #202124;
            --settings-text-color: #bdc1c6;
            --settings-border-color: #3c4043;
            --settings-header-text-color: #e8eaed;
            --settings-close-btn-color: #bdc1c6;
            --settings-close-btn-hover-color: #e8eaed;
            --settings-tab-color: #bdc1c6;
            --settings-tab-active-color: #8ab4f8;
            --settings-tab-active-border: #8ab4f8;
            --settings-input-bg: #303134;
            --settings-input-text: #e8eaed;
            --settings-input-border: #5f6368;
            --settings-list-border: #3c4043;
            --settings-list-item-border: #4a4e52;
            --settings-list-btn-bg: #303134;
            --settings-list-btn-hover-bg: #5f6368;
            --settings-add-btn-bg: #8ab4f8;
            --settings-add-btn-text: #202124;
            --settings-add-btn-hover-bg: #669df6;
            --settings-save-btn-bg: #8ab4f8;
            --settings-save-btn-text: #202124;
            --settings-save-btn-border: #8ab4f8;
            --settings-save-btn-hover-bg: #669df6;
            --settings-cancel-btn-bg: #303134;
            --settings-cancel-btn-text: #e8eaed;
            --settings-cancel-btn-hover-bg: #5f6368;
            --settings-reset-btn-bg: #f28b82;
            --settings-reset-btn-text: #202124;
            --settings-reset-btn-border: #f28b82;
            --settings-reset-btn-hover-bg: #e66a61;
            --settings-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);

            /* Message & Notification Variables (Dark) */
            --gscs-msg-info-bg: #2c3e50; --gscs-msg-info-text: #8ab4f8; --gscs-msg-info-border: #34495e;
            --gscs-msg-success-bg: #274b34; --gscs-msg-success-text: #a8dba8; --gscs-msg-success-border: #2e7d32;
            --gscs-msg-warning-bg: #533f03; --gscs-msg-warning-text: #fdd835; --gscs-msg-warning-border: #7b5e03;
            --gscs-msg-error-bg: #5f2120; --gscs-msg-error-text: #f5c6cb; --gscs-msg-error-border: #8d2626;
            --gscs-ntf-info-bg: var(--gscs-msg-info-bg); --gscs-ntf-info-text: var(--gscs-msg-info-text); --gscs-ntf-info-border: var(--gscs-msg-info-border);
            --gscs-ntf-success-bg: var(--gscs-msg-success-bg); --gscs-ntf-success-text: var(--gscs-msg-success-text); --gscs-ntf-success-border: var(--gscs-msg-success-border);
            --gscs-ntf-warning-bg: var(--gscs-msg-warning-bg); --gscs-ntf-warning-text: var(--gscs-msg-warning-text); --gscs-ntf-warning-border: var(--gscs-msg-warning-border);
            --gscs-ntf-error-bg: var(--gscs-msg-error-bg); --gscs-ntf-error-text: var(--gscs-msg-error-text); --gscs-ntf-error-border: var(--gscs-msg-error-border);
        }

        /* --- Minimal Theme Variations --- */
        #gscs-sidebar.gscs-theme-minimal { background-color: transparent !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 5px 10px !important; }
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--light { --sidebar-text-color: #3c4043; --sidebar-link-color: #1a0dab; --sidebar-link-hover-color: #1a0dab; --sidebar-selected-color: #000000; --sidebar-section-border-color: #ebebeb; --sidebar-header-btn-color: #5f6368; --sidebar-header-btn-hover-color: #1a0dab; --sidebar-input-bg: rgba(255, 255, 255, 0.8); --sidebar-input-text: #202124; --sidebar-input-border: #dadce0; --sidebar-tool-btn-bg: transparent; --sidebar-tool-btn-border: #dadce0; --sidebar-tool-btn-text: #1a0dab; --sidebar-tool-btn-hover-bg: rgba(0, 0, 0, 0.05); --sidebar-tool-btn-hover-border: #dadce0; --sidebar-tool-btn-hover-text: #1a0dab; --sidebar-tool-btn-active-bg: rgba(26, 115, 232, 0.1); --sidebar-tool-btn-active-text: #1967d2; --sidebar-tool-btn-active-border: #aecbfa; --sidebar-scrollbar-thumb-color: #bababa; --sidebar-scrollbar-track-color: rgba(0,0,0,0.05); --sidebar-scrollbar-thumb-hover-color: #888888;}
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--light .gscs-section__title { color: var(--sidebar-link-color); }
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--light .gscs-date-input__field::-webkit-calendar-picker-indicator { filter: none; }
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--dark { --sidebar-text-color: #bdc1c6; --sidebar-link-color: #8ab4f8; --sidebar-link-hover-color: #8ab4f8; --sidebar-selected-color: #e8eaed; --sidebar-section-border-color: #4a4a4a; --sidebar-header-btn-color: #bdc1c6; --sidebar-header-btn-hover-color: #8ab4f8; --sidebar-input-bg: rgba(48, 49, 52, 0.8); --sidebar-input-text: #e8eaed; --sidebar-input-border: #5f6368; --sidebar-tool-btn-bg: transparent; --sidebar-tool-btn-border: #5f6368; --sidebar-tool-btn-text: #8ab4f8; --sidebar-tool-btn-hover-bg: rgba(255, 255, 255, 0.08); --sidebar-tool-btn-hover-border: #5f6368; --sidebar-tool-btn-hover-text: #8ab4f8; --sidebar-tool-btn-active-bg: rgba(138, 180, 248, 0.15); --sidebar-tool-btn-active-text: #8ab4f8; --sidebar-tool-btn-active-border: #8ab4f8; --sidebar-scrollbar-thumb-color: #55595d; --sidebar-scrollbar-track-color: rgba(255,255,255,0.08); --sidebar-scrollbar-thumb-hover-color: #6b6f73;}
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--dark .gscs-section__title { color: var(--sidebar-link-color); }
        #gscs-sidebar.gscs-theme-minimal.gscs-theme-minimal--dark .gscs-date-input__field::-webkit-calendar-picker-indicator { filter: invert(1) brightness(0.9); }
        #gscs-sidebar.gscs-theme-minimal .gscs-sidebar__header { border-bottom-color: transparent !important; }
        #gscs-sidebar.gscs-theme-minimal #gscs-sidebar-fixed-top-buttons { background-color: transparent !important; border-bottom-color: var(--sidebar-section-border-color) !important; }
        #gscs-sidebar.gscs-theme-minimal .gscs-section__title::before { color: var(--sidebar-text-color); }
        #gscs-sidebar.gscs-theme-minimal .gscs-date-input__field { background-color: var(--sidebar-input-bg) !important; border: 1px solid var(--sidebar-input-border) !important; color: var(--sidebar-input-text) !important; }

        /*
        |--------------------------------------------------------------------------
        | 2. Core Sidebar Layout
        |--------------------------------------------------------------------------
        */

        #gscs-sidebar { position: fixed; background-color: var(--sidebar-bg-color); border: 1px solid var(--sidebar-border-color); padding: 0 10px 0; z-index: 1001; color: var(--sidebar-text-color); box-shadow: var(--sidebar-shadow); border-radius: 8px; overflow: hidden; max-height: var(--sidebar-max-height, 85vh); cursor: default; display: flex; flex-direction: column; opacity: 1; transition: opacity 0.3s ease, width 0.3s ease, transform 0.3s ease, padding 0.3s ease; font-size: var(--sidebar-font-base-size); }
        #gscs-sidebar *, #gscs-settings-window *, .settings-modal-content * { box-sizing: border-box; }
        #gscs-sidebar .gscs-sidebar__header { display: flex; justify-content: space-between; align-items: center; min-height: calc(var(--sidebar-header-icon-base-size) * 1.15 + 10px); height: auto; margin: 0 -10px; padding: 5px 5px; flex-shrink: 0; user-select: none; border-bottom: 1px solid var(--sidebar-section-border-color); flex-wrap: wrap; }
        #gscs-sidebar .gscs-sidebar__content-wrapper { flex-grow: 1; overflow-y: auto; overflow-x: hidden; position: relative; padding: calc(5px * var(--sidebar-spacing-multiplier)) 5px calc(10px * var(--sidebar-spacing-multiplier)) 0; scrollbar-gutter: stable; }

        /* --- Collapsed State --- */
        #gscs-sidebar.is-sidebar-collapsed { width: 40px !important; padding: 5px !important; overflow: hidden; }
        #gscs-sidebar.is-sidebar-collapsed .gscs-sidebar__header { margin-bottom: 0; padding: 0; justify-content: center; height: 100%; flex-direction: column; align-items: center; border-bottom: none; gap: 0.5em; }
        #gscs-sidebar.is-sidebar-collapsed #gscs-sidebar-fixed-top-buttons, #gscs-sidebar.is-sidebar-collapsed .gscs-sidebar__content-wrapper, #gscs-sidebar.is-sidebar-collapsed .gscs-sidebar__drag-handle { display: none !important; }
        #gscs-sidebar.is-sidebar-collapsed .gscs-sidebar__header > * { margin: 0 !important; }
        #gscs-sidebar.is-sidebar-collapsed #gscs-sidebar-collapse-button { order: 0; }

        /* --- Scrollbar --- */
        #gscs-sidebar .gscs-sidebar__content-wrapper { scrollbar-width: thin; scrollbar-color: var(--sidebar-scrollbar-thumb-color) var(--sidebar-scrollbar-track-color); }
        #gscs-sidebar .gscs-sidebar__content-wrapper::-webkit-scrollbar { width: 6px; height: 6px; }
        #gscs-sidebar .gscs-sidebar__content-wrapper::-webkit-scrollbar-track { background: var(--sidebar-scrollbar-track-color); border-radius: 3px; }
        #gscs-sidebar .gscs-sidebar__content-wrapper::-webkit-scrollbar-thumb { background-color: var(--sidebar-scrollbar-thumb-color); border-radius: 3px; }
        #gscs-sidebar .gscs-sidebar__content-wrapper::-webkit-scrollbar-thumb:hover { background-color: var(--sidebar-scrollbar-thumb-hover-color); }
        #gscs-sidebar.scrollbar-left .gscs-sidebar__content-wrapper { direction: rtl; }
        #gscs-sidebar.scrollbar-left .gscs-section { direction: ltr; }
        #gscs-sidebar.scrollbar-hidden .gscs-sidebar__content-wrapper::-webkit-scrollbar { display: none; }
        #gscs-sidebar.scrollbar-hidden .gscs-sidebar__content-wrapper { scrollbar-width: none; }


        /*
        |--------------------------------------------------------------------------
        | 3. Sidebar Components
        |--------------------------------------------------------------------------
        */

        /* --- Header Buttons & Drag Handle --- */
        #gscs-sidebar #gscs-sidebar-collapse-button, #gscs-sidebar .gscs-settings-button, #gscs-sidebar .gscs-header-button { background: none; border: none; cursor: pointer; padding: 0; color: var(--sidebar-header-btn-color); font-size: var(--sidebar-header-icon-base-size); width: calc(var(--sidebar-header-icon-base-size) * 1.15); height: calc(var(--sidebar-header-icon-base-size) * 1.15); line-height: calc(var(--sidebar-header-icon-base-size) * 1.15); flex-shrink: 0; text-align: center; margin: 0 0.2em; display: inline-flex; align-items: center; justify-content: center; box-sizing: content-box; }
        #gscs-sidebar .gscs-sidebar__header a.gscs-header-button { text-decoration: none; display: inline-flex; align-items: center; justify-content: center; padding: 0; width: calc(var(--sidebar-header-icon-base-size) * 1.15); height: calc(var(--sidebar-header-icon-base-size) * 1.15); color: var(--sidebar-header-btn-color); box-sizing: content-box; margin: 0 0.2em; }
        #gscs-sidebar .gscs-sidebar__header a.gscs-header-button svg { width: var(--sidebar-header-icon-base-size); height: var(--sidebar-header-icon-base-size); flex-shrink: 0; }
        #gscs-sidebar #gscs-sidebar-collapse-button { order: -1; margin-right: 0.3em;}
        #gscs-sidebar .gscs-settings-button { margin-left: 0.3em; }
        #gscs-sidebar #gscs-sidebar-collapse-button:hover, #gscs-sidebar .gscs-settings-button:hover, #gscs-sidebar .gscs-header-button:hover, #gscs-sidebar .gscs-sidebar__header a.gscs-header-button:hover { color: var(--sidebar-header-btn-hover-color); }
        #gscs-sidebar .gscs-header-button.is-active { background-color: var(--sidebar-header-btn-active-bg); color: var(--sidebar-header-btn-active-color); border-radius: 3px; }
        #gscs-sidebar .gscs-header-button#gscs-tool-personalize-search.is-active svg { stroke: var(--sidebar-header-btn-active-color); }
        #gscs-sidebar .gscs-sidebar__drag-handle { flex-grow: 1; height: 100%; min-height: calc(var(--sidebar-header-icon-base-size) * 1.15); cursor: move; min-width: 20px; }
        #gscs-sidebar .gscs-sidebar__drag-handle:active { cursor: grabbing; }

        /* --- Top Block & Result Stats --- */
        #gscs-sidebar #gscs-sidebar-fixed-top-buttons { padding: calc(10px * var(--sidebar-spacing-multiplier)) 10px calc(5px * var(--sidebar-spacing-multiplier)) 10px; border-bottom: 1px solid var(--sidebar-section-border-color); flex-shrink: 0; background-color: var(--sidebar-bg-color); margin: 0 -10px calc(5px * var(--sidebar-spacing-multiplier)) -10px; }
        #gscs-sidebar #gscs-sidebar-fixed-top-buttons:empty { display: none; padding: 0; border: none; margin: 0; }
        #gscs-sidebar .gscs-fixed-top-buttons__item { margin-bottom: calc(5px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar .gscs-fixed-top-buttons__item:last-child { margin-bottom: 0; }
        #gscs-sidebar #gscs-result-stats-container { padding: 0 10px; margin: 0 -10px 5px -10px; border-bottom: 1px solid var(--sidebar-section-border-color); text-align: center;}
        #gscs-sidebar #gscs-result-stats-container:empty { display: none; }
        #gscs-sidebar #gscs-result-stats-display { font-size: 1em; color: var(--sidebar-text-color); opacity: 1; padding: calc(3px * var(--sidebar-spacing-multiplier)) 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}

        /* --- Sections & Filter Options --- */
        #gscs-sidebar .gscs-section { margin-bottom: calc(15px * var(--sidebar-spacing-multiplier)); padding-bottom: calc(10px * var(--sidebar-spacing-multiplier)); border-bottom: 1px solid var(--sidebar-section-border-color); display: flex; flex-direction: column; }
        #gscs-sidebar .gscs-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        #gscs-sidebar .gscs-section__title { font-weight: bold; margin-bottom: calc(8px * var(--sidebar-spacing-multiplier)); cursor: pointer; color: var(--sidebar-link-color); white-space: nowrap; user-select: none; display: flex; align-items: center; position: relative; }
        #gscs-sidebar .gscs-section__title::before { content: '▼'; font-size: 0.7em; margin-right: 4px; display: inline-block; transition: transform 0.2s ease-in-out; }
        #gscs-sidebar .gscs-section__title.is-section-collapsed::before { transform: rotate(-90deg); }
        #gscs-sidebar .gscs-section__content { margin-left: 5px; overflow: hidden; transition: max-height 0.3s ease-out, visibility 0.3s ease-out, opacity 0.3s ease-in-out; max-height: 1000px; visibility: visible; opacity: 1; }
        #gscs-sidebar .gscs-section__content.is-section-collapsed { max-height: 0; visibility: hidden; opacity: 0; margin-top: calc(-8px * var(--sidebar-spacing-multiplier)); padding-bottom: 0; }
        #gscs-sidebar .gscs-filter-option { display: block; margin-bottom: calc(5px * var(--sidebar-spacing-multiplier)); color: var(--sidebar-text-color); text-decoration: none; cursor: pointer; padding: calc(2px * var(--sidebar-spacing-multiplier)) 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1em; }
        #gscs-sidebar .gscs-filter-option:hover { text-decoration: underline; color: var(--sidebar-link-hover-color); }
        #gscs-sidebar .gscs-filter-option.is-selected { font-weight: bold; color: var(--sidebar-selected-color); }
        #gscs-sidebar .gscs-custom-list { list-style: none; padding: 0; margin: 0; }

        /* --- Generic Button --- */
        #gscs-sidebar .gscs-button { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 0.4em 0.6em; margin-bottom: calc(5px * var(--sidebar-spacing-multiplier)); text-align: center; cursor: pointer; font-size: 0.9em; text-decoration: none; border-radius: 4px; background-color: var(--sidebar-tool-btn-bg); border: 1px solid var(--sidebar-tool-btn-border); color: var(--sidebar-tool-btn-text); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; box-sizing: border-box; }
        #gscs-sidebar .gscs-button:hover { background-color: var(--sidebar-tool-btn-hover-bg); border-color: var(--sidebar-tool-btn-hover-border); color: var(--sidebar-tool-btn-hover-text, var(--sidebar-tool-btn-text)); }
        #gscs-sidebar .gscs-button.is-active { background-color: var(--sidebar-tool-btn-active-bg); color: var(--sidebar-tool-btn-active-text); border-color: var(--sidebar-tool-btn-active-border); font-weight: bold; }
        #gscs-sidebar .gscs-button#gscs-tool-personalize-search.is-active svg { stroke: var(--sidebar-tool-btn-active-text); }
        #gscs-sidebar .gscs-button svg { flex-shrink: 0; margin-right: 0.4em; width: 0.9em; height: 0.9em; vertical-align: middle; }
        #gscs-sidebar .gscs-button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }

        /*
        |--------------------------------------------------------------------------
        | 4. Component-Specific Styles
        |--------------------------------------------------------------------------
        */

        /* --- Site Search Section --- */
        #gscs-sidebar #sidebar-section-site-search .gscs-section__content > .gscs-filter-option:first-child { margin-bottom: calc(8px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list li { display: flex; align-items: center; padding: 0; margin: 0; }
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list li:not(:last-child) { margin-bottom: calc(3px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list.checkbox-mode-enabled li { display: flex; align-items: center; }
        #gscs-sidebar #sidebar-section-site-search .gscs-checkbox--site { margin-right: 0.5em; flex-shrink: 0; vertical-align: middle;}
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list.checkbox-mode-enabled label { cursor: pointer; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; color: var(--sidebar-text-color); }
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list.checkbox-mode-enabled label:hover { text-decoration: underline; color: var(--sidebar-link-hover-color); }
        #gscs-sidebar #sidebar-section-site-search .gscs-custom-list.checkbox-mode-enabled label.is-selected { font-weight: bold; color: var(--sidebar-selected-color); }
        #gscs-sidebar #sidebar-section-site-search .gscs-filter-option:not(#gscs-clear-site-search-option) { margin-bottom: calc(3px * var(--sidebar-spacing-multiplier)); flex-grow: 1; }
        #gscs-sidebar #sidebar-section-site-search .gscs-button--apply-sites { margin-top: calc(8px * var(--sidebar-spacing-multiplier)); width: 100%; }

        /* --- Filetype Section --- */
        #gscs-sidebar #sidebar-section-filetype .gscs-section__content > .gscs-filter-option:first-child { margin-bottom: calc(8px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list li { padding: 0; margin: 0; }
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list li:not(:last-child) { margin-bottom: calc(3px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list.checkbox-mode-enabled li { display: flex; align-items: center; }
        #gscs-sidebar #sidebar-section-filetype .gscs-checkbox--filetype { margin-right: 0.5em; flex-shrink: 0; vertical-align: middle;}
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list.checkbox-mode-enabled label { cursor: pointer; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; color: var(--sidebar-text-color); }
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list.checkbox-mode-enabled label:hover { text-decoration: underline; color: var(--sidebar-link-hover-color); }
        #gscs-sidebar #sidebar-section-filetype .gscs-custom-list.checkbox-mode-enabled label.is-selected { font-weight: bold; color: var(--sidebar-selected-color); }
        #gscs-sidebar #sidebar-section-filetype .gscs-filter-option:not(#gscs-clear-filetype-search-option) { margin-bottom: calc(3px * var(--sidebar-spacing-multiplier)); }
        #gscs-sidebar #sidebar-section-filetype .gscs-button--apply-filetypes { margin-top: calc(8px * var(--sidebar-spacing-multiplier)); width: 100%; }

        /* --- Country Section --- */
        #gscs-sidebar .gscs-filter-option .country-icon-container { display: inline-block; width: 1.8em; text-align: center; margin-right: 0.4em; vertical-align: text-bottom; }
        #gscs-sidebar .gscs-filter-option .country-icon-container > svg { vertical-align: middle; max-height: 1em; }

        /* --- Date Range Section --- */
        #gscs-sidebar .gscs-date-input__label { display: block; margin-bottom: calc(2px * var(--sidebar-spacing-multiplier)); font-size: 0.85em; }
        #gscs-sidebar .gscs-date-input__field { display: block; margin-bottom: calc(5px * var(--sidebar-spacing-multiplier)); width: calc(100% - 10px); padding: 0.3em; font-size: 0.9em; border: 1px solid var(--sidebar-input-border); background-color: var(--sidebar-input-bg); color: var(--sidebar-input-text); border-radius: 4px; }
        #gscs-sidebar .gscs-date-range-error-message { display: none; font-size: 0.85em; color: #dc3545; margin-top: 0.3em; margin-bottom: 0.5em; text-align: left; }
        #gscs-sidebar .gscs-date-range-error-message.is-error-visible { display: block; }
        #gscs-sidebar .gscs-setting-value-hint { font-size: 0.85em; color: var(--settings-tab-color); font-weight: normal; margin-left: 0; }
        .gscs-favicon { width: 1em; height: 1em; margin-right: 0.4em; vertical-align: middle; flex-shrink: 0; }

        /*
        |--------------------------------------------------------------------------
        | 5. Settings Window & Overlay
        |--------------------------------------------------------------------------
        */

        #gscs-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: none; justify-content: center; align-items: center; background-color: rgba(0,0,0,0.4); z-index: 1000; pointer-events: auto; }
        #gscs-settings-window { background-color: var(--settings-bg-color); border: 1px solid var(--settings-border-color); padding: 20px; border-radius: 8px; box-shadow: var(--settings-shadow); width: 450px; max-width: 90%; max-height: 80vh; overflow-y: auto; font-size: 14px; color: var(--settings-text-color); position: relative; z-index: 2000; pointer-events: auto; display: flex; flex-direction: column; }
        #gscs-settings-window .gscs-settings__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--settings-border-color); flex-shrink: 0; }
        #gscs-settings-window .gscs-settings__header h3 { margin: 0; font-size: 1.2em; font-weight: bold; color: var(--settings-header-text-color); }
        #gscs-settings-window .gscs-settings__close-button { font-size: 1.5em; cursor: pointer; border: none; background: none; padding: 0; color: var(--settings-close-btn-color); line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
        #gscs-settings-window .gscs-settings__close-button svg { width: 1.1em; height: 1.1em; }
        #gscs-settings-window .gscs-settings__close-button:hover { color: var(--settings-close-btn-hover-color); }
        #gscs-settings-window .gscs-settings__tabs { display: flex; border-bottom: 1px solid var(--settings-border-color); margin-bottom: 15px; flex-wrap: wrap; flex-shrink: 0; }
        #gscs-settings-window .gscs-tab-button { padding: 0.7em 1em; cursor: pointer; border: none; background: none; font-size: 1em; color: var(--settings-tab-color); border-bottom: 2px solid transparent; margin-right: 10px; margin-bottom: -1px; white-space: nowrap; }
        #gscs-settings-window .gscs-tab-button.is-active { color: var(--settings-tab-active-color); font-weight: bold; border-bottom-color: var(--settings-tab-active-border); }
        #gscs-settings-window .gscs-settings__tab-content { flex-grow: 1; overflow-y: auto; }
        #gscs-settings-window .gscs-settings__tab-content .gscs-tab-pane { display: none; animation: fadeIn 0.3s ease-in-out; }
        #gscs-settings-window .gscs-settings__tab-content .gscs-tab-pane.is-active { display: block; }
        #gscs-settings-window .gscs-settings__footer { display: flex; justify-content: flex-end; align-items: center; padding-top: 1em; border-top: 1px solid var(--settings-border-color); margin-top: 1.2em; gap: 0.7em; flex-shrink: 0; }
        #gscs-settings-window .gscs-settings__footer button { padding: 0.6em 1em; border-radius: 4px; cursor: pointer; font-size: 1em; }
        #gscs-settings-window .gscs-settings__footer .gscs-button--save { background-color: var(--settings-save-btn-bg); color: var(--settings-save-btn-text); border: 1px solid var(--settings-save-btn-border); }
        #gscs-settings-window .gscs-settings__footer .gscs-button--save:hover { background-color: var(--settings-save-btn-hover-bg); }
        #gscs-settings-window .gscs-settings__footer .gscs-button--cancel { background-color: var(--settings-cancel-btn-bg); color: var(--settings-cancel-btn-text); border: 1px solid var(--settings-input-border); }
        #gscs-settings-window .gscs-settings__footer .gscs-button--cancel:hover { background-color: var(--settings-cancel-btn-hover-bg); }
        #gscs-settings-window .gscs-settings__footer .gscs-button--reset { background-color: var(--settings-reset-btn-bg); color: var(--settings-reset-btn-text); border: 1px solid var(--settings-reset-btn-border); margin-right: auto; }
        #gscs-settings-window .gscs-settings__footer .gscs-button--reset:hover { background-color: var(--settings-reset-btn-hover-bg); }

        /*
        |--------------------------------------------------------------------------
        | 6. Settings Window Components
        |--------------------------------------------------------------------------
        */

        #gscs-settings-window .gscs-setting-item { margin-bottom: 1em; padding-bottom: 1em; border-bottom: 1px solid var(--settings-border-color); }
        #gscs-settings-window .gscs-setting-item:last-child { border-bottom: none; padding-bottom: 0; }
        #gscs-settings-window .gscs-setting-item label:not(.gscs-setting-item__label--inline) { display: block; font-weight: bold; margin-bottom: 0.4em; }
        #gscs-settings-window .gscs-setting-item label.gscs-setting-item__label--inline { display: inline-block; margin-bottom: 0; margin-left: 0.4em; font-weight: normal; vertical-align: middle; }
        #gscs-settings-window .gscs-setting-item input[type="text"]:not([id^="gscs-new-"]), #gscs-settings-window .gscs-setting-item select { width: 100%; padding: 0.6em; border: 1px solid var(--settings-input-border); border-radius: 4px; font-size: 0.9em; background-color: var(--settings-input-bg); color: var(--settings-input-text); margin-top: 0.2em; }
        #gscs-settings-window .gscs-setting-item input[type="checkbox"] { margin-right: 0.4em; vertical-align: middle; }
        #gscs-settings-window .gscs-setting-item--simple { margin-bottom: 0.4em; padding-bottom: 0.4em; border-bottom: none; }
        #gscs-settings-window .gscs-setting-item .gscs-setting-value-hint { font-size: 0.85em; color: var(--settings-tab-color); font-weight: normal; margin-left: 0; }
        input.has-error { border-color: #dc3545 !important; }

        /* --- Sliders in Appearance Tab --- */
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0.5em; }
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item > label:first-child { width: 100%; }
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item .gscs-setting-item__range-hint { width: 100%; order: 1; font-size: 0.85em; color: var(--settings-tab-color); font-weight: normal; margin-left: 0; }
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item input[type="range"] { flex-grow: 1; order: 2; padding: 0; height: auto; cursor: pointer; vertical-align: middle; min-width: 150px; margin-top: 0.2em; }
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item .gscs-setting-item__range-value { order: 3; margin-left: 0.5em; font-size: 0.9em; color: var(--settings-tab-color); min-width: 3em; text-align: right; flex-shrink: 0; vertical-align: middle; line-height: 1.8; }
        #gscs-settings-window #gscs-tab-pane-appearance .gscs-setting-item > div { transition: opacity 0.3s ease; }

        /* --- Section Order List in Features Tab --- */
        .gscs-drag-icon { display: inline-flex; align-items: center; justify-content: center; width: 1.5em; height: 1.5em; margin-right: 0.5em; color: var(--settings-tab-color); cursor: grab; flex-shrink: 0; }
        .gscs-drag-icon svg { width: 1em; height: 1em; }
        .gscs-section-order-list { list-style: none; padding: 0; margin-top: 0.5em; border: 1px solid var(--settings-border-color); border-radius: 4px; max-height: 250px; overflow-y: auto; }
        .gscs-section-order-list li { display: flex; align-items: center; padding: 0.6em 0.8em; border-bottom: 1px dashed var(--settings-list-item-border); background-color: var(--settings-input-bg); }
        .gscs-section-order-list li:last-child { border-bottom: none; }
        .gscs-section-order-list li .gscs-drag-icon { margin-right: 0.6em; }
        .gscs-section-order-list li span:not(.gscs-drag-icon) { flex-grow: 1; color: var(--settings-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gscs-section-order-list li[draggable="true"] { cursor: grab; user-select: none; }
        .gscs-section-order-list li[draggable="true"]:active { cursor: grabbing; }
        li.is-dragging { opacity: 0.4 !important; background: var(--settings-list-btn-hover-bg) !important; border-style: dashed !important; }
        li.is-drag-over { border-top: 2px solid var(--settings-tab-active-border) !important; margin-top: -2px !important; }
        .gscs-section-order-list li.is-drag-over { padding-top: calc(0.6em + 2px) !important; }

        /* --- Custom Tab Buttons --- */
        #gscs-tab-pane-custom .gscs-button--manage-custom { padding: 0.6em 1em; font-size: 0.95em; }
        #gscs-tab-pane-custom .gscs-button--manage-custom:hover { background-color: var(--settings-list-btn-hover-bg); }
        #gscs-tab-pane-custom .gscs-setting-item { padding-bottom: 0.8em; margin-bottom: 0.8em; border-bottom: 1px dashed var(--settings-border-color); }
        #gscs-tab-pane-custom .gscs-setting-item:last-child { border-bottom: none; }

        /*
        |--------------------------------------------------------------------------
        | 7. Modal Dialogs (for Custom Lists)
        |--------------------------------------------------------------------------
        */

        .settings-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 2050; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.2s ease-out; pointer-events: auto; }
        .settings-modal-content { background-color: var(--settings-bg-color); color: var(--settings-text-color); padding: 20px 25px; border-radius: 8px; box-shadow: var(--settings-shadow); width: 550px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; position: relative; z-index: 2100; pointer-events: auto; }
        .settings-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--settings-border-color); }
        .settings-modal-header h4 { margin: 0; font-size: 1.15em; font-weight: bold; color: var(--settings-header-text-color); }
        .settings-modal-close-btn { font-size: 1.5em; cursor: pointer; border: none; background: none; padding: 0; color: var(--settings-close-btn-color); line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
        .settings-modal-close-btn svg { width: 1em; height: 1em; }
        .settings-modal-close-btn:hover { color: var(--settings-close-btn-hover-color); }
        .settings-modal-body { flex-grow: 1; overflow-y: auto; margin-bottom: 15px; padding-right: 5px; }
        .settings-modal-body hr { border: none; border-top: 1px dashed var(--settings-border-color); margin: 1em 0; }
        .settings-modal-footer { display: flex; justify-content: flex-end; padding-top: 15px; border-top: 1px solid var(--settings-border-color); }
        .settings-modal-footer button { padding: 0.6em 1.2em; border-radius: 4px; cursor: pointer; font-size: 1em; background-color: var(--settings-save-btn-bg); color: var(--settings-save-btn-text); border: 1px solid var(--settings-save-btn-border); }
        .settings-modal-footer button:hover { background-color: var(--settings-save-btn-hover-bg); }
        .settings-modal-body .predefined-options-list { list-style: none; padding: 0; margin: 0.5em 0 1em 0; max-height: 150px; overflow-y: auto; border: 1px solid var(--settings-list-border); border-radius: 4px; width: 100%; }
        .settings-modal-body .predefined-options-list li { padding: 0.4em 0.7em; border-bottom: 1px dashed var(--settings-list-item-border); }
        .settings-modal-body .predefined-options-list li:last-child { border-bottom: none; }
        .settings-modal-body .predefined-options-list label { font-weight: normal; margin-left: 0.5em; vertical-align: middle; }
        .settings-modal-body .predefined-options-list input[type="checkbox"] { vertical-align: middle; margin-right: 0.3em;}
        .settings-modal-content .gscs-custom-list { list-style: none; padding: 0; margin: 0.5em 0 1em 0; border: 1px solid var(--settings-list-border); border-radius: 4px; max-height: 200px; overflow-y: auto; }
        .settings-modal-content .gscs-custom-list li { display: flex; align-items: center; padding: 0.5em 0.7em; border-bottom: 1px dashed var(--settings-list-item-border); background-color: var(--settings-input-bg); position: relative; }
        .settings-modal-content .gscs-custom-list li:last-child { border-bottom: none; }
        .settings-modal-content .gscs-custom-list li .gscs-drag-icon { margin-right: 0.5em; }
        .settings-modal-content .gscs-custom-list li > span:not(.gscs-drag-icon):not(.gscs-custom-list__item-controls) { flex-grow: 1; margin-right: 0.5em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--settings-text-color); }
        .settings-modal-content .gscs-custom-list li .gscs-custom-list__item-controls { margin-left: auto; flex-shrink: 0; display: inline-flex; gap: 0.3em; }
        .settings-modal-content .gscs-custom-list__item-controls button { display: inline-flex; align-items: center; justify-content: center; line-height: 1; padding: 0.2em; width: 1.8em; height: 1.8em; background-color: var(--settings-list-btn-bg); border: 1px solid var(--settings-input-border); border-radius: 3px; color: var(--settings-text-color); }
        .settings-modal-content .gscs-custom-list__item-controls button:hover { background-color: var(--settings-list-btn-hover-bg); }
        .settings-modal-content .gscs-custom-list__item-controls button svg { width: 1em; height: 1em; }
        .settings-modal-content .gscs-custom-list li[draggable="true"] { cursor: grab; user-select: none; }
        .settings-modal-content .gscs-custom-list li[draggable="true"]:active { cursor: grabbing; }
        .settings-modal-content .gscs-custom-list li.is-drag-over { padding-top: calc(0.5em + 2px) !important; }
        .gscs-modal__add-new-button { display: inline-flex; align-items: center; justify-content: center; width: auto; padding: 0.4em 0.8em; margin-bottom: 0.8em; text-align: center; cursor: pointer; font-size: 0.9em; text-decoration: none; border-radius: 4px; background-color: var(--sidebar-tool-btn-bg); border: 1px solid var(--sidebar-tool-btn-border); color: var(--sidebar-tool-btn-text); line-height: 1.4; }
        .gscs-modal__add-new-button:hover { background-color: var(--sidebar-tool-btn-hover-bg); border-color: var(--sidebar-tool-btn-hover-border); color: var(--sidebar-tool-btn-hover-text); }
        .gscs-modal-predefined-chooser { border: 1px solid var(--settings-border-color); border-radius: 4px; padding: 10px; margin-top: 5px; margin-bottom: 10px; background-color: var(--settings-input-bg); max-height: 150px; overflow-y: auto; }
        .gscs-modal-predefined-chooser ul { list-style: none; padding: 0; margin: 0; }
        .gscs-modal-predefined-chooser .gscs-modal-predefined-chooser__item { padding: 0.3em 0.5em; cursor: default; }
        .gscs-modal-predefined-chooser .gscs-modal-predefined-chooser__item:hover { background-color: var(--settings-list-btn-hover-bg); }
        .gscs-modal-predefined-chooser .gscs-modal-predefined-chooser__item input[type="checkbox"] { margin-right: 0.5em; vertical-align: middle; }
        .gscs-modal-predefined-chooser .gscs-modal-predefined-chooser__item label { font-weight: normal; vertical-align: middle; color: var(--settings-text-color); }
        .gscs-modal-predefined-chooser .chooser-buttons { text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--settings-border-color); }
        .gscs-modal-predefined-chooser .chooser-buttons button { margin-left: 5px; padding: 0.4em 0.8em; }
        .settings-modal-content .gscs-custom-list__input-group { display: flex; align-items: flex-start; gap: 0.5em; margin-bottom: 0.3em; flex-wrap: wrap; }
        .settings-modal-content .gscs-custom-list__input-group > div { display: flex; flex-direction: column; flex-grow: 1; min-width: 80px; }
        .settings-modal-content .gscs-custom-list__input-group input[type="text"] { width: 100%; }
        .settings-modal-content .gscs-custom-list__input-group button { flex-shrink: 0; align-self: flex-end; margin-bottom: calc(0.2em + 0.85em * 1.2); }
        .settings-modal-content .gscs-custom-list__input-group .gscs-button--add-custom svg, .settings-modal-content .gscs-custom-list__input-group .cancel-edit-button svg { width: 1.2em; height: 1.2em; margin:0; }
        .gscs-input-error-message { display: none; width: 100%; font-size: 0.85em; color: #dc3545; margin-top: 0.2em; line-height:1.2; }
        .gscs-input-error-message.is-error-visible { display: block; }
        .settings-modal-content input.input-valid { border-color: #28a745 !important; }
        .settings-modal-content .gscs-custom-list__input-group + .gscs-setting-value-hint { display: block; margin-top: 0.5em; font-size: 0.9em; white-space: normal; color: var(--settings-tab-color); }

        /*
        |--------------------------------------------------------------------------
        | 8. Notifications & Utility
        |--------------------------------------------------------------------------
        */

        #gscs-settings-window .gscs-message-bar { padding: 10px; margin-bottom: 15px; border: 1px solid transparent; border-radius: 4px; text-align: center; font-size: 0.95em; }
        #gscs-settings-window .gscs-message-bar.gscs-message-bar--info { color: var(--gscs-msg-info-text); background-color: var(--gscs-msg-info-bg); border-color: var(--gscs-msg-info-border); }
        #gscs-settings-window .gscs-message-bar.gscs-message-bar--success { color: var(--gscs-msg-success-text); background-color: var(--gscs-msg-success-bg); border-color: var(--gscs-msg-success-border); }
        #gscs-settings-window .gscs-message-bar.gscs-message-bar--warning { color: var(--gscs-msg-warning-text); background-color: var(--gscs-msg-warning-bg); border-color: var(--gscs-msg-warning-border); }
        #gscs-settings-window .gscs-message-bar.gscs-message-bar--error { color: var(--gscs-msg-error-text); background-color: var(--gscs-msg-error-bg); border-color: var(--gscs-msg-error-border); }

        #gscs-notification-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column-reverse; align-items: flex-end; gap: 10px; }
        .gscs-notification { background-color: var(--settings-input-bg); color: var(--settings-text-color); padding: 12px 18px; border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); min-width: 250px; max-width: 400px; font-size: 0.95em; border: 1px solid var(--settings-border-color); opacity: 1; transition: opacity 0.5s ease-out, transform 0.3s ease-out; transform: translateX(0); }
        .gscs-notification:hover { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
        .gscs-notification.gscs-notification--info { background-color: var(--gscs-ntf-info-bg); color: var(--gscs-ntf-info-text); border-color: var(--gscs-ntf-info-border); }
        .gscs-notification.gscs-notification--success { background-color: var(--gscs-msg-success-bg); color: var(--gscs-msg-success-text); border-color: var(--gscs-msg-success-border); }
        .gscs-notification.gscs-notification--warning { background-color: var(--gscs-msg-warning-bg); color: var(--gscs-msg-warning-text); border-color: var(--gscs-msg-warning-border); }
        .gscs-notification.gscs-notification--error { background-color: var(--gscs-msg-error-bg); color: var(--gscs-msg-error-text); border-color: var(--gscs-msg-error-border); }
        .gscs-notification span[style*="cursor: pointer"] { font-weight: bold; opacity: 0.7; }
        .gscs-notification span[style*="cursor: pointer"]:hover { opacity: 1; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* --- SVG Icon Sizing --- */
        #gscs-sidebar button svg,
        #gscs-settings-window button:not(.gscs-settings__close-button) svg,
        .settings-modal-content button:not(.settings-modal-close-btn):not(.gscs-modal__add-new-button) svg {
            display: inline-block;
            vertical-align: middle;
            width: 1em;
            height: 1em;
            pointer-events: none;
        }
        #gscs-sidebar .gscs-header-button svg,
        #gscs-sidebar #gscs-sidebar-collapse-button svg,
        #gscs-sidebar .gscs-settings-button svg {
            width: var(--sidebar-header-icon-base-size);
            height: var(--sidebar-header-icon-base-size);
        }
        #gscs-sidebar .gscs-button svg {
             width: 0.9em;
             height: 0.9em;
        }
    `;

    if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) {
        if (window.GSCS_Namespace && typeof window.GSCS_Namespace.stylesText === 'string' && window.GSCS_Namespace.stylesText.trim() !== '') {
            const event = new CustomEvent('gscsStylesLoaded', { detail: { version: GM_info.script.version } });
            document.dispatchEvent(event);
            const logVersion = GM_info.script.version.endsWith('-styles') ? GM_info.script.version : GM_info.script.version + '-styles';
            console.log(`[GSCS StylesProvider v${logVersion.replace('-styles','-styles-event')}] CSS loaded and "gscsStylesLoaded" event dispatched.`);
        } else {
            const logVersion = GM_info.script.version.endsWith('-styles') ? GM_info.script.version : GM_info.script.version + '-styles';
            console.warn(`[GSCS StylesProvider v${logVersion.replace('-styles','-styles-event')}] window.GSCS_Namespace.stylesText is empty or not found, "gscsStylesLoaded" event NOT dispatched.`);
        }
    } else {
        if (window.GSCS_Namespace && typeof window.GSCS_Namespace.stylesText === 'string' && window.GSCS_Namespace.stylesText.trim() !== '') {
            const event = new CustomEvent('gscsStylesLoaded', { detail: { version: 'unknown' } });
            document.dispatchEvent(event);
            console.log(`[GSCS StylesProvider vUNKNOWN-styles-event] CSS loaded and "gscsStylesLoaded" event dispatched (GM_info not available).`);
        } else {
            console.warn(`[GSCS StylesProvider vUNKNOWN-styles-event] window.GSCS_Namespace.stylesText not found, "gscsStylesLoaded" event NOT dispatched (GM_info not available).`);
        }
    }

})();