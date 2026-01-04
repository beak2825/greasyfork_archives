// ==UserScript==
// @name         linux.do 等级监控浮窗
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  进入 linux.do 没有登录注册按钮时，右侧显示等级浮窗，支持0-3级用户
// @author       你的名字
// @match        https://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      connect.linux.do
// @connect      linux.do
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540405/linuxdo%20%E7%AD%89%E7%BA%A7%E7%9B%91%E6%8E%A7%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540405/linuxdo%20%E7%AD%89%E7%BA%A7%E7%9B%91%E6%8E%A7%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储数据的键名
    const STORAGE_KEY = 'linux_do_user_trust_level_data_v3';
    const LAST_CHECK_KEY = 'linux_do_last_check_v3';
    const LAST_USER_KEY = 'linux_do_last_user_v3'; // 新增：存储上次的用户名
    
    // 0级和1级用户的升级要求
    const LEVEL_REQUIREMENTS = {
        0: { // 0级升1级
            topics_entered: 5,
            posts_read_count: 30,
            time_read: 600 // 10分钟 = 600秒
        },
        1: { // 1级升2级
            days_visited: 15,
            likes_given: 1,
            likes_received: 1,
            post_count: 3, // 修改：使用 post_count 替代 replies_to_different_topics
            topics_entered: 20,
            posts_read_count: 100,
            time_read: 3600 // 60分钟 = 3600秒
        }
    };
    
    // 直接在页面上添加调试浮窗
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '10px';
    debugDiv.style.right = '10px';
    debugDiv.style.width = '300px';
    debugDiv.style.maxHeight = '200px';
    debugDiv.style.overflow = 'auto';
    debugDiv.style.background = 'rgba(0,0,0,0.8)';
    debugDiv.style.color = '#0f0';
    debugDiv.style.padding = '10px';
    debugDiv.style.borderRadius = '5px';
    debugDiv.style.zIndex = '10000';
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.style.fontSize = '12px';
    debugDiv.style.display = 'none'; // 默认隐藏
    document.body.appendChild(debugDiv);
    
    // 调试函数
    function debugLog(message) {
        const time = new Date().toLocaleTimeString();
        console.log(`[Linux.do脚本] ${message}`);
        GM_log(`[Linux.do脚本] ${message}`);
        
        const logLine = document.createElement('div');
        logLine.textContent = `${time}: ${message}`;
        debugDiv.appendChild(logLine);
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
    
    // 按Alt+D显示/隐藏调试窗口
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'd') {
            debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    debugLog('脚本开始执行');
    
    // 添加全局样式 - 全新设计
    GM_addStyle(`
        /* 新的悬浮按钮样式 */
        .ld-floating-container {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .ld-floating-btn {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e7eb;
            border-radius: 8px 0 0 8px;
            border-right: none;
            transition: all 0.3s ease;
            cursor: pointer;
            width: 48px;
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            user-select: none;
        }

        .ld-floating-btn:hover {
            width: 64px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .ld-btn-icon {
            width: 16px;
            height: 16px;
            color: #6b7280;
        }

        .ld-btn-level {
            font-size: 12px;
            font-weight: bold;
            color: #ea580c;
        }

        .ld-btn-progress-bar {
            width: 32px;
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
        }

        .ld-btn-progress-fill {
            height: 100%;
            background: #ea580c;
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .ld-btn-stats {
            font-size: 10px;
            color: #6b7280;
        }

        .ld-btn-chevron {
            width: 12px;
            height: 12px;
            color: #9ca3af;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .ld-floating-btn:hover .ld-btn-chevron {
            opacity: 1;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* 弹出窗口样式 */
        .ld-popup {
            position: absolute;
            top: 50%;
            right: 100%;
            margin-right: 8px;
            width: 384px;
            max-height: calc(100vh - 40px); /* 修改：使其能利用更多垂直空间，并预留边距 */
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e5e7eb;
            opacity: 0;
            transform: translate(20px, -50%);
            transition: all 0.2s ease;
            pointer-events: none;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .ld-popup.show {
            opacity: 1;
            transform: translate(0, -50%);
            pointer-events: auto;
        }

        /* Header 样式 */
        .ld-popup-header {
            padding: 16px;
            border-bottom: 1px solid #f3f4f6;
        }

        .ld-header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .ld-user-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ld-user-dot {
            width: 12px;
            height: 12px;
            background: #ea580c;
            border-radius: 50%;
        }

        .ld-user-name {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }

        .ld-level-badge {
            font-size: 12px;
            background: #fed7aa;
            color: #c2410c;
            padding: 4px 8px;
            border-radius: 9999px;
        }

        .ld-progress-section {
            margin-top: 12px;
        }

        .ld-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .ld-progress-label {
            font-size: 12px;
            color: #6b7280;
        }

        .ld-progress-stats {
            font-size: 12px;
            color: #4b5563;
        }

        .ld-progress-bar-container {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
        }

        .ld-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #fb923c, #ea580c);
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        /* 快速状态卡片 */
        .ld-status-cards {
            padding: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .ld-status-card {
            border-radius: 8px;
            padding: 8px;
        }

        .ld-status-card.failed {
            background: #fef2f2;
        }

        .ld-status-card.passed {
            background: #f0fdf4;
        }

        .ld-card-header {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 4px;
        }

        .ld-card-icon {
            width: 12px;
            height: 12px;
        }

        .ld-card-header.failed {
            color: #dc2626;
        }

        .ld-card-header.passed {
            color: #16a34a;
        }

        .ld-card-title {
            font-size: 12px;
            font-weight: 500;
        }

        .ld-card-label {
            font-size: 12px;
            color: #4b5563;
        }

        .ld-card-value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
        }

        .ld-card-subtitle {
            font-size: 12px;
            margin-top: 2px;
        }

        .ld-card-subtitle.failed {
            color: #dc2626;
        }

        .ld-card-subtitle.passed {
            color: #16a34a;
        }

        /* 详细列表 */
        .ld-details-section {
            border-top: 1px solid #f3f4f6;
        }

        .ld-details-list {
            padding: 12px;
        }

        .ld-detail-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 8px;
            border-radius: 6px;
            transition: background 0.2s ease;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            margin: 2px 0;
        }

        .ld-detail-item:hover {
            background: #f9fafb;
            transform: translateX(2px);
        }

        .ld-detail-left {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            min-width: 0;
        }

        .ld-detail-icon {
            width: 12px;
            height: 12px;
            color: #9ca3af;
            flex-shrink: 0;
        }

        .ld-detail-label {
            font-size: 12px;
            color: #4b5563;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ld-detail-right {
            display: flex;
            align-items: center;
            gap: 0px;
            flex-shrink: 0;
            min-width: 140px;
            justify-content: flex-end;
        }

        .ld-detail-current {
            font-size: 12px;
            font-weight: 500;
            color: #1f2937;
            text-align: right;
            min-width: 40px;
            margin-right: 0; /* 确保没有右边距 */
            padding-right: 0; /* 确保没有右内边距 */
        }

        .ld-detail-target {
            font-size: 12px;
            color: #9ca3af;
            text-align: left; /* 保留之前的修改 */
            /* min-width: 50px; */ /*  移除这一行 */
            margin-left: 0; /* 确保没有左边距 */
            padding-left: 0; /* 确保没有左内边距 */
        }

        .ld-detail-status {
            width: 12px;
            height: 12px;
            margin-left: 8px; /* 这个保持，因为它是图标与数值/目标块的间距 */
        }

        .ld-detail-status.passed {
            color: #16a34a;
        }

        .ld-detail-status.failed {
            color: #dc2626;
        }

        /* Footer */
        .ld-popup-footer {
            padding: 12px;
            background: #f9fafb;
            border-top: 1px solid #f3f4f6;
            text-align: center;
        }

        .ld-footer-message {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .ld-footer-message.failed {
            color: #dc2626;
        }

        .ld-footer-message.passed {
            color: #16a34a;
        }

        .ld-footer-time {
            font-size: 12px;
            color: #6b7280;
        }

        /* 刷新按钮 */
        .ld-reload-btn {
            display: block;
            padding: 8px;
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 12px;
        }

        .ld-reload-btn:hover {
            background: #e5e7eb;
        }

        .ld-reload-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 错误状态 */
        .ld-error-container {
            padding: 24px;
            text-align: center;
            color: #6b7280;
        }

        .ld-error-icon {
            font-size: 24px;
            color: #dc2626;
            margin-bottom: 12px;
        }

        .ld-error-title {
            font-weight: 500;
            margin-bottom: 8px;
            color: #dc2626;
            font-size: 14px;
        }

        .ld-error-message {
            margin-bottom: 16px;
            font-size: 12px;
            line-height: 1.5;
        }

        /* 隐藏的iframe */
        .ld-hidden-iframe {
            position: absolute;
            width: 0;
            height: 0;
            border: 0;
            visibility: hidden;
        }

        /* 响应式调整 */
        @media (max-height: 600px) {
            .ld-details-list {
                max-height: 200px;
            }
        }

        /* 庆祝版本详情滚动区域样式 */
        .ld-celebration-details .ld-scroll-area {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.3s ease;
            max-height: 300px; /* 尝试移除 !important */
            overflow-y: auto;   /* 尝试移除 !important */
            /* pointer-events: auto !important; 暂时注释掉，看是否是父级引起的 */
        }

        .ld-celebration-details .ld-scroll-area:hover {
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .ld-celebration-details .ld-scroll-area::-webkit-scrollbar {
            width: 6px;
        }

        .ld-celebration-details .ld-scroll-area::-webkit-scrollbar-track {
            background: transparent;
        }

        .ld-celebration-details .ld-scroll-area::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 3px;
            transition: background 0.3s ease;
        }

        .ld-celebration-details .ld-scroll-area:hover::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
        }

        .ld-celebration-details .ld-scroll-area::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.7);
        }

        /* 确保庆祝模式下的详情列表可以滚动 - 这个规则与上面的 .ld-scroll-area 重复，因为 ld-scroll-area 加在了 ld-details-list 上 */
        /* .ld-celebration-details .ld-details-list {
            max-height: 300px !important;
            overflow-y: auto !important;
            pointer-events: auto !important;
        } */

        /* 庆祝样式 - 为达标用户设计 */
        .ld-celebration-container {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ld-celebration-border {
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, #f59e0b, #8b5cf6, #ec4899, #f59e0b);
            opacity: 0.2;
            border-radius: 12px;
            animation: borderRotate 6s linear infinite;
            background-size: 200% 200%;
            pointer-events: none; /* 添加此行以允许鼠标事件穿透 */
        }

        .ld-celebration-header {
            background: linear-gradient(135deg, #fef3c7, #e0e7ff, #fce7f3);
            position: relative;
        }

        .ld-celebration-icon {
            position: relative;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
            margin: 0 auto 12px;
            animation: iconBounce 3s ease-in-out infinite;
        }

        .ld-celebration-ring {
            position: absolute;
            inset: 0;
            border: 4px solid #fbbf24;
            border-radius: 50%;
            opacity: 0.6;
            animation: ringRotate 4s linear infinite;
        }

        .ld-celebration-ring-outer {
            position: absolute;
            inset: -8px;
            border: 2px solid #a855f7;
            border-radius: 50%;
            animation: outerRingPulse 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .ld-sparkle {
            position: absolute;
            font-size: 14px;
            animation-duration: 3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            opacity: 0.8;
        }

        .ld-sparkle-1 {
            top: -12px;
            left: -12px;
            color: #f59e0b;
            animation-name: sparkleFloat1;
            animation-delay: 0s;
        }

        .ld-sparkle-2 {
            top: -8px;
            right: -16px;
            color: #ec4899;
            font-size: 12px;
            animation-name: sparkleFloat2;
            animation-delay: 0.75s;
        }

        .ld-sparkle-3 {
            bottom: -12px;
            right: -8px;
            color: #8b5cf6;
            animation-name: sparkleFloat3;
            animation-delay: 1.5s;
        }

        .ld-sparkle-4 {
            bottom: -8px;
            left: -16px;
            color: #3b82f6;
            font-size: 12px;
            animation-name: sparkleFloat4;
            animation-delay: 2.25s;
        }

        .ld-celebration-title {
            font-size: 18px;
            font-weight: bold;
            color: #065f46;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .ld-celebration-subtitle {
            font-size: 14px;
            color: #059669;
            margin-bottom: 8px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .ld-celebration-message {
            font-size: 12px;
            color: #6b7280;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .ld-perfect-progress {
            background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
            background-size: 200% 200%;
            animation: progressShine 4s ease-in-out infinite;
            box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
        }

        .ld-celebration-expanded {
            background: linear-gradient(135deg, #f0f9ff, #fef3c7, #fce7f3);
            border-top: 1px solid #e5e7eb;
        }

        .ld-celebration-item {
            background: linear-gradient(90deg, #f0fdf4, #ecfdf5);
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid rgba(16, 185, 129, 0.1);
            margin: 2px 0;
            width: 100% !important;
            box-sizing: border-box;
            cursor: pointer !important;
        }

        .ld-celebration-item:hover {
            background: linear-gradient(90deg, #dcfce7, #bbf7d0);
            transform: translateX(2px);
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.2);
        }

        /* 庆祝模式下的详情项目 - 只禁用内部文本选择，保留滚动和点击 */
        .ld-celebration-item * {
            user-select: none;
        }

        /* --- NEW CSS RULES TO FIX HOVER AREA --- */
        .ld-celebration-item .ld-detail-label,
        .ld-celebration-item .ld-detail-current,
        .ld-celebration-item .ld-detail-target,
        .ld-celebration-item .ld-detail-icon { /* 左侧的图标 */
            pointer-events: none; /* 使这些元素对鼠标事件透明 */
        }

        .ld-celebration-item .ld-detail-status { /* 打勾图标 */
            pointer-events: auto; /* 保持其原有的可交互性 (它目前能触发滚动条) */
        }

        .ld-celebration-item {
            pointer-events: auto; /* 确保列表项本身可以接收穿透的事件 */
        }
        /* --- END OF NEW CSS RULES --- */

        /* 确保庆祝模式下所有交互都正常 */
        /* 尝试移除这些全局的 pointer-events 覆盖，它们可能导致意外行为 */
        /* .ld-celebration-container {
            pointer-events: auto !important;
        }

        .ld-celebration-container * {
            pointer-events: auto !important;
        } */

        /* 确保滚动区域可以正常工作 */
        .ld-celebration-details { /* 这个容器需要允许其子元素接收事件 */
            pointer-events: auto; /* !important 可能不需要 */
        }

        .ld-celebration-details .ld-scroll-area { /* 滚动区域本身需要能接收事件才能滚动 */
            pointer-events: auto; /* !important 可能不需要 */
            /* overflow-y: auto !important; 这条已在上面设置 */
        }

        /* .ld-celebration-details .ld-details-list {
            pointer-events: auto !important;
            overflow-y: auto !important;
        } */

        /* 确保按钮可以点击 */
        .ld-reload-btn {
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 10001 !important;
        }

        .ld-toggle-btn {
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 10001 !important;
        }

        .ld-celebration-status {
            color: #10b981;
            position: relative;
        }

        .ld-celebration-status::after {
            content: '';
            position: absolute;
            inset: 0;
            background: #10b981;
            border-radius: 50%;
            opacity: 0.2;
            animation: statusPing 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .ld-celebration-footer {
            background: linear-gradient(135deg, #e0e7ff, #fce7f3, #fef3c7);
            text-align: center;
        }

        .ld-celebration-footer-title {
            font-size: 12px;
            font-weight: bold;
            color: #7c3aed;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            margin-bottom: 4px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .ld-celebration-footer-subtitle {
            font-size: 12px;
            color: #6b7280;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .ld-toggle-btn {
            background: linear-gradient(45deg, #8b5cf6, #ec4899);
            border: none;
            color: white;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 6px 12px;
            border-radius: 999px;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .ld-toggle-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
        }

        /* 减弱的动画关键帧 */
        @keyframes celebrationPulse {
            0%, 100% { 
                opacity: 0.3; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.4; 
                transform: scale(1.01);
            }
        }

        @keyframes borderRotate {
            0% { 
                background-position: 0% 50%;
            }
            50% { 
                background-position: 100% 50%;
            }
            100% { 
                background-position: 0% 50%;
            }
        }

        @keyframes iconBounce {
            0%, 100% { 
                transform: translateY(0px) scale(1);
            }
            50% { 
                transform: translateY(-4px) scale(1.02);
            }
        }

        @keyframes ringRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes outerRingPulse {
            0% {
                transform: scale(1);
                opacity: 0.6;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.3;
            }
            100% {
                transform: scale(1.2);
                opacity: 0;
            }
        }

        @keyframes sparkleFloat1 {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translateY(-6px) rotate(90deg) scale(1.1);
                opacity: 0.6;
            }
            50% { 
                transform: translateY(-8px) rotate(180deg) scale(1);
                opacity: 0.8;
            }
            75% { 
                transform: translateY(-4px) rotate(270deg) scale(1.1);
                opacity: 0.7;
            }
        }

        @keyframes sparkleFloat2 {
            0%, 100% { 
                transform: translateX(0px) rotate(0deg) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translateX(4px) rotate(-90deg) scale(1.05);
                opacity: 0.6;
            }
            50% { 
                transform: translateX(6px) rotate(-180deg) scale(1.1);
                opacity: 0.8;
            }
            75% { 
                transform: translateX(3px) rotate(-270deg) scale(1);
                opacity: 0.7;
            }
        }

        @keyframes sparkleFloat3 {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translateY(6px) rotate(120deg) scale(1.1);
                opacity: 0.6;
            }
            50% { 
                transform: translateY(8px) rotate(240deg) scale(1);
                opacity: 0.8;
            }
            75% { 
                transform: translateY(4px) rotate(360deg) scale(1.1);
                opacity: 0.7;
            }
        }

        @keyframes sparkleFloat4 {
            0%, 100% { 
                transform: translateX(0px) rotate(0deg) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translateX(-5px) rotate(45deg) scale(1.1);
                opacity: 0.7;
            }
            50% { 
                transform: translateX(-8px) rotate(90deg) scale(1);
                opacity: 0.8;
            }
            75% { 
                transform: translateX(-3px) rotate(135deg) scale(1.05);
                opacity: 0.6;
            }
        }

        @keyframes progressShine {
            0% { 
                background-position: 0% 50%;
            }
            50% { 
                background-position: 100% 50%;
            }
            100% { 
                background-position: 0% 50%;
            }
        }

        @keyframes statusPing {
            75%, 100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }
    `);

    // 工具函数：根据XPath查找元素
    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 检测当前用户名的函数
    function getCurrentUsername() {
        // 尝试多种方式获取当前用户名
        
        // 方法1：从用户菜单中获取
        const userMenuButton = document.querySelector('.header-dropdown-toggle.current-user');
        if (userMenuButton) {
            const img = userMenuButton.querySelector('img');
            if (img && img.alt) {
                debugLog(`从用户菜单获取用户名: ${img.alt}`);
                return img.alt;
            }
        }
        
        // 方法2：从用户头像的title属性获取
        const userAvatar = document.querySelector('.current-user img[title]');
        if (userAvatar && userAvatar.title) {
            debugLog(`从用户头像title获取用户名: ${userAvatar.title}`);
            return userAvatar.title;
        }
        
        // 方法3：从页面中的用户链接获取（更精确的选择器）
        const currentUserLink = document.querySelector('a.current-user, .header-dropdown-toggle.current-user a');
        if (currentUserLink) {
            const href = currentUserLink.getAttribute('href');
            if (href && href.includes('/u/')) {
                const username = href.split('/u/')[1].split('/')[0];
                if (username && username.length > 0) {
                    debugLog(`从当前用户链接获取用户名: ${username}`);
                    return username;
                }
            }
        }
        
        // 方法4：从页面标题或其他元素获取
        const userLinks = document.querySelectorAll('a[href*="/u/"]');
        for (const link of userLinks) {
            // 跳过明显不是当前用户的链接
            if (link.closest('.topic-list') || link.closest('.post-stream')) {
                continue;
            }
            
            const href = link.getAttribute('href');
            if (href && href.includes('/u/')) {
                const username = href.split('/u/')[1].split('/')[0];
                if (username && username.length > 0 && !username.includes('?')) {
                    debugLog(`从用户链接获取用户名: ${username}`);
                    return username;
                }
            }
        }
        
        // 方法5：从当前URL获取（如果在用户页面）
        if (window.location.pathname.includes('/u/')) {
            const username = window.location.pathname.split('/u/')[1].split('/')[0];
            if (username && username.length > 0) {
                debugLog(`从URL获取用户名: ${username}`);
                return username;
            }
        }
        
        // 方法6：从localStorage或其他存储中获取（如果有的话）
        try {
            const discourseData = localStorage.getItem('discourse_current_user');
            if (discourseData) {
                const userData = JSON.parse(discourseData);
                if (userData && userData.username) {
                    debugLog(`从localStorage获取用户名: ${userData.username}`);
                    return userData.username;
                }
            }
        } catch (e) {
            // 忽略JSON解析错误
        }
        
        debugLog('无法检测到当前用户名');
        return null;
    }

    // 检查是否有注册和登录按钮
    const loginBtnXpath = '//*[@id="ember3"]/div[2]/header/div/div/div[3]/span/span';
    const loginBtn = getElementByXpath(loginBtnXpath);
    
    debugLog('检查登录按钮: ' + (loginBtn ? '存在' : '不存在'));
    
    if (loginBtn) {
        // 有登录注册按钮，不执行后续逻辑
        debugLog('已检测到登录按钮，不显示等级浮窗');
        return;
    }
    
    // 尝试从缓存获取数据
    const cachedData = GM_getValue(STORAGE_KEY);
    const lastCheck = GM_getValue(LAST_CHECK_KEY, 0);
    const lastUser = GM_getValue(LAST_USER_KEY, ''); // 获取上次的用户名
    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000; // 一小时的毫秒数
    
    debugLog(`上次检查时间: ${new Date(lastCheck).toLocaleString()}`);
    debugLog(`上次用户: ${lastUser}`);
    
    // 创建右侧悬浮按钮容器
    const container = document.createElement('div');
    container.className = 'ld-floating-container';
    
    // 创建悬浮按钮
    const btn = document.createElement('div');
    btn.className = 'ld-floating-btn';
    btn.innerHTML = `
        <svg class="ld-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <div class="ld-btn-level">L?</div>
        <div class="ld-btn-progress-bar">
            <div class="ld-btn-progress-fill" style="width: 0%;"></div>
        </div>
        <div class="ld-btn-stats">0/0</div>
        <svg class="ld-btn-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
    `;
    
    // 检测当前用户名并设置tooltip
    const currentUser = getCurrentUsername();
    btn.title = currentUser ? `Linux.do 等级监控 - 当前用户: ${currentUser}` : 'Linux.do 等级监控';
    debugLog(`当前检测到的用户: ${currentUser}`);
    
    // 创建浮窗
    const popup = document.createElement('div');
    popup.className = 'ld-popup';
    
    // 设置默认内容
    popup.innerHTML = `
        <div class="ld-popup-header">
            <div class="ld-header-top">
                <div class="ld-user-info">
                    <div class="ld-user-dot"></div>
                    <span class="ld-user-name">加载中...</span>
                </div>
                <span class="ld-level-badge">升级到等级?</span>
            </div>
            <div class="ld-progress-section">
                <div class="ld-progress-header">
                    <span class="ld-progress-label">完成进度</span>
                    <span class="ld-progress-stats">0/0</span>
                </div>
                <div class="ld-progress-bar-container">
                    <div class="ld-progress-bar" style="width: 0%;"></div>
                </div>
            </div>
        </div>
        <div class="ld-popup-content">
            <div class="ld-status-cards">
                <div class="ld-status-card failed">
                    <div class="ld-card-header failed">
                        <svg class="ld-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span class="ld-card-title">未达标</span>
                    </div>
                    <div class="ld-card-label">正在加载...</div>
                    <div class="ld-card-value">-</div>
                </div>
                <div class="ld-status-card passed">
                    <div class="ld-card-header passed">
                        <svg class="ld-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="ld-card-title">已完成</span>
                    </div>
                    <div class="ld-card-label">其他要求</div>
                    <div class="ld-card-value">0 / 0</div>
                </div>
            </div>
        </div>
    `;

    // 添加到容器
    container.appendChild(btn);
    container.appendChild(popup);

    // 全局事件监听器 - 只绑定一次，避免重复绑定问题
    let globalEventListenerAdded = false;
    
    function addGlobalEventListener() {
        if (globalEventListenerAdded) return;
        globalEventListenerAdded = true;
        
        // 使用事件委托处理所有点击事件
        popup.addEventListener('click', function(e) {
            // 处理刷新按钮
            if (e.target && e.target.classList.contains('ld-reload-btn')) {
                e.preventDefault();
                e.stopPropagation();
                debugLog('刷新按钮被点击！');
                e.target.textContent = '加载中...';
                e.target.disabled = true;
                forceRefreshData();
                setTimeout(() => {
                    if (e.target.isConnected) {
                        e.target.textContent = e.target.textContent.includes('重试') ? '重试' : '刷新数据';
                        e.target.disabled = false;
                    }
                }, 3000);
                return;
            }
            
            // 处理详情切换按钮
            if (e.target && e.target.classList.contains('ld-toggle-btn') && e.target.getAttribute('data-action') === 'toggle-details') {
                e.preventDefault();
                e.stopPropagation();
                const achievementDiv = popup.querySelector('.ld-celebration-achievement');
                const detailsDiv = popup.querySelector('.ld-celebration-details');
                
                if (!achievementDiv || !detailsDiv) {
                    debugLog('未找到切换目标元素');
                    return;
                }
                
                const isShowingDetails = detailsDiv.style.display !== 'none';

                if (isShowingDetails) {
                    // 切换到成就庆祝视图
                    detailsDiv.style.display = 'none';
                    detailsDiv.style.flex = '';
                    achievementDiv.style.display = 'flex';
                    achievementDiv.style.flex = '1';
                    e.target.textContent = '详情';
                    debugLog('详情按钮点击: 切换到成就庆祝视图');
                } else {
                    // 切换到详情视图
                    achievementDiv.style.display = 'none';
                    achievementDiv.style.flex = '';
                    detailsDiv.style.display = 'flex';
                    detailsDiv.style.flex = '1';
                    detailsDiv.style.flexDirection = 'column';
                    detailsDiv.style.minHeight = '0';
                    e.target.textContent = '收起';
                    debugLog('详情按钮点击: 切换到详情视图');

                    // 确保滚动区域正确设置
                    setTimeout(() => {
                        const scrollArea = detailsDiv.querySelector('.ld-scroll-area');
                        if (scrollArea) {
                            scrollArea.style.overflowY = 'auto';
                            scrollArea.style.maxHeight = '300px';
                            debugLog('滚动区域样式已重新设置');
                        }
                    }, 50);
                }
                return;
            }
        });
        
        debugLog('全局事件监听器已添加');
    }
    
    // 立即添加全局事件监听器
    addGlobalEventListener();

    // 变量用于跟踪悬停状态
    let isHovered = false;
    let hoverTimeout = null;
    
    // 鼠标进入容器时
    container.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        isHovered = true;
        hoverTimeout = setTimeout(() => {
            if (isHovered) {
                // 重置详情状态为收起（显示成就庆祝视图）
                const achievementDiv = popup.querySelector('.ld-celebration-achievement');
                const detailsDiv = popup.querySelector('.ld-celebration-details');
                const toggleBtn = popup.querySelector('.ld-toggle-btn[data-action="toggle-details"]');
                if (detailsDiv && toggleBtn && achievementDiv) {
                    detailsDiv.style.display = 'none';
                    achievementDiv.style.display = 'flex';
                    toggleBtn.textContent = '详情';
                }
                
                // 移除 adjustPopupPosition() 调用
                // adjustPopupPosition(); 
                
                // 显示弹出窗口
                popup.classList.add('show');
            }
        }, 150); // 稍微延迟显示，避免误触
    });
    
    // 鼠标离开容器时
    container.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        isHovered = false;
        hoverTimeout = setTimeout(() => {
            if (!isHovered) {
                popup.classList.remove('show');
            }
        }, 100); // 稍微延迟隐藏，允许鼠标在按钮和弹窗间移动
    });

    // 监听窗口大小变化，重新调整位置
    window.addEventListener('resize', () => {
        if (popup.classList.contains('show')) {
            // 移除 adjustPopupPosition() 调用
            // adjustPopupPosition();
        }
    });

    document.body.appendChild(container);
    
    debugLog('新版按钮和浮窗已添加到页面');
    
    // 检查是否需要刷新数据的条件：
    // 1. 没有缓存数据
    // 2. 缓存超过一小时
    // 3. 用户名发生变化（账号切换）
    const needRefresh = !cachedData || 
                       (now - lastCheck >= oneHourMs) || 
                       (currentUser && lastUser && currentUser !== lastUser);
    
    if (needRefresh) {
        if (!cachedData) {
            debugLog('没有缓存数据，准备获取新数据');
        } else if (now - lastCheck >= oneHourMs) {
            debugLog('缓存已过期，准备获取新数据');
        } else if (currentUser && lastUser && currentUser !== lastUser) {
            debugLog(`检测到账号切换: ${lastUser} -> ${currentUser}，准备获取新数据`);
        }
        
        // 延迟后再执行，给页面一点时间稳定
        const delay = 3000;
        debugLog(`将在 ${delay / 1000} 秒后尝试获取数据...`);
        setTimeout(() => {
            debugLog('Timeout结束，准备调用 fetchDataWithGM');
            fetchDataWithGM();
        }, delay);
    } else {
        debugLog('使用缓存数据');
        updateInfo(
            cachedData.username,
            cachedData.currentLevel,
            cachedData.targetLevel,
            cachedData.trustLevelDetails,
            new Date(lastCheck),
            cachedData.originalHtml || '',
            true // isFromCache
        );
    }
    
    // 解析信任级别详情
    function parseTrustLevelDetails(targetInfoDivElement) {
        const details = {
            items: [],
            summaryText: '',
            achievedCount: 0,
            totalCount: 0,
            targetLevelInSummary: null // 从 "不符合信任级别 X 要求" 中提取
        };

        if (!targetInfoDivElement) {
            debugLog('parseTrustLevelDetails: targetInfoDivElement为空');
            return details;
        }

        // 解析表格
        const table = targetInfoDivElement.querySelector('table');
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row, index) => {
                if (index === 0) return; // 跳过表头行

                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const label = cells[0].textContent.trim();
                    const currentText = cells[1].textContent.trim();
                    const requiredText = cells[2].textContent.trim();
                    const isMet = cells[1].classList.contains('text-green-500');

                    details.items.push({
                        label: label,
                        current: currentText,
                        required: requiredText,
                        isMet: isMet
                    });

                    if (isMet) {
                        details.achievedCount++;
                    }
                }
            });
            details.totalCount = details.items.length;
        } else {
            debugLog('parseTrustLevelDetails: 未找到表格');
        }

        // 解析总结文本，例如 "不符合信任级别 3 要求，继续加油。"
        const paragraphs = targetInfoDivElement.querySelectorAll('p');
        paragraphs.forEach(p => {
            const text = p.textContent.trim();
            if (text.includes('要求') || text.includes('已满足') || text.includes('信任级别')) {
                details.summaryText = text;
                const levelMatch = text.match(/信任级别\s*(\d+)/);
                if (levelMatch) {
                    details.targetLevelInSummary = levelMatch[1];
                }
            }
        });
        if (!details.summaryText) {
            debugLog('parseTrustLevelDetails: 未找到总结文本段落');
        }

        debugLog(`parseTrustLevelDetails: 解析完成, ${details.achievedCount}/${details.totalCount} 项达标. 总结: ${details.summaryText}. 目标等级从总结文本: ${details.targetLevelInSummary}`);
        return details;
    }

    // 使用 GM_xmlhttpRequest 获取 connect.linux.do 的信息
    function fetchDataWithGM() {
        debugLog('进入 fetchDataWithGM 函数，准备发起 GM_xmlhttpRequest');
        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://connect.linux.do/",
                timeout: 15000, // 15秒超时
                onload: function(response) {
                    debugLog(`GM_xmlhttpRequest 成功: status ${response.status}`);
                    if (response.status === 200) {
                        const responseText = response.responseText;
                        debugLog(`GM_xmlhttpRequest 响应状态 200，准备解析HTML。响应体长度: ${responseText.length}`);

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = responseText;
                        
                        // 1. 解析全局用户名和当前等级 (从 <h1>)
                        let globalUsername = '用户';
                        let currentLevel = '未知';
                        const h1 = tempDiv.querySelector('h1');
                        if (h1) {
                            const h1Text = h1.textContent.trim();
                            // 例如: "你好，一剑万生 (YY_WD) 2级用户" 或 "你好， (yy2025) 0级用户"
                            const welcomeMatch = h1Text.match(/你好，\s*([^(\s]*)\s*\(?([^)]*)\)?\s*(\d+)级用户/i);
                            if (welcomeMatch) {
                                // 优先使用括号内的用户名，如果没有则使用前面的
                                globalUsername = welcomeMatch[2] || welcomeMatch[1] || '用户';
                                currentLevel = welcomeMatch[3];
                                debugLog(`从<h1>解析: 全局用户名='${globalUsername}', 当前等级='${currentLevel}'`);
                            } else {
                                debugLog(`从<h1>解析: 未匹配到欢迎信息格式: "${h1Text}"`);
                            }
                        } else {
                            debugLog('未在响应中找到 <h1> 标签');
                        }

                        // 检查用户等级，决定使用哪种数据获取方式
                        const userLevel = parseInt(currentLevel);
                        if (userLevel === 0 || userLevel === 1) {
                            debugLog(`检测到${userLevel}级用户，使用summary.json获取数据`);
                            fetchLowLevelUserData(globalUsername, userLevel);
                        } else if (userLevel >= 2) {
                            debugLog(`检测到${userLevel}级用户，使用connect.linux.do页面数据`);
                            // 继续原有逻辑处理2级及以上用户
                            processHighLevelUserData(tempDiv, globalUsername, currentLevel);
                        } else {
                            debugLog('无法确定用户等级，显示错误');
                            showError('无法确定用户等级，请检查登录状态');
                        }

                    } else {
                        debugLog(`请求失败，状态码: ${response.status} - ${response.statusText}`);
                        handleRequestError(response);
                    }
                },
                onerror: function(error) {
                    debugLog(`GM_xmlhttpRequest 错误: ${JSON.stringify(error)}`);
                    showError('网络请求错误，请检查连接和油猴插件权限');
                },
                ontimeout: function() {
                    debugLog('GM_xmlhttpRequest 超时');
                    showError('请求超时，请检查网络连接');
                },
                onabort: function() {
                    debugLog('GM_xmlhttpRequest 请求被中止 (onabort)');
                    showError('请求被中止，可能是网络问题或扩展冲突');
                }
            });
            debugLog('GM_xmlhttpRequest 已调用，等待回调');
        } catch (e) {
            debugLog(`调用 GM_xmlhttpRequest 时发生同步错误: ${e.message}`);
            showError('调用请求时出错，请查看日志');
        }
    }
    
    // 将数据保存到缓存
    function saveDataToCache(username, currentLevel, targetLevel, trustLevelDetails, originalHtml) {
        debugLog('保存数据到缓存');
        const dataToCache = {
            username,
            currentLevel,
            targetLevel,
            trustLevelDetails,
            originalHtml,
            cacheTimestamp: Date.now() // 添加一个缓存内的时间戳，方便调试
        };
        GM_setValue(STORAGE_KEY, dataToCache);
        GM_setValue(LAST_CHECK_KEY, Date.now());
        GM_setValue(LAST_USER_KEY, username); // 保存用户名
        debugLog(`已保存用户 ${username} 的数据到缓存`);
    }
    
    // 更新信息显示
    function updateInfo(username, currentLevel, targetLevel, trustLevelDetails, updateTime, originalHtml, isFromCache = false) {
        debugLog(`更新信息: 用户='${username}', 当前L=${currentLevel}, 目标L=${targetLevel}, 详情获取=${trustLevelDetails && trustLevelDetails.items.length > 0}, 更新时间=${updateTime.toLocaleString()}`);
        
        // 计算进度
        const achievedCount = trustLevelDetails ? trustLevelDetails.achievedCount : 0;
        const totalCount = trustLevelDetails ? trustLevelDetails.totalCount : 0;
        const progressPercent = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;
        
        // 判断是否为完全达标的特殊用户
        const isPerfectUser = achievedCount === totalCount && (
            (currentLevel === '2' && targetLevel === '3') || 
            currentLevel === '3'
        );
        
        // 更新按钮显示
        const levelElement = btn.querySelector('.ld-btn-level');
        const progressFill = btn.querySelector('.ld-btn-progress-fill');
        const statsElement = btn.querySelector('.ld-btn-stats');
        const iconElement = btn.querySelector('.ld-btn-icon');
        
        if (levelElement) levelElement.textContent = `L${currentLevel || '?'}`;
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
            // 为达标用户添加特殊的进度条样式
            if (isPerfectUser) {
                progressFill.style.background = 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)';
                progressFill.style.animation = 'pulse 2s infinite';
            } else {
                progressFill.style.background = '#ea580c';
                progressFill.style.animation = '';
            }
        }
        if (statsElement) statsElement.textContent = `${achievedCount}/${totalCount}`;
        
        // 为完全达标用户更换按钮图标为星星
        if (iconElement && isPerfectUser) {
            iconElement.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="currentColor" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            `;
            iconElement.style.color = '#f59e0b';
            iconElement.style.animation = 'pulse 2s infinite';
        } else if (iconElement) {
            // 恢复默认用户图标
            iconElement.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            `;
            iconElement.style.color = '#6b7280';
            iconElement.style.animation = '';
        }
        
        // 更新浮窗内容
        updatePopupContent(username, currentLevel, targetLevel, trustLevelDetails, updateTime, originalHtml, isFromCache);
    }
    
    // 更新浮窗内容 - 适配新UI结构
    function updatePopupContent(username, currentLevel, targetLevel, trustLevelDetails, updateTime, originalHtml, isFromCache = false) {
        // 如果加载失败或无数据，显示错误状态
        if (!trustLevelDetails || !trustLevelDetails.items || trustLevelDetails.items.length === 0) {
            showPopupError('无法加载数据', '未能获取到信任级别详情数据，请刷新重试。', updateTime);
            return;
        }

        // 计算进度
        const achievedCount = trustLevelDetails.achievedCount;
        const totalCount = trustLevelDetails.totalCount;
        const progressPercent = Math.round((achievedCount / totalCount) * 100);
        
        // 判断是否为完全达标的特殊用户（2级升3级达标 或 3级保持）
        const isPerfectUser = achievedCount === totalCount && (
            (currentLevel === '2' && targetLevel === '3') || 
            currentLevel === '3'
        );
        
        if (isPerfectUser) {
            // 显示庆祝版本
            showCelebrationPopup(username, currentLevel, targetLevel, trustLevelDetails, updateTime);
            return;
        }
        
        // 找到未达标的项目
        const failedItems = trustLevelDetails.items.filter(item => !item.isMet);
        const failedItem = failedItems.length > 0 ? failedItems[0] : null;

        // 获取图标函数
        function getIconSvg(type) {
            const icons = {
                user: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>',
                message: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.991 8.991 0 01-4.92-1.487L3 21l2.513-5.08A8.991 8.991 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>',
                eye: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
                thumbsUp: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>',
                warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
                shield: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',
                crown: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l4 6 3-3 3 3 4-6v13a2 2 0 01-2 2H7a2 2 0 01-2-2V3z"></path>',
                star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',
                sparkles: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>'
            };
            return icons[type] || icons.star;
        }

        function getItemIcon(label) {
            if (label.includes('访问次数')) return 'user';
            if (label.includes('回复') || label.includes('话题')) return 'message';
            if (label.includes('浏览') || label.includes('已读')) return 'eye';
            if (label.includes('举报')) return 'warning';
            if (label.includes('点赞') || label.includes('获赞')) return 'thumbsUp';
            if (label.includes('禁言') || label.includes('封禁')) return 'shield';
            return 'user';
        }

        // 构建新UI HTML
        let html = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div class="ld-popup-header" style="flex-shrink: 0;">
                    <div class="ld-header-top">
                        <div class="ld-user-info">
                            <div class="ld-user-dot"></div>
                            <span class="ld-user-name">${username || '用户'}</span>
                        </div>
                        <span class="ld-level-badge">升级到等级${targetLevel}</span>
                    </div>
                    <div class="ld-progress-section">
                        <div class="ld-progress-header">
                            <span class="ld-progress-label">完成进度</span>
                            <span class="ld-progress-stats">${achievedCount}/${totalCount}</span>
                        </div>
                        <div class="ld-progress-bar-container">
                            <div class="ld-progress-bar" style="width: ${progressPercent}%;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="ld-status-cards" style="flex-shrink: 0; margin-bottom: 8px;">
                    <div class="ld-status-card failed">
                        <div class="ld-card-header failed">
                            <svg class="ld-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="ld-card-title">未达标</span>
                        </div>
                        <div class="ld-card-value" style="font-size: 11px; line-height: 1.2; margin-top: 4px;">${failedItems.length > 0 ? failedItems.map(item => item.label).join('、') : '所有要求均已满足'}</div>
                    </div>
                    <div class="ld-status-card passed">
                        <div class="ld-card-header passed">
                            <svg class="ld-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span class="ld-card-title">已完成</span>
                        </div>
                        <div class="ld-card-value" style="font-size: 11px; line-height: 1.2; margin-top: 4px;">其他要求 ${achievedCount}/${totalCount}</div>
                    </div>
                </div>
                
                <div class="ld-details-section" style="flex: 1; overflow: hidden;">
                    <div class="ld-details-list" style="height: 100%; overflow-y: auto; padding: 8px 12px;">`;
        
        // 为每个指标生成HTML - 修复显示逻辑
        trustLevelDetails.items.forEach(item => {
            const iconType = getItemIcon(item.label);
            const statusClass = item.isMet ? 'passed' : 'failed';
            const statusIcon = item.isMet ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            
            html += `
                <div class="ld-detail-item">
                    <div class="ld-detail-left">
                        <svg class="ld-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${getIconSvg(iconType)}
                        </svg>
                        <span class="ld-detail-label">${item.label}</span>
                    </div>
                    <div class="ld-detail-right">
                        <span class="ld-detail-current" style="color: ${item.isMet ? '#059669' : '#dc2626'}; font-weight: 600;">${item.current}</span><span class="ld-detail-target">/${item.required}</span>
                        <svg class="ld-detail-status ${statusClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${statusIcon}
                        </svg>
                    </div>
                </div>`;
        });

        html += `
                    </div>
                </div>
                
                <!-- 更新时间和刷新按钮 - 调整间距 -->
                <div style="padding: 8px 12px; background: #f9fafb; border-top: 1px solid #f3f4f6; flex-shrink: 0;">
                    <div style="text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 6px;">
                        更新于 ${updateTime.toLocaleString()}
                    </div>
                    <button class="ld-reload-btn" style="margin: 0; width: 100%;">刷新数据</button>
                </div>
            </div>`;

        // 设置内容
        popup.innerHTML = html;

        // 事件监听器已通过全局事件委托处理，无需重复添加
        debugLog('普通版本内容已更新，事件监听器通过全局委托处理');
    }

    // 显示错误状态的浮窗
    function showPopupError(title, message, updateTime) {
        popup.innerHTML = `
            <div class="ld-error-container">
                <div class="ld-error-icon">❌</div>
                <div class="ld-error-title">${title}</div>
                <div class="ld-error-message">${message}</div>
                <div class="ld-footer-time">尝试时间: ${updateTime ? updateTime.toLocaleString() : '未知'}</div>
            </div>
            <button class="ld-reload-btn">重试</button>
        `;
        
        // 事件监听器已通过全局事件委托处理，无需重复添加
        debugLog('错误弹窗内容已更新，事件监听器通过全局委托处理');
    }
    
    // 显示错误信息 (保留向下兼容)
    function showError(message) {
        debugLog(`显示错误: ${message}`);
        showPopupError('出错了', message, new Date());
    }

    // 处理请求错误
    function handleRequestError(response) {
        let responseBody = response.responseText || ""; 
        debugLog(`响应内容 (前500字符): ${responseBody.substring(0, 500)}`);

        if (response.status === 429) {
            showError('请求过于频繁 (429)，请稍后重试。Cloudflare可能暂时限制了访问。');
        } else if (responseBody.includes('Cloudflare') || responseBody.includes('challenge-platform') || responseBody.includes('Just a moment')) {
             showError('Cloudflare拦截或验证页面。请等待或手动访问connect.linux.do完成验证。');
        } else if (responseBody.includes('登录') || responseBody.includes('注册')) {
            showError('获取数据失败，可能是需要登录 connect.linux.do。');
        } else {
             showError(`获取数据失败 (状态: ${response.status})`);
        }
    }
    
    // 处理2级及以上用户数据（原有逻辑）
    function processHighLevelUserData(tempDiv, globalUsername, currentLevel) {
        let targetInfoDiv = null;
        const potentialDivs = tempDiv.querySelectorAll('div.bg-white.p-6.rounded-lg.mb-4.shadow');
        debugLog(`找到了 ${potentialDivs.length} 个潜在的 'div.bg-white.p-6.rounded-lg.mb-4.shadow' 元素。`);

        for (let i = 0; i < potentialDivs.length; i++) {
            const div = potentialDivs[i];
            const h2 = div.querySelector('h2.text-xl.mb-4.font-bold');
            if (h2 && h2.textContent.includes('信任级别')) {
                targetInfoDiv = div;
                debugLog(`找到包含"信任级别"标题的目标div，其innerHTML (前200字符): ${targetInfoDiv.innerHTML.substring(0,200)}`);
                break;
            }
        }
        
        if (!targetInfoDiv) {
            debugLog('通过遍历和内容检查，未找到包含"信任级别"标题的目标div。');
            showError('未找到包含等级信息的数据块。请检查控制台日志 (Alt+D) 中的HTML内容，并提供一个准确的选择器。');
            return;
        }
        
        debugLog('通过内容匹配，在响应中找到目标信息div。');
        const originalHtml = targetInfoDiv.innerHTML;

        // 从目标div的<h2>解析用户名和目标等级
        let specificUsername = globalUsername;
        let targetLevel = '未知';
        const h2InDiv = targetInfoDiv.querySelector('h2.text-xl.mb-4.font-bold');
        if (h2InDiv) {
            const h2Text = h2InDiv.textContent.trim();
            const titleMatch = h2Text.match(/^(.+?)\s*-\s*信任级别\s*(\d+)\s*的要求/i);
            if (titleMatch) {
                specificUsername = titleMatch[1].trim();
                targetLevel = titleMatch[2];
                debugLog(`从<h2>解析: 特定用户名='${specificUsername}', 目标等级='${targetLevel}'`);
            } else {
                 debugLog(`从<h2>解析: 未匹配到标题格式: "${h2Text}"`);
            }
        } else {
            debugLog('目标div中未找到<h2>标签');
        }

        // 解析信任级别详情
        const trustLevelDetails = parseTrustLevelDetails(targetInfoDiv);

        debugLog(`最终提取信息: 用户名='${specificUsername}', 当前等级='${currentLevel}', 目标等级='${targetLevel}'`);
        updateInfo(specificUsername, currentLevel, targetLevel, trustLevelDetails, new Date(), originalHtml);
        saveDataToCache(specificUsername, currentLevel, targetLevel, trustLevelDetails, originalHtml);
    }
    
    // 处理0级和1级用户数据
    function fetchLowLevelUserData(username, currentLevel) {
        debugLog(`开始获取${currentLevel}级用户 ${username} 的数据`);
        
        // 首先获取summary.json数据
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://linux.do/u/${username}/summary.json`,
            timeout: 15000,
            onload: function(response) {
                debugLog(`summary.json请求成功: status ${response.status}`);
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const userSummary = data.user_summary;
                        debugLog(`获取到用户摘要数据: ${JSON.stringify(userSummary)}`);
                        
                        // 0级和1级用户都直接处理数据，不再需要额外获取回复数据
                        processLowLevelUserData(username, currentLevel, userSummary, null); // repliesCount 设为 null 或移除
                        
                    } catch (e) {
                        debugLog(`解析summary.json失败: ${e.message}`);
                        showError('解析用户数据失败');
                    }
                } else {
                    debugLog(`summary.json请求失败: ${response.status}`);
                    showError(`获取用户数据失败 (状态: ${response.status})`);
                }
            },
            onerror: function(error) {
                debugLog(`summary.json请求错误: ${JSON.stringify(error)}`);
                showError('获取用户数据时网络错误');
            },
            ontimeout: function() {
                debugLog('summary.json请求超时');
                showError('获取用户数据超时');
            }
        });
    }
    
    // 处理0级和1级用户的数据
    function processLowLevelUserData(username, currentLevel, userSummary) { // 移除了 repliesCount 参数
        debugLog(`处理${currentLevel}级用户数据: ${username}`);
        
        const targetLevel = currentLevel + 1; // 目标等级
        const requirements = LEVEL_REQUIREMENTS[currentLevel];
        
        if (!requirements) {
            showError(`未找到等级${currentLevel}的升级要求配置`);
            return;
        }
        
        // 构建升级详情数据
        const trustLevelDetails = {
            items: [],
            summaryText: '',
            achievedCount: 0,
            totalCount: 0,
            targetLevelInSummary: targetLevel.toString()
        };
        
        // 检查各项要求
        Object.entries(requirements).forEach(([key, requiredValue]) => {
            let currentValue = 0;
            let label = '';
            let isMet = false;
            
            switch (key) {
                case 'topics_entered':
                    currentValue = userSummary.topics_entered || 0;
                    label = '浏览的话题';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'posts_read_count':
                    currentValue = userSummary.posts_read_count || 0;
                    label = '已读帖子';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'time_read':
                    currentValue = Math.floor((userSummary.time_read || 0) / 60); // 转换为分钟
                    label = '阅读时间(分钟)';
                    isMet = (userSummary.time_read || 0) >= requiredValue;
                    break;
                case 'days_visited':
                    currentValue = userSummary.days_visited || 0;
                    label = '访问天数';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'likes_given':
                    currentValue = userSummary.likes_given || 0;
                    label = '给出的赞';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'likes_received':
                    currentValue = userSummary.likes_received || 0;
                    label = '收到的赞';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'post_count': // 修改：处理 post_count
                    currentValue = userSummary.post_count || 0;
                    label = '帖子数量';
                    isMet = currentValue >= requiredValue;
                    break;
            }
            
            if (label) {
                trustLevelDetails.items.push({
                    label: label,
                    current: currentValue.toString(),
                    required: key === 'time_read' ? Math.floor(requiredValue / 60).toString() : requiredValue.toString(),
                    isMet: isMet
                });
                
                if (isMet) {
                    trustLevelDetails.achievedCount++;
                }
                trustLevelDetails.totalCount++;
            }
        });
        
        // 生成总结文本
        if (trustLevelDetails.achievedCount === trustLevelDetails.totalCount) {
            trustLevelDetails.summaryText = `已满足信任级别 ${targetLevel} 要求`;
        } else {
            trustLevelDetails.summaryText = `不符合信任级别 ${targetLevel} 要求，继续加油`;
        }
        
        debugLog(`${currentLevel}级用户数据处理完成: ${trustLevelDetails.achievedCount}/${trustLevelDetails.totalCount} 项达标`);
        
        // 更新显示
        updateInfo(username, currentLevel.toString(), targetLevel.toString(), trustLevelDetails, new Date(), '', false);
        saveDataToCache(username, currentLevel.toString(), targetLevel.toString(), trustLevelDetails, '');
    }

    // 显示庆祝版本的弹窗 - 为完全达标的用户
    function showCelebrationPopup(username, currentLevel, targetLevel, trustLevelDetails, updateTime) {
        debugLog(`显示庆祝版本弹窗: ${username}, L${currentLevel}`);
        
        const totalCount = trustLevelDetails.totalCount;
        const isLevel3 = currentLevel === '3';
        
        // 获取图标SVG
        function getIconSvg(type) {
            const icons = {
                user: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>',
                message: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.991 8.991 0 01-4.92-1.487L3 21l2.513-5.08A8.991 8.991 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>',
                eye: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
                thumbsUp: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>',
                warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
                shield: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',
                crown: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l4 6 3-3 3 3 4-6v13a2 2 0 01-2 2H7a2 2 0 01-2-2V3z"></path>',
                star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',
                sparkles: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>'
            };
            return icons[type] || icons.star;
        }

        function getItemIcon(label) {
            if (label.includes('访问次数')) return 'user';
            if (label.includes('回复') || label.includes('话题')) return 'message';
            if (label.includes('浏览') || label.includes('已读')) return 'eye';
            if (label.includes('举报')) return 'warning';
            if (label.includes('点赞') || label.includes('获赞')) return 'thumbsUp';
            if (label.includes('禁言') || label.includes('封禁')) return 'shield';
            return 'user';
        }

        // 构建庆祝版本HTML
        let html = `
            <div class="ld-celebration-container">
                <!-- 庆祝边框效果 -->
                <div class="ld-celebration-border"></div>
                
                <!-- 飞舞的星星 -->
                <svg class="ld-sparkle ld-sparkle-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${getIconSvg('star')}
                </svg>
                <svg class="ld-sparkle ld-sparkle-2" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${getIconSvg('sparkles')}
                </svg>
                <svg class="ld-sparkle ld-sparkle-3" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${getIconSvg('star')}
                </svg>
                <svg class="ld-sparkle ld-sparkle-4" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${getIconSvg('sparkles')}
                </svg>
                
                <!-- Header -->
                <div class="ld-popup-header ld-celebration-header" style="flex-shrink: 0;">
                    <div class="ld-header-top">
                        <div class="ld-user-info">
                            <div class="ld-user-dot" style="background: linear-gradient(45deg, #f59e0b, #8b5cf6);"></div>
                            <span class="ld-user-name">${username || '用户'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="ld-level-badge" style="background: linear-gradient(45deg, #8b5cf6, #ec4899); color: white;">
                                🎉 信任级别 ${currentLevel}
                            </span>
                            <button class="ld-toggle-btn" data-action="toggle-details">
                                详情
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-top: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                            <svg width="12" height="12" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" style="color: #f59e0b;">
                                ${getIconSvg('star')}
                            </svg>
                            <span style="font-size: 12px; color: #6b7280;">
                                ${isLevel3 ? '恭喜达成所有要求！' : '恭喜升级成功！'}
                            </span>
                        </div>
                        
                        <!-- 完美进度条 -->
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <span style="font-size: 12px; color: #6b7280; font-weight: 500;">完成进度</span>
                                <span style="font-size: 12px; color: #059669; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                                    <svg width="12" height="12" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                        ${getIconSvg('star')}
                                    </svg>
                                    ${totalCount}/${totalCount}
                                </span>
                            </div>
                            <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 12px; overflow: hidden;">
                                <div class="ld-perfect-progress" style="width: 100%; height: 100%; border-radius: 4px;">
                                    <div style="height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: pulse 2s infinite;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 主要内容区域 - 可伸缩 -->
                <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                    <!-- 成就庆祝区域（默认显示） -->
                    <div class="ld-celebration-achievement" style="flex: 1; padding: 16px; display: flex; align-items: center; justify-content: center;">
                        <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5, #d1fae5); border-radius: 8px; padding: 24px; border: 1px solid #a7f3d0; text-align: center; width: 100%;">
                            <div style="display: flex; justify-content: center; margin-bottom: 16px;">
                                <div class="ld-celebration-icon">
                                    <div class="ld-celebration-ring"></div>
                                    <div class="ld-celebration-ring-outer"></div>
                                    <svg width="32" height="32" fill="white" stroke="white" viewBox="0 0 24 24">
                                        ${getIconSvg('crown')}
                                    </svg>
                                </div>
                            </div>
                            <div class="ld-celebration-title">
                                🎊 全部达标！
                            </div>
                            <div class="ld-celebration-subtitle">所有要求均已满足</div>
                            <div class="ld-celebration-message">
                                ${isLevel3 ? '享受信任级别 3 的所有权限吧！' : '享受信任级别 ' + targetLevel + ' 的所有权限吧！'}
                            </div>
                            <div style="margin-top: 16px;">
                                <div class="ld-celebration-footer-title">
                                    <svg width="12" height="12" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 2s linear infinite;">
                                        ${getIconSvg('sparkles')}
                                    </svg>
                                    信任级别 ${currentLevel} ${isLevel3 ? '解锁完成' : '升级完成'}！
                                    <svg width="12" height="12" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 2s linear infinite;">
                                        ${getIconSvg('sparkles')}
                                    </svg>
                                </div>
                                <div class="ld-celebration-footer-subtitle">感谢你对社区的贡献 🌟</div>
                            </div>
                        </div>
                    </div>

                    <!-- 详细视图（默认隐藏） -->
                    <div class="ld-celebration-details" style="display: none; flex: 1; flex-direction: column; min-height: 0;">
                        <div class="ld-details-section ld-celebration-expanded" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                            <div class="ld-details-list ld-scroll-area" style="flex: 1; padding: 12px; overflow-y: auto; box-sizing: border-box;">`;

        // 添加所有达标项目 - 使用和普通版本相同的结构
        trustLevelDetails.items.forEach(item => {
            const iconType = getItemIcon(item.label);
            html += `
                <div class="ld-detail-item ld-celebration-item">
                    <div class="ld-detail-left">
                        <svg class="ld-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${getIconSvg(iconType)}
                        </svg>
                        <span class="ld-detail-label">${item.label}</span>
                    </div>
                    <div class="ld-detail-right">
                        <span class="ld-detail-current" style="color: #059669; font-weight: 600;">${item.current}</span><span class="ld-detail-target">/${item.required}</span>
                        <svg class="ld-detail-status ld-celebration-status passed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>`;
        });

        html += `
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 更新时间和刷新按钮 - 固定在底部 -->
                <div style="padding: 12px; background: #f9fafb; border-top: 1px solid #f3f4f6; flex-shrink: 0;">
                    <div style="text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                        更新于 ${updateTime.toLocaleString()}
                    </div>
                    <button class="ld-reload-btn">刷新数据</button>
                </div>
            </div>`;

        // 设置内容
        popup.innerHTML = html;

        // 事件监听器已通过全局事件委托处理，无需重复添加
        debugLog('普通版本内容已更新，事件监听器通过全局委托处理');
    }

    // 强制刷新数据的函数
    function forceRefreshData() {
        debugLog('强制刷新数据：清除缓存');
        // 清除所有相关缓存
        GM_setValue(STORAGE_KEY, null);
        GM_setValue(LAST_CHECK_KEY, 0);
        // 不清除LAST_USER_KEY，保留用户信息用于下次检测
        
        // 立即获取新数据
        fetchDataWithGM();
    }
    
    // 定期检查账号切换的机制
    let lastDetectedUser = getCurrentUsername();
    setInterval(() => {
        const currentDetectedUser = getCurrentUsername();
        if (currentDetectedUser && lastDetectedUser && currentDetectedUser !== lastDetectedUser) {
            debugLog(`定期检查发现账号切换: ${lastDetectedUser} -> ${currentDetectedUser}`);
            lastDetectedUser = currentDetectedUser;
            // 延迟一点时间再刷新，确保页面稳定
            setTimeout(() => {
                forceRefreshData();
            }, 1000);
        } else if (currentDetectedUser) {
            lastDetectedUser = currentDetectedUser;
        }
    }, 5000); // 每5秒检查一次
})();
