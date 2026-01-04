// ==UserScript==
// @name         Milky Way Idle Tasklist
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  This script provides a persistent, draggable task list window for Milky Way Idle to help track your goals.
// @author       Kjay
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531418/Milky%20Way%20Idle%20Tasklist.user.js
// @updateURL https://update.greasyfork.org/scripts/531418/Milky%20Way%20Idle%20Tasklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checklistId = 'mwi-checklist';
    const checklistTitle = 'Task List';
    const minimizedLabelText = 'List:';
    const MAX_ITEM_LENGTH = 40;
    const TOOLTIP_LENGTH_THRESHOLD = 15;
    const MAX_TOTAL_ITEMS = 99;
    const MAX_CUSTOM_SECTIONS = 10;
    const STORAGE_KEY_POS = 'mwi_checklist_pos';
    const STORAGE_KEY_ITEMS = 'mwi_checklist_items';
    const STORAGE_KEY_CONFIG = 'mwi_checklist_config';
    const STORAGE_KEY_LAST_SECTION = 'mwi_checklist_last_section';
    const STORAGE_KEY_COLLAPSED_SECTIONS = 'mwi_checklist_collapsed';
    const STORAGE_KEY_START_MINIMIZED = 'mwi_checklist_start_minimized';
    const DEFAULT_POS = { top: '10px', left: null, right: '10px' };
    const GLOBAL_SECTION_ID = "__global__";
    const COMPLETED_SECTION_ID = "__completed__";
    const DEFAULT_CONFIG = { sections: [] };

    const checklistStyle = `
        #${checklistId} {
            --mwi-tasklist-bg-primary: #333;
            --mwi-tasklist-bg-secondary: #444;
            --mwi-tasklist-bg-tertiary: #3a3a3a;
            --mwi-tasklist-bg-minimized: #222;
            --mwi-tasklist-bg-drag-overlay: #404040;
            --mwi-tasklist-bg-dragging-item: #444;
            --mwi-tasklist-bg-edit-input: #555;

            --mwi-tasklist-text-primary: #eee;
            --mwi-tasklist-text-secondary: #ccc;
            --mwi-tasklist-text-tertiary: #bbb;
            --mwi-tasklist-text-header: #fff;
            --mwi-tasklist-text-button: white;
            --mwi-tasklist-text-placeholder: #aaa;

            --mwi-tasklist-border-primary: #555;
            --mwi-tasklist-border-secondary: #777;
            --mwi-tasklist-border-divider: #666;
            --mwi-tasklist-border-divider-strong: #555;
            --mwi-tasklist-border-drag-dash: #888;
            --mwi-tasklist-border-radius: 5px;
            --mwi-tasklist-border-radius-inner: 3px;

            --mwi-tasklist-accent-success: #4CAF50;
            --mwi-tasklist-accent-danger: #f44336;
            --mwi-tasklist-accent-warning: #fd7e14;
            --mwi-tasklist-accent-warning-text: #ffc107;
            --mwi-tasklist-accent-info: #0d6efd;
            --mwi-tasklist-accent-drag-handle: #aaa;
            --mwi-tasklist-accent-dragging-dash: #aaa;

            --mwi-tasklist-font-family: sans-serif;
            --mwi-tasklist-font-size-base: 0.9em;
            --mwi-tasklist-font-size-small: 0.8em;
            --mwi-tasklist-font-size-smaller: 0.75em;
            --mwi-tasklist-font-size-header: 1.2em;
            --mwi-tasklist-font-size-section-header: 0.95em;

            position: fixed;
            background-color: var(--mwi-tasklist-bg-primary);
            color: var(--mwi-tasklist-text-primary);
            border: 1px solid var(--mwi-tasklist-border-primary);
            width: 280px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            border-radius: var(--mwi-tasklist-border-radius);
            font-family: var(--mwi-tasklist-font-family);
            overflow: hidden;
            cursor: default;
            max-height: 90vh;
            box-sizing: border-box;
        }
        #${checklistId}.minimized {
            width: auto;
            height: auto;
            padding: 4px 8px;
            cursor: move;
            background-color: var(--mwi-tasklist-bg-minimized);
            border: 1px solid var(--mwi-tasklist-border-primary);
            border-radius: var(--mwi-tasklist-border-radius);
            display: inline-flex;
            align-items: center;
            overflow: visible;
            max-height: none;
            flex-direction: row;
            opacity: 0.95;
            font-size: 13px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        }
        #${checklistId}.minimized:hover {
             opacity: 1;
        }
        #${checklistId}.minimized > *:not(.minimized-content-container) { display: none; }
        #${checklistId} .minimized-content-container {
             display: none;
             align-items: center;
             gap: 5px;
        }
        #${checklistId}.minimized .minimized-content-container { display: inline-flex; }
        #${checklistId} .minimized-label {
            color: var(--mwi-tasklist-text-primary);
            cursor: move;
            user-select: none;
            font-weight: normal;
            font-size: 1em;
         }
        #${checklistId} .toggle-button {
            background-color: var(--mwi-tasklist-accent-success);
            color: var(--mwi-tasklist-text-button);
            padding: 2px 5px;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            text-decoration: none;
            font-size: var(--mwi-tasklist-font-size-small);
            cursor: pointer;
            border: none;
            line-height: normal;
            vertical-align: middle;
            font-weight: normal;
         }
         #${checklistId} .show-button {
            display: none;
            font-size: 0.9em;
         }
         #${checklistId}.minimized .show-button { display: inline-block; }
         #${checklistId} .show-button:hover {
            filter: brightness(1.1);
            background-color: #5cb860;
         }
        #${checklistId} .header-buttons-container { position: absolute; top: 6px; right: 6px; display: flex; gap: 4px; align-items: center; z-index: 1; }
        #${checklistId} .hide-button {
            order: 1;
            cursor: pointer;
         }
        #${checklistId} h3 {
            margin: 0;
            padding: 5px 35px 5px 8px;
            text-align: center;
            cursor: move;
            background-color: var(--mwi-tasklist-bg-secondary);
            color: var(--mwi-tasklist-text-header);
            font-size: var(--mwi-tasklist-font-size-header);
            flex: 0 0 auto;
            position: relative;
            border-bottom: 1px solid var(--mwi-tasklist-border-divider-strong);
            user-select: none;
            border-radius: var(--mwi-tasklist-border-radius) var(--mwi-tasklist-border-radius) 0 0;
         }
        #${checklistId} #checklist-header-area { flex-shrink: 0; padding: 8px 8px 0 8px; display: flex; flex-direction: column; gap: 5px; }
        #${checklistId} #checklist-footer-area { flex-shrink: 0; padding: 8px; border-top: 1px solid var(--mwi-tasklist-border-divider-strong); }
        #${checklistId} #checklist-scrollable-area { flex-grow: 1; overflow-y: auto; overflow-x: hidden; padding: 0 8px 8px 8px; border-top: 1px solid var(--mwi-tasklist-border-divider-strong); }
        #${checklistId}.minimized #checklist-header-area,
        #${checklistId}.minimized #checklist-scrollable-area,
        #${checklistId}.minimized #checklist-footer-area { display: none; }
        #${checklistId} #settingsToggleLabel {
            font-size: var(--mwi-tasklist-font-size-base);
            color: var(--mwi-tasklist-text-secondary);
            cursor: pointer;
            margin: 0;
            display: block;
            text-align: center;
            flex-shrink: 0;
            padding-top: 0;
         }
        #${checklistId} #settingsArea {
            display: none;
            flex-direction: column;
            gap: 8px;
            background-color: var(--mwi-tasklist-bg-tertiary);
            padding: 8px;
            margin-top: 5px;
            margin-bottom: 0;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            border: 1px solid var(--mwi-tasklist-border-primary);
            font-size: var(--mwi-tasklist-font-size-base);
            flex-shrink: 0;
            max-height: 250px;
            overflow-y: auto;
         }
        #${checklistId} #settingsArea > div:not(.settings-section-name) { display: flex; align-items: center; margin-bottom: 5px; }
        #${checklistId} #settingsArea label { margin-right: 5px; display: inline-block; width: 65px; text-align: right; flex-shrink: 0; }
        #${checklistId} #settingsArea input[type=text] {
             background-color: var(--mwi-tasklist-bg-secondary);
             color: var(--mwi-tasklist-text-primary);
             border: 1px solid var(--mwi-tasklist-border-primary);
             padding: 2px 4px;
             border-radius: var(--mwi-tasklist-border-radius-inner);
             margin-right: 5px;
             flex-grow: 1;
         }
        #${checklistId} #settingsArea select {
             background-color: var(--mwi-tasklist-bg-secondary);
             color: var(--mwi-tasklist-text-primary);
             border: 1px solid var(--mwi-tasklist-border-primary);
             padding: 2px;
             border-radius: var(--mwi-tasklist-border-radius-inner);
         }
        #${checklistId} #settingsArea button {
            font-size: var(--mwi-tasklist-font-size-base);
            padding: 2px 5px;
            background-color: var(--mwi-tasklist-accent-success);
            border: none;
            color: var(--mwi-tasklist-text-button);
            cursor: pointer;
        }
        #${checklistId} #settingsArea .settings-row-with-button {display: flex; align-items: center; margin-bottom: 5px;}
        #${checklistId} #settingsArea #saveSettingsButtonTop {
            font-size: var(--mwi-tasklist-font-size-base);
            padding: 2px 5px;
            background-color: var(--mwi-tasklist-accent-success);
            border: none;
            color: var(--mwi-tasklist-text-button);
            cursor: pointer;
            margin-left: auto;
            flex-shrink: 0;
            border-radius: var(--mwi-tasklist-border-radius-inner);
         }
        #${checklistId} #settingsArea .settings-row-with-button select {flex-grow: 1; max-width: 80px; margin-right: 5px; }
        #${checklistId} #settingsArea .settings-row-with-button label {width: 60px; margin-right: 5px; text-align: right; flex-shrink: 0; }
        #${checklistId} .settings-section-name { display: none; flex-direction: column; margin-bottom: 8px; padding-left: 5px; border-left: 2px solid transparent; }
        #${checklistId} .settings-section-name.visible { display: flex; }
        #${checklistId} .settings-input-row { display: flex; align-items: center; width: 100%; }
        #${checklistId} .remove-indicator {
            font-size: 0.85em;
            color: var(--mwi-tasklist-accent-warning-text);
            margin-left: 68px;
            margin-top: 2px;
            font-style: italic;
            display: none;
            line-height: 1.2;
        }
        #${checklistId} .settings-section-name.marked-for-removal { border-left-color: var(--mwi-tasklist-accent-warning-text); padding-left: 3px; }
        #${checklistId} .settings-section-name.marked-for-removal .remove-indicator { display: block; }
        #${checklistId} .list-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5px;
            font-size: 0.85em;
            color: var(--mwi-tasklist-text-tertiary);
            flex-shrink: 0;
            height: auto;
            margin-bottom: 0;
            position: relative;
            width: 100%;
            box-sizing: border-box;
         }
        #${checklistId} #taskCounter { text-align: center; line-height: 18px; padding: 0 5px; flex-grow: 0; flex-shrink: 0; }
        #${checklistId} #taskCounter.full { color: var(--mwi-tasklist-accent-warning-text); font-weight: bold; }
        #${checklistId} #addButton {
            background-color: var(--mwi-tasklist-accent-success);
            border: none;
            color: var(--mwi-tasklist-text-button);
            padding: 3px 6px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: var(--mwi-tasklist-font-size-base);
            cursor: pointer;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            flex-shrink: 0;
         }
        #${checklistId} .clear-list-button {
            background-color: var(--mwi-tasklist-accent-warning) !important;
            color: var(--mwi-tasklist-text-button);
            border: none;
            padding: 1px 4px;
            font-size: var(--mwi-tasklist-font-size-small);
            border-radius: var(--mwi-tasklist-border-radius-inner);
            cursor: pointer;
         }
         #${checklistId} #toggleAllSectionsButton {
            background-color: var(--mwi-tasklist-accent-info);
            color: var(--mwi-tasklist-text-button);
            border: none;
            padding: 1px 4px;
            font-size: var(--mwi-tasklist-font-size-small);
            border-radius: var(--mwi-tasklist-border-radius-inner);
            cursor: pointer;
            flex-shrink: 0;
         }
        #${checklistId} #clearAllButton {
            margin-left: 4px;
            flex-shrink: 0;
            cursor: pointer;
        }
        #${checklistId} .delete-button {
            background-color: var(--mwi-tasklist-accent-danger);
            padding: 3px 4px;
            flex-shrink: 0;
            border: none;
            color: var(--mwi-tasklist-text-button);
            font-size: var(--mwi-tasklist-font-size-base);
            cursor: pointer;
            border-radius: var(--mwi-tasklist-border-radius-inner);
         }
        #${checklistId} #sectionContainer { flex-grow: 0; flex-shrink: 0; margin-top: 8px; }
        #${checklistId} .task-section { margin-bottom: 10px; }
        #${checklistId} #sectionContainer > .task-section:last-child { margin-bottom: 0; }
        #${checklistId} .task-section h4 {
            margin: 0;
            font-size: var(--mwi-tasklist-font-size-section-header);
            color: var(--mwi-tasklist-text-secondary);
            border-bottom: none;
            padding-bottom: 0;
            flex-grow: 1;
         }
        #${checklistId} .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 0 3px 0;
            border-bottom: 1px dotted var(--mwi-tasklist-border-divider);
            padding-bottom: 2px;
            padding-right: 4px;
            cursor: pointer;
            user-select: none;
         }
        #${checklistId} .clear-section-button {
            background-color: var(--mwi-tasklist-accent-warning);
            color: var(--mwi-tasklist-text-button);
            border: none;
            padding: 0px 3px;
            font-size: var(--mwi-tasklist-font-size-smaller);
            border-radius: var(--mwi-tasklist-border-radius-inner);
            cursor: pointer;
            line-height: 1.4;
            flex-shrink: 0;
            margin-left: 5px;
         }
        #${checklistId} .section-toggle-icon {
            margin-right: 4px;
            font-size: var(--mwi-tasklist-font-size-small);
            display: inline-block;
            width: 10px;
            text-align: center;
            color: var(--mwi-tasklist-text-placeholder);
            transition: transform 0.2s ease;
         }
        #${checklistId} .task-section.collapsed .section-toggle-icon, #${checklistId} .completed-section.collapsed .section-toggle-icon { transform: rotate(-90deg); }
        #${checklistId} .section-header-title { display: flex; align-items: center; flex-grow: 1; min-width: 0; }
        #${checklistId} .section-header-title h4 { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        #${checklistId} .task-section ul, #${checklistId} .completed-section ul { list-style: none; padding: 5px 0 0 0; margin: 0; min-height: 0; position: relative; box-sizing: border-box; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease-out; max-height: 1000px; }
        #${checklistId} .task-section.collapsed ul, #${checklistId} .completed-section.collapsed ul { max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0; border-top: none; }
        #${checklistId} ul { list-style: none; padding: 0; margin: 0; }
        #${checklistId} li { margin-bottom: 3px; display: flex; align-items: center; padding: 2px 0; border: 1px solid transparent; transition: background-color 0.1s ease; position: relative; }
        #${checklistId} li.dragging {
            outline: 2px dashed var(--mwi-tasklist-accent-dragging-dash);
            background: var(--mwi-tasklist-bg-dragging-item);
            opacity: 0.7;
        }
        #${checklistId} li.drag-over-before { border-top: 2px solid var(--mwi-tasklist-accent-success); }
        #${checklistId} li.drag-over-after { border-bottom: 2px solid var(--mwi-tasklist-accent-success); }
        #${checklistId} ul.drag-over-empty { border-top: 2px solid var(--mwi-tasklist-accent-success); margin-top: -2px; }
        #${checklistId} .drag-handle {
            cursor: grab;
            margin-right: 8px;
            margin-left: 3px;
            opacity: 0.7;
            user-select: none;
            line-height: 1;
            padding: 0 3px;
            color: var(--mwi-tasklist-accent-drag-handle);
        }
        #${checklistId} .drag-handle:hover { opacity: 1; }
        #${checklistId} input[type="checkbox"] { margin-right: 5px; cursor: pointer; flex-shrink: 0; }
        #${checklistId} .item-text { flex-grow: 1; margin-right: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: text; }
        #${checklistId} .edit-input {
            flex-grow: 1;
            margin-right: 5px;
            background-color: var(--mwi-tasklist-bg-edit-input);
            color: var(--mwi-tasklist-text-primary);
            border: 1px solid var(--mwi-tasklist-border-secondary);
            padding: 1px 3px;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            font-size: inherit;
            font-family: inherit;
         }
        #${checklistId} #addItemDiv { display: flex; flex-direction: column; flex-shrink: 0; margin-top: 0; border-top: none; padding-top: 0; }
        #${checklistId} .add-item-row1 { display: flex; align-items: center; margin-bottom: 4px; }
        #${checklistId} #addSectionLabel { margin-right: 5px; font-size: var(--mwi-tasklist-font-size-base); color: var(--mwi-tasklist-text-secondary); flex-shrink: 0; }
        #${checklistId} #sectionSelect {
            background-color: var(--mwi-tasklist-bg-secondary);
            color: var(--mwi-tasklist-text-primary);
            border: 1px solid var(--mwi-tasklist-border-primary);
            padding: 3px;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            font-size: var(--mwi-tasklist-font-size-base);
            flex-grow: 1;
            max-width: none;
        }
        #${checklistId} .add-item-row2 { display: flex; align-items: center; }
        #${checklistId} #addItemInput {
            flex-grow: 1;
            margin-right: 5px;
            background-color: var(--mwi-tasklist-bg-secondary);
            color: var(--mwi-tasklist-text-primary);
            border: 1px solid var(--mwi-tasklist-border-primary);
            padding: 3px 5px;
            border-radius: var(--mwi-tasklist-border-radius-inner);
            min-width: 50px;
         }
        #${checklistId} #addItemInput::placeholder { color: var(--mwi-tasklist-text-placeholder); }
        #${checklistId} #addItemInput:disabled, #${checklistId} #addButton:disabled, #${checklistId} #sectionSelect:disabled { opacity: 0.5; cursor: not-allowed; }
        #${checklistId} .completed-section { margin-top: 0; border-top: 1px solid var(--mwi-tasklist-border-divider-strong); padding-top: 10px; flex-shrink: 0; }
        #${checklistId} .completed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; cursor: pointer; user-select: none; }
        #${checklistId} .completed-section ul { opacity: 0.7; max-height: 150px; overflow-y: auto; }
        #${checklistId} .completed-section.collapsed ul { overflow-y: hidden; max-height: 0; }
        #${checklistId} .completed-section h4 {
            margin: 0;
            font-size: var(--mwi-tasklist-font-size-base);
            color: var(--mwi-tasklist-text-tertiary);
        }
        /* REMOVED: #${checklistId} [title] { cursor: help; } */
        #${checklistId} .task-section.drag-over-section, #${checklistId} .completed-section.drag-over-section {
            background-color: var(--mwi-tasklist-bg-drag-overlay) !important;
            outline: 1px dashed var(--mwi-tasklist-border-drag-dash);
            outline-offset: -1px;
        }
        #${checklistId} .options-cog-button {
            background: none;
            border: none;
            color: var(--mwi-tasklist-text-secondary);
            font-size: 1.1em;
            padding: 0 3px;
            cursor: pointer;
            line-height: 1;
            vertical-align: middle;
            order: 0;
            margin-right: 5px;
        }
        #${checklistId} .options-cog-button:hover {
            color: var(--mwi-tasklist-text-primary);
        }
        #${checklistId} #optionsPanel {
            display: none;
            position: absolute;
            top: 32px;
            right: 5px;
            background-color: var(--mwi-tasklist-bg-secondary);
            border: 1px solid var(--mwi-tasklist-border-primary);
            border-radius: var(--mwi-tasklist-border-radius-inner);
            padding: 8px;
            z-index: 2001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: var(--mwi-tasklist-font-size-base);
            color: var(--mwi-tasklist-text-primary);
            min-width: 150px;
        }
        #${checklistId} #optionsPanel label {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
         #${checklistId} #optionsPanel input[type="checkbox"] {
             margin-right: 5px;
             cursor: pointer;
         }
        #${checklistId} .hide-button {
            order: 1;
            cursor: pointer;
         }
    `;
    GM_addStyle(checklistStyle);

    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    }

    function getSavedConfig() {
        let configJson = GM_getValue(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
        let config;
        try {
            config = JSON.parse(configJson);
        } catch (e) {
            console.error("MWI Tasklist: Error parsing config JSON. Resetting.", e, configJson);
            config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        }
        let needsSave = false;
        if (!config || typeof config !== 'object' || !Array.isArray(config.sections)) {
            console.warn("MWI Tasklist: Invalid config structure found. Resetting to default.");
            config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            needsSave = true;
        }
        config.sections = config.sections.slice(0, MAX_CUSTOM_SECTIONS).map(s => {
            if (!s || typeof s !== 'object') return null;
            if (!s.id) {
                s.id = generateUniqueId();
                needsSave = true;
            }
            s.name = String(s.name || '').trim().substring(0, MAX_ITEM_LENGTH);
            if (!s.name) {
                 s.name = "Unnamed Section";
                 needsSave = true;
            }
            return s;
        }).filter(s => s !== null);

        if (config.sections.length > MAX_CUSTOM_SECTIONS) {
             config.sections = config.sections.slice(0, MAX_CUSTOM_SECTIONS);
             needsSave = true;
        }
        if (needsSave) {
            saveConfig(config);
        }
        return config;
    }

    function saveConfig(config) {
        if (!config || !Array.isArray(config.sections)) {
            console.error("MWI Tasklist: Attempted to save invalid config structure.", config);
            return;
        }
        config.sections = config.sections.slice(0, MAX_CUSTOM_SECTIONS);
        GM_setValue(STORAGE_KEY_CONFIG, JSON.stringify(config));
    }

    function getChecklistItems() {
        let itemsJson = GM_getValue(STORAGE_KEY_ITEMS, '[]');
        let items;
        try {
            items = JSON.parse(itemsJson);
        } catch (e) {
            console.error("MWI Tasklist: Error parsing items JSON. Resetting.", e, itemsJson);
            items = [];
        }
        if (!Array.isArray(items)) {
             console.warn("MWI Tasklist: Invalid items structure found. Resetting to empty array.");
             items = [];
        }
        let needsSave = false;
        items = items.map(item => {
            if (!item || typeof item !== 'object') return null;
            if (!item.id) {
                item.id = generateUniqueId();
                needsSave = true;
            }
            if (item.sectionId === undefined || item.sectionId === null) {
                item.sectionId = GLOBAL_SECTION_ID;
                needsSave = true;
            }
            item.text = String(item.text || '').trim().substring(0, MAX_ITEM_LENGTH);
            item.checked = Boolean(item.checked);
            return item;
        }).filter(item => item !== null);
        if (items.length > MAX_TOTAL_ITEMS) {
            items = items.slice(0, MAX_TOTAL_ITEMS);
            needsSave = true;
        }
        if (needsSave) {
            setChecklistItems(items);
        }
        return items;
    }

    function setChecklistItems(items) {
        if (!Array.isArray(items)) {
             console.error("MWI Tasklist: Attempted to save invalid items array.", items);
             return;
        }
        if (items.length > MAX_TOTAL_ITEMS) {
            items = items.slice(0, MAX_TOTAL_ITEMS);
        }
        GM_setValue(STORAGE_KEY_ITEMS, JSON.stringify(items));
    }

    function findActualItemIndexById(itemId, currentItems) {
        if (!itemId || !Array.isArray(currentItems)) return -1;
        return currentItems.findIndex(i => i && i.id === itemId);
    }

    function getCollapsedSections() {
        const stored = GM_getValue(STORAGE_KEY_COLLAPSED_SECTIONS, '[]');
        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("MWI Tasklist: Error parsing collapsed sections state. Resetting.", e, stored);
            return [];
        }
    }

    function saveCollapsedSections(collapsedIds) {
        if (!Array.isArray(collapsedIds)) {
             console.error("MWI Tasklist: Attempted to save invalid collapsed sections array.", collapsedIds);
             return;
        }
        GM_setValue(STORAGE_KEY_COLLAPSED_SECTIONS, JSON.stringify(collapsedIds));
    }

    function toggleSectionCollapse(sectionId, sectionElement) {
        if (!sectionId || !sectionElement) return;
        const isCollapsed = sectionElement.classList.toggle('collapsed');
        const collapsedIds = getCollapsedSections();
        if (isCollapsed) {
            if (!collapsedIds.includes(sectionId)) {
                collapsedIds.push(sectionId);
            }
        } else {
            const index = collapsedIds.indexOf(sectionId);
            if (index > -1) {
                collapsedIds.splice(index, 1);
            }
        }
        saveCollapsedSections(collapsedIds);
        updateToggleAllButtonState();
    }

    function updateToggleAllButtonState() {
        const checklistDiv = document.getElementById(checklistId);
        if (!checklistDiv) return;
        const toggleButton = checklistDiv.querySelector('#toggleAllSectionsButton');
        if (!toggleButton) return;

        const config = getSavedConfig();
        const allSectionIds = [GLOBAL_SECTION_ID, ...config.sections.map(s => s.id), COMPLETED_SECTION_ID];
        const collapsedSections = getCollapsedSections();

        const allExistingCollapsed = allSectionIds.every(id => {
            const sectionElement = checklistDiv.querySelector(`.task-section[data-section-id="${id}"], .completed-section[data-section-id="${id}"]`);
            return sectionElement ? collapsedSections.includes(id) : true;
        });

        toggleButton.textContent = allExistingCollapsed ? 'Expand All' : 'Collapse All';
        toggleButton.title = allExistingCollapsed ? 'Expand all task sections' : 'Collapse all task sections';
    }

    function handleToggleAllSections() {
        const config = getSavedConfig();
        const allSectionIds = [GLOBAL_SECTION_ID, ...config.sections.map(s => s.id), COMPLETED_SECTION_ID];
        const collapsedSections = getCollapsedSections();

        const checklistDiv = document.getElementById(checklistId);
        const existingSectionIds = allSectionIds.filter(id =>
             checklistDiv?.querySelector(`.task-section[data-section-id="${id}"], .completed-section[data-section-id="${id}"]`)
        );

        const allExistingCollapsed = existingSectionIds.every(id => collapsedSections.includes(id));
        const shouldCollapse = !allExistingCollapsed;

        if (shouldCollapse) {
            const newCollapsed = [...new Set([...collapsedSections, ...existingSectionIds])];
            saveCollapsedSections(newCollapsed);
        } else {
            const newCollapsed = collapsedSections.filter(id => !existingSectionIds.includes(id));
            saveCollapsedSections(newCollapsed);
        }
        renderChecklist();
        updateToggleAllButtonState();
    }

    function savePosition(element) {
        if (!element) return;
        let pos = {};
        if (element.style.right && element.style.right !== 'auto') {
             pos = { top: element.style.top, right: element.style.right };
        } else if (element.style.left && element.style.left !== 'auto') {
             pos = { top: element.style.top, left: element.style.left };
        } else {
             pos = { top: element.style.top || DEFAULT_POS.top, right: DEFAULT_POS.right };
        }
        GM_setValue(STORAGE_KEY_POS, JSON.stringify(pos));
    }

    function loadPosition() {
        const savedPos = GM_getValue(STORAGE_KEY_POS, null);
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                if (pos && typeof pos.top === 'string') {
                    if (typeof pos.right === 'string') {
                        return { top: pos.top, left: null, right: pos.right };
                    } else if (typeof pos.left === 'string') {
                        return { top: pos.top, left: pos.left, right: null };
                    }
                }
            } catch (e) {
                console.error("MWI Tasklist: Error parsing saved position:", e);
                GM_setValue(STORAGE_KEY_POS, null);
            }
        }
        return { ...DEFAULT_POS };
    }

    function applyPosition(element, pos) {
        if (!element || !pos) return;
        element.style.top = pos.top || '';
        element.style.left = '';
        element.style.right = '';

        if (pos.right) {
            element.style.right = pos.right;
        } else if (pos.left) {
            element.style.left = pos.left;
        } else {
             element.style.right = DEFAULT_POS.right;
        }
    }

    function createChecklistItemElement(item) {
       const listItem = document.createElement('li');
       listItem.dataset.itemId = item.id;
       listItem.dataset.itemSection = item.sectionId;

       const dragHandle = document.createElement('span');
       dragHandle.innerHTML = '☰';
       dragHandle.className = 'drag-handle';
       dragHandle.title = 'Drag to reorder';
       dragHandle.draggable = !item.checked;
       listItem.appendChild(dragHandle);

       const checkbox = document.createElement('input');
       checkbox.type = 'checkbox';
       checkbox.checked = item.checked;
       checkbox.title = item.checked ? 'Mark as incomplete' : 'Mark as complete';
       checkbox.addEventListener('change', () => {
           const items = getChecklistItems();
           const actualIndex = findActualItemIndexById(item.id, items);
           if (actualIndex !== -1) {
               items[actualIndex].checked = checkbox.checked;
               setChecklistItems(items);
               renderChecklist();
           }
       });
       listItem.appendChild(checkbox);

       const itemTextSpan = document.createElement('span');
       itemTextSpan.className = 'item-text';
       itemTextSpan.textContent = item.text || '';
       if (item.text && item.text.length > TOOLTIP_LENGTH_THRESHOLD) {
           itemTextSpan.title = item.text;
       }
       itemTextSpan.addEventListener('dblclick', () => {
            if (item.checked) return;
            startEditing(listItem, itemTextSpan, item.id);
        });
       listItem.appendChild(itemTextSpan);

       const deleteButton = document.createElement('button');
       deleteButton.textContent = 'X';
       deleteButton.className = 'delete-button';
       deleteButton.title = 'Delete task';
       deleteButton.addEventListener('click', () => {
           const items = getChecklistItems();
           const actualIndex = findActualItemIndexById(item.id, items);
           if(actualIndex !== -1) {
               items.splice(actualIndex, 1);
               setChecklistItems(items);
               renderChecklist();
           }
       });
       listItem.appendChild(deleteButton);

       if (item.checked) {
           listItem.style.opacity = '0.6';
           itemTextSpan.style.textDecoration = 'line-through';
           dragHandle.style.cursor = 'default';
           dragHandle.style.opacity = '0.2';
           itemTextSpan.style.cursor = 'default';
       }

       return listItem;
    }

    function startEditing(listItem, textSpan, itemId) {
       if (listItem.querySelector('.edit-input')) return;

       const currentText = textSpan.textContent;
       const editInput = document.createElement('input');
       editInput.type = 'text';
       editInput.className = 'edit-input';
       editInput.value = currentText;
       editInput.maxLength = MAX_ITEM_LENGTH;

       listItem.replaceChild(editInput, textSpan);
       editInput.focus();
       editInput.select();

       const cleanup = () => {
           editInput.removeEventListener('blur', saveEdit);
           editInput.removeEventListener('keydown', handleKeydown);
           if (listItem.contains(editInput)) {
                listItem.replaceChild(textSpan, editInput);
           }
       };

       const saveEdit = () => {
           let newText = editInput.value.trim();
           listItem.replaceChild(textSpan, editInput);

           if (newText && newText !== currentText) {
               const items = getChecklistItems();
               const actualIndex = findActualItemIndexById(itemId, items);
               if (actualIndex !== -1) {
                   items[actualIndex].text = newText;
                   setChecklistItems(items);
                   textSpan.textContent = newText;
                   if (newText.length > TOOLTIP_LENGTH_THRESHOLD) {
                        textSpan.title = newText;
                    } else {
                        textSpan.removeAttribute('title');
                    }
               } else {
                   textSpan.textContent = currentText;
               }
           } else {
                textSpan.textContent = currentText;
           }
           cleanup();
       };

       const cancelEdit = () => {
           listItem.replaceChild(textSpan, editInput);
           textSpan.textContent = currentText;
           cleanup();
       };

       const handleKeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        };

       editInput.addEventListener('blur', saveEdit);
       editInput.addEventListener('keydown', handleKeydown);
    }

    function renderChecklist() {
        const checklistDiv = document.getElementById(checklistId);
        if (!checklistDiv || checklistDiv.classList.contains('minimized')) {
            return;
        }

        const scrollableArea = checklistDiv.querySelector('#checklist-scrollable-area');
        const footerArea = checklistDiv.querySelector('#checklist-footer-area');
        const headerArea = checklistDiv.querySelector('#checklist-header-area');

        if (!scrollableArea || !footerArea || !headerArea) {
            console.error("MWI Tasklist: Core layout elements missing during render!");
            return;
        }

        const elements = {
            sectionContainer: scrollableArea.querySelector('#sectionContainer'),
            completedSectionContainer: scrollableArea.querySelector('#mwi-completed-section-container'),
            taskCounter: headerArea.querySelector('#taskCounter'),
            addItemInput: footerArea.querySelector('#addItemInput'),
            addButton: footerArea.querySelector('#addButton'),
            sectionSelect: footerArea.querySelector('#sectionSelect')
        };

        if (!elements.sectionContainer || !elements.completedSectionContainer || !elements.taskCounter || !elements.addItemInput || !elements.addButton || !elements.sectionSelect) {
             console.error("MWI Tasklist: Checklist UI sub-elements missing during render!", elements);
             return;
        }

        const config = getSavedConfig();
        const items = getChecklistItems();
        const collapsedSections = getCollapsedSections();
        const totalItemCount = items.length;
        let activeItemCount = 0;
        const lastSectionId = GM_getValue(STORAGE_KEY_LAST_SECTION, GLOBAL_SECTION_ID);

        const scrollPosition = scrollableArea.scrollTop;

        elements.sectionContainer.innerHTML = '';
        elements.completedSectionContainer.innerHTML = '';
        elements.sectionSelect.innerHTML = '';

        const sectionMap = new Map();

        const createOption = (value, text, isSelected) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if (isSelected) option.selected = true;
            elements.sectionSelect.appendChild(option);
        };
        createOption(GLOBAL_SECTION_ID, 'Global', lastSectionId === GLOBAL_SECTION_ID);
        config.sections.forEach(section => {
            if (!section || !section.id || !section.name) return;
            createOption(section.id, section.name, lastSectionId === section.id);
        });

        const createSectionDOM = (titleText, sectionId, parentContainerElement) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = (sectionId === COMPLETED_SECTION_ID) ? 'completed-section' : 'task-section';
            sectionDiv.dataset.sectionId = sectionId;

            const headerDiv = document.createElement('div');
            headerDiv.className = (sectionId === COMPLETED_SECTION_ID) ? 'completed-header' : 'section-header';
            headerDiv.title = 'Click to collapse/expand section';

            const headerTitleDiv = document.createElement('div');
            headerTitleDiv.className = 'section-header-title';

            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'section-toggle-icon';
            toggleIcon.innerHTML = '▼';
            headerTitleDiv.appendChild(toggleIcon);

            const title = document.createElement('h4');
            title.textContent = titleText;
            headerTitleDiv.appendChild(title);
            headerDiv.appendChild(headerTitleDiv);

            if (sectionId !== COMPLETED_SECTION_ID) {
                 const clearButton = document.createElement('button');
                 clearButton.textContent = 'Clear';
                 clearButton.className = 'clear-section-button clear-list-button';
                 clearButton.title = `Clear active tasks in '${titleText}'`;
                 clearButton.dataset.sectionId = sectionId;
                 clearButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleClearSection(e);
                 });
                 headerDiv.appendChild(clearButton);
            } else {
                 const clearCompletedButton = document.createElement('button');
                 clearCompletedButton.textContent = 'Clear';
                 clearCompletedButton.classList.add('clear-list-button');
                 clearCompletedButton.title = 'Delete all completed tasks';
                 clearCompletedButton.addEventListener('click', (e) => {
                     e.stopPropagation();
                     if (confirm('Are you sure you want to delete all COMPLETED tasks?')) {
                         const items = getChecklistItems();
                         const activeItems = items.filter(item => !item.checked);
                         setChecklistItems(activeItems);
                         renderChecklist();
                     }
                 });
                 headerDiv.appendChild(clearCompletedButton);
            }

            sectionDiv.appendChild(headerDiv);

            const ul = document.createElement('ul');
            ul.dataset.sectionId = sectionId;
            sectionDiv.appendChild(ul);

            headerDiv.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    toggleSectionCollapse(sectionId, sectionDiv);
                }
            });

            if (collapsedSections.includes(sectionId)) {
                sectionDiv.classList.add('collapsed');
            }

            sectionMap.set(sectionId, ul);
            parentContainerElement.appendChild(sectionDiv);

            enableDragSort(ul);
            enableDragSort(headerDiv);
        };

        createSectionDOM('Global Tasks', GLOBAL_SECTION_ID, elements.sectionContainer);
        config.sections.forEach(section => {
            if (!section || !section.id || !section.name) return;
            createSectionDOM(section.name, section.id, elements.sectionContainer);
        });

        createSectionDOM('Completed', COMPLETED_SECTION_ID, elements.completedSectionContainer);

        items.forEach((item) => {
            if (!item || !item.id) return;

            const listItem = createChecklistItemElement(item);
            let targetUl;

            if (item.checked) {
                targetUl = sectionMap.get(COMPLETED_SECTION_ID);
            } else {
                activeItemCount++;
                const currentItemSectionId = item.sectionId || GLOBAL_SECTION_ID;
                targetUl = sectionMap.get(currentItemSectionId);
                if (!targetUl) {
                    console.warn(`MWI Tasklist: Item "${item.text}" belongs to non-existent section "${currentItemSectionId}". Moving to Global.`);
                    targetUl = sectionMap.get(GLOBAL_SECTION_ID);
                }
            }

            if (targetUl) {
                targetUl.appendChild(listItem);
            } else {
                 console.error(`MWI Tasklist: Could not find target UL for item:`, item);
            }
        });

        let counterText = `(${activeItemCount} / ${MAX_TOTAL_ITEMS})`;
        elements.taskCounter.classList.remove('full');
        if (totalItemCount >= MAX_TOTAL_ITEMS) {
            counterText += ' *FULL*';
            elements.taskCounter.classList.add('full');
        }
        elements.taskCounter.textContent = counterText;

        const isListFull = totalItemCount >= MAX_TOTAL_ITEMS;
        elements.addItemInput.disabled = isListFull;
        elements.addButton.disabled = isListFull;
        elements.sectionSelect.disabled = isListFull;

        scrollableArea.scrollTop = scrollPosition;

        updateToggleAllButtonState();
    }

    function handleClearSection(event) {
        const sectionIdToClear = event.target.dataset.sectionId;
        if (!sectionIdToClear) return;

        const config = getSavedConfig();
        const sectionInfo = config.sections.find(s => s.id === sectionIdToClear);
        const sectionName = sectionIdToClear === GLOBAL_SECTION_ID ? "Global Tasks" : (sectionInfo?.name || `Section ${sectionIdToClear}`);

        if (confirm(`Clear all ACTIVE tasks in the "${sectionName}" section? (Completed tasks will remain)`)) {
            const currentItems = getChecklistItems();
            const itemsToKeep = currentItems.filter(item => {
                return item.checked || (!item.checked && (item.sectionId || GLOBAL_SECTION_ID) !== sectionIdToClear);
            });
            setChecklistItems(itemsToKeep);
            renderChecklist();
        }
    }

     function toggleSettingsArea() {
         const settingsArea = document.getElementById('settingsArea');
         const settingsLabel = document.getElementById('settingsToggleLabel');
         if (!settingsArea || !settingsLabel) return;

         const isVisible = settingsArea.style.display === 'flex';
         settingsArea.style.display = isVisible ? 'none' : 'flex';
         settingsLabel.textContent = isVisible ? 'Task Sections Settings ▼' : 'Task Sections Settings ▲';

         if (!isVisible) {
             const currentConfig = getSavedConfig();
             const countSelect = document.getElementById('settingsSectionCount');
             countSelect.value = currentConfig.sections.length;

             for(let i = 0; i < MAX_CUSTOM_SECTIONS; i++) {
                 const nameInput = settingsArea.querySelector(`#settingsSectionName${i+1}`);
                 const inputDiv = settingsArea.querySelector(`#settingsSectionNameDiv${i+1}`);
                 if (nameInput && inputDiv) {
                     const sectionData = currentConfig.sections[i];
                     nameInput.value = sectionData ? sectionData.name : '';
                     inputDiv.classList.remove('marked-for-removal');
                 }
             }
             updateSectionNameInputs(currentConfig.sections.length, currentConfig.sections.length);
         }
     }

     function updateSectionNameInputs(selectedCount, savedCount) {
         const settingsArea = document.getElementById('settingsArea');
         if (!settingsArea) return;

         for (let i = 0; i < MAX_CUSTOM_SECTIONS; i++) {
             const inputDiv = settingsArea.querySelector(`#settingsSectionNameDiv${i+1}`);
             const nameInput = inputDiv?.querySelector(`#settingsSectionName${i+1}`);
             if (inputDiv && nameInput) {
                 const shouldBeVisibleForSelection = i < selectedCount;
                 const existsInSavedConfig = i < savedCount;

                 const shouldDisplay = shouldBeVisibleForSelection || (existsInSavedConfig && !shouldBeVisibleForSelection);
                 inputDiv.classList.toggle('visible', shouldDisplay);

                 const markedForRemoval = existsInSavedConfig && !shouldBeVisibleForSelection;
                 inputDiv.classList.toggle('marked-for-removal', markedForRemoval);
             }
         }
     }

     function saveSettingsHandler() {
         const currentConfig = getSavedConfig();
         const countSelect = document.getElementById('settingsSectionCount');
         const newCount = parseInt(countSelect.value, 10);
         const newSections = [];
         const preservedSectionIds = new Set([GLOBAL_SECTION_ID, COMPLETED_SECTION_ID]);
         let itemsModified = false;
         const namesEncountered = new Set();

         for (let i = 0; i < newCount; i++) {
             const nameInput = document.getElementById(`settingsSectionName${i+1}`);
             let baseName = (nameInput.value.trim() || `Section ${i+1}`).substring(0, MAX_ITEM_LENGTH);
             let name = baseName;
             let duplicateCounter = 1;

             while (namesEncountered.has(name.toLowerCase()) || name.toLowerCase() === 'global' || name.toLowerCase() === 'completed') {
                 name = `${baseName}_${duplicateCounter++}`.substring(0, MAX_ITEM_LENGTH);
                 if (duplicateCounter > 10) {
                      name = generateUniqueId();
                      console.warn(`MWI Tasklist: Could not generate unique name for "${baseName}", using ID.`);
                      break;
                 }
             }
             namesEncountered.add(name.toLowerCase());

             const existingSection = (i < currentConfig.sections.length) ? currentConfig.sections[i] : null;
             const id = existingSection ? existingSection.id : generateUniqueId();

             newSections.push({ id: id, name: name });
             preservedSectionIds.add(id);
         }

         const currentItems = getChecklistItems();
         const updatedItems = currentItems.map(item => {
             if (!item.checked && item.sectionId && !preservedSectionIds.has(item.sectionId)) {
                 item.sectionId = GLOBAL_SECTION_ID;
                 itemsModified = true;
             }
             return item;
         });

         if (itemsModified) {
             setChecklistItems(updatedItems);
         }

         saveConfig({ sections: newSections });
         toggleSettingsArea();
         renderChecklist();
     }

    function createChecklistUI() {
        if (document.getElementById(checklistId)) return;
        const checklistDiv = document.createElement('div');
        checklistDiv.id = checklistId;

        const startMinimizedPref = GM_getValue(STORAGE_KEY_START_MINIMIZED, false);

        applyPosition(checklistDiv, loadPosition());

        if (startMinimizedPref) {
             checklistDiv.classList.add('minimized');
        }

        let offsetX, offsetY;
        let isWindowDragging = false;

        function startDrag(e) {
            const canDrag = (!checklistDiv.classList.contains('minimized') && e.target.matches('h3')) ||
                            (checklistDiv.classList.contains('minimized') && e.target.closest('.minimized-content-container'));

            if (!canDrag || e.target.closest('button, input, select, a, .drag-handle, .section-header, .completed-header, #optionsPanel, .options-cog-button')) {
                return;
            }

            isWindowDragging = true;
            checklistDiv.style.opacity = '0.88';
            checklistDiv.style.transition = 'none';
            checklistDiv.style.cursor = 'grabbing';
            const rect = checklistDiv.getBoundingClientRect();

            offsetX = rect.right - e.clientX;
            offsetY = e.clientY - rect.top;

            checklistDiv.style.left = '';
            checklistDiv.style.right = (window.innerWidth - rect.right) + 'px';
            checklistDiv.style.top = rect.top + 'px';

            document.addEventListener('mousemove', dragWindow);
            document.addEventListener('mouseup', stopWindowDrag, { once: true });
            e.preventDefault();
        }

        function dragWindow(e) {
            if (!isWindowDragging) return;

            let newY = e.clientY - offsetY;
            let newXRight = window.innerWidth - (e.clientX + offsetX);

            newY = Math.max(0, Math.min(newY, window.innerHeight - checklistDiv.offsetHeight));
            newXRight = Math.max(0, Math.min(newXRight, window.innerWidth - checklistDiv.offsetWidth));

            checklistDiv.style.top = newY + 'px';
            checklistDiv.style.right = newXRight + 'px';
        }

        function stopWindowDrag() {
            if (!isWindowDragging) return;
            isWindowDragging = false;
            checklistDiv.style.opacity = '';
            checklistDiv.style.transition = '';
            checklistDiv.style.cursor = checklistDiv.classList.contains('minimized') ? 'move' : 'default';
            savePosition(checklistDiv);
            document.removeEventListener('mousemove', dragWindow);
        }

        function addItem() {
            const addItemInput = document.getElementById('addItemInput');
            const sectionSelect = document.getElementById('sectionSelect');
            if (!addItemInput || !sectionSelect || addItemInput.disabled) return;

            const selectedSectionId = sectionSelect.value;
            let newItemText = addItemInput.value.trim();

            if (newItemText.length > MAX_ITEM_LENGTH) {
                newItemText = newItemText.substring(0, MAX_ITEM_LENGTH);
                addItemInput.value = newItemText;
            }

            if (newItemText) {
                const currentItems = getChecklistItems();
                if (currentItems.length >= MAX_TOTAL_ITEMS) {
                    alert(`Maximum number of tasks (${MAX_TOTAL_ITEMS}) reached.`);
                    return;
                }
                const newItem = {
                    id: generateUniqueId(),
                    text: newItemText,
                    checked: false,
                    sectionId: selectedSectionId
                };
                currentItems.push(newItem);
                setChecklistItems(currentItems);

                GM_setValue(STORAGE_KEY_LAST_SECTION, selectedSectionId);

                renderChecklist();
                addItemInput.value = '';
                addItemInput.focus();
            }
        }

        const minimizedContainer = document.createElement('div');
        minimizedContainer.className = 'minimized-content-container';
        const minimizedLabel = document.createElement('span');
        minimizedLabel.className = 'minimized-label';
        minimizedLabel.textContent = minimizedLabelText;
        minimizedContainer.appendChild(minimizedLabel);
        const showButton = document.createElement('a');
        showButton.href = '#';
        showButton.role = 'button';
        showButton.className = 'show-button toggle-button';
        showButton.textContent = 'Show';
        showButton.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            checklistDiv.classList.remove('minimized');
            applyPosition(checklistDiv, loadPosition());
            renderChecklist();
        });
        minimizedContainer.appendChild(showButton);
        checklistDiv.appendChild(minimizedContainer);

        const title = document.createElement('h3');
        title.textContent = checklistTitle;
        checklistDiv.appendChild(title);

        const headerButtonsContainer = document.createElement('div');
        headerButtonsContainer.className = 'header-buttons-container';

        const optionsCogButton = document.createElement('button');
        optionsCogButton.className = 'options-cog-button';
        optionsCogButton.innerHTML = '⚙️';
        optionsCogButton.title = 'Options';
        optionsCogButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const panel = document.getElementById('optionsPanel');
            if (panel) {
                const isVisible = panel.style.display === 'block';
                panel.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    const checkbox = document.getElementById('startMinimizedCheckbox');
                    if (checkbox) {
                        checkbox.checked = GM_getValue(STORAGE_KEY_START_MINIMIZED, false);
                    }
                }
            }
        });
        headerButtonsContainer.appendChild(optionsCogButton);

        const hideButton = document.createElement('button');
        hideButton.className = 'hide-button toggle-button';
        hideButton.textContent = 'Hide';
        hideButton.title = 'Minimize list';
        hideButton.addEventListener('click', (e) => {
            e.stopPropagation();
            savePosition(checklistDiv);
            checklistDiv.classList.add('minimized');
            const panel = document.getElementById('optionsPanel');
            if (panel) panel.style.display = 'none';
        });
        headerButtonsContainer.appendChild(hideButton);
        checklistDiv.appendChild(headerButtonsContainer);

        const optionsPanel = document.createElement('div');
        optionsPanel.id = 'optionsPanel';
        optionsPanel.addEventListener('click', (e) => e.stopPropagation());

        const startMinimizedLabel = document.createElement('label');
        const startMinimizedCheckbox = document.createElement('input');
        startMinimizedCheckbox.type = 'checkbox';
        startMinimizedCheckbox.id = 'startMinimizedCheckbox';
        startMinimizedCheckbox.checked = startMinimizedPref;

        startMinimizedCheckbox.addEventListener('change', () => {
            GM_setValue(STORAGE_KEY_START_MINIMIZED, startMinimizedCheckbox.checked);
        });

        startMinimizedLabel.appendChild(startMinimizedCheckbox);
        startMinimizedLabel.appendChild(document.createTextNode(' Start Minimized'));
        optionsPanel.appendChild(startMinimizedLabel);
        checklistDiv.appendChild(optionsPanel);

        const headerArea = document.createElement('div');
        headerArea.id = 'checklist-header-area';
        checklistDiv.appendChild(headerArea);

        const listControlsDiv = document.createElement('div');
        listControlsDiv.className = 'list-controls';
        const toggleAllButton = document.createElement('button');
        toggleAllButton.id = 'toggleAllSectionsButton';
        toggleAllButton.addEventListener('click', handleToggleAllSections);
        listControlsDiv.appendChild(toggleAllButton);
        const taskCounterDiv = document.createElement('span');
        taskCounterDiv.id = 'taskCounter';
        listControlsDiv.appendChild(taskCounterDiv);
        const clearAllButton = document.createElement('button');
        clearAllButton.id = 'clearAllButton';
        clearAllButton.textContent = 'Clear All';
        clearAllButton.title = 'Delete ALL tasks (active and completed)';
        clearAllButton.classList.add('clear-list-button');
        clearAllButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
                setChecklistItems([]);
                renderChecklist();
            }
        });
        listControlsDiv.appendChild(clearAllButton);
        headerArea.appendChild(listControlsDiv);

        const settingsToggleLabel = document.createElement('div');
        settingsToggleLabel.id = 'settingsToggleLabel';
        settingsToggleLabel.textContent = 'Task Sections Settings ▼';
        settingsToggleLabel.title = 'Show/hide section management';
        settingsToggleLabel.style.cursor = 'pointer';
        settingsToggleLabel.addEventListener('click', toggleSettingsArea);
        headerArea.appendChild(settingsToggleLabel);

        const settingsArea = document.createElement('div');
        settingsArea.id = 'settingsArea';
        let sectionCountOptions = '';
        for (let i = 0; i <= MAX_CUSTOM_SECTIONS; i++) { sectionCountOptions += `<option value="${i}">${i}</option>`; }
        let sectionNameInputs = '';
        for (let i = 0; i < MAX_CUSTOM_SECTIONS; i++) {
            sectionNameInputs += `
            <div id="settingsSectionNameDiv${i+1}" class="settings-section-name">
                <div class="settings-input-row">
                    <label for="settingsSectionName${i+1}">Name ${i+1}:</label>
                    <input type="text" id="settingsSectionName${i+1}" maxlength="${MAX_ITEM_LENGTH}">
                </div>
                <span class="remove-indicator">(tasks will move to Global)</span>
            </div>`;
        }
        settingsArea.innerHTML = `
            <div class="settings-row-with-button">
                <label for="settingsSectionCount">Sections:</label>
                <select id="settingsSectionCount" title="Number of custom sections (0-${MAX_CUSTOM_SECTIONS})">${sectionCountOptions}</select>
                <button id="saveSettingsButtonTop" title="Save section changes">Save</button>
            </div>
            ${sectionNameInputs}
            <button id="saveSettingsButton" title="Save section changes">Save Settings</button>
        `;
        headerArea.appendChild(settingsArea);

        const countSelect = settingsArea.querySelector('#settingsSectionCount');
        countSelect.addEventListener('change', () => {
            const currentConfig = getSavedConfig();
            updateSectionNameInputs(parseInt(countSelect.value, 10), currentConfig.sections.length);
        });
        settingsArea.querySelector('#saveSettingsButton').addEventListener('click', saveSettingsHandler);
        settingsArea.querySelector('#saveSettingsButtonTop').addEventListener('click', saveSettingsHandler);

        const scrollableArea = document.createElement('div');
        scrollableArea.id = 'checklist-scrollable-area';
        checklistDiv.appendChild(scrollableArea);

        const sectionContainer = document.createElement('div');
        sectionContainer.id = 'sectionContainer';
        scrollableArea.appendChild(sectionContainer);

        const completedSectionContainer = document.createElement('div');
        completedSectionContainer.id = 'mwi-completed-section-container';
        scrollableArea.appendChild(completedSectionContainer);

        const footerArea = document.createElement('div');
        footerArea.id = 'checklist-footer-area';
        checklistDiv.appendChild(footerArea);

        const addItemDiv = document.createElement('div');
        addItemDiv.id = "addItemDiv";
        const addItemRow1 = document.createElement('div');
        addItemRow1.className = 'add-item-row1';
        const addSectionLabel = document.createElement('label');
        addSectionLabel.id = 'addSectionLabel';
        addSectionLabel.textContent = 'Add To:';
        addSectionLabel.htmlFor = 'sectionSelect';
        const sectionSelectDropdown = document.createElement('select');
        sectionSelectDropdown.id = 'sectionSelect';
        sectionSelectDropdown.title = 'Choose section for new task';
        addItemRow1.appendChild(addSectionLabel);
        addItemRow1.appendChild(sectionSelectDropdown);
        const addItemRow2 = document.createElement('div');
        addItemRow2.className = 'add-item-row2';
        const addItemInput = document.createElement('input');
        addItemInput.id = 'addItemInput';
        addItemInput.type = 'text';
        addItemInput.placeholder = 'New item text';
        addItemInput.maxLength = MAX_ITEM_LENGTH;
        addItemInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !addItemInput.disabled) {
                 event.preventDefault();
                 addItem();
            }
        });
        const addButton = document.createElement('button');
        addButton.id = 'addButton';
        addButton.textContent = 'Add';
        addButton.title = 'Add new task to selected section';
        addButton.addEventListener('click', addItem);
        addItemRow2.appendChild(addItemInput);
        addItemRow2.appendChild(addButton);
        addItemDiv.appendChild(addItemRow1);
        addItemDiv.appendChild(addItemRow2);
        footerArea.appendChild(addItemDiv);

        checklistDiv.addEventListener('mousedown', startDrag);

        document.addEventListener('click', (e) => {
            const panel = document.getElementById('optionsPanel');
            if (panel && panel.style.display === 'block' && !optionsCogButton.contains(e.target) && !panel.contains(e.target)) {
                panel.style.display = 'none';
            }
        }, true);

        document.body.appendChild(checklistDiv);

        if (!startMinimizedPref) {
            renderChecklist();
        }
    }

    let draggedItemElement = null;

    function enableDragSort(element) {
        element.removeEventListener('dragstart', handleDragStart);
        element.removeEventListener('dragend', handleDragEnd);
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('dragleave', handleDragLeave);
        element.removeEventListener('drop', handleDrop);

        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragleave', handleDragLeave);
        element.addEventListener('drop', handleDrop);
    }

     function handleDragStart(e) {
        if (e.target.classList.contains('drag-handle')) {
            draggedItemElement = e.target.closest('li');

            if (!draggedItemElement || draggedItemElement.querySelector('input[type="checkbox"]:checked')) {
                e.preventDefault();
                draggedItemElement = null;
                return;
            }

            setTimeout(() => {
                if (draggedItemElement) draggedItemElement.classList.add('dragging');
            }, 0);

            e.dataTransfer.effectAllowed = 'move';
            try {
                e.dataTransfer.setData('text/plain', draggedItemElement.dataset.itemId);
            } catch (err) { console.warn("MWI Tasklist: Could not set drag data.", err); }
        } else {
             if (e.target.closest(`#${checklistId}`)) { e.preventDefault(); }
        }
    }

    function handleDragEnd(e) {
        if (draggedItemElement) {
            draggedItemElement.classList.remove('dragging');
        }
        document.querySelectorAll(`#${checklistId} li.drag-over-before, #${checklistId} li.drag-over-after`).forEach(item => {
             item.classList.remove('drag-over-before', 'drag-over-after'); });
         document.querySelectorAll(`#${checklistId} ul.drag-over-empty`).forEach(ul => {
             ul.classList.remove('drag-over-empty'); });
         document.querySelectorAll(`#${checklistId} .task-section.drag-over-section, #${checklistId} .completed-section.drag-over-section`).forEach(sec => {
             sec.classList.remove('drag-over-section'); });

        draggedItemElement = null;
    }

     function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!draggedItemElement) return;

        const targetList = e.target.closest('ul[data-section-id]');
        const targetSection = e.target.closest('.task-section, .completed-section');
        const targetItem = e.target.closest('li');
        const targetHeader = e.target.closest('.section-header, .completed-header');

        let currentTargetList = targetList;
        if (!currentTargetList && targetSection) { currentTargetList = targetSection.querySelector('ul[data-section-id]'); }
        if (!currentTargetList && targetItem) { currentTargetList = targetItem.closest('ul[data-section-id]'); }
        if (!currentTargetList && targetHeader) { currentTargetList = targetHeader.closest('.task-section, .completed-section')?.querySelector('ul[data-section-id]');}

        document.querySelectorAll(`#${checklistId} li.drag-over-before, #${checklistId} li.drag-over-after`).forEach(item => {
            item.classList.remove('drag-over-before', 'drag-over-after'); });
        document.querySelectorAll(`#${checklistId} ul.drag-over-empty`).forEach(ul => {
             ul.classList.remove('drag-over-empty'); });
        document.querySelectorAll(`#${checklistId} .task-section.drag-over-section, #${checklistId} .completed-section.drag-over-section`).forEach(sec => {
             if (sec !== targetSection) { sec.classList.remove('drag-over-section'); }
         });

         if (targetSection) { targetSection.classList.add('drag-over-section'); }

         if (currentTargetList) {
            const isListEmpty = !currentTargetList.querySelector('li:not(.dragging)');

            if (targetItem && targetItem !== draggedItemElement && targetItem.parentNode === currentTargetList) {
                const targetRect = targetItem.getBoundingClientRect();
                const isAfter = e.clientY > targetRect.top + targetRect.height / 2;
                targetItem.classList.add(isAfter ? 'drag-over-after' : 'drag-over-before');
            }
            else if (isListEmpty && currentTargetList && !targetItem) {
                currentTargetList.classList.add('drag-over-empty');
            }
         }
    }

    function handleDragLeave(e) {
        const relatedTarget = e.relatedTarget;
        const checklistElement = document.getElementById(checklistId);

        if (!relatedTarget || (checklistElement && !checklistElement.contains(relatedTarget))) {
            handleDragEnd(e);
        } else {
             if (e.target.matches('li')) {
                 e.target.classList.remove('drag-over-before', 'drag-over-after');
             }
             if (e.target.matches('ul')) {
                 e.target.classList.remove('drag-over-empty');
             }
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const currentDraggedItemElement = draggedItemElement;
        const draggedItemId = currentDraggedItemElement?.dataset.itemId;

        draggedItemElement = null;

        if (!currentDraggedItemElement || !draggedItemId) {
             handleDragEnd(e);
             return;
        }

        const targetSectionDiv = e.target.closest('.task-section, .completed-section');
        if (!targetSectionDiv) { handleDragEnd(e); renderChecklist(); return; }

        const targetListElement = targetSectionDiv.querySelector('ul[data-section-id]');
        if (!targetListElement) { handleDragEnd(e); renderChecklist(); return; }

        const targetSectionId = targetListElement.dataset.sectionId;
        const dropTargetItemElement = e.target.closest('li:not(.dragging)');

        const allItems = getChecklistItems();

        const draggedItemDataIndex = findActualItemIndexById(draggedItemId, allItems);
        if (draggedItemDataIndex === -1) {
            console.error("MWI Tasklist: Dragged item data not found!");
            handleDragEnd(e); renderChecklist(); return;
        }

        const [movedItemData] = allItems.splice(draggedItemDataIndex, 1);

        const isDroppingOnCompleted = targetSectionId === COMPLETED_SECTION_ID;
        movedItemData.checked = isDroppingOnCompleted;
        if (!isDroppingOnCompleted) {
            movedItemData.sectionId = targetSectionId;
        } else {
             if (!movedItemData.sectionId) { movedItemData.sectionId = GLOBAL_SECTION_ID; }
        }

        let finalInsertIndex = -1;

        if (dropTargetItemElement && dropTargetItemElement.parentNode === targetListElement) {
            const dropTargetItemId = dropTargetItemElement.dataset.itemId;
            const dropTargetDataIndex = findActualItemIndexById(dropTargetItemId, allItems);

            if (dropTargetDataIndex !== -1) {
                const targetRect = dropTargetItemElement.getBoundingClientRect();
                const isAfter = e.clientY > targetRect.top + targetRect.height / 2;
                finalInsertIndex = isAfter ? dropTargetDataIndex + 1 : dropTargetDataIndex;
            }
        }

        if (finalInsertIndex === -1) {
            let targetGroupStartIndex = -1;
            let targetGroupEndIndex = -1;

            if (isDroppingOnCompleted) {
                 targetGroupStartIndex = allItems.findIndex(item => item.checked);
                 targetGroupEndIndex = allItems.length;
                 finalInsertIndex = (targetGroupStartIndex === -1) ? targetGroupEndIndex : targetGroupStartIndex;
            } else {
                 targetGroupStartIndex = allItems.findIndex(item => !item.checked && (item.sectionId || GLOBAL_SECTION_ID) === targetSectionId);
                 let nextDifferentItemIndex = allItems.findIndex((item, idx) =>
                     idx >= (targetGroupStartIndex === -1 ? 0 : targetGroupStartIndex) &&
                     (item.checked || (item.sectionId || GLOBAL_SECTION_ID) !== targetSectionId)
                 );
                 targetGroupEndIndex = (nextDifferentItemIndex === -1) ? allItems.length : nextDifferentItemIndex;
                 finalInsertIndex = targetGroupEndIndex;
            }
        }

        finalInsertIndex = Math.max(0, Math.min(finalInsertIndex, allItems.length));

        allItems.splice(finalInsertIndex, 0, movedItemData);

        setChecklistItems(allItems);
        handleDragEnd(e);
        renderChecklist();
    }

    function initialize() {
        if (document.getElementById(checklistId)) {
            return;
        }
        createChecklistUI();
    }

    function waitForGameLoad() {
        if (document.body) {
            initialize();
        } else {
            setTimeout(waitForGameLoad, 300);
        }
    }

    waitForGameLoad();

})();