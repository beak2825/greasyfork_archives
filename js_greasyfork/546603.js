// ==UserScript==
// @name         HIVE Unpaid Services Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Displays unpaid HIVE service payments in the header widget on Torn City
// @author       HIVE Service
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546603/HIVE%20Unpaid%20Services%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/546603/HIVE%20Unpaid%20Services%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Update these values
    const CONFIG = {
        API_BASE_URL: 'https://service-backup.onrender.com/api/userscript',
        SERVER_ID: '1397036402478153830', // Replace with your Discord server ID
        UPDATE_INTERVAL: 30000, // 30 seconds
        AUTO_REFRESH: true
    };

    // State management
    let unpaidData = null;
    let isExpanded = false;
    let updateTimer = null;
    let widget = null;

    // CSS Styles
    const CSS = `
        .hive-unpaid-widget {
            position: relative;
            display: inline-block;
            margin-left: 10px;
            margin-right: 10px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: all 0.3s ease;
            max-width: 400px;
            vertical-align: middle;
        }

        .hive-unpaid-widget.collapsed {
            width: 50px;
            height: 35px;
            cursor: pointer;
        }

        .hive-unpaid-widget.expanded {
            position: absolute;
            top: 100%;
            right: 0;
            width: 400px;
            min-height: 200px;
            max-height: 600px;
            overflow-y: auto;
            margin-top: 5px;
            z-index: 10000;
        }

        .hive-widget-header {
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            color: white;
            font-weight: 600;
        }

        .hive-widget-toggle {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .hive-widget-content {
            padding: 16px;
            background: white;
            border-radius: 0 0 8px 8px;
            max-height: 500px;
            overflow-y: auto;
        }

        .hive-unpaid-item {
            padding: 12px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #007bff;
            transition: all 0.2s ease;
        }

        .hive-unpaid-item:hover {
            background: #e9ecef;
            transform: translateX(2px);
        }

        .hive-unpaid-item:last-child {
            margin-bottom: 0;
        }

        .hive-player-name {
            font-weight: 600;
            color: #212529;
            text-decoration: none;
            font-size: 16px;
            display: block;
            margin-bottom: 4px;
        }

        .hive-player-name:hover {
            color: #007bff;
            text-decoration: underline;
        }

        .hive-player-name-unlinked {
            color: #6c757d;
            font-weight: 600;
            font-style: italic;
            font-size: 16px;
            display: block;
            margin-bottom: 4px;
        }

        .hive-amount {
            color: #28a745;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 4px;
        }

        .hive-services {
            color: #6c757d;
            font-size: 14px;
            font-style: italic;
        }

        .hive-widget-footer {
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 0 0 8px 8px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .hive-refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s ease;
        }

        .hive-refresh-btn:hover {
            background: #0056b3;
        }

        .hive-loading {
            text-align: center;
            padding: 20px;
            color: #6c757d;
        }

        .hive-error {
            padding: 12px;
            background: #f8d7da;
            color: #721c24;
            border-radius: 6px;
            margin-bottom: 12px;
            font-size: 14px;
        }

        .hive-no-data {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-style: italic;
        }

        .hive-total-summary {
            background: #e7f3ff;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 16px;
            border-left: 4px solid #007bff;
        }

        .hive-total-amount {
            font-size: 18px;
            font-weight: 700;
            color: #007bff;
        }

        .hive-total-users {
            font-size: 14px;
            color: #6c757d;
            margin-top: 4px;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .hive-pulse {
            animation: pulse 2s infinite;
        }
    `;

    // Utility functions
    function formatCurrency(amount) {
        return '$' + new Intl.NumberFormat().format(amount);
    }

    function formatPlayerName(user) {
        // If user has proper Torn data, use it
        if (user.tornUsername && user.tornUsername !== 'Unknown' && user.tornId) {
            return { 
                name: user.tornUsername, 
                id: user.tornId, 
                displayName: `${user.tornUsername} [${user.tornId}]` 
            };
        }

        // Otherwise show Discord user with fallback
        const discordName = `Discord User ${user.userId.slice(-4)}`;
        return { 
            name: discordName, 
            id: 'Unlinked', 
            displayName: `${discordName} [Torn account not linked]` 
        };
    }

    function createPlayerLink(user) {
        const { name, id, displayName } = formatPlayerName(user);

        // Only create clickable link if we have a valid Torn ID
        if (id !== 'Unlinked' && id !== 'Unknown' && id !== null) {
            return `<a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank" class="hive-player-name">${displayName}</a>`;
        }

        // Otherwise just return plain text
        return `<span class="hive-player-name-unlinked">${displayName}</span>`;
    }

    // API functions
    function makeRequest(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(null, data);
                } catch (error) {
                    callback('Invalid response format', null);
                }
            },
            onerror: function() {
                callback('Network error', null);
            },
            ontimeout: function() {
                callback('Request timeout', null);
            },
            timeout: 10000
        });
    }

    function fetchUnpaidServices(callback) {
        const url = `${CONFIG.API_BASE_URL}/unpaid-services?serverId=${CONFIG.SERVER_ID}`;
        makeRequest(url, callback);
    }

    // Widget creation and management
    function createWidget() {
        // Remove existing widget if it exists
        if (widget) {
            widget.remove();
        }

        // Find the header menu container (next to hamburger menu)
        const headerMenu = document.querySelector('.header-menu.left');
        if (!headerMenu) {
            console.error('HIVE UserScript: Could not find header menu');
            return null;
        }

        widget = document.createElement('div');
        widget.className = 'hive-unpaid-widget collapsed';
        widget.innerHTML = `
            <div class="hive-widget-toggle">
                💰
            </div>
        `;

        // Insert after the header menu
        headerMenu.parentNode.insertBefore(widget, headerMenu.nextSibling);

        // Event listeners
        widget.addEventListener('click', toggleWidget);

        return widget;
    }

    function toggleWidget(event) {
        event.stopPropagation();
        if (isExpanded) {
            collapseWidget();
        } else {
            expandWidget();
        }
    }

    function expandWidget() {
        isExpanded = true;
        widget.className = 'hive-unpaid-widget expanded';
        updateWidgetContent();
    }

    function collapseWidget() {
        isExpanded = false;
        widget.className = 'hive-unpaid-widget collapsed';
        widget.innerHTML = `
            <div class="hive-widget-toggle">
                💰
            </div>
        `;
        // Re-attach event listener after innerHTML change
        widget.removeEventListener('click', toggleWidget);
        widget.addEventListener('click', toggleWidget);
    }

    function updateWidgetContent() {
        if (!isExpanded) return;

        const totalUsers = unpaidData?.totalUsers || 0;
        const badgeText = totalUsers > 0 ? totalUsers.toString() : '💰';

        if (!unpaidData) {
            widget.innerHTML = `
                <div class="hive-widget-header" onclick="event.stopPropagation();">
                    <span>HIVE Unpaid Services</span>
                    <span onclick="collapseWidget()" style="cursor: pointer; font-size: 18px;">×</span>
                </div>
                <div class="hive-widget-content">
                    <div class="hive-loading">Loading unpaid services...</div>
                </div>
            `;
            return;
        }

        if (!unpaidData.success) {
            widget.innerHTML = `
                <div class="hive-widget-header" onclick="event.stopPropagation();">
                    <span>HIVE Unpaid Services</span>
                    <span onclick="collapseWidget()" style="cursor: pointer; font-size: 18px;">×</span>
                </div>
                <div class="hive-widget-content">
                    <div class="hive-error">Failed to load data: ${unpaidData.error || 'Unknown error'}</div>
                    <button class="hive-refresh-btn" onclick="refreshData()">Retry</button>
                </div>
            `;
            return;
        }

        const services = unpaidData.unpaidServices || [];

        let contentHTML = `
            <div class="hive-widget-header" onclick="event.stopPropagation();">
                <span>HIVE Unpaid Services</span>
                <span onclick="collapseWidget()" style="cursor: pointer; font-size: 18px;">×</span>
            </div>
            <div class="hive-widget-content">
        `;

        if (services.length === 0) {
            contentHTML += '<div class="hive-no-data">No unpaid services found! 🎉</div>';
        } else {
            // Add summary
            contentHTML += `
                <div class="hive-total-summary">
                    <div class="hive-total-amount">${formatCurrency(unpaidData.totalAmount)}</div>
                    <div class="hive-total-users">${unpaidData.totalUsers} user${unpaidData.totalUsers !== 1 ? 's' : ''} with unpaid services</div>
                </div>
            `;

            // Add individual services
            services.forEach(user => {
                contentHTML += `
                    <div class="hive-unpaid-item">
                        ${createPlayerLink(user)}
                        <div class="hive-amount">${formatCurrency(user.totalAmount)}</div>
                        <div class="hive-services">${user.consolidatedDescription}</div>
                    </div>
                `;
            });
        }

        contentHTML += `
            </div>
            <div class="hive-widget-footer">
                <span>Updated: ${new Date().toLocaleTimeString()}</span>
                <button class="hive-refresh-btn" onclick="refreshData()">Refresh</button>
            </div>
        `;

        widget.innerHTML = contentHTML;

        // Re-attach event listeners after innerHTML update
        const header = widget.querySelector('.hive-widget-header');
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        const closeBtn = widget.querySelector('.hive-widget-header span:last-child');
        if (closeBtn) {
            closeBtn.addEventListener('click', collapseWidget);
        }

        const refreshBtn = widget.querySelector('.hive-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshData);
        }
    }

    function updateCollapsedBadge() {
        if (isExpanded) return;

        const totalUsers = unpaidData?.totalUsers || 0;
        let badgeContent = '💰';

        if (totalUsers > 0) {
            badgeContent = totalUsers.toString();
        }

        widget.innerHTML = `
            <div class="hive-widget-toggle ${totalUsers > 0 ? 'hive-pulse' : ''}">
                ${badgeContent}
            </div>
        `;
    }

    // Data management
    function refreshData() {
        fetchUnpaidServices((error, data) => {
            if (error) {
                console.error('HIVE UserScript: Failed to fetch unpaid services:', error);
                unpaidData = { success: false, error: error };
            } else {
                unpaidData = data;
                console.log('HIVE UserScript: Updated unpaid services data:', data);
            }

            if (isExpanded) {
                updateWidgetContent();
            } else {
                updateCollapsedBadge();
            }
        });
    }

    function startAutoRefresh() {
        if (CONFIG.AUTO_REFRESH && !updateTimer) {
            updateTimer = setInterval(refreshData, CONFIG.UPDATE_INTERVAL);
        }
    }

    function stopAutoRefresh() {
        if (updateTimer) {
            clearInterval(updateTimer);
            updateTimer = null;
        }
    }

    // Configuration management
    function loadConfig() {
        const savedConfig = GM_getValue('hive-config', null);
        if (savedConfig) {
            Object.assign(CONFIG, JSON.parse(savedConfig));
        }
    }

    function saveConfig() {
        GM_setValue('hive-config', JSON.stringify(CONFIG));
    }

    // Make functions globally available for onclick handlers
    window.collapseWidget = collapseWidget;
    window.refreshData = refreshData;

    // Initialize the userscript
    function init() {
        console.log('HIVE UserScript: Initializing...');

        loadConfig();

        // Check if required config is set
        if (!CONFIG.SERVER_ID || CONFIG.SERVER_ID === 'YOUR_DISCORD_SERVER_ID') {
            console.error('HIVE UserScript: SERVER_ID not configured. Please edit the userscript and set your Discord server ID.');
            return;
        }

        // Inject CSS
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        // Create widget
        createWidget();

        // Initial data fetch
        refreshData();

        // Start auto-refresh
        startAutoRefresh();

        console.log('HIVE UserScript: Initialized successfully');
    }

    // Wait for page to load and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoRefresh();
    });

})();