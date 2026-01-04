// ==UserScript==
// @name         Heyuri better /f/
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fluid SWF navigation with pagination
// @author       LVO
// @match        https://img.heyuri.net/f/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541767/Heyuri%20better%20f.user.js
// @updateURL https://update.greasyfork.org/scripts/541767/Heyuri%20better%20f.meta.js
// ==/UserScript==
// ==UserScript==
// @name         Heyuri SWF Navigation - Fluid Navigation
// @namespace    http://tampermonkey.net/
// @version      19.2
// @description  Fluid SWF navigation with pagination
// @author       You
// @match        https://img.heyuri.net/f/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const defaultConfig = {
        prevKey: 'ArrowLeft',
        nextKey: 'ArrowRight',
        closeKey: 'Escape',
        autoPageTurn: true,
        autoOpenFirstLast: true
    };

    // Load configuration
    let config = {
        ...defaultConfig,
        ...GM_getValue('swfNavConfig', {})
    };

    // CSS styles for UI elements
    GM_addStyle(`
        .tm-nav-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            pointer-events: none;
            z-index: 99999;
        }
        .tm-nav-btn {
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px;
            pointer-events: auto;
            transition: all 0.3s;
        }
        .tm-nav-btn:hover {
            background: rgba(0,0,0,0.9);
            transform: scale(1.1);
        }
        .tm-prev {
            margin-left: 20px;
        }
        .tm-next {
            margin-right: 20px;
        }
        .tm-controls-container {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 10001;
        }
        .tm-close-btn, .tm-options-btn, .tm-reply-btn {
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            pointer-events: auto;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .tm-close-btn {
            background: rgba(200,0,0,0.7);
        }
        .tm-close-btn:hover {
            background: rgba(200,0,0,0.9);
        }
        .tm-options-btn:hover, .tm-reply-btn:hover {
            background: rgba(0,0,0,0.9);
        }
        .tm-options-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 10002;
            max-width: 90%;
            width: 350px;
            display: none;
        }
        .tm-options-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: none;
        }
        .tm-options-content {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .tm-option-title {
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .tm-option-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
        }
        .tm-option-label {
            margin-bottom: 5px;
            font-weight: bold;
        }
        .tm-key-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            background: #f9f9f9;
        }
        .tm-option-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        .tm-option-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .tm-save-btn {
            background: #4CAF50;
            color: white;
        }
        .tm-cancel-btn {
            background: #f44336;
            color: white;
        }
        .tm-checkbox-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tm-page-indicator {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tm-page-indicator.show {
            opacity: 1;
        }
        .tm-file-counter {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10001;
        }
        .tm-reply-count {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            padding: 2px 8px;
            margin-left: 5px;
        }
        .sub-option {
            margin-left: 20px;
            margin-top: 8px;
        }
    `);

    // Global variables
    let currentFileIndex = -1;
    let swfFiles = [];
    let navigationActive = false;
    let nextPageUrl = '';
    let prevPageUrl = '';
    let autoOpenType = null;

    // Create UI elements
    function createUI() {
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'tm-nav-container';
        navContainer.style.display = 'none';
        document.body.appendChild(navContainer);

        // Navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'tm-nav-btn tm-prev';
        prevButton.innerHTML = '←';
        navContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'tm-nav-btn tm-next';
        nextButton.innerHTML = '→';
        navContainer.appendChild(nextButton);

        // Controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'tm-controls-container';
        navContainer.appendChild(controlsContainer);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'tm-close-btn';
        closeButton.innerHTML = 'Close';
        controlsContainer.appendChild(closeButton);

        // Reply button
        const replyButton = document.createElement('button');
        replyButton.className = 'tm-reply-btn';
        replyButton.innerHTML = '💬 Reply';
        replyButton.title = 'Go to thread';
        controlsContainer.appendChild(replyButton);

        // Options button
        const optionsButton = document.createElement('button');
        optionsButton.className = 'tm-options-btn';
        optionsButton.innerHTML = '⚙️ Options';
        optionsButton.title = 'Options';
        controlsContainer.appendChild(optionsButton);

        // Page indicator
        const pageIndicator = document.createElement('div');
        pageIndicator.className = 'tm-page-indicator';
        document.body.appendChild(pageIndicator);

        // File counter
        const fileCounter = document.createElement('div');
        fileCounter.className = 'tm-file-counter';
        fileCounter.textContent = '0/0';
        navContainer.appendChild(fileCounter);

        // Options panel
        const optionsBackdrop = document.createElement('div');
        optionsBackdrop.className = 'tm-options-backdrop';
        document.body.appendChild(optionsBackdrop);

        const optionsPanel = document.createElement('div');
        optionsPanel.className = 'tm-options-panel';
        optionsBackdrop.appendChild(optionsPanel);

        // Return references to important elements
        return {
            navContainer,
            prevButton,
            nextButton,
            closeButton,
            replyButton,
            optionsButton,
            pageIndicator,
            fileCounter,
            optionsBackdrop,
            optionsPanel
        };
    }

    // Initialize script
    function init() {
        // Create UI elements
        const ui = createUI();
        
        // Populate options panel
        ui.optionsPanel.innerHTML = `
            <h3 class="tm-option-title">Shortcut Configuration</h3>
            <div class="tm-options-content">
                <div class="tm-option-row">
                    <label class="tm-option-label">Previous key:</label>
                    <input type="text" class="tm-key-input" id="tm-prev-key" value="${config.prevKey}" readonly>
                </div>
                <div class="tm-option-row">
                    <label class="tm-option-label">Next key:</label>
                    <input type="text" class="tm-key-input" id="tm-next-key" value="${config.nextKey}" readonly>
                </div>
                <div class="tm-option-row">
                    <label class="tm-option-label">Close key:</label>
                    <input type="text" class="tm-key-input" id="tm-close-key" value="${config.closeKey}" readonly>
                </div>
                <div class="tm-option-row">
                    <div class="tm-checkbox-container">
                        <input type="checkbox" id="tm-auto-page" ${config.autoPageTurn ? 'checked' : ''}>
                        <label for="tm-auto-page">Automatically go to next/previous page</label>
                    </div>
                </div>
                <div class="tm-option-row" id="auto-open-container" style="${config.autoPageTurn ? '' : 'display: none;'}">
                    <div class="sub-option">
                        <div class="tm-checkbox-container">
                            <input type="checkbox" id="tm-auto-open-first-last" ${config.autoOpenFirstLast ? 'checked' : ''}>
                            <label for="tm-auto-open-first-last">Open first/last file after page change</label>
                        </div>
                    </div>
                </div>
                <div class="tm-option-buttons">
                    <button class="tm-option-btn tm-cancel-btn">Cancel</button>
                    <button class="tm-option-btn tm-save-btn">Save</button>
                </div>
            </div>
        `;

        // Get list of SWF files
        swfFiles = Array.from(document.querySelectorAll('tr.thread[id^="t11_"]'));

        // Get next/previous page URLs
        const pagination = getPaginationLinks();
        prevPageUrl = pagination.prev;
        nextPageUrl = pagination.next;

        // Get auto-open state
        autoOpenType = sessionStorage.getItem('swfNavAutoOpen');

        // Setup event listeners
        setupEventListeners(ui);

        // Start monitoring SWF window
        monitorSWFWindow(ui);

        // Open file automatically if needed
        openAutoFile(ui);
    }

    // Function to get pagination links
    function getPaginationLinks() {
        const pager = document.getElementById('pager');
        if (!pager) return { prev: null, next: null };

        const prev = pager.querySelector('td:first-child a');
        const next = pager.querySelector('td:last-child a');

        return {
            prev: prev ? prev.href : null,
            next: next ? next.href : null
        };
    }

    // Function to show page indicator
    function showPageIndicator(message, ui) {
        ui.pageIndicator.textContent = message;
        ui.pageIndicator.classList.add('show');

        setTimeout(() => {
            ui.pageIndicator.classList.remove('show');
        }, 2000);
    }

    // Update file counter
    function updateFileCounter(ui) {
        if (currentFileIndex >= 0 && currentFileIndex < swfFiles.length) {
            const totalFiles = swfFiles.length;
            ui.fileCounter.textContent = `${currentFileIndex + 1}/${totalFiles}`;
            
            // Update reply count
            const repliesCell = swfFiles[currentFileIndex].querySelector('td:nth-child(8)');
            if (repliesCell) {
                const replyCount = repliesCell.textContent.trim();
                ui.replyButton.innerHTML = `💬 Reply <span class="tm-reply-count">${replyCount}</span>`;
            }
        } else {
            ui.fileCounter.textContent = '0/0';
            ui.replyButton.innerHTML = '💬 Reply';
        }
    }

    // Open file automatically after page change
    function openAutoFile(ui) {
        if (autoOpenType) {
            setTimeout(() => {
                let fileToOpen = null;
                
                if (autoOpenType === 'first' && swfFiles.length > 0) {
                    fileToOpen = swfFiles[0];
                } 
                else if (autoOpenType === 'last' && swfFiles.length > 0) {
                    fileToOpen = swfFiles[swfFiles.length - 1];
                }
                
                if (fileToOpen) {
                    const embedLink = fileToOpen.querySelector('.flashboardEmbedText');
                    if (embedLink) {
                        currentFileIndex = swfFiles.indexOf(fileToOpen);
                        embedLink.click();
                        showNavigation(ui);
                        updateFileCounter(ui);
                    }
                }
                
                // Reset state
                sessionStorage.removeItem('swfNavAutoOpen');
            }, 500);
        }
    }

    function showNavigation(ui) {
        ui.navContainer.style.display = 'flex';
        navigationActive = true;
        updateFileCounter(ui);
    }

    function hideNavigation(ui) {
        ui.navContainer.style.display = 'none';
        navigationActive = false;
    }

    function closeModal(ui) {
        // Close options panel first if open
        if (ui.optionsPanel.style.display === 'block') {
            hideOptions(ui);
            return;
        }
        
        // Otherwise close SWF window
        const modal = document.getElementById('swfWindow');
        const overlay = document.getElementById('darken-embed-screen');
        if (modal) modal.remove();
        if (overlay) overlay.remove();
        hideNavigation(ui);
    }

    function goToNext(ui) {
        navigateFiles(1, ui);
    }

    function goToPrev(ui) {
        navigateFiles(-1, ui);
    }

    function navigateFiles(direction, ui) {
        if (currentFileIndex === -1 || swfFiles.length === 0) return;

        const newIndex = currentFileIndex + direction;

        // Navigation within page
        if (newIndex >= 0 && newIndex < swfFiles.length) {
            closeModal(ui);
            setTimeout(() => {
                const embedLink = swfFiles[newIndex].querySelector('.flashboardEmbedText');
                if (embedLink) {
                    currentFileIndex = newIndex;
                    embedLink.click();
                    updateFileCounter(ui);
                }
            }, 100);
        }
        // Go to next page
        else if (newIndex >= swfFiles.length && config.autoPageTurn && nextPageUrl) {
            showPageIndicator('Loading next page...', ui);
            
            // Store state for auto-open
            if (config.autoPageTurn && config.autoOpenFirstLast) {
                sessionStorage.setItem('swfNavAutoOpen', 'first');
            }
            
            window.location.href = nextPageUrl;
        }
        // Go to previous page
        else if (newIndex < 0 && config.autoPageTurn && prevPageUrl) {
            showPageIndicator('Loading previous page...', ui);
            
            // Store state for auto-open
            if (config.autoPageTurn && config.autoOpenFirstLast) {
                sessionStorage.setItem('swfNavAutoOpen', 'last');
            }
            
            window.location.href = prevPageUrl;
        }
        // Boundary reached
        else if (newIndex < 0 && !prevPageUrl) {
            showPageIndicator('You are on the first page', ui);
        }
        else if (newIndex >= swfFiles.length && !nextPageUrl) {
            showPageIndicator('You are on the last page', ui);
        }
    }

    function showOptions(ui) {
        ui.optionsBackdrop.style.display = 'block';
        ui.optionsPanel.style.display = 'block';
    }

    function hideOptions(ui) {
        ui.optionsBackdrop.style.display = 'none';
        ui.optionsPanel.style.display = 'none';
    }

    function saveConfig(ui) {
        config = {
            prevKey: document.getElementById('tm-prev-key').value,
            nextKey: document.getElementById('tm-next-key').value,
            closeKey: document.getElementById('tm-close-key').value,
            autoPageTurn: document.getElementById('tm-auto-page').checked,
            autoOpenFirstLast: document.getElementById('tm-auto-open-first-last').checked
        };

        GM_setValue('swfNavConfig', config);
        hideOptions(ui);
        showPageIndicator('Configuration saved!', ui);
    }

    function setupEventListeners(ui) {
        // Navigation buttons
        ui.prevButton.addEventListener('click', () => goToPrev(ui));
        ui.nextButton.addEventListener('click', () => goToNext(ui));
        ui.closeButton.addEventListener('click', () => closeModal(ui));
        ui.optionsButton.addEventListener('click', () => showOptions(ui));
        
        // Reply button
        ui.replyButton.addEventListener('click', () => {
            if (currentFileIndex >= 0 && currentFileIndex < swfFiles.length) {
                const threadId = swfFiles[currentFileIndex].id.replace('t11_', '');
                window.location.href = `koko.php?res=${threadId}`;
            }
        });

        // Options panel buttons
        ui.optionsPanel.querySelector('.tm-save-btn').addEventListener('click', () => saveConfig(ui));
        ui.optionsPanel.querySelector('.tm-cancel-btn').addEventListener('click', () => hideOptions(ui));
        ui.optionsBackdrop.addEventListener('click', (e) => {
            if (e.target === ui.optionsBackdrop) hideOptions(ui);
        });

        // Key detection for input fields
        document.querySelectorAll('.tm-key-input').forEach(input => {
            input.addEventListener('click', function() {
                this.value = 'Press a key...';
                this.dataset.listening = true;
            });
        });

        // Handle auto-page option toggle
        const autoPageCheckbox = document.getElementById('tm-auto-page');
        const autoOpenContainer = document.getElementById('auto-open-container');
        
        if (autoPageCheckbox && autoOpenContainer) {
            autoPageCheckbox.addEventListener('change', function() {
                autoOpenContainer.style.display = this.checked ? 'block' : 'none';
            });
        }

        // Keyboard handling
        document.addEventListener('keydown', (e) => handleKeyPress(e, ui));

        // Detect click on Embed links
        document.addEventListener('click', e => {
            if (e.target.classList.contains('flashboardEmbedText')) {
                // Find parent TR
                const row = e.target.closest('tr.thread');
                if (row && swfFiles) {
                    currentFileIndex = swfFiles.indexOf(row);
                    if (currentFileIndex !== -1) {
                        showNavigation(ui);
                        updateFileCounter(ui);
                    }
                }
            }
        });
    }

    // Keyboard handling
    function handleKeyPress(e, ui) {
        // Key detection for configuration
        const activeInput = document.querySelector('.tm-key-input[data-listening="true"]');
        if (activeInput) {
            e.preventDefault();
            activeInput.value = e.key;
            activeInput.dataset.listening = false;
            return;
        }

        // Close key
        if (e.key === config.closeKey && navigationActive) {
            closeModal(ui);
            e.preventDefault();
        }

        // Navigation with arrow keys
        if (navigationActive) {
            if (e.key === config.nextKey) {
                goToNext(ui);
                e.preventDefault();
            } else if (e.key === config.prevKey) {
                goToPrev(ui);
                e.preventDefault();
            }
        }
    }

    // Monitor SWF window opening/closing
    function monitorSWFWindow(ui) {
        const intervalId = setInterval(() => {
            const swfWindow = document.getElementById('swfWindow');

            if (swfWindow && !navigationActive) {
                showNavigation(ui);
            }
            else if (!swfWindow && navigationActive) {
                hideNavigation(ui);
            }
        }, 500);

        // Clean up interval on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(intervalId);
        });
    }

    // Start script when page is fully loaded
    window.addEventListener('load', init);
})();