// ==UserScript==
// @name         NotebookLM Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Make NotebookLM dialog fullscreen with proper content scaling
// @author       hulu
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517625/NotebookLM%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/517625/NotebookLM%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = {
        log: (...args) => console.log('[NotebookLM Debug]', ...args)
    };

    // 使用 MutationObserver 替代 DOMNodeInserted
    const observer = new MutationObserver((mutations) => {
        const dialog = document.querySelector('.mat-mdc-dialog-container');
        const container = document.querySelector('.cdk-overlay-container');

        if(container) {
            if(dialog && dialog.querySelector('.note-editor')) {
                container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            } else {
                container.style.backgroundColor = 'transparent';
            }
        }
    });

    // 启动观察器
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    };

    if (document.body) {
        observer.observe(document.body, observerConfig);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, observerConfig);
        }, { passive: true });
    }

    // 注入样式
    GM_addStyle(`
        /* 弹出框容器 */
        .cdk-overlay-container {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 9999 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* 弹出框包装器 */
        .cdk-global-overlay-wrapper {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 笔记编辑器对话框样式 */
        .note-editor .mat-mdc-dialog-container,
        .note-editor .mat-mdc-dialog-content,
        .note-editor {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            box-sizing: border-box !important;
        }

        /* 编辑器内容 */
        .ql-editor,
        .prosemirror-editor,
        .markdown-editor-legacy {
            height: calc(100vh - 64px) !important;
            width: 100% !important;
            padding: 20px 40px !important;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            background-color: var(--v2-surface) !important;
        }

        /* 移除所有遮罩 */
        .cdk-overlay-backdrop,
        .cdk-overlay-dark-backdrop,
        .cdk-overlay-backdrop-showing,
        .cdk-overlay-connected-position-bounding-box {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* 修复主内容区域 */
        .main-contents {
            pointer-events: auto !important;
            background: transparent !important;
        }

        /* 修复按钮样式 */
        .note-header__controls {
            position: fixed !important;
            top: 12px !important;
            right: 12px !important;
            z-index: 2 !important;
            display: flex !important;
            gap: 8px !important;
        }

        /* 修复按钮点击事件 */
        .note-editor-close-button,
        .mat-mdc-button,
        .mat-icon,
        .mat-mdc-button-touch-target,
        .mat-mdc-menu-content,
        .mat-mdc-menu-panel {
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* 优化按钮焦点指示器 */
        .mat-focus-indicator {
            position: relative !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: fit-content !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 0 8px !important;
            height: 36px !important;
        }

        /* 按钮内部文字自适应 */
        .mat-focus-indicator .mdc-button__label {
            display: inline-flex !important;
            align-items: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            flex: 0 1 auto !important;
            min-width: 0 !important;
            height: 100% !important;
        }

        /* 保持按钮图标大小固定 */
        .mat-focus-indicator .mat-icon {
            flex: 0 0 auto !important;
            width: 24px !important;
            height: 24px !important;
            font-size: 24px !important;
            line-height: 24px !important;
            margin: 0 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* 确保按钮边界不被内容撑开 */
        .mat-focus-indicator.mat-mdc-button {
            max-width: 300px !important;
            height: 36px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 18px !important;
            overflow: hidden !important;
        }

        .note-editor-close-button {
            <!-- display: flex !important; -->
            align-items: center !important;
            justify-content: center !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            color: var(--v2-on-surface-emphasis) !important;
        }

        .note-editor-close-button:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }

        /* 移除所有过渡动画 */
        .cdk-overlay-container *,
        .mat-mdc-dialog-container *,
        .cdk-global-overlay-wrapper *,
        .cdk-overlay-pane * {
            transition: none !important;
            animation: none !important;
        }

        /* 修复分享对话框样式 */
        .sharing-dialog {
            position: relative !important;
            width: 500px !important;
            max-width: 90vw !important;
            height: auto !important;
            background: var(--v2-surface) !important;
            border-radius: 28px !important;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14) !important;
            z-index: 10000 !important;
        }

        .sharing-dialog .mat-mdc-dialog-container {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            max-height: 90vh !important;
            transform: none !important;
            margin: 0 !important;
            padding: 24px !important;
            background: transparent !important;
        }

        /* 分享对话框的遮罩 */
        .sharing-dialog ~ .cdk-overlay-backdrop {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            background: rgba(0, 0, 0, 0.32) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: 9999 !important;
        }

        /* 修复分享对话框内部布局 */
        .sharing-dialog .mat-mdc-dialog-surface {
            display: block !important;
            position: relative !important;
            box-sizing: border-box !important;
        }

        /* 确保分享对话框在正确的位置 */
        .sharing-dialog .cdk-overlay-pane {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
        }

        /* 修复标题层级 */
        .mat-card-title,
        [class*="note-title"],
        [class*="ngcontent"] {
            position: relative !important;
            z-index: 1 !important;
        }

        /* 修复编辑器背景 */
        .note-editor {
            background-color: var(--v2-surface) !important;
        }

        /* 确保菜单显示在按钮上层 */
        .cdk-overlay-container {
            position: fixed !important;
            z-index: 1000 !important;
            pointer-events: none !important;
        }

        .cdk-overlay-pane {
            pointer-events: auto !important;
            position: absolute !important;
        }

        /* 修复菜单项点击事件 */
        .mat-mdc-menu-item {
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 2 !important;
        }

        /* 修复设置图标显示 */
        .settings-icon.mat-icon {
            position: relative !important;
            z-index: 100 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* 修复分享标签自适应 */
        .share-label.ng-star-inserted {
            max-width: 200px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: inline-block !important;
        }

        /* 确保分享按钮容器正确显示 */
        .settings-button {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            padding: 0 16px !important;
            height: 36px !important;
            border-radius: 18px !important;
            background: var(--v2-settings-button-background) !important;
        }

        /* 确保图标和文字垂直居中 */
        .settings-button .mat-icon,
        .settings-button .settings-label {
            display: inline-flex !important;
            align-items: center !important;
            vertical-align: middle !important;
        }

        .mat-icon {
            -webkit-user-select: none;
            user-select: none;
            background-repeat: no-repeat;
            display: inline-block;
            fill: currentColor;
            height: 24px;
            width: 24px;
            overflow: visible !important;
            position: relative !important;
            z-index: auto !important;
        }
        :where(:root) .gmat-mdc-button.mat-mdc-extended-fab {
            padding-left: 24px;
            padding-right: 24px;
            line-height: 36px !important;
            height: 36px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* 确保 extended-fab 按钮内容对齐 */
        :where(:root) .gmat-mdc-button.mat-mdc-extended-fab .mdc-button__label {
            display: inline-flex !important;
            align-items: center !important;
            height: 100% !important;
            line-height: normal !important;
        }
    `);

    debug.log('脚本加载完成');
})();