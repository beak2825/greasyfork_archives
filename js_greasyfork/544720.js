// ==UserScript==
// @name         Linux.do 稍后再看
// @namespace    http://tampermonkey.net/
// @version      2.17.0
// @description  为 Linux.do 论坛添加稍后再看功能 - 支持帖子详情页添加、精简UI、按钮生命周期优化
// @author       HeYeYe (Supabase优化版)
// @match        https://linux.do/*
// @exclude      https://linux.do/a/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *.supabase.co
// @connect      dvbqtosylralnplteaog.supabase.co
// @run-at       document-end
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/544720/Linuxdo%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544720/Linuxdo%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 性能优化配置 ===
    // 合并容器选择器，减少DOM查询次数
    const OPTIMIZED_CONTAINER_SELECTORS = [
        '.topic-list-item',
        '.latest-topic-list-item',
        '.topic-list tbody tr',
        '.topic-item',
        '.post-item',
        '.topic-row',
        '.search-result',
        '.search-result .topic',
        '.topic-list .topic-list-item',
        '[data-topic-id]'
    ];

    // 简化的容器选择器，用于按钮插入
    const CONTAINER_SELECTOR = '.topic-list-item, .latest-topic-list-item, tr[data-topic-id], .topic-list tbody tr';

    // 添加样式
    GM_addStyle(`
        /* 浮动管理面板 */
        #read-later-container {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 10000;
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* 主管理按钮 */
        #read-later-btn {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            color: white;
            font-size: 20px;
            position: relative;
        }

        #read-later-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        /* 数量徽章 */
        .read-later-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: bold;
            min-width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* 管理面板 */
        #read-later-panel {
            position: absolute;
            right: 60px;
            top: 0;
            width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid #e1e8ed;
            display: none;
            overflow: hidden;
            max-height: 500px;
        }

        #read-later-panel.show {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* 面板头部 */
        .panel-header {
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .panel-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .panel-close:hover {
            background: rgba(255,255,255,0.2);
        }

        /* 列表区域 */
        .read-later-list {
            max-height: 350px;
            overflow-y: auto;
        }

        .list-item {
            padding: 12px 20px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .list-item:hover {
            background: #f8f9fa;
        }

        .list-item:last-child {
            border-bottom: none;
        }

        .item-content {
            flex: 1;
            min-width: 0;
        }

        .item-title {
            font-size: 13px;
            font-weight: 500;
            color: #333;
            margin: 0 0 4px 0;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .item-meta {
            font-size: 11px;
            color: #999;
            margin: 0;
            display: flex;
            gap: 10px;
        }

        .item-actions {
            margin-left: 10px;
            display: flex;
            gap: 5px;
        }

        .action-btn {
            width: 20px;
            height: 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .delete-btn {
            background: #ff4757;
            color: white;
        }

        .delete-btn:hover {
            background: #ff3742;
            transform: scale(1.1);
        }

        /* 空状态 */
        .empty-state {
            padding: 40px 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
        }

        /* 清空按钮 */
        .clear-all-btn {
            padding: 10px 20px;
            background: #ff4757;
            color: white;
            border: none;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
        }

        .clear-all-btn:hover {
            background: #ff3742;
        }

        /* 隐藏按钮 */
        .hide-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #read-later-container:hover .hide-btn {
            display: flex;
        }

        /* 恢复按钮（隐藏状态下） */
        .restore-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .restore-btn:hover {
            transform: scale(1.1);
        }

        /* 拖拽时的样式 */
        .dragging {
            transition: none !important;
            opacity: 0.8;
        }

        /* 滚动条美化 */
        .read-later-list::-webkit-scrollbar {
            width: 6px;
        }

        .read-later-list::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .read-later-list::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .read-later-list::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }

        /* 列表页面的添加按钮样式 - CSS控制显隐 */
        .read-later-add-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-left: 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            vertical-align: middle;
            position: relative;
            z-index: 100;
            /* 默认隐藏 */
            opacity: 0;
            transform: scale(0.8);
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        /* 悬停在标题区域时显示 - 覆盖多种页面布局 */
        .main-link:hover .read-later-add-btn,
        .topic-list-item:hover .main-link .read-later-add-btn,
        .latest-topic-list-item:hover .main-link .read-later-add-btn,
        tr[data-topic-id]:hover .read-later-add-btn,
        .topic-list-body tr:hover .read-later-add-btn,
        .fps-result .topic:hover .read-later-add-btn,
        .user-stream .item:hover .read-later-add-btn {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }

        /* 按钮自身悬停保持显示并放大 */
        .read-later-add-btn:hover {
            background: #5a6fd8;
            opacity: 1 !important;
            transform: scale(1.1) !important;
            pointer-events: auto !important;
        }

        .read-later-add-btn.added {
            background: #4CAF50;
        }

        .read-later-add-btn.added:hover {
            background: #45a049;
        }

        /* 容器悬停时的样式增强 */
        .topic-list-item,
        .latest-topic-list-item,
        .topic-list-body tr,
        .fps-result .topic,
        .user-stream .item {
            transition: background-color 0.2s ease;
        }

        /* 当前帖子页面提示 */
        .current-topic-indicator {
            display: inline-flex;
            align-items: center;
            margin-left: 10px;
            padding: 4px 8px;
            background: #e8f5e8;
            color: #4CAF50;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }

        /* 同步相关样式 */
        .sync-status {
            padding: 8px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            font-size: 11px;
            color: #666;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sync-status.syncing {
            background: #fff3cd;
            color: #856404;
        }

        .sync-status.error {
            background: #f8d7da;
            color: #721c24;
        }

        .sync-status.success {
            background: #d4edda;
            color: #155724;
        }

        .sync-btn {
            background: none;
            border: 1px solid #ccc;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .sync-btn:hover {
            background: #f0f0f0;
        }

        .sync-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 设置面板样式 */
        .settings-panel {
            position: absolute;
            right: 60px;
            top: 0;
            width: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid #e1e8ed;
            display: none;
            overflow: visible; /* 改为 visible 允许下拉菜单溢出 */
            max-height: 600px;
        }

        .settings-panel.show {
            display: block;
            animation: slideIn 0.3s ease;
            overflow: visible; /* 确保显示时也允许溢出 */
        }

        .settings-form {
            padding: 20px;
            overflow: visible; /* 表单容器也允许溢出 */
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            font-weight: 500;
            color: #333;
        }

        .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 13px;
            box-sizing: border-box;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
            min-height: 60px;
            resize: vertical;
            font-family: monospace;
        }

        .form-checkbox {
            margin-right: 8px;
        }

        .form-help {
            font-size: 11px;
            color: #666;
            margin-top: 4px;
            line-height: 1.4;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .btn-primary {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-primary:hover {
            background: #5a6fd8;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-secondary:hover {
            background: #545b62;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        /* 设置按钮 */
        .settings-btn {
            position: absolute;
            top: -8px;
            left: -8px;
            width: 20px;
            height: 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #read-later-container:hover .settings-btn {
            display: flex;
        }

        /* 帖子计数显示 */
        .topic-count-info {
            padding: 10px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            font-size: 12px;
            color: #666;
            text-align: center;
        }

        /* Gist ID 输入组合样式 */
        .gist-input-group {
            position: relative;
            display: flex;
            gap: 5px;
            align-items: stretch;
        }

        .gist-input-group .form-input {
            flex: 1;
            margin: 0;
        }

        .gist-select-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.2s;
            height: 34px;
            min-width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .gist-select-btn:hover {
            background: #5a6fd8;
        }

        .gist-select-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        /* Gist 下拉菜单样式 */
        .gist-dropdown {
            position: absolute;
            top: calc(100% + 4px);  /* 调整距离，更贴近输入框 */
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #667eea;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 99999;
            max-height: 250px;
            overflow-y: auto;
            display: none;
        }

        .gist-dropdown.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* 导出功能样式 */
        .export-section {
            padding: 15px 20px;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }

        .export-title {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .export-options {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }

        .export-format-btn {
            padding: 6px 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            color: #666;
        }

        .export-format-btn:hover {
            border-color: #667eea;
            color: #667eea;
        }

        .export-format-btn.active {
            background: #667eea;
            border-color: #667eea;
            color: white;
        }

        .export-actions {
            display: flex;
            gap: 8px;
        }

        .export-btn {
            flex: 1;
            padding: 8px 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .export-btn:hover {
            background: #218838;
        }

        .export-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .export-copy-btn {
            padding: 8px 12px;
            background: #17a2b8;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .export-copy-btn:hover {
            background: #138496;
        }

        .export-info {
            font-size: 11px;
            color: #666;
            margin-top: 8px;
            line-height: 1.4;
        }

        /* 排序控制样式 */
        .sort-controls {
            padding: 10px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .sort-label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }

        .sort-btn {
            padding: 4px 8px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            color: #666;
        }

        .sort-btn:hover {
            border-color: #667eea;
            color: #667eea;
        }

        .sort-btn.active {
            background: #667eea;
            border-color: #667eea;
            color: white;
        }

        .gist-dropdown-item {
            padding: 10px 12px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
        }

        .gist-dropdown-item:hover {
            background: #f8f9fa;
        }

        .gist-dropdown-item:last-child {
            border-bottom: none;
        }

        .gist-item-id {
            font-family: monospace;
            font-size: 11px;
            color: #666;
            margin-bottom: 2px;
            word-break: break-all;
        }

        .gist-item-desc {
            font-size: 12px;
            color: #333;
            margin-bottom: 2px;
            line-height: 1.3;
        }

        .gist-item-date {
            font-size: 10px;
            color: #999;
        }

        .gist-dropdown-empty,
        .gist-dropdown-loading,
        .gist-dropdown-error {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            line-height: 1.4;
        }

        .gist-dropdown-loading {
            color: #666;
        }

        .gist-dropdown-error {
            color: #ff4757;
        }

        .gist-dropdown-empty {
            color: #999;
        }

        /* Supabase 配置相关样式 */
        .provider-config {
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        .provider-config:not([style*="block"]) {
            display: none;
        }

        .form-input, .form-select {
            box-sizing: border-box;
        }

        /* 设置面板优化 */
        .settings-form {
            max-height: 400px;
            overflow-y: auto;
            padding: 15px;
        }

        .settings-form::-webkit-scrollbar {
            width: 6px;
        }

        .settings-form::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .settings-form::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .settings-form::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }

        /* 固定底部操作栏 */
        .settings-actions-fixed {
            position: sticky;
            bottom: 0;
            background: white;
            padding: 15px;
            border-top: 1px solid #eee;
            margin-top: 10px;
        }

        /* 面板底部按钮组 */
        .panel-bottom-actions {
            display: flex;
            gap: 10px;
            padding: 15px 20px;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }

        .bottom-action-btn {
            flex: 1;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .export-trigger-btn {
            background: #28a745;
            color: white;
        }

        .export-trigger-btn:hover {
            background: #218838;
        }

        .panel-bottom-actions .clear-all-btn {
            background: #ff4757;
            color: white;
            width: auto;
        }

        .panel-bottom-actions .clear-all-btn:hover {
            background: #ff3742;
        }

        /* 导出弹窗样式 */
        .export-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .export-modal {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            width: 320px;
            max-width: 90vw;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .export-modal-header {
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .export-modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .export-modal-close:hover {
            background: rgba(255,255,255,0.2);
        }

        .export-modal-body {
            padding: 20px;
        }

        .export-modal-info {
            font-size: 12px;
            color: #666;
            margin-bottom: 15px;
            text-align: center;
        }

        .export-format-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
        }

        .export-format-option {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .export-format-option:hover {
            border-color: #667eea;
            background: #f8f9ff;
        }

        .export-format-option.selected {
            border-color: #667eea;
            background: #f0f3ff;
        }

        .export-format-option input {
            margin-right: 12px;
        }

        .export-format-label {
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        .export-format-desc {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
        }

        .export-modal-actions {
            display: flex;
            gap: 10px;
        }

        .export-modal-btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .export-download-modal-btn {
            background: #28a745;
            color: white;
        }

        .export-download-modal-btn:hover {
            background: #218838;
        }

        .export-copy-modal-btn {
            background: #17a2b8;
            color: white;
        }

        .export-copy-modal-btn:hover {
            background: #138496;
        }

        /* 帖子详情页按钮样式 */
        .topic-read-later-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-left: 10px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            vertical-align: middle;
            opacity: 0;
            transform: scale(0.8);
        }

        /* 悬停在标题区域时显示按钮 */
        #topic-title:hover .topic-read-later-btn,
        .title-wrapper:hover .topic-read-later-btn,
        .fancy-title:hover .topic-read-later-btn,
        .topic-read-later-btn:hover {
            opacity: 1;
            transform: scale(1);
        }

        .topic-read-later-btn:hover {
            background: #5a6fd8;
            transform: scale(1.1);
        }

        .topic-read-later-btn.added {
            background: #4CAF50;
        }

        .topic-read-later-btn.added:hover {
            background: #45a049;
        }
    `);

    // 全局变量
    let readLaterList = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let selectedExportFormat = 'markdown'; // 默认导出格式
    let lastDataChecksum = ''; // 用于检测数据变化
    let crossTabSyncInterval = null; // 跨标签页同步定时器
    let currentSortMode = 'oldest-first'; // 默认排序模式：从旧到新
    let syncConfig = {
        enabled: false,
        provider: 'gist', // 'gist' | 'supabase'
        // GitHub Gist 配置
        token: '',
        gistId: '',
        // Supabase 配置
        supabaseUrl: '',
        supabaseKey: '',
        supabaseTable: 'read_later_posts',
        userKey: '', // 用于多设备识别的唯一键
        // 通用配置
        lastSync: 0,
        autoSync: true,
        realTimeSync: true, // 实时同步
        syncInterval: 30 * 1000, // 30秒同步间隔
        // 链接打开设置
        openInNewTab: true, // 默认在新标签页打开
        removeAfterOpen: false // 默认打开后不删除
    };

    // 初始化
    function init() {
        loadReadLaterList();
        loadSyncConfig();
        createFloatingButton();

        // 启动跨标签页数据同步
        startCrossTabSync();

        // 启动按钮生命周期绑定模式
        scanAndAddButtons();

        // 检查当前页面是否是帖子详情页，添加详情页按钮
        addTopicPageButton();

        // 执行冷启动同步拉取
        performColdStartSync();

        // 启动自动同步
        startAutoSync();

        // 监听页面变化（SPA路由）
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;

                // 检查当前页面类型
                const pageType = getPageType();
                if (pageType === 'topic') {
                    // 帖子详情页面：添加详情页按钮
                    if (!window.topicPageLogShown || window.lastTopicUrl !== window.location.pathname) {
                        console.log('[稍后再看] 当前在帖子详情页面');
                        window.topicPageLogShown = true;
                        window.lastTopicUrl = window.location.pathname;
                    }
                    // 延迟添加按钮，等待页面加载完成
                    setTimeout(addTopicPageButton, 500);
                    return;
                }

                // 只有非帖子详情页面才输出路由变化日志
                console.log('[稍后再看] 检测到路由变化:', currentUrl);

                // 路由变化时，MutationObserver 会自动处理新容器
                // 无需手动重置或清理
            }
        }, 2000);

        // 页面关闭前清理
        window.addEventListener('beforeunload', () => {
            if (crossTabSyncInterval) {
                clearInterval(crossTabSyncInterval);
            }
        });
    }

    // 加载稍后再看列表
    function loadReadLaterList() {
        const saved = GM_getValue('readLaterList', '[]');
        const savedSortMode = GM_getValue('sortMode', 'oldest-first');
        try {
            readLaterList = JSON.parse(saved);
            currentSortMode = savedSortMode;
            // 计算数据校验和
            lastDataChecksum = calculateChecksum(readLaterList);
            console.log('[稍后再看] 数据加载完成，校验和:', lastDataChecksum.substring(0, 8));
        } catch (e) {
            readLaterList = [];
            lastDataChecksum = '';
        }
    }

    // 计算数据校验和（简单的字符串哈希）
    function calculateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString(36);
    }

    // 启动跨标签页数据同步
    function startCrossTabSync() {
        console.log('[稍后再看] 启动跨标签页数据同步');

        // 定期检查数据是否被其他标签页修改
        crossTabSyncInterval = setInterval(() => {
            checkCrossTabDataChanges();
        }, 1000); // 每秒检查一次
    }

    // 检查跨标签页数据变化
    function checkCrossTabDataChanges() {
        try {
            const saved = GM_getValue('readLaterList', '[]');
            const savedData = JSON.parse(saved);
            const currentChecksum = calculateChecksum(savedData);

            // 如果校验和不同，说明数据被其他标签页修改了
            if (currentChecksum !== lastDataChecksum) {
                console.log('[稍后再看] 检测到其他标签页的数据变化');
                console.log('[稍后再看] 旧校验和:', lastDataChecksum.substring(0, 8));
                console.log('[稍后再看] 新校验和:', currentChecksum.substring(0, 8));

                // 更新本地数据
                const oldCount = readLaterList.length;
                readLaterList = savedData;
                lastDataChecksum = currentChecksum;

                // 更新UI
                updateBadge();
                updateAllButtonStates();

                // 如果管理面板打开，更新内容
                const panel = document.getElementById('read-later-panel');
                if (panel && panel.classList.contains('show')) {
                    updatePanelContent();
                }

                const newCount = readLaterList.length;
                console.log('[稍后再看] 跨标签页同步完成:', oldCount, '→', newCount);

                // 显示提示（可选）
                if (Math.abs(newCount - oldCount) > 0) {
                    showToast(`数据已同步：${newCount} 个帖子`);
                }
            }
        } catch (error) {
            console.error('[稍后再看] 跨标签页数据检查失败:', error);
        }
    }

    // 保存稍后再看列表 - 添加修改时间记录
    function saveReadLaterList() {
        GM_setValue('readLaterList', JSON.stringify(readLaterList));
        GM_setValue('sortMode', currentSortMode); // 保存排序模式

        // 记录本地修改时间
        const now = Date.now();
        GM_setValue('lastLocalModified', now);
        console.log('[稍后再看] 本地数据已保存，修改时间:', new Date(now).toLocaleString());

        // 如果启用了同步，标记需要同步（实时同步模式下不需要）
        if (syncConfig.enabled && syncConfig.autoSync && !(syncConfig.provider === 'supabase' && syncConfig.realTimeSync)) {
            GM_setValue('needSync', 'true');
        }
    }

    // 加载同步配置
    function loadSyncConfig() {
        const saved = GM_getValue('syncConfig', '{}');
        try {
            const savedConfig = JSON.parse(saved);
            syncConfig = { ...syncConfig, ...savedConfig };
        } catch (e) {
            console.error('[稍后再看] 加载同步配置失败:', e);
        }
    }

    // 保存同步配置
    function saveSyncConfig() {
        GM_setValue('syncConfig', JSON.stringify(syncConfig));
    }

    // 按需生成 - 基于事件委托的纯按需模式
    function scanAndAddButtons() {
        console.log(`[稍后再看] 启动按钮生命周期绑定模式...`);

        // 如果已经启动，直接返回
        if (window.readLaterOnDemandStarted) {
            return;
        }

        window.readLaterOnDemandStarted = true;

        // 为已存在的容器创建按钮
        document.querySelectorAll(CONTAINER_SELECTOR).forEach(createButtonForContainer);

        // 启动 MutationObserver 监听新增容器和行复用
        setupButtonObserver();
        console.log(`[稍后再看] 按钮生命周期绑定模式已启动`);
    }

    // 为容器创建按钮
    function createButtonForContainer(container) {
        // 检查是否已有按钮
        if (container.querySelector('.read-later-add-btn')) return null;

        const titleLink = container.querySelector('a.title, .title a, .item-title a');
        if (!titleLink) return null;

        const topicInfo = parseTopicLink(titleLink);
        if (!topicInfo) return null;

        const button = document.createElement('button');
        button.className = 'read-later-add-btn';
        button.dataset.topicId = topicInfo.id;

        // 状态判断
        const isAdded = readLaterList.some(item => item.id === topicInfo.id);
        button.innerHTML = isAdded ? '✓' : '+';
        button.title = isAdded ? '已在稍后再看中' : '添加到稍后再看';
        if (isAdded) button.classList.add('added');

        // 点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleReadLater(topicInfo, button);
        });

        // 插入到标题后
        titleLink.parentNode.insertBefore(button, titleLink.nextSibling);
        return button;
    }

    // 设置 MutationObserver 监听新增容器和行复用
    function setupButtonObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // 处理新增节点
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        // 检查节点本身是否是容器
                        if (node.matches?.(CONTAINER_SELECTOR)) {
                            createButtonForContainer(node);
                        }
                        // 检查子元素中是否有容器
                        node.querySelectorAll?.(CONTAINER_SELECTOR)?.forEach(createButtonForContainer);
                        // Handle content updates inside existing containers.
                        const container = node.closest?.(CONTAINER_SELECTOR);
                        if (container) {
                            createButtonForContainer(container);
                        }
                    }
                }
                // 处理属性变化（行复用）
                else if (mutation.type === 'attributes' &&
                         mutation.attributeName === 'data-topic-id') {
                    handleTopicIdChange(mutation.target);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-topic-id']
        });

        return observer;
    }

    // 处理行复用（data-topic-id 变化）
    function handleTopicIdChange(container) {
        const button = container.querySelector('.read-later-add-btn');
        const newTopicId = container.dataset.topicId;

        if (!button) {
            createButtonForContainer(container);
            return;
        }

        if (button.dataset.topicId === newTopicId) return;

        // 重新获取帖子信息
        const titleLink = container.querySelector('a.title, .title a, .item-title a');
        const topicInfo = titleLink ? parseTopicLink(titleLink) : null;

        if (topicInfo) {
            button.dataset.topicId = topicInfo.id;
            const isAdded = readLaterList.some(item => item.id === topicInfo.id);
            button.innerHTML = isAdded ? '✓' : '+';
            button.title = isAdded ? '已在稍后再看中' : '添加到稍后再看';
            button.classList.toggle('added', isAdded);

            // 更新点击事件的 topicInfo 引用
            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleReadLater(topicInfo, button);
            };
        }
    }

    // 更新所有按钮状态（适配按需加载模式）
    function updateAllButtonStates() {
        const buttons = document.querySelectorAll('.read-later-add-btn');
        console.log(`[稍后再看] 更新 ${buttons.length} 个按钮状态`);

        buttons.forEach(btn => {
            const topicId = btn.dataset.topicId;
            if (topicId) {
                const isAdded = readLaterList.some(item => item.id === topicId);

                if (isAdded && !btn.classList.contains('added')) {
                    btn.classList.add('added');
                    btn.innerHTML = '✓';
                    btn.title = '已在稍后再看中';
                } else if (!isAdded && btn.classList.contains('added')) {
                    btn.classList.remove('added');
                    btn.innerHTML = '+';
                    btn.title = '添加到稍后再看';
                }
            }
        });
    }

    // 解析帖子链接
    function parseTopicLink(link) {
        const href = link.href;
        const title = link.textContent.trim();

        // 匹配 /t/slug/id 格式
        const match = href.match(/\/t\/([^\/]+)\/(\d+)/);
        if (!match) return null;

        const slug = match[1];
        const id = match[2];

        return {
            id: id,
            title: title,
            url: href,
            slug: slug,
            addedAt: Date.now()
        };
    }

    // 切换稍后再看状态
    function toggleReadLater(topicInfo, button) {
        const isAdded = readLaterList.some(item => item.id === topicInfo.id);

        if (isAdded) {
            // 移除
            readLaterList = readLaterList.filter(item => item.id !== topicInfo.id);
            button.classList.remove('added');
            button.innerHTML = '+';
            button.title = '添加到稍后再看';
            showToast('已从稍后再看中移除');
            
            // 实时同步删除操作
            syncItemToSupabase(topicInfo, true);
        } else {
            // 添加
            readLaterList.unshift(topicInfo);
            button.classList.add('added');
            button.innerHTML = '✓';
            button.title = '已在稍后再看中';
            showToast('已添加到稍后再看');
            
            // 实时同步添加操作
            syncItemToSupabase(topicInfo, false);
        }

        saveReadLaterList();
        updateBadge();

        // 如果管理面板打开，更新内容
        const panel = document.getElementById('read-later-panel');
        if (panel && panel.classList.contains('show')) {
            updatePanelContent();
        }
    }

    // 从稍后再看中移除
    function removeFromReadLater(id) {
        // 找到要删除的项目，用于实时同步
        const itemToDelete = readLaterList.find(item => item.id === id);
        
        readLaterList = readLaterList.filter(item => item.id !== id);
        
        // 记录删除操作到删除记录中
        let deletedItems = JSON.parse(GM_getValue('deletedItems', '[]'));
        deletedItems.push({
            id: id,
            deletedAt: new Date().toISOString()
        });
        
        // 保持删除记录在合理大小内（最多保存500个删除记录）
        if (deletedItems.length > 500) {
            deletedItems = deletedItems.slice(-500);
        }
        
        GM_setValue('deletedItems', JSON.stringify(deletedItems));
        saveReadLaterList();
        updateBadge();

        // 更新页面上对应的按钮状态
        const button = document.querySelector(`[data-topic-id="${id}"]`);
        if (button) {
            button.classList.remove('added');
            button.innerHTML = '+';
            button.title = '添加到稍后再看';
        }

        // 实时同步删除操作
        if (itemToDelete) {
            syncItemToSupabase(itemToDelete, true);
        }

        showToast('已从稍后再看中移除');
    }

    // 异步版本的删除函数，确保同步操作完成
    async function removeFromReadLaterAsync(id) {
        // 找到要删除的项目，用于实时同步
        const itemToDelete = readLaterList.find(item => item.id === id);

        readLaterList = readLaterList.filter(item => item.id !== id);

        // 记录删除操作到删除记录中
        let deletedItems = JSON.parse(GM_getValue('deletedItems', '[]'));
        deletedItems.push({
            id: id,
            deletedAt: new Date().toISOString()
        });

        // 保持删除记录在合理大小内（最多保存500个删除记录）
        if (deletedItems.length > 500) {
            deletedItems = deletedItems.slice(-500);
        }

        GM_setValue('deletedItems', JSON.stringify(deletedItems));
        saveReadLaterList();
        updateBadge();

        // 更新页面上对应的按钮状态
        const button = document.querySelector(`[data-topic-id="${id}"]`);
        if (button) {
            button.classList.remove('added');
            button.innerHTML = '+';
            button.title = '添加到稍后再看';
        }

        // 等待实时同步删除操作完成
        if (itemToDelete) {
            try {
                await syncItemToSupabase(itemToDelete, true);
                console.log('[稍后再看] 删除操作同步完成');
            } catch (error) {
                console.error('[稍后再看] 删除操作同步失败:', error);
                // 即使同步失败，也不阻塞后续操作
            }
        }

        showToast('已从稍后再看中移除');
    }

    // 清空列表
    function clearAllReadLater() {
        if (readLaterList.length === 0) return;

        if (confirm('确定要清空所有稍后再看的帖子吗？')) {
            // 记录要清空的项目（用于软删除同步）
            const itemsToDelete = [...readLaterList];

            readLaterList = [];
            saveReadLaterList();
            updateBadge();

            // 更新所有按钮状态
            document.querySelectorAll('.read-later-add-btn.added').forEach(btn => {
                btn.classList.remove('added');
                btn.innerHTML = '+';
                btn.title = '添加到稍后再看';
            });

            updatePanelContent();
            showToast('已清空稍后再看列表');

            // 如果启用了 Supabase 实时同步，需要同步清空操作
            if (syncConfig.enabled && syncConfig.provider === 'supabase' && syncConfig.realTimeSync) {
                console.log('[稍后再看] 执行清空操作的实时同步...');
                syncClearAllToSupabase(itemsToDelete);
            }
        }
    }

    // 显示提示消息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10001;
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                safeRemoveElement(toast);
            }, 300);
        }, 2000);
    }

    // 切换设置面板
    function toggleSettingsPanel() {
        const settingsPanel = document.getElementById('settings-panel');
        const mainPanel = document.getElementById('read-later-panel');

        // 关闭主面板
        closePanel(mainPanel);

        const isShow = settingsPanel.classList.contains('show');
        if (isShow) {
            closePanel(settingsPanel);
        } else {
            updateSettingsPanel();
            settingsPanel.classList.add('show');
        }
    }

    // 关闭面板的统一函数
    function closePanel(panel) {
        if (panel && panel.classList.contains('show')) {
            panel.classList.remove('show');
            // 关闭 Gist 下拉菜单（如果存在）
            const dropdown = document.getElementById('gist-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    }

    // 关闭所有面板的函数
    function closeAllPanels() {
        const mainPanel = document.getElementById('read-later-panel');
        const settingsPanel = document.getElementById('settings-panel');

        closePanel(mainPanel);
        closePanel(settingsPanel);
    }

    // 创建浮动按钮
    function createFloatingButton() {
        // 主容器
        const container = document.createElement('div');
        container.id = 'read-later-container';

        // 主按钮
        const button = document.createElement('button');
        button.id = 'read-later-btn';
        button.innerHTML = '📚';
        button.title = '稍后再看管理';

        // 数量徽章
        const badge = document.createElement('span');
        badge.className = 'read-later-badge';
        badge.textContent = '0';
        button.appendChild(badge);

        // 操作面板
        const panel = document.createElement('div');
        panel.id = 'read-later-panel';

        // 设置面板
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        settingsPanel.id = 'settings-panel';

        // 隐藏按钮
        const hideBtn = document.createElement('button');
        hideBtn.className = 'hide-btn';
        hideBtn.innerHTML = '×';
        hideBtn.title = '隐藏';

        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙';
        settingsBtn.title = '同步设置';

        container.appendChild(button);
        container.appendChild(panel);
        container.appendChild(settingsPanel);
        container.appendChild(hideBtn);
        container.appendChild(settingsBtn);
        document.body.appendChild(container);

        // 创建恢复按钮
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'restore-btn';
        restoreBtn.innerHTML = '📚';
        restoreBtn.title = '显示稍后再看';
        document.body.appendChild(restoreBtn);

        // 绑定事件
        button.addEventListener('click', togglePanel);
        hideBtn.addEventListener('click', hideContainer);
        restoreBtn.addEventListener('click', showContainer);
        settingsBtn.addEventListener('click', toggleSettingsPanel);

        // 拖拽功能
        makeDraggable(container);

        // 初始化UI
        updateBadge();

        // 修复后的点击外部关闭面板逻辑
        document.addEventListener('click', (e) => {
            // 检查点击是否在容器内
            if (!container.contains(e.target)) {
                // 点击在容器外部，关闭所有面板
                closeAllPanels();
            }
        });

        // 阻止容器内的点击冒泡到document
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 更新徽章数量
    function updateBadge() {
        const badge = document.querySelector('.read-later-badge');
        if (badge) {
            const count = readLaterList.length;
            badge.textContent = count > 99 ? '99+' : count.toString();
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // 切换面板显示
    function togglePanel() {
        const panel = document.getElementById('read-later-panel');
        const settingsPanel = document.getElementById('settings-panel');
        const isShow = panel.classList.contains('show');

        // 先关闭设置面板
        closePanel(settingsPanel);

        if (isShow) {
            closePanel(panel);
        } else {
            updatePanelContent();
            panel.classList.add('show');
            // 加载用户的面板大小偏好
            loadPanelSize();
        }
    }

    // 隐藏容器
    function hideContainer() {
        const container = document.getElementById('read-later-container');
        const restoreBtn = document.querySelector('.restore-btn');
        container.style.display = 'none';
        restoreBtn.style.display = 'flex';
    }

    // 显示容器
    function showContainer() {
        const container = document.getElementById('read-later-container');
        const restoreBtn = document.querySelector('.restore-btn');
        container.style.display = 'block';
        restoreBtn.style.display = 'none';
    }

    // 获取排序后的列表
    function getSortedList() {
        const list = [...readLaterList];

        switch (currentSortMode) {
            case 'newest-first':
                return list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
            case 'oldest-first':
                return list.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
            case 'title':
                return list.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
            default:
                return list.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        }
    }

    // 更新面板内容
    function updatePanelContent() {
        const panel = document.getElementById('read-later-panel');
        const currentTopicInfo = getCurrentTopicInfo();
        const sortedList = getSortedList();

        panel.innerHTML = `
            <div class="panel-content">
                <div class="panel-header">
                    <span>稍后再看管理</span>
                    <button class="panel-close">×</button>
                </div>

                ${getSyncStatusHTML()}

                <div class="topic-count-info">
                    共 ${readLaterList.length} 个帖子
                    ${currentTopicInfo ? '<span class="current-topic-indicator">当前帖子已在列表中</span>' : ''}
                </div>

                ${readLaterList.length > 0 ? `
                <div class="sort-controls">
                    <span class="sort-label">排序：</span>
                    <button class="sort-btn ${currentSortMode === 'oldest-first' ? 'active' : ''}" data-sort="oldest-first">从旧到新</button>
                    <button class="sort-btn ${currentSortMode === 'newest-first' ? 'active' : ''}" data-sort="newest-first">从新到旧</button>
                    <button class="sort-btn ${currentSortMode === 'title' ? 'active' : ''}" data-sort="title">按标题</button>
                </div>
                ` : ''}

                <div class="read-later-list">
                    ${readLaterList.length > 0 ?
                sortedList.map(item => `
                            <div class="list-item" data-id="${item.id}">
                                <div class="item-content">
                                    <h5 class="item-title">${item.title}</h5>
                                    <p class="item-meta">
                                        <span>${formatTime(item.addedAt)}</span>
                                        <span>ID: ${item.id}</span>
                                    </p>
                                </div>
                                <div class="item-actions">
                                    <button class="action-btn delete-btn" data-action="delete" data-id="${item.id}">×</button>
                                </div>
                            </div>
                        `).join('')
                : '<div class="empty-state">暂无稍后再看的帖子<br>在帖子列表页面点击 + 按钮添加</div>'
            }
                </div>

                ${readLaterList.length > 0 ? `
                    <div class="panel-bottom-actions">
                        <button class="bottom-action-btn export-trigger-btn" id="export-trigger-btn">📤 导出</button>
                        <button class="bottom-action-btn clear-all-btn">🗑️ 清空</button>
                    </div>
                ` : ''}
            </div>
        `;

        // 设置面板样式，但不强制 display 属性
        const currentStyle = panel.style.cssText;
        panel.style.cssText = `
            position: absolute !important;
            right: 60px !important;
            top: 0 !important;
            width: 450px !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
            border: 1px solid #e1e8ed !important;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            z-index: 10000 !important;
        `;

        // 重新绑定事件
        bindPanelEvents(panel);
    }

    // 加载面板大小偏好
    function loadPanelSize() {
        const savedSize = GM_getValue('panelSize', 'normal');
        const panel = document.getElementById('read-later-panel');
        if (panel) {
            panel.classList.add(`panel-${savedSize}`);
        }
    }

    // 绑定面板事件
    function bindPanelEvents(panel) {
        const closeBtn = panel.querySelector('.panel-close');
        const clearAllBtn = panel.querySelector('.clear-all-btn');
        const listItems = panel.querySelectorAll('.list-item');
        const deleteButtons = panel.querySelectorAll('.delete-btn');
        const syncBtns = panel.querySelectorAll('.sync-btn');
        const exportTriggerBtn = panel.querySelector('#export-trigger-btn');

        // 排序按钮
        const sortBtns = panel.querySelectorAll('.sort-btn');

        // 关闭按钮事件
        closeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePanel(panel);
        });

        clearAllBtn?.addEventListener('click', clearAllReadLater);

        // 导出按钮触发弹窗
        exportTriggerBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            showExportModal();
        });

        // 处理同步按钮点击
        syncBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                if (action === 'sync') {
                    handleSyncAction();
                } else if (action === 'settings') {
                    toggleSettingsPanel();
                }
            });
        });

        // 列表项点击事件
        listItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                if (e.target.closest('.item-actions')) return;
                const id = item.dataset.id;
                const post = readLaterList.find(p => p.id === id);
                if (post) {
                    // 根据设置决定是否先删除（在跳转前）
                    if (syncConfig.removeAfterOpen) {
                        await removeFromReadLaterAsync(id);
                        updatePanelContent();
                    }

                    // 根据设置决定打开方式
                    if (syncConfig.openInNewTab) {
                        window.open(post.url, '_blank');
                    } else {
                        window.location.href = post.url;
                    }
                }
            });
        });

        // 删除按钮事件
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                removeFromReadLater(id);
                updatePanelContent();
            });
        });

        // 排序按钮事件
        sortBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const sortMode = btn.dataset.sort;
                changeSortMode(sortMode);
            });
        });
    }

    // 显示导出弹窗
    function showExportModal() {
        // 移除可能存在的旧弹窗
        const existingModal = document.querySelector('.export-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'export-modal-overlay';
        overlay.innerHTML = `
            <div class="export-modal">
                <div class="export-modal-header">
                    <span>导出数据</span>
                    <button class="export-modal-close">×</button>
                </div>
                <div class="export-modal-body">
                    <div class="export-modal-info">共 ${readLaterList.length} 个帖子</div>
                    <div class="export-format-options">
                        <label class="export-format-option ${selectedExportFormat === 'markdown' ? 'selected' : ''}">
                            <input type="radio" name="export-format" value="markdown" ${selectedExportFormat === 'markdown' ? 'checked' : ''}>
                            <div>
                                <div class="export-format-label">Markdown</div>
                                <div class="export-format-desc">适合笔记软件和博客</div>
                            </div>
                        </label>
                        <label class="export-format-option ${selectedExportFormat === 'html' ? 'selected' : ''}">
                            <input type="radio" name="export-format" value="html" ${selectedExportFormat === 'html' ? 'checked' : ''}>
                            <div>
                                <div class="export-format-label">HTML</div>
                                <div class="export-format-desc">可直接在浏览器中查看</div>
                            </div>
                        </label>
                        <label class="export-format-option ${selectedExportFormat === 'json' ? 'selected' : ''}">
                            <input type="radio" name="export-format" value="json" ${selectedExportFormat === 'json' ? 'checked' : ''}>
                            <div>
                                <div class="export-format-label">JSON</div>
                                <div class="export-format-desc">适合程序处理和备份</div>
                            </div>
                        </label>
                    </div>
                    <div class="export-modal-actions">
                        <button class="export-modal-btn export-download-modal-btn">📥 下载文件</button>
                        <button class="export-modal-btn export-copy-modal-btn">📋 复制内容</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 绑定事件
        const closeBtn = overlay.querySelector('.export-modal-close');
        const formatOptions = overlay.querySelectorAll('.export-format-option');
        const downloadBtn = overlay.querySelector('.export-download-modal-btn');
        const copyBtn = overlay.querySelector('.export-copy-modal-btn');

        // 关闭弹窗
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // 格式选择
        formatOptions.forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                selectedExportFormat = radio.value;

                // 更新选中状态
                formatOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // 下载
        downloadBtn.addEventListener('click', () => {
            exportToFile(selectedExportFormat);
            overlay.remove();
        });

        // 复制
        copyBtn.addEventListener('click', async () => {
            await copyExportContent(selectedExportFormat);
            overlay.remove();
        });
    }

    // 获取同步状态HTML
    function getSyncStatusHTML() {
        if (!syncConfig.enabled) {
            return `
                <div class="sync-status">
                    <span>未启用同步</span>
                    <button class="sync-btn" data-action="settings">设置</button>
                </div>
            `;
        }

        // Supabase 实时同步模式下的状态显示
        if (syncConfig.provider === 'supabase' && syncConfig.realTimeSync) {
            return `
                <div class="sync-status success">
                    <span>实时同步已启用</span>
                    <button class="sync-btn" data-action="sync">手动同步</button>
                </div>
            `;
        }

        // 传统 GitHub Gist 同步模式
        const lastSyncText = syncConfig.lastSync ?
            `上次同步: ${formatTime(new Date(syncConfig.lastSync).toISOString())}` :
            '未同步';

        const needSync = GM_getValue('needSync', 'false') === 'true';
        const statusClass = needSync ? 'error' : 'success';
        const statusText = needSync ? '需要同步' : '已同步';

        return `
            <div class="sync-status ${statusClass}">
                <span>${statusText} • ${lastSyncText}</span>
                <button class="sync-btn" data-action="sync">立即同步</button>
            </div>
        `;
    }

    // 处理同步操作
    async function handleSyncAction() {
        const syncBtn = document.querySelector('.sync-btn[data-action="sync"]');
        if (!syncBtn) return;

        try {
            syncBtn.disabled = true;
            syncBtn.textContent = '同步中...';

            await performSync();

            syncBtn.textContent = '同步成功';
            setTimeout(() => {
                updatePanelContent();
            }, 1000);
        } catch (error) {
            console.error('[稍后再看] 同步失败:', error);
            syncBtn.textContent = '同步失败';
            showToast('同步失败: ' + error.message);
            setTimeout(() => {
                updatePanelContent();
            }, 2000);
        }
    }

    // 检测当前页面类型
    function getPageType() {
        const pathname = window.location.pathname;

        // 帖子详情页面：/t/帖子标题/帖子ID
        if (pathname.match(/^\/t\/[^\/]+\/\d+/)) {
            return 'topic';
        }

        // 其他页面都视为列表页面（包括首页、分类页面、搜索页面等）
        return 'list';
    }

    // 获取当前帖子信息（如果在帖子页面）
    function getCurrentTopicInfo() {
        const topicMatch = window.location.pathname.match(/^\/t\/([^\/]+)\/(\d+)/);
        if (!topicMatch) return null;

        const topicId = topicMatch[2];
        return readLaterList.find(item => item.id === topicId);
    }

    // 在帖子详情页添加稍后再看按钮
    function addTopicPageButton() {
        // 检查是否是帖子详情页
        const pageType = getPageType();
        if (pageType !== 'topic') return;

        // 获取帖子ID和标题
        const topicMatch = window.location.pathname.match(/^\/t\/([^\/]+)\/(\d+)/);
        if (!topicMatch) return;

        const topicSlug = topicMatch[1];
        const topicId = topicMatch[2];

        // 检查是否已经添加了按钮
        if (document.querySelector('.topic-read-later-btn')) {
            // 更新已存在按钮的状态
            updateTopicPageButtonState();
            return;
        }

        // 尝试找到标题元素
        // Discourse 论坛的标题通常在 #topic-title 或 .fancy-title 中
        const titleContainer = document.querySelector('#topic-title') ||
                              document.querySelector('.title-wrapper h1') ||
                              document.querySelector('.fancy-title');

        if (!titleContainer) {
            // 如果找不到标题容器，稍后重试
            console.log('[稍后再看] 未找到标题容器，稍后重试');
            setTimeout(addTopicPageButton, 1000);
            return;
        }

        // 获取帖子标题元素（在创建按钮前获取引用，避免按钮内容干扰）
        const titleElement = titleContainer.querySelector('a') || titleContainer;

        // 检查帖子是否已在列表中
        const isAdded = readLaterList.some(item => item.id === topicId);

        // 创建按钮
        const btn = document.createElement('button');
        btn.className = `topic-read-later-btn ${isAdded ? 'added' : ''}`;
        btn.textContent = isAdded ? '✓' : '+';
        btn.title = isAdded ? '点击从列表中移除' : '添加到稍后再看列表';

        // 绑定点击事件
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 重新获取标题，确保是最新的
            const currentTitle = titleElement.textContent?.trim() || document.title.replace(' - LINUX DO', '').trim();

            const topicInfo = {
                id: topicId,
                title: currentTitle,
                url: window.location.href.split('?')[0], // 移除查询参数
                slug: topicSlug,
                addedAt: new Date().toISOString()
            };

            toggleTopicPageReadLater(topicInfo, btn);
        });

        // 将按钮插入到标题链接后面（而不是替换整个容器内容）
        const titleLink = titleContainer.querySelector('a');
        if (titleLink) {
            titleLink.insertAdjacentElement('afterend', btn);
        } else {
            titleContainer.appendChild(btn);
        }
        console.log('[稍后再看] 已在详情页添加按钮');
    }

    // 更新详情页按钮状态
    function updateTopicPageButtonState() {
        const btn = document.querySelector('.topic-read-later-btn');
        if (!btn) return;

        const topicMatch = window.location.pathname.match(/^\/t\/([^\/]+)\/(\d+)/);
        if (!topicMatch) return;

        const topicId = topicMatch[2];
        const isAdded = readLaterList.some(item => item.id === topicId);

        btn.className = `topic-read-later-btn ${isAdded ? 'added' : ''}`;
        btn.textContent = isAdded ? '✓' : '+';
        btn.title = isAdded ? '点击从列表中移除' : '添加到稍后再看列表';
    }

    // 切换详情页帖子的稍后再看状态
    function toggleTopicPageReadLater(topicInfo, button) {
        const isAdded = readLaterList.some(item => item.id === topicInfo.id);

        if (isAdded) {
            // 移除
            readLaterList = readLaterList.filter(item => item.id !== topicInfo.id);
            button.className = 'topic-read-later-btn';
            button.textContent = '+';
            button.title = '添加到稍后再看列表';
            showToast('已从稍后再看中移除');

            // 实时同步删除操作
            syncItemToSupabase(topicInfo, true);
        } else {
            // 添加
            readLaterList.unshift(topicInfo);
            button.className = 'topic-read-later-btn added';
            button.textContent = '✓';
            button.title = '点击从列表中移除';
            showToast('已添加到稍后再看');

            // 实时同步添加操作
            syncItemToSupabase(topicInfo, false);
        }

        saveReadLaterList();
        updateBadge();

        // 如果管理面板打开，更新内容
        const panel = document.getElementById('read-later-panel');
        if (panel && panel.classList.contains('show')) {
            updatePanelContent();
        }
    }

    // 使元素可拖拽
    function makeDraggable(element) {
        let pos = GM_getValue('buttonPosition', null);
        if (pos) {
            try {
                pos = JSON.parse(pos);
                element.style.top = pos.top;
                element.style.right = pos.right;
                element.style.transform = 'none';
            } catch (e) {
                // 使用默认位置
            }
        }

        element.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target.closest('#read-later-panel') || e.target.closest('.hide-btn') || e.target.closest('.settings-panel')) {
                return;
            }

            isDragging = true;
            element.classList.add('dragging');

            const rect = element.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            // 边界检测
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            const newX = Math.max(0, Math.min(x, maxX));
            const newY = Math.max(0, Math.min(y, maxY));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';
            element.style.transform = 'none';
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            element.classList.remove('dragging');

            // 保存位置
            const style = window.getComputedStyle(element);
            GM_setValue('buttonPosition', JSON.stringify({
                top: style.top,
                right: style.right
            }));
        }
    }

    // 格式化时间
    function formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;

        return date.toLocaleDateString('zh-CN');
    }

    // 切换排序模式
    function changeSortMode(mode) {
        if (currentSortMode === mode) return;

        currentSortMode = mode;
        saveReadLaterList();

        // 重新渲染面板内容
        updatePanelContent();

        // 显示提示
        const modeNames = {
            'oldest-first': '从旧到新',
            'newest-first': '从新到旧',
            'title': '按标题排序'
        };
        showToast(`排序已切换：${modeNames[mode]}`);
    }

    // ===== 导出功能 =====

    // 生成导出内容
    function generateExportContent(format) {
        const timestamp = new Date().toLocaleString('zh-CN');
        const count = readLaterList.length;

        switch (format) {
            case 'markdown':
                return generateMarkdown(timestamp, count);
            case 'html':
                return generateHTML(timestamp, count);
            case 'json':
                return generateJSON(timestamp, count);
            default:
                return '';
        }
    }

    // 生成 Markdown 格式
    function generateMarkdown(timestamp, count) {
        const header = `# Linux.do 稍后再看列表

> 导出时间: ${timestamp}
> 帖子数量: ${count}

---

`;

        const sortedList = getSortedList();
        const content = sortedList.map((item, index) => {
            const addedDate = new Date(item.addedAt).toLocaleDateString('zh-CN');
            return `## ${index + 1}. ${item.title}

- **链接**: [${item.title}](${item.url})
- **帖子ID**: ${item.id}
- **添加时间**: ${addedDate}
- **URL**: \`${item.url}\`

`;
        }).join('');

        const footer = `---

*由 Linux.do 稍后再看脚本导出*`;

        return header + content + footer;
    }

    // 生成 HTML 格式
    function generateHTML(timestamp, count) {
        const header = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linux.do 稍后再看列表</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        .meta { background: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .item { margin-bottom: 25px; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; background: #f8f9fa; }
        .item h3 { margin: 0 0 10px 0; color: #495057; }
        .item a { color: #667eea; text-decoration: none; font-weight: 500; }
        .item a:hover { text-decoration: underline; }
        .details { font-size: 14px; color: #6c757d; margin-top: 10px; }
        .details span { margin-right: 15px; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Linux.do 稍后再看列表</h1>
        <div class="meta">
            <strong>导出时间:</strong> ${timestamp}<br>
            <strong>帖子数量:</strong> ${count}
        </div>
`;

        const sortedList = getSortedList();
        const content = sortedList.map((item, index) => {
            const addedDate = new Date(item.addedAt).toLocaleDateString('zh-CN');
            return `        <div class="item">
            <h3>${index + 1}. <a href="${item.url}" target="_blank">${item.title}</a></h3>
            <div class="details">
                <span><strong>帖子ID:</strong> ${item.id}</span>
                <span><strong>添加时间:</strong> ${addedDate}</span>
            </div>
        </div>
`;
        }).join('');

        const footer = `        <div class="footer">
            <em>由 Linux.do 稍后再看脚本导出</em>
        </div>
    </div>
</body>
</html>`;

        return header + content + footer;
    }

    // 生成 JSON 格式
    function generateJSON(timestamp, count) {
        const exportData = {
            metadata: {
                title: 'Linux.do 稍后再看列表',
                exportTime: timestamp,
                exportTimestamp: Date.now(),
                count: count,
                version: '2.3',
                source: 'Linux.do 稍后再看脚本'
            },
            data: getSortedList().map(item => ({
                id: item.id,
                title: item.title,
                url: item.url,
                slug: item.slug,
                addedAt: item.addedAt,
                addedTimestamp: new Date(item.addedAt).getTime()
            }))
        };

        return JSON.stringify(exportData, null, 2);
    }

    // 导出到文件
    function exportToFile(format) {
        try {
            const content = generateExportContent(format);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

            let filename, mimeType;
            switch (format) {
                case 'markdown':
                    filename = `linux-do-readlater-${timestamp}.md`;
                    mimeType = 'text/markdown';
                    break;
                case 'html':
                    filename = `linux-do-readlater-${timestamp}.html`;
                    mimeType = 'text/html';
                    break;
                case 'json':
                    filename = `linux-do-readlater-${timestamp}.json`;
                    mimeType = 'application/json';
                    break;
                default:
                    throw new Error('不支持的导出格式');
            }

            // 创建下载链接
            const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            // 安全地移除临时元素
            safeRemoveElement(a);

            // 清理 URL
            setTimeout(() => URL.revokeObjectURL(url), 1000);

            showToast(`已导出 ${format.toUpperCase()} 文件: ${filename}`);
        } catch (error) {
            console.error('[稍后再看] 导出文件失败:', error);
            showToast('导出文件失败: ' + error.message);
        }
    }

    // 复制导出内容到剪贴板
    async function copyExportContent(format) {
        try {
            const content = generateExportContent(format);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
                showToast(`已复制 ${format.toUpperCase()} 内容到剪贴板`);
            } else {
                // 降级方案：使用 textarea
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');

                // 安全地移除临时元素
                safeRemoveElement(textarea);
                showToast(`已复制 ${format.toUpperCase()} 内容到剪贴板（兼容模式）`);
            }
        } catch (error) {
            console.error('[稍后再看] 复制内容失败:', error);
            showToast('复制失败: ' + error.message);
        }
    }

    // ===== 同步功能 =====

    // 更新设置面板 - 支持 Supabase 和 GitHub Gist 双模式
    function updateSettingsPanel() {
        const panel = document.getElementById('settings-panel');

        panel.innerHTML = `
            <div class="panel-header">
                <span>同步设置</span>
                <button class="panel-close">×</button>
            </div>

            <div class="settings-form">
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" class="form-checkbox" id="sync-enabled" ${syncConfig.enabled ? 'checked' : ''}>
                        启用跨设备同步
                    </label>
                    <div class="form-help">在不同设备间同步稍后再看列表</div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="sync-provider">同步提供方</label>
                    <select class="form-input" id="sync-provider" ${!syncConfig.enabled ? 'disabled' : ''}>
                        <option value="gist" ${syncConfig.provider === 'gist' ? 'selected' : ''}>GitHub Gist (免费)</option>
                        <option value="supabase" ${syncConfig.provider === 'supabase' ? 'selected' : ''}>Supabase 数据库 (推荐)</option>
                    </select>
                    <div class="form-help">选择数据同步方式</div>
                </div>

                <!-- GitHub Gist 配置 -->
                <div id="gist-config" class="provider-config" style="display: ${syncConfig.provider === 'gist' ? 'block' : 'none'}">
                    <div class="form-group">
                        <label class="form-label" for="github-token">GitHub Token</label>
                        <input type="password" class="form-input" id="github-token" placeholder="ghp_xxxxxxxxxxxx" value="${syncConfig.token}">
                        <div class="form-help">
                            需要创建一个有 gist 权限的 GitHub Token<br>
                            <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank">点击创建 Token</a>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="gist-id">Gist ID</label>
                        <div class="gist-input-group">
                            <input type="text" class="form-input" id="gist-id" placeholder="请输入已存在的 Gist ID 或留空创建新的" value="${syncConfig.gistId}">
                            <button type="button" class="gist-select-btn" id="gist-select-btn">选择</button>
                        </div>
                        <div class="gist-dropdown" id="gist-dropdown"></div>
                        <div class="form-help">
                            <strong style="color: #ff6b6b;">重要：</strong>如果这是第二台设备，请从第一台设备复制 Gist ID 到这里！<br>
                            Gist ID 可以在 GitHub Gist URL 中找到：https://gist.github.com/<strong>YOUR_GIST_ID</strong><br>
                            ${syncConfig.gistId ? `<span style="color: #4CAF50;">当前 Gist ID: ${syncConfig.gistId}</span>` : '<span style="color: #ff9800;">未设置 Gist ID，将创建新的</span>'}
                        </div>
                    </div>
                </div>

                <!-- Supabase 配置 -->
                <div id="supabase-config" class="provider-config" style="display: ${syncConfig.provider === 'supabase' ? 'block' : 'none'}">
                    <div class="form-group">
                        <label class="form-label" for="supabase-url">Supabase URL</label>
                        <input type="text" class="form-input" id="supabase-url" placeholder="https://xxx.supabase.co" value="${syncConfig.supabaseUrl}">
                        <div class="form-help">你的 Supabase 项目 URL</div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="supabase-key">Supabase Anon Key</label>
                        <input type="password" class="form-input" id="supabase-key" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${syncConfig.supabaseKey}">
                        <div class="form-help">项目的匿名/公开密钥</div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="user-key">用户标识</label>
                        <input type="text" class="form-input" id="user-key" placeholder="我的唯一标识" value="${syncConfig.userKey}">
                        <div class="form-help">
                            多设备使用相同标识即可共享数据
                            <details style="margin-top: 8px;">
                                <summary style="cursor: pointer; font-weight: bold; color: #667eea;">📋 表结构说明</summary>
                                <div style="margin-top: 8px; font-size: 10px; line-height: 1.3;">
                                    <strong>数据表名:</strong> read_later_posts（固定）<br>
                                    <strong>必需字段:</strong> user_key(text), post_id(text), title(text), url(text), added_time(bigint), sync_time(bigint), device_info(text), isDeleted(boolean), delete_time(bigint)<br>
                                    <strong>主键:</strong> (user_key, post_id)<br>
                                    <strong>软删除:</strong> isDeleted=true 表示已删除，delete_time 记录删除时间
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" class="form-checkbox" id="auto-sync" ${syncConfig.autoSync ? 'checked' : ''} ${!syncConfig.enabled ? 'disabled' : ''}>
                        自动同步
                    </label>
                    <div class="form-help">定期自动与云端同步数据</div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" class="form-checkbox" id="realtime-sync" ${syncConfig.realTimeSync ? 'checked' : ''} ${!syncConfig.enabled ? 'disabled' : ''}>
                        实时同步
                    </label>
                    <div class="form-help">添加或删除项目时立即同步</div>
                </div>

                <div class="form-group supabase-only" style="${syncConfig.provider !== 'supabase' ? 'display: none;' : ''}">
                    <label class="form-label" for="cleanup-days">清理周期</label>
                    <select class="form-input" id="cleanup-days" ${!syncConfig.enabled ? 'disabled' : ''}>
                        <option value="0" ${GM_getValue('cleanup_days', 7) == 0 ? 'selected' : ''}>无（本设备不清理）</option>
                        <option value="3" ${GM_getValue('cleanup_days', 7) == 3 ? 'selected' : ''}>3天</option>
                        <option value="7" ${GM_getValue('cleanup_days', 7) == 7 ? 'selected' : ''}>7天</option>
                        <option value="15" ${GM_getValue('cleanup_days', 7) == 15 ? 'selected' : ''}>15天</option>
                        <option value="30" ${GM_getValue('cleanup_days', 7) == 30 ? 'selected' : ''}>30天</option>
                    </select>
                    <div class="form-help">定期清理多少天前的已删除记录。建议只在一台主要设备上启用清理，避免多端重复执行</div>
                </div>

                <!-- 链接打开设置 -->
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" class="form-checkbox" id="open-in-new-tab" ${syncConfig.openInNewTab ? 'checked' : ''}>
                        在新标签页打开链接
                    </label>
                    <div class="form-help">选择点击帖子时在新标签页还是当前页面打开</div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" class="form-checkbox" id="remove-after-open" ${syncConfig.removeAfterOpen ? 'checked' : ''}>
                        打开后从列表中删除
                    </label>
                    <div class="form-help">点击打开帖子后是否自动从稍后再看列表中删除该帖子</div>
                </div>

                <div id="sync-test-result" style="margin-top: 15px; font-size: 12px;"></div>
            </div>

            <div class="settings-actions-fixed">
                <div class="form-actions">
                    <button class="btn-primary" id="save-settings">保存设置</button>
                    <button class="btn-secondary" id="test-sync" ${!syncConfig.enabled ? 'disabled' : ''}>测试连接</button>
                    <button class="btn-danger" id="reset-sync">重置同步</button>
                </div>
            </div>
        `;

        // 绑定事件
        const closeBtn = panel.querySelector('.panel-close');
        const saveBtn = panel.querySelector('#save-settings');
        const testBtn = panel.querySelector('#test-sync');
        const resetBtn = panel.querySelector('#reset-sync');
        const gistSelectBtn = panel.querySelector('#gist-select-btn');
        const providerSelect = panel.querySelector('#sync-provider');
        const syncEnabledBox = panel.querySelector('#sync-enabled');

        closeBtn.addEventListener('click', () => closePanel(panel));
        saveBtn.addEventListener('click', saveSettings);
        testBtn.addEventListener('click', testSync);
        resetBtn.addEventListener('click', resetSync);
        gistSelectBtn.addEventListener('click', toggleGistDropdown);
        
        // 提供方切换事件
        providerSelect.addEventListener('change', () => {
            toggleProviderConfig();
        });
        
        // 同步启用/禁用事件
        syncEnabledBox.addEventListener('change', () => {
            toggleSyncControls();
        });
    }

    // 切换提供方配置显示
    function toggleProviderConfig() {
        const providerSelect = document.getElementById('sync-provider');
        const gistConfig = document.getElementById('gist-config');
        const supabaseConfig = document.getElementById('supabase-config');
        const supabaseOnlyElements = document.querySelectorAll('.supabase-only');

        const provider = providerSelect.value;
        gistConfig.style.display = provider === 'gist' ? 'block' : 'none';
        supabaseConfig.style.display = provider === 'supabase' ? 'block' : 'none';

        // 控制 Supabase 专有设置的显示
        supabaseOnlyElements.forEach(element => {
            element.style.display = provider === 'supabase' ? 'block' : 'none';
        });
    }
    
    // 切换同步控件启用状态
    function toggleSyncControls() {
        const enabled = document.getElementById('sync-enabled').checked;
        const controls = [
            'sync-provider', 'auto-sync', 'realtime-sync', 'test-sync', 'cleanup-days'
        ];

        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = !enabled;
            }
        });
    }

    // 切换 Gist 下拉菜单
    async function toggleGistDropdown() {
        const dropdown = document.getElementById('gist-dropdown');
        const selectBtn = document.getElementById('gist-select-btn');
        const tokenInput = document.getElementById('github-token');

        const token = tokenInput.value.trim();
        if (!token) {
            showToast('请先填入 GitHub Token');
            return;
        }

        const isShow = dropdown.classList.contains('show');
        if (isShow) {
            dropdown.classList.remove('show');
            return;
        }

        // 显示加载状态
        console.log('[稍后再看] 开始加载 Gist 列表');
        dropdown.innerHTML = '<div class="gist-dropdown-loading">正在加载 Gist 列表...</div>';
        dropdown.classList.add('show');

        // 强制显示下拉菜单
        dropdown.style.display = 'block';
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';

        selectBtn.disabled = true;
        selectBtn.textContent = '加载中...';

        try {
            const gists = await fetchUserGists(token);
            console.log('[稍后再看] 获取到 Gist 列表:', gists.length, '个');
            displayGistDropdown(gists);
        } catch (error) {
            console.error('[稍后再看] 获取 Gist 列表失败:', error);
            dropdown.innerHTML = `<div class="gist-dropdown-error">加载失败: ${error.message}<br><small>请检查 Token 是否正确</small></div>`;

            // 显示错误 5 秒后自动关闭
            setTimeout(() => {
                dropdown.classList.remove('show');
                dropdown.style.display = '';
                dropdown.style.visibility = '';
                dropdown.style.opacity = '';
            }, 5000);
        } finally {
            selectBtn.disabled = false;
            selectBtn.textContent = '选择';
        }
    }

    // 获取用户的 Gist 列表
    async function fetchUserGists(token) {
        try {
            const response = await fetch('https://api.github.com/gists?per_page=50', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[稍后再看] GitHub API 错误响应:', errorText);

                if (response.status === 401) {
                    throw new Error('GitHub Token 无效或已过期');
                } else if (response.status === 403) {
                    throw new Error('GitHub Token 权限不足，需要 gist 权限');
                } else {
                    throw new Error(`GitHub API 错误: ${response.status}`);
                }
            }

            const allGists = await response.json();
            console.log('[稍后再看] 获取到所有 Gist:', allGists.length, '个');

            // 筛选出稍后再看相关的 Gist
            const readLaterGists = allGists.filter(gist => {
                const hasReadLaterFile = gist.files && gist.files['readlater.json'];
                const hasReadLaterDesc = gist.description && (
                    gist.description.includes('稍后再看') ||
                    gist.description.includes('Linux.do')
                );
                return hasReadLaterFile || hasReadLaterDesc;
            });

            console.log('[稍后再看] 筛选后的相关 Gist:', readLaterGists.length, '个');

            return readLaterGists;
        } catch (error) {
            console.error('[稍后再看] fetchUserGists 错误:', error);
            throw error;
        }
    }

    // 显示 Gist 下拉菜单
    function displayGistDropdown(gists) {
        const dropdown = document.getElementById('gist-dropdown');
        console.log('[稍后再看] 显示下拉菜单，Gist 数量:', gists.length);

        if (gists.length === 0) {
            dropdown.innerHTML = `
                <div class="gist-dropdown-empty">
                    未找到稍后再看相关的 Gist<br>
                    <small>保存设置时将自动创建新的</small><br>
                    <button class="btn-secondary" style="margin-top: 8px; font-size: 11px; padding: 4px 8px;" onclick="document.getElementById('gist-dropdown').classList.remove('show')">关闭</button>
                </div>
            `;
            return;
        }

        const gistItems = gists.map(gist => {
            const createDate = new Date(gist.created_at).toLocaleDateString('zh-CN');
            const description = gist.description || '无描述';
            const truncatedDesc = description.length > 50 ? description.substring(0, 50) + '...' : description;

            return `
                <div class="gist-dropdown-item" data-gist-id="${gist.id}" title="点击选择此 Gist">
                    <div class="gist-item-id">${gist.id}</div>
                    <div class="gist-item-desc">${truncatedDesc}</div>
                    <div class="gist-item-date">创建于 ${createDate}</div>
                </div>
            `;
        }).join('');

        dropdown.innerHTML = gistItems;

        // 确保下拉菜单可见
        dropdown.classList.add('show');
        dropdown.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: absolute !important;
            z-index: 99999 !important;
            background: white !important;
            border: 2px solid #667eea !important;
            border-radius: 6px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
            max-height: 250px !important;
            overflow-y: auto !important;
            top: calc(100% + 2px) !important;
            left: 0 !important;
            right: 0 !important;
        `;

        // 绑定点击事件
        dropdown.querySelectorAll('.gist-dropdown-item').forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[稍后再看] 选择 Gist:', item.dataset.gistId);
                const gistId = item.dataset.gistId;
                const gistInput = document.getElementById('gist-id');
                gistInput.value = gistId;

                // 关闭下拉菜单
                dropdown.classList.remove('show');
                dropdown.style.cssText = '';

                showToast(`已选择 Gist: ${gistId.substring(0, 8)}...`);
            });
        });
    }

    // 保存设置
    function saveSettings() {
        const enabled = document.getElementById('sync-enabled').checked;
        const provider = document.getElementById('sync-provider').value;
        const autoSync = document.getElementById('auto-sync').checked;
        const realTimeSync = document.getElementById('realtime-sync').checked;

        if (!enabled) {
            syncConfig.enabled = false;
            saveSyncConfig();
            showToast('同步已禁用');
            closeAllPanels();
            return;
        }

        // GitHub Gist 配置验证
        if (provider === 'gist') {
            const token = document.getElementById('github-token').value.trim();
            const gistId = document.getElementById('gist-id').value.trim();

            if (!token) {
                alert('请填入 GitHub Token');
                return;
            }

            // 验证 Gist ID 格式（如果填写了的话）
            if (gistId && !/^[a-f0-9]{32}$/.test(gistId)) {
                alert('Gist ID 格式不正确，应该是32位的十六进制字符串');
                return;
            }

            syncConfig.token = token;
            syncConfig.gistId = gistId;
        }
        
        // Supabase 配置验证
        else if (provider === 'supabase') {
            const supabaseUrl = document.getElementById('supabase-url').value.trim();
            const supabaseKey = document.getElementById('supabase-key').value.trim();
            const supabaseTable = 'read_later_posts'; // 固定表名
            const userKey = document.getElementById('user-key').value.trim();

            if (!supabaseUrl || !supabaseKey || !userKey) {
                alert('请填写完整的 Supabase 配置信息');
                return;
            }

            // URL 格式验证
            if (!supabaseUrl.match(/^https:\/\/.*\.supabase\.co$/)) {
                alert('Supabase URL 格式不正确，应该是 https://xxx.supabase.co');
                return;
            }

            syncConfig.supabaseUrl = supabaseUrl;
            syncConfig.supabaseKey = supabaseKey;
            syncConfig.supabaseTable = supabaseTable;
            syncConfig.userKey = userKey;
        }

        syncConfig.enabled = enabled;
        syncConfig.provider = provider;
        syncConfig.autoSync = autoSync;
        syncConfig.realTimeSync = realTimeSync;

        // 保存清理周期设置（仅对 Supabase 有效）
        if (provider === 'supabase') {
            const cleanupDaysElement = document.getElementById('cleanup-days');
            if (cleanupDaysElement) {
                const cleanupDays = parseInt(cleanupDaysElement.value);
                GM_setValue('cleanup_days', cleanupDays);
                console.log(`[稍后再看] 清理周期设置已保存: ${cleanupDays}天`);
            }
        }

        // 保存链接打开设置
        const openInNewTab = document.getElementById('open-in-new-tab').checked;
        const removeAfterOpen = document.getElementById('remove-after-open').checked;
        syncConfig.openInNewTab = openInNewTab;
        syncConfig.removeAfterOpen = removeAfterOpen;

        saveSyncConfig();
        showToast('设置已保存');

        // 重启自动同步
        startAutoSync();

        // 关闭面板和下拉菜单
        closeAllPanels();
    }

    // 测试同步连接
    async function testSync() {
        const resultDiv = document.getElementById('sync-test-result');
        const testBtn = document.getElementById('test-sync');
        const provider = document.getElementById('sync-provider').value;

        try {
            testBtn.disabled = true;
            testBtn.textContent = '测试中...';
            resultDiv.innerHTML = '<span style="color: blue;">正在测试连接...</span>';

            if (provider === 'gist') {
                await testGitHubConnection(resultDiv);
            } else if (provider === 'supabase') {
                await testSupabaseConnection(resultDiv);
            }
        } catch (error) {
            console.error('[稍后再看] 测试同步失败:', error);
            resultDiv.innerHTML = `<span style="color: red;">✗ 连接失败: ${error.message}</span>`;
        } finally {
            testBtn.disabled = false;
            testBtn.textContent = '测试连接';
        }
    }

    // 测试 GitHub 连接
    async function testGitHubConnection(resultDiv) {
        const token = document.getElementById('github-token').value.trim();
        if (!token) {
            resultDiv.innerHTML = '<span style="color: red;">请先填入 GitHub Token</span>';
            return;
        }

        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const user = await response.json();
            resultDiv.innerHTML = `<span style="color: green;">✓ GitHub 连接成功！用户: ${user.login}</span>`;
        } else {
            throw new Error(`GitHub API 错误: ${response.status}`);
        }
    }

    // 测试 Supabase 连接
    async function testSupabaseConnection(resultDiv) {
        const supabaseUrl = document.getElementById('supabase-url').value.trim();
        const supabaseKey = document.getElementById('supabase-key').value.trim();
        const supabaseTable = 'read_later_posts'; // 固定表名

        if (!supabaseUrl || !supabaseKey) {
            resultDiv.innerHTML = '<span style="color: red;">请填写完整的 Supabase 配置</span>';
            return;
        }

        // 使用 GM_xmlhttpRequest 避免跨域问题
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${supabaseUrl}/rest/v1/${supabaseTable}?limit=1`,
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                onload: resolve,
                onerror: reject
            });
        });

        if (response.status >= 200 && response.status < 300) {
            resultDiv.innerHTML = '<span style="color: green;">✓ Supabase 连接成功！</span>';
        } else {
            throw new Error(`Supabase 错误: ${response.status} ${response.statusText}`);
        }
    }

    // 重置同步
    function resetSync() {
        if (confirm('确定要重置所有同步设置吗？这将清除所有同步配置，但不会删除本地数据。')) {
            syncConfig = {
                enabled: false,
                provider: 'gist',
                // GitHub Gist 配置
                token: '',
                gistId: '',
                // Supabase 配置
                supabaseUrl: '',
                supabaseKey: '',
                supabaseTable: 'read_later_posts',
                userKey: '',
                // 通用配置
                lastSync: 0,
                autoSync: true,
                realTimeSync: true,
                syncInterval: 30 * 1000,
                // 链接打开设置
                openInNewTab: true,
                removeAfterOpen: false
            };
            saveSyncConfig();
            GM_setValue('needSync', 'false');
            showToast('同步设置已重置');
            updateSettingsPanel();
        }
    }

    // 执行同步 - 支持 Supabase 和 GitHub Gist
    async function performSync() {
        if (!syncConfig.enabled) {
            throw new Error('同步未启用');
        }

        // 分发到不同的同步提供方
        if (syncConfig.provider === 'supabase') {
            return await performSupabaseSync();
        } else {
            return await performGistSync();
        }
    }

    // GitHub Gist 同步
    async function performGistSync() {
        if (!syncConfig.token) {
            throw new Error('缺少 GitHub Token');
        }

        console.log('[稍后再看] 开始同步...');

        try {
            // 如果没有 Gist ID，先尝试查找现有的 Gist
            if (!syncConfig.gistId) {
                const existingGist = await findExistingGist();
                if (existingGist) {
                    syncConfig.gistId = existingGist.id;
                    saveSyncConfig();
                    console.log('[稍后再看] 找到现有 Gist:', existingGist.id);
                    showToast(`找到现有 Gist: ${existingGist.id.substring(0, 8)}...`);
                } else {
                    await createGist();
                    showToast('创建了新的同步 Gist');
                }
            }

            // 先记录获取远程数据的时间点（在获取前）
            const remoteDataFetchTime = Date.now();
            
            // 获取远程数据
            const remoteResult = await getRemoteData();
            const remoteData = remoteResult.data || remoteResult; // 兼容新旧格式

            // 合并数据
            const mergedData = mergeData(readLaterList, remoteData);

            // 检查是否有变化
            const hasChanges = JSON.stringify(mergedData) !== JSON.stringify(readLaterList);
            let needsUpload = false;

            if (hasChanges) {
                console.log('[稍后再看] 检测到数据变化，更新本地数据');
                readLaterList = mergedData;
                // 不调用 saveReadLaterList()，避免更新修改时间
                GM_setValue('readLaterList', JSON.stringify(readLaterList));
                updateBadge();
                needsUpload = true;

                // 更新页面上的按钮状态
                setTimeout(updateAllButtonStates, 100);
            }

            // 检查是否需要上传（有本地变化或远程数据较旧时才上传）
            const hasLocalChanges = GM_getValue('needSync', 'false') === 'true';
            if (needsUpload || hasLocalChanges) {
                console.log('[稍后再看] 上传数据到远程（原因: 有变化=' + needsUpload + ', 有本地更改=' + hasLocalChanges + '）');
                await uploadData(readLaterList);
            } else {
                console.log('[稍后再看] 无需上传，远程数据已是最新');
            }

            // 更新同步状态
            syncConfig.lastSync = Date.now();
            saveSyncConfig();
            GM_setValue('needSync', 'false');

            // 仅在成功获取远程数据后才更新 lastRemoteSync 时间戳
            // 使用获取数据时的时间点，而不是同步完成的时间点
            GM_setValue('lastRemoteSync', remoteDataFetchTime);

            console.log('[稍后再看] 同步完成');
            return true;
        } catch (error) {
            console.error('[稍后再看] 同步失败:', error);
            throw error;
        }
    }

    // 查找现有的稍后再看 Gist
    async function findExistingGist() {
        try {
            const response = await fetch('https://api.github.com/gists', {
                headers: {
                    'Authorization': `token ${syncConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                return null;
            }

            const gists = await response.json();
            const readLaterGist = gists.find(gist =>
                gist.files['readlater.json'] && (
                    gist.description?.includes('稍后再看') ||
                    gist.description?.includes('Linux.do')
                )
            );

            return readLaterGist || null;
        } catch (error) {
            console.error('[稍后再看] 查找现有 Gist 失败:', error);
            return null;
        }
    }

    // 创建新的 Gist
    async function createGist() {
        try {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${syncConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: `Linux.do 稍后再看数据 - 创建于 ${new Date().toLocaleString()} - 设备: ${navigator.platform}`,
                    public: false,
                    files: {
                        'readlater.json': {
                            content: JSON.stringify({
                                version: '1.0',
                                data: readLaterList,
                                lastModified: Date.now(),
                                device: navigator.userAgent,
                                createdAt: new Date().toISOString()
                            }, null, 2)
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`创建 Gist 失败: ${response.status}`);
            }

            const gist = await response.json();
            syncConfig.gistId = gist.id;
            saveSyncConfig();

            // 更新 README
            try {
                await fetch(`https://api.github.com/gists/${gist.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${syncConfig.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        files: {
                            'README.md': {
                                content: `# Linux.do 稍后再看数据

这个 Gist 存储了您在 Linux.do 论坛的稍后再看列表。

**重要提示：**
- 如果您要在多个设备间同步，请将此 Gist ID 复制到其他设备的设置中
- **Gist ID: \`${gist.id}\`**
- 请勿手动修改 readlater.json 文件内容

创建时间: ${new Date().toLocaleString()}
设备信息: ${navigator.platform}

## 如何在其他设备使用

1. 在其他设备安装相同的脚本
2. 打开同步设置
3. 填入相同的 GitHub Token
4. 在 "Gist ID" 字段填入: \`${gist.id}\`
5. 保存设置即可开始同步
`
                            }
                        }
                    })
                });
            } catch (error) {
                console.error('[稍后再看] 更新 README 失败:', error);
            }

        } catch (error) {
            console.error('[稍后再看] 创建 Gist 失败:', error);
            throw error;
        }
    }

    // 获取远程数据
    async function getRemoteData() {
        const response = await fetch(`https://api.github.com/gists/${syncConfig.gistId}`, {
            headers: {
                'Authorization': `token ${syncConfig.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log('[稍后再看] Gist 不存在，将创建新的');
                syncConfig.gistId = '';
                saveSyncConfig();
                return { data: [], deletedItems: [] };
            }
            throw new Error(`获取远程数据失败: ${response.status}`);
        }

        const gist = await response.json();
        const fileContent = gist.files['readlater.json']?.content;

        if (!fileContent) {
            return { data: [], deletedItems: [] };
        }

        try {
            const parsedData = JSON.parse(fileContent);
            
            // 兼容旧版本数据格式
            if (parsedData.version === '1.1') {
                // 新版本包含删除记录
                const remoteDeletedItems = parsedData.deletedItems || [];
                // 合并远程删除记录到本地
                const localDeletedItems = JSON.parse(GM_getValue('deletedItems', '[]'));
                const mergedDeletedItems = [...localDeletedItems];
                
                remoteDeletedItems.forEach(remoteDeleted => {
                    if (!localDeletedItems.some(local => local.id === remoteDeleted.id)) {
                        mergedDeletedItems.push(remoteDeleted);
                    }
                });
                
                GM_setValue('deletedItems', JSON.stringify(mergedDeletedItems));
                console.log('[稍后再看] 合并删除记录:', mergedDeletedItems.length, '项');
                
                return { data: parsedData.data || [], deletedItems: mergedDeletedItems };
            } else {
                // 旧版本只有数据
                return { data: parsedData.data || parsedData || [], deletedItems: [] };
            }
        } catch (error) {
            console.error('[稍后再看] 解析远程数据失败:', error);
            return { data: [], deletedItems: [] };
        }
    }

    // 上传数据到远程 - 包含时间戳
    async function uploadData(data) {
        const now = Date.now();
        const deletedItems = JSON.parse(GM_getValue('deletedItems', '[]'));
        
        const response = await fetch(`https://api.github.com/gists/${syncConfig.gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${syncConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'readlater.json': {
                        content: JSON.stringify({
                            version: '1.1',
                            data: data,
                            deletedItems: deletedItems,
                            lastModified: now,
                            device: navigator.userAgent,
                            count: data.length,
                            uploadTime: new Date(now).toISOString()
                        }, null, 2)
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`上传数据失败: ${response.status}`);
        }

        console.log('[稍后再看] 数据已上传到远程，时间:', new Date(now).toLocaleString());
    }

    // 合并本地和远程数据 - 修复删除同步问题的智能合并
    function mergeData(localData, remoteData) {
        // 获取本地和远程的最后修改时间
        const localLastModified = GM_getValue('lastLocalModified', 0);
        const remoteLastModified = GM_getValue('lastRemoteSync', 0);
        
        // 获取本地删除记录
        const deletedItems = JSON.parse(GM_getValue('deletedItems', '[]'));
        const deletedIds = new Set(deletedItems.map(item => item.id));
        
        console.log('[稍后再看] 合并数据 - 本地修改时间:', new Date(localLastModified).toLocaleString());
        console.log('[稍后再看] 合并数据 - 远程同步时间:', new Date(remoteLastModified).toLocaleString());
        console.log('[稍后再看] 本地数据:', localData.length, '项');
        console.log('[稍后再看] 远程数据:', remoteData.length, '项');
        console.log('[稍后再看] 本地删除记录:', deletedItems.length, '项');

        // 创建ID集合和映射用于快速查找
        const localIds = new Set(localData.map(item => item.id));
        const remoteIds = new Set(remoteData.map(item => item.id));
        const localMap = new Map(localData.map(item => [item.id, item]));
        const remoteMap = new Map(remoteData.map(item => [item.id, item]));
        const mergedMap = new Map();
        
        // 处理两边都存在的数据（选择较新的版本）
        localData.forEach(localItem => {
            if (remoteIds.has(localItem.id) && !deletedIds.has(localItem.id)) {
                const remoteItem = remoteMap.get(localItem.id);
                const localTime = new Date(localItem.addedAt).getTime();
                const remoteTime = new Date(remoteItem.addedAt).getTime();
                
                // 选择添加时间较新的版本，时间相同则保持本地版本
                const selectedItem = localTime >= remoteTime ? localItem : remoteItem;
                mergedMap.set(localItem.id, { ...selectedItem, source: 'both' });
            }
        });
        
        // 处理只在本地存在的数据
        localData.forEach(localItem => {
            if (!remoteIds.has(localItem.id) && !deletedIds.has(localItem.id)) {
                console.log('[稍后再看] 保留本地专有项:', localItem.title);
                mergedMap.set(localItem.id, { ...localItem, source: 'local_only' });
            }
        });
        
        // 处理只在远程存在的数据 - 检查是否被本地删除
        remoteData.forEach(remoteItem => {
            if (!localIds.has(remoteItem.id)) {
                // 检查这个项目是否在本地删除记录中
                if (deletedIds.has(remoteItem.id)) {
                    console.log('[稍后再看] 跳过已删除项目:', remoteItem.title);
                    return; // 不添加到合并结果中
                }
                
                // 如果不在删除记录中，则认为是远程新增项
                console.log('[稍后再看] 保留远程新增项:', remoteItem.title);
                mergedMap.set(remoteItem.id, { ...remoteItem, source: 'remote_new' });
            }
        });

        // 转换为数组并按添加时间排序
        const merged = Array.from(mergedMap.values()).map(item => {
            // 移除临时的 source 属性
            const { source, ...cleanItem } = item;
            return cleanItem;
        });

        merged.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

        console.log('[稍后再看] 合并完成，最终数据:', merged.length, '项');
        console.log('[稍后再看] 合并详情 - 本地:', localData.length, '远程:', remoteData.length, '→ 合并后:', merged.length);

        return merged;
    }

    // 冷启动同步拉取 - 优化版
    async function performColdStartSync() {
        // 检查是否启用同步
        if (!syncConfig.enabled) {
            console.log('[稍后再看] 同步未启用，跳过冷启动拉取');
            return;
        }

        // 检查是否为真正的冷启动（页面首次加载且距离上次同步超过2分钟）
        const lastRemoteSync = GM_getValue('lastRemoteSync', 0);
        const sessionStart = GM_getValue('sessionStart', 0);
        const now = Date.now();
        const timeSinceLastSync = now - lastRemoteSync;
        const isNewSession = now - sessionStart > 30 * 60 * 1000; // 30分钟算新会话
        
        // 记录当前会话开始时间
        GM_setValue('sessionStart', now);
        
        const shouldPerformColdStart = (timeSinceLastSync > 2 * 60 * 1000) && isNewSession; // 2分钟 + 新会话

        if (!shouldPerformColdStart) {
            console.log('[稍后再看] 非冷启动场景或距离上次同步时间较短，跳过拉取');
            return;
        }

        console.log('[稍后再看] 执行冷启动同步拉取（仅拉取，不覆盖本地修改）...');

        try {
            if (syncConfig.provider === 'supabase') {
                await performSupabaseSync(true); // 传入冷启动标记
                console.log('[稍后再看] 冷启动 Supabase 同步拉取完成');
            } else if (syncConfig.provider === 'github') {
                await performGitHubSync();
                console.log('[稍后再看] 冷启动 GitHub 同步拉取完成');
            }
        } catch (error) {
            console.error('[稍后再看] 冷启动同步拉取失败:', error);
        }
    }

    // 启动自动同步
    function startAutoSync() {
        // 清除现有的定时器
        if (window.readLaterSyncInterval) {
            clearInterval(window.readLaterSyncInterval);
        }

        if (!syncConfig.enabled || !syncConfig.autoSync) {
            return;
        }

        // 设置定时同步 - 优化版：优先处理本地修改，智能主动拉取
        window.readLaterSyncInterval = setInterval(async () => {
            const needSync = GM_getValue('needSync', 'false') === 'true';
            const lastRemoteSync = GM_getValue('lastRemoteSync', 0);
            const timeSinceLastSync = Date.now() - lastRemoteSync;
            const shouldPeriodicSync = timeSinceLastSync > 3 * 60 * 1000; // 3分钟定期拉取（避免与冷启动冲突）

            if (needSync) {
                // 优先处理本地修改
                try {
                    await performSync();
                    console.log('[稍后再看] 自动同步完成（本地修改触发）');
                } catch (error) {
                    console.error('[稍后再看] 本地修改同步失败:', error);
                }
            } else if (shouldPeriodicSync) {
                // 只在没有本地修改时进行主动拉取
                try {
                    await performSync(false, true); // 标记为定期同步
                    console.log('[稍后再看] 定期同步完成（主动拉取）');

                    // 执行定期清理检查
                    checkAndRunCleanup();
                } catch (error) {
                    console.error('[稍后再看] 定期同步失败:', error);
                }
            }
        }, syncConfig.syncInterval);

        console.log('[稍后再看] 增强版自动同步已启动，间隔:', syncConfig.syncInterval / 1000, '秒，包含定期主动拉取功能');
    }

    // ===== Supabase 同步功能 =====

    // Supabase 同步主函数 - 增强版
    async function performSupabaseSync(isColdStart = false, isPeriodicSync = false) {
        const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
        
        if (!supabaseUrl || !supabaseKey || !userKey) {
            throw new Error('Supabase 配置不完整');
        }

        const syncType = isColdStart ? '冷启动' : (isPeriodicSync ? '定期' : '普通');
        console.log(`[稍后再看] 开始 Supabase ${syncType}同步...`);
        
        try {
            const remoteDataFetchTime = Date.now();
            const remoteData = await getSupabaseData();
            
            // 检查本地是否有未同步的修改
            const lastLocalModified = GM_getValue('lastLocalModified', 0);
            const lastRemoteSync = GM_getValue('lastRemoteSync', 0);
            const hasLocalChanges = lastLocalModified > lastRemoteSync;
            
            let mergedData;
            if (isColdStart && hasLocalChanges) {
                // 冷启动且有本地修改：保守合并，本地优先
                console.log('[稍后再看] 冷启动检测到本地修改，采用保守合并策略');
                mergedData = mergeSupabaseDataConservative(readLaterList, remoteData);
            } else {
                // 正常合并
                mergedData = mergeSupabaseData(readLaterList, remoteData);
            }
            
            // 检查是否需要上传
            const needUpload = JSON.stringify(mergedData) !== JSON.stringify(readLaterList) || 
                              (remoteData.length === 0 && readLaterList.length > 0) ||
                              hasLocalChanges;
            
            if (needUpload) {
                console.log('[稍后再看] 检测到数据变化或首次同步，开始上传...');
                await uploadSupabaseData(mergedData);
                
                // 更新本地数据
                if (JSON.stringify(mergedData) !== JSON.stringify(readLaterList)) {
                    readLaterList = mergedData;
                    saveReadLaterList();
                    updatePanelContent();
                }
            } else {
                console.log('[稍后再看] 数据已同步，无需上传');
            }
            
            // 更新同步状态
            syncConfig.lastSync = Date.now();
            saveSyncConfig();
            GM_setValue('needSync', 'false');
            GM_setValue('lastRemoteSync', remoteDataFetchTime);
            
            console.log('[稍后再看] Supabase 同步完成');
            return true;
        } catch (error) {
            console.error('[稍后再看] Supabase 同步失败:', error);
            throw error;
        }
    }

    // 获取 Supabase 远程数据
    async function getSupabaseData() {
        const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
        const url = `${supabaseUrl}/rest/v1/${supabaseTable}?user_key=eq.${encodeURIComponent(userKey)}&order=sync_time.desc`;
        
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                onload: resolve,
                onerror: reject
            });
        });

        console.log('[稍后再看] 获取数据响应状态:', response.status);

        if (response.status >= 200 && response.status < 300) {
            const data = JSON.parse(response.responseText || '[]');
            console.log('[稍后再看] 获取到的远程数据数量:', data.length);
            
            // 转换 Supabase 格式到本地格式
            return data.map(item => ({
                id: item.post_id,
                title: item.title,
                url: item.url,
                addedAt: Number(item.added_time), // 确保是数字时间戳
                syncTime: Number(item.sync_time), // 确保是数字时间戳
                isDeleted: item.isDeleted || false, // 软删除标记
                deleteTime: item.delete_time ? Number(item.delete_time) : null // 删除时间
            }));
        } else if (response.status === 404) {
            console.log('[稍后再看] 表不存在或没有数据，返回空数组');
            return []; // 表不存在或没有数据
        } else {
            console.error('[稍后再看] 获取数据失败详情:', response.responseText);
            throw new Error(`获取 Supabase 数据失败: ${response.status} ${response.statusText || ''}\n详情: ${response.responseText || '无响应内容'}`);
        }
    }

    // 上传数据到 Supabase
    async function uploadSupabaseData(data) {
        const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
        const now = Date.now();
        
        // 转换本地格式到 Supabase 格式
        const supabaseData = data.map(item => {
            // 数据验证
            if (!item.id || !item.title || !item.url) {
                console.warn('[稍后再看] 跳过无效数据项:', item);
                return null;
            }

            return {
                user_key: userKey,
                post_id: String(item.id), // 确保是字符串
                title: String(item.title).substring(0, 500), // 限制标题长度
                url: String(item.url).substring(0, 1000), // 限制URL长度
                added_time: typeof item.addedAt === 'number' ? item.addedAt : Date.now(), // 保持为时间戳数字
                sync_time: now, // 保持为时间戳数字
                device_info: navigator.userAgent.substring(0, 200), // 限制长度
                isDeleted: item.isDeleted || false, // 软删除标记
                delete_time: item.deleteTime || null // 删除时间
            };
        }).filter(Boolean); // 过滤掉null值

        console.log('[稍后再看] 准备上传的数据数量:', supabaseData.length);

        // 使用 UPSERT 策略：插入或更新数据，而不是先删除再插入
        if (supabaseData.length > 0) {
            const upsertResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${supabaseUrl}/rest/v1/${supabaseTable}`,
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    data: JSON.stringify(supabaseData),
                    onload: resolve,
                    onerror: reject
                });
            });

            console.log('[稍后再看] UPSERT操作响应状态:', upsertResponse.status);

            if (upsertResponse.status < 200 || upsertResponse.status >= 300) {
                console.error('[稍后再看] UPSERT失败详情:', upsertResponse.responseText);
                throw new Error(`上传 Supabase 数据失败: ${upsertResponse.status} ${upsertResponse.statusText || ''}\n详情: ${upsertResponse.responseText || '无响应内容'}`);
            }
        }

        console.log('[稍后再看] 数据已上传到 Supabase，时间:', new Date(now).toLocaleString());
    }

    // 智能合并 Supabase 数据
    function mergeSupabaseData(localData, remoteData) {
        const merged = new Map();

        // 添加本地数据（只添加未删除的项目）
        localData.forEach(item => {
            if (!item.isDeleted) {
                merged.set(item.id, { ...item });
            }
        });

        // 合并远程数据（远程优先，基于同步时间）
        remoteData.forEach(remoteItem => {
            const localItem = merged.get(remoteItem.id);

            // 如果远程项目被标记为删除，则从合并结果中移除
            if (remoteItem.isDeleted) {
                merged.delete(remoteItem.id);
                return;
            }

            // 如果本地没有该项目，或远程项目更新，则使用远程数据
            if (!localItem || (remoteItem.syncTime && remoteItem.syncTime > (localItem.syncTime || 0))) {
                merged.set(remoteItem.id, { ...remoteItem });
            }
        });

        return Array.from(merged.values());
    }

    // 保守合并 Supabase 数据（本地优先，防止意外覆盖）
    function mergeSupabaseDataConservative(localData, remoteData) {
        console.log('[稍后再看] 采用保守合并策略，本地数据:', localData.length, '条，远程数据:', remoteData.length, '条');

        const merged = new Map();

        // 首先添加本地数据（本地优先，只添加未删除的项目）
        localData.forEach(item => {
            if (!item.isDeleted) {
                merged.set(item.id, { ...item });
            }
        });

        // 处理远程数据
        remoteData.forEach(remoteItem => {
            // 如果远程项目被标记为删除，则从合并结果中移除
            if (remoteItem.isDeleted) {
                if (merged.has(remoteItem.id)) {
                    console.log('[稍后再看] 远程删除，移除本地数据:', remoteItem.title);
                    merged.delete(remoteItem.id);
                }
                return;
            }

            // 只添加本地不存在的远程数据
            if (!merged.has(remoteItem.id)) {
                console.log('[稍后再看] 添加远程新数据:', remoteItem.title);
                merged.set(remoteItem.id, { ...remoteItem });
            } else {
                console.log('[稍后再看] 本地已存在，跳过远程数据:', remoteItem.title);
            }
        });

        console.log('[稍后再看] 保守合并完成，最终数据:', merged.size, '条');
        return Array.from(merged.values());
    }

    // 实时同步单个项目（添加时使用）
    async function syncItemToSupabase(item, isDelete = false) {
        if (!syncConfig.enabled || syncConfig.provider !== 'supabase' || !syncConfig.realTimeSync) {
            return;
        }

        try {
            const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
            const now = Date.now();

            if (isDelete) {
                // 软删除项目：标记为已删除而不是硬删除
                const softDeleteItem = {
                    user_key: userKey,
                    post_id: item.id,
                    title: item.title,
                    url: item.url,
                    added_time: item.addedAt,
                    sync_time: now,
                    device_info: navigator.userAgent.substring(0, 200),
                    isDeleted: true,
                    delete_time: now
                };

                // 使用 UPSERT 操作来更新或插入软删除记录
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${supabaseUrl}/rest/v1/${supabaseTable}`,
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'resolution=merge-duplicates'
                        },
                        data: JSON.stringify(softDeleteItem),
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                // 添加或更新项目
                const supabaseItem = {
                    user_key: userKey,
                    post_id: item.id,
                    title: item.title,
                    url: item.url,
                    added_time: item.addedAt,
                    sync_time: now,
                    device_info: navigator.userAgent.substring(0, 200),
                    isDeleted: false,
                    delete_time: null
                };

                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${supabaseUrl}/rest/v1/${supabaseTable}`,
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'resolution=merge-duplicates,return=minimal'
                        },
                        data: JSON.stringify([supabaseItem]),
                        onload: resolve,
                        onerror: reject
                    });
                });
            }

            console.log('[稍后再看] 实时同步完成:', isDelete ? '删除' : '添加/更新', item.title);
            
            // 更新同步状态
            GM_setValue('needSync', 'false');
            syncConfig.lastSync = Date.now();
            saveSyncConfig();
        } catch (error) {
            console.error('[稍后再看] 实时同步失败:', error);
            // 实时同步失败不应该阻塞主流程
        }
    }

    // 同步清空操作到 Supabase（使用软删除）
    async function syncClearAllToSupabase(itemsToDelete) {
        if (!syncConfig.enabled || syncConfig.provider !== 'supabase' || !syncConfig.realTimeSync) {
            return;
        }

        try {
            const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
            const now = Date.now();

            // 批量软删除所有项目
            console.log('[稍后再看] 开始批量软删除远程数据，数量:', itemsToDelete.length);

            // 将所有要删除的项目标记为软删除
            const softDeleteItems = itemsToDelete.map(item => ({
                user_key: userKey,
                post_id: item.id,
                title: item.title,
                url: item.url,
                added_time: item.addedAt,
                sync_time: now,
                device_info: navigator.userAgent.substring(0, 200),
                isDeleted: true,
                delete_time: now
            }));

            // 使用 UPSERT 批量标记为软删除
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${supabaseUrl}/rest/v1/${supabaseTable}`,
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    data: JSON.stringify(softDeleteItems),
                    onload: (response) => {
                        console.log('[稍后再看] 批量软删除响应:', response.status, response.responseText);
                        resolve(response);
                    },
                    onerror: reject
                });
            });

            console.log('[稍后再看] 清空操作软删除同步完成');
            
            // 更新同步状态
            GM_setValue('needSync', 'false');
            syncConfig.lastSync = Date.now();
            saveSyncConfig();
            
        } catch (error) {
            console.error('[稍后再看] 清空操作实时同步失败:', error);
            // 失败时标记需要同步，让定期同步处理
            GM_setValue('needSync', 'true');
        }
    }

    // 定期清理 Supabase 中已删除的记录
    async function cleanupDeletedRecords() {
        if (!syncConfig.enabled || syncConfig.provider !== 'supabase') {
            return;
        }

        // 从设置中获取清理周期，0表示禁用清理
        const cleanupDays = GM_getValue('cleanup_days', 7);
        if (cleanupDays === 0) {
            console.log('[稍后再看] 本设备已禁用清理功能，跳过清理任务');
            return;
        }

        try {
            const { supabaseUrl, supabaseKey, supabaseTable, userKey } = syncConfig;
            const cleanupThreshold = Date.now() - (cleanupDays * 24 * 60 * 60 * 1000);
            const now = Date.now();

            // 生成设备唯一标识（基于用户代理和时间戳）
            const deviceId = btoa(navigator.userAgent + syncConfig.userKey).substring(0, 16);

            // 检查是否有其他设备正在执行清理（分布式锁机制）
            const lockKey = `cleanup_lock_${userKey}`;
            const lastCleanupGlobal = GM_getValue(lockKey, 0);
            const cleanupLockDuration = 30 * 60 * 1000; // 30分钟锁定时间

            if (now - lastCleanupGlobal < cleanupLockDuration) {
                console.log('[稍后再看] 其他设备正在执行或最近已执行清理任务，跳过本次清理');
                return;
            }

            console.log(`[稍后再看] 开始清理 ${cleanupDays} 天前的软删除记录... (设备ID: ${deviceId})`);

            // 设置清理锁，防止其他设备同时执行
            GM_setValue(lockKey, now);

            // 删除超过指定天数的软删除记录
            const deleteResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'DELETE',
                    url: `${supabaseUrl}/rest/v1/${supabaseTable}?user_key=eq.${encodeURIComponent(userKey)}&isDeleted=eq.true&delete_time=lt.${cleanupThreshold}`,
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            console.log('[稍后再看] 清理删除记录响应状态:', deleteResponse.status);

            if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
                console.log(`[稍后再看] 成功清理了 ${cleanupDays} 天前的软删除记录 (设备: ${deviceId})`);

                // 更新上次清理时间（本设备专用）
                GM_setValue('lastCleanup', now);

                // 记录全局清理时间，供其他设备检查
                GM_setValue(`lastGlobalCleanup_${userKey}`, now);
            } else {
                console.error('[稍后再看] 清理删除记录失败:', deleteResponse.responseText);
                // 清理失败时释放锁
                GM_setValue(lockKey, 0);
            }
        } catch (error) {
            console.error('[稍后再看] 清理删除记录时出错:', error);
            // 出错时释放锁
            const lockKey = `cleanup_lock_${syncConfig.userKey}`;
            GM_setValue(lockKey, 0);
        }
    }

    // 检查并执行定期清理（每24小时执行一次）
    function checkAndRunCleanup() {
        // 如果禁用清理，直接退出
        const cleanupDays = GM_getValue('cleanup_days', 7);
        if (cleanupDays === 0) {
            return;
        }

        const lastCleanup = GM_getValue('lastCleanup', 0);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        // 检查本设备是否需要执行清理
        if (now - lastCleanup > twentyFourHours) {
            console.log('[稍后再看] 本设备达到清理周期，尝试执行定期清理任务...');
            cleanupDeletedRecords();
        } else {
            console.log('[稍后再看] 本设备清理周期未到，跳过清理检查');
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
