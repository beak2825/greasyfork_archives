// ==UserScript==
// @name         SiliconFlow 批量余额查询
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量查询SiliconFlow API密钥的余额信息
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531058/SiliconFlow%20%E6%89%B9%E9%87%8F%E4%BD%99%E9%A2%9D%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531058/SiliconFlow%20%E6%89%B9%E9%87%8F%E4%BD%99%E9%A2%9D%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // 创建浮动按钮
const floatingButton = document.createElement('div');
floatingButton.id = 'sf-floating-button';
floatingButton.innerHTML = '<i class="fas fa-search"></i><span class="sf-button-text">硅基</span>';
// 设置初始位置 - 默认隐藏在右侧边缘
floatingButton.style.right = 'auto';
floatingButton.style.left = `${window.innerWidth - 25}px`; // 25px是按钮半径
    
    // 创建弹窗容器
    const modalContainer = document.createElement('div');
    modalContainer.id = 'sf-modal-container';
    modalContainer.style.display = 'none';
    
    // 创建弹窗内容
    const modalContent = document.createElement('div');
    modalContent.id = 'sf-modal-content';
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.id = 'sf-close-button';
    closeButton.innerHTML = '&times;';
    
    // 添加Font Awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // 添加Inter字体
    const interFont = document.createElement('link');
    interFont.rel = 'stylesheet';
    interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(interFont);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #sf-floating-button {
            position: fixed;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: linear-gradient(135deg, #0062ff, #3d5afe);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            top: 100px;
            right: 20px;
            touch-action: none;
            -webkit-user-select: none;
            user-select: none;
            cursor: pointer;
            overflow: hidden;
        }
        
        .sf-button-text {
            position: absolute;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        #sf-floating-button:hover .sf-button-text,
        #sf-floating-button:active .sf-button-text {
            opacity: 1;
        }
        
        #sf-floating-button:hover .fas,
        #sf-floating-button:active .fas {
            opacity: 0;
        }
        
        .fas {
            transition: opacity 0.3s;
        }
        
        #sf-modal-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-y: auto;
        }
        
        #sf-modal-content {
            background-color: #f8fafc;
            border-radius: 12px;
            width: 95%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            -webkit-overflow-scrolling: touch;
        }
        
        #sf-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            color: #616161;
            cursor: pointer;
            z-index: 1;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
        }
        
        #sf-close-button:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        /* 原始样式 */
        :root {
            --primary: #0062ff;
            --primary-dark: #0050d0;
            --primary-light: #cce0ff;
            --primary-bg: #f0f6ff;
            --success: #05a660;
            --success-light: #e6f6ef;
            --warning: #ff9800;
            --warning-light: #fff4e6;
            --danger: #e53935;
            --danger-light: #ffebee;
            --info: #0288d1;
            --info-light: #e1f5fe;
            --gray-50: #fafafa;
            --gray-100: #f5f5f5;
            --gray-200: #eeeeee;
            --gray-300: #e0e0e0;
            --gray-400: #bdbdbd;
            --gray-500: #9e9e9e;
            --gray-600: #757575;
            --gray-700: #616161;
            --gray-800: #424242;
            --gray-900: #212121;
            --black: #000000;
            --white: #ffffff;
            --radius-xs: 2px;
            --radius-sm: 4px;
            --radius: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
            --radius-xl: 24px;
            --radius-full: 9999px;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .sf-container {
            width: 100%;
            padding: 1rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: var(--gray-800);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .sf-navbar {
            background-color: var(--white);
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 1rem 0;
            border-radius: 12px 12px 0 0;
        }
        .sf-navbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1rem;
        }
        .sf-navbar-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
        }
        .sf-brand-logo {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, var(--primary), #3d5afe);
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-weight: 600;
            box-shadow: var(--shadow);
        }
        .sf-brand-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--gray-900);
        }
        .sf-page-header {
            margin: 1.5rem 0;
            text-align: center;
        }
        .sf-page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
        }
        .sf-page-description {
            color: var(--gray-600);
            font-size: 0.875rem;
        }
        .sf-card {
            background-color: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            overflow: hidden;
            transition: box-shadow 0.2s;
            margin-bottom: 1rem;
        }
        .sf-card-header {
            padding: 1rem;
            border-bottom: 1px solid var(--gray-200);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--white);
        }
        .sf-card-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--gray-900);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .sf-card-title i {
            color: var(--primary);
            font-size: 1rem;
        }
        .sf-card-body {
            padding: 1rem;
        }
        .sf-form-group {
            margin-bottom: 1rem;
        }
        .sf-form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--gray-800);
        }
        .sf-form-helper {
            color: var(--gray-600);
            font-size: 0.75rem;
            margin-top: 0.375rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        .sf-form-control {
            width: 100%;
            padding: 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
            color: var(--gray-900);
            background-color: var(--white);
            border: 1px solid var(--gray-300);
            border-radius: var(--radius);
            transition: all 0.2s;
        }
        .sf-form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.15);
        }
        textarea.sf-form-control {
            min-height: 100px;
            resize: vertical;
            font-family: inherit;
        }
        .sf-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;
            border: 1px solid transparent;
            border-radius: var(--radius);
            transition: all 0.2s;
            gap: 0.5rem;
        }
        .sf-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.25);
        }
        .sf-btn-primary {
            color: var(--white);
            background-color: var(--primary);
            border-color: var(--primary);
        }
        .sf-btn-primary:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
        }
        .sf-btn-outline {
            color: var(--gray-700);
            background-color: var(--white);
            border-color: var(--gray-300);
        }
        .sf-btn-outline:hover {
            background-color: var(--gray-100);
            border-color: var(--gray-400);
        }
        .sf-btn-success {
            color: var(--white);
            background-color: var(--success);
            border-color: var(--success);
        }
        .sf-btn-success:hover {
            background-color: #048f53;
            border-color: #048f53;
        }
        .sf-btn-lg {
            padding: 0.875rem 1.5rem;
            font-size: 1.125rem;
        }
        .sf-btn-sm {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            border-radius: var(--radius-sm);
        }
        .sf-btn-block {
            display: flex;
            width: 100%;
        }
        .sf-alert {
            padding: 0.75rem;
            border-radius: var(--radius);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            display: none;
        }
        .sf-alert.show {
            display: flex;
        }
        .sf-alert-content {
            flex: 1;
            font-size: 0.875rem;
        }
        .sf-alert-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: var(--radius-full);
            flex-shrink: 0;
        }
        .sf-alert-danger {
            background-color: var(--danger-light);
            color: var(--danger);
        }
        .sf-alert-danger .sf-alert-icon {
            background-color: var(--danger);
            color: var(--white);
        }
        .sf-alert-success {
            background-color: var(--success-light);
            color: var(--success);
        }
        .sf-alert-success .sf-alert-icon {
            background-color: var(--success);
            color: var(--white);
        }
        .sf-loading-container {
            padding: 2rem 1rem;
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
        }
        .sf-loading-container.show {
            display: flex;
        }
        .sf-loading-animation {
            position: relative;
            width: 48px;
            height: 48px;
        }
        .sf-loading-circle {
            position: absolute;
            width: 48px;
            height: 48px;
            border: 3px solid rgba(0, 98, 255, 0.1);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: sf-spin 1s linear infinite;
        }
        @keyframes sf-spin {
            to { transform: rotate(360deg); }
        }
        .sf-loading-text {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--gray-800);
        }
        .sf-loading-subtext {
            color: var(--gray-600);
            margin-top: 0.25rem;
            font-size: 0.875rem;
            text-align: center;
        }
        .sf-progress-container {
            width: 100%;
            max-width: 300px;
        }
        .sf-progress-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.75rem;
            color: var(--gray-600);
        }
        .sf-progress-bar-bg {
            width: 100%;
            height: 6px;
            background-color: var(--gray-200);
            border-radius: var(--radius-full);
            overflow: hidden;
        }
        .sf-progress-bar {
            height: 100%;
            background-color: var(--primary);
            width: 0%;
            transition: width 0.3s;
        }
        .sf-results-section {
            display: none;
        }
        .sf-results-section.show {
            display: block;
        }
        .sf-summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        .sf-summary-card {
            background-color: var(--white);
            border-radius: var(--radius);
            padding: 0.75rem;
            box-shadow: var(--shadow-sm);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .sf-summary-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: var(--radius);
            flex-shrink: 0;
        }
        .sf-summary-data {
            flex: 1;
        }
        .sf-summary-value {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 0.25rem;
        }
        .sf-summary-label {
            font-size: 0.75rem;
            color: var(--gray-600);
        }
        .sf-summary-total .sf-summary-icon {
            background-color: var(--primary-bg);
            color: var(--primary);
        }
        .sf-summary-total .sf-summary-value {
            color: var(--primary);
        }
        .sf-summary-valid .sf-summary-icon {
            background-color: var(--success-light);
            color: var(--success);
        }
        .sf-summary-valid .sf-summary-value {
            color: var(--success);
        }
        .sf-summary-invalid .sf-summary-icon {
            background-color: var(--danger-light);
            color: var(--danger);
        }
        .sf-summary-invalid .sf-summary-value {
            color: var(--danger);
        }
        .sf-summary-balance .sf-summary-icon {
            background-color: var(--info-light);
            color: var(--info);
        }
        .sf-summary-balance .sf-summary-value {
            color: var(--info);
        }
        .sf-actions-bar {
            background-color: var(--gray-50);
            border-radius: var(--radius);
            padding: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 0.75rem;
        }
        .sf-actions-group {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .sf-actions-title {
            font-weight: 500;
            color: var(--gray-700);
            margin-right: 0.5rem;
            font-size: 0.875rem;
        }
        .sf-badge-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-bg);
            color: var(--primary);
            font-size: 0.75rem;
            font-weight: 600;
            height: 18px;
            min-width: 18px;
            padding: 0 6px;
            border-radius: var(--radius-full);
            margin-left: 0.375rem;
        }
        .sf-table-container {
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            margin-bottom: 1rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        .sf-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
        }
        .sf-thead {
            background-color: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
        }
        .sf-th {
            color: var(--gray-700);
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.75rem;
            text-align: left;
            white-space: nowrap;
        }
        .sf-th.sortable {
            cursor: pointer;
            user-select: none;
        }
        .sf-th.sortable:hover {
            background-color: var(--gray-100);
        }
        .sf-th.sortable .sort-icon {
            display: inline-block;
            margin-left: 0.25rem;
            font-size: 0.75rem;
        }
        .sf-td {
            padding: 0.75rem;
            vertical-align: middle;
            border-bottom: 1px solid var(--gray-200);
        }
        .sf-tbody tr:last-child .sf-td {
            border-bottom: none;
        }
        .sf-tbody tr:hover {
            background-color: var(--gray-50);
        }
        .sf-valid-entry:hover {
            background-color: rgba(5, 166, 96, 0.04);
        }
        .sf-invalid-entry:hover {
            background-color: rgba(229, 57, 53, 0.04);
        }
        .sf-user-cell {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 200px;
        }
        .sf-user-avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            background-color: var(--primary-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-weight: 600;
            position: relative;
            flex-shrink: 0;
            overflow: hidden;
            font-size: 0.875rem;
        }
        .sf-user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .sf-admin-badge {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            border-radius: var(--radius-full);
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            border: 1px solid white;
        }
        .sf-user-info {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        .sf-user-name {
            font-weight: 500;
            color: var(--gray-900);
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.875rem;
        }
        .sf-user-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gray-600);
            font-size: 0.75rem;
        }
        .sf-user-contact {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        .sf-user-role {
            display: inline-flex;
            align-items: center;
            padding: 0 6px;
            height: 18px;
            background-color: var(--primary-bg);
            color: var(--primary);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 500;
        }
        .sf-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 500;
            line-height: 1.5;
        }
        .sf-status-active {
            background-color: var(--success-light);
            color: var(--success);
        }
        .sf-status-warning {
            background-color: var(--warning-light);
            color: var(--warning);
        }
        .sf-status-danger {
            background-color: var(--danger-light);
            color: var(--danger);
        }
        .sf-api-key-cell {
            display: flex;
            align-items: center;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.75rem;
            color: var(--gray-800);
            gap: 0.5rem;
            max-width: 200px;
        }
        .sf-key-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .sf-copy-btn {
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            background-color: var(--gray-100);
            color: var(--gray-700);
            border: 1px solid var(--gray-200);
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .sf-copy-btn:hover {
            background-color: var(--gray-200);
            color: var(--gray-800);
        }
        .sf-copy-btn.copied {
            background-color: var(--success-light);
            color: var(--success);
            border-color: var(--success);
        }
        .sf-amount-cell {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
            white-space: nowrap;
            width: 100%;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .sf-amount-total {
            color: var(--success);
            font-weight: 600;
        }
        .sf-error-cell {
            color: var(--danger);
            font-size: 0.75rem;
            max-width: 200px;
        }
        .sf-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            text-align: center;
            display: none;
        }
        .sf-empty-state.show {
            display: flex;
        }
        .sf-empty-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-full);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        .sf-empty-valid .sf-empty-icon {
            background-color: var(--success-light);
            color: var(--success);
        }
        .sf-empty-invalid .sf-empty-icon {
            background-color: var(--danger-light);
            color: var(--danger);
        }
        .sf-empty-title {
            font-weight: 600;
            font-size: 1rem;
            color: var(--gray-800);
            margin-bottom: 0.5rem;
        }
        .sf-empty-message {
            color: var(--gray-600);
            max-width: 250px;
            font-size: 0.875rem;
        }
        .sf-footer {
            margin-top: 2rem;
            padding: 1rem;
            text-align: center;
            color: var(--gray-500);
            font-size: 0.75rem;
        }
        .sf-toast-container {
            position: fixed;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            width: 90%;
            max-width: 300px;
        }
        .sf-toast {
            background-color: var(--gray-900);
            color: var(--white);
            border-radius: var(--radius);
            padding: 0.75rem 1rem;
            margin-top: 0.5rem;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateY(10px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            font-size: 0.875rem;
        }
        .sf-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .sf-toast-success {
            border-left: 4px solid var(--success);
        }
        .sf-toast-error {
            border-left: 4px solid var(--danger);
        }
        .sf-toast-info {
            border-left: 4px solid var(--primary);
        }
        .sf-toast-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }
        .sf-toast-content {
            flex: 1;
        }
        .sf-detected-keys {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            background-color: var(--primary-bg);
            border-radius: var(--radius);
            margin-top: 0.75rem;
            font-size: 0.75rem;
            color: var(--primary);
        }
        .sf-detected-keys i {
            margin-right: 0.5rem;
        }
        .sf-detected-count {
            font-weight: 600;
            margin: 0 0.25rem;
        }
        .sf-sort-button {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            margin-right: 0.5rem;
        }
        .sf-sort-button .sort-icon {
            transition: transform 0.2s ease;
        }
        .sf-sort-active .sort-icon {
            color: var(--primary);
        }
        .sf-sort-desc .sort-icon {
            transform: rotate(180deg);
        }
        .sf-result-card {
            background-color: var(--white);
            border-radius: var(--radius);
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            box-shadow: var(--shadow-sm);
            border-left: 3px solid transparent;
        }
        
        .sf-valid-card {
            border-left-color: var(--success);
        }
        
        .sf-invalid-card {
            border-left-color: var(--danger);
        }
        
        .sf-card-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            align-items: center;
        }
        
        .sf-card-row:last-child {
            margin-bottom: 0;
        }
        
        .sf-card-label {
            font-size: 0.75rem;
            color: var(--gray-600);
            margin-bottom: 0.25rem;
            text-align: center;
        }
        
        .sf-card-value {
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        .sf-card-divider {
            height: 1px;
            background-color: var(--gray-200);
            margin: 0.5rem 0;
        }
        
        .sf-found-keys-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            background-color: var(--primary-bg);
            color: var(--primary);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }
        
        .sf-found-keys-count {
            margin: 0 0.25rem;
            font-weight: 600;
        }
        .sf-card-value.sf-amount-cell {
            text-align: center;
            width: 100%;
            margin: 0 auto;
        }
        .sf-balance-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 33.33%;
            text-align: center;
        }
        
        .sf-copy-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .sf-copy-modal-content {
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        }
        
        .sf-copy-text-container {
            margin: 15px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 8px;
            text-align: left;
            overflow-x: auto;
        }
        
        .sf-copy-text {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
            user-select: all;
        }
        
        .sf-copy-modal-close {
            margin-top: 15px;
        }
        
        @media (max-width: 600px) {
            .sf-summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .sf-card-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.75rem;
            }
            
            .sf-actions-bar {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .sf-actions-group {
                width: 100%;
            }
            
            .sf-actions-group .sf-btn {
                flex: 1;
                justify-content: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // 添加弹窗内容HTML
    modalContent.innerHTML = `
        <div class="sf-container">
            <nav class="sf-navbar">
                <div class="sf-navbar-container">
                    <a href="#" class="sf-navbar-brand">
                        <div class="sf-brand-logo">SF</div>
                        <div class="sf-brand-text">SiliconFlow</div>
                    </a>
                </div>
            </nav>
            <header class="sf-page-header">
                <h1 class="sf-page-title">批量账户余额查询</h1>
                <p class="sf-page-description">快速检索多个API密钥，获取账户余额和详细信息</p>
            </header>
            <div class="sf-card">
                <div class="sf-card-header">
                    <h2 class="sf-card-title">
                        <i class="fas fa-key"></i>
                        输入API密钥
                    </h2>
                </div>
                <div class="sf-card-body">
                    <div id="sf-errorAlert" class="sf-alert sf-alert-danger">
                        <div class="sf-alert-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="sf-alert-content" id="sf-errorMessage"></div>
                    </div>
                    
                    <div id="sf-successAlert" class="sf-alert sf-alert-success">
                        <div class="sf-alert-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="sf-alert-content" id="sf-successMessage"></div>
                    </div>
                    <form id="sf-apiKeysForm">
                        <div class="sf-form-group">
                            <label for="sf-apiKeysInput" class="sf-form-label">粘贴任意文本</label>
                            <textarea id="sf-apiKeysInput" class="sf-form-control" placeholder="粘贴任何包含API密钥的文本，系统会自动提取以sk-开头的密钥..."></textarea>
                            <div class="sf-form-helper">
                                <i class="fas fa-info-circle"></i>
                                智能识别：自动从粘贴文本中提取有效密钥
                            </div>
                        </div>
                        
                        <div id="sf-detectedKeysInfo" class="sf-detected-keys" style="display: none;">
                            <i class="fas fa-search"></i>
                            已检测到 <span id="sf-detectedKeysCount" class="sf-detected-count">0</span> 个API密钥
                        </div>
                        <button type="submit" class="sf-btn sf-btn-primary sf-btn-block sf-btn-lg">
                            <i class="fas fa-search"></i>
                            开始查询
                        </button>
                    </form>
                    <div id="sf-loadingContainer" class="sf-loading-container">
                        <div class="sf-loading-animation">
                            <div class="sf-loading-circle"></div>
                        </div>
                        <div>
                            <div class="sf-loading-text">正在查询账户信息</div>
                            <div class="sf-loading-subtext">请稍候，这可能需要一些时间...</div>
                        </div>
                        <div class="sf-progress-container">
                            <div class="sf-progress-info">
                                <span id="sf-progressStatus">已查询 <span id="sf-currentProgress">0</span>/<span id="sf-totalKeys">0</span> 个</span>
                                <span id="sf-progressPercentage">0%</span>
                            </div>
                            <div class="sf-progress-bar-bg">
                                <div id="sf-progressBar" class="sf-progress-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="sf-resultsSection" class="sf-results-section">
                <div class="sf-summary-grid">
                    <div class="sf-summary-card sf-summary-total">
                        <div class="sf-summary-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="sf-summary-data">
                            <div class="sf-summary-value" id="sf-totalQueries">0</div>
                            <div class="sf-summary-label">总查询数</div>
                        </div>
                    </div>
                    <div class="sf-summary-card sf-summary-valid">
                        <div class="sf-summary-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="sf-summary-data">
                            <div class="sf-summary-value" id="sf-validQueries">0</div>
                            <div class="sf-summary-label">有效密钥</div>
                        </div>
                    </div>
                    <div class="sf-summary-card sf-summary-invalid">
                        <div class="sf-summary-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="sf-summary-data">
                            <div class="sf-summary-value" id="sf-invalidQueries">0</div>
                            <div class="sf-summary-label">无效密钥</div>
                        </div>
                    </div>
                    <div class="sf-summary-card sf-summary-balance">
                        <div class="sf-summary-icon">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <div class="sf-summary-data">
                            <div class="sf-summary-value" id="sf-totalBalance">¥0.00</div>
                            <div class="sf-summary-label">总余额</div>
                        </div>
                    </div>
                </div>
                <div class="sf-card" id="sf-validKeysCard">
                    <div class="sf-card-header">
                        <h2 class="sf-card-title">
                            <i class="fas fa-check-circle"></i>
                            有效密钥 <span class="sf-badge-count" id="sf-validKeyCount">0</span>
                        </h2>
                        <div class="sf-actions-group">
                            <button id="sf-sortBalanceBtn" class="sf-btn sf-btn-outline sf-btn-sm sf-sort-button">
                                <i class="fas fa-sort-amount-down sort-icon"></i>
                                余额排序
                            </button>
                            <button id="sf-copyCommaBtn" class="sf-btn sf-btn-outline sf-btn-sm">
                                <i class="fas fa-copy"></i>
                                逗号分隔复制
                            </button>
                            <button id="sf-copyLineBtn" class="sf-btn sf-btn-outline sf-btn-sm">
                                <i class="fas fa-copy"></i>
                                换行分隔复制
                            </button>
                        </div>
                    </div>
                    <div class="sf-table-container">
                        <table class="sf-table">
                            <thead class="sf-thead">
                                <tr>
                                    <th class="sf-th">用户信息</th>
                                    <th class="sf-th">账户状态</th>
                                    <th class="sf-th">赠送余额</th>
                                    <th class="sf-th">充值余额</th>
                                    <th class="sf-th sortable" data-sort="totalBalance">
                                        总余额
                                        <span class="sort-icon"><i class="fas fa-sort"></i></span>
                                    </th>
                                    <th class="sf-th">API密钥</th>
                                </tr>
                            </thead>
                            <tbody class="sf-tbody" id="sf-validResultsBody">
                            </tbody>
                        </table>
                    </div>
                    <div id="sf-emptyValidState" class="sf-empty-state sf-empty-valid">
                        <div class="sf-empty-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 class="sf-empty-title">暂无有效密钥</h3>
                        <p class="sf-empty-message">查询完成后，有效的API密钥将显示在这里</p>
                    </div>
                </div>
                <div class="sf-card" id="sf-invalidKeysCard">
                    <div class="sf-card-header">
                        <h2 class="sf-card-title">
                            <i class="fas fa-times-circle"></i>
                            无效密钥 <span class="sf-badge-count" id="sf-invalidKeyCount">0</span>
                        </h2>
                    </div>
                    <div class="sf-table-container">
                        <table class="sf-table">
                            <thead class="sf-thead">
                                <tr>
                                    <th class="sf-th">API密钥</th>
                                    <th class="sf-th">错误信息</th>
                                </tr>
                            </thead>
                            <tbody class="sf-tbody" id="sf-invalidResultsBody">
                            </tbody>
                        </table>
                    </div>
                    <div id="sf-emptyInvalidState" class="sf-empty-state sf-empty-invalid">
                        <div class="sf-empty-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <h3 class="sf-empty-title">暂无无效密钥</h3>
                        <p class="sf-empty-message">查询完成后，无效或失败的API密钥将显示在这里</p>
                    </div>
                </div>
            </div>
            <footer class="sf-footer">
                <div class="sf-footer-text">
                    &copy; <span id="sf-currentYear"></span> SiliconFlow - 批量账户查询工具
                </div>
            </footer>
        </div>
        <div class="sf-toast-container" id="sf-toastContainer"></div>
    `;
    
    // 添加关闭按钮和弹窗内容到弹窗容器
    modalContainer.appendChild(closeButton);
    modalContainer.appendChild(modalContent);
    
    // 添加浮动按钮和弹窗容器到页面
    document.body.appendChild(floatingButton);
    document.body.appendChild(modalContainer);
    
    // 设置当前年份
    document.getElementById('sf-currentYear').textContent = new Date().getFullYear();
    
    // 浮动按钮拖动功能
    let isDragging = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let buttonX = 0;
    let buttonY = 0;
    let lastMoveTime = 0;
    let sideSnapTimeout;
    let hasMoved = false; // 添加标记，判断是否发生了移动
    
    function handleTouchStart(e) {
        isDragging = true;
        hasMoved = false; // 重置移动标记
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        
        const rect = floatingButton.getBoundingClientRect();
        buttonX = rect.left;
        buttonY = rect.top;
        
        lastMoveTime = Date.now();
        clearTimeout(sideSnapTimeout);
        
        // 不阻止默认行为，以便短按可以触发点击
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        // 标记为已移动
        hasMoved = true;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // 只有移动超过5px才算真正的拖动
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            const newX = buttonX + deltaX;
            const newY = buttonY + deltaY;
            
            // 限制按钮不能完全移出屏幕
            const buttonSize = 50; // 按钮大小
            const maxX = window.innerWidth - buttonSize / 2;
            const minX = -buttonSize / 2;
            const maxY = window.innerHeight - buttonSize / 2;
            const minY = -buttonSize / 2;
            
            floatingButton.style.left = `${Math.min(Math.max(newX, minX), maxX)}px`;
            floatingButton.style.top = `${Math.min(Math.max(newY, minY), maxY)}px`;
            floatingButton.style.right = 'auto';
            
            lastMoveTime = Date.now();
            
            // 阻止默认行为，防止页面滚动
            e.preventDefault();
        }
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        // 如果没有移动，则视为点击
        if (!hasMoved) {
            openModal();
            return;
        }
        
        // 设置2秒后自动吸附到侧边
        sideSnapTimeout = setTimeout(() => {
            snapToSide();
        }, 2000);
    }
    
    function snapToSide() {
        const rect = floatingButton.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const buttonSize = 50; // 按钮大小
        
        // 计算应该吸附到哪一侧
        const snapToRight = rect.left > windowWidth / 2;
        
        // 保持当前的垂直位置，但水平吸附到侧边（半隐藏）
        const newX = snapToRight ? windowWidth - buttonSize / 2 : -buttonSize / 2;
        
        // 应用过渡效果
        floatingButton.style.transition = 'left 0.3s ease-out';
        floatingButton.style.left = `${newX}px`;
        
        // 过渡结束后移除过渡效果
        setTimeout(() => {
            floatingButton.style.transition = '';
        }, 300);
    }
    
    function openModal() {
        modalContainer.style.display = 'flex';
    }
    
    // 点击浮动按钮打开弹窗
    floatingButton.addEventListener('click', function(e) {
        // 如果正在拖动或刚刚拖动过，不打开弹窗
        if (isDragging || (Date.now() - lastMoveTime < 200) || hasMoved) {
            return;
        }
        
        openModal();
        e.stopPropagation();
    });
    
    // 点击关闭按钮关闭弹窗
    closeButton.addEventListener('click', function() {
        modalContainer.style.display = 'none';
    });
    
    // 点击弹窗外部关闭弹窗
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });
    
    // 添加触摸事件监听器
    floatingButton.addEventListener('touchstart', handleTouchStart);
    floatingButton.addEventListener('touchmove', handleTouchMove, { passive: false });
    floatingButton.addEventListener('touchend', handleTouchEnd);
    
    // 添加鼠标事件监听器（用于桌面浏览器测试）
    floatingButton.addEventListener('mousedown', function(e) {
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        const rect = floatingButton.getBoundingClientRect();
        buttonX = rect.left;
        buttonY = rect.top;
        isDragging = true;
        hasMoved = false;
        clearTimeout(sideSnapTimeout);
        lastMoveTime = Date.now();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        hasMoved = true;
        
        const deltaX = e.clientX - touchStartX;
        const deltaY = e.clientY - touchStartY;
        
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            const newX = buttonX + deltaX;
            const newY = buttonY + deltaY;
            
            // 限制按钮不能完全移出屏幕
            const buttonSize = 50;
            const maxX = window.innerWidth - buttonSize / 2;
            const minX = -buttonSize / 2;
            const maxY = window.innerHeight - buttonSize / 2;
            const minY = -buttonSize / 2;
            
            floatingButton.style.left = `${Math.min(Math.max(newX, minX), maxX)}px`;
            floatingButton.style.top = `${Math.min(Math.max(newY, minY), maxY)}px`;
            floatingButton.style.right = 'auto';
            
            lastMoveTime = Date.now();
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        
        if (!hasMoved) {
            openModal();
            return;
        }
        
        sideSnapTimeout = setTimeout(() => {
            snapToSide();
        }, 2000);
    });
    
    
    // 主要功能实现
    const form = document.getElementById('sf-apiKeysForm');
    const apiKeysInput = document.getElementById('sf-apiKeysInput');
    const errorAlert = document.getElementById('sf-errorAlert');
    const errorMessage = document.getElementById('sf-errorMessage');
    const successAlert = document.getElementById('sf-successAlert');
    const successMessage = document.getElementById('sf-successMessage');
    const loadingContainer = document.getElementById('sf-loadingContainer');
    const currentProgress = document.getElementById('sf-currentProgress');
    const totalKeys = document.getElementById('sf-totalKeys');
    const progressBar = document.getElementById('sf-progressBar');
    const progressPercentage = document.getElementById('sf-progressPercentage');
    const resultsSection = document.getElementById('sf-resultsSection');
    const totalQueriesEl = document.getElementById('sf-totalQueries');
    const validQueriesEl = document.getElementById('sf-validQueries');
    const invalidQueriesEl = document.getElementById('sf-invalidQueries');
    const totalBalanceEl = document.getElementById('sf-totalBalance');
    const validKeyCount = document.getElementById('sf-validKeyCount');
    const invalidKeyCount = document.getElementById('sf-invalidKeyCount');
    const validResultsBody = document.getElementById('sf-validResultsBody');
    const invalidResultsBody = document.getElementById('sf-invalidResultsBody');
    const emptyValidState = document.getElementById('sf-emptyValidState');
    const emptyInvalidState = document.getElementById('sf-emptyInvalidState');
    const sortBalanceBtn = document.getElementById('sf-sortBalanceBtn');
    const copyCommaBtn = document.getElementById('sf-copyCommaBtn');
    const copyLineBtn = document.getElementById('sf-copyLineBtn');
    const detectedKeysInfo = document.getElementById('sf-detectedKeysInfo');
    const detectedKeysCount = document.getElementById('sf-detectedKeysCount');
    const toastContainer = document.getElementById('sf-toastContainer');
    
    let validResults = [];
    let invalidResults = [];
    let extractedKeys = [];
    
    let sortDirection = 'desc';
    
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.add('show');
        successAlert.classList.remove('show');
        
        setTimeout(() => {
            errorAlert.classList.remove('show');
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.classList.add('show');
        errorAlert.classList.remove('show');
        
        setTimeout(() => {
            successAlert.classList.remove('show');
        }, 5000);
    }
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `sf-toast sf-toast-${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <div class="sf-toast-icon">
                <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            </div>
            <div class="sf-toast-content">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // 修改后的复制功能
    async function copyToClipboard(text) {
        try {
            // 尝试使用现代Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                showToast('复制成功', 'success');
                return true;
            }
            
            // 后备方法：创建临时文本区域
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // 使文本区域不可见
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            // iOS特定处理
            if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                // 创建可编辑区域，因为iOS不允许以编程方式选择文本区域
                textArea.contentEditable = true;
                textArea.readOnly = false;
                
                // 创建范围并选择
                const range = document.createRange();
                range.selectNodeContents(textArea);
                
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                // 设置可编辑
                textArea.setSelectionRange(0, 999999);
            } else {
                // 其他平台
                textArea.select();
            }
            
            // 执行复制命令
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showToast('复制成功', 'success');
                return true;
            } else {
                throw new Error('复制操作失败');
            }
        } catch (err) {
            console.error('复制失败:', err);
            
            // 显示特殊提示，指导用户手动复制
            showToast('请长按文本手动复制', 'info');
            
            // 对于iOS设备，我们可以提供更明确的指导
            if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                // 创建一个模态框，显示要复制的文本
                showCopyModal(text);
            }
            
            return false;
        }
    }
    // 添加一个函数来显示复制模态框
    function showCopyModal(text) {
        const modal = document.createElement('div');
        modal.className = 'sf-copy-modal';
        
        modal.innerHTML = `
            <div class="sf-copy-modal-content">
                <h3>请手动复制以下内容</h3>
                <p>长按下面的文本，然后选择"复制"</p>
                <div class="sf-copy-text-container">
                    <pre class="sf-copy-text">${text}</pre>
                </div>
                <button class="sf-btn sf-btn-primary sf-copy-modal-close">关闭</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.sf-copy-modal-close');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // 点击模态框背景关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    function extractApiKeys(text) {
        if (!text.trim()) return [];
        
        const regex = /sk-[a-zA-Z0-9]{48}/g;
        const matches = text.match(regex) || [];
        
        return [...new Set(matches)];
    }
    
    apiKeysInput.addEventListener('input', function() {
        const text = this.value;
        extractedKeys = extractApiKeys(text);
        
        if (extractedKeys.length > 0) {
            detectedKeysCount.textContent = extractedKeys.length;
            detectedKeysInfo.style.display = 'flex';
        } else {
            detectedKeysInfo.style.display = 'none';
        }
    });
    
    function formatCurrency(value) {
        return `¥${parseFloat(value || 0).toFixed(2)}`;
    }
    
    function isPhoneEmail(email) {
        return email && email.endsWith('@sf.cn');
    }
    
    function getRoleDisplay(role) {
        if (!role || role === 'user' || role === 'user_role') {
            return '';
        }
        
        const roleMap = {
            'admin': { text: '管理员' },
            'vip': { text: 'VIP用户' }
        };
        
        const roleInfo = roleMap[role.toLowerCase()] || { text: role };
        return `<div class="sf-user-role">${roleInfo.text}</div>`;
    }
    
    async function queryApiKey(apiKey) {
        try {
            const response = await fetch('https://api.siliconflow.cn/v1/user/info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.status) {
                throw new Error(data.message || '获取账户信息失败');
            }
            
            return {
                success: true,
                data: data.data,
                apiKey
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || '查询失败',
                apiKey
            };
        }
    }
    
    function createValidTableRow(result) {
        const row = document.createElement('tr');
        row.className = 'sf-valid-entry';
        row.dataset.totalBalance = parseFloat(result.data.totalBalance || 0);
        
        const user = result.data;
        const initial = ((user.name || '用户')[0] || 'U').toUpperCase();
        
        let contactHTML = '';
        if (user.email) {
            if (isPhoneEmail(user.email)) {
                contactHTML = `<div class="sf-user-contact"><i class="fas fa-mobile-alt"></i> ${user.email.split('@')[0]}</div>`;
            } else {
                contactHTML = `<div class="sf-user-contact"><i class="fas fa-envelope"></i> ${user.email}</div>`;
            }
        }
        
        const isNormalStatus = user.status === 'normal';
        const statusClass = isNormalStatus ? 'sf-status-active' : 'sf-status-warning';
        const statusText = isNormalStatus ? '正常' : user.status;
        const statusIcon = isNormalStatus ? 'check-circle' : 'exclamation-circle';
        
        row.innerHTML = `
            <td class="sf-td">
                <div class="sf-user-cell">
                    <div class="sf-user-avatar">
                        ${user.image ? `<img src="${user.image}" alt="${user.name || '用户'}" />` : initial}
                        ${user.isAdmin ? '<div class="sf-admin-badge"><i class="fas fa-crown"></i></div>' : ''}
                    </div>
                    <div class="sf-user-info">
                        <div class="sf-user-name">${user.name || '未命名用户'}</div>
                        <div class="sf-user-meta">
                            ${contactHTML}
                            ${getRoleDisplay(user.role)}
                        </div>
                    </div>
                </div>
            </td>
            <td class="sf-td">
                <span class="sf-status-badge ${statusClass}">
                    <i class="fas fa-${statusIcon}"></i>
                    ${statusText}
                </span>
            </td>
            <td class="sf-td"><span class="sf-amount-cell">${formatCurrency(user.balance)}</span></td>
            <td class="sf-td"><span class="sf-amount-cell">${formatCurrency(user.chargeBalance)}</span></td>
            <td class="sf-td"><span class="sf-amount-cell sf-amount-total">${formatCurrency(user.totalBalance)}</span></td>
            <td class="sf-td">
                <div class="sf-api-key-cell">
                    <span class="sf-key-text">${result.apiKey}</span>
                    <button class="sf-copy-btn" data-key="${result.apiKey}">
                        <i class="fas fa-copy"></i> 复制
                    </button>
                </div>
            </td>
        `;
        
        const copyBtn = row.querySelector('.sf-copy-btn');
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const key = this.getAttribute('data-key');
            const success = await copyToClipboard(key);
            
            if (success) {
                this.innerHTML = '<i class="fas fa-check"></i> 已复制';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> 复制';
                    this.classList.remove('copied');
                }, 2000);
            }
        });
        
        return row;
    }
    
    function createInvalidTableRow(result) {
        const row = document.createElement('tr');
        row.className = 'sf-invalid-entry';
        
        row.innerHTML = `
            <td class="sf-td">
                <div class="sf-api-key-cell">
                    <span class="sf-key-text">${result.apiKey}</span>
                    <button class="sf-copy-btn" data-key="${result.apiKey}">
                        <i class="fas fa-copy"></i> 复制
                    </button>
                </div>
            </td>
            <td class="sf-td">
                <div class="sf-error-cell">${result.error}</div>
            </td>
        `;
        
        const copyBtn = row.querySelector('.sf-copy-btn');
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const key = this.getAttribute('data-key');
            const success = await copyToClipboard(key);
            
            if (success) {
                this.innerHTML = '<i class="fas fa-check"></i> 已复制';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> 复制';
                    this.classList.remove('copied');
                }, 2000);
            }
        });
        
        return row;
    }
    
    function sortResultsByBalance() {
        sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        
        const sortIcon = sortBalanceBtn.querySelector('.sort-icon');
        sortIcon.className = `fas fa-sort-amount-${sortDirection === 'desc' ? 'down' : 'up'} sort-icon`;
        
        const tableHeaderIcon = document.querySelector('th[data-sort="totalBalance"] .sort-icon i');
        tableHeaderIcon.className = `fas fa-sort-${sortDirection === 'desc' ? 'down' : 'up'}`;
        
        const sortedResults = [...validResults];
        
        sortedResults.sort((a, b) => {
            const balanceA = parseFloat(a.data.totalBalance || 0);
            const balanceB = parseFloat(b.data.totalBalance || 0);
            
            if (sortDirection === 'desc') {
                return balanceB - balanceA;
            } else {
                return balanceA - balanceB;
            }
        });
        
        validResultsBody.innerHTML = '';
        
        sortedResults.forEach(result => {
            validResultsBody.appendChild(createValidTableRow(result));
        });
        
        showToast(`已按总余额${sortDirection === 'desc' ? '从高到低' : '从低到高'}排序`, 'success');
    }
    
    async function batchQueryApiKeys(apiKeys) {
        validResults = [];
        invalidResults = [];
        validResultsBody.innerHTML = '';
        invalidResultsBody.innerHTML = '';
        
        totalKeys.textContent = apiKeys.length;
        
        let totalBalanceSum = 0;
        
        for (let i = 0; i < apiKeys.length; i++) {
            const apiKey = apiKeys[i];
            
            const progress = Math.round(((i + 1) / apiKeys.length) * 100);
            currentProgress.textContent = i + 1;
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
            
            const result = await queryApiKey(apiKey);
            
            if (result.success) {
                validResults.push(result);
                totalBalanceSum += parseFloat(result.data.totalBalance || 0);
                
                validResultsBody.appendChild(createValidTableRow(result));
            } else {
                invalidResults.push(result);
                
                invalidResultsBody.appendChild(createInvalidTableRow(result));
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        totalQueriesEl.textContent = apiKeys.length;
        validQueriesEl.textContent = validResults.length;
        invalidQueriesEl.textContent = invalidResults.length;
        totalBalanceEl.textContent = formatCurrency(totalBalanceSum);
        
        validKeyCount.textContent = validResults.length;
        invalidKeyCount.textContent = invalidResults.length;
        
        emptyValidState.style.display = validResults.length > 0 ? 'none' : 'flex';
        emptyInvalidState.style.display = invalidResults.length > 0 ? 'none' : 'flex';
        
        if (validResults.length > 0) {
            const sortedResults = [...validResults].sort((a, b) => {
                const balanceA = parseFloat(a.data.totalBalance || 0);
                const balanceB = parseFloat(b.data.totalBalance || 0);
                return balanceB - balanceA;
            });
            
            validResultsBody.innerHTML = '';
            
            sortedResults.forEach(result => {
                validResultsBody.appendChild(createValidTableRow(result));
            });
            
            const sortIcon = sortBalanceBtn.querySelector('.sort-icon');
            if (sortIcon) sortIcon.className = 'fas fa-sort-amount-down sort-icon';
            
            const tableHeaderIcon = document.querySelector('th[data-sort="totalBalance"] .sort-icon i');
            if (tableHeaderIcon) tableHeaderIcon.className = 'fas fa-sort-down';
        }
        
        return {
            totalQueries: apiKeys.length,
            validResults,
            invalidResults,
            totalBalanceSum
        };
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const text = apiKeysInput.value.trim();
        if (!text) {
            showError('请输入包含API密钥的文本');
            return;
        }
        
        const apiKeys = extractApiKeys(text);
        
        if (apiKeys.length === 0) {
            showError('未检测到有效的API密钥（格式：sk-开头加48个字符）');
            return;
        }
        
        errorAlert.classList.remove('show');
        successAlert.classList.remove('show');
        form.style.display = 'none';
        loadingContainer.classList.add('show');
        
        try {
            await batchQueryApiKeys(apiKeys);
            
            resultsSection.classList.add('show');
            
            showSuccess(`成功查询 ${apiKeys.length} 个API密钥，其中 ${validResults.length} 个有效`);
        } catch (error) {
            showError('批量查询过程中发生错误');
            console.error('批量查询错误:', error);
        } finally {
            loadingContainer.classList.remove('show');
            form.style.display = 'block';
        }
    });
    
    sortBalanceBtn.addEventListener('click', sortResultsByBalance);
    
    document.querySelector('th[data-sort="totalBalance"]').addEventListener('click', sortResultsByBalance);
    
    copyCommaBtn.addEventListener('click', function() {
        if (validResults.length === 0) {
            showToast('没有可复制的有效密钥', 'error');
            return;
        }
        
        const keys = validResults.map(result => result.apiKey);
        copyToClipboard(keys.join(','));
    });
    
    copyLineBtn.addEventListener('click', function() {
        if (validResults.length === 0) {
            showToast('没有可复制的有效密钥', 'error');
            return;
        }
        
        const keys = validResults.map(result => result.apiKey);
        copyToClipboard(keys.join('\n'));
    });
    
    apiKeysInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            form.dispatchEvent(new Event('submit'));
        }
    });
})();