// ==UserScript==
// @name         AI Search Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  A sidebar for quick AI-powered searches across multiple platforms. Select text and search instantly.
// @author       davidh_123
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/XXXX-ai-search-sidebar
// @supportURL   https://greasyfork.org/en/scripts/XXXX-ai-search-sidebar/feedback
// @downloadURL https://update.greasyfork.org/scripts/541417/AI%20Search%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/541417/AI%20Search%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        version: '1.7',
        defaultWidth: 320,
        animationSpeed: 300,
        themes: {
            light: {
                background: '#f8f9fa',
                border: '#dee2e6',
                text: '#333',
                hover: '#e9ecef',
                button: '#4a6fa5',
                buttonHover: '#3a5a8a'
            },
            dark: {
                background: '#2c2c2c',
                border: '#444',
                text: '#fff',
                hover: '#3a3a3a',
                button: '#6b7280',
                buttonHover: '#4b5563'
            }
        }
    };

    // Internationalization
    const I18N = {
        en: {
            title: 'AI Search v' + CONFIG.version,
            noTextSelected: 'No text selected',
            removeAllPlatforms: 'Remove All Custom Platforms',
            editPlatforms: 'Edit Platforms',
            platformName: 'Platform Name',
            platformUrl: 'URL (must contain ?q= or will be added)',
            platformIcon: 'Icon Class',
            platformColor: 'Color',
            save: 'Save',
            cancel: 'Cancel',
            invalidUrl: 'Invalid URL - must start with https://',
            platformSaved: 'Platform saved',
            platformError: 'Error saving platform',
            platformsRemoved: 'All custom platforms removed',
            urlRequired: 'URL is required',
            nameRequired: 'Platform name is required'
        }
    };

    // Core platforms that cannot be removed (marked with isCore: true)
    const CORE_PLATFORMS = {
        "Claude": { url: "https://claude.ai/chats?q=", icon: "fa-solid fa-robot", color: "#d4a1e7", isCore: true },
        "Gemini": { url: "https://gemini.google.com/app?q=", icon: "fa-solid fa-robot", color: "#4285f4", isCore: true },
        "Perplexity": { url: "https://www.perplexity.ai/?q=", icon: "fa-solid fa-robot", color: "#9747ff", isCore: true },
        "Grok": { url: "https://grok.com/chat/?q=", icon: "fa-solid fa-robot", color: "#000000", isCore: true },
        "Deepseek": { url: "https://chat.deepseek.com/?q=", icon: "fa-solid fa-robot", color: "#00a67e", isCore: true }
    };

    // State management
    let platforms = GM_getValue('customPlatforms', JSON.parse(JSON.stringify(CORE_PLATFORMS)));
    let isEnabled = GM_getValue('isEnabled', false);
    let sidebarWidth = GM_getValue('sidebarWidth', CONFIG.defaultWidth);
    let theme = GM_getValue('theme', 'light');
    let lang = navigator.language.split('-')[0] in I18N ? navigator.language.split('-')[0] : 'en';
    let selectedText = '';
    let selectedPlatform = null;

    // Generate CSS styles
    function getCSSStyles() {
        return `
            #ai-search-sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: ${sidebarWidth}px;
                height: 100vh;
                background: ${CONFIG.themes[theme].background};
                border-left: 1px solid ${CONFIG.themes[theme].border};
                padding: 15px;
                box-sizing: border-box;
                display: ${isEnabled ? 'flex' : 'none'};
                flex-direction: column;
                z-index: 2147483647;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                resize: horizontal;
                min-width: 200px;
                max-width: 500px;
                overflow: hidden;
            }
            #ai-search-sidebar * {
                box-sizing: border-box;
            }
            #ai-search-sidebar .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid ${CONFIG.themes[theme].border};
                color: ${CONFIG.themes[theme].text};
            }
            #ai-search-sidebar .platform-item {
                display: flex;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.2s;
                border-left: 4px solid var(--platform-color);
                color: ${CONFIG.themes[theme].text};
                user-select: none;
            }
            #ai-search-sidebar .platform-item:hover {
                background: ${CONFIG.themes[theme].hover};
            }
            #ai-search-sidebar .platform-item.selected {
                background: ${CONFIG.themes[theme].button};
                color: ${CONFIG.themes[theme].background};
            }
            #ai-search-sidebar .platform-icon {
                margin-right: 10px;
                width: 20px;
                text-align: center;
                color: ${CONFIG.themes[theme].text};
            }
            #ai-search-sidebar .platform-icon i {
                color: ${CONFIG.themes[theme].text};
            }
            #ai-search-sidebar .platform-item.selected .platform-icon i {
                color: ${CONFIG.themes[theme].background};
            }
            #ai-search-sidebar .platform-item.core-platform {
                cursor: default;
            }
            #ai-search-sidebar .platform-item.core-platform .platform-icon i {
                color: ${CONFIG.themes[theme].button};
            }
            #ai-search-selection-preview {
                padding: 10px;
                margin: 10px 0;
                background: ${CONFIG.themes[theme].hover};
                border-radius: 5px;
                font-size: 14px;
                max-height: 100px;
                overflow: auto;
                white-space: pre-wrap;
                color: ${CONFIG.themes[theme].text};
            }
            #platform-form {
                display: none;
                flex-direction: column;
                gap: 10px;
                margin-top: 10px;
                padding: 10px;
                background: ${CONFIG.themes[theme].hover};
                border-radius: 5px;
            }
            #platform-form input {
                padding: 8px;
                border: 1px solid ${CONFIG.themes[theme].border};
                border-radius: 4px;
                color: ${CONFIG.themes[theme].text};
                background: ${CONFIG.themes[theme].background};
                width: 100%;
            }
            #platform-form button {
                padding: 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            #platform-form .save-btn {
                background: ${CONFIG.themes[theme].button};
                color: white;
            }
            #platform-form .cancel-btn {
                background: #dc3545;
                color: white;
            }
            .theme-toggle, .remove-platforms-btn {
                cursor: pointer;
                padding: 8px;
                margin: 5px 0;
                border-radius: 4px;
                background: ${CONFIG.themes[theme].button};
                color: white;
                text-align: center;
                font-weight: bold;
                border: none;
                width: 100%;
            }
            .theme-toggle:hover, .remove-platforms-btn:hover {
                opacity: 0.9;
            }
            #ai-search-sidebar .sidebar-content {
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 5px;
            }
            #ai-search-sidebar .sidebar-footer {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid ${CONFIG.themes[theme].border};
            }
            .error-message {
                color: #dc3545;
                font-size: 12px;
                margin-top: -5px;
                display: none;
            }
        `;
    }

    // Apply styles
    let styleElement = null;
    function applyStyles() {
        if (styleElement) styleElement.remove();
        styleElement = GM_addStyle(getCSSStyles());
    }
    applyStyles();

    // Register menu command
    GM_registerMenuCommand("Toggle AI Search Sidebar", () => {
        isEnabled = !isEnabled;
        GM_setValue('isEnabled', isEnabled);
        const sidebar = document.getElementById('ai-search-sidebar');
        if (sidebar) {
            sidebar.style.display = isEnabled ? 'flex' : 'none';
        } else if (isEnabled) {
            createSidebar();
        }
    }, "A");

    // Create sidebar
    function createSidebar() {
        if (document.getElementById('ai-search-sidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.id = 'ai-search-sidebar';

        // Header
        const header = document.createElement('div');
        header.className = 'header';
        
        const title = document.createElement('h3');
        title.textContent = I18N[lang].title;
        title.style.margin = '0';
        title.style.fontSize = '16px';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Close AI Search Sidebar');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isEnabled = false;
            GM_setValue('isEnabled', isEnabled);
            sidebar.style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        sidebar.appendChild(header);

        // Selection preview
        const selectionPreview = document.createElement('div');
        selectionPreview.id = 'ai-search-selection-preview';
        updateSelectionPreview(selectionPreview);
        sidebar.appendChild(selectionPreview);

        // Main content area
        const contentArea = document.createElement('div');
        contentArea.className = 'sidebar-content';

        // Theme toggle
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.textContent = theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
        themeToggle.onclick = () => {
            theme = theme === 'light' ? 'dark' : 'light';
            GM_setValue('theme', theme);
            themeToggle.textContent = theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
            applyStyles();
        };
        contentArea.appendChild(themeToggle);

        // Platform edit form
        const platformForm = document.createElement('div');
        platformForm.id = 'platform-form';
        platformForm.innerHTML = `
            <input type="text" id="platform-name" placeholder="${I18N[lang].platformName}" required>
            <div class="error-message" id="name-error">${I18N[lang].nameRequired}</div>
            <input type="url" id="platform-url" placeholder="${I18N[lang].platformUrl}" required>
            <div class="error-message" id="url-error">${I18N[lang].urlRequired}</div>
            <input type="text" id="platform-icon" placeholder="${I18N[lang].platformIcon}" value="fa-solid fa-robot" readonly>
            <input type="color" id="platform-color" value="#4a6fa5">
            <div style="display: flex; gap: 10px;">
                <button class="save-btn" type="submit">${I18N[lang].save}</button>
                <button class="cancel-btn" type="button">${I18N[lang].cancel}</button>
            </div>
        `;
        
        const saveBtn = platformForm.querySelector('.save-btn');
        const cancelBtn = platformForm.querySelector('.cancel-btn');
        const nameInput = platformForm.querySelector('#platform-name');
        const urlInput = platformForm.querySelector('#platform-url');
        const nameError = platformForm.querySelector('#name-error');
        const urlError = platformForm.querySelector('#url-error');
        
        // Form submission handler
        const handleFormSubmit = (e) => {
            e.preventDefault();
            
            // Reset error messages
            nameError.style.display = 'none';
            urlError.style.display = 'none';
            
            // Validate inputs
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                nameError.style.display = 'block';
                isValid = false;
            }
            
            if (!urlInput.value.trim()) {
                urlError.style.display = 'block';
                isValid = false;
            } else if (!urlInput.value.startsWith('https://')) {
                urlError.textContent = I18N[lang].invalidUrl;
                urlError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                savePlatform();
            }
        };
        
        platformForm.addEventListener('submit', handleFormSubmit);
        saveBtn.addEventListener('click', handleFormSubmit);
        
        cancelBtn.onclick = (e) => {
            e.preventDefault();
            platformForm.style.display = 'none';
            nameError.style.display = 'none';
            urlError.style.display = 'none';
        };
        
        contentArea.appendChild(platformForm);

        // Edit platforms button (shows the form)
        const editPlatformsBtn = document.createElement('button');
        editPlatformsBtn.className = 'theme-toggle';
        editPlatformsBtn.textContent = I18N[lang].editPlatforms;
        editPlatformsBtn.onclick = (e) => {
            e.preventDefault();
            platformForm.style.display = platformForm.style.display === 'none' ? 'flex' : 'none';
            if (platformForm.style.display === 'flex') {
                nameInput.value = '';
                urlInput.value = '';
                document.getElementById('platform-icon').value = 'fa-solid fa-robot';
                document.getElementById('platform-color').value = '#4a6fa5';
                nameInput.focus();
            }
        };
        contentArea.appendChild(editPlatformsBtn);

        // Remove all custom platforms button (only removes non-core platforms)
        const removePlatformsBtn = document.createElement('button');
        removePlatformsBtn.className = 'remove-platforms-btn';
        removePlatformsBtn.textContent = I18N[lang].removeAllPlatforms;
        removePlatformsBtn.onclick = (e) => {
            e.preventDefault();
            // Only remove non-core platforms
            const newPlatforms = {};
            Object.keys(platforms).forEach(key => {
                if (platforms[key].isCore) {
                    newPlatforms[key] = platforms[key];
                }
            });
            platforms = newPlatforms;
            GM_setValue('customPlatforms', platforms);
            GM_notification({ text: I18N[lang].platformsRemoved, title: I18N[lang].title });
            
            // Update the platform list
            updatePlatformList(contentArea);
        };
        contentArea.appendChild(removePlatformsBtn);

        // Platforms list
        updatePlatformList(contentArea);
        sidebar.appendChild(contentArea);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'sidebar-footer';
        sidebar.appendChild(footer);

        document.body.appendChild(sidebar);
    }

    function updatePlatformList(container) {
        // Clear existing platform list if it exists
        const existingList = container.querySelector('.platform-list');
        if (existingList) {
            container.removeChild(existingList);
        }

        const platformList = document.createElement('div');
        platformList.className = 'platform-list';
        platformList.style.overflowY = 'auto';
        platformList.style.flexGrow = '1';

        Object.entries(platforms).forEach(([name, platform]) => {
            const item = document.createElement('div');
            item.className = 'platform-item' + (platform.isCore ? ' core-platform' : '') + (selectedPlatform === name ? ' selected' : '');
            item.style.setProperty('--platform-color', platform.color || '#4a6fa5');
            item.innerHTML = `
                <span class="platform-icon"><i class="${platform.icon}"></i></span>
                <span>${name}</span>
            `;
            
            // Click handler - opens the platform immediately with selected text
            item.addEventListener('click', (e) => {
                e.preventDefault();
                selectedPlatform = name;
                updatePlatformList(container);
                
                const text = getSelectedText();
                if (text) {
                    let searchUrl = platform.url;
                    if (!searchUrl.includes('?q=')) {
                        searchUrl += searchUrl.includes('?') ? '&q=' : '?q=';
                    }
                    GM_openInTab(searchUrl + encodeURIComponent(text), { active: true });
                } else {
                    // Update preview but don't show error notification
                    const preview = document.getElementById('ai-search-selection-preview');
                    if (preview) {
                        preview.textContent = I18N[lang].noTextSelected;
                        preview.style.color = '#6c757d';
                    }
                }
            });
            
            platformList.appendChild(item);
        });

        // Insert platform list before the buttons
        const firstButton = container.querySelector('.remove-platforms-btn');
        if (firstButton) {
            container.insertBefore(platformList, firstButton);
        } else {
            container.appendChild(platformList);
        }
    }

    function updateSelectionPreview(element) {
        if (!element) return;
        const text = getSelectedText();
        selectedText = text;
        element.textContent = text || I18N[lang].noTextSelected;
        element.style.color = text ? CONFIG.themes[theme].text : '#6c757d';
    }

    function getSelectedText() {
        try {
            // First try to get text from selection
            const selection = window.getSelection();
            if (selection && selection.toString().trim()) {
                return selection.toString().trim();
            }
            
            // Then try form inputs
            const activeElement = document.activeElement;
            if (activeElement) {
                if ((activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') && 
                    activeElement.selectionStart !== activeElement.selectionEnd) {
                    return activeElement.value.substring(
                        activeElement.selectionStart, 
                        activeElement.selectionEnd
                    ).trim();
                }
                
                // Try contenteditable elements
                if (activeElement.isContentEditable) {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                        return sel.getRangeAt(0).toString().trim();
                    }
                }
            }
            
            return '';
        } catch (e) {
            console.error('Error getting selected text:', e);
            return '';
        }
    }

    function savePlatform() {
        const nameInput = document.getElementById('platform-name');
        const urlInput = document.getElementById('platform-url');
        const iconInput = document.getElementById('platform-icon');
        const colorInput = document.getElementById('platform-color');
        const form = document.getElementById('platform-form');
        
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const icon = iconInput.value.trim();
        const color = colorInput.value;

        try {
            // Add the new platform
            let finalUrl = url;
            if (!finalUrl.includes('?q=')) {
                finalUrl += finalUrl.includes('?') ? '&q=' : '?q=';
            }
            
            platforms[name] = { 
                url: finalUrl,
                icon: icon || 'fa-solid fa-robot',
                color: color,
                isCore: false
            };
            
            GM_setValue('customPlatforms', platforms);
            GM_notification({ 
                text: I18N[lang].platformSaved, 
                title: I18N[lang].title 
            });
            
            // Reset form
            nameInput.value = '';
            urlInput.value = '';
            colorInput.value = '#4a6fa5';
            form.style.display = 'none';
            
            // Update the platform list
            const contentArea = document.querySelector('#ai-search-sidebar .sidebar-content');
            if (contentArea) {
                updatePlatformList(contentArea);
            }
        } catch (e) {
            console.error('Error saving platform:', e);
            GM_notification({ 
                text: `${I18N[lang].platformError}: ${e.message}`, 
                title: I18N[lang].title 
            });
        }
    }

    // Initialize
    function init() {
        try {
            // Check if we're on a restricted page
            const url = window.location.href;
            if (url.includes('chrome://') || url.includes('moz-extension://') || 
                url.includes('about:') || url.includes('edge://')) {
                return;
            }

            // Check if the page is fully loaded
            if (document.readyState === 'complete') {
                if (isEnabled) createSidebar();
            } else {
                window.addEventListener('load', () => {
                    if (isEnabled) createSidebar();
                });
            }

            // Watch for text selection changes
            document.addEventListener('selectionchange', () => {
                const preview = document.getElementById('ai-search-selection-preview');
                if (preview) updateSelectionPreview(preview);
            });

            // Watch for clicks to update selection
            document.addEventListener('click', () => {
                setTimeout(() => {
                    const preview = document.getElementById('ai-search-selection-preview');
                    if (preview) updateSelectionPreview(preview);
                }, 100);
            });

            // Watch for key events to update selection
            document.addEventListener('keyup', () => {
                const preview = document.getElementById('ai-search-selection-preview');
                if (preview) updateSelectionPreview(preview);
            });

        } catch (e) {
            console.error('AI Search initialization error:', e);
        }
    }

    // Start the script
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        document.addEventListener('DOMContentLoaded', init);
    }
})();