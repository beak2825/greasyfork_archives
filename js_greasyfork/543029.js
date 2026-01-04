// ==UserScript==
// @name         GMGN 前排统计
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  统计GMGN任意代币前排地址的数据，让数字来说话！新增首次记录和涨跌提醒功能，所有数字可点击查看详情，弹框显示净流入数据，负数红色显示，点击外部关闭
// @match        https://gmgn.ai/*
// @match        https://www.gmgn.ai/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543029/GMGN%20%E5%89%8D%E6%8E%92%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/543029/GMGN%20%E5%89%8D%E6%8E%92%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量 - 跟踪下载按钮状态
    let isDownloadInProgress = false;
    let currentCAAddress = '';

    // 现代化提示框函数
    function showModernToast(message, type = 'success', duration = 3000) {
        // 移除现有的提示框
        const existingToast = document.querySelector('.modern-toast');
        const existingOverlay = document.querySelector('.modern-toast-overlay');
        if (existingToast) existingToast.remove();
        if (existingOverlay) existingOverlay.remove();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modern-toast-overlay';

        // 创建提示框
        const toast = document.createElement('div');
        toast.className = 'modern-toast';

        // 根据类型设置图标
        let icon, iconClass;
        switch (type) {
            case 'success':
                icon = '✓';
                iconClass = 'success';
                break;
            case 'error':
                icon = '✕';
                iconClass = 'error';
                break;
            case 'info':
                icon = 'ℹ';
                iconClass = 'info';
                break;
            default:
                icon = '✓';
                iconClass = 'success';
        }

        toast.innerHTML = `
            <div class="modern-toast-content">
                <div class="modern-toast-icon ${iconClass}">${icon}</div>
                <div class="modern-toast-text">${message}</div>
                <button class="modern-toast-close">&times;</button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(toast);

        // 关闭函数
        const closeToast = () => {
            toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            overlay.style.animation = 'overlayFadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
                if (overlay.parentNode) overlay.remove();
            }, 300);
        };

        // 绑定关闭事件
        const closeBtn = toast.querySelector('.modern-toast-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeToast();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', closeToast);

        // 点击提示框本身也可以关闭
        toast.addEventListener('click', closeToast);

        // 自动关闭
        if (duration > 0) {
            setTimeout(closeToast, duration);
        }

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeToast();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // 返回关闭函数，允许手动关闭
        return closeToast;
    }

    // 动态添加 CSS
    const style = document.createElement('style');
    style.textContent = `
    .statistic-gmgn-stats-container {
        background-color: transparent;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        margin-right: 8px;
        margin-bottom:8px;
        border: 1px solid #333;
        /* 精细的右侧和下侧发光效果 */
        box-shadow:
            2px 2px 4px rgba(0, 119, 255, 0.6),  /* 右下外发光（更小的偏移和模糊） */
            1px 1px 2px rgba(0, 119, 255, 0.4),  /* 精细的次级发光 */
            inset 0 0 3px rgba(0, 119, 255, 0.2); /* 更细腻的内发光 */
        padding: 4px 6px;
        max-width: fit-content;
    }
    .statistic-gmgn-stats-header, .statistic-gmgn-stats-data {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        text-align: center;
        gap: 6px;
        font-weight: normal;
        font-size: 13px;
    }
    .statistic-gmgn-stats-header.sol-network, .statistic-gmgn-stats-data.sol-network {
        grid-template-columns: repeat(13, minmax(auto, 1fr));
        gap: 4px;
        font-size: 12px;
    }
    .statistic-gmgn-stats-header span {
        color: #ccc;
        font-weight: normal;
        padding: 1px 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .statistic-gmgn-stats-header.sol-network span {
        font-size: 11px;
        padding: 1px;
    }
    .statistic-gmgn-stats-data span {
        color: #00ff00;
        font-weight: normal;
        cursor: default;
        transition: all 0.2s ease;
        padding: 1px 3px;
        border-radius: 2px;
        min-width: 0;
        white-space: nowrap;
    }
    .statistic-gmgn-stats-data span.clickable {
        cursor: pointer;
    }
    .statistic-gmgn-stats-data span.clickable:hover {
        background-color: rgba(0, 255, 0, 0.1);
        border-radius: 3px;
        transform: scale(1.03);
    }
    .statistic-gmgn-stats-data.sol-network span {
        padding: 1px 2px;
        font-size: 12px;
    }
    .statistic-gmgn-stats-data span .statistic-up-arrow,
    .statistic-up-arrow {
        color: green !important;
        margin-left: 2px;
        font-weight: bold;
    }
    .statistic-gmgn-stats-data span .statistic-down-arrow,
    .statistic-down-arrow {
        color: red !important;
        margin-left: 2px;
        font-weight: bold;
    }




    /* 完整弹框CSS样式 - 现代化设计 */
    .statistic-gmgn-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6); /* 简化为纯色，提升性能 */
                /* backdrop-filter: blur(8px); */ /* 移除性能杀手 */
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                /* animation: modalFadeIn 0.3s ease-out; */ /* 移除动画，提升性能 */
    }
    .statistic-gmgn-modal-content {
        background: #1e293b !important; /* 简化为纯色，提升性能 */
        border-radius: 16px !important;
        width: 85% !important;
        max-width: 900px !important;
        max-height: 85vh !important;
        overflow-y: auto !important;
        padding: 24px !important;
        color: white !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(0.95) !important;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1) !important;
        margin: 0 !important;
        z-index: 100000 !important;
        box-sizing: border-box !important;
        min-height: auto !important;
        min-width: 320px !important;
        pointer-events: auto !important;
        /* 移除动画，直接显示 */
        backface-visibility: hidden !important;
        contain: layout style paint !important;
        /* 优化滚动性能 */
        overflow-anchor: none !important;
        scroll-behavior: smooth !important;
        -webkit-overflow-scrolling: touch !important;
    }
    .statistic-gmgn-modal-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 24px !important;
        padding: 16px 20px !important;
        margin: -24px -24px 24px -24px !important;
        background: rgba(99, 102, 241, 0.1) !important; /* 简化为纯色，提升性能 */
        border-radius: 16px 16px 0 0 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        /* backdrop-filter: blur(10px) !important; */ /* 移除性能杀手 */
    }
    .statistic-gmgn-modal-title {
        font-size: 20px !important;
        font-weight: 700 !important;
        color: white !important;
        margin: 0 !important;
        color: #ffffff !important; /* 简化文本渐变为纯色，提升性能 */
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
    }
    .statistic-gmgn-modal-close {
        background: rgba(148, 163, 184, 0.1) !important;
        border: 1px solid rgba(148, 163, 184, 0.2) !important;
        color: #94a3b8 !important;
        font-size: 18px !important;
        cursor: pointer !important;
        padding: 8px !important;
        line-height: 1 !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background-color 0.2s ease !important; /* 简化过渡，提升性能 */
    }
    .statistic-gmgn-modal-close:hover {
        color: #fff !important;
        background: #ef4444 !important; /* 简化为纯色，提升性能 */
        border-color: #ef4444 !important;
        /* transform: scale(1.1) !important; */ /* 移除复杂变换，提升性能 */
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
    }
    .statistic-gmgn-result-item {
        background: rgba(51, 65, 85, 0.6); /* 简化为纯色，提升性能 */
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        position: relative;
        overflow: hidden;
        /* 性能优化 - 硬件加速 */
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
        contain: layout style;
        /* 减少backdrop-filter在大数据量时的性能消耗 */
    }
    .statistic-gmgn-result-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translateZ(0);
    }
    .statistic-gmgn-result-item:hover {
        background: rgba(51, 65, 85, 0.8); /* 简化为纯色，提升性能 */
        transform: translateY(-2px) translateZ(0);
        box-shadow:
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-result-item:hover::before {
        opacity: 1;
    }
    .statistic-gmgn-analysis-summary {
        margin-bottom: 24px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(38, 50, 56, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%);
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        /* backdrop-filter: blur(10px); */ /* 移除性能杀手 */
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    .statistic-gmgn-summary-stats {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
    }
    .statistic-gmgn-stat-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        min-width: 80px;
    }
    .statistic-gmgn-stat-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-stat-label {
        color: #94a3b8;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .statistic-gmgn-stat-value {
        font-weight: 700;
        font-size: 18px;
        background: #3b82f6; /* 简化为纯色，提升性能 */
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        gap: 8px;
    }
    .statistic-gmgn-result-rank {
        font-size: 14px;
        color: #94a3b8;
        font-weight: 600;
        min-width: 30px;
    }
    .statistic-gmgn-result-address {
        font-weight: 600;
        word-break: break-all;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        background: linear-gradient(135deg, rgba(71, 85, 105, 0.6), rgba(51, 65, 85, 0.8));
        border: 1px solid rgba(0, 255, 136, 0.3);
        flex: 1;
        min-width: 200px;
        color: #00ff88;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        position: relative;
        overflow: hidden;
    }
    .statistic-gmgn-result-address::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
        transition: left 0.5s ease;
    }
    .statistic-gmgn-result-address:hover {
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(51, 65, 85, 0.9));
        border-color: #00ff88;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
    }
    .statistic-gmgn-result-address:hover::before {
        left: 100%;
    }
    .statistic-gmgn-detail-section {
        margin-bottom: 12px;
    }
    .statistic-gmgn-section-title {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .statistic-gmgn-detail-grid {
        display: grid;
        grid-template-columns: 80px 1fr 80px 1fr;
        gap: 4px 8px;
        align-items: start;
        font-size: 12px;
    }
    .statistic-gmgn-detail-label {
        color: #94a3b8;
        font-size: 12px;
        padding: 2px 0;
        align-self: start;
    }
    .statistic-gmgn-detail-value {
        font-size: 12px;
        color: #e2e8f0;
        padding: 2px 0;
        word-break: break-word;
        line-height: 1.4;
    }
    .statistic-gmgn-value-highlight {
        color: #3b82f6;
        font-weight: 600;
    }
    .statistic-gmgn-compact-details .statistic-gmgn-detail-section {
        margin-bottom: 8px;
    }
    .statistic-gmgn-compact-details .statistic-gmgn-detail-section {
        margin-left: 10px;
    }
    .statistic-gmgn-address-jump-btn {
        background: #10b981; /* 简化为纯色，提升性能 */
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }
    .statistic-gmgn-address-jump-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.4s ease;
    }
    .statistic-gmgn-address-jump-btn:hover {
        background: #059669; /* 简化为纯色，提升性能 */
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        border-color: #10b981;
    }
    .statistic-gmgn-address-jump-btn:hover::before {
        left: 100%;
    }
    .statistic-gmgn-address-jump-btn:active {
        transform: translateY(0) scale(1);
    }

    .statistic-gmgn-profit-positive {
        color: #00ff88 !important;
    }

    .statistic-gmgn-profit-negative {
        color: #ff4444 !important;
    }

    .statistic-gmgn-empty-message {
        text-align: center;
        color: #ccc;
        padding: 20px;
        margin: 0;
    }

    .statistic-gmgn-stats-info {
        text-align: center !important;
        margin-bottom: 15px !important;
        padding: 10px !important;
        background: rgba(0, 119, 255, 0.1) !important;
        border-radius: 8px !important;
        border: 1px solid rgba(0, 119, 255, 0.3) !important;
        color: #fff !important;
        font-size: 14px !important;
    }

    .statistic-gmgn-export-btn {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: white !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
        padding: 12px 20px !important;
        border-radius: 12px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important; /* 简化过渡，提升性能 */
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        position: relative !important;
        overflow: hidden !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
    }
    .statistic-gmgn-export-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    .statistic-gmgn-export-btn:hover {
        background: linear-gradient(135deg, #059669, #047857) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4) !important;
        border-color: #10b981 !important;
    }
    .statistic-gmgn-export-btn:hover::before {
        left: 100% !important;
    }
    .statistic-gmgn-export-btn:active {
        transform: translateY(0) !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
    }

    /* 移除动画关键帧，直接显示弹出框 */

    /* 响应式设计优化 */
    @media (max-width: 768px) {
        .statistic-gmgn-modal-content {
            width: 95% !important;
            padding: 16px !important;
            margin: 10px !important;
        }

        .statistic-gmgn-modal-header {
            padding: 12px 16px !important;
            margin: -16px -16px 16px -16px !important;
        }

        .statistic-gmgn-summary-stats {
            gap: 16px;
            flex-wrap: wrap;
        }

        .statistic-gmgn-stat-item {
            min-width: 60px;
            padding: 6px 8px;
        }

        .statistic-gmgn-result-address {
            font-size: 11px;
            padding: 6px 8px;
        }
    }

    /* 自定义滚动条 */
    .statistic-gmgn-modal-content::-webkit-scrollbar {
        width: 8px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-thumb {
        background: #3b82f6; /* 简化为纯色，提升性能 */
        border-radius: 4px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-thumb:hover {
        background: #2563eb; /* 简化为纯色，提升性能 */
    }

    /* 加载状态动画 */
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .statistic-gmgn-loading {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* 分页控制样式 */
    .statistic-gmgn-pagination-info {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 16px;
        text-align: center;
    }

    .statistic-pagination-text {
        color: #3b82f6;
        font-size: 12px;
        font-weight: 500;
    }

    .statistic-gmgn-pagination-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        margin: 16px -24px -24px -24px;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
        border-radius: 0 0 16px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .statistic-pagination-btn {
        background: #3b82f6; /* 简化为纯色，提升性能 */
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: translateZ(0);
    }

    .statistic-pagination-btn:hover:not(:disabled) {
        background: #2563eb; /* 简化为纯色，提升性能 */
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .statistic-pagination-btn:disabled {
        background: rgba(148, 163, 184, 0.3);
        color: rgba(148, 163, 184, 0.6);
        cursor: not-allowed;
        transform: none;
    }

    .statistic-pagination-current {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 500;
    }

    /* 可疑地址类型标识样式 */
    .statistic-suspicious-labels {
        display: inline-flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-left: 12px;
        align-items: center;
    }

    .statistic-suspicious-label {
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 10px;
        border: 1px solid;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
        cursor: default;
    }

    .statistic-suspicious-label:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .statistic-suspicious-label::before {
        content: '⚠';
        font-size: 8px;
    }

    .statistic-suspicious-label.rat-trader::before {
        content: '🐭';
    }

    .statistic-suspicious-label.transfer-in::before {
        content: '⬇';
    }

    .statistic-suspicious-label.bundler::before {
        content: '📦';
    }

    /* 现代化详情数据样式 */
    .statistic-detail-grid-modern {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        padding: 8px 0;
    }

    .statistic-detail-item {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 10px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-height: 48px;
    }

    .statistic-detail-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, #3b82f6, #8b5cf6);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .statistic-detail-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(59, 130, 246, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .statistic-detail-item:hover::before {
        opacity: 1;
    }

    .statistic-detail-highlight {
        background: rgba(59, 130, 246, 0.08) !important;
        border-color: rgba(59, 130, 246, 0.2) !important;
    }

    .statistic-detail-highlight::before {
        opacity: 1 !important;
    }

    .statistic-detail-icon {
        font-size: 16px;
        margin-right: 8px;
        min-width: 20px;
        text-align: center;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .statistic-detail-content {
        flex: 1;
        min-width: 0;
    }

    .statistic-detail-label {
        font-size: 10px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
        margin-bottom: 2px;
        line-height: 1;
    }

    .statistic-detail-value {
        font-size: 13px;
        color: #e2e8f0;
        font-weight: 600;
        line-height: 1.2;
        word-break: break-all;
    }

    .statistic-detail-value.profit-positive {
        color: #10b981;
    }

    .statistic-detail-value.profit-negative {
        color: #ef4444;
    }

    .statistic-detail-value.highlight {
        color: #60a5fa;
    }

    .statistic-detail-value.warning {
        color: #f59e0b;
    }


    /* 下载按钮样式 - 与其他数字保持一致 */
    .statistic-download-btn {
        color:rgb(243, 243, 243) !important;
        font-weight: normal !important;
        cursor: pointer !important;
        /* 继承其他数字的基础样式 */
    }

    .statistic-download-btn:hover {
        background-color: rgba(0, 255, 0, 0.1) !important;
        border-radius: 3px !important;
        transform: scale(1.03) !important;
    }

    .statistic-download-btn.disabled {
        color: rgba(135, 135, 135, 0.73) !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
    }

    .statistic-download-btn.disabled:hover {
        background-color: transparent !important;
        transform: none !important;
    }

    /* 图片预览模态框样式 */
    .image-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        /* backdrop-filter: blur(5px); */ /* 移除性能杀手 */
    }

    .image-preview-content {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 20px;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .image-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 15px;
    }

    .image-preview-title {
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
    }

    .image-preview-close {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    }

    .image-preview-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .image-preview-img {
        max-width: 100%;
        max-height: 60vh;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .image-preview-buttons {
        display: flex;
        gap: 12px;
    }

    .image-preview-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #ffffff;
    }

    .image-preview-btn.copy-btn {
        background: #10b981; /* 简化为纯色，提升性能 */
    }

    .image-preview-btn.copy-btn:hover {
        background: #059669; /* 简化为纯色，提升性能 */
        transform: translateY(-1px);
    }

    .image-preview-btn.download-btn {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .image-preview-btn.download-btn:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-1px);
    }

    /* 现代化提示框样式 */
    .modern-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20000;
        background: rgba(0, 0, 0, 0.9);
        /* backdrop-filter: blur(10px); */ /* 移除性能杀手 */
        border-radius: 16px;
        padding: 0;
        box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 300px;
        max-width: 400px;
        /* 移除toast动画，直接显示 */
        cursor: pointer;
    }

    .modern-toast-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 19999;
        background: rgba(0, 0, 0, 0.3);
        /* backdrop-filter: blur(3px); */ /* 移除性能杀手 */
        /* animation: overlayFadeIn 0.3s ease forwards; */ /* 移除动画，提升性能 */
    }

    .modern-toast-content {
        display: flex;
        align-items: center;
        padding: 20px 24px;
        gap: 16px;
    }

    .modern-toast-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
    }

    .modern-toast-icon.success {
        background: #10b981; /* 简化为纯色，提升性能 */
        color: #ffffff;
    }

    .modern-toast-icon.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #ffffff;
    }

    .modern-toast-icon.info {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: #ffffff;
    }

    .modern-toast-text {
        flex: 1;
        color: #ffffff;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.4;
    }

    .modern-toast-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .modern-toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    /* 移除所有toast动画关键帧，提升性能 */
`;
    document.head.appendChild(style);

    // 存储拦截到的数据
    let interceptedData = null;
    // 存储首次加载的数据
    let initialStats = null;
    // 标记是否是首次加载
    let isFirstLoad = true;
    // 新增存储当前CA地址
    let currentCaAddress = null;
    // 存储首次加载的CA地址
    let initialCaAddress = null;

    // 性能优化：添加缓存机制
    let dataCache = {
        lastDataHash: null,
        calculatedStats: null,
        filteredResults: new Map(),
        eventsInitialized: false
    };

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 检查当前网络是否为SOL
    function isSolNetwork() {
        const url = window.location.href;
        return url.includes('/sol/') || url.includes('gmgn.ai/sol');
    }

    // 获取可疑地址的具体类型标识
    function getSuspiciousTypeLabels(holder) {
        const labels = [];

        // 基础可疑标记
        if (holder.is_suspicious) {
            labels.push({
                text: '可疑',
                color: '#dc2626',
                bgColor: 'rgba(220, 38, 38, 0.15)',
                borderColor: 'rgba(220, 38, 38, 0.3)'
            });
        }

        // 检查maker_token_tags
        if (holder.maker_token_tags) {
            if (holder.maker_token_tags.includes('rat_trader')) {
                labels.push({
                    text: '老鼠仓',
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                });
            }

            if (holder.transfer_in) {
                labels.push({
                    text: '小鱼钱包',
                    color: '#f87171',
                    bgColor: 'rgba(248, 113, 113, 0.15)',
                    borderColor: 'rgba(248, 113, 113, 0.3)'
                });
            }

            if (holder.maker_token_tags.includes('bundler')) {
                labels.push({
                    text: '捆绑交易',
                    color: '#b91c1c',
                    bgColor: 'rgba(185, 28, 28, 0.15)',
                    borderColor: 'rgba(185, 28, 28, 0.3)'
                });
            }
        }

        return labels;
    }

    // 生成现代化详情数据HTML
    function generateDetailItemHTML(icon, label, value, valueClass = '', isHighlight = false) {
        const highlightClass = isHighlight ? 'statistic-detail-highlight' : '';
        return `
            <div class="statistic-detail-item ${highlightClass}">
                <div class="statistic-detail-icon">${icon}</div>
                <div class="statistic-detail-content">
                    <div class="statistic-detail-label">${label}</div>
                    <div class="statistic-detail-value ${valueClass}">${value}</div>
                </div>
            </div>
        `;
    }

    // 生成可疑标识HTML
    function generateSuspiciousLabelsHTML(labels) {
        if (!labels || labels.length === 0) {
            return '';
        }

        const labelsHTML = labels.map(label => {
            const typeClass = label.text === '老鼠仓' ? 'rat-trader' :
                             label.text === '小鱼钱包' ? 'transfer-in' :
                             label.text === '捆绑交易' ? 'bundler' : '';

            return `<span class="statistic-suspicious-label ${typeClass}"
                          style="color: ${label.color};
                                 background: ${label.bgColor};
                                 border-color: ${label.borderColor};"
                          title="${label.text}标识">
                        ${label.text}
                    </span>`;
        }).join('');

        return `<div class="statistic-suspicious-labels">${labelsHTML}</div>`;
    }

    // 检查是否为交易所地址
    function isExchangeAddress(holder) {
        const exchangeNames = ['coinbase', 'binance', 'bybit', 'bitget', 'okx', 'kraken', 'coinsquare', 'crypto.com', 'robinhood', 'mexc'];

        // 检查native_transfer中的name
        if (holder.native_transfer && holder.native_transfer.name) {
            const name = holder.native_transfer.name.toLowerCase();
            if (exchangeNames.some(exchange => name.includes(exchange))) {
                return true;
            }
        }

        // 检查其他可能的transfer字段
        if (holder.transfer && holder.transfer.name) {
            const name = holder.transfer.name.toLowerCase();
            if (exchangeNames.some(exchange => name.includes(exchange))) {
                return true;
            }
        }

        return false;
    }

    // 获取交易所名称
    function getExchangeName(holder) {
        const exchangeNames = ['coinbase', 'binance', 'bybit', 'bitget', 'okx', 'kraken', 'coinsquare', 'crypto.com', 'robinhood', 'mexc'];

        let sourceName = '';
        if (holder.native_transfer && holder.native_transfer.name) {
            sourceName = holder.native_transfer.name.toLowerCase();
        } else if (holder.transfer && holder.transfer.name) {
            sourceName = holder.transfer.name.toLowerCase();
        }

        for (let exchange of exchangeNames) {
            if (sourceName.includes(exchange)) {
                return exchange.charAt(0).toUpperCase() + exchange.slice(1);
            }
        }

        return 'Unknown';
    }
    // 交易所专用弹框
    function createExchangeModal(data, caAddress) {
        // 移除已存在的弹框
        const existingModal = document.querySelector('.statistic-gmgn-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 按交易所分组数据
        const exchangeGroups = {};
        data.forEach(holder => {
            const exchangeName = getExchangeName(holder);
            if (!exchangeGroups[exchangeName]) {
                exchangeGroups[exchangeName] = [];
            }
            exchangeGroups[exchangeName].push(holder);
        });

        // 计算已卖筹码地址数
        const soldAddressCount = data.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;

        // 计算总持仓占比
        const totalHoldingPercentage = data.reduce((sum, holder) => {
            return sum + (holder.amount_percentage || 0);
        }, 0);

        // 创建弹框
        const modal = document.createElement('div');
        modal.className = 'statistic-gmgn-modal';

        // 生成交易所统计数据
        const exchangeSummary = Object.keys(exchangeGroups).map(exchange => {
            return {
                name: exchange,
                count: exchangeGroups[exchange].length,
                addresses: exchangeGroups[exchange]
            };
        }).sort((a, b) => b.count - a.count);

        modal.innerHTML = `
            <div class="statistic-gmgn-modal-content">
                <div class="statistic-gmgn-modal-header">
                    <div class="statistic-gmgn-modal-title">🚀 交易所地址分析 (共${data.length}个地址)</div>
                    <button class="statistic-gmgn-modal-close">&times;</button>
                </div>
                <div class="statistic-gmgn-analysis-summary">
                    <div class="statistic-gmgn-summary-stats">
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">已卖筹码地址数:</span>
                            <span class="statistic-gmgn-stat-value">${soldAddressCount}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">交易所数:</span>
                            <span class="statistic-gmgn-stat-value">${Object.keys(exchangeGroups).length}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总持仓占比:</span>
                            <span class="statistic-gmgn-stat-value">${(totalHoldingPercentage * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                    <button id="statistic-export-exchange-btn" class="statistic-gmgn-export-btn" title="导出Excel">导出Excel</button>
                </div>
                <div id="statistic-exchange-summary">
                    <div class="statistic-gmgn-section-title">📱 交易所统计</div>
                    <div class="statistic-exchange-summary-grid">
                        ${exchangeSummary.map(item => `
                            <div class="statistic-exchange-summary-item" data-exchange="${item.name}">
                                <span class="statistic-exchange-name">${item.name}</span>
                                <span class="statistic-exchange-count">${item.count}个地址</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div id="statistic-exchange-details"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加交易所统计样式
        if (!document.getElementById('exchange-summary-styles')) {
            const summaryStyles = document.createElement('style');
            summaryStyles.id = 'exchange-summary-styles';
            summaryStyles.textContent = `
                .statistic-exchange-summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .statistic-exchange-summary-item {
                    background-color: #475569;
                    border-radius: 8px;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                .statistic-exchange-summary-item:hover {
                    background-color: #64748b;
                    border-color: #3b82f6;
                    transform: translateY(-2px);
                }
                .statistic-exchange-summary-item.active {
                    background-color: #3b82f6;
                    border-color: #1d4ed8;
                }
                .statistic-exchange-name {
                    font-weight: 600;
                    color: #e2e8f0;
                    font-size: 14px;
                }
                .statistic-exchange-count {
                    color: #10b981;
                    font-weight: 600;
                    font-size: 13px;
                }
                .statistic-exchange-details-section {
                    margin-bottom: 20px;
                }
                .statistic-exchange-section-header {
                    background-color: #1e293b;
                    padding: 12px 16px;
                    border-radius: 8px 8px 0 0;
                    border-left: 4px solid #3b82f6;
                    margin-bottom: 0;
                }
                .statistic-exchange-section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #3b82f6;
                    margin: 0;
                }
                .statistic-exchange-section-count {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 4px;
                }
            `;
            document.head.appendChild(summaryStyles);
        }

        // 绑定交易所统计点击事件
        exchangeSummary.forEach(item => {
            const summaryItem = modal.querySelector(`[data-exchange="${item.name}"]`);
            if (summaryItem) {
                summaryItem.addEventListener('click', () => {
                    // 移除所有活跃状态
                    modal.querySelectorAll('.statistic-exchange-summary-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    // 添加当前活跃状态
                    summaryItem.classList.add('active');
                    // 显示该交易所的详细信息
                    displayExchangeDetails(item.addresses, item.name, modal);
                });
            }
        });

        // ESC键关闭处理函数
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        };
        document.addEventListener('keydown', escKeyHandler);

        // 绑定导出Excel按钮事件
        const exportBtn = modal.querySelector('#statistic-export-exchange-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportExchangeToExcel(exchangeGroups, caAddress);
            });
        }

        // 绑定关闭按钮事件
        modal.querySelector('.statistic-gmgn-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        });

        // 默认显示第一个交易所的详情
        if (exchangeSummary.length > 0) {
            const firstItem = modal.querySelector(`[data-exchange="${exchangeSummary[0].name}"]`);
            if (firstItem) {
                firstItem.click();
            }
        }
    }

    // 显示交易所详细信息
    function displayExchangeDetails(addresses, exchangeName, modal) {
        const detailsContainer = modal.querySelector('#statistic-exchange-details');

        // 创建全局排名映射 - 基于原始完整数据按持仓比例排序
        const globalRankMap = new Map();
        if (interceptedData?.data?.list) {
            const allHolders = [...interceptedData.data.list];
            allHolders
                .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0))
                .forEach((holder, index) => {
                    globalRankMap.set(holder.address, index + 1);
                });
        }

        // 按持仓比例排序
        const sortedAddresses = addresses.sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0));

        detailsContainer.innerHTML = `
            <div class="statistic-exchange-details-section">
                <div class="statistic-exchange-section-header">
                    <div class="statistic-exchange-section-title">${exchangeName} 地址详情</div>
                    <div class="statistic-exchange-section-count">共 ${sortedAddresses.length} 个地址</div>
                </div>
                ${sortedAddresses.map((holder, index) => {
                    const globalRank = globalRankMap.get(holder.address) || (index + 1);
                    const processedData = {
                        rank: index + 1,
                        rankIndex: globalRank, // 使用全局排名
                        address: holder.address,
                        balance: formatNumber(holder.balance),
                        usdValue: formatNumber(holder.usd_value),
                        netflowUsd: formatNumber(holder.netflow_usd),
                        netflowClass: (holder.netflow_usd || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        profit: formatNumber(holder.profit),
                        profitSign: holder.profit >= 0 ? '+' : '',
                        profitClass: holder.profit >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        profitChange: holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                        profitChangeClass: (holder.profit_change || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        exchangeName: getExchangeName(holder),
                        transferName: (holder.native_transfer && holder.native_transfer.name) || (holder.transfer && holder.transfer.name) || 'N/A',
                        amountPercentage: holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                        sellPercentage: holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%' // 筹码已卖
                    };

                    return `
                        <div class="statistic-gmgn-result-item">
                            <div class="statistic-gmgn-result-header">
                                <div class="statistic-gmgn-result-rank">
                                    <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${processedData.rankIndex}</span>
                                </div>
                                <div class="statistic-gmgn-result-address" title="点击复制地址" onclick="navigator.clipboard.writeText('${processedData.address}'); this.style.backgroundColor='#16a34a'; this.style.color='white'; setTimeout(() => { this.style.backgroundColor=''; this.style.color=''; }, 1000);">${processedData.address}</div>
                                <a href="https://gmgn.ai/sol/address/${processedData.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                            </div>
                            <div class="statistic-gmgn-compact-details">
                                <div class="statistic-gmgn-detail-section">
                                    <div class="statistic-gmgn-section-title">基本信息</div>
                                    <div class="statistic-detail-grid-modern">
                                        ${generateDetailItemHTML('💎', '持仓', processedData.balance)}
                                        ${generateDetailItemHTML('✨', '持仓占比', processedData.amountPercentage, 'highlight', true)}
                                        ${generateDetailItemHTML('📉', '筹码已卖', processedData.sellPercentage, processedData.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                                        ${generateDetailItemHTML('💰', '净流入', '$' + processedData.netflowUsd, processedData.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('📈', '盈亏', processedData.profitSign + '$' + processedData.profit, processedData.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('🚀', '倍数', processedData.profitChange, processedData.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('🏢', '交易所', processedData.exchangeName, 'highlight', true)}
                                        ${generateDetailItemHTML('🏷️', '标签', processedData.transferName)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // 交易所数据导出函数
    function exportExchangeToExcel(exchangeGroups, caAddress) {
        try {
            const worksheetData = [];

            // 添加标题行
            worksheetData.push(['交易所', '排名', '地址', '持仓数量', '持仓比例', '筹码已卖', 'USD价值', '净流入USD', '盈亏USD', '盈亏倍数', '标签名称']);

            // 按交易所排序添加数据
            Object.keys(exchangeGroups).forEach(exchangeName => {
                const addresses = exchangeGroups[exchangeName].sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0));
                addresses.forEach((holder, index) => {
                    const row = [
                        exchangeName,
                        index + 1,
                        holder.address,
                        formatNumber(holder.balance),
                        holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                        holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%',
                        formatNumber(holder.usd_value),
                        formatNumber(holder.netflow_usd),
                        (holder.profit >= 0 ? '+' : '') + formatNumber(holder.profit),
                        holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                        (holder.native_transfer && holder.native_transfer.name) || (holder.transfer && holder.transfer.name) || 'N/A'
                    ];
                    worksheetData.push(row);
                });
            });

            // 创建工作簿
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            // 设置列宽
            const colWidths = [
                {wch: 12},  // 交易所
                {wch: 6},   // 排名
                {wch: 45},  // 地址
                {wch: 15},  // 持仓数量
                {wch: 10},  // 持仓比例
                {wch: 10},  // 已卖比例
                {wch: 15},  // USD价值
                {wch: 15},  // 净流入
                {wch: 15},  // 盈亏
                {wch: 12},  // 倍数
                {wch: 25}   // 标签名称
            ];
            ws['!cols'] = colWidths;

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, '交易所地址');

            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `交易所地址_${caAddress ? caAddress.slice(0, 8) : 'data'}_${timestamp}.xlsx`;

            // 下载文件
            XLSX.writeFile(wb, fileName);

            // 显示成功提示
            const exportBtn = document.querySelector('#statistic-export-exchange-btn');
            if (exportBtn) {
                const originalText = exportBtn.textContent;
                exportBtn.textContent = '✅ 导出成功';
                exportBtn.style.backgroundColor = '#059669';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                }, 2000);
            }

        } catch (error) {
            console.error('Excel导出失败:', error);
            showModernToast('导出失败，请检查浏览器控制台了解详情', 'error');
        }
    }

    // 优化后的弹框管理函数 - 添加分页支持
    function createModal(title, data, caAddress, showSolBalance = false) {
        // 移除已存在的弹框
        const existingModal = document.querySelector('.statistic-gmgn-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 性能优化：数据量限制
        const ITEMS_PER_PAGE = 50;
        const isLargeDataset = data.length > ITEMS_PER_PAGE;
        let currentPage = 1;
        let totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

        // 1. 数据预处理 - 首先获取全局排名
        if (!interceptedData?.data?.list) {
            console.error('无法获取原始数据进行全局排名');
            return;
        }

        // 创建全局排名映射 - 基于原始完整数据按持仓比例排序
        const globalRankMap = new Map();
        const allHolders = [...interceptedData.data.list];
        allHolders
            .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0))
            .forEach((holder, index) => {
                globalRankMap.set(holder.address, index + 1);
            });

        // 2. 计算已卖筹码地址数
        const soldAddressCount = data.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;

        // 计算总持仓占比
        const totalHoldingPercentage = data.reduce((sum, holder) => {
            return sum + (holder.amount_percentage || 0);
        }, 0);

        // 3. 处理所有数据并排序
        const allProcessedData = data
            .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0)) // 按持仓比例排序
            .map((holder, index) => {
                const globalRank = globalRankMap.get(holder.address) || (index + 1);
                const baseData = {
                    rank: index + 1, // 在当前数据集中的排名（用于显示序号）
                    rankIndex: globalRank, // 在全局数据中的排名（用于显示"榜X"）
                    address: holder.address,
                    balance: formatNumber(holder.balance),
                    usdValue: formatNumber(holder.usd_value),
                    netflowUsd: formatNumber(holder.netflow_usd),
                    netflowClass: (holder.netflow_usd || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    profit: formatNumber(holder.profit),
                    profitSign: holder.profit >= 0 ? '+' : '',
                    profitClass: holder.profit >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    profitChange: holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                    profitChangeClass: (holder.profit_change || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    amountPercentage: holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                    sellPercentage: holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%', // 筹码已卖
                    // 添加可疑类型标识
                    suspiciousLabels: getSuspiciousTypeLabels(holder),
                    // 保留原始数据用于检测
                    originalHolder: holder
                };

                // 只有在需要显示SOL余额时才添加
                if (showSolBalance) {
                    baseData.solBalance = holder.native_balance ? ((holder.native_balance / 1000000000).toFixed(2) + ' SOL') : 'N/A';
                }

                return baseData;
            });

        // 分页处理：获取当前页数据
        function getCurrentPageData(page = 1) {
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            return allProcessedData.slice(start, end);
        }

        const processedData = getCurrentPageData(currentPage);

        // 2. 创建弹框基础结构 - 使用token_holding_temp.js的DOM结构
        const modal = document.createElement('div');
        modal.className = 'statistic-gmgn-modal';
        modal.innerHTML = `
            <div class="statistic-gmgn-modal-content">
                <div class="statistic-gmgn-modal-header">
                    <div class="statistic-gmgn-modal-title">💎 ${title} (${allProcessedData.length}个地址)</div>
                    <button class="statistic-gmgn-modal-close">&times;</button>
                </div>
                ${isLargeDataset ? `
                <div class="statistic-gmgn-pagination-info">
                    <span class="statistic-pagination-text">⚡ 性能优化：分页显示 | 第${currentPage}页，共${totalPages}页 | 每页${ITEMS_PER_PAGE}条</span>
                </div>
                ` : ''}
                <div class="statistic-gmgn-analysis-summary">
                    <div class="statistic-gmgn-summary-stats">
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">已卖筹码地址数:</span>
                            <span class="statistic-gmgn-stat-value">${soldAddressCount}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总数量:</span>
                            <span class="statistic-gmgn-stat-value">${allProcessedData.length}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总持仓占比:</span>
                            <span class="statistic-gmgn-stat-value">${(totalHoldingPercentage * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                    <button id="statistic-export-excel-btn" class="statistic-gmgn-export-btn" title="导出Excel">导出Excel</button>
                </div>
                <div id="statistic-gmgn-results-list"></div>
                ${isLargeDataset ? `
                <div class="statistic-gmgn-pagination-controls">
                    <button id="statistic-prev-page" class="statistic-pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>← 上一页</button>
                    <span class="statistic-pagination-current">第 ${currentPage} 页 / 共 ${totalPages} 页</span>
                    <button id="statistic-next-page" class="statistic-pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>下一页 →</button>
                </div>
                ` : ''}
                </div>
        `;

        // 3. 插入DOM
        document.body.appendChild(modal);

        // 4. 填充结果列表 - 参考token_holding_temp.js的方式
        const resultsList = document.getElementById('statistic-gmgn-results-list');
        processedData.forEach((holder, index) => {
            const item = document.createElement('div');
            item.className = 'statistic-gmgn-result-item';
            item.innerHTML = `
                <div class="statistic-gmgn-result-header">
                    <div class="statistic-gmgn-result-rank">
                        <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${holder.rankIndex}</span>
                    </div>
                    <div class="statistic-gmgn-result-address" title="点击复制地址">${holder.address}</div>
                    <a href="https://gmgn.ai/sol/address/${holder.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                </div>
                <div class="statistic-gmgn-compact-details">
                    <div class="statistic-gmgn-detail-section">
                        <div class="statistic-gmgn-section-title">
                            基本信息
                            ${generateSuspiciousLabelsHTML(holder.suspiciousLabels)}
                        </div>
                        <div class="statistic-detail-grid-modern">
                            ${generateDetailItemHTML('💎', '持仓', holder.balance)}
                            ${generateDetailItemHTML('✨', '持仓占比', holder.amountPercentage, 'highlight', true)}
                            ${generateDetailItemHTML('📉', '筹码已卖', holder.sellPercentage, holder.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                            ${generateDetailItemHTML('💰', '净流入', '$' + holder.netflowUsd, holder.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${generateDetailItemHTML('📈', '盈亏', holder.profitSign + '$' + holder.profit, holder.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${generateDetailItemHTML('🚀', '倍数', holder.profitChange, holder.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${holder.solBalance ? generateDetailItemHTML('⭐', 'SOL餘額', holder.solBalance, 'highlight') : ''}
                            </div>
                </div>
            </div>
        `;

            // 添加地址复制功能
            const addressElement = item.querySelector('.statistic-gmgn-result-address');
            addressElement.addEventListener('click', () => {
                navigator.clipboard.writeText(holder.address).then(() => {
                    addressElement.style.backgroundColor = '#16a34a';
                    addressElement.style.color = 'white';
                    setTimeout(() => {
                        addressElement.style.backgroundColor = '';
                        addressElement.style.color = '';
                    }, 1000);
                });
            });

            resultsList.appendChild(item);
        });

        // ESC键关闭处理函数
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        };
        document.addEventListener('keydown', escKeyHandler);

        // 5. 绑定导出Excel按钮事件 - 导出完整数据而非分页数据
        const exportBtn = modal.querySelector('#statistic-export-excel-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportToExcel(allProcessedData, title, caAddress, showSolBalance);
            });
        }

        // 6. 分页控制逻辑
        if (isLargeDataset) {
            // 渲染指定页面的数据
            function renderPage(page) {
                currentPage = page;
                const currentPageData = getCurrentPageData(page);

                // 清空当前列表
                const resultsList = document.getElementById('statistic-gmgn-results-list');
                resultsList.innerHTML = '';

                // 重新渲染当前页数据
                currentPageData.forEach((holder, index) => {
                    const item = document.createElement('div');
                    item.className = 'statistic-gmgn-result-item';
                    item.innerHTML = `
                        <div class="statistic-gmgn-result-header">
                            <div class="statistic-gmgn-result-rank">
                                <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${holder.rankIndex}</span>
                            </div>
                            <div class="statistic-gmgn-result-address" title="点击复制地址">${holder.address}</div>
                            <a href="https://gmgn.ai/sol/address/${holder.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                        </div>
                        <div class="statistic-gmgn-compact-details">
                            <div class="statistic-gmgn-detail-section">
                                <div class="statistic-gmgn-section-title">
                                    基本信息
                                    ${generateSuspiciousLabelsHTML(holder.suspiciousLabels)}
                                </div>
                                <div class="statistic-detail-grid-modern">
                                    ${generateDetailItemHTML('💎', '持仓', holder.balance)}
                                    ${generateDetailItemHTML('✨', '持仓占比', holder.amountPercentage, 'highlight', true)}
                                    ${generateDetailItemHTML('📉', '筹码已卖', holder.sellPercentage, holder.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                                    ${generateDetailItemHTML('💰', '净流入', '$' + holder.netflowUsd, holder.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${generateDetailItemHTML('📈', '盈亏', holder.profitSign + '$' + holder.profit, holder.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${generateDetailItemHTML('🚀', '倍数', holder.profitChange, holder.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${holder.solBalance ? generateDetailItemHTML('⭐', 'SOL餘額', holder.solBalance, 'highlight') : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // 添加地址复制功能
                    const addressElement = item.querySelector('.statistic-gmgn-result-address');
                    addressElement.addEventListener('click', () => {
                        navigator.clipboard.writeText(holder.address).then(() => {
                            addressElement.style.backgroundColor = '#16a34a';
                            addressElement.style.color = 'white';
                            setTimeout(() => {
                                addressElement.style.backgroundColor = '';
                                addressElement.style.color = '';
                            }, 1000);
                        });
                    });

                    resultsList.appendChild(item);
                });

                // 更新分页按钮状态
                const prevBtn = modal.querySelector('#statistic-prev-page');
                const nextBtn = modal.querySelector('#statistic-next-page');
                const currentSpan = modal.querySelector('.statistic-pagination-current');

                if (prevBtn) {
                    prevBtn.disabled = (page === 1);
                }
                if (nextBtn) {
                    nextBtn.disabled = (page === totalPages);
                }
                if (currentSpan) {
                    currentSpan.textContent = `第 ${page} 页 / 共 ${totalPages} 页`;
                }
            }

            // 绑定分页按钮事件
            const prevBtn = modal.querySelector('#statistic-prev-page');
            const nextBtn = modal.querySelector('#statistic-next-page');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentPage > 1) {
                        renderPage(currentPage - 1);
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        renderPage(currentPage + 1);
                    }
                });
            }
        }

        // 7. 绑定关闭按钮事件
        modal.querySelector('.statistic-gmgn-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        });
    }





    // 数字格式化函数
    function formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';

        // 處理負數：保留負號，對絕對值進行格式化
        const isNegative = num < 0;
        const absNum = Math.abs(num);

        let formatted;
        if (absNum >= 1000000000) {
            formatted = (absNum / 1000000000).toFixed(2) + 'B';
        } else if (absNum >= 1000000) {
            formatted = (absNum / 1000000).toFixed(2) + 'M';
        } else if (absNum >= 1000) {
            formatted = (absNum / 1000).toFixed(2) + 'K';
        } else {
            formatted = absNum.toFixed(2);
        }

        return isNegative ? '-' + formatted : formatted;
    }

    // Excel导出功能
    function exportToExcel(data, title, caAddress, showSolBalance) {
        try {
            // 创建工作表数据
            const worksheetData = [];

            // 添加标题行
            const headers = ['排名', '地址', '持仓数量', '持仓占比', '筹码已卖', 'USD价值', '净流入USD', '盈亏USD', '盈亏倍数'];
            if (showSolBalance) {
                headers.push('SOL餘額');
            }
            worksheetData.push(headers);

            // 添加数据行
            data.forEach((holder, index) => {
                const row = [
                    holder.rank,
                    holder.address,
                    holder.balance,
                    holder.amountPercentage,
                    holder.sellPercentage,
                    holder.usdValue,
                    holder.netflowUsd,
                    (holder.profitSign || '') + holder.profit,
                    holder.profitChange
                ];

                if (showSolBalance) {
                    row.push(holder.solBalance || 'N/A');
                }

                worksheetData.push(row);
            });

            // 创建工作簿
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            // 设置列宽
            const colWidths = [
                {wch: 6},   // 排名
                {wch: 45},  // 地址
                {wch: 15},  // 持仓数量
                {wch: 10},  // 持仓比例
                {wch: 10},  // 已卖比例
                {wch: 15},  // USD价值
                {wch: 15},  // 净流入
                {wch: 15},  // 盈亏
                {wch: 12}   // 倍数
            ];
            if (showSolBalance) {
                colWidths.push({wch: 12}); // SOL餘額
            }
            ws['!cols'] = colWidths;

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, title);

            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `${title}_${caAddress ? caAddress.slice(0, 8) : 'data'}_${timestamp}.xlsx`;

            // 下载文件
            XLSX.writeFile(wb, fileName);

            // 显示成功提示
            const exportBtn = document.querySelector('#statistic-export-excel-btn');
            if (exportBtn) {
                const originalText = exportBtn.textContent;
                exportBtn.textContent = '✅ 导出成功';
                exportBtn.style.backgroundColor = '#059669';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                }, 2000);
            }

        } catch (error) {
            console.error('Excel导出失败:', error);
            showModernToast('导出失败，请检查浏览器控制台了解详情', 'error');
        }
    }

    // 根据类型获取对应的地址数据（优化版本）
    function getAddressByType(type) {
        if (!interceptedData?.data?.list) return [];

        // 检查缓存
        const currentHash = getDataHash(interceptedData);
        const cacheKey = `${type}_${currentHash}`;
        if (dataCache.filteredResults.has(cacheKey)) {
            console.log('[性能优化] 使用缓存的过滤结果:', type);
            return dataCache.filteredResults.get(cacheKey);
        }

        console.log('[性能优化] 重新过滤数据:', type);
        const currentTime = Math.floor(Date.now() / 1000);
        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        const holders = interceptedData.data.list;

        let result;
        switch(type) {
            case 'fullPosition':
                result = holders.filter(h =>
                    h.sell_amount_percentage === 0 &&
                    (!h.token_transfer_out || !h.token_transfer_out.address)
                );
                break;
            case 'profitable':
                result = holders.filter(h => h.profit > 0);
                break;
            case 'losing':
                result = holders.filter(h => h.profit < 0);
                break;
            case 'active24h':
                result = holders.filter(h => h.last_active_timestamp > currentTime - 86400);
                break;
            case 'diamondHands':
                result = holders.filter(h => h.maker_token_tags?.includes('diamond_hands'));
                break;
            case 'newAddress':
                result = holders.filter(h => h.tags?.includes('fresh_wallet'));
                break;
            case 'holdingLessThan7Days':
                result = holders.filter(h =>
                    h.start_holding_at &&
                    (currentTime - h.start_holding_at) < sevenDaysInSeconds
                );
                break;
            case 'highProfit':
                result = holders.filter(h => h.profit_change > 5);
                break;
            case 'suspicious':
                result = holders.filter(h =>
                    h.is_suspicious ||
                    h.transfer_in ||
                    (h.maker_token_tags && (
                        h.maker_token_tags.includes('rat_trader') ||
                        h.maker_token_tags.includes('bundler')
                    ))
                );
                break;
            case 'lowSolBalance':
                result = holders.filter(h =>
                    h.native_balance && (h.native_balance / 1000000000) < 1
                );
                break;
            case 'tokenTransferIn':
                result = holders.filter(h =>
                    h.token_transfer_in && h.token_transfer_in.address && h.token_transfer_in.address.trim() !== ''
                );
                break;
            case 'exchangeAddresses':
                result = holders.filter(h => isExchangeAddress(h));
                break;
            default:
                result = [];
        }

        // 缓存结果
        dataCache.filteredResults.set(cacheKey, result);
        console.log('[性能优化] 过滤结果已缓存:', type, 'count:', result.length);

        return result;
    }

    // 获取类型对应的中文标题
    function getTypeTitle(type) {
        const titles = {
            'fullPosition': '满仓地址',
            'profitable': '盈利地址',
            'losing': '亏损地址',
            'active24h': '24小时活跃地址',
            'diamondHands': '钻石手地址',
            'newAddress': '新地址',
            'holdingLessThan7Days': '持仓小于7天的地址',
            'highProfit': '5倍以上盈利地址',
            'suspicious': '可疑地址',
            'lowSolBalance': 'SOL餘額不足1的地址',
            'tokenTransferIn': '代币转入地址',
            'exchangeAddresses': '交易所地址'
        };
        return titles[type] || '未知类型';
    }

    // 1. 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (isTargetApi(url)) {
            console.log('[拦截] fetch 请求:', url);
            return originalFetch.apply(this, arguments)
                .then(response => {
                if (response.ok) {
                    processResponse(response.clone());
                }
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // 2. 拦截 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            if (isTargetApi(url)) {
                console.log('[拦截] XHR 请求:', url);
                const originalOnload = xhr.onload;
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        processResponse(xhr.responseText);
                    }
                    originalOnload?.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };

    function isTargetApi(url) {
        if (typeof url !== 'string') return false;

        // 检查是否是token_holders API且包含limit参数
        const isTokenHoldersApi = /vas\/api\/v1\/token_holders\/(sol|eth|base|bsc|tron)(\/|$|\?)/i.test(url);
        const hasLimitParam = /[?&]limit=/i.test(url);

        const isTarget = isTokenHoldersApi && hasLimitParam;

        if (isTarget) {
            // 从URL中提取CA地址
            const match = url.match(/vas\/api\/v1\/token_holders\/sol\/([^/?]+)/i);
            console.log('匹配的ca：',match)
            console.log('包含limit参数的URL：', url)
            if (match && match[1]) {
                currentCaAddress = match[1];
            }
        }
        return isTarget;
    }

    function processResponseInternal(response) {
        console.log('开始处理响应数据');

        try {
            const dataPromise = typeof response === 'string' ?
                  Promise.resolve(JSON.parse(response)) :
            response.json();

            dataPromise.then(data => {
                interceptedData = data;
                console.log('[成功] 拦截到数据量:', data.data?.list?.length);
                console.log('[成功] 拦截到数据:',data);

                const currentStats = calculateStats();
                if (isFirstLoad) {
                    // 首次加载，记录初始数据和CA地址
                    initialStats = currentStats;
                    initialCaAddress = currentCaAddress;
                    isFirstLoad = false;
                    updateStatsDisplay(currentStats, true);
                } else {
                    // 非首次加载，比较CA地址
                    const isSameCa = currentCaAddress === initialCaAddress;
                    updateStatsDisplay(currentStats, !isSameCa);

                    // 如果CA地址不同，更新初始数据为当前数据，并重置下载按钮状态
                    if (!isSameCa) {
                        initialStats = currentStats;
                        initialCaAddress = currentCaAddress;

                        // 重置下载按钮状态
                        resetDownloadButtonState();
                        console.log('检测到CA地址变更，已重置下载按钮状态');
                    }
                }
            }).catch(e => console.error('解析失败:', e));
        } catch (e) {
            console.error('处理响应错误:', e);
        }
    }

    // 防抖版本的processResponse
    const processResponse = debounce(processResponseInternal, 100);

    // 计算数据哈希值用于缓存
    function getDataHash(data) {
        return JSON.stringify({
            length: data?.data?.list?.length || 0,
            timestamp: data?.data?.list?.[0]?.last_active_timestamp || 0,
            caAddress: currentCaAddress
        });
    }

    // 3. 计算所有统计指标（优化版本）
    function calculateStats() {
        if (!interceptedData?.data?.list) return null;

        // 检查缓存
        const currentHash = getDataHash(interceptedData);
        if (dataCache.lastDataHash === currentHash && dataCache.calculatedStats) {
            console.log('[性能优化] 使用缓存的统计数据');
            return dataCache.calculatedStats;
        }

        console.log('[性能优化] 重新计算统计数据');
        const currentTime = Math.floor(Date.now() / 1000);
        const sevenDaysInSeconds = 7 * 24 * 60 * 60; // 7天的秒数
        const holders = interceptedData.data.list;
        const stats = {
            fullPosition: 0,    // 全仓
            profitable: 0,      // 盈利
            losing: 0,         // 亏损
            active24h: 0,      // 24h活跃
            diamondHands: 0,   // 钻石手
            newAddress: 0,     // 新地址
            highProfit: 0,     // 10x盈利
            suspicious: 0,     // 新增：可疑地址
            holdingLessThan7Days: 0, // 新增：持仓小于7天
            lowSolBalance: 0,   // 新增：SOL餘額小於1的地址
            tokenTransferIn: 0, // 新增：代币转入地址数
            exchangeAddresses: 0 // 新增：交易所地址数
        };

        holders.forEach(holder => {
                // 满判断条件：1.没有卖出；2.没有出货地址
            if (holder.sell_amount_percentage === 0 &&
                (!holder.token_transfer_out || !holder.token_transfer_out.address)) {
                stats.fullPosition++;
            }
            if (holder.profit > 0) stats.profitable++;
            if (holder.profit < 0) stats.losing++;
            if (holder.last_active_timestamp > currentTime - 86400) stats.active24h++;
            if (holder.maker_token_tags?.includes('diamond_hands')) stats.diamondHands++;
            if (holder.tags?.includes('fresh_wallet')) stats.newAddress++;
            if (holder.profit_change > 5) stats.highProfit++;
            // 增强版可疑地址检测
            if (
                holder.is_suspicious ||
                holder.transfer_in ||
                (holder.maker_token_tags && (
                    holder.maker_token_tags.includes('rat_trader') ||
                    holder.maker_token_tags.includes('bundler')
                ))
            ) {
                stats.suspicious++;
            }
            // 新增7天持仓统计
            if (holder.start_holding_at &&
                (currentTime - holder.start_holding_at) < sevenDaysInSeconds) {
                stats.holdingLessThan7Days++;
            }
            // 新增低SOL餘額統計（小於1 SOL）
            if (holder.native_balance && (holder.native_balance / 1000000000) < 1) {
                stats.lowSolBalance++;
            }
            // 新增代币转入地址统计
            if (holder.token_transfer_in && holder.token_transfer_in.address && holder.token_transfer_in.address.trim() !== '') {
                stats.tokenTransferIn++;
            }
            // 新增交易所地址统计
            if (isExchangeAddress(holder)) {
                stats.exchangeAddresses++;
            }
        });

        // 缓存计算结果
        dataCache.lastDataHash = currentHash;
        dataCache.calculatedStats = stats;
        dataCache.filteredResults.clear(); // 清空过滤缓存
        console.log('[性能优化] 统计数据已缓存');

        return stats;
    }

    // 1. 持久化容器监听
    const observer = new MutationObserver(() => {
        const targetContainer = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden.scroll-smooth.w-full');
        if (targetContainer && !targetContainer.querySelector('#statistic-gmgn-stats-item')) {
            injectStatsItem(targetContainer);
        }
    });

    function injectStatsItem(container) {
        if (container.querySelector('#statistic-gmgn-stats-item')) return;

        const isSol = isSolNetwork();
        const statsItem = document.createElement('div');
        statsItem.id = 'statistic-gmgn-stats-item';
        statsItem.className = 'statistic-gmgn-stats-container';

        const headerClass = isSol ? 'statistic-gmgn-stats-header sol-network' : 'statistic-gmgn-stats-header';
        const dataClass = isSol ? 'statistic-gmgn-stats-data sol-network' : 'statistic-gmgn-stats-data';

        statsItem.innerHTML = `
        <div class="${headerClass}">
    <span title="持有代币且未卖出任何数量的地址（排除转移代币卖出的地址）">满仓</span>
    <span title="当前持仓价值高于买入成本的地址">盈利</span>
    <span title="当前持仓价值低于买入成本的地址">亏损</span>
    <span title="过去24小时内有交易活动的地址">活跃</span>
    <span title="长期持有且很少卖出的地址">钻石</span>
    <span title="新钱包">新址</span>
    <span title="持仓时间小于7天的地址">7天</span>
    <span title="盈利超过5倍的地址">5X</span>
    <span title="标记为可疑或异常行为的地址">可疑</span>
    <span title="有代币转入记录的地址">转入</span>
    <span title="与交易所相关的地址">交易所</span>
    ${isSol ? '<span title="SOL餘額小於1的地址">低SOL</span>' : ''}
    <span title="下载统计数据图片">图片</span>
        </div>
        <div class="${dataClass}">
            <span id="fullPosition">-</span>
            <span id="profitable">-</span>
            <span id="losing">-</span>
            <span id="active24h">-</span>
            <span id="diamondHands">-</span>
            <span id="newAddress">-</span>
            <span id="holdingLessThan7Days">-</span>
            <span id="highProfit">-</span>
            <span id="suspicious">-</span>
            <span id="tokenTransferIn">-</span>
            <span id="exchangeAddresses">-</span>
            ${isSol ? '<span id="lowSolBalance">-</span>' : ''}
            <span id="statistic-download-image-btn" class="statistic-download-btn clickable" title="下载统计数据图片">下载</span>
        </div>
    `;
        container.insertAdjacentElement('afterbegin', statsItem);
    }

    function updateStatsDisplayInternal(currentStats, forceNoArrows) {
        if (!currentStats) return;

        // 确保DOM已存在
        if (!document.getElementById('statistic-gmgn-stats-item')) {
            injectStatsItem();
        }

        // 优化的事件监听器绑定（只绑定一次）
        if (!dataCache.eventsInitialized) {
            console.log('[性能优化] 初始化事件监听器');
            const baseClickableTypes = ['fullPosition', 'profitable', 'losing', 'active24h', 'diamondHands', 'newAddress', 'holdingLessThan7Days', 'highProfit', 'suspicious', 'tokenTransferIn', 'exchangeAddresses'];
            const clickableTypes = isSolNetwork() ? [...baseClickableTypes, 'lowSolBalance'] : baseClickableTypes;

            clickableTypes.forEach(id => {
                const element = document.getElementById(id);
                if (element && !element.hasAttribute('data-event-bound')) {
                    element.classList.add('clickable');
                    element.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const addresses = getAddressByType(id);

                        // 交易所地址使用专用弹框
                        if (id === 'exchangeAddresses') {
                            createExchangeModal(addresses, currentCaAddress);
                        } else {
                            const title = getTypeTitle(id);
                            const showSolBalance = id === 'lowSolBalance';
                            createModal(title, addresses, currentCaAddress, showSolBalance);
                        }
                    };
                    element.setAttribute('data-event-bound', 'true');
                    console.log('[性能优化] 事件监听器已绑定:', id);
                }
            });
            dataCache.eventsInitialized = true;
        }

        const updateStatElement = (id, value, hasChanged, isIncrease) => {
            const element = document.getElementById(id);
            if (!element) return;

            element.innerHTML = `<strong style="color: ${id === 'profitable' ? '#2E8B57' :
            (id === 'losing' || id === 'suspicious' ? '#FF1493' :
             id === 'holdingLessThan7Days' ? '#00E5EE' :
             id === 'lowSolBalance' ? '#FFA500' : '#e9ecef')}">${value}</strong>`;

            // 只有当不是强制不显示箭头且确实有变化时才显示箭头
            if (!forceNoArrows && hasChanged) {
                const arrow = document.createElement('span');
                arrow.className = isIncrease ? 'statistic-up-arrow' : 'statistic-down-arrow';
                arrow.textContent = isIncrease ? '▲' : '▼';

                // 移除旧的箭头（如果有）
                const oldArrow = element.querySelector('.statistic-up-arrow, .statistic-down-arrow');
                if (oldArrow) oldArrow.remove();

                element.appendChild(arrow);
            } else {
                // 没有变化或强制不显示箭头，移除箭头（如果有）
                const oldArrow = element.querySelector('.statistic-up-arrow, .statistic-down-arrow');
                if (oldArrow) oldArrow.remove();
            }

            // 事件监听器已在初始化时绑定，无需重复绑定
        };

        // 绑定下载图片按钮事件
        const downloadBtn = document.getElementById('statistic-download-image-btn');
        if (downloadBtn && !downloadBtn.hasAttribute('data-event-bound')) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 检查是否正在处理中
                if (isDownloadInProgress) {
                    console.log('下载正在进行中，请稍候...');
                    return;
                }

                handleDownloadImage();
            });
            downloadBtn.setAttribute('data-event-bound', 'true');
        }
        // 更新各个统计指标
            // 新增7天持仓统计更新
        updateStatElement('holdingLessThan7Days', currentStats.holdingLessThan7Days,
                          initialStats && currentStats.holdingLessThan7Days !== initialStats.holdingLessThan7Days,
                          initialStats && currentStats.holdingLessThan7Days > initialStats.holdingLessThan7Days);

        updateStatElement('fullPosition', currentStats.fullPosition,
                          initialStats && currentStats.fullPosition !== initialStats.fullPosition,
                          initialStats && currentStats.fullPosition > initialStats.fullPosition);

        updateStatElement('profitable', currentStats.profitable,
                          initialStats && currentStats.profitable !== initialStats.profitable,
                          initialStats && currentStats.profitable > initialStats.profitable);
        updateStatElement('losing', currentStats.losing,
                          currentStats.losing !== initialStats.losing,
                          currentStats.losing > initialStats.losing);

        updateStatElement('active24h', currentStats.active24h,
                          currentStats.active24h !== initialStats.active24h,
                          currentStats.active24h > initialStats.active24h);

        updateStatElement('diamondHands', currentStats.diamondHands,
                          currentStats.diamondHands !== initialStats.diamondHands,
                          currentStats.diamondHands > initialStats.diamondHands);

        updateStatElement('newAddress', currentStats.newAddress,
                          currentStats.newAddress !== initialStats.newAddress,
                          currentStats.newAddress > initialStats.newAddress);

        updateStatElement('highProfit', currentStats.highProfit,
                          currentStats.highProfit !== initialStats.highProfit,
                          currentStats.highProfit > initialStats.highProfit);

        updateStatElement('suspicious', currentStats.suspicious,
                          currentStats.suspicious !== initialStats.suspicious,
                          currentStats.suspicious > initialStats.suspicious);

        updateStatElement('tokenTransferIn', currentStats.tokenTransferIn,
                          initialStats && currentStats.tokenTransferIn !== initialStats.tokenTransferIn,
                          initialStats && currentStats.tokenTransferIn > initialStats.tokenTransferIn);

        updateStatElement('exchangeAddresses', currentStats.exchangeAddresses,
                          initialStats && currentStats.exchangeAddresses !== initialStats.exchangeAddresses,
                          initialStats && currentStats.exchangeAddresses > initialStats.exchangeAddresses);

        // 只在SOL网络时更新低SOL余额统计
        if (isSolNetwork()) {
            updateStatElement('lowSolBalance', currentStats.lowSolBalance,
                              initialStats && currentStats.lowSolBalance !== initialStats.lowSolBalance,
                              initialStats && currentStats.lowSolBalance > initialStats.lowSolBalance);
        }
    }

    // 防抖版本的updateStatsDisplay
    const updateStatsDisplay = debounce(updateStatsDisplayInternal, 200);

    // 数据收集函数 - 收集基础统计数据和详细持有者信息
    function collectStatsData() {
        if (!interceptedData?.data?.list || !currentCaAddress) {
            console.error('数据不完整，无法生成图片');
            return null;
        }

        const currentStats = calculateStats();
        if (!currentStats) {
            console.error('无法计算统计数据');
            return null;
        }

        // 基础统计数据
        const basicStats = {
            fullPosition: { label: '满仓', value: currentStats.fullPosition, type: 'fullPosition' },
            profitable: { label: '盈利', value: currentStats.profitable, type: 'profitable' },
            losing: { label: '亏损', value: currentStats.losing, type: 'losing' },
            active24h: { label: '活跃', value: currentStats.active24h, type: 'active24h' },
            diamondHands: { label: '钻石', value: currentStats.diamondHands, type: 'diamondHands' },
            newAddress: { label: '新址', value: currentStats.newAddress, type: 'newAddress' },
            holdingLessThan7Days: { label: '7天', value: currentStats.holdingLessThan7Days, type: 'holdingLessThan7Days' },
            highProfit: { label: '5X', value: currentStats.highProfit, type: 'highProfit' },
            suspicious: { label: '可疑', value: currentStats.suspicious, type: 'suspicious' },
            tokenTransferIn: { label: '转入', value: currentStats.tokenTransferIn, type: 'tokenTransferIn' },
            exchangeAddresses: { label: '交易所', value: currentStats.exchangeAddresses, type: 'exchangeAddresses' }
        };

        // 如果是SOL网络，添加低余额统计
        if (isSolNetwork()) {
            basicStats.lowSolBalance = { label: '低SOL', value: currentStats.lowSolBalance, type: 'lowSolBalance' };
        }

        // 收集每个统计类型的汇总数据（包括值为0的项目）
        const detailedData = {};
        for (const [key, stat] of Object.entries(basicStats)) {
            const addresses = getAddressByType(stat.type);
            if (addresses && addresses.length > 0) {
                // 计算汇总信息
                const soldChipsCount = addresses.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;
                const totalHoldingPercentage = addresses.reduce((sum, holder) => sum + (holder.amount_percentage || 0), 0);

                detailedData[key] = {
                    label: stat.label,
                    totalCount: addresses.length,
                    soldChipsCount: soldChipsCount,
                    totalHoldingPercentage: (totalHoldingPercentage * 100).toFixed(2) + '%'
                };
            } else {
                // 即使没有地址数据，也创建空的详细数据
                detailedData[key] = {
                    label: stat.label,
                    totalCount: 0,
                    soldChipsCount: 0,
                    totalHoldingPercentage: '0.00%'
                };
            }
        }

        return {
            caAddress: currentCaAddress,
            timestamp: new Date(),
            basicStats: basicStats,
            detailedData: detailedData
        };
    }

    // 绘制圆角矩形辅助函数
    function drawRoundedRect(ctx, x, y, width, height, radius, strokeColor = null, strokeWidth = 0, fillOnly = false) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();

        if (!fillOnly) {
            ctx.fill();
        }

        if (strokeColor && strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
    }

    // 图片生成函数 - 现代化风格
    function generateStatsImage(data) {
        if (!data) {
            console.error('无数据可生成图片');
            return null;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸 - 现代化尺寸
        canvas.width = 1200;
        canvas.height = 1400; // 增加高度以适应现代化布局

        // 创建现代渐变背景
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#0f172a');
        bgGradient.addColorStop(0.3, '#1e293b');
        bgGradient.addColorStop(0.7, '#334155');
        bgGradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制现代化圆角边框
        const borderRadius = 20;
        const borderPadding = 30;
        drawRoundedRect(ctx, borderPadding, borderPadding,
                       canvas.width - borderPadding * 2, canvas.height - borderPadding * 2,
                       borderRadius, '#3b82f6', 3);

        // 绘制标题区域背景
        const titleBg = ctx.createLinearGradient(0, 50, 0, 150);
        titleBg.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        titleBg.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
        ctx.fillStyle = titleBg;
        drawRoundedRect(ctx, 60, 60, canvas.width - 120, 120, 15);

        // 绘制现代化标题
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        const title = 'GMGN 前排统计分析';
        ctx.fillText(title, canvas.width / 2, 110);

        // 清除阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 绘制CA地址和时间 - 现代化样式
        ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#22d3ee';
        const formatTime = data.timestamp.getFullYear() +
            '-' + String(data.timestamp.getMonth() + 1).padStart(2, '0') +
            '-' + String(data.timestamp.getDate()).padStart(2, '0') +
            ' ' + String(data.timestamp.getHours()).padStart(2, '0') +
            ':' + String(data.timestamp.getMinutes()).padStart(2, '0') +
            ':' + String(data.timestamp.getSeconds()).padStart(2, '0');
        ctx.fillText(`CA: ${data.caAddress}`, canvas.width / 2, 140);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`时间: ${formatTime}`, canvas.width / 2, 165);

        // 绘制基础统计数据（第一层）- 现代化风格
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('基础统计数据', 80, 220);

        let yPos = 260;
        const statsPerRow = 3; // 每行3个
        const statWidth = 350; // 增加宽度适应现代化布局
        const statHeight = 90; // 增加高度
        let currentRow = 0;
        let currentCol = 0;
        const baseX = 80; // 左侧边距

        for (const [key, stat] of Object.entries(data.basicStats)) {
            const x = baseX + currentCol * statWidth;
            const y = yPos + currentRow * statHeight;

            // 绘制现代化卡片背景渐变
            const cardGradient = ctx.createLinearGradient(x, y, x, y + statHeight - 15);
            cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            cardGradient.addColorStop(1, 'rgba(59, 130, 246, 0.12)');
            ctx.fillStyle = cardGradient;
            drawRoundedRect(ctx, x, y, statWidth - 30, statHeight - 15, 12);

            // 绘制现代化边框
            drawRoundedRect(ctx, x, y, statWidth - 30, statHeight - 15, 12, '#3b82f6', 2, true);

            // 绘制标签 - 现代化字体
            ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, x + 20, y + 30);

            // 绘制数值 - 现代化颜色和字体
            ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            const valueColor = key === 'profitable' ? '#22c55e' :
                              (key === 'losing' || key === 'suspicious' ? '#ef4444' :
                               key === 'holdingLessThan7Days' ? '#06b6d4' :
                               key === 'lowSolBalance' ? '#f59e0b' : '#22d3ee');
            ctx.fillStyle = valueColor;
            ctx.fillText(stat.value.toString(), x + 20, y + 65);

            currentCol++;
            if (currentCol >= statsPerRow) {
                currentCol = 0;
                currentRow++;
            }
        }

        // 绘制详细数据（第二层）- 现代化风格
        yPos = 180 + (Math.ceil(Object.keys(data.basicStats).length / statsPerRow) + 1) * statHeight + 50;

        // 绘制详细分析标题
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('详细数据分析', 80, yPos);

        yPos += 40;

        // 使用现代化网格布局绘制详细数据分析
        const detailStatsPerRow = 3; // 每行3个详细数据单元格
        const detailStatWidth = 350; // 与基础统计保持一致
        const detailStatHeight = 130; // 增加高度以适应现代化布局
        let detailCurrentRow = 0;
        let detailCurrentCol = 0;

        for (const [key, detail] of Object.entries(data.detailedData)) {
            if (yPos + detailCurrentRow * detailStatHeight > canvas.height - 150) break; // 防止超出画布

            const x = baseX + detailCurrentCol * detailStatWidth; // 与基础数据对齐
            const y = yPos + detailCurrentRow * detailStatHeight;

            // 绘制现代化卡片背景渐变
            const detailCardGradient = ctx.createLinearGradient(x, y, x, y + detailStatHeight - 15);
            detailCardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
            detailCardGradient.addColorStop(1, 'rgba(16, 185, 129, 0.08)');
            ctx.fillStyle = detailCardGradient;
            drawRoundedRect(ctx, x, y, detailStatWidth - 30, detailStatHeight - 15, 12);

            // 绘制现代化边框
            drawRoundedRect(ctx, x, y, detailStatWidth - 30, detailStatHeight - 15, 12, '#10b981', 2, true);

            // 绘制分类标题 - 现代化样式
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            const titleColor = key === 'profitable' ? '#22c55e' :
                              (key === 'losing' || key === 'suspicious' ? '#ef4444' :
                               key === 'holdingLessThan7Days' ? '#06b6d4' :
                               key === 'lowSolBalance' ? '#f59e0b' : '#22d3ee');
            ctx.fillStyle = titleColor;
            ctx.textAlign = 'left';
            ctx.fillText(`${detail.label}`, x + 20, y + 30);

            // 绘制汇总数据 - 现代化样式
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

            // 已卖筹码数
            ctx.fillText('已卖筹码数:', x + 20, y + 55);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = detail.soldChipsCount > 0 ? '#ef4444' : '#22c55e';
            ctx.fillText(detail.soldChipsCount.toString(), x + 150, y + 55);

            // 总地址数
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('总地址数:', x + 20, y + 80);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = titleColor; // 使用与标题相同的颜色
            ctx.fillText(detail.totalCount.toString(), x + 150, y + 80);

            // 持仓占比
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('持仓占比:', x + 20, y + 105);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#60a5fa';
            ctx.fillText(detail.totalHoldingPercentage, x + 150, y + 105);

            detailCurrentCol++;
            if (detailCurrentCol >= detailStatsPerRow) {
                detailCurrentCol = 0;
                detailCurrentRow++;
            }
        }

        return canvas;
    }

    // 下载图片函数
    function downloadImage(canvas, filename) {
        if (!canvas) {
            console.error('无法下载图片：画布为空');
            return;
        }

        try {
            // 转换为blob
            canvas.toBlob(function(blob) {
                // 创建下载链接
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;

                // 触发下载
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 清理URL对象
                URL.revokeObjectURL(url);

                console.log('图片下载成功:', filename);
            }, 'image/png');
        } catch (error) {
            console.error('下载图片失败:', error);
        }
    }

    // 显示图片预览模态框
    function showImagePreview(canvas, filename) {
        const modal = document.createElement('div');
        modal.className = 'image-preview-modal';

        const imageUrl = canvas.toDataURL('image/png');

        modal.innerHTML = `
            <div class="image-preview-content">
                <div class="image-preview-header">
                    <div class="image-preview-title">📷 统计图片预览</div>
                    <button class="image-preview-close">&times;</button>
                </div>
                <img src="${imageUrl}" alt="统计图片" class="image-preview-img">
                <div class="image-preview-buttons">
                    <button class="image-preview-btn copy-btn">📋 复制图片</button>
                    <button class="image-preview-btn download-btn">💾 下载图片</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        const closeBtn = modal.querySelector('.image-preview-close');
        const copyBtn = modal.querySelector('.copy-btn');
        const downloadBtn = modal.querySelector('.download-btn');

        // 关闭模态框
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 复制图片
        copyBtn.addEventListener('click', () => {
            copyImageToClipboard(canvas);
        });

        // 下载图片
        downloadBtn.addEventListener('click', () => {
            downloadImageFromPreview(canvas, filename);
            closeModal();
        });

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // 复制图片到剪贴板
    async function copyImageToClipboard(canvas) {
        try {
            // 将canvas转为blob
            canvas.toBlob(async (blob) => {
                try {
                    if (navigator.clipboard && window.ClipboardItem) {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        showModernToast('图片已复制到剪贴板！', 'success');
                    } else {
                        // 兜底方案：创建临时图片元素让用户手动复制
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL('image/png');
                        img.style.position = 'fixed';
                        img.style.top = '-9999px';
                        document.body.appendChild(img);

                        // 选择图片
                        const range = document.createRange();
                        range.selectNode(img);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);

                        // 尝试复制
                        const success = document.execCommand('copy');
                        document.body.removeChild(img);
                        window.getSelection().removeAllRanges();

                        if (success) {
                            showModernToast('图片已复制到剪贴板！', 'success');
                        } else {
                            showModernToast('复制失败，请尝试手动下载图片', 'error');
                        }
                    }
                } catch (error) {
                    console.error('复制图片失败:', error);
                    showModernToast('复制失败：' + error.message, 'error');
                }
            }, 'image/png');
        } catch (error) {
            console.error('复制图片失败:', error);
            showModernToast('复制失败：' + error.message, 'error');
        }
    }

    // 从预览下载图片
    function downloadImageFromPreview(canvas, filename) {
        try {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
                showModernToast('图片下载成功！', 'success');
            }, 'image/png');
        } catch (error) {
            console.error('下载图片失败:', error);
            showModernToast('下载失败：' + error.message, 'error');
        }
    }

    // 重置按钮状态
    function resetDownloadButtonState() {
        isDownloadInProgress = false;
        const button = document.getElementById('statistic-download-image-btn');
        if (button) {
            button.classList.remove('disabled');
            button.textContent = '下载';
        }
    }

    // 设置按钮禁用状态
    function setDownloadButtonDisabled(disabled) {
        const button = document.getElementById('statistic-download-image-btn');
        if (button) {
            if (disabled) {
                button.classList.add('disabled');
                button.textContent = '生成中...';
            } else {
                button.classList.remove('disabled');
                button.textContent = '下载';
            }
        }
    }

    // 主要的下载处理函数 - 现在显示预览而不是直接下载
    function handleDownloadImage() {
        const button = document.getElementById('statistic-download-image-btn');
        if (!button) return;

        // 检查是否已在处理中
        if (isDownloadInProgress) {
            console.log('图片生成正在进行中...');
            return;
        }

        // 设置处理状态
        isDownloadInProgress = true;
        setDownloadButtonDisabled(true);

        try {
            // 收集数据
            const data = collectStatsData();
            if (!data) {
                throw new Error('无法收集数据');
            }

            // 更新当前CA地址
            currentCAAddress = data.caAddress || '';

            // 生成图片
            const canvas = generateStatsImage(data);
            if (!canvas) {
                throw new Error('无法生成图片');
            }

            // 生成文件名
            const timestamp = data.timestamp.getFullYear() +
                String(data.timestamp.getMonth() + 1).padStart(2, '0') +
                String(data.timestamp.getDate()).padStart(2, '0') +
                String(data.timestamp.getHours()).padStart(2, '0');
            const filename = `${data.caAddress}_${timestamp}.png`;

            // 显示预览而不是直接下载
            showImagePreview(canvas, filename);

        } catch (error) {
            console.error('生成图片失败:', error);
            showModernToast('生成图片失败：' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            isDownloadInProgress = false;
            setDownloadButtonDisabled(false);
        }
    }

    // 4. 初始化
    if (document.readyState === 'complete') {
        startObserving();
    } else {
        window.addEventListener('DOMContentLoaded', startObserving);
    }

    function startObserving() {
        // 立即检查一次
        const initialContainer = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden.scroll-smooth.w-full');
        if (initialContainer) injectStatsItem(initialContainer);

        // 持续监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
})();// ==UserScript==
// @name         GMGN 前排统计
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  统计GMGN任意代币前排地址的数据，让数字来说话！新增首次记录和涨跌提醒功能，所有数字可点击查看详情，弹框显示净流入数据，负数红色显示，点击外部关闭
// @match        https://gmgn.ai/*
// @match        https://www.gmgn.ai/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-start
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量 - 跟踪下载按钮状态
    let isDownloadInProgress = false;
    let currentCAAddress = '';

    // 现代化提示框函数
    function showModernToast(message, type = 'success', duration = 3000) {
        // 移除现有的提示框
        const existingToast = document.querySelector('.modern-toast');
        const existingOverlay = document.querySelector('.modern-toast-overlay');
        if (existingToast) existingToast.remove();
        if (existingOverlay) existingOverlay.remove();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modern-toast-overlay';

        // 创建提示框
        const toast = document.createElement('div');
        toast.className = 'modern-toast';

        // 根据类型设置图标
        let icon, iconClass;
        switch (type) {
            case 'success':
                icon = '✓';
                iconClass = 'success';
                break;
            case 'error':
                icon = '✕';
                iconClass = 'error';
                break;
            case 'info':
                icon = 'ℹ';
                iconClass = 'info';
                break;
            default:
                icon = '✓';
                iconClass = 'success';
        }

        toast.innerHTML = `
            <div class="modern-toast-content">
                <div class="modern-toast-icon ${iconClass}">${icon}</div>
                <div class="modern-toast-text">${message}</div>
                <button class="modern-toast-close">&times;</button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(toast);

        // 关闭函数
        const closeToast = () => {
            toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            overlay.style.animation = 'overlayFadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
                if (overlay.parentNode) overlay.remove();
            }, 300);
        };

        // 绑定关闭事件
        const closeBtn = toast.querySelector('.modern-toast-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeToast();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', closeToast);

        // 点击提示框本身也可以关闭
        toast.addEventListener('click', closeToast);

        // 自动关闭
        if (duration > 0) {
            setTimeout(closeToast, duration);
        }

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeToast();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // 返回关闭函数，允许手动关闭
        return closeToast;
    }

    // 动态添加 CSS
    const style = document.createElement('style');
    style.textContent = `
    .statistic-gmgn-stats-container {
        background-color: transparent;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        margin-right: 8px;
        margin-bottom:8px;
        border: 1px solid #333;
        /* 精细的右侧和下侧发光效果 */
        box-shadow:
            2px 2px 4px rgba(0, 119, 255, 0.6),  /* 右下外发光（更小的偏移和模糊） */
            1px 1px 2px rgba(0, 119, 255, 0.4),  /* 精细的次级发光 */
            inset 0 0 3px rgba(0, 119, 255, 0.2); /* 更细腻的内发光 */
        padding: 4px 6px;
        max-width: fit-content;
    }
    .statistic-gmgn-stats-header, .statistic-gmgn-stats-data {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        text-align: center;
        gap: 6px;
        font-weight: normal;
        font-size: 13px;
    }
    .statistic-gmgn-stats-header.sol-network, .statistic-gmgn-stats-data.sol-network {
        grid-template-columns: repeat(13, minmax(auto, 1fr));
        gap: 4px;
        font-size: 12px;
    }
    .statistic-gmgn-stats-header span {
        color: #ccc;
        font-weight: normal;
        padding: 1px 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .statistic-gmgn-stats-header.sol-network span {
        font-size: 11px;
        padding: 1px;
    }
    .statistic-gmgn-stats-data span {
        color: #00ff00;
        font-weight: normal;
        cursor: default;
        transition: all 0.2s ease;
        padding: 1px 3px;
        border-radius: 2px;
        min-width: 0;
        white-space: nowrap;
    }
    .statistic-gmgn-stats-data span.clickable {
        cursor: pointer;
    }
    .statistic-gmgn-stats-data span.clickable:hover {
        background-color: rgba(0, 255, 0, 0.1);
        border-radius: 3px;
        transform: scale(1.03);
    }
    .statistic-gmgn-stats-data.sol-network span {
        padding: 1px 2px;
        font-size: 12px;
    }
    .statistic-gmgn-stats-data span .statistic-up-arrow,
    .statistic-up-arrow {
        color: green !important;
        margin-left: 2px;
        font-weight: bold;
    }
    .statistic-gmgn-stats-data span .statistic-down-arrow,
    .statistic-down-arrow {
        color: red !important;
        margin-left: 2px;
        font-weight: bold;
    }




    /* 完整弹框CSS样式 - 现代化设计 */
    .statistic-gmgn-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6); /* 简化为纯色，提升性能 */
                /* backdrop-filter: blur(8px); */ /* 移除性能杀手 */
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                /* animation: modalFadeIn 0.3s ease-out; */ /* 移除动画，提升性能 */
    }
    .statistic-gmgn-modal-content {
        background: #1e293b !important; /* 简化为纯色，提升性能 */
        border-radius: 16px !important;
        width: 85% !important;
        max-width: 900px !important;
        max-height: 85vh !important;
        overflow-y: auto !important;
        padding: 24px !important;
        color: white !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(0.95) !important;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1) !important;
        margin: 0 !important;
        z-index: 100000 !important;
        box-sizing: border-box !important;
        min-height: auto !important;
        min-width: 320px !important;
        pointer-events: auto !important;
        /* 移除动画，直接显示 */
        backface-visibility: hidden !important;
        contain: layout style paint !important;
        /* 优化滚动性能 */
        overflow-anchor: none !important;
        scroll-behavior: smooth !important;
        -webkit-overflow-scrolling: touch !important;
    }
    .statistic-gmgn-modal-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 24px !important;
        padding: 16px 20px !important;
        margin: -24px -24px 24px -24px !important;
        background: rgba(99, 102, 241, 0.1) !important; /* 简化为纯色，提升性能 */
        border-radius: 16px 16px 0 0 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        /* backdrop-filter: blur(10px) !important; */ /* 移除性能杀手 */
    }
    .statistic-gmgn-modal-title {
        font-size: 20px !important;
        font-weight: 700 !important;
        color: white !important;
        margin: 0 !important;
        color: #ffffff !important; /* 简化文本渐变为纯色，提升性能 */
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
    }
    .statistic-gmgn-modal-close {
        background: rgba(148, 163, 184, 0.1) !important;
        border: 1px solid rgba(148, 163, 184, 0.2) !important;
        color: #94a3b8 !important;
        font-size: 18px !important;
        cursor: pointer !important;
        padding: 8px !important;
        line-height: 1 !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background-color 0.2s ease !important; /* 简化过渡，提升性能 */
    }
    .statistic-gmgn-modal-close:hover {
        color: #fff !important;
        background: #ef4444 !important; /* 简化为纯色，提升性能 */
        border-color: #ef4444 !important;
        /* transform: scale(1.1) !important; */ /* 移除复杂变换，提升性能 */
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
    }
    .statistic-gmgn-result-item {
        background: rgba(51, 65, 85, 0.6); /* 简化为纯色，提升性能 */
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        position: relative;
        overflow: hidden;
        /* 性能优化 - 硬件加速 */
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
        contain: layout style;
        /* 减少backdrop-filter在大数据量时的性能消耗 */
    }
    .statistic-gmgn-result-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translateZ(0);
    }
    .statistic-gmgn-result-item:hover {
        background: rgba(51, 65, 85, 0.8); /* 简化为纯色，提升性能 */
        transform: translateY(-2px) translateZ(0);
        box-shadow:
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-result-item:hover::before {
        opacity: 1;
    }
    .statistic-gmgn-analysis-summary {
        margin-bottom: 24px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(38, 50, 56, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%);
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        /* backdrop-filter: blur(10px); */ /* 移除性能杀手 */
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    .statistic-gmgn-summary-stats {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
    }
    .statistic-gmgn-stat-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        min-width: 80px;
    }
    .statistic-gmgn-stat-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-stat-label {
        color: #94a3b8;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .statistic-gmgn-stat-value {
        font-weight: 700;
        font-size: 18px;
        background: #3b82f6; /* 简化为纯色，提升性能 */
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    .statistic-gmgn-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        gap: 8px;
    }
    .statistic-gmgn-result-rank {
        font-size: 14px;
        color: #94a3b8;
        font-weight: 600;
        min-width: 30px;
    }
    .statistic-gmgn-result-address {
        font-weight: 600;
        word-break: break-all;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        background: linear-gradient(135deg, rgba(71, 85, 105, 0.6), rgba(51, 65, 85, 0.8));
        border: 1px solid rgba(0, 255, 136, 0.3);
        flex: 1;
        min-width: 200px;
        color: #00ff88;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        position: relative;
        overflow: hidden;
    }
    .statistic-gmgn-result-address::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
        transition: left 0.5s ease;
    }
    .statistic-gmgn-result-address:hover {
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(51, 65, 85, 0.9));
        border-color: #00ff88;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
    }
    .statistic-gmgn-result-address:hover::before {
        left: 100%;
    }
    .statistic-gmgn-detail-section {
        margin-bottom: 12px;
    }
    .statistic-gmgn-section-title {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .statistic-gmgn-detail-grid {
        display: grid;
        grid-template-columns: 80px 1fr 80px 1fr;
        gap: 4px 8px;
        align-items: start;
        font-size: 12px;
    }
    .statistic-gmgn-detail-label {
        color: #94a3b8;
        font-size: 12px;
        padding: 2px 0;
        align-self: start;
    }
    .statistic-gmgn-detail-value {
        font-size: 12px;
        color: #e2e8f0;
        padding: 2px 0;
        word-break: break-word;
        line-height: 1.4;
    }
    .statistic-gmgn-value-highlight {
        color: #3b82f6;
        font-weight: 600;
    }
    .statistic-gmgn-compact-details .statistic-gmgn-detail-section {
        margin-bottom: 8px;
    }
    .statistic-gmgn-compact-details .statistic-gmgn-detail-section {
        margin-left: 10px;
    }
    .statistic-gmgn-address-jump-btn {
        background: #10b981; /* 简化为纯色，提升性能 */
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease; /* 简化过渡，提升性能 */
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }
    .statistic-gmgn-address-jump-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.4s ease;
    }
    .statistic-gmgn-address-jump-btn:hover {
        background: #059669; /* 简化为纯色，提升性能 */
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        border-color: #10b981;
    }
    .statistic-gmgn-address-jump-btn:hover::before {
        left: 100%;
    }
    .statistic-gmgn-address-jump-btn:active {
        transform: translateY(0) scale(1);
    }

    .statistic-gmgn-profit-positive {
        color: #00ff88 !important;
    }

    .statistic-gmgn-profit-negative {
        color: #ff4444 !important;
    }

    .statistic-gmgn-empty-message {
        text-align: center;
        color: #ccc;
        padding: 20px;
        margin: 0;
    }

    .statistic-gmgn-stats-info {
        text-align: center !important;
        margin-bottom: 15px !important;
        padding: 10px !important;
        background: rgba(0, 119, 255, 0.1) !important;
        border-radius: 8px !important;
        border: 1px solid rgba(0, 119, 255, 0.3) !important;
        color: #fff !important;
        font-size: 14px !important;
    }

    .statistic-gmgn-export-btn {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: white !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
        padding: 12px 20px !important;
        border-radius: 12px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important; /* 简化过渡，提升性能 */
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        position: relative !important;
        overflow: hidden !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
    }
    .statistic-gmgn-export-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    .statistic-gmgn-export-btn:hover {
        background: linear-gradient(135deg, #059669, #047857) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4) !important;
        border-color: #10b981 !important;
    }
    .statistic-gmgn-export-btn:hover::before {
        left: 100% !important;
    }
    .statistic-gmgn-export-btn:active {
        transform: translateY(0) !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
    }

    /* 移除动画关键帧，直接显示弹出框 */

    /* 响应式设计优化 */
    @media (max-width: 768px) {
        .statistic-gmgn-modal-content {
            width: 95% !important;
            padding: 16px !important;
            margin: 10px !important;
        }

        .statistic-gmgn-modal-header {
            padding: 12px 16px !important;
            margin: -16px -16px 16px -16px !important;
        }

        .statistic-gmgn-summary-stats {
            gap: 16px;
            flex-wrap: wrap;
        }

        .statistic-gmgn-stat-item {
            min-width: 60px;
            padding: 6px 8px;
        }

        .statistic-gmgn-result-address {
            font-size: 11px;
            padding: 6px 8px;
        }
    }

    /* 自定义滚动条 */
    .statistic-gmgn-modal-content::-webkit-scrollbar {
        width: 8px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-thumb {
        background: #3b82f6; /* 简化为纯色，提升性能 */
        border-radius: 4px;
    }

    .statistic-gmgn-modal-content::-webkit-scrollbar-thumb:hover {
        background: #2563eb; /* 简化为纯色，提升性能 */
    }

    /* 加载状态动画 */
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .statistic-gmgn-loading {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* 分页控制样式 */
    .statistic-gmgn-pagination-info {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 16px;
        text-align: center;
    }

    .statistic-pagination-text {
        color: #3b82f6;
        font-size: 12px;
        font-weight: 500;
    }

    .statistic-gmgn-pagination-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        margin: 16px -24px -24px -24px;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
        border-radius: 0 0 16px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .statistic-pagination-btn {
        background: #3b82f6; /* 简化为纯色，提升性能 */
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: translateZ(0);
    }

    .statistic-pagination-btn:hover:not(:disabled) {
        background: #2563eb; /* 简化为纯色，提升性能 */
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .statistic-pagination-btn:disabled {
        background: rgba(148, 163, 184, 0.3);
        color: rgba(148, 163, 184, 0.6);
        cursor: not-allowed;
        transform: none;
    }

    .statistic-pagination-current {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 500;
    }

    /* 可疑地址类型标识样式 */
    .statistic-suspicious-labels {
        display: inline-flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-left: 12px;
        align-items: center;
    }

    .statistic-suspicious-label {
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 10px;
        border: 1px solid;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
        cursor: default;
    }

    .statistic-suspicious-label:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .statistic-suspicious-label::before {
        content: '⚠';
        font-size: 8px;
    }

    .statistic-suspicious-label.rat-trader::before {
        content: '🐭';
    }

    .statistic-suspicious-label.transfer-in::before {
        content: '⬇';
    }

    .statistic-suspicious-label.bundler::before {
        content: '📦';
    }

    /* 现代化详情数据样式 */
    .statistic-detail-grid-modern {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        padding: 8px 0;
    }

    .statistic-detail-item {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 10px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-height: 48px;
    }

    .statistic-detail-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, #3b82f6, #8b5cf6);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .statistic-detail-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(59, 130, 246, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .statistic-detail-item:hover::before {
        opacity: 1;
    }

    .statistic-detail-highlight {
        background: rgba(59, 130, 246, 0.08) !important;
        border-color: rgba(59, 130, 246, 0.2) !important;
    }

    .statistic-detail-highlight::before {
        opacity: 1 !important;
    }

    .statistic-detail-icon {
        font-size: 16px;
        margin-right: 8px;
        min-width: 20px;
        text-align: center;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .statistic-detail-content {
        flex: 1;
        min-width: 0;
    }

    .statistic-detail-label {
        font-size: 10px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
        margin-bottom: 2px;
        line-height: 1;
    }

    .statistic-detail-value {
        font-size: 13px;
        color: #e2e8f0;
        font-weight: 600;
        line-height: 1.2;
        word-break: break-all;
    }

    .statistic-detail-value.profit-positive {
        color: #10b981;
    }

    .statistic-detail-value.profit-negative {
        color: #ef4444;
    }

    .statistic-detail-value.highlight {
        color: #60a5fa;
    }

    .statistic-detail-value.warning {
        color: #f59e0b;
    }


    /* 下载按钮样式 - 与其他数字保持一致 */
    .statistic-download-btn {
        color:rgb(243, 243, 243) !important;
        font-weight: normal !important;
        cursor: pointer !important;
        /* 继承其他数字的基础样式 */
    }

    .statistic-download-btn:hover {
        background-color: rgba(0, 255, 0, 0.1) !important;
        border-radius: 3px !important;
        transform: scale(1.03) !important;
    }

    .statistic-download-btn.disabled {
        color: rgba(135, 135, 135, 0.73) !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
    }

    .statistic-download-btn.disabled:hover {
        background-color: transparent !important;
        transform: none !important;
    }

    /* 图片预览模态框样式 */
    .image-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        /* backdrop-filter: blur(5px); */ /* 移除性能杀手 */
    }

    .image-preview-content {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 20px;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .image-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 15px;
    }

    .image-preview-title {
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
    }

    .image-preview-close {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    }

    .image-preview-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .image-preview-img {
        max-width: 100%;
        max-height: 60vh;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .image-preview-buttons {
        display: flex;
        gap: 12px;
    }

    .image-preview-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #ffffff;
    }

    .image-preview-btn.copy-btn {
        background: #10b981; /* 简化为纯色，提升性能 */
    }

    .image-preview-btn.copy-btn:hover {
        background: #059669; /* 简化为纯色，提升性能 */
        transform: translateY(-1px);
    }

    .image-preview-btn.download-btn {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .image-preview-btn.download-btn:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-1px);
    }

    /* 现代化提示框样式 */
    .modern-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20000;
        background: rgba(0, 0, 0, 0.9);
        /* backdrop-filter: blur(10px); */ /* 移除性能杀手 */
        border-radius: 16px;
        padding: 0;
        box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 300px;
        max-width: 400px;
        /* 移除toast动画，直接显示 */
        cursor: pointer;
    }

    .modern-toast-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 19999;
        background: rgba(0, 0, 0, 0.3);
        /* backdrop-filter: blur(3px); */ /* 移除性能杀手 */
        /* animation: overlayFadeIn 0.3s ease forwards; */ /* 移除动画，提升性能 */
    }

    .modern-toast-content {
        display: flex;
        align-items: center;
        padding: 20px 24px;
        gap: 16px;
    }

    .modern-toast-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
    }

    .modern-toast-icon.success {
        background: #10b981; /* 简化为纯色，提升性能 */
        color: #ffffff;
    }

    .modern-toast-icon.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #ffffff;
    }

    .modern-toast-icon.info {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: #ffffff;
    }

    .modern-toast-text {
        flex: 1;
        color: #ffffff;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.4;
    }

    .modern-toast-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .modern-toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    /* 移除所有toast动画关键帧，提升性能 */
`;
    document.head.appendChild(style);

    // 存储拦截到的数据
    let interceptedData = null;
    // 存储首次加载的数据
    let initialStats = null;
    // 标记是否是首次加载
    let isFirstLoad = true;
    // 新增存储当前CA地址
    let currentCaAddress = null;
    // 存储首次加载的CA地址
    let initialCaAddress = null;

    // 性能优化：添加缓存机制
    let dataCache = {
        lastDataHash: null,
        calculatedStats: null,
        filteredResults: new Map(),
        eventsInitialized: false
    };

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 检查当前网络是否为SOL
    function isSolNetwork() {
        const url = window.location.href;
        return url.includes('/sol/') || url.includes('gmgn.ai/sol');
    }

    // 获取可疑地址的具体类型标识
    function getSuspiciousTypeLabels(holder) {
        const labels = [];

        // 基础可疑标记
        if (holder.is_suspicious) {
            labels.push({
                text: '可疑',
                color: '#dc2626',
                bgColor: 'rgba(220, 38, 38, 0.15)',
                borderColor: 'rgba(220, 38, 38, 0.3)'
            });
        }

        // 检查maker_token_tags
        if (holder.maker_token_tags) {
            if (holder.maker_token_tags.includes('rat_trader')) {
                labels.push({
                    text: '老鼠仓',
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                });
            }

            if (holder.transfer_in) {
                labels.push({
                    text: '小鱼钱包',
                    color: '#f87171',
                    bgColor: 'rgba(248, 113, 113, 0.15)',
                    borderColor: 'rgba(248, 113, 113, 0.3)'
                });
            }

            if (holder.maker_token_tags.includes('bundler')) {
                labels.push({
                    text: '捆绑交易',
                    color: '#b91c1c',
                    bgColor: 'rgba(185, 28, 28, 0.15)',
                    borderColor: 'rgba(185, 28, 28, 0.3)'
                });
            }
        }

        return labels;
    }

    // 生成现代化详情数据HTML
    function generateDetailItemHTML(icon, label, value, valueClass = '', isHighlight = false) {
        const highlightClass = isHighlight ? 'statistic-detail-highlight' : '';
        return `
            <div class="statistic-detail-item ${highlightClass}">
                <div class="statistic-detail-icon">${icon}</div>
                <div class="statistic-detail-content">
                    <div class="statistic-detail-label">${label}</div>
                    <div class="statistic-detail-value ${valueClass}">${value}</div>
                </div>
            </div>
        `;
    }

    // 生成可疑标识HTML
    function generateSuspiciousLabelsHTML(labels) {
        if (!labels || labels.length === 0) {
            return '';
        }

        const labelsHTML = labels.map(label => {
            const typeClass = label.text === '老鼠仓' ? 'rat-trader' :
                             label.text === '小鱼钱包' ? 'transfer-in' :
                             label.text === '捆绑交易' ? 'bundler' : '';

            return `<span class="statistic-suspicious-label ${typeClass}"
                          style="color: ${label.color};
                                 background: ${label.bgColor};
                                 border-color: ${label.borderColor};"
                          title="${label.text}标识">
                        ${label.text}
                    </span>`;
        }).join('');

        return `<div class="statistic-suspicious-labels">${labelsHTML}</div>`;
    }

    // 检查是否为交易所地址
    function isExchangeAddress(holder) {
        const exchangeNames = ['coinbase', 'binance', 'bybit', 'bitget', 'okx', 'kraken', 'coinsquare', 'crypto.com', 'robinhood', 'mexc'];

        // 检查native_transfer中的name
        if (holder.native_transfer && holder.native_transfer.name) {
            const name = holder.native_transfer.name.toLowerCase();
            if (exchangeNames.some(exchange => name.includes(exchange))) {
                return true;
            }
        }

        // 检查其他可能的transfer字段
        if (holder.transfer && holder.transfer.name) {
            const name = holder.transfer.name.toLowerCase();
            if (exchangeNames.some(exchange => name.includes(exchange))) {
                return true;
            }
        }

        return false;
    }

    // 获取交易所名称
    function getExchangeName(holder) {
        const exchangeNames = ['coinbase', 'binance', 'bybit', 'bitget', 'okx', 'kraken', 'coinsquare', 'crypto.com', 'robinhood', 'mexc'];

        let sourceName = '';
        if (holder.native_transfer && holder.native_transfer.name) {
            sourceName = holder.native_transfer.name.toLowerCase();
        } else if (holder.transfer && holder.transfer.name) {
            sourceName = holder.transfer.name.toLowerCase();
        }

        for (let exchange of exchangeNames) {
            if (sourceName.includes(exchange)) {
                return exchange.charAt(0).toUpperCase() + exchange.slice(1);
            }
        }

        return 'Unknown';
    }
    // 交易所专用弹框
    function createExchangeModal(data, caAddress) {
        // 移除已存在的弹框
        const existingModal = document.querySelector('.statistic-gmgn-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 按交易所分组数据
        const exchangeGroups = {};
        data.forEach(holder => {
            const exchangeName = getExchangeName(holder);
            if (!exchangeGroups[exchangeName]) {
                exchangeGroups[exchangeName] = [];
            }
            exchangeGroups[exchangeName].push(holder);
        });

        // 计算已卖筹码地址数
        const soldAddressCount = data.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;

        // 计算总持仓占比
        const totalHoldingPercentage = data.reduce((sum, holder) => {
            return sum + (holder.amount_percentage || 0);
        }, 0);

        // 创建弹框
        const modal = document.createElement('div');
        modal.className = 'statistic-gmgn-modal';

        // 生成交易所统计数据
        const exchangeSummary = Object.keys(exchangeGroups).map(exchange => {
            return {
                name: exchange,
                count: exchangeGroups[exchange].length,
                addresses: exchangeGroups[exchange]
            };
        }).sort((a, b) => b.count - a.count);

        modal.innerHTML = `
            <div class="statistic-gmgn-modal-content">
                <div class="statistic-gmgn-modal-header">
                    <div class="statistic-gmgn-modal-title">🚀 交易所地址分析 (共${data.length}个地址)</div>
                    <button class="statistic-gmgn-modal-close">&times;</button>
                </div>
                <div class="statistic-gmgn-analysis-summary">
                    <div class="statistic-gmgn-summary-stats">
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">已卖筹码地址数:</span>
                            <span class="statistic-gmgn-stat-value">${soldAddressCount}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">交易所数:</span>
                            <span class="statistic-gmgn-stat-value">${Object.keys(exchangeGroups).length}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总持仓占比:</span>
                            <span class="statistic-gmgn-stat-value">${(totalHoldingPercentage * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                    <button id="statistic-export-exchange-btn" class="statistic-gmgn-export-btn" title="导出Excel">导出Excel</button>
                </div>
                <div id="statistic-exchange-summary">
                    <div class="statistic-gmgn-section-title">📱 交易所统计</div>
                    <div class="statistic-exchange-summary-grid">
                        ${exchangeSummary.map(item => `
                            <div class="statistic-exchange-summary-item" data-exchange="${item.name}">
                                <span class="statistic-exchange-name">${item.name}</span>
                                <span class="statistic-exchange-count">${item.count}个地址</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div id="statistic-exchange-details"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加交易所统计样式
        if (!document.getElementById('exchange-summary-styles')) {
            const summaryStyles = document.createElement('style');
            summaryStyles.id = 'exchange-summary-styles';
            summaryStyles.textContent = `
                .statistic-exchange-summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .statistic-exchange-summary-item {
                    background-color: #475569;
                    border-radius: 8px;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                .statistic-exchange-summary-item:hover {
                    background-color: #64748b;
                    border-color: #3b82f6;
                    transform: translateY(-2px);
                }
                .statistic-exchange-summary-item.active {
                    background-color: #3b82f6;
                    border-color: #1d4ed8;
                }
                .statistic-exchange-name {
                    font-weight: 600;
                    color: #e2e8f0;
                    font-size: 14px;
                }
                .statistic-exchange-count {
                    color: #10b981;
                    font-weight: 600;
                    font-size: 13px;
                }
                .statistic-exchange-details-section {
                    margin-bottom: 20px;
                }
                .statistic-exchange-section-header {
                    background-color: #1e293b;
                    padding: 12px 16px;
                    border-radius: 8px 8px 0 0;
                    border-left: 4px solid #3b82f6;
                    margin-bottom: 0;
                }
                .statistic-exchange-section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #3b82f6;
                    margin: 0;
                }
                .statistic-exchange-section-count {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 4px;
                }
            `;
            document.head.appendChild(summaryStyles);
        }

        // 绑定交易所统计点击事件
        exchangeSummary.forEach(item => {
            const summaryItem = modal.querySelector(`[data-exchange="${item.name}"]`);
            if (summaryItem) {
                summaryItem.addEventListener('click', () => {
                    // 移除所有活跃状态
                    modal.querySelectorAll('.statistic-exchange-summary-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    // 添加当前活跃状态
                    summaryItem.classList.add('active');
                    // 显示该交易所的详细信息
                    displayExchangeDetails(item.addresses, item.name, modal);
                });
            }
        });

        // ESC键关闭处理函数
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        };
        document.addEventListener('keydown', escKeyHandler);

        // 绑定导出Excel按钮事件
        const exportBtn = modal.querySelector('#statistic-export-exchange-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportExchangeToExcel(exchangeGroups, caAddress);
            });
        }

        // 绑定关闭按钮事件
        modal.querySelector('.statistic-gmgn-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        });

        // 默认显示第一个交易所的详情
        if (exchangeSummary.length > 0) {
            const firstItem = modal.querySelector(`[data-exchange="${exchangeSummary[0].name}"]`);
            if (firstItem) {
                firstItem.click();
            }
        }
    }

    // 显示交易所详细信息
    function displayExchangeDetails(addresses, exchangeName, modal) {
        const detailsContainer = modal.querySelector('#statistic-exchange-details');

        // 创建全局排名映射 - 基于原始完整数据按持仓比例排序
        const globalRankMap = new Map();
        if (interceptedData?.data?.list) {
            const allHolders = [...interceptedData.data.list];
            allHolders
                .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0))
                .forEach((holder, index) => {
                    globalRankMap.set(holder.address, index + 1);
                });
        }

        // 按持仓比例排序
        const sortedAddresses = addresses.sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0));

        detailsContainer.innerHTML = `
            <div class="statistic-exchange-details-section">
                <div class="statistic-exchange-section-header">
                    <div class="statistic-exchange-section-title">${exchangeName} 地址详情</div>
                    <div class="statistic-exchange-section-count">共 ${sortedAddresses.length} 个地址</div>
                </div>
                ${sortedAddresses.map((holder, index) => {
                    const globalRank = globalRankMap.get(holder.address) || (index + 1);
                    const processedData = {
                        rank: index + 1,
                        rankIndex: globalRank, // 使用全局排名
                        address: holder.address,
                        balance: formatNumber(holder.balance),
                        usdValue: formatNumber(holder.usd_value),
                        netflowUsd: formatNumber(holder.netflow_usd),
                        netflowClass: (holder.netflow_usd || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        profit: formatNumber(holder.profit),
                        profitSign: holder.profit >= 0 ? '+' : '',
                        profitClass: holder.profit >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        profitChange: holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                        profitChangeClass: (holder.profit_change || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                        exchangeName: getExchangeName(holder),
                        transferName: (holder.native_transfer && holder.native_transfer.name) || (holder.transfer && holder.transfer.name) || 'N/A',
                        amountPercentage: holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                        sellPercentage: holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%' // 筹码已卖
                    };

                    return `
                        <div class="statistic-gmgn-result-item">
                            <div class="statistic-gmgn-result-header">
                                <div class="statistic-gmgn-result-rank">
                                    <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${processedData.rankIndex}</span>
                                </div>
                                <div class="statistic-gmgn-result-address" title="点击复制地址" onclick="navigator.clipboard.writeText('${processedData.address}'); this.style.backgroundColor='#16a34a'; this.style.color='white'; setTimeout(() => { this.style.backgroundColor=''; this.style.color=''; }, 1000);">${processedData.address}</div>
                                <a href="https://gmgn.ai/sol/address/${processedData.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                            </div>
                            <div class="statistic-gmgn-compact-details">
                                <div class="statistic-gmgn-detail-section">
                                    <div class="statistic-gmgn-section-title">基本信息</div>
                                    <div class="statistic-detail-grid-modern">
                                        ${generateDetailItemHTML('💎', '持仓', processedData.balance)}
                                        ${generateDetailItemHTML('✨', '持仓占比', processedData.amountPercentage, 'highlight', true)}
                                        ${generateDetailItemHTML('📉', '筹码已卖', processedData.sellPercentage, processedData.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                                        ${generateDetailItemHTML('💰', '净流入', '$' + processedData.netflowUsd, processedData.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('📈', '盈亏', processedData.profitSign + '$' + processedData.profit, processedData.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('🚀', '倍数', processedData.profitChange, processedData.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                        ${generateDetailItemHTML('🏢', '交易所', processedData.exchangeName, 'highlight', true)}
                                        ${generateDetailItemHTML('🏷️', '标签', processedData.transferName)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // 交易所数据导出函数
    function exportExchangeToExcel(exchangeGroups, caAddress) {
        try {
            const worksheetData = [];

            // 添加标题行
            worksheetData.push(['交易所', '排名', '地址', '持仓数量', '持仓比例', '筹码已卖', 'USD价值', '净流入USD', '盈亏USD', '盈亏倍数', '标签名称']);

            // 按交易所排序添加数据
            Object.keys(exchangeGroups).forEach(exchangeName => {
                const addresses = exchangeGroups[exchangeName].sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0));
                addresses.forEach((holder, index) => {
                    const row = [
                        exchangeName,
                        index + 1,
                        holder.address,
                        formatNumber(holder.balance),
                        holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                        holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%',
                        formatNumber(holder.usd_value),
                        formatNumber(holder.netflow_usd),
                        (holder.profit >= 0 ? '+' : '') + formatNumber(holder.profit),
                        holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                        (holder.native_transfer && holder.native_transfer.name) || (holder.transfer && holder.transfer.name) || 'N/A'
                    ];
                    worksheetData.push(row);
                });
            });

            // 创建工作簿
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            // 设置列宽
            const colWidths = [
                {wch: 12},  // 交易所
                {wch: 6},   // 排名
                {wch: 45},  // 地址
                {wch: 15},  // 持仓数量
                {wch: 10},  // 持仓比例
                {wch: 10},  // 已卖比例
                {wch: 15},  // USD价值
                {wch: 15},  // 净流入
                {wch: 15},  // 盈亏
                {wch: 12},  // 倍数
                {wch: 25}   // 标签名称
            ];
            ws['!cols'] = colWidths;

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, '交易所地址');

            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `交易所地址_${caAddress ? caAddress.slice(0, 8) : 'data'}_${timestamp}.xlsx`;

            // 下载文件
            XLSX.writeFile(wb, fileName);

            // 显示成功提示
            const exportBtn = document.querySelector('#statistic-export-exchange-btn');
            if (exportBtn) {
                const originalText = exportBtn.textContent;
                exportBtn.textContent = '✅ 导出成功';
                exportBtn.style.backgroundColor = '#059669';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                }, 2000);
            }

        } catch (error) {
            console.error('Excel导出失败:', error);
            showModernToast('导出失败，请检查浏览器控制台了解详情', 'error');
        }
    }

    // 优化后的弹框管理函数 - 添加分页支持
    function createModal(title, data, caAddress, showSolBalance = false) {
        // 移除已存在的弹框
        const existingModal = document.querySelector('.statistic-gmgn-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 性能优化：数据量限制
        const ITEMS_PER_PAGE = 50;
        const isLargeDataset = data.length > ITEMS_PER_PAGE;
        let currentPage = 1;
        let totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

        // 1. 数据预处理 - 首先获取全局排名
        if (!interceptedData?.data?.list) {
            console.error('无法获取原始数据进行全局排名');
            return;
        }

        // 创建全局排名映射 - 基于原始完整数据按持仓比例排序
        const globalRankMap = new Map();
        const allHolders = [...interceptedData.data.list];
        allHolders
            .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0))
            .forEach((holder, index) => {
                globalRankMap.set(holder.address, index + 1);
            });

        // 2. 计算已卖筹码地址数
        const soldAddressCount = data.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;

        // 计算总持仓占比
        const totalHoldingPercentage = data.reduce((sum, holder) => {
            return sum + (holder.amount_percentage || 0);
        }, 0);

        // 3. 处理所有数据并排序
        const allProcessedData = data
            .sort((a, b) => (b.amount_percentage || 0) - (a.amount_percentage || 0)) // 按持仓比例排序
            .map((holder, index) => {
                const globalRank = globalRankMap.get(holder.address) || (index + 1);
                const baseData = {
                    rank: index + 1, // 在当前数据集中的排名（用于显示序号）
                    rankIndex: globalRank, // 在全局数据中的排名（用于显示"榜X"）
                    address: holder.address,
                    balance: formatNumber(holder.balance),
                    usdValue: formatNumber(holder.usd_value),
                    netflowUsd: formatNumber(holder.netflow_usd),
                    netflowClass: (holder.netflow_usd || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    profit: formatNumber(holder.profit),
                    profitSign: holder.profit >= 0 ? '+' : '',
                    profitClass: holder.profit >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    profitChange: holder.profit_change ? (holder.profit_change * 100).toFixed(1) + '%' : 'N/A',
                    profitChangeClass: (holder.profit_change || 0) >= 0 ? 'statistic-gmgn-profit-positive' : 'statistic-gmgn-profit-negative',
                    amountPercentage: holder.amount_percentage ? (holder.amount_percentage * 100).toFixed(2) + '%' : 'N/A',
                    sellPercentage: holder.sell_amount_percentage ? (holder.sell_amount_percentage * 100).toFixed(2) + '%' : '0.00%', // 筹码已卖
                    // 添加可疑类型标识
                    suspiciousLabels: getSuspiciousTypeLabels(holder),
                    // 保留原始数据用于检测
                    originalHolder: holder
                };

                // 只有在需要显示SOL余额时才添加
                if (showSolBalance) {
                    baseData.solBalance = holder.native_balance ? ((holder.native_balance / 1000000000).toFixed(2) + ' SOL') : 'N/A';
                }

                return baseData;
            });

        // 分页处理：获取当前页数据
        function getCurrentPageData(page = 1) {
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            return allProcessedData.slice(start, end);
        }

        const processedData = getCurrentPageData(currentPage);

        // 2. 创建弹框基础结构 - 使用token_holding_temp.js的DOM结构
        const modal = document.createElement('div');
        modal.className = 'statistic-gmgn-modal';
        modal.innerHTML = `
            <div class="statistic-gmgn-modal-content">
                <div class="statistic-gmgn-modal-header">
                    <div class="statistic-gmgn-modal-title">💎 ${title} (${allProcessedData.length}个地址)</div>
                    <button class="statistic-gmgn-modal-close">&times;</button>
                </div>
                ${isLargeDataset ? `
                <div class="statistic-gmgn-pagination-info">
                    <span class="statistic-pagination-text">⚡ 性能优化：分页显示 | 第${currentPage}页，共${totalPages}页 | 每页${ITEMS_PER_PAGE}条</span>
                </div>
                ` : ''}
                <div class="statistic-gmgn-analysis-summary">
                    <div class="statistic-gmgn-summary-stats">
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">已卖筹码地址数:</span>
                            <span class="statistic-gmgn-stat-value">${soldAddressCount}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总数量:</span>
                            <span class="statistic-gmgn-stat-value">${allProcessedData.length}</span>
                        </div>
                        <div class="statistic-gmgn-stat-item">
                            <span class="statistic-gmgn-stat-label">总持仓占比:</span>
                            <span class="statistic-gmgn-stat-value">${(totalHoldingPercentage * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                    <button id="statistic-export-excel-btn" class="statistic-gmgn-export-btn" title="导出Excel">导出Excel</button>
                </div>
                <div id="statistic-gmgn-results-list"></div>
                ${isLargeDataset ? `
                <div class="statistic-gmgn-pagination-controls">
                    <button id="statistic-prev-page" class="statistic-pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>← 上一页</button>
                    <span class="statistic-pagination-current">第 ${currentPage} 页 / 共 ${totalPages} 页</span>
                    <button id="statistic-next-page" class="statistic-pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>下一页 →</button>
                </div>
                ` : ''}
                </div>
        `;

        // 3. 插入DOM
        document.body.appendChild(modal);

        // 4. 填充结果列表 - 参考token_holding_temp.js的方式
        const resultsList = document.getElementById('statistic-gmgn-results-list');
        processedData.forEach((holder, index) => {
            const item = document.createElement('div');
            item.className = 'statistic-gmgn-result-item';
            item.innerHTML = `
                <div class="statistic-gmgn-result-header">
                    <div class="statistic-gmgn-result-rank">
                        <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${holder.rankIndex}</span>
                    </div>
                    <div class="statistic-gmgn-result-address" title="点击复制地址">${holder.address}</div>
                    <a href="https://gmgn.ai/sol/address/${holder.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                </div>
                <div class="statistic-gmgn-compact-details">
                    <div class="statistic-gmgn-detail-section">
                        <div class="statistic-gmgn-section-title">
                            基本信息
                            ${generateSuspiciousLabelsHTML(holder.suspiciousLabels)}
                        </div>
                        <div class="statistic-detail-grid-modern">
                            ${generateDetailItemHTML('💎', '持仓', holder.balance)}
                            ${generateDetailItemHTML('✨', '持仓占比', holder.amountPercentage, 'highlight', true)}
                            ${generateDetailItemHTML('📉', '筹码已卖', holder.sellPercentage, holder.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                            ${generateDetailItemHTML('💰', '净流入', '$' + holder.netflowUsd, holder.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${generateDetailItemHTML('📈', '盈亏', holder.profitSign + '$' + holder.profit, holder.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${generateDetailItemHTML('🚀', '倍数', holder.profitChange, holder.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                            ${holder.solBalance ? generateDetailItemHTML('⭐', 'SOL餘額', holder.solBalance, 'highlight') : ''}
                            </div>
                </div>
            </div>
        `;

            // 添加地址复制功能
            const addressElement = item.querySelector('.statistic-gmgn-result-address');
            addressElement.addEventListener('click', () => {
                navigator.clipboard.writeText(holder.address).then(() => {
                    addressElement.style.backgroundColor = '#16a34a';
                    addressElement.style.color = 'white';
                    setTimeout(() => {
                        addressElement.style.backgroundColor = '';
                        addressElement.style.color = '';
                    }, 1000);
                });
            });

            resultsList.appendChild(item);
        });

        // ESC键关闭处理函数
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        };
        document.addEventListener('keydown', escKeyHandler);

        // 5. 绑定导出Excel按钮事件 - 导出完整数据而非分页数据
        const exportBtn = modal.querySelector('#statistic-export-excel-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportToExcel(allProcessedData, title, caAddress, showSolBalance);
            });
        }

        // 6. 分页控制逻辑
        if (isLargeDataset) {
            // 渲染指定页面的数据
            function renderPage(page) {
                currentPage = page;
                const currentPageData = getCurrentPageData(page);

                // 清空当前列表
                const resultsList = document.getElementById('statistic-gmgn-results-list');
                resultsList.innerHTML = '';

                // 重新渲染当前页数据
                currentPageData.forEach((holder, index) => {
                    const item = document.createElement('div');
                    item.className = 'statistic-gmgn-result-item';
                    item.innerHTML = `
                        <div class="statistic-gmgn-result-header">
                            <div class="statistic-gmgn-result-rank">
                                <span style="color: #ff6b35; font-weight: bold; background: rgba(255, 107, 53, 0.15); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(255, 107, 53, 0.3); font-size: 12px;">榜${holder.rankIndex}</span>
                            </div>
                            <div class="statistic-gmgn-result-address" title="点击复制地址">${holder.address}</div>
                            <a href="https://gmgn.ai/sol/address/${holder.address}" target="_blank" class="statistic-gmgn-address-jump-btn" title="查看钱包详情">详情</a>
                        </div>
                        <div class="statistic-gmgn-compact-details">
                            <div class="statistic-gmgn-detail-section">
                                <div class="statistic-gmgn-section-title">
                                    基本信息
                                    ${generateSuspiciousLabelsHTML(holder.suspiciousLabels)}
                                </div>
                                <div class="statistic-detail-grid-modern">
                                    ${generateDetailItemHTML('💎', '持仓', holder.balance)}
                                    ${generateDetailItemHTML('✨', '持仓占比', holder.amountPercentage, 'highlight', true)}
                                    ${generateDetailItemHTML('📉', '筹码已卖', holder.sellPercentage, holder.sellPercentage === '0.00%' ? 'profit-positive' : 'warning')}
                                    ${generateDetailItemHTML('💰', '净流入', '$' + holder.netflowUsd, holder.netflowClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${generateDetailItemHTML('📈', '盈亏', holder.profitSign + '$' + holder.profit, holder.profitClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${generateDetailItemHTML('🚀', '倍数', holder.profitChange, holder.profitChangeClass.includes('positive') ? 'profit-positive' : 'profit-negative')}
                                    ${holder.solBalance ? generateDetailItemHTML('⭐', 'SOL餘額', holder.solBalance, 'highlight') : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // 添加地址复制功能
                    const addressElement = item.querySelector('.statistic-gmgn-result-address');
                    addressElement.addEventListener('click', () => {
                        navigator.clipboard.writeText(holder.address).then(() => {
                            addressElement.style.backgroundColor = '#16a34a';
                            addressElement.style.color = 'white';
                            setTimeout(() => {
                                addressElement.style.backgroundColor = '';
                                addressElement.style.color = '';
                            }, 1000);
                        });
                    });

                    resultsList.appendChild(item);
                });

                // 更新分页按钮状态
                const prevBtn = modal.querySelector('#statistic-prev-page');
                const nextBtn = modal.querySelector('#statistic-next-page');
                const currentSpan = modal.querySelector('.statistic-pagination-current');

                if (prevBtn) {
                    prevBtn.disabled = (page === 1);
                }
                if (nextBtn) {
                    nextBtn.disabled = (page === totalPages);
                }
                if (currentSpan) {
                    currentSpan.textContent = `第 ${page} 页 / 共 ${totalPages} 页`;
                }
            }

            // 绑定分页按钮事件
            const prevBtn = modal.querySelector('#statistic-prev-page');
            const nextBtn = modal.querySelector('#statistic-next-page');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentPage > 1) {
                        renderPage(currentPage - 1);
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        renderPage(currentPage + 1);
                    }
                });
            }
        }

        // 7. 绑定关闭按钮事件
        modal.querySelector('.statistic-gmgn-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escKeyHandler);
            }
        });
    }





    // 数字格式化函数
    function formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';

        // 處理負數：保留負號，對絕對值進行格式化
        const isNegative = num < 0;
        const absNum = Math.abs(num);

        let formatted;
        if (absNum >= 1000000000) {
            formatted = (absNum / 1000000000).toFixed(2) + 'B';
        } else if (absNum >= 1000000) {
            formatted = (absNum / 1000000).toFixed(2) + 'M';
        } else if (absNum >= 1000) {
            formatted = (absNum / 1000).toFixed(2) + 'K';
        } else {
            formatted = absNum.toFixed(2);
        }

        return isNegative ? '-' + formatted : formatted;
    }

    // Excel导出功能
    function exportToExcel(data, title, caAddress, showSolBalance) {
        try {
            // 创建工作表数据
            const worksheetData = [];

            // 添加标题行
            const headers = ['排名', '地址', '持仓数量', '持仓占比', '筹码已卖', 'USD价值', '净流入USD', '盈亏USD', '盈亏倍数'];
            if (showSolBalance) {
                headers.push('SOL餘額');
            }
            worksheetData.push(headers);

            // 添加数据行
            data.forEach((holder, index) => {
                const row = [
                    holder.rank,
                    holder.address,
                    holder.balance,
                    holder.amountPercentage,
                    holder.sellPercentage,
                    holder.usdValue,
                    holder.netflowUsd,
                    (holder.profitSign || '') + holder.profit,
                    holder.profitChange
                ];

                if (showSolBalance) {
                    row.push(holder.solBalance || 'N/A');
                }

                worksheetData.push(row);
            });

            // 创建工作簿
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            // 设置列宽
            const colWidths = [
                {wch: 6},   // 排名
                {wch: 45},  // 地址
                {wch: 15},  // 持仓数量
                {wch: 10},  // 持仓比例
                {wch: 10},  // 已卖比例
                {wch: 15},  // USD价值
                {wch: 15},  // 净流入
                {wch: 15},  // 盈亏
                {wch: 12}   // 倍数
            ];
            if (showSolBalance) {
                colWidths.push({wch: 12}); // SOL餘額
            }
            ws['!cols'] = colWidths;

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, title);

            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `${title}_${caAddress ? caAddress.slice(0, 8) : 'data'}_${timestamp}.xlsx`;

            // 下载文件
            XLSX.writeFile(wb, fileName);

            // 显示成功提示
            const exportBtn = document.querySelector('#statistic-export-excel-btn');
            if (exportBtn) {
                const originalText = exportBtn.textContent;
                exportBtn.textContent = '✅ 导出成功';
                exportBtn.style.backgroundColor = '#059669';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                }, 2000);
            }

        } catch (error) {
            console.error('Excel导出失败:', error);
            showModernToast('导出失败，请检查浏览器控制台了解详情', 'error');
        }
    }

    // 根据类型获取对应的地址数据（优化版本）
    function getAddressByType(type) {
        if (!interceptedData?.data?.list) return [];

        // 检查缓存
        const currentHash = getDataHash(interceptedData);
        const cacheKey = `${type}_${currentHash}`;
        if (dataCache.filteredResults.has(cacheKey)) {
            console.log('[性能优化] 使用缓存的过滤结果:', type);
            return dataCache.filteredResults.get(cacheKey);
        }

        console.log('[性能优化] 重新过滤数据:', type);
        const currentTime = Math.floor(Date.now() / 1000);
        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        const holders = interceptedData.data.list;

        let result;
        switch(type) {
            case 'fullPosition':
                result = holders.filter(h =>
                    h.sell_amount_percentage === 0 &&
                    (!h.token_transfer_out || !h.token_transfer_out.address)
                );
                break;
            case 'profitable':
                result = holders.filter(h => h.profit > 0);
                break;
            case 'losing':
                result = holders.filter(h => h.profit < 0);
                break;
            case 'active24h':
                result = holders.filter(h => h.last_active_timestamp > currentTime - 86400);
                break;
            case 'diamondHands':
                result = holders.filter(h => h.maker_token_tags?.includes('diamond_hands'));
                break;
            case 'newAddress':
                result = holders.filter(h => h.tags?.includes('fresh_wallet'));
                break;
            case 'holdingLessThan7Days':
                result = holders.filter(h =>
                    h.start_holding_at &&
                    (currentTime - h.start_holding_at) < sevenDaysInSeconds
                );
                break;
            case 'highProfit':
                result = holders.filter(h => h.profit_change > 5);
                break;
            case 'suspicious':
                result = holders.filter(h =>
                    h.is_suspicious ||
                    h.transfer_in ||
                    (h.maker_token_tags && (
                        h.maker_token_tags.includes('rat_trader') ||
                        h.maker_token_tags.includes('bundler')
                    ))
                );
                break;
            case 'lowSolBalance':
                result = holders.filter(h =>
                    h.native_balance && (h.native_balance / 1000000000) < 1
                );
                break;
            case 'tokenTransferIn':
                result = holders.filter(h =>
                    h.token_transfer_in && h.token_transfer_in.address && h.token_transfer_in.address.trim() !== ''
                );
                break;
            case 'exchangeAddresses':
                result = holders.filter(h => isExchangeAddress(h));
                break;
            default:
                result = [];
        }

        // 缓存结果
        dataCache.filteredResults.set(cacheKey, result);
        console.log('[性能优化] 过滤结果已缓存:', type, 'count:', result.length);

        return result;
    }

    // 获取类型对应的中文标题
    function getTypeTitle(type) {
        const titles = {
            'fullPosition': '满仓地址',
            'profitable': '盈利地址',
            'losing': '亏损地址',
            'active24h': '24小时活跃地址',
            'diamondHands': '钻石手地址',
            'newAddress': '新地址',
            'holdingLessThan7Days': '持仓小于7天的地址',
            'highProfit': '5倍以上盈利地址',
            'suspicious': '可疑地址',
            'lowSolBalance': 'SOL餘額不足1的地址',
            'tokenTransferIn': '代币转入地址',
            'exchangeAddresses': '交易所地址'
        };
        return titles[type] || '未知类型';
    }

    // 1. 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (isTargetApi(url)) {
            console.log('[拦截] fetch 请求:', url);
            return originalFetch.apply(this, arguments)
                .then(response => {
                if (response.ok) {
                    processResponse(response.clone());
                }
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // 2. 拦截 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            if (isTargetApi(url)) {
                console.log('[拦截] XHR 请求:', url);
                const originalOnload = xhr.onload;
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        processResponse(xhr.responseText);
                    }
                    originalOnload?.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };

    function isTargetApi(url) {
        if (typeof url !== 'string') return false;

        // 检查是否是token_holders API且包含limit参数
        const isTokenHoldersApi = /vas\/api\/v1\/token_holders\/(sol|eth|base|bsc|tron)(\/|$|\?)/i.test(url);
        const hasLimitParam = /[?&]limit=/i.test(url);

        const isTarget = isTokenHoldersApi && hasLimitParam;

        if (isTarget) {
            // 从URL中提取CA地址
            const match = url.match(/vas\/api\/v1\/token_holders\/sol\/([^/?]+)/i);
            console.log('匹配的ca：',match)
            console.log('包含limit参数的URL：', url)
            if (match && match[1]) {
                currentCaAddress = match[1];
            }
        }
        return isTarget;
    }

    function processResponseInternal(response) {
        console.log('开始处理响应数据');

        try {
            const dataPromise = typeof response === 'string' ?
                  Promise.resolve(JSON.parse(response)) :
            response.json();

            dataPromise.then(data => {
                interceptedData = data;
                console.log('[成功] 拦截到数据量:', data.data?.list?.length);
                console.log('[成功] 拦截到数据:',data);

                const currentStats = calculateStats();
                if (isFirstLoad) {
                    // 首次加载，记录初始数据和CA地址
                    initialStats = currentStats;
                    initialCaAddress = currentCaAddress;
                    isFirstLoad = false;
                    updateStatsDisplay(currentStats, true);
                } else {
                    // 非首次加载，比较CA地址
                    const isSameCa = currentCaAddress === initialCaAddress;
                    updateStatsDisplay(currentStats, !isSameCa);

                    // 如果CA地址不同，更新初始数据为当前数据，并重置下载按钮状态
                    if (!isSameCa) {
                        initialStats = currentStats;
                        initialCaAddress = currentCaAddress;

                        // 重置下载按钮状态
                        resetDownloadButtonState();
                        console.log('检测到CA地址变更，已重置下载按钮状态');
                    }
                }
            }).catch(e => console.error('解析失败:', e));
        } catch (e) {
            console.error('处理响应错误:', e);
        }
    }

    // 防抖版本的processResponse
    const processResponse = debounce(processResponseInternal, 100);

    // 计算数据哈希值用于缓存
    function getDataHash(data) {
        return JSON.stringify({
            length: data?.data?.list?.length || 0,
            timestamp: data?.data?.list?.[0]?.last_active_timestamp || 0,
            caAddress: currentCaAddress
        });
    }

    // 3. 计算所有统计指标（优化版本）
    function calculateStats() {
        if (!interceptedData?.data?.list) return null;

        // 检查缓存
        const currentHash = getDataHash(interceptedData);
        if (dataCache.lastDataHash === currentHash && dataCache.calculatedStats) {
            console.log('[性能优化] 使用缓存的统计数据');
            return dataCache.calculatedStats;
        }

        console.log('[性能优化] 重新计算统计数据');
        const currentTime = Math.floor(Date.now() / 1000);
        const sevenDaysInSeconds = 7 * 24 * 60 * 60; // 7天的秒数
        const holders = interceptedData.data.list;
        const stats = {
            fullPosition: 0,    // 全仓
            profitable: 0,      // 盈利
            losing: 0,         // 亏损
            active24h: 0,      // 24h活跃
            diamondHands: 0,   // 钻石手
            newAddress: 0,     // 新地址
            highProfit: 0,     // 10x盈利
            suspicious: 0,     // 新增：可疑地址
            holdingLessThan7Days: 0, // 新增：持仓小于7天
            lowSolBalance: 0,   // 新增：SOL餘額小於1的地址
            tokenTransferIn: 0, // 新增：代币转入地址数
            exchangeAddresses: 0 // 新增：交易所地址数
        };

        holders.forEach(holder => {
                // 满判断条件：1.没有卖出；2.没有出货地址
            if (holder.sell_amount_percentage === 0 &&
                (!holder.token_transfer_out || !holder.token_transfer_out.address)) {
                stats.fullPosition++;
            }
            if (holder.profit > 0) stats.profitable++;
            if (holder.profit < 0) stats.losing++;
            if (holder.last_active_timestamp > currentTime - 86400) stats.active24h++;
            if (holder.maker_token_tags?.includes('diamond_hands')) stats.diamondHands++;
            if (holder.tags?.includes('fresh_wallet')) stats.newAddress++;
            if (holder.profit_change > 5) stats.highProfit++;
            // 增强版可疑地址检测
            if (
                holder.is_suspicious ||
                holder.transfer_in ||
                (holder.maker_token_tags && (
                    holder.maker_token_tags.includes('rat_trader') ||
                    holder.maker_token_tags.includes('bundler')
                ))
            ) {
                stats.suspicious++;
            }
            // 新增7天持仓统计
            if (holder.start_holding_at &&
                (currentTime - holder.start_holding_at) < sevenDaysInSeconds) {
                stats.holdingLessThan7Days++;
            }
            // 新增低SOL餘額統計（小於1 SOL）
            if (holder.native_balance && (holder.native_balance / 1000000000) < 1) {
                stats.lowSolBalance++;
            }
            // 新增代币转入地址统计
            if (holder.token_transfer_in && holder.token_transfer_in.address && holder.token_transfer_in.address.trim() !== '') {
                stats.tokenTransferIn++;
            }
            // 新增交易所地址统计
            if (isExchangeAddress(holder)) {
                stats.exchangeAddresses++;
            }
        });

        // 缓存计算结果
        dataCache.lastDataHash = currentHash;
        dataCache.calculatedStats = stats;
        dataCache.filteredResults.clear(); // 清空过滤缓存
        console.log('[性能优化] 统计数据已缓存');

        return stats;
    }

    // 1. 持久化容器监听
    const observer = new MutationObserver(() => {
        const targetContainer = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden.scroll-smooth.w-full');
        if (targetContainer && !targetContainer.querySelector('#statistic-gmgn-stats-item')) {
            injectStatsItem(targetContainer);
        }
    });

    function injectStatsItem(container) {
        if (container.querySelector('#statistic-gmgn-stats-item')) return;

        const isSol = isSolNetwork();
        const statsItem = document.createElement('div');
        statsItem.id = 'statistic-gmgn-stats-item';
        statsItem.className = 'statistic-gmgn-stats-container';

        const headerClass = isSol ? 'statistic-gmgn-stats-header sol-network' : 'statistic-gmgn-stats-header';
        const dataClass = isSol ? 'statistic-gmgn-stats-data sol-network' : 'statistic-gmgn-stats-data';

        statsItem.innerHTML = `
        <div class="${headerClass}">
    <span title="持有代币且未卖出任何数量的地址（排除转移代币卖出的地址）">满仓</span>
    <span title="当前持仓价值高于买入成本的地址">盈利</span>
    <span title="当前持仓价值低于买入成本的地址">亏损</span>
    <span title="过去24小时内有交易活动的地址">活跃</span>
    <span title="长期持有且很少卖出的地址">钻石</span>
    <span title="新钱包">新址</span>
    <span title="持仓时间小于7天的地址">7天</span>
    <span title="盈利超过5倍的地址">5X</span>
    <span title="标记为可疑或异常行为的地址">可疑</span>
    <span title="有代币转入记录的地址">转入</span>
    <span title="与交易所相关的地址">交易所</span>
    ${isSol ? '<span title="SOL餘額小於1的地址">低SOL</span>' : ''}
    <span title="下载统计数据图片">图片</span>
        </div>
        <div class="${dataClass}">
            <span id="fullPosition">-</span>
            <span id="profitable">-</span>
            <span id="losing">-</span>
            <span id="active24h">-</span>
            <span id="diamondHands">-</span>
            <span id="newAddress">-</span>
            <span id="holdingLessThan7Days">-</span>
            <span id="highProfit">-</span>
            <span id="suspicious">-</span>
            <span id="tokenTransferIn">-</span>
            <span id="exchangeAddresses">-</span>
            ${isSol ? '<span id="lowSolBalance">-</span>' : ''}
            <span id="statistic-download-image-btn" class="statistic-download-btn clickable" title="下载统计数据图片">下载</span>
        </div>
    `;
        container.insertAdjacentElement('afterbegin', statsItem);
    }

    function updateStatsDisplayInternal(currentStats, forceNoArrows) {
        if (!currentStats) return;

        // 确保DOM已存在
        if (!document.getElementById('statistic-gmgn-stats-item')) {
            injectStatsItem();
        }

        // 优化的事件监听器绑定（只绑定一次）
        if (!dataCache.eventsInitialized) {
            console.log('[性能优化] 初始化事件监听器');
            const baseClickableTypes = ['fullPosition', 'profitable', 'losing', 'active24h', 'diamondHands', 'newAddress', 'holdingLessThan7Days', 'highProfit', 'suspicious', 'tokenTransferIn', 'exchangeAddresses'];
            const clickableTypes = isSolNetwork() ? [...baseClickableTypes, 'lowSolBalance'] : baseClickableTypes;

            clickableTypes.forEach(id => {
                const element = document.getElementById(id);
                if (element && !element.hasAttribute('data-event-bound')) {
                    element.classList.add('clickable');
                    element.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const addresses = getAddressByType(id);

                        // 交易所地址使用专用弹框
                        if (id === 'exchangeAddresses') {
                            createExchangeModal(addresses, currentCaAddress);
                        } else {
                            const title = getTypeTitle(id);
                            const showSolBalance = id === 'lowSolBalance';
                            createModal(title, addresses, currentCaAddress, showSolBalance);
                        }
                    };
                    element.setAttribute('data-event-bound', 'true');
                    console.log('[性能优化] 事件监听器已绑定:', id);
                }
            });
            dataCache.eventsInitialized = true;
        }

        const updateStatElement = (id, value, hasChanged, isIncrease) => {
            const element = document.getElementById(id);
            if (!element) return;

            element.innerHTML = `<strong style="color: ${id === 'profitable' ? '#2E8B57' :
            (id === 'losing' || id === 'suspicious' ? '#FF1493' :
             id === 'holdingLessThan7Days' ? '#00E5EE' :
             id === 'lowSolBalance' ? '#FFA500' : '#e9ecef')}">${value}</strong>`;

            // 只有当不是强制不显示箭头且确实有变化时才显示箭头
            if (!forceNoArrows && hasChanged) {
                const arrow = document.createElement('span');
                arrow.className = isIncrease ? 'statistic-up-arrow' : 'statistic-down-arrow';
                arrow.textContent = isIncrease ? '▲' : '▼';

                // 移除旧的箭头（如果有）
                const oldArrow = element.querySelector('.statistic-up-arrow, .statistic-down-arrow');
                if (oldArrow) oldArrow.remove();

                element.appendChild(arrow);
            } else {
                // 没有变化或强制不显示箭头，移除箭头（如果有）
                const oldArrow = element.querySelector('.statistic-up-arrow, .statistic-down-arrow');
                if (oldArrow) oldArrow.remove();
            }

            // 事件监听器已在初始化时绑定，无需重复绑定
        };

        // 绑定下载图片按钮事件
        const downloadBtn = document.getElementById('statistic-download-image-btn');
        if (downloadBtn && !downloadBtn.hasAttribute('data-event-bound')) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 检查是否正在处理中
                if (isDownloadInProgress) {
                    console.log('下载正在进行中，请稍候...');
                    return;
                }

                handleDownloadImage();
            });
            downloadBtn.setAttribute('data-event-bound', 'true');
        }
        // 更新各个统计指标
            // 新增7天持仓统计更新
        updateStatElement('holdingLessThan7Days', currentStats.holdingLessThan7Days,
                          initialStats && currentStats.holdingLessThan7Days !== initialStats.holdingLessThan7Days,
                          initialStats && currentStats.holdingLessThan7Days > initialStats.holdingLessThan7Days);

        updateStatElement('fullPosition', currentStats.fullPosition,
                          initialStats && currentStats.fullPosition !== initialStats.fullPosition,
                          initialStats && currentStats.fullPosition > initialStats.fullPosition);

        updateStatElement('profitable', currentStats.profitable,
                          initialStats && currentStats.profitable !== initialStats.profitable,
                          initialStats && currentStats.profitable > initialStats.profitable);
        updateStatElement('losing', currentStats.losing,
                          currentStats.losing !== initialStats.losing,
                          currentStats.losing > initialStats.losing);

        updateStatElement('active24h', currentStats.active24h,
                          currentStats.active24h !== initialStats.active24h,
                          currentStats.active24h > initialStats.active24h);

        updateStatElement('diamondHands', currentStats.diamondHands,
                          currentStats.diamondHands !== initialStats.diamondHands,
                          currentStats.diamondHands > initialStats.diamondHands);

        updateStatElement('newAddress', currentStats.newAddress,
                          currentStats.newAddress !== initialStats.newAddress,
                          currentStats.newAddress > initialStats.newAddress);

        updateStatElement('highProfit', currentStats.highProfit,
                          currentStats.highProfit !== initialStats.highProfit,
                          currentStats.highProfit > initialStats.highProfit);

        updateStatElement('suspicious', currentStats.suspicious,
                          currentStats.suspicious !== initialStats.suspicious,
                          currentStats.suspicious > initialStats.suspicious);

        updateStatElement('tokenTransferIn', currentStats.tokenTransferIn,
                          initialStats && currentStats.tokenTransferIn !== initialStats.tokenTransferIn,
                          initialStats && currentStats.tokenTransferIn > initialStats.tokenTransferIn);

        updateStatElement('exchangeAddresses', currentStats.exchangeAddresses,
                          initialStats && currentStats.exchangeAddresses !== initialStats.exchangeAddresses,
                          initialStats && currentStats.exchangeAddresses > initialStats.exchangeAddresses);

        // 只在SOL网络时更新低SOL余额统计
        if (isSolNetwork()) {
            updateStatElement('lowSolBalance', currentStats.lowSolBalance,
                              initialStats && currentStats.lowSolBalance !== initialStats.lowSolBalance,
                              initialStats && currentStats.lowSolBalance > initialStats.lowSolBalance);
        }
    }

    // 防抖版本的updateStatsDisplay
    const updateStatsDisplay = debounce(updateStatsDisplayInternal, 200);

    // 数据收集函数 - 收集基础统计数据和详细持有者信息
    function collectStatsData() {
        if (!interceptedData?.data?.list || !currentCaAddress) {
            console.error('数据不完整，无法生成图片');
            return null;
        }

        const currentStats = calculateStats();
        if (!currentStats) {
            console.error('无法计算统计数据');
            return null;
        }

        // 基础统计数据
        const basicStats = {
            fullPosition: { label: '满仓', value: currentStats.fullPosition, type: 'fullPosition' },
            profitable: { label: '盈利', value: currentStats.profitable, type: 'profitable' },
            losing: { label: '亏损', value: currentStats.losing, type: 'losing' },
            active24h: { label: '活跃', value: currentStats.active24h, type: 'active24h' },
            diamondHands: { label: '钻石', value: currentStats.diamondHands, type: 'diamondHands' },
            newAddress: { label: '新址', value: currentStats.newAddress, type: 'newAddress' },
            holdingLessThan7Days: { label: '7天', value: currentStats.holdingLessThan7Days, type: 'holdingLessThan7Days' },
            highProfit: { label: '5X', value: currentStats.highProfit, type: 'highProfit' },
            suspicious: { label: '可疑', value: currentStats.suspicious, type: 'suspicious' },
            tokenTransferIn: { label: '转入', value: currentStats.tokenTransferIn, type: 'tokenTransferIn' },
            exchangeAddresses: { label: '交易所', value: currentStats.exchangeAddresses, type: 'exchangeAddresses' }
        };

        // 如果是SOL网络，添加低余额统计
        if (isSolNetwork()) {
            basicStats.lowSolBalance = { label: '低SOL', value: currentStats.lowSolBalance, type: 'lowSolBalance' };
        }

        // 收集每个统计类型的汇总数据（包括值为0的项目）
        const detailedData = {};
        for (const [key, stat] of Object.entries(basicStats)) {
            const addresses = getAddressByType(stat.type);
            if (addresses && addresses.length > 0) {
                // 计算汇总信息
                const soldChipsCount = addresses.filter(holder => (holder.sell_amount_percentage || 0) > 0).length;
                const totalHoldingPercentage = addresses.reduce((sum, holder) => sum + (holder.amount_percentage || 0), 0);

                detailedData[key] = {
                    label: stat.label,
                    totalCount: addresses.length,
                    soldChipsCount: soldChipsCount,
                    totalHoldingPercentage: (totalHoldingPercentage * 100).toFixed(2) + '%'
                };
            } else {
                // 即使没有地址数据，也创建空的详细数据
                detailedData[key] = {
                    label: stat.label,
                    totalCount: 0,
                    soldChipsCount: 0,
                    totalHoldingPercentage: '0.00%'
                };
            }
        }

        return {
            caAddress: currentCaAddress,
            timestamp: new Date(),
            basicStats: basicStats,
            detailedData: detailedData
        };
    }

    // 绘制圆角矩形辅助函数
    function drawRoundedRect(ctx, x, y, width, height, radius, strokeColor = null, strokeWidth = 0, fillOnly = false) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();

        if (!fillOnly) {
            ctx.fill();
        }

        if (strokeColor && strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
    }

    // 图片生成函数 - 现代化风格
    function generateStatsImage(data) {
        if (!data) {
            console.error('无数据可生成图片');
            return null;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸 - 现代化尺寸
        canvas.width = 1200;
        canvas.height = 1400; // 增加高度以适应现代化布局

        // 创建现代渐变背景
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#0f172a');
        bgGradient.addColorStop(0.3, '#1e293b');
        bgGradient.addColorStop(0.7, '#334155');
        bgGradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制现代化圆角边框
        const borderRadius = 20;
        const borderPadding = 30;
        drawRoundedRect(ctx, borderPadding, borderPadding,
                       canvas.width - borderPadding * 2, canvas.height - borderPadding * 2,
                       borderRadius, '#3b82f6', 3);

        // 绘制标题区域背景
        const titleBg = ctx.createLinearGradient(0, 50, 0, 150);
        titleBg.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        titleBg.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
        ctx.fillStyle = titleBg;
        drawRoundedRect(ctx, 60, 60, canvas.width - 120, 120, 15);

        // 绘制现代化标题
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        const title = 'GMGN 前排统计分析';
        ctx.fillText(title, canvas.width / 2, 110);

        // 清除阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 绘制CA地址和时间 - 现代化样式
        ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#22d3ee';
        const formatTime = data.timestamp.getFullYear() +
            '-' + String(data.timestamp.getMonth() + 1).padStart(2, '0') +
            '-' + String(data.timestamp.getDate()).padStart(2, '0') +
            ' ' + String(data.timestamp.getHours()).padStart(2, '0') +
            ':' + String(data.timestamp.getMinutes()).padStart(2, '0') +
            ':' + String(data.timestamp.getSeconds()).padStart(2, '0');
        ctx.fillText(`CA: ${data.caAddress}`, canvas.width / 2, 140);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`时间: ${formatTime}`, canvas.width / 2, 165);

        // 绘制基础统计数据（第一层）- 现代化风格
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('基础统计数据', 80, 220);

        let yPos = 260;
        const statsPerRow = 3; // 每行3个
        const statWidth = 350; // 增加宽度适应现代化布局
        const statHeight = 90; // 增加高度
        let currentRow = 0;
        let currentCol = 0;
        const baseX = 80; // 左侧边距

        for (const [key, stat] of Object.entries(data.basicStats)) {
            const x = baseX + currentCol * statWidth;
            const y = yPos + currentRow * statHeight;

            // 绘制现代化卡片背景渐变
            const cardGradient = ctx.createLinearGradient(x, y, x, y + statHeight - 15);
            cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            cardGradient.addColorStop(1, 'rgba(59, 130, 246, 0.12)');
            ctx.fillStyle = cardGradient;
            drawRoundedRect(ctx, x, y, statWidth - 30, statHeight - 15, 12);

            // 绘制现代化边框
            drawRoundedRect(ctx, x, y, statWidth - 30, statHeight - 15, 12, '#3b82f6', 2, true);

            // 绘制标签 - 现代化字体
            ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, x + 20, y + 30);

            // 绘制数值 - 现代化颜色和字体
            ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            const valueColor = key === 'profitable' ? '#22c55e' :
                              (key === 'losing' || key === 'suspicious' ? '#ef4444' :
                               key === 'holdingLessThan7Days' ? '#06b6d4' :
                               key === 'lowSolBalance' ? '#f59e0b' : '#22d3ee');
            ctx.fillStyle = valueColor;
            ctx.fillText(stat.value.toString(), x + 20, y + 65);

            currentCol++;
            if (currentCol >= statsPerRow) {
                currentCol = 0;
                currentRow++;
            }
        }

        // 绘制详细数据（第二层）- 现代化风格
        yPos = 180 + (Math.ceil(Object.keys(data.basicStats).length / statsPerRow) + 1) * statHeight + 50;

        // 绘制详细分析标题
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('详细数据分析', 80, yPos);

        yPos += 40;

        // 使用现代化网格布局绘制详细数据分析
        const detailStatsPerRow = 3; // 每行3个详细数据单元格
        const detailStatWidth = 350; // 与基础统计保持一致
        const detailStatHeight = 130; // 增加高度以适应现代化布局
        let detailCurrentRow = 0;
        let detailCurrentCol = 0;

        for (const [key, detail] of Object.entries(data.detailedData)) {
            if (yPos + detailCurrentRow * detailStatHeight > canvas.height - 150) break; // 防止超出画布

            const x = baseX + detailCurrentCol * detailStatWidth; // 与基础数据对齐
            const y = yPos + detailCurrentRow * detailStatHeight;

            // 绘制现代化卡片背景渐变
            const detailCardGradient = ctx.createLinearGradient(x, y, x, y + detailStatHeight - 15);
            detailCardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
            detailCardGradient.addColorStop(1, 'rgba(16, 185, 129, 0.08)');
            ctx.fillStyle = detailCardGradient;
            drawRoundedRect(ctx, x, y, detailStatWidth - 30, detailStatHeight - 15, 12);

            // 绘制现代化边框
            drawRoundedRect(ctx, x, y, detailStatWidth - 30, detailStatHeight - 15, 12, '#10b981', 2, true);

            // 绘制分类标题 - 现代化样式
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            const titleColor = key === 'profitable' ? '#22c55e' :
                              (key === 'losing' || key === 'suspicious' ? '#ef4444' :
                               key === 'holdingLessThan7Days' ? '#06b6d4' :
                               key === 'lowSolBalance' ? '#f59e0b' : '#22d3ee');
            ctx.fillStyle = titleColor;
            ctx.textAlign = 'left';
            ctx.fillText(`${detail.label}`, x + 20, y + 30);

            // 绘制汇总数据 - 现代化样式
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

            // 已卖筹码数
            ctx.fillText('已卖筹码数:', x + 20, y + 55);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = detail.soldChipsCount > 0 ? '#ef4444' : '#22c55e';
            ctx.fillText(detail.soldChipsCount.toString(), x + 150, y + 55);

            // 总地址数
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('总地址数:', x + 20, y + 80);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = titleColor; // 使用与标题相同的颜色
            ctx.fillText(detail.totalCount.toString(), x + 150, y + 80);

            // 持仓占比
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('持仓占比:', x + 20, y + 105);
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#60a5fa';
            ctx.fillText(detail.totalHoldingPercentage, x + 150, y + 105);

            detailCurrentCol++;
            if (detailCurrentCol >= detailStatsPerRow) {
                detailCurrentCol = 0;
                detailCurrentRow++;
            }
        }

        return canvas;
    }

    // 下载图片函数
    function downloadImage(canvas, filename) {
        if (!canvas) {
            console.error('无法下载图片：画布为空');
            return;
        }

        try {
            // 转换为blob
            canvas.toBlob(function(blob) {
                // 创建下载链接
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;

                // 触发下载
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 清理URL对象
                URL.revokeObjectURL(url);

                console.log('图片下载成功:', filename);
            }, 'image/png');
        } catch (error) {
            console.error('下载图片失败:', error);
        }
    }

    // 显示图片预览模态框
    function showImagePreview(canvas, filename) {
        const modal = document.createElement('div');
        modal.className = 'image-preview-modal';

        const imageUrl = canvas.toDataURL('image/png');

        modal.innerHTML = `
            <div class="image-preview-content">
                <div class="image-preview-header">
                    <div class="image-preview-title">📷 统计图片预览</div>
                    <button class="image-preview-close">&times;</button>
                </div>
                <img src="${imageUrl}" alt="统计图片" class="image-preview-img">
                <div class="image-preview-buttons">
                    <button class="image-preview-btn copy-btn">📋 复制图片</button>
                    <button class="image-preview-btn download-btn">💾 下载图片</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        const closeBtn = modal.querySelector('.image-preview-close');
        const copyBtn = modal.querySelector('.copy-btn');
        const downloadBtn = modal.querySelector('.download-btn');

        // 关闭模态框
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 复制图片
        copyBtn.addEventListener('click', () => {
            copyImageToClipboard(canvas);
        });

        // 下载图片
        downloadBtn.addEventListener('click', () => {
            downloadImageFromPreview(canvas, filename);
            closeModal();
        });

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // 复制图片到剪贴板
    async function copyImageToClipboard(canvas) {
        try {
            // 将canvas转为blob
            canvas.toBlob(async (blob) => {
                try {
                    if (navigator.clipboard && window.ClipboardItem) {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        showModernToast('图片已复制到剪贴板！', 'success');
                    } else {
                        // 兜底方案：创建临时图片元素让用户手动复制
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL('image/png');
                        img.style.position = 'fixed';
                        img.style.top = '-9999px';
                        document.body.appendChild(img);

                        // 选择图片
                        const range = document.createRange();
                        range.selectNode(img);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);

                        // 尝试复制
                        const success = document.execCommand('copy');
                        document.body.removeChild(img);
                        window.getSelection().removeAllRanges();

                        if (success) {
                            showModernToast('图片已复制到剪贴板！', 'success');
                        } else {
                            showModernToast('复制失败，请尝试手动下载图片', 'error');
                        }
                    }
                } catch (error) {
                    console.error('复制图片失败:', error);
                    showModernToast('复制失败：' + error.message, 'error');
                }
            }, 'image/png');
        } catch (error) {
            console.error('复制图片失败:', error);
            showModernToast('复制失败：' + error.message, 'error');
        }
    }

    // 从预览下载图片
    function downloadImageFromPreview(canvas, filename) {
        try {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
                showModernToast('图片下载成功！', 'success');
            }, 'image/png');
        } catch (error) {
            console.error('下载图片失败:', error);
            showModernToast('下载失败：' + error.message, 'error');
        }
    }

    // 重置按钮状态
    function resetDownloadButtonState() {
        isDownloadInProgress = false;
        const button = document.getElementById('statistic-download-image-btn');
        if (button) {
            button.classList.remove('disabled');
            button.textContent = '下载';
        }
    }

    // 设置按钮禁用状态
    function setDownloadButtonDisabled(disabled) {
        const button = document.getElementById('statistic-download-image-btn');
        if (button) {
            if (disabled) {
                button.classList.add('disabled');
                button.textContent = '生成中...';
            } else {
                button.classList.remove('disabled');
                button.textContent = '下载';
            }
        }
    }

    // 主要的下载处理函数 - 现在显示预览而不是直接下载
    function handleDownloadImage() {
        const button = document.getElementById('statistic-download-image-btn');
        if (!button) return;

        // 检查是否已在处理中
        if (isDownloadInProgress) {
            console.log('图片生成正在进行中...');
            return;
        }

        // 设置处理状态
        isDownloadInProgress = true;
        setDownloadButtonDisabled(true);

        try {
            // 收集数据
            const data = collectStatsData();
            if (!data) {
                throw new Error('无法收集数据');
            }

            // 更新当前CA地址
            currentCAAddress = data.caAddress || '';

            // 生成图片
            const canvas = generateStatsImage(data);
            if (!canvas) {
                throw new Error('无法生成图片');
            }

            // 生成文件名
            const timestamp = data.timestamp.getFullYear() +
                String(data.timestamp.getMonth() + 1).padStart(2, '0') +
                String(data.timestamp.getDate()).padStart(2, '0') +
                String(data.timestamp.getHours()).padStart(2, '0');
            const filename = `${data.caAddress}_${timestamp}.png`;

            // 显示预览而不是直接下载
            showImagePreview(canvas, filename);

        } catch (error) {
            console.error('生成图片失败:', error);
            showModernToast('生成图片失败：' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            isDownloadInProgress = false;
            setDownloadButtonDisabled(false);
        }
    }

    // 4. 初始化
    if (document.readyState === 'complete') {
        startObserving();
    } else {
        window.addEventListener('DOMContentLoaded', startObserving);
    }

    function startObserving() {
        // 立即检查一次
        const initialContainer = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden.scroll-smooth.w-full');
        if (initialContainer) injectStatsItem(initialContainer);

        // 持续监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
})();