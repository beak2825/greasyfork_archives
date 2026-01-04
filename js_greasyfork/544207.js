// ==UserScript==
// @name         Gray Swan Arena - Focus Mode
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  Clean UI with popup removal and focus mode for Gray Swan Arena with persistent state
// @author       KarthiDreamr
// @match        https://app.grayswan.ai/*
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @homepage     https://github.com/yourusername/grayswan-focus-mode
// @supportURL   https://github.com/yourusername/grayswan-focus-mode/issues
// @downloadURL https://update.greasyfork.org/scripts/544207/Gray%20Swan%20Arena%20-%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/544207/Gray%20Swan%20Arena%20-%20Focus%20Mode.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const CONFIG = {
        storageKey: 'gsa_focusMode',
        buttonPosition: { top: '14px', left: '14px' },
        animations: true,
        crossTabSync: true,
        autoApplyDelay: 100, // ms delay before applying clean mode
        popupCleanupInterval: 500, // ms interval for popup removal
        debugMode: false
    };

    // ========== UTILITY FUNCTIONS ==========
    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('[GSA Focus Mode]', ...args);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========== LOAD PERSISTED STATE ==========
    let isFocusMode = await GM.getValue(CONFIG.storageKey, false);
    log('Initial state loaded:', isFocusMode);

    // Apply focus mode immediately if saved (prevents flicker)
    if (isFocusMode) {
        setTimeout(() => {
            document.body.classList.add('gsa-focus-mode');
            log('Focus mode applied from storage');
        }, CONFIG.autoApplyDelay);
    }

    // ========== POPUP REMOVAL SYSTEM ==========
    function removePopupComponents() {
        /* =========================================================
           1.  REMOVE UI COMPONENT 1 - Success congratulations
           ---------------------------------------------------------*/
        document.querySelectorAll('p.mb-4.text-left.text-sm').forEach(p => {
            if (p.textContent.includes('Congratulations - you have successfully submitted a working break')) {
                const container = p.closest('div.flex.w-full.flex-col');
                if (container) {
                    container.remove();
                    log('Removed success congratulations popup');
                }
            }
        });

        /* =========================================================
           2.  REMOVE UI COMPONENT 2 - Prize dialog footer
           ---------------------------------------------------------*/
        document.querySelectorAll('div[data-slot="dialog-footer"]').forEach(footer => {
            const t = footer.textContent || '';
            if (t.includes('What prizes can I win?') && t.includes('Got it')) {
                footer.remove();
                log('Removed prize dialog footer');
            }
        });

        /* =========================================================
           3.  REMOVE UI COMPONENT 3 - Break failure dialog footer
           ---------------------------------------------------------*/
        document.querySelectorAll('div[data-slot="dialog-footer"]').forEach(footer => {
            const t = footer.textContent || '';
            if (t.includes('Why did my break fail?') && t.includes('Got it')) {
                footer.remove();
                log('Removed break failure dialog footer');
            }
        });

        /* =========================================================
           4.  REMOVE UI COMPONENT 4 - Dialog headers
           ---------------------------------------------------------*/
        document.querySelectorAll('div[data-slot="dialog-header"]').forEach(header => {
            const t = header.textContent || '';
            if (t.includes('Break Successful!') || t.includes('Break Rejected')) {
                header.remove();
                log('Removed dialog header');
            }
        });
    }

    // Start popup cleanup interval
    setInterval(removePopupComponents, CONFIG.popupCleanupInterval);
    log('Popup cleanup system started');

    // ========== ENHANCED CSS STYLES ==========
    GM_addStyle(`
        /* Hide header - but preserve lightbulb and its popup */
        .gsa-focus-mode .bg-background.fixed.top-0:not([aria-labelledby]):not([data-tooltip]):not([role="tooltip"]) {
            display: none !important;
        }

        /* Hide main sidebar - but NOT the documentation sidebar */
        .gsa-focus-mode #sidebar:not([aria-labelledby="behaviorDocDrawerTitle"]) {
            display: none !important;
        }

        .gsa-focus-mode .relative.hidden.h-full.md\\:block:not([aria-labelledby]) {
            display: none !important;
        }

        /* CRITICAL: Always show the lightbulb documentation sidebar */
        .gsa-focus-mode aside[aria-labelledby="behaviorDocDrawerTitle"],
        .gsa-focus-mode aside.fixed.top-0.right-0,
        .gsa-focus-mode aside.__web-inspector-hide-shortcut__ {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            z-index: 9999 !important;
        }

        /* EXCEPTION: Always preserve tooltip/popup/dropdown elements */
        .gsa-focus-mode [data-tooltip],
        .gsa-focus-mode [role="tooltip"],
        .gsa-focus-mode [data-popover],
        .gsa-focus-mode [data-dropdown],
        .gsa-focus-mode [data-slot="tooltip"],
        .gsa-focus-mode [data-slot="popover"],
        .gsa-focus-mode [data-slot="dropdown-menu"],
        .gsa-focus-mode .tooltip,
        .gsa-focus-mode .popover,
        .gsa-focus-mode .dropdown-menu {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }

        /* EXCEPTION: Lightbulb button and any trigger elements */
        .gsa-focus-mode button[data-tooltip-trigger],
        .gsa-focus-mode button:has(svg.lucide-lightbulb),
        .gsa-focus-mode [id*="bits-"]:not(#gsa-focus-toggle):not(#gsa-status-indicator) {
            display: flex !important;
            visibility: visible !important;
        }

        /* Hide breadcrumb navigation */
        .gsa-focus-mode nav[data-slot="breadcrumb"] {
            display: none !important;
        }

        /* Hide top tab navigation */
        .gsa-focus-mode .scrollbar-hide.-mb-1.flex.max-w-screen {
            display: none !important;
        }

        /* Hide mobile menu button */
        .gsa-focus-mode .md\\:hidden button[data-slot="sheet-trigger"] {
            display: none !important;
        }

        /* ENHANCED: Remove all padding and margins from main containers */
        .gsa-focus-mode .flex.flex-1.flex-col.overflow-hidden.pt-\\[4\\.5rem\\] {
            padding-top: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        .gsa-focus-mode .relative.mx-auto.flex.h-full.w-full.flex-1 {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
        }

        .gsa-focus-mode .flex.md\\:h-full.md\\:w-full.md\\:gap-4 {
            gap: 0 !important;
            padding: 0 !important;
        }

        /* ENHANCED: Make chat area completely full screen */
        .gsa-focus-mode .relative.flex.h-full.w-full.flex-col.gap-3 {
            max-width: none !important;
            margin: 0 !important;
            padding: 8px !important;
            gap: 8px !important;
        }

        /* ENHANCED: Remove padding from chat container */
        .gsa-focus-mode .dark\\:border-border.relative.flex.min-h-0.flex-1.flex-col.overflow-hidden {
            margin: 0 !important;
        }

        /* ENHANCED: Optimize chat content area spacing */
        .gsa-focus-mode .flex.h-full.min-h-0.flex-1.flex-col.overflow-auto {
            padding: 12px !important;
        }

        /* ENHANCED: Remove excessive margins from chat messages area */
        .gsa-focus-mode .mx-auto.flex.h-full.w-full.max-w-prose.flex-col.items-center.justify-center.space-y-2 {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ENHANCED: Optimize input area spacing */
        .gsa-focus-mode .relative.mx-auto.w-full.max-w-\\[75ch\\].shrink-0 {
            max-width: none !important;
            margin: 0 !important;
            padding: 8px !important;
        }

        /* ENHANCED: Remove body margins in focus mode */
        .gsa-focus-mode body {
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ENHANCED: Make main content container full height */
        .gsa-focus-mode .flex.min-h-screen.w-full.flex-col.overflow-hidden {
            min-height: 100vh !important;
        }

        /* ========== ENHANCED TOGGLE BUTTON STYLES ========== */
        #gsa-focus-toggle {
            position: fixed;
            top: ${CONFIG.buttonPosition.top};
            left: ${CONFIG.buttonPosition.left};
            z-index: 10000;
            background: #1a1a1a;
            color: #e5e5e5;
            border: 1px solid #333;
            border-radius: 20px;
            padding: 6px 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
            opacity: 0.8;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        #gsa-focus-toggle:hover {
            background: #2a2a2a;
            border-color: #555;
            opacity: 1;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        #gsa-focus-toggle.active {
            background: #1a1a1a;
            border-color: #30363d;
            color: #58a6ff;
        }

        #gsa-focus-toggle.active:hover {
            background: #2a2a2a;
            border-color: #58a6ff;
        }

        /* ========== STATUS INDICATOR ========== */
        #gsa-status-indicator {
            position: fixed;
            top: ${CONFIG.buttonPosition.top};
            left: calc(${CONFIG.buttonPosition.left} + 120px);
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-family: monospace;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            backdrop-filter: blur(4px);
        }

        #gsa-status-indicator.show {
            opacity: 1;
        }

        #gsa-status-indicator.success {
            background: rgba(34, 197, 94, 0.8);
        }

        #gsa-status-indicator.sync {
            background: rgba(59, 130, 246, 0.8);
        }

        /* ========== ANIMATIONS ========== */
        ${CONFIG.animations ? `
        .gsa-focus-mode {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gsa-focus-mode * {
            transition: all 0.2s ease;
        }
        ` : ''}

        /* ========== RESPONSIVE IMPROVEMENTS ========== */
        @media (max-width: 768px) {
            #gsa-focus-toggle {
                top: 10px;
                left: 10px;
                padding: 5px 10px;
                font-size: 11px;
            }

            #gsa-status-indicator {
                top: 10px;
                left: 100px;
            }
        }
    `);

    // ========== CORE FUNCTIONALITY ==========
    let toggleButton;
    let statusIndicator;
    let changeListener;

    // Create UI elements
    function createUI() {
        // Toggle button
        toggleButton = document.createElement('button');
        toggleButton.id = 'gsa-focus-toggle';
        updateButtonText();
        toggleButton.title = 'Toggle focus mode (F8 or Ctrl+Shift+F)';

        // Status indicator
        statusIndicator = document.createElement('div');
        statusIndicator.id = 'gsa-status-indicator';
        statusIndicator.textContent = 'Ready';

        document.body.appendChild(toggleButton);
        document.body.appendChild(statusIndicator);

        log('UI elements created');
    }

    // Update button text and state
    function updateButtonText() {
        if (!toggleButton) return;

        if (isFocusMode) {
            toggleButton.classList.add('active');
            toggleButton.innerHTML = '↩️ <span style="font-size: 10px;">Exit</span>';
        } else {
            toggleButton.classList.remove('active');
            toggleButton.innerHTML = '🎯 <span style="font-size: 10px;">Focus</span>';
        }
    }

    // Show status message
    function showStatus(message, type = 'success', duration = 2000) {
        if (!statusIndicator) {
            log('Status indicator not ready, skipping message:', message);
            return;
        }

        statusIndicator.textContent = message;
        statusIndicator.className = `show ${type}`;

        setTimeout(() => {
            if (statusIndicator) {
                statusIndicator.classList.remove('show');
                statusIndicator.classList.remove(type);
            }
        }, duration);
    }

    // Enhanced toggle function
    async function toggleFocusMode(source = 'manual') {
        const wasActive = isFocusMode;
        isFocusMode = document.body.classList.toggle('gsa-focus-mode');

        // Update UI
        updateButtonText();

        // Save state
        try {
            await GM.setValue(CONFIG.storageKey, isFocusMode);
            log(`Mode toggled to: ${isFocusMode ? 'ON' : 'OFF'} (source: ${source})`);

            if (source === 'manual') {
                showStatus(
                    isFocusMode ? 'Focus Mode ON' : 'Focus Mode OFF',
                    'success'
                );
            } else if (source === 'sync') {
                showStatus('Synced from other tab', 'sync', 1500);
            }
        } catch (error) {
            console.error('[GSA Focus Mode] Failed to save state:', error);
            showStatus('Save failed', 'error');
        }
    }

    // Debounced toggle for performance
    const debouncedToggle = debounce(toggleFocusMode, 100);

    // ========== CROSS-TAB SYNCHRONIZATION ==========
    function setupCrossTabSync() {
        if (!CONFIG.crossTabSync) return;

        changeListener = GM_addValueChangeListener(
            CONFIG.storageKey,
            (name, oldVal, newVal, remote) => {
                if (!remote) return; // Ignore changes from this tab

                log('Received remote state change:', newVal);
                isFocusMode = !!newVal;

                // Apply state change
                document.body.classList.toggle('gsa-focus-mode', isFocusMode);
                updateButtonText();

                // Show sync notification
                showStatus('Synced from other tab', 'sync', 1500);
            }
        );

        log('Cross-tab synchronization enabled');
    }

    // ========== KEYBOARD SHORTCUTS ==========
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // F8 shortcut
            if (e.key === 'F8') {
                e.preventDefault();
                debouncedToggle('keyboard');
                return;
            }

            // Ctrl+Shift+F shortcut
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                debouncedToggle('keyboard');
                return;
            }

            // Escape to exit focus mode
            if (e.key === 'Escape' && isFocusMode) {
                debouncedToggle('keyboard');
                return;
            }
        });

        log('Keyboard shortcuts registered: F8, Ctrl+Shift+F, Escape');
    }

    // ========== AUTO-DETECTION AND ADAPTATION ==========
    function adaptToPageChanges() {
        // Observer for dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && isFocusMode) {
                    // Re-apply focus mode classes if needed
                    setTimeout(() => {
                        if (!document.body.classList.contains('gsa-focus-mode')) {
                            document.body.classList.add('gsa-focus-mode');
                            log('Focus mode re-applied after DOM change');
                        }
                    }, 50);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('DOM observer started for dynamic content adaptation');
    }

    // ========== INITIALIZATION ==========
    function initialize() {
        createUI();
        setupCrossTabSync();
        setupKeyboardShortcuts();
        adaptToPageChanges();

        // Button click event
        toggleButton.addEventListener('click', () => debouncedToggle('manual'));

        // Apply saved state with proper timing
        if (isFocusMode) {
            updateButtonText();
            // Delay the status message to ensure UI is ready
            setTimeout(() => showStatus('Focus Mode restored', 'success', 1500), 100);
        }

        log('Script fully initialized');
        
        // Delay the loaded message to ensure statusIndicator is fully ready
        setTimeout(() => {
            showStatus('GSA Focus Mode loaded', 'success', 2000);
        }, 200);
    }


    // ========== CLEANUP ==========
    window.addEventListener('beforeunload', function() {
        if (changeListener && CONFIG.crossTabSync) {
            GM_removeValueChangeListener(changeListener);
            log('Cleanup completed');
        }
    });

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        setTimeout(initialize, 100);
    }

    // Fallback initialization
    window.addEventListener('load', function() {
        if (!toggleButton) {
            log('Fallback initialization triggered');
            initialize();
        }
    });

    log('Gray Swan Arena Focus Mode script loaded successfully');
})();
