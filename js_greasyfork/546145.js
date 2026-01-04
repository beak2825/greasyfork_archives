// ==UserScript==
// @name         ERP 销售数据面板
// @namespace    http://tampermonkey.net/
// @version      3.4.1
// @author       keney
// @description  Modern sales analytics dashboard with beautiful UI, advanced features, data export, filtering, and comprehensive reporting tools
// @author       Advanced Analytics Team
// @match        http://erpx.htran.ltd/*
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      erpx.htran.ltd
// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js
// @require      https://cdn.tailwindcss.com
// @require      https://unpkg.com/lucide@latest/dist/umd/lucide.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546145/ERP%20%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/546145/ERP%20%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple script executions
    if (window.__salesAnalyticsScriptRan) {
        console.log('Advanced Sales Analytics script already ran, exiting to prevent duplicates');
        return;
    }
    window.__salesAnalyticsScriptRan = true;

    console.log('Advanced Sales Analytics Dashboard started at', new Date().toISOString());
    console.log('Current URL:', window.location.href);

    // Global error handler for the script
    window.addEventListener('error', (event) => {
        if (event.filename && event.filename.includes('Advanced-Sales-Analytics-Dashboard')) {
            console.error('Sales Analytics Dashboard Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
            // Don't let errors crash the entire script
            event.preventDefault();
        }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Sales Analytics Dashboard Promise Rejection:', event.reason);
        event.preventDefault();
    });

    // Initialize Tailwind CSS configuration with proper loading check
    function initializeTailwind() {
        if (document.getElementById('tailwind-config')) {
            return; // Already initialized
        }

        // Check if Tailwind is available
        function configureTailwind() {
            try {
                if (typeof tailwind !== 'undefined' && tailwind.config) {
                    const tailwindConfig = document.createElement('script');
                    tailwindConfig.id = 'tailwind-config';
                    tailwindConfig.innerHTML = `
                        try {
                            tailwind.config = {
                                darkMode: 'class',
                                theme: {
                                    extend: {
                                        colors: {
                                            border: "hsl(var(--border))",
                                            input: "hsl(var(--input))",
                                            ring: "hsl(var(--ring))",
                                            background: "hsl(var(--background))",
                                            foreground: "hsl(var(--foreground))",
                                            primary: {
                                                DEFAULT: "hsl(var(--primary))",
                                                foreground: "hsl(var(--primary-foreground))",
                                            },
                                            secondary: {
                                                DEFAULT: "hsl(var(--secondary))",
                                                foreground: "hsl(var(--secondary-foreground))",
                                            },
                                            destructive: {
                                                DEFAULT: "hsl(var(--destructive))",
                                                foreground: "hsl(var(--destructive-foreground))",
                                            },
                                            muted: {
                                                DEFAULT: "hsl(var(--muted))",
                                                foreground: "hsl(var(--muted-foreground))",
                                            },
                                            accent: {
                                                DEFAULT: "hsl(var(--accent))",
                                                foreground: "hsl(var(--accent-foreground))",
                                            },
                                            popover: {
                                                DEFAULT: "hsl(var(--popover))",
                                                foreground: "hsl(var(--popover-foreground))",
                                            },
                                            card: {
                                                DEFAULT: "hsl(var(--card))",
                                                foreground: "hsl(var(--card-foreground))",
                                            },
                                        },
                                    }
                                }
                            };
                            console.log('Tailwind CSS configured successfully');
                        } catch (error) {
                            console.warn('Failed to configure Tailwind CSS:', error);
                        }
                    `;
                    document.head.appendChild(tailwindConfig);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.warn('Tailwind CSS not available yet:', error);
                return false;
            }
        }

        // Try to configure immediately
        if (!configureTailwind()) {
            // If not available, wait and retry
            let retryCount = 0;
            const maxRetries = 10;
            const retryInterval = 500;

            const retryConfiguration = () => {
                if (retryCount >= maxRetries) {
                    console.warn('Tailwind CSS configuration failed after maximum retries. Styles may not work correctly.');
                    return;
                }

                if (configureTailwind()) {
                    console.log('Tailwind CSS configured successfully after', retryCount + 1, 'attempts');
                } else {
                    retryCount++;
                    setTimeout(retryConfiguration, retryInterval);
                }
            };

            setTimeout(retryConfiguration, retryInterval);
        }
    }

    // Initialize CSS variables for shadcn/ui theme
    function initializeTheme() {
        if (!document.getElementById('shadcn-theme')) {
            const themeStyle = document.createElement('style');
            themeStyle.id = 'shadcn-theme';
            themeStyle.innerHTML = `
                /* 修复导航栏显示问题 - 确保原网站的.collapse样式正常工作 */
                .navbar-collapse.collapse {
                    visibility: visible !important;
                    display: block !important;
                }

                /* 为我们的组件使用独特的ID选择器，避免样式冲突 */
                #analytics-fab-container {
                    position: fixed;
                    top: 50%;
                    right: 24px;
                    transform: translateY(-50%);
                    z-index: 9999;
                }

                #analytics-dashboard-container {
                    position: fixed;
                    left: 16px;
                    right: 16px;
                    bottom: 16px;
                    z-index: 9998;
                    /* 初始状态完全隐藏，不占用页面位置 */
                    display: none;
                    visibility: hidden;
                    opacity: 0;
                    transform: scale(0.95);
                    transition: all 0.3s ease-in-out;
                }

                #analytics-dashboard-container.show {
                    display: block;
                    visibility: visible;
                    opacity: 1;
                    transform: scale(1);
                }

                :root {
                    --background: 0 0% 100%;
                    --foreground: 222.2 84% 4.9%;
                    --card: 0 0% 100%;
                    --card-foreground: 222.2 84% 4.9%;
                    --popover: 0 0% 100%;
                    --popover-foreground: 222.2 84% 4.9%;
                    --primary: 221.2 83.2% 53.3%;
                    --primary-foreground: 210 40% 98%;
                    --secondary: 210 40% 96%;
                    --secondary-foreground: 222.2 84% 4.9%;
                    --muted: 210 40% 96%;
                    --muted-foreground: 215.4 16.3% 46.9%;
                    --accent: 210 40% 96%;
                    --accent-foreground: 222.2 84% 4.9%;
                    --destructive: 0 84.2% 60.2%;
                    --destructive-foreground: 210 40% 98%;
                    --border: 214.3 31.8% 91.4%;
                    --input: 214.3 31.8% 91.4%;
                    --ring: 221.2 83.2% 53.3%;
                    --radius: 0.5rem;
                }

                .dark {
                    --background: 222.2 84% 4.9%;
                    --foreground: 210 40% 98%;
                    --card: 222.2 84% 4.9%;
                    --card-foreground: 210 40% 98%;
                    --popover: 222.2 84% 4.9%;
                    --popover-foreground: 210 40% 98%;
                    --primary: 217.2 91.2% 59.8%;
                    --primary-foreground: 222.2 84% 4.9%;
                    --secondary: 217.2 32.6% 17.5%;
                    --secondary-foreground: 210 40% 98%;
                    --muted: 217.2 32.6% 17.5%;
                    --muted-foreground: 215 20.2% 65.1%;
                    --accent: 217.2 32.6% 17.5%;
                    --accent-foreground: 210 40% 98%;
                    --destructive: 0 62.8% 30.6%;
                    --destructive-foreground: 210 40% 98%;
                    --border: 217.2 32.6% 17.5%;
                    --input: 217.2 32.6% 17.5%;
                    --ring: 224.3 76.3% 94.1%;
                }
            `;
            document.head.appendChild(themeStyle);
        }
    }

    // Global state management
    const state = {
        isVisible: false,
        isMinimized: false,
        isFullscreen: false,
        isDarkMode: false,
        currentView: 'chart', // chart, table, export, settings
        dateRange: 7, // days
        selectedSalespeople: new Set(),
        chartType: 'line', // line, bar, area
        dataCache: null,
        lastFetchTime: null,
        historicalData: new Map(), // 存储历史数据
        maxHistoryDays: 180 // 最多保存180天的历史数据
    };

    // 历史数据管理器
    const HistoryManager = {
        // 存储键名
        STORAGE_KEY: 'sales_analytics_history',

        // 从本地存储加载历史数据
        loadHistory() {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    const data = JSON.parse(stored);
                    // 转换为 Map 对象
                    state.historicalData = new Map(Object.entries(data.history || {}));
                    console.log(`Loaded ${state.historicalData.size} days of historical data`);
                }
            } catch (error) {
                console.error('Failed to load historical data:', error);
                state.historicalData = new Map();
            }
        },

        // 保存历史数据到本地存储 - 异步化避免阻塞UI
        saveHistory() {
            // 使用requestIdleCallback异步保存，避免阻塞主线程
            const saveTask = () => {
                try {
                    const data = {
                        history: Object.fromEntries(state.historicalData),
                        lastUpdated: new Date().toISOString(),
                        version: '1.0'
                    };
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                    console.log(`Saved ${state.historicalData.size} days of historical data`);
                } catch (error) {
                    console.error('Failed to save historical data:', error);
                }
            };

            if (window.requestIdleCallback) {
                requestIdleCallback(saveTask);
            } else {
                setTimeout(saveTask, 0);
            }
        },

        // 添加新的数据到历史记录
        addDailyData(dateString, salesData) {
            // 为每个日期创建一个唯一的数据快照
            const dayData = {
                date: dateString,
                timestamp: new Date().toISOString(),
                salesData: salesData.map(item => ({
                    name: item.name,
                    totalCount: item.totalCount || 0,
                    yMDString: item.yMDString
                })),
                totalSales: salesData.reduce((sum, item) => sum + (item.totalCount || 0), 0)
            };

            state.historicalData.set(dateString, dayData);

            // 清理过期数据（超过最大保存天数）
            this.cleanOldData();

            // 保存到本地存储
            this.saveHistory();
        },

        // 清理过期的历史数据
        cleanOldData() {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - state.maxHistoryDays);

            for (const [dateString] of state.historicalData) {
                const date = new Date(dateString);
                if (date < cutoffDate) {
                    state.historicalData.delete(dateString);
                }
            }
        },

        // 获取指定日期范围的历史数据
        getHistoryRange(days) {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days + 1);

            const result = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                const dayData = state.historicalData.get(dateString);
                if (dayData) {
                    result.push(dayData);
                }
            }

            return result;
        },

        // 检查今天的数据是否需要更新
        shouldUpdateToday() {
            const today = new Date().toISOString().split('T')[0];
            const todayData = state.historicalData.get(today);

            if (!todayData) return true;

            // 如果今天的数据超过1小时没更新，则需要更新
            const lastUpdate = new Date(todayData.timestamp);
            const now = new Date();
            const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);

            return hoursSinceUpdate >= 1;
        },

        // 获取可用的历史日期范围
        getAvailableDateRange() {
            if (state.historicalData.size === 0) return null;

            const dates = Array.from(state.historicalData.keys()).sort();
            return {
                startDate: dates[0],
                endDate: dates[dates.length - 1],
                totalDays: dates.length
            };
        },

        // 获取历史数据统计信息
        getDataStatistics() {
            const totalDays = state.historicalData.size;
            let totalRecords = 0;
            let totalSales = 0;
            const salespeople = new Set();

            for (const [, dayData] of state.historicalData) {
                if (dayData.salesData) {
                    totalRecords += dayData.salesData.length;
                    dayData.salesData.forEach(item => {
                        totalSales += item.totalCount || 0;
                        salespeople.add(item.name);
                    });
                }
            }

            return {
                totalDays,
                totalRecords,
                totalSales,
                uniqueSalespeople: salespeople.size,
                averageDailySales: totalDays > 0 ? Math.round(totalSales / totalDays) : 0,
                dataSize: this.getStorageSize()
            };
        },

        // 获取存储大小（KB）
        getStorageSize() {
            try {
                const data = localStorage.getItem(this.STORAGE_KEY);
                return data ? Math.round(data.length / 1024 * 100) / 100 : 0;
            } catch (error) {
                return 0;
            }
        },

        // 删除指定日期范围的数据
        deleteDataRange(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            let deletedCount = 0;

            for (const [dateString] of state.historicalData) {
                const date = new Date(dateString);
                if (date >= start && date <= end) {
                    state.historicalData.delete(dateString);
                    deletedCount++;
                }
            }

            if (deletedCount > 0) {
                this.saveHistory();
            }

            return deletedCount;
        },

        // 导入历史数据
        importData(importedData) {
            try {
                if (!importedData.history) {
                    throw new Error('Invalid data format: missing history field');
                }

                let importedCount = 0;
                let overwrittenCount = 0;
                const conflicts = [];

                for (const [dateString, dayData] of Object.entries(importedData.history)) {
                    if (state.historicalData.has(dateString)) {
                        conflicts.push(dateString);
                        overwrittenCount++;
                    } else {
                        importedCount++;
                    }
                    state.historicalData.set(dateString, dayData);
                }

                // 清理过期数据
                this.cleanOldData();

                // 保存到本地存储
                this.saveHistory();

                return {
                    success: true,
                    importedCount,
                    overwrittenCount,
                    conflicts,
                    totalDays: state.historicalData.size
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // 导出指定日期范围的数据
        exportDataRange(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const exportData = {};

            for (const [dateString, dayData] of state.historicalData) {
                const date = new Date(dateString);
                if (date >= start && date <= end) {
                    exportData[dateString] = dayData;
                }
            }

            return {
                history: exportData,
                exportDate: new Date().toISOString(),
                dateRange: { startDate, endDate },
                totalDays: Object.keys(exportData).length,
                version: '1.1'
            };
        }
    };

    // Initialize theme first (doesn't depend on external libraries)
    initializeTheme();

    // Initialize Tailwind after a short delay to ensure it's loaded
    setTimeout(() => {
        initializeTailwind();
    }, 100);

    // Create modern floating action button
    function createFloatingButton() {
        if (document.getElementById('analytics-fab')) {
            console.log('Analytics FAB already exists, skipping creation');
            return;
        }

        // 创建容器，使用自定义ID避免样式冲突
        const fabContainer = document.createElement('div');
        fabContainer.id = 'analytics-fab-container';

        const fab = document.createElement('div');
        fab.id = 'analytics-fab';
        fab.className = `
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            text-white rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out
            cursor-pointer group
            w-14 h-14 flex items-center justify-center
            backdrop-blur-sm border border-white/20
        `;

        fab.innerHTML = `
            <div class="relative">
                <svg class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
        `;

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = `
            absolute right-16 top-1/2 transform -translate-y-1/2
            bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
            opacity-0 pointer-events-none transition-opacity duration-200
            whitespace-nowrap shadow-lg
        `;
        tooltip.textContent = 'Open Analytics Dashboard';
        fab.appendChild(tooltip);

        // Show/hide tooltip on hover
        fab.addEventListener('mouseenter', () => {
            tooltip.classList.remove('opacity-0');
            tooltip.classList.add('opacity-100');
        });

        fab.addEventListener('mouseleave', () => {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
        });

        // Update button state
        function updateFabState(isOpen) {
            if (isOpen) {
                fab.className = fab.className.replace('from-blue-600 to-purple-600', 'from-red-500 to-pink-500');
                fab.className = fab.className.replace('hover:from-blue-700 hover:to-purple-700', 'hover:from-red-600 hover:to-pink-600');
                tooltip.textContent = 'Close Analytics Dashboard';
            } else {
                fab.className = fab.className.replace('from-red-500 to-pink-500', 'from-blue-600 to-purple-600');
                fab.className = fab.className.replace('hover:from-red-600 hover:to-pink-600', 'hover:from-blue-700 hover:to-purple-700');
                tooltip.textContent = 'Open Analytics Dashboard';
            }
        }

        // Add click animation
        fab.addEventListener('mousedown', () => {
            fab.style.transform = 'scale(0.95)';
        });

        fab.addEventListener('mouseup', () => {
            fab.style.transform = 'scale(1)';
        });

        // 将fab添加到容器中，然后将容器添加到body
        fabContainer.appendChild(fab);

        try {
            document.body.appendChild(fabContainer);
            console.log('Modern FAB created successfully with custom container');
            return { fab, updateFabState };
        } catch (error) {
            console.error('Failed to create FAB:', error);
            return null;
        }
    }

    // Detect navbar height and adjust dashboard position
    function getNavbarHeight() {
        const navbar = document.querySelector('.navbar-fixed-top, .navbar.navbar-fixed-top, .fixed-top, header');
        if (navbar) {
            const height = navbar.offsetHeight;
            console.log('Detected navbar height:', height + 'px');
            return Math.max(height + 16, 80); // At least 80px from top
        }
        return 80; // Default fallback
    }

    // Create modern dashboard interface
    function createDashboard() {
        if (document.getElementById('analytics-dashboard')) {
            console.log('Analytics dashboard already exists');
            return;
        }

        const navbarHeight = getNavbarHeight();

        // 创建容器，使用自定义ID避免样式冲突
        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'analytics-dashboard-container';
        dashboardContainer.style.top = navbarHeight + 'px';

        const dashboard = document.createElement('div');
        dashboard.id = 'analytics-dashboard';
        dashboard.className = `
            bg-white dark:bg-gray-900
            rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
            hidden opacity-0 transform scale-95 transition-all duration-300
            flex flex-col overflow-hidden backdrop-blur-xl
            w-full h-full
        `;

        dashboard.innerHTML = `
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Advanced reporting dashboard</p>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Theme Toggle -->
                    <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out" title="Toggle theme">
                        <!-- Sun Icon (Light Mode) -->
                        <svg id="sun-icon" class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <!-- Moon Icon (Dark Mode) -->
                        <svg id="moon-icon" class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-200 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                        </svg>
                    </button>

                    <!-- Minimize -->
                    <button id="minimize-btn" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Minimize to floating button">
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                    </button>

                    <!-- Fullscreen -->
                    <button id="fullscreen-btn" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                        </svg>
                    </button>

                    <!-- Help -->
                    <button id="help-btn" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Keyboard shortcuts">
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </button>

                    <!-- Close -->
                    <button id="close-btn" class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <!-- Overview -->
                <button class="nav-tab active px-6 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 transition-all duration-200 ease-in-out" data-tab="overview">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Overview
                </button>
                <button class="nav-tab px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ease-in-out" data-tab="charts">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Charts
                </button>
                <button class="nav-tab px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ease-in-out" data-tab="table">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h3M3 20h18"/>
                    </svg>
                    Data Table
                </button>
                <button class="nav-tab px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ease-in-out" data-tab="export">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Export
                </button>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-hidden">
                <!-- Overview Tab -->
                <div id="overview-tab" class="tab-content h-full">
                    <div class="p-6 h-full flex flex-col">
                        <!-- Stats Cards - 改进响应式布局 -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
                            <!-- Total Sales Card -->
                            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white min-h-[120px] flex flex-col justify-between">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-blue-100 text-xs sm:text-sm font-medium">Total Sales</p>
                                        <p class="text-xl sm:text-2xl font-bold mt-1 truncate" id="total-sales">-</p>
                                    </div>
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Top Performer Card -->
                            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white min-h-[120px] flex flex-col justify-between">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-green-100 text-xs sm:text-sm font-medium">Top Performer</p>
                                        <p class="text-base sm:text-lg font-bold mt-1 truncate" id="top-performer">-</p>
                                    </div>
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Average Daily Card -->
                            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white min-h-[120px] flex flex-col justify-between">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-purple-100 text-xs sm:text-sm font-medium">Average Daily</p>
                                        <p class="text-xl sm:text-2xl font-bold mt-1 truncate" id="avg-daily">-</p>
                                    </div>
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Growth Rate Card -->
                            <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white min-h-[120px] flex flex-col justify-between">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-orange-100 text-xs sm:text-sm font-medium">Growth Rate</p>
                                        <p class="text-orange-200 text-xs opacity-75" id="growth-rate-source">API Data</p>
                                        <p class="text-xl sm:text-2xl font-bold mt-1 truncate" id="growth-rate">-</p>
                                    </div>
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Chart Preview - 参考Charts Tab布局 -->
                        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend Overview</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Real-time performance visualization</p>
                                </div>
                                <!-- 图表控制按钮 -->
                                <div class="flex items-center space-x-2">
                                    <button id="overview-chart-refresh" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Refresh chart">
                                        <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                    </button>
                                    <button id="overview-chart-fullscreen" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="View in Charts tab">
                                        <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- 图表容器 - 完全参考Charts Tab的结构 -->
                            <div id="overview-chart" class="h-full"></div>
                            <div id="overview-chart-loading" class="hidden h-full flex items-center justify-center">
                                <div class="text-center">
                                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p class="text-gray-500 dark:text-gray-400">Loading chart data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Tab -->
                <div id="charts-tab" class="tab-content hidden h-full">
                    <div class="p-6 h-full flex flex-col">
                        <!-- Chart Controls -->
                        <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
                            <div class="flex items-center space-x-4">
                                <select id="chart-type" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <option value="line">Line Chart</option>
                                    <option value="bar">Bar Chart</option>
                                    <option value="area">Area Chart</option>
                                </select>

                                <select id="date-range" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <option value="1">Today</option>
                                    <option value="3">Last 3 Days</option>
                                    <option value="7" selected>Last 7 Days (Live)</option>
                                    <option value="14">Last 14 Days (Historical)</option>
                                    <option value="30">Last 30 Days (Historical)</option>
                                    <option value="60">Last 60 Days (Historical)</option>
                                    <option value="90">Last 90 Days (Historical)</option>
                                    <option value="120">Last 120 Days (Historical)</option>
                                    <option value="150">Last 150 Days (Historical)</option>
                                    <option value="180">Last 180 Days (Historical)</option>
                                </select>

                                <!-- 历史数据状态指示器 -->
                                <div id="history-status" class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span id="history-info">Loading history info...</span>
                                </div>
                            </div>

                            <button id="refresh-data" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                <span>Refresh</span>
                            </button>
                        </div>

                        <!-- Main Chart -->
                        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div id="main-chart" class="h-full"></div>
                            <div id="chart-loading" class="hidden h-full flex items-center justify-center">
                                <div class="text-center">
                                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p class="text-gray-500 dark:text-gray-400">Loading chart data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Table Tab -->
                <div id="table-tab" class="tab-content hidden h-full p-6">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Sales Data Table</h3>
                        </div>
                        <div class="flex-1 overflow-auto p-6">
                            <div id="data-table" class="overflow-x-auto">
                                <!-- Table will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Export Tab -->
                <div id="export-tab" class="tab-content hidden h-full p-6">
                    <div class="max-w-2xl mx-auto">
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Export Data</h3>

                            <div class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button class="export-btn p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center" data-format="csv">
                                        <svg class="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        <h4 class="font-semibold text-gray-900 dark:text-white">Export as CSV</h4>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Download data in CSV format</p>
                                    </button>

                                    <button class="export-btn p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center" data-format="json">
                                        <svg class="w-12 h-12 mx-auto mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                        </svg>
                                        <h4 class="font-semibold text-gray-900 dark:text-white">Export as JSON</h4>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Download data in JSON format</p>
                                    </button>
                                </div>

                                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Export Options</h4>
                                    <div class="space-y-3">
                                        <label class="flex items-center">
                                            <input type="checkbox" id="include-charts" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                                            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include chart images</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" id="include-summary" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                                            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include summary statistics</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 将dashboard添加到容器中，然后将容器添加到body
        dashboardContainer.appendChild(dashboard);

        try {
            document.body.appendChild(dashboardContainer);
            console.log('Modern dashboard created successfully with custom container');
            return dashboard;
        } catch (error) {
            console.error('Failed to create dashboard:', error);
            return null;
        }
    }

    // Wait for external libraries and DOM to be ready
    function waitForDependencies() {
        // Check if all required dependencies are loaded
        const dependenciesReady = document.body &&
                                 (typeof echarts !== 'undefined' || window.echarts);

        if (dependenciesReady) {
            console.log('All dependencies loaded, initializing dashboard...');
            const fabResult = createFloatingButton();
            const dashboard = createDashboard();
            if (fabResult && dashboard) {
                initializeApp(fabResult, dashboard);
            }
        } else {
            console.log('Waiting for dependencies... DOM:', !!document.body, 'ECharts:', typeof echarts !== 'undefined');
            setTimeout(waitForDependencies, 200);
        }
    }

    // Initialize the application with dependency checking and proper timing
    function startInitialization() {
        // Add a small delay to ensure all page scripts have loaded
        setTimeout(() => {
            waitForDependencies();
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInitialization);
    } else if (document.readyState === 'interactive') {
        // DOM is ready but resources might still be loading
        startInitialization();
    } else {
        // Document is fully loaded
        startInitialization();
    }

    // Initialize the main application
    function initializeApp(fabResult, dashboard) {
        const { fab, updateFabState } = fabResult;

        // Initialize charts
        let overviewChart = null;
        let mainChart = null;

        // 性能优化：缓存DOM元素引用
        const domCache = {
            overviewChart: null,
            mainChart: null,
            overviewLoading: null,
            mainLoading: null,
            totalSales: null,
            topPerformer: null,
            avgDaily: null,
            growthRate: null,
            dataTable: null
        };

        // 初始化DOM缓存
        function initDOMCache() {
            domCache.overviewChart = document.getElementById('overview-chart');
            domCache.mainChart = document.getElementById('main-chart');
            domCache.overviewLoading = document.getElementById('overview-chart-loading');
            domCache.mainLoading = document.getElementById('chart-loading');
            domCache.totalSales = document.getElementById('total-sales');
            domCache.topPerformer = document.getElementById('top-performer');
            domCache.avgDaily = document.getElementById('avg-daily');
            domCache.growthRate = document.getElementById('growth-rate');
            domCache.dataTable = document.getElementById('data-table');
        }

        // Initialize ECharts with performance optimizations and error handling
        function initializeCharts() {
            try {
                // 初始化DOM缓存
                initDOMCache();

                // Check if ECharts is available
                const echartsLib = window.echarts || echarts;
                if (!echartsLib) {
                    console.warn('ECharts library not available, charts will not be initialized');
                    return;
                }

                if (domCache.overviewChart) {
                    try {
                        // 性能优化配置
                        overviewChart = echartsLib.init(domCache.overviewChart, null, {
                            renderer: 'canvas',
                            useDirtyRect: true,
                            useCoarsePointer: true,
                            pointerSize: 20
                        });
                        console.log('Overview chart initialized successfully');
                    } catch (error) {
                        console.error('Failed to initialize overview chart:', error);
                    }
                }

                if (domCache.mainChart) {
                    try {
                        // 主图表同样的性能优化
                        mainChart = echartsLib.init(domCache.mainChart, null, {
                            renderer: 'canvas',
                            useDirtyRect: true,
                            useCoarsePointer: true,
                            pointerSize: 20
                        });
                        console.log('Main chart initialized successfully');
                    } catch (error) {
                        console.error('Failed to initialize main chart:', error);
                    }
                }

                console.log('Charts initialization completed');
            } catch (error) {
                console.error('Failed to initialize charts:', error);
                showOverviewChartError();
            }
        }

        // 优化的resize处理 - 使用单一防抖函数
        let globalResizeTimeout;
        function handleChartResize() {
            clearTimeout(globalResizeTimeout);
            globalResizeTimeout = setTimeout(() => {
                if (overviewChart && !overviewChart.isDisposed()) {
                    overviewChart.resize();
                }
                if (mainChart && !mainChart.isDisposed()) {
                    mainChart.resize();
                }
            }, 150); // 增加防抖时间，减少频繁调用
        }

        // Tab switching functionality
        function initializeTabSwitching() {
            const tabs = dashboard.querySelectorAll('.nav-tab');
            const tabContents = dashboard.querySelectorAll('.tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetTab = tab.dataset.tab;

                    // Update tab states
                    tabs.forEach(t => {
                        t.classList.remove('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'border-b-2');
                        t.classList.add('text-gray-500', 'dark:text-gray-400');
                        // 确保移除底部边框和背景
                        t.style.borderBottom = '';
                        t.style.backgroundColor = '';
                        t.style.transform = '';
                    });

                    tab.classList.add('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'border-b-2');
                    tab.classList.remove('text-gray-500', 'dark:text-gray-400');
                    // 添加选中状态的视觉效果
                    tab.style.backgroundColor = state.isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                    tab.style.transform = 'translateY(-1px)';

                    // 确保所有tab都有过渡效果
                    tabs.forEach(t => {
                        t.style.transition = 'all 0.2s ease-in-out';
                    });

                    // Update content visibility
                    tabContents.forEach(content => {
                        content.classList.add('hidden');
                    });

                    const targetContent = document.getElementById(`${targetTab}-tab`);
                    if (targetContent) {
                        targetContent.classList.remove('hidden');

                        // Resize charts when switching to chart tabs
                        if (targetTab === 'overview' && overviewChart) {
                            setTimeout(() => overviewChart.resize(), 100);
                        } else if (targetTab === 'charts' && mainChart) {
                            setTimeout(() => mainChart.resize(), 100);
                        }
                    }

                    state.currentView = targetTab;
                });
            });
        }

        // Theme toggle functionality
        function initializeThemeToggle() {
            const themeToggle = dashboard.querySelector('#theme-toggle');
            const sunIcon = dashboard.querySelector('#sun-icon');
            const moonIcon = dashboard.querySelector('#moon-icon');

            // Update theme icons based on current mode
            function updateThemeIcons() {
                if (state.isDarkMode) {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                    themeToggle.title = 'Switch to light mode';
                } else {
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                    themeToggle.title = 'Switch to dark mode';
                }
            }

            // Apply theme with smooth transition
            function applyTheme(isDark) {
                // Add transition class to body and dashboard for smooth theme change
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                dashboard.style.transition = 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';

                // Add transition to all elements with dark mode classes
                const elementsToTransition = dashboard.querySelectorAll('[class*="dark:"]');
                elementsToTransition.forEach(el => {
                    el.style.transition = 'all 0.3s ease';
                });

                if (isDark) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }

                // Update icons with animation
                updateThemeIcons();

                // Update chart themes
                updateChartThemes();

                // Show theme change notification
                showThemeChangeNotification(isDark);

                // Remove transitions after animation completes
                setTimeout(() => {
                    document.body.style.transition = '';
                    dashboard.style.transition = '';
                    elementsToTransition.forEach(el => {
                        el.style.transition = '';
                    });
                }, 300);
            }

            // Theme toggle click handler
            themeToggle.addEventListener('click', () => {
                // Add click animation
                themeToggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    themeToggle.style.transform = '';
                }, 150);

                state.isDarkMode = !state.isDarkMode;
                applyTheme(state.isDarkMode);
            });

            // Load saved theme or detect system preference
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                state.isDarkMode = true;
                document.documentElement.classList.add('dark');
            } else {
                state.isDarkMode = false;
                document.documentElement.classList.remove('dark');
            }

            // Initialize icons
            updateThemeIcons();

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    state.isDarkMode = e.matches;
                    applyTheme(state.isDarkMode);
                }
            });
        }

        // Show theme change notification
        function showThemeChangeNotification(isDark) {
            // Remove existing notification
            const existingNotification = document.querySelector('.theme-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            // Create notification
            const notification = document.createElement('div');
            notification.className = 'theme-notification fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full';
            notification.style.backgroundColor = isDark ? '#1f2937' : '#ffffff';
            notification.style.color = isDark ? '#ffffff' : '#1f2937';
            notification.style.border = `1px solid ${isDark ? '#374151' : '#e5e7eb'}`;

            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    ${isDark ?
                        '<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>' :
                        '<svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
                    }
                    <span class="text-sm font-medium">${isDark ? 'Dark mode enabled' : 'Light mode enabled'}</span>
                </div>
            `;

            document.body.appendChild(notification);

            // Animate in
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });

            // Auto-hide after 2 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(full)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 2000);
        }

        // Dashboard controls
        function initializeDashboardControls() {
            const minimizeBtn = dashboard.querySelector('#minimize-btn');
            const fullscreenBtn = dashboard.querySelector('#fullscreen-btn');
            const helpBtn = dashboard.querySelector('#help-btn');
            const closeBtn = dashboard.querySelector('#close-btn');

            minimizeBtn.addEventListener('click', () => {
                // 最小化应该隐藏整个弹窗，就像关闭按钮一样
                hideDashboard();
            });

            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    dashboard.requestFullscreen().then(() => {
                        state.isFullscreen = true;
                        // Store original position
                        dashboard.dataset.originalTop = dashboard.style.top;
                        dashboard.classList.remove('left-4', 'right-4', 'bottom-4');
                        dashboard.classList.add('inset-0');
                        dashboard.style.top = '0';

                        setTimeout(() => {
                            if (overviewChart) overviewChart.resize();
                            if (mainChart) mainChart.resize();
                        }, 100);
                    });
                } else {
                    document.exitFullscreen().then(() => {
                        state.isFullscreen = false;
                        dashboard.classList.remove('inset-0');
                        dashboard.classList.add('left-4', 'right-4', 'bottom-4');
                        // Restore original position
                        dashboard.style.top = dashboard.dataset.originalTop || getNavbarHeight() + 'px';

                        setTimeout(() => {
                            if (overviewChart) overviewChart.resize();
                            if (mainChart) mainChart.resize();
                        }, 100);
                    });
                }
            });

            helpBtn.addEventListener('click', () => {
                showKeyboardShortcutsHelp();
            });

            closeBtn.addEventListener('click', () => {
                hideDashboard();
            });
        }

        // Show keyboard shortcuts help
        function showKeyboardShortcutsHelp() {
            // Remove existing help modal
            const existingModal = document.querySelector('.shortcuts-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'shortcuts-modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                                </svg>
                                Keyboard Shortcuts
                            </h3>
                            <button class="close-modal p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div class="grid grid-cols-1 gap-3">
                                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">Toggle Theme</span>
                                    <div class="flex space-x-1">
                                        <kbd class="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">T</kbd>
                                        <span class="text-gray-400">or</span>
                                        <kbd class="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">Ctrl+D</kbd>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">Close Dashboard</span>
                                    <kbd class="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">ESC</kbd>
                                </div>

                                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">Refresh Data</span>
                                    <kbd class="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">Ctrl+R</kbd>
                                </div>

                                <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tab Navigation</h4>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span class="text-xs text-gray-600 dark:text-gray-400">Overview</span>
                                            <kbd class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">1</kbd>
                                        </div>
                                        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span class="text-xs text-gray-600 dark:text-gray-400">Charts</span>
                                            <kbd class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">2</kbd>
                                        </div>
                                        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span class="text-xs text-gray-600 dark:text-gray-400">Table</span>
                                            <kbd class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">3</kbd>
                                        </div>
                                        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span class="text-xs text-gray-600 dark:text-gray-400">Export</span>
                                            <kbd class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow text-gray-700 dark:text-gray-300">4</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                                💡 Tip: These shortcuts work when the dashboard is open
                            </p>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animate in
            requestAnimationFrame(() => {
                const modalContent = modal.querySelector('div > div');
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            });

            // Close modal handlers
            const closeModal = () => {
                const modalContent = modal.querySelector('div > div');
                modalContent.style.transform = 'scale(0.95)';
                modalContent.style.opacity = '0';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.remove();
                    }
                }, 300);
            };

            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // ESC to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        }

        // Overview图表控制功能
        function initializeOverviewChartControls() {
            const refreshBtn = dashboard.querySelector('#overview-chart-refresh');
            const fullscreenBtn = dashboard.querySelector('#overview-chart-fullscreen');

            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    // 添加加载动画
                    showOverviewChartLoading();
                    // 强制刷新数据
                    state.dataCache = null;
                    state.lastFetchTime = null;
                    loadSalesData();
                });
            }

            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    // 切换到Charts标签页
                    const chartsTab = dashboard.querySelector('[data-tab="charts"]');
                    if (chartsTab) {
                        chartsTab.click();
                    }
                });
            }
        }

        // Overview图表状态管理 - 简化版本，使用缓存DOM
        function showOverviewChartLoading() {
            if (domCache.overviewChart) domCache.overviewChart.classList.add('hidden');
            if (domCache.overviewLoading) domCache.overviewLoading.classList.remove('hidden');
        }

        function hideOverviewChartLoading() {
            if (domCache.overviewChart) domCache.overviewChart.classList.remove('hidden');
            if (domCache.overviewLoading) domCache.overviewLoading.classList.add('hidden');
        }

        function showOverviewChartError() {
            hideOverviewChartLoading();
            // 简化错误处理，直接在图表容器中显示错误信息
            const chart = dashboard.querySelector('#overview-chart');
            if (chart) {
                chart.innerHTML = `
                    <div class="h-full flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p class="text-gray-500 dark:text-gray-400">Failed to load chart</p>
                            <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" onclick="loadSalesData()">
                                Retry
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        function showOverviewChartEmpty() {
            hideOverviewChartLoading();
            // 简化空数据处理
            const chart = dashboard.querySelector('#overview-chart');
            if (chart) {
                chart.innerHTML = `
                    <div class="h-full flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <p class="text-gray-500 dark:text-gray-400">No data available</p>
                            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Data will appear when available</p>
                        </div>
                    </div>
                `;
            }
        }

        // FAB click handler
        fab.addEventListener('click', () => {
            if (state.isVisible) {
                hideDashboard();
            } else {
                showDashboard();
            }
        });

        // Show/hide dashboard functions
        function showDashboard() {
            state.isVisible = true;
            // Recalculate navbar height in case it changed
            const navbarHeight = getNavbarHeight();
            const dashboardContainer = document.getElementById('analytics-dashboard-container');

            if (dashboardContainer) {
                dashboardContainer.style.top = navbarHeight + 'px';
                // 显示容器
                dashboardContainer.classList.add('show');
            }

            // 移除dashboard内部元素的hidden类
            dashboard.classList.remove('hidden');
            setTimeout(() => {
                dashboard.classList.remove('opacity-0', 'scale-95');
                dashboard.classList.add('opacity-100', 'scale-100');
            }, 10);

            updateFabState(true);

            // Load data if not already loaded
            if (!state.dataCache || isDataStale()) {
                loadSalesData();
            }

            // Initialize charts if not done
            if (!overviewChart || !mainChart) {
                setTimeout(initializeCharts, 100);
            }
        }

        function hideDashboard() {
            state.isVisible = false;
            const dashboardContainer = document.getElementById('analytics-dashboard-container');

            // 先隐藏dashboard内部元素
            dashboard.classList.remove('opacity-100', 'scale-100');
            dashboard.classList.add('opacity-0', 'scale-95');

            setTimeout(() => {
                dashboard.classList.add('hidden');
                // 完全隐藏容器，不占用页面位置
                if (dashboardContainer) {
                    dashboardContainer.classList.remove('show');
                }
            }, 300);

            updateFabState(false);
        }

        // Data loading and processing
        function isDataStale() {
            if (!state.lastFetchTime) return true;
            const fiveMinutes = 5 * 60 * 1000;
            return Date.now() - state.lastFetchTime > fiveMinutes;
        }

        function loadSalesData() {
            console.log('Loading sales data...');
            showLoadingState();

            // 加载历史数据
            HistoryManager.loadHistory();

            // 检查是否可以使用历史数据（如果选择的日期范围超过7天）
            if (state.dateRange > 7) {
                const historyRange = HistoryManager.getAvailableDateRange();
                if (historyRange && historyRange.totalDays >= state.dateRange) {
                    console.log('Using historical data for extended date range');
                    processHistoricalData();
                    return;
                }
            }

            const baseUrl = 'http://erpx.htran.ltd:9095/pss/report/salesmans/group';
            const url = `${baseUrl}?_t=${new Date().getTime()}`;
            const headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };

            const fetchData = () => {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: headers,
                        onload: function(response) {
                            console.log('Data fetched successfully');
                            processData(response.responseText);
                        },
                        onerror: function(error) {
                            console.error('Failed to fetch data:', error);
                            showErrorState('Failed to fetch data. Please check your connection.');
                        }
                    });
                } else {
                    fetch(url, {
                        method: 'GET',
                        headers: headers,
                        credentials: 'include'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => processData(data))
                    .catch(error => {
                        console.error('Failed to fetch data:', error);
                        showErrorState('Failed to fetch data. Please check your connection.');
                    });
                }
            };

            fetchData();
        }

        function processData(responseText) {
            try {
                const rawData = JSON.parse(responseText);
                console.log('Raw data:', rawData);

                // 性能优化：使用单次遍历处理所有数据分组
                const dataByDate = new Map();

                // 单次遍历，同时完成日期分组和今日数据筛选
                rawData.forEach(item => {
                    const dateString = item.yMDString;
                    if (!dataByDate.has(dateString)) {
                        dataByDate.set(dateString, []);
                    }
                    dataByDate.get(dateString).push(item);
                });

                // 批量存储历史数据，减少localStorage操作
                const dataToStore = [];
                for (const [dateString, dayData] of dataByDate) {
                    if (dayData.length > 0) {
                        dataToStore.push({ dateString, dayData });
                    }
                }

                // 异步存储历史数据，避免阻塞UI
                if (dataToStore.length > 0) {
                    requestIdleCallback(() => {
                        dataToStore.forEach(({ dateString, dayData }) => {
                            HistoryManager.addDailyData(dateString, dayData);
                        });
                    });
                }

                // Filter data based on date range
                const currentDate = new Date();
                const daysBack = Math.min(state.dateRange, 7); // API只提供7天数据
                const startDate = new Date(currentDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

                const validData = rawData.filter(item => {
                    const date = new Date(item.yMDString);
                    return !isNaN(date) && date >= startDate && date <= currentDate;
                });

                if (validData.length === 0) {
                    showErrorState('No data available for the selected date range.');
                    showOverviewChartEmpty();
                    return;
                }

                // 如果请求的日期范围超过7天，合并历史数据
                if (state.dateRange > 7) {
                    const historicalData = HistoryManager.getHistoryRange(state.dateRange);
                    if (historicalData.length > 0) {
                        console.log(`Merging with ${historicalData.length} days of historical data`);
                        const mergedData = mergeHistoricalData(validData, historicalData);
                        state.dataCache = processRawData(mergedData);
                    } else {
                        state.dataCache = processRawData(validData);
                    }
                } else {
                    state.dataCache = processRawData(validData);
                }

                state.lastFetchTime = Date.now();

                // Update all views
                updateOverviewStats();
                updateCharts();
                updateDataTable();
                hideLoadingState();

                // 更新Overview图表状态
                hideOverviewChartLoading();

                console.log('Data processed successfully');
            } catch (error) {
                console.error('Failed to process data:', error);
                showErrorState('Failed to process data. Please try again.');
                showOverviewChartError();
            }
        }

        // 处理纯历史数据（当请求超过7天且有足够历史数据时）
        function processHistoricalData() {
            try {
                const historicalData = HistoryManager.getHistoryRange(state.dateRange);
                if (historicalData.length === 0) {
                    showErrorState('No historical data available for the selected date range.');
                    return;
                }

                // 将历史数据转换为标准格式
                const flattenedData = [];
                historicalData.forEach(dayData => {
                    dayData.salesData.forEach(item => {
                        flattenedData.push({
                            name: item.name,
                            increase: item.increase,
                            totalCount: item.totalCount,
                            yMDString: item.yMDString
                        });
                    });
                });

                state.dataCache = processRawData(flattenedData);
                state.lastFetchTime = Date.now();

                // Update all views
                updateOverviewStats();
                updateCharts();
                updateDataTable();
                hideLoadingState();

                console.log(`Processed ${historicalData.length} days of historical data`);
            } catch (error) {
                console.error('Failed to process historical data:', error);
                showErrorState('Failed to process historical data. Please try again.');
            }
        }

        // 合并当前数据和历史数据
        function mergeHistoricalData(currentData, historicalData) {
            const merged = [...currentData];
            const currentDates = new Set(currentData.map(item => item.yMDString));

            // 添加历史数据中不在当前数据中的日期
            historicalData.forEach(dayData => {
                if (!currentDates.has(dayData.date)) {
                    dayData.salesData.forEach(item => {
                        merged.push({
                            name: item.name,
                            increase: item.increase,
                            totalCount: item.totalCount,
                            yMDString: item.yMDString
                        });
                    });
                }
            });

            return merged;
        }

        function processRawData(rawData) {
            // Group data by salesperson
            const groupedData = rawData.reduce((acc, item) => {
                if (!acc[item.name]) {
                    acc[item.name] = [];
                }
                acc[item.name].push(item);
                return acc;
            }, {});

            // Get unique dates and sort them
            const dates = [...new Set(rawData.map(item => item.yMDString))].sort((a, b) => new Date(a) - new Date(b));

            // Calculate statistics
            const totalSales = rawData.reduce((sum, item) => sum + (item.totalCount || 0), 0);
            const avgDaily = totalSales / dates.length;

            // Find top performer
            const salesByPerson = Object.entries(groupedData).map(([name, data]) => ({
                name,
                total: data.reduce((sum, item) => sum + (item.totalCount || 0), 0)
            }));

            const topPerformer = salesByPerson.reduce((max, current) =>
                current.total > max.total ? current : max, salesByPerson[0]);

            // Calculate growth rate using the increase field from API data
            // Get average increase rate from all records that have increase data
            const recordsWithIncrease = rawData.filter(item => item.increase !== undefined && item.increase !== null);
            const avgGrowthRate = recordsWithIncrease.length > 0
                ? recordsWithIncrease.reduce((sum, item) => sum + (item.increase || 0), 0) / recordsWithIncrease.length
                : 0;

            // Fallback: Calculate growth rate (comparing first and last day) if no increase data
            const growthRate = recordsWithIncrease.length > 0 ? avgGrowthRate : (() => {
                const firstDayTotal = rawData.filter(item => item.yMDString === dates[0])
                    .reduce((sum, item) => sum + (item.totalCount || 0), 0);
                const lastDayTotal = rawData.filter(item => item.yMDString === dates[dates.length - 1])
                    .reduce((sum, item) => sum + (item.totalCount || 0), 0);
                return firstDayTotal > 0 ? ((lastDayTotal - firstDayTotal) / firstDayTotal * 100) : 0;
            })();

            // Calculate additional statistics for increase data (reuse the variable from above)
            const increaseDataCoverage = rawData.length > 0 ? (recordsWithIncrease.length / rawData.length * 100) : 0;

            return {
                rawData,
                groupedData,
                dates,
                stats: {
                    totalSales,
                    avgDaily: Math.round(avgDaily),
                    topPerformer: topPerformer.name,
                    growthRate: Math.round(growthRate * 10) / 10,
                    increaseDataCount: recordsWithIncrease.length,
                    increaseDataCoverage: Math.round(increaseDataCoverage)
                },
                salesByPerson
            };
        }

        function updateOverviewStats() {
            if (!state.dataCache) return;

            const { stats } = state.dataCache;

            // 使用缓存的DOM元素，避免重复查询
            if (domCache.totalSales) domCache.totalSales.textContent = stats.totalSales.toLocaleString();
            if (domCache.topPerformer) domCache.topPerformer.textContent = stats.topPerformer;
            if (domCache.avgDaily) domCache.avgDaily.textContent = stats.avgDaily.toLocaleString();
            if (domCache.growthRate) {
                const rate = stats.growthRate;
                domCache.growthRate.textContent = `${rate >= 0 ? '+' : ''}${rate}%`;

                // 更新数据源提示
                const growthRateSource = document.getElementById('growth-rate-source');
                if (growthRateSource) {
                    const hasIncreaseData = stats.increaseDataCount > 0;
                    growthRateSource.textContent = hasIncreaseData ?
                        `API Data (${stats.increaseDataCount} records)` :
                        'Calculated';
                }

                // 动态更新增长率卡片的颜色
                const growthCard = domCache.growthRate.closest('.bg-gradient-to-r');
                if (growthCard) {
                    // 移除现有的颜色类
                    growthCard.classList.remove(
                        'from-orange-500', 'to-orange-600',
                        'from-green-500', 'to-green-600',
                        'from-red-500', 'to-red-600'
                    );

                    // 根据增长率添加相应的颜色
                    if (rate > 0) {
                        growthCard.classList.add('from-green-500', 'to-green-600');
                    } else if (rate < 0) {
                        growthCard.classList.add('from-red-500', 'to-red-600');
                    } else {
                        growthCard.classList.add('from-orange-500', 'to-orange-600');
                    }
                }
            }
        }

        function updateCharts() {
            if (!state.dataCache) return;

            const { groupedData, dates } = state.dataCache;

            // 性能优化：预先计算数据映射，避免重复查找
            const dataMap = new Map();
            Object.entries(groupedData).forEach(([name, data]) => {
                const dateMap = new Map();
                data.forEach(record => {
                    dateMap.set(record.yMDString, record.totalCount || 0);
                });
                dataMap.set(name, dateMap);
            });

            // 优化的系列数据生成
            const series = Array.from(dataMap.entries()).map(([name, dateMap]) => ({
                name: name,
                type: state.chartType,
                data: dates.map(date => dateMap.get(date) || 0),
                smooth: state.chartType === 'line',
                areaStyle: state.chartType === 'area' ? {} : undefined
            }));

            const chartOptions = createChartOptions(dates, series);

            // 异步更新图表，避免阻塞UI
            requestAnimationFrame(() => {
                if (overviewChart && !overviewChart.isDisposed()) {
                    overviewChart.setOption(chartOptions, true); // 使用notMerge=true提高性能
                    // 添加图表交互事件监听器
                    setupChartInteractions(overviewChart, 'overview');
                }
                if (mainChart && !mainChart.isDisposed()) {
                    mainChart.setOption(chartOptions, true);
                    // 添加图表交互事件监听器
                    setupChartInteractions(mainChart, 'main');
                }

                // 延迟resize，避免频繁调用
                handleChartResize();
            });
        }

        // 设置图表交互事件
        function setupChartInteractions(chart, chartType) {
            if (!chart || chart.isDisposed()) return;

            // 移除之前的事件监听器，避免重复绑定
            chart.off('mouseover');
            chart.off('mouseout');
            chart.off('click');
            chart.off('mousemove');

            // 获取图表的 DOM 元素
            const chartDom = chart.getDom();

            // 自定义鼠标移动事件处理
            chartDom.addEventListener('mousemove', function(event) {
                // 获取鼠标在图表中的位置
                const rect = chartDom.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                // 使用 ECharts 的 convertFromPixel 方法获取数据坐标
                const pointInGrid = chart.convertFromPixel('grid', [x, y]);
                if (pointInGrid) {
                    const xIndex = Math.round(pointInGrid[0]);
                    const dates = state.dataCache?.dates || [];

                    if (xIndex >= 0 && xIndex < dates.length) {
                        const date = dates[xIndex];

                        // 简化检测逻辑，先确保tooltip能正常工作
                        let isInXAxisArea = false;
                        let isNearXAxisLabel = true;

                        try {
                            // 尝试获取图表的网格区域信息
                            const gridComponent = chart.getModel().getComponent('grid', 0);
                            if (gridComponent && gridComponent.coordinateSystem) {
                                const gridRect = gridComponent.coordinateSystem.getArea();

                                // 放宽X轴区域检测
                                const xAxisLabelHeight = 50; // 增加X轴标签区域的高度
                                const xAxisStartY = gridRect.y + gridRect.height;
                                isInXAxisArea = y >= (xAxisStartY - 20) && y <= (xAxisStartY + xAxisLabelHeight);

                                // 放宽日期位置检测
                                const xAxisPixel = chart.convertToPixel('grid', [xIndex, 0]);
                                if (xAxisPixel && Array.isArray(xAxisPixel)) {
                                    const xTolerance = 40; // 增加容差范围
                                    isNearXAxisLabel = Math.abs(x - xAxisPixel[0]) <= xTolerance;
                                }
                            }
                        } catch (error) {
                            console.log('Grid detection error, using fallback:', error);
                            // 如果检测失败，使用宽松的设置
                            isInXAxisArea = true;
                            isNearXAxisLabel = true;
                        }

                        // 检查鼠标是否接近某条具体的线
                        const series = chart.getOption().series;
                        let closestSeries = null;
                        let minDistance = Infinity;

                        series.forEach((s, seriesIndex) => {
                            if (s.data && s.data[xIndex] !== undefined && s.data[xIndex] !== null) {
                                const dataValue = s.data[xIndex];
                                const pixelPoint = chart.convertToPixel('grid', [xIndex, dataValue]);
                                if (pixelPoint) {
                                    const distance = Math.sqrt(Math.pow(x - pixelPoint[0], 2) + Math.pow(y - pixelPoint[1], 2));
                                    if (distance < minDistance) {
                                        minDistance = distance;
                                        closestSeries = { series: s, seriesIndex, dataValue, distance };
                                    }
                                }
                            }
                        });

                        // 启用调试信息来诊断问题
                        console.log(`Debug - Mouse: (${x.toFixed(1)}, ${y.toFixed(1)}), XAxisArea: ${isInXAxisArea}, NearLabel: ${isNearXAxisLabel}, MinDist: ${minDistance.toFixed(1)}, Date: ${date}`);

                        // 简化显示逻辑，优先确保tooltip能够显示
                        if (closestSeries && minDistance < 25) {
                            // 鼠标距离某条线很近，显示单个系列的tooltip
                            console.log('Showing single series tooltip');
                            showSingleSeriesTooltip(chart, date, closestSeries, x, y);
                        } else {
                            // 其他情况显示所有系列的tooltip
                            console.log('Showing all series tooltip');
                            showAllSeriesTooltip(chart, date, x, y);
                        }
                    } else {
                        // 鼠标不在有效的数据范围内
                        hideCustomTooltip(chart);
                    }
                } else {
                    // 鼠标不在图表网格区域内，隐藏tooltip
                    hideCustomTooltip(chart);
                }
            });

            // 鼠标离开图表区域时隐藏tooltip
            chartDom.addEventListener('mouseleave', function() {
                hideCustomTooltip(chart);
            });

            // 点击事件 - 可以用于钻取或其他操作
            chart.on('click', function(params) {
                if (params.componentType === 'series') {
                    console.log(`Clicked on ${params.seriesName} - ${params.name}: ${params.value}`);

                    // 示例：切换到数据表格并滚动到对应数据
                    if (chartType === 'main') {
                        switchToTableAndHighlight(params.seriesName, params.name);
                    }
                }
            });
        }

        // 显示单个系列的 tooltip（鼠标在曲线上）
        function showSingleSeriesTooltip(chart, date, closestSeries, x, y) {
            const isDark = state.isDarkMode;
            const seriesName = closestSeries.series.name;
            const value = closestSeries.dataValue;

            // 获取该销售人员的详细数据
            const rawData = state.dataCache?.rawData || [];
            const personData = rawData.find(item =>
                item.name === seriesName && item.yMDString === date
            );

            // 计算排名和统计信息
            const dayData = rawData.filter(item => item.yMDString === date);
            const sortedDayData = dayData.sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));
            const rank = sortedDayData.findIndex(item => item.name === seriesName) + 1;
            const totalPeople = dayData.length;
            const dayTotal = dayData.reduce((sum, item) => sum + (item.totalCount || 0), 0);
            const percentage = dayTotal > 0 ? ((value / dayTotal) * 100).toFixed(1) : '0.0';

            // 获取系列颜色
            const seriesColor = closestSeries.series.itemStyle?.color || closestSeries.series.lineStyle?.color || '#3b82f6';

            let content = `<div style="margin-bottom: 8px;"><strong style="font-size: 14px;">${date}</strong></div>`;
            content += `<div style="color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 12px; margin-bottom: 6px;">📊 个人详细数据</div>`;
            content += `<div style="margin: 6px 0; padding: 8px; background: ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)'}; border-radius: 6px;">`;
            content += `<div style="display: flex; align-items: center; margin-bottom: 6px;">`;
            content += `<span style="color:${seriesColor}; margin-right: 6px;">●</span>`;
            content += `<span style="font-weight: bold; font-size: 13px;">${seriesName}</span>`;

            // 添加排名徽章
            if (rank <= 3) {
                const badgeColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : '#cd7c2f';
                const badgeText = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                content += `<span style="margin-left: 8px; background: ${badgeColor}; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px;">${badgeText} ${rank}/${totalPeople}</span>`;
            } else {
                content += `<span style="margin-left: 8px; background: ${isDark ? '#4b5563' : '#d1d5db'}; color: ${isDark ? '#d1d5db' : '#4b5563'}; font-size: 10px; padding: 2px 6px; border-radius: 4px;">${rank}/${totalPeople}</span>`;
            }
            content += `</div>`;

            content += `<div style="margin-left: 12px;">`;
            content += `<div style="margin: 3px 0; display: flex; justify-content: space-between;">`;
            content += `<span style="color: ${isDark ? '#9ca3af' : '#6b7280'};">销售数量:</span>`;
            content += `<strong style="color: ${seriesColor};">${value.toLocaleString()}</strong>`;
            content += `</div>`;

            content += `<div style="margin: 3px 0; display: flex; justify-content: space-between;">`;
            content += `<span style="color: ${isDark ? '#9ca3af' : '#6b7280'};">占当天比例:</span>`;
            content += `<strong>${percentage}%</strong>`;
            content += `</div>`;

            if (personData) {
                if (personData.increase !== undefined && personData.increase !== null) {
                    const growthRate = personData.increase;
                    const growthColor = growthRate > 0 ? '#10b981' : growthRate < 0 ? '#ef4444' : '#6b7280';
                    const growthIcon = growthRate > 0 ? '📈' : growthRate < 0 ? '📉' : '➖';
                    content += `<div style="margin: 3px 0; display: flex; justify-content: space-between;">`;
                    content += `<span style="color: ${isDark ? '#9ca3af' : '#6b7280'};">增长率:</span>`;
                    content += `<strong style="color: ${growthColor};">${growthIcon} ${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%</strong>`;
                    content += `</div>`;
                }
            }
            content += `</div></div>`;

            // 创建自定义 tooltip 元素（单个系列）
            showCustomTooltip(chart, content, x, y, false);
        }

        // 显示所有系列的 tooltip（鼠标在X轴日期上）
        function showAllSeriesTooltip(chart, date, x, y) {
            const isDark = state.isDarkMode;
            const rawData = state.dataCache?.rawData || [];
            const dayData = rawData.filter(item => item.yMDString === date);
            const sortedDayData = dayData.sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));

            // 计算当天总销售额
            const totalSales = sortedDayData.reduce((sum, item) => sum + (item.totalCount || 0), 0);

            let content = `<div style="margin-bottom: 8px;"><strong style="font-size: 14px;">${date}</strong></div>`;
            content += `<div style="color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 12px; margin-bottom: 6px;">👥 所有销售人员数据 • 总计: <strong>${totalSales.toLocaleString()}</strong></div>`;

            // 获取系列配置以获取颜色
            const series = chart.getOption().series;
            const seriesColorMap = new Map();
            series.forEach(s => {
                const color = s.itemStyle?.color || s.lineStyle?.color || '#3b82f6';
                seriesColorMap.set(s.name, color);
            });

            sortedDayData.forEach((item, index) => {
                const value = item.totalCount || 0;
                const growthRate = item.increase;
                const growthText = growthRate !== undefined && growthRate !== null
                    ? ` (${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%)`
                    : '';

                // 添加排名标识
                const rankBadge = index < 3 ?
                    `<span style="background: ${index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#cd7c2f'}; color: white; font-size: 10px; padding: 1px 4px; border-radius: 3px; margin-right: 4px;">${index + 1}</span>` :
                    `<span style="color: ${isDark ? '#6b7280' : '#9ca3af'}; font-size: 10px; margin-right: 6px;">${index + 1}.</span>`;

                const seriesColor = seriesColorMap.get(item.name) || '#3b82f6';

                content += `<div style="margin: 4px 0; display: flex; align-items: center;">`;
                content += rankBadge;
                content += `<span style="color:${seriesColor}; margin-right: 6px;">●</span>`;
                content += `<span style="font-weight: 500;">${item.name}:</span>`;
                content += `<span style="margin-left: 8px; font-weight: bold;">${value.toLocaleString()}</span>`;
                content += `<span style="margin-left: 4px; font-size: 11px; color: ${growthRate > 0 ? '#10b981' : growthRate < 0 ? '#ef4444' : '#6b7280'};">${growthText}</span>`;
                content += `</div>`;
            });

            // 创建自定义 tooltip 元素（所有系列）
            showCustomTooltip(chart, content, x, y, true);
        }

        // 显示自定义 tooltip
        function showCustomTooltip(chart, content, x, y, isAllSeries = false) {
            const chartDom = chart.getDom();

            // 移除之前的自定义 tooltip
            const existingTooltip = chartDom.querySelector('.custom-chart-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // 创建新的 tooltip 元素
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-chart-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: ${state.isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                border: 1px solid ${state.isDarkMode ? '#374151' : '#e5e7eb'};
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 10px 25px ${state.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
                font-size: 12px;
                color: ${state.isDarkMode ? '#ffffff' : '#1f2937'};
                max-width: 300px;
                z-index: 10000;
                pointer-events: none;
                backdrop-filter: blur(10px);
                transition: all 0.2s ease-in-out;
                opacity: 0;
                transform: scale(0.95);
            `;

            tooltip.innerHTML = content;

            // 添加到图表容器中
            chartDom.appendChild(tooltip);

            // 计算 tooltip 位置，确保不超出图表边界和页面边界
            const chartRect = chartDom.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // 计算 tooltip 在页面中的绝对位置
            const chartOffsetX = chartRect.left;
            const chartOffsetY = chartRect.top;

            let left, top;

            // 智能位置计算 - 确保 tooltip 始终在可见区域内
            if (isAllSeries) {
                // 显示所有系列数据时的位置策略

                // 检查是否应该使用侧边显示策略（当垂直空间都很紧张时）
                const spaceAbove = chartOffsetY + y;  // 鼠标上方的空间（到页面顶部）
                const spaceBelow = viewportHeight - (chartOffsetY + y);  // 鼠标下方的空间（到页面底部）
                const totalVerticalSpace = spaceAbove + spaceBelow;
                const useSideDisplay = totalVerticalSpace < tooltipRect.height + 50;

                if (useSideDisplay) {
                    // 使用侧边显示策略
                    const spaceRight = viewportWidth - (chartOffsetX + x);
                    const spaceLeft = chartOffsetX + x;

                    if (spaceRight >= tooltipRect.width + 20) {
                        left = x + 15;
                        // 垂直居中，但确保不超出边界
                        top = Math.max(10 - chartOffsetY, Math.min(y - tooltipRect.height / 2, viewportHeight - chartOffsetY - tooltipRect.height - 10));
                        console.log('Using side display (right) due to limited vertical space');
                    } else if (spaceLeft >= tooltipRect.width + 20) {
                        left = x - tooltipRect.width - 15;
                        // 垂直居中，但确保不超出边界
                        top = Math.max(10 - chartOffsetY, Math.min(y - tooltipRect.height / 2, viewportHeight - chartOffsetY - tooltipRect.height - 10));
                        console.log('Using side display (left) due to limited vertical space');
                    } else {
                        // 回退到居中显示
                        left = x - tooltipRect.width / 2;
                        if (left < 10) {
                            left = 10;
                        } else if (left + tooltipRect.width > chartRect.width - 10) {
                            left = chartRect.width - tooltipRect.width - 10;
                        }
                    }
                } else {
                    // 使用正常的居中显示策略
                    left = x - tooltipRect.width / 2;
                    if (left < 10) {
                        left = 10;
                    } else if (left + tooltipRect.width > chartRect.width - 10) {
                        left = chartRect.width - tooltipRect.width - 10;
                    }
                }

                // 垂直位置：智能选择上方或下方（只有在没有使用侧边显示时才执行）
                if (!useSideDisplay || (useSideDisplay && spaceRight < tooltipRect.width + 20 && spaceLeft < tooltipRect.width + 20)) {
                    const tooltipHeight = tooltipRect.height;
                    const minMargin = 10; // 最小边距

                    // 调试信息（可选启用）
                    console.log(`Positioning tooltip - SpaceAbove: ${spaceAbove}, SpaceBelow: ${spaceBelow}, TooltipHeight: ${tooltipHeight}, ChartOffsetY: ${chartOffsetY}, MouseY: ${y}`);

                // 计算理想的上方和下方位置
                const idealTopPosition = y - tooltipHeight - 15;
                const idealBottomPosition = y + 15;

                // 计算这些位置在页面中的绝对坐标
                const absoluteTopPosition = chartOffsetY + idealTopPosition;
                const absoluteBottomPosition = chartOffsetY + idealBottomPosition;

                // 智能检测：综合考虑相对位置和实际可用空间
                const chartHeight = chartRect.height;
                const relativeY = y / chartHeight;

                // 多重条件判断是否强制下方显示
                const isInUpperHalf = relativeY < 0.5; // 在图表上半部分
                const hasLimitedSpaceAbove = spaceAbove < tooltipHeight + 30; // 上方空间不足
                const wouldExceedTop = absoluteTopPosition < minMargin + 5; // 会超出页面顶部

                const forceBelow = isInUpperHalf || hasLimitedSpaceAbove || wouldExceedTop;

                console.log(`Smart positioning - RelativeY: ${relativeY.toFixed(2)}, IsUpperHalf: ${isInUpperHalf}, LimitedSpaceAbove: ${hasLimitedSpaceAbove}, WouldExceedTop: ${wouldExceedTop}, ForceBelow: ${forceBelow}`);

                if (!forceBelow && absoluteTopPosition >= minMargin + 5 && spaceAbove >= tooltipHeight + 25) {
                    // 上方空间充足且不会超出页面顶部
                    top = idealTopPosition;
                    console.log('Positioning above cursor - sufficient space');
                } else if (absoluteBottomPosition + tooltipHeight <= viewportHeight - minMargin && spaceBelow >= tooltipHeight + 15) {
                    // 下方空间足够且不会超出页面底部
                    top = idealBottomPosition;
                    console.log('Positioning below cursor - sufficient space');
                } else {
                    // 空间受限，需要特殊处理
                    if (!forceBelow && spaceAbove > spaceBelow + 50 && absoluteTopPosition >= minMargin) {
                        // 上方空间明显更大且不会超出页面顶部
                        const maxTopPosition = minMargin - chartOffsetY;
                        top = Math.max(maxTopPosition, idealTopPosition);
                        console.log(`Positioning above cursor (constrained) - maxTop: ${maxTopPosition}, actualTop: ${top}`);
                    } else {
                        // 优先下方显示或强制下方显示
                        const maxBottomPosition = viewportHeight - chartOffsetY - tooltipHeight - minMargin;
                        top = Math.min(maxBottomPosition, idealBottomPosition);
                        console.log(`Positioning below cursor (constrained/forced) - maxBottom: ${maxBottomPosition}, actualTop: ${top}, forceBelow: ${forceBelow}`);
                    }
                }
                } // 关闭垂直位置计算的条件语句
            } else {
                // 显示单个系列数据时的位置策略

                // 水平位置：优先右侧，空间不够时显示左侧
                const spaceRight = viewportWidth - (chartOffsetX + x);
                const spaceLeft = chartOffsetX + x;

                if (spaceRight >= tooltipRect.width + 20) {
                    // 右侧空间足够
                    left = x + 10;
                } else if (spaceLeft >= tooltipRect.width + 20) {
                    // 左侧空间足够
                    left = x - tooltipRect.width - 10;
                } else {
                    // 左右空间都不够，选择空间较大的一方
                    if (spaceRight > spaceLeft) {
                        left = Math.min(x + 10, chartRect.width - tooltipRect.width - 10);
                    } else {
                        left = Math.max(10, x - tooltipRect.width - 10);
                    }
                }

                // 垂直位置：优先垂直居中，但确保不超出边界
                top = y - tooltipRect.height / 2;

                // 确保不超出上边界
                if (chartOffsetY + top < 10) {
                    top = 10 - chartOffsetY;
                }

                // 确保不超出下边界
                if (chartOffsetY + top + tooltipRect.height > viewportHeight - 10) {
                    top = viewportHeight - chartOffsetY - tooltipRect.height - 10;
                }
            }

            // 最终位置安全检查和应用
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';

            // 添加淡入和缩放动画
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'scale(1)';

                // 动画完成后再次检查位置，确保完全可见
                setTimeout(() => {
                    const finalRect = tooltip.getBoundingClientRect();
                    let needsAdjustment = false;
                    let newLeft = left;
                    let newTop = top;

                    console.log(`Final position check - Rect: top=${finalRect.top}, bottom=${finalRect.bottom}, left=${finalRect.left}, right=${finalRect.right}`);
                    console.log(`Viewport: width=${viewportWidth}, height=${viewportHeight}`);

                    // 检查是否超出视口边界，使用更严格的边距
                    const margin = 8;

                    if (finalRect.right > viewportWidth - margin) {
                        newLeft = left - (finalRect.right - viewportWidth + margin);
                        needsAdjustment = true;
                        console.log(`Adjusting left: ${newLeft} (was ${left})`);
                    }
                    if (finalRect.left < margin) {
                        newLeft = left + (margin - finalRect.left);
                        needsAdjustment = true;
                        console.log(`Adjusting left: ${newLeft} (was ${left})`);
                    }
                    if (finalRect.bottom > viewportHeight - margin) {
                        newTop = top - (finalRect.bottom - viewportHeight + margin);
                        needsAdjustment = true;
                        console.log(`Adjusting top: ${newTop} (was ${top})`);
                    }
                    if (finalRect.top < margin) {
                        newTop = top + (margin - finalRect.top);
                        needsAdjustment = true;
                        console.log(`Adjusting top: ${newTop} (was ${top})`);
                    }

                    // 如果需要调整，应用新位置
                    if (needsAdjustment) {
                        tooltip.style.left = newLeft + 'px';
                        tooltip.style.top = newTop + 'px';
                        console.log(`Applied final adjustments - left: ${newLeft}, top: ${newTop}`);
                    } else {
                        console.log('No adjustment needed');
                    }
                }, 50);
            });
        }

        // 隐藏自定义 tooltip
        function hideCustomTooltip(chart) {
            const chartDom = chart.getDom();
            const tooltip = chartDom.querySelector('.custom-chart-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 200);
            }
        }

        // 切换到数据表格并高亮对应数据
        function switchToTableAndHighlight(salesperson, date) {
            // 切换到表格标签
            const tableTab = document.querySelector('[data-tab="table"]');
            if (tableTab) {
                tableTab.click();

                // 延迟执行，等待表格渲染完成
                setTimeout(() => {
                    // 查找并高亮对应的表格行
                    const tableRows = document.querySelectorAll('#data-table tbody tr');
                    tableRows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 2) {
                            const rowDate = cells[0].textContent.trim();
                            const rowSalesperson = cells[1].textContent.trim();

                            if (rowDate === date && rowSalesperson === salesperson) {
                                // 高亮该行
                                row.style.backgroundColor = state.isDarkMode ? '#1f2937' : '#dbeafe';
                                row.style.border = '2px solid #3b82f6';
                                row.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                // 3秒后移除高亮
                                setTimeout(() => {
                                    row.style.backgroundColor = '';
                                    row.style.border = '';
                                }, 3000);
                            }
                        }
                    });
                }, 100);
            }
        }

        // 缓存图表配置，避免重复计算
        let cachedChartOptions = null;
        let lastOptionsHash = null;

        function createChartOptions(dates, series) {
            const isDark = state.isDarkMode;

            // 创建配置哈希，用于缓存判断
            const optionsHash = `${state.dateRange}-${state.chartType}-${isDark}-${dates.length}-${series.length}`;

            // 如果配置没有变化，返回缓存的配置
            if (cachedChartOptions && lastOptionsHash === optionsHash) {
                // 只更新数据部分
                cachedChartOptions.series = series;
                return cachedChartOptions;
            }

            lastOptionsHash = optionsHash;
            cachedChartOptions = {
                title: {
                    text: `Sales Performance (Last ${state.dateRange} Days)`,
                    left: 'center',
                    textStyle: {
                        color: isDark ? '#ffffff' : '#1f2937',
                        fontSize: 16
                    }
                },
                tooltip: {
                    show: false  // 禁用默认 tooltip，使用自定义逻辑
                },
                legend: {
                    data: series.map(s => s.name),
                    bottom: 0,
                    textStyle: {
                        color: isDark ? '#d1d5db' : '#374151'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLabel: {
                        color: isDark ? '#9ca3af' : '#6b7280',
                        rotate: dates.length > 7 ? 45 : 0
                    },
                    axisLine: {
                        lineStyle: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Sales Count',
                    nameTextStyle: {
                        color: isDark ? '#9ca3af' : '#6b7280'
                    },
                    axisLabel: {
                        color: isDark ? '#9ca3af' : '#6b7280'
                    },
                    axisLine: {
                        lineStyle: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: isDark ? '#374151' : '#f3f4f6'
                        }
                    }
                },
                series: series,
                color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']
            };

            return cachedChartOptions;
        }

        function updateDataTable() {
            if (!state.dataCache) return;

            const { rawData } = state.dataCache;
            const tableContainer = document.getElementById('data-table');

            if (rawData.length === 0) {
                tableContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>';
                return;
            }

            const table = document.createElement('table');
            table.className = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700';

            // Create header
            const thead = document.createElement('thead');
            thead.className = 'bg-gray-50 dark:bg-gray-800';
            thead.innerHTML = `
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salesperson</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sales Count</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth Rate</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                </tr>
            `;

            // Create body
            const tbody = document.createElement('tbody');
            tbody.className = 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700';

            // Sort data by date and sales count
            const sortedData = [...rawData].sort((a, b) => {
                const dateCompare = new Date(b.yMDString) - new Date(a.yMDString);
                if (dateCompare !== 0) return dateCompare;
                return (b.totalCount || 0) - (a.totalCount || 0);
            });

            sortedData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.className = index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800';

                const salesCount = item.totalCount || 0;
                const performanceClass = salesCount > 50 ? 'text-green-600 dark:text-green-400' :
                                       salesCount > 20 ? 'text-yellow-600 dark:text-yellow-400' :
                                       'text-red-600 dark:text-red-400';

                // Format growth rate with appropriate styling
                const growthRate = item.increase !== undefined && item.increase !== null ? item.increase : 0;
                const growthRateClass = growthRate > 0 ? 'text-green-600 dark:text-green-400' :
                                       growthRate < 0 ? 'text-red-600 dark:text-red-400' :
                                       'text-gray-600 dark:text-gray-400';
                const growthRateText = growthRate > 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`;

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${item.yMDString}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${salesCount.toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${growthRateClass}">
                        ${growthRateText}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${performanceClass}">
                        ${salesCount > 50 ? 'Excellent' : salesCount > 20 ? 'Good' : 'Needs Improvement'}
                    </td>
                `;

                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            tableContainer.innerHTML = '';
            tableContainer.appendChild(table);
        }

        function updateChartThemes() {
            if (overviewChart && mainChart && state.dataCache) {
                // Add a subtle loading indicator during theme change
                const chartContainers = [
                    document.getElementById('overview-chart'),
                    document.getElementById('main-chart')
                ];

                chartContainers.forEach(container => {
                    if (container) {
                        container.style.opacity = '0.7';
                        container.style.transition = 'opacity 0.2s ease';
                    }
                });

                // Update charts with new theme
                setTimeout(() => {
                    updateCharts();

                    // Restore opacity after charts are updated
                    setTimeout(() => {
                        chartContainers.forEach(container => {
                            if (container) {
                                container.style.opacity = '1';
                                // Remove transition after animation
                                setTimeout(() => {
                                    container.style.transition = '';
                                }, 200);
                            }
                        });
                    }, 100);
                }, 50);
            }
        }

        function showLoadingState() {
            const loadingElement = document.getElementById('chart-loading');
            if (loadingElement) {
                loadingElement.classList.remove('hidden');
            }
        }

        function hideLoadingState() {
            const loadingElement = document.getElementById('chart-loading');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
            }
        }

        function showErrorState(message) {
            hideLoadingState();

            // 使用简化的状态管理系统
            showOverviewChartError();

            // Show error in main chart area too
            const mainContainer = document.getElementById('main-chart');
            if (mainContainer && state.currentView === 'charts') {
                mainContainer.innerHTML = `
                    <div class="h-full flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p class="text-gray-500 dark:text-gray-400">${message}</p>
                            <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" onclick="loadSalesData()">
                                Retry
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        // Export functionality
        function initializeExportFeatures() {
            const exportButtons = dashboard.querySelectorAll('.export-btn');

            exportButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const format = btn.dataset.format;
                    exportData(format);
                });
            });
        }

        function exportData(format) {
            if (!state.dataCache) {
                alert('No data available to export');
                return;
            }

            const { rawData, stats } = state.dataCache;
            const includeCharts = document.getElementById('include-charts').checked;
            const includeSummary = document.getElementById('include-summary').checked;

            if (format === 'csv') {
                exportCSV(rawData, stats, includeSummary);
            } else if (format === 'json') {
                exportJSON(rawData, stats, includeSummary, includeCharts);
            }
        }

        function exportCSV(data, stats, includeSummary) {
            let csv = 'Date,Salesperson,Sales Count,Growth Rate\n';

            data.forEach(item => {
                const growthRate = item.increase !== undefined && item.increase !== null ? item.increase : 0;
                csv += `${item.yMDString},${item.name},${item.totalCount || 0},${growthRate.toFixed(1)}%\n`;
            });

            if (includeSummary) {
                csv += '\n\nSummary Statistics\n';
                csv += `Total Sales,${stats.totalSales}\n`;
                csv += `Average Daily,${stats.avgDaily}\n`;
                csv += `Top Performer,${stats.topPerformer}\n`;
                csv += `Average Growth Rate,${stats.growthRate}%\n`;
            }

            downloadFile(csv, 'sales-data.csv', 'text/csv');
        }

        function exportJSON(data, stats, includeSummary, includeCharts) {
            const exportData = {
                data: data,
                exportDate: new Date().toISOString(),
                dateRange: state.dateRange
            };

            if (includeSummary) {
                exportData.summary = stats;
            }

            if (includeCharts && mainChart) {
                exportData.chartImage = mainChart.getDataURL({
                    type: 'png',
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                });
            }

            const jsonString = JSON.stringify(exportData, null, 2);
            downloadFile(jsonString, 'sales-data.json', 'application/json');
        }

        function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        }

        // Chart controls
        function initializeChartControls() {
            const chartTypeSelect = document.getElementById('chart-type');
            const dateRangeSelect = document.getElementById('date-range');
            const refreshBtn = document.getElementById('refresh-data');

            chartTypeSelect.addEventListener('change', (e) => {
                state.chartType = e.target.value;
                updateCharts();
            });

            dateRangeSelect.addEventListener('change', (e) => {
                state.dateRange = parseInt(e.target.value);
                loadSalesData(); // Reload data with new range
            });

            refreshBtn.addEventListener('click', () => {
                state.dataCache = null; // Force refresh
                loadSalesData();
            });
        }

        // Keyboard shortcuts
        function initializeKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (!state.isVisible) return;

                // ESC to close
                if (e.key === 'Escape') {
                    hideDashboard();
                }

                // Ctrl/Cmd + R to refresh
                if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                    e.preventDefault();
                    state.dataCache = null;
                    loadSalesData();
                }

                // Ctrl/Cmd + D to toggle theme
                if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                    e.preventDefault();
                    const themeToggle = dashboard.querySelector('#theme-toggle');
                    if (themeToggle) themeToggle.click();
                }

                // T key to toggle theme (simple shortcut)
                if (e.key === 't' || e.key === 'T') {
                    const themeToggle = dashboard.querySelector('#theme-toggle');
                    if (themeToggle) themeToggle.click();
                }

                // Number keys for tab switching
                if (e.key >= '1' && e.key <= '4') {
                    const tabs = ['overview', 'charts', 'table', 'export'];
                    const tabIndex = parseInt(e.key) - 1;
                    if (tabs[tabIndex]) {
                        const tab = dashboard.querySelector(`[data-tab="${tabs[tabIndex]}"]`);
                        if (tab) tab.click();
                    }
                }
            });
        }

        // 更新历史数据状态显示
        function updateHistoryStatus() {
            const historyInfo = document.getElementById('history-info');
            if (!historyInfo) return;

            HistoryManager.loadHistory();
            const range = HistoryManager.getAvailableDateRange();

            if (range) {
                const today = new Date().toISOString().split('T')[0];
                const todayData = state.historicalData.get(today);
                const lastUpdate = todayData ? new Date(todayData.timestamp).toLocaleTimeString() : 'Never';

                historyInfo.innerHTML = `
                    <span class="text-green-600 dark:text-green-400">
                        ${range.totalDays} days stored (${range.startDate} to ${range.endDate})
                    </span>
                    <span class="text-gray-400">•</span>
                    <span>Last update: ${lastUpdate}</span>
                `;
            } else {
                historyInfo.innerHTML = `
                    <span class="text-yellow-600 dark:text-yellow-400">
                        No historical data available
                    </span>
                `;
            }
        }

        // 数据清理功能
        function initializeDataManagement() {
            // 添加数据管理按钮到导出页面
            const exportTab = document.getElementById('export-tab');
            if (exportTab) {
                const managementSection = document.createElement('div');
                managementSection.className = 'mt-8 pt-6 border-t border-gray-200 dark:border-gray-700';
                managementSection.innerHTML = `
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-4">📊 Advanced Data Management</h4>

                    <!-- 数据统计信息 -->
                    <div id="data-statistics" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h5 class="font-medium text-gray-900 dark:text-white mb-3">Storage Statistics</h5>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400" id="stat-days">-</div>
                                <div class="text-gray-600 dark:text-gray-400">Days Stored</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600 dark:text-green-400" id="stat-records">-</div>
                                <div class="text-gray-600 dark:text-gray-400">Total Records</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400" id="stat-people">-</div>
                                <div class="text-gray-600 dark:text-gray-400">Salespeople</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400" id="stat-size">-</div>
                                <div class="text-gray-600 dark:text-gray-400">Storage (KB)</div>
                            </div>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <button id="import-data" class="p-4 border border-green-300 dark:border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-center">
                            <svg class="w-8 h-8 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                            </svg>
                            <h5 class="font-medium text-green-700 dark:text-green-400">Import Data</h5>
                            <p class="text-sm text-green-600 dark:text-green-500 mt-1">Upload historical data file</p>
                        </button>

                        <button id="export-range" class="p-4 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center">
                            <svg class="w-8 h-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <h5 class="font-medium text-blue-700 dark:text-blue-400">Export Range</h5>
                            <p class="text-sm text-blue-600 dark:text-blue-500 mt-1">Export specific date range</p>
                        </button>

                        <button id="manage-data" class="p-4 border border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-center">
                            <svg class="w-8 h-8 mx-auto mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <h5 class="font-medium text-purple-700 dark:text-purple-400">Manage Data</h5>
                            <p class="text-sm text-purple-600 dark:text-purple-500 mt-1">Advanced data operations</p>
                        </button>
                    </div>

                    <!-- 危险操作区域 -->
                    <div class="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                        <h5 class="font-medium text-red-800 dark:text-red-400 mb-3">⚠️ Danger Zone</h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button id="clear-history" class="p-3 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-center">
                                <svg class="w-6 h-6 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                <h6 class="font-medium text-red-700 dark:text-red-400">Clear All Data</h6>
                                <p class="text-xs text-red-600 dark:text-red-500 mt-1">Permanently delete all history</p>
                            </button>

                            <button id="cleanup-old" class="p-3 border border-orange-300 dark:border-orange-600 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-center">
                                <svg class="w-6 h-6 mx-auto mb-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <h6 class="font-medium text-orange-700 dark:text-orange-400">Cleanup Old Data</h6>
                                <p class="text-xs text-orange-600 dark:text-orange-500 mt-1">Remove data older than 180 days</p>
                            </button>
                        </div>
                    </div>

                    <!-- 隐藏的文件输入 -->
                    <input type="file" id="import-file-input" accept=".json" style="display: none;">
                `;

                exportTab.querySelector('.max-w-2xl').appendChild(managementSection);

                // 更新统计信息
                function updateDataStatistics() {
                    const stats = HistoryManager.getDataStatistics();
                    document.getElementById('stat-days').textContent = stats.totalDays;
                    document.getElementById('stat-records').textContent = stats.totalRecords.toLocaleString();
                    document.getElementById('stat-people').textContent = stats.uniqueSalespeople;
                    document.getElementById('stat-size').textContent = stats.dataSize;
                }

                // 初始化统计信息
                updateDataStatistics();

                // 绑定事件
                document.getElementById('clear-history').addEventListener('click', () => {
                    if (confirm('⚠️ Are you sure you want to clear ALL historical data?\n\nThis action will permanently delete all stored sales data and cannot be undone.\n\nClick OK to proceed or Cancel to abort.')) {
                        localStorage.removeItem(HistoryManager.STORAGE_KEY);
                        state.historicalData.clear();
                        updateHistoryStatus();
                        updateDataStatistics();
                        alert('✅ All historical data has been cleared successfully.');
                    }
                });

                document.getElementById('cleanup-old').addEventListener('click', () => {
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 180);
                    const cutoffString = cutoffDate.toISOString().split('T')[0];

                    if (confirm(`🧹 Clean up data older than 180 days?\n\nThis will remove all data before ${cutoffString}.\n\nClick OK to proceed or Cancel to abort.`)) {
                        const deletedCount = HistoryManager.deleteDataRange('2020-01-01', cutoffString);
                        updateHistoryStatus();
                        updateDataStatistics();
                        alert(`✅ Cleanup completed! Removed ${deletedCount} days of old data.`);
                    }
                });

                document.getElementById('import-data').addEventListener('click', () => {
                    document.getElementById('import-file-input').click();
                });

                document.getElementById('import-file-input').addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);
                            const result = HistoryManager.importData(importedData);

                            if (result.success) {
                                updateHistoryStatus();
                                updateDataStatistics();

                                let message = `✅ Import completed successfully!\n\n`;
                                message += `📊 Imported: ${result.importedCount} new days\n`;
                                if (result.overwrittenCount > 0) {
                                    message += `🔄 Overwritten: ${result.overwrittenCount} existing days\n`;
                                }
                                message += `📅 Total days in storage: ${result.totalDays}`;

                                alert(message);
                            } else {
                                alert(`❌ Import failed: ${result.error}`);
                            }
                        } catch (error) {
                            alert(`❌ Invalid file format: ${error.message}`);
                        }
                    };
                    reader.readAsText(file);

                    // Reset file input
                    event.target.value = '';
                });

                document.getElementById('export-range').addEventListener('click', () => {
                    showExportRangeDialog();
                });

                document.getElementById('manage-data').addEventListener('click', () => {
                    showDataManagementDialog();
                });
            }
        }

        // 显示导出范围对话框
        function showExportRangeDialog() {
            const range = HistoryManager.getAvailableDateRange();
            if (!range) {
                alert('❌ No historical data available for export.');
                return;
            }

            const startDate = prompt(`📅 Export Date Range\n\nEnter start date (YYYY-MM-DD):\n\nAvailable range: ${range.startDate} to ${range.endDate}`, range.startDate);
            if (!startDate) return;

            const endDate = prompt(`📅 Export Date Range\n\nEnter end date (YYYY-MM-DD):\n\nStart date: ${startDate}\nAvailable range: ${range.startDate} to ${range.endDate}`, range.endDate);
            if (!endDate) return;

            try {
                const exportData = HistoryManager.exportDataRange(startDate, endDate);
                if (exportData.totalDays === 0) {
                    alert('❌ No data found in the specified date range.');
                    return;
                }

                const jsonString = JSON.stringify(exportData, null, 2);
                downloadFile(jsonString, `sales-data-${startDate}-to-${endDate}.json`, 'application/json');

                alert(`✅ Export completed!\n\n📊 Exported ${exportData.totalDays} days of data\n📅 Date range: ${startDate} to ${endDate}`);
            } catch (error) {
                alert(`❌ Export failed: ${error.message}`);
            }
        }

        // 显示数据管理对话框
        function showDataManagementDialog() {
            const range = HistoryManager.getAvailableDateRange();
            if (!range) {
                alert('❌ No historical data available for management.');
                return;
            }

            const stats = HistoryManager.getDataStatistics();
            let message = `📊 Data Management Options\n\n`;
            message += `📅 Available data: ${range.startDate} to ${range.endDate}\n`;
            message += `📈 Total days: ${stats.totalDays}\n`;
            message += `📋 Total records: ${stats.totalRecords.toLocaleString()}\n`;
            message += `👥 Unique salespeople: ${stats.uniqueSalespeople}\n`;
            message += `💾 Storage size: ${stats.dataSize} KB\n\n`;
            message += `Choose an action:\n`;
            message += `1. Delete specific date range\n`;
            message += `2. View detailed statistics\n`;
            message += `3. Optimize storage\n\n`;
            message += `Enter option number (1-3):`;

            const option = prompt(message);

            switch (option) {
                case '1':
                    showDeleteRangeDialog(range);
                    break;
                case '2':
                    showDetailedStatistics(stats, range);
                    break;
                case '3':
                    optimizeStorage();
                    break;
                default:
                    if (option !== null) {
                        alert('❌ Invalid option selected.');
                    }
            }
        }

        // 显示删除范围对话框
        function showDeleteRangeDialog(range) {
            const startDate = prompt(`🗑️ Delete Date Range\n\nEnter start date (YYYY-MM-DD):\n\nAvailable range: ${range.startDate} to ${range.endDate}`, range.startDate);
            if (!startDate) return;

            const endDate = prompt(`🗑️ Delete Date Range\n\nEnter end date (YYYY-MM-DD):\n\nStart date: ${startDate}\nAvailable range: ${range.startDate} to ${range.endDate}`, startDate);
            if (!endDate) return;

            if (confirm(`⚠️ Delete data from ${startDate} to ${endDate}?\n\nThis action cannot be undone.\n\nClick OK to proceed or Cancel to abort.`)) {
                const deletedCount = HistoryManager.deleteDataRange(startDate, endDate);
                updateHistoryStatus();

                // 更新统计信息（如果在导出页面）
                const statsElement = document.getElementById('stat-days');
                if (statsElement) {
                    const stats = HistoryManager.getDataStatistics();
                    document.getElementById('stat-days').textContent = stats.totalDays;
                    document.getElementById('stat-records').textContent = stats.totalRecords.toLocaleString();
                    document.getElementById('stat-people').textContent = stats.uniqueSalespeople;
                    document.getElementById('stat-size').textContent = stats.dataSize;
                }

                alert(`✅ Deletion completed!\n\n🗑️ Removed ${deletedCount} days of data`);
            }
        }

        // 显示详细统计信息
        function showDetailedStatistics(stats, range) {
            let message = `📊 Detailed Storage Statistics\n\n`;
            message += `📅 Date Range: ${range.startDate} to ${range.endDate}\n`;
            message += `📈 Total Days: ${stats.totalDays}\n`;
            message += `📋 Total Records: ${stats.totalRecords.toLocaleString()}\n`;
            message += `👥 Unique Salespeople: ${stats.uniqueSalespeople}\n`;
            message += `💰 Total Sales: ${stats.totalSales.toLocaleString()}\n`;
            message += `📊 Average Daily Sales: ${stats.averageDailySales.toLocaleString()}\n`;
            message += `💾 Storage Size: ${stats.dataSize} KB\n`;
            message += `📱 Records per Day: ${Math.round(stats.totalRecords / stats.totalDays)}\n`;
            message += `💾 Average KB per Day: ${(stats.dataSize / stats.totalDays).toFixed(2)} KB\n`;

            alert(message);
        }

        // 优化存储
        function optimizeStorage() {
            if (confirm('🔧 Optimize Storage\n\nThis will:\n• Remove duplicate entries\n• Clean up invalid data\n• Compress storage format\n\nProceed with optimization?')) {
                // 执行数据清理和优化
                const originalSize = HistoryManager.getStorageSize();

                // 清理过期数据
                HistoryManager.cleanOldData();

                // 重新保存以压缩格式
                HistoryManager.saveHistory();

                const newSize = HistoryManager.getStorageSize();
                const savedSpace = originalSize - newSize;

                // 更新统计信息
                const statsElement = document.getElementById('stat-days');
                if (statsElement) {
                    const stats = HistoryManager.getDataStatistics();
                    document.getElementById('stat-days').textContent = stats.totalDays;
                    document.getElementById('stat-records').textContent = stats.totalRecords.toLocaleString();
                    document.getElementById('stat-people').textContent = stats.uniqueSalespeople;
                    document.getElementById('stat-size').textContent = stats.dataSize;
                }

                alert(`✅ Storage optimization completed!\n\n💾 Original size: ${originalSize} KB\n💾 New size: ${newSize} KB\n💾 Space saved: ${savedSpace.toFixed(2)} KB`);
            }
        }

        // Window resize handler to adjust dashboard position
        function handleResize() {
            if (state.isVisible && !state.isFullscreen) {
                const navbarHeight = getNavbarHeight();
                const dashboardContainer = document.getElementById('analytics-dashboard-container');
                if (dashboardContainer) {
                    dashboardContainer.style.top = navbarHeight + 'px';
                }
            }
            // 同时处理图表resize
            handleChartResize();
        }

        // Initialize all components
        initializeTabSwitching();
        initializeThemeToggle();
        initializeDashboardControls();
        initializeOverviewChartControls();
        initializeExportFeatures();
        initializeChartControls();
        initializeKeyboardShortcuts();
        initializeDataManagement();

        // Add resize listener - 使用优化的resize处理
        window.addEventListener('resize', handleResize);

        // 初始化时更新历史数据状态
        setTimeout(updateHistoryStatus, 500);

        console.log('Advanced Sales Analytics Dashboard initialized successfully');
    }
})();