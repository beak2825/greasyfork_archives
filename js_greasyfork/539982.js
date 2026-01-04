// ==UserScript==
// @name         ADSBExchange FlightRadar24 Clone
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Transform ADSBExchange into FlightRadar24 exact clone with minimal design
// @author       User
// @match        https://globe.adsbexchange.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/user/adsbexchange-fr24-clone
// @supportURL   https://github.com/user/adsbexchange-fr24-clone/issues
// @downloadURL https://update.greasyfork.org/scripts/539982/ADSBExchange%20FlightRadar24%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/539982/ADSBExchange%20FlightRadar24%20Clone.meta.js
// ==/UserScript==

/*
MIT License - ADSBExchange FlightRadar24 Clone
Copyright (c) 2025

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

    // FlightRadar24 Logo SVG
    const fr24Logo = `
        <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
            <path d="M8 24V8h12v3H12v2h7v3h-7v8H8z" fill="#1976d2"/>
            <path d="M24 24V8h8c2.2 0 4 1.8 4 6s-1.8 6-4 6h-4v4h-4zm4-7h4c.6 0 1-.4 1-1V12c0-.6-.4-1-1-1h-4v6z" fill="#1976d2"/>
            <path d="M40 24l6-16h4l6 16h-4l-1-3h-6l-1 3h-4zm7-6h4l-2-6-2 6z" fill="#1976d2"/>
            <circle cx="60" cy="16" r="3" fill="#ff5722"/>
            <text x="70" y="20" font-family="Arial" font-size="10" font-weight="bold" fill="#1976d2">flightradar24</text>
        </svg>
    `;

    // FlightRadar24 exact styles
    const fr24Styles = `
        <style id="fr24-clone-styles">
            /* Complete Reset */
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            /* Body - FR24 Style */
            body {
                font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                background: #f8f9fa !important;
                color: #212529 !important;
                font-size: 14px !important;
                line-height: 1.4 !important;
                overflow: hidden !important;
            }

            /* Main Container */
            html, body {
                height: 100% !important;
                width: 100% !important;
            }

            /* Hide Original Header/Nav */
            #header, .header, nav, .navigation, .navbar, .top-bar {
                display: none !important;
            }

            /* Create FR24 Header */
            body::before {
                content: '' !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 56px !important;
                background: #ffffff !important;
                border-bottom: 1px solid #e9ecef !important;
                z-index: 10000 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
            }

            /* FR24 Logo Container */
            body::after {
                content: '${fr24Logo}' !important;
                position: fixed !important;
                top: 12px !important;
                left: 16px !important;
                z-index: 10001 !important;
                display: block !important;
            }

            /* Main Map Container */
            #map_container, #map, .map-container {
                position: fixed !important;
                top: 56px !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: 1 !important;
            }

            /* Sidebar - FR24 Style */
            #sidebar_container, .sidebar {
                position: fixed !important;
                top: 56px !important;
                right: 16px !important;
                width: 320px !important;
                max-height: calc(100vh - 72px) !important;
                background: #ffffff !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                border: none !important;
                overflow: hidden !important;
                z-index: 1000 !important;
                transform: translateX(100%) !important;
                transition: transform 0.3s ease !important;
            }

            #sidebar_container.active, .sidebar.active {
                transform: translateX(0) !important;
            }

            /* Hamburger Menu */
            .hamburger-menu {
                position: fixed !important;
                top: 12px !important;
                right: 16px !important;
                width: 32px !important;
                height: 32px !important;
                background: #ffffff !important;
                border: 1px solid #dee2e6 !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                z-index: 10001 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                transition: all 0.2s ease !important;
            }

            .hamburger-menu:hover {
                background: #f8f9fa !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }

            .hamburger-menu svg {
                width: 16px !important;
                height: 16px !important;
                stroke: #495057 !important;
            }

            /* Search Box - FR24 Style */
            .search-container {
                position: fixed !important;
                top: 12px !important;
                left: 160px !important;
                right: 64px !important;
                z-index: 10001 !important;
            }

            .search-input {
                width: 100% !important;
                height: 32px !important;
                padding: 0 12px 0 36px !important;
                border: 1px solid #dee2e6 !important;
                border-radius: 16px !important;
                background: #ffffff !important;
                font-size: 14px !important;
                color: #495057 !important;
                outline: none !important;
                transition: all 0.2s ease !important;
            }

            .search-input:focus {
                border-color: #1976d2 !important;
                box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
            }

            .search-icon {
                position: absolute !important;
                left: 12px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                width: 16px !important;
                height: 16px !important;
                stroke: #6c757d !important;
            }

            /* Sidebar Content */
            .sidebar-header {
                padding: 16px !important;
                background: #f8f9fa !important;
                border-bottom: 1px solid #e9ecef !important;
                font-weight: 600 !important;
                color: #212529 !important;
                font-size: 16px !important;
            }

            .sidebar-content {
                padding: 0 !important;
                max-height: calc(100vh - 140px) !important;
                overflow-y: auto !important;
            }

            /* Aircraft Details - FR24 Style */
            #selected_aircraft, .aircraft-details {
                background: #ffffff !important;
                border: none !important;
                border-radius: 0 !important;
                padding: 16px !important;
                margin: 0 !important;
                box-shadow: none !important;
            }

            .aircraft-info-row {
                display: flex !important;
                justify-content: space-between !important;
                padding: 8px 0 !important;
                border-bottom: 1px solid #f1f3f4 !important;
                font-size: 13px !important;
            }

            .aircraft-info-label {
                color: #6c757d !important;
                font-weight: 500 !important;
            }

            .aircraft-info-value {
                color: #212529 !important;
                font-weight: 600 !important;
            }

            /* Tables - FR24 Style */
            table {
                width: 100% !important;
                border-collapse: collapse !important;
                background: #ffffff !important;
                font-size: 13px !important;
                border: none !important;
            }

            th {
                background: #f8f9fa !important;
                padding: 12px 8px !important;
                text-align: left !important;
                font-weight: 600 !important;
                color: #495057 !important;
                border-bottom: 2px solid #e9ecef !important;
                font-size: 12px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
            }

            td {
                padding: 10px 8px !important;
                border-bottom: 1px solid #f1f3f4 !important;
                color: #495057 !important;
                vertical-align: middle !important;
            }

            tr:hover {
                background: #f8f9fa !important;
            }

            tr:last-child td {
                border-bottom: none !important;
            }

            /* Buttons - FR24 Style */
            button, .btn, input[type="button"], input[type="submit"] {
                background: #1976d2 !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 8px 16px !important;
                color: #ffffff !important;
                font-weight: 500 !important;
                font-size: 13px !important;
                cursor: pointer !important;
                transition: background-color 0.2s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
            }

            button:hover, .btn:hover, input[type="button"]:hover, input[type="submit"]:hover {
                background: #1565c0 !important;
            }

            button.secondary, .btn-secondary {
                background: #ffffff !important;
                color: #1976d2 !important;
                border: 1px solid #e9ecef !important;
            }

            button.secondary:hover, .btn-secondary:hover {
                background: #f8f9fa !important;
            }

            /* Map Controls - FR24 Style */
            .leaflet-control, .map-control {
                background: #ffffff !important;
                border: none !important;
                border-radius: 6px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.15) !important;
                overflow: hidden !important;
            }

            .leaflet-control a, .map-control a {
                color: #495057 !important;
                text-decoration: none !important;
                border: none !important;
                transition: background-color 0.2s ease !important;
            }

            .leaflet-control a:hover, .map-control a:hover {
                background: #f8f9fa !important;
            }

            /* Zoom Controls */
            .leaflet-control-zoom {
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                z-index: 1000 !important;
            }

            /* Layers Control */
            .leaflet-control-layers {
                position: fixed !important;
                bottom: 80px !important;
                right: 24px !important;
                z-index: 1000 !important;
            }

            /* Remove Unwanted Elements */
            .advertisement, .ads, [class*="ad-"], [id*="ad-"],
            .social-share, .donate, .premium-banner,
            .footer, #footer, .bottom-bar,
            .breadcrumb, .navigation-secondary {
                display: none !important;
            }

            /* Scrollbar - FR24 Style */
            ::-webkit-scrollbar {
                width: 6px !important;
            }

            ::-webkit-scrollbar-track {
                background: #f1f3f4 !important;
            }

            ::-webkit-scrollbar-thumb {
                background: #c1c8cd !important;
                border-radius: 3px !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #9aa0a6 !important;
            }

            /* Input Fields */
            input[type="text"], input[type="number"], select, textarea {
                border: 1px solid #dee2e6 !important;
                border-radius: 4px !important;
                padding: 8px 12px !important;
                background: #ffffff !important;
                font-size: 13px !important;
                color: #495057 !important;
                transition: border-color 0.2s ease !important;
            }

            input[type="text"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
                border-color: #1976d2 !important;
                outline: none !important;
                box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
            }

            /* Status Indicators */
            .status-indicator {
                display: inline-block !important;
                width: 8px !important;
                height: 8px !important;
                border-radius: 50% !important;
                margin-right: 6px !important;
            }

            .status-online { background: #4caf50 !important; }
            .status-offline { background: #f44336 !important; }
            .status-warning { background: #ff9800 !important; }

            /* Loading Animation */
            .loading-spinner {
                border: 2px solid #f3f3f3 !important;
                border-top: 2px solid #1976d2 !important;
                border-radius: 50% !important;
                width: 20px !important;
                height: 20px !important;
                animation: spin 1s linear infinite !important;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                #sidebar_container, .sidebar {
                    width: calc(100vw - 32px) !important;
                    right: 16px !important;
                }

                .search-container {
                    left: 120px !important;
                    right: 64px !important;
                }
            }

            /* Dark Mode Override */
            @media (prefers-color-scheme: dark) {
                body {
                    background: #121212 !important;
                    color: #ffffff !important;
                }

                body::before {
                    background: #1e1e1e !important;
                    border-color: #333333 !important;
                }

                #sidebar_container, .sidebar, #selected_aircraft, .aircraft-details {
                    background: #1e1e1e !important;
                    color: #ffffff !important;
                }

                .sidebar-header {
                    background: #2d2d2d !important;
                    border-color: #333333 !important;
                }

                th {
                    background: #2d2d2d !important;
                    color: #ffffff !important;
                    border-color: #333333 !important;
                }

                td {
                    border-color: #333333 !important;
                    color: #e0e0e0 !important;
                }

                tr:hover {
                    background: #2d2d2d !important;
                }

                .hamburger-menu, .search-input {
                    background: #2d2d2d !important;
                    border-color: #333333 !important;
                    color: #ffffff !important;
                }

                .leaflet-control, .map-control {
                    background: #1e1e1e !important;
                }
            }
        </style>
    `;

    // Create hamburger menu
    function createHamburgerMenu() {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger-menu';
        hamburger.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        
        hamburger.addEventListener('click', function() {
            const sidebar = document.querySelector('#sidebar_container, .sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
        
        document.body.appendChild(hamburger);
    }

    // Create search box
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div style="position: relative;">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="text" class="search-input" placeholder="Search flights, airports, airlines">
            </div>
        `;
        
        document.body.appendChild(searchContainer);
    }

    // Hide unwanted buttons and elements
    function hideUnwantedElements() {
        const unwantedSelectors = [
            '.advertisement', '.ads', '[class*="ad-"]', '[id*="ad-"]',
            '.social-share', '.donate', '.premium-banner', '.popup-banner',
            '.footer', '#footer', '.bottom-bar', '.breadcrumb',
            '.navigation-secondary', '.header-secondary', '.sub-nav',
            'button[class*="share"]', 'button[class*="social"]',
            '.twitter-share', '.facebook-share', '.whatsapp-share',
            '.download-app', '.mobile-app-banner', '.newsletter-signup',
            '.cookie-banner', '.gdpr-banner', '.privacy-notice'
        ];
        
        unwantedSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });

        // Move useful buttons to sidebar
        const usefulButtons = document.querySelectorAll('button, .btn');
        const sidebar = document.querySelector('#sidebar_container, .sidebar');
        
        if (sidebar) {
            usefulButtons.forEach(button => {
                const text = button.textContent.toLowerCase();
                if (text.includes('filter') || text.includes('settings') || 
                    text.includes('layers') || text.includes('options')) {
                    // Keep these buttons but move them to sidebar
                    const sidebarContent = sidebar.querySelector('.sidebar-content') || sidebar;
                    sidebarContent.appendChild(button);
                }
            });
        }
    }

    // Enhance aircraft details
    function enhanceAircraftDetails() {
        const aircraftDetails = document.querySelector('#selected_aircraft, .aircraft-details');
        if (aircraftDetails) {
            // Add FR24-style header
            if (!aircraftDetails.querySelector('.sidebar-header')) {
                const header = document.createElement('div');
                header.className = 'sidebar-header';
                header.textContent = 'Flight Details';
                aircraftDetails.insertBefore(header, aircraftDetails.firstChild);
            }

            // Convert data to FR24 format
            const rows = aircraftDetails.querySelectorAll('tr, .info-row');
            rows.forEach(row => {
                if (row.children.length === 2) {
                    row.className = 'aircraft-info-row';
                    row.children[0].className = 'aircraft-info-label';
                    row.children[1].className = 'aircraft-info-value';
                }
            });
        }
    }

    // Initialize FR24 clone
    function initializeFR24Clone() {
        // Inject styles
        if (!document.getElementById('fr24-clone-styles')) {
            document.head.insertAdjacentHTML('beforeend', fr24Styles);
        }

        // Create UI elements
        createHamburgerMenu();
        createSearchBox();
        
        // Clean up interface
        hideUnwantedElements();
        enhanceAircraftDetails();

        // Ensure map fills screen
        const mapContainer = document.querySelector('#map_container, #map, .map-container');
        if (mapContainer) {
            mapContainer.style.position = 'fixed';
            mapContainer.style.top = '56px';
            mapContainer.style.left = '0';
            mapContainer.style.right = '0';
            mapContainer.style.bottom = '0';
            mapContainer.style.zIndex = '1';
        }

        // Start with sidebar hidden
        const sidebar = document.querySelector('#sidebar_container, .sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }

        console.log('FR24 Clone: Interface transformed successfully');
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
                hideUnwantedElements();
                enhanceAircraftDetails();
            }, 100);
        }
    });

    // Start observer
    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main initialization
    function init() {
        initializeFR24Clone();
        startObserver();
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Fallback initialization
    setTimeout(init, 500);
    setTimeout(init, 2000);

})();