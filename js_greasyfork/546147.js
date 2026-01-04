// ==UserScript==
// @name         ERP近7天销售数据展示（简化版）
// @namespace    http://tampermonkey.net/
// @version      2.1.20
// @description  Fetch and display sales report data as ECharts line chart in a floating window with enhanced UI/UX, fixed button, loading animation, confined tooltip, totalCount-sorted tooltip with 0 display fix, caching disabled, fullscreen toggle, fixed duplicate button issue, syntax errors, and button not displaying in Chrome
// @author       keney
// @match        http://erpx.htran.ltd/*
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      erpx.htran.ltd
// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546147/ERP%E8%BF%917%E5%A4%A9%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%E5%B1%95%E7%A4%BA%EF%BC%88%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546147/ERP%E8%BF%917%E5%A4%A9%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%E5%B1%95%E7%A4%BA%EF%BC%88%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple script executions
    if (window.__salesChartScriptRan) {
        console.log('Script already ran, exiting to prevent duplicates');
        return;
    }
    window.__salesChartScriptRan = true;

    console.log('Sales Report ECharts script started at', new Date().toISOString());
    console.log('Current URL:', window.location.href);

    // Update the background gradient for toggle states
    let updateButtonBackground; // Will be initialized in createButton

    // Function to create and append button
    function createButton() {
        // Check for existing button
        if (document.getElementById('sales-chart-button')) {
            console.log('Floating button already exists, skipping creation');
            return;
        }

        // Create floating button
        const button = document.createElement('div');
        button.id = 'sales-chart-button';
        button.style.cssText = `
            position: fixed;
            top: 50vh;
            right: 20px;
            background: #3b82f6; /* Blue-500 from Tailwind */
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            -webkit-border-radius: 50%; /* Safari support */
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            -webkit-box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); /* Safari support */
            z-index: 999999; /* High z-index to ensure visibility */
            cursor: pointer;
            display: flex;
            display: -webkit-flex; /* Safari support */
            align-items: center;
            -webkit-align-items: center; /* Safari support */
            justify-content: center;
            -webkit-justify-content: center; /* Safari support */
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out; /* Safari support */
            border: none;
            outline: none;
        `;

        // Add responsive design for mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            button.style.width = '40px';
            button.style.height = '40px';
            button.style.right = '10px';
            button.style.top = '70vh';

            // Additional mobile-specific styling
            button.style.fontSize = '12px';
        }

        // Update mobile styles for the new design
        if (isMobile) {
            button.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
        }
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
            </svg>
        `;
        button.title = 'Toggle Sales Chart';
        console.log('Button element created');

        // Update the background gradient for toggle states
        updateButtonBackground = function(isVisible) {
            if (isVisible) {
                button.style.background = '#ef4444'; /* Red-500 from Tailwind when chart is visible */
            } else {
                button.style.background = '#3b82f6'; /* Blue-500 from Tailwind when chart is hidden */
            }
        };

        // Initialize button background
        updateButtonBackground(false);

        // Append button to body
        try {
            if (document.body) {
                document.body.appendChild(button);
                console.log('Floating button appended to body at', new Date().toISOString());
            } else {
                console.error('document.body not available');
                return false;
            }
        } catch (error) {
            console.error('Failed to append button:', error);
            return false;
        }
        return true;
    }

    // Poll for document.body readiness
    function waitForBody() {
        if (document.body) {
            if (createButton()) {
                initializeScript();
            }
        } else {
            console.log('document.body not ready, retrying in 100ms');
            setTimeout(waitForBody, 100);
        }
    }

    // Initialize button creation
    waitForBody();

    // Main script initialization
    function initializeScript() {
        // Button event listeners
        const button = document.getElementById('sales-chart-button');
        if (!button) {
            console.error('Button not found after creation');
            return;
        }

        // Add event listeners with cross-browser compatibility
        function addEvent(element, event, handler) {
            if (element.addEventListener) {
                element.addEventListener(event, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, handler);
            }
        }

        addEvent(button, 'mouseover', () => {
            button.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            button.style.webkitBoxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'; // Safari support
            button.style.background = '#2563eb'; /* Blue-600 from Tailwind on hover */
        });

        addEvent(button, 'mouseout', () => {
            button.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
            button.style.webkitBoxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'; // Safari support
            button.style.background = '#3b82f6'; /* Blue-500 from Tailwind */
        });

        addEvent(button, 'mousedown', () => {
            button.style.transform = 'scale(0.95)';
            button.style.webkitTransform = 'scale(0.95)'; // Safari support
            button.style.background = '#1d4ed8'; /* Blue-700 from Tailwind on active */
        });

        addEvent(button, 'mouseup', () => {
            button.style.transform = 'scale(1)';
            button.style.webkitTransform = 'scale(1)'; // Safari support
            button.style.background = '#2563eb'; /* Blue-600 from Tailwind */
        });

        // Create floating window (initially hidden)
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'sales-chart-window';
        floatingWindow.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            padding: 0; /* Remove padding to use inner container */
            border-radius: 12px;
            -webkit-border-radius: 12px; /* Safari support */
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
            -webkit-box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); /* Safari support */
            z-index: 999998;
            width: calc(80vw - 40px);
            width: -webkit-calc(80vw - 40px); /* Safari support */
            max-width: 800px;
            min-width: 300px;
            height: calc(60vh - 40px);
            height: -webkit-calc(60vh - 40px); /* Safari support */
            max-height: 600px;
            min-height: 200px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            cursor: move;
            resize: both;
            overflow: hidden; /* Change to hidden for better containment */
            display: none;
            transition: opacity 0.3s, transform 0.3s;
            -webkit-transition: opacity 0.3s, -webkit-transform 0.3s; /* Safari support */
            opacity: 0;
            transform: translateY(20px);
            -webkit-transform: translateY(20px); /* Safari support */
            border: 1px solid #e5e7eb; /* Light border for definition */
        `;

        // Add responsive design for mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            floatingWindow.style.width = 'calc(95vw - 20px)';
            floatingWindow.style.height = 'calc(70vh - 20px)';
            floatingWindow.style.top = '10px';
            floatingWindow.style.right = '10px';
            floatingWindow.style.padding = '15px';
            floatingWindow.style.minWidth = '250px';
            floatingWindow.style.minHeight = '150px';

            // Additional mobile-specific styling
            floatingWindow.style.fontSize = '14px';
        }

        // Add header with title, minimize, fullscreen, and close buttons
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            display: -webkit-flex; /* Safari support */
            justify-content: space-between;
            -webkit-justify-content: space-between; /* Safari support */
            align-items: center;
            -webkit-align-items: center; /* Safari support */
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 500;
            color: #333;
        `;

        // Add mobile-specific styling for header
        if (isMobile) {
            header.style.fontSize = '16px';
        }
        header.innerHTML = `
            <span>Sales Performance (Last 7 Days)</span>
            <div>
                <button class="minimize-btn" style="cursor: pointer; padding: 8px 12px; margin-right: 8px; border: none; background: #f8f9fa; border-radius: 4px; color: #495057; font-weight: bold; transition: all 0.2s ease;" title="Minimize (Close) Window">−</button>
                <button class="fullscreen-btn" style="cursor: pointer; padding: 5px 10px; margin-right: 5px; border: none; background: none;">◰</button>
                <button class="close-btn" style="cursor: pointer; padding: 5px 10px; border: none; background: none;">×</button>
            </div>
        `;

        // Add mobile-specific styling for buttons
        if (isMobile) {
            const buttons = header.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.padding = '6px 10px';
                button.style.fontSize = '14px';
                button.style.minWidth = '32px';
                button.style.minHeight = '32px';
                // Ensure minimize button keeps its enhanced styling on mobile
                if (button.classList.contains('minimize-btn')) {
                    button.style.background = '#f8f9fa';
                    button.style.borderRadius = '4px';
                    button.style.color = '#495057';
                    button.style.fontWeight = 'bold';
                }
            });
        }
        floatingWindow.appendChild(header);

        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = `
            width: 100%;
            height: calc(100% - 40px);
            height: -webkit-calc(100% - 40px); /* Safari support */
            position: relative;
        `;

        // Add responsive design for mobile
        if (isMobile) {
            chartContainer.style.height = 'calc(100% - 30px)';
        }
        floatingWindow.appendChild(chartContainer);

        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'sales-chart-loading';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: none;
            display: -webkit-flex; /* Safari support */
            align-items: center;
            -webkit-align-items: center; /* Safari support */
            justify-content: center;
            -webkit-justify-content: center; /* Safari support */
            z-index: 1;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center; color: #555;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <path d="M23 3.01C23 1.34 21.66 0 20 0S17 1.34 17 3.01c0 1.1.59 2.07 1.47 2.59.88.52 1.97.66 2.96.33.99-.33 1.77-1.11 2.1-2.1.33-.99.19-2.08-.33-2.96C22.07 1.59 21.1 1 20 0z"></path>
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12"></path>
                </svg>
                <p>Loading data...</p>
                <style>
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                </style>
            </div>
        `;
        chartContainer.appendChild(loadingOverlay);
        try {
            document.body.appendChild(floatingWindow);
            console.log('Floating window created (initially hidden)');
        } catch (error) {
            console.error('Failed to append floating window:', error);
            return;
        }

        // Make window draggable
        let isWindowDragging = false;
        let windowX = 0;
        let windowY = 0;
        let windowOffsetX = 0;
        let windowOffsetY = 0;

        addEvent(header, 'mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                isWindowDragging = true;
                windowX = e.clientX - windowOffsetX;
                windowY = e.clientY - windowOffsetY;
            }
        });

        addEvent(document, 'mousemove', (e) => {
            if (isWindowDragging) {
                e.preventDefault();
                windowOffsetX = e.clientX - windowX;
                windowOffsetY = e.clientY - windowY;
                floatingWindow.style.right = 'auto';
                floatingWindow.style.top = `${windowOffsetY}px`;
                floatingWindow.style.left = `${windowOffsetX}px`;
            }
        });

        addEvent(document, 'mouseup', () => {
            isWindowDragging = false;
        });

        // Initialize chart
        let chart = null;
        // Feature detection for ECharts
        if (typeof echarts !== 'undefined' && echarts && typeof echarts.init === 'function') {
            try {
                chart = echarts.init(chartContainer);
                console.log('ECharts initialized, container size:', chartContainer.offsetWidth, chartContainer.offsetHeight);
            } catch (error) {
                console.error('Failed to initialize ECharts:', error);
                chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">Failed to initialize chart.</p>';
                return;
            }
        } else {
            console.error('ECharts not loaded or not supported');
            chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">ECharts library failed to load or is not supported in your browser.</p>';
            return;
        }

        // Toggle window visibility and animation
        let isWindowVisible = false;
        let isMinimized = false;
        let chartDataLoaded = false;
        // Feature detection for Flexbox support
        function supportsFlexbox() {
            const testElement = document.createElement('div');
            testElement.style.display = 'flex';
            return testElement.style.display === 'flex';
        }

        // Set fallback styles for browsers that don't support Flexbox
        if (!supportsFlexbox()) {
            // Fallback for button
            button.style.display = 'block';
            button.style.textAlign = 'center';
            button.style.lineHeight = '50px';

            // Fallback for header
            header.style.display = 'block';
            header.style.textAlign = 'center';

            // Fallback for loading overlay
            loadingOverlay.style.display = 'block';
            loadingOverlay.style.textAlign = 'center';
            loadingOverlay.style.paddingTop = '50px';
        }

        addEvent(button, 'click', (e) => {
            e.stopPropagation();
            isWindowVisible = !isWindowVisible;
            floatingWindow.style.display = isWindowVisible ? 'block' : 'none';
            if (isWindowVisible) {
                floatingWindow.style.opacity = '1';
                floatingWindow.style.transform = 'translateY(0)';
                updateButtonBackground(true);
                button.title = 'Hide Sales Chart';
                if (!chartDataLoaded) {
                    loadingOverlay.style.display = supportsFlexbox() ? 'flex' : 'block';
                    loadChartData();
                } else if (chart) {
                    chart.resize();
                    console.log('Chart resized on show, container size:', chartContainer.offsetWidth, chartContainer.offsetHeight);
                }
            } else {
                floatingWindow.style.opacity = '0';
                floatingWindow.style.transform = 'translateY(20px)';
                updateButtonBackground(false);
                button.title = 'Show Sales Chart';
            }
            console.log(`Chart window ${isWindowVisible ? 'shown' : 'hidden'}`);
        });

        // Minimize button functionality
        const minimizeBtn = header.querySelector('.minimize-btn');

        // Add hover effects for minimize button
        addEvent(minimizeBtn, 'mouseover', () => {
            minimizeBtn.style.background = '#e9ecef';
            minimizeBtn.style.color = '#212529';
        });

        addEvent(minimizeBtn, 'mouseout', () => {
            minimizeBtn.style.background = '#f8f9fa';
            minimizeBtn.style.color = '#495057';
        });

        addEvent(minimizeBtn, 'click', () => {
            // Minimize should close the window completely
            isWindowVisible = false;
            floatingWindow.style.display = 'none';
            floatingWindow.style.opacity = '0';
            floatingWindow.style.transform = 'translateY(20px)';
            updateButtonBackground(false);
            button.title = 'Show Sales Chart';
            console.log('Chart window minimized (closed)');
        });

        // Fullscreen button functionality
        let isFullscreen = false;
        const fullscreenBtn = header.querySelector('.fullscreen-btn');

        // Feature detection for fullscreen API
        function supportsFullscreen() {
            return !!(document.fullscreenEnabled ||
                     document.webkitFullscreenEnabled ||
                     document.msFullscreenEnabled ||
                     document.mozFullScreenEnabled);
        }

        // Cross-browser fullscreen request
        function requestFullscreen(element) {
            if (element.requestFullscreen) {
                return element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                return element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                return element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                return element.mozRequestFullScreen();
            } else {
                console.warn('Fullscreen API not supported');
                return Promise.reject(new Error('Fullscreen API not supported'));
            }
        }

        // Cross-browser fullscreen exit
        function exitFullscreen() {
            if (document.exitFullscreen) {
                return document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                return document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                return document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                return document.mozCancelFullScreen();
            } else {
                console.warn('Fullscreen API not supported');
                return Promise.reject(new Error('Fullscreen API not supported'));
            }
        }

        // Cross-browser fullscreen element detection
        function getFullscreenElement() {
            return document.fullscreenElement ||
                   document.webkitFullscreenElement ||
                   document.msFullscreenElement ||
                   document.mozFullScreenElement ||
                   null;
        }

        // Check if fullscreen is supported and enable/disable button accordingly
        if (!supportsFullscreen()) {
            fullscreenBtn.disabled = true;
            fullscreenBtn.style.opacity = '0.5';
            fullscreenBtn.title = 'Fullscreen not supported in your browser';
        }

        addEvent(fullscreenBtn, 'click', () => {
            // Check if fullscreen is supported
            if (!supportsFullscreen()) {
                console.warn('Fullscreen not supported in your browser');
                return;
            }

            if (!isFullscreen) {
                if (floatingWindow.requestFullscreen) {
                    floatingWindow.requestFullscreen();
                } else if (floatingWindow.webkitRequestFullscreen) { // Safari
                    floatingWindow.webkitRequestFullscreen();
                } else if (floatingWindow.msRequestFullscreen) { // IE11
                    floatingWindow.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { // Safari
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE11
                    document.msExitFullscreen();
                }
            }
        });

        // Handle fullscreen change
        addEvent(document, 'fullscreenchange', () => {
            isFullscreen = !!document.fullscreenElement;
            fullscreenBtn.innerText = isFullscreen ? '◱' : '◰';
            if (chart && isWindowVisible && !isMinimized) {
                if (isFullscreen) {
                    floatingWindow.style.top = '0';
                    floatingWindow.style.left = '0';
                    floatingWindow.style.width = '100vw';
                    floatingWindow.style.height = '100vh';
                    floatingWindow.style.maxWidth = 'none';
                    floatingWindow.style.maxHeight = 'none';
                    floatingWindow.style.borderRadius = '0';
                    floatingWindow.style.resize = 'none';
                } else {
                    floatingWindow.style.top = '20px';
                    floatingWindow.style.right = '20px';
                    floatingWindow.style.left = 'auto';
                    floatingWindow.style.width = 'calc(80vw - 40px)';
                    floatingWindow.style.height = isMinimized ? 'auto' : 'calc(60vh - 40px)';
                    floatingWindow.style.maxWidth = '800px';
                    floatingWindow.style.maxHeight = '600px';
                    floatingWindow.style.borderRadius = '12px';
                    floatingWindow.style.resize = 'both';
                }
                chart.resize();
                console.log(`Chart resized due to fullscreen ${isFullscreen ? 'enter' : 'exit'}, container size:`, chartContainer.offsetWidth, chartContainer.offsetHeight);
            }
        });

        // Add support for webkit fullscreen change (Safari)
        addEvent(document, 'webkitfullscreenchange', () => {
            isFullscreen = !!document.webkitFullscreenElement;
            fullscreenBtn.innerText = isFullscreen ? '◱' : '◰';
            if (chart && isWindowVisible && !isMinimized) {
                if (isFullscreen) {
                    floatingWindow.style.top = '0';
                    floatingWindow.style.left = '0';
                    floatingWindow.style.width = '100vw';
                    floatingWindow.style.height = '100vh';
                    floatingWindow.style.maxWidth = 'none';
                    floatingWindow.style.maxHeight = 'none';
                    floatingWindow.style.borderRadius = '0';
                    floatingWindow.style.resize = 'none';
                } else {
                    floatingWindow.style.top = '20px';
                    floatingWindow.style.right = '20px';
                    floatingWindow.style.left = 'auto';
                    floatingWindow.style.width = 'calc(80vw - 40px)';
                    floatingWindow.style.height = isMinimized ? 'auto' : 'calc(60vh - 40px)';
                    floatingWindow.style.maxWidth = '800px';
                    floatingWindow.style.maxHeight = '600px';
                    floatingWindow.style.borderRadius = '12px';
                    floatingWindow.style.resize = 'both';
                }
                chart.resize();
                console.log(`Chart resized due to fullscreen ${isFullscreen ? 'enter' : 'exit'}, container size:`, chartContainer.offsetWidth, chartContainer.offsetHeight);
            }
        });

        // Add support for MS fullscreen change (IE11)
        addEvent(document, 'MSFullscreenChange', () => {
            isFullscreen = !!document.msFullscreenElement;
            fullscreenBtn.innerText = isFullscreen ? '◱' : '◰';
            if (chart && isWindowVisible && !isMinimized) {
                if (isFullscreen) {
                    floatingWindow.style.top = '0';
                    floatingWindow.style.left = '0';
                    floatingWindow.style.width = '100vw';
                    floatingWindow.style.height = '100vh';
                    floatingWindow.style.maxWidth = 'none';
                    floatingWindow.style.maxHeight = 'none';
                    floatingWindow.style.borderRadius = '0';
                    floatingWindow.style.resize = 'none';
                } else {
                    floatingWindow.style.top = '20px';
                    floatingWindow.style.right = '20px';
                    floatingWindow.style.left = 'auto';
                    floatingWindow.style.width = 'calc(80vw - 40px)';
                    floatingWindow.style.height = isMinimized ? 'auto' : 'calc(60vh - 40px)';
                    floatingWindow.style.maxWidth = '800px';
                    floatingWindow.style.maxHeight = '600px';
                    floatingWindow.style.borderRadius = '12px';
                    floatingWindow.style.resize = 'both';
                }
                chart.resize();
                console.log(`Chart resized due to fullscreen ${isFullscreen ? 'enter' : 'exit'}, container size:`, chartContainer.offsetWidth, chartContainer.offsetHeight);
            }
        });

        // Close button functionality
        addEvent(header.querySelector('.close-btn'), 'click', () => {
            isWindowVisible = false;
            floatingWindow.style.display = 'none';
            floatingWindow.style.opacity = '0';
            floatingWindow.style.transform = 'translateY(20px)';
            updateButtonBackground(false);
            button.title = 'Show Sales Chart';
            console.log('Floating window closed');
        });

        // Keyboard navigation (ESC to close)
        addEvent(document, 'keydown', (e) => {
            if (e.key === 'Escape' && isWindowVisible) {
                isWindowVisible = false;
                floatingWindow.style.display = 'none';
                floatingWindow.style.opacity = '0';
                floatingWindow.style.transform = 'translateY(20px)';
                updateButtonBackground(false);
                button.title = 'Show Sales Chart';
                console.log('Chart window closed via ESC');
            }
        });

        // Handle window resize
        addEvent(window, 'resize', () => {
            if (chart && isWindowVisible && !isMinimized && !isFullscreen) {
                chart.resize();
                console.log('Chart resized due to window resize, container size:', chartContainer.offsetWidth, chartContainer.offsetHeight);
            }
        });

        // Function to load chart data
        function loadChartData() {
            console.log('Executing data fetch');
            const baseUrl = 'http://erpx.htran.ltd:9095/pss/report/salesmans/group';
            const url = `${baseUrl}?_t=${new Date().getTime()}`; // Cache-busting
            const headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };

            // Cross-browser error handling for XMLHttpRequest
            function handleXHRError(error, context) {
                console.error(`XMLHttpRequest error in ${context}:`, error);
                loadingOverlay.style.display = 'none';
                chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">Failed to fetch data. Please ensure you are logged in and have network connectivity.</p>';
                chartDataLoaded = true;
            }

            // Cross-browser error handling for fetch API
            function handleFetchError(error, context) {
                console.error(`Fetch API error in ${context}:`, error);
                loadingOverlay.style.display = 'none';
                chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">Failed to fetch data. Please ensure you are logged in and have network connectivity.</p>';
                chartDataLoaded = true;
            }

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                console.log('Using GM_xmlhttpRequest');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: headers,
                    onload: function(response) {
                        console.log('API request successful, status:', response.status);
                        processData(response.responseText);
                    },
                    onerror: function(error) {
                        handleXHRError(error, 'GM_xmlhttpRequest');
                    }
                });
            } else {
                console.log('Falling back to fetch API');
                fetch(url, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include'
                })
                    .then(response => {
                        console.log('API request successful, status:', response.status);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => processData(data))
                    .catch(error => {
                        handleFetchError(error, 'fetch API');
                    });
            }

            // Cross-browser error handling for data processing
            function handleDataProcessingError(error, context) {
                console.error(`Data processing error in ${context}:`, error);
                loadingOverlay.style.display = 'none';
                chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">Error processing data. Please try again later.</p>';
                chartDataLoaded = true;
            }

            function processData(responseText) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('Parsed data:', data);

                    const currentDate = new Date();
                    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const validData = data.filter(item => {
                        const date = new Date(item.yMDString);
                        const isValid = !isNaN(date) && date >= sevenDaysAgo && date <= currentDate;
                        if (!isValid) {
                            console.warn(`Invalid or out-of-range date filtered: ${item.yMDString}`);
                        }
                        return isValid;
                    });
                    console.log('Filtered data:', validData);

                    if (validData.length === 0) {
                        loadingOverlay.style.display = 'none';
                        chartContainer.innerHTML = '<p style="color: red; text-align: center; padding-top: 20px;">No valid data for the last 7 days.</p>';
                        console.log('No valid data after filtering');
                        chartDataLoaded = true;
                        return;
                    }

                    const groupedData = validData.reduce((acc, item) => {
                        if (!acc[item.name]) {
                            acc[item.name] = [];
                        }
                        acc[item.name].push(item);
                        return acc;
                    }, {});
                    console.log('Grouped data:', groupedData);

                    const dates = [...new Set(validData.map(item => item.yMDString))].sort((a, b) => new Date(a) - new Date(b));
                    console.log('Dates for x-axis:', dates);

                    const series = Object.entries(groupedData).map(([name]) => ({
                        name: name,
                        type: 'line',
                        data: dates.map(date => {
                            const record = groupedData[name].find(r => r.yMDString === date);
                            return record ? (record.totalCount !== undefined && record.totalCount !== null ? record.totalCount : 0) : 0;
                        }),
                        smooth: true,
                        lineStyle: {
                            width: 2
                        },
                        itemStyle: {
                            opacity: 0.8
                        }
                    }));
                    console.log('Series data:', series);

                    loadingOverlay.style.display = 'none';
                    console.log('Chart container size before render:', chartContainer.offsetWidth, chartContainer.offsetHeight);

                    // Define responsive chart options
                    const chartOptions = {
                        title: {
                            text: 'Sales Performance (Last 7 Days)',
                            left: 'center',
                            textStyle: {
                                fontSize: isMobile ? Math.min(14, Math.max(10, Math.floor(window.innerWidth / 60))) : Math.min(16, Math.max(12, Math.floor(window.innerWidth / 80))),
                                color: '#333'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            confine: true,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            textStyle: {
                                color: '#fff'
                            },
                            formatter: function(params) {
                                const date = params[0].axisValue;
                                const sortedParams = params
                                    .filter(param => param.value !== null && param.value !== undefined)
                                    .sort((a, b) => (b.value || 0) - (a.value || 0));
                                let result = `<strong>${date}</strong><br/>`;

                                sortedParams.forEach(param => {
                                    const value = param.value !== null && param.value !== undefined ? param.value : 0;
                                    const seriesName = param.seriesName;

                                    // Find the record for this series and date to get increase data
                                    const record = validData.find(item =>
                                        item.name === seriesName && item.yMDString === date
                                    );

                                    // Get increase value or calculate it
                                    let increaseText = '';
                                    if (record && record.increase !== undefined && record.increase !== null) {
                                        const increase = record.increase;
                                        const increaseColor = increase >= 0 ? '#28a745' : '#dc3545';
                                        const increaseSymbol = increase >= 0 ? '+' : '';
                                        increaseText = ` <span style="color:${increaseColor};">(${increaseSymbol}${increase})</span>`;
                                    } else if (record && record.totalCount !== undefined) {
                                        // Calculate increase from previous day if possible
                                        const currentDateObj = new Date(date);
                                        const previousDate = new Date(currentDateObj.getTime() - 24 * 60 * 60 * 1000);
                                        const previousDateStr = previousDate.toISOString().split('T')[0];
                                        const previousRecord = validData.find(item =>
                                            item.name === seriesName && item.yMDString === previousDateStr
                                        );

                                        if (previousRecord && previousRecord.totalCount !== undefined) {
                                            const increase = record.totalCount - previousRecord.totalCount;
                                            const increaseColor = increase >= 0 ? '#28a745' : '#dc3545';
                                            const increaseSymbol = increase >= 0 ? '+' : '';
                                            increaseText = ` <span style="color:${increaseColor};">(${increaseSymbol}${increase})</span>`;
                                        }
                                    }

                                    result += `<span style="color:${param.color};">●</span> ${seriesName}: ${value}${increaseText}<br/>`;
                                });
                                return result;
                            }
                        },
                        legend: {
                            data: series.map(s => s.name),
                            bottom: 0,
                            type: 'scroll',
                            itemWidth: isMobile ? 12 : 14,
                            itemHeight: isMobile ? 8 : 10,
                            textStyle: {
                                color: '#333',
                                fontSize: isMobile ? Math.min(10, Math.max(8, Math.floor(window.innerWidth / 80))) : Math.min(12, Math.max(10, Math.floor(window.innerWidth / 100)))
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: dates,
                            axisLabel: {
                                rotate: isMobile ? 45 : (dates.length > 7 ? 45 : 0),
                                fontSize: isMobile ? Math.min(10, Math.max(6, Math.floor(window.innerWidth / 80))) : Math.min(12, Math.max(8, Math.floor(window.innerWidth / 100))),
                                color: '#555'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#e0e0e0'
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: 'Total Count',
                            nameTextStyle: {
                                fontSize: isMobile ? Math.min(10, Math.max(6, Math.floor(window.innerWidth / 80))) : Math.min(12, Math.max(8, Math.floor(window.innerWidth / 100))),
                                color: '#555'
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#e0e0e0'
                                }
                            }
                        },
                        series: series,
                        color: ['#4a90e2', '#2ecc71', '#e74c3c', '#3498db', '#f1c40f'],
                        grid: {
                            left: isMobile ? '15%' : '10%',
                            right: isMobile ? '5%' : '10%',
                            bottom: isMobile ? '20%' : '15%',
                            containLabel: true
                        }
                    };

                    chart.setOption(chartOptions);
                    chartDataLoaded = true;
                    chart.resize();
                    console.log('Chart rendered successfully');
                } catch (error) {
                    handleDataProcessingError(error, 'processData');
                }
            }
        }
    }
})();v