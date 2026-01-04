// ==UserScript==
// @name         Torn Stats Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Dark mode for Torn Stats with theme selector and improved styling
// @author       TR0LL
// @match        https://*.tornstats.com/*
// @match        https://www.tornstats.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/530235/Torn%20Stats%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530235/Torn%20Stats%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Script configuration
    const CURRENT_VERSION = '1.3';
    const SETTINGS_KEY = 'tornStatsDarkMode_settings';
    const LAST_CHECKED_KEY = 'tornStatsDarkMode_lastChecked';

    // Default settings
    const defaultSettings = {
        hideVisuals: true,
        forceDarkMode: true,
        colorTheme: 'pure-black'
    };

    // Always enable contrast
    const enhanceContrast = true;

    // Load settings or use defaults
    const settings = loadSettings();

    // Force hideVisuals to be true when Princess theme is selected
    if (settings.colorTheme === 'princess') {
        settings.hideVisuals = true;
    }

    // Color themes
    const colorThemes = {
        'pure-black': {
            background: {
                primary: '#000000',
                secondary: '#111111',
                tertiary: '#1A1A1A'
            }
        },
        'dark-gray': {
            background: {
                primary: '#121212',
                secondary: '#1E1E1E',
                tertiary: '#2A2A2A'
            }
        },
        'midnight-blue': {
            background: {
                primary: '#0A1929',
                secondary: '#132F4C',
                tertiary: '#173A5E'
            }
        },
        'princess': {
            background: {
                primary: '#1A0013',
                secondary: '#3D0A38',
                tertiary: '#5F1059'
            }
        }
    };

    // Get current theme colors
    const themeColors = colorThemes[settings.colorTheme];

    // Color scheme definition
    const colors = {
        background: themeColors.background,
        text: {
            primary: settings.colorTheme === 'princess' ? '#FFFFFF' : '#FFFFFF',
            secondary: settings.colorTheme === 'princess' ? '#FFEEFC' : '#E0E0E0',
            muted: settings.colorTheme === 'princess' ? '#FFD6EC' : '#CCCCCC'
        },
        border: {
            light: settings.colorTheme === 'princess' ? '#FF69B4' : '#555555',
            medium: settings.colorTheme === 'princess' ? '#FF1493' : '#666666',
            focus: settings.colorTheme === 'princess' ? '#FF00FF' : '#1E90FF'
        },
        accent: {
            blue: settings.colorTheme === 'princess' ? '#FF00FF' : '#4D90FE',
            green: settings.colorTheme === 'princess' ? '#FF69B4' : '#4CAF50',
            red: settings.colorTheme === 'princess' ? '#FF1493' : '#F44336',
            yellow: settings.colorTheme === 'princess' ? '#FFCBDB' : '#FFEB3B'
        },
        table: {
            success: '#1E551E',
            warning: '#635800',
            danger: '#5C1F1F'
        },
        chart: {
            background: themeColors.background.secondary,
            grid: '#333333',
            axis: '#777777',
            navigator: '#444444'
        },
        bootstrap: {
            blue: '#007bff',
            indigo: '#6610f2',
            purple: '#6f42c1',
            pink: '#e83e8c',
            red: '#dc3545',
            orange: '#fd7e14',
            yellow: '#ffc107',
            green: '#28a745',
            teal: '#20c997',
            cyan: '#17a2b8',
            white: '#fff',
            gray: '#6c757d',
            grayDark: '#343a40',
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            danger: '#dc3545',
            light: '#f8f9fa',
            dark: '#343a40'
        }
    };

    // Apply flash prevention styles immediately
    GM_addStyle(`
        html, body {
            background-color: ${colors.background.primary} !important;
            color: #FFFFFF !important;
            transition: none !important;
        }
    `);

    // Dark mode CSS
    const fullDarkModeCSS = `
        /* Base elements */
        html, body {
            background-color: ${colors.background.primary} !important;
            color: ${colors.text.primary} !important;
            background-image: none !important;
            transition: none !important;
            --blue: ${colors.bootstrap.blue};
            --indigo: ${colors.bootstrap.indigo};
            --purple: ${colors.bootstrap.purple};
            --pink: ${colors.bootstrap.pink};
            --red: ${colors.bootstrap.red};
            --orange: ${colors.bootstrap.orange};
            --yellow: ${colors.bootstrap.yellow};
            --green: ${colors.bootstrap.green};
            --teal: ${colors.bootstrap.teal};
            --cyan: ${colors.bootstrap.cyan};
            --white: ${colors.text.primary};
            --gray: ${colors.bootstrap.gray};
            --gray-dark: ${colors.bootstrap.grayDark};
            --primary: ${colors.bootstrap.primary};
            --secondary: ${colors.bootstrap.secondary};
            --success: ${colors.bootstrap.success};
            --info: ${colors.bootstrap.info};
            --warning: ${colors.bootstrap.warning};
            --danger: ${colors.bootstrap.danger};
            --light: ${colors.bootstrap.light};
            --dark: ${colors.bootstrap.dark};
        }

        /* Headers with enhanced contrast */
        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
            color: ${colors.text.primary} !important;
            text-shadow: 0 0 1px rgba(255,255,255,0.1) !important;
        }

        /* Cards, panels, containers */
        .card, .panel, .container, .container-fluid,
        .modal-content, .popover, .toast {
            background-color: ${colors.background.secondary} !important;
            color: ${colors.text.primary} !important;
            border-color: ${colors.border.light} !important;
        }

        /* Card headers and footers */
        .card-header, .card-footer, .panel-heading, .panel-footer,
        .card-header.bg-dark, .card-header.text-white.bg-dark, .bg-dark {
            background-color: ${colors.background.tertiary} !important;
            border-color: ${colors.border.light} !important;
            color: ${colors.text.primary} !important;
        }

        /* Tables with better contrast */
        table, .table {
            color: ${colors.text.primary} !important;
            background-color: ${colors.background.secondary} !important;
            border-color: ${colors.border.medium} !important;
        }

        .table-striped tbody tr:nth-of-type(odd) {
            background-color: ${colors.background.tertiary} !important;
        }

        .table th, .table td {
            border-color: ${colors.border.light} !important;
        }

        /* Table contextual classes */
        .table-success,
        .table-success > th,
        .table-success > td,
        td.table-success {
            background-color: ${colors.table.success} !important;
            color: ${colors.text.primary} !important;
        }

        .table-warning,
        .table-warning > th,
        .table-warning > td,
        td.table-warning {
            background-color: ${colors.table.warning} !important;
            color: ${colors.text.primary} !important;
        }

        .table-danger,
        .table-danger > th,
        .table-danger > td,
        td.table-danger {
            background-color: ${colors.table.danger} !important;
            color: ${colors.text.primary} !important;
        }

        tr.table-success,
        tr.table-warning,
        tr.table-danger {
            background-color: inherit !important;
        }

        /* Form elements */
        input, select, textarea, .form-control, .input-group-text, .custom-select {
            background-color: ${colors.background.tertiary} !important;
            color: ${colors.text.primary} !important;
            border-color: ${colors.border.medium} !important;
        }

        input:focus, select:focus, textarea:focus, .form-control:focus {
            border-color: ${colors.border.focus} !important;
            box-shadow: 0 0 0 0.2rem rgba(77, 144, 254, 0.5) !important;
        }

        /* Buttons */
        .btn-primary {
            background-color: ${colors.accent.blue} !important;
            border-color: ${colors.accent.blue} !important;
        }

        .btn-success {
            background-color: ${colors.accent.green} !important;
            border-color: ${colors.accent.green} !important;
        }

        .btn-danger {
            background-color: ${colors.accent.red} !important;
            border-color: ${colors.accent.red} !important;
        }

        .btn-warning {
            background-color: ${colors.accent.yellow} !important;
            border-color: ${colors.accent.yellow} !important;
            color: #212529 !important;
        }

        .btn-secondary, .btn-default, .btn-light {
            background-color: ${colors.background.tertiary} !important;
            border-color: ${colors.border.medium} !important;
            color: ${colors.text.primary} !important;
        }

        /* Navigation */
        .navbar.navbar-expand-md.navbar-dark.bg-dark.navbar-laravel,
        .card-header.text-center.text-white.bg-dark,
        .text-white.bg-dark {
            background-color: ${colors.background.primary} !important;
            color: ${colors.text.primary} !important;
        }

        .navbar, .nav, .pagination {
            background-color: ${colors.background.primary} !important;
            border-color: ${colors.border.light} !important;
        }

        .bg-dark {
            background-color: ${colors.background.primary} !important;
        }

        .navbar-dark .navbar-nav .nav-link, .nav-link {
            color: ${colors.text.primary} !important;
        }

        .navbar-dark .navbar-nav .nav-link:hover, .nav-link:hover {
            color: ${colors.accent.blue} !important;
            text-decoration: none !important;
        }

        .page-link {
            background-color: ${colors.background.tertiary} !important;
            border-color: ${colors.border.light} !important;
            color: ${colors.text.primary} !important;
        }

        .page-item.active .page-link {
            background-color: ${colors.accent.blue} !important;
            border-color: ${colors.accent.blue} !important;
        }

        /* Dropdown menus */
        .dropdown-menu {
            background-color: ${colors.background.primary} !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
        }

        .dropdown-item {
            color: ${colors.text.primary} !important;
        }

        .dropdown-item:hover, .dropdown-item:focus {
            background-color: ${colors.background.tertiary} !important;
            color: ${colors.accent.blue} !important;
        }

        .dropdown-divider {
            border-top-color: ${colors.border.light} !important;
        }

        /* Charts - Highcharts */
        .highcharts-background, .highcharts-plot-background {
            fill: ${colors.chart.background} !important;
        }

        .highcharts-grid-line {
            stroke: ${colors.chart.grid} !important;
            stroke-width: 1px !important;
        }

        .highcharts-axis-line, .highcharts-tick {
            stroke: ${colors.chart.axis} !important;
        }

        /* Chart text elements - improve readability */
        .highcharts-axis-labels text,
        .highcharts-legend-item text,
        .highcharts-title text,
        .highcharts-subtitle text,
        .highcharts-data-label text,
        .highcharts-xaxis-labels text,
        .highcharts-yaxis-labels text,
        .highcharts-navigator text,
        .highcharts-tooltip text {
            fill: ${colors.text.primary} !important;
            font-weight: bold !important;
            stroke-width: 0 !important;
            text-shadow: 0 0 3px ${colors.background.primary}, 0 0 3px ${colors.background.primary} !important;
        }

        /* Ensure readable text in all chart areas */
        .highcharts-xaxis text, .highcharts-yaxis text {
            font-size: 12px !important;
            fill: ${colors.text.primary} !important;
            stroke: none !important;
            font-weight: bold !important;
            text-shadow: 0 0 3px ${colors.background.primary}, 0 0 3px ${colors.background.primary} !important;
        }

        /* Legend specific styling */
        .highcharts-legend-item-text {
            font-weight: bold !important;
            fill: ${colors.text.primary} !important;
        }

        /* Navigator specific fixes */
        .highcharts-navigator-mask-inside {
            fill: transparent !important;
        }

        .highcharts-navigator-mask-outside {
            fill: transparent !important;
        }

        .highcharts-navigator-outline {
            stroke: ${settings.colorTheme === 'princess' ? '#FF69B4' : '#999999'} !important;
            stroke-width: 1px !important;
        }

        .highcharts-navigator-handle {
            stroke: ${settings.colorTheme === 'princess' ? '#FF69B4' : '#999999'} !important;
            fill: ${settings.colorTheme === 'princess' ? '#3D0A38' : '#f2f2f2'} !important;
        }

        /* Fix hardcoded styles */
        [style*="background-color: white"],
        [style*="background-color: #fff"],
        [style*="background-color: rgb(255, 255, 255)"],
        [style*="background: white"],
        [style*="background: #fff"] {
            background-color: ${colors.background.secondary} !important;
        }

        [style*="color: black"],
        [style*="color: #000"],
        [style*="color: rgb(0, 0, 0)"] {
            color: ${colors.text.primary} !important;
        }

        /* TornStats specific fixes */
        .progress {
            background-color: ${colors.background.tertiary} !important;
        }

        .progress-bar {
            background-color: ${colors.accent.blue} !important;
        }

        /* Links */
        a, a:link, a:visited {
            color: ${colors.accent.blue} !important;
        }

        a:hover, a:active {
            color: #7EB1FF !important;
            text-decoration: underline !important;
        }

        /* Table rows */
        tr.odd, tr.even {
            background-color: ${colors.background.secondary} !important;
        }

        tr.odd td, tr.even td {
            background-color: inherit !important;
        }

        /* Backgrounds */
        body[style*="background-image:"] {
            background-image: none !important;
            background-color: ${colors.background.primary} !important;
        }

        /* Spacing */
        .pt-5, .py-5 {
            padding-top: 2rem !important;
        }

        /* Stat colors */
        .color-14 { color: ${settings.colorTheme === 'princess' ? '#FFFDFA' : '#FFD700'} !important; }
        .color-13 { color: ${settings.colorTheme === 'princess' ? '#FFFFFF' : '#E0E0E0'} !important; }
        .color-12 { color: ${settings.colorTheme === 'princess' ? '#FFE4F0' : '#C0C0C0'} !important; }
        .color-11 { color: ${settings.colorTheme === 'princess' ? '#FFD6EC' : '#90EE90'} !important; }
        .color-10 { color: ${settings.colorTheme === 'princess' ? '#FFC0E0' : '#98FB98'} !important; }
        .color-09 { color: ${settings.colorTheme === 'princess' ? '#FFADD8' : '#ADD8E6'} !important; }
        .color-08 { color: ${settings.colorTheme === 'princess' ? '#FF90CC' : '#87CEEB'} !important; }
        .color-07 { color: ${settings.colorTheme === 'princess' ? '#FF69B4' : '#FFA07A'} !important; }
        .color-05, .color-06 { color: ${settings.colorTheme === 'princess' ? '#FF47A3' : '#FFA500'} !important; }
        .color-04, .color-03, .color-02, .color-01 { color: ${settings.colorTheme === 'princess' ? '#FF00FF' : '#FF6347'} !important; }

        /* Accessibility */
        :focus-visible {
            outline: 3px solid ${colors.accent.blue} !important;
            outline-offset: 2px !important;
        }

        /* Loading indicators */
        .spinner-border, .spinner-grow {
            border-color: ${colors.text.secondary} !important;
            border-right-color: transparent !important;
        }

        /* Hide Google Ads */
        .google-auto-placed,
        .adsbygoogle,
        [data-ad-client],
        div[id^="aswift_"],
        iframe[id^="google_ads_"],
        ins.adsbygoogle {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
        }

        /* DataTables */
        .dataTables_wrapper {
            background-color: ${colors.background.secondary} !important;
            color: ${colors.text.primary} !important;
        }

        .dataTables_length, .dataTables_filter, .dataTables_info, .dataTables_paginate {
            color: ${colors.text.primary} !important;
        }

        .dataTables_wrapper .dataTables_length select,
        .dataTables_wrapper .dataTables_filter input {
            background-color: ${colors.background.tertiary} !important;
            color: ${colors.text.primary} !important;
            border-color: ${colors.border.medium} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button {
            background-color: ${colors.background.tertiary} !important;
            color: ${colors.text.primary} !important;
            border-color: ${colors.border.light} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current,
        .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
            background-color: ${colors.accent.blue} !important;
            color: white !important;
            border-color: ${colors.accent.blue} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
            background-color: ${colors.background.tertiary} !important;
            color: ${colors.accent.blue} !important;
        }

        .table.dataTable thead th, .table.dataTable thead td {
            border-bottom-color: ${colors.border.medium} !important;
        }

        .table.dataTable.no-footer {
            border-bottom-color: ${colors.border.medium} !important;
        }

        /* Settings Panel */
        #ts-darkmode-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: ${colors.background.secondary};
            border: 1px solid ${colors.border.medium};
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            padding: 10px;
            width: 260px;
            transition: transform 0.3s ease;
            transform: translateX(200px);
        }

        #ts-darkmode-panel:hover {
            transform: translateX(0);
        }

        #ts-darkmode-panel.pinned {
            transform: translateX(0);
        }

        #ts-darkmode-panel .settings-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: ${colors.text.primary};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #ts-darkmode-panel .pin-button {
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            margin-left: 5px;
        }

        #ts-darkmode-panel .pin-button:hover {
            opacity: 1;
        }

        #ts-darkmode-panel .settings-content {
            margin-bottom: 10px;
        }

        #ts-darkmode-panel .settings-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        #ts-darkmode-panel label {
            margin-bottom: 0;
            color: ${colors.text.primary};
        }

        #ts-darkmode-panel select {
            background-color: ${colors.background.tertiary};
            color: ${colors.text.primary};
            border-color: ${colors.border.medium};
            padding: 2px 5px;
            width: 120px;
        }

        #ts-darkmode-panel .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        #ts-darkmode-panel .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        #ts-darkmode-panel .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${colors.background.tertiary};
            transition: .4s;
            border-radius: 20px;
        }

        #ts-darkmode-panel .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        #ts-darkmode-panel input:checked + .toggle-slider {
            background-color: ${settings.colorTheme === 'princess' ? '#FF00FF' : colors.accent.blue};
        }

        #ts-darkmode-panel input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        #ts-darkmode-panel .settings-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 10px;
        }

        #ts-darkmode-panel .settings-credit {
            font-size: 0.75em;
            text-align: center;
            margin-top: 8px;
            opacity: 0.8;
            border-top: 1px solid ${colors.border.light};
            padding-top: 8px;
        }

        #ts-darkmode-panel .settings-credit a {
            color: ${colors.accent.blue} !important;
            text-decoration: none !important;
        }

        #ts-darkmode-panel .settings-credit a:hover {
            text-decoration: underline !important;
        }

        /* Theme preview */
        #ts-darkmode-panel .theme-preview {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
            border: 1px solid ${colors.border.light};
        }

        #ts-darkmode-panel .theme-preview.pure-black {
            background-color: #000000;
        }

        #ts-darkmode-panel .theme-preview.dark-gray {
            background-color: #121212;
        }

        #ts-darkmode-panel .theme-preview.midnight-blue {
            background-color: #0A1929;
        }

        #ts-darkmode-panel .theme-preview.princess {
            background-color: #1A0013;
            border: 1px solid #FF00FF;
        }
    `;

    // Apply the styles
    GM_addStyle(fullDarkModeCSS);

    /**
     * Load settings from storage
     */
    function loadSettings() {
        const savedSettings = GM_getValue(SETTINGS_KEY);
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (e) {
                console.error('Failed to parse saved settings:', e);
            }
        }
        return { ...defaultSettings };
    }

    /**
     * Save settings to storage
     */
    function saveSettings(settings) {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    /**
     * Show the save indicator briefly
     */
    function showSaveIndicator() {
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.classList.add('active');
            setTimeout(() => {
                indicator.classList.remove('active');
            }, 1500);
        }
    }

    /**
     * Modifies the DOM to hide specific elements
     */
    function modifyDOM() {
        try {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDarkMode && !settings.forceDarkMode) {
                return;
            }

            if (settings.hideVisuals) {
                // Hide graph container
                const graphContainer = document.getElementById('graph_container');
                if (graphContainer) {
                    graphContainer.style.display = 'none';
                }

                // Hide Graph/Growth Details links
                const linkDiv = document.querySelector('.col-md-12.text-center');
                if (linkDiv) {
                    linkDiv.style.display = 'none';
                }

                // Hide chart elements
                toggleChartVisibility(true);
            } else {
                // Show all visual elements
                const graphContainer = document.getElementById('graph_container');
                if (graphContainer) {
                    graphContainer.style.display = '';
                }

                const linkDiv = document.querySelector('.col-md-12.text-center');
                if (linkDiv) {
                    linkDiv.style.display = '';
                }

                toggleChartVisibility(false);
            }
        } catch (error) {
            console.error('Torn Stats Dark Mode Error:', error);
        }
    }

    /**
     * Toggles the visibility of chart elements
     */
    function toggleChartVisibility(hide) {
        try {
            let chartStyle = document.getElementById('chart-visibility-style');

            if (!chartStyle) {
                chartStyle = document.createElement('style');
                chartStyle.id = 'chart-visibility-style';
                document.head.appendChild(chartStyle);
            }

            if (hide) {
                chartStyle.textContent = `
                    .highcharts-container,
                    .highcharts-root,
                    g.highcharts-grid,
                    g.highcharts-axis,
                    g.highcharts-series,
                    g.highcharts-markers,
                    g.highcharts-legend,
                    g.highcharts-title,
                    g.highcharts-subtitle,
                    g.highcharts-label,
                    g.highcharts-tooltip,
                    g.highcharts-credits {
                        display: none !important;
                    }

                    #chart {
                        min-height: 100px !important;
                        position: relative !important;
                    }

                    #chart::before {
                        content: "Charts are hidden";
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: #aaa;
                        font-style: italic;
                        display: none;
                    }

                    .col-md-12:has(#chart:empty) {
                        display: none;
                    }

                    #chart:empty + div table {
                        margin-top: 20px;
                    }
                `;
            } else {
                chartStyle.textContent = '';
            }

            if (hide && document.getElementById('chart')) {
                const statTables = document.querySelectorAll('table.table-striped');
                statTables.forEach(table => {
                    table.style.marginTop = '20px';
                });
            }
        } catch (error) {
            console.error('Chart visibility toggle error:', error);
        }
    }

    /**
     * Create and add the settings panel
     */
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'ts-darkmode-panel';

        panel.innerHTML = `
            <div class="settings-title">
                <span>🌙 Dark Mode</span>
                <span style="display: flex; align-items: center;">
                    <span title="Pin panel" class="pin-button" id="pin-button">📌</span>
                    <span style="opacity: 0.7; font-size: 0.8em; margin-left: 5px;">v${CURRENT_VERSION}</span>
                </span>
            </div>
            <div class="settings-content">
                <div class="settings-option">
                    <label for="theme-selector" title="Select color theme">Theme:</label>
                    <select id="theme-selector">
                        <option value="pure-black" ${settings.colorTheme === 'pure-black' ? 'selected' : ''}>Pure Black</option>
                        <option value="dark-gray" ${settings.colorTheme === 'dark-gray' ? 'selected' : ''}>Dark Gray</option>
                        <option value="midnight-blue" ${settings.colorTheme === 'midnight-blue' ? 'selected' : ''}>Midnight Blue</option>
                        <option value="princess" ${settings.colorTheme === 'princess' ? 'selected' : ''}>Princess</option>
                    </select>
                </div>
                <div class="settings-option">
                    <label title="Force dark mode regardless of system preference">Force Dark Mode:</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="force-darkmode" ${settings.forceDarkMode ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="settings-option">
                    <label title="Hide all visual elements (graphs, charts, and links)">Hide Visuals:</label>
                    <label class="toggle-switch" ${settings.colorTheme === 'princess' ? 'title="Always enabled in Princess theme"' : ''}>
                        <input type="checkbox" id="hide-visuals" ${settings.hideVisuals ? 'checked' : ''} ${settings.colorTheme === 'princess' ? 'disabled' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    ${settings.colorTheme === 'princess' ? '<span style="font-size: 0.7em; margin-left: 5px; opacity: 0.8;">Locked in Princess theme</span>' : ''}
                </div>
                <div class="settings-footer">
                    <div id="save-indicator" class="save-indicator">Saved!</div>
                </div>
                <div class="settings-credit">
                    <a href="https://greasyfork.org/en/users/1431907-theeeunknown" target="_blank">Created by TR0LL [2561502]</a>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('theme-selector').addEventListener('change', function() {
            settings.colorTheme = this.value;
            // Force hideVisuals to be true when Princess theme is selected
            if (settings.colorTheme === 'princess') {
                settings.hideVisuals = true;
            }
            saveSettings(settings);
            showSaveIndicator();
            reloadPage();
        });

        document.getElementById('force-darkmode').addEventListener('change', function() {
            settings.forceDarkMode = this.checked;
            saveSettings(settings);
            showSaveIndicator();
            reloadPage();
        });

        document.getElementById('hide-visuals').addEventListener('change', function() {
            // Only allow changes if not in Princess theme
            if (settings.colorTheme !== 'princess') {
                settings.hideVisuals = this.checked;
                saveSettings(settings);
                showSaveIndicator();
                modifyDOM();
            } else {
                // Keep checked if in Princess theme
                this.checked = true;
            }
        });

        // Pin panel button
        document.getElementById('pin-button').addEventListener('click', function() {
            const panel = document.getElementById('ts-darkmode-panel');
            if (panel.classList.contains('pinned')) {
                panel.classList.remove('pinned');
                this.textContent = '📌';
                this.title = 'Pin panel';
            } else {
                panel.classList.add('pinned');
                this.textContent = '📍';
                this.title = 'Unpin panel';
            }
        });

        // Add theme previews
        const themeSelector = document.getElementById('theme-selector');
        Array.from(themeSelector.options).forEach(option => {
            const themePreview = document.createElement('span');
            themePreview.classList.add('theme-preview', option.value);
            option.prepend(themePreview);
        });
    }

    /**
     * Reload the page to apply new settings
     */
    function reloadPage() {
        window.location.reload();
    }

    /**
     * Observer for dynamic content
     */
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                modifyDOM();
            }
        });
    });

    /**
     * Start the observer
     */
    function startObserver() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Check for updates once per day
     */
    function checkForUpdates() {
        const now = Date.now();
        const lastChecked = GM_getValue(LAST_CHECKED_KEY, 0);

        if (now - lastChecked > 86400000) {
            GM_setValue(LAST_CHECKED_KEY, now);
            console.log('Torn Stats Dark Mode: Checking for updates...');
        }
    }

    /**
     * Initialize everything
     */
    function initialize() {
        checkForUpdates();
        modifyDOM();
        startObserver();

        if (document.body) {
            createSettingsPanel();
        } else {
            document.addEventListener('DOMContentLoaded', createSettingsPanel);
        }
    }

    // Initialize based on document readiness
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();