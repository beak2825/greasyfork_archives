// ==UserScript==
// @name         AGSV股票持仓收益及借入收益分析
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @license      MIT License
// @description  AGSV股票系统彻底重构：股票按钮选择，智能交易面板，精准收益计算，做空平仓优化，表格全面增强
// @author       PandaChan & AGSV骄阳 & Madrays
// @match        https://stock.agsvpt.cn/
// @icon         https://stock.agsvpt.cn/plugins/stock/favicon.svg
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/542780/AGSV%E8%82%A1%E7%A5%A8%E6%8C%81%E4%BB%93%E6%94%B6%E7%9B%8A%E5%8F%8A%E5%80%9F%E5%85%A5%E6%94%B6%E7%9B%8A%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/542780/AGSV%E8%82%A1%E7%A5%A8%E6%8C%81%E4%BB%93%E6%94%B6%E7%9B%8A%E5%8F%8A%E5%80%9F%E5%85%A5%E6%94%B6%E7%9B%8A%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // --- 全局配置 ---
    const API_BASE_URL = 'https://stock.agsvpt.cn/api';
    const CONFIG = {
        API_INFO_URL: `${API_BASE_URL}/stocks/info`,
        API_HISTORY_URL: `${API_BASE_URL}/user/history?&page=1&page_size=10000`,
        API_ASSET_URL: `${API_BASE_URL}/user/asset`,
        API_LEVERAGED_URL: `${API_BASE_URL}/user/leveraged`,
        API_BANK_DEPOSIT_URL: `${API_BASE_URL}/bank/deposit`, // 银行存款API
        TARGET_TABLE_DIV: 'div.positions-container',
        TARGET_TABLE_SELECTOR: 'div.positions-container table',
        TOKEN_KEY: 'auth_token',
        HEADERS: {
            'Content-Type': 'application/json',
        },
        STORAGE_KEYS: {
            QUICK_AMOUNTS: 'agsv_quick_amounts',
            TRADE_HISTORY: 'agsv_trade_history',
            CHART_SETTINGS: 'agsv_chart_settings'
        }
    };

    // 获取身份验证的 token
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token) {
        console.warn('未找到认证Token，脚本无法运行。');
        return;
    }

    // --- 样式注入 ---
GM_addStyle(`
    /* 增强版样式 */
    .agsv-enhanced-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border: 1px solid #e1e5e9;
        max-height: 85vh;
        overflow-y: auto;
        /* 隐藏滚动条但保持滚动功能 */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        display: flex;
        flex-direction: column;
    }

    .agsv-enhanced-panel::-webkit-scrollbar {
        display: none; /* Chrome/Safari/Opera */
    }

    /* 圆形图标修复（PC和移动端都保持正圆） */
    .agsv-panel-toggle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        box-sizing: border-box;
        font-size: 20px; /* 图标大小可根据需求调整 */
        line-height: 1;
    }

    /* 如果图标用图片或 SVG，确保覆盖填充 */
    .agsv-panel-toggle img,
    .agsv-panel-toggle svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* 移动端适配，保持同尺寸 */
    @media (max-width: 768px) {
        .agsv-panel-toggle {
            width: 40px;
            height: 40px;
        }
    }



        /* 固定标题栏 */
        .agsv-panel-header {
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .agsv-panel-content {
            flex: 1;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .agsv-panel-content::-webkit-scrollbar {
            display: none;
        }



        /* 按金额购买区域 */
        .agsv-amount-purchase {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 15px;
            border: 1px solid #f4a261;
        }

        .agsv-amount-input-group {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }

        .agsv-amount-input {
            flex: 1;
            padding: 10px 12px;
            border: 2px solid #e9c46a;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            background: white;
            transition: all 0.2s ease;
        }

        .agsv-amount-input:focus {
            outline: none;
            border-color: #f4a261;
            box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.1);
        }

        .agsv-amount-convert-btn {
            padding: 10px 16px;
            background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .agsv-amount-convert-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(244, 162, 97, 0.4);
        }

        .agsv-amount-presets {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
        }

        .agsv-amount-preset {
            padding: 8px;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #e9c46a;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .agsv-amount-preset:hover {
            background: white;
            border-color: #f4a261;
            transform: translateY(-1px);
        }

        .agsv-panel-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        .agsv-panel-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .agsv-panel-toggle {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .agsv-panel-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .agsv-panel-content {
            padding: 20px;
        }

        .agsv-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
        }

        .agsv-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .agsv-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .agsv-profit-display {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 15px;
        }

        .agsv-profit-value {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .agsv-profit-label {
            font-size: 12px;
            opacity: 0.9;
        }

        /* 股票选择按钮组 */
        .agsv-stock-buttons {
            margin-bottom: 15px;
        }

        .agsv-section-subtitle {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .agsv-stock-button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
        }

        .agsv-stock-btn {
            padding: 8px 16px;
            border: 2px solid #e1e5e9;
            background: #f8f9fa;
            color: #333;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 80px;
            text-align: center;
        }

        .agsv-stock-btn:hover {
            border-color: #667eea;
            background: #667eea;
            color: white;
            transform: translateY(-1px);
        }

        .agsv-stock-btn.active {
            border-color: #667eea;
            background: #667eea;
            color: white;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        /* 数量输入区域 */
        .agsv-quantity-section {
            margin-bottom: 20px;
        }

        .agsv-input-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }

        .agsv-amount-input {
            flex-grow: 1;
        }

        .agsv-clear-btn {
            padding: 12px 16px;
            border: 1px solid #e1e5e9;
            background: #f8f9fa;
            color: #333;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .agsv-clear-btn:hover {
            background: #fa709a;
            color: white;
            border-color: #fa709a;
        }



        .agsv-quick-position-actions {
            margin-bottom: 20px;
        }

        .agsv-fill-btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .agsv-fill-btn {
             width: calc(50% - 4px); /* 每行两个按钮 */
             padding: 10px;
             border: 1px solid #e1e5e9;
             background: white;
             color: #333;
             border-radius: 6px;
             font-size: 12px;
             cursor: pointer;
             transition: all 0.2s;
             text-align: center;
        }

        .agsv-fill-btn:hover {
            background: #4facfe;
            color: white;
            border-color: #4facfe;
        }

        /* 做空按钮特殊样式 */
        .agsv-fill-btn[data-action*="short"] {
            background: #fff5f5;
            border-color: #fed7d7;
            color: #c53030;
        }

        .agsv-fill-btn[data-action*="short"]:hover {
            background: #e53e3e;
            color: white;
            border-color: #e53e3e;
        }

        /* 买入按钮特殊样式 */
        .agsv-fill-btn[data-action*="buy"] {
            background: #f0fff4;
            border-color: #c6f6d5;
            color: #2f855a;
        }

        .agsv-fill-btn[data-action*="buy"]:hover {
            background: #38a169;
            color: white;
            border-color: #38a169;
        }

        /* 卖出按钮特殊样式 */
        .agsv-fill-btn[data-action*="sell"] {
            background: #fffaf0;
            border-color: #fbd38d;
            color: #c05621;
        }

        .agsv-fill-btn[data-action*="sell"]:hover {
            background: #ed8936;
            color: white;
            border-color: #ed8936;
        }

        /* 交易按钮区域 */
        .agsv-trade-actions {
            margin-bottom: 15px;
            position: relative; /* 为Tooltip定位 */
        }

        .agsv-trade-btn-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .agsv-trade-btn[data-tooltip]:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 110%; /* 出现在按钮上方 */
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10002;
            opacity: 1;
            transition: opacity 0.2s;
        }

        .agsv-trade-btn {
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }

        .agsv-trade-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .agsv-buy-btn {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }

        .agsv-sell-btn {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
        }

        .agsv-short-btn {
            background: linear-gradient(135deg, #ff7b7b 0%, #ff9a8b 100%);
            color: white;
        }

        .agsv-cover-btn {
            background: linear-gradient(135deg, #96c93d 0%, #00b4db 100%);
            color: white;
        }

        .agsv-amount-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
            font-size: 16px;
            margin-bottom: 10px;
            transition: border-color 0.2s;
        }

        .agsv-amount-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .agsv-quick-amounts {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 15px;
        }

        .agsv-limit-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 20px;
            border-radius: 12px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid #dee2e6;
        }

        .agsv-limit-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 4px solid #667eea;
            transition: all 0.2s ease;
        }

        .agsv-limit-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .agsv-limit-label {
            font-size: 13px;
            color: #495057;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .agsv-limit-value {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }

        /* 快捷仓位按钮组 */
        .agsv-quick-position-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }

        .agsv-quick-position-actions .agsv-fill-btn {
             width: calc(50% - 4px);
        }

        .agsv-quick-amount {
            padding: 8px;
            border: 1px solid #e1e5e9;
            border-radius: 4px;
            background: #f8f9fa;
            font-size: 12px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }

        .agsv-quick-amount:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .agsv-position-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            border-left: 4px solid #667eea;
        }

        .agsv-position-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .agsv-position-details {
            font-size: 12px;
            color: #666;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .agsv-profit-positive {
            color: #28a745;
        }

        .agsv-profit-negative {
            color: #dc3545;
        }

        .agsv-chart-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .agsv-chart-btn {
            padding: 6px 12px;
            border: 1px solid #e1e5e9;
            border-radius: 4px;
            background: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .agsv-chart-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .agsv-history-item {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
        }

        .agsv-history-item:last-child {
            border-bottom: none;
        }

        .agsv-history-type {
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            margin-right: 8px;
        }

        .agsv-history-buy {
            background: #d4edda;
            color: #155724;
        }

        .agsv-history-sell {
            background: #f8d7da;
            color: #721c24;
        }

        .agsv-history-borrow {
            background: #fff3cd;
            color: #856404;
        }

        .agsv-history-repay {
            background: #d1ecf1;
            color: #0c5460;
        }

        .agsv-minimized {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: agsv-float 3s ease-in-out infinite;
        }

        .agsv-minimized:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }

        .agsv-minimized .agsv-panel-content {
            display: none;
        }

        .agsv-minimized .agsv-panel-header {
            padding: 0;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
        }

        .agsv-minimized .agsv-panel-title {
            display: none;
        }

        .agsv-minimized .agsv-panel-toggle {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        @keyframes agsv-float {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-5px); }
        }

        /* 平仓对话框 */
        .agsv-cover-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .agsv-cover-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .agsv-cover-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        }

        .agsv-cover-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .agsv-cover-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .agsv-cover-close:hover {
            background: #f5f5f5;
            color: #333;
        }

        .agsv-short-position {
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .agsv-short-position:hover {
            border-color: #667eea;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }

        .agsv-short-position.selected {
            border-color: #667eea;
            background: #f8f9ff;
        }

        .agsv-position-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .agsv-position-info {
            font-size: 14px;
            color: #666;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .agsv-cover-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .agsv-cover-btn {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .agsv-cover-confirm {
            background: linear-gradient(135deg, #e76f51 0%, #f4a261 100%);
            color: white;
        }

        .agsv-cover-confirm:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(231, 111, 81, 0.4);
        }

        .agsv-cover-confirm:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .agsv-cover-cancel {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #dee2e6;
        }

        .agsv-cover-cancel:hover {
            background: #e9ecef;
        }

        /* 股票分组样式 */
        .agsv-stock-group {
            margin-bottom: 20px;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
        }

        .agsv-stock-group-header {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e1e5e9;
        }

        .agsv-stock-name {
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        .agsv-stock-stats {
            font-size: 12px;
            color: #666;
            background: white;
            padding: 4px 8px;
            border-radius: 12px;
            border: 1px solid #dee2e6;
        }

        .agsv-stock-positions {
            padding: 12px;
        }

        .agsv-stock-positions .agsv-short-position {
            margin-bottom: 8px;
        }

        .agsv-stock-positions .agsv-short-position:last-child {
            margin-bottom: 0;
        }

        .agsv-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .agsv-tooltip.show {
            opacity: 1;
        }

        /* 做空说明样式 */
        .agsv-short-explanation {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 12px;
            line-height: 1.4;
        }

        .agsv-short-title {
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* 原始控件美化样式 - 紧凑设计 */
        .agsv-original-controls-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 16px;
            margin: 12px;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.2);
            color: white;
        }

        .agsv-controls-header {
            background: rgba(255, 243, 205, 0.95);
            color: #856404;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            line-height: 1.4;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .agsv-controls-header .tips-icon {
            font-size: 14px;
            flex-shrink: 0;
        }

        .agsv-controls-header a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }

        .agsv-controls-header a:hover {
            text-decoration: underline;
        }

        .agsv-controls-main {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 20px;
            align-items: center;
        }

        .agsv-controls-left {
            min-width: 0;
        }

        .agsv-controls-right {
            min-width: 200px;
        }

        /* 股票选择区域 */
        .agsv-stock-selection {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .agsv-section-label {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            flex-shrink: 0;
        }

        .agsv-stock-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .agsv-stock-card {
            background: rgba(255, 255, 255, 0.95);
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            position: relative;
            overflow: hidden;
            min-width: 80px;
        }

        .agsv-stock-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s;
        }

        .agsv-stock-card:hover::before {
            left: 100%;
        }

        .agsv-stock-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .agsv-stock-card.active {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
        }

        .agsv-stock-name {
            font-weight: 600;
            font-size: 13px;
            color: #333;
            margin-bottom: 2px;
        }

        .agsv-stock-card.active .agsv-stock-name {
            color: white;
        }

        .agsv-stock-change {
            font-size: 10px;
            font-weight: 500;
        }

        .agsv-stock-change.positive {
            color: #28a745;
        }

        .agsv-stock-change.negative {
            color: #dc3545;
        }

        .agsv-stock-card.active .agsv-stock-change {
            color: rgba(255, 255, 255, 0.9);
        }

        /* 时间范围选择 */
        .agsv-time-selection {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .agsv-time-buttons {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
        }

        .agsv-time-btn {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            min-width: 35px !important;
            text-align: center !important;
            position: relative !important;
        }

        .agsv-time-btn:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-1px) !important;
        }

        .agsv-time-btn._active_4fgj1_67 {
            background: rgba(255, 255, 255, 0.9) !important;
            color: #667eea !important;
            font-weight: 600 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .agsv-time-btn .chinese-label {
            display: block;
            font-size: 9px;
            opacity: 0.8;
            line-height: 1;
            margin-top: 1px;
        }

        /* 交易面板美化样式 */
        .agsv-enhanced-trade-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 12px !important;
            padding: 16px !important;
            margin: 12px !important;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.2) !important;
            color: white !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            flex-wrap: wrap !important;
        }

        /* 余额显示美化 */
        .agsv-enhanced-balance {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            padding: 12px !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            flex-shrink: 0 !important;
            min-width: 180px !important;
        }

        .agsv-enhanced-balance p {
            color: white !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            margin: 4px 0 !important;
            white-space: nowrap !important;
        }

        .agsv-enhanced-balance p:first-child {
            margin-top: 0 !important;
        }

        .agsv-enhanced-balance p:last-child {
            margin-bottom: 0 !important;
        }

        /* 数量输入区域美化 */
        .agsv-enhanced-quantity {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            flex: 1 !important;
        }

        /* 输入框美化 */
        .agsv-enhanced-input {
            background: rgba(255, 255, 255, 0.9) !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #333 !important;
            width: 200px !important;
            height: 40px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            flex-shrink: 0 !important;
        }

        .agsv-enhanced-input:focus {
            outline: none !important;
            border-color: #4facfe !important;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2) !important;
        }

        .agsv-enhanced-input::placeholder {
            color: #999 !important;
            font-weight: 500 !important;
        }

        /* 快速调整按钮美化 */
        ._quickAdjustWrapper_luodj_187 {
            display: flex !important;
            gap: 8px !important;
            align-items: center !important;
        }

        ._tieredButtons_luodj_199 {
            display: flex !important;
            gap: 4px !important;
            flex-wrap: wrap !important;
        }

        ._buttonTier_luodj_211 {
            display: flex !important;
            gap: 4px !important;
        }

        .agsv-enhanced-quick-btn {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            min-width: 45px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .agsv-enhanced-quick-btn:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .agsv-enhanced-quick-btn:active {
            transform: translateY(0) !important;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
        }

        /* 清零按钮特殊样式 */
        .agsv-enhanced-clear-btn {
            background: rgba(220, 53, 69, 0.8) !important;
            border-color: rgba(220, 53, 69, 0.9) !important;
            min-width: 50px !important;
        }

        .agsv-enhanced-clear-btn:hover {
            background: rgba(220, 53, 69, 0.9) !important;
            border-color: rgba(220, 53, 69, 1) !important;
        }

        /* 交易按钮组美化 */
        .agsv-enhanced-button-group {
            display: flex !important;
            gap: 8px !important;
            flex-shrink: 0 !important;
        }

        .agsv-enhanced-trade-btn {
            border: none !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            width: 60px !important;
            height: 40px !important;
            position: relative !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
        }

        .agsv-enhanced-trade-btn::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: -100% !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
            transition: left 0.6s !important;
        }

        .agsv-enhanced-trade-btn:hover::before {
            left: 100% !important;
        }

        .agsv-enhanced-trade-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
        }

        .agsv-enhanced-trade-btn:active {
            transform: translateY(0) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
        }

        /* 买入按钮 */
        .agsv-buy-style {
            background: linear-gradient(135deg, #28a745, #20c997) !important;
            color: white !important;
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3) !important;
        }

        .agsv-buy-style:hover {
            background: linear-gradient(135deg, #218838, #1ea080) !important;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4) !important;
        }

        /* 卖出按钮 */
        .agsv-sell-style {
            background: linear-gradient(135deg, #dc3545, #e74c3c) !important;
            color: white !important;
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3) !important;
        }

        .agsv-sell-style:hover {
            background: linear-gradient(135deg, #c82333, #c0392b) !important;
            box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4) !important;
        }

        /* 借入按钮 */
        .agsv-borrow-style {
            background: linear-gradient(135deg, #ffc107, #ffb300) !important;
            color: #333 !important;
            box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3) !important;
        }

        .agsv-borrow-style:hover {
            background: linear-gradient(135deg, #e0a800, #e69500) !important;
            box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4) !important;
        }

        /* 归还按钮 */
        .agsv-repay-style {
            background: linear-gradient(135deg, #6c757d, #5a6268) !important;
            color: white !important;
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3) !important;
        }

        .agsv-repay-style:hover {
            background: linear-gradient(135deg, #5a6268, #495057) !important;
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4) !important;
        }

        /* 股市人生分析模块样式 */
        .agsv-stock-life-analysis {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 20px 0;
            color: white;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .agsv-analysis-header {
            text-align: center;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 6px;
        }

        .agsv-analysis-header h2 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .agsv-analysis-period {
            font-size: 11px;
            opacity: 0.9;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .agsv-analysis-grid {
            display: grid;
            grid-template-columns: 3fr 2fr;
            gap: 6px;
            grid-template-areas:
                "overview types"
                "stocks stocks";
            align-items: stretch;
            grid-template-rows: auto auto;
        }

        .agsv-overview-card {
            grid-area: overview;
        }

        .agsv-type-card {
            grid-area: types;
        }

        .agsv-stocks-card {
            grid-area: stocks;
        }

        .agsv-analysis-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            padding: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .agsv-analysis-card h3 {
            margin: 0 0 8px 0;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .agsv-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }

        .agsv-stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .agsv-stat-label {
            font-size: 13px;
            opacity: 0.9;
        }

        .agsv-stat-value {
            font-weight: 600;
            font-size: 14px;
        }

        .agsv-stat-value.positive {
            color: #4ade80;
        }

        .agsv-stat-value.negative {
            color: #f87171;
        }

        .agsv-stat-value.warning {
            color: #fbbf24;
        }

        .agsv-type-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
            height: 100%;
        }

        .agsv-type-stat {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            padding: 4px;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .agsv-type-header {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 3px;
        }

        .agsv-type-icon {
            font-size: 12px;
        }

        .agsv-type-name {
            font-weight: 700;
            font-size: 11px;
            color: #fff;
            text-shadow: 0 1px 1px rgba(0,0,0,0.3);
        }

        .agsv-type-details {
            font-size: 11px;
            line-height: 1.2;
            flex: 1;
        }

        .agsv-type-details div {
            margin: 1px 0;
            color: rgba(255,255,255,0.95);
            text-shadow: 0 1px 1px rgba(0,0,0,0.3);
        }

        .agsv-stocks-table {
            width: 100%;
        }

        .agsv-stocks-analysis-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin: 0;
        }

        .agsv-stocks-analysis-table th,
        .agsv-stocks-analysis-table td {
            padding: 8px 6px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .agsv-stocks-analysis-table th {
            background: rgba(255, 255, 255, 0.1);
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        .agsv-stocks-analysis-table tbody tr:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .agsv-stock-info {
            text-align: left;
        }

        .agsv-stock-info strong {
            display: block;
            font-size: 13px;
        }

        .agsv-stock-info small {
            opacity: 0.7;
            font-size: 10px;
        }

        .agsv-no-data {
            text-align: center;
            padding: 10px;
            opacity: 0.7;
        }

        .agsv-has-holding {
            background: rgba(255, 255, 255, 0.05) !important;
        }

        .agsv-holding-badge {
            background: #4ade80;
            color: white;
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 4px;
            font-weight: 600;
        }

        /* 统计区域样式重设计 - 超紧凑版 */
        .agsv-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            height: 100%;
        }

        .agsv-stat-section {
            background: rgba(255,255,255,0.12);
            border-radius: 4px;
            padding: 6px;
            border: 1px solid rgba(255,255,255,0.25);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .agsv-stat-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #4CAF50, #45a049);
        }

        .agsv-stat-section h4 {
            margin: 0 0 4px 0;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 3px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        /* 不同类型的统计区域颜色 */
        .agsv-stat-section.agsv-realized-section::before {
            background: linear-gradient(90deg, #FFD700, #FFA500);
        }

        .agsv-stat-section.agsv-trading-section::before {
            background: linear-gradient(90deg, #2196F3, #1976D2);
        }

        .agsv-stat-section.agsv-position-section::before {
            background: linear-gradient(90deg, #9C27B0, #7B1FA2);
        }

        .agsv-stat-section.agsv-total-section::before {
            background: linear-gradient(90deg, #FF5722, #D84315);
        }

        .agsv-stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 4px;
            margin-bottom: 2px;
            background: rgba(255,255,255,0.08);
            border-radius: 3px;
            border-left: 2px solid transparent;
            min-height: 16px;
        }

        .agsv-stat-item:hover {
            background: rgba(255,255,255,0.12);
            transform: translateX(1px);
        }

        .agsv-stat-item:last-child {
            margin-bottom: 0;
        }

        .agsv-stat-item.agsv-highlight {
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
            border: 1px solid rgba(255,255,255,0.2);
            border-left: 2px solid #FFD700;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(255, 215, 0, 0.15);
        }

        .agsv-stat-label {
            font-size: 11px;
            color: rgba(255,255,255,0.95);
            font-weight: 600;
            text-shadow: 0 1px 1px rgba(0,0,0,0.3);
        }

        .agsv-stat-value {
            font-weight: 700;
            font-size: 11px;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .agsv-stat-value.positive {
            color: #12FF1D;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .agsv-stat-value.negative {
            color: #FF2823;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        /* 大数值样式 - 保持与右边一致 */
        .agsv-stat-value.large {
            font-size: 14px;
            font-weight: 700;
        }

        /* 百分比样式 */
        .agsv-stat-value.percentage::after {
            content: '%';
            font-size: 12px;
            opacity: 0.8;
            margin-left: 2px;
        }

        /* 统计卡片动画 */
        .agsv-stat-section {
            animation: agsv-fadeInUp 0.6s ease-out;
        }

        .agsv-stat-section:nth-child(1) { animation-delay: 0.1s; }
        .agsv-stat-section:nth-child(2) { animation-delay: 0.2s; }
        .agsv-stat-section:nth-child(3) { animation-delay: 0.3s; }
        .agsv-stat-section:nth-child(4) { animation-delay: 0.4s; }

        @keyframes agsv-fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 数值跳动效果 */
        .agsv-stat-value.large {
            animation: agsv-pulse 2s ease-in-out infinite;
        }

        @keyframes agsv-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
            .agsv-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
            }

            .agsv-stat-section {
                padding: 16px;
            }
        }

        @media (max-width: 768px) {
            .agsv-stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .agsv-stat-section {
                padding: 14px;
            }

            .agsv-stat-section h4 {
                font-size: 16px;
            }

            .agsv-stat-item {
                padding: 10px 12px;
            }

            .agsv-stat-value {
                font-size: 14px;
            }

            .agsv-stat-value.large {
                font-size: 16px;
            }
        }

        /* 个股行样式 */
        .agsv-stock-row.long-position {
            background: rgba(76, 175, 80, 0.1);
            border-left: 3px solid #4CAF50;
        }

        .agsv-stock-row.short-position {
            background: rgba(244, 67, 54, 0.1);
            border-left: 3px solid #f44336;
        }

        .agsv-stock-row.mixed-position {
            background: rgba(255, 193, 7, 0.1);
            border-left: 3px solid #FFC107;
        }

        .agsv-stock-row.no-position {
            background: rgba(158, 158, 158, 0.1);
            border-left: 3px solid #9E9E9E;
        }

        /* 持仓详情样式 */
        .agsv-position-cell {
            min-width: 180px;
            text-align: left !important;
        }

        .agsv-position-mixed {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .agsv-long-detail,
        .agsv-short-detail,
        .agsv-position-long,
        .agsv-position-short,
        .agsv-position-none {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .agsv-long-detail,
        .agsv-position-long {
            background: rgba(76, 175, 80, 0.2);
            color: #12FF1D;
        }

        .agsv-short-detail,
        .agsv-position-short {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }

        .agsv-position-none {
            background: rgba(158, 158, 158, 0.2);
            color: #5C5959;
        }

        .agsv-position-icon {
            font-size: 14px;
        }

        .agsv-position-text {
            font-weight: bold;
        }

        .agsv-position-price {
            font-size: 11px;
            opacity: 0.8;
        }

        .agsv-profit-rate {
            display: block;
            font-size: 11px;
            opacity: 0.8;
            margin-top: 2px;
        }

        /* 价格显示样式 */
        .agsv-current-price {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        .agsv-price-value {
            font-weight: bold;
            font-size: 14px;
            color: #fff;
        }

        .agsv-price-label {
            font-size: 10px;
            opacity: 0.7;
            color: #fff;
        }

        .agsv-no-price {
            color: #9E9E9E;
            font-style: italic;
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
            .agsv-controls-main {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .agsv-controls-right {
                min-width: auto;
            }

            .agsv-analysis-grid {
                grid-template-columns: 1fr;
                grid-template-areas:
                    "overview"
                    "types"
                    "stocks";
            }

            .agsv-stats-grid {
                grid-template-columns: 1fr;
            }

            .agsv-type-stats {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .agsv-enhanced-panel {
                width: 90%;
                right: 5%;
                top: 10px;
            }

            .agsv-quick-trade {
                grid-template-columns: 1fr;
            }

            .agsv-quick-amounts {
                grid-template-columns: repeat(3, 1fr);
            }

            .agsv-original-controls-container {
                margin: 8px;
                padding: 16px;
            }

            .agsv-controls-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .agsv-stock-grid {
                grid-template-columns: 1fr;
            }

            .agsv-time-buttons {
                justify-content: center;
            }

            .agsv-controls-title {
                font-size: 16px;
            }
        }

        @media (max-width: 480px) {
            .agsv-original-controls-container {
                margin: 4px;
                padding: 12px;
            }

            .agsv-stock-selection,
            .agsv-time-selection {
                padding: 12px;
            }

            .agsv-stock-card {
                padding: 10px 6px;
            }

            .agsv-time-btn {
                padding: 6px 8px !important;
                font-size: 11px !important;
            }
        }

        /* 动画效果 */
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .agsv-enhanced-panel {
            animation: slideIn 0.3s ease-out;
        }

        /* 表格增强样式 */
        .agsv-enhanced-table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
        }

        .agsv-enhanced-table th,
        .agsv-enhanced-table td {
            padding: 8px 12px;
            text-align: center;
            border: 1px solid #e1e5e9;
        }

        .agsv-enhanced-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            font-size: 12px;
        }

        .agsv-enhanced-table tr:nth-child(even) {
            background: #f8f9fa;
        }

        .agsv-enhanced-table tr:hover {
            background: #e3f2fd;
        }
    `);

    // --- 1. API 请求模块 ---
    function fetchApiData(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url,
                responseType: options.responseType || 'json', // 修复：正确使用传入的响应类型
                timeout: 10000,
                headers: {
                    'authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                data: options.data ? JSON.stringify(options.data) : undefined,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        // 对于200状态，也需要检查响应内容是否包含错误
                        let responseData = response.response;

                        // 如果是JSON字符串，尝试解析
                        if (typeof responseData === 'string') {
                            try {
                                responseData = JSON.parse(responseData);
                            } catch (parseError) {
                                // 解析失败，保持原始字符串
                            }
                        }

                        resolve(responseData);
                    } else {
                        // 对于400错误，尝试解析响应数据
                        const error = new Error(`HTTP Error: ${response.status}`);
                        if (response.status === 400 && response.response) {
                            try {
                                // 尝试解析JSON响应
                                const errorData = typeof response.response === 'string'
                                    ? JSON.parse(response.response)
                                    : response.response;
                                error.response = errorData;
                                error.data = errorData;
                            } catch (parseError) {
                                // 解析失败，使用原始响应
                                error.response = response.response;
                            }
                        }
                        reject(error);
                    }
                },
                onerror: response => reject(new Error('请求失败: ' + response.statusText)),
                ontimeout: () => reject(new Error('请求超时')),
            });
        });
    }

    // --- 2. 数据管理模块 ---
    class DataManager {
        constructor() {
            this.cache = new Map();
            this.updateCallbacks = new Set();
        }

        async getStockInfo() {
            try {
                const data = await fetchApiData(CONFIG.API_INFO_URL);
                this.cache.set('stockInfo', data);
                this.notifyUpdate('stockInfo', data);
                return data;
            } catch (error) {
                console.error('获取股票信息失败:', error);
                throw error;
            }
        }

        async getUserAsset() {
            try {
                const data = await fetchApiData(CONFIG.API_ASSET_URL);
                this.cache.set('userAsset', data);
                this.cache.set('assetData', data); // 同时存储为assetData
                this.notifyUpdate('userAsset', data);
                return data;
            } catch (error) {
                console.error('获取用户资产失败:', error);
                throw error;
            }
        }

        async getLeveraged() {
            try {
                const data = await fetchApiData(CONFIG.API_LEVERAGED_URL);
                this.cache.set('leveraged', data);
                this.notifyUpdate('leveraged', data);
                return data;
            } catch (error) {
                console.error('获取做空持仓失败:', error);
                throw error;
            }
        }

        async getHistory() {
            try {
                const data = await fetchApiData(CONFIG.API_HISTORY_URL);
                this.cache.set('history', data);
                this.notifyUpdate('history', data);
                return data;
            } catch (error) {
                console.error('获取交易历史失败:', error);
                throw error;
            }
        }

        async getBankDeposit() {
            console.log('[LOG] 开始获取银行存款...');
            try {
                const htmlContent = await fetchApiData('https://pt.agsvpt.cn/plugin/bank', { responseType: 'text' });
                console.log('[LOG] 银行页面内容获取成功。');

                let deposit = 0;
                // 最终、最可靠的方法：使用正则表达式直接从HTML字符串中匹配
                const match = htmlContent.match(/存款金额<\/td>\s*<td[^>]*>([\d,.]+)</);

                if (match && match[1]) {
                    const depositText = match[1].replace(/,/g, '');
                    deposit = parseFloat(depositText) || 0;
                    console.log(`[LOG] 正则匹配成功！存款金额: ${depositText}, 解析为: ${deposit}`);
                } else {
                    console.warn('[LOG] 警告: 正则表达式无法在银行页面匹配到 "存款金额"。将使用默认值 0。');
                }

                this.cache.set('bankDeposit', deposit);
                this.notifyUpdate('bankDeposit', deposit);
                return deposit;
            } catch (error) {
                console.error('获取银行存款失败:', error);
                this.cache.set('bankDeposit', 0);
                this.notifyUpdate('bankDeposit', 0);
                throw error;
            }
        }

        async executeTrade(stockCode, action, quantity) {
            const actionMap = {
                'buy': 'buy',
                'sell': 'sell',
                'short': 'borrow',  // 做空映射到借入
                'cover': 'repay',   // 平仓映射到归还
                'borrow': 'borrow', // 保留兼容性
                'repay': 'repay'    // 保留兼容性
            };

            try {
                const url = `${API_BASE_URL}/stocks/${stockCode}/${actionMap[action]}`;
                const data = await fetchApiData(url, {
                    method: 'POST',
                    data: { quantity: parseInt(quantity) }
                });

                setTimeout(() => {
                    this.getUserAsset();
                    this.getLeveraged();
                    this.getHistory();
                }, 500);

                return data;
            } catch (error) {
                console.error(`${action}操作失败:`, error);

                // 特殊处理做空操作的400错误，解析最大可借量
                if (action === 'short' && error.message && error.message.includes('400')) {
                    try {
                        // 尝试从错误响应中解析最大可借量
                        const errorResponse = error.response || error.data;

                        if (errorResponse && errorResponse.msg) {
                            const msg = errorResponse.msg;

                            // 解析类似 "借入数量超过最大可借量，最大可借：44.0 股" 的消息
                            const match = msg.match(/最大可借[：:]\s*(\d+(?:\.\d+)?)\s*股/);

                            if (match) {
                                const maxBorrowable = parseFloat(match[1]);

                                const customError = new Error(`做空数量超限，最大可借：${maxBorrowable}股`);
                                customError.maxBorrowable = maxBorrowable;
                                customError.originalMessage = msg;
                                throw customError;
                            }
                        }
                    } catch (parseError) {
                        // 如果是我们自定义的错误，直接重新抛出
                        if (parseError.maxBorrowable !== undefined) {
                            throw parseError;
                        }
                        // 其他解析错误，继续抛出原错误
                    }
                }

                throw error;
            }
        }

        onUpdate(callback) {
            this.updateCallbacks.add(callback);
        }

        notifyUpdate(type, data) {
            this.updateCallbacks.forEach(callback => {
                try {
                    callback(type, data);
                } catch (error) {
                    console.error('更新回调执行失败:', error);
                }
            });
        }

        getCached(key) {
            return this.cache.get(key);
        }
    }

    // --- 3. UI组件模块 ---
    class EnhancedUI {
        constructor(dataManager) {
            this.dataManager = dataManager;
            this.isMinimized = false;
            this.selectedStock = '';
            this.quickAmounts = GM_getValue(CONFIG.STORAGE_KEYS.QUICK_AMOUNTS, [10, 50, 100, 500, 1000, 2000]);
            this.init();
        }

        init() {
            this.createPanel();
            this.bindEvents();
            this.dataManager.onUpdate((type, data) => this.handleDataUpdate(type, data));
            this.loadData();

            // 默认收缩状态
            this.isMinimized = true;
            this.panel.classList.add('agsv-minimized');
            const toggle = this.panel.querySelector('.agsv-panel-toggle');
            toggle.textContent = '+';
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'agsv-enhanced-panel';
            panel.innerHTML = `
                <div class="agsv-panel-header">
                    <h3 class="agsv-panel-title">AGSV增强版 v3.3</h3>
                    <button class="agsv-panel-toggle">−</button>
                </div>
                <div class="agsv-panel-content">
                    ${this.createAssetAnalysisSection()}
                    ${this.createShortLimitDisplay()}
                    ${this.createTradeSection()}
                    ${this.createHistorySection()}
                </div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
            this.makeDraggable(panel);
        }

        createAssetAnalysisSection() {
            return `
                <div class="agsv-section">
                    <div class="agsv-section-title">📊 资产分析</div>
                    <div class="agsv-limit-grid">
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">💰 账户总资产</div>
                            <div class="agsv-limit-value" id="agsv-total-assets">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📈 多头市值</div>
                            <div class="agsv-limit-value" id="agsv-long-value">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">💎 冰晶余额</div>
                            <div class="agsv-limit-value" id="agsv-cash-balance">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">🏦 银行存款</div>
                            <div class="agsv-limit-value" id="agsv-bank-deposit">计算中...</div>
                        </div>
                    </div>

                    <div class="agsv-section-title" style="margin-top: 20px;">💹 预计收益分析</div>
                    <div class="agsv-limit-grid">
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📊 多头预计收益</div>
                            <div class="agsv-limit-value" id="agsv-long-profit">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📉 空头预计收益</div>
                            <div class="agsv-limit-value" id="agsv-short-profit">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📈 多头收益率</div>
                            <div class="agsv-limit-value" id="agsv-long-rate">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📉 空头收益率</div>
                            <div class="agsv-limit-value" id="agsv-short-rate">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">💰 总预计收益</div>
                            <div class="agsv-limit-value" id="agsv-total-profit">计算中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📊 总收益率</div>
                            <div class="agsv-limit-value" id="agsv-total-rate">计算中...</div>
                        </div>
                    </div>
                </div>
            `;
        }

        createShortExplanation() {
            return `
                <div class="agsv-section">
                    <div class="agsv-short-explanation">
                        <div class="agsv-short-title">📈 做空说明</div>
                        <div>做空操作：借入股票后立即按当前价格卖出，当股价下跌时通过平仓操作买回归还，从价差中获利。做空成本包括借入价格和利息费用。</div>
                    </div>
                </div>
            `;
        }

        createShortLimitDisplay() {
            return `
                <div class="agsv-section">
                    <div class="agsv-section-title">💰 做空额度</div>
                    <div class="agsv-limit-grid">
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">🎯 总额度</div>
                            <div class="agsv-limit-value" id="agsv-short-total">查询中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">📊 已用额度</div>
                            <div class="agsv-limit-value" id="agsv-short-used">查询中...</div>
                        </div>
                        <div class="agsv-limit-item">
                            <div class="agsv-limit-label">✨ 可用额度</div>
                            <div class="agsv-limit-value" id="agsv-short-available">查询中...</div>
                        </div>
                    </div>
                </div>
            `;
        }

        createProfitDisplay() {
            return `
                <div class="agsv-section">
                    <div class="agsv-profit-display">
                        <div class="agsv-profit-value" id="agsv-total-profit">计算中...</div>
                        <div class="agsv-profit-label">总预计收益</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px; border-radius: 6px; text-align: center; margin-top: 10px;">
                        <div style="font-size: 18px; font-weight: 600;" id="agsv-cash-balance">余额加载中...</div>
                        <div style="font-size: 11px; opacity: 0.9;">冰晶数量（可用余额）</div>
                    </div>
                </div>
            `;
        }

        createTradeSection() {
            return `
                <div class="agsv-section">
                    <div class="agsv-section-title">📈 智能交易</div>

                    <!-- 股票选择按钮组 -->
                    <div class="agsv-stock-buttons" id="agsv-stock-buttons">
                        <div class="agsv-section-subtitle">选择股票</div>
                        <!-- 股票按钮将在这里动态生成 -->
                    </div>

                    <!-- 按金额购买 -->
                    <div class="agsv-amount-purchase">
                        <div class="agsv-section-subtitle">💰 按金额购买</div>
                        <div class="agsv-amount-input-group">
                            <input type="number" class="agsv-amount-input" id="agsv-purchase-amount" placeholder="输入购买金额" min="0" step="100">
                            <button class="agsv-amount-convert-btn" id="agsv-convert-amount">转换为股数</button>
                        </div>
                        <div class="agsv-amount-presets">
                            <div class="agsv-amount-preset" data-amount="1000">1千</div>
                            <div class="agsv-amount-preset" data-amount="5000">5千</div>
                            <div class="agsv-amount-preset" data-amount="10000">1万</div>
                            <div class="agsv-amount-preset" data-amount="50000">5万</div>
                        </div>
                    </div>

                    <!-- 数量输入 -->
                    <div class="agsv-quantity-section">
                         <div class="agsv-section-subtitle">输入交易数量</div>
                        <!-- 数量输入与清空 -->
                        <div class="agsv-input-group">
                            <input type="number" id="agsv-amount-input" class="agsv-amount-input" placeholder="输入数量或点击下方按钮填充" min="1" max="10000">
                            <button class="agsv-clear-btn" id="agsv-clear-amount">清空</button>
                        </div>

                        <!-- 快速数量选择 -->
                        <div class="agsv-quick-amounts" id="agsv-quick-amounts">
                            ${this.quickAmounts.map(amount => `<div class="agsv-quick-amount" data-amount="${amount}">${amount}</div>`).join('')}
                        </div>
                    </div>

                    <!-- 快捷仓位操作 -->
                    <div class="agsv-quick-position-actions">
                         <div class="agsv-section-subtitle">快捷仓位 (填充数量)</div>
                         <div class="agsv-fill-btn-group">
                            <button class="agsv-fill-btn" data-action="buy-all">全仓买入</button>
                            <button class="agsv-fill-btn" data-action="sell-all">清仓卖出</button>
                            <button class="agsv-fill-btn" data-action="buy-half">半仓买入</button>
                            <button class="agsv-fill-btn" data-action="buy-quarter">1/4仓买入</button>
                            <button class="agsv-fill-btn" data-action="short-all">全仓做空</button>
                            <button class="agsv-fill-btn" data-action="short-half">半仓做空</button>
                         </div>
                    </div>

                    <!-- 核心交易操作 -->
                    <div class="agsv-trade-actions">
                        <div class="agsv-section-subtitle">核心操作</div>
                        <div class="agsv-trade-btn-row">
                            <button class="agsv-trade-btn agsv-buy-btn" data-action="buy" data-tooltip="以当前市价买入指定数量的股票">买入</button>
                            <button class="agsv-trade-btn agsv-sell-btn" data-action="sell" data-tooltip="卖出您持有的指定数量的股票">卖出</button>
                            <button class="agsv-trade-btn agsv-short-btn" data-action="short" data-tooltip="借入股票并立即卖出，预期股价下跌时获利">做空</button>
                            <button class="agsv-trade-btn agsv-cover-btn" data-action="cover" data-tooltip="买回并归还之前做空的股票，以锁定收益或止损">平仓</button>
                        </div>
                    </div>
                </div>
            `;
        }

        createPositionsSection() {
            return `
                <div class="agsv-section">
                    <div class="agsv-section-title">💼 持仓概览</div>
                    <div id="agsv-positions-list"></div>
                </div>
            `;
        }

        createHistorySection() {
            return `
                <div class="agsv-section">
                    <div class="agsv-section-title">📊 最近交易</div>
                    <div id="agsv-history-list" style="max-height: 200px; overflow-y: auto;"></div>
                </div>
            `;
        }

        bindEvents() {
            // 面板最小化/最大化
            this.panel.querySelector('.agsv-panel-toggle').addEventListener('click', () => {
                this.toggleMinimize();
            });

            // 双击标题隐藏面板
            this.panel.querySelector('.agsv-panel-title').addEventListener('dblclick', () => {
                this.toggleMinimize();
            });

            // ESC键隐藏面板
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.panel && !this.isMinimized) {
                    this.toggleMinimize();
                }
            });

            // 按金额购买功能
            this.panel.querySelector('#agsv-convert-amount').addEventListener('click', () => {
                this.convertAmountToShares();
            });

            // 金额预设按钮
            this.panel.querySelector('.agsv-amount-presets').addEventListener('click', (e) => {
                if (e.target.classList.contains('agsv-amount-preset')) {
                    const amount = e.target.dataset.amount;
                    this.panel.querySelector('#agsv-purchase-amount').value = amount;
                }
            });

            // 股票选择按钮
            this.panel.querySelector('#agsv-stock-buttons').addEventListener('click', (e) => {
                const stockButton = e.target.closest('.agsv-stock-btn');
                if (stockButton) {
                    // 移除其他按钮的active状态
                    this.panel.querySelectorAll('.agsv-stock-btn').forEach(btn => btn.classList.remove('active'));
                    // 添加当前按钮的active状态
                    stockButton.classList.add('active');
                    // 设置选中的股票
                    this.selectedStock = stockButton.dataset.stock;
                    this.updateTradeButtons();
                }
            });

            // 快捷仓位按钮 (填充数量)
            this.panel.querySelector('.agsv-quick-position-actions').addEventListener('click', async (e) => {
                const fillButton = e.target.closest('.agsv-fill-btn');
                if (fillButton) {
                    const action = fillButton.dataset.action;
                    const amount = await this.calculateSpecialAmount(action);
                    if (amount > 0) {
                        this.panel.querySelector('#agsv-amount-input').value = amount;
                    }
                }
            });

            // 清空数量按钮
            this.panel.querySelector('#agsv-clear-amount').addEventListener('click', () => {
                this.panel.querySelector('#agsv-amount-input').value = '';
            });

            // 快速金额选择
            this.panel.querySelector('#agsv-quick-amounts').addEventListener('click', (e) => {
                if (e.target.classList.contains('agsv-quick-amount')) {
                    const amount = e.target.dataset.amount;
                    this.panel.querySelector('#agsv-amount-input').value = amount;
                }
            });

            // 核心交易按钮
            this.panel.querySelector('.agsv-trade-actions').addEventListener('click', (e) => {
                const tradeButton = e.target.closest('.agsv-trade-btn');
                if (tradeButton) {
                    const action = tradeButton.dataset.action;
                    if (action === 'cover') {
                        this.showCoverDialog();
                    } else {
                        this.handleTradeAction(action);
                    }
                }
            });

            // 数量输入验证
            const amountInput = this.panel.querySelector('#agsv-amount-input');
            amountInput.addEventListener('input', () => {
                this.validateAmount();
            });
        }

        makeDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const header = element.querySelector('.agsv-panel-header');

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                if (e.target.classList.contains('agsv-panel-toggle')) return;

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.panel.classList.toggle('agsv-minimized', this.isMinimized);
            const toggle = this.panel.querySelector('.agsv-panel-toggle');
            toggle.textContent = this.isMinimized ? '+' : '−';
        }



        convertAmountToShares() {
            const amountInput = this.panel.querySelector('#agsv-purchase-amount');
            const quantityInput = this.panel.querySelector('#agsv-amount-input');
            const amount = parseFloat(amountInput.value);

            if (!amount || amount <= 0) {
                this.showNotification('请输入有效的购买金额', 'error');
                return;
            }

            if (!this.selectedStock) {
                this.showNotification('请先选择股票', 'error');
                return;
            }

            // 从股票信息中获取价格
            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const selectedStockInfo = stockInfo.find(stock => stock.code === this.selectedStock);

            if (!selectedStockInfo) {
                this.showNotification('无法找到股票信息', 'error');
                return;
            }

            const stockPrice = selectedStockInfo.price;
            if (!stockPrice || stockPrice <= 0) {
                this.showNotification('无法获取股票价格', 'error');
                return;
            }

            const shares = Math.floor(amount / stockPrice);
            if (shares <= 0) {
                this.showNotification('购买金额不足以购买1股', 'error');
                return;
            }

            quantityInput.value = shares;
            const actualAmount = shares * stockPrice;
            this.showNotification(`${amount}元可购买${shares}股，实际金额${actualAmount.toFixed(2)}元`, 'success');
        }

        showCoverDialog() {
            // 获取所有做空持仓
            const leveragedData = this.dataManager.getCached('leveraged');
            if (!leveragedData || !leveragedData.data) {
                this.showNotification('无法获取做空持仓数据', 'error');
                return;
            }

            if (leveragedData.data.length === 0) {
                this.showNotification('当前没有做空持仓', 'warning');
                return;
            }

            // 根据日期计算T+1状态
            const positionsWithStatus = this.calculateT1Status(leveragedData.data);

            if (positionsWithStatus.filter(pos => pos.canRepay).length === 0) {
                this.showNotification('所有做空持仓都受T+1限制，明日可平仓', 'warning');
                return;
            }

            this.createCoverDialog(positionsWithStatus);
        }

        calculateT1Status(shortPositions) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            return shortPositions.map(position => {
                // 将时间戳转换为日期（只考虑日期，不考虑时间）
                const borrowDate = new Date(position.time);
                const borrowDay = new Date(borrowDate.getFullYear(), borrowDate.getMonth(), borrowDate.getDate());

                // 计算日期差（以天为单位）
                const daysDiff = Math.floor((today - borrowDay) / (1000 * 60 * 60 * 24));

                // T+1规则：借入当天不能平仓，第二天开始可以平仓
                const canRepay = daysDiff >= 1;

                return {
                    ...position,
                    canRepay: canRepay,
                    daysSinceBorrow: daysDiff
                };
            });
        }

        createCoverHelpText(shortPositions) {
            const canRepayCount = shortPositions.filter(pos => pos.canRepay).length;
            const totalCount = shortPositions.length;

            if (canRepayCount === totalCount) {
                return ''; // 所有持仓都可以平仓，不需要提示
            } else if (canRepayCount === 0) {
                return '<div style="background: #fef3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 12px; margin-bottom: 16px; color: #856404;"><strong>⚠️ 注意：</strong> 所有持仓都受T+1限制，明日可平仓</div>';
            } else {
                return `<div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 12px; margin-bottom: 16px; color: #0c5460;"><strong>💡 提示：</strong> ${canRepayCount}/${totalCount} 个持仓可立即平仓，其余受T+1限制</div>`;
            }
        }

        createCoverDialog(shortPositions) {
            // 移除已存在的对话框
            const existingDialog = document.querySelector('.agsv-cover-dialog');
            if (existingDialog) {
                existingDialog.remove();
            }

            const dialog = document.createElement('div');
            dialog.className = 'agsv-cover-dialog';

            // 按股票分组
            const groupedPositions = this.groupPositionsByStock(shortPositions);

            dialog.innerHTML = `
                <div class="agsv-cover-content">
                    <div class="agsv-cover-header">
                        <div class="agsv-cover-title">平仓管理 - 所有做空持仓</div>
                        <button class="agsv-cover-close">×</button>
                    </div>
                    <div class="agsv-cover-body">
                        <p style="margin-bottom: 16px; color: #666;">选择要平仓的做空持仓：</p>
                        ${this.createCoverHelpText(shortPositions)}
                        <div class="agsv-short-positions">
                            ${this.createGroupedPositionsHTML(groupedPositions)}
                        </div>
                    </div>
                    <div class="agsv-cover-actions">
                        <button class="agsv-cover-btn agsv-cover-cancel">取消</button>
                        <button class="agsv-cover-btn agsv-cover-confirm" disabled>确认平仓</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);
            this.bindCoverDialogEvents(dialog, shortPositions);
        }

        groupPositionsByStock(shortPositions) {
            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const groups = {};

            shortPositions.forEach((position, index) => {
                const stockData = stockInfo.find(stock => stock.code === position.code);
                const stockName = stockData ? stockData.name : position.name || position.code;

                if (!groups[position.code]) {
                    groups[position.code] = {
                        code: position.code,
                        name: stockName,
                        positions: []
                    };
                }

                groups[position.code].positions.push({
                    ...position,
                    originalIndex: index
                });
            });

            return Object.values(groups);
        }

        createGroupedPositionsHTML(groupedPositions) {
            return groupedPositions.map(group => {
                const canRepayCount = group.positions.filter(pos => pos.canRepay).length;
                const totalCount = group.positions.length;

                return `
                    <div class="agsv-stock-group">
                        <div class="agsv-stock-group-header">
                            <div class="agsv-stock-name">${group.name} (${group.code})</div>
                            <div class="agsv-stock-stats">${canRepayCount}/${totalCount} 可平仓</div>
                        </div>
                        <div class="agsv-stock-positions">
                            ${group.positions.map(pos => this.createPositionItem(pos, pos.originalIndex)).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        createPositionItem(position, index) {
            const profit = (position.loan_price - position.current_price) * position.shares;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';

            const canRepayClass = position.canRepay ? '' : 'disabled';
            const canRepayStyle = position.canRepay ? '' : 'opacity: 0.5; cursor: not-allowed;';

            // 更详细的状态文字
            let statusText = '';
            if (!position.canRepay) {
                const borrowDate = new Date(position.time);
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                statusText = `<div style="color: #f59e0b; font-size: 12px; margin-top: 4px;">⚠️ T+1限制，${tomorrow.toLocaleDateString()} 可平仓</div>`;
            } else {
                statusText = '<div style="color: #10b981; font-size: 12px; margin-top: 4px;">✅ 可立即平仓</div>';
            }

            return `
                <div class="agsv-short-position ${canRepayClass}" data-index="${index}" data-id="${position.id}" style="${canRepayStyle}">
                    <div class="agsv-position-header">
                        <div style="font-weight: 600;">${position.shares}股 @ ${position.loan_price.toFixed(2)}</div>
                        <div style="color: ${profitColor}; font-weight: 600;">
                            ${profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                        </div>
                    </div>
                    <div class="agsv-position-info">
                        <div>借入价格: ${position.loan_price.toFixed(2)}</div>
                        <div>当前价格: ${position.current_price.toFixed(2)}</div>
                        <div>借入时间: ${new Date(position.time).toLocaleString()}</div>
                        <div>利息: ${position.interest.toFixed(2)}</div>
                    </div>
                    ${statusText}
                </div>
            `;
        }

        bindCoverDialogEvents(dialog, shortPositions) {
            let selectedPosition = null;
            const confirmBtn = dialog.querySelector('.agsv-cover-confirm');

            // 关闭对话框
            dialog.querySelector('.agsv-cover-close').addEventListener('click', () => {
                dialog.remove();
            });

            dialog.querySelector('.agsv-cover-cancel').addEventListener('click', () => {
                dialog.remove();
            });

            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    dialog.remove();
                }
            });

            // 选择持仓
            dialog.querySelectorAll('.agsv-short-position').forEach(positionEl => {
                positionEl.addEventListener('click', () => {
                    const index = parseInt(positionEl.dataset.index);
                    const position = shortPositions[index];

                    // 检查是否可以平仓
                    if (!position.canRepay) {
                        this.showNotification('该持仓受T+1限制，明日可平仓', 'warning');
                        return;
                    }

                    // 移除其他选中状态
                    dialog.querySelectorAll('.agsv-short-position').forEach(el => {
                        el.classList.remove('selected');
                    });

                    // 选中当前项
                    positionEl.classList.add('selected');
                    selectedPosition = position;
                    confirmBtn.disabled = false;
                });
            });

            // 确认平仓
            confirmBtn.addEventListener('click', async () => {
                if (!selectedPosition) return;

                try {
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = '平仓中...';

                    // 执行平仓操作
                    const result = await this.executeCover(selectedPosition);

                    dialog.remove();

                    // 根据返回结果显示消息
                    if (result && result.msg) {
                        if (result.msg.includes('成功') || result.msg.includes('success')) {
                            this.showNotification(`平仓成功: ${selectedPosition.shares}股 - ${result.msg}`, 'success');
                        } else {
                            this.showNotification(`平仓响应: ${result.msg}`, 'info');
                        }
                    } else {
                        this.showNotification(`平仓成功: ${selectedPosition.shares}股`, 'success');
                    }

                    // 自动刷新页面
                    this.refreshPageAfterOperation();
                } catch (error) {
                    this.showNotification(`平仓失败: ${error.message}`, 'error');
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = '确认平仓';
                }
            });
        }

        async executeCover(position) {
            // 使用正确的平仓API参数
            const url = `${API_BASE_URL}/stocks/${position.code}/repay`;
            const data = await fetchApiData(url, {
                method: 'POST',
                data: {
                    order_id: position.id,  // 使用order_id而不是position_id
                    quantity: 0  // 平仓时quantity固定为0
                }
            });

            // 检查响应是否成功
            if (data && data.msg) {
                // 检查是否包含成功信息
                if (data.msg.includes('成功') || data.msg.includes('success')) {
                    // 刷新数据
                    setTimeout(() => {
                        this.dataManager.getUserAsset();
                        this.dataManager.getLeveraged();
                        this.dataManager.getHistory();
                    }, 500);
                    return data;
                } else {
                    // 服务器返回了错误消息
                    throw new Error(data.msg);
                }
            }

            return data;
        }

        refreshPageAfterOperation() {
            // 收缩面板
            if (!this.isMinimized) {
                this.toggleMinimize();
            }

            // 延迟刷新页面，让用户看到成功消息
            setTimeout(() => {
                this.showNotification('正在刷新页面...', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }, 2000);
        }

        async loadData() {
            try {
                // 优先加载银行存款，确保额度计算有数据源
                await this.dataManager.getBankDeposit();

                // 然后并行加载其他数据
                await Promise.all([
                    this.dataManager.getStockInfo(),
                    this.dataManager.getUserAsset(),
                    this.dataManager.getLeveraged(),
                    this.dataManager.getHistory()
                ]);

                console.log('所有数据加载完成');
            } catch (error) {
                console.error('加载数据失败:', error);
                this.showNotification('数据加载失败: ' + error.message, 'error');
            }
        }

        handleDataUpdate(type, data) {
            this.updateAssetAnalysis();
            if (type === 'stockInfo') this.updateStockSelect(data);
            if (type === 'history') this.updateHistory(data);
            if (type === 'leveraged' || type === 'bankDeposit') this.updateShortLimitDisplay();
        }

        updateAssetAnalysis() {
            const assetData = this.dataManager.getCached('userAsset');
            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const bankDeposit = this.dataManager.getCached('bankDeposit');
            const historyData = this.dataManager.getCached('history');
            const leveragedData = this.dataManager.getCached('leveraged');

            if (!assetData || bankDeposit === undefined) return;

            const cash = assetData.cash || 0;

            // 修正：使用实时价格计算多头市值
            let longValue = 0;
            let longProfit = 0;
            let longCost = 0;

            if (assetData.portfolio && stockInfo.length > 0) {
                const pricesMap = new Map(stockInfo.map(s => [s.name, s.price]));

                // 计算多头持仓的成本和收益
                if (historyData && historyData.data) {
                    const calculatedHoldings = calculatePortfolioPerformance(historyData.data, stockInfo);

                    assetData.portfolio.forEach(pos => {
                        const currentPrice = pricesMap.get(pos.name) || 0;
                        const currentValue = pos.shares * currentPrice;
                        longValue += currentValue;

                        // 从计算结果中获取成本和收益
                        const stockData = Object.values(calculatedHoldings).find(calc => calc.name === pos.name);
                        if (stockData) {
                            longCost += stockData.totalHoldingCost;
                            longProfit += stockData.estimatedProfitLoss;
                        }
                    });
                } else {
                    // 如果没有历史数据，只计算市值
                    longValue = assetData.portfolio.reduce((acc, pos) => {
                        const currentPrice = pricesMap.get(pos.name) || 0;
                        return acc + (pos.shares * currentPrice);
                    }, 0);
                }
            }

            // 计算空头收益
            let shortProfit = 0;
            let shortCost = 0;
            if (leveragedData && leveragedData.data && stockInfo.length > 0) {
                const pricesMap = new Map(stockInfo.map(s => [s.code, s.price]));

                leveragedData.data.forEach(pos => {
                    const currentPrice = pricesMap.get(pos.code) || 0;
                    const profit = (pos.loan_price - currentPrice) * pos.shares;
                    const cost = pos.loan_price * pos.shares;

                    shortProfit += profit;
                    shortCost += cost;
                });
            }

            // 计算收益率
            const longRate = longCost > 0 ? (longProfit / longCost) * 100 : 0;
            const shortRate = shortCost > 0 ? (shortProfit / shortCost) * 100 : 0;
            const totalProfit = longProfit + shortProfit;
            const totalCost = longCost + shortCost;
            const totalRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

            const totalAssets = cash + longValue + bankDeposit;

            // 更新基础资产信息
            this.panel.querySelector('#agsv-total-assets').textContent = totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.panel.querySelector('#agsv-long-value').textContent = longValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.panel.querySelector('#agsv-cash-balance').textContent = cash.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.panel.querySelector('#agsv-bank-deposit').textContent = bankDeposit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // 更新预计收益信息
            this.updateProfitElement('#agsv-long-profit', longProfit);
            this.updateProfitElement('#agsv-short-profit', shortProfit);
            this.updateRateElement('#agsv-long-rate', longRate);
            this.updateRateElement('#agsv-short-rate', shortRate);
            this.updateProfitElement('#agsv-total-profit', totalProfit);
            this.updateRateElement('#agsv-total-rate', totalRate);
        }

        updateProfitElement(selector, profit) {
            const element = this.panel.querySelector(selector);
            if (!element) return;

            const color = profit > 0 ? '#10b981' : (profit < 0 ? '#ef4444' : '#6b7280');
            const prefix = profit > 0 ? '+' : '';

            element.textContent = `${prefix}${profit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            element.style.color = color;
            element.style.fontWeight = '600';
        }

        updateRateElement(selector, rate) {
            const element = this.panel.querySelector(selector);
            if (!element) return;

            const color = rate > 0 ? '#10b981' : (rate < 0 ? '#ef4444' : '#6b7280');
            const prefix = rate > 0 ? '+' : '';

            element.textContent = `${prefix}${rate.toFixed(2)}%`;
            element.style.color = color;
            element.style.fontWeight = '600';
        }

        updateStockSelect(stocks) {
            const buttonsContainer = this.panel.querySelector('#agsv-stock-buttons');
            if (!buttonsContainer) return;

            // 创建股票按钮组
            let buttonsHtml = '<div class="agsv-section-subtitle">选择股票</div><div class="agsv-stock-button-group">';

            stocks.forEach(stock => {
                const changePercent = (stock.change * 100).toFixed(2);
                const changeIcon = stock.change > 0 ? '↗' : stock.change < 0 ? '↘' : '→';
                const changeClass = stock.change > 0 ? 'positive' : stock.change < 0 ? 'negative' : 'neutral';

                buttonsHtml += `
                    <button class="agsv-stock-btn" data-stock="${stock.code}" title="${stock.name} - ${stock.price.toFixed(2)} (${stock.change > 0 ? '+' : ''}${changePercent}%)">
                        <div style="font-weight: 600;">${stock.name}</div>
                        <div style="font-size: 11px; color: ${stock.change > 0 ? '#28a745' : stock.change < 0 ? '#dc3545' : '#6c757d'};">
                            ${changeIcon} ${changePercent}%
                        </div>
                    </button>
                `;
            });

            buttonsHtml += '</div>';
            buttonsContainer.innerHTML = buttonsHtml;
        }

        updatePositions(assetData) {
            const container = this.panel.querySelector('#agsv-positions-list');
            if (!assetData.portfolio || assetData.portfolio.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无持仓</div>';
                return;
            }

            // 使用和表格一样的计算逻辑
            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const history = this.dataManager.getCached('history') || { data: [] };

            // 直接使用表格的计算函数
            const calculatedHoldings = calculatePortfolioPerformance(history.data, stockInfo);

            let totalCost = 0;
            let totalCurrentValue = 0;
            let totalProfit = 0;

            const positionsHtml = Object.entries(calculatedHoldings).map(([code, holding]) => {
                const name = holding.name || code;
                const shares = holding.quantity || 0;
                const cost = holding.totalHoldingCost || 0;
                const avgCost = holding.costPerShare || 0;
                const profit = holding.estimatedProfitLoss || 0;
                const profitRate = holding.estimatedReturnRate || 0;

                // 计算当前价格和市值
                const stockInfo = this.dataManager.getCached('stockInfo') || [];
                const pricesMap = new Map(stockInfo.map(item => [item.code, item.price]));
                const currentPrice = pricesMap.get(code) || 0;
                const currentValue = shares * currentPrice;

                totalCost += cost;
                totalCurrentValue += currentValue;
                totalProfit += (profit !== 'N/A' ? profit : 0);

                return `
                    <div class="agsv-position-item">
                        <div class="agsv-position-name">${name}</div>
                        <div class="agsv-position-details">
                            <div>数量: ${shares}</div>
                            <div>均价: ${avgCost.toFixed(2)}</div>
                            <div>现价: ${currentPrice.toFixed(2)}</div>
                            <div>成本: ${cost.toFixed(2)}</div>
                            <div>市值: ${currentValue.toFixed(2)}</div>
                            <div class="${profit >= 0 ? 'agsv-profit-positive' : 'agsv-profit-negative'}">
                                收益: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)} (${profitRate >= 0 ? '+' : ''}${profitRate.toFixed(2)}%)
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // 添加总资产汇总
            const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
            const cash = assetData.cash || 0;
            const totalAssets = totalCurrentValue + cash;

            const summaryHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">📊 资产汇总</div>
                    <div style="font-size: 12px; line-height: 1.6;">
                        <div style="margin-bottom: 4px;">持仓市值: ${totalCurrentValue.toFixed(2)}</div>
                        <div style="margin-bottom: 4px;">持仓成本: ${totalCost.toFixed(2)}</div>
                        <div style="margin-bottom: 4px;">现金余额: ${cash.toFixed(2)}</div>
                        <div style="margin-bottom: 8px;">总资产: ${totalAssets.toFixed(2)}</div>
                        <div class="${totalProfit >= 0 ? 'agsv-profit-positive' : 'agsv-profit-negative'}" style="text-align: center; font-size: 14px; font-weight: 600; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">
                            持仓收益: ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} (${totalProfitRate >= 0 ? '+' : ''}${totalProfitRate.toFixed(2)}%)
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = summaryHtml + positionsHtml;
        }

        updateProfitDisplay(assetData) {
            const profitElement = this.panel.querySelector('#agsv-total-profit');
            if (!profitElement) return;

            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const history = this.dataManager.getCached('history') || { data: [] };
            const leveragedData = this.dataManager.getCached('leveraged') || { data: [] };

            if (stockInfo.length === 0 || history.data.length === 0) {
                profitElement.innerHTML = '<div>计算中...</div>';
                return;
            }

            // 1. 计算多头持仓的浮动盈亏
            const longHoldings = calculatePortfolioPerformance(history.data, stockInfo);
            let longProfit = 0;
            let longCost = 0;
            Object.values(longHoldings).forEach(h => {
                if (h.quantity > 0) {
                    longProfit += h.estimatedProfitLoss || 0;
                    longCost += h.totalHoldingCost || 0;
                }
            });

            // 2. 计算空头持仓的浮动盈亏
            const pricesMap = new Map(stockInfo.map(item => [item.code, item.price]));
            let shortProfit = 0;
            let shortCost = 0;
            if (leveragedData.data) {
                leveragedData.data.forEach(pos => {
                    const currentPrice = pricesMap.get(pos.stock_code);
                    if (currentPrice !== undefined) {
                        const costBasis = (pos.price * pos.quantity); // 忽略利息，以简化
                        const currentValue = currentPrice * pos.quantity;
                        shortProfit += (costBasis - currentValue);
                        shortCost += costBasis;
                    }
                });
            }

            // 3. 汇总总收益和总成本
            const totalProfit = longProfit + shortProfit;
            const totalCost = longCost + shortCost;
            const profitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

            console.log(`[LOG] 收益计算: longProfit=${longProfit}, shortProfit=${shortProfit}, totalProfit=${totalProfit}`);

            profitElement.innerHTML = `
                <div>${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}</div>
                <div style="font-size: 12px; opacity: 0.8;">(${profitRate >= 0 ? '+' : ''}${profitRate.toFixed(2)}%)</div>
            `;
            profitElement.className = `agsv-profit-value ${totalProfit >= 0 ? 'agsv-profit-positive' : 'agsv-profit-negative'}`;
        }

        updateCashBalance(assetData) {
            const balanceElement = this.panel.querySelector('#agsv-cash-balance');
            if (!balanceElement) return;

            const cash = assetData.cash || 0;
            balanceElement.textContent = cash.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        updateShortLimitDisplay() {
            const totalEl = this.panel.querySelector('#agsv-short-total');
            const usedEl = this.panel.querySelector('#agsv-short-used');
            const availableEl = this.panel.querySelector('#agsv-short-available');

            const totalLimit = this.dataManager.getCached('bankDeposit');
            const leveragedData = this.dataManager.getCached('leveraged');

            console.log(`[LOG] 更新做空额度: totalLimit = ${totalLimit}, leveragedData =`, leveragedData);

            let usedLimit = 0;
            if (leveragedData && leveragedData.data) {
                usedLimit = leveragedData.data.reduce((acc, pos) => {
                    const shares = pos.shares || 0;
                    const price = pos.loan_price || 0;
                    const value = shares * price;
                    console.log(`[LOG] 计算已用额度: ${pos.code}, 数量=${shares}, 价格=${price}, 小计=${value}`);
                    return acc + value;
                }, 0);
            }

            if (totalLimit === undefined) {
                console.warn('[LOG] 银行存款数据尚未加载, 做空额度无法计算。');
                totalEl.textContent = '加载中...';
                usedEl.textContent = '加载中...';
                availableEl.textContent = '加载中...';
                return;
            }

            const availableLimit = totalLimit - usedLimit;

            console.log(`[LOG] 计算额度: total=${totalLimit}, used=${usedLimit}, available=${availableLimit}`);

            totalEl.textContent = totalLimit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            usedEl.textContent = usedLimit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            availableEl.textContent = availableLimit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }


        updateHistory(historyData) {
            const container = this.panel.querySelector('#agsv-history-list');
            if (!container) return;

            if (!historyData || !historyData.data || historyData.data.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无交易记录</div>';
                return;
            }

            const recentHistory = historyData.data.slice(0, 15); // 显示最近15条记录

            container.innerHTML = recentHistory.map(trade => {
                const type = (trade.type || '').toUpperCase();
                const typeClass = `agsv-history-${type.toLowerCase()}`;
                const typeText = {
                    'BUY': '买入',
                    'SELL': '卖出',
                    'BORROW': '做空',
                    'REPAY': '平仓'
                }[type] || type;

                const name = trade.name || '未知股票';
                const quantity = trade.quantity || 0;
                const price = (trade.price || 0);
                const fee = (trade.fee || 0);
                const timestamp = trade.timestamp || Date.now();
                const totalAmount = price * quantity;

                return `
                    <div class="agsv-history-item">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span class="agsv-history-type ${typeClass}">${typeText}</span>
                            <span style="font-size: 10px; color: #666;">
                                ${new Date(timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div style="font-size: 12px; margin-bottom: 2px;">
                            ${name} ${quantity}股 @${price.toFixed(2)}
                        </div>
                        <div style="font-size: 11px; color: #666;">
                            总额: ${totalAmount.toFixed(2)} ${fee > 0 ? `(手续费${fee.toFixed(2)})` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }



        async handleTradeAction(action) {
            if (!this.selectedStock) {
                this.showNotification('请先选择股票', 'warning');
                return;
            }

            const amountInput = this.panel.querySelector('#agsv-amount-input');
            const amount = parseInt(amountInput.value);

            if (!amount || amount <= 0) {
                this.showNotification('请输入有效数量', 'warning');
                return;
            }

            const stockInfo = this.dataManager.getCached('stockInfo') || [];
            const selectedStockInfo = stockInfo.find(stock => stock.code === this.selectedStock);

            if (!selectedStockInfo) {
                this.showNotification(`无法找到股票信息: ${this.selectedStock}`, 'error');
                return;
            }

            try {
                this.showNotification('交易执行中...', 'info');
                await this.dataManager.executeTrade(selectedStockInfo.code, action, amount);
                this.showNotification(`${this.getActionText(action)}成功: ${amount}股`, 'success');
                amountInput.value = '';

                // 自动刷新页面
                this.refreshPageAfterOperation();
            } catch (error) {
                // 特殊处理做空错误，提供更友好的提示
                if (action === 'short' && error.maxBorrowable !== undefined) {
                    const amountInput = this.panel.querySelector('#agsv-amount-input');
                    this.showNotification(`${error.message}，已自动填入最大可借量`, 'warning');
                    // 自动填入最大可借量
                    amountInput.value = Math.floor(error.maxBorrowable);
                } else {
                    this.showNotification(`交易失败: ${error.message}`, 'error');
                }
            }
        }

        async calculateSpecialAmount(action) {
            // 先获取最新数据
            await this.dataManager.getUserAsset();
            await this.dataManager.getLeveraged();
            await this.dataManager.getBankDeposit(); // 确保获取了最新的银行存款

            const assetData = this.dataManager.getCached('userAsset');
            const leveragedData = this.dataManager.getCached('leveraged');
            const stockInfo = this.dataManager.getCached('stockInfo');
            const bankDeposit = this.dataManager.getCached('bankDeposit');
            const history = this.dataManager.getCached('history');

            if (!this.selectedStock) {
                this.showNotification('请先选择一只股票', 'warning');
                return 0;
            }

            if (!assetData || !stockInfo || !history || bankDeposit === undefined) {
                this.showNotification('数据加载不完整，无法计算', 'warning');
                return 0;
            }

            // 尝试多种方式匹配股票
            let selectedStockInfo = stockInfo.find(s => s.name === this.selectedStock);
            if (!selectedStockInfo) {
                selectedStockInfo = stockInfo.find(s => s.code === this.selectedStock);
            }

            if (!selectedStockInfo) {
                this.showNotification(`未找到选中股票信息: ${this.selectedStock}`, 'warning');
                console.log('可用股票:', stockInfo.map(s => ({name: s.name, code: s.code})));
                return 0;
            }

            const stockPrice = selectedStockInfo.price;
            const availableCash = assetData.cash || 0;

            let calculatedAmount = 0;
            let notificationText = '';

            switch(action) {
                case 'buy-all':
                    calculatedAmount = Math.floor(availableCash / stockPrice);
                    notificationText = `全仓买入数量: ${calculatedAmount}`;
                    break;
                case 'buy-half':
                    calculatedAmount = Math.floor((availableCash / 2) / stockPrice);
                    notificationText = `半仓买入数量: ${calculatedAmount}`;
                    break;
                case 'buy-quarter':
                    calculatedAmount = Math.floor((availableCash / 4) / stockPrice);
                    notificationText = `1/4仓买入数量: ${calculatedAmount}`;
                    break;
                case 'sell-all':
                    const assetPosition = assetData.portfolio.find(p => p.name === selectedStockInfo.name);
                    if (!assetPosition || assetPosition.shares <= 0) {
                        this.showNotification('没有该股票的多头持仓', 'warning');
                        return 0;
                    }
                    calculatedAmount = assetPosition.shares;
                    notificationText = `清仓卖出数量: ${calculatedAmount}`;
                    break;
                case 'short-all':
                case 'short-half':
                    const totalLimit = bankDeposit || 0;
                    let usedLimit = 0;
                    if (leveragedData && leveragedData.data) {
                        usedLimit = leveragedData.data.reduce((acc, pos) => acc + (pos.shares * pos.loan_price), 0);
                    }
                    const availableLimit = totalLimit - usedLimit;

                    if (availableLimit <= 0) {
                        this.showNotification('可用做空额度不足', 'warning');
                        return 0;
                    }

                    const factor = action === 'short-half' ? 0.5 : 1;
                    calculatedAmount = Math.floor((availableLimit * factor) / stockPrice);
                    notificationText = `${action === 'short-half' ? '半仓' : '全仓'}做空数量: ${calculatedAmount}`;
                    break;
            }

            if (calculatedAmount <= 0) {
                this.showNotification('计算数量为0或余额不足', 'warning');
                return 0;
            }

            this.showNotification(`将填充数量: ${calculatedAmount} 股`, 'info');
            return calculatedAmount;
        }

        getActionText(action) {
            const actionMap = {
                'buy': '买入',
                'sell': '卖出',
                'short': '做空',
                'cover': '平仓',
                'borrow': '做空',    // 兼容性
                'repay': '平仓'      // 兼容性
            };
            return actionMap[action] || action;
        }

        validateAmount() {
            const input = this.panel.querySelector('#agsv-amount-input');
            const value = parseInt(input.value);

            if (value > 10000) {
                input.value = 10000;
                this.showNotification('单次交易最大数量为10000股', 'warning');
            } else if (value < 0) {
                input.value = 0;
            }
        }

        updateTradeButtons() {
            // 可以根据选中的股票更新按钮状态
            const buttons = this.panel.querySelectorAll('.agsv-trade-btn');
            buttons.forEach(btn => {
                btn.disabled = !this.selectedStock;
            });
        }

        showNotification(message, type = 'info') {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = `agsv-notification agsv-notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                z-index: 10002;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideDown 0.3s ease-out;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideUp 0.3s ease-out forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // 旧的快速交易按钮功能已重构到新UI中

        // fillPositionSize 函数已被新的 calculateSpecialAmount 函数替代
    }

    // --- 4. 数据计算模块 ---
    function calculatePortfolioPerformance(transactions, realTimePrices) {
        const holdings = {};

        // 按时间顺序处理交易，确保成本计算正确
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        sortedTransactions.forEach(transaction => {
            const { stock_code, quantity, price, fee, type, name } = transaction;

            if (!holdings[stock_code]) {
                holdings[stock_code] = { name, quantity: 0, totalCost: 0.0 };
            }

            const stock = holdings[stock_code];

            if (type === 'BUY') {
                stock.quantity += quantity;
                stock.totalCost += (price * quantity) + fee;
            } else if (type === 'SELL') {
                if (stock.quantity > 0) {
                    // 卖出时，按平均成本减少总成本
                    const avgCost = stock.totalCost / stock.quantity;
                    const costOfSale = avgCost * Math.min(stock.quantity, quantity);
                    stock.totalCost -= costOfSale;
                    stock.quantity -= quantity;
                }
                // 如果持仓为0，重置成本，避免负数或极小值残留
                if (stock.quantity <= 0.001) {
                    stock.quantity = 0;
                    stock.totalCost = 0;
                }
            }
            // 注意：此函数专注于计算多头持仓的成本和收益，忽略做空操作
        });

        const pricesMap = new Map(realTimePrices.map(item => [item.code, item.price]));
        const portfolioSummary = {};

        for (const code in holdings) {
            const stock = holdings[code];
            const { name, quantity, totalCost } = stock;

            if (quantity <= 0) continue; // 只处理多头持仓

            const costPerShare = totalCost / quantity;
            let profitLoss = 'N/A', returnRate = 'N/A';
            const currentPrice = pricesMap.get(code);

            if (currentPrice !== undefined) {
                const marketValue = currentPrice * quantity;
                const calculatedProfitLoss = marketValue - totalCost;
                profitLoss = parseFloat(calculatedProfitLoss.toFixed(2));
                returnRate = totalCost > 0 ? parseFloat(((calculatedProfitLoss / totalCost) * 100).toFixed(2)) : 0;
            }

            portfolioSummary[code] = {
                name,
                quantity,
                totalHoldingCost: parseFloat(totalCost.toFixed(2)),
                costPerShare: parseFloat(costPerShare.toFixed(2)),
                estimatedProfitLoss: profitLoss,
                estimatedReturnRate: returnRate,
                isShort: false // 明确标记为多头持仓
            };
        }
        return portfolioSummary;
    }

    // --- 3. 旧版DOM操作模块 (已废弃，使用新的表格增强器) ---

    // --- 4. 原始控件美化模块 ---
    class OriginalControlsEnhancer {
        constructor() {
            this.init();
        }

        init() {
            // 等待页面加载完成后开始美化
            this.waitForControls();
        }

        waitForControls() {
            const checkInterval = setInterval(() => {
                const controlsContainer = document.querySelector('._controls_4fgj1_1');
                if (controlsContainer) {
                    clearInterval(checkInterval);
                    this.enhanceControls(controlsContainer);
                }
            }, 500);

            // 10秒后停止检查
            setTimeout(() => clearInterval(checkInterval), 10000);
        }

        enhanceControls(controlsContainer) {
            console.log('开始美化原始控件...');

            // 创建全新的控件容器
            this.createEnhancedControlsContainer(controlsContainer);

            // 美化交易面板
            this.enhanceTradePanel();

            console.log('原始控件美化完成');
        }

        enhanceTradePanel() {
            // 等待交易面板加载
            const checkTradePanel = () => {
                const tradePanel = document.querySelector('._tradePanel_luodj_1');
                if (tradePanel) {
                    this.applyTradePanelStyles(tradePanel);
                } else {
                    setTimeout(checkTradePanel, 500);
                }
            };
            checkTradePanel();
        }

        applyTradePanelStyles(tradePanel) {
            console.log('开始美化交易面板...');

            // 为交易面板添加美化类
            tradePanel.classList.add('agsv-enhanced-trade-panel');

            // 美化余额显示
            const balance = tradePanel.querySelector('._balance_luodj_23');
            if (balance) {
                balance.classList.add('agsv-enhanced-balance');
            }

            // 美化数量输入区域
            const quantityContainer = tradePanel.querySelector('._quantityContainer_luodj_221');
            if (quantityContainer) {
                quantityContainer.classList.add('agsv-enhanced-quantity');

                // 美化输入框
                const input = quantityContainer.querySelector('._quantityInput_luodj_49');
                if (input) {
                    input.classList.add('agsv-enhanced-input');
                }

                // 美化快速调整按钮
                const quickButtons = quantityContainer.querySelectorAll('._quickAdjustButton_luodj_235');
                quickButtons.forEach(btn => {
                    btn.classList.add('agsv-enhanced-quick-btn');
                    if (btn.classList.contains('_clearButton_luodj_273')) {
                        btn.classList.add('agsv-enhanced-clear-btn');
                    }
                });
            }

            // 美化交易按钮组
            const buttonGroup = tradePanel.querySelector('._buttonGroup_luodj_105');
            if (buttonGroup) {
                buttonGroup.classList.add('agsv-enhanced-button-group');

                const tradeButtons = buttonGroup.querySelectorAll('._tradeButton_luodj_117');
                tradeButtons.forEach(btn => {
                    btn.classList.add('agsv-enhanced-trade-btn');

                    // 根据按钮类型添加特定样式
                    if (btn.classList.contains('_buyButton_luodj_153')) {
                        btn.classList.add('agsv-buy-style');
                    } else if (btn.classList.contains('_sellButton_luodj_161')) {
                        btn.classList.add('agsv-sell-style');
                    } else if (btn.classList.contains('_borrowButton_luodj_169')) {
                        btn.classList.add('agsv-borrow-style');
                    } else if (btn.classList.contains('_repayButton_luodj_177')) {
                        btn.classList.add('agsv-repay-style');
                    }
                });
            }

            console.log('交易面板美化完成');
        }

        createEnhancedControlsContainer(originalContainer) {
            // 获取原始数据
            const stockSelect = originalContainer.querySelector('._stockSelect_4fgj1_21');
            const timeRange = originalContainer.querySelector('._timeRange_4fgj1_37');
            const tips = originalContainer.querySelector('._tips_4fgj1_81');

            if (!stockSelect || !timeRange) return;

            // 创建新的美化容器
            const enhancedContainer = document.createElement('div');
            enhancedContainer.className = 'agsv-original-controls-container';

            enhancedContainer.innerHTML = `
                ${tips ? `<div class="agsv-controls-header">
                    <span class="tips-icon">💡</span>
                    ${tips.innerHTML}
                </div>` : ''}
                <div class="agsv-controls-main">
                    <div class="agsv-controls-left">
                        <div class="agsv-stock-selection">
                            <div class="agsv-section-label">📈 选择股票</div>
                            <div class="agsv-stock-grid" id="agsv-enhanced-stock-grid"></div>
                        </div>
                    </div>
                    <div class="agsv-controls-right">
                        <div class="agsv-time-selection">
                            <div class="agsv-section-label">⏰ 时间周期</div>
                            <div class="agsv-time-buttons" id="agsv-enhanced-time-buttons"></div>
                        </div>
                    </div>
                </div>
            `;

            // 填充股票按钮
            this.populateStockButtons(stockSelect, enhancedContainer.querySelector('#agsv-enhanced-stock-grid'));

            // 填充时间按钮
            this.populateTimeButtons(timeRange, enhancedContainer.querySelector('#agsv-enhanced-time-buttons'));

            // 替换原始容器
            originalContainer.style.display = 'none';
            originalContainer.parentNode.insertBefore(enhancedContainer, originalContainer);
        }

        populateStockButtons(stockSelect, container) {
            const options = Array.from(stockSelect.options);

            options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'agsv-stock-card';
                if (index === stockSelect.selectedIndex) {
                    button.classList.add('active');
                }

                // 解析股票信息
                const text = option.textContent;
                const match = text.match(/^(.+?)\s*-\s*([↑↓])\s*(.+)$/);

                if (match) {
                    const [, name, direction, change] = match;
                    const isUp = direction === '↑';

                    button.innerHTML = `
                        <div class="agsv-stock-name">${name}</div>
                        <div class="agsv-stock-change ${isUp ? 'positive' : 'negative'}">
                            ${direction} ${change}
                        </div>
                    `;
                } else {
                    button.innerHTML = `<div class="agsv-stock-name">${text}</div>`;
                }

                button.dataset.value = option.value;
                button.addEventListener('click', () => {
                    // 更新原始选择器
                    stockSelect.value = option.value;
                    stockSelect.dispatchEvent(new Event('change', { bubbles: true }));

                    // 更新按钮状态
                    container.querySelectorAll('.agsv-stock-card').forEach(btn =>
                        btn.classList.remove('active'));
                    button.classList.add('active');
                });

                container.appendChild(button);
            });
        }

        populateTimeButtons(timeRange, container) {
            const buttons = timeRange.querySelectorAll('._rangeButton_4fgj1_47');

            // 时间周期中文映射
            const timeLabels = {
                '1H': '1小时',
                '1D': '1日',
                '1W': '1周',
                '1M': '1月',
                '1Y': '1年',
                'ALL': '全部'
            };

            buttons.forEach(originalBtn => {
                const button = document.createElement('button');
                button.className = 'agsv-time-btn';
                const originalText = originalBtn.textContent.trim();
                const chineseLabel = timeLabels[originalText] || originalText;

                button.innerHTML = `
                    <div>${originalText}</div>
                    <div class="chinese-label">${chineseLabel}</div>
                `;

                // 复制激活状态
                if (originalBtn.classList.contains('_active_4fgj1_67')) {
                    button.classList.add('_active_4fgj1_67');
                }

                button.addEventListener('click', () => {
                    // 触发原始按钮点击
                    originalBtn.click();

                    // 更新新按钮状态
                    container.querySelectorAll('.agsv-time-btn').forEach(btn =>
                        btn.classList.remove('_active_4fgj1_67'));
                    button.classList.add('_active_4fgj1_67');
                });

                container.appendChild(button);
            });

            // 监听原始按钮状态变化
            const observer = new MutationObserver(() => {
                buttons.forEach((originalBtn, index) => {
                    const newBtn = container.children[index];
                    if (newBtn) {
                        if (originalBtn.classList.contains('_active_4fgj1_67')) {
                            newBtn.classList.add('_active_4fgj1_67');
                        } else {
                            newBtn.classList.remove('_active_4fgj1_67');
                        }
                    }
                });
            });

            buttons.forEach(btn => {
                observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
            });
        }
    }

    // --- 5. 表格增强模块 ---
    class TableEnhancer {
        constructor(dataManager) {
            this.dataManager = dataManager;
            this.enhanced = false;
        }

        async enhanceTable() {
            // 移除增强检查，允许重复增强以确保样式正确应用
            try {
                // 增强持仓信息表格
                await this.enhanceHoldingsTable();

                // 增强借入持仓表格
                await this.enhanceLeveragedTable();

                // 创建股市人生分析模块
                await this.createStockLifeAnalysis();

                this.enhanced = true;
                console.log('表格增强完成');
            } catch (error) {
                console.error('表格增强失败:', error);
            }
        }

        async createStockLifeAnalysis() {
            console.log('开始创建股市人生分析模块...');

            try {
                // 获取历史记录数据
                const historyData = await this.fetchHistoryData();

                if (historyData.length === 0) {
                    console.log('没有历史记录数据，跳过分析模块创建');
                    return;
                }

                // 分析数据
                const analysis = this.analyzeHistoryData(historyData);

                // 获取当前持仓数据并加入分析
                await this.addCurrentHoldingsToAnalysis(analysis);

                // 创建分析模块
                const analysisModule = this.createAnalysisModule(analysis);

                // 找到合适的位置插入（在空头持仓表格下方）
                // 找到所有的持仓区域
                const positionSections = document.querySelectorAll('._positionSection_1oy4v_13');

                // 检查是否已经存在分析模块
                const existingModule = document.querySelector('.agsv-stock-life-analysis');
                if (existingModule) {
                    existingModule.remove();
                }

                if (positionSections.length >= 2) {
                    // 插入到第二个持仓区域（空头持仓）后面
                    const leveragedSection = positionSections[1];
                    leveragedSection.parentNode.insertBefore(analysisModule, leveragedSection.nextSibling);
                } else {
                    // 如果没有空头持仓区域，就插入到多头持仓后面
                    const targetTable = document.querySelector(CONFIG.TARGET_TABLE_SELECTOR);
                    if (targetTable) {
                        const container = targetTable.closest('div');
                        if (container) {
                            container.appendChild(analysisModule);
                        }
                    }
                }

                console.log('股市人生分析模块创建完成');
            } catch (error) {
                console.error('创建股市人生分析模块失败:', error);
            }
        }

        async fetchHistoryData() {
            try {
                // 获取所有页面的数据
                let allData = [];
                let currentPage = 1;
                let totalPages = 1;

                do {
                    const response = await fetch(`https://stock.agsvpt.cn/api/user/history?page=${currentPage}&page_size=50`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_KEY)}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.data) {
                        allData = allData.concat(data.data);
                        totalPages = data.pagination?.total_pages || 1;
                        currentPage++;
                    } else {
                        break;
                    }
                } while (currentPage <= totalPages && currentPage <= 10); // 限制最多10页，避免过多请求

                console.log(`获取到 ${allData.length} 条历史记录`);
                return allData;
            } catch (error) {
                console.error('获取历史数据失败:', error);
                return [];
            }
        }

        analyzeHistoryData(historyData) {
            console.log('开始分析历史数据...');

            const analysis = {
                totalTrades: historyData.length,
                totalFees: 0,
                stockAnalysis: {},
                typeAnalysis: {
                    BUY: { count: 0, volume: 0, amount: 0, fees: 0 },
                    SELL: { count: 0, volume: 0, amount: 0, fees: 0 },
                    BORROW: { count: 0, volume: 0, amount: 0, fees: 0 },
                    REPAY: { count: 0, volume: 0, amount: 0, fees: 0 }
                },
                timeRange: {
                    start: null,
                    end: null
                }
            };

            // 分析每条记录
            historyData.forEach(record => {
                const { stock_code, name, type, quantity, price, fee, timestamp } = record;
                const amount = quantity * price;

                // 总手续费
                analysis.totalFees += fee;

                // 按股票分析
                if (!analysis.stockAnalysis[stock_code]) {
                    analysis.stockAnalysis[stock_code] = {
                        name: name,
                        trades: 0,
                        buyVolume: 0,
                        sellVolume: 0,
                        borrowVolume: 0,
                        repayVolume: 0,
                        buyAmount: 0,
                        sellAmount: 0,
                        fees: 0,
                        avgBuyPrice: 0,
                        avgSellPrice: 0
                    };
                }

                const stockData = analysis.stockAnalysis[stock_code];
                stockData.trades++;
                stockData.fees += fee;

                // 按类型分析
                const typeData = analysis.typeAnalysis[type];
                if (typeData) {
                    typeData.count++;
                    typeData.volume += quantity;
                    typeData.amount += amount;
                    typeData.fees += fee;
                }

                // 按股票和类型分析
                switch (type) {
                    case 'BUY':
                        stockData.buyVolume += quantity;
                        stockData.buyAmount += amount;
                        stockData.avgBuyPrice = stockData.buyAmount / stockData.buyVolume;
                        break;
                    case 'SELL':
                        stockData.sellVolume += quantity;
                        stockData.sellAmount += amount;
                        stockData.avgSellPrice = stockData.sellAmount / stockData.sellVolume;
                        break;
                    case 'BORROW':
                        stockData.borrowVolume += quantity;
                        break;
                    case 'REPAY':
                        stockData.repayVolume += quantity;
                        break;
                }

                // 时间范围
                const recordTime = new Date(timestamp);
                if (!analysis.timeRange.start || recordTime < analysis.timeRange.start) {
                    analysis.timeRange.start = recordTime;
                }
                if (!analysis.timeRange.end || recordTime > analysis.timeRange.end) {
                    analysis.timeRange.end = recordTime;
                }
            });

            // 计算净持仓和收益
            Object.keys(analysis.stockAnalysis).forEach(stockCode => {
                const stockData = analysis.stockAnalysis[stockCode];
                stockData.netPosition = stockData.buyVolume - stockData.sellVolume;
                stockData.netBorrowPosition = stockData.borrowVolume - stockData.repayVolume;

                // 计算已实现收益（卖出收入 - 买入成本）
                if (stockData.sellVolume > 0 && stockData.buyVolume > 0) {
                    const soldAmount = Math.min(stockData.sellVolume, stockData.buyVolume);
                    stockData.realizedProfit = (stockData.avgSellPrice - stockData.avgBuyPrice) * soldAmount - stockData.fees;
                } else {
                    stockData.realizedProfit = 0;
                }
            });

            console.log('历史数据分析完成:', analysis);
            return analysis;
        }

        async addCurrentHoldingsToAnalysis(analysis) {
            try {
                // 获取当前持仓数据（参考多头和空头表格的获取方式）
                const [stockInfo, leveragedData, history] = await Promise.all([
                    this.dataManager.getStockInfo(),
                    this.dataManager.getLeveraged(),
                    this.dataManager.getHistory()
                ]);

                console.log('获取到的数据:', { stockInfo, leveragedData, history });

                if (!stockInfo) {
                    console.log('无法获取股票信息数据');
                    return;
                }

                // 添加当前持仓分析
                analysis.currentHoldings = {
                    totalValue: 0,
                    totalCost: 0,
                    totalUnrealizedProfit: 0,
                    stocks: {}
                };

                // 分析多头持仓（使用和表格一样的计算方式）
                if (history && history.data && history.data.length > 0) {
                    console.log('处理多头持仓，使用历史交易计算...');
                    const calculatedHoldings = calculatePortfolioPerformance(history.data, stockInfo);

                    console.log('计算得到的多头持仓:', calculatedHoldings);
                    Object.entries(calculatedHoldings).forEach(([stockCode, holding]) => {
                        console.log(`处理多头股票 ${stockCode}:`, holding);
                        if (holding.quantity > 0) { // 只处理有持仓的股票
                            const stockData = stockInfo.find(s => s.code === stockCode);
                            if (stockData) {
                                const currentValue = holding.quantity * stockData.price;
                                const cost = holding.totalHoldingCost || 0;
                                const unrealizedProfit = (holding.estimatedProfitLoss || 0);

                                analysis.currentHoldings.totalValue += currentValue;
                                analysis.currentHoldings.totalCost += cost;
                                analysis.currentHoldings.totalUnrealizedProfit += unrealizedProfit;

                                // 检查是否已经有空头数据，如果有则合并，否则创建新的
                                if (!analysis.currentHoldings.stocks[stockCode]) {
                                    analysis.currentHoldings.stocks[stockCode] = {
                                        name: holding.name || stockData.name,
                                        quantity: holding.quantity,
                                        averagePrice: holding.costPerShare || 0,
                                        currentPrice: stockData.price,
                                        currentValue: currentValue,
                                        cost: cost,
                                        unrealizedProfit: unrealizedProfit,
                                        unrealizedProfitRate: cost > 0 ? (unrealizedProfit / cost) * 100 : 0,
                                        type: 'LONG',
                                        shortQuantity: 0,
                                        shortAveragePrice: 0,
                                        shortUnrealizedProfit: 0,
                                        shortUnrealizedProfitRate: 0,
                                        hasHolding: true
                                    };
                                } else {
                                    // 已经有空头数据，合并多头数据
                                    const existingStock = analysis.currentHoldings.stocks[stockCode];
                                    existingStock.name = holding.name || stockData.name;
                                    existingStock.quantity = holding.quantity;
                                    existingStock.averagePrice = holding.costPerShare || 0;
                                    existingStock.currentPrice = stockData.price;
                                    existingStock.currentValue = currentValue;
                                    existingStock.cost = cost;
                                    existingStock.unrealizedProfit = unrealizedProfit;
                                    existingStock.unrealizedProfitRate = cost > 0 ? (unrealizedProfit / cost) * 100 : 0;
                                    existingStock.type = 'MIXED'; // 既有多头又有空头
                                    existingStock.hasHolding = true;
                                }
                            }
                        }
                    });
                }

                // 分析空头持仓（借入持仓）
                console.log('空头数据检查:', { leveragedData, hasData: !!leveragedData?.data, length: leveragedData?.data?.length });
                if (leveragedData && leveragedData.data && leveragedData.data.length > 0) {
                    console.log('处理空头持仓:', leveragedData.data);
                    leveragedData.data.forEach(position => {
                        console.log(`处理空头持仓项:`, position);
                        const stockData = stockInfo.find(s => s.code === position.code);
                        console.log(`查找股票信息: ${position.code}, 找到:`, !!stockData);
                        if (!stockData) {
                            console.log(`可用股票列表:`, stockInfo.map(s => s.code));
                        }
                        if (stockData) {
                            // 空头收益计算：借入价格 - 当前价格
                            const borrowValue = position.shares * position.loan_price;
                            const currentValue = position.shares * stockData.price;
                            const unrealizedProfit = borrowValue - currentValue; // 空头收益

                            console.log(`${position.code} 空头计算: 数量=${position.shares}, 借入价=${position.loan_price}, 当前价=${stockData.price}, 收益=${unrealizedProfit}`);

                            // 空头持仓也要计入总市值和总成本
                            analysis.currentHoldings.totalValue += borrowValue; // 空头的"市值"是借入价值
                            analysis.currentHoldings.totalCost += borrowValue;   // 空头的"成本"是借入价值
                            analysis.currentHoldings.totalUnrealizedProfit += unrealizedProfit;

                            const stockCode = position.code;
                            console.log(`处理空头股票 ${stockCode}, 检查是否已存在:`, !!analysis.currentHoldings.stocks[stockCode]);
                            console.log(`当前stocks对象:`, Object.keys(analysis.currentHoldings.stocks));

                            if (!analysis.currentHoldings.stocks[stockCode]) {
                                // 没有多头数据，创建纯空头数据
                                analysis.currentHoldings.stocks[stockCode] = {
                                    name: stockData.name,
                                    quantity: 0,
                                    averagePrice: 0,
                                    currentPrice: stockData.price,
                                    currentValue: 0,
                                    cost: 0,
                                    unrealizedProfit: 0,
                                    unrealizedProfitRate: 0,
                                    type: 'SHORT',
                                    shortQuantity: position.shares,
                                    shortAveragePrice: position.loan_price,
                                    shortUnrealizedProfit: unrealizedProfit,
                                    shortUnrealizedProfitRate: borrowValue > 0 ? (unrealizedProfit / borrowValue) * 100 : 0,
                                    hasHolding: true
                                };
                            } else {
                                // 已经有多头数据，添加空头信息
                                const existingStock = analysis.currentHoldings.stocks[stockCode];
                                existingStock.shortQuantity = position.shares;
                                existingStock.shortAveragePrice = position.loan_price;
                                existingStock.shortUnrealizedProfit = unrealizedProfit;
                                existingStock.shortUnrealizedProfitRate = borrowValue > 0 ? (unrealizedProfit / borrowValue) * 100 : 0;
                                existingStock.type = 'MIXED'; // 既有多头又有空头
                                existingStock.hasHolding = true;

                                console.log(`${stockCode} 合并空头数据后:`, existingStock);
                            }
                        }
                    });
                }

                // 计算总收益率
                analysis.currentHoldings.totalUnrealizedProfitRate =
                    analysis.currentHoldings.totalCost > 0
                        ? (analysis.currentHoldings.totalUnrealizedProfit / analysis.currentHoldings.totalCost) * 100
                        : 0;

                console.log('当前持仓分析完成:', analysis.currentHoldings);
                console.log('持仓股票详情:', analysis.currentHoldings.stocks);
            } catch (error) {
                console.error('获取当前持仓数据失败:', error);
            }
        }

        createAnalysisModule(analysis) {
            console.log('创建分析模块，数据:', analysis);
            const module = document.createElement('div');
            module.className = 'agsv-stock-life-analysis';

            // 计算总体统计
            const totalBuyAmount = analysis.typeAnalysis.BUY.amount;
            const totalSellAmount = analysis.typeAnalysis.SELL.amount;
            const totalBorrowAmount = analysis.typeAnalysis.BORROW.amount;
            const totalRepayAmount = analysis.typeAnalysis.REPAY.amount;
            const totalRealizedProfit = Object.values(analysis.stockAnalysis)
                .reduce((sum, stock) => sum + stock.realizedProfit, 0);

            // 当前持仓统计
            const currentHoldings = analysis.currentHoldings || {};
            const totalUnrealizedProfit = currentHoldings.totalUnrealizedProfit || 0;

            // 分别计算多头和空头持仓
            let longValue = 0, longCost = 0, longProfit = 0;
            let shortValue = 0, shortCost = 0, shortProfit = 0;

            if (currentHoldings.stocks) {
                console.log('开始计算多头和空头统计，股票数据:', currentHoldings.stocks);
                Object.entries(currentHoldings.stocks).forEach(([code, stock]) => {
                    console.log(`处理股票 ${code}:`, stock);
                    console.log(`${code} 空头字段检查: shortQuantity=${stock.shortQuantity}, shortAveragePrice=${stock.shortAveragePrice}, shortUnrealizedProfit=${stock.shortUnrealizedProfit}`);

                    if (stock.quantity > 0) { // 多头持仓
                        console.log(`${code} 多头持仓: 数量=${stock.quantity}, 市值=${stock.currentValue}, 成本=${stock.cost}, 收益=${stock.unrealizedProfit}`);
                        longValue += stock.currentValue || 0;
                        longCost += stock.cost || 0;
                        longProfit += stock.unrealizedProfit || 0;
                    }
                    if (stock.shortQuantity > 0) { // 空头持仓
                        const shortBorrowValue = stock.shortQuantity * stock.shortAveragePrice;
                        console.log(`${code} 空头持仓: 数量=${stock.shortQuantity}, 借入价=${stock.shortAveragePrice}, 价值=${shortBorrowValue}, 收益=${stock.shortUnrealizedProfit}`);
                        shortValue += shortBorrowValue;
                        shortCost += shortBorrowValue;
                        shortProfit += stock.shortUnrealizedProfit || 0;
                    } else {
                        console.log(`${code} 没有空头持仓: shortQuantity=${stock.shortQuantity}`);
                    }
                });
            }

            console.log('多头统计:', { longValue, longCost, longProfit });
            console.log('空头统计:', { shortValue, shortCost, shortProfit });

            const timeRangeText = analysis.timeRange.start && analysis.timeRange.end
                ? `${analysis.timeRange.start.toLocaleDateString()} - ${analysis.timeRange.end.toLocaleDateString()}`
                : '暂无数据';

            module.innerHTML = `
                <div class="agsv-analysis-header">
                    <h2>📈 股神之路 - 交易分析报告</h2>
                    <div class="agsv-analysis-period">${timeRangeText}</div>
                </div>

                <div class="agsv-analysis-grid">
                    <!-- 总体概览 -->
                    <div class="agsv-analysis-card agsv-overview-card">
                        <h3>📊 总体概览</h3>
                        <div class="agsv-stats-grid">
                            <!-- 已实现损益 -->
                            <div class="agsv-stat-section agsv-realized-section">
                                <h4>💰 已实现</h4>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">平仓收益</span>
                                    <span class="agsv-stat-value ${totalRealizedProfit >= 0 ? 'positive' : 'negative'}">
                                        ¥${totalRealizedProfit.toLocaleString()}
                                    </span>
                                </div>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">手续费</span>
                                    <span class="agsv-stat-value negative">¥${analysis.totalFees.toLocaleString()}</span>
                                </div>
                                <div class="agsv-stat-item agsv-highlight">
                                    <span class="agsv-stat-label">净收益</span>
                                    <span class="agsv-stat-value ${(totalRealizedProfit - analysis.totalFees) >= 0 ? 'positive' : 'negative'}">
                                        ¥${(totalRealizedProfit - analysis.totalFees).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <!-- 交易统计 -->
                            <div class="agsv-stat-section agsv-trading-section">
                                <h4>📊 交易</h4>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">次数</span>
                                    <span class="agsv-stat-value">${analysis.totalTrades}</span>
                                </div>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">总费用</span>
                                    <span class="agsv-stat-value negative">¥${analysis.totalFees.toLocaleString()}</span>
                                </div>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">平均费</span>
                                    <span class="agsv-stat-value">¥${analysis.totalTrades > 0 ? (analysis.totalFees / analysis.totalTrades).toFixed(2) : '0'}</span>
                                </div>
                            </div>

                            <!-- 持仓预计收益 -->
                            <div class="agsv-stat-section agsv-position-section">
                                <h4>📈 持仓</h4>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">多头</span>
                                    <span class="agsv-stat-value">¥${longValue.toLocaleString()}</span>
                                </div>
                                <div class="agsv-stat-item">
                                    <span class="agsv-stat-label">空头</span>
                                    <span class="agsv-stat-value">¥${shortValue.toLocaleString()}</span>
                                </div>
                                <div class="agsv-stat-item agsv-highlight">
                                    <span class="agsv-stat-label">浮盈</span>
                                    <span class="agsv-stat-value ${totalUnrealizedProfit >= 0 ? 'positive' : 'negative'}">
                                        ¥${totalUnrealizedProfit.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <!-- 总收益 -->
                            <div class="agsv-stat-section agsv-total-section">
                                <h4>🎯 总计</h4>
                                <div class="agsv-stat-item agsv-highlight">
                                    <span class="agsv-stat-label">总收益</span>
                                    <span class="agsv-stat-value ${(totalRealizedProfit + totalUnrealizedProfit) >= 0 ? 'positive' : 'negative'}">
                                        ¥${(totalRealizedProfit + totalUnrealizedProfit).toLocaleString()}
                                    </span>
                                </div>
                                <div class="agsv-stat-item agsv-highlight">
                                    <span class="agsv-stat-label">收益率</span>
                                    <span class="agsv-stat-value ${(totalRealizedProfit + totalUnrealizedProfit) >= 0 ? 'positive' : 'negative'}">
                                        ${totalBuyAmount > 0 ? (((totalRealizedProfit + totalUnrealizedProfit) / totalBuyAmount) * 100).toFixed(2) : '0.00'}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 操作类型分析 -->
                    <div class="agsv-analysis-card agsv-type-card">
                        <h3>🎯 操作分析</h3>
                        <div class="agsv-type-stats">
                            ${this.createTypeStatsHTML(analysis.typeAnalysis)}
                        </div>
                    </div>

                    <!-- 个股分析 -->
                    <div class="agsv-analysis-card agsv-stocks-card">
                        <h3>📈 个股交易分析</h3>
                        <div class="agsv-stocks-table">
                            ${this.createStocksTableHTML(analysis.stockAnalysis, analysis.currentHoldings)}
                        </div>
                    </div>
                </div>
            `;

            return module;
        }

        createTypeStatsHTML(typeAnalysis) {
            const types = [
                { key: 'BUY', name: '买入', icon: '📈', color: '#28a745' },
                { key: 'SELL', name: '卖出', icon: '📉', color: '#dc3545' },
                { key: 'BORROW', name: '借入', icon: '📊', color: '#ffc107' },
                { key: 'REPAY', name: '归还', icon: '🔄', color: '#6c757d' }
            ];

            return types.map(type => {
                const data = typeAnalysis[type.key];
                const avgPrice = data.volume > 0 ? (data.amount / data.volume).toFixed(2) : '0.00';

                return `
                    <div class="agsv-type-stat" style="border-left: 3px solid ${type.color}">
                        <div class="agsv-type-header">
                            <span class="agsv-type-icon">${type.icon}</span>
                            <span class="agsv-type-name">${type.name}</span>
                        </div>
                        <div class="agsv-type-details">
                            <div>次数: <strong>${data.count}</strong></div>
                            <div>金额: <strong>¥${data.amount.toLocaleString()}</strong></div>
                            <div>均价: <strong>¥${avgPrice}</strong></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        createStocksTableHTML(stockAnalysis, currentHoldings = {}) {
            // 合并历史交易数据和当前持仓数据
            const allStocks = new Map();

            // 添加历史交易数据
            Object.entries(stockAnalysis).forEach(([code, data]) => {
                allStocks.set(code, { ...data, hasHistory: true });
            });

            // 添加当前持仓数据
            if (currentHoldings.stocks) {
                Object.entries(currentHoldings.stocks).forEach(([code, holdingData]) => {
                    if (allStocks.has(code)) {
                        // 合并数据
                        const existing = allStocks.get(code);
                        allStocks.set(code, {
                            ...existing,
                            ...holdingData,
                            hasHolding: true
                        });
                    } else {
                        // 只有持仓，没有历史交易
                        allStocks.set(code, {
                            ...holdingData,
                            trades: 0,
                            netPosition: 0,
                            netBorrowPosition: 0,
                            avgBuyPrice: 0,
                            avgSellPrice: 0,
                            realizedProfit: 0,
                            fees: 0,
                            hasHolding: true,
                            hasHistory: false
                        });
                    }
                });
            }

            const stocks = Array.from(allStocks.entries())
                .sort((a, b) => {
                    // 优先显示有持仓的股票，然后按交易次数排序
                    if (a[1].hasHolding && !b[1].hasHolding) return -1;
                    if (!a[1].hasHolding && b[1].hasHolding) return 1;
                    return b[1].trades - a[1].trades;
                });

            if (stocks.length === 0) {
                return '<div class="agsv-no-data">暂无个股数据</div>';
            }

            return `<table class="agsv-stocks-analysis-table">
                    <thead>
                        <tr>
                            <th>股票</th>
                            <th>持仓详情</th>
                            <th>当前价格</th>
                            <th>浮动盈亏</th>
                            <th>已实现收益</th>
                            <th>交易次数</th>
                            <th>手续费</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stocks.map(([code, data]) => {
                            const currentQuantity = data.quantity || 0;
                            const shortQuantity = data.shortQuantity || 0;
                            const unrealizedProfit = (data.unrealizedProfit || 0) + (data.shortUnrealizedProfit || 0);

                            // 计算总成本（多头成本 + 空头成本）
                            let totalCost = data.cost || 0;
                            if (shortQuantity > 0 && data.shortAveragePrice) {
                                totalCost += shortQuantity * data.shortAveragePrice;
                            }

                            // 构建详细的持仓信息
                            let positionDetails = '';
                            let positionClass = '';

                            if (currentQuantity > 0 && shortQuantity > 0) {
                                // 混合持仓
                                positionDetails = `
                                    <div class="agsv-position-mixed">
                                        <div class="agsv-long-detail">
                                            <span class="agsv-position-icon">📈</span>
                                            <span class="agsv-position-text">多${currentQuantity}股</span>
                                            <span class="agsv-position-price">@¥${(data.averagePrice || 0).toFixed(2)}</span>
                                        </div>
                                        <div class="agsv-short-detail">
                                            <span class="agsv-position-icon">📉</span>
                                            <span class="agsv-position-text">空${shortQuantity}股</span>
                                            <span class="agsv-position-price">@¥${(data.shortAveragePrice || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                `;
                                positionClass = 'mixed-position';
                            } else if (currentQuantity > 0) {
                                // 纯多头
                                positionDetails = `
                                    <div class="agsv-position-long">
                                        <span class="agsv-position-icon">📈</span>
                                        <span class="agsv-position-text">多头 ${currentQuantity}股</span>
                                        <span class="agsv-position-price">@¥${(data.averagePrice || 0).toFixed(2)}</span>
                                    </div>
                                `;
                                positionClass = 'long-position';
                            } else if (shortQuantity > 0) {
                                // 纯空头
                                positionDetails = `
                                    <div class="agsv-position-short">
                                        <span class="agsv-position-icon">📉</span>
                                        <span class="agsv-position-text">空头 ${shortQuantity}股</span>
                                        <span class="agsv-position-price">@¥${(data.shortAveragePrice || 0).toFixed(2)}</span>
                                    </div>
                                `;
                                positionClass = 'short-position';
                            } else {
                                // 无持仓（只有历史交易）
                                positionDetails = `
                                    <div class="agsv-position-none">
                                        <span class="agsv-position-icon">📊</span>
                                        <span class="agsv-position-text">无持仓</span>
                                    </div>
                                `;
                                positionClass = 'no-position';
                            }

                            return `
                                <tr class="agsv-stock-row ${positionClass} ${data.hasHolding ? 'agsv-has-holding' : ''}">
                                    <td>
                                        <div class="agsv-stock-info">
                                            <span class="agsv-stock-name">${data.name}</span>
                                            <span class="agsv-stock-code">${code}</span>
                                        </div>
                                    </td>
                                    <td class="agsv-position-cell">
                                        ${positionDetails}
                                    </td>
                                    <td class="agsv-price">
                                        ${data.currentPrice ?
                                            `<div class="agsv-current-price">
                                                <span class="agsv-price-value">¥${data.currentPrice.toFixed(2)}</span>
                                                <small class="agsv-price-label">当前价</small>
                                            </div>` :
                                            '<span class="agsv-no-price">--</span>'
                                        }
                                    </td>
                                    <td class="agsv-profit ${unrealizedProfit >= 0 ? 'positive' : 'negative'}">
                                        ${data.hasHolding ? '¥' + unrealizedProfit.toFixed(2) : '--'}
                                        ${data.hasHolding && data.unrealizedProfitRate ?
                                            `<small class="agsv-profit-rate">(${data.unrealizedProfitRate.toFixed(2)}%)</small>` : ''}
                                    </td>
                                    <td class="agsv-realized ${data.realizedProfit >= 0 ? 'positive' : 'negative'}">
                                        ¥${data.realizedProfit.toFixed(2)}
                                    </td>
                                    <td class="agsv-trades">${data.trades}</td>
                                    <td class="agsv-fees negative">¥${data.fees.toFixed(2)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>`;
        }

        formatPositionText(longQuantity, shortQuantity) {
            const parts = [];
            if (longQuantity > 0) {
                parts.push(`多${longQuantity}`);
            }
            if (shortQuantity > 0) {
                parts.push(`空${shortQuantity}`);
            }
            return parts.length > 0 ? parts.join(' ') : '--';
        }

        getPositionClass(longQuantity, shortQuantity) {
            if (longQuantity > 0 && shortQuantity > 0) return 'warning'; // 多空都有
            if (longQuantity > 0) return 'positive'; // 只有多头
            if (shortQuantity > 0) return 'negative'; // 只有空头
            return ''; // 无持仓
        }

        async enhanceHoldingsTable() {
            const table = document.querySelector(CONFIG.TARGET_TABLE_SELECTOR);
            if (!table) return;

            // 找到多头表格的容器，添加标题
            const holdingsSection = table.closest('div');
            if (holdingsSection) {
                // 检查是否已经有标题
                let sectionTitle = holdingsSection.querySelector('h3');
                if (!sectionTitle) {
                    // 创建多头持仓标题
                    sectionTitle = document.createElement('h3');
                    holdingsSection.insertBefore(sectionTitle, table);
                }
                sectionTitle.textContent = '多头持仓';
                sectionTitle.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    margin: 0 0 16px 0;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                `;
            }

            const [stockInfo, history] = await Promise.all([
                this.dataManager.getStockInfo(),
                this.dataManager.getHistory()
            ]);

            const calculatedHoldings = calculatePortfolioPerformance(history.data, stockInfo);
            this.injectHoldingsData(table, calculatedHoldings);
        }

        async enhanceLeveragedTable() {
            // 找到所有的持仓区域
            const positionSections = document.querySelectorAll('._positionSection_1oy4v_13');

            // 第二个区域应该是借入持仓，我们要把它改成空头持仓
            const leveragedSection = positionSections[1];
            if (!leveragedSection) return;

            const table = leveragedSection.querySelector('table');
            if (!table) return;

            // 修改标题为空头持仓
            const sectionTitle = leveragedSection.querySelector('h3');
            if (sectionTitle) {
                sectionTitle.textContent = '空头持仓';
                sectionTitle.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    margin: 0 0 16px 0;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                `;
            }

            const [stockInfo, leveragedData] = await Promise.all([
                this.dataManager.getStockInfo(),
                this.dataManager.getLeveraged()
            ]);

            // 增强空头持仓表格（保留原始结构和归还按钮）
            this.enhanceLeveragedTableKeepOriginal(table, leveragedData.data, stockInfo);
        }

        enhanceLeveragedTableKeepOriginal(table, leveragedData, stockInfo) {
            // 保留原始表格结构，只增强样式和添加分析列
            const headerRow = table.querySelector('thead tr');
            const dataBody = table.querySelector('tbody');

            if (!headerRow || !dataBody) {
                console.warn('未找到借入持仓表格的表头或数据体。');
                return;
            }

            // 统一现有表头样式
            headerRow.querySelectorAll('th').forEach(th => {
                th.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 8px;
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
                `;
            });

            // 添加新的分析列到表头
            const existingHeaders = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());

            // 如果还没有分析列，添加它们
            const newHeaders = ['预计收益', '预计收益率'];
            newHeaders.forEach(headerText => {
                if (!existingHeaders.includes(headerText)) {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    th.style.cssText = `
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 8px;
                        font-size: 12px;
                        font-weight: 600;
                        text-align: center;
                        border: 1px solid #5a67d8;
                        box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
                    `;
                    headerRow.appendChild(th);
                }
            });

            // 添加操作建议列（在最后）
            if (!existingHeaders.includes('操作建议')) {
                const th = document.createElement('th');
                th.textContent = '操作建议';
                th.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 8px;
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
                `;
                headerRow.appendChild(th);
            }

            // 创建股票名称到信息的映射
            const stockNameMap = Object.fromEntries(
                stockInfo.map(stock => [stock.name, stock])
            );

            dataBody.querySelectorAll('tr').forEach(row => {
                // 统一现有单元格的样式
                row.querySelectorAll('td').forEach(td => {
                    // 保留按钮的原始样式，只修改普通单元格
                    if (!td.querySelector('button')) {
                        td.style.cssText = `
                            padding: 12px 8px;
                            text-align: center;
                            border: 1px solid #e1e5e9;
                            background: #fafbfc;
                            font-size: 13px;
                            color: #333;
                        `;
                    }
                });

                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return;

                // 获取股票信息
                const stockName = cells[1]?.textContent.trim();
                const quantity = parseFloat(cells[2]?.textContent.trim());
                const loanPrice = parseFloat(cells[3]?.textContent.trim());

                const stockData = stockNameMap[stockName];
                if (!stockData) {
                    console.warn(`未找到股票信息: ${stockName}`);
                    // 添加空的分析列
                    for (let i = 0; i < 3; i++) {
                        if (cells.length <= 6 + i) { // 避免重复添加
                            row.appendChild(this.createStyledCell('--'));
                        }
                    }
                    return;
                }

                const currentPrice = stockData.price;
                const profit = (loanPrice - currentPrice) * quantity;
                const profitRate = ((loanPrice - currentPrice) / loanPrice) * 100;

                console.log(`空头分析 - ${stockName}: 借入价格=${loanPrice}, 当前价格=${currentPrice}, 收益=${profit.toFixed(2)}, 收益率=${profitRate.toFixed(2)}%`);

                // 只在还没有分析列时添加
                if (cells.length <= 7) { // 原始表格有7列（包含归还按钮）
                    // 预计收益
                    row.appendChild(this.createProfitCell(profit));

                    // 预计收益率
                    row.appendChild(this.createRateCell(profitRate));

                    // 操作建议（添加在最后，归还按钮保持在原位置）
                    row.appendChild(this.createSuggestionCell(profitRate, true));
                }
            });

            console.log('空头持仓表格增强完成（保留原始结构）');
        }

        injectHoldingsData(table, calculatedHoldings) {
            // 移除重复检查，确保样式能正确应用

            const headerRow = table.querySelector('thead tr, tbody tr');
            const dataBody = table.querySelectorAll('tbody')[1] || table.querySelector('tbody');

            if (!headerRow || !dataBody) {
                console.warn('未找到持仓表格的表头或数据体。');
                return;
            }

            // 统一的表头样式
            this.addTableHeaders(headerRow, ['持仓均价', '持仓成本', '预计收益', '预计收益率', '操作建议']);

            const stockNameToCodeMap = Object.fromEntries(
                Object.entries(calculatedHoldings).map(([code, data]) => [data.name, code])
            );

            dataBody.querySelectorAll('tr').forEach(row => {
                // 统一现有单元格的样式
                row.querySelectorAll('td').forEach(td => {
                    td.style.cssText = `
                        padding: 12px 8px;
                        text-align: center;
                        border: 1px solid #e1e5e9;
                        background: #fafbfc;
                        font-size: 13px;
                        color: #333;
                    `;
                });

                const stockName = row.cells[0]?.textContent.trim();
                if (!stockName) return;

                const stockCode = stockNameToCodeMap[stockName];
                const stockData = calculatedHoldings[stockCode];

                if (stockData) {
                    const {costPerShare, totalHoldingCost, estimatedProfitLoss, estimatedReturnRate} = stockData;

                    // 持仓均价
                    row.appendChild(this.createStyledCell(costPerShare.toFixed(2)));

                    // 持仓成本
                    row.appendChild(this.createStyledCell(this.formatCurrency(totalHoldingCost)));

                    // 预计收益
                    row.appendChild(this.createProfitCell(estimatedProfitLoss));

                    // 预计收益率
                    row.appendChild(this.createRateCell(estimatedReturnRate));

                    // 操作建议
                    row.appendChild(this.createSuggestionCell(estimatedReturnRate, false));
                } else {
                    for (let i = 0; i < 5; i++) {
                        row.appendChild(this.createStyledCell('--'));
                    }
                }
            });
        }



        addTableHeaders(headerRow, headers) {
            // 首先统一现有表头的样式
            headerRow.querySelectorAll('th').forEach(th => {
                th.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    color: white !important;
                    padding: 12px 8px !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    text-align: center !important;
                    border: 1px solid #5a67d8 !important;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2) !important;
                `;
            });

            // 添加新的表头
            headers.forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                th.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 8px;
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
                `;
                headerRow.appendChild(th);
            });
        }

        createStyledCell(content, color = null) {
            const cell = document.createElement('td');
            cell.textContent = content;
            cell.style.cssText = `
                padding: 12px 8px !important;
                text-align: center !important;
                border: 1px solid #e1e5e9 !important;
                background: #fafbfc !important;
                font-size: 13px !important;
                ${color ? `color: ${color} !important; font-weight: 600 !important;` : 'color: #333 !important;'}
            `;
            return cell;
        }

        createProfitCell(profit) {
            const color = profit > 0 ? '#10b981' : (profit < 0 ? '#ef4444' : '#6b7280');
            const content = profit === 'N/A' ? 'N/A' : this.formatCurrency(profit);
            return this.createStyledCell(content, color);
        }

        createRateCell(rate) {
            const color = rate > 0 ? '#10b981' : (rate < 0 ? '#ef4444' : '#6b7280');
            const content = rate === 'N/A' ? '--' : `${rate.toFixed(2)}%`;
            return this.createStyledCell(content, color);
        }

        formatCurrency(amount) {
            return amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        createCell(content, color = null) {
            const cell = document.createElement('td');
            cell.textContent = content;
            cell.style.cssText = `padding: 8px; text-align: center; border: 1px solid #e1e5e9; ${color ? `color: ${color}; font-weight: 600;` : ''}`;
            return cell;
        }

        createSuggestionCell(returnRate, isShort = false) {
            const cell = document.createElement('td');
            cell.style.cssText = `
                padding: 12px 8px;
                text-align: center;
                border: 1px solid #e1e5e9;
                background: #fafbfc;
            `;

            let suggestion = '持有';
            let bgColor = '#6b7280';
            let icon = '📊';

            if (returnRate !== 'N/A') {
                if (isShort) {
                    // 做空建议逻辑
                    if (returnRate > 15) {
                        suggestion = '建议平仓';
                        bgColor = '#10b981';
                        icon = '🎯';
                    } else if (returnRate > 5) {
                        suggestion = '考虑平仓';
                        bgColor = '#059669';
                        icon = '💰';
                    } else if (returnRate < -15) {
                        suggestion = '考虑止损';
                        bgColor = '#ef4444';
                        icon = '⚠️';
                    } else if (returnRate < -5) {
                        suggestion = '注意风险';
                        bgColor = '#f59e0b';
                        icon = '⚡';
                    } else if (returnRate > 0) {
                        suggestion = '继续做空';
                        bgColor = '#8b5cf6';
                        icon = '📈';
                    } else {
                        suggestion = '观望';
                        bgColor = '#06b6d4';
                        icon = '👀';
                    }
                } else {
                    // 多头建议逻辑
                    if (returnRate > 15) {
                        suggestion = '建议减仓';
                        bgColor = '#10b981';
                        icon = '🎯';
                    } else if (returnRate > 5) {
                        suggestion = '考虑减仓';
                        bgColor = '#059669';
                        icon = '💰';
                    } else if (returnRate < -15) {
                        suggestion = '考虑止损';
                        bgColor = '#ef4444';
                        icon = '⚠️';
                    } else if (returnRate < -5) {
                        suggestion = '注意风险';
                        bgColor = '#f59e0b';
                        icon = '⚡';
                    } else if (returnRate > 0) {
                        suggestion = '继续持有';
                        bgColor = '#8b5cf6';
                        icon = '📈';
                    } else {
                        suggestion = '观望';
                        bgColor = '#06b6d4';
                        icon = '👀';
                    }
                }
            }

            cell.style.cssText = `
                padding: 12px 8px !important;
                text-align: center !important;
                border: 1px solid #e1e5e9 !important;
                background: #fafbfc !important;
            `;

            cell.innerHTML = `
                <span style="
                    background: linear-gradient(135deg, ${bgColor} 0%, ${this.darkenColor(bgColor)} 100%) !important;
                    color: white !important;
                    padding: 6px 12px !important;
                    border-radius: 16px !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    display: inline-block !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    border: 1px solid ${this.darkenColor(bgColor)} !important;
                ">${icon} ${suggestion}</span>
            `;
            return cell;
        }

        darkenColor(color) {
            // 简单的颜色加深函数
            const colorMap = {
                '#10b981': '#047857',
                '#059669': '#065f46',
                '#ef4444': '#dc2626',
                '#f59e0b': '#d97706',
                '#8b5cf6': '#7c3aed',
                '#06b6d4': '#0891b2',
                '#6b7280': '#4b5563'
            };
            return colorMap[color] || color;
        }

        forceStyleRefresh() {
            // 强制刷新所有表格的样式，确保统一
            console.log('开始强制刷新表格样式...');

            // 找到多头持仓表格（第一个紫色表格）
            const holdingsTable = document.querySelector(CONFIG.TARGET_TABLE_SELECTOR);

            // 找到所有持仓区域
            const positionSections = document.querySelectorAll('._positionSection_1oy4v_13');

            const tables = [holdingsTable];

            // 添加所有持仓区域的表格
            positionSections.forEach(section => {
                const table = section.querySelector('table');
                if (table) tables.push(table);
            });

            tables.forEach((table, index) => {
                if (!table) return;

                console.log(`刷新表格 ${index + 1}:`, table);

                // 统一所有表头样式
                const headers = table.querySelectorAll('th');
                headers.forEach(th => {
                    th.style.cssText = `
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        color: white !important;
                        padding: 12px 8px !important;
                        font-size: 12px !important;
                        font-weight: 600 !important;
                        text-align: center !important;
                        border: 1px solid #5a67d8 !important;
                        box-shadow: inset 0 1px 0 rgba(255,255,255,0.2) !important;
                    `;
                });

                // 统一所有数据单元格样式
                const cells = table.querySelectorAll('td');
                cells.forEach(td => {
                    const row = td.parentElement;
                    const cellIndex = Array.from(row.children).indexOf(td);

                    // 不修改包含徽章或按钮的单元格，也不修改分析列（预计收益、预计收益率）
                    const hasSpecialContent = td.querySelector('span') || td.querySelector('button');
                    const isAnalysisColumn = cellIndex >= 7; // 第8列开始是分析列

                    if (!hasSpecialContent && !isAnalysisColumn) {
                        td.style.cssText = `
                            padding: 12px 8px !important;
                            text-align: center !important;
                            border: 1px solid #e1e5e9 !important;
                            background: #fafbfc !important;
                            font-size: 13px !important;
                            color: #333 !important;
                        `;
                    }
                });
            });

            console.log('表格样式强制刷新完成');
        }
    }

    // --- 6. 主应用类 ---
    class AGSVEnhancedApp {
        constructor() {
            this.dataManager = new DataManager();
            this.ui = new EnhancedUI(this.dataManager);
            this.tableEnhancer = new TableEnhancer(this.dataManager);
            this.controlsEnhancer = new OriginalControlsEnhancer();
            this.init();
        }

        async init() {
            console.log('AGSV增强版启动...');

            // 等待页面加载完成
            await this.waitForPageReady();

            // 增强表格
            await this.tableEnhancer.enhanceTable();

            // 强制刷新表格样式，确保统一
            setTimeout(() => {
                this.tableEnhancer.forceStyleRefresh();
            }, 1000);

            // 空头表格已经在enhanceLeveragedTable中处理了

            // 添加动画样式
            this.addAnimationStyles();

            console.log('AGSV增强版启动完成！');
        }

        waitForPageReady() {
            return new Promise((resolve) => {
                const checkTable = () => {
                    const table = document.querySelector(CONFIG.TARGET_TABLE_SELECTOR);
                    const td = table?.querySelector('td');
                    if (td) {
                        resolve();
                    } else {
                        setTimeout(checkTable, 500);
                    }
                };
                checkTable();
            });
        }

        addAnimationStyles() {
            GM_addStyle(`
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                }

                .agsv-enhanced-table td:hover {
                    background: #e3f2fd !important;
                    transition: background 0.2s ease;
                }

                .agsv-trade-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `);
        }
    }

    // --- 启动应用 ---
    try {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AGSVEnhancedApp();
            });
        } else {
            new AGSVEnhancedApp();
        }
    } catch (error) {
        console.error('AGSV增强版启动失败:', error);
    }

})();
