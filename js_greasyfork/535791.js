// ==UserScript==
// @name         Nai提示词管理
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  储存NAI绘画的tag组合，支持自定义分类、搜索和复制，抽屉式界面，黑暗/明亮模式，数据导入导出
// @author       salty
// @license      MIT
// @match       https://novelai.net/image*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/535791/Nai%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/535791/Nai%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/* 全局变量 */
let db;
const DB_NAME = 'AITagsDatabase';
const STORE_NAME = 'tagCollections';
const CATEGORY_STORE = 'tagCategories';
const DB_VERSION = 3; // 升级版本以支持新的存储对象

// 提示词编辑器状态
const EDITOR_STATE_KEY = 'ai_tag_editor_state_v1';
const promptEditorState = {
    main: [],       // 主提示词列表 [{id, name, tags, category}, ...]
    negative: [],   // 负面提示词列表 [{id, name, tags, category}, ...]
    characters: [   // 6个角色栏位
        null, null, null, null, null, null
    ],
    currentCharSlot: -1  // 当前选择的角色栏位索引
};

// 保存编辑器状态
function saveEditorState() {
    try {
        GM_setValue(EDITOR_STATE_KEY, JSON.stringify(promptEditorState));
    } catch (e) {
        console.error('Failed to save editor state:', e);
    }
}

// 加载编辑器状态
function loadEditorState() {
    try {
        const savedState = GM_getValue(EDITOR_STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // 简单的合并/校验逻辑
            promptEditorState.main = Array.isArray(parsed.main) ? parsed.main : [];
            promptEditorState.negative = Array.isArray(parsed.negative) ? parsed.negative : [];
            promptEditorState.characters = Array.isArray(parsed.characters) && parsed.characters.length === 6
                ? parsed.characters
                : [null, null, null, null, null, null];
            promptEditorState.currentCharSlot = typeof parsed.currentCharSlot === 'number' ? parsed.currentCharSlot : -1;
        }
    } catch (e) {
        console.error('Failed to load editor state:', e);
    }
}

// Material Design 3 - 明亮模式主题颜色（白/淡橙色）
const LIGHT_THEME = {
    // Primary - 淡橙色系
    primary: '#E65100',           // 深橙
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFE0B2',  // 浅橙容器
    onPrimaryContainer: '#E65100',
    secondary: '#FB8C00',         // 次要橙色

    // Surface - 白色系
    surface: '#FFFBFF',
    surfaceContainer: '#FFF3E0',
    surfaceContainerHigh: '#FFE0B2',
    background: '#FFFBFF',

    // 文字颜色
    text: '#1C1B1F',              // onSurface
    textSecondary: '#49454F',     // onSurfaceVariant
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',

    // 边框与轮廓
    border: '#CAC4D0',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',

    // 功能色
    success: '#2E7D32',
    danger: '#C62828',
    info: '#1565C0',
    warning: '#F57C00',
};

// Material Design 3 - 黑暗模式主题颜色（白/淡橙色）
const DARK_THEME = {
    // Primary - 亮橙色系
    primary: '#FFB74D',           // 亮橙
    onPrimary: '#4E2600',
    primaryContainer: '#6D3A00',
    onPrimaryContainer: '#FFE0B2',
    secondary: '#FFCC80',         // 次要橙色

    // Surface - 深色系
    surface: '#1C1B1F',
    surfaceContainer: '#2B2930',
    surfaceContainerHigh: '#36343B',
    background: '#1C1B1F',

    // 文字颜色
    text: '#E6E1E5',              // onSurface
    textSecondary: '#CAC4D0',     // onSurfaceVariant
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',

    // 边框与轮廓
    border: '#49454F',
    outline: '#938F99',
    outlineVariant: '#49454F',

    // 功能色
    success: '#81C784',
    danger: '#EF5350',
    info: '#64B5F6',
    warning: '#FFB74D',
};

// 默认分类
const DEFAULT_CATEGORIES = [
    { id: 'character', name: '角色', color: '#8b5cf6', order: 1 },
    { id: 'scene', name: '场景', color: '#0ea5e9', order: 2 },
    { id: 'action', name: '动作', color: '#f43f5e', order: 3 },
    { id: 'singletag', name: '单tag', color: '#10b981', order: 4 },
    { id: 'artist', name: '画师', color: '#f59e0b', order: 5 }
];

/* 主函数 */
(function() {
    'use strict';

    console.log("======== AI绘画Tag管理器开始加载 ========");

    // 获取用户偏好
    const isDarkMode = GM_getValue('ai_tag_manager_darkmode', false);
    const userTheme = GM_getValue('ai_tag_manager_theme', isDarkMode ? DARK_THEME : LIGHT_THEME);

    // 合并主题和用户自定义颜色
    const theme = isDarkMode ?
        {...DARK_THEME, ...userTheme} :
        {...LIGHT_THEME, ...userTheme};

    /* 1. 添加CSS样式 */
    function addStyles(theme) {
        GM_addStyle(`
            /* Material Design 3 CSS 变量 */
            :root {
                /* Primary */
                --md3-primary: ${theme.primary};
                --md3-on-primary: ${theme.onPrimary || '#FFFFFF'};
                --md3-primary-container: ${theme.primaryContainer || adjustColor(theme.primary, 80)};
                --md3-on-primary-container: ${theme.onPrimaryContainer || theme.primary};

                /* Secondary */
                --md3-secondary: ${theme.secondary};
                --md3-secondary-hover: ${adjustColor(theme.secondary, -20)};

                /* Surface */
                --md3-surface: ${theme.surface};
                --md3-surface-container: ${theme.surfaceContainer || theme.background};
                --md3-surface-container-high: ${theme.surfaceContainerHigh || adjustColor(theme.surface, -10)};
                --md3-background: ${theme.background};

                /* Text / On-Surface */
                --md3-on-surface: ${theme.onSurface || theme.text};
                --md3-on-surface-variant: ${theme.onSurfaceVariant || theme.textSecondary};

                /* Outline */
                --md3-outline: ${theme.outline || theme.border};
                --md3-outline-variant: ${theme.outlineVariant || adjustColor(theme.border, 20)};

                /* Functional Colors */
                --md3-success: ${theme.success};
                --md3-danger: ${theme.danger};
                --md3-info: ${theme.info};
                --md3-warning: ${theme.warning};

                /* State Layers */
                --md3-state-hover: 0.08;
                --md3-state-pressed: 0.12;
                --md3-state-focus: 0.12;

                /* Elevation Shadows (MD3 style) */
                --md3-elevation-1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
                --md3-elevation-2: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
                --md3-elevation-3: 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3);

                /* Legacy compatibility */
                --primary-color: ${theme.primary};
                --primary-hover: ${adjustColor(theme.primary, -20)};
                --secondary-color: ${theme.secondary};
                --secondary-hover: ${adjustColor(theme.secondary, -20)};
                --danger-color: ${theme.danger};
                --danger-hover: ${adjustColor(theme.danger, -20)};
                --success-color: ${theme.success};
                --success-hover: ${adjustColor(theme.success, -20)};
                --info-color: ${theme.info};
                --info-hover: ${adjustColor(theme.info, -20)};
                --warning-color: ${theme.warning};
                --warning-hover: ${adjustColor(theme.warning, -20)};
                --background-color: ${theme.background};
                --surface-color: ${theme.surface};
                --text-color: ${theme.text};
                --text-secondary: ${theme.textSecondary};
                --border-color: ${theme.border};
            }

            /* 动画定义 */
            @keyframes ai-tag-spin {
                to { transform: rotate(360deg); }
            }

            @keyframes ai-tag-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes ai-tag-slide-in {
                from { transform: translateX(20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes ai-tag-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            /* 抽屉手柄容器 - MD3 风格 */
            #ai-tag-manager-handle {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                width: 48px;
                display: flex;
                flex-direction: column;
                gap: 0;
                z-index: 9998;
                touch-action: none;
                user-select: none;
            }

            /* 手柄上部 - 打开抽屉 */
            .ai-tag-handle-drawer {
                width: 48px;
                height: 56px;
                background: var(--md3-primary);
                border-radius: 16px 0 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: var(--md3-elevation-2);
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                position: relative;
            }

            .ai-tag-handle-drawer::before {
                content: "≡";
                color: var(--md3-on-primary);
                font-size: 22px;
                font-weight: bold;
            }

            .ai-tag-handle-drawer:hover {
                background: color-mix(in srgb, var(--md3-primary) 92%, black);
            }

            .ai-tag-handle-drawer:active {
                background: color-mix(in srgb, var(--md3-primary) 88%, black);
            }

            /* 手柄下部 - 打开编辑器 */
            .ai-tag-handle-editor {
                width: 48px;
                height: 48px;
                background: var(--md3-primary-container);
                border-radius: 0 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: var(--md3-elevation-1);
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                border-top: 1px solid rgba(255,255,255,0.2);
            }

            .ai-tag-handle-editor::before {
                content: "✨";
                font-size: 18px;
            }

            .ai-tag-handle-editor:hover {
                background: color-mix(in srgb, var(--md3-primary-container) 92%, black);
            }

            .ai-tag-handle-editor:active {
                background: color-mix(in srgb, var(--md3-primary-container) 88%, black);
            }

            /* 拖拽手柄 */
            .ai-tag-handle-drag {
                width: 48px;
                height: 20px;
                background: var(--md3-outline-variant);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                transition: all 0.2s ease;
            }

            .ai-tag-handle-drag::before {
                content: "⋮⋮";
                color: var(--md3-on-surface-variant);
                font-size: 12px;
                letter-spacing: 2px;
            }

            .ai-tag-handle-drag:hover {
                background: var(--md3-outline);
            }

            .ai-tag-handle-drag.dragging {
                cursor: grabbing;
                background: var(--md3-primary);
            }

            .ai-tag-handle-drag.dragging::before {
                color: var(--md3-on-primary);
            }

            /* 拖拽位置指示器 */
            .ai-tag-drag-indicator {
                position: fixed;
                right: 0;
                width: 48px;
                height: 4px;
                background: var(--md3-primary);
                border-radius: 2px 0 0 2px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease;
                z-index: 9997;
            }

            .ai-tag-drag-indicator.visible {
                opacity: 1;
            }

            /* 抽屉容器 */
            #ai-tag-manager-drawer {
                position: fixed;
                top: 0;
                right: -350px;
                /* width 由 JS 控制 */
                height: 100%;
                background-color: var(--surface-color);
                box-shadow: -3px 0 20px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border-radius: 16px 0 0 16px;
            }

            /* 抽屉调整宽度手柄 */
            .ai-tag-drawer-resize-handle {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 10px;
                cursor: ew-resize;
                z-index: 10000;
                background: transparent;
                transition: background 0.2s;
            }

            .ai-tag-drawer-resize-handle:hover,
            .ai-tag-drawer-resize-handle.resizing {
                background: rgba(0, 0, 0, 0.1);
            }

            #ai-tag-manager-drawer.open {
                right: 0;
            }

            /* 头部 - MD3 风格 */
            #ai-tag-manager-header {
                padding: 20px 24px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }

            #ai-tag-manager-title {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                letter-spacing: 0.15px;
            }

            #ai-tag-manager-close {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-manager-close:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-manager-settings {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                margin-right: 8px;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-manager-settings:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-manager-mode-toggle {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                margin-right: 8px;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-manager-mode-toggle:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-manager-editor {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                margin-right: 8px;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-manager-editor:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            /* 搜索框 */
            #ai-tag-manager-search {
                padding: 15px 20px;
                background-color: var(--background-color);
                border-bottom: 1px solid var(--border-color);
            }

            #ai-tag-search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid var(--border-color);
                border-radius: 25px;
                font-size: 14px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                background-color: var(--surface-color);
                color: var(--text-color);
            }

            #ai-tag-search-input:focus {
                outline: none;
                border-color: var(--md3-primary);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            }

            /* 标签页 */
            #ai-tag-manager-tabs {
                display: flex;
                flex-wrap: wrap;
                background-color: var(--background-color);
                border-bottom: 1px solid var(--border-color);
                padding: 0 5px;
                overflow-x: auto;
                scrollbar-width: thin;
                max-height: 120px;
            }

            #ai-tag-manager-tabs::-webkit-scrollbar {
                height: 4px;
                width: 4px;
            }

            #ai-tag-manager-tabs::-webkit-scrollbar-thumb {
                background-color: var(--border-color);
                border-radius: 2px;
            }

            .ai-tag-tab {
                flex: none;
                padding: 10px 12px;
                text-align: center;
                cursor: pointer;
                font-size: 14px;
                color: var(--text-secondary);
                border-bottom: 2px solid transparent;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                margin: 0 2px;
                white-space: nowrap;
            }

            .ai-tag-tab.active {
                color: var(--md3-primary);
                font-weight: 600;
            }

            .ai-tag-tab.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40%;
                height: 3px;
                background-color: var(--md3-primary);
                border-radius: 3px 3px 0 0;
                transition: all 0.3s ease;
            }

            .ai-tag-tab:hover::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 20%;
                height: 2px;
                background-color: var(--md3-primary);
                border-radius: 3px 3px 0 0;
            }

            /* 内容区域 */
            #ai-tag-manager-content {
                flex: 1;
                overflow-y: auto;
                padding: 0;
                background-color: var(--surface-color);
            }

            /* 添加按钮 - MD3 FAB */
            #ai-tag-add-button {
                position: absolute;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border-radius: 16px;
                background: var(--md3-primary-container);
                color: var(--md3-on-primary-container);
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: var(--md3-elevation-3);
                z-index: 10000;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-add-button:hover {
                box-shadow: var(--md3-elevation-3);
                background: color-mix(in srgb, var(--md3-primary-container) 92%, black);
            }

            #ai-tag-add-button:active {
                transform: scale(0.95);
            }

            /* 标签项 */
            .ai-tag-collection-item {
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: ai-tag-slide-in 0.3s ease;
                background-color: var(--surface-color);
            }

            .ai-tag-collection-item:hover {
                background-color: var(--background-color);
                transform: translateX(-5px);
            }

            .ai-tag-collection-name {
                font-weight: 500;
                color: var(--text-color);
                position: relative;
                padding-left: 12px;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .ai-tag-collection-name::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 70%;
                border-radius: 2px;
                transition: all 0.2s ease;
            }

            .ai-tag-collection-actions {
                display: flex;
                gap: 8px;
            }

            .ai-tag-action-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: none;
                background-color: transparent;
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 16px;
            }

            .ai-tag-action-btn:hover {
                background-color: rgba(230, 81, 0, 0.08);
                color: var(--md3-primary);
                transform: scale(1.1);
            }

            /* 详情视图 */
            #ai-tag-detail-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--md3-surface);
                z-index: 10001;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }

            #ai-tag-detail-header {
                padding: 20px 24px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }

            #ai-tag-detail-title {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                letter-spacing: 0.15px;
            }

            #ai-tag-detail-back {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-detail-back:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-detail-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .ai-tag-detail-form-group {
                margin-bottom: 20px;
            }

            .ai-tag-detail-form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--text-color);
                font-size: 15px;
            }

            .ai-tag-detail-form-group input,
            .ai-tag-detail-form-group textarea,
            .ai-tag-detail-form-group select {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 15px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                background-color: var(--surface-color);
                color: var(--text-color);
            }

            .ai-tag-detail-form-group input:focus,
            .ai-tag-detail-form-group textarea:focus,
            .ai-tag-detail-form-group select:focus {
                outline: none;
                border-color: var(--md3-primary);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            }

            .ai-tag-detail-form-group textarea {
                height: 150px;
                resize: vertical;
                line-height: 1.5;
            }

            .ai-tag-detail-actions {
                display: flex;
                gap: 12px;
                margin-top: 25px;
            }

            /* MD3 按钮样式 */
            .ai-tag-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 100px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .ai-tag-btn-primary {
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                box-shadow: var(--md3-elevation-1);
            }

            .ai-tag-btn-primary:hover {
                box-shadow: var(--md3-elevation-2);
                background: color-mix(in srgb, var(--md3-primary) 92%, black);
            }

            .ai-tag-btn-secondary {
                background: var(--md3-primary-container);
                color: var(--md3-on-primary-container);
            }

            .ai-tag-btn-secondary:hover {
                background: color-mix(in srgb, var(--md3-primary-container) 92%, black);
            }

            .ai-tag-btn-danger {
                background: var(--md3-danger);
                color: white;
            }

            .ai-tag-btn-danger:hover {
                background: color-mix(in srgb, var(--md3-danger) 88%, black);
            }

            .ai-tag-btn-default {
                background: transparent;
                color: var(--md3-primary);
                border: 1px solid var(--md3-outline);
            }

            .ai-tag-btn-default:hover {
                background: rgba(230, 81, 0, 0.08);
            }

            /* 空状态 */
            .ai-tag-empty-state {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-secondary);
                animation: ai-tag-fade-in 0.3s ease;
                background-color: var(--surface-color);
            }

            .ai-tag-empty-state p {
                margin-bottom: 20px;
                font-size: 15px;
            }

            .ai-tag-empty-icon {
                font-size: 40px;
                color: var(--secondary-color);
                opacity: 0.5;
                margin-bottom: 15px;
            }

            /* 移动设备优化 */
            @media (max-width: 768px) {
                #ai-tag-manager-drawer {
                    width: 90%;
                    right: -90%;
                }

                #ai-tag-action-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                }
            }

            /* 搜索结果高亮 */
            .ai-tag-highlight {
                background-color: rgba(253, 224, 71, 0.3);
                padding: 0 2px;
                border-radius: 3px;
                color: var(--text-color);
            }

            /* 加载动画 */
            .ai-tag-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 30px;
                flex-direction: column;
                background-color: var(--surface-color);
            }

            .ai-tag-loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: var(--md3-primary);
                animation: ai-tag-spin 1s ease-in-out infinite;
            }

            .ai-tag-loading-text {
                margin-top: 15px;
                color: var(--text-secondary);
                font-size: 14px;
            }

            /* 轻提示 */
            .ai-tag-toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.75);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                z-index: 10002;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                font-size: 14px;
                animation: ai-tag-fade-in 0.2s ease;
            }

            /* 设置面板 - MD3 风格 */
            #ai-tag-settings-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--md3-surface);
                z-index: 10002;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }

            #ai-tag-settings-header {
                padding: 20px 24px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }

            #ai-tag-settings-title {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                letter-spacing: 0.15px;
            }

            #ai-tag-settings-back {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-settings-back:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-settings-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                color: var(--md3-on-surface);
            }

            .ai-tag-settings-section {
                margin-bottom: 20px;
                background-color: var(--md3-surface-container);
                border-radius: 16px;
                padding: 16px;
            }

            .ai-tag-settings-section-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--md3-on-surface);
                margin-bottom: 16px;
                letter-spacing: 0.1px;
            }

            .ai-tag-color-option {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }

            .ai-tag-color-option label {
                flex: 1;
                font-size: 14px;
                color: var(--text-color);
            }

            .ai-tag-color-picker {
                width: 30px;
                height: 30px;
                border: none;
                border-radius: 50%;
                overflow: hidden;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .ai-tag-color-picker::-webkit-color-swatch-wrapper {
                padding: 0;
            }

            .ai-tag-color-picker::-webkit-color-swatch {
                border: none;
                border-radius: 50%;
            }

            .ai-tag-save-theme-btn {
                width: 100%;
                padding: 12px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                border: none;
                border-radius: 100px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                box-shadow: var(--md3-elevation-1);
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                margin-top: 10px;
            }

            .ai-tag-save-theme-btn:hover {
                box-shadow: var(--md3-elevation-2);
                background: color-mix(in srgb, var(--md3-primary) 92%, black);
            }

            .ai-tag-reset-theme-btn {
                width: 100%;
                padding: 12px;
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
                border-radius: 25px;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }

            .ai-tag-reset-theme-btn:hover {
                background-color: var(--background-color);
                color: var(--text-color);
            }

            /* 数据导入导出部分 */
            .ai-tag-import-export {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .ai-tag-import-export .ai-tag-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .ai-tag-file-input {
                display: none;
            }

            /* 暗黑模式开关 */
            .ai-tag-toggle-switch {
                position: relative;
                display: flex;
                align-items: center;
                cursor: pointer;
                margin: 15px 0;
            }

            .ai-tag-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .ai-tag-toggle-label {
                flex: 1;
                font-size: 14px;
                color: var(--text-color);
            }

            .ai-tag-slider {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
                background-color: #ccc;
                border-radius: 34px;
                transition: .4s;
            }

            .ai-tag-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                border-radius: 50%;
                transition: .4s;
            }

            input:checked + .ai-tag-slider {
                background-color: var(--md3-primary);
            }

            input:focus + .ai-tag-slider {
                box-shadow: 0 0 1px var(--md3-primary);
            }

            input:checked + .ai-tag-slider:before {
                transform: translateX(24px);
            }

            .ai-tag-slider-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                color: white;
                z-index: 1;
            }

            .ai-tag-slider-icon.sun {
                right: 6px;
            }

            .ai-tag-slider-icon.moon {
                left: 6px;
                display: none;
            }

            input:checked ~ .ai-tag-slider-icon.sun {
                display: none;
            }

            input:checked ~ .ai-tag-slider-icon.moon {
                display: block;
            }

            /* 分类管理视图 - MD3 风格 */
            #ai-tag-categories-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--md3-surface);
                z-index: 10003;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }

            #ai-tag-categories-header {
                padding: 20px 24px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }

            #ai-tag-categories-title {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                letter-spacing: 0.15px;
            }

            #ai-tag-categories-back {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-categories-back:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-categories-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            #ai-tag-categories-list {
                margin-bottom: 20px;
            }

            .ai-tag-category-item {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                margin-bottom: 10px;
                background-color: var(--background-color);
                border-radius: 10px;
                transition: all 0.2s ease;
            }

            .ai-tag-category-color {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                margin-right: 15px;
                flex-shrink: 0;
            }

            .ai-tag-category-info {
                flex: 1;
            }

            .ai-tag-category-name {
                font-weight: 500;
                font-size: 15px;
                color: var(--text-color);
                margin: 0;
                margin-bottom: 3px;
            }

            .ai-tag-category-id {
                font-size: 12px;
                color: var(--text-secondary);
                margin: 0;
            }

            .ai-tag-category-actions {
                display: flex;
                gap: 8px;
            }

            .ai-tag-category-btn {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: none;
                background-color: transparent;
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .ai-tag-category-btn:hover {
                background-color: rgba(230, 81, 0, 0.08);
                color: var(--md3-primary);
                transform: scale(1.1);
            }

            .ai-tag-add-category-form {
                background-color: var(--background-color);
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }

            .ai-tag-add-category-form h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: var(--text-color);
                font-size: 16px;
                font-weight: 600;
            }

            .ai-tag-category-form-group {
                margin-bottom: 15px;
            }

            .ai-tag-category-form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: var(--text-color);
                font-size: 14px;
            }

            .ai-tag-category-form-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 14px;
                background-color: var(--surface-color);
                color: var(--text-color);
            }

            .ai-tag-category-form-group input:focus {
                outline: none;
                border-color: var(--md3-primary);
            }

            .ai-tag-category-form-color {
                display: flex;
                align-items: center;
            }

            .ai-tag-category-form-color label {
                flex: 1;
            }

            .ai-tag-category-form-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            .ai-tag-edit-category-form {
                display: none;
            }

            /* 提示词编辑器视图 - MD3 风格 */
            #ai-tag-prompt-editor-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--md3-surface);
                z-index: 10004;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }

            #ai-tag-prompt-editor-header {
                padding: 20px 24px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }

            #ai-tag-prompt-editor-title {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                letter-spacing: 0.15px;
            }

            #ai-tag-prompt-editor-back {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                color: var(--md3-on-primary);
                border-radius: 50%;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            #ai-tag-prompt-editor-back:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            #ai-tag-prompt-editor-content {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
            }

            .ai-tag-prompt-section {
                margin-bottom: 20px;
                background-color: var(--background-color);
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }

            .ai-tag-prompt-section-title {
                font-size: 15px;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ai-tag-prompt-section-title .icon {
                font-size: 16px;
            }

            .ai-tag-prompt-list {
                min-height: 40px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 10px;
                background-color: var(--surface-color);
                border-radius: 8px;
                border: 1px dashed var(--border-color);
            }

            .ai-tag-prompt-list.drag-over {
                border-color: var(--md3-primary);
                background-color: rgba(230, 81, 0, 0.08);
            }

            .ai-tag-prompt-list-empty {
                width: 100%;
                text-align: center;
                color: var(--text-secondary);
                font-size: 13px;
                padding: 10px;
            }

            .ai-tag-prompt-item {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                border-radius: 100px;
                font-size: 13px;
                font-weight: 500;
                cursor: grab;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                box-shadow: var(--md3-elevation-1);
            }

            .ai-tag-prompt-item:hover {
                box-shadow: var(--md3-elevation-2);
                background: color-mix(in srgb, var(--md3-primary) 92%, black);
            }

            .ai-tag-prompt-item.dragging {
                opacity: 0.5;
                cursor: grabbing;
            }

            .ai-tag-prompt-item .remove-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .ai-tag-prompt-item .remove-btn:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            /* ============ 拖拽排序 Drop Indicator ============ */
            .ai-tag-drop-indicator {
                position: absolute;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--md3-primary);
                border-radius: 2px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease, top 0.1s ease;
                z-index: 100;
            }

            .ai-tag-drop-indicator.visible {
                opacity: 1;
            }

            .ai-tag-drop-indicator::before,
            .ai-tag-drop-indicator::after {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: var(--md3-primary);
                border-radius: 50%;
            }

            .ai-tag-drop-indicator::before {
                left: -5px;
            }

            .ai-tag-drop-indicator::after {
                right: -5px;
            }

            /* 提示词列表需要相对定位来容纳 indicator */
            .ai-tag-prompt-list {
                position: relative;
            }

            /* 角色栏位 */
            .ai-tag-char-slots {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .ai-tag-char-slot {
                background-color: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 12px;
                text-align: center;
                transition: all 0.2s ease;
            }

            .ai-tag-char-slot:hover {
                border-color: var(--md3-primary);
            }

            .ai-tag-char-slot.filled {
                border-color: var(--md3-success);
                background-color: rgba(46, 125, 50, 0.1);
            }

            .ai-tag-char-slot-title {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }

            .ai-tag-char-slot-content {
                font-size: 13px;
                color: var(--text-color);
                word-break: break-all;
                max-height: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .ai-tag-char-slot-content.empty {
                color: var(--text-secondary);
                font-style: italic;
            }

            .ai-tag-char-slot-actions {
                display: flex;
                gap: 5px;
                margin-top: 8px;
                justify-content: center;
            }

            .ai-tag-char-slot-btn {
                padding: 4px 10px;
                border: none;
                border-radius: 15px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ai-tag-char-slot-btn.select-btn {
                background-color: var(--md3-primary);
                color: var(--md3-on-primary);
            }

            .ai-tag-char-slot-btn.clear-btn {
                background-color: var(--md3-danger);
                color: white;
            }

            .ai-tag-char-slot-btn:hover {
                opacity: 0.8;
                transform: scale(1.05);
            }

            /* 编辑器操作按钮 */
            .ai-tag-prompt-editor-actions {
                display: flex;
                gap: 10px;
                padding: 15px;
                background-color: var(--background-color);
                border-top: 1px solid var(--border-color);
            }

            .ai-tag-prompt-editor-actions .ai-tag-btn {
                flex: 1;
            }

            /* 角色选择弹窗 */
            .ai-tag-char-selector-overlay {
                /* 改为非模态，仅用于容器 */
                position: fixed;
                top: 0;
                left: 0;
                width: 0;
                height: 0;
                z-index: 10005;
                /* 移除背景遮罩 */
                background: transparent;
            }

            .ai-tag-char-selector-modal {
                position: fixed; /* 固定定位以支持拖拽 */
                background-color: var(--md3-surface);
                border-radius: 28px;
                width: 300px;
                max-height: 400px;
                overflow: hidden;
                box-shadow: var(--md3-elevation-3);
                /* 添加边框使其在任何背景下可见 */
                border: 1px solid var(--border-color);
            }

            .ai-tag-char-selector-header {
                padding: 16px 20px;
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                font-weight: 500;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            }

            .ai-tag-char-selector-close {
                width: 32px;
                height: 32px;
                cursor: pointer;
                font-size: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .ai-tag-char-selector-close:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            .ai-tag-char-selector-list {
                max-height: 300px;
                overflow-y: auto;
                padding: 8px 0;
            }

            .ai-tag-char-selector-item {
                padding: 14px 20px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                color: var(--md3-on-surface);
                border-radius: 0;
            }

            .ai-tag-char-selector-item:hover {
                background-color: rgba(230, 81, 0, 0.08);
            }

            .ai-tag-char-selector-item:last-child {
                border-bottom: none;
            }

            /* 添加到编辑器按钮 */
            .ai-tag-action-add {
                color: var(--success-color) !important;
            }

            .ai-tag-action-add:hover {
                background-color: rgba(16, 185, 129, 0.1) !important;
            }

            /* ============ 浮动编辑器窗口 - MD3 风格 ============ */
            #ai-tag-floating-editor {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                max-width: 90vw;
                max-height: 85vh;
                background: var(--md3-surface);
                border-radius: 28px;
                box-shadow: var(--md3-elevation-3);
                z-index: 10005;
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: ai-tag-fade-in 0.2s ease;
            }

            .ai-tag-floating-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 24px;
                background: var(--md3-surface-container);
                border-bottom: 1px solid var(--md3-outline-variant);
                cursor: move;
                user-select: none;
            }

            .ai-tag-floating-title {
                font-size: 18px;
                font-weight: 500;
                color: var(--md3-on-surface);
                margin: 0;
            }

            .ai-tag-floating-close {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: transparent;
                color: var(--md3-on-surface-variant);
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .ai-tag-floating-close:hover {
                background: rgba(0, 0, 0, 0.08);
            }

            .ai-tag-floating-content {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }

            .ai-tag-floating-actions {
                display: flex;
                gap: 12px;
                padding: 16px 24px;
                background: var(--md3-surface-container);
                border-top: 1px solid var(--md3-outline-variant);
            }

            /* MD3 风格按钮 */
            .md3-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 100px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .md3-btn-filled {
                background: var(--md3-primary);
                color: var(--md3-on-primary);
                box-shadow: var(--md3-elevation-1);
            }

            .md3-btn-filled:hover {
                box-shadow: var(--md3-elevation-2);
            }

            .md3-btn-tonal {
                background: var(--md3-primary-container);
                color: var(--md3-on-primary-container);
            }

            .md3-btn-tonal:hover {
                background: color-mix(in srgb, var(--md3-primary-container) 92%, black);
            }

            .md3-btn-outlined {
                background: transparent;
                color: var(--md3-primary);
                border: 1px solid var(--md3-outline);
            }

            .md3-btn-outlined:hover {
                background: rgba(230, 81, 0, 0.08);
            }

            .md3-btn-text {
                background: transparent;
                color: var(--md3-primary);
            }

            .md3-btn-text:hover {
                background: rgba(230, 81, 0, 0.08);
            }

            .md3-btn-danger {
                background: var(--md3-danger);
                color: white;
            }

            /* 浮动编辑器内的 Section */
            .ai-tag-floating-section {
                margin-bottom: 16px;
                background: var(--md3-surface-container);
                border-radius: 16px;
                padding: 16px;
            }

            .ai-tag-floating-section-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--md3-on-surface);
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 浮动编辑器遮罩 */
            .ai-tag-floating-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.32);
                backdrop-filter: blur(4px);
                z-index: 10004;
                display: none;
                animation: ai-tag-fade-in 0.2s ease;
            }

            /* 调整大小手柄 */
            .ai-tag-resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: se-resize;
            }

            .ai-tag-resize-handle::before {
                content: '';
                position: absolute;
                bottom: 8px;
                right: 8px;
                width: 8px;
                height: 8px;
                border-right: 2px solid var(--md3-outline);
                border-bottom: 2px solid var(--md3-outline);
            }
        `);
    }

    /* 2. 主程序入口 */
    function main() {
        console.log("开始初始化主程序");

        // 添加样式
        addStyles(theme);

        // 初始化数据库
        initDB().then(() => {
            console.log("数据库初始化成功，开始创建UI");
            // 创建UI
            createUI();
            showToast("AI绘画Tag管理器已加载");
        }).catch(error => {
            console.error("初始化失败:", error);
            alert("AI绘画Tag管理器初始化失败，请刷新页面重试");
        });
    }

    // 在文档准备好后运行
    if (document.readyState !== 'loading') {
        console.log("文档已加载，立即初始化");
        main();
    } else {
        console.log("文档加载中，等待DOMContentLoaded事件");
        document.addEventListener('DOMContentLoaded', main);
    }

    /* 3. 数据库操作 */

    // 初始化数据库
    function initDB() {
        return new Promise((resolve, reject) => {
            console.log("开始初始化数据库");
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function(event) {
                console.log("数据库升级中");
                const db = event.target.result;

                // 标签集合存储
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const tagStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    tagStore.createIndex('category', 'category', { unique: false });
                    tagStore.createIndex('name', 'name', { unique: false });
                    console.log("创建标签集合存储");
                }

                // 分类存储
                if (!db.objectStoreNames.contains(CATEGORY_STORE)) {
                    const categoryStore = db.createObjectStore(CATEGORY_STORE, { keyPath: 'id' });
                    categoryStore.createIndex('name', 'name', { unique: true });
                    categoryStore.createIndex('order', 'order', { unique: false });

                    // 添加默认分类
                    DEFAULT_CATEGORIES.forEach(category => {
                        categoryStore.add(category);
                    });

                    console.log("创建分类存储并添加默认分类");
                }

                console.log("数据库结构已更新");
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                console.log("数据库连接成功");
                resolve(db);
            };

            request.onerror = function(event) {
                console.error("数据库连接失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 获取所有分类
    function getAllCategories() {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([CATEGORY_STORE], 'readonly');
            const store = transaction.objectStore(CATEGORY_STORE);

            const request = store.getAll();

            request.onsuccess = function() {
                const categories = request.result;

                // 按顺序排序
                categories.sort((a, b) => a.order - b.order);

                console.log(`获取分类成功，共 ${categories.length} 个`);
                resolve(categories);
            };

            request.onerror = function(event) {
                console.error("获取分类失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 添加分类
    function addCategory(id, name, color, order) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([CATEGORY_STORE], 'readwrite');
            const store = transaction.objectStore(CATEGORY_STORE);

            // 检查ID是否已存在
            const getRequest = store.get(id);

            getRequest.onsuccess = function() {
                if (getRequest.result) {
                    reject(new Error("分类ID已存在"));
                    return;
                }

                // 添加新分类
                const request = store.add({
                    id: id,
                    name: name,
                    color: color,
                    order: order || 999 // 默认排在最后
                });

                request.onsuccess = function() {
                    console.log("添加分类成功:", id);
                    resolve();
                };

                request.onerror = function(event) {
                    console.error("添加分类失败:", event.target.error);
                    reject(event.target.error);
                };
            };

            getRequest.onerror = function(event) {
                console.error("检查分类ID失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 更新分类
    function updateCategory(id, name, color, order) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([CATEGORY_STORE], 'readwrite');
            const store = transaction.objectStore(CATEGORY_STORE);

            const request = store.get(id);

            request.onsuccess = function() {
                const category = request.result;

                if (!category) {
                    reject(new Error("分类不存在"));
                    return;
                }

                category.name = name;
                category.color = color;
                if (order !== undefined) {
                    category.order = order;
                }

                const updateRequest = store.put(category);

                updateRequest.onsuccess = function() {
                    console.log("更新分类成功:", id);
                    resolve();
                };

                updateRequest.onerror = function(event) {
                    console.error("更新分类失败:", event.target.error);
                    reject(event.target.error);
                };
            };

            request.onerror = function(event) {
                console.error("获取分类失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 删除分类
    function deleteCategory(id) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            // 检查是否有标签使用该分类
            checkCategoryUsage(id).then(isUsed => {
                if (isUsed) {
                    reject(new Error("该分类下有标签，无法删除"));
                    return;
                }

                const transaction = db.transaction([CATEGORY_STORE], 'readwrite');
                const store = transaction.objectStore(CATEGORY_STORE);

                const request = store.delete(id);

                request.onsuccess = function() {
                    console.log("删除分类成功:", id);
                    resolve();
                };

                request.onerror = function(event) {
                    console.error("删除分类失败:", event.target.error);
                    reject(event.target.error);
                };
            }).catch(error => {
                reject(error);
            });
        });
    }

    // 检查分类是否被使用
    function checkCategoryUsage(categoryId) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('category');

            const request = index.getAll(categoryId);

            request.onsuccess = function() {
                const tags = request.result;
                resolve(tags.length > 0);
            };

            request.onerror = function(event) {
                console.error("检查分类使用失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 添加标签集合
    function addTagCollection(name, tags, category) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.add({
                name: name,
                tags: tags,
                category: category,
                createdAt: new Date().toISOString()
            });

            request.onsuccess = function() {
                console.log("添加标签成功:", name);
                resolve(request.result);
            };

            request.onerror = function(event) {
                console.error("添加标签失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 批量添加标签集合
    function addTagCollections(collections) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            let successCount = 0;
            let errorCount = 0;

            collections.forEach(collection => {
                // 确保必要的字段存在
                if (!collection.name || !collection.tags || !collection.category) {
                    errorCount++;
                    return;
                }

                const request = store.add({
                    name: collection.name,
                    tags: collection.tags,
                    category: collection.category,
                    createdAt: collection.createdAt || new Date().toISOString()
                });

                request.onsuccess = function() {
                    successCount++;
                    if (successCount + errorCount === collections.length) {
                        resolve({ success: successCount, error: errorCount });
                    }
                };

                request.onerror = function() {
                    errorCount++;
                    if (successCount + errorCount === collections.length) {
                        resolve({ success: successCount, error: errorCount });
                    }
                };
            });

            // 如果没有集合要添加
            if (collections.length === 0) {
                resolve({ success: 0, error: 0 });
            }
        });
    }

    // 获取所有标签集合
    function getAllTagCollections() {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = function() {
                console.log(`获取标签成功，共 ${request.result.length} 个`);
                resolve(request.result);
            };

            request.onerror = function(event) {
                console.error("获取标签失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 按分类获取标签集合
    function getTagCollectionsByCategory(category) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('category');

            const request = index.getAll(category);

            request.onsuccess = function() {
                console.log(`获取 ${category} 分类标签成功，共 ${request.result.length} 个`);
                resolve(request.result);
            };

            request.onerror = function(event) {
                console.error(`获取 ${category} 分类标签失败:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 搜索标签集合
    function searchTagCollections(query) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = function() {
                const allCollections = request.result;
                const lowercaseQuery = query.toLowerCase();

                // 过滤匹配查询的集合
                const matchedCollections = allCollections.filter(collection => {
                    return collection.name.toLowerCase().includes(lowercaseQuery) ||
                           collection.tags.toLowerCase().includes(lowercaseQuery);
                });

                console.log(`搜索结果: ${matchedCollections.length} 个匹配`);
                resolve(matchedCollections);
            };

            request.onerror = function(event) {
                console.error("搜索失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 更新标签集合
    function updateTagCollection(id, name, tags, category) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(id);

            request.onsuccess = function() {
                const data = request.result;
                if (!data) {
                    console.error("标签不存在:", id);
                    reject(new Error("标签不存在"));
                    return;
                }

                data.name = name;
                data.tags = tags;
                data.category = category;
                data.updatedAt = new Date().toISOString();

                const updateRequest = store.put(data);

                updateRequest.onsuccess = function() {
                    console.log("更新标签成功:", id);
                    resolve(updateRequest.result);
                };

                updateRequest.onerror = function(event) {
                    console.error("更新标签失败:", event.target.error);
                    reject(event.target.error);
                };
            };

            request.onerror = function(event) {
                console.error("获取要更新的标签失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 删除标签集合
    function deleteTagCollection(id) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.delete(id);

            request.onsuccess = function() {
                console.log("删除标签成功:", id);
                resolve();
            };

            request.onerror = function(event) {
                console.error("删除标签失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 清空所有标签
    function clearAllTagCollections() {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error("数据库未初始化");
                reject(new Error("数据库未初始化"));
                return;
            }

            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.clear();

            request.onsuccess = function() {
                console.log("清空所有标签成功");
                resolve();
            };

            request.onerror = function(event) {
                console.error("清空标签失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    /* 4. UI创建与事件绑定 */

    // 创建UI元素并绑定事件
    function createUI() {
        console.log("开始创建UI");

        // 加载编辑器状态
        loadEditorState();

        // 获取保存的手柄位置
        const savedHandleY = GM_getValue('ai_tag_handle_position', null);

        // 创建拖动手柄容器
        const handle = document.createElement('div');
        handle.id = 'ai-tag-manager-handle';

        // 设置保存的位置
        if (savedHandleY !== null) {
            handle.style.top = savedHandleY + 'px';
            handle.style.transform = 'none';
        }

        // 新的手柄结构：抽屉按钮 + 编辑器按钮 + 拖拽手柄
        handle.innerHTML = `
            <div class="ai-tag-handle-drawer" title="打开标签管理器"></div>
            <div class="ai-tag-handle-editor" title="打开提示词编辑器"></div>
            <div class="ai-tag-handle-drag" title="拖拽调整位置"></div>
        `;

        document.body.appendChild(handle);

        // 创建拖拽位置指示器
        const dragIndicator = document.createElement('div');
        dragIndicator.className = 'ai-tag-drag-indicator';
        document.body.appendChild(dragIndicator);

        console.log("拖动手柄已创建");

        // 创建抽屉容器
        const drawer = document.createElement('div');
        drawer.id = 'ai-tag-manager-drawer';

        // 设置初始宽度
        const savedDrawerWidth = GM_getValue('ai_tag_drawer_width', 320);
        drawer.style.width = savedDrawerWidth + 'px';
        drawer.style.right = -savedDrawerWidth - 30 + 'px'; // 初始隐藏位置

        drawer.innerHTML = `
            <div class="ai-tag-drawer-resize-handle"></div>
            <div id="ai-tag-manager-header">
                <h2 id="ai-tag-manager-title">AI绘画Tag管理器</h2>
                <div style="display: flex; align-items: center;">
                    <span id="ai-tag-manager-editor" title="提示词编辑器">✨</span>
                    <span id="ai-tag-manager-mode-toggle">${isDarkMode ? '☀️' : '🌙'}</span>
                    <span id="ai-tag-manager-settings">⚙️</span>
                    <span id="ai-tag-manager-close">&times;</span>
                </div>
            </div>

            <div id="ai-tag-manager-search">
                <input type="text" id="ai-tag-search-input" placeholder="搜索标签组合...">
            </div>

            <div id="ai-tag-manager-tabs">
                <!-- 动态生成标签页 -->
            </div>

            <div id="ai-tag-manager-content"></div>

            <div id="ai-tag-add-button">+</div>
        `;

        document.body.appendChild(drawer);

        // 绑定抽屉调整大小事件
        const drawerResizeHandle = drawer.querySelector('.ai-tag-drawer-resize-handle');
        let isDrawerResizing = false;

        drawerResizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDrawerResizing = true;
            drawerResizeHandle.classList.add('resizing');
            document.body.style.cursor = 'ew-resize';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDrawerResizing) return;
            e.preventDefault();

            // 计算新宽度 (从右边开始算)
            const newWidth = window.innerWidth - e.clientX;

            // 限制宽度范围
            if (newWidth >= 300 && newWidth <= window.innerWidth * 0.8) {
                drawer.style.width = newWidth + 'px';
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (isDrawerResizing) {
                isDrawerResizing = false;
                drawerResizeHandle.classList.remove('resizing');
                document.body.style.cursor = '';
                // 保存宽度
                const currentWidth = parseInt(drawer.style.width);
                GM_setValue('ai_tag_drawer_width', currentWidth);
            }
        });

        console.log("抽屉容器已创建");

        // 创建详情视图
        const detailView = document.createElement('div');
        detailView.id = 'ai-tag-detail-view';

        detailView.innerHTML = `
            <div id="ai-tag-detail-header">
                <span id="ai-tag-detail-back">←</span>
                <h2 id="ai-tag-detail-title">标签详情</h2>
                <span style="width:24px;"></span>
            </div>

            <div id="ai-tag-detail-content">
                <div class="ai-tag-detail-form-group">
                    <label for="ai-tag-detail-name">组合名称</label>
                    <input type="text" id="ai-tag-detail-name" placeholder="输入一个便于记忆的名称" required>
                </div>

                <div class="ai-tag-detail-form-group">
                    <label for="ai-tag-detail-category">分类</label>
                    <select id="ai-tag-detail-category" required>
                        <!-- 动态生成分类选项 -->
                    </select>
                </div>

                <div class="ai-tag-detail-form-group">
                    <label for="ai-tag-detail-tags">标签组合</label>
                    <textarea id="ai-tag-detail-tags" placeholder="输入或粘贴你的标签组合" required></textarea>
                </div>

                <div class="ai-tag-detail-actions">
                    <button id="ai-tag-detail-save" class="ai-tag-btn ai-tag-btn-primary">保存</button>
                    <button id="ai-tag-detail-cancel" class="ai-tag-btn ai-tag-btn-secondary">取消</button>
                    <button id="ai-tag-detail-delete" class="ai-tag-btn ai-tag-btn-danger" style="margin-left: auto;">删除</button>
                </div>
            </div>
        `;

        drawer.appendChild(detailView);
        console.log("详情视图已创建");

        // 创建设置面板
        const settingsView = document.createElement('div');
        settingsView.id = 'ai-tag-settings-view';

        settingsView.innerHTML = `
            <div id="ai-tag-settings-header">
                <span id="ai-tag-settings-back">←</span>
                <h2 id="ai-tag-settings-title">设置</h2>
                <span style="width:24px;"></span>
            </div>

            <div id="ai-tag-settings-content">
                <div class="ai-tag-settings-section">
                    <h3 class="ai-tag-settings-section-title">显示模式</h3>

                    <label class="ai-tag-toggle-switch">
                        <span class="ai-tag-toggle-label">暗黑模式</span>
                        <input type="checkbox" id="ai-tag-darkmode-toggle" ${isDarkMode ? 'checked' : ''}>
                        <span class="ai-tag-slider"></span>
                        <span class="ai-tag-slider-icon sun">☀️</span>
                        <span class="ai-tag-slider-icon moon">🌙</span>
                    </label>
                </div>

                <div class="ai-tag-settings-section">
                    <h3 class="ai-tag-settings-section-title">分类管理</h3>

                    <p>自定义和管理标签分类</p>
                    <button id="ai-tag-manage-categories-btn" class="ai-tag-btn ai-tag-btn-primary">
                        <span>管理分类</span>
                    </button>
                </div>

                <div class="ai-tag-settings-section">
                    <h3 class="ai-tag-settings-section-title">数据管理</h3>

                    <div class="ai-tag-import-export">
                        <button id="ai-tag-export-btn" class="ai-tag-btn ai-tag-btn-primary">
                            <span>导出数据</span>
                            <span>📤</span>
                        </button>

                        <button id="ai-tag-import-btn" class="ai-tag-btn ai-tag-btn-secondary">
                            <span>导入数据</span>
                            <span>📥</span>
                        </button>
                    </div>

                    <input type="file" id="ai-tag-file-input" class="ai-tag-file-input" accept=".json">

                    <div style="margin-top: 15px;">
                        <button id="ai-tag-clear-btn" class="ai-tag-btn ai-tag-btn-danger">
                            <span>清空所有数据</span>
                            <span>🗑️</span>
                        </button>
                    </div>
                </div>

                <div class="ai-tag-settings-section">
                    <h3 class="ai-tag-settings-section-title">主题颜色</h3>

                    <div class="ai-tag-color-option">
                        <label>主题色</label>
                        <input type="color" class="ai-tag-color-picker" id="ai-tag-color-primary" value="${theme.primary}">
                    </div>

                    <div class="ai-tag-color-option">
                        <label>次要颜色</label>
                        <input type="color" class="ai-tag-color-picker" id="ai-tag-color-secondary" value="${theme.secondary}">
                    </div>

                    <div class="ai-tag-color-option">
                        <label>成功色</label>
                        <input type="color" class="ai-tag-color-picker" id="ai-tag-color-success" value="${theme.success}">
                    </div>

                    <div class="ai-tag-color-option">
                        <label>危险色</label>
                        <input type="color" class="ai-tag-color-picker" id="ai-tag-color-danger" value="${theme.danger}">
                    </div>

                    <div class="ai-tag-color-option">
                        <label>信息色</label>
                        <input type="color" class="ai-tag-color-picker" id="ai-tag-color-info" value="${theme.info}">
                    </div>

                    <button id="ai-tag-save-theme" class="ai-tag-save-theme-btn">保存配色</button>
                    <button id="ai-tag-reset-theme" class="ai-tag-reset-theme-btn">恢复默认配色</button>
                </div>
            </div>
        `;

        drawer.appendChild(settingsView);
        console.log("设置面板已创建");

        // 创建分类管理视图
        const categoriesView = document.createElement('div');
        categoriesView.id = 'ai-tag-categories-view';

        categoriesView.innerHTML = `
            <div id="ai-tag-categories-header">
                <span id="ai-tag-categories-back">←</span>
                <h2 id="ai-tag-categories-title">分类管理</h2>
                <span style="width:24px;"></span>
            </div>

            <div id="ai-tag-categories-content">
                <div id="ai-tag-categories-list">
                    <!-- 动态生成分类列表 -->
                </div>

                <div class="ai-tag-add-category-form">
                    <h3>添加新分类</h3>

                    <div class="ai-tag-category-form-group">
                        <label for="ai-tag-category-id">分类ID (英文字母和数字)</label>
                        <input type="text" id="ai-tag-category-id" placeholder="如: background" required>
                    </div>

                    <div class="ai-tag-category-form-group">
                        <label for="ai-tag-category-name">分类名称</label>
                        <input type="text" id="ai-tag-category-name" placeholder="如: 背景" required>
                    </div>

                    <div class="ai-tag-category-form-group ai-tag-category-form-color">
                        <label for="ai-tag-category-color">分类颜色</label>
                        <input type="color" id="ai-tag-category-color" class="ai-tag-color-picker" value="#3b82f6">
                    </div>

                    <div class="ai-tag-category-form-actions">
                        <button id="ai-tag-add-category" class="ai-tag-btn ai-tag-btn-primary">添加</button>
                    </div>
                </div>

                <div class="ai-tag-edit-category-form">
                    <h3>编辑分类</h3>

                    <div class="ai-tag-category-form-group">
                        <label for="ai-tag-edit-category-name">分类名称</label>
                        <input type="text" id="ai-tag-edit-category-name" required>
                    </div>

                    <div class="ai-tag-category-form-group ai-tag-category-form-color">
                        <label for="ai-tag-edit-category-color">分类颜色</label>
                        <input type="color" id="ai-tag-edit-category-color" class="ai-tag-color-picker">
                    </div>

                    <div class="ai-tag-category-form-actions">
                        <button id="ai-tag-update-category" class="ai-tag-btn ai-tag-btn-primary">保存</button>
                        <button id="ai-tag-cancel-edit-category" class="ai-tag-btn ai-tag-btn-secondary">取消</button>
                    </div>
                </div>
            </div>
        `;

        drawer.appendChild(categoriesView);
        console.log("分类管理视图已创建");

        // 创建提示词编辑器视图
        const promptEditorView = document.createElement('div');
        promptEditorView.id = 'ai-tag-prompt-editor-view';

        promptEditorView.innerHTML = `
            <div id="ai-tag-prompt-editor-header">
                <span id="ai-tag-prompt-editor-back">←</span>
                <h2 id="ai-tag-prompt-editor-title">提示词编辑器</h2>
                <span style="width:24px;"></span>
            </div>

            <div id="ai-tag-prompt-editor-content">
                <div class="ai-tag-prompt-section">
                    <div class="ai-tag-prompt-section-title">
                        <span class="icon">📝</span>
                        <span>主提示词</span>
                    </div>
                    <div class="ai-tag-prompt-list" id="ai-tag-main-prompt-list" data-type="main">
                        <div class="ai-tag-prompt-list-empty">拖放或点击标签添加到这里</div>
                    </div>
                </div>

                <div class="ai-tag-prompt-section">
                    <div class="ai-tag-prompt-section-title">
                        <span class="icon">🚫</span>
                        <span>负面提示词</span>
                    </div>
                    <div class="ai-tag-prompt-list" id="ai-tag-negative-prompt-list" data-type="negative">
                        <div class="ai-tag-prompt-list-empty">拖放或点击标签添加到这里</div>
                    </div>
                </div>

                <div class="ai-tag-prompt-section">
                    <div class="ai-tag-prompt-section-title">
                        <span class="icon">👤</span>
                        <span>角色栏位</span>
                    </div>
                    <div class="ai-tag-char-slots">
                        <div class="ai-tag-char-slot" data-slot="0">
                            <div class="ai-tag-char-slot-title">角色 1</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="1">
                            <div class="ai-tag-char-slot-title">角色 2</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="2">
                            <div class="ai-tag-char-slot-title">角色 3</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="3">
                            <div class="ai-tag-char-slot-title">角色 4</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="4">
                            <div class="ai-tag-char-slot-title">角色 5</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="5">
                            <div class="ai-tag-char-slot-title">角色 6</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-tag-prompt-editor-actions">
                <button id="ai-tag-clear-editor" class="ai-tag-btn ai-tag-btn-danger">清空</button>
                <button id="ai-tag-fill-all" class="ai-tag-btn ai-tag-btn-primary">一键填入</button>
            </div>
        `;

        drawer.appendChild(promptEditorView);
        console.log("提示词编辑器视图已创建");

        // 创建角色选择弹窗
        const charSelectorOverlay = document.createElement('div');
        charSelectorOverlay.className = 'ai-tag-char-selector-overlay';
        charSelectorOverlay.id = 'ai-tag-char-selector-overlay';
        // 初始隐藏
        charSelectorOverlay.style.display = 'none';

        charSelectorOverlay.innerHTML = `
            <div class="ai-tag-char-selector-modal" id="ai-tag-char-selector-modal">
                <div class="ai-tag-char-selector-header" style="cursor: move;">
                    <span>选择角色</span>
                    <span class="ai-tag-char-selector-close" id="ai-tag-char-selector-close">&times;</span>
                </div>
                <div class="ai-tag-char-selector-list" id="ai-tag-char-selector-list">
                    <!-- 动态生成角色列表 -->
                </div>
            </div>
        `;

        document.body.appendChild(charSelectorOverlay);

        // 初始化拖拽功能 (角色选择弹窗)
        const charModal = charSelectorOverlay.querySelector('.ai-tag-char-selector-modal');
        const charHeader = charSelectorOverlay.querySelector('.ai-tag-char-selector-header');

        // 设置初始位置 (居中)
        charModal.style.top = '50%';
        charModal.style.left = '50%';
        charModal.style.transform = 'translate(-50%, -50%)';

        // 拖拽逻辑
        let isCharDragging = false;
        let charDragStartX, charDragStartY;
        let charModalStartLeft, charModalStartTop;

        charHeader.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isCharDragging = true;
            charDragStartX = e.clientX;
            charDragStartY = e.clientY;

            const rect = charModal.getBoundingClientRect();
            charModalStartLeft = rect.left;
            charModalStartTop = rect.top;

            // 移除 transform 以便使用 left/top 绝对定位
            charModal.style.transform = 'none';
            charModal.style.left = charModalStartLeft + 'px';
            charModal.style.top = charModalStartTop + 'px';

            charHeader.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isCharDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - charDragStartX;
            const deltaY = e.clientY - charDragStartY;

            charModal.style.left = (charModalStartLeft + deltaX) + 'px';
            charModal.style.top = (charModalStartTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (isCharDragging) {
                isCharDragging = false;
                charHeader.style.cursor = 'move';
            }
        });
        console.log("角色选择弹窗已创建");

        // 创建浮动编辑器遮罩
        const floatingOverlay = document.createElement('div');
        floatingOverlay.className = 'ai-tag-floating-overlay';
        floatingOverlay.id = 'ai-tag-floating-overlay';
        document.body.appendChild(floatingOverlay);

        // 创建浮动编辑器窗口
        const floatingEditor = document.createElement('div');
        floatingEditor.id = 'ai-tag-floating-editor';

        floatingEditor.innerHTML = `
            <div class="ai-tag-floating-header">
                <h2 class="ai-tag-floating-title">提示词编辑器</h2>
                <button class="ai-tag-floating-close" id="ai-tag-floating-close">&times;</button>
            </div>

            <div class="ai-tag-floating-content">
                <div class="ai-tag-floating-section">
                    <div class="ai-tag-floating-section-title">
                        <span>📝</span>
                        <span>主提示词</span>
                    </div>
                    <div class="ai-tag-prompt-list" id="ai-tag-floating-main-list" data-type="main">
                        <div class="ai-tag-prompt-list-empty">拖放或点击标签添加</div>
                    </div>
                </div>

                <div class="ai-tag-floating-section">
                    <div class="ai-tag-floating-section-title">
                        <span>🚫</span>
                        <span>负面提示词</span>
                    </div>
                    <div class="ai-tag-prompt-list" id="ai-tag-floating-negative-list" data-type="negative">
                        <div class="ai-tag-prompt-list-empty">拖放或点击标签添加</div>
                    </div>
                </div>

                <div class="ai-tag-floating-section">
                    <div class="ai-tag-floating-section-title">
                        <span>👤</span>
                        <span>角色栏位</span>
                    </div>
                    <div class="ai-tag-char-slots" id="ai-tag-floating-char-slots">
                        <div class="ai-tag-char-slot" data-slot="0">
                            <div class="ai-tag-char-slot-title">角色 1</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="1">
                            <div class="ai-tag-char-slot-title">角色 2</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="2">
                            <div class="ai-tag-char-slot-title">角色 3</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="3">
                            <div class="ai-tag-char-slot-title">角色 4</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="4">
                            <div class="ai-tag-char-slot-title">角色 5</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                        <div class="ai-tag-char-slot" data-slot="5">
                            <div class="ai-tag-char-slot-title">角色 6</div>
                            <div class="ai-tag-char-slot-content empty">未选择</div>
                            <div class="ai-tag-char-slot-actions">
                                <button class="ai-tag-char-slot-btn select-btn">选择</button>
                                <button class="ai-tag-char-slot-btn clear-btn">清除</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-tag-floating-actions">
                <button class="md3-btn md3-btn-outlined" id="ai-tag-floating-clear" style="flex:1;">清空</button>
                <button class="md3-btn md3-btn-filled" id="ai-tag-floating-fill" style="flex:1;">一键填入</button>
            </div>

            <div class="ai-tag-resize-handle"></div>
        `;

        document.body.appendChild(floatingEditor);
        console.log("浮动编辑器已创建");

        // 加载分类并初始化UI
        loadCategoriesAndInitUI(drawer, detailView, settingsView, categoriesView, promptEditorView);
    }

    // 加载分类并初始化UI
    function loadCategoriesAndInitUI(drawer, detailView, settingsView, categoriesView, promptEditorView) {
        getAllCategories().then(categories => {
            // 动态生成标签页
            const tabsContainer = document.getElementById('ai-tag-manager-tabs');
            tabsContainer.innerHTML = `<div class="ai-tag-tab active" data-category="all">全部</div>`;

            categories.forEach(category => {
                tabsContainer.innerHTML += `<div class="ai-tag-tab" data-category="${category.id}">${category.name}</div>`;
            });

            // 动态生成分类选项
            const categorySelect = document.getElementById('ai-tag-detail-category');
            categorySelect.innerHTML = '';

            categories.forEach(category => {
                categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });

            // 生成分类列表
            renderCategoriesList(categories);

            // 为每个分类添加标签样式
            let categoryStyles = '';
            categories.forEach(category => {
                categoryStyles += `
                    .ai-tag-collection-name.${category.id}::before {
                        background-color: ${category.color};
                    }
                `;
            });
            GM_addStyle(categoryStyles);

            // 绑定事件
            bindEvents(drawer, detailView, settingsView, categoriesView, promptEditorView, categories);
        }).catch(error => {
            console.error("加载分类失败:", error);
            showToast("加载分类失败，请刷新页面重试");
        });
    }

    // 渲染分类列表
    function renderCategoriesList(categories) {
        const categoriesList = document.getElementById('ai-tag-categories-list');
        categoriesList.innerHTML = '';

        categories.forEach(category => {
            // 默认分类特殊处理
            const isDefaultCategory = DEFAULT_CATEGORIES.some(c => c.id === category.id);

            const categoryItem = document.createElement('div');
            categoryItem.className = 'ai-tag-category-item';
            categoryItem.dataset.id = category.id;

            categoryItem.innerHTML = `
                <div class="ai-tag-category-color" style="background-color: ${category.color};"></div>
                <div class="ai-tag-category-info">
                    <p class="ai-tag-category-name">${escapeHTML(category.name)}</p>
                    <p class="ai-tag-category-id">${category.id}</p>
                </div>
                <div class="ai-tag-category-actions">
                    <button class="ai-tag-category-btn ai-tag-category-edit-btn" title="编辑">✏️</button>
                    ${!isDefaultCategory ? `<button class="ai-tag-category-btn ai-tag-category-delete-btn" title="删除">🗑️</button>` : ''}
                </div>
            `;

            categoriesList.appendChild(categoryItem);

            // 编辑按钮点击事件
            const editBtn = categoryItem.querySelector('.ai-tag-category-edit-btn');
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // 显示编辑表单
                const editForm = document.querySelector('.ai-tag-edit-category-form');
                editForm.style.display = 'block';

                // 设置表单值
                document.getElementById('ai-tag-edit-category-name').value = category.name;
                document.getElementById('ai-tag-edit-category-color').value = category.color;

                // 设置编辑ID
                editForm.dataset.editId = category.id;
            });

            // 删除按钮点击事件
            if (!isDefaultCategory) {
                const deleteBtn = categoryItem.querySelector('.ai-tag-category-delete-btn');
                deleteBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (confirm(`确定要删除 "${category.name}" 分类吗？`)) {
                        try {
                            await deleteCategory(category.id);

                            // 重新加载分类
                            const updatedCategories = await getAllCategories();
                            renderCategoriesList(updatedCategories);

                            // 更新标签页和分类选择器
                            updateCategoryUIElements(updatedCategories);

                            showToast('分类删除成功');
                        } catch (error) {
                            if (error.message === "该分类下有标签，无法删除") {
                                showToast('该分类下存在标签，请先移除或修改这些标签');
                            } else {
                                console.error("删除分类失败:", error);
                                showToast('删除分类失败');
                            }
                        }
                    }
                });
            }
        });
    }

    // 更新分类相关的UI元素
    function updateCategoryUIElements(categories) {
        // 更新标签页
        const tabsContainer = document.getElementById('ai-tag-manager-tabs');
        tabsContainer.innerHTML = `<div class="ai-tag-tab active" data-category="all">全部</div>`;

        categories.forEach(category => {
            tabsContainer.innerHTML += `<div class="ai-tag-tab" data-category="${category.id}">${category.name}</div>`;
        });

        // 更新标签页点击事件
        const tabs = document.querySelectorAll('.ai-tag-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                console.log("点击了标签页:", this.dataset.category);
                e.preventDefault();
                e.stopPropagation();

                // 更新活动标签
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // 加载对应分类的标签
                const category = this.dataset.category;
                renderTagCollections(category);
            });
        });

        // 更新分类选择器
        const categorySelect = document.getElementById('ai-tag-detail-category');
        categorySelect.innerHTML = '';

        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });

        // 更新分类样式
        let categoryStyles = '';
        categories.forEach(category => {
            categoryStyles += `
                .ai-tag-collection-name.${category.id}::before {
                    background-color: ${category.color};
                }
            `;
        });
        GM_addStyle(categoryStyles);
    }

    // 绑定所有事件
    function bindEvents(drawer, detailView, settingsView, categoriesView, promptEditorView, categories) {
        console.log("开始绑定事件");

        const handle = document.getElementById('ai-tag-manager-handle');
        const dragIndicator = document.querySelector('.ai-tag-drag-indicator');

        // 1. 抽屉按钮点击事件
        handle.querySelector('.ai-tag-handle-drawer').addEventListener('click', function(e) {
            console.log("点击了抽屉按钮");
            e.preventDefault();
            e.stopPropagation();

            // 切换抽屉状态
            if (drawer.classList.contains('open')) {
                // 关闭
                drawer.classList.remove('open');
                const currentWidth = parseInt(drawer.style.width) || 320;
                drawer.style.right = (-currentWidth - 30) + 'px';
            } else {
                // 打开
                drawer.classList.add('open');
                drawer.style.right = '0px';
                console.log("抽屉被打开，加载标签");
                renderTagCollections('all');
            }
        });

        // 1b. 编辑器按钮点击事件（打开浮动编辑器）
        handle.querySelector('.ai-tag-handle-editor').addEventListener('click', function(e) {
            console.log("点击了编辑器按钮");
            e.preventDefault();
            e.stopPropagation();

            // 显示浮动编辑器
            const floatingEditor = document.getElementById('ai-tag-floating-editor');
            if (floatingEditor) {
                floatingEditor.style.display = 'flex';
                // 渲染当前状态
                renderPromptList('main');
                renderPromptList('negative');
                renderCharacterSlots();
            } else {
                // 后备：显示原来的编辑器视图
                promptEditorView.style.display = 'flex';
                renderPromptList('main');
                renderPromptList('negative');
                renderCharacterSlots();
            }
        });

        // 1c. 拖拽手柄事件 - 垂直位置调节
        const dragHandle = handle.querySelector('.ai-tag-handle-drag');
        let isDragging = false;
        let startY = 0;
        let startTop = 0;

        function startDrag(e) {
            isDragging = true;
            dragHandle.classList.add('dragging');
            startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startTop = handle.getBoundingClientRect().top;
            e.preventDefault();
        }

        function moveDrag(e) {
            if (!isDragging) return;

            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const deltaY = clientY - startY;
            let newTop = startTop + deltaY;

            // 边界限制
            const minTop = 100;
            const maxTop = window.innerHeight - 150;
            newTop = Math.max(minTop, Math.min(maxTop, newTop));

            // 实时更新位置
            handle.style.top = newTop + 'px';
            handle.style.transform = 'none';

            // 显示位置指示器
            dragIndicator.style.top = (newTop + handle.offsetHeight / 2) + 'px';
            dragIndicator.classList.add('visible');
        }

        function endDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            dragHandle.classList.remove('dragging');
            dragIndicator.classList.remove('visible');

            // 保存位置
            const currentTop = parseInt(handle.style.top);
            if (!isNaN(currentTop)) {
                GM_setValue('ai_tag_handle_position', currentTop);
                console.log("手柄位置已保存:", currentTop);
            }
        }

        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        // 2. 关闭按钮点击事件
        document.getElementById('ai-tag-manager-close').addEventListener('click', function(e) {
            console.log("点击了关闭按钮");
            e.preventDefault();
            e.stopPropagation();
            drawer.classList.remove('open');
            const currentWidth = parseInt(drawer.style.width) || 320;
            drawer.style.right = (-currentWidth - 30) + 'px';
        });

        // 3. 标签页切换事件
        const tabs = document.querySelectorAll('.ai-tag-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                console.log("点击了标签页:", this.dataset.category);
                e.preventDefault();
                e.stopPropagation();

                // 更新活动标签
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // 加载对应分类的标签
                const category = this.dataset.category;
                renderTagCollections(category);
            });
        });

        // 4. 搜索输入事件
        const searchInput = document.getElementById('ai-tag-search-input');
        let searchTimeout;

        searchInput.addEventListener('input', function(e) {
            e.stopPropagation();

            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                console.log("搜索:", query);

                if (query) {
                    searchAndRenderResults(query);
                } else {
                    const activeTab = document.querySelector('.ai-tag-tab.active');
                    renderTagCollections(activeTab.dataset.category);
                }
            }, 300); // 添加防抖延迟
        });

        // 5. 添加按钮点击事件
        document.getElementById('ai-tag-add-button').addEventListener('click', function(e) {
            console.log("点击了添加按钮");
            e.preventDefault();
            e.stopPropagation();

            // 显示添加表单
            showAddForm();
        });

        // 6. 详情视图返回按钮点击事件
        document.getElementById('ai-tag-detail-back').addEventListener('click', function(e) {
            console.log("点击了返回按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏详情视图
            detailView.style.display = 'none';
        });

        // 7. 保存按钮点击事件
        document.getElementById('ai-tag-detail-save').addEventListener('click', async function(e) {
            console.log("点击了保存按钮");
            e.preventDefault();
            e.stopPropagation();

            // 获取表单值
            const nameInput = document.getElementById('ai-tag-detail-name');
            const categorySelect = document.getElementById('ai-tag-detail-category');
            const tagsInput = document.getElementById('ai-tag-detail-tags');

            const name = nameInput.value.trim();
            const category = categorySelect.value;
            const tags = tagsInput.value.trim();

            if (!name || !tags) {
                showToast('请填写完整信息');
                return;
            }

            try {
                const editId = detailView.dataset.editId;

                if (editId) {
                    // 更新现有组合
                    await updateTagCollection(parseInt(editId), name, tags, category);
                    showToast('更新成功');
                } else {
                    // 添加新组合
                    await addTagCollection(name, tags, category);
                    showToast('添加成功');
                }

                // 隐藏详情视图
                detailView.style.display = 'none';

                // 刷新列表
                const activeTab = document.querySelector('.ai-tag-tab.active');
                renderTagCollections(activeTab.dataset.category);
            } catch (error) {
                console.error("保存标签失败:", error);
                showToast('保存失败，请重试');
            }
        });

        // 8. 取消按钮点击事件
        document.getElementById('ai-tag-detail-cancel').addEventListener('click', function(e) {
            console.log("点击了取消按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏详情视图
            detailView.style.display = 'none';
        });

        // 9. 删除按钮点击事件
        document.getElementById('ai-tag-detail-delete').addEventListener('click', async function(e) {
            console.log("点击了删除按钮");
            e.preventDefault();
            e.stopPropagation();

            const editId = detailView.dataset.editId;

            if (!editId) return;

            if (confirm('确定要删除这个标签组合吗？')) {
                try {
                    await deleteTagCollection(parseInt(editId));

                    // 隐藏详情视图
                    detailView.style.display = 'none';

                    // 刷新列表
                    const activeTab = document.querySelector('.ai-tag-tab.active');
                    renderTagCollections(activeTab.dataset.category);

                    showToast('删除成功');
                } catch (error) {
                    console.error("删除标签失败:", error);
                    showToast('删除失败，请重试');
                }
            }
        });

        // 10. 设置按钮点击事件
        document.getElementById('ai-tag-manager-settings').addEventListener('click', function(e) {
            console.log("点击了设置按钮");
            e.preventDefault();
            e.stopPropagation();

            // 显示设置面板
            settingsView.style.display = 'flex';
        });

        // 11. 设置返回按钮点击事件
        document.getElementById('ai-tag-settings-back').addEventListener('click', function(e) {
            console.log("点击了设置返回按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏设置面板
            settingsView.style.display = 'none';
        });

        // 12. 保存主题按钮点击事件
        document.getElementById('ai-tag-save-theme').addEventListener('click', function(e) {
            console.log("点击了保存主题按钮");
            e.preventDefault();
            e.stopPropagation();

            // 获取所有颜色值
            const newTheme = {
                primary: document.getElementById('ai-tag-color-primary').value,
                secondary: document.getElementById('ai-tag-color-secondary').value,
                success: document.getElementById('ai-tag-color-success').value,
                danger: document.getElementById('ai-tag-color-danger').value,
                info: document.getElementById('ai-tag-color-info').value
            };

            // 保存主题
            GM_setValue('ai_tag_manager_theme', newTheme);

            // 提示用户
            showToast('主题已保存，刷新页面后生效');
        });

        // 13. 重置主题按钮点击事件
        document.getElementById('ai-tag-reset-theme').addEventListener('click', function(e) {
            console.log("点击了重置主题按钮");
            e.preventDefault();
            e.stopPropagation();

            // 确认重置
            if (confirm('确定要恢复默认配色吗？')) {
                const defaultTheme = isDarkMode ? DARK_THEME : LIGHT_THEME;

                // 重置主题
                GM_setValue('ai_tag_manager_theme', defaultTheme);

                // 更新颜色选择器的值
                document.getElementById('ai-tag-color-primary').value = defaultTheme.primary;
                document.getElementById('ai-tag-color-secondary').value = defaultTheme.secondary;
                document.getElementById('ai-tag-color-success').value = defaultTheme.success;
                document.getElementById('ai-tag-color-danger').value = defaultTheme.danger;
                document.getElementById('ai-tag-color-info').value = defaultTheme.info;

                // 提示用户
                showToast('已恢复默认配色，刷新页面后生效');
            }
        });

        // 14. 暗黑模式开关事件
        document.getElementById('ai-tag-darkmode-toggle').addEventListener('change', function(e) {
            console.log("切换暗黑模式:", this.checked);

            // 保存暗黑模式设置
            GM_setValue('ai_tag_manager_darkmode', this.checked);

            // 提示用户
            showToast('显示模式已更改，刷新页面后生效');
        });

        // 15. 模式切换按钮点击事件
        document.getElementById('ai-tag-manager-mode-toggle').addEventListener('click', function(e) {
            console.log("点击了模式切换按钮");
            e.preventDefault();
            e.stopPropagation();

            // 获取当前模式并切换
            const darkModeToggle = document.getElementById('ai-tag-darkmode-toggle');
            darkModeToggle.checked = !darkModeToggle.checked;

            // 触发change事件
            const event = new Event('change');
            darkModeToggle.dispatchEvent(event);

            // 更新图标
            this.textContent = darkModeToggle.checked ? '☀️' : '🌙';
        });

        // 16. 导出数据按钮点击事件
        document.getElementById('ai-tag-export-btn').addEventListener('click', async function(e) {
            console.log("点击了导出数据按钮");
            e.preventDefault();
            e.stopPropagation();

            try {
                // 获取所有数据
                const collections = await getAllTagCollections();
                const categories = await getAllCategories();

                // 过滤掉默认分类
                const customCategories = categories.filter(cat =>
                    !DEFAULT_CATEGORIES.some(def => def.id === cat.id)
                );

                // 创建导出数据
                const exportData = {
                    tags: collections,
                    categories: customCategories
                };

                // 创建 Blob
                const dataStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });

                // 创建下载链接
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `AI绘画Tag管理器_导出_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();

                // 清理
                setTimeout(function() {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);

                showToast('导出成功！');
            } catch (error) {
                console.error("导出数据失败:", error);
                showToast('导出失败，请重试');
            }
        });

        // 17. 导入数据按钮点击事件
        document.getElementById('ai-tag-import-btn').addEventListener('click', function(e) {
            console.log("点击了导入数据按钮");
            e.preventDefault();
            e.stopPropagation();

            // 触发文件选择
            document.getElementById('ai-tag-file-input').click();
        });

        // 18. 文件选择事件
        document.getElementById('ai-tag-file-input').addEventListener('change', async function(e) {
            console.log("选择文件");

            if (!this.files || this.files.length === 0) {
                return;
            }

            const file = this.files[0];

            try {
                const content = await readFileAsText(file);
                let importData;

                try {
                    importData = JSON.parse(content);
                } catch (parseError) {
                    console.error("解析JSON失败:", parseError);
                    showToast('文件格式错误，请选择正确的导出文件');
                    return;
                }

                // 检查数据格式
                if (!importData.tags || !Array.isArray(importData.tags)) {
                    showToast('文件格式错误，请选择正确的导出文件');
                    return;
                }

                // 询问用户是否替换或合并
                const action = confirm('是否要替换现有数据？\n点击"确定"替换所有数据，点击"取消"合并导入。');

                if (action) {
                    // 替换：清空现有数据后导入
                    await clearAllTagCollections();
                }

                // 导入自定义分类
                if (importData.categories && Array.isArray(importData.categories)) {
                    for (const category of importData.categories) {
                        try {
                            await addCategory(category.id, category.name, category.color, category.order);
                        } catch (error) {
                            console.error(`导入分类 ${category.id} 失败:`, error);
                        }
                    }

                    // 重新加载分类
                    const updatedCategories = await getAllCategories();
                    renderCategoriesList(updatedCategories);
                    updateCategoryUIElements(updatedCategories);
                }

                // 导入标签数据
                const result = await addTagCollections(importData.tags);

                showToast(`导入成功！成功导入 ${result.success} 个标签，失败 ${result.error} 个`);

                // 刷新列表
                const activeTab = document.querySelector('.ai-tag-tab.active');
                renderTagCollections(activeTab.dataset.category);

                // 重置文件输入
                this.value = '';
            } catch (error) {
                console.error("导入数据失败:", error);
                showToast('导入失败，请重试');

                // 重置文件输入
                this.value = '';
            }
        });

        // 19. 清空数据按钮点击事件
        document.getElementById('ai-tag-clear-btn').addEventListener('click', async function(e) {
            console.log("点击了清空数据按钮");
            e.preventDefault();
            e.stopPropagation();

            // 二次确认
            if (confirm('确定要清空所有标签数据吗？此操作不可恢复！')) {
                try {
                    await clearAllTagCollections();

                    showToast('数据已清空');

                    // 刷新列表
                    const activeTab = document.querySelector('.ai-tag-tab.active');
                    renderTagCollections(activeTab.dataset.category);
                } catch (error) {
                    console.error("清空数据失败:", error);
                    showToast('清空失败，请重试');
                }
            }
        });

        // 20. 管理分类按钮点击事件
        document.getElementById('ai-tag-manage-categories-btn').addEventListener('click', function(e) {
            console.log("点击了管理分类按钮");
            e.preventDefault();
            e.stopPropagation();

            // 显示分类管理面板
            categoriesView.style.display = 'flex';

            // 刷新分类列表
            getAllCategories().then(categories => {
                renderCategoriesList(categories);
            });
        });

        // 21. 分类管理返回按钮点击事件
        document.getElementById('ai-tag-categories-back').addEventListener('click', function(e) {
            console.log("点击了分类管理返回按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏分类管理面板
            categoriesView.style.display = 'none';

            // 隐藏编辑表单
            document.querySelector('.ai-tag-edit-category-form').style.display = 'none';
        });

        // 22. 添加分类按钮点击事件
        document.getElementById('ai-tag-add-category').addEventListener('click', async function(e) {
            console.log("点击了添加分类按钮");
            e.preventDefault();
            e.stopPropagation();

            // 获取表单值
            const idInput = document.getElementById('ai-tag-category-id');
            const nameInput = document.getElementById('ai-tag-category-name');
            const colorInput = document.getElementById('ai-tag-category-color');

            const id = idInput.value.trim();
            const name = nameInput.value.trim();
            const color = colorInput.value;

            // 验证
            if (!id || !name) {
                showToast('请填写完整信息');
                return;
            }

            // 验证ID格式
            if (!/^[a-zA-Z0-9_]+$/.test(id)) {
                showToast('分类ID只能包含英文字母、数字和下划线');
                return;
            }

            try {
                // 获取当前最大排序值
                const categories = await getAllCategories();
                const maxOrder = Math.max(...categories.map(c => c.order), 0);

                // 添加分类
                await addCategory(id, name, color, maxOrder + 1);

                // 重新加载分类
                const updatedCategories = await getAllCategories();
                renderCategoriesList(updatedCategories);

                // 更新标签页和分类选择器
                updateCategoryUIElements(updatedCategories);

                // 添加新分类的样式
                GM_addStyle(`
                    .ai-tag-collection-name.${id}::before {
                        background-color: ${color};
                    }
                `);

                // 重置表单
                idInput.value = '';
                nameInput.value = '';

                showToast('分类添加成功');
            } catch (error) {
                if (error.message === "分类ID已存在") {
                    showToast('分类ID已存在，请使用其他ID');
                } else {
                    console.error("添加分类失败:", error);
                    showToast('添加分类失败');
                }
            }
        });

        // 23. 更新分类按钮点击事件
        document.getElementById('ai-tag-update-category').addEventListener('click', async function(e) {
            console.log("点击了更新分类按钮");
            e.preventDefault();
            e.stopPropagation();

            const editForm = document.querySelector('.ai-tag-edit-category-form');
            const categoryId = editForm.dataset.editId;

            if (!categoryId) {
                showToast('未选择分类');
                return;
            }

            // 获取表单值
            const nameInput = document.getElementById('ai-tag-edit-category-name');
            const colorInput = document.getElementById('ai-tag-edit-category-color');

            const name = nameInput.value.trim();
            const color = colorInput.value;

            // 验证
            if (!name) {
                showToast('请填写分类名称');
                return;
            }

            try {
                // 更新分类
                await updateCategory(categoryId, name, color);

                // 重新加载分类
                const updatedCategories = await getAllCategories();
                renderCategoriesList(updatedCategories);

                // 更新标签页和分类选择器
                updateCategoryUIElements(updatedCategories);

                // 更新该分类的样式
                GM_addStyle(`
                    .ai-tag-collection-name.${categoryId}::before {
                        background-color: ${color};
                    }
                `);

                // 隐藏编辑表单
                editForm.style.display = 'none';

                showToast('分类更新成功');
            } catch (error) {
                console.error("更新分类失败:", error);
                showToast('更新分类失败');
            }
        });

        // 24. 取消编辑分类按钮点击事件
        document.getElementById('ai-tag-cancel-edit-category').addEventListener('click', function(e) {
            console.log("点击了取消编辑分类按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏编辑表单
            document.querySelector('.ai-tag-edit-category-form').style.display = 'none';
        });

        // 25. 编辑器按钮点击事件
        document.getElementById('ai-tag-manager-editor').addEventListener('click', function(e) {
            console.log("点击了编辑器按钮");
            e.preventDefault();
            e.stopPropagation();

            // 显示提示词编辑器
            promptEditorView.style.display = 'flex';

            // 渲染当前状态
            renderPromptList('main');
            renderPromptList('negative');
            renderCharacterSlots();
        });

        // 26. 编辑器返回按钮点击事件
        document.getElementById('ai-tag-prompt-editor-back').addEventListener('click', function(e) {
            console.log("点击了编辑器返回按钮");
            e.preventDefault();
            e.stopPropagation();

            // 隐藏提示词编辑器
            promptEditorView.style.display = 'none';
        });

        // 27. 清空编辑器按钮点击事件
        document.getElementById('ai-tag-clear-editor').addEventListener('click', function(e) {
            console.log("点击了清空编辑器按钮");
            e.preventDefault();
            e.stopPropagation();

            if (confirm('确定要清空编辑器中的所有内容吗？')) {
                clearPromptEditor();
                showToast('编辑器已清空');
            }
        });

        // 28. 一键填入按钮点击事件
        document.getElementById('ai-tag-fill-all').addEventListener('click', async function(e) {
            console.log("点击了一键填入按钮");
            e.preventDefault();
            e.stopPropagation();

            await fillAllPrompts();
        });

        // 29. 角色选择弹窗关闭按钮
        document.getElementById('ai-tag-char-selector-close').addEventListener('click', function(e) {
            console.log("点击了角色选择弹窗关闭按钮");
            e.preventDefault();
            e.stopPropagation();

            document.getElementById('ai-tag-char-selector-overlay').style.display = 'none';
        });

        // 30. 角色选择弹窗遮罩点击关闭 - 移除，改为只允许通过关闭按钮关闭
        // document.getElementById('ai-tag-char-selector-overlay').addEventListener('click', function(e) {
        //     if (e.target === this) {
        //         this.style.display = 'none';
        //     }
        // });

        // 31. 角色栏位选择按钮点击事件
        document.querySelectorAll('.ai-tag-char-slot .select-btn').forEach((btn, index) => {
            btn.addEventListener('click', async function(e) {
                console.log("点击了角色栏位选择按钮:", index);
                e.preventDefault();
                e.stopPropagation();

                // 获取角色分类的标签
                try {
                    const collections = await getTagCollectionsByCategory('character');
                    if (collections.length === 0) {
                        showToast('没有角色标签，请先添加');
                        return;
                    }

                    // 显示选择弹窗
                    const overlay = document.getElementById('ai-tag-char-selector-overlay');
                    const list = document.getElementById('ai-tag-char-selector-list');

                    list.innerHTML = '';
                    collections.forEach(collection => {
                        const item = document.createElement('div');
                        item.className = 'ai-tag-char-selector-item';
                        item.textContent = collection.name;

                        item.addEventListener('click', function() {
                            promptEditorState.characters[index] = {
                                id: collection.id,
                                name: collection.name,
                                tags: collection.tags,
                                category: collection.category
                            };
                            saveEditorState(); // 保存状态
                            renderCharacterSlots();
                            overlay.style.display = 'none';
                            showToast(`已选择 ${collection.name}`);
                        });

                        list.appendChild(item);
                    });

                    // 允许拖拽，显示容器 (block而不是flex，因为是绝对定位的子元素)
                    overlay.style.display = 'block';
                } catch (error) {
                    console.error("获取角色标签失败:", error);
                    showToast('获取角色标签失败');
                }
            });
        });

        // 32. 角色栏位清除按钮点击事件
        document.querySelectorAll('.ai-tag-char-slot .clear-btn').forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                console.log("点击了角色栏位清除按钮:", index);
                e.preventDefault();
                e.stopPropagation();

                promptEditorState.characters[index] = null;
                saveEditorState(); // 保存状态
                renderCharacterSlots();
                showToast(`已清除角色 ${index + 1}`);
            });
        });

        // ============ 浮动编辑器事件绑定 ============

        const floatingEditor = document.getElementById('ai-tag-floating-editor');
        const floatingOverlay = document.getElementById('ai-tag-floating-overlay');

        // 33. 关闭浮动编辑器
        document.getElementById('ai-tag-floating-close').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            floatingEditor.style.display = 'none';
            floatingOverlay.style.display = 'none';
        });

        // 点击遮罩关闭
        floatingOverlay.addEventListener('click', function(e) {
            floatingEditor.style.display = 'none';
            floatingOverlay.style.display = 'none';
        });

        // 34. 浮动编辑器清空按钮
        document.getElementById('ai-tag-floating-clear').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('确定要清空编辑器中的所有内容吗？')) {
                clearPromptEditor();
                showToast('编辑器已清空');
            }
        });

        // 35. 浮动编辑器一键填入按钮
        document.getElementById('ai-tag-floating-fill').addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            await fillAllPrompts();
        });

        // 36. 浮动编辑器拖拽移动 (性能优化版)
        const floatingHeader = floatingEditor.querySelector('.ai-tag-floating-header');
        let isFloatingDragging = false;
        let floatingStartX = 0;
        let floatingStartY = 0;
        let floatingStartLeft = 0;
        let floatingStartTop = 0;
        let currentTranslateX = 0;
        let currentTranslateY = 0;
        let dragRafId = null;

        floatingHeader.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('ai-tag-floating-close')) return;

            isFloatingDragging = true;
            floatingStartX = e.clientX;
            floatingStartY = e.clientY;

            const rect = floatingEditor.getBoundingClientRect();
            floatingStartLeft = rect.left;
            floatingStartTop = rect.top;

            // 重置 transform 并设置绝对定位到当前位置
            floatingEditor.style.transform = 'none';
            floatingEditor.style.left = floatingStartLeft + 'px';
            floatingEditor.style.top = floatingStartTop + 'px';

            // 性能优化提示
            floatingEditor.style.willChange = 'transform';

            currentTranslateX = 0;
            currentTranslateY = 0;

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isFloatingDragging) return;

            const deltaX = e.clientX - floatingStartX;
            const deltaY = e.clientY - floatingStartY;

            currentTranslateX = deltaX;
            currentTranslateY = deltaY;

            if (dragRafId) cancelAnimationFrame(dragRafId);

            dragRafId = requestAnimationFrame(() => {
                // 使用 transform 进行移动，比改变 left/top 更流畅
                floatingEditor.style.transform = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0)`;
            });
        });

        document.addEventListener('mouseup', function(e) {
            if (!isFloatingDragging) return;

            isFloatingDragging = false;
            if (dragRafId) cancelAnimationFrame(dragRafId);

            // 提交最终位置
            const finalLeft = floatingStartLeft + currentTranslateX;
            const finalTop = floatingStartTop + currentTranslateY;

            floatingEditor.style.transform = 'none';
            floatingEditor.style.left = finalLeft + 'px';
            floatingEditor.style.top = finalTop + 'px';

            floatingEditor.style.willChange = 'auto';
        });

        // 37. 浮动编辑器调整大小
        const resizeHandle = floatingEditor.querySelector('.ai-tag-resize-handle');
        let isResizing = false;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let resizeStartWidth = 0;
        let resizeStartHeight = 0;

        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            resizeStartWidth = floatingEditor.offsetWidth;
            resizeStartHeight = floatingEditor.offsetHeight;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            const deltaX = e.clientX - resizeStartX;
            const deltaY = e.clientY - resizeStartY;

            const newWidth = Math.max(300, resizeStartWidth + deltaX);
            const newHeight = Math.max(400, resizeStartHeight + deltaY);

            floatingEditor.style.width = newWidth + 'px';
            floatingEditor.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', function(e) {
            isResizing = false;
        });

        // 38. 浮动编辑器内的角色栏位事件
        const floatingCharSlots = document.getElementById('ai-tag-floating-char-slots');
        floatingCharSlots.querySelectorAll('.select-btn').forEach((btn, index) => {
            btn.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                try {
                    const collections = await getTagCollectionsByCategory('character');
                    if (collections.length === 0) {
                        showToast('没有角色标签，请先添加');
                        return;
                    }

                    const overlay = document.getElementById('ai-tag-char-selector-overlay');
                    const list = document.getElementById('ai-tag-char-selector-list');

                    list.innerHTML = '';
                    collections.forEach(collection => {
                        const item = document.createElement('div');
                        item.className = 'ai-tag-char-selector-item';
                        item.textContent = collection.name;

                        item.addEventListener('click', function() {
                            promptEditorState.characters[index] = {
                                id: collection.id,
                                name: collection.name,
                                tags: collection.tags,
                                category: collection.category
                            };
                            saveEditorState(); // 保存状态
                            renderCharacterSlots();
                            overlay.style.display = 'none';
                            showToast(`已选择 ${collection.name}`);
                        });

                        list.appendChild(item);
                    });

                    // 允许拖拽，显示容器 (block而不是flex，因为是绝对定位的子元素)
                    overlay.style.display = 'block';
                } catch (error) {
                    console.error("获取角色标签失败:", error);
                    showToast('获取角色标签失败');
                }
            });
        });

        floatingCharSlots.querySelectorAll('.clear-btn').forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                promptEditorState.characters[index] = null;
                saveEditorState(); // 保存状态
                renderCharacterSlots();
                showToast(`已清除角色 ${index + 1}`);
            });
        });

        console.log("所有事件绑定完成");
    }

    /* 5. 渲染与处理函数 */

    // 显示添加表单
    function showAddForm() {
        console.log("显示添加表单");
        const detailView = document.getElementById('ai-tag-detail-view');
        const titleEl = document.getElementById('ai-tag-detail-title');
        const nameInput = document.getElementById('ai-tag-detail-name');
        const categorySelect = document.getElementById('ai-tag-detail-category');
        const tagsInput = document.getElementById('ai-tag-detail-tags');
        const deleteBtn = document.getElementById('ai-tag-detail-delete');

        // 重置表单
        titleEl.textContent = '添加标签组合';
        nameInput.value = '';
        categorySelect.selectedIndex = 0; // 选择第一个分类
        tagsInput.value = '';
        deleteBtn.style.display = 'none'; // 新增模式不显示删除按钮

        // 移除编辑ID
        detailView.removeAttribute('data-edit-id');

        // 显示详情视图
        detailView.style.display = 'flex';
    }

    // 显示编辑表单
    async function showEditForm(id) {
        console.log("显示编辑表单:", id);
        const detailView = document.getElementById('ai-tag-detail-view');
        const titleEl = document.getElementById('ai-tag-detail-title');
        const nameInput = document.getElementById('ai-tag-detail-name');
        const categorySelect = document.getElementById('ai-tag-detail-category');
        const tagsInput = document.getElementById('ai-tag-detail-tags');
        const deleteBtn = document.getElementById('ai-tag-detail-delete');

        try {
            if (!db) {
                throw new Error("数据库未初始化");
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(parseInt(id));

            request.onsuccess = function() {
                const collection = request.result;

                if (!collection) {
                    showToast('未找到标签组合');
                    return;
                }

                // 设置表单值
                titleEl.textContent = '编辑标签组合';
                nameInput.value = collection.name;

                // 选择对应的分类
                for (let i = 0; i < categorySelect.options.length; i++) {
                    if (categorySelect.options[i].value === collection.category) {
                        categorySelect.selectedIndex = i;
                        break;
                    }
                }

                tagsInput.value = collection.tags;
                deleteBtn.style.display = 'block'; // 编辑模式显示删除按钮

                // 设置编辑ID
                detailView.dataset.editId = id;

                // 显示详情视图
                detailView.style.display = 'flex';
            };

            request.onerror = function(event) {
                console.error("获取标签组合失败:", event.target.error);
                showToast('加载失败，请重试');
            };
        } catch (error) {
            console.error("显示编辑表单失败:", error);
            showToast('加载失败，请重试');
        }
    }

    // 渲染标签集合列表
    async function renderTagCollections(category) {
        console.log("渲染标签集合列表:", category);
        const contentDiv = document.getElementById('ai-tag-manager-content');
        contentDiv.innerHTML = '<div class="ai-tag-loading"><div class="ai-tag-loading-spinner"></div><div class="ai-tag-loading-text">加载中...</div></div>';

        try {
            let collections;

            if (category === 'all') {
                collections = await getAllTagCollections();
            } else {
                collections = await getTagCollectionsByCategory(category);
            }

            // 按名称排序
            collections.sort((a, b) => a.name.localeCompare(b.name));

            contentDiv.innerHTML = '';

            if (collections.length === 0) {
                contentDiv.innerHTML = `
                    <div class="ai-tag-empty-state">
                        <div class="ai-tag-empty-icon">📝</div>
                        <p>没有找到标签组合</p>
                        <button class="ai-tag-btn ai-tag-btn-primary" id="ai-tag-empty-add">添加一个</button>
                    </div>
                `;

                document.getElementById('ai-tag-empty-add').addEventListener('click', function(e) {
                    console.log("点击了空状态的添加按钮");
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById('ai-tag-add-button').click();
                });

                return;
            }

            for (const collection of collections) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'ai-tag-collection-item';
                itemDiv.dataset.id = collection.id;
                itemDiv.dataset.category = collection.category;

                itemDiv.innerHTML = `
                    <div class="ai-tag-collection-name ${collection.category}" title="${escapeHTML(collection.name)}">
                        ${escapeHTML(collection.name)}
                    </div>
                    <div class="ai-tag-collection-actions">
                        <button class="ai-tag-action-btn ai-tag-action-add" title="添加到编辑器">➕</button>
                        <button class="ai-tag-action-btn ai-tag-action-edit" title="编辑">✏️</button>
                        <button class="ai-tag-action-btn ai-tag-action-copy" title="复制">📋</button>
                    </div>
                `;

                contentDiv.appendChild(itemDiv);

                // 整行点击复制标签
                itemDiv.addEventListener('click', function(e) {
                    // 忽略按钮点击
                    if (e.target.closest('.ai-tag-collection-actions')) {
                        return;
                    }

                    console.log("点击了标签项:", this.dataset.id);
                    e.preventDefault();
                    e.stopPropagation();

                    const id = this.dataset.id;
                    copyTagsById(id);
                });

                // 添加到编辑器按钮
                const addBtn = itemDiv.querySelector('.ai-tag-action-add');
                addBtn.addEventListener('click', function(e) {
                    console.log("点击了添加到编辑器按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation();

                    const id = itemDiv.dataset.id;
                    const category = itemDiv.dataset.category;
                    addToPromptEditor(id, category);
                });

                // 编辑按钮
                const editBtn = itemDiv.querySelector('.ai-tag-action-edit');
                editBtn.addEventListener('click', function(e) {
                    console.log("点击了编辑按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation(); // 防止触发行点击

                    const id = itemDiv.dataset.id;
                    showEditForm(id);
                });

                // 复制按钮
                const copyBtn = itemDiv.querySelector('.ai-tag-action-copy');
                copyBtn.addEventListener('click', function(e) {
                    console.log("点击了复制按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation(); // 防止触发行点击

                    const id = itemDiv.dataset.id;
                    copyTagsById(id);
                });
            }

            console.log("标签列表渲染完成，共 " + collections.length + " 个");
        } catch (error) {
            console.error("渲染标签列表失败:", error);
            contentDiv.innerHTML = `
                <div class="ai-tag-empty-state">
                    <div class="ai-tag-empty-icon">⚠️</div>
                    <p>加载失败，请重试</p>
                    <button class="ai-tag-btn ai-tag-btn-primary" id="ai-tag-retry">重试</button>
                </div>
            `;

            document.getElementById('ai-tag-retry').addEventListener('click', function(e) {
                console.log("点击了重试按钮");
                e.preventDefault();
                e.stopPropagation();
                renderTagCollections(category);
            });
        }
    }

    // 搜索并渲染结果
    async function searchAndRenderResults(query) {
        console.log("搜索并渲染结果:", query);
        const contentDiv = document.getElementById('ai-tag-manager-content');
        contentDiv.innerHTML = '<div class="ai-tag-loading"><div class="ai-tag-loading-spinner"></div><div class="ai-tag-loading-text">搜索中...</div></div>';

        try {
            const results = await searchTagCollections(query);

            contentDiv.innerHTML = '';

            if (results.length === 0) {
                contentDiv.innerHTML = `
                    <div class="ai-tag-empty-state">
                        <div class="ai-tag-empty-icon">🔍</div>
                        <p>没有找到匹配的标签组合</p>
                        <p>尝试其他关键词或创建新组合</p>
                    </div>
                `;
                return;
            }

            for (const collection of results) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'ai-tag-collection-item';
                itemDiv.dataset.id = collection.id;
                itemDiv.dataset.category = collection.category;

                // 高亮匹配的文本
                const highlightedName = highlightText(collection.name, query);

                itemDiv.innerHTML = `
                    <div class="ai-tag-collection-name ${collection.category}" title="${escapeHTML(collection.name)}">
                        ${highlightedName}
                    </div>
                    <div class="ai-tag-collection-actions">
                        <button class="ai-tag-action-btn ai-tag-action-add" title="添加到编辑器">➕</button>
                        <button class="ai-tag-action-btn ai-tag-action-edit" title="编辑">✏️</button>
                        <button class="ai-tag-action-btn ai-tag-action-copy" title="复制">📋</button>
                    </div>
                `;

                contentDiv.appendChild(itemDiv);

                // 整行点击复制标签
                itemDiv.addEventListener('click', function(e) {
                    // 忽略按钮点击
                    if (e.target.closest('.ai-tag-collection-actions')) {
                        return;
                    }

                    console.log("点击了标签项:", this.dataset.id);
                    e.preventDefault();
                    e.stopPropagation();

                    const id = this.dataset.id;
                    copyTagsById(id);
                });

                // 添加到编辑器按钮
                const addBtn = itemDiv.querySelector('.ai-tag-action-add');
                addBtn.addEventListener('click', function(e) {
                    console.log("点击了添加到编辑器按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation();

                    const id = itemDiv.dataset.id;
                    const category = itemDiv.dataset.category;
                    addToPromptEditor(id, category);
                });

                // 编辑按钮
                const editBtn = itemDiv.querySelector('.ai-tag-action-edit');
                editBtn.addEventListener('click', function(e) {
                    console.log("点击了编辑按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation(); // 防止触发行点击

                    const id = itemDiv.dataset.id;
                    showEditForm(id);
                });

                // 复制按钮
                const copyBtn = itemDiv.querySelector('.ai-tag-action-copy');
                copyBtn.addEventListener('click', function(e) {
                    console.log("点击了复制按钮:", itemDiv.dataset.id);
                    e.preventDefault();
                    e.stopPropagation(); // 防止触发行点击

                    const id = itemDiv.dataset.id;
                    copyTagsById(id);
                });
            }

            console.log("搜索结果渲染完成，共 " + results.length + " 个");
        } catch (error) {
            console.error("搜索渲染失败:", error);
            contentDiv.innerHTML = `
                <div class="ai-tag-empty-state">
                    <div class="ai-tag-empty-icon">⚠️</div>
                    <p>搜索失败，请重试</p>
                </div>
            `;
        }
    }

    // 添加标签到提示词编辑器
    async function addToPromptEditor(id, category) {
        console.log("添加到提示词编辑器:", id, category);
        try {
            if (!db) {
                throw new Error("数据库未初始化");
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(parseInt(id));

            request.onsuccess = function() {
                const collection = request.result;

                if (!collection) {
                    showToast('未找到标签组合');
                    return;
                }

                // 根据分类决定添加到哪里
                if (category === 'character') {
                    // 角色分类：打开选择弹窗
                    promptEditorState.currentCharSlot = -1;
                    showCharacterSelector(collection);
                } else {
                    // 其他分类：添加到主提示词（默认）
                    // 检查是否已存在
                    const exists = promptEditorState.main.some(item => item.id === collection.id);
                    if (exists) {
                        showToast('该标签组合已添加');
                        return;
                    }

                    promptEditorState.main.push({
                        id: collection.id,
                        name: collection.name,
                        tags: collection.tags,
                        category: collection.category
                    });

                    saveEditorState(); // 保存状态
                    renderPromptList('main');
                    showToast('已添加到主提示词');
                }
            };

            request.onerror = function(event) {
                console.error("获取标签组合失败:", event.target.error);
                showToast('添加失败，请重试');
            };
        } catch (error) {
            console.error("添加到编辑器失败:", error);
            showToast('添加失败，请重试');
        }
    }

    // 显示角色选择弹窗
    function showCharacterSelector(collection) {
        const overlay = document.getElementById('ai-tag-char-selector-overlay');
        const list = document.getElementById('ai-tag-char-selector-list');

        // 生成 6 个角色栏位选项
        list.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const item = document.createElement('div');
            item.className = 'ai-tag-char-selector-item';
            item.dataset.slot = i;

            const slotContent = promptEditorState.characters[i];
            if (slotContent) {
                item.innerHTML = `角色 ${i + 1}: <span style="color: var(--text-secondary);">${escapeHTML(slotContent.name)}</span>`;
            } else {
                item.innerHTML = `角色 ${i + 1}: <span style="color: var(--text-secondary);">空</span>`;
            }

            item.addEventListener('click', function() {
                const slotIndex = parseInt(this.dataset.slot);
                promptEditorState.characters[slotIndex] = {
                    id: collection.id,
                    name: collection.name,
                    tags: collection.tags,
                    category: collection.category
                };
                saveEditorState(); // 保存状态
                renderCharacterSlots();
                overlay.style.display = 'none';
                showToast(`已添加到角色 ${slotIndex + 1}`);
            });

            list.appendChild(item);
        }

        // 显示弹窗 (这里仅显示容器，位置和可见性已由 CSS/JS 控制)
        overlay.style.display = 'block';
    }

    // 渲染提示词列表
    function renderPromptList(type) {
        // 支持抽屉内和浮动编辑器内的两套列表
        const listIds = type === 'main'
            ? ['ai-tag-main-prompt-list', 'ai-tag-floating-main-list']
            : ['ai-tag-negative-prompt-list', 'ai-tag-floating-negative-list'];

        const items = promptEditorState[type];

        listIds.forEach(listId => {
            const listEl = document.getElementById(listId);
            if (!listEl) return;

            if (items.length === 0) {
                listEl.innerHTML = '<div class="ai-tag-prompt-list-empty">拖放或点击标签添加到这里</div>';
                return;
            }

            listEl.innerHTML = '';

            // 添加 Drop Indicator
            const dropIndicator = document.createElement('div');
            dropIndicator.className = 'ai-tag-drop-indicator';
            listEl.appendChild(dropIndicator);

            items.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'ai-tag-prompt-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.dataset.type = type;

                itemEl.innerHTML = `
                    <span>${escapeHTML(item.name)}</span>
                    <button class="remove-btn" title="移除">×</button>
                `;

                // 移除按钮事件
                itemEl.querySelector('.remove-btn').addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    promptEditorState[type].splice(index, 1);
                    saveEditorState(); // 保存状态
                    renderPromptList(type);
                });

                // 拖拽事件
                itemEl.addEventListener('dragstart', handleDragStart);
                itemEl.addEventListener('dragend', handleDragEnd);

                listEl.appendChild(itemEl);
            });

            // 列表拖拽事件 - 移除旧监听器后重新添加
            listEl.removeEventListener('dragover', handleDragOver);
            listEl.removeEventListener('drop', handleDrop);
            listEl.removeEventListener('dragleave', handleDragLeave);
            listEl.addEventListener('dragover', handleDragOver);
            listEl.addEventListener('drop', handleDrop);
            listEl.addEventListener('dragleave', handleDragLeave);
        });
    }

    // 渲染角色栏位
    function renderCharacterSlots() {
        // 更新抽屉内的角色栏位
        const slots = document.querySelectorAll('.ai-tag-char-slot');
        slots.forEach((slot, index) => {
            // 注意：querySelectorAll 会选取所有匹配的元素，包括主抽屉和浮动编辑器中的
            // 但如果浮动编辑器中的结构稍有不同，或者 index 顺序有问题，这里可能会错乱
            // 最好的方式是根据 data-slot 属性来匹配

            const slotIndex = parseInt(slot.dataset.slot);
            if (isNaN(slotIndex)) return; // 可能是模板里的，忽略

            const content = promptEditorState.characters[slotIndex];
            const contentEl = slot.querySelector('.ai-tag-char-slot-content');

            if (content) {
                slot.classList.add('filled');
                contentEl.classList.remove('empty');
                contentEl.textContent = content.name;
            } else {
                slot.classList.remove('filled');
                contentEl.classList.add('empty');
                contentEl.textContent = '未选择';
            }
        });
    }

    // 拖拽相关变量
    let draggedItem = null;
    let draggedType = null;
    let draggedIndex = null;

    /**
     * 获取拖拽后应该插入的位置
     * @param {HTMLElement} container - 列表容器
     * @param {number} x - 鼠标 X 坐标
     * @param {number} y - 鼠标 Y 坐标
     * @returns {Object} - { afterElement: 插入点之后的元素, insertIndex: 插入位置索引 }
     */
    function getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.ai-tag-prompt-item:not(.dragging)')];

        return draggableElements.reduce((closest, child, index) => {
            const box = child.getBoundingClientRect();
            // 计算鼠标到元素中心的欧几里得距离
            const centerX = box.left + box.width / 2;
            const centerY = box.top + box.height / 2;
            const distance = Math.hypot(x - centerX, y - centerY);

            if (distance < closest.distance) {
                // 如果鼠标在元素左侧，则插入索引为当前索引，否则为当前索引+1
                // 但这里我们只需要找到最近的元素，然后判断是在其前还是其后

                // 更简单的逻辑：找到最近的元素，如果鼠标在该元素中心左侧/上方，则插入在该元素前(index)，否则插入在该元素后(index+1)
                // 但为了保持 getDragAfterElement 语义（返回"之后的元素"），我们只返回最近的且鼠标在其左/上的元素

                // 修正逻辑：我们寻找鼠标"之后"的元素。
                // 如果鼠标在元素左侧(水平布局)或上方(垂直布局)，且距离最近，则该元素为 afterElement

                // 这里的列表是 flex-wrap 的，所以是流式布局。
                // 简单的距离判断可能不够，特别是换行时。
                // 采用标准做法：遍历所有元素，找到第一个 (鼠标在左侧 或 鼠标在上方且同一行) 的元素

                // 为了简化，我们使用"最近距离"法，并结合方向判断
                return { distance: distance, element: child, insertIndex: index, box: box };
            } else {
                return closest;
            }
        }, { distance: Number.POSITIVE_INFINITY, element: null, insertIndex: draggableElements.length });
    }

    // 重新封装一个更准确的判断逻辑，因为 reduce 很难一次性做对流式布局
    function getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.ai-tag-prompt-item:not(.dragging)')];

        // 如果没有元素，直接返回
        if (draggableElements.length === 0) {
            return { element: null, insertIndex: 0 };
        }

        // 找到距离鼠标最近的元素
        let closest = { distance: Number.POSITIVE_INFINITY, element: null, index: -1 };

        draggableElements.forEach((child, index) => {
            const box = child.getBoundingClientRect();
            const centerX = box.left + box.width / 2;
            const centerY = box.top + box.height / 2;
            const distance = Math.hypot(x - centerX, y - centerY);

            if (distance < closest.distance) {
                closest = { distance, element: child, index, box };
            }
        });

        if (!closest.element) {
             return { element: null, insertIndex: draggableElements.length };
        }

        // 判断是在最近元素的前面还是后面
        // 如果鼠标在元素中心点的左侧，则认为是"前面" (插入点 = index)
        // 否则认为是"后面" (插入点 = index + 1, afterElement = nextSibling)

        const isBefore = x < (closest.box.left + closest.box.width / 2);

        if (isBefore) {
            return { element: closest.element, insertIndex: closest.index };
        } else {
            // 实际上是插入到 closest.element 之后
            // 但函数签名要求返回 "afterElement"，即插入点后面的那个元素
            const nextElement = draggableElements[closest.index + 1] || null;
            return { element: nextElement, insertIndex: closest.index + 1 };
        }
    }

    /**
     * 更新 Drop Indicator 位置
     * @param {HTMLElement} listEl - 列表容器
     * @param {number} x - 鼠标 X 坐标
     * @param {number} y - 鼠标 Y 坐标
     */
    function updateDropIndicator(listEl, x, y) {
        const indicator = listEl.querySelector('.ai-tag-drop-indicator');
        if (!indicator) return;

        const { element: afterElement, insertIndex } = getDragAfterElement(listEl, x, y);
        const items = listEl.querySelectorAll('.ai-tag-prompt-item');

        if (items.length === 0) {
            // 空列表，显示在起始位置
            indicator.style.display = 'block';
            indicator.style.left = '10px';
            indicator.style.top = '10px';
            indicator.style.height = '30px'; // 默认高度
            indicator.classList.add('visible');
            return;
        }

        // 获取参考元素的位置
        let targetRect;
        let isAfter = false;

        if (afterElement) {
            // 插入到 afterElement 之前
            targetRect = afterElement.getBoundingClientRect();
        } else {
            // 插入到末尾 (最后一个元素之后)
            const lastItem = items[items.length - 1];
            targetRect = lastItem.getBoundingClientRect();
            isAfter = true;
        }

        const listRect = listEl.getBoundingClientRect();

        // 设置指示器样式为垂直光标
        indicator.style.width = '2px';
        indicator.style.height = (targetRect.height || 30) + 'px';
        indicator.style.top = (targetRect.top - listRect.top) + 'px';

        if (isAfter) {
             indicator.style.left = (targetRect.right - listRect.left + 4) + 'px';
        } else {
             indicator.style.left = (targetRect.left - listRect.left - 4) + 'px';
        }

        indicator.classList.add('visible');
    }

    /**
     * 隐藏所有 Drop Indicator
     */
    function hideAllDropIndicators() {
        document.querySelectorAll('.ai-tag-drop-indicator').forEach(indicator => {
            indicator.classList.remove('visible');
        });
    }

    // 拖拽开始
    function handleDragStart(e) {
        draggedItem = this;
        draggedType = this.dataset.type;
        draggedIndex = parseInt(this.dataset.index);
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';

        // 设置拖拽图像透明度
        setTimeout(() => {
            this.style.opacity = '0.4';
        }, 0);
    }

    // 拖拽结束
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        this.style.opacity = '1';
        draggedItem = null;
        draggedType = null;
        draggedIndex = null;

        // 移除所有 drag-over 样式和 indicator
        document.querySelectorAll('.ai-tag-prompt-list').forEach(list => {
            list.classList.remove('drag-over');
        });
        hideAllDropIndicators();
    }

    // 拖拽经过
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');

        // 更新 Drop Indicator 位置
        updateDropIndicator(this, e.clientX, e.clientY); // 修改为传入 X 和 Y
    }

    // 拖拽离开
    function handleDragLeave(e) {
        // 检查是否真的离开了列表（而不是进入子元素）
        if (!this.contains(e.relatedTarget)) {
            this.classList.remove('drag-over');
            const indicator = this.querySelector('.ai-tag-drop-indicator');
            if (indicator) {
                indicator.classList.remove('visible');
            }
        }
    }

    // 放置
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        hideAllDropIndicators();

        if (!draggedItem) return;

        const targetType = this.dataset.type;
        const { insertIndex } = getDragAfterElement(this, e.clientX, e.clientY); // 修改为传入 X 和 Y

        if (draggedType === targetType) {
            // 同列表内排序
            const movedItem = promptEditorState[draggedType].splice(draggedIndex, 1)[0];

            // 修正：getDragAfterElement 返回的是"基于当前DOM（不含拖拽元素）"的插入位置
            // 当元素被设置为 dragging 时，它在 DOM 布局计算中被忽略了（或者至少 getDragAfterElement 的实现是这么处理的）
            // 我们只需要直接使用 insertIndex 即可
            // 不需要再根据 draggedIndex 和 insertIndex 的关系进行调整，
            // 因为 promptEditorState[draggedType].splice(draggedIndex, 1)[0] 已经移除了元素
            // 剩下的就是把元素插入到 insertIndex 的位置

            let newIndex = insertIndex;

            // 边界检查
            newIndex = Math.max(0, Math.min(newIndex, promptEditorState[targetType].length));

            promptEditorState[targetType].splice(newIndex, 0, movedItem);
        } else {
            // 跨列表移动
            const movedItem = promptEditorState[draggedType].splice(draggedIndex, 1)[0];

            // 边界检查
            const safeInsertIndex = Math.max(0, Math.min(insertIndex, promptEditorState[targetType].length));

            promptEditorState[targetType].splice(safeInsertIndex, 0, movedItem);
            renderPromptList(draggedType);
        }

        saveEditorState(); // 保存状态
        renderPromptList(targetType);
    }

    // 清空编辑器
    function clearPromptEditor() {
        promptEditorState.main = [];
        promptEditorState.negative = [];
        promptEditorState.characters = [null, null, null, null, null, null];
        promptEditorState.currentCharSlot = -1;

        saveEditorState(); // 保存状态

        renderPromptList('main');
        renderPromptList('negative');
        renderCharacterSlots();
    }

    // 通过ID复制标签
    async function copyTagsById(id) {
        console.log("复制标签:", id);
        try {
            if (!db) {
                throw new Error("数据库未初始化");
            }

            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(parseInt(id));

            request.onsuccess = function() {
                const collection = request.result;

                if (!collection) {
                    showToast('未找到标签组合');
                    return;
                }

                copyToClipboard(collection.tags);
            };

            request.onerror = function(event) {
                console.error("获取标签组合失败:", event.target.error);
                showToast('复制失败，请重试');
            };
        } catch (error) {
            console.error("复制标签失败:", error);
            showToast('复制失败，请重试');
        }
    }

    /* 6. NovelAI 填入功能 (从 write.js 移植) */

    /**
     * 异步等待函数，用于给React渲染留出时间
     * @param {number} ms - 毫秒数
     */
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    /**
     * 通过按钮文字查找按钮元素
     * 用于处理 "Add Character", "Other" 等动态生成的按钮
     */
    function findButtonByText(textList) {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => textList.some(t => btn.innerText && btn.innerText.includes(t)));
    }

    /**
     * 核心定位函数：视觉锚点查找
     * 不依赖 class 名（因为 NAI 的 class 是随机哈希），而是依赖用户可见的文字。
     *
     * @param {number} n - 角色编号
     * @returns {Object|null} - 返回 { header: 文本节点, container: 整个卡片DOM }
     */
    function findCharacterCard(n) {
        const targetText = `Character ${n}`;

        // 使用 XPath 查找包含特定文本的节点
        const xpath = `//*[text()='${targetText}']`;
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < result.snapshotLength; i++) {
            let node = result.snapshotItem(i);

            // 从文本节点向上遍历，寻找卡片容器
            let parent = node.parentElement;
            let depth = 0;
            while(parent && parent !== document.body && depth < 10) {
                if (parent.querySelector('.ProseMirror') || parent.innerText.includes("Al's Choice")) {
                     return { header: node, container: parent };
                }
                parent = parent.parentElement;
                depth++;
            }
        }
        return null;
    }

    /**
     * 安全写入函数 (Focus Guard)
     * 包含防误触机制，防止文字被写到主提示词框里
     */
    async function safeWrite(editor, text) {
        // 视觉反馈：红框标示目标
        const originalBorder = editor.style.border;
        editor.style.border = "2px solid #ef4444";
        editor.style.transition = "border 0.2s";

        let success = false;
        let retryCount = 0;

        while (!success && retryCount < 5) {
            // 1. 强制失焦当前元素 (防止串线)
            if (document.activeElement && document.activeElement !== editor) {
                document.activeElement.blur();
            }

            // 2. 模拟完整的点击流程 (MouseDown -> Focus -> Click)
            editor.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
            editor.focus();
            editor.dispatchEvent(new MouseEvent('click', {bubbles: true}));

            await sleep(50 + retryCount * 50);

            // 3. 焦点守卫检查
            if (document.activeElement !== editor) {
                console.warn(`⚠️ [第${retryCount+1}次] 聚焦未生效，跳过写入。`);
                retryCount++;
                continue;
            }

            // 4. 执行写入
            try {
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, text);
            } catch (e) {
                console.error("写入指令异常", e);
            }

            // 5. 结果验证
            await sleep(50);
            if (editor.innerText && editor.innerText.includes(text.substring(0, 3))) {
                success = true;
                editor.style.border = "2px solid #22c55e"; // 成功变绿
                await sleep(500);
            } else {
                retryCount++;
            }
        }

        editor.style.border = originalBorder;
        return success;
    }

    /**
     * 填充目标函数
     * @param {string} type - 填充类型: 'main', 'negative', 'char1'-'char6'
     * @param {string} text - 要填充的文本
     */
    async function fillTarget(type, text) {
        // 主提示词逻辑
        if (type === 'main' || type === 'negative') {
            const index = type === 'main' ? 0 : 1;
            const editor = document.querySelectorAll('.ProseMirror')[index];
            if (editor) {
                const result = await safeWrite(editor, text);
                if (result) {
                    showToast(`${type === 'main' ? '主提示词' : '负面提示词'}填入成功`);
                } else {
                    showToast(`${type === 'main' ? '主提示词' : '负面提示词'}填入失败`);
                }
            } else {
                showToast('未找到输入框，请确保在 NovelAI 图像生成页面');
            }
            return;
        }

        // 角色逻辑
        if (type.startsWith('char')) {
            const charNum = parseInt(type.replace('char', ''));

            // 1. 自动创建 (若不存在)
            let attempts = 0;
            while (attempts < 10) {
                if (findCharacterCard(charNum)) break;

                // 找不到卡片，执行创建流程
                const addBtn = findButtonByText(["Add Character"]);
                if (!addBtn) {
                    showToast("找不到 Add Character 按钮");
                    return;
                }
                addBtn.click();
                await sleep(300);

                const optionBtn = findButtonByText(["Other", "Generic", "Female", "Male"]);
                if (optionBtn) optionBtn.click();
                else {
                    const popupBtn = document.querySelector('[data-popper-placement] button');
                    if (popupBtn) popupBtn.click();
                }
                await sleep(600);
                attempts++;
            }

            // 2. 获取对象
            const cardObj = findCharacterCard(charNum);
            if (!cardObj) {
                showToast(`无法创建角色 ${charNum}`);
                return;
            }

            let { header, container } = cardObj;
            let editor = container.querySelector('.ProseMirror');

            // 3. 自动展开 (若折叠)
            if (!editor || editor.offsetParent === null) {
                header.click();
                await sleep(300);
                editor = container.querySelector('.ProseMirror');
            }

            // 4. 安全写入
            if (editor) {
                const result = await safeWrite(editor, text);
                if (result) {
                    showToast(`角色 ${charNum} 填入成功`);
                } else {
                    showToast(`角色 ${charNum} 填入失败`);
                }
            }
        }
    }

    /**
     * 一键填入所有内容
     */
    async function fillAllPrompts() {
        let successCount = 0;
        let totalCount = 0;

        // 填入主提示词
        if (promptEditorState.main.length > 0) {
            totalCount++;
            const mainText = promptEditorState.main.map(item => item.tags).join(', ');
            const index = 0;
            const editor = document.querySelectorAll('.ProseMirror')[index];
            if (editor) {
                const result = await safeWrite(editor, mainText);
                if (result) successCount++;
            }
        }

        // 填入负面提示词
        if (promptEditorState.negative.length > 0) {
            totalCount++;
            const negativeText = promptEditorState.negative.map(item => item.tags).join(', ');
            const index = 1;
            const editor = document.querySelectorAll('.ProseMirror')[index];
            if (editor) {
                const result = await safeWrite(editor, negativeText);
                if (result) successCount++;
            }
        }

        // 填入角色
        for (let i = 0; i < 6; i++) {
            if (promptEditorState.characters[i]) {
                totalCount++;
                await fillTarget(`char${i + 1}`, promptEditorState.characters[i].tags);
                successCount++;
            }
        }

        if (totalCount === 0) {
            showToast('编辑器为空，请先添加标签');
        } else {
            showToast(`填入完成: ${successCount}/${totalCount} 成功`);
        }
    }

    /* 7. 工具函数 */

    // 复制到剪贴板
    function copyToClipboard(text) {
        console.log("复制到剪贴板");
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // 防止滚动
        textarea.style.left = '-9999px'; // 移出视野
        textarea.style.top = '0';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('复制成功！');
            } else {
                showToast('复制失败，请手动复制');
            }
        } catch (err) {
            console.error("复制失败:", err);
            showToast('复制失败，请手动复制');
        }

        document.body.removeChild(textarea);
    }

    // 读取文件为文本
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(event) {
                resolve(event.target.result);
            };

            reader.onerror = function(event) {
                reject(event.target.error);
            };

            reader.readAsText(file);
        });
    }

    // 显示提示消息
    function showToast(message) {
        console.log("显示提示:", message);
        // 移除现有提示
        const existingToast = document.querySelector('.ai-tag-toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toast = document.createElement('div');
        toast.className = 'ai-tag-toast';
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(function() {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 2000);
    }

    // 高亮文本中匹配的部分
    function highlightText(text, query) {
        if (!query) return escapeHTML(text);

        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return escapeHTML(text).replace(regex, '<span class="ai-tag-highlight">$1</span>');
    }

    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 转义HTML特殊字符
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 调整颜色亮度
    function adjustColor(color, amount) {
        // 转换为RGB
        let hex = color;
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }

        // 转换为RGB值
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // 调整亮度
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        // 转换回十六进制
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

})();