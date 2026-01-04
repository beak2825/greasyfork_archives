// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  Helper script for labex.io website
// @author       huhuhang
// @match        https://labex.io/*
// @match        https://labex.io/zh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labex.io
// @grant        GM_xmlhttpRequest
// @connect      labex-api-proxy.zhanghang.me
// @connect      top250.labex.io
// @downloadURL https://update.greasyfork.org/scripts/524275/LabEx%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524275/LabEx%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to detect system dark mode preference
    function prefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Function to get user theme preference (or default to system preference)
    function getUserThemePreference() {
        const savedPreference = localStorage.getItem('labex_theme_preference');
        if (savedPreference === 'light' || savedPreference === 'dark') {
            return savedPreference;
        }
        return prefersDarkMode() ? 'dark' : 'light';
    }

    // Function to save user theme preference
    function saveUserThemePreference(theme) {
        localStorage.setItem('labex_theme_preference', theme);
    }

    // Function to format timestamp into relative time
    function formatRelativeTime(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            const remainingMinutes = diffInMinutes % 60;
            let result = `${diffInHours}h`;
            if (remainingMinutes > 0) {
                result += `, ${remainingMinutes}m`;
            }
            return result + ' ago';
        }

        const diffInDays = Math.floor(diffInHours / 24);
        const remainingHours = diffInHours % 24;
        let result = `${diffInDays}d`;
        if (remainingHours > 0) {
            result += `, ${remainingHours}h`;
        }
        return result + ' ago';
    }

    // Function to show a notification
    function showNotification(message, type = 'success') {
        const isDarkMode = getUserThemePreference() === 'dark';
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translate(-50%, -100%);
            padding: 12px 20px;
            border-radius: 8px;
            color: #fff;
            font-family: 'Maple Mono NF CN','IBM Plex Mono', monospace;
            font-size: 14px;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        let iconSvg = '';
        if (type === 'success') {
            notification.style.backgroundColor = '#10B981';
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        } else if (type === 'error') {
            notification.style.backgroundColor = '#EF4444';
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (type === 'info') {
            notification.style.backgroundColor = '#3B82F6';
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        notification.innerHTML = `${iconSvg} <span>${message}</span>`;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, 0)';
        }, 10);

        // Animate out and remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Function to fetch and display lab data
    async function fetchAndDisplayLabData(labAlias, buttonContainer) {
        const apiUrl = `https://labex-api-proxy.zhanghang.me/feishu/labs/${labAlias}`;

        // Remove existing data container if any
        const existingDataContainer = buttonContainer.querySelector('.labex-stats-container');
        if (existingDataContainer) {
            existingDataContainer.remove();
        }

        const labDataContainer = document.createElement('div');
        labDataContainer.classList.add('labex-stats-container');

        // 获取当前主题模式
        const currentTheme = getUserThemePreference();

        // 根据主题设置样式
        const isDarkMode = currentTheme === 'dark';
        labDataContainer.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 0;
            background: ${isDarkMode ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
            backdrop-filter: blur(10px);
            padding: 10px 12px;
            border-radius: 12px;
            box-shadow: ${isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.12)'};
            font-size: 12px;
            color: ${isDarkMode ? '#E5E7EB' : '#374151'};
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 250px;
            width: 280px;
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.4s ease, transform 0.4s ease;
            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            z-index: 9998;
            pointer-events: auto;
        `;

        buttonContainer.appendChild(labDataContainer);

        // 创建加载动画 - 确保显眼易见
        labDataContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-header">
                <div class="loading-title">
                    <div class="pulse-ring"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    Loading Lab Stats...
                </div>
            </div>
            <div class="loading-skeleton">
                <div class="skeleton-row">
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                </div>
                <div class="skeleton-divider"></div>
                <div class="skeleton-row">
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                </div>
                <div class="skeleton-divider"></div>
                <div class="skeleton-row">
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                </div>
                <div class="skeleton-divider"></div>
                <div class="skeleton-badges">
                    <div class="skeleton-badge"></div>
                    <div class="skeleton-badge"></div>
                    <div class="skeleton-badge"></div>
                </div>
            </div>
            <div class="loading-stats">
                <div class="spinner"></div>
                <span class="loading-text">Fetching Lab data...</span>
            </div>
        </div>`;

        // 注入加载动画样式 - 增强视觉效果
        const loadingStyleSheet = document.createElement('style');
        loadingStyleSheet.textContent = `
            .loading-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                animation: fadeIn 0.3s ease;
            }
            .loading-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .loading-title {
                font-size: 13px;
                font-weight: 600;
                color: ${isDarkMode ? '#E5E7EB' : '#1f2937'};
                display: flex;
                align-items: center;
                gap: 5px;
                position: relative;
            }
            .pulse-ring {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #3b82f6;
                position: absolute;
                left: -5px;
                animation: pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            }
            @keyframes pulseRing {
                0% {
                    transform: scale(0.5);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
            .loading-skeleton {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 5px 0;
            }
            .skeleton-row {
                display: flex;
                gap: 8px;
                width: 100%;
            }
            .skeleton-item {
                height: 32px;
                flex: 1;
                background: ${isDarkMode ?
                'linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%)' :
                'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)'};
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite linear;
                border-radius: 6px;
                box-shadow: ${isDarkMode ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)'};
            }
            .skeleton-divider {
                height: 1px;
                width: 100%;
                background-color: ${isDarkMode ? '#3f3f46' : '#e5e7eb'};
                margin: 2px 0;
            }
            .skeleton-badges {
                display: flex;
                gap: 8px;
                width: 100%;
            }
            .skeleton-badge {
                height: 22px;
                flex: 1;
                background: ${isDarkMode ?
                'linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%)' :
                'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)'};
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite linear;
                border-radius: 6px;
                box-shadow: ${isDarkMode ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)'};
            }
            @keyframes shimmer {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0.7;
                }
                to {
                    opacity: 1;
                }
            }
            .loading-stats {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: ${isDarkMode ? '#9CA3AF' : '#4b5563'};
                margin-top: 4px;
                padding: 6px 8px;
                border-radius: 4px;
                background-color: ${isDarkMode ? 'rgba(37, 99, 235, 0.2)' : 'rgba(239, 246, 255, 0.7)'};
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                border: 1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
            }
            .loading-text {
                font-weight: 500;
            }
            .spinner {
                width: 12px;
                height: 12px;
                border: 2px solid #3b82f6;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            .pulse-dot {
                width: 8px;
                height: 8px;
                background-color: #3b82f6;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
            }
        `;
        labDataContainer.appendChild(loadingStyleSheet);

        // 立即显示卡片
        setTimeout(() => {
            if (labDataContainer && buttonContainer.contains(labDataContainer)) {
                labDataContainer.style.opacity = '1';
                labDataContainer.style.transform = 'translateY(0)';
            }
        }, 10);

        // Delay fetching data until after page load is complete
        // Use requestIdleCallback for browsers that support it, otherwise use setTimeout
        const fetchData = () => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: apiUrl,
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            const data = JSON.parse(response.responseText);
                            const learned = data.ALL_LEARNED || 0;
                            const passed = data.ALL_PASSED || 0;
                            const githubLink = data.GITHUB?.link;
                            const githubText = data.GITHUB?.text || 'GitHub';
                            const feeType = data.FEE_TYPE || 'N/A';
                            const positiveReviews = data.POSITIVE_REVIEW || 0;
                            const neutralReviews = data.NEUTRAL_REVIEW || 0;
                            const negativeReviews = data.NEGATIVE_REVIEW || 0;
                            const isVerified = data.VERIFIED === true;
                            const isOpenNetwork = data.OPEN_NETWORK === true;
                            const updatedAtTimestamp = data.UPDATE_AT; // Extract timestamp

                            // Format the timestamp as relative time
                            let relativeUpdatedAt = '';
                            if (updatedAtTimestamp) {
                                relativeUpdatedAt = formatRelativeTime(updatedAtTimestamp);
                            }

                            const totalReviews = positiveReviews + neutralReviews + negativeReviews;
                            const passRate = learned > 0 ? ((passed / learned) * 100).toFixed(1) : '0.0';
                            const positiveRate = totalReviews > 0 ? ((positiveReviews / totalReviews) * 100).toFixed(1) : '0.0';
                            const negativeRate = totalReviews > 0 ? ((negativeReviews / totalReviews) * 100).toFixed(1) : '0.0';
                            // 计算综合好评率（正面 + 中立）和差评率
                            const combinedPositiveReviews = positiveReviews + neutralReviews;
                            const combinedPositiveRate = totalReviews > 0 ? ((combinedPositiveReviews / totalReviews) * 100).toFixed(1) : '0.0';
                            const dislikeRate = totalReviews > 0 ? ((negativeReviews / totalReviews) * 100).toFixed(1) : '0.0';

                            // Build HTML structure for compact floating display
                            // Inject CSS for styling the stats
                            const styleSheet = document.createElement('style');
                            styleSheet.textContent = `
                                .labex-stats-container {
                                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                }
                                .labex-stats-container strong {
                                    font-weight: 600;
                                    color: ${isDarkMode ? '#E5E7EB' : '#1f2937'};
                                }
                                .labex-stats-container .title {
                                    font-size: 13px;
                                    font-weight: 600;
                                    color: ${isDarkMode ? '#E5E7EB' : '#1f2937'};
                                    margin-bottom: 6px;
                                    display: flex;
                                    align-items: center;
                                    gap: 5px;
                                    padding: 2px 0;
                                    opacity: 0;
                                    transform: translateY(8px);
                                    animation: fadeInUp 0.4s ease forwards;
                                    animation-delay: 0.1s;
                                }
                                .labex-stats-container .updated-at {
                                    font-size: 10px;
                                    color: ${isDarkMode ? '#9CA3AF' : '#6b7280'};
                                    margin-left: auto; /* Push to the right */
                                    font-weight: 400;
                                }
                                .stats-row {
                                    display: flex;
                                    width: 100%;
                                    justify-content: space-between;
                                    margin-bottom: 8px;
                                    padding: 5px;
                                    border-radius: 8px;
                                    opacity: 0;
                                    transform: translateY(8px);
                                    animation: fadeInUp 0.4s ease forwards;
                                }
                                .stats-row:nth-of-type(1) {
                                    animation-delay: 0.2s;
                                }
                                .stats-row:nth-of-type(2) {
                                    animation-delay: 0.3s;
                                }
                                .stats-row:nth-of-type(3) {
                                    animation-delay: 0.4s;
                                }
                                .badge-row {
                                    background-color: ${isDarkMode ? 'rgba(254, 243, 199, 0.1)' : 'rgba(254, 243, 199, 0.3)'}; /* 浅黄色背景 */
                                    border-radius: 8px;
                                    padding: 5px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: stretch;
                                    width: 100%;
                                    gap: 6px;
                                    opacity: 0;
                                    transform: translateY(8px);
                                    animation: fadeInUp 0.4s ease forwards;
                                    animation-delay: 0.5s;
                                }
                                .divider {
                                    height: 1px;
                                    background: ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'};
                                    margin: 6px 0;
                                    width: 100%;
                                    opacity: 0;
                                    animation: fadeIn 0.4s ease forwards;
                                }
                                .divider:nth-of-type(1) {
                                    animation-delay: 0.25s;
                                }
                                .divider:nth-of-type(2) {
                                    animation-delay: 0.35s;
                                }
                                .divider:nth-of-type(3) {
                                    animation-delay: 0.45s;
                                }
                                @keyframes fadeInUp {
                                    from {
                                        opacity: 0;
                                        transform: translateY(8px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                                @keyframes fadeIn {
                                    from {
                                        opacity: 0;
                                    }
                                    to {
                                        opacity: 1;
                                    }
                                }
                                .stat-item {
                                    flex: 1;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    background: ${isDarkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
                                    padding: 6px 4px;
                                    border-radius: 6px;
                                    min-width: 0;
                                    transition: all 0.2s ease;
                                    text-align: center;
                                    margin: 0 3px;
                                }
                                .stat-item:first-child {
                                    margin-left: 0;
                                }
                                .stat-item:last-child {
                                    margin-right: 0;
                                }
                                .stat-item:hover {
                                    background: ${isDarkMode ? 'rgba(60, 60, 60, 0.9)' : 'rgba(243, 244, 246, 0.9)'};
                                    transform: translateY(-2px);
                                }
                                .stat-item.positive-rate {
                                    background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(134, 239, 172, 0.7)'}; /* 浅绿色背景 */
                                    color: ${isDarkMode ? '#93c5fd' : '#065f46'};
                                }
                                .stat-item.positive-rate:hover {
                                    background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(134, 239, 172, 0.85)'};
                                }
                                .stat-item.negative-rate {
                                    background-color: ${isDarkMode ? 'rgba(248, 113, 113, 0.4)' : 'rgba(252, 165, 165, 0.7)'}; /* 浅红色背景 */
                                    color: ${isDarkMode ? '#fca5a5' : '#991b1b'};
                                }
                                .stat-item.negative-rate:hover {
                                    background-color: ${isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(252, 165, 165, 0.85)'};
                                }
                                .stat-item .value {
                                    font-weight: 600;
                                    color: ${isDarkMode ? '#E5E7EB' : '#1f2937'};
                                    font-size: 13px;
                                    text-align: center;
                                    width: 100%;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .stat-item .label {
                                    font-size: 10px;
                                    color: ${isDarkMode ? '#9CA3AF' : '#6b7280'};
                                    margin-top: 2px;
                                    text-align: center;
                                    width: 100%;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .badge {
                                    flex: 1 1 0;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 4px;
                                    padding: 5px 3px;
                                    border-radius: 6px;
                                    font-size: 10px;
                                    font-weight: 500;
                                    cursor: help;
                                    transition: all 0.2s ease;
                                    margin: 0;
                                    text-align: center;
                                    background: ${isDarkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
                                    min-width: 0;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .badge:first-child {
                                    margin-left: 0;
                                }
                                .badge:last-child {
                                    margin-right: 0;
                                }
                                .badge:hover {
                                    transform: translateY(-1px);
                                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                                }
                                .badge.verified {
                                    background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(134, 239, 172, 0.7)'}; /* 浅绿色背景 */
                                    color: ${isDarkMode ? '#93c5fd' : '#065f46'};
                                }
                                .badge.unverified {
                                    background-color: ${isDarkMode ? 'rgba(248, 113, 113, 0.4)' : 'rgba(252, 165, 165, 0.7)'}; /* 浅红色背景 */
                                    color: ${isDarkMode ? '#fca5a5' : '#991b1b'};
                                }
                                .badge.fee { background-color: ${isDarkMode ? '#374151' : '#f3f4f6'}; color: ${isDarkMode ? '#9CA3AF' : '#4b5563'}; }
                                .badge.network-open {
                                    background-color: ${isDarkMode ? 'rgba(248, 113, 113, 0.4)' : 'rgba(252, 165, 165, 0.7)'}; /* 浅红色背景 */
                                    color: ${isDarkMode ? '#fca5a5' : '#991b1b'};
                                }
                                .badge.network-closed {
                                    background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(134, 239, 172, 0.7)'}; /* 浅绿色背景 */
                                    color: ${isDarkMode ? '#93c5fd' : '#065f46'};
                                }
                                .badge.github {
                                    background-color: transparent;
                                    color: #3b82f6;
                                    text-decoration: none;
                                    cursor: pointer;
                                    border: 1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe'};
                                }
                                .badge.github svg {
                                    width: 11px; height: 11px;
                                }
                                .loading-stats {
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                    font-size: 12px;
                                    color: ${isDarkMode ? '#9CA3AF' : '#6b7280'};
                                }
                                .pulse-dot {
                                    width: 8px;
                                    height: 8px;
                                    background-color: #3b82f6;
                                    border-radius: 50%;
                                    animation: pulse 1.5s infinite;
                                }
                                @keyframes pulse {
                                    0% {
                                        transform: scale(0.8);
                                        opacity: 0.5;
                                    }
                                    50% {
                                        transform: scale(1.1);
                                        opacity: 1;
                                    }
                                    100% {
                                        transform: scale(0.8);
                                        opacity: 0.5;
                                    }
                                }
                            `;

                            labDataContainer.innerHTML = ``; // Clear previous content
                            labDataContainer.appendChild(styleSheet);

                            const contentWrapper = document.createElement('div');
                            contentWrapper.innerHTML = `
                                <div class="title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                    </svg>
                                    Lab Stats
                                    ${relativeUpdatedAt ? `<span class="updated-at" title="Last Data Update Time">⏱ ${relativeUpdatedAt}</span>` : ''}
                                </div>

                                <!-- 第一排：学习人数、通过人数、通过率 -->
                                <div class="stats-row">
                                    <div class="stat-item" title="Total Learners">
                                        <div class="value">${learned.toLocaleString()}</div>
                                        <div class="label">Learners</div>
                                    </div>
                                    <div class="stat-item" title="Students Passed">
                                        <div class="value">${passed.toLocaleString()}</div>
                                        <div class="label">Passed</div>
                                    </div>
                                    <div class="stat-item" title="Success Rate">
                                        <div class="value">${passRate}%</div>
                                        <div class="label">Pass Rate</div>
                                    </div>
                                </div>

                                <div class="divider"></div>

                                <!-- 第二排：好评、中立评价、差评 -->
                                <div class="stats-row">
                                    <div class="stat-item" title="Positive Reviews (${positiveRate}%)">
                                        <div class="value">${positiveReviews.toLocaleString()}</div>
                                        <div class="label">👍 Likes</div>
                                    </div>
                                    <div class="stat-item" title="Neutral Reviews">
                                        <div class="value">${neutralReviews.toLocaleString()}</div>
                                        <div class="label">😐 Neutral</div>
                                    </div>
                                    <div class="stat-item" title="Negative Reviews (${negativeRate}%)">
                                        <div class="value">${negativeReviews.toLocaleString()}</div>
                                        <div class="label">👎 Dislikes</div>
                                    </div>
                                </div>

                                <div class="divider"></div>

                                <!-- 新增：综合好评率和差评率 -->
                                <div class="stats-row">
                                    <div class="stat-item positive-rate" title="Combined Positive Rate (Likes + Neutral)">
                                        <div class="value">${combinedPositiveRate}%</div>
                                        <div class="label">😊 Approval</div>
                                    </div>
                                    <div class="stat-item negative-rate" title="Dislike Rate">
                                        <div class="value">${dislikeRate}%</div>
                                        <div class="label">😟 Dislike</div>
                                    </div>
                                </div>

                                <div class="divider"></div>

                                <!-- 第三排：验证状态、网络需求、GitHub 链接 -->
                                <div class="badge-row">
                                    <span class="badge ${isVerified ? 'verified' : 'unverified'}" title="${isVerified ? 'Verified Lab' : 'Not Verified'}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        ${isVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                    <span class="badge ${isOpenNetwork ? 'network-open' : 'network-closed'}" title="${isOpenNetwork ? 'Open Network Required' : 'No Open Network Required'}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        ${isOpenNetwork ? 'Open Net' : 'Local Net'}
                                    </span>
                                    ${githubLink ? `
                                    <a class="badge github" href="${githubLink}" target="_blank" title="${githubText}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                        GitHub
                                    </a>` : `
                                    <span class="badge fee">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        ${feeType}
                                    </span>`}
                                </div>
                            `;
                            labDataContainer.appendChild(contentWrapper);

                            // 添加渐入的整体动画效果
                            labDataContainer.style.opacity = '1';
                            labDataContainer.style.transform = 'translateY(0)';

                            // Add hover effects for Github link
                            const githubAnchor = labDataContainer.querySelector('a.github');
                            if (githubAnchor) {
                                githubAnchor.onmouseover = () => {
                                    githubAnchor.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe';
                                    githubAnchor.style.transform = 'translateY(-2px)';
                                    githubAnchor.style.boxShadow = isDarkMode ?
                                        '0 2px 5px rgba(59, 130, 246, 0.3)' :
                                        '0 2px 5px rgba(59, 130, 246, 0.2)';
                                };
                                githubAnchor.onmouseout = () => {
                                    githubAnchor.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                                    githubAnchor.style.transform = 'translateY(-1px)';
                                    githubAnchor.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
                                };
                            }
                        } else {
                            console.error('Failed to fetch lab data:', response.statusText);
                            labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444; padding: 15px; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                Unable to load data. Try again later.
                            </div>`;
                        }
                    },
                    onerror: function (error) {
                        console.error('Error fetching lab data:', error);
                        labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444; padding: 15px; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            Network error. Check connection.
                        </div>`;
                    }
                });
            } catch (error) {
                console.error('Error fetching or processing lab data:', error);
                labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444; padding: 15px; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Error processing data.
                </div>`;
            }
        };

        // Use requestIdleCallback if available, otherwise fall back to setTimeout
        if (window.requestIdleCallback) {
            window.requestIdleCallback(fetchData, { timeout: 2000 });
        } else {
            // Delay fetch by 1 second to ensure page has loaded
            setTimeout(fetchData, 1000);
        }
    }

    // 将主要逻辑封装成函数以便重用
    function initializeHelper() {
        // 移除现有的按钮容器（如果存在）
        const existingContainer = document.querySelector('.labex-helper-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // 获取当前主题模式
        const currentTheme = getUserThemePreference();
        const isDarkMode = currentTheme === 'dark';

        // 从 localStorage 中获取信息卡片显示状态，默认为显示
        let isStatsCardVisible = localStorage.getItem('labex_stats_card_visible') !== 'false';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('labex-helper-container');
        buttonContainer.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9999;
            font-family: Maple Mono NF CN, IBM Plex Mono, monospace;
        `;

        // Create menu container with modern design
        const menuContainer = document.createElement('div');
        menuContainer.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 4px;
            background: ${isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            backdrop-filter: blur(10px);
            padding: 8px;
            border-radius: 12px;
            box-shadow: ${isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.08)'};
            margin-bottom: 8px;
            min-width: 160px;
            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            transform-origin: bottom left;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // Modern style for menu items
        const createMenuItem = (text, icon, isDisabled = false) => {
            const item = document.createElement('button');
            item.innerHTML = `${icon} ${text}`;

            const baseStyles = `
                padding: 6px 10px;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
                font-size: 12px;
                font-weight: 500;
                color: ${isDisabled ? (isDarkMode ? '#6B7280' : '#9CA3AF') : (isDarkMode ? '#E5E7EB' : '#374151')};
                display: flex;
                align-items: center;
                gap: 6px;
                width: 100%;
                text-align: left;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
                opacity: ${isDisabled ? '0.6' : '1'};
            `;

            item.style.cssText = baseStyles;

            if (!isDisabled) {
                item.onmouseover = function () {
                    this.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(75, 85, 99, 0.08)';
                    this.style.transform = 'translateX(4px)';
                    this.style.color = isDarkMode ? '#F3F4F6' : '#4B5563';
                };
                item.onmouseout = function () {
                    this.style.backgroundColor = 'transparent';
                    this.style.transform = 'translateX(0)';
                    this.style.color = isDarkMode ? '#E5E7EB' : '#374151';
                };
            }

            return item;
        };

        // Modern floating button
        const floatingButton = document.createElement('button');
        floatingButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>`;
        floatingButton.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 14px;
            background: ${isDarkMode ?
                'linear-gradient(135deg, #2563EB, #1D4ED8)' :
                'linear-gradient(135deg, #4B5563, #374151)'};
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${isDarkMode ?
                '0 2px 10px rgba(37, 99, 235, 0.4)' :
                '0 2px 10px rgba(75, 85, 99, 0.3)'};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            position: relative;
        `;

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        // 处理鼠标按下事件，开始拖动
        buttonContainer.addEventListener('mousedown', function (e) {
            // 只在点击悬浮球而不是菜单时启用拖动
            if (!menuContainer.contains(e.target)) {
                isDragging = true;
                // 记录鼠标与按钮容器左上角的相对位置
                offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
                offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;

                // 更改光标样式
                buttonContainer.style.cursor = 'grabbing';

                // 防止拖动时触发按钮点击
                e.preventDefault();
            }
        });

        // 处理鼠标移动事件，实现拖动
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                // 计算新位置
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // 限制不超出视口
                newLeft = Math.max(10, Math.min(window.innerWidth - buttonContainer.offsetWidth - 10, newLeft));
                newTop = Math.max(10, Math.min(window.innerHeight - buttonContainer.offsetHeight - 10, newTop));

                // 更新位置
                buttonContainer.style.left = newLeft + 'px';
                buttonContainer.style.bottom = (window.innerHeight - newTop - buttonContainer.offsetHeight) + 'px';
            }
        });

        // 处理鼠标释放事件，停止拖动
        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                buttonContainer.style.cursor = 'default';
            }
        });

        // 鼠标离开窗口时停止拖动
        document.addEventListener('mouseleave', function () {
            if (isDragging) {
                isDragging = false;
                buttonContainer.style.cursor = 'default';
            }
        });

        // Toggle menu visibility
        let isMenuVisible = false;
        floatingButton.onclick = function (e) {
            if (!isDragging) {
                e.stopPropagation();
                isMenuVisible = !isMenuVisible;
                menuContainer.style.display = isMenuVisible ? 'flex' : 'none';
                menuContainer.style.zIndex = '9999'; // 确保菜单在最上层
                const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
                if (labDataContainer) {
                    if (isMenuVisible) {
                        labDataContainer.style.opacity = '0';
                        labDataContainer.style.transform = 'translateY(10px)';
                        labDataContainer.style.pointerEvents = 'none';
                    } else {
                        labDataContainer.style.opacity = '1';
                        labDataContainer.style.transform = 'translateY(0)';
                        labDataContainer.style.pointerEvents = 'auto';
                    }
                }
            }
        };

        // Close menu when clicking outside
        document.addEventListener('click', function () {
            if (isMenuVisible) {
                isMenuVisible = false;
                menuContainer.style.display = 'none';
                const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
                if (labDataContainer) {
                    labDataContainer.style.opacity = '1';
                    labDataContainer.style.transform = 'translateY(0)';
                }
            }
        });

        menuContainer.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // Button hover effect
        floatingButton.onmouseover = function () {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = isDarkMode ?
                '0 6px 24px rgba(37, 99, 235, 0.5)' :
                '0 6px 24px rgba(75, 85, 99, 0.4)';
        };

        floatingButton.onmouseout = function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = isDarkMode ?
                '0 4px 20px rgba(37, 99, 235, 0.4)' :
                '0 4px 20px rgba(75, 85, 99, 0.3)';
        };

        // Create menu items with Feather icons - check routes for disabled state
        const isLabsRoute = window.location.href.includes('/labs/');
        const isTutorialsRoute = window.location.href.includes('/tutorials/');

        const langMenuItem = createMenuItem('Switch Language', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>');
        const modeMenuItem = createMenuItem('Lab ⇌ Tutorial', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', !(isLabsRoute || isTutorialsRoute));
        const clearCacheMenuItem = createMenuItem('Clear Cache', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>');
        const quickStartMenuItem = createMenuItem('Playground', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>');
        const zenModeMenuItem = createMenuItem('Zen Mode', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>', !isLabsRoute);
        const submitToGSCMenuItem = createMenuItem('Submit to GSC', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>');
        const closeMenuItem = createMenuItem('Close Helper', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');

        // 添加信息卡片切换菜单项
        const toggleStatsCardMenuItem = createMenuItem(
            isStatsCardVisible ? 'Hide Stats Card' : 'Show Stats Card',
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
            !(isLabsRoute || isTutorialsRoute) // 修改这里，让它在 labs 和 tutorials 页面都可用
        );

        // 信息卡片切换功能
        toggleStatsCardMenuItem.onclick = function (e) {
            e.stopPropagation();
            isStatsCardVisible = !isStatsCardVisible;
            localStorage.setItem('labex_stats_card_visible', isStatsCardVisible.toString());

            // 更新菜单项文本
            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> ${isStatsCardVisible ? 'Hide Stats Card' : 'Show Stats Card'}`;

            // 隐藏或显示统计卡片
            const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
            if (labDataContainer) {
                if (isStatsCardVisible) {
                    labDataContainer.style.display = 'flex';
                    labDataContainer.style.pointerEvents = 'auto'; // 允许统计卡片接收点击事件
                    setTimeout(() => {
                        labDataContainer.style.opacity = '1';
                        labDataContainer.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    labDataContainer.style.opacity = '0';
                    labDataContainer.style.transform = 'translateY(10px)';
                    labDataContainer.style.pointerEvents = 'none';
                    setTimeout(() => {
                        labDataContainer.style.display = 'none';
                    }, 300); // 等待过渡动画完成
                }
            } else if (isStatsCardVisible && isLabsRoute) {
                // 如果卡片不存在但用户选择显示且在实验室页面，则重新获取数据
                const currentUrl = window.location.href;
                const labMatch = currentUrl.match(/\/labs\/([^\/?#]+)/);
                if (labMatch && labMatch[1]) {
                    const labAlias = labMatch[1];
                    fetchAndDisplayLabData(labAlias, buttonContainer);
                }
            }

            // 关闭菜单
            isMenuVisible = false;
            menuContainer.style.display = 'none';
        };

        // Submit to GSC functionality
        submitToGSCMenuItem.onclick = function (e) {
            e.stopPropagation();

            const urlToSubmit = window.location.origin + window.location.pathname;

            showNotification('Submitting URL to Google...', 'info');

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://top250.labex.io/api/index-url",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    url: urlToSubmit
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            showNotification(result.message || 'URL submitted successfully.', 'success');
                        } catch (e) {
                            showNotification('Successfully submitted, but failed to parse response.', 'success');
                        }
                    } else {
                        try {
                            const errorResult = JSON.parse(response.responseText);
                            showNotification(`Error: ${errorResult.message || response.statusText}`, 'error');
                        } catch (e) {
                            showNotification(`Error: ${response.statusText}`, 'error');
                        }
                    }
                },
                onerror: function () {
                    showNotification('Network error while submitting URL.', 'error');
                }
            });

            // Close the menu
            isMenuVisible = false;
            menuContainer.style.display = 'none';
        };

        // IBM Plex Mono Font Toggle functionality
        let isPlexFontEnabled = localStorage.getItem('labex_use_plex_font') === 'true';
        const plexFontMenuItem = createMenuItem(
            isPlexFontEnabled ? 'Disable Mono' : 'Enable Mono',
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>'
        );

        // Function to apply IBM Plex Mono font
        const applyPlexFont = () => {
            const styleId = 'labex-plex-font-style';

            if (isPlexFontEnabled) {
                // Create style element if it doesn't exist
                if (!document.getElementById(styleId)) {
                    const styleElement = document.createElement('style');
                    styleElement.id = styleId;
                    styleElement.textContent = `
                        * {
                            font-family: 'Maple Mono NF CN','IBM Plex Mono', monospace !important;
                        }
                    `;
                    document.head.appendChild(styleElement);
                }
            } else {
                // Remove style if it exists
                const existingStyle = document.getElementById(styleId);
                if (existingStyle) {
                    existingStyle.remove();
                }
            }
        };

        // Toggle IBM Plex Mono font
        plexFontMenuItem.onclick = function (e) {
            e.stopPropagation();
            isPlexFontEnabled = !isPlexFontEnabled;
            localStorage.setItem('labex_use_plex_font', isPlexFontEnabled);

            // Update menu item text
            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg> ${isPlexFontEnabled ? 'Disable Mono' : 'Enable Mono'}`;

            // Apply or remove the font
            applyPlexFont();
        };

        // Apply font on page load if enabled
        applyPlexFont();

        // Modern language submenu
        const langSubmenu = document.createElement('div');
        langSubmenu.style.cssText = `
            display: none;
            position: absolute;
            left: -12px;
            right: -12px;
            bottom: 100%;
            background: ${isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            backdrop-filter: blur(10px);
            padding: 10px;
            border-radius: 16px;
            box-shadow: ${isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.08)'};
            margin-bottom: 24px;
            flex-direction: column;
            gap: 4px;
            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        `;

        const languages = [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'ko', name: '한국어', flag: '🇰🇷' },
            { code: 'pt', name: 'Português', flag: '🇧🇷' },
        ];

        languages.forEach(lang => {
            const langOption = createMenuItem(lang.name, lang.flag);
            langOption.onclick = function (e) {
                e.stopPropagation();
                const currentUrl = window.location.href;
                const baseUrl = 'labex.io/';
                const urlParts = currentUrl.split(baseUrl);

                if (urlParts.length > 1) {
                    let path = urlParts[1];
                    path = path.replace(/^(zh|es|fr|de|ja|ru|ko|pt)\//, '');
                    const newPath = lang.code === 'en' ? path : `${lang.code}/${path}`;
                    const newUrl = `${urlParts[0]}${baseUrl}${newPath}`;
                    window.location.href = newUrl;
                }
            };
            langSubmenu.appendChild(langOption);
        });

        // Toggle language submenu on click
        let isLangSubmenuVisible = false;
        langMenuItem.onclick = function (e) {
            e.stopPropagation();
            isLangSubmenuVisible = !isLangSubmenuVisible;
            langSubmenu.style.display = isLangSubmenuVisible ? 'flex' : 'none';
        };

        const langMenuWrapper = document.createElement('div');
        langMenuWrapper.style.position = 'relative';
        langMenuWrapper.appendChild(langMenuItem);
        langMenuWrapper.appendChild(langSubmenu);

        // Close language submenu when clicking outside
        document.addEventListener('click', function () {
            if (isLangSubmenuVisible) {
                isLangSubmenuVisible = false;
                langSubmenu.style.display = 'none';
            }
        });

        langSubmenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // Mode switch functionality
        modeMenuItem.onclick = function () {
            // Skip if disabled
            if (!(isLabsRoute || isTutorialsRoute)) return;

            const currentUrl = window.location.href;
            let newUrl;

            if (currentUrl.includes('/tutorials/')) {
                newUrl = currentUrl.replace('/tutorials/', '/labs/');
            } else if (currentUrl.includes('/labs/')) {
                newUrl = currentUrl.replace('/labs/', '/tutorials/');
            }

            if (newUrl) {
                window.location.href = newUrl;
            }
        };

        // Clear cache functionality
        clearCacheMenuItem.onclick = async function () {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload(true);
            } catch (error) {
                console.error('Failed to clear cache:', error);
                alert('Failed to clear cache. Please try again.');
            }
        };

        // Zen Mode functionality
        zenModeMenuItem.onclick = function () {
            // Skip if disabled
            if (!isLabsRoute) return;

            const currentUrl = window.location.href;
            // Only work on lab pages
            if (currentUrl.includes('/labs/')) {
                const url = new URL(currentUrl);
                const hasParams = url.searchParams.has('hidelabby') || url.searchParams.has('hideheader');

                if (hasParams) {
                    // Remove zen mode parameters
                    url.searchParams.delete('hidelabby');
                    url.searchParams.delete('hideheader');
                } else {
                    // Add zen mode parameters
                    url.searchParams.set('hidelabby', 'true');
                    url.searchParams.set('hideheader', 'true');
                }

                window.location.href = url.toString();
            }
        };

        // Add tooltips to explain disabled state
        if (!isLabsRoute) {
            zenModeMenuItem.title = "Zen Mode is only available on Lab pages";
        }

        if (!(isLabsRoute || isTutorialsRoute)) {
            modeMenuItem.title = "Mode switch is only available on Lab or Tutorial pages";
        }

        // Hide the entire button container when close menu item is clicked
        closeMenuItem.onclick = function (e) {
            e.stopPropagation();
            buttonContainer.style.display = 'none';
        };

        // Playground functionality
        quickStartMenuItem.onclick = function (e) {
            e.stopPropagation();
            // Close the main menu first
            isMenuVisible = false;
            menuContainer.style.display = 'none';

            showQuickStartModal('https://labex.io/labs/linux-your-first-linux-lab-270253?hidelabby=true&hideheader=true');
        };

        // Function to show Playground modal
        function showQuickStartModal(url) {

            // --- Helper Function Definitions FIRST ---
            let dragTarget = null, resizeTarget = null, iframeTarget = null; // Track elements
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; // Drag positions
            let initialWidth, initialHeight, initialMouseX, initialMouseY; // Resize positions
            let currentResizer = null; // Current resize handle

            const closeModal = () => {
                // Remove backdrop references
                const modal = document.getElementById('quick-start-modal');
                // if (backdrop) backdrop.style.opacity = '0'; // Removed backdrop line
                if (modal) {
                    modal.style.opacity = '0';
                    modal.style.transform = 'scale(0.95)';
                }
                setTimeout(() => {
                    document.removeEventListener('mousemove', elementDrag);
                    document.removeEventListener('mouseup', closeDragElement);
                    document.removeEventListener('mousemove', elementResize);
                    document.removeEventListener('mouseup', closeResizeElement);
                    // if (backdrop) backdrop.remove(); // Removed backdrop line
                    if (modal) modal.remove();
                }, 300);
            };

            function dragMouseDown(e) {
                dragTarget = document.getElementById('quick-start-modal');
                if (!dragTarget || !(e.target === modalHeader || e.target === headerTitle)) return; // Only drag by header
                e.preventDefault();
                pos3 = e.clientX; pos4 = e.clientY;
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
                if (modalHeader) modalHeader.style.cursor = 'grabbing';
            }

            function elementDrag(e) {
                if (!dragTarget) return;
                e.preventDefault();
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                let newTop = dragTarget.offsetTop - pos2;
                let newLeft = dragTarget.offsetLeft - pos1;
                const maxTop = window.innerHeight - dragTarget.offsetHeight;
                const maxLeft = window.innerWidth - dragTarget.offsetWidth;
                dragTarget.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
                dragTarget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
            }

            function closeDragElement() {
                if (modalHeader) modalHeader.style.cursor = 'grab';
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
                dragTarget = null;
            }

            function resizeMouseDown(e, side) {
                resizeTarget = document.getElementById('quick-start-modal');
                iframeTarget = resizeTarget?.querySelector('iframe');
                if (!resizeTarget) return;
                e.preventDefault();
                currentResizer = side;
                initialWidth = resizeTarget.offsetWidth;
                initialHeight = resizeTarget.offsetHeight;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                document.addEventListener('mousemove', elementResize);
                document.addEventListener('mouseup', closeResizeElement);
                if (iframeTarget) iframeTarget.style.pointerEvents = 'none';
            }

            function elementResize(e) {
                if (!currentResizer || !resizeTarget) return;
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;
                let newWidth = initialWidth;
                let newHeight = initialHeight;
                if (currentResizer.includes('e')) newWidth = initialWidth + dx;
                if (currentResizer.includes('s')) newHeight = initialHeight + dy;
                resizeTarget.style.width = Math.max(parseInt(resizeTarget.style.minWidth, 10) || 300, newWidth) + 'px';
                resizeTarget.style.height = Math.max(parseInt(resizeTarget.style.minHeight, 10) || 200, newHeight) + 'px';
            }

            function closeResizeElement() {
                if (iframeTarget) iframeTarget.style.pointerEvents = 'auto';
                document.removeEventListener('mousemove', elementResize);
                document.removeEventListener('mouseup', closeResizeElement);
                currentResizer = null; resizeTarget = null; iframeTarget = null;
            }

            // --- Element Creation & Setup ---
            // Remove existing modal/backdrop first to prevent duplicates
            document.getElementById('quick-start-modal')?.remove();
            // document.getElementById('quick-start-backdrop')?.remove(); // Removed backdrop line

            const isDarkMode = getUserThemePreference() === 'dark';

            /* // Removed backdrop creation
            const backdrop = document.createElement('div');
            backdrop.id = 'quick-start-backdrop';
            backdrop.style.cssText = `...`;
            */

            const modal = document.createElement('div');
            modal.id = 'quick-start-modal';
            modal.style.cssText = `
                position: fixed;
                top: 5vh; left: 5vw; width: 90vw; height: 90vh;
                min-width: 300px; min-height: 200px;
                background-color: ${isDarkMode ? '#1f2937' : '#ffffff'};
                border-radius: 16px;
                box-shadow: ${isDarkMode ? '0 10px 30px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.15)'};
                z-index: 10001;
                display: flex; flex-direction: column; overflow: hidden;
                opacity: 0; transform: scale(0.95);
                transition: opacity 0.3s ease, transform 0.3s ease;
                border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            `;

            const modalHeader = document.createElement('div');
            modalHeader.style.cssText = `
                height: 40px;
                background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
                border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                cursor: grab;
                display: flex; align-items: center; padding: 0 12px;
                flex-shrink: 0; position: relative;
            `;
            modalHeader.onmousedown = dragMouseDown; // Assign drag handler

            const headerTitle = document.createElement('span');
            headerTitle.textContent = 'Playground';
            headerTitle.style.cssText = `
                font-size: 14px; font-weight: 600;
                color: ${isDarkMode ? '#E5E7EB' : '#374151'};
                pointer-events: none; /* Prevent title from interfering with drag */
            `;
            modalHeader.appendChild(headerTitle);

            const closeButton = document.createElement('button');
            closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            closeButton.style.cssText = `
                position: absolute; top: 50%; right: 10px; transform: translateY(-50%);
                background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
                border: none; border-radius: 50%; cursor: pointer; padding: 5px;
                display: flex; align-items: center; justify-content: center;
                color: ${isDarkMode ? '#9CA3AF' : '#6B7280'};
                transition: background-color 0.2s ease, color 0.2s ease; z-index: 2;
            `;
            closeButton.onmouseover = () => {
                closeButton.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                closeButton.style.color = isDarkMode ? '#E5E7EB' : '#374151';
            };
            closeButton.onmouseout = () => {
                closeButton.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                closeButton.style.color = isDarkMode ? '#9CA3AF' : '#6B7280';
            };
            closeButton.onclick = closeModal;
            modalHeader.appendChild(closeButton);

            const iframeContainer = document.createElement('div');
            iframeContainer.style.cssText = `flex-grow: 1; position: relative; overflow: hidden;`;

            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.cssText = `width: 100%; height: 100%; border: none; display: block;`;
            iframeContainer.appendChild(iframe);

            // Create and add resize handles
            const createResizeHandle = (cursor, side) => {
                const handle = document.createElement('div');
                handle.style.cssText = `
                    position: absolute;
                    background: transparent;
                    z-index: 1; /* Ensure handles are clickable */
                    ${side === 'se' ? 'width: 15px; height: 15px; bottom: 0; right: 0; cursor: nwse-resize;' :
                        side === 'e' ? 'width: 10px; height: 100%; top: 0; right: 0; cursor: ew-resize;' :
                            side === 's' ? 'width: 100%; height: 10px; bottom: 0; left: 0; cursor: ns-resize;' : ''}
                `;
                handle.onmousedown = (e) => resizeMouseDown(e, side);
                return handle;
            };
            iframeContainer.appendChild(createResizeHandle('nwse-resize', 'se'));
            iframeContainer.appendChild(createResizeHandle('ew-resize', 'e'));
            iframeContainer.appendChild(createResizeHandle('ns-resize', 's'));

            // Assemble modal
            modal.appendChild(modalHeader);
            modal.appendChild(iframeContainer);

            // Add to body & show
            // document.body.appendChild(backdrop); // Removed backdrop line
            document.body.appendChild(modal);
            requestAnimationFrame(() => {
                // backdrop.style.opacity = '1'; // Removed backdrop line
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            });

            // Add backdrop click listener AFTER creating elements
            // backdrop.onclick = closeModal; // Removed backdrop line
        }

        // Theme toggle menu item
        const themeMenuItem = createMenuItem(
            isDarkMode ? 'Light Mode' : 'Dark Mode',
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${isDarkMode ?
                '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' :
                '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'}
            </svg>`
        );

        // Toggle theme functionality
        themeMenuItem.onclick = function (e) {
            e.stopPropagation();
            const newTheme = isDarkMode ? 'light' : 'dark';
            saveUserThemePreference(newTheme);
            window.location.reload(); // Reload to apply theme changes everywhere
        };

        // Update menu items addition
        menuContainer.appendChild(langMenuWrapper);
        menuContainer.appendChild(modeMenuItem);
        menuContainer.appendChild(quickStartMenuItem);
        menuContainer.appendChild(zenModeMenuItem);
        menuContainer.appendChild(plexFontMenuItem);
        menuContainer.appendChild(toggleStatsCardMenuItem); // 添加信息卡片切换选项
        menuContainer.appendChild(submitToGSCMenuItem);
        menuContainer.appendChild(themeMenuItem); // 添加主题切换选项
        menuContainer.appendChild(clearCacheMenuItem);
        menuContainer.appendChild(closeMenuItem);

        // Add elements to container
        buttonContainer.appendChild(menuContainer);
        buttonContainer.appendChild(floatingButton);

        // Add container to page
        document.body.appendChild(buttonContainer);

        // --- Lab Data Fetching Logic ---
        const currentUrl = window.location.href;
        // 修改匹配逻辑，同时支持 labs 和 tutorials
        const contentMatch = currentUrl.match(/\/(labs|tutorials)\/([^\/?#]+)/);
        if (contentMatch && contentMatch[2] && isStatsCardVisible) {
            const contentAlias = contentMatch[2];
            fetchAndDisplayLabData(contentAlias, buttonContainer);

            // 确保统计卡片上的链接可点击
            setTimeout(() => {
                const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
                if (labDataContainer) {
                    labDataContainer.style.pointerEvents = 'auto';

                    // 处理菜单和卡片的显示优先级
                    document.addEventListener('click', function (e) {
                        // 当点击菜单按钮且菜单打开时，暂时禁用卡片的点击事件
                        if (isMenuVisible && !menuContainer.contains(e.target)) {
                            const statsCard = buttonContainer.querySelector('.labex-stats-container');
                            if (statsCard) {
                                statsCard.style.pointerEvents = 'none';
                            }
                        }
                    });
                }
            }, 1500);
        }
        // --- End Lab Data Fetching Logic ---
    }

    // Wait for the page to fully load before initializing the helper initially
    window.addEventListener('load', () => {
        initializeHelper();
    });

    // 监听 URL 变化 (for SPA navigations)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeHelper();
        }
    }).observe(document, { subtree: true, childList: true });

})();