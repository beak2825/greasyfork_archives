// ==UserScript==
// @name         Universal Auto-Scroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds auto-scrolling functionality to any website
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537195/Universal%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/537195/Universal%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait a bit for page to be fully ready
    setTimeout(initAutoScroll, 1000);

    function initAutoScroll() {
        // Configuration
        const DEFAULT_SETTINGS = {
            isActive: false,
            speed: 3,
            isMinimized: false,
            pixelsPerSecond: 50  // Base scrolling speed - will be modified by speed setting
        };

        // State variables
        let isScrolling = false;
        let scrollIntervalId = null;
        let userScrollDetected = false;
        let userScrollTimeout = null;
        let lastScrollPosition = window.scrollY;

        // Load saved settings or use defaults - Using Tampermonkey's built-in storage
        let scrollSettings;
        try {
            scrollSettings = JSON.parse(GM_getValue('autoScrollSettings', JSON.stringify(DEFAULT_SETTINGS)));
        } catch (e) {
            console.log('Could not load settings, using defaults');
            scrollSettings = DEFAULT_SETTINGS;
        }

        // DOM elements references
        let autoScrollPanel;
        let bubbleView;
        let toggleButton;
        let speedSlider;
        let speedValue;

        // Create and inject the UI
        function createUI() {
            // Create a container for our elements with a unique ID
            const containerId = 'auto-scroll-container-' + Math.random().toString(36).substr(2, 9);
            const container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);

            // Add isolated styles to avoid conflicts with page CSS
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                #${containerId} {
                    all: initial;
                    font-family: Arial, sans-serif;
                    color: white;
                    font-size: 14px;
                }
                #${containerId} * {
                    all: unset;
                    box-sizing: border-box;
                }
                #${containerId} .auto-scroll-panel {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    width: 220px;
                    z-index: 9999999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    font-family: Arial, sans-serif;
                    display: ${scrollSettings.isMinimized ? 'none' : 'block'};
                }
                #${containerId} .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    padding-bottom: 8px;
                }
                #${containerId} .panel-title {
                    font-weight: bold;
                    font-size: 16px;
                    display: block;
                }
                #${containerId} .minimize-button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    padding: 0;
                    margin: 0;
                    display: block;
                }
                #${containerId} .section {
                    margin-bottom: 12px;
                }
                #${containerId} .section-title {
                    font-size: 14px;
                    color: #ffcc00;
                    margin-bottom: 8px;
                    display: block;
                }
                #${containerId} .toggle-button {
                    background-color: #2196F3;
                    border: none;
                    color: white;
                    padding: 10px 15px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 14px;
                    border-radius: 6px;
                    width: 100%;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                }
                #${containerId} .toggle-button.active {
                    background-color: #4CAF50;
                }
                #${containerId} .slider-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                #${containerId} .slider-top {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
                #${containerId} .speed-value {
                    font-weight: bold;
                }
                #${containerId} .speed-slider {
                    width: 100%;
                    height: 5px;
                    -webkit-appearance: none;
                    appearance: none;
                    background: #444;
                    outline: none;
                    border-radius: 3px;
                    display: block;
                }
                #${containerId} .speed-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #ffcc00;
                    cursor: pointer;
                }
                #${containerId} .speed-slider::-moz-range-thumb {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #ffcc00;
                    cursor: pointer;
                }
                #${containerId} .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
                #${containerId} .auto-scroll-bubble {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: ${scrollSettings.isMinimized ? 'flex' : 'none'};
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    z-index: 9999999;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    font-size: 24px;
                }
            `;
            document.head.appendChild(styleElement);

            // Create the main panel
            autoScrollPanel = document.createElement('div');
            autoScrollPanel.className = 'auto-scroll-panel';
            container.appendChild(autoScrollPanel);

            // Create panel header with title and minimize button
            const panelHeader = document.createElement('div');
            panelHeader.className = 'panel-header';

            const panelTitle = document.createElement('div');
            panelTitle.className = 'panel-title';
            panelTitle.textContent = 'Auto-Scroll Controls';

            const minimizeButton = document.createElement('button');
            minimizeButton.className = 'minimize-button';
            minimizeButton.textContent = '−';
            minimizeButton.addEventListener('click', toggleMinimize);

            panelHeader.appendChild(panelTitle);
            panelHeader.appendChild(minimizeButton);
            autoScrollPanel.appendChild(panelHeader);

            // Create scrolling status section
            const statusSection = document.createElement('div');
            statusSection.className = 'section';

            const statusTitle = document.createElement('div');
            statusTitle.className = 'section-title';
            statusTitle.textContent = 'Scrolling Status';

            toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button' + (scrollSettings.isActive ? ' active' : '');
            toggleButton.innerHTML = scrollSettings.isActive ?
                '<span>⏸️</span> Pause Scrolling' :
                '<span>▶️</span> Start Scrolling';
            toggleButton.addEventListener('click', toggleScrolling);

            statusSection.appendChild(statusTitle);
            statusSection.appendChild(toggleButton);
            autoScrollPanel.appendChild(statusSection);

            // Create speed control section
            const speedSection = document.createElement('div');
            speedSection.className = 'section';

            const speedTitle = document.createElement('div');
            speedTitle.className = 'section-title';
            speedTitle.textContent = 'Scroll Speed';

            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            const sliderTop = document.createElement('div');
            sliderTop.className = 'slider-top';

            const speedLabel = document.createElement('span');
            speedLabel.textContent = 'Speed:';

            speedValue = document.createElement('span');
            speedValue.className = 'speed-value';
            updateSpeedDisplay(scrollSettings.speed);

            sliderTop.appendChild(speedLabel);
            sliderTop.appendChild(speedValue);

            speedSlider = document.createElement('input');
            speedSlider.type = 'range';
            speedSlider.className = 'speed-slider';
            speedSlider.min = '1';
            speedSlider.max = '5';
            speedSlider.value = scrollSettings.speed;
            speedSlider.addEventListener('input', handleSpeedChange);

            const sliderLabels = document.createElement('div');
            sliderLabels.className = 'slider-labels';

            const slowLabel = document.createElement('span');
            slowLabel.textContent = 'Slow';

            const fastLabel = document.createElement('span');
            fastLabel.textContent = 'Fast';

            sliderLabels.appendChild(slowLabel);
            sliderLabels.appendChild(fastLabel);

            sliderContainer.appendChild(sliderTop);
            sliderContainer.appendChild(speedSlider);
            sliderContainer.appendChild(sliderLabels);

            speedSection.appendChild(speedTitle);
            speedSection.appendChild(sliderContainer);
            autoScrollPanel.appendChild(speedSection);

            // Create bubble view (minimized version)
            bubbleView = document.createElement('div');
            bubbleView.className = 'auto-scroll-bubble';
            bubbleView.innerHTML = '📜';
            bubbleView.addEventListener('click', toggleMinimize);
            container.appendChild(bubbleView);

            // Start scrolling if it was active before
            if (scrollSettings.isActive) {
                startScrolling();
            }
        }

        // Toggle between expanded panel and minimized bubble
        function toggleMinimize() {
            scrollSettings.isMinimized = !scrollSettings.isMinimized;

            if (scrollSettings.isMinimized) {
                autoScrollPanel.style.display = 'none';
                bubbleView.style.display = 'flex';
            } else {
                autoScrollPanel.style.display = 'block';
                bubbleView.style.display = 'none';
            }

            saveSettings();
        }

        // Toggle scrolling on/off
        function toggleScrolling() {
            scrollSettings.isActive = !scrollSettings.isActive;

            if (scrollSettings.isActive) {
                // Start scrolling
                toggleButton.classList.add('active');
                toggleButton.innerHTML = '<span>⏸️</span> Pause Scrolling';
                startScrolling();
            } else {
                // Pause scrolling
                toggleButton.classList.remove('active');
                toggleButton.innerHTML = '<span>▶️</span> Start Scrolling';
                stopScrolling();
            }

            saveSettings();
        }

        // Handle speed slider changes
        function handleSpeedChange() {
            const value = parseInt(speedSlider.value);
            scrollSettings.speed = value;
            updateSpeedDisplay(value);

            // If currently scrolling, update the scroll speed
            if (isScrolling) {
                stopScrolling();
                startScrolling();
            }

            saveSettings();
        }

        // Update speed display text
        function updateSpeedDisplay(value) {
            let speedText;

            if (value === 1) speedText = "Very Slow";
            else if (value === 2) speedText = "Slow";
            else if (value === 3) speedText = "Medium";
            else if (value === 4) speedText = "Fast";
            else speedText = "Very Fast";

            speedValue.textContent = `${speedText} (${value})`;
        }

        // Start auto-scrolling
        function startScrolling() {
            if (isScrolling) return;

            isScrolling = true;
            lastScrollPosition = window.scrollY;

            // Calculate scroll speed based on setting (1-5)
            // The base speed (pixelsPerSecond) is multiplied by a factor based on the speed setting
            const speedFactors = [0.5, 0.75, 1, 1.5, 2.5]; // Factors for speeds 1-5
            const pixelsPerSecond = DEFAULT_SETTINGS.pixelsPerSecond * speedFactors[scrollSettings.speed - 1];

            // Convert pixels per second to interval delay in milliseconds
            // We'll scroll 1px at a time for smoothness
            const scrollDelay = Math.floor(1000 / pixelsPerSecond);

            // Start scroll interval
            scrollIntervalId = setInterval(function() {
                // Only scroll if user isn't manually scrolling
                if (!userScrollDetected) {
                    window.scrollBy(0, 1);
                }
            }, scrollDelay);
        }

        // Stop auto-scrolling
        function stopScrolling() {
            if (!isScrolling) return;

            isScrolling = false;
            if (scrollIntervalId !== null) {
                clearInterval(scrollIntervalId);
                scrollIntervalId = null;
            }
        }

        // Save settings using Tampermonkey's storage
        function saveSettings() {
            try {
                GM_setValue('autoScrollSettings', JSON.stringify(scrollSettings));
            } catch (e) {
                console.error('Failed to save settings:', e);
            }
        }

        // Handle user manual scrolling
        function handleUserScroll() {
            const currentPosition = window.scrollY;

            // If position changed significantly (more than what our auto-scroll would do)
            // and we're currently auto-scrolling, pause temporarily
            if (isScrolling && Math.abs(currentPosition - lastScrollPosition) > 3) {
                userScrollDetected = true;

                // Clear existing timeout if there is one
                if (userScrollTimeout) {
                    clearTimeout(userScrollTimeout);
                }

                // Set timeout to resume auto-scrolling after user stops scrolling
                userScrollTimeout = setTimeout(function() {
                    userScrollDetected = false;
                    lastScrollPosition = window.scrollY;
                }, 5000); // 5-second delay before resuming
            }

            lastScrollPosition = currentPosition;
        }

        // Only create UI if we're on a page with scrollable content
        if (document.body && document.body.scrollHeight > window.innerHeight) {
            createUI();

            // Add scroll event listener to detect manual user scrolling
            window.addEventListener('scroll', handleUserScroll, { passive: true });

            // Clean up when page is unloaded
            window.addEventListener('beforeunload', function() {
                if (scrollIntervalId !== null) {
                    clearInterval(scrollIntervalId);
                }
            });
        }
    }
})();