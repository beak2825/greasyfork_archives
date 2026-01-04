// ==UserScript==
// @name         Drawaria.online Moderator Profile Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms the moderator profile page into a static, Maxton-like moderation dashboard with a real chart and local avatar upload.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/profile/?uid=moderator
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544856/Drawariaonline%20Moderator%20Profile%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/544856/Drawariaonline%20Moderator%20Profile%20Dashboard.meta.js
// ==/UserScript==

/* global $, Chart */ // Declare Chart as a global variable for Tampermonkey

(function() {
    'use strict';

    // Remove the existing content from the target page
    $('.row').remove();

    // --- HTML TEMPLATES ---
    // The main dashboard container
    const dashboardHTML = `
        <div id="maxton-mod-dashboard">
            <div id="dashboard-header">
                <h2>Moderation Dashboard</h2>
                <div class="header-controls">
                    <button id="theme-toggle-btn" class="control-button">☀️</button>
                    <!-- Settings button removed -->
                </div>
            </div>

            <div id="dashboard-stats-grid">
                <div class="stat-card welcome-card">
                    <div class="card-content">
                        <div class="avatar-container">
                            <img src="https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg" alt="User Avatar" class="user-avatar">
                            <span class="edit-icon avatar-edit-icon" title="Edit Avatar">✏️</span>
                            <input type="file" id="avatar-upload-input" accept="image/*" style="display: none;">
                        </div>
                        <div class="user-info-text">
                            <p class="welcome-text">Welcome back</p>
                            <h3 class="user-name-container">
                                <span class="user-name">YouTubeDrawaria</span>
                                <span class="edit-icon name-edit-icon" title="Edit Name">✏️</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="card-header">
                        <h4>Active Users</h4>
                        <span class="card-options">...</span>
                    </div>
                    <div class="card-content">
                        <p class="stat-value" id="activeUsersValue">42.5K</p>
                        <div class="stat-detail">
                            <span class="percentage" id="activeUsersPercentage">78%</span>
                            <div class="progress-bar-container"><div class="progress-bar" id="activeUsersProgressBar" style="width: 78%;"></div></div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="card-header">
                        <h4>Total Users</h4>
                        <span class="card-options">...</span>
                    </div>
                    <div class="card-content">
                        <p class="stat-value" id="totalUsersValue">97.4K</p>
                        <div class="chart-wrapper">
                            <canvas id="totalUsersChart"></canvas>
                        </div>
                        <p class="stat-note" id="totalUsersNote">12.5% from last month</p>
                    </div>
                </div>

                <div class="stat-card sales-card">
                    <div class="card-content">
                        <h4 class="card-title">Today's Sales</h4>
                        <p class="stat-value" id="todaySalesValue">$65.4K</p>
                        <div class="stat-detail">
                            <span class="growth-rate" id="salesGrowthRate">78.4% Growth Rate</span>
                            <div class="progress-bar-container"><div class="progress-bar" id="salesProgressBar" style="width: 78%;"></div></div>
                        </div>
                    </div>
                </div>

                 <div class="stat-card users-card">
                    <div class="card-header">
                        <h4>Current Players</h4>
                        <input type="text" id="user-search" placeholder="Search users..." class="search-input">
                    </div>
                    <div class="card-content user-list-content">
                        <div id="user-list-container"></div>
                    </div>
                </div>

                <div class="stat-card log-card">
                    <div class="card-header">
                        <h4>Moderation Logs</h4>
                        <span class="card-options">...</span>
                    </div>
                    <div class="card-content log-list-content">
                        <div id="log-panel"></div>
                    </div>
                </div>

                <div class="stat-card reports-card">
                    <div class="card-header">
                        <h4>Pending Reports</h4>
                        <span class="card-options">...</span>
                    </div>
                    <div class="card-content">
                        <p class="stat-value" id="pendingReportsValue">3</p>
                        <p class="stat-note">New reports needing review.</p>
                        <!-- View All button removed -->
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalHTML = `
        <div id="mod-action-modal" class="mod-modal">
            <div class="mod-modal-content">
                <h4 id="modal-title">Moderation Action</h4>
                <p>User: <strong id="modal-user-name"></strong></p>
                <input type="hidden" id="modal-user-id">
                <div>
                    <label for="modal-reason">Reason (Required)</label>
                    <select id="modal-reason">
                        <option>Spamming / Flooding</option>
                        <option>Inappropriate Drawing</option>
                        <option>Offensive Language</option>
                        <option>Cheating / Hacking</option>
                        <option>Other</option>
                    </select>
                </div>
                <div id="modal-duration-group">
                    <label for="modal-duration">Duration</label>
                    <select id="modal-duration">
                        <option value="300">5 Minutes</option>
                        <option value="3600">1 Hour</option>
                        <option value="86400">1 Day</option>
                        <option value="-1">Permanent</option>
                    </select>
                </div>
                <div>
                    <label for="modal-notes">Internal Notes</label>
                    <textarea id="modal-notes" rows="3" placeholder="Visible only to mods..."></textarea>
                </div>
                <div class="mod-modal-buttons">
                    <button id="modal-confirm-btn" class="confirm-btn">Confirm</button>
                    <button id="modal-cancel-btn" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Append the new dashboard and modal to the body
    $('body').append(dashboardHTML).append(modalHTML);


    // --- STYLES (CSS) ---
    GM_addStyle(`
        :root {
            --maxton-bg-dark: #1e1f26;
            --maxton-card-bg: #2b2e3a;
            --maxton-header-bg: #2b2e3a;
            --maxton-text-light: #e0e0e0;
            --maxton-text-muted: #8a8a8a;
            --maxton-accent-blue: #7289da;
            --maxton-accent-green: #43b581;
            --maxton-accent-orange: #faa61a;
            --maxton-accent-red: #f04747;
            --maxton-border-color: #3f424c;
            --maxton-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            --maxton-border-radius: 12px;
        }

        /* Light Mode Variables */
        :root.light-mode {
            --maxton-bg-dark: #f0f2f5;
            --maxton-card-bg: #ffffff;
            --maxton-header-bg: #e3e5e8;
            --maxton-text-light: #2e3338;
            --maxton-text-muted: #6a737d;
            --maxton-border-color: #dcdfe3;
            --maxton-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        body {
            background-color: var(--maxton-bg-dark);
            color: var(--maxton-text-light);
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Prefer a modern font */
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            overflow-x: hidden;
        }

        /* Ensure the dashboard fills the primary content area */
        #maxton-mod-dashboard {
            width: 95%; /* Adjust as needed for specific page layout */
            max-width: 1400px; /* Limit max width */
            margin: 20px auto; /* Center the dashboard */
            background-color: var(--maxton-bg-dark); /* Main background */
            border-radius: var(--maxton-border-radius);
            box-shadow: var(--maxton-shadow);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        #dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: var(--maxton-card-bg); /* Use card background for header too */
            border-radius: var(--maxton-border-radius);
            box-shadow: var(--maxton-shadow);
            color: var(--maxton-text-light);
        }

        #dashboard-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: var(--maxton-text-light);
        }

        .header-controls .control-button {
            background-color: var(--maxton-accent-blue);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: background-color 0.3s ease;
        }
        .header-controls .control-button:hover {
            background-color: #5b73d1; /* A darker shade of blue */
        }
        #theme-toggle-btn {
            background: none;
            color: var(--maxton-text-light);
            font-size: 20px;
            border: none;
            cursor: pointer;
        }

        #dashboard-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            flex-grow: 1; /* Allow grid to grow */
        }

        .stat-card {
            background-color: var(--maxton-card-bg);
            border-radius: var(--maxton-border-radius);
            padding: 20px;
            box-shadow: var(--maxton-shadow);
            display: flex;
            flex-direction: column;
            color: var(--maxton-text-light);
            min-height: 150px; /* Ensure cards have a minimum height */
        }

        .stat-card.welcome-card {
            grid-column: span 2; /* Make welcome card span two columns on wider screens */
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #3a3f5a, #2b2e3a); /* Gradient background */
        }
        @media (max-width: 768px) {
            .stat-card.welcome-card {
                grid-column: span 1; /* Back to single column on smaller screens */
            }
        }

        .welcome-card .card-content {
            display: flex;
            align-items: center;
            width: 100%;
        }

        /* Edit Icon Styles */
        .avatar-container, .user-name-container {
            position: relative; /* For absolute positioning of edit icons */
            display: inline-flex; /* To wrap content tightly and allow flex behavior */
            align-items: center; /* For vertical alignment of items within */
        }

        .edit-icon {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border-radius: 50%;
            width: 28px; /* Slightly larger icon */
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, background-color 0.3s ease;
            pointer-events: none; /* Do not block clicks on avatar/name by default */
            z-index: 10; /* Ensure icon is on top */
        }
        .edit-icon:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        /* Specific positioning for avatar edit icon */
        .avatar-container {
            margin-right: 15px;
            flex-shrink: 0;
        }
        .avatar-container .edit-icon {
            right: -5px; /* Position relative to the edge of the avatar circle */
            bottom: -5px;
            transform: none; /* Remove transform if using bottom/right directly */
        }

        /* Specific positioning for name edit icon */
        .user-name-container {
            flex-grow: 1; /* Allow name container to take available space */
            margin: 5px 0 0; /* Align with previous design */
        }
        .user-name-container .edit-icon {
            position: static; /* Make it flow with text */
            margin-left: 8px; /* Space between name and icon */
            transform: none;
            background: none; /* No background for inline icon */
            color: var(--maxton-text-muted); /* Match surrounding text color */
            font-size: 16px; /* Slightly larger for text */
            width: auto; /* Reset width/height for inline text */
            height: auto;
            border-radius: 0;
        }
        .user-name-container .edit-icon:hover {
            color: var(--maxton-text-light); /* Highlight on hover */
            background: none;
        }


        /* Hover effects for showing icons */
        .avatar-container:hover .avatar-edit-icon,
        .user-name-container:hover .name-edit-icon {
            opacity: 1;
            pointer-events: auto; /* Enable clicks on hover */
        }


        .welcome-card .user-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 3px solid var(--maxton-accent-blue);
            display: block; /* Ensure no extra space below image */
        }
        .welcome-card .user-info-text {
            flex-grow: 1;
            display: flex; /* Make it a flex container for alignment */
            flex-direction: column;
        }
        .welcome-card .welcome-text {
            margin: 0;
            color: var(--maxton-text-muted);
            font-size: 14px;
        }
        .welcome-card .user-name {
            font-size: 22px;
            font-weight: 700;
            color: var(--maxton-text-light);
        }


        .stat-card .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .stat-card .card-header h4 {
            margin: 0;
            font-size: 16px;
            color: var(--maxton-text-light);
            font-weight: 600;
        }
        .stat-card .card-options {
            color: var(--maxton-text-muted);
            cursor: pointer;
            font-size: 20px;
        }

        .stat-card .stat-value {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 10px;
            color: var(--maxton-text-light);
        }

        .stat-card .stat-detail {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: var(--maxton-text-muted);
            margin-top: auto; /* Push to bottom */
        }
        .stat-card .percentage, .stat-card .growth-rate {
            font-weight: 600;
            margin-right: 10px;
            /* Colors set dynamically by JS for positive/negative */
        }
        /* Default colors, overridden by JS */
        .stat-card .percentage { color: var(--maxton-accent-green); }
        .stat-card .growth-rate { color: var(--maxton-accent-green); }
        .stat-card .negative-growth { color: var(--maxton-accent-red); }


        .progress-bar-container {
            flex-grow: 1;
            height: 6px;
            background-color: var(--maxton-border-color);
            border-radius: 3px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background-color: var(--maxton-accent-blue);
            border-radius: 3px;
        }

        .chart-wrapper {
            position: relative; /* Needed for Chart.js responsiveness */
            height: 80px; /* Control chart height within the card */
            margin-bottom: 10px;
        }
        #totalUsersChart {
            /* Chart.js handles its own sizing, but this ensures it respects container */
            max-width: 100%;
            max-height: 100%;
        }


        .stat-card .stat-note {
            font-size: 12px;
            color: var(--maxton-text-muted);
            margin-top: 5px;
        }

        .search-input {
            width: 180px;
            padding: 8px 12px;
            background-color: var(--maxton-bg-dark);
            border: 1px solid var(--maxton-border-color);
            border-radius: 8px;
            color: var(--maxton-text-light);
            font-size: 14px;
        }
        .search-input::placeholder {
            color: var(--maxton-text-muted);
        }

        .user-list-content, .log-list-content {
            flex-grow: 1;
            overflow-y: auto; /* Make lists scrollable */
            max-height: 300px; /* Limit height for scrollable content */
            padding-right: 5px; /* For scrollbar */
        }

        /* User List Specifics */
        .user-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--maxton-border-color);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .user-item:last-child { border-bottom: none; }
        .user-item:hover { background-color: rgba(114, 137, 218, 0.1); } /* Light hover effect */

        .user-status-icon {
            margin-right: 10px;
            font-size: 18px;
            width: 20px;
            text-align: center;
            flex-shrink: 0;
        }
        .user-status-icon.reported { color: var(--maxton-accent-orange); } /* Orange */
        .user-status-icon.banned { color: var(--maxton-accent-red); } /* Red */
        .user-status-icon.muted { color: var(--maxton-text-muted); } /* Gray */
        .user-status-icon.mod { color: var(--maxton-accent-green); } /* Green */
        .user-status-icon.active { color: var(--maxton-accent-blue); } /* Blue for active */


        .user-name {
            flex-grow: 1;
            font-weight: 500;
            color: var(--maxton-text-light);
        }
        .user-actions {
            flex-shrink: 0;
        }
        .user-actions button {
            background-color: var(--maxton-accent-blue);
            border: none;
            color: white;
            border-radius: 6px;
            margin-left: 8px;
            padding: 5px 10px;
            font-size: 11px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .user-actions button:hover { background-color: #5b73d1; }


        /* Log Panel Specifics */
        #log-panel {
            padding: 0; /* Already handled by card padding */
            font-size: 13px;
            line-height: 1.5;
        }
        .log-entry {
            margin-bottom: 8px;
            border-left: 3px solid var(--maxton-border-color);
            padding-left: 10px;
            color: var(--maxton-text-light);
        }
        .log-entry.mod-action { border-left-color: var(--maxton-accent-orange); }
        .log-entry.report { border-left-color: var(--maxton-accent-red); }
        .log-entry.system { border-left-color: var(--maxton-accent-blue); }
        .log-entry.info { border-left-color: var(--maxton-text-muted); }


        /* Modal styles (retained and adjusted for theme) */
        .mod-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.7);
            justify-content: center;
            align-items: center;
        }
        .mod-modal-content {
            background-color: var(--maxton-card-bg);
            padding: 25px;
            border-radius: var(--maxton-border-radius);
            width: 90%;
            max-width: 500px;
            box-shadow: var(--maxton-shadow);
            color: var(--maxton-text-light);
        }
        .mod-modal-content h4 { margin-top: 0; color: var(--maxton-text-light); font-size: 20px; }
        .mod-modal-content label { display: block; margin-top: 15px; color: var(--maxton-text-muted); font-size: 14px; }
        .mod-modal-content input, .mod-modal-content select, .mod-modal-content textarea {
            width: calc(100% - 20px); /* Account for padding */
            padding: 10px;
            background-color: var(--maxton-bg-dark);
            border: 1px solid var(--maxton-border-color);
            border-radius: 6px;
            color: var(--maxton-text-light);
            margin-top: 5px;
            font-size: 14px;
            resize: vertical;
        }
        .mod-modal-buttons { text-align: right; margin-top: 25px; }
        .mod-modal-buttons button { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; transition: background-color 0.3s ease; }
        .mod-modal-buttons .confirm-btn { background-color: var(--maxton-accent-green); color: white; }
        .mod-modal-buttons .confirm-btn:hover { background-color: #3aa873; }
        .mod-modal-buttons .cancel-btn { background-color: var(--maxton-text-muted); color: white; margin-left: 10px; }
        .mod-modal-buttons .cancel-btn:hover { background-color: #72767d; }
    `);

    // Initialize the script
    const AdvancedMod = {
        state: {
            users: [],
            logs: [],
            selectedUserId: null,
            filter: '',
            theme: GM_getValue('theme', 'dark'), // Load initial theme
            chartInstance: null // To store the Chart.js instance
        },

        ui: {
            dashboard: $('#maxton-mod-dashboard'),
            userListContainer: $('#user-list-container'),
            logPanel: $('#log-panel'),
            modal: $('#mod-action-modal'),
            themeToggleBtn: $('#theme-toggle-btn'),
            avatarImage: $('.welcome-card .user-avatar'), // Reference to the image itself
            avatarUploadInput: $('#avatar-upload-input'), // Reference to the hidden file input
            userNameSpan: $('.welcome-card .user-name'),   // Reference to the name span itself
            totalUsersChartCanvas: $('#totalUsersChart'), // Reference to the chart canvas

            // References to the new randomizable elements
            activeUsersValue: $('#activeUsersValue'),
            activeUsersPercentage: $('#activeUsersPercentage'),
            activeUsersProgressBar: $('#activeUsersProgressBar'),
            totalUsersValue: $('#totalUsersValue'),
            totalUsersNote: $('#totalUsersNote'),
            todaySalesValue: $('#todaySalesValue'),
            salesGrowthRate: $('#salesGrowthRate'),
            salesProgressBar: $('#salesProgressBar'),
            pendingReportsValue: $('#pendingReportsValue')
        },

        init: function() {
            this.applyTheme(this.state.theme); // Apply theme on init
            this.bindEvents();
            this.fetchUsers(); // Initial fetch (for user list)
            this.updateDashboardStats(); // Update all random stats
            this.renderTotalUsersChart(); // Initialize chart with random data

            // Periodically refresh users to simulate real-time updates
            // TODO: Replace with actual game's user list or API fetch
            setInterval(() => this.fetchUsers(), 5000);
            // Consider periodically updating other stats if they are truly dynamic
            // setInterval(() => this.updateDashboardStats(), 30000); // e.g., every 30 seconds
        },

        // --- HELPER FUNCTIONS FOR RANDOMIZATION ---
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getRandomFloat: function(min, max, decimals) {
            const str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
        },

        getRandomPercentage: function(min = 0, max = 100) {
            return this.getRandomInt(min, max);
        },

        getRandomSignedPercentage: function(min = -20, max = 20) { // Default for growth rates
            return this.getRandomFloat(min, max, 1);
        },

        // --- DATA HANDLING ---
        fetchUsers: function() {
            // TODO: CRITICAL - Replace this with the actual game's user list.
            // You will need to inspect the game's JavaScript objects (e.g., in the console)
            // to find where the player data is stored. It might be in an object like `game.players`
            // or received via a WebSocket message.
            this.state.users = [
                { id: 'user123', name: 'CoolPlayer_7', status: 'active', reports: 0 },
                { id: 'user456', name: 'TrollFace_LOL', status: 'reported', reports: 3 },
                { id: 'user789', name: 'ArtMaster', status: 'active', reports: 0 },
                { id: 'user101', name: 'BannedUser1', status: 'banned', reports: 12 },
                { id: 'user112', name: 'MutedGuy', status: 'muted', reports: 1 },
                { id: 'user007', name: 'TheModerator', status: 'mod', reports: 0 },
            ];
            this.addLog('User list updated.', 'system');
            this.render();
        },

        // --- RENDERING ---
        render: function() {
            this.renderUserList();
            this.renderLogs();
            // Chart and main stats are updated by specific functions, not general render
        },

        updateDashboardStats: function() {
            // Active Users
            const activeUsers = this.getRandomFloat(30, 60, 1);
            const activeUsersPercent = this.getRandomPercentage(50, 95);
            this.ui.activeUsersValue.text(`${activeUsers}K`);
            this.ui.activeUsersPercentage.text(`${activeUsersPercent}%`);
            this.ui.activeUsersProgressBar.css('width', `${activeUsersPercent}%`);

            // Total Users (main value)
            const totalUsers = this.getRandomFloat(80, 120, 1);
            this.ui.totalUsersValue.text(`${totalUsers}K`);

            // Today's Sales
            const todaySales = this.getRandomFloat(50, 90, 1);
            const salesGrowth = this.getRandomSignedPercentage(-15, 15);
            this.ui.todaySalesValue.text(`$${todaySales}K`);
            this.ui.salesGrowthRate.text(`${salesGrowth > 0 ? '+' : ''}${salesGrowth}% Growth Rate`);
            this.ui.salesGrowthRate.toggleClass('negative-growth', salesGrowth < 0);
            this.ui.salesProgressBar.css('width', `${Math.abs(salesGrowth)}%`); // Use absolute for progress bar visual

            // Pending Reports
            const pendingReports = this.getRandomInt(0, 10);
            this.ui.pendingReportsValue.text(pendingReports);

            // Re-render chart with new random data
            this.renderTotalUsersChart();
            this.ui.totalUsersNote.text(`${salesGrowth > 0 ? '+' : ''}${salesGrowth}% from last month`); // Reusing sales growth for total users note
        },

        renderUserList: function() {
            this.ui.userListContainer.empty();
            const searchTerm = $('#user-search').val().toLowerCase();

            this.state.users
                .filter(user => user.name.toLowerCase().includes(searchTerm) || user.id.toLowerCase().includes(searchTerm))
                .forEach(user => {
                const userItem = $(`
                    <div class="user-item" data-id="${user.id}">
                        <div class="user-status-icon ${user.status}" title="${user.status}">
                            ${this.getStatusIcon(user.status)}
                        </div>
                        <div class="user-name">${user.name}</div>
                        <div class="user-actions">
                            <button class="action-btn" data-action="mute">Mute</button>
                            <button class="action-btn" data-action="kick">Kick</button>
                            <button class="action-btn" data-action="ban">Ban</button>
                        </div>
                    </div>
                `);
                this.ui.userListContainer.append(userItem);
            });
        },

        renderLogs: function() {
            this.ui.logPanel.empty();
            this.state.logs.slice(-50).forEach(log => { // Show last 50 logs for a cleaner view in a card
                const logEntry = $(`<div class="log-entry ${log.type}">${log.message}</div>`);
                this.ui.logPanel.append(logEntry);
            });
            this.ui.logPanel.scrollTop(this.ui.logPanel[0].scrollHeight); // Auto-scroll to bottom
        },

        renderTotalUsersChart: function() {
            if (this.state.chartInstance) {
                this.state.chartInstance.destroy(); // Destroy existing chart if it exists
            }

            const ctx = this.ui.totalUsersChartCanvas[0].getContext('2d');

            // Generate random data for the chart (7 points for 7 months)
            const chartData = Array.from({length: 7}, (_, i) => this.getRandomInt(70000, 100000));

            this.state.chartInstance = new Chart(ctx, {
                type: 'line', // Line chart for trend
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Total Users',
                        data: chartData, // Use random data
                        borderColor: 'rgb(114, 137, 218)', // maxton-accent-blue
                        backgroundColor: 'rgba(114, 137, 218, 0.2)', // Semi-transparent fill
                        fill: true,
                        tension: 0.3, // Smooth lines
                        pointRadius: 3,
                        pointBackgroundColor: 'rgb(114, 137, 218)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allow custom height
                    plugins: {
                        legend: {
                            display: false // No legend
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'var(--maxton-card-bg)', // Match theme
                            titleColor: 'var(--maxton-text-light)',
                            bodyColor: 'var(--maxton-text-light)',
                            borderColor: 'var(--maxton-border-color)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false // No grid lines on x-axis
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--maxton-text-muted')
                            }
                        },
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--maxton-border-color') // Subtle grid lines
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--maxton-text-muted'),
                                callback: function(value) {
                                    return value / 1000 + 'K'; // Format as 'K'
                                }
                            }
                        }
                    }
                }
            });
        },

        // --- ACTIONS ---
        addLog: function(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            this.state.logs.push({ message: `[${timestamp}] ${message}`, type });
            this.renderLogs(); // Always re-render logs when new one is added
        },

        getStatusIcon: function(status) {
            switch(status) {
                case 'reported': return '⚠️';
                case 'banned': return '🚫';
                case 'muted': return '🔇';
                case 'mod': return '🛡️';
                case 'active': return '🟢'; // Added active status icon
                default: return '👤';
            }
        },

        openModal: function(action, userId) {
            const user = this.state.users.find(u => u.id === userId);
            if (!user) return;

            this.ui.modal.find('#modal-title').text(`${action.charAt(0).toUpperCase() + action.slice(1)} User`);
            this.ui.modal.find('#modal-user-name').text(user.name);
            this.ui.modal.find('#modal-user-id').val(user.id);
            this.ui.modal.find('#modal-duration-group').toggle(action !== 'kick');
            this.ui.modal.find('#modal-confirm-btn').attr('data-action', action);
            this.ui.modal.css('display', 'flex');
        },

        executeModAction: function(action, userId, reason, duration, notes) {
            const user = this.state.users.find(u => u.id === userId);
            if (!user) return;

            const durationText = duration === "-1" ? "permanently" : `for ${duration / 60} minutes`;
            const logMessage = `User ${user.name} (${userId}) was ${action}ed. Reason: ${reason}. ${action !== 'kick' ? `Duration: ${durationText}` : ''}. Notes: ${notes}`;
            this.addLog(logMessage, 'mod-action');

            // TODO: CRITICAL - This is where you call the game's actual moderation function.
            // It could be a WebSocket call or a JS function.
            // e.g., Game.sendModAction(action, userId, reason, duration);
            console.log("Executing Action:", { action, userId, reason, duration, notes });

            // Simulate the effect on the UI
            const userIndex = this.state.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                if (action === 'ban') this.state.users[userIndex].status = 'banned';
                if (action === 'mute') this.state.users[userIndex].status = 'muted';
                if (action === 'kick') {
                    this.state.users.splice(userIndex, 1);
                    this.state.selectedUserId = null;
                }
            }
            this.render();
            this.ui.modal.hide();
        },

        applyTheme: function(theme) {
            this.state.theme = theme;
            // Apply theme class to <html> element, as :root variables are defined there
            document.documentElement.className = ''; // Clear existing classes
            document.documentElement.classList.add(this.state.theme + '-mode');

            // Update the toggle button icon
            this.ui.themeToggleBtn.text(this.state.theme === 'dark' ? '☀️' : '🌙');

            // Update chart colors if theme changes
            if (this.state.chartInstance) {
                // Get computed styles for dynamic colors
                const textColor = getComputedStyle(document.documentElement).getPropertyValue('--maxton-text-muted');
                const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--maxton-border-color');
                const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--maxton-card-bg');

                this.state.chartInstance.options.scales.x.ticks.color = textColor;
                this.state.chartInstance.options.scales.y.ticks.color = textColor;
                this.state.chartInstance.options.scales.y.grid.color = gridColor;
                // Update tooltip background for theme consistency
                this.state.chartInstance.options.plugins.tooltip.backgroundColor = cardBg;
                this.state.chartInstance.options.plugins.tooltip.titleColor = getComputedStyle(document.documentElement).getPropertyValue('--maxton-text-light');
                this.state.chartInstance.options.plugins.tooltip.bodyColor = getComputedStyle(document.documentElement).getPropertyValue('--maxton-text-light');
                this.state.chartInstance.options.plugins.tooltip.borderColor = gridColor;
                this.state.chartInstance.update();
            }
        },

        toggleTheme: function() {
            const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            GM_setValue('theme', newTheme);
        },

        // --- SETTINGS PERSISTENCE ---
        saveSettings: function() {
            GM_setValue('theme', this.state.theme);
        },

        loadSettings: function() {
            this.state.theme = GM_getValue('theme', 'dark');
            this.applyTheme(this.state.theme); // Apply theme on load
        },

        // --- EVENT BINDING ---
        bindEvents: function() {
            // Theme Toggle
            this.ui.themeToggleBtn.on('click', () => this.toggleTheme());

            // User Search
            $('#user-search').on('keyup', () => this.renderUserList());

            // User Actions (Mute, Kick, Ban buttons within user items)
            this.ui.userListContainer.on('click', '.action-btn', (e) => {
                e.stopPropagation(); // Prevent any parent click handlers
                const target = $(e.currentTarget);
                const action = target.data('action');
                const userId = target.closest('.user-item').data('id');
                this.openModal(action, userId);
            });

            // Functional Edit Avatar (triggers hidden file input)
            $('.avatar-edit-icon').on('click', () => {
                this.ui.avatarUploadInput.click(); // Programmatically click the hidden file input
            });

            // Handle file selection for avatar
            this.ui.avatarUploadInput.on('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (readEvent) => {
                        this.ui.avatarImage.attr('src', readEvent.target.result);
                        this.addLog(`Avatar updated from local file: ${file.name}`, 'mod-action');
                    };
                    reader.onerror = (errorEvent) => {
                        console.error("Error reading file:", errorEvent);
                        this.addLog(`Failed to update avatar: Could not read file.`, 'error');
                    };
                    reader.readAsDataURL(file); // Read the file as a Data URL
                } else {
                    this.addLog('Avatar update cancelled (no file selected).', 'info');
                }
                e.target.value = null; // Clear the input so same file can be selected again
            });

            // Functional Edit Name
            $('.name-edit-icon').on('click', () => {
                const newName = prompt('Enter new name:', this.ui.userNameSpan.text());
                if (newName && newName.trim() !== '') {
                    this.ui.userNameSpan.text(newName.trim());
                    this.addLog(`Name changed to: ${newName}`, 'mod-action');
                } else if (newName !== null) { // User clicked OK but entered empty/whitespace
                    this.addLog('Name update cancelled (empty name not allowed).', 'info');
                } else { // User clicked Cancel
                     this.addLog('Name update cancelled.', 'info');
                }
            });
        }
    };

    // --- START THE SCRIPT ---
    AdvancedMod.init();

})();
