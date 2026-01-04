// ==UserScript==
// @name         Local TXT Reader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enhanced reading experience for local txt files with Element UI style and improved themes
// @author       JiuYou2020
// @license      MIT
// @match        file:///*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/497811/Local%20TXT%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/497811/Local%20TXT%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the script runs only on .txt files
    if (window.location.pathname.endsWith('.txt')) {
        // Set up styles
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                margin: 0;
                padding: 0;
                display: flex;
                height: 100vh;
                overflow: hidden;
                transition: background-color 0.3s, color 0.3s;
                background-size: cover;
                background-position: center;
            }
            .outer-container {
                flex: 1;
                overflow-y: auto;
                scroll-behavior: smooth;
                padding: 20px;
            }
            .content-container {
                width: 55%;
                margin: 0 auto;
                transition: font-size 0.3s, line-height 0.3s, background-color 0.3s, color 0.3s;
                padding: 20px;
                border-radius: 10px;
            }
            .content-container p {
                text-indent: 2em;
                margin-top: 1em;
            }
            #settingsBtn {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 1000;
                padding: 12px;
                background-color: #409EFF;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                transition: background-color 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #settingsBtn:hover {
                background-color: #66b1ff;
            }
            #settingsPanel {
                display: none;
                position: fixed;
                right: 20px;
                bottom: 80px;
                background-color: white;
                border: 1px solid #EBEEF5;
                border-radius: 4px;
                padding: 20px;
                z-index: 1000;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
            }
            #settingsPanel div {
                margin-bottom: 15px;
            }
            #settingsPanel button {
                margin-right: 5px;
                padding: 8px 15px;
                border: 1px solid #DCDFE6;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
                background-color: white;
                color: #606266;
            }
            #settingsPanel button:hover {
                color: #409EFF;
                border-color: #c6e2ff;
                background-color: #ecf5ff;
            }
            .theme-btn {
                width: 30px;
                height: 30px;
                border-radius: 4px;
            }
            #classicTheme { background-color: #e7e3d8; }
            #whiteTheme { background-color: #ffffff; border: 1px solid #DCDFE6 !important; }
            #darkTheme { background-color: #1e1e1e; }
            .font-btn, .line-height-btn {
                background-color: #409EFF !important;
                color: white !important;
                border: none !important;
            }
            .font-btn:hover, .line-height-btn:hover {
                background-color: #66b1ff !important;
                color: white !important;
            }
            #resetDefault {
                background-color: #F56C6C !important;
                color: white !important;
                border: none !important;
            }
            #resetDefault:hover {
                background-color: #f78989 !important;
            }
            #customBgInput {
                display: none;
            }
            #customBgLabel {
                display: inline-block;
                padding: 8px 15px;
                background-color: #67C23A;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            #customBgLabel:hover {
                background-color: #85ce61;
            }
        `;
        document.head.appendChild(style);

        // Get the text content
        const text = document.body.textContent.trim();

        // Split the text into paragraphs by newlines
        const paragraphs = text.split(/\n+/).map(paragraph => paragraph.trim());

        // Clear the body content
        document.body.innerHTML = '';

        // Create the outer container
        const outerContainer = document.createElement('div');
        outerContainer.className = 'outer-container';
        document.body.appendChild(outerContainer);

        // Create the content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';
        outerContainer.appendChild(contentContainer);

        // Add paragraphs to the content container
        paragraphs.forEach(paragraph => {
            if (paragraph) { // Only add non-empty paragraphs
                const p = document.createElement('p');
                p.textContent = paragraph;
                contentContainer.appendChild(p);
            }
        });

        // Create settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settingsBtn';
        settingsBtn.textContent = '设置';
        document.body.appendChild(settingsBtn);

        // Create settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settingsPanel';
        settingsPanel.innerHTML = `
            <div>
                大小:
                <button id="decreaseFont" class="font-btn">-</button>
                <span id="currentFontSize"></span>
                <button id="increaseFont" class="font-btn">+</button>
            </div>
            <div>
                行高:
                <button id="decreaseLineHeight" class="line-height-btn">-</button>
                <span id="currentLineHeight"></span>
                <button id="increaseLineHeight" class="line-height-btn">+</button>
            </div>
            <div>
                主题:
                <button id="classicTheme" class="theme-btn" title="经典"></button>
                <button id="whiteTheme" class="theme-btn" title="纯白"></button>
                <button id="darkTheme" class="theme-btn" title="暗黑"></button>
            </div>
            <div>
                <label for="customBgInput" id="customBgLabel">自定义背景</label>
                <input type="file" id="customBgInput" accept="image/*">
            </div>
            <div>
                <button id="resetDefault">恢复默认设置</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        // Define themes
        const themes = {
            classic: { bg: '#e7e3d8', text: '#333333', contentBg: '#f1ede4' },
            white: { bg: '#ffffff', text: '#333333', contentBg: '#ffffff' },
            dark: { bg: '#1e1e1e', text: '#ffffff', contentBg: 'rgba(30, 30, 30, 0.8)' }
        };

        // Function to save settings
        function saveSettings() {
            const settings = {
                fontSize: contentContainer.style.fontSize,
                lineHeight: contentContainer.style.lineHeight,
                theme: currentTheme,
                customBg: document.body.style.backgroundImage,
                btnPosition: {
                    right: settingsBtn.style.right,
                    bottom: settingsBtn.style.bottom
                }
            };
            GM_setValue('readerSettings', JSON.stringify(settings));
        }

        // Function to load settings
        function loadSettings() {
            const savedSettings = GM_getValue('readerSettings', null);
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                contentContainer.style.fontSize = settings.fontSize || '19px';
                contentContainer.style.lineHeight = settings.lineHeight || '1.5';
                applyTheme(settings.theme || 'classic');
                if (settings.customBg) {
                    document.body.style.backgroundImage = settings.customBg;
                }
                if (settings.btnPosition) {
                    settingsBtn.style.right = settings.btnPosition.right;
                    settingsBtn.style.bottom = settings.btnPosition.bottom;
                }
            } else {
                resetToDefault();
            }
        }

        // Function to apply theme
        function applyTheme(theme) {
            if (theme !== 'custom') {
                document.body.style.backgroundColor = themes[theme].bg;
                document.body.style.color = themes[theme].text;
                contentContainer.style.backgroundColor = themes[theme].contentBg;
                document.body.style.backgroundImage = '';
            }
            currentTheme = theme;
        }

        // Function to reset to default settings
        function resetToDefault() {
            contentContainer.style.fontSize = '19px';
            contentContainer.style.lineHeight = '1.5';
            applyTheme('classic');
            document.body.style.backgroundImage = '';
            settingsBtn.style.right = '20px';
            settingsBtn.style.bottom = '20px';
            updateSettingsDisplay();
            saveSettings();
        }

        // Load settings
        let currentTheme = 'classic';
        loadSettings();

        // Function to save the current scroll position
        function saveScrollPosition() {
            const scrollPosition = outerContainer.scrollTop;
            const fileName = window.location.pathname.split('/').pop();
            GM_setValue(fileName, scrollPosition);
        }

        // Function to load the saved scroll position
        function loadScrollPosition() {
            const fileName = window.location.pathname.split('/').pop();
            const savedPosition = GM_getValue(fileName, 0);
            outerContainer.scrollTop = savedPosition;
        }

        // Load the saved position when the page loads
        loadScrollPosition();

        // Save the position when the user scrolls
        outerContainer.addEventListener('scroll', saveScrollPosition);

        // Handle arrow key navigation
        document.addEventListener('keydown', function(e) {
            const scrollAmount = 100; // Adjust this value to change scroll speed
            if (e.key === 'ArrowUp') {
                outerContainer.scrollBy({top: -scrollAmount, behavior: 'smooth'});
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                outerContainer.scrollBy({top: scrollAmount, behavior: 'smooth'});
                e.preventDefault();
            }
        });

        // Toggle settings panel
        settingsBtn.addEventListener('click', () => {
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
            updatePanelPosition();
        });

        // Make settings button draggable
        let isDragging = false;
        let dragOffsetX, dragOffsetY;

        settingsBtn.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - settingsBtn.offsetLeft;
            dragOffsetY = e.clientY - settingsBtn.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newX = e.clientX - dragOffsetX;
                const newY = e.clientY - dragOffsetY;
                settingsBtn.style.right = `${document.body.clientWidth - newX - settingsBtn.offsetWidth}px`;
                settingsBtn.style.bottom = `${document.body.clientHeight - newY - settingsBtn.offsetHeight}px`;
                updatePanelPosition();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                saveSettings();
            }
        });

        // Update settings panel position
        function updatePanelPosition() {
            const btnRect = settingsBtn.getBoundingClientRect();
            settingsPanel.style.right = settingsBtn.style.right;
            settingsPanel.style.bottom = `${parseFloat(settingsBtn.style.bottom) + btnRect.height + 10}px`;
        }

        // Font size controls
        document.getElementById('decreaseFont').addEventListener('click', () => {
            const currentSize = parseInt(contentContainer.style.fontSize);
            if (currentSize > 10) {
                contentContainer.style.fontSize = (currentSize - 1) + 'px';
                updateSettingsDisplay();
                saveSettings();
            }
        });

        document.getElementById('increaseFont').addEventListener('click', () => {
            const currentSize = parseInt(contentContainer.style.fontSize);
            if (currentSize < 30) {
                contentContainer.style.fontSize = (currentSize + 1) + 'px';
                updateSettingsDisplay();
                saveSettings();
            }
        });

        // Line height controls
        document.getElementById('decreaseLineHeight').addEventListener('click', () => {
            const currentHeight = parseFloat(contentContainer.style.lineHeight);
            if (currentHeight > 1) {
                contentContainer.style.lineHeight = (currentHeight - 0.1).toFixed(1);
                updateSettingsDisplay();
                saveSettings();
            }
        });

        document.getElementById('increaseLineHeight').addEventListener('click', () => {
            const currentHeight = parseFloat(contentContainer.style.lineHeight);
            if (currentHeight < 3) {
                contentContainer.style.lineHeight = (currentHeight + 0.1).toFixed(1);
                updateSettingsDisplay();
                saveSettings();
            }
        });

        // Theme controls
        document.getElementById('classicTheme').addEventListener('click', () => {
            applyTheme('classic');
            saveSettings();
        });

        document.getElementById('whiteTheme').addEventListener('click', () => {
            applyTheme('white');
            saveSettings();
        });

        document.getElementById('darkTheme').addEventListener('click', () => {
            applyTheme('dark');
            saveSettings();
        });

        // Custom background
        document.getElementById('customBgInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.body.style.backgroundImage = `url(${e.target.result})`;
                    currentTheme = 'custom';
                    saveSettings();
                }
                reader.readAsDataURL(file);
            }
        });

        // Reset to default
        document.getElementById('resetDefault').addEventListener('click', resetToDefault);

        // Update display of current settings
        function updateSettingsDisplay() {
            document.getElementById('currentFontSize').textContent = contentContainer.style.fontSize;
            document.getElementById('currentLineHeight').textContent = contentContainer.style.lineHeight;
        }

        updateSettingsDisplay();
    }
})();