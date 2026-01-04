// ==UserScript==
// @name         SillyTavern ComfyUI/WebUI 生图助手
// @namespace    http://tampermonkey.net/
// @version      4.9.1
// @description  ComfyUI和WebUI双端整合，用于SillyTavern的生图插件
// @author       白大瑾
// @match        http://127.0.0.1:*/*
// @match        http://localhost:*/*
// @connect      127.0.0.1
// @connect      localhost
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/540513/SillyTavern%20ComfyUIWebUI%20%E7%94%9F%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540513/SillyTavern%20ComfyUIWebUI%20%E7%94%9F%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设备检测
    const DeviceDetector = {
        isMobile: () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                (window.innerWidth <= 768) ||
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0);
        },

        isTablet: () => {
            return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth <= 1024;
        },

        isTouchDevice: () => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        getDeviceType: () => {
            if (DeviceDetector.isMobile()) return 'mobile';
            if (DeviceDetector.isTablet()) return 'tablet';
            return 'desktop';
        }
    };

    // --- 配置常量 ---
    const BUTTON_ID = 'comfyui-launcher-button';
    const PANEL_ID = 'comfyui-panel';
    const POLLING_TIMEOUT_MS = 3600000;
    const POLLING_INTERVAL_MS = 2000;
    const STORAGE_KEY_IMAGES = 'comfyui_generated_images';
    const STORAGE_KEY_WORKFLOWS = 'comfyui_saved_workflows';
    const STORAGE_KEY_SHORTCUTS = 'comfyui_keyboard_shortcuts';
    const STORAGE_KEY_MODE = 'generation_mode';
    const STORAGE_KEY_PROMPT_PRESETS = 'comfyui_prompt_presets';
    const STORAGE_KEY_COMFYUI_LORA_PRESETS = 'comfyui_lora_presets';

    // 生成模式枚举
    const MODES = {
        COMFYUI: 'comfyui',
        WEBUI: 'webui'
    };

    const DEFAULT_SETTINGS = {
        mode: MODES.COMFYUI,
        url: 'http://127.0.0.1:8188',
        webuiUrl: 'http://127.0.0.1:7860',
        workflow: '',
        startTag: '开始生成',
        genWidth: 512,
        genHeight: 768,
        displayWidth: 400,
        displayHeight: 0,
        autoGenerate: false,
        model: '',
        unetModel: '',
        webuiModel: '',
        selectedLoras: [],
        sampler: 'euler',
        scheduler: 'normal',
        steps: 20,
        cfg: 7.0,
        positivePrompt: '',
        negativePrompt: '',
        webuiSampler: 'Euler a',
        webuiScheduler: 'Automatic',
        denoisingStrength: 0.7,
        enableHires: false,
        hiresUpscaler: 'Latent',
        hiresSteps: 0,
        hiresUpscale: 2.0,
        hiresDenoising: 0.5
    };

    // 默认快捷键配置
    const DEFAULT_SHORTCUTS = {
        togglePanel: 'Ctrl+Shift+C',
        saveWorkflow: 'Ctrl+Shift+S',
        newWorkflow: 'Ctrl+Shift+N',
        quickGenerate: 'Ctrl+Shift+G',
        convertPlaceholders: 'Ctrl+Shift+P',
        testConnection: 'Ctrl+Shift+T',
        closePanel: 'Escape',
        saveEdit: 'Ctrl+S',
        switchMode: 'Ctrl+Shift+M'
    };

    // --- 全局状态 ---
    let currentEditingWorkflow = null;
    let isEditMode = false;
    let currentShortcuts = { ...DEFAULT_SHORTCUTS };
    let currentMode = MODES.COMFYUI;
    let availableLoras = [];
    let availableEmbeddings = [];
    let availableComfyUILoras = [];

    // --- 样式注入 ---
    GM_addStyle(`
        :root {
            --vp-bg-color: rgba(10, 15, 25, 0.9);
            --vp-accent-color: #00d1ff;
            --vp-text-color: #e0e5f0;
            --vp-border-color: rgba(0, 209, 255, 0.3);
            --vp-glow-color: rgba(0, 209, 255, 0.6);
            --vp-error-color: #ff4747;
            --vp-success-color: #00ff9c;
            --vp-font: 'Segoe UI', 'Roboto', system-ui, sans-serif;
            --vp-warning-color: #ffa500;
            --vp-comfyui-color: #00d1ff;
            --vp-webui-color: #ff6b35;
        }

        #${PANEL_ID} {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 750px;
            z-index: 9999;
            color: var(--vp-text-color);
            background: var(--vp-bg-color);
            border: 1px solid var(--vp-border-color);
            border-radius: 12px;
            box-shadow: 0 0 25px rgba(0,0,0,0.5), 0 0 15px var(--vp-glow-color) inset;
            padding: 20px;
            box-sizing: border-box;
            backdrop-filter: blur(12px);
            font-family: var(--vp-font);
            flex-direction: column;
            max-height: 90vh;
        }

        #${PANEL_ID}.dragging {
            transform: none !important;
        }

        #${PANEL_ID} .panel-control-bar {
            cursor: move;
            padding-bottom: 15px;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--vp-border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            text-shadow: 0 0 5px var(--vp-accent-color);
            position: relative;
        }

        #${PANEL_ID} .panel-control-bar b {
            font-size: 1.4em;
            margin-left: 10px;
            font-weight: 600;
        }

        #${PANEL_ID} .floating_panel_close {
            cursor: pointer;
            font-size: 1.6em;
            transition: color 0.3s, text-shadow 0.3s;
        }

        #${PANEL_ID} .floating_panel_close:hover {
            color: var(--vp-accent-color);
            text-shadow: 0 0 8px var(--vp-accent-color);
        }

        #${PANEL_ID} .panel-reset-position {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 1.2em;
            color: var(--vp-text-color);
            opacity: 0.6;
            transition: opacity 0.3s, color 0.3s;
            padding: 5px;
        }

        #${PANEL_ID} .panel-reset-position:hover {
            opacity: 1;
            color: var(--vp-accent-color);
        }

        #${PANEL_ID} .comfyui-panel-content {
            overflow-y: auto;
            flex-grow: 1;
            padding-right: 10px;
        }

        #${PANEL_ID} input[type="text"],
        #${PANEL_ID} input[type="number"],
        #${PANEL_ID} select,
        #${PANEL_ID} textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 12px;
            border-radius: 6px;
            border: 1px solid var(--vp-border-color);
            background-color: rgba(0,0,0,0.3);
            color: var(--vp-text-color);
            font-family: var(--vp-font);
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        #${PANEL_ID} input:focus,
        #${PANEL_ID} select:focus,
        #${PANEL_ID} textarea:focus {
            outline: none;
            border-color: var(--vp-accent-color);
            box-shadow: 0 0 10px var(--vp-glow-color);
        }

        #${PANEL_ID} textarea {
            min-height: 80px;
            resize: vertical;
            margin-top: 5px;
        }

        #${PANEL_ID} .workflow-info {
            font-size: 0.9em;
            color: #aaa;
            margin-top: 5px;
            margin-bottom: 15px;
            padding-left: 5px;
            border-left: 2px solid var(--vp-border-color);
        }

        .comfy-button {
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            flex-shrink: 0;
            font-size: 14px;
            background: transparent;
            color: var(--vp-accent-color);
            border: 1px solid var(--vp-accent-color);
            text-shadow: 0 0 2px var(--vp-accent-color);
        }

        .comfy-button:hover:not(:disabled) {
            background: var(--vp-accent-color);
            color: var(--vp-bg-color);
            box-shadow: 0 0 12px var(--vp-glow-color);
            text-shadow: none;
        }

        .comfy-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .comfy-button.testing {
            color: #fff;
            border-color: #f39c12;
            background: rgba(243, 156, 18, 0.2);
        }

        .comfy-button.success {
            color: #fff;
            border-color: var(--vp-success-color);
            background: rgba(0, 255, 156, 0.2);
        }

        .comfy-button.error {
            color: #fff;
            border-color: var(--vp-error-color);
            background: rgba(255, 71, 71, 0.2);
        }

        .comfy-button.warning {
            color: #fff;
            border-color: var(--vp-warning-color);
            background: rgba(255, 165, 0, 0.2);
        }

        .comfy-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        #${PANEL_ID} label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--vp-accent-color);
            opacity: 0.8;
        }

        #options > .options-content > a#${BUTTON_ID} {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #${PANEL_ID} .comfy-auto-generate-container {
            margin: 20px 0;
        }

        #${PANEL_ID} .comfy-auto-generate-label {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            padding: 10px;
            border-radius: 6px;
            border: 1px dashed var(--vp-border-color);
            transition: background-color 0.3s, border-color 0.3s;
        }

        #${PANEL_ID} .comfy-auto-generate-label:hover {
            background-color: rgba(0, 209, 255, 0.05);
            border-color: var(--vp-accent-color);
        }

        #${PANEL_ID} .comfy-auto-generate-label input[type="checkbox"] {
            transform: scale(1.3);
        }

        #${PANEL_ID} .comfy-auto-generate-label span {
            font-weight: normal;
            font-size: 0.9em;
            text-transform: none;
            letter-spacing: 0;
        }

        #${PANEL_ID} .comfy-auto-generate-label b {
            color: var(--vp-text-color);
            text-transform: none;
            letter-spacing: 0;
            font-size: 1.1em;
        }

        .comfy-settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px 20px;
            margin-bottom: 20px;
        }

        .comfy-prompt-area {
            margin-bottom: 20px;
        }

        #comfyui-refresh-models,
        #comfyui-refresh-unets,
        #webui-refresh-models,
        #webui-refresh-loras {
            padding: 8px;
            line-height: 1;
            min-width: 40px;
        }

        .comfy-button-group {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin: 5px 4px;
        }

        .comfy-image-container {
            margin-top: 10px;
            max-width: 100%;
        }

        .comfy-image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--vp-border-color);
            background: rgba(0,0,0,0.2);
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        .workflow-action-row {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            margin-bottom: 25px;
        }

        .workflow-action-row .comfy-button {
            flex: 1;
        }

        .workflow-selector-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
        }

        .workflow-search-container {
            margin-bottom: 15px;
        }

        .workflow-search-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--vp-border-color);
            background-color: rgba(0,0,0,0.3);
            color: var(--vp-text-color);
        }

        .workflow-item {
            display: flex;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 8px;
            justify-content: space-between;
            align-items: center;
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--vp-border-color);
            transition: all 0.3s;
        }

        .workflow-item:hover {
            background: rgba(0, 209, 255, 0.05);
        }

        .workflow-item-title {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 10px;
            cursor: pointer;
        }

        .workflow-item-title:hover {
            color: var(--vp-accent-color);
        }

        .workflow-item-actions {
            display: flex;
            gap: 8px;
        }

        .workflow-item-actions button {
            padding: 5px 10px;
            font-size: 12px;
        }

        .workflow-item.active {
            background: rgba(0, 209, 255, 0.1);
            border-color: var(--vp-accent-color);
        }

        .workflow-item.editing .workflow-item-title {
            display: none;
        }

        .workflow-item.editing .workflow-edit-input {
            display: block;
        }

        .workflow-edit-input {
            display: none;
            flex: 1;
            margin-right: 10px;
        }

        .workflow-save-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: var(--vp-bg-color);
            border: 1px solid var(--vp-border-color);
            border-radius: 12px;
            padding: 20px;
            width: 400px;
            box-shadow: 0 0 25px rgba(0,0,0,0.5);
        }

        .workflow-save-modal h3 {
            margin-top: 0;
            color: var(--vp-accent-color);
        }

        .workflow-save-modal .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .workflow-save-modal input {
            margin-bottom: 10px;
        }

        .workflow-save-modal .overwrite-warning {
            background: rgba(255, 165, 0, 0.1);
            border: 1px solid var(--vp-warning-color);
            border-radius: 6px;
            padding: 10px;
            margin: 10px 0;
            color: var(--vp-warning-color);
        }

        .empty-workflows-message {
            text-align: center;
            padding: 20px;
            font-style: italic;
            color: #888;
        }

        .tab-container {
            margin-bottom: 20px;
        }

        .tab-buttons {
            display: flex;
            border-bottom: 1px solid var(--vp-border-color);
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .tab-button {
            padding: 10px 15px;
            cursor: pointer;
            background: transparent;
            border: none;
            color: var(--vp-text-color);
            font-weight: 600;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }

        .tab-button.active {
            color: var(--vp-accent-color);
            border-bottom-color: var(--vp-accent-color);
        }

        .tab-button:hover:not(.active) {
            border-bottom-color: rgba(0, 209, 255, 0.3);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block !important;
        }

        .tab-content:not(.active) {
            display: none !important;
        }

        .tab-content.comfyui-settings.hidden {
            display: none !important;
        }

        .tab-content.webui-settings:not(.active) {
            display: none !important;
        }

        .workflow-tools {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid var(--vp-border-color);
            border-radius: 8px;
            background: rgba(0,0,0,0.1);
        }

        .workflow-tools h4 {
            margin: 0 0 15px 0;
            color: var(--vp-accent-color);
            font-size: 1.1em;
        }

        .edit-mode-toolbar {
            display: none;
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(0, 209, 255, 0.1);
            border: 1px solid var(--vp-accent-color);
            border-radius: 6px;
        }

        .edit-mode-toolbar.active {
            display: block;
        }

        .edit-mode-toolbar .toolbar-title {
            font-weight: 600;
            color: var(--vp-accent-color);
            margin-bottom: 10px;
        }

        .shortcut-config-grid {
            display: grid;
            grid-template-columns: 1fr auto auto;
            gap: 10px;
            align-items: center;
            margin-bottom: 15px;
        }

        .shortcut-config-item {
            display: contents;
        }

        .shortcut-config-item label {
            margin-bottom: 0;
            text-transform: none;
            font-size: 0.9em;
            opacity: 1;
        }

        .shortcut-input {
            width: 150px;
            padding: 8px;
            font-family: monospace;
            text-align: center;
        }

        .shortcut-input.recording {
            background: rgba(255, 165, 0, 0.2);
            border-color: var(--vp-warning-color);
        }

        .shortcut-input.invalid {
            background: rgba(255, 71, 71, 0.2);
            border-color: var(--vp-error-color);
        }

        .shortcut-description {
            font-size: 0.85em;
            color: #aaa;
            grid-column: 1 / -1;
            margin-top: -5px;
            margin-bottom: 10px;
        }

        .shortcut-status {
            font-size: 0.8em;
            padding: 5px 10px;
            border-radius: 4px;
        }

        .shortcut-status.available {
            background: rgba(0, 255, 156, 0.2);
            color: var(--vp-success-color);
        }

        .shortcut-status.conflict {
            background: rgba(255, 71, 71, 0.2);
            color: var(--vp-error-color);
        }

        .shortcut-status.disabled {
            background: rgba(128, 128, 128, 0.2);
            color: #888;
        }

        /* 模式切换相关样式 */
        .mode-switch-container {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid var(--vp-border-color);
            border-radius: 8px;
            background: rgba(0,0,0,0.1);
        }

        .mode-switch {
            display: flex;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--vp-border-color);
        }

        .mode-switch-option {
            padding: 10px 20px;
            cursor: pointer;
            background: rgba(0,0,0,0.3);
            color: var(--vp-text-color);
            border: none;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            min-width: 100px;
        }

        .mode-switch-option.active.comfyui {
            background: var(--vp-comfyui-color);
            color: white;
        }

        .mode-switch-option.active.webui {
            background: var(--vp-webui-color);
            color: white;
        }

        .mode-switch-option:hover:not(.active) {
            background: rgba(255,255,255,0.1);
        }

        .mode-status {
            font-size: 0.9em;
            color: #aaa;
            flex: 1;
        }

        /* LoRA选择器样式 */
        .lora-selector {
            margin-bottom: 20px;
        }

        .lora-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--vp-border-color);
            border-radius: 6px;
            background: rgba(0,0,0,0.3);
        }

        .lora-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid var(--vp-border-color);
        }

        .lora-item:last-child {
            border-bottom: none;
        }

        .lora-item:hover {
            background: rgba(255,255,255,0.05);
        }

        .lora-info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .lora-name {
            font-weight: 600;
            font-size: 0.9em;
        }

        .lora-alias {
            font-size: 0.8em;
            color: #aaa;
        }

        .lora-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .lora-weight {
            width: 60px;
            padding: 4px 6px;
            font-size: 0.8em;
        }

        .lora-checkbox {
            transform: scale(1.2);
        }

        .selected-loras {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid var(--vp-border-color);
            border-radius: 6px;
            background: rgba(0,0,0,0.2);
        }

        .selected-loras h4 {
            margin: 0 0 10px 0;
            font-size: 0.9em;
            color: var(--vp-accent-color);
        }

        .selected-lora-tag {
            display: inline-block;
            background: var(--vp-accent-color);
            color: white;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 4px;
            font-size: 0.8em;
        }

        .selected-lora-tag .remove {
            margin-left: 5px;
            cursor: pointer;
            font-weight: bold;
        }

        .selected-lora-tag .remove:hover {
            color: var(--vp-error-color);
        }

        /* Embedding选择器样式 */
        .embedding-selector {
            margin-bottom: 20px;
        }

        .embedding-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--vp-border-color);
            border-radius: 6px;
            background: rgba(0,0,0,0.3);
        }

        .embedding-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid var(--vp-border-color);
        }

        .embedding-item:last-child {
            border-bottom: none;
        }

        .embedding-item:hover {
            background: rgba(255,255,255,0.05);
        }

        .embedding-info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .embedding-name {
            font-weight: 600;
            font-size: 0.9em;
        }

        .embedding-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .embedding-weight {
            width: 60px;
            padding: 4px 6px;
            font-size: 0.8em;
        }

        .embedding-checkbox {
            transform: scale(1.2);
        }

        .selected-embeddings {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid var(--vp-border-color);
            border-radius: 6px;
            background: rgba(0,0,0,0.2);
        }

        .selected-embeddings h4 {
            margin: 0 0 10px 0;
            font-size: 0.9em;
            color: var(--vp-accent-color);
        }

        .selected-embedding-tag {
            display: inline-block;
            background: #ff6b35;
            color: white;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 4px;
            font-size: 0.8em;
        }

        .selected-embedding-tag .remove {
            margin-left: 5px;
            cursor: pointer;
            font-weight: bold;
        }

        .selected-embedding-tag .remove:hover {
            color: var(--vp-error-color);
        }

        /* WebUI专用设置样式 */
        .webui-settings {
            display: none;
        }

        .webui-settings.active {
            display: block;
        }

        .comfyui-settings {
            display: block;
        }

        .comfyui-settings.hidden {
            display: none;
        }

        /* 在现有CSS的 @media (max-width: 768px) 部分，修改以下规则： */

@media (max-width: 768px) {
    #${PANEL_ID} {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        transform: none !important;
        border-radius: 0;
        padding: 5px; /* 减少padding */
        z-index: 10000;
        overflow: hidden; /* 防止面板本身滚动 */
    }

    #${PANEL_ID} .panel-control-bar {
        padding: 10px 5px; /* 减少padding */
        margin-bottom: 10px; /* 减少margin */
        position: sticky;
        top: 0;
        background: var(--vp-bg-color);
        z-index: 1;
        flex-shrink: 0; /* 防止压缩 */
    }

    #${PANEL_ID} .comfyui-panel-content {
        height: calc(100vh - 60px); /* 更精确的高度计算 */
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 5px;
        padding-bottom: 20px; /* 底部留出更多空间 */
        box-sizing: border-box;
    }

    /* 减少各种元素的margin和padding */
    fieldset {
        margin-bottom: 15px; /* 减少 */
        padding: 10px; /* 减少 */
    }

    .tab-buttons {
        margin-bottom: 10px; /* 减少 */
        padding-bottom: 5px;
    }

    .tab-button {
        padding: 8px 12px; /* 减少 */
        font-size: 0.85em;
        margin: 2px; /* 添加小的margin */
    }

    .comfy-settings-grid {
        gap: 10px; /* 减少gap */
        margin-bottom: 15px; /* 减少 */
    }

    /* 优化工作流相关元素 */
    .workflow-tools {
        margin-bottom: 15px; /* 减少 */
        padding: 10px; /* 减少 */
    }

    .workflow-action-row {
        margin-top: 10px; /* 减少 */
        margin-bottom: 15px; /* 减少 */
    }

    .workflow-selector-container {
        margin-bottom: 15px; /* 减少 */
    }

    /* 优化缓存网格 */
    .cache-grid {
        max-height: 50vh; /* 限制最大高度 */
        margin-bottom: 20px; /* 确保底部空间 */
    }

    /* 优化LoRA选择器 */
    .lora-selector,
    .embedding-selector {
        margin-bottom: 15px; /* 减少 */
    }

    .lora-list,
    .embedding-list,
    .comfyui-lora-list {
        max-height: 250px; /* 减少最大高度 */
    }

    /* 确保表单元素不会过大 */
    #${PANEL_ID} input[type="text"],
    #${PANEL_ID} input[type="number"],
    #${PANEL_ID} select,
    #${PANEL_ID} textarea {
        padding: 8px 10px; /* 减少padding */
        font-size: 14px; /* 减少字体大小 */
        min-height: 36px; /* 减少最小高度 */
    }

    #${PANEL_ID} textarea {
        min-height: 60px; /* 减少textarea最小高度 */
    }

    /* 优化按钮尺寸 */
    .comfy-button {
        padding: 8px 12px; /* 减少padding */
        font-size: 0.9em;
        min-height: 36px; /* 减少最小高度 */
    }

    /* 添加底部安全区域 */
    .tab-content {
        padding-bottom: env(safe-area-inset-bottom, 20px);
    }
}

/* 增加对小屏幕的额外优化 */
@media (max-width: 480px) {
    #${PANEL_ID} {
        padding: 3px; /* 进一步减少 */
    }

    #${PANEL_ID} .panel-control-bar {
        padding: 8px 3px;
        margin-bottom: 8px;
    }

    #${PANEL_ID} .comfyui-panel-content {
        height: calc(100vh - 50px); /* 更小的控制栏高度 */
        padding-bottom: 30px; /* 更多底部空间 */
    }

    .tab-button {
        padding: 6px 8px;
        font-size: 0.8em;
        margin: 1px;
    }

    fieldset {
        margin-bottom: 10px;
        padding: 8px;
    }

    .comfy-settings-grid {
        gap: 8px;
        margin-bottom: 10px;
    }
}

/* 添加对横屏模式的优化 */
@media (max-width: 768px) and (orientation: landscape) {
    #${PANEL_ID} .comfyui-panel-content {
        height: calc(100vh - 45px); /* 横屏时减少控制栏高度 */
    }

    #${PANEL_ID} .panel-control-bar {
        padding: 5px;
        margin-bottom: 5px;
    }

    .cache-grid {
        max-height: 40vh; /* 横屏时进一步限制高度 */
    }
}

        /* 图片缓存样式 */
.cache-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    max-height: 60vh;
    overflow-y: auto;
    padding: 10px 0;
}

.cache-item {
    border: 1px solid var(--vp-border-color);
    border-radius: 8px;
    background: rgba(0,0,0,0.2);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cache-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.cache-item-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    cursor: pointer;
}

.cache-item-info {
    padding: 10px;
}

.cache-item-prompt {
    font-size: 0.8em;
    color: var(--vp-text-color);
    margin-bottom: 8px;
    max-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cache-item-meta {
    font-size: 0.7em;
    color: #888;
    margin-bottom: 10px;
}

.cache-item-actions {
    display: flex;
    gap: 5px;
}

.cache-item-actions .comfy-button {
    flex: 1;
    padding: 5px 8px;
    font-size: 0.75em;
}

.cache-empty {
    text-align: center;
    padding: 40px 20px;
    color: #888;
    font-style: italic;
}

.cache-image-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 10001;
    justify-content: center;
    align-items: center;
}

.cache-image-modal img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
}

.cache-modal-close {
    position: absolute;
    top: 20px;
    right: 30px;
    color: white;
    font-size: 2em;
    cursor: pointer;
    z-index: 10002;
}
.prompt-preset-container {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--vp-border-color);
    border-radius: 8px;
    background: rgba(0,0,0,0.1);
}

.prompt-preset-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}

.prompt-preset-controls select {
    flex: 1;
}

.prompt-preset-controls button {
    flex-shrink: 0;
    min-width: 80px;
}
    `);

    // ================== LoRA预设管理 ================== //

    /**
 * 当前正在操作的LoRA类型 ('webui' 或 'comfyui')
 */
    let currentLoraPresetType = 'webui';

    /**
 * 加载ComfyUI LoRA预设列表
 */
    async function loadComfyUILoraPresets() {
        const select = document.getElementById('comfyui-lora-preset-select');
        const presets = await GM_getValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, {});

        select.innerHTML = '<option value="">选择LoRA预设...</option>';

        Object.keys(presets).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }

    /**
 * 保存当前ComfyUI LoRA配置为预设
 */
    async function saveCurrentComfyUILoraAsPreset(presetName) {
        const selectedLoras = getCurrentComfyUISelectedLoras();

        const presets = await GM_getValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, {});
        presets[presetName] = {
            loras: selectedLoras,
            timestamp: Date.now()
        };

        await GM_setValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, presets);
        await loadComfyUILoraPresets();
    }

    /**
 * 加载选中的ComfyUI LoRA预设
 */
    async function loadSelectedComfyUILoraPreset(presetName) {
        const presets = await GM_getValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, {});
        const preset = presets[presetName];

        if (preset && preset.loras) {
            // 清除当前选择
            localStorage.setItem('comfyui_selected_loras', JSON.stringify([]));

            // 应用预设
            localStorage.setItem('comfyui_selected_loras', JSON.stringify(preset.loras));

            // 重新渲染界面
            renderComfyUILoraList();
            updateComfyUISelectedLorasDisplay();

            if (typeof toastr !== 'undefined') {
                toastr.success(`已加载ComfyUI LoRA预设"${presetName}"`);
            }
        }
    }

    /**
 * 删除选中的ComfyUI LoRA预设
 */
    async function deleteSelectedComfyUILoraPreset(presetName) {
        const presets = await GM_getValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, {});
        delete presets[presetName];

        await GM_setValue(STORAGE_KEY_COMFYUI_LORA_PRESETS, presets);
        await loadComfyUILoraPresets();

        if (typeof toastr !== 'undefined') {
            toastr.success(`ComfyUI LoRA预设"${presetName}"已删除`);
        }
    }

    /**
 * 显示LoRA预设保存模态框
 */
    function showLoraPresetSaveModal(type) {
        currentLoraPresetType = type;
        const modal = document.getElementById('lora-preset-save-modal');
        const nameInput = document.getElementById('lora-preset-name-input');

        nameInput.value = '';
        modal.style.display = 'block';

        setTimeout(() => nameInput.focus(), 100);
    }

    // ================== 工具函数 ================== //

    /**
 * 检查并修正面板位置
 * @param {HTMLElement} panel - 面板元素
 */
    function checkAndFixPanelPosition(panel) {
        const rect = panel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let needsAdjustment = false;
        let newLeft = parseInt(panel.style.left) || 0;
        let newTop = parseInt(panel.style.top) || 0;

        if (rect.top < 0) {
            newTop = 10;
            needsAdjustment = true;
        }

        if (rect.left < -rect.width + 50) {
            newLeft = 10;
            needsAdjustment = true;
        }

        if (rect.right > viewportWidth + rect.width - 50) {
            newLeft = viewportWidth - rect.width - 10;
            needsAdjustment = true;
        }

        if (rect.bottom > viewportHeight + rect.height - 50) {
            newTop = viewportHeight - rect.height - 10;
            needsAdjustment = true;
        }

        if (needsAdjustment) {
            panel.style.left = `${Math.max(10, newLeft)}px`;
            panel.style.top = `${Math.max(10, newTop)}px`;
            panel.style.transform = 'none';
            panel.classList.add('dragging');
        }
    }

    /**
 * 重置面板位置到屏幕中央
 * @param {HTMLElement} panel - 面板元素
 */
    function resetPanelPosition(panel) {
        const deviceType = DeviceDetector.getDeviceType();

        if (deviceType === 'mobile') {
            panel.style.left = '0';
            panel.style.top = '0';
            panel.style.transform = 'none';
            panel.classList.add('mobile-fullscreen');
        } else {
            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.classList.remove('dragging', 'mobile-fullscreen');
        }

        if (typeof toastr !== 'undefined') {
            toastr.info('面板位置已重置');
        }
    }

    /**
 * HTML转义
 * @param {string} str - 输入字符串
 * @returns {string} - 转义后的字符串
 */
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
 * 封装GM_xmlhttpRequest为Promise
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回请求Promise
 */
    function makeRequest(options) {
        return new Promise((resolve, reject) => {
            // -- 新增代码开始 --
            // 自动清理URL，防止双斜杠问题
            let cleanedUrl = options.url;
            try {
                const urlObj = new URL(cleanedUrl);
                // 使用URL对象重建路径，可以有效去除多余的斜杠
                urlObj.pathname = urlObj.pathname.replace(/\/+/g, '/');
                cleanedUrl = urlObj.toString();
            } catch (e) {
                // 如果URL格式不正确，则不处理，让它在后续请求中自然报错
                console.warn("URL格式无法解析，跳过清理:", options.url, e);
            }
            // -- 新增代码结束 --

            const requestOptions = {
                method: options.method || 'GET',
                url: cleanedUrl, // <-- 使用清理后的URL
                headers: options.headers || {},
                data: options.data,
                timeout: options.timeout || 3600000,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(`API错误: ${response.statusText || response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`网络错误: ${error.message || '未知错误，可能是ComfyUI或WebUI未启动或权限不足'}`)); // <-- 修改了错误信息
                },
                ontimeout: () => {
                    reject(new Error('请求超时'));
                }
            };

            // 如果需要blob响应，添加responseType
            if (options.responseType) {
                requestOptions.responseType = options.responseType;
            }

            GM_xmlhttpRequest(requestOptions);
        });
    }

    /**
 * 生成简单的哈希值
 * @param {string} str - 输入字符串
 * @returns {string} - 生成的哈希ID
 */
    function simpleHash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h << 5) - h + str.charCodeAt(i);
            h |= 0;
        }
        return 'comfy-id-' + Math.abs(h).toString(36);
    }

    /**
 * 转义正则表达式特殊字符
 * @param {string} str - 输入字符串
 * @returns {string} - 转义后的字符串
 */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ================== 核心功能 ================== //

    /**
 * 切换生成模式
 * @param {string} mode - 目标模式
 */
    async function switchMode(mode) {
        currentMode = mode;
        await GM_setValue(STORAGE_KEY_MODE, mode);

        updateModeUI();

        if (typeof toastr !== 'undefined') {
            toastr.success(`已切换到 ${mode === MODES.COMFYUI ? 'ComfyUI' : 'WebUI'} 模式`);
        }
    }

    /**
 * 更新模式相关的UI
 */
    function updateModeUI() {
        document.querySelectorAll('.mode-switch-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === currentMode) {
                btn.classList.add('active');
                btn.classList.add(currentMode);
            }
        });

        const statusElement = document.querySelector('.mode-status');
        if (statusElement) {
            statusElement.textContent = `当前模式: ${currentMode === MODES.COMFYUI ? 'ComfyUI' : 'WebUI'}`;
        }

        const comfySettings = document.querySelectorAll('.comfyui-settings');
        const webuiSettings = document.querySelectorAll('.webui-settings');

        if (currentMode === MODES.COMFYUI) {
            comfySettings.forEach(el => {
                el.classList.remove('hidden');
                // 只对非标签页内容设置display样式
                if (!el.classList.contains('tab-content')) {
                    el.style.display = 'block';
                }
            });
            webuiSettings.forEach(el => {
                el.classList.remove('active');
                // 只对非标签页内容设置display样式
                if (!el.classList.contains('tab-content')) {
                    el.style.display = 'none';
                }
            });
        } else {
            comfySettings.forEach(el => {
                el.classList.add('hidden');
                // 只对非标签页内容设置display样式
                if (!el.classList.contains('tab-content')) {
                    el.style.display = 'none';
                }
            });
            webuiSettings.forEach(el => {
                el.classList.add('active');
                // 只对非标签页内容设置display样式
                if (!el.classList.contains('tab-content')) {
                    el.style.display = 'block';
                }
            });
        }

        const workflowTab = document.querySelector('[data-tab="workflows"]');
        const lorasTab = document.querySelector('[data-tab="loras"]');
        const comfyLorasTab = document.querySelector('[data-tab="comfy-loras"]');

        if (workflowTab) {
            workflowTab.style.display = currentMode === MODES.COMFYUI ? 'block' : 'none';
        }

        if (lorasTab) {
            lorasTab.style.display = currentMode === MODES.WEBUI ? 'block' : 'none';
        }

        if (comfyLorasTab) {
            comfyLorasTab.style.display = currentMode === MODES.COMFYUI ? 'block' : 'none';
        }

        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab && activeTab.style.display === 'none') {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            const generalTab = document.querySelector('[data-tab="general"]');
            const generalContent = document.getElementById('tab-general');
            if (generalTab && generalContent) {
                generalTab.classList.add('active');
                generalContent.classList.add('active');
            }
        }
    }

    /**
 * 创建ComfyUI/WebUI控制面板
 */
    function createComfyUIPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panelHTML = `
<div id="${PANEL_ID}">
	<div class="panel-control-bar">
		<i class="fa-fw fa-solid fa-home panel-reset-position" title="重置位置 (双击标题栏也可重置)"></i>
		<i class="fa-fw fa-solid fa-grip drag-grabber"></i><b>AI图像生成器 v4.9</b>
		<i class="fa-fw fa-solid fa-circle-xmark floating_panel_close"></i>
	</div>
	<div class="comfyui-panel-content">
		<!-- 模式切换器 -->
		<div class="mode-switch-container">
			<div class="mode-switch">
				<button class="mode-switch-option active comfyui" data-mode="${MODES.COMFYUI}">ComfyUI</button>
				<button class="mode-switch-option" data-mode="${MODES.WEBUI}">WebUI</button>
			</div>
			<div class="mode-status">当前模式: ComfyUI</div>
		</div>
		<div class="tab-container">
			<div class="tab-buttons">
				<button class="tab-button active" data-tab="general">基本设置</button>
				<button class="tab-button" data-tab="advanced">高级参数</button>
				<button class="tab-button comfyui-settings" data-tab="workflows">工作流管理</button>
				<button class="tab-button webui-settings" data-tab="loras" style="display: none;">LoRA管理</button>
				<button class="tab-button comfyui-settings" data-tab="comfy-loras">ComfyUI LoRA</button>
				<button class="tab-button" data-tab="shortcuts">快捷键设置</button>
				<button class="tab-button" data-tab="cache">图片缓存</button>
			</div>
			<div id="tab-general" class="tab-content active">
				<!-- ComfyUI 设置 -->
				<div class="comfyui-settings">
					<div class="comfy-settings-grid" style="grid-template-columns: 1fr;">
						<div><label for="comfyui-url">ComfyUI URL</label>
							<div class="comfy-input-group"><input id="comfyui-url" type="text" placeholder="http://127.0.0.1:8188"><button id="comfyui-test-conn" class="comfy-button">Test</button></div>
						</div>
						<div><label for="comfyui-model-select">模型选择 (Checkpoint)</label>
							<div class="comfy-input-group"><select id="comfyui-model-select"></select><button id="comfyui-refresh-models" class="comfy-button" title="Refresh Models"><i class="fa-solid fa-arrows-rotate"></i></button></div>
						</div>
						<div><label for="comfyui-unet-select">UNet模型选择</label>
							<div class="comfy-input-group"><select id="comfyui-unet-select"></select><button id="comfyui-refresh-unets" class="comfy-button" title="Refresh UNet Models"><i class="fa-solid fa-arrows-rotate"></i></button></div>
						</div>
					</div>
				</div>
				<!-- WebUI 设置 -->
				<div class="webui-settings" style="display: none;">
					<div class="comfy-settings-grid" style="grid-template-columns: 1fr;">
						<div><label for="webui-url">WebUI URL</label>
							<div class="comfy-input-group"><input id="webui-url" type="text" placeholder="http://127.0.0.1:7860"><button id="webui-test-conn" class="comfy-button">Test</button></div>
						</div>
						<div><label for="webui-model-select">模型选择</label>
							<div class="comfy-input-group"><select id="webui-model-select"></select><button id="webui-refresh-models" class="comfy-button" title="Refresh Models"><i class="fa-solid fa-arrows-rotate"></i></button></div>
						</div>
					</div>
				</div>
				<div class="comfy-auto-generate-container"><label class="comfy-auto-generate-label"><input id="comfyui-auto-generate" type="checkbox"><b>自动生图</b><span>- 仅对最新消息的"开始生成"有效</span></label></div>
				<fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
					<legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">尺寸设置</legend>
					<div class="comfy-settings-grid" style="margin-bottom: 0;">
						<div><label for="comfyui-gen-width">生成宽度 (Width)</label><input id="comfyui-gen-width" type="number" placeholder="512" min="64" step="8"></div>
						<div><label for="comfyui-gen-height">生成高度 (Height)</label><input id="comfyui-gen-height" type="number" placeholder="768" min="64" step="8"></div>
						<div><label for="comfyui-display-width">显示宽度 (0=自动)</label><input id="comfyui-display-width" type="number" placeholder="400" min="0"></div>
						<div><label for="comfyui-display-height">显示高度 (0=自动)</label><input id="comfyui-display-height" type="number" placeholder="0" min="0"></div>
					</div>
					<button id="comfyui-apply-dims" class="comfy-button" style="width:100%; margin-top: 15px;">应用显示尺寸到所有图片</button>
				</fieldset>
				<fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
					<legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">内容捕获标记</legend>
					<div class="comfy-settings-grid">
						<div><label for="comfyui-start-tag">开始标记</label><input id="comfyui-start-tag" type="text"></div>
						<div><label for="comfyui-end-tag">结束标记</label><input id="comfyui-end-tag" type="text"></div>
					</div>
					<button id="comfyui-apply-tags" class="comfy-button" style="width:100%; margin-top: 15px;">应用标记</button>
				</fieldset>
				<button id="comfyui-clear-cache" class="comfy-button error" style="margin-top: 20px; width: 100%;">删除所有图片缓存</button>
			</div>
			<div id="tab-advanced" class="tab-content">
				<!-- ComfyUI 高级设置 -->
				<div class="comfyui-settings">
					<fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
						<legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">ComfyUI 生成参数</legend>
						<div class="comfy-settings-grid">
							<div><label for="comfyui-sampler">采样器</label><select id="comfyui-sampler">
									<option>euler</option>
									<option>euler_ancestral</option>
									<option>dpmpp_2m</option>
									<option>dpmpp_sde</option>
									<option>dpmpp_2s_ancestral</option>
									<option>dpmpp_2m_sde</option>
									<option>dpmpp_2m_sde_gpu</option>
									<option>dpmpp_3m_sde</option>
									<option>dpmpp_3m_sde_gpu</option>
									<option>uni_pc</option>
									<option>uni_pc_bh2</option>
									<option>lcm</option>
								</select></div>
							<div><label for="comfyui-scheduler">调度器</label><select id="comfyui-scheduler">
									<option>normal</option>
									<option>karras</option>
									<option>exponential</option>
									<option>sgm_uniform</option>
									<option>simple</option>
									<option>ddim_uniform</option>
								</select></div>
							<div><label for="comfyui-steps">步数</label><input id="comfyui-steps" type="number" min="1" max="100" step="1"></div>
							<div><label for="comfyui-cfg">CFG</label><input id="comfyui-cfg" type="number" min="1.0" max="20.0" step="0.5"></div>
						</div>
						<button id="comfyui-apply-gen-params" class="comfy-button" style="width:100%; margin-top: 15px;">应用生成参数</button>
					</fieldset>
				</div>
				<!-- WebUI 高级设置 -->
				<div class="webui-settings" style="display: none;">
					<fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
						<legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">WebUI 生成参数</legend>
						<div class="comfy-settings-grid">
							<div><label for="webui-sampler">采样器</label><select id="webui-sampler">
									<option>Euler a</option>
									<option>Euler</option>
									<option>LMS</option>
									<option>Heun</option>
									<option>DPM2</option>
									<option>DPM2 a</option>
									<option>DPM++ 2S a</option>
									<option>DPM++ 2M</option>
									<option>DPM++ SDE</option>
									<option>DPM fast</option>
									<option>DPM adaptive</option>
									<option>LMS Karras</option>
									<option>DPM2 Karras</option>
									<option>DPM2 a Karras</option>
									<option>DPM++ 2S a Karras</option>
									<option>DPM++ 2M Karras</option>
									<option>DPM++ SDE Karras</option>
									<option>UniPC</option>
									<option>DDIM</option>
									<option>PLMS</option>
								</select></div>
							<div><label for="webui-scheduler">调度器</label><select id="webui-scheduler">
									<option>Automatic</option>
									<option>Uniform</option>
									<option>Karras</option>
									<option>Exponential</option>
									<option>Polyexponential</option>
									<option>SGM Uniform</option>
									<option>KL Optimal</option>
									<option>Align Your Steps</option>
									<option>Simple</option>
									<option>Normal</option>
									<option>DDIM</option>
									<option>Beta</option>
								</select></div>
							<div><label for="webui-steps">步数</label><input id="webui-steps" type="number" min="1" max="100" step="1" value="20"></div>
							<div><label for="webui-cfg">CFG Scale</label><input id="webui-cfg" type="number" min="1.0" max="20.0" step="0.5" value="7.0"></div>
							<div><label for="webui-denoising">降噪强度</label><input id="webui-denoising" type="number" min="0.0" max="1.0" step="0.05" value="0.7"></div>
						</div>
						<div class="comfy-auto-generate-container">
							<label class="comfy-auto-generate-label">
								<input id="webui-enable-hires" type="checkbox">
								<b>启用高分辨率修复</b>
								<span>- 提升图片质量和细节</span>
							</label>
						</div>
						<div class="comfy-settings-grid" id="hires-settings" style="display: none;">
							<div><label for="webui-hires-upscaler">高清修复算法</label><select id="webui-hires-upscaler">
									<option>Latent</option>
									<option>Latent (antialiased)</option>
									<option>Latent (bicubic)</option>
									<option>Latent (bicubic antialiased)</option>
									<option>Latent (nearest)</option>
									<option>None</option>
									<option>Lanczos</option>
									<option>Nearest</option>
									<option>LDSR</option>
									<option>BSRGAN</option>
									<option>ESRGAN_4x</option>
									<option>R-ESRGAN 4x+</option>
									<option>R-ESRGAN 4x+ Anime6B</option>
									<option>ScuNET GAN</option>
									<option>ScuNET PSNR</option>
									<option>SwinIR 4x</option>
								</select></div>
							<div><label for="webui-hires-steps">高清修复步数</label><input id="webui-hires-steps" type="number" min="0" max="100" step="1" value="0"></div>
							<div><label for="webui-hires-upscale">放大倍数</label><input id="webui-hires-upscale" type="number" min="1.0" max="4.0" step="0.1" value="2.0"></div>
							<div><label for="webui-hires-denoising">高清修复重绘强度</label><input id="webui-hires-denoising" type="number" min="0.0" max="1.0" step="0.05" value="0.5"></div>
						</div>
						<button id="webui-apply-gen-params" class="comfy-button" style="width:100%; margin-top: 15px;">应用生成参数</button>
					</fieldset>
				</div>
				<fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
					<legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">提示词预设管理</legend>
					<div class="comfy-settings-grid" style="grid-template-columns: 1fr auto auto auto;">
						<div>
							<label for="prompt-preset-select">选择预设</label>
							<select id="prompt-preset-select">
								<option value="">选择预设...</option>
							</select>
						</div>
						<div style="display: flex; align-items: end;">
							<button id="prompt-preset-load" class="comfy-button" title="加载选中的预设">加载</button>
						</div>
						<div style="display: flex; align-items: end;">
							<button id="prompt-preset-save" class="comfy-button" title="保存当前提示词为预设">保存</button>
						</div>
						<div style="display: flex; align-items: end;">
							<button id="prompt-preset-delete" class="comfy-button error" title="删除选中的预设">删除</button>
						</div>
					</div>
				</fieldset>
				<div class="comfy-prompt-area">
					<label for="comfyui-positive-prompt">固定正向提示词 (会自动加在生成内容的前面)</label>
					<textarea id="comfyui-positive-prompt" placeholder="例如: best quality, masterpiece..."></textarea>
				</div>
				<div class="comfy-prompt-area">
					<label for="comfyui-negative-prompt">固定负向提示词</label>
					<textarea id="comfyui-negative-prompt" placeholder="例如: worst quality, low quality, bad hands..."></textarea>
				</div>
			</div>
			<div id="tab-workflows" class="tab-content comfyui-settings">
				<div class="edit-mode-toolbar" id="edit-mode-toolbar">
					<div class="toolbar-title">编辑模式</div>
					<div class="workflow-action-row">
						<button id="workflow-save-edit" class="comfy-button success">保存修改</button>
						<button id="workflow-cancel-edit" class="comfy-button error">取消编辑</button>
					</div>
				</div>
				<div class="workflow-tools">
					<h4>工作流工具</h4>
					<div class="workflow-action-row">
						<button id="workflow-to-placeholders" class="comfy-button warning">转换为占位符</button>
						<button id="workflow-create-new" class="comfy-button">创建新工作流</button>
						<button id="workflow-save-current" class="comfy-button">保存当前工作流</button>
					</div>
					<div class="workflow-action-row">
						<button id="workflow-export-all" class="comfy-button">导出工作流</button>
						<button id="workflow-import" class="comfy-button">导入工作流</button>
						<button id="workflow-edit-mode" class="comfy-button warning">编辑模式</button>
					</div>
				</div>
				<div class="workflow-selector-container">
					<div class="workflow-search-container">
						<input type="text" id="workflow-search" class="workflow-search-input" placeholder="搜索工作流...">
					</div>
					<div id="workflow-list">
						<!-- 工作流列表将在这里动态生成 -->
					</div>
				</div>
				<label for="comfyui-workflow">当前工作流 (JSON)</label>
				<p class="workflow-info">占位符: <b>%prompt%</b> (正向), <b>%negative_prompt%</b> (反向), <b>%width%</b>, <b>%height%</b>, <b>%model%</b>, <b>%unet_model%</b>, <b>%seed%</b>, <b>%steps%</b>, <b>%cfg%</b>, <b>%sampler%</b>, <b>%scheduler%</b></p>
				<textarea id="comfyui-workflow" placeholder="在此处粘贴您的ComfyUI工作流JSON..."></textarea>
			</div>
			<div id="tab-loras" class="tab-content webui-settings" style="display: none;">
<div class="lora-selector">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h4 style="margin: 0; color: var(--vp-accent-color);">LoRA 模型管理</h4>
        <button id="webui-refresh-loras" class="comfy-button" title="刷新LoRA列表">
            <i class="fa-solid fa-arrows-rotate"></i> 刷新 </button>
    </div>
    <div class="comfy-settings-grid" style="grid-template-columns: 1fr 120px auto; align-items: end; gap: 10px;">
         <div>
            <label for="webui-lora-select">选择 LoRA 模型</label>
            <select id="webui-lora-select"></select>
        </div>
        <div>
            <label for="webui-lora-weight-input">权重</label>
            <input id="webui-lora-weight-input" type="number" value="1.0" step="0.1">
        </div>
        <div>
            <button id="webui-lora-add-button" class="comfy-button" style="width: 100%;">添加至提示词</button>
        </div>
    </div>
    <p style="font-size: 0.85em; color: #aaa; margin-top: 15px;">
        点击“添加”按钮，会将LoRA以 <lora:模型名:权重> 的格式插入到“高级参数”标签页下的“固定正向提示词”输入框中。
    </p>
</div>
				<div class="embedding-selector" style="margin-top: 30px; border-top: 1px solid var(--vp-border-color); padding-top: 20px;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
						<h4 style="margin: 0; color: var(--vp-accent-color);">Embedding 模型管理</h4>
						<button id="webui-refresh-embeddings" class="comfy-button" title="刷新Embedding列表">
							<i class="fa-solid fa-arrows-rotate"></i> 刷新 </button>
					</div>
					<div class="embedding-list" id="embedding-list">
						<!-- Embedding列表将在这里动态生成 -->
					</div>
					<div class="selected-embeddings" id="selected-embeddings">
						<h4>已选中的Embedding</h4>
						<div id="selected-embeddings-container">
							<!-- 已选中的Embedding标签将在这里显示 -->
						</div>
					</div>
				</div>
			</div>
<div id="tab-comfy-loras" class="tab-content comfyui-settings">
    <div class="lora-selector">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: var(--vp-accent-color);">ComfyUI LoRA 模型管理</h4>
            <button id="comfyui-refresh-loras-list" class="comfy-button" title="刷新LoRA列表">
                <i class="fa-solid fa-arrows-rotate"></i> 刷新 </button>
        </div>
        <!-- ComfyUI LoRA预设管理 -->
        <fieldset style="border: 1px solid var(--vp-border-color); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <legend style="color: var(--vp-accent-color); padding: 0 10px; font-weight: 600;">LoRA预设管理</legend>
            <div class="comfy-settings-grid" style="grid-template-columns: 1fr auto auto auto;">
                <div>
                    <label for="comfyui-lora-preset-select">选择预设</label>
                    <select id="comfyui-lora-preset-select">
                        <option value="">选择LoRA预设...</option>
                    </select>
                </div>
                <div style="display: flex; align-items: end;">
                    <button id="comfyui-lora-preset-load" class="comfy-button" title="加载选中的LoRA预设">加载</button>
                </div>
                <div style="display: flex; align-items: end;">
                    <button id="comfyui-lora-preset-save" class="comfy-button" title="保存当前LoRA配置为预设">保存</button>
                </div>
                <div style="display: flex; align-items: end;">
                    <button id="comfyui-lora-preset-delete" class="comfy-button error" title="删除选中的预设">删除</button>
                </div>
            </div>
        </fieldset>
        <div class="lora-list" id="comfyui-lora-list">
            <!-- ComfyUI LoRA列表将在这里动态生成 -->
        </div>
        <div class="selected-loras" id="comfyui-selected-loras">
            <h4>已选中的LoRA</h4>
            <div id="comfyui-selected-loras-container">
                <!-- 已选中的LoRA标签将在这里显示 -->
            </div>
        </div>
    </div>
</div>
<!-- LoRA预设保存模态框 -->
<div id="lora-preset-save-modal" class="workflow-save-modal">
    <h3>保存LoRA预设</h3>
    <label for="lora-preset-name-input">预设名称</label>
    <input type="text" id="lora-preset-name-input" placeholder="输入LoRA预设名称...">
    <div id="lora-preset-overwrite-warning" class="overwrite-warning" style="display: none;"> ⚠️ 该名称的预设已存在，保存将覆盖现有预设 </div>
    <div class="modal-actions">
        <button id="lora-preset-save-cancel" class="comfy-button error">取消</button>
        <button id="lora-preset-save-confirm" class="comfy-button success">保存</button>
    </div>
</div>
			<div id="tab-cache" class="tab-content">
				<div class="cache-toolbar">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
						<h4 style="margin: 0; color: var(--vp-accent-color);">图片缓存管理</h4>
						<div>
							<button id="cache-refresh" class="comfy-button">刷新</button>
							<button id="cache-clear-all" class="comfy-button error">清空所有</button>
						</div>
					</div>
					<div class="cache-stats" id="cache-stats" style="margin-bottom: 15px; color: #aaa; font-size: 0.9em;">
						<!-- 统计信息将在这里显示 -->
					</div>
				</div>
				<div class="cache-grid" id="cache-grid">
					<!-- 缓存图片将在这里显示 -->
				</div>
			</div>
			<div id="tab-shortcuts" class="tab-content">
				<div style="margin-bottom: 20px;">
					<h4 style="color: var(--vp-accent-color); margin: 0 0 15px 0;">快捷键配置</h4>
					<p style="color: #aaa; font-size: 0.9em; margin-bottom: 20px;">点击快捷键输入框并按下想要的键组合来设置快捷键。支持 Ctrl、Alt、Shift 组合键。</p>
				</div>
				<div id="shortcuts-config-container">
					<!-- 快捷键配置将在这里动态生成 -->
				</div>
				<div style="margin-top: 20px; padding: 15px; border: 1px solid var(--vp-border-color); border-radius: 8px; background: rgba(0,0,0,0.1);">
					<div style="display: flex; gap: 10px;">
						<button id="shortcuts-reset" class="comfy-button warning">重置为默认</button>
						<button id="shortcuts-disable-all" class="comfy-button error">禁用所有快捷键</button>
						<button id="shortcuts-save" class="comfy-button success">保存配置</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 保存工作流模态框 -->
<div id="workflow-save-modal" class="workflow-save-modal">
	<h3>保存工作流</h3>
	<label for="workflow-name-input">工作流名称</label>
	<input type="text" id="workflow-name-input" placeholder="输入工作流名称...">
	<div id="overwrite-warning" class="overwrite-warning" style="display: none;"> ⚠️ 该名称的工作流已存在，保存将覆盖现有工作流 </div>
	<div class="modal-actions">
		<button id="workflow-save-cancel" class="comfy-button error">取消</button>
		<button id="workflow-save-confirm" class="comfy-button success">保存</button>
	</div>
</div>
<!-- 保存提示词预设模态框 -->
<div id="prompt-preset-save-modal" class="workflow-save-modal">
	<h3>保存提示词预设</h3>
	<label for="prompt-preset-name-input">预设名称</label>
	<input type="text" id="prompt-preset-name-input" placeholder="输入预设名称...">
	<div id="prompt-preset-overwrite-warning" class="overwrite-warning" style="display: none;"> ⚠️ 该名称的预设已存在，保存将覆盖现有预设 </div>
	<div class="modal-actions">
		<button id="prompt-preset-save-cancel" class="comfy-button error">取消</button>
		<button id="prompt-preset-save-confirm" class="comfy-button success">保存</button>
	</div>
</div>
`;
      document.body.insertAdjacentHTML('beforeend', panelHTML);
      initPanelLogic();
      initKeyboardShortcuts();
  }

    /**
 * 初始化面板逻辑
 */
    function initPanelLogic() {
        const panel = document.getElementById(PANEL_ID);

        // 获取所有输入元素引用
        const inputs = {
            url: document.getElementById('comfyui-url'),
            webuiUrl: document.getElementById('webui-url'),
            workflow: document.getElementById('comfyui-workflow'),
            startTag: document.getElementById('comfyui-start-tag'),
            endTag: document.getElementById('comfyui-end-tag'),
            genWidth: document.getElementById('comfyui-gen-width'),
            genHeight: document.getElementById('comfyui-gen-height'),
            displayWidth: document.getElementById('comfyui-display-width'),
            displayHeight: document.getElementById('comfyui-display-height'),
            autoGen: document.getElementById('comfyui-auto-generate'),
            modelSelect: document.getElementById('comfyui-model-select'),
            unetSelect: document.getElementById('comfyui-unet-select'),
            webuiModelSelect: document.getElementById('webui-model-select'),
            sampler: document.getElementById('comfyui-sampler'),
            scheduler: document.getElementById('comfyui-scheduler'),
            steps: document.getElementById('comfyui-steps'),
            cfg: document.getElementById('comfyui-cfg'),
            webuiSampler: document.getElementById('webui-sampler'),
            webuiScheduler: document.getElementById('webui-scheduler'),
            webuiSteps: document.getElementById('webui-steps'),
            webuiCfg: document.getElementById('webui-cfg'),
            webuiDenoising: document.getElementById('webui-denoising'),
            webuiEnableHires: document.getElementById('webui-enable-hires'),
            webuiHiresUpscaler: document.getElementById('webui-hires-upscaler'),
            webuiHiresSteps: document.getElementById('webui-hires-steps'),
            webuiHiresUpscale: document.getElementById('webui-hires-upscale'),
            webuiHiresDenoising: document.getElementById('webui-hires-denoising'),
            positivePrompt: document.getElementById('comfyui-positive-prompt'),
            negativePrompt: document.getElementById('comfyui-negative-prompt'),
        };

        // 获取所有按钮元素引用
        const buttons = {
            close: panel.querySelector('.floating_panel_close'),
            test: document.getElementById('comfyui-test-conn'),
            webuiTest: document.getElementById('webui-test-conn'),
            clearCache: document.getElementById('comfyui-clear-cache'),
            applyDims: document.getElementById('comfyui-apply-dims'),
            refreshModels: document.getElementById('comfyui-refresh-models'),
            refreshUnets: document.getElementById('comfyui-refresh-unets'),
            webuiRefreshModels: document.getElementById('webui-refresh-models'),
            webuiRefreshLoras: document.getElementById('webui-refresh-loras'),
            comfyuiRefreshLoras: document.getElementById('comfyui-refresh-loras-list'),
            applyTags: document.getElementById('comfyui-apply-tags'),
            applyGenParams: document.getElementById('comfyui-apply-gen-params'),
            webuiApplyGenParams: document.getElementById('webui-apply-gen-params'),
            toPlaceholders: document.getElementById('workflow-to-placeholders'),
            createWorkflow: document.getElementById('workflow-create-new'),
            saveWorkflow: document.getElementById('workflow-save-current'),
            exportWorkflows: document.getElementById('workflow-export-all'),
            importWorkflows: document.getElementById('workflow-import'),
            editMode: document.getElementById('workflow-edit-mode'),
            saveEdit: document.getElementById('workflow-save-edit'),
            cancelEdit: document.getElementById('workflow-cancel-edit'),
            saveModalConfirm: document.getElementById('workflow-save-confirm'),
            saveModalCancel: document.getElementById('workflow-save-cancel'),
            resetPosition: panel.querySelector('.panel-reset-position'),
        };

        // 设备适配初始化
        const deviceType = DeviceDetector.getDeviceType();
        panel.classList.add(`device-${deviceType}`);

        // 移动端特殊处理
        if (deviceType === 'mobile') {
            // 禁用拖拽功能
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.left = '0';
            panel.style.transform = 'none';
            panel.classList.add('mobile-fullscreen');

            // 添加移动端关闭手势
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            const handleTouchStart = (e) => {
                startY = e.touches[0].clientY;
                isDragging = true;
            };

            const handleTouchMove = (e) => {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                const diffY = currentY - startY;

                if (diffY > 50 && startY < 100) { // 从顶部向下滑动超过50px
                    e.preventDefault();
                }
            };

            const handleTouchEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;

                const diffY = currentY - startY;
                if (diffY > 100 && startY < 100) { // 从顶部向下滑动超过100px
                    panel.style.display = 'none';
                }
            };

            const controlBar = panel.querySelector('.panel-control-bar');
            controlBar.addEventListener('touchstart', handleTouchStart, { passive: false });
            controlBar.addEventListener('touchmove', handleTouchMove, { passive: false });
            controlBar.addEventListener('touchend', handleTouchEnd, { passive: false });

            // 确保面板初始化时，滚动指示器就能正常工作。
            const panelContent = document.querySelector('.comfyui-panel-content');

            // 添加滚动指示器
            const scrollIndicator = document.createElement('div');
            scrollIndicator.id = 'scroll-indicator';
            scrollIndicator.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            scrollIndicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--vp-accent-color);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            `;
        panel.appendChild(scrollIndicator);

        // 滚动监听
        panelContent.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = panelContent;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
            scrollIndicator.style.opacity = isNearBottom ? '0' : '0.7';
        });

        // 点击指示器滚动到底部
        scrollIndicator.addEventListener('click', () => {
            panelContent.scrollTo({ top: panelContent.scrollHeight, behavior: 'smooth' });
        });
        scrollIndicator.style.pointerEvents = 'auto';

        // 初始检查
        setTimeout(() => {
            const { scrollHeight, clientHeight } = panelContent;
            if (scrollHeight > clientHeight) {
                scrollIndicator.style.opacity = '0.7';
            }
        }, 500);
    }

      // 模式切换按钮
      document.querySelectorAll('.mode-switch-option').forEach(btn => {
          btn.addEventListener('click', () => {
              const mode = btn.dataset.mode;
              switchMode(mode);
          });
      });

      // WebUI高分辨率修复选项切换
      inputs.webuiEnableHires.addEventListener('change', () => {
          const hiresSettings = document.getElementById('hires-settings');
          hiresSettings.style.display = inputs.webuiEnableHires.checked ? 'block' : 'none';
      });

      // 搜索输入框
      const workflowSearch = document.getElementById('workflow-search');

      // 初始化选项卡功能
      const tabButtons = document.querySelectorAll('.tab-button');
      tabButtons.forEach(button => {
          button.addEventListener('click', () => {
              document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
              document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

              button.classList.add('active');
              const tabId = button.getAttribute('data-tab');
              document.getElementById(`tab-${tabId}`).classList.add('active');

              if (tabId === 'shortcuts') {
                  initShortcutsConfig();
              }

              if (DeviceDetector.isMobile()) {
                  const panelContent = document.querySelector('.comfyui-panel-content');
                  if (panelContent) {
                      panelContent.scrollTop = 0;

                      // 延迟重新计算滚动指示器
                      setTimeout(() => {
                          const scrollIndicator = document.getElementById('scroll-indicator');
                          if (scrollIndicator) {
                              const { scrollHeight, clientHeight } = panelContent;
                              scrollIndicator.style.opacity = scrollHeight > clientHeight ? '0.7' : '0';
                          }
                      }, 100);
                  }
              }

              if (tabId === 'loras') {
                  updateSelectedLorasDisplay();
                  updateSelectedEmbeddingsDisplay();
              }

              if (tabId === 'comfy-loras') {
                  updateComfyUISelectedLorasDisplay();
                  loadComfyUILoraPresets();
              }

              if (tabId === 'cache') {
                  loadImageCache();
              }
          });
      });

      // 关闭按钮事件
      buttons.close.addEventListener('click', () => {
          panel.style.display = 'none';
      });

      // 重置位置按钮事件
      buttons.resetPosition.addEventListener('click', () => {
          resetPanelPosition(panel);
      });

      // 双击标题栏重置位置
      const controlBar = panel.querySelector('.panel-control-bar');
      let lastClickTime = 0;
      controlBar.addEventListener('click', (e) => {
          if (e.target.classList.contains('floating_panel_close') ||
              e.target.classList.contains('panel-reset-position')) {
              return;
          }

          const currentTime = Date.now();
          if (currentTime - lastClickTime < 300) {
              resetPanelPosition(panel);
          }
          lastClickTime = currentTime;
      });

      // 初始化拖拽功能（仅桌面端）
      if (deviceType === 'desktop' && typeof $ !== 'undefined' && typeof $.fn.draggable !== 'undefined') {
          $(`#${PANEL_ID}`).draggable({
              handle: ".panel-control-bar",
              containment: "document",
              start: function () {
                  panel.style.transform = 'none';
                  panel.classList.add('dragging');
              },
              drag: function (event, ui) {
                  const panelWidth = panel.offsetWidth;
                  const panelHeight = panel.offsetHeight;
                  const viewportWidth = window.innerWidth;
                  const viewportHeight = window.innerHeight;

                  if (ui.position.left < -(panelWidth - 50)) {
                      ui.position.left = -(panelWidth - 50);
                  }
                  if (ui.position.left > viewportWidth - 50) {
                      ui.position.left = viewportWidth - 50;
                  }
                  if (ui.position.top < 0) {
                      ui.position.top = 0;
                  }
                  if (ui.position.top > viewportHeight - 50) {
                      ui.position.top = viewportHeight - 50;
                  }
              },
              stop: function () {
                  setTimeout(() => {
                      checkAndFixPanelPosition(panel);
                  }, 10);
              }
          });
      }

      // 窗口大小改变时检查面板位置
      window.addEventListener('resize', () => {
          if (panel.classList.contains('dragging')) {
              setTimeout(() => {
                  checkAndFixPanelPosition(panel);
              }, 100);
          }
      });

      // 工作流搜索功能
      workflowSearch.addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          filterWorkflows(searchTerm);
      });

      // 编辑模式按钮事件
      buttons.editMode.addEventListener('click', () => {
          toggleEditMode();
      });

      buttons.saveEdit.addEventListener('click', () => {
          saveEditedWorkflow();
      });

      buttons.cancelEdit.addEventListener('click', () => {
          cancelEditMode();
      });

      // 测试连接按钮事件（ComfyUI）
      buttons.test.addEventListener('click', async () => {
          let url = inputs.url.value.trim();
          if (!url) return;

          if (!url.startsWith('http')) url = 'http://' + url;
          if (url.endsWith('/')) url = url.slice(0, -1);
          inputs.url.value = url;

          if (typeof toastr !== 'undefined') {
              toastr.info('正在尝试连接ComfyUI...');
          }

          buttons.test.className = 'comfy-button testing';
          buttons.test.disabled = true;

          try {
              const response = await makeRequest({
                  method: "GET",
                  url: `${url}/system_stats`,
                  timeout: 3600000
              });

              buttons.test.disabled = false;
              buttons.test.classList.remove('testing');

              const success = response.status === 200;
              buttons.test.classList.add(success ? 'success' : 'error');

              if (success) {
                  await fetchAndPopulateModels(url, inputs.modelSelect);
                  await fetchAndPopulateUNetModels(url, inputs.unetSelect);
                  await fetchAndPopulateComfyUILoras(url);
              }
          } catch (error) {
              buttons.test.disabled = false;
              buttons.test.classList.remove('testing');
              buttons.test.classList.add('error');

              if (typeof toastr !== 'undefined') {
                  toastr.error(`ComfyUI连接失败: ${error.message}`);
              }
          }
      });

      // 测试连接按钮事件（WebUI）
      buttons.webuiTest.addEventListener('click', async () => {
          let url = inputs.webuiUrl.value.trim();
          if (!url) return;

          if (!url.startsWith('http')) url = 'http://' + url;
          if (url.endsWith('/')) url = url.slice(0, -1);
          inputs.webuiUrl.value = url;

          if (typeof toastr !== 'undefined') {
              toastr.info('正在尝试连接WebUI...');
          }

          buttons.webuiTest.className = 'comfy-button testing';
          buttons.webuiTest.disabled = true;

          try {
              const response = await makeRequest({
                  method: "GET",
                  url: `${url}/sdapi/v1/sd-models`,
                  timeout: 3600000
              });

              buttons.webuiTest.disabled = false;
              buttons.webuiTest.classList.remove('testing');

              const success = response.status === 200;
              buttons.webuiTest.classList.add(success ? 'success' : 'error');

              if (success) {
                  await fetchAndPopulateWebUIModels(url, inputs.webuiModelSelect);
                  await fetchAndPopulateWebUILoras(url);
              }
          } catch (error) {
              buttons.webuiTest.disabled = false;
              buttons.webuiTest.classList.remove('testing');
              buttons.webuiTest.classList.add('error');

              if (typeof toastr !== 'undefined') {
                  toastr.error(`WebUI连接失败: ${error.message}`);
              }
          }
      });

      // 辅助函数，用于处理需要URL的API调用
      const handleApiAction = (urlInput, action, warningMessage) => {
          return async () => {
              const url = urlInput.value.trim();
              if (url) {
                  await action(url);
              } else if (typeof toastr !== 'undefined') {
                  toastr.warning(warningMessage);
              }
          };
      };

      // 刷新模型按钮事件
      buttons.refreshModels.addEventListener('click', handleApiAction(inputs.url, (url) => fetchAndPopulateModels(url, inputs.modelSelect), '请先输入ComfyUI URL'));

      // 刷新UNet模型按钮事件
      buttons.refreshUnets.addEventListener('click', handleApiAction(inputs.url, (url) => fetchAndPopulateUNetModels(url, inputs.unetSelect), '请先输入ComfyUI URL'));

      // 刷新WebUI模型按钮事件
      buttons.webuiRefreshModels.addEventListener('click', handleApiAction(inputs.webuiUrl, (url) => fetchAndPopulateWebUIModels(url, inputs.webuiModelSelect), '请先输入WebUI URL'));

      // 刷新WebUI LoRA按钮事件
      buttons.webuiRefreshLoras.addEventListener('click', handleApiAction(inputs.webuiUrl, fetchAndPopulateWebUILoras, '请先输入WebUI URL'));

      // 刷新WebUI Embedding按钮事件
      buttons.webuiRefreshEmbeddings = document.getElementById('webui-refresh-embeddings');
      buttons.webuiRefreshEmbeddings.addEventListener('click', handleApiAction(inputs.webuiUrl, fetchAndPopulateWebUIEmbeddings, '请先输入WebUI URL'));

      // 刷新ComfyUI LoRA按钮事件 (合并了两个按钮的逻辑)
      buttons.comfyuiRefreshLorasList = document.getElementById('comfyui-refresh-loras-list');
      const refreshComfyLorasAction = handleApiAction(inputs.url, fetchAndPopulateComfyUILoras, '请先输入ComfyUI URL');

      if (buttons.comfyuiRefreshLoras) {
          buttons.comfyuiRefreshLoras.addEventListener('click', refreshComfyLorasAction);
      }
      if (buttons.comfyuiRefreshLorasList) {
          buttons.comfyuiRefreshLorasList.addEventListener('click', refreshComfyLorasAction);
      }

      // 清除缓存按钮事件
      buttons.clearCache.addEventListener('click', () => {
          if (confirm('您确定要删除所有已生成的图片缓存吗？')) {
              GM_setValue(STORAGE_KEY_IMAGES, {});
              document.querySelectorAll('.comfy-image-container').forEach(el => el.remove());
              document.querySelectorAll('.comfy-button-group').forEach(group => {
                  group.querySelector('.comfy-delete-button')?.remove();
                  const genBtn = group.querySelector('.comfy-chat-generate-button');
                  if (genBtn) {
                      genBtn.textContent = '开始生成';
                      genBtn.disabled = false;
                      genBtn.className = 'comfy-button comfy-chat-generate-button';
                  }
              });

              if (typeof toastr !== 'undefined') {
                  toastr.success('图片缓存已清空');
              }
          }
      });

      // 应用显示尺寸按钮事件
      async function applyDisplayDimensionsToAll() {
          const displayWidth = await GM_getValue('comfyui_display_width', DEFAULT_SETTINGS.displayWidth);
          const displayHeight = await GM_getValue('comfyui_display_height', DEFAULT_SETTINGS.displayHeight);

          document.querySelectorAll('.comfy-image-container img').forEach(img => {
              img.style.maxWidth = displayWidth > 0 ? `${displayWidth}px` : '100%';
              img.style.maxHeight = displayHeight > 0 ? `${displayHeight}px` : '';
              img.style.width = displayWidth > 0 ? 'auto' : '';
              img.style.height = 'auto';
          });

          if (typeof toastr !== 'undefined') {
              toastr.success(`显示尺寸已应用`);
          }
      }
      buttons.applyDims.addEventListener('click', applyDisplayDimensionsToAll);

      // 应用标记按钮事件
      buttons.applyTags.addEventListener('click', async () => {
          await saveSettings(inputs);

          if (typeof toastr !== 'undefined') {
              toastr.success('捕获标记已更新！将立即对新消息生效。');
          }
      });

      // 应用生成参数按钮事件
      buttons.applyGenParams.addEventListener('click', async () => {
          await saveSettings(inputs);

          if (typeof toastr !== 'undefined') {
              toastr.success('ComfyUI生成参数已保存！');
          }
      });

      // 应用WebUI生成参数按钮事件
      buttons.webuiApplyGenParams.addEventListener('click', async () => {
          await saveSettings(inputs);

          if (typeof toastr !== 'undefined') {
              toastr.success('WebUI生成参数已保存！');
          }
      });

      // 转换为占位符按钮事件
      buttons.toPlaceholders.addEventListener('click', () => {
          const workflowText = inputs.workflow.value;
          if (!workflowText.trim()) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('工作流内容为空');
              }
              return;
          }

          try {
              const convertedWorkflow = convertWorkflowToPlaceholders(workflowText);
              inputs.workflow.value = convertedWorkflow;

              if (typeof toastr !== 'undefined') {
                  toastr.success('工作流已转换为占位符格式(不一定完全正确，务必再自行检测一遍！)');
              }
          } catch (error) {
              if (typeof toastr !== 'undefined') {
                  toastr.error(`转换失败: ${error.message}`);
              }
          }
      });

      // 创建新工作流按钮事件
      buttons.createWorkflow.addEventListener('click', () => {
          inputs.workflow.value = '';
          showWorkflowSaveModal('新工作流');
      });

      // 保存当前工作流按钮事件
      buttons.saveWorkflow.addEventListener('click', () => {
          if (!inputs.workflow.value.trim()) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('工作流内容不能为空');
              }
              return;
          }
          showWorkflowSaveModal('');
      });

      // 导出工作流按钮事件
      buttons.exportWorkflows.addEventListener('click', async () => {
          const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
          if (Object.keys(workflows).length === 0) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('没有工作流可导出');
              }
              return;
          }

          // 创建一个新对象，用于存放解析后的工作流
          const parsedWorkflows = {};
          for (const [name, workflowString] of Object.entries(workflows)) {
              try {
                  // 将每个字符串化的工作流解析回JSON对象
                  parsedWorkflows[name] = JSON.parse(workflowString);
              } catch (e) {
                  console.warn(`跳过格式错误的工作流: ${name}`, e);
                  // 如果某个工作流格式错误，可以选择跳过或保留原始字符串
                  // 这里我们选择跳过，以保证导出文件的规范性
              }
          }

          // 对包含真实JSON对象的总对象进行字符串化
          const exportData = JSON.stringify(parsedWorkflows, null, 2);

          const blob = new Blob([exportData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `comfyui_workflows_${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          if (typeof toastr !== 'undefined') {
              toastr.success('已导出工作流');
          }
      });

      // 导入工作流按钮事件
      buttons.importWorkflows.addEventListener('click', () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';

          input.onchange = async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = async (event) => {
                  try {
                      const importedData = JSON.parse(event.target.result);

                      if (typeof importedData !== 'object' || importedData === null) {
                          throw new Error('无效的工作流文件格式');
                      }

                      const existingWorkflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
                      const mergedWorkflows = { ...existingWorkflows };

                      let importCount = 0;
                      let overwriteCount = 0;

                      // 检查是否为单个工作流JSON（直接的工作流对象）
                      if (importedData.hasOwnProperty('workflow') ||
                          importedData.hasOwnProperty('nodes') ||
                          (typeof importedData === 'object' &&
                           Object.keys(importedData).some(key =>
                                                          typeof importedData[key] === 'object' &&
                                                          importedData[key] !== null &&
                                                          (importedData[key].hasOwnProperty('class_type') ||
                                                           importedData[key].hasOwnProperty('inputs'))
                                                         ))) {

                          // 这是一个单个工作流JSON (这部分逻辑保持不变)
                          const workflowName = prompt('请为导入的工作流命名:', `导入的工作流_${new Date().toLocaleString()}`);

                          if (workflowName && workflowName.trim()) {
                              const trimmedName = workflowName.trim();
                              if (existingWorkflows[trimmedName]) {
                                  if (confirm(`工作流"${trimmedName}"已存在，是否覆盖？`)) {
                                      mergedWorkflows[trimmedName] = JSON.stringify(importedData, null, 2);
                                      overwriteCount++;
                                  }
                              } else {
                                  mergedWorkflows[trimmedName] = JSON.stringify(importedData, null, 2);
                                  importCount++;
                              }
                          }
                      } else {
                          // 这是多个工作流的集合（工作流管理器导出的格式）

                          for (const [name, workflowData] of Object.entries(importedData)) {
                              let workflowString;

                              // 检查导入的工作流数据是对象还是字符串（为了兼容旧的错误导出格式）
                              if (typeof workflowData === 'object' && workflowData !== null) {
                                  workflowString = JSON.stringify(workflowData, null, 2);
                              } else if (typeof workflowData === 'string') {
                                  try {
                                      JSON.parse(workflowData);
                                      workflowString = workflowData;
                                  } catch (e) {
                                      console.warn(`跳过无效的字符串工作流: ${name}`);
                                      continue;
                                  }
                              } else {
                                  console.warn(`跳过格式无法识别的工作流: ${name}`);
                                  continue;
                              }

                              if (existingWorkflows[name]) {
                                  overwriteCount++;
                              } else {
                                  importCount++;
                              }
                              mergedWorkflows[name] = workflowString;
                          }
                      }

                      await GM_setValue(STORAGE_KEY_WORKFLOWS, mergedWorkflows);
                      updateWorkflowList();

                      if (typeof toastr !== 'undefined') {
                          if (importCount > 0 && overwriteCount > 0) {
                              toastr.success(`成功导入${importCount}个新工作流，覆盖${overwriteCount}个已有工作流`);
                          } else if (importCount > 0) {
                              toastr.success(`成功导入${importCount}个工作流`);
                          } else if (overwriteCount > 0) {
                              toastr.success(`成功覆盖${overwriteCount}个工作流`);
                          } else {
                              toastr.info('没有导入任何工作流');
                          }
                      }
                  } catch (error) {
                      console.error('导入工作流失败:', error);
                      if (typeof toastr !== 'undefined') {
                          toastr.error(`导入失败: ${error.message}`);
                      }
                  }
              };

              reader.readAsText(file);
          };

          input.click();
      });

      // 工作流保存模态框确认按钮事件
      buttons.saveModalConfirm.addEventListener('click', async () => {
          const nameInput = document.getElementById('workflow-name-input');
          const workflowName = nameInput.value.trim();

          if (!workflowName) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('请输入工作流名称');
              }
              return;
          }

          const workflowContent = inputs.workflow.value.trim();
          if (!workflowContent) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('工作流内容不能为空');
              }
              return;
          }

          const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
          const isNew = !workflows[workflowName];

          workflows[workflowName] = workflowContent;
          await GM_setValue(STORAGE_KEY_WORKFLOWS, workflows);

          updateWorkflowList();

          document.getElementById('workflow-save-modal').style.display = 'none';

          if (typeof toastr !== 'undefined') {
              toastr.success(isNew ? `工作流"${workflowName}"已创建` : `工作流"${workflowName}"已更新`);
          }
      });

      // 工作流保存模态框取消按钮事件
      buttons.saveModalCancel.addEventListener('click', () => {
          document.getElementById('workflow-save-modal').style.display = 'none';
      });

      // 工作流名称输入框监听
      const nameInput = document.getElementById('workflow-name-input');
      nameInput.addEventListener('input', async () => {
          const workflowName = nameInput.value.trim();
          const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
          const warning = document.getElementById('overwrite-warning');

          if (workflowName && workflows[workflowName]) {
              warning.style.display = 'block';
          } else {
              warning.style.display = 'none';
          }
      });

      // ComfyUI LoRA预设相关按钮事件
      const comfyuiLoraPresetButtons = {
          load: document.getElementById('comfyui-lora-preset-load'),
          save: document.getElementById('comfyui-lora-preset-save'),
          delete: document.getElementById('comfyui-lora-preset-delete')
      };

      // ComfyUI LoRA加载预设按钮事件
      comfyuiLoraPresetButtons.load.addEventListener('click', async () => {
          const select = document.getElementById('comfyui-lora-preset-select');
          const selectedPreset = select.value;

          if (!selectedPreset) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('请先选择一个LoRA预设');
              }
              return;
          }

          await loadSelectedComfyUILoraPreset(selectedPreset);
      });

      // ComfyUI LoRA保存预设按钮事件
      comfyuiLoraPresetButtons.save.addEventListener('click', () => {
          const selectedLoras = getCurrentComfyUISelectedLoras();
          if (selectedLoras.length === 0) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('请先选择一些ComfyUI LoRA模型');
              }
              return;
          }
          showLoraPresetSaveModal('comfyui');
      });

      // ComfyUI LoRA删除预设按钮事件
      comfyuiLoraPresetButtons.delete.addEventListener('click', async () => {
          const select = document.getElementById('comfyui-lora-preset-select');
          const selectedPreset = select.value;

          if (!selectedPreset) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('请先选择一个LoRA预设');
              }
              return;
          }

          if (confirm(`确定要删除ComfyUI LoRA预设"${selectedPreset}"吗？此操作不可撤销。`)) {
              await deleteSelectedComfyUILoraPreset(selectedPreset);
          }
      });

      // LoRA预设保存模态框相关按钮事件
      const loraPresetModalButtons = {
          saveConfirm: document.getElementById('lora-preset-save-confirm'),
          saveCancel: document.getElementById('lora-preset-save-cancel')
      };

      // LoRA预设保存模态框确认按钮事件
      loraPresetModalButtons.saveConfirm.addEventListener('click', async () => {
          const nameInput = document.getElementById('lora-preset-name-input');
          const presetName = nameInput.value.trim();

          if (!presetName) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('请输入预设名称');
              }
              return;
          }

          // 之前可能存在webui的预设逻辑，这里明确指定为comfyui
          if (currentLoraPresetType === 'comfyui') {
              await saveCurrentComfyUILoraAsPreset(presetName);
          }

          document.getElementById('lora-preset-save-modal').style.display = 'none';

          if (typeof toastr !== 'undefined') {
              toastr.success(`LoRA预设"${presetName}"已保存`);
          }
      });

      // LoRA预设保存模态框取消按钮事件
      loraPresetModalButtons.saveCancel.addEventListener('click', () => {
          document.getElementById('lora-preset-save-modal').style.display = 'none';
      });

      // LoRA预设名称输入框监听
      const loraPresetNameInput = document.getElementById('lora-preset-name-input');
      loraPresetNameInput.addEventListener('input', async () => {
          const presetName = loraPresetNameInput.value.trim();
          // 假设只处理comfyui
          const storageKey = STORAGE_KEY_COMFYUI_LORA_PRESETS;
          const presets = await GM_getValue(storageKey, {});
          const warning = document.getElementById('lora-preset-overwrite-warning');

          if (presetName && presets[presetName]) {
              warning.style.display = 'block';
          } else {
              warning.style.display = 'none';
          }
      });

      // 缓存管理按钮事件
      document.getElementById('cache-refresh')?.addEventListener('click', () => {
          loadImageCache();
      });

      document.getElementById('cache-clear-all')?.addEventListener('click', () => {
          clearAllCache();
      });

      // 提示词预设相关按钮事件
      const presetButtons = {
          load: document.getElementById('prompt-preset-load'),
          save: document.getElementById('prompt-preset-save'),
          delete: document.getElementById('prompt-preset-delete'),
          saveModalConfirm: document.getElementById('prompt-preset-save-confirm'),
          saveModalCancel: document.getElementById('prompt-preset-save-cancel')
      };

      // 加载预设按钮事件
      presetButtons.load.addEventListener('click', async () => {
          const select = document.getElementById('prompt-preset-select');
          const selectedPreset = select.value;

          if (!selectedPreset) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('请先选择一个预设');
              }
              return;
          }

          await loadSelectedPreset(selectedPreset);
      });

      // 保存预设按钮事件
      presetButtons.save.addEventListener('click', () => {
          showPromptPresetSaveModal();
      });

      // 删除预设按钮事件
      presetButtons.delete.addEventListener('click', async () => {
          const select = document.getElementById('prompt-preset-select');
          const selectedPreset = select.value;

          if (!selectedPreset) {
              if (typeof toastr !== 'undefined') {
                  toastr.warning('请先选择一个预设');
              }
              return;
          }

          if (confirm(`确定要删除预设"${selectedPreset}"吗？此操作不可撤销。`)) {
              await deleteSelectedPreset(selectedPreset);
          }
      });

      // 预设保存模态框确认按钮事件
      presetButtons.saveModalConfirm.addEventListener('click', async () => {
          const nameInput = document.getElementById('prompt-preset-name-input');
          const presetName = nameInput.value.trim();

          if (!presetName) {
              if (typeof toastr !== 'undefined') {
                  toastr.error('请输入预设名称');
              }
              return;
          }

          await saveCurrentAsPreset(presetName);
          document.getElementById('prompt-preset-save-modal').style.display = 'none';

          if (typeof toastr !== 'undefined') {
              toastr.success(`预设"${presetName}"已保存`);
          }
      });

      // 预设保存模态框取消按钮事件
      presetButtons.saveModalCancel.addEventListener('click', () => {
          document.getElementById('prompt-preset-save-modal').style.display = 'none';
      });


      // 预设名称输入框监听
      const presetNameInput = document.getElementById('prompt-preset-name-input');
      presetNameInput.addEventListener('input', async () => {
          const presetName = presetNameInput.value.trim();
          const presets = await GM_getValue(STORAGE_KEY_PROMPT_PRESETS, {});
          const warning = document.getElementById('prompt-preset-overwrite-warning');

          if (presetName && presets[presetName]) {
              warning.style.display = 'block';
          } else {
              warning.style.display = 'none';
          }
      });

      const addLoraButton = document.getElementById('webui-lora-add-button');
      if (addLoraButton) {
          addLoraButton.addEventListener('click', () => {
              const loraSelect = document.getElementById('webui-lora-select');
              const weightInput = document.getElementById('webui-lora-weight-input');
              const positivePromptTextarea = document.getElementById('comfyui-positive-prompt');

              const loraName = loraSelect.value;
              const loraWeight = weightInput.value || '1.0';

              if (!loraName) {
                  if (typeof toastr !== 'undefined') toastr.warning('请先从下拉列表中选择一个LoRA模型');
                  return;
              }

              const loraTag = `<lora:${loraName}:${loraWeight}>`;

              // 智能地将 LoRA Tag 添加到正向提示词输入框
              if (positivePromptTextarea.value.trim().length > 0) {
                  // 如果末尾不是逗号或空格，则先添加
                  if (!positivePromptTextarea.value.endsWith(',') && !positivePromptTextarea.value.endsWith(', ')) {
                      positivePromptTextarea.value += ', ';
                  } else if (positivePromptTextarea.value.endsWith(',')) {
                      positivePromptTextarea.value += ' ';
                  }
              }

              positivePromptTextarea.value += loraTag;

              // 触发 input 事件，以便其他依赖此输入的逻辑（如自动保存）能够正确触发
              positivePromptTextarea.dispatchEvent(new Event('input', { bubbles: true }));

              if (typeof toastr !== 'undefined') toastr.success(`已添加LoRA: ${loraName}`);
          });
      }

      // 加载设置
      loadSettings(inputs);

      // 加载当前模式
      loadCurrentMode();

      // 加载快捷键配置并更新按钮标题
      loadShortcuts().then(() => {
          updateButtonTitles();
      });

      // 加载工作流列表
      updateWorkflowList();

      // 加载LoRA预设列表
      loadComfyUILoraPresets();

      // 加载提示词预设列表
      loadPromptPresets();

      // 自动保存其他设置
      Object.entries(inputs).forEach(([key, input]) => {
          if (['startTag', 'endTag', 'sampler', 'scheduler', 'steps', 'cfg', 'webuiSampler', 'webuiScheduler', 'webuiSteps', 'webuiCfg', 'webuiDenoising', 'webuiEnableHires', 'webuiHiresUpscaler', 'webuiHiresSteps', 'webuiHiresUpscale', 'webuiHiresDenoising'].includes(key)) {
              return;
          }

          const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
          input.addEventListener(eventType, async () => {
              if (input === inputs.url) {
                  buttons.test.className = 'comfy-button';
              } else if (input === inputs.webuiUrl) {
                  buttons.webuiTest.className = 'comfy-button';
              }
              await saveSettings(inputs);
          });
      });
  }

    /**
 * 加载当前模式
 */
    async function loadCurrentMode() {
        currentMode = await GM_getValue(STORAGE_KEY_MODE, DEFAULT_SETTINGS.mode);
        updateModeUI();
    }

    /**
 * 切换编辑模式
 */
    function toggleEditMode() {
        isEditMode = !isEditMode;
        const toolbar = document.getElementById('edit-mode-toolbar');
        const editModeBtn = document.getElementById('workflow-edit-mode');

        if (isEditMode) {
            toolbar.classList.add('active');
            editModeBtn.textContent = '退出编辑';
            editModeBtn.classList.add('error');
            if (typeof toastr !== 'undefined') {
                toastr.info('已进入编辑模式，点击工作流名称可直接编辑');
            }
        } else {
            toolbar.classList.remove('active');
            editModeBtn.textContent = '编辑模式';
            editModeBtn.classList.remove('error');
            document.querySelectorAll('.workflow-item.editing').forEach(item => {
                item.classList.remove('editing');
            });
        }
    }

    /**
 * 保存编辑的工作流
 */
    async function saveEditedWorkflow() {
        if (!currentEditingWorkflow) return;

        const editInput = currentEditingWorkflow.querySelector('.workflow-edit-input');
        const newName = editInput.value.trim();
        const oldName = currentEditingWorkflow.dataset.workflowName;

        if (!newName) {
            if (typeof toastr !== 'undefined') {
                toastr.error('工作流名称不能为空');
            }
            return;
        }

        if (newName === oldName) {
            currentEditingWorkflow.classList.remove('editing');
            currentEditingWorkflow = null;
            return;
        }

        const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});

        if (workflows[newName] && newName !== oldName) {
            if (!confirm(`工作流"${newName}"已存在，是否覆盖？`)) {
                return;
            }
        }

        workflows[newName] = workflows[oldName];
        if (newName !== oldName) {
            delete workflows[oldName];
        }

        await GM_setValue(STORAGE_KEY_WORKFLOWS, workflows);

        const currentWorkflow = await GM_getValue('comfyui_workflow', '');
        if (currentWorkflow === workflows[newName]) {
            await GM_setValue('comfyui_workflow', workflows[newName]);
        }

        updateWorkflowList();
        currentEditingWorkflow = null;

        if (typeof toastr !== 'undefined') {
            toastr.success(`工作流已重命名为"${newName}"`);
        }
    }

    /**
 * 取消编辑模式
 */
    function cancelEditMode() {
        if (currentEditingWorkflow) {
            currentEditingWorkflow.classList.remove('editing');
            currentEditingWorkflow = null;
        }

        if (isEditMode) {
            toggleEditMode();
        }
    }

    /**
 * 过滤工作流
 */
    function filterWorkflows(searchTerm) {
        const workflowItems = document.querySelectorAll('.workflow-item');

        workflowItems.forEach(item => {
            const title = item.querySelector('.workflow-item-title').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
 * 转换工作流为占位符格式
 * @param {string} workflowString - 原始工作流字符串
 * @returns {string} - 转换后的工作流字符串
 */
    function convertWorkflowToPlaceholders(workflowString) {
        try {
            const workflow = JSON.parse(workflowString);
            let modified = false;

            // 首先分析节点连接关系，识别正负提示词节点
            const nodeConnections = analyzeNodeConnections(workflow);

            console.log('节点连接分析结果:', nodeConnections);

            // 遍历每个节点
            for (const [nodeId, nodeData] of Object.entries(workflow)) {
                if (nodeData && typeof nodeData === 'object') {
                    const result = processNode(nodeData, nodeId, nodeConnections, workflow);
                    if (result) {
                        modified = true;
                    }
                }
            }

            if (!modified) {
                throw new Error('未找到可替换的值，工作流可能已经是占位符格式');
            }

            return JSON.stringify(workflow, null, 2);
        } catch (error) {
            throw new Error(`解析工作流失败: ${error.message}`);
        }
    }

    /**
 * 处理节点对象
 * @param {Object} obj - 要处理的对象
 * @param {string} nodeId - 节点ID
 * @param {Object} connections - 节点连接分析结果
 * @param {Object} workflow - 完整的工作流对象
 * @returns {boolean} - 是否有修改
 */
    function processNode(obj, nodeId, connections, workflow) {
        let hasModified = false;

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // 递归处理嵌套对象
                const result = processNode(value, nodeId, connections, workflow);
                if (result) {
                    hasModified = true;
                }
            } else if (typeof value === 'string' || typeof value === 'number') {
                const replacement = getPlaceholder(key, value, nodeId, connections, workflow);
                if (replacement && replacement !== value) {
                    obj[key] = replacement;
                    hasModified = true;
                    console.log(`替换: 节点${nodeId}, ${key}: "${value}" -> "${replacement}"`);
                }
            }
        }

        return hasModified;
    }

    /**
 * 分析节点连接关系，识别正负提示词节点
 * @param {Object} workflow - 工作流对象
 * @returns {Object} - 节点连接分析结果
 */
    function analyzeNodeConnections(workflow) {
        const connections = {
            positivePromptNodes: new Set(),
            negativePromptNodes: new Set(),
            samplerNodes: new Set()
        };

        // 找到所有采样器节点
        for (const [nodeId, nodeData] of Object.entries(workflow)) {
            if (nodeData.class_type &&
                (nodeData.class_type === 'KSampler' ||
                 nodeData.class_type === 'KSamplerAdvanced' ||
                 nodeData.class_type.toLowerCase().includes('sampler'))) {
                connections.samplerNodes.add(nodeId);
                console.log(`找到采样器节点: ${nodeId}`);
            }
        }

        // 分析采样器的positive和negative连接
        for (const samplerId of connections.samplerNodes) {
            const samplerNode = workflow[samplerId];
            if (samplerNode && samplerNode.inputs) {
                // 查找positive连接
                if (samplerNode.inputs.positive && Array.isArray(samplerNode.inputs.positive)) {
                    const positiveNodeId = samplerNode.inputs.positive[0];
                    if (positiveNodeId) {
                        connections.positivePromptNodes.add(positiveNodeId.toString());
                        console.log(`识别正向提示词节点: ${positiveNodeId}`);
                    }
                }

                // 查找negative连接
                if (samplerNode.inputs.negative && Array.isArray(samplerNode.inputs.negative)) {
                    const negativeNodeId = samplerNode.inputs.negative[0];
                    if (negativeNodeId) {
                        connections.negativePromptNodes.add(negativeNodeId.toString());
                        console.log(`识别负向提示词节点: ${negativeNodeId}`);
                    }
                }
            }
        }

        return connections;
    }

    /**
 * 根据键名和值获取对应的占位符（修复版）
 * @param {string} key - 键名
 * @param {any} value - 值
 * @param {string} nodeId - 节点ID
 * @param {Object} connections - 节点连接分析结果
 * @param {Object} workflow - 完整的工作流对象
 * @returns {string|null} - 占位符或null
 */
function getPlaceholder(key, value, nodeId, connections, workflow) {
    const keyLower = key.toLowerCase();

    // Checkpoint模型处理
    if ((keyLower.includes('ckpt') || keyLower === 'ckpt_name') &&
        typeof value === 'string' && value.length > 0) {
        return '%model%';
    }

    // UNet模型处理
    if ((keyLower.includes('unet') || keyLower === 'unet_name') &&
        typeof value === 'string' && value.length > 0) {
        return '%unet_model%';
    }

    // 修复：改进提示词处理逻辑
    if (keyLower === 'text' && typeof value === 'string') {
        console.log(`检查text字段: 节点${nodeId}, 值: "${value}", 长度: ${value.length}`);

        // 首先通过连接关系判断
        if (connections.positivePromptNodes && connections.positivePromptNodes.has(nodeId)) {
            console.log(`节点${nodeId}通过连接关系识别为正向提示词`);
            return '%prompt%';
        } else if (connections.negativePromptNodes && connections.negativePromptNodes.has(nodeId)) {
            console.log(`节点${nodeId}通过连接关系识别为负向提示词`);
            return '%negative_prompt%';
        }

        // 通过节点标题判断
        const currentNode = workflow[nodeId];
        if (currentNode && currentNode._meta && currentNode._meta.title) {
            const title = currentNode._meta.title.toLowerCase();
            console.log(`检查节点标题: "${currentNode._meta.title}"`);

            if (title.includes('负') || title.includes('negative')) {
                console.log(`通过标题识别为负向提示词: ${currentNode._meta.title}`);
                return '%negative_prompt%';
            } else if (title.includes('正') || title.includes('positive')) {
                console.log(`通过标题识别为正向提示词: ${currentNode._meta.title}`);
                return '%prompt%';
            }
        }

        // 修复：CLIPTextEncode节点的处理逻辑
        if (currentNode && currentNode.class_type === 'CLIPTextEncode') {
            // 如果无法明确判断，根据值的内容进行智能推断
            if (value.trim() === '') {
                // 空字符串更可能是正向提示词占位符
                console.log(`CLIPTextEncode节点${nodeId}包含空字符串，推断为正向提示词`);
                return '%prompt%';
            } else {
                // 非空字符串，尝试通过内容特征判断
                const negativeKeywords = ['worst', 'bad', 'ugly', 'blurry', 'low quality', 'nsfw'];
                const hasNegativeKeywords = negativeKeywords.some(keyword =>
                    value.toLowerCase().includes(keyword)
                );

                if (hasNegativeKeywords) {
                    console.log(`CLIPTextEncode节点${nodeId}包含负向关键词，推断为负向提示词`);
                    return '%negative_prompt%';
                } else {
                    console.log(`CLIPTextEncode节点${nodeId}推断为正向提示词`);
                    return '%prompt%';
                }
            }
        }

        return null;
    }

        // 采样器相关
        if ((keyLower === 'sampler_name' || keyLower === 'sampler') &&
            typeof value === 'string' && value.length > 0) {
            return '%sampler%';
        }

        if (keyLower === 'scheduler' && typeof value === 'string' && value.length > 0) {
            return '%scheduler%';
        }

        // 尺寸参数
        if (keyLower === 'width' && typeof value === 'number' && value > 0) {
            return '%width%';
        }

        if (keyLower === 'height' && typeof value === 'number' && value > 0) {
            return '%height%';
        }

        // 生成参数
        if (keyLower === 'seed' && typeof value === 'number') {
            return '%seed%';
        }

        if (keyLower === 'steps' && typeof value === 'number' && value > 0) {
            return '%steps%';
        }

        if (keyLower === 'cfg' && typeof value === 'number' && value > 0) {
            return '%cfg%';
        }

        return null;
    }

    /**
 * 更新工作流列表显示
 */
    async function updateWorkflowList() {
        const listContainer = document.getElementById('workflow-list');
        const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
        const currentWorkflow = await GM_getValue('comfyui_workflow', '');

        listContainer.innerHTML = '';

        if (Object.keys(workflows).length === 0) {
            listContainer.innerHTML = '<div class="empty-workflows-message">暂无保存的工作流，请创建或导入工作流</div>';
            return;
        }

        const sortedNames = Object.keys(workflows).sort();

        for (const name of sortedNames) {
            const workflowData = workflows[name];
            const isActive = workflowData === currentWorkflow;

            const workflowItem = document.createElement('div');
            workflowItem.className = `workflow-item${isActive ? ' active' : ''}`;
            workflowItem.dataset.workflowName = name;
            workflowItem.innerHTML = `
                <div class="workflow-item-title">${escapeHTML(name)}</div>
                <input type="text" class="workflow-edit-input" value="${escapeHTML(name)}">
                <div class="workflow-item-actions">
                    <button class="comfy-button workflow-load-btn">加载</button>
                    <button class="comfy-button workflow-clone-btn">克隆</button>
                    <button class="comfy-button workflow-rename-btn">重命名</button>
                    <button class="comfy-button error workflow-delete-btn">删除</button>
                </div>
            `;

        const titleElement = workflowItem.querySelector('.workflow-item-title');
        titleElement.addEventListener('click', () => {
            if (isEditMode) {
                document.querySelectorAll('.workflow-item.editing').forEach(item => {
                    if (item !== workflowItem) {
                        item.classList.remove('editing');
                    }
                });

                workflowItem.classList.toggle('editing');
                currentEditingWorkflow = workflowItem.classList.contains('editing') ? workflowItem : null;

                if (currentEditingWorkflow) {
                    const editInput = workflowItem.querySelector('.workflow-edit-input');
                    setTimeout(() => {
                        editInput.focus();
                        editInput.select();
                    }, 50);
                }
            } else {
                loadWorkflow(name, workflowData, workflowItem);
            }
        });

        const editInput = workflowItem.querySelector('.workflow-edit-input');
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEditedWorkflow();
            } else if (e.key === 'Escape') {
                workflowItem.classList.remove('editing');
                currentEditingWorkflow = null;
            }
        });

        workflowItem.querySelector('.workflow-load-btn').addEventListener('click', () => {
            loadWorkflow(name, workflowData, workflowItem);
        });

        workflowItem.querySelector('.workflow-clone-btn').addEventListener('click', async () => {
            const baseName = name;
            let cloneName = `${baseName} - 副本`;
            let counter = 2;

            const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
            while (workflows[cloneName]) {
                cloneName = `${baseName} - 副本${counter}`;
                counter++;
            }

            workflows[cloneName] = workflowData;
            await GM_setValue(STORAGE_KEY_WORKFLOWS, workflows);

            updateWorkflowList();

            if (typeof toastr !== 'undefined') {
                toastr.success(`工作流已克隆为"${cloneName}"`);
            }
        });

        workflowItem.querySelector('.workflow-rename-btn').addEventListener('click', async () => {
            const newName = prompt(`请输入"${name}"的新名称:`, name);

            if (newName && newName.trim() && newName !== name) {
                const trimmedNewName = newName.trim();
                const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});

                if (workflows[trimmedNewName]) {
                    if (!confirm(`工作流"${trimmedNewName}"已存在，是否覆盖？`)) {
                        return;
                    }
                }

                workflows[trimmedNewName] = workflows[name];
                delete workflows[name];

                await GM_setValue(STORAGE_KEY_WORKFLOWS, workflows);
                updateWorkflowList();

                if (typeof toastr !== 'undefined') {
                    toastr.success(`工作流已重命名为"${trimmedNewName}"`);
                }
            }
        });

        workflowItem.querySelector('.workflow-delete-btn').addEventListener('click', async () => {
            if (confirm(`确定要删除工作流"${name}"吗？此操作不可撤销。`)) {
                const workflows = await GM_getValue(STORAGE_KEY_WORKFLOWS, {});
                delete workflows[name];
                await GM_setValue(STORAGE_KEY_WORKFLOWS, workflows);

                updateWorkflowList();

                if (typeof toastr !== 'undefined') {
                    toastr.success(`工作流"${name}"已删除`);
                }
            }
        });

        listContainer.appendChild(workflowItem);
    }
  }

    /**
 * 加载工作流
 */
    async function loadWorkflow(name, workflowData, workflowItem) {
        document.getElementById('comfyui-workflow').value = workflowData;
        await GM_setValue('comfyui_workflow', workflowData);

        document.querySelectorAll('.workflow-item').forEach(item => item.classList.remove('active'));
        workflowItem.classList.add('active');

        if (typeof toastr !== 'undefined') {
            toastr.success(`已加载工作流"${name}"`);
        }
    }

    /**
 * 显示保存工作流模态框
 * @param {string} defaultName - 默认工作流名称
 */
    function showWorkflowSaveModal(defaultName = '') {
        const modal = document.getElementById('workflow-save-modal');
        const nameInput = document.getElementById('workflow-name-input');

        nameInput.value = defaultName;
        modal.style.display = 'block';

        setTimeout(() => nameInput.focus(), 100);

        nameInput.dispatchEvent(new Event('input'));
    }

    /**
 * 获取并填充模型列表
 * @param {string} url - ComfyUI服务器URL
 * @param {HTMLSelectElement} selectElement - 模型选择下拉框元素
 * @returns {Promise<void>}
 */
    async function fetchAndPopulateModels(url, selectElement) {
        selectElement.innerHTML = '<option>正在加载模型...</option>';
        selectElement.disabled = true;

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/object_info`,
                timeout: 3600000
            });

            const data = JSON.parse(response.responseText);
            const models = data?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0];

            if (!models || models.length === 0) {
                throw new Error("未找到模型");
            }

            selectElement.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                selectElement.appendChild(option);
            });

            const savedModel = await GM_getValue('comfyui_model');
            if (savedModel) selectElement.value = savedModel;

            if (typeof toastr !== 'undefined') {
                toastr.success('ComfyUI Checkpoint模型列表加载成功');
            }
        } catch (e) {
            selectElement.innerHTML = `<option>加载失败: ${e.message}</option>`;

            if (typeof toastr !== 'undefined') {
                toastr.error(`加载ComfyUI Checkpoint模型列表失败: ${e.message}`);
            }
        } finally {
            selectElement.disabled = false;
        }
    }

    /**
 * 获取并填充UNet模型列表
 * @param {string} url - ComfyUI服务器URL
 * @param {HTMLSelectElement} selectElement - UNet模型选择下拉框元素
 * @returns {Promise<void>}
 */
    async function fetchAndPopulateUNetModels(url, selectElement) {
        selectElement.innerHTML = '<option>正在加载UNet模型...</option>';
        selectElement.disabled = true;

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/object_info`,
                timeout: 3600000
            });

            const data = JSON.parse(response.responseText);

            let unetModels = null;
            const possibleNodeTypes = ['UNETLoader', 'UnetLoader', 'DiffusionModelLoader', 'UNetLoader'];

            for (const nodeType of possibleNodeTypes) {
                if (data[nodeType]?.input?.required?.unet_name?.[0]) {
                    unetModels = data[nodeType].input.required.unet_name[0];
                    break;
                }
            }

            if (!unetModels || unetModels.length === 0) {
                selectElement.innerHTML = '<option value="">无UNet模型可用</option>';
                if (typeof toastr !== 'undefined') {
                    toastr.info('未找到UNet模型，可能此ComfyUI版本不支持或未安装相关节点');
                }
                return;
            }

            selectElement.innerHTML = '<option value="">选择UNet模型...</option>';
            unetModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                selectElement.appendChild(option);
            });

            const savedUnetModel = await GM_getValue('comfyui_unet_model');
            if (savedUnetModel) selectElement.value = savedUnetModel;

            if (typeof toastr !== 'undefined') {
                toastr.success('ComfyUI UNet模型列表加载成功');
            }
        } catch (e) {
            selectElement.innerHTML = `<option>加载失败: ${e.message}</option>`;

            if (typeof toastr !== 'undefined') {
                toastr.error(`加载ComfyUI UNet模型列表失败: ${e.message}`);
            }
        } finally {
            selectElement.disabled = false;
        }
    }

    /**
 * 获取并填充WebUI模型列表
 * @param {string} url - WebUI服务器URL
 * @param {HTMLSelectElement} selectElement - 模型选择下拉框元素
 * @returns {Promise<void>}
 */
    async function fetchAndPopulateWebUIModels(url, selectElement) {
        selectElement.innerHTML = '<option>正在加载模型...</option>';
        selectElement.disabled = true;

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/sdapi/v1/sd-models`,
                timeout: 3600000
            });

            const models = JSON.parse(response.responseText);

            if (!models || models.length === 0) {
                throw new Error("未找到模型");
            }

            selectElement.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.model_name || model.title;
                option.textContent = model.model_name || model.title;
                selectElement.appendChild(option);
            });

            const savedModel = await GM_getValue('webui_model');
            if (savedModel) {
                selectElement.value = savedModel;
            } else if (models.length > 0) {
                selectElement.value = models[0].model_name || models[0].title;
                await GM_setValue('webui_model', selectElement.value);
            }

            selectElement.dispatchEvent(new Event('change'));

            if (typeof toastr !== 'undefined') {
                toastr.success('WebUI模型列表加载成功');
            }
        } catch (e) {
            selectElement.innerHTML = `<option>加载失败: ${e.message}</option>`;

            if (typeof toastr !== 'undefined') {
                toastr.error(`加载WebUI模型列表失败: ${e.message}`);
            }
        } finally {
            selectElement.disabled = false;
        }
    }

    /**
 * 获取并填充WebUI LoRA列表到下拉菜单
 * @param {string} url - WebUI服务器URL
 * @returns {Promise<void>}
 */
    async function fetchAndPopulateWebUILoras(url) {
        const loraSelect = document.getElementById('webui-lora-select');
        if (!loraSelect) return;

        // 修正：先显示加载状态，再禁用控件
        loraSelect.innerHTML = '<option>正在加载LoRA...</option>';
        loraSelect.disabled = true;

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/sdapi/v1/loras`,
                timeout: 3600000
            });

            const loras = JSON.parse(response.responseText);
            availableLoras = loras;

            if (!loras || loras.length === 0) {
                loraSelect.innerHTML = '<option value="">未找到LoRA模型</option>';
                return;
            }

            loraSelect.innerHTML = '<option value="">--- 请选择一个LoRA ---</option>';
            loras.forEach(lora => {
                const option = document.createElement('option');
                option.value = lora.name;
                option.textContent = lora.alias || lora.name;
                loraSelect.appendChild(option);
            });


            if (typeof toastr !== 'undefined') {
                toastr.success(`已加载 ${loras.length} 个LoRA模型`);
            }
        } catch (e) {
            loraSelect.innerHTML = `<option value="">加载失败</option>`;
            if (typeof toastr !== 'undefined') {
                toastr.error(`加载LoRA列表失败: ${e.message}`);
            }
        } finally {
            loraSelect.disabled = false;
        }
    }

    /**
 * 获取并填充WebUI Embedding列表
 * @param {string} url - WebUI服务器URL
 * @returns {Promise<void>}
 */
    async function fetchAndPopulateWebUIEmbeddings(url) {
        const embeddingList = document.getElementById('embedding-list');
        embeddingList.innerHTML = '<div style="padding: 20px; text-align: center;">正在加载Embedding...</div>';

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/sdapi/v1/embeddings`,
                timeout: 3600000
            });

            const embeddings = JSON.parse(response.responseText);
            availableEmbeddings = Object.keys(embeddings.loaded || {}).map(name => ({ name }));

            if (!availableEmbeddings || availableEmbeddings.length === 0) {
                embeddingList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">未找到Embedding模型</div>';
                return;
            }

            renderEmbeddingList();

            if (typeof toastr !== 'undefined') {
                toastr.success(`已加载 ${availableEmbeddings.length} 个Embedding模型`);
            }
        } catch (e) {
            embeddingList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--vp-error-color);">加载失败: ${e.message}</div>`;

            if (typeof toastr !== 'undefined') {
                toastr.error(`加载Embedding列表失败: ${e.message}`);
            }
        }
    }

    /**
 * 渲染Embedding列表
 */
    function renderEmbeddingList() {
        const embeddingList = document.getElementById('embedding-list');
        const selectedEmbeddings = getCurrentSelectedEmbeddings();

        embeddingList.innerHTML = '';

        availableEmbeddings.forEach(embedding => {
            const isSelected = selectedEmbeddings.some(selected => selected.name === embedding.name);
            const selectedEmbedding = selectedEmbeddings.find(selected => selected.name === embedding.name);
            const weight = selectedEmbedding ? selectedEmbedding.weight : 1.0;
            const type = selectedEmbedding ? selectedEmbedding.type : 'positive';

            const embeddingItem = document.createElement('div');
            embeddingItem.className = 'embedding-item';
            embeddingItem.innerHTML = `
                <div class="embedding-info">
                    <div class="embedding-name">${escapeHTML(embedding.name)}</div>
                </div>
                <div class="embedding-controls">
                    <div class="embedding-type-controls" ${!isSelected ? 'style="display: none;"' : ''}>
                        <label style="font-size: 0.8em; margin: 0 5px 0 0; color: var(--vp-text-color);">
                            <input type="radio" class="embedding-type-radio" name="type-${escapeHTML(embedding.name)}" value="positive" ${type === 'positive' ? 'checked' : ''}> 正向
                        </label>
                        <label style="font-size: 0.8em; margin: 0 10px 0 0; color: var(--vp-text-color);">
                            <input type="radio" class="embedding-type-radio" name="type-${escapeHTML(embedding.name)}" value="negative" ${type === 'negative' ? 'checked' : ''}> 负向
                        </label>
                    </div>
                    <input type="number" class="embedding-weight" min="0" max="2" step="0.1" value="${weight}" ${!isSelected ? 'disabled' : ''}>
                    <input type="checkbox" class="embedding-checkbox" ${isSelected ? 'checked' : ''}>
                </div>
            `;

        const checkbox = embeddingItem.querySelector('.embedding-checkbox');
        const weightInput = embeddingItem.querySelector('.embedding-weight');
        const typeControls = embeddingItem.querySelector('.embedding-type-controls');
        const typeRadios = embeddingItem.querySelectorAll('.embedding-type-radio');

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                const selectedType = embeddingItem.querySelector('.embedding-type-radio:checked').value;
                addSelectedEmbedding(embedding.name, parseFloat(weightInput.value), selectedType);
                weightInput.disabled = false;
                typeControls.style.display = 'block';
            } else {
                removeSelectedEmbedding(embedding.name);
                weightInput.disabled = true;
                typeControls.style.display = 'none';
            }
            updateSelectedEmbeddingsDisplay();
        });

        weightInput.addEventListener('input', () => {
            if (checkbox.checked) {
                const selectedType = embeddingItem.querySelector('.embedding-type-radio:checked').value;
                updateSelectedEmbeddingWeight(embedding.name, parseFloat(weightInput.value), selectedType);
                updateSelectedEmbeddingsDisplay();
            }
        });

        typeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (checkbox.checked) {
                    updateSelectedEmbeddingWeight(embedding.name, parseFloat(weightInput.value), radio.value);
                    updateSelectedEmbeddingsDisplay();
                }
            });
        });

        embeddingList.appendChild(embeddingItem);
    });
  }

    /**
 * 获取当前选中的Embedding
 */
    function getCurrentSelectedEmbeddings() {
        return JSON.parse(localStorage.getItem('selected_embeddings') || '[]');
    }

    /**
 * 添加选中的Embedding
 */
    function addSelectedEmbedding(name, weight, type = 'positive') {
        const selectedEmbeddings = getCurrentSelectedEmbeddings();
        const existing = selectedEmbeddings.find(embedding => embedding.name === name);
        if (!existing) {
            selectedEmbeddings.push({ name, weight, type });
            localStorage.setItem('selected_embeddings', JSON.stringify(selectedEmbeddings));
        }
    }

    /**
 * 移除选中的Embedding
 */
    function removeSelectedEmbedding(name) {
        const selectedEmbeddings = getCurrentSelectedEmbeddings();
        const filtered = selectedEmbeddings.filter(embedding => embedding.name !== name);
        localStorage.setItem('selected_embeddings', JSON.stringify(filtered));
    }

    /**
 * 更新选中的Embedding权重
 */
    function updateSelectedEmbeddingWeight(name, weight, type) {
        const selectedEmbeddings = getCurrentSelectedEmbeddings();
        const embedding = selectedEmbeddings.find(embedding => embedding.name === name);
        if (embedding) {
            embedding.weight = weight;
            if (type !== undefined) {
                embedding.type = type;
            }
            localStorage.setItem('selected_embeddings', JSON.stringify(selectedEmbeddings));
        }
    }

    /**
 * 更新选中Embedding的显示
 */
    function updateSelectedEmbeddingsDisplay() {
        const container = document.getElementById('selected-embeddings-container');
        const selectedEmbeddings = getCurrentSelectedEmbeddings();

        if (selectedEmbeddings.length === 0) {
            container.innerHTML = '<div style="color: #888; font-style: italic;">暂未选择Embedding</div>';
            return;
        }

        const positiveEmbeddings = selectedEmbeddings.filter(emb => emb.type === 'positive');
        const negativeEmbeddings = selectedEmbeddings.filter(emb => emb.type === 'negative');

        let html = '';

        if (positiveEmbeddings.length > 0) {
            html += '<div style="margin-bottom: 10px;"><span style="color: var(--vp-success-color); font-weight: 600; font-size: 0.9em;">正向:</span><br>';
            html += positiveEmbeddings.map(embedding => `
                <span class="selected-embedding-tag" style="background: var(--vp-success-color);">
                    ${escapeHTML(embedding.name)} (${embedding.weight})
                    <span class="remove" data-name="${escapeHTML(embedding.name)}">×</span>
                </span>
            `).join('');
        html += '</div>';
    }

      if (negativeEmbeddings.length > 0) {
          html += '<div><span style="color: var(--vp-error-color); font-weight: 600; font-size: 0.9em;">负向:</span><br>';
          html += negativeEmbeddings.map(embedding => `
                <span class="selected-embedding-tag" style="background: var(--vp-error-color);">
                    ${escapeHTML(embedding.name)} (${embedding.weight})
                    <span class="remove" data-name="${escapeHTML(embedding.name)}">×</span>
                </span>
            `).join('');
        html += '</div>';
    }

      container.innerHTML = html;

      container.querySelectorAll('.remove').forEach(btn => {
          btn.addEventListener('click', () => {
              const name = btn.dataset.name;
              removeSelectedEmbedding(name);
              renderEmbeddingList();
              updateSelectedEmbeddingsDisplay();
          });
      });
  }

    /**
 * 生成Embedding提示词字符串
 */
    function generateEmbeddingPromptString(type = 'positive') {
        const selectedEmbeddings = getCurrentSelectedEmbeddings().filter(emb => emb.type === type);
        return selectedEmbeddings.map(embedding =>
                                      embedding.weight === 1.0 ? embedding.name : `(${embedding.name}:${embedding.weight})`
    ).join(', ');
  }

    /**
* 获取并填充ComfyUI LoRA列表
* @param {string} url - ComfyUI服务器URL
* @returns {Promise<void>}
*/
    async function fetchAndPopulateComfyUILoras(url) {
        const loraList = document.getElementById('comfyui-lora-list');
        loraList.innerHTML = '<div style="padding: 20px; text-align: center;">正在加载ComfyUI LoRA...</div>';

        try {
            const response = await makeRequest({
                method: 'GET',
                url: `${url}/object_info`,
                timeout: 3600000
            });

            const data = JSON.parse(response.responseText);

            // 查找LoRA节点类型
            let loraNodeTypes = ['LoraLoader', 'LoRALoader', 'Lora Loader'];
            let loras = null;

            for (const nodeType of loraNodeTypes) {
                if (data[nodeType]?.input?.required?.lora_name?.[0]) {
                    loras = data[nodeType].input.required.lora_name[0];
                    break;
                }
            }

            if (!loras || loras.length === 0) {
                loraList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">未找到LoRA模型</div>';
                return;
            }

            availableComfyUILoras = loras.map(name => ({ name, alias: name }));
            renderComfyUILoraList();

            if (typeof toastr !== 'undefined') {
                toastr.success(`已加载 ${loras.length} 个ComfyUI LoRA模型`);
            }
        } catch (e) {
            loraList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--vp-error-color);">加载失败: ${e.message}</div>`;

            if (typeof toastr !== 'undefined') {
                toastr.error(`加载ComfyUI LoRA列表失败: ${e.message}`);
            }
        }
    }

    /**
 * 渲染ComfyUI LoRA列表
 */
    function renderComfyUILoraList() {
        const loraList = document.getElementById('comfyui-lora-list');
        const selectedLoras = getCurrentComfyUISelectedLoras();

        loraList.innerHTML = '';

        availableComfyUILoras.forEach(lora => {
            const isSelected = selectedLoras.some(selected => selected.name === lora.name);
            const selectedLora = selectedLoras.find(selected => selected.name === lora.name);
            const weight = selectedLora ? selectedLora.weight : 1.0;

            const loraItem = document.createElement('div');
            loraItem.className = 'lora-item';
            loraItem.innerHTML = `
            <div class="lora-info">
                <div class="lora-name">${escapeHTML(lora.name)}</div>
                <div class="lora-alias">ComfyUI LoRA</div>
            </div>
            <div class="lora-controls">
                <input type="number" class="lora-weight" min="0" max="2" step="0.1" value="${weight}" ${!isSelected ? 'disabled' : ''}>
                <input type="checkbox" class="lora-checkbox" ${isSelected ? 'checked' : ''}>
            </div>
        `;

        const checkbox = loraItem.querySelector('.lora-checkbox');
        const weightInput = loraItem.querySelector('.lora-weight');

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                addComfyUISelectedLora(lora.name, parseFloat(weightInput.value));
                weightInput.disabled = false;
            } else {
                removeComfyUISelectedLora(lora.name);
                weightInput.disabled = true;
            }
            updateComfyUISelectedLorasDisplay();
        });

        weightInput.addEventListener('input', () => {
            if (checkbox.checked) {
                updateComfyUISelectedLoraWeight(lora.name, parseFloat(weightInput.value));
                updateComfyUISelectedLorasDisplay();
            }
        });

        loraList.appendChild(loraItem);
    });
  }

    /**
 * 获取当前选中的ComfyUI LoRA
 */
    function getCurrentComfyUISelectedLoras() {
        return JSON.parse(localStorage.getItem('comfyui_selected_loras') || '[]');
    }

    /**
 * 添加选中的ComfyUI LoRA
 */
    function addComfyUISelectedLora(name, weight) {
        const selectedLoras = getCurrentComfyUISelectedLoras();
        const existing = selectedLoras.find(lora => lora.name === name);
        if (!existing) {
            selectedLoras.push({ name, weight });
            localStorage.setItem('comfyui_selected_loras', JSON.stringify(selectedLoras));
        }
    }

    /**
 * 移除选中的ComfyUI LoRA
 */
    function removeComfyUISelectedLora(name) {
        const selectedLoras = getCurrentComfyUISelectedLoras();
        const filtered = selectedLoras.filter(lora => lora.name !== name);
        localStorage.setItem('comfyui_selected_loras', JSON.stringify(filtered));
    }

    /**
 * 更新选中的ComfyUI LoRA权重
 */
    function updateComfyUISelectedLoraWeight(name, weight) {
        const selectedLoras = getCurrentComfyUISelectedLoras();
        const lora = selectedLoras.find(lora => lora.name === name);
        if (lora) {
            lora.weight = weight;
            localStorage.setItem('comfyui_selected_loras', JSON.stringify(selectedLoras));
        }
    }

    /**
 * 更新选中ComfyUI LoRA的显示
 */
    function updateComfyUISelectedLorasDisplay() {
        const container = document.getElementById('comfyui-selected-loras-container');
        const selectedLoras = getCurrentComfyUISelectedLoras();

        if (selectedLoras.length === 0) {
            container.innerHTML = '<div style="color: #888; font-style: italic;">暂未选择ComfyUI LoRA</div>';
            return;
        }

        container.innerHTML = selectedLoras.map(lora => `
        <span class="selected-lora-tag">
            ${escapeHTML(lora.name)} (${lora.weight})
            <span class="remove" data-name="${escapeHTML(lora.name)}">×</span>
        </span>
    `).join('');

      container.querySelectorAll('.remove').forEach(btn => {
          btn.addEventListener('click', () => {
              const name = btn.dataset.name;
              removeComfyUISelectedLora(name);
              renderComfyUILoraList();
              updateComfyUISelectedLorasDisplay();
          });
      });
  }

    /**
 * 加载提示词预设列表
 */
    async function loadPromptPresets() {
        const select = document.getElementById('prompt-preset-select');
        const presets = await GM_getValue(STORAGE_KEY_PROMPT_PRESETS, {});

        select.innerHTML = '<option value="">选择预设...</option>';

        Object.keys(presets).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }

    /**
 * 保存当前提示词为预设
 */
    async function saveCurrentAsPreset(presetName) {
        const positivePrompt = document.getElementById('comfyui-positive-prompt').value;
        const negativePrompt = document.getElementById('comfyui-negative-prompt').value;

        const presets = await GM_getValue(STORAGE_KEY_PROMPT_PRESETS, {});
        presets[presetName] = {
            positive: positivePrompt,
            negative: negativePrompt,
            timestamp: Date.now()
        };

        await GM_setValue(STORAGE_KEY_PROMPT_PRESETS, presets);
        await loadPromptPresets();
    }

    /**
 * 加载选中的预设
 */
    async function loadSelectedPreset(presetName) {
        const presets = await GM_getValue(STORAGE_KEY_PROMPT_PRESETS, {});
        const preset = presets[presetName];

        if (preset) {
            document.getElementById('comfyui-positive-prompt').value = preset.positive || '';
            document.getElementById('comfyui-negative-prompt').value = preset.negative || '';

            // 触发保存设置
            const inputs = {
                positivePrompt: document.getElementById('comfyui-positive-prompt'),
                negativePrompt: document.getElementById('comfyui-negative-prompt')
            };
            await saveSettings(inputs);

            if (typeof toastr !== 'undefined') {
                toastr.success(`已加载预设"${presetName}"`);
            }
        }
    }

    /**
 * 删除选中的预设
 */
    async function deleteSelectedPreset(presetName) {
        const presets = await GM_getValue(STORAGE_KEY_PROMPT_PRESETS, {});
        delete presets[presetName];

        await GM_setValue(STORAGE_KEY_PROMPT_PRESETS, presets);
        await loadPromptPresets();

        if (typeof toastr !== 'undefined') {
            toastr.success(`预设"${presetName}"已删除`);
        }
    }

    /**
 * 显示保存预设模态框
 */
    function showPromptPresetSaveModal() {
        const modal = document.getElementById('prompt-preset-save-modal');
        const nameInput = document.getElementById('prompt-preset-name-input');

        nameInput.value = '';
        modal.style.display = 'block';

        setTimeout(() => nameInput.focus(), 100);
    }

    /**
 * 自动向ComfyUI工作流注入LoRA节点
 * @param {Object} workflow - 工作流对象
 * @param {Array} selectedLoras - 选中的LoRA列表
 */
    function injectLoraNodes(workflow, selectedLoras) {
        if (!selectedLoras || selectedLoras.length === 0) return;

        // 找到所有现有节点的最大ID
        const existingIds = Object.keys(workflow).map(id => parseInt(id)).filter(id => !isNaN(id));
        let maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

        // 查找主要的模型加载器节点
        let modelLoaderNode = null;
        let modelLoaderNodeId = null;

        for (const [nodeId, nodeData] of Object.entries(workflow)) {
            if (nodeData.class_type === 'CheckpointLoaderSimple' ||
                nodeData.class_type === 'CheckpointLoader') {
                modelLoaderNode = nodeData;
                modelLoaderNodeId = nodeId;
                break;
            }
        }

        if (!modelLoaderNode) {
            console.warn('未找到模型加载器节点，无法注入LoRA');
            return;
        }

        // 查找所有使用模型输出的节点
        const modelConsumers = [];
        for (const [nodeId, nodeData] of Object.entries(workflow)) {
            if (nodeData.inputs) {
                for (const [inputKey, inputValue] of Object.entries(nodeData.inputs)) {
                    if (Array.isArray(inputValue) && inputValue[0] === modelLoaderNodeId) {
                        modelConsumers.push({
                            nodeId,
                            inputKey,
                            outputIndex: inputValue[1]
                        });
                    }
                }
            }
        }

        let previousNodeId = modelLoaderNodeId;
        let previousOutputIndices = { model: 0, clip: 1 }; // 默认输出索引

        // 逐个添加LoRA节点
        selectedLoras.forEach((lora, index) => {
            const loraNodeId = (++maxId).toString();

            workflow[loraNodeId] = {
                class_type: 'LoraLoader',
                inputs: {
                    lora_name: lora.name,
                    strength_model: lora.weight,
                    strength_clip: lora.weight,
                    model: [previousNodeId, previousOutputIndices.model],
                    clip: [previousNodeId, previousOutputIndices.clip]
                }
            };

            previousNodeId = loraNodeId;
            // LoraLoader输出: 0=model, 1=clip
            previousOutputIndices = { model: 0, clip: 1 };
        });

        // 更新所有消费者节点的输入，指向最后一个LoRA节点
        modelConsumers.forEach(consumer => {
            const consumerNode = workflow[consumer.nodeId];
            if (consumerNode && consumerNode.inputs) {
                if (consumer.outputIndex === 0 || consumer.outputIndex === 1) {
                    // model或clip输出
                    consumerNode.inputs[consumer.inputKey] = [
                        previousNodeId,
                        consumer.outputIndex
                    ];
                } else {
                    // 其他输出（如VAE）保持原来的连接
                    consumerNode.inputs[consumer.inputKey] = [
                        modelLoaderNodeId,
                        consumer.outputIndex
                    ];
                }
            }
        });

        console.log(`已自动注入 ${selectedLoras.length} 个LoRA节点到ComfyUI工作流`);
    }

    /**
 * 加载设置到UI
 * @param {Object} inputs - 包含所有输入元素引用的对象
 */
    async function loadSettings(inputs) {
        inputs.url.value = await GM_getValue('comfyui_url', DEFAULT_SETTINGS.url);
        inputs.webuiUrl.value = await GM_getValue('webui_url', DEFAULT_SETTINGS.webuiUrl);
        inputs.workflow.value = await GM_getValue('comfyui_workflow', DEFAULT_SETTINGS.workflow);
        inputs.startTag.value = await GM_getValue('comfyui_start_tag', DEFAULT_SETTINGS.startTag);
        inputs.endTag.value = await GM_getValue('comfyui_end_tag', DEFAULT_SETTINGS.endTag);
        inputs.genWidth.value = await GM_getValue('comfyui_gen_width', DEFAULT_SETTINGS.genWidth);
        inputs.genHeight.value = await GM_getValue('comfyui_gen_height', DEFAULT_SETTINGS.genHeight);
        inputs.displayWidth.value = await GM_getValue('comfyui_display_width', DEFAULT_SETTINGS.displayWidth);
        inputs.displayHeight.value = await GM_getValue('comfyui_display_height', DEFAULT_SETTINGS.displayHeight);
        inputs.autoGen.checked = await GM_getValue('comfyui_auto_generate', DEFAULT_SETTINGS.autoGenerate);
        inputs.sampler.value = await GM_getValue('comfyui_sampler', DEFAULT_SETTINGS.sampler);
        inputs.scheduler.value = await GM_getValue('comfyui_scheduler', DEFAULT_SETTINGS.scheduler);
        inputs.steps.value = await GM_getValue('comfyui_steps', DEFAULT_SETTINGS.steps);
        inputs.cfg.value = await GM_getValue('comfyui_cfg', DEFAULT_SETTINGS.cfg);
        inputs.webuiSampler.value = await GM_getValue('webui_sampler', DEFAULT_SETTINGS.webuiSampler);
        inputs.webuiScheduler.value = await GM_getValue('webui_scheduler', DEFAULT_SETTINGS.webuiScheduler);
        inputs.webuiSteps.value = await GM_getValue('webui_steps', DEFAULT_SETTINGS.steps);
        inputs.webuiCfg.value = await GM_getValue('webui_cfg', DEFAULT_SETTINGS.cfg);
        inputs.webuiDenoising.value = await GM_getValue('webui_denoising', DEFAULT_SETTINGS.denoisingStrength);
        inputs.webuiEnableHires.checked = await GM_getValue('webui_enable_hires', DEFAULT_SETTINGS.enableHires);
        inputs.webuiHiresUpscaler.value = await GM_getValue('webui_hires_upscaler', DEFAULT_SETTINGS.hiresUpscaler);
        inputs.webuiHiresSteps.value = await GM_getValue('webui_hires_steps', DEFAULT_SETTINGS.hiresSteps);
        inputs.webuiHiresUpscale.value = await GM_getValue('webui_hires_upscale', DEFAULT_SETTINGS.hiresUpscale);
        inputs.webuiHiresDenoising.value = await GM_getValue('webui_hires_denoising', DEFAULT_SETTINGS.hiresDenoising);
        inputs.positivePrompt.value = await GM_getValue('comfyui_positive_prompt', DEFAULT_SETTINGS.positivePrompt);
        inputs.negativePrompt.value = await GM_getValue('comfyui_negative_prompt', DEFAULT_SETTINGS.negativePrompt);

        const hiresSettings = document.getElementById('hires-settings');
        hiresSettings.style.display = inputs.webuiEnableHires.checked ? 'block' : 'none';

        if (inputs.url.value) {
            fetchAndPopulateModels(inputs.url.value, inputs.modelSelect).catch(error => {
                console.warn('初始ComfyUI Checkpoint模型加载失败:', error);
            });
            fetchAndPopulateUNetModels(inputs.url.value, inputs.unetSelect).catch(error => {
                console.warn('初始ComfyUI UNet模型加载失败:', error);
            });
        }

        if (inputs.webuiUrl.value) {
            fetchAndPopulateWebUIModels(inputs.webuiUrl.value, inputs.webuiModelSelect).catch(error => {
                console.warn('初始WebUI模型加载失败:', error);
            });
            fetchAndPopulateWebUILoras(inputs.webuiUrl.value).catch(error => {
                console.warn('初始WebUI LoRA加载失败:', error);
            });
            fetchAndPopulateWebUIEmbeddings(inputs.webuiUrl.value).catch(error => {
                console.warn('初始WebUI Embedding加载失败:', error);
            });
            fetchAndPopulateComfyUILoras(inputs.url.value).catch(error => {
                console.warn('初始ComfyUI LoRA加载失败:', error);
            });
        }
    }

    /**
 * 保存设置
 * @param {Object} inputs - 包含所有输入元素引用的对象
 */
    async function saveSettings(inputs) {
        try {
            await GM_setValue('comfyui_url', inputs.url.value);
            await GM_setValue('webui_url', inputs.webuiUrl.value);
            await GM_setValue('comfyui_workflow', inputs.workflow.value);
            await GM_setValue('comfyui_start_tag', inputs.startTag.value);
            await GM_setValue('comfyui_end_tag', inputs.endTag.value);
            await GM_setValue('comfyui_gen_width', parseInt(inputs.genWidth.value, 10) || DEFAULT_SETTINGS.genWidth);
            await GM_setValue('comfyui_gen_height', parseInt(inputs.genHeight.value, 10) || DEFAULT_SETTINGS.genHeight);
            await GM_setValue('comfyui_display_width', parseInt(inputs.displayWidth.value, 10) || DEFAULT_SETTINGS.displayWidth);
            await GM_setValue('comfyui_display_height', parseInt(inputs.displayHeight.value, 10) || DEFAULT_SETTINGS.displayHeight);
            await GM_setValue('comfyui_auto_generate', inputs.autoGen.checked);

            if (inputs.modelSelect.value) {
                await GM_setValue('comfyui_model', inputs.modelSelect.value);
            }

            if (inputs.unetSelect.value) {
                await GM_setValue('comfyui_unet_model', inputs.unetSelect.value);
            }

            if (inputs.webuiModelSelect && inputs.webuiModelSelect.value) {
                await GM_setValue('webui_model', inputs.webuiModelSelect.value);
            }

            await GM_setValue('comfyui_sampler', inputs.sampler.value);
            await GM_setValue('comfyui_scheduler', inputs.scheduler.value);
            await GM_setValue('comfyui_steps', parseInt(inputs.steps.value, 10) || DEFAULT_SETTINGS.steps);
            await GM_setValue('comfyui_cfg', parseFloat(inputs.cfg.value) || DEFAULT_SETTINGS.cfg);
            await GM_setValue('webui_sampler', inputs.webuiSampler.value);
            await GM_setValue('webui_scheduler', inputs.webuiScheduler.value);
            await GM_setValue('webui_steps', parseInt(inputs.webuiSteps.value, 10) || DEFAULT_SETTINGS.steps);
            await GM_setValue('webui_cfg', parseFloat(inputs.webuiCfg.value) || DEFAULT_SETTINGS.cfg);
            await GM_setValue('webui_denoising', parseFloat(inputs.webuiDenoising.value) || DEFAULT_SETTINGS.denoisingStrength);
            await GM_setValue('webui_enable_hires', inputs.webuiEnableHires.checked);
            await GM_setValue('webui_hires_upscaler', inputs.webuiHiresUpscaler.value);
            await GM_setValue('webui_hires_steps', parseInt(inputs.webuiHiresSteps.value, 10) || DEFAULT_SETTINGS.hiresSteps);
            await GM_setValue('webui_hires_upscale', parseFloat(inputs.webuiHiresUpscale.value) || DEFAULT_SETTINGS.hiresUpscale);
            await GM_setValue('webui_hires_denoising', parseFloat(inputs.webuiHiresDenoising.value) || DEFAULT_SETTINGS.hiresDenoising);
            await GM_setValue('comfyui_positive_prompt', inputs.positivePrompt.value);
            await GM_setValue('comfyui_negative_prompt', inputs.negativePrompt.value);

            return true;
        } catch (error) {
            console.error('保存设置失败:', error);
            return false;
        }
    }

    /**
 * 增强的图片缓存存储
 * @param {string} generationId - 生成ID
 * @param {string} imageUrl - 图片URL
 * @param {string} prompt - 提示词
 * @param {Object} metadata - 元数据
 */
    async function saveImageToCache(generationId, imageUrl, prompt, metadata = {}) {
        try {
            // 将图片转换为base64
            let base64Data;

            if (imageUrl.startsWith('blob:')) {
                // 对于blob URL，需要转换为base64
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                base64Data = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } else if (imageUrl.startsWith('data:')) {
                // 已经是base64
                base64Data = imageUrl;
            } else {
                // 对于HTTP URL，通过GM_xmlhttpRequest获取
                const response = await makeRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob'
                });

                const reader = new FileReader();
                base64Data = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(response.response);
                });
            }

            const images = await GM_getValue(STORAGE_KEY_IMAGES, {});
            images[generationId] = {
                url: base64Data, // 保存base64数据
                prompt: prompt,
                timestamp: Date.now(),
                mode: currentMode,
                metadata: metadata
            };
            await GM_setValue(STORAGE_KEY_IMAGES, images);
        } catch (error) {
            console.error('保存图片到缓存失败:', error);
            // 降级处理：至少保存URL
            const images = await GM_getValue(STORAGE_KEY_IMAGES, {});
            images[generationId] = {
                url: imageUrl,
                prompt: prompt,
                timestamp: Date.now(),
                mode: currentMode,
                metadata: metadata
            };
            await GM_setValue(STORAGE_KEY_IMAGES, images);
        }
    }

    /**
 * 加载图片缓存
 */
    async function loadImageCache() {
        const cacheGrid = document.getElementById('cache-grid');
        const cacheStats = document.getElementById('cache-stats');
        const images = await GM_getValue(STORAGE_KEY_IMAGES, {});

        const imageCount = Object.keys(images).length;
        cacheStats.textContent = `共 ${imageCount} 张缓存图片`;

        if (imageCount === 0) {
            cacheGrid.innerHTML = '<div class="cache-empty">暂无缓存图片</div>';
            return;
        }

        cacheGrid.innerHTML = '';

        // 按时间戳倒序排列
        const sortedEntries = Object.entries(images).sort((a, b) =>
                                                          (b[1].timestamp || 0) - (a[1].timestamp || 0)
                                                         );

        sortedEntries.forEach(([id, data]) => {
            const cacheItem = document.createElement('div');
            cacheItem.className = 'cache-item';

            const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : '未知时间';
            const prompt = (typeof data === 'string') ? '历史图片' : (data.prompt || '无提示词');
            const imageUrl = (typeof data === 'string') ? data : data.url;
            const mode = data.mode || '未知模式';

            cacheItem.innerHTML = `
            <img class="cache-item-image" src="${imageUrl}" alt="缓存图片" data-full-url="${imageUrl}">
            <div class="cache-item-info">
                <div class="cache-item-prompt" title="${escapeHTML(prompt)}">${escapeHTML(prompt)}</div>
                <div class="cache-item-meta">${mode} • ${timestamp}</div>
                <div class="cache-item-actions">
                    <button class="comfy-button cache-view-btn" data-url="${imageUrl}">查看</button>
                    <button class="comfy-button cache-download-btn" data-url="${imageUrl}" data-prompt="${escapeHTML(prompt)}">下载</button>
                    <button class="comfy-button error cache-delete-btn" data-id="${id}">删除</button>
                </div>
            </div>
        `;

        cacheGrid.appendChild(cacheItem);
    });

      // 添加事件监听
      attachCacheEventListeners();
  }

    /**
 * 添加缓存事件监听器
 */
function attachCacheEventListeners() {
    // 查看大图
    document.querySelectorAll('.cache-view-btn, .cache-item-image').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const imageUrl = e.target.dataset.url || e.target.dataset.fullUrl;
            showImageModal(imageUrl);
        });
    });

    // 下载图片
    document.querySelectorAll('.cache-download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const imageUrl = e.target.dataset.url;
            const prompt = e.target.dataset.prompt || 'ai_generated';
            await downloadImage(imageUrl, prompt);
        });
    });

    // 删除图片
    document.querySelectorAll('.cache-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const imageId = e.target.dataset.id;
            if (confirm('确定要删除这张图片吗？')) {
                await deleteImageFromCache(imageId);
                loadImageCache(); // 重新加载
                if (typeof toastr !== 'undefined') {
                    toastr.success('图片已删除');
                }
            }
        });
    });

    // 修复：将复制链接功能移出删除按钮的循环
    document.querySelectorAll('.cache-item-actions').forEach(container => {
        if (!container.querySelector('.cache-copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'comfy-button cache-copy-btn';
            copyBtn.textContent = '复制链接';
            const downloadBtn = container.querySelector('.cache-download-btn');
            if (downloadBtn) {
                copyBtn.dataset.url = downloadBtn.dataset.url;

                copyBtn.addEventListener('click', async (e) => {
                    try {
                        await navigator.clipboard.writeText(e.target.dataset.url);
                        if (typeof toastr !== 'undefined') {
                            toastr.success('链接已复制到剪贴板');
                        }
                    } catch (error) {
                        if (typeof toastr !== 'undefined') {
                            toastr.error('复制失败');
                        }
                    }
                });

                container.appendChild(copyBtn);
            }
        }
    });
}

    /**
 * 显示图片模态框
 */
    function showImageModal(imageUrl) {
        let modal = document.getElementById('cache-image-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cache-image-modal';
            modal.className = 'cache-image-modal';
            modal.innerHTML = `
            <span class="cache-modal-close">×</span>
            <img src="" alt="查看图片">
        `;
        document.body.appendChild(modal);

        modal.querySelector('.cache-modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

      modal.querySelector('img').src = imageUrl;
      modal.style.display = 'flex';
  }

    /**
   * 下载图片（优化版）
   */
    async function downloadImage(imageUrl, prompt) {
        const fileName = `${prompt.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_]/g, '_')}_${Date.now()}.png`;
        if (typeof toastr !== 'undefined') {
            toastr.info('正在准备下载图片...');
        }

        try {
            let blobUrl;
            // 如果是 base64 数据, 直接转换
            if (imageUrl.startsWith('data:')) {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                blobUrl = URL.createObjectURL(blob);
            }
            // 如果是 blob url, 直接使用
            else if (imageUrl.startsWith('blob:')) {
                blobUrl = imageUrl;
            }
            // 否则, 通过网络请求获取
            else {
                const response = await makeRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob'
                });
                const blob = new Blob([response.response], { type: 'image/png' });
                blobUrl = URL.createObjectURL(blob);
            }

            // 创建并点击下载链接
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 如果不是已存在的blob url，则释放内存
            if (!imageUrl.startsWith('blob:')) {
                setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
            }
            if (typeof toastr !== 'undefined') {
                toastr.success('下载已开始');
            }

        } catch (error) {
            console.error('下载失败:', error);
            if (typeof toastr !== 'undefined') {
                toastr.error('下载失败，请尝试右键复制图片链接手动下载。');
            }
            // 最后的备用方案：在新窗口打开图片
            window.open(imageUrl, '_blank');
        }
    }

    /**
 * 从缓存删除图片
 */
    async function deleteImageFromCache(imageId) {
        const images = await GM_getValue(STORAGE_KEY_IMAGES, {});
        delete images[imageId];
        await GM_setValue(STORAGE_KEY_IMAGES, images);
    }

    /**
 * 清空所有缓存
 */
    async function clearAllCache() {
        if (confirm('确定要清空所有缓存图片吗？此操作不可撤销。')) {
            await GM_setValue(STORAGE_KEY_IMAGES, {});
            loadImageCache();
            if (typeof toastr !== 'undefined') {
                toastr.success('所有缓存已清空');
            }
        }
    }

    // ================== 快捷键管理 ================== //

    /**
 * 初始化快捷键配置
 */
    function initShortcutsConfig() {
        const container = document.getElementById('shortcuts-config-container');
        const shortcutDescriptions = {
            togglePanel: { name: '打开/关闭面板', desc: '在任何地方切换面板显示' },
            saveWorkflow: { name: '保存工作流', desc: '保存当前工作流' },
            newWorkflow: { name: '新建工作流', desc: '创建新的工作流' },
            quickGenerate: { name: '快速生成', desc: '在聊天中触发最新的生成按钮' },
            convertPlaceholders: { name: '转换占位符', desc: '将工作流转换为占位符格式' },
            testConnection: { name: '测试连接', desc: '测试服务器连接' },
            closePanel: { name: '关闭面板', desc: '关闭面板或退出编辑模式' },
            saveEdit: { name: '保存编辑', desc: '在编辑模式下保存修改' },
            switchMode: { name: '切换模式', desc: '在ComfyUI和WebUI之间切换' }
        };

        container.innerHTML = '';

        const gridHeader = document.createElement('div');
        gridHeader.className = 'shortcut-config-grid';
        gridHeader.innerHTML = `
            <div style="font-weight: 600; color: var(--vp-accent-color);">功能</div>
            <div style="font-weight: 600; color: var(--vp-accent-color);">快捷键</div>
            <div style="font-weight: 600; color: var(--vp-accent-color);">状态</div>
        `;
      container.appendChild(gridHeader);

      Object.entries(currentShortcuts).forEach(([key, combination]) => {
          const config = shortcutDescriptions[key];
          if (!config) return;

          const configItem = document.createElement('div');
          configItem.className = 'shortcut-config-item';

          const status = getShortcutStatus(combination, key);
          const statusClass = status.available ? 'available' : (status.conflict ? 'conflict' : 'disabled');

          configItem.innerHTML = `
                <label>${config.name}</label>
                <input type="text" class="shortcut-input" data-key="${key}" value="${combination}" readonly>
                <div class="shortcut-status ${statusClass}">${status.message}</div>
                <div class="shortcut-description">${config.desc}</div>
            `;

        container.appendChild(configItem);
    });

      container.querySelectorAll('.shortcut-input').forEach(input => {
          input.addEventListener('focus', () => startRecording(input));
          input.addEventListener('blur', () => stopRecording(input));
      });

      document.getElementById('shortcuts-reset').addEventListener('click', resetShortcuts);
      document.getElementById('shortcuts-disable-all').addEventListener('click', disableAllShortcuts);
      document.getElementById('shortcuts-save').addEventListener('click', saveShortcuts);
  }

    /**
 * 开始录制快捷键
 */
    function startRecording(input) {
        input.classList.add('recording');
        input.value = '按下快捷键...';

        const recordHandler = (e) => {
            e.preventDefault();

            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                return;
            }

            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.altKey) parts.push('Alt');
            if (e.shiftKey) parts.push('Shift');

            let key = e.key;
            if (key === ' ') key = 'Space';
            if (key.length === 1) key = key.toUpperCase();

            if (key !== 'Control' && key !== 'Alt' && key !== 'Shift' && key !== 'Meta') {
                parts.push(key);
            }

            const combination = parts.join('+');

            if (parts.length > 1 || ['Escape', 'Space', 'Enter', 'Tab'].includes(key)) {
                currentShortcuts[input.dataset.key] = combination;
                input.value = combination;
                updateShortcutStatus(input, combination);
                stopRecording(input);
            }
        };

        input.recordHandler = recordHandler;
        document.addEventListener('keydown', recordHandler, true);
    }

    /**
 * 停止录制快捷键
 */
    function stopRecording(input) {
        if (input.recordHandler) {
            document.removeEventListener('keydown', input.recordHandler, true);
            delete input.recordHandler;
        }
        input.classList.remove('recording');

        if (input.value === '按下快捷键...') {
            input.value = currentShortcuts[input.dataset.key];
        }
    }

    /**
 * 更新快捷键状态显示
 */
    function updateShortcutStatus(input, combination) {
        const statusElement = input.parentElement.querySelector('.shortcut-status');
        const status = getShortcutStatus(combination, input.dataset.key);

        statusElement.className = `shortcut-status ${status.available ? 'available' : (status.conflict ? 'conflict' : 'disabled')}`;
        statusElement.textContent = status.message;
    }

    /**
 * 获取快捷键状态
 */
    function getShortcutStatus(combination, currentKey) {
        if (!combination || combination === '禁用') {
            return { available: false, conflict: false, message: '已禁用' };
        }

        const conflicts = Object.entries(currentShortcuts).filter(([key, combo]) =>
                                                                  key !== currentKey && combo === combination && combo !== '禁用'
                                                                 );

        if (conflicts.length > 0) {
            return { available: false, conflict: true, message: `与 ${conflicts[0][0]} 冲突` };
        }

        const browserShortcuts = [
            'Ctrl+T', 'Ctrl+W', 'Ctrl+N', 'Ctrl+R', 'Ctrl+F', 'Ctrl+L',
            'Ctrl+D', 'Ctrl+H', 'Ctrl+J', 'Ctrl+U', 'Ctrl+Shift+I',
            'Ctrl+Shift+J', 'Ctrl+Shift+C', 'F12', 'F5', 'Ctrl+F5'
        ];

        if (browserShortcuts.includes(combination)) {
            return { available: false, conflict: true, message: '浏览器冲突' };
        }

        return { available: true, conflict: false, message: '可用' };
    }

    /**
 * 重置快捷键
 */
    function resetShortcuts() {
        if (confirm('确定要重置所有快捷键为默认值吗？')) {
            currentShortcuts = { ...DEFAULT_SHORTCUTS };
            initShortcutsConfig();
            if (typeof toastr !== 'undefined') {
                toastr.success('快捷键已重置为默认值');
            }
        }
    }

    /**
 * 禁用所有快捷键
 */
    function disableAllShortcuts() {
        if (confirm('确定要禁用所有快捷键吗？')) {
            Object.keys(currentShortcuts).forEach(key => {
                currentShortcuts[key] = '禁用';
            });
            initShortcutsConfig();
            if (typeof toastr !== 'undefined') {
                toastr.info('所有快捷键已禁用');
            }
        }
    }

    /**
 * 保存快捷键配置
 */
    async function saveShortcuts() {
        try {
            await GM_setValue(STORAGE_KEY_SHORTCUTS, currentShortcuts);
            updateButtonTitles();
            if (typeof toastr !== 'undefined') {
                toastr.success('快捷键配置已保存');
            }
        } catch (error) {
            console.error('保存快捷键配置失败:', error);
            if (typeof toastr !== 'undefined') {
                toastr.error('保存失败');
            }
        }
    }

    /**
 * 加载快捷键配置
 */
    async function loadShortcuts() {
        try {
            const savedShortcuts = await GM_getValue(STORAGE_KEY_SHORTCUTS, DEFAULT_SHORTCUTS);
            currentShortcuts = { ...DEFAULT_SHORTCUTS, ...savedShortcuts };
        } catch (error) {
            console.error('加载快捷键配置失败:', error);
            currentShortcuts = { ...DEFAULT_SHORTCUTS };
        }
    }

    /**
 * 更新按钮标题以显示快捷键
 */
    function updateButtonTitles() {
        const titleMappings = {
            'comfyui-test-conn': 'testConnection',
            'webui-test-conn': 'testConnection',
            'workflow-save-current': 'saveWorkflow',
            'workflow-create-new': 'newWorkflow',
            'workflow-to-placeholders': 'convertPlaceholders'
        };

        Object.entries(titleMappings).forEach(([elementId, shortcutKey]) => {
            const element = document.getElementById(elementId);
            if (element && currentShortcuts[shortcutKey] !== '禁用') {
                const originalTitle = element.title || element.textContent;
                const shortcut = currentShortcuts[shortcutKey];
                element.title = `${originalTitle} (${shortcut})`;
            }
        });
    }

    /**
 * 检查快捷键是否匹配
 */
    function matchesShortcut(event, shortcutKey) {
        const combination = currentShortcuts[shortcutKey];
        if (!combination || combination === '禁用') return false;

        const parts = combination.split('+');
        const expectedModifiers = {
            Ctrl: parts.includes('Ctrl'),
            Alt: parts.includes('Alt'),
            Shift: parts.includes('Shift')
        };

        const expectedKey = parts[parts.length - 1];

        return event.ctrlKey === expectedModifiers.Ctrl &&
            event.altKey === expectedModifiers.Alt &&
            event.shiftKey === expectedModifiers.Shift &&
            (event.key === expectedKey || event.code === `Key${expectedKey}` ||
             (expectedKey === 'Space' && event.key === ' ') ||
             (expectedKey === 'Escape' && event.key === 'Escape'));
    }

    /**
 * 初始化键盘快捷键
 */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (matchesShortcut(e, 'togglePanel')) {
                e.preventDefault();
                const panel = document.getElementById(PANEL_ID);
                if (panel.style.display === 'none' || !panel.style.display) {
                    panel.style.display = 'flex';
                } else {
                    panel.style.display = 'none';
                }
                return;
            }

            if (matchesShortcut(e, 'switchMode')) {
                e.preventDefault();
                const newMode = currentMode === MODES.COMFYUI ? MODES.WEBUI : MODES.COMFYUI;
                switchMode(newMode);
                return;
            }

            if (matchesShortcut(e, 'quickGenerate')) {
                e.preventDefault();
                triggerQuickGenerate();
                return;
            }

            const panel = document.getElementById(PANEL_ID);
            if (panel.style.display === 'none' || !panel.style.display) {
                return;
            }

            if (matchesShortcut(e, 'closePanel')) {
                e.preventDefault();
                if (isEditMode) {
                    cancelEditMode();
                } else {
                    panel.style.display = 'none';
                }
            } else if (matchesShortcut(e, 'saveWorkflow')) {
                e.preventDefault();
                if (isEditMode) {
                    saveEditedWorkflow();
                } else if (currentMode === MODES.COMFYUI) {
                    document.getElementById('workflow-save-current')?.click();
                }
            } else if (matchesShortcut(e, 'newWorkflow')) {
                e.preventDefault();
                if (currentMode === MODES.COMFYUI) {
                    document.getElementById('workflow-create-new')?.click();
                }
            } else if (matchesShortcut(e, 'convertPlaceholders')) {
                e.preventDefault();
                if (currentMode === MODES.COMFYUI) {
                    document.getElementById('workflow-to-placeholders')?.click();
                }
            } else if (matchesShortcut(e, 'testConnection')) {
                e.preventDefault();
                const testButton = currentMode === MODES.COMFYUI ?
                      document.getElementById('comfyui-test-conn') :
                document.getElementById('webui-test-conn');
                testButton?.click();
            } else if (matchesShortcut(e, 'saveEdit')) {
                e.preventDefault();
                if (isEditMode) {
                    saveEditedWorkflow();
                }
            }
        });
    }

    /**
 * 快速生成功能
 */
    async function triggerQuickGenerate() {
        const lastMessage = document.querySelector('.mes.last_mes');
        if (!lastMessage) return;

        const generateButton = lastMessage.querySelector('.comfy-chat-generate-button');
        if (generateButton && generateButton.textContent === '开始生成') {
            generateButton.click();

            if (typeof toastr !== 'undefined') {
                toastr.info('快速生成已触发');
            }
        }
    }

    // ================== 图像生成核心逻辑 ================== //

    /**
 * 检查是否处于发送状态
 */
    function checkSendingStatus() {
        const sendButton = document.getElementById('send_but');
        const stopButton = document.getElementById('mes_stop');

        return (sendButton && sendButton.style.display === 'none') ||
            (stopButton && stopButton.style.display !== 'none');
    }

    /**
 * 处理消息并添加生成按钮
 * @param {HTMLElement} messageNode - 消息DOM节点
 */
    async function processMessageForComfyButton(messageNode) {
        if (messageNode.dataset.comfyProcessed === 'true') {
            return;
        }

        const mesText = messageNode.querySelector('.mes_text');
        if (!mesText) {
            messageNode.dataset.comfyProcessed = 'true';
            return;
        }

        const startTag = await GM_getValue('comfyui_start_tag', DEFAULT_SETTINGS.startTag);
        const endTag = await GM_getValue('comfyui_end_tag', DEFAULT_SETTINGS.endTag);
        if (!startTag || !endTag) return;

        const regex = new RegExp(escapeRegex(startTag) + '([\\s\\S]*?)' + escapeRegex(endTag), 'g');
        let hasTags = false;

        // 仅当包含标记且未被处理时，才进行替换
        if (mesText.innerHTML.match(regex) && !mesText.querySelector('.comfy-button-group')) {
            mesText.innerHTML = mesText.innerHTML.replace(regex, (_match, prompt) => {
                hasTags = true;
                const cleanPrompt = prompt.replace(/<[^>]*>/g, "").trim();
                const encodedPrompt = escapeHTML(cleanPrompt);

                const generationId = simpleHash(cleanPrompt);
                return `<span class="comfy-button-group" data-generation-id="${generationId}"><button class="comfy-button comfy-chat-generate-button" data-prompt="${encodedPrompt}">开始生成</button></span>`;
            });
        } else if (mesText.querySelector('.comfy-button-group')) {
            // 如果已经有按钮组了，说明可能只是需要恢复状态
            hasTags = true;
        }

        // 如果这条消息里有（或曾经有）我们的标记，就进行状态恢复
        if (hasTags) {
            const savedImages = await GM_getValue(STORAGE_KEY_IMAGES, {});
            const autoGen = await GM_getValue('comfyui_auto_generate', DEFAULT_SETTINGS.autoGenerate);

            for (const group of mesText.querySelectorAll('.comfy-button-group')) {
                if (group.dataset.listenerAttached) continue;
                group.dataset.listenerAttached = 'true';

                const id = group.dataset.generationId;
                const btn = group.querySelector('.comfy-chat-generate-button');

                if (savedImages[id]) {
                    // 缓存命中：恢复图片和按钮状态
                    await displayImage(group, savedImages[id]);
                    setupGeneratedState(btn, id);
                } else {
                    // 缓存未命中：绑定生成事件
                    btn.addEventListener('click', onGenerateButtonClick);

                    // 自动生成逻辑
                    if (autoGen && messageNode.classList.contains('last_mes') && !checkSendingStatus() && !btn.dataset.autoTriggered) {
                        btn.dataset.autoTriggered = 'true';
                        setTimeout(() => btn.click(), 500);
                    }
                }
            }
        }

        // 无论如何，最后都标记此消息节点为已处理
        messageNode.dataset.comfyProcessed = 'true';
    }

    /**
 * 生成按钮点击处理
 * @param {Event} event - 点击事件
 */
    async function onGenerateButtonClick(event) {
        const button = event.target.closest('.comfy-chat-generate-button');
        const group = button.closest('.comfy-button-group');
        const promptFromChat = button.dataset.prompt;
        const generationId = group.dataset.generationId;

        if (button.disabled || button.dataset.processing === 'true') {
            return;
        }

        button.dataset.processing = 'true';
        button.dataset.autoTriggered = 'true';

        button.textContent = '生成中...';
        button.disabled = true;
        button.className = 'comfy-button comfy-chat-generate-button testing';

        const deleteButton = group.querySelector('.comfy-delete-button');
        if (deleteButton) {
            deleteButton.style.setProperty('display', 'none');
        }

        group.nextElementSibling?.remove();

        try {
            let imageUrl;

            if (currentMode === MODES.COMFYUI) {
                imageUrl = await generateWithComfyUI(promptFromChat);
            } else {
                imageUrl = await generateWithWebUI(promptFromChat);
            }

            await displayImage(group, imageUrl);

            await saveImageToCache(generationId, imageUrl, promptFromChat, {
                width: await GM_getValue('comfyui_gen_width', DEFAULT_SETTINGS.genWidth),
                height: await GM_getValue('comfyui_gen_height', DEFAULT_SETTINGS.genHeight),
                model: currentMode === MODES.COMFYUI ?
                await GM_getValue('comfyui_model') :
                await GM_getValue('webui_model')
            });

            button.className = 'comfy-button comfy-chat-generate-button success';
            button.textContent = '成功';

            setTimeout(() => {
                setupGeneratedState(button, generationId);

                if (deleteButton) {
                    deleteButton.style.removeProperty('display');
                }
            }, 2000);

        } catch (error) {
            console.error('生成图片失败:', error);

            if (typeof toastr !== 'undefined') {
                toastr.error(error.message);
            }

            button.className = 'comfy-button comfy-chat-generate-button error';
            button.textContent = '失败';

            setTimeout(() => {
                const wasRegen = !!group.querySelector('.comfy-delete-button');

                if (wasRegen) {
                    setupGeneratedState(button, generationId);

                    if (deleteButton) {
                        deleteButton.style.removeProperty('display');
                    }
                } else {
                    button.textContent = '开始生成';
                    button.disabled = false;
                    button.className = 'comfy-button comfy-chat-generate-button';
                    delete button.dataset.processing;
                    delete button.dataset.autoTriggered;
                }
            }, 3000);
        } finally {
            delete button.dataset.processing;
        }
    }

    /**
 * 设置按钮的生成后状态
 * @param {HTMLButtonElement} btn - 按钮元素
 * @param {string} id - 生成ID
 */
    function setupGeneratedState(btn, id) {
        btn.textContent = '重新生成';
        btn.disabled = false;
        btn.className = 'comfy-button comfy-chat-generate-button';

        delete btn.dataset.autoTriggered;
        delete btn.dataset.processing;

        if (!btn.dataset.regenerateListener) {
            btn.addEventListener('click', onGenerateButtonClick);
            btn.dataset.regenerateListener = 'true';
        }

        const group = btn.closest('.comfy-button-group');
        if (!group.querySelector('.comfy-delete-button')) {
            const delBtn = document.createElement('button');
            delBtn.textContent = '删除';
            delBtn.className = 'comfy-button error comfy-delete-button';

            delBtn.addEventListener('click', async () => {
                const images = await GM_getValue(STORAGE_KEY_IMAGES, {});
                delete images[id];
                await GM_setValue(STORAGE_KEY_IMAGES, images);

                group.nextElementSibling?.remove();
                delBtn.remove();
                btn.textContent = '开始生成';

                delete btn.dataset.autoTriggered;
                delete btn.dataset.processing;
            });

            btn.insertAdjacentElement('afterend', delBtn);
        }
    }

    /**
   * 递归遍历工作流对象并替换占位符。
   * @param {object} obj - 当前遍历的JavaScript对象或数组。
   * @param {object} params - 包含所有占位符及其值的对象。
   */
    function replacePlaceholdersInWorkflow(obj, params) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // 递归进入子对象或子数组
                replacePlaceholdersInWorkflow(obj[key], params);
            } else if (typeof obj[key] === 'string') {
                // 检查并替换字符串中的占位符
                switch (obj[key]) {
                    case '%model%':
                        obj[key] = params.model;
                        break;
                    case '%unet_model%':
                        obj[key] = params.unet_model;
                        break;
                    case '%prompt%':
                        obj[key] = params.positive_prompt;
                        break;
                    case '%negative_prompt%':
                        obj[key] = params.negative_prompt;
                        break;
                    case '%sampler%':
                        obj[key] = params.sampler;
                        break;
                    case '%scheduler%':
                        obj[key] = params.scheduler;
                        break;
                    case '%width%':
                        obj[key] = params.width;
                        break;
                    case '%height%':
                        obj[key] = params.height;
                        break;
                    case '%seed%':
                        obj[key] = params.seed;
                        break;
                    case '%steps%':
                        obj[key] = params.steps;
                        break;
                    case '%cfg%':
                        obj[key] = params.cfg;
                        break;
                }
            }
        }
    }

    /**
   * 使用ComfyUI生成图片 (安全版本)
   * @param {string} promptFromChat - 聊天中的提示词
   * @returns {Promise<string>} - 图片URL
   */
    async function generateWithComfyUI(promptFromChat) {
        const url = (await GM_getValue('comfyui_url', DEFAULT_SETTINGS.url)).trim();
        let workflowString = await GM_getValue('comfyui_workflow', DEFAULT_SETTINGS.workflow);

        if (!url || !workflowString) {
            throw new Error('ComfyUI URL或工作流未配置');
        }

        const fixedPositivePrompt = await GM_getValue('comfyui_positive_prompt', DEFAULT_SETTINGS.positivePrompt);
        const fixedNegativePrompt = await GM_getValue('comfyui_negative_prompt', DEFAULT_SETTINGS.negativePrompt);
        const finalPositivePrompt = [fixedPositivePrompt, promptFromChat].filter(Boolean).join(', ');

        const params = {
            model: await GM_getValue('comfyui_model'),
            unet_model: await GM_getValue('comfyui_unet_model') || "", // 确保有默认值
            positive_prompt: finalPositivePrompt,
            negative_prompt: fixedNegativePrompt,
            seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            steps: await GM_getValue('comfyui_steps', DEFAULT_SETTINGS.steps),
            cfg: await GM_getValue('comfyui_cfg', DEFAULT_SETTINGS.cfg),
            sampler: await GM_getValue('comfyui_sampler', DEFAULT_SETTINGS.sampler),
            scheduler: await GM_getValue('comfyui_scheduler', DEFAULT_SETTINGS.scheduler),
            width: await GM_getValue('comfyui_gen_width', DEFAULT_SETTINGS.genWidth),
            height: await GM_getValue('comfyui_gen_height', DEFAULT_SETTINGS.genHeight),
        };

        if (!params.model) {
            throw new Error('ComfyUI Checkpoint模型未选择');
        }

        let workflow;
        try {
            workflow = JSON.parse(workflowString);
        } catch (e) {
            throw new Error(`工作流JSON格式错误，无法解析: ${e.message}`);
        }

        // 使用新的辅助函数安全地替换占位符
        replacePlaceholdersInWorkflow(workflow, params);

        const selectedLoras = getCurrentComfyUISelectedLoras();
        if (selectedLoras.length > 0) {
            injectLoraNodes(workflow, selectedLoras);
        }

        const promptResponse = await makeRequest({
            method: 'POST',
            url: `${url}/prompt`,
            headers: { 'Content-Type': 'application/json' },
            // 发送修正后的对象
            data: JSON.stringify({ prompt: workflow }),
            timeout: 3600000
        });

        const promptResponseData = JSON.parse(promptResponse.responseText);
        const promptId = promptResponseData.prompt_id;

        if (!promptId) {
            throw new Error('ComfyUI未返回Prompt ID');
        }

        const finalHistory = await pollForResult(url, promptId);
        const imageUrl = findImageUrlInHistory(finalHistory, promptId, url);

        if (!imageUrl) {
            throw new Error('未在ComfyUI结果中找到图片');
        }

        return imageUrl;
    }

    /**
 * 使用WebUI生成图片
 * @param {string} promptFromChat - 聊天中的提示词
 * @returns {Promise<string>} - 图片URL
 */
    async function generateWithWebUI(promptFromChat) {
        const url = (await GM_getValue('webui_url', DEFAULT_SETTINGS.webuiUrl)).trim();

        if (!url) {
            throw new Error('WebUI URL未配置');
        }

        const selectedModel = await GM_getValue('webui_model');
        if (!selectedModel) {
            throw new Error('WebUI模型未选择');
        }

        try {
            const currentOptionsResponse = await makeRequest({
                method: 'GET',
                url: `${url}/sdapi/v1/options`,
                timeout: 3600000
            });

            const currentOptions = JSON.parse(currentOptionsResponse.responseText);

            if (currentOptions.sd_model_checkpoint !== selectedModel) {
                if (typeof toastr !== 'undefined') {
                    toastr.info(`正在切换到模型: ${selectedModel}`);
                }

                await makeRequest({
                    method: 'POST',
                    url: `${url}/sdapi/v1/options`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        sd_model_checkpoint: selectedModel
                    }),
                    timeout: 3600000
                });

                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.warn('模型切换失败，使用当前模型:', error);
        }

        const fixedPositivePrompt = await GM_getValue('comfyui_positive_prompt', DEFAULT_SETTINGS.positivePrompt);
        const fixedNegativePrompt = await GM_getValue('comfyui_negative_prompt', DEFAULT_SETTINGS.negativePrompt);

        const positiveEmbeddingString = generateEmbeddingPromptString('positive');
        const negativeEmbeddingString = generateEmbeddingPromptString('negative');
        const finalPositivePrompt = [fixedPositivePrompt, positiveEmbeddingString, promptFromChat].filter(Boolean).join(', ');
        const finalNegativePrompt = [fixedNegativePrompt, negativeEmbeddingString].filter(Boolean).join(', ');

        const params = {
            prompt: finalPositivePrompt,
            negative_prompt: finalNegativePrompt,
            steps: await GM_getValue('webui_steps', DEFAULT_SETTINGS.steps),
            cfg_scale: await GM_getValue('webui_cfg', DEFAULT_SETTINGS.cfg),
            width: await GM_getValue('comfyui_gen_width', DEFAULT_SETTINGS.genWidth),
            height: await GM_getValue('comfyui_gen_height', DEFAULT_SETTINGS.genHeight),
            sampler_name: await GM_getValue('webui_sampler', DEFAULT_SETTINGS.webuiSampler),
            scheduler: await GM_getValue('webui_scheduler', DEFAULT_SETTINGS.webuiScheduler),
            seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            restore_faces: false,
            tiling: false,
            n_iter: 1,
            batch_size: 1,
            enable_hr: await GM_getValue('webui_enable_hires', DEFAULT_SETTINGS.enableHires),
            hr_upscaler: await GM_getValue('webui_hires_upscaler', DEFAULT_SETTINGS.hiresUpscaler),
            hr_second_pass_steps: await GM_getValue('webui_hires_steps', DEFAULT_SETTINGS.hiresSteps),
            hr_scale: await GM_getValue('webui_hires_upscale', DEFAULT_SETTINGS.hiresUpscale),
            denoising_strength: await GM_getValue('webui_denoising', DEFAULT_SETTINGS.denoisingStrength)
        };

        if (!params.enable_hr) {
            delete params.hr_upscaler;
            delete params.hr_second_pass_steps;
            delete params.hr_scale;
            delete params.denoising_strength;
        } else {
            params.denoising_strength = await GM_getValue('webui_hires_denoising', DEFAULT_SETTINGS.hiresDenoising);
        }

        if (typeof toastr !== 'undefined') {
            toastr.info('WebUI正在生成图片...');
        }

        const response = await makeRequest({
            method: 'POST',
            url: `${url}/sdapi/v1/txt2img`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(params),
            timeout: 3600000
        });

        const responseData = JSON.parse(response.responseText);

        if (!responseData.images || responseData.images.length === 0) {
            throw new Error('WebUI未返回图片');
        }

        const base64Image = responseData.images[0];
        const binaryString = atob(base64Image);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        return imageUrl;
    }

    /**
 * 轮询生成结果
 * @param {string} url - ComfyUI服务器URL
 * @param {string} promptId - 提示ID
 * @returns {Promise<Object>} - 返回历史记录
 */
    function pollForResult(url, promptId) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const poller = setInterval(async () => {
                if (Date.now() - startTime > POLLING_TIMEOUT_MS) {
                    clearInterval(poller);
                    reject(new Error('轮询超时'));
                    return;
                }

                try {
                    const response = await makeRequest({
                        method: 'GET',
                        url: `${url}/history/${promptId}`
          });

                    const history = JSON.parse(response.responseText);

                    if (history[promptId]) {
                        clearInterval(poller);
                        resolve(history);
                    }
                } catch (error) {
                    clearInterval(poller);
                    reject(error);
                }
            }, POLLING_INTERVAL_MS);
        });
    }

    /**
 * 在历史记录中查找图片URL
 * @param {Object} history - 历史记录对象
 * @param {string} promptId - 提示ID
 * @param {string} baseUrl - 基础URL
 * @returns {string|null} - 图片URL或null
 */
    function findImageUrlInHistory(history, promptId, baseUrl) {
        const outputs = history[promptId]?.outputs;

        if (!outputs) return null;

        for (const nodeId in outputs) {
            if (outputs[nodeId].images) {
                const image = outputs[nodeId].images[0];

                if (image) {
                    return `${baseUrl}/view?${new URLSearchParams({
                        filename: image.filename,
                        subfolder: image.subfolder,
                        type: image.type
                    })}`;
                }
            }
        }

        return null;
    }

    /**
 * 显示图片
 * @param {HTMLElement} anchorElement - 锚点元素
 * @param {string} imageUrl - 图片URL
 */
    async function displayImage(anchorElement, imageUrl) {
        let container = anchorElement.nextElementSibling;

        if (!container || !container.classList.contains('comfy-image-container')) {
            container = document.createElement('div');
            container.className = 'comfy-image-container';

            const img = document.createElement('img');
            img.alt = 'Generated by AI';
            container.appendChild(img);

            anchorElement.insertAdjacentElement('afterend', container);
        }

        const img = container.querySelector('img');

        // 处理保存的图片数据
        if (typeof imageUrl === 'object' && imageUrl.url) {
            img.src = imageUrl.url;
        } else {
            img.src = imageUrl;
        }

        const displayWidth = await GM_getValue('comfyui_display_width', DEFAULT_SETTINGS.displayWidth);
        const displayHeight = await GM_getValue('comfyui_display_height', DEFAULT_SETTINGS.displayHeight);

        img.style.maxWidth = displayWidth > 0 ? `${displayWidth}px` : '100%';
        img.style.maxHeight = displayHeight > 0 ? `${displayHeight}px` : '';
        img.style.width = displayWidth > 0 ? 'auto' : '';
        img.style.height = 'auto';
    }

    // ================== 主入口 ================== //

    /**
 * 添加主菜单按钮
 * @param {number} retries - 重试次数
 */
    function addMainButton(retries = 5) {
        if (document.getElementById(BUTTON_ID) || retries <= 0) return;

        const menuContent = document.querySelector('#options .options-content');
        if (menuContent) {
            const btn = document.createElement('a');
            btn.id = BUTTON_ID;
            btn.className = 'interactable';
            btn.innerHTML = `<i class="fa-lg fa-solid fa-atom"></i><span>AI图像生成器</span>`;
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(PANEL_ID).style.display = 'flex';
                document.getElementById('options').style.display = 'none';
            });

            menuContent.appendChild(btn);
        } else {
            setTimeout(() => addMainButton(retries - 1), 100);
        }
    }

    /**
 * 初始化脚本
 */
    function initialize() {
        createComfyUIPanel();

        const mainChat = document.querySelector('#chat');
        if (!mainChat) {
            console.error("[AI生成器] 无法找到 #chat 元素，脚本无法启动。");
            return;
        }

        const robustInitialScan = () => {
            console.log("[AI生成器] 启动健壮的初始扫描...");
            let lastProcessedCount = -1;
            let stableCount = 0;
            const maxChecks = 20; // 最多检查20次（10秒）
            let checks = 0;

            const scanInterval = setInterval(() => {
                const allMessages = mainChat.querySelectorAll('.mes:not([data-comfy-processed="true"])');

                if (allMessages.length > 0) {
                    // 如果找到未处理的消息，就处理它们
                    allMessages.forEach(processMessageForComfyButton);
                    // 重置稳定计数器，因为页面仍在变化
                    stableCount = 0;
                } else {
                    // 如果没有找到未处理的消息，增加稳定计数
                    stableCount++;
                }

                const currentTotal = mainChat.querySelectorAll('.mes').length;
                if (lastProcessedCount === currentTotal && stableCount >= 3) {
                    // 如果消息总数连续3次检查（1.5秒）没有变化，且没有发现未处理消息，我们认为加载稳定了
                    console.log("[AI生成器] 初始扫描完成，页面已稳定。");
                    clearInterval(scanInterval);
                } else {
                    lastProcessedCount = currentTotal;
                }

                checks++;
                if (checks >= maxChecks) {
                    // 达到最大检查次数，强制停止，防止无限循环
                    console.warn("[AI生成器] 初始扫描达到最大检查次数，停止扫描。");
                    clearInterval(scanInterval);
                }
            }, 500); // 每半秒检查一次
        };

        // 启动初始扫描
        robustInitialScan();

        // MutationObserver 逻辑保持，用于处理后续的新消息
        const chatObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('.mes')) {
                            processMessageForComfyButton(node);
                        }
                        node.querySelectorAll('.mes').forEach(processMessageForComfyButton);
                    }
                });
            }

            const lastMessage = mainChat.querySelector('.mes:last-child');
            if (lastMessage && lastMessage.dataset.comfyProcessed === 'true') {
                delete lastMessage.dataset.comfyProcessed;
                processMessageForComfyButton(lastMessage);
            }
        });

        chatObserver.observe(mainChat, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        const optionsObserver = new MutationObserver(() => {
            const menu = document.getElementById('options');
            if (menu && menu.style.display !== 'none') {
                addMainButton();
            }
        });

        const body = document.querySelector('body');
        if (body) {
            optionsObserver.observe(body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['style']
            });
        }

        console.log("[AI生成器] 脚本已成功初始化，支持ComfyUI和WebUI双引擎");
        setTimeout(() => {
            if (typeof toastr !== 'undefined') {
                toastr.info('AI图像生成器已启动');
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    window.AI_Generator = {
        switchMode,
        currentMode: () => currentMode,
        generateWithComfyUI,
        generateWithWebUI,
        updateModeUI,
        MODES
    };

})();