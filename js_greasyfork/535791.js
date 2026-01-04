// ==UserScript==
// @name         AI绘画Tag管理器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  储存AI绘画的tag组合，支持自定义分类、搜索和复制，抽屉式界面，黑暗/明亮模式，数据导入导出
// @author       salty
// @license      MIT
// @match       https://novelai.net/image*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/535791/AI%E7%BB%98%E7%94%BBTag%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535791/AI%E7%BB%98%E7%94%BBTag%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

/* 全局变量 */
let db;
const DB_NAME = 'AITagsDatabase';
const STORE_NAME = 'tagCollections';
const CATEGORY_STORE = 'tagCategories';
const DB_VERSION = 3; // 升级版本以支持新的存储对象

// 明亮模式主题颜色
const LIGHT_THEME = {
    primary: '#4f46e5',      // 靛蓝色
    secondary: '#6d28d9',    // 紫色
    success: '#10b981',      // 绿色
    danger: '#ef4444',       // 红色
    info: '#3b82f6',         // 蓝色
    warning: '#f59e0b',      // 橙色
    background: '#f8fafc',   // 浅灰背景
    surface: '#ffffff',      // 表面白色
    text: '#1e293b',         // 深蓝灰文字
    textSecondary: '#64748b', // 次要文字
    border: '#e2e8f0',       // 边框色
};

// 黑暗模式主题颜色
const DARK_THEME = {
    primary: '#6366f1',      // 靛蓝色
    secondary: '#a855f7',    // 紫色
    success: '#34d399',      // 绿色
    danger: '#f87171',       // 红色
    info: '#60a5fa',         // 蓝色
    warning: '#fbbf24',      // 橙色
    background: '#0f172a',   // 深蓝黑背景
    surface: '#1e293b',      // 表面深色
    text: '#f1f5f9',         // 浅色文字
    textSecondary: '#94a3b8', // 次要文字
    border: '#334155',       // 边框色
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
            /* 基本样式 */
            :root {
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
            
            /* 抽屉手柄 */
            #ai-tag-manager-handle {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                width: 44px;
                height: 110px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border-radius: 12px 0 0 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.15);
                z-index: 9998;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                touch-action: none;
            }
            
            #ai-tag-manager-handle:hover {
                width: 48px;
                box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.2);
            }
            
            #ai-tag-manager-handle:active {
                cursor: grabbing;
                background: linear-gradient(135deg, var(--primary-hover), var(--secondary-hover));
            }
            
            #ai-tag-manager-handle::before {
                content: "≡";
                color: white;
                font-size: 24px;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            
            /* 抽屉容器 */
            #ai-tag-manager-drawer {
                position: fixed;
                top: 0;
                right: -350px;
                width: 320px;
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
            
            #ai-tag-manager-drawer.open {
                right: 0;
            }
            
            /* 头部 */
            #ai-tag-manager-header {
                padding: 18px 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }
            
            #ai-tag-manager-title {
                font-size: 18px;
                font-weight: bold;
                margin: 0;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            
            #ai-tag-manager-close {
                font-size: 24px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                transition: all 0.2s ease;
            }
            
            #ai-tag-manager-close:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            #ai-tag-manager-settings {
                font-size: 18px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                margin-right: 15px;
                transition: all 0.2s ease;
            }
            
            #ai-tag-manager-settings:hover {
                opacity: 1;
                transform: rotate(30deg);
            }
            
            #ai-tag-manager-mode-toggle {
                font-size: 18px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                margin-right: 15px;
                transition: all 0.2s ease;
            }
            
            #ai-tag-manager-mode-toggle:hover {
                opacity: 1;
                transform: scale(1.1);
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
                border-color: var(--primary-color);
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
                color: var(--primary-color);
                font-weight: bold;
            }
            
            .ai-tag-tab.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40%;
                height: 3px;
                background-color: var(--primary-color);
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
                background-color: var(--primary-color);
                border-radius: 3px 3px 0 0;
            }
            
            /* 内容区域 */
            #ai-tag-manager-content {
                flex: 1;
                overflow-y: auto;
                padding: 0;
                background-color: var(--surface-color);
            }
            
            /* 添加按钮 */
            #ai-tag-add-button {
                position: absolute;
                bottom: 25px;
                right: 25px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            
            #ai-tag-add-button:hover {
                transform: scale(1.05) rotate(90deg);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
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
                background-color: rgba(0, 0, 0, 0.05);
                color: var(--primary-color);
                transform: scale(1.1);
            }
            
            /* 详情视图 */
            #ai-tag-detail-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--surface-color);
                z-index: 10001;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }
            
            #ai-tag-detail-header {
                padding: 18px 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }
            
            #ai-tag-detail-title {
                font-size: 18px;
                font-weight: bold;
                margin: 0;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            
            #ai-tag-detail-back {
                font-size: 24px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                transition: all 0.2s ease;
            }
            
            #ai-tag-detail-back:hover {
                opacity: 1;
                transform: scale(1.1);
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
                border-color: var(--primary-color);
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
            
            .ai-tag-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 500;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .ai-tag-btn-primary {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
            }
            
            .ai-tag-btn-primary:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }
            
            .ai-tag-btn-secondary {
                background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
                color: white;
            }
            
            .ai-tag-btn-secondary:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }
            
            .ai-tag-btn-danger {
                background: linear-gradient(135deg, var(--danger-color), ${adjustColor(theme.danger, -20)});
                color: white;
            }
            
            .ai-tag-btn-danger:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }
            
            .ai-tag-btn-default {
                background-color: var(--background-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
            }
            
            .ai-tag-btn-default:hover {
                background-color: var(--surface-color);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
                border-top-color: var(--primary-color);
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
            
            /* 设置面板 */
            #ai-tag-settings-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--surface-color);
                z-index: 10002;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }
            
            #ai-tag-settings-header {
                padding: 18px 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }
            
            #ai-tag-settings-title {
                font-size: 18px;
                font-weight: bold;
                margin: 0;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            
            #ai-tag-settings-back {
                font-size: 24px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                transition: all 0.2s ease;
            }
            
            #ai-tag-settings-back:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            #ai-tag-settings-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                color: var(--text-color);
            }
            
            .ai-tag-settings-section {
                margin-bottom: 25px;
                background-color: var(--background-color);
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            
            .ai-tag-settings-section-title {
                font-size: 16px;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid var(--border-color);
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
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            
            .ai-tag-save-theme-btn:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                transform: translateY(-2px);
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
                background-color: var(--primary-color);
            }
            
            input:focus + .ai-tag-slider {
                box-shadow: 0 0 1px var(--primary-color);
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
            
            /* 分类管理视图 */
            #ai-tag-categories-view {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--surface-color);
                z-index: 10003;
                display: none;
                flex-direction: column;
                border-radius: 16px 0 0 16px;
                animation: ai-tag-fade-in 0.3s ease;
            }
            
            #ai-tag-categories-header {
                padding: 18px 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 0 0 0;
            }
            
            #ai-tag-categories-title {
                font-size: 18px;
                font-weight: bold;
                margin: 0;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            
            #ai-tag-categories-back {
                font-size: 24px;
                cursor: pointer;
                color: white;
                opacity: 0.8;
                transition: all 0.2s ease;
            }
            
            #ai-tag-categories-back:hover {
                opacity: 1;
                transform: scale(1.1);
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
                background-color: rgba(0, 0, 0, 0.05);
                color: var(--primary-color);
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
                border-color: var(--primary-color);
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
        
        // 创建拖动手柄
        const handle = document.createElement('div');
        handle.id = 'ai-tag-manager-handle';
        document.body.appendChild(handle);
        console.log("拖动手柄已创建");
        
        // 创建抽屉容器
        const drawer = document.createElement('div');
        drawer.id = 'ai-tag-manager-drawer';
        
        drawer.innerHTML = `
            <div id="ai-tag-manager-header">
                <h2 id="ai-tag-manager-title">AI绘画Tag管理器</h2>
                <div style="display: flex; align-items: center;">
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
        
        // 加载分类并初始化UI
        loadCategoriesAndInitUI(drawer, detailView, settingsView, categoriesView);
    }
    
    // 加载分类并初始化UI
    function loadCategoriesAndInitUI(drawer, detailView, settingsView, categoriesView) {
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
            bindEvents(drawer, detailView, settingsView, categoriesView, categories);
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
    function bindEvents(drawer, detailView, settingsView, categoriesView, categories) {
        console.log("开始绑定事件");
        
        // 1. 拖动手柄点击事件
        document.getElementById('ai-tag-manager-handle').addEventListener('click', function(e) {
            console.log("点击了拖动手柄");
            e.preventDefault(); // 阻止默认行为
            e.stopPropagation(); // 阻止冒泡
            
            // 切换抽屉状态
            drawer.classList.toggle('open');
            
            // 如果抽屉被打开，加载标签
            if (drawer.classList.contains('open')) {
                console.log("抽屉被打开，加载标签");
                renderTagCollections('all');
            }
        });
        
        // 2. 关闭按钮点击事件
        document.getElementById('ai-tag-manager-close').addEventListener('click', function(e) {
            console.log("点击了关闭按钮");
            e.preventDefault();
            e.stopPropagation();
            drawer.classList.remove('open');
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
                
                itemDiv.innerHTML = `
                    <div class="ai-tag-collection-name ${collection.category}" title="${escapeHTML(collection.name)}">
                        ${escapeHTML(collection.name)}
                    </div>
                    <div class="ai-tag-collection-actions">
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
                
                // 高亮匹配的文本
                const highlightedName = highlightText(collection.name, query);
                
                itemDiv.innerHTML = `
                    <div class="ai-tag-collection-name ${collection.category}" title="${escapeHTML(collection.name)}">
                        ${highlightedName}
                    </div>
                    <div class="ai-tag-collection-actions">
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
    
    /* 6. 工具函数 */
    
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