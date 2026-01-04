// ==UserScript==
// @name         ADSBExchange Minimalist UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ultra-minimalist modern interface for ADSBExchange with clean design
// @author       User
// @match        https://globe.adsbexchange.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/user/adsbexchange-minimal
// @supportURL   https://github.com/user/adsbexchange-minimal/issues
// @downloadURL https://update.greasyfork.org/scripts/539981/ADSBExchange%20Minimalist%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/539981/ADSBExchange%20Minimalist%20UI.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 ADSBExchange Minimalist UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Minimal Icon Set (SVG)
    const icons = {
        search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
        filter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>',
        settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>',
        close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        plane: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L11 10 2.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 7.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
        map: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"/></svg>',
        info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        layers: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 22,8.5 12,15 2,8.5 12,2"/><polyline points="2,17 12,23.5 22,17"/><polyline points="2,12 12,18.5 22,12"/></svg>'
    };

    // Ultra-minimal CSS
    const minimalStyles = `
        <style id="adsbexchange-minimal-ui">
            /* Reset & Base */
            * {
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
                font-size: 14px !important;
                line-height: 1.5 !important;
                background: #fafbfc !important;
                color: #1f2937 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Sidebar - Ultra Clean */
            #sidebar_container, .sidebar {
                background: rgba(255, 255, 255, 0.98) !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 8px !important;
                margin: 8px !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                backdrop-filter: blur(20px) !important;
                padding: 0 !important;
            }

            /* Header - Minimal */
            #header, .header {
                background: #ffffff !important;
                border-bottom: 1px solid #e5e7eb !important;
                padding: 12px 16px !important;
                color: #374151 !important;
                font-weight: 600 !important;
                font-size: 15px !important;
                border-radius: 8px 8px 0 0 !important;
            }

            /* Buttons - Clean & Minimal */
            button, input[type="button"], input[type="submit"], .button, .btn {
                background: #f9fafb !important;
                border: 1px solid #d1d5db !important;
                border-radius: 6px !important;
                padding: 8px 12px !important;
                color: #374151 !important;
                font-weight: 500 !important;
                font-size: 13px !important;
                cursor: pointer !important;
                transition: all 0.15s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                white-space: nowrap !important;
            }

            button:hover, input[type="button"]:hover, input[type="submit"]:hover, .button:hover, .btn:hover {
                background: #f3f4f6 !important;
                border-color: #9ca3af !important;
                transform: none !important;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
            }

            button:active, input[type="button"]:active, input[type="submit"]:active, .button:active, .btn:active {
                background: #e5e7eb !important;
                transform: scale(0.98) !important;
            }

            /* Primary Button */
            .btn-primary, button.primary {
                background: #3b82f6 !important;
                border-color: #3b82f6 !important;
                color: white !important;
            }

            .btn-primary:hover, button.primary:hover {
                background: #2563eb !important;
                border-color: #2563eb !important;
            }

            /* Input Fields - Clean */
            input[type="text"], input[type="search"], input[type="number"], select, textarea {
                border: 1px solid #d1d5db !important;
                border-radius: 6px !important;
                padding: 8px 12px !important;
                background: #ffffff !important;
                font-size: 13px !important;
                color: #374151 !important;
                transition: border-color 0.15s ease !important;
            }

            input[type="text"]:focus, input[type="search"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
                border-color: #3b82f6 !important;
                outline: none !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }

            /* Tables - Ultra Clean */
            table {
                width: 100% !important;
                border-collapse: collapse !important;
                background: #ffffff !important;
                border-radius: 6px !important;
                overflow: hidden !important;
                border: 1px solid #e5e7eb !important;
                font-size: 13px !important;
            }

            th {
                background: #f9fafb !important;
                padding: 12px 8px !important;
                text-align: left !important;
                font-weight: 600 !important;
                color: #374151 !important;
                border-bottom: 1px solid #e5e7eb !important;
                font-size: 12px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
            }

            td {
                padding: 10px 8px !important;
                border-bottom: 1px solid #f3f4f6 !important;
                color: #6b7280 !important;
                vertical-align: middle !important;
            }

            tr:hover {
                background: #f9fafb !important;
            }

            tr:last-child td {
                border-bottom: none !important;
            }

            /* Aircraft Details - Minimal Card */
            #selected_aircraft, .aircraft-details {
                background: #ffffff !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 8px !important;
                padding: 16px !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
            }

            /* Scrollbars - Minimal */
            ::-webkit-scrollbar {
                width: 6px !important;
                height: 6px !important;
            }

            ::-webkit-scrollbar-track {
                background: transparent !important;
            }

            ::-webkit-scrollbar-thumb {
                background: #d1d5db !important;
                border-radius: 3px !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #9ca3af !important;
            }

            /* Map Controls - Clean */
            .leaflet-control, .map-control {
                border-radius: 6px !important;
                border: 1px solid #e5e7eb !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                background: rgba(255, 255, 255, 0.98) !important;
                backdrop-filter: blur(20px) !important;
            }

            .leaflet-control a, .map-control a {
                color: #374151 !important;
                text-decoration: none !important;
                transition: background-color 0.15s ease !important;
                border: none !important;
            }

            .leaflet-control a:hover, .map-control a:hover {
                background: #f3f4f6 !important;
            }

            /* Form Elements - Minimal */
            input[type="checkbox"], input[type="radio"] {
                width: 16px !important;
                height: 16px !important;
                border: 1px solid #d1d5db !important;
                border-radius: 3px !important;
                background: #ffffff !important;
                cursor: pointer !important;
                appearance: none !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            input[type="radio"] {
                border-radius: 50% !important;
            }

            input[type="checkbox"]:checked {
                background: #3b82f6 !important;
                border-color: #3b82f6 !important;
            }

            input[type="checkbox"]:checked::after {
                content: "✓" !important;
                color: white !important;
                font-size: 10px !important;
                font-weight: bold !important;
            }

            input[type="radio"]:checked {
                background: #3b82f6 !important;
                border-color: #3b82f6 !important;
                box-shadow: inset 0 0 0 2px white !important;
            }

            /* Labels */
            label {
                font-size: 13px !important;
                color: #374151 !important;
                font-weight: 500 !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                cursor: pointer !important;
            }

            /* Select Dropdowns */
            select {
                appearance: none !important;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
                background-position: right 8px center !important;
                background-repeat: no-repeat !important;
                background-size: 16px !important;
                padding-right: 32px !important;
            }

            /* Tooltips - Minimal */
            .tooltip {
                background: rgba(0, 0, 0, 0.8) !important;
                color: white !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                border: none !important;
                backdrop-filter: blur(10px) !important;
            }

            /* Loading States */
            .loading, .spinner {
                border: 2px solid #f3f4f6 !important;
                border-top: 2px solid #3b82f6 !important;
                border-radius: 50% !important;
                width: 20px !important;
                height: 20px !important;
                animation: spin 1s linear infinite !important;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Spacing & Layout */
            .sidebar > div, .sidebar section {
                padding: 12px 16px !important;
                border-bottom: 1px solid #f3f4f6 !important;
            }

            .sidebar > div:last-child, .sidebar section:last-child {
                border-bottom: none !important;
            }

            /* Typography Hierarchy */
            h1, h2, h3, h4, h5, h6 {
                font-weight: 600 !important;
                color: #111827 !important;
                margin: 0 0 8px 0 !important;
            }

            h1 { font-size: 18px !important; }
            h2 { font-size: 16px !important; }
            h3 { font-size: 15px !important; }
            h4 { font-size: 14px !important; }
            h5 { font-size: 13px !important; }
            h6 { font-size: 12px !important; }

            /* Links */
            a {
                color: #3b82f6 !important;
                text-decoration: none !important;
                transition: color 0.15s ease !important;
            }

            a:hover {
                color: #2563eb !important;
                text-decoration: underline !important;
            }

            /* Status Indicators */
            .status {
                display: inline-block !important;
                width: 8px !important;
                height: 8px !important;
                border-radius: 50% !important;
                margin-right: 6px !important;
            }

            .status.online { background: #10b981 !important; }
            .status.offline { background: #ef4444 !important; }
            .status.warning { background: #f59e0b !important; }

            /* Dark Mode */
            @media (prefers-color-scheme: dark) {
                body {
                    background: #111827 !important;
                    color: #f9fafb !important;
                }

                #sidebar_container, .sidebar, #selected_aircraft, .aircraft-details {
                    background: rgba(31, 41, 55, 0.98) !important;
                    border-color: #374151 !important;
                    color: #f9fafb !important;
                }

                #header, .header {
                    background: #1f2937 !important;
                    border-color: #374151 !important;
                    color: #f9fafb !important;
                }

                th {
                    background: #1f2937 !important;
                    color: #f9fafb !important;
                    border-color: #374151 !important;
                }

                td {
                    border-color: #374151 !important;
                    color: #d1d5db !important;
                }

                tr:hover {
                    background: rgba(55, 65, 81, 0.5) !important;
                }

                button, input[type="button"], input[type="submit"], .button, .btn {
                    background: #374151 !important;
                    border-color: #4b5563 !important;
                    color: #f9fafb !important;
                }

                button:hover, input[type="button"]:hover, input[type="submit"]:hover, .button:hover, .btn:hover {
                    background: #4b5563 !important;
                    border-color: #6b7280 !important;
                }

                input[type="text"], input[type="search"], input[type="number"], select, textarea {
                    background: #1f2937 !important;
                    border-color: #374151 !important;
                    color: #f9fafb !important;
                }

                table {
                    background: #1f2937 !important;
                    border-color: #374151 !important;
                }

                .leaflet-control, .map-control {
                    background: rgba(31, 41, 55, 0.98) !important;
                    border-color: #374151 !important;
                }

                .leaflet-control a, .map-control a {
                    color: #f9fafb !important;
                }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                #sidebar_container, .sidebar {
                    margin: 4px !important;
                    border-radius: 6px !important;
                }

                button, .btn {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                }

                th, td {
                    padding: 8px 6px !important;
                    font-size: 12px !important;
                }

                .sidebar > div, .sidebar section {
                    padding: 8px 12px !important;
                }
            }

            /* Remove Unnecessary Elements */
            .advertisement, .ads, [class*="ad-"], [id*="ad-"] {
                display: none !important;
            }

            /* Clean Focus States */
            *:focus {
                outline: 2px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }

            button:focus, input:focus, select:focus, textarea:focus {
                outline: none !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }
        </style>
    `;

    // Icon injection function
    function addIconsToButtons() {
        // Add icons to specific buttons based on text content
        const buttonIconMap = {
            'search': icons.search,
            'filter': icons.filter,
            'settings': icons.settings,
            'close': icons.close,
            'aircraft': icons.plane,
            'map': icons.map,
            'info': icons.info,
            'view': icons.eye,
            'layer': icons.layers
        };

        document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]').forEach(button => {
            const text = button.textContent.toLowerCase();
            for (const [key, icon] of Object.entries(buttonIconMap)) {
                if (text.includes(key) && !button.querySelector('svg')) {
                    button.insertAdjacentHTML('afterbegin', icon);
                    break;
                }
            }
        });
    }

    // Clean and minimize interface
    function cleanInterface() {
        // Remove clutter
        const clutterSelectors = [
            '.advertisement',
            '.ads',
            '[class*="ad-"]',
            '[id*="ad-"]',
            '.social-media',
            '.banner'
        ];
        
        clutterSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Simplify complex layouts
        document.querySelectorAll('.complex-layout, .bloated-section').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Initialize minimal UI
    function initializeMinimalUI() {
        // Inject styles
        if (!document.getElementById('adsbexchange-minimal-ui')) {
            document.head.insertAdjacentHTML('beforeend', minimalStyles);
        }

        // Clean interface
        cleanInterface();
        
        // Add icons
        addIconsToButtons();

        // Add smooth interactions
        document.body.style.transition = 'all 0.15s ease';
        
        console.log('ADSBExchange Minimal UI: Loaded');
    }

    // Observer for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });
        
        if (shouldUpdate) {
            setTimeout(() => {
                addIconsToButtons();
                cleanInterface();
            }, 100);
        }
    });

    // Start observing
    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize everything
    function init() {
        initializeMinimalUI();
        startObserver();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Fallback initialization
    setTimeout(init, 500);
    setTimeout(init, 2000);

})();